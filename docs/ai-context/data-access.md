# Mate Data Access And API Integration Guide

Last updated: 2026-08-12

이 문서는 Mate 프론트엔드의 조회 데이터 접근, mock fixture 관리, 실제 백엔드 API 연결 규칙을 정의한다. API, mock, DTO, 목록·상세 데이터 모델을 변경하거나 새로운 백엔드 기반 페이지를 구현하기 전에 이 문서를 확인한다.

## 1. 목적

Mate는 백엔드 API 명세보다 프론트엔드 화면이 먼저 구현되었다. 따라서 화면이 `src/mocks`를 직접 참조하면 실제 API 연결 시 조회·변환·오류 처리가 여러 페이지와 컴포넌트에 흩어질 수 있다.

현재 데이터 접근 구조의 목적은 다음과 같다.

- Page와 Component가 mock 파일이나 실제 endpoint를 직접 알지 않게 한다.
- 프론트 화면이 필요로 하는 조회 입력·출력을 명시한다.
- 현재 mock 구현과 향후 HTTP 구현이 같은 조회 계약을 만족하게 한다.
- 실제 API DTO와 프론트 내부 모델의 차이를 한 경계에서 변환한다.
- 과도한 Repository, Factory, IoC 구조를 만들지 않는다.

`src/data`는 Mate 프론트엔드 내부의 가벼운 Data Access Layer다. Next.js Route Handler나 별도의 BFF를 의미하지 않으며, 백엔드 서버의 DAL과도 다른 개념이다.

## 2. 기본 흐름

```text
Server Page
→ src/data/<domain>/server.ts
→ Reader contract
→ 현재: mock-reader.ts
→ 향후: http-reader.ts → api-mapper.ts
→ 프론트 내부 모델
→ Client/UI Component props
```

규칙:

1. 조회는 기본적으로 Server Component에서 실행한다.
2. Client Component는 서버에서 받은 props와 사용자 상호작용을 담당한다.
3. `contracts.ts`는 서버와 클라이언트에서 공유할 수 있는 직렬화 가능한 타입만 제공한다.
4. `server.ts`는 `server-only` 경계로 보호하고, `mock-reader.ts`, 향후 `http-reader.ts`도 Client Component에서 import하지 않는다.
5. mock 구현도 실제 HTTP 구현과 같은 `Promise` 기반 계약을 사용한다.

브라우저 API가 필요하거나 매우 빈번한 polling이 필요한 데이터는 Client 조회가 더 적절할 수 있다. 이 경우 기존 원칙을 조용히 우회하지 말고 요구사항과 캐시·인증·로딩 정책을 먼저 정한다.

## 3. 폴더와 파일 책임

현재 구조:

```text
src/
  data/
    bids/
      contracts.ts
      mock-reader.ts
      server.ts
    qna/
      contracts.ts
      mock-reader.ts
      server.ts
  mocks/
    bids.ts
    qna.ts
  types/
    bid.ts
    qna.ts
```

### `contracts.ts`

프론트가 사용하는 조회 계약을 정의한다.

- 조회 query
- 조회 result
- 필터 선택지 등 부가 데이터
- Reader interface

이 타입은 실제 백엔드 JSON 모양을 예측하는 DTO가 아니다.

### `mock-reader.ts`

개발용 fixture를 조회 계약에 맞게 제공한다.

- mock 검색·필터
- mock pagination
- ID 조회
- 필터 선택지 구성

Mock 전용 표시 문자열 파싱과 fixture에 종속된 계산은 이 파일에 격리한다.

### `server.ts`

Server Page가 사용하는 안정적인 진입점이다.

```ts
const bidReader: BidReader = mockBidReader;

export function getBidList(query: BidListQuery) {
  return bidReader.getBidList(query);
}
```

현재는 mock Reader를 선택한다. 실제 API가 준비되면 이 진입점이 HTTP Reader를 사용하도록 변경한다.

Mock과 API를 동시에 선택해야 하는 실제 요구가 생기기 전에는 환경변수 Factory나 DI 컨테이너를 추가하지 않는다.

### `src/mocks`

개발 화면을 구성하는 fixture만 보관한다. Page와 Component에서 직접 import하지 않는다.

### `src/types`

프론트 화면과 데이터 계층이 공유하는 내부 모델을 보관한다. 실제 API DTO를 여기에 섞지 않는다.

## 4. 현재 도메인별 상태

### 입찰공고

`BidReader`는 다음 조회를 제공한다.

```ts
interface BidReader {
  getHomeBids(): Promise<readonly Bid[]>;
  getBidList(query: BidListQuery): Promise<BidListResult>;
  getBidDetail(bidId: string): Promise<Bid | null>;
  getFilterOptions(): Promise<BidFilterOptions>;
}
```

- 홈, 목록, 상세 Page는 `src/data/bids/server.ts`만 사용한다.
- 목록 Page가 URL query를 해석하고 조회한 결과를 `BidListClient`에 전달한다.
- mock 검색·필터·pagination은 `src/data/bids/mock-reader.ts`가 처리한다.
- 필터 UI는 전체 공고 배열이 아니라 `BidFilterOptions`를 받는다.
- `view`, `query`, `page`, `size`, 필터 값의 URL 계약은 기존 동작을 유지한다.
- 맞춤공고 인증은 아직 `localStorage` 기반 mock이다. 실제 사용자별 API 연결 전에 서버 세션·권한·캐시 정책을 별도로 설계해야 한다.

현재 `Bid`의 날짜 값은 `2026.06.20 11:00` 같은 표시형 문자열이다. 이번 리팩터링에서는 동작 보존을 위해 형식을 바꾸지 않았으며, 표시형 문자열 파싱은 mock Reader 내부에만 남겼다. 이를 실제 API 날짜 계약으로 간주하지 않는다.

### Q&A

`QnaReader`는 현재 다음 조회만 제공한다.

```ts
interface QnaReader {
  getQnaItems(): Promise<readonly QnaItem[]>;
}
```

- Q&A Page는 `src/data/qna/server.ts`를 사용한다.
- 현재 `QnaItem` 답변은 문단과 텍스트 segment, 선택적인 목록으로 구성한 프론트 내부 모델이다. Figma의 강조·밑줄·목록을 표현하기 위한 구조이며 실제 API DTO 형식으로 간주하지 않는다.
- 실제 API가 HTML, Markdown, rich text JSON, plain text 중 무엇을 반환하는지는 명세 확인 후 mapper와 렌더링·보안 정책을 별도로 정한다.
- pagination, 카테고리, 노출 상태, 정렬은 API 명세가 없으므로 추측하지 않았다.
- 관리자 생성·수정·삭제는 조회 Reader에 미리 추가하지 않는다.

### 알림

알림은 아직 `AlarmPageClient`가 `src/mocks/alarms.ts`를 직접 사용하며 읽음·삭제 상태도 브라우저 메모리에만 유지한다. 이번 작업 범위가 아니다.

향후 알림 API 작업에서는 다음 순서를 권장한다.

1. 조회 Reader와 초기 서버 조회를 먼저 분리한다.
2. 읽음·삭제 API 명세를 확인한다.
3. Mutation command, 실패 복구, optimistic update 여부를 별도로 설계한다.

## 5. Mock 관리 규칙

- fixture export 이름에는 `mock` 접두어를 사용한다.
- `src/mocks/<domain>.ts`는 해당 도메인의 `mock-reader.ts`에서만 import한다.
- Page, Component, 일반 `lib` 파일에서 `@/mocks/*`를 직접 import하지 않는다.
- mock fixture는 프론트 내부 모델을 만족해야 한다.
- 아직 모르는 백엔드 snake_case, wrapper, error DTO를 상상해 mock에 반영하지 않는다.
- 실제 API 변환 테스트가 필요해지면 내부 모델 fixture와 API DTO fixture를 구분한다.
- 빈 목록, 한 페이지 이하, 여러 페이지, 상세 없음처럼 화면 검증에 필요한 상태를 보존한다.
- mock Reader가 실제 API처럼 pagination된 결과를 반환하게 하고, Client Component에 전체 배열을 전달하지 않는다.

## 6. 실제 조회 API 연결 절차

백엔드 API 명세 또는 OpenAPI를 받은 뒤 도메인별로 다음 순서를 따른다.

### 6.1 계약 비교

먼저 다음을 확인한다.

- endpoint와 HTTP method
- 요청 query 이름과 enum 값
- page가 0부터인지 1부터인지
- 응답의 items, total count, page 정보
- nullable과 누락 가능한 필드
- 날짜 형식과 시간대
- 금액 타입과 단위
- 인증 방식과 권한 오류
- 공통 success/error wrapper
- 캐시 또는 실시간성 요구

현재 프론트 계약과 실제 제품 동작이 충돌하면 mapper로 억지로 숨기지 않는다. pagination UI, 필터 정책, 상세 필드 자체가 달라지는 경우에는 프론트 계약과 화면을 함께 재설계한다.

### 6.2 API DTO 정의

명세 그대로의 DTO를 별도 파일에 정의한다.

```text
src/data/bids/api-types.ts
```

가능하면 검증된 OpenAPI 생성 타입을 사용한다. 명세가 없는데 필드 이름이나 wrapper를 추측하지 않는다.

### 6.3 DTO mapper 작성

API DTO와 프론트 내부 모델이 다를 때만 mapper를 둔다.

```text
src/data/bids/api-mapper.ts
```

mapper가 담당할 수 있는 항목:

- snake_case와 camelCase
- 문자열 ID와 숫자 ID
- 문자열 금액과 숫자 금액
- 백엔드 enum과 프론트 enum
- nullable 기본 처리
- 날짜 원본 값 정규화

화면마다 같은 변환을 반복하지 않는다.

### 6.4 HTTP Reader 작성

```text
src/data/bids/http-reader.ts
```

HTTP Reader는 다음만 담당한다.

- 내부 query를 API 요청으로 변환
- 인증 정보를 포함한 서버측 `fetch`
- HTTP 상태와 API 오류 판별
- DTO mapper 호출
- 내부 result 반환

Server Component에서 자기 프로젝트의 Route Handler를 거쳐 같은 서버로 다시 요청하는 불필요한 왕복을 만들지 않는다. 별도 백엔드가 제공하는 외부 HTTP API는 서버에서 직접 호출한다.

### 6.5 Reader 교체

`server.ts`의 안정적인 함수 이름은 유지하고 구현체만 변경한다.

```ts
const bidReader: BidReader = httpBidReader;
```

화면에서 `if (useMock)` 같은 조건으로 데이터 공급원을 선택하지 않는다.

## 7. 날짜·금액·enum·nullable

### 날짜

- JSON에서 날짜는 일반적으로 문자열로 수신된다.
- 현재 표시형 mock 문자열을 실제 API 계약으로 사용하지 않는다.
- API 명세에서 ISO 8601, offset, UTC/KST 의미를 확인한다.
- 내부 모델을 ISO 문자열, timestamp, `Date` 중 무엇으로 둘지는 직렬화·계산·표시 요구를 확인한 뒤 결정한다.
- 최종 `YYYY.MM.DD` 표시는 formatter가 담당한다.
- Component에서 임의의 `replaceAll` 또는 `new Date` 파싱을 반복하지 않는다.

### 금액

- 숫자인지 문자열인지 확인한다.
- 원, 천원, 만원 단위를 확인한다.
- 큰 금액이 JavaScript safe integer 범위를 넘을 수 있는지 확인한다.
- 표시용 쉼표와 `원` 문자열은 데이터 원본에 포함하지 않는다.

### enum

- 백엔드 코드와 한글 라벨을 분리한다.
- 알 수 없는 enum을 조용히 기본값으로 바꿀지 오류로 처리할지 명세와 함께 결정한다.

### nullable

- `null`, 누락, 빈 문자열의 의미를 구분한다.
- 화면에서 필수인 필드가 API에서 nullable이면 fallback 문구 또는 오류 정책을 승인받는다.

## 8. 목록·홈·상세 모델 분리 기준

현재는 `Bid` 하나를 홈·목록·상세에서 함께 사용한다. 실제 API 연결 또는 상세 화면 확장 시 다음 기준을 적용한다.

- 목록 endpoint가 제공하지 않는 상세 필드를 `Bid`에 계속 추가하지 않는다.
- 상세 데이터가 별도 endpoint와 수명주기를 가지면 `BidDetail`을 만든다.
- 목록 응답이 더 작아져야 하면 `BidListItem`을 만든다.
- 홈 추천 카드의 계약이 달라지면 `HomeBid` 또는 카드 전용 view model을 검토한다.
- mapper 간 공유가 실제로 생기기 전에는 범용 base model을 만들지 않는다.

예시:

```ts
interface BidReader {
  getBidList(query: BidListQuery): Promise<BidListResult>;
  getBidDetail(bidId: string): Promise<BidDetail | null>;
}
```

## 9. Mutation 설계 원칙

조회 Reader를 만들었다고 생성·수정·삭제 DTO까지 미리 만들지 않는다.

사용자 행동이 확정되면 의미 수준의 command를 정의할 수 있다.

```ts
markAlarmAsRead(alarmId);
deleteAlarms(alarmIds);
```

그러나 다음은 API 명세와 제품 정책을 확인한 후 정한다.

- endpoint와 HTTP method
- request/response DTO
- 입력 validation
- 권한과 인증 만료
- 단건·일괄 처리
- 부분 성공
- 멱등성
- optimistic concurrency 또는 version
- optimistic update와 rollback
- 성공 후 refetch 또는 cache invalidation
- 오류 코드와 사용자 메시지

조회 전용 `Reader`와 변경 전용 `Writer`를 필요할 때 분리한다. 사용되지 않는 CRUD 메서드를 모든 도메인에 미리 추가하지 않는다.

인증은 일반 Mutation보다 보안 영향이 크므로 세션·쿠키·권한 경계를 포함한 별도 작업으로 진행한다.

## 10. 새 백엔드 기반 페이지 체크리스트

새 페이지나 기능을 구현할 때 다음을 확인한다.

- [ ] 정적 콘텐츠인지 백엔드 조회 데이터인지 확인했다.
- [ ] 화면이 필요로 하는 최소 내부 모델을 정의했다.
- [ ] `contracts.ts`에 실제로 필요한 Reader 메서드만 추가했다.
- [ ] mock fixture와 mock Reader를 분리했다.
- [ ] Page나 Component가 `@/mocks/*`를 직접 import하지 않는다.
- [ ] Server Page에서 조회하고 필요한 props만 Client Component에 전달한다.
- [ ] 로딩·오류·빈 상태를 구분했다.
- [ ] 목록이면 서버 pagination과 total count 계약을 확인했다.
- [ ] 필터 선택지의 공급원을 확인했다.
- [ ] 상세 모델을 목록 모델과 분리할 필요가 있는지 확인했다.
- [ ] 인증·권한·캐시·개인화 요구를 확인했다.
- [ ] 실제 API DTO를 추측하지 않았다.
- [ ] `pnpm lint`, `pnpm build`, 관련 브라우저 흐름을 검증했다.

## 11. 금지 패턴

- Component에서 `@/mocks/*` 직접 import
- Client Component에 전체 mock 배열을 전달해 서버 pagination을 흉내 내기
- 화면마다 API DTO를 별도로 변환
- 명세 전 API field, wrapper, error code 추측
- 상세 요구 때문에 목록 모델을 무제한 확장
- `server.ts`를 Client Component에서 import
- Mock/API 선택 조건을 UI에 작성
- 실제 사용처가 하나뿐인데 범용 Factory, IoC, base repository 추가
- mutation 실패를 무조건 성공 처리하고 로컬 상태만 변경

## 12. 문서 갱신 시점

다음 변경이 생기면 이 문서와 `architecture.md`를 함께 갱신한다.

- 새 도메인 Reader 추가
- mock Reader를 HTTP Reader로 교체
- API DTO/mapper 규칙 변경
- 목록·상세 모델 분리
- Client 조회 도입
- 캐시·인증·오류 표준 확정
- Writer 또는 Mutation 공통 규칙 확정

실제 API 연결 완료 여부는 `plan.md`에도 기록한다. 명세가 확정되지 않은 정책은 확인된 사실처럼 문서화하지 않는다.

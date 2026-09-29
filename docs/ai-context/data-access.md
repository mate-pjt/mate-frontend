# Mate Data Access And API Integration Guide

Last updated: 2026-09-28

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

계정별 개인 맞춤 필터는 쿠키·Bearer token이 필요한 브라우저 조회/변경이므로 `src/features/bid-notice-filters`에 둔다. 공개 목록의 Server Page/Reader는 URL에 수동 적용된 전체 개인 필터 값만 읽어 `GET /api/v1/bid-notices?view=ALL`에 전달한다. 로그인한 `ALL` 화면은 계정 필터를 브라우저에서 GET으로 읽어 버튼 상태를 보여주지만, 사용자가 ‘내 맞춤’을 누르기 전에는 목록에 자동 적용하거나 계정 값을 변경하지 않는다. 개인 필터 API의 `expectedVersion` 충돌은 자동 덮어쓰기 대신 최신값 재조회와 사용자 안내로 처리한다.

## 2. 기본 흐름

```text
Server Page
→ src/data/<domain>/server.ts
→ Reader contract
→ 공개 입찰 목록·홈 카드: http-reader.ts → api-mapper.ts
→ 공개 입찰 상세: detail-http-reader.ts → detail-api-mapper.ts
→ Q&A: mock-reader.ts
→ 프론트 내부 모델
→ Client/UI Component props
```

규칙:

1. 조회는 기본적으로 Server Component에서 실행한다.
2. Client Component는 서버에서 받은 props와 사용자 상호작용을 담당한다.
3. `contracts.ts`는 서버와 클라이언트에서 공유할 수 있는 직렬화 가능한 타입만 제공한다.
4. `server.ts`는 `server-only` 경계로 보호하고, `mock-reader.ts`, `http-reader.ts`도 Client Component에서 import하지 않는다.
5. mock 구현도 실제 HTTP 구현과 같은 `Promise` 기반 계약을 사용한다.

브라우저 API가 필요하거나 매우 빈번한 polling이 필요한 데이터는 Client 조회가 더 적절할 수 있다. 이 경우 기존 원칙을 조용히 우회하지 말고 요구사항과 캐시·인증·로딩 정책을 먼저 정한다.

## 3. 폴더와 파일 책임

현재 구조:

```text
src/
  data/
    bids/
      api-types.ts
      api-mapper.ts
      http-reader.ts
      detail-api-types.ts
      detail-api-mapper.ts
      detail-http-reader.ts
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
    bid-list.ts
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
export function getBidList(query: BidListQuery) {
  return httpBidListReader.getBidList(query);
}
```

공개 입찰 목록·홈 카드·필터 선택지·상세는 HTTP Reader를 선택한다. 홈은 `view=ALL`의 첫 페이지 9개 행을 조회한다. 맞춤공고는 로그인 후 준비 중 안내를 표시하며 목록 Reader를 호출하지 않는다.

조회별 공급원은 `server.ts`에서 명시적으로 선택한다. 환경변수 Factory나 DI 컨테이너를 추가하지 않는다.

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
  getFilterOptions(): Promise<BidFilterOptions>;
}

interface BidDetailReader {
  getBidDetail(query: BidDetailQuery): Promise<BidDetailPageData | null>;
}
```

- 홈, 목록, 상세 Page는 `src/data/bids/server.ts`만 사용한다. `BidReader.getHomeBids()`는 기존 fixture용 mock 계약으로 남아 있으며 운영 홈 조회에 사용하지 않는다.
- 목록 Page가 URL query를 해석하고 조회한 결과를 `BidListClient`에 전달한다.
- 공개 목록 검색·필터·pagination은 백엔드 API가 처리한다. mock 검색·필터 구현은 기존 fixture 범위에만 남아 있다.
- 필터 UI는 전체 공고 배열이 아니라 `BidFilterOptions`를 받는다.
- `view`, `query`, `page`, `size`, 지원하는 필터 값의 URL 계약은 기존 동작을 유지한다. API에 없는 옛 `agency` 단독 필터 URL은 그 값만 제거해 `/bids`로 정규화한다.
- `BidListItem`은 목록 응답에 맞춘 내부 모델이다. 공고 ID와 분류번호를 별도로 보관하고, 분류번호가 있으면 공고번호 아래에 표시한다. API `bidType`은 카드용 공사·용역·물품 종류로 변환한다. HTTP 응답의 공고기관명과 수요기관명은 별도 필드로 보존한다. 목록과 홈은 수요기관을 우선하고 없을 때 공고기관을 표시하며, 값 앞에 실제 기관 역할을 명시한다. HTTP 응답에서 두 기관이 모두 없으면 `—`를 표시한다. 기존 mock의 역할 미확인 `organization`은 mock Reader에서만 유지하고 역할을 추정하지 않는다. null 금액·낙찰값은 0이나 계산값으로 대체하지 않는다. 기관 역할의 의미는 [Mate 입찰공고 도메인 문서](https://github.com/mate-pjt/mate-docs/blob/main/docs/domain/bid/overview.md)를 따른다.
- `GET /api/v1/bid-notices`는 `view=ALL|CLOSING_SOON|RESULT`를 사용한다. URL/UI page는 1부터, API page는 0부터 센다. 지역·업종 표시 이름은 metadata API 코드로 변환하고, 날짜는 KST로 표시한다.
- 공개 목록과 필터 metadata는 Server Page에서 `cache: no-store`로 조회한다. 오류 시 mock fallback 없이 오류 안내와 재시도를 제공한다. 서버 간 조회라 공개 목록의 CORS는 브라우저 경로가 아니며, 서버의 API 네트워크 연결은 필요하다.
- 맞춤공고 진입의 인증 판단은 `AuthSessionProvider`의 실제 브라우저 세션을 사용한다. 로그인 후에는 준비 중 안내를 표시하며 실제 사용자별 추천/서버 캐시·권한 계약은 별도로 설계해야 한다.
- 검색어 입력·제출은 실제 목록 API에 연결한다. 실제 기록/API가 없는 기존 고정 ‘최근·추천 검색어’ 팝업은 표시하지 않는다.

기존 fixture의 `Bid` 날짜 값은 `2026.06.20 11:00` 같은 표시형 문자열로 남아 있다. 실제 목록·상세 API 날짜는 offset 포함 ISO 문자열이며 각 mapper가 KST 화면 문자열로 변환한다. Mock 표시형 문자열을 API 계약으로 간주하지 않는다. 홈 카드는 API 목록의 첫 9개 **행**을 그대로 표시하며, 같은 공고의 분류별 행은 합치지 않고 분류번호를 상세 URL에 보존한다. 빈 결과와 조회 실패는 홈 카드 영역 안에서만 안내하고 mock으로 대체하지 않는다.

### 공개 입찰공고 상세

- `/bids/[bidId]`는 backend 숫자 ID와 선택적 `bidClsfcNo`를 URL로 받아 공개 `GET /api/v1/bid-notices/{id}`를 서버에서 `cache: no-store`로 조회한다. 목록의 공고번호·공고명과 관련 공고 카드가 같은 상세 URL 계약을 사용한다.
- 상세 전용 내부 모델 `BidDetail`은 목록·홈 카드의 `BidListItem`과 분리한다. DTO는 `detail-api-types.ts`, 변환은 `detail-api-mapper.ts`, HTTP 호출은 `detail-http-reader.ts`에 둔다.
- 상세의 수요기관·공고기관 이름과 담당자 이메일은 역할별로 보존하고 표시한다. 공고기관 담당자 이름·전화·이메일을 수요기관 연락처로 대체하지 않는다. 기본정보의 기관 요약에는 우선 표시한 기관 역할을 함께 적는다. `orderingRegionName`은 발주기관 소재지이며 참가가능지역 필터와 구분한다.
- 첨부파일·같은 업종/품목 최근공고·개찰결과·물품 등록정보는 독립 공개 section API다. 본문 404와 서버 오류는 각각 404/오류 화면으로 구분하고, 독립 section 실패는 해당 section에만 표시한다. mock fallback은 없다.
- 개찰 결과 참여업체와 물품 품목은 서버에서 page 단위로 조회하며 UI page는 1부터, API page는 0부터 센다. 낙찰금액은 결과 API의 값만 사용한다.
- 첨부파일 본문은 backend 스트리밍 API의 `inline|attachment` URL을 브라우저 링크로 연다. PDF·이미지에만 미리보기 링크를 표시한다. 실제 브라우저 동작은 `docs/qa/bid-detail.md`에서 검증 대기다.
- Figma의 지시사항 본문·정정 이력 목록은 현재 공개 API에 대응 데이터가 없어 사용자 승인에 따라 임시 문구로 채우지 않는다.
- 계정별 공고 알림은 공개 상세 Reader에 섞지 않는다. `src/features/bid-notice-alerts/api.ts`의 브라우저 `GET|PUT|DELETE /api/v1/me/bid-notice-alerts/{bidNoticeId}`와 `BidDetailAlertCard`가 세션 Bearer token·refresh cookie로 상태를 읽고 변경한다. 분류번호와 관계없이 backend 공고 ID 기준이며 회사 인증은 필요하지 않다. 카드가 열린 상태의 서버 응답은 `cache: no-store`이고, 변경 전에는 서버 상태를 화면에 반영하지 않는다. 로그인 전에는 알림 API를 호출하지 않는다.
- `PUT`/`DELETE`는 서버가 `active`를 확정한 후 카드·토스트를 갱신한다. 실패 시 기존 상태를 유지한다. 실제 브라우저 API 결과와 알림 전달은 각각 `docs/qa/bid-alert.md` 및 후속 알림 기능 검증에서 확인한다.

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

### 알림 목록

`/alarms`는 로그인 상태에서 `src/features/notifications/api.ts`를 통해 `GET /api/v1/me/notifications?page=0&size=20&unreadOnly=false`를 브라우저에서 조회한다. `NotificationDto`를 `AlarmNotification` 화면 모델로 변환하고 서버 응답이 빈 목록이면 Figma 빈 상태를 표시한다. 다음 페이지는 `더 보기`로 20건씩 요청하며 중복 ID를 제거해 이어 붙인다. 인증 토큰과 401 후 갱신은 기존 `authorizedRequest`를 사용하고, 로그아웃 상태에서는 목록 API를 호출하지 않고 `/alarms` 복귀 경로가 포함된 로그인 안내를 표시한다.

- 헤더의 미확인 점은 `GET /api/v1/me/notifications/unread-count`가 0보다 클 때만 표시한다. 경로 이동 또는 읽음 처리 성공 후 건수를 다시 조회한다.
- 목록 항목의 읽음 표시는 `PATCH /api/v1/me/notifications/{notificationId}/read` 성공 응답 뒤에만 바꾼다. 실패하면 기존 항목을 유지하고 오류를 보여준다. 알림을 눌러도 목록에 머문다. 백엔드 `actionPath`와 프론트 라우트의 대응은 별도 작업으로 확정한다.
- `src/mocks/alarms.ts`는 과거 화면 fixture로 남아 있으나 현재 `/alarms`에서 import하지 않는다. 사용자별 받은 알림 삭제 API가 없어 편집·삭제는 비활성화했다. 공고별 알림 설정의 `DELETE /api/v1/me/bid-notice-alerts/{bidNoticeId}`는 구독 해제이며, 받은 알림 삭제 API가 아니다.

- TODO: 사용자별 알림 삭제 API와 삭제·숨김의 의미가 확정되면 편집·삭제를 실제 서버 mutation에 연결한다. 그전에는 mock 배열만 지워 성공을 표시하지 않는다.
- Figma에서 가려진 `7일 후 사라짐` 문구는 현재 정책으로 확정하지 않는다. 화면 안내와 자동 삭제 동작에서 제외하고, 보존 기간 정책이 확정되면 다시 검토한다.
- 실제 테스트 서버를 사용한 빈 목록·로그인 안내 결과와 데이터가 필요한 미실행 케이스는 `docs/qa/alarms.md`에서 구분한다.

### 맞춤 공고 이메일 설정

`/my/settings/notifications`는 `src/features/notification-settings/api.ts`의 브라우저 계정별 API를 사용한다. 로그인 후 `GET|PATCH /api/v1/me/notification-email-settings`로 실제 수신 주소를 읽고 선택하며, 대체 주소는 인증 시작·재전송·확인 POST를 거쳐야 저장·선택된다. 인증된 대체 주소는 가입 주소로 되돌린 뒤에도 보관된다. `GET|PATCH /api/v1/me/matched-bid-notice-email-settings`는 맞춤 공고 이메일 수신 여부를 별도로 읽고 변경한다. 기존 `AuthSessionProvider`의 Bearer token·refresh cookie 경계를 공유하며, 화면 컴포넌트는 API 경계에서 검증한 설정형만 사용하고 URL·응답 envelope를 직접 다루지 않는다. 변경 실패 시 기존 값을 유지하고 성공 응답 뒤에만 화면을 갱신한다. Figma의 실시간·야간 수신 문구보다 [Mate 알림 정책](https://github.com/mate-pjt/mate-docs/blob/main/docs/domain/notification/overview.md)의 매일 08:30 이메일, 공고별 내부 알림 분리, 야간 수신 옵션 없음 규칙을 적용한다. 실제 브라우저 결과와 남은 항목은 `docs/qa/notification-settings.md`와 `docs/qa/notification-email-recipient.md`에서 관리한다.

### 인증·회사 온보딩

- `src/features/auth/api.ts`는 테스트 API URL, 공통 응답·오류, cookie 포함 요청, Bearer token 및 401 이후 refresh 재시도를 담당한다.
- 테스트 서버에서 확인된 공통 성공 플래그는 `isSuccess`다. 공개 metadata·입찰 목록의 정상 응답과 인증 오류 응답에서 확인했으며, 목록·상세 Reader와 인증 API 경계는 이 필드로 판정한다. 현재 Swagger의 `success` 표기와 백엔드 저장소 직렬화 테스트는 불일치하므로 백엔드 확인 전까지 배포 서버의 실제 응답과 사용자 결정을 따른다.
- `src/features/auth/session.tsx`는 access token을 브라우저 메모리에만 보관하고 refresh cookie를 통한 복원을 담당한다. 토큰을 localStorage나 Server Component props로 내보내지 않는다.
- `src/features/auth/onboarding-api.ts`는 회사 검색/통합 요청, 초대 수락, 사업자번호 연결·미인증 회사 등록, 증명서 업로드·OCR polling·등록 제안·인증 회사 등록 호출을 담당한다.
- 인증/온보딩은 브라우저 OAuth 이동과 cookie, 파일 direct PUT, 사용자 입력 mutation이 필요하므로 `src/data/<domain>/server.ts → Reader` 조회 경계와 다른 Client 기능 경계를 사용한다. 다른 도메인에 이 예외를 일반화하지 않는다.
- 증명서 presigned URL과 서명 header는 업로드 순간에만 사용하며 로그·문서·로컬 저장소에 기록하지 않는다. OCR 중 새로고침 복원에는 계정별 `sessionStorage`에 문서/버전 UUID만 두고 서버 권한으로 상태를 다시 조회한다. 회사 등록/업로드의 idempotency key를 보낸다.
- 실제 브라우저 통합 테스트는 환경 준비 후 `docs/qa/auth.md`에 각 상태와 증거를 기록한다.

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
- 필요한 인증 정보를 포함한 서버측 `fetch` (현재 공개 목록은 인증 불필요)
- HTTP 상태와 API 오류 판별
- DTO mapper 호출
- 내부 result 반환

Server Component에서 자기 프로젝트의 Route Handler를 거쳐 같은 서버로 다시 요청하는 불필요한 왕복을 만들지 않는다. 별도 백엔드가 제공하는 외부 HTTP API는 서버에서 직접 호출한다.

### 6.5 Reader 교체

`server.ts`의 안정적인 함수 이름을 유지하고 해당 조회의 구현체만 변경한다.

```ts
export function getBidList(query: BidListQuery) {
  return httpBidListReader.getBidList(query);
}
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

공개 목록과 홈 카드는 `BidListItem`, 공개 상세는 `BidDetail`로 분리했다. 기존 mock fixture는 `Bid`를 유지한다. 이후 화면 확장 시 다음 기준을 적용한다.

- 목록 endpoint가 제공하지 않는 상세 필드를 홈 카드용 `BidListItem`에 임의로 추가하지 않는다.
- 상세 데이터는 별도 endpoint와 수명주기에 맞춰 `BidDetail`을 사용한다.
- 목록 응답에는 `BidListItem`만 전달하고 상세 전용 필드를 추가하지 않는다.
- 홈 추천 카드의 계약이 달라지면 `HomeBid` 또는 카드 전용 view model을 검토한다.
- mapper 간 공유가 실제로 생기기 전에는 범용 base model을 만들지 않는다.

예시:

```ts
interface BidReader {
  getBidList(query: BidListQuery): Promise<BidListResult>;
}
interface BidDetailReader {
  getBidDetail(query: BidDetailQuery): Promise<BidDetailPageData | null>;
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

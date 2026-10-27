# Mate Data Access And API Integration Guide

Last updated: 2026-09-30

API・mock・DTO・조회/변경 흐름을 설계하기 전에 이 문서를 읽는다. `src/data`는 프론트 데이터 접근 계층이며 Route Handler/BFF를 의미하지 않는다.

## 1. 책임과 의존 관계

```text
Server Page → data/<domain>/server.ts → Repository → HTTP + DTO/mapper 또는 불변 mock
Client 화면 → data/<domain>/client.ts → Repository → HTTP 또는 탭별 가변 mock
features/auth/session.tsx → 인증 Repository + 메모리 세션 controller
```

- 화면은 공개 `server.ts`/`client.ts`, `contracts.ts`와 내부 모델만 사용한다. endpoint, concrete HTTP/mock, DTO, fixture를 import하지 않는다.
- Repository는 인터페이스와 함수/객체로 구현한다. 필요한 HTTP 클라이언트, 인증 접근 포트, Clock, 저장소를 factory에 주입한다. 범용 BaseRepository, 상속, DI 컨테이너는 두지 않는다.
- 입력/결과 계약에는 현재 구현된 행동만 둔다. 미래 CRUD나 추측한 endpoint/DTO를 추가하지 않는다.
- HTTP 응답과 내부 모델이 다를 때만 mapper를 만든다. 의미가 다른 가입 신청 결과와 나의 회사 신청 결과는 `MembershipRequest` / `MyMembershipRequest`로 구분한다.
- `src/features`에는 세션 관리 및 개인 필터 URL 모델처럼 화면 행동을 조합하는 로직을 둔다. 기존 feature별 `api.ts` 호환 파일은 제거했다.
- 공개 입찰 조회는 서버에서 실행한다. 인증·계정별 변경·회사 polling·direct PUT은 브라우저에서 실행한다. 서버에 사용자별 가변 mock 상태를 두지 않는다.

## 2. 실제 폴더

```text
src/data/
  config.ts                         # 빌드 snapshot·프로필·조합·환경 검증
  shared/{errors,http,client}.ts     # 오류, 주입 가능한 HTTP, 브라우저 HTTP 진입
  mock/{store,runtime,validation}.ts # 탭 저장소·Clock·계정 접근·검증
  auth/{contracts,http-repository,mock-repository,client,session-controller}.ts
  bids/{contracts,http-repository,detail-http-repository,mock-repository,server}.ts
       {api-types,api-mapper,detail-api-types,detail-api-mapper}.ts
  company/{contracts,api-types,http-repository,mock-repository,client}.ts
  notifications/{contracts,http-repository,mock-repository,client}.ts
  bid-alerts/{contracts,http-repository,mock-repository,client}.ts
  personal-filters/{contracts,http-repository,mock-repository,client}.ts
  notification-settings/{contracts,http-repository,mock-repository,client}.ts
  qna/{contracts,content,static-repository,server}.ts
```

파일을 이름만 맞추려고 만들지 않는다. HTTP 구현에만 필요한 wire 타입은 그 구현 파일 안에 둘 수 있다. URL/서명 header를 포함하는 `DocumentUploadDto`는 `company/api-types.ts`의 비공개 경계이고 내부 `DocumentUpload`에는 업로드 핸들만 있다. 개인 필터 enum은 `personal-filters/contracts.ts`에 정의하며 입찰 DTO를 참조하지 않는다.

## 3. 공급원 전환 단위

| 설정 키 | 함께 전환하는 기능 | 공개 진입점 |
| --- | --- | --- |
| `auth` | 로그인 시작, 가입, 완료, 복원, 로그아웃 | `auth/client.ts` |
| `bids` | 홈, 목록/metadata, 상세/첨부/관련/개찰/물품/참여업체 | `bids/server.ts` |
| `company` | 회사·업종 검색, 소속 신청/초대, 사업자번호, 증명서, 등록, 나의 회사 | `company/client.ts` |
| `notifications` | 받은 알림 목록, 미확인 건수, 읽음 | `notifications/client.ts` |
| `bidAlerts` | 공고별 알림 조회/설정/해제 | `bid-alerts/client.ts` |
| `personalFilters` | 개인 필터 조회/저장/초기화 | `personal-filters/client.ts` |
| `notificationSettings` | 수신 주소, 이메일 인증/재전송/확인, 맞춤 이메일 ON/OFF | `notification-settings/client.ts` |

회사 계약은 Directory/Onboarding/Document 포트로 나누고 한 factory가 같은 공급원의 포트를 조합한다. 이메일 주소와 ON/OFF도 같은 공급원을 선택하지만 기존 endpoint별 성공/오류 처리는 독립적이다. Q&A는 현재 endpoint가 없는 `static` 콘텐츠이며 api 프로필에서도 static이다.

## 4. 빌드 설정과 운영 guard

- `MATE_DATA_PROFILE`: `api`(기본), `mock`(7개 모두), `hybrid`(API 기본 + overrides).
- `MATE_DATA_OVERRIDES`: hybrid에서만 사용하는 JSON 객체. 알려진 7개 키와 `api`/`mock`만 허용한다.
- `MATE_MOCK_SCENARIOS`: mock으로 선택한 그룹의 명시적 시나리오 JSON 객체. 이름 목록은 `config.ts`의 `mockScenarios`가 기준이다. 오타·API 그룹 시나리오는 설정 오류다.
- `next.config.ts`가 설정을 한 번 해석해 비밀값 없는 `NEXT_PUBLIC_MATE_DATA_CONFIG` snapshot을 서버/브라우저에 함께 넣는다. 이 값은 직접 설정하지 않는다. Repository는 raw 환경변수를 다시 해석하지 않는다.
- `NEXT_PUBLIC_MATE_API_BASE_URL`도 snapshot에 들어간다. Next.js 공개 환경변수는 빌드에 고정된다. dev는 변경 후 재시작, build/start/Preview는 재빌드한다. [Next.js 환경변수](https://nextjs.org/docs/app/guides/environment-variables).
- Vercel에서는 `VERCEL_ENV`가 우선이다. 다른 환경은 `MATE_APP_ENV=local|preview|production`을 명시한다. `next dev`의 미지정은 local이고, 미지정 배포 실행은 production이다.
- production의 mock 빌드는 설정 단계에서 실패한다. `src/instrumentation.ts`는 시작 시 현재 환경과 빌드 snapshot의 모순도 검사해 mock Preview 결과물을 production으로 실행하지 못하게 한다. 시작 검사는 공급원을 재선택하지 않는다.
- API 실패는 기존 오류·재시도 화면으로 전달한다. 자동 mock fallback은 없다.
- 개발 표시 `MockStatus`는 활성 mock 그룹과 초기화 기능만 제공한다. 화면에서 공급원을 선택하지 않는다.

### 혼합 제약

1. 계정별 그룹을 API로 쓰려면 `auth=api`가 필요하다. `auth=mock` + 공개 `bids=api`는 가능하다.
2. `bidAlerts=api`와 `personalFilters=api`는 `bids=api`도 필요하다. 합성 공고 ID/필터 코드가 실제 변경 요청으로 전송되는 조합을 막는다.
3. `auth=api` + 회사/알림/설정 mock은 지원한다. mock은 실제 access token을 요청하지 않고 계정 식별키만 사용한다.
4. 업종 검색은 company 공급원을 따른다. `company=api,bids=mock`에서 입찰 mock 선택지로 회사 등록을 하지 않는다.
5. 다른 공급원의 도메인에는 후속 효과를 자동 동기화하지 않는다. mock 회사 등록은 실제 서버의 회사나 인증 응답을 바꾸지 않는다.

## 5. HTTP·인증 계약

- 성공 wrapper는 배포 서버에서 확인한 `isSuccess`다. Swagger의 `success` 불일치는 백엔드 확인 사항이다. HTTP 대역 테스트도 wire wrapper를 사용한다.
- `ApiError`의 `status`, `code`, 사용자 안내를 보존한다. 잘못된 JSON/wrapper, 필수 data 누락, HTTP 오류와 연결 실패를 구분하고 AbortError는 전달한다.
- 보호 요청은 `credentials: include`, `cache: no-store`, Bearer token 및 필요 시 `Idempotency-Key`를 사용한다. 401에서 세션을 갱신해 한 번 재요청한다. 공개 입찰은 기존 Accept/`no-store` 정책을 유지한다.
- `AuthAccess`는 토큰 접근·세션 갱신·현재 계정 식별키를 제공한다. 요청 도중 계정이 바뀌면 이전 계정의 재시도를 막는다.
- 실제 인증은 서버 중심 OAuth/OIDC다. 브라우저 origin을 `returnOrigin`, 검증한 내부 복귀 경로를 `returnTo`로 전달한다. callback/signup에 `flowId`가 없으면 인증 완료 요청을 하지 않는다. GIS 방식으로 변경하지 않는다.
- `AuthSessionProvider`와 `session-controller.ts`는 메모리 access token, 같은 계정 epoch의 refresh 공유, 만료 전 갱신, 로그아웃 epoch와 늦은 응답 방어를 담당한다. 계정 교체 후에는 이전 refresh flight를 공유하지 않는다. 실제 토큰을 session/localStorage나 서버 props에 저장하지 않는다.
- 회사 변경 후 API 구현이 세션을 갱신한다. 변경 성공 뒤 갱신만 실패하면 `sessionWarning`을 반환해 성공을 유지한다. 이 갱신의 일시적 네트워크 실패는 기존 인증 세션을 유지하며, 401/403 처리는 유지한다.
- mock 인증은 초기 비로그인, 두 기존 가상 계정 및 신규 가입을 지원한다. 같은 callback/signup·복귀 경로 검증을 사용하고 외부 OAuth/API로 이동하지 않는다.
- 전체 mock의 보호 요청은 가상 token 만료 시 로컬 refresh를 수행한다. 가상 세션이 만료되면 변경을 거부한다. auth API와 업무 mock의 혼합에서는 실제 token/refresh를 추가 요청하지 않는다.

## 6. 가변 mock 상태

- 브라우저 `sessionStorage`, 테스트용 메모리 저장소를 사용한다. namespace는 스키마 버전·설정 fingerprint·API 환경·인증 공급원·계정 식별키를 포함한다.
- 화면 이동·같은 탭 새로고침에서 변경을 복원한다. 계정·프로필·환경이 다르면 상태를 섞지 않는다. 로그아웃은 해당 가상 세션만 해제하며 계정의 업무 상태와 유효한 초대 문맥을 보존한다.
- 로그인/가입 flow와 초대는 별도 anonymous 탭 공간에 둔다. 실제 OAuth/초대 token은 저장하지 않는다. mock 세션도 합성 계정 ID/만료 시각만 저장하며 가상 access token은 응답 시 만든다.
- 실제 API 응답·토큰·쿠키·presigned URL·서명 header·파일 원본을 mock 저장소에 복사하지 않는다. 기본 fixture는 합성 데이터다.
- 손상 또는 잘못된 스키마는 해당 공간만 초기화한다. 저장소 차단/용량 초과 시 메모리로 동작하고 개발 표시에서 새로고침 유지 불가를 알린다. 다른 키를 `clear()`하지 않는다.
- 서버 공개 mock은 요청별 불변 합성 데이터다. 사용자별 mutable state를 서버 global로 두지 않는다.
- 실행 중 Clock은 실제 시각이며 테스트에서 가짜 Clock을 주입한다. 지연·실패는 명시적 시나리오이고 무작위 실패가 없다.

### 현재 도메인 동작

- 입찰: 유효한 숫자 ID·분류번호·별도 코드/라벨, 검색/필터/페이지, 금액/날짜/nullable, 부분 실패, 로컬 첨부, 개찰 참여업체·물품 페이지. 홈은 동일 목록의 첫 9개 행이다. 과거 `Bid[]` 계약/fixture는 제거했다.
- 받은 알림: 25건(첫 20건/다음 5건), 읽음과 미확인 건수 공유, 빈/오류 시나리오. 구독은 계정·공고별 설정/해제/복원.
- 개인 필터: 전체 내부 모델 저장/URL 왕복, expectedVersion 충돌과 초기화. 화면은 사용자가 ‘내 맞춤’을 누를 때만 목록에 수동 적용한다.
- 이메일: 인증번호 `1234`, 인증 만료·재전송 대기·오류 횟수, 인증 후 수신 주소, 독립 ON/OFF 유지. 실제 메일은 발송하지 않는다.
- 회사: empty/connected/pending/terminated/approved-stale/denied, 검색·신청, 초대 수락/거절/계정 불일치, 사업자번호 처리·등록, 문서 processing/failure/retry/replacement/proposal/registration과 나의 회사 상태 공유.

## 7. 회사와 업로드의 경계

화면은 `getMyCompanyOverview()`를 사용한다. API 구현은 기존 refresh → companyContext에 해당하는 기본 profile 또는 내 소속 신청을 조회한다. `404/CR001`만 신청 없음이고 403은 권한 오류다. APPROVED지만 아직 연결되지 않은 상태를 보존한다. mock은 회사 상태를 조회하고 실제 인증 응답을 덮어쓰지 않는다.

- 등록/초대 수락 후 API 구현은 refresh, mock 구현은 mock 회사 상태를 갱신한다. 화면이 직접 post-mutation refresh를 호출하지 않는다.
- HTTP 업로드는 SHA-256·파일 metadata·멱등성 키로 업로드 세션을 만들고, 내부 descriptor의 method/header/URL로 `PUT`(credentials omit)한다. 화면에는 document/version ID와 opaque uploadHandle만 반환한다.
- mock 업로드는 외부 전송 없이 상태만 변경한다. 완료 → processing → 등록 제안 또는 실패, 재시도, 버전 충돌을 지원한다.
- 실제 문서 복원에는 기존 `mate:signup-document:<account>` 키의 UUID만 보존한다. mock 문서 복원은 mock namespace를 사용하며 실제 처리 중 키를 읽거나 삭제하지 않는다.
- 파일별 idempotency key를 유지하고, 다른 payload의 동일 키는 mock에서 409다. 실제 서버의 mutation 성공을 refresh 실패 때문에 다시 제출하지 않는다.
- 등록 화면의 `AccountScope`는 다른 인증 계정으로 바뀌면 파일·connection·proposal 등 화면의 임시 상태를 새로 만든다. 완료 후 세션 만료만 발생한 경우에는 성공 결과와 경고를 유지한다.

## 8. 유지하는 제품/API 정책

- 맞춤공고 목록, 받은 알림 편집·삭제, import-company/직접 범위 편집, 회사 시공능력·인증 직접 수정 등의 ‘준비 중’ 기능을 이 리팩터링으로 활성화하지 않는다.
- 받은 알림 읽음은 성공 응답 뒤에만 반영한다. 구독 해제는 받은 알림 삭제와 다르다. 7일 보존·actionPath 이동·카카오톡/SMS는 미확정/미구현 정책을 유지한다.
- 공개 목록의 UI page는 1부터, API page는 0부터다. 조회 metadata에서 코드/라벨을 변환하고 KST를 표시한다. 기관 역할·nullable 금액과 결과 값을 그대로 구분한다.
- 공개 상세 본문 404와 section 실패는 별도다. 실제 첨부는 backend 스트리밍 URL이고 mock 첨부는 `/mock/bid-attachment.txt`다. 명세 없는 정정 이력·지시사항을 만들지 않는다.
- 수신 주소와 맞춤 이메일 ON/OFF endpoint는 독립적이다. 매일 08:30 이메일·공고별 서비스 내부 알림·야간 옵션 없음의 기존 정책을 유지한다.
- 가입 약관은 현재 개발용 임시 본문/버전이다. 정식 약관 도입·기존 동의 처리 정책은 별도 결정 사항이다.

## 9. 새 기능의 개발 순서와 검증

1. 현재 필요한 내부 입력/출력·Repository 계약 정의.
2. mock으로 정상/빈/오류/변경/복원 화면 개발.
3. 확인된 백엔드 계약으로 DTO·HTTP 구현과 필요한 mapper 추가.
4. 동일 계약 테스트, 실제 API 통합 검증.
5. 해당 기능 묶음을 api로 선택해 재빌드.

`pnpm test`는 Vitest 4.1.11/Node 환경이다. jsdom/MSW 없이 Clock/Storage/fetch를 주입한다. HTTP 대역의 wire 계약 검증과 실제 서버 통합은 따로 기록한다. `tests/architecture.test.ts`는 화면의 직접 HTTP/mock/DTO import와 클라이언트의 server-only 유입을 검사한다.

기본 Gate는 `pnpm test`, `pnpm lint`, 프로필별 `pnpm build`, `git diff --check`다. 공유 모델/Storybook 영향 시 `pnpm build-storybook`도 실행한다. 비동기 Server Component는 실제 Next.js 실행에서 확인한다. 전체 mock의 서버·브라우저 외부 요청 0건, hybrid의 공급원 경계, static 페이지 → dynamic 페이지/새로고침, 운영 artifact 승격 차단을 브라우저/실행 검증으로 확인한다.

실제 서버 가입·회사 등록·초대·메일·설정 변경은 계정과 변경/복구 범위를 정해 별도 승인받는다. 기존 QA 대기 항목을 mock 성공으로 통과 처리하지 않는다. 사용법은 [Repository 개발 가이드](../development/repositories.md), 증거와 미실행 범위는 [Repository QA](../qa/repositories.md)를 따른다.

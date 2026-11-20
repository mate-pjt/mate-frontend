# Mate Data Access And API Integration Guide

Last updated: 2026-11-20

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
  company/{contracts,api-types,api-mapper,http-repository,mock-repository,client}.ts
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
| `company` | 회사·업종 검색, 소속 신청/초대, 사업자번호, 증명서, 등록, 나의 회사, 회사 간 통합 사건 | `company/client.ts` |
| `notifications` | 받은 알림 목록, 미확인 건수, 읽음 | `notifications/client.ts` |
| `bidAlerts` | 공고별 알림 조회/설정/해제 | `bid-alerts/client.ts` |
| `personalFilters` | 개인 필터 조회/저장/초기화 | `personal-filters/client.ts` |
| `notificationSettings` | 수신 주소, 이메일 인증/재전송/확인, 맞춤 이메일 ON/OFF | `notification-settings/client.ts` |

회사 계약은 Directory/Onboarding/Document/Team/Merge 포트로 나누고 한 factory가 같은 공급원의 포트를 조합한다. 이메일 주소와 ON/OFF도 같은 공급원을 선택하지만 기존 endpoint별 성공/오류 처리는 독립적이다. Q&A는 현재 endpoint가 없는 `static` 콘텐츠이며 api 프로필에서도 static이다.

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
- `/my/settings/account`는 현재 세션의 `account.email`만 표시한다. 로그아웃 시작·종료에서 발행하는 계정 키를 구독해 주소를 가리고, 기존 access token 유효 시간이 지나면 주소를 내린 뒤 명시 세션 복원을 제공한다. 화면은 이메일 결측과 잘못된 값을 구분하며 주소를 별도 상태·URL·저장소에 복사하지 않는다. 알림 수신처·가입 후보는 각 Repository의 값이다. [DEV-38](../development/figma-v01/tasks/DEV-38.md#dev-38-brief)
- 회사 변경 후 API 구현이 세션을 갱신한다. 변경 성공 뒤 갱신만 실패하면 `sessionWarning`을 반환해 성공을 유지한다. 이 갱신의 일시적 네트워크 실패는 기존 인증 세션을 유지하며, 401/403 처리는 유지한다.
- 초대 수락은 현재 토큰으로 POST를 한 번 발행하고 응답 401의 자동 재전송을 사용하지 않는다. 양의 안전 정수인 회사·소속 ID를 검증한다. 유실/손상 응답과 이미 소모된 문맥일 수 있는 `CI005/CI012`는 결과 미확정이다. 후속 확인은 동일 company 공급원의 현재 회사와 `memberships/me`를 읽는다. 실제 서버에서의 수락과 갱신은 별도 QA다. [DEV-33](../development/figma-v01/tasks/DEV-33.md#dev-33-verification)
- 회사 통합의 `GET …/merge-cases/current`만 opt-in HTTP 204를 빈 값으로 받는다. 활성 소속과 leaf를 확인해 열람 가능한 사건 없음과 열람 범위 미확인을 구분한다. 공개 모델은 회사 쌍, 상태, 기한·개시 근거와 G01 행동만 복사한다. `request`·`proposals`·`proposal-responses`는 같은 회사·사건의 최신 revision과 필요한 leaf/capability로 제출하며 401 자동 재전송을 사용하지 않는다. 충돌/결과 미확정 뒤에는 동일 사건 상세를 읽는다. [DEV-34](../development/figma-v01/tasks/DEV-34.md#dev-34-verification)
- mock 인증은 초기 비로그인, 두 기존 가상 계정 및 신규 가입을 지원한다. 같은 callback/signup·복귀 경로 검증을 사용하고 외부 OAuth/API로 이동하지 않는다.
- 인증 내부 `account.nickname`은 `string|null`이다. HTTP 경계는 로그인 완료·가입·refresh의 값을 보존하고, 구형 응답의 누락만 null로 정규화하며 잘못된 타입은 오류로 남긴다. 이메일·회사명·suggestedName으로 이름을 합성하지 않는다. mock 기존 두 계정은 고정 합성 이름을 제공하며 신규 가입 이름은 Repository 메모리에만 유지한다. 새 Repository/새로고침 뒤 신규 계정 이름은 null이고 탭 저장소에 가입 입력을 보존하지 않는다. [DEV-57](../development/figma-v01/tasks/DEV-57.md#dev-57-brief)의 로컬 mock/HTTP 대역 검증과 실제 nickname 통합 미실행을 구분한다.
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

- 입찰: 유효한 숫자 ID·분류번호·별도 코드/라벨, 검색/필터/페이지, 금액/날짜/nullable, 부분 실패, 로컬 첨부, 개찰 참여업체·물품 페이지. 홈은 동일 목록의 첫 9개 행이다. 관련 mock은 [POL-30 v1](../development/figma-v01/tasks/POL-30.md#pol-30-contract)의 정확 공식 코드/우선순위·기준/후보 상태·실제 target 분류·게시일 정렬·추정가격+VAT를 적용한다. 공개 server는 프로세스 시작 시 생성한 불변 fixture를 요청별 Repository에 복사하고 조회 Clock만 전진시킨다. [DEV-61 검증](../development/figma-v01/tasks/DEV-61.md#dev-61-verification)은 로컬 mock/HTTP 대역이며 실제 QA-03의 차단을 해소하지 않는다. 과거 `Bid[]` 계약/fixture는 제거했다.
- 받은 알림: 25건(첫 20건/다음 5건), 읽음과 미확인 건수 공유, 빈/오류 시나리오. 합성 공고/분류·현재 계정 회사·목적지 없는 알림을 제공한다. HTTP와 mock 복원 경계는 actionPath를 허용 경로 또는 null로 전달하며 이전 탭 snapshot의 누락/위험 경로만 null로 보완해 읽음 이력을 유지한다. 구독은 계정·공고별 설정/해제/복원.
- 개인 필터 Repository는 전체 내부 모델 저장/URL 왕복, expectedVersion 충돌과 초기화 계약을 유지한다. 명시적 reset은 회사 가져오기 가능 여부를 보존한 빈 `SAVED`를 남겨 회사 기본값 자동 재적용을 막는다. 첫 저장 version1·조건 변경 시 증가하며 이미 빈 `SAVED`의 reset replay는 version을 유지한다. [DEV-63 검증](../development/figma-v01/tasks/DEV-63.md#dev-63-verification)은 mock/HTTP 대역/실제 Next 결과이며 실제 API QA-10 차단은 별도다. 현재 목록 화면은 [DEV-09 후속 사용자 교정](../development/figma-v01/tasks/DEV-09.md#dev-09-ui-cleanup-brief)에 따라 계정 저장/계정 초기화·통상 저장/성공/빈 조건 안내를 제공하지 않는다. ‘내 맞춤’ 클릭마다 공개 client의 최신 GET snapshot/filter를 받아 목록에 수동 적용하며 초기 표시 snapshot을 적용값으로 재사용하지 않는다. 일반/personal URL의 전체 조건을 canonical 비교하고 query/page/size는 제외한다. 중복 조회를 막고 탐색 의도/계정/URL/화면 종료에서 늦은 응답을 폐기한다. 최신 빈 조건은 안내 없이 현재 목록을 유지하고 조회 실패는 오류를 안내하며 다음 명시 클릭으로 재시도한다. 이 화면에서 계정 PUT/reset은 호출하지 않으며 기존 서버의 SAVED→COMPANY_DEFAULT→EMPTY_DEFAULT 계약·계정 데이터는 변경하지 않는다. 회사 전용 조회로의 전환은 별도 정책/계약 확인 대상이다.
- 이메일: 인증번호 `1234`, 인증 만료·재전송 대기·오류 횟수, 인증 후 수신 주소, 독립 ON/OFF 유지. 실제 메일은 발송하지 않는다.
- 회사: empty/connected/pending/terminated/approved-stale/denied, 검색·신청, 초대 수락/거절/계정 불일치, 사업자번호 처리·등록, 문서 processing/failure/retry/replacement/proposal/registration과 나의 회사 상태 공유.
- 가입 회사 근거: 대표면허와 WOMEN_OWNED/DISABLED_OWNED/SOCIAL_ENTERPRISE는 YES/NO/UNKNOWN을 구분하고 평가연도 미확인은 null이다. 출처4종과 개별 sourceSnapshotDate를 보존한다. 기본 mock은 금액 있음/연도 없음·인증 혼합, `evidence-empty`는 금액/근거 없음·모두 UNKNOWN이다. 회사 영역의 근거 버전1이 구형 합성 연도/ACTIVE/빈 인증만 변환하고 진행·멱등 replay를 보존한다. 새 형식의 잘못된 상태/출처/날짜는 해당 회사 공간만 초기화하며 실제 API 응답/파일을 저장하지 않는다. [DEV-59 로컬 검증](../development/figma-v01/tasks/DEV-59.md#dev-59-verification)은 기존 QA-06/07 실제 차단을 대체하지 않는다.

## 7. 회사와 업로드의 경계

### 가입 후 서류함 조회 · DEV-22

- 같은 company 공급원의 Document 포트에 `getDocumentBoxContext`, `listCompanyDocuments`, `getCompanyDocumentVersions`를 제공한다. HTTP 회사 문맥은 인증 refresh의 companyContext만 사용해 기본 profile의 다른 leaf 권한을 추가 요구하지 않는다. 목록의 문서관리 leaf와 개별 버전 metadata의 owner/ACTIVE 소속 검사는 서버 계약이며 role 이름으로 대체하지 않는다.
- 목록은 page0/기본20/최대100·문서 count/서버 정렬을 보존하고 exact 표시 versionId를 사용한다. 비공개 `document-box-api-mapper.ts`가 필수 ID/status/current/시각·page/count를 검증하고 불필요한 업로더 식별자·원본 필드를 내부 모델에 복사하지 않는다. nullable/미제공 기간은 null, 손상 날짜는 명시 확인 필요다.
- 현재 page의 N개 문서만 versions GET으로 보완하며 최대4건 동시 요청이다. 빈 page는 추가 요청0건, 실패는 행별 보유/기간 확인 필요다.401/403이면 전체 보호 자료를 숨기고 자동 polling/fallback/재시도는 없다. exact version/current/status가 요청 사이 달라지면 다시 확인해야 하며 최대 버전 번호로 current를 만들지 않는다. 계정/회사·epoch/화면 수명과 AbortSignal로 이전 응답·후속 요청을 폐기한다.
- `validUntil`의 KST 당일까지 포함·그 뒤 만료, 미래 validFrom/결측/잘못된 기간을 구분한다. 화면의 날짜 재계산은 로컬 타이머/화면 복귀이며 API polling이 아니다. 파일 보유/처리/기간과 회사 인증·프로필 반영은 독립이다.
- mock의 기존 company 문서에 optional `box` metadata/회사 귀속/current 참조를 함께 저장한다. 새 미귀속 업로드는 회사 목록에 없고 신규 회사 등록 성공 후 같은 문서만 귀속시킨다. 알려진 구형 문서에 귀속·current·기간을 추론해 추가하지 않으며 기존 namespace/진행·멱등 replay를 보존한다. managed 교체 후보는 기존 current를 보존한다. mock metadata는 합성 파일명만 사용하고 실제 파일 이름/원문·API 응답을 복사하지 않는다.
- `documents`/`documents-empty`/`documents-denied`/`documents-version-error`는 명시적 회사 mock 시나리오다. [로컬 mock/HTTP 대역](../qa/company-documents.md#dev-22-local-qa)은 실제 DBOX 통합 차단을 해소하지 않는다. 원본 티켓/상세 UI는 아래 DEV-23 후속을 따르며 업로드/삭제·기존 회사 OCR 적용은 DEV-24~26의 별도 Gate다.

### 가입 후 서류 상세/원본 · DEV-23

- 같은 company Document 포트의 `getCompanyDocumentHistory`는 기존 versions GET을 상세 전용으로 매핑한다. `DocumentHistoryVersion`은 최소 목록 모델에 contentType/sizeBytes·nullable pageCount/uploaderDisplayName을 추가하며 account ID/추출값/서명은 제외한다. current/후보/REPLACED와 nullable 기간·업로드/최종수정의 의미는 POL-13을 따른다. 화면은 처리/추출값 GET을 상세 metadata 조회에 추가하지 않는다.
- URL의 exact version을 선택/로그인 복귀/새로고침 기준으로 사용한다. 명시 버전이 사라지면 오류이며 current로 대체하지 않는다. 버전 선택은 metadata를 재조회하지만 티켓/원본을 자동 요청하지 않는다. 계정·회사/epoch·선택·화면 수명은 각각 반영 전에 확인한다.
- `readCompanyDocumentOriginal`은 선택 version의 PREVIEW/DOWNLOAD 티켓 POST와 storage GET을 HTTP 내부에서 수행하고 `{blob, expiresAt}`만 반환한다. 티켓 URL은 https 또는 loopback http·자격증명/fragment 없음·유효 만료를 검증하고, 원본 GET은 credentials omit/cache no-store/referrer no-referrer/redirect error다. MIME3종·1..10MiB/stream 상한·전송/만료/중단을 검사한다. 서명 URL은 저장·로그·오류/Toast·공개 모델에 넣지 않는다. metadata와 원본의 권한 집행은 별도 서버 검사이며 role/업로더 이름으로 허용하지 않는다.
- 원본 메모리 Blob URL은 선택/명시 탐색·계정/회사/epoch·화면 종료/만료에 해제하고, HTTP 전송도 티켓 만료 때 중단한다. 오류/만료 뒤 자동 재발급·polling/fallback은 없다. 앱 다운로드 버튼은 DOWNLOAD로 새로 검사하며 브라우저 기본 PDF 도구의 저장/인쇄는 이미 표시한 bytes의 기능이다. 이미 저장한 파일의 삭제나 기발급 원본의 즉시 회수는 보장하지 않는다. 다운로드 완료 안내는 브라우저 시작 확인이며 OS 저장 완료를 주장하지 않는다.
- mock은 기존 회사 공간/귀속/current·진행·멱등 replay를 유지하고 합성 PDF/PNG만 메모리에서 생성한다. 실제 선택 파일/티켓/Blob은 저장하지 않는다. 기존 `documents`에 현재v2/REPLACED v1과 PNG 사례를 추가하고 `documents-denied`의 metadata 허용/원본404 차이를 유지한다. 새 시나리오·전역 schema/namespace 변경은 없다. [로컬 mock/HTTP 대역](../qa/company-documents.md#dev-23-local-qa)은 실제 DBOX-07~10/21~22의 차단을 대체하지 않는다.

기본정보의 내부 모델은 `primaryIndustries` 배열이다. HTTP mapper는 목록 필드가 있으면 빈 배열까지 그대로 사용하고, 필드가 없을 때만 `primaryIndustry`의 유효한 단일값/null을 목록/빈 목록으로 호환한다. null/비배열/결측·잘못된 행·동일 코드의 이름 충돌을 빈 성공으로 바꾸지 않는다. 정확 중복은 제거하고 서버 순서/원문을 보존한다. legacy 대표값을 목록에 추가하거나 대표/부업종을 만들지 않는다. mock 기본정보는 복수 목록을 제공하고 `basicProfileVersion: 1`이 구형 단일값만 변환한다. 가입용 단일 선택 계약과 전역 MockStore schema/계정 namespace·문서/멱등 replay는 유지한다. 실제 QA-05/DEV-08 차단은 [DEV-60 로컬 검증](../development/figma-v01/tasks/DEV-60.md#dev-60-verification)으로 해소되지 않는다.

화면은 `getMyCompanyOverview()`를 사용한다. API 구현은 기존 refresh → companyContext에 해당하는 기본 profile 또는 내 소속 신청을 조회한다. `404/CR001`만 신청 없음이고 403은 권한 오류다. APPROVED지만 아직 연결되지 않은 상태를 보존한다. mock은 회사 상태를 조회하고 실제 인증 응답을 덮어쓰지 않는다.

- `cancelMembershipRequest(access, requestId, expectedVersion)`는 Onboarding 포트/공개 client의 명시 취소다. 실제 조회의 양수 안전 정수 version을 기본값 없이 보존하고 body/추측한 멱등성 키 없는 DELETE query로 보낸다. mapper가 같은 신청의 CANCELED·증가 version/완료 시각을 검증한 뒤 `{ request, sessionWarning? }`를 반환한다. wrapper는 기존 `isSuccess` 경계를 유지하며 게시 `success`와 실제 wire/실행 대응 미확인은 [DEV-15](../development/figma-v01/tasks/DEV-15.md#dev-15-brief)의 별도 실서버 차단이다.
- 취소 controller는 같은 제출 중복/완료 replay와 계정·화면 종료 뒤 늦은 상태/Toast를 막는다.409/404는 최신 조회만 복원하며 새 신청에 자동 재취소하지 않는다. 응답 유실/잘못된 성공/권한·서버 오류는 미확정/명시 상태 확인이다. 성공 뒤 세션/최신 조회 실패는 성공과 경고를 구분한다. 취소 후 재확인의 refresh는 `preserveOnError`를 사용해 일시 오류로 확인된 완료를 잃지 않는다. 최종401/세션 해제는 보호 자료를 숨기고 로그인/복귀로 연결한다.
- 회사 mock의 `membershipVersion: 1`은 알려진 구형 합성 신청에만 version1/시각과 `membershipRequests` 이력을 이관한다. 취소는 CANCELED/version 증가와 이력을 보존하고 재신청은 새 ID다. 실제 HTTP version 누락은 이관/기본값 대상이 아니다. 기존 연결/문서/proposal·초대/멱등 replay와 전역 schema/계정 namespace는 유지한다. 새 형식의 손상은 해당 회사 공간만 초기화한다. [로컬 QA](../qa/my-company.md#dev-15-local-qa)는 기존 MCO/CDASH의 실제 차단을 해소하지 않는다.

- 등록/초대 수락 후 API 구현은 refresh, mock 구현은 mock 회사 상태를 갱신한다. 화면이 직접 post-mutation refresh를 호출하지 않는다.
- HTTP 업로드는 SHA-256·파일 metadata·멱등성 키로 업로드 세션을 만들고, 내부 descriptor의 method/header/URL로 `PUT`(credentials omit)한다. 화면에는 document/version ID와 opaque uploadHandle만 반환한다.
- DEV-24의 기존 문서 교체는 `createDocumentVersion`의 exact document/current UUID·SHA/metadata/같은 멱등 키를 사용한다. `document-upload-api.ts`가 replacement 응답의 ID/status/버전·세션과 PUT descriptor를 검증하고, `getDocumentReuploadStatus`는 기존 processing GET에서 추출값 없이 별도 상태 모델만 반환한다. 교체/PUT/completion/처리 재시도의 optional AbortSignal은 기존 가입 호출과 호환되며 실제 공급원/endpoint를 새로 만들지 않는다. PUT 주소 거절/만료는 같은 요청의 URL 갱신과 session410 뒤 명시 재선택을 구분한다. 응답 유실·손상2xx·실패는 current/이력 재조회 전 성공이 아니다.
- [DEV-24의 서버 소스 확인](../development/figma-v01/tasks/DEV-24.md#dev-24-investigation): 신규 POST는 미귀속 owner 문서를 만든다. 기존 회사 attached candidate는 공식 검증/동일 identity·인증 근거 current 검사를 통과하면 서버가 이전 version REPLACED·새 VERIFIED/current·회사/identity 근거와 인증 시각을 원자 변경한다. 회사명/주소 등 프로필값 반영과 MAT-162는 별개다. mock은 동일 회사의 current/후보와 단일 후보·서로 다른 payload의 멱등 충돌·기간/명시 재시도·교체 전 기존 current를 보존하며, 회사 가입의 COMPANY_CONFIRMATION_REQUIRED 흐름은 유지한다. 새 파일 원문·이름/전체 hash·서명 descriptor는 저장하지 않고 요청 동등성용 signature만 남긴다. 신규 추가·실제 통합 차단은 사용자 D1 범위 밖으로 보존한다.
- mock 업로드는 외부 전송 없이 상태만 변경한다. 완료 → processing → 등록 제안 또는 실패, 재시도, 버전 충돌을 지원한다.
- 실제 문서 복원에는 기존 `mate:signup-document:<account>` 키의 UUID만 보존한다. mock 문서 복원은 mock namespace를 사용하며 실제 처리 중 키를 읽거나 삭제하지 않는다.
- 파일별 idempotency key를 유지하고, 다른 payload의 동일 키는 mock에서 409다. 실제 서버의 mutation 성공을 refresh 실패 때문에 다시 제출하지 않는다.
- 등록 화면의 `AccountScope`는 다른 인증 계정으로 바뀌면 파일·connection·proposal 등 화면의 임시 상태를 새로 만든다. 완료 후 세션 만료만 발생한 경우에는 성공 결과와 경고를 유지한다.
- DEV-16의 회사 flow는 공개 세션의 epoch를 조회해 명시 로그인/로그아웃과 refresh 만료를 구분한다. 계정/화면 종료 뒤 다음 업로드 요청·복원 저장·완료 반영을 막는다. 이 epoch는 화면 수명용 숫자이며 `AuthAccess`·일곱 공급원·snapshot/운영 guard·storage namespace를 바꾸지 않는다. HTTP 신청은 양수 requestId/PENDING/대상 companyId, 번호/문서 등록은 양수 companyId/membershipId와 기존 string role/verificationStatus를 확인한 뒤에만 완료/후속 refresh를 수행한다. 새로운 enum이나 서버 권한을 추정하지 않는다. 신청의2xx 손상/빈 응답·연결/timeout·409/5xx는 미확정 상태 확인이며 자동 재제출하지 않는다. 등록의 기존 멱등 key/명시 재시도는 유지한다. [검증 근거](../qa/my-company.md#dev-16-local-qa)는 mock·HTTP 대역이고 실제 wire/실행 SHA·기존 가입 QA 차단은 별도다.

### 보관 문서 전체 삭제 · DEV-25

- 공개 company Document 포트의 `deleteCompanyDocument(access, documentId, signal?)`는 version 선택과 무관한 series 전체 명령이다. HTTP는 UUID 검증 뒤 기존 보호 DELETE만 보내고 body/expectedVersion·추측한 멱등 키를 추가하지 않는다. `document-deletion-api.ts`가 필수 timezone 시각 `deletedAt`/그보다 뒤의 `purgeAt`만 검증/복사한다.2xx/빈·손상 wrapper/data/404를 삭제 성공으로 만들지 않는다. 기존401 refresh 한 번의 재인증 외 앱의 자동 재삭제는 없다.
- controller는 초기 company 포트 문맥을 확보하고 제출/명시 재조회 때 같은 회사인지 확인한다. auth가 API이고 company가 mock인 조합에서도 인증 응답의 회사/role로 문서 권한·귀속을 판단하지 않는다. 계정/epoch·화면 종료·Abort와 제출 중복을 방어하고 실패 뒤 명시 상태 GET만 허용한다. 다시 삭제하려면 닫고 새 확인을 거친다.
- 검증된 성공 뒤만 상세/원본 메모리 URL을 해제하고 기존 Toast를1회 표시한 뒤 최신 목록 GET/유효 page로 이동한다. 성공 뒤 목록 실패/최종401/세션 해제는 완료를 보존하며 재로그인·목록 재확인으로 분리한다. 미확정 상태의404는 권한/없는 문서가 합쳐질 수 있어 성공이 아니다. 이미 저장한 파일/기발급 티켓의 즉시 회수나 회사 인증 자동 강등·정확한 파기 완료 시각을 약속하지 않는다.
- mock 문서의 optional `deletion`은 합성 두 시각만 저장한다. 기존 schema/namespace·다른 계정/영역·멱등 이력/버전을 보존하고 권한 있는 재삭제는 같은 시각 결과다. 삭제 문서는 목록/모든 version metadata·원본/업로드 handle·completion/processing/retry·proposal/등록 replay에서 제외한다. 손상된 새 metadata는 회사 공간만 초기화한다. worker/실제 원본/OCR 파기를 모사하거나 회사 인증을 바꾸지 않는다.
- [DEV-25 로컬 QA](../qa/company-documents.md#dev-25-local-qa)는 Node 계약·실제 Next mock/loopback HTTP만 포함한다. 실제 DBOX-17~22·현재 실행 SHA/실제 권한·disposable 문서/사용·삭제·잔존·복구·장기 worker 파기는 사용자 D1대로 차단을 보존한다.

### 가입 후 팀원 조회 · DEV-27

- 같은 company factory의 `CompanyTeamRepository`를 공개 contracts/client로 합성한다. 현재 회사는 HTTP의 세션 refresh, mock의 계정별 기존 company overview에서 얻으며 다른 공급원의 auth 회사/기본 profile 권한으로 대체하지 않는다. DEV-27 선행 포트는 GET 조회이며 DEV-28 management 포트는 아래에 구분한다.
- catalog·현재 `memberships/me`의 leaf와 ACTIVE members 목록/상세를 읽는다. role은 서버의 요약 배지이며 허용 조건이 아니다. page0/기본20/size1..100·서버 total/count·joinedAt ASC/id ASC와3page/9row flags를 보존한다. 정밀 시각의 소수9자리와 nullable 이름/프로필/마지막 로그인을 검증하고 ID/version/flags를 추정하지 않는다.
- HTTP 경계는 accountId와 미지원 birthDate/mobilePhone을 복사하지 않는다. D2 자리는 미제공이며 MAT-290 Done만으로 실제값 표시를 활성화하지 않는다. 프로필 URL은 HTTPS/자격증명 없음, 화면은 no-referrer·실패 시 공용 기본 이미지다. source/게시 Swagger와 실제 서버 wire/권한 통합 증거는 별개다.
- `loadCompanyTeam`은 계정/epoch·Abort와 조회 전후 회사/소속/leaf를 검사한다. UI는 화면 종료·로그아웃·탐색/복귀에 조회 결과를 폐기·재조회한다.401/403/404와 전체 빈 목록·범위 밖 빈 page를 구분하며 자동 fallback/명령/polling은 없다. 실제 접근 제어는 서버가 집행한다.
- DEV-27 당시 mock은 기존 company namespace/overview/문서·신청·초대·멱등 replay를 유지하고 불변 합성 팀원23명을 매번 복사했다. 당시 새 mutable 팀원 저장소·전역 schema 변경·실제 API 자료 복사는 없었다. connected와 team-agent/team-viewer/team-extra/team-read-only/team-empty/team-denied는 같은 company 공급원을 따르며 현재 가변 동작은 아래 DEV-28 절로 구분한다.
- [DEV-27 로컬 계약·브라우저/실제 QA 경계](../qa/team-members.md#dev-27-local-qa)와 당시 사용자 로컬 선행 결정을 보존한다. 당시 직급/권한·초대/신청·직급 관리 명령은 후속 소유였으며 capabilities 표시가 그 실행 승인은 아니었다. DEV-28의 새 승인/실행 범위는 아래 절을 따른다.

### 팀원 정보·권한·대상 동의 · DEV-28

- `CompanyTeamManagementRepository`/`team-management-contracts.ts`를 기존 company factory/public client에 합성한다. 새 공급원/자동 fallback·library는 없다. private `team-management-api.ts`가 직급·소속 명령/동의 DTO를 검증하고 계정ID·처리자ID를 공개 모델에 복사하지 않는다. 개인 프로필 편집·직급 정의 CRUD·초대/메일은 포함하지 않는다.
- 직접 PATCH는 endpoint별 expectedVersion, self-demotion/leave는 POST body, 내보내기는 DELETE query다. 동의 생성은 kind별 필드·requestKey UUID/expectedMembershipVersion, 결정/취소는 requestKey/expectedRequestVersion을 전송한다. 추측한 공통 멱등 header를 추가하지 않는다. outcome CREATED/REUSED/NO_CHANGE와 요청 PENDING/APPLIED/REJECTED/CANCELED/INVALIDATED·실제 전후 version/시각·target·회사·전체 권한을 검사한다. terminal REUSED를 대기·새 적용으로 안내하지 않는다.
- UI는 현재 catalog/leaf·capabilities·actor 부분집합/role 비교와 명령 직전 exact target/version·직급 정의를 함께 사용한다. 현재 회사와 소속/leaf의 전후 재확인 뒤만 회사 요청·타인 상세를 노출한다. 대상 표시는 같은 회사 exact 소속 조회를 최대4동시로 조합하고404/과거 회사는 원래 소속 식별 fallback이다. 다른 회사의 현재 프로필을 조회해 과거 대상을 대체하지 않는다. 소속 없는 본인 이력은 source-authorized 상세 재확인으로 유지한다. 본인 결정은 현재 target·회사, 취소는 현재 kind별 관리 leaf를 추가 확인한다.
- 명령 scope는 제출 중복·계정/epoch·Abort·화면 종료를 방어하고, 한 번 보낸 뒤에는 최신 GET/명시 재선택 전 자동 명령을 만들지 않는다. 요청 생성과 적용·실제 소속 종료와 서비스 계정 탈퇴를 구분한다. 검증된 성공 banner를 먼저 보존하고 `getCompanyTeamContext`(HTTP 내부 refresh, preserveOnError)와 최신 조회를 실행한다. 이후 조회 실패/최종401은 확인된 성공을 재전송하는 사유가 아니다. 기존 공통401의 한 번 재인증은 별개다.
- mutable mock은 기존 MockStore schema1/7그룹/계정 namespace 안의 `company-team-management` 영역에 회사별 팀원·직급 snapshot/요청/합성 receipt를 보존한다. 같은 store/account의 명령을 최신 읽기→검사→쓰기까지 직렬화해 병렬 version 소비/성공 유실을 막는다. 손상 시 이 영역만 초기화하고 기존 company overview/문서·초대/신청·다른 계정은 보존한다. 본인 소속 종료만 같은 company overview에 반영하며 실제 API 응답/파일/권한을 mock에 복사하지 않는다.
- 요청 목록 탐색은 현재 scope/page/status의 canonical 목적지와 비교한다. 같은 탭·필터/페이지·기본 목록 breadcrumb는 탐색을 막고 결과를 유지하며 다른 목적지에서만 conceal/Abort를 수행한다. mock 관리 capability는 POSITION/REMOVE/PERMISSIONS 각각 실제 행동 kind/leaf로 판정하며 직급 편집 leaf가 없는 합법적인 추가 내보내기/권한 관리 조합을 차단하지 않는다. 기본 preset뿐 아니라 실제 명령의 허용/거부와 대조한다.
- `team-pending`(본인 동의 요청), `team-last-admin`(유일 관리자), `team-no-representative`(본인 취임 가능)를 기존 company 시나리오에 추가했다. 알림 allowlist는 사용자 D2의 정확한 `/my/team/change-requests/{양수 안전정수}`만 추가하며 query/encoded/범위 밖은 거부한다. 알림 읽음/이동은 요청 조회일 뿐 결정 POST가 아니다.
- [DEV-28 로컬 QA](../qa/team-members.md#dev-28-local-qa)는 mock·HTTP fetch 대역·loopback 실제 Next/브라우저다. TEAM-05~10/23/25/26의 이번 소유9부분은 실제 API0통과·자원/실행 대응·사용/변경/잔존/복구 미확보로 차단이다. DEV-27·다른 Task의 기존 QA/예외를 확대하지 않는다.

### 보내는 팀원 초대 · DEV-29

- 공개 `CompanyTeamInvitationRepository`의 `createTeamInvitation`·`listTeamInvitations`·`getTeamInvitation`만 기존 company factory/client에 합성한다. 수신 초대 포트·신청/직급 CRUD·초대 수정/PATCH·재발송/취소는 변경하지 않는다. 새 공급원/library·fallback·추측한 멱등 header는 없다.
- 입력은 email254/표시 이름100·대표자 여부·기존 일반 직급 ID XOR 새 직급명30·preset/추가15leaf·선택 message500다. trim/이메일 소문자화·ISO 제어문자/대표자 예약명·중복 leaf를 검사하고 명시 필드만 POST한다. 대표자는 ADMIN/서버 공석 capability·일반 직급/preset/추가 없음, 새 직급 제안은 PROFILE_EDIT, VIEWER 초과 부여는 MANAGE+actor 부분집합을 따른다. 등록된 계정 이름은 서버 결과를 보존한다.
- private mapper가 exact company/초대 ID, page/count/createdAt DESC·ID DESC(나노초 포함), nullable·실제 시각/version·상태/delivery를 확인한다. source 목록은 **DB PENDING만** 세며 아직 DB에 남은 만료 행이 EXPIRED로 표시될 수 있다. ACTIVE 팀원 수나 전체 terminal 이력 수로 바꾸지 않는다. token/링크·cookie/메일 원문·불필요한 회사/계정 ID 메타데이터는 내부 모델에 복사하지 않는다.
- 조회 전후 같은 회사·현재 소속/leaf와 catalog를 확인하고, 제출 직전에 선택 직급 정의/version·서버 capabilities·현재 grant를 다시 검사한다. 단일 scope는 중복/계정·epoch/Abort·화면 종료를 방어하고 한 번 보낸 뒤 자동 재생성하지 않는다. 유실/손상2xx/409는 명시 GET/새 작성부터 확인한다. 검증된 생성 성공·초대 수락 대기·메일 PENDING/SENDING/SENT/FAILED/SUPERSEDED·실제 수신/수락은 별개다. 후속 GET 실패/최종401은 확인된 성공을 잃거나 재발송하는 사유가 아니다.
- mock의 `company-team-invitations` version1은 기존 schema/공급원/계정 namespace 안에 합성 입력/필요 결과만 저장한다. 손상/추가 비공개 필드가 있으면 이 영역만 초기화하며 기존 company/관리/서류·수신 초대/다른 계정은 보존한다. `team-mock-command.ts`는 기존 관리 명령과 초대 생성을 같은 store/account queue로 묶어 상태 검사부터 쓰기까지 직렬화한다. 실패 뒤 release·외부 대표자 취임의 양방향 순서를 회귀로 검증한다. 표시용 빈 목록을 대표자 공석으로 추정하지 않는다.
- `team-invitation-mail-failed`는 초대를 만들되 합성 delivery만 FAILED로 반환한다. 실제 메일/원문·발송 링크는 생성하지 않는다. 수신 포트의 기존 합성 fixture 회귀는 발송된 초대의 실제 수신/수락 연결 증거가 아니다.
- 회사 통합 mock은 `merge`, `merge-proposal`, `merge-in-place`에서 역할별 합성 사건을 탭·계정별 `company-merge` 영역에 보존한다. 합성 Clock으로 최초 보호 종료와 제안 무응답 자동 개시를 모사한다. 명령은 같은 계정의 회사 쓰기 직렬화와 revision 검사를 사용한다. [실행 가이드](../development/repositories.md#dev-34-merge-mock)
- [DEV-29 QA](../qa/team-members.md#dev-29-local-qa)는 Node·mock 브라우저·API profile/loopback HTTP 대역과 실제7소유 부분 차단을 구분한다. TCP 유실 실험의 앱 fetch1회/HTTP wire2회(재전송은409) 관찰은 전송 계층과 앱의 자동 명령을 구분하는 한계이며, 실제 서버의 멱등 보장/메일 도착 PASS가 아니다.

### 기존 초대 편집·재발송·취소 · DEV-30

- 같은 company `CompanyTeamInvitationRepository`/public client의 `updateTeamInvitation`, `resendTeamInvitation`, `cancelTeamInvitation`을 사용한다. PATCH는 expectedVersion과 기존 입력의 이메일을 제외한 필드, resend는 expectedVersion body, cancel은 expectedVersion query/body 없음이다. 기존 isSuccess 경계/401 한 번 재인증만 유지하며 새 endpoint·추측 멱등 header·라이브러리·공급원/fallback은 없다.
- 이메일과 등록 계정 이름은 고정이다. PATCH의 대표자 변경은 ADMIN, 직급/대표자 변경은 PROFILE_EDIT, 일반 직급 정의와 grant는 현재 leaf·부분집합/공석을 따른다. 취소는 INVITE이며 재발송의 기존 grant 재검사와 다르다. UI는 미만료 PENDING만 허용하고 만료 DB 잔존 resend 창을 사용하지 않는다. 임의 cooldown/횟수 제한을 추가하지 않는다.
- 사용자 명시 재발송에서 변경이 있으면 PATCH의 정확한 version+1·동일 delivery/만료·입력/권한을 검증하고 저장 receipt를 보존한다. 최신 company/소속/leaf·catalog/초대/version·만료를 다시 확인한 뒤에만 resend한다. 변경 없음은 PATCH0이다. 성공한 저장·재발송 요청·delivery 상태/실제 메일 수신을 구별하며 손상/유실·404/CI003/CI004·후속 조회 실패 뒤 자동 PATCH/resend/cancel은 없다. 계정/epoch/Abort/화면 종료 뒤 후속 요청·완료를 폐기한다.
- 명령 scope는 선택적 내부 `AuthAccess.assertRequestScope`를 합성해 shared HTTP의 최초/401 refresh 후 fetch 직전에 원래 만료·계정/epoch/Abort를 검사한다. guard 없는 기존 요청/공급원/wire 계약은 유지한다. 인증 대기 중 만료는 전송0, 첫401 뒤 만료는 재전송0이며 이미 보낸 요청의 서버 rollback을 보장하는 정책은 아니다. 편집창 진입에는 기본 INVITE/현재 상태를, 제출에는 새 grant 부분집합을 적용해 기존 ADMIN 초대의 합법적인 VIEWER 축소를 허용한다.
- mock은 기존 계정별 `company-team-invitations` version1/namespace와 shared command lane을 유지한다. 선택적 `deliveries`는 과거 PENDING 대체와 새 delivery만 저장하며 알려진 구형 행은 첫 재발송에서 현재 delivery를 보완한다. PATCH는 delivery/만료를 갱신하지 않고 취소는 완료/목록 제외를 보존한다. source와 같이 cancel/PATCH는 만료 확정, resend는 DB PENDING 잔존 창을 가질 수 있어 UI D3를 별도로 테스트한다. 실제 token·handoff/메일 원문·API 응답을 저장하지 않으며 기존 독립 수신 mock과 연결된 통합을 모사하지 않는다.
- [DEV-30 QA](../qa/team-members.md#dev-30-local-qa)는 로컬 mock·HTTP fetch 대역·실제 Next/브라우저다. 실제 TEAM-14~17/23/26의6소유 부분은 실행 버전 대응·승인 합성 계정/회사/수신함·사용/소비/잔존/복구·담당 역할 미확보로 차단을 유지한다. source의 이전 링크/handoff 거부를 열람한 것과 실제 수락 거부 실행은 다르다.

### 받은 합류 신청 검토·승인/사유 거절 · DEV-31

- `CompanyTeamMembershipRequestRepository`의 list/get/approve/reject 네 행동은 같은 company factory/public client에 합성한다. 새 공급원·fallback/library는 없다. private `team-membership-request-api.ts`가 exact company/request ID·PENDING page/count·createdAt ASC/id ASC(나노초 포함), nullable 요청값과 applied 값·시각/version·capabilities를 검사하고 불필요한 accountId·비공개 필드를 복사하지 않는다. 목록과 상세 GET은 모두 **PENDING 전용**이며 상태 전체 이력 endpoint로 만들지 않는다.
- approval은 expectedVersion/대표자·positionId XOR positionName·preset/추가 leaf, rejection은 expectedVersion/trim 후 제어 문자 없는1..300자 reason이다. 정확한 version+1·동일 신청/회사·terminal 상태와 승인 actual 직급/role/permissions/소속 ID·거절 사유를 검증한다. 원 신청 직급/제안명을 그대로 승인하는 데 PROFILE_EDIT를 추가 요구하지 않는다. 변경 직급은 PROFILE_EDIT, VIEWER 초과는 MANAGE+actor 부분집합, 대표자는 원 대표자 신청/ADMIN·일반 필드 없음·서버의 현재 공석 최종 검사를 따른다. representative capability는 ADMIN 여부이며 공석 보장으로 추정하지 않는다.
- 조회 전후의 REVIEW leaf·현재 회사/소속/전체 leaf와 제출 직전 신청/version·선택 직급 정의·catalog를 재확인한다. 새 scope는 계정/epoch/Abort/화면 수명·동일 제출을 검사하고 `AuthAccess.assertRequestScope`로 최초/401 재인증 뒤 fetch 직전에도 방어한다. 유실/손상2xx/409/404 뒤 자동 재결정은 없고 명시 조회·새 검토부터 시작한다. 서버가 이미 처리한 변경의 rollback은 보장하지 않는다.
- 검증된 결정 receipt를 banner/Toast에 먼저 보존한 뒤 최신 목록·승인 membership exact GET을 확인한다.404/목록 제외만으로 특정 결정이나 신청자 상태 성공을 추론하지 않는다. 승인 당시 적용값은 이력이며 현재 팀원의 합법적 후속 변경/내보내기·404/조회 오류가 전체 신청 목록을 차단하지 않는다. 승인 이후 현재 정보가 다르거나 확인되지 않으면 별도 안내하고 인증/권한401/403은 보호 자료를 숨긴다. 후속 목록/refresh 실패에도 확인된 성공을 재전송하지 않는다.
- mock 신청은 기존 account/company별 `company-team-management` 안의 optional `membershipRequests`에 보존하고 같은 store/account serializer 아래 승인/거절·팀원/직급 반영·대표자 경쟁을 수행한다. 손상된 신청 하위 영역만 초기화하며 기존 팀원/변경 요청·company/서류·초대·다른 계정을 보존한다. 합성 신청자 재승인 시 이미 활성인 합성 팀원은 고정 source의 CM004로 거부한다. 실제 개인정보/API 응답을 복사하지 않는다. `team-requests`(23건), `team-requests-empty`, `team-reviewer`(VIEWER+REVIEW) 세 시나리오를 추가했다.
- 이 mock은 reviewer 계정의 합성 신청/팀원만 조합한다. 신청자 별도 계정의 회사 overview·다른 회사 pending/기존 수신 초대 공간까지 원자 동기화하는 실제 통합을 모사하지 않는다. [DEV-31 QA](../qa/team-members.md#dev-31-local-qa)는 mock/HTTP 대역/실제 Next 로컬과 실제 TEAM-18~20/23/26의5차단을 구분한다. source의 신청자 상태·다른 pending/초대 정리·실제 권한/경쟁·실행 SHA/응답은 실제 QA 재개 조건이다.

## 8. 유지하는 제품/API 정책

- 맞춤공고 목록, 받은 알림 편집·삭제, import-company, 회사 시공능력·인증 직접 수정 등의 ‘준비 중’ 기능을 이 리팩터링으로 활성화하지 않는다. 당시 미연결이던 금액 직접 범위의 후속 연결은 아래 DEV-11 기록을 따른다.
- 받은 알림 읽음은 성공 응답 뒤에만 반영한다. 구독 해제는 받은 알림 삭제와 다르다. 7일 보존·카카오톡/SMS는 미확정/미구현 정책을 유지한다. actionPath의 2026-11-05 사용자 승인 [POL-04 v1](../development/figma-v01/tasks/POL-04.md#pol-04-decisions)은 당시 공고 상세(선택 bidClsfcNo)·`/my/company`를 허용했고, 현재는 위 DEV-28 D2의 정확한 양수 안전정수 동의 상세 경로도 허용한다. 위험/미지원 경로는 목록 유지·안내, 읽음 성공 뒤 이동/실패 시 목록 유지, 이미 읽음은 PATCH 없이 이동한다. 경계 및 이동 직전 allowlist를 적용하고 최종401/로그아웃·계정 교체/해제 뒤 사용자 행동을 자동 재생하지 않는다. hybrid에서도 목적지 ID 치환·자동 fallback·새 공급원 제약은 없다. 로컬 구현/대역/브라우저와 미실행 실제 통합의 증거는 [DEV-06](../development/figma-v01/tasks/DEV-06.md), [ANAV QA](../qa/alarms.md#dev-06-local-qa)를 구분해 확인한다.
- 공개 목록의 UI page는 1부터, API page는 0부터다. 조회 metadata에서 코드/라벨을 변환하고 KST를 표시한다. 기관 역할·nullable 금액과 결과 값을 그대로 구분한다.
- 공개 상세 본문 404와 section 실패는 별도다. 실제 첨부는 backend 스트리밍 URL이고 mock 첨부는 `/mock/bid-attachment.txt`다. 명세 없는 정정 이력·지시사항을 만들지 않는다.
- 수신 주소와 맞춤 이메일 ON/OFF endpoint는 독립적이다. 맞춤 공고 이메일은 매일 08:30 KST에 발송하며 이 채널에는 야간 옵션이 없다. 공고별 알림은 서비스 내부에서 전달한다. 개발 백엔드의 별도 상세·야간 설정 API와 현재 웹의 연결 범위, 대체 수신처 인증 시간은 [POL-19](../development/figma-v01/tasks/POL-19.md#pol-19-contract)를 따른다.
- 가입 약관은 현재 개발용 임시 본문/버전이다. 정식 약관 도입·기존 동의 처리 정책은 별도 결정 사항이다.

날짜 직접 입력은 [DEV-10](../development/figma-v01/tasks/DEV-10.md#dev-10-brief)에서 실제 HTTP 조회에 연결한다. ALL은 날짜3종·RESULT는 dateType 없는 개찰일 범위이고 CLOSING_SOON은 날짜 UI/query가 없다. 일반 URL도 같은 날짜 키를 쓰며 personal URL과 동일한 달력/조합 검증을 적용한다. 잘못된 날짜를 조용히 제거해 넓은 목록을 조회하지 않는다. 양쪽 빈값은 종류까지 해제하고 preset은 계산된 절대 날짜를 전송한다. 목록의 날짜 편집/초기화·내 맞춤 GET은 계정 무쓰기이며 기존 Repository 저장 계약을 화면에 재노출하지 않는다. mock/HTTP 대역 결과와 실제 경계 공고/실행 식별자가 필요한 실서버 QA는 별개다.

## 9. 새 기능의 개발 순서와 검증

금액 직접 입력은 [DEV-11](../development/figma-v01/tasks/DEV-11.md#dev-11-brief)에서 ALL/closing 조회 URL·HTTP/mock에 연결한다. BASE_PRICE는 canonical 분류 행 기초금액, ESTIMATED_PRICE는 공고 추정가격이며 두 경계는 포함한다. 0..9,007,199,254,740,991의 정수 원과 null 무제한을 구분하고 양쪽 빈값은 종류까지 해제한다. 음수/소수/초과/역전/중복·종류 누락 URL은 오류/원문을 보존하고 목록 요청 전에 차단한다. preset은 기존 정확한 경계와 선택 종류를 유지한다. RESULT의 기초/추정 금액·낙찰금액 연결은 추가하지 않는다. 팝업의 ‘저장’은 현재 조회 URL 적용이며 계정 쓰기/회사 투영 변경이 아니다. 최신 GET→URL 및 기존 Repository 저장/재조회 계약은 로컬에서 검증하고 실제 ADV/ADVP·QA-02/QA-10 통합 차단은 보존한다.

1. 현재 필요한 내부 입력/출력·Repository 계약 정의.
2. mock으로 정상/빈/오류/변경/복원 화면 개발.
3. 확인된 백엔드 계약으로 DTO·HTTP 구현과 필요한 mapper 추가.
4. 동일 계약 테스트, 실제 API 통합 검증.
5. 해당 기능 묶음을 api로 선택해 재빌드.

`pnpm test`는 Vitest 4.1.11/Node 환경이다. jsdom/MSW 없이 Clock/Storage/fetch를 주입한다. HTTP 대역의 wire 계약 검증과 실제 서버 통합은 따로 기록한다. `tests/architecture.test.ts`는 화면의 직접 HTTP/mock/DTO import와 클라이언트의 server-only 유입을 검사한다.

기본 Gate는 `pnpm test`, `pnpm lint`, 프로필별 `pnpm build`, `git diff --check`다. 공유 모델/Storybook 영향 시 `pnpm build-storybook`도 실행한다. 비동기 Server Component는 실제 Next.js 실행에서 확인한다. 전체 mock의 서버·브라우저 외부 요청 0건, hybrid의 공급원 경계, static 페이지 → dynamic 페이지/새로고침, 운영 artifact 승격 차단을 브라우저/실행 검증으로 확인한다.

실제 서버 가입·회사 등록·초대·메일·설정 변경은 계정과 변경/복구 범위를 정해 별도 승인받는다. 기존 QA 대기 항목을 mock 성공으로 통과 처리하지 않는다. 사용법은 [Repository 개발 가이드](../development/repositories.md), 증거와 미실행 범위는 [Repository QA](../qa/repositories.md)를 따른다.

## 10. 회사 직급의 공유 정의와 참조

- DEV-32는 기존 company 그룹의 `getCompanyTeamPositions`와 `createCompanyTeamPosition`, `renameCompanyTeamPosition`, `deleteCompanyTeamPosition`을 사용한다. HTTP 요청은 회사별 `/positions`에 생성의 `{name}`, 이름 변경의 `{name, expectedVersion}`, 삭제의 query `expectedVersion`을 보낸다. 변경 receipt는 타입·이름·대상 ID·버전·시각을 확인한 뒤 화면 상태와 분리한다.
- 직급명은 Kotlin의 공백 기준을 입력과 읽기 DTO에서 공유한다. 직급 목록과 팀원·초대·합류 승인 응답의 이름 원문을 보존하고, 시스템 이름의 예약 검사는 일반 직급 쓰기에 적용한다.
- 목록은 현재 소속의 `COMPANY_MEMBER_LIST_VIEW`, 관리 시 `COMPANY_POSITION_MANAGE`와 서버 팀원 목록의 `canManagePositions`를 사용한다. 화면에서 관측한 버전이 여전히 맞을 때만 사용자 명령을 전달한다. 스코프는 전송 직전과 401 인증 갱신 직전 호출 경계에서 다시 확인한다. 알려진 충돌과 결과 미확정 모두 명시 조회 후에만 다음 행동을 제공한다.
- mock은 기존 `company-team-management`의 회사/계정 영역과 명령 대기열을 사용한다. 삭제 정의는 기존 상태 형식의 선택 영역에 남겨 활성 목록에서 제외한다. 같은 이름을 다시 만들 때 새 ID를 쓴다. 연결된 팀원과 보낸 초대는 같은 직급 정의의 이름을 반영하고 참조 ID를 유지한다. 합류 제안에서 정의가 생성될 때도 이 ID 할당을 공유한다. 이미 확인한 승인 시점 값은 별도 기록으로 남는다. [실행 근거와 통합 차단](../qa/team-members.md#dev-32-local-qa)을 참조한다.

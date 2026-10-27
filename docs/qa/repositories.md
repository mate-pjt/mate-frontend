# Repository 전환 QA

실행일: 2026-09-30. 승인된 Repository 전환 계획의 구현·검증 기록이다. **mock와 HTTP 대역 PASS는 실제 서버 통합 PASS가 아니다.** 기존 기능별 QA의 대기·차단·과거 통과 판정은 유지한다.

## 기준선과 범위

- 시작 branch: `feature/my-company-overview`, HEAD: `f84af24b5f9d489eb17077113279c795ef1b61f9`.
- 작업 전 `.serena/project.yml` 수정과 `.playwright-cli/` 미추적 디렉터리는 보존했다. 이 작업의 브라우저 산출물은 저장소 밖 `/tmp/mate-repository-qa`에 생성했다.
- 7개 그룹의 현재 조회·변경을 이전했다. 준비 중인 맞춤공고 목록, 받은 알림 삭제, 회사 직접 수정, 회사 필터 가져오기 등은 활성화하지 않았다.
- 커밋·push·PR·배포·실제 서버 mutation은 실행하지 않았다.

### 데이터 접근 이전 목록

| 그룹 | 이전 위치 | 공개 진입점 | 주요 소비자 |
| --- | --- | --- | --- |
| auth | `features/auth/api.ts`, `types.ts`, 세션의 HTTP 로직 | `data/auth/client.ts`, `contracts.ts` | login choices, callback, signup, `features/auth/session.tsx`, AuthGate |
| bids | `data/bids/*reader.ts`, 오래된 `mocks/bids.ts` | `data/bids/server.ts`, `contracts.ts` | 홈, 목록, 상세 Server Page와 결과·참여업체·물품·첨부 |
| company | `features/auth/onboarding-api.ts`, `features/my-company/api.ts` | `data/company/client.ts`, `contracts.ts` | 회사 검색·신청·초대, 사업자번호·증명서 등록, 나의 회사 |
| notifications | `features/notifications/api.ts` | `data/notifications/client.ts`, `contracts.ts` | 헤더 bell, `/alarms` |
| bidAlerts | `features/bid-notice-alerts/api.ts` | `data/bid-alerts/client.ts`, `contracts.ts` | 상세 공고 알림 카드·팝업 |
| personalFilters | `features/bid-notice-filters/api.ts`, 입찰 DTO enum을 직접 쓰던 모델 | `data/personal-filters/client.ts`, `contracts.ts` | `/bids`의 개인 필터 조회·저장·초기화·수동 적용 |
| notificationSettings | `features/notification-settings/api.ts` | `data/notification-settings/client.ts`, `contracts.ts` | 수신 주소·인증 dialog·맞춤 이메일 ON/OFF |
| Q&A static | `data/qna/mock-reader.ts`, `mocks/qna.ts` | `data/qna/server.ts`, `contracts.ts` | `/qna`; endpoint 추가 없음 |

해당 legacy API/Reader와 미사용 fixture는 제거했다. HTTP·오류는 `data/shared`, 가변 mock 상태는 `data/mock`에 있다. 실제 필요한 함수 계약만 정의했으며 공통 CRUD/BaseRepository/IoC를 추가하지 않았다. DTO와 업로드 서명 descriptor는 HTTP 구현 내부에 있다.

## 자동 검증

환경: `.nvmrc`의 Node **22.20.0**, pnpm **11.3.0**, Vitest **4.1.11**, Node test environment. jsdom/MSW는 추가하지 않았다.

| Gate | 결과 | 관찰 |
| --- | --- | --- |
| `pnpm test` | PASS | 8개 파일, 62개 테스트; fetch/Storage/Clock 주입, 실제 서버 연결 없음 |
| `pnpm lint` | PASS | QA helper 포함 |
| API Preview `pnpm build` | PASS | 실제 Next 컴파일·TypeScript·정적 페이지 생성 |
| 전체 mock Preview `pnpm build` | PASS | 동일 경로와 서버/브라우저 snapshot |
| hybrid Preview `pnpm build` | PASS | company/notifications/notificationSettings만 mock |
| API production `pnpm build` | PASS | 정상 API 운영 설정 허용; 마지막 로컬 빌드도 API로 복구 |
| `pnpm build-storybook` | PASS | 공용 모델·Vite 설정; 기존 큰 chunk 경고는 남음 |
| `git diff --check` | PASS | 기존 변경을 되돌리지 않고 검사 |
| 운영 mock build | PASS: 차단 | config 오류, 종료 코드 1 |
| mock Preview artifact의 운영 start | PASS: 차단 | 시작 시 raw profile을 api로 지정해도 snapshot의 mock을 감지, 프로세스 종료 코드 1 |

운영 start 로그는 Next의 `Ready`가 잠시 나온 뒤 guard 오류와 종료 코드 1을 남긴다. hook의 throw만으로는 Next 서버가 종료되지 않는 것을 재현했으므로 instrumentation이 명시적으로 프로세스를 종료하도록 수정했다.

### 테스트 책임

| 파일 | 확인한 계약 |
| --- | --- |
| `tests/config-store.test.ts` | 기본/7개 그룹/오타/시나리오/혼합 금지/운영 guard, 새로고침·환경/계정 namespace, 손상·quota·초기화 |
| `tests/http.test.ts` | isSuccess, HTTP/JSON/data 오류, 취소, 쿠키/캐시/401 retry, 계정 교체 중 늦은 200/401 거부 |
| `tests/auth.test.ts` | 가상 로그인·가입·flow 만료·복귀 경로, 실제 OAuth URL 계약, 동시 refresh·로그아웃·계정별 flight, 가상 세션 만료 뒤 보호 변경 거부 |
| `tests/bids.test.ts` | 검색/필터/페이지/코드/nullable/KST, 목록→상세 ID, AWARDED·개찰 표시, 부분 실패와 HTTP DTO |
| `tests/account-repositories.test.ts` | 읽음↔미확인 건수, 구독↔조회, 필터 버전 충돌, 이메일 인증/재전송/주소/ONOFF, 상태 복원·계정 격리·취소 |
| `tests/company.test.ts` | auth API + 회사 mock, 신청·초대·등록/overview, OCR retry/replacement/version/idempotency, checksum·PUT·opaque handle, 업로드 계정 교체, 성공+refresh 401/403, nested 손상 공간 초기화 |
| `tests/http-contracts.test.ts` | 동일 notifications/bidAlerts/personalFilters/notificationSettings 계약을 HTTP wire fetch 대역과 mock에 적용 |
| `tests/architecture.test.ts` | alias·상대경로·동적 import의 UI HTTP/mock/DTO 직접 참조와 HTTP 값 import 금지, client entry·use client 루트의 server-only 유입 금지 |

취소·refresh·file PUT·버전 충돌을 단순 화면 캡처만으로 완료 처리하지 않고 계약 테스트로 확인한다. 비동기 Server Component는 아래 실제 Next 실행도 별도로 거쳤다.

## 브라우저 검증

- 독립 Playwright Chromium 세션, `http://localhost:3820`에서 **빌드 후 `pnpm start`**로 실행했다. 실제 HTTPS OAuth·CORS·쿠키 통합 검증을 대체하지 않는다.
- 기본 데스크톱 1280×900, 모바일 390×844. 로그인·가입·회사 선호 입력·지역 필터·알림·나의 회사 6개 화면의 가로 넘침이 없었고 실제 조작을 수행했다. 수신 설정의 390px 인증·전환도 별도 확인했다. 아래 표의 새로고침은 같은 탭의 hard reload다.
- 합성 계정·회사·파일·인증번호만 사용했다. 실제 token/cookie/개인정보·API 응답·서명 URL을 QA 로그에 기록하지 않았다.
- mock 브라우저 guard는 외부 HTTP 요청을 집계하고 차단한다. 서버 guard도 외부 fetch를 차단한다. **0건은 차단 횟수가 0이며 실제 관찰한 외부 요청도 0인 결과**다.

### 전체 mock

| ID | 조작과 결과 | 판정 |
| --- | --- | --- |
| RM-01 | static Q&A → 목록 → 숫자 ID/분류번호 상세; KST·금액 nullable·낙찰 완료·참여업체·연관공고 표시 | PASS |
| RM-02 | 비로그인 → 가상 계정 1 → 로컬 callback → 요청한 상세 경로 복귀; 계정 2 전환 | PASS |
| RM-03 | 가상 신규 가입: signup 새로고침 → 필수 약관 → 가입 → 로그인 전 저장한 초대 문맥 복원 → 수락 | PASS |
| RM-04 | 공고 알림 ON → 재조회/새로고침에서 ‘알림 받는 중’ | PASS |
| RM-05 | 받은 알림 20→25건 더 보기, 첫 항목 읽음으로 헤더 22→21건; 새로고침 유지 | PASS |
| RM-06 | 이메일 ON, 잘못된 인증번호 오류 시 주소 유지, 30초 후 재전송, 1234 확인 후 주소 변경·새로고침; 390px overflow 없음 | PASS |
| RM-07 | 사업자번호 → 처리 → 정보/실적/선호 → 미인증 회사 등록 → 나의 회사 새로고침 | PASS |
| RM-08 | 합성 PDF → 업로드/처리 중 새로고침 복원 → 등록 제안 → 인증 회사 등록 → 나의 회사 | PASS |
| RM-09 | 지역 필터 저장 → 새로고침 → 내 맞춤 수동 적용 → `personal=1`, `bidTypes=CONSTRUCTION`, `regionCodes=11`; 초기화 | PASS |
| RM-10 | 계정 교체 뒤 독립 회사·이메일 OFF·미확인 22건; 등록 화면은 새 계정의 조회 입력부터 시작 | PASS |
| RM-11 | 첨부 popup은 같은 origin `/mock/bid-attachment.txt`; 외부 첨부 요청 없음 | PASS |
| RM-12 | 개발 표시에서 초기화: 현재 mock 공간 제거·비로그인 시작; 별도 합성 legacy API 문서 키는 보존 | PASS |
| RM-13 | 최신 빌드에서 인증/증명서/회사 reload/알림/ONOFF/구독/첨부/계정 전환 재검증; 브라우저 externalObserved=0, externalBlocked=0, 서버 fetch=0 | PASS |
| RM-14 | 390px에서 signup reload·가입 → 기존 auth/start → 사업자번호/선호/등록 완료 → 지역 저장/개인 필터 적용 → 알림 읽음/더 보기 → 나의 회사; 6개 화면 overflow=false, 외부 관찰/차단 모두 0 | PASS |

RM-13은 독립 검토로 수정된 가상 세션 만료 검사와 등록 AccountScope가 포함된 최신 소스의 빌드에서 재실행했다. 초기 계정 전환 QA가 callback 완료 전에 다음 페이지로 이동해 대기 시간 초과된 경우는 callback 완료를 기다려 다시 실행했다. 제품 오류로 분류하지 않았다.

### API 구현 + HTTP 대역

| ID | 조작과 결과 | 판정 |
| --- | --- | --- |
| RW-01 | 서버 공개 목록·metadata·상세를 합성 백엔드 DTO로 응답; static Q&A → dynamic 목록·상세와 nullable/KST/낙찰 결과 확인 | PASS |
| RW-02 | Google 시작 URL → 합성 302 callback → session completion → 계정 인증; 실제 Google/OAuth 연결 없음 | PASS |
| RW-03 | 사업자번호 등록 성공 후 refresh 401; **완료 화면과 sessionWarning 유지** | PASS |
| RW-04 | upload session → 합성 storage PUT 1건 → 완료/처리/제안/등록 → refresh 401; **인증 등록 완료 화면과 경고 유지** | PASS |

서버 fetch 28건은 모두 wire fixture가 처리했다. 브라우저 요청도 route.fulfill로 처리했다. 실제 외부 TCP 연결이나 백엔드 데이터를 사용하지 않았다. checksum/credentials/header/idempotency 세부 옵션은 회사 계약 테스트에서 별도로 검증한다.

### hybrid

빌드: auth/bids/bidAlerts/personalFilters API, company/notifications/notificationSettings mock. 시작 환경의 profile을 api로 지정해도 빌드 snapshot의 3개 mock 그룹이 유지됐다.

| ID | 조작과 결과 | 판정 |
| --- | --- | --- |
| RH-01 | HTTP 대역 인증 계정 + mock 증명서/회사 등록 → 나의 회사 reload; HTTP의 회사 응답/세션 회사 상태를 덮어쓰지 않음 | PASS |
| RH-02 | mock 알림 읽음/더 보기와 mock 이메일 ON→reload 유지; 해당 3개 그룹 API 호출 0건, mock storage PUT 0건 | PASS |
| RH-03 | public API 입찰 표시 유지; 브라우저에는 auth refresh와 개인 필터 API 요청만 발생 | PASS |

서버 공개 입찰 fetch 8건은 전부 HTTP wire 대역이다. 실제 로그인·입찰 서버의 통합 성공을 뜻하지 않는다. API 인증 계정의 ID는 mock namespace 구분에만 사용하고 이메일 기본값도 `example.test` 합성 값이다.

## 재현 도구와 증거

저장소의 QA helper는 독립 테스트용이며 앱 런타임에서는 import하지 않는다.

- `tools/qa/fetch-guard.cjs`: `NODE_OPTIONS=--require ...`로 서버 외부 fetch를 차단/집계. 공개 API DTO는 `MATE_QA_WIRE_FILE`을 지정할 때만 처리한다. 로그는 건수·Node 버전이며 주소/본문/인증정보를 남기지 않는다.
- `tools/qa/bid-wire-fixtures.json`: 공개 목록·상세용 합성 DTO.
- `tools/qa/browser-wire.js`: Playwright CLI `run-code --filename`으로 설치하는 합성 인증/업무/storage 응답. real API 통합용으로 사용하지 않는다.
- `tools/qa/mock-browser-guard.js`: localhost:3820 밖의 브라우저 HTTP 요청 집계·차단. 탐색 전에 설치한다.

```bash
# mock 빌드 후, 독립 QA 서버
MATE_APP_ENV=preview MATE_DATA_PROFILE=mock pnpm build
MATE_APP_ENV=preview MATE_QA_FORBID_EXTERNAL=1 \
MATE_QA_FETCH_LOG=/tmp/mate-repository-qa/mock-server-fetch.ndjson \
NODE_OPTIONS="--require $PWD/tools/qa/fetch-guard.cjs" \
pnpm start --port 3820 --hostname 127.0.0.1
```

API 대역은 API로 재빌드하고 `MATE_QA_WIRE_FILE="$PWD/tools/qa/bid-wire-fixtures.json"`을 시작 환경에 추가한다. 독립 브라우저에 browser-wire를 설치한 뒤 조작한다. profile 전환 전에는 QA 서버를 종료하고 재빌드한다. 개인 브라우저·실제 계정으로 helper를 실행하지 않는다.

로컬 산출물은 `/tmp/mate-repository-qa`에 있다. 임시 파일이므로 아래 재현 절차와 저장소 테스트가 장기 증거이며 캡처는 해당 실행의 보조 증거다.

- `final-test.txt`, `final-lint.txt`, `final-api-build.txt`, `storybook-build.txt`.
- `production-mock-build.txt`, `production-mock-start.txt`.
- `final-mock-browser-metrics.txt`, `final-mock-server-fetch.ndjson`, `hybrid-browser-wire-metrics.txt`, `hybrid-server-fetch.ndjson`, `api-browser-wire-metrics.txt`, `api-server-fetch.ndjson`.
- `api-business-refresh401.png`, `api-document-refresh401.png`, `hybrid-company.png`.
- `mock-bid-alert.png`, `mock-notifications.png`, `mock-email-mobile.png`, `mock-company-connected.png`, `mock-personal-filter.png`.
- `mobile-mock-metrics.txt`, `mobile-mock-server-fetch.ndjson`, `mobile-login.png`, `mobile-signup.png`, `mobile-company.png`, `mobile-filters.png`, `mobile-notifications.png`.

## 실제 서버 통합: 대기 유지

이번 리팩터링에서 실제 가입·회사 등록·초대·메일 발송·설정 변경은 실행하지 않았다. 계정/회사/테스트 알림·Mailpit 접근과 변경·복구 범위를 정해 별도로 승인받아 진행한다.

- 인증/회사/소속: `auth.md`, `my-company.md`의 기존 대기·차단 유지.
- 공개 홈/목록/상세: `home.md`, `bid-list.md`, `bid-detail.md`의 실제 테스트 데이터 기반 QA 대기 유지.
- 구독/필터/알림/메일: 관련 기능별 문서의 대기 항목을 유지한다. 기존 실제 통과 이력도 이 작업의 PASS로 재분류하지 않는다.
- 실제 HTTPS SameSite cookie, Google/OIDC, CORS, presigned storage, 백엔드 멱등성/권한/발송 의미는 HTTP 대역으로 증명할 수 없다.
- CI workflow를 추가했지만 원격 CI·Chromatic 실행과 배포는 수행하지 않았다.

## Review Gate

최종 context-audit·독립 verifier·ai-review 모두 **PASS**, 미해결 Blocker/Major/Minor 없음. 판정과 미실행 범위는 [repository-review.md](./repository-review.md)에 기록했다. 독립 검토 이후에는 판정·완료 상태 기록만 갱신했고 실행 코드와 테스트는 변경하지 않았다.

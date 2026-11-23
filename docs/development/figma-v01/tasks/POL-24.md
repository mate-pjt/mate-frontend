# POL-24 · 네이버 로그인 지원 여부 결정

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 정책 결정
- 원본 항목: O02
- 선행 작업: [DOC-001](DOC-001.md)
- 목적/범위: MVP 지원 여부와 지원 시 OAuth/계정 연결·중복 가입 계약을 결정한다. 추천: 운영/백엔드 지원이 확보되기 전 준비 중을 유지한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### O02 · 네이버 로그인
- 기준선: UI **준비 중**, 동작 **보류**, 데이터 **프론트 연결 없음**. 검증: 코드 대조.
- 남은 점: 지원 여부·OAuth 계약 확정 후 구현 또는 시안에서 범위 제외
- Figma: [2306:88681](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2306-88681)
- 소유 소스/기존 기록: [src/app/auth/login-choices.tsx:19](../../../../src/app/auth/login-choices.tsx)、[docs/qa/auth.md:86](../../../../docs/qa/auth.md)

## 완료 기준

- [x] [범위 제외의 기존 승인 근거](#pol-24-contract)를 기록했다.
- 지원 시 시작/callback/세션·기존 Google 계정 충돌·테스트 조건을 확정한다. 이번 MVP 범위에서 제외돼 [DEV-48 재개 조건](#pol-24-dev-48-boundary)으로 남겼다.
- [x] 원문/소유 소스·버전·확인 가능한 결정 기록 시각·선택/보류 이유를 기록했다. [결정](#pol-24-contract) · [소유 근거](#pol-24-evidence)
- [x] 기존 중앙 승인을 확인하고 후속 개발의 범위/완료 기준/재개 조건을 갱신했다. [DEV-48](DEV-48.md#dev-48-pol-24-handoff) · [Review Gate](../reviews/POL-24.md)

## 2026-10-27 · 착수 전 후보 기록

이 기록은 작업 후보 정의다. DOC-001 외의 작업은 아직 실행하거나 설계 승인을 받은 상태가 아니다. 착수 시 아래를 현재 소스 기준으로 채우고 편집 전에 제시한다.

- 요구사항/성공 기준 확정: 미작성.
- in/out scope와 확인한 기존 패턴: 위 후보 범위를 검토해 확정.
- 수정 대상 파일·영향·구현 단계: 미작성. 위 근거는 수정 허용 파일 목록이 아니다.
- 검증 계획/실제 명령·환경·계정/변경/복구 승인: 미작성.
- blocking ambiguity/정책 근거: 미작성. 미결이면 설계 전 질문 최대 3개와 추천안을 제시.
- 가정/제외·낮은 위험의 선택: 미작성. API/DTO/데이터 흐름 설계 전 data-access.md 필독.

## 결정 기록

| 날짜 | 질문/선택지와 추천 | 결정·근거·승인자/원문 | 영향 |
| --- | --- | --- | --- |
| 2026-10-27 | 작업 후보 분해 | 정책·API·제품 동작 신규 승인 없음 | 착수 시 Gate 수행 |

## 체크포인트 · 재개 메모

| 시각/실행자 | 환경·branch/HEAD·작업트리 | 수행/결과·근거 | 다음 행동·차단/재개 조건 |
| --- | --- | --- | --- |
| 2026-10-27 / 문서화 | feature/my-company-overview / f84af24b5f9d + 기존 미커밋 변경 | 보고서에서 작업 정의만 생성. 구현/실제 QA 미실행 | 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다. |

## 2026-10-27 · 후보 당시 검증·리뷰·인계 기록

| 구분 | 실행 명령/사례·환경 | 결과 | 증거/미실행 이유 |
| --- | --- | --- | --- |
| 이번 작업 | 미실행 | 미판정 | 기준선의 과거 결과와 구분 |

- 자동 수정 시도: 0/3. 실패 시 명령·오류·원인·최소 수정·재검증 결과를 추가한다.
- Documentation Update Check: 착수 후 판단. base/architecture/data-access/plan/harness/ai-failures 중 영향 문서와 갱신/미갱신 이유를 기록.
- Review Gate: 미실행. verifier와 ai-review의 결과/대상 diff·후속 변경 재검토 여부를 기록.
- 커밋/PR: 없음. 추후 커밋할 때 하나의 목적·영어 type/한국어 메시지, 런타임/테스트/문서는 가능한 별도 커밋.
- 다음 작업 인계: WBS에서 선택. 이 단위의 필수 검증 PASS 전에 다른 기능으로 자동 전환하지 않는다.

<a id="pol-24-dev-47-handoff"></a>

## 2026-11-23 · DEV-47에서 선정 및 인계

- [DEV-47](DEV-47.md#dev-47-close)의 BKEY 로컬 검증과 두 리뷰 뒤 [WBS](../README.md)의 P0~P2 차단·미충족 선행과 P3 순서를 적용했다. [DOC-001](DOC-001.md)이 완료된 첫 P3 정책 작업으로 POL-24를 선정했다. O02 제품 연결 후보는 [DEV-48](DEV-48.md)이다.
- 첫 행동은 최신 `main`의 [로그인 선택](../../../../src/app/auth/login-choices.tsx)과 위 O02 시안의 지원 상태를 대조하고, 백엔드 GitHub·개발 Swagger의 네이버 시작·callback·세션 계약과 합성 QA 자원 유무를 확인하는 것이다. MVP 지원 여부, 기존 Google 계정의 연결·충돌 처리와 검증 조건을 자체 요구사항 Gate에 올린다.
- 이 기록은 선정과 인계다. 현행 계약 조사와 정책 결정은 POL-24의 자체 Gate에서 진행한다.

<a id="pol-24-brief"></a>

## 2026-11-23 · 요구사항과 문서 설계

- **요구사항과 성공 기준** — O02 네이버 로그인의 MVP 지원 범위를 승인된 인증 정책으로 확정한다. O02 시안·현행 로그인·백엔드 계약 근거와 현재 적용 범위, 후속 [DEV-48](DEV-48.md)의 재개 조건을 연결한다. 문서와 두 리뷰를 검증한 뒤 WBS의 후속 Task 하나를 선정한다.
- **선행과 시작점** — [DOC-001](DOC-001.md)의 `9eae9c0`이 `main`에 포함됐다. DEV-47의 [PR #109](https://github.com/mate-pjt/mate-frontend/pull/109)는 `6f258f04433418a1d1a8ad684729f982e4a83b3c`로 병합됐다. 2026-11-23 16:49 KST에 같은 SHA의 깨끗한 로컬·원격 `main`에서 `docs/pol-24-naver-login-policy`를 만들었다. 확인된 선행 미커밋 변경과 동명 브랜치는 없었다.
- **편집 범위와 검증** — 이 결정 기록, DEV-48의 후속 기준, `auth.md`의 QA 경계, `plan.md`의 날짜별 근거, 독립 검토 기록, WBS와 다음 Task의 선정 인계를 수정한다. [data-access.md](../../../ai-context/data-access.md#5-http인증-계약), 로그인 선택·세션 및 공개 auth Repository, 인증 QA와 O02 원본 연결을 확인했다. 링크/앵커·79개 원본·WBS 의존성·기존 이력·Markdown·`git diff --check`와 read-only verifier·`ai-review`를 적용한다.
- **승인과 제외 범위** — 기존 승인된 중앙 ADR을 이번 MVP 판단에 적용한다. 2026-11-23 이번 사용자 요청은 이 정책 작업의 문서 검증·두 리뷰·목적별 커밋·push·PR·조건부 정상 병합·로컬 fast-forward와 해당 PR의 Chromatic 월간 한도 예외를 승인했다. UI·auth 구현, 실제 OAuth 또는 업무 API, 계정·운영 설정 변경, 배포는 이번 작업의 범위 밖이다.
- **Gate 판단** — 중앙 결정의 Google 단독 범위가 유효해 이번 판단을 막는 정책 공백이 없다. 노출 차이는 O02 버튼의 상태·문구에 한해 기록한다. 미래 네이버 지원 시의 계정 연결·중복 가입 규칙이나 QA 자원은 해당 소유자의 새 결정을 기다린다.

### 현재 체크포인트

| 시각·실행자 | 기준 | 확인 결과 | 다음 행동 |
| --- | --- | --- | --- |
| 2026-11-23 16:49 KST · Codex | `docs/pol-24-naver-login-policy`, `6f258f0`, 시작 작업트리 깨끗함 | 기존 중앙 승인·Figma O02·현행 프론트/백엔드·개발 OpenAPI 대조로 요구사항 Gate 통과 | 근거와 MVP 결정, DEV-48 재개/검증 기준을 기록하고 문서 검증을 실행한다. |
| 2026-11-23 16:54 KST · Codex | 같은 branch/HEAD, POL-24 Markdown | 문서 검증과 갱신 확인 통과. [근거](../reviews/POL-24.md#pol-24-doc-verification) | 두 리뷰 결과를 확인한 뒤 종료와 다음 선정 인계를 기록한다. |
| 2026-11-23 16:56 KST · Codex | 같은 branch/HEAD, 리뷰 diff 6개 | 독립 verifier와 ai-review가 문서 검토 범위를 통과했다. [두 리뷰](../reviews/POL-24.md) | 종료/WBS와 다음 선정 인계를 반영한 최종 문서 diff를 재검증·재리뷰한 뒤 전달한다. |

<a id="pol-24-contract"></a>

## MVP 지원 결정 · 2026-11-23 KST 확인

| 결정 | 승인 원문과 버전 | 적용 |
| --- | --- | --- |
| MVP 소셜 로그인은 **Google만 지원**한다. 네이버 인증은 MVP 범위에서 제외한다. | 인증 정책 소유 저장소 `mate-docs`의 [ADR-0009 최초 Accepted 기록](https://github.com/mate-pjt/mate-docs/blob/7273aef68b34741f0104f8683952c74ed01dbd40/docs/decisions/ADR-0009-google-oauth-only-browser-session.md). 최초 기록 커밋 시각 2026-08-28 19:10:34 KST. [현행 ADR-0009](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/decisions/ADR-0009-google-oauth-only-browser-session.md)와 [ADR-0015](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/decisions/ADR-0015-oauth-attempt-bound-session-completion.md)는 현재 중앙 `main` 기준이다. ADR-0015 기록 커밋 시각 2026-09-29 02:18:38 KST. | 현행 제공자·서버 구현과 승인 범위가 일치한다. 네이버 제공자 추가에는 별도의 identity·claim 검증, 계정 연결과 장애 처리 결정이 필요하다. |
| `/auth`의 네이버 ‘준비 중’ 안내는 비활성 상태로 유지한다. | 최초 ADR-0009의 구현 경계에 비활성 ‘준비 중’이 명시돼 있다. 현행 ADR-0009도 Google 외 제공자를 로그인 가능한 선택지로 표시하지 않도록 한다. | Figma의 초록색 버튼과 다른 비활성 표시·문구의 근거다. 적용 범위는 O02 버튼의 상태와 안내 문구다. |
| 기존 계정의 식별 기준은 `GOOGLE + sub`다. | [계정과 Google 소셜 identity](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/auth/account-and-social-identity.md) 및 ADR-0015. 세션 발급은 유효한 기존 계정 완료 또는 신규 가입의 최종 단계에서 한다. | 확인 이메일은 로그인 키가 아니다. 현재 정책은 같은 이메일만으로 계정을 자동 연결하지 않는다. 네이버와의 연결·충돌·중복 가입 처리 규칙은 지원 검토 시 소유자가 결정한다. |

ADR-0015는 callback 시점의 세션 발급, 별도 완료 credential 및 재교환 정책을 대체했다. Google 단독과 subject 식별은 계속 적용한다. 승인 근거는 중앙 인증 정책의 `Accepted` 결정이다. 원문에는 개인 승인자와 실제 승인 시각이 별도로 표시돼 있지 않아 확인 가능한 기록 커밋 시각을 적었다. 이번 확인 시각과 Git 전달 승인은 [착수 기록](#pol-24-brief)에 남겼다.

<a id="pol-24-evidence"></a>

## O02 소유 근거와 확인 수준

| 구분 | 2026-11-23 KST 확인 내용 |
| --- | --- |
| 시안과 상태 | [O02 `2306:88681`](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2306-88681)의 메타데이터와 화면을 읽었다. Google 버튼 아래에 초록색 ‘네이버 로그인’ 버튼이 표시된다. 화면 자료의 확인 범위는 이 로그인 프레임의 버튼과 문구다. |
| 프론트 소스 `6f258f0` | [로그인 선택](../../../../src/app/auth/login-choices.tsx)의 네이버 버튼은 `disabled`이고 클릭 핸들러가 없다. `aria-label`과 문구에 ‘준비 중’이 있다. [auth 공개 진입점](../../../../src/data/auth/client.ts)과 [HTTP Repository](../../../../src/data/auth/http-repository.ts)는 Google 시작·완료를 사용한다. mock 인증은 별도 합성 경로다. |
| 백엔드 GitHub | [개발 `dev` `db89ea0`](https://github.com/mate-pjt/mate-backend/tree/db89ea09372efbf55a117f65a686da02071f9858), [기본 `main` `4b5f31d`](https://github.com/mate-pjt/mate-backend/tree/4b5f31de578c41e698dda9c99e66149b7292f031)의 인증 파일과 provider enum을 대조했다. 개발의 [provider enum](https://github.com/mate-pjt/mate-backend/blob/db89ea09372efbf55a117f65a686da02071f9858/mate-api/src/main/java/kr/co/mate/mate_api/domain/auth/enums/SocialAuthProvider.kt)은 `GOOGLE`만 허용한다. [Google 시작·callback](https://github.com/mate-pjt/mate-backend/blob/db89ea09372efbf55a117f65a686da02071f9858/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/auth/oauth/GoogleOAuthController.kt)과 [완료](https://github.com/mate-pjt/mate-backend/blob/db89ea09372efbf55a117f65a686da02071f9858/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/auth/oauth/GoogleOAuthSessionCompletionController.kt)는 Google 경로다. [V78의 provider 제약](https://github.com/mate-pjt/mate-backend/blob/db89ea09372efbf55a117f65a686da02071f9858/mate-api/src/main/resources/db/migration/V78__google_oauth_foundation.sql)도 Google만 정의한다. |
| 개발 CI·배포 기록 | 동일 `dev` SHA의 CI에서 `verify`, `publish`, `deploy`가 성공했다. `deploy-prod`는 skip이었다. [run 45090536939](https://github.com/mate-pjt/mate-backend/actions/runs/45090536939) |
| 게시 개발 명세 | [OpenAPI GET](https://api-test.mate-bid.com/v3/api-docs) `200`, OpenAPI `3.1.0` / `v1`, SHA-256 `e33531df581c8a7fd545ee728604dfe8207b3f4c9a81341af09a59566ed93d38`. Google 시작·callback·완료와 공통 가입/refresh/logout이 있고 네이버 경로·스키마는 확인되지 않았다. 시작의 `query` 표기는 소유 소스와 [Google runtime](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/runtime/auth/google-browser-login.md)의 필수 `returnOrigin`과 대조했다. |
| 실행 버전·실제 응답·QA 자원 | 배포 기록과 게시 명세까지 확인했다. 실행 프로세스 SHA·이미지 digest 대응, 로그인/가입의 실제 응답과 네이버용 합성 계정·허용 Origin·사용/정리 범위는 확인되지 않았다. 이번 앱·OAuth·업무 API·mock·HTTP 대역 실행은 0건이다. [기존 인증 QA와 이번 범위](../../../qa/auth.md#pol-24-o02-qa) |

<a id="pol-24-dev-48-boundary"></a>

## DEV-48 재개에 필요한 근거

- 중앙 인증 정책 소유자가 제공자 추가와 O02 활성 상태를 승인해야 한다. 백엔드·운영 소유자는 provider 식별자와 검증할 claim, 시작·callback·최종 세션과 신규 가입의 게시 계약·권한·오류 및 개발 배포와 실행 버전 대응을 제공해야 한다.
- 기존 Google 회원의 본인 확인과 연결 방식, 동일 이메일 충돌, 이미 연결된 identity, 신규 가입 중복·동시 제출의 처리 및 가입 시 확인 이메일의 의미를 소유자가 확정해야 한다.
- QA·운영 소유자가 신규/기존/충돌 합성 계정, 허용 환경, 취소·오류·만료 재현, 사용·변경·잔존·복구 범위를 승인해야 한다. [DEV-48 요구사항 재개 및 완료 기준](DEV-48.md#dev-48-pol-24-handoff)

현재 MVP 결정에 따라 후속 연결을 보류한다. 새 결정을 검토할 때 위 조건과 현행 소스를 DEV-48 자체 Gate에서 확인한다.

<a id="pol-24-verification"></a>

## 문서 검증과 갱신 범위

- `git diff --check 6f258f0`와 Python 3.14.6 문서 검증을 통과했다. 신규 링크·앵커/Markdown, 79개 원본·114개 Task·156개 선행 연결과 상태 집계, 이전 기준선·연결표·인증 QA 원문 보존을 확인했다. 자동 수정 시도 0/3. [검증 근거](../reviews/POL-24.md#pol-24-doc-verification)
- 정책과 DEV-48 재개 조건, [인증 QA 범위](../../../qa/auth.md#pol-24-o02-qa), [plan.md](../../../ai-context/plan.md)의 날짜별 이력을 갱신했다. 기준선과 `coverage.md`의 원본 연결이 같고, 패키지·구조·데이터 접근·하네스 규칙에 영향이 없어 관련 공통 문서와 설정의 갱신이 필요 없다.
- 로컬 `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm build-storybook`는 문서 전용 diff라 미실행이다. Figma·소스·게시 명세를 확인했고 실제 서비스의 인증/업무 API, 앱 브라우저 및 mock/HTTP 대역은 미실행이다. 기존 승인된 예외와 인증 QA의 대기·부분 결과를 보존했다.

<a id="pol-24-close"></a>

## 종료 범위와 다음 선정 · 2026-11-23 KST

MVP의 Google 단독 지원과 O02의 비활성 안내에 관한 정책·문서 범위를 검증했다. DEV-48의 네이버 활성화는 [신규 정책·계약·QA 조건](#pol-24-dev-48-boundary)이 필요한 후속 범위다. 기존 화면 검증/실제 통합 결과는 [인증 QA](../../../qa/auth.md#pol-24-o02-qa)를 따른다. 종료 diff에는 [문서 검증과 두 리뷰](../reviews/POL-24.md)를 적용한다.

P0~P2의 차단·미충족 선행과 DEV-48의 MVP 범위를 반영하면, DOC-001이 완료된 [POL-25](POL-25.md)가 착수 가능한 첫 P3 정책이다. 다음 첫 행동은 S07 시안과 설정의 현재 진입 상태를 대조하고, 이용안내 원문·운영 소유자·열람 조건과 내부/외부 목적지의 승인 근거를 확인하는 것이다. 이번에는 선정과 인계만 기록했다.

<a id="pol-24-delivery"></a>

## Git 전달 기준

2026-11-23 사용자 승인 범위의 정책 문서와 종료 인계를 목적별 커밋으로 전달한다. [작업 브랜치의 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fpol-24-naver-login-policy)에서 최종 head, 원격 검사·리뷰, `main` 병합 결과를 확인한다. 이번 예외는 해당 PR의 Chromatic 월간 한도 실패에 한한다. 실제 원격 검사와 `main` 동기화는 전달 단계에서 확인한다.

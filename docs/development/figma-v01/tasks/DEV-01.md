# DEV-01 · 정식 약관 본문·동의 버전 연결

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: O03
- 선행 작업: [POL-01](POL-01.md)
- 목적/범위: 확정된 문서와 버전을 가입 동의·법적 문서 경로에 연결한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

<a id="dev-01-pol-01-approved-handoff"></a>

## 2026-11-26 · POL-01 정책 인계

- 사용자가 승인한 서비스 이용약관·개인정보 처리방침 두 원문을 가입 동의에 연결한다. 가입 화면의 두 필수 동의를 유지하고 서버가 반환한 `code`·`version`을 제출한다. 원문 시행일 입력은 문서 관리 작업이다. UI에 별도 버전·시행일 표시를 추가하지 않는다. 기존 테스트 계정의 이관·재동의는 사용자 결정으로 제외한다. [확정 정책](POL-01.md#pol-01-approved-policy)
- 첫 행동은 문서 관리 역할의 비로그인 뷰어 권한과 인증 백엔드 역할의 운영 원문·`code`·`version` 대응을 확인하는 것이다. 2026-11-26 09:13 KST 두 Google 문서는 링크 보유자에게 편집 권한이 있었고 서버의 정식 적용 버전과 실행 대응은 미확인이다. 승인 원문과 읽기 전용 운영 주소를 확보하고 등록 버전을 확인한 뒤 공개 연결을 검증한다. [재개 자료](POL-01.md#pol-01-final-handoff)
- AUTH-02·03의 기존 테스트 이력을 이어간다. 공개 문서 열람과 승인 버전, 누락·다른 버전 처리, 정식 신규 가입의 실제 실행 근거를 해당 작업에서 따로 검증한다. 이 절은 인계 기록이다. [인증 QA](../../../qa/auth.md#pol-01-approved-auth-qa)

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### O03 · 필수 약관 동의·본문
- 기준선: UI **동의 UI 구현**, 동작 **테스트 동의 구현**, 데이터 **임시 본문/버전**. 검증: 코드 대조.
- 남은 점: 공개 전 정식 본문·URL·버전·이전 동의 처리 결정 및 연결
- Figma: [3140:119739](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-119739)
- 소유 소스/기존 기록: [src/app/auth/signup/signup-form.tsx:137](../../../../src/app/auth/signup/signup-form.tsx)、[src/app/auth/legal/[document]/page.tsx:18](../../../../src/app/auth/legal/[document]/page.tsx)、[docs/qa/auth.md:88](../../../../docs/qa/auth.md)

- 이어갈 QA 기록: [auth.md](../../../qa/auth.md). 기존 case ID와 통과/대기/차단 기록을 보존한다.

## 완료 기준

- [ ] 승인 문서를 비로그인 상태에서 읽기 전용으로 열고, 신규 가입의 필수 동의 누락·버전 불일치 처리와 서버 버전 전송을 검증한다
- [ ] 본문/버전이 승인된 원문과 일치하고 임시 문구가 남지 않는지 확인한다
- [ ] 현재 package scripts로 필요한 test/lint/build·diff-check와 영향 시 Storybook 검증을 통과한다.
- [ ] 요구사항 Gate에서 정한 실제 API/브라우저·권한·오류 사례와 필요한 QA case를 검증한다. 외부 조건으로 못 하면 차단/미실행과 이미 승인된 예외를 기록하며 전체 기능 통합 PASS로 표시하지 않는다.
- [ ] Documentation Update Check 및 verifier/ai-review를 통과한다. 구현만 마친 상태는 완료가 아니다.

## 착수 전 Implementation Brief / 설계 Gate

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

## 검증·리뷰·인계 기록

| 구분 | 실행 명령/사례·환경 | 결과 | 증거/미실행 이유 |
| --- | --- | --- | --- |
| 이번 작업 | 미실행 | 미판정 | 기준선의 과거 결과와 구분 |

- 자동 수정 시도: 0/3. 실패 시 명령·오류·원인·최소 수정·재검증 결과를 추가한다.
- Documentation Update Check: 착수 후 판단. base/architecture/data-access/plan/harness/ai-failures 중 영향 문서와 갱신/미갱신 이유를 기록.
- Review Gate: 미실행. verifier와 ai-review의 결과/대상 diff·후속 변경 재검토 여부를 기록.
- 커밋/PR: 없음. 추후 커밋할 때 하나의 목적·영어 type/한국어 메시지, 런타임/테스트/문서는 가능한 별도 커밋.
- 다음 작업 인계: WBS에서 선택. 이 단위의 필수 검증 PASS 전에 다른 기능으로 자동 전환하지 않는다.

<a id="dev-01-20261126-readiness"></a>

## 2026-11-26 KST · 공개 연결 재개 점검

- P0 개발 Task O03의 목표는 가입 화면의 두 필수 동의에 승인된 읽기 전용 원문을 연결하고 서버가 반환한 `code`·`version`으로 신규 가입을 완료하는 것이다. 동의 누락과 버전 불일치, 올바른 문서 열람과 제출을 확인해야 한다. [작업 완료 기준](#완료-기준) · [Figma 가입 3140:119739](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-119739) · [기준선 O03과 QA-16 연결](../coverage.md)
- 2026-11-26 사용자가 두 원문과 신규 가입 범위를 확정했다. 화면에 버전·시행일을 추가하지 않으며 원문의 시행일 입력은 문서 관리 작업이다. 기존 테스트 계정의 동의 이관·재동의, 푸터 구현은 제외한다. [POL-01 승인](POL-01.md#pol-01-approved-policy) · [POL-01 공개 연결 조건](POL-01.md#pol-01-final-handoff)
- 이번 요청으로 DEV-01 검증·리뷰와 Git 전달, 다음 Task 인계를 승인받았다. 월간 한도로 확인된 Chromatic 문제가 이번 PR에서 발생하면 저장소의 정상 병합 조건 안에서 예외를 적용한다. 문서 권한 변경, 인증 백엔드 약관 등록 및 실제 신규 가입에 필요한 환경·계정과 변경·정리 범위는 소유 역할의 확인이 필요하다.
- 시작 시 `main`·`origin/main`은 `ea47796ff7b7a5d850b2828fead27fb80a5bdb41`로 같았고 작업트리는 깨끗했다. DOC-001 `9eae9c0`과 POL-01 정책 [PR #132](https://github.com/mate-pjt/mate-frontend/pull/132)의 main 반영을 확인했다. DEV-01의 이어갈 기존 변경과 작업 브랜치는 발견되지 않았다. fetch와 fast-forward 확인 후 `docs/dev-01-public-agreement-readiness-20261126`에서 문서 점검을 기록한다.
- 이번 점검은 가입 화면과 법적 문서 경로의 현행 코드, 백엔드 계약, 문서 권한과 QA 재개 조건을 대조한다. WBS, 이 작업 기록, 인증 QA, 검토 기록과 공통 문서 두 곳을 갱신한다. 편집 가능한 링크 또는 원문과 확인되지 않은 버전을 공개하면 가입자가 본 문서와 저장된 동의가 달라질 수 있다. 공개 연결 조건 확인 후에 제품 변경의 Implementation Brief와 설계를 확정한다.

### 확인한 소유 근거

| 근거 | 확인 결과 | 적용 범위 |
| --- | --- | --- |
| 프런트 `ea47796` | 가입폼은 `PRIVACY_POLICY`와 `TERMS_OF_SERVICE` 모두를 확인하고 서버 목록의 `code`·`version`을 제출한다. 각 링크는 새 탭으로 앱의 임시 본문을 열며 두 경로에는 임시 안내와 `noindex`가 있다. [가입폼](../../../../src/app/auth/signup/signup-form.tsx) · [법적 문서 경로](../../../../src/app/auth/legal/[document]/page.tsx) · [인증 데이터 계약](../../../../src/data/auth/contracts.ts) | O03 현재 소스 관찰. 시안과의 연결은 두 필수 동의 항목과 본문 동선에 한정하며 새 화면 예외나 픽셀 일치를 판정하지 않았다. |
| Google Drive 공유 메타데이터 | 승인 기록과 같은 제목의 `서비스 이용약관`과 `개인정보 처리방침`이 각각 한 건 조회됐다. 둘 다 링크 공유의 공개 역할이 `anyone/writer`였다. 문서 관리 역할이 정식 비로그인 뷰어 주소를 확인해야 한다. [기존 승인·권한 기록](POL-01.md#pol-01-approved-policy) | 메타데이터만 확인했다. 두 문서의 편집 가능한 주소와 문서 식별자는 기록에 넣지 않았다. 비로그인 읽기 전용 열람 시험은 대상 확보 후 수행한다. |
| 백엔드 `dev` | `f4860fd9b87329d50169eb0025dca3f2c5fa2125`의 가입 조회는 현재 필수 두 계약의 `code`·`version`·`title`을 돌려준다. 가입 트랜잭션은 잠금으로 읽은 현재 필수 목록과 제출 쌍의 중복 없는 일치를 검사하고 동의 시각과 함께 저장한다. [가입 조회](https://github.com/mate-pjt/mate-backend/blob/f4860fd9b87329d50169eb0025dca3f2c5fa2125/mate-api/src/main/java/kr/co/mate/mate_api/application/service/auth/socialsignup/SocialSignupService.kt) · [가입 완료](https://github.com/mate-pjt/mate-backend/blob/f4860fd9b87329d50169eb0025dca3f2c5fa2125/mate-api/src/main/java/kr/co/mate/mate_api/application/service/auth/socialsignup/SocialSignupTransactionService.kt) · [중앙 인증 정책](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/auth/account-and-social-identity.md#L93-L149) | 초기 마이그레이션의 두 `v1`은 시드다. 승인 원문과 현재 적용 레코드의 대응은 별도 증거가 필요하다. [마이그레이션](https://github.com/mate-pjt/mate-backend/blob/f4860fd9b87329d50169eb0025dca3f2c5fa2125/mate-api/src/main/resources/db/migration/V78__google_oauth_foundation.sql#L49-L76) |
| 개발 배포 기록 | 같은 SHA의 verify·publish·test deploy가 성공했고 test deploy는 09:08 KST에 완료됐다. 운영 deploy job은 skipped였다. [개발 배포](https://github.com/mate-pjt/mate-backend/actions/runs/45723770088/job/139596909303) | 실행 중 서버의 SHA·이미지 식별자와 대상 환경의 현재 약관 DB 버전은 확인되지 않았다. |
| 공개 게시 OpenAPI | HTTP 200 응답에서 OpenAPI 3.1.0·문서 `v1`·110 paths를 확인했다. 가입 GET은 `flowId`·`Origin`과 `requiredAgreements`를, POST는 `agreementAcceptances`와 `409 SOCIAL_SIGNUP_AGREEMENT_MISMATCH`를 정의한다. 두 모델에 문서 URL·시행일은 없다. 문서 SHA-256은 `9711e22b705d79ded53428d1a0ba157bae2894a46999a83899d8324fc4459ea4`다. [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs) | 게시 계약 증거다. 실제 가입 API GET·POST는 실행하지 않았다. |

### 남은 조건과 다음 확인

| 조건 | 필요한 역할과 확인 |
| --- | --- |
| 공개 원문 | 문서 관리 역할이 승인된 두 문서의 읽기 전용 공개 주소를 지정하고, 두 주소를 비로그인으로 열어 승인 원문과 뷰어 모드를 확인한다. |
| 서버 버전 대응 | 인증 백엔드 역할이 적용 환경과 실행 식별자, `TERMS_OF_SERVICE`·`PRIVACY_POLICY` 각각의 현재 `version`과 대응하는 승인 원문을 제공한다. |
| 실제 신규 가입 QA | 테스트 환경에서 사용할 합성 신규 가입과 승인된 변경·잔존·복구 범위, 동의 누락·버전 불일치의 안전한 재현 및 정리 조건을 확보한다. [AUTH-02·03 재개 사례](../../../qa/auth.md#dev-01-20261126-qa) |

위 세 항목을 09:26 KST에 확인하고 사용자에게 준비 여부를 요청했다. 두 공개 원문 링크와 현재 버전 대응을 확인할 때까지 가입폼·법적 문서 경로의 변경을 보류한다. 실제 가입과 브라우저·mock·HTTP 대역 신규 실행은 0건이다. 이 점검의 Markdown 검사와 두 리뷰는 [검토 기록](../reviews/DEV-01.md)에 남긴다.

### 문서 갱신 및 검증 체크포인트

WBS와 작업·QA·검토 기록에 확인 근거와 미실행 범위를 반영했다. `architecture.md`와 `data-access.md`를 현행 구현과 정책 결정에 맞췄다. 실행 스크립트·하네스에 변경이 없고 현행 상태는 WBS가 관리하므로 `base.md`, `harness.md`, `plan.md`는 유지한다. 출력 오류와 복구 내역은 이번 검토 기록에 남겼다. 기준선과 `coverage.md`, 기존 QA 케이스 이력도 보존했다.

Markdown의 링크·anchor, 원본 79개·Task 114개·의존성 156개, 다른 Task·기존 이력과 변경 범위를 대조했다. 이 점검은 실행 코드와 패키지에 영향이 없어 로컬 앱 test/lint/build/Storybook을 실행하지 않는다. 자동 수정 한도는 3회이며 제품 수정 시도는 0회다. 검증 다음 단계는 이 문서 범위의 read-only verifier·`ai-review`와 독립된 Git 전달이다.

<a id="dev-01-20261126-handoff"></a>

### 다음 Task 선정과 첫 행동

WBS에서 선행이 충족된 대기·준비 Task는 없다. DEV-02는 POL-01과 DEV-01의 목적지가 필요하고, QA-16은 두 개발 및 기존 실제 QA를 기다린다. 새 재개 근거가 확보된 다른 Task가 없어 P0의 **DEV-01**을 다음 재개 확인 대상으로 유지한다. 문서 관리 역할의 두 뷰어 주소와 인증 백엔드 역할의 원문별 `code`·`version` 대응부터 읽기 전용으로 확인하고, QA 실행 범위를 대조한다. [현재/다음과 의존성](../README.md)

<a id="dev-01-20261126-link-release"></a>

## 2026-11-26 KST · 현행 원문 URL 우선 반영 결정

- 2026-11-26 사용자는 두 Google 문서의 `anyone/writer` 공유 상태를 확인한 뒤 “그냥 일단 편집 가능한 현재 URL 그대로 올려. 나중에 수정할게.”라고 지시했다. 두 승인 문서에 한해 현행 주소를 우선 연결한다. 문서 권한 조정과 시행일 입력은 문서 관리에 남긴다. 링크를 가진 사람은 현재 원문을 편집할 수 있다. [이전 권한 기준과 정책](POL-01.md#pol-01-approved-policy)
- 문서 주소는 프런트에서 열고, 기존 가입 API는 서버가 반환한 동의의 `code`·`version`을 제출하고 보존한다. 원문별 서버 버전 확인은 문서 링크를 열기 위한 조건과 별개로 실제 동의 기록의 대응을 검증하는 목적이다. 버전 값, 가입 계약, 백엔드 약관 데이터는 이 우선 반영 범위에서 변경하지 않는다. 사용자가 실제 QA 환경과 승인 범위를 제공하겠다고 답했으며, 환경·실행 식별자·합성 자원·잔존/복구·오류 재현의 구체 자료는 수신 대기다.
- 승인 범위는 기존 `/auth/legal/terms`와 `/auth/legal/privacy`의 문서별 주소 연결, 두 링크의 새 탭 이동, 임시 본문과 가입 안내 제거다. [가입 시안 `3140:119739`](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-119739)의 두 필수 항목과 전체 동의, 제출 및 오류 흐름을 사용한다. 기존 테스트 계정 이관·재동의, 홈 푸터, 버전·시행일 UI와 실제 가입·운영 배포는 이 변경 범위 밖이다.
- 문서 준비 브랜치를 `feat/dev-01-agreement-document-links`로 이름을 바꿨다. 시작 기준 `ea47796`과 DEV-01 Markdown 수정 6개를 보존했다. `src/app/auth/legal/[document]/page.tsx`에 고정된 두 목적지를 두고 Next의 임시 리디렉션을 사용한다. 정의되지 않은 문서 경로는 404다. 가입폼은 임시 안내 문장만 제거한다. 범위의 위험은 두 문서 목적지의 교차, 기존 동의 제출 회귀와 편집 가능한 문서의 후속 변경이다.
- 검증 계획은 Node 22.20.0의 `pnpm test`, `pnpm lint`, `pnpm build`, `git diff --check`, 격리 Next와 Playwright다. 비로그인 주소·각 리디렉션 및 잘못된 경로, 가입 화면 390px·데스크톱의 체크박스와 문서 새 탭, 누락 시 POST 0건, 합성 서버 버전 제출 및 409 오류 표시·재시도 가능 상태를 확인한다. 실제 신규 가입과 운영 버전 대응은 승인된 자료 확보 후 별도 확인한다.

### URL 우선 연결 검증

- 기존 가입 링크와 새 탭 동작을 통해 두 법적 경로가 승인 Google 문서로 `307`을 반환한다. 나머지 문서 경로는 `404`다. 비로그인 HTTP는 각각 `200`과 승인 제목을 확인했고, Chrome에서 390px·1440px의 새 탭 열람을 확인했다. 두 원문의 현재 공유 역할은 사용자가 승인한 `anyone/writer`다.
- Node 22.20.0·pnpm 11.3.0의 격리 복사본에서 `pnpm test` 1,273개, `pnpm lint`, `pnpm build`를 통과했다. `pnpm start`와 로컬 HTTP 대역의 Playwright 16건을 통과했다. 부분 동의와 필수 목록 누락은 POST를 차단했고, 두 합성 `code`·`version` 전송, `409` 오류와 폼 유지, `201` 후 시작 화면을 확인했다. 대역 POST 2건, 실제 가입 요청 0건이다. [검증과 리뷰](../reviews/DEV-01.md) · [인증 QA](../../../qa/auth.md#dev-01-20261126-url-qa)
- WBS·작업 기록·인증 QA·검토 기록과 `architecture.md`·`data-access.md`를 실제 연결에 맞췄다. 원본 매핑·기존 QA와 정책 이력을 보존했다. 실행 스크립트·하네스·공유 UI 카탈로그에는 영향이 없어 로컬 Storybook은 미실행이다. 이 범위의 Git 전달과 실제 정식 가입의 전체 판정을 구분한다. [작업 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afeat%2Fdev-01-agreement-document-links)

<a id="dev-01-20261126-resume"></a>

### 다음 Task 선정과 실제 가입 재개

두 승인 문서의 URL 우선 연결 범위를 검증했다. 승인 원문과 대상 환경의 현재 서버 버전 대응, 실행 식별자와 합성 신규 가입 QA의 사용자 승인 자료가 남아 있다. 문서 관리 역할이 권한을 변경하면 두 주소에서 비로그인 뷰어 권한을 다시 확인한다. 인증 백엔드 역할의 버전 대응 및 환경·실행 식별자를 확인한 뒤 승인된 범위에서 AUTH-02·03의 실제 성공·오류·이력 보존을 검증한다.

선행을 충족한 대기·준비 작업이 없어 P0 **DEV-01**을 다음 재개 확인 대상으로 유지한다. DEV-02와 QA-16은 기존 선행을 따른다. 첫 행동은 받은 QA 환경·버전 대응·계정 변경 및 정리 조건을 [인증 QA 사례](../../../qa/auth.md#dev-01-20261126-url-qa)와 대조하는 것이다. 다른 Task는 이번에 시작하지 않는다. [현재와 다음](../README.md)

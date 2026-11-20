# POL-17 · 계정 정보 변경·인증 방식 결정

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 정책 결정
- 원본 항목: S02, C02
- 선행 작업: [DOC-001](DOC-001.md)
- 목적/범위: 조회/수정 가능 필드·본인 확인·현재 소셜 계정과 비밀번호 지원 여부를 결정한다. 추천: 비밀번호 팝업 존재만으로 비밀번호 로그인을 추가하지 않는다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### S02 · 계정 정보 조회/관리
- 기준선: UI **카드만**, 동작 **미구현**, 데이터 **관리 계약 없음**. 검증: 코드 대조.
- 남은 점: 계정 상세 진입·인증·변경 정책과 UI 연결
- Figma: [3139:53049](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-53049)
- 소유 소스/기존 기록: [src/components/my/my-settings-home-client.tsx:14](../../../../src/components/my/my-settings-home-client.tsx)

### C02 · 정정·비밀번호·탈퇴·업로드 공용 팝업
- 기준선: UI **컴포넌트 구현**, 동작 **일부 Storybook 전용**, 데이터 **업무 API 없음**. 검증: 코드 대조.
- 남은 점: 컴포넌트 존재를 제품 기능 완료로 세지 말 것. 실제 도메인 연결 필요
- Figma: [2210:17840](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2210-17840) / [2303:89402](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2303-89402) / [2303:90900](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2303-90900) / [2264:95335](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2264-95335)
- 소유 소스/기존 기록: [src/components/ui/popup/index.ts:1](../../../../src/components/ui/popup/index.ts)、[src/components/ui/popup/popup.stories.tsx:50](../../../../src/components/ui/popup/popup.stories.tsx)、[src/components/ui/popup/popup.tsx:353](../../../../src/components/ui/popup/popup.tsx)

## 완료 기준

- [x] 현재 인증 방식과 계정 관리 계약·변경 확인/충돌을 기록한다
- [x] 비밀번호 지원/미지원과 기존 공용 팝업의 재사용/미사용 이유를 확정한다
- [x] 원문/소유 소스·버전·결정자·시각·선택/보류 이유를 기록한다. 추천안은 승인으로 간주하지 않는다.
- [x] 근거 있는 기존 승인 또는 필요한 개발자 결정을 확보하고, 후속 개발의 범위/완료 기준/차단을 갱신한다. 정책 작업도 Review Gate를 수행한다.

## 착수 전 Implementation Brief / 설계 Gate

<a id="pol-17-brief"></a>

- 요구사항은 S02 계정 정보 조회와 변경 경계, 조회에 필요한 인증, C02 비밀번호 팝업의 제품 연결 여부를 정하는 것이다. 화면·중앙 정책·현행 계약이 다른 지점을 근거와 함께 기록하고, DEV-38이 구현할 범위·대기 조건·QA를 추적할 수 있어야 한다.
- DOC-001 완료와 직전 [QA-14 종료 및 인계](QA-14.md#qa-14-handoff)의 [PR #95 병합](https://github.com/mate-pjt/mate-frontend/pull/95)을 확인했다. 시작 `main`, `origin/main`, 직접 조회한 원격 main은 모두 `7c947059dbe9c00d15248a3be2d7682cd53c7c49`였다. 기존 미커밋 및 동일 Task 브랜치가 없어 `docs/pol-17-account-policy`를 생성했다.
- 적용 근거는 [운영 규칙](../workflow.md), [데이터 접근 규칙](../../../ai-context/data-access.md), [S02·C02](../coverage.md), [QA-14 회귀](../../../qa/my-settings-home.md#qa-14-local-regression), 중앙 인증 정책과 고정 backend 소스·게시 OpenAPI다. 현행 설정 카드, 로그인·세션 Repository와 팝업의 호출 위치를 대조했다.
- 사용자 D1으로 연락용 이메일 조회 전용과 S02의 이메일 ‘인증하기’ 버튼 생략을 확정했다. 상세 라우트 경로와 구현 방법은 DEV-38의 요구사항 Gate에서 정한다. POL-18의 탈퇴 조건·UI와 다른 C02 팝업의 소유는 기존 Task를 따른다.
- 변경 문서는 이 기록, DEV-38 인계, 설정 QA, WBS, 연결표, 공통 계획의 정책 참조, POL-17 검토 기록이다. 결정/증거 → 개발·QA 재개 기준 → 문서 검증 → 두 리뷰 → WBS 종료와 Git 전달 순서로 진행한다. 연락용 이메일·Google 검증 이메일·알림 수신 이메일이나 일반 세션·별도 재인증을 혼용하는 위험을 검토한다.
- 검증은 패키지 스크립트와 실행 환경을 확인한 뒤 원본 79개·Task/의존성·WBS 상태·로컬 링크/앵커·Markdown·원본 및 변경 범위 보존과 `git diff --check`를 실행한다. Figma는 지정 노드의 구조·상태 확인으로 한정한다. 제품 구현과 기존 실제 QA는 후속 소유이며, 실제 계정/API 호출·인증/메일·개인정보 처리·중앙 저장소 편집·운영/배포·다음 작업 실행은 이 문서 작업의 승인 범위 밖이다.
- 사용자의 2026-11-20 시작 요청으로 POL-17 검증·두 리뷰·목적별 커밋·push·PR·최종 head CI/리뷰·조건부 정상 병합·로컬 main fast-forward를 승인받았다. 이번 PR의 Chromatic 월간 한도만 예외 대상이다. D1의 화면 승인과 Git 전달 승인을 각각 기록한다.

## 결정 기록

| 날짜 | 질문/선택지와 추천 | 결정·근거·승인자/원문 | 영향 |
| --- | --- | --- | --- |
| 2026-10-27 | 작업 후보 분해 | 정책·API·제품 동작 신규 승인 없음 | 착수 시 Gate 수행 |
| 2026-11-20 KST | D1. 조회 전용에서 ‘인증하기’ 생략(추천) 또는 비활성, 편집 계약까지 카드 비활성 유지 | 사용자가 이 대화의 D1에 **‘조회 전용 · 이메일 버튼 생략 (추천)’**을 선택했다. 세션으로 본인 연락용 이메일을 읽을 수 있고 계정 이메일 인증·변경 계약은 확인되지 않았다. | DEV-38의 읽기 범위와 이메일 행의 화면 예외를 확정한다. |
| 2026-11-20 KST | Google 계정 식별과 세션의 적용 범위 | 중앙 소유 문서의 Accepted ADR-0009와 세션 부분을 대체한 ADR-0015, 계정 정책을 따른다. 비밀번호 미지원과 팝업 미연결은 현행 인증 정책을 적용한 결과다. | 계정 정보 조회에 일반 세션을 사용한다. 프로필 변경을 허가하는 별도 인증 또는 Google 이외 인증을 도입하려면 별도 결정과 계약이 필요하다. |

<a id="pol-17-contract"></a>

## 2026-11-20 · 계정 정보와 인증 기준

| 항목 | 결정과 책임 |
| --- | --- |
| S02 조회 | DEV-38은 `/my`에서 본인의 계정 관리 상세를 연결하고 현재 유효한 인증 세션의 `account.email` 한 필드를 연락용 이메일 주소로 읽기 전용 표시한다. 회사 소속·회사 권한 유무는 조회 조건에 추가하지 않는다. `account.id`는 내부 계정 경계에만 사용하고 `nickname`은 기존 이름 표시 문맥을 따른다. 이름·생년월일·휴대전화·사진·Google 식별자 등의 상세 조회 또는 편집은 계약과 별도 범위 결정이 필요하다. |
| S02 본인 확인과 읽기 실패 | 기존 인증 Repository의 로그인 완료와 세션 복원에서 확인된 Account를 사용한다. 익명·만료/교체·권한 거부·계정 교체를 감지하면 이전 계정 이메일을 숨긴다. 로딩·조회 오류·이메일 누락 또는 응답 오류를 구분하고, 일시 실패에는 기존 세션의 명시 재시도를 사용한다. 로그아웃·계정 전환·화면 종료 뒤 이전 응답을 표시하지 않는다. |
| 이메일의 소유 | `account.email`은 가입 시 확인한 Google 이메일로 시작한 Mate 연락용 값이다. 같은 Google subject의 최근 확인 이메일이 갱신되어도 Mate 연락용 값은 자동 갱신하지 않는다. 알림 설정 수신처와 인증번호는 별도 업무 계약이다. 세 값의 차이를 허용하며 알림 수신처·가입 후보 이메일·사용자 입력으로 계정 이메일을 채우지 않는다. |
| 이메일 등 프로필 변경 | 현행 범위에서 변경할 필드는 없다. S02 이메일 행의 ‘인증하기’는 사용자 D1의 **명시적 화면 예외**로 생략한다. 별도 본인 확인 방식, 변경 승인 주체, 계정 연락 용도의 검증/변경은 [변경 재개 조건](#pol-17-write-gate)을 충족할 때 다시 판단한다. |
| Google과 비밀번호 | `GOOGLE + sub`의 기존 계정 연결을 유지한다. 이메일 문자열만 같은 다른 identity를 연결하거나 합치지 않는다. 현행 Mate 로그인에는 로컬 비밀번호·변경·재설정이 없다. C02 `PasswordPopup`의 Storybook 상태는 제품에 진입점이나 인증 동작을 제공하지 않는다. S02의 숨김 행을 노출하거나 해당 팝업을 DEV-38에 연결할 요구사항이 없다. |

<a id="pol-17-write-gate"></a>

### 정보 변경 재개 조건

- 제품·백엔드 소유자가 허용 필드와 원본, 동일한 계정에 귀속되는 최신 본인 확인의 주체·방식·수명·실패/복구 정책을 먼저 결정한다. 현재 로그인/일반 refresh는 세션의 유효성 확인이며, 변경용 인증 결과를 발급하는 계약은 확인되지 않았다. 일반 Google 로그인 왕복이나 알림 이메일 확인을 변경용 인증으로 재사용할 근거가 없다.
- 계정 변경 계약의 권한, 허용 형식·빈 값·부분 변경, 중복·동시 변경과 최신 값 확인, 요청 중 세션/계정 교체, 결과 유실·중복 제출·오류의 재확인 기준이 필요하다. 변경이 지원되면 완료 표시는 확인된 성공 응답과 후속 조회 기준으로 정하고, 결과 미확정·충돌에서 최신 값을 읽은 뒤 사용자가 다음 변경을 결정하도록 설계한다. 기존 값 및 토큰을 로컬 변경으로 맞추거나 다른 기능의 API로 쓰기를 대체할 수 없다.
- 백엔드 담당자가 소유 소스와 게시 명세, 실행 버전 대응을 확인하고 QA 담당자가 승인된 합성 계정·실행·복구 범위를 확보한 뒤 해당 변경의 요구사항 Gate를 연다. 이번 정책과 DEV-38의 읽기 범위에는 이 신규 계약이 선행하지 않는다. POL-18의 탈퇴 인증·권한·데이터 처리는 기존 소유 결정을 기다린다.

<a id="pol-17-evidence"></a>

### 현행 소유 근거

| 구분 | 2026-11-20 KST 확인 결과 |
| --- | --- |
| 중앙 정책 | `mate-docs/main` `c9e50ff591ae18023164e1a94581c611bf1e4f29`. 계정과 Google identity의 분리, 연락용 이메일과 최근 Google 확인값의 구분, 가입 프로필 및 세션 유효성의 책임을 확인했다. 기존 OAuth-only 결정의 세션 완료 세부는 후속 ADR이 대체한다. [Account 정책](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/auth/account-and-social-identity.md) · [ADR-0009](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/decisions/ADR-0009-google-oauth-only-browser-session.md) · [ADR-0015](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/decisions/ADR-0015-oauth-attempt-bound-session-completion.md) · [로그인 Runtime](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/runtime/auth/google-browser-login.md) |
| Backend source | `mate-backend/dev` `ab388b7cb06154a00e254eff7b124882952166ac`. 로그인 완료·가입 완료·세션 refresh는 인증 응답의 `account`에 `id`·`email`·nullable `nickname`을 반환한다. refresh는 같은 접속의 cookie를 회전시키며 서버의 Account 활성/삭제 여부, 세션 소유·만료·교체를 검사한다. 현행 refresh는 `account.name`을 `nickname`으로 반환하며 S02의 별도 이름 API는 없다. [응답](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/auth/response/AuthenticationResponse.kt) · [세션 Controller](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/auth/BrowserSessionController.kt) · [세션 유효성·계정 반환](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/application/service/auth/BrowserSessionTransactionService.kt) |
| 계약의 경계 | 가입 후보 GET과 가입 POST는 제한된 신규 가입 거래다. `name` 필수·`birthDate`·`mobilePhone` nullable 입력을 받는 가입 완료와 계정 정보 수정은 서로 다른 계약이다. 알림 수신 주소 변경/인증은 알림 설정에 귀속된다. 현재 소유 웹 경로·Account 포트에서 독립 계정 프로필 조회/변경·재인증·비밀번호 계약을 찾지 못했다. [가입 모델](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/auth/socialsignup/SocialSignupWebModels.kt) · [알림 이메일](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/notificationemail/NotificationEmailController.kt) · [Account 포트](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/application/port/out/account/AccountPort.kt) |
| CI·test 배포 기록 | 같은 source commit의 GitHub CI `44429902651` verify·publish·deploy 성공, deploy-prod skipped. test deployment `7900875985`의 상태는 2026-11-19 10:04:22 KST success다. [CI](https://github.com/mate-pjt/mate-backend/actions/runs/44429902651) · [test 배포 job](https://github.com/mate-pjt/mate-backend/actions/runs/44429902651/job/135257313150) |
| 게시 OpenAPI | `GET /v3/api-docs` HTTP 200, OpenAPI `3.1.0`, 문서 버전 `v1`, 184 paths. 응답 SHA-256 `9e0b737fd92953b9f7a668aeecb61ce32b865bb3861999f9775fdfb523d21dd2`. Google OAuth·가입·refresh·logout과 알림 이메일 설정/인증을 확인했다. `AuthenticatedAccountResponse` 스키마는 위 세 필드와 nullable nickname을 게시한다. refresh operation의 명세에는 200 응답 항목이 빠져 있어 성공 응답은 위 Controller/DTO 소스에서 확인했다. 일반 `/api/v1/me`의 계정 조회/수정과 계정 이메일 인증·재인증·비밀번호 경로는 게시 목록에서 확인되지 않았다. [개발 Swagger](https://api-test.mate-bid.com/swagger-ui/index.html) · [게시 명세](https://api-test.mate-bid.com/v3/api-docs) |
| 실행 중 서버·실제 응답 | 실행 중인 test 프로세스 SHA·image digest 대응은 미확인이다. OpenAPI 메타데이터를 조회했으며 실제 로그인·refresh·계정 변경·메일 인증 또는 업무 응답 검증은 수행하지 않았다. [기존 AUTH](../../../qa/auth.md) · [설정 QA-14](../../../qa/my-settings-home.md#qa-14-local-regression) |
| Frontend source | 기준 `7c94705`에서 `/my` 계정 관리 카드는 준비 중이고 상세 route/product 호출은 없다. 공개 auth Repository와 메모리 세션이 인증을 관리하며, 별도의 알림 설정 Repository가 수신처 인증을 소유한다. [설정 홈](../../../../src/components/my/my-settings-home-client.tsx) · [인증 모델](../../../../src/data/auth/contracts.ts) · [인증 HTTP](../../../../src/data/auth/http-repository.ts) · [세션 Provider](../../../../src/features/auth/session.tsx) · [알림 이메일 HTTP](../../../../src/data/notification-settings/http-repository.ts) |

### Figma와 현행 화면 상태

| 시안에서 읽은 노드 | 현행 소스와 정책 적용 |
| --- | --- |
| S02 [계정 관리](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-53049) · 이메일 주소 행 `3139:53069`, [인증하기](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-53078) 표시 | 현재 카드는 비활성이다. DEV-38에서 이메일 주소 읽기를 연결하고 D1에 따라 이메일 행의 버튼을 생략한다. 이메일 인증 UI 부재를 승인한 범위는 이 행의 버튼이다. |
| S02 [비밀번호 변경 행](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-53079)은 숨김, 별도 [탈퇴하기](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-53096)는 표시 | Google-only 정책과 숨김 상태를 근거로 비밀번호 행을 연결하지 않는다. 탈퇴 CTA의 활성·배치·처리는 [POL-18](POL-18.md)과 DEV-39/40 소유이며 적용할 화면 예외는 해당 Gate의 결정으로 확인한다. |
| C02 [비밀번호 팝업](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2303-89402) · 변형 `2303:89401`, `2303:89403`, `2303:89549`, `2303:89625`의 현재/새/확인 비밀번호 필드와 변경 버튼 | `PasswordPopup`은 표시용 필드와 Storybook의 `empty/filled/visible/error` 상태 예시를 보유한다. 제품 호출과 인증·검증·저장 연결은 없다. 팝업을 유지하면서 현재 제품 범위에는 연결하지 않는다. [팝업](../../../../src/components/ui/popup/popup.tsx) · [Storybook 상태](../../../../src/components/ui/popup/popup.stories.tsx) |
| C02 정정 `2210:17840`·탈퇴 `2303:90900`·업로드 `2264:95335` | 공용 팝업 분류와 기존 소유 링크를 보존한다. 이번 검토는 지정 노드의 이름·구조·상태 범위이며, 이 팝업의 동작이나 전체 화면의 시각 정합성 판정은 각 소유 Task에서 수행한다. |

## 체크포인트 · 재개 메모

| 시각/실행자 | 환경·branch/HEAD·작업트리 | 수행/결과·근거 | 다음 행동·차단/재개 조건 |
| --- | --- | --- | --- |
| 2026-10-27 / 문서화 | feature/my-company-overview / f84af24b5f9d + 기존 미커밋 변경 | 보고서에서 작업 정의만 생성. 구현/실제 QA 미실행 | 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다. |
| 2026-11-20 11:32 KST / Codex | `docs/pol-17-account-policy` · 기준 `7c94705` · 시작 작업트리 clean | DOC-001·QA-14 main 반영 확인, 중앙 정책·backend source·test OpenAPI·Figma 대조, 사용자 D1 수신. 정책/검증과 Git 전달 승인 범위를 기록했다. | 현행 계정 필드와 화면 차이, DEV-38 인계 및 이후 지원 재개 조건을 문서화한다. |
| 2026-11-20 KST / Codex | 같은 브랜치·기준 commit · POL-17 관련 Markdown 변경 | 정책·화면 예외·후속 QA와 구현 범위를 연결했다. 실제 계정/업무 데이터 변경 0건으로 복구할 데이터는 없다. | 문서 검증과 Review Gate를 수행한다. |
| 2026-11-20 KST / Codex | 같은 브랜치·기준 commit · Markdown 7개 | 1차 문서 검사 및 `git diff --check` 통과. 공통 컨텍스트의 수정 필요 여부를 확인했다. | Read-only verifier와 `ai-review`로 정책 경계 및 diff를 검토한다. |
| 2026-11-20 KST / Codex | 같은 브랜치·기준 commit · Markdown 7개 | 독립 검토 PASS에서 나온 Minor 2건을 반영했다. 세션 요청의 허용 범위와 refresh 401/403의 기존 처리를 명확히 했다. | 최종 종료·인계를 포함한 본문과 색인을 재검증·재검토한 뒤 목적별 커밋과 PR로 전달한다. |

## 검증·리뷰·인계 기록

| 구분 | 실행 명령/사례·환경 | 결과 | 증거/미실행 이유 |
| --- | --- | --- | --- |
| 읽기 전용 근거 대조 | GitHub 정책/source/배포 상태, 개발 OpenAPI 스키마·경로, Figma 노드 | 확인 | [현행 소유 근거](#pol-17-evidence). 실행 중 서버 SHA/업무 응답과 전체 화면 시각 정합성은 미확인 |
| 문서 검증 | `python3 validate-docs.py 검증` 및 `리뷰` · `git diff --check` | PASS | Markdown 7개, 원본 79개·Task 114개·의존성 156개, 링크/앵커·형식·범위·기준선/QA 보존. 종료/인계 추가 후 `final`로 다시 검사 |
| App test/lint/build/Storybook | 로컬 미실행 | Markdown만 변경 | 실행 코드·패키지·빌드 설정 영향 없음 |
| mock·HTTP 대역·브라우저·실제 API | 미실행 | DEV-38 후속 | [ACCT-01~08 계획](../../../qa/my-settings-home.md#pol-17-account-qa)과 과거 [MSET QA](../../../qa/my-settings-home.md#qa-14-local-regression) 분리 |

- 자동 수정 시도: 0/3. 실패 시 명령·오류·원인·최소 수정·재검증 결과를 추가한다.
- Documentation Update Check는 WBS, Task/인계, coverage, 기존 QA 실행 파일의 후속 사례, 공통 `plan.md` 정책 참조를 갱신했다. 패키지/구조/계약 구현·하네스 변화와 새 반복 실패가 없어 나머지 공통 문서는 유지한다. [점검 및 검토 기록](../reviews/POL-17.md)
- Review Gate는 정책·인계·QA의 Blocker/Major 0건이다. 독립 검토의 Minor 2건을 교정했다. [verifier와 ai-review 기록](../reviews/POL-17.md)

<a id="pol-17-close"></a>

## 2026-11-20 · 판정과 인계

- 정책 판정은 사용자 D1 및 중앙 인증 정책에 따른 계정 정보 읽기, 명시적 화면 예외, 변경/재인증 재개 기준의 문서화에 적용된다. 실제 연동을 위한 실행 서버 버전 대응과 승인된 테스트 계정·조회 범위는 DEV-38의 Gate에서 확인한다. ACCT-01~08과 기존 실제 MSET-02 재확인 대기를 보존한다.
- 다음 하나는 [DEV-38](DEV-38.md#dev-38-pol-17-handoff)이다. WBS의 P0/P1 및 앞선 P2에 남은 외부·선행 조건을 적용하면 POL-17을 충족한 DEV-38이 표 순서상 첫 후보이다. 선택·인계만 완료했다.
- 첫 행동은 최신 main의 D1을 확인하고 `/my` 계정 카드와 현재 auth 세션 경계를 대조해, 연락용 이메일 읽기 전용의 상세 경로·화면·로컬/실제 검증 범위를 DEV-38의 요구사항 Gate에서 정하는 것이다.

<a id="pol-17-delivery"></a>

### Git 전달

- 정책 결정과 후속 검증 기준, 실행계획과 인계 연결을 목적별로 커밋한다. `type: docs` PR의 실제 최종 head에서 CI·리뷰·base 변경과 GitHub 병합 조건을 확인한다. [POL-17 브랜치의 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fpol-17-account-policy)
- 사용자가 승인한 이번 Chromatic 월간 한도 예외는 관련 검사에 한해 적용한다. 최종 head의 검사, 병합 commit과 로컬/원격 main fast-forward 증거는 PR과 전달 보고에서 확인한다.

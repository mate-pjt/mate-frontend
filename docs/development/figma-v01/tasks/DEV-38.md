# DEV-38 · 계정 정보 조회·승인된 변경 연결

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: S02
- 선행 작업: [POL-17](POL-17.md)
- 목적/범위: 확정된 계정 필드와 인증/수정 흐름을 설정 메뉴에서 연결한다.
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

## 완료 기준

- [ ] 조회/편집 권한·입력 오류·인증/만료·중복/충돌을 확인한다
- [ ] 실패 시 기존 값·저장 후 재조회·계정 변경·모바일을 검증한다
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

<a id="dev-38-pol-17-handoff"></a>

## 2026-11-20 · POL-17 인계

- [POL-17 사용자 D1과 현행 인증 기준](POL-17.md#pol-17-contract)에 따라 이 차수에는 `/my`의 계정 관리 진입과 **인증된 본인의 연락용 이메일 읽기**를 연결한다. 기존 세션의 `account.email`만 상세에 표시하고 S02 이메일 행의 ‘인증하기’를 생략한다. Google-only와 비밀번호 미지원 기준에 따라 C02 비밀번호 팝업을 사용하지 않는다. [S02 계정 관리](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-53049)
- 원래 완료 기준 중 편집·만료된 변경 확인·중복·충돌·성공 뒤 최신 값 재조회 검사는 승인된 변경 계약이 생길 때 적용한다. 이 차수는 본인·회사 미소속·직접 진입/복귀, 세션 로딩·실패/재시도·만료 및 계정 전환, 안전한 결측 표시, 모바일·키보드를 확인한다. 기존 로그인과 세션 복원을 재사용하며 계정 정보 변경과 별도 계정 인증·재인증 호출은 없어야 한다. [후속 ACCT-01~08](../../../qa/my-settings-home.md#pol-17-account-qa)
- 이메일/프로필 변경과 별도 재인증은 소유 정책·계약·충돌/복구·검증 자원 확보 뒤 별도 Gate를 연다. 연락용 이메일에 알림 수신처 인증이나 가입 거래를 대입하지 않는다. 폼·비밀번호 설정·탈퇴 CTA의 활성화는 이 구현 범위 밖이다. [변경 재개 조건](POL-17.md#pol-17-write-gate) · [탈퇴 소유 정책](POL-18.md)
- 다음 첫 행동은 최신 main에 병합된 D1을 확인하고 `/my` 진입점, `AuthGate`·`AccountScope`와 auth 세션을 읽는 것이다. DEV-38의 Gate에서 상세 경로·화면 범위와 테스트 방식을 정하고 승인된 테스트 계정/세션·실행 버전·사용 범위를 확인한다. 자원 미확보 시 실제 QA를 미실행/차단으로 기록하고 로컬 선행·전달 예외는 해당 작업에서 결정받는다. 이번 인계까지 DEV-38의 구현이나 QA는 수행하지 않았다.

<a id="dev-38-brief"></a>

## 2026-11-20 · 착수 Brief와 결정

- 개발 P2, 원본 S02다. 시작 `main`·`origin/main`·직접 조회한 원격 `main`은 `e462e7683387030ed770cb7761d42d77831705a9`로 일치했다. [POL-17 PR #96](https://github.com/mate-pjt/mate-frontend/pull/96)과 QA-14가 main에 있고 작업트리는 clean이었다. 기존 DEV-38 브랜치가 없어 `feat/dev-38-account-settings`를 생성했다.
- 성공 기준은 인증된 본인이 `/my`의 계정 관리 카드와 직접 진입으로 세션의 연락용 이메일을 읽고 상위 설정으로 돌아가는 것이다. 로그인 복귀·회사 미소속·로딩/오류/재시도·결측/응답 오류·세션 만료/로그아웃/계정 교체와 좁은 화면을 확인한다. 일반 세션 복원 외의 계정 인증·편집·가입·메일은 범위 밖이며, 탈퇴 행과 동작은 POL-18·DEV-39/40 소유다.
- 설정 홈, 인접 알림 설정, `AuthGate`·`AccountScope`, `AuthSessionProvider`·controller와 공개 auth 포트, [데이터 접근 규칙](../../../ai-context/data-access.md)을 확인했다. 인접 route 패턴으로 `/my/settings/account`를 택했다. 상태는 기존 세션에서 읽으며 주소를 화면 상태나 추가 저장소에 복사하지 않는다. 세션 만료 시 기존 세션 재확인을 제공한다. 인증 상태와 별도로 컨트롤러의 현재 계정 키를 구독해 로그아웃 처리 중 주소를 가린다.
- 수정 대상은 `src/app/my/settings/account/page.tsx`, `src/components/my/{my-settings-home-client,account-settings-page-client}.tsx`, `src/features/auth/{session.tsx,contact-email.ts}`, `src/data/auth/session-controller.ts`, `tests/auth.test.ts`와 이 작업의 QA·WBS·연결표·공통 컨텍스트·리뷰 기록이다. 경로/카드 → 이메일/세션 경계 → 회귀 검증 → 실제 QA → 문서/두 리뷰 → Git 전달 순서로 진행한다. 실패 응답에 이전 주소가 남거나 알림 수신처를 섞는 위험, 인증 단계 원문 출력 위험을 확인한다.
- [S02 3139:53049](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-53049)의 마이페이지 경로, 1180px 카드와 이메일 행 `3139:53069`를 이번 확인 범위로 삼는다. 현재 디자인 컨텍스트에서 `3139:53078` 버튼 레이어의 불투명도는 0이며, 제품 생략의 승인 근거는 [POL-17 D1](POL-17.md#pol-17-contract)이다. 비밀번호 행·C02는 Google-only 정책을 따르고, 보이는 탈퇴 행 `3139:53096`의 적용 여부는 소유 Task에서 판단한다.
- Node 22.20.0·pnpm 11.3.0에서 `pnpm test`, `pnpm lint`, `pnpm build`(api/mock/hybrid), `git diff --check`를 실행한다. 실제 Next에서 전체 mock과 loopback HTTP 대역을 구분하여 ACCT-01~07, 실제 개발 API에서 ACCT-08을 검증한다. 공용 Storybook 카탈로그와 모델 변경이 없다. 사람의 로그인과 증거 수집을 분리하고 실제 이메일·인증 응답 본문·URL query·쿠키는 수집하지 않는다.

| 날짜 | 결정자와 근거 | 적용 범위 |
| --- | --- | --- |
| 2026-11-20 KST | 사용자, POL-17 D1 `조회 전용 · 이메일 버튼 생략 (추천)` | 조회 필드 한 개와 S02 이메일 행 예외. 계정 변경·별도 재인증은 계약 이후 재검토한다. |
| 2026-11-20 KST | 사용자, 이번 요청과 `자원 확보 후 실제 검증까지 진행` | DEV-38 검증·두 리뷰·목적별 커밋/push·PR/최종 CI·조건부 정상 병합·로컬 main fast-forward 승인. 실제 API 동작 확인을 포함한다. 이번 PR의 Chromatic 월간 한도만 예외다. |
| 2026-11-20 KST | 사용자, `기존 QA 계정으로 직접 로그인하고 조회·로그아웃 승인 (추천)` | 기존 개발 QA 계정 한 개, 사용자 직접 Google 로그인, 이 Mac의 QA 전용 Chrome에서 계정 상세 조회/새로고침과 이번 테스트 세션 종료 승인. |
| 2026-11-20 KST | 사용자, `실제 브라우저 응답까지 검증하고 Git 전달 · 현재 실행 digest만 미확인으로 기록 (추천)` | 현재 test 프로세스의 digest 증거만 유보한다. 실제 브라우저 확인과 응답은 이번 검증에 필요하다. |

| 시각/실행자 | 환경·branch/HEAD·작업트리 | 수행/결과·근거 | 다음 행동 |
| --- | --- | --- | --- |
| 2026-11-20 KST / Codex | `feat/dev-38-account-settings` · 기준 `e462e76` · 시작 clean | POL-17 반영 및 사용자 실제 QA·Git 범위 확인, S02 대조와 설계 제시 | 설정 카드와 보호된 이메일 읽기를 연결한다. |
| 2026-11-20 KST / Codex | 같은 브랜치 · route/세션/회귀 테스트 | 기본 검증과 API/mock/hybrid 빌드를 통과했다. 로컬 TLS가 연결된 실제 QA용 Chrome 시크릿 창에서 사용자 직접 로그인과 연락용 이메일 일치, refresh 200을 확인했다. | 브라우저·종료 근거를 모아 문서 검사와 두 리뷰를 실시한다. |

<a id="dev-38-api-evidence"></a>

### 개발 API 근거

| 종류 | 2026-11-20 확인 |
| --- | --- |
| 정책·source | [POL-17](POL-17.md#pol-17-evidence)의 중앙 정책 SHA `c9e50ff` 및 backend dev SHA `ab388b7cb06154a00e254eff7b124882952166ac`를 원격에서 재확인했다. 성공 세션 응답의 `account.email`과 정상화된 이메일의 형식·254자 한계를 확인했다. [AuthenticationResponse](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/auth/response/AuthenticationResponse.kt) · [Email](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/domain/common/vo/Email.kt) |
| GitHub CI·배포 | 최신 test deployment `7900875985` success. 배포 job이 고정 이미지 digest `sha256:e84b3e430ac8ef724977df2ea834fa31ca5cfd5a739eaa7c40b88b31ea55dea8`를 전달했고 `DEPLOYED`를 기록했다. [deploy job](https://github.com/mate-pjt/mate-backend/actions/runs/44429902651/job/135257313150) |
| 게시 명세 | 개발 Swagger와 OpenAPI 200. OpenAPI 3.1.0·184 paths·SHA-256 `9e0b737fd92953b9f7a668aeecb61ce32b865bb3861999f9775fdfb523d21dd2`. 계정 응답 모델의 `id`, `email`, nullable `nickname`을 재확인했다. [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs) |
| 현재 실행 | 공개 응답 headers에는 실행 식별자가 없고 외부 `/actuator/info`·`/actuator/health`는 404다. [인프라 라우팅 정책](https://github.com/mate-pjt/mate-infra/blob/da6d0f25170fab561037a58ea08d33fb5e4feda5/ops/haproxy/haproxy.cfg)은 actuator의 외부 접근을 막는다. 현재 활성 프로세스 digest는 미확인으로 기록한다. |
| 실제 브라우저 | [ACCT-08 실행 증거](../../../qa/my-settings-home.md#dev-38-account-qa)에 테스트 계정 범위, UI, method/status와 사용자 확인을 남긴다. |

<a id="dev-38-verification"></a>

### 검증과 문서 점검

| 해당 차수의 기준 | 실행 근거 |
| --- | --- |
| 로그인·본인 읽기·이탈/복귀와 오류 | [ACCT-01~07](../../../qa/my-settings-home.md#dev-38-account-qa). 로그인, 회사 미소속, 401/403·만료, 지연·실패·재시도, 주소 결측·오류, 로그아웃/교체의 늦은 응답, 알림 수신처 분리와 키보드/모바일 확인. |
| 패키지 검사 | Node 22.20.0에서 `pnpm test` 41파일·1,214건, `pnpm lint`, `pnpm build`(api/mock/hybrid) 통과. 실제 Next의 전체 mock과 loopback HTTP 대역 브라우저를 실행했다. |
| 실제 개발 QA | ACCT-08의 기존 계정 로그인·본인 이메일 일치·refresh 200을 확인했다. 이후 새 진입의 refresh 401과 비노출도 관찰했다. 실제 로그아웃 POST 결과는 미확인이며, 현재 실행 digest 유보는 사용자 결정에 따른다. [실제 브라우저 결과](../../../qa/my-settings-home.md#dev-38-account-qa) |
| 해당 차수의 제외 | 원래 기준의 계정 수정·별도 인증·만료된 변경 확인·중복/충돌·저장 후 최신 재조회는 변경 계약을 여는 후속 단위의 기준이다. |

- Documentation Update Check는 WBS·작업 기록·coverage·설정 QA와 색인, 공통 architecture/data-access/plan을 갱신했다. 원본 기준선과 기존 QA·정책 결정은 보존했다. `base.md`·`harness.md`의 패키지/scripts·검증 절차 변경 사항은 없다. `ai-failures.md`에 이번 Figma 도구 출력 개선을 기록했다.
- Storybook 카탈로그·공용 시각 컴포넌트 변경이 없어 로컬 `pnpm build-storybook`은 미실행이다. 용도별 스크립트와 QA 실행은 [리뷰 기록](../reviews/DEV-38.md)을 따른다.
- 브라우저 검증에서 합성 데이터의 robots 검사와 재시작 조건을 수정했다. 제품 자동 수정은 0/3이다. 실제 QA 창 종료, 로컬 브라우저와 소유 Next/HTTP 대역 프로세스 종료를 확인했다. 실제 로그아웃과 서버 세션 해제 증거는 위 QA 범위를 따른다.
- Read-only verifier와 `ai-review`에서 Blocker/Major 0건으로 통과했다. verifier의 Minor 1건인 실제 세션 종료 표현을 명확히 기록했다. [리뷰 및 확인 범위](../reviews/DEV-38.md)

<a id="dev-38-handoff"></a>

### 다음 작업 인계

P0/P1과 앞선 P2에 남은 차단·선행 조건을 적용하면 POL-14와 POL-17을 충족한 [POL-18](POL-18.md#pol-18-dev-38-handoff)이 다음 정책 Gate다. 최신 main의 두 결정과 S03/C02를 대조해 대표자·마지막 관리자, 탈퇴 본인 확인, 계정/회사 자료의 보존·삭제·철회 조건을 요구사항 질문으로 정리한다. 이번에는 해당 작업을 선정하고 인계했다.

<a id="dev-38-delivery"></a>

### Git 전달

- 런타임·회귀 테스트·QA/컨텍스트·WBS 인계를 목적별로 커밋한다. PR 라벨은 `type: feature`, `type: test`, `type: docs`다. [작업 브랜치의 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afeat%2Fdev-38-account-settings)
- 실제 최종 head의 CI·리뷰·최신 base를 확인하고 저장소가 허용하는 merge commit으로 이력을 보존한다. 승인 예외는 이번 Chromatic 월간 한도에 해당하는 검사에 적용한다. 실제 병합 결과와 로컬 main fast-forward는 PR 및 전달 보고에서 확인한다.

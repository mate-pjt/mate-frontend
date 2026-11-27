# DEV-07 · 새 알림 신호 수신·재연결 갱신

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: N04
- 선행 작업: [POL-05](POL-05.md)
- 목적/범위: 확정된 변경 신호를 받아 REST 목록/건수를 갱신하고 연결 생명주기를 관리한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: [11/27 로컬 재개 범위](#dev-07-20261127-local-resume)로 선정되면 POL-05 계약과 현행 화면의 요구사항을 대조한다. 테스트 환경의 실제 연결과 알림 확인은 공동 QA에서 이어간다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### N04 · 새 알림 자동 반영·재연결 갱신
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **REST만**. 검증: 코드 및 현재 mate-docs §9 대조.
- 남은 점: 서버 변경 신호 수신→REST 재조회, 재연결/화면복귀·계정 전환 처리
- Figma: [2304:29131](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2304-29131)
- 소유 소스/기존 기록: [src/components/alarms/notification-bell.tsx:35](../../../../src/components/alarms/notification-bell.tsx)、[src/components/alarms/alarm-page-client.tsx:70](../../../../src/components/alarms/alarm-page-client.tsx)

- 이어갈 QA 기록: [alarms.md](../../../qa/alarms.md). 기존 case ID와 통과/대기/차단 기록을 보존한다.

## 완료 기준

- [x] 승인된 로컬 범위에서 중복/연속 신호·오프라인 복귀·재연결 때 갱신 누락/중복을 확인했다.
- [x] 계정 변경·logout·unmount의 늦은 이벤트와 정리를 검증했다.
- [x] 현재 package scripts의 test/lint/build, diff-check와 Storybook 검증을 통과했다.
- [x] 실제 Next/Chrome의 로컬 권한·오류를 검증했다. 개발 서버 실제 WS·REST 0건 실행·NSIG 12건 차단과 11/27 승인 범위를 기록했다.
- [x] Documentation Update Check 및 verifier/ai-review를 통과했다. [완료 증거](#dev-07-close)

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

## 2026-10-27 · 초기 검증·리뷰·인계 기록

| 구분 | 실행 명령/사례·환경 | 결과 | 증거/미실행 이유 |
| --- | --- | --- | --- |
| 이번 작업 | 미실행 | 미판정 | 기준선의 과거 결과와 구분 |

- 자동 수정 시도: 0/3. 실패 시 명령·오류·원인·최소 수정·재검증 결과를 추가한다.
- Documentation Update Check: 착수 후 판단. base/architecture/data-access/plan/harness/ai-failures 중 영향 문서와 갱신/미갱신 이유를 기록.
- Review Gate: 미실행. verifier와 ai-review의 결과/대상 diff·후속 변경 재검토 여부를 기록.
- 커밋/PR: 없음. 추후 커밋할 때 하나의 목적·영어 type/한국어 메시지, 런타임/테스트/문서는 가능한 별도 커밋.
- 다음 작업 인계: WBS에서 선택. 이 단위의 필수 검증 PASS 전에 다른 기능으로 자동 전환하지 않는다.

<a id="dev-07-pol-05-handoff"></a>
## 2026-11-09 · POL-05 v1 인계（이 Task 미착수）

- 정책 선행: [소유 원문/버전](POL-05.md#pol-05-sources), [POL-05 v1](POL-05.md#pol-05-contract)과 [필수 재개 조건](POL-05.md#pol-05-handoff)을 확인한다. 이는 이 Task의 Implementation Brief·구현/실제 실행 승인이 아니다.
- 확정 범위: native WS/STOMP `/ws/v1/notifications`, 메모리 token의 CONNECT Bearer header, 고정 `/user/queue/notification-changes`, `NOTIFICATION_CHANGED` → 기존 공개 notifications REST C/필요 N 재조회. 계정별 단일 연결/구독·수명 generation·숨김/오프라인 정리/복귀·token 갱신/만료 방어를 포함한다.
- 사용자 결정: 신호500ms 고정 창·묶음 시작 간 최소1초/동시1묶음·진행 중 신호 후속1회, 재연결 기준1/2/4/8/16/30초+지터, 정기 polling 없음. 펼친20건 단위 범위·서버 순서/ID 중복 제거·스크롤을 유지한다. 전체 세부/실패/경쟁 계약은 v1 원문이 소유하며 이 요약을 별도 정책으로 관리하지 않는다.
- 완료 기준 보완: [NSIG-01~12 계획](../../../qa/alarms.md#pol-05-signal-qa)을 Node fake Clock/transport·mock/HTTP 대역·실제 Next/browser/실제 WS+REST로 나누어 검증한다. handshake와 구독 성공 간 조회 경합, 신호 중복/진행 중/연속·계정/같은 계정 재로그인·token/401·해제·펼친 목록/읽음/더 보기 경쟁·실패 보존·공급원 격리 및 기존 ANAV 회귀를 포함한다. 실제 scripts와 필요한 profile별 build/Storybook·두 리뷰는 이 Task Gate에서 구체화한다.
- **필수 차단 / 마지막 확인2026-11-09**: 사용자가 배포 계약/실행 대응·Origin·합성2계정/신호·안전한 오류/잔존·복구 자원 **미준비**를 확인했다. 소스 계약 확정과 배포/실제 통합을 분리하기로 했으며 **이 Task의 로컬 구현 선행 예외는 승인되지 않았다**. 기존 DEV-06 로컬 예외를 가져오지 않는다.
- 필요한 역할: backend 계약/배포 담당, QA 자원/변경·복구 승인 담당, frontend 실행자. 개인 담당자 미확인. 비밀값 없는 schema/version·배포 run/artifact→실행 SHA·frontend snapshot/Origin, disposable 합성 상태·허용 CONNECT/GET/읽음/생성·이력 잔존/종료·오류 해제 범위를 [재개 조건](POL-05.md#pol-05-handoff)에 맞춰 확보한다.
- 재개 첫 행동: 최신 main과 위 근거/승인·자원 준비를 확인한 뒤 요구사항 Gate를 제시한다. 자원 미준비이면 배포 확인·실제 통합 차단을 유지하고 로컬 구현 진행 여부도 별도 결정 없이 추정하지 않는다. 추가 라이브러리도 명시 승인 전 도입하지 않는다.
- 이번 실행/신규 통과0건. 기존 체크리스트·ALARM/ANAV/QA-11 날짜별 이력은 보존하며 이 문서 인계로 통과 처리하지 않는다. POL-05 대화에서 이 Task의 구현/검증을 시작하지 않았다.

<a id="dev-07-20261127-local-resume"></a>

## 2026-11-27 KST · 변경 신호와 재연결의 로컬 재개 범위

- [프론트 우선·공동 QA 결정](../README.md#frontend-first-20261126)에 따라 [POL-05](POL-05.md#pol-05-contract)와 기존 백엔드 구현을 기준으로 로컬 작업을 진행할 수 있다. Plane의 알림 변경 신호는 `Done`이고 백엔드 구현 PR은 병합됐다. [Plane MATEP-230](https://app.plane.so/mate-pjt/browse/MATEP-230/) · [백엔드 PR #86](https://github.com/mate-pjt/mate-backend/pull/86)
- 범위는 `/ws/v1/notifications` STOMP 연결과 `/user/queue/notification-changes`의 `NOTIFICATION_CHANGED` 수신, 기존 목록·미확인 건수 REST 재조회다. 합성 전송과 제어 가능한 시간으로 신호 합치기, 재연결, 로그아웃·계정 전환 시 정리와 펼친 목록·스크롤 보존을 확인할 수 있다. POL-05의 갱신 제한과 정기 polling을 사용하지 않는 정책을 적용한다.
- 테스트 배포의 실행 버전·허용 Origin, 합성 계정 2개와 신호 발생 자료, 브라우저의 실제 `CONNECT`/`SUBSCRIBE`·단절·재연결 확인은 공동 QA에서 진행한다. [NSIG 사례](../../../qa/alarms.md#pol-05-signal-qa)와 기존 받은 알림 QA 이력을 유지한다.
- 이 작업을 선정하면 현행 알림 버튼·목록과 세션 수명을 읽고, 합성 전송 범위 및 검증 기준을 자체 요구사항 Gate에서 정리한다. 구현, 로컬 검증 및 실제 연결은 이번 문서 갱신에서 미실행이다.

<a id="dev-07-brief"></a>

## 2026-11-27 KST · 로컬 구현 Brief와 설계

- 작업 유형과 승인 근거는 N04 개발, [11/09 사용자 승인 POL-05 v1](POL-05.md#pol-05-contract), [11/26 프론트 우선·공동 QA 결정](../README.md#frontend-first-20261126) 및 [11/27 사용자 로컬 재개 범위](#dev-07-20261127-local-resume)다. 이번 요청은 검증·리뷰 후 작업 커밋, push, PR, 조건부 정상 병합과 로컬 `main` fast-forward를 승인했다. 이 PR에서 발생한 Chromatic 월간 한도 실패에만 이번 예외를 적용한다.
- 공개 notifications client, HTTP 목록·건수 Repository, RootLayout·Bell·알림 페이지·세션 컨트롤러와 읽음/삭제의 기존 성공 처리를 대조했다. 목록의 20건 범위와 행 순서·스크롤, 이전 정상 데이터와 명시 재시도를 보존한다. 읽음·삭제·더 보기와 겹칠 때 이전 조회를 무효화하고 후속 조회를 한 묶음으로 실행한다.
- `data/notifications`에 빌드 공급원으로 제한한 native WS/STOMP 전송을, `features/notifications`에 계정 수명의 연결·예약·공유 조회 상태를 둔다. `app/layout.tsx`, Bell, 알림 목록을 연결한다. 기존 REST·인증 진입점과 UI 토큰을 사용한다. 신호는 500ms 고정 창, 묶음 시작 간 최소 1초와 동시 1묶음, 재연결은 POL-05의 1~30초 기준과 지터를 검증한다. 정기 polling과 추가 라이브러리는 범위에 없다.
- 소스 계약은 중앙 `mate-docs`의 [실시간 설계](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/architecture/account-notification-realtime.md), 백엔드 #86의 병합 `0b286ca1` 및 `main` `4b5f31de`의 [현재 WS 설정](https://github.com/mate-pjt/mate-backend/blob/4b5f31de578c41e698dda9c99e66149b7292f031/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/websocket/notification/AccountNotificationWebSocketConfiguration.kt)과 [STOMP 인증](https://github.com/mate-pjt/mate-backend/blob/4b5f31de578c41e698dda9c99e66149b7292f031/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/websocket/notification/AccountNotificationStompInboundInterceptor.kt)이다. 현재 main [백엔드 CI](https://github.com/mate-pjt/mate-backend/actions/runs/43392743658)와 별도로 [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs)는 3.1.0 · SHA-256 `9711e22b705d79ded53428d1a0ba157bae2894a46999a83899d8324fc4459ea4`로 REST를 게시했다. 실행 SHA·실제 알림 응답·WS/Origin은 확인 대상에 남긴다.
- `dev` `f4860fd9`의 [CI](https://github.com/mate-pjt/mate-backend/actions/runs/45723770088)는 검증·발행·개발 배포 작업이 성공했고 운영 배포는 생략됐다. 현재 실행 SHA와의 대응은 확인되지 않았다.
- Spring Simple Broker의 구독 등록 완료 영수증과 식별 가능한 STOMP 인증 오류 코드는 현재 소스에서 제공하지 않는다. `CONNECTED` 이후 고정 구독을 전송하고 보완 REST를 예약한다. 구독이 실제로 전달한 유효 신호에서 재연결 간격을 초기화하고 500ms 규칙으로 조회한다. 보완 조회와 서버 등록 사이에 남을 수 있는 간격, STOMP 오류의 인증 분류는 공동 QA의 차단 조건으로 기록한다. HTTP 401은 기존 공용 갱신·재요청을 사용한다. [Spring Simple Broker 계약](https://docs.spring.io/spring-framework/reference/7.0/web/websocket/stomp/handle-broker-relay.html)
- 가정은 bounded jitter와 CONNECT timeout을 구현에서 고르는 것이다. 실행 계정·권한·신호/잔존/복구는 공동 QA 담당 역할에 남긴다. 추가 UI 재설계, 별도 제품 정책, 실제 업무 REST/WS·외부 메시지·서비스 배포는 이번 로컬 범위에서 제외한다.
- 검증은 Node 22.20.0의 `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm build-storybook`, `git diff --check`, 합성 Clock/transport, Next/Chrome의 API 대역·mock·hybrid, 문서 링크·N04·기준선 보존과 두 리뷰다. 공개 원천은 읽기 전용으로 확인했다.

### 이번 체크포인트

| 날짜와 실행자 | 시작 상태 | 수행과 근거 | 다음 행동 |
| --- | --- | --- | --- |
| 2026-11-27 KST · Codex | `feat/dev-07-notification-sync` · `c3fb572`; 작업트리 clean. `main`과 원격 일치 | POL-05 `0fd4314`, DEV-08 `3ee9335`의 선행 병합 확인. 요구사항과 검증 범위를 제시함 | 공개 전송 진입점과 계정별 연결·조회 컨트롤러를 구현한 뒤 현재 UI를 연결한다. |
| 2026-11-27 KST · Codex | 같은 브랜치·HEAD의 DEV-07 소스·테스트·작업 기록 변경 | Node 22.20.0 격리 복사본에서 `pnpm test` 49파일·1,378건, `pnpm lint` 1차 통과. 합성 REST/WS 및 Next dev 준비 | Chrome에서 펼친 목록과 재연결·인증·공급원 격리를 확인한 뒤 최종 자동 검사와 두 리뷰를 실행한다. |
| 2026-11-27 KST · Codex | 같은 브랜치·HEAD의 DEV-07 변경 | API 대역 Chrome 31개, mock·hybrid Chrome 각각 5개, 3개 공급원과 Storybook 빌드 통과. [사례별 근거](../../../qa/alarms.md#dev-07-local-qa) | 문서 연결과 실제 QA 차단 보존을 점검하고 두 리뷰를 수행한다. |
| 2026-11-27 KST · Codex | 같은 브랜치·HEAD의 DEV-07 변경 | 독립 검토 Major 2건을 반영해 포커스 단독 복귀·잘못된 자격 증명을 수정했다. Node 1,382건과 Chrome 포커스 추가 사례가 통과했다. [검토](../reviews/DEV-07.md#dev-07-review) | 수정 및 문서 diff의 두 리뷰를 다시 확인한다. |

### 이번 구현과 검증

- 세션·계정별 한 연결과 목록·미확인 수 재조회 묶음을 구현했다. 재연결 기준 지연에 0.75~1.25배 지터를 적용하며 30초를 상한으로 둔다. 연결 시작부터 `CONNECTED` 대기는 최대 10초다. socket이 전송한 구독은 유효 신호로 확인하며, 전송 직후 보완 조회는 실제 서버 등록 시점을 보장하지 않는다. [로컬 QA와 실제 재개 조건](../../../qa/alarms.md#dev-07-local-qa)
- 원본 목록은 20건 단위로 유효 범위만 다시 읽고 순서·고유 ID·화면의 스크롤 기준 행을 보존한다. 부분 실패는 성공한 목록과 미확인 수를 보존한다. 목록의 읽음·삭제·더 보기와 겹친 자동 조회를 취소하고 현재 자료로 수렴시킨다.
- Node `22.20.0`의 최종 `pnpm test` 49파일·1,382건과 `pnpm lint`, `pnpm build` 3개 공급원, `pnpm build-storybook`이 통과했다. 격리 복사본은 저장소에 커밋된 파일과 이번 변경만 사용했다. 브라우저 도구에서 합성 제어의 객체 인코딩과 HMR 소켓을 함께 세는 오류를 교정한 뒤 전체를 다시 실행했다. 앱 검사 실패 수정은 0회이며 독립 검토의 두 발견 사항은 한 차례 수정하고 재검증했다.
- Documentation Update Check에서 알림 전송·공유 조회의 소유 위치는 `architecture.md`와 `data-access.md`, 연결과 검증 근거는 `plan.md`, QA·WBS·이 기록과 리뷰에 반영한다. `base.md`, `harness.md`, `ai-failures.md`는 패키지·스크립트·하네스 변경이나 재발 방지 규칙을 추가할 근거가 없었다. N04와 기존 QA 판정 및 기준선은 보존한다.

<a id="dev-07-close"></a>

## 2026-11-27 KST · 승인된 구현 범위 검증 종료

로컬 구현과 문서 검토가 통과했다. Node 1,382건, API·mock·hybrid 빌드와 Storybook, Chrome의 API 대역 32개·mock 5개·hybrid 5개 및 링크·N04·WBS·기준선·QA 이력 검사를 확인했다. 첫 독립 검토에서 발견한 포커스와 만료 처리 두 건은 수정했고 재검토에 통과했다. 검토 이후 종료 문서 변경은 문서 검사와 두 리뷰에서 다시 확인한다. [알림 QA](../../../qa/alarms.md#dev-07-local-qa) · [검토 기록](../reviews/DEV-07.md#dev-07-review)

실제 통합은 실행과 통과 모두 0건이며 NSIG 12건이 차단이다. 공동 QA의 첫 확인은 개발 서버 실행 빌드와 Origin 대응, 구독 등록 타이밍과 STOMP 인증 거절의 식별 근거다. 승인된 합성 2계정·알림과 읽음/오류 복구 범위를 확보한 뒤 사례를 실행한다. [재개 조건](../../../qa/alarms.md#dev-07-local-qa)

<a id="dev-07-delivery"></a>

### Git 전달

이번 요청에서 사용자가 목적별 Conventional Commit, 작업 브랜치 push·PR, 최종 head 검사와 정상 병합·로컬 main fast-forward를 승인했다. 최종 head의 원격 검사·리뷰·병합 결과는 [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afeat%2Fdev-07-notification-sync)에서 확인한다. 이번 PR에 실제 발생한 Chromatic 월간 한도 이외의 검사는 정상 기준을 적용한다. 실제 업무 API·서비스 배포와는 별도 범위다.

<a id="dev-07-handoff"></a>

### 다음 작업 인계

다음은 [DEV-14](DEV-14.md#dev-14-20261127-local-resume)다. P0 실제 QA와 QA-16 취합은 자원·선행을, DEV-49는 버전 출처와 책임 결정이 남아 있다. DEV-14의 직접 선행 [POL-09](POL-09.md)는 완료됐고 현장설명일·기준일·수집일을 기존 상세 GET으로 표시할 로컬 범위가 11월 27일 승인됐다. 실행 버전과 날짜 실표본은 공동 QA에 남긴다. [프론트 작업 순서](../README.md#frontend-first-20261126)

첫 행동은 기존 공개 상세의 타입·mapper·컴포넌트와 로그인 전/인증 회사 로그인 후 두 Figma 프레임을 대조하는 것이다. 세 날짜의 제공·미제공·미확인 표시, KST 변환과 원문 링크 보존을 자체 요구사항 Gate와 검증 계획에 정리한다. 이번 대화는 선정과 인계까지 수행한다.

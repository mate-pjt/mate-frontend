# POL-05 · 알림 변경 신호·REST 재조회 계약 확정

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 정책 결정
- 원본 항목: N04
- 선행 작업: [DOC-001](DOC-001.md)
- 목적/범위: 현재 중앙 정책과 서버 지원 신호·인증·재연결을 확인한다. 추천: 신호는 변경 알림으로 사용하고 내용은 REST에서 다시 조회한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### N04 · 새 알림 자동 반영·재연결 갱신
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **REST만**. 검증: 코드 및 현재 mate-docs §9 대조.
- 남은 점: 서버 변경 신호 수신→REST 재조회, 재연결/화면복귀·계정 전환 처리
- Figma: [2304:29131](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2304-29131)
- 소유 소스/기존 기록: [src/components/alarms/notification-bell.tsx:35](../../../../src/components/alarms/notification-bell.tsx)、[src/components/alarms/alarm-page-client.tsx:70](../../../../src/components/alarms/alarm-page-client.tsx)

## 완료 기준

- [x] 현행 소스의 전송 방식·계정 격리를 확인하고 재연결/화면 복귀 조건을 확정한다. **배포 지원 확인은 미확보**이며 아래 사용자 승인으로 소스 정책 단위와 분리한다.
- [x] 중복/연속 신호·오프라인·로그아웃·구독 해제와 재조회 간격을 확정한다.
- [x] 원문/소유 소스·버전·결정자·날짜·선택/보류 이유를 기록한다. 추천 자체를 승인으로 간주하지 않는다.
- [x] 후속 개발의 범위/완료 기준/차단·QA 계획과 Documentation Update Check 및 두 리뷰1차 PASS를 확보했다. 종료 diff의 재검토 결과는 검토 기록·freshness receipt를 따른다.

## 착수 전 Implementation Brief / 설계 Gate

2026-11-09 요구사항 Gate. 원래 후보 정의를 현행 소유 소스와 사용자3답변으로 구체화했으며 편집 전에 범위·파일·단계·검증 계획을 제시했다.

- 요구사항: N04의 변경 신호·인증/계정 격리·REST 재조회·화면/연결 수명과 오류 복구를 **소스 기준 POL-05 v1**으로 문서화한다. 제품 구현은 DEV-07의 별도 Gate다.
- 성공 기준: 고정 commit의 중앙/서버 계약과 프론트 관찰을 구분하고 사용자 결정을 인용한다. 중복·간격·재연결·인증 만료/계정 교체·펼친 목록·실패 정책을 검증 가능한 표로 남긴다. DEV-07·기존 알림 QA의 실제 차단을 보존하고 문서 검증/두 리뷰를 통과한다.
- in scope: 본 Task, WBS, DEV-07 정책 인계, 알림 QA 신규 계획, plan의 날짜별 진입 링크, 검토 기록. 소유 원문은 읽기 전용.
- out of scope: src/tests/public/package/lockfile/설정/하네스·라이브러리·고정 기준선/coverage 변경, DEV-07 구현, 삭제/보존·새 알림 종류·폴링·다른 Task 실행, 실제 로그인/업무 API/WS 연결·계정/알림 생성·mutation·서비스 운영/배포·외부 메시지.
- 확인한 패턴: AGENTS와 세 Skills, DOC-001/main 반영·DEV-06의 POL-05 선정 인계, baseline N04/coverage·workflow/task-cycle, base/plan/architecture/data-access/harness/ai-failures, package/PR template. 프론트 notifications 공개 client/contracts→HTTP/mock·Bell·AlarmPage·세션 epoch/읽음 activation과 기존 QA의 날짜별 이력을 대조했다.
- 수정 파일/영향: `tasks/POL-05.md`, `README.md`, `tasks/DEV-07.md`에 정책·차단/다음 Gate를 기록한다. `docs/qa/alarms.md`에는 미실행 QA 계획만 추가하고 `docs/ai-context/plan.md`에 링크, `reviews/POL-05.md`에 검증/감사/리뷰를 남긴다. 런타임 영향 없음.
- 단계: 시작/결정 기록 → 소유 계약과 v1 정책·인계/QA → 문서 검증·context-audit → verifier/ai-review → 목적별 문서 commit·push/PR/라벨·실제 head CI/정상 merge·로컬 main FF. Git 전달은 이번 요청으로 승인됐으며 반복 확인하지 않는다.
- 검증: 로컬 Markdown 링크/anchor, 79원본/99Task·N04 매핑/선행/상태, 고정5파일·다른 Task와 기존 QA prefix·무관 파일 보존, 승인3답변/정책/QA 대응, 민감 값 미포함, `git diff --check`. package8 scripts와 실행 환경을 직접 확인했다. Markdown 전용이므로 로컬 pnpm test/lint/build/build-storybook·Next/브라우저·mock/HTTP 대역/실제 API는 미실행한다. 원격 CI는 별도 결과다.
- 가정: frontend 정책의 숫자·목록 방식은 사용자 답변을 적용한다. 기술 설계에서 지터 분포·연결 timeout/heartbeat·STOMP 구현 수단을 선택하되 승인된 간격/격리/복구를 바꾸거나 새 의존성을 승인 없이 추가할 수 없다. 소스 ref·blob은 배포 식별자가 아니다.
- blocking ambiguity: 아래3답변으로 소스 정책 단위의 결정은 해소. 배포 지원·Origin·실행 대응·QA 자원은 미확보이며 **DEV-07의 필수 차단**으로 보존한다.

## 결정 기록

| 날짜 | 질문/선택지와 추천 | 결정·근거·승인자/원문 | 영향 |
| --- | --- | --- | --- |
| 2026-10-27 | 작업 후보 분해 | 정책·API·제품 동작 신규 승인 없음 | 착수 시 Gate 수행 |
| 2026-11-09 KST | 최초/복귀/신호 재조회·500ms 합치기·동시1묶음/최소1초·1/2/4/8/16/30초 backoff+지터·숨김/오프라인 중단, 정기 polling 여부 | 사용자: **“추천안 적용, 정기 polling 없음”** | 아래 v1 간격 적용. 숨김/오프라인 복귀 재동기화. 주기적 안전 polling도 추가하지 않음 |
| 2026-11-09 KST | 펼친 범위 유지 또는 첫20건 초기화 | 사용자: **“펼친 20건 단위 범위를 재조회하고 스크롤 유지·중복 제거 (추천)”** | 현재 펼친 page 범위 재조회·서버 순서·ID 중복 제거/스크롤 보존 |
| 2026-11-09 KST | 배포 계약/실행 대응·Origin·disposable2계정/오류/복구 자원 준비 | 사용자: **“미준비 — 소스 정책만 확정하고 배포 확인·실제 통합은 DEV-07 Gate의 필수 차단으로 보존 (추천)”** | POL-05의 소스 정책 단위만 확정. 배포/실제 QA PASS·DEV-07 로컬 구현 예외·mutation 승인이 아님 |

<a id="pol-05-sources"></a>
## 2026-11-09 · 현행 소유 소스와 관찰

- 시작 `main=origin/main` **`a0f27e2f29afa58b464f0403eff9f5559a984ec2`**, clean. fetch/`git merge --ff-only origin/main` 후 `docs/pol-05-notification-signal-contract` 생성. DOC-001 `9eae9c0`, POL-04 merge `8165cb9`, DEV-06 merge `a0f27e2`의 main 포함 확인. 기존 frontend 변경0건.
- 중앙 `mate-docs/main` commit **`c9e50ff591ae18023164e1a94581c611bf1e4f29`**: [알림 정책 §9](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/notification/overview.md)(blob `c649b3092157a091f1be54d92195e65622150ac9`)와 [기술 책임 원문](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/architecture/account-notification-realtime.md)(blob `cd625f7d5af94b745159ec556f695cb7a6c719ec`)을 확인했다. 신호는 재조회 힌트, 알림/읽음/정확한 건수는 DB/REST 원본이다.
- backend 원격 main **`475db983ea98831c2acb15f715d09ff9e0a7ad7c`**, dev **`1f3b8544dee49fa3936b3229114a58cd9eb7432c`**를 조회했다. [WS configuration](https://github.com/mate-pjt/mate-backend/blob/475db983ea98831c2acb15f715d09ff9e0a7ad7c/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/websocket/notification/AccountNotificationWebSocketConfiguration.kt)과 [STOMP 인증/allowlist](https://github.com/mate-pjt/mate-backend/blob/475db983ea98831c2acb15f715d09ff9e0a7ad7c/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/websocket/notification/AccountNotificationStompInboundInterceptor.kt)는 main/dev blob 동일을 확인했다. 각각 `ec6d26708b5df6d42df735ec72681e5d8a0c6913` / `319bd81d3b0701ee4d542db7458e99a20edf2af4`다. 이 비교를 backend 전체 또는 배포 동일성으로 확대하지 않는다.
- [Origin interceptor](https://github.com/mate-pjt/mate-backend/blob/475db983ea98831c2acb15f715d09ff9e0a7ad7c/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/websocket/notification/AccountNotificationWebSocketOriginHandshakeInterceptor.kt)는 설정 frontend Origin과 정확히 일치하는 단일 Origin만 허용한다. [adapter](https://github.com/mate-pjt/mate-backend/blob/475db983ea98831c2acb15f715d09ff9e0a7ad7c/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/websocket/notification/AccountNotificationRealtimeWebSocketAdapter.kt)는 계정 routing과 최소 payload를 정의한다. [V101 trigger](https://github.com/mate-pjt/mate-backend/blob/475db983ea98831c2acb15f715d09ff9e0a7ad7c/mate-api/src/main/resources/db/migration/V101__account_notification_realtime_signal.sql)는 INSERT·최초 read_at null→non-null만 신호를 만든다. 삭제 전파는 이 계약으로 보장하지 않으며 POL-20 범위다.
- [REST Controller](https://github.com/mate-pjt/mate-backend/blob/475db983ea98831c2acb15f715d09ff9e0a7ad7c/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/notification/AccountNotificationController.kt)는 목록/미읽음·소유 계정의 멱등 읽음, 개인 응답 no-store를 정의한다. 직렬화 wrapper/오류·WS upgrade·proxy/CSP·배포 version/실행 SHA는 실제 확인하지 않았다.
- 현행 frontend: [Bell](../../../../src/components/alarms/notification-bell.tsx)은 경로/로컬 `NOTIFICATIONS_CHANGED_EVENT`로 건수를 재조회한다. [AlarmPage](../../../../src/components/alarms/alarm-page-client.tsx)는 최초20/더 보기·읽음 성공 후 로컬 반영을 수행하나 원격 신호 구독·복귀 동기화는 없다. 로컬 이벤트를 서버 신호라고 부르지 않는다. [공개 client](../../../../src/data/notifications/client.ts)·[계약](../../../../src/data/notifications/contracts.ts)·[HTTP](../../../../src/data/notifications/http-repository.ts) 및 세션 수명/activation 경계를 확인했다.
- 로컬 backend는 원격 main과 다른 HEAD이며 IDE 미커밋 변경이 있어 그대로 보존했다. 로컬에 원격 main commit object가 없어 `git show`가 실패했고 **고정 ref의 GitHub 파일 응답으로 대체 확인**했다. backend fetch/checkout/수정·실행은 하지 않았다.

<a id="pol-05-contract"></a>
## POL-05 v1 · 소스 기준 계약

적용일/결정자: **2026-11-09 KST / 본 대화 사용자**. 중앙/서버가 소유한 기존 사실은 위 고정 원문을 따른다. frontend의 추가 선택은 위3답변에 한정한다. 이 정책 기록의 완료와 제품 구현·배포 지원·실제 통합 완료는 별개다.

| 항목 | 확정한 계약 / 책임 경계 |
| --- | --- |
| 전송 | native WebSocket + STOMP, endpoint `/ws/v1/notifications`. SockJS/SSE/Web Push·새 endpoint를 추가하거나 전송 실패 때 임의 전환하지 않는다. 연결 주소는 기존 공개 API 환경을 따르되 실제 wss/upgrade·허용 Origin은 DEV-07 Gate에서 확인 |
| 인증 | access token은 URL/query/storage/log에 넣지 않고 메모리에서 받아 STOMP CONNECT의 단일 canonical `Authorization` Bearer header에만 전달. cookie만으로 CONNECT가 인증된다고 추정하지 않음. 인증·계정 수명은 기존 session-controller/AuthAccess를 사용 |
| 구독/격리 | 로그인 계정은 `/user/queue/notification-changes` 하나만 구독. account ID를 destination/query/payload로 붙이지 않음. backend Principal이 계정을 선택하며 client SEND·다른 destination은 거절됨. 탭마다 현재 계정의 연결 하나/구독 하나를 유지하는 책임은 frontend |
| payload | `{"type":"NOTIFICATION_CHANGED"}`는 invalidation만 의미. 본문/목적지/정확한 건수·증분·읽음 성공을 추론하지 않음. 중복 신호도 새 알림을 만들지 않으며 알 수 없는 type/무효 payload는 무시하고 재시도 폭주/원문 로그를 만들지 않음 |
| 원본/조회 | 공개 notifications Repository를 통해 C=`GET /api/v1/me/notifications/unread-count`, 목록이 활성일 때 N=`GET /api/v1/me/notifications?page=p&size=20&unreadOnly=false` 재조회. 다른 화면에서는 C만 갱신하고 목록은 진입 때 조회. 기존 DTO·no-store·isSuccess/오류 검사·actionPath allowlist·읽음 정책을 유지 |
| 시작/구독 경합 | 인증된 최초 진입 때 C/필요 N 조회. 구독이 성립한 뒤에도 재동기화해 최초 조회→구독 사이 유실 구간을 보완한다. HTTP upgrade만으로 인증/구독 성공으로 보지 않음. 원격 신호/로컬 읽음 이벤트/복귀를 한 계정 scheduler로 합쳐 Bell과 목록의 중복 요청을 조정 |
| 재조회 시점 | 최초 진입·구독 성립/재연결·변경 신호·보이는 화면으로 복귀·온라인 복귀. 정기 polling 없음. 포커스/visibility/online이 겹치면 같은 요청으로 합침. 읽음 성공의 기존 로컬 반영/이벤트는 유지하고 신호로 PATCH·이동을 재생하지 않음 |
| 합치기/간격 | 신호는 **첫 신호부터500ms 고정 창**에 합쳐 연속 신호가 창을 계속 미루지 않게 한다. 최초/복귀 등은 불필요한500ms 대기 없이 요청하되 **같은 계정의 재조회 묶음 시작 간 최소1초·동시1묶음**을 지킨다. 묶음은 C+필요한 N pages이며 요청별 병렬성은 DEV-07 설계 사항. 진행 중 신호는 dirty로 합쳐 완료 후 후속1묶음. 계속 신호가 오면 같은 규칙을 반복하고 요청 수를 무제한 쌓지 않음 |
| 펼친 목록 | 성공 전 기존 목록/스크롤을 유지. 0~현재 펼친 page 범위를20건 단위로 다시 조회하고 서버 순서를 유지해 ID 중복을 제거. 모든 유효 page가 성공한 경우에만 한 결과로 목록을 교체하고 일부 페이지 실패 시 기존 목록을 보존·재시도 안내. 서버 totalPages가 줄면 유효 범위로 축소. 신호만으로 첫20건으로 초기화하거나 상단 이동/자동 화면 이동을 하지 않음 |
| 목록/읽음 경쟁 | 더 보기·읽음 PATCH 중 신호는 버전/계정 generation으로 조정. 이전 GET가 성공 읽음을 미읽음으로 되돌리거나 이전 페이지를 최신 결과에 섞지 않음. C와 N은 별도 시점 응답이므로 원자적 snapshot을 보장한다고 주장하지 않음. 최신 성공 C를 공통 건수 기준으로 사용하고 충돌/진행 중 변경은 후속 동기화로 수렴 |
| 오프라인/숨김 | 연결/재연결·진행 중 재조회·예약 timer를 중단하고 늦은 결과는 무시. 기존 화면 데이터는 보존하되 성공/0건으로 오인하지 않음. 다시 보이며 online이고 인증되면 연결/구독 및 REST 재동기화. 다른 탭 신호 전달·탭 간 leader election은 v1 범위 아님 |
| 재연결 | 연결/전송 실패는 기준1→2→4→8→16→최대30초 backoff에 지터를 적용. 숨김/오프라인/비인증에서는 예약하지 않음. 인증/구독 성공 뒤 backoff 초기화. timeout·실제 heartbeat 지원 여부는 DEV-07에서 확인하며 서버가 heartbeat/연결 만료를 보장한다고 추정하지 않음 |
| 인증 실패/갱신 | CONNECT와 재연결 때 현재 계정의 유효 token 사용. 기존 token 만료/교체 때 이전 연결을 닫고 최신 세션으로 구독을 다시 만든다. 기존 동일 계정 refresh 공유/HTTP401 재시도1회 계약 유지. 확인된 인증 거절은 refresh1회 후 재연결, 최종 실패는 연결/예약 종료·기존 로그인 안내. 모든 STOMP ERROR를401로 단정해 refresh하지 않으며 Origin/프로토콜/권한 오류는 구분해 차단/안내 |
| logout/계정/unmount | 연결 generation을 먼저 무효화하고 구독 해제·가능한 DISCONNECT/소켓 종료·Abort/timer/listener 정리. 이전 계정의 늦은 CONNECT/신호/REST 응답을 새 계정에 적용하지 않음. 로그아웃 시작부터 재연결 금지, 같은 계정 재로그인도 새 수명. 페이지 해제는 목록 소비자만 정리하고 전역 연결은 소유 shell 해제/세션 종료 때 정리 |
| 실패/한계 | WS 장애 때문에 REST를 막거나 mock으로 fallback하지 않음. REST 실패는 기존 정상 데이터 보존·오류/명시 재시도, 진행 중 변경은 남기되 실패만으로 무한 즉시 재조회하지 않음. 다음 정상 trigger/명시 재시도는 동일 간격 적용. listener만 끊긴 동안 신호가 유실되면 소켓이 살아 있어도 화면 복귀/재연결/명시 재시도 전 지연될 수 있음. polling 없음에 따른 이 한계를 공개하며 실시간 전달·최종 수렴 시간 SLA를 만들지 않음 |
| 공급원/라이브러리 | 기존7개 그룹·빌드 snapshot·hybrid 제약 유지. notifications=mock이면 실제 WS/REST/토큰 요청 없음, 합성 신호·Clock/transport 대역으로 같은 행동을 검증. auth=api+notifications=mock도 계정키만 사용. notifications=api는 기존 auth=api 제약과 메모리 token 사용. 새 그룹·운영 mock·교차 공급원 fallback·새 라이브러리 승인 없음 |

페이지 offset 조회에는 서버 snapshot/cursor 보장이 없다. 중복 제거만으로 동시 INSERT에 따른 누락까지 없다고 주장하지 않는다. DEV-07은 정지된 fixture에서 정확한 펼친 범위·순서를, 변동 중에는 경쟁 방어와 후속 재동기화를 구분해 검증한다. 연결 handshake/구독 성립 확인·인증 오류 분류가 실제 배포에서 불명확하면 추측 구현하지 않고 Gate 차단으로 남긴다.

<a id="pol-05-handoff"></a>
## DEV-07 인계 / 필수 차단과 재개 조건

1. **계약/배포 담당 역할**: 비밀값 없는 WS/STOMP·REST schema/version·내용 지문, 배포 run/artifact→backend 실행 SHA 대응, frontend 실행 SHA/공급원 snapshot, 허용 frontend Origin·wss upgrade/proxy/CSP·구독 성립/오류·token 갱신/만료·heartbeat 지원 근거를 준비한다. 소스 branch SHA나 옛403 결과를 현재 배포 확인으로 대체하지 않는다.
2. **QA 자원/승인 담당 역할**: disposable 합성2계정·계정별 알림25건 이상/읽음·미읽음·복수 페이지의 시작 기대값을 준비한다. 로그인/GET/CONNECT/SUBSCRIBE·허용 합성 읽음/생성·다중 탭 사용, 알림/읽음/인증 이력 잔존, 종료/복구 담당·방법을 명시한다. 안전한 끊김/인증 거절·오류/지연·복구 fixture를 제공하며 운영 서비스를 임의로 끊지 않는다. 개인 담당자 미지정.
3. **frontend 실행자**: 최신 main/이 v1/DEV-07 마지막 체크포인트·실제 소유 배포를 대조해 수정 파일·수명 소유자·scheduler/transport 경계와 package 실제 명령·Node22.20.0을 제시한다. 새 STOMP 의존성이 필요하면 별도 명시 승인을 받는다. [NSIG-01~12](../../../qa/alarms.md#pol-05-signal-qa)와 기존 ANAV/ALARM 회귀 범위·mock/HTTP 및 transport 대역/실제 통합 증거를 구분한다.
4. **Gate 차단**: 사용자3답변은 **POL-05 소스 정책만** 확정한다. 위 자원이 없으면 DEV-07의 배포 확인·실제 통합은 필수 차단이며, 로컬 구현/검증만 먼저 진행하는 예외는 이 대화에서 승인되지 않았다. DEV-06의 로컬 진행 예외도 재사용하지 않는다. 구현/QA 착수 범위는 DEV-07의 새 Gate에서 정한다.
5. 기존 DEV-06 ANAV-01~10 실제0통과·10차단, QA-11의 재검증8차단/삭제1차단·7일1보류 및 다른 QA/POL 차단·승인 예외는 그대로 유지한다. 신호는 삭제 정책/보존·메일/Push 승인이나 기존 통합 차단 해소가 아니다.

## 체크포인트 · 재개 메모

| 시각/실행자 | 환경·branch/HEAD·작업트리 | 수행/결과·근거 | 다음 행동·차단/재개 조건 |
| --- | --- | --- | --- |
| 2026-10-27 / 문서화 | feature/my-company-overview / f84af24b5f9d + 기존 미커밋 변경 | 보고서에서 작업 정의만 생성. 구현/실제 QA 미실행 | 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다. |
| 2026-11-09 14:24 KST / Codex | `docs/pol-05-notification-signal-contract` / `a0f27e2`; 시작 clean | 현행 정책/서버 고정 ref 조사·선행 main 포함·사용자3답변 확인. 편집 전 범위/검증 계획 제시. 소스 정책/실제 차단을 분리 | v1/DEV-07/QA 문서화 → 링크/ID/보존/감사·두 리뷰. 실제 앱/API/WS 실행0건 |
| 2026-11-09 / Codex · 종료 diff 준비 | 같은 branch/시작 HEAD·Markdown6파일 | 문서14/14·diff-check·primary ai-review/context-audit·독립 verifier1 PASS. 완료 체크리스트/WBS 다음 POL-06·DEV-07 차단을 기록하고 부분 page 실패의 목록 교체 문구를 명확화 | 종료 diff 문서 검사/ai-review·verifier freshness → 목적별 commit/PR·실제 head CI/merge·main FF. 실제 API/WS 실행0건·자동 수정0/3 |

## 검증·리뷰·인계 기록

| 구분 | 실행 명령/사례·환경 | 결과 | 증거/미실행 이유 |
| --- | --- | --- | --- |
| 문서 검증1차 | 외부 산출물 `pol-05/check-docs.py` / Python3.14.6 | PASS·14/14 | local links316·anchor 누락0, 원본79/Task99·다른96행·고정5파일/기존 QA/DEV-07 prefix·무관456파일 보존 |
| 독립 verifier1 | read-only·원본/소스 snapshot/blob·현재6문서 diff | PASS·Blocker/Major/Minor0 | 기존 prefix·신규 NSIG 차단·원문7개 blob 일치 독립 확인. 종료 문서 수정 후 freshness 재요청 |
| 공백 검사 | `git diff --check` | PASS | 실제 실행 코드/패키지 변경0 |
| 로컬 실행 환경 | Node26.5.0·pnpm11.3.0·Python3.14.6, `.nvmrc`22.20.0 | 환경 확인 | shell 기본 Node는 pin과 다르다. 앱 검사를 실행/통과했다고 주장하지 않음. 후속 실행은22.20.0 사용 |
| 로컬 앱 검사·브라우저·대역 | pnpm test/lint/build/build-storybook·Next/browser·mock/HTTP/transport 대역 | 미실행 | Markdown 전용·실행/빌드 영향 없음. 현재 package8 scripts 확인, 문서 검증으로 대체 |
| 배포/실제 통합 | 실제 로그인·업무 REST/WS·fixture mutation·운영/배포 | 실행0·신규 통과0 | 사용자 자원 미준비 답변. 신규 NSIG-01~12 실제0통과·12차단, 기존 ANAV10차단/ALARM 이력 보존 |

- 자동 수정 시도: 0/3. 실패 시 명령·오류·원인·최소 수정·재검증 결과를 추가한다.
- Documentation Update Check: Task/WBS/DEV-07/QA/plan/검토 기록을 갱신한다. base는 scripts/의존성/Node pin 변경 없음, architecture/data-access는 아직 구현/계층/공급원 규칙 변경 없음, harness는 흐름/역할 변경 없음, ai-failures는 새 반복/고위험 실패 근거 없음으로 미갱신. 현행 사실과 신규 정책을 혼동하지 않으며 baseline/coverage는 보존한다. context-audit 결과는 검토 기록 참조.
- Review Gate: [POL-05 검토 기록](../reviews/POL-05.md)에서 primary ai-review 여섯 섹션·context-audit와 read-only verifier/freshness를 관리한다. verifier1은 소스 정책 범위 PASS·미해결 이슈0이며 종료 문서/목록 교체 문구 명확화 뒤 문서 검사와 두 리뷰를 재실행한다. 최종 결과는 로컬 `review-freshness.json`과 최종 보고로 확인한다.
- 커밋/PR: 리뷰 후 정책/인계·QA 계획과 종료/검토 증거를 목적별 문서 커밋으로 분리한다. 실제 PR head CI/병합 조건·Git 전달 receipt/PR/최종 보고를 확인하며 소스 정책 판정과 구분한다.
- 다음 Task 선정: **POL-06**. DEV-07은 정책 선행 외의 배포/QA 자원 미준비·로컬 예외 없음으로 차단 유지. P1 표 순서상 다음 독립 DOC-001 선행을 충족한 POL-06을 선택하며, 이 선택은 이번 요청7항에 따른 다음 Gate 선정일 뿐 실행 승인이 아니다.
- 다음 대화 첫 행동: 최신 main/작업트리·WBS와 POL-06 마지막 체크포인트·M04 기준선을 확인한 뒤 현재 회사 overview/가입 모델의 실적·인증3종·희망금액·권한·자료 연도/기준일·null/미보유 차이를 소유 소스와 대조해 요구사항 Gate를 제시한다. POL-06은 이번 대화에서 시작하지 않는다.

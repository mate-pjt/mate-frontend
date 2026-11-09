# DEV-07 · 새 알림 신호 수신·재연결 갱신

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: N04
- 선행 작업: [POL-05](POL-05.md)
- 목적/범위: 확정된 변경 신호를 받아 REST 목록/건수를 갱신하고 연결 생명주기를 관리한다.
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

- 이어갈 QA 기록: [alarms.md](../../../qa/alarms.md). 기존 case ID와 통과/대기/차단 기록을 보존한다.

## 완료 기준

- [ ] 중복/연속 신호·오프라인 복귀·재연결 때 갱신 누락/중복을 확인한다
- [ ] 계정 변경·logout·unmount의 늦은 이벤트와 정리를 검증한다
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

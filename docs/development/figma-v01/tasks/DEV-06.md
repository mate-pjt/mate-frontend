# DEV-06 · 받은 알림의 안전한 대상 화면 이동

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: N03
- 선행 작업: [POL-04](POL-04.md)
- 목적/범위: actionPath를 내부 모델에 안전하게 전달하고 확정된 읽음/이동 순서로 연결한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### N03 · 알림에서 대상 공고·회사·소식 이동
- 기준선: UI **없음**, 동작 **읽음만**, 데이터 **DTO actionPath 버림**. 검증: 새 mock 클릭 후 /alarms 유지.
- 남은 점: 안전한 내부 경로 검증과 읽음 처리 후 대상 화면 이동 연결
- Figma: [2304:29131](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2304-29131)
- 소유 소스/기존 기록: [src/data/notifications/http-repository.ts:16](../../../../src/data/notifications/http-repository.ts)、[src/data/notifications/http-repository.ts:76](../../../../src/data/notifications/http-repository.ts)、[src/components/alarms/alarm-list-item.tsx:70](../../../../src/components/alarms/alarm-list-item.tsx)

- 이어갈 QA 기록: [alarms.md](../../../qa/alarms.md). 기존 case ID와 통과/대기/차단 기록을 보존한다.

아래 후보 정의/빈 Gate·초기 검증 표는 2026-10-27 이력이다. 이번 실행의 범위·결정·검증/재개 조건은 뒤의 **2026-11-09 Implementation Brief 및 종료 체크포인트**에서 확인한다. 현재/다음/상태는 WBS만 관리한다.

## 완료 기준

- [x] 허용 경로·없는 대상·외부/위험 경로 폴백을 로컬 Node/mock/HTTP 대역에서 검증한다
- [x] 읽음 성공/실패·건수·세션 만료·키보드 이동을 로컬 범위에서 확인한다
- [x] 현재 package scripts의 test/lint·api/mock/hybrid build·Storybook·diff-check를 통과한다.
- [ ] 요구사항 Gate에서 정한 실제 API/브라우저·권한·오류 사례와 필요한 QA case를 검증한다. 외부 조건으로 못 하면 차단/미실행과 이미 승인된 예외를 기록하며 전체 기능 통합 PASS로 표시하지 않는다.
- [x] Documentation Update Check 및 verifier/ai-review 1차 로컬 PASS. Minor 보완 뒤 최종 freshness 보고는 아래 receipt/최종 보고에서 확인한다. 실제 통합 미실행을 완료로 세지 않는다.

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

<a id="pol-04-handoff"></a>

## 2026-11-05 · POL-04 v1 정책 인계(구현 미착수)

위 후보 정의·빈 Implementation Brief는 당시 이력이다. 이 절은 [POL-04 사용자3결정/원문](POL-04.md#pol-04-decisions)과 검증 계획을 인계하며 **DEV-06 요구사항/설계 Gate 또는 실제 API 실행 승인을 대신하지 않는다**. 현재/다음/상태는 WBS만 관리한다.

- 정책 version/적용: POL-04 v1, 2026-11-05 사용자 승인. 공고 상세 `/bids/{양의 정수 ID}` 및 단일 선택 `bidClsfcNo`, 정확한 `/my/company`만 허용한다. ID/분류는 현행 상세 계약을 유지하며 notificationId/resourceId·종류/제목으로 목적지를 추정하지 않는다.
- 안전 경계: 단일 `/` 내부 경로/허용 route·query만. 같은 origin의 절대 URL도 포함한 외부/scheme·프로토콜 상대·역슬래시·공백/제어문자·dot segment·인코딩 우회/깨진 인코딩·중복/알 수 없는 query/hash는 거절한다. query의 정상 직렬화는 유지한다. raw actionPath를 router/href에 넘기지 않고 이동 직전에도 검증한다. 기존 auth 복귀 유틸은 허용 경로/폴백이 달라 그대로 채택한 것으로 세지 않는다.
- 폴백: null/무효/위험/미지원은 `/alarms` 목록/본문 유지·원문 경로를 노출하지 않는 안내. 읽음 기능은 유지한다. 소식/회사 통합·팀원/인증·API·변경 경로는 v1 미지원이며 `/my/company` 등으로 임의 변환하지 않는다. 허용 대상의404/권한/서버 오류는 기존 목적지 화면 책임이고 읽음 성공을 되돌리지 않는다.
- 순서: 미읽음은 공개 Repository PATCH 성공→읽음/건수·변경 이벤트→목적지 재검증/현재 탭 이동. 이미 읽음은 PATCH/건수 감소 없이 이동. 읽음 실패는 이동/낙관 갱신 없이 오류·명시적 재시도이고 통신 실패의 서버 반영 여부는 재조회/멱등 재시도로 맞춘다. 같은 항목 중복 클릭, 다른 항목 경쟁, 계정 교체/로그아웃/해제 뒤 늦은 이동을 막아야 한다. 기존 동일 계정401 refresh1회를 유지하고 최종 세션 만료 후 로그인 복귀는 `/alarms`, 사용자 PATCH/이동 자동 재생은 없다.
- 소스/데이터 경계: 시작 프론트 `8e4566d`의 HTTP DTO actionPath→`AlarmNotification`/mock 누락은 미수정이다. 내부 모델·DTO mapping/검증·합성 mock fixture/저장소 호환·공개 client→UI 조합의 구체적 파일/설계는 이 Task Gate에서 제시한다. 7개 공급원/빌드 snapshot·운영 guard·계정별 탭 격리·DTO 비공개·자동 fallback 금지를 유지한다. API notifications와 mock 목적지가 섞인 hybrid의 실제 ID/시나리오 검증을 설계하며 이 인계로 config 제약이나 새 공급원 그룹을 추가하지 않는다.
- 완료 기준 보완: [ANAV-01~10 계획](../../../qa/alarms.md#pol-04-navigation-qa)의 정상/위험/빈 목적지·성공/실패/중복/계정 수명·키보드/모바일·실제 대상 오류를 확인한다. package의 실제 test/lint/build·필요한 Storybook·Next/브라우저, mock/HTTP 대역/실제 통합의 결과를 구분하고 두 리뷰를 수행한다. 기존 ALARM-01~10의 과거 ‘읽음 후 목록 유지’는 당시 구현 이력으로 보존하며 새 정상 이동은 ANAV에서 검증한다.
- 남은 조건: 배포 OpenAPI/version/schema·실행 SHA 대응은 미확보(비인증 GET403). 실제 로그인·목록/건수 GET·합성 알림 read PATCH·대상 공고/회사 fixture와 시작/종료·사용/변경/읽음 잔존/복구 담당/방법·안전한 오류/401 해제는 [POL-04 인계 조건](POL-04.md#pol-04-handoff) 및 QA-11 재개표를 대조해 확보해야 한다. 개인정보/환경값·인증/서명 URL을 자료로 요청하지 않는다. 정책 PASS/준비·Git 전달은 실제 QA 면제가 아니다.
- 다음 첫 행동: 최신 main/HEAD/작업트리·POL-04 v1/소유 source/배포 대응·ANAV 계획과 자원/승인 공백을 확인해 이 Task의 성공 기준·범위·수정 파일/영향·검증 방법을 별도 Gate로 작성한다. POL-04 대화에서는 구현/브라우저/업무 API를 시작하지 않았다.

## 2026-11-09 · Implementation Brief / 실행 Gate

- 시작: `main` / `8165cb910f9faf0d89befaa77b957113feee3f39`, clean. `git fetch origin main` 뒤 로컬/원격 동일, POL-04 merge 포함. `git merge --ff-only origin/main` 뒤 `feat/dev-06-notification-navigation` 생성. 기존 변경 없음.
- 요구사항: POL-04 v1을 받은 알림의 내부 모델→HTTP/mock→공개 client→화면에 연결한다. 사용자 요청은 DEV-06 하나와 목적별 commit/push·PR/라벨·실제 head CI·정상 병합·로컬 main FF를 승인한다. 실제 API mutation/운영/배포 권한과 구분한다.
- 실제 QA 자원 질문에 사용자 답변: **“미준비 — 로컬 구현·검증 진행, 실제 통합 차단 보존 (추천)”**. 이 답변은 로컬 구현/검증 범위만 확정하며 실제 API 로그인/GET/PATCH·알림 생성/운영·전체 통합 PASS·다음 Task 검증 면제를 승인하지 않는다.
- 성공 기준: 공고 양의 safe integer ID/선택 단일 bidClsfcNo, 정확한 `/my/company`만 허용한다. 경계 및 이동 직전 검증, 무효 목적지 목록/본문 유지·안내, 미읽음 성공 후 반영/이동·이미 읽음 PATCH 없음, 실패 명시 재시도, 중복/다른 항목 경쟁·해제/계정 교체/로그아웃/최종401 안전성을 검증한다. 기존 total/정렬/배경·권한/세션 계약 유지.
- 범위: 알림 모델 actionPath, 순수 경로 검증, HTTP/mock mapping과 이전 탭 저장소 호환, 행동 controller/UI, 계약·경쟁 회귀 테스트, Next 브라우저 검증, QA/Task/WBS와 영향 문서 및 두 리뷰.
- 제외: 삭제/보존·실시간 신호·소식/회사 통합 화면·새 API/공급원/혼합 제약·의존성·정책 변경·실제 업무 API 실행/서비스 운영/배포. 실제 통합 ANAV-01~10과 기존 ALARM/QA-11 차단은 별도 보존한다.
- 확인: AGENTS, feature-workflow/ai-review/context-audit, baseline/WBS/workflow/task-cycle, POL-04 v1/인계, data-access/base/plan/architecture/harness/ai-failures, package/CI/PR template, 현행 notification HTTP/mock/client·AlarmPage/Item/Bell·auth 수명·store·bids ID/query 계약·테스트 패턴.
- 수정 파일: `src/types/alarm.ts`, `src/lib/notification-path.ts`, `src/data/notifications/{http-repository,mock-repository}.ts`, `src/features/notifications/activation-controller.ts`, `src/components/alarms/{alarm-page-client,alarm-list-item}.tsx`, 관련 `tests/notification-*.test.ts`, `docs/qa/alarms.md`, 본 Task/WBS/review 및 영향 있는 architecture/data-access/plan/개발 안내.
- 단계: 경로/모델 경계 → 행동 controller와 UI → Node 계약/경쟁 테스트 → api/mock/hybrid build·mock/HTTP 대역 브라우저 → Documentation Update Check/context-audit → verifier/ai-review → Git 전달. 편집 전 사용자에게 이 계획을 제시했다.
- 검증: Node 22.20.0·pnpm 11.3.0, 실제 scripts `pnpm test`, `pnpm lint`, api/mock/허용 hybrid `pnpm build`, `pnpm build-storybook`, `git diff --check`. 브라우저는 전용 로컬 Next와 합성 mock/HTTP 대역만 사용한다. 정상/위험/null/query·읽음 성공/실패/중복/경쟁·계정 수명/최종401·목적지 오류·데스크톱/390/320px·Tab/Enter/Space를 분리 기록한다.
- 가정: 기존 상세 ID/query 의미와 POL-04 안전 경계를 유지하고 안전한 query만 재직렬화한다. 저장된 이전 mock의 누락 actionPath는 null로 보완해 읽음 이력을 보존한다. hybrid에서 목적지 ID를 공급원별로 치환하거나 실패 시 mock으로 바꾸지 않는다. 실제 서버 계약/실행 대응은 미확보로 유지한다.
- 현재 blocking product ambiguity 없음. 실제 통합 완료는 자원/승인·배포 계약 미확보로 차단이며 로컬 범위와 구분한다. 자동 수정 시도 시작 0/3.

| 시각/실행자 | 환경·branch/HEAD·작업트리 | 수행/결과 | 다음 첫 행동 |
| --- | --- | --- | --- |
| 2026-11-09 / Codex | `feat/dev-06-notification-navigation` / `8165cb9`; 최초 clean | 선행 main 반영·로컬 QA 범위·계획 확정. Task/WBS 기록만 편집 | 경로 검증과 DTO/mock 모델 매핑 구현. 실제 API 실행 없음 |
| 2026-11-09 / Codex | 같은 branch/HEAD; DEV-06 소스·테스트·문서만 변경 | 경로/모델·동작 controller·UI·회귀 테스트 구현. 첫 test 159통과/1실패: 테스트 fixture의 기본 인자가 의도한 undefined를 허용 경로로 바꾼 원인 확인. lint 오류0/미사용 fixture 변수 경고1 | 자동 수정1/3: fixture 기본 인자 제거·미사용 변수 정리 후 test/lint 재실행. 이후 구성별 build/브라우저 |

- 2026-11-09 중간 검증: test 160/160·11파일, lint 경고/오류0, api/mock build 및 Storybook build exit0. Storybook의 기존 큰 chunk 안내는 비차단 경고. localhost preview mock 시작 뒤 브라우저 검증, 이어 합성 HTTP 대역 hybrid 확인 예정. 실제 API0건.
- 2026-11-09 브라우저 체크포인트: Chrome 전용 localhost4306에서 전체 mock의 공고/분류2/회사 이동·읽은 항목 Enter·회사 Space·폴백/중복 건수·20→25건·reload/계정별22↔17건·390/320px/Tab을 확인했다. Aside는 연결된 profile이 없어 Chrome CUA로 전환. HTTP 대역(4399) hybrid에서503/명시 재시도·무효 응답·위험 경로·지연/중복PATCH1회·최신 클릭 이동·404읽음 유지·401 refresh1회/최종만료·자동 재생0·로그아웃 뒤 늦은 이동0 확인. 실제 업무 API 실행0건.
- 검증 보완: POL-04의 제어문자 경계를 C1/Unicode format 문자까지 검사하도록 보완, 경로 보완을 포함한 전체 회귀164건 PASS. hybrid 최신 build PASS. mock Preview의 production 시작은 실제 exit1/guard 문구 확인. 마지막 mock/API 재빌드·외부 요청 관측·종료/포트 반환과 문서/두 리뷰가 남았다. 자동 수정은 fixture1회/3회이며 실제 통합 차단은 계속 보존한다.

- 2026-11-09 최종 로컬 검사: 연결 단절 후 멱등 재시도 회귀를 포함해 test165/165·lint 경고0·최신 api/mock/hybrid build·Storybook PASS. 브라우저/viewport 복구·전용 탭 종료, 소유4306/4308/4399 프로세스 종료와 포트 비점유 확인. 비즈니스 API 실제 실행0. 문서 갱신/범위 검사와 read-only verifier/ai-review를 진행한다.


## 2026-11-09 · 종료 체크포인트 / 실제 통합 재개

- 로컬 검증: 최종 test167/167·11파일, lint 경고/오류0, 최신 api/mock/hybrid build·Storybook PASS, production mock 산출물 시작은 예상 거절 exit1. Next/Chrome mock·HTTP 대역·390/320px·키보드·네트워크/세션 결과는 [QA](../../../qa/alarms.md#dev-06-local-qa), 문서/리뷰는 [검토 기록](../reviews/DEV-06.md).
- Review Gate: read-only verifier1은 로컬 범위 PASS·Blocker/Major0·Minor1(‘오래된 실패’ 직접 테스트 누락). 늦은 reject의 최신 이동/폴백 보존2case를 추가해167건 PASS·lint 재통과. JPEG 원본을 PNG 확장자로 저장했던 QA 파일은 픽셀 변경 없이 jpg로 맞추고 링크 재검사. 자동 수정2/3(최초 fixture, 리뷰/증거 보완). 런타임 후속 수정은 없다. 종료 diff로 verifier/ai-review를 재확인하고, 최종 적용 범위/결과는 아래 freshness receipt에 남긴다.
- Documentation Update Check: architecture/data-access(새 모델 경계·controller/mock 호환), 개발 안내, plan(WBS 연결), QA/README, Task/WBS/review 갱신. package/scripts/하네스 변화 없어 base/harness 유지. 반복/보안 사건 근거 없어 ai-failures 신규 항목 없음. baseline/coverage 원본 보존.
- 실제 통합: ANAV-01~10 0통과·10차단. 사용자 로컬 검증 진행 답변을 전체 통합 PASS·실제 API 실행/운영/배포 또는 타 Task QA 면제로 확대하지 않는다. WBS에서 DEV-06은 차단으로 남긴다.
- 재개: backend 계약/배포 역할의 비식별 schema/version·실행 대응, 합성 계정/알림/공고/분류/회사 및 시작/종료 기대값, 로그인/N/C/R 사용·변경·읽음 잔존·복구 담당/방법, 오류/401 안전한 재현·해제 승인을 확보한다. 담당 개인은 미지정. 최신 소스/실행 확인 뒤 ANAV 전체 실제 실행과 두 리뷰가 첫 행동이다.
- 복구: 실제 업무 API0건·외부 데이터 변경 없음. mock 탭은 로그아웃/종료·viewport reset. 소유4306/4308/4399 프로세스 종료·세 포트 비점유 확인. 지연 PATCH가 합성 서버에서 반영될 수 있음을 관측했으며 로그아웃/실패가 서버 읽음 취소를 보장한다고 주장하지 않는다.
- Git 전달: 목적별 `feat`(런타임) → `test`(회귀) → `docs`(증거/인계) 커밋, branch push·template/feature/test/docs 라벨 PR, 실제 head CI/조건 재확인 후 merge commit으로 작은 이력 보존, 로컬 main FF까지 이번 요청 범위다. 이 체크포인트 이후 commit/head/CI/merge 결과는 순환적인 자기 SHA 문서 수정을 피하려고 PR/최종 보고와 로컬 receipt에 기록한다. 현재 요청으로 Git 전달은 승인됐으며 같은 승인 반복 질문 없음.
- 다음 선정: **POL-05** 하나. P0 및 앞선 P1의 기존 차단/선행 미충족을 보존하고, DOC-001 완료를 선행으로 갖는 P1 표 순서상 다음 후보다. 이번 요청7항에 따른 후보 선정/첫 행동 기록만 수행했다. POL-05 요구사항 Gate·제품 동작/실제 연결을 이번 대화에서 시작하지 않았다.
- 다음 대화 첫 행동: 최신 main/HEAD·POL-05 체크포인트/N04·중앙 정책/현재 서버 신호 소유 소스/버전을 확인하고 전송·인증/계정 격리·중복·재연결/화면 복귀·REST 재조회/간격을 Gate로 제시한다. DEV-06 실제 통합 준비 여부도 재확인하되 자료 미준비를 통과로 세지 않는다.

로컬 증거: [Git 전달 receipt](/Users/jisung/.codex/visualizations/2026/11/09/01a1be9f-bc03-7ae0-acab-5142d25c713f/dev-06/git-delivery.json), [최종 리뷰 freshness](/Users/jisung/.codex/visualizations/2026/11/09/01a1be9f-bc03-7ae0-acab-5142d25c713f/dev-06/review-freshness.json). 다른 Mac에서는 PR의 실제 CI·본문 및 저장소 QA/테스트를 확인한다. 로컬 receipt는 이 Mac에만 존재한다.

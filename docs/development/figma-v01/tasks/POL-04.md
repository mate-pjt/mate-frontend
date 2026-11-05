# POL-04 · 받은 알림 actionPath·이동/읽음 정책 확정

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 정책 결정
- 원본 항목: N03
- 선행 작업: [DOC-001](DOC-001.md)
- 목적/범위: 안전한 내부 경로의 허용 범위와 미구현/삭제된 대상·읽음 실패 시 동작을 확정한다. 추천: 검증된 같은 origin 내부 목적지만 허용하고 폴백을 둔다.
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

## 완료 기준

- [x] DTO actionPath와 화면 모델 사이 누락을 현재 소스에서 확인한다
- [x] 외부/프로토콜 상대/인코딩 우회·없는 목적지·읽음 실패의 처리 원칙을 정한다
- [x] 원문/소유 소스·버전·결정자·시각·선택/보류 이유를 기록한다. 추천안은 승인으로 간주하지 않는다.
- [x] 근거 있는 기존 승인 또는 필요한 개발자 결정을 확보하고, 후속 개발의 범위/완료 기준/차단을 갱신한다. 정책 작업도 Review Gate를 수행한다.

## 착수 전 Implementation Brief / 설계 Gate

2026-11-05 16:03 KST 사용자3답변 수신 후 정책 Gate를 해소했다. 아래는 **정책 문서화**의 Brief이며 DEV-06 구현 Brief를 승인한 것이 아니다. 편집 전에 대화에서7문서·영향·단계·검증 계획을 제시했다.

- 요구사항: N03의 현행 actionPath 누락·읽음 동작을 확인하고 안전한 내부 목적지, 없는/위험/미지원 대상, 읽음 성공/실패와 이동 순서를 확정한다. 후속 DEV-06과 실제 QA의 범위·미완료 조건을 기록한다.
- 성공 기준: 위 원래 완료 기준4개, 승인자/원문·정책 version·확인 시각·고정 source ref/내용 지문·이유를 남긴다. 기존 QA/타 Task·기준선을 보존하고 문서 검사·Documentation Update Check·verifier/ai-review를 통과한다. 제품 구현/실제 통합 PASS는 주장하지 않는다.
- in scope: 소유 소스/중앙 정책·서버 계약의 읽기 전용 조사, 사용자 결정·정책/DEV-06·QA 인계, WBS/검토 근거와 승인된 Git 전달.
- out of scope: src/tests/public/package/설정/하네스·라이브러리·기준선 변경, DEV-06 구현, 받은 알림 삭제/보존·실시간 신호·회사 통합/소식 화면 개발, 다른 Task 수정, 실제 로그인/업무 API GET/PATCH·fixture 생성/변경·서비스 운영/배포·외부 메시지. 공개 OpenAPI 비인증 GET1건만 계약 조사로 수행했고 HTTP403 본문은 읽지 않았다.
- 확인한 패턴: AGENTS·feature-workflow/ai-review/context-audit·verifier 역할·WBS/workflow/task-cycle·DOC-001/POL-02 선정 예외·N03 기준선/coverage·QA-11/알림 QA·base/plan/architecture/harness/ai-failures·[data-access](../../../ai-context/data-access.md)·package/PR template. notifications 공개 client/contracts→HTTP DTO/mock 경계·20건 paging·계정 격리·읽음 성공 반영을 유지한다.
- 수정 파일/영향: 이 task, WBS, DEV-06 인계, 알림 QA/QA index, data-access의 정책 상태, POL-04 review의7개 Markdown만. 실행 코드/패키지/빌드·제품 동작 영향 없음.
- 단계: 시작/원격·선행 확인 → 현행 소스/중앙 정책·사용자3결정 → 정책/QA 인계 → 무결성·문서 갱신 확인 → 두 리뷰/후속 변경 재검토 → 정책·QA 인계와 검토/상태 근거를 목적별 docs commit·push·template/type: docs PR·실제 head CI/병합 조건 확인·merge commit·로컬 main FF. 최종 Git receipt는 로컬 증거·PR·최종 보고에서 확인한다.
- 검증: 링크/anchor·79원본/99Task·선행/현재/다음·기존 ALARM 이력/DEV-06 prefix·다른 Task/고정5파일·무관 파일 지문 보존, 정책3결정/허용·거절/읽음 표·신규 QA 계획, 민감 패턴·`git diff --check`. 실제 package8 scripts 확인. Markdown 전용이므로 로컬 pnpm test/lint/build/build-storybook·Next/브라우저·mock/HTTP 대역/실제 업무 API는 미실행하고 원격 head CI를 별도로 확인한다.
- 가정/미결: 세 제품 정책의 blocking ambiguity는 해소됐다. WBS가 현재/다음/상태의 단일 기준이고 날짜별 이력은 보존한다. 배포 OpenAPI/실행 대응·실제 QA 자원은 미확보이며 DEV-06의 Gate/통합 검증 조건으로 남긴다. 원래 POL-04 완료 기준을 실제 배포 QA로 확대하거나, 반대로 정책 PASS를 실제 QA 예외로 확대하지 않는다. 필요한 역할은 개발자 정책 승인자·백엔드 계약/배포/fixture 담당·프론트 실행자이고 개인 담당자는 미지정이다.

<a id="pol-04-decisions"></a>
## 승인 정책 · POL-04 v1 · 2026-11-05

결정자는 이번 대화 사용자다. 16:03 KST 답변 수신 시각을 기록했으며, 아래 선택 원문은 각각 앞선 Q1~Q3의 추천 설명 전체에 대한 답변이다. 로컬 정책 version은 `POL-04 v1`이고 중앙 문서를 수정하거나 중앙 승인 상태를 변경한 것이 아니다. 적용은 후속 DEV-06 구현부터이며 현재 제품 동작은 그대로다.

| 결정 | 사용자 선택 원문 | 채택 이유·효과 |
| --- | --- | --- |
| D1 목적지 | **“공고 상세·나의 회사만 허용 (추천)”** | 구현된 `/bids/{양의 정수 ID}`와 선택 `bidClsfcNo`, `/my/company`만 첫 허용 범위. 서버 문자열을 임의 내부 경로로 실행하지 않고 프론트 지원 범위를 제한 |
| D2 폴백 | **“목록 유지·안내, 목적지 오류는 기존 화면 처리 (추천)”** | 목적지 없음/위험/미지원은 목록 유지·안내. 허용 목적지의 삭제/404·권한·서버 오류는 기존 목적지 화면이 담당. 읽음 rollback/다른 자원 추정 없음 |
| D3 순서 | **“읽음 성공 후 이동·실패 시 목록 유지 (추천)”** | 미읽음 PATCH 성공 뒤 반영/이동, 읽은 항목은 PATCH 없이 이동. 실패/중복/계정 교체·로그아웃/최종401을 안전하게 처리하고 자동 사용자 행동 재생 없음 |

### 허용 경로와 검증 경계

| 입력/목적지 | v1 처리 |
| --- | --- |
| `/bids/{id}` | 현행 상세의 양의10진 ID 및 JS safe integer 검증 범위를 유지. notificationId/resourceId·제목·종류로 대체 ID나 경로를 만들지 않음 |
| `/bids/{id}?bidClsfcNo=...` | 선택 분류 값은 기존 상세 query의 비어 있지 않은50자 이하 문자열 의미를 유지. 정확히1개 key/value만 허용하고 URL query로 파싱/안전하게 재직렬화. 분류가 없으면 임의 번호를 만들지 않음 |
| `/my/company` | query/hash 없이 정확한 경로만. 현재 계정의 기존 회사 화면이 소속/권한/빈 상태를 조회. 서버의 다른 회사/통합 경로를 이 경로로 바꾸지 않음 |
| null/빈 값·무효 타입·지원하지 않는 내부 경로 | 안전한 무이동 폴백. 알림 본문/이력과 읽음 기능은 유지하고 원문 경로를 재출력하지 않는 안내. 이미 읽은 알림도 같은 폴백 |
| 외부 scheme/절대 URL(같은 origin도 포함)·`//`·역슬래시·공백/제어문자 | 거절. 입력은 단일 `/` 내부 경로여야 하며 URL 파서의 자동 보정으로 허용 경로를 만들지 않음 |
| dot segment·인코딩/중복 인코딩된 separator/제어문자 우회·깨진 encoding | 거절. 원문과 파싱 결과 모두 허용 경계를 만족해야 하며 반복 decode/정규화로 위험 입력을 복구하지 않음. 정상 query 직렬화는 경로 우회와 구분 |
| 알 수 없는/중복/빈 query·hash | 거절. `next`, `returnTo`, `resultId`, pagination 등은 v1 허용 query가 아님. `/my/company`의 companyId도 거절 |
| 소식/팀원/회사 통합·인증/가입/수락·API/변경 endpoint 등 | 구현 여부와 별개로 v1 허용 경로가 아니므로 폴백. 새 화면/등록이 준비되면 별도 정책 변경·검증으로 확대 |

경로 검증은 화면에 전달하기 전 경계와 실제 이동 직전에 필요하다. 기존 [auth-redirect](../../../../src/lib/auth-redirect.ts)의 같은 origin 검증만으로는 route allowlist·인코딩/dot segment를 보장하지 않고 폴백도 맞춤 목록이므로 그대로 재사용한 것으로 완료하지 않는다. 구체적인 helper/모델 설계는 DEV-06 Gate에서 정한다. raw actionPath를 `href`/router에 바로 전달하거나 API 실패 시 mock으로 바꾸지 않는다.

### 읽음·이동·오류 순서

1. 현재 계정/항목과 진행 중 사용자 행동을 확인한다. 미읽음은 기존 공개 Repository PATCH를 요청하고 같은 항목/계정의 유효한 성공 응답 뒤 읽음·미확인 건수/이벤트를 반영한다. total/정렬·이력을 읽음 때문에 삭제/변경하지 않는다.
2. 성공 응답에 포함된 목적지도 다시 검증하고, 허용 목적지로 현재 탭에서 이동한다. 이미 읽은 항목은 PATCH/건수 감소 없이 목적지를 검증해 이동한다. 목적지 확인을 위한 새 endpoint/선행 GET을 만들지 않는다.
3. 목적지 없음/위험/미지원이면 `/alarms`에서 기존 목록/본문을 유지하고 안내한다. 이동 실패나 대상 삭제/권한/서버 오류가 읽음 성공을 되돌리지 않는다. 허용된 대상의 오류 표시는 기존 대상 화면 책임이고 공개 전/삭제 자원을 다른 ID로 우회하지 않는다. 중앙 정책의 재공고는 새 공고 대상 snapshot을 따르며 원래 공고로 추정하지 않는다.
4. 읽음 PATCH의 네트워크/HTTP/무효 응답 실패는 이동/낙관 갱신 없이 오류·명시적 재시도를 제공한다. 통신 실패가 서버 미반영을 보장하지 않으므로 재조회/멱등 재시도로 상태를 맞춘다. 읽음 취소 endpoint는 추정하지 않는다.
5. 같은 항목 연속 클릭은 진행 중 중복 PATCH/이동을 막는다. 목록 해제·계정 교체·로그아웃 뒤 늦은 응답은 새 화면 상태/건수/이동을 바꾸지 않아야 한다. 다른 항목의 경쟁 결과도 이전 클릭의 늦은 응답이 최신 사용자 이동을 덮지 않도록 DEV-06에서 검증한다.
6. 401의 동일 계정 refresh1회는 기존 HTTP 책임으로 유지한다. 최종 세션 만료는 기존 로그인 안내/복귀 `/alarms`를 사용하며 로그인 뒤 읽음 PATCH·목적지 이동을 자동 재생하지 않는다. 인증/회사 권한을 actionPath로 우회하지 않는다.

### 소유 근거·구현/배포 한계

- 현행 프론트 시작 HEAD `8e4566d209c6a3b9ed81cac420420b26893d5654`: HTTP DTO의 nullable actionPath는 mapNotification 반환에 없고 `AlarmNotification`·mock에도 없다. UI는 읽음 성공 뒤만 갱신하고 목록에 머문다. 읽은 항목은 조기 반환한다. 기존 계약 테스트의 actionPath는 null이며 이동 정책 검증이 아니다.
- 아래 조사 기록의 중앙/Backend commit·Controller blob은 16:03 KST 재조회에서도 동일했다. [Service](https://github.com/mate-pjt/mate-backend/blob/1f3b8544dee49fa3936b3229114a58cd9eb7432c/mate-api/src/main/java/kr/co/mate/mate_api/application/service/notification/AccountNotificationService.kt)는 소유 계정·활성 상태와 기존 읽음 시각의 멱등성을 확인한다. nullable 제목/본문/경로·readAt과 필수 ID/type/createdAt의 source 계약을 확인했으나 배포 schema의 필수/nullable serialization·오류 body/실행 SHA는 확인하지 못했다.
- backend source에는 받은 알림 삭제 계약이 있고 [회사 통합 알림 경로](https://github.com/mate-pjt/mate-backend/blob/1f3b8544dee49fa3936b3229114a58cd9eb7432c/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companymerge/CompanyMergeProposalNotificationWriter.kt)는 `/my/company-merge/...`다. 현행 프론트에 이 route는 없고 v1에서도 지원하지 않는다. 삭제 계약의 배포/정책 확인은 POL-20/관련 개발 책임으로 남기며 기존 QA-11의 날짜별 차단을 고쳐 쓰지 않는다.
- OpenAPI 비인증 GET403은 schema/배포 실행 식별자 미확보이며 서비스 장애/API 부재를 뜻하지 않는다. POL-04의 source 확인/정책 확정 기준은 충족할 수 있으나 이 결과로 DEV-06 구현·실제 통합 또는 QA-11 통과를 주장하지 않는다.

<a id="pol-04-handoff"></a>
### DEV-06 인계와 남은 조건

DEV-06은 [정책 인계](DEV-06.md#pol-04-handoff)를 읽고 별도 요구사항/설계 Gate에서 모델·HTTP/mock mapping·계정 수명/접근성·검증 계획을 정한다. 신규 [ANAV-01~10](../../../qa/alarms.md#pol-04-navigation-qa)은 **계획·미실행10건**이다. 기존 ALARM-01~10/QA-11 결과와 분리한다.

- 배포 계약: 백엔드 계약/배포 담당이 비밀값 없는 승인 OpenAPI 경로 또는 비식별 schema snapshot·version/내용 지문·실행 SHA 대응을 준비한다. notifications GET/PATCH의 actionPath/readAt·오류와 실제 대상 URL을 대조한다. 소스 branch SHA를 배포 식별자로 대신하지 않는다.
- fixture/승인: 합성 공고/분류·현재 계정 회사·미읽음/읽음·null/위험/미지원/삭제/권한 대상·안전한 오류/401 fixture, 시작/종료 readAt/unreadCount/total/정렬·세션, 로그인/GET/PATCH의 사용/변경/읽음 잔존 허용·복구 담당/방법·오류 해제를 확보한다. 기존 QA-11 자원 미준비는 유지하고 실제 API mutation은 이 정책/Git 승인에 포함하지 않는다.
- 구현 검증: 정상 query 직렬화와 외부/인코딩/dot segment/오류/중복/키보드/모바일·계정 교체/해제 후 늦은 이동을 테스트한다. api/mock/허용 hybrid에서 notifications와 목적지 공급원이 다를 때 실제 ID를 합성 fixture로 바꾸지 않으며 구체적 검증/제약은 DEV-06 Gate에서 확인한다. 새 그룹/자동 fallback을 이 문서로 추가하지 않는다.
- 다음 후보는 **DEV-06** 하나다. P0는 기존 차단/선행 대기, P1 앞선 POL-02/03과 DEV-03~05는 계약 차단/선행 미충족이다. POL-04 Review Gate 통과 후 DEV-06은 첫 선행 충족 후보가 된다. 다음 첫 행동은 최신 main/Git·이 v1 정책·DEV-06 인계·ANAV 계획·현행 소유 소스/배포·fixture/승인 공백을 대조해 자체 Gate를 작성하는 것이다. 이번 대화에서는 시작하지 않는다.

## 결정 기록

| 날짜 | 질문/선택지와 추천 | 결정·근거·승인자/원문 | 영향 |
| --- | --- | --- | --- |
| 2026-10-27 | 작업 후보 분해 | 정책·API·제품 동작 신규 승인 없음 | 착수 시 Gate 수행 |
| 2026-11-05 16:03 KST | Q1~Q3의 목적지/폴백/읽음 순서 | 위 D1~D3 원문으로 사용자 추천안3개 채택. 정책 version POL-04 v1 | 정책 Gate 해소. 후속 DEV-06/QA 기준만 문서화, 앱/실제 API 실행 승인 아님 |
| 2026-11-05 | Git 전달 | 이번 요청6항의 commit/push·template/라벨 PR·실제 head CI/조건 충족 후 작은 커밋 유지 병합/로컬 main FF | 승인 반복 요청 없음. 제품 mutation/운영/배포와 분리 |

## 체크포인트 · 재개 메모

| 시각/실행자 | 환경·branch/HEAD·작업트리 | 수행/결과·근거 | 다음 행동·차단/재개 조건 |
| --- | --- | --- | --- |
| 2026-10-27 / 문서화 | feature/my-company-overview / f84af24b5f9d + 기존 미커밋 변경 | 보고서에서 작업 정의만 생성. 구현/실제 QA 미실행 | 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다. |
| 2026-11-05 14:09 KST / Codex · 요구사항 Gate 조사 | 시작 main=origin/main `8e4566d209c6a3b9ed81cac420420b26893d5654`, clean·기존 변경0. fetch/FF 확인 후 `docs/pol-04-notification-navigation-policy`, 시작451파일 지문 확보 | DOC-001 `9eae9c0`·POL-02 다음 선정 예외 `35b9842`의 main 반영 확인. 현행 DTO actionPath→모델 누락·읽음 성공 반영/이미 읽음 무동작 확인. 중앙 정책 main `c9e50ff591ae18023164e1a94581c611bf1e4f29`, backend main `475db983ea98831c2acb15f715d09ff9e0a7ad7c`/dev `1f3b8544dee49fa3936b3229114a58cd9eb7432c` 고정 ref 조사. 비인증 OpenAPI GET403·본문 미열람 | 목적지 허용 범위·없는/위험/미지원 목적지 처리·읽음/이동 순서의 사용자3답변 대기. 추천은 승인이 아님. 정책 설계/앱 구현 전 Gate 해소 필요. 이 시점 편집은 WBS/조사 체크포인트뿐이며 실제 업무 API/브라우저·mutation·서비스 운영/배포 없음 |
| 2026-11-05 / Codex · 답변 대기 전 검증 | 같은 branch/HEAD·WBS/이 task의2문서만 변경 | 문서18/18·diff-check PASS. 링크277/anchor20, 79원본/99Task·타98행·기준선5파일·기존 QA/DEV-06·무관445파일 보존. 외부 검사기가 유형 ‘검증’을 상태로 오집계해 상태 열만 읽도록1회 수정 후 전체 재검사 PASS | 자동 수정1/3(저장소 밖 검사기만). 정책3답변 전 설계/구현·최종 Review Gate·commit/push/PR/CI/merge는 미실행. 답변 후 정책 Brief와 문서 범위 확정부터 계속 |
| 2026-11-05 16:03 KST / Codex · 사용자 답변 후 재개 | 같은 branch/HEAD·우리2문서만 dirty. fetch 후 원격 main/중앙·backend refs 동일 | D1~D3 추천안 채택 답변 확보. 편집 전 정책 Brief·7문서/범위·문서검증/두 리뷰·Git 전달 계획 제시 | WBS에서 POL-04만 진행으로 표시하고 정책/DEV-06/QA 인계. 남은 배포/실제 QA·기존 reset Major는 유지 |
| 2026-11-05 / Codex · 검증/Review Gate·종료 인계 | 같은 branch/시작 HEAD·7문서만 변경 | 문서28/28·diff-check·ai-review·독립 verifier1차 PASS, 신규 Blocker/Major 없음. 독립 Minor1건(ANAV-05 외부 요청0건의 N/C/R 제외 범위)은 최소 문구 수정. 사용자3정책/DEV-06·QA 인계·문서 갱신 확인 완료 | WBS에서 POL-04 완료·다음 DEV-06 준비/첫 행동 기록. 이 종료/Minor 변경도 영향 문서검증·두 리뷰를 재실행해 최종 diff 고정 후 Git 전달. 최종 read-only 원문/지문·실제 Git 결과는 로컬 receipt·PR·최종 보고. DEV-06 앱 구현/업무 API 미착수 |

### 2026-11-05 · 답변 전 미결 질문과 조사 한계(이력)

아래 Q1~Q3의 ‘미승인’은 답변 전 시점의 이력이다. 이후 결정은 위 D1~D3/16:03 KST 재개 기록을 따른다.

- Q1 추천(미승인): 공고 상세 `/bids/{양의 정수 ID}`와 선택 `bidClsfcNo`, `/my/company`만 초기 허용한다. 단일 `/` 내부 경로만 받고 외부·같은 origin 절대 URL·프로토콜 상대·역슬래시·공백/제어문자·인코딩 우회·dot segment·알 수 없는 query/hash를 거절한다. 대안은 공고 상세만 허용이다.
- Q2 추천(미승인): null/위험/미지원 목적지는 읽음 성공 뒤 목록 유지·안내, 허용 목적지의 404/권한/서버 오류는 기존 목적지 화면에서 처리한다. 읽음을 되돌리거나 다른 자원을 추정하지 않는다. 대안은 목적지 없음만 안내 없이 유지다.
- Q3 추천(미승인): 미읽음은 기존 읽음 성공 반영 원칙 뒤 이동, 이미 읽음은 PATCH 없이 이동한다. 실패 시 이동/낙관 갱신 없이 오류·재시도, 중복 클릭/계정 변경 뒤 늦은 이동 방지, 최종 401은 기존 세션 처리·로그인 후 `/alarms` 복귀이고 자동 변경/이동 재실행은 없다. 대안은 실패해도 허용 목적지 이동이다.
- 현행 프론트 [HTTP](../../../../src/data/notifications/http-repository.ts)·[화면 모델](../../../../src/types/alarm.ts)·[목록 UI](../../../../src/components/alarms/alarm-page-client.tsx)·[항목](../../../../src/components/alarms/alarm-list-item.tsx)·[복귀 경로 유틸](../../../../src/lib/auth-redirect.ts)·[mock](../../../../src/data/notifications/mock-repository.ts)와 기존 QA-11/ALARM-01~10, data-access를 대조했다. 기존 mock/HTTP 대역은 actionPath 이동 검증이 아니며 이번 재실행도 아니다.
- 중앙 [알림 정책](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/notification/overview.md)은 재공고의 새 공고 목적지·알림 이력/읽음 원본을 정의하지만 초기 프론트 허용 경로·실패 시 이동 정책은 정의하지 않는다. blob `c649b3092157a091f1be54d92195e65622150ac9`는 내용 지문이며 commit ref와 구분한다.
- backend [Controller](https://github.com/mate-pjt/mate-backend/blob/1f3b8544dee49fa3936b3229114a58cd9eb7432c/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/notification/AccountNotificationController.kt)는 nullable actionPath·readAt과 소유 계정의 멱등 읽음을 정의한다. main/dev의 Controller blob은 동일하다. [관리자 경로 검증](https://github.com/mate-pjt/mate-backend/blob/1f3b8544dee49fa3936b3229114a58cd9eb7432c/mate-api/src/main/java/kr/co/mate/mate_api/domain/adminnotification/AdminNotificationTextPolicy.kt)은 내부 경로를 제한하지만 화면 존재/권한은 목적지 책임이다. 이 소스 ref를 배포 실행 SHA로 해석하지 않는다.
- 읽기 전용 context-audit: package8 scripts·pnpm11.3.0·Node pin22.20.0/기본 셸26.5.0·설치22.20.0, 공개 Repository 진입점·7그룹/snapshot·guard·저장소 계정 격리·하네스와 WBS 위임을 확인했다. [기존 reset Major](../reviews/POL-02.md)는 source에서 그대로 확인돼 감사 전체 FAIL을 유지하며 POL-04에서 수정하지 않는다. 신규 서버 source에는 삭제 계약과 프론트 미구현 회사 통합 목적지도 보인다. 과거 ‘삭제 API 없음’ 관찰을 현재 source 부재의 증명으로 사용하지 않고 POL-20/관련 개발의 후속 대조 대상으로 남긴다. 이번 승인이나 Git 전달로 실제 배포/QA 차단을 해소하지 않는다.
- 안전한 선택 근거만 로컬 증거 폴더 `/Users/jisung/.codex/visualizations/2026/11/05/01a1aa19-365c-78f2-8578-7f78649aa872/mate-pol-04/`의 시작 지문·소스5파일/commit·blob·SHA-256 receipt·검증기에 보존했다. 환경파일/인증정보·업무 응답·원문 GitHub 메타데이터는 저장하지 않았다. 실제 API 업무 실행/브라우저/제품 변경0건이며 새 잔존/복구 대상이 없다.

## 검증·리뷰·인계 기록

| 구분 | 실행 명령/사례·환경 | 결과 | 증거/미실행 이유 |
| --- | --- | --- | --- |
| 답변 전 조사 문서 | 로컬 validate_pol04.py·git diff --check | 18/18 PASS | 링크/ID·기존 이력·지문/범위. 앱/실제 API PASS 아님 |
| 정책/소유 source | 사용자3답변·고정 프론트/중앙/Backend source 대조 | D1~D3 확정 | 배포 OpenAPI HTTP403·실행 대응/실제 QA 미확보와 분리 |
| 정책/인계 문서·두 리뷰1차 | validate_pol04.py·diff-check·실제 diff/소유 source·독립 검토 | 28/28 PASS·ai-review/verifier PASS | 링크355/anchor43·기존 이력/무관445파일 보존, 신규 Blocker/Major 없음. Minor1건 문구 명확화 후 종료 변경도 재검토 |

- 자동 수정 시도: 2/3. 외부 검사기 유형/상태 열 혼동1회, 독립 리뷰의 ANAV-05 요청 범위 문구 Minor1회 교정. 앱/정책 로직 수정은 없다. 두 교정 후 계획한 문서 검증/리뷰를 다시 확인한다.
- Documentation Update Check: WBS/task/review·DEV-06/알림 QA/index·data-access의 정책 상태7문서를 갱신한다. base(package/scripts/runtime 불변), architecture(현행 구조/동작 설명 불변), plan(WBS 위임·날짜별 이력), harness/Skill/agent(불변), ai-failures(새 고위험/반복 수행 사건 없음)는 유지한다. 외부 검사기1회 교정은 위 기록에 한정한다. 기준선/coverage와 기존 QA 이력·타 Task는 보존한다.
- Review Gate: [검토 기록](../reviews/POL-04.md)의 ai-review 여섯 절/독립 verifier1차 PASS, 신규 Blocker/Major 없음. Minor 문구와 종료/WBS 변경 후 문서검증·두 리뷰를 재실행하고 최종 read-only 원문/지문을 로컬 `verifier-final.txt`와 최종 보고에 남긴다. 기존 reset Major/context-audit FAIL과 DEV-06 실제 QA 미완료는 별도 보존한다.
- 커밋/PR 전달: 검증·리뷰한 정책/DEV-06·QA 인계와 WBS/검토 근거를 목적별 작은 docs 커밋으로 분리한다. 작업 브랜치 push·template/type: docs PR·실제 head CI/보호/리뷰·최신 base 확인 후 merge commit/로컬 main FF. 실제 PR/CI/최종 main SHA/clean은 고정 diff 뒤 로컬 Git receipt·PR·최종 보고에 남겨 결과를 선행 확정하지 않는다.
- 다음 작업 인계: 위 우선순위/선행 근거로 DEV-06 Gate 하나를 WBS에서 준비로 선정했다. 다음 첫 행동은 위 정책/인계·최신 source/실행 대응·자원/승인 공백을 대조한 별도 Gate 작성이다. 이번에는 구현을 시작하지 않으며 배포 계약/실제 QA 자원은 준비 완료나 면제로 간주하지 않는다.

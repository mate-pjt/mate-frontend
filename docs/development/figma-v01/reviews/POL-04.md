# POL-04 · 받은 알림 대상 화면 이동 정책 검토

- 요구사항: N03의 DTO actionPath 누락을 현행 소스로 확인하고 안전한 허용 경로·폴백·읽음/이동 순서를 결정한다. 정책/DEV-06·QA 인계만 문서화하고 검증/리뷰한 결과를 승인된 Git 범위로 전달한다.
- 시작: main=origin/main `8e4566d209c6a3b9ed81cac420420b26893d5654`, clean·기존 변경0, DOC-001/POL-02 선정 예외 main 반영 후 `docs/pol-04-notification-navigation-policy`. 사용자 답변 전의2문서는 이번 조사 기록이며 무관한 변경이 아니다. 답변 수신16:03 KST에 원격 main/중앙·Backend refs를 재확인했고 동일했다.
- 검토 대상: WBS·POL-04 task/review·DEV-06 정책 인계·알림 QA/QA index·data-access의7개 Markdown. src/tests/package/설정/하네스·기준선·coverage·다른 Task는 변경하지 않는다.
- 승인: 이번 대화 사용자 [D1~D3 선택 원문](../tasks/POL-04.md#pol-04-decisions), `POL-04 v1`/2026-11-05. 기존 추천안·Git 권한을 임의 정책 승인으로 해석한 것이 아니다. 구체적 DEV-06 구현/실제 API mutation/운영/배포는 범위 밖이다.
- Task 완료 기준은 현행 누락 확인/정책 원칙·출처/사용자 결정·후속 개발/검토다. 배포 OpenAPI403·실행 대응/QA 자원은 DEV-06의 미완료 조건으로 남기고 정책 PASS와 실제 통합 PASS를 구분한다. 기존 QA-10 reset Major는 이 문서 diff의 신규 결함으로 세지 않으며 해결하지도 않는다.

## 검증/증거 범위

| 구분 | 확인/명령 | 결과·한계 |
| --- | --- | --- |
| 현행 프론트 | 시작 HEAD의 notifications HTTP/contracts/모델/mock·알림 UI/헤더·auth 복귀/상세 query·공개 진입점 | actionPath 모델 누락·읽음 성공 반영/이미 읽음 무동작 확인. 구현/자동/브라우저 재실행 아님 |
| 중앙/Backend source | task에 고정한 commit refs·원문/내용 지문 | nullable actionPath/readAt·소유 계정/멱등 읽음·관리자 경로 제한·미구현 회사 통합 목적지 확인. source ref를 배포 실행 SHA로 쓰지 않음 |
| 공개 OpenAPI | 비인증 GET `/v3/api-docs` | HTTP403·본문 미열람. schema/info.version·배포 실행 대응 미확보. 서비스/API 부재 판정 아님 |
| 문서 검사 | 로컬 `validate_pol04.py`, `git diff --check` | 1차28/28 PASS·링크355/anchor43. 시작451파일·79원본/99Task/고정5파일·기존 QA/DEV-06 prefix·허용7문서/무관445파일 보존. 종료 후 검사/지문은 로컬 결과에 기록 |
| 로컬 앱 test/lint/build/Storybook | package.json의 실제8 scripts·Node pin22.20.0/설치22.20.0·기본 셸26.5.0·pnpm11.3.0 확인 | Markdown 전용·실행 코드/빌드 영향 없음으로 미실행. 원격 head CI 결과는 Git receipt/PR·최종 보고에서 별도 확인 |
| mock/HTTP 대역·실제 Next/브라우저·업무 API | 실행하지 않음 | 신규 실제 통과0건. ANAV-01~10은 계획10건 모두 대기·미실행, ALARM/QA-11 기존 결과/차단 보존 |

로컬 증거는 `/Users/jisung/.codex/visualizations/2026/11/05/01a1aa19-365c-78f2-8578-7f78649aa872/mate-pol-04/`의 시작 manifest, source5파일/commit·blob·SHA-256 receipt, 검증기/결과·read-only 리뷰 원문·Git receipt다. 원문 connector 응답·작성자/서명 메타데이터·환경파일/인증정보·업무 API 응답은 저장하지 않는다. Git에 없는 로컬 증거가 없어도 정책 원문/고정 source 링크·QA 계획은 저장소 문서로 읽을 수 있다.

## Context Audit Report

### 결론

**FAIL — 기존 개인 필터 reset 정합성 Major 유지.** POL-04와 연결되는 알림/공개 경계·공통 context를 읽기 전용 감사했다. 아래 기존 문제는 source 확인 시점부터 존재하고 이번 정책 문서 diff의 신규 Blocker/Major가 아니다. 관련 없는 도메인 전체 감사나 자동 수정은 하지 않았다.

### 확인한 코드베이스 사실

- package의 pnpm11.3.0·Next16.2.9/React19.2.4/Vitest4.1.11·8 scripts·lock9.0·Node pin22.20.0과 독립 type-check/format 부재가 문서와 일치한다. 기본 셸 Node는26.5.0으로 구분한다.
- 7개 Repository source group/client·server-only bids/qna, config snapshot·hybrid 의존/운영 guard, 계정별 탭 저장소 namespace와 삭제 범위를 확인했다. notifications API 실패의 mock fallback은 없고 받은 알림/건수/읽음은 같은 그룹이다. 업로드와 무관 도메인 내부 전체 검증은 범위 밖이다.
- DTO actionPath를 모델/합성 fixture가 제공하지 않고 UI는 읽음만 처리한다. 허용 상세 ID/선택 분류 query와 `/my/company` route는 존재한다. 이번 정책을 구현 완료로 바꾸지 않는다.
- 세 Skill/읽기 전용 verifier/placeholder config와 plan의 WBS 위임·고정 coverage가 있다. 원본79개/Task99개와 기존 QA는 보존 검사 대상이다.

### 문서별 정합성 점검

#### base.md

package/scripts·dependency/Node pin 사실과 일치한다. 런타임·실행 명령 변경이 없어 갱신하지 않는다.

#### architecture.md

공개 Repository/DTO 경계와 알림20건·성공 뒤 읽음/건수·삭제 준비 중 설명이 현행 프론트와 일치한다. 아직 이동을 구현하지 않아 현재 동작 설명을 유지한다.

#### data-access.md

기존7그룹·snapshot·운영 guard/계정 격리·fallback 금지를 유지한다. actionPath의 정책만 확정됐다는 날짜/원문 링크와 DEV-06 구현·통합 미완료를 동기화했다. 읽음 성공 반영 규칙은 그대로다.

#### plan.md

현재/다음/상태는 WBS에 위임하며 과거 구현/QA 이력은 날짜별 사실이다. POL-04 정책 결정과 ANAV 신규 계획·QA-11 과거 통과/현재 차단을 분리했다. 상태를 plan에 중복 관리하지 않는다.

#### harness.md

feature-workflow/context-audit/ai-review와 verifier 역할·placeholder 설정이 문서와 일치한다. 문서 전용 검증/변경 후 재검토 규칙을 적용하며 하네스는 수정하지 않는다.

#### ai-failures.md

외부/Git 응답은 필요한 SHA·source 본문·CI/merge 필드만 투영했고 원문 메타데이터/인증 로그는 출력하지 않았다. 외부 문서 검사기의 유형/상태 혼동1회를 최소 교정했고 task에 기록했다. 새로운 고위험/반복 사건의 근거가 없어 공통 실패 기록을 추가하지 않는다.

### 발견된 불일치

- 심각도: **Major (기존, POL-04 변경 범위 밖)**.
- 관련 문서: [POL-02 기존 감사](POL-02.md), [QA-10](../tasks/QA-10.md)의 재개 조건/승인 정책.
- 실제 코드베이스 상태: `src/data/personal-filters/mock-repository.ts` reset은 EMPTY_DEFAULT·canImportCompany=false를 만들고 HTTP fetch 대역도 EMPTY_DEFAULT를 반환한다.
- 문서의 현재 설명: 승인 정책의 초기화는 빈 SAVED를 남겨 회사 기본값을 억제한다. 기존 대역 성공은 그 source/version/억제 의미를 검증한 증거가 아니다.
- 추천 조치: QA-10/POL-02의 승인된 처리 범위/재개 조건에 따라 런타임·회귀 검증을 별도 수행한다.
- 자동 수정 가능 여부: **No, developer confirmation required** — POL-04 정책/문서·Git 범위로 다른 Task의 코드를 수정하지 않는다.

backend source의 삭제 계약/미구현 회사 통합 경로는 추가 관찰이다. 과거 ‘삭제 API 없음’을 현재 source 부재로 일반화하지 않도록 task/QA에 한계를 추가했다. 배포 미확보여서 현재 실서버 지원·ALARM-04 해소/새 정책 승인을 단정하지 않는다. 이 관찰은 POL-20/관련 개발의 재확인 대상이다.

### 개발자 확인 필요 사항

POL-04 세 정책은 확정됐으며 같은 승인을 다시 받지 않는다. DEV-06에서는 배포 계약/실행 대응과 합성 알림·공고/분류/회사·안전한 오류/401·사용/변경/잔존/복구를 확보해야 한다. 실제 개인 담당자는 미지정이다.

### 추천 수정 방향

정책/DEV-06·QA 인계 문서만 전달한다. 실제 QA 차단/기존 Major는 그대로 두고 POL-04 검증/리뷰가 통과하면 WBS 순서상 다음 DEV-06 Gate 하나만 선정한다. 구현은 다음 대화에서 시작한다.

## Documentation Update Check

- 갱신: WBS/task/review·DEV-06의 정책 인계·알림 QA/QA index·data-access의 정책 상태7문서.
- 유지: base(패키지/실행 불변), architecture(현재 구조/제품 동작 불변), plan(WBS 위임·날짜별 이력), harness/Skill/agent(불변), ai-failures(추가 예방 항목을 요구할 사건 없음), baseline/coverage(원본/매핑 불변). 중앙 정책/Backend 저장소와 다른 Task 기록은 수정하지 않는다.

## AI Review

### 1. 리뷰 요약

**PASS (정책/DEV-06·QA 인계7문서 범위).** 원본 요구사항·사용자3답변·git status/stat/diff와 신규 review 전문·현행 프론트/고정 source·package/28문서검사를 직접 대조했다. 정책 Task와 제품/실제 QA의 완료 여부를 분리한다.

### 2. 발견된 문제

신규 미해결 Blocker/Major/Minor 없음. 독립 verifier의 Minor1건은 ANAV-05의 ‘외부 요청0건’을 허용된 N/C/R 외 위험 목적지 요청으로 명확히 해 수정했다. 기존 reset Major는 위 감사에 분리했으며 이번 변경이 해결한 것으로 세지 않는다.

### 3. 누락된 검증

로컬 앱/실제 API·브라우저 검증은 문서 전용 범위로 미실행이다. ANAV 계획/실제 계약·자원 미확보를 명시했으며 실제 기능 PASS로 계산하지 않는다.

### 4. 문서 갱신 필요 여부

위 Documentation Update Check의7문서 반영과 기존 이력/매핑 보존을 확인했다. base/architecture/plan/harness/ai-failures의 추가 갱신이나 정책 재승인이 필요한 공백은 없다.

### 5. 개발자 확인 필요

POL-04 정책 추가 승인 없음. 후속 구현/실제 QA 자원과 변경·복구 범위는 DEV-06의 별도 Gate에서 확인한다.

### 6. 추천 수정 방향

정책/인계 문서만 목적별 docs 커밋으로 Git 전달한다. 종료/Minor 문구·WBS의 POL-04 완료/다음 DEV-06 준비 반영 뒤 영향 검증·두 리뷰 freshness를 재확인한다. 다음 Task는 새 대화의 Gate만 선정하며 자동 착수하지 않는다.

## 독립 verifier·검토 freshness

- read-only verifier는 `.codex/agents/verifier.toml`에 따라 원본 요구사항·diff/신규 전문·관련 source·검증 결과를 직접 확인한다. 코드는 수정하지 않는다.
- 독립1차: **PASS**, 신규 Blocker/Major 없음. 문서28검사·diff-check·원본 diff/신규 전문·source5개를 읽기 전용으로 확인했으며 파일 수정은 없었다. 1차7파일 집계 SHA-256 `f54655f5f9a45206b134bddafaff7a94047fdfc5545767875377e055146afefb`. 위 Minor 문구 교정은 primary가 수행했다.
- 자동 교정2/3은 외부 검사기1회/리뷰 문구1회다. 첫 검토 이후 Minor 문구·결과 기록·종료 체크리스트/WBS 현재/다음 상태가 바뀌었으므로 문서검증과 ai-review/verifier를 다시 수행한다. 최종 원문/정확한 지문은 로컬 `verifier-final.txt`·최종 보고에 보존한다. 고정 뒤 실제 PR/CI/main SHA는 로컬 receipt·PR·최종 보고에 남기며 미실행을 선행 PASS로 쓰지 않는다.

# POL-02 · 맞춤 목록 정책/계약 조사 검토

- 요구사항: POL-02 한 Task의 현행 근거·사용자 결정·후속 DEV-03/QA 기준을 기록하고 미확인 배포 계약/기존 reset 차단을 보존한다. 검증/리뷰한 문서는 승인된 Git 전달 범위로 main에 통합한다.
- 시작: main=origin/main `1fe6649b2bfc1fa20dc18eed4928692ea054ece1`, clean·기존 변경0, DOC-001/PR #42 반영 확인 후 `docs/pol-02-personalized-bids-policy`. 대상은 WBS·POL-02 task/review·DEV-03 인계·목록/홈/개인 필터 QA·ai-failures의 8개 Markdown이다.
- [사용자3결정/소유 근거](../tasks/POL-02.md#pol-02-approved-decisions): 현재 개인 필터 + ALL 자동 조회, 빈 조건 설정 안내/전체 공고 이동, 기존 정렬/page/인증/계정 격리·미확인 계약/실제 QA 차단 유지.
- Task 판정은 **정책3결정 확보·전체 계약 Gate 차단**이다. OpenAPI 비인증 GET403으로 version/schema/배포 실행 SHA 미확보, QA-10 reset Major는 미해결이다. 문서 검증/리뷰 PASS·원격 CI·Git 병합은 제품 구현/실제 통합 PASS가 아니다.

## 검증/증거 범위

| 구분 | 명령/근거 | 결과·한계 |
| --- | --- | --- |
| 현행 소유 소스 | 현재 프론트 Page/UI/Repository·고정 commit의 중앙 정책/Backend Controller/request/response | 읽기 전용 대조. 소스 ref는 배포 SHA가 아님 |
| 공개 OpenAPI | 비인증 `GET https://api-test.mate-bid.com/v3/api-docs` | HTTP403, 오류 본문/인증 정보 미열람. info.version/schema/실행 대응 미확보 |
| 문서 무결성 | 로컬 `validate_pol02.py`, `git diff --check` | 31/31 PASS, 1차 링크359/anchor57·종료 링크358/anchor57·보호443파일·고정5파일·타98행·기존 QA/DEV-03/ai-failures prefix 보존 |
| 로컬 앱 test/lint/build/Storybook | package.json의 실제8 scripts 확인, 실행하지 않음 | Markdown 전용·실행 코드/패키지/빌드 영향 없음. 기본 shell Node26.5.0·pin/설치22.20.0·pnpm11.3.0 구분 |
| mock/HTTP 대역·실제 Next/브라우저·업무 API | 실행하지 않음 | 신규 실제 통과0건. 새 RBD-01~09 모두 차단/미실행, 기존 BID/HOME/PBF 판정과 별도 |

로컬 검증기/시작450파일 지문·관련 정책/코드 본문은 `/tmp/mate-pol-02-20261105/`에 보존한다. Git 작성자/서명·전체 branch 응답·인증 로그·환경파일은 증거에 저장하지 않는다. 원문을 읽은 파일 내용 지문을 따로 남기며 commit ref와 구분한다.

## Context Audit Report

### 결론

**FAIL — 기존 reset 계약/검증 정합성 Major 유지.** POL-02와 연결되는 개인 필터/맞춤 목록 범위를 읽기 전용 감사했다. 기존 제품/대역 차이를 이번 문서 diff의 새 결함이나 실제 서버 결함으로 단정하지 않는다. 제품·공통 계약·하네스는 자동 수정하지 않았다.

### 확인한 코드베이스 사실

- package의 pnpm11.3.0·Next16.2.9/React19.2.4/Vitest4.1.11·8 scripts와 pin22.20.0, 독립 type-check/format 부재를 확인했다. 이번 앱 명령을 실행한 것으로 쓰지 않는다.
- 7개 Repository source group·client/server 공개 경계, config의 hybrid 의존/운영 mock guard·snapshot과 계정 namespace 구조를 확인했다. 관련 HTTP는 오류를 전달하고 401 동일 계정 refresh1회를 보존한다. 업로드/타 도메인 내부 전체 감사는 이번 범위 밖이다.
- recommended Page는 빈 props로 로그인/준비 안내만 표시하고, ALL에서만 개인 필터를 조회·수동 적용한다. 새 정책은 아직 구현되지 않았다.
- 중앙 Accepted ADR-0014와 이번 사용자 결정은 빈 SAVED를 보존한다. mock reset 및 HTTP fetch 대역은 EMPTY_DEFAULT를 만들고 기존 테스트는 빈 filter만 검증한다. HTTP 실제 구현은 서버 source를 그대로 검증/수용한다.

### 문서별 정합성 점검

#### base.md

package/scripts·Node pin 사실과 일치한다. 실행 환경의 기본 Node 차이를 명시했고 package/실행 명령 변경이 없어 수정하지 않는다.

#### architecture.md

Page/UI/URL 모델·개인 필터 client와 server-only bids 경계가 일치한다. recommended 준비 안내 설명은 현재 코드의 사실이며 이번 정책 승인을 이유로 완료 설명으로 고치지 않는다. 구조/스타일/UI 런타임 변경 없음.

#### data-access.md

7개 그룹·명시적 snapshot/프로필·DTO/HTTP·계정 저장소·fallback 금지와 관련 경계를 확인했다. 새 정책의 구현은 DEV-03에서 같은 규칙으로 설계한다. 아래 기존 reset 차이는 계속 미해결이며 mock/대역 성공을 빈 SAVED 정책의 증거로 쓰지 않는다.

#### plan.md

날짜별 구현/QA 이력과 WBS 위임을 유지한다. 현재/다음은 WBS, 세 정책/재개 조건은 POL-02, 79/99 매핑은 고정 coverage로 추적한다. 새 정책/계약 미확인과 과거 BID-15/HOME-09 준비 안내 통과를 분리한다.

#### harness.md

세 Skill·read-only verifier.toml·placeholder config, 문서 전용 검증과 검토 뒤 변경 시 재검토 규칙을 확인했다. 하네스 역할/설정/실행 순서는 변경하지 않는다.

#### ai-failures.md

이번 공개 Git 메타데이터 원문 출력 재발과 원인/교정/예방을 값 재인용 없이 추가했다. 이후 응답/receipt는 필요한 필드로만 투영했다. 이미 발생한 출력이 삭제·무효화됐다고 주장하지 않는다.

### 발견된 불일치

- 심각도: **Major (시작 HEAD부터 존재)**.
- 관련 문서: [QA-10 기존 감사](QA-10.md), [개인 필터 QA](../../../qa/personal-bid-filter.md), 중앙 ADR-0014.
- 실제 코드베이스 상태: [mock reset](../../../../src/data/personal-filters/mock-repository.ts)은 EMPTY_DEFAULT·canImportCompany=false·증가 version을 저장한다. [HTTP fetch 대역](../../../../tests/http-contracts.test.ts)도 reset에서 EMPTY_DEFAULT를 반환한다. [mock 계약 테스트](../../../../tests/account-repositories.test.ts)와 공통 테스트는 빈 filter만 assert한다.
- 문서의 현재 설명: 초기화는 빈 SAVED를 남겨 회사 기본값 재적용을 막아야 한다. 기존 대역/테스트 결과는 source/version·회사 기본값 억제의 동등성을 입증하지 못한다.
- 추천 조치: QA-10의 기존 처리 범위/재개 조건과 연계해 수정/회귀 검증 소유권을 확정하고 실제 배포 계약과 별도로 검증한다. 이번 POL-02에서는 구현하지 않는다.
- 자동 수정 가능 여부: **No, developer confirmation required** — 별도 런타임/테스트 변경 범위를 확보해야 한다. 정책 문서화/Git 전달 승인을 reset 코드 수정 승인으로 해석하지 않는다.

### 개발자 확인 필요 사항

세 제품 정책의 답변은 확보돼 반복 승인을 요청하지 않는다. 배포 계약/실행 대응과 기존 reset 차이의 처리 근거가 필요하며, 실제 QA 계정·조건·오류·사용/잔존/복구 자원은 이후 Gate에서 확인한다. OpenAPI403은 배포 API의 부재/서비스 장애를 증명하지 않는다.

### 추천 수정 방향

정책 승인과 현재 구현을 구분한 문서만 전달하고 다음 Task를 POL-02 재개 하나로 유지한다. 배포 계약 근거를 확보하기 전 DEV-03이나 다른 Task로 자동 전환하지 않는다.

## Documentation Update Check

- 갱신: WBS·POL-02 task/review, DEV-03 범위/완료 기준/차단, 기존 목록/홈/개인 필터 QA에 append-only 인계, ai-failures의 이번 재발.
- 유지: base(package/scripts 불변), architecture/data-access(현재 구조/런타임/API/mock 규칙 불변), plan(현재 상태는 WBS 위임·과거 이력 보존), harness/Skill/agent(변경 없음), baseline/coverage(범위/매핑 변경 없음). 중앙 정책 저장소 자체는 수정하지 않는다.

## AI Review

### 1. 리뷰 요약

**PASS (정책/차단 문서화 범위)**. 원본 요구사항·사용자3답변·git status/stat/diff·신규 review 전문·관련 소스/고정 정책·package scripts·31검사 결과를 대조했다. 전체 POL-02 계약 Gate 차단과 문서 전달 판정을 분리한다.

### 2. 발견된 문제

이번 문서 diff의 미해결 Blocker/Major/Minor는 없다. 기존 reset source/검증 Major와 이번 공개 Git 메타데이터 출력 재발은 위 감사/ai-failures에 공개했다. 원문 출력 사건을 문서 PASS로 없애거나 초기 개인정보 출력이 없었던 것으로 주장하지 않는다.

### 3. 누락된 검증

배포 OpenAPI/version·실행 대응, 실제 맞춤 목록/계정/오류·모바일 QA는 미확보다. 로컬 앱 test/lint/build/Storybook·mock/HTTP 대역·Next/브라우저는 Markdown 전용으로 미실행이다. 새 RBD9사례와 기존 QA 통과/차단을 합치지 않았으며 원격 CI는 전달 단계에서 실제 head 기준으로 따로 확인한다.

### 4. 문서 갱신 필요 여부

필요한 WBS/task/review·DEV-03/QA 인계·재발 기록을 반영했다. base/architecture/data-access/plan/harness·baseline/coverage를 유지한 이유는 Documentation Update Check에 적었다. 현재 구현의 준비 안내 설명을 정책 승인만으로 완료로 바꾸지 않는다.

### 5. 개발자 확인 필요

이미 답한 세 정책과 Git 전달 승인은 재요청하지 않는다. POL-02 재개에는 배포 계약/실행 대응, 기존 reset 차이의 처리 범위·증거가 필요하다. 실제 업무 API/fixture 변경은 별도 계정·사용/변경/잔존/복구 승인 범위를 확보해야 한다.

### 6. 추천 수정 방향

이번 8문서만 전달하고 다음을 POL-02 재개로 유지한다. 배포 계약 자료를 확보해 확인한 뒤 DEV-03의 client/server 연결·경쟁/취소 설계를 자체 Gate에서 수행한다. 기존 차단을 풀거나 다른 Task를 자동 시작하지 않는다.

## 독립 verifier

**1차 Result: PASS — 8개 Markdown의 정책/차단 문서화 범위.** `.codex/agents/verifier.toml`의 read-only 역할로 원본 요구사항·세 사용자 답변·실제 diff/소스·증거를 독립 대조했다.

- Blocker/Major/Minor: 이번 diff에서 모두 없음. 기존 reset 차이/assertion 공백, 공개 Git 원문 출력 사건은 미해결 한계/재발 기록으로 구분했다.
- 독립 검증: 문서31/31·diff-check PASS. 링크359/anchor57·보호443파일/고정5파일/타98행·기존 QA/DEV-03/ai-failures prefix·검토8파일/소스8증거 지문 일치 확인.
- 미실행: 문서 전용 앱 scripts·mock/HTTP 대역·브라우저/업무 API 미실행은 타당. 배포 OpenAPI/version·실행 대응·실제 맞춤 QA 및 원격 head CI는 별도다.
- Documentation Update Check: 필요한 문서 갱신과 공통 문서/기준선 유지 근거 확인. 승인된 정책 재질문 불필요.
- Developer follow-up: 다음 POL-02 재개가 타당. 배포 계약/실행 대응과 reset 차이 처리 근거 확보 후 Gate를 갱신한다.
- Freshness: 1차 PASS는 당시8파일만 대상으로 한다. 아래 종료 기록/WBS 차단 상태/완료 체크 반영 후 최종 read-only 재검토를 요청한다. 원문은 로컬 `verifier-initial.txt`, 최종 재검토 결과는 `verifier-final.txt`·최종 보고로 보존한다.

## 체크포인트/검토 freshness

- 2026-11-05 13:41 KST: 사용자3결정·소스 대조와 OpenAPI403을 기록하고 8문서만 변경 중이다. 정책/계약 차단·QA-10 Major·공개 Git 메타데이터 출력 사건을 분리했다. 다음은 무결성 검사·ai-review·독립 verifier다.
- 문서31/31·diff-check/자체 ai-review 1차 PASS. 이 결과 문구까지 포함해 문서 검사를 다시 수행하고 read-only verifier에 넘긴다. verifier 결과 뒤 문서가 바뀌면 영향 검증과 두 리뷰 freshness를 확인한다. 정책/계약 차단은 유지한다.
- 독립 verifier 1차 PASS 수신 후 WBS 현재 없음/행 차단·다음 POL-02 재개, task 완료 체크와 결과 메타데이터만 정리했다. 정책/실제 QA/범위 변경은 없다. 종료 기록을 포함한 문서 검사·자체 ai-review와 독립 verifier 재검토를 수행하고, 이후 저장소 문서는 변경하지 않은 채 목적별 문서 커밋/승인된 PR·CI·main 동기화로 전달한다. 원격 결과/최종 SHA/clean은 PR과 최종 보고에서 확인한다.

<a id="pol-02-next-pol-04-review"></a>

## 2026-11-05 13:55 KST · POL-04 선정 예외 후속 검토

- 원본 승인과 적용 범위: [POL-02 후속 예외](../tasks/POL-02.md#pol-02-next-pol-04-exception). 계약 차단·기존 reset Major·정책3결정/재개 조건·QA 이력을 유지하며 다음 Gate 선정만 POL-04로 대체한다. 이전의 ‘다음 POL-02 재개’는 당시 이력으로 보존한다.
- 시작/대상: main=origin/main `4b0e9aea9d606e5a96484bc6e86fc40ee8ded57d`, clean·DOC-001/PR #43 반영, `docs/pol-02-next-pol-04-exception`. WBS·POL-02 task/review의3개 Markdown만 변경한다. POL-04 후보 파일/소유 소스는 수정하지 않고 다음 Task 조사/정책/API/개발은 시작하지 않는다.
- 검증 계획: 로컬 `/tmp/mate-pol-02-20261105/next-pol-04/validate_exception.py`로 링크/anchor·79/99 매핑·선행/다음/상태·타98행·기존2문서 전체 prefix·정책3결정/완료 체크/재개3조건·기준선5파일·POL-04/시작451파일 지문·허용3문서/민감 패턴/diff-check를 확인한다. 이전 검증 receipt/리뷰 원문도 별도 보존한다.
- 미실행/문서 점검: Markdown 전용으로 로컬 앱 scripts·mock/HTTP 대역·실제 API/브라우저 미실행, 신규 실제 통과0건. QA/공통 context/하네스/실행 설정 변경 없음. 기존 context-audit FAIL/reset Major는 그대로이며, 이 후속에서 새 전체 감사를 수행한 것으로 쓰지 않는다. 새 출력/실패 사건도 없다.
- Task/Git 구분: POL-02 전체 계약 Gate 차단과 이번 인계 문서의 검증/리뷰·Git 전달 판정을 분리한다. 실제 원격 head CI·병합 조건과 최종 main SHA/clean은 Git 전달 단계의 PR/최종 보고에 남긴다.
- 현재 체크포인트: 문서화 후 무결성 검사·ai-review와 read-only verifier 예정. 결과를 받은 뒤 종료 기록을 추가하고 영향 검증/두 리뷰 freshness를 다시 확인한다.

### 후속 검증 결과

`validate_exception.py` **26/26 PASS**, 링크299/anchor25·보호448파일·고정5파일·타98행·POL-04/모든 QA 불변·기존 task/review 전체 prefix 보존. `git diff --check` PASS. 자동 수정0/3이며 앱/실제 QA 미실행·신규 통과0건이다.

### 후속 AI Review

1. **리뷰 요약:** PASS (3문서 인계 범위). 사용자 승인 원문·성공 기준·실제 status/stat/diff·WBS 순서/선행·후속 기록·package scripts·26검사 증거를 대조했다. POL-02 계약 차단과 다음 POL-04 선정만을 분리한다.
2. **발견된 문제:** 이번 diff의 미해결 Blocker/Major/Minor 없음. 기존 reset Major/context-audit FAIL과 원래 정책/계약 미완료·실제 QA 차단/과거 출력 사건은 모두 유지한다.
3. **누락된 검증:** 로컬 앱 test/lint/build/Storybook·mock/HTTP 대역·실제 API/브라우저는 Markdown-only로 미실행이 타당하다. 원격 CI는 새 실제 PR head에서 확인해야 하며 과거 PR #43 결과로 대체하지 않는다. POL-04 실제 검증은 시작하지 않았다.
4. **문서 갱신 필요 여부:** WBS/task/review3문서의 예외 원문·선정/인계·검토 근거를 반영했다. QA/공통 context·하네스/ai-failures·baseline/coverage는 새 실행/규칙/사건·매핑 변경이 없어 보존한다.
5. **개발자 확인 필요:** 이번 예외/Git 전달은 명시 승인돼 재질문하지 않는다. POL-04의 정책/서버 계약·안전 경로/읽음 실패 처리와 필요한 자원은 새 대화의 자체 Gate에서 확인하며, 이번 선정으로 승인된 것으로 세지 않는다.
6. **추천 수정 방향:** 3문서만 전달하고 POL-02/기존 reset 차단을 보존한다. 다음 POL-04는 최신 main·후보 정의·N03/data-access·소유 근거/검증 범위 확인부터 시작한다.

### 후속 독립 verifier / freshness

26검사·자체 ai-review 이후 read-only verifier에 검토를 요청한다. 결과 수신 후 종료 기록을 반영하고 최종 재검토를 요청하며, 실제 원문은 후속 로컬 증거 폴더의 `verifier-initial.txt`/`verifier-final.txt`와 최종 보고로 보존한다.

- 후속 독립 verifier 1차 **PASS**, 신규 Blocker/Major/Minor 없음. 요청/원문·WBS 순서/선행·실제 diff·26검사·prefix/receipt 지문을 독립 대조했고, POL-04 준비/활성0·POL-02 차단과 실제 QA/기존 Major 보존을 확인했다.
- 결과를 수신한 뒤 WBS 현재 없음·task/review 종료 메타데이터만 반영했다. 이 최종3문서도26검사·자체 ai-review·read-only verifier로 다시 확인한다. 이후 문서 내용 변경 없이 한 목적의 docs 커밋과 새 PR/CI·정상 merge/로컬 main FF로 전달하며, 최종 결과는 로컬 `verifier-final.txt`·PR·최종 보고에서 확인한다. Git 전달은 POL-02 계약 완료나 POL-04 착수/정책 승인·실제 QA PASS가 아니다.

# POL-07 · 고급 필터 정책 문서 검토

## 검토 대상과 근거

- 원본 요청: POL-07 하나의 요구사항 Gate·소유 근거·정책/후속 범위·검증/두 리뷰·목적별 Git 전달과 다음 Task 선정. 시작 main=origin/main `326d9e289fc9aaec72981c8428262127886b87b8`, clean이었다.
- [사용자 결정](../tasks/POL-07.md#pol-07-decisions): D1 추천 정책 채택, D2 낙찰금액 계약 전 보류. D3는 직접 조사 요청이며 자원 미준비나 로컬 구현 예외 승인이 아니다.
- 문서10개 범위: POL-07/검토 기록, WBS/plan, DEV-09~12, 목록/개인 필터 QA. 실행 소스·테스트·패키지/설정·고정 기준선/coverage·타 Task/기존 QA 이력은 보존한다.
- GitHub 소유 원문18개+지역2개, 관련 배포 OpenAPI DOM schema 요약, GitHub test 배포 success/dev SHA 기록을 확인했다. 실행 프로세스 SHA 직접 증명·실제 필터 적용/저장·경계 fixture/계정/변경·복구 준비는 미확인이다. 다른 Task 차단/예외의 해소로 확대하지 않는다.

## 검증 기록

1차 `python3 .../pol-07/validate_docs.py` **21/21 PASS**, `git diff --check` PASS. 관련 문서 링크396/anchor81·보호454파일·기준선/coverage5파일·원본79/Task99·타96개 WBS행·기존6문서 prefix·소유 원문20/20 blob·main/dev 핵심4파일 일치를 확인했다. 현재 diff와 관련 소스/package/승인 원문을 직접 읽고 아래 ai-review를 수행했다. 앱/업무 API·mutation은 실행하지 않았고 새 ADV12/ADVP4는 모두 대기다. 종료 문서 변경 후 검사를 다시 수행한다.

종료 Task/WBS·다음 선정/검토 기록 반영 뒤 `python3 .../pol-07/validate_docs.py --final` **22/22 PASS**, `git diff --check` PASS. 링크401/anchor83·보호454파일·기준선5/79 ID/99 Task·타96행·기존 prefix·원문20blob/핵심4파일·최종 상태/다음 DEV-09 준비를 확인했다. 아래 ai-review 여섯 섹션을 종료 diff 기준으로 다시 수행했다. 이 결과/종료 메타데이터까지 독립 verifier 최종 freshness를 확인한 후 Git 전달한다.

## Context Audit Report

### 결론

**FAIL — 기존 개인 필터 reset/검증 정합성 Major 유지.** POL-07과 연결되는 조회·URL·저장과 문서/하네스를 읽기 전용 감사했다. 이 기존 문제와 이번 정책 문서 diff의 판정은 구분한다. 정책/배포 문서 확인을 런타임 변경·실제 통합으로 확대하지 않는다.

### 확인한 코드베이스 사실

`package.json`의 Next16.2.9/React19.2.4/Vitest4.1.11/pnpm11.3.0·8개 scripts와 base의 사실이 일치한다. shell Node26.5.0, 설치된22.20.0·.nvmrc/CI22.20.0을 구분했다. 현재 toolbar의 advancedDisabled·RESULT 낙찰금액 준비 중, ALL 전용 personal URL/명시 저장, DTO의 hierarchy와 mapper의 code/label 축약, mock/대역 reset의 EMPTY_DEFAULT를 확인했다.

### 문서별 정합성 점검

#### base.md

package/lockfile9.0·pnpm/runtime·8개 scripts·미정의 type-check/format·Node pin/원격 CI 구성은 일치한다. 변경 없음. 로컬 앱 검사는 실행 영향 없는 Markdown Task이므로 미실행이다.

#### architecture.md

관련 App Router·bids/components/features·Repository/DTO/mapper·src/data 경계를 확인했다. 현재 고급 UI/맞춤 placeholder와 수동 ALL 적용 설명은 현행 소스 관찰이며, 승인된 미래 정책을 구현 완료로 바꾸지 않았다. 구조 변경이 없어 갱신하지 않는다.

#### data-access.md

7개 그룹·공개 client/server·불변 snapshot/hybrid 제약/production mock guard·계정 namespace·업로드 handle 경계를 확인했다. 새 endpoint/공급원/DTO·fallback을 도입하지 않는다. 현재 정책 승인과 후속 구현은 Task로 연결하고 공통 규칙은 유지한다. 기존 reset Major는 아래에 보존한다. OpenAPI의 `success`와 확인된 기존 wire/HTTP `isSuccess` 차이, schema required 누락을 임의 런타임 수정 근거로 쓰지 않는다.

#### plan.md

WBS가 현재/다음/상태의 단일 기준이며 plan은 POL-07의 날짜별 인계 사실만 연결한다. 79개 원본/99개 Task와 선행 DOC-001/POL-07, DEV-12 보류를 보존한다. D3를 미준비/차단 승인으로 오독하지 않는다.

#### harness.md

AGENTS·세 Skill·verifier.toml·placeholder config가 있고 문서 전용 검사/독립 verifier·ai-review 및 후속 재검토 규칙과 일치한다. 하네스/role/scripts를 변경하지 않았다.

#### ai-failures.md

과거 GitHub 작성자/서명 원문 출력 예방 규칙을 적용해 소스 본문·ref/path/blob와 필요한 배포 상태만 저장했다. 비밀값/.env·인증/업무 응답은 읽지 않았다. Aside 연결 실패 뒤 브라우저로 문서를 확인했고 제품 동작 테스트로 세지 않았다. 사용자 질문 설명 보완·편집 도구 문맥 오류는 해결한 진행 사건이며 이번 Task에서 반복/고위험 제품 실패를 새로 기록할 근거는 없다.

### 발견된 불일치

- 심각도: **Major (기존)**.
- 관련 문서: [ADR/POL-02 정책](../tasks/POL-02.md#pol-02-approved-decisions)·[개인 필터 QA](../../../qa/personal-bid-filter.md).
- 실제 코드베이스 상태: `src/data/personal-filters/mock-repository.ts`의 reset과 `tests/http-contracts.test.ts` fetch 대역은 EMPTY_DEFAULT를 반환한다. `tests/account-repositories.test.ts` 등은 빈 filter만 assert해 source/version/회사 기본값 억제를 충분히 검증하지 않는다.
- 문서/승인 정책: 빈 **SAVED**를 남겨 회사 기본값이 되살아나지 않아야 한다.
- 추천 조치: 기존 QA-10/POL-02의 별도 처리 범위와 실제 자원을 확보한 뒤 최소 런타임/테스트 수정과 회귀 검증. POL-07 문서화와 섞지 않는다.
- 자동 수정 가능 여부: **No, developer confirmation required** — 이번 승인은 정책 문서와 Git 전달이며 reset 구현/대역 수정은 별도다.

### 개발자 확인 필요 사항

D1/D2와 Git 전달은 승인됐으며 재질문하지 않는다. D3는 직접 조사로 답했다. 실제 업무 API 사용·계정 저장/초기화·경계 공고와 오류/복구 준비는 후속 DEV Gate에서 확인한다. 현재 미확인을 사용자 미준비·승인 예외로 바꾸지 않는다.

### 추천 수정 방향

POL-07은 확인한 계약과 승인 정책의 문서 단위로 검증/리뷰한다. 기존 reset Major/실제 QA는 보존하고 다음 DEV-09는 최신 계약/배포·자원 읽기 전용 확인부터 자체 Gate를 수행한다.

## ai-review

### 1. 리뷰 요약

**PASS (정책 문서 종료 diff 재검토)**. 원본 요구사항/승인 D1/D2·D3 지시, 실제 status/stat/diff와 새 검토 파일, 관련 source/URL/HTTP·package scripts·최종22검사 결과를 확인했다. 1차 검토 뒤의 종료 체크리스트/WBS·DEV-09 선정·검토 메타데이터도 다시 읽었다. 정책/저장 범위·보류·후속 Gate가 일치하고 런타임 변경 없이 근거를 추적한다. 제품 구현/실제 필터 통합 PASS가 아니다.

### 2. 발견된 문제

이번 diff의 미해결 Blocker/Major/Minor는 없다. 기존 context-audit reset Major와 OpenAPI/wire·required 설명 한계는 위에 공개했다. 자원 미확인을 미준비/승인 예외로 쓰지 않고 낙찰금액 보류·기존 QA/정책 차단을 보존한다. 소스/설정/개인정보 노출이나 무관한 변경은 없다.

### 3. 누락된 검증

실행 코드/패키지/빌드 영향 없는 문서 Task라 로컬 pnpm test/lint/build/build-storybook·mock/HTTP 대역·제품 브라우저/실제 업무 API는 미실행이다. 배포 OpenAPI 읽기와 GitHub 배포 기록은 실제 필터 통합이 아니다.

### 4. 문서 갱신 필요 여부

Task/WBS/후속4개/QA2개/plan/검토 기록을 갱신한다. base/architecture/data-access/harness는 현재 실행/규칙 변경이 없어 유지한다. 기준선/coverage는 ID/매핑 변경이 없어 고정하며 ai-failures는 새 반복/고위험 실패 근거가 없어 추가하지 않는다.

### 5. 개발자 확인 필요

추가 제품 선택 질문은 없다. 후속 구현·실제 QA는 별도 Gate에서 자료/승인 범위를 확인한다. Git 전달을 운영/배포 권한으로 해석하지 않는다.

### 6. 추천 수정 방향

종료 diff의 read-only verifier 재검토를 마치고 승인된 Git 전달을 수행한다. 두 문서 목적의 작은 커밋·PR/type: docs·실제 PR head CI/병합 조건 확인·merge commit·main fast-forward를 따른다. 다음 DEV-09는 구현 자동 착수 없이 최신 계약/배포·검증 자원부터 확인한다.

## 독립 verifier·freshness

read-only verifier1은 실제 status/stat/diff·새 검토 파일·관련 frontend/Backend/중앙 원문과 자체 Python 검사를 확인해 **PASS·Blocker/Major/Minor0**를 반환했다. 보호454파일·소유20blob·기존6문서 prefix·WBS99/원본79·신규ADV12/ADVP4대기, 문서21검사/검토 지문 일치와 diff-check를 확인했다. 저장소 수정은 없으며 로컬 `verifier-first.md`에 보고서를 보존했다.

그 이후 종료 Task/WBS·다음 DEV-09 준비 선정과 검토 기록이 바뀌므로 문서 검사·primary ai-review 여섯 섹션과 독립 verifier freshness를 다시 확인한다. 최종 수행 전 재검토 PASS를 선기록하지 않는다. 자기 commit/최종 리뷰 hash를 문서에 재기록하는 순환을 피하고 로컬 `review-input-final.json`·verifier 최종 보고·`review-freshness.json`·Git receipt와 PR/최종 보고에서 마지막 검토 대상과 Git 전달을 확인한다.

로컬 근거: [검사 스크립트](/Users/jisung/.codex/visualizations/2026/11/09/01a1bf04-a281-77e1-ba91-437d96d89c5e/pol-07/validate_docs.py), 같은 폴더의 `initial.json`, `source-contract.json`, `source-region.json`, `source-integrity.json`, `deployed-openapi-check.json`, `deployed-openapi-summary.json`, `github-deployment-check.json`, `document-check.json`과 verifier/Git receipt. 원문/일부 실행 산출물은 이 Mac의 근거이며 저장소 문서 자체에는 결정·재개 범위를 남긴다.

## 2026-11-09 · 외부 CI 한도와 Git 전달 후속

[PR #49](https://github.com/mate-pjt/mate-frontend/pull/49)의 head `f0d8fd2`에서 test/lint·api/mock/hybrid 빌드6개·Publish job/Storybook Publish·Vercel PASS를 확인했다. [Chromatic Build103](https://www.chromatic.com/build?appId=6a3dd824dd80645d61f69b82&number=103)은 월간 한도 때문에 Paused/미실행이며 UI Tests·UI Review가 pending이다. 이 실제 외부 조건을 문서 PASS·Publish 성공으로 숨기지 않는다. 사용자 예외 결정 전 병합하지 않았고 결제/설정/보호/검사 상태 변경도 없다. 예외 또는 대기 결정을 기록한 뒤 이 세 문서의 추가 변경을 재검증·ai-review·verifier로 확인한다. 정확한 최종 head/CI·병합·로컬 main 상태는 PR/로컬 receipt/최종 보고에 남긴다.

### Git 전달 기록 추가에 대한 ai-review

1. **리뷰 요약:** Git 전달 중 새로 확인한 외부 CI 한도를 Task/WBS/검토 기록3개에 추가했다. 문서22검사·diff-check와 실제 추가 diff를 재확인했고 정책/후속 구현 범위 변경은 없다.
2. **발견된 문제:** 추가 문서 diff의 새 Blocker/Major/Minor는 없다. Git 병합은 Chromatic 미실행과 사용자 예외 결정 대기로 차단이며, 기존 reset Major/context FAIL은 별도 보존한다.
3. **누락된 검증:** 앱 test/lint·프로필 빌드는 원격에서 통과했다. Chromatic UI Tests/Review는 quota로 미실행/pending이며 UI 통과로 기록하지 않았다. 실제 필터 업무 API/제품 QA는 계속 미실행이다.
4. **문서 갱신 필요 여부:** Git 차단을 Task/WBS/PR/검토 기록에 반영했다. 실행 소스·공통 context·기존 QA/기준선에는 변화가 없어 유지한다. 이 추가 diff도 verifier freshness를 확인한다.
5. **개발자 확인 필요:** 이번 문서 PR에 한정한 Chromatic 미실행 예외 또는 한도 해소까지 병합 대기 결정. 기존 Git 전달 승인 반복 질문이 아니라 새 외부 CI 차단에 대한 질문이며 답변을 추정하지 않는다.
6. **추천 수정 방향:** 차단 기록을 검증·리뷰해 push하고 PR을 리뷰 가능한 상태로 보존한다. 명시적 예외 또는 실제 한도 해소 전 병합/검사 상태 변경은 하지 않는다.

# POL-12 · 정책 문서 검증·Review Gate

[WBS](../README.md) · [정책/승인](../tasks/POL-12.md#pol-12-brief) · [API별 공백](../tasks/POL-12.md#pol-12-api-gaps) · [후속 QA18 계획](../../../qa/my-company.md#pol-12-update-qa)

## 검토 범위와 증거

- 2026-11-13 KST, 기준 frontend `f16056c2c6206307e2330f60fd6e650edc1e22a6`에서의 POL-12 문서 변경. 현재 변경 파일·실제 diff·package.json·기존 소유 source/승인/Figma를 primary가 확인했다. 현재/다음/상태는 WBS만 소유한다.
- source34개는 backend dev `befe434c2b3fd80ddbc12c1d6216f738dd5ea12a`/중앙 main `c9e50ff591ae18023164e1a94581c611bf1e4f29`의 Git blob과34/34 일치한다. [snapshot](/Users/jisung/.codex/visualizations/2026/11/13/01a1d3df-d6dc-7381-ac07-ba024b2566f1/pol-12/source-contract.json)·관련 OpenAPI GET200/3.1.0/v1·184paths와 배포 run 기록은 source/게시/전달 근거다. 현재 실행 SHA/실응답 증거가 아니다.
- Figma 지정11frame metadata와 비교 popup 기본/선택·해 바뀜 배너 screenshot3개를 읽었다. 전수 상태·전체 화면/픽셀·제품 실행 검증은 아니다. 사용자 D1/D3는 설명 요청 이후 screenshot/예시 설명과 재질문 답변으로 확정했고 D2는 최초 답변으로 확정했다.
- 로컬 검증 도구/결과: [validate_docs.py](/Users/jisung/.codex/visualizations/2026/11/13/01a1d3df-d6dc-7381-ac07-ba024b2566f1/pol-12/validate_docs.py), [working 결과](/Users/jisung/.codex/visualizations/2026/11/13/01a1d3df-d6dc-7381-ac07-ba024b2566f1/pol-12/validation-working.json). 최초 조사/정책 문서14/14·diff-check PASS. 종료 상태/인계까지 작성한 뒤 final 검사·두 리뷰 freshness를 다시 확인한다.

## Context Audit Report

### 결론

PASS — 확인한 관련 source/패키지/하네스·이번 문서 범위의 사실 정합성. 전체 앱 기능/모든 문서의 전수 PASS가 아니다. 출력 수행 사건은 아래에 별도 보존한다.

### 확인한 코드베이스 사실

- packageManager pnpm11.3.0, Next16.2.9/React19.2.4·Vitest4.1.11·Node pin22.20.0. 실제 scripts8개이고 별도 type-check/format은 없다. shell Node26.5.0과 pin/CI를 구분했다.
- 실제 company contracts/client/HTTP/mock·기본정보 UI를 확인했다. overview는 기본정보 읽기 전용이며 갱신/수기·이미지 관리 기능이 이번에 구현됐다고 주장하지 않는다.
- data source7개·공개 client/server entry, company의 기존 Directory/Onboarding/Document 포트, immutable config snapshot·hybrid/운영 mock guard·계정 storage/opaque upload 경계는 변경0이다.
- WBS의114개 Task/156개 선행과 coverage79개, 기준선/coverage5파일 및 타112개 Task행·기존 QA/결정 prefix를 검사했다. 후속 개발/QA는 별도 Gate다.

### base.md

실제 package.json/lockfile·.nvmrc/CI와 필요한 실행 정보가 맞는다. 패키지/scripts/런타임 변경이 없어 수정 불필요하다.

### architecture.md

확인한 route/company data/feature/UI·기존 미연결 기능과 일치한다. 이번에는 폴더/API/mock/component 규칙이나 제품 source를 바꾸지 않아 수정 불필요하다.

### data-access.md

공개 Repository·7그룹·config/storage/업로드·DTO 경계와 기존 실제 QA 차단을 유지한다. API 소스 정책과 새 공개 입력/구현을 혼동하지 않았다. 규칙 변경이 없어 수정 불필요하다.

### plan.md

POL-12 날짜별 정책 경계·후속 Gate/QA 링크를 추가했다. 현행 상태를 복제하지 않고 WBS에 위임하며 기존 Completed/In Progress/Next의 날짜별 이력은 보존했다.

### harness.md

세 Skills·verifier.toml·placeholder config를 확인했다. Review Gate/문서 대체 검증·freshness/후속 선정 규칙을 따르며 하네스 변경이 없어 수정 불필요하다.

### ai-failures.md

첫 Figma frame metadata 원문 출력에 불필요한 디자인 예시 필드가 포함된 재발을 기록했다. 사용자에게 알렸고 이후 allowlist/하위 노드로 전환했으며 해당 값을 문서/PR에 복사하지 않는다. 과거 출력의 삭제/무효화를 주장하지 않는다.

### 발견된 불일치

- 이번 변경에서 새 Major/Minor 사실 불일치 없음. 원본 기준선의 ‘프론트 계약 없음’은 과거 관찰로 보존하고 현재 backend 지원 수준/공백은 Task의 날짜별 표에 구분했다.
### 개발자 확인 필요 사항

- API 공백/배너 세부 조건·실제 QA 자원은 사용자 D2/D3에 따라 후속 Gate로 인계했으며 새 endpoint·화면 예외/정책을 임의 확정하지 않았다.
### 추천 수정 방향

- 반복 출력 수행 사건은 사실대로 문서화했고 이후 출력/저장된 증거의 재노출 여부를 최종 verifier가 확인한다. 미확인 팀/개인·접수 일정에 자동 수정/가상 승인을 부여하지 않는다.

## ai-review

### 1. 리뷰 요약

PASS — 사용자 D1/D2/D3·U01/U02/U03/F04의 단일 정책 문서 범위를 충족한다. 선택행만 반영/미선택 보존, 지원/공백 분리, Figma 유지/자료 시점 분리를 현재 계약과 연결했다. 제품 구현·실제 API 통합 PASS와 구분한다.

### 2. 발견된 문제

Blocker0 · Major0 · Minor0. scope 밖 source/환경/패키지 변경이나 기존 QA/기준선 덮어쓰기가 없다. 예시 필드 출력 수행 오류와 이후 교정·남은 한계는 ai-failures에 기록했으며 실제 값을 문서/PR에 재기록하지 않는다.

### 3. 누락된 검증

로컬 `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm build-storybook`·Next/브라우저·mock/HTTP 대역/실제 업무 API는 미실행이다. Markdown 전용이고 실행 source/패키지/빌드 영향이 없어 문서 검사로 대체한다. CUPD18과 기존 MCO/CDASH/가입 QA는 미실행/차단을 보존한다. source/게시 명세 접근과 backend 테스트 소스 확인은 실제 통합 검증이 아니다.

### 4. 문서 갱신 필요 여부

Task/WBS·후속6개 DEV·회사 QA·plan·검토·출력 예방 기록, 종료 때 다음 POL-13 선정/인계를 갱신한다. baseline/coverage 매핑은 불변이다. base/architecture/data-access/harness는 위 이유로 수정 불필요하다.

### 5. 개발자 확인 필요

이번 정책 문서에 추가 결정은 없다. 기존 사용자 승인 범위 내 Git 전달을 계속한다. DEV-17 배너 구체 조건과 나머지 API 보완/실제 QA 자원·사용/변경/복구는 후속 Task의 자체 Gate다. 이번 Chromatic 월간 한도만 예외이며 다른 CI·보호/리뷰 우회·실제 QA 면제로 확대하지 않는다.

### 6. 추천 수정 방향

이번 정책을 기준으로 문서/종료 diff를 재검증·독립 verifier로 확인하고 목적별 작은 문서 commit·PR/라벨·실제 최종 head CI/정상 merge·main FF를 수행한다. 제품/백엔드 계약 보완·다음 Task 실행은 시작하지 않는다.

## 독립 verifier와 freshness

- 예비 사실검증: PASS, Blocker/Major/Minor0. 소유34개 blob·현재 frontend·Figma screenshot·전화번호/삭제 버전 부재·초기 family/이후 제안·COMPLETED의 terminal 합산을 독립 확인했다. 이는 조사/설명 범위에 한하며 최종 문서13파일의 PASS를 대신하지 않는다.
- 현재 문서 산출물의 독립 verifier는 별도로 요청한다. 수행 전에 PASS를 선기록하지 않는다. 검토 후 WBS/체크리스트·POL-13 인계/검토 기록이 바뀌면 검사/ai-review/verifier를 다시 수행한다.

## 2026-11-13 · 산출물 검토와 종료13파일 재검증

### 독립 verifier · 산출물12파일

Result: PASS — 종료 인계 전 정책/후속 기준12파일 한정.

Summary: 사용자 결정·현재 계약/Figma·기존 QA/차단을 구분했고 범위를 지켰다.

Issues: Blocker0/Major0, Minor1(공종명 ‘공백 금지’가 내부 공백 금지로 읽힘). source는 앞뒤 trim·빈값/제어문자 금지이므로 최종 diff에서 교정했다.

Verification: 실제 diff·새 검토파일·package/source/Figma를 읽었고 checker16/16·diff-check를 독립 확인했다. 검사2개 확장 직후의 파서 이중 escaping 실패와 수정/재통과를 확인했다. 앱/실제 API는 문서 전용으로 미실행이다.

Documentation Update Check: 정책/후속·QA·WBS/plan/출력 예방 연결과 디자인 예시 신원·임시 screenshot URL 재노출 없음. 종료 인계는 다음 재검토 대상이다.

Review freshness: 이 결과는 당시12파일 한정이며 종료13파일·Minor 교정·검사 이력의 재검토가 필요하다.

Developer follow-up: 후속 계약/제품·실제 통합과 Git/CI 전달을 구분하고 최종 diff를 전달한다.

### 종료13파일·primary 재검토

- WBS의 POL-12 완료/현재 없음·다음 POL-13 준비, 해당 Task 체크리스트·다음 선정 이유/첫 행동, 위 Minor 교정과 실제 검사 실패/재검증 기록을 반영했다. 후속 제품/QA를 실행하지 않았다.
- `python3 validate_docs.py --final`: **24/24 PASS**, source34/34·원본79개/114Task/156deps·타112행/기준선5개/QA·결정 prefix·범위/링크/표/단일 상태·CUPD18 미실행 보존과 `git diff --check`를 확인했다. [최종 검사 결과](/Users/jisung/.codex/visualizations/2026/11/13/01a1d3df-d6dc-7381-ac07-ba024b2566f1/pol-12/validation-final.json).
- primary ai-review 여섯 섹션을 현재13파일 diff에 다시 적용했다: 리뷰 요약 PASS, 발견된 문제는 Minor 교정 후0, 누락된 앱/실제 QA는 문서 전용·후속 미실행으로 구분, 문서 갱신 완료, 이번 정책의 추가 개발자 확인 없음, 추천 수정 방향은 승인된 Git 전달과 후속 자체 Gate 유지다. context-audit의 위 관련 사실/범위 판단도 유지한다.
- 자동 검증 수정1/3. 제품/정책 실패 수정으로 세지 않으며 검사기 코드/결과는 로컬 증거에 있다. 로컬 pnpm 앱 명령/제품 실행·실제 업무 API PASS를 새로 주장하지 않는다.
- 이 종료13파일을 독립 verifier freshness에 전달한다. 최종 결과는 수행 후 로컬 read-only report/receipt와 PR·최종 보고에서 확인하며, 실제 최종 head CI·병합/main 일치도 그때 확인한다. 이후 내용이 바뀌면 영향 검사/리뷰를 다시 수행한다.

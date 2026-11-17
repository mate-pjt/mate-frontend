# DEV-28 검증·리뷰

대상은 [확정 Brief/D1/D2](../tasks/DEV-28.md#dev-28-brief)와 `feat/dev-28-team-member-changes`, 시작 main `944d14e171897cd30a2281cd8a49be32ad845557` 이후 변경이다. 실제 API 통합은 이번 사용자 D1대로 차단 보존하며, 로컬 기능/문서 품질과 Git 전달을 구분한다.

사용자 추가1회 승인 뒤 두 Major의 source/test·문서 최종 독립 Gate와 primary ai-review는 **PASS**다. 새 최종 head CI/Git 전달은 아래 후속 근거와 실제 PR에서 별도 확인한다. 이전 FAIL·수정3/3·추가1/1·브라우저 초기2관찰과 실제 API 차단을 보존하며 이전 CI나 Chromatic 예외로 대체하지 않는다.

## 첫 read-only verifier · FAIL 보존

verifier는 `.codex/agents/verifier.toml`을 읽고 원본 요구/현재 diff·untracked source/test·package scripts와 검증 로그를 직접 검토했다. 파일 수정/실제 업무·브라우저·Git 변경은 하지 않았다.

| 심각도 | 발견/직접 재현 | 수정·회귀 |
| --- | --- | --- |
| Major | `loadTeamChanges`가 전후 companyId만 비교해 같은 회사의 관리 leaf 회수 중 늦은 회사/타인 요청을 다시 표시. CANCEL도 최신 current leaf를 사용하지 않음 | 현재 소속/전체 leaf 전후 검사·kind별 취소 leaf 확인. 회사 목록·타인 상세·소속 교체·CANCEL POST0 회귀 |
| Major | 회사 요청 목록/상세·취소 확인에 대상 식별 정보 없음 | 같은 회사 exact target 조회(최대4동시), 이름/이메일·종료/과거 원래 소속 fallback. 상세/목록/확인에 대상 표시, 실제 HTTP 브라우저 재검증 |
| Major | 같은 mock repo/runtime의 병렬 직급·권한 명령이 version1을 둘 다 소비해 version2 성공, 첫 변경 유실 | 같은 store/account의 읽기→version 검사→쓰기 lane 직렬화. 서로 다른 factory를 포함한 병렬 명령·관리자 경쟁 회귀 |
| Minor | terminal REUSED도 수락 전 대기로 안내 | 실제 terminal 상태/소속 종료를 구분, APPLIED 재사용 회귀 |

초기829 tests/build PASS가 위 결함을 검출하지 못했다. 발견·수정3/3과838 tests 재검증을 기록하며 첫 FAIL을 최종 PASS로 덮지 않는다.

## 자동·브라우저 검증

- Node22.20.0/pnpm11.3.0 `pnpm test`: 30파일838 PASS. `pnpm lint`: PASS/경고0. 환경파일 없는 격리 API/mock/hybrid `pnpm build --webpack`, `pnpm build-storybook` PASS. 로컬 webpack 선택과 원격 CI의 기본 Turbopack 검증은 별개다.
- 실행 로그: `/tmp/mate-dev-28-contract/test-verified.log`, `lint-verified.log`, `build-api-final.log`, `build-mock-verified.log`, `build-hybrid-final.log`, `storybook-verified.log`. `.env*`/실제 credential은 읽지 않았고 라이브러리·package scripts·하네스 등록 설정 변경0이다.
- [TEAM 로컬 검증](../../../qa/team-members.md#dev-28-local-qa)과 [원시 브라우저 판정](../../../qa/assets/dev-28/dev28-browser-results.json)에 mock·loopback HTTP/실제 Next·모바일·취소/명시 동의/거부·미확정/성공 후 조회 실패/최종401 결과를 구분한다. HTTP fixture2교정과 도구 ref/focus·fullPage 한계를 실제 제품 FAIL/PASS와 혼동하지 않는다.
- 실제 backend source/CI 배포·게시 Swagger는 Brief의 고정 SHA/지문이며 실행 SHA·실제 업무 응답은 미확인이다. 실제 TEAM-05~10/23/25/26의 DEV-28 소유9부분은0통과·차단, 나머지 과거 QA/예외는 보존한다.

## AI Review

### 1. 리뷰 요약

PASS. 원본 Brief·D1/D2와2026-11-17 추가1회 승인에 맞춰 현재 전체 diff와 추가 두 source/test를 검토했다. 현재 목적지는 결과를 유지하고 다른 목적지는 기존 수명을 해제한다. mock은 실제 행동 kind로 분류한다. 전체842 tests/lint0·API/mock/hybrid/Storybook·추가 실제 Next mock과 독립 source 검토를 확인했다. 최종 문서 freshness/Git 결과는 별도다.

### 2. 발견된 문제

첫 Major3/Minor1과 병합 직전 Major2를 각각 보존하고 수정했다. 현재 source/test 미해결 Blocker/Major/Minor0이다. PROFILE_EDIT 없는 합법적 추가 leaf4조합의 capability/허용·거부와 탐색 harness17사례를 독립 확인했다. 추가 브라우저 원시 관찰23PASS/초기FAIL2는 분리해 보존한다. 초기 cross-call 이동의 제품 원인을 확정하지 않으며 fresh3회/동일수명 결과와 대조했다. focus 재조회 중 disabled 초기 읽음은 실제 활성화·확인/명령 결과와 구별했다. 제품 수정으로 이 관찰을 숨기지 않았다.

### 3. 누락된 검증

실제 TEAM9소유 부분0통과·자원/실행 대응·사용/변경/잔존/복구 미확보 차단을 유지한다. native hidden 전수·모든 Figma pixel/child·실제 알림 전달 PASS는 주장하지 않는다. 추가 회차는 HTTP 연결 변경0이며 기존 loopback HTTP 브라우저 전체를 반복하지 않았다. 전체 HTTP 대역 계약과 API profile build는 재실행했다. 이전 DEV-27 hidden1·다른 QA/Task 차단도 유지한다. 새 PR 최종 head CI·정상 merge/main은 아직 확인 전이다.

### 4. 문서 갱신 필요 여부

Task/WBS·리뷰/Context Audit·TEAM QA/추가 원시 관찰·ai-failures와 data-access의 canonical 탐색/행동별 capability를 갱신한다. data-access의 POL-04 당시 허용 경로와 현재 DEV-28 D2 확장을 명확히 분리했다. package/lockfile/scripts·하네스/등록 설정 변경0으로 base/harness는 유지한다. 원본79/114Task/156의존·baseline/coverage5·TEAM26과 과거 QA/승인 예외를 보존한다. 현재/다음/상태는 WBS만 소유한다.

### 5. 개발자 확인 필요

추가1회 결정은 사용자가 확정했으며 미결이 아니다. 새 정책 결정이나 Git 전달 반복 승인은 필요 없다. 실제 API QA 자원/실행 대응·사용/변경/복구는 향후 재개 Gate다. 이번 Chromatic billed limit의 pending2만 예외이고 다른 실패·미해결 리뷰를 면제하지 않는다.

### 6. 추천 수정 방향

추가 기능/제품 수정 없이 최종 문서·독립 verifier freshness를 확인하고 목적별 fix/test/docs commit·push를 진행한다. 해결된 원격 두 thread와 새 최종 head CI/base를 확인한 뒤 정상 merge commit·main FF/SHA/clean을 확인한다. DEV-29는 선정/인계만 유지한다. 추가1회는 완료된 두 최소 수정/검증 단위이며 더 실패하면 자동 제품 수정을 계속하지 않는다.

## Review freshness

수정3/3 뒤 source/test/doc 전체 diff의 read-only verifier 재검토 PASS: 독립 Node22.20.0 `pnpm test`30파일838 PASS, `git diff --check` PASS, 같은 store의 서로 다른 factory에서 version1 병렬 명령을 실행해 성공1/version2·CM010거부1과 첫 성공 보존을 재현했다. lint/세 구성·Storybook/로컬30PASS·fixture-invalid1·실제9차단/원본 보존 근거도 확인했다. 코드·파일 수정/실제 업무 API·브라우저·Git 전달은 수행하지 않았다.

그 뒤 Task/WBS 종료와 DEV-29 선정/인계만 추가했다. 이 metadata diff의 문서 검사·primary ai-review와 독립 freshness를 별도로 확인한다. 후속 리뷰 결과/PR 식별자는 사실 metadata로 기록하고, 코드/정책/검증 범위가 바뀌면 관련 검토를 다시 수행한다. Git 전달/최종 CI·main 반영은 실제 원격과 종료 보고의 별도 판정이다.

2026-11-17 종료 freshness **PASS**: read-only verifier가 Task/WBS·DEV-29 인계와 전체 diff/numstat·diff-check를 직접 확인했다. WBS 중복 첫 행동1행은 DEV-28 착수 당시 역사 기록으로 구별한 뒤 재확인했고 미해결 Blocker/Major/Minor0이다. 최신 문서12개/링크677·114Task/156의존/79원본/보호5/TEAM26·오류0과 완료36/차단23/대기52/준비1/보류2·DEV-29만 준비를 확인했다. Primary ai-review도 위6섹션을 종료 diff에 재적용해 PASS: 요구/범위·승인·타 작업 보존·실제9차단·다음 미실행을 유지한다. 이 결과 기록만 후속 추가했으며 코드·정책·검증 범위가 같아 verifier 및 앱 test/lint/build는 반복하지 않는다. 문서 검사/diff-check는 다시 수행한다.

PR #86 전달 metadata 재검토도 위6섹션 기준 PASS: 최초6커밋/338783b·라벨·CI 실행 중·현재 merge 방식/branch rules 조회와 최종 head 재확인 절차만 기록했다. 제품 변경/새 결정·실제 QA PASS/미래 CI 성공을 추가하지 않았다. Task/WBS의 PR 연결과 Markdown/diff를 재검사하며 독립 verifier/앱 검증 생략 근거는 바로 위와 같다. 최종 원격 결과/정상 merge·main 일치는 PR/종료 보고에서 따로 확인한다.

## 병합 직전 원격 리뷰 · 독립 재현 FAIL

PR #86 head8fa797e의 정상 merge 직전 새 자동 리뷰(대상338783b)·미해결 thread2를 발견해 guard로 중단했다. source/test 수정/merge API 실행0이다. Read-only verifier도 두 결함을 직접 재현해 FAIL을 반환했다.

| 심각도 | 근거/재현 | 필요한 최소 수정·회귀 |
| --- | --- | --- |
| Major | [요청 목록](../../../../src/components/my/team-change-requests-client.tsx:94)의 같은 탭/목록 breadcrumb에서 conceal 뒤 props/Effect 불변. 독립 harness mine/company 모두 load1→1·Effect0·loading/재조회 disabled. primary 실제 Next mock 내 요청 클릭도 같은 URL/로딩·disabled 지속 | 의미상 같은 목적지는 탐색 방지/결과 유지 또는 명시 reload. 다른 경로 conceal 유지. mine/company·상태 필터·breadcrumb·2page→1page 검증 |
| Major | [mock capability](../../../../src/data/company/team-management-mock.ts:95)가 POSITION 결과를 REMOVE/PERMISSIONS에 재사용. PROFILE_EDIT 없는 AGENT+REMOVE+PERMISSION_MANAGE에서 VIEWER canRemove=false/명령REMOVED, AGENT canRequestPermissionChange=false/명령CREATED. primary 격리 Node/독립 verifier 각각 재현 | 각 행동 kind로 판정. 자기/대표자·최후 관리자/read-only 유지. 해당 leaf 허용/없음 거부·실제 명령과 capability 일치 회귀 |

기존838 tests/lint·PR/push3구성 CI/Vercel·재실행 후 Chromatic 게시 성공은 별개다. UI Tests/Review는 billed snapshot limit의 pending 예외이고 이 제품 결함의 면제가 아니다. 자동 수정3/3 뒤 추가1회 결정 전 코드/테스트는 변경하지 않았으며 문서 재현/차단 사실만 갱신한다. 추가 결정 및 수정 뒤에는 독립 verifier/ai-review를 다시 수행해야 한다.

위 새 FAIL/재현을 담은5개 기록 문서의 read-only freshness는 PASS다. 12문서/681링크·114Task/156의존/79원본/보호5/TEAM26 오류0·diff-check·source/test변경0·DEV-28 활성 하나를 확인했다. Primary도 기록 diff의 사실/범위·승인/원본 보존을 확인했지만 기능 Gate FAIL·Major2는 유지한다. 이 결과만 사실 metadata로 추가해 독립/앱 검증은 반복하지 않고 문서 검사/diff를 재확인한다.

## 추가1/1 뒤 최종 Gate · PASS

- 사용자2026-11-17 추가1회 승인 뒤 두 최소 수정/4회귀·842 tests/lint0/세 구성·Storybook과 실제 Next mock·원시 관찰을 반영했다. 독립 verifier는 source/test3파일의 동일 SHA·842 tests·탐색 harness17·mock4조합과 빌드 source 해시/로그, 문서12/682링크/원본·범위·차단을 대조해 전체 Gate PASS를 판정했다. 미해결 Blocker/Major/Minor0이다.
- 브라우저23PASS·초기FAIL관찰2는 원문 결과를 유지했다. 초기 이동 원인은 미확정이며 fresh3회/독립17정상과 구분하고 성공으로 재분류하지 않았다. focus 재조회 중 disabled 읽음과 준비된 실제 활성/확인·명령 성공도 구별했다. 현재 근거에서 추가 제품 결함/필수 QA 보완은 확인되지 않았다. native hidden/pixel 전수·실제 API0/9차단을 해소한 것은 아니다.
- primary는 위6섹션을 전체 최종 diff에 다시 적용해 PASS다. 결과·WBS/체크리스트 종료/PR 식별자만 추가하는 metadata는 문서 검사/diff·primary6섹션으로 확인하며 코드/정책/검증 범위가 동일하므로 독립/앱 검증 반복을 생략한다. 최종 remote head/base/두 thread·CI/merge/main은 실제 원격/종료 보고의 별도 판정이다.

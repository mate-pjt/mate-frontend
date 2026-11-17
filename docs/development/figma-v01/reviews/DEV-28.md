# DEV-28 검증·리뷰

대상은 [확정 Brief/D1/D2](../tasks/DEV-28.md#dev-28-brief)와 `feat/dev-28-team-member-changes`, 시작 main `944d14e171897cd30a2281cd8a49be32ad845557` 이후 변경이다. 실제 API 통합은 이번 사용자 D1대로 차단 보존하며, 로컬 기능/문서 품질과 Git 전달을 구분한다.

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

PASS. 원본 범위/이번 D1·D2·POL-14와 현재 전체 source/test/doc diff를 재검토했다. 직접/동의/금지·본인 변경/마지막 관리자, 요청 상태·버전/UUID·종료/재사용·미확정과 실제/로컬 증거를 구분했다. 첫 독립 검토 결함을 최소 수정했고 자동·로컬 HTTP/브라우저를 재확인했다. 최종 read-only verifier도 미해결 Blocker/Major/Minor0으로 로컬 범위 PASS를 판정했다. 종료 metadata는 아래 freshness로 구분한다.

### 2. 발견된 문제

첫 Major3/Minor1은 위와 같이 수정했고 primary 재검토에서 미해결 Blocker/Major 없음. 긴 Toast는 짧은 첫 문장/상세 banner로 분리하고 draft 오류 수정·native close 후 refresh/onNavigate 수명을 재확인했다. 공개 PR 계정 metadata의 불필요한 출력은 [실패 기록](../../../ai-context/ai-failures.md#dev-28-review-failures)에 보존하고 실제 값을 재인용하지 않는다.

### 3. 누락된 검증

실제9부분의 현재 회사/역할·원본 target/version·서버 transaction 관리자 경쟁·CORS/실행 대응·알림 전달은 자원/사용·변경/잔존/복구 범위 미확보로 차단이다. D1은 이번 로컬 단위 선행이며 실제 통합 PASS/배포 승인이 아니다. genuine native hidden 전수/모든 Figma child·prototype/pixel PASS는 주장하지 않는다. 기존 DEV-27 추가 hidden1미실행·QA-08/가입/회사/문서/DEV-08/MAT-162 차단도 유지한다.

### 4. 문서 갱신 필요 여부

architecture/data-access·plan·개발 가이드·Task/QA·WBS/리뷰·ai-failures를 갱신한다. base는 의존성/scripts/Node 기준이 같고, harness는 역할/순서/등록 설정이 같아 유지한다. baseline/coverage·79원본/114Task/156의존·TEAM26 원본 계획/과거 결정·QA는 보존한다. 현재/다음/상태는 WBS만 소유한다.

### 5. 개발자 확인 필요

남은 신규 정책 결정 없음. 실제 API QA의 자원/실행 대응·사용/변경/복구는 향후 재개 Gate이고 이번 Git 승인은 반복 확인하지 않는다. Chromatic 월간 한도만 이번 사용자 예외로 확인하며 다른 CI/보호 조건을 우회하지 않는다.

### 6. 추천 수정 방향

추가 제품 범위 확장 없이 최종 문서/Context Audit·verifier freshness를 확인하고 목적별 커밋·PR/최종 head CI·정상 merge/main FF를 진행한다. 다음 DEV-29는 WBS 기준 선정/인계만 하고 실제 실행을 시작하지 않는다.

## Review freshness

수정3/3 뒤 source/test/doc 전체 diff의 read-only verifier 재검토 PASS: 독립 Node22.20.0 `pnpm test`30파일838 PASS, `git diff --check` PASS, 같은 store의 서로 다른 factory에서 version1 병렬 명령을 실행해 성공1/version2·CM010거부1과 첫 성공 보존을 재현했다. lint/세 구성·Storybook/로컬30PASS·fixture-invalid1·실제9차단/원본 보존 근거도 확인했다. 코드·파일 수정/실제 업무 API·브라우저·Git 전달은 수행하지 않았다.

그 뒤 Task/WBS 종료와 DEV-29 선정/인계만 추가했다. 이 metadata diff의 문서 검사·primary ai-review와 독립 freshness를 별도로 확인한다. 후속 리뷰 결과/PR 식별자는 사실 metadata로 기록하고, 코드/정책/검증 범위가 바뀌면 관련 검토를 다시 수행한다. Git 전달/최종 CI·main 반영은 실제 원격과 종료 보고의 별도 판정이다.

2026-11-17 종료 freshness **PASS**: read-only verifier가 Task/WBS·DEV-29 인계와 전체 diff/numstat·diff-check를 직접 확인했다. WBS 중복 첫 행동1행은 DEV-28 착수 당시 역사 기록으로 구별한 뒤 재확인했고 미해결 Blocker/Major/Minor0이다. 최신 문서12개/링크677·114Task/156의존/79원본/보호5/TEAM26·오류0과 완료36/차단23/대기52/준비1/보류2·DEV-29만 준비를 확인했다. Primary ai-review도 위6섹션을 종료 diff에 재적용해 PASS: 요구/범위·승인·타 작업 보존·실제9차단·다음 미실행을 유지한다. 이 결과 기록만 후속 추가했으며 코드·정책·검증 범위가 같아 verifier 및 앱 test/lint/build는 반복하지 않는다. 문서 검사/diff-check는 다시 수행한다.

PR #86 전달 metadata 재검토도 위6섹션 기준 PASS: 최초6커밋/338783b·라벨·CI 실행 중·현재 merge 방식/branch rules 조회와 최종 head 재확인 절차만 기록했다. 제품 변경/새 결정·실제 QA PASS/미래 CI 성공을 추가하지 않았다. Task/WBS의 PR 연결과 Markdown/diff를 재검사하며 독립 verifier/앱 검증 생략 근거는 바로 위와 같다. 최종 원격 결과/정상 merge·main 일치는 PR/종료 보고에서 따로 확인한다.

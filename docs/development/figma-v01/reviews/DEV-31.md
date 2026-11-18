# DEV-31 검증·Context Audit·Review Gate

- 기준: [요청/확정 Brief](../tasks/DEV-31.md#dev-31-brief), 시작 main `1be8f7812f7add7f1dc6f744498b694e88aef5d1`·clean → `feat/dev-31-membership-review`. 검토는 실제 Git diff/새 파일·소유 source/package scripts·로그/로컬 browser를 대상으로 한다. 실제 업무/API/메일0·실제5QA 차단 보존과 Git 전달/이번 Chromatic 한도 예외를 분리한다.

## 최종 검증 근거 · 2026-11-18

| 검사 | 실제 명령/환경·근거 | 결과 |
| --- | --- | --- |
| 자동 계약·경계·수명·회귀 | Node22.20.0/pnpm11.3.0의 `pnpm test`, `/tmp/mate-dev31/tests-full.log` | 37files·1085/1085 PASS(신규84). 초기1080 PASS와 독립 Major1 FAIL 보존 |
| lint | `pnpm lint`, `/tmp/mate-dev31/lint.log` | 오류/경고0 PASS |
| API/mock/hybrid Preview | 환경파일 제외 격리 source·동일 `pnpm build`, `/tmp/mate-dev31/build-{api,mock,hybrid}.log`/build-results.json | 3/3 PASS. 격리 자동 install 방지 `pnpm_config_verify_deps_before_run=false`만 실행 환경에 지정 |
| Storybook | 같은 격리 source `pnpm build-storybook`, `/tmp/mate-dev31/storybook.log` | PASS. 기존 chunk-size 경고는 오류 아님 |
| 검증 source 일치 | `/tmp/mate-dev31/final-source-sha256.json` | runtime/test18파일 SHA256 일치 |
| 실제 Next·브라우저 | [TEAM 로컬 QA](../../../qa/team-members.md#dev-31-local-qa)·합성 [목록](../assets/dev-31/list.png)/[검토](../assets/dev-31/review.png)/[모바일](../assets/dev-31/mobile.png) | mock/loopback HTTP 대역 PASS. 실제 개발 API 통합 PASS 아님 |
| 문서·원본·형식 | `python3 /tmp/mate-dev31/validate-docs.py`, `git diff --check` | PASS:114Task/156의존/79ID/TEAM26·723로컬 링크·18소스해시·원본 prefix·Markdown/기준선 보존. 종료 metadata 뒤 재검사 |
| 실제 TEAM-18~20/23/26 | 승인 합성 회사/검토자·신청자·현재 leaf/version·실행 대응·사용/변경/잔존/복구/담당 역할 미확보 | 0통과·5소유 부분 차단. 다른 pending/초대 원자 정리·신청자 실제 상태 미실행 |

## 첫 실패·수정 이력

1. browser의 새 직급 메뉴 SVG 비율 경고를 기존 h-auto/w-auto/정수 크기 패턴으로 교정했다. source/검증 범위를 넓히지 않았다.
2. 첫 read-only verifier **FAIL/Major1**: 승인→정상 직급 변경 뒤 과거 receipt와 현재 팀원의 반복 비교가 남은 신청 목록을 고착시킴을 실제 mock Repository로 재현했다. 당시 독립1080 tests/37files·diff-check PASS는 이 반례를 검출하지 못했다. 이후 변경됨/확인 불가·401/403을 구분하고 후속 변경/내보내기·404/503·권한 회귀5개와 실제 browser를 추가해1085 PASS로 재검증했다. source enum CM004·Figma footer의 danger 토큰·제품 문구도 현재 계약/기존 패턴과 재대조했다.
3. 첫 문서 검사에서 이 예정 리뷰 파일 미생성으로 신규 링크3개가 실패했다. 검토 보고서를 생성하고 문서 검사를 재실행한다. 자동 수정은 이 문서 교정을 포함3/3이며 이후 실패는 근거·남은 결정을 확인한다. 최초 pnpm 격리 TTY 차단·Aside focus/뒤로가기/접힌 details/Meta 관찰은 [QA 도구 한계](../../../qa/team-members.md#dev-31-local-qa)와 구분한다.

## Context Audit Report

### 결론

PASS. 이번 변경의 사실 동기화를 반영했다. audit 자체는 읽기 전용 진단이며 아래 필요한 단순 사실 갱신은 사용자 Task의 Documentation Update Check 범위로 수행했다.

### 확인한 코드베이스 사실

- package/lockfile·Next16.2.9/React19.2.4·pnpm11.3.0·8scripts·Node22.20.0 pin과 7공급원/immutable snapshot·운영 mock guard·public Repository 경계 유지. 기본 shell Node26.5.0은 설치된22.20.0 PATH를 지정해 검증했다.
- 새 신청 포트/route는 같은 company 그룹이며 새 공급원/endpoint/library가 아니다. type-check/format script를 만들거나 실행했다고 주장하지 않는다. `.codex/config.toml` placeholder·3Skills/verifier 파일 유지.

### 문서별 정합성 점검

- **base.md**: package/scripts/runtime/설정 변경0·현재 package와 일치하여 미갱신.
- **architecture.md**: 새 신청 route/포트·검토/명령 scope·receipt와 현재 팀원 구분·공유 mock·QA를 반영.
- **data-access.md**: 같은 company 공급원·private DTO allowlist·PENDING GET/정확 version·권한/인증 직전 수명·지역 mock 보존·신청자/다른 pending 실제 미검증 경계를 반영. repository 개발 가이드의 새3시나리오도 동기화.
- **plan.md**: 이번 날짜별 증거 연결을 추가했다. 현재/다음/상태는 WBS 하나만 소유하고114Task/156의존·79원본/TEAM26 및 원래 차단/승인을 유지한다.
- **harness.md**: 하네스 순서/역할/파일 변경0·실제 entry와 일치하여 미갱신.
- **ai-failures.md**: 과거 receipt/현재 상태 혼동의 독립 재현과 교정/예방을 기록. 기존 실패 이력은 보존.

### 발견된 불일치

미해결 Major/Minor 사실 불일치 없음. 새 route/시나리오·계약 사실은 이번 승인된 문서 동기화로 반영했다. 패키지/하네스 정책 변경이나 무관한 기존 문서 정리를 추가하지 않았다.

### 개발자 확인 필요 사항

새 정책 결정 없음. 실제5QA의 자원/실행/복구는 D1대로 별도 재개 조건이며 이번 로컬 범위·Git 전달을 막는 미확정 승인으로 다시 묻지 않는다.

### 추천 수정 방향

현재 변경을 두 리뷰 후 전달하고, 실제 자원 확보 시 원래 TEAM case ID로 실제 검증을 재개한다.

## AI Review · 현재 diff

### 1. 리뷰 요약

로컬 승인 범위 PASS. 공개 company 계약/HTTP·mock·검토 UI/새 route·원직급/대표자·역할/leaf·사유·정확 version/현재 권한·수명/오류와 후속 조회가 DEV-31 한 요구사항에 맞는다. 실제 API 통합과 Git/main 반영은 별도다. 독립 최종 검토의 결과는 아래에 보존한다.

### 2. 발견된 문제

첫 독립 Major1과 SVG 경고·예정 리뷰 파일 링크3개를 교정했다. 현재 runtime/test18파일과 실제 diff에서 미해결 Blocker/Major/Minor 없음. 무관한 기존 변경0·기존 소스 되돌림0, 새 library/패키지/설정0이다. native dialog·Button/Select/Checkbox·Tailwind 토큰/기존 SVG·metadata/async Server route 패턴을 유지했다.

### 3. 누락된 검증

실제 TEAM5소유 부분 차단/실행0을 명시한다. mock 신청자 계정/다른 회사 pending·수신 초대의 원자 동기화는 검증하지 않았다. Figma는 지정 frame·구조/주요 크기·footer·로컬 상태 대조이며 전체 pixel/모든 frame PASS가 아니다. Aside Meta 새 탭 회귀는 도구가 현재 탭 일반 이동만 관찰해 미판정, 일반 진입·복귀/수명과 프레임워크 onNavigate 사용은 확인했다. HTTP 유실의 앱fetch1/wire2 경계를 실제 서버 보장으로 확대하지 않는다.

### 4. 문서 갱신 필요 여부

architecture/data-access/plan·repository 가이드·QA/Task/WBS·예방 규칙/화면 증거·이 검토 기록을 갱신했다. base/harness·baseline/coverage는 변경 필요 없음. 원본/정책/QA prefix·한 작업/다음 하나와 상태 권위는 문서 검사로 확인한다.

### 5. 개발자 확인 필요

추가 결정 없음. D1은 이번 DEV-31에 한정되며 Git·Chromatic 월간 한도 예외를 업무 실행/실제 QA 면제로 확대하지 않는다. 다음 Task는 Gate 뒤 선정/인계만 한다.

### 6. 추천 수정 방향

현재 검증 소스를 유지하고 최종 read-only verifier·종료 metadata freshness를 통과한 뒤 목적별 feat/test/docs 커밋·PR/실제 최종 head CI·리뷰 조건·정상 merge commit/main FF를 수행한다. 새 실패는 자동 수정 한도와 실제 원인에 따라 처리한다.

## 독립 verifier · 최종 freshness

첫 조기검토 FAIL/Major1·독립1080 tests PASS를 위에 보존했다. 수정 후 runtime/test18파일과 현재 문서·검증 로그의 최종 read-only 재검토를 요청하며, 결과를 이 절에 전사한다. 이 결과 전사는 코드/정책/검증 판정을 새로 바꾸지 않는다. 이후 종료/WBS/다음 인계 등 material 문서 변경은 독립 freshness를 다시 확인한다.

### 수정 후 독립 최종 검토 결과

- **Result: PASS**. runtime/tests/docs 검토, Blocker/Major/Minor0. 최초 반례를 같은 실제 mock Repository로 독립 재실행해 confirmed→정상 직급 변경→changed/반복22건→내보내기→unavailable/22건을 확인했다.401/403은 오류로 전파돼 보호 자료를 숨긴다.
- 독립 `pnpm test`1085/37·문서727links/114/156/79/TEAM26/prefix·`git diff --check` PASS, 작업트리/격리 source의18파일 해시 일치. lint·세 구성/Storybook 로그·합성 HTTP 이력/모바일 PNG 검토. 해당 build/browser는 독립 재실행하지 않았으며 실제 업무/API/메일0이다.
- Documentation Update Check 충족·추가 결정 없음. 실제5QA 차단·첫 FAIL·도구/실행 한계를 보존했다. verifier 수정0이며 이후 종료/WBS·DEV-32 인계의 문서 freshness는 별도 재검토한다. 로그 `/tmp/mate-dev31/verifier-tests-final.log`.

### 종료·인계 freshness

read-only verifier **PASS**: runtime/test18해시 동일·문서114Task/156의존/79ID/TEAM26/741links·active0·diff PASS. DEV-32 원본7,383바이트 prefix와 끝의 신규 인계 하나·선행/기본 순위·예외 비승계·다음 실행0, 실제5QA 차단/최초 FAIL·미완료 Git 사실 보존을 확인했다. 미해결 Blocker/Major/Minor0·verifier 수정0. primary ai-review도 종료/선정·첫 행동·상태 권위와 증거 경계를 재검토했다. 이 회신 전사만 추가해 판정/코드가 같으므로 전사 자체의 반복 검토·앱 재검증은 생략한다. 실제 최종 PR head CI·리뷰/merge/main FF는 다음 Git 단계다.

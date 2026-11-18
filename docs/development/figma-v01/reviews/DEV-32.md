# DEV-32 로컬 검증 및 리뷰

[Task Brief](../tasks/DEV-32.md#dev-32-brief) · [정책 근거](../tasks/POL-14.md#pol-14-contract) · [QA](../../../qa/team-members.md#dev-32-local-qa) · [화면](../assets/dev-32/README.md)

## 검증 대상과 결과

2026-11-18 KST, 기준 `71bcf71c318e27d0849b4bf41e7d2f45e1298903`와 `feat/dev-32-company-positions` 사이의 DEV-32 diff를 검토했다. 시작 작업트리는 깨끗했다. 환경파일을 제외한 격리 소스에서 Node 22.20.0/pnpm 11.3.0으로 실행했다.

| 검증 | 결과 |
| --- | --- |
| `pnpm test` | PASS. 38개 파일, 1,125건. 이번 직급 회귀 40건 |
| `pnpm lint` | PASS. 최초 초기 조회 상태 갱신 오류 교정 뒤 재실행 |
| `pnpm build` | PASS. API, mock, CI와 같은 hybrid overrides로 각 Preview 빌드, TypeScript 및 직급 route 포함 |
| `pnpm build-storybook` | PASS. 기존 chunk 크기 안내 |
| 실제 Next·Aside | PASS. 최종 mock 목록/입력/Toast, 추가/이름 변경/삭제, 로그인·양쪽 진입/2페이지 복귀 및 360px/Escape. HTTP 대역의 정확한 wire·재조회/권한/충돌/응답 오류와 U+FEFF 추가/새로고침 유지는 [QA 기록](../../../qa/team-members.md#dev-32-local-qa) 참조 |
| 문서 및 `git diff --check` | PASS. 114개 작업, 156개 의존성, 79개 원본, 26개 QA와 이전 기록, 링크/앵커 및 Markdown. 런타임·테스트·SVG 19개 해시가 검증본과 일치 |
| 실제 API | TEAM-21/22와 TEAM-23/26의 DEV-32 부분 0통과/4차단. 실제 요청 0 |

최종 검증 부록은 실행한 환경의 `/tmp/mate-dev32.B28jKa/log/review2-*.log`와 `docs-result.json`에 있다. 별도 `tsc --noEmit --incremental false`로 테스트 파일까지 검사하면 시작점과 같은 기존 5개 오류가 나타났다. 이 명령은 프로젝트 스크립트에 없으며 범위 내 TypeScript 확인은 세 Next 빌드에서 통과했다.

## AI Review

### 1. 리뷰 요약

POL-14 D1의 조회·변경 권한, 회사 경계, 일반/시스템 직급, 이름·버전·활성 참조를 구현에 대조했다. 화면·data·test·증거가 DEV-32에 한정된다. 기존 컴포넌트, 토큰, Repository 조합과 저장소 격리를 유지한다.

### 2. 발견된 문제

- 첫 review diff(1,123 tests PASS)의 독립 verifier는 Major 1건으로 FAIL했다. Kotlin에서 허용하는 U+FEFF 직급이 JavaScript의 기존 `trim()`을 통과하지 못해 이미 저장된 직급의 후속 목록과 일부 참조 응답을 막고, mock 상태 검증을 실패시켰다.
- 사용자의 문제 한정 추가 1회 결정 뒤에는 직급명 읽기와 쓰기가 같은 공백 함수를 사용한다. 이름·참조 원문과 시스템 직급은 유지한다. 회귀 2건과 실제 Next HTTP 대역의 POST 1회·행 2→3·새로고침 3을 확인했다. 초기 ESLint, Escape 초점, Figma 취소 아이콘·입력 상태도 최종 파일에서 교정했다. 재검토한 diff의 미해결 Blocker/Major/Minor는 없다.

### 3. 누락된 검증

실제 팀원·직급 API의 네 부분은 차단이다. 전송 전·응답 지연에는 자동 회귀, 응답 단절에는 실제 브라우저와 루프백 대역을 사용했다. 운영 실행 버전·실제 권한 및 처리 결과·전체 디자인 pixel 전수 판정은 확보되지 않았다. 최초 헤더 전 소켓 종료 시의 브라우저 재시도 관측을 [QA](../../../qa/team-members.md#dev-32-local-qa)에 보존한다.

### 4. 문서 갱신 필요 여부

회사 경로와 공개 데이터 포트를 architecture/data-access, 연결·검증을 plan/WBS/Task/QA, 디자인 출처를 아이콘과 화면 기록에 반영하는 갱신을 완료했다. package/scripts·하네스에는 작업으로 인한 차이가 없다. 작업 교정과 재현 조건은 이번 Task의 기록을 사용한다.

### 5. 개발자 확인 필요

로컬 범위에서 필요한 결정은 충족됐다. 실제 QA 재개에는 실행 버전·자원/변경·잔존/복구의 확인이 필요하다. 이번 Git 전달의 한도 예외는 지정한 Chromatic 조건을 최종 PR head에서 별도로 확인한다.

### 6. 추천 수정 방향

현재 리뷰 범위의 추가 수정 사항은 없다. 실제 API의 후속 실행 시 기존 TEAM 사례와 합성 자원/복구 범위를 적용한다.

## Context Audit Report

### 결론

PASS. DEV-32 관련 코드와 작업 문서의 사실관계를 대조했다.

### 확인한 코드베이스 사실

Next 16.2.9, React 19.2.4, Vitest 4.1.11, pnpm 11.3.0 및 실제 8개 scripts를 확인했다. 현재 company를 사용하는 route와 공개 port, 실제 data-access workflow, 로컬 skills 3개와 verifier 설정을 읽었다.

### 문서별 정합성 점검

| 문서 | 확인 사항 |
| --- | --- |
| base.md | 설치 관리자/잠금 파일, 실행 스택, 현재 build/lint/test와 CI 명령이 일치한다. |
| architecture.md | 팀원 관리·직급 route, native dialog와 기존 컴포넌트, 디자인 토큰과 자산 경계를 맞췄다. |
| data-access.md | 기존 7개 공급원, 불변 config snapshot, 운영 guard와 hybrid 제한이 유지된다. 명령은 company 공개 port와 DTO allowlist, 계정별 mock 저장소/직렬화 경계를 따른다. |
| plan.md | WBS에만 상태를 두며, 원본 79개와 작업/선행 연결, DEV-32 자체 기록 및 로컬/실제 QA 구분을 확인했다. |
| harness.md | 실제 feature-workflow, ai-review, context-audit 및 read-only verifier 설정과 맞는다. |
| ai-failures.md | 과거 기록을 보존했다. 이 Task의 lint·초점·디자인·대역 관측을 작업 기록과 QA에 남겼다. |

### 발견된 불일치

DEV-32에서 남은 사실 불일치는 없다. 기존 보조 TypeScript 오류는 위 검증 대상과 결과를 참조한다.

### 개발자 확인 필요 사항

실제 QA를 재개하기 전 자원·실행 대응이 필요하다.

### 추천 수정 방향

현재 DEV-32 diff에 추가 문서 수정 사항은 없다.

## 독립 verifier

- 최초 결과 FAIL, Major 1. 입력/읽기의 공백 계약 불일치와 모형 저장소 초기화 가능성을 확인했다.
- 추가 사용자 승인 후 같은 기준을 적용하고 재검토했다. 최종 결과 PASS, Blocker/Major/Minor 0. 격리 환경에서 독립 `pnpm test` 1,125건, runtime/test/asset 19개와 검증 사본 6곳의 일치, 문서 724개 링크 및 114개 작업·156개 의존/79개 원본/26개 QA를 확인했다. lint·세 build·Storybook과 브라우저 실행 증거를 검토했다.
- 실제 API 4부분은 사용자 승인 범위에 따라 차단이다. 코드와 테스트를 고친 뒤 verifier와 ai-review를 모두 재실행했다. 이어지는 종료·인계와 PR 메타데이터는 변경분을 다시 확인한다.

### 종료·인계 기록 재검토

종료·인계 문서는 verifier와 ai-review에서 적용 상태, 실제 QA 4부분 차단, POL-15 선정 근거·첫 행동, Git 전달 경계를 재확인했다. 제품·테스트·자산 19개 해시가 같고, 종료 시 문서 링크 735개·114/156/79/26과 `git diff --check`가 통과했다. [PR 최초 전달 기록](../tasks/DEV-32.md#dev-32-git-delivery) 이후 실제 최종 head 및 CI 결과는 PR에서 확인한다.

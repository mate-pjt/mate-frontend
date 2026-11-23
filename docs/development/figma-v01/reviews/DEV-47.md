# DEV-47 검증과 Review Gate

[승인·설계](../tasks/DEV-47.md#dev-47-brief) · [자동 검증](../tasks/DEV-47.md#dev-47-verification) · [BKEY 로컬 QA](../../../qa/bid-list.md#dev-47-local-qa)

## 검증 대상

- 시작 `43ae9ddaf42854728816cd2c8491f2b82238f19c`. 공개 3개 보기의 검색 입력·탭 메모리와 기존 인증 동작에 연결한 이력 수명, 테스트, L04 시안 자산, QA·문서 diff를 대조한다. 지난 정책의 D1~D3를 적용한다. [정책](../tasks/POL-23.md#pol-23-contract)
- 최종 런타임 재검증은 고정 Node·pnpm의 43파일 1,258 테스트·lint, api/mock/hybrid 빌드, 전체 mock과 분리된 API/loopback Chromium에서 BKEY 8건이다. 보충 브라우저 검증에서 가상 초대의 로그인 및 계정 교체 경로가 기존 복귀 화면을 열었다. 실행 소스와 브랜치의 지문은 일치한다. [로그와 지문](/Users/jisung/.codex/visualizations/2026/11/23/dev-47-bid-search/)

## 독립 verifier

| 항목 | 보고 |
| --- | --- |
| Result · Summary | PASS. POL-23 D1~D3 및 BKEY-01~08과 일치한다. 명시 검색·재선택을 기록하고 보존 기간·확정 인증 문맥·문서 수명을 적용한다. 기존 조회에 보기를 유지하며 선택한 검색을 첫 페이지로 적용한다. |
| Issues | 미해결 Blocker·Major·Minor 없음. 추천 노출 또는 요청, 검색 이력 저장소·새 분석 전송이 추가되지 않았다. |
| Verification | 전체 diff·변경 경로·`git diff --check`·실행 소스 SHA-256 9건을 확인했다. 테스트 43파일·1,258건, lint, 3개 빌드, mock/HTTP 대역과 고정 Clock의 BKEY 브라우저 로그 및 캡처를 대조했다. 공유 개발 API·실계정/OAuth와 별도 스크린리더, 로컬 Storybook은 미실행이다. |
| Documentation Update Check | DESIGN·architecture·plan·Task·QA·WBS와 원본 79개·Task 114개·선행 156개, QA-02 실제 10통과·6차단의 보존을 확인했다. |
| Review freshness | 최초 PASS는 기준 `43ae9dd`의 18파일 diff `968eaf42117b97f7811882331da41ac03aa2801840128603fb75686115e6fa83`에 적용된다. 종료 문서와 인계가 포함된 최종 상태의 재검증·두 리뷰는 해당 PR과 최종 보고에 연결한다. |
| Developer follow-up | 이번 범위의 추가 결정 없음. 관리형 추천은 POL-23에 명시된 선행 조건을 따른다. |

## AI Review

### 1. 리뷰 요약

명시 제출과 재선택만 5개·30분의 기록을 갱신한다. 기존 URL·목록 조회, 키보드·포인터·터치, 인증 상태·같은 계정의 token 갱신 및 계정 경계의 수명을 소스와 실행 자료로 확인했다. 상태·이벤트 전환, 렌더링된 행의 유효성, 타이머 해제, 포커스 복귀와 시안 자산을 대조했다.

### 2. 발견된 문제

미해결 Blocker·Major·Minor 없음. 첫 lint 단계에서 찾은 초대 로그인 이벤트 참조 위치를 바로잡고 다시 확인했다. 기존 `DESIGN.md`의 검색 제안 상태 설명은 승인된 최근 검색어 및 추천 보류를 반영했다. 알림 설명에서 확인된 별도 드리프트는 아래에 남긴다.

### 3. 누락된 검증

신규 공유 개발 API·실계정/OAuth와 별도 보조기기 음성 테스트는 미실행이다. 로컬 Next mock·loopback 결과와 기존 QA-02의 실제 10통과·6차단은 별도다. 현재 변경은 Storybook 스토리, 설정과 공용 UI primitive에 영향이 없어 로컬 `pnpm build-storybook`을 생략했다.

### 4. 문서 갱신 필요 여부

DESIGN·architecture·plan, WBS와 DEV-47 기록, BKEY 실행 이력과 합성 화면, POL-24 인계를 갱신했다. 인증의 저장·전송·공급원 계약, 패키지·스크립트와 하네스 규칙은 동일하다. 기준선·coverage와 QA의 기존 상태를 대조했다.

### 5. 개발자 확인 필요

DEV-47의 승인 범위에는 별도 결정이 없다. 관리형 추천은 소유자·승인 목록·갱신 기준·표시 및 개인정보 계약의 확인이 남아 있다. [후속 Gate](../tasks/POL-23.md#pol-23-contract)

### 6. 추천 수정 방향

DEV-47 diff에서 필요한 추가 수정 없음. QA-02의 남은 통합 사례는 기존 QA의 재개 조건을 따른다. [QA-02](../../../qa/bid-list.md#qa-02-20261102)

## Context Audit Report

### 결론

WARN. `/bids`의 과거 DESIGN 문구를 현행 승인 상태에 맞췄다. 받은 알림의 기존 안내 문구 차이 한 곳이 남아 있다.

### 확인한 코드베이스 사실

Next `16.2.9`, React `19.2.4`, pnpm `11.3.0`, Vitest `4.1.11`, Node pin `22.20.0`. 새 의존성 없이 `useSyncExternalStore`와 기존 SearchInput을 조합했다. 원래 공개 목록의 조회를 쓰고 기록은 앱 루트 메모리만 사용한다.

### 문서별 정합성 점검

| 문서 | 근거와 판정 |
| --- | --- |
| `base.md` | `package.json`, lockfile, `.nvmrc`, 두 Workflow의 실행 목록과 일치. |
| `architecture.md` | `features/bids` 이력 모듈과 루트 인증·목록 조합을 추가 반영했다. |
| `data-access.md` | 일곱 공급원, 공개 client/server, snapshot·운영 guard, HTTP·mock 격리와 업로드 경계 유지. |
| `plan.md` | POL-23 당시 관찰과 이번 로컬 실행을 연결했다. WBS가 상태를 소유한다. |
| `harness.md` | 기존 스킬·verifier 정의와 설정 placeholder를 확인했다. |
| `ai-failures.md` | 사례를 확인했고 원격·시안 도구 출력은 필요한 노드·합성 자료로 제한했다. 작업 중 발견한 수정은 DEV-47 체크포인트에 남겼다. |

### 발견된 불일치

- Minor · `DESIGN.md`의 `/bids` 상태에 입력 중 검색 제안이 있었다. 현행 D2의 공급원 보류와 D3의 화면 예외에 따라 승인된 최근 목록의 노출 상태로 교정했다. 이 Task의 문서 갱신 범위에서 수정 가능했다.
- Minor · `DESIGN.md` 후반 공급원 설명에 받은 알림 삭제가 준비 중이라는 문구가 있다. 소유 화면과 같은 문서의 AlarmList 절은 편집·삭제를 이미 설명한다. 기존 DEV-66 감사에서도 기록된 별도 사항이다. [기존 관찰](DEV-66.md#발견된-불일치)

### 개발자 확인 필요 사항

DEV-47 범위에서 없음.

### 추천 수정 방향

공개 검색의 UI·수명은 최신 DEV-47 문서를 사용한다. 받은 알림의 현재 동작은 DEV-43과 소유 코드를 참조한다.

# POL-23 · 문서 검증과 Review Gate

[사용자 결정](../tasks/POL-23.md#pol-23-brief) · [확정 정책](../tasks/POL-23.md#pol-23-contract) · [WBS](../README.md)

## 문서 검증 · 2026-11-23 KST

- 기준 `afe7e57327e4bf3a656c18e54d95ec61e572325e`. `git diff --check afe7e57`와 임시 Python 검사로 신규 로컬 링크·앵커, Markdown, 원본 79개·Task 114개·선행 연결 156개, WBS 상태·집계·다음 순서, 기준선과 기존 QA를 확인했다. 검증 단계의 Markdown 6개·신규 로컬 링크 37개를 통과했고, 리뷰·종료 기록을 포함한 diff를 재검사한다. [체크포인트](../tasks/POL-23.md#pol-23-verification)
- 정책·Markdown만 변경한다. 로컬 `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm build-storybook`와 앱 브라우저, mock·HTTP 대역, 실제 업무 API는 미실행이다. 개발 OpenAPI 조회는 게시 명세의 확인이다. [BKEY 8건](../../../qa/bid-list.md#pol-23-search-term-qa)은 미실행이며 기존 QA-02 실제 10통과·6차단을 계승한다.

## Context Audit Report

### 결론

**WARN**. 시작 WBS의 숫자 요약 1곳을 표에서 다시 계산했다. 이번 정책의 기록과 현행 검색 소스를 대조한 결과 범위 안의 Major 불일치는 없다.

### 확인한 코드베이스 사실

- `package.json`에 Next 16.2.9, React 19.2.4, Vitest 4.1.11, pnpm 11.3.0과 8개 script가 있다. lockfile 9.0, `.nvmrc`와 CI의 Node 22.20.0 pin, 검증 쉘 Node 26.5.0·pnpm 11.3.0·Python 3.14.6을 확인했다.
- App Router의 공개 3개 보기는 `BidListSearch`와 `query`→공개 bids Repository→`keyword` 흐름을 사용한다. 최근 검색어와 추천 기능의 현재 소비 경로는 없다. [현재 소스와 시안](../tasks/POL-23.md#pol-23-sources)

### 문서별 정합성 점검

| 문서 | 관찰 |
| --- | --- |
| `base.md` | 패키지·도구 고정 버전과 실제 script, standalone `type-check`와 `format` script 부재를 확인했다. |
| `architecture.md` | App Router·UI 입력·URL·공개 목록/서버 진입점, 폰트와 전역 토큰의 경로가 소스와 일치한다. |
| `data-access.md` | 7개 공급원, 공개 bids·auth의 경계, 불변 설정 snapshot·운영 mock 가드와 계정별 mock 저장 경계를 확인했다. 사용자 최근 검색어의 앱 메모리는 기존 가변 mock의 `sessionStorage`와 수명이 다르다. |
| `plan.md` | 원본 L04의 정책 미정은 당시 관찰로 남기고 이번 결정과 QA 계획을 연결했다. 실제 상태는 WBS에서 읽는다. |
| `harness.md` | 세 Skill, read-only `verifier.toml`, `.codex/config.toml`의 placeholder를 확인했다. |
| `ai-failures.md` | 기존 목록 검색·URL 경쟁 사례를 검토했다. 이번 작업에서 새로 기록할 반복 실패 근거는 없다. |

### 발견된 불일치

- **Minor · 기존 WBS 집계.** 시작 요약은 완료54·대기31이고 표는 완료55·대기30이었다. DEV-66 완료 반영 직후의 기존 요약과 표가 어긋났다. 이번 상태 표 갱신 때 행을 재집계했다. 다른 작업의 상태에는 변화가 없다.
- **Minor · 기존 알림 요약.** `data-access.md` §3의 알림 행은 수동 삭제가 생략돼 있고 같은 문서 §6·§8에서 이를 다룬다. L04와 관련된 변경은 없다. [기존 감사 기록](POL-22.md#pol-22-context-audit)

### 개발자 확인 필요 사항

관리형 추천을 다시 검토할 때 콘텐츠 소유자, 승인된 목록·갱신 기준 및 표시·개인정보 경계를 확보한다. 최근 검색어 정책의 사용자 결정 D1~D3는 수신했다.

### 추천 수정 방향

DEV-47에서는 합성 자료와 시계로 계정 경계·탭 수명·만료를 검증하고, 승인된 빈 상태·삭제 제어와 현재 검색 URL에서의 선택 적용을 함께 확인한다.

## 독립 read-only verifier

| 항목 | 리뷰 단계 결과 |
| --- | --- |
| Result | **PASS** |
| Summary | 사용자 D1~D3, 시안 상태·명시 예외, 최근 검색어와 관리형 추천의 별도 재개 기준, 다음 Task 인계를 대조했다. |
| Issues | Blocker·Major 없음. Minor 1건은 BKEY-03의 ‘명시 재선택만’이 직접 재제출의 보존 갱신을 누락한다는 점이다. 정책과 QA에 맞춰 명시 재제출·재선택을 모두 반영했다. |
| Verification | `git diff --check afe7e57`와 문서 검사 Markdown 6개·신규 링크 40개·원본 79개·Task 114개·의존성 156개·279개 검사를 재현했다. 제품 검증과 실제 업무 API는 미실행이다. |
| Documentation Update Check | 정책, WBS, 공통 계획, DEV-47 인계 및 BKEY 미실행 계획을 연결했다. 기준선·기존 실서버 QA·다른 작업의 상태를 보존했다. |
| Review freshness | 첫 PASS는 `afe7e57` 대비 리뷰 단계의 diff에 적용한다. QA 교정 및 종료·인계 기록을 포함한 최종 diff는 두 리뷰를 재실행하고 실제 PR·최종 보고에서 결과를 확인한다. |
| Developer follow-up | DEV-47은 로그아웃 시작 시 계정 표시가 남는 상황에서도 이전 기록이 즉시 가려지고 복원되지 않는지 검증한다. 관리형 추천 자료는 별도 Gate의 입력이다. |

## ai-review

### 1. 리뷰 요약

사용자 D1~D3를 검색의 현행 URL·Repository 흐름과 비교했다. 지원하는 최근 검색어, 관리형 추천 검토 조건, 승인된 화면 예외가 QA 및 DEV-47의 완료 기준으로 이어진다. 변경 범위는 Markdown 6개다.

### 2. 발견된 문제

미해결 Blocker·Major 없음. BKEY-03의 갱신 예시를 교정했고 BKEY-04는 로그아웃 실패 뒤까지 기존 기록의 미복원을 확인하도록 명확히 했다. 앱 타입·UI·Repository·공급원 설정·비밀값 변경은 없다. 착수 기준의 기존 WBS 요약은 행에서 다시 계산했다.

### 3. 누락된 검증

문서 검증을 통과했다. 로컬 앱 test/lint/build·Storybook·브라우저·mock/HTTP 대역과 실제 업무 API는 이번 산출물에서 미실행이다. 다른 공개 보기의 Figma는 메타데이터만 확인했고 BKEY 8건의 실행은 DEV-47 범위다. 기존 실제 QA-02의 10통과·6차단을 보존한다.

### 4. 문서 갱신 필요 여부

Task·WBS, L04의 후속 인계·QA, 공통 계획과 검토 기록을 갱신했다. 원본 79개와 연결표·선행 156개는 범위가 같아 보존한다. base·architecture·data-access·harness·ai-failures는 이번 문서 변경의 영향 범위 밖이다.

### 5. 개발자 확인 필요

이번 정책과 화면 예외의 승인 근거를 확보했다. 관리형 추천의 소유자·승인 목록·갱신/표시 기준은 향후 검토할 때 확보한다. DEV-47은 그 자체의 구현·검증 범위를 확정한다.

### 6. 추천 수정 방향

DEV-47의 첫 요구사항 Gate에서 공개 3개 보기의 검색 제출과 탭/계정 경계를 기준으로 QA를 계획한다. 정책 문서·화면 근거·제품 검증·실제 통합의 결과를 각 근거에 연결한다.

# DEV-54 · 상세 페이지 본문 랜드마크 검토

2026-11-24 KST · 기준 `dfd5969` · `fix/dev-54-bid-main-landmark`

[Brief](../tasks/DEV-54.md#dev-54-brief) · [검증 로그 요약](../tasks/DEV-54.md#dev-54-verification) · [브라우저 QA](../../../qa/bid-detail.md#dev-54-local-qa)

## 검토 대상과 증거

- `src/components/bids/bid-detail-content.tsx`와 `src/app/bids/error.tsx`에서 래퍼 시작·종료 태그만 바꿨다. `src/app/layout.tsx`가 유일한 본문 랜드마크를 제공한다. 원본 C04와 기존 QA 이력을 대조한다.
- Node 22.20.0, pnpm 11.3.0에서 `pnpm test` 43파일·1,258건, `pnpm lint`, `pnpm build`가 통과했다. 실제 Next와 Chrome에서 합성 공고로 정상·404·오류, 화면 크기별 배치, 접근성 트리·키보드를 확인했다.
- 작업·QA·리뷰·WBS·컨텍스트 문서의 새 로컬 링크·앵커, 79개 원본 ID, 114개 기록과 156개 선행 관계, WBS 상태·Markdown, 원본 보존과 `git diff --check`를 검증했다.

## 독립 verifier

| 항목 | 결과 |
| --- | --- |
| Result | PASS |
| Summary | 상세 정상과 공용 오류에서 DOM·접근성 트리 main이 각 2개에서 1개로 줄었고 두 TSX의 래퍼 태그만 바뀌었다. |
| Issues | Blocker·Major·Minor 없음. |
| Verification | `pnpm test` 43파일·1,258건, lint, 빌드 로그 및 검토본과 격리 소스의 일치를 확인했다. Chrome의 404·독립 첨부 오류·대조 경로와 로컬 재시도, 1920·390·320px 배치·키보드, 문서와 diff 검사를 대조했다. 실제 백엔드·OS 스크린리더·Storybook은 로컬 검증 범위 밖이다. |
| Documentation Update Check | 본문 소유, 작업·QA·plan의 연결과 QA-03의 실제 1통과·8차단, 원본 기준선·연결표 보존을 확인했다. |
| Review freshness | 첫 리뷰는 `dfd5969` 기준 제품 diff와 당시 문서에 해당한다. 종료·인계 기록이 추가된 문서도 전달 전 다시 검토하고, 최종 대상은 PR에 남긴다. |
| Developer follow-up | 추가 구현 결정 없음. |

## ai-review

### 1. 리뷰 요약

PASS. 정상 상세와 공용 오류의 중첩 원인이 되는 래퍼를 교정했다. RootLayout의 기존 본문 아래에서 페이지 제목과 버튼이 같은 순서로 노출되고, 두 오류 화면의 재시도는 키보드로 실행됐다.

### 2. 발견된 문제

Blocker·Major·Minor 없음. 두 TSX의 클래스·속성·데이터 진입점과 동작을 diff로 대조했다. 변경에 비밀값·개인정보·패키지 변경은 없다.

### 3. 누락된 검증

실서버 통합·OS 스크린리더 미실행. 키보드와 보조기술 인터페이스는 격리 Chrome의 조작 및 접근성 트리로 확인했다. 두 변경 컴포넌트의 Storybook 소비 경로가 없어 로컬 Storybook 빌드를 건너뛰었다. 기존 QA-03 실통합 판정은 그대로 적용한다.

### 4. 문서 갱신 필요 여부

작업·QA·WBS·Review Gate와 architecture의 본문 규칙 및 plan을 갱신했다. 패키지·스크립트·저장소·하네스 계약을 그대로 사용하므로 base, data-access, harness, ai-failures 및 C04 원본 연결표의 추가 변경은 불필요하다.

### 5. 개발자 확인 필요

제품 동작이나 승인에 관한 추가 결정은 없다. 이번 Git 전달의 Chromatic 월간 한도 예외는 2026-11-24의 사용자가 승인했다.

### 6. 추천 수정 방향

이 diff의 필수 후속 수정은 없다. 종료·인계 문서의 새 링크와 상태를 재검증·재검토한 뒤 정상 PR 절차로 전달한다.

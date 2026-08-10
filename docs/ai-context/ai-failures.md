# Mate AI Failure Log

Use this file to record recurring AI workflow failures and prevention rules. Do not record secrets, credentials, private customer data, or `.env` values.

## Current Known Failures

## 2026-08-10 - 정적 검증만으로 PR 준비 상태 판단

- Task: Figma 기반 홈, mock 인증, 입찰공고 목록 변경의 commit/PR 준비 상태 검토.
- Expected behavior: 사용자 흐름, 보안 경계, 표시 문구와 데이터 필드의 의미까지 확인한 뒤 PR 준비 여부를 판단한다.
- Actual failure: lint, build, Storybook build는 통과했지만 mock 인증의 외부 경로 이동 가능성, 홈 카드의 가공된 필드, 비어 있는 기본 개찰 결과, `입찰개시일`과 다른 날짜 필드 사용이 후속 리뷰에서 발견됐다.
- Root cause: 정적 검사 결과를 사용자 동작과 도메인 데이터 의미 검증으로 확대 해석했다.
- Detection command or review step: 악성 `next` 값을 사용한 브라우저 흐름, 기본 query 조합 확인, 카드 원본 데이터 대조, 필터 라벨과 모델 필드 대조.
- Fix: 내부 경로 검증 함수를 추가하고, 홈 카드를 실제 mock 필드로 구성했으며, 기본 결과 fixture와 `bidStartedAt` 기간 필터를 보완했다.
- Prevention rule: PR 전 Review Gate에서 보안 입력, 기본 URL 상태, 사용자 노출 라벨과 실제 데이터 필드, fixture별 결과 차이를 별도 시나리오로 검증한다.
- Related files: `src/lib/auth-redirect.ts`, `src/app/auth/page.tsx`, `src/app/page.tsx`, `src/components/bids/bid-list-model.ts`, `src/mocks/bids.ts`.

## Failure Entry Template

```md
## YYYY-MM-DD - Short title

- Task:
- Expected behavior:
- Actual failure:
- Root cause:
- Detection command or review step:
- Fix:
- Prevention rule:
- Related files:
```

## Failure Categories To Track

- Requirement drift: implementation does not match the structured requirement or success criteria.
- Scope creep: unrelated refactor, formatting, package, or source changes are included.
- Verification gap: agent reports success without running available `package.json` scripts.
- Existing worktree damage: agent reverts or overwrites unrelated developer changes.
- Styling mismatch: UI ignores established tokens, typography, or component patterns.
- Type or build risk: code looks plausible but fails strict TypeScript or Next build validation.
- Security issue: secret, token, password, personal data, or `.env` value is requested, read, or printed.

## Prevention Rules

- Start feature work with `$feature-workflow`.
- Run `$ai-review` before PR or commit.
- Use verifier for independent PASS or FAIL when the change affects user-facing behavior or shared components.
- Use only actual scripts from `package.json`; currently `pnpm lint` and `pnpm build` are the primary app verification commands, and `pnpm build-storybook` is required for Storybook or shared UI catalog changes.
- If automatic fixes fail 3 times, stop and ask for developer analysis instead of continuing speculative edits.

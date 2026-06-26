# Mate AI Failure Log

Use this file to record recurring AI workflow failures and prevention rules. Do not record secrets, credentials, private customer data, or `.env` values.

## Current Known Failures

No historical AI implementation failures have been confirmed in this repository as of 2026-06-25.

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

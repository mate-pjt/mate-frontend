---
name: ai-review
description: Mate frontend pre-PR and pre-commit review workflow. Use when reviewing current changes against the original requirement, success criteria, git diff, related code, verification results, scope boundaries, style consistency, type risk, security risk, and accidental secret exposure before a developer final review.
---

# AI Review

Use this skill before PR creation, commit, or developer final code review.

## Inputs To Reconstruct

Review from primary evidence, not from the implementer's summary alone:

- Original requirement and success criteria
- `git status --short`
- `git diff --stat`
- `git diff`
- Related source files needed to understand behavior
- Verification commands and results
- `package.json` scripts

Do not read `.env`, `.env.local`, `.env.*`, private keys, token files, password files, or credential dumps.

## Review Checks

Check:

- Requirement match: implementation satisfies the stated success criteria.
- Scope control: changes stay within the requested task.
- Existing worktree safety: unrelated developer changes are not reverted, reformatted, or overwritten.
- Structure fit: files follow established Mate folders and local patterns.
- Styling fit: UI changes use existing Tailwind utilities, CSS variables, and design-token conventions where applicable.
- Type risk: strict TypeScript, imports, route conventions, and Next build behavior are unlikely to fail.
- Runtime risk: user-facing flows, edge cases, loading/empty/error states, and accessibility are considered when relevant.
- Security risk: no secret, token, password, personal data, or `.env` value is introduced or printed.
- Verification integrity: only actual `package.json` scripts are claimed; missing test/type-check scripts are not invented.
- Documentation update: package manager or scripts changes match `base.md`; folder/API/mock/component rule changes match `architecture.md`; status changes are reflected in `plan.md`; AI failures are recorded in `ai-failures.md`; harness workflow changes match `harness.md`.
- Context audit escalation: recommend `$context-audit` when code/document consistency is suspicious, or when structure, scripts, package manager, Codex skills, agents, or harness configuration changed. Do not require it for every small change.

## Output Format

Write the review in Korean unless the developer asks for another language. Use this order:

1. 리뷰 요약
2. 발견된 문제
3. 누락된 검증
4. 문서 갱신 필요 여부
5. 개발자 확인 필요
6. 추천 수정 방향

Always include all six sections, even when there are no issues. Do not replace the review with only a Blocker/Major summary.

For issues, include severity:

- `Blocker`: must fix before PR or commit.
- `Major`: likely bug, requirement miss, risky behavior, or important verification gap.
- `Minor`: small correctness, maintainability, or clarity issue.

If there are no issues, say that clearly and still list any residual risk or unavailable verification.

Do not fail a change for personal style preference alone. Prefer concrete behavior, maintainability, security, or verification concerns.

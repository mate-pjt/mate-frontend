---
name: feature-workflow
description: Mate frontend feature implementation workflow. Use when implementing, changing, or fixing a feature in this repository so Codex gates ambiguous requirements, structures the brief, designs the change, implements narrowly, verifies with package.json scripts, retries fixes up to 3 times, and reports PASS before moving on.
---

# Feature Workflow

Use this skill for one Mate frontend requirement at a time.

Write user-facing briefs, status updates, review summaries, and final reports in Korean unless the developer asks for another language.

## 1. Load Context

Read these files before designing a change:

- `AGENTS.md`
- `docs/ai-context/base.md`
- `docs/ai-context/plan.md`
- `docs/ai-context/architecture.md`
- `docs/ai-context/harness.md` when checking the end-to-end harness sequence
- `docs/ai-context/ai-failures.md` when the task resembles a past failure

Inspect `package.json` directly before verification so script choices reflect the current repo.

Never read `.env`, `.env.local`, `.env.*`, private keys, tokens, password files, or credential dumps.

## 2. Structure Requirements

This step is a gate. Do not move to design or implementation until the requirement is clear enough to produce an Implementation Brief.

Before editing, write:

- Requirement summary
- Success criteria
- In scope
- Out of scope
- Reference files
- Existing files, folders, and patterns checked
- Verification method
- Open questions

Gate criteria:

- Requirement summary is clear.
- Success criteria are verifiable.
- In scope and out of scope are separated.
- Related files, folders, and existing patterns have been checked.
- Verification method is defined with actual `package.json` scripts where possible.
- No blocking ambiguity remains.

Blocking ambiguity means a missing decision could change product behavior, data shape, UX, security posture, public API, file ownership, or verification strategy. If blocking ambiguity exists, stop before design and ask at most 3 questions. Each question must include a recommended answer.

Non-blocking ambiguity means the choice is low-risk, reversible, and consistent with existing Mate patterns. State the default assumption and proceed.

After the developer answers blocking questions, complete the Implementation Brief and only then move to design.

Implementation Brief must include:

- Requirement summary
- Success criteria
- In scope
- Out of scope
- Files and patterns checked
- Assumptions
- Verification method

## 3. Design The Change

Before editing, present:

- Files to modify
- Impact area
- Implementation steps
- Risks
- Verification method

Use only actual `package.json` scripts for verification. As of 2026-06-26, the confirmed scripts are `dev`, `build`, `start`, `lint`, `storybook`, and `build-storybook`; the primary app verification commands are `pnpm lint` and `pnpm build`. For Storybook or shared UI catalog changes, also run `pnpm build-storybook`.

Do not invent `test`, `type-check`, or `format` commands unless they exist in the current `package.json`.

## 4. Implement Narrowly

Follow these rules:

- Preserve existing folder structure and local code style.
- Prefer existing utilities, tokens, components, and route patterns.
- Do not add libraries unless the developer explicitly approves the dependency.
- Do not alter unrelated files or pre-existing worktree changes.
- Do not combine feature work with broad refactors, formatting churn, or package changes.
- Use minimal comments only where they clarify non-obvious logic.

## 5. Verify

Run the planned verification commands that exist in `package.json`.

Default sequence:

```bash
pnpm lint
pnpm build
```

For Storybook configuration, component stories, or shared UI catalog changes, also run:

```bash
pnpm build-storybook
```

Use `pnpm dev` only for local browser verification. Use `pnpm start` only after a successful build when production serving is relevant.

Record each command result in the final report.

## 6. Fix And Reverify

If verification fails:

1. Read the actual error.
2. Identify the smallest in-scope fix.
3. Apply the fix.
4. Re-run the failed command.
5. Re-run the full planned verification set when practical.

Attempt automatic fixes at most 3 times. After the third failed attempt, stop and ask the developer for root-cause review with the command, error, attempted fixes, and suspected blocker.

## 7. Documentation Update Check

Before completing the task, check whether the change requires updates to:

- `docs/ai-context/base.md`: package manager, scripts, runtime, execution, or verification commands changed.
- `docs/ai-context/architecture.md`: folders, routing, APIs, mock data policy, component rules, or app patterns changed.
- `docs/ai-context/plan.md`: implementation status, Completed, In Progress, or Next items changed.
- `docs/ai-context/ai-failures.md`: an AI mistake repeated, caused rework, or exposed a prevention rule.
- `docs/ai-context/harness.md`: harness usage, sequence, or role responsibilities changed.

If a needed update is a simple factual sync from files already inspected, update the relevant document. If it requires policy, architecture direction, or team agreement, do not guess; ask the developer with a recommended answer.

Do not force documentation edits when nothing material changed. Task completion requires this check even when the result is "no document update needed."

## 8. Review Gate

Before final PASS, decide whether verifier and `$ai-review` are required.

Run verifier and `$ai-review` when the change includes any of:

- Shared components or reusable UI primitives.
- User-facing UI, UX, routing, data flow, API, or mock data behavior.
- Package, build, lint, Codex harness, auth, security, or env-related changes.
- Multiple files or cross-cutting behavior.
- Figma, design, external spec, or ambiguous product interpretation.
- Failed verification followed by fixes.
- Documentation update uncertainty.

When verifier is required by this gate, Codex may run the read-only verifier subagent without asking the developer for separate confirmation. The verifier must follow `.codex/agents/verifier.toml`, produce a verification report only, and not modify code unless the developer explicitly asks it to fix something.

This automatic permission is limited to the verifier role. It does not grant automatic permission for general subagent delegation, parallel implementation work, or code-modifying worker agents.

If verifier and `$ai-review` are not required, do not silently skip them. Ask the developer to confirm skipping, with a recommended answer.

Final PASS requires either:

- verifier and `$ai-review` completed with no unresolved Blocker or Major issue, or
- developer confirmed skipping them.

If code or documentation changes after verifier or `$ai-review` has inspected the diff, rerun the affected review before PASS. If the follow-up change is clearly trivial and rerunning is not practical, state why the previous review is still valid in the final report.

When `$ai-review` is required, include its review result using the `$ai-review` output format. Do not collapse it to only "no Blocker/Major." If summarizing, explicitly cover each required section in Korean:

- 리뷰 요약
- 발견된 문제
- 누락된 검증
- 문서 갱신 필요 여부
- 개발자 확인 필요
- 추천 수정 방향

## 9. Complete

Return `PASS` only when the requirement is satisfied, verification has passed, Documentation Update Check is complete, and Review Gate is complete. Explain any skipped verification or review.

Final response must include:

- PASS, FAIL, or blocked status
- Changed files
- Verification commands and results
- Documentation Update Check
- Review Gate result
- `$ai-review` result when required
- Whether verifier or `$ai-review` was rerun after any post-review code or documentation change, or why rerun was not needed
- Assumptions or TODOs
- Any handoff notes for developer final review

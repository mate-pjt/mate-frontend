# Mate AI Feature Workflow Plan

This is the v0.1 AI harness workflow for feature work in Mate.

## Required Flow

1. Structure requirements.
2. Design the change.
3. Implement the smallest scoped change.
4. Verify with available commands.
5. If verification fails, fix and verify again.
6. Repeat automatic fixes at most 3 times.
7. Check whether `docs/ai-context` documents need updates.
8. Run Review Gate to decide whether verifier and `$ai-review` are required.
9. Return PASS only after verification succeeds, documentation update need is checked, Review Gate is complete, and any explicitly documented exception is accepted by the developer.
10. Run final developer-facing code review before PR or commit.

## Status

### Completed

- AI harness v0.1 baseline is accepted as the Mate team baseline for AI-assisted feature work.
- 2026-06-25: Ran a Figma-driven shared UI task (`SelectBox` / `SelectMenu`) through `$feature-workflow` -> verifier -> `$ai-review`; `pnpm lint` and `pnpm build` passed.
- 2026-06-26: Clarified that Review Gate may run the read-only verifier subagent without separate user confirmation when verifier is required.
- 2026-06-26: Treated the successful Figma shared UI task as the initial proof that the v0.1 workflow is usable, while keeping iterative refinement open.
- 2026-06-26: Implemented another Figma-driven shared UI task (`BidCard`) through `$feature-workflow`; `pnpm lint`, `pnpm build`, and `pnpm build-storybook` passed.
- 2026-06-26: Implemented Figma-driven reusable filter popover and popup component sets through `$feature-workflow`; `pnpm lint`, `pnpm build`, and `pnpm build-storybook` passed.
- 2026-07-14: Implemented the Figma-driven home page with local Figma illustration assets, existing `BidCard`/button primitives, and an approved frontend-only mock auth redirect contract for the future recommended bids view; static verification passed.
- 2026-07-15: Implemented the Figma-driven `/bids` list with four URL-backed views, reusable controlled filter popovers, mock search/filter/pagination, result-specific table columns, empty state, and the approved recommended-view auth redirect; static verification passed.
- 2026-08-10: Completed PR-readiness fixes for the home/auth/bid-list flow: representative home cards, non-empty default result fixtures, `bidStartedAt` period semantics, URL preset normalization, Escape dismissal, and same-origin mock auth return-path validation. `pnpm lint`, `pnpm build`, `pnpm build-storybook`, and desktop/mobile browser flow checks passed.
- 2026-08-11: Implemented the Figma-driven `/alarms` page with alternating list surfaces independent of read state, per-item read handling, edit/select/delete flows, empty state, 3-second deletion toast, and shared danger button/large circle-checkbox variants. Static, Storybook, and desktop/mobile browser verification passed.
- 2026-08-12: Extracted the alarm deletion toast into a reusable Sonner-backed `ToastViewport` / `showToast` UI primitive with single-toast replacement, configurable duration, built-in enter/exit motion, reduced-motion support, and Storybook coverage.

### In Progress

- No active harness workflow item.

### Next

- TODO: Continue using `$feature-workflow` for the next scoped feature and refine the harness only when a concrete gap appears.

## Status Update Rules

- After feature work completes, update Completed, In Progress, and Next only when the state is clear from the task and repository evidence.
- If the state is uncertain or depends on product/team priority, do not guess; ask the developer with a recommended update.

## Requirement Structuring

Before implementation, write:

- Requirement summary
- Success criteria
- In scope
- Out of scope
- Reference files
- Open questions

Ask at most 3 questions. Each question must include a recommended answer so the developer can approve quickly.

If a safe assumption is possible, state it as an assumption and continue. If the assumption could change product behavior, ask first.

## Design Before Code

Before editing files, present:

- Files to modify
- Expected impact area
- Implementation steps
- Risks
- Verification method

Keep the design scoped to one requirement. Do not combine unrelated refactors, formatting, package changes, or documentation updates with runtime implementation.

## Implementation Rules

- Preserve the existing `src/` structure.
- Prefer existing app patterns and local utilities.
- Do not add a new library unless the developer explicitly approves it.
- Do not touch unrelated files or pre-existing branch changes.
- Do not read or record `.env` values or secrets.
- Keep comments sparse and useful.

## Verification Commands

Use only commands backed by actual `package.json` scripts.

Primary verification commands:

```bash
pnpm lint
pnpm build
```

For Storybook configuration, component stories, or shared UI catalog changes, also run:

```bash
pnpm build-storybook
```

Use `pnpm dev` only when interactive/browser verification is needed. Use `pnpm start` only after a successful build when serving the production app is relevant.

Do not invent `pnpm test`, `pnpm type-check`, or `pnpm format`; those scripts do not exist as of 2026-06-25.

## Failure Loop

For failed verification:

1. Capture the failing command and key error.
2. Identify the likely cause from actual code and logs.
3. Apply the smallest fix within the original scope.
4. Re-run the failed command, then the full planned verification set when practical.

Stop automatic fixes after 3 failed attempts. At that point, report:

- What failed
- What was tried
- Why the agent is not confident continuing
- What developer decision or context is needed

## Completion Report

Final reports should include:

- Requirement status: PASS or blocked
- Changed files
- Verification commands and results
- Known TODOs or assumptions
- Any review findings that still require developer judgment

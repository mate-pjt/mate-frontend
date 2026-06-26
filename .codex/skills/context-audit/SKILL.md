---
name: context-audit
description: Mate frontend context audit workflow. Use when checking whether the current codebase, package scripts, src structure, Codex harness files, and docs/ai-context documents are mutually consistent, especially before or after large work, before PR or commit when context drift is suspected, after structure/scripts/harness changes, or when agents appear to rely on stale project context.
---

# Context Audit

Use this skill to audit whether Mate's current codebase state matches the AI context documents.

Default to read-only diagnosis. Do not edit files, project source, docs, or harness files unless the developer explicitly asks for a follow-up fix. If documentation updates are needed, propose them in the report first.

## Safety Rules

- Do not read `.env`, `.env.local`, `.env.*`, private keys, token files, password files, credential dumps, or production secrets.
- Do not print or record secret, token, password, personal data, or actual `.env` values.
- Do not modify `src/` or any project source code during an audit.
- Separate confirmed factual mismatches from policy, ownership, priority, or roadmap questions that need developer confirmation.
- Mark uncertain items as `TODO` or `developer confirmation required`; do not guess team policy.

## Evidence To Check

Read only the files and directory listings needed for the audit:

- `package.json`, lockfiles, package manager metadata, and actual package scripts.
- `docs/ai-context/base.md`.
- `src/` folder and file structure relevant to documented app, component, API, mock, type, asset, and lib patterns.
- `docs/ai-context/architecture.md`.
- Implementation and workflow status evidence from the current repo, git status, and `docs/ai-context/plan.md`.
- `.codex/skills`, `.codex/agents`, `.codex/config.toml`, and `docs/ai-context/harness.md`.
- Repeated AI mistakes, verification failures, rework evidence from recent task context or git diff, and `docs/ai-context/ai-failures.md`.

Prefer `rg --files`, `find`, `git status --short --branch`, and direct reads of small Markdown/TOML/JSON files. Do not inspect unrelated implementation internals unless needed to verify a documented claim.

## Audit Checklist

### base.md

- Compare package name, framework/runtime dependency versions, dev dependency facts, lockfile presence, `packageManager`, and scripts with `package.json` and lockfiles.
- Confirm documented missing scripts are still missing.
- Report script or package manager drift as a factual mismatch.

### architecture.md

- Compare documented `src/` structure with actual route, component, UI primitive, lib, mock, type, font, and icon files.
- Check whether documented app patterns, component grouping, API/mock/component rules, and token notes still match visible code structure.
- Treat future folder policy or ownership questions as developer confirmation required.

### plan.md

- Compare stated Completed, In Progress, and Next items with repository evidence and the current task history available in context.
- Do not infer team priority from code alone.
- Mark stale status, missing completed harness changes, or ambiguous roadmap items separately.

### harness.md

- Compare documented harness flow with actual `.codex/skills`, `.codex/agents`, and `.codex/config.toml`.
- Confirm referenced Skills and agents exist.
- Report missing, renamed, or undocumented harness entry points.

### ai-failures.md

- Check whether repeated AI mistakes, verification failures, repeated rework, or prevention-rule-worthy incidents are visible from the current task context or recent diff.
- Do not invent failure history. If evidence is insufficient, say so.
- Recommend entries only when there is concrete evidence of a recurring or high-risk failure pattern.

## Output Format

Write the report in Korean unless the developer asks otherwise.

```md
# Context Audit Report

## 결론
PASS / WARN / FAIL

## 확인한 코드베이스 사실

## 문서별 정합성 점검

### base.md

### architecture.md

### plan.md

### harness.md

### ai-failures.md

## 발견된 불일치

- 심각도: Major | Minor
- 관련 문서:
- 실제 코드베이스 상태:
- 문서의 현재 설명:
- 추천 조치:
- 자동 수정 가능 여부: Yes | No, developer confirmation required

## 개발자 확인 필요 사항

## 추천 수정 방향
```

## Severity Guide

- `Major`: A documented fact is wrong enough to mislead implementation, verification, security handling, package usage, folder placement, or harness execution.
- `Minor`: A stale, incomplete, or unclear document detail exists but is unlikely to cause immediate implementation or verification failure.

Use `PASS` when no mismatch is found, `WARN` when only Minor issues or developer-confirmation items exist, and `FAIL` when one or more Major factual mismatches are found.

# Mate Base AI Context

Last updated: 2026-08-12

이 문서는 Mate 프론트엔드에서 AI 에이전트가 작업 전 공통으로 확인할 최소 컨텍스트다. secret, token, password, 개인정보, `.env` 실제 값은 읽거나 기록하지 않는다.

## Confirmed From Files

- Repository root: `/Users/jisung/mate-frontend`
- `package.json` name: `mate-frontend`
- Private package: `true`
- Framework/runtime dependencies:
  - `next`: `16.2.9`
  - `react`: `19.2.4`
  - `react-dom`: `19.2.4`
  - `sonner`: `^2.0.8`
- Development dependencies:
  - TypeScript `^5`
  - ESLint `^9`
  - `eslint-config-next` `16.2.9`
  - Tailwind CSS `^4`
  - `@tailwindcss/postcss` `^4`
  - Storybook `^10.4.6`
  - `@storybook/nextjs-vite` `^10.4.6`
  - `@storybook/addon-docs` `^10.4.6`
  - `eslint-plugin-storybook` `^10.4.6`
  - Vite `^8.1.0`
- Lockfile: `pnpm-lock.yaml` exists with lockfile version `9.0`.
- `package.json` defines `packageManager` as `pnpm@11.3.0`.
- Node.js version: `.nvmrc` pins local development to `22.20.0`, matching the verified local Node.js version and satisfying Next.js `>=20.9.0`.
- `tsconfig.json` has `strict: true`, `noEmit: true`, `jsx: react-jsx`, and path alias `@/*` to `./src/*`.
- `next.config.ts` currently has no custom Next.js config.
- `eslint.config.mjs` uses Next core web vitals, TypeScript configs, and Storybook's flat recommended config.
- `postcss.config.mjs` uses `@tailwindcss/postcss`.
- `.gitignore` ignores `.env*`, `.next/`, `node_modules`, `coverage`, `out`, `build`, `storybook-static/`, Storybook logs, and `*.tsbuildinfo`.

## Package Scripts

Only use scripts that actually exist in `package.json`.

| Script | Command | AI usage |
| --- | --- | --- |
| `dev` | `next dev` | Local development server when needed |
| `build` | `next build` | Production build and framework validation |
| `start` | `next start` | Serve a built app when needed |
| `lint` | `eslint` | Static lint verification |
| `storybook` | `storybook dev -p 6006` | Local Storybook UI component catalog |
| `build-storybook` | `storybook build` | Static Storybook build verification |

Confirmed missing scripts:

- No `test` script.
- No standalone `type-check` script.
- No `format` script.

Test runner policy: no test runner is planned for v0.1. Use `pnpm lint` and `pnpm build` as primary verification until product logic or interaction complexity justifies adding a dedicated test runner.

## Package Manager

Confirmed: `pnpm-lock.yaml` exists.

Confirmed: `package.json` declares `packageManager: pnpm@11.3.0`.

Confirmed: `pnpm-workspace.yaml` exists and configures pnpm build dependency handling for `esbuild`, `sharp`, and `unrs-resolver`.

Use `pnpm` for script examples unless the developer asks otherwise.

## GitHub Actions

Confirmed: `.github/workflows/chromatic.yml` publishes Storybook to Chromatic on `push`.

The workflow uses:

- Node.js `22.20.0`
- `pnpm/action-setup@v4` with pnpm `11.3.0`
- `pnpm install --frozen-lockfile`
- `chromaui/action@latest`
- GitHub Actions secret name `CHROMATIC_PROJECT_TOKEN`

Do not record the actual Chromatic project token in repository files or chat.

## Codex App Project Config

`.codex/config.toml` intentionally remains a placeholder in v0.1. Do not add active Skill registration, agent registration, hooks, or workflow enforcement settings until the current Codex App project config schema is confirmed.

## Current Worktree Caution

Before editing, run `git status --short --branch`.

Treat pre-existing modified, deleted, or untracked files as developer or branch work. Do not revert, reformat, rename, or otherwise modify them unless the current task explicitly targets them.

## Security Rules

- Never read `.env`, `.env.local`, `.env.*`, private key files, token files, or production credential files.
- Do not print secrets or ask the developer to paste them into chat.
- If a task needs environment behavior, document variable names only, not values.
- `NEXT_PUBLIC_SITE_URL` is referenced by the app, but its actual environment value must not be read or recorded.

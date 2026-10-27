# Mate Base AI Context

Last updated: 2026-09-30

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
  - Vitest `4.1.11` (사용자 승인, Node 환경의 Repository 테스트)
- Lockfile: `pnpm-lock.yaml` exists with lockfile version `9.0`.
- `package.json` defines `packageManager` as `pnpm@11.3.0`.
- Node.js version: `.nvmrc` pins local development to `22.20.0`, matching the verified local Node.js version and satisfying Next.js `>=20.9.0`.
- `tsconfig.json` has `strict: true`, `noEmit: true`, `jsx: react-jsx`, and path alias `@/*` to `./src/*`.
- `next.config.ts` allows `local.mate-bid.com` to load Next.js development resources through `allowedDevOrigins`; production origins are unchanged.
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
| `test` | `vitest run` | Repository 계약·저장소·인증·구조 회귀 검증 |
| `test:watch` | `vitest` | 데이터 계층 테스트 watch |
| `storybook` | `storybook dev -p 6006` | Local Storybook UI component catalog |
| `build-storybook` | `storybook build` | Static Storybook build verification |

Confirmed missing scripts:

- No standalone `type-check` script.
- No `format` script.

기본 검증은 Node 22.20.0에서 `pnpm test`, `pnpm lint`, `pnpm build`, `git diff --check`다. Storybook 설정·공용 모델에 영향이 있으면 `pnpm build-storybook`도 실행한다. `vitest.config.ts`는 Node 환경과 `@/*` 별칭을 설정하며 jsdom·MSW는 사용하지 않는다. HTTP fetch 대역 테스트와 실제 서버 통합 검증은 구분한다.

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

추가 workflow `.github/workflows/data-access.yml`은 테스트·lint와 `api`/`mock`/`hybrid` Preview 구성 빌드를 수행한다. 기존 Chromatic workflow는 유지한다. CI를 추가했다고 원격 실행 결과를 로컬 PASS로 간주하지 않는다.

## 데이터 공급원 실행 설정

- `MATE_DATA_PROFILE=api|mock|hybrid`: 기본 `api`.
- `MATE_DATA_OVERRIDES`: hybrid의 7개 그룹별 `api|mock` JSON 객체.
- `MATE_MOCK_SCENARIOS`: mock 그룹별 명시적 시나리오 JSON 객체.
- `MATE_APP_ENV=local|preview|production`: Vercel 외 환경 판정. `VERCEL_ENV`가 있으면 우선한다.
- 개발 실행의 미지정 환경은 local, 배포 실행의 미지정 환경은 production이다. 운영에서는 mock 빌드와 실행을 거부한다.
- `NEXT_PUBLIC_MATE_API_BASE_URL`은 기존 API 주소 설정이다. 인증·서명 정보를 포함하지 않는 공개 주소만 허용한다.
- `next.config.ts`에서 `NEXT_PUBLIC_MATE_DATA_CONFIG`로 **한 번 확정한 snapshot**을 서버·브라우저에 주입한다. 이 값은 직접 관리하는 환경변수가 아니다. 실행 중 공급원을 다시 선택하지 않는다.
- `next dev`는 설정 변경 후 재시작, build/start 및 Preview는 재빌드한다. 실행 환경이 운영인데 snapshot에 mock이 있으면 instrumentation이 서버 프로세스를 종료한다.
- 실행 예제·가상 계정·초대·인증번호·초기화는 `docs/development/repositories.md`, 상세 정책은 `data-access.md`를 확인한다.

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

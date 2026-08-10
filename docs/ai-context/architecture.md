# Mate Architecture Notes

Last updated: 2026-08-10

This document summarizes the project shape observed from files. It is not a full architecture spec.

## Confirmed Structure

```text
DESIGN.md
src/
  app/
    alarms/page.tsx
    auth/
      mock-auth-form.tsx
      page.tsx
    bids/page.tsx
    bids/[bidId]/page.tsx
    favicon.ico
    globals.css
    layout.tsx
    my/page.tsx
    page.tsx
    qna/page.tsx
  assets/
    fonts/PretendardVariable.woff2
  components/
    bids/
      bid-filter-toolbar.tsx
      bid-list-client.tsx
      bid-list-empty.tsx
      bid-list-model.ts
      bid-list-search.tsx
      bid-list-table.tsx
      bid-view-selector.tsx
    home/
      home-auth-cta.tsx
    icons/
      README.md
    site-header.tsx
    ui/
      button/
        button.stories.tsx
      card/
        card.stories.tsx
      checkbox/
        checkbox.stories.tsx
      chip/
        chip.stories.tsx
      filter-popover/
        filter-popover.stories.tsx
      input/
        input.stories.tsx
      pagination/
        pagination.stories.tsx
      popup/
        popup.stories.tsx
      side-menu/
        side-menu.stories.tsx
      select/
        select.stories.tsx
      tab-menu/
        tab-menu.stories.tsx
      toggle/
        toggle.stories.tsx
  features/
    .gitkeep
  lib/
    auth-redirect.ts
    metadata.ts
    mock-auth.ts
    site.ts
  mocks/
    bids.ts
    qna.ts
  types/
    bid.ts
public/
  images/
    bids/no-result.svg
    home/
      alarm-illustration.svg
      cta-crystal.png
      hero-illustration.svg
      matching-illustration.svg
  icon/
    mate-brand.svg
    24dp/
      alarm.svg
      check_circle.svg
      close_circle.svg
      mate.svg
      ...
.storybook/
  main.ts
  preview.css
  preview.tsx
```

## Confirmed App Patterns

- Next.js App Router is used under `src/app`.
- Root layout imports `SiteHeader`, local Pretendard font, site config, and `globals.css`.
- `DESIGN.md` codifies the existing visual tokens, shared component patterns, layout rules, and accepted design debt.
- HTML language is set to `ko`.
- Global body classes use Tailwind utilities and CSS custom properties: `bg-background`, `text-foreground`, `antialiased`.
- `src/lib/site.ts` centralizes site name, URL fallback, and Korean description.
- `src/app/globals.css` is the canonical source for design tokens. It defines CSS variables, Tailwind `@theme inline`, base styles, and type utility classes.
- Reusable source icons are React TSX components under `src/components/icons`; raw UI SVG source files are not retained in `src/assets/icons`.
- Storybook uses `@storybook/nextjs-vite` and imports `src/app/globals.css` plus `.storybook/preview.css` for the Pretendard CSS variable.

## Source Area Notes

- `src/app`: route pages and global app shell.
- `src/components`: shared UI and layout components.
- `src/components/icons`: reusable TSX icon components exported from `index.ts`. These replace source-level SVG imports and avoid bundler-specific SVG loaders.
- `src/components/ui`: reusable UI primitives. Component families are grouped into folders such as `button/`, `card/`, `checkbox/`, `chip/`, `filter-popover/`, `input/`, `pagination/`, `popup/`, `side-menu/`, `select/`, `tab-menu/`, and `toggle/`; each folder exposes its public imports through `index.ts`.
- `src/lib`: site metadata helpers.
- `src/mocks`: mock data for current UI flows.
- `src/types`: shared TypeScript types.
- `src/features`: currently only `.gitkeep`; feature-level organization may be planned but is not yet established.
- `src/components/home`: home-only interactive leaf components. `HomeAuthCta` keeps mock auth branching out of the server-rendered home page.
- `src/components/bids`: 입찰공고 목록 전용 client orchestration, URL state model, filter/search controls, table, empty state를 분리한다. `/bids`의 공고 보기·검색·필터·페이지·표시 개수는 query string을 단일 공유 상태로 사용한다.
- `src/components/bids/bid-list-model.ts`는 URL의 기간·금액 preset을 허용 목록으로 정규화하고, 기간 조건은 mock `Bid.bidStartedAt`을 기준으로 계산한다.
- `src/assets`: local font assets. UI icons should not be imported from raw SVG files.
- `public`: static browser-served assets. Static 24dp SVG icons live under `public/icon/24dp`.
- `.storybook`: Storybook Vite configuration for the local UI component catalog.

## Asset Placement Notes

Confirmed:

- Static assets that can be referenced by URL should live under `public`.
- Page-specific illustration assets exported from Figma live under `public/images/<page>`; the home page uses SVG where the export is truly vector-based and keeps PNG only for raster artwork.
- Reusable UI icons that need source imports or `className`/`currentColor` styling should live as TSX components under `src/components/icons`.
- Raw UI SVG files exported from design tools are not retained in the repo when a TSX icon component exists; the design source is expected to remain in Figma.
- `src/components/icons/README.md` documents the reusable icon placement policy.
- `SiteHeader` and fixed-color input icons reference static icons from `public/icon/24dp`.
- Static 24dp SVG filenames should not use a trailing underscore; obvious filename typos should be normalized before use.

## Styling Notes

Confirmed:

- Tailwind CSS v4 is configured through `@tailwindcss/postcss`.
- `globals.css` owns core CSS variables, Tailwind theme token mappings, and type utility classes.
- Color tokens use grayscale plus primary blue scales.
- Letter spacing token is `0`.

Inference:

- Prefer existing CSS variables, Tailwind utility classes, and token names from `src/app/globals.css` before adding new styling patterns.
- Do not recreate a separate TypeScript token mirror unless a concrete runtime or build-time consumer needs it. If TypeScript token access becomes necessary, prefer generating CSS and TS tokens from one source instead of hand-maintaining duplicate values.

## Verification Constraints

Available project scripts are `dev`, `build`, `start`, `lint`, `storybook`, and `build-storybook`. For normal app implementation verification, use `pnpm lint` and `pnpm build`. For Storybook or shared UI catalog changes, also use `pnpm build-storybook`.

No test runner is planned for v0.1. No standalone type-check script exists today.

## Temporary Auth And Home Route Contract

Confirmed:

- Until backend authentication is connected, `src/lib/mock-auth.ts` stores a development-only authentication flag in `localStorage`.
- `src/lib/auth-redirect.ts`는 mock 인증의 `next` 값을 같은 출처의 절대 경로로 제한하고, 이중 슬래시·역슬래시·제어 문자가 포함된 값을 기본 맞춤 공고 경로로 대체한다.
- The home CTA sends unauthenticated users to `/auth?mode=login&next=%2Fbids%3Fview%3Drecommended`.
- Submitting the current mock auth form stores the flag and returns to the validated local `next` path.
- Authenticated home CTA users go to `/bids?view=recommended`.
- `/bids?view=recommended`는 `recommended` mock 공고만 표시하며, 인증되지 않은 직접 접근은 현재 URL을 `next`로 보존해 mock 로그인 화면으로 이동한다.
- `/bids`의 보기 query는 `all`(생략), `closing`, `result`, `recommended`를 지원한다. 검색·필터·페이지 상태도 URL query로 보존한다.
- This mock flag is not authorization and must be replaced with the backend session adapter when authentication is integrated.

## TODO

- TODO: Confirm intended feature folder conventions before creating files under `src/features`.
- TODO: Confirm whether mock data is temporary MVP scaffolding or the expected local development data layer.
- TODO: Confirm the final deployment host and production `NEXT_PUBLIC_SITE_URL` policy without reading actual environment values.

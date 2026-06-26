# Mate Architecture Notes

Last updated: 2026-06-26

This document summarizes the project shape observed from files. It is not a full architecture spec.

## Confirmed Structure

```text
src/
  app/
    alarms/page.tsx
    auth/page.tsx
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
    icons/
      README.md
    site-header.tsx
    ui/
      button/
        button.stories.tsx
      side-menu/
        side-menu.stories.tsx
      select/
        select.stories.tsx
      tab-menu/
        tab-menu.stories.tsx
  features/
    .gitkeep
  lib/
    metadata.ts
    site.ts
  mocks/
    bids.ts
    qna.ts
  types/
    bid.ts
public/
  icon/
    24dp/
      alarm.svg
      mate.svg
.storybook/
  main.ts
  preview.css
  preview.tsx
```

## Confirmed App Patterns

- Next.js App Router is used under `src/app`.
- Root layout imports `SiteHeader`, local Pretendard font, site config, and `globals.css`.
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
- `src/components/ui`: reusable UI primitives. Component families are grouped into folders such as `button/`, `side-menu/`, `select/`, and `tab-menu/`; each folder exposes its public imports through `index.ts`.
- `src/lib`: site metadata helpers.
- `src/mocks`: mock data for current UI flows.
- `src/types`: shared TypeScript types.
- `src/features`: currently only `.gitkeep`; feature-level organization may be planned but is not yet established.
- `src/assets`: local font assets. UI icons should not be imported from raw SVG files.
- `public`: static browser-served assets. Current static header icons live under `public/icon/24dp`.
- `.storybook`: Storybook Vite configuration for the local UI component catalog.

## Asset Placement Notes

Confirmed:

- Static assets that can be referenced by URL should live under `public`.
- Reusable UI icons that need source imports or `className`/`currentColor` styling should live as TSX components under `src/components/icons`.
- Raw UI SVG files exported from design tools are not retained in the repo when a TSX icon component exists; the design source is expected to remain in Figma.
- `src/components/icons/README.md` documents the reusable icon placement policy.
- `SiteHeader` currently references static icons from `public/icon/24dp`.

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

## TODO

- TODO: Confirm intended feature folder conventions before creating files under `src/features`.
- TODO: Confirm whether mock data is temporary MVP scaffolding or the expected local development data layer.
- TODO: Confirm the final deployment host and production `NEXT_PUBLIC_SITE_URL` policy without reading actual environment values.

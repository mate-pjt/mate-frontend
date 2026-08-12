# Mate Architecture Notes

Last updated: 2026-08-12

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
    alarms/
      alarm-empty.tsx
      alarm-list-item.tsx
      alarm-page-client.tsx
    qna/
      qna-accordion.tsx
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
      toast/
        index.ts
        toast.stories.tsx
        toast.tsx
  data/
    bids/
      contracts.ts
      mock-reader.ts
      server.ts
    qna/
      contracts.ts
      mock-reader.ts
      server.ts
  features/
    .gitkeep
  lib/
    auth-redirect.ts
    metadata.ts
    mock-auth.ts
    site.ts
  mocks/
    alarms.ts
    bids.ts
    qna.ts
  types/
    alarm.ts
    bid.ts
    qna.ts
public/
  images/
    alarms/no-result.png
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
- `src/components/ui/toast`: Sonner를 Mate 디자인으로 감싼 전역 성공 toast primitive다. 루트 `ToastViewport`는 하나만 마운트하고, 화면에서는 `showToast(message, { duration? })`만 호출한다. 새 호출은 기존 toast를 교체하며 기본 표시 시간은 3초다.
- `src/data`: 프론트 화면과 데이터 공급원을 분리하는 가벼운 조회 데이터 계층이다. 도메인별 `contracts.ts`, 현재 mock 구현인 `mock-reader.ts`, `server-only`로 보호한 Server Page 진입점 `server.ts`를 둔다. 자세한 규칙은 `docs/ai-context/data-access.md`를 따른다.
- `src/lib`: site metadata helpers.
- `src/mocks`: 현재 UI 흐름을 위한 mock fixture다. 입찰과 Q&A fixture는 각 도메인의 `mock-reader.ts`에서만 import한다.
- `src/types`: 데이터 계층과 화면이 공유하는 프론트 내부 TypeScript 모델이다.
- `src/features`: currently only `.gitkeep`; feature-level organization may be planned but is not yet established.
- `src/components/home`: home-only interactive leaf components. `HomeAuthCta` keeps mock auth branching out of the server-rendered home page.
- `src/components/alarms`: `/alarms` 전용 목록 항목, 빈 상태, client 상태 orchestration을 분리한다. 현재 알림의 읽음·선택·삭제 상태는 페이지 메모리에서만 유지되며 새로고침 시 mock 초기값으로 돌아간다. 삭제 완료 피드백은 공용 `showToast`에 위임한다.
- `src/components/qna`: `/qna` 전용 네이티브 `details`/`summary` 아코디언을 제공한다. 각 질문은 독립적으로 여러 개를 펼칠 수 있고, 서버에서 받은 구조화된 답변의 강조·밑줄·목록을 렌더링한다.
- `/alarms` 목록의 회색·흰색 표면은 현재 표시 순번에 따라 교차하고, 읽음 상태와는 독립적이다. 미확인 항목만 우측 파란 점을 표시하며 편집 중에는 읽음 점을 숨긴다.
- `src/components/bids`: 입찰공고 목록 전용 client orchestration, URL state model, filter/search controls, table, empty state를 분리한다. `/bids`의 공고 보기·검색·필터·페이지·표시 개수는 query string을 단일 공유 상태로 사용하며, 조회된 페이지 결과와 필터 선택지를 props로 받는다.
- `src/components/bids/bid-list-model.ts`는 URL의 기간·금액 preset을 허용 목록으로 정규화한다. Mock 배열 검색·필터·pagination과 표시형 날짜 파싱은 `src/data/bids/mock-reader.ts`가 담당한다.
- 홈·입찰 목록·입찰 상세는 `src/data/bids/server.ts`를 통해 조회하며 Page와 Component에서 `src/mocks/bids.ts`를 직접 import하지 않는다.
- Q&A는 `src/data/qna/server.ts`를 통해 조회한다. 현재 내부 `QnaItem`은 Figma 답변의 문단·강조·밑줄·목록을 직렬화 가능한 구조로 표현하며, 실제 API의 rich text 형식·pagination·카테고리·관리자 CRUD는 명세가 올 때 별도로 설계한다.
- `src/assets`: local font assets. UI icons should not be imported from raw SVG files.
- `public`: static browser-served assets. Static 24dp SVG icons live under `public/icon/24dp`.
- `.storybook`: Storybook Vite configuration for the local UI component catalog.

## Asset Placement Notes

Confirmed:

- Static assets that can be referenced by URL should live under `public`.
- Page-specific illustration assets exported from Figma live under `public/images/<page>`; the home page uses SVG where the export is truly vector-based and keeps PNG only for raster artwork.
- `/alarms`의 빈 상태 PNG는 Figma 원본 export를 `public/images/alarms/no-result.png`에 보관한다.
- Reusable UI icons that need source imports or `className`/`currentColor` styling should live as TSX components under `src/components/icons`.
- Raw UI SVG files exported from design tools are not retained in the repo when a TSX icon component exists; the design source is expected to remain in Figma.
- `src/components/icons/README.md` documents the reusable icon placement policy.
- `SiteHeader` and fixed-color input icons reference static icons from `public/icon/24dp`.
- Static 24dp SVG filenames should not use a trailing underscore; obvious filename typos should be normalized before use.

## Styling Notes

Confirmed:

- Tailwind CSS v4 is configured through `@tailwindcss/postcss`.
- `globals.css` owns core CSS variables, Tailwind theme token mappings, and type utility classes.
- Color tokens use grayscale plus primary blue scales, semantic status colors, and danger action emphasis/surface tokens.
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

## Data Access Contract

Confirmed:

- 조회 계약은 프론트 화면이 필요로 하는 입력과 결과이며 실제 API DTO를 추측하지 않는다.
- Mock fixture 직접 import는 해당 도메인의 `mock-reader.ts`로 제한한다.
- 실제 API 연결 시 `api-types.ts`, 필요한 경우 `api-mapper.ts`, `http-reader.ts`를 추가하고 `server.ts` 진입점은 유지한다.
- 날짜 형식, nullable, enum, 금액 단위, pagination은 실제 명세를 확인한 뒤 데이터 경계에서 변환한다.
- 생성·수정·삭제 DTO와 optimistic update/rollback 정책은 API 명세와 제품 동작이 확정된 뒤 Writer 또는 Mutation 계층으로 설계한다.
- 목록과 상세의 필드·endpoint가 달라지면 하나의 `Bid`를 비대하게 만들지 않고 `BidListItem`과 `BidDetail` 분리를 검토한다.

See `docs/ai-context/data-access.md` for the implementation and future API integration checklist.

## TODO

- TODO: Confirm intended feature folder conventions before creating files under `src/features`.
- TODO: Confirm the final deployment host and production `NEXT_PUBLIC_SITE_URL` policy without reading actual environment values.

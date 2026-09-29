# Mate Architecture Notes

Last updated: 2026-09-29

This document summarizes the project shape observed from files. It is not a full architecture spec.

## Confirmed Structure

```text
DESIGN.md
src/
  app/
    alarms/page.tsx
    auth/
      page.tsx
      callback/
      signup/
      legal/[document]/
      start/
      company/
        search/
        invitations/
        register/
    bids/page.tsx
    bids/[bidId]/page.tsx
    favicon.ico
    globals.css
    layout.tsx
    my/page.tsx
    my/settings/notifications/page.tsx
    page.tsx
    qna/page.tsx
  assets/
    fonts/PretendardVariable.woff2
  components/
    auth/
      auth-screen.tsx
      auth-gate.tsx
      company-registration.tsx
    alarms/
      alarm-empty.tsx
      alarm-list-item.tsx
      alarm-page-client.tsx
      notification-bell.tsx
    qna/
      qna-accordion.tsx
    bids/
      bid-detail-actions.tsx
      bid-detail-alert-card.tsx
      bid-detail-amounts.tsx
      bid-detail-content.tsx
      bid-filter-toolbar.tsx
      bid-list-client.tsx
      bid-list-empty.tsx
      bid-list-model.ts
      bid-list-search.tsx
      bid-list-table.tsx
      bid-view-selector.tsx
    home/
      home-auth-cta.tsx
    my/
      my-settings-home-client.tsx
      notification-settings-page-client.tsx
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
      api-mapper.ts
      api-types.ts
      contracts.ts
      http-reader.ts
      detail-api-types.ts
      detail-api-mapper.ts
      detail-http-reader.ts
      mock-reader.ts
      server.ts
    qna/
      contracts.ts
      mock-reader.ts
      server.ts
  features/
    auth/
      api.ts
      onboarding-api.ts
      session.tsx
      types.ts
    bid-notice-alerts/
      api.ts
    notifications/
      api.ts
    notification-settings/
      api.ts
  lib/
    auth-redirect.ts
    metadata.ts
    bid-detail-url.ts
    site.ts
  mocks/
    alarms.ts
    bids.ts
    qna.ts
  types/
    alarm.ts
    bid.ts
    bid-list.ts
    bid-detail.ts
    qna.ts
public/
  images/
    alarms/no-result.png
    auth/
      google-logo.png
      company-number.png
      ...
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
- `src/data`: 프론트 화면과 데이터 공급원을 분리하는 가벼운 조회 데이터 계층이다. 입찰 공개 목록과 홈 카드는 `api-types.ts`·`api-mapper.ts`·`http-reader.ts`, 공개 상세는 `detail-api-types.ts`·`detail-api-mapper.ts`·`detail-http-reader.ts`를 거쳐 실제 API를 조회한다. `server.ts`는 `server-only` Server Page 진입점이다. 자세한 규칙은 `docs/ai-context/data-access.md`를 따른다.
- `src/lib`: site metadata helpers와 OAuth/로그인 복귀 경로 검증 함수.
- `src/mocks`: 현재 UI 흐름을 위한 mock fixture다. 입찰과 Q&A fixture는 각 도메인의 `mock-reader.ts`에서만 import한다.
- `src/types`: 데이터 계층과 화면이 공유하는 프론트 내부 TypeScript 모델이다.
- `src/features/auth`: 브라우저 Google OAuth/session completion, 메모리 access token·refresh cookie session, 회사 온보딩 API·DTO를 묶는다. 가입·회사 변경 호출은 사용자 동작과 쿠키/토큰이 필요한 Client Component에서 실행한다. 증명서 처리의 새로고침 복원에는 계정별 문서/버전 UUID만 `sessionStorage`에 보관한다.
- `src/features/bid-notice-alerts`: 공고별 계정 알림의 `GET|PUT|DELETE` 브라우저 API 경계다. `src/components/bids/bid-detail-alert-card.tsx`가 `AuthSessionProvider`의 Bearer token을 이용해 읽고, 팝업에서 변경을 확정한 뒤 서버 응답으로만 카드 상태를 갱신한다. 받은 알림 목록과는 별개의 기능이다.
- `src/features/bid-notice-filters`: 계정별 개인 필터의 GET/PUT/reset 브라우저 API, 응답 검증, 버전·전체 필드 URL 왕복 모델이다. `/bids`의 `ALL` 목록에서만 수동 적용하며, 팝업 저장은 현재 목록 URL만 바꾼다. 계정 저장 버튼은 `expectedVersion`을 보내고 409 때 최신값을 다시 읽는다.
- `src/features/notifications`: 받은 알림의 목록·미확인 건수·읽음 처리를 위한 DTO 검증과 화면 모델 변환을 담당한다. Bearer token이 필요한 브라우저 API는 기존 인증 경계를 사용한다.
- `src/features/notification-settings`: 계정의 알림 수신 이메일 GET/PATCH·대체 주소 인증 시작/재전송/확인과 맞춤 공고 이메일 ON/OFF의 브라우저 API 및 응답 검증을 담당한다.
- `src/components/home`: home-only interactive leaf components. `HomeAuthCta`는 브라우저 세션 상태에 따른 추천 공고 이동을 서버 렌더링 홈에서 분리한다.
- `src/components/alarms`: `/alarms` 전용 목록 항목, 빈 상태, client 상태 orchestration과 헤더 알림 점을 분리한다. 로그인 후 목록은 실제 API를 20건씩 조회하며 읽음 성공 응답만 화면에 반영한다. 로그아웃 상태에는 로그인 복귀 안내를 표시한다. 사용자별 알림 삭제 API가 없어 편집·삭제 버튼은 비활성이고, Figma에서 가려진 7일 후 삭제 안내는 표시하지 않는다.
- `src/components/my`: `/my`의 Figma 9.0.0 설정·관리 첫 화면에서 인증 상태, 알림 설정 이동, 로그아웃을 담당한다. 아직 연결할 화면이 없는 회사·계정·안내·의견 항목은 준비 중으로 비활성 표시한다. `/my/settings/notifications`에서는 설정 조회·변경 상태, 이메일 수신처 선택·인증 대화상자를 담당하고, 주소 전환과 맞춤 이메일 설정은 서버 응답 이후에만 화면 값을 갱신한다.
- `src/components/qna`: `/qna` 전용 네이티브 `details`/`summary` 아코디언을 제공한다. 각 질문은 독립적으로 여러 개를 펼칠 수 있고, 서버에서 받은 구조화된 답변의 강조·밑줄·목록을 렌더링한다.
- `/alarms` 목록의 회색·흰색 표면은 현재 표시 순번에 따라 교차하고, 읽음 상태와는 독립적이다. 미확인 항목만 우측 파란 점을 표시한다. 헤더 알림 점은 별도 미확인 건수 API가 0보다 클 때 표시한다.
- `src/components/bids`: 입찰공고 목록 전용 client orchestration, URL state model, filter/search controls, table, empty state를 분리한다. `/bids`의 공고 보기·검색·필터·페이지·표시 개수는 query string을 단일 공유 상태로 사용하며, 조회된 페이지 결과와 필터 선택지를 props로 받는다.
- `src/components/bids/bid-list-model.ts`는 URL의 기간·금액 preset을 허용 목록으로 정규화한다. 공개 목록의 검색·필터·pagination은 백엔드가 처리한다. 기존 mock 배열 검색·표시형 날짜 파싱은 사용되지 않는 fixture 조회용으로 `src/data/bids/mock-reader.ts`에만 남아 있다.
- 홈·입찰 목록·입찰 상세는 `src/data/bids/server.ts`를 통해 조회하며 Page와 Component에서 `src/mocks/bids.ts`를 직접 import하지 않는다. 공개 목록의 nullable 금액·낙찰 결과는 `BidListItem`, 상세 전용 값은 `BidDetail`로 분리하여 API 값 그대로 표시한다.
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

## Auth And Home Route Contract

Confirmed:

- `src/lib/auth-redirect.ts`는 OAuth `returnTo`와 로그인 `next` 값을 같은 출처의 절대 경로로 제한하고, 이중 슬래시·역슬래시·제어 문자가 포함된 값을 기본 맞춤 공고 경로로 대체한다.
- The home CTA sends unauthenticated users to `/auth?mode=login&next=%2Fbids%3Fview%3Drecommended`.
- Google 로그인은 현재 브라우저의 `window.location.origin`을 `returnOrigin`으로, 내부 복귀 경로를 `returnTo`로 전달하며 백엔드 `/api/v1/auth/oauth/google/authorizations`로 전체 페이지 이동한다. 백엔드가 귀환 URL에 넣은 `flowId`를 기존 계정의 `/auth/callback` session completion, 신규 계정의 `/auth/signup` 현재 거래 조회·가입 완료 요청에 전달한다. `flowId`가 없는 귀환 화면은 인증 요청을 보내지 않고 재로그인을 안내한다.
- `AuthSessionProvider`는 access token을 메모리에만 보관하고, 백엔드 refresh cookie로 새로고침 후 세션을 복원한다. 브라우저 요청은 `credentials: include`를 사용하며 보호 API는 Bearer token을 보낸다.
- API 기본 주소는 테스트 서버이고 `NEXT_PUBLIC_MATE_API_BASE_URL`로 변경할 수 있다. 실제 credentialed 브라우저 호출에는 API가 해당 프론트 Origin과 cookie/CORS를 허용해야 한다.
- 테스트 서버의 공통 응답 성공 플래그는 `isSuccess`로 판정한다. Swagger의 `success` 표기와의 불일치는 백엔드 확인 사항이다.
- Authenticated home CTA users go to `/bids?view=recommended`.
- `/bids?view=recommended`는 인증되지 않은 직접 접근을 현재 URL을 `next`로 보존해 로그인 화면으로 보내고, 로그인 후에는 준비 중 안내를 표시한다. 맞춤공고 mock 목록은 노출하지 않는다.
- `/bids`의 보기 query는 `all`(생략), `closing`, `result`, `recommended`를 지원한다. 검색·필터·페이지 상태도 URL query로 보존한다.
- 공개 목록 `all`·`closing`·`result`는 서버에서 `GET /api/v1/bid-notices`를 `view=ALL|CLOSING_SOON|RESULT`로 호출하고, 지역·업종 선택지는 공개 metadata API에서 받는다. 목록의 공고번호·공고명은 실제 ID와 선택적 분류번호를 보존해 `/bids/[bidId]`로 이동한다. 결과 목록의 낙찰금액 필터는 API 계약 전까지 준비 중으로 비활성이다.
- 공개 입찰 상세는 `GET /api/v1/bid-notices/{id}`를 서버에서 조회하고 첨부·관련 공고·개찰 결과·물품 등록정보를 독립 section API로 조회한다. 본문 404/오류와 section별 오류를 구분하며 mock fallback을 사용하지 않는다. 계정별 공고 알림 설정은 로그인 상태에서 별도 브라우저 API를 사용한다.
- 가입 화면의 서비스 이용약관·개인정보처리방침은 개발/테스트용 임시 본문이며, 사용자 결정에 따라 해당 동의로 테스트 가입 제출을 허용한다. 정식 본문·버전 도입과 이전 동의 처리 정책은 TODO다.
- 회사 등록의 시공능력평가액·대표면허·3종 인증 직접 수정은 가입 전 API가 없어 준비 중 비활성이다.
- 모든 실제 브라우저 API 통합 검증은 `docs/qa/README.md`와 기능별 펀치리스트에 기록하고 환경 준비 후 수행한다.

## Data Access Contract

Confirmed:

- 조회 계약은 프론트 화면이 필요로 하는 입력과 결과이며 실제 API DTO를 추측하지 않는다.
- Mock fixture 직접 import는 해당 도메인의 `mock-reader.ts`로 제한한다.
- 실제 API 연결 시 `api-types.ts`, 필요한 경우 `api-mapper.ts`, `http-reader.ts`를 추가하고 `server.ts` 진입점은 유지한다.
- 날짜 형식, nullable, enum, 금액 단위, pagination은 실제 명세를 확인한 뒤 데이터 경계에서 변환한다.
- 인증/온보딩 생성·변경 API는 Swagger와 백엔드 소스의 확인된 계약을 `src/features/auth`에 두며, 가입 화면이 사용하는 브라우저 호출이다. 다른 도메인의 Writer/Mutation 정책은 별도로 설계한다.
- 목록과 상세의 필드·endpoint가 달라 `BidListItem`과 `BidDetail`을 분리했다. 홈 카드는 `BidListItem`을 사용하며 기존 mock `Bid`는 fixture로만 유지한다.

See `docs/ai-context/data-access.md` for the implementation and future API integration checklist.

## TODO

- TODO: 향후 다른 계정별 기능도 실제 API·세션 경계를 확인한 뒤 `src/features` 배치를 기능별로 결정한다.
- TODO: Confirm the final deployment host and production `NEXT_PUBLIC_SITE_URL` policy without reading actual environment values.

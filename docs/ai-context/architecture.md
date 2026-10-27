# Mate Architecture Notes

Last updated: 2026-09-30

This document summarizes the project shape observed from files. It is not a full architecture spec.

## Confirmed Structure

```text
src/
  app/                 # 기존 App Router routes: 홈·입찰·인증·회사·알림·마이·Q&A
  assets/fonts/        # 로컬 Pretendard
  components/
    auth/ alarms/ bids/ home/ my/ qna/ icons/ ui/
    dev/mock-status.tsx
    site-header.tsx
  data/
    config.ts
    shared/            # HTTP requester, AuthAccess, ApiError
    mock/              # 탭 저장소, Clock·시나리오, 상태 검증
    auth/              # contracts, HTTP/mock Repository, client, session-controller
    bids/              # 목록·상세 contracts, HTTP/DTO/mapper, mock, server
    company/           # 조회·가입·문서 contracts, HTTP/mock, client
    notifications/     # 받은 알림·건수·읽음
    bid-alerts/        # 공고별 구독
    personal-filters/  # 계정 필터
    notification-settings/ # 수신처·인증·ON/OFF
    qna/               # contracts, content, static-repository, server
  features/
    auth/session.tsx   # 세션 Provider와 사용자 행동 조합
    bid-notice-filters/model.ts # URL 왕복과 필터 UI 조합
  lib/                 # 복귀 경로·상세 URL·사이트·metadata
  types/               # 프론트 표시 모델
  instrumentation.ts   # 운영 mock 실행 차단
public/
  images/ icon/        # 기존 화면 이미지·정적 아이콘
  mock/bid-attachment.txt # mock 첨부, 외부 요청 없음
.storybook/            # Vite와 동일 데이터 설정 snapshot
vitest.config.ts
tests/                 # Node 기반 계약·경계·회귀 테스트
.github/workflows/
  chromatic.yml        # 기존 유지
  data-access.yml      # 테스트·lint·구성별 빌드
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

- `src/app`은 route와 shell, `src/components`는 UI와 사용자 행동 조합을 담당한다. endpoint·DTO·HTTP/mock 구현은 직접 import하지 않는다.
- `src/data/<domain>/contracts.ts`는 화면용 입력·출력과 Repository 인터페이스다. 함수·객체 factory에 HTTP 클라이언트·세션 접근·mock runtime을 주입하며 BaseRepository·상속·IoC는 없다.
- `client.ts` 또는 `server.ts`만 구현을 선택한다. 7개 공급원 그룹과 혼합 제약은 `config.ts`가 검사한다. 실제 API 실패는 오류로 전파하고 fallback하지 않는다.
- `src/data/bids/server.ts`와 `src/data/qna/server.ts`는 `server-only`다. 홈·목록·상세는 같은 bids 공급원, Q&A는 API 없는 static 구현을 사용한다. 서버 공개 mock은 불변 합성 fixture이며 사용자별 가변 상태를 서버 전역에 두지 않는다.
- 백엔드 DTO와 enum은 HTTP Repository·mapper 안으로 제한한다. 목록 `BidListItem`과 상세 `BidDetail`, 가입 회사와 나의 회사 모델은 구분한다. 날짜·금액·nullable·페이지는 경계에서 변환한다.
- `src/features/auth/session.tsx`의 Provider는 순수 session-controller를 조합한다. API 인증은 메모리 token/refresh cookie, mock 인증은 탭의 합성 세션만 사용한다. `AuthAccess`에는 token·refresh·현재 계정 식별 함수가 있다. 동시 refresh와 계정 전환·로그아웃 중 늦은 응답을 방어한다.
- `/my/company`는 회사 Repository의 현재 overview를 조회한다. UI가 인증 응답의 회사 상태로 화면을 판단하지 않는다. API 회사 변경 뒤 세션 갱신은 HTTP 구현, mock 회사 상태 갱신은 mock 구현 책임이다. 변경 성공 뒤 세션 실패는 완료 화면과 경고를 유지한다.
- 등록 페이지의 `AccountScope`는 인증 계정 교체 시 화면 임시 상태를 초기화한다. 완료 결과는 AuthGate 밖에 두어 등록 성공 후 세션 만료에도 유지한다. 전체 mock 보호 요청은 가상 세션 만료를 검사하며, auth API와 업무 mock의 혼합에서는 실제 token/refresh를 추가로 요청하지 않는다.
- 문서 업로드는 화면에 문서/버전 ID와 opaque handle만 전달한다. 서명 URL·header·checksum·직접 PUT은 HTTP 내부에 있고, mock은 외부 전송·파일 원본 저장 없이 처리 상태를 변경한다. 복원 키는 공급원별로 격리한다.
- `src/data/mock/store.ts`는 schema·설정·API 환경·auth 공급원·계정별 sessionStorage 공간을 관리한다. 손상 공간만 초기화하고 사용 불가/용량 초과 시 메모리와 개발 표시로 전환한다. API 응답·실제 token·cookie·서명 URL을 복사하지 않는다.
- `src/components/dev/mock-status.tsx`는 mock이 있을 때 활성 그룹·현재 공간 초기화와 저장소 제한을 표시한다. 화면별 공급원 선택은 제공하지 않는다.
- `src/features/bid-notice-filters/model.ts`는 URL 상태·순수 필터 조합을 담당한다. 내부 enum은 personal-filters 계약이다. ALL 목록에서 수동 적용, 저장/초기화에 expectedVersion, 409에 최신값 재조회라는 기존 동작을 유지한다.
- `src/components/alarms`는 20건 페이지·읽음 성공 후 상태와 미확인 점을 조합한다. 회색/흰색 표면은 순번을 따르며 읽음과 독립적이다. 받은 알림 삭제·편집은 준비 중이다.
- `src/components/my`는 기존 메뉴·회사·수신 설정 UI를 유지한다. 수신처와 맞춤 이메일 ON/OFF는 하나의 공급원이고 각 요청의 성공/실패 처리는 독립적이다. 미구현 메뉴는 준비 중이다.
- `src/components/bids`는 URL을 검색·필터·페이지 상태로 사용하고 Repository 결과를 props로 받는다. 알림 카드는 계정별 bidAlerts 공급원을 사용한다. 맞춤공고 목록·기관 단독·결과 낙찰금액 필터 등 기존 준비 중 기능은 이번 전환으로 활성화하지 않는다.
- `src/components/qna`는 native details/summary로 구조화된 static 답변을 렌더링한다. API endpoint·관리자 CRUD는 추측하지 않는다.
- `src/components/icons`는 TSX 아이콘, `src/components/ui`는 폴더별 index 공개 primitive다. Sonner ToastViewport는 하나이며 화면은 showToast만 사용한다.
- `.storybook`은 Next와 같은 config resolver로 snapshot을 Vite define에 주입한다. `tests/architecture.test.ts`가 UI의 구현/DTO import 및 클라이언트에서 server-only로 이어지는 경로를 검사한다.

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

현재 scripts는 `dev`, `build`, `start`, `lint`, `test`, `test:watch`, `storybook`, `build-storybook`다. 기본 검증은 Node 22.20.0의 `pnpm test`, `pnpm lint`, `pnpm build`, `git diff --check`다. Storybook/공용 모델 영향 시 build-storybook도 실행한다.

Vitest의 HTTP fetch 대역은 실제 API 통합 증거가 아니다. async Server Component는 Next 실행과 실제 브라우저에서도 검증한다. 실제 서버 mutation은 승인된 계정과 변경·복구 범위가 필요하며 기존 QA 대기는 mock PASS로 바꾸지 않는다. 독립 type-check/format script는 없다.

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

도메인별 Repository·명시적 공급원 선택·HTTP DTO 경계·혼합 제약·mock 상태·업로드 규칙은 `docs/ai-context/data-access.md`를 따른다. UI는 공개 client/server 진입점과 프론트 contracts만 사용한다. 기존 feature api.ts, Reader, 미사용 src/mocks fixture는 전환 후 제거했다.

새 기능은 내부 계약 → mock으로 화면·오류 개발 → 확인된 DTO/HTTP → 계약 테스트 및 실제 통합 → 기능 그룹 api 전환 순서로 개발한다. 개발 실행 안내는 `docs/development/repositories.md`를 확인한다.

## TODO

- TODO: 실제 API 회사·메일·계정별 통합 검증의 승인·데이터 준비 항목은 기존 docs/qa 펀치리스트를 유지한다.
- TODO: Confirm the final deployment host and production `NEXT_PUBLIC_SITE_URL` policy without reading actual environment values.

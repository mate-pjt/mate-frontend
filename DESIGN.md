# Mate Design System

## 1. Atmosphere & Identity

Mate는 복잡한 입찰 탐색을 차분하고 친근하게 정리해 주는 서비스다. 넓은 여백, 선명한 파란색 행동 요소, 부드러운 회색 표면을 기본으로 하며, 서비스의 시그니처는 입찰 탐색 과정을 설명하는 밝은 일러스트와 명확한 정보 카드다.

## 2. Color

### Palette

색상 원본은 `src/app/globals.css`의 CSS 변수다.

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| Surface | `--basic-white` | `#ffffff` | 페이지, 카드 |
| Surface muted | `--grayscale-50`, `--grayscale-100` | `#fafbfc`, `#f1f3f5` | 카드 내부, 섹션 배경 |
| Text primary | `--grayscale-900`, `--grayscale-800` | `#212529`, `#343a40` | 제목, 본문 |
| Text secondary | `--grayscale-600`, `--grayscale-500` | `#868e96`, `#adb5bd` | 설명, 메타데이터 |
| Text hover | `--grayscale-dark-hover` | `#7c7f83` | 선택 메뉴 hover |
| Border | `--grayscale-200` | `#e9ecef` | 구분선, 외곽선 |
| Primary | `--primary-400` | `#3182f6` | CTA, 링크, 강조 |
| Primary states | `--primary-500`, `--primary-700` | `#2c75dd`, `#2562b9` | hover, active |
| Status | `--success`, `--warning`, `--danger` | semantic tokens | 상태 표시 |

새 색상은 `globals.css`에 의미가 분명한 토큰으로 먼저 추가한다. 컴포넌트에서 임의의 hex 값을 만들지 않는다.

## 3. Typography

- Font: 로컬 `PretendardVariable.woff2`, 시스템 sans-serif fallback
- Heading scale: `type-heading-0`부터 `type-heading-10`
- Body scale: `type-body-1`부터 `type-body-8`
- Caption scale: `type-caption-1`부터 `type-caption-7`
- 기본 line-height: `1.4`
- 본문은 14px 미만으로 사용하지 않는다.

## 4. Spacing & Layout

- Base unit: 4px
- 주요 콘텐츠 최대 너비: 1180px
- 기본 페이지 좌우 여백: 24px, 좁은 화면 16px
- 기본 breakpoint: Tailwind `sm`, `md`, `lg`, `xl`, `2xl`
- 공용 카드 grid는 380px 카드 3열과 20px gap을 데스크톱 기준으로 사용한다.
- Figma 고유 일러스트의 원본 비율은 유지하며, 좁은 화면에서는 컨테이너 폭에 맞춰 축소한다.

## 5. Components

### Button / ButtonLink

- Variants: primary, secondary, tertiary, gray, outline, text 계열
- Sizes: xs, sm, lg, xxl
- States: default, hover, active, disabled, keyboard focus
- Accessibility: 링크 이동은 `ButtonLink`, 동작은 `Button`을 사용한다.

### BidCard

- Structure: category/date, title, detail list, optional selected overlay
- Variants: fill, stroke, selected
- Category tones: primary, success, warning
- States: default, selected
- Accessibility: 의미 있는 묶음은 `article`, 상세 정보는 `dl`을 사용한다.

### BidList

- Structure: view selector, filter toolbar, search and page-size controls, responsive table, empty state, pagination
- Views: 전체, 마감 임박, 개찰 발표, 맞춤 공고
- States: default, filtered, searching, search suggestions, no result, paginated
- Layout: `/bids`는 Figma 1920px desktop frame에서 좌우 30px의 full-width 예외를 사용하고, 좁은 화면에서는 필터를 줄바꿈하며 테이블 영역만 가로 스크롤한다.
- Table content: 지역명은 단어 단위 줄바꿈을 유지하고, 업종은 한 줄 말줄임, 입찰마감은 한 줄 고정을 사용한다.
- Interaction: 검색·필터·페이지·표시 개수는 URL query와 동기화하고, 팝오버는 적용 전 draft 상태와 적용된 상태를 분리한다.
- Accessibility: view selector와 필터 trigger는 현재 상태를 노출하고, 검색은 label을 제공하며, 표는 caption과 scope가 지정된 header cell을 사용한다.

### SiteHeader

- Structure: brand link, public navigation, alarm link, auth link
- States: current route, hover, active, keyboard focus
- Accessibility: navigation landmark와 현재 페이지 `aria-current`를 제공한다.

## 6. Motion & Interaction

- 기본 interaction은 기존 버튼 hover/active 상태만 사용한다.
- 불필요한 진입 애니메이션이나 scroll listener를 추가하지 않는다.
- 스크롤 상단 이동은 앵커 기반으로 제공한다.
- 향후 모션 추가 시 `prefers-reduced-motion`을 존중하고 transform/opacity만 애니메이션한다.

## 7. Depth & Surface

Mixed 전략을 사용한다.

- 정보 구획은 grayscale tonal shift와 얇은 border를 우선한다.
- `BidCard` fill variant는 기존의 낮은 강도 shadow를 유지한다.
- 팝오버와 팝업은 각 공용 컴포넌트가 정의한 surface 규칙을 따른다.
- 공용 depth 토큰은 `--shadow-control`, `--shadow-floating`, `--shadow-popover`를 사용한다.
- 장식 목적의 강한 그림자는 추가하지 않는다.

## 8. Accessibility Constraints & Accepted Debt

### Constraints

- 목표: WCAG 2.2 AA
- 모든 링크와 버튼은 키보드로 도달 가능해야 한다.
- 의미 있는 이미지는 설명형 alt를, 장식 이미지는 빈 alt를 사용한다.
- 현재 경로, form label, landmark를 명시한다.
- 본문 대비 4.5:1, 큰 텍스트 대비 3:1을 목표로 한다.

### Accepted Debt

| Item | Location | Why accepted | Owner / Exit |
| --- | --- | --- | --- |
| 인증은 `localStorage` 기반 mock 상태 | `src/lib/mock-auth.ts` | 백엔드 인증 미연동 상태에서 CTA 흐름 검증을 위해 개발자가 승인 | 백엔드 인증 연결 시 실제 session adapter로 교체 |
| 홈 반응형 상세 스펙 미제공 | `/` | Figma가 1920px desktop frame만 제공 | 개발자 화면 검증 후 breakpoint 세부값 보정 |
| 입찰공고 모바일 전용 카드 스펙 미제공 | `/bids` | Figma가 1920px desktop table frame만 제공 | 모바일 디자인 제공 전까지 필터 줄바꿈과 테이블 가로 스크롤을 유지 |

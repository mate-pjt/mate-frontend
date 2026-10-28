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
| Danger action | `--danger-emphasis`, `--danger-surface` | `#ee2f3f`, `#ffebee` | 삭제 버튼과 위험 동작 상태 |

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

- Variants: primary, secondary, tertiary, gray, danger, outline, text 계열
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

### AlarmList

- Structure: 페이지 제목과 설명, 비활성 `편집 (준비 중)` 버튼, 받은 알림 목록 또는 빈 상태, 20건 단위 `더 보기`
- States: 로딩, 조회 오류/재시도, 빈 목록, 미확인/확인, 읽음 처리 중/오류, 다음 페이지 로딩/오류
- Surface: 현재 표시 순번의 홀수 항목은 `grayscale-50`, 짝수 항목은 흰색을 사용하며 읽음 여부와 배경을 연결하지 않는다.
- Interaction: 항목 선택은 읽음 요청의 성공 응답 뒤 해당 알림과 미확인 건수를 갱신하고 목록에 머문다. 편집·선택·삭제와 `actionPath` 목적지 이동은 현재 제품에 연결하지 않았다.
- Feedback: 읽음 요청이 실패하면 기존 미확인 상태를 유지하고 오류를 표시한다. 현재 페이지에 삭제 완료 toast는 없다.
- Accessibility: 미확인 여부는 우측 파란 점과 보조 텍스트로 함께 제공한다. 항목은 키보드로 조작하는 버튼이며 읽음 요청 중 `aria-busy`와 비활성 상태를 제공한다.
- Evidence: [현재 화면](src/components/alarms/alarm-page-client.tsx), [목록 항목](src/components/alarms/alarm-list-item.tsx), [실제 API QA와 미결 정책](docs/qa/alarms.md). 과거 편집·삭제 디자인 검증 이력은 현재 동작의 증거가 아니다.

### QnaAccordion

- Structure: 32px 질문 아이콘, 질문 trigger, 상·하 화살표, 선택적인 회색 답변 surface
- States: 최초 진입 시 전체 닫힘, 각 질문의 독립적인 열림·닫힘, 여러 질문 동시 열림
- Answer content: 18px medium 본문을 기본으로 강조·밑줄·문단·목록을 지원하며, `grayscale-50` 배경과 20px radius를 사용한다.
- Interaction: 네이티브 `details`/`summary`를 사용하고 새로고침 시 열림 상태를 초기화한다. 별도 진입·펼침 애니메이션은 사용하지 않는다.
- Responsive: 데스크톱 최대 너비는 1180px이며, 좁은 화면에서는 질문과 답변을 줄바꿈하고 답변 높이를 콘텐츠에 맞춰 확장한다.
- Accessibility: 질문 전체 행을 마우스와 키보드로 조작할 수 있고, 장식 아이콘은 접근성 트리에서 제외한다.

### Toast

- Structure: 체크 아이콘과 한 줄 메시지를 담는 짙은 회색 success feedback surface
- API: 루트에 `ToastViewport`를 한 번 마운트하고 화면에서는 `showToast(message, { duration? })`를 호출한다. Sonner API를 화면에 직접 노출하지 않는다.
- Position: 데스크톱과 모바일 모두 화면 하단 중앙에서 50px 떨어진 위치를 사용하며, 모바일 좌우 여백은 최소 16px을 유지한다.
- Lifetime: 기본 3초이며 호출부에서 duration을 변경할 수 있다. hover·문서 비활성 상태에서는 남은 시간을 보존한다.
- Concurrency: 한 번에 하나만 표시한다. 새 호출은 기존 toast를 즉시 숨기고 새로운 수명으로 교체한다.
- Scope: 현재는 Figma로 확인된 success 표현만 지원하고, error·warning·info 표현은 각 디자인 승인 후 추가한다.
- Accessibility: Sonner의 단일 `aria-live="polite"` 영역을 사용하며 콘텐츠 내부에 별도 live region을 중복 생성하지 않는다.

### SiteHeader

- Structure: brand link, public navigation, alarm link, auth link
- States: current route, hover, active, keyboard focus
- Accessibility: navigation landmark와 현재 페이지 `aria-current`를 제공한다.

## 6. Motion & Interaction

- 기본 interaction은 기존 버튼 hover/active 상태만 사용한다.
- 불필요한 진입 애니메이션이나 scroll listener를 추가하지 않는다.
- 스크롤 상단 이동은 앵커 기반으로 제공한다.
- Toast는 Sonner의 transform·opacity 기반 400ms 진입/퇴장 모션을 사용한다.
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

### 인증·받은 알림의 현재 구현과 검증 경계

2026-10-28 소스 대조 기준이다. 과거 CTA 검증용 localStorage mock 인증과 페이지 메모리 알림은 당시 승인된 구현 이력이며, 현재 미연동 부채로 유지하지 않는다. 현재 배포/실행 상태나 실제 API 통합 완료를 뜻하지 않는다.

| 영역 | 현재 구현 | 근거와 남은 검증/기능 |
| --- | --- | --- |
| 인증 | 공개 auth client가 빌드 설정에 따라 HTTP/mock Repository를 선택한다. API는 서버 중심 Google OAuth와 메모리 access token·refresh cookie로 세션을 복원한다. 실제 token은 localStorage/sessionStorage에 저장하지 않는다. mock 인증은 외부 OAuth/API 없이 탭의 합성 계정 ID·만료 시각으로 복원한다. | [Provider](src/features/auth/session.tsx)·[session controller](src/data/auth/session-controller.ts)·[auth client](src/data/auth/client.ts). [기존 인증 QA](docs/qa/auth.md)는 부분 실행 이력과 남은 사례를 구분하며, 현재 통합 재검증은 [QA-04](docs/development/figma-v01/tasks/QA-04.md) 범위다. |
| 받은 알림 | notifications Repository가 목록·미확인 건수·읽음을 제공한다. HTTP 구현은 목록/건수 GET과 읽음 PATCH에 연결돼 있다. mock의 목록/읽음 상태는 설정·환경·계정별 sessionStorage에 보존하며, 저장소 제한 시 메모리로 동작해 새로고침 유지를 보장하지 않는다. | [공개 client](src/data/notifications/client.ts)·[HTTP 구현](src/data/notifications/http-repository.ts)·[mock 구현](src/data/notifications/mock-repository.ts)·[탭 저장소](src/data/mock/store.ts). [기존 알림 QA](docs/qa/alarms.md)의 빈 목록·로그인 관련 과거 통과와 알림 fixture/읽음/21건 이상 대기를 유지한다. [QA-11](docs/development/figma-v01/tasks/QA-11.md)은 테스트 알림 준비가 필요하다. |

공급원은 동일한 빌드 snapshot에서 선택하며 API 오류의 자동 mock 대체는 없다. 상세 계약은 [data-access.md](docs/ai-context/data-access.md)와 [architecture.md](docs/ai-context/architecture.md)를 따른다. 받은 알림 편집·삭제는 삭제/숨김 계약 미확정으로 준비 중이며, 공고별 구독 해제와 다르다. 이동/읽음 정책은 [POL-04](docs/development/figma-v01/tasks/POL-04.md), 변경 신호·REST 재조회 계약은 [POL-05](docs/development/figma-v01/tasks/POL-05.md), 삭제/숨김·보존은 [POL-20](docs/development/figma-v01/tasks/POL-20.md)에서 별도로 결정한다. 이 문서 정정으로 해당 기능이나 7일 자동 삭제를 활성화하지 않는다.

### Accepted Debt

| Item | Location | Why accepted | Owner / Exit |
| --- | --- | --- | --- |
| 홈 반응형 상세 스펙 미제공 | `/` | Figma가 1920px desktop frame만 제공 | 개발자 화면 검증 후 breakpoint 세부값 보정 |
| 입찰공고 모바일 전용 카드 스펙 미제공 | `/bids` | Figma가 1920px desktop table frame만 제공 | 모바일 디자인 제공 전까지 필터 줄바꿈과 테이블 가로 스크롤을 유지 |

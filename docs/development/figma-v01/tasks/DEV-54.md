# DEV-54 · 상세 페이지 main 랜드마크 중첩 해소

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: C04
- 선행 작업: [DOC-001](DOC-001.md)
- 목적/범위: RootLayout과 상세의 중첩 main을 하나로 정리한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### C04 · 상세 main 랜드마크 중첩
- 기준선: UI **중첩됨**, 동작 **시각 동작은 가능**, 데이터 **없음**. 검증: 브라우저 strict locator와 코드로 확인.
- 남은 점: RootLayout main 안에 상세 main이 중첩. 접근성 랜드마크를 하나로 정리
- Figma: [2113:19107](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2113-19107)
- 소유 소스/기존 기록: [src/app/layout.tsx:55](../../../../src/app/layout.tsx)、[src/components/bids/bid-detail-content.tsx:42](../../../../src/components/bids/bid-detail-content.tsx)

- 이어갈 QA 기록: [bid-detail.md](../../../qa/bid-detail.md). 기존 case ID와 통과/대기/차단 기록을 보존한다.

## 완료 기준

- [x] 상세/다른 페이지의 main 수·접근 가능한 이름·문서 구조를 확인한다
- [x] 스타일/레이아웃·키보드/보조기술 탐색 회귀를 검증한다
- [x] 현재 package scripts로 필요한 test/lint/build·diff-check와 영향 시 Storybook 검증을 통과한다.
- [x] 요구사항 Gate에서 정한 실제 API/브라우저·권한·오류 사례와 필요한 QA case를 검증한다. 외부 조건으로 못 하면 차단/미실행과 이미 승인된 예외를 기록하며 전체 기능 통합 PASS로 표시하지 않는다.
- [x] Documentation Update Check 및 verifier/ai-review를 통과한다. 구현만 마친 상태는 완료가 아니다.

## 착수 전 Implementation Brief / 설계 Gate

<a id="dev-54-brief"></a>

2026-11-24 KST. DOC-001과 POL-28 인계가 원격과 같은 `main`(`dfd5969`)에 있다. 현행 소스에서 상세 본문과 목록·상세 공용 오류 화면이 모두 RootLayout의 `<main>` 안에 `<main>`을 렌더링함을 확인했다. 상세 성공과 공용 오류에 각각 하나의 본문 랜드마크가 노출되도록 교정한다.

- `bid-detail-content.tsx`와 `bids/error.tsx`의 최상위 태그를 `<div>`로 교체한다. RootLayout이 `<main>`을 제공한다. 기존 클래스, `id="top"`, 제목과 영역의 이름 및 계층, 링크, 재시도 버튼을 그대로 쓴다.
- 별도 이름 없는 단일 `main`과 이름을 가진 페이지 제목을 유지한다. [POL-29의 상세 화면 D1](POL-29.md#pol-29-decisions)과 [DEV-64의 배치·키보드 QA](../../../qa/bid-detail.md#dev-64-local-qa)를 시각·조작 회귀 기준으로 삼는다. C04의 상세 기본 frame은 `2113:19107`이며 새 시각 예외나 정책 결정이 필요하지 않다.
- 기존 스타일의 태그 의존성, 상세 `#top`의 스크롤·후속 Tab, 공용 fallback의 오류 제목·재시도 버튼을 확인한다. Node 22.20.0에서 `pnpm test`, `pnpm lint`, `pnpm build`, `git diff --check`를 실행한다. Storybook의 실제 소비 여부도 확인한다.
- 격리된 로컬 Next와 합성 공고로 상세 정상·404·섹션 오류·본문 오류, 목록 정상·오류, 홈·FAQ의 DOM 및 브라우저 접근성 트리를 확인한다. 상세의 1920·390·320px 배치와 키보드 조작을 전후 비교한다. 실제 업무 API와 계정, 운영·배포 및 DEV-13/14·61·64가 소유한 범위는 검증 범위 밖이다.
- 작업 기록과 [기존 상세 QA](../../../qa/bid-detail.md), 검토 기록, WBS, AI 컨텍스트에 근거를 남긴다. 남은 blocking ambiguity는 없다.

## 결정 기록

| 날짜 | 질문/선택지와 추천 | 결정·근거·승인자/원문 | 영향 |
| --- | --- | --- | --- |
| 2026-10-27 | 작업 후보 분해 | 정책·API·제품 동작 신규 승인 없음 | 착수 시 Gate 수행 |
| 2026-11-24 KST | DEV-54 단일 작업을 검증부터 Git 전달까지 수행 | 이번 사용자 요청에서 구현·검증·두 리뷰, 작업 브랜치 push와 PR, 조건 충족 시 정상 병합 및 로컬 fast-forward 승인 | 이번 PR의 Chromatic 월간 한도에 한해 예외 승인. 실제 업무 API·운영·배포의 실행 승인은 별개 |

## 체크포인트 · 재개 메모

| 시각/실행자 | 환경·branch/HEAD·작업트리 | 수행/결과·근거 | 다음 행동·차단/재개 조건 |
| --- | --- | --- | --- |
| 2026-10-27 / 문서화 | feature/my-company-overview / f84af24b5f9d + 기존 미커밋 변경 | 보고서에서 작업 정의만 생성. 구현/실제 QA 미실행 | 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다. |
| 2026-11-24 KST / Codex 착수 | `fix/dev-54-bid-main-landmark` · `dfd5969` · 시작 작업트리 clean | DOC-001, POL-28의 인계와 `main` 동기화 확인. 현행 루트와 두 소비 화면의 중첩을 확인하고 Brief·검증 범위를 사용자에게 공유 | 격리된 Next 기준선에서 정상/오류의 랜드마크를 재현한 뒤 두 래퍼를 교정 |
| 2026-11-24 KST / Codex 구현 | `fix/dev-54-bid-main-landmark` · `dfd5969` · 작업 문서와 래퍼 두 파일 | 원본 Next 응답의 정상 상세에 `<main>` 2개를 재현. 상세 본문과 공용 오류의 래퍼 태그만 교체 | Chrome DOM/접근성 트리·키보드와 화면 크기별 비교, 정적 검증을 실행 |
| 2026-11-24 KST / Codex 검증 | `fix/dev-54-bid-main-landmark` · `dfd5969` · 같은 제품 diff | 테스트 1,258건, lint, mock Preview 빌드 통과. 정상 상세·404·목록·홈·FAQ 및 독립 첨부 오류를 Chrome에서 검증. 기준선의 목록·상세 공용 오류에서도 main 2개 확인 | 수정본의 공용 오류/재시도와 같은 모드의 화면 비교를 마치고 문서 검증 및 Review Gate 진행 |
| 2026-11-24 KST / Codex 브라우저 검증 | `fix/dev-54-bid-main-landmark` · `dfd5969` · 같은 제품 diff | 수정본의 본문·목록 오류도 DOM/접근성 트리에서 main 1개. 각각 Tab·Enter 재시도에서 로컬 Next 요청 1회 관찰. Preview 간 레이아웃 측정값과 정상 상세의 키보드 동선 비교 | 문서 링크·WBS·범위 검사, verifier와 ai-review 수행 |
| 2026-11-24 KST / Codex Review Gate | `fix/dev-54-bid-main-landmark` · `dfd5969` · 같은 제품 diff | 문서 검사, 독립 verifier와 ai-review 통과. [검토 보고서](../reviews/DEV-54.md) | 종료·인계 문서를 재검증·재검토한 뒤 목적별 커밋, PR, 마지막 head의 검사 및 병합 조건 확인 |

## 검증·리뷰·인계 기록

<a id="dev-54-verification"></a>

| 구분 | 실행 명령/사례·환경 | 결과 | 증거/미실행 이유 |
| --- | --- | --- | --- |
| 자동 검증 | Node 22.20.0 · pnpm 11.3.0 · `pnpm test`, `pnpm lint`, `pnpm build`, `git diff --check` | PASS | Vitest 43파일·1,258건, lint 종료 0, Next 16.2.9 mock Preview 빌드. 추적 소스 사본에 두 TSX diff를 적용하고 lockfile 기반으로 실행 |
| 브라우저 검증 | 격리 Chrome 158.0.8127.37 · 합성 mock · 기본/본문 오류/첨부 오류 | PASS | [DEV-54 로컬 상세 QA](../../../qa/bid-detail.md#dev-54-local-qa) |
| 문서 검증 | 새 로컬 링크·앵커, 79개 원본 ID, 114개 실행 기록·156개 선행 연결, 상태·Markdown·범위 보존 | PASS | [검토 기록](../reviews/DEV-54.md) |
| 실제 백엔드 통합·앱 Storybook | 미실행 | 실제 통합 미판정 | C04의 브라우저 검증은 로컬 Next 렌더링 범위이고 Storybook의 소비 경로가 없다. 기존 QA-03 상태는 [실제 결과](../../../qa/bid-detail.md#qa-03-20261102)를 따른다. |

- 제품 자동 수정 0/3회. QA 실행기의 DOM 반환값과 스크롤바 폭 기준을 교정했다. 첫 section 검사는 Next 초기 컴파일 뒤 재실행했다. 오류 재시도는 Chrome 키 이벤트에 Enter 문자 입력을 포함해 다시 검증했다.
- Documentation Update Check에서 architecture의 본문 소유와 plan의 작업 증거, WBS·QA·작업·리뷰 연결을 갱신했다. 패키지·스크립트, 데이터 계층, 하네스, 원본 C04 연결에는 변경 근거가 없다.
- 관측 근거를 남기고 격리 Next 및 Chrome 검증 세션을 종료했다. 두 리뷰의 대상과 결과는 [검토 기록](../reviews/DEV-54.md)에 남겼다.

## 2026-11-11 · QA-17 전수 점검 보완

- 근거: [감사 CF-20](../audits/2026-11-11.md#cf-20) · [route/API·출처 인덱스](../audits/2026-11-11.json).
- 범위/소유: 현재 브라우저 DOM에서 main2개와 layout/detail source 중첩을 재확인했다. 이 기존 Task를 재사용한다.
- 추가 완료/재개 기준: 레이아웃/단위 위치는 DEV-64, 관련공고 mock은 DEV-61로 분리한다. main1개와 접근성·시각 회귀를 이 Task에서 확인한다.
- 이 절은 날짜별 후속 계획이다. 앞선 결정/QA/예외 이력을 대체하지 않으며 제품 구현·실제 업무 API 변경/새 통합 PASS는 없다. 상태는 WBS에서만 관리한다.

<a id="dev-54-pol-28-handoff"></a>

## 2026-11-24 KST · POL-28에서 선정 및 인계

[POL-28의 운영 주소 결정](POL-28.md#pol-28-domain-decision)은 정식 주소 확정까지 대기한다. C03 구현에는 그 결정이 먼저 필요하다. WBS의 P0~P2 남은 차단·미충족 선행과 P3의 보류·차단을 적용하면, C04는 DOC-001이 완료된 첫 실행 후보다. [현재와 다음 작업](../README.md)

다음 첫 행동은 DEV-54 자체 Gate에서 루트와 입찰 상세의 `<main>` 소유 위치를 현행 소스 및 상세 페이지 DOM에서 대조하고, [기존 상세 QA](../../../qa/bid-detail.md)의 이력을 바탕으로 랜드마크·키보드·레이아웃 회귀 기준을 정하는 것이다. 이번 인계는 선정과 첫 행동 지정이며 DEV-54 조사·구현·검증은 다음 작업에서 시작한다.

<a id="dev-54-close"></a>

## 2026-11-24 KST · DEV-54 종료 근거와 전달

두 태그 변경으로 정상 상세와 공용 오류의 본문 랜드마크가 2개에서 1개로 줄었다. C04 로컬 구현·브라우저·문서 검증과 Review Gate 근거는 [QA 기록](../../../qa/bid-detail.md#dev-54-local-qa) 및 [검토 보고서](../reviews/DEV-54.md)에 있다. 실백엔드 통합 결과는 기존 QA-03을 따른다.

런타임 태그 교정과 문서 증거·인계를 각각 커밋한다. 최종 head의 검사와 리뷰, 병합 상태는 [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afix%2Fdev-54-bid-main-landmark)에서 확인한다. 사용자가 승인한 이번 Chromatic 월간 한도 예외는 해당 실패 원인을 확인한 경우에만 적용한다. 정상 PR merge로 작은 커밋을 보존하고 `main` 로컬 fast-forward를 확인한다.

다음 작업은 [QA-15의 조건 재확인](QA-15.md#qa-15-dev-54-handoff)이다. P0~P2의 미충족 선행과 차단이 남아 있고, DOC-001을 충족한 QA-15는 관련 화면 변경 또는 출시 범위를 확인해야 한다. 기존 FAQ 변경과 QA, DEV-54의 대조 결과를 비교하는 첫 행동만 인계했다. [WBS](../README.md)

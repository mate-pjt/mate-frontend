# DEV-64 · 공개 상세 레이아웃·단위 전환 UI 정합성

[상태의 단일 기준: WBS](../README.md) · [운영 규칙](../workflow.md) · [감사 근거](../audits/2026-11-11.md#cf-10)

## 작업 정의

- 유형: 개발. 원본 항목: D01, D02, C01; 2026-11-11 전수 감사 CF-10.
- 선행 작업: [POL-29](POL-29.md). 순위는 WBS가 관리한다.
- 목적: Figma는 breadcrumb 우측 단위 전환과 해당 프레임의 본문/사이드 카드 폭·간격을 사용한다.
- 현재 차이/영향: 현재 단위 전환은 기본정보 아래 금액 섹션에 있고 바깥 max1112px·사이드300px 구성이다. Figma에는 해당 추가 입찰분류 선택 영역이 없다. canonical 분류 선택은 정책상 필요하므로 삭제로 해결할 수 없다.
- 제외: 아래 소유 경계 밖의 기능·새 라이브러리·무관한 리팩터링. 이번 감사에서는 제품 수정/실제 업무 API 변경/commit·push·PR·배포를 수행하지 않았다. 미래 구현의 실행 범위는 착수 Gate에서 확인한다.
- 책임/재개 조건: 실행자는 다음 선정 시 확정한다. 프론트 구현·디자인 결정·필요한 API/QA 자원 역할을 나누고, 미확인 개인 담당자를 임의 배정하지 않는다. 선행 Task 결과와 현재 디자인/정책/source/배포를 다시 대조한다.

## 기준과 소유권

- 고정 출발점: frontend `8d3a2ec290aabc4280c5e9f5336cfd36376f7e94`; 현재 backend dev/정책과 관찰 수준은 [날짜별 감사](../audits/2026-11-11.md#cf-10) 및 [JSON](../audits/2026-11-11.json). 근거 파일은 수정 허용 목록이 아니다.
- 소유 소스: [src/components/bids/bid-detail-content.tsx](../../../../src/components/bids/bid-detail-content.tsx) / [src/components/bids/bid-detail-amounts.tsx](../../../../src/components/bids/bid-detail-amounts.tsx) / [src/components/bids/bid-detail-alert-card.tsx](../../../../src/components/bids/bid-detail-alert-card.tsx).
- 관련 Task: [POL-29](POL-29.md) / [DEV-54](DEV-54.md) / [POL-08](POL-08.md) / [POL-09](POL-09.md) / [QA-03](QA-03.md). 기존 QA의 case/통과/차단/승인 예외를 보존한다.
- Figma: [Figma 2113:19107](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2113-19107).
- 고정 정책: [decisions/ADR-0013-classification-row-query-identity-and-pagination.md](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/decisions/ADR-0013-classification-row-query-identity-and-pagination.md).

## 착수 전 Implementation Brief / 설계 Gate

- 후보 요구사항/성공 기준: 아래 완료 기준. **아직 구현 미착수**다. UI 승인/실제 계약과 fixture 준비를 확인해 최종 Brief를 제시한다.
- in/out scope·현행 패턴: 위 목적/제외와 관련 Task의 소유 경계를 확인한다. 데이터/DTO/mock 설계 전 [data-access](../../../ai-context/data-access.md)를 읽는다.
- 편집 전 제시: 실제 수정 대상 파일·영향·단계·위험·검증 명령/시나리오·실행 식별자·필요한 데이터 사용/변경·잔존·복구 범위.
- blocking ambiguity는 최대3질문/추천안으로 해소한다. 감사의 추천을 정책 승인으로 취급하지 않고, 낮은 위험 가정만 명시해 진행한다.

## 완료 기준

- [ ] Figma 원본 좌표/폭을 확인하고 POL-29의 추가 분류 선택·빈/오류·auth 변형 결정을 받은 뒤 폭/간격/단위 전환 위치를 맞춘다.
- [ ] 공사/용역/물품·분류 없음/복수·개찰 회차/품목/참여업체 페이지에서 선택 URL과 접근 가능한 레이블을 보존한다.
- [ ] 데스크톱 및320/390px에서 문서 overflow·표 내부 scroll·단위 전환·사이드카드 순서를 검증한다. nested main은 DEV-54, 이력/본문은 DEV-13/14가 소유한다.
- [ ] 정상·빈·오류·권한/충돌과 접근성 중 영향 범위를 Gate에서 확정하고 자동/실제 Next 브라우저 검증 및 필요한 실제 QA를 기록한다. 미실행은 차단/이유로 남긴다.
- [ ] 현재 package scripts에 맞는 test/lint/build·필요한 Storybook/구성 검사와 diff-check를 통과한다. mock/HTTP 대역/실제 API 결과를 구분한다.
- [ ] Documentation Update Check, verifier/ai-review와 검토 뒤 변경의 freshness를 기록한다. 구현만으로 완료하지 않는다.

## 체크포인트 · 결정·인계

| 날짜 | 수행/근거 | 다음 첫 행동 |
| --- | --- | --- |
| 2026-11-11 | QA-17 감사에서 후보 정의·소유권/완료 기준만 추가. 정책 신규 승인·제품 수정·실제 업무 API 실행 없음 | 선행 결과와 감사 CF-10를 읽고 현재 source/계약·검증 자원으로 Brief를 확정 |

- 추천/후보는 승인 아님. 개발자/디자인/서버 결정이 필요한 내용은 결정자·날짜·원문/소유 소스·유지/보류 이유를 기록한다.
- 이 Task의 구현/자동·브라우저/실제 QA·Review Gate는 **미실행/미판정**이다. 감사 문서 검토를 구현 검증으로 대신하지 않는다.
- 자동 수정 시도0/3. 실패 시 원인·최소 수정·재검증을 순서대로 기록한다.
- 문서 갱신 여부와 프로세스/데이터 복구, 미커밋/Git 전달 범위는 실행 시 기록한다. 상태/다음 작업은 WBS에서만 갱신한다.

## 2026-11-11 · POL-29 화면 기준 인계

- 기준: [POL-29 D1](POL-29.md#pol-29-decisions). 본문792px+간격16px+사이드372px=1180px, breadcrumb 오른쪽 단위 전환으로 정렬하고 제목 다음 별도 분류 선택 영역을 승인 예외로 유지한다.
- [상태/검증표](POL-29.md#pol-29-states)의 공사/용역/물품·분류0/1/복수·본문404/section오류·금액 미제공·auth/권한/알림busy·회차/페이지와 URL bidClsfcNo 보존을 검증한다.320/390px 세로 순서/표 내부 스크롤·keyboard 레이블도 포함한다.
- nested main·이력/본문·실제 QA-03/09는 기존 소유/차단을 보존한다. 이 Task 구현/검증은 이번에 실행하지 않았다.

<a id="dev-64-pol-22-handoff"></a>

## 2026-11-23 · POL-22 다음 작업 인계

- POL-29가 main에 반영됐으며, 앞선 우선순위와 표 순서를 적용한 P2 후보 중 공식 선행이 충족된 첫 작업으로 선정했다. DEV-45는 DEV-08과 별도 백엔드 계약을 기다린다. [WBS](../README.md) · [POL-22 인계](POL-22.md#pol-22-close)
- 첫 행동은 [POL-29의 사용자 화면 결정](POL-29.md#pol-29-decisions), [상세 프레임·상태 기준](POL-29.md#pol-29-states), [CF-10](../audits/2026-11-11.md#cf-10)과 현행 상세 소스를 대조하여 요구사항 Gate를 작성하는 것이다. breadcrumb 우측 단위 전환, 본문·사이드 카드의 폭/간격, 승인된 분류 선택 및 `bidClsfcNo` URL 보존을 확인한다.
- 선정과 첫 행동만 인계한다. 새 화면 조사·디자인 결정·제품 변경·실제 QA는 DEV-64 대화에서 시작하며 이전 QA-03/09의 통과·차단·예외를 각 소유 기록에서 확인한다.

<a id="dev-64-brief"></a>

## 2026-11-23 · Implementation Brief와 착수 체크포인트

- 시작 기준은 `fix/dev-64-bid-detail-layout` / `df04ff662c72494b9f90ad1a474bec3891830d5c`다. `main`·`origin/main`이 일치했고 작업트리는 깨끗했다. POL-29 [PR #51](https://github.com/mate-pjt/mate-frontend/pull/51)의 머지 커밋 `4ecdfba`가 기준점의 조상이다. CF-10과 기준선은 당시 소스에서 관찰한 기록으로 사용했다.
- 결정자는 2026-11-11 사용자다. [POL-29 D1](POL-29.md#pol-29-decisions)의 **본문 792px, 간격 16px, 사이드 372px, breadcrumb 우측 숫자·원 전환기**를 적용한다. 제목 다음 복수 입찰분류 선택은 명시적으로 승인된 화면 예외다. 분류번호의 의미와 URL은 [ADR-0013](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/decisions/ADR-0013-classification-row-query-identity-and-pagination.md)의 계약을 따른다.
- 현행 Figma [공사 2113:19107](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2113-19107)에서 본문 노드 `2184:70719` 792px, 전환기 `2175:69865`와 사이드 `2180:10885` 372px를 확인했다. 공사 시안의 본문 x366과 사이드 x1178 사이 원시 간격은 20px다. [용역 2196:16577](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2196-16577)과 [물품 2196:21087](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2196-21087)은 x370과 x1178로 D1의 16px와 일치한다. 세 업무 유형에 공통으로 D1의 확정 치수를 적용한다. [공사 개찰결과 2205:19427](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2205-19427)은 회차·참여업체 회귀를 위한 상태 근거다. 결과 화면 전용 카드 재배치는 범위에서 제외한다.
- 2026-11-23 사용자 요청은 DEV-64의 단일 개발·검증·두 리뷰·목적별 커밋·push·PR·최종 CI 확인·조건부 정상 병합·로컬 fast-forward와 다음 Task 하나의 인계를 승인했다. 해당 PR의 Chromatic 월간 한도에만 예외가 적용된다. 실업무 API 변경·인증 계정 사용·메일·첨부/문서 처리·운영/직접 배포와 다음 Task 실행은 범위 밖이다. [QA-03](QA-03.md)의 상세 실서버 1통과·8차단 및 [QA-09](QA-09.md)의 알림 실서버 0통과·8차단을 이어받아 기록한다.
- 수정 범위는 `bid-detail-content.tsx`의 상세 그리드와 breadcrumb, `bid-detail-amounts.tsx`의 상세 안에서만 공유하는 표시 모드 및 전환기, `bid-detail-alert-card.tsx`의 데스크톱 배치다. Server Component·공개 Repository·URL 생성 경계는 유지한다. 중첩 `main`은 DEV-54, 수집 차수와 본문/현장설명/기준·수집일은 POL-08/09의 DEV-13/14 범위다. `data-access.md`의 조회·합성 fixture 및 인증 경계를 확인했다.
- 성공 기준은 넓은 화면에서 정확한 세 치수와 왼쪽 본문에 맞춘 전환기, 모바일 320/390px에서 본문 다음 알림 카드와 표 내부 스크롤이다. 분류 0·1·복수, 금액 미제공, 개찰 회차·품목·참여업체 페이지, 공개 404·오류·알림 로그인 복귀와 상태를 확인한다. 전환은 기존 기초금액·추정가격·배정예산의 표시만 바꾸고 URL을 유지한다.
- 가정은 현행 `lg`부터 이단을 적용하고 폭이 부족할 때만 breadcrumb 다음 줄에 전환기를 두는 것이다. 주요 위험은 좁은 화면의 표/긴 분류번호 overflow, 분류·회차·페이지 이동에서 표시 상태 또는 URL 문맥 유실, 알림 카드 sticky 위치 회귀다. 진행을 막는 미결 정책이나 신규 계약은 없다.
- 첫 행동은 그리드·전환기·키보드 접근을 정렬하는 것이다. 이어서 Node 22.20.0의 `pnpm test`, `pnpm lint`, api/mock/hybrid의 `pnpm build`, 실제 Next와 로컬 mock·HTTP 대역을 검증한다. 변경 Markdown의 링크·ID·상태·원본 보존과 `git diff --check`, 독립 verifier와 ai-review 뒤 Git 전달을 진행한다. 실제 QA는 기존 소유 기록을 따른다.

<a id="dev-64-focus-checkpoint"></a>

## 2026-11-23 · 배치 구현과 브라우저 수정 체크포인트

- 데스크톱 792/16/372px, 전환기 24px와 제목·사이드 시작선, 320/390px 문서 폭, 50자리 분류와 선택/회차/페이지 URL, 참여업체 표의 내부 560/240px 스크롤을 로컬 Next 브라우저에서 측정했다. HTTP 대역에서 별도 섹션 실패와 본문 404/500도 확인했다.
- 초기 격리 디렉터리에서 `pnpm`의 동시 의존성 준비로 lint·build가 모듈을 찾지 못했다. `pnpm install --frozen-lockfile`을 먼저 실행하고 검사 순서를 직렬로 바꿔 Node 22.20.0의 1,249 테스트·lint·api/mock/hybrid·Storybook을 통과했다. 저장소 의존성에는 변경이 없다. Aside의 브라우저 프로필 연결이 불가능해 격리 Chrome을 Playwright CLI로 실행했다.
- 첫 mock 브라우저 검증에서 알림 팝업을 `Escape`로 닫은 직후 문서 본문에 초점이 남았다. 시작 `main`의 동일 320px·가상 계정에서도 `dialogCount=0`, `activeTag=BODY`로 재현했다. [POL-29의 초점 복귀 조건](POL-29.md#pol-29-states)을 적용해 열려 있는 native dialog를 DOM에서 제거하기 전에 닫고, 취소와 정상 저장 후 키보드 초점 복귀를 확인한다. 자동 제품 수정 시도 1/3이다.
- 다음 첫 행동은 닫기 순서의 최소 교정 뒤 전체 자동 검사와 두 로컬 브라우저 흐름을 재실행하는 것이다. 실제 업무 호출·변경은 없다.

<a id="dev-64-verification"></a>

## 2026-11-23 · 교정 후 검증과 문서 점검

검증한 제품 변경은 시작점 `df04ff6`의 세 상세 컴포넌트이며, 제품 diff의 SHA-256은 `2b40805d8bd19119722b8929f791f1aa3e90f1bbe32d2c45b67947aef4897c71`다. Figma와 POL-29는 승인 화면 기준이며, 실제 Next 화면의 측정과 동작은 [상세 QA](../../../qa/bid-detail.md#dev-64-local-qa)에 정리했다.

| 층위 | 명령과 증거 | 판정 |
| --- | --- | --- |
| 자동 | Node 22.20.0 · pnpm 11.3.0. `pnpm test` 42파일 1,249건, `pnpm lint`, `pnpm build` api/mock/hybrid, `pnpm build-storybook` | 통과 |
| 실제 Next mock | Playwright CLI 격리 Chrome에서 공사/물품, 분류 키보드 선택과 가상 로그인 복귀, 표시 전환, 1920/390/320px, 사이드 sticky, 팝업 닫힘·저장 중·설정/해제·초점 복귀 | 통과 |
| 실제 Next + 로컬 HTTP 대역 | 용역 단일 분류, 물품 복수·50자리 번호, 2회차·2페이지, 표 가로 키보드 탐색, 0/미제공·빈 섹션/독립 실패, 상세 404/500, 가상 알림 오류 | 통과 |
| 실제 API | 신규 실서버 통합 0. QA-03의 1통과·8차단, QA-09의 0통과·8차단. 백엔드 배포/실행 대응, 다양한 분류·회차와 안전한 계정/구독 변경·복구 필요 | 기존 차단 유지 |

- alert 팝업은 연결된 native dialog에 `close()`를 호출한 뒤 제거한다. 320px에서 `Escape`, 설정 완료와 해제 완료가 각각 트리거로 초점을 복귀시켰다. 긴 분류번호와 좁은 화면에서 문서 가로 overflow는 0이다. 초기 브라우저 검증의 hydration 대기는 테스트 시작 조건을 추가해 재검증했다. 제품 교정 횟수는 1/3이다.
- 소유 절은 Task·WBS·[상세 QA](../../../qa/bid-detail.md#dev-64-local-qa)·[계획 목차](../../../ai-context/plan.md)·[리뷰](../reviews/DEV-64.md)다. 원본 79개, 114 Task와 156 의존성의 연결은 기존 coverage에 있다. package/scripts, 디렉터리·공통 디자인 토큰, 공개 데이터 계약, 하네스 규칙과 같은 공통 문서 갱신 사유는 없었다. QA 실행/기록의 교정은 이 Task의 체크포인트에 남겼다.
- 검토자용 증거는 로컬 `~/.codex/visualizations/2026/11/23/dev-64-bid-detail/`의 `test.log`, `lint.log`, `build-*.log`, `storybook.log`, `baseline-focus.log`, `browser-*.log`, `http-fixture.log`, `detail-*.png`다. 증거는 격리된 합성 환경에서 작성했다.

<a id="dev-64-close"></a>

## 2026-11-23 · 로컬 종료 판정과 다음 인계

- [x] POL-29 D1과 Figma의 세 업무 유형을 대조했다. 본문 792px·간격 16px·사이드 372px, 금액 전환 위치, 승인된 분류 영역을 반영했다. [Brief](#dev-64-brief)
- [x] 공사/용역/물품, 분류 0/1/복수, 회차·품목·참여업체 페이지, 320/390px, 로컬 빈값/오류/권한과 키보드를 확인했다. 전환 자체는 접근 가능한 버튼이며, 다시 열 때 기본 숫자 모드와 URL의 선택을 복원한다. [로컬 QA](../../../qa/bid-detail.md#dev-64-local-qa)
- [x] 전체 자동 검사와 문서 확인, read-only verifier 및 ai-review를 통과했다. 수정 1회와 기존 실제 QA 차단을 기록했다. [검증·Review Gate](../reviews/DEV-64.md)
- [x] 다음 Task는 POL-29·POL-19를 모두 충족한 WBS의 첫 P2 [DEV-66](DEV-66.md#dev-66-dev-64-handoff)이다. 먼저 배치된 P0/P1과 P2의 차단·미충족 선행을 유지한다. 선정과 요구사항 Gate의 첫 행동만 인계한다.
- 종료·인계 문서는 제품 검증과 1차 리뷰 뒤 갱신했다. 최종 diff 문서 검증과 두 리뷰의 재확인을 거쳐 전달한다.

<a id="dev-64-delivery"></a>

## Git 전달 기준과 재개 위치

2026-11-23 사용자 요청에 따라 공개 상세 레이아웃, 팝업 초점 복귀, 검증·인계를 목적별 커밋으로 전달한다. 실제 최종 head의 CI·원격 리뷰와 병합·로컬 fast-forward는 [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afix%2Fdev-64-bid-detail-layout) 및 종료 시 확인 기록을 따른다. Chromatic 월간 한도가 확인된 경우에만 이 PR에 사용자의 예외를 적용한다.

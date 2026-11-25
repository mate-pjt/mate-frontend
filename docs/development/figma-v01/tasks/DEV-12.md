# DEV-12 · 개찰결과 낙찰금액 필터 연결

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: L10
- 선행 작업: [POL-07](POL-07.md)
- 목적/범위: 확정된 낙찰금액 조회 계약을 결과 목록에 연결한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### L10 · 개찰결과 낙찰금액 필터
- 기준선: UI **준비 중**, 동작 **보류**, 데이터 **프론트 연결 없음**. 검증: 새 mock 비활성 확인.
- 남은 점: 현재 서버 계약 확인 후 낙찰금액 필터 구현
- Figma: [2134:10709](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2134-10709)
- 소유 소스/기존 기록: [src/components/bids/bid-filter-toolbar.tsx:132](../../../../src/components/bids/bid-filter-toolbar.tsx)、[docs/qa/bid-list.md:125](../../../../docs/qa/bid-list.md)

- 이어갈 QA 기록: [bid-list.md](../../../qa/bid-list.md). 기존 case ID와 통과/대기/차단 기록을 보존한다.

## 완료 기준

- [x] 결과 view 전용 조건·금액 경계/단위·URL·정렬/페이지 초기화를 확인했다. [검증](#dev-12-verification)
- [x] 타 view 무전송·빈 결과·HTTP 오류·URL 복귀를 확인했다. [브라우저 QA](../../../qa/bid-list.md#dev-12-local-qa)
- [x] 현재 package scripts의 test/lint/build·Storybook과 문서·diff-check를 통과했다. [검증](#dev-12-verification)
- [x] 승인된 로컬 사례는 통과했다. 실제 서버 통합은 사용자 결정에 따라 차단으로 보존하며 실행·통과는 각각 0건이다. [승인](#dev-12-brief) · [실제 QA 재개 기준](../../../qa/bid-list.md#dev-12-local-qa)
- [x] Documentation Update Check와 두 리뷰를 수행했다. [Review Gate](../reviews/DEV-12.md)

## 착수 전 Implementation Brief / 설계 Gate

이 기록은 작업 후보 정의다. DOC-001 외의 작업은 아직 실행하거나 설계 승인을 받은 상태가 아니다. 착수 시 아래를 현재 소스 기준으로 채우고 편집 전에 제시한다.

- 요구사항/성공 기준 확정: 미작성.
- in/out scope와 확인한 기존 패턴: 위 후보 범위를 검토해 확정.
- 수정 대상 파일·영향·구현 단계: 미작성. 위 근거는 수정 허용 파일 목록이 아니다.
- 검증 계획/실제 명령·환경·계정/변경/복구 승인: 미작성.
- blocking ambiguity/정책 근거: 미작성. 미결이면 설계 전 질문 최대 3개와 추천안을 제시.
- 가정/제외·낮은 위험의 선택: 미작성. API/DTO/데이터 흐름 설계 전 data-access.md 필독.

## 결정 기록

| 날짜 | 질문/선택지와 추천 | 결정·근거·승인자/원문 | 영향 |
| --- | --- | --- | --- |
| 2026-10-27 | 작업 후보 분해 | 정책·API·제품 동작 신규 승인 없음 | 착수 시 Gate 수행 |

## 체크포인트 · 재개 메모

| 시각/실행자 | 환경·branch/HEAD·작업트리 | 수행/결과·근거 | 다음 행동·차단/재개 조건 |
| --- | --- | --- | --- |
| 2026-10-27 / 문서화 | feature/my-company-overview / f84af24b5f9d + 기존 미커밋 변경 | 보고서에서 작업 정의만 생성. 구현/실제 QA 미실행 | 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다. |

## 검증·리뷰·인계 기록

| 구분 | 실행 명령/사례·환경 | 결과 | 증거/미실행 이유 |
| --- | --- | --- | --- |
| 이번 작업 | 미실행 | 미판정 | 기준선의 과거 결과와 구분 |

- 자동 수정 시도: 0/3. 실패 시 명령·오류·원인·최소 수정·재검증 결과를 추가한다.
- Documentation Update Check: 착수 후 판단. base/architecture/data-access/plan/harness/ai-failures 중 영향 문서와 갱신/미갱신 이유를 기록.
- Review Gate: 미실행. verifier와 ai-review의 결과/대상 diff·후속 변경 재검토 여부를 기록.
- 커밋/PR: 없음. 추후 커밋할 때 하나의 목적·영어 type/한국어 메시지, 런타임/테스트/문서는 가능한 별도 커밋.
- 다음 작업 인계: WBS에서 선택. 이 단위의 필수 검증 PASS 전에 다른 기능으로 자동 전환하지 않는다.

## 2026-11-09 · POL-07 D2 인계 · 낙찰금액 보류

- 사용자 원문: **“계약 확보까지 DEV-12 보류 (추천)”**. [결정/이유](POL-07.md#pol-07-decisions)·[L10 정책](POL-07.md#pol-07-contract)을 따른다. 현재/다음/상태는 WBS에서 확인한다.
- 현재 중앙 문서·Backend main/dev·배포 OpenAPI의 amountType은 BASE_PRICE/ESTIMATED_PRICE뿐이다. RESULT 응답의 successfulBidAmount는 필터 query 계약이 아니다. 낙찰금액을 기초/추정가격으로 바꾸거나 임의 enum/endpoint·개인 저장 필드를 추가하지 않는다. 기존 ‘준비 중’ 비활성/무전송을 유지한다.
- 재개 조건: 서버 소유자의 필드/enum·단위/정수/소수·분류/최신 회차·null/결과 상태·포함 경계·정렬/count/page·오류·URL/개인 저장 의미 명세, 개발자 정책 승인과 배포 대응, 안전한 합성 공고/계정·검증/변경·복구 범위를 확보한다. [ADV-11/12](../../../qa/bid-list.md#pol-07-advanced-qa) 중 비활성 보존만 정의했으며 기능 자체 QA는 미실행이다.
- 다음 첫 행동: 확장 계약 원문/버전·승인 근거를 받은 뒤 최신 main·API/URL 모델과 비교해 요구사항 Gate부터 재개한다. 보류는 구현 완료/실제 통합 PASS가 아니다.

<a id="dev-12-backend-20261113"></a>

## 2026-11-13 · 서버 낙찰금액 필터 계약 재확인

- 근거: [날짜별 재조사](../audits/2026-11-13-backend-readiness.md)·[고정 source/명세 JSON](../audits/2026-11-13-backend-readiness.json). backend dev `befe434c`·개발 OpenAPI에서 RESULT 전용 `successfulBidAmountMin/Max`를 확인했다. 위11/09의 필터 계약 부재는 당시 관찰로 보존하며 현재 부재의 근거로 반복하지 않는다.
- source/OpenAPI 관찰: nullable int64·0이상·min≤max·포함 경계, request/allowlist/validation→query→최종 낙찰금액 SQL ge/le 연결. 표시 행별 최신 재입찰 회차를 고르고 최신 미발표를 과거 발표 결과로 대체하지 않는다. null과0은 구분하며 개찰1순위 금액 대체가 아니다. 테스트 소스 열람과 이번 실제 테스트/통합 실행은 구분한다.
- 유지하는 재개 조건: 원/소수·안전 정수·분류/최신 회차·null/결과 상태·정렬/count/page/오류·URL/개인 저장 경계와 기존 POL-07 D2의 적용을 자체 Gate에서 확인한다. source/배포 기록·실행 대응·실제 경계 공고/합성 자원·사용/변경/복구 범위는 별개다. API 등장만으로 사용자 승인/전체 준비 완료를 만들지 않는다.
- 이번 사용자 승인은 새 근거와 재개 조건의 **문서 반영**이다. 보류를 해제하거나 DEV-12 자체 Brief·제품/실제 QA를 시작하지 않았다. 현재 상태는 WBS만 소유한다. 다음 첫 행동은 WBS에서 이 Task가 선정될 때 최신 계약과 위 잔여 조건을 대조하는 것이다.

<a id="dev-12-qa-15-handoff"></a>

## 2026-11-25 KST · QA-15에서 재개 조건 확인 인계

P0·P1의 차단·미충족 선행을 유지한다. P2의 POL-07이 완료됐고 [11/13 재조사](#dev-12-backend-20261113)에 RESULT 전용 낙찰금액 필터의 새 근거가 있어 DEV-12를 하나의 재개 조건 확인 대상으로 선정했다. WBS의 보류를 유지한다. [WBS](../README.md) · [QA-15 검증](QA-15.md#qa-15-verification)

다음 첫 행동은 DEV-12 자체 Gate에서 `successfulBidAmountMin/Max`의 [고정 계약 관찰](#dev-12-backend-20261113)을 현재 백엔드 GitHub와 개발 Swagger에서 대조하는 것이다. RESULT 적용과 포함 경계, 결과 분류·최신 회차·결측값, 정렬/count/page, URL과 개인 저장의 의미를 확인할 필요가 있다. 배포·실행 버전 대응과 합성 데이터·검증 자원, 적용 승인 조건은 따로 확인한다. 이번 인계에서는 DEV-12의 계약 재조회, 범위 결정, 구현 및 검증을 시작하지 않았다.

<a id="dev-12-gate"></a>

## 2026-11-25 KST · 재개 Gate 근거와 확인 요청

- 시작 기준은 로컬·원격 `main` `978f26dc7e99635404d34c55c76dbb8ec47099bd`다. 작업트리는 깨끗했고 동일 Task 브랜치가 없었다. POL-07의 [PR #49](https://github.com/mate-pjt/mate-frontend/pull/49)가 `main`의 선행 커밋이며 QA-15의 [PR #117](https://github.com/mate-pjt/mate-frontend/pull/117)도 병합 상태다. 이 기준에서 `feat/dev-12-result-amount-filter`를 만들고 계약 확인을 기록했다.
- 사용자는 2026-11-25 이번 Task의 검증·두 리뷰와 목적별 커밋·push·PR·최종 head CI·조건부 정상 병합·로컬 fast-forward를 승인했다. 이번 PR에서 Chromatic 월간 한도로 발생하는 문제에 예외를 적용한다. 11/09 POL-07 D2 사용자의 [계약 확보 전 보류 결정](POL-07.md#pol-07-decisions)과 11/13에 승인한 조사 기록 반영은 당시 범위로 보존한다.

| 확인한 근거 | DEV-12에 적용되는 관찰 |
| --- | --- |
| 백엔드 GitHub `main` `4b5f31de578c41e698dda9c99e66149b7292f031`, `dev` `74a770b9dc28446edd821befd213f754f27cc39d` | 두 브랜치의 목록 요청 파일 blob이 같다. nullable `Long` 경계, `RESULT` 전용, 0 이상, 최소 ≤ 최대를 검증한다. [main 요청](https://github.com/mate-pjt/mate-backend/blob/4b5f31de578c41e698dda9c99e66149b7292f031/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/bid/request/BidNoticeListRequest.kt#L147-L156) · [dev allowlist](https://github.com/mate-pjt/mate-backend/blob/74a770b9dc28446edd821befd213f754f27cc39d/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/bid/request/BidNoticeListQueryParameterValidator.kt#L34-L43) |
| `dev`의 분류 행·조회 쿼리 | 표시 행별 최신 재입찰 회차에서 최종 낙찰금액을 읽는다. 최신 미발표 회차는 제외된다. 경계가 있으면 null은 제외하고 0은 값으로 비교한다. `BigDecimal`에 `>=`·`<=`를 적용한다. 개찰시각 내림차순 뒤 공고 ID·분류번호 순이며 count와 page가 같은 조회 조건을 사용한다. [최신 행](https://github.com/mate-pjt/mate-backend/blob/74a770b9dc28446edd821befd213f754f27cc39d/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/bid/publiclist/PublicBidNoticeLatestResultRowSource.kt#L47-L91) · [조건과 정렬](https://github.com/mate-pjt/mate-backend/blob/74a770b9dc28446edd821befd213f754f27cc39d/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/bid/publiclist/PublicBidNoticeListRowQuerySpecFactory.kt#L49-L115) · [count와 page](https://github.com/mate-pjt/mate-backend/blob/74a770b9dc28446edd821befd213f754f27cc39d/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/bid/BidNoticeQueryPersistenceAdapter.kt#L216-L259) |
| 개인 조건과 중앙 정책 | 낙찰금액 범위는 공개 RESULT 조회의 입력이다. 개인 필터 도메인에는 기초금액·추정가격 범위가 있다. 기존 `ALL`의 개인 조건과 분리한다. [개인 도메인](https://github.com/mate-pjt/mate-backend/blob/74a770b9dc28446edd821befd213f754f27cc39d/mate-api/src/main/java/kr/co/mate/mate_api/domain/bid/personalfilter/PersonalBidNoticeFilter.kt#L10-L34) · [중앙 API 가이드](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/api/bid-notices.md#L55-L138) |
| CI와 테스트 배포 | `dev`의 verify·publish·deploy가 성공했다. `test` 배포 `8034985061`의 성공 기록은 2026-11-25 02:07:54 KST이며 `dev` SHA와 대응한다. [테스트 배포 job](https://github.com/mate-pjt/mate-backend/actions/runs/45438509497/job/138624943155) |
| 게시 개발 Swagger | 11/25 개발 OpenAPI 3.1.0 `v1`을 조회했다. `GET /api/v1/bid-notices`의 `successfulBidAmountMin/Max`는 선택 int64, 최소 0, 경계 포함이다. 열람한 JSON의 SHA-256은 `374a42c81bb57f2d21a74c75dcf747b8f880d5ae211a0e8f2f0b9f12560866d5`다. [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs) |
| 실행 서버와 실제 응답 | 실행 프로세스 SHA와 실제 목록 응답은 이번 조사에서 확인하지 않았다. 경계·소수·0·null·복수 분류·최신 미발표 회차·여러 페이지에 대한 승인된 개발 합성 공고와 기대 결과도 확인되지 않았다. |

Figma [2134:10709](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2134-10709)의 열린 팝오버 `3738:133311`에는 종류 선택 없이 낙찰금액 제목, 범위 표시, 원 단위 최소·최대 입력, 다섯 빠른 선택(1억 미만·1~5억·5~10억·10~50억·50억 이상), 초기화·저장이 있다. 이미지와 구조를 열람했다. 현재 [목록 도구](../../../../src/components/bids/bid-filter-toolbar.tsx)의 RESULT 버튼은 비활성이고 [금액 팝오버](../../../../src/components/ui/filter-popover/filter-popover.tsx)는 ALL/closing의 금액 종류·다른 빠른 구간과 공용 범위 표시를 사용한다. 초기 `0원 ~ 0원`과 미지정 범위의 의미도 구분해야 한다.

1. 제품 결정 요청. 개발 소스에 `1234.56`원을 보존하는 [DB 테스트 사례](https://github.com/mate-pjt/mate-backend/blob/74a770b9dc28446edd821befd213f754f27cc39d/mate-api/src/test/java/kr/co/mate/mate_api/adapter/out/persistence/bid/BidNoticeQueryPersistenceAdapterTest.kt#L540-L576)가 있다. 정수 상한에서 1원을 빼면 `99,999,999.50`원 같은 시안의 1억 미만 공고가 누락될 수 있다. 추천은 ‘1억 원 이하’로 첫 버튼을 바꾸고 시안의 네 경계에서 양끝 포함 범위와 기존 표시·직접 입력을 적용하는 것이다. 공통 경계는 인접한 두 범위에 각각 포함된다. 직접 입력만 제공하거나 정확한 미만 조건을 지원할 서버 계약까지 기다리는 선택도 제시했다.
2. 실제 QA 범위 요청. 추천은 개발 서버 실제 QA의 차단을 기록하고 DEV-12 로컬 mock·HTTP 대역 및 두 리뷰가 통과한 범위로 Git 전달하는 것이다. 실제 개발 서버 검증을 필수로 하면 승인된 공고와 기대값·실행 대응부터 확보한다. 공개 조회의 검증이며 계정 변경은 범위 밖이다.

다음 행동은 사용자 결정 기록 후 해당 범위의 Implementation Brief와 검증 계획을 확정하는 것이다. 이 시점에는 제품 소스·업무 API 실행·커밋·PR이 없다. `context-audit`의 DEV-12 관련 관찰은 기존 QA 안내와 plan의 ‘계약 부재’ 문구가 이번 소스·Swagger와 시점이 다르다는 것이다. 날짜별 관찰을 보존하고 이 절을 연결할 수 있다.

문서 검증은 기존 결정·원본 79개·WBS 114개와 선행 156개·기존 BID/ADV QA 표의 보존, 바뀐 로컬 링크·앵커, Markdown 형식과 `git diff --check`를 확인했다. 독립 검토에서 날짜가 없던 POL-07 WBS 요약의 혼동 가능성을 지적해 당시 날짜와 이 절의 링크를 보완했다. 검증 범위와 리뷰는 [재개 Gate 검토](../reviews/DEV-12.md)에 남긴다.

<a id="dev-12-handoff"></a>

## 2026-11-25 KST · 다음 작업 선정과 인계

대기 중인 작업 중 완료된 선행만 가진 행이 없다. P0 가운데 PREP-01이 완료된 첫 재개 확인 후보 [QA-01](QA-01.md)을 선정한다. QA-01의 실제 4통과·5차단과 기존 진행 예외는 해당 시점의 기록에 근거한다.

첫 행동은 최신 `main`과 작업트리를 확인하고 QA-01 기록 및 [홈 QA](../../../qa/home.md)에서 HOME-02~06의 유형·분류·기관·결측·0~8행 조건을 읽는 것이다. 현행 실행 식별자와 승인된 자원이 확보됐는지 해당 Gate에서 판단한다. 기존 HOME-09의 세션 복원·로그아웃 검증은 당시 기록을 따른다. 이번에는 후보 선정과 인계만 기록했다. DEV-12는 위의 제품·검증 범위 결정을 받으면 자체 Gate를 이어갈 수 있다.

<a id="dev-12-brief"></a>

## 2026-11-25 KST · 사용자 결정과 Implementation Brief

- 결정자와 범위. 사용자가 ‘첫 구간은 ‘1억 원 이하’로 하고 빠른 선택은 양끝 포함으로 적용’과 ‘실제 서버 QA는 차단으로 남기고, 로컬 mock·HTTP 대역 검증과 두 리뷰를 통과하면 DEV-12만 커밋·PR·CI 확인·main 병합·로컬 동기화’로 확정했다. QA-01은 위 인계까지만 적용한다. 실제 업무 조회·변경, 계정 저장·다른 보기 기능, 새 라이브러리와 서비스 운영은 이 단위 밖이다.
- 시작 기준. `feat/dev-12-result-amount-filter` HEAD와 로컬·원격 `main`은 `978f26dc7e99635404d34c55c76dbb8ec47099bd`다. 기존 미커밋 문서 여섯 개는 이 Task의 재개 근거·검토·인계로 확인했고 이어서 사용한다. POL-07 선행은 `main`에 있다.
- 성공 기준. RESULT의 낙찰금액 팝오버에서 1억 원 이하, 1억~5억 원, 5억~10억 원, 10억~50억 원, 50억 원 이상의 포함 범위와 원 단위 직접 입력을 적용한다. 열린 범위, 동일 금액과 0, JavaScript 안전 정수 상한을 허용하며 음수·소수 입력·상한 초과·역전·중복 URL을 거절한다. 조회 조건은 URL과 새로고침 및 브라우저 뒤로 가기에서 복원되고, 적용·해제와 보기 변경은 첫 페이지에서 조회한다. 표의 값·분류·순서·건수는 API 응답을 따른다. 잘못된 URL·빈 결과·HTTP 오류에서 각각 수정·초기화·재시도가 가능하다.
- 설계와 파일. `data/bids/contracts.ts`와 `features/bid-notice-filters/amount-filter.ts`에서 RESULT 조회 범위와 검증을 정의하고 `bid-list-model.ts`와 `bid-list-client.tsx`에서 동일한 두 키를 읽고 쓴다. `bid-filter-toolbar.tsx`와 `filter-popover.tsx`의 기존 입력·범위 표시·저장/초기화를 재사용하고 종류 탭을 숨긴다. 공용 Storybook의 금액 예시에 RESULT 상태를 추가한다. HTTP Repository는 `view=RESULT`에서만 두 경계를 보내고 기존 `openAt,desc`를 사용한다. mock은 표시 행에 이미 들어있는 최종 낙찰금액을 페이지 자르기 전에 비교한다. 기존 개인 모델·DTO·저장·공급원 설정은 이 변경의 영향 범위 밖이다.
- 시안 적용. 11/25 승인은 첫 구간 라벨과 양끝 포함이며 1억·5억·10억·50억 원은 각각 인접한 두 구간에 포함된다. 기존 범위 표시와 원 단위 입력을 사용하고 빈 경계의 화면 값은 ‘제한 없음’으로 표시한다. 범위 표시를 드래그 조작으로 확장하는 변경은 별도 범위다. [Figma 팝오버](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2134-10709)
- 검증과 위험. 정수 경계 옆 소수 결과, 0과 null, 다른 보기·개인 URL 및 페이지 이동을 회귀 위험으로 본다. `tests/bid-amount-filter.test.ts`, `pnpm test`, `pnpm lint`, API/mock/hybrid `pnpm build`, `pnpm build-storybook`, `git diff --check`를 Node 22.20.0으로 실행한다. 격리 Next에서 전체 mock과 loopback HTTP 대역의 URL·정렬·페이지·오류·키보드와 320/390px를 확인한다. 실제 서버 검증은 승인 범위에 따라 차단으로 남긴다. 자동 수정 한도는 3회다.

다음 행동은 RESULT 범위 모델·URL·Repository를 연결하고 팝오버와 회귀 검증을 추가하는 것이다.

### 구현과 로컬 검증 체크포인트

같은 HEAD의 DEV-12 작업트리에서 RESULT 팝오버·URL·HTTP·mock과 신규 테스트를 연결했다. Node 22.20.0에서 43개 파일의 1,273개 테스트, lint, API/mock/hybrid의 Next 빌드와 Storybook 빌드를 통과했다. 초기 API 빌드와 lint는 같은 격리 폴더에서 pnpm의 자동 설치 확인이 겹쳐 실패했다. 폴더별 고정 lockfile 설치와 순차 실행으로 통과했고 이 과정의 제품 수정은 0회다. Aside 프로필 연결이 없어 격리 Playwright Chrome을 사용한다. 다음은 실제 Next와 localhost HTTP 대역으로 정상·빈·오류·모바일을 재현하는 단계다.

<a id="dev-12-verification"></a>

### 로컬 검증과 실제 QA 재개 조건

| 검증 | 결과 |
| --- | --- |
| `pnpm test` | 43파일·1,273개 통과. 신규 15개는 결과 URL·원 입력 거절, exact wire, 소수 결과·포함 경계, 0/null·분류·count/page를 확인했다. |
| `pnpm lint` · `pnpm build` · `pnpm build-storybook` | lint, api·mock·hybrid Next 빌드, Storybook 빌드 통과. Storybook 설정 import와 번들 크기 경고가 있었다. |
| `pnpm start`와 Chrome | HTTP 대역 10건, 전체 mock 4건, hybrid HTTP 대역 1건을 통과했다. Mock 결과물은 production 구동에서 거절됐다. 검증한 소스·테스트 10개 파일이 격리 빌드의 입력과 일치한다. [QA 사례·화면·실행 범위](../../../qa/bid-list.md#dev-12-local-qa) |
| 실제 테스트 서버 | 사용자 승인에 따라 차단 보존. 실제 업무 API·계정·쓰기·개발 서버 검증 0건이다. 실행 식별자·승인된 공고와 기대값·안전한 오류 조건을 확보하면 실제 QA를 재개한다. |

브라우저 검증 도구에서 비동기 URL 갱신 대기 조건과 용역 선택의 `option` 역할을 보완했다. 이 두 보완은 격리 실행 스크립트에 적용했다. 검증 실패로 인한 제품 보정은 0회였다. 작업 기록·WBS·입찰 QA와 `architecture.md`·`data-access.md`·`plan.md`·POL-07 후속 링크를 갱신하고, package·하네스·기준선과 coverage의 변동 여부를 확인했다. 다음은 문서 및 Review Gate다.

<a id="dev-12-delivery"></a>

### Git 전달 기준

11/25 사용자 승인에 따라 제품·테스트·문서를 목적별로 커밋한다. 최종 [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afeat%2Fdev-12-result-amount-filter)의 head·CI·리뷰·저장소 병합 가능 상태를 확인한 뒤 커밋 보존 방식으로 병합한다. Chromatic 월간 한도에 따른 문제에는 이번 승인만 적용한다. 병합 후 로컬 `main`을 fetch 및 fast-forward하고 SHA·작업트리를 확인한다. 개발 서버 실제 QA와 배포 증거는 별도 범위다.

<a id="dev-12-close"></a>

### 승인 범위의 완료와 인계

`feat/dev-12-result-amount-filter`에서 지원하는 RESULT 범위, 로컬 브라우저 15건·자동 검사, 문서와 두 리뷰를 확인했다. 격리 Chrome 세 세션과 Next 세 프로세스·HTTP 대역을 종료하고 실험 포트에 리스너가 없는 것을 확인했다. 실제 통합 차단은 입찰 목록 QA에 남겼다. [검증](#dev-12-verification) · [리뷰](../reviews/DEV-12.md)

다음 작업은 위 [QA-01 인계](#dev-12-handoff)를 유지한다. 이번 사용자가 QA-01을 인계까지만 진행하도록 확인했다. 다음 행동은 DEV-12의 최종 문서 재검토와 Git 전달이다. [전달 기준](#dev-12-delivery)

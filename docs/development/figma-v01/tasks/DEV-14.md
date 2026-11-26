# DEV-14 · 승인된 원문·추가 일자 표시

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: D10
- 선행 작업: [POL-09](POL-09.md)
- 목적/범위: POL-09에서 추가하기로 확정된 데이터만 모델/상세에 연결한다. 링크 대체 유지 결정이면 보류하고 근거를 남긴다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### D10 · 지시사항/원문 본문·현장설명일·수집 기준일
- 기준선: UI **대체/일부 없음**, 동작 **미제공 부분 있음**, 데이터 **프론트 모델 없음**. 검증: 코드 대조.
- 남은 점: 공고 원문은 링크로 대체; 현장설명은 필요 여부만 표시. 상세 일자·원문 본문 계약과 표시 정책 확인
- Figma: [2113:19107](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2113-19107) / [2181:69353](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2181-69353)
- 소유 소스/기존 기록: [src/types/bid-detail.ts:22](../../../../src/types/bid-detail.ts)、[src/components/bids/bid-detail-content.tsx:146](../../../../src/components/bids/bid-detail-content.tsx)、[src/components/bids/bid-detail-content.tsx:200](../../../../src/components/bids/bid-detail-content.tsx)、[docs/qa/bid-detail.md:73](../../../../docs/qa/bid-detail.md)

- 이어갈 QA 기록: [bid-detail.md](../../../qa/bid-detail.md). 기존 case ID와 통과/대기/차단 기록을 보존한다.

## 완료 기준

- [ ] 미제공/null·시간대/포맷·원문 안전한 렌더링/링크를 검증한다
- [ ] 수집 시각과 공고 업무 일자를 혼동하지 않는지 확인한다
- [ ] 현재 package scripts로 필요한 test/lint/build·diff-check와 영향 시 Storybook 검증을 통과한다.
- [ ] 요구사항 Gate에서 정한 실제 API/브라우저·권한·오류 사례와 필요한 QA case를 검증한다. 외부 조건으로 못 하면 차단/미실행과 이미 승인된 예외를 기록하며 전체 기능 통합 PASS로 표시하지 않는다.
- [ ] Documentation Update Check 및 verifier/ai-review를 통과한다. 구현만 마친 상태는 완료가 아니다.

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

<a id="dev-14-pol-09-handoff"></a>

## 2026-11-13 · POL-09 정책 후속 기준 · 구현 미착수

- 사용자 원문 **‘추가 정보 제공 추진·백엔드 계약부터 정리’**. [POL-09 v1](POL-09.md#pol-09-contract)·[계약 요청 명세](POL-09.md#pol-09-backend-contract)가 후속 기준이다. 원문 링크만 유지하는 최종 정책/DEV-14 보류 추천은 채택되지 않았다. 현재/다음/상태는 WBS가 소유한다.
- 추가 목표: 원문 자격사항/지시사항 본문·현장설명 일시·기준일·수집일을 **실제 제공 계약과 원천 의미가 확보된 범위에서** 표시한다. 원문 링크·현장설명 필요 여부·기존 일정/공동수급 협정 마감은 보존하며 새 기능으로 중복 집계하지 않는다.
- backend 실제 계약/배포·실행 대응/검증 자원은 미확보다. 미확보 항목은 아래 재개 조건이고 구현·mock/HTTP 대역·브라우저/실제 QA는 이번에 수행하지 않았다. backend/중앙 문서 편집·외부 요청 발송도 없다. 로컬 선행/QA 면제 예외는 없다.

### 재개 Gate

| 조건 | 필요한 근거/책임 역할 | 이번 확인/다음 첫 행동 |
| --- | --- | --- |
| 공급원/의미 | backend 공개 상세·수집 계약 소유자의 본문 범위/형식·현장설명 일시·기준일/수집일 개별 원천·산출/갱신 기준 | 미확보. 정책 명세에 답하는 실제 계약부터 받음. 게시일/section min/max로 보완하지 않음 |
| 공개 wire | 실제 path/query/schema·공고/분류/차수 scope·권한·null/미제공/오류·본문 안전한 표시 책임 | 미확보. 관리자/raw-source 우회·가상 DTO/endpoint로 선행 구현 안 함 |
| 현재 필요 여부 | source/프론트의 `isSiteExplanationRequired`와 OpenAPI의 `siteExplanationRequired` 실제 응답 키/타입·양성/음성 fixture | 미확인. 소스 또는 Swagger만으로 실제 wire를 확정하지 않음 |
| 버전/실행 대응 | source commit·배포 문서/version·실제 서버 process SHA/이미지 대응·사용 frontend 계약 | dev source와 문서200만 확인. 실행 대응은 미확보 |
| 검증/사용 범위 | 비식별 공사/물품/용역·분류/차수·본문/일시 유무·부분실패/오류 fixture/기대값·안전한 사용/잔존/복구 범위 | 미확보. 실제 원문/파일/인증/업무 요청 전에 범위를 확인 |
| 자체 Brief | 위 근거를 대조한 DEV-14의 모델/Repository/DTO 경계·표시/결측/오류·검증 계획 | 아직 미작성. POL-09 문서가 구현 Brief를 대신하지 않음 |

### 추가 완료 기준

- [ ] 실제 제공 계약과 모델/mapper/공개 Repository를 연결하고 합성 fixture로 실제 내용을 대신하지 않는다. 공급 불가 항목은 새 정책 Gate에서 결정한다.
- [ ] 본문 출처/범위·빈/긴/여러 줄·특수문자/안전한 렌더링·URL 정상/결측/위험 scheme·부분 오류를 확인한다. 원문 URL/`available`과 본문 유무를 별개로 해석한다.
- [ ] 현장설명 필요 여부와 일시를 독립 검증한다. true/false·일시 유무/미정·date-only/offset 경계에서 결측이 불필요나 임의 날짜로 바뀌지 않는다.
- [ ] 기준일·수집일은 실제 합의된 개별 의미/정밀도/KST·갱신/부분실패 규칙을 따른다. 게시/최초 공개·시도/성공/source version·조회시각과 혼동하지 않는다.
- [ ] Figma 공사 로그인 전/인증회사 로그인 후의 해당 정보 목표를 확인한다. 이번 정책으로 현행 차이가 면제되지 않았음을 보존하고 다른 화면/레이아웃 예외로 확대하지 않는다.
- [ ] 이미 제공하는 공동수급 협정 마감·기존 일정/원문 링크·공고/분류/차수 선택·section 실패를 회귀 검증한다. 공사/물품/용역·모바일/키보드도 영향대로 확인한다.
- [ ] 현재 package scripts의 자동 검사와 실제 Next/브라우저·mock/HTTP 대역·실제 API를 각각 기록하고 [QA 후속](../../../qa/bid-detail.md#pol-09-followup)을 수행한다. 미실행/차단을 전체 PASS로 바꾸지 않는다.

### 재개 메모

다음 첫 행동은 최신 Git/WBS와 POL-09 정책·계약 요청 표를 읽고 실제 backend 계약/실행 대응·검증 자원부터 대조하는 것이다. 계약 확보/필수 Gate 전 제품 설계·구현을 시작하지 않는다. 기존 QA-03의1통과8차단·타 Task 승인/차단은 그대로다. 담당 개인/발송·접수/일정은 미확정이고 사용자 요청 전달을 Codex가 수행한 사실은 없다.

## 2026-11-13 · 요청 전달 보고와 차단 유지 지시

- 사용자가 요청문과 주석 이미지를 backend 개발자에게 전달했다고 보고했다. [전달 원문/범위](POL-09.md#pol-09-backend-delivery)를 따른다. Codex의 외부 발송은0건이며, 접수/답변·실제 API 계약·적용 버전/실행 대응·검증 자원은 아직 미확인이다.
- 사용자 명시 지시: **답변과 실제 API 계약이 확보될 때까지 차단 상태 유지**. 기존 재개 Gate/완료 기준·실제 QA 차단을 보존하고 구현·mock 선행·실제 업무 API 실행을 시작하지 않는다. 현재/다음/상태의 단일 소유자는 WBS다.

<a id="dev-14-20261126-date-readiness"></a>

## 2026-11-26 KST · 공고 상세 날짜 표시 범위 재개 검토 인계

**사용자 결정과 범위.** 2026-11-26 KST에 사용자가 이 작업 기록과 WBS의 갱신, 날짜 표시 범위의 재개 검토 선정·인계, 문서 검증 및 Git 전달을 승인했다. 시작 기준은 깨끗한 프론트 `main` `67187d378fbab711b8fe26c9957c0da9cfc70c90`과 작업 브랜치 `docs/dev-14-date-readiness-handoff`다. 재개 검토 이후의 상태는 [WBS](../README.md)가 관리한다. 새 Task 등록, 제품 구현, 표시 정책 확정, 실제 업무 API 실행은 이번 기록에서 미실행이다.

| 근거 | 2026-11-26 확인 결과 |
| --- | --- |
| 백엔드 소스 | 공고 상세 날짜 변경 `e942bb0`는 백엔드 `dev` `f4860fd`와 `main` `4b5f31d`에 들어 있다. 기존 `GET /api/v1/bid-notices/{id}`의 응답에 `schedule.siteExplanationAt`·`siteExplanationAvailability`, `eligibility.siteExplanationRequirement`, `dataInfo.noticeSourceVersionAt`·`noticeLastFetchedAt`가 추가됐다. [변경 소스](https://github.com/mate-pjt/mate-backend/commit/e942bb0d5b022436054e5d3bf85434af339006d6) · [개발 소스](https://github.com/mate-pjt/mate-backend/tree/f4860fd9b87329d50169eb0025dca3f2c5fa2125) · [main 소스](https://github.com/mate-pjt/mate-backend/tree/4b5f31de578c41e698dda9c99e66149b7292f031) |
| 테스트 배포와 게시 명세 | 백엔드 `f4860fd`의 테스트 배포 `8072722595` 성공 기록을 확인했다. 사용자용 [개발 Swagger](https://api-test.mate-bid.com/swagger-ui/index.html)의 [OpenAPI](https://api-test.mate-bid.com/v3/api-docs)는 HTTP `200`, OpenAPI `3.1.0`, 계약 `v1`이며 응답 SHA-256 `9711e22b705d79ded53428d1a0ba157bae2894a46999a83899d8324fc4459ea4`가 해당 `dev` 소스에 커밋된 사용자 명세와 일치한다. 실행 중인 업무 프로세스의 SHA 및 공개 상세의 실제 응답은 미확인이다. [테스트 배포](https://github.com/mate-pjt/mate-backend/actions/runs/45723770088/job/139596909303) |
| 일정과 결측 의미 | 현장설명 일시는 nullable이다. 게시 enum은 `UNKNOWN`·`PROVIDED`·`NOT_PROVIDED`·`NOT_APPLICABLE`이며, 현행 매퍼는 이 상세 필드에 일시가 있으면 `PROVIDED`, 원천을 확인했지만 일시가 없으면 `NOT_PROVIDED`, 그 밖의 미확인은 `UNKNOWN`을 반환한다. 기존 `isSiteExplanationRequired`는 미확인에도 `false`일 수 있는 호환 필드다. 원천의 설명회 여부와 일정은 참석 의무 판정에 사용하지 않는다. [응답 계약](https://github.com/mate-pjt/mate-backend/blob/f4860fd9b87329d50169eb0025dca3f2c5fa2125/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/bid/response/BidNoticeDetailResponse.kt#L188-L201) · [일정 매퍼](https://github.com/mate-pjt/mate-backend/blob/f4860fd9b87329d50169eb0025dca3f2c5fa2125/mate-api/src/main/java/kr/co/mate/mate_api/application/service/bid/BidNoticeQueryResultMapper.kt#L308-L326) |
| 원천과 화면 | `noticeSourceVersionAt`은 기본 목록 원천의 변경일 우선·등록일 대체 값, `noticeLastFetchedAt`은 같은 기본 원문의 마지막 수집 시각이다. 공고 전체 보강의 완료 시각은 범위 밖이다. Figma의 공사 로그인 전·인증 회사 로그인 후 상태의 날짜 라벨과 비교했다. 프론트의 기존 현장설명 표시는 호환 boolean을 사용하며 새 일시·원천 시각은 아직 매핑하지 않는다. [날짜 계약](https://github.com/mate-pjt/mate-backend/blob/f4860fd9b87329d50169eb0025dca3f2c5fa2125/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/bid/response/BidNoticeDetailResponse.kt#L68-L76) · [로그인 전](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2113-19107) · [인증 회사 로그인 후](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2181-69353) · [현장설명일](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2154-10878) · [기준일·수집일](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2175-69728) · [프론트 매퍼](../../../../src/data/bids/detail-api-mapper.ts) · [상세 표시](../../../../src/components/bids/bid-detail-content.tsx) |
| 원문 본문 | 현행 중앙 정책과 개발 상세 매퍼에서 긴 자연어 자격사항·지시사항 본문의 제공 근거는 확인되지 않았다. `originalNotice.available=false`와 원문 URL을 확인했다. [중앙 계약](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/api/bid-notices.md#공개-상세에-없는-자격사항) · [POL-09 계약 선행](POL-09.md#pol-09-contract) |

날짜 필드의 **게시 계약 미확보** 조건에 변화가 생겼다. 날짜 표시 범위의 자체 요구사항 확인에 해당하며, 실제 응답과 실행 버전 대응·날짜의 화면 용어와 결측 처리 확인이 남아 있다. 원문 본문 계약, 위의 기존 완료 기준과 [QA-03 실제 QA 이력](../../../qa/bid-detail.md#qa-03-20261125-detail)을 보존한다.

<a id="dev-14-20261126-date-first-action"></a>

### 다음 첫 행동

최신 WBS·[POL-09 정책](POL-09.md#pol-09-contract)·개발 Swagger를 읽고 개발 실행 버전의 대응 근거를 확인한다. 공개 공고 상세의 확인 환경과 승인 범위를 확인한 뒤 날짜가 제공된 공고와 미제공·미확인 사례의 실제 응답을 읽기 전용으로 대조한다. 공고 유형과 분류 범위, 시간대·정밀도·결측 상태, 기본 목록 원천의 기준·수집 시각을 Figma의 두 라벨과 함께 검토한다. 응답·자원이 미확보이거나 화면 표시 결정이 남으면 필요한 근거와 결정만 정리한다. 날짜 표시 범위의 착수 여부는 그 요구사항 확인에서 판단한다.

### 문서 확인 범위

- Python 문서 검사와 `git diff --check`를 통과했다. Markdown 형식, 변경 링크 27개, WBS 114개 작업·선행 관계 156개·상태 값·다음 첫 행동, 원본 항목 79개와 기존 기록, 두 파일의 변경 범위를 확인했다.
- 문서 갱신 확인에서 D10의 소유·연결, 공통 정책 및 앱 환경에 추가 반영할 변경을 확인하지 않았다. 로컬 앱 test/lint/build와 Storybook은 실행 입력이 같은 문서 작업이라 미실행이다. 브라우저·mock·HTTP 대역·실제 업무 API 통합도 미실행이다.
- 독립 읽기 전용 verifier와 ai-review의 결과, 최종 원격 CI는 PR에 기록한다.

<a id="dev-14-20261126-resume-check"></a>

## 2026-11-26 KST · 날짜 표시 재개 점검

### 작업 범위와 검증 계획

- 시작 기준은 14:01 KST의 깨끗한 `main` 및 `origin/main` `8fa56394b02d8c244904d4c17e7b560a04aac830`이다. 선행 POL-09와 날짜 점검 인계 [PR #140](https://github.com/mate-pjt/mate-frontend/pull/140)의 main 반영을 확인했다. 이전 인계 브랜치는 병합됐고 이번 브랜치 `docs/dev-14-date-readiness-check`를 최신 main에서 만들었다.
- DEV-14는 P2 개발 Task다. 이번 단위는 사용자가 2026-11-26 선정한 [날짜 범위의 재개 요구사항 확인](#dev-14-20261126-date-first-action)이다. POL-09의 공급 방향과 공개 개발 환경의 날짜 계약을 확인하고, 제품 착수 조건 충족 여부를 판단한다. 이번 사용자 요청은 DEV-14 검증·기록·두 리뷰와 커밋·push·PR·조건부 main 병합·로컬 동기화를 승인한다. PR #140은 당시 선정과 문서 인계의 근거다.
- 업무 응답 표본은 공개 개발 목록·상세의 비로그인 GET을 사용한다. [백엔드 상세 조회](https://github.com/mate-pjt/mate-backend/blob/f4860fd9b87329d50169eb0025dca3f2c5fa2125/mate-api/src/main/java/kr/co/mate/mate_api/application/service/bid/BidNoticeQueryService.kt#L53-L60)는 읽기 전용이다. 공고 유형·분류 범위, 현장설명 일시와 제공 상태, 원천 여부와 호환 키, 기본 목록 원천 두 시각을 비식별로 추려 본다. 제품의 모델·표시 정책 설계와 구현은 자체 요구사항 Gate, 본문은 별도 계약 확인, 인증·첨부/외부 원문·데이터 변경·운영은 각각의 승인 범위에 둔다.
- 확인한 구조는 `bids/server.ts` → 공개 Repository → 상세 DTO/mapper → `BidDetail` → `BidDetailContent`다. 공사 로그인 전/인증 회사 로그인 후 Figma의 세 날짜 라벨과 현행 표시를 대조한다. 배포 이력·OpenAPI·실행 식별자·실제 응답을 구별하고, 날짜 결측과 참석 의무를 같은 의미로 취급하는 위험을 점검한다. Figma 표기와 기본 원천 의미를 연결할 때 남는 제품 결정은 제안으로 표시한다.
- 편집 대상은 이 작업 기록, [WBS](../README.md), [상세 QA](../../../qa/bid-detail.md)와 DEV-14 검토 기록이다. 성공 기준은 재개 조건별 확인·미확인, 상태별 날짜 관찰, 기존 사례 보존, WBS 다음 후보 근거를 기록하고 문서 링크·ID·선행·상태·기준선·diff 검사와 두 리뷰를 통과하는 것이다. 제품 착수 Gate와 기록 검증의 판정은 각각 남긴다.

### 진행 체크포인트

| 시각 | 확인한 내용 | 다음 행동 |
| --- | --- | --- |
| 14:01 KST | 백엔드 `dev`와 `main`에 날짜 변경이 들어 있다. 개발 Swagger HTTP 200과 OpenAPI SHA-256의 `dev` 고정 소스 일치를 확인했다. Figma 두 공사 상태에서 `현장설명일`, `기준일`, `수집일` 라벨을 확인했다. | 공개 목록에서 유형·분류별 표본을 확보해 상세 날짜 필드와 응답 식별자 유무를 대조한다. |
| 14:03~14:05 KST | `ALL` 42행과 `view`를 생략한 공고 단위 최신 게시순 첫 100행 중 추가 98행의 상세를 확인했다. 140건의 현장설명 일시와 기본 원천 수집 시각이 모두 `null`이었다. | 근거별 잔여 조건과 화면 검토 제안을 기록하고 문서 검증과 리뷰를 수행한다. |
| 14:08 KST | Markdown 4개와 비식별 응답 집계를 검증했다. WBS 114개·선행 156개·원본 79개와 기존 Task·QA 이력을 확인했다. | 독립 verifier 및 ai-review로 변경 범위와 증거를 확인하고, 최종 검토한 diff를 전달한다. |

### 근거별 확인 결과

| 근거 | 확인 결과 |
| --- | --- |
| 소유 소스 | 날짜 변경 `e942bb0`가 백엔드 `dev` `f4860fd9b87329d50169eb0025dca3f2c5fa2125`와 `main` `4b5f31de578c41e698dda9c99e66149b7292f031`에 반영됐다. 중앙 정책 `c9e50ff591ae18023164e1a94581c611bf1e4f29`는 긴 자연어 자격사항을 공개 상세 미제공으로 정의한다. [날짜 변경](https://github.com/mate-pjt/mate-backend/commit/e942bb0d5b022436054e5d3bf85434af339006d6) · [중앙 공개 상세](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/api/bid-notices.md#공개-상세에-없는-자격사항) |
| 배포 이력 | 09:08 KST 백엔드 `f4860fd`의 최신 테스트 배포 `8072722595` 성공을 재확인했다. 워크플로의 불변 이미지 게시·테스트 배포 단계가 성공했다. [배포 job](https://github.com/mate-pjt/mate-backend/actions/runs/45723770088/job/139596909303) |
| 게시 OpenAPI | 개발 Swagger와 JSON HTTP 200. OpenAPI `3.1.0/v1`, SHA-256 `9711e22b705d79ded53428d1a0ba157bae2894a46999a83899d8324fc4459ea4`가 `dev`의 사용자 명세 파일과 같다. `GET /api/v1/bid-notices/{id}`의 선택 `bidClsfcNo`, nullable `date-time` 세 필드, `isSiteExplanationRequired`와 별도 원천 여부를 확인했다. [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs) · [고정 명세](https://github.com/mate-pjt/mate-backend/blob/f4860fd9b87329d50169eb0025dca3f2c5fa2125/mate-api/src/main/resources/swagger-readonly/app.json) |
| 실행 버전 | 개발 호스트의 `GET /actuator/info`·`GET /actuator/health/readiness`는 HTTP 404였다. 공개 목록·상세의 확인 대상 버전 헤더는 없었다. 실제 응답에서 날짜 계약의 동작을 관찰했으며, 그 요청을 받은 프로세스의 커밋 SHA·이미지 digest 대응은 미확인이다. |
| 실제 응답 | 비로그인 상세 140건이 HTTP 200·`isSuccess=true`였다. 공사 70·용역 69·물품 1건, 상세 scope `NOTICE` 70·`CLASSIFICATION` 70이며 선택 분류 값은 0건이었다. `siteExplanationAt=null`·`siteExplanationAvailability=UNKNOWN` 140건, `siteExplanationRequirement={value:null, availability:UNKNOWN}` 140건이었다. 실제 호환 키는 `isSiteExplanationRequired`였고 140건에서 `false`였다. 접두어 없는 키는 0건이었다. `noticeSourceVersionAt`은 `+09:00` 시각 140건, `noticeLastFetchedAt`은 `null` 140건이었다. [표본과 검증 경계](../../../qa/bid-detail.md#dev-14-20261126-date-qa) |

11월 13일 당시의 Swagger 키 불일치 관찰은 이력으로 보존한다. 11월 26일 게시 명세와 실제 표본은 `isSiteExplanationRequired`로 일치했다. 호환 키의 `false`와 원천 여부의 `UNKNOWN`이 함께 반환되므로 현행 프론트의 ‘해당 없음’ 표시에 의미 차이가 있다. `noticeSourceVersionAt`은 기본 목록 원천의 변경일 우선·등록일 대체 값이다. 11건에서 게시 시각과 wire 문자열이 달랐다. `noticeLastFetchedAt`은 같은 기본 목록 원문의 마지막 수집 시각이다. [일정과 원천 의미](https://github.com/mate-pjt/mate-backend/blob/f4860fd9b87329d50169eb0025dca3f2c5fa2125/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/bid/response/BidNoticeDetailResponse.kt#L68-L74) · [상세 매퍼](https://github.com/mate-pjt/mate-backend/blob/f4860fd9b87329d50169eb0025dca3f2c5fa2125/mate-api/src/main/java/kr/co/mate/mate_api/application/service/bid/BidNoticeQueryResultMapper.kt#L249-L264) · [일정 상태 매퍼](https://github.com/mate-pjt/mate-backend/blob/f4860fd9b87329d50169eb0025dca3f2c5fa2125/mate-api/src/main/java/kr/co/mate/mate_api/application/service/bid/BidNoticeQueryResultMapper.kt#L308-L326)

### 화면 대조와 남은 결정

| 화면 근거 | 현행 프론트 | 제품 Gate에 남은 항목 |
| --- | --- | --- |
| 공사 로그인 전 `2113:19107`과 인증 회사 로그인 후 `2181:69353`의 `현장설명일` | 자격 영역이 `isSiteExplanationRequired`의 호환 boolean을 `필요`/`해당 없음`으로 표시한다. 모델에 설명 일시와 원천 여부 상태가 없다. | 원천 여부와 일정 제공 상태를 독립으로 표시하는 안을 검토한다. `UNKNOWN`은 미확인, `NOT_PROVIDED`는 원천 일시 미제공으로 뜻이 다르며 참석 의무를 나타내지 않는다. [로그인 전](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2113-19107) · [인증 회사 로그인 후](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2181-69353) · [현장설명일](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2154-10878) |
| 두 상태의 데이터 수집안내 `기준일`·`수집일` | 일반 안내, 참조번호, 원문 링크가 있다. 모델과 DTO/mapper에 새 두 시각이 연결되지 않았다. | 시안의 두 라벨과 함께 ‘기본 공고 원천’ 범위를 안내하고 날짜·시간 정밀도와 결측 표시를 명시하는 안을 검토한다. [수집안내](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2175-69728) · [상세 컴포넌트](../../../../src/components/bids/bid-detail-content.tsx) · [프론트 매퍼](../../../../src/data/bids/detail-api-mapper.ts) |

Figma MCP에서 위 두 프레임의 레이어 라벨을 확인했다. 현행 프론트는 코드 대조이며 제품의 브라우저 검증은 미실행이다. 2026-11-13 사용자 결정은 추가 제공 추진 및 계약 선행이다. 위 표시 방향은 2026-11-26의 제안이다. 날짜만 먼저 구현할지, 용어·정밀도·결측을 어떻게 보여줄지와 현재 Figma 차이의 예외는 사용자 결정이 남아 있다. [POL-09 정책과 화면 범위](POL-09.md#pol-09-contract)

<a id="dev-14-20261126-resume-criteria"></a>

### 제품 Gate 재개 조건과 다음 행동

| 필요한 근거·결정 | 담당 역할과 첫 행동 |
| --- | --- |
| 테스트 배포와 현재 공개 요청의 실행 SHA·digest 대응 | 백엔드 배포 담당이 `api-test`의 실제 서비스 프로세스나 이미지 식별자를 성공 배포에 대응한다. |
| 실제 날짜 제공·미제공과 수집 시각이 있는 비식별 QA 자료 | 백엔드 공개 공고·수집 계약 담당이 `PROVIDED`·`NOT_PROVIDED` 및 `UNKNOWN`, 원천 여부 Y/N/미확인, 기준·수집 시각의 원천과 독립 기대값을 갖춘 공개 테스트 공고를 제공한다. 프론트 QA에서 KST/정밀도, 명시적 분류·차수, 결측을 각각 대조한다. |
| 화면 용어와 제품 범위 | 사용자가 날짜 범위 선행 여부, 두 원천 라벨의 뜻과 일시·결측 표기를 결정한다. 기존 제공 계약을 사용하되 `UNKNOWN`의 ‘해당 없음’ 표시와 날짜 대체는 피하는 안을 제안한다. |
| 원문 자격사항·지시사항 본문 | 백엔드 계약 담당의 본문 공개 범위·형식·안전한 처리·실제 응답과 정책 확인이 별도로 남았다. 공개 상세 140건 모두 `originalNotice.available=false`였다. |

지정한 날짜 재개 점검까지 수행했다. 제품 구현, mock/HTTP 대역, 제품 브라우저 검사와 전체 실제 API 통합 판정은 미실행이다. 기존 [SUPP-01~09 기준](../../../qa/bid-detail.md#pol-09-followup)과 [QA-03의 1통과·8차단](../../../qa/bid-detail.md#qa-03-20261125-detail)을 보존한다.

### 문서 검증과 인계

- [검증·두 리뷰](../reviews/DEV-14.md#dev-14-20261126-review)에 확인한 명령과 결과, Documentation Update Check, 검토 범위 및 재검토 근거를 남긴다.
- WBS 대기 17개는 모두 미충족 선행이 있고 준비 작업은 0개다. 이번 응답은 DEV-14 날짜 범위의 근거다. 다른 차단·보류 사례의 재선정에 필요한 새 자원이나 승인 근거를 확인하지 못했다. WBS의 다음 작업은 `다음 작업 없음`이다. 새 근거가 오면 위 재개 표의 담당별 첫 행동부터 대조한다. [선정 기준](../workflow.md#next-task-selection)
- 이번 사용자의 Git 전달 승인으로 검증·리뷰를 마친 문서를 목적별 커밋으로 전달한다. 최종 head·원격 검사·리뷰·일반 병합 기록은 [이번 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fdev-14-date-readiness-check)에서 확인한다. 월간 한도 예외는 이번 head의 해당 원인과 저장소 병합 조건을 확인했을 때만 적용한다.

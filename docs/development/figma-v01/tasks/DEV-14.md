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

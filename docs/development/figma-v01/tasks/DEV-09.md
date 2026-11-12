# DEV-09 · 고급 지역·업체·공동도급 조건 연결

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: L07
- 선행 작업: [POL-07](POL-07.md)
- 목적/범위: 비활성 고급 지역 조건의 controlled 값/콜백/조회·복수 선택을 확정 범위에서 연결한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### L07 · 지역 업체·공동도급 등 고급 지역 조건
- 기준선: UI **비활성**, 동작 **미연결**, 데이터 **모델 일부 지원**. 검증: 코드 대조.
- 남은 점: advancedDisabled 해제에 필요한 제어값·콜백·조회 계약 연결
- Figma: [2080:64254](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2080-64254) / [2080:64609](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2080-64609)
- 소유 소스/기존 기록: [src/components/bids/bid-filter-toolbar.tsx:86](../../../../src/components/bids/bid-filter-toolbar.tsx)、[src/data/personal-filters/contracts.ts:4](../../../../src/data/personal-filters/contracts.ts)

- 이어갈 QA 기록: [bid-list.md](../../../qa/bid-list.md). 기존 case ID와 통과/대기/차단 기록을 보존한다.

## 완료 기준

- [ ] 복수 선택·지역 업체/공동도급 조합·해제·URL/reload를 확인한다
- [ ] 조회/개인 저장·비지원 조합·키보드·모바일을 검증한다
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

<a id="dev-09-pol-07-handoff"></a>

## 2026-11-09 · POL-07 정책 인계 · 구현 미착수

- 근거: [승인 D1/D2 및 D3 직접 조사 요청](POL-07.md#pol-07-decisions)·[정책 v1](POL-07.md#pol-07-contract)·[공통 Gate](POL-07.md#pol-07-handoff). 현재/다음/상태는 WBS만 관리한다.
- 범위: 공개 ALL/CLOSING_SOON/RESULT의 지역 code·시도/시군구·지역 업체만·공동도급을 기존 URL/Repository 패턴으로 연결한다. ALL에서만 명시적 개인 저장을 제공한다. 계정 회사 값 자동 반영·recommended·날짜/금액·낙찰금액·회사 import·reset Major 수정은 이 Task에 섞지 않는다.
- 선행 설계: 현재 HTTP DTO의 `parentCode/depth`가 mapper의 공개 옵션에서 사라진다. 기존 metadata로 관계를 보존하고 코드/표시 라벨을 분리한다. 새 endpoint나 라벨/코드 자릿수 기반 하위 지역 추정은 하지 않는다.
- 추가 완료 기준: 지역0+regionOnly 오류/지역 해제 시 flag 해제, 최대50 code/활성 reference·다중 선택/왕복, NO_ROWS와 미확인/실패 차이, 공동도급 REQUIRED/AVAILABLE 배타·지역 없이 공동도급, 조건 AND/지역 OR·서버 canonical count/page·정렬, URL 적용의 계정 무쓰기·명시 저장/계정 교체·401/409, 모바일/키보드를 검증한다. [ADV-01~04/12](../../../qa/bid-list.md#pol-07-advanced-qa)·[ADVP](../../../qa/personal-bid-filter.md#pol-07-advanced-personal-qa)를 보완한다.
- 배포 확인: POL-07에서 관련 OpenAPI3.1.0/v1 schema와 GitHub test 배포 success/dev SHA 대응을 확보했다. 실행 프로세스 SHA 직접 증명·합성 경계 공고/disposable 계정/사용·변경·잔존·복구/안전한 오류 준비는 미확인이다. 사용자 미준비 답변이나 로컬 구현 선행 예외가 있는 것으로 기록하지 않는다.
- 재개 첫 행동: 최신 main/Git·POL-07 마지막 체크포인트와 source/OpenAPI/배포 drift를 재확인하고, 지역 공고·계정/오류/복구 자원을 읽기 전용 점검해 자체 Brief를 제시한다. 미확보가 확인되면 구체적인 차단 조건을 기록한다. 이 정책 Task에서 구현/실제 API 저장·QA는 실행하지 않았다.

## 2026-11-11 · QA-17 전수 점검 보완

- 근거: [감사 CF-12](../audits/2026-11-11.md#cf-12) · [route/API·출처 인덱스](../audits/2026-11-11.json).
- 범위/소유: mock은 regionCodes에서 unrestricted를 구분하지 않고 AVAILABLE에서 REQUIRED를 배제하지 않는다. 이 고급 지역 Task의 구현/검증 범위에 포함한다.
- 추가 완료/재개 기준: POL-07 v1의 NO_ROWS/known/unknown·광역/시군구·regionOnly·일반/의무 공동도급을 나누고 AVAILABLE이 의무를 제외하는 음성 assertion을 추가한다. 공개 검색/view는 DEV-65, 관련공고는 DEV-61.
- 이 절은 날짜별 후속 계획이다. 앞선 결정/QA/예외 이력을 대체하지 않으며 제품 구현·실제 업무 API 변경/새 통합 PASS는 없다. 상태는 WBS에서만 관리한다.


<a id="dev-09-dev-62-handoff"></a>

## 2026-11-12 · DEV-62 이후 선정/인계

- DEV-62 종료에서 작업 정의/선행/자원 조건만 읽고 다음 Gate 후보로 선정했다. 남은 P0 실제 QA/약관·취합과 P1 차단/선행 미충족을 유지하며, P2 표 순서상 첫 후보·POL-07 선행 완료를 근거로 삼았다. 현재/다음/상태는 WBS만 소유한다.
- 다음 첫 행동: 새 대화에서 최신 main/Git·이 Task의 마지막 체크포인트·POL-07 승인 D1/D2와 D3 조사/미확인 조건, 현행 지역 metadata/URL/Repository·backend source/개발 OpenAPI를 대조하고 합성 공고/계정·안전한 오류/복구·실행 대응의 준비/승인을 확인해 자체 Brief를 제시한다. 미확보가 확인되면 구체적 차단·재개 조건을 기록한다.
- 이번 인계로 준비/승인을 확정하지 않는다. DEV-09 source/API/Figma 상세 조사·최종 문구/정책·Implementation Brief/설계·구현·검증·실제 API 저장·Git 전달은 미착수다. DEV-62의 Git/Chromatic 예외나 로컬 mock/HTTP 검증을 다음 Task·기존 실제 QA의 면제로 확대하지 않는다.

<a id="dev-09-investigation"></a>

## 2026-11-12 · 요구사항 Gate 사전 조사

- 시작: `main`/`origin/main`=`f9bf26c32f7d0e7db4743798595f8b0269bc094b`, 작업트리 clean. `git fetch origin` 후 동일 SHA와 POL-07의 main 반영(`8d3a2ec`, PR #49)을 확인했다. 기존 DEV-09 브랜치/미커밋 변경은 없었고 `feat/dev-09-advanced-region`을 생성했다. 선행·무관한 변경 혼입 없음.
- 이번 사용자 승인: DEV-09 하나의 검증/리뷰/목적별 commit/push/PR/CI·조건 충족 시 정상 병합과 로컬 main fast-forward. 이번 PR의 Chromatic 월간 한도만 예외이며 보호 우회/검사 강제 성공·실제 업무 변경/운영·배포·다른 Task 실행 승인으로 해석하지 않는다.
- 적용: AGENTS·feature-workflow/ai-review/context-audit·workflow/task-cycle·base/plan/architecture/data-access/harness와 관련 실패 예방 규칙. POL-07 D1/D2의 제품 범위를 유지하고 D3를 로컬 선행 예외로 바꾸지 않는다.
- 현행 frontend: `PlaceCategoryPopover`의 시군구/지역Only/공동도급이 toolbar에서 비활성이고 단일 라벨만 전달한다. DTO에는 `parentCode/depth`가 있으나 공개 `regionOptions`에서 누락된다. personal URL은 ALL에서만 읽고, 공개 closing/result는 기존 단일 지역만 사용한다. mock은 prefix 지역 비교와 AVAILABLE의 REQUIRED 미배제라는 CF-12 차이가 남아 있다. 계정 수동 적용/저장·version/계정 수명은 DEV-55 후속 패턴을 유지한다.
- 현재 backend: dev=`4c328d4a943eaa5dcbb0e8d9596b22389d154988`, main=`c32e3f1d5e53b01294045b28adda0ec13d1f068b`. 고정 dev의 [지역 조건](https://github.com/mate-pjt/mate-backend/blob/4c328d4a943eaa5dcbb0e8d9596b22389d154988/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/bid/restriction/BidNoticeRegionEligibilityConditionBuilder.kt), [지역 metadata](https://github.com/mate-pjt/mate-backend/blob/4c328d4a943eaa5dcbb0e8d9596b22389d154988/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/bid/region/RegionMetadataQueryController.kt), [개인 domain](https://github.com/mate-pjt/mate-backend/blob/4c328d4a943eaa5dcbb0e8d9596b22389d154988/mate-api/src/main/java/kr/co/mate/mate_api/domain/bid/personalfilter/PersonalBidNoticeFilter.kt), [분류 행 조건](https://github.com/mate-pjt/mate-backend/blob/4c328d4a943eaa5dcbb0e8d9596b22389d154988/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/bid/publiclist/PublicBidNoticeListRowQuerySpecFactory.kt)을 확인했다. 지역50/코드20자·지역0+only 오류·관계 기반 일치·NO_ROWS·AVAILABLE의 의무 제외는 POL-07과 대응한다.
- 배포/실응답 구분: [test 배포 #7711367994](https://api.github.com/repos/mate-pjt/mate-backend/deployments/7711367994)는 위 dev SHA·2026-11-11 22:30:51 KST success. 2026-11-12 개발 [OpenAPI](https://api-test.mate-bid.com/v3/api-docs)는 브라우저 접근 가능(OpenAPI3.1.0/v1), 지역·공동 enum/개인 저장 필드·metadata schema 대응. 공개 `/api/v1/regions`만 GET200/isSuccess/296개를 확인했다. 실행 프로세스 SHA 직접 증명·공고 경계 결과/개인 저장/401/409 통합 실행은 하지 않았다.
- 범위 밖 계약 drift: 현재 목록 schema에 `successfulBidAmountMin/Max`가 추가돼 있다. DEV-12 후보의 후속 조사 입력일 뿐 DEV-09에서 활성화하거나 과거 POL-07 당시 관찰을 덮어쓰지 않는다.
- Figma: figma/figma-design-to-code 스킬로 `2080:64254`의 기본/시도선택/전체/지역Only와 `2080:64609` 기본 상태의 구조·screenshot을 확인했다. 기존 380×400·padding24·간격16/24·공동3버튼·선택 tag·하단 초기화/저장과 tokens/Select/Checkbox/FilterTag를 대조했다. 승인된 복수 지역/지역 없이 공동도급 동작과 명시적 화면 예외 승인은 구분한다. 다른 화면 전체의 시각 PASS를 주장하지 않는다.
- 실제 QA Gate 미확인: disposable 계정 별칭/초기 snapshot·version, 기대값이 있는 지역 경계 공고, 안전한401/409·오류 해제, 사용/저장 변경/빈 SAVED 잔존/종료·복구 담당/방법과 실행 대응. 계정·비밀값을 읽거나 요청하지 않았다. 사용자에게 이번 DEV-09만 로컬 구현/mock·HTTP대역·브라우저를 먼저 진행하고 실제 통합을 차단 보존하는 추천안 또는 준비 자원/범위 제시를 질문했다. 응답 전 제품 설계/편집하지 않는다.
- 실행 환경: shell 기본 Node26.5.0, pnpm11.3.0. 검증 시 `.nvmrc`의 설치된 Node22.20.0을 PATH로 지정한다. `.env*`는 읽지 않았다.
- [context-audit](../reviews/DEV-09-context.md): 범위 내 공통 문서/구조 중 Major 없음. 기존 Repository 개발 가이드 fixture 생성 시점 설명 Minor를 별도 식별했다.
- 다음 첫 행동: Gate 답변 확인 → Brief/수정 파일·영향·검증 제시 → 사용자 확정 범위에서 실행. 제품/업무 mutation0건, 자동 수정0/3. 이 사전 조사 자체가 개발/실제 API 통합 PASS는 아니다.

<a id="dev-09-gate-handoff"></a>

## 2026-11-12 · Gate 조사 문서화 Brief·재개/전달 경계

- Task 유형은 개발이며 제품 요구사항은 POL-07 v1의 공개3view 지역/지역 업체/공동도급·ALL 명시 저장과 CF-12 교정이다. 이번에 달성한 단위는 현행 근거 조사·미확인 Gate 기록이며 제품 Implementation Brief/설계 완료나 기능 PASS가 아니다. 원래 완료 체크리스트는 미체크로 보존한다.
- 문서화 성공 기준: 현재 Git/선행·소스 commit/배포 기록/OpenAPI/공개 metadata 응답/Figma 상태를 구분하고, 미확인 자원·승인·재개 역할/다음 행동을 재현 가능하게 남긴다. 기존79원본/114Task/155의존성·QA/정책/예외를 보존하고 링크/ID/상태/범위/Markdown·diff 검사와 두 문서 리뷰를 수행한다.
- in scope: 이 기록·WBS·plan의 날짜별 진입점·목록/개인필터 QA 추가 기록·DEV-10 선정 인계·검토 보고서. out of scope: `src/`, tests, package/config/lockfile/하네스·기준선/coverage·중앙/백엔드 수정·실제 계정 로그인/저장·오류 유발·서비스/배포·다음 Task 실행. 새 라이브러리 없음.
- 수정 영향/단계: 기존 문서 뒤에 당시 조사·미확인/차단을 추가 → WBS의 DEV-09와 다음 후보/집계만 일치 → 문서 검사 → ai-review와 read-only verifier → 작은 문서 커밋/PR·실제 head CI·정상 merge/main fast-forward. Git 전달은 이미 사용자 요청6항으로 승인됐으며 반복 확인하지 않는다.
- non-blocking 가정: WBS의 표 순서와 POL-07의 명시된 독립성을 따라 DEV-10을 다음 Gate 후보로만 인계한다. 제품 동작/정책/API/실제 QA 예외를 가정하지 않는다.

| 재개에 필요한 것 | 현재 확인 | 필요한 담당 역할·다음 행동 |
| --- | --- | --- |
| 제품 계약·지역 metadata | 현재 고정 dev source·OpenAPI3.1.0/v1·metadata GET200/296개 | 프론트 실행자: 재개 시 drift 재확인 후 Brief/파일·영향·검증 제시 |
| 실제 실행 대응·합성 경계 공고 | GitHub test 배포 success/SHA는 확인, 실행 process SHA·예상 행/count/page 자료 미확인 | 백엔드 배포/fixture 담당: 실행 대응과 known/NO_ROWS/UNKNOWN/실패·계층/공동도급 기대값 제공. 개인 배정 미확인 |
| 개인 저장·계정 수명·안전한401/409 | 계정 별칭·초기 snapshot/version·사용/저장/잔존/종료·복구·오류 해제 범위 미확인 | 개발자 변경 승인자/fixture 담당·프론트 QA 실행자: 비밀값 없이 자원 별칭/허용 범위·복구 방법을 특정 |
| 이번 DEV-09 로컬 선행 예외 | 추천안을 질문했으나 응답 없음. 경과 시간은 승인 아님 | 사용자: 로컬 구현/mock·HTTP 대역·브라우저를 먼저 진행하고 실제 통합을 차단 보존할지 결정. 확인 전 제품 편집 없음 |

- 실제 사례: ADV-01~04/12의 지역 부분과 ADVP-01/02/04의 지역 저장/오류 부분은 실행0·신규 통과0이다. metadata의 실제 GET 성공을 목록/저장 사례 PASS로 세지 않는다. DEV-63의 로컬 reset 교정과 QA-10/POL-02 실제 차단은 그대로다.
- Documentation Update Check: plan에는 조사 진입점만 추가한다. base(패키지/scripts/런타임 불변), architecture/data-access(코드/규칙 불변), harness(흐름 불변), ai-failures(새 실패 근거 없음)는 수정하지 않는다. context-audit의 기존 Repository 가이드 Minor는 이번 문서 조사 범위 밖으로 보존하며 교정 완료로 표시하지 않는다. coverage/원본 기준선과 과거 Task/QA 본문을 덮어쓰지 않는다.
- 앱 `pnpm test/lint/build/build-storybook`·제품 브라우저/HTTP 대역은 미실행: 실행 소스·패키지/설정·UI 변경이 없고 제품 Gate 전이다. 문서 검사와 원격 최종 head CI는 별개로 기록한다. 자동 수정0/3.
- 다음 후보: DEV-10(P2, POL-07 완료, DEV-09는 코드 선행 아님). 사용자 요청의 선정/인계만 수행한다. 다음 첫 행동은 [DEV-10 인계](DEV-10.md#dev-10-dev-09-handoff)이며 실제 시작하지 않는다. DEV-09의 자원/Gate 답변이 오면 이 브랜치와 체크포인트에서 먼저 반영한다.
- 두 리뷰·정확한 커밋/PR/head/CI·병합/main SHA는 [검토 기록](../reviews/DEV-09.md)·PR/외부 receipt·최종 보고로 확인한다. 문서 전달 성공은 개발/실제 통합 완료와 별개다.

### 문서 검증 후 체크포인트

- 변경8문서에 대해 `python3 /tmp/mate-dev09-20261112/validate_docs.py` PASS: 로컬 링크460·깨진파일/anchor0·79원본/114Task/155의존성·WBS 집계·활성0·기준선/coverage·Task prefix/기존 QA 내용·Markdown/범위 보존. `git diff --check` PASS. 실행 코드가 없어 앱 scripts/제품 브라우저·HTTP 대역은 미실행이며 Git 원격 CI와 구분한다.
- primary ai-review는 문서 전달 범위 PASS·원 Task 제품/실제 QA 차단을 구분해 여섯 섹션을 남겼다. 독립 verifier와 종료 기록 freshness 확인을 이어간다. 문서 결과 추가 뒤 같은 문서 검사와 두 리뷰를 다시 확인한다. Gate 답변은 여전히 미확인이고 시간 경과를 승인으로 세지 않는다.

<a id="dev-09-document-close"></a>

### 문서 Review Gate 후 전달 체크포인트

- read-only verifier: 조사 문서 전달 범위 PASS·새 Blocker/Major 없음. 실제 diff/새 리뷰 파일·POL-07·관련 source·보존 근거5개 blob과 본문 일치·OpenAPI/296개 metadata·읽기 전용 문서 재검증을 확인했다. 기존 Repository 가이드 Minor와 제품 요구사항 미충족/실제 QA 차단은 남는다. 보고서는 [검토 기록](../reviews/DEV-09.md)에 보존한다.
- primary ai-review: 요구사항/범위·보존·구조·타입/실행 영향 없음·보안·검증/문서·다음 후보 경계를 여섯 섹션으로 재대조했다. 종료 문구/WBS 갱신 후 문서 검사·diff-check와 verifier freshness를 다시 실행한다. 최종 freshness receipt와 Git 결과는 `/tmp/mate-dev09-20261112/` 및 최종 PR/head·보고를 따른다.
- 제품 Task의 원 완료 체크리스트는 미체크이고 WBS의 차단을 유지한다. 이번 로컬 선행 예외 질문에 답변이 오기 전 제품 편집/실제 업무 요청은 하지 않는다. 앱/업무 mutation·메일/문서 처리·서비스/배포0건. 자동 수정0/3.
- 전달할 문서8개를 계약/QA 근거, WBS/다음 인계, 리뷰 근거라는 목적별 작은 한국어 Conventional Commits로 분리한다. 이번 PR의 실제 최종 head CI/리뷰·main 변화/병합 조건을 확인하고 Chromatic 월간 한도 원인만 승인된 예외로 표시한다. 정상 merge commit으로 작은 이력을 보존한 뒤 로컬 main을 fast-forward하고 SHA/clean을 확인한다.

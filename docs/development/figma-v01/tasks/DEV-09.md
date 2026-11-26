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

<a id="dev-09-ui-cleanup-brief"></a>

## 2026-11-12 · 후속 사용자 교정: 저장 보조 UI 제거 Brief

- 사용자 요청: Figma에 없는 `내 맞춤에 저장` 버튼과 자동 저장/빈 SAVED/저장값 없음 안내를 제거하는 방향으로 교정했다. 이 대화의 단일 실행 요구사항은 저장 보조 UI 정리이며 L07 고급 지역 연결·다음 DEV-10은 시작하지 않는다. 과거 POL-29의 저장 보조행 예외와 DEV-55 구현 기록은 당시 이력으로 보존하고 이번 UI 결정이 해당 부분을 대체한다.
- 시작 Git: clean `main`/`origin/main`=`81516e92f3ccd682bc302ef806e4aaf7dbdffd22`, 선행 조사 PR #61 반영. `fix/dev-09-filter-ui-cleanup`을 생성했다. 선행/무관 미커밋 변경 없음. 기존 DEV-09의 목적별 commit/push/PR/최종 head CI·정상 병합/main 동기화와 이번 Chromatic 한도 예외 승인을 유지한다.
- 성공 기준: ALL에서 계정 저장/계정 초기화·확인창·통상 저장 안내/성공/빈 조건 문구가 노출되지 않는다. 일반 필터·내 맞춤의 최신 GET/동등성·중복 방지·탐색 취소·계정 수명·URL/reload를 유지하고 목록의 계정 저장/reset 요청은0건이다. 빈 응답은 현재 목록 유지·일반 안내 없음, 통신 실패는 오류/명시 클릭 재시도를 유지한다. 320/390px·키보드와 실제 Next에서 확인한다.
- 범위/파일: 런타임은 `src/components/bids/bid-list-client.tsx`의 저장/초기화 보조행·전용 상태/handler·불필요 import와 통상 안내만 제거한다. DESIGN·architecture/data-access·plan·Task/WBS·기존 QA에 현재 UI 경계/검증을 동기화하고 과거 승인/검증을 덮어쓰지 않는다. 수정 후 context-audit/ai-review/read-only verifier를 수행한다. 기존 Select/Button/toolbar/token 구조 유지·새 라이브러리 없음.
- 제외/중요 경계: backend/중앙 정책·Repository/DTO/mock 저장 API와 실제 계정/DB는 변경하지 않는다. 현재 GET은 SAVED→COMPANY_DEFAULT→EMPTY_DEFAULT를 반환하므로 이번 UI 제거가 회사 전용 조회를 보장하지 않는다. 기존 개인값을 임의 삭제/빈값으로 reset하거나 회사 데이터로 덮지 않는다. 회사 전용 정책/조회 계약은 이 UI 요구와 별개 미결이며 실제 업무 API·메일/문서 처리·서비스/배포는 실행하지 않는다.
- 확인 근거: Figma `2048:58606`/`2098:65429`의 구조/screenshot에 내 맞춤과 일반 필터만 있다. 고정 중앙 ADR-0014와 backend main/dev의 현재 조회/저장 계약을 직접 대조했다. 프론트 저장 버튼은 `c5953f2`에서 추가됐고 POL-29/DEV-55에서 보조행 예외로 유지됐던 경위를 확인했다. API 지원과 제품 화면 노출을 구분한다.
- 정책/구현 출처: 중앙 main `c9e50ff`의 [Accepted ADR-0014](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/decisions/ADR-0014-separate-personal-bid-filter-from-company-profile.md), backend main `c32e3f1`/dev `4c328d4`의 `PersonalBidNoticeFilterService`·`CompanyBidNoticeFilterProjector`·controller를 대조했다. 저장값이 없으면 회사 지역/활성 업종/선호 금액을 투영하고, 개인 SAVED가 있으면 우선한다. 따라서 회사 기본 조건을 받는 구조라는 사용자 설명과 회사 전용이라는 가정은 구분해야 한다. 현재 backend 배포 문서/실행 process SHA·인증 응답은 이 source 관찰과 별개다. 화면은 [Figma 원본](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2048-58606)에 맞춰 저장 보조행만 제거한다.
- 이후 재개 기준: 위 원래 완료 기준/2026-11-09 POL-07 인계의 ‘조회/개인 저장·ALL 명시 저장’은 당시 계획으로 보존한다. 이번 사용자 교정 이후에는 목록에 계정 저장 UI를 다시 연결하는 요구로 적용하지 않는다. L07 재개 시 공개 URL 적용·최신 GET 적용·계정 무쓰기 기준으로 자체 Brief를 다시 작성하고, 저장 UI 재도입이나 회사 전용 정책은 별도 명시 결정 없이는 추가하지 않는다. 다음 DEV-10의 Gate에서도 이 최신 화면 기준을 먼저 확인한다.
- 검증 계획: 환경파일 없는 mirror·Node22.20.0/pnpm11.3.0에서 `pnpm test`, `pnpm lint`, API/mock/hybrid `pnpm build`, 공유 UI 소비의 `pnpm build-storybook`, `git diff --check`. 실제 Next mock·로컬 HTTP 대역에서 비로그인/COMPANY_DEFAULT/SAVED/빈 SAVED/EMPTY_DEFAULT·최신값 변경/빈 응답/실패·중복/계정/탐색 취소·모바일/키보드·저장0을 구분해 기록한다. 실제 서버 통합은 미실행/기존 차단 유지. 문서 링크/ID·상태/원본·이력 보존도 검사한다.
- non-blocking 가정: 이번 승인 범위는 화면 정리와 전용 handler 제거다. 저장 기능이 없는 화면의 ‘계정 필터 초기화’도 함께 제거하고 목록의 ‘현재 조건 초기화’는 유지한다. 일반 성공 안내는 제거하되 실패 안내는 남긴다. 회사 전용 계약을 추정하지 않으므로 이 UI 수정의 blocking ambiguity는 없다.
- 다음 행동: 위 파일에서 계정 mutation 보조 UI를 제거하고 검증 mirror를 준비한다. 자동 수정0/3. L07의 실제 QA 자원/로컬 선행 예외 질문에 새로운 승인이 생긴 것으로 처리하지 않는다.

### 후속 UI 구현·자동 검증 체크포인트

- `bid-list-client.tsx`에서 저장/계정 초기화 보조행·확인창·전용 상태/handler/import와 통상 저장/성공/빈 응답 문구를 제거했다. 최신 GET·URL 적용·중복/취소·계정 보호와 실패 안내는 유지한다. 저장/reset Repository·기존 데이터·백엔드/중앙 정책 변경 없음.
- 환경파일 없는 `/tmp/mate-dev09-ui-cleanup-20261112/app`에서 Node22.20.0의315 tests/15files·lint·API/hybrid/mock build·Storybook build가 통과했다. 로그는 같은 외부 증거 폴더에 있다. source 자동 수정0/3.
- 실제 Next dev의 최초 Turbopack 실행은 UI 렌더 전 `build-manifest.json` ENOENT로 실패했다. 소유 프로세스를 종료하고 자체 생성 dev artifact를 보존한 뒤 설치된 Next CLI의 `--webpack` 옵션으로 재실행해200/정상 화면을 확인했다. 제품 코드/프로젝트 설정 변경 없이 검증 환경 조치1회다. 이 실패를 통과로 기록하지 않는다.
- 실제 브라우저/로컬 HTTP 대역에서 COMPANY_DEFAULT·SAVED 최신값26 적용·빈 SAVED/EMPTY_DEFAULT의 URL 유지/문구 없음·500 실패/Space 재시도·중복 GET1회·검색 중 지연 응답 무시와390/320px body overflow 없음까지 관찰했다. 실제 API 검증은 아니며 계정 전환/팝오버 키보드와 최종 쓰기0 집계·문서/두 리뷰를 이어간다.

### 후속 UI 브라우저·문서 검증 체크포인트

- [FUI-01~07](../../../qa/personal-bid-filter.md#dev-09-ui-cleanup-qa): 실제 Next API profile+loopback HTTP 대역과 production mock에서 PASS. logout 중 늦은 응답 무시·QA-B fresh 조회, 지역 미저장 draft의 Enter/Space 닫기→최신 부산26 적용·재개방/escape 초점 복귀, reload/동등성 숨김·익명 로그인 복귀/기본 mock 빈값·closing/result smoke도 확인했다. 필터 PUT/reset/import 관측0건이다.
- `/tmp/mate-dev09-ui-cleanup-20261112/browser-results.json`과 개별 요청/화면·로그에 근거를 보존했다. 테스트한 런타임1파일 SHA256=`35db65420b6a78042d41a9e41f4ac098cf77549782dda1acaa9366c2a0824161`이며 두 mirror/작업트리 byte 일치. 대역 목록1행은 query 전달만 확인하며 실제 매칭 통과가 아니다.
- 대역 부산26 라벨 누락을 발견해 소유 시험 fixture에 metadata를 보완하고 Space/재개방·reload를 재확인했다. 제품 source 수정 횟수에 포함하지 않는다. 최초 Turbopack 실패/webpack 환경 조치와 구분해 자동 source 수정0/3을 유지한다. 실제 업무 API/계정·메일·문서/서비스 변경 없음.
- Documentation Update Check: DESIGN·architecture/data-access(현재 UI/Repository 계약), plan·이 Task/WBS·QA·POL-29/DEV-55 후속 연결과 context/리뷰를 갱신한다. base/package/scripts·harness 역할/흐름은 불변이고 새 source 반복 실패 근거가 없어 ai-failures는 갱신하지 않는다. 과거 본문·기준선/coverage는 보존한다.
- [후속 ai-review](../reviews/DEV-09-ui-cleanup.md)는 여섯 섹션으로 기록했다. 링크/ID·상태/보존 검사와 read-only verifier를 이어간다. 제품 UI 교정의 PASS와 원 DEV-09 L07·실제 API QA 차단을 구분하며 다음 DEV-10은 계속 선정/인계만 유지한다.
- `python3 /tmp/mate-dev09-ui-cleanup-20261112/validate_docs.py` PASS:15파일/11문서·링크517/깨진파일·anchor0,79원본/114Task/155의존성·기준선/coverage·과거 Task prefix/QA·단일 활성/범위/Markdown·PNG 무결성 보존. `git diff --check` PASS. 검사 도구의 기존 문서 중점 기호 오탐은 새 추가분 검사로 바로잡았으며 제품 수정이 아니다. 독립 verifier는 이 근거와 실제 diff를 직접 확인한다.

<a id="dev-09-ui-cleanup-close"></a>

### 후속 UI Review Gate·종료/인계 체크포인트

- [read-only verifier](../reviews/DEV-09-ui-cleanup.md#독립-verifier) PASS:15파일/11문서·최신 링크518/원본·의존성/과거 이력 보존·실행 source 두 mirror 일치·315개 test/빌드 로그·FUI7묶음과 고정 backend Service/Projector를 독립 확인했다. 새 Blocker/Major/Minor 없음, 기존 fixture 시점 가이드 Minor는 별개다. 후속 UI 교정의 구현/로컬 QA·문서 검토 PASS이며 원 L07 구현 완료/실제 API 통합 PASS가 아니다.
- primary ai-review의 여섯 섹션을 현재 요청·실제 diff/검증/문서와 다시 대조했다. 종료 문구/WBS를 반영한 뒤 `validate_docs.py --closed`·diff-check·read-only verifier freshness를 다시 수행한다. source/테스트·검증 환경 구성은 바꾸지 않았으므로 앱 검사를 불필요하게 반복하지 않는다. 최종 freshness/검증 receipt는 `/tmp/mate-dev09-ui-cleanup-20261112/`와 최종 보고에 남긴다.
- 소유 검증 탭2개와 서버3919/3920/3921을 종료하고 해당 포트 listener 없음 확인. 합성 mock session은 탭 종료로 정리했고 실제 계정/데이터 변경·메일/문서/업무 서비스/배포는0건이다. 자동 source 수정0/3이며 최초 Turbopack 실패·대역 fixture 보완은 검증 기록에 보존했다.
- 다음은 **DEV-10 하나를 선정/인계만 유지**한다. 현재 WBS의 P0 차단13·대기3과 P1 차단7·대기3은 실제 QA/약관/정책/선행 미충족을 유지한다. DEV-10은 P2 표 순서상 다음 후보·POL-07 완료·DEV-09 코드 선행 불필요가 근거다. 다음 첫 행동은 최신 main/Git·DEV-10/POL-07과 이번 저장 UI 제거 기준·날짜 계약/URL·경계/실행 대응·실제 QA 자원과 허용 범위를 확인해 자체 Brief를 제시하는 것이다. 이번 대화에서 상세 조사·설계·구현·검증/Git 전달을 시작하지 않는다.
- Git 전달: runtime 제거, 현행 UI/데이터 접근 규칙, Task/QA/리뷰 근거를 목적별 작은 Conventional Commits(영어 type/한국어 설명)로 분리한다. 이번 명시 승인으로 push/PR·라벨·실제 최종 head CI/리뷰·main drift를 확인하고 정상 merge commit/main fast-forward를 수행한다. Chromatic 월간 한도만 이번 예외이며 실제 판정/PR/head/main SHA·clean은 실행 후 외부 receipt·PR/최종 보고로 확인한다. 사전 계획을 실제 병합 증거로 세지 않는다.

<a id="dev-09-frontend-first-20261126"></a>

## 2026-11-26 KST · L07 로컬 착수 근거

- 사용자가 실제 통합 QA를 백엔드 개발자와 별도 일정에 두기로 했다. DEV-09의 직접 선행은 완료된 POL-07이다. 지역 계층 선택·지역 업체만·공동도급의 공개 조회와 URL 연결은 현재 계약으로 로컬에서 작업할 수 있다. [L07 정책](POL-07.md#pol-07-contract) · [WBS 진행 순서](../README.md#frontend-first-20261126)
- 2026-11-26 개발 OpenAPI에서 `GET /api/v1/regions`의 `parentCode`·`depth`와 공개 목록 GET의 `regionCodes`·`regionOnly`·`jointContract`를 확인했다. 공개 지역 GET은 상위 16개와 하위 280개를 반환했다. 하위 지역 하나에 `regionOnly=true`, `jointContract=AVAILABLE`을 함께 보낸 `ALL` 요청은 `isSuccess=true`와 결과 0건을 반환했다. 포함·제외, 정렬·건수의 실제 기대값과 실행 버전 대응, 계정별 검증은 공동 일정에 남긴다. [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs)
- 착수 첫 행동은 현행 지역 옵션 mapper가 상위만 반환하는 경계와 기존 필터 URL/툴바를 확인하고 L07 로컬 범위의 Brief·검증 계획을 만드는 것이다. 저장 보조 UI 교정과 현행 계정 변경 경계를 기준으로 삼는다. [지역 옵션 mapper](../../../../src/data/bids/api-mapper.ts) · [필터 툴바](../../../../src/components/bids/bid-filter-toolbar.tsx) · [기존 UI 교정](#dev-09-ui-cleanup-close)

<a id="dev-09-l07-brief"></a>

## 2026-11-26 KST · L07 구현 Brief와 시작 체크포인트

- 작업 유형은 개발이며 원본은 L07이다. 시작은 `main`과 `origin/main`이 같은 `f4bdba71d29a96e3ed70fd7c285f421632a85246`이고 작업트리는 clean이었다. POL-07 PR #49, DEV-09 조사 PR #61과 UI 교정 PR #62, DEV-03 PR #145가 반영됐다. 이전 DEV-09 브랜치는 조사와 UI 교정을 각 PR에서 마쳤으므로 최신 main에서 `feat/dev-09-advanced-region-filters`를 만들었다.
- 제품 근거는 11월 9일 사용자의 [POL-07 D1과 지역 정책](POL-07.md#pol-07-contract), 11월 12일 사용자의 [목록 저장 UI 교정](#dev-09-ui-cleanup-brief), 11월 26일 사용자의 [프론트 우선과 실제 통합 QA 공동 일정](../README.md#frontend-first-20261126)이다. 이번 요청에서 사용자 승인으로 단일 개발·두 리뷰와 목적별 커밋·push·PR/CI·정상 병합·로컬 main 동기화 및 이 PR의 Chromatic 월간 한도 예외를 적용한다.
- 공개 ALL·CLOSING_SOON·RESULT에서 시·도와 시·군·구 복수 선택, 지역 업체만·공동도급, 적용·초기화·태그 삭제/취소·URL 복원을 연결한다. 선택지는 `parentCode`·`depth`를 따르고 코드는 라벨과 구분한다. URL은 중복 제거한 최대 50개와 공개 GET의 불리언/enum을 사용한다. 지역 0개에서 `regionOnly=true`와 잘못된 코드·옵션은 목록 요청 전에 막는다. 마지막 지역 해제 시 종속 옵션을 해제한다. 조건 적용은 첫 페이지에 반영하고, 목록이 돌려준 행·정렬·페이지·건수를 사용한다. 날짜·금액·추천 보기의 기능 변경, 개인 저장·초기화·회사 가져오기, 실제 업무 변경·운영·배포는 이번 범위에서 제외한다.
- 비차단 구현 선택은 Figma의 시·도 탐색 다음에 ‘전체’ 또는 시·군·구를 선택하고 코드마다 태그를 붙이는 방식이다. 같은 코드 선택은 중복되지 않으며 상위와 하위를 모두 고르면 각 코드는 OR 의미를 갖는다. 공개 조건은 공개 보기 이동에 유지하고 ALL 개인 URL은 기존 문맥을 유지한다. 선택 가능한 지역은 공개 metadata로 제공하며 현재 목록의 지역 제한·참가 자격 판정은 서버가 맡는다.
- [Figma 2080:64254](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2080-64254) 기본 `2080:64253`, 시·도 `2080:64255`, 지역 전체 `2080:64485`, 전체·관내 `2080:64356`의 레이어와 캡처를 확인했다. 폭 380/높이 400·24px 패딩, 두 Select와 지역 업체만 체크박스, 공동도급 세 선택지, 태그와 초기화/저장을 재사용한다. 복수 태그, 지역 없는 공동도급, 마지막 지역 해제 및 오류 안내는 POL-07 동작에 필요한 상태다. 화면 전체에 대한 별도 예외 승인은 기록돼 있지 않다. [2080:64609](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2080-64609)는 현재 Figma 도구에서 찾지 못해 위 날짜별 관찰로만 참고한다.
- 백엔드 소유 dev `f4860fd9b87329d50169eb0025dca3f2c5fa2125`에서 [공개 요청 검증](https://github.com/mate-pjt/mate-backend/blob/f4860fd9b87329d50169eb0025dca3f2c5fa2125/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/bid/request/BidNoticeListRequest.kt), [참가가능지역 조건](https://github.com/mate-pjt/mate-backend/blob/f4860fd9b87329d50169eb0025dca3f2c5fa2125/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/bid/restriction/BidNoticeRegionEligibilityConditionBuilder.kt)과 [분류 행의 공동도급](https://github.com/mate-pjt/mate-backend/blob/f4860fd9b87329d50169eb0025dca3f2c5fa2125/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/bid/publiclist/PublicBidNoticeListRowQuerySpecFactory.kt)을 대조했다. [개발 배포 #8072722595](https://api.github.com/repos/mate-pjt/mate-backend/deployments/8072722595)는 같은 SHA의 11월 26일 09:08 KST 성공 기록이다. [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs)는 OpenAPI 3.1.0/v1이고 공개 지역 GET은 상위 16·하위 280개와 모든 하위의 유효한 상위 참조를 반환했다. 실행 중 SHA와 실제 경계 공고/계정 결과는 공동 일정의 확인 항목이다.
- 수정 순서는 `bids` 계약·옵션 mapper와 `bid-notice-filters` URL 검증 → HTTP·mock 조건 → `/bids`, 목록·툴바·기존 지역 팝오버와 Storybook → L07 회귀 검증 → 이 기록·WBS·목록/개인 QA·관련 사용 문서와 리뷰다. 위험은 URL 오류에서 넓은 조회가 일어나거나 mock이 미확인·실패를 제한 없음으로 취급하는 것이다. 실제 목록 경계의 AND·OR/계층·공동도급 분리는 합성 자료로 확인한다.
- 환경파일 없는 검증 복제본과 Node 22.20.0에서 `pnpm test`, `pnpm lint`, API/mock/hybrid `pnpm build`, `pnpm build-storybook`, `git diff --check`를 실행한다. 실제 Next와 브라우저에서 합성 mock/API HTTP 대역의 기본·복수·해제·잘못된 URL 복구·보기별 query/count/page·모바일/키보드·계정 쓰기 0건을 확인한다. 개발 서버의 ADV/ADVP 및 관련 QA 판정 이력은 유지한다. 다음 행동은 지역 metadata 모델과 URL 읽기·쓰기 경계를 연결하는 것이다.

### L07 구현 체크포인트

- 같은 브랜치와 기준 SHA에서 지역 hierarchy·URL validation·서버 공개 GET과 mock predicate, controlled 팝오버·툴바 연결을 편집했다. 기존 그룹 일곱 개와 공개 진입점, mock 공고 수와 기본 목록/홈 정렬, 개인 Repository 읽기·쓰기 동작은 유지한다. 지역 오류 시 `regionError`를 표시하고 목록 요청을 건너뛴다. 저장 버튼은 조회 URL을 적용한다.
- 지역 mock 자료에 상·하위와 NO_ROWS/pending/failed, 의무/가능의 예시를 두었다. 공개 보기 전환은 공개 지역 조건을 가져가고 ALL 맞춤 URL은 다른 보기에 가져가지 않는다. 가입, 개인 필터 mutation과 실제 업무 서버 QA는 실행하지 않았다.
- 다음 행동은 Node 회귀, lint·구성별 빌드, Next mock/API 대역·hybrid의 브라우저 검증이다. 코드 자동 수정 0/3. 생성한 검증 자료는 환경파일과 분리한 작업 디렉터리에 보존한다.

<a id="dev-09-l07-verification"></a>

### L07 검증과 문서 갱신 체크포인트

| 구분 | 실행과 결과 |
| --- | --- |
| Node 자동 검증 | Node 22.20.0·pnpm 11.3.0의 `pnpm test` 45파일·1,318건 통과. 새 지역 검사는 24건이다. `pnpm lint` 통과. |
| 빌드 | API·mock·hybrid의 `pnpm build` 3개와 `pnpm build-storybook` 통과. mock Preview 빌드의 운영 실행을 기존 guard가 거부했다. Storybook은 Vite chunk 크기 경고를 남겼다. |
| 격리 Chrome 158 | Next mock 23개·API loopback 대역 15개·hybrid 3개 확인 통과. 대역 공개 GET 인증 헤더 0건, 개인 GET 14건과 업무 쓰기 0건이다. 50개·URL 오류·정상 0건·503 재시도, 2개 분류의 상세 링크·페이지·총건수와 키보드/320·390px를 확인했다. |
| 개발 서버 | 소유 dev·개발 배포·게시 OpenAPI와 공개 지역 metadata를 확인했다. ADV-01~04/12 지역·ADVP의 실제 통합 실행 및 신규 통과는 0건이다. |
| 근거 | [공개 목록 QA](../../../qa/bid-list.md#dev-09-l07-local-qa) · [개인 QA](../../../qa/personal-bid-filter.md#dev-09-l07-personal-qa) · [Chrome 결과와 소스 지문](../../../qa/artifacts/dev-09-l07/browser-results.json) |

- 브라우저 첫 시각 확인에서 지역 Select의 공용 `justify-center`가 적용돼 화살표가 중앙으로 몰렸다. 이 팝오버의 두 Select에 기존 프로젝트의 `justify-between!` 패턴을 적용하고 그룹 간격을 시안과 맞췄다. 최종 자동 검사·세 빌드·브라우저를 다시 실행했다. 코드 수정 1/3이다. 복제본 의존성 재설치와 HTTP 대역의 보조 endpoint/Next 스트리밍 중 숨겨진 요소를 기다린 조치는 검증 환경에서 처리했다. Aside 연결 오류 뒤 격리 Chrome으로 실행했다.
- Documentation Update Check에서 architecture와 data-access의 새 지역 경계, Repository 개발 가이드의 fixture, plan·WBS·이 기록과 두 QA 문서를 갱신했다. `base.md`와 `harness.md`에는 패키지·실행/역할 변경이 없다. 신규 반복 실수 규칙이 없어 `ai-failures.md` 갱신은 필요하지 않다. 원본 79개·WBS 114개·의존성 156개와 기존 흐름을 대조했다. L07 매핑은 현행 `coverage.md`를 사용한다.
- 다음 행동은 문서 링크/앵커·상태·원본 보존과 `git diff --check`를 확인하고, [ai-review와 verifier](../reviews/DEV-09-l07.md#dev-09-l07-review)로 승인 범위와 최종 diff를 검토하는 것이다.

- 독립 verifier 1차는 열린 지역 팝오버에서 브라우저 뒤로 갔을 때 이전 공동도급 초안이 남는 Major 1건으로 FAIL이다. 실제 Chrome에서 재현했다. `BidFilterToolbar`에 브라우저 이력 이동 시 열린 지역 팝오버를 닫는 처리를 추가했다. 코드 수정 누적 2/3이다.
- 이력 이벤트 수정 뒤 `pnpm test` 1,318건·lint·세 Next 빌드·Storybook과 운영 mock guard를 다시 확인했다. 이 시점의 Chrome 42개 확인은 mock 24개·HTTP 대역 15개·hybrid 3개다. M22는 열린 초안의 뒤로/앞으로 이동과 재개방에서 현재 주소를 읽는 회귀다. 이 시점의 대역에서 목록 GET 16건의 인증 헤더 0건, 개인 GET 9건과 업무 쓰기 0건을 확인했다.

- 독립 verifier 2차에서 목록 바깥의 ‘현재 조건 초기화’에 Tab·Enter로 이동하면 `router.push`가 이전 지역 초안을 닫지 않는 Major 1건을 재현했다. `BidListClient`에서 현재 목록 query를 넘기고 `BidFilterToolbar`는 지역 팝오버를 연 주소와 현재 주소가 다를 때 닫도록 바꿨다. 코드 수정 누적 3/3이다. M22와 키보드 전체 조건 초기화 M23, 자동 검사·문서·두 리뷰를 새 diff에서 확인한다.
- 마지막 수정 뒤 `pnpm test` 1,318건·lint·세 Next 빌드·Storybook·운영 mock guard를 다시 확인했다. Chrome 43개 확인은 mock 25개·HTTP 대역 15개·hybrid 3개며 M22와 M23을 모두 통과했다. 대역 목록 GET 18건의 인증 헤더 0건, 개인 GET 11건과 업무 쓰기 0건을 확인했다. [최종 브라우저와 소스 지문](../../../qa/artifacts/dev-09-l07/browser-results.json)

<a id="dev-09-l07-close"></a>

### L07 로컬 완료와 Git 전달 범위

- [x] 공개 세 보기의 지역 계층·복수 선택·지역 업체만·공동도급·적용과 URL 복원을 확인했다.
- [x] 구형 URL, 50개와 잘못된 조합, mock과 HTTP 대역의 조회·서버 페이지·계정 무쓰기, 키보드 및 모바일을 확인했다.
- [x] 최종 소스 자동 검사·Documentation Update Check·independent verifier와 ai-review를 통과했다. 최초 두 독립 리뷰의 Major와 수정 뒤 회귀를 보존한다. [최종 소스 검토](../reviews/DEV-09-l07.md#dev-09-l07-final-source-review)
- [ ] 개발 서버의 ADV-01~04/12 지역·ADVP 통합은 공동 일정에서 실행한다. 실행 대응, 합성 공고와 두 계정, 기대값 및 승인된 오류·복구 조건이 필요하다. 기존 사례의 결과와 이전 승인 이력을 따르며 이번 실제 통합 실행·신규 통과는 각 0건이다.

격리 Chrome 세 세션과 3937~3942의 소유 검증 프로세스를 정리했다. 문서의 종료·인계 변경은 링크/원본·상태·diff 검사와 두 리뷰의 최종 확인을 거친다. 현재 요청의 Git 전달은 `feat/dev-09-advanced-region-filters`의 최종 head·리뷰·검사를 확인해 정상 merge commit으로 진행한다. Chromatic 월간 한도에 관한 이번 승인만 적용한다. 전달 결과는 [이 브랜치의 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afeat%2Fdev-09-advanced-region-filters)과 최종 Git 확인에서 추적한다.

다음 작업 없음. WBS 대기 16개는 선행 미충족이고 준비는 0개다. 프론트 우선 후보의 버전 출처·표시 기준·신호와 자원·날짜 표본 또는 본문 계약에 재개할 새 근거를 확보하면 WBS의 우선순위와 해당 Task의 직접 선행을 다시 대조한다. 이번에는 다른 Task의 요구사항 Gate나 구현을 시작하지 않았다. [후보 순서](../README.md#frontend-first-20261126) · [인계 규칙](../workflow.md#next-task-selection)

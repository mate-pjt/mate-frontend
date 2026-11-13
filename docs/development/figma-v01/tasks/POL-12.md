# POL-12 · 회사 갱신·비교 적용·직접 수정 정책

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 정책 결정
- 원본 항목: U01, U02, U03, F04
- 선행 작업: [POL-06](POL-06.md)
- 목적/범위: 자료 연도/최신 여부·자동 수집/사용자 편집 우선순위·권한·버전 충돌·이미지 변경 계약을 확정한다. 추천: 비교 후 선택 적용하며 기존 값을 자동 덮어쓰지 않는다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### U01 · 최근/연도별 회사 정보 갱신 안내
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **프론트 계약 없음**. 검증: 코드 대조.
- 남은 점: 해 바뀜·최신/이전 데이터 상태와 갱신 진입을 구현
- Figma: [3134:66829](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3134-66829) / [3135:68266](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-68266)
- 소유 소스/기존 기록: [src/components/my/my-company-client.tsx:252](../../../../src/components/my/my-company-client.tsx)、[docs/qa/my-company.md:8](../../../../docs/qa/my-company.md)

### U02 · 최신 정보 불러오기·변경 비교/선택 적용
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **프론트 계약 없음**. 검증: 코드 대조.
- 남은 점: 조회 대기·최신정보 유지·선택 반영·충돌/권한 처리
- Figma: [3135:68996](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-68996) / [3135:71126](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-71126) / [3135:71288](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-71288)
- 소유 소스/기존 기록: [src/data/company/contracts.ts:193](../../../../src/data/company/contracts.ts)、[src/components/my/my-company-client.tsx:252](../../../../src/components/my/my-company-client.tsx)

### U03 · 회사 정보 직접 편집·프로필 변경
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **프론트 계약 없음**. 검증: 코드 대조.
- 남은 점: 업종·주소 등 편집/오류/저장, 이미지 변경 권한과 계약
- Figma: [3135:69008](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-69008) / [3135:69602](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-69602) / [3135:70640](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-70640)
- 소유 소스/기존 기록: [src/components/my/my-company-client.tsx:252](../../../../src/components/my/my-company-client.tsx)、[src/data/company/contracts.ts:193](../../../../src/data/company/contracts.ts)

### F04 · 서류 기반 실적·회사정보 반영
- 기준선: UI **가입 기반 일부**, 동작 **가입 후 흐름 없음**, 데이터 **등록 proposal 기반 있음**. 검증: 코드 대조.
- 남은 점: OCR 결과를 회사 갱신/직접 수정과 연결
- Figma: [3135:75991](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75991) / [3135:78459](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-78459) / [3135:81589](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-81589)
- 소유 소스/기존 기록: [src/data/company/contracts.ts:219](../../../../src/data/company/contracts.ts)、[src/components/auth/company-registration.tsx:69](../../../../src/components/auth/company-registration.tsx)

## 완료 기준

- [x] 최신 fetch/비교/선택 적용과 직접 편집·로고 각각의 계약을 확인한다
- [x] 자료 출처/기준일·null/삭제·읽기 전용 역할·동시 변경 결과를 확정한다
- [x] 원문/소유 소스·버전·결정자·시각·선택/보류 이유를 기록한다. 추천안은 승인으로 간주하지 않는다.
- [x] 근거 있는 기존 승인 또는 필요한 개발자 결정을 확보하고, 후속 개발의 범위/완료 기준/차단을 갱신한다. 정책 작업도 Review Gate를 수행한다.

## 착수 전 Implementation Brief / 설계 Gate

2026-10-27 후보 정의와 11/13 조사·설명 요청 이력은 보존한다. 이번 사용자 D1/D2/D3 확정 뒤 [현재 Brief](#pol-12-brief)를 편집 전에 제시했다. 후속 DEV의 구현 Brief·배포/실제 QA 승인을 대신하지 않는다.

## 결정 기록

| 날짜 | 질문/선택지와 추천 | 결정·근거·승인자/원문 | 영향 |
| --- | --- | --- | --- |
| 2026-10-27 | 작업 후보 분해 | 정책·API·제품 동작 신규 승인 없음 | 착수 시 Gate 수행 |

## 체크포인트 · 재개 메모

| 시각/실행자 | 환경·branch/HEAD·작업트리 | 수행/결과·근거 | 다음 행동·차단/재개 조건 |
| --- | --- | --- | --- |
| 2026-10-27 / 문서화 | feature/my-company-overview / f84af24b5f9d + 기존 미커밋 변경 | 보고서에서 작업 정의만 생성. 구현/실제 QA 미실행 | 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다. |

## 검증·리뷰·인계 기록 · 2026-10-27 후보 정의

| 구분 | 실행 명령/사례·환경 | 결과 | 증거/미실행 이유 |
| --- | --- | --- | --- |
| 2026-10-27 후보 정의 | 미실행 | 미판정 | 당시 관찰 보존. 이번 결과는 아래 날짜별 기록에서 구분 |

- 자동 수정 시도: 0/3. 실패 시 명령·오류·원인·최소 수정·재검증 결과를 추가한다.
- Documentation Update Check: 착수 후 판단. base/architecture/data-access/plan/harness/ai-failures 중 영향 문서와 갱신/미갱신 이유를 기록.
- Review Gate: 미실행. verifier와 ai-review의 결과/대상 diff·후속 변경 재검토 여부를 기록.
- 커밋/PR: 없음. 추후 커밋할 때 하나의 목적·영어 type/한국어 메시지, 런타임/테스트/문서는 가능한 별도 커밋.
- 다음 작업 인계: WBS에서 선택. 이 단위의 필수 검증 PASS 전에 다른 기능으로 자동 전환하지 않는다.


<a id="pol-12-dev-16-handoff"></a>

## 2026-11-13 · DEV-16 종료 후 선정/인계

- 선정 근거: WBS의 해소 가능한 P0/P1 대기는0이며, POL-06 완료·P2 기본 표 순서 첫 정책 후보다. 기존 DEV-08/실제 회사 QA·후속 DEV-17~21/26의 차단·선행을 해소한 것으로 간주하지 않는다.
- 다음 첫 행동: 최신 Git/main과 이 Task 정의/완료 기준·POL-06 결정·관련 QA를 확인한 뒤 현행 소유 정책/source·개발 Swagger의 갱신 fetch/비교·선택 적용/직접 편집/로고, 권한/충돌·출처/기준일/null/삭제를 대조하고 자체 정책 Brief/검증 계획을 제시한다. 추천 ‘비교 후 선택 적용·자동 덮어쓰기 없음’은 아직 확정 정책이 아니다.
- 이번에는 선정/인계만 수행했다. POL-12의 신규 조사·정책 선택·설계·구현·업무 API/검증·Git 전달을 시작하지 않았다. 상태의 단일 소유자는 WBS다.

<a id="pol-12-investigation"></a>

## 2026-11-13 · 요구사항 Gate 조사 체크포인트

- 시작 기준: clean `main` / `f16056c2c6206307e2330f60fd6e650edc1e22a6`. `git fetch origin main` 후 로컬/원격 동일·POL-06 관련 문서 commit의 main 포함을 확인하고 FF 확인 뒤 `docs/pol-12-company-update-policy`를 생성했다. 선행/무관 미커밋 변경은 없었다.
- 이번 승인: 사용자 요청의 POL-12 정책 조사·결정/후속 기준 문서, 검증·read-only verifier/ai-review, 목적별 commit/push·PR/최종 CI·정상 main 병합/로컬 FF. 이번 Chromatic 월간 한도만 예외다. 제품 구현·업무 API mutation/메일·문서 처리·운영/배포·중앙 저장소 편집·다음 Task 실행은 제외한다.
- 적용: AGENTS·feature-workflow·ai-review·read-only context-audit, 현행 base/plan/architecture/data-access/harness와 관련 ai-failures, package/PR template·POL-06/관련 회사 QA·U01~03/F04 기준선·현행 소유 source를 선별 확인했다.
- 소유 근거: 중앙 main `c9e50ff591ae18023164e1a94581c611bf1e4f29`, backend dev `befe434c2b3fd80ddbc12c1d6216f738dd5ea12a`. 로컬 source-contract.json의34파일 Git blob 일치. 개발 OpenAPI GET200·3.1.0/v1·184paths, backend run43170618340 success를 각각 확인했다. 실행 중 서버 SHA·실제 업무 응답/통합은 미확인/미실행이다.
- 확인: 비동기 enrichment run·현재값/변경 제안·원자 ACCEPT/REJECT·leaf권한·일부 수기 수정이 존재한다. 전화번호 수정/평가 삭제는 기대 버전 조건이 없고, 일반 법적 기본정보/업종 직접 수정·로고·가입 후 OCR의 기존 회사 선택 반영은 관리 계약 보완이 필요하다. 원 Task의 프론트 계약 없음은 당시 관찰이며 backend API 전체 부재를 뜻하지 않는다.
- Figma: 지정11개 frame과 비교 popup metadata를 확인했다. 사용자 설명 요청 후 비교 popup 기본/첫 항목 선택·해 바뀜 배너 하위 노드3개의 screenshot을 추가 확인했다. 디자인 예시 신원 필드는 보관하지 않고 필요한 비식별 문구/상태만 증거화한다. 첫 frame metadata 전체 도구 출력에 불필요한 디자인 예시 필드가 포함된 수행 오류는 예방 기록에 남긴다. 이전 출력이 삭제됐다고 주장하지 않는다.
- 사용자 답변 D2 원문: “`지원 범위 분리/공백은 계약 선행`으로 해주고, 백엔드 API에서는 어떤 api의 어떤 필드가 부족한지 쉽고 자세하게 설명해줘.” API별 기존 필드·기대 버전/정밀도·법적 기본정보/로고/OCR 공백을 설명했다.
- D1/D3는 최초 답변이 설명 요청이어서 아직 승인으로 세지 않는다. Figma의 무선택/선택 팝업·연도 배너와 구체 예시를 보여드린 뒤 같은 두 결정을 다시 질문했다. 답변 전에는 정책 확정/후속 제품 설계로 넘어가지 않는다.
- 편집 범위: 이 절은 승인/관찰/미결과 재개 위치 기록만 추가한다. 정책 문서 후보는 본 Task·WBS·DEV-17~21/26 인계·회사 QA·plan·reviews/POL-12와 수행 오류의 ai-failures다. 코드/패키지/하네스/기준선/coverage는 바꾸지 않는다.
- 다음 첫 행동: D1/D3 답변 후 자체 Implementation Brief와 파일/영향/단계·문서 대체 검증 계획을 편집 전에 제시한다. 실제 앱/업무 API·파일/OCR 처리0건, 다음 Task 미착수.


<a id="pol-12-brief"></a>

## 2026-11-13 · 사용자 결정 이후 Implementation Brief

- 요구사항: U01/U02/U03/F04의 갱신·선택 반영·직접 수정·이미지/OCR 경계를 현행 소유 계약과 비교해 소스 정책 v1 및 후속 개발의 완료/재개 기준을 기록한다. 정책 작업 하나이며 제품 구현은 하지 않는다.
- 성공 기준: 사용자 결정·고정 source/Figma 상태·개발 OpenAPI와 현재 frontend 차이를 연결하고, 권한·출처/시점·null/삭제·동시 변경·계약 공백을 구체화한다. DEV-17~21/26의 범위와 QA 계획을 인계하고 문서 검사/두 리뷰를 통과한다. 기존 실제 QA/차단/예외는 보존한다.
- 승인자/시각: 이 대화 사용자 / 2026-11-13 KST. D2는 첫 답변에서, D1/D3는 Figma screenshot·예시/API 설명 후 재질문 답변에서 확정했다. 단순 설명 요청을 정책 승인으로 세지 않았다.
- in scope / 수정13파일: 본 Task, WBS, DEV-17/18/19/20/21/26, POL-13의 다음 선정 인계, 회사 QA 계획, plan 날짜별 링크, reviews/POL-12, 반복 출력 사건의 ai-failures. 각각 정책/후속 기준·검증 근거·실행 상태/인계를 담당한다.
- out scope: 제품/DTO/mock/자동 테스트·패키지/설정/라이브러리, 중앙 문서/백엔드 변경, 실제 로그인/회사 조회·수집/수정/로고 업로드/OCR·업무 API mutation/메일/문서 처리·운영/배포, 다음 Task 조사/설계/구현. source/OpenAPI GET와 아래 지정 디자인 읽기만 수행했다.
- 확인한 패턴: company 공개 client/contracts→HTTP/mock 경계, 기본정보 읽기 전용 UI, 가입 document/proposal·opaque upload, POL-06 v1과 DEV-08 실제 leaf·수치/provenance·실제 QA Gate, 기존 MCO/CDASH/가입 QA. 7개 source/snapshot·자동 fallback 금지·계정별 storage·법적 정보/등록 인증 경계를 유지한다.
- 단계: D1~D3/근거 기록 → 정책·API 공백/후속 완료 기준·QA 계획 → 문서 검증/정합성 감사 → ai-review/독립 verifier → 종료 WBS·다음 하나 인계 후 검증/리뷰 freshness → 목적별 commit·push/PR/라벨·최종 head CI/정상 merge·main FF.
- 검증: 로컬 `validate_docs.py`의 링크/anchor·원본79개·Task114/의존156·DAG/단일 활성/상태·무관112행·기준선/coverage5파일·기존 QA/결정 prefix·범위 보존, source34개 Git blob, `git diff --check`. Markdown13파일 전용이므로 로컬 `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm build-storybook`·앱/브라우저·mock/HTTP 대역·실제 통합은 미실행한다. 원격 CI는 별도 확인한다. shell Node26.5.0/pnpm11.3.0, .nvmrc/CI Node22.20.0.
- 가정/위험: 현재 API 존재는 실행 SHA/실응답 증거가 아니다. 계약 공백을 임의 endpoint/DTO나 Figma 예외로 메우지 않는다. D3의 구체적 배너 노출/해제 조건은 확인 가능한 자료/계약을 조사하는 DEV-17 자체 Gate에서 확정하며, 이번 정책은 최신성 추정 금지와 Figma 배너/버튼 유지까지다. 새로운 제품 문구·배치·화면 예외를 승인받은 것으로 세지 않는다.

### 승인 원문과 선택 이유

| 결정 | 승인 원문·확정 근거 | 선택/보류 이유·경계 |
| --- | --- | --- |
| D1 | 사용자: “Figma의 선택 업데이트 흐름으로 확정 (추천)” | 처음 무선택, 체크한 항목만 반영·나머지/닫기는 보존. Figma의 닫기/업데이트하기를 유지하며 새 거절 버튼은 추가하지 않음 |
| D2 | 사용자: “`지원 범위 분리/공백은 계약 선행`으로 해주고, 백엔드 API에서는 어떤 api의 어떤 필드가 부족한지 쉽고 자세하게 설명해줘.” | 기존 시공능력 생성/버전 수정·인증 버전 수정 계약과 나머지 공백을 구분. 전화/평가 삭제의 동시성, 법적 기본정보/업종·로고/OCR 관리 계약은 먼저 보완 |
| D3 | 사용자: “Figma 유지·자료 기준 분리로 확정 (추천)” | 해 바뀜 배너/버튼 유지. 연도 변경·처리 완료만으로 최신 확보 성공을 단정하지 않으며 구체 노출/해제는 DEV-17 자체 Gate |

<a id="pol-12-sources"></a>

## 소유 근거와 확인 수준

- frontend 시작/현재 제품 source: `f16056c2c6206307e2330f60fd6e650edc1e22a6`. 기존 미커밋 없음; 이번 변경은 Markdown뿐이다.
- 중앙 main: `c9e50ff591ae18023164e1a94581c611bf1e4f29`; backend dev: `befe434c2b3fd80ddbc12c1d6216f738dd5ea12a`. [source34개 snapshot](/Users/jisung/.codex/visualizations/2026/11/13/01a1d3df-d6dc-7381-ac07-ba024b2566f1/pol-12/source-contract.json)의 path/ref/blob/content를34/34 재계산했다.
- [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs): 2026-11-13 KST GET200, OpenAPI3.1.0/info.version v1,184paths. [관련 명세 snapshot](/Users/jisung/.codex/visualizations/2026/11/13/01a1d3df-d6dc-7381-ac07-ba024b2566f1/pol-12/openapi-contract.json)은 해당 path/선별 schema만 포함한다. examples/인증·업무 응답을 증거로 저장하지 않았다.
- [backend CI/배포 run43170618340](https://github.com/mate-pjt/mate-backend/actions/runs/43170618340): 위 dev SHA의 success 기록을 현재 확인했다. 당시 게시/배포 기록이며 현재 실행 프로세스 SHA 직접 증명·권한별 실제 업무 응답/통합 PASS는 미확인이다.
- Figma는 아래11개 지정 frame의 metadata와 비교 popup 기본/선택·연도 배너 하위 노드3개 screenshot을 읽었다. 이 관찰 시점의 상태 근거이며 파일 불변 revision/모든 하위 상태·픽셀 전수 검증은 아니다. 디자인 수정은 하지 않았다.

| 영역 | 고정 소유 원문·확인한 의미 |
| --- | --- |
| 회사/법적 정보·권한 | [중앙 프로필](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/company/overview-and-profile.md), [권한](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/company/permissions.md): 관측/확정값·법적 증명서와 수기값·leaf 구분 |
| 수집/상태 | [Controller](https://github.com/mate-pjt/mate-backend/blob/befe434c2b3fd80ddbc12c1d6216f738dd5ea12a/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companyprofile/CompanyProfileEnrichmentRunController.kt), [Service](https://github.com/mate-pjt/mate-backend/blob/befe434c2b3fd80ddbc12c1d6216f738dd5ea12a/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companyprofile/enrichment/CompanyProfileEnrichmentRunService.kt), [완료 정책](https://github.com/mate-pjt/mate-backend/blob/befe434c2b3fd80ddbc12c1d6216f738dd5ea12a/mate-api/src/main/java/kr/co/mate/mate_api/domain/companyprofile/CompanyProfileEnrichmentPolicy.kt): 멱등 run/3단계·terminal 완료는 전체 성공과 다름 |
| 비교/결정 | [Controller](https://github.com/mate-pjt/mate-backend/blob/befe434c2b3fd80ddbc12c1d6216f738dd5ea12a/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companyprofile/CompanyProfileProposalController.kt), [응답](https://github.com/mate-pjt/mate-backend/blob/befe434c2b3fd80ddbc12c1d6216f738dd5ea12a/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companyprofile/response/CompanyProfileProposalResponses.kt), [결정 transaction](https://github.com/mate-pjt/mate-backend/blob/befe434c2b3fd80ddbc12c1d6216f738dd5ea12a/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companyprofile/proposal/CompanyProfileProposalDecisionTransactionService.kt): before/after/current·item version/target version·원자 batch/409 |
| 초기 반영/이후 변경 | [능력 reconciliation](https://github.com/mate-pjt/mate-backend/blob/befe434c2b3fd80ddbc12c1d6216f738dd5ea12a/mate-api/src/main/java/kr/co/mate/mate_api/domain/companyprofile/projection/CompanyProfileCapabilityReconciliationPolicy.kt), [인증 reconciliation](https://github.com/mate-pjt/mate-backend/blob/befe434c2b3fd80ddbc12c1d6216f738dd5ea12a/mate-api/src/main/java/kr/co/mate/mate_api/domain/companyprofile/projection/CompanyProfileCertificationReconciliationPolicy.kt): family가 완전히 비었을 때 초기 반영, 이후 차이는 제안·같은 값은 provenance 보강 |
| 직접 수정 | [Manual Controller](https://github.com/mate-pjt/mate-backend/blob/befe434c2b3fd80ddbc12c1d6216f738dd5ea12a/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companyprofile/CompanyProfileManualController.kt), [입력](https://github.com/mate-pjt/mate-backend/blob/befe434c2b3fd80ddbc12c1d6216f738dd5ea12a/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companyprofile/request/CompanyProfileManualRequests.kt), [연락처 service](https://github.com/mate-pjt/mate-backend/blob/befe434c2b3fd80ddbc12c1d6216f738dd5ea12a/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companyprofile/contact/CompanyContactInformationUpdateService.kt): 지원 필드·nullable·버전 있음/없음 구분 |
| 문서/가입 경계 | [문서함 조회](https://github.com/mate-pjt/mate-backend/blob/befe434c2b3fd80ddbc12c1d6216f738dd5ea12a/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companydocument/CompanyDocumentBoxController.kt), [가입 제안 조회](https://github.com/mate-pjt/mate-backend/blob/befe434c2b3fd80ddbc12c1d6216f738dd5ea12a/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companyregistration/CompanyRegistrationProposalController.kt): 목록/등록용 API 존재와 기존 회사 프로필 적용은 별개 |

### Figma 상태별 대응

| 원본/상태 | 읽은 frame/하위 screenshot | 후속 소유·기능 차이 |
| --- | --- | --- |
| U01 해 바뀜 | [3134:66829](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3134-66829), [3135:68266](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-68266); 배너3134:67899 screenshot | DEV-17. 배너/최신 정보 불러오기 유지. 노출/해제 조건은 자체 Gate·자료 연도와 기관 최신성은 별개 |
| U02 로딩/비교/선택 | [3135:68996](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-68996), [3135:71126](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-71126), [3135:71288](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-71288); popup3135:71287/71449 screenshot | DEV-18/19. 처음 무선택·선택행만 적용, 닫기/미선택 보존. 서버 비교의 업종/세부 공종·3상태/provenance를 단일 예시값으로 축약하지 않음 |
| U03 직접 편집/로고 | [3135:69008](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-69008), [3135:69602](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-69602), [3135:70640](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-70640) | DEV-20/21. 금액/인증 입력과 JPG/PNG·최대5MB 안내 확인. 계약 공백/기능 분리는 해당 전체 화면을 Figma 예외 승인한 뜻이 아님 |
| F04 문서 회사정보/실적/수정 | [3135:75991](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75991), [3135:78459](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-78459), [3135:81589](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-81589) | DEV-26, 문서 생명주기 POL-13/DEV-24. 가입 제안을 기존 회사 자동 반영으로 재사용하지 않음 |

<a id="pol-12-contract"></a>

## 회사 갱신·직접 수정 소스 정책 v1 · 2026-11-13

| 항목 | 확정 정책/현재 계약과 한계 |
| --- | --- |
| 조회·수집·반영 분리 | 현재 회사 GET은 저장값 조회다. 명시 버튼의 `POST /api/v1/companies/{companyId}/profile-enrichment-runs`는 외부/적재 원천의3단계 보강을 요청하며202와 run을 반환한다. 수집 요청을 변경안 승인이나 모든 자료 최신화 성공으로 표시하지 않는다 |
| 중복/재개 | 수집 생성에는 UUID `Idempotency-Key`가 필수다. 같은 계정 key의 같은 회사 요청은 기존 run을 반환하고 다른 회사 재사용은409다. 회사에 active run이 있으면 공유한다. 응답 유실 때 새 key로 자동 재실행하지 않고 기존 key/run으로 상태를 확인한다. runId는 회사/계정 문맥과 함께 관리하고 다른 문맥에 재사용하지 않는다 |
| 진행·결과 | `GET …/profile-enrichment-runs/{runId}`로 확인한다. PENDING/RUNNING/COMPLETED/CANCELLED와 각 step의 SUCCESS/NO_DATA/일시실패·재시도/identity 불일치·영구실패 등을 분리한다. completedSteps는 terminal 수이므로3/3 또는 COMPLETED만으로 전부 성공을 선언하지 않는다. 기존 저장값은 수집 실패로 지우지 않는다 |
| 기준 시점/연도 | POL-06의 assessmentYear·snapshotDate·confirmedAt·실적 period/observedAt 구분을 유지한다. run.startedAt/completedAt·proposal.detectedAt을 기관 자료 기준일로 바꾸지 않는다. G2B는 서버 적재 보고서 기준이며 버튼 클릭 시 기관의 실시간 최신 보고서를 직접 내려받는 보장이 없다. null 연도/기준일은 미확인으로 남긴다 |
| 해 바뀜/최신성 | Figma 배너·‘최신 정보 불러오기’ 유지. 해 바뀜은 확인을 권유하는 계기이며 자동 POST/자동 연도 상승/값 삭제를 유발하지 않는다. 예: 2026년에도 마지막 확인 자료가2025년이면 평가연도2025 유지. 차이0건·run 완료로 ‘실시간 최신’을 보장하지 않는다. 노출/해제의 구체 조건과 필요한 source metadata는 DEV-17 자체 Gate에서 정한다 |
| 자동값 우선순위 | 중앙 정책과 기존 server의 capability/certification empty-family 초기 반영은 유지한다. family가 완전히 비었을 때의 초기값과 이미 저장된 값의 이후 변경은 다르다. 이후 차이는 제안, 같은 값은 provenance 보강이며 기존 확정값/수기값을 화면 GET/새로고침/수집 완료로 자동 덮어쓰지 않는다. 프론트가 빈 필드를 임의 채우지 않는다 |
| 비교값 | `GET …/profile-change-proposals`의 beforeValue(제안 생성 전)/afterValue(후보)/currentValue(조회 시 현재)를 구분하고 source/type/snapshotId·snapshotDate/runId·detectedAt·item status/action/version을 보존한다. source basis와 current가 다른데 단순 이전→새 값 두 칸만으로 최신 충돌을 숨기지 않는다 |
| 제안 조회 범위 | 기본 상태는 PENDING/PARTIALLY_DECIDED, 명시 status는 exact 조회다. page0부터·size1..2, totalElements/totalPages 기준으로 모든 page를 확인해야 한다. 첫 page가 전체라고 표시하거나0행을 자료 최신성 증거로 쓰지 않는다 |
| 선택/닫기 | D1: 처음 선택0, 체크한 항목만 업데이트, 닫기/취소와 미선택은 값·미결 제안을 보존한다. Figma popup에 새 거절 버튼을 추가하지 않는다. 서버 REJECT 지원은 사실로 기록하되 미선택/닫기를 REJECT로 보내지 않는다 |
| 원자 적용 | `POST …/profile-change-proposals/{proposalId}/decisions`의 items1..100개에 itemId·ACCEPT/REJECT·expectedVersion을 보낸다. expectedVersion은 proposal item.version이며 header.version/currentTargetVersion과 다르다. 하나의 proposal 요청은 모두 검증한 뒤 한 transaction으로 결정한다. 여러 proposal/100개 초과를 전체 원자 성공처럼 다루거나 자동 분할 제출하지 않는다. 별도 UX/계약 Gate가 필요하다 |
| 동시 변경 | 이미 결정됨/버전 불일치/새 제안으로 대체/무효화/target 변경/업종 최종 상태 충돌은409 결과와 최신 proposal을 확인한다. 전체 batch 미반영을 성공으로 표시하지 않고 최신 current와 재비교·재선택하게 한다. 이전 선택/결정을 자동 재전송하지 않는다. 정상 성공 뒤 최신 GET 실패와 성공 자체는 구분한다 |
| null/제거/0 | before/after/current null은 action·typed 값과 함께 읽는다. 인증 UNKNOWN은 NO나 삭제가 아니다. REMOVE는 명시적인 변경 제안/삭제이며 수집 실패·미선택·null 표시로 추정하지 않는다. 금액0은 확인된0원, 평가연도 null은 미확인이다. 자동값/관리자 외부 승인/수기의 provenance를 유지한다 |
| 권한/읽기 전용 | 일반 조회는 COMPANY_INFORMATION_VIEW, 수집 생성/상태는 COMPANY_INFORMATION_REFRESH_REQUEST, 제안 조회/결정은 COMPANY_INFORMATION_CHANGE_REVIEW, 수기 수정은 COMPANY_INFORMATION_EDIT를 검사한다. 현재 활성 계정·해당 회사 활성 소속·합치기 접근 제한을 서버가 확인한다. role/직급/대표자명으로 허용하지 않으며 권한 없는 버튼/요청·합치기 read-only 변경을 허용하지 않는다 |
| 지원 직접 편집 | capability POST는 현재 업종ID·세부 공종명·정수 원 금액·nullable 평가연도·대표면허를 생성하며 active 중복은 충돌·inactive는 stable ID 재활성화다. capability PATCH는 amountKrw/assessmentYear/representativeLicense와 exact expectedVersion, certification PATCH는 value true/false/null과 expectedVersion(행 없음0)을 사용한다. cap의 생성/수정/삭제 전체가 버전 조건을 받는다고 표현하지 않는다 |
| 수기값 검증 | 공종명 앞뒤 trim·빈값/제어문자 금지·최대200자, 금액0..20자리 정수 원, 평가연도 null 또는1900..서버 KST 현재연도, 대표면허 boolean/null이다. 인증 value key와 expectedVersion은 필수·null은 UNKNOWN. 수기 source는 ADMIN_MANUAL이며 외부 기준일을 꾸미지 않는다. source의20자리 금액을 JSON/JS number로 반올림하지 않도록 DTO/정밀도 Gate가 선행한다 |
| 보류 직접 편집 | D2에 따라 전화번호 수정과 평가 직접 삭제는 기대 버전/동시 변경 보완 계약 전 활성화하지 않는다. 일반 법적 기본정보·주소/업종 직접 수정·로고·가입 후 OCR은 아래 관리 계약 확보가 먼저다. 현재 지원 API가 있다는 사실과 안전한 UI 활성화는 별개다 |
| 인증/법적 정보 | 회사 등록 VERIFIED와 여성/장애인/사회적기업3종은 별개다. 사업자번호·회사명·대표자·개업일·증명서 주소는 인증 증명서/등록 정책 소유이며 수기 프로필 입력으로 바꿔 인증된 값으로 승격하지 않는다. 주력업종 다중 목록·대표/부업종 미분리 정책은 유지한다 |
| 이미지 | Figma JPG/PNG·최대5MB는 디자인 요구로 보존한다. backend에서 저장/조회·업로드 완료·교체/삭제·leaf/버전/잔존 계약을 확인하기 전 DEV-21 UI/업로드를 활성화하지 않는다. 정확한 byte 한도·MIME/실제 파일 검사·크기/URL 보안·기존 파일 정리는 계약 담당이 확정할 사항이다. 가입 문서 업로드를 이미지 API로 가정하지 않는다 |
| OCR/서류 | 문서 OCR 완료는 회사 저장 완료가 아니다. documentId/version·대상 company·추출 필드/근거·적용 가능 값·권한·profile version/충돌·법적 인증 유지/실패 복구의 관리용 연결 계약이 선행한다. 문서 생명주기·삭제/다운로드는 POL-13, 업로드는 DEV-24, 기존 회사 선택 반영은 DEV-26 소유다 |
| 인증·오류·수명 | 최종401/계정·회사 교체/소속 해제/화면 종료 뒤 보호값·draft/선택·run 응답을 이전 문맥에 반영하지 않는다.403/404/잠금·네트워크/손상2xx는 빈 성공으로 바꾸지 않는다. 저장 응답 미확정은 명시 상태 확인이며 자동 mutation 재실행 금지. 같은 명령 성공 뒤 session/GET 실패는 성공·경고를 분리하고 인증 해제를 놓치지 않는다 |

<a id="pol-12-api-gaps"></a>

## API별 부족한 필드와 후속 선행 계약

아래는 현재 조사한 source·게시 명세의 공백이다. backend 전체에 기능이 불가능하다는 단정이나 새로운 endpoint/필드명 확정이 아니다. 보완 요청의 소유 역할은 backend API/정책 담당이며 개인·접수/일정은 미확인이다. 이번 외부 요청 발송/수정0건이다.

| 현행 API/영역 | 있는 계약 | 부족한 계약·쉽게 말한 영향 / 재개 근거 |
| --- | --- | --- |
| PATCH …/contact-information | body telephoneNumber(nullable), 응답 telephoneNumber/updatedAt. trim·빈문자→null·최대30자 | 기대 버전/조건부 변경 검사가 없다. A가 저장한 뒤 B의 오래된 화면이 덮어쓸 수 있다. 서버가 검사하는 버전 조건·반환 버전·불일치 오류/최신 조회를 확보한 뒤 전화번호 UI 활성화. 프론트의 사전 GET만으로 원자 충돌 방어를 주장하지 않음 |
| DELETE …/construction-capability-assessments/{assessmentId} | body/기대 버전 없이 해당 평가 비활성화·이력 보존,204 | 조회 뒤 다른 사람이 수정한 평가를 삭제할 수 있다. 삭제 대상 버전 조건·불일치 응답/재확인·재시도 결과를 먼저 확보. ‘전체 삭제’/물리 삭제로 해석하지 않음 |
| POST/PATCH …/construction-capability-assessments | POST industryId/assessmentSubjectName/amountKrw/assessmentYear/representativeLicense, PATCH amountKrw/assessmentYear/representativeLicense/expectedVersion | source 필수 입력/validation과 Swagger required가 일부 불일치하고 금액 number는20자리까지 가능하다. 필수/누락/null/범위·actual wrapper/409, lossless wire/DTO·경계 증거를 DEV-20 Gate에서 확인. JS 안전 범위로 임의 절삭·반올림 금지 |
| PATCH …/public-certifications/{certificationType} | type3종, value true/false/null과 expectedVersion(행 없음0), 충돌 검사 | 계약 활용 가능. missing key와 null·version0/기존version·실제 wrapper/권한/충돌·실행 대응을 DEV-20에서 검증. 인증서 업로드/법적 자격 보장으로 확대하지 않음 |
| 기본정보/업종 일반 편집 | 기본정보 GET·주력업종 배열, 수집 업종 제안 승인 경로는 있음 | 전화 외 기본정보/주력업종 직접 편집의 관리용 변경 경로·필드별 불변/조건·provenance·version/충돌을 확인하지 못함. 직접 입력과 기존 외부 업종 제안 ACCEPT를 구분. 증명서 법적 값의 보호 규칙과 실제 계약부터 확보 |
| 로고 | 이번 OpenAPI path·선별 소유 source에서 전용 관리 계약 미확인 | 이미지 식별/조회, 업로드 세션/완료, 교체·삭제, 정확 byte/MIME 검증, leaf/버전·오류, URL/잔존·기존 파일 처리·원복이 필요. Figma5MB 안내만으로 임의 API/계약을 만들지 않음 |
| 기존 회사 OCR 반영 | company-documents 업로드/버전/OCR·검증·document box GET, company-registration-proposals GET/등록 경로 있음 | OCR 추출값을 기존 회사의 허용 필드에 선택 적용하는 대상 company/doc version·profile 버전·근거·권한·충돌/법적 인증 유지 연결 계약 미확인. 가입 등록 command를 기존 회사 수정으로 재제출하지 않음 |
| 최신성/배너 | source snapshotDate/run 시각/proposal detectedAt·현재 평가연도는 각각 존재하거나 null | source별 최신 자료 식별/관측 의미·올해 자료 미발표/없음/실패 구분과 배너 노출/해제에 필요한 metadata를 DEV-17 Gate에서 확인. ‘제안 없음’ 응답만으로 최신 확인 완료로 만들지 않음 |

<a id="pol-12-handoff"></a>

## 후속 개발의 완료/재개 기준

- DEV-17/18/19/20/21/26에 이 정책·각 API 공백과 [CUPD-01~18 계획](../../../qa/my-company.md#pol-12-update-qa)을 연결했다. 이는 후속 Task 구현/검증 시작이 아니다.
- DEV-17/20/21의 DEV-08 선행 및 DEV-18→17·DEV-19→18·DEV-26→19/24 선행을 유지한다. DEV-08의 실행 대응·합성 자원/사용·잔존/복구 미준비와 **로컬 구현 선행 예외 없음**은 보존한다. 이번 정책/Git 승인으로 후속 제품 Gate를 통과시키지 않는다.
- 재개 공통: 해당 current source/게시 payload·버전/오류/권한·실행 SHA 대응, 승인된 합성 회사/계정·문서/이미지/정확 금액·버전 경쟁 자료, 수집/변경/잔존/종료·복구 범위/담당을 먼저 확보한다. 로컬 mock/HTTP 대역과 실제 업무 API는 별도 판정한다.
- 남은 계약은 위 표·후속 기록에 소유 역할/필요 증거를 남겼으며 backend 요청 발송/접수·일정이나 신규 사용자 Figma 화면 예외를 추정하지 않는다. F04의 가입 증거/기존 QA-06/07 미실행을 회사 갱신 PASS로 바꾸지 않는다.
- 다음 후보는 POL-13이다. P0/P1의 해소 가능한 대기0, P2 앞선 DEV들은 위 선행/계약 때문에 실행 후보가 아니며 POL-13의 DOC-001 선행은 충족됐다. 선정/인계만 하고 그 Task의 계약 조사·정책 선택은 새 대화에서 시작한다.

## 2026-11-13 · 정책 기록 후 체크포인트

- 17:00 KST / Codex: branch/HEAD 동일, 기존 dirty는 이 Task 조사 기록1개뿐임을 확인했다. D1/D3 재질문 답변으로 남은 정책 Gate를 해소했고, 위 Brief·13파일/영향·단계/위험·문서 대체 검증을 편집 전에 제시했다. D2 승인과 API별 공백 설명을 함께 반영한다.
- 예비 독립 verifier는 조사 근거/설명의 사실검증 범위에서 PASS·문제0였다. 최종13파일의 Review Gate PASS를 대신하지 않는다. 최종 문서/검증 결과를 준비한 뒤 ai-review와 verifier를 다시 수행한다.
- 실제 앱/회사 업무 API·문서/이미지/OCR 처리·중앙 repo 편집0건. 다음 Task 미착수. 자동 수정 시도0/3; 문서 checker 파서 준비와 브라우저 REPL 조회 구문의 수정은 제품/검증 실패 수정과 구분한다.

<a id="pol-12-review-close"></a>

## 2026-11-13 · 정책 문서 검증·Review Gate와 종료 인계

| 구분 | 수행/결과·한계 |
| --- | --- |
| 정책 결정 | 사용자 D1/D2/D3 원문·현재 source/게시 명세·Figma 상태, 지원 범위/계약 선행과 후속 DEV-17~21/26 기준을 기록했다. 제품 구현 완료가 아니다 |
| 문서 검사 | `validate_docs.py` 최초14/14 PASS, 검사2개 확장 뒤14/16(검사기 정규식 이중 escaping)·checker만 수정 후16/16 PASS. source34/34·diff-check PASS. 종료13파일/상태/인계 검사는 별도 최종 결과로 확인 |
| 자동 수정 | 검증 실패 수정1/3: 표 분리/ID 정규식의 checker 파서 오류만 고쳤고 정책/제품 오류로 세지 않는다. 독립 verifier의 Minor1 ‘공백 금지’ 표현은 ‘앞뒤 trim·빈값/제어문자 금지’로 source에 맞게 교정했다 |
| Review Gate | primary ai-review 여섯 섹션·관련 context-audit PASS. 독립 verifier의 정책 산출물12파일 리뷰 PASS·Blocker/Major0·Minor1 문구 교정 반영. 종료13파일은 검사·primary 재검토 뒤 별도 독립 freshness 확인 대상으로 전달한다. 수행 전 최종 PASS를 선기록하지 않음 |
| Documentation Update Check | Task/WBS·후속6DEV·회사 QA18계획·plan·검토·출력 예방 기록과 POL-13 선정 인계를 갱신했다. package/scripts·구조/API/mock/component 규칙·하네스 변경0으로 base/architecture/data-access/harness 수정 불필요. 원본 기준선/coverage5파일·기존 결정/QA prefix·타112개 WBS행 보존 |
| 미실행 | 로컬 앱 `pnpm test`·`pnpm lint`·`pnpm build`·`pnpm build-storybook` 및 Next/브라우저/mock/HTTP 대역·실제 업무 API는 문서 전용/제품 영향0으로 미실행. CUPD18은 실제0통과·18미실행. 기존 MCO/CDASH/가입·타 Task QA 차단/예외 유지 |
| Git 전달 | 이번 사용자 요청으로 목적별 commit/push·PR·최종 head CI·정상 merge/로컬 FF 승인. 최종 PR URL/head·검사/리뷰/merge commit·main 동일 SHA/clean은 실제 PR·로컬 delivery receipt·최종 보고로 확인한다. 이번 Chromatic 월간 한도만 예외며 강제 성공/보호 우회·직접 main push 없음 |
| 다음 하나 | POL-13. P0/P1 해소 가능한 대기0, 앞선 DEV는 DEV-08 또는 미충족 개발/계약 선행을 유지하며 POL-13은 DOC-001 충족·P2 기본 표 순서의 다음 독립 정책 후보다. 선정/인계만 수행 |

- 다음 첫 행동: 새 대화에서 최신 Git/main·WBS·POL-13 정의/완료 기준·POL-12의 F04 연결과 관련 가입/회사 QA를 읽고 현재 문서함 목록/버전·유효/보관·접근/다운로드·삭제/재업로드/OCR 적용 소유 source·개발 Swagger를 대조한 뒤 자체 정책 Brief/파일/검증 계획을 편집 전에 제시한다. 다음 Task의 조사/결정/구현·업무 API/파일 처리는 이번에 실행하지 않는다.
- 종료 diff에는 이 체크리스트/WBS·POL-13 인계·Minor 교정과 검토/검사 이력만 추가했다. 후속 코드/문서가 바뀌면 해당 검사·리뷰를 다시 수행한다. 최종 독립 결과는 [검토 기록](../reviews/POL-12.md)과 실제 PR/로컬 receipt를 따른다.

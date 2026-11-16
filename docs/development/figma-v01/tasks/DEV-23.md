# DEV-23 · 서류 상세·이력·다운로드

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: F02
- 선행 작업: [DEV-22](DEV-22.md)
- 목적/범위: 문서 상세/유효기간/최종 수정·버전 이력과 권한 있는 다운로드를 연결한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### F02 · 보관 서류 상세·다운로드·수정 이력
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **관리 조회/다운로드 계약 없음**. 검증: 코드 대조.
- 남은 점: 등록 문서 조회·유효기간·최종수정·다운로드 구현
- Figma: [3135:75782](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75782) / [3135:83161](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-83161)
- 소유 소스/기존 기록: [src/data/company/contracts.ts:212](../../../../src/data/company/contracts.ts)

## 완료 기준

- [x] 현재/과거 버전·수정 이력·만료·없는 문서를 확인한다
- [x] 다운로드 실패/권한·서명 정보 비노출·목록 복귀를 검증한다
- [x] 현재 package scripts로 필요한 test/lint/build·diff-check와 영향 시 Storybook 검증을 통과한다.
- [x] 요구사항 Gate에서 정한 실제 API/브라우저·권한·오류 사례와 필요한 QA case를 검증한다. 외부 조건으로 못 하면 차단/미실행과 이미 승인된 예외를 기록하며 전체 기능 통합 PASS로 표시하지 않는다.
- [x] Documentation Update Check 및 verifier/ai-review를 통과한다. 구현만 마친 상태는 완료가 아니다.

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

- 자동 수정 시도: 1/3(lint ref 명명/unused type 최소 교정, 아래 실제 로그). 실패 시 명령·오류·원인·최소 수정·재검증 결과를 추가한다.
- Documentation Update Check: 착수 후 판단. base/architecture/data-access/plan/harness/ai-failures 중 영향 문서와 갱신/미갱신 이유를 기록.
- Review Gate: 미실행. verifier와 ai-review의 결과/대상 diff·후속 변경 재검토 여부를 기록.
- 커밋/PR: 없음. 추후 커밋할 때 하나의 목적·영어 type/한국어 메시지, 런타임/테스트/문서는 가능한 별도 커밋.
- 다음 작업 인계: WBS에서 선택. 이 단위의 필수 검증 PASS 전에 다른 기능으로 자동 전환하지 않는다.

<a id="dev-23-pol-13-handoff"></a>

## 2026-11-16 · POL-13 정책/후속 Gate 인계

- [POL-13 사용자 D1/D2/D3·v1](POL-13.md#pol-13-contract)과 [DBOX 미실행 계획](../../../qa/company-documents.md#pol-13-document-qa)을 후속 기준으로 받는다.
- DEV-22 선행 뒤 metadata(미귀속 owner/ACTIVE 소속)와 원본/추출값(문서관리 권한)의 차이를 보존한다. current/후보/과거·nullable 기간·업로드/수정 시각/표시명을 구분하고, 버전 이력을 열람/삭제 수행자까지 있는 감사 로그로 표시하지 않는다.
- 선택 version의 access-tickets PREVIEW/DOWNLOAD·exact managed object/허용 상태·2분 수명/서명 비저장·오류/목록 복귀를 연결한다. 실제 티켓 발급/합성 원본 열람은 별도 자원·실행/보존/복구 범위 확보 뒤 검증한다.
- 완료 증거는 DBOX-07~10/21~22의 권한/404/409·만료/이전 버전·계정 전환·접근성과 영향 자동/실제 검사·두 리뷰다. 기존 가입 QA를 실제 통합 PASS로 승계하지 않는다.
- 기준/인계만 수행했다. 이 Task 자체 Gate·제품/실제 API·파일/OCR/삭제·별도 Git 전달은 시작하지 않았다. 현재/다음/상태는 WBS만 관리한다.

<a id="dev-23-dev-22-handoff"></a>

## 2026-11-16 · DEV-22 로컬 종료 뒤 선정/인계

- [DEV-22 종료/선정 근거](DEV-22.md#dev-22-handoff)를 받는다. 해소 가능한 P0/P1 대기0·앞선 P2의 기존 선행/차단/보류를 유지하고, DEV-22 뒤 직접 후속 중 기본 표 순서가 앞선 이 Task를 다음 하나로 선정한다. 현재/다음/상태는 WBS만 소유한다.
- 첫 행동: 새 대화에서 최신 Git/main·POL-13 v1·이 정의/완료 기준·DEV-22 목록 route/최소 버전 모델을 확인한다. 지정 Figma 상세/이력 상태와 현행 backend GitHub/개발 Swagger의 metadata/표시명/현재·과거·기간·PREVIEW/DOWNLOAD 티켓/권한·2분 수명/서명 비저장·오류/목록 복귀를 대조하고 실행 SHA/합성 계정·파일/조회·사용/잔존·복구 범위와 자체 Brief/파일·검증 계획을 편집 전에 제시한다.
- 재사용 가능한 사실은 `/my/documents`·company 공개 목록/최소 버전 조회·현재 page 동시4·KST 기간/수명 방어와 준비 중 미리보기 slot이다. 상세 이력에 필요한 필드/선택·티켓 UI가 이미 구현됐다고 추정하지 않는다. DEV-22의 실제8차단/다른14대기와 가입/회사/DEV-08·MAT-162/DEV-24~26 계약 Gate를 유지한다.
- 이번에는 선정/인계만 했다. 이 Task 자체 Gate/전용 source·API·Figma 조사·정책 결정/설계·구현·검증/업무 요청·파일 열람·별도 Git 전달을 시작하지 않았다. DEV-22 D2 로컬 선행·Git/Chromatic 승인을 새 Task 승인으로 확대하지 않는다.

<a id="dev-23-brief"></a>

## 2026-11-16 · 요구사항 Gate와 Implementation Brief

- 시작: local/remote main `a55fdfc1140e61f6ab36627ad39a3b98fd947d8c` 일치·깨끗한 작업트리, DEV-22 PR #79 반영. 같은 Task branch/미커밋 변경 없음. `git pull --ff-only origin main` 후 `feat/dev-23-document-detail` 생성. 다른 detached worktree는 변경하지 않았다.
- 이번 승인: 사용자 요청의 DEV-23 개발/검증·read-only verifier/ai-review·목적별 commit/push·PR/최종 CI·정상 main 병합/로컬 FF. 이번 Chromatic 월간 한도 문제만 예외. 실제 업무 API/원본·파일/OCR/삭제·외부 메시지·운영/배포와 다음 Task 실행 제외. 과거 승인을 확대하지 않는다.
- 결정자/날짜: 2026-11-16 사용자 D1 **“로컬 구현·검증 선행, 실제 API QA는 차단으로 보존 (추천)”**, D2 **“기본 뷰어와 준비 중 안내로 구현 (추천)”**. 추천과 실제 답변을 구분하며 이번 Task만 적용한다. PDF 기본 뷰어의 브라우저별 툴바 차이와 최근 활동 제공 준비 중 안내는 D2의 명시적 화면 선택이다. 전체 Figma 예외 승인이 아니다.
- 요구사항/성공 기준: 선택 document/version의 파일 metadata·업로드/최종수정·nullable 기간·현재/후보/이전 버전 이력을 표시하고 exact version PREVIEW/DOWNLOAD·권한/404/409·만료/오류·목록 복귀·계정/회사/화면 수명을 연결한다. 필수 자동·실제 Next 합성 mock/HTTP·문서·두 리뷰를 통과한다. 실제 API DBOX-07~10/21~22는 차단 보존한다.
- 확인한 파일/패턴: 기존 `/my/documents`·`my-documents-client.tsx`, `features/company/document-box.ts`의 KST/상태·조회 수명, `data/company/{contracts,client,http-repository,mock-repository,document-box-api-mapper,document-box-mock}.ts`, 공개 Repository/7공급원·snapshot/hybrid/운영 guard·계정 namespace·Button/Link/토큰과 `.codex/agents/verifier.toml`을 확인했다. `data-access.md`를 API 설계 전에 읽었다.
- in scope/수정 후보: 상세 route/client·목록 링크/페이지 복귀, 같은 company Document 포트의 별도 상세 이력/원본 함수·비공개 mapper·합성 mock, 상세 선택/원본 메모리 수명 로직, 의미 있는 계약/수명 테스트, Task/WBS/QA/리뷰·영향 architecture/data-access/개발 안내/plan. 기존 최소 목록 모델과 가입용 문서 처리/opaque upload는 보존한다.
- out scope: DEV-24 추가/교체·DEV-25 삭제·DEV-26 OCR 적용, 새 backend/중앙/Linear 변경·라이브러리·실제 업무 API/파일/메일·운영/배포. MAT-162 보류와 DEV-08/가입·회사 QA/다른 Task의 계약·자원 차단을 해소하지 않는다.
- 편집 전 설계: versions GET에서 필요한 metadata만 검증/선별하고 정확히 선택한 version을 사용한다. 명시 version 누락은 다른 원본으로 대체하지 않는다. 티켓 POST와 storage GET은 HTTP 내부, credentials omit/no-store/no-referrer로 원본을 메모리 Blob으로 전달한다. URL/서명·업로더 ID·추출값을 UI 모델/storage/로그에 복사하지 않는다. 허용6상태/지원 MIME·2분 만료·크기/응답 검증, 중복/늦은 응답과 계정/회사/선택/화면 종료·만료 시 Abort/Blob URL 해제를 적용한다. 실패 뒤 자동 재발급/무한 재시도 없음.
- 화면/가정: Figma `3135:75782`/`3135:83161` design context와 두 screenshot을 확인했다. 1100px 콘텐츠/24px padding/20px 카드·26px 제목·metadata4칸·미리보기/우측 서류정보/버전기록/최근활동 배치를 기존 토큰으로 표현한다. 회사 인증으로 상태를 합성하지 않고 nullable 기간은 미확인이다. D2 외의 정책상 기능 차이와 화면 승인을 구분한다. 삭제/다시 업로드는 준비 중 비활성·후속 Toast 재생 없음, 원본은 명시 클릭 때만 요청한다.
- 위험/검증: Node22.20.0/pnpm11.3.0 `pnpm test`, `pnpm lint`, API/mock/hybrid Preview `pnpm build`, 공유 company 모델/메뉴 영향 `pnpm build-storybook`, `git diff --check`. 실제 Next/Aside에서 합성 PDF/이미지·현재/과거/실패/권한/만료/계정·회사/선택 경쟁·모바일/키보드·목록 복귀·외부요청0을 검사한다. storage GET/CORS·실제 실행 SHA/권한/원본·서명 수명은 실제 통합 차단이며 mock 성공으로 올리지 않는다. 문서 링크/ID79/114Task/156의존/DAG·baseline/과거 QA 보존·context-audit/두 리뷰·최종 head CI로 마무리한다.

<a id="dev-23-sources"></a>

### 조사 근거와 확인 수준

- backend dev `adc0e265ef0e2aa78ccb376e1fa322edd664b290`, main `4b5f31de578c41e698dda9c99e66149b7292f031`을 현재 원격에서 확인했다. [Read service](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companydocument/CompanyDocumentReadService.kt)·[persistence](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companydocument/CompanyDocumentReadPersistenceAdapter.kt)·[storage adapter](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/storage/companydocument/S3CompanyDocumentStorageAdapter.kt)·ReadUseCases를 선별 확인했다.
- [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs): Aside GET200·3.1.0/v1, 버전 상세 필드·nullable/표시명과 PREVIEW/DOWNLOAD·url/expiresAt 확인. metadata는 owner/ACTIVE 소속, 원본은 별도 문서관리 leaf·exact managed object/MIME·허용6상태다. S3 response disposition inline/attachment·private,no-store·2분 수명을 확인했으며 GET/CORS의 실제 실행 지원은 미확인이다.
- [POL-13 소스 정책](POL-13.md#pol-13-contract)의 이전 배포 run 기록·현재 source/게시 OpenAPI·현재 실행 프로세스 SHA·실제 업무 응답은 별개다. 마지막 두 근거·합성 권한 계정/파일·조회/사용/보존/복구 자원은 미확보이며 실제 업무 호출0건이다. 배포 기록을 이번 실행 통합 PASS로 승계하지 않는다.
- 초기 context-audit: package/scripts·잠금/Node pin·7그룹/public entry/하네스는 일치. WBS 요약은 완료30/대기59·DEV-22 미착수 문구, 실제 표는 완료31/대기58·DEV-22 완료여서 Minor1건이다. 이번 상태 갱신에서 실제 표와 동기화할 것을 제시했다. 감사 중 source 수정0.

### 착수 체크포인트

- `feat/dev-23-document-detail` / `a55fdfc`, 시작 dirty0. 사용자 D1/D2와 위 Brief·파일/영향/단계/위험/검증을 제품 편집 전에 제시했다. 조사→계약/원본 수명→mock/UI→자동/브라우저→문서/두 리뷰→Git 전달 순서로 진행한다. 자동 수정0/3·미검증·실제 업무0·다음 Task 미선정/미착수. 다음 첫 행동은 별도 상세 이력과 원본 공개 계약/HTTP 경계 구현이다.


## 2026-11-16 · 구현/첫 자동·브라우저 체크포인트

- 상세/이력/선택·기본 PDF/이미지 뷰어·원본 메모리 Blob·목록 page 복귀·HTTP/mock 경계를 연결했다. 신규 source/테스트와 이 Task/WBS만 변경했고 시작 dirty0을 유지한다. 원본 서명 URL/추출값·업로더 ID를 UI/storage에 복사하지 않는다.
- 첫 test614/614와 API build PASS. 첫 lint는 React ref prop의 `Ref` 접미사 요구2오류/미사용 type1경고로 실패했다. `cancelOriginalRef` 명명과 미사용 type 제거의 최소 수정1/3 뒤 lint PASS. 전송 중 티켓 만료 시 Abort/재발급0 테스트를 추가한 test615/615, API/mock/hybrid Preview build·Storybook build PASS. 이후 안내 문구2곳의 사실 정리로 source가 바뀌었으므로 최종 자동 검증을 다시 수행한다.
- 실제 Next/Aside mock: 현재 v2/PDF 기본 뷰어와 이전 v1 선택/URL·이전 원본 해제·표시명 결측을 확인했다. 앱 다운로드의 브라우저 이벤트/697bytes·선택 v1 합성 내용 일치를 확인했다. sessionStorage 서명/원문0·부모 페이지 외부resource0 관찰. PDF 기본 도구의 저장/인쇄는 이미 권한을 받아 표시한 bytes의 브라우저 기능이며, 앱의 새 원본 요청마다 별도 티켓을 검사한다. 이미 저장한 파일/브라우저 자료의 폐기 보장은 하지 않는다.
- 다음 행동: 모바일/키보드·목록 page 복귀/없는 버전·로컬 HTTP 대역의 권한/404/409/만료·GET/CORS/전송 실패·수명 확인, 최종 자동/문서/context-audit·두 리뷰. 실제 업무 API/원본·OCR/삭제0건, 실제 통합은 D1 차단 보존이다. 다음 Task 미선정/미착수.


<a id="dev-23-verification"></a>

## 2026-11-16 · 검증/Documentation Update Check

- 현재 source의 `pnpm test`615/615·lint·API/mock/hybrid Preview build·Storybook build를 확인한다. 마지막 URL 선택/탐색 수명 보완 뒤 test/lint/API/mock build는 재통과했고 hybrid 최종 재빌드·문서 검사를 이어간다. 앞선 빌드 로그로 후속 source를 통과 처리하지 않는다. production mock build와 hybrid artifact production start는 예상 guard 오류/exit1로 차단됐다. Storybook의 기존 extensionless-import/chunk-size 안내는 비차단이다.
- [DBOX-DL01~16](../../../qa/company-documents.md#dev-23-local-qa): 실제 Next/Aside mock/loopback HTTP·PDF/PNG, 선택v1 실제 다운로드 bytes·업로더/기간 결측, metadata/티켓/GET 오류·CORS/MIME·티켓 전/표시중/전송중 만료, 지연 중 선택/401/문맥 교체·비저장·모바일/키보드·page2 복귀를 확인했다. URL 선택을 단일 기준으로 변경한 뒤 v1→401→같은 version의 next를 재검증했다. 버전 선택은 exact metadata를 다시 읽고 티켓/원본은 자동 요청하지 않는다.
- 실제 통합은 D1에 따라 DBOX-07~10/21~22 **0통과·6차단/업무0**. DEV-22와 겹치는21/22를 제외한 실제 고유 집계0통과·12차단/다른10대기이며 원본22계획/DEV-22 당시8차단·후속14대기·가입/회사/DEV-08·MAT-162/타 Task 차단·승인 예외를 보존한다. 실제 실행 SHA/권한·원본/GET-CORS·합성 자원/사용/보존/복구 담당·재개 조건은 QA에 기록했다. VoiceOver 음성/다른 기기·실제 JPEG/업무 원본은 미실행이다.
- Documentation Update Check: 새 route/상세 계약/Blob 수명·mock fixture를 architecture/data-access·Repository 개발 안내에 반영하고 QA/진입점·합성 화면3장·Task/WBS/plan·검토 기록을 갱신한다. package/scripts/잠금·config/7그룹/namespace/auth/운영 guard·토큰/공통 primitive·하네스 규칙 변경0이므로 base/harness·DESIGN은 유지한다. lint ref 명명1회 교정은 반복/고위험 실패가 아니어서 ai-failures에 새 사건을 만들지 않는다. 초기 WBS 집계 Minor는 실제 표에 맞췄다. baseline/coverage·79ID/114Task/156의존·기존 QA prefix는 보존한다.
- read-only verifier 예비: source/test15파일 집계 `4d1a3fce181d1298c2d6807f1b27df0f476be8f5dfd218ad2bee067d745ccbd5`, 직접 Node22 test615/lint/diff-check PASS·미해결 Blocker/Major/Minor 없음. 작성 중인 최종 QA/문서/빌드는 이 예비 PASS의 범위 밖이며 최종 freshness를 요청한다.
- 다음 행동: 최종 hybrid build·문서 검사/context-audit와 primary ai-review 여섯 섹션·독립 verifier 최종 검토. 모두 통과한 뒤 종료/다음 하나 인계와 metadata freshness·목적별 Git 전달. 자동 제품 수정1/3·실제 업무0·다음 Task 미착수.


## 2026-11-16 · 자동/문서 검증 후 Review Gate 진입

- 최종 source의 test615/lint·API/mock/hybrid Preview/Storybook build PASS. [로컬16개](../../../qa/company-documents.md#dev-23-local-qa)와 문서35/35(9 Markdown·보호23파일)/diff-check PASS. 실제 통합6차단·고유12차단/10대기와 미실행 보조기술/기기 범위를 보존한다.
- [context-audit/primary ai-review](../reviews/DEV-23.md) 완료, 미해결 Blocker/Major/Minor 없음. 독립 verifier에게 최종 QA/문서·빌드 freshness를 요청한다. 소스 예비 검토 후 source 변경0·문서/QA만 추가했다. 최종 독립 PASS 뒤 종료/다음 인계와 필요 재검토 후 Git 전달을 진행한다.


<a id="dev-23-close"></a>

## 2026-11-16 · 로컬 단위 종료/전달 준비

- D1/D2 승인 단위: 상세/버전·metadata·명시 원본 미리보기/다운로드·수명/오류·목록 page 복귀를 구현했다. test615/lint·API/mock/hybrid/Storybook build·로컬16사례·문서35/35/diff-check·context-audit/primary ai-review 여섯 섹션과 독립 verifier 최종 PASS. verifier의 WBS 첫 행동 Minor1건은 구현 단계 문구를 현재 종료 단계로 교정했고, 아래 다음 Task 인계 후 freshness를 다시 확인한다. 코드의 미해결 Blocker/Major/Minor 없음, source/test15파일은 예비 검토 이후 동일하다.
- 체크리스트는 승인된 로컬 단위의 증거다. 실제 DBOX-07~10/21~22는0통과·6차단/업무0, 기존 두 후속의 고유12차단/다른10대기·원본22계획/DEV-22 당시 결과·가입/회사/DEV-08/MAT-162·DEV-24~26 계약 Gate/타 Task 예외·VoiceOver/다른 기기/JPEG 미실행을 유지한다. 구현 완료·문서/리뷰 PASS·실제 통합·main 반영은 각각 판단한다.
- Documentation Update Check와 최종 검토는 [검토 기록](../reviews/DEV-23.md)을 따른다. 종료/다음 인계로10 Markdown이 되면 링크/ID/의존/DAG·단일 상태·보호 파일/QA prefix·diff-check와 primary/독립 freshness를 재실행한다. 제품 source·테스트·패키지/환경/기준선 변경은 없다.
- Git 전달: 이번 요청대로 runtime→test→계약/개발 안내→QA→종료/인계의 목적별 한국어 Conventional Commits로 분리하고 branch push·PR/라벨·최종 head CI/리뷰·정상 merge commit·로컬 main FF를 수행한다. 원격 main 재확인 `a55fdfc`, merge commit 허용·main protected=false/ruleset0을 정상 API로 확인했다. force/direct-main push·보호 우회·check 강제 성공은 없다. 이번 Chromatic 월간 한도만 실제 원인을 확인해 예외로 처리한다. 실제 PR/head/CI/merge/main 일치·clean은 실제 PR/최종 보고와 로컬 delivery receipt에서 별도 확인한다.

<a id="dev-23-handoff"></a>

## 다음 하나 · DEV-24 선정/인계

- WBS에서 해소 가능한 P0/P1 대기0, 앞선 P2의 기존 DEV-08/정책·계약/실제 자원 및 선행 차단을 유지한다. DEV-22가 완료된 직접 후속 중 기본 표 순서가 앞선 **DEV-24 · 서류함 문서 추가·재업로드**를 다음 자체 Gate 후보 하나로 선정한다. DEV-25는 새로 충족된 DEV-23 선행을 보존하되 함께 시작하지 않는다. 원본 우선순위/156의존성을 새로 만들지 않는다.
- [DEV-24 인계](DEV-24.md#dev-24-dev-23-handoff)에는 정의/완료 기준·POL-13의 기존 회사 귀속/current 최종확정 계약 Gate와 첫 행동만 연결한다. 준비는 다음 요구사항 확인 대상으로 선정된 뜻이고 계약/실제 QA·제품 착수 준비 완료가 아니다.
- 첫 행동: 최신 Git/main·POL-13·기존 업로드/opaque handle/서류함·현재 backend GitHub/개발 Swagger에서 기존 회사 신규 문서 귀속·교체 최종확정/권한·상태·잔존/복구 계약과 MAT-162 보류 경계를 확인한 뒤 자체 Brief/수정 파일·검증 계획을 제시한다. 계약이 미확보면 제품 착수 전에 해당 차단/필요 결정을 기록한다. source/배포·실행 SHA/응답·합성 권한/파일·실제 실행/보존/복구 범위를 분리하고 이번 D1/D2/Git/Chromatic 승인을 승계하지 않는다.
- 이번에는 선정/인계만 수행했다. DEV-24 자체 계약/Figma 조사·정책 선택·설계/구현/검증·업무/파일·별도 Git 전달은 시작하지 않았다. 현재/다음/상태는 WBS만 관리한다.

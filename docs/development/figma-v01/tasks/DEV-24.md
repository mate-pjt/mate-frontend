# DEV-24 · 서류함 문서 추가·재업로드

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: F03, C02
- 선행 작업: [DEV-22](DEV-22.md)
- 목적/범위: 기존 업로드/버전/처리 기반을 보관함의 추가/교체 흐름에 연결한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### F03 · 보관 문서 추가·재업로드·삭제
- 기준선: UI **가입 기반 일부**, 동작 **관리 흐름 미구현**, 데이터 **업로드/버전/처리 기반 있음**. 검증: 코드 대조.
- 남은 점: 기존 업로드 기반을 보관함에 연결; 삭제·권한·충돌·오류·완료 피드백 추가
- Figma: [3135:75651](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75651) / [3135:75938](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75938) / [3135:80545](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-80545)
- 소유 소스/기존 기록: [src/data/company/contracts.ts:213](../../../../src/data/company/contracts.ts)、[src/app/auth/company/register/document/registration-client.tsx:1](../../../../src/app/auth/company/register/document/registration-client.tsx)

### C02 · 정정·비밀번호·탈퇴·업로드 공용 팝업
- 기준선: UI **컴포넌트 구현**, 동작 **일부 Storybook 전용**, 데이터 **업무 API 없음**. 검증: 코드 대조.
- 남은 점: 컴포넌트 존재를 제품 기능 완료로 세지 말 것. 실제 도메인 연결 필요
- Figma: [2210:17840](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2210-17840) / [2303:89402](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2303-89402) / [2303:90900](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2303-90900) / [2264:95335](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2264-95335)
- 소유 소스/기존 기록: [src/components/ui/popup/index.ts:1](../../../../src/components/ui/popup/index.ts)、[src/components/ui/popup/popup.stories.tsx:50](../../../../src/components/ui/popup/popup.stories.tsx)、[src/components/ui/popup/popup.tsx:353](../../../../src/components/ui/popup/popup.tsx)

## 완료 기준

- [ ] 형식/크기·업로드/OCR 대기·재시도·이전 버전·중복/계정 경쟁을 확인한다
- [ ] 성공/실패·목록/상세 갱신·opaque handle·개인정보 비저장을 검증한다
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

<a id="dev-24-pol-13-handoff"></a>

## 2026-11-16 · POL-13 정책/후속 Gate 인계

- [POL-13 사용자 D1/D2/D3·v1](POL-13.md#pol-13-contract)과 [DBOX 미실행 계획](../../../qa/company-documents.md#pol-13-document-qa)을 후속 기준으로 받는다.
- 신규 POST company-documents는 계정 소유/company_id=null이다. 기존 회사 신규 문서 귀속 command로 간주하지 않는다. versions POST·replacesVersionId·단일 후보/권한·멱등/row lock은 존재하지만 후보/PUT/OCR 완료와 current 최종 교체·프로필 저장은 별개다.
- 기존 회사의 대상 귀속/종류·최종 교체 확정·상태/권한/경쟁·실패/잔존 복구 계약 및 MAT-162 보류 영향을 확인하기 전 해당 완료 UI를 활성화하지 않는다. Backend 계약 담당과 제품/디자인이 필요한 역할이며 개인/일정·새 endpoint를 임의 확정하거나 보류 PR/가입 command를 재사용하지 않는다.
- DEV-22 선행 뒤 DBOX-11~15/21~22로 형식·1..10×1024×1024bytes·무결성, opaque handle/PUT10분/session30분·멱등 payload·응답유실·current/candidate409·계정/복구를 검증한다. 기능 축소/로컬 선행/실제 QA 면제는 이번에 승인하지 않았고 모든 API에 expectedVersion을 일괄 요구하지 않는다.
- 기준/인계만 수행했다. 이 Task 자체 Gate·제품/실제 API·파일/OCR/삭제·별도 Git 전달은 시작하지 않았다. 현재/다음/상태는 WBS만 관리한다.


<a id="dev-24-dev-23-handoff"></a>

## 2026-11-16 · DEV-23 로컬 종료 뒤 선정/인계

- [DEV-23 종료/선정](DEV-23.md#dev-23-handoff)을 받는다. DEV-22 선행 충족·해소 가능한 P0/P1 대기0·앞선 P2의 기존 차단/선행을 유지하고 기본 표 순서에 따라 다음 자체 Gate 후보로 선정했다. 상태/현재/다음은 WBS만 소유하며 준비가 계약/실제 QA·제품 착수 준비 완료를 뜻하지 않는다.
- 위 정의/완료 기준·[POL-13 인계](#dev-24-pol-13-handoff)의 기존 회사 신규 문서 귀속/current 최종확정 계약 Gate를 확인한 범위다. 원본 생성(company_id=null)/후보 업로드·OCR 완료만으로 회사 귀속/교체 완료를 선언하지 않는다. MAT-162 기획 보류·DEV-26 경계와 DBOX-11~15/21~22·기존 가입/회사 QA 차단을 유지한다.
- 다음 첫 행동: 최신 Git/main·POL-13·기존 업로드/opaque handle·목록/상세 결과를 확인하고, 그때의 backend GitHub/개발 Swagger에서 기존 회사 귀속/최종 교체·권한/상태·오류/잔존/복구 계약과 실행 SHA·합성 계정/파일·사용/보존/복구 범위를 대조한다. 자체 요구사항 Gate/Brief·수정 대상/영향/검증을 편집 전에 제시하고, 부족한 계약은 제품 착수 전에 차단/필요 결정으로 남긴다. API 존재·closed PR/기획 보류·가입 command로 완료를 추정하지 않는다.
- DEV-23의 exact 버전/명시 원본·페이지 복귀와 D1 로컬 선행/D2 기본 뷰어는 이번에 완료된 선행 결과다. 이를 DEV-24의 로컬 선행·화면/실제 API 실행·Git/Chromatic 예외 승인으로 확대하지 않는다.
- **선정/인계만 수행했다.** DEV-24 전용 source/API/Figma 조사·정책 결정·설계·구현·검증·업무 요청/파일 처리·별도 Git 전달은 시작하지 않았다.

<a id="dev-24-investigation"></a>

## 2026-11-16 · 요구사항 Gate 조사 체크포인트

- 시작 환경: `main`/`6f6b25b49926645358247d6199937d61ee72c059`, `git status --short --branch` 변경0. `git fetch origin main` 뒤 로컬/원격 SHA 일치, DEV-22/23 선행 main 반영 확인. 기존 DEV-24 branch/미커밋 작업 없음. 조사 branch `feat/dev-24-document-upload`를 같은 HEAD에서 만들었으며 무관한 변경/reset/stash 없음.
- 이번 승인: 사용자 2026-11-16 요청의 DEV-24 하나·검증/두 리뷰·목적별 commit/push·PR/최종 CI·조건 충족 시 정상 merge/로컬 main FF. 이번 Chromatic 월간 한도만 예외. 실제 업무 API/파일/OCR/외부 기관 처리·삭제·운영/배포·다음 Task 실행 승인은 포함하지 않는다. 과거 Task의 로컬 선행/실제 QA 예외를 승계하지 않는다.
- 확인한 현행 근거: backend dev `adc0e265ef0e2aa78ccb376e1fa322edd664b290`/main `4b5f31de578c41e698dda9c99e66149b7292f031`, 중앙 main `c9e50ff591ae18023164e1a94581c611bf1e4f29`. 개발 OpenAPI GET200/3.1.0/v1. [배포 run](https://github.com/mate-pjt/mate-backend/actions/runs/43389204151)은 dev SHA/completed/success. 실행process SHA/실제 업무 응답·합성 계정/파일·변경/잔존/복구 범위는 미확인, 업무 API/파일 처리0건.
- 새 소스 관찰: [초기 생성](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companydocument/CompanyDocumentUploadPersistenceAdapter.kt)은 계정 owner/`company_id=null`. 그러나 [BusinessVerificationDocumentTransitionPolicy](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/businessverification/BusinessVerificationDocumentTransitionPolicy.kt)의 `matchesVerifiedCompanyIdentity`/`applyAcceptedVersionTransition`은 **기존 회사의 attached candidate**에 대해 사업자번호·회사/identity 인증·기존 current 근거를 검사한 뒤 새 version VERIFIED·이전 current REPLACED·회사/identity 근거와 current pointer 교체/candidate 해제를 같은 transaction에서 수행한다. 전용 최종확정 endpoint가 없다는 이유로 이 지원 범위까지 계약 부재로 간주하지 않는다. 신규 회사 귀속·회사 프로필 변경과 구분하며 현재 실행/통합 PASS는 아니다.
- 제품 경계: 서류함 신규 series를 기존 회사에 연결하는 관리 계약은 확인되지 않았다. 가입 회사 등록의 미귀속 문서 연결은 별개이며 재사용을 가정하지 않는다. `documentType`은 `BUSINESS_REGISTRATION`, PDF/JPG/PNG·1..10×1024×1024bytes/PUT10분/session30분이다. MAT-162는 현재도 Backlog/기획 보류·구현 금지이고 닫힌 backend PR80은 미병합이다.
- blocking 질문: 기존 문서 재업로드만 현행 서버 전이로 로컬 선행하고 신규 추가·실제 API 통합은 차단으로 보존할지, 전체 계약 전 제품 구현을 기다릴지 사용자 결정을 요청했다. 사용자의 ‘회사 귀속 계약을 쉽게 설명’ 요청에는 합성 예시로 답했으며 **범위 결정/승인 답변으로 간주하지 않는다**. 설명용 enum 오기는 즉시 정정했다. 아직 제품 Brief/설계/편집 미착수.
- 선별 조사 증거: 로컬 `dev24-evidence/receipt.json`과 관련 Kotlin source는 이번 세션의 visualization 폴더에 저장했다. source/배포/게시 명세/실행/실제 응답을 구분한다. GitHub branch 응답의 공개 작성자 메타데이터를 선별 없이 출력한 수행 오류를 사용자에게 알렸고 이후 allowlist만 출력한다. 값을 Task/QA/PR에 재인용하지 않으며 기존 출력 삭제를 주장하지 않는다.
- 다음 행동: 사용자 답변을 기다리며 read-only context-audit/기존 구현 패턴 확인만 진행한다. 답변 후 확정 Brief·수정 파일/영향/단계/위험/검증을 편집 전에 제시한다. 최종 상태는 WBS 한 곳에서 관리한다.

<a id="dev-24-brief"></a>

## 2026-11-16 · 사용자 결정과 Implementation Brief

- 결정자/원문: 2026-11-16 사용자, 쉬운 회사 귀속/endpoint 예시 설명 후 **‘재업로드만 로컬 선행·신규 추가/실통합 차단 (추천)’** 선택. 위 질문은 이제 확정됐으며 과거 DEV-22/23의 승인을 확대 적용한 것이 아니다.
- 요구사항: 기존 회사 문서의 재업로드를 목록/상세에서 기존 업로드·OCR/진위 상태와 연결한다. 신규 series 추가·회사정보 변경/MAT-162·삭제/DEV-25·실제 서버 파일/OCR/외부 기관 처리·운영/배포·다음 Task 구현 제외.
- 성공 기준: 정확한 MIME/확장자·1..10×1024×1024bytes, 후보 생성→opaque handle PUT→completion→상태/버전 재조회. 기존 current 보존·명시 재시도/멱등 키·세션/오류·후보 경쟁/계정/화면 수명·비저장, 서버에서 해당 version의 VERIFIED/current가 확인된 뒤만 교체 완료/목록·상세 재조회. 재조회/reload·다른 후보는 자신의 성공 Toast로 재생하지 않는다.
- 확인한 파일/패턴: 공개 company client/Document 포트·HTTP descriptor/private map·회사 계정별 mock, document-box/detail/original, UploadPopup/native dialog·Sonner·기존 토큰, flow-scope/세션 epoch. 신규 library/endpoint·공급원 그룹/snapshot/guard·가입 회사 등록 흐름은 추가하거나 변경하지 않는다.
- 수정 계획: `features/company/document-reupload.ts`와 `components/my/document-reupload-dialog.tsx` 추가, 목록/상세 연결. `data/company/{contracts,client,http-repository,mock-repository}.ts`와 새 업로드/상태 mapper에 optional signal·응답 검증·안전한 재업로드 상태를 추가. `ui/popup/popup.tsx`는 기존 default를 보존한 옵션/반응형 보완. 재업로드 계약/controller·mock/HTTP 테스트, Task/QA/WBS·coverage/architecture/data-access/plan·검토 기록 갱신. 범위가 바뀌면 먼저 기록한다.
- Figma 근거: [재업로드 frame3135:75938](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75938)의 하위 [upload_popup3189:118415](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3189-118415) design context와 실제 screenshot을 확인했다.640px·24px padding/close·최근30일 안내·drop/file select·체크리스트·닫기/업로드 footer를 기존 Popup과 토큰으로 구성한다. 상태/오류/처리 안내는 현행 계약의 필요 기능이며 다른 화면 전체의 Figma 예외를 승인한 것은 아니다.
- 검증 계획: Node22.20.0/실제 scripts의 `pnpm test`, `pnpm lint`, API/mock/hybrid Preview `pnpm build`, 공유 Popup 영향의 `pnpm build-storybook`, `git diff --check`. 합성 파일의 실제 Next mock·loopback HTTP 대역 브라우저, 경계/응답 유실/중복/실패·권한/계정·현재 버전 보존·완료/비저장을 확인한다. DBOX-11~15/21~22 실제 통합은 사용자 승인대로 차단 보존하며 실행 SHA·합성 자원/변경·잔존/복구·사용 승인 뒤 별도 재개한다.
- 위험/가정: 관리 권한은 서버 leaf가 최종 판단한다. 신규 추가 계약 부재를 기존 attached replacement의 최종 전이 부재로 확대하지 않는다. MAT-162의 회사 프로필 변경을 활성화하지 않고 opaque handle·파일 원문/추출값/서명 URL을 storage/로그/문서에 저장하지 않는다. 같은 요청의 명시 재시도와 새 파일의 새 명령을 구분한다. 자동 수정 한도0/3에서 시작한다.
- 다음 행동: 승인 Brief와 위 편집 계획에 따라 재업로드만 구현한다. source/배포/명세/실행·mock/HTTP 대역/실제 통합과 Git 전달 판정은 계속 분리한다.

<a id="dev-24-verification"></a>

## 2026-11-16 · 구현/검증 체크포인트와 문서 갱신

- branch/기준 HEAD: `feat/dev-24-document-upload`/`6f6b25b49926645358247d6199937d61ee72c059`+이번 Task 변경뿐이다. 기존 미커밋 변경0/무관한 변경 혼합0·업무 API/실제 파일/OCR/기관/삭제0건.
- 구현: 안전한 `DocumentReuploadStatus`/검증된 replacement descriptor·optional signal, 순수 재업로드 controller와 native dialog/기존 UploadPopup, 목록/상세·현재 버전 URL/재조회와 Sonner1회를 연결했다. mock의 기존 current/단일 후보·키/payload/기간/계정 경계와 최종 교체를 서버 소스 의미에 맞췄다. 가입 회사 등록/새 library/7공급원·snapshot/hybrid/production guard·전역 storage schema·profile 적용/MAT-162·삭제는 변경하지 않았다.
- 자동 검증: Node22.20.0/pnpm11.3.0 `pnpm test`653/653(24파일), `pnpm lint`, API/mock/hybrid Preview `pnpm build`, `pnpm build-storybook` PASS. 실제 `.env`를 복사하지 않은 격리 snapshot에 로컬 node_modules를 clone해 빌드/Next를 실행했다. 테스트/소스 지문과 로그는 세션 `dev24-evidence`에 남긴다. 이번 실제 package scripts8개를 확인했고 type-check/format 명령을 만들지 않았다.
- 실패/교정: 첫615회귀 중3개는 기존 테스트의 미사용 네 번째 문자열 인자가 새 optional signal과 충돌한 원인이었다. 인자 제거 뒤 새 응답 유실 테스트의 spy 원본 함수 캡처를 교정해 전수652가 통과했다. 브라우저에서 숨겨진 입력의 초기 초점과 dialog unmount 전 close 순서를 교정하고 Escape 뒤 trigger 복귀를 재통과했다. PUT 주소403 갱신/session410 재선택도 별도 회귀로 확인했다. 실패에 따른 수정은 테스트2회·브라우저 초점1회인3/3이며 이후 최종 재검증은 PASS다. 세 번째 수정 뒤 계속 실패한 검사는 없다.
- 브라우저/통합: [DBOX-RL01~18](../../../qa/company-documents.md#dev-24-local-qa)에 실제 Next mock·loopback HTTP와 Node/source 증거를 구분했다. 미확정/오류·PUT 재시도·최종401/409·OCR 재시도·진행 중 닫기/회사 전환·mobile/초점·상세 새 version·storage/리소스를 검증했다. 최초 socket 단절의 wire completion2회는 Chromium 전송 재시도 관찰로 남기고, 앱 대역의 자동 재제출0/202 파손 실제 completion1회와 구별한다.
- 미실행: 신규 series 회사 귀속·실제 엔진/기관/파일/API·실행 SHA·실제 권한/두 계정·10분/30분/24시간 경계/복구와 VoiceOver/실제 기기는 차단/미실행이다. DBOX-11~15/21~22 실제0통과·7차단, 기존12와 합친 고유17차단/5대기를 보존한다. source의 문서 교체/인증 근거·시각 전이를 회사명/주소 등 프로필 반영으로 확대하지 않는다.
- Documentation Update Check: architecture/data-access/repositories에 공개 상태 모델·신호/오류·후보/current·저장소 경계, plan/coverage/QA/Task/WBS에 승인 단위/추적/남은 차단을 반영한다. base는 package/scripts/runtime 불변, harness는 규칙/역할/구성 불변이라 수정 불필요다. ai-failures에는 원격 출력/enum 설명 교정·native dialog 종료의 실제 재발/예방을 기록했다. 감사 자체는 read-only이며 확인된 사실 동기화는 이번 승인 Task의 문서 편집으로 수행했다.
- 다음 행동: 문서 링크/ID·의존성/범위/기준선·기존 QA/형식/diff-check와 context-audit, primary ai-review 여섯 섹션·read-only verifier. 통과 뒤 승인 로컬 단위 판정/원래 잔여 차단과 다음 하나를 WBS에 남기고 metadata freshness 검토 후 목적별 Git 전달한다. 다른 Task 구현은 시작하지 않는다.

- primary diff 검토 중 예방 보완: optional retryUntil의 손상 검증/회사 공간만 초기화하는 회귀와 pagehide/popstate/pageshow 복귀 시 dialog 종료 상태를 함께 비우는 수명을 보완했다. 최종653 tests·lint·3구성/Storybook build(소스256파일 snapshot 일치)와 실제 페이지 이탈/뒤로 복귀·재진입·정상 교체/reload를 재확인했다. 이전 검증을 후속 source의 PASS로 재사용하지 않았다. 소유한 두 Next/합성 API 프로세스와 브라우저 탭을 종료했고3224/3225/4324 listener0을 확인했다.

<a id="dev-24-close"></a>

## 2026-11-16 · 승인 로컬 단위 판정·잔여와 다음 하나

- D1 로컬 단위 **PASS**: 기존 회사 서류 재업로드/명시 처리 재시도·오류/미확정/계정·회사/탐색/만료 수명·후보/current·목록/상세 URL/Toast·opaque handle/비저장을 구현/검증했다. test653/24파일·lint·API/mock/hybrid/Storybook build·로컬18사례·최종 문서56검사/context-audit·primary ai-review 여섯 섹션과 독립 verifier 모두 PASS, 미해결 Blocker/Major/Minor 없음.
- 원래 DEV-24 전체와 구분: 신규 series의 기존 회사 귀속/실패 잔존/복구 계약과 실제7사례·실행 SHA/합성 자원·권한/기관/파일/시간/복구는 차단을 유지한다. 원래 신규 추가를 완료로 세지 않아 WBS의 Task 전체는 차단이며 로컬 재업로드 단위만 전달한다. MAT-162·회사 프로필 적용/삭제·운영/배포는 이번에 수행하지 않았다. 담당은 Backend 계약/실행, 제품/디자인, QA 자원/사용·잔존·복구 역할이며 개인/일정은 미확인이다. 재개 때 최신 소스/명세/실행/자원·승인과 신규 귀속 계약을 확보하고 자체 Gate에서 남은 범위를 정한다.
- 다음은 [DEV-25 하나](DEV-25.md#dev-25-dev-24-handoff)다. WBS 우선순위/기본 순서와 DEV-23 선행 충족을 확인해 선정했고 앞선 정책/자원·DEV-08/DEV-19 및 기존 차단을 유지했다. DEV-25의 삭제 확인/명령/완료·오류/계정/목록·원본·잔여/복구 기준을 다음 자체 Gate에서 확인한다. **선정/인계만** 했고 구현·전용 조사/실제 삭제는 시작하지 않았다.
- Git 전달은 이번 사용자 최초 요청으로 승인됐다. 목적별 작은 commit/push·PR 템플릿/type 라벨·실제 최종 head CI/리뷰·정상 merge/로컬 main FF를 진행하며 이번 Chromatic 월간 한도만 예외다. 실제 결과는 최종 PR/종료 보고와 이 세션 `dev24-evidence/delivery.json`에 기록하고 force/직접 main push/보호 우회/검사 강제 성공은 하지 않는다.
- 종료/인계 metadata는 문서 검사와 primary ai-review를 재확인하고 독립 verifier freshness에 다시 제출한다. source/test는 첫 독립 PASS의 지문과 동일하며 검토 뒤 바뀐 것은 위 종료/인계 문서뿐이다. 최종 freshness와 Git 결과를 검토/외부 receipt에서 확인한다.

## 2026-11-16 · Git 전달 체크포인트

- [PR #81 · 기존 회사 서류 재업로드 연결](https://github.com/mate-pjt/mate-frontend/pull/81)을 `feat/dev-24-document-upload`→`main`으로 생성했다. 최초 전달은6개 목적별 commit/head `1558dfe8e67a8ef78b15ff56bc34a74184a99d3a`, feature/test/docs 라벨이다. 실제 PR 연결 metadata만 추가했으며 source/test는 독립 PASS/빌드 지문과 동일하다. 최종 문서 연결 commit 뒤 head의 CI/원격 리뷰·정상 merge/로컬 main FF와 clean·SHA 일치는 실제 PR/종료 보고 및 세션 `dev24-evidence/delivery.json`에 기록한다. 이번 Chromatic 월간 한도 예외와 실제 QA/신규 추가 차단을 유지한다.

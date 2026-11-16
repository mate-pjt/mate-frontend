# POL-13 · 서류함 생명주기·접근·삭제 계약

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 정책 결정
- 원본 항목: F01, F02, F03, F04
- 선행 작업: [DOC-001](DOC-001.md)
- 목적/범위: 가입용 업로드와 구분해 보관 목록/버전/유효기간·다운로드·보관/삭제·재업로드/OCR 결과 적용 계약을 확정한다. 추천: 기존 opaque upload 기반을 재사용한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### F01 · 가입 후 서류함 목록·보유/만료 상태
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **관리 목록 계약 없음**. 검증: 코드 대조.
- 남은 점: 가입용 업로드와 별개인 보관함·문서 생명주기 UI/조회 연결
- Figma: [3135:75612](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75612) / [3135:75734](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75734)
- 소유 소스/기존 기록: [src/data/company/contracts.ts:212](../../../../src/data/company/contracts.ts)、[src/components/my/my-company-client.tsx:252](../../../../src/components/my/my-company-client.tsx)

### F02 · 보관 서류 상세·다운로드·수정 이력
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **관리 조회/다운로드 계약 없음**. 검증: 코드 대조.
- 남은 점: 등록 문서 조회·유효기간·최종수정·다운로드 구현
- Figma: [3135:75782](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75782) / [3135:83161](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-83161)
- 소유 소스/기존 기록: [src/data/company/contracts.ts:212](../../../../src/data/company/contracts.ts)

### F03 · 보관 문서 추가·재업로드·삭제
- 기준선: UI **가입 기반 일부**, 동작 **관리 흐름 미구현**, 데이터 **업로드/버전/처리 기반 있음**. 검증: 코드 대조.
- 남은 점: 기존 업로드 기반을 보관함에 연결; 삭제·권한·충돌·오류·완료 피드백 추가
- Figma: [3135:75651](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75651) / [3135:75938](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75938) / [3135:80545](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-80545)
- 소유 소스/기존 기록: [src/data/company/contracts.ts:213](../../../../src/data/company/contracts.ts)、[src/app/auth/company/register/document/registration-client.tsx:1](../../../../src/app/auth/company/register/document/registration-client.tsx)

### F04 · 서류 기반 실적·회사정보 반영
- 기준선: UI **가입 기반 일부**, 동작 **가입 후 흐름 없음**, 데이터 **등록 proposal 기반 있음**. 검증: 코드 대조.
- 남은 점: OCR 결과를 회사 갱신/직접 수정과 연결
- Figma: [3135:75991](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75991) / [3135:78459](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-78459) / [3135:81589](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-81589)
- 소유 소스/기존 기록: [src/data/company/contracts.ts:219](../../../../src/data/company/contracts.ts)、[src/components/auth/company-registration.tsx:69](../../../../src/components/auth/company-registration.tsx)

## 완료 기준

- [x] 회사/계정 소유권·읽기/변경 역할·최신/이전 버전·만료 기준을 기록한다
- [x] 다운로드/삭제·재업로드 경쟁·처리 실패/복구·감사 기록을 확정한다
- [x] 원문/소유 소스·버전·결정자·시각·선택/보류 이유를 기록한다. 추천안은 승인으로 간주하지 않는다.
- [x] 근거 있는 기존 승인 또는 필요한 개발자 결정을 확보하고, 후속 개발의 범위/완료 기준/차단을 갱신한다. 정책 작업도 Review Gate를 수행한다.

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

<a id="pol-13-pol-12-handoff"></a>

## 2026-11-13 · POL-12 종료 후 선정/인계

- 선정 근거: WBS P0/P1의 해소 가능한 대기0이며 P2 앞선 DEV-17~21/26은 DEV-08 또는 아직 미충족인 개발/계약 선행을 유지한다. DOC-001 선행이 충족된 다음 독립 정책 후보가 POL-13이다. 기존 차단·승인 예외/QA 면제나 이 Task 정책 확정을 뜻하지 않는다.
- 다음 첫 행동: 최신 Git/main·WBS·이 Task 정의/완료 기준·[POL-12의 F04/관리용 OCR 경계](POL-12.md#pol-12-handoff)·관련 가입/회사 QA를 확인하고, 현행 소유 문서/백엔드 source·개발 Swagger의 문서함 목록/버전·유효/보관·접근/다운로드·삭제/재업로드/OCR 적용 계약을 대조해 자체 정책 Brief/파일·검증 계획을 편집 전에 제시한다. 과거 ‘관리 계약 없음’은 당시 관찰로 읽고 현재 API/실행·실제 QA를 각각 확인한다.
- 이번에는 선정/인계만 했다. POL-13의 신규 계약 조사·정책 선택·설계/구현·실제 업무 API·문서/파일 처리·별도 Git 전달은 시작하지 않았다. 현재/다음/상태는 WBS만 소유한다.

<a id="pol-13-mat-287-handoff"></a>

## 2026-11-16 · MAT-287 연결 후 선정/인계 유지

- 사용자 요청에 따라 다음 하나로 다시 인계한다. 확인한 것은 위 정의/완료 기준과 WBS의 우선순위·선행뿐이다. DOC-001 완료, 해소 가능한 P0/P1 대기0, 앞선 DEV-17~21/26의 기존 선행/계약 미충족을 유지하므로 다음 독립 정책 후보는 POL-13이다.
- [MAT-287의 응답 대기 범위](POL-12.md#pol-12-mat-287-handoff)는 DEV-20의 주력 업종·주소·설립 연월과 DEV-21의 회사 프로필 사진이다. 이를 POL-13 전체의 신규 선행으로 추가하거나 기존 회사 OCR 반영 계약 확보로 세지 않는다. MAT-162의 증명서 교체 기획 보류와 DEV-26 별도 Gate는 유지한다.
- 다음 첫 행동: 최신 Git/main·WBS·이 정의/완료 기준·POL-12의 F04 경계·관련 QA를 읽고, 그때의 소유 source/개발 Swagger에서 서류함 목록·버전·유효/만료·보관·다운로드/접근·삭제/재업로드·OCR 적용 경계를 확인한 뒤 자체 정책 Brief/편집 파일·검증 계획을 제시한다. 예전 관리 계약 부재를 현재 사실로 반복하지 않는다.
- **선정/인계만 수행했다.** POL-13의 신규 API/Figma 조사·정책 결정·설계·구현·실제 문서/파일/OCR 처리·별도 Git 전달은 시작하지 않았다. 현재/다음/상태는 WBS에서만 관리한다.

<a id="pol-13-investigation"></a>

## 2026-11-16 · 요구사항 Gate 조사 체크포인트

- 시작: local/remote main `ba1c63bd20cde2a2b74f073460c08ca868a8a770` 일치·작업트리 깨끗함. DOC-001과 POL-12/PR #76·후속 PR #77 main 반영 확인. `git pull --ff-only origin main` 후 `docs/pol-13-document-lifecycle` 생성. 기존 같은 Task branch/미커밋 변경 없음. 별도 detached worktree는 변경하지 않았다.
- 이번 승인: 사용자 2026-11-16 요청의 POL-13 정책 조사/결정·문서 검증·read-only verifier/ai-review·목적별 commit/push·PR/최종 CI·정상 병합/로컬 main FF. 이번 Chromatic 월간 한도 문제만 예외. 과거 Task의 실제 QA/진행 예외를 승계하지 않는다. 제품 구현·업무 API/파일/OCR 처리·외부 메시지·중앙 저장소 수정·운영/배포·다음 Task 실행 제외.
- 조사: backend dev `adc0e265ef0e2aa78ccb376e1fa322edd664b290`, main `4b5f31de578c41e698dda9c99e66149b7292f031`, 중앙 정책 main `c9e50ff591ae18023164e1a94581c611bf1e4f29` 확인. 개발 OpenAPI GET200/3.1.0/v1에서 회사 목록·문서/버전·접근 티켓·삭제·업로드/재시도 경로를 선별 확인했다. source commit·배포 기록·게시 명세·실행 SHA·업무 응답은 별개다. 실제 업무 응답/실행 SHA는 미확인이다.
- 확인: 목록은 문서관리 leaf, 문서 metadata/버전은 미귀속 owner 또는 활성 회사 소속, 원본 접근/교체/삭제는 별도 문서관리 검사를 사용한다. 목록 유효기간 필드 없음, version의 nullable validFrom/validUntil과 보유·처리·인증 의미는 별개다. 신규 문서 생성은 companyId가 없는 계정 소유 임시 문서다. 기존 회사 귀속/최종 교체·OCR 반영은 계약과 MAT-162 보류 경계를 구분해야 한다.
- 정책 질문 D1/D2/D3 제시. 사용자 D2 답변 **“현행 삭제 흐름 채택 (추천)”** 확보: series 전체 즉시 숨김·30일 뒤 비동기 파기 대상·응답 확인 뒤 완료 안내·사용자 복원 없음. D1 접근/날짜와 D3 지원/계약 대기 분리는 사용자가 쉬운 설명을 요청해 예시를 설명했고 답변 대기다. 추천을 확정으로 취급하지 않는다.
- 편집 전 제시한 문서 후보: 이 기록·WBS·DEV-22~26 후속 기준·가입 후 서류함 QA 계획/QA 진입점·plan·검토 기록. 링크/ID·원본79개/114Task·의존/단일 상태·기준선/기존 QA 보존·Markdown·범위·diff-check로 검증한다. 실행 소스/패키지/빌드 영향이 없어 로컬 앱 test/lint/build·브라우저/실제 통합은 미실행한다. 검토 후 변경은 필요한 재검토를 수행한다.
- 다음 행동: D1/D3 답변 뒤 최종 Implementation Brief·수정 파일/영향/단계·위험/검증 계획을 편집 전에 제시하고 정책 문서를 작성한다. 이 기록은 조사 체크포인트이며 미결 정책의 설계/구현 승인이 아니다.

<a id="pol-13-brief"></a>

## 2026-11-16 · 사용자 결정 이후 Implementation Brief

- 요구사항: F01~F04의 가입 후 서류함 생명주기·접근·버전·보관/삭제와 추가/교체/OCR 회사정보 반영의 경계를 현행 소유 계약에 맞춰 소스 정책 v1로 기록한다. 정책 작업이며 제품 구현이 아니다.
- 성공 기준: 소유권/권한별 접근·보유/처리/인증/만료·현재/후보/이전 버전·다운로드·삭제/파기·복구/감사 범위를 근거와 연결하고, 승인된 선택/보류 이유·후속 DEV 완료/재개 기준과 미실행 QA를 추적한다. 문서 검사와 두 리뷰를 통과한다.
- in scope: 이 기록, WBS, DEV-22~26 인계, [가입 후 서류함 QA 계획](../../../qa/company-documents.md), QA 진입점, plan과 [검토 기록](../reviews/POL-13.md)의 문서11개. 원본79개/기존114Task/156의존성·기준선·기존 QA/선행 결정을 보존한다.
- out scope: 제품/Repository 계약·DTO/HTTP/mock/테스트·패키지/설정·중앙 문서/백엔드/Linear 변경, 실제 로그인/회사 문서 조회·파일/접근 티켓 발급·업로드/OCR/삭제·메일·운영/배포, 다음 Task 실행. 공개 소스/명세·디자인/연결된 이슈 읽기만 수행했다.
- 확인한 패턴: `company/contracts.ts`의 Directory/Onboarding/Document 포트와 공개 client→HTTP/mock, opaque upload handle/계정별 복원·세션 수명, 읽기 전용 회사 UI, POL-12 F04/MAT-162 보류와 QA-05/06/07. 기존 company 공급원·7그룹/snapshot/hybrid/운영 guard·fallback 금지·개인정보 비저장을 유지한다.
- 편집 전 제시한 단계/영향: 정책과 고정 근거 → DEV별 지원/계약 대기·QA 연결 → 문서 검사/Documentation Update Check → read-only verifier/ai-review → 종료/인계 후 재검토 → 목적별 Git 전달. 실행 코드/빌드 영향 없음.
- 위험/가정: 목록 권한과 개별 metadata/원본 권한이 다름, 목록에는 유효기간 없음, 후보가 current보다 먼저 표시됨, 30일은 비동기 파기 예정, 신규 생성은 미귀속, 기존 회사 OCR 최종 적용은 보류다. 날짜·role·최대 버전 번호로 의미를 합성하지 않는다. API 동시성 방식은 서버 계약을 따르며 모든 명령에 expectedVersion을 새 필수로 요구하지 않는다.
- 검증: 문서 링크/anchor·ID/coverage·의존 DAG/상태·스냅샷 hash/기존 QA·범위/Markdown·`git diff --check`. `package.json`의 scripts8개를 확인했다. 문서 전용이라 로컬 `pnpm test`/`pnpm lint`/`pnpm build`/`pnpm build-storybook`·앱 브라우저/실제 통합은 미실행한다. 실제 원격 CI는 최종 PR head로 별도 확인한다.

### 결정자·원문·이유

| 결정 | 날짜/승인자·실제 답변 | 확정 내용·선택 이유 |
| --- | --- | --- |
| D1 | 2026-11-16 사용자, 쉬운 예시 설명 후 **“설명한 기준으로 확정 (추천)”** | 현행 소유권/권한을 따르고 보유·처리·인증·만료를 구분. 서버 만료일의 한국 날짜 기준·결측은 미확인, 목록 제공 방식은 DEV-22 자체 Gate |
| D2 | 2026-11-16 사용자 **“현행 삭제 흐름 채택 (추천)”** | series 전체 즉시 숨김·30일 뒤 비동기 파기 대상·응답 확인 뒤 완료 안내·사용자 복원 없음. 현행 서버의 삭제 의미와 맞춤 |
| D3 | 2026-11-16 사용자, 쉬운 예시 설명 후 **“지원 부분과 계약 대기 부분 구분 (추천)”** | 목록/이력/허용된 원본 접근/삭제의 후속 기준과 기존 회사 신규 귀속·교체 최종확정/OCR 반영 계약 대기를 분리. 업로드 도구만으로 회사정보 저장 완료를 만들지 않음 |

세 답변 전의 추천/설명 요청은 승인과 구분한다. 결정자는 이 대화의 사용자다. Backend 계약 담당·제품/디자인 결정·실제 QA 자원 담당은 후속 Gate의 역할로만 기록하며 미확인 개인/일정을 지정하지 않는다.

<a id="pol-13-sources"></a>

## 소유 근거와 확인 수준 · 2026-11-16

| 근거 | 확인한 내용과 한계 |
| --- | --- |
| frontend | 시작 `ba1c63bd20cde2a2b74f073460c08ca868a8a770`, 가입용 Document 포트만 있고 가입 후 목록/다운로드/삭제 공개 함수·제품 화면은 없음. 아래 정책을 구현 완료로 세지 않음 |
| backend/중앙 ref | dev `adc0e265ef0e2aa78ccb376e1fa322edd664b290`, main `4b5f31de578c41e698dda9c99e66149b7292f031`, 중앙 main `c9e50ff591ae18023164e1a94581c611bf1e4f29`. 아래 소스 정책은 개발 환경을 대상으로 dev의 고정 소스를 읽음 |
| 배포 기록 | [run43389204151](https://github.com/mate-pjt/mate-backend/actions/runs/43389204151)의 dev SHA 일치·verify/publish/deploy success, deploy-prod skipped. 실행 프로세스 SHA 직접 증명은 아님 |
| 게시 명세 | [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs) GET200·OpenAPI3.1.0/info.version v1. 문서 관련8경로/10operation과 필드를 확인. 실제 업무 응답/현재 실행 SHA·문서 통합은 미확인/미실행 |
| 목록/표시 버전 | [목록 service](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companydocument/CompanyDocumentBoxQueryService.kt), [목록 persistence](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companydocument/CompanyDocumentBoxQueryPersistenceAdapter.kt): 회사/leaf·page/count·candidate 우선/current 구분·정렬 |
| 개별 조회/원본 | [조회 persistence](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companydocument/CompanyDocumentReadPersistenceAdapter.kt), [접근 service](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companydocument/CompanyDocumentReadService.kt): metadata와 exact managed object 접근의 별도 권한/상태 |
| 업로드/교체 | [업로드 persistence](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companydocument/CompanyDocumentUploadPersistenceAdapter.kt), [정책 상수](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/domain/companydocument/CompanyDocumentUpload.kt): 미귀속 생성·current 기준 단일 후보/멱등·형식/정확 byte/세션 수명 |
| 삭제/파기 | [삭제 persistence](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companydocument/CompanyDocumentDeletionPersistenceAdapter.kt), [파기 persistence](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companydocument/CompanyDocumentPurgePersistenceAdapter.kt): 권한/row lock·삭제 시각+30일·재삭제 동일 결과·근거 참조 해제/tombstone |
| 중앙 정책 | [권한](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/company/permissions.md), [등록/검증](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/company/registration-and-verification.md), [runtime](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/runtime/verification/company-registration.md): leaf 원천·사업자등록증명/30일 접수 기준·OCR/진위/등록·실패 복구 분리 |
| OCR 보류 | [MAT-162](https://linear.app/mate-pjt/issue/MAT-162) 현재 Backlog·제목 ‘기획 보류’, 설명의 구현/branch 재사용/PR 재개 금지와 [backend PR #80](https://github.com/mate-pjt/mate-backend/pull/80) CLOSED를 재확인. 기존 검토안을 승인된 계약으로 사용하지 않음. MAT-287 범위와 별개 |

원본의 2026-10-27 ‘관리 계약 없음’은 당시 frontend 관찰로 보존한다. 테스트 소스/제품 실행 PASS나 모든 백엔드 branch의 동일성을 주장하지 않는다. 로컬 근거는 [조사 폴더](/Users/jisung/.codex/visualizations/2026/11/16/01a1e21a-da95-7322-adf0-490b7be3d55f/pol13-evidence)의 고정 source와 선별 OpenAPI이며 실제 파일/추출값·티켓은 수집하지 않았다.

### Figma frame/상태 연결

| 원본/후속 | 확인한 frame | 연결 기준·확인 한계 |
| --- | --- | --- |
| F01 / DEV-22 | [3135:75612](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75612), [3135:75734](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75734) | 서류함 목록/보유 상태. candidate 처리 중과 기존 current 보유·날짜 미확인을 구분해야 함 |
| F02 / DEV-23 | [3135:75782](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75782), [3135:83161](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-83161) | 상세/이력과 유효기간·버전 metadata. 원본 티켓/감사 로그는 같은 개념이 아님 |
| F03 / DEV-24·25 | [3135:75651](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75651), [3135:75938](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75938), [3135:80545](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-80545) | 추가/재업로드 popup·삭제 후 Toast frame. upload_popup 하위 metadata에서 사업자등록증명·최근30일·PDF/JPG/PNG·10MB 안내 확인 |
| F04 / DEV-26 | [3135:75991](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75991), [3135:78459](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-78459), [3135:81589](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-81589) | 회사정보/실적정보/직접수정 상태. POL-12·MAT-162의 회사정보 적용 경계 유지 |

10개 지정 frame과6개 하위 instance의 metadata를 선별 확인했다. screenshot4건의 다운로드가0byte여서 이미지를 검토하지 못했으며 시각/전체 상태·픽셀 QA PASS가 아니다. child instance의 기본 ‘버튼명/텍스트’를 실제 화면의 확정 문구로 쓰지 않는다. D1~D3는 기능 의미의 결정이며 전체 화면의 Figma 예외 승인이나 보류된 기능의 활성화 승인이 아니다.

<a id="pol-13-contract"></a>

## 서류함 소스 정책 v1 · 사용자 D1/D2/D3

| 항목 | 확정 정책/현행 계약과 한계 |
| --- | --- |
| 소유권 | 가입 중 미귀속 문서는 owner account 문맥, 회사 귀속 뒤에는 해당 회사의 현재 ACTIVE 소속/요청별 leaf 검사를 따른다. 업로드한 본인·표시 ADMIN/AGENT/VIEWER·직급 이름만으로 접근을 허용하지 않는다. 회사/계정 교체·탈퇴/권한 상실 뒤 이전 화면/응답·티켓을 재사용하지 않는다 |
| 읽기와 관리 | 회사 목록 GET은 COMPANY_VERIFICATION_DOCUMENT_MANAGE가 필요하다. 개별 상태/버전 metadata GET은 미귀속 owner 또는 ACTIVE 회사 소속에 허용되고, 원본/추출 필드·proposal과 변경은 문서관리 권한으로 더 제한한다. 권한 없는 목록을 빈 서류함으로 바꾸거나 우회 목록을 만들지 않는다. 화면 숨김은 서버 보안 검사의 대체가 아니다 |
| 목록/페이지 | GET `/api/v1/companies/{companyId}/documents`: page0부터·기본 size20/1..100. company 귀속 ACTIVE·미삭제/미파기 series별1행, totalElements는 문서 수다. displayed version은 replacement candidate 우선, 없으면 current. modifiedAt 내림차순/documentId 내림차순이다. 최대 versionNumber나 마지막 업로드만으로 current를 정하지 않는다. 빈 page와 전체0건/오류·권한 거절을 구분한다 |
| 이력/감사 | GET `/api/v1/company-documents/{documentId}/versions`: versionNumber 내림차순, versionId/번호·업로더 표시명·uploadedAt/modifiedAt·상태/current·nullable validFrom/validUntil을 보존한다. 버전 이력은 열람/다운로드/삭제 수행자까지 갖춘 감사 로그가 아니다. 삭제 응답의 deletedAt/purgeAt·파기 tombstone과 별도 감사 열람 API/감사 보존기한을 구분한다. 미확인 감사 조회 UI/법적 보존 보장은 추가하지 않는다 |
| 보유/처리/인증 | 파일 보유, UPLOAD_READY/OCR/공식 검증/사용자 확인/VERIFIED, version current 여부와 문서 유효기간은 독립 축이다. 목록에 후보가 표시돼도 이전 current를 미보유로 바꾸지 않는다. OCR 성공·업로드2xx·날짜가 유효하다는 사실을 회사 인증이나 회사정보 반영 완료로 표시하지 않는다 |
| 만료/결측 | D1: 서버가 제공한 해당 version의 validUntil을 한국 날짜로 비교해 그 날까지 포함하고 다음 날부터 만료다. null/미제공이면 ‘미확인’, 손상된 날짜는 오류/확인 필요로 처리하며 업로드일+30일을 만들지 않는다. validFrom이 미래인 경우에도 유효하다고 확정하지 않고 해당 기간 정보를 보존한다. ‘최근30일 발급’은 가입 접수/검증 조건이며 보관 만료일·법적 효력 보장이 아니다. 목록의 날짜 제공 방식/결측 UI는 DEV-22 자체 Gate에서 확인한다 |
| 원본 접근 | POST `…/{documentId}/versions/{versionId}/access-tickets`의 purpose PREVIEW/DOWNLOAD·선택 versionId를 사용한다. managed exact object version·허용 MIME와 상태 검사 뒤2분 티켓을 발급한다. 허용 상태는 OCR_SUCCEEDED/VERIFICATION_PENDING/VERIFICATION_FAILED/COMPANY_CONFIRMATION_REQUIRED/VERIFIED/REPLACED다. metadata 열람 가능을 다운로드 가능으로 확대하지 않는다. 오류/만료 뒤 재발급은 현재 권한을 다시 검사하며 무한 재시도하지 않는다 |
| 티켓 비저장 | URL·서명 header·checksum·파일 원문/OCR 개인정보를 storage/로그·문서/Toast에 저장하지 않는다. 원본은 필요 시점에 요청하고 실패/권한/만료를 구분한다. 삭제/권한 회수는 신규 발급을 막지만 이미 발급된 storage URL의 즉시 폐기까지 보장하지 않으므로 최장 기존2분 수명/실제 환경을 QA한다. URL 원문은 증거에 남기지 않는다 |
| 추가 업로드 | 현재 POST `/api/v1/company-documents`는 documentType/originalFilename/contentType/sizeBytes/sha256과 UUID 멱등 키를 받고 company_id=null로 생성한다. 기존 회사에 새 문서를 귀속시키는 관리 command라고 간주하지 않는다. D3에 따라 가입 흐름의 opaque handle·PUT 기반을 재사용할 수 있지만 회사 귀속/문서 종류·완료/잔존 계약 전 보관함의 신규 추가를 활성화하지 않는다 |
| 형식/수명 | 지원 사업자등록증명·PDF/JPG(JPEG)/PNG, 실제 서버 상한1..10×1024×1024bytes, MIME/확장자·무결성 검증을 따른다. PUT 티켓10분·session30분, 만료 URL만 같은 metadata/key로 남은 session 안에서 갱신한다. 화면에 storage descriptor를 노출하지 않는다. 파일을 다시 선택하는 것과 이미 접수된 명령을 새 키로 재제출하는 것을 구분한다 |
| 교체/경쟁 | POST `…/{documentId}/versions`의 replacesVersionId는 최신 확인한 current다. 단일 candidate·row lock/멱등 payload 검사를 따르고 완료 전 current를 먼저 지우지 않는다. 진행 후보/오래된 current/다른 payload의 키 재사용은409, 없는/허용되지 않는 문서는404다. 최신 상태를 조회하고 명시 재선택하며 자동 덮어쓰기/재전송하지 않는다. 후보 생성/PUT/OCR 성공과 회사 current 최종 교체·프로필 변경 확정은 별개다 |
| 실패/복구 | 처리 GET은 candidate 우선/current 정보를 유지한다. 서버 canRetry·retryExpiresAt와 실패 분류를 따른다. OCR_FAILED/VERIFICATION_FAILED의 보존 시간 내 명시 재시도와 REUPLOAD_REQUIRED/인증 거절을 구분한다. 중앙 runtime의 자동5/10/15초·총4회/실패 후24시간 보존은 서버 작업 계약이지 프론트의 무한 재시도 지시가 아니다. 조회 오류는 새 Job 생성 이유가 아니며 응답 유실·손상2xx를 완료로 만들지 않는다 |
| 삭제 의미 | D2: DELETE `/api/v1/company-documents/{documentId}`는 한 version이 아니라 series 전체다. 소유권/문서관리 leaf와 문서 lock 아래 soft-delete하고 deletedAt/purgeAt를 반환한다. 확인 화면은 이전 버전 포함 전체 삭제·복원 없음의 의미를 전달한다. 취소는 요청0건, 중복 클릭은 억제하고 확인된 성공 뒤만 목록/상세를 갱신하고 기존 Toast로 완료 안내한다 |
| 삭제 오류/동시성 | 서버 삭제는 expectedVersion 없는 series 단위 명령이며 권한 있는 재삭제는 같은 시각 결과로 수렴한다. 필드를 임의 추가하지 않는다. 404는 없는/권한 없음이 합쳐질 수 있어 무조건 ‘이미 삭제 완료’로 만들지 않는다. timeout/5xx/손상2xx·뒤이은 조회 실패는 미확정/성공 후 갱신 실패를 구분하고 자동 재삭제하지 않는다. 교체/polling/티켓 발급/계정 전환과 경합해도 삭제 후 늦은 UI 부활을 막는다 |
| 보관/파기·인증 영향 | 삭제 즉시 새 목록/metadata/티켓 접근에서 제외한다. deletedAt+30일은 purge 대상 예정 시점이며 worker/저장소 실패로 지연될 수 있다. 전체 object versions와 OCR/검증/관련 상세가 파기되고 문서 tombstone이 남는다. 회사/identity의 근거 version 참조를 해제하고 evidencePurgedAt를 기록하며 그 코드에서 회사 인증 상태 자체를 자동 강등하지는 않는다. 원본 파기를 회사/소속 삭제나 모든 회사정보 삭제로 설명하지 않는다. 사용자 복원/Undo·관리자 복구/감사 열람 API는 확인되지 않았으며 제공을 약속하지 않는다 |
| 기존 회사 OCR 반영 | D3/POL-12: OCR 추출·진위 확인·문서 귀속/교체·기존 회사의 선택 필드 저장은 별개다. document/version·대상 company/profile 근거/권한·충돌·null/수기 우선순위·실패 복구/공식 인증 유지의 실제 연결 계약과 제품 흐름이 필요하다. MAT-162는 기획 보류·구현 금지이며 신규 승인 전 재사용하지 않는다. 가입 등록 command를 기존 회사 수정 command로 재제출하지 않는다 |

<a id="pol-13-handoff"></a>

## 후속 개발의 완료/재개 기준

| 소유 Task | 지원 범위/필수 Gate·완료 기준 |
| --- | --- |
| [DEV-22](DEV-22.md#dev-22-pol-13-handoff) | 목록/메뉴·page/count/후보/current·권한/빈/오류·기간미확인, 목록 날짜 제공 방식/호출 비용·상태별 Figma 대조를 자체 Brief에서 정한다. 현재 목록 API 존재를 과거 부재로 반복하지 않는다. source/배포/실행 대응과 안전한 합성 문서·권한 계정/조회·보존/복구 범위를 확보하고 DBOX-01~06/21~22를 검증 |
| [DEV-23](DEV-23.md#dev-23-pol-13-handoff) | 상세/이력과 선택 version의 PREVIEW/DOWNLOAD, metadata와 원본 권한·허용 상태·2분/비저장·오류/목록 복귀·감사 범위 구분. DBOX-07~10/21~22, 실제 티켓/원본 열람은 승인된 합성 파일 범위로 검증 |
| [DEV-24](DEV-24.md#dev-24-pol-13-handoff) | 업로드 기반/교체 후보 계약은 존재한다. 기존 회사 신규 문서 귀속·교체 최종확정의 실제 계약/제품 흐름과 MAT-162 보류 영향을 확인하기 전 해당 완료 UI를 활성화하지 않는다. opaque handle/정확 byte·형식·session·멱등·current/candidate/응답유실·권한·실패 복구를 DBOX-11~15/21~22로 검증. 기능 축소/로컬 선행 예외는 이번에 승인하지 않음 |
| [DEV-25](DEV-25.md#dev-25-pol-13-handoff) | DEV-23 선행 뒤 전체 series 확인/취소·중복·권한/404·확인된 성공/미확정·30일/지연·티켓 잔여/늦은 응답·근거 참조를 DBOX-17~22로 검증. 실제 삭제/장기 worker 파기는 disposable 자원과 변경/잔존/복구 범위·실행 권한이 별도 필요 |
| [DEV-26](DEV-26.md#dev-26-pol-13-handoff) | 기존 POL-12/DEV-19/DEV-24 선행, MAT-162 제품 결정과 실제 기존 회사 적용 계약 확보 후 자체 Gate. 회사·문서/profile 근거/권한·선택·수기/결측/출처·동시 변경/복구의 DBOX-16/21을 검증. 기존 가입 API/보류 PR 재개·자동 덮어쓰기 없음 |

세부 사례는 [DBOX QA 계획](../../../qa/company-documents.md#pol-13-document-qa)의0통과·22미실행이며 이번에 실제 자원 준비 여부를 시험하거나 QA 면제를 승인하지 않았다. QA-05/MCO/CDASH·QA-06/07/AUTH-09~15·POL-12 CUPD 및 DEV-08의 실제 자원 Gate/로컬 선행 예외 없음·MAT-287의 다른 영역을 보존한다. 후속 파일 수정은 기준/인계만이며 그 Task의 실행이 아니다.

## 2026-11-16 · 정책 문서 작성 체크포인트

- D1/D2/D3 사용자 결정을 모두 확보한 뒤 편집 전 Brief/파일·영향/단계/위험·검증 계획을 제시했다. 이 v1·DEV-22~26 인계·DBOX22미실행 계획을 작성했다. 제품·실제 업무/문서 처리0건, 다음 Task 실행 없음.
- 다음 행동: 문서11개 검사·context-audit/Documentation Update Check·read-only verifier와 ai-review. 통과 전 완료로 바꾸지 않는다. 최종 상태와 다음 하나는 WBS에서만 관리한다.

- 문서 검증1차20/21: DEV-26의 기존 POL-12 인계 앞에 새 블록이 삽입돼 순서/prefix 검사가 실패했다. 기존 내용 손실 없이 새 인계를 마지막으로 이동했다. 자동 검증 수정1/3이며 전체 문서 검사를 재실행한다.

- 재검증21/21·diff-check PASS. Documentation Update Check와 자체 ai-review 여섯 섹션을 기록했다. 기존 baseline/coverage·QA/config10개 hash, Git blob26개와 DBOX22미실행/114Task/156선행/79원본 보존을 확인하고 read-only verifier를 실행한다.


<a id="pol-13-review-close"></a>

## 2026-11-16 · 문서 검증·두 리뷰와 다음 하나 인계

- 정책/문서 단위: 사용자 D1/D2/D3·문서 검사21/21/`git diff --check`·context-audit·ai-review 여섯 섹션·독립 verifier PASS, 미해결 Blocker/Major/Minor 없음. [리뷰](../reviews/POL-13.md)에 원본 요청/diff·검증/미실행·freshness를 기록했다. 최초20/21의 인계 위치는1/3 수정 후 전체 재통과했다.
- 제품/실제 통합: 구현0·실제 업무 API/문서/파일 처리0, DBOX22미실행과 기존 가입/회사 QA·DEV-08·MAT-162/후속 계약 Gate를 보존한다. Figma 이미지/픽셀 검증은0byte screenshot으로 미실행이다. 정책 PASS·제품 구현·실제 통합·main 반영은 별개다.
- Documentation Update Check: WBS/POL-13·DEV-22~26·DBOX 계획/QA 진입점·plan·검토11파일을 갱신했다. package/scripts·폴더/API/mock/component 규칙·하네스 변경0이므로 base/architecture/data-access/harness 유지, 새로운 반복/고위험 실패 근거가 없어 ai-failures 유지. baseline/coverage·기존 QA/config10개 hash와79원본/114Task/156의존을 보존했다.
- 다음 하나: **DEV-22 · 가입 후 서류함 목록·보유/만료 상태**. WBS 순위/선행을 대조하면 해소 가능한 P0/P1 대기0, 앞선 DEV-17~21은 DEV-08/개발 선행 미충족이며 POL-13 뒤의 첫 독립 P2 개발 후보가 DEV-22다. POL-14 등 나머지 독립 후보보다 기존 표 순서가 앞선다.
- 다음 첫 행동: 새 대화에서 최신 Git/main·이 정책/DEV-22 정의·현행 목록/버전 source·개발 Swagger와 Figma 목록 상태를 확인한다. 목록 기간 제공 방식/호출 비용·candidate/current·권한/빈/오류 및 실행 SHA/합성 문서·계정/조회·보존/복구 자원을 확인하고 자체 Brief/수정 파일·검증 계획을 편집 전에 제시한다. **선정/인계만 했으며 DEV-22의 자체 조사/설계·구현·업무 API·Git 전달은 시작하지 않았다.**
- Git 전달: 이번 사용자 요청의 목적별 commit/push·PR/최종 CI·정상 merge/로컬 FF 승인으로 이어간다. 종료 기록 변경까지 문서 검사·ai-review·독립 verifier를 재실행한 뒤 전달한다. 실제 최종 PR/head·CI/병합·main 일치/작업트리는 PR/최종 보고와 로컬 전달 receipt에서 확인한다. 이번 Chromatic 월간 한도만 예외이며 보호 규칙 우회/강제 성공/force push/직접 main push는 없다.

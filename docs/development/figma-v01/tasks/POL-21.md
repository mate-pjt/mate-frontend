# POL-21 · 가입 중 실적·인증 직접 편집 계약

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

<a id="pol-21-dev-43-handoff"></a>

## 2026-11-20 · DEV-43에서 선정 및 인계

- 기존 상위 우선순위의 차단 및 표 앞 작업의 미충족 선행을 적용한다. DOC-001이 만족된 첫 P2 정책 후보로 선정했다. [DEV-43 종료](DEV-43.md#dev-43-close) · [현재 WBS](../README.md)
- 첫 행동은 최신 main의 사업자번호 및 OCR 가입 경로와 O09 시안, 최신 백엔드 등록 계약을 대조해 정책 요구사항 Gate를 작성하는 것이다. 시공능력·대표 면허·인증 3종의 직접 입력 허용, 검증·원본과 보정값 구분, 저장과 이동 시 보존 조건을 확인한다.
- 이 기록은 다음 선정과 첫 행동을 위한 인계다.

## 작업 정의

- 유형: 정책 결정
- 원본 항목: O09
- 선행 작업: [DOC-001](DOC-001.md)
- 목적/범위: 시공능력·대표 면허·인증 3종의 직접 입력 허용·검증·출처와 등록 저장 계약을 확정한다. 추천: 조회값과 사용자 보정값을 구분한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### O09 · 가입 중 실적·인증 직접 수정
- 기준선: UI **비활성**, 동작 **보류**, 데이터 **프론트 수정 계약 없음**. 검증: 코드 대조.
- 남은 점: 시공능력·대표면허·3종 인증 직접 변경/오류 UI와 저장 계약 확정
- Figma: [3141:53469](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3141-53469) / [3141:54519](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3141-54519) / [3141:54963](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3141-54963)
- 소유 소스/기존 기록: [src/components/auth/company-registration.tsx:84](../../../../src/components/auth/company-registration.tsx)、[docs/qa/auth.md:85](../../../../docs/qa/auth.md)

## 완료 기준

- [x] 수정 가능한 필드·근거/기준일·검증/오류를 기록했다. [정책](#pol-21-contract)
- [x] 사업자번호/OCR 경로·재조회/뒤로가기 시 변경 보존 정책을 확정했다. [D3](#pol-21-brief)
- [x] 원문·소유 소스와 버전, 결정자·시각, 선택과 보류 근거를 기록했다. [조사](#pol-21-investigation) · [사용자 결정](#pol-21-brief)
- [x] 사용자 승인, 후속 개발 범위와 차단, 문서 검사 및 두 리뷰 근거를 남겼다. [DEV-44 인계](DEV-44.md#dev-44-pol-21-contract-gate) · [검증과 리뷰](../reviews/POL-21.md)

## 2026-10-27 · 작업 후보 작성 당시 설계 Gate

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

## 2026-10-27 · 작업 후보 작성 당시 검증·리뷰·인계 기록

| 구분 | 실행 명령/사례·환경 | 결과 | 증거/미실행 이유 |
| --- | --- | --- | --- |
| 이번 작업 | 미실행 | 미판정 | 기준선의 과거 결과와 구분 |

- 자동 수정 시도: 0/3. 실패 시 명령·오류·원인·최소 수정·재검증 결과를 추가한다.
- Documentation Update Check: 착수 후 판단. base/architecture/data-access/plan/harness/ai-failures 중 영향 문서와 갱신/미갱신 이유를 기록.
- Review Gate: 미실행. verifier와 ai-review의 결과/대상 diff·후속 변경 재검토 여부를 기록.
- 커밋/PR: 없음. 추후 커밋할 때 하나의 목적·영어 type/한국어 메시지, 런타임/테스트/문서는 가능한 별도 커밋.
- 다음 작업 인계: WBS에서 선택. 이 단위의 필수 검증 PASS 전에 다른 기능으로 자동 전환하지 않는다.

<a id="pol-21-investigation"></a>

## 2026-11-20 · 착수와 현행 계약 조사

- 시작 기준은 깨끗한 `main`과 `origin/main`의 동일 커밋 `587ed6c154ac6790ace080af354cff27cc386ceb`이다. DOC-001 완료 및 DEV-43 [PR #102](https://github.com/mate-pjt/mate-frontend/pull/102)·인계 커밋 `f6ee76a`의 main 반영을 확인했다. 같은 Task의 기존 브랜치·미커밋 변경은 없었다. 16:38 KST에 `docs/pol-21-onboarding-evidence-policy`를 만들었다.
- 이번 사용자는 POL-21 문서 검증과 독립 verifier·ai-review, 목적별 커밋·push·PR·CI 확인 및 조건부 정상 병합·로컬 main fast-forward를 승인했다. Chromatic 예외는 이번 PR에서 월간 한도에 기인한 문제에 한한다. 직접 편집 정책은 아래 결정 Gate에서 확인한다. 범위는 O09 문서와 후속 인계다. 제품 구현, 업무 API·데이터 변경, 메일·문서 처리, 운영·배포, Linear 수정은 범위 밖이다.
- [공통 패널](../../../../src/components/auth/company-registration.tsx#L55), [번호 가입](../../../../src/app/auth/company/register/business-number/registration-client.tsx#L133), [문서 가입](../../../../src/app/auth/company/register/document/registration-client.tsx#L258), [회사 Repository](../../../../src/data/company/client.ts)와 [데이터 접근 가이드](../../../ai-context/data-access.md)를 확인했다. 양쪽 화면은 `SignupCompanyProfile`을 읽고 직접 수정이 비활성이며 실적 자료가 없어도 다음 단계로 갈 수 있다. 사업자번호의 현재 연결 또는 OCR의 문서·버전과 제안을 조회한다. 실적 누락과 회사 기본정보/공식 검증 실패는 서로 다른 분기다.

### 시안과 제품의 차이

| 경로와 상태 | 직접 확인한 Figma | 현재 프론트 관찰 |
| --- | --- | --- |
| OCR · 조회값 보정 | [3141:53469](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3141-53469) · 금액과 대표면허·인증 3종을 수정하는 화면 | 제안의 프로필을 공통 읽기 화면에 표시 |
| 번호 · 조회값 보정 | [3141:54519](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3141-54519) · OCR과 같은 입력 항목 | 현재 연결 프로필을 공통 읽기 화면에 표시 |
| 번호 · 실적 자료 없음 | [3141:54963](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3141-54963) · 금액 공란과 비활성 다음 버튼 | 보고서 근거가 없는 항목은 `정보 없음`. 유효한 회사 기본정보를 확보한 경우 다음 가능 |
| OCR · 실적 자료 없음 | [3141:54055](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3141-54055) · 번호 경로와 같은 빈 입력 | 유효한 제안/공식 검증을 확보한 경우 같은 읽기 화면과 다음 사용 |

네 프레임의 스크린샷을 직접 대조했다. 금액은 원 단위로 필수 표시가 있고, 면허·인증은 예/아니오 두 선택만 보인다. 프레임의 예시 선택·금액·추천 문구는 제품 기본값·지원 조건·검증 범위의 승인 근거로 사용하지 않는다.

### 소유 정책·API와 확인 수준

| 근거 | 2026-11-20 KST 관찰 |
| --- | --- |
| 중앙 정책 main `c9e50ff591ae18023164e1a94581c611bf1e4f29` | 공개 보고서의 시공능력은 공종 금액을 합산하지 않고 평가연도 근거가 없으면 `null`이다. 공공인증은 `YES`·`NO`·`UNKNOWN`을 구분한다. 보고서 관측과 현재 확정값·변경 제안의 출처를 보존한다. 인증 가입은 증명서·공식 검증으로 회사 identity를 확정한다. [회사 프로필](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/company/overview-and-profile.md#L38-L49) · [등록과 검증](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/company/registration-and-verification.md#L98-L123) |
| 백엔드 GitHub source | main `4b5f31de578c41e698dda9c99e66149b7292f031`, dev `ab388b7cb06154a00e254eff7b124882952166ac`. 확인한 등록·프로필 경로는 두 ref에서 동일하다. 두 등록 POST는 연결 ID 또는 문서·버전·제안 revision과 기존 입력을 받으며 실적 보정값은 받지 않는다. 보고서에서 온 평가액·면허·인증은 가입 응답의 읽기 값이다. [번호 요청](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companyregistration/request/CreateUnverifiedCompanyRegistrationRequest.kt#L9-L17) · [OCR 요청](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companyregistration/request/CreateCompanyRegistrationRequest.kt#L13-L32) · [응답 변환](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companyregistration/SignupCompanyProfileResultFactory.kt#L33-L52) |
| 가입 후 수기 API | `/api/v1/companies/{companyId}`에 생성·수정 API가 있다. 실제 서비스는 현재 회사의 `COMPANY_INFORMATION_EDIT` 권한을 검사한다. 시공능력 생성에는 `industryId`와 `assessmentSubjectName`, 수정에는 정확한 `expectedVersion`이 필요하다. 인증은 `value`의 명시 `true`/`false`/`null`과 version을 검사한다. 기존 API의 대상·권한·저장 경계는 가입 등록과 다르다. [Controller](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companyprofile/CompanyProfileManualController.kt#L39-L155) · [요청 검증](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companyprofile/request/CompanyProfileManualRequests.kt#L18-L79) |
| 배포·게시 명세 | dev SHA의 test deployment `7900875985`는 2026-11-19 10:04 KST 성공 기록이 있다. 공개 개발 Swagger `GET /v3/api-docs`는 HTTP 200, OpenAPI 3.1.0/v1, 184 paths·209 operations다. 가입 관련 응답의 실적 구조와 두 등록 request schema, 등록 후 수기 API 경로를 확인했다. [배포 job](https://github.com/mate-pjt/mate-backend/actions/runs/44429902651/job/135257313150) · [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs) |
| 실행·QA | 개발 서버의 실제 실행 SHA/image digest, 인증 업무 요청·응답은 미확인이다. [AUTH-14/15](../../../qa/auth.md#qa-06-사전-점검--2026-11-02-kst) 2차단 및 [AUTH-09~13](../../../qa/auth.md#qa-07-가입-문서-업로드ocr-사전-점검--2026-11-02-kst) 5차단을 유지한다. [DEV-59 로컬 검증](DEV-59.md#dev-59-verification)에서 확인한 출처·평가연도·tri-state도 당시 로컬 근거다. |

[MAT-256](https://linear.app/mate-pjt/issue/MAT-256)의 2026-10-14 기록은 **실적 조회 실패 시** 수기 입력을 다루고, 회사 생성·권한 시점과 업종 ID·평가 대상명, 순서·재시도·중복을 미결로 남겼다. 2026-11-20 조회 기준 Backlog, 댓글 0건이다. 조회 성공값의 수정, 가입 완료 기준, 재조회 보존을 승인하는 근거는 확보되지 않았다.

<a id="pol-21-gate"></a>

### 개발자 결정 필요

| 결정 | 2026-11-20 제시한 추천안 | 영향을 받는 범위 |
| --- | --- | --- |
| D1 편집 허용 범위 | 두 경로에서 조회값 보정·누락 보완을 허용하고, 금액 미입력으로도 진행하며 미확인과 `NO`를 구분 | 시안의 필수 금액·이진 선택·자료 없음 상태 및 가입 계속 조건 |
| D2 저장 순서 | 최종 등록 시 서버가 회사 등록과 보정값을 함께 확정. 계약이 확인될 때까지 UI 연결 대기 | 소속·권한, 업종/평가 대상, 원본과 수기값의 출처, 부분 실패·중복·버전 충돌의 소유 경계 |
| D3 입력 보존 | 같은 계정·같은 등록 후보 화면의 뒤로가기·재조회에서 입력을 보존. 근거가 바뀌면 재확인하고 새로고침·이탈·대상 변경에서 초기화 | 임시 입력 수명, 다른 계정이나 새 연결/문서에 값이 섞일 위험 |

16:38 KST 시작 체크포인트. Git 전달 승인과 위 제품 결정은 별개다. 사용자 답변을 기록한 뒤 정책·QA 기준 및 후속 개발의 요구사항을 작성한다. 검증은 Markdown 링크/앵커·형식, 원본 79개 항목, WBS Task ID·의존성·상태, 변경 범위와 `git diff --check`다.

<a id="pol-21-brief"></a>

## 2026-11-20 · Brief와 사용자 결정

16:43 KST에 이번 요청자가 조회 금액 보정, 회사 등록과 금액 저장이 서로 다른 경우, 뒤로가기·재조회 사례를 설명받은 뒤 **“D1·D2·D3 모두 추천대로 확정 (추천)”**을 선택했다. 아래 세 결정은 이 대화의 사용자 승인이다. 중앙 정책과 MAT-256의 과거 기록은 확인 근거다.

| 결정 | 승인 범위 | 이유 |
| --- | --- | --- |
| D1 입력과 계속 | 사업자번호 및 OCR 가입에서 조회값 수정과 누락 보완을 모두 허용한다. 금액 미입력 시에도 진행할 수 있고, 면허·인증에서 미확인과 없음은 구별한다. | 자료가 불완전한 회사도 기존 등록 자격을 충족하면 가입할 수 있게 하고, 자료 부재를 부정으로 오인하지 않게 한다. |
| D2 최종 저장 | 보정값이 있으면 서버가 회사 등록과 함께 확정한다. 이 계약이 확인된 뒤 UI를 연결한다. | 회사만 만들어지고 사용자가 확인한 값이 누락된 상태를 등록 완료로 안내하는 일을 방지한다. |
| D3 임시 입력 | 같은 계정·등록 후보·화면에서 뒤로가기와 재조회 시 보존한다. 조회 근거가 변하면 다시 확인한다. 새로고침·이탈·계정/등록 후보 변경 시 초기화한다. | 같은 회사 입력의 손실과 다른 회사/계정의 값이 섞이는 문제를 방지한다. |

- **요구사항과 성공 기준.** 가입 실적 확인에서 금액·대표면허·인증 3종의 입력 범위·출처·검증·오류, 두 가입 경로의 입력 수명과 최종 저장 의미를 설명할 수 있어야 한다. 결정·원문·현재 계약의 공백, Figma 상태별 예외와 DEV-44의 재개 조건, 검증 계획을 연결한다.
- **범위와 설계.** O09 정책, 회사 등록의 기존 자격·출처와 충돌 경계, QA 계획 및 다음 작업 인계다. 이 Task·DEV-44·가입 QA에 각각 합의·착수 조건·사례를 적고 공통 계획과 WBS에서 연결한다. [현행 소스와 공개 계약](#pol-21-investigation) 및 [데이터 접근 가이드](../../../ai-context/data-access.md)의 회사 공급원과 계정/업로드 수명 규칙을 적용한다. 가입 후 조회·회사 갱신·개인 필터, 공식 문서 처리 변경과 제품/API 구현은 별도 범위다.
- **해석.** 수정하지 않은 값은 조회 그대로 두고, 비어 있던 금액을 생략하면 확인된 자료가 없음으로 남긴다. 입력칸에 비운 값을 기존 조회 금액 삭제로 해석할 근거는 없다. 기존 회사의 확정 정보를 변경할 권한은 이번 가입 정책에서 추가하지 않는다.
- **위험과 검증.** 금액 반올림, 미확인 값을 `NO`로 저장, 재조회가 입력을 덮음, 등록과 보정 사이의 부분 성공을 중점 검토한다. Node `22.20.0`·pnpm `11.3.0` 및 현재 `package.json`을 확인했다. Markdown 링크·앵커/형식, 원본 79개, WBS 작업 114개와 의존성 156개, 변경 범위와 `git diff --check`를 검사하고 두 리뷰를 수행한다. 이 검증은 저장소 문서 범위다.

<a id="pol-21-contract"></a>

## 가입 중 실적·인증 직접 편집 정책

### 필드, 값의 근거와 검증

| 필드 | 확정한 입력과 검증 기준 | 출처와 기준일 |
| --- | --- | --- |
| 시공능력평가액 | 선택 입력이다. 보정 입력은 0 이상 정수 원 단위이며 음수·소수·범위 초과 또는 정밀도를 잃는 값은 제출 전에 알린다. 현행 수기 API의 20자리 상한을 기준으로 삼고 가입 계약에서 실제 허용 범위와 무손실 전달을 확인한다. `0`과 공란은 구분하며 요약의 억 원 표시는 저장값으로 사용하지 않는다. | 조회 평가연도·보고서 기준일과 수기값·확정 시각을 별도로 취급한다. 평가연도 근거가 없으면 `null`이며 시안의 예시 연도·조회 연도·서버 저장일에서 추정하지 않는다. |
| 대표면허 여부 | 있음·없음·미확인을 구분한다. 가입 화면의 회사 단위 질문을 백엔드가 어느 평가 항목에 적용할지 정해야 한다. 대표 공종이나 평가 대상이 모호하면 등록 계약에서 확인·충돌 처리한다. | 조회된 여부와 입수 시점은 유지한다. 공종 금액 합계나 첫 행, 금액이 큰 행을 수기 적용 대상으로 삼을 근거로 쓰지 않는다. |
| 여성기업·장애인기업·사회적기업 | 세 항목 각각 있음(`YES`)·없음(`NO`)·미확인(`UNKNOWN`)을 구분하고, 사용자 선택이 없는 항목은 원래 조회 결과를 유지한다. 조회 실패, 자료 없음, 사용자의 명시 확인을 구별한다. | 조회값에 붙은 보고서 출처·기준일과 사용자 입력 출처·서버 확정 시각을 함께 추적할 수 있어야 한다. 수기 응답 자체는 공식 인증의 근거가 될 수 없다. |

조회 결과와 수기 보정은 화면과 저장 결과에서 구분할 수 있어야 한다. 수기값은 외부 관측 원본을 덮어쓰지 않으며 원본의 출처·기준일이 수기값의 출처로 바뀌지 않는다. 능력·인증의 조회 근거가 일부만 없으면 확인된 값은 그대로 표시한다. [공통 정책의 출처와 확정값](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/company/overview-and-profile.md#L97-L107) · [현행 수기 금액·연도 검증](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/domain/companyprofile/CompanyCapabilityManualPolicy.kt#L30-L40)

### 두 경로에서 임시 입력 보존

- 번호 경로는 같은 계정의 현재 사업자 연결, OCR 경로는 같은 계정의 같은 문서·버전 및 등록 제안에 입력을 묶는다. `다음`은 화면 이동이며 최종 저장은 회사 등록 버튼에서 한다. 같은 화면의 단계 뒤로가기와 같은 후보 재조회에서 보정 입력을 유지한다.
- 같은 후보의 조회값·근거일 또는 제안 revision이 달라지면 새 조회값과 임시 입력을 따로 보여 주고 등록 전에 다시 확인한다. 늦은 응답이 입력을 덮거나 새 후보에 값을 이어 붙이지 않게 한다. 번호 변경으로 만들어진 새 연결, 교체 업로드의 새 문서 버전, 다른 후보의 값은 서로 공유하지 않는다.
- 새로고침·경로 종료·계정 또는 등록 후보 변경은 보정 입력의 메모리 수명을 끝낸다. 기존 복원은 현재 연결이나 허용된 문서·버전 식별자에 한한다. 보정값, 업로드 원본·추출값을 URL, 탭 저장소 또는 로그에 추가하지 않는다.

### 회사 등록과 보정 저장

- 사용자가 마지막에 제출한 보정 항목은 서버가 최신 연결/제안·문서 버전·revision, 회사 identity, 권한과 유효성을 재검사하고 회사 등록·초기 소속과 함께 확정한다. 저장 실패가 확인되면 이번 회사·초기 소속·보정값 중 일부만 저장된 상태가 남지 않아야 한다. 기존 회사와 소속, 공개 보고서 원본 등 기존 상태는 보호한다. 확인된 공동 저장 뒤에 완료를 표시한다. 보정 미입력 등록은 유효한 조회 근거와 기존 등록 기준을 적용한다.
- 업종·평가 대상이 필요한 값의 귀속, 누락과 명시 값 구별, 출처와 현재 값의 재조회, 멱등성과 성공 확인을 백엔드 계약으로 확인한다. 기존 회사 수기 API는 회사 생성과 권한 획득 이후의 별도 계약이다. 원자성이나 결과가 확인되기 전에는 그 API를 가입 UI에서 연달아 호출해 등록을 흉내 내지 않는다.
- 필드가 잘못됐으면 해당 표시와 입력을 유지하고 정정할 위치를 안내한다. 대상·권한·버전이 바뀐 충돌은 최신 조회와 사용자 재확인이 선행한다. 응답 유실이나 잘못된 성공 응답은 결과 미확정으로 표시하고, 계약이 제공하는 등록 결과 확인 경로를 먼저 사용한다. 재전송이 허용될 때 동일 요청은 같은 멱등 키를 사용한다. 확인된 등록 성공 뒤 세션 갱신/후속 조회 실패는 읽기 재시도 대상으로 다룬다. 새로운 등록 POST를 자동 실행하지 않는다.
- 번호 경로의 미인증 등록 요건과 OCR 경로의 공식 문서 검증·정정·기존 회사 충돌 선택은 현행 계약을 따른다. 실적 보정은 회사 상태를 인증으로 올리거나 가입자의 기존 회사 편집 권한을 늘리지 않는다. 기존 회사의 인증 전환·정정·합치기에서 확정값을 바꿀 수 있는 경우와 범위는 소유 계약 확인까지 보류한다.

### Figma 예외와 미결 계약

D1은 [확인한 네 프레임](#pol-21-investigation)의 필수 금액 표시·공란에서 다음 비활성·예/아니오만 표시되는 상태에 한해 예외를 승인한다. 금액 공란일 때도 다음을 제공하고 미확인을 표현할 수 있어야 한다. 금액 입력 조건을 추천 수신의 자격으로 안내하려면 별도의 소유 정책 근거가 필요하다. 구체적인 문구·배치와 제품 화면 검증은 DEV-44 범위다.

[DEV-44 재개 조건](DEV-44.md#dev-44-pol-21-contract-gate)은 두 등록 경로의 수기값 귀속·원자 저장, 결과 확인과 멱등성, 검증·충돌·권한, 실행 버전과 승인된 QA 자원이다. 요청 필드명·형식·오류 코드·응답 계약과 현재 실행 버전은 백엔드 등록 계약 소유자가 확인해야 한다. [MAT-256](https://linear.app/mate-pjt/issue/MAT-256)은 기존 근거이고 상태 변경이나 계약 추가 착수 승인을 포함하지 않는다. [O09 QA 계획](../../../qa/auth.md#pol-21-o09-qa)은 미실행이다.

<a id="pol-21-verification"></a>

## 2026-11-20 · 검증 및 Review Gate 체크포인트

- 초기 문서 검사 `python3 validate-docs.py 587ed6c verification`, `git diff --check`가 통과했다. Markdown 6개, 새 로컬 링크/앵커 28개, HTTPS 링크의 형식, 기준선 4개와 연결표의 원본 79항목·WBS 114작업/156의존성을 검사했다. Figma 4프레임·최신 소스·개발 명세·배포 이력과 기존 QA는 별도 근거로 대조했다.
- 문서만 변경했으므로 로컬 `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm build-storybook`은 실행하지 않았다. 실제 앱 브라우저, mock, HTTP 대역, 실제 업무 통합은 각각 미실행이다. O09-01~09는 후속 계획이고 기존 AUTH 차단/미실행 판정을 보존한다.
- Documentation Update Check에서 `plan.md`, WBS·작업 기록과 `docs/qa/auth.md`를 갱신했다. 원본 연결 관계, 앱·구조/데이터 접근 가이드, 빌드 스크립트·하네스의 변경은 없었다. [Context Audit와 Review Gate](../reviews/POL-21.md)
- `docs/pol-21-onboarding-evidence-policy`에서 검토를 시작한다. 초기 검증에서 자동 수정 시도는 0/3이다. 독립 verifier와 ai-review 뒤 종료 WBS·인계가 추가되면 해당 diff도 검증과 리뷰를 다시 받는다.
- 첫 독립 검토는 D2의 실패 기준에 Major 1을 기록했다. 1/3차 수정으로 실제 저장 실패 때 회사·초기 소속·보정값의 부분 반영이 남지 않는 보장과 양 경로의 잔존 확인을 정책·DEV-44·O09-08에 명시했다. 응답 유실은 별도의 미확정 결과로 유지했다. 수정 후 문서 검사 및 두 리뷰를 다시 수행한다.

<a id="pol-21-close"></a>

## 2026-11-20 · 정책 검증과 후속 인계

- 사용자 D1~D3과 첫 독립 검토의 교정을 반영한 문서 검증·Context Audit·verifier·ai-review가 통과했다. 시안의 동작 차이는 미입력 진행과 미확인 표현으로 한정한다. [검증과 리뷰](../reviews/POL-21.md)
- DEV-44의 선행은 서버 계약이다. 회귀 포함 로컬 및 실제 통합, 브라우저와 O09 검증은 아직 실행하지 않았다. 예외나 새 정책을 기존 AUTH 차단, 가입 후 실적 조회 및 회사 편집에 확대하지 않는다. [계약과 자원](DEV-44.md#dev-44-pol-21-contract-gate) · [QA 사례](../../../qa/auth.md#pol-21-o09-qa)
- 다음 후보는 [POL-22](POL-22.md) 하나다. 기존 P0/P1 및 앞선 P2의 차단과 선행을 보존하고 DEV-44가 서버 계약을 기다리는 동안, POL-06이 완료된 첫 P2 후보를 선정했다. 첫 행동은 POL-06의 회사 조회 정책과 L11의 개인 필터 계약을 대조해 가져올 항목, 초안과 저장, 권한·빈 값·충돌의 요구사항 Gate를 세우는 것이다. 선정·인계는 [WBS](../README.md)에 연결했다.

<a id="pol-21-delivery"></a>

### Git 전달 기준

이번 승인으로 정책·QA 문서와 종료/인계를 목적별 커밋으로 전달한다. [작업 브랜치의 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fpol-21-onboarding-evidence-policy)에서 최종 head와 CI, 리뷰, 정상 병합 근거를 확인한다. Chromatic 월간 한도 예외는 해당 PR에만 적용한다. 원격 병합 후 로컬 main은 fast-forward하고 동일 SHA와 작업트리를 확인한다.

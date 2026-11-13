# POL-11 · 회사 찾기/등록 재사용 동선 결정

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 정책 결정
- 원본 항목: M06
- 선행 작업: [DOC-001](DOC-001.md)
- 목적/범위: /my에서 기존 /auth 온보딩을 재사용하는 동선의 허용 여부와 뒤로가기·완료 복귀를 결정한다. 추천: 기존 등록 로직을 유지하고 return 경로만 명시한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### M06 · 회사 등록·찾기의 기존 온보딩 재사용
- 기준선: UI **동등 흐름 재사용**, 동작 **/auth/**로 이동**, 데이터 **기존 회사 Repository**. 검증: 새 mock 진입 및 코드 대조.
- 남은 점: Figma의 /my 내부 연속 화면과 동선이 다름. 뒤로가기·완료 후 복귀는 후속 UX 범위 결정
- Figma: [3162:51308](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3162-51308) / [3162:52186](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3162-52186) / [3162:51941](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3162-51941)
- 소유 소스/기존 기록: [src/components/my/my-company-client.tsx:164](../../../../src/components/my/my-company-client.tsx)、[src/components/my/my-company-client.tsx:172](../../../../src/components/my/my-company-client.tsx)、[src/components/auth/company-registration.tsx:148](../../../../src/components/auth/company-registration.tsx)、[docs/qa/my-company.md:52](../../../../docs/qa/my-company.md)

## 완료 기준

- [x] Figma /my 연속 화면과 현재 재사용 흐름의 차이를 기록한다
- [x] 유지/개선 범위·안전한 returnTo·완료 목적지를 승인 기록으로 남긴다
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

## 2026-11-11 · QA-17 전수 점검 보완

- 근거: [감사 CF-15](../audits/2026-11-11.md#cf-15) · [route/API·출처 인덱스](../audits/2026-11-11.json).
- 범위/소유: 가입/찾기/대기에서 쓰는 통합 요청은 source상 membership다. Figma 표현도 같아 단순 UI 구현 결함으로 단정하지 않으며 회사 간 merge와 구별할 용어를 결정한다.
- 추가 완료/재개 기준: 설정/가입 entry·return·대표/팀원/직급·이미연결/신청대기·완료 목적지를 결정하고 DEV-16에 전달한다. 프레임 시각은 DEV-57/POL-29와 분리.
- 이 절은 날짜별 후속 계획이다. 앞선 결정/QA/예외 이력을 대체하지 않으며 제품 구현·실제 업무 API 변경/새 통합 PASS는 없다. 상태는 WBS에서만 관리한다.


<a id="pol-11-dev15-handoff"></a>

## 2026-11-13 · DEV-15 종료 후 다음 선정/인계

- 사용자 요청7항의 다음 하나 선정/인계 범위다. 선행 DOC-001 완료, 선행을 충족한 P0/P1 대기0과 P2 기본 표 순서에서 이 정책 Task가 첫 후보다. 남은 실제 QA·정책/자원 차단, DEV-12 보류·DEV-13/14 계약 선행과 타 Task의 예외를 유지한다. 현재/다음/상태는 WBS만 소유한다.
- 다음 첫 행동: 새 대화에서 최신 Git/main·이 마지막 인계/정의·완료 기준과 현행 소유 정책을 확인한다. /my의 등록·찾기 진입에서 기존 /auth 온보딩을 재사용하는 범위, 뒤로가기·완료 return·대표/팀원/직급·이미연결/신청대기를 source/API·Figma 근거로 대조하고 자체 정책 Brief/검증·후속 DEV-16 기준을 편집 전에 제시한다. 추천은 확정 정책과 구분하고 남은 blocking 결정만 최대3개 질문으로 확인한다.
- 이번에는 Task 정의/선행/기존 완료 기준을 읽고 선정 이유/첫 행동만 기록했다. POL-11 전용 source/API/Figma 조사·정책 선택/결정·제품 구현/검증·실제 업무 변경/Git 전달을 시작하지 않았다. DEV-15의 로컬 선행/실제 QA 차단 보존·Git/Chromatic 예외를 이 Task의 실행 승인으로 가져오지 않는다.

<a id="pol-11-brief"></a>

## 2026-11-13 · 승인 범위와 Implementation Brief

- 작업 유형/목표: **정책 결정·문서 전용**. M06/CF-15의 가입/설정 진입과 회사 찾기·등록 재사용, 뒤로가기/완료 목적지·안전한 복귀, 대표/팀원/직급·이미연결/신청대기의 후속 기준을 정한다. 실제 제품 수정은 DEV-16 자체 Gate 이후다.
- 승인자/근거: 2026-11-13 이 대화 사용자 요청1~7항. 이번 정책 조사·문서 검증·read-only verifier/ai-review·작은 목적별 commit/push·PR·최종 head CI·정상 main 병합·로컬 main FF를 명시 승인했다. 이번 PR의 Chromatic 월간 한도만 예외이며 이전 Task의 Git/로컬 선행·실제 QA 예외를 가져오지 않는다.
- 시작 기준: clean `main`/`origin/main` = `39230102d53fcce7aab5588d868c11dedd45cb43`에서 `git fetch origin`·`git merge --ff-only origin/main` 뒤 `docs/pol-11-company-return-policy` 생성. 선행 DOC-001과 직전 DEV-15 PR #73이 main에 있다. 같은 Task 브랜치/확인된 미커밋·선행/무관한 변경 없음, reset/stash 없음.
- 성공 기준: frame/상태별 Figma와 현재 source의 차이, 아래 D1/D2의 승인 원문·결정자/기록 시점·선택 이유, 안전한 return/완료·예외의 한계, DEV-16 범위/검증·실제 QA 재개 조건을 연결하고 문서 검사·두 리뷰를 통과한다.
- 범위: 이 Task·근거/Context Audit/리뷰, DEV-16 후속 기준, WBS/coverage·plan 연결, 기존 회사 QA의 신규 **미실행** 사례. 원본79개·기준선/감사·기존 QA/결정/차단/예외는 보존한다.
- 제외: 제품 source/DTO/Repository/mock/테스트/패키지/설정·새 라이브러리, 중앙 정책/백엔드 편집, 실제 로그인/회사 조회·신청·취소·등록·업로드/OCR/메일·문서 처리·계정/fixture 변경·운영/배포, 다음 Task 실행. 정책 문서를 구현/화면 전체 정합성/실제 API 통합 PASS로 세지 않는다.
- 확인한 패턴: `components/my/my-company-client.tsx`, `app/auth/start`·`app/auth/company/search`·등록2경로, `components/auth/{auth-gate,account-scope,company-registration}.tsx`, `lib/auth-redirect.ts`, 공개 `data/company/client.ts`·contracts/HTTP, 중앙 회사 소속/등록/합치기 정책·backend 소스와 개발 OpenAPI. API 흐름 조사 전 `data-access.md`를 읽었다.
- 편집 전 계획: source/Figma·사용자 결정을 기록 → DEV-16 기대 동작과 QA를 연결 → 링크/ID/의존성/DAG/상태·원본/이력/범위·Markdown/민감 패턴·diff-check → Context Audit/두 리뷰 → 목적별 Git 전달/최종 CI/정상 병합/main 일치. WBS만 현재/다음/상태를 소유한다.
- 위험/가정: 재사용 승인은 route/진입 문맥 선택에 한정한다. Figma 전체 frame·모바일/pixel 예외가 아니다. 임의 returnTo·프론트만의 권한 판정·완료/reload의 자동 재제출로 확대하지 않는다. URL/query의 구체적 표기는 DEV-16에서 기존 패턴으로 설계하되 아래 정책은 고정한다.
- 검증: 현재 `package.json`의8scripts와 Node pin22.20.0/관찰 셸26.5.0·pnpm11.3.0 확인. Markdown/근거 JSON·PNG만 변경하므로 로컬 `pnpm test/lint/build/build-storybook`·제품 브라우저/mock/HTTP 대역은 영향 없어 미실행한다. 문서 검증과 최종 PR head 원격 CI를 별개로 확인한다.
- Gate: D1/D2 답변으로 이 정책 단위의 blocking ambiguity 해소. 실제 업무 API 자원/실행 SHA·wire는 후속 개발/QA Gate이며 준비됐다고 추정하지 않는다.

### 착수 체크포인트

| 기록일/실행자 | 환경·branch/HEAD·변경 | 수행/근거 | 다음 행동 |
| --- | --- | --- | --- |
| 2026-11-13 KST / Codex | 위 clean main에서 문서 브랜치 생성, 기존 변경0 | 규칙/선행·소유 source/Figma·공개 OpenAPI 조사, D1/D2 답변 확보, 편집 전 Brief/계획 제시 | 정책 v1/출처·후속 검증 기준 작성 후 문서 검증·두 리뷰. 제품/실제 업무 실행0 |

<a id="pol-11-decisions"></a>

### 사용자 결정과 추천의 구분

| 결정 | 질문/추천·확인 사실 | 사용자 원문·선택 이유 | 적용 범위 |
| --- | --- | --- | --- |
| D1 · 재사용/설정 복귀 | 기존 `/auth` 회사 등록·찾기 재사용, 설정 진입 문맥 유지·고정 완료 목적지를 추천 | **‘재사용·설정 복귀 적용 (추천)’** 선택. 질문에 명시한 모든 중간 이동/로그인 왕복·최상위 뒤로가기 `/my/company/start`·완료 버튼 `/my/company`·하위 뒤로가기 앞 단계·설정 목적지 고정·가입 기존 `/auth`와 완료 `/bids` 유지가 승인 범위 | `/my` 진입의 route 재사용/복귀 선택. `/my` 전용 중복 화면을 만들지 않음. 기존 가입 next 계약을 임의 확장하지 않음 |
| D2 · Figma 용어 유지 | 중앙/source는 membership이며 회사 간 merge와 별개라는 사실 확인. ‘소속 신청’ 통일을 추천했으나 사용자가 설명/이미지를 요청 | 설명 후 **‘일단 figma대로만 가자. \'통합 요청\'을 유지하고, 설명은 추가하지마.’**, **‘나중에 Figma가 수정된다면 그 때 그거에 맞게 수정하려고 해. 지금은 일단 figma대로 가자.’**. Figma와 문구를 맞추려는 선택 | 제목/버튼/대기/취소/완료의 ‘통합 요청’ 유지. 보조 설명·tooltip·배너 추가 없음. 용어 변경 추천은 **미채택**, 문구의 Figma 예외 승인 없음. 회사 간 합치기의 API/정책과 별개라는 내부 구분은 유지 |

결정자: 이 대화 사용자. 답변 후 기록 시각: **2026-11-13 15:41:07 KST**（UTC 시계06:41:07 확인）. 사용자 답변 자체의 세부 시각과 기록 시각은 구별한다. 중앙의 대표/직급·신청 제한은 기존 소유 정책의 확인 사실로 기록하고 이번 사용자가 새로 승인한 규칙으로 바꾸지 않는다.

<a id="pol-11-investigation"></a>

## 2026-11-13 · 현행 근거와 Figma 대조

[고정 source/blob·OpenAPI 선별 지문·배포 단계](../reviews/POL-11-sources.json)를 따른다. frontend는 위 시작 SHA, 중앙 정책 main은 `c9e50ff591ae18023164e1a94581c611bf1e4f29`, backend dev는 `befe434c2b3fd80ddbc12c1d6216f738dd5ea12a`, main은 `8f522d0876a70edf61b8f5456a11c51756f60372`다. membershiprequest/등록 controller 관련 비테스트27blob의 main/dev 일치를 재확인했으며 전체 branch·실행 서버가 같다는 주장은 아니다.

| 근거 수준 | 이번 확인 | 한계/후속 |
| --- | --- | --- |
| 중앙 소유 정책 | 사람의 소속 신청과 회사 간 합치기 별개, 한 활성 소속/한 PENDING, 대표/일반 직급의 배타 선택, 등록2경로의 인증 수준 | 이 사실 확인을 사용자 문구 변경 승인으로 세지 않음. D2는 Figma 용어 유지 |
| backend source | 검색/신청 context·availability5종, POST membership와 내 신청 GET, 소속/신청/초대 제한·transaction 재확인. 대표 신청은 일반 직급 없음, 일반 신청은 활성 직급 ID 또는 제안 이름 하나 | 프론트만으로 권한/동시성 보장하지 않음. 신청201 source와 OpenAPI200의 차이도 실제 wire 확인 대상 |
| 개발 게시 OpenAPI | `/v3/api-docs`: 기본 Python UA403 뒤 curl Mozilla UA **200**, OpenAPI3.1.0/v1·184paths/209operations. 관련7경로와 입력/availability/등록 멱등성 필드 확인 |403은 해당 요청 관측이며 API 부재가 아님. 게시 wrapper `success`와 현재 프론트 `isSuccess` 차이·required 표기 한계는 실응답/소유 source와 구분 |
| CI/배포 기록 | backend [run43170618340](https://github.com/mate-pjt/mate-backend/actions/runs/43170618340)의 verify/publish/deploy 성공, deploy-prod skipped 재확인 | 배포 기록은 현재 실행 process SHA 증명/실제 업무 응답이 아님. 둘 다 이번 미확인 |
| frontend source | `/my/company/start` 카드에 진입 문맥 없음. `/auth` 최상위 Back은 `/auth/start`, 하위 Back은 등록 선택/검색, 등록/신청 완료는 `/bids`. 검색→신청/등록·번호→문서/기존 회사·문서→합류에서 설정 문맥 미전달 | 현재 코드 관찰이며 브라우저/mock/HTTP 대역을 이번에 실행하지 않음. 이 차이를 DEV-16에서 보완 |

### Frame/상태별 연결

| 화면·Figma | 원본 관찰 | 현재 source와 차이 | 결정/후속 소유 |
| --- | --- | --- | --- |
| 등록 방법 [3162:51308](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3162-51308) | `/my` 명칭의 등록 방법·뒤로가기·증명서/사업자번호2선택 | `app/auth/company/register/page.tsx` 재사용, Back 고정 `/auth/start` | D1의 재사용·설정 문맥/복귀만 승인. DEV-16이 링크/인증 왕복 보완 |
| 회사 찾기 [3162:52186](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3162-52186), 하위 [3162:52191](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3162-52191) | ‘통합 요청해볼까요?’·검색·없으면 회사 등록. [비식별 부분 이미지](../reviews/POL-11-company-search.png) 확인 | `search-client.tsx`의 용어/빈 결과 등록 CTA 존재. 목록/신청 이동에 설정 문맥 없음 | D2대로 문구 유지·설명 추가0. query/page 등 화면 복귀 문맥은 DEV-16 검증 |
| 대표/팀원 신청 [3140:121981](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-121981) | ‘통합 요청’·대표자 여부·직급 문맥. 선택된 비식별 heading/label metadata 확인 | `request-client.tsx`에 대표/일반 직급 submit validation이 이미 있음. 성공 CTA `/bids`, availability 오류는 공통 안내 | DEV-16이 문맥/가용 상태/복귀·오류/계정 수명을 검증. 직급 누락 결함으로 기록하지 않음 |
| 등록 완료 [3162:51941](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3162-51941), 버튼 [3162:51949](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3162-51949) | [버튼 부분 이미지](../reviews/POL-11-completion-cta.png)의 **‘마이페이지로 돌아가기’** | `components/auth/company-registration.tsx` 완료는 ‘메이트 시작하기’→`/bids` | 설정 완료는 이 Figma 문구로 `/my/company`; 가입 기존 완료 문구/`/bids` 유지 |
| 대기/취소 [3162:52364](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3162-52364) / [3162:52416](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3162-52416) | 이번 신규 시각 검토 없음. [POL-10/DEV-15 근거](DEV-15.md#dev-15-verification) 재사용 경계 명시 | 본인 PENDING 취소·빈 회사 복귀/기존 Sonner1회는 DEV-15 소유 구현. ‘통합 요청’ 문구도 유지 | D2는 취소 정책 변경/QA 면제 아님. 기존 MCANCEL12 실서버 차단 유지 |

관찰 범위는 지정 metadata·찾기 부분/완료 버튼 PNG다. 화면 전체/pixel·모바일·모든 하위 frame을 전수 검토한 것은 아니다. D1의 기존 route 재사용 승인을 frame 전체 시각 예외로 확대하지 않는다. D2는 Figma 문구를 그대로 유지하므로 용어 예외 승인이 필요하지 않으며 새 보조 문구를 만들지 않는다.

<a id="pol-11-contract"></a>

## 정책 v1 · DEV-16의 기대 동작

아래는 D1/D2와 확인한 소유 정책에 따른 **후속 개발 기준**이다. 현재 제품 구현 설명이 아니다.

### 진입·뒤로가기·완료

| 진입/이동 | 뒤로가기·중단 | 완료/다음 목적지 |
| --- | --- | --- |
| 설정 `/my/company`→`/my/company/start` | start의 Back은 `/my/company` | 미연결/재시작 가능할 때만 기존 등록·찾기 선택 |
| 설정 start→등록 방법 또는 회사 찾기 | 최상위 Back은 `/my/company/start`. 하위 단계는 바로 앞 단계. browser history 유무에 기대지 않는 안전한 직접 URL fallback | 모든 등록·찾기·경로 전환/로그인 왕복에 설정 진입 문맥 유지 |
| 검색 결과→신청, 결과 없음→등록, 번호→문서/기존 회사 찾기, 문서→팀원 합류 | 같은 설정 문맥 유지. 검색 복귀에서 검증된 query/page 유지, 데이터가 없으면 안전한 초기 화면 | 설정에서의 등록/신청 성공은 완료 화면을 먼저 보이고 사용자가 버튼을 눌러 `/my/company`로 이동. 즉시 자동 이동/재제출 없음. 버튼은 Figma ‘마이페이지로 돌아가기’ |
| 가입 `/auth/start`→등록/찾기 | 기존 `/auth/start`·기존 하위 Back/로그인 next 계약 유지 | 기존 완료 `/bids` 유지. ‘메이트 시작하기’로 건너뛰기의 기존 next 처리도 유지하며 모든 가입 완료로 임의 전파하지 않음 |
| 설정 문맥의 등록 성공 뒤 세션 갱신 실패/만료 | 이미 확인된 성공과 경고 유지, 다시 등록하지 않음 | 재로그인이 필요하면 검증된 설정 복귀를 보존하되 이전 계정의 draft/성공을 다른 계정에 노출하지 않음 |

- 설정의 완료 return 목적지는 **`/my/company` 고정**이다. 외부 URL·프로토콜 상대 `//`·역슬래시·제어 문자·다중 인코딩 우회·임의 내부 경로·중첩 auth loop·중복/비정상 query를 신뢰하지 않는다. 입력값을 그대로 링크/로그인 next에 넣지 않는다. 설정 문맥은 허용 값만 정규화하고 잘못되면 검증된 기본 온보딩 문맥으로 복원한다.
- 기존 `sanitizeLocalNextPath`는 동일 출처 경로 검증의 재사용 근거다. 이것만으로 설정 전용 allowlist가 생긴다고 가정하지 않는다. DEV-16은 설정 목적지 고정과 전체 로그인 왕복을 별도 검증한다. URL에는 계정 ID/파일·서명 handle/개인정보를 넣지 않는다.
- 문맥은 화면 복귀만 제어한다. 계정 권한·신청 가능 여부·대표/일반 직급·등록 인증/충돌·멱등성·upload 복원/계정 격리 규칙을 바꾸지 않는다. 중단/Back/reload로 신청 취소·문서 삭제·새 회사 등록을 자동 실행하지 않는다. 기존 명시 변경/잔존/복구 범위를 따른다.

### 상태·권한·용어

| 상태/선택 | 유지할 소유 정책과 DEV-16 기준 |
| --- | --- |
| 신청 가능 `AVAILABLE` | 대표 여부를 명시 선택. 대표 신청은 일반 직급 ID/제안 이름 null. 팀원 신청은 해당 회사 활성 일반 직급 ID 또는 새 일반 직급 이름 중 정확히 하나. 누락/동시 제출/타 회사 직급 차단. 신청자가 최종 권한을 정하지 않음 |
| 신규 회사 등록의 최초 소속 | 기존 등록 계약대로 대표 여부·팀원 직급·멱등성/최종 확인을 유지. 첫 회사 생성과 최초 관리자 소속은 backend 책임이며 직급 이름만으로 권한을 추정하지 않음 |
| 이미 활성 소속 | 새 신청/등록을 자동 제출하지 않음. `/my/company`의 실제 overview로 현재 연결 회사를 확인. query 조작으로 우회하지 않음 |
| 대기 신청 `PENDING_REQUEST_EXISTS` | 다른 회사 포함 추가 신청을 막고 현재 신청을 확인. 설정에서는 `/my/company`의 대기 화면으로 복귀. 본인 명시 취소는 POL-10/DEV-15 소유이며 자동 취소/대리 취소/새 회사 합치기 없음 |
| 같은 회사 유효 초대 `PENDING_INVITATION_EXISTS` | 추가 신청 차단·기존 초대 확인 경로 사용. 임의 token/초대 발행/자동 수락 없음. 실제 초대/등록 충돌의 후속 소유권 유지 |
| 확인 이메일 필요/401·403 | 신청 불가 이유와 기존 인증/권한 처리를 유지. 최종401 로그인 왕복·설정 문맥 보존,403을 빈 회사/성공으로 바꾸지 않음 |
| `APPROVED` 반영 지연·`REJECTED`·`CANCELED` | overview의 기존 분기를 유지. 승인 지연은 명시 재확인, 거절/취소는 구분·기존 재시작. 상태 생성/신청 자동 재전송 없음 |
| 중복 클릭·계정 전환·실패/응답 유실·409 | 단일 제출/계정·화면 수명/최신 상태 재확인. 등록 성공 뒤 refresh 실패와 명령 실패를 구별. 확인된 성공만 완료로 표시하고 자동 재제출/거짓 Toast 없음 |
| 사용자 표시 | Figma의 **‘통합 요청’ 유지**, 부연 설명·tooltip·배너 추가 없음. 내부 membership와 corporate merge는 구분. 기존 취소 확인/완료 Sonner 방식과 횟수도 유지 |

Figma가 변경되면 변경 node/버전·현재 구현·소유 정책을 대조해 별도 요구사항 Gate에서 용어를 재검토한다. 미래 변경을 미리 구현하지 않는다. 기존 서버 정책과 실제 Figma 차이가 새로 발견되면 DEV-16에서 기록하고 현재 승인으로 전체 차이를 닫지 않는다.

<a id="pol-11-verification"></a>

## 2026-11-13 · 검증/리뷰 체크포인트

- 문서 최초 검사: `python3 /tmp/mate-pol11-20261113/check_docs.py`·`git diff --check` PASS.10파일·79원본/114Task/156의존성·상대 링크876(신규21)·DAG/상태·과거 prefix/보호 범위·Markdown/JSON/source8·PNG2지문·추가 민감 패턴을 확인했다. 자동 수정0/3.
- [Context Audit](../reviews/POL-11-context.md) PASS. [문서 검증/두 리뷰 기록](../reviews/POL-11.md)의 ai-review 여섯 절·독립 verifier를 이어간다. 아직 두 리뷰/최종 판정·Git 전달을 완료로 세지 않는다.
- Documentation Update Check: WBS/Task·DEV-16 후속 기준·coverage·plan·기존 회사 QA에 결정/출처·RCTX15 미실행을 연결했다. scripts/package·구조/API/DTO/mock·공통 하네스 변경이 없어 base/architecture/data-access/harness 미갱신, 새 반복 실패 근거가 없어 ai-failures 미갱신.
- 로컬 앱 test/lint/build/Storybook·제품 브라우저/mock/HTTP 대역·실제 업무 API/OAuth/메일·업로드/OCR 미실행. 문서/출처만 바뀌었으며 기존 MCO4통과6차단·MCANCEL12 실서버 차단/가입 QA·다른 Task 차단/승인 예외는 보존한다.
- 다음 행동: 실제 diff/원문·현재 source로 ai-review와 read-only verifier, 지적 시 최소 수정/재검증·재검토. 통과 후에만 WBS 완료/다음 하나 인계와 종료 freshness, 목적별 commit/PR/최종 CI·정상 main 병합/로컬 FF·SHA/clean 확인. 실제 업무 실행0.

### 두 리뷰 결과와 종료/다음 인계

- 2026-11-13 primary ai-review 여섯 절 PASS·read-only verifier **PASS**, Blocker/Major/Minor0. 독립 검토는 원문/실제 diff·관련 source·package scripts·문서 검사 직접 재실행·PNG2개 직접 확인을 포함했다. 첫 검토 diff SHA-256는 `ec855ca1e3a9d0de15883956afc40fa7693223b56b0cafed8c4f2090cb996a4f`다.
- 이 시점 판정은 **POL-11 정책/문서 범위 PASS**다. D1/D2·출처/차이·후속 범위/검증 조건과 Documentation Update Check를 충족했다. 제품 변경/실제 업무 API 실행0, 신규 실제 통합 PASS0이며 RCTX15는 실행0·미실행15다. 기존 MCO/MCANCEL/가입·타 Task 차단/예외를 보존한다.
- 다음 하나는 **DEV-16 자체 요구사항 Gate**로 선정/인계한다. WBS의 대기/준비와 완료 선행을 비교해 해소 가능한 P0/P1 대기0·P2 기본 표 순서 첫 후보/직접 정책 후속임을 확인했다. POL-12/13 등 다른 후보의 우선순위·차단을 바꾸지 않는다.
- 다음 첫 행동: [DEV-16 인계](DEV-16.md#dev-16-pol-11-handoff)의 최신 Git/source/Figma/Swagger·URL 문맥/고정 return·계정 수명/완료·RCTX15·실제 자원/변경·잔존/복구 범위로 새 Brief를 제시한다. 이번에는 인계 외 DEV-16 조사/설계/구현·제품 검증/업무 API/Git 전달을 시작하지 않았다.
- Git 전달은 별도 진행 단계다. 정상 merge commit 허용·rulesets0·main 보호 없음/Branch not protected를 조회했으며 설정 변경/우회 없음. 두 리뷰 뒤 추가한 종료/인계·결과 기록은 문서 검사와 두 리뷰 freshness를 재검토한 뒤 작은 목적별 커밋/PR·실제 최종 head CI·정상 병합/main FF로 전달한다. 마지막 실제 PR/head/CI·로컬 일치는 PR/최종 보고에서 확인한다.
- 종료 freshness도 primary/독립 verifier **PASS**（Blocker/Major/Minor0）. 독립 검사가11파일·79/114/156·886상대 링크/신규33·집계/선정·기존 prefix/범위·diff-check를 재확인했다. 마지막 추가는 이 보고서 결과의 문자 그대로 기록이며 정책/후속 QA/선정 변경이 없어 문서 검사/primary 확인 뒤 별도3차 독립 검토를 생략한다. PR receipt 추가 시에는 해당 변경을 다시 검토한다.
- 후속 기록: 독립 verifier가3개 목적별 커밋의 HEAD `09017e5`까지도 실제 base→HEAD diff/문서 검사를 확인해 PASS했다. 지문은 PNG 본문을 포함하는 `git diff --binary` 기준으로 일반 diff와 구별한다. 별도로 primary의 Git fuller 출력에 불필요한 작성자 이메일이 포함돼 사용자에게 알리고 실제 값 없이 [ai-failures의 원인/예방 기록](../../../ai-context/ai-failures.md#pol-11-git-metadata-output)을 추가했다. Context Audit/리뷰의 갱신 필요 설명도 맞추고 이 추가분의 문서 검증·두 리뷰를 다시 수행한다. 기존 출력 삭제를 주장하지 않으며 제품/정책/실제 QA 판정은 그대로다.

<a id="pol-11-git"></a>

## 2026-11-13 · PR 전달 체크포인트

- 목적별4커밋: `6aec773` 정책/고정 근거·Figma 부분 이미지, `f551f45` 후속 개발/QA·WBS 연결, `09017e5` 문서 검증/두 리뷰, `50e2251` Git 출력 사건/예방 근거. 출력 예방 추가4문서도 primary/독립 verifier PASS, 문서 최종12파일·79/114/156·889상대 링크/신규36·추가 이메일 패턴0·diff-check PASS를 확인하고 push했다.
- [PR #74](https://github.com/mate-pjt/mate-frontend/pull/74) 생성·`type: docs` 라벨 적용. 생성/첫 원격 관찰 head는 `50e2251944813ac72e45fe07ebe293045d6b609d`, base main은 `39230102d53fcce7aab5588d868c11dedd45cb43`다. 최초 checks2개 실행 중, Chromatic 게시 job/Storybook Publish 성공·UI Tests/UI Review 대기, Vercel 대기 관찰이며 최종 CI PASS로 세지 않는다.
- 이 receipt는 전달 메타데이터만 추가한다. 정책 D1/D2·제품 source·QA 기대 동작/기존 차단/다음 DEV-16은 그대로다. 이 추가분의 문서 검사·primary 여섯 절/독립 freshness를 확인해 별도 문서 커밋으로 push하고, **그 실제 최종 PR head**에서 모든 원격 CI/리뷰·base/head/병합 조건을 다시 확인한다.
- 이번 월간 Chromatic 한도 예외만 실제 원인 확인 후 적용한다. 나머지 checks 실패/미해결 리뷰·보호 규칙을 면제하거나 상태를 강제 성공으로 만들지 않는다. merge commit으로 작은 이력을 보존하고 로컬 main FF·로컬/원격 SHA·clean을 확인한 실제 결과는 PR/최종 보고에 기록한다. final head/CI·병합/main 동기화는 이 시점 아직 미완료다.

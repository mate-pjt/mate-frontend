# DEV-16 · 회사 찾기/등록의 관리 화면 복귀 보완

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: M06
- 선행 작업: [POL-11](POL-11.md)
- 목적/범위: 결정된 경우에만 기존 온보딩의 뒤로가기/완료 복귀를 보완한다.
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

- 이어갈 QA 기록: [my-company.md](../../../qa/my-company.md). 기존 case ID와 통과/대기/차단 기록을 보존한다.

## 완료 기준

- [x] /my 진입·기존 가입 진입·중단/뒤로가기·완료/reload를 확인한다
- [x] 외부 return 경로 차단·계정 변경·중복 등록 회귀를 검증한다
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

- 자동 수정 시도: 0/3. 실패 시 명령·오류·원인·최소 수정·재검증 결과를 추가한다.
- Documentation Update Check: 착수 후 판단. base/architecture/data-access/plan/harness/ai-failures 중 영향 문서와 갱신/미갱신 이유를 기록.
- Review Gate: 미실행. verifier와 ai-review의 결과/대상 diff·후속 변경 재검토 여부를 기록.
- 커밋/PR: 없음. 추후 커밋할 때 하나의 목적·영어 type/한국어 메시지, 런타임/테스트/문서는 가능한 별도 커밋.
- 다음 작업 인계: WBS에서 선택. 이 단위의 필수 검증 PASS 전에 다른 기능으로 자동 전환하지 않는다.

## 2026-11-11 · QA-17 전수 점검 보완

- 근거: [감사 CF-15](../audits/2026-11-11.md#cf-15) · [route/API·출처 인덱스](../audits/2026-11-11.json).
- 범위/소유: membership 신청과 회사 간 merge를 UI에서 모두 통합 요청으로 부르는 문맥을 POL-11에서 결정한다. 실제 endpoint는 membership이며 merge 실행 결함으로 단정하지 않는다.
- 추가 완료/재개 기준: 가입/설정 진입별 next/return·이미연결/신청대기·대표/팀원/직급·중단/오류·완료 목적지를 검증한다. 직급은 현재 submit validation이 있으므로 누락으로 오인하지 않는다.
- 이 절은 날짜별 후속 계획이다. 앞선 결정/QA/예외 이력을 대체하지 않으며 제품 구현·실제 업무 API 변경/새 통합 PASS는 없다. 상태는 WBS에서만 관리한다.

<a id="dev-16-pol-11-handoff"></a>

## 2026-11-13 · POL-11의 승인 정책 인계

- 정책 근거: [POL-11 D1/D2·원문/Brief](POL-11.md#pol-11-decisions) · [정책 v1](POL-11.md#pol-11-contract) · [frame/source 대조](POL-11.md#pol-11-investigation). 이번에는 후속 범위/재개 기준만 갱신했으며 DEV-16의 조사/Brief·설계·구현·검증·Git 전달은 시작하지 않았다.
- D1: 기존 `/auth/company` 등록/찾기를 재사용한다. 설정에서 진입하면 모든 중간 링크·검색→신청/등록·번호↔문서/합류·로그인 왕복에 문맥을 유지한다. 최상위 Back은 `/my/company/start`, 하위 Back은 앞 단계, 설정 완료 버튼은 고정 `/my/company`다. Figma 등록 완료 버튼 문구는 ‘마이페이지로 돌아가기’. 기존 가입 진입/완료 `/bids`·건너뛰기 next 의미는 유지한다.
- D2: **Figma의 ‘통합 요청’을 유지하고 설명을 추가하지 않는다.** ‘소속 신청’으로 바꾸자는 추천은 미채택이다. 새 설명/tooltip·배너를 만들지 않으며 Figma가 바뀌면 별도 Gate에서 재검토한다. 내부 membership와 회사 간 합치기의 소유 정책/API 구분은 유지한다. 현재의 모든 시각 차이에 대한 예외 승인은 아니다.
- 구현 범위 후보: `components/my/my-company-client.tsx`의 진입 링크, `app/auth/company/{register,search}`의 페이지/클라이언트와 공유 등록 완료, `auth-gate`/기존 auth 복귀 유틸에 대한 좁은 조합, 의미 있는 순수 복귀/계정 수명 테스트·기존 QA. 정확한 수정 파일/URL 표현은 새 요구사항 Gate에서 확인한다. 새로운 Repository/API·회사 합치기/초대 관리·취소 정책 변경·등록/OCR 재설계는 제외한다.
- 추가 완료 기준: [RCTX-01~15](../../../qa/my-company.md#pol-11-return-qa)의 설정/가입·전환/Back·direct/reload·안전한 return·대표/팀원/직급·이미소속/신청/초대·401/403·중복/오류/계정·완료 후 경고와 Figma 문구를 검증한다. 등록/신청 완료의 실제 최신 overview와 시각 상태를 구분하고, 기존 DEV-15의 본인 취소·Sonner1회·이력과 QA-05/06/07/08 차단/예외를 회귀로 보존한다.
- 실제 QA Gate: 현재 frontend/backend 실행 SHA와 배포의 대응, 실제 wrapper/생성201 vs 게시200·필수 입력/권한·409, disposable 미연결/연결/PENDING/종료/초대·대표/팀원 계정/회사·정확한 기대값, 합성 번호/비식별 증명서·처리/잔존/복구·오류 재현 자원이 필요하다. 사용할 자원/실제 변경 범위·복구 담당/방법은 아직 확보하지 않았다. POL-11의 정책/문서 PASS·Git/Chromatic 예외가 실제 QA 면제나 DEV-16 로컬 선행 예외를 만들지 않는다.
- 다음 자체 Gate 첫 행동: 최신 Git/main·이 정책/인계·현재 관련 source/Figma/개발 Swagger의 변경 유무를 확인하고, URL 문맥/allowlist·후보 파일·계정 수명/완료 및 실제 QA 자원·승인 범위를 담은 Brief/검증 계획을 편집 전에 제시한다. 필요한 미준비 조건만 질문하며 준비 상태를 추정하지 않는다.

<a id="dev-16-brief"></a>

## 2026-11-13 · 이번 Implementation Brief와 승인

- 시작: `main`/`origin/main` = `a8e4900c913e6fb80782b3cbc5b3688248d45ca3`, clean. 선행 POL-11 PR #74 main 반영 확인. 기존 DEV-16 branch/dirty 없음. FF 확인 후 `feat/dev-16-company-return-context` 생성.
- 유형/요구사항: 개발. POL-11 D1/D2에 따라 기존 회사 등록/찾기에서 설정 진입·중간 전환/검색/로그인 복귀·완료를 연결한다. 설정 완료는 고정 `/my/company`, 가입 완료는 기존 `/bids`, 건너뛰기 next 의미 유지. ‘통합 요청’ 유지·부연 설명 추가0.
- 이번 승인자/날짜: 사용자, 2026-11-13 KST. 최초 요청은 DEV-16 개발/검증·두 리뷰·작은 commit/push·PR·최종 CI·정상 main 병합/로컬 FF, **이번 Chromatic 월간 한도만 예외**. 추가 질문에 **‘로컬 선행·실서버 QA 차단 보존 (추천)’** 선택. 과거 Task의 예외를 재사용한 것이 아니다.
- 성공 기준: RCTX-01~14의 해당 로컬 자동/HTTP 대역/실제 Next 브라우저 증거, 외부/비정상 복귀값과 계정·화면 수명/중복·성공 후 세션 실패 회귀, 기존 가입 목적지·취소 이력/Toast 보존, 문서 검사·verifier/ai-review 통과. RCTX-15와 기존 QA-05/06/07/08·MCANCEL12의 실제 통합 차단은 유지한다.
- 범위: 회사 시작 링크, 기존 등록 방법/번호/문서·검색/신청 페이지, 공유 완료 화면, 순수 복귀 경로 유틸과 좁은 계정/화면 수명 방어, 의미 있는 테스트·QA·WBS/작업/공통 사실 문서.
- 제외: 실제 업무 API/등록/신청·업로드/OCR·메일/문서 처리·운영/배포, 새 Repository/endpoint/DTO·새 의존성, 회사 간 합치기/초대/취소 정책, 화면 전체 재설계, 다음 Task 실행.
- 확인한 파일/패턴: `src/components/my/my-company-client.tsx`, `app/auth/company`의5개 route/클라이언트, `components/auth/{account-scope,auth-gate,company-registration}.tsx`, `lib/auth-redirect.ts`, auth session-controller/Provider, 공개 company client·HTTP/mock 경계와 기존 회사/인증 테스트, package scripts/Node pin. API 설계 전 data-access.md 확인.
- 설계/편집 대상: `src/lib/company-flow.ts`에 허용된 설정 문맥/검색값만 정규화·고정 경로 조합. 위5개 route는 서버 searchParams에서 파싱해 props로 전달. 모든 링크·AuthGate nextPath·완료 CTA를 조합. 계정 epoch/단일 제출·화면 종료 확인을 회사 flow 범위에서 사용하고 계정 전환 뒤 업로드 후속 요청/저장·완료 노출을 막는다. 최종401은 로그인 복귀,403은 오류 유지. 등록 성공 뒤 refresh 실패는 완료/경고를 보존한다.
- 낮은 위험 선택: URL 표현은 `from=settings` 하나와 검증된 `query/page`만 사용하며 raw returnTo는 전달하지 않는다. 완료 CTA는 기존 ButtonLink/xxl 토큰을 재사용한다. 새 정책 결정 없음.
- 위험: 같은 계정 재로그인과 refresh 만료/명시 로그아웃의 구분, 다단계 업로드 중 계정 교체, 검색 페이지 복원·중복 query, 후속401. 순수 수명 테스트·HTTP 대역·브라우저에서 따로 확인한다.
- 검증 계획: Node22.20.0/pnpm11.3.0, `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm build-storybook`, `git diff --check`. mock/HTTP 대역과 실제 Next desktop/390/320px·키보드/직접 URL/reload·계정/완료 회귀를 구분. 문서 링크/79원본·114Task/156의존성/DAG·단일 활성/보존 검사. 실제 업무 API는 실행0으로 유지.
- 다음 행동: 위 설계의 순수 URL/수명 조합 → 기존 화면 연결 → 자동/브라우저 검증. 리뷰 전 Documentation Update Check 수행.

<a id="dev-16-investigation"></a>

## 2026-11-13 · 현행 근거 재확인

- backend dev `befe434c2b3fd80ddbc12c1d6216f738dd5ea12a`, main `8f522d0876a70edf61b8f5456a11c51756f60372`, 중앙 정책 main `c9e50ff591ae18023164e1a94581c611bf1e4f29`: `git ls-remote`로 POL-11 고정 근거와 동일 확인. 현재 search controller blob `53fd8037d5ca74eceeb1966c621707d6cd773b57`도 GitHub connector로 재확인. 나머지 정책/계약은 같은 SHA의 [POL-11 선별 근거](../reviews/POL-11-sources.json)를 사용한다.
- 개발 OpenAPI GET200, 184paths·OpenAPI3.1.0, 전체 SHA256 `30b46f3eca639a412659fe2a18f5908c6695786b4134d8319705dba095197164`: POL-11과 동일. 검색/신청/등록/connection7경로·응답 상태를 확인했다. 게시 `success`/현재 wire `isSuccess`, 신청 source201/게시200·required 차이는 미해결 실응답 확인 대상으로 유지.
- 배포 기록은 [POL-11에서 확인한 run43170618340](https://github.com/mate-pjt/mate-backend/actions/runs/43170618340)의 당시 증거다. 이번 실행 process SHA/배포 대응·실제 업무 응답은 미확인/미실행이며 source나 게시 OpenAPI로 대체하지 않는다.
- Figma 완료 CTA [3162:51949](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3162-51949)의 현재 design-context/이미지에서 ‘마이페이지로 돌아가기’·기존 xxl 토큰과 일치 확인. 검색/등록·신청의 나머지 근거는 [POL-11 frame/상태 대조](POL-11.md#pol-11-investigation)와 이번 영향 범위로 연결한다. 전 화면/pixel·모든 하위 상태의 시각 PASS를 주장하지 않는다.


### 구현/검증 중간 체크포인트

- 진입/검색·완료 경로와 계정 epoch·화면 수명/제출 lock을 기존 흐름에 연결했다. 공유 AuthGate의 명시 재로그인 분기로 최종401에서도 검증된 next를 유지한다. AccountScope는 refresh 만료와 명시 로그인/로그아웃을 구분한다.
- 자동 수정 **1/3**: 최초 `pnpm test` 503통과/2실패. 새 HTTP 대역 테스트가 기존 `createHttpClient(baseUrl, fetcher)`의 인자를 객체로 잘못 전달한 테스트 작성 오류였다. 실제 API/제품 계약 실패가 아니며 기존 factory 시그니처에 맞춰 수정 후 전체 재실행한다.
- 실제 업무 API 실행0. 다음 행동: 전체 자동 검사와 mock Next 브라우저의 설정/가입·등록/신청·계정/오류/모바일 검증.

- 재검증: Node22.20.0의 전체 **505 tests**, lint, api/local 앱 build, Storybook build PASS. Storybook의 기존 chunk 크기 경고는 비차단. 새 라이브러리/설정 변경 없음.
- mock 실제 Next 브라우저: 설정 번호/문서 등록과 팀원 신청 완료→고정 회사 복귀, query 복원/빈 결과 전환·계정 격리, 연결 계정 신청 차단, 직급 누락 안내,320/390px 넘침0·키보드 완료 복귀 확인. 기존 취소→빈 화면/성공 Toast1회도 확인. 증명서 reload의 처리 복원, 가입 번호 완료 href `/bids`, 중복 from/외부 return의 기본 가입 경로를 확인했다.
- HTTP 대역 브라우저를 위해 mock 프로세스만 종료하고 같은 로컬3016에서 api 프로필·명시 loopback4016 대역을 실행한다. 대역은 합성 응답만 제공하며 실제 API/OAuth/업로드 호출은 없다. 시나리오/시각·범위와 최종 결과는 QA/리뷰에 기록한다.

- 독립 verifier 예비 지적에 따른 자동 수정 **2/3**: 신청 POST의2xx 응답에서 JSON/wrapper/data를 확인하지 못해도 재제출 가능했던 분기를 미확정으로 교정한다. HTTP 경계의 잘못된 requestId/PENDING/대상 회사 결과도 오류로 남겨 거짓 완료를 막는다. 실패/응답 유실·409와 동일하게 현재 상태 확인으로 연결하고 회귀 테스트/HTTP 대역 브라우저를 추가한다. 전체 재검증·최종 독립 리뷰 대상에 포함한다.

- 동일한 독립 리뷰 수정2/3 범위에서 번호/문서 등록의 불완전한2xx data도 최소 companyId/membershipId·기존 string role/verificationStatus를 검사한다. 새 enum/정책을 만들지 않고 잘못된 결과에는 완료·후속 refresh를 실행하지 않는다. 기존 멱등 key/명시 재시도는 유지하고 미확정 안내에서 최신 회사 상태 확인 링크를 제공한다.


<a id="dev-16-verification"></a>

## 2026-11-13 · 최종 검증/문서 체크포인트

- 최종 코드에서 **524 tests·lint·api/local 앱 build·Storybook build PASS**. [RCTX-L01~12](../../../qa/my-company.md#dev-16-local-qa)의 실제 Next mock/HTTP 대역 증거·PNG6개/선별 JSON을 추가했다. 특수 화면의 source-only/자동 검사·완전 Network 캡처 미실행·전수 pixel 미검증을 별도 표기했다. 실제 업무 API0·RCTX-15 실서버 차단을 보존한다.
- [Context Audit](../reviews/DEV-16-context.md) PASS. Documentation Update Check: architecture/data-access에 URL/계정 수명·최소 성공 검증을, plan에 이번 범위/승인·근거를, ai-failures에 독립 검토의2xx 성공 오판 원인/예방을 반영했다. base/package/scripts·하네스 변화가 없어 base/harness 미갱신. WBS/이번 Task/기존 QA의 과거 이력·coverage79/Task114/의존성156은 보존한다.
- 전역 브랜드/닫기 홈 링크는 기존 전역 탐색으로 유지한다. 요구된 단계 Back/로그인 next/완료 목적지를 보완한 범위이며 전체 화면 예외 승인으로 해석하지 않는다.
- 다음 행동: 문서 링크/ID/DAG·과거 prefix/기준선 보존·민감 패턴·Markdown/diff 검사와 최종 ai-review 여섯 절·read-only verifier 재검토. 통과 후 체크리스트/WBS 종료·다음 하나 선정/인계, 종료 freshness 후 목적별 commit/push/PR·실제 최종 head CI·정상 병합/main FF를 이어간다.


<a id="dev-16-review-close"></a>

## 2026-11-13 · 검증/두 리뷰 PASS와 종료 인계

- **DEV-16 승인된 로컬 범위 PASS**: 524 tests·lint·앱/Storybook build·문서 검사, Context Audit·ai-review 여섯 절/독립 verifier PASS. 독립 검토가 동일524 tests·문서38파일/9MD·526상대 링크·79/114/156/DAG/PNG6지문을 직접 재확인했다. Blocker/Major/Minor0. 최초 Major2는 수정/재검증했고 검토 지문은 `0a4d7c50ab48cf57b5409f16ef2c25af289052e4e14fae9126b68eaa6ee4b0a6`이다.
- 이번 실제 업무 API 실행0·신규 실제 통합 PASS0. RCTX-L의 source-only/부분 시각·Network 한계와 RCTX-15/기존 MCO/MCANCEL·AUTH/타 Task 차단/예외를 보존한다. 완료 판정은 사용자가 승인한 로컬 단위이며 원래 실제 QA의 성공 판정이 아니다.
- 응답 검증의 source 근거도 재확인: 동일 backend SHA의 `CompanyRegistrationResponse` blob `9bdb541315c4914409259127eea85fb5b4d4e6b6`와 `UnverifiedCompanyRegistrationResponse` blob `329c37931f2e905993ff77d648dcf1558d83ab9f`가 companyId/membershipId:Long·role/verificationStatus:String을 제공한다. 등록 명령 최소 검증은 이 기존 필드만 사용한다. 실행 서버/실제 응답 확인은 아니다.
- 다음은 **POL-12 하나**를 선정·인계한다. WBS 대기/준비와 완료 선행을 비교해 해소 가능한 P0/P1 대기0·POL-06 완료/P2 기본 표 순서 첫 후보임을 확인했다. 갱신·비교 선택 적용·직접 편집/로고의 자료 출처/기준일·권한·충돌 계약을 자체 정책 Gate에서 다룬다.
- 다음 첫 행동: 새 대화에서 최신 Git/main·POL-12 정의/완료 기준·POL-06 결정·관련 실제 QA 차단을 확인하고 현행 소유 정책/source·개발 Swagger를 대조한 Brief/검증 계획을 편집 전에 제시한다. 비교 후 선택 적용은 아직 추천이며 승인으로 확정하지 않는다. 이번에는 다음 Task의 조사·정책 선택·설계·구현·검증·Git 전달을 시작하지 않았다. [인계](POL-12.md#pol-12-dev-16-handoff).
- Git 전달은 다음 단계다. 저장소 merge commit 허용·rulesets0·main Branch not protected를 현재 조회했으며 설정 변경/우회0. 작은 이력을 보존해 commit/push/PR·실제 최종 head CI/리뷰 조건·정상 main 병합·로컬 FF/SHA·clean을 확인한다. 이 시점에는 병합/main 동기화 미완료다.
- 위 종료/소유 source/인계 메타데이터 추가에 문서 검사·ai-review 재검토와 같은 read-only verifier freshness를 수행한 뒤 커밋한다. 제품 동작/실제 QA 승인 범위는 바뀌지 않았다.

- 종료 freshness까지 primary/독립 verifier **PASS**, Blocker/Major/Minor0. 문서39파일/10MD·544상대 링크·79/114/156·활성0/PNG6·다음 POL-12 선행/집계와 source 응답2blob·runtime/test 불변 지문을 직접 확인했다. 이 결과의 문자 그대로 기록은 소스/정책/QA/선정 변화가 없어 primary/문서 검사 후 별도 반복 독립 검토를 생략한다. 뒤의 PR receipt에는 해당 추가분을 다시 검토한다.

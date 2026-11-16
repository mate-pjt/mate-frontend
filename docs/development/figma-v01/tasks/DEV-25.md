# DEV-25 · 보관 문서 삭제·완료 피드백

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: F03
- 선행 작업: [DEV-23](DEV-23.md)
- 목적/범위: 정해진 삭제 의미와 권한에 따라 확인/명령/완료를 연결한다.
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

## 완료 기준

- [ ] 취소·중복·이미 삭제·권한·버전 충돌/실패를 확인한다
- [ ] 삭제 뒤 목록/상세/다운로드·자료 참조 일관성을 검증한다
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

<a id="dev-25-pol-13-handoff"></a>

## 2026-11-16 · POL-13 정책/후속 Gate 인계

- [POL-13 사용자 D1/D2/D3·v1](POL-13.md#pol-13-contract)과 [DBOX 미실행 계획](../../../qa/company-documents.md#pol-13-document-qa)을 후속 기준으로 받는다.
- DEV-23 선행 뒤 DELETE documentId가 모든 version을 포함한 series 전체라는 의미로 확인/취소·중복 억제·확인된 응답 뒤 기존 Toast 완료를 연결한다. 서버의 권한/문서 lock·재삭제 동일 결과를 따르며 임의 expectedVersion을 추가하지 않는다.
- 404는 없는/권한없음이 섞여 무조건 완료로 만들지 않는다. timeout/5xx/손상2xx·성공 뒤 조회 실패를 구분하고 자동 재삭제하지 않는다. 삭제 즉시 신규 접근 제외·30일 뒤 비동기 파기 대상·사용자 복원 없음이며 기존2분 티켓의 즉시 무효화/정확한 파기 완료 시각은 보장하지 않는다.
- DBOX-17~22로 교체/삭제/polling 경합·계정/권한·티켓 잔여·근거 참조 해제/인증 상태 구분·키보드/모바일을 검증한다. disposable 문서와 삭제/잔존/복구·실행 권한이 필요하며 이번에 실제 삭제·운영 worker/시간 변경을 승인하지 않았다.
- 기준/인계만 수행했다. 이 Task 자체 Gate·제품/실제 API·파일/OCR/삭제·별도 Git 전달은 시작하지 않았다. 현재/다음/상태는 WBS만 관리한다.

<a id="dev-25-dev-24-handoff"></a>

## 2026-11-16 · DEV-24 로컬 단위 뒤 선정/인계

- [DEV-24 종료/선정](DEV-24.md#dev-24-close)의 로컬 재업로드 결과만 받는다. DEV-24 신규 추가/실통합 차단과 MAT-162·기존 QA는 유지하며 현재/다음/상태는 WBS만 소유한다.
- 선정 이유: 해소 가능한 앞선 P0/P1 후보는 정책/검증 자원/선행 차단이 남아 있고 앞선 P2 회사 갱신은 DEV-08, DEV-26은 DEV-19/DEV-24·MAT-162에 의존한다. DEV-23 선행이 충족된 DEV-25가 기본 표 순서에서 다음 독립 자체 Gate 후보다. 정의/완료 기준/선행을 확인한 선정이며 전용 API/Figma 조사·설계·구현은 시작하지 않았다.
- 다음 첫 행동: 최신 Git/main·DEV-23/POL-13·상세/원본/재업로드의 수명 경계를 읽고, 그때의 backend/Swagger에서 series 전체 삭제·권한/재삭제/404·응답 유실/성공 뒤 갱신 실패·30일 비동기 파기·티켓 잔여/근거 참조 계약을 대조한다. disposable 자원과 실제 사용·삭제·잔존·복구/기관 영향 범위를 구분하고 자체 Brief/수정 파일·영향·검증 계획을 편집 전에 제시한다.
- 이번 D1 로컬 선행·Chromatic/Git 전달·실제 QA 차단 선택은 DEV-24에만 적용한다. DEV-25 실제 삭제/worker·제품 구현·새 정책/endpoint·별도 Git 전달을 시작하거나 승인받은 것으로 세지 않는다.

<a id="dev-25-investigation"></a>

## 2026-11-16 · 요구사항 Gate 조사 체크포인트

- 시작: clean `main`/`cef469dcd8e70c372f6572bc2b00c7df5b18adf7`, fetch 뒤 origin/main과 ahead/behind0/0. DEV-23/24의 PR80/81 선행 변경이 main에 있으며 기존 미커밋 변경0이다. 이번 브랜치는 `feat/dev-25-document-delete`다. 다른 worktree/기존 작업은 수정하지 않았다.
- 이번 승인: 사용자 요청의 DEV-25 하나·구현/검증·read-only verifier/ai-review·목적별 commit/push·PR/최종 CI·조건 충족 시 정상 merge/로컬 main FF. 이번 Chromatic 월간 한도만 예외다. 실제 업무 문서 삭제/티켓/파일/OCR·30일 worker/시간 변경·외부 메시지·운영/배포·다음 Task 실행을 Git 승인으로 대신하지 않는다.
- 현행 근거: backend dev `adc0e265ef0e2aa78ccb376e1fa322edd664b290`, main `4b5f31de578c41e698dda9c99e66149b7292f031`, 중앙 main `c9e50ff591ae18023164e1a94581c611bf1e4f29`. [배포 기록](https://github.com/mate-pjt/mate-backend/actions/runs/43389204151)의 dev SHA/completed/success를 재확인했다. [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs)는 Aside에서 GET200·3.1.0/v1이며 DELETE에는 documentId만, 응답에는 deletedAt/purgeAt가 있다. 게시 success/실제 wire isSuccess 차이·현재 실행process SHA/실제 업무 응답·disposable 자원/사용·삭제·잔존·복구 범위는 미확인이다.
- [삭제 service](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companydocument/DeleteCompanyDocumentService.kt)와 [persistence](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companydocument/CompanyDocumentDeletionPersistenceAdapter.kt)는 권한/없는 문서의 같은404·row lock·전체 series·권한 있는 재삭제의 동일 시각 결과·삭제+30일 예정 의미를 확인한다. expectedVersion/body/추측한 멱등 키는 없다. [파기 소스](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companydocument/CompanyDocumentPurgePersistenceAdapter.kt)의 근거 참조 해제/tombstone을 회사 인증 자동 강등으로 설명하지 않는다.
- Figma [삭제 후 frame3135:80545](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-80545)와 [Toast3191:56241](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3191-56241)의 design context/screenshot을 확인했다. 원문 ‘미인증 상태’는 POL-13 D2의 확정 의미와 다르므로 완료 문구는 삭제 사실만 알린다. 기존 Toast/BasicPopup/토큰 재사용·상세 지우기 연결이며 화면 전체의 Figma 예외/모든 frame 시각 PASS가 아니다.
- 수행 한계: 첫 Figma 응답에서 임시 asset 주소를 선별 없이 도구 출력에 포함했다. 사용자에게 알리고 이후 node/치수/필요 문구만 allowlist 출력했다. 원문 주소를 코드/문서/QA/PR에 저장하지 않으며 기존 도구 출력 삭제를 주장하지 않는다. 실제 계정/업무 API·환경파일 조회와 구분한다.
- Gate 질문: 실제 삭제 QA 자원/사용·삭제·잔존·복구와 실행 대응이 없으므로 ‘이번 로컬 mock/HTTP 대역 구현·검증 선행, 실제 DBOX-17~22/worker 파기 QA 차단 유지’를 추천해 사용자 답변을 요청했다. 과거 Task의 로컬 선행 예외를 승계하지 않는다. 답변 전 제품 편집/실제 삭제0건이며 독립적인 소스·패턴/검증 환경 조사만 계속한다.
- 편집 전 계획을 제시했다: company 계약/client/HTTP/mock·삭제 mapper/controller/dialog와 상세 연결, 테스트·Task/QA/WBS·추적/개발 문서. 전체 버전/취소/중복/권한·404/미확정·성공 뒤 갱신 실패/계정·회사/화면 수명/원본 해제를 검증한다. test/lint·API/mock/hybrid build·Storybook build·실제 Next 합성 브라우저/문서 검사·두 리뷰를 계획한다. 새 library/다른 제품/서버 worker는 제외한다.
- 다음 행동: 범위 답변을 받은 뒤 확정 Brief/설계·WBS 진행을 기록하고 제품 구현한다. 실제 DBOX QA는 승인/자원 없이 실행하지 않는다.

<a id="dev-25-brief"></a>

## 2026-11-16 · 사용자 결정과 Implementation Brief

- D1/결정자·원문: 2026-11-16 사용자 **‘로컬 mock·HTTP 대역 구현/검증 선행, 실제 삭제·30일 파기 QA는 차단 유지 (추천)’** 선택. 이번 DEV-25만의 확정 범위이며 이전 예외를 승계한 것이 아니다. Git 전달은 최초 요청으로 이미 승인됐다.
- 요구사항: 보관 문서 상세의 지우기를 전체 series 삭제 확인/취소·명시 명령·확인된 완료/목록 갱신과 연결한다. 성공 기준은 전체 버전/복원 없음 안내·취소0요청·제출 중복 억제·deletedAt/purgeAt 검증 뒤만 성공/Toast1회, 삭제 즉시 이전 상세/Blob/늦은 응답 제거, 권한·404/409·timeout/5xx/손상2xx와 성공 뒤 목록 갱신 실패/최종401 구분이다.
- 범위: company 공개 Document 포트·client·HTTP 응답 경계·계정별 mock tombstone, 순수 삭제 controller/native dialog/기존 BasicPopup·Toast·상세 연결, 회귀/실제 Next 합성 브라우저·관련 문서/두 리뷰/Git 전달. 삭제는 선택된 과거 version만이 아닌 documentId 전체이며 expectedVersion/새 endpoint·멱등 키를 만들지 않는다.
- 제외: 신규 추가·회사 profile/OCR 반영/MAT-162·실제 업무 조회/티켓/파일/OCR/삭제·worker/시간 이동·기관 호출·외부 메시지·운영/배포·다음 Task 실행. DBOX-17~22 실통합/30일 파기와 기존 QA 차단을 보존한다.
- 확인한 파일/패턴: company contracts/client/HTTP·document-box/detail/upload mapper와 계정별 mock/store·문서 목록/상세/original/reupload controller, 세션 epoch/회사 문맥·native dialog close→unmount 초점 복귀·BasicPopup/Sonner/기존 Tailwind 토큰. 신규 library·공급원7그룹/snapshot/hybrid/production guard·전역 storage schema는 바꾸지 않는다.
- 수정 파일/영향: `data/company/{contracts,client,http-repository,mock-repository}.ts`와 삭제 응답 mapper, `features/company/document-deletion.ts`·`components/my/document-deletion-dialog.tsx` 추가, `my-document-detail-client.tsx` 연결. 삭제된 mock은 목록/모든 version metadata·원본/업로드/처리·proposal 접근을 차단하고 재삭제 시 같은 시각 결과를 보존한다. 회사 인증 상태를 자동 변경하거나 worker 파기를 mock으로 주장하지 않는다.
- 구현 단계: 공개 결과·검증된 HTTP DELETE/기존 mock 수명 보완 → 중복/계정·회사/화면 종료·응답 미확정 controller → 상세의 원본 해제·삭제 후 화면/목록 갱신과 dialog → 계약/상태·회귀/브라우저 검증 → 문서/두 리뷰/목적별 Git 전달.
- 위험/낮은 위험 가정: 서버 leaf가 최종 권한이며 role 이름으로 허용하지 않는다. 404는 삭제 성공 증거가 아니고, 삭제 명령을 자동 재전송하지 않는다. 상태 확인/목록 재조회만 명시 재시도하며 성공 결과와 후속 조회/로그인 실패를 별도로 보존한다. 이미 저장한 파일/발급 티켓 즉시 회수·정확한30일 파기 완료/회사 인증 자동 강등을 약속하지 않는다. Figma Toast의 미인증 문구는 POL-13 의미에 따라 삭제 사실만 알리고 기존 스타일을 재사용한다.
- 검증: Node22.20.0/pnpm11.3.0, 실제 scripts `pnpm test`, `pnpm lint`, API/mock/hybrid Preview `pnpm build`, `pnpm build-storybook`, `git diff --check`. `.env`를 읽거나 복사하지 않은 격리 소스/의존성 snapshot에서 실행한다. 실제 Next mock·loopback HTTP 대역으로 정상/취소/중복·404/409/401/미확정/성공 뒤 갱신 실패·원본 해제/계정·회사/탐색·좁은 화면/키보드를 확인한다. 문서 링크/ID·79coverage/114Task/156의존·기준선/QA 보존·Markdown과 read-only verifier/ai-review를 수행한다.
- 시작 기준: `feat/dev-25-document-delete`/`cef469dcd8e70c372f6572bc2b00c7df5b18adf7`, 이번 조사 기록2파일 외 기존 변경0. 자동 수정0/3. 다음 첫 행동은 위 공개 삭제 계약/HTTP/mock 구현이다. 실제 통합 판정·로컬 단위 PASS·main 반영은 각각 기록한다.

## 2026-11-16 · 구현/초기 검증 체크포인트

- 공개 삭제 결과와 최소 응답 검증·body 없는 DELETE, mock의 optional tombstone/재삭제·목록/모든 version·원본/업로드/처리/proposal 재생 차단, 순수 controller와 native dialog/상세 연결을 구현했다. 확인된 성공 뒤만 원본/상세 해제·Toast1회와 목록 GET/유효 page 복귀를 수행하고 성공 뒤 조회 실패/최종401은 완료와 분리한다. 실제 업무 API/삭제0건이다.
- `.env` 없는 격리 snapshot·Node22.20.0/pnpm11.3.0에서 첫 test697개 assertion은 통과했으나 병렬 생성한 rejection을 순차 검증하던 새 테스트에서 unhandled rejection3건이 발생했다. lint는 controller 생성 콜백의 ref 접근을 render-time 가능성으로 검출했다. 첫 자동 수정1/3: Promise.all로 즉시 rejection matcher를 부착하고 완료 콜백은 state만 변경·effect에서 dialog close/탐색하도록 수정했다. 다음 행동은 test/lint 재검증과3구성/Storybook build·합성 브라우저 검증이다.
- 위 수정 후 test697/26파일·lint·API/mock/hybrid 및 Storybook build가 통과했다. 브라우저 취소에서 불필요한 상세 reload가 native trigger 초점을 제목으로 옮기는 것을 확인해 두 번째 수정2/3으로 제출 전 취소는 화면 유지·원본 controller 재활성화, 제출 뒤 닫기만 현재 상태 재조회를 수행하도록 분리했다. 해당 source/test를 양쪽 격리 실행본에 동기화하고 전체 검증을 다시 수행한다.
- 수행 한계 추가: Aside 대화형 CLI 시작 출력에 불필요한 계정 식별 metadata가 자동 포함됐다. 사용자에게 알리고 값을 Task/QA/PR에 재인용하지 않는다. 후속 도구 출력은 비식별 브라우저 상태/명령 결과만 사용하며 실제 계정/업무 응답·credential·환경파일을 조회한 것은 아니다. 일회성 REPL의 탭 수명이 끝나는 동작은 지속 REPL로 전환했고, build/dev의 동일 격리 경로 공유는 소유 dev 재시작/캐시 분리로 교정했다. 제품 실패/실제 API 결과와 구분한다.
- mock 실제 Next에서 인증 응답의 nullable 회사와 company 공급원의 연결 회사가 독립인 조합을 확인했다. 세 번째 최소 수정3/3: 삭제의 초기 회사는 공개 company 문맥에서 확보하고 제출/후속 재조회마다 같은 회사인지 확인한다. auth companyContext를 company mock의 권한/귀속으로 대신하지 않는다. 미귀속 owner도 회사 목록을 추측하지 않으며 두 회귀를 추가했다. 이후 source/HTTP 대역/전체 mock·전수 test/lint/3구성/Storybook을 재검증하고 실패가 지속되면 자동 수정을 멈춘다.
- 세 번째 검증 세트의 primary 사전 점검에서 기존 DEV-15 최종401 예방 규칙을 적용해 삭제 dialog의401을 상세에도 전달하고 보호 metadata/원본을 숨긴다. 확인된 삭제 결과는 이와 별도로 보존한다. 후속 source 지문으로 검증 snapshot을 다시 맞추며 선행 빌드를 최종 source PASS로 사용하지 않는다.

<a id="dev-25-verification"></a>

## 2026-11-16 · 최종 로컬 검증과 Documentation Update Check

- Node22.20.0/pnpm11.3.0·`.env` 없는 최종 source/test261파일 snapshot에서 `pnpm test`699/699·26파일, `pnpm lint`, API/mock/hybrid Preview `pnpm build`, `pnpm build-storybook` PASS. 세 실행본의 source/test 지문이 작업트리와 같음을 확인했다. Storybook의 기존 import/chunk 안내는 비차단이며 새 dependency/설정은 없다.
- [DBOX-DEL01~18](../../../qa/company-documents.md#dev-25-local-qa)에 실제 Next mock·loopback HTTP/Node/source 근거를 구분했다. 취소0요청/초점·과거 버전에서 전체 삭제·원본 revoke1/preview0·중복·Toast1/reload 재생0·404/409/408/503/손상2xx·성공 뒤 조회503/401/세션 해제·탐색/계정/회사/모바일을 확인했다. 실제 서버/파일/OCR/삭제/worker는0건이다.
- 전송/도구 한계:408의 Chromium wire3회/401의 기존 인증 재요청2회와 앱의 자동 재삭제0을 구분한다. 나머지 오류·지연/성공 뒤 조회의 DELETE는1회다.1px 합성 이미지의 AX visibility·Aside request 이벤트 미지원·전역 성공 제목과 Toast의 text2개는 DOM/Blob 계수·performance origin·알림 region 계수로 검증 범위를 명시했다. 상세/전체 pixel·실제 packet 전수·VoiceOver/Safari·실제 storage/장기 worker PASS로 확대하지 않는다.
- 실제 DBOX-17~22는 사용자 D1대로0통과·6차단, 전체22사례는 기존 이력을 유지한 고유21차단/1대기(16)다. 실행 SHA/실제 wire/권한·disposable version/계정/회사·사용/삭제/잔존/복구·worker 격리 승인 뒤 재개한다. 회사/가입 QA·DEV-08/MAT-162/DEV-24 신규 추가와 다른 Task 예외는 바꾸지 않았다.
- Documentation Update Check: architecture/data-access/repositories에 공개 삭제·수명/회사 공급원·응답/비저장/mock 경계를, plan/coverage·Task/QA/WBS에 날짜별 범위/증거/차단을 반영했다. ai-failures에는 실제 문맥/초점/검증·원격 출력 재발과 전송 계수 예방을 남겼다. base는 package/scripts/runtime 규칙 불변, harness는 역할/순서/구성 불변이라 갱신 불필요다. context-audit는 read-only로 수행하고 확인된 동기화만 이번 문서 편집으로 반영했다.
- React 체크: 두 TSX는 기존 primitives/Tailwind 토큰·native dialog/효과 cleanup·안정된 controller/callback과 계정/회사·완료 notice 수명을 점검했다. 새 UI library·전역 상태/서버 가변 공유·API/DTO 직접 import·파일/서명 저장을 추가하지 않았다.
- 다음 행동: 문서 링크/ID·의존성/상태·원본/QA 보존·형식/diff-check, primary ai-review 여섯 섹션·read-only verifier. 미해결 Blocker/Major가 없으면 승인 로컬 단위 판정/다음 POL-14 후보의 선정·인계만 기록하고 freshness 검토 뒤 목적별 Git 전달한다. 다른 Task 조사는 시작하지 않았다.

<a id="dev-25-close"></a>

## 2026-11-16 · 승인 로컬 단위 판정·리뷰와 다음 하나

- D1 승인 로컬 단위 **PASS**: 전체 series 확인/취소·명령/응답 검증·상세/원본 해제·목록 갱신과 오류/미확정·성공 뒤 조회/세션 실패·계정/회사/탐색 수명을 구현했다.699 tests/26파일·lint·3구성/Storybook·DBOX-DEL01~18의 브라우저/Node/source 구분·문서1286/1286·diff-check와 context-audit/primary 여섯 섹션·독립 verifier PASS다. 실제 업무 API/삭제·worker0건이며 DBOX 실제6차단은 유지한다.
- 독립 verifier는 동일 source/test261파일과 diff 지문 `151b4d6f55452134582c8bae4e4f51be8f1387249fcd78d8c1c246e6afd4927f`를 직접 확인하고 test699/lint·문서1286/diff-check를 재실행했다. Blocker/Major0, Minor2(가이드의 목록200/행 제외와 개별404 구분·DEL16 proposal replay의 source-only 근거)를 제시했다. 두 문구를 정밀화했으며 런타임/테스트는 바꾸지 않았다. 종료/인계 metadata를 포함해 문서 검사·primary 재검토와 독립 freshness를 다시 수행한다.
- 문서 검사 초안의 미완성 리뷰 링크와 기존 상세 QA의 DBOX-DL ID 중복은 새 삭제 QA를 DBOX-DEL01~18로 분리하고 리뷰 파일을 완성해 해소했다. 원본 QA/Task/coverage prefix와 기준선은 보존했다. 최종 결과와 후속 검토는 [검토 기록](../reviews/DEV-25.md)에 남긴다.
- 다음 하나는 [POL-14](POL-14.md#pol-14-dev-25-handoff)다. WBS의 대기/준비 후보 중 선행 완료인 작업을 확인하니 P0/P1 해소 가능 후보는 없고, P2 기본 순서의 첫 후보가 DOC-001이 충족된 POL-14였다. DEV-26은 DEV-19/DEV-24·MAT-162, 앞선 회사 갱신은 DEV-08/계약/자원 조건이 남는다. 우선순위/의존성을 변경하지 않고 다른 기존 차단을 유지한다.
- POL-14는 팀원 행동별 권한·최후 관리자·초대/합류/직급 계약을 정리하는 정책 Task다. 다음 첫 행동은 최신 Git/main·POL-14 정의/선행과 당시 중앙 정책/백엔드·개발 Swagger를 확인하고 실제 지원/미결 결정·후속 DEV 범위/QA 재개 기준을 구분해 자체 Brief를 제시하는 것이다. 이번에는 정의/선행/순서와 첫 행동 인계만 했으며 전용 API/Figma/정책 조사·설계·제품 구현·실제 초대/메일·운영은 시작하지 않았다. DEV-25 D1/Git/Chromatic 승인을 POL-14에 승계하지 않는다.
- Git 전달은 최초 사용자 요청대로 목적별 작은 commit/push·PR 템플릿/type 라벨·최종 head의 CI/원격 리뷰·정상 merge/로컬 main FF를 진행한다. 이번 Chromatic 월간 한도만 예외이며 source/Task PASS·실제 API 차단·main 반영을 구분한다. 실제 PR/head/CI/main SHA·clean 결과는 생성 뒤 체크포인트·종료 보고/세션 delivery receipt에서 확인한다. force/직접 main push/보호 우회/검사 강제 성공 없음.

### D1 종료 체크리스트

- [x] 승인된 로컬 제품/계약·테스트·브라우저/source 증거와 실제 QA 차단을 분리했다.
- [x] Documentation Update Check·원본/범위 보존과 primary/독립 리뷰를 수행했다. 후속 metadata freshness는 아래 검토 결과로 확인한다.
- [x] 다음 POL-14 하나를 선정하고 첫 행동만 인계했다. 다른 Task 실행 없음.

## 2026-11-16 · 종료 freshness와 Git 전달 체크포인트

- 독립 freshness **PASS**, 미해결 Blocker/Major/Minor0. Minor2의 문구와 WBS 최상단 현재 없음/DEV-25 완료/POL-14 준비·집계 일치를 재확인했다. 독립 문서1311/1311·diff-check, parent의 현재/다음-행 일치 추가검사 포함1313/1313이다. source/test261파일·최초 diff 지문이 같아 제품 명령을 다시 실행할 이유가 없고 실제6차단/다른 Task 범위를 유지한다. [최종 리뷰/후속 기록 기준](../reviews/DEV-25.md)을 따른다.
- 소유 Next2/합성 API1·브라우저 탭2를 종료하고3025/3026/4325 listener0을 확인했다. 실제 데이터/서비스 조작0건이며 격리 합성 자료/로그/비민감 receipt만 세션 evidence에 보존했다.
- 다음 행동: 런타임·테스트·계약 안내 문서·검증/인계를 목적별 commit으로 분리해 push/PR을 생성한다. 템플릿/type:feature·type:test·type:docs 라벨·최종 head CI/원격 리뷰/정상 merge·로컬 main FF/clean·SHA 일치를 확인한다. PR 연결/결과 영수증만 추가하면 문서 검사/primary 재확인을 기록하고 독립 재실행을 생략하는 사유를 명시한다. 추가 제품/정책/실제 업무 실행은 없다.

# POL-10 · 소속 신청 취소 계약·권한 결정

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 정책 결정
- 원본 항목: M05
- 선행 작업: [DOC-001](DOC-001.md)
- 목적/범위: 신청 취소 가능 상태·동시 승인·권한·반환 결과를 확정한다. 추천: 취소 상태 조회와 취소 명령을 분리한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### M05 · 소속 신청 취소
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **프론트 계약 없음**. 검증: 코드 대조.
- 남은 점: 취소 상태 조회와 달리 사용자가 취소하는 명령·화면을 구현
- Figma: [3162:52416](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3162-52416)
- 소유 소스/기존 기록: [src/components/my/my-company-client.tsx:230](../../../../src/components/my/my-company-client.tsx)、[src/data/company/contracts.ts:199](../../../../src/data/company/contracts.ts)

## 완료 기준

- [x] 현재 신청 상태 모델과 서버 명령 지원을 확인한다
- [x] 중복/이미 처리됨·세션 갱신·완료 목적지를 확정한다
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

- 근거: [감사 CF-21](../audits/2026-11-11.md#cf-21) · [route/API·출처 인덱스](../audits/2026-11-11.json).
- 범위/소유: 현재 Swagger에 신청취소 DELETE와 필수 expectedVersion이 있다. endpoint 부재로 재질문하기 전에 최신 Controller/service와 권한/오류 계약을 조사한다.
- 추가 완료/재개 기준: 취소 가능 상태·본인/관리자 권한·동시 승인409·처리 후 표시/재조회·잔존/복구를 정하고 DEV-15의 완료 기준을 갱신한다. 실제 취소 미실행.
- 이 절은 날짜별 후속 계획이다. 앞선 결정/QA/예외 이력을 대체하지 않으며 제품 구현·실제 업무 API 변경/새 통합 PASS는 없다. 상태는 WBS에서만 관리한다.

<a id="pol-10-pol-09-handoff"></a>

## 2026-11-13 · POL-09 종료 후 선정/인계

- 사용자 요청7항에 따라 다음 Task 하나로 선정/인계만 했다. DOC-001 완료·P2 기본 표 순서의 첫 해소 가능한 독립 정책 Gate가 근거다. 남은 P0 실제 QA/약관·취합, P1 정책/신원·문구/실제 자원, DEV-09 차단·DEV-12 보류·DEV-13/14 계약 선행 등 기존 차단/승인 예외는 보존한다. 현재/다음/상태는 WBS만 관리한다.
- 다음 첫 행동: 새 대화에서 최신 main/작업트리·이 Task 정의/완료 기준과 소속 신청 소유 정책·현행 GitHub source/개발 Swagger를 대조한다. 취소 상태 조회와 취소 명령·본인/관리자 권한·동시 승인/expectedVersion/409·완료 목적지/재조회·사용/잔존/복구의 정책 Brief부터 제시한다. 과거 endpoint 부재/문서 존재를 현재 계약/실행 대응으로 대신하지 않는다.
- 이번에는 정의/선행/완료 기준만 읽었다. POL-10 전용 상세 source/API/Figma 조사·정책 선택/Brief/설계·구현·검증·실제 업무/운영·Git 전달은 시작하지 않았다. POL-09의 정책/문서 PASS·Git/Chromatic 승인을 이 Task의 제품/실제 QA·예외 승인으로 확대하지 않는다.

## 2026-11-13 · 재조사 후 다음 선정 변경 이력

사용자가 [문서 반영 승인](POL-09.md#pol-09-backend-replan-approval)으로 다음 하나를 DEV-57 재개 요구사항 확인으로 바꾸도록 지시했다. 위 POL-10 선정은 당시 이력으로 보존하며 현재 다음/상태는 WBS만 관리한다. POL-10은 준비에서 순서 대기로 되돌리고 본인/대기 취소·expectedVersion/동시 승인409·목적지/재조회·QA 자원 등 미결 정책은 그대로다. 이번에는 선정 변경 사실만 기록했으며 이 Task 자체 Gate/구현·실제 취소를 시작하지 않았다.

<a id="pol-10-dev-57-handoff"></a>

## 2026-11-13 · DEV-57 로컬 Gate 뒤 다음 Task 인계

- 이번 DEV-57 사용자 요청7항에 따른 **선정/인계만**이다. 남은 P0 실제 QA/약관·P1 정책/표시·실제 자원 차단을 보존하고, DOC-001 완료·P2 기본 표 순서의 첫 해소 가능한 독립 정책 Gate이므로 다시 선정했다. 현재/다음/상태는 WBS만 관리한다.
- 다음 첫 행동: 새 대화에서 최신 main/작업트리·이 기록/완료 기준·소속 신청 소유 정책을 확인하고 현행 backend GitHub/개발 Swagger부터 재조회한다. 취소 명령/조회 상태·본인/관리자 권한·expectedVersion/동시 승인409·결과/목적지/재조회·사용/잔존/복구의 남은 정책을 구조화하고 정책 Task Brief를 제시한다. 날짜별 DELETE 존재/expectedVersion 기록을 현재 배포·실행 응답으로 대신하지 않는다.
- 이 대화에서는 정의/선행/마지막 인계만 읽었으며 전용 source/API/Figma 조사·정책 선택·Brief/설계·제품 구현·실제 취소·자체 검증/리뷰·Git 전달을 시작하지 않았다. DEV-57의 로컬 완료/실제 QA 차단 보존·Git/Chromatic 예외를 이 Task의 승인으로 확대하지 않는다. 미확인 개인 담당자는 배정하지 않았다.

## 2026-11-13 · 사용자 요청으로 다음 DEV-56 재개 확인으로 변경

- [사용자 승인](DEV-57.md#dev-57-next-dev-56-approval)에 따라 다음 하나가 [DEV-56 재개 요구사항 확인](DEV-56.md#dev-56-resume-handoff-20261113)으로 바뀌었다. 위 POL-10 선정은 당시 이력으로 보존한다. 현재 상태/다음은 WBS만 관리하며 이 작업은 순서 대기로 돌아간다.
- 기존 취소 가능 상태·본인/관리자 권한·expectedVersion/동시 승인409·결과/목적지/재조회·실제 QA 자원/사용·잔존·복구의 미결과 선행/완료 기준을 변경하지 않는다. 정책 조사·결정/구현·실제 취소·이 Task의 Git 전달은 여전히 미착수다. DEV-56의 진행 여부와 POL-10 완료를 의존 관계로 추가하지 않는다.

<a id="pol-10-after-dev-56"></a>

## 2026-11-13 · DEV-56 종료 뒤 다음 선정/인계

- 이번 사용자 요청7항의 다음 Task 하나 선정·인계 범위다. WBS P2·선행 DOC-001 완료를 확인했고 선행을 충족한 P0/P1 대기 작업이 없어서 이 독립 정책 Gate를 다음으로 정했다. 이전 DEV-57 종료 때의 POL-10→DEV-56 우선 재개 선정/순서 대기 이력은 보존한다. 현재/다음/상태는 WBS만 관리한다.
- 다음 첫 행동: 새 대화에서 최신 main/미커밋 변경·이 Task의 마지막 체크포인트/완료 기준을 확인한다. 소속 신청 소유 정책·현행 backend GitHub/개발 Swagger를 대조해 취소 상태 조회/명령·본인/관리자 권한·동시 승인/409·완료 목적지/재조회·사용/잔존/복구의 정책 Brief를 편집 전에 제시한다. 과거 endpoint 부재/현재 문서 존재를 실행 버전/실제 계약 보장으로 대신하지 않는다.
- 이 대화에서는 정의/선행/완료 기준을 읽고 인계만 했다. POL-10 전용 조사·정책 결정·개발·실제 취소 API 실행·운영/배포·Git 전달을 시작하거나 승인하지 않는다. DEV-56의 Git/Chromatic 예외를 다음 Task에 이전하지 않는다.

<a id="pol-10-investigation"></a>

## 2026-11-13 · 현행 계약 조사와 요구사항 Gate

- 이번 승인자/날짜: 사용자 / 2026-11-13 KST. 요청한 단위는 **POL-10 정책 조사·필요한 결정·후속 기준 정리**다. 문서 검증·read-only verifier/ai-review·목적별 commit/push·PR·최종 head CI·정상 main 병합·로컬 main FF는 이번 요청6항으로 승인됐다. 이번 PR의 Chromatic 월간 한도 문제만 예외이며 보호 우회/검사 강제 성공은 허용하지 않는다. 과거 Task의 승인을 이월하지 않는다.
- 제외: DEV-15 또는 다른 제품 구현·라이브러리/설정 변경·중앙 정책/백엔드 편집·업무 API 실행/취소·계정/회사 생성·메일·문서 처리·운영/배포. 다음 Task는 선정/인계만 한다.
- 시작: clean `main` = `origin/main` = `ebda651016d323680be3364708f5c1ed6818b219`. fetch/FF 확인 후 `docs/pol-10-membership-cancellation` 생성. 같은 Task 브랜치/미커밋·선행/무관한 dirty 없음. DOC-001 및 직전 DEV-56은 main에 반영됐다.
- 확인한 패턴: AGENTS·세 Skill·workflow/task-cycle·baseline M05/coverage·DEV-15·기존 회사 QA·base/plan/architecture/data-access/harness/ai-failures·package scripts와 verifier 역할. 회사 공개 client/contracts·HTTP/mock·`MyCompanyClient`, Popup/Toast의 기존 소유 경계를 확인했다.
- 수정/영향: 이 Task와 DEV-15 후속 기준, WBS/coverage·plan의 연결, 기존 회사 QA에 추가할 취소 사례, source/context/review 기록과 실제 출력 실수의 ai-failures만 변경한다. 기존 기준선·QA/감사/결정·타 Task 차단/예외는 보존한다. `src/public/tests`·패키지/빌드·하네스 설정 영향은 없다.
- 검증 계획: 상대 링크/anchor·JSON·79원본/114Task/156의존성/DAG·현재/다음/상태 일치·이력 prefix/보호 범위·Markdown 표/fence/개행·추가 비밀값 패턴·`git diff --check`. 문서 전용이라 로컬 앱 test/lint/build/Storybook·제품 브라우저/mock/HTTP 대역은 실행하지 않는다. 원격 CI는 별도 최종 head에서 확인한다.

### 확인한 사실과 근거 수준

[고정 source11개·blob/내용 지문·OpenAPI 선별 지문·배포 기록·Figma 노드](../reviews/POL-10-sources.json)를 따른다.

| 근거 | 2026-11-13 관찰 | 판단 경계 |
| --- | --- | --- |
| 중앙 소유 정책 | `mate-docs` main `c9e50ff591ae18023164e1a94581c611bf1e4f29`: 대기 신청은 신청자 본인이 취소, 회사 검토자는 승인/거절 | 회사 합치기·초대 취소·활성 소속 탈퇴와 별개. 새 관리자 대리 취소 정책을 만들지 않음 |
| backend source | dev `befe434c2b3fd80ddbc12c1d6216f738dd5ea12a`, main `8f522d0876a70edf61b8f5456a11c51756f60372`. membershiprequest 비테스트11파일 blob 일치 | 전체 branch 동일/실행 서버 SHA 보장이 아님 |
| 조회/취소 명령 | `GET /api/v1/company-membership-requests/me`와 `DELETE /api/v1/company-membership-requests/{requestId}?expectedVersion=...` 분리. 로그인 주체·양수 ID/version 필수, body 없음. 200에 갱신된 신청 반환·no-store | GET은 PENDING 우선, 없으면 최신 종료 신청. 삭제/404로 취소를 표현하지 않음 |
| 상태·권한·경쟁 | PENDING/CANCELED/APPROVED/REJECTED. 본인 확인 뒤 계정→신청 잠금, version 확인→PENDING 확인→CANCELED/version+1/완료 시각 저장 | 타인/없는 신청404 CR001, 오래된 version409 CR004, 비대기 상태409 CR003. 관리자 leaf로 타인 취소를 허용하지 않음 |
| 배포 기록 | backend run43170618340의 verify/publish/test deploy 성공·prod skipped | 현재 process SHA/실제 취소 응답은 미확인 |
| 개발 OpenAPI | 공개 schema GET200·3.1.0/v1, 필수 query expectedVersion·응답 version/status 확인 | 취소 operation에는404/409가 미기재. wrapper는 success, 현재 프론트는 isSuccess. 실제 wire는 후속 확인 |
| Figma | 대기3162:52364의 버튼3162:52414, 취소 완료3162:52416의 빈 회사 화면·toast3162:52419·CTA3162:52426을 metadata/한정 text 조회로 확인 | screenshot asset 다운로드가0byte여서 시각/pixel 검토 PASS 아님. 전체 frame/모바일/다른 화면 예외 승인 없음 |
| 현재 프론트 | 조회/종료 카드·회사 연결/승인지연 분기는 있음. 취소 공개 함수/HTTP/mock 명령 및 MyMembershipRequest.version 없음 | 존재하는 CANCELED 조회 화면을 사용자 취소 구현 완료로 세지 않음 |

### 남은 결정과 다음 행동

- 기존 중앙 정책/서버의 본인 PENDING·권한·버전/충돌은 확인 사실이며 사용자가 새로 승인했다고 기록하지 않는다.
- **미확정 질문1**: 확인 창 후 성공 시 `/my/company`의 빈 화면+1회 완료 안내, reload 후에도 재시작 가능한 빈 화면,409 후 자동 재취소 없이 최신 상태/연결 회사로 안내하는 흐름을 추천했다. 대안은 현재 취소 이력 카드/다시 선택 버튼 유지다. 추천은 승인으로 세지 않으며 답변 전 해당 제품 정책/최종 설계는 확정하지 않는다.
- 실제 취소 QA용 합성 계정/상태별 신청·실행 버전·사용/변경/잔존/복구 범위는 후속 DEV-15 Gate에서 확인한다. 이번 정책 문서의 완료와 실제 통합 PASS를 구분하며 로컬 선행/실제 QA 면제 예외를 만들지 않는다.
- 2026-11-13 14:10 KST 체크포인트: 위 branch/base·제품 변경0. source/공개 schema/Figma 읽기 전용 조사 완료, 사용자 화면 선택 대기. 다음은 답변의 원문·결정자/날짜를 기록하고 최종 Brief/정책/DEV-15·QA 기준을 구체화한 뒤 문서 검증·두 리뷰다. 자동 수정0/3, Git 전달은 아직 미실행이다.

<a id="pol-10-brief"></a>

## 2026-11-13 · 사용자 확정과 최종 정책 Brief

| 결정 | 결정자·날짜·원문/근거 | 범위와 보류 이유 |
| --- | --- | --- |
| D1 · 취소 후 빈 회사 화면 | 사용자 / 2026-11-13 KST: **‘추천안대로 확정하고 POL-10 작업을 계속 진행해줘.’** 앞선 질문의 확인 창→성공 후 `/my/company` 빈 화면/1회 안내→재시작, reload 유지·409 후 재조회 흐름을 설명한 뒤 확정 | 현재 취소 이력 카드 유지 대안은 채택하지 않음. CANCELED 서버 이력 삭제·관리자 대리 취소·활성 소속 탈퇴 승인이 아님 |
| D2 · Figma Sonner Toast | 같은 사용자: **‘그리고 취소를 했을 때는 … node-id=3162-52416 … 이것처럼 Toast (sonner)가 떠야겠지?’** 지정 frame의 toast3162:52419 문구 확인 | 취소 성공 시 기존 Sonner `showToast` 경로로 **‘성공적으로 통합 요청을 취소했어요!’** 1회. 신규 라이브러리/Toaster 추가 없음. 다른 화면의 용어/레이아웃 예외 승인이 아님 |
| D3 · 전달/다음 범위 | 같은 사용자: 정책과 DEV-15 후속 기준 문서 반영·검증/리뷰·commit/PR/CI/main/로컬 FF 마무리, 다음은 선정/인계만 재확인 | 이번 Git 승인과 Chromatic 월간 한도 예외를 유지. 업무 API/중앙 문서/운영·배포·DEV-15 구현은 승인 범위에 추가하지 않음 |

- 요구사항: 현행 소유 정책/소스와 사용자 D1/D2에 맞춰 소속 신청 취소의 상태·권한·동시성·결과/완료/재조회·Toast·잔존/복구 경계를 결정하고 DEV-15의 검증 가능한 후속 기준을 남긴다.
- 성공 기준: source/게시 schema/배포 기록/현재 실행·실제 응답을 분리하고, 추천과 사용자 확정의 근거/시각을 보존한다. 본인 PENDING·expectedVersion·중복/이미 처리됨·세션/계정 수명·완료 목적지/재조회·Figma Sonner 기준과 후속 실제 QA Gate를 연결한다. 문서 검사/Documentation Update Check/두 리뷰를 통과한다.
- in scope: 정책 v1, DEV-15 완료/착수 기준, 기존 회사 QA의 별도 취소 사례와 WBS/coverage/plan·source/context/review·출력 재발 기록. 기존 기록은 append하고 현행 상태는 WBS만 소유한다.
- out of scope: 제품/DTO/mock/공유 UI 구현·새 라이브러리·중앙/백엔드 편집·실제 취소/업무 데이터/메일/문서 처리·운영/배포·다음 Task 실행. Figma 전체 픽셀/모바일 정합성·다른 화면 예외를 승인하지 않는다.
- 기존 파일/패턴: 회사 공개 client/contracts→HTTP/DTO 또는 계정별 mock→overview/UI, shared HTTP의 동일 계정 인증 재시도, postCommit의 성공+sessionWarning, Popup 확인/닫기와 단일 ToastViewport/showToast를 확인했다. 현행 취소 명령/version 부재는 DEV-15의 변경 후보이며 이번에 코드를 설계·구현하지 않는다.
- 진행 순서/영향: 정책 표 확정→후속 Task/QA/원본 연결→문서 검사/Context Audit→read-only verifier/6항목 ai-review→종료 기록/다음 선정 재검토→목적별 문서 commit/PR/최종 CI/정상 merge/로컬 FF. 제품 실행 영향0이다.
- 가정: 문서의 ‘취소’는 M05의 **회사 소속 신청**이다. Figma의 ‘통합 요청’ 문구는 지정 버튼/Toast 근거로만 사용하며 회사 간 합치기(POL-16), 초대 취소, 탈퇴와 합치지 않는다. 정확한 확인창 배치/치수·키보드/모바일 시각 검증은 DEV-15 자체 Gate에서 기존 패턴으로 구체화한다. 정책 문서화에 남은 blocking ambiguity는 없다.
- 검증: 앞선 [문서 전용 검증 계획](#pol-10-investigation)을 적용한다. 현재 package의 test/lint/build/build-storybook은 실행 코드/패키지/빌드 영향이 없어 로컬 미실행한다. 실제 API 통합과 DEV-15 자원/자체 Gate는 완료 조건에서 제외한 채 필수 후속 조건으로 보존한다.

<a id="pol-10-contract"></a>

## 소속 신청 취소 정책 v1

정책 소유 근거는 [중앙 회사 소속 정책](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/company/membership-and-positions.md#기존-회사에-직접-합류-신청하기), [취소 source](https://github.com/mate-pjt/mate-backend/blob/befe434c2b3fd80ddbc12c1d6216f738dd5ea12a/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/membershiprequest/CompanyMembershipRequestServices.kt#L171-L185)와 위 D1/D2다. 아래는 **후속 개발의 기대 동작**이며 현재 제품 구현 완료 설명이 아니다.

| 항목 | 확정 기준 |
| --- | --- |
| 조회와 명령 분리 | overview/내 신청 조회는 상태 확인만 한다. 취소는 명시적으로 확인한 사용자 행동에서만 DELETE1건을 보낸다. 첫 진입/reload/닫기/GET에는 취소 부작용이 없다 |
| 허용 상태·권한 | 로그인한 활성 신청자 본인의 PENDING만 허용. 대표자/일반 신청 구분 없이 같은 규칙이다. 회사 ADMIN/review leaf만으로 타인 신청을 취소하지 못한다. APPROVED/REJECTED/CANCELED·회사 연결 상태에서는 취소 액션 없음. 서버가 권한/상태를 최종 검증 |
| 확인/닫기/중복 | 대기 화면의 ‘통합 요청 취소하기’→취소 확인. 확정 전 닫기/Escape/돌아가기는 변경0·Toast0. 제출 중 같은 신청의 중복 명령을 막고 진행 상태를 알린다. 제출 후 창 닫기/이동이 서버 취소의 롤백을 뜻하지 않음 |
| 대상/version | 확인한 requestId와 그 조회 snapshot의 양수 version을 expectedVersion query로 보낸다. body/추측한 Idempotency-Key·버전 생략/기본1은 사용하지 않는다. 새 신청이나 계정으로 대상을 조용히 바꿔 재전송하지 않음 |
| 성공/잔존 | 같은 requestId의 CANCELED 성공 결과를 확인한다. 서버는 version 증가·updatedAt/completedAt을 저장하고 신청 이력을 남긴다. 취소를 데이터 삭제/소속 종료/회사 삭제/메일 회수로 취급하지 않음 |
| 완료 화면·다시 시작 | 성공 후 `/my/company`의 빈 회사 화면. CTA는 `/my/company/start`의 기존 등록/찾기 선택으로 연결한다. 새로고침/재진입에서도 최신 overview가 미연결+CANCELED이면 빈 화면을 유지하며 이력 카드를 완료 화면으로 다시 강제하지 않는다. `/my/company/start`의 선택 가능 상태/기존 종료 안내는 보존한다. 새 PENDING/연결 회사가 생겼으면 최신 상태를 우선 |
| Sonner 완료 안내 | 당해 취소 명령의 검증된 성공에서만 기존 `showToast('성공적으로 통합 요청을 취소했어요!')` 경로로1회. 지정 [Figma 완료3162:52416](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3162-52416)·toast3162:52419 기준이다. 단일 ToastViewport/기존 duration·반응형/접근성 규칙을 재사용하고 별도 Toaster/라이브러리는 추가하지 않는다. reload/GET/뒤로가기·중복 응답·충돌/실패에서는 이 성공 Toast를 재생하지 않음 |
| 중복/이미 처리됨 | source는 replay 성공을 보장하지 않는다. 낡은 version은409 CR004, 현행 version의 비PENDING은409 CR003. 두 경우 자동 DELETE 재시도 없이 최신 overview/내 신청을 확인한다. CANCELED면 빈 화면, REJECTED면 거절 안내, APPROVED면 회사 연결/승인지연 분기로 복원. 충돌을 새 취소 성공/Toast로 표시하지 않음 |
| 동시 승인 | 취소/승인은 신청자 계정부터 잠가 하나의 결과만 확정한다. 승인이 먼저면 취소 불가→최신 세션/overview 확인→연결 회사 화면, 연결 반영 지연이면 기존 approved-stale 안내/명시 재조회. 취소가 먼저면 CANCELED를 유지한다. 이미 생성된 소속을 취소 명령으로 제거하지 않음 |
| 오류/결과 불명 | 404 CR001은 없거나 본인이 아닌 취소 대상이므로 성공 처리하지 않고 내 최신 상태를 재확인한다.403·서버 오류·네트워크/잘못된 응답도 빈 성공으로 바꾸지 않는다. 응답 유실/시간 초과는 결과 미확정 안내→명시적 상태 확인, 자동 mutation 재시도0. 조회로 CANCELED를 복구해도 당해 성공 응답 없는 완료 Toast는 만들지 않음. 재조회도 실패하면 오류/재시도와 미확정 상태 유지 |
| 세션/계정 수명 | 기존 동일 계정401 refresh1회 재요청 경계를 유지하고 최종401은 로그인/기존 복귀 경로로 처리한다. 취소 결과 확인 뒤 세션 갱신만 실패하면 취소 성공을 실패로 뒤집거나 재취소하지 않고 완료+sessionWarning을 구분한다. 최종 세션 해제는 보호 자료를 숨기며, 계정 교체/로그아웃/화면 종료 후의 늦은 응답·Toast·이전 회사/오류는 새 계정에 적용하지 않음 |
| 복구 | 취소 이력을 PENDING으로 되돌리는 API/DB 변경은 가정하지 않는다. 다시 소속되려면 기존 신청 조건을 만족하는 **새 신청**이다. 실제 QA는 disposable 합성 자원과 시작/종료 snapshot·변경/이력 잔존·다시 신청/정리 담당과 허용 범위를 먼저 확보 |

<a id="pol-10-dev15-gate"></a>

## DEV-15 후속 범위와 미확인 조건

- 개발 소유자는 [DEV-15 후속 기준](DEV-15.md#dev-15-pol-10-handoff)이다. version을 포함한 내부 계약·HTTP DTO 경계/응답 검증, company 공개 함수/HTTP/mock 취소·저장/복원·계정 격리, 확인/중복/진행/오류·빈 화면/기존 Sonner 연결이 후보 범위다. 해당 Task의 자체 Brief/수정 파일/검증 계획을 새 대화에서 제시한 후 시작한다.
- 필수 후속 검증은 [MCANCEL-01~12](../../../qa/my-company.md#pol-10-cancellation-qa)다. mock·HTTP 대역/실제 Next·실제 API의 결과/사례를 따로 기록한다. 기존 MCO/CDASH/AUTH와4통과6차단은 유지한다.
- 현재 실제 업무 실행0/새 통과0. 소스/게시 OpenAPI/배포 기록은 확보했지만 **현재 process SHA/실응답 wrapper·취소200/404/409·권한·version/세션 결과**, 상태별 disposable 계정/신청과 안전한 경쟁/오류·사용/변경/잔존/복구 승인·담당은 미확인이다. 후속 담당 역할은 제품 승인자·백엔드/API 담당·실행 버전 담당·합성 자원/복구 담당이며 개인 배정/일정은 임의 지정하지 않는다.
- QA-05의 과거 조회 전용 QA-A/QA-B 승인을 취소/신청/상태 생성으로 확대하지 않는다. DEV-15의 로컬 선행/실제 통합 생략 예외는 이번에 승인되지 않았다. 자원 부족이 확인되면 그 Task의 Gate에서 차단/재개 조건 또는 필요한 최소 결정을 남기며, 이번 POL-10 문서 완료를 DEV-15 구현/실제 통합 PASS로 올리지 않는다.
- 2026-11-13 14:17 KST 재개 체크포인트: 같은 branch/base·기존5파일은 이번 Task의 확인된 조사 변경으로 보존. 사용자 D1/D2 확보·원격 main 변경 없음. 정책/후속 문서 반영 후 문서 검사·두 리뷰가 다음 행동이다. 자동 수정0/3, 제품/업무 실행0건.

<a id="pol-10-verification"></a>

## 2026-11-13 · 정책/문서 검증·종료와 다음 인계

- 정책 산출물 판정: **POL-10 정책/문서 범위 PASS**. 사용자 D1/D2와 중앙/백엔드 소스에 따라 상태·권한·버전/충돌·완료/재조회·정확한 Sonner1회·이력/복구 경계를 확정했다. DEV-15 후속 기준과 MCANCEL12사례는 미실행으로 남겼다. 제품 구현/실제 API 통합 PASS가 아니다.
- 검증: `python3 /tmp/mate-pol10-20261113/verify-docs.py`·`git diff --check` PASS. 정책/리뷰10파일863링크·79원본/114Task/156의존성/DAG·보호11범위·타 WBS행/기존22차단·QA/Task/coverage/plan의 원문 prefix·source11개/blob·선별 OpenAPI 지문·MCANCEL12ID·Figma 성공 문구를 확인했다. 종료/인계 뒤 다시 수행하고 최종 결과는 [검증/리뷰](../reviews/POL-10.md)에 남긴다. 자동 수정0/3.
- Documentation Update Check: 정책/후속 Task·QA·WBS/coverage/plan·source/context/리뷰와 실제 출력 재발의 ai-failures 갱신. base/architecture/data-access/harness는 package/scripts/폴더/런타임/공급원/역할/하네스 변화가 없어 미갱신한다. 앱 test/lint/build/Storybook은 문서 전용/실행 영향0으로 로컬 미실행, 최종 원격 CI는 별도다.
- Review Gate: read-only verifier PASS(Blocker/Major/Minor0)·6항목 ai-review PASS. verifier는 source를 직접 재조회하고 현재 contracts/client/HTTP/UI·단일 Toast 경계, OpenAPI 지문/12사례 미실행과 기존22차단을 독립 확인했다. 종료 체크리스트·WBS/다음 인계 변경은 문서 검사와 affected verifier/ai-review 재검토 뒤 전달한다. [Context Audit WARN/후속 계약 공백](../reviews/POL-10-context.md)은 제품 검증 PASS가 아니다.
- 다음 선정: **DEV-15 자체 요구사항 Gate**. POL-10 완료 가정의 WBS 재계산에서 선행을 충족한 P0/P1 대기0이며 P2 기본 순서의 첫 eligible이다. POL-11 등 이후 독립 정책과 기존 차단/보류·예외는 유지한다. [DEV-15 첫 행동/선정 인계](DEV-15.md#dev-15-next-handoff)는 최신 Git/source/Swagger·실제 wire/실행 대응·합성 자원/사용·취소/이력 잔존/복구 범위와 자체 Brief 확인이다. 이번에는 선정/인계만 했고 DEV-15 조사/설계/구현/실제 실행을 시작하지 않았다.
- Git 전달은 정책 판정과 별개다. 목적별 문서 commit/push·PR·최종 head의 나머지 CI/리뷰·정상 merge 조건과 이번 Chromatic 월간 한도 예외만 확인한 뒤 main/로컬 FF를 진행한다. 현재 실행 대응/실제 업무 응답·MCANCEL/기존 QA 차단, metadata 출력의 과거 한계는 그대로다. 실제 PR/최종 보고에서 최종 head/병합 SHA/로컬·원격 일치/clean을 확인한다.
- 종료/인계 freshness: 문서 검사10파일868링크·diff-check, 독립 verifier2차/6항목 ai-review 재수행 PASS(Blocker/Major/Minor0). 이후 이 결과 receipt·실제 Git 식별자 추가만 링크/diff 검사로 유지하며 정책/상태/범위가 달라지면 다시 검토한다. Git 전달 전까지 앱/실제 업무 실행0건이며 다음 DEV-15 미착수다.

### Git 전달 체크포인트 · PR 생성 시점

- 목적별 commit4개: `46a96c5` 계약 조사 근거, `b67fd02` 정책/후속 검증 기준, `f85a210` 출력 재발 기록, `371bd06` 검증/다음 인계. 작업 브랜치 push 후 [PR #72](https://github.com/mate-pjt/mate-frontend/pull/72)를 main 대상으로 생성하고 `type: docs` 라벨을 적용했다. 생성 당시 head는 `371bd06bac7f097e6d75e266e9be0e105baa5ae7`, base는 `ebda651016d323680be3364708f5c1ed6818b219`다.
- 생성 직후 원격 checks2개·Chromatic publish/Vercel은 진행 중, mergeable이며 reviewDecision/요청된 필수 리뷰 없음. repository는 일반 merge commit을 허용하고 main 보호/현재 적용 branch rules 없음까지 확인했다. 검사를 강제 성공으로 바꾸지 않으며 이번 Chromatic 월간 한도 문제만 사용자 예외다. **이 시점은 최종 CI PASS/병합 완료 기록이 아니다.**
- 이 receipt만 추가한 커밋 뒤의 최종 head를 원격에서 다시 확인해 CI/리뷰·나머지 병합 조건을 평가한다. main이 바뀌면 차이/영향 검증을 다시 수행한다. 실제 최종 head/CI·병합 SHA·로컬/원격 main 일치/clean은 PR과 최종 보고를 따른다.
- 후기 변경은 실제 Git 식별자/receipt뿐으로 정책·범위·WBS 상태·후속 QA를 바꾸지 않는다. 독립2차 의견에 따라 verifier/전체 정책 리뷰는 재실행하지 않고 해당 링크/문서 검사·diff-check와 6항목 ai-review의 영향 여부를 확인한다. 기존 PASS 결론과 후속 실제 QA 미실행 경계는 유지한다.

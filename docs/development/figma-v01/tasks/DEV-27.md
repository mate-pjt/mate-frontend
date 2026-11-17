# DEV-27 · 팀원 목록·역할·상세 조회

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: T01
- 선행 작업: [POL-14](POL-14.md)
- 목적/범위: 역할별 팀원 목록/상세와 진입 메뉴를 연결한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### T01 · 팀원 목록·역할·상세·정보/권한 변경
- 기준선: UI **메뉴 비활성**, 동작 **미구현**, 데이터 **관리 계약 없음**. 검증: 코드 대조.
- 남은 점: 관리자/팀원/뷰어별 조회와 편집 권한 구현
- Figma: [3137:52702](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52702) / [3137:53331](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53331) / [3137:54225](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-54225)
- 소유 소스/기존 기록: [src/components/my/my-side-menu.tsx:12](../../../../src/components/my/my-side-menu.tsx)、[src/data/company/contracts.ts:193](../../../../src/data/company/contracts.ts)

## 완료 기준

- [x] 관리자/팀원/뷰어·빈/페이지/오류·상세 접근 권한을 확인한다 — 2026-11-17 승인된 로컬 범위/TEAM 근거.
- [x] 탈퇴/변경된 팀원·계정 변경·모바일을 검증한다 — 로컬 자동/브라우저, 실제 QA 차단 보존.
- [x] 현재 package scripts로 필요한 test/lint/build·diff-check와 영향 시 Storybook 검증을 통과한다.
- [x] 이번 사용자 승인 로컬 자동/브라우저·권한/오류 검증을 통과하고 실제 API 조회 부분 차단·추가 genuine hidden 미실행을 기록했다. 전체 기능 실통합 PASS가 아니다.
- [x] Documentation Update Check 및 수정 후 verifier/여섯 섹션 ai-review를 통과한다. 첫 독립 FAIL과 수정/재검토를 보존한다.

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


<a id="dev-27-pol-14-handoff"></a>

## 2026-11-16 · POL-14 확정 정책/계약 인계

- 인계 근거: [POL-14 D1/D2/D3·v1](POL-14.md#pol-14-contract). 원본 T01의 ACTIVE 팀원 목록/상세·메뉴 진입과 조회 계약을 연결하는 단위다. 보낸 초대·받은 신청의 관리 행동/목록은 DEV-29/31, 변경은 DEV-28이며 후속 화면을 무단 삭제/전면 시각 예외로 처리하지 않는다.
- 확정 완료 기준: 현재 회사/계정/leaf로 catalog·내 권한/목록·상세를 같은 company 공급원에서 읽고, page0/기본20/size1..100·total/count·joinedAt ASC/id ASC를 보존한다. 빈 전체/빈 page·loading/오류/401/403/없는 대상·탈퇴한 대상/권한 변화·계정/회사/화면 수명과 재조회·모바일/키보드를 구분한다. role 이름만으로 허용하지 않고 페이지3/행9 capabilities의 조회 시점 의미를 유지한다.
- D2 상세 기준: Figma3137:53331/54225의 생년월일·전화번호 자리/라벨을 남기고 **미제공**으로 표시한다. nullable 이름/이미지/lastLoginAt을 다른 개인정보·가짜 날짜로 합성하지 않는다. 상세 전체·프레임 재설계의 예외 승인으로 확대하지 않는다.
- 현재 backend/Swagger에는 members 목록/상세·memberships/me·company-permission-definitions와 flags가 있다. 과거 ‘관리 계약 없음’을 현재 backend 부재로 반복하지 않는다. 현재 프론트 관리 route/Repository는 미연결이며 여기서는 구현하지 않았다.
- 검증 연결: [TEAM-01~04/23/26](../../../qa/team-members.md#pol-14-team-qa), Figma3137:52702/53331/54225와 각 상태를 자체 Brief에서 대조한다. 실제 조회 자원과 구현 검증을 확보한 뒤 실제/API/mock/HTTP대역 결과를 분리한다.

- 이 append는 POL-14의 정책/계약·완료 기준 인계다. 이 Task의 실행/Implementation Brief·설계/제품·실제 QA·Git 전달을 시작한 것이 아니다. 현재/다음/상태는 WBS만 소유한다. 원본2026-10-27 관찰·미작성 Brief·기존 체크리스트/QA는 보존한다.
- 공통 재개 Gate: 최신 Git/main·이 선행 결정/현재 source·게시 Swagger/실행 대응을 확인하고, 자체 성공 기준·수정 파일/영향·검증을 제시한다. `data-access.md`의 같은 company 공급원·public 포트/HTTP/DTO 경계·immutable snapshot/운영 guard·계정 격리를 지킨다. 새 library/endpoint/필드·fallback을 임의 만들지 않는다.
- 실제 업무 GET/변경·메일/초대/직급 실행은 승인된 합성 회사/계정·현재 leaf/상태/버전·환경/Origin/실행 SHA 대응·사용/소비/잔존/복구 범위와 자원 담당 역할이 필요하다. 이번 정책/Git/Chromatic 예외는 해당 자원 확보·실제 QA 면제/로컬 선행 승인이 아니다. 이전 QA-08 AUTH-16 0통과1차단·초대 AUTH-17 미실행과 다른 가입/회사·DEV-08/MAT-162 등 차단을 보존한다.


<a id="dev-27-pol-14-selection"></a>

## 2026-11-16 · POL-14 뒤 다음 Task 선정/첫 행동

- [POL-14 정책 문서 종료](POL-14.md#pol-14-close)에 따라 선행을 충족하는 P2 기본 표 순서 첫 팀원 개발 단위로 선정/인계했다. 기존 P0/P1 차단과 앞선 P2의 DEV-08·DEV-24/26/MAT-162·다른 Task 선행을 바꾸지 않는다. 현재/다음/상태는 WBS만 소유한다.
- 다음 첫 행동: 새 대화에서 최신 Git/main·이 후보의 원래 범위/완료 기준과 POL-14 D1~D3·TEAM QA 계획, 그때의 backend/개발 Swagger·Figma3137:52702/53331/54225의 목록/상세/오류/모바일 상태를 확인한다. 현재 company/leaf·page/count/ASC·3page/9row flags·nullable/미제공·계정/회사 수명과 안전한 실제 조회 계정/회사·실행 대응/사용·잔존·복구 범위를 확인해 자체 Brief·수정 파일/영향/검증을 먼저 제시한다.
- 이번에는 POL-14 소유의 정책/후속 기준·선정/인계만 작성했다. 이 Task의 전용 조사·요구사항 확정/설계·제품/Repository·실제 업무/QA·Git 전달을 시작하지 않았다. POL-14의 Git/Chromatic 예외·정책 문서 PASS가 이 Task의 실제 자원 준비·로컬 선행/통합 면제 승인은 아니다.


<a id="dev-27-mat-290-handoff"></a>

## 2026-11-17 · MAT-290 연결과 표시 데이터 재확인 조건

- [MAT-290](https://linear.app/mate-pjt/issue/MAT-290/backend-팀원-목록상세-응답에-생년월일휴대전화번호-추가)은 팀원 목록 `GET /api/v1/companies/{companyId}/members`의 content 각 행과 상세 `GET /api/v1/companies/{companyId}/members/{membershipId}`에 계정의 birthDate/mobilePhone을 연결해 달라는 외부 요청이다. 11/17 조회 Backlog이며 요청안·이슈 상태를 최종 계약/배포·실제 지원으로 간주하지 않는다. 개인 선택 입력 정보이며 회사 대표 전화나 인증/복구 수단과 구분한다.
- API 지원 확인 전에는 기존 [POL-14 D2](POL-14.md#pol-14-contract)의 자리/라벨 유지·**미제공 표시**를 유지한다. 이슈 생성/Done·계정 필드·source/Swagger만으로 실제값을 표시하지 않는다. MAT-290을 이 Task 전체의 신규 선행/차단으로 만들지 않으며 현재 상태는 WBS가 소유한다.
- 반영 소식 뒤 [POL-14 재확인 Gate](POL-14.md#pol-14-mat-290-handoff)를 따른다. 답변/확정 계약과 고정 source/DTO·조회/mapper/테스트, CI/개발 배포·게시 Swagger·실행 대응·실제 두 응답을 나눠 확인한다. 필드명/경로·타입·날짜/전화 표현·각각 null/누락 직렬화·조회 권한과 기존 page/count/정렬/capabilities/오류를 대조한다. 일부 지원/미확인은 구분하고 해당 부분의 미제공을 유지한다.
- 실제 값 표시 연결은 지원 확인 후 이 Task **자체 Brief·수정/검증 Gate**에서 판단한다. 승인된 합성 회사/계정·조회/개인정보·환경/실행 대응·사용/잔존/복구 범위로 값 존재/각각 null·목록상세 일치·권한/계정·회사/화면 수명·오류/날짜/전화·Figma/모바일/접근성을 검증하고 해당 QA에 기록한다. 현재 TEAM-03의 미제공 계획·TEAM26 실제0통과26대기·AUTH-16/17/다른 차단·예외는 보존한다.
- 이번11/17 사용자는 POL-14 소유 문서의 연결/재개 조건과 검증·리뷰/Git 전달만 승인했다. 이 Task의 전용 조사·Brief/설계·구현·Repository/DTO/mock·실제 업무 QA·별도 Git 전달은 시작하지 않았다. 다음 첫 행동에 MAT-290 현행 답변/지원 여부와 위 Gate를 함께 확인하되 무조건 API 반영까지 대기하는 새 선행으로 바꾸지 않는다.

<a id="dev-27-brief"></a>

## 2026-11-17 · 이번 실행의 Implementation Brief

- 요구사항/유형: DEV-27 하나의 개발 작업. 현재 회사의 ACTIVE 팀원 목록·역할·상세와 `/my/team` 메뉴 진입을 연결한다. POL-14 D1/D2의 회사/leaf·capabilities·결측 기준을 적용한다.
- 승인자/근거: 이번 사용자 최초 요청은 구현·검증·read-only verifier/ai-review·목적별 commit/push·PR/최종 CI·정상 main 병합/로컬 FF를 명시 승인했다. **이번 PR의 Chromatic 월간 한도만 예외**이며 다른 검사/보호 우회·실제 업무/API/메일·운영/배포는 포함하지 않는다. 추가 질문에 사용자 원문 **‘로컬 선행·실제 API QA 차단 보존 (추천)’**을 선택했다. 과거 Task의 로컬 선행 예외와 별개인 이번 결정이다.
- 성공 기준: 같은 company 공급원의 현재 회사·내 소속/leaf·catalog와 서버 page/count/정렬·3page/9row capabilities를 보존, ADMIN/AGENT/VIEWER/추가 leaf·읽기 전용을 role 추론 없이 표시한다. loading/전체 빈값/범위 밖 빈 page·오류/401/403/404·탈퇴/변경 대상·nullable·계정/회사/화면 수명·재조회·모바일/키보드를 로컬에서 확인한다. 문서·검증·두 리뷰 PASS 뒤 이번 Git 전달을 수행한다. 실제 QA는 차단으로 남기며 전체 실통합 PASS로 표시하지 않는다.
- In scope: `/my/team?page=…`, `/my/team/[membershipId]?page=…`, 조회 전용 상세(개인정보·직급·역할·권한), 메뉴·페이지 복귀, company Team 조회 포트/HTTP/mapper/mock fixture·조회 조합과 회귀 테스트·QA/문서.
- Out of scope: DEV-28 정보/권한/직급 변경·동의·퇴사/내보내기, DEV-29~32 초대/신청/직급 관리, DEV-33 수락 완료 경로와 POL-15·다른 Task 실행. 후속 화면 자리는 준비 중으로 보존하고 관리 명령/endpoint를 추가하지 않는다. 실제 개인정보 표시·업무 GET/변경·메일·회사 등록·문서 처리·backend/중앙 정책/Linear 수정·배포·라이브러리 추가 제외.
- 확인한 패턴: `company/contracts.ts`의 기능 포트 합성·`client.ts` 단일 공급원 선택, HTTP AuthAccess/strict mapper, mock의 계정별 company overview와 기존 저장소, `my-documents-client.tsx`의 세션 key/Abort·상태 UI, async route/searchParams·공개 Button/Pagination/Checkbox/SideMenu와 Tailwind 토큰. `data-access.md`의7그룹·immutable snapshot/운영 guard·hybrid·격리/자동 fallback0를 유지한다.
- 수정 후보/영향: company `contracts/client/http-repository/mock-repository`와 전용 `team-contracts/team-api/team-mock`, `config.ts`의 명시적 팀원 시나리오, `features/company/team.ts`, 두 route·`my-team-client.tsx`·`my-side-menu.tsx`, `tests/company-team*.test.ts`. 문서는 이 Task·WBS·TEAM QA/index·`reviews/DEV-27*.md`, 필요 architecture/data-access/plan 및 다음 Task 선정 인계만이다. baseline/coverage 원본/기존 QA·차단/승인 이력은 보존한다.
- 단계: 계약/조회 경계 → 같은 공급원 mock/HTTP → 수명 안전 조회 조합 → Figma 목록/상세 UI → 자동/실제 Next 브라우저 로컬 검증 → 문서/Context Audit·두 리뷰 → 종료/다음 선정 freshness → 목적별 커밋·PR 최종 head CI·정상 merge/main FF.
- 위험/가정: 권한/role/직급을 서로 대체하지 않는다. capabilities는 조회 당시 안내이며 후속 변경 허가가 아니다. 생년월일/핸드폰번호 자리는 D2 ‘미제공’, null 이름/이미지/로그인은 별도 결측이다. 후속 관리 버튼의 준비 중 표시는 이번 조회 범위에 따른 비활성 상태이며 화면 전체 예외가 아니다. 기존 목록20건·1기반 UI/0기반 API·상세 exact membership와 목록 page 복귀를 사용한다.
- 검증: Node22.20.0/pnpm11.3.0의 `pnpm test`, `pnpm lint`, API/mock/hybrid Preview `pnpm build`, `pnpm build-storybook`, `git diff --check`. 실제 Next/Aside 브라우저에서 mock/HTTP 대역의 상태·desktop/mobile·키보드·계정/회사/화면 수명/무변경 요청을 구분한다. 문서 링크·79원본/114Task/156의존·상태/범위·baseline 무변경과 Review Gate. 실제 TEAM-01~04/23/26의 DEV-27 부분은 합성 자원/Origin/실행 SHA·사용/복구 범위 미확보로 차단을 보존한다.

<a id="dev-27-investigation"></a>

## 2026-11-17 · 현재 소유 근거와 시작 체크포인트

- 시작 Git: `main`/`1b30b34b416621b68459d4f7e93ffe37fd8ade6a`, fetch 뒤 origin/main 동일·작업트리 clean·동일 Task 진행 브랜치 없음. POL-14 PR83 및 MAT-290 연결 PR84는 main 반영. FF 확인 후 `feat/dev-27-team-members` 생성, 기존 변경0. 다음 행동은 위 Brief의 계약/조회 구현이다.
- 현행 backend `dev` SHA `adc0e265ef0e2aa78ccb376e1fa322edd664b290`·중앙 `mate-docs/main` `c9e50ff591ae18023164e1a94581c611bf1e4f29`는 선행 조사와 동일하다. 고정 [controller](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companymembership/CompanyMembershipController.kt)·[응답 DTO](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companymembership/response/CompanyTeamMemberResponses.kt)·[조회/flags](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/CompanyTeamMemberQueryService.kt)·[ACTIVE/count/ASC persistence](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companymembership/CompanyTeamMemberQueryPersistenceAdapter.kt)·catalog/현재 leaf를 재확인했다.
- [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs): shell urllib403 뒤 Aside 브라우저/같은 출처 fetch200. OpenAPI3.1.0/v1, 전체 SHA256 `85b38b6e43ad45807a1d8c66153767c53876220dbf84852cbc4fa53d832917ba`로 선행과 동일. 현재 응답에 birthDate/mobilePhone 없음. source·CI/배포 이력·게시200·실행 SHA·실제 업무 응답은 별개이며 이번 실행 SHA/업무 통합은 미확인이다.
- MAT-290은 이번 조회 Done·댓글0·backend 반영 회신/PR 없음이다. 이슈 Done과 달리 고정 source/게시 schema에 두 필드가 없으므로 D2 미제공을 유지한다. 전체 DEV-27의 신규 선행으로 만들지 않는다.
- Figma3137:52702/53331/54225의 high-fidelity context·screenshot을 확인했다. 목록 표/탭, 상세 개인정보4자리·직급·역할·권한 카테고리·목록 복귀가 대상이다. 후속 변경 컨트롤은 조회 전용/준비 중이며 D2의 한정 화면 예외만 적용한다. 모든 frame/child/prototype·pixel 전수 PASS를 주장하지 않는다.
- Context Audit는 적용된 Skill의 읽기 전용 범위로 package/scripts·필요 구조·7그룹/공개 경계·하네스·WBS를 대조했다. shell 기본 Node26.5.0과 `.nvmrc`22.20.0의 차이를 구분하고 검증은 설치된22.20.0을 사용한다. 상세 결과는 검토 기록에 남긴다.

### 구현 체크포인트 · 2026-11-17 09:28 KST

- 조회 Team 포트/mapper·같은 company mock·catalog15leaf/23명 fixture, 수명 안전 조합·두 route/메뉴·조회 상세를 작성했다. 기존 회귀699 및 새 계약 포함757 PASS·lint PASS 뒤 수명 테스트를 추가 실행 중이다. 실제 업무/API/메일·운영 변경0이다.
- 격리 소스 복사본은 `.env*`를 제외하고 기존 node_modules만 연결했다. 최초 pnpm의 verifyDepsBeforeRun 자동 설치 시도가 no-TTY로 중단됐고 의존성 경로는 보존됐다. 제품 검증 실패와 구분하며 자동 설치 확인만 비활성화해 재시도한다. 로컬 격리 실행은 webpack을 명시하고 최종 원격 CI의 기본 Turbopack 빌드와 구분한다.
- 다음 행동: 테스트/세 프로필 빌드·Storybook → 실제 Next/Aside의 mock/HTTP 대역 → 문서·두 리뷰. 자동 제품 수정0/3, 검증 환경 조정1회.

<a id="dev-27-verification"></a>

## 2026-11-17 · 구현·검증 체크포인트

- 구현: 같은 company Team 포트·strict HTTP 경계/읽기 전용 fixture, catalog/현재 leaf·page/count/ASC와3/9flags, 두 route/메뉴·상세/URL page 복귀를 연결했다. 최종 회사/소속/권한 재확인·계정/epoch/Abort·명시 재조회·오류/결측·모바일/키보드를 포함한다. 미지원 개인정보/계정ID 폐기와 나노초 정렬·타 계정 company overview 보존 회귀를 추가했다.
- 자동: `pnpm test`28파일758 PASS, `pnpm lint` PASS. 격리 `pnpm build --webpack` API/mock/hybrid 및 `pnpm build-storybook` PASS 뒤 최종 문구/mapper 동기화의 freshness를 확인한다. webpack은 공유 node_modules를 쓰는 로컬 격리 실행 선택이며 원격 CI 기본 Turbopack과 구별한다. `.env*`를 읽지 않았고 의존성/패키지·빌드/하네스 설정 변경은 없으며 데이터 설정에는 명시 mock 시나리오6개만 추가했다.
- 실제 Next/Aside: [TEAM 로컬 QA](../../../qa/team-members.md#dev-27-local-qa)에 desktop/mobile·기능/접근/수명20관찰 PASS·추가 genuine hidden1미실행과 캡처/판정을 보존했다. Aside의 target 재활성화로 hidden 이벤트가 생기지 않은 추가 시도는 PASS가 아니다. 실제 API/업무/메일·운영/배포0, 실제 조회 부분 차단은 유지한다.
- Figma/정책: 목록/상세의3지정 frame high-fidelity·캡처/자산 대조. D2 미제공만 명시 한정 예외다. 현재 catalog3분류/15leaf·명칭과 행동별 flags는 D1 기능 기준이며 화면 전체 예외/전수 pixel PASS가 아니다. 후속 관리 자리는 준비 중으로 유지했다.
- Documentation Update Check: architecture/data-access의 Team 포트/수명·명시 mock6시나리오, 개발 가이드, plan 날짜별 연결, Task/WBS·QA/index·검토를 갱신한다. package/scripts·전체 하네스 규칙은 그대로여서 base/harness 변경 불필요, 반복 제품 실패/새 예방 규칙이 없어 ai-failures 갱신 불필요. baseline/coverage/79원본·114Task/156의존/기존 QA·정책/예외는 보존한다.
- 자동 제품 수정2/3: 초기 브라우저 QA의 탭 배치/글꼴·배지색·아이콘 경고를 한 검증 라운드에서 최소 교정했고, 새 파일을 포함한 staged diff-check에서 드러난 mock 파일 EOF 빈 줄1개를 제거해 재검증했다. pnpm 격리 검증 환경 조정1회는 별도로 보존하며 실패/미실행을 PASS로 숨기지 않았다. 다음 행동: 문서 검사·Context Audit·read-only verifier/여섯 섹션 ai-review → Gate 종료/다음 DEV-28 선정/인계 freshness → 목적별 commit/PR·최종 head CI/정상 merge/main FF. 다음 Task 구현은 실행하지 않는다.

### 최종 사전 검증 · 2026-11-17

- 최종 소스로 test28파일758·lint, 격리 API/mock/hybrid webpack build와 Storybook 모두 PASS. 로그는 `/tmp/mate-dev-27/tests-verified.log`, `lint-verified.log`, `build-*-verified.log`, `storybook-verified.log`와 `build-results.json`에 남겼다. package script는 새로 만들지 않았다.
- 문서 검사624로컬 링크/anchor·79원본/114Task/156고유 의존·TEAM26·baseline/coverage 보호 파일5무변경/diff-check PASS. 첫 검사에서 label/URL의 같은 의존 ID를2회 세어312로 실패했으며 검사식만 고유 ID로 교정했다. 저장소 의존성 변경은 없다.
- [Context Audit](../reviews/DEV-27-context.md) PASS. 이 결과는 문서/소유 경계 정합성이고 실제 서버 QA나 hidden 이벤트의 전수 PASS가 아니다. 다음 행동은 현재 전체 diff의 read-only verifier와 ai-review다.

- staged 전체 diff에 새 파일을 포함한 첫 diff-check는 `team-mock.ts` EOF 빈 줄로 실패했다. 끝 개행만1개로 맞춘 뒤 전체 diff-check를 다시 통과했으며 의미 변경/다른 파일 정리는 없다.

### 1차 독립 FAIL · 수정/재검증 · 2026-11-17

- 첫 독립 verifier는 Blocker0/Major1/Minor0로 FAIL했다. Link/ButtonLink4곳의 onClick 수명 해제가 수정 클릭의 원래 탭까지 loading으로 만드는 결함이다. 원본 소스/Next16 Link 실행 순서로 확인했으며 초기 primary ai-review PASS의 누락을 보존한다.
- 자동 수정 **3/3**: 실제 SPA 이동에만 호출되는 onNavigate로4곳 제한. 원본758 test/lint·격리 API webpack build PASS, [실제 키 입력 브라우저4회귀](../../../qa/team-members.md#dev-27-link-regression) PASS. 공유 primitive·의존성·정책/다른 기능 변경 없음. 초기 UI QA/EOF 교정과 이번 결함을 합친3회이며 이후 검사가 계속 실패하면 자동 추가 수정하지 않고 원인/재개 조건을 보고한다.
- [ai-failures](../../../ai-context/ai-failures.md)에 실제 결함/예방 규칙을 추가했다. 따라서 초기 Documentation Update Check의 ‘새 실패 기록 불필요’는 첫 독립 검토 전 관찰이며 이제 해당 항목 갱신 필요를 충족했다. Context Audit·primary ai-review를 수정 diff로 갱신하고 read-only verifier 재검토를 요청한다.

<a id="dev-27-close"></a>

## 2026-11-17 · 로컬 범위 Gate 종료와 다음 선정

- 판정: 이번 사용자 D1의 **로컬 구현/검증 단위 PASS**. 실제 API 통합/개인정보 표시 PASS가 아니며 TEAM 실제 조회 부분6차단·추가 genuine hidden1미실행/기존 QA·선행 차단을 보존한다. 최초 candidate/미작성/10월 관찰과11월17일 이전 MAT-290 후속 기록은 당시 이력이다. 현재/다음/상태는 WBS만 소유한다.
- 최종 근거: test758/lint·세 프로필 build/Storybook·문서 링크/anchor/79원본/114Task/156의존/TEAM26/고정 snapshot·diff-check, Context Audit·재실행한 여섯 섹션 ai-review와 read-only verifier PASS. 첫 verifier FAIL(Major1)·자동 수정3/3과 네이티브4회귀를 [리뷰](../reviews/DEV-27.md)에 남겼다. 종료 metadata 뒤 문서 검사와 두 리뷰 freshness를 다시 확인한다.
- 현재 Git 전달: `feat/dev-27-team-members`, 시작 main/HEAD1b30b34 기준 이번 변경만 있으며 다른 작업 변경0. 이번 사용자 요청으로 목적별 commit/push·PR·최종 CI/리뷰·정상 merge commit/main FF까지 승인됐고 Git 단계는 실제 PR/head에서 별도 기록한다. Chromatic 월간 한도만 이번 예외, 검사 성공 위조/보호 우회/직접 main push는 없다.
- 다음 하나: [DEV-28 · 팀원 정보·권한 변경](DEV-28.md#dev-28-dev-27-selection). P0 DEV-01/POL-01·QA-16, P1 DEV-03/POL-02·DEV-04/POL-03와 앞선 P2 회사 DEV-17~21/DEV-08·DEV-26/DEV-19/24의 차단/선행을 유지하면 DEV-27 선행을 충족한 P2 기본 표 순서 첫 후보다. 동시에 가능한 DEV-29/31/32·POL-15/16 등은 시작하지 않는다.
- 다음 첫 행동: 새 대화에서 최신 main/이 조회 구현·POL-14의 행동별 직접/대상 동의/금지·최후 관리자·TEAM-05~10/23/25/26과 당시 backend source/개발 Swagger를 확인한다. 현재 leaf/target/version·계정/회사 수명·직접 변경/동의 생성/결정·알림 안전 route와 실제 자원/사용·복구 범위를 자체 Brief/수정 파일/검증 Gate에서 먼저 확정한다. 이번 DEV-27의 로컬 선행/Chromatic 예외를 DEV-28에 확대하지 않는다.
- 이번에는 DEV-28 전용 계약 재조사·Brief/설계·제품/실제 QA·Git 전달을 시작하지 않았다. 기존 상세의 변경 컨트롤은 준비 중으로 유지하며 실제 업무/API/메일·운영/배포0이다.

- 종료/DEV-28 선정 metadata 뒤 read-only verifier와 primary 여섯 섹션 freshness도 PASS. source/test/SVG 불변·37파일/활성0/준비1·집계·범위/차단 경계 확인. 이후 리뷰 결과/실제 Git 식별자만 추가할 때는 사실/링크/diff 검사로 재확인하고 전면 코드 리뷰를 생략하는 근거를 기록한다.

<a id="dev-27-git-delivery"></a>

## 2026-11-17 · PR 전달 체크포인트

- 목적별6개 커밋: 데이터 `d30a9c8`, UI `93e50f0`, 테스트 `028e8c7`, 구조/재현 문서 `4ba5e7d`, QA/종료·인계 `2442cd5`, 실패 예방 `03c3407`. branch push 완료, [PR #85](https://github.com/mate-pjt/mate-frontend/pull/85) 생성·type: feature/test/docs 라벨 적용. 최초 PR head `03c3407b170eb2ac7378c0cabc9874519f416b48`이며 아직 최종 CI/병합 PASS를 주장하지 않는다.
- 이 PR번호/최초 head·라벨·현재 전달 단계를 담는 추가 문서 커밋 뒤 **실제 최종 head**의 checks/reviews·base 변화·정상 merge/main FF를 재확인한다. source/test/계약·화면/승인 범위는 이전 리뷰의 동일 지문이다. read-only 최종 verifier의 freshness 판단에 따라 이 사실 metadata는 primary가 원격 사실/링크·전체 task diff-check와 문서 검사를 다시 확인하고 전면 코드 리뷰는 재실행하지 않는다.
- 이번 Chromatic 월간 한도 문제만 사용자 승인 예외다. 실제 최종 head의 한도 원인/미실행 검사와 나머지 CI 성공·미해결 리뷰0·정상 merge commit/로컬 main FF/SHA 일치/clean은 PR/최종 보고에서 확인한다. 검사 강제 성공/보호 우회/force push·직접 main push/다음 Task 실행은 없다.

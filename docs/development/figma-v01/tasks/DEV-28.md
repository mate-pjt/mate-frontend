# DEV-28 · 팀원 정보·권한 변경

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: T01
- 선행 작업: [DEV-27](DEV-27.md)
- 목적/범위: 허용된 정보/역할 변경과 완료/오류를 연결한다.
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

- [x] 권한 상승 차단·마지막 관리자·자기 권한 변경·버전 충돌을 확인한다. 로컬/HTTP 대역 결과이며 실제 서버 통합은 아래 D1대로 차단 보존한다.
- [x] 중복/실패·재조회·다른 역할의 서버 거부를 검증한다. mock/HTTP 대역 검증과 실제 QA 미실행을 구분한다.
- [x] 현재 package scripts로 필요한 test/lint/build·diff-check와 영향 시 Storybook 검증을 통과한다.
- [x] 요구사항 Gate에서 정한 로컬 브라우저·권한·오류 사례와 QA를 검증하고, 이번 D1의 실제 API QA9부분 차단을 기록했다. 전체 기능 통합 PASS로 표시하지 않는다.
- [x] Documentation Update Check 및 verifier/ai-review를 통과한다. 종료 metadata freshness와 Git 전달은 아래 후속 증거로 구분한다.

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


<a id="dev-28-pol-14-handoff"></a>

## 2026-11-16 · POL-14 확정 정책/계약 인계

- 인계 근거: [POL-14 D1/D2·v1](POL-14.md#pol-14-contract). 사용자 D1에 따라 **직접 변경과 대상 동의 요청의 생성/조회·본인 수락/거절·회사 취소·충돌**까지 이 Task의 완료 기준에 포함한다. 타인 직급/leaf·내보내기/자기 권한 축소·본인 대표자 취임/소속 종료의 현재 contract를 구분한다. 서비스 계정 탈퇴는 POL-18/DEV-39~40 소유다.
- 확정 완료 기준: 행동 leaf·부여 전체 집합의 actor 부분집합·현재 role 비교를 함께 적용한다. 낮은 타인은 직접, 같은 role/대표자 대상·ADMIN 승격/대표자 지정은 허용된 대상 동의, 높은 대상/과도 부여는 금지다. 본인 변경은 별도 source 경로이며 마지막 유효 활성 ADMIN 강등/소속 종료는 서버 불변식으로 거부한다. 대표자 system 직급 정의 보호와 ADMIN 유지 본인 직급 해제를 구분한다.
- 명령/상태 기준: 직접 expectedVersion, 동의 생성 UUID requestKey/expectedMembershipVersion/kind별 필드, 결정/취소 UUID requestKey/expectedRequestVersion을 그대로 쓴다. CREATED/REUSED/NO_CHANGE·PENDING/APPLIED/REJECTED/CANCELED/INVALIDATED를 구분한다. 같은 target/내용 재사용·알림 중복0/다른 내용 명시 취소·무응답 무기한 대기, issuer 퇴사만으로 무효화하지 않음과 target/version/직급 정의 변화·관리자 경쟁을 검증한다. 요청 생성만으로 현재 권한을 바꾸지 않는다.
- UI/연결 기준: D2 대표자 일괄 불가 안내·버튼을 현재 직접/동의/금지에 맞추되 system 직급 수정/삭제·권한 상한/최후 관리자 제약은 유지한다. 정보 편집을 타인의 계정 생일/전화/이메일 수정으로 확대하지 않는다. 동의 상세/결정 route·알림 actionPath allowlist/현재 target 검증·loading/오류/미확정은 자체 Gate에서 먼저 설계한다. POL-04 현행 allowlist를 자동 확장하거나 알림 읽음/클릭을 동의로 처리하지 않는다.
- 검증 연결: [TEAM-05~10/23/25/26](../../../qa/team-members.md#pol-14-team-qa). 양쪽 동의·오래된 snapshot/직급·최후 관리자 동시 변경·재전달/UUID 충돌·타 회사/계정·권한 상실/화면 수명, 확인된 성공/후속 조회 실패와 응답 미확정·자동 재변경0을 검증한다.

- 이 append는 POL-14의 정책/계약·완료 기준 인계다. 이 Task의 실행/Implementation Brief·설계/제품·실제 QA·Git 전달을 시작한 것이 아니다. 현재/다음/상태는 WBS만 소유한다. 원본2026-10-27 관찰·미작성 Brief·기존 체크리스트/QA는 보존한다.
- 공통 재개 Gate: 최신 Git/main·이 선행 결정/현재 source·게시 Swagger/실행 대응을 확인하고, 자체 성공 기준·수정 파일/영향·검증을 제시한다. `data-access.md`의 같은 company 공급원·public 포트/HTTP/DTO 경계·immutable snapshot/운영 guard·계정 격리를 지킨다. 새 library/endpoint/필드·fallback을 임의 만들지 않는다.
- 실제 업무 GET/변경·메일/초대/직급 실행은 승인된 합성 회사/계정·현재 leaf/상태/버전·환경/Origin/실행 SHA 대응·사용/소비/잔존/복구 범위와 자원 담당 역할이 필요하다. 이번 정책/Git/Chromatic 예외는 해당 자원 확보·실제 QA 면제/로컬 선행 승인이 아니다. 이전 QA-08 AUTH-16 0통과1차단·초대 AUTH-17 미실행과 다른 가입/회사·DEV-08/MAT-162 등 차단을 보존한다.

<a id="dev-28-dev-27-selection"></a>

## 2026-11-17 · DEV-27 뒤 다음 Task 선정/인계만

- [DEV-27 로컬 범위 종료](DEV-27.md#dev-27-close)를 근거로 P2 기본 표 순서의 다음 후보로 선정했다. P0/P1 및 앞선 P2 회사 갱신의 기존 차단·선행은 유지한다. 현재/다음/상태는 WBS만 소유한다.
- 인계 산출물: 같은 company Team 공개 조회 포트와 `/my/team`·`/my/team/[membershipId]`, strict ID/version/현재 leaf/catalog·3page/9row flags, 계정/회사/화면 수명·조회 전후 재확인, 목록 page 복귀와 조회 전용 상세다. 본 Task의 관리 명령/동의·퇴사/내보내기·알림 route를 구현한 것은 아니다.
- 다음 첫 행동: 최신 main/DEV-27·POL-14의 직접/대상 동의/금지·최후 관리자 기준과 TEAM-05~10/23/25/26, 그때의 backend GitHub/개발 Swagger·상태별 Figma를 확인한다. 실제 leaf/target/version·직접 변경/동의 생성·결정/취소·안전 알림 경로/계정·회사 수명과 실제 합성 자원/사용/복구 범위를 자체 Brief·수정 파일·영향·검증 Gate에서 확정한다. 원본 candidate는 구현 Brief 승인이 아니다.
- DEV-27의 로컬 선행·실제 QA 차단 보존/Chromatic 예외는 이번 조회 단위 승인이다. 이 Task의 자동 로컬 선행·실제 업무 변경·Git 전달 승인으로 확대하지 않는다. D2 미제공/MAT-290 지원 재확인·기존 AUTH/회사/문서 QA와 다른 Task 차단을 유지한다.
- 선정/인계만 했으며 전용 계약 재조사·요구사항 확정/설계·제품/Repository 명령·실제 업무/메일/QA·Git 전달을 시작하지 않았다.

<a id="dev-28-brief"></a>

## 2026-11-17 · 확정 Brief와 착수 체크포인트

- 시작: `main`/`944d14e171897cd30a2281cd8a49be32ad845557`, 작업트리 clean. fetch 뒤 origin/main과 동일, 선행 DEV-27 PR #85의 정상 merge 및 POL-14 main 반영 확인. 기존 DEV-28 branch/미커밋 변경 없음. 새 `feat/dev-28-team-member-changes`를 같은 HEAD에서 생성했다.
- 유형/요구사항: DEV-28 하나의 개발 작업. 같은 company 공급원에서 회사 소속의 직급·전체 leaf 변경, 직접/대상 동의/금지·본인 축소/대표자 취임·소속 종료, 동의 생성/조회/결정/취소와 상태·오류를 연결한다. 개인 계정 이름/이메일/생일/전화 편집은 포함하지 않는다.
- 이번 Git 승인: 사용자2026-11-17 최초 요청의 검증/두 리뷰·작은 목적별 commit/push·PR/최종 CI·정상 main 병합·로컬 main FF. 이번 Chromatic 월간 한도만 예외이며 강제 성공/보호 우회는 없다. 실제 업무/API·메일·운영/배포 승인과 구별한다.
- D1 결정자/날짜/원문: 이번 사용자2026-11-17 **“로컬 선행·실제 API QA 차단 보존 (추천)”**. 실제 HTTP 연결 코드와 mock/HTTP 대역/브라우저를 완료하고 TEAM 실제 통합은 자원·실행 대응/사용·변경·잔존·복구 범위 확보 전 차단으로 남긴다. DEV-27의 예외를 가져온 것이 아니다.
- D2 결정자/날짜/원문: 이번 사용자2026-11-17 **“제안한 경로·명시 동의 화면 채택 (추천)”**. backend 알림의 정확한 `/my/team/change-requests/{양수 ID}`만 allowlist에 추가한다. 목록 `/my/team/change-requests`의 내 요청/회사 요청과 기존 my 카드/팝업을 조합한 변경 전/제안/상태·본인 수락/거절·담당자 취소를 채택한다. 읽음/클릭은 동의가 아니며 외부·query·encoded/임의 경로를 허용하지 않는다. 기존 POL-04 범위를 이 승인 경로 외로 확대하지 않는다.
- 성공 기준: 행동 leaf/부여 actor 부분집합·현재 target/version·capabilities 확인, 직접 저장과 동의 생성/적용 구분, 마지막 ADMIN/본인/대표자·권한 상승/서버 거부·충돌·중복/미확정/명시 재조회, 계정/회사/탐색 수명과 오류/접근성/모바일. 자동·실제 Next 로컬 QA, 문서 검사·Context Audit/두 리뷰 PASS. 실제 API QA와 Git/main 반영은 별도 판정.
- In scope/수정 파일: company Team management 계약·HTTP/DTO 경계·mutable mock/공개 client/factory, 팀원 상세·변경 요청 목록/상세 routes·controller·현재 알림 경로 검증, 관련 Node 계약/수명 테스트·mock 시나리오, Task/검토·TEAM QA/자산·WBS/ai-context·개발 가이드. 계정 공간과 기존 회사/문서/신청/초대 이력 보존.
- Out of scope: DEV-29~33 초대 발송/관리·신청 검토·직급 정의 CRUD/수락 목적지, 회사 갱신/합치기·문서/OCR·서비스 계정 탈퇴, backend/중앙 문서·실제 업무 변경/메일·운영/배포·새 library·다음 Task 실행. 기존79원본/114Task/156의존·baseline/coverage/QA/승인 예외를 보존한다.
- 확인 패턴: AGENTS/feature-workflow·ai-review/context-audit/verifier, WBS/workflow/task-cycle·DEV-27 종료·POL-14 v1·TEAM-05~10/23/25/26·ai-context6문서와 package.json. `team-contracts/api/mock`, public company client/factory, `features/company/team.ts`의 전후 company/leaf·계정 epoch/Abort와 `MyTeamClient`/Link onNavigate, 기존 SelectBox/CheckboxSquare/Button/팝업·tokens·알림 allowlist를 확인했다.
- 근거 재확인: backend dev `adc0e265ef0e2aa78ccb376e1fa322edd664b290`, 중앙 main `c9e50ff591ae18023164e1a94581c611bf1e4f29`. 공개 OpenAPI GET200·SHA256 `85b38b6e43ad45807a1d8c66153767c53876220dbf84852cbc4fa53d832917ba`로 기존과 동일. 직접 DTO/서비스·동의 DTO/정책/권한·알림 exact path를 고정 source와 대조했다. 소스·게시 명세는 실행 SHA/실제 업무 응답·권한 집행 증거가 아니다.
- Figma: 3137:53331/54225 상세·53331의 직급53403/역할53410 카드와 기존 DEV-27 구조를 재사용한다. D2 대표자 행동별 안내/개인정보 미제공을 유지하고3category/15leaf는 POL-14의 기능 기준이다. 새 동의 화면은 이번 D2의 구체 UX 채택이며 기존 상세 전체/pixel 예외 승인이 아니다.
- 단계/위험: 계약/HTTP와 mock → 명령·조회 수명 → 상세 편집/동의 route·알림 → 자동/브라우저 → 문서/Context Audit → 두 리뷰 → 종료/인계/freshness → 목적별 Git 전달. 생성=적용 오인, 부분 direct 저장·응답 유실 자동 재변경, ADMIN 수·대표자 정의/소속 혼동, 타계정 결과 노출을 집중 검증한다.
- 검증: Node22.20.0/pnpm11.3.0의 `pnpm test`, `pnpm lint`, 환경파일 없는 격리 API/mock/hybrid `pnpm build`, `pnpm build-storybook`, 실제 Next mock/loopback HTTP·모바일/키보드·오류, 문서 link/ID/의존/원본·범위 보존/Markdown·`git diff --check`. 실제 API QA는 D1대로 차단 보존하며 미실행을 PASS로 세지 않는다.
- 낮은 위험 가정: 기존 카드·native 팝업/명시 제출·page 복귀·KST 표시를 유지하며 새 endpoint/role/leaf/권한 정책을 만들지 않는다. D1/D2 뒤 blocking ambiguity 없음. 자동 수정0/3. 다음 행동은 확정 계약/mapper·mock 명령 구현이다.
- 조사 출력 사건: 첫 PR structuredContent에 불필요한 공개 계정 metadata가 출력됐다. 사용자에게 알렸으며 실제 값은 이 기록/QA/PR에 재인용하지 않는다. 이후 ref/SHA·경로·필요 source/계약·CI 상태만 새 객체로 추출한다. env/credential·실제 업무 응답을 읽은 사건과 구분한다.


### 구현 뒤 첫 검증 · 자동 수정1/3

- Node22.20.0 `pnpm test`: 최초814 중813 PASS/fixture1FAIL. 같은 Response 객체를 재사용해 두 번째 json 읽기가 실패한 테스트를 요청마다 새 Response로 고쳤다. 제품 HTTP 응답을 fallback/성공으로 완화하지 않았다.
- 첫 격리 API `pnpm build --webpack`: 컴파일 성공 뒤 nullable companyId의 TypeScript narrowing 실패. never 반환 helper를 함수 선언으로 명시해 null 거부 뒤의 타입을 보존했다. lint의 unused type2/Effect 의존1도 같은 최소 수정에서 정리했다. 새 라이브러리/설정 변경 없음.
- 코드/로컬 UI 연결은 진행 중이며 실제 통합은 D1대로 미실행·차단 유지. 다음 행동: 전체 test/lint/API 재빌드와 mock/hybrid·Storybook/브라우저 QA.

### 재검증과 자동 수정2/3

- 전체829 tests/lint PASS. 두 번째 API build는 TeamIntent의 leave/remove 합쳐진 discriminant가 후속 callback에서 좁혀지지 않는 TypeScript 오류였다. 두 intent를 개별 union으로 분리했다. IDE 진단에서 관련7파일의 다른 TypeScript 오류는0이며 실제 build PASS의 대체 근거로 삼지 않는다. 다음은 세 구성 build·실제 로컬 브라우저 검증이다.


### 독립 verifier 첫 FAIL과 수정3/3

- 첫 독립 source 검토 FAIL: Major3(요청 조회/취소의 최신 소속·leaf 확인, 회사 요청의 대상 식별, 병렬 mock 명령의 version 이중 소비/성공 유실)·Minor1(REUSED terminal을 대기로 안내). 기존829 tests/build PASS가 이 결함을 검출하지 못했음을 보존한다.
- 최소 수정: 회사 요청/현재회사 상세의 전후 current membership·leaf 비교, CANCEL kind별 최신 leaf·회사 검사, 같은 회사 exact target 조회(동시4개)/과거·종료 target 명시 fallback, mock account/store 명령 lane의 최신 읽기→검사→쓰기 직렬화, terminal REUSED 실제 상태 안내. 개인 과거 이력 조회·회사/계정 격리와 기존 API version/UUID를 유지한다.
- 브라우저 보완: draft validation과 제출 뒤 오류를 분리해 일반직급 선택을 수정 가능하게 하고, 긴 성공 안내는 banner에 보존/Toast는 짧은 첫 문장으로 표시한다. editor Link는 실제 onNavigate에서 수명을 해제한다. 새 정책/API/library·다른 Task 구현 없음.
- 추가8회귀와 전체 자동/세 구성·Storybook/브라우저·문서 검사 및 두 리뷰를 재실행한다. 자동 수정3/3이며 이 뒤 계속 실패하면 추가 자동 수정하지 않고 실제 원인/재개 조건을 보고한다. 실제 API 통합은 D1대로 차단 유지.

<a id="dev-28-verification"></a>

## 2026-11-17 · 최종 검증·문서 갱신 체크포인트

- Node22.20.0/pnpm11.3.0, `pnpm test`30파일838 PASS·`pnpm lint` PASS/경고0. 최종 source와 발행자 퇴사/직급 정의 변경의 강화된 테스트를 포함한 격리 API `pnpm build --webpack` PASS, 같은 runtime source의 mock/hybrid build·`pnpm build-storybook` PASS. local webpack 선택과 remote 기본 Turbopack/최종 head 검증은 구분한다. 실제 package scripts 외 type-check/format을 만들지 않았다.
- 로그는 `/tmp/mate-dev-28-contract/test-verified.log`, `lint-verified.log`, `build-api-final.log`, `build-mock-verified.log`, `build-hybrid-final.log`, `storybook-verified.log`다. 환경파일 없는 격리 복사본/기존 node_modules만 사용했고 추가 설치/실제 환경값 열람0이다.
- [브라우저/TEAM 기록](../../../qa/team-members.md#dev-28-local-qa): 실제 Next mock·loopback API에서30관찰 PASS(수정 뒤 mock3재관찰 포함)와 fixture-invalid1을 구분한다. current role 유지/동의 생성·본인 수락/거절·회사 취소/대상 표시, 직접 저장·native 취소 초점·미확정/409/최종401·권한/읽기 전용/404·성공 뒤 조회 실패·최후 관리자 거부·본인 소속 종료/서비스 계정 유지·입력 교정/모바일을 확인했다. 알림 읽음1/결정0, 두 프로필 외부 origin0이며 raw 판정·합성 캡처를 보존한다. fullPage/Aside focus/ref 도구 한계·genuine hidden 미실행을 숨기지 않는다.
- 실제 API0통과·TEAM-05~10/23/25/26의9개 소유 부분 차단: 담당 역할·합성 회사/여러 관리자/대상/대표자/원래 소속/version·환경 실행 SHA 대응/Origin·열람/사용·권한/소속 변경·알림 잔존·복구 범위 미확보. 로컬/mock/HTTP source·게시 명세/배포 success를 실제 통합으로 올리지 않는다. 기존 TEAM26·DEV-27 추가 hidden1/QA-08/AUTH-16/17·가입/회사/문서·DEV-08/MAT-162/다른 Task 차단·승인 예외는 유지한다.
- Documentation Update Check: architecture/data-access·plan·재현 가이드·Task/QA/WBS·검토·ai-failures 갱신. base/package/scripts/lockfile·harness/agent/config 등록은 변화가 없어 유지한다. baseline/coverage 고정5파일·79원본/114Task/156의존·TEAM26·과거 QA/정책 원문은 보존했다. [Context Audit](../reviews/DEV-28-context.md) PASS, 문서 링크/anchor·상태/의존·원본·Markdown·범위 보존 및 `git diff --check` PASS. 종료 metadata 뒤 검사/freshness를 다시 수행한다.
- [ai-review 여섯 섹션/첫 독립 FAIL·수정](../reviews/DEV-28.md)을 기록하고 최종 read-only verifier 재검토를 요청했다. 현재 판정은 필수 Review Gate 대기이며 로컬 Task 최종 PASS/원격 CI/PR·main 반영을 아직 선언하지 않는다. 다음 첫 행동은 재검토 결과를 확인하고 Task/WBS 종료·DEV-29 선정/인계만 반영한 문서 freshness다. git fetch 뒤 main/remote는 시작 SHA 그대로이고 아직 이번 commit/push0이다.

<a id="dev-28-close"></a>

## 2026-11-17 · 로컬 범위 종료와 Git 전달 전 체크포인트

- 이번 D1/D2의 개발·자동/로컬 브라우저·문서/Review Gate 범위 PASS. [독립 verifier 최종 결과/ai-review6섹션](../reviews/DEV-28.md)에서 미해결 Blocker/Major/Minor0, 독립838 tests·diff-check와 병렬 factory/version 경쟁 재현을 확인했다. 첫 FAIL·수정3/3·fixture-invalid1·이전 차단을 보존했다.
- 구현 산출물: 같은 company 공개 management 포트의 실제 HTTP/엄격 DTO·가변 mock, 현재 역할/전체 leaf·직급 편집과 본인 축소/대표자 취임·소속 종료/내보내기, 직접/동의/금지 판정과 생성·내/회사 목록·명시 수락/거절/취소, exact 알림 route. 생성/읽음은 적용/동의가 아니며 계정/회사/탐색·전후 current leaf/version·확인 성공과 후속 조회 실패를 구분한다.
- 실제 API 통합은0통과·9소유 부분 차단이다. D1은 로컬 선행 승인이고 서버 운영/실제 권한·소속 변경/알림·복구·메일·배포를 실행한 것이 아니다. 미실행/도구 한계와 다른 Task/QA·화면 예외를 유지한다.
- Documentation Update Check/Context Audit PASS. 종료/WBS·다음 인계 metadata를 추가했으므로 문서 link/ID·의존/상태·원본 보존·Markdown·diff-check와 두 리뷰 freshness를 다시 확인한다. source/test·정책/승인·검증 범위의 후속 변경은 없다.
- 다음 하나는 [DEV-29](DEV-29.md#dev-29-dev-28-selection)다. WBS에서 P0/P1 및 앞선 P2의 기존 외부/선행 차단을 보존하고 기본 표 순서상 첫 독립 후보(선행 DEV-27 완료)를 선정했다. DEV-30의 DEV-29 선행·다른 후보 순서를 바꾸지 않았다. 선정 이유/다음 첫 행동만 인계하고 자체 조사·설계·제품/QA/초대 발송을 시작하지 않았다.
- Git 전달은 별도 진행: 승인된 목적별 commit/push·PR/실제 최종 head CI·리뷰/정상 merge/main FF가 다음 행동이다. PR/CI·main SHA 일치·clean은 실제 원격/종료 보고로 확인하며 Task 로컬 PASS를 Git 완료로 대신하지 않는다.
- 종료 metadata freshness도 PASS: 독립 verifier가 Task/WBS·DEV-29 선정/인계와 역사적 첫 행동 보완을 확인했다. 문서12개/677링크·114Task/156의존/79원본/보호5/TEAM26 오류0·diff-check PASS, primary ai-review6섹션 재적용 PASS다. 이후 이 결과/PR 식별자 같은 사실 metadata만 추가하면 문서 검사·primary 리뷰로 확인하며, source/test·정책/검증 범위가 같아 앱 검증·독립 verifier 반복은 생략한다. 변경이 생기면 관련 검증/리뷰를 다시 수행한다.

<a id="dev-28-git-delivery"></a>

## 2026-11-17 · 목적별 커밋/PR 전달 체크포인트

- `feat/dev-28-team-member-changes`에서 목적별6커밋: 데이터/API `a998a47`, 화면/명시 동의 `b8cab68`, 테스트 `8a70921`, 구조/데이터 가이드 `7957c57`, Task/QA/인계 `91d4d18`, 실패 기록 `338783b`. 모두 Conventional Commits의 영어 type/한국어 설명이며 unrelated 변경0이다. 최초 push head는 `338783b9e01e97f9418c038d071f89ed2d6edbb5`, 원격 branch와 같고 작업트리 clean이었다.
- [PR #86](https://github.com/mate-pjt/mate-frontend/pull/86)을 root template에 맞춰 작성하고 `type: feature`/`type: test`/`type: docs` 라벨·합성 캡처/검증·실제9차단·이번 Chromatic 한도 예외를 연결했다. 생성 당시 base `944d14e171897cd30a2281cd8a49be32ad845557`, 최초 원격 CI 실행 중·리뷰/미해결 thread0이다. 생성 결과를 CI/병합 PASS로 세지 않는다.
- 정상 merge commit 허용을 확인했다. 현재 main branch protection 조회는404(Branch not protected), 적용 rules는 빈 배열이다. 승인된 최종 head의 data-access tests/lint·API/mock/hybrid 기본 Turbopack과 Chromatic/기타 check·리뷰 상태, 최신 base/head를 다시 확인한다. quota 관련 check만 이번 명시 예외이며 check 강제 성공·force push/보호 우회·직접 main push는 하지 않는다.
- 이 후속은 PR 식별자/전달 사실 metadata뿐이다. 문서 검사/diff-check·primary ai-review6섹션을 다시 적용하고 별도 docs commit으로 push한다. source/test·정책/검증 범위가 같아 앱 test/lint/build·독립 verifier 반복을 생략한다. **이 기록 이후 최종 head CI·정상 merge·로컬 main FF/SHA 일치·clean은 실제 PR 타임라인과 종료 보고의 별도 근거**로 확인한다. DEV-29 실행/실제 업무·메일·배포는 없다.

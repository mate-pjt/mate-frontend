# DEV-31 · 합류 신청 목록·검토·승인/거절

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: T03
- 선행 작업: [DEV-27](DEV-27.md)
- 목적/범위: 받은 회사 소속 신청의 검토·역할 지정·승인/거절을 연결한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### T03 · 합류 신청 검토·승인/거절
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **프론트 계약 없음**. 검증: 코드 대조.
- 남은 점: 받은 신청 목록·검토 팝업·승인/거절·역할 설정
- Figma: [3137:53069](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53069) / [3137:53154](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53154) / [3137:53193](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53193)
- 소유 소스/기존 기록: [src/components/my/my-side-menu.tsx:12](../../../../src/components/my/my-side-menu.tsx)

## 완료 기준

- [ ] 신청 상태·대표/팀원·권한·중복/동시 취소/이미 처리를 확인한다
- [ ] 승인 후 소속/팀원 목록·거절 후 신청자 상태·실패를 검증한다
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


<a id="dev-31-pol-14-handoff"></a>

## 2026-11-16 · POL-14 확정 정책/계약 인계

- 인계 근거: [POL-14 D1·v1](POL-14.md#pol-14-contract). 원본 T03의 회사 신청 목록/상세·검토/승인·사유 거절이다. 신청자가 본인 PENDING을 취소하는 DEV-15·가입 요청/회사 간 통합과 구분한다.
- 확정 완료 기준: 현재 REVIEW leaf와 같은 회사 ACTIVE 소속을 검사하고 VIEWER 목록 leaf만으로 신청 내용을 읽지 않는다. 서버 page/count/순서(CREATED_AT ASC/id ASC)를 보존하고 요청값과 실제 applied 직급/role/permissions/소속 ID·상태/version/이력을 구별한다.
- 승인 기준: 원래 신청 직급에서 바꾸려면 PROFILE_EDIT, VIEWER 초과는 PERMISSION_MANAGE+actor 부분집합. 대표자 승인에는 원래 대표자 신청·ADMIN·현재 대표자 공석, 별도 일반 직급/preset/추가 leaf 없음이 필요하다. 원자 소속 생성·다른 pending 정리를 조회로 확인한다. 현재 요청의 다른 상태/버전을 자동 재승인하지 않는다.
- 거절은 trim 후1..300자 사유/expectedVersion으로 수행한다. 본인 취소·다른 담당자 처리·다른 회사 활성 가입/권한 변화·대표자 경쟁과 401/403/404/409/미확정·후속 조회 실패·계정/회사/화면 수명을 검증한다.
- 검증 연결: [TEAM-18~20/23/26](../../../qa/team-members.md#pol-14-team-qa), Figma3137:53069/53154/53193. 회사·reviewer/신청자·합성 신청의 사용/변경·잔존/복구·실행 대응을 확보한다.

- 이 append는 POL-14의 정책/계약·완료 기준 인계다. 이 Task의 실행/Implementation Brief·설계/제품·실제 QA·Git 전달을 시작한 것이 아니다. 현재/다음/상태는 WBS만 소유한다. 원본2026-10-27 관찰·미작성 Brief·기존 체크리스트/QA는 보존한다.
- 공통 재개 Gate: 최신 Git/main·이 선행 결정/현재 source·게시 Swagger/실행 대응을 확인하고, 자체 성공 기준·수정 파일/영향·검증을 제시한다. `data-access.md`의 같은 company 공급원·public 포트/HTTP/DTO 경계·immutable snapshot/운영 guard·계정 격리를 지킨다. 새 library/endpoint/필드·fallback을 임의 만들지 않는다.
- 실제 업무 GET/변경·메일/초대/직급 실행은 승인된 합성 회사/계정·현재 leaf/상태/버전·환경/Origin/실행 SHA 대응·사용/소비/잔존/복구 범위와 자원 담당 역할이 필요하다. 이번 정책/Git/Chromatic 예외는 해당 자원 확보·실제 QA 면제/로컬 선행 승인이 아니다. 이전 QA-08 AUTH-16 0통과1차단·초대 AUTH-17 미실행과 다른 가입/회사·DEV-08/MAT-162 등 차단을 보존한다.

<a id="dev-31-dev-30-selection"></a>

## 2026-11-17 · DEV-30 뒤 선정·인계만

- 선정 이유: WBS의 P0/P1과 앞선 P2의 외부/선행 차단·보류를 유지한 기본 표 순서에서 첫 독립 후보다. DEV-27 선행의 로컬 범위 산출물을 확인했고 DEV-32·POL-15보다 앞선 원래 순위를 따른다. 상태는 WBS만 소유한다.
- 인계: [DEV-30 로컬 검증/리뷰](DEV-30.md#dev-30-close)의 공개 company 초대 포트·정확 version/현재 권한·수명/인증 직전 guard·부분 성공·mock 격리/공유 명령 lane을 참고할 수 있다. DEV-31의 신청 목록/검토/역할·승인/사유 거절은 별도 도메인이며 기존 발송 관리나 DEV-15 본인 취소로 대체하지 않는다. 실제 DEV-30 QA0통과6차단은 그대로다.
- 다음 첫 행동: 최신 main/미커밋 변경과 DEV-27·POL-14 D1·이 원래 정의를 확인하고 현행 신청 소유 source를 읽는다. 그 대화에서 최신 backend/게시 Swagger와 실행 대응·신청자/reviewer·합성 회사/신청의 사용/변경·잔존/복구 범위를 확인한 뒤 자체 Brief·수정 파일/영향·검증을 제시한다. API/DTO 설계 전에 data-access.md를 읽는다.
- 인계 범위: 원래 Figma3137:53069/53154/53193·TEAM-18~20/23/26·현재 REVIEW leaf와 승인된 역할 부여/거절 사유·동시 처리/수명 Gate를 보존한다. DEV-30의 D1 로컬 선행·D2 PATCH 확장·Git/Chromatic 승인을 다음 Task 승인으로 확대하지 않는다.
- 이번에는 선정·첫 행동 인계만 했다. DEV-31 전용 계약 조사·설계/Implementation Brief·제품/Repository·실제 업무/API·승인/거절/메일·QA·별도 Git 전달을 시작하지 않았다. 원본 정의/미작성 Brief·기존 정책/QA/차단을 보존한다.

<a id="dev-31-brief"></a>

## 2026-11-18 · 확정 Brief와 착수 체크포인트

- 유형/요구사항: T03 하나의 개발 작업. 받은 회사 합류 신청 목록/검토·역할/권한 지정·승인·사유 거절을 현행 계약으로 연결한다. 과거 후보 정의와 미작성 Brief는 당시 이력이다.
- 승인: 이번 사용자 최초 요청의 개발·검증·read-only verifier/ai-review·목적별 commit/push·PR·실제 최종 head CI/리뷰·정상 merge/main FF를 명시 승인받았다. 이번 Chromatic 월간 한도만 예외이며 과거 Task 예외를 승계하지 않는다. 사용자 D1 원문 **“로컬 선행·실제 API QA 차단 보존 (추천)”**(2026-11-18, 이번 대화 사용자)을 수신했다. 실제 업무 GET/승인·거절/메일·운영·배포는 실행하지 않는다.
- Git: fetch 뒤 main/origin/main `1be8f7812f7add7f1dc6f744498b694e88aef5d1` 일치·clean. DEV-27 PR #85와 DEV-30 PR #88 선행이 main에 반영됐다. 기존 DEV-31 branch/미커밋 변경0, `feat/dev-31-membership-review`를 최신 main에서 생성했다. 다른 작업 삭제/reset/stash0.
- 성공 기준: REVIEW leaf·같은 회사 현재 소속을 pre/post/제출 직전에 확인한다. 목록 page/count·createdAt ASC/id ASC, requested와 applied·version/시각을 구분하고 원 요청/정확 version·대표자/직급/부여 부분집합·사유1..300 제약을 지킨다. 승인 receipt와 팀원 재조회·거절 receipt/목록 제외·충돌/미확정·후속조회 실패를 구분하며 자동 재결정0, 계정/epoch/회사/화면/인증 직전 수명을 방어한다. 필수 자동/실제 Next 로컬 브라우저·문서·두 리뷰를 통과한다. 실제 API 통합 PASS는 주장하지 않는다.
- In scope/수정 후보: `src/data/company/team-membership-request-*` 계약/HTTP·입력/가변 mock, 기존 company contracts/client/factory와 공유 팀원 mock 상태 연결, `src/features/company/team-membership-requests.ts`, `src/components/my/team-membership-*`, `/my/team/membership-requests` route와 기존 팀원 신청 진입, 관련 tests·Task/WBS·QA/architecture/data-access/plan·검토 기록. mock 상태와 실제 API 응답은 섞지 않는다.
- Out of scope: DEV-15 본인 취소 구현 변경·초대 기능 재구현·직급 정의 CRUD(DEV-32)·수락 목적지(POL-15/DEV-33), 개인 프로필/생일/전화·다른 Task, backend/중앙 정책 편집, 새 library·endpoint/필드/fallback·운영/배포·실제 업무 API·메일. API source/게시 계약은 read-only 조사했다.
- 확인한 패턴: AGENTS/세 Skill·verifier, WBS/workflow·79ID coverage·T03 baseline, DEV-27/POL-14 D1/DEV-30 인계, ai-context6문서/package8scripts·실제 team/public company·shared AuthAccess/HTTP·mock command lane·native dialog/Button/Select/Checkbox/Toast. Node 기본 v26.5.0과 `.nvmrc`22.20.0 차이는 실행 환경 차이이며 검증 시 설치된22.20.0 PATH를 사용한다.
- 설계/단계: 같은 company 공급원의 공개 검토 포트/DTO allowlist → 공유 mock lane 아래 신청 상태와 실제 팀원/직급 반영 → 계정·회사·권한 전후 조회/명시 명령 scope → 신청 route/검토640px native dialog·사유 거절 → 자동·browser/문서 검증·Documentation Update Check·두 리뷰 → 종료/다음 선정·목적별 Git 전달. 기존 토큰·아이콘/컴포넌트를 재사용하고 새 library는 없다.
- 가정/위험: UI page1/API page0·독립 신청/초대 count를 유지한다. 승인 기본 역할 VIEWER, 신청 직급/제안명은 원값으로 시작한다. 변경된 직급에는 PROFILE_EDIT, VIEWER 초과에는 MANAGE+actor 부분집합을 검사한다. 대표자 원신청은 ADMIN만 검토/승인 가능하고 공석은 서버 명령에서 최종 검사한다. PENDING 전용 GET을 terminal 이력 API로 추정하지 않는다. 손상2xx/유실/409/404는 명시 조회이며404를 특정 결정의 성공으로 해석하지 않는다.
- 검증 계획: Node22.20.0/pnpm11.3.0의 `pnpm test`, `pnpm lint`, API/mock/hybrid Preview `pnpm build`, `pnpm build-storybook`, `git diff --check`; 실제 Next mock/loopback HTTP 대역 브라우저 정상·권한/대표자·version/사유·오류/미확정·중복/경쟁·계정/회사/화면·키보드/360px·복원, 문서 링크/원본79ID/114Task/156의존/상태·QA 보존/Markdown. 실제 TEAM-18~20/23/26의 이번5소유 부분은 자원·실행 대응·사용/변경/잔존/복구 미확보로 차단 보존한다.

<a id="dev-31-investigation"></a>

### 현행 소유 source·게시 계약·Figma (2026-11-18)

- backend dev `545ef153e30569a516f1585d60bdf00ce70d7f3a`와 [CI run44026382503](https://github.com/mate-pjt/mate-backend/actions/runs/44026382503) success를 현재 조회했다. 실행 중 process SHA/실제 업무 응답은 미확인이다. [review service](https://github.com/mate-pjt/mate-backend/blob/545ef153e30569a516f1585d60bdf00ce70d7f3a/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/membershiprequest/CompanyMembershipRequestReviewServices.kt), [request](https://github.com/mate-pjt/mate-backend/blob/545ef153e30569a516f1585d60bdf00ce70d7f3a/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companymembership/membershiprequest/request/CompanyMembershipRequestRequests.kt), [pending query](https://github.com/mate-pjt/mate-backend/blob/545ef153e30569a516f1585d60bdf00ce70d7f3a/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companymembership/membershiprequest/CompanyMembershipRequestReviewQueryPersistenceAdapter.kt)를 고정 근거로 삼는다.
- [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs)는 Aside의 안전한 GET200/OpenAPI3.1.0이다. 회사별 목록/상세 GET·approval/rejection POST를 확인했다. 실제 wire `isSuccess`와 게시 `success` 차이·현재 실행 대응은 실제 QA 재개 조건이다. 계정/업무 API 호출0.
- 소유 source의 **목록과 상세 모두 PENDING 전용**이다. 결정 POST는 terminal receipt를 반환하지만 후속 상세 GET은404일 수 있다. approved membership exact GET/목록과 검증된 receipt를 보존하고, 거절 후404/목록 제외를 신청자 실제 상태 검증으로 올리지 않는다. 승인은 계정→회사→신청 잠금·원자 소속 생성·다른 신청/초대 정리, 거절은trim·제어문자 없는1..300 사유다. 기대 version+1/actual applied 정보와 요청값을 분리한다.
- Figma design context/screenshot: 3137:53069 신청/보낸 초대 목록, 3137:53154의640×908 검토 dialog(내부3028:109913), 3137:53193은 **거절 완료 Toast/빈 목록**이다. 마지막 frame을 사유 입력 popup으로 오기하지 않는다. 대표자/일반·직급/역할/leaf 제약은 POL-14 D1의 기능 기준이며 화면 전체 예외 승인은 없다. 원본 frame 밖 오류/사유 입력은 기존 native dialog와 토큰 패턴으로 보완하고 전 상태/pixel 전수 PASS를 주장하지 않는다. 디자인 예시 신원/연락처·임시 asset URL은 출력/Task/QA/PR에 복사하지 않는다.

### 체크포인트

- 2026-11-18 09:42 KST / Codex: 위 Gate/설계를 사용자에게 제시하고 D1을 수신했다. branch는 시작HEAD 위, 코드 수정 전. 다음 첫 행동은 공개 신청 계약/HTTP 경계와 공유 mock 상태·명령 lane을 구현하는 것이다. 자동 수정0/3, 실제 업무/메일0. 현재 상태는 WBS만 소유한다.
- 2026-11-18 10:02 KST / Codex: 공개 포트/HTTP·공유 mock 상태/serializer·조회/명령 scope·route/검토 UI·79신규 회귀를 구현했다. `pnpm test`1080/1080(37files), lint0, 격리 API/mock/hybrid build가 통과했다. 실제 Next mock 브라우저에서23건 page·640×908 dialog·승인 receipt/version2·22건/승인된 팀원 exact GET·요청/실제 권한 표시를 확인했다. 최초 pnpm 격리 실행의 의존성 자동 install/TTY 차단은 설정 변경 없이 `pnpm_config_verify_deps_before_run=false`로 실행해 해소했다. 자동 설치·package/lock 변경0. browser의 SVG 비율 경고는 기존 h-auto/w-auto 패턴으로 교정(검증 후 수정1/3)했고 최종 재검증 대상이다. Aside 다음 call의 focus 재조회로 dialog가 닫힌 관찰/뒤로가기 timeout은 fresh snapshot으로 구별하며 성공으로 소급하지 않는다. 다음은 남은 browser·HTTP 대역·문서/독립 검토와 최종 재검증이다. 현재 변경은 이번 Task뿐이며 실제 업무/메일0이다.

<a id="dev-31-verification"></a>

### 2026-11-18 · 최종 검증·Documentation Update Check·리뷰 체크포인트

- Node22.20.0/pnpm11.3.0의 `pnpm test`1085/1085·37files(신규84), `pnpm lint`0, API/mock/hybrid Preview `pnpm build`3/3·Storybook PASS. `/tmp/mate-dev31`의 로그/최종 source SHA25618파일이 작업트리와 일치한다. 실제 업무/메일0, Task 소유 loopback/Next2개·대역과 browser탭2개는 종료했다. 합성 저장소/임시 증거는 실제 업무 데이터 복구를 뜻하지 않는다.
- [TEAM 로컬 QA](../../../qa/team-members.md#dev-31-local-qa)에 실제 Next mock/HTTP 대역 정상 승인·사유 거절/권한·미확정/409/후속503·최종401/수명/페이지·계정/모바일·키보드, [비식별 화면](../assets/dev-31/README.md)을 연결했다. 유실은 앱fetch1/wire2(재전송409), Meta 새 탭·도구 focus/뒤로가기·접힌 details의 미판정을 명시한다. 실제 TEAM-18~20/23/26 이번5소유 부분0통과·차단 보존이며 신청자 별도 계정/다른 회사 pending·기존 수신 초대 원자 정리는 미실행이다.
- 첫 독립 verifier FAIL/Major1은 과거 승인 receipt와 현재 팀원 변경/내보내기 비교의 전체 목록 고착이었다. 수정2/3에서 역사/현재 확인 결과를 분리하고5회귀·실제 브라우저를 확인했다. 이후 Figma footer danger/문구·source enum CM004를 대조했다. 예정 리뷰 파일 미생성 링크3개를 문서 수정3/3으로 해소했고 [문서 검사](../reviews/DEV-31.md)는114Task/156의존/79ID/TEAM26·723로컬 링크/18source해시·prefix/기준선/Markdown/diff PASS다. 최초1080 PASS/첫 FAIL/도구 한계를 숨기지 않는다.
- Documentation Update Check: architecture/data-access/plan·repository시나리오·QA/Task/WBS/검토·화면·ai-failures 갱신. base/harness·package/scripts/lockfile/하네스/coverage·baseline은 사실 변경0으로 미갱신. Context Audit PASS. 상태는 WBS만 소유한다.
- primary ai-review는 [6절](../reviews/DEV-31.md) 모두 수행해 로컬 범위 PASS/미해결 Blocker·Major·Minor0이다. 실제5QA 차단·Figma pixel/Meta 전수 미판정을 잔여 경계로 명시했다. 수정 뒤 최종 read-only verifier 재검토를 요청한다. 현재 branch는 시작HEAD 위/이번 변경만 dirty이며 commit/push 전이다. 다음 첫 행동은 최종 독립 Gate→종료/WBS·다음 하나 인계 뒤 freshness→목적별 Git 전달이다. 다음 Task 실제 착수 없음.

<a id="dev-31-close"></a>

### 2026-11-18 · 로컬 승인 단위 종료·다음 선정

- [수정 후 독립 verifier](../reviews/DEV-31.md)는 최초 반례/1085 tests·18source해시·문서727links/114/156/79/TEAM26/prefix/diff를 다시 확인해 PASS, 미해결 Blocker/Major/Minor0·수정0이다. primary6절 ai-review도 PASS다. 아래 종료/인계 metadata는 작성 뒤 두 검토의 freshness를 다시 확인한다.
- 이번 D1 범위의 체크리스트: [x] 회사/현재 REVIEW·신청 상태/직급/역할·원 대표자/권한·정확 version·동시 처리·성공/미확정·후속 조회. [x] 전체 자동/실제 Next 로컬 browser/HTTP 대역·Documentation Update Check·두 리뷰. 실제 신청자/다른 회사 pending·수신 초대 원자 정리 등 **실제 API5QA는 미실행/차단**이며 기존 원본 체크리스트를 실제 통합 완료로 바꾸지 않는다.
- 다음 하나는 [DEV-32 인계](DEV-32.md#dev-32-dev-31-selection)다. 앞선 P0/P1의 외부/정책/선행 차단·P2 회사 갱신/신규 서류/MAT-162 등의 대기/보류를 유지하고, DEV-27이 완료된 기본 P2 표 순서 첫 독립 후보를 골랐다. POL-15/DEV-33·다른 Task를 앞당기거나 소유/우선순위/원본 의존성을 바꾸지 않는다.
- 첫 행동/한계: 최신 main·DEV-27/POL-14 D1·원래 DEV-32 정의와 현행 직급 source/Swagger·Figma/실제 자원의 자체 Gate부터 시작한다. 이번 신청 승인 중 제안 직급 해결은 직급 정의 CRUD 구현이 아니다. DEV-31 D1·Git/Chromatic 승인을 다음 Task로 옮기지 않는다. 이번에는 선정·인계 외 DEV-32 전용 조사/정책/설계·제품/Repository·실제 업무/QA·별도 Git 전달을 시작하지 않았다.
- Git 전달은 아직 목적별 commit 전이며 실제 최종 PR/head CI·리뷰/정상 merge/main FF·SHA/clean은 실제 PR·종료 보고에서 확인한다. 요청으로 이미 승인된 같은 Git 전달을 반복 승인받지 않는다.

<a id="dev-31-git-delivery"></a>

### 2026-11-18 · PR/Git 전달 체크포인트

- [PR #89](https://github.com/mate-pjt/mate-frontend/pull/89)를 실제 생성했다. base main `1be8f7812f7add7f1dc6f744498b694e88aef5d1`, 최초 head `45ee7e546ae36856afc23af99613826a8df83fb7`, 라벨 type: feature/test/docs·33파일이다. 사용자 최초 Git 승인으로 수행하며 같은 승인을 반복 요청하지 않는다.
- 작은 목적별6커밋: f023b2f 데이터 계약/HTTP·mock, cb05b9f 검토/승인·거절 UI,44d4c99 테스트,1e83b35 개발 지침,ffbf118 QA/Task·다음 인계,45ee7e5 예방 규칙. runtime/test/docs를 분리했고 새 library·package/lockfile·빌드/하네스 설정 변경0이다. push 뒤 local/remote branch 동일·clean을 확인했다.
- 이 시점 원격 main은 시작 SHA와 같고 main protected=false/필수 check 목록0·merge commit 허용을 조회했다. 최초 head의 Data access checks(push/PR)는 진행 중, Chromatic workflow/Storybook Publish·Vercel은 success, UI Tests/Review는 pending이다. **최종 head의 CI·리뷰/한도 원인·병합 조건 확인 전 병합 완료를 주장하지 않는다.**
- 이 Git 기록은 제품/정책/실제5QA 차단·DEV-32 선정/인계 범위/18source해시를 바꾸지 않는다. 문서 freshness 뒤 이 기록을 별도 docs commit/push하고 실제 최종 head의 CI·원격 리뷰·정상 merge commit·local main FF/동일 SHA·clean을 확인한다. 이번 월간 Chromatic 한도만 예외이고 check 강제 성공/보호 우회/force push/직접 main push는 하지 않는다.

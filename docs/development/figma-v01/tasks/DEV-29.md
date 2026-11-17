# DEV-29 · 팀원 초대 발송

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: T02
- 선행 작업: [DEV-27](DEV-27.md)
- 목적/범위: 발송자 초대 입력/검증/전송과 결과 목록을 연결한다. 수신 흐름은 기존 구현을 사용한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### T02 · 관리자 초대 발송·재발송·취소
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **발송 관리 계약 없음**. 검증: 코드 대조.
- 남은 점: 초대를 받는 기능과 별도로 발송자의 관리 화면/API 연결
- Figma: [3137:52847](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52847) / [3137:52911](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52911) / [3137:52990](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52990)
- 소유 소스/기존 기록: [src/components/my/my-side-menu.tsx:12](../../../../src/components/my/my-side-menu.tsx)、[src/data/company/contracts.ts:202](../../../../src/data/company/contracts.ts)

## 완료 기준

- [ ] 주소 입력·중복/기존 팀원·권한·전송 실패를 확인한다
- [ ] 발송 상태·수신자 실제 초대 연결·비밀 링크 비노출을 검증한다
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


<a id="dev-29-pol-14-handoff"></a>

## 2026-11-16 · POL-14 확정 정책/계약 인계

- 인계 근거: [POL-14 D1/D3·v1](POL-14.md#pol-14-contract). 원본 T02의 보내는 초대 입력/발송·목록/상세 계약이며 받는 초대 구현/QA와 별개다. 서버에 실제 계약이 있고 현재 프론트 발송 포트는 미연결이다.
- 확정 완료 기준: email/표시 이름·대표자·positionId XOR 새 일반 직급명·preset/extra leaves·message를 현재 제약으로 검증한다. 기본 VIEWER 초과 부여는 PERMISSION_MANAGE+actor 부분집합, 새 직급 제안은 PROFILE_EDIT, 대표자 초대는 ADMIN/대표자 공석·일반 직급/preset/추가 권한 없음이다. 이미 등록된 이름은 서버가 정하고 초대 PATCH로 이메일을 바꾸지 않는다.
- 상태/화면 기준: 같은 회사/이메일 pending 중복·활성 소속·같은 회사 대기 신청·모호한 확인 이메일을 성공으로 바꾸지 않는다. 보내는 목록/상세 page/count·서버 정렬/상태와 team ACTIVE 목록을 구별한다. 생성 성공·초대 PENDING·delivery PENDING/SENDING/SENT/FAILED/SUPERSEDED·실제 메일함 도착/수신 수락은 별개로 안내/검증한다. 실제 expiresAt를 쓰고7일/5일 예시를 화면 고정 남은 날수로 합성하지 않는다.
- D3 연결: 만료 초대의 ‘새 초대 작성’은 이 생성 흐름으로 명시 입력/제출하며 재발송·새 생성 자동 호출은 없다. token/링크/cookie/메일 원문은 모델·저장소/로그·QA·PR에 남기지 않는다.
- 검증 연결: [TEAM-11~13/16~17/23/26](../../../qa/team-members.md#pol-14-team-qa), Figma3137:52847/52911/52990. 수신처/메일함·계정·소비/복구 범위를 확보하기 전 실제 발송을 하지 않는다. 수락 완료 목적지 결정은 POL-15/DEV-33을 유지한다.

- 이 append는 POL-14의 정책/계약·완료 기준 인계다. 이 Task의 실행/Implementation Brief·설계/제품·실제 QA·Git 전달을 시작한 것이 아니다. 현재/다음/상태는 WBS만 소유한다. 원본2026-10-27 관찰·미작성 Brief·기존 체크리스트/QA는 보존한다.
- 공통 재개 Gate: 최신 Git/main·이 선행 결정/현재 source·게시 Swagger/실행 대응을 확인하고, 자체 성공 기준·수정 파일/영향·검증을 제시한다. `data-access.md`의 같은 company 공급원·public 포트/HTTP/DTO 경계·immutable snapshot/운영 guard·계정 격리를 지킨다. 새 library/endpoint/필드·fallback을 임의 만들지 않는다.
- 실제 업무 GET/변경·메일/초대/직급 실행은 승인된 합성 회사/계정·현재 leaf/상태/버전·환경/Origin/실행 SHA 대응·사용/소비/잔존/복구 범위와 자원 담당 역할이 필요하다. 이번 정책/Git/Chromatic 예외는 해당 자원 확보·실제 QA 면제/로컬 선행 승인이 아니다. 이전 QA-08 AUTH-16 0통과1차단·초대 AUTH-17 미실행과 다른 가입/회사·DEV-08/MAT-162 등 차단을 보존한다.

<a id="dev-29-dev-28-selection"></a>

## 2026-11-17 · DEV-28 뒤 다음 Task 선정/인계만

- [DEV-28 로컬 종료](DEV-28.md#dev-28-close)와 WBS의 우선순위/선행을 확인했다. P0/P1 및 앞선 P2의 기존 외부/계약·선행 차단을 보존하면 기본 표 순서의 첫 독립 개발 후보이며 선행 DEV-27이 완료돼 선정했다. DEV-30의 본 Task 선행과 DEV-31/32·POL-15의 기존 순서/범위는 유지한다. 현재/다음/상태는 WBS만 소유한다.
- 선행 산출물: DEV-27 public Team 조회/role·catalog·계정/회사/탐색 수명과 DEV-28 공개 management 포트/현재 leaf·엄격 version/UUID·명시 확인/후속 조회 패턴이다. 초대 발송 포트/화면·실제 메일·수신 수락/목적지는 이번 DEV-28에서 구현/검증한 것이 아니다.
- 다음 첫 행동: 최신 main·POL-14 D1/D3와 DEV-27/28의 계약/소유 경계, 그때의 backend GitHub/개발 Swagger·Figma3137:52847/52911/52990·TEAM-11~13/16~17/23/26을 확인한다. email/표시 이름·대표자/직급 XOR·preset/extra/message와 actor 상한/행동 leaf, 생성/초대 상태/delivery/실제 메일·수신 흐름을 구분해 자체 Brief·수정 파일/영향/검증 Gate를 제시한다.
- 실제 발송/메일함·비밀 링크가 있는 흐름은 합성 수신 회사/계정·현재 권한/버전, 환경/실행 SHA 대응·열람/사용/소비/잔존/복구 범위와 담당 역할부터 확인한다. token/링크/메일 원문·개인정보/환경 실제 값을 읽거나 기록하지 않는다. DEV-28의 로컬 선행/실제 QA 차단 보존·Git/Chromatic 예외를 이 Task에 자동 확대하지 않는다.
- 여기서는 선정/인계만 했다. 전용 계약 재조사·요구사항 확정/설계·제품/Repository·실제 업무 API/초대/메일/QA·이 Task의 Git 전달을 시작하지 않았다. 원본 candidate/Brief 미작성과 과거 결정/QA·차단은 보존한다.

<a id="dev-29-brief"></a>

## 2026-11-17 · 실행 Brief와 승인

- 유형/요구사항: T02 중 **초대 생성·보낸 목록/상세** 하나의 개발 단위다. POL-14 D1/D3를 따르며 재발송·취소·초대 수정(DEV-30), 수락 목적지(POL-15/DEV-33), 신청/직급 CRUD는 실행하지 않는다.
- 이번 승인: 사용자 최초 요청으로 개발·검증·read-only verifier/ai-review·목적별 commit/push·PR·최종 head CI·정상 main 병합·로컬 main FF를 승인했다. 이번 Chromatic 월간 한도 문제만 예외이며 보호 규칙 우회/직접 main push/강제 성공은 없다. 실제 업무/메일/운영·배포는 포함하지 않는다.
- D1/결정자: 2026-11-17 사용자 원문 **‘로컬 선행·실제 QA 차단 보존 (추천)’**. 실제 HTTP 연결까지 구현하되 mock·fetch 대역·실제 로컬 Next/브라우저로 검증한다. 합성 회사/계정·메일 수신처/메일함·사용/소비/잔존/복구·환경/실행 SHA 대응이 없는 실제 발송/수신/수락은 차단으로 보존한다. 선행 Task의 예외를 가져온 것이 아니다.
- Git 시작: main/`473c9e1edc57cee22f0889ddcfd2154268901756`, fetch 뒤 origin/main 동일, 미커밋/미추적0. DEV-28 PR#86 merged·merge SHA 동일, 선행 DEV-27/28 source 포함. 같은 DEV-29 branch 없음 확인 뒤 FF(변경 없음)와 `feat/dev-29-team-invitations` 생성. reset/stash/삭제0.
- 성공 기준: 이름/email/대표자·직급 XOR·preset/추가leaf/message의 현재 제약, 현재 actor leaf·부분집합·대표자 공석·회사 경계, 중복/활성 소속/대기 신청/모호한 이메일의 서버 거부를 보존한다. 정확한 page/count/createdAt DESC·ID DESC와 상세 ID·실제 시각/초대 status/delivery를 검증한다. 생성 성공·전송 어댑터 성공·실제 메일 도착/수락은 다르며 token/링크/cookie/메일 원문을 공개 모델·저장소/증거에 남기지 않는다.
- 기존 패턴: company의 contracts/client/factory·HTTP/mock 경계, team 조회/management·현재 catalog/leaf·계정 epoch/Abort/화면 수명, 기존 `/my/team`과 native dialog·Button/TextInput/Select/Checkbox·Tailwind 토큰을 확인했다. 새 library/공급원/자동 fallback/추측 endpoint는 없다.
- 설계/수정 대상: `src/data/company/team-invitation-{contracts,input,api,mock}.ts`와 기존 company contracts/client/factory, `src/features/company/team-invitations.ts`, `src/components/my/team-invitations-panel.tsx`·`team-invitation-dialog.tsx`와 기존 my-team-client. 계약/수명 tests, Task/WBS·QA·리뷰·architecture/data-access/plan을 필요한 만큼 갱신한다. 기존 ACTIVE 표와 요청/직급 메뉴의 소유는 보존한다.
- UI 가정: 기존 `/my/team`에 보낸 초대 영역과 목록 페이지·명시 상세 보기/640px 생성 popup을 조합한다. Figma3137:52847/52911/52990·popup3018:107736의 입력 순서·역할/권한·상태 표현이 기준이다. 새 route/메일 링크 공개는 없다. 확정 정책에 필요한 입력/오류 안내를 보완하되 전체 화면의 시각 예외 승인이나 pixel 전수 PASS로 주장하지 않는다.
- 실행 순서: 계약/입력→mock/HTTP→수명 controller/UI→자동·실제 브라우저→문서 검증/갱신→독립 verifier/ai-review→목적별 Git 전달→다음 하나 인계만.
- 검증: Node22.20.0·pnpm11.3.0, 현재 scripts의 `pnpm test`, `pnpm lint`, API/mock/hybrid `pnpm build`, `pnpm build-storybook`, `git diff --check`. 실제 Next/브라우저에서 생성/중복/권한/상세·취소/Escape/키보드·mobile/새로고침·계정/회사 수명·응답 유실/전송 상태를 검증한다. 실제 업무 API 통합은 D1대로 별도 차단이다.
- 위험: 늦은 응답/계정·회사 변경, 성공 후 GET 실패를 재발송으로 오인, DB PENDING와 화면 EXPIRED·delivery/메일 도착 혼동을 중점 검증한다. 자동 수정0/3, blocking ambiguity 없음.

### 현재 근거와 조사 한계

- backend dev `adc0e265ef0e2aa78ccb376e1fa322edd664b290`, 중앙 mate-docs main `c9e50ff591ae18023164e1a94581c611bf1e4f29`는 재조회 시 POL-14와 동일하다. [배포 run43389204151](https://github.com/mate-pjt/mate-backend/actions/runs/43389204151)은 같은 source SHA/success다. 실행 중 프로세스 SHA/실제 업무 응답은 미확인이다.
- 고정 source: [초대 request](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companymembership/membershipinvitation/request/CompanyMembershipInvitationRequests.kt), [response](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companymembership/membershipinvitation/response/CompanyMembershipInvitationResponses.kt), [management/query](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/membershipinvitation/CompanyMembershipInvitationManagementServices.kt), [persistence](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companymembership/membershipinvitation/CompanyMembershipInvitationPersistenceAdapter.kt), [draft](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/domain/companymembership/entity/CompanyMembershipInvitationDraft.kt)·Email VO를 대조했다.
- [게시 OpenAPI](https://api-test.mate-bid.com/v3/api-docs): 일반 urllib GET403, Aside browser/fetch GET 성공·3.1.0/v1 확인. 파싱 후 compact UTF-8 JSON SHA256 `2cd7464ef20be99a46987c4c0115c6be90baadcaf53fef164f0b0d18ed03417e`이며 raw 원문 지문과 혼동하지 않는다. POST/list/detail 계약 일치, source는 DB PENDING만 DESC로 조회하고 만료 표시를 응답에서 계산한다. wrapper `success`/기존 `isSuccess` wire 차이는 실제 QA에서 재확인한다.
- Figma design context/screenshot의 지정3frame과 popup을 확인했다. 재발송/취소 버튼 구현은 DEV-30이며 전체 child/prototype·pixel 검증을 주장하지 않는다. 기존 static assets/primitives의 정확한 대응을 우선 사용한다.
- 조사 출력 한계: 첫 GitHub 응답 구조 확인에서 불필요한 공개 작성자 metadata 일부가 출력됐다. 사용자에게 알렸고 원문은 이 문서/QA/PR에 복사하지 않았다. 이후 구조화 응답을 파싱해 SHA/계약/필요 상태만 투영한다. 환경파일/credential·실제 업무 응답을 읽은 사건과 구분한다. Aside의 첫 schema 파일 저장은 session root 밖 경로 거절로 실패했으며, schema를 재조회해 비밀값 없는 명세만 로컬 임시 파일로 확보했다. 제품 수정 횟수와 별개 도구 재시도다.

### 착수 체크포인트

- 2026-11-17 / Codex / `feat/dev-29-team-invitations`/시작 HEAD 위와 같음·원래 clean. Brief/설계를 사용자에게 먼저 제시했고 D1을 확보했다. 다음 행동은 확정 계약/입력·mock/HTTP 포트 구현이다. 실제 업무 변경0·추가 발송0, 다음 Task 실행0.
- 구현 체크포인트: 계약/입력·HTTP/mock·현재 문맥/명시 제출 scope와 `/my/team` 목록/640px native popup·상세 조회를 연결했다. mock 전송 실패 재현을 위해 `src/data/config.ts`에 `team-invitation-mail-failed` 하나를 추가했고 guide/data-access에도 연결할 예정이다. source group/운영 guard·전역 schema/namespace는 바꾸지 않는다.
- 초기 검증: `pnpm test` 32 files/934 tests PASS. API build/TypeScript PASS. lint 최초 테스트의 `prefer-const` 1건 FAIL→그 선언만 const로 수정→lint PASS(자동 수정1/3). 이후 mock 반환 allowlist·입력 안내/타이틀·추가 hybrid 회귀를 보완했으므로 최종 전체 test/lint/build와 Review Gate는 해당 최종 diff에서 재검증한다. mock build/Storybook PASS, Storybook의 기존 chunk size 경고는 실패와 구분한다. 실제 업무/API·메일 실행0이다.

<a id="dev-29-verification"></a>

## 2026-11-17 · 로컬 검증/수정과 Documentation Update Check

- 구현: 공개 company 초대 create/list/detail, strict 입력/DTO·DB PENDING count/DESC·실제 expiresAt/status/delivery, 계정별 mock·공유 Team command 직렬화, 전후 현재 문맥/직급·grant·명시 제출 scope, 기존 `/my/team`의 보낸 목록/상세·native 입력 popup이다. 재발송/취소/PATCH·수락 목적지·신청/직급 CRUD는 구현하지 않았다.
- 수정 이력: 1/3 lint prefer-const, 2/3 실제 입력 후 clear 버튼의 접근성 이름(label)과 같은 UI QA의 Figma 규격/안내 보완, 3/3 초기 verifier Major1/Minor2의 대표자 경쟁·source 오류 enum·빈 목록 공석 추정 수정이다. `team-mock-command.ts` 공유 helper와 관리 mock의 최소 변경은 DEV-29 명령이 읽는 동일 상태의 경쟁 방어이며 DEV-28의 별도 기능 확장이 아니다. 초기935 tests PASS와 독립 FAIL·도구/유실 관찰을 [검토](../reviews/DEV-29.md)에 보존했다.
- 최종 자동 결과: Node22.20.0/pnpm11.3.0 `pnpm test`32 files/939 tests PASS, `pnpm lint`0오류/0경고 PASS. 최종 API/mock/hybrid build·Storybook·문서 링크/79원본·114Task/156의존/단일 active·baseline 보존/diff-check PASS. 독립 type-check/format script를 만들거나 실행했다고 쓰지 않는다.
- 실제 로컬 브라우저: [L29-01~19/HTTP 계측·화면](../../../qa/team-members.md#dev-29-local-qa). 최종 desktop640×908/Select48·mobile358/overflow0, 일반/대표자/새 직급·grant·중복/상세/ESC/계정 격리, 실제 Next+loopback HTTP의 손상2xx·403·성공 후503/401을 구분했다. TCP 유실은 앱 fetch1회/wire2회(lost→409)이며 wire 중복0으로 표시하지 않는다.
- 실제 API: TEAM-11~13/16~17/23/26의 이번 소유 부분 **0통과·7차단**. 실제 실행 SHA·승인 합성 계정/회사/메일함·소비/권한·소속 변경/잔존/복구·담당 역할 미확보다. 기존 수신 합성 fixture 회귀는 발송된 실제 초대 수락 연결의 증거가 아니다. 이번 D1은 DEV-29만의 로컬 선행이며 다음 Task에 확대하지 않는다.
- Documentation Update Check: architecture/data-access(새 초대 포트/수명·shared mock queue), repositories(새 시나리오/공개 합성 별칭), plan(날짜별 범위 연결), ai-failures(실제 경쟁/a11y·출력 경계 재발), Task/WBS·QA/index·리뷰/증거를 갱신한다. base는 package/scripts/버전 변화0, harness는 역할/하네스 변화0으로 갱신하지 않는다. coverage/baseline·원본79/114Task/156의존·기존 QA/정책 결정은 보존한다.
- 복구/미완료: 이번 소유 Next/HTTP 대역 프로세스와 브라우저 탭을 종료했다. 실제 업무/API/메일/중앙/backend 변경0, 운영/배포0. Git 전달과 최종 Review Gate/다음 선정은 아래에서 별도 확인한다. 자동 수정3/3이며 추가 실패 시 임의 네 번째 수정은 하지 않는다.

<a id="dev-29-close"></a>

## 2026-11-17 · 로컬 승인 단위 종료와 다음 선정

- 이번 D1의 로컬 단위 **PASS**. 입력/중복·기존 소속/신청/신원·권한·실패·보낸 목록/상세·메일 상태/비밀 필드 최소화의 계약/브라우저, 최종939 tests/lint·세 구성 build·Storybook·문서/두 리뷰를 통과했다. 실제 발송/메일함 도착·발송 초대 수신/수락 연결과 실제7부분은 차단이다. 원래 후보 체크리스트/과거 미실행을 소급 PASS로 바꾸지 않고 이 실행 단위의 증거로 닫는다.
- [최종 verifier/ai-review](../reviews/DEV-29.md) 모두 미해결 Blocker/Major/Minor0. verifier는939 tests·코드 지문을 독립 재검증했고 이후 제품 변경0이다. 초기 FAIL/수정3/3과 공개 출력·도구/전송 계층 한계는 보존했다.
- [x] 이번 입력·조회·권한/오류·수명/경쟁 로컬 검증 완료.
- [x] 현재 package scripts/실제 Next·mock/HTTP 대역 검증 완료.
- [x] 실제 통합 미실행/0통과7차단과 승인 범위 기록.
- [x] Documentation Update Check·문서 검사·두 리뷰 완료. Git 전달은 아래 별도 사실로 기록한다.
- 다음 하나: **DEV-30 · 초대 재발송·취소 관리**. WBS P0/P1·앞선 P2의 기존 외부/계약·선행 차단을 유지한 기본 표 순서에서 DEV-29 선행을 충족한 첫 후속 후보다. DEV-31/32·POL-15의 순서/범위와 원본79/114Task/156의존은 바꾸지 않는다.
- 다음 첫 행동: 최신 main/이 공개 초대 포트·목록/상세/수명/공유 mock queue와 POL-14 D3·DEV-30 원래 정의를 확인한다. 그때 backend/게시 Swagger·실행 대응과 최신 version/delivery·미만료 PENDING/만료·수락/취소 경쟁, 합성 수신처·사용/소비/잔존/복구 범위를 자체 Brief/Gate에서 확인한다. 생성은 DEV-29 흐름을 재사용하되 새 생성/재발송/취소는 자동 호출하지 않는다.
- 여기서는 선정·인계만 했다. DEV-30 전용 계약 재조사·Brief/설계·제품/실제 QA·Git 전달은 미시작이며 DEV-29 D1/Git/Chromatic 예외를 확대하지 않는다. 현재/다음/상태는 WBS만 소유한다.

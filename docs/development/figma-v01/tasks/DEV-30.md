# DEV-30 · 초대 재발송·취소 관리

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: T02
- 선행 작업: [DEV-29](DEV-29.md)
- 목적/범위: 기존 초대의 상태별 재발송/취소를 연결한다.
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

- [ ] 만료/수락/취소·동시 수락·중복 클릭·재발송 제한을 확인한다
- [ ] 취소된 링크 수락 거부·목록 갱신·권한/실패를 검증한다
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


<a id="dev-30-pol-14-handoff"></a>

## 2026-11-16 · POL-14 확정 정책/계약 인계

- 인계 근거: [POL-14 D1/D3·v1](POL-14.md#pol-14-contract). 원본 T02의 기존 초대 재발송/취소·현재 상태·version·메일 결과를 관리하며 새 초대 생성은 DEV-29 흐름을 사용한다.
- 확정 완료 기준: **미만료 PENDING만** 재발송/취소한다. expiresAt 경과·EXPIRED는 해당 버튼/명령 대신 **새 초대 작성**을 안내한다. DB PENDING 잔존으로 source resend가 가능한 창도 UI에서 이용하지 않는다. 사용자 선택이 backend 상태/만료 규칙을 바꾼 것은 아니다. 완료/거절/취소 상태에 PENDING 명령을 보내지 않는다.
- 재발송은 최신 expectedVersion과 현재 leaf/부여 재검사를 따르고 새 token/deliveryVersion/now+7일·기존 대기 delivery SUPERSEDED를 확인한다. 이전 링크/일회성 handoff·수락/만료/취소 경쟁, 표시 직전/요청 중 만료·단말 시계와 최종 서버 거부를 검증한다. 만료를 자동 연장하거나 완료된 기존 초대를 부활시키지 않는다.
- 오류/확인 기준: CI003 상태·CI004 version·권한/404·응답 유실·메일 실패와 DB 명령 성공을 구분해 최신 상태/메일 결과를 명시 재조회한다. 자동 재발송/취소·새 초대0, 중복 클릭/늦은 결과·계정/회사/화면 종료를 방어한다.
- 검증 연결: [TEAM-14~17/23/26](../../../qa/team-members.md#pol-14-team-qa), Figma3137:52911/52990와 만료/최종 상태. 실제 소모 가능한 초대/수신처/시간·복구 범위의 Gate를 유지한다.

- 이 append는 POL-14의 정책/계약·완료 기준 인계다. 이 Task의 실행/Implementation Brief·설계/제품·실제 QA·Git 전달을 시작한 것이 아니다. 현재/다음/상태는 WBS만 소유한다. 원본2026-10-27 관찰·미작성 Brief·기존 체크리스트/QA는 보존한다.
- 공통 재개 Gate: 최신 Git/main·이 선행 결정/현재 source·게시 Swagger/실행 대응을 확인하고, 자체 성공 기준·수정 파일/영향·검증을 제시한다. `data-access.md`의 같은 company 공급원·public 포트/HTTP/DTO 경계·immutable snapshot/운영 guard·계정 격리를 지킨다. 새 library/endpoint/필드·fallback을 임의 만들지 않는다.
- 실제 업무 GET/변경·메일/초대/직급 실행은 승인된 합성 회사/계정·현재 leaf/상태/버전·환경/Origin/실행 SHA 대응·사용/소비/잔존/복구 범위와 자원 담당 역할이 필요하다. 이번 정책/Git/Chromatic 예외는 해당 자원 확보·실제 QA 면제/로컬 선행 승인이 아니다. 이전 QA-08 AUTH-16 0통과1차단·초대 AUTH-17 미실행과 다른 가입/회사·DEV-08/MAT-162 등 차단을 보존한다.

<a id="dev-30-dev-29-selection"></a>

## 2026-11-17 · DEV-29 뒤 선정/인계만

- [DEV-29 로컬 승인 단위](DEV-29.md#dev-29-close)의 생성/보낸 목록·상세·최신 문맥/명시 제출·계정/화면 수명과 shared mock queue·939 tests/두 리뷰를 선행 산출물로 인계한다. 실제 초대/메일·수신 수락 통합은0통과7부분 차단이며 이 Task의 실행 예외가 아니다. Git/main 반영은 실제 최종 PR/종료 보고와 착수 시 최신 main에서 확인한다.
- 선정 이유: WBS 기본 P2 표 순서에서 DEV-29 선행을 충족한 첫 후속 후보다. 기존 P0/P1·앞선 P2 차단·DEV-31/32·POL-15 순서와 원본79/114Task/156의존을 유지한다. 상태는 WBS만 소유한다.
- 다음 첫 행동: 최신 main·DEV-29 contracts/client/HTTP/mock·`team-invitations.ts`/현재 panel/dialog·POL-14 D3와 이 원래 정의를 읽는다. 당시 backend/Swagger에서 resend/cancel의 현재 version/delivery/status·단말/서버 만료 경합과 실제 자원·사용/소비/잔존/복구를 재확인한 뒤 자체 Brief·수정 파일/영향·검증을 제시한다. 미만료 PENDING만 기존 명령, 만료는 명시 새 초대 작성이라는 확정 정책을 유지한다.
- 선정/인계만 수행했으며 전용 계약 조사·설계·제품/Repository·재발송/취소/PATCH·실제 업무/API/메일/QA·별도 Git 전달0이다. DEV-29의 로컬 선행·Git/Chromatic 승인은 다음 Task로 자동 승계하지 않는다. 원본 candidate/미작성 Brief·기존 결정/QA/차단은 보존한다.

<a id="dev-30-investigation"></a>

## 2026-11-17 · 착수 조사와 이번 승인

- Git: 시작 main/`c0661b3341083a434fdc79fff5e778cce782a09f`, fetch/FF 후 origin/main 동일·clean. DEV-29 PR #87의 main 반영과 생성/보낸 목록·상세·공유 mock 명령 lane을 확인했다. 기존 DEV-30 local/remote branch 없음 확인 후 `feat/dev-30-invitation-management`를 생성했다. 선행/무관 미커밋 변경0, reset/stash/삭제0.
- 이번 사용자 최초 요청은 DEV-30 하나의 개발·검증/두 리뷰·목적별 commit/push·PR·최종 head CI·정상 main 병합/로컬 main FF를 승인한다. **이번 PR의 Chromatic 월간 한도만 예외**이며 강제 성공/보호 우회/직접 main push는 없다. 실제 업무 API·초대/메일·운영/배포·다음 Task 실행 승인이 아니다.
- D1: 2026-11-17 사용자 원문 **‘로컬 선행·실제 QA 차단 보존 (추천)’**. 실제 HTTP 연결을 구현하고 mock·fetch 대역·실제 로컬 Next/브라우저로 검증한다. 실제 재발송/취소·메일 도착/수락은 합성 회사/계정·수신함·사용/소비/잔존/복구 범위·담당 역할·실행 SHA 대응 미확보로 차단을 보존한다. DEV-29/다른 Task 예외의 승계가 아니다.
- 현재 backend dev는 `545ef153e30569a516f1585d60bdf00ce70d7f3a`다. [CI run 44026382503](https://github.com/mate-pjt/mate-backend/actions/runs/44026382503)은 동일 SHA/success이며 CI/배포 기록과 실행 중 process SHA·업무 응답은 구별한다. DEV-29 당시 `adc0e265…`는 과거 근거다.
- 고정 source: [management/query](https://github.com/mate-pjt/mate-backend/blob/545ef153e30569a516f1585d60bdf00ce70d7f3a/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/membershipinvitation/CompanyMembershipInvitationManagementServices.kt), [persistence](https://github.com/mate-pjt/mate-backend/blob/545ef153e30569a516f1585d60bdf00ce70d7f3a/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companymembership/membershipinvitation/CompanyMembershipInvitationPersistenceAdapter.kt), [controller](https://github.com/mate-pjt/mate-backend/blob/545ef153e30569a516f1585d60bdf00ce70d7f3a/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companymembership/membershipinvitation/CompanyMembershipInvitationController.kt), [recipient](https://github.com/mate-pjt/mate-backend/blob/545ef153e30569a516f1585d60bdf00ce70d7f3a/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/membershipinvitation/CompanyMembershipInvitationRecipientServices.kt).
- [게시 OpenAPI](https://api-test.mate-bid.com/v3/api-docs)는 이번 Aside fetch GET200/3.1.0/v1이다. resend POST body는 expectedVersion, cancel DELETE는 expectedVersion query/body 없음이다. source는 version+1·재발송 deliveryVersion+1/새 token/now+7일·이전 PENDING delivery SUPERSEDED, 취소는 CANCELED/완료 시각/token 제거다. 별도 resend cooldown/횟수 필드는 확인되지 않았다. source의 DB PENDING 만료 잔존 resend 창을 UI는 POL-14 D3로 사용하지 않는다. 기존 isSuccess/게시 success wire 차이·실행 SHA/실제 업무 응답은 실제 QA 재개 확인 대상이다.
- recipient source는 status PENDING·expiresAt·deliveryVersion 일치와 handoff 미소비/만료·현재 expectedVersion/Google 확인 이메일을 검사한다. source 열람은 이전/취소 링크의 실제 서버 수락 거부를 실행한 증거가 아니다. 기존 독립 수신 mock fixture를 발송 초대와 연결된 통합 PASS로 취급하지 않는다.
- Figma3137:52911 재발송 popup(640px·24px padding·기존 정보/역할·돌아가기/재발송), 3137:52990 취소 확인(popup·취소/돌아가기)을 design context/screenshot으로 확인했다. 전체 페이지의 기존 시각 차이·pixel 전수 PASS나 포괄 예외 승인은 없다. 예시 인물/연락값·비밀 링크를 작업 증거/PR에 복사하지 않는다.
- D2 질문: 재발송 frame의 편집 폼과 작업 정의(재발송/취소)의 차이를 확인 중이다. 추천은 기존 정보 읽기 전용 확인·그대로 재발송/취소이며 PATCH 편집은 추가하지 않는다. **답변 전 최종 Brief/Gate·제품 편집은 미실행**이다.
- 2026-11-17 18:01 KST / Codex: source/게시 계약·선행 Git 확인, D1 확보. 실제 업무/메일/수락0·제품 수정0. 다음 행동은 D2 확정 뒤 자체 Brief/수정 파일·영향·검증을 제시하고 단일 실행 단위를 시작하는 것이다.

<a id="dev-30-brief"></a>

## 2026-11-17 · 실행 Brief와 설계

- 요구사항: T02의 기존 초대 재발송·취소를 현재 company 포트와 `/my/team`에 연결한다. POL-14 D3의 미만료 PENDING·만료 후 명시 새 작성 기준을 지킨다. 실제 HTTP 구현을 포함한 로컬 선행은 이번 D1 사용자 결정이다.
- D2 처리: 위 질문은 Figma 편집 폼/DEV-29 인계 표현과 이 Task의 원래 재발송·취소 정의 사이 **범위 확장 선호 확인**이다. 충분한 응답 기회 뒤에도 답변이 없는 현재는 원래 정의 안에서 기존 정보 그대로 확인/재발송하는 낮은 위험·되돌릴 수 있는 UI 가정을 채택한다. **사용자 승인/편집 예외 확정이 아니다.** PATCH 편집·그에 대한 화면 승인과 완전한 Figma 편집 흐름 PASS를 주장하지 않는다. 위 ‘답변 전 제품 편집 미실행’은 조사 당시 체크포인트이며, 명시 정의 안의 이 Brief를 Gate로 삼는다. 이후 답변은 현재 Task의 steering으로 반영한다.
- 성공 기준: 미만료 PENDING만 명령, 정확한 초대/회사·현재 소속/leaf·version과 재발송 grant의 제출 직전 재확인, 단일 명시 실행·계정/epoch/Abort/화면 종료·응답 유실/손상/401/403/404/CI003/CI004 경쟁 방어다. 재발송 version/delivery 증가·실제 만료·메일 결과와 취소 CANCELED/완료 시각을 검증하고 성공을 후속 조회 오류와 구분해 목록을 갱신한다. 단말 만료는 로컬 timer/복귀 재계산이며 서버 최종 판단을 대신하지 않는다.
- In scope/수정 대상: `team-invitation-contracts.ts`, company `client.ts`, `team-invitation-api.ts`/`team-invitation-mock.ts`, `features/company/team-invitations.ts`, `TeamInvitationsPanel`·기존 상세와 재발송/취소 native dialog·만료 clock, 필요한 Figma 취소 icon. 계약/수명·경쟁 회귀 tests와 Task/WBS·QA/index·reviews, architecture/data-access/plan의 사실 연결을 갱신한다.
- 확인한 패턴: 기존 생성/조회 public company 포트와 동일 factory·7그룹/immutable snapshot·HTTP DTO 최소화·계정 namespace, shared mock serializer, native dialog와 Button·Tailwind 토큰/기존 CloseIcon을 재사용한다. 상태는 WBS 한 곳에서만 관리한다.
- Out of scope: 초대 PATCH/이메일·이름·직급/권한 편집, 실제 메일/링크·수신함/수락·업무 변경, 신청/직급 CRUD·수락 목적지/다른 Task 실행, source/운영·배포·새 라이브러리·fallback/추측 API/임의 cooldown 추가다. 기존 수신 mock의 독립 fixture와 실제 링크 무효화는 구별한다.
- 단계/영향: 포트/HTTP·동일 계정 mock 명령 → 최신 조회/상태·grant/수명 controller → 목록 행동·재발송 정보 확인/취소 확인·만료/명시 재조회 UI → 자동/실제 Next browser·문서 검증 → Documentation Update Check/두 리뷰 → 목적별 Git 전달·최종 head CI/merge/main FF → 다음 하나 인계만. 실제 업무 데이터 영향0이다.
- 검증: Node22.20.0/pnpm11.3.0의 `pnpm test`, `pnpm lint`, API/mock/hybrid Preview `pnpm build`, `pnpm build-storybook`, `git diff --check`; 로컬 Next 실제 browser의 재발송/취소·만료/중복/terminal·권한/응답 유실/계정·화면/키보드·360px·reload·외부 요청 경계, 문서114Task/156의존/79ID·TEAM26·원본/링크/Markdown을 검사한다. source/HTTP 대역/mock/로컬 서버와 실제 통합0·TEAM-14~17/23/26 차단을 분리한다.
- 초기 Context Audit: package/scripts/lockfile·7그룹/public client·snapshot/guard·관련 src/하네스·WBS/coverage·선택 Task를 읽기 전용 대조했다. 사실 불일치 없음. 기본 shell Node26은 문서의 프로젝트 검증 Node22와 구분하고 명시 경로로22.20.0을 사용한다. 구현 뒤 변경한 포트 설명만 사실 동기화 대상으로 재점검한다.
- 2026-11-17 / Codex / branch·HEAD 위와 동일: 이 Brief/파일·영향/위험·검증을 편집 전에 제시했다. 제품 수정 전 기존 변경은 이번 DEV-30의 Task/WBS 조사 기록뿐이며 무관 변경0. 다음 행동은 확정 범위의 재발송/취소 포트를 구현하는 것이다. 자동 수정0/3.

- 구현/검증 체크포인트: 공개 resend/cancel·HTTP expectedVersion·mock shared lane/선택적 delivery 이력·상태/단말 만료·직전 GET/명시 한 번 scope·행 버튼/확인 창/수명 clock을 연결했다. Figma 취소 아이콘은 원본 80×80 instance SVG export다.
- 자동 수정2/3: 첫 lint는 중첩 렌더 callback에서 ref를 사용하는 detail 함수까지 추적된 react-hooks/refs 오류, 첫 새 mock test는 실제 JSON에 없는 value wrapper를 읽은 fixture 오류였다. 순수 버튼 분리만으로 lint가 남아 진단 lintText 대조 후 handler를 함수 prop으로 전달하고 child의 실제 click에서 호출하도록 고쳤다. JSON 접근도 교정했다. 현재980 tests/lint PASS다.
- 격리 환경 관찰: 기존 node_modules symlink는 pnpm 자동 install의 non-TTY 및 Turbopack filesystem-root 거부로 실행이 중단됐다. 라이브러리/설정 source 변경 없이 task-owned symlink만 해제하고 기존 의존성을 APFS clone했다. copy 완료 전 시작한1회는 실행 준비 미완료 관찰로 보존한다. 이후 pnpm --config.verify-deps-before-run=false로 동일 package scripts를 실행해 API/mock/hybrid build·Storybook PASS. 제품 자동 수정 회차와 구별한다. 환경파일 제외·실제 업무/메일0이다.

### D2 확정과 Brief 갱신 · 2026-11-17

- 사용자 원문 **‘초대 정보 편집·PATCH까지 포함’**을 이번 Task의 확정 범위로 채택한다. 위 읽기 전용/PATCH 제외는 답변 전 가정 이력이며 **이 결정으로 대체**한다. 실제 QA 차단 보존 D1·Git/Chromatic 승인 경계는 유지한다.
- 수정 대상/영향 추가: 동일 공개 초대 포트/client와 HTTP/mock의 `updateTeamInvitation`, 기존 640px 초대 form을 재발송 편집에 재사용한다. 새로운 화면·공급원·라이브러리는 만들지 않는다. 이메일 고정·등록 계정 이름 잠금, 현재 초대 version/미만료 상태, 대표자 변경 ADMIN·직급/대표자 변경 PROFILE_EDIT, 현재 일반 직급 정의와 grant 부분집합을 고정 source update 계약에 맞춘다.
- 사용자 ‘재발송’ 명시 제출에서 변경이 있을 때만 PATCH한다. PATCH는 메일/token/delivery/만료를 갱신하지 않으며 version만 증가한다. 검증된 저장 응답 뒤 최신 소속/권한·초대/version/만료를 다시 확인하고 그 version으로 resend한다. 저장 성공·재발송 성공·메일 상태/실제 수신은 독립이다. 저장 후 후속 조회/재발송 실패·응답 유실은 저장 receipt를 보존하고 자동 PATCH/resend 재시도0, 명시 최신 조회/재선택으로 복구한다.
- 성공/검증 추가: 변경 없음 PATCH0/resend1, 변경 있음 PATCH1→재조회→resend1·정확 version, PATCH 실패/유실 후 resend0, PATCH 성공 후 권한·만료/수락·version 경합과 resend 실패/유실의 부분 성공, 등록 이름/이메일·대표자/직급/grant 제한, 계정/epoch/화면 종료를 단위·HTTP 대역·실제 로컬 browser로 확인한다. 원래 재발송/취소·실제 QA/기존 통합 차단과 다음 Task 실행 제외는 그대로다.
- Figma3137:52911의 편집 가능한 form·돌아가기/재발송을 기능 기준에 포함하며 전체 페이지의 기존 차이나 전수 pixel PASS를 주장하지 않는다. 3137:52990의420px 취소 popup은 원본80px icon을 파일로 export해 사용한다.

<a id="dev-30-verification"></a>

## 2026-11-17 · 검증·Documentation Update Check 체크포인트

- D2 포함 최종 source:997 tests/35files·lint0, 동일 source의 API/mock/hybrid Preview build·Storybook PASS. 격리 executable10파일의 SHA256을 작업트리와 대조해 모두 일치했다. 실제 Next/all mock browser의 편집/재발송 version1→3·delivery1→2, 취소4/CANCELED·목록0, Escape 초점 복귀·360px 양 dialog328px·만료 잠금/새 작성·합성 PATCH 뒤 수락 경합의 부분 성공·다른 계정/로그아웃·reload를 확인했다. [QA/경계](../../../qa/team-members.md#dev-30-local-qa).
- 실제 API: TEAM-14~17/23/26의 이번6소유 부분0통과6차단. 실제 이전/취소 링크 수락 거부는 source 열람·fetch 대역 거부 처리까지만 확인했고 기존 독립 수신 mock을 발송 연결 통합으로 올리지 않았다. D1 승인 범위를 적용하며 실행 SHA/합성 계정·회사/수신함·사용/소비/잔존/복구/담당 역할이 재개 조건이다.
- 문서 검사: `/tmp/mate-dev30/verify_docs.py`로114Task/156의존/79ID·원본 baseline/coverage/Task prefix·TEAM26·새 링크/Markdown을 검사하고 `git diff --check`를 실행한다. 임시 로그/합성 artifact는 `/tmp/mate-dev30/`이며 제품 비밀/실제 업무 자료를 저장하지 않는다.
- Documentation Update Check: architecture/data-access(새 관리 포트·PATCH/resend 수명/부분 성공·mock history), plan(날짜별 연결), repositories/asset 안내, Task/WBS·QA/index·review를 갱신했다. base는 scripts/버전/package 변화0, harness는 역할/하네스/config 변화0으로 갱신하지 않는다. ai-failures는 이번 ref lint/이미지 출력 도구 경계의 재발 예방만 검토한다. baseline/coverage·선행 정책/원본 TEAM/다른 QA/차단·승인 예외는 보존한다.
- 2026-11-17 / Codex / `feat/dev-30-invitation-management`·시작 HEAD 동일·이번 Task 변경만. 제품 자동 수정2/3, D2 후 추가 source 검사 실패0. 구현/로컬 검증은 확보했으며 최종 Review Gate/문서 freshness·Git 전달은 아직 미완료다. 다음 행동은 현재 diff의 ai-review/read-only verifier이며 다음 Task 제품 실행0이다.

- QA 복구: 소유 Aside tab 종료·task-local 합성 공간 정리, cwd 확인한 Next listener1개 정상 종료·49191포트 반환을 확인했다. PR용 합성 popup PNG2개는 reviews/assets에 보존했고 실제 업무/메일0이다. 독립 verifier가 현재 diff를 읽는 중이며 후속 문서/이미지 추가는 freshness 재검토 대상이다.

- 초기 독립 검토 FAIL: Major2(인증/401 지연 뒤 만료 dispatch·편집 가능한 권한 축소 진입 차단)/Minor1(PR crop 오류)를 실제 source/합성 호출과 이미지로 재현했다. primary 초기 PASS를 최종 판정으로 사용하지 않는다. `shared/http.ts`의 선택적 내부 scope callback·요청 직전 signal 검사와 기존 row/입력 경계를 마지막 자동 수정3/3으로 보완한다. 새 wire/정책/library를 만들거나 이미 발송한 서버 rollback을 보장하지 않는다. 올바른 전체 합성 screenshot으로 PR 이미지를 교체하고 전체 검증/두 리뷰를 재실행한다.

- 수정 후 검증:1001/1001 tests·35files, lint0, API/mock/hybrid Preview build·Storybook PASS. 격리 변경 실행 source11개 SHA256 일치다. 인증 대기 중 만료 fetch0·첫401 뒤 만료 추가 fetch0·공통 scope/Abort와 합법적 ADMIN→VIEWER 편집 pipeline 회귀를 추가했다. 실제 mock browser에서도 VIEWER+INVITE+MANAGE actor의 기존 ADMIN 초대 편집 진입→VIEWER 변경→version3/PENDING/delivery2 재발송을 확인했다. 실제 권한 변경/API·메일0이다.
- 재검토/문서: architecture/data-access의 내부 요청 직전 guard·편집 진입/새 grant 경계, QA/Task/WBS·review·ai-failures를 동기화했다. [수정 후 ai-review](../reviews/DEV-30.md)는 로컬 단위 PASS이며 read-only verifier가 동일 source/이미지와 최종 문서 freshness를 재검토한다. 초기 FAIL/자동 수정3/3 이력과 실제6차단을 보존한다.
- 추가 로컬 복구: Task 합성 namespace6개만 정리하고 소유 tab 종료, cwd 확인 후 Next listener1개 정상 종료·49191포트 반환. 추가 QA는 DOM/JSON으로 판정했으며 fullPage 스티칭 중복 캡처를 PR 시각 근거로 쓰지 않는다. 다음 행동은 독립 최종 판정·선정 인계와 Git 전달이다. 다음 Task 조사/제품 실행0.

<a id="dev-30-close"></a>

## 2026-11-17 · 승인 로컬 범위 판정과 선정 인계

| 완료 기준/확정 범위 | 판정·근거 | 남은 경계 |
| --- | --- | --- |
| D2 편집/PATCH와 기존 초대 재발송·취소 | 로컬 구현/검증 PASS. 변경 있음 PATCH→최신 조회→새 version resend, 무변경 PATCH0, 취소 query/목록 갱신. 등록 이름/이메일 잠금·대표자/직급·현재 leaf/grant·중복·상태/version/부분 성공·요청 직전 수명 확인 | 실제 명령·메일·이전/취소 링크 수락 거부/동시 수락은 통합 PASS 아님 |
| 만료/terminal·경합/권한/실패/수명 | mock·HTTP 대역/회귀·실제 Next/mock browser PASS. 초기 독립 FAIL2Major/1Minor와 수정3/3을 보존 | 단말/서버 시계 차이·전송 뒤 서버 처리 rollback 보장 없음 |
| package scripts/문서 검사 |1001 tests/35files·lint0·동일 source API/mock/hybrid build·Storybook·11파일 해시·문서114/156/79/TEAM26/링크·Markdown/diff PASS | 실제6소유 부분은 D1으로0통과6차단 유지 |
| Documentation Update Check/두 리뷰 | 수정 후 ai-review와 read-only verifier PASS. 독립 test1001/lint0·diff/문서 재검사, 빌드/브라우저는 동일 source의 증거 검토 | 다음 문서/Git 사실은 freshness 재검토, Git 전달 완료와 분리 |

- 현재/다음/상태는 WBS만 소유한다. 이 표는 이번 D1/D2의 로컬 판정 근거이며 원래 체크리스트·과거 관찰/정책·QA 이력을 변경하지 않는다. 최종 Git 전달은 목적별 commit/PR·최종 head CI·정상 merge·로컬 main FF 뒤 별도 확인한다.
- 다음 하나는 [DEV-31](DEV-31.md#dev-31-dev-30-selection). WBS 우선순위/기본 표 순서·선행 DEV-27 충족을 확인했다. 최신 main·원래 신청 정의/POL-14 D1/현행 source와 실제 자원 Gate를 확인해 자체 Brief를 제시하는 첫 행동만 인계했다. 전용 조사·설계·제품/API/QA·별도 Git 전달0이며 이번 승인/예외를 승계하지 않는다.

- 선정 인계 뒤 두 리뷰 freshness: read-only verifier/primary ai-review PASS. WBS 실집계38/23/50/1/2=114, DEV-30/31 원본·114/156/79/TEAM26/21links·Markdown/diff PASS, 검증 source/test/SVG15파일 동일. 제품 검증은 변경0으로 재실행하지 않았다. 회신 전사 외 정책/범위/검증 변경0이다. 다음 행동은 이번 Task의 작은 커밋·push/PR와 실제 최종 head CI/리뷰·정상 병합/main FF다.

- 커밋 직전 검사: 새 SVG export의 EOF 빈 줄1개가 staged diff-check에서 확인됐다. 개행2→1의 기계적 정리만 수행하고 XML 도형/속성 serialization 동일·staged diff-check PASS를 확인했다. 동일 격리 자산에도 반영했다. 제품 로직 추가 수정/새 승인 정책은 없고, 이 공백 변경 뒤 앱 test/build는 의미 변화0 근거로 반복하지 않는다. 원래1001/세 build 결과와 이 동등성 검사를 함께 사용하며 원격 최종 head CI는 별도로 실행된다.

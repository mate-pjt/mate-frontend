# DEV-33 · 초대 수락 완료의 팀원 화면 연결

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: O11
- 선행 작업: [POL-15](POL-15.md) / [DEV-27](DEV-27.md)
- 목적/범위: 확정된 완료 CTA 목적지와 권한별 폴백을 연결한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### O11 · 초대 수락 후 팀원 화면 이동
- 기준선: UI **완료 화면 있음**, 동작 **/bids로 대체**, 데이터 **팀원 관리 미구현**. 검증: 코드 대조.
- 남은 점: Figma의 ‘팀원 화면으로 이동하기’ 흐름은 팀원 관리 개발 후 연결
- Figma: [3141:56172](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3141-56172)
- 소유 소스/기존 기록: [src/app/auth/company/invitations/invitation-client.tsx:78](../../../../src/app/auth/company/invitations/invitation-client.tsx)

- 이어갈 QA 기록: [auth.md](../../../qa/auth.md). 기존 case ID와 통과/대기/차단 기록을 보존한다.

## 완료 기준

- [ ] 수락/다른 계정·만료·역할별 목적지·뒤로가기/reload를 확인한다
- [ ] 기존 초대 거절·로그인 복귀와 키보드 동작을 검증한다
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


<a id="dev-33-pol-14-handoff"></a>

## 2026-11-16 · POL-14 확정 정책/계약 인계

- 인계 근거: [POL-14 D1~D3·v1](POL-14.md#pol-14-contract). 현재 source의 최소 조회 leaf와 소속/회사 경계를 입력으로 넘기지만, **수락 완료 CTA 목적지/권한별 폴백은 POL-15에서 별도로 결정**한다. 기존 POL-15/DEV-27 선행을 바꾸지 않는다.
- 후속 완료 기준: POL-15 확정 뒤 실제 DEV-27 화면/현재 소속·권한을 조회해 완료 CTA를 연결한다. 인증의 오래된 role/초대의 제안값만으로 경로를 허용하거나 임의 팀원 route를 지금 정하지 않는다. 수락 성공 뒤 세션/회사 조회 실패·만료·계정 교체·새로고침/뒤로가기·다른 계정/회사·안전한 내부 복귀를 구분한다.
- [TEAM-24/23](../../../qa/team-members.md#pol-14-team-qa)는 기존 AUTH-16/17의 실제0/차단·미실행을 대체하지 않는다. 실제 초대/메일 소비·소속 변경 승인/복구·실행 대응이 필요하며 source/게시 명세 존재를 통합 PASS로 올리지 않는다. POL-15 목적지 조사·정책 선택이나 이 Task 구현은 이번에 시작하지 않는다.

- 이 append는 POL-14의 정책/계약·완료 기준 인계다. 이 Task의 실행/Implementation Brief·설계/제품·실제 QA·Git 전달을 시작한 것이 아니다. 현재/다음/상태는 WBS만 소유한다. 원본2026-10-27 관찰·미작성 Brief·기존 체크리스트/QA는 보존한다.
- 공통 재개 Gate: 최신 Git/main·이 선행 결정/현재 source·게시 Swagger/실행 대응을 확인하고, 자체 성공 기준·수정 파일/영향·검증을 제시한다. `data-access.md`의 같은 company 공급원·public 포트/HTTP/DTO 경계·immutable snapshot/운영 guard·계정 격리를 지킨다. 새 library/endpoint/필드·fallback을 임의 만들지 않는다.
- 실제 업무 GET/변경·메일/초대/직급 실행은 승인된 합성 회사/계정·현재 leaf/상태/버전·환경/Origin/실행 SHA 대응·사용/소비/잔존/복구 범위와 자원 담당 역할이 필요하다. 이번 정책/Git/Chromatic 예외는 해당 자원 확보·실제 QA 면제/로컬 선행 승인이 아니다. 이전 QA-08 AUTH-16 0통과1차단·초대 AUTH-17 미실행과 다른 가입/회사·DEV-08/MAT-162 등 차단을 보존한다.

<a id="dev-33-pol-15-handoff"></a>

## 2026-11-18 · POL-15 목적지 정책 인계

- O11의 수락 완료는 최신 계정과 수락한 회사·활성 소속, `COMPANY_MEMBER_LIST_VIEW`가 확인되면 `/my/team`으로 이동한다. 팀원 조회 권한 부족이나 경로 미제공 시 같은 회사 `COMPANY_INFORMATION_VIEW`가 확인되면 `/my/company`를 제공한다. 접근 가능성을 확인할 수 없는 경우 확인된 성공 안내와 읽기 재시도·공개 `/bids`를 제공한다. 직접 진입에 기존 가드를 적용하고 정책 적용 후 단계별 UI와 네트워크 동작을 검증한다. [사용자 결정과 상태별 기준](POL-15.md#pol-15-contract) · [수락 완료 Figma](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3141-56172)
- 후속 완료 조건은 현재 계정·회사·소속·leaf의 대조, 접근 권한의 상실/미확인·경로 미제공, 수락 성공 뒤 조회 실패와 수락 결과 미확정의 구분, 중복 클릭·다른 계정/회사·뒤로가기/새로고침에 대한 명시 검증이다. 거절/로그인 복귀/만료·권한 없는 직접 URL도 회귀를 확인한다. [TEAM-23/24 상세 기준](../../../qa/team-members.md#pol-15-team-qa)
- 첫 행동은 최신 main과 이 정책의 원문·O11 완료 Figma·수락 결과/현재 회사·권한 포트·`/my/team` 접근 가드·TEAM-23/24와 AUTH-16/17을 대조하는 것이다. 업무 응답과 배포 실행 대응, 소모용 합성 초대/계정·권한별 fixture·변경/정리 범위 및 승인을 확보한 뒤 자체 요구사항 Gate를 작성한다. 실제 QA가 준비되지 않으면 해당 제약과 필요한 결정을 이 Task에서 다룬다. [AUTH-16/17 기존 실제 차단](../../../qa/auth.md#qa-08-20261102)
- 이번 기록은 후속 개발 범위와 확인 절차의 인계다. DEV-33 자체 Brief·설계·제품 코드·로컬/실제 QA·별도 Git 전달과 승인 연장은 이 단계의 범위 밖이다. 현재·다음·상태는 [WBS](../README.md)를 따른다.

<a id="dev-33-brief"></a>

## 2026-11-20 · Implementation Brief

| 구분 | 기록 |
| --- | --- |
| 시작 기준 | `main`, `origin/main`과 원격 main 모두 `49b4cc9654fdc7e9e6abac0da2b65540da9ea8bf`, 깨끗한 작업트리, 기존 DEV-33 브랜치 없음. POL-15 #91과 DEV-27 #85가 조상에 포함된다. `git fetch --no-tags origin main`과 `git merge --ff-only origin/main` 확인 뒤 `feat/dev-33-invitation-destination`을 만들었다 |
| 기존 확정 정책 | 2026-11-18 사용자 D1의 같은 계정·회사·활성 소속 및 최신 leaf 확인, 팀원/회사/공개 공고와 읽기 재시도. 정해진 목적지와 Figma 정상 CTA를 적용한다. [POL-15](POL-15.md#pol-15-contract) |
| 이번 승인 | 2026-11-20 사용자의 DEV-33 단일 개발·검증·두 리뷰·목적별 커밋/push·PR·최종 head CI와 정상 병합·로컬 FF 승인. 이번 PR의 Chromatic 월간 한도만 CI 예외다. 실제 합성 초대·계정·변경/복구 준비가 확인되지 않아 이 대화의 추가 질문에서 사용자가 ‘로컬 검증으로 진행 (추천)’을 선택했다. 실제 업무 API QA의 차단을 유지한다 |
| 요구사항 및 성공 기준 | 유효한 수락 응답에만 합류 안내를 표시한다. 완료 시점과 CTA 활성화 시점의 현행 회사·소속·leaf를 대조한다. 팀원 경로가 있고 목록 leaf가 있으면 `/my/team`, 확인된 회사 정보 leaf가 대안이면 `/my/company`다. 조회 실패·세션 만료·불일치에는 읽기 재시도와 `/bids`를 제공한다. 결과 미확정, 중복 동작, 계정 교체, 화면 이탈과 재진입, 수락 전 로그인 복귀·거절·만료·직접 접근을 구분한다 |
| 확인한 파일과 패턴 | 초대 route와 `AuthCard`, 공통 인증 헤더, `useCompanyFlowScope`의 계정/epoch, 같은 company 공급원의 Onboarding/Team 공개 포트와 HTTP/가변 mock, `loadCompanyTeam`과 `MyCompanyClient`의 직접 접근 검사. [data-access](../../../ai-context/data-access.md) · [TEAM-23/24](../../../qa/team-members.md#pol-15-team-qa) · [AUTH-16/17](../../../qa/auth.md#qa-08-20261102) |
| 수정 대상·순서 | Company Repository에서 수락 결과와 명령 수명을 검사한다. `features/company/invitation-completion.ts`에서 소속과 leaf를 읽는다. 초대 route의 client와 완료 UI에 명시 CTA·읽기 재시도를 연결하고, 인증 헤더의 SPA 이탈도 늦은 응답 적용 전에 감지한다. 회귀 테스트, 작업·QA·검토·WBS와 필요한 컨텍스트 문서를 갱신한다 |
| 범위와 가정 | O11 정상 완료 프레임의 CTA 문구·배치와 정책이 정한 오류/대체 행동을 검증한다. 기존 축하 자산·카드 시각 차이는 전체 화면의 예외 승인으로 보지 않는다. 현재 번들에 팀원 route가 있고 경로 미제공은 방어 사례다. 버튼을 누른 뒤 새 조회에서 목적지가 바뀌면 새 행동을 표시한다. 별도 기능, 실제 초대·메일·업무 조회/변경, 운영·배포, API 계약·패키지 변경은 이 작업의 범위 밖이다 |
| 위험·검증 | 세션 갱신 실패를 수락 실패로 오인하는 경우, 2xx 손상, 오래된 소속/leaf와 다른 계정 응답, 빠른 중복 입력·뒤로가기·새로고침을 우선 검증한다. Node 22.20.0과 pnpm 11.3.0, 격리된 로컬 QA에서 `pnpm test`, `pnpm lint`, API/mock/hybrid `pnpm build`와 실제 Next 브라우저 및 HTTP 대역, 문서 검사, `git diff --check`, 두 리뷰를 실행한다. 이번 요구사항에 미결 제품 정책은 없다 |

- 착수 체크포인트. 시작 `49b4cc9`의 새 작업 브랜치에서 이 Brief를 먼저 기록했다. 다음 행동은 수락 응답 경계와 CTA의 읽기·수명 조합을 구현한 뒤 브라우저로 단계별 근거를 확보하는 것이다.

<a id="dev-33-verification"></a>

## 2026-11-20 · 구현과 검증 체크포인트

- 수락 응답의 회사·소속 ID를 검증한다. 현재 계정의 같은 회사·활성 소속과 팀원/회사 정보 조회 leaf를 완료 시점과 버튼 활성화 시점에 다시 읽는다. 버튼을 누른 뒤 목적지가 달라지면 새 버튼을 표시한다. 소속/권한 미확인에서는 완료 안내와 읽기 재시도·공개 공고를 제공한다. 수락 결과 미확정은 별도 안내로 표시한다. 성공·미확정의 읽기는 초대 수락을 다시 전송하지 않는다.
- 계정 교체·명시 로그아웃, 뒤로가기·페이지 이탈에 이전 수락 결과와 진행 중 이동을 폐기한다. 수락 전에는 최신 수신 문맥만 수락·거절에 사용한다. 팀원 목록/상세와 회사 화면의 직접 접근 검사는 그대로 적용된다.
- O11 [Figma 3141:56172](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3141-56172)의 렌더와 코드 컨텍스트에서 420px 완료 카드와 정상 CTA 문구·위치를 대조했다. 완료 CTA의 문구, 카드 안 배치, 키보드 조작을 확인했다. 기존 완료 카드에는 축하 아이콘과 회사명 제목이 없다. 화면 전체의 시각 일치 검증과 별개이며, 폴백·세션 오류 행동의 기준은 [POL-15 D1](POL-15.md#pol-15-contract)이다.
- 백엔드 `dev` `ab388b7cb06154a00e254eff7b124882952166ac`의 수락 결과와 확인 문맥 소비, `CI005/006/012`, 현재 권한과 팀원 목록 접근 검사를 확인했다. [수락·재개 서비스](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/membershipinvitation/CompanyMembershipInvitationRecipientServices.kt) · [오류 계약](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/global/exception/CompanyMembershipInvitationErrorCode.kt) · [현재 권한 컨트롤러](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companymembership/CompanyMembershipController.kt)
- 같은 SHA의 [개발 CI run 44429902651](https://github.com/mate-pjt/mate-backend/actions/runs/44429902651)에서 verify·publish·deploy 성공과 deploy-prod 건너뜀을 확인했다. [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs)는 이번 재조회에서 Python HTTP 403, curl 타임아웃으로 본문을 재확인하지 못했다. 11월 18일 게시 명세 확인값은 [POL-15 조사](POL-15.md#pol-15-investigation)의 당시 관찰이다. 실행 중 서버 SHA와 실제 업무 응답은 미확인이다.
- 자동 수정 1/3. 로컬 HTTP 대역이 수락을 처리한 직후 응답 헤더를 보내기 전에 연결을 끊자 Chromium의 앱 fetch 1회가 연결에서 2회 관측됐다. 기존 화면은 이어진 거부를 처리한 뒤 오래된 수신 행동을 남겼다. 수락의 401 자동 재전송을 끄고 `CI005/CI012`를 결과 미확정으로, 수신 `CI006`을 계정 전환으로 처리했다. 실패한 수신 확인의 이전 성공 문맥도 폐기한다. 재검증의 발신 횟수와 네트워크 관찰은 [TEAM QA](../../../qa/team-members.md#dev-33-local-qa)에 구분했다.

| 검증 항목 | 결과 |
| --- | --- |
| `pnpm test` | 39개 파일, 1,158건 통과. 수락·권한·HTTP/mock 회귀 33건 추가 |
| `pnpm lint` | 통과 |
| `pnpm build` | 격리 Preview API·mock·CI hybrid 조합 3개 통과 |
| `pnpm build-storybook` | 공유 인증 헤더 영향 확인, 구성된 mock 빌드 통과 |
| 실제 Next·Aside | 전체 mock과 loopback HTTP 대역을 따로 실행했다. 화면, 권한, 네트워크 증거와 실제 차단은 [TEAM](../../../qa/team-members.md#dev-33-local-qa)과 [AUTH](../../../qa/auth.md#dev-33-auth-regression) 참조 |

- QA 환경은 Node `22.20.0`, pnpm `11.3.0`, Next `16.2.9`의 환경 파일을 제외한 격리 복사본이다. 초기에 symlink 의존성의 자동 재설치를 pnpm이 거부했다. 격리 복사본에 `pnpm install --offline --frozen-lockfile`로 각각 설치한 뒤 검증했다. 제품 수정 횟수와 분리한다.
- 다음 행동은 문서 링크/불변 이력·diff 검증, Context Audit, 읽기 전용 verifier와 ai-review다. 전용 실제 합성 자원·조건과 정리 담당은 미확보이며 백엔드·회사 fixture·인증 담당자와 실행·사용·소비/잔존·복구 범위를 확정한 뒤 재개한다.

- 자동 수정 2/3. 첫 독립 검토의 Major 1은 fragment가 없는 초대 복귀에서 세션이 만료되면 로그인 행동이 사라지는 회귀였다. 수신 세부정보와 별개로 고정 초대 경로로 재로그인하는 버튼을 제공했다. 로컬 HTTP에서 수신 확인 뒤 401, 이전 세부정보 숨김, 키보드 로그인, 같은 초대 경로로 복귀, 새 수신 확인 뒤 수락·거절 복원을 확인했다. 수락 요청은 만료 오류 1회였고 복귀에서 다시 실행되지 않았다. [AUTH 재검증](../../../qa/auth.md#dev-33-auth-regression) · [독립 검토와 ai-review](../reviews/DEV-33.md)
- Documentation Update Check. 인증 경계·화면 수명은 architecture/data-access, 실행 근거는 plan/ai-failures·이 Task·TEAM/AUTH QA와 검토 문서에 추가했다. scripts와 하네스 운용 변화가 없어 base/harness 수정은 필요 없다. Context Audit 시작 시 발견한 WBS의 기존 집계를 실제 표에 맞췄다. 원본 79개와 기존 기준선·coverage·114개 작업·156개 의존 관계는 보존했다. [Context Audit](../reviews/DEV-33-context.md)

<a id="dev-33-close"></a>

## 2026-11-20 · 로컬 검증 범위 종료와 인계

- [x] 역할별 목적지·다른 계정/회사·만료·권한 변경·뒤로가기/재로드를 확인했다.
- [x] 초대 거절과 로그인 복귀·세션 만료 재로그인, 키보드 동작과 모바일 폭을 검증했다.
- [x] 현행 test/lint/build·Storybook 및 문서 링크/상태·기존 QA 보존·diff 검사를 통과했다.
- [x] 사용자 결정에 따른 로컬 브라우저와 HTTP 대역의 범위를 마쳤다. TEAM-23/24의 실제 API 0통과·2차단 및 기존 AUTH-16 차단과 초대 AUTH-17 미실행을 보존한다. [QA 결과](../../../qa/team-members.md#dev-33-local-qa)
- [x] Documentation Update Check과 두 리뷰를 통과했다. 첫 verifier FAIL의 인증 회귀를 교정했고 코드와 자동 검증을 다시 확인했다. [Review Gate](../reviews/DEV-33.md)

Git 전달은 `feat/dev-33-invitation-destination`에서 응답 경계, 기능, 테스트, 문서를 각각 커밋한다. [이 브랜치의 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afeat%2Fdev-33-invitation-destination)에서 실제 최종 head·CI·리뷰·병합을 확인한다. 이번 사용자 승인에 따라 정상 merge와 로컬 fast-forward를 적용하며 월간 사용 한도에 해당하는 Chromatic 상태를 별도 기록한다.

다음 한 작업은 [POL-16 · 회사 간 통합·부분 승인·충돌 정책](POL-16.md#pol-16-dev-33-handoff)이다. 기본 우선순위와 기존 차단을 적용한 뒤 POL-12·POL-14 선행이 충족된 후보를 선정했다. 새 대화에서 최신 main과 소유 정책, 화면·현행 계약을 대조하는 것이 첫 행동이다. 이번 DEV-33의 구현/QA·Git 승인과 예외는 이 인계의 근거가 아니다.

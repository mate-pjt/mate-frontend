# POL-15 · 초대 수락 후 팀원 목적지 결정

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 정책 결정
- 원본 항목: O11
- 선행 작업: [POL-14](POL-14.md)
- 목적/범위: 수락자의 역할별 팀원 화면 접근 가능 여부와 완료 CTA/복귀 경로를 결정한다. 추천: 실제 접근 가능한 팀원 화면 또는 안전한 회사 화면으로 안내한다.
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

## 완료 기준

- [ ] 현재 /bids 복귀와 Figma 차이를 기록한다
- [ ] 역할별 목적지·직접 접근 차단·아직 없는 경로 폴백을 확정한다
- [ ] 원문/소유 소스·버전·결정자·시각·선택/보류 이유를 기록한다. 추천안은 승인으로 간주하지 않는다.
- [ ] 근거 있는 기존 승인 또는 필요한 개발자 결정을 확보하고, 후속 개발의 범위/완료 기준/차단을 갱신한다. 정책 작업도 Review Gate를 수행한다.

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

<a id="pol-15-dev-32-handoff"></a>

## 2026-11-18 · DEV-32 검증 뒤 선정·인계

- 남은 P0의 실제 QA·약관·취합과 P1 및 앞선 P2의 외부/선행 차단·보류를 보존하면, POL-14가 main에 반영된 이 정책이 WBS 기본 표 순서상 첫 독립 후보다. DEV-33의 수락 완료 연결에는 이 정책이 선행한다.
- 다음 첫 행동은 최신 main과 이 원본 O11·POL-14 접근 결정·DEV-27 결과를 확인하는 것이다. 수락 완료 [Figma 3141:56172](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3141-56172)와 현행 CTA/복귀를 대조하고, 수락 이후의 세션·현재 회사·조회 권한에 따른 목적지와 안전한 폴백의 정책 Gate를 구성한다.
- DEV-32에서는 [WBS](../README.md)의 선정과 이 인계만 기록했다. 조사·정책 승인·UI/API·QA·별도 Git 전달은 이 작업의 자체 Gate 이후다.

<a id="pol-15-investigation"></a>

## 2026-11-18 · 착수 조사와 최초 정책 선택지

- 13:46 KST 착수 기준. 원격을 다시 조회한 `main`과 로컬 `main`은 `713c12a5bccd149f574db5050ecc8c5aa5b4a52b`로 동일했고 미커밋 변경과 기존 POL-15 브랜치는 없었다. POL-14 `1d93ebc`([#83](https://github.com/mate-pjt/mate-frontend/pull/83)), DEV-27 `944d14e`([#85](https://github.com/mate-pjt/mate-frontend/pull/85)), 직전 DEV-32 `713c12a`([#90](https://github.com/mate-pjt/mate-frontend/pull/90))가 모두 `main`에 포함됐다. `git merge --ff-only origin/main` 확인 후 `docs/pol-15-invitation-destination`에서 문서 조사를 기록했다.
- 이번 사용자 승인 범위는 POL-15 정책 조사와 결정 기록, 문서 검증과 두 리뷰, 목적별 Git 전달, 최종 head CI 확인, 조건 충족 시 정상 PR 병합 및 로컬 main FF다. 이번 PR의 Chromatic 월간 한도 문제는 사용자 승인 예외다. UI 구현, 실업무 조회·수락·소속 변경·메일 실행, 운영·배포, 다른 Task 실행은 이 정책 작업의 범위 밖이다.

### 현행 프론트와 O11 Figma 대조

| 확인 대상 | 2026-11-18 확인 결과 |
| --- | --- |
| 수락 완료 프레임 | [Figma 3141:56172](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3141-56172) 메타데이터와 렌더를 확인했다. 1920×1080 프레임의 420×324 완료 카드에 축하 아이콘, 합류·환영 문구, ‘팀원 화면으로 이동하기’ CTA가 있다. 상단에 닫기 컨트롤이 있다. 권한·갱신 실패 분기와 prototype 동작, 픽셀 전수는 확인 범위 밖이다 |
| 수신·수락·복귀 | 수신 화면은 초대 fragment를 주소에서 지운 뒤 preview를 호출한다. 인증된 수신 문맥에서 resume하고, 계정 불일치 시 계정 전환을 안내한다. 수락·거절 완료는 컴포넌트 상태이고 두 버튼 모두 `/bids`로 이동한다. 수락의 버튼 문구는 ‘메이트 시작하기’다. 완료 전 Back은 `/auth/start`, 인증 헤더의 닫기는 `/`다. [초대 수신 화면](../../../../src/app/auth/company/invitations/invitation-client.tsx#L26) · [완료 분기](../../../../src/app/auth/company/invitations/invitation-client.tsx#L50) · [공통 인증 헤더](../../../../src/components/site-header.tsx#L36) |
| 수락 결과와 현재 권한 | 프론트 Onboarding 포트는 수락의 회사 ID, 소속 ID, 선택적 `sessionWarning`을 제공한다. HTTP 구현은 `expectedVersion`을 보내고 수락 뒤 세션을 갱신한다. 갱신이 실패해도 확인한 결과와 경고를 돌려준다. 인증의 `companyContext`는 회사 ID와 요약 role을 제공한다. 현재 소속의 실제 leaf는 `getCurrentCompanyPermissions`에서 읽는다. [Onboarding 포트](../../../../src/data/company/contracts.ts#L282) · [HTTP 구현](../../../../src/data/company/http-repository.ts#L90) · [갱신 처리](../../../../src/data/company/http-repository.ts#L255) · [Team 조회 포트](../../../../src/data/company/team-api.ts) |
| 팀원 직접 접근 | DEV-27의 `/my/team`과 `/my/team/[membershipId]`가 `main`에 있다. 현재 계정과 최신 회사·자기 소속·`COMPANY_MEMBER_LIST_VIEW`를 확인하고 읽는다. 회사·소속·leaf를 다시 읽어 응답 적용 전 변경을 확인한다. 비로그인, 비소속, 401·403·404와 조회 실패 UI가 분리돼 있다. [목록 route](../../../../src/app/my/team/page.tsx) · [Team 조회](../../../../src/features/company/team.ts#L12) · [직접 접근 상태](../../../../src/components/my/my-team-client.tsx#L25) |
| 회사 기본 화면 | `/my/company`는 인증·현재 소속에 따라 연결/미연결/신청 상태를 표시하고 서버 401·403 및 조회 실패를 처리한다. 회사 기본 조회의 서버 leaf는 `COMPANY_INFORMATION_VIEW`다. `/bids`는 공개 입찰공고 경로다. [나의 회사 route](../../../../src/app/my/company/page.tsx) · [회사 상태](../../../../src/components/my/my-company-client.tsx) · [서버 조회 가드](https://github.com/mate-pjt/mate-backend/blob/545ef153e30569a516f1585d60bdf00ce70d7f3a/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companyprofile/query/CompanyBasicProfileQueryService.kt) · [공개 입찰공고](../../../../src/app/bids/page.tsx) |

### 소유 근거와 검증 수준

| 근거 | 2026-11-18 확인 결과 |
| --- | --- |
| 중앙 정책 | `mate-docs/main` `c9e50ff591ae18023164e1a94581c611bf1e4f29`. ADMIN·AGENT·VIEWER의 유효한 활성 소속은 모두 `COMPANY_INFORMATION_VIEW`와 `COMPANY_MEMBER_LIST_VIEW`를 포함한다. 표시 role과 직급은 실제 leaf 권한을 대신할 수 없다. [중앙 권한 정책](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/company/permissions.md) · [POL-14 확정안](POL-14.md#pol-14-contract) |
| 백엔드 소스 | `mate-backend/dev` `545ef153e30569a516f1585d60bdf00ce70d7f3a`. 수락은 수신자·현재 version·유효 handoff·회사 변경 잠금·활성 소속 충돌을 검사해 소속을 생성하고 handoff를 소비한다. 성공 응답의 회사 ID·소속 ID는 대상 식별 근거다. `/memberships/me`는 활성 현재 소속의 leaf를 돌려주고 목록·상세는 서버에서 `COMPANY_MEMBER_LIST_VIEW` 및 회사 경계를 다시 검사한다. [수락 서비스](https://github.com/mate-pjt/mate-backend/blob/545ef153e30569a516f1585d60bdf00ce70d7f3a/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/membershipinvitation/CompanyMembershipInvitationRecipientServices.kt) · [현재 권한 컨트롤러](https://github.com/mate-pjt/mate-backend/blob/545ef153e30569a516f1585d60bdf00ce70d7f3a/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companymembership/CompanyMembershipController.kt) · [목록/상세 검사](https://github.com/mate-pjt/mate-backend/blob/545ef153e30569a516f1585d60bdf00ce70d7f3a/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/CompanyTeamMemberQueryService.kt) |
| 백엔드 CI·배포 기록 | 위 SHA에서 `verify`, `publish`, `deploy`가 성공했고 `deploy-prod`는 건너뛰었다. [개발 CI run 44026382503](https://github.com/mate-pjt/mate-backend/actions/runs/44026382503) |
| 게시 OpenAPI | 개발 명세 GET 200, OpenAPI 3.1.0/v1, SHA-256 `85b38b6e43ad45807a1d8c66153767c53876220dbf84852cbc4fa53d832917ba`. acceptance의 `expectedVersion`과 성공 응답 회사·소속 ID, 인증 스키마의 nullable `companyContext`, `/memberships/me`의 `companyId`, `membershipId`, `permissionCodes`, 팀원 목록·상세·회사 기본 조회를 확인했다. refresh 작업은 400·401·403·500만 게시한다. refresh 성공 응답과 명세의 `success`/프론트 wire의 `isSuccess`는 실제 통합에서 확인할 항목이다. [게시 명세](https://api-test.mate-bid.com/v3/api-docs) · [데이터 접근 계약](../../../ai-context/data-access.md#5-http인증-계약) |
| 실행 버전·실제 응답 | 실행 중 프로세스 SHA 대응과 실제 수락·갱신·팀원/회사 업무 응답은 확인하지 않았다. QA-08의 AUTH-16 실제 0통과·1차단, 초대 화면 AUTH-17 미실행 및 TEAM-23/24 계획을 보존한다. [기존 초대 QA](../../../qa/auth.md#qa-08-20261102) · [팀원 QA](../../../qa/team-members.md#pol-14-team-qa) |

- 최초 추천은 동일 계정·현재 회사·수락한 소속과 최신 `COMPANY_MEMBER_LIST_VIEW`가 확인되면 명시 CTA로 `/my/team`에 진입하는 것이다. 팀원 경로를 열 수 없고 같은 회사 정보 조회가 확인되면 `/my/company`, 회사·권한을 확인할 수 없으면 공개 `/bids`와 읽기 재시도 안내를 제시했다. 사용자의 선택을 받기 전에는 회사 폴백을 확정하지 않는다.
- 최초 확인 질문은 위 회사 폴백을 채택할지, 팀원 경로를 열 수 없는 경우 모두 `/bids`와 읽기 재시도로 보낼지였다. 직접 URL의 기존 권한 검사와 수락 재전송 방지는 양쪽 안의 공통 기준이다.

<a id="pol-15-brief"></a>

## 2026-11-18 · 승인과 실행 Brief

| 구분 | 기록 |
| --- | --- |
| 정책 결정 D1 | 13:48 KST, 이 대화의 요청자 겸 정책 승인자가 ‘확인된 범위에서 이동 (추천)’을 선택했다. 답변 원문은 “같은 회사의 정보 조회만 가능하거나 팀원 경로가 없으면 `/my/company`, 회사나 권한이 확인되지 않으면 성공 안내와 조회만 다시 시도하는 버튼 및 `/bids`를 제공합니다.”다. 질문에 명시한 동일 계정·회사·소속과 현재 `COMPANY_MEMBER_LIST_VIEW`, 기존 직접 접근 가드도 적용한다 |
| 선택 이유 | 팀원 조회가 가능할 때 Figma의 완료 CTA를 실현하고, 실패나 전이 중에도 권한이 입증된 가장 가까운 화면을 제공한다. 확인된 회사 화면을 건너뛰고 곧바로 공고로 보내는 대안은 채택하지 않았다 |
| 성공 기준 | O11 Figma와 시작 main의 `/bids` 차이, 역할·현행 leaf·직접 접근과 폴백, 상태별 확인된 성공/미확정 처리, 결정자와 날짜 및 근거를 기록한다. 후속 DEV-33의 미실행 검증/재개 조건을 연결하고 문서 검사와 두 리뷰를 통과한다 |
| 범위 및 확인한 패턴 | 수락 완료 목적지와 복귀의 정책, `InvitationClient`·기존 인증 헤더/안전 복귀, company의 Onboarding 및 Team 공개 포트, DEV-27 `/my/team` 및 `/my/company`의 접근 경계, POL-14 및 기존 TEAM/AUTH QA다. [현행 대조](#pol-15-investigation) |
| 실행 범위 | POL-15 문서, WBS, DEV-33 인계, TEAM-23/24의 O11 기대값, 검증·리뷰 기록을 갱신한다. 런타임·패키지·환경·API·공급원·중앙 정책 수정이나 실제 수락/메일·회사 변경은 이 승인에 포함되지 않는다. DEV-33 개발 또는 로컬 선행 및 실제 QA 예외는 자체 Gate의 별도 결정이다 |
| 단계와 위험 | 정책 표와 수락/조회 경계를 고정하고 QA와 WBS에 연결한 뒤 문서 검사와 리뷰를 거친다. 권한 변경·세션 만료·뒤로가기 중 오래된 목적지가 재사용되지 않도록 경계를 명시한다. 폴백의 세부 문구·로딩 배치는 DEV-33 자체 Gate에 둔다 |
| 검증 계획 | Python 3과 Git으로 수정 범위, 링크/앵커, 탭·표·코드 펜스, 79개 원본/114개 작업/156개 의존성, WBS 상태/우선순위, 원본/QA 이력을 검사한다. `git diff --check`, Context Audit, read-only verifier와 ai-review를 수행한다. 로컬 앱 검사·제품 브라우저·실제 업무 통합은 실행 코드나 환경 영향이 없는 정책 문서 단위이므로 미실행이다 |

- 체크포인트. `docs/pol-15-invitation-destination`, 시작 `713c12a`, 이 Task의 조사 외 기존 변경 없이 D1 답변을 받았다. 다음 행동은 아래 확정 정책, DEV-33 인계, TEAM-23/24 계획을 반영한 뒤 문서 검증과 Review Gate를 수행하는 것이다.

<a id="pol-15-contract"></a>

## 확정 정책 v1 · 초대 수락 후 목적지

### 완료 화면에서 명시적으로 이동

| 현재 확인 상태 | 제공할 행동 |
| --- | --- |
| 같은 계정과 수락으로 생긴 소속이 현재 활성이고, 현재 회사·소속 ID가 수락 결과와 일치하며 `COMPANY_MEMBER_LIST_VIEW`가 있고 팀원 경로가 제공됨 | Figma 문구 ‘팀원 화면으로 이동하기’로 기본 목록 `/my/team`에 진입한다. ADMIN·AGENT·VIEWER와 추가 leaf가 있는 유효 소속에 같은 기준을 적용한다 |
| 같은 계정과 회사·소속이 일치하고 `COMPANY_INFORMATION_VIEW`가 확인됐으며, 팀원 조회 권한만 부족하거나 팀원 경로가 제공되지 않음 | 나의 회사 CTA로 `/my/company`에 진입한다. 회사 화면에서도 현재 권한을 적용한다. 현행 유효 역할에는 두 조회 leaf가 있으므로 이 분기는 경로 미제공이나 예외 응답에 대한 방어다 |
| 세션 갱신 실패/만료, 회사가 아직 반영되지 않음, 회사·소속 불일치/없음, 권한 응답 확인 실패, 또는 두 보호 화면 모두 이용 불가 | 같은 수락 계정의 화면 수명 안에서는 확인된 합류 안내를 유지한다. 적절한 경고와 읽기만 수행하는 ‘다시 확인하기’, 공개 `/bids` 선택지를 제공한다. 세션 만료는 기존 인증 진입을 안내할 수 있다 |
| 계정 교체·명시 로그아웃·화면 수명 종료로 수락 계정 문맥이 폐기됨 | 이전 완료 내용·권한·이동 예약을 폐기한다. 새 계정이나 다른 화면에서 이전 초대의 결과로 보호 화면을 자동으로 열지 않는다 |

- 완료 화면에서 조회한 소속과 권한은 CTA 클릭 시점에도 유효해야 한다. 수락 이후 `getCompanyTeamContext`와 `getCurrentCompanyPermissions` 등 같은 company 공급원의 공개 포트를 사용한다. 수락 결과의 회사·소속 ID를 현재 값과 대조하고 계정/세션 epoch·화면 수명을 확인한다. 일시적인 조회 오류와 경로 자체의 미제공을 구분하며 보호 화면에 필요한 확인을 얻지 못하면 공개 경로를 사용한다. 역할 문자열, 초대 미리보기 값, 수락 당시 권한, 오래된 로그인 응답만으로 경로의 접근 가능성을 판정하지 않는다. 목적지 화면과 백엔드는 목록/상세 및 다른 회사 접근에서 기존 권한을 다시 확인한다.
- 성공 뒤에는 세션·회사·권한을 읽어 확인할 수 있다. 이 확인이 실패해도 확정된 수락을 실패로 되돌리거나 수락 POST를 자동으로 반복하지 않는다. 응답 유실·손상처럼 수락 결과 자체를 확인할 수 없는 경우는 성공과 구분해 상태 확인으로 안내한다. 수락 전에 확인된 계정 불일치·거절·만료·충돌은 기존 수신 흐름의 상태로 처리한다.
- 완료 화면의 이동 경로는 `/my/team`, `/my/company`, `/bids`로 고정한다. 초대 링크나 URL의 `next`를 완료 목적지로 사용하지 않는다. 수락 전에 필요한 기존 내부 로그인 복귀는 `/auth/company/invitations`를 사용한다. 거절 완료의 `/bids`, 완료 전 Back의 `/auth/start`, 공통 인증 닫기의 `/`를 회귀 확인한다. 뒤로가기·새로고침으로 세션/라우트를 복원할 때 완료 CTA와 수락 명령을 재생하지 않으며, 수신 경로의 재진입은 기존 서버의 handoff 상태를 따른다.
- Figma 성공 프레임의 팀원 CTA는 정상 접근에서 사용한다. 회사·공고 폴백과 세션/권한 오류에서의 대체 문구·읽기 재시도는 D1로 승인된 상태별 동작이다. 카드/아이콘·다른 화면의 포괄적인 시각 예외는 이번 결정으로 승인된 범위에 포함되지 않는다. [정상 완료 Figma 3141:56172](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3141-56172)

### 후속 실행 기준

- DEV-33은 위 조건과 기존 `/my/team` 가드로 수락 완료 화면을 연결한다. 사용 중인 세션·회사·소속 재조회, 목적지 실패와 복구, 중복 클릭·계정 교체·뒤로가기/새로고침을 검증 기준으로 받는다. [DEV-33 인계](DEV-33.md#dev-33-pol-15-handoff)
- 업무 API는 실행 중 프론트/백엔드 버전과 Origin·쿠키 경계, 합성 회사/계정/현재 leaf, 독립 소모용 초대, 메일/수락·소속 변경·잔존/복구 계획과 승인이 필요하다. 승인자 및 회사/인증·메일·배포 담당 역할과 필요한 자원은 명시했고 실제 담당자와 준비 여부는 DEV-33의 Gate에서 확인한다. [TEAM-23/24 세부 검증](../../../qa/team-members.md#pol-15-team-qa) · [AUTH-16/17 이력](../../../qa/auth.md#qa-08-20261102)

<a id="pol-15-verification"></a>

## 2026-11-18 · 문서 검증과 Review Gate

- 리뷰 전 Python 3과 `git diff --check 713c12a`를 통과했다. 링크/앵커, Markdown, O11과 선행 연결, WBS/범위, 원본과 기존 QA 보존을 확인했다. 앱 test/lint/build/Storybook, 제품 브라우저·mock·HTTP 대역 및 실제 API는 정책 문서 단위에서 미실행이다. 공개 개발 OpenAPI 조회는 계약 자료 확인이다. [검토 기록](../reviews/POL-15.md)
- 첫 독립 검토는 PASS, Blocker·Major 0이었다. Minor 두 건을 한 차례에 교정했다. 새 소스 행 링크 8개에 GitHub `#L` 앵커를 적용하고, 인증 스키마와 refresh 2xx 미게시를 구분했다. 문서 검증기에 새 소스 링크의 실제 형식 검사도 추가했다. 종료·인계와 함께 두 리뷰의 최종 범위를 다시 확인한다.
- Documentation Update Check. 정책·결정·이력을 이 파일, 현재와 다음을 WBS, 구현에 필요한 범위·검증·실제 API 재개 조건을 DEV-33과 TEAM-23/24에 기록했다. 앱 구조·공급원·실행 절차와 패키지 변경이 없으므로 base/architecture/data-access/harness 및 공통 plan의 수정이 필요 없다. 링크 교정은 이 검토 기록에 남긴다. O11 매핑과 원본·AUTH 이력은 보존 대상이다.

<a id="pol-15-close"></a>

## 2026-11-18 · 정책 단위 종료와 다음 인계

상단 체크리스트는 최초 작업 정의를 보존한 것이다. 이 실행의 완료 근거는 아래에 연결했다.

- [x] 현재 `/bids`와 Figma 차이를 대조했다. [소스 대조](#pol-15-investigation)
- [x] 이동 목적지, 직접 접근 차단, 폴백의 조건을 확정했다. [확정 정책](#pol-15-contract)
- [x] 사용자 결정과 일시·근거·채택 이유를 기록했다. [Brief](#pol-15-brief)
- [x] 후속 개발과 검증/차단에 연결하고 문서 검사와 두 리뷰를 마쳤다. [DEV-33](DEV-33.md#dev-33-pol-15-handoff) · [TEAM 검증 계획](../../../qa/team-members.md#pol-15-team-qa) · [검토 기록](../reviews/POL-15.md)
- 다음은 DEV-33 하나다. 기존 P0/P1의 자원·선행 차단과 앞선 P2의 차단/보류 및 선행 대기를 적용한 문서 표에서, POL-15와 DEV-27이 갖춰지는 첫 후보다. 첫 행동은 최신 main, 수락 결과·현행 권한 포트/팀원 가드와 실제 QA 재개 조건을 확인해 자체 요구사항 Gate를 구성하는 것이다. 이번에는 선정과 인계까지다.
- 체크포인트. `docs/pol-15-invitation-destination`의 이 문서 변경을 종료 diff로 검증한 뒤 목적별 커밋·push·PR로 전달한다. 실제 최종 head의 CI와 병합 여부·로컬 main FF는 원격 PR과 종료 보고에서 확인한다.

<a id="pol-15-git-delivery"></a>

## 2026-11-18 · Git 전달 체크포인트

- 정책 확정/리뷰의 `b86579d`와 검증 기준/DEV-33 인계의 `735946a`를 분리했다. 작업 브랜치에서 초기 원격 head `735946ad9ac835d05a7672dcaaa33d00c806d2cb`로 PR을 열고 `type: docs` 라벨을 확인했다. [PR #91](https://github.com/mate-pjt/mate-frontend/pull/91)
- 이 체크포인트 커밋을 포함한 최종 head에서 PR과 최신 `main`, 원격 CI·리뷰·병합 조건을 확인한다. Chromatic 월간 한도 관련 상태만 이번 예외로 기록한다. 조건 충족 시 정상 merge commit으로 작은 커밋을 보존하고 로컬 main을 fast-forward하여 SHA와 작업트리를 확인한다. 실제 완료 상태는 PR과 종료 보고를 따른다.

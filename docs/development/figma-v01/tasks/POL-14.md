# POL-14 · 팀원 권한·초대·합류·직급 계약

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 정책 결정
- 원본 항목: T01, T02, T03, T04
- 선행 작업: [DOC-001](DOC-001.md)
- 목적/범위: 관리자/팀원/뷰어 권한표·최후 관리자·초대 발송/재발송/취소·신청 승인/거절·직급 계약을 확정한다. 추천: 서버 권한을 기준으로 UI 노출/금지를 맞춘다.
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

### T02 · 관리자 초대 발송·재발송·취소
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **발송 관리 계약 없음**. 검증: 코드 대조.
- 남은 점: 초대를 받는 기능과 별도로 발송자의 관리 화면/API 연결
- Figma: [3137:52847](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52847) / [3137:52911](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52911) / [3137:52990](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52990)
- 소유 소스/기존 기록: [src/components/my/my-side-menu.tsx:12](../../../../src/components/my/my-side-menu.tsx)、[src/data/company/contracts.ts:202](../../../../src/data/company/contracts.ts)

### T03 · 합류 신청 검토·승인/거절
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **프론트 계약 없음**. 검증: 코드 대조.
- 남은 점: 받은 신청 목록·검토 팝업·승인/거절·역할 설정
- Figma: [3137:53069](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53069) / [3137:53154](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53154) / [3137:53193](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53193)
- 소유 소스/기존 기록: [src/components/my/my-side-menu.tsx:12](../../../../src/components/my/my-side-menu.tsx)

### T04 · 직급 목록·추가·관리
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **프론트 계약 없음**. 검증: 코드 대조.
- 남은 점: 가입 중 직급 입력과 별도의 회사 직급 관리
- Figma: [3137:53220](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53220) / [3137:53254](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53254) / [3137:53288](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53288)
- 소유 소스/기존 기록: [src/components/my/my-side-menu.tsx:12](../../../../src/components/my/my-side-menu.tsx)、[src/data/company/contracts.ts:199](../../../../src/data/company/contracts.ts)

## 완료 기준

- [x] 행동별 권한·마지막 관리자·회사/계정 범위를 기록한다
- [x] 초대 만료/재발송/중복·합류/직급 변경 충돌·현재 계약을 확정한다
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

<a id="pol-14-dev-25-handoff"></a>

## 2026-11-16 · DEV-25 로컬 단위 뒤 선정/인계

- [DEV-25 종료/선정](DEV-25.md#dev-25-close)에서 WBS P2 기본 순서와 DOC-001 선행 충족을 확인해 다음 자체 Gate 후보 하나로 선정했다. 앞선 P0/P1은 자원/정책·선행 차단, 회사 갱신은 DEV-08/계약, DEV-26은 DEV-19/DEV-24·MAT-162 조건을 유지한다. 우선순위/의존성을 변경하지 않는다. 현재/다음/상태는 WBS만 소유한다.
- 다음 첫 행동: 새 대화에서 최신 Git/main·이 Task의 정의/완료 기준과 DOC-001 결과를 확인하고, 그때의 중앙 팀원/권한 정책·backend/개발 Swagger에서 역할 이름과 실제 행동별 leaf, 최후 관리자·초대 발송/재발송/취소/만료·합류 승인/거절·직급 계약/충돌과 현재 지원 범위를 대조한다. 소스/배포/게시 명세/실행/실제 응답을 나누고 남은 정책 결정/QA 자원·사용/복구 범위만 질문하며 자체 Brief·수정 파일/검증을 먼저 제시한다.
- 정책 Task의 범위는 근거 조사/필요 결정·후속 DEV-27~33의 기준 정리다. 이번에는 후보 정의/선행·순서와 첫 행동만 인계했으며 전용 정책/API/Figma 조사·설계·팀원 UI/Repository·실제 초대/메일/권한 변경·운영/배포는 시작하지 않았다.2026-10-27의 ‘관리 계약 없음’은 당시 관찰이며 현재 부재로 재사용하지 않는다.
- DEV-25의 로컬 선행·실제 삭제 QA 차단/Chromatic/Git 전달은 DEV-25만의 승인이다. 이번 인계가 POL-14의 제품/정책·실제 업무·별도 Git 전달 승인을 의미하지 않는다. 기존 QA/회사·DEV-08/MAT-162/타 Task 차단과 원본79개/114Task/156의존성을 보존한다.


<a id="pol-14-investigation"></a>

## 2026-11-16 · 현재 계약 조사와 요구사항 Gate

- 조사 시각: 2026-11-16 20:47 KST. 실행자 Codex, 정책 결정자는 이번 대화의 사용자다. 실제 QA 계정/메일·회사·복구 자원 담당 개인은 미지정이며 후속 Task에서 확보한다.
- Git: 시작 `main`/`960fb14d1a38b19b7bd64942e52c4bf3da19fd8c`, 미커밋/미추적 변경0. `git fetch origin main` 뒤 local/main/origin main 동일(앞/뒤0), `git merge --ff-only origin/main` 변경 없음. 같은 Task 로컬/원격 브랜치 없음 확인 뒤 `docs/pol-14-team-policy` 생성. DOC-001은 WBS 완료·main 파일 존재, 선행 DEV-25 전달은 main의 PR #82 병합 이력으로 확인했다. 기존 변경의 삭제/reset/stash0.
- 이번 승인: 2026-11-16 사용자 최초 요청의 POL-14 정책 조사·필요 결정·후속 기준/QA 계획, 문서 검증·read-only verifier/ai-review, 목적별 commit/push·PR·최종 head CI 확인·정상 main 병합·로컬 main FF. **이번 PR의 Chromatic 월간 한도 문제만 예외**다. DEV-25의 당시 로컬/삭제 QA 예외를 가져오지 않는다.
- 제외: 제품/Repository/mock·라이브러리/설정, 다른 Task 실행, 업무 API 조회/변경·실제 초대/메일/권한/직급/문서 처리·운영/배포, 중앙 저장소 편집. 공개 개발 OpenAPI GET과 소유 GitHub/Figma 읽기만 조사했다. Git 전달은 위 요청으로 승인됐으며 반복 승인받지 않는다.
- 요구사항: T01~T04의 행동별 권한·최후 관리자·회사/계정 범위, 초대/합류/직급 상태·version·충돌·지원 계약을 현재 근거로 정리한다. 기존 중앙 결정과 이번 사용자 결정을 분리하고 후속 DEV-27~33의 완료 기준·QA/재개 조건을 인계한다.
- 성공 기준: 고정 source/게시 명세/배포 기록과 실행/업무 응답 미확인 구분, 세 결정 확보, 후속 소유/예외/차단 보존, 문서 링크·79원본/114Task/156의존·baseline 무변경·범위/Markdown/diff 검증, Documentation Update Check와 두 리뷰 통과.
- 편집 계획: 이 Task와 WBS, `DEV-27.md`~`DEV-33.md`의 인계 append, `docs/qa/team-members.md`와 QA index, `reviews/POL-14.md`, 필요 시 `docs/ai-context/plan.md`의 날짜별 정책 연결만 수정한다. 후속 구현 Brief/현재 상태를 Task 파일에 중복 관리하지 않는다. coverage/baseline/원본과 기존 QA·결정은 보존한다.
- 위험/검증: role/직급에서 권한 유추·동의 요청을 적용 완료로 오인·초대 저장과 메일 도착 혼동·과거 ‘계약 없음’ 재사용을 막는다. 문서 전용이므로 로컬 앱 test/lint/build/Storybook·제품 브라우저/mock/HTTP대역/실제 API 통합은 미실행이며 PASS로 세지 않는다. 현재 package.json scripts8개 확인, pnpm11.3.0·현재 shell Node26.5.0/`.nvmrc`22.20.0을 구분했다. 원격 CI는 실제 최종 head에서 별도 확인한다.
- 다음 행동: 아래 소스 사실을 근거로 사용자 D1/D2/D3 답변을 확보한 뒤 확정 Brief/정책을 작성하고 후속 기준·QA 계획을 연결한다. 답변 전 추천안을 확정하지 않는다.

### 근거 계층과 현재 구현

| 근거 | 2026-11-16 확인 결과·한계 |
| --- | --- |
| 중앙 소유 정책 | `mate-docs/main` commit `c9e50ff591ae18023164e1a94581c611bf1e4f29`. [권한](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/company/permissions.md)·[소속/직급](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/company/membership-and-positions.md)·[ADR-0011](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/decisions/ADR-0011-company-permissions-positions-and-admin-invariant.md). 원문 내용을 로컬 정책안과 구분한다 |
| backend source | `mate-backend/dev` commit `adc0e265ef0e2aa78ccb376e1fa322edd664b290`. 아래 고정 source를 대조했다. source 열람은 서버 실행/통합 QA가 아니다 |
| CI/테스트 배포 기록 | [run43389204151](https://github.com/mate-pjt/mate-backend/actions/runs/43389204151): 같은 SHA, verify/publish/deploy success·deploy-prod skipped. 실행 중 프로세스 SHA의 직접 증명은 아니다 |
| 게시 명세 | [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs) GET200, OpenAPI3.1.0/info.version v1. 전체 원문 SHA256 `85b38b6e43ad45807a1d8c66153767c53876220dbf84852cbc4fa53d832917ba`. membership/member/position/permission 관련32경로37operation·연결67schema를 읽었고, 회사 간 합치기 operation은 제외했다. 명세의 공통 `success`와 기존 프론트의 `isSuccess` 경계는 실제 wire 재확인 사항이다 |
| 실행/업무 응답 | 현재 실행 SHA 직접 대응·팀원 업무 GET/명령·실제 메일/수신·통합 QA **미확인/미실행**. source/배포/게시200으로 대신하지 않는다 |
| frontend | 시작 main의 `src/components/my/my-side-menu.tsx`에서 team disabled, `src/app/my`에 팀원 route 없음. `src/data/company/contracts.ts`에는 수신 초대/가입용 직급은 있지만 팀원 관리 목록·변경/발송/검토/직급 관리 포트 없음. 과거 backend ‘관리 계약 없음’과 **현재 프론트 미연결**을 구분한다 |
| Figma | 파일 `Eayi1SWD8Xq8tGBmlp5SV2`, Task 원본12개 frame의 metadata/상태·라벨을 읽었다. screenshot·pixel·전체 prototype 전수 PASS는 아니다. 예시 인물/이메일/전화 값은 증거에 복사하지 않는다 |

### 현행 source 대조 위치

아래 링크는 모두 조사한 backend 고정 commit의 실제 소유 경로다. 컨트롤러/DTO·게시 schema를 대조했으며 backend test를 이 작업에서 실행한 것은 아니다.

| 범위 | 고정 source |
| --- | --- |
| catalog/표시 role | [CompanyPermission.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/domain/companymembership/enums/CompanyPermission.kt) · [CompanyPermissionPresetRegistry.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/domain/companymembership/vo/CompanyPermissionPresetRegistry.kt) · [CompanyMembershipChangePolicy.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/domain/companymembership/service/CompanyMembershipChangePolicy.kt) |
| 팀원 조회/행동 가능 여부 | [CompanyTeamMemberQueryService.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/CompanyTeamMemberQueryService.kt) · [CompanyMembershipActorLoader.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/CompanyMembershipActorLoader.kt) · [CompanyTeamMemberResponses.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companymembership/response/CompanyTeamMemberResponses.kt) · [CompanyTeamMemberQueryPersistenceAdapter.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companymembership/CompanyTeamMemberQueryPersistenceAdapter.kt) |
| 직접 변경/최후 관리자 | [CompanyMembershipMutationService.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/CompanyMembershipMutationService.kt) · [CompanyMembershipSelfChangePolicy.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/domain/companymembership/service/CompanyMembershipSelfChangePolicy.kt) · [CompanyMembershipMutationRequests.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companymembership/request/CompanyMembershipMutationRequests.kt) |
| 대상 동의 | [CreateCompanyMembershipChangeRequestService.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/membershipchange/CreateCompanyMembershipChangeRequestService.kt) · [DecideCompanyMembershipChangeRequestService.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/membershipchange/DecideCompanyMembershipChangeRequestService.kt) · [CancelCompanyMembershipChangeRequestService.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/membershipchange/CancelCompanyMembershipChangeRequestService.kt) · [CompanyMembershipChangeAccess.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/membershipchange/CompanyMembershipChangeAccess.kt) · [CompanyMembershipChangeRequestPolicy.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/domain/companymembership/membershipchange/CompanyMembershipChangeRequestPolicy.kt) · [CompanyMembershipChangeRequests.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companymembership/membershipchange/request/CompanyMembershipChangeRequests.kt) |
| 초대 | [CompanyMembershipInvitationManagementServices.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/membershipinvitation/CompanyMembershipInvitationManagementServices.kt) · [CompanyMembershipInvitationRecipientServices.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/membershipinvitation/CompanyMembershipInvitationRecipientServices.kt) · [CompanyMembershipInvitationMailEvents.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/membershipinvitation/event/CompanyMembershipInvitationMailEvents.kt) · [CompanyMembershipInvitationExpiryService.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/membershipinvitation/CompanyMembershipInvitationExpiryService.kt) · [CompanyMembershipInvitationRequests.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companymembership/membershipinvitation/request/CompanyMembershipInvitationRequests.kt) |
| 합류 검토 | [CompanyMembershipRequestReviewServices.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/membershiprequest/CompanyMembershipRequestReviewServices.kt) · [CompanyMembershipRequestRequests.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companymembership/membershiprequest/request/CompanyMembershipRequestRequests.kt) |
| 직급 | [CompanyPositionServices.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/CompanyPositionServices.kt) · [CompanyPositionName.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/domain/companymembership/vo/CompanyPositionName.kt) |
| 오류 | [CompanyMembershipErrorCode.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/global/exception/CompanyMembershipErrorCode.kt) · [CompanyMembershipInvitationErrorCode.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/global/exception/CompanyMembershipInvitationErrorCode.kt) · [CompanyMembershipRequestErrorCode.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/global/exception/CompanyMembershipRequestErrorCode.kt) · [CompanyPositionErrorCode.kt](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/global/exception/CompanyPositionErrorCode.kt) |

### 결정 요청 · 답변 전 추천

| ID | 조사 사실·추천 | 결정자/답변 |
| --- | --- | --- |
| D1 | 현행 leaf/capabilities·직접/동의/금지·최후 관리자 계약 채택. 동의 요청/수락/거절/충돌도 DEV-28 기준에 포함 | 사용자 답변 대기. 추천은 승인 아님 |
| D2 | Figma 상세 생년월일/전화번호는 현재 API 필드 없음. 자리/라벨은 유지해 ‘미제공’, 대표자 일괄 변경 금지 문구/버튼은 실제 행동별 안내로 한정 교정 | 사용자 답변 대기. 이 범위 밖 화면 예외 없음 |
| D3 | 만료 표시와 DB 만료 확정 사이에 재발송 가능 여부 차이가 있다. expiresAt 경과 초대는 UI에서 재발송/취소 대신 새 초대 작성으로 안내하고 미만료 PENDING만 기존 초대 관리 | 사용자 답변 대기. 서버 정책/DB를 바꾸거나 자동 새 발송하지 않음 |

### 조사 출력 경계

GitHub branch 원문 응답의 작성자 메타데이터와 Figma 첫 metadata의 예시 인물 필드가 도구 출력에 포함됐다. 원문을 이 문서·검토/QA/PR에 복사하지 않았다. 이후 GitHub는 필요한 SHA/계약 필드만, Figma는 ID/상태·일반 라벨만 요약했다. 기존 [예방 규칙](../../../ai-context/ai-failures.md#pol-30-github-metadata)을 재적용하며 원문 출력 이력을 무노출 PASS로 숨기지 않는다. credential·실제 업무 계정/응답·환경파일을 읽거나 출력한 것은 아니다.


### 현행 계약 관찰 · 정책 채택/화면 예외 확정 전

중앙 정책의 기존 결정과 현재 서버 동작을 요약한 조사 사실이다. D1~D3 추천·새 제품 화면 설계의 승인을 뜻하지 않는다.

| 행동 | 현재 서버가 확인하는 기준 | ADMIN / AGENT / VIEWER 기본 preset |
| --- | --- | --- |
| 회사 정보·구성원 목록/상세·직급/초대 조회 | `COMPANY_INFORMATION_VIEW` / `COMPANY_MEMBER_LIST_VIEW`와 같은 회사 ACTIVE 소속. 신청 검토 조회는 별도 leaf | 세 preset 모두 두 조회 leaf 포함. 별도 회사 정보 API의 권한과 구분 |
| 회사 수정/최신화/변경 검토 | `COMPANY_INFORMATION_EDIT`, `COMPANY_INFORMATION_REFRESH_REQUEST`, `COMPANY_INFORMATION_CHANGE_REVIEW` | ADMIN/AGENT 기본 포함, VIEWER 추가 부여 가능. 이 Task에서 회사 갱신을 실행하지 않음 |
| 초대 생성/수정/재발송/취소 | `COMPANY_MEMBER_INVITE`; 직급/추가 권한·대표자에 추가 제약 | ADMIN 기본 포함, AGENT/VIEWER는 leaf 보유 때만. 표시 role만으로 허용 금지 |
| 합류 신청 조회/승인/거절 | `COMPANY_MEMBERSHIP_REQUEST_REVIEW`; 직급 수정은 PROFILE_EDIT, VIEWER 초과 부여는 PERMISSION_MANAGE와 부여 부분집합 | ADMIN 기본 포함, AGENT/VIEWER는 실제 leaf 기준 |
| 기존 팀원의 직급/권한/내보내기 | 각각 `COMPANY_MEMBER_PROFILE_EDIT`, `COMPANY_MEMBER_PERMISSION_MANAGE`, `COMPANY_MEMBER_REMOVE`; 대상 등급·직급·최후 관리자 검사를 함께 적용 | ADMIN도 대상 동의/불변식을 우회하지 못함. 비ADMIN은 추가 leaf가 있어도 상위 대상 변경 불가 |
| 일반 직급 생성/이름 변경/삭제 | `COMPANY_POSITION_MANAGE`, 회사 범위·system/중복/사용중/version | ADMIN 기본, AGENT/VIEWER는 leaf 기준 |
| 회사 합치기/이의제기 | `COMPANY_MERGE_REQUEST`, `COMPANY_MERGE_REVIEW`, `COMPANY_APPEAL_SUBMIT` | ADMIN 기본. POL-16 등 별도 소유이며 이번에 활성화하지 않음 |

- catalog는3category/15leaf다. VIEWER 최소2개는 모든 유효 집합에 필요하고, AGENT는 두 조회+회사 정보 관리3개, ADMIN은 **현재 전체 leaf**다. category/직급은 권한 원천이 아니며 preset은 선택 시작점, 응답 role은 실제 집합에서 재계산한다. 추가 leaf를 가진 VIEWER/AGENT를 차단하거나 허용을 일괄 확대하지 않는다.
- 팀원 GET은 `GET /api/v1/companies/{companyId}/members`와 `…/members/{membershipId}`, 내 권한은 `…/memberships/me`, catalog는 `GET /api/v1/company-permission-definitions`다. 목록 page0/기본20/size1..100·totalElements/totalPages와 서버 정렬을 보존한다. 목록 content는 ACTIVE 소속/활성 계정이고, 순서는 joinedAt 오름차순·membershipId 오름차순이다.
- 현재 팀원 응답은 membershipId/accountId, nullable displayName/profileImageUrl, contactEmail, positionId/name/type, role/permissions, joinedAt, nullable lastLoginAt, version와 capabilities다. 생년월일/전화번호는 없다. 이름·이미지·로그인 시각 결측을 다른 개인정보로 합성하지 않는다. 계정 고유 이름/생일/전화 편집 API로 팀원 정보 편집 범위를 확대하지 않는다.
- 페이지 capabilities의 canInvite/canReviewRequests/canManagePositions와 각 행의 직접 변경·동의 요청·self-demotion/leave/self-representative flags는 **조회 당시 가능성**이다. 제출 성공 보장이 아니며 서버가 최신 leaf·회사 잠금·version을 재검사한다. 합치기 READ_ONLY_MEMBER의 팀원 조회는 가능해도 변경 flags는 false다. 다른 조회 API의 더 강한 소속 검사를 우회 목록으로 대체하지 않는다.
- 기존 일반 구성원: actor보다 낮으면 행동 leaf/부여 부분집합으로 직접 변경 가능, 같으면 대상 동의, 높으면 금지다. 대표자 대상은 ADMIN만 동의 요청 가능하며, 비관리자의 ADMIN 승격 부여는 금지다. 일반 직급 구성원의 ADMIN 승격·대표자 지정은 ADMIN이 요청해 대상이 수락한다. 이미 소속된 대상 대표자 지정은 가입 대표자 신청/초대의 ‘현재 대표자 없음’ 제약과 구별한다.
- 마지막 활성 ADMIN의 강등/탈퇴/내보내기는 회사 잠금과 변경 전후 관리자 수로 거부한다. 대표자 해제와 ADMIN 상실은 다르다. 대표자는 같은 회사 일반 직급을 지정해 ADMIN을 유지하면서 대표자 직급만 내려놓을 수 있다. 자기 권한 축소는 현재 집합의 부분집합만 가능하며 기본 VIEWER는 유지한다. 대표자 없는 회사의 현재 ADMIN만 본인 대표자 직접 지정 경로를 갖는다.
- 직접 변경은 membership version의 `expectedVersion`을 보낸다. 동의 요청 생성은 requestKey UUID/expectedMembershipVersion/kind(POSITION·PERMISSIONS·POSITION_AND_PERMISSIONS·REMOVE)와 종류별 필드, 수락/거절·취소는 새 명시 명령의 requestKey/expectedRequestVersion을 사용한다. 다른 명령에 이 필드를 임의 일반화하지 않는다.
- 동의 요청 생성 outcome은 CREATED/REUSED/NO_CHANGE다. 대상 원 소속마다 유효 PENDING 하나, 같은 상태/내용 재요청은 재사용·새 알림 없음, 다른 내용은 명시 취소 뒤 재작성이다. PENDING은 시간 만료·자동 반영이 없다. APPLIED/REJECTED/CANCELED/INVALIDATED를 구분하고 수락 전 현재 소속을 유지한다. 대상 본인만 결정하고 현재 권한 있는 회사 담당자만 취소한다. 정당한 발행자의 퇴사/권한 상실만으로 요청을 무효화하지 않지만 대상 상태/version·제안 직급 정의 변경과 관리자 수는 수락 시 다시 검사한다. 과거 소속의 처리 결과 조회는 새 회사 자료 열람권이 아니다.
- 초대 create의 필드는 email·inviteeDisplayName·representative·positionId XOR proposedPositionName·preset/extraPermissionCodes·message다. email 변경은 기존 초대 PATCH 계약에 없고 수신자 이메일 신원은 Google 확인 이메일과 검사한다. 기존 등록 계정의 이름은 서버가 정하며 이후 임의 변경하지 않는다. 대표자 초대는 ADMIN/대표자 공석·일반 직급/preset/추가 leaf 없이 전체 ADMIN 적용이다.
- 같은 회사/이메일 PENDING 초대 하나, 이미 활성 소속·같은 회사 대기 신청·모호한 확인 이메일을 충돌로 거부한다. 일반 초대의 새 직급 제안/직급 변경은 PROFILE_EDIT, VIEWER 초과 부여는 PERMISSION_MANAGE 및 actor 부분집합이 필요하다. 수락자는 활성 소속 없음·확인 이메일 일치·회사 변경 잠금 통과가 필요하다. 새 직급 제안은 별도 직급 관리 CRUD 승인과 구분한다.
- 초대 상태 PENDING/CANCELED/EXPIRED/DECLINED/ACCEPTED와 delivery의 PENDING/SENDING/SENT/FAILED/SUPERSEDED를 구별한다. 저장 성공은 메일 발송/수신 성공이 아니다. 발송은 AFTER_COMMIT listener가 deliveryVersion을 선점해 처리한다. source에서 SENT는 메일 어댑터 호출 성공이며 실제 수신함 도착의 증명이 아니다.
- source 유효기간은7일이고 재발송은 새 token digest·deliveryVersion·now+7일로 교체한다. 이전 대기 delivery는 SUPERSEDED, 링크/핸드오프는 비공개·짧은 수명/일회성이다. Figma의 ‘5일 후 만료’는 예시이며 남은 기간은 서버 expiresAt로 계산한다. token/링크/cookie/메일 원문을 공개 모델·저장소/로그·QA/PR에 복사하지 않는다.
- **만료 경계 관찰:** 응답 mapper는 PENDING이어도 expiresAt 경과를 EXPIRED로 표시한다. update/cancel·preview/수락은 expiry service를 먼저 호출하지만 resend는 DB PENDING/current version만 확인해7일로 갱신할 수 있다. DB EXPIRED면 재발송 상태 충돌이다. 일관된 UI 노출은 D3 결정 대상이며 현재 서버 동작을 ‘만료 후 항상 가능/항상 불가’로 단정하지 않는다.
- 신청 검토 목록/상세·approval/rejection은 회사 `membership-requests` 경로다. 신청의 version과 requested/applied 값·PENDING/CANCELED/APPROVED/REJECTED 이력을 보존한다. 승인자의 PROFILE_EDIT 없이 신청 직급을 바꾸지 못하고 PERMISSION_MANAGE 없이 VIEWER를 넘지 못한다. 대표자 요청만 대표자 승인할 수 있으며 ADMIN/현재 대표자 공석·별도 일반 직급/preset/추가 leaf 없음이 필요하다. 원자 승인으로 소속 생성·다른 pending 정리, 거절은trim 후1..300자 사유와 version을 사용한다. 동시 본인 취소/이미 처리·다른 회사 소속은 재조회로 확인하며 자동 재승인하지 않는다.
- 일반 직급 이름은 trim 후 제어문자 없는1..30자·`대표자` 예약어 금지, 같은 회사 활성 이름 중복 금지다. 생성은 이름, rename은 name/expectedVersion, DELETE는 query expectedVersion을 사용한다. 이름 변경은 같은 ID를 참조하는 전 구성원에게 적용한다. 대표자 system 수정/삭제·다른 회사 직급·ACTIVE 사용중 삭제를 거부하며 soft delete 뒤 과거 참조를 보존한다. 삭제 후 같은 이름 신규 직급은 다른 ID다.
- 401/403·404·409는 빈 성공/이미 완료로 치환하지 않는다. membership CM·invitation CI·request CR·position CP·change CMC 오류군과 서버의 현재 version/상태를 확인한다. 응답 유실·timeout/5xx·손상2xx는 명시 조회로 확인하고 자동 재변경/메일 재발송을 하지 않는다. 계정·회사·화면 변경 뒤 늦은 결과/Toast·동의 자동 처리와 권한 상실 뒤 자료 재노출을 막는 것은 후속 구현/QA 기준이다.


<a id="pol-14-gate-checkpoint"></a>

## 2026-11-16 · 정책 답변 전 조사 검증 체크포인트

- 확정 가능한 사실 조사만 기록했다. D1/D2/D3는 async 질문으로 제시했고 아직 답변이 없어 Implementation Brief/채택 정책/화면 예외·DEV-27~33 기준/QA 계획의 **확정 작성은 대기**한다. 추천을 승인으로 간주하지 않는다.
- 공개 명세32경로37operation/67schema와 source의15leaf·9행/3page capabilities·미제공 필드·초대7일·직접/동의/version/직급 계약을 정적 대조했다. `python3 /tmp/mate-pol-14/check_contract.py` PASS, subset SHA256 `2892bc0b561d1e78b9ce5cd17e66f96a5a0f877f91eb17828396990c2bad0429`. 현재 업무 응답/실행 SHA·메일 수신·제품 통합 PASS가 아니다.
- `python3 /tmp/mate-pol-14/validate_docs.py` 조사4파일/로컬 링크·anchor433·79원본/114Task/156의존·고정5파일 byte/후속7원문·허용 범위/상태·민감 literal PASS, `git diff --check` PASS. source 대조로 초안 팀원 정렬을 ASC로 교정했고 검증 명령 실패/자동 수정0회다.
- Documentation Update Check: 현재 조사/차단/WBS·검토 기록과 재발한 출력 사건의 ai-failures를 갱신했다. base/architecture/data-access/harness는 package/scripts·폴더/API/mock/실행규칙·등록 설정 변화가 없어 유지한다. plan의 확정 정책 milestone과 후속DEV/QA 연결은 답변·최종 검증 뒤 기록하며 현재 상태를 중복 관리하지 않는다. baseline/coverage·모든 기존 QA/결정/차단·예외는 무변경이다.
- Review Gate: 조사 산출물의 source/범위·차단/재개 근거를 read-only verifier와 ai-review로 검토한다. Task 전체 완료 판정과 조사 기록의 문서 품질 판정을 분리하며 결과/후속 freshness는 [검토](../reviews/POL-14.md)에 추가한다.
- 다음 구체 행동: D1~D3 사용자 원문/시각 기록 → 확정 Brief/계약과 범위 한정 예외 → DEV-27~33 인계/QA 계획 → 문서 검증/두 리뷰 재실행 → 승인된 Git 전달/최종 CI·정상 병합/main FF. 그 전 다음 Task 실행·실제 업무/메일0이다.


<a id="pol-14-resume"></a>

## 2026-11-16 · 사용자 결정 대기의 재개 위치

- 체크포인트: 2026-11-16 20:57 KST, `docs/pol-14-team-policy`/시작 base `960fb14d1a38b19b7bd64942e52c4bf3da19fd8c`, 이번 조사4문서만 변경·무관한 변경0. 현재 상태는 WBS만 소유한다.
- 막힌 단계/원인: 요구사항 Gate의 D1~D3 사용자 답변 없음. 담당 결정자는 이번 대화 사용자이며 추천/시간 경과를 승인으로 간주하지 않는다. 임의 정책 확정/제품·후속 Task·실제 업무/메일·운영 실행0이다.
- 완료하지 않은 범위: 확정 Implementation Brief/정책 결정표·승인 예외, DEV-27~33의 확정 후속 기준/QA 계획·필요한 plan 연결, 최종 산출물의 문서 검사/두 리뷰와 정상 main 병합·로컬 FF. 조사 문서 검증/한정 리뷰·Draft 전달은 Task 전체 PASS가 아니다.
- 재개 첫 행동: 최신 branch/HEAD·미커밋/remote main과 이 checkpoint/이번 사용자 답변을 확인한다. D1~D3의 선택을 원문·KST 시각/결정자와 기록하고, 수정 대상·영향/검증을 다시 제시한 뒤 확정 문서만 작성한다. 기존 Git 전달/이번 Chromatic 한도 예외는 이미 승인됐으므로 다시 묻지 않는다.
- 정책/제품 범위 보존: 승인받은 경우에만 화면 예외를 해당 상태에 연결한다. POL-15는 수신 완료 목적지, DEV-33은 그 연결의 별도 Gate다. 이번 조사로 목적지/새 알림 경로를 임의 승인하거나 실제 수신/권한 변경 자원을 확보했다고 판단하지 않는다.
- 다음 별도 후보: DEV-27. P0/P1의 기존 차단, P2 앞선 회사 갱신의 DEV-08·DEV-24/26/MAT-162 조건을 보존하면 표 순서상 첫 팀원 조회 단위다. **POL-14 최종 PASS 뒤** 최신 source/Swagger·목록/상세 Figma·계정/회사/leaf/9행flags/빈·page·오류·nullable/미제공·실제 조회 QA 자원과 사용/잔존/복구 범위를 확인하는 자체 Gate가 첫 행동이다. 지금 DEV-27 조사/Brief·설계/구현·Git 전달은 시작하지 않는다.
- 전달 계획: 현재 조사 기록만 검증/리뷰한 작은 문서 커밋·Draft PR로 보존할 수 있다. D1~D3와 최종 정책 Gate 전에는 ready/merge로 진행하지 않는다. 실제 PR/head·CI 결과는 PR/종료 보고에서 확인하고 추가 문서 변경 때 freshness를 재확인한다.


<a id="pol-14-brief"></a>

## 2026-11-16 · 사용자3결정 뒤 확정 Brief와 실행 체크포인트

- 답변 수신 확인: 2026-11-16 23:01 KST, 결정자 이번 대화 사용자. D1 **“현행 계약과 동의 절차 채택 (추천)”**, D2 **“미제공 표시·행동별 안내 허용 (추천)”**, D3 **“만료 후 새 초대 작성 (추천)”**를 명시 선택했다. 이전 조사/차단·Draft PR 기록은 당시 이력으로 보존하며 새 결정으로 요구사항 Gate를 해소한다. 이전 최종 보고의 ‘Git 승인을 다시 요청’은 오기로 정정한다. Git 전달 승인은 최초 요청부터 유효하며 반복 승인받지 않는다.
- Git 재개: `docs/pol-14-team-policy`/`3538b5fc3305eedcc511515f09d720cf1f17a8d0`, local/remote branch 동일·작업트리 clean, `git fetch origin main` 뒤 local/remote main `960fb14d1a38b19b7bd64942e52c4bf3da19fd8c` 동일. [Draft PR #83](https://github.com/mate-pjt/mate-frontend/pull/83)·type: docs·2개 조사 커밋을 보존한다. backend dev/중앙 main 재조회 SHA는 최초 조사와 같다.
- 요구사항/유형: POL-14 하나의 정책 결정·문서 작업이다. T01~T04의 권한/동의/최후 관리자·초대/합류/직급 계약과 D2/D3 한정 화면 기준을 확정하고 후속 DEV/QA의 소유·완료/재개 조건을 연결한다.
- 성공 기준: 3결정 원문/결정자·확인시각과 고정 source·게시 명세/실행 미확인 구별, 행동별 권한/회사·계정/상태·version·충돌·정보 최소화, frame/상태별 예외 범위, DEV-27~33 소유·QA 계획/기존 차단 보존, 문서 검사/Documentation Update Check·최종 두 리뷰 PASS. 정책 완료와 제품·실제 통합·Git 전달을 구분한다.
- In scope/수정 파일: 이 Task·WBS·`reviews/POL-14.md`, `DEV-27.md`~`DEV-33.md`의 인계 append, `docs/qa/team-members.md`·QA README, ai-context plan의 날짜별 연결. 앞선 조사에서 기록한 ai-failures는 이력으로 유지한다.
- Out of scope: src/public/tests·Repository/DTO/mock/API 데이터 흐름의 구현·라이브러리/설정, backend/중앙 문서 편집, POL-15 목적지·POL-16 합치기·POL-18 서비스 탈퇴 결정, 실제 업무 조회/변경·초대/메일/직급·문서 처리·운영/배포·다음 Task 실행. 이번 사용자3선택은 제품 구현·QA 자원/실행·로컬 선행 예외를 승인하지 않는다.
- 확인한 파일/패턴: AGENTS·feature-workflow/ai-review/context-audit·verifier·WBS/workflow/task-cycle/DOC-001·baseline/coverage·ai-context6문서와 package.json, my-side-menu/company contracts/client/auth contracts·현재 routes, 고정 중앙 정책/backend29 source 링크·개발 OpenAPI32경로37operation/67schema·Figma12frame metadata, QA index/template·QA-08의 기존 초대 차단. 상태는 WBS만 소유하고 task append/QA 사례로 증거를 이어가는 기존 패턴을 따른다.
- 가정: 기존 source의 유효 leaf/catalog·version/멱등 계약을 그대로 따르고 미래 endpoint·필드를 만들지 않는다. 새 route/동의 요청 상세 시각 설계·반응형 시안은 후속 자체 Gate이며 D2/D3를 화면 전체 예외로 확대하지 않는다. 현재 정책 문서에 남은 blocking ambiguity 없음.
- 단계/영향: 확정 결정·정책 v1 → 후속7Task의 소유/완료/차단과 TEAM QA26 연결 → 문서/계약 구조 검사·Context Audit → ai-review·read-only verifier → 종료/WBS·다음 DEV-27 인계 뒤 freshness → 목적별 docs 커밋/PR 최종 head CI·정상 merge commit/main FF. 제품 런타임 영향 없음.
- 위험/검증: role/직급 권한 유추, 대표자 system 직급과 본인 소속 변경 혼동, 동의 생성과 적용·초대 저장과 메일 수신 혼동, 만료 DB 경합·과거 QA 예외 확대를 막는다. `python3 /tmp/mate-pol-14/validate_docs.py`, `python3 /tmp/mate-pol-14/check_contract.py`, `git diff --check`와 변경범위/원본·후속 원문·상태/의존/79개 커버리지·Markdown·민감 literal을 검사한다. package.json의8scripts는 변하지 않았다. 문서 전용이라 로컬 앱 test/lint/build/Storybook·제품 브라우저/mock/HTTP대역·실제 업무 통합은 미실행하며 원격 CI는 실제 최종 head에서 따로 확인한다.

<a id="pol-14-contract"></a>

## 확정 정책 v1 · 2026-11-16

위 [현행 조사](#pol-14-investigation)의 고정 source/계약 관찰을 **D1의 후속 개발 기준**으로 채택한다. 그 안의 ‘확정 전/답변 대기’는 앞선 시점 이력이다. 아래 표의 새 결정과 화면 예외를 함께 적용하며, 새 source/명세 변경은 후속 Gate에서 다시 확인한다.

| 결정 | 확정 내용·근거 | 한계/후속 소유 |
| --- | --- | --- |
| D1 | 사용자 원문 ‘현행 계약과 동의 절차 채택 (추천)’. 15leaf/최소2·preset/계산 role, 현재 capabilities·직접/동의/금지·최후 관리자·회사/계정 범위와 source의 초대/합류/직급/version 계약 채택 | 동의 요청 생성/조회·본인 수락/거절·회사 취소·충돌·직접 변경/적용 구분은 DEV-28 기준에 포함. backend·실제 통합이 이번에 완료됐다는 판정 아님 |
| D2 | 사용자 원문 ‘미제공 표시·행동별 안내 허용 (추천)’. 상세 생년월일·전화번호의 자리/라벨 유지, 값은 **미제공**. 대표자 일괄 변경 불가 문구·버튼은 현재 직접 변경/대상 동의/금지 조건에 맞춤 | 아래 frame/상태에 한정된 명시 화면 예외. 개인정보 추론·입력/조회 API 신설, 상세 전체 재설계·대표자 권한 제한 해제 승인 아님 |
| D3 | 사용자 원문 ‘만료 후 새 초대 작성 (추천)’. **미만료 PENDING만** 기존 재발송/취소, expiresAt 경과·EXPIRED에는 해당 명령을 제공하지 않고 **새 초대 작성** 안내 | DB PENDING 잔존/재발송 가능 창을 UI가 사용하지 않음. 새 초대는 명시 입력/제출 후 현재 서버 권한·중복 검사. 자동 재발송/취소·새 생성 없음, backend 상태/만료 규칙 변경 아님 |

### 행동별 권한·소속과 최후 관리자

- API 허용 원천은 같은 회사 ACTIVE 소속의 현재 leaf다. category는 탐색, preset은 선택 시작점, role은 실제 집합에서 계산한 요약이다. ADMIN=현재 전체15leaf, AGENT=두 조회+회사정보3leaf, VIEWER=두 조회이며 유효 집합은 최소2개를 포함한다. VIEWER/AGENT의 추가 직원관리 leaf를 role 이름으로 막거나 다른 행동까지 허용하지 않는다.
- 각 행동의 필요 leaf·부여 집합의 actor 부분집합, 대상보다 높은/같은/낮은 등급, 대표자, 본인 조건을 함께 적용한다. 서버 capabilities는 진입 안내이며 최종 제출 시 현재 권한/version·회사 변경 잠금·관리자 수를 재검사한다. READ_ONLY_MEMBER 등 읽기 가능/변경 금지를 보존하고 프론트 UI를 서버 보안 검사로 대신하지 않는다.
- 일반 타인: 낮은 대상은 직접 변경 가능, 같은 대상은 동의, 높은 대상은 금지다. 일반 비관리자의 ADMIN 승격·대표자 지정을 ADMIN이 요청해도 대상 수락 전 적용되지 않는다. 대표자 대상은 ADMIN만 동의 요청할 수 있다. 자신은 별도 self-demotion/leave·대표자 공석 시 본인 취임 계약을 사용한다.
- 대표자 **system 직급 정의의 이름 변경/삭제 불가**와 대표자 **소속의 동의 변경/본인 해제**는 다르다. 대표자는 같은 회사 일반 직급을 지정해 ADMIN을 유지하며 직급만 해제할 수 있고, 마지막 ADMIN이어도 이 해제는 가능하다. ADMIN까지 줄이거나 소속을 끝내면 다른 유효 활성 ADMIN이 남아야 한다. 합치기 미반영/거절 대상 등을 단순 ACTIVE 행/표시 이름만으로 관리자 수에 포함하지 않는 중앙 불변식을 따른다.
- 목록/상세·권한은 회사/계정/소속 ID·version 문맥을 유지한다. 계정/회사/화면·권한 상실 뒤 이전 응답/선택/Toast를 재사용하지 않으며 과거 소속의 본인 변경 결과 열람을 현재 회사 전체 조회 권한으로 확대하지 않는다.

### 직접 변경·대상 동의·정보 최소화

- membership 직접 변경은 각 endpoint의 expectedVersion, 동의 생성은 requestKey UUID/expectedMembershipVersion/kind와 종류별 필드, 결정·취소는 requestKey/expectedRequestVersion을 그대로 사용한다. 상태 변경에 보편적 새 expectedVersion·멱등 header를 추가하지 않는다.
- 동의 outcome CREATED/REUSED/NO_CHANGE를 구분한다. 유효 대상별 PENDING 하나·같은 내용 재사용/알림 중복 없음, 다른 제안은 기존 요청 명시 취소 뒤 작성한다. PENDING은 **시간 만료·무응답 자동 적용 없음**, 대상 본인만 수락/거절, 현재 자격 있는 회사 담당자만 취소한다. 정당한 발행자의 퇴사/권한 상실만으로 폐기하지 않되 target/version·직급 정의 변화·관리자 불변식은 다시 검사한다.
- 최종 APPLIED와 REJECTED/CANCELED/INVALIDATED, 직접 명령 성공/동의 요청 생성/이미 동일 상태를 별도 안내한다. source에 있는 409/no-change/replay 의미를 일반 성공으로 뭉개지 않는다. timeout/연결/5xx·손상2xx는 명시 조회로 상태를 확인하고 자동 재변경/동의/발송하지 않는다.
- 팀원 편집은 회사 소속의 직급/권한·정의된 관리 행동이다. 계정 이름·이메일·생일/전화 같은 개인 프로필을 대신 수정하지 않는다. nullable 이름/이미지/lastLoginAt은 결측 그대로 구분하고 타 개인정보로 합성하지 않는다. D2의 ‘미제공’은 미연결값의 고정 표시이며 서버의 빈 문자열/임의 날짜로 저장하지 않는다.
- 동의 요청 상세/결정의 구체 route·알림 actionPath allowlist/대상 재검증 연결은 DEV-28의 자체 UI·안전 경로 Gate에서 제시한다. 현재 POL-04 allowlist에 없는 경로를 정책 채택만으로 허용하지 않으며 알림 읽음/클릭을 수락으로 처리하지 않는다. 완료 목적지 POL-15/DEV-33와 회사 간 합치기 POL-16은 별도다.

### 초대·합류·직급의 확정 경계

- 일반 초대/승인은 기존 활성 일반 직급 또는 새 직급 이름 한 가지, VIEWER 초과 권한은 추가 leaf·부분집합, 직급 제안/변경은 source의 PROFILE_EDIT 조건을 따른다. 대표자 가입 초대/승인은 ADMIN·대표자 공석·대표자 요청 여부·별도 일반 직급/preset/추가 leaf 없음 조건이며 기존 구성원 대표자 지정과 구분한다.
- 같은 회사/확인 이메일의 PENDING 중복, 활성 소속·같은 회사 대기 신청·모호한 확인 이메일, 수신자 Google 확인 이메일 불일치·회사 변경 잠금을 현재 오류로 처리한다. 초대 PATCH로 이메일을 바꾸거나 등록 계정 이름을 임의 덮어쓰지 않는다.
- 초대7일은 source 유효기간이며 UI는 실제 expiresAt/status를 사용한다. 미만료 PENDING 재발송은 새 링크·deliveryVersion·만료를 만들고 구 대기 발송은 SUPERSEDED다. 수신의 짧은 수명/일회성 handoff와 비공개 token/링크를 저장소·로그/QA/PR에 남기지 않는다. D3는 만료 DB 확정 전후 차이와 관계없이 UI에서 만료된 기존 초대 관리 명령을 막는 기준이다. 단말 시계/요청 중 만료 경합의 표시와 최종 서버 거부도 DEV-30에서 확인한다.
- 초대 상태와 delivery PENDING/SENDING/SENT/FAILED/SUPERSEDED는 별개다. 생성/재발송 명령 성공·메일 어댑터 전송 성공·실제 수신함 도착/수락을 각각 확인한다. 실패·응답 유실 뒤 자동 새 초대/재발송은 없고 상태/최신 version 조회 뒤 명시 행동이다.
- 신청 검토는 REVIEW leaf이며 requested/applied 직급·권한과 PENDING/CANCELED/APPROVED/REJECTED 이력을 보존한다. 승인 권한/직급 수정/VIEWER 초과/대표자 제약과 계정/회사 잠금·동시 취소/이미 처리·승인 소속 생성/다른 pending 정리를 검증한다. 거절은 trim 후1..300자 사유다. 가입 초대/신청과 이미 소속된 구성원의 동의 요청을 섞지 않는다.
- 직급은 회사 공용 ID다. 이름은 trim 후1..30자·제어문자/대표자 예약어/활성 중복을 거부한다. rename은 해당 ID의 모든 참조에 반영, system 정의 수정/삭제·ACTIVE 사용중 삭제/다른 회사 직급은 거부한다. rename/삭제는 현재 version, soft delete는 과거 이력 보존이며 같은 이름 신규 ID는 과거 직급 복구가 아니다. 신청/초대의 새 직급 제안과 POSITION_MANAGE CRUD 권한은 서로 다르다.

### Figma frame·상태와 명시 예외

| frame/상태 | 대조한 기준·후속 책임 | 승인/한계 |
| --- | --- | --- |
| [3137:52702](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52702) 팀원 목록 | 목록·역할/직급/가입·최근 로그인과 ACTIVE 서버 목록은 DEV-27, 보낸 초대/받은 신청은 DEV-29/31 소유 | 역할/직급 권한 유추 금지는 D1의 기능 기준. 화면 전체 예외/후속 카드 삭제 승인 없음 |
| [3137:53331](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53331)·[3137:54225](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-54225) 상세 | DEV-27은 생년월일/전화 자리·라벨 유지/미제공. DEV-28은 대표자 일괄 금지 안내를 해당 행동별 직접/동의/금지로 교정 | **D2의 명시 한정 화면 예외**. 대표자 system 정의 보호·현재 leaf/최후 관리자 규칙은 유지 |
| [3137:52847](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52847)·[3137:52911](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52911)·[3137:52990](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52990) 초대/재발송/취소 | DEV-29/30은 미만료 PENDING과 실제 expiresAt·delivery 상태. 만료는 새 초대 작성 안내 | D3는 만료 상태 행동 기준. Figma ‘5일 후 만료’ 예시를 고정하지 않으며 초대/취소 화면 전체 시각 예외는 없음 |
| [3137:53069](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53069)·[3137:53154](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53154)·[3137:53193](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53193) 합류/검토/거절 | DEV-31은 신청 상태·요청/실제 승인값·직급/leaf·대표자·거절 사유와 동시 처리 구분 | D1 채택·별도 화면 전체 예외 없음 |
| [3137:53220](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53220)·[3137:53254](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53254)·[3137:53288](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53288) 직급 관리/추가 | DEV-32는 공유 직급·system 정의와 사용중 삭제/version·중복을 구별 | 기존 보호 문구와 D1을 유지. system 정의 보호를 대표자 소속 일괄 변경 금지로 확대하지 않음 |

Figma 조사 범위는 위12frame metadata/상태·라벨이다. 모든 child/prototype·pixel 검증을 한 것은 아니다. 미표현 loading/empty/error·동의 제안/결정 화면과 새 route는 후속 자체 Gate에서 실제 node/state·기능 기준과 연결한다. D2/D3를 그 전체 화면의 포괄 예외로 사용하지 않는다.

<a id="pol-14-handoff"></a>

## 후속 개발/QA의 소유와 재개 기준

| 소유 | 확정 인계 기준 | 검증/실행 Gate |
| --- | --- | --- |
| DEV-27 | ACTIVE 목록/상세·현재 company/leaf/catalog·서버 page/count/ASC·nullable·D2 미제공/페이지·행 capabilities. 관리 포트/메뉴 연결과 상태별 접근을 같은 company 공급원으로 설계 | TEAM-01~04/23/26. 실제 조회 계정·회사/실행 대응·승인 범위, Figma 상태·원격 계약을 자체 Brief에서 확인 |
| DEV-28 | 타인 직급/전체 leaf·직접/동의/금지, self-demotion/대표자 취임·소속 종료의 현재 계약/마지막 관리자, 요청 생성/조회/수락·거절/취소/무효/동시성·알림 안전 경로의 기준. 서비스 계정 탈퇴와 구분 | TEAM-05~10/23/25/26. target 동의·현재 소속/version/직급 변경·관리자 경쟁·멱등/no-change·actual QA 변경/잔존/복구 자원 필수 |
| DEV-29 | 일반/대표자 초대 입력·검증/서버 제약, 보내는 목록/상세·page/count·명령/메일 상태·수신 연결·비밀 링크 비노출 | TEAM-11~13/16~17/23/26. 수신처/메일함·회사/계정·변경/소비/잔존/복구·서버 실행 대응 확보 전 실제 발송 없음 |
| DEV-30 | 미만료 PENDING 재발송/취소·새 version/링크/만료·delivery 구분·D3 만료 후 새 초대 작성. 생성은 DEV-29 흐름 재사용 | TEAM-14~17/23/26. 만료 DB 경합/수락 경쟁·이전 링크/시간·응답 유실·서버 거부 검증 |
| DEV-31 | 신청 목록/상세·현재 REVIEW/편집/부여 제약·대표자·최신 version 승인/사유 거절·취소/다른 회사 가입 경합·소속/상태 재조회 | TEAM-18~20/23/26. reviewer/신청자/합성 신청·변경/복구/실행 대응과 기존 AUTH/QA-05 차단 유지 |
| DEV-32 | 같은 회사 공유 직급 목록/생성/이름 변경/미사용 삭제·system불가·사용중/중복/다른 회사·현재 version/soft delete와 과거 참조 | TEAM-21~23/26. disposable 일반 직급/참조 소속·권한·변경/잔존/복구 범위 필수 |
| DEV-33 | POL-15에서 별도로 결정할 수락 완료 목적지/폴백·계정/회사/현재 권한·안전 복귀, DEV-27 실제 화면에 연결 | TEAM-24/23 및 기존 AUTH-16/17. POL-15·DEV-27 선행 전 목적지 변경/구현 없음 |

공통: [TEAM26 미실행 계획](../../../qa/team-members.md#pol-14-team-qa)은 원본 QA-08 AUTH-16의0통과1차단·초대 AUTH-17 미실행과 다른 회사/가입·문서/DEV-08/MAT-162 차단을 대체하지 않는다. 7개 공급원·static qna/immutable snapshot·HTTP/DTO 경계·운영 mock guard/탭 격리는 그대로이며 새 팀원 공급원·fallback·실제 데이터의 mock 복사는 없다. 모든 후속 Task는 자신의 Brief/수정 파일·검증/실제 자원 Gate가 필요하며 이번 정책/Git/Chromatic 예외로 로컬 선행·통합 면제를 받지 않는다.


<a id="pol-14-verification"></a>

## 2026-11-16 · 확정 정책 검증 체크포인트

- 사용자3결정 뒤 source branch를 다시 확인했고 backend `adc0e265…`/중앙 `c9e50ff…`는 조사 때와 같다. 개발 OpenAPI GET200·3.1.0/v1을 다시 받았으며 전체 원문 SHA256 `85b38b6e43ad45807a1d8c66153767c53876220dbf84852cbc4fa53d832917ba`는 앞선 기록과 동일하다. 실행 프로세스/실제 업무 응답을 증명한 것은 아니다.
- `python3 /tmp/mate-pol-14/validate_docs.py` PASS: 확정 정책/후속 기준·QA를 포함한 변경14파일·로컬 링크/anchor615·원본79/Task114/의존156·고정5파일 byte/후속7원문·상태/순환/허용 범위·민감 literal. `python3 /tmp/mate-pol-14/check_contract.py` PASS:32경로37operation/67schema·15leaf/행9/page3·지원/미지원 필드·정렬/version 구조. `git diff --check` PASS.
- 정책/QA 추가 검사: 이전 Aside 세션 경로를 가정해 새 파일 존재 assertion 실패 → 새 세션 반환 경로로 수정했으나 이전 원문 파일도 사라져 FileNotFoundError → 현재 원문을 작업 증거 폴더에 복사하고 **Task에 보존한 기존 SHA256**과 비교해 PASS. 이 경로 검사 자동 수정2/3·세 번째 실행 성공이며 앱/정책 계약 실패가 아니다. 첫 두 실패를 지우거나 통과로 세지 않는다.
- `python3 /tmp/mate-pol-14/check_policy.py` PASS: OpenAPI 지문 무변경·D1~D3 원문3개/후속7연결·TEAM-01~26 연속/유일·26미실행 대기·실제 통과0. 앞으로 임시 세션 경로를 다시 찾지 않고 `/tmp/mate-pol-14/confirmed-openapi.json`과 기록 지문으로 검증한다.
- 로컬 앱 test/lint/build/Storybook·제품/브라우저/mock/HTTP대역·실제 업무/메일·권한/직급·운영/배포0. 문서 전용 검증 대체 규칙으로 영향 없는 앱 검사는 생략하며 실제 QA26은 대기/실행 Gate 미확보다. 조사 head의 이전 원격 CI 성공과 앞으로 바뀔 최종 PR head의 CI 결과를 구별한다.
- Documentation Update Check: WBS/Task·후속7기록·QA 계획/색인·plan의 날짜별 정책 연결·검토/실패 기록을 갱신했다. base/architecture/data-access/harness는 실행/의존성·폴더/API/mock/DTO 규칙·하네스 설정 변화가 없어 유지한다. 원본79/114Task/156의존·baseline/coverage·모든 기존 QA/결정/차단·승인 예외는 보존했다.
- 다음 행동: 확정 전체 diff의 Context Audit·자체 ai-review·read-only verifier → 종료/WBS/DEV-27 인계 → 문서/freshness 재검토 → 목적별 commit/push·PR #83 본문/ready·최종 head CI/리뷰·정상 merge/main FF. 다음 Task의 조사/설계/구현·실제 업무는 시작하지 않는다.


<a id="pol-14-close"></a>

## 2026-11-16 · 정책 문서 단위 종료와 DEV-27 선정/인계

- 종료 기록 확인: 2026-11-16 23:10 KST. 사용자3선택의 정책 v1·행동별 권한/회사·계정·최후 관리자/직접·대상 동의·초대/합류/직급·version/충돌, D2 한정 화면 예외·D3 만료 후 새 초대, 후속7Task 기준·TEAM26 계획을 문서로 확정했다. 원래4개 완료 기준을 이 단위의 증거로 닫는다. 상태는 WBS만 소유한다.
- 확정 산출물 검사:14문서/로컬621링크·79원본/114Task/156의존·고정5/후속7·문서/계약/정책 QA 검사·diff-check와 Context Audit·여섯 섹션 ai-review·독립 verifier PASS, 미해결 Blocker/Major/Minor0. 이전 조사 한정 리뷰·정책 대기/두 실패/교정 이력은 보존한다. 이 종료/WBS/DEV-27 선정 metadata 뒤 문서 검사와 두 리뷰 freshness를 다시 확인한다.
- 판정 경계: 정책/문서·QA 계획 단위 PASS다. **제품/Repository/UI 구현·실제 업무/API/메일·권한/직급·문서 처리·운영/배포0**, TEAM 실제0통과26대기/실행 Gate 미확보다. source/게시 명세·배포 기록을 실행 SHA/업무 응답·실제 통합 PASS로 올리지 않는다. 기존 QA-08 AUTH-16 0통과1차단·초대 AUTH-17 미실행, 가입/회사/문서·DEV-08/MAT-162/타Task 차단과 예외는 유지한다.
- Documentation Update Check 완료: WBS/Task·후속7기록·TEAM QA/index·plan 날짜별 연결·검토/실패 기록을 갱신했다. package/scripts·폴더/API/mock/DTO 규칙·하네스 설정 변화가 없어 base/architecture/data-access/harness는 유지했다. 원본/coverage/기준선과 후속7기록의 기존 원문·모든 이전 QA를 보존했다.
- Git 전달은 같은 [PR #83](https://github.com/mate-pjt/mate-frontend/pull/83)으로 이어간다. 초기2개 조사 커밋을 보존하고 정책·QA 계획·검증/인계·증거 경로 실패 기록을 목적별 docs 커밋으로 분리한다. 실제 최종 head의 CI/리뷰/병합 조건·Chromatic 한도 예외와 정상 merge commit/main FF·local/remote SHA/clean은 최종 PR/종료 보고에서 별도 확인한다. 이 정책 PASS가 Git 전달 완료 선언은 아니다.
- 다음 하나: [DEV-27 인계](DEV-27.md#dev-27-pol-14-selection). WBS의 기존 P0/P1 차단/대기 선행과 앞선 P2 회사 갱신 DEV-08·DEV-24/26/MAT-162 조건을 유지한 채, POL-14 선행을 충족하는 P2 기본 표 순서 첫 독립 개발 단위다. 정책 완료/이번 Git 예외를 실제 자원 준비·로컬 선행 승인으로 해석하지 않는다.
- 다음 첫 행동: 새 대화에서 최신 main/이 정책·DEV-27 후보 정의/TEAM-01~04/23/26과 당시 현행 backend/Swagger·Figma 목록/상세 상태를 확인한다. 현재 회사/leaf/3page·9row flags·page/count/ASC·nullable/D2 미제공·계정/회사 수명·실제 조회 자원/실행 대응·사용/잔존/복구 범위를 확인한 뒤 자체 Brief·수정 파일·영향·검증을 먼저 제시한다. **선정/인계만 했으며 DEV-27의 전용 조사·Brief/설계·구현·실제 QA·별도 Git 전달은 시작하지 않는다.**


<a id="pol-14-mat-290-handoff"></a>

## 2026-11-17 · MAT-290 외부 요청과 표시 기준의 후속 연결

### 이번 문서 단위 Brief·승인/체크포인트

- 확인 시각: 2026-11-17 08:58 KST. 시작 `main`/`1d93ebc426fbd8618023fce69630c23a2f46ff40`, clean·기존 변경0. fetch 뒤 local/remote main 동일, 같은 후속 브랜치 없음 확인 뒤 `docs/pol-14-mat-290-handoff` 생성. PR #83의 POL-14 확정 정책·6개 커밋·main 반영을 보존한다.
- 사용자2026-11-17 요청: MAT-290을 POL-14·DEV-27·WBS에 연결하고, API 반영 전 **미제공 유지**와 반영 후 재확인 조건을 기록한다. 문서 검증·리뷰·목적별 commit/push·PR·최종 CI·정상 main 병합/로컬 FF까지 이번 후속 범위로 명시 승인했으며 **DEV-27 구현은 시작하지 않는다**.
- 요구사항/성공 기준: 외부 요청의 필드·대상/현재 확인 수준을 승인·지원 계약과 구분, D2 유지/해제 재검토와 실제 자원·회귀 기준, WBS/DEV-27 상호 연결·선행/상태/QA 보존, 문서 검증/Documentation Update Check·두 리뷰와 최종 Git 전달. 이번 단위는 하나의 문서 후속 작업이며 제품 기능이 아니다.
- 수정/영향/단계: 이 기록·DEV-27·WBS·기존 reviews/POL-14.md만 갱신 → 문서 검사 → ai-review/read-only verifier → 종료 metadata/freshness → 목적별 docs 커밋/PR·최종 head CI·정상 merge/main FF. runtime/package/구조·DTO/Repository/mock·backend/Linear 이슈 수정·실제 업무/API/메일·운영/배포·DEV-27 조사/Brief·설계/구현은 제외한다.
- 가정/위험: 요청 등록·이슈 Done·계정 모델의 필드 존재·source/Swagger 확인을 팀원 API 지원/배포·실제 응답 PASS로 바꾸지 않는다. 기존 D1~D3/79원본/114Task/156의존·모든 QA/차단/예외를 보존한다. 문서 연결에 blocking ambiguity 없음. 상태는 WBS만 소유한다.
- 검증: 현재 package.json8scripts 확인. 문서 전용이므로 로컬 앱 test/lint/build/Storybook·브라우저/mock/HTTP대역·업무 API 통합은 미실행, 링크/anchor·79/114/156·상태/의존·기준선/기존 원문·허용 범위/Markdown/민감 literal·diff-check와 두 리뷰를 수행한다. 원격 CI는 새 최종 head에서 별도 확인한다.
- Git 전달 승인과 예외: 이번 문서/Git 전달은 위11/17 요청이 근거다. 동일 POL-14 대화의 최초 사용자 원문 ‘현재 Chromatic 월간 한도 … 관련 문제가 생기면 예외 처리로 하고 그냥 병합’은 이 문서 후속에도 유지하며, 실제 billed snapshot 한도 관련 검사만 예외로 확인한다. 앞선 PR의 검사 결과를 새 head의 결과로 재사용하거나 다른 CI/실제 QA·Task로 확대하지 않는다.

### 외부 요청의 사실과 범위

- [MAT-290](https://linear.app/mate-pjt/issue/MAT-290/backend-팀원-목록상세-응답에-생년월일휴대전화번호-추가), ‘backend: 팀원 목록·상세 응답에 생년월일·휴대전화번호 추가’. 위 시각 조회 결과 **Backlog**, 프로젝트 Mate MVP - 공고 추천 1차·repo:mate-backend/Feature다. 이는 외부 이슈의 당시 조회값이며 최신 진행/답변·계약/배포 완료를 보장하지 않는다.
- 대상은 `GET /api/v1/companies/{companyId}/members`의 `data.content[]`와 `GET /api/v1/companies/{companyId}/members/{membershipId}`의 `data`, 공통 CompanyTeamMemberResponse다. 요청은 기존 계정/가입 모델의 개인 선택 입력 **birthDate/mobilePhone**을 팀원 조회에 연결하는 것이다. 회사 대표 전화번호·본인인증/복구 수단·신규 정보 수집 API와 구별한다.
- 요청안: birthDate는 nullable `YYYY-MM-DD` 날짜 문자열, mobilePhone은 nullable 문자열/기존 계정 표현·검증 규칙 재사용, 미등록은 각각 null. 목록/상세 일치·조회 권한/회사 범위·기존 page/count/정렬/capabilities/오류 유지·OpenAPI/wire 정합·테스트와 관련 PR/commit·개발 반영 결과 회신을 요청했다. **필드명/형식/nullable·직렬화/열람 범위의 최종 팀원 API 계약은 실제 백엔드 답변과 반영 근거로 확인할 대상**이다.
- 이 요청/계정 모델의 필드 존재는 팀원 응답 지원·서버 배포·현재 업무 응답의 증거가 아니다. 이번에는 Linear를 읽어 연결만 했으며 새 source/Swagger/업무 API 반영을 검증하지 않았다. MAT-287의 회사 프로필 편집/사진 요청·다른 Task 계약은 별개다.

### API 반영 전 유지 기준

- [D2](#pol-14-contract)의 생년월일·휴대전화번호 **자리/라벨 유지·값 ‘미제공’**을 유지한다. MAT-290 생성/접수·진행/완료 표시나 계정 모델 필드만으로 예외를 해제하거나 임의 데이터/새 API로 값을 합성하지 않는다.
- MAT-290을 DEV-27 전체의 신규 선행/차단으로 추가하지 않는다. DEV-27은 기존 D2와 자체 Gate를 유지하고, **실제 값 표시 연결**만 아래 재확인 뒤 자신의 범위/검증 계획에서 판단한다. 이번 문서 반영으로 DEV-27을 시작하거나 로컬 선행·실제 QA 면제를 승인하지 않는다.

### 반영 소식 뒤 재확인·표시 연결 Gate

1. MAT-290의 답변/확정 계약·일정·연결 PR/commit을 확인한다. 두 endpoint의 공통 팀원 DTO/조회·mapper/테스트에 필드가 실제 연결됐는지 **고정 source**에서 확인하고 계정/가입 모델만의 존재로 대신하지 않는다.
2. source commit, CI/개발 배포 기록, 게시 Swagger, 실행 식별자, 실제 팀원 응답을 분리해 날짜/환경·확인/미확인을 기록한다. source merge/이슈 Done/Swagger 필드가 실제 서버 반영/통합 PASS를 대신하지 않는다.
3. 최종 필드명·경로·타입·날짜 전용/휴대전화 문자열 형식·각각 nullable/누락 직렬화·열람 권한/회사 범위, 기존 wrapper/오류·page/count/정렬/capabilities 유지 여부를 비교한다. 일부 필드/endpoint만 준비됐으면 부분 지원으로 기록하고 미확인 부분의 ‘미제공’을 유지한다.
4. 실제 조회 검증은 승인된 합성 회사/계정·열람/개인정보 범위·Origin/실행 대응·사용/잔존/복구 자원을 확보한 후 수행한다. 값 있음/한쪽 null/둘 다 null, 같은 팀원의 목록·상세 일치, 날짜 이동/휴대전화 앞자리0·계정/회사 전환·권한 거부/오류를 확인한다. 실제 개인정보/응답 원문을 Task/로그/캡처에 남기지 않는다. 미실행은 PASS로 세지 않는다.
5. 확인 근거를 갖춘 뒤 **DEV-27 자체 Brief/수정 파일·영향/검증 Gate에서 실제 값 표시 연결 범위를 판단**한다. 검증된 데이터가 없는 항목은 미제공 유지, null의 화면 처리·Figma 표시/접근성·모바일·수명/회귀 기준을 해당 Task/QA에서 명시한다. 이번 후속 문서만으로 D2의 실제 UI 예외를 해제하거나 제품을 활성화하지 않는다.

- [DEV-27 연결](DEV-27.md#dev-27-mat-290-handoff)·[WBS](../README.md)·[검토](../reviews/POL-14.md#pol-14-mat-290-review). TEAM-03의 당시 미제공 계획과 TEAM26 실제0통과26대기·AUTH-16/17 및 다른 QA/차단·승인 예외는 보존한다. 실제 지원/표시 연결 검증은 재개한 개발 Task가 해당 QA에 이어 기록한다.

### 문서 후속 단위 종료·검증 체크포인트

- 2026-11-17 09:03 KST: MAT-290 요청·D2 미제공 유지·반영 뒤 단계별 재확인/DEV-27 자체 Gate를 4문서에 연결했다. 문서 단위 PASS이며 backend 반영·제품 구현·실제 API 통합 PASS가 아니다. 상태는 WBS에서 POL-14 완료/현재 없음, DEV-27 준비로 관리한다.
- `python3 /tmp/mate-mat290-docs/validate.py`·`git diff --check` PASS: 변경4문서/로컬 링크462·Markdown 표257행·원본79/Task114/의존156·고정6파일 byte/기존3기록 원문 보존·TEAM26 실제 대기26. 종료 metadata 뒤 같은 검사를 다시 실행하고 결과는 검토 기록에 보존한다.
- Documentation Update Check·여섯 섹션 ai-review·read-only verifier PASS, 미해결 Blocker/Major/Minor0. package8scripts/실행·구조/DTO/mock/하네스 변화가 없어 공통 context·baseline/coverage·QA 원문은 유지한다. 로컬 앱/브라우저·mock/HTTP대역·실제 API는 문서 전용 사유로 미실행이며 미실행을 PASS로 세지 않는다.
- 종료 metadata 뒤 문서 검사/리뷰 freshness → 목적별 docs 커밋·새 PR·최종 head 원격 CI/리뷰·동일 Task Chromatic 한도 원인 확인·정상 merge/main FF를 계속한다. 실제 커밋/PR/CI·병합 SHA/clean은 최종 PR과 종료 보고의 별도 Git 전달 증거로 남긴다.
- 다음 하나는 기존 선정 DEV-27을 유지한다. WBS P2 기본 순서·POL-14 선행 충족과 기존 P0/P1·앞선 P2 차단을 보존한 선정이며 MAT-290을 전체 신규 선행으로 추가하지 않는다. 다음 첫 행동은 최신 main·MAT-290 현행 답변/지원·POL-14/TEAM 계획과 자체 Brief/수정·검증 Gate 확인이다. **이번에는 DEV-27 전용 조사·설계·구현·실제 QA를 시작하지 않았다.**

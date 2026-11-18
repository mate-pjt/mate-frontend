# DEV-32 · 회사 직급 목록·추가·관리

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: T04
- 선행 작업: [DEV-27](DEV-27.md)
- 목적/범위: 가입 중 자유 입력과 구분된 회사 직급 관리 기능을 구현한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### T04 · 직급 목록·추가·관리
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **프론트 계약 없음**. 검증: 코드 대조.
- 남은 점: 가입 중 직급 입력과 별도의 회사 직급 관리
- Figma: [3137:53220](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53220) / [3137:53254](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53254) / [3137:53288](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53288)
- 소유 소스/기존 기록: [src/components/my/my-side-menu.tsx:12](../../../../src/components/my/my-side-menu.tsx)、[src/data/company/contracts.ts:199](../../../../src/data/company/contracts.ts)

## 완료 기준

- [ ] 이름 중복/길이·추가/수정·사용 중 직급의 삭제 허용 정책을 확인한다
- [ ] 권한/충돌·팀원/초대의 직급 참조·실패/재조회를 검증한다
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


<a id="dev-32-pol-14-handoff"></a>

## 2026-11-16 · POL-14 확정 정책/계약 인계

- 인계 근거: [POL-14 D1·v1](POL-14.md#pol-14-contract). 원본 T04의 회사 공용 일반 직급 목록/생성·이름 변경/미사용 삭제다. 가입·초대의 새 직급 제안과 관리 CRUD의 별도 권한을 구별한다.
- 확정 완료 기준: 조회 LIST_VIEW, 변경 POSITION_MANAGE·회사 범위와 현재 version. 이름은 trim 후1..30자·제어문자/대표자 예약어/활성 중복 금지, 대표자 system 정의는 rename/삭제 불가다. 이름 변경은 같은 ID를 참조하는 전체 구성원에 반영되고 개별 타인 프로필 변경으로 취급하지 않는다.
- rename name/expectedVersion·DELETE query expectedVersion을 사용하며 CP001~005·다른 회사/손상/오래된 version·사용중 ACTIVE 구성원·경쟁 생성/변경을 검증한다. 삭제는 soft delete와 과거 참조 보존, 같은 이름 신규 ID는 이전 직급 복구가 아니다. 사용중 직급을 먼저 임의 이동시키거나 삭제하지 않는다.
- 검증 연결: [TEAM-21~23/26](../../../qa/team-members.md#pol-14-team-qa), Figma3137:53220/53254/53288. 실제 검증은 disposable 일반 직급·참조 소속/권한·변경/잔존/복구 범위가 필요하다.

- 이 append는 POL-14의 정책/계약·완료 기준 인계다. 이 Task의 실행/Implementation Brief·설계/제품·실제 QA·Git 전달을 시작한 것이 아니다. 현재/다음/상태는 WBS만 소유한다. 원본2026-10-27 관찰·미작성 Brief·기존 체크리스트/QA는 보존한다.
- 공통 재개 Gate: 최신 Git/main·이 선행 결정/현재 source·게시 Swagger/실행 대응을 확인하고, 자체 성공 기준·수정 파일/영향·검증을 제시한다. `data-access.md`의 같은 company 공급원·public 포트/HTTP/DTO 경계·immutable snapshot/운영 guard·계정 격리를 지킨다. 새 library/endpoint/필드·fallback을 임의 만들지 않는다.
- 실제 업무 GET/변경·메일/초대/직급 실행은 승인된 합성 회사/계정·현재 leaf/상태/버전·환경/Origin/실행 SHA 대응·사용/소비/잔존/복구 범위와 자원 담당 역할이 필요하다. 이번 정책/Git/Chromatic 예외는 해당 자원 확보·실제 QA 면제/로컬 선행 승인이 아니다. 이전 QA-08 AUTH-16 0통과1차단·초대 AUTH-17 미실행과 다른 가입/회사·DEV-08/MAT-162 등 차단을 보존한다.

<a id="dev-32-dev-31-selection"></a>

## 2026-11-18 · DEV-31 뒤 선정·인계만

- 선정 이유: WBS의 P0/P1 및 앞선 P2 외부/선행 차단·보류를 유지한 기본 표 순서에서 DEV-27 선행이 충족된 첫 독립 후보다. POL-15보다 앞선 원래 순위·T04 연결을 유지하며 상태는 WBS만 소유한다.
- 인계 근거: [DEV-31 로컬 종료](DEV-31.md#dev-31-close), 기존 DEV-27의 직급 조회 포트/같은 company 공급원과 POL-14 D1의 일반/대표자 system 직급·현재 권한/정확 version 기준. 신청 승인 중 새 제안명 해결은 회사 직급 정의 관리 CRUD를 대신하지 않는다. 실제 DEV-31 QA5차단과 다른 모든 QA/정책/예외를 보존한다.
- 다음 첫 행동: 최신 main/미커밋 변경·DEV-27/POL-14 D1/이 원래 정의를 확인한다. 그 대화에서 현행 직급 소유 source·게시 Swagger/실행 대응·Figma3137:53220/53254/53288와 권한/이름/참조·사용 중 삭제/경쟁·합성 자원/사용·변경/잔존/복구를 확인한 뒤 자체 Brief·수정 파일/영향·검증을 제시한다. API/DTO 설계 전에 data-access.md를 읽는다.
- 이번에는 정의·선행/우선순위·첫 행동 인계만 했다. DEV-32 전용 계약 조사·정책 결정·설계/Implementation Brief·제품/Repository/실제 업무 API·직급 변경·QA·별도 Git 전달을 시작하지 않았다. 원본 정의/미작성 Brief·POL-14 확정 인계·기존 QA와79원본/114Task/156의존을 보존하며 DEV-31 D1·Git/Chromatic 예외를 승계하지 않는다.

<a id="dev-32-brief"></a>

## 2026-11-18 · Implementation Brief

- 범위는 T04 개발 한 건이다. 기존 회사 직급 목록에 추가·이름 변경·미사용 일반 직급 삭제를 연결한다. 회사 소속의 개별 직급 배정, 가입/초대에서 제안 이름을 처리하는 정책, POL-15/DEV-33 목적지는 각각 기존 소유를 유지한다.
- 결정 근거는 2026-11-16 사용자가 승인한 [POL-14 D1](POL-14.md#pol-14-contract)이다. 같은 회사의 `COMPANY_MEMBER_LIST_VIEW`로 읽고 `COMPANY_POSITION_MANAGE` 및 현재 회사 변경 가능 여부로 작업을 제한한다. 이름은 서버가 trim한 1~30자이며 제어 문자·예약어 `대표자`·같은 회사 활성 중복을 거부한다. 이름 변경은 동일 ID에 반영하고, 활성 구성원이 참조한 직급과 대표자는 삭제할 수 없다. 삭제는 레코드와 과거 참조를 보존하는 soft delete이며 버전을 증가시킨다.
- 사용자 2026-11-18의 최초 요청은 DEV-32 구현, 검증·두 리뷰, 분리 커밋, push·PR·최종 CI 확인, 정상 main 병합·로컬 fast-forward를 승인했다. 이번 PR의 Chromatic 월간 한도 문제만 예외다. 추가 답변 **‘로컬 선행·실제 API QA 차단 보존 (추천)’**으로 로컬 검증을 완료한 뒤 Git 전달할 수 있다. 실제 회사·계정 조회, 직급 변경, 초대·메일, 운영·배포는 범위 밖이다.
- 검토한 패턴은 `data-access.md`의 기존 company 그룹, `team-management-*.ts`의 공개 조회와 strict DTO, `team-mock-command.ts`의 계정별 명령 순서, DEV-27/31의 전·후 소속 조회와 화면 수명, `TextInput`, `Button`, `NormalTag`, native popup 및 Toast다. 선행 DEV-27은 [PR #85](https://github.com/mate-pjt/mate-frontend/pull/85), 인계 DEV-31은 [PR #89](https://github.com/mate-pjt/mate-frontend/pull/89)에서 각각 병합을 확인했다.
- 수정 설계는 `src/data/company`의 팀원 관리 포트·HTTP·공유 mock 및 직급 참조 조회, `src/features/company/team-positions.ts`, `src/app/my/team/positions/page.tsx`, `src/components/my`의 직급 화면과 기존 두 탭 연결, 직급 회귀 테스트, 이 Task·WBS·TEAM QA·필요한 공통 문서다. 새 의존성이나 공급원 없이 기존 adapter와 동일한 company store/command queue를 사용한다. 기존 저장 형식을 읽을 수 있게 하고 같은 이름 재생성에 새 ID를 부여한다.
- Figma [목록 3137:53220](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53220), [입력 3137:53254](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53254), [추가 완료 3137:53288](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53288)의 디자인 컨텍스트와 렌더를 확인했다. 대표자 기본 설정·일반 사용자 지정, 상단 입력/삭제 안내·이름 변경/삭제 행·추가 Toast를 연결한다. 낮은 위험의 선택으로 상단 취소는 기존 팀원 목록 복귀, rename/삭제의 미표현 상태는 기존 입력·확인 팝업, 좁은 화면은 줄바꿈을 적용한다. 별도 화면 예외 승인은 없다.
- 성공 기준은 정확한 메서드·회사/직급 ID·version 및 receipt, 같은 ID의 팀원/초대 참조, 활성 사용/중복/대표자 보호와 새 ID, 화면 수명·다시 조회·권한 상실에서 이전 상태를 숨기는 것이다. CP001~005와 손상 2xx·응답 유실·성공 후 조회 실패를 구분한다. UI가 구성원 이동이나 변경 요청 재실행을 수행하지 않는다.
- 검증은 Node 22.20.0/pnpm 11.3.0의 `pnpm test`, `pnpm lint`, API/mock/hybrid Preview의 `pnpm build`, `pnpm build-storybook`, `git diff --check`, 실제 Next mock 및 로컬 HTTP 대역 브라우저, Documentation Update Check·Context Audit·read-only verifier·ai-review다. 실제 TEAM-21/22 및 TEAM-23/26의 DEV-32 부분은 합성 계정/회사·실행 대응·잔존/복구 범위가 확인될 때 재개한다.

<a id="dev-32-investigation"></a>

### 현행 계약 확인

- 2026-11-18 `mate-backend/dev` `545ef153e30569a516f1585d60bdf00ce70d7f3a`의 [컨트롤러](https://github.com/mate-pjt/mate-backend/blob/545ef153e30569a516f1585d60bdf00ce70d7f3a/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companymembership/CompanyPositionController.kt), [명령·조회 서비스](https://github.com/mate-pjt/mate-backend/blob/545ef153e30569a516f1585d60bdf00ce70d7f3a/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/CompanyPositionServices.kt), [저장소](https://github.com/mate-pjt/mate-backend/blob/545ef153e30569a516f1585d60bdf00ce70d7f3a/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companymembership/CompanyPositionPersistenceAdapter.kt)를 대조했다. 중앙 정책 main은 POL-14 인용 `c9e50ff591ae18023164e1a94581c611bf1e4f29`와 동일하다. [CI/테스트 배포 기록](https://github.com/mate-pjt/mate-backend/actions/runs/44026382503)의 verify/publish/deploy는 성공, deploy-prod는 skipped다.
- [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs)는 Aside GET 200, OpenAPI 3.1.0/v1이다. `GET/POST /api/v1/companies/{companyId}/positions`, `PATCH/DELETE …/{positionId}`에서 생성 `{name}`/201, 이름 변경 `{name, expectedVersion}`/200, 삭제 query `expectedVersion`/200의 `{positionId, version, deletedAt}`를 확인했다. 같은 이름 PATCH는 source에서 현재 version을 반환한다. 공통 응답 source의 `isSuccess`와 게시 Swagger의 `success` 표현 차이와 현재 실행 서버 SHA/업무 응답은 실제 QA에서 확인한다. 실제 업무 API 호출은 0건이다.

### 착수 체크포인트

- 2026-11-18 KST / Codex. 시작 `main`/`origin/main` 동일 `71bcf71c318e27d0849b4bf41e7d2f45e1298903`, 기존 미커밋 변경과 DEV-32 브랜치 없음. `feat/dev-32-company-positions`를 이 SHA에서 생성했다. 사용자 추가 결정과 설계 공유 완료, 자동 수정 0/3. 다음은 공개 포트와 명령·직급 참조를 구현하는 것이다.

- 2026-11-18 KST / Codex. 직급 Repository와 회사 범위/버전·권한의 재확인, 공유 mock/초대 참조, 팀원·신청 탭 진입을 연결했다. ESLint 초기 조회(1/3), 브라우저 Escape 초점 복귀(2/3), Figma 취소 아이콘·입력줄/여백·입력 상태(3/3)를 교정했다. 성공 후 재조회 실패가 반복돼도 완료 안내를 유지하고 HTTP 대역에서 재검증했다. 격리 Next의 외부 node_modules symlink 오류는 의존성을 격리 디렉터리 안에 복제해 해결했다. 다음은 최종 증거 확인과 독립 검토다.

<a id="dev-32-verification"></a>

### 검증 및 실제 QA 재개

- Node 22.20.0/pnpm 11.3.0의 `pnpm test` 1,123/1,123 통과, 38개 파일. 이번 전용 회귀 38건을 추가했다. `pnpm lint`, Preview API/mock/hybrid 각각의 `pnpm build`, `pnpm build-storybook`이 통과했다.
- 최종 실제 Next 브라우저에서 Figma 세 상태와 공유 아이콘, 현재 회사의 직급 추가·이름 변경/삭제, 사용 중 삭제 거부, 로그인/팀원 2페이지 복귀, 신청 탭 진입, 모바일/키보드를 확인했다. 로컬 HTTP 대역의 wire/충돌/손상·응답 단절/후속 실패와 다시 읽기는 [QA](../../../qa/team-members.md#dev-32-local-qa), 결과 화면은 [캡처](../assets/dev-32/README.md)에 기록했다.
- 실제 QA 0통과/4차단. TEAM-21/22 및 TEAM-23/26의 이번 소유 부분만 집계했다. 합성 회사·권한 계정·현재 위치/버전·Origin과 실행 서버 SHA 대응, 안전한 조회·사용/잔존/복구 승인 제공이 재개 조건이다. 원래 26개 QA 및 이전 차단 이력은 보존했다.
- Documentation Update Check에서 회사 경로/API/mock 경계를 architecture와 data-access에 반영했다. 공통 계획은 작업 기록과 QA로 연결했다. package/scripts·하네스·원본 T04/79개 연결은 그대로다. 이번 검사 도구와 제품 교정은 이 작업 기록과 검토에 남겼다.

### 독립 리뷰 발견과 추가 결정

- 2026-11-18 KST, 첫 독립 검토는 FAIL이었다. Kotlin에서 유효한 `U+FEFF` 직급명을 프런트 명령은 허용했지만 응답/목록은 JavaScript `trim()`으로 거부했다. 앱은 이미 저장된 직급의 목록을 다시 열 수 없고 mock은 다음 읽기에서 관리 상태를 초기화할 수 있었다.
- 사용자는 이 문제에 한해 **‘추가 수정 1회 허용 (추천)’**을 선택했다. 직급명 공백 기준을 쓰기와 DTO 읽기에서 공유하고 팀원·초대·합류 승인 참조도 같은 이름을 받을 수 있게 교정한다. 이 승인으로 다른 검증 예외나 정책을 변경하지 않는다.

- 추가 교정 1/1 뒤 `pnpm test` 1,125/1,125(새 회귀 40), lint, Preview 세 빌드, Storybook이 통과했다. 실제 Next HTTP 대역에서 U+FEFF 저장 1회와 후속 목록/새로고침을 확인했다. 앞선 독립 판정 1 Major와 이번 교정은 [검토](../reviews/DEV-32.md)에 이력으로 보존한다. 다음은 수정된 diff의 독립 검토와 Git 전달이다.

<a id="dev-32-close"></a>

## 2026-11-18 · 로컬 범위 종료 및 다음 작업 인계

- [x] 같은 회사와 권한, 이름/대표자/활성 사용 보호, 공유 ID·버전/실패/재조회와 기존 팀원·초대 참조를 구현·검증했다.
- [x] 테스트 1,125건, ESLint, 세 Preview 빌드 및 Storybook, 실제 Next mock/HTTP 대역 브라우저와 문서 검증이 통과했다.
- [x] 독립 verifier와 ai-review를 처음 검토의 Major 교정 뒤 재실행했다. 최종 Blocker/Major/Minor 없는 PASS와 Context Audit의 결과는 [검토](../reviews/DEV-32.md)에 있다.
- [x] 사용자의 이번 로컬 선행 결정과 실제 TEAM-21/22·TEAM-23/26의 4부분 차단을 [QA](../../../qa/team-members.md#dev-32-local-qa)에 남겼다. 합성 브라우저 탭과 Next 2개·HTTP 대역을 종료했다. 실제 업무 조회·변경·메일은 미실행이다.
- 다음은 [POL-15](POL-15.md#pol-15-dev-32-handoff) 한 건이다. P0/P1 및 앞선 P2 외부/선행 차단을 보존하고 POL-14 선행 충족과 WBS 표 순서로 선정했다. 첫 행동은 원본 O11과 수락 완료 Figma·현행 CTA/복귀·현재 권한을 대조해 정책 범위를 구조화하는 것이다. 이번에는 선정·인계만 남겼다.
- 다음 전달 단계는 목적별 커밋, PR/라벨과 실제 최종 head CI·리뷰 조건 확인, 정상 merge 및 로컬 main 동기화다. Git과 실제 통합 QA를 따로 판정한다.

<a id="dev-32-git-delivery"></a>

## 2026-11-18 · Git 전달 체크포인트

- `feat/dev-32-company-positions`에서 `fc1ea13`(회사 직급 데이터), `c38148a`(화면), `f592833`(테스트), `178c066`(공통 문서), `e117775`(검증/인계)의 5개 분리 커밋을 전송했다.
- [PR #90](https://github.com/mate-pjt/mate-frontend/pull/90)는 시작 base `71bcf71c318e27d0849b4bf41e7d2f45e1298903`, 등록 당시 head `e117775156d7cf58e4fcb239c9c7394883f4cc60`, 라벨 `type: feature`, `type: test`, `type: docs`다. 저장소 템플릿과 합성 화면 캡처를 사용했다.
- 이 전달 기록을 추가한 최종 head에서 GitHub Actions와 리뷰·병합 조건을 다시 확인한다. 월간 한도에 관련된 Chromatic만 이번 사용자 예외 범위다. 병합·로컬 main fast-forward와 최종 SHA는 실제 원격 PR·종료 보고를 근거로 삼는다. 실제 API 4부분 차단과 POL-15 인계 상태를 유지한다.

# POL-18 · 탈퇴 조건·회사 권한·데이터 처리 결정

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 정책 결정
- 원본 항목: S03, C02
- 선행 작업: [POL-14](POL-14.md) / [POL-17](POL-17.md)
- 목적/범위: 대표/마지막 관리자·탈퇴 인증·보존/삭제·철회 가능 여부/기간을 결정한다. 추천: 승인된 계정/회사/개인정보 정책을 확보한 뒤 연결한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### S03 · 계정 탈퇴·확인·인증·철회
- 기준선: UI **공용 팝업만**, 동작 **실제 계정 흐름 없음**, 데이터 **탈퇴 계약 없음**. 검증: 코드 대조.
- 남은 점: 탈퇴 조건/데이터 처리/회사 대표 권한 정책 확정 후 화면·API 연결
- Figma: [3139:53195](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-53195) / [3139:56044](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-56044) / [3139:56270](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-56270)
- 소유 소스/기존 기록: [src/components/ui/popup/popup.tsx:648](../../../../src/components/ui/popup/popup.tsx)、[src/components/ui/popup/popup.tsx:726](../../../../src/components/ui/popup/popup.tsx)、[src/components/my/my-settings-home-client.tsx:14](../../../../src/components/my/my-settings-home-client.tsx)

### C02 · 정정·비밀번호·탈퇴·업로드 공용 팝업
- 기준선: UI **컴포넌트 구현**, 동작 **일부 Storybook 전용**, 데이터 **업무 API 없음**. 검증: 코드 대조.
- 남은 점: 컴포넌트 존재를 제품 기능 완료로 세지 말 것. 실제 도메인 연결 필요
- Figma: [2210:17840](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2210-17840) / [2303:89402](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2303-89402) / [2303:90900](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2303-90900) / [2264:95335](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2264-95335)
- 소유 소스/기존 기록: [src/components/ui/popup/index.ts:1](../../../../src/components/ui/popup/index.ts)、[src/components/ui/popup/popup.stories.tsx:50](../../../../src/components/ui/popup/popup.stories.tsx)、[src/components/ui/popup/popup.tsx:353](../../../../src/components/ui/popup/popup.tsx)

## 완료 기준

- [ ] 탈퇴/철회 API·재가입·소속/초대/문서의 처리 기준을 확인한다
- [ ] 대표 권한 이관·실패/중복·세션 처리와 승인자를 기록한다
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

<a id="pol-18-dev-38-handoff"></a>

## 2026-11-20 · DEV-38 인계

- P2 순서에서 POL-14와 POL-17을 충족했으며 DEV-38의 본인 연락용 이메일 조회에는 탈퇴 행이 없다. [DEV-38 검증](DEV-38.md#dev-38-verification) · [S02 화면 경계](../../../qa/my-settings-home.md#dev-38-account-qa)
- 다음 첫 행동은 최신 main의 POL-14 및 POL-17과 S03/C02를 비교해 대표자·마지막 관리자, 탈퇴 본인 확인, 보존/삭제·철회의 결정 범위를 정리하는 것이다. 이 기록은 선정과 인계에 해당한다. 정책 결정과 제품 동작은 자체 Gate에 따른다.

<a id="pol-18-investigation"></a>

## 2026-11-20 · 착수와 현행 조사

- 시작 기준은 로컬 및 원격 `main` `14661ce65364c05339f5d5bc63b4009412a3850a`, 기존 작업트리 변경 0건이다. [POL-14 PR #83](https://github.com/mate-pjt/mate-frontend/pull/83), [POL-17 PR #96](https://github.com/mate-pjt/mate-frontend/pull/96), [DEV-38 PR #97](https://github.com/mate-pjt/mate-frontend/pull/97)의 main 반영을 확인한 뒤 `docs/pol-18-withdrawal-policy`를 생성했다.
- 이번 사용자는 POL-18의 정책 조사·결정 기록, 문서 검증·두 리뷰, 목적별 commit/push·PR·최종 CI 확인·조건부 정상 병합과 로컬 fast-forward를 승인했다. 이번 PR의 Chromatic 월간 한도 관련 문제에만 예외를 적용한다. 제품 구현, 실제 탈퇴·계정/회사/문서 변경·메일, 운영·배포 및 다음 Task 실행은 범위 밖이다.
- 성공 기준은 S03/C02의 실제 시안, POL-14·POL-17과 백엔드 현행 계약으로 이미 정해진 범위를 확인하고, 탈퇴의 자격·인증·실행/세션·데이터·재가입/철회 결정과 후속 개발·QA의 재개 조건을 근거와 함께 남기는 것이다. 링크·ID/의존성·기준선/기존 기록 보존·Markdown·diff 검사 및 두 리뷰를 마친다.

| 근거 | 관찰 |
| --- | --- |
| 선행 정책 | 회사 소속 종료와 계정 탈퇴는 별개다. 최후 유효 ADMIN의 소속 종료를 제한한다. 대표자 직급만 내려놓고 ADMIN 전체 권한을 유지할 수 있다. 로그인 주체는 `GOOGLE + sub`이며 연락용 이메일과 별개다. POL-17 D1의 S02 이메일 인증 버튼 생략은 해당 버튼에 한정한다. [POL-14 결정](POL-14.md#pol-14-contract) · [POL-17 결정](POL-17.md#pol-17-contract) · [중앙 회사 권한](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/company/permissions.md) · [중앙 계정 정책](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/auth/account-and-social-identity.md) |
| Backend source | `dev` `ab388b7cb06154a00e254eff7b124882952166ac`, `main` `4b5f31de578c41e698dda9c99e66149b7292f031`의 관련 경로를 비교했다. `dev`의 소속 종료는 본인·최신 `expectedVersion`·회사 잠금·유효 ADMIN을 검사해 `LEFT`를 저장한다. `WITHDRAWN` Account 상태는 존재하며 상태 전이가 종료된 값이다. 이 상태 정의에서 서비스 탈퇴 실행, 데이터 파기, 철회 또는 재가입 API 계약은 확인되지 않는다. [소속 종료 Controller](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companymembership/CompanyMembershipController.kt#L156) · [소속 종료 Service](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/CompanyMembershipMutationService.kt#L137) · [Account 상태](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/domain/account/enums/AccountStatus.kt) |
| CI·개발 배포 기록 | 같은 `dev` SHA의 GitHub CI `44429902651` verify/publish/deploy 성공, deploy-prod skipped. test deployment `7900875985` success, 2026-11-19 10:04:22 KST. [GitHub 배포 job](https://github.com/mate-pjt/mate-backend/actions/runs/44429902651/job/135257313150) |
| 게시 명세 | 개발 Swagger UI와 OpenAPI를 읽기 전용으로 조회해 모두 HTTP 200을 확인했다. OpenAPI 3.1.0, v1, 184 paths, SHA-256 `9e0b737fd92953b9f7a668aeecb61ce32b865bb3861999f9775fdfb523d21dd2`. 소속 종료 `POST /api/v1/company-memberships/{membershipId}/leave`, 사업자 연결 해제, 현재 브라우저 로그아웃과 알림 수신처 이메일 인증은 별도 계약이다. 게시 목록과 확인한 계정/인증 경로에서 서비스 계정의 탈퇴 자격·재인증·실행·결과 조회/철회를 찾지 못했다. [개발 Swagger](https://api-test.mate-bid.com/swagger-ui/index.html) · [게시 명세](https://api-test.mate-bid.com/v3/api-docs) |
| 실행 중 버전과 업무 응답 | 현재 개발 프로세스의 commit/image digest 대응은 미확인이다. 계정·회사 데이터를 읽거나 변경하는 업무 API, 메일 발송, 실제 탈퇴 QA는 미실행으로 복구할 데이터가 없다. DEV-38의 실제 계정 이메일 조회 근거는 해당 QA 범위에만 적용한다. [DEV-38 QA](../../../qa/my-settings-home.md#dev-38-account-qa) |
| 제품과 디자인 | `/my/settings/account`는 세션의 본인 이메일 조회 상세이며 탈퇴 행은 아직 없다. 공용 팝업은 표현과 Storybook 상태를 제공한다. 시안의 S03 확인/계속 이용/완료 및 C02의 '모든 데이터' 문구는 데이터 정책이나 서버 계약의 근거가 될 수 없다. 개발용 임시 약관에도 정식 보존/파기 정책은 없다. [계정 상세](../../../../src/components/my/account-settings-page-client.tsx) · [공용 팝업](../../../../src/components/ui/popup/popup.tsx) · [임시 약관](../../../../src/app/auth/legal/%5Bdocument%5D/page.tsx) |

### S03/C02 화면 근거

| Figma 확인 범위 | 관찰 |
| --- | --- |
| S02 [탈퇴 버튼](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-53096) | 시안에는 `탈퇴하기`가 표시된다. 현행 계정 상세에는 해당 행이 없다. |
| S03 [확인 처음](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-53195) · [확인 변형 2](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-56044) · [확인 변형 3](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-53295) | `resign_popup`의 Default, Variant2, Variant3으로, 확인 체크와 `계속 이용하기`를 제공한다. `계속 이용하기`는 제출 전 팝업에 있다. |
| S03 [완료](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-56270) · [탈퇴안함](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-53395) | 완료 팝업의 제목과 별도 설정 복귀 프레임을 확인했다. 조사한 프레임에서 완료 후 복귀·복원/철회 명령은 확인하지 못했다. |
| C02 [공용 탈퇴 팝업](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2303-90900) · 인접 [메일 입력/코드 상태](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-53502) | C02의 탈퇴 3변형은 데이터 삭제와 복구 불가를 일괄 안내한다. 메일 코드 상태는 별도 `alarmemail_popup`이다. `WithdrawalEmailPopup`의 Storybook 4자리 예시와 인접 디자인으로 서비스 탈퇴 재인증을 추론하지 않는다. [Storybook 상태](../../../../src/components/ui/popup/popup.stories.tsx) |

이 대조는 해당 노드의 구조·변형·보이는 문구에 한정한다. 프로토타입 전체 동작, 픽셀 정합성, 실제 계정의 인증이나 탈퇴는 미검증이다. [MAT-202](https://linear.app/mate-pjt/issue/MAT-202)와 [MAT-211](https://linear.app/mate-pjt/issue/MAT-211)의 회사 소속 종료·초대 근거에서 서비스 계정 소멸 계약을 얻을 수 없다.

<a id="pol-18-decisions"></a>

### 착수 시점의 결정 질문

| 결정 | 추천안 | 확정이 필요한 이유 |
| --- | --- | --- |
| D1 회사 자격 | 활성 소속이 있으면 기존 소속 종료를 먼저 완료한다. 대표자 직급 이관 또는 POL-14가 허용하는 해제를 별도로 처리한다. 유일한 유효 ADMIN은 다른 유효 ADMIN의 권한이 실제 반영될 때까지 종료를 제한한다. | 소속 종료 계약을 서비스 탈퇴가 자동 호출할지, 별도 행동으로 둘지는 새 제품 정책이다. |
| D2 탈퇴 인증과 화면 | 기존 계정과 같은 Google identity를 서버가 검증하는 탈퇴 전용 재인증을 요구한다. 계약 전에는 S02 탈퇴 행을 미노출하고, 이후 S03/C02의 확인·취소 흐름에 별도 인증 단계를 연결한다. | 일반 로그인/refresh와 알림 수신처 인증은 탈퇴 재인증 계약을 제공하지 않는다. 시안의 인증 상태와 표현 차이에는 별도 결정이 필요하다. |
| D3 취소·철회·데이터 | 최종 제출 전 취소, 성공 확정 시 접근 종료, 완료 후 사용자 철회/복원 없이 진행하는 방향을 채택한다. 동일 Google 재가입과 개인·공유 데이터별 보존/삭제/파기 기간은 소유 정책 및 계약 확인 전 활성화하지 않는다. | 전부 즉시 삭제한다는 시안 문구, 복구 기간, 동일 identity 재가입을 현행 근거로 보장할 수 없다. |

2026-11-20 KST, Codex 조사 체크포인트. 현재 브랜치는 `docs/pol-18-withdrawal-policy`, 기준 HEAD는 `14661ce`이다. 위 세 항목은 결정 요청 당시의 추천안이다. 사용자 답변으로 결정·이유·화면 예외의 범위를 기록한 뒤 Brief와 설계를 확정한다. 다음 Task 선정과 최종 Git 전달은 이 단위의 범위와 검증·리뷰를 확정한 뒤 판단한다.

<a id="pol-18-brief"></a>

## 2026-11-20 · 사용자 답변과 문서 범위

| 항목 | 사용자 답변과 적용 범위 |
| --- | --- |
| D1 회사 소속 | 사용자는 프론트가 탈퇴 요청을 보내고 회사 처리는 백엔드가 책임지는 경계를 확인했다. 소속 선종료, 자동 종료 또는 대표자 이관 의무의 선택은 미확정이다. 서버가 제공할 자격 판정과 차단 사유의 계약이 필요하다. |
| D2 탈퇴 인증과 화면 | 사용자 선택 **“인증 방식과 화면 예외 보류”**. Google 재인증과 이메일 코드 중 어느 쪽도 채택하지 않았다. 화면 예외 승인도 보류다. 이전 POL-17의 S02 이메일 버튼 예외는 해당 버튼에 적용된다. |
| D3 철회·재가입·데이터 | 사용자는 철회·보존·파기를 백엔드 책임으로 보는지 확인했다. 세션 무효화 범위, 확정 전후 처리, 철회 지원 여부/기간, 데이터별 보존/파기, 동일 Google 재가입은 미확정이다. 착수 추천안의 철회 미지원·즉시 종료도 확정 사항으로 기록하지 않는다. |

- 결정자와 근거는 2026-11-20 KST의 이번 사용자 답변이다. D1·D3는 질문으로 회신되어 **백엔드 소유 경계를 확인한 답변**으로 반영했다. 신규 도메인 정책 승인으로 사용하지 않는다. D2의 보류는 명시적이다.
- 문서 범위는 소유 경계, 현행 증거, Backend/제품·개인정보 정책 담당 역할의 회신 항목, DEV-39/40의 재개 조건과 미실행 QA다. POL-18의 전체 정책 완료 기준 중 회사 처리·인증·철회·데이터 계약은 정책 소유자의 승인 문서와 백엔드 계약이 확보될 때 닫는다.
- 수정 대상은 이 작업 기록, WBS, S03/C02 연결, DEV-39/40 및 다음 Task 인계, 기존 설정 QA 계획, 공통 계획 및 리뷰 기록이다. 현행 인증·팀원·공용 팝업 소스와 데이터 공급원은 근거로 사용한다. 별도 앱 변경과 실제 업무 수행은 이번 정책 문서 범위 밖이다.
- 재개 위험은 화면이 회사 소속 종료나 현재 브라우저 로그아웃만으로 회원 탈퇴를 표시하는 경우, 권한이나 계정이 바뀐 상태에서 중복 명령이 나가는 경우, 미확정 보존/철회를 완료 문구가 약속하는 경우다. 검증은 Markdown 링크·ID/의존성·기준선 및 기존 QA/승인 경계·diff와 두 문서 리뷰다.

<a id="pol-18-contract"></a>

## 탈퇴 요청과 서버 결과를 연결하는 기준

### 회사와 계정의 책임

- 서비스 계정 탈퇴는 백엔드가 소유하는 명령이다. 프론트는 제공된 계약에 따라 현재 계정의 요청을 전달하고, 반환된 자격·불가 사유·필요 조치·결과를 표시한다. 대표자 표시나 현재 회사 조회만으로 자격을 단정하거나 기존 회사 종료 API를 자동으로 이어 호출하면 별도 도메인 변경이 일어날 수 있다.
- [POL-14](POL-14.md#pol-14-contract)의 기존 팀원 변경·회사 소속 종료 규칙은 해당 명령의 기준이다. 유효 ADMIN은 현재 전체 leaf 및 합치기 반영 상태로 판정한다. 기존 소속 종료는 본인과 최신 version을 확인하고 마지막 유효 ADMIN을 보호한다. 서비스 탈퇴에서 정리 가능한 소속, 대표자·최후 관리자 사유, 이관/해제/별도 종료가 필요한 경우 및 동시 합류·권한 변경 시의 최종 판정은 서버가 결정할 제품 계약이다.
- 합류 신청·받은 초대와 이미 사용한 초대, 회사 명의의 보낸 초대·승인안, 기존 소속/직급 이력은 각기 다른 대상이다. 계정 탈퇴가 발생했을 때의 처리와 경합을 서버 계약에서 확인한다. [MAT-211](https://linear.app/mate-pjt/issue/MAT-211)의 발급자 회사 이탈과 사용한 초대 재사용 방지 근거는 회사 소속 동작에 한정한다.

### 인증·실행·세션

- 기존 로그인/refresh는 Account와 세션 유효성을 확인한다. 현재 브라우저 logout은 해당 세션 명령이다. `WITHDRAWN` 계정 상태와 현재 비활성 계정의 접근 실패는 서버 상태 모델의 근거다. 전용 탈퇴 거래의 본인 확인 방식, 적용 시점, 취소·만료·계정 전환·재사용에 대한 동작은 D2와 백엔드 계약을 확보한 뒤 연결한다. 알림 수신처 인증이나 연락용 이메일 조회에는 별도 탈퇴 권한이 없다. [접근 유효성 검사](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/application/service/auth/AccessAuthenticationService.kt) · [세션 처리](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/application/service/auth/BrowserSessionTransactionService.kt)
- 명시적 사용자 요청과 서버의 확인된 상태를 기준으로 진행한다. 이미 처리됨, 권한/상태 충돌, 만료, 요청 중 페이지 닫기, 응답 유실과 확인된 실패를 구분한다. 문구와 이동은 서버의 확정 결과에 묶는다. 시간 초과나 후속 `401`만으로 탈퇴 성공을 추정하거나 명령을 자동 재전송하지 않는다. 결과 재확인 수단과 중복·원자성·재시도 계약은 백엔드 회신 항목이다.
- 서버가 확정하는 범위에서 세션 무효화, 접근/refresh 차단, 쿠키 정리, 처리 결과 전달과 보호 화면 복귀 동작을 함께 검증한다. 확인된 서버 결과에 따라 프론트의 계정 상태와 보호 화면을 정리한다. 현재 탭·다른 탭/브라우저 등 영향 범위와 세션 소멸 후 결과 확인 방식은 미정이다.

### 데이터·철회·재가입

| 확인 대상 | 재개에 필요한 결정 |
| --- | --- |
| 개인 프로필·Google identity·약관 동의/감사 | 접근 차단과 삭제/비식별화 시점, 보존 대상·근거·기간·권한, 백업 및 파기 결과 확인 방법 |
| 개인 필터·구독·알림·수신처와 발송 대기 | 계정에 귀속된 설정/이력의 정리, 추가 전달 방지와 작업 지연/실패 처리, 개인정보가 있는 이력의 접근 |
| 소속·초대·신청·회사 공유 서류 및 미귀속 자료 | 회사에 남는 기록과 개인 업로드/후보, 작성자 표시 등 개인정보 처리, 대기 중 합류·초대·승인과의 경합. 회사 서류 명령의 30일 파기 기준은 해당 문서 정책에 귀속된다. [POL-13](POL-13.md#pol-13-contract) |
| 인증·세션·처리 결과 | 계정 상태 전이와 유효 세션 범위, 진행 중 접수와 확정·실패 상태, 멱등·재조회와 파기 지연 시 안내 |
| 제출 전 닫기·완료 후 철회·재가입 | 제출 전 취소 동작과 서버 접수 후 취소/철회의 구분, 지원 여부·조건·기간·신원 검증, 기존 데이터·회사 소속 복구 범위, 동일 `GOOGLE + sub`의 신규 가입 허용/시점 |

현행 로그인은 먼저 `GOOGLE + sub`에 연결된 계정을 조회한다. 매핑된 비활성 계정에 로그인할 수 없으며 매핑이 남아 있으면 가입 경로의 중복 검사를 받는다. 이 분기를 재가입 또는 자동 복구 정책으로 사용하지 않는다. [로그인 분기](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/application/service/auth/oauth/GoogleOAuthLoginTransactionService.kt#L55) · [신규 가입 중복 검사](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/application/service/auth/socialsignup/SocialSignupTransactionService.kt#L55)

### 화면 연결과 재개 조건

- S02 진입, S03 확인 체크/계속 이용과 완료, C02 공용 팝업은 위 [화면 조사](#pol-18-investigation)를 기준으로 후속 소유자가 다시 대조한다. 현재 탈퇴 UI는 미연결이다. 완료 프레임 뒤 세션과 이동, 회사별 불가 사유, 인증 단계, ‘모든 데이터’ 안내에 대한 화면 예외는 미승인이다. 실제 승인된 처리 범위를 바탕으로 노드/상태별 문구·예외를 확정한다.
- **POL-18 재개 조건**은 백엔드 담당의 탈퇴 자격·실행·결과 계약, 제품/개인정보 정책 담당의 회사 처리·보존/파기·재가입·철회 지원 여부 결정이다. 제품/디자인 담당의 D2 본인 확인 방식 및 Figma 화면 결정을 확보하고, 재인증이나 철회가 지원되면 해당 계약을 확인한다. API 제공 시 source commit, 배포, 게시 명세, 실행 대응, 실제 QA를 다시 구분한다. 외부 요청 등록·개인정보 수집이나 테스트 실행 승인은 이번 사용자 답변에 포함되지 않았다.
- [DEV-39](DEV-39.md#dev-39-pol-18-handoff)는 자격·확인·인증과 화면을, [DEV-40](DEV-40.md#dev-40-pol-18-handoff)은 검증된 실행·결과·세션 및 지원되는 철회를 소유한다. [WDRAW 계획](../../../qa/my-settings-home.md#pol-18-withdrawal-qa)은 실제 0건 실행으로 남긴다.

<a id="pol-18-handoff"></a>

## 2026-11-20 · 체크포인트 및 다음 Task 인계

| 시점 | 수행 결과 | 재개 행동 |
| --- | --- | --- |
| 착수 | 깨끗한 `14661ce`에서 `docs/pol-18-withdrawal-policy` 생성. 선행 main 반영과 소유 정책·소스·게시 명세·디자인 조사. | [사용자 결정 질문](#pol-18-decisions)을 제시했다. |
| 결정 대기 | Markdown 2개와 로컬 링크 513개, 원본 79개·Task 114개·의존성 156개 검증 및 읽기 전용 검토를 통과했다. | 당시 검토는 조사 체크포인트에 적용한다. |
| 답변 수신 | D1·D3 백엔드 소유 경계, 명시 D2 보류와 미확정 계약을 기록했다. DEV-39/40 연결과 QA 9사례 계획을 추가했다. | 정책/계약이 게시되면 권한·데이터·인증·화면과 실행 버전을 다시 대조한다. |
| 전달 준비 | [문서 검증 및 두 리뷰](../reviews/POL-18.md)를 근거로 승인된 문서 범위를 전달한다. 업무 API·mock 실행·제품 구현 및 QA 실행 0건이다. | 최종 PR head에서 Git 전달 조건을 별도로 확인한다. |

다음 Task는 [POL-19](POL-19.md#pol-19-pol-18-handoff)다. 기존 P0/P1 차단 및 앞선 P2의 외부 조건·미충족 선행을 적용했다. DEV-39·40은 탈퇴 계약과 인증·화면 결정이 선행한다. POL-19는 DOC-001을 충족한 첫 독립 P2 정책 후보다. 새 대화에서 최신 main과 마지막 정책 체크포인트를 읽고 S06/S09·중앙 알림 정책·현재 개발 계약의 적용 범위를 확인한다. 이번 범위는 이 후보의 선정과 인계다.

<a id="pol-18-delivery"></a>

### Git 전달 기준

- 정책 Gate에 남은 계약·결정과 이번 조사 문서의 검증/전달을 별도로 판정한다. 미확정 작업 상태는 [WBS](../README.md)에 둔다.
- 목적별 문서 커밋과 `type: docs`가 붙은 [PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fpol-18-withdrawal-policy)을 사용한다. 최신 base와 최종 head의 CI·미해결 리뷰·병합 조건을 확인한 뒤 허용된 merge commit으로 이력을 보존하고 로컬 main을 fast-forward한다.
- 2026-11-20 사용자 요청 범위의 이번 PR에서만 확인된 Chromatic 월간 한도 문제를 예외로 처리한다. 실제 검사 결과·head·병합·로컬/원격 SHA 일치는 PR 및 종료 보고에 남긴다.

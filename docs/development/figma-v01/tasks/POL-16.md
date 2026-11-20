# POL-16 · 회사 간 통합·부분 승인·충돌 정책

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 정책 결정
- 원본 항목: G01, G02, G03
- 선행 작업: [POL-12](POL-12.md) / [POL-14](POL-14.md)
- 목적/범위: 소속 신청과 구분된 회사 간 통합의 요청 자격·검토 단계·권한/직급/실적 선택·자료 승계·동시 처리 정책을 확정한다. 추천: 권한·회사 정보 검토를 모두 완료한 뒤 확정한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### G01 · 회사 간 통합 요청 발송·상태
- 기준선: UI **메뉴 비활성**, 동작 **미구현**, 데이터 **프론트 계약 없음**. 검증: 코드 대조.
- 남은 점: 회사 소속 신청과 구분하여 미인증/인증 회사 간 팀원·실적 통합 구현
- Figma: [3042:58164](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3042-58164) / [3043:58978](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3043-58978) / [3298:52565](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3298-52565)
- 소유 소스/기존 기록: [src/components/my/my-side-menu.tsx:13](../../../../src/components/my/my-side-menu.tsx)、[src/data/company/contracts.ts:199](../../../../src/data/company/contracts.ts)

### G02 · 받은 통합 요청의 팀원·회사 정보 검토
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **프론트 계약 없음**. 검증: 코드 대조.
- 남은 점: 팀원 검토와 회사 정보 검토를 완료해야 통합 승인하는 단계 제어
- Figma: [3052:55919](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3052-55919) / [3066:56069](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3066-56069) / [3070:62541](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3070-62541)
- 소유 소스/기존 기록: [src/components/my/my-side-menu.tsx:13](../../../../src/components/my/my-side-menu.tsx)

### G03 · 전체/일부 승인·거절·충돌/완료
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **프론트 계약 없음**. 검증: 코드 대조.
- 남은 점: 팀원 권한·직급·실적 선택 및 통합 후 데이터 일관성 검증
- Figma: [3076:66722](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3076-66722) / [3077:127263](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3077-127263) / [3077:129182](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3077-129182)
- 소유 소스/기존 기록: [src/components/my/my-side-menu.tsx:13](../../../../src/components/my/my-side-menu.tsx)、[src/data/company/contracts.ts:193](../../../../src/data/company/contracts.ts)

## 완료 기준

- [ ] 인증/미인증 회사 조합·대표 권한·요청/취소/재요청 상태를 기록한다
- [ ] 부분/전체 승인·거절·버전 충돌·데이터 승계/감사·복구 범위를 확정한다
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

<a id="pol-16-dev-33-handoff"></a>

## 2026-11-20 · DEV-33 종료 뒤 선정과 인계

- [WBS](../README.md) 기본 우선순위와 표 순서에서 기존 P0/P1·앞선 P2의 차단과 선행 대기를 고려했다. [POL-12](POL-12.md#pol-12-contract)와 [POL-14](POL-14.md#pol-14-contract)가 충족된 이 정책 작업을 다음 하나로 선정했다.
- 첫 행동은 최신 main과 원본 G01·G02·G03, 기존 회사·대표자 권한과 현행 기획·Figma·백엔드 계약을 대조하는 것이다. 인증/미인증 회사의 통합 요청·철회, 받은 요청의 전체/부분 승인·거절, 버전 충돌·데이터 승계·감사/복구의 확정 정책과 질문을 구분해 자체 Brief를 작성한다.
- 이 인계는 다음 작업 선정과 첫 행동의 기록이다. 해당 정책 조사, 제품 설계·구현, 업무 데이터 변경과 실제 QA는 새 대화의 자체 Gate에서 결정한다.

<a id="pol-16-investigation"></a>

## 2026-11-20 · 현행 근거와 결정 요청

- 시작 체크포인트는 09:12 KST, `docs/pol-16-company-merge-policy`, `e1f3fa5c18b8d96f5130c59e221a8e0a0a9b50e1`이다. 시작 당시 로컬·원격 main이 일치했고 작업트리는 깨끗했다. [POL-12 PR #76](https://github.com/mate-pjt/mate-frontend/pull/76), [POL-14 PR #83](https://github.com/mate-pjt/mate-frontend/pull/83), [DEV-33 PR #92](https://github.com/mate-pjt/mate-frontend/pull/92)의 병합 근거를 확인했다.
- 이번 사용자 요청은 POL-16의 조사·결정 문서화, 문서 검증과 두 리뷰, 목적별 커밋·push·PR·최종 head CI·정상 병합·로컬 main fast-forward를 승인한다. 이 PR에서 확인된 Chromatic 월간 한도 문제만 예외다. 별도 정책 선택, 화면 예외, 제품·중앙 정책/서버 수정, 실제 업무 조회·변경·메시지와 운영·배포는 각 근거와 승인 범위를 확인한다.
- 프론트의 [통합 메뉴](../../../../src/components/my/my-side-menu.tsx)는 비활성이다. [가입 회사 등록 계약](../../../../src/data/company/contracts.ts)의 `VERIFY_CURRENT_COMPANY`와 `PROPOSE_MERGE`는 인증 선택지다. [회사 소속 신청](POL-11.md)의 기존 ‘통합 요청’ 표기는 유지되는 별도 흐름이다. 전용 통합 화면·프론트 Repository·실제 통합 증거는 현재 확보하지 못했다.
- 중앙 `main`의 [합치기·분쟁 정책](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/company/merge-and-dispute.md)과 [ADR-0012](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/decisions/ADR-0012-company-merge-and-dispute-lifecycle.md)를 확인했다. ADR의 초기 외부인 in-place 분기는 현행 domain 문서의 별도 인증 회사와 양방향 제안, 구형 in-place 사건 해석과 다르다. 현행 domain 문서와 백엔드 기본 분기를 대조했다.
- 백엔드 `dev` `ab388b7cb06154a00e254eff7b124882952166ac`의 [Controller](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companymerge/CompanyMergeController.kt)와 [공개 응답](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companymerge/response/CompanyMergeResponses.kt)을 [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs)와 대조했다. 11/20 KST 명세 조회 성공, OpenAPI 3.1.0/v1, 전체 184개 중 회사 통합 경로 13개다. [동일 SHA의 CI·dev 배포 잡](https://github.com/mate-pjt/mate-backend/actions/runs/44429902651)은 성공했다. 실행 중 process SHA와 실제 권한별 wire 응답은 미확인이다.
- Figma G01~G03 기준선의 9개 frame metadata와 같은 영역의 상태 변형 이름을 확인했다. 원본 frame과 상태는 위 링크에 보존한다. 관찰은 11/20 KST의 읽기 전용 조회이며 revision 고정본, 실제 화면 동작 또는 픽셀 검증 증거는 없다.

| 결정 요청 | 확인한 차이 | 추천 | 답변 기준 |
| --- | --- | --- | --- |
| D1 · 진입과 발송 범위 | 같은 번호의 인증 충돌 case에만 요청·제안·응답이 있다. 별도 철회·재발송 명령은 없고, 같은 회사의 자체 인증은 별도 사건을 생성하지 않는다. | 현행 사건만 제공하고 철회·재발송 보류 | DEV-34의 허용 행동과 Figma 진입 범위를 확정한다. |
| D2 · 회사 정보 검토 | 검토 두 단계와 팀원별 결정은 나눌 수 있다. 회사 정보 DTO는 세 건수와 희망금액 설정 여부, 명령은 한 번의 `TRANSFER`/`SKIP`이다. | 두 단계 유지, 회사 정보는 요약과 일괄 이전·건너뛰기 | DEV-35/36의 회사 정보 화면 범위와 세부 값 계약 필요 여부를 정한다. |
| D3 · 거절 상태와 사유 | 팀원별 거절, 원본의 제안 `DECLINE`, 인증 회사 검토 거절이 따로 있다. 인증 회사의 사유 입력은 필요하지만 조회 응답에 해당 사유 필드가 없다. | 두 거절을 구분하고, 조회에 없는 사유는 미제공으로 표시 | DEV-37의 거절 사유 영역과 이의제기 안내 범위를 정한다. |

- 재개 위치는 D1~D3 답변의 결정자·시각·범위를 기록하는 단계다. 정책 문서와 후속 범위는 답변에 맞춰 확정한다. 조사 명세와 Git 전달 승인은 정책 답변을 대신하지 않는다.

### 확인한 서버 계약

아래는 11/20 KST에 고정 소스와 게시 명세를 대조한 사실이다. 웹 적용과 화면 예외는 D1~D3 답변에 따라 기록한다.

| 대상 | 관찰 | 소유 근거 |
| --- | --- | --- |
| 자격·시작 | 기존 미인증 회사의 적격 구성원은 회사 ID를 유지하며 인증한다. 외부 인증자가 선택하면 별도 인증 회사가 생기며 기존 회사와의 `CROSS_COMPANY` 사건을 둔다. `IN_PLACE_MEMBER_REVIEW`는 별도 기존 유형이다. | [등록 분기](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companyregistration/CompanyRegistrationPersistenceAdapter.kt) |
| 조회 | `GET …/merge-cases/current`는 검토 대기·거절·이의제기 중 조회 가능한 사건을 반환한다. 소스는 조회 결과가 없으면 `204`를 반환하며 게시 명세의 응답 목록에는 `204`가 없다. `GET …/merge-cases/{caseId}`는 별도 상세다. 원본 쪽 응답은 자신의 행만, 인증 회사 쪽은 검토를 연 뒤 권한 범위의 팀원과 자료 요약을 제공한다. | [Controller](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companymerge/CompanyMergeController.kt) · [조회 어댑터](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companymerge/CompanyMergeQueryPersistenceAdapter.kt) |
| 개시와 권한 | 원본의 신청, 제안 수락, 제안 응답 기한 경과, 운영 재검토는 각기 다른 검토 개시 근거다. `CROSS_COMPANY`의 `reviewRequested`는 실제 원본 신청 여부다. 구형 `IN_PLACE_MEMBER_REVIEW`는 최초 등록부터 이 값이 참일 수 있으며 실제 개시 사유는 두 유형 모두 `reviewOpening.origin`에서 읽는다. `actions`의 true/false/null과 제출 시 서버의 최신 판정은 별개다. | [개시 원인](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/domain/companymerge/CompanyMergeReviewOpening.kt) · [행동 가능 여부](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymerge/CompanyMergeServices.kt) |
| 버전 충돌 | 명령은 case의 `expectedRevision`을 받는다. 서버는 최신 case와 비교하고 stale revision·상태 변경·대표자 승인 필요를 `409`로 다룬다. 게시 명세에 도메인별 오류가 전부 열거되어 있지 않다. | [입력 DTO](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companymerge/request/CompanyMergeRequests.kt) · [오류 정의](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/global/exception/CompanyMergeErrorCode.kt) |
| 검토·최종화 | 일반 구성원 기본안은 원본 직급명과 VIEWER다. 원본 대표자와 인증 회사의 공동대표 추가에는 별도 명시 조건이 있다. 모든 구성원 결정·수동 설정·필요한 대표자 승인을 검증하고 존속 회사의 관리자가 남을 때 최종 반영한다. `FINALIZED`와 원본 정리 완료는 별도다. | [검토 정책](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/domain/companymerge/CompanyMergeReviewPolicy.kt) · [최종화 transaction](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companymerge/CompanyMergeFinalizeWriter.kt) |
| 자료·복구 | 수동 설정은 allowlist의 현재값만 복사하고 충돌 시 인증 회사의 기존 값을 보존한다. 원본 문서의 이전은 없다. 운영의 인증 취소·원본 복구는 이의제기 접수 사건에 한정되며, 비동기 정리 후 파기된 문서를 되살리는 경로는 없다. | [수동 설정 이전](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companymerge/CompanyMergeManualSettingsTransferWriter.kt) · [운영 복구 처리](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companyregistrationdispute/CompanyRegistrationDisputeCancellationWriter.kt) |

정적 비교에서 Controller와 게시 명세의 메서드·경로 집합이 13/13 일치했다(GET 2, POST 11). 사유·요약 필드와 `revision`도 대조했다. 기존 79개 원본 ID, WBS 114개 작업·156개 의존, 기준선 blob 유지와 `git diff --check`는 조사 체크포인트에서 확인했다.

조사 범위 독립 검토에서 Blocker·Major 없이 Minor 1건을 발견했다. 구형 in-place 사건의 `reviewRequested` 의미를 위 표에 보완했다. 최종 정책과 후속 인계의 Review Gate는 답변 뒤 실행한다.

### 2026-11-20 09:19 KST · D1·D2 사용자 결정

| ID | 이번 대화 사용자의 답변 | 승인 범위 |
| --- | --- | --- |
| D1 | “현행 사건만 제공. 그리고 철회/재발송 관련 API는 … issue로 올리기.” | 같은 사업자번호의 현행 사건을 웹 기준으로 삼는다. 제출된 요청·제안의 철회/재발송은 계약 공백으로 남기고 Linear의 백엔드 이슈 1건에 요청한다. 새 API 동작이나 개발 일정을 확정한 답변은 없다. |
| D2 | “두 단계 유지, 회사 정보는 요약과 일괄 이전·건너뛰기 (추천)” | Figma의 팀원 → 회사 정보 검토 두 단계를 유지한다. 회사 정보 화면의 세부 값/행별 반영을 서버 요약과 전체 `TRANSFER`/`SKIP`으로 한정하는 화면 예외를 승인했다. |
| D3 | 사용자가 팀원별 제외와 사건 전체 거절의 차이 및 사유 미제공이 의미하는 바를 구체적으로 설명해 달라고 요청했다. | 팀원 일부 제외, 사건 전체의 거절과 3일 이의제기, 인증 회사가 입력한 전체 거절 사유의 조회 공백을 예로 설명했다. 화면 예외 선택은 답변을 기다린다. |

재개 위치는 D3 답변 확인과 D1에서 승인된 Linear 이슈의 중복 확인·등록 결과 기록이다. 후속 Task는 각 자체 Gate에서 착수한다.

<a id="pol-16-withdrawal"></a>

### 2026-11-20 09:20 KST · 철회·재발송 계약 요청 전달 시도

- 기존 [MAT-208](https://linear.app/mate-pjt/issue/MAT-208)의 양방향 최초 제안·응답과 [MAT-215](https://linear.app/mate-pjt/issue/MAT-215)의 Web Reference 근거를 확인했다. 둘은 기존 흐름의 소유 근거다. 같은 제목의 철회·재발송 이슈는 검색 결과에서 발견되지 않았다.
- 이번 D1의 명시 승인으로 Linear Mate 팀에 `backend: 회사 합치기 요청·제안 철회와 재발송 API`를 Backlog, `repo:mate-backend`·`Improvement` 라벨로 등록을 시도했다. Linear가 무료 워크스페이스 이슈 한도 초과로 HTTP 400을 반환했다. 이후 제목 검색에서도 생성 건을 확인하지 못했다. 이슈 ID·담당자·일정은 확보되지 않았다.
- 요청 초안의 범위는 원본 검토 신청과 인증 회사 최초 제안의 발신 철회 가능 권한·상태·기한, 철회 뒤 새 발송과 동일 요청 replay의 구분, 상대 응답·기한·최종화와 경합 시 revision·오류, 이력·알림과 중복 방지다. 전용 공개 계약과 합성 데이터 회귀 근거를 요청한다. 세부 동작·기한·API 형태는 백엔드·기획 검토 대상으로 남긴다.
- 워크스페이스에서 새 이슈를 만들 수 있게 되면 같은 제목과 범위로 중복 재확인 후 등록한다. 공개 계약과 개발 명세·실행 대응을 확보한 뒤 별도 변경 범위를 결정한다. 이 외부 등록 차단은 현행 범위의 DEV-34 선행 조건을 추가하지 않는다.

<a id="pol-16-brief"></a>

## 2026-11-20 09:21 KST · 확정 Brief와 착수 체크포인트

- 이번 대화 사용자는 D3 예시 설명 뒤 **“실제 거절 사유 조회 API를 먼저 확보”**를 선택했다. 팀원별 제외와 사건 전체 거절을 구분하고, 인증 회사가 사건을 거절했을 때 원본 회사에 표시할 화면은 권한이 반영된 실제 거절 사유 조회 계약을 선행한다. `미제공`으로 먼저 연결하는 화면 예외는 승인되지 않았다.
- G01~G03의 성공 기준은 D1~D3와 기존 중앙 정책을 추적 가능한 근거로 고정하고, 자격·발송 상태·팀원 및 설정 검토·최종 반영/거절·동시성·감사/복구·후속 조건을 문서화하는 것이다. 10/27 기준선 체크리스트는 당시 후보 이력이며 이번 확인은 [종료 체크리스트](#pol-16-close)에 둔다.
- 편집 전 제시한 범위는 이 파일의 확정 정책·Figma 대응, WBS 및 DEV-34~37 인계, `docs/qa/company-merge.md`와 QA 인덱스, `docs/ai-context/plan.md` 연결, `reviews/POL-16.md`다. 기존 담당과 선행 연결을 유지한다. 실행 코드는 범위 밖이고 승인된 외부 쓰기는 D1의 Linear 이슈와 POL-16의 Git 전달이다.
- 시작 branch/HEAD는 조사 체크포인트와 같다. 당시 로컬 조사 기록 외 미커밋 변경은 없었다. 다음 행동은 정책과 검증 기준을 먼저 작성하고 후속 기록/WBS를 연결하는 단계다. 위험은 승인과 실제 이전 혼동, 권한 경계를 넘어선 자료 표시, 버전 충돌로 인한 중복 제출, 거절 사유 추정이다.
- 검증은 고정 소스·명세와 Figma 근거, Markdown 링크·ID·형식, WBS 114작업/156의존과 원본 79개·스냅샷, 변경 범위, `git diff --check`, `context-audit`, 독립 verifier와 `ai-review`다. 로컬 앱 실행/자동 빌드는 문서만 바뀌므로 제외한다. QA 계획의 실제 실행과 원격 CI를 별도 판정한다.

<a id="pol-16-contract"></a>

## 확정 정책 v1 · 2026-11-20

같은 사업자번호의 두 회사가 충돌할 때 기존 미인증 회사를 **원본 회사**, 검토 뒤 존속할 인증 회사를 **인증 회사**로 부른다. 아래는 [D1~D3 승인](#pol-16-brief)과 [중앙 합치기 정책·고정 서버 근거](#pol-16-investigation)를 웹의 기준으로 삼은 결과다. POL-12의 저장값·자료 출처와 POL-14의 실제 권한·대표자·최후 관리자 규칙을 이어받되, 통합 사건의 개별 승인과 최종 반영은 이 계약을 사용한다. [POL-12](POL-12.md#pol-12-contract) · [POL-14](POL-14.md#pol-14-contract)

### G01 · 대상, 요청과 제안, 상태

| 상황 | 웹에 적용할 기준 |
| --- | --- |
| 회사 조합 | 같은 번호의 인증 회사와 기존 미인증 회사가 서버의 `CROSS_COMPANY`로 연결된 경우만 새 통합 흐름에 진입한다. 다른 사업자번호, 두 인증 회사, 두 미인증 회사의 임의 선택은 범위 밖이다. 기존 미인증 회사의 적격 구성원이 자기 회사를 인증할 때는 기존 ID·소속을 유지한다. 외부 인증자는 별도 인증 회사를 만들며, 기존 회사 이어받기를 선택하면 최초 제안을 함께 보낸다. 과거 `IN_PLACE_MEMBER_REVIEW`는 같은 회사에서의 기존 사건으로 해석한다. |
| 원본 회사의 검토 신청 | 활성 원본 소속과 현재 `COMPANY_MERGE_REQUEST` 및 `canRequest === true`를 확인한다. 현재 조회에서 확인된 사건 ID에 `POST …/request`로 명시 제출한다. 메시지는 선택이며 최대 1,000자다. 접수는 검토 개시다. |
| 인증 회사의 최초 제안 | 활성 인증 회사 소속과 현재 `COMPANY_MERGE_REVIEW`, `canPropose === true`를 확인한다. `POST …/proposals`는 보호 기한 안의 최초 제안이다. 현재 요청 권한이 있는 원본 구성원은 `canRespondToProposal === true`일 때 `ACCEPT` 또는 사유를 넣은 `DECLINE`으로 응답할 수 있다. 원본의 직접 신청과 제안 수락의 기록은 구분한다. |
| 기한 | 최초 보호는 새 인증 회사 생성부터 7일, 제안 응답은 최초 제안부터 7일이다. 제안이 없고 신청 없이 최초 보호가 끝나면 정리 대상이다. 제안 무응답은 검토만 연다. 별도 검토 결정 기한이 지난 열린 사건은 운영 심사 대상이 될 수 있다. 서버의 현재 시각, `actions`, `proposal.responseDueAt`, `decisionDueAt`과 개시 기록을 사용한다. 브라우저의 시간 계산으로 사건 전이를 확정하지 않는다. |
| 조회와 노출 | 동일 회사 공급원의 `GET …/current`와 사건 상세로 회사·사건·접근 범위를 확인한다. 원본 쪽은 본인에게 허용된 상태·자기 팀원 행만, 인증 회사는 검토가 열린 뒤 권한 범위의 팀원 및 자료 요약만 다룬다. `204`를 읽을 때 현재 사건 없음과 권한이 확인되지 않은 경우를 구분한다. `/current`에서 사건이 사라진 것만으로 완료나 거절을 판단할 수 없다. |
| 진행·철회 | `REVIEW_PENDING` 안에서 최초 보호·제안 응답 대기·검토 개시를 별도로 표시한다. 서버의 `reviewOpening.origin`으로 실제 신청·수락·자동 개시·운영 재검토를 구분한다. 제출 전 작성 중 닫기는 화면 동작이다. 제출된 검토 신청·제안의 철회 및 재발송은 전용 계약 대기다. 기존 개인 소속 신청 취소, 수신자의 제안 거절, 동일 명령 replay를 발신 철회로 사용하지 않는다. [후속 요청](#pol-16-withdrawal) |

### G02 · 팀원 → 회사 정보 검토

- 인증 회사의 활성 검토자는 `COMPANY_MERGE_REVIEW`와 `canReview`를 사용한다. 구형 같은 회사 사건은 일반 결정·최종화를 최초 인증자의 자격으로 한정한다. 인증 회사의 현재 대표자에게 필요한 별도 대표자 승인만 허용되는 경우도 실제 서버 capability에 따른다.
- 서버의 구성원 snapshot에서 한 명, 선택한 구성원 집합(최대 200명), 원본 직급 한 그룹을 검토할 수 있다. 원본 직급과 ID 목록을 같은 명령에 함께 보내지 않는다. 일반 구성원 빠른 승인은 원본 직급명과 VIEWER다. 원본 대표자는 대표자 여부·직급·권한을 명시적으로 결정한다. 직급명 변경 또는 원본 대표자를 일반 직급으로 둘 때의 `COMPANY_MEMBER_PROFILE_EDIT`, VIEWER 밖 권한의 `COMPANY_MEMBER_PERMISSION_MANAGE`와 실제 보유 권한 부분집합을 적용한다.
- 승인할 일반 직급은 인증 회사의 활성 일반 직급 ID 또는 새 일반 직급명 한 가지다. 대표자 선택은 실제 ADMIN 전체 leaf를 가진 검토자가 대표자 직급과 ADMIN으로 정한다. 기존 활성 대표자가 있을 때 새 대표자를 선택하면 현재 인증 회사의 활성 대표자 중 검토 leaf 보유자의 별도 승인이 필요하다. 후보 집합과 현재 revision을 검증하고 이전 승인을 임의 재사용하지 않는다.
- 팀원별 `APPROVED`·`REJECTED`는 검토 초안이다. `PENDING`은 미결정이며 선택하지 않은 행과 명시 거절 행을 구분한다. 여러 명을 한 번에 결정할 때 한 행이라도 무효면 그 요청 전체를 저장하지 않는다. 검토 중인 원본 사람의 실제 인증 회사 소속·권한과 관리자 수는 최종화 전에 늘지 않는다.
- D2에 따라 회사 정보 탭의 원본 요약은 사용자 확인 업종 건수, 수기 시공능력 건수, 수기 인증 건수, 공고 희망금액 설정 유무만 읽는다. 검토자에게 `COMPANY_INFORMATION_EDIT`와 `canDecideManualSettings`가 있을 때 요약 전체를 **이전**(`TRANSFER`) 또는 **건너뛰기**(`SKIP`)로 명시 결정한다. 항목별 값이나 반영 선택, 실제 copy 건수는 이 요약으로 산출할 수 없다. 값이 `null`이면 제공 범위를 확인하고 숫자 0으로 대체하지 않는다. 같은 회사의 구형 사건은 자료 결정 `NOT_APPLICABLE`이다.

### G03 · 최종화, 거절, 충돌과 복구

| 영역 | 정책과 판단 기준 |
| --- | --- |
| 전체·부분 승인 | 열린 검토에서 모든 팀원 결정을 끝내고 자료를 명시 결정하며 필요한 대표자 승인을 받아야 한다. `canFinalize === true`일 때 한 번의 명시적 최종화로 처리한다. 팀원 전원 승인, 일부 승인과 자료 이전 여부를 각각 확인하고 실제 이전 인원은 `finalizedMemberCount`를 사용한다. 전원 팀원 제외는 그 팀원 결정들의 집합이다. 이를 사건 거절로 자동 변환하지 않는다. 이전 인원 0명의 최종화도 서버가 허용하는 경우 별도 효과 확인과 명시 제출이 필요한 행위다. |
| 소속·자료 반영 | 최종화의 서버 transaction에서 검토 대상 원본 소속을 종료하고 승인된 사람만 인증 회사 소속을 만든다. 선택한 직급·leaf를 적용하고, 원본 회사의 대기 초대 전부와 승인된 이전 대상자에 대한 인증 회사의 충돌 대기 초대를 취소한다. 원본 soft delete와 사업자 identity 연결 해제, `FINALIZED` 및 완료 기록도 함께 적용한다. 존속 회사에 실제 전체 leaf를 가진 활성 관리자가 한 명도 남지 않으면 전부 rollback한다. 구형 같은 회사 사건은 기존 소속에 결정 내용을 적용하고 거절된 소속을 종료한다. |
| 승계 | `TRANSFER`는 허용된 수동 설정의 현재값만 복사한다. 같은 자연키 또는 희망금액 설정이 이미 있으면 인증 회사 값을 보존한다. `SKIP`은 복사하지 않는다. 법적 기본정보, 외부 자동 수집 실적과 원문, 원본 문서, 선택하지 않은 데이터의 포괄 이전은 이 계약에 속하지 않는다. 팀원과 수동 설정은 별도 결정이며 승인 단계에서는 어느 쪽도 실제 이전하지 않는다. |
| 버전과 오류 | 양의 현재 `revision`에 대한 `expectedRevision`을 보내고 인증·계정·회사·사건·대상 범위를 다시 확인한다. revision/상태/대표자 승인 충돌은 최신 상세와 capability를 읽고 재검토한다. 401·403과 접근 불가 404/204를 성공으로 해석하지 않는다. timeout·5xx·손상 응답은 결과 미확정으로 보고, 동일 사건 조회로 결과와 권한을 대조한 뒤 사용자 행동을 받는다. 자동 재제출과 성공을 단정하는 빈 화면은 허용하지 않는다. |
| 사건 거절 | 원본 회사의 제안 `DECLINE`과 인증 회사의 검토 거절(`POST …/rejection`)을 `rejectionOrigin`으로 구분한다. 두 전이 모두 공백을 정리한 1~500자 사유가 필요하며 팀원별 제외와 독립적이다. 서버의 `REJECTED`, `rejectedAt`, `appealDueAt`을 기준으로 한다. `proposalResponse.reason`은 이 응답의 실제 제안 거절에만 해당한다. 인증 회사의 거절 사유는 입력·저장되지만 현재 case 조회에 없다. **D3에 따라 원본 회사의 해당 거절 상세 화면 연결은 권한이 적용된 실제 사유 조회 계약부터 확보한다.** |
| 이의제기·감사 | `COMPANY_APPEAL_SUBMIT`을 가진 활성 원본 구성원에게 거절 후 3일 내 이의제기 기회가 있다. `APPEAL_SUBMITTED` 동안 정리를 보류한다. 문의는 별도이며 `/appeal`·`/inquiries`의 UUID 멱등 키와 현행 revision을 사용한다. 검토 개시 원인·거절 주체·버전·기한·운영 판정 이력을 보존한다. 사용자 화면이 운영 판정 또는 외부 메시지를 대신 실행하지 않는다. |
| 복구·정리 | 운영자는 이의제기 사건에서 인증 회사 유지·재검토·인증 취소와 기존 원본 복구를 결정할 수 있다. 응답 지연 사건에서는 유지나 재검토만 가능하다. 재검토는 과거 이력과 구분한 새 개시와 새 7일 결정 기한을 사용한다. 정리 시작·완료와 `FINALIZED`는 별개다. 성공 뒤 별도 정리 job의 실패는 이전된 소속을 되돌리지 않는다. source 문서는 원본에서 파기하며, 공유·참조·활성 소속 등 보호 조건이 있으면 정리를 보류한다. 일반 undo와 이미 파기된 원본의 복원을 제공하지 않는다. |

### Figma 상태별 적용과 화면 예외

기준선 9개 frame의 metadata와 인접 변형 제목·일부 문구를 확인했다. 아래 대조는 상태와 동작 범위다. 새 route나 화면 전체에 대한 시각적 예외는 각 DEV의 Gate에서 확인한다. [MAT-215](https://linear.app/mate-pjt/issue/MAT-215)의 과거 검증과 현재 [Web Reference 제안·개시](https://github.com/mate-pjt/mate-web-reference/blob/cefcc573270b9fbecb30f671d230d0506021fcbc/src/features/company-merge/company-merge-proposal.tsx), [팀원·설정 검토](https://github.com/mate-pjt/mate-web-reference/blob/cefcc573270b9fbecb30f671d230d0506021fcbc/src/features/company-merge/company-merge-review.tsx), [원본 상태](https://github.com/mate-pjt/mate-web-reference/blob/cefcc573270b9fbecb30f671d230d0506021fcbc/src/features/company-merge/company-merge-source-status.tsx)는 다른 저장소의 참고 근거다.

| 원본·상태 | 관찰 및 후속 기준 |
| --- | --- |
| G01 인증/미인증 요청 [3042:58164](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3042-58164) · [3043:58602](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3043-58602), 접수 [3043:58978](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3043-58978) · [3046:53262](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3046-53262) | D1의 현행 사건으로만 진입한다. 접수 문구는 요청 또는 최초 제안의 완료를 뜻한다. 실제 통합 `FINALIZED`와 구분한다. 제공 범위 제한을 임의의 시각 레이아웃 변경 승인으로 해석하지 않는다. |
| G02 받은 요청 [3052:55919](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3052-55919) · 대표자 [3066:56069](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3066-56069) · 회사 정보 [3070:62541](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3070-62541) | 팀원 검토와 회사 정보 검토를 유지한다. D2의 한정 화면 예외는 회사 정보의 세부 값과 행별 선택을 요약·일괄 이전/건너뛰기로 표시하는 것이다. 대표자 표시는 실제 선택·별도 승인 가능 여부를 따른다. |
| G03 최종 확인 [3076:66722](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3076-66722) · 일부 [3077:127263](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3077-127263) · 전원 팀원 제외 [3068:61910](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3068-61910) | 전체/부분을 별도 인위적 status로 만들지 않는다. 최신 팀원 결정과 자료 선택, 처리에 따른 영향을 검토 후 최종화한다. 접수·검토 저장·최종 성공을 서로 다른 상태로 확인한다. |
| G01 원본 측 거절 [3298:52565](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3298-52565) · G03 거절 확인 [3077:127950](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3077-127950) · 거절 완료 [3077:129182](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3077-129182) | 사유 입력과 사유 조회는 별개다. D3는 해당 거절 화면의 계약 선행 조건이다. 거절 뒤 빈 요청 화면이 보여도 사건 삭제·복구로 단정하지 않는다. 상태·권한·실제 사유와 이의제기 기한이 확인된 뒤 지정 상태를 연결한다. |

<a id="pol-16-handoff"></a>

## 후속 개발의 소유와 재개 기준

| 담당 | 완료 기준과 다음 Gate |
| --- | --- |
| [DEV-34](DEV-34.md) · G01 | 현재 접근 가능한 case 조회, 원본 신청·인증 회사 제안과 명시 응답, 개시 원인과 기한, 접수·빈/오류·불확실 상태를 연결한다. D1의 철회·재발송 및 D3의 인증 회사 거절 상세를 별도 범위로 둔다. 현재 실행 계약·권한별 합성 자원·QA 허용 범위를 착수 Gate에서 확인한다. |
| [DEV-35](DEV-35.md) · G02 | 검토 개시·소속/leaf 이후 팀원 단건/묶음·대표자 조건과 회사 정보 요약·일괄 결정, 미결정/무권한·오류를 검증한다. WBS의 DEV-34·DEV-08 선행과 후자의 실제 QA 차단을 유지한다. |
| [DEV-36](DEV-36.md) · G03 승인 | 전부/일부와 자료 결정 조합, 대표자 승인·최후 관리자, version·동시 처리/rollback 및 실제 반영 확인을 검증한다. DEV-35 선행이 필요하다. |
| [DEV-37](DEV-37.md#dev-37-pol-16-handoff) · G03 거절 | 최신 권한·revision으로 사유 있는 사건 거절, 실제 거절 사유·주체·기한의 양측 갱신과 이의제기 안내를 검증한다. 기존 DEV-35에 더해 D3의 실제 사유 읽기 계약이 필요하다. 필드명이나 별도 URL은 소유 계약에서 확정한다. 원본 회사의 적격 열람 범위, null/구형 사건, 타사·권한 상실, 제안 거절 사유와의 구분을 소스·Swagger·승인된 합성 응답에서 확인한다. |

DEV-34~37의 [QA 계획](../../../qa/company-merge.md#pol-16-merge-qa)은 실행 자원·권한·데이터 잔존과 정리/복구 승인을 각 Task에서 확인하는 기준이다. 후속 작업의 실제 업무 호출·로컬 선행 예외·별도 알림 경로 승인이나 운영 권한을 부여하지 않는다. 사람과 자료가 실제로 이전되는 검증은 승인된 합성 사건과 복구 범위를 확보한 뒤 수행한다.

<a id="pol-16-close"></a>

## 2026-11-20 · 문서 검증과 종료 체크포인트

- [x] D1의 회사 조합·최신 권한과 요청/제안·기한, 철회·재발송 계약 대기를 기록했다.
- [x] D2의 검토 두 단계·수동 설정과 전체/부분·승계·충돌·감사/복구를 기록했다.
- [x] D3의 거절 화면 계약 선행과 결정자·시각을 기록했다. DEV-34~37의 소유·조건과 MERGE-01~16 미실행을 연결했다.
- [x] 문서 검증과 Documentation Update Check를 수행했다. [검사 및 Context Audit](../reviews/POL-16.md)
- [x] 독립 verifier·`ai-review`를 수행하고 세 Minor를 보완했다. [Review Gate](../reviews/POL-16.md)

문서 검사에서 원본 79개와 WBS 114작업/156의존, QA 16건 미실행, 기준선과 coverage 보존 및 `git diff --check`를 확인했다. `plan.md`, 후속 Task, QA 인덱스와 계획을 갱신했다. 제품 구조·데이터 계층·스크립트·하네스 변경이 없어 `base.md`, `architecture.md`, `data-access.md`, `harness.md`, `ai-failures.md`는 갱신 사유가 없다. 원격 전달은 최종 PR head의 별도 검증이다.

P0/P1과 앞선 P2의 차단 및 미충족 선행을 적용하면 표 순서상 첫 후보는 [DEV-34](DEV-34.md)다. POL-16과 DEV-28 선행 결과를 근거로 선정한다. 첫 행동은 최신 main과 현행 G01 사건 조회·신청/제안·응답 계약, 권한·기한·합성 QA 자원을 자체 요구사항 Gate에서 확인하는 것이다. 철회·재발송 요청과 DEV-37의 사유 조회 차단을 보존했다. 이번에는 선정과 인계까지만 수행했다.

Git 전달은 `docs/pol-16-company-merge-policy`에서 정책·QA·리뷰 기록과 후속 인계를 목적별로 커밋한다. [이 작업 브랜치의 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fpol-16-company-merge-policy)에서 실제 최종 head·CI·리뷰와 병합 조건을 확인한다. 승인된 Chromatic 월간 한도 예외는 이번 PR에만 적용한다. 병합 결과와 로컬 main fast-forward는 PR과 종료 보고에서 확인한다.

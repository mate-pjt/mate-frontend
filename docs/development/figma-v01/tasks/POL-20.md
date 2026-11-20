# POL-20 · 받은 알림 삭제/숨김·보존 정책 확정

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 정책 결정
- 원본 항목: N02
- 선행 작업: [DOC-001](DOC-001.md)
- 목적/범위: 사용자별 삭제/숨김 의미·보존 기간·읽음/건수 영향·서버 명령을 확정한다. 추천: 7일 문구는 승인 전 복원하지 않는다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### N02 · 받은 알림 편집·선택·삭제
- 기준선: UI **준비 중**, 동작 **보류**, 데이터 **삭제 계약 미연결**. 검증: 새 mock 비활성 확인.
- 남은 점: 보존·숨김/삭제 의미와 서버 명령 후 연결; 7일 보존 문구도 정책 보류
- Figma: [2304:88975](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2304-88975) / [2304:89462](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2304-89462) / [2305:29539](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2305-29539) / [2304:89973](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2304-89973)
- 소유 소스/기존 기록: [src/components/alarms/alarm-page-client.tsx:169](../../../../src/components/alarms/alarm-page-client.tsx)、[docs/qa/alarms.md:65](../../../../docs/qa/alarms.md)

## 완료 기준

- [x] 삭제/숨김·단건/일괄·복구 가능 여부·서버 계약을 기록한다
- [x] 보존 책임·이미 삭제/부분 실패·권한/건수 갱신을 확정한다
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

## 2026-10-27 · 작업 후보 작성 당시 검증·리뷰·인계 기록

현행 검증과 리뷰 이력은 [2026-11-20 검증](#pol-20-verification)에서 이어간다.

| 구분 | 실행 명령/사례·환경 | 결과 | 증거/미실행 이유 |
| --- | --- | --- | --- |
| 이번 작업 | 미실행 | 미판정 | 기준선의 과거 결과와 구분 |

- 자동 수정 시도: 0/3. 실패 시 명령·오류·원인·최소 수정·재검증 결과를 추가한다.
- Documentation Update Check: 착수 후 판단. base/architecture/data-access/plan/harness/ai-failures 중 영향 문서와 갱신/미갱신 이유를 기록.
- Review Gate: 미실행. verifier와 ai-review의 결과/대상 diff·후속 변경 재검토 여부를 기록.
- 커밋/PR: 없음. 추후 커밋할 때 하나의 목적·영어 type/한국어 메시지, 런타임/테스트/문서는 가능한 별도 커밋.
- 다음 작업 인계: WBS에서 선택. 이 단위의 필수 검증 PASS 전에 다른 기능으로 자동 전환하지 않는다.

## 2026-11-11 · QA-17 전수 점검 보완

- 근거: [감사 CF-21](../audits/2026-11-11.md#cf-21) · [route/API·출처 인덱스](../audits/2026-11-11.json).
- 범위/소유: 현재 삭제 operation POST /api/v1/me/notification-deletions가 문서화돼 있다. body가 JsonNode여서 source의 실제 형태/validation/오류를 확인해야 한다.
- 추가 완료/재개 기준: 삭제/숨김·소유권/일괄부분처리·멱등/버전·건수/읽음/cursor·보존/복구를 현재 계약으로 결정한다. 7일 보존을 임의 적용하지 않는다. DEV-43 구현·DEV-62 안내 문구와 분리.
- 이 절은 날짜별 후속 계획이다. 앞선 결정/QA/예외 이력을 대체하지 않으며 제품 구현·실제 업무 API 변경/새 통합 PASS는 없다. 상태는 WBS에서만 관리한다.

<a id="pol-20-dev-41-handoff"></a>

## 2026-11-20 · DEV-41에서 선정 및 인계

- 앞선 P0/P1 및 P2의 차단·미충족 선행을 적용하면 DOC-001이 충족된 첫 P2 정책 후보다. [선정 근거](DEV-41.md#dev-41-close) · [현재 WBS](../README.md)
- 첫 행동은 최신 main의 N02 기준선과 중앙 알림 정책, 백엔드 삭제 명세·소유 소스, 기존 받은 알림 QA를 대조해 요구사항 Gate를 작성하는 것이다. 보존 기간, 삭제/숨김의 의미와 복구, 읽음·미확인 수 및 부분 실패/권한의 결정 범위를 확인한다.
- 이번 기록의 범위는 다음 선정과 첫 행동의 인계다.

<a id="pol-20-brief"></a>

## 2026-11-20 · 착수 Brief 및 승인 근거

- 출발 기준은 로컬·원격 `main` `6eb78d052108be16d6a16b65986080f0f307a9c8`이다. 14:16 KST fetch·fast-forward 확인 시 양쪽 차이 0/0, 작업트리 clean, 기존 POL-20 로컬·원격 브랜치 없음. DOC-001 `9eae9c0`, DEV-62 `65b649d`, POL-19 [PR #99](https://github.com/mate-pjt/mate-frontend/pull/99), DEV-41 [PR #100](https://github.com/mate-pjt/mate-frontend/pull/100)의 main 반영을 확인하고 `docs/pol-20-alarm-deletion-policy`를 생성했다.
- **요구사항 및 성공 기준.** N02의 본인 알림 단건·선택·전체 삭제, 범위와 재요청, 읽음/건수/페이지, 데이터 보존과 복구 지원 여부를 근거로 정의한다. 보존 기간과 물리 파기의 담당 및 재검토 조건, Figma 4개 상태와 후속 테스트를 연결한다. 문서 검증과 두 리뷰 결과를 확보한다.
- **정책 근거.** 제품 결정자는 [MAT-254](https://linear.app/mate-pjt/issue/MAT-254/backend-받은-알림함-삭제-api-누락-보완)에 기록된 사용자다. 2026-10-22에 불러오지 않은 알림도 포함하는 계정 전체 삭제와 프런트 연결을 승인했다. 10-13·10-14의 선택 ID 전용 범위는 이전 이력이다. 승인 기록의 범위는 수동 삭제이며 보존 기간 스케줄러와 디자인 변경은 별도다. 백엔드와 제품·데이터 정책 담당 역할은 각 소유 조건을 확인한다. 7일 자동 삭제와 복구를 보장하는 승인 근거는 확인되지 않았다.
- **이번 승인.** 사용자의 2026-11-20 요청은 POL-20 문서 검증과 두 리뷰, 목적별 commit/push·PR·최종 head CI·정상 병합·로컬 main fast-forward 및 이번 PR의 Chromatic 월간 한도 예외를 승인했다. 과거 MAT-254의 개발 백엔드 병합·테스트 배포 승인과 별개다. 제품 코드, 중앙 정책·Figma 파일 편집, 실제 업무 요청·데이터 변경·운영·배포와 DEV-43 자체 실행은 범위 밖이다.
- **설계와 영향.** 현행 [알림 화면](../../../../src/components/alarms/alarm-page-client.tsx#L158), [알림 Repository](../../../../src/data/notifications/client.ts), [헤더 알림](../../../../src/components/alarms/notification-bell.tsx), [공용 Toast](../../../../src/components/ui/toast/toast.tsx)와 데이터 접근 가이드를 확인했다. 이 기록·DESIGN·데이터 접근 가이드에 정책 경계를, 받은 알림 QA와 QA 인덱스에 검증 기준을 추가한다. 검증·검토 후 이력과 인계를 WBS·DEV-43·공통 계획·리뷰 기록에 남긴다. 핵심 위험은 `ALL` 재전송으로 새 알림이 삭제되는 경우, 늦은 목록·건수 응답이 결과를 덮는 경우, 보존 기간을 화면이 약속하는 경우다.
- **검증 계획.** Markdown 링크·앵커·표, 원본 79건과 기준선, WBS Task/의존 관계와 다른 작업의 상태, 기존 QA·예외와 범위, `git diff --check`를 검사한다. 현재 package에는 `test`, `lint`, `build`, `build-storybook`이 있다. 문서 차수의 로컬 검증은 정적 검사와 두 리뷰로 수행한다. 현재 실행 버전과 실제 삭제 QA는 DEV-43의 별도 준비 조건이다. 정책 표와 인계의 배치는 기존 문서 형식을 따른다.

| 체크포인트 | 수행과 확인 | 다음 행동 |
| --- | --- | --- |
| 2026-11-20 14:16 KST · Codex | 깨끗한 main에서 작업 브랜치 생성. 기존 변경 0건 | 현재 개발 Swagger·백엔드 소스, MAT-254 승인, Figma N02와 기존 QA 조사 |
| 2026-11-20 14:20 KST · Codex | 기존 승인·소유 계약과 현재 화면을 대조해 요구사항 및 문서 변경 계획을 제시했다. 정책 판단에 필요한 새 사용자 결정은 없었다. | 수동 삭제 계약, 보존 보류 조건, 후속 QA 기준을 문서에 반영 |

<a id="pol-20-evidence"></a>

## 2026-11-20 · 소유 근거와 관찰 범위

| 근거 | 확인 범위 |
| --- | --- |
| 중앙 정책 | `mate-docs/main` `c9e50ff591ae18023164e1a94581c611bf1e4f29`. §1~2는 공고별 등록과 계정별 받은 이력을 구분하고 등록 해제 전 이력을 유지한다. §9에서 계정별 알림을 읽음·미확인 수의 원본으로, 변경 신호를 REST 재조회 계기로 정한다. 받은 알림의 고정 보존 기간과 사용자 복구는 정의하지 않는다. [알림 이력과 소유 범위](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/notification/overview.md#L5-L30) · [변경 신호](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/notification/overview.md#L208-L214) |
| 승인과 이력 | 2026-10-22 사용자가 미로딩 알림을 포함한 전체 삭제와 프런트 연결을 승인했다. MAT-254에 기록된 당시 참조 프런트의 격리 E2E, 10-28 개발 배포와 당시 실행 이미지 대응은 각각 과거 결과다. 현재 `mate-frontend/main`과 공유 개발 API의 검증으로 재사용하지 않는다. [MAT-254](https://linear.app/mate-pjt/issue/MAT-254/backend-받은-알림함-삭제-api-누락-보완) |
| 백엔드 소스 | `mate-backend/dev` `ab388b7cb06154a00e254eff7b124882952166ac`, `main` `4b5f31de578c41e698dda9c99e66149b7292f031`. 두 ref에 [도입 커밋 `2ad823d`](https://github.com/mate-pjt/mate-backend/commit/2ad823dde91e4eb8249df5f790d109ab89ebef4d)이 포함됐다. 아래 구현 근거는 dev에 고정했다. [백엔드 PR #126](https://github.com/mate-pjt/mate-backend/pull/126) |
| CI와 개발 배포 기록 | 위 dev SHA의 verify·publish·deploy가 2026-11-19 10:04 KST까지 성공했다. 해당 실행의 deploy-prod는 skipped다. [개발 CI #44429902651](https://github.com/mate-pjt/mate-backend/actions/runs/44429902651) |
| 게시 명세 | 2026-11-20 HTTP 200, OpenAPI 3.1.0/v1, 184 paths · 209 operations. SHA-256 `9e0b737fd92953b9f7a668aeecb61ce32b865bb3861999f9775fdfb523d21dd2`. 사용자 인증 POST와 200 응답의 `deletedCount`·`unreadCount` int64를 확인했다. body는 일반 `JsonNode`여서 scope, ID 검증과 사례별 동작은 소스에서 확인했다. [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs) |
| 현재 실행 및 업무 응답 | 현재 프로세스 SHA·이미지 digest와 모든 활성 인스턴스의 V133 적용은 미확인이다. 업무 API에 로그인하거나 읽음·삭제 명령을 실행한 건수는 0이다. 백엔드 테스트의 입력·기대값은 소스로만 열람했다. [선택·전체·동시 요청 테스트 소스](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/test/java/kr/co/mate/mate_api/adapter/input/web/notification/AccountNotificationDeletionIntegrationTest.kt#L93-L260) |
| 현재 프런트 | `6eb78d0`의 `/alarms`는 20건 목록·더 보기·읽음과 안전한 목적지 이동, 미확인 점을 제공한다. 편집 버튼은 비활성이고 선택·삭제 요청·삭제 완료 Toast는 미연결이다. 알림 Repository의 HTTP와 mock은 목록·미확인 수·읽음만 제공한다. [화면](../../../../src/components/alarms/alarm-page-client.tsx#L178) · [공개 계약](../../../../src/data/notifications/contracts.ts#L12) · [HTTP 구현](../../../../src/data/notifications/http-repository.ts#L94) · [기존 QA](../../../qa/alarms.md#dev-06-local-qa) |

### N02 Figma 상태와 후속 기준

2026-11-20 네 개의 데스크톱 프레임을 metadata와 렌더로 확인했다. 아래는 화면 상태의 기준이며 제품 브라우저 및 다른 크기의 시각 검증은 후속이다.

| 프레임 | 시안의 상태 | DEV-43 검증 기준 |
| --- | --- | --- |
| [2304:88975 · 편집](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2304-88975) | 항목 선택, 전체선택, 완료, 선택 전 비활성 삭제 | 편집 진입·완료와 선택 해제는 쓰기 없이 처리한다. 항목 선택은 읽음 및 목적지 이동과 별개다. |
| [2304:89462 · 일부 선택](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2304-89462) | 행의 선택 표시와 활성 삭제 | 단건·일부 선택은 제출한 ID만 대상으로 한다. 계정 전체 삭제는 미로딩 알림도 포함한다는 범위를 사용자가 알 수 있어야 한다. |
| [2305:29539 · 일부 삭제](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2305-29539) | 남은 알림과 ‘선택한 소식을 삭제했어요!’ Toast | 확인된 삭제 결과와 목록 재동기화를 구분한다. 숨겨진 7일 안내 레이어 `2305:29785`는 렌더에서 보이지 않았다. |
| [2304:89973 · 전부 삭제](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2304-89973) | 빈 상태와 ‘소식을 삭제했어요!’ Toast | 다시 조회한 계정 목록이 비어 있을 때 빈 화면을 표시한다. 진행 중 도착한 알림이 있으면 이를 목록·건수에 반영한다. |

삭제 효력과 자동 만료 안내는 아래 소유 계약을 따른다. 네 상태에서 확인된 시각 기준을 유지하며 신규 화면 예외 승인은 확인되지 않았다. 전체 삭제 범위를 전달하는 세부 문구와 화면·키보드 상호작용은 DEV-43의 자체 Gate에서 검토한다.

<a id="pol-20-contract"></a>

## 2026-11-20 · 적용할 삭제 계약과 보존 조건

### 대상, 권한과 보존

- 삭제는 인증된 활성·미삭제 계정의 받은 알림에 서버 `deleted_at`을 기록해 그 계정의 목록·미확인 수·읽음 대상에서 제외하는 동작이다. 계정 ID는 인증 주체에서 얻는다. 읽음 시각은 삭제와 독립적이다. 목록과 미확인 수 조회에 같은 미삭제 조건을 사용하며, 없는·타인·삭제된 알림의 읽음은 `404 AN001`이다. [서비스](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/application/service/notification/AccountNotificationService.kt#L55-L103) · [조회와 쓰기 조건](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/notification/AccountNotificationPersistenceAdapter.kt#L48-L114)
- 백엔드가 삭제 행의 사건 식별자와 관리자 전달 이력의 외래 키를 보존한다. 같은 사건 재처리는 그 행을 다시 노출하지 않는다. 다른 수신자의 알림과 공고별 구독, 초대·공고 등 원본 업무 데이터는 삭제 대상 밖이다. 확인된 API에는 되돌리기·복구 명령이 없다. [중복 처리](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/notification/AccountNotificationPersistenceAdapter.kt#L25-L45) · [V133](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/resources/db/migration/V133__account_notification_deletion.sql)
- 현재 목록 SQL에 알림 나이를 기준으로 한 제외 조건이 없다. **고정 보존 기간, 자동 삭제, 물리 파기와 복구 정책은 별도 소유 결정에 보류한다.** 현재 지원 범위에는 7일 안내·프런트 날짜 필터·만료 스케줄러·복구 UI가 없다. 제품·데이터 정책 담당자가 적용 대상, 기간·기산점, 삭제 행/이력의 파기와 복구 의무를 승인하고 백엔드 담당자가 지원 계약과 효력을 확인하면 재검토한다. 현재 행 보존은 무기한 보존 약속으로 사용하지 않는다. [MAT-254의 승인 범위](https://linear.app/mate-pjt/issue/MAT-254/backend-받은-알림함-삭제-api-누락-보완) · [기존 ALARM-05](../../../qa/alarms.md#alarm-05--7일-안내-보류)

### 명령과 결과

`POST /api/v1/me/notification-deletions`는 인증된 본인 계정에서 다음 입력만 받는다. 일반 `JsonNode` 명세의 구체 형태는 [입력 파서](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/notification/AccountNotificationDeletionRequest.kt#L8-L48)와 [Controller](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/notification/AccountNotificationController.kt#L83-L101)로 확인했다.

| 범위 | 예시 | 의미 |
| --- | --- | --- |
| `SELECTED` | `{"scope":"SELECTED","notificationIds":[21,22]}` | 단건도 같은 형식이다. 원본 배열 1~1000개, 각 값은 양의 JSON int64 정수다. 중복은 서버에서 합친다. 타인·없는·이미 삭제된 ID는 구분하지 않고 건너뛰며, 재요청에서도 이미 삭제된 행의 최초 삭제 시각을 보존한다. |
| `ALL` | `{"scope":"ALL"}` | 명시적인 계정 전체 삭제다. `notificationIds` 필드를 보내지 않는다. 해당 SQL이 보는 본인 미삭제 행 전체에 적용돼 아직 불러오지 않은 페이지도 포함한다. 범위는 호출마다 계산되며 SQL 시작 스냅샷 뒤 도착한 알림은 다음 조회에 남을 수 있다. 최신 알림까지 지울 수 있는 무조건 재전송은 금지한다. |

- scope와 허용 키·타입·양수·상한을 검증한 뒤 하나의 트랜잭션에서 변경한다. 잘못된 ID 형태 하나라도 있는 입력은 요청 전체가 `400`이며, 파서의 `INVALID_INPUT_VALUE`는 `C001`이다. 인증 실패는 401이고 서비스에서 확인하는 계정 부재·비활성은 각각 `404 AC002`·`409 AC003`이다. 타인/없는/기삭제 행의 생략은 항목별 오류나 권한 판별 결과를 반환하지 않는다. [오류 정의](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/global/exception/AccountErrorCode.kt#L15-L25) · [입력 오류](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/global/exception/GlobalErrorCode.kt#L10)
- 200 `Cache-Control: no-store`의 `data.deletedCount`는 이번 변경 행 수이며 `data.unreadCount`는 변경 뒤 조회한 계정의 미삭제·미읽음 수다. 두 값은 삭제 ID 목록·최신 전체 페이지·버전·커서와 별개다. `deletedCount=0`과 요청보다 적은 변경 수가 정상일 수 있다. wire에는 `isSuccess`가 있으며 Swagger 스키마의 `success` 표기와 차이가 있다. [응답 소스](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/global/common/CommonResponse.kt#L7-L14) · [스냅샷 범위와 결과](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/application/port/input/notification/AccountNotificationUseCases.kt#L36-L46)

### 화면과 재조회에 적용할 기준

1. 삭제는 사용자가 현재 계정에서 명시적으로 제출할 때 요청한다. 선택이 없거나 일부 항목만 선택된 상태를 `ALL`로 바꾸지 않는다. 같은 제출이 진행 중일 때 중복 명령을 막고 계정·화면 수명이 끝난 응답을 새 화면에 적용하지 않는다. 숫자 ID는 현행 알림 매퍼가 보존할 수 있는 안전한 양의 정수만 전송한다.
2. 확인된 200 결과를 바탕으로 기존 펼침 범위의 유효 페이지와 헤더 건수를 REST로 재조회한다. 0 기반 offset 페이지의 순서는 `createdAt DESC, id DESC`이다. 삭제로 페이지 경계가 이동하므로 페이지 0부터 현재 펼친 범위까지 재구성하고, 줄어든 `totalPages`·`totalElements`·다음 페이지와 빈 화면을 서버 값으로 정한다. 미확인 수는 보이는 항목 수나 `deletedCount` 차감으로 계산하지 않는다. 이전 읽음/더 보기 응답이 결과를 덮지 않게 하고, 검증한 성공 Toast는 해당 명령당 한 번 표시한다. [POL-05 펼침과 REST 원칙](POL-05.md#pol-05-contract)
3. 명시적 거절과 연결 단절·읽을 수 없는 응답 등 결과 미확정을 구별한다. 미확정은 먼저 동일 계정에서 조회로 확인하고 재제출은 새 사용자 행동으로만 받는다. 삭제 확인 후 GET만 실패하면 확인된 삭제 결과를 유지하고 조회만 재시도한다. `deletedCount=0`일 때 새 삭제 건수를 안내하지 않는다. 앱의 자동 재전송, 브라우저·프록시 수준의 중복 도착은 각각 확인한다. `ALL` 재전송이 새 알림까지 지울 수 있는 경우 활성화 전 백엔드 담당과 안전한 실행 계약을 확인한다. [기존 브라우저 재전송 관찰](../../../ai-context/ai-failures.md#2026-11-20--dev-33-수락-응답-단절과-처리된-확인-문맥)
4. V133은 최초 삭제 전이에서 계정별 변경 신호를 발행하며 rollback 시 신호가 전달되지 않는다. 동일 탭은 현행 로컬 변경 이벤트와 REST 갱신 경계를 사용한다. 다중 탭/실시간 구독과 신호 유실 복구는 [POL-05](POL-05.md#pol-05-contract)와 [DEV-07](DEV-07.md)의 선행을 따른다. [V133 신호 트리거](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/resources/db/migration/V133__account_notification_deletion.sql#L11-L33)

후속 사례와 실제 QA 재개 조건은 [ALARM-04·05 및 NDEL-01~09](../../../qa/alarms.md#pol-20-alarm-deletion-qa)에 기록한다. 이 결정 기록의 범위는 사용자 승인과 소유 계약을 적용한 정책 및 후속 검증 기준이다.

2026-11-20 14:22 KST · Codex. 삭제 계약, 개발 명세와 Figma 4개 상태를 기록하고 데이터 접근·화면 설명·QA에 연결했다. 다음은 변경 문서의 링크, 승인·기존 QA 및 기준선 보존, WBS와 인계 검증이다.

<a id="pol-20-verification"></a>

## 2026-11-20 · 검증과 Documentation Update Check

- 저장소 밖 `python3 verify_pol20.py active`와 `git diff --check 6eb78d0`로 문서 10개, 로컬 링크 831개·앵커/줄 참조 430개·표 34개 및 원본 79개·N02 직접 연결 4개·Task 114개/의존 관계 156개, 미실행 NDEL 9개를 확인했다. 기준선·감사·연결표·기존 QA·다른 작업 상태와 실행 소스의 보존을 확인했다. 1차에서 검사기가 N02 교차 참조 두 개까지 직접 프레임으로 집계해 원본 정의의 `figma` 목록을 사용하도록 검사기만 한 번 교정했고 재검증에 통과했다.
- 문서 전용 차수다. `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm build-storybook`, 제품 브라우저 실행은 로컬에서 미실행이다. 공유 개발 API의 업무 요청과 mock 및 HTTP 대역 테스트도 이번 사례 실행에 포함되지 않는다. Figma는 대표 상태 렌더 검토이며 제품 QA와 구분한다. 기존 실제 QA 차단과 NDEL 계획·미실행 상태는 QA 문서에 표시했다.
- Documentation Update Check에서 작업 기록·WBS·인계·계획, 받은 알림 QA와 인덱스, DESIGN·data-access 및 반복 출력 이력을 갱신 대상으로 확인했다. base·architecture·harness는 패키지·실행 구조·하네스 변경이 없어 추가 갱신이 필요 없다. coverage와 기준선은 원래 N02 소유/항목 연결을 사용한다.
- 독립 verifier의 Minor 두 건을 반영해 기존 검증표의 시점과 기삭제 행의 재요청 범위를 명확히 했다. 문서 변경과 종료·인계를 포함한 diff의 재검증·재검토 기준은 [리뷰 기록](../reviews/POL-20.md)에서 확인한다.

<a id="pol-20-close"></a>

## 2026-11-20 · 종료와 다음 첫 행동

- POL-20의 완료 근거는 승인된 본인 알림 수동 삭제의 계약 문서, [NDEL 검증 계획](../../../qa/alarms.md#pol-20-alarm-deletion-qa), [문서 검증과 두 리뷰](../reviews/POL-20.md)다. 7일 보존 안내·자동 만료·물리 파기와 사용자 복구는 소유 정책·계약에 보류했다. 현재 실행 대응과 실제 삭제 사례는 미실행이다.
- 다음은 [DEV-43](DEV-43.md) 하나다. 앞선 P0/P1 차단과 P2 선행 대기, DEV-39/40의 탈퇴 계약·화면 결정 선행을 적용하면 이번 정책이 선행인 DEV-43이 표 순서의 첫 후보다. 첫 행동은 최신 main에서 `/alarms`·공개 Repository와 이 계약 및 NDEL을 대조하고, 현재 실행 버전과 실제 QA 자원·변경 및 정리 승인으로 자체 요구사항 Gate를 작성하는 것이다. 이번에 한 것은 후속 기준과 인계다.

<a id="pol-20-delivery"></a>

## 2026-11-20 · Git 전달 체크포인트

이번 사용자의 Git 전달 승인에 따라 정책과 QA 기준, WBS·개발 인계, 반복 출력 이력을 목적별 커밋으로 전달한다. [POL-20 작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fpol-20-alarm-deletion-policy)의 최종 head에서 원격 CI·리뷰·병합 조건을 확인한다. Chromatic 한도 예외는 이번 PR의 해당 검사에 적용하며, 병합과 로컬 main fast-forward의 검증 결과는 전달 보고에 기록한다.

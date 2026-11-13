# DEV-15 · 소속 신청 취소 실행 연결

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: M05
- 선행 작업: [POL-10](POL-10.md)
- 목적/범위: 취소 확인·명령·완료/오류를 현재 회사 신청 화면에 연결한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### M05 · 소속 신청 취소
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **프론트 계약 없음**. 검증: 코드 대조.
- 남은 점: 취소 상태 조회와 달리 사용자가 취소하는 명령·화면을 구현
- Figma: [3162:52416](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3162-52416)
- 소유 소스/기존 기록: [src/components/my/my-company-client.tsx:230](../../../../src/components/my/my-company-client.tsx)、[src/data/company/contracts.ts:199](../../../../src/data/company/contracts.ts)

- 이어갈 QA 기록: [my-company.md](../../../qa/my-company.md). 기존 case ID와 통과/대기/차단 기록을 보존한다.

## 완료 기준

- [ ] 취소/닫기·중복·동시 승인·오류·reload 후 상태를 확인한다
- [ ] 신청 상태 조회와 회사 소속이 일치하고 성공/refresh 실패가 구분되는지 검증한다
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

## 2026-11-11 · QA-17 전수 점검 보완

- 근거: [감사 CF-21](../audits/2026-11-11.md#cf-21) · [route/API·출처 인덱스](../audits/2026-11-11.json).
- 범위/소유: 현재 Swagger에 DELETE /api/v1/company-membership-requests/{requestId}, required query expectedVersion이 있다. POL-10의 최신 source/body/권한·충돌 조사를 입력으로 삼는다.
- 추가 완료/재개 기준: 미연결/대기/취소/승인지연·409/권한 오류·중복클릭·재조회/복구를 구분한다. API 문서 존재는 실행 성공/준비 완료가 아니며 실제 취소는 이번 미실행.
- 이 절은 날짜별 후속 계획이다. 앞선 결정/QA/예외 이력을 대체하지 않으며 제품 구현·실제 업무 API 변경/새 통합 PASS는 없다. 상태는 WBS에서만 관리한다.

<a id="dev-15-pol-10-handoff"></a>

## 2026-11-13 · POL-10 확정 정책과 후속 기준

- 소유 근거: [POL-10 사용자 결정/Brief](POL-10.md#pol-10-brief)·[정책 v1](POL-10.md#pol-10-contract)·[현재 source/게시 schema/실행 미확인](../reviews/POL-10-sources.json). 이는 POL-10에서 후속 기준을 인계한 기록이다. 이 Task의 자체 Gate/제품 코드/QA/Git 전달은 아직 시작하지 않았다. 현재/다음/상태는 WBS만 소유한다.
- 사용자 확정(2026-11-13 KST): 확인 창→본인 PENDING 취소→`/my/company` 빈 화면·Figma Sonner 완료 안내1회→기존 `/my/company/start` 등록/찾기 재시작. reload에서도 CANCELED+미연결이면 빈 화면.409 후 자동 재취소 없이 최신 연결/신청 상태를 확인한다. 기존 취소 이력 카드 유지 대안은 채택하지 않았다.
- Figma: 대기 [3162:52364](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3162-52364)/버튼3162:52414, 완료 [3162:52416](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3162-52416)/toast3162:52419. 성공 문구는 **‘성공적으로 통합 요청을 취소했어요!’**다. 기존 Sonner `showToast`·단일 ToastViewport/기존 표시 규칙을 재사용한다. reload/조회/중복/충돌/실패에 성공 Toast0, 계정 교체 뒤 늦은 성공 Toast0. 이 결정은 다른 frame의 문구/레이아웃 예외가 아니다. 현재 metadata/한정 문구만 확인했고 screenshot asset이0byte여서 실제 화면/모바일/pixel은 자체 Gate에서 확인해야 한다.

### 추가 완료 기준

- [ ] 현재 회사/인증 조회와 분리된 명시 취소 계약을 공개 company 진입점에 정의한다. MyMembershipRequest의 실제 version을 보존하고 양수 requestId/version을 검증한다. `DELETE /api/v1/company-membership-requests/{requestId}?expectedVersion=...`·body 없음·같은 신청의 CANCELED 결과/증가 version을 경계에서 확인한다. 추측한 endpoint/멱등성 키/자동 fallback 없음.
- [ ] 본인 PENDING에만 취소 노출·확인/닫기/Escape·중복/진행 상태를 연결한다. 관리자 대리 취소, 승인/거절/취소 완료 상태와 연결 회사에 취소 제공 없음. 일반/대표자 신청은 같은 규칙이다. 서버가 최종 권한을 검증한다.
- [ ] 성공 후 빈 `/my/company`+정확한 Sonner1회, CTA/직접 URL/reload/뒤로가기·새 PENDING/연결 회사 최신 상태를 검증한다. CANCELED 이력은 서버/계정별 mock에 보존하고 화면 효과를 위해 삭제/가짜 신청없음으로 저장하지 않는다. REJECTED·APPROVED/approved-stale는 별도 분기 유지.
- [ ] 409 CR003/CR004·404 CR001/403/최종401·서버/연결 오류·응답 유실과 잘못된 성공 응답에서 거짓 완료/Toast를 막는다. 최신 상태 재확인/명시 재시도, 다른 새 신청에 자동 취소0, 승인 경쟁에서 소속 삭제0을 확인한다. 재조회 실패는 미확정 상태/오류로 남긴다.
- [ ] 취소 성공과 후속 refresh 실패/sessionWarning·로그인 해제를 구분하고, 계정/화면 수명·늦은 응답/Toast·동일 계정401 재시도 경계를 검증한다. 조회/닫기/재진입에는 mutation0, 같은 요청 중복 제출 방지.
- [ ] mock 취소/복원·version/409·계정/탭/프로필 격리·기존 신청/초대/문서/멱등 이력 보존을 확인한다. API/mock/hybrid의 source snapshot/운영 guard·업로드 경계를 훼손하지 않는다.
- [ ] [MCANCEL-01~12](../../../qa/my-company.md#pol-10-cancellation-qa)의 자동/HTTP 대역·실제 Next/브라우저와 실제 API 결과를 각각 기록한다. 현재 scripts의 test/lint/build·diff-check, 공유 Popup/Toast/Storybook 영향 시 build-storybook을 수행한다. 실제 통합을 로컬 PASS로 대체하지 않으며 Documentation Update Check·read-only verifier/ai-review를 수행한다.

### 자체 착수 Gate와 첫 행동

1. 최신 Git/main·POL-10 결정/이 Task 마지막 체크포인트와 현행 중앙 정책/backend dev·개발 Swagger의 payload·권한/오류를 재확인한다. 최초 조사11개 source/배포 성공 기록을 현재 서버 SHA/실응답으로 대신하지 않는다.
2. 실행 프론트/백엔드 version 대응·실제 wire wrapper/취소 상태/오류/세션 갱신을 확인할 수 있는 비식별 자원과 disposable PENDING/종료/승인 경쟁·타인/관리자 합성 계정을 확보한다. 사용/취소/재신청·이력 잔존/종료·복구 담당/방법과 안전한 오류·해제 범위를 승인받는다. 환경파일/실제 token·개인정보를 요청/출력하지 않는다.
3. 자원/범위가 부족하면 실제 QA 차단/재개 조건을 기록하고 필요한 최소 결정을 요청한다. **이번 POL-10은 DEV-15의 로컬 선행 또는 실제 QA 생략 예외를 승인하지 않았다.** 자체 요구사항·수정 후보(contracts/client/HTTP/mock·회사 UI/테스트)·검증 Gate를 제시한 뒤에만 개발한다. 기존 QA-05 조회 전용 승인을 재사용해 취소하지 않는다.

현재 후속 역할은 제품 승인자·회사 API/실행 버전 담당·합성 자원/복구 담당이며 개인/일정은 미확인이다. 실제 취소·상태 생성/업무 GET·새 통과0건. POL-10 정책/문서 검증·Git 전달과 이 Task 구현/실제 통합을 분리한다.

<a id="dev-15-next-handoff"></a>

## 2026-11-13 · POL-10 종료 뒤 다음 Task 선정/인계

- 사용자 요청의 다음 하나 선정/인계 범위다. POL-10 정책/문서 검증·두 리뷰 후 선행 완료와 P2 기본 순서를 대조했다. 선행을 충족한 P0/P1 대기는 없고, P2에서는 이 Task가 첫 후보다. POL-11/POL-12 등 이후 순서와 기존 실제 QA 차단/보류·Task별 승인 예외는 바꾸지 않는다. 현재/다음/상태는 WBS만 소유한다.
- 다음 첫 행동: 새 대화에서 최신 main/Git·이 마지막 인계와 [POL-10 정책 v1](POL-10.md#pol-10-contract)을 읽고 위 자체 Gate를 수행한다. 현행 중앙 소유 정책/backend GitHub·개발 Swagger부터 version/권한/오류·성공 결과를 재확인하고, 실행 process/wire 대응·상태별 disposable 자원/사용·취소/재신청·이력 잔존/종료·복구 담당/허용 범위를 확인한다. 이후 자체 Brief·수정 파일/검증 계획을 편집 전에 제시한다.
- 이번에는 인계 문서만 작성했다. DEV-15 자체 조사/설계/제품 구현·검증·업무 취소와 Git 전달을 시작하지 않았으며 POL-10의 Git/Chromatic 예외·문서 PASS를 이 Task의 실행/실제 QA 예외로 확대하지 않는다. 미확인 자원을 준비 완료로 세거나 담당 개인을 배정하지 않는다.

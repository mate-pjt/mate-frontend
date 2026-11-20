# DEV-43 · 받은 알림 선택·삭제/숨김 연결

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: N02
- 선행 작업: [POL-20](POL-20.md)
- 목적/범위: 정해진 의미로 편집·선택·삭제/숨김·완료 피드백을 연결한다.
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

- 이어갈 QA 기록: [alarms.md](../../../qa/alarms.md). 기존 case ID와 통과/대기/차단 기록을 보존한다.

## 완료 기준

- [x] 선택/취소·중복·부분 실패·이미 처리·페이지 경계를 로컬에서 확인했다.
- [x] 읽음/미확인 건수·빈 목록·reload·서버 오류를 mock·HTTP 대역에서 검증했다.
- [x] 현재 `package.json`의 test/lint/build와 Storybook 및 diff-check를 통과했다.
- [x] 브라우저·권한·오류 사례와 공유 개발 API의 9차단을 [QA](../../../qa/alarms.md#dev-43-local-qa)에 기록했다. 응답 단절 전용 범위는 [이번 사용자 결정](#dev-43-brief)을 적용했다.
- [x] Documentation Update Check와 [verifier/ai-review](../reviews/DEV-43.md)를 수행했다.

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

현재 기록은 [2026-11-20 검증](#dev-43-verification)과 [종료 및 인계](#dev-43-close)에서 이어간다.

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
- 범위/소유: 현재 삭제 operation은 POST /api/v1/me/notification-deletions다. 과거 삭제 API 없음은 당시 기록이며 오늘 계약 조사 입력을 갱신한다.
- 추가 완료/재개 기준: body JsonNode의 실제 source·대상 소유권/중복/부분오류·읽음/총건수/더보기 cursor·복구를 POL-20에서 확정한 뒤 연결한다. 현재 편집 비활성 문구 수정은 DEV-62, 삭제 구현은 이 Task.
- 이 절은 날짜별 후속 계획이다. 앞선 결정/QA/예외 이력을 대체하지 않으며 제품 구현·실제 업무 API 변경/새 통합 PASS는 없다. 상태는 WBS에서만 관리한다.

<a id="dev-43-pol-20-handoff"></a>

## 2026-11-20 · POL-20에서 인계한 범위와 첫 행동

- 첫 행동은 최신 main의 `/alarms`·공개 `notifications` 포트와 [POL-20 사용자 승인·현행 계약](POL-20.md#pol-20-contract), [NDEL 계획](../../../qa/alarms.md#pol-20-alarm-deletion-qa)을 대조해 DEV-43 자체 요구사항 Gate를 작성하는 것이다. OpenAPI와 백엔드 소스가 달라졌는지, 현재 공유 개발 실행·QA 자원·승인 범위를 확인한다.
- 같은 `notifications` 공급원에서 편집·선택 및 `SELECTED`/`ALL`을 연결하고 조회 결과로 목록·더 보기와 헤더 미확인 수를 맞춘다. 선택 범위, 키보드·초점, 삭제 완료와 실패·결과 미확정의 피드백은 [Figma 4개 상태](POL-20.md#pol-20-evidence)와 NDEL 사례를 기준으로 검증한다. 선택과 전체 삭제를 각각 검증하고, 앱의 요청 수와 서버 도착 수를 구분한다. `ALL` 자동 재전송 위험은 활성화 전에 해소한다. 서버 보존 기간·7일 안내·자동 삭제·복구 UI와 변경 신호 연결(DEV-07)은 별도 범위다.
- 실제 API 회차는 현재 프로세스·인스턴스의 V133 대응, disposable 두 계정과 45건 이상 혼합 알림, 동시 도착과 오류/정리 방법, 실행·잔존·종료 승인으로 재개한다. 미확인 상태에서는 NDEL과 기존 ALARM-04/05를 실제 통합 PASS로 처리하지 않는다. 문서·mock·HTTP 대역·실제 통합 결과를 각각 기록하고 차단이 남으면 해당 작업의 Gate에서 판단한다. [실제 QA 준비 조건](../../../qa/alarms.md#pol-20-alarm-deletion-qa)
- 이번 인계에는 DEV-43의 상세 설계, 제품 변경, 실제 조회·삭제나 Git 전달 승인이 포함되지 않는다. DEV-43의 착수·판정은 [WBS](../README.md)에서 확인한다.

<a id="dev-43-brief"></a>

## 2026-11-20 · 착수 Brief와 결정

- `main`과 `origin/main`은 `f81ccc3ec9803934f27c8c127c4eb94bf84029a5`로 일치했다. POL-20 [PR #101](https://github.com/mate-pjt/mate-frontend/pull/101), DEV-62와 DOC-001이 조상에 포함됐다. 기존 DEV-43 브랜치와 미커밋 변경 없이 fast-forward 확인 후 `feat/dev-43-alarm-deletion`을 생성했다.
- N02의 `/alarms`에서 편집·선택·완료, 단건·선택과 계정 전체 삭제를 연결한다. 선택 동작은 읽음·이동을 발생시키지 않는다. 확인된 삭제 결과는 한 번 알리고 페이지 0부터 유효한 기존 펼침 범위 및 헤더 미확인 수를 다시 조회한다. 원래 목록·더 보기·읽음/이동과 세션 격리가 성공 기준이다. 보존 기간·자동 만료·복구·실시간 변경 신호(DEV-07)는 후속 소유 범위다.
- 2026-11-20 사용자 승인으로 개발·검증·두 리뷰 및 목적별 커밋·push·PR·최종 head CI·정상 병합·로컬 fast-forward를 진행한다. 이번 PR의 Chromatic 월간 한도만 예외다. POL-20/MAT-254의 수동 선택·전체 삭제 결정을 적용한다. 공유 개발 API에서의 로그인·데이터 생성·읽음/삭제 및 정리 실행이나 배포는 이 전달 승인에 포함되지 않는다.
- 2026-11-20 사용자 결정은 “그냥 간단하게, 응답 단절 같은 상황 고려하지 말고 간단하게 진행해.”다. 연결 단절을 이유로 `ALL`을 보류하는 추천안을 적용하지 않고 기존 계약으로 연결한다. 앱의 동일 제출 중복과 401 자동 재제출은 방지한다. 응답 헤더 전 단절에 대한 별도 재전송 방지 장치·검수는 이번 활성화 범위에서 제외한다. 일반 오류와 성공 후 조회 오류는 처리한다.
- 현행 `mate-backend/dev` `ab388b7cb06154a00e254eff7b124882952166ac` 및 `main` `4b5f31de578c41e698dda9c99e66149b7292f031`에서 [입력/Controller/서비스 계약](POL-20.md#pol-20-contract)을 재확인했다. 해당 dev의 [배포 workflow](https://github.com/mate-pjt/mate-backend/actions/runs/44429902651)는 11-19 KST verify·publish·deploy 성공, deploy-prod skipped다. [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs)는 HTTP 200, 184 paths, SHA-256 `9e0b737fd92953b9f7a668aeecb61ce32b865bb3861999f9775fdfb523d21dd2`이며 삭제 POST/응답을 게시한다. 현재 실행 digest·모든 인스턴스의 V133 대응, 실제 업무 응답, disposable 계정·45건 이상 혼합 파일럿 데이터와 정리 승인까지는 확인되지 않았다.
- 사용자 결정 전 로컬 합성 HTTP/1.1 서버와 Aside 브라우저에서 응답 헤더 전 연결 단절을 한 번 재현했다. 앱 fetch 1회, 서버 도착 2회였고, 두 번째 `ALL`이 첫 삭제 뒤 들어온 합성 알림도 삭제했다. 공유 개발 서버 동작을 측정한 결과는 아니다. 현재 서버 소스에는 해당 삭제 POST의 중복 처리 키가 정의돼 있지 않다.

### 설계 및 검증 계획

- `src/components/alarms`의 기존 목록·행·헤더를 수정하고 공용 `Button`, `CheckboxCircle`, `BasicPopup`, `Toast`를 재사용한다. [POL-20에서 확인한 Figma 네 상태](POL-20.md#pol-20-evidence)의 렌더를 현재 대조했다. 전체선택은 불러온 행이며, 서버 전체 삭제는 미로딩 범위를 알리는 확인으로 명시한다. 이는 승인된 기능 범위를 표시하는 추가 조작이다. 별도의 시각 예외 승인은 없다.
- `src/data/notifications`의 공개 계약과 API/mock 구현에 삭제 동작을 넣는다. API 요청의 범위·안전 정수·상한과 응답 집계를 검사한다. mock은 기존 탭·계정의 논리 삭제와 읽음 이력을 보존한다. 읽음 요청 중 편집 진입을, 더 보기와 삭제의 동시 시작을 직렬화한다. 세션 수명이나 화면을 벗어난 결과는 폐기한다.
- Node 22.20.0·pnpm 11.3.0에서 기존/신규 Vitest, lint, API/mock/hybrid Preview 빌드, `git diff --check`를 수행한다. 기존 공용 컴포넌트를 사용하는 화면의 Next 브라우저와 로컬 HTTP 대역에서 네 상태, 키보드·320/390px, 중복, 집계·페이지·재조회·오류·계정을 확인한다. 공용 UI/스토리 소스는 수정 대상이 아니다. 실제 QA 미실행과 재개 조건은 [NDEL QA](../../../qa/alarms.md#pol-20-alarm-deletion-qa)에 남긴다.
- 작업 기록·WBS·QA, 관련 디자인·Repository 안내를 맞추고 `context-audit`, read-only verifier와 `ai-review`를 실행한다. 원본 79개 연결표와 기준선, NDEL과 기존 QA 이력을 보존한다.

| 시점 | 확인 | 다음 행동 |
| --- | --- | --- |
| 2026-11-20 · 착수 | 최신 main, POL-20 결정과 현행 소스·Swagger, 네 Figma 상태, 사용자 범위를 확인했다. 초기 미커밋 변경 0건. | Repository 명령 및 `/alarms` 편집·재조회 연결 후 합성 환경 검증 |
| 2026-11-20 · 구현 | `notifications` 양쪽 공급원, `/alarms` 선택/전체 삭제, 계정별 헤더 집계 재조회와 계약 테스트를 작성했다. 로컬 환경 파일을 제외한 별도 복사본에 잠금 파일대로 의존성을 설치했다. | 같은 후보 소스에서 자동 검사, 세 가지 빌드와 mock·로컬 HTTP 브라우저를 실행한다. |
| 2026-11-20 · 검증 | 1차 lint 접근성 경고를 `aria-describedby`로 수정했다. 브라우저에서 연속 편집 직후 앞선 성공 Toast가 새 거절 안내와 함께 보이는 것을 확인해 새 편집에서 닫도록 고쳤다. 최종 자동 및 같은 동작의 브라우저 재검증을 통과했다. | 문서와 독립 verifier·ai-review에서 범위·QA 구분을 확인한다. |

<a id="dev-43-verification"></a>

## 2026-11-20 · 검증과 Documentation Update Check

| 검증 | 결과 |
| --- | --- |
| `pnpm test` | 42개 파일, 1,249건 통과. 새 삭제 HTTP/mock 계약의 23건을 포함한다. |
| `pnpm lint` | 최종 통과. 확인창의 초기 접근성 경고를 수정했다. |
| `pnpm build` | API·mock·hybrid(회사·받은 알림·알림 설정 mock) Preview 모두 통과. |
| `pnpm build-storybook` | 통과. 기존 Storybook 확장자 생략 및 번들 크기 경고가 있다. |
| Next.js 브라우저 | [NDEL 로컬 결과](../../../qa/alarms.md#dev-43-local-qa). mock, API 루프백과 API Preview를 사용했다. 제출 연타, 정상 응답 및 조회 실패, 320/390px/데스크톱·키보드, 계정 교체·재진입을 관찰했다. |
| 실제 API 통합 | 0통과·NDEL 9차단. 현재 배포와 V133 대응·QA 자원 및 삭제/정리 승인 확인 뒤 재개한다. |

- 검증은 로컬 환경 파일을 제외해 복사한 트리에서 Node 22.20.0·pnpm 11.3.0과 잠금 파일로 실행했다. 브라우저용 API는 루프백 합성 서버만 사용했다. 수정은 접근성 경고와 연속 삭제의 이전 Toast 두 건이며 각각 재확인했다.
- Documentation Update Check에서 DESIGN, 저장소 가이드, architecture/data-access/plan, 반복 오류 기록, QA/인덱스, WBS·작업 기록·버전별 리뷰를 확인했다. 스크립트·의존성·하네스 정의에는 변경이 없고 기준선 및 coverage의 N02 소유 연결을 사용한다.

<a id="dev-43-close"></a>

## 2026-11-20 · 로컬 범위 종료와 다음 첫 행동

- `/alarms`의 선택·전체 삭제와 첫 페이지부터 목록 복원, 헤더 미확인 수 갱신을 구현하고 로컬 자동·브라우저·문서 검증과 [두 리뷰](../reviews/DEV-43.md)를 통과했다. 공유 개발 NDEL 9건은 모두 차단이다. ALARM-05와 보존/파기/복구의 POL-20 대기 조건을 유지한다.
- 기존 P0/P1 차단과 P2의 선행 대기를 적용하면 DOC-001이 완료된 [POL-21](POL-21.md#pol-21-dev-43-handoff)이 표 순서상 다음 후보다. 첫 행동은 최신 main의 사업자번호·OCR 가입 경로와 O09 시안을 읽고 현행 등록 계약에서 시공능력·대표 면허·인증 3종의 직접 입력·검증·저장 경계를 확인해 자체 정책 Gate를 작성하는 것이다. 선정과 인계를 남겼다.

<a id="dev-43-delivery"></a>

## 2026-11-20 · Git 전달 기준

2026-11-20 사용자의 이번 승인에 따라 Repository·화면·테스트·문서를 목적별 커밋으로 전달한다. [DEV-43의 작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afeat%2Fdev-43-alarm-deletion)에서 최종 head의 CI·리뷰·merge 상태를 확인한다. 이번 PR의 Chromatic 월간 한도만 예외로 적용하며 GitHub에서 허용한 일반 merge commit으로 이력을 보존한다. 로컬 main fast-forward와 원격 일치는 종료 보고에서 확인한다.

# PREP-01 · 실제 API QA 사전 점검과 실행 순서 확정

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 검증
- 원본 항목: 79개 전체의 작업 운영 기반
- 선행 작업: [DOC-001](DOC-001.md)
- 목적/범위: 기존 QA 문서를 읽고 프론트/백엔드 실행 식별자 확보 방법, 합성 공고·상태별 계정·초대·사업자번호·문서·Mailpit의 준비 여부와 사용/복구 승인 범위를 기록한다. 이 작업은 문서·기존 증거 확인까지다. 서버 시작·실제 로그인·API mutation·외부 메시지는 실행하지 않는다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: DOC-001 완료 뒤 가장 먼저 수행한다. 2026-10-28 사용자의 PREP-01 실행 요청으로 문서·기존 증거 기반 사전 점검과 Git 전달이 승인됐다. 실제 QA 실행은 포함하지 않는다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

- [원본 79개 스냅샷](../baseline/audit-data.json) · [79개 연결표](../coverage.md) · [기존 QA](../../../qa/README.md)

- 이어갈 QA 기록: [README.md](../../../qa/README.md). 기존 case ID와 통과/대기/차단 기록을 보존한다.
- 이번 준비 결과: [QA-01~13 준비표](../../../qa/prep-01-readiness.md). 자원·역할·실행 식별자·승인/복구 공백과 조건부 순서의 날짜별 근거다.

## 완료 기준

- [x] QA-01~13 각각에 준비/미준비/미확인, 필요한 담당 역할과 재개 조건을 남긴다
- [x] 확인 가능한 식별자와 미확인 배포 상태를 구분한다
- [x] 최초 실행할 QA 하나와 계정/변경/복구 범위의 기존 승인 근거 또는 필요한 결정을 명시한다
- [x] 환경 미준비를 통합 PASS로 바꾸지 않고 현재/다음 작업을 갱신한다
- [x] 사용 환경·실행 식별자·시각·브라우저/화면·결과/증거를 남긴다. 적용하지 않는 필드는 사유를 쓴다.
- [x] 실패/차단/미실행을 통과와 분리하고 필요한 복구·Review Gate 및 문서 갱신을 마친다.

## 착수 전 Implementation Brief / 설계 Gate

- 요구사항: QA-01~13의 기존 기록을 필요한 범위만 읽어 현재 확인할 수 있는 사실, 자원·담당 역할·승인·복구의 공백, 조건부 실제 QA 순서를 문서로 만든다.
- 성공 기준: 13개 작업 각각의 준비/미준비/미확인·기존 case·필요 역할·재개 조건, 소스와 실행/배포 식별자의 구분, 최초 QA 하나와 승인 범위, WBS 다음 작업 하나, 문서 검증 및 독립 verifier/ai-review 근거를 남긴다. 미확인 자원을 준비로 표시하거나 기존 실제 QA를 통과로 올리지 않는다.
- 범위: PREP-01 기록·WBS, `docs/qa/prep-01-readiness.md` 및 QA index, `reviews/PREP-01.md`. 기존 case/기준선·coverage는 보존한다.
- 제외: 앱 코드·API/DTO/mock/제품 정책 변경, 라이브러리 추가, 서버 시작·로그인·API 요청/변경·실제 데이터 생성·외부 메시지·운영·배포. Git 전달은 이번 사용자 요청의 별도 승인 범위다.
- 확인한 파일/패턴: AGENTS, baseline/workflow/task-cycle, DOC-001·main 통합 근거, QA-01~13 정의와 관련 기존 QA, base/plan/architecture/data-access/harness/ai-failures, 세 Skill·verifier 역할, package/scripts, 공개 bids 서버 진입점·인증 controller·알림 HTTP·mock 저장소·설정 snapshot. 상태는 WBS, 실제 case는 기존 QA, 준비 증거는 별도 문서로 연결한다.
- 수정 대상/영향: 위 Markdown 5개만. 런타임·패키지·빌드/하네스 설정 영향 없음. QA index에는 준비표 링크만 추가한다.
- 단계: 시작 근거/체크포인트 → 13개 준비표·식별자 확보 절차·승인/복구 구분 → 다음 작업 선정 → 문서 검증·Documentation Update Check → verifier/ai-review → 목적별 커밋·PR/CI·조건 충족 시 merge/로컬 fast-forward.
- 검증: 현재 scripts는 dev/build/start/lint/test/test:watch/storybook/build-storybook. 문서 전용 범위이므로 링크·79개 ID/99개 작업·의존성/단일 상태·고정 snapshot/기존 QA 보존·허용 파일 검사와 `git diff --check`로 검증한다. 앱 test/lint/build/Storybook·브라우저·실제 API는 영향/실행 범위가 없어 미실행이며 PASS로 세지 않는다. 원격 CI는 실제 PR head에서 별도 확인한다.
- 환경: 기본 셸 Node v26.5.0, pnpm 11.3.0; `.nvmrc`는 22.20.0이고 해당 로컬 실행 파일이 존재한다. 실행 QA/CI는 저장소 기준 Node 22.20.0을 사용한다. `.env`/개인 키 내용은 읽지 않는다.
- 가정/미결: 문서 기반 확인 범위에서 새 자원 증거가 없으면 미확인 또는 기존 미준비로 남긴다. 개인 담당자를 임의 지정하지 않고 필요한 역할과 미지정 사실을 적는다. 실제 QA 조건은 후속 Gate이며 이번 준비 문서의 blocking ambiguity는 없다.
- 편집 전 사용자 보고: 위 범위·수정 대상·문서 검증·Review Gate·조건부 QA-01 및 다음 DOC-002 선정안을 2026-10-28 KST commentary로 제시했다.

## 결정 기록

| 날짜 | 질문/선택지와 추천 | 결정·근거·승인자/원문 | 영향 |
| --- | --- | --- | --- |
| 2026-10-27 | 작업 후보 분해 | 정책·API·제품 동작 신규 승인 없음 | 착수 시 Gate 수행 |
| 2026-10-28 | PREP-01 범위와 Git 전달 | 이번 사용자 요청 4·6항: 작업 기록 범위만 수행, Git 전달은 별도 승인·반복 확인 불필요 | 문서 준비 점검과 branch push·PR/CI·main 동기화 수행. 실제 QA/운영 승인은 확대하지 않음 |
| 2026-10-28 | 미확인 자원 처리 | 기존 QA의 대기/차단·부분 실행은 유지하고 현재 준비 증거가 없음을 기록 | 담당 역할/재개 조건을 적는 것으로 PREP 완료 여부 판단. 실제 QA PASS와 구분 |
| 2026-10-28 | 실제 QA의 최초 순서 | HOME-09·BID-15도 인증에 의존하므로 초기 QA-01 후보에서 QA-04 우선으로 정교화. 제품 정책/승인 범위 변경 없음 | QA-04 → QA-01~03 → QA-05~13. 중간 미완료를 건너뛰는 예외를 만들지 않음 |
| 2026-10-28 | 다음 대화 작업 선정 | WBS 작업 기반 표의 다음 P0 DOC-002. 선행 DOC-001 main 반영 및 DESIGN.md의 기존 Major 드리프트를 재확인 | 준비 점검의 Gate 통과 후 DOC-002를 준비로 지정. 실제 QA 자원 차단/승인 예외를 면제하지 않으며 이번 대화에서 착수하지 않음 |

## 체크포인트 · 재개 메모

| 시각/실행자 | 환경·branch/HEAD·작업트리 | 수행/결과·근거 | 다음 행동·차단/재개 조건 |
| --- | --- | --- | --- |
| 2026-10-27 / 문서화 | feature/my-company-overview / f84af24b5f9d + 기존 미커밋 변경 | 보고서에서 작업 정의만 생성. 구현/실제 QA 미실행 | DOC-001 완료 뒤 가장 먼저 수행한다. 이번 문서화 요청에는 사전 점검 실행까지 포함되지 않는다. |
| 2026-10-28 08:44 KST / Codex | 시작 main=origin/main `0856a4dfd1684f1afcd986c1fab0f11c1d051777`, clean → `docs/prep-01-api-qa-readiness` | fetch/fast-forward 확인. DOC-001 커밋 `9eae9c0`이 origin/main의 조상. 기존 미커밋 변경 없음. 서버/실제 API 미실행 | 요구사항/설계 Gate 기록 후 13개 준비표 작성. 자원 확보를 추정하지 않음 |
| 2026-10-28 08:49 KST / Codex | 같은 HEAD + 허용한 Markdown 5개 | QA-01~13 준비표·역할·실행 식별자/승인/복구 공백 및 조건부 QA-04 우선 순서 작성. 문서 검사 PASS: 79 ID·99 Task·124 기존 QA·13개 준비표·기준선/기존 QA 보존. 실제 QA 미실행 | read-only verifier 및 ai-review로 요구사항·누락·다음 DOC-002 선정·증거 경계 검토. 자동 수정 0/3 |
| 2026-10-28 08:50 KST / Codex | 같은 HEAD + Markdown 5개 | 1차 verifier PASS, ai-review 여섯 섹션 PASS. 신규 지적 없음. WBS에서 PREP 종료 및 다음 P0 DOC-002 선정·이유/첫 행동 기록, snapshot 미확인 표현 명확화 | 종료 변경 포함 문서 검사·verifier/ai-review 재검토 후 커밋/Git 전달. 실제 QA는 조건부 QA-04부터, 이번에 시작하지 않음 |
| 2026-10-28 08:52 KST / Codex | 같은 HEAD + 최종 Markdown 5개, 미커밋 | 종료 변경 포함 2차 verifier·ai-review 및 문서 검사 PASS. WBS의 PREP 완료/다음 DOC-002 준비와 124개 QA 보존 확인. 사용자 데이터/프로세스 변경 없어 실제 복구 해당 없음 | 실제 결과 기록 추가분의 검사/검토 최신성 확인 후 목적별 2개 커밋·push·PR/라벨·실제 head CI·병합 조건 확인. 통과 시 merge/로컬 main fast-forward. 원격 결과는 PR/최종 보고와 대조 |

## 검증·리뷰·인계 기록

| 구분 | 실행 명령/사례·환경 | 결과 | 증거/미실행 이유 |
| --- | --- | --- | --- |
| 문서 검증 | 로컬 `validate_docs.py` 및 `git diff --check` | 최종 PASS, 종료 변경 포함 재실행 | 로컬 링크 1,398개·79 ID/99 Task·의존성/상태·124 QA·13개 준비표·보호 문서 21개·허용 파일. 내부 fragment 검사도 통과. 상세는 검토 기록 |
| 실행 환경 확인 | branch/HEAD/clean·원격 main·선행 조상·Node/pnpm·hosts/HTTPS 파일 존재·TCP 리스너 | 파일/도구 사실만 확인 | 인증서/개인 키 내용 미열람, 신뢰/유효기간·현재 API/백엔드 배포는 미확인. 브라우저/화면은 파일 검사라 해당 없음 |
| 앱 검사·실제 QA | test/lint/build/Storybook·브라우저·mock/HTTP 대역·실제 API | 로컬 미실행 | Markdown 변경만 있고 실행 코드/패키지/빌드 영향 없음. 실제 실행은 PREP 범위 밖. 기존 QA 결과는 그대로 보존 |

- 자동 수정 시도: 0/3. 실패 시 명령·오류·원인·최소 수정·재검증 결과를 추가한다.
- Documentation Update Check: [검토 기록](../reviews/PREP-01.md)에 문서별 판단 완료. base/architecture/data-access/plan/harness/ai-failures의 구현 규칙/명령·dated history는 바꾸지 않는다. WBS/작업 기록·QA index/준비표·검토 근거만 갱신한다.
- Review Gate: 1차 및 종료 변경 후 2차 read-only verifier 모두 PASS, 신규 Blocker/Major/Minor 없음. 자체 ai-review도 최종 diff에서 여섯 섹션으로 재검토 PASS. 기존 DESIGN Major와 QA 요약 Minor는 이번 신규 결함과 분리한다. 이 결과 기록 추가 후에도 커밋 전 문서 검사·검토 최신성을 확인한다.
- 커밋/PR: Gate 후 QA 준비 근거와 Task 운영/리뷰 문서로 목적을 나눠 영어 type/한국어 설명의 작은 커밋 2개 예정. 원격 head CI·보호/병합 조건을 확인하고 merge 방식으로 작은 이력을 유지한다. 실제 URL/SHA·전달 결과는 PR/최종 보고에서 확인한다.
- 다음 작업 인계: DOC-002. Git 상태·main 선행 반영 확인 후 해당 작업 기록과 DESIGN.md Accepted Debt를 현재 인증 session-controller·notifications HTTP/mock Repository와 대조해 요구사항 Gate부터 시작한다. 이번 대화에서는 시작하지 않는다.

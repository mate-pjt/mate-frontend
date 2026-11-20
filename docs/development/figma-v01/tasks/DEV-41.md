# DEV-41 · mock 이메일 인증 시간·개발 가이드 동기화

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: S09
- 선행 작업: [POL-19](POL-19.md)
- 목적/범위: 확정된 인증 만료/재전송 정책을 mock과 가이드에 맞춘다. API UI의 서버 반환 시각 사용은 유지한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### S09 · mock 이메일 인증 시간 정책
- 기준선: UI **구현**, 동작 **정책과 다름**, 데이터 **mock 10분/30초**. 검증: 현재 mate-docs §7 대조.
- 남은 점: 현재 중앙 정책 3분/60초와 mock·개발 가이드의 차이 해소; API UI는 서버 만료시각 사용
- Figma: [3139:56715](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-56715)
- 소유 소스/기존 기록: [src/data/notification-settings/mock-repository.ts:21](../../../../src/data/notification-settings/mock-repository.ts)、[docs/development/repositories.md:70](../../../../docs/development/repositories.md)、[src/components/my/notification-email-verification-dialog.tsx:70](../../../../src/components/my/notification-email-verification-dialog.tsx)

## 완료 기준

- [x] Clock 기반 만료 직전/직후·재전송 제한 경계를 검증한다.
- [x] API/mock의 expiresAt/resendAvailableAt 표시와 가이드가 일치하는지 확인한다.
- [x] 현재 package scripts로 필요한 test/lint/build·diff-check와 Storybook 검증을 통과한다.
- [x] 요구사항 Gate에서 정한 실제 API/브라우저·권한·오류 사례와 필요한 QA case를 검증한다. 외부 조건으로 못 하면 차단/미실행과 이미 승인된 예외를 기록하며 전체 기능 통합 PASS로 표시하지 않는다. 이번 로컬 범위와 실제 API 미실행은 [QA 기록](../../../qa/notification-email-recipient.md#dev-41-local-qa)에 연결했다.
- [x] Documentation Update Check 및 [verifier와 ai-review](../reviews/DEV-41.md)를 통과한다.

## 2026-10-27 · 착수 전 Implementation Brief 후보

당시에는 작업 후보를 정의했다. 실제 착수 판단과 설계는 [2026-11-20 Brief](#dev-41-brief)에 있다.

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

## 2026-10-27 · 검증·리뷰·인계 후보 상태

| 구분 | 실행 명령/사례·환경 | 결과 | 증거/미실행 이유 |
| --- | --- | --- | --- |
| 이번 작업 | 미실행 | 미판정 | 기준선의 과거 결과와 구분 |

- 자동 수정 시도: 0/3. 실패 시 명령·오류·원인·최소 수정·재검증 결과를 추가한다.
- Documentation Update Check: 착수 후 판단. base/architecture/data-access/plan/harness/ai-failures 중 영향 문서와 갱신/미갱신 이유를 기록.
- Review Gate: 미실행. verifier와 ai-review의 결과/대상 diff·후속 변경 재검토 여부를 기록.
- 커밋/PR: 없음. 추후 커밋할 때 하나의 목적·영어 type/한국어 메시지, 런타임/테스트/문서는 가능한 별도 커밋.
- 다음 작업 인계: WBS에서 선택. 이 단위의 필수 검증 PASS 전에 다른 기능으로 자동 전환하지 않는다.

## 2026-11-11 · QA-17 전수 점검 보완

- 근거: [감사 CF-14](../audits/2026-11-11.md#cf-14) · [route/API·출처 인덱스](../audits/2026-11-11.json).
- 범위/소유: 합성 인증 modal에서10분/재전송30초를 재확인했다. 현재 중앙 정책3분/60초·5회/재전송 무효화와의 차이는 이 Task에서 수정한다.
- 추가 완료/재개 기준: 이메일1토글/공고별 내부알림 분리의 정책 근거와 화면 승인 범위는 POL-19/POL-29, 팝업 안내는 DEV-62가 소유한다. 실제 발송/주소 전환 QA-13 차단은 보존.
- 이 절은 날짜별 후속 계획이다. 앞선 결정/QA/예외 이력을 대체하지 않으며 제품 구현·실제 업무 API 변경/새 통합 PASS는 없다. 상태는 WBS에서만 관리한다.

## 2026-11-11 · POL-29 화면 기준 인계

- [POL-29 최종 화면 결정](POL-29.md#pol-29-decisions)의 Figma 세 항목·disabled/tooltip·미지원 인터페이스는 DEV-66이 소유한다. 이 Task는 인증시간/재전송/오입력·기존 주소 보존과 개발 가이드 정합성 목적을 유지한다.
- API UI의 서버 expiresAt/resendAvailableAt은 유지하며 mock3분/60초·5회/재전송 무효화는 POL-19 Gate에서 현행 정책/적용을 확인한 뒤 수정한다. POL-29 문서 PASS가 POL-19/이 Task 또는 실제 QA-12/13의 완료/차단 해소가 아니다. 이번 구현 없음.

<a id="dev-41-pol-19-handoff"></a>

## 2026-11-20 · POL-19 인증 정책과 다음 요구사항 Gate

- 수용 기준은 [POL-19의 대체 수신 이메일 인증](POL-19.md#pol-19-contract)이다. mock 공급원의 만료 10분·재전송 30초를 3분·60초로 교정하고 [개발 가이드](../../repositories.md#4-가상-계정회사이메일-사용)의 시간과 합성 검증 방법을 맞춘다. API 공급원의 `expiresAt`/`resendAvailableAt` 및 성공 응답의 수신처 사용은 유지한다.
- 고정 Clock으로 동일 계정의 한 발송 이후 재전송과 새 인증 요청 모두에서 60초 직전 거절·60초 도달 허용을 확인한다. 3분 경계, 다섯 번째 오입력의 차단, 재전송 뒤 새 요청/번호 발급과 이전 요청/번호 거절도 검증한다. 실패·만료·취소·재전송 중에는 기존 주소를 두고 최신 요청 확인 성공에만 바꾼다. 계정 격리, 이전 탭 mock snapshot과 시나리오(`expired`, `blocked`)의 처리를 자체 Brief에서 정한다.
- 실제 Next의 합성 화면과 HTTP 대역은 구분한다. 대역에 다른 유효 시각을 반환해 UI가 고정 3분/60초를 다시 계산하지 않는지 확인한다. 기존 [QA-12](QA-12.md#qa-12-resume)의 실제 오류 1건과 [QA-13](QA-13.md#qa-13-resume)의 실제 수신처 6건 차단은 유지한다. 새 실서버 발송·수신·주소 변경과 원복은 필요한 자원·승인을 자체 Gate에서 판단한다.
- **선정 이유와 첫 행동** · 기존 P0/P1 차단·미충족 선행과 앞선 P2의 대기 조건을 적용하면, POL-19를 선행으로 두는 이 작업이 WBS 표 순서에서 첫 후보다. 다음 대화에서 최신 `main`과 POL-19의 병합 근거를 확인하고 [mock Repository](../../../../src/data/notification-settings/mock-repository.ts)·[인증 담당 테스트](../../../../tests/account-repositories.test.ts)·개발 가이드의 10분/30초와 재전송 동작을 먼저 대조한다. 고정 Clock·이전 상태·브라우저와 실제 QA 경계를 그 자리에서 요구사항으로 정한다. 이번에는 인계만 기록했다.

<a id="dev-41-brief"></a>

## 2026-11-20 · 착수 Brief

- S09의 개발 범위는 대체 수신 이메일의 mock과 합성 검증 가이드다. 중앙 정책과 [POL-19](POL-19.md#pol-19-contract)에 따라 발송부터 3분 유효, 진행 중인 계정별 요청의 시작·재전송 공통 60초 대기, 다섯 번째 오입력 즉시 차단, 새 요청과 번호의 발급 및 이전 요청·번호의 무효화를 적용한다. 인증 성공 때만 새 수신처를 적용한다.
- 중앙 정책 §7의 현행 문서 blob `c649b309` 및 백엔드 개발 인증 서비스 blob `24952229`를 확인했다. 근거는 [정책과 개발 계약](POL-19.md#pol-19-evidence)에 연결된다. 화면은 [S09의 4자리 입력/재전송](POL-19.md#pol-19-evidence) 및 [현행 팝업](../../../../src/components/my/notification-email-verification-dialog.tsx)의 절대 시각 표시를 따른다. 서버 배포 기록, 실행 SHA, 실제 업무 응답의 확인 수준은 선행 조사에 명시돼 있다.
- [Repository](../../../../src/data/notification-settings/mock-repository.ts)의 주입 Clock과 탭·계정별 저장을 사용한다. 첫 합성 번호는 1234이며 다음 발송부터 번호를 순서대로 바꾼다. 구형 요청은 저장된 발송 시각에서 새 기한을 계산해 기존 수신 주소와 ON/OFF, 현재까지의 시도 횟수를 보존한다. `expired`는 확인에서 만료 응답을, `blocked`는 횟수 제한 응답을 재현한다. 합성 만료 응답을 발송 직후 재현하더라도 발송 대기를 적용한다. 이들은 Codex가 2026-11-20 정한 개발 fixture 선택이다.
- 편집 순서는 이 Brief와 WBS 착수 → mock에서 시작·재전송 공통 발급과 복원 → [고정 Clock 계약](../../../../tests/account-repositories.test.ts) 및 [HTTP 대역](../../../../tests/http-contracts.test.ts) → [개발 가이드](../../repositories.md#4-가상-계정회사이메일-사용), 공통 데이터 접근/계획, QA, WBS와 리뷰다. 시각 경계 누락, 구형 상태 유실, 이전 코드 허용과 계정 간 영향 여부를 검증한다.
- `pnpm test`, `pnpm lint`, API/mock/hybrid `pnpm build`, `pnpm build-storybook`, 실제 Next의 합성 mock과 loopback HTTP 대역, 문서 링크·ID·상태·기준선·범위 보존, `git diff --check` 및 두 리뷰를 수행한다. 대역은 3분·60초와 다른 시각을 반환해 현행 UI와 HTTP 응답의 연결을 확인한다.
- 2026-11-20 사용자가 DEV-41 단일 실행·검증·두 리뷰와 목적별 커밋, push, PR, 최종 CI 확인, 조건부 정상 병합 및 로컬 fast-forward를 승인했다. Chromatic 월간 한도 예외는 이번 PR에 적용한다. 현행 API/화면 표시 계약과 알림 채널 정책을 사용한다. 실제 업무 발송·주소 설정 변경/복구와 운영·배포는 별도 자원·승인이 필요하다. QA-12/13 실제 차단과 그때의 승인 범위를 보존한다. 이번 요구사항 Gate의 필수 미결 결정은 없다.

### 착수 체크포인트

2026-11-20 13:57 KST · Codex가 GitHub의 [POL-19 PR #99](https://github.com/mate-pjt/mate-frontend/pull/99) 병합 및 최신 `main` 일치를 확인했다. `fix/dev-41-notification-email-mock`의 시작점은 `1a553daeb9dbc087bccfdd8b9189b2b6791a5923`이며 기존 미커밋 변경은 0건이다. 재전송과 시작의 공통 발급, 3분 경계 및 다섯 번째 오입력 처리부터 교정한다.

### 구현 및 자동 검증 체크포인트

2026-11-20 14:02 KST · mock 흐름과 고정 Clock/HTTP 대역 테스트를 검증했다. Node 22.20.0·pnpm 11.3.0의 격리 복사본에서 `pnpm test` 41파일·1,226건, `pnpm lint`, API/mock/hybrid 빌드 및 Storybook 빌드가 통과했다. 브라우저 mock 서버의 첫 포트가 이미 사용 중이어서 빈 포트로 재시작했다. 다음 행동은 합성 로그인으로 시작·만료·재전송·전환을 확인하고, 별도 loopback 대역의 시각 및 응답 수신처를 화면에서 검증하는 것이다.

<a id="dev-41-verification"></a>

## 2026-11-20 · 검증 결과와 Documentation Update Check

| 검증 | 결과 | 근거 |
| --- | --- | --- |
| `pnpm test` · Vitest Node | PASS · 41파일 1,226건 | 고정 Clock/Storage·HTTP fetch 대역, config-store/architecture 포함. [사례별 결과](../../../qa/notification-email-recipient.md#dev-41-local-qa) |
| `pnpm lint` | PASS | Node 22.20.0 · pnpm 11.3.0 |
| `pnpm build` | PASS · API/mock/hybrid | Preview, CI와 같은 hybrid 그룹 구성 및 loopback 전용 API 주소. TypeScript와 빌드/페이지 출력 확인 |
| `pnpm build-storybook` | PASS | Vite 번들 크기 경고와 빌드 완료를 확인했다. |
| `pnpm dev` · Aside 브라우저 | PASS · mock/HTTP 대역 | 로컬 Next의 320/390px mock, 1280px의 다른 응답 시각과 최신 응답 수신처. 테스트 복사본은 저장소의 환경 파일을 포함하지 않는다. [QA](../../../qa/notification-email-recipient.md#dev-41-local-qa) |
| 실제 API 통합 | 이번 실행 0건 | [QA-12](QA-12.md#qa-12-resume) 실제 오류 1건, [QA-13](QA-13.md#qa-13-resume) 수신처 6건의 기존 차단과 재개 조건 유지 |

개발 가이드와 데이터 접근의 합성 시나리오, 공통 계획의 날짜별 이력, QA와 작업 기록 및 WBS를 갱신했다. 현재·다음·상태의 소유 문서는 WBS다. package/scripts, 폴더/공개 계약, 운영 guard, 하네스 변화가 없으므로 base·architecture·harness는 기존 내용을 적용한다. 신규 재발 방지 항목이 없어 ai-failures는 유지한다. S09의 기준선과 coverage 매핑이 유지된다.

### 검증 체크포인트

2026-11-20 14:05 KST · 두 로컬 브라우저 흐름과 자동 검증의 결과를 QA에 남겼다. 실제 업무 데이터 변경·메일 발송·복구 대상은 0건이다. 다음 행동은 문서 검증과 두 리뷰에서 정책 경계, 구현 및 이전 QA 보존을 확인하는 것이다.

<a id="dev-41-close"></a>

## 2026-11-20 · 검증 판정과 다음 인계

- [Context Audit와 두 리뷰](../reviews/DEV-41.md)에서 착수 시 불일치의 해소를 확인했고 독립 verifier·ai-review가 승인 범위를 통과했다. 자동 수정 0/3회다. 종료·인계 기록이 추가된 diff도 두 리뷰 대상으로 삼는다. 실제 API 검증은 0건이며 기존 QA-12/13 차단을 유지한다.
- 다음 하나는 [POL-20](POL-20.md#pol-20-dev-41-handoff)이다. P0/P1에서 선행과 착수 조건을 충족한 미착수 Task가 없고, 앞선 P2의 차단 및 선행 대기를 적용하면 DOC-001이 충족된 첫 대기 후보다. 새 대화에서는 N02의 받은 알림 편집·삭제 기준선과 현행 중앙 정책·백엔드 명세 및 기존 QA의 차이를 확인한다. 선정과 인계 범위를 기록했다.

<a id="dev-41-delivery"></a>

## 2026-11-20 · Git 전달 확인

[작업 브랜치의 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afix%2Fdev-41-notification-email-mock)의 최종 head를 기준으로 목적별 fix/test/docs 커밋, 라벨, CI·리뷰 및 일반 merge 결과를 확인한다. 이번 사용자 승인으로 Chromatic 월간 한도 관련 검사만 예외를 적용할 수 있다. 최종 PR head와 main의 실제 로컬/원격 SHA는 PR과 종료 보고에서 확인한다.

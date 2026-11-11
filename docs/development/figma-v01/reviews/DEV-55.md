# DEV-55 · 개인 필터 도구막대 검증·리뷰

[Task/Brief](../tasks/DEV-55.md#dev-55-brief) · [WBS](../README.md) · [QA/캡처](../../../qa/personal-bid-filter.md#dev-55-local-qa) · [Context Audit](DEV-55-context.md)

## 검증 대상과 범위

- 시작 `8d7d656de6e55190fc4320677462da136538f7fe`, clean main/원격 동일, `fix/dev-55-personal-filter-toolbar`. POL-29 D1과 DEV-63은 main에 있다. 이번 사용자 승인에 따라 DEV-55 UI와 기록·Git 전달만 수행한다.
- Figma2048:58606/2098:65429 정상 desktop의 왼쪽 어두운 버튼+구분선, D1의 아래 보조행 예외를 구현했다. 기존 표시/활성 조건과 데이터 핸들러를 유지하고 shared Button/토큰·정적 fit 원본을 재사용했다. 1차 Major 뒤 선행 action render callback에 close를 제공해 명시적 닫기를 추가했다. 모바일은 승인된 responsive/접근성 확장 검증이다.
- 실제 업무 API/메일/업로드·운영/배포0건. QA-10 실제12차단·POL-02 미결과 모든 기존 QA/승인 예외를 유지한다. 제품 UI 구현·로컬 검증과 실제 API 통합 PASS는 별개다.

## 검증 근거

| 검사 | 결과/증거 |
| --- | --- |
| `pnpm test` | Node22.20.0/pnpm11.3.0,11files/187tests PASS. 계약·7그룹/guard·저장소/계정/DTO/architecture 회귀 포함 |
| `pnpm lint` | PASS |
| `pnpm build` | API/mock/hybrid 모두 PASS. hybrid는 기존 CI overrides 사용, API 검증 주소는 소유 loopback 대역이며 실제 업무 API에 연결하지 않음 |
| `pnpm build-storybook` | PASS. 기존 chunk size warning 외 오류 없음 |
| 실제 Next/브라우저 | 교정 후 mock6흐름·HTTP13상태+회사 적용/명시저장·403 추가2흐름, pointer/Enter/Space3입력의 팝오버 닫힘/재개방 draft·계정 불변, dialog 키보드/계정 격리 재검증 PASS. desktop/390/320px 캡처를 다시 확인했다. 상태별 결과는 QA 표 참조 |
| 경계/재현성 | 최종 mock브라우저219로컬/업무API0/외부0/pageerror0·server fetch0, HTTP 서버 전체71fetch/외부0. 두 mirror의 변경 runtime3파일 byte 일치. 초기 artifact 관측은 제외하고 최종 mock 재빌드·고정 후 다시 검증 |
| 문서/diff | 링크/anchor·원본79 ID/114Task/155의존성·단일 상태·baseline/coverage/기존 QA 원문 보존·Markdown·`git diff --check`와 manifest를 별도 검사 |

증거 디렉터리: 저장소 밖 `/Users/jisung/.codex/visualizations/2026/11/12/mate-dev-55/`. 환경파일 없는 mirror·명령 로그·JSON/PNG·검사기·리뷰/전달 receipt를 둔다. 제품 자동 수정1/3, 검증 환경 조치2회. 실제 API 자료 부족을 로컬 대역/문서 GET으로 대체하지 않았다.

## AI Review · 2026-11-12 교정 후 재검토

### 1. 리뷰 요약

원래 요구·POL-29 D1/상태표·수정 diff와 교정 후 검증을 다시 대조했다. 1차 primary 검토가 놓친 팝오버 Major를 실제 Next에서 재현·교정하고 세 입력/재개방·계정 경계 회귀를 추가했다. 현재 로컬 UI 범위 PASS, 미해결 Blocker/Major/Minor 없음. 독립 verifier 재검토와 종료 변경 freshness는 아래에 별도 기록한다.

### 2. 발견된 문제

1차 Major1: DOM 이동으로 바깥 pointerdown 닫기가 차단돼 미저장 draft가 잔존했다. close callback을 적용 전에 실행하도록 최소 교정하고 pointer/Enter/Space·재개방의 실제 Next 검증을 통과했다. runtime 변경은 두 bids TSX와853bytes 정적 아이콘에 한정되며 기존 mutation/URL/권한/버전 비교·계정 수명 핸들러를 보존했다. disabled/native Button 의미·장식 aria-hidden·DOM/키보드 순서를 확인했다. 기존 다른 화면/정책 차이와 실제 QA 차단은 해소됐다고 주장하지 않는다.

### 3. 누락된 검증

실제 업무 API 통합·실행 SHA 대응·disposable 자원/변경·잔존·복구는 미확보로 미실행이다. QA-10 재개 Gate를 보존한다. 모바일 전용 Figma 원본과 모든 타 화면 pixel 대조는 범위 밖이다. 원격 최종 head CI/리뷰·병합/동기화는 Git 전달 단계에서 확인하며 로컬 PASS로 대신하지 않는다.

### 4. 문서 갱신 필요 여부

DESIGN·plan·WBS·Task·기존 QA append·대표 캡처·두 검토 기록을 갱신했다. package/구조/실제 공급원·DTO/의미·하네스 규칙 변경이 없어 base/architecture/data-access/harness 미갱신. 단발 검증 환경 조치는 Task/QA에 기록하고, 실제 재작업을 만든 DOM/ref 경계 회귀의 원인·교정·조합 검증 예방 규칙을 ai-failures에 추가했다. baseline/coverage와 기존 QA 이력·소유/차단/승인 예외는 보존 검사한다.

### 5. 개발자 확인 필요

새 제품 정책/라이브러리·Git 전달 승인 재요청 없음. 실제 API QA 재개 자원은 별도 미결이다. 과거 PR49의 Chromatic 예외를 사용하지 않으며 이번 최종 PR에 외부 CI 차단이 실제 발생하면 head/check/재개 조건과 필요한 최소 결정만 제시한다.

### 6. 추천 수정 방향

문서 검사·독립 verifier 및 종료 메타데이터의 freshness 확인 뒤 UI/자산과 검증·인계 문서를 목적별 작은 커밋으로 분리해 전달한다. 최종 head CI·리뷰/허용 merge·로컬 main fast-forward를 확인하고 다음 Task는 선정/인계만 한다.

## 독립 verifier와 review freshness

- 1차 read-only verifier **FAIL**: manifest `954c1f9b3c1f554760abdd0f852f34104188b7a162fb6060a6671a97d4796b8c`, Blocker0/Major1/Minor0. source에서 팝오버 잔존 회귀를 발견했고187 tests·문서 검사/diff-check를 직접 통과했다. 이 FAIL은 소급 PASS로 바꾸지 않는다. primary의 당시 문제 없음 판정도 해당 조합에 불충분했으며 최종 근거로 쓰지 않는다.
- 교정 후187 tests/lint·3구성 build·Storybook·기존 주요 mock/HTTP/접근성과 새3입력 회귀를 재실행했다. 같은 verifier에게 실제 diff·교정/문서 근거와 새 manifest의 재검토를 요청한다.
- 검토 뒤 코드/문서가 달라지면 관련 검사·두 리뷰를 다시 수행한다. Git 전달 결과는 최종 PR/head·외부 receipt/최종 보고에 기록해 검토한 diff를 고정한다.

## 독립 verifier · 교정 후 재검토 보고

### Result

PASS. 원래1차 FAIL/Major1을 보존하며 교정 후 판정과 구분한다.

### Summary

closeFilters를 먼저 실행한 뒤 기존 적용 함수를 호출한다. 교정 source와 실제 Next의3입력/재개방·계정 불변 근거가 일치한다.

### Issues

Blocker0 / Major0 / Minor0. 이전 팝오버 잔존은 교정 전 reproduced:true와 교정 후3입력 통과를 각각 확인했다.

### Verification

Node22.20.0 `pnpm test`11files/187tests·문서 검사 `--stdout-only`·`git diff --check`를 verifier가 직접 통과했다. 교정 diff·회귀 스크립트·lint/3구성 build/Storybook·mock6/HTTP13+2·3입력·dialog 키보드/계정·캡처를 검토했다.79원본/114Task/155의존성·링크403/앵커64·원문/두 mirror byte 일치·server mock0/HTTP71 fetch·외부0·listener0을 확인했다. 충분한 교정 후 근거로 브라우저/build를 다시 실행하지 않았고 실제 API/원격 CI는 별도 대상으로 남겼다.

### Documentation Update Check

QA/Task·review/context·ai-failures에 첫 실패와 교정·재검증을 반영했다. 추가 제품 정책 결정은 필요 없다. 종료 체크리스트·WBS/POL-30 인계 추가분은 최종 freshness 대상으로 남겼다.

### Review freshness

이번 독립 PASS 대상 manifest는 `bc4416ee1ebf4d558e14808262c5710dbe32fc038bb7c2def4220d05fa6b5e27`다. 이후 종료 문구만 추가했으며 runtime/검증 source는 그대로다. 문서 검사와 primary6절 ai-review를 다시 수행하고 동일 verifier의 최종 freshness를 요청한다. 최종 원문/지문·Git 결과는 저장소 밖 receipt/PR·최종 보고에 남겨 이 diff를 고정한다.

### Developer follow-up

종료 문서/선정·인계만 재검토한다. 실제 QA-10의12차단·POL-02 미결과 타 Task 차단/승인 예외를 계속 보존한다. 다음 POL-30의 상세 조사·정책 결정/원문·제품 수정은 이번에 시작하지 않는다.

## 종료 metadata를 포함한 primary ai-review freshness

위6절을 다시 수행했다. 리뷰 요약: 교정 코드/검증은 그대로이고 종료 체크리스트·WBS·POL-30 선정/인계·리뷰 보고만 추가했다. 발견된 문제: 미해결 Blocker/Major/Minor 없음, 첫 Major 이력 보존. 누락된 검증: 실제 QA/원격 최종 CI는 별도이며 문구만 바뀌어 앱 검사를 반복하지 않는다. 문서 갱신 필요 여부: 원본/단일 상태·14파일 범위·링크/ID/의존성·Markdown·diff를 재검사한다. 개발자 확인 필요: 새 승인/정책 결정 없음. 추천 수정 방향: 동일 verifier의 마지막 freshness 통과 후 목적별 commit·push/PR·실제 head CI/리뷰 조건·허용 merge·main fast-forward를 진행한다. 종료 문구 이후 runtime 변경은 없다.

## 2026-11-12 · PR #54 CI 예외 승인 기록의 후속 AI Review

### 1. 리뷰 요약

[사용자 후속 승인](../tasks/DEV-55.md#dev-55-pr54-ci-exception)은 이번 PR의 한도 차단 Chromatic 두 검사에만 적용한다. WBS/Task/이 리뷰3문서의 기록과 제품 코드 고정·최종 head 재검증 계획을 대조한다. Git 전달과 제품/실제 통합 판정을 분리하며 문서 범위에 신규 Blocker/Major 없음.

### 2. 발견된 문제

제품 결함 추가 없음. `UI Tests`·`UI Review`는 미실행/PENDING 이력을 보존한다. 게시 성공을 테스트/리뷰 PASS로 바꾸거나 기존 PR49 예외를 재사용하지 않는다. 최초 팝오버 Major/교정 이력도 그대로다.

### 3. 누락된 검증

Chromatic 두 검사는 사용자 승인 예외이며 실제 QA-10의12차단·POL-02 미결은 별도 유지한다. 이번에는 문서만 바뀌어187 tests/lint·3구성 build/Storybook·실제 Next 브라우저를 재실행하지 않는다. 새 최종 head의 나머지 원격 CI/리뷰·병합 조건은 push 후 반드시 확인한다.

### 4. 문서 갱신 필요 여부

WBS·DEV-55 기록·이 리뷰에 이번 결정자/날짜·원문/사유·PR/head·두 검사와 제외 범위를 연결했다. package/scripts/구조/API/하네스·QA 결과 변화가 없어 다른 문서를 갱신하지 않는다. 원본79개/114Task/155의존성·기존 QA/정책 이력·제품 지문을 보존 검사한다.

### 5. 개발자 확인 필요

이번 예외와 Git 전달은 이미 승인됐으므로 같은 승인을 다시 묻지 않는다. 저장소 정상 병합 조건이 새로 차단되거나 두 검사 밖의 실패가 발생하면 그 원인/최소 재개 조건만 별도로 제시한다. 보호 우회·검사 강제 성공 권한은 없다.

### 6. 추천 수정 방향

문서/diff 검사와 동일 verifier의 후속 freshness를 마친 뒤 이 기록만 작은 docs 커밋으로 push한다. 실제 최종 head의 두 예외 및 나머지 CI/리뷰를 다시 대조하고 허용된 merge·로컬 main fast-forward를 수행한다. 이후 Git 결과는 외부 receipt/PR·최종 보고에 남겨 이 diff를 고정한다.

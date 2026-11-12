# POL-30 · 문서 검증과 Review Gate · 2026-11-12

## 대상과 판정 경계

- 원본 요구/승인/성공 기준: [POL-30 Brief](../tasks/POL-30.md#pol-30-brief), [정책 v1](../tasks/POL-30.md#pol-30-contract). 사용자 확정은 마감·취소된 공개 기준에서 같은 업종·품목의 진행 후보 표시다.
- 시작: clean main `852fbe708cd11d7e3ec42be6914f36ee504bf743`, 브랜치 `docs/pol-30-related-source-policy`. 기존 dirty는 모두 이번 조사/체크포인트이고 무관 변경은 없었다.79원본/114Task/155의존성·기준선/감사와 기존 QA를 보존한다.
- [출처13개/개발 OpenAPI](POL-30-sources.json)와 [선별 Context Audit](POL-30-context.md)을 대조한다. 중앙 원문 충돌/기존 mock 차이의 진단 FAIL은 이번 정책 문서 검증과 별개이며 중앙 반영·DEV-61 구현·실제 API 통합은 수행하지 않는다.
- 이번 사용자 Git 전달 승인과 Chromatic 월간 한도 예외만 적용한다. 다른 CI 실패/보호 규칙 우회·check 강제 성공·다른 Task 실제 QA 면제는 없다.

## 검증 기록

- 문서 검사: 저장소 밖 `pol-30/verify-docs.py`로 변경 범위·79개 원본/114개 Task·155의존성/순환·상태·링크/anchor·Markdown 표/코드 fence·patch 접두문자·비밀값 패턴·기준선/감사 hash·QA/DEV-61 기존 본문 prefix 보존을 검사한다. 1차 실행 PASS: 문서10파일·원본79/Task114/의존성155·링크765·보존 지문8개. 종료 metadata 이후 전체 재실행한다.
- `git diff --check`는 별도로 확인한다. package.json은 dev/build/start/lint/test/test:watch/storybook/build-storybook 8scripts, pnpm11.3.0, pin/CI Node22.20.0이다. 이번 셸 Node26.5.0은 앱 실행 검증 근거로 쓰지 않는다.
- 로컬 앱 test/lint/build/Storybook·제품 브라우저·HTTP 대역·실제 업무 API는 문서 전용/실행 코드 영향0으로 미실행이다. backend 테스트는 소스만 읽었다. 개발 Swagger 문서 GET200을 업무 응답 PASS로 표시하지 않는다. 원격 CI의 실제 실행 결과는 최종 PR/head에서 별도 확인한다.
- 공개 작성자 메타데이터 출력 사건을 사용자에게 공개했고 [실패 기록](../../../ai-context/ai-failures.md#pol-30-github-metadata)에 값을 재인용하지 않고 기록했다. 이후 SHA/필수 상태만 투영한다. 교정으로 기존 출력이 삭제·무효화됐다고 주장하지 않는다.

- 첫 표 검사에서 정규식의 `\s*`가 표 뒤 빈 줄까지 묶어 열 수 -1의 false positive를 냈다. 저장소 밖 검사 도구의 공백 처리를 수평 공백으로1회 교정하고 전체 검사를 재실행해 PASS했다. 제품/문서의 결함을 고친 것은 아니며 앱 자동 수정0/3, 검사 도구 교정1회다.

## Documentation Update Check

- 완료 대상: WBS/Task·coverage·DEV-61/상세 QA 후속 기준·plan 날짜별 진입점·출처/context·실패 기록. 실제 통과/차단과 원본 이력은 보존한다.
- 갱신 불필요: base의 package/scripts·architecture/data-access의 구조/공개 데이터 계약·harness의 역할/권한이 바뀌지 않았다.
- 중앙 문서 정정안은 로컬 산출물이며 mate-docs 소유 역할의 별도 반영이 필요하다. 개인 배정·중앙 PR/배포/실행 SHA는 미확정이다. DEV-61은 로컬 확정 정책을 적용하되 실제 QA를 면제받지 않는다.

## Read-only verifier

Result: **PASS(1차 정책 문서 diff)**.

- Summary: 사용자 확정과 중앙 정책/backend source snapshot을 대조해 기준 마감/취소 허용·후보 현재 상태 제한·400/404/빈 목록·분류/정확 코드/금액/정렬/Clock 및 범위/기존 QA 보존이 일치함을 확인했다.
- Issues: Blocker 없음, Major 없음. Minor는 source JSON 중앙 정책 URL의 main 가변 링크1개였으며 같은 항목의 고정 ref로 교정했다.
- Verification: 문서 검사·diff-check를 독립 재실행해 PASS, source snapshot13개 Git blob hash가 JSON과 모두 일치했다. 문서10파일·원본79/Task114/의존성155·링크765·보존 지문8개를 확인했다. runtime/test/package/.codex/.github 변경 없음. 앱/제품 브라우저/backend 테스트/실제 API 미실행은 문서 범위에 맞다.
- Documentation Update Check: Task/WBS/coverage·DEV-61/QA·plan·사건/검토/출처의 갱신이 적절하다. base/architecture/data-access/harness 추가 변경은 불필요하다. 중앙 반영·실행 SHA/실제 QA 자원은 후속이다.
- Review freshness: 1차 PASS는 당시 미커밋 diff/새 문서3개 대상이다. URL 교정·완료/WBS/선정·PR 연결 뒤 재검토해야 한다. verifier는 파일을 수정하지 않았다.
- Developer follow-up: 새 정책 확인 없이 Minor 교정/종료 재검토 후 승인된 Git 전달을 이어가고 다음 구현을 시작하지 않는다.

## AI Review

### 1. 리뷰 요약

**PASS(1차 문서 diff)**. 원본 요구/사용자 확정과 실제 tracked diff·새 문서3개·고정 source/출처·package scripts·문서 검사 결과를 대조했다. 정책 v1·중앙 정정안·DEV-61/QA 인계로 범위가 제한되고 제품/실제 API 완료와 구분된다. 구조/TypeScript/UI 토큰·공개 Repository/7공급원·snapshot/guard/계정 격리/upload handle 규칙은 변경하지 않았다.

### 2. 발견된 문제

미해결 **Blocker/Major/Minor 없음(이번 문서 변경)**. 기존 중앙 충돌과 mock CF-07은 정정안/DEV-61에 남기며 제품 PASS로 덮지 않는다. WBS의 현재113개/과거 집계 혼용은114개 실제 표와 동기화했고 날짜별 이력은 보존했다. GitHub 메타데이터 출력 사건은 공개/기록했고 추가 diff/receipt에는 원문 개인정보를 넣지 않았다.

### 3. 누락된 검증

이번 문서 Gate의 미해결 검증 공백은 없다. 로컬 앱 test/lint/build/Storybook·제품 브라우저·HTTP 대역·실제 API/실행 SHA는 실행 코드 영향0의 문서 범위라 미실행이다. backend 테스트는 소스 확인뿐이다. 실제 QA-03의1통과8차단과 DETAIL-07 통과 범위가 유지된다. 최종 head 원격 CI/병합은 아직 수행 전이며 문서 PASS와 별도로 확인한다.

### 4. 문서 갱신 필요 여부

WBS/Task·coverage·DEV-61/상세 QA·plan·사건 로그·context/sources/review가 필요한 연결을 담았다. base/architecture/data-access/harness는 규칙/구조/실행 설정 불변이라 갱신하지 않는다. 정책 소유/중앙 미반영·실제 QA 재개 조건을 명시했다. 종료/WBS/인계 metadata는 두 리뷰 후 추가하고 재검토한다.

### 5. 개발자 확인 필요

이번 정책/Git 전달/Chromatic 월간 한도 예외는 승인돼 반복 확인이 필요 없다. 중앙 문서 소유 개인/별도 반영과 backend 실행 대응·실제 QA 자원은 후속 사항이다. 제품 구현/중앙 쓰기·업무 API/다른 CI 면제의 승인으로 확대하지 않는다.

### 6. 추천 수정 방향

추가 정책/제품 수정 없이 독립 verifier를 진행한다. 통과 후 WBS 완료/다음 한 작업의 선정·인계와 종료 기록을 추가하고 문서 검사 및 verifier/ai-review freshness를 다시 확인한다. 커밋은 정책·후속 기준·사건 로그·검증 기록으로 목적을 나누고 원격 최종 head의 checks/리뷰·정상 merge 조건을 확인한다.

## Review freshness와 Git 전달

최종 검토 대상과 후속 변경 재검토는 완료 시 기록한다. commit/PR/최종 head CI/정상 merge·로컬 main 동일 SHA는 원격 상태/외부 비식별 receipt/최종 보고로 확인하며 수행 전 결과를 미리 쓰지 않는다.


## 종료 metadata 준비

1차 verifier의 Minor 고정 URL을 교정하고 Task 체크리스트·WBS 완료/집계·DEV-61 다음 선정 이유/첫 행동과 이 보고서를 추가했다. primary는 변경을 다시 대조해 정책/계약·실제 QA 범위가 변하지 않았고 갱신 문서의 Blocker/Major/Minor가 남지 않음을 확인했다. AI Review의 위 여섯 섹션을 이 종료 diff에도 적용한다. 전체 문서 최종 검사와 같은 verifier의 freshness를 재실행하며 실제 결과/최종 지문은 외부 receipt/최종 보고에 보존한다. 이후 PR/head 연결이 추가되면 해당 부분도 다시 검토한다.

# QA-17 · Git 전달·공통 시작 프롬프트 인계

[감사/계획 검토](QA-17.md) · [WBS](../README.md) · [공통 시작 프롬프트](../start-prompt.md)

## 요구사항·승인과 시작 기준

- 2026-11-11 사용자: “QA-17 문서 변경부터 목적별 커밋·push·PR·CI 확인·main 병합·로컬 main 동기화까지 마무리해줘. 기존 변경과 검증 이력을 보존하고, POL-29는 시작하지 마.” 공통 Task 시작 프롬프트의 재작성도 요청했다.
- 앞선 감사 요청의 Git 전달 제외·미커밋 종료는 당시 승인 범위로 보존한다. 이번 승인은 QA-17 문서/공통 인계 문구의 Git 전달에 적용하며 제품 구현·실제 업무 API 변경·서비스 운영/배포·POL-29 정책 선택으로 확대하지 않는다.
- 시작: local main/원격 main `8d3a2ec290aabc4280c5e9f5336cfd36376f7e94`. 기존 검토 manifest61개 문서의 경로/hash가 모두 일치하고 무관한 변경 없음 확인. 원본464파일 지문과 감사 증거/과거 검증 기록 보존.
- 작업 브랜치: `docs/qa-17-conformance-plan`. 원격 main fetch 후 동일 SHA 확인. 기존 미커밋 변경을 그대로 보존해 브랜치로 이동했다. reset/stash/정리 미실행.

## 편집 전 Brief·설계

- 목적: QA-17 산출물의 검증 이력을 보존해 Git 전달하고 재사용 가능한 Task 시작 프롬프트를 제공한다. POL-29는 준비 상태의 다음 Gate로만 남긴다.
- 변경: 기존61문서에 Git 승인/전달 체크포인트, start-prompt/task-cycle 및 이 검토 기록을 추가한다. 제품·테스트·패키지/환경·CI 설정 변경 없음.
- 단계: 시작 지문/원격 조건 → 공통 프롬프트/인계 문서 → 문서/보존 검사·두 리뷰 → 도메인/목적별 커밋 → push/템플릿 PR·type: docs → 실제 head CI/조건 → 허용 merge 방식 → 로컬 main fast-forward·동일 SHA/clean 확인.
- 검증: 원본/기존QA·제품 지문, 79ID/113Task·의존성/상태·링크/anchor·Markdown 형식·diff-check, 이전61변경 보존, 새 프롬프트의 범위/승인/선행·CI 차단 처리. 문서 전용이므로 로컬 앱 test/lint/build는 새로 실행하지 않는다. 원격 CI는 실제 결과로 별도 기록한다.
- 사실/제약: 저장소는 merge/rebase/squash 허용, main protected=false, 적용 ruleset 없음을 조회했다. 이 상태를 CI 확인 면제/과거 예외 재사용으로 해석하지 않는다. 라벨 목록은 연결 도구가 제공하지 않아 CLI로 조회했고 `type: docs`가 존재함을 확인했다.

## 검증·문서 갱신

- 기존 감사 보고서/JSON·원본79개·과거QA·제품/테스트/설정은 보존한다. 새 사용자 요구에 따른 승인/전달과 공통 프롬프트만 보완한다.
- Documentation Update Check: WBS/QA-17의 날짜별 승인/체크포인트·이 기록, start-prompt/task-cycle을 갱신한다. base/architecture/data-access/실행 하네스 구조는 바뀌지 않아 유지한다. 기존 ai-failures 기록과 문서 형식 예방 검사를 계속 적용한다.
- 최종 결과·PR/head/원격 checks·병합/동기화 receipt는 저장소 밖 `mate-conformance-audit/`의 delivery 기록과 실제 PR·최종 보고에 남긴다. 아직 실행하지 않은 결과를 PASS로 미리 기록하지 않는다.

## ai-review

### 1. 리뷰 요약

PASS(전달 준비 문서 범위). 실제 diff/신규 파일·공통 프롬프트·원본/Task/상태·검증 결과를 대조했다. 감사/정책·제품 정합성과 Git 전달은 별개로 기록한다. 원격 CI/병합은 아직 미실행이다.

### 2. 발견된 문제

현재 전달 준비 diff에 남은 Blocker/Major/Minor 없음. 기존 제품 Context Audit FAIL은 기존 Task에 남기며 이 전달 문서의 결함과 구분한다. 새 프롬프트가 다른 Task의 미커밋 변경 전달·정책/시각 예외 승인·과거 CI 예외를 자동 확대하지 않음을 확인했다.

### 3. 누락된 검증

제품 코드 변경이 없어 로컬 앱 test/lint/build·새 실제 API QA는 미실행한다. 원격 CI와 병합은 실행 후 결과만 기록한다.

### 4. 문서 갱신 필요 여부

위 인계 문서를 갱신한다. 공통 프롬프트는 Task 유형별 범위, 선행 변경 보존·미반영 처리, 정책 추천/승인·도메인 정책/시각 승인, 현재 계약 직접 조회, 문서 검증·CI 차단·다음 작업 미착수를 구분한다.

### 5. 개발자 확인 필요

Git 전달 범위는 이번 요청으로 승인됐다. 정책 선택이나 외부 CI 예외가 필요하면 해당 구체적 결과를 먼저 확인한다. 과거 PR #49 전용 Chromatic 예외를 이번 PR에 적용하지 않는다.

### 6. 추천 수정 방향

문서/보존 검사와 read-only verifier의 결과를 반영한 뒤 목적별 커밋·PR·최종 head CI를 확인한다. POL-29는 시작하지 않는다. 문서 검사는64문서·113Task/154의존성 무순환·원본79개·보호301/기준선QA27개·Markdown/23제목·링크1822/anchor224·diff-check PASS다. 이전61문서의 승인/전달 메타데이터 외 내용도 비교한다.

## 독립 verifier·freshness

2026-11-11 · 독립 verifier **PASS — Git 전달 준비·공통 프롬프트 문서 범위**. 64문서 지문 일치, 이전61문서 중 승인/전달 메타데이터 외59개 동일, 원본79개/제품301/기준선QA27 보존, 113Task/154의존성·20route/23발견·링크1822/anchor224·형식/diff-check를 확인했다. Blocker/Major/Minor 없음. 같은 Task 재개·이전 Git 제외와 이번 승인·POL-29 미착수를 확인했다.

이 PASS 뒤 WBS/QA-17의 문서 완료·Git 대기 및 이 검토 요약만 반영하고 자체 ai-review와 같은 verifier의 freshness를 재확인한다. 원격 CI/병합은 아직 미실행이며 실제 PR/head와 로컬 `delivery-*` receipt·최종 보고에서 결과를 확인한다. 검토 뒤 추가 내용 변경이 있으면 재검증/재검토한다.

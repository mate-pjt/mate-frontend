# Context Audit Report · POL-30 · 2026-11-12

## 결론

**FAIL — 기존 관련 공고 mock/중앙 정책 불일치가 남아 있다.** 이번 문서 검증의 판정과 구분한다. 아래 진단은 관련 경로의 읽기 전용 대조이며 전체 제품/실제 API 재검증은 아니다. POL-30에서 정책을 결정하더라도 mock 교정은 DEV-61, 실제 통합은 기존 QA-03이 소유한다.

## 확인한 코드베이스 사실

- 시작 main/원격 main은 `852fbe708cd11d7e3ec42be6914f36ee504bf743`, clean·차이0/0. 선행 QA-17 반영, 같은 POL-30 브랜치/미커밋 변경 없음. `docs/pol-30-related-source-policy`를 생성했다.
- package.json의 Next16.2.9·React19.2.4·pnpm11.3.0·Vitest4.1.11 및8scripts는 base와 일치한다. 독립 type-check/format 없음. `.nvmrc`/CI는 Node22.20.0, 이번 셸은 Node26.5.0·pnpm11.3.0이다. 문서 검사에 Python/Git을 사용하며 이 셸에서 앱 검사를 통과했다고 주장하지 않는다.
- App Router20page·7개 Repository 공급원·static Q&A, bids 공개 server 진입·HTTP/mock 분리·Clock 주입과 config snapshot/production guard 구조를 선별 확인했다. source-only 관찰이며 격리·guard를 이번에 실행한 결과가 아니다.
- 중앙 main은 `c9e50ff591ae18023164e1a94581c611bf1e4f29`, backend dev는 `4c328d4a943eaa5dcbb0e8d9596b22389d154988`. service/policy blob은 QA-17 당시와 동일하다. 개발 Swagger 문서 GET200과 관련 schema는 확인했지만 업무 API/현재 실행 SHA는 미확인이다.

## 문서별 정합성 점검

### base.md

버전·packageManager·lockfile·scripts·`.nvmrc`/CI 기준이 일치한다. 셸 Node26 관찰은 저장소 pin의 변경이 아니다. package/실행 설정 변경이 없어 갱신 불필요다.

### architecture.md

관련 app/data/features/lib 및 공개 Repository/DTO 경계 설명이 현재 파일과 일치한다. 현재 관련 mock이 정책에 맞는다는 주장은 문서에 추가하지 않는다. 구조/스타일/실행 코드는 바꾸지 않아 갱신 불필요다.

### data-access.md

7개 공급원·공개 client/server·build snapshot·fallback 없음·Clock/탭/계정·upload handle 규칙은 유지된다. 이번 Task는 해당 제약을 변경하지 않는다. 정확 일치/상태 정책과 현재 mock 차이는 아래 CF-07 및 DEV-61에 남기며 정책을 결함에 맞춰 완화하지 않는다. 기존 HTTP 대역/mock/실제 API 구분과 QA 차단을 보존한다.

### plan.md

날짜별 과거 구현/QA와 WBS의 현재 상태 책임을 구분한다.79원본·114Task·155의존성은 실제 표와 대응한다. WBS의 과거113개 설명 일부가 ‘현재’ 집계로 남아 있는 Minor를 발견했다. 날짜별113개 이력은 보존하고 현재 집계만 동기화할 것을 제안했다. POL-30의 확정 범위/미실행과 후속 소유를 가리키는 날짜별 진입점 갱신이 필요하다.

### harness.md

AGENTS·세 skill·verifier 정의·placeholder config가 존재하고 권한/흐름이 일치한다. `.codex/config.toml`의 과거 script 주석을 현재 script 목록이나 active 설정으로 쓰지 않는다. 하네스 변경이 없어 갱신 불필요다.

### ai-failures.md

기존 GitHub 출력 예방 규칙을 초기에 적용하지 못해 공개 작성자 메타데이터가 출력됐다. 사용자에게 공개했고 이후 SHA/필수 필드만 투영한다. 재발 사건과 교정을 별도 기록하되 값은 재인용하지 않는다. 기존 Markdown 접두문자/표 형식 검사도 문서 검증에 포함한다.

## 발견된 불일치

- 심각도: **Major · 기존 CF-07**
- 관련 문서: [DEV-61](../tasks/DEV-61.md), [CF-07](../audits/2026-11-11.md#cf-07).
- 실제 코드베이스 상태: `mock-repository.ts`는 자기 ID 제외 뒤 첫3개를 반환하고 target 분류1/기초금액을 재사용한다. 정확 코드/같은 업무 유형·후보 상태/사업금액 정책을 충족하지 않는다.
- 문서의 현재 설명: exact match·진행 후보·최신순·추정가격+VAT를 후속 완료 기준으로 요구한다.
- 추천 조치: POL-30의 상태 기준 확정 후 DEV-61의 별도 Gate에서 구현/자동·Next 검증. QA-03 실제 이력은 유지한다.
- 자동 수정 가능 여부: **No, 이번 정책 Task의 제품 수정 범위 밖.**

- 심각도: **Major · 중앙 원문 CF-23**
- 관련 문서: [POL-30](../tasks/POL-30.md), 중앙 matching-and-related-notices.md §6/§10/§11.
- 실제 코드베이스 상태: 공개 기준 공고의 마감/취소는 허용하며 미공개/삭제/미존재·없는 선택 분류는404, 공식 비교 사실이 없으면 빈 Slice다. 후보는 별도 공개/삭제/취소/마감 규칙을 적용한다.
- 문서의 현재 설명: §6의 마감/취소 배제와 §10의 허용이 충돌하고, §10은 삭제 기준 공고도 빈 목록으로 설명한다.
- 추천 조치: 사용자 결정과 중앙 소유 역할/정정안을 기록한다. 이 저장소의 적용 기준과 중앙 반영 여부를 구분하고 중앙 원문/실행 서버를 임의 수정하지 않는다.
- 자동 수정 가능 여부: **No, 정책 선택은 developer confirmation required; 중앙 저장소는 이번 수정 범위 밖.**

- 심각도: **Minor · WBS 현재 집계**
- 관련 문서: [WBS](../README.md).
- 실제 코드베이스 상태:114Task·155의존성, 착수 시 완료13/차단21/대기77/보류2/준비1.
- 문서의 현재 설명: 상단 일부 문장이 현재113개·완료9/차단18/대기83/준비1/보류2로 남아 있다. 뒤의 날짜별 기록은114개를 설명한다.
- 추천 조치: 현재 설명/집계만 표로부터 계산해 교정하고 원본/날짜별 집계는 보존한다.
- 자동 수정 가능 여부: **Yes, 사용자에게 먼저 제시한 사실 동기화 범위.**

## 개발자 확인 필요 사항

기준/후보 상태표의 정책 선택은 [POL-30 질문/결정 기록](../tasks/POL-30.md)에 남긴다. 확인 전 소스 관찰을 승인으로 간주하지 않는다. 중앙 반영·실행 SHA/업무 응답·QA 자원은 별도 근거가 필요하며 문서 검증으로 대체하지 않는다.

## 추천 수정 방향

POL-30에서 확정된 상태표와 중앙 정정안, 고정 Clock/음성 사례 및 DEV-61/QA-03 인계를 작성하고 문서 검증·두 리뷰를 수행한다. 진단으로 발견한 제품/중앙 원문 차이는 각각 소유 경계에 남긴다. 현재/다음/상태는 WBS만 관리한다.


## 2026-11-12 · 결정/정합성 후속 확인

사용자가 마감·취소 기준의 진행 후보 표시를 명시 확정해 POL-30 v1/중앙 정정안과 DEV-61/QA 후속 기준을 문서화했다. 정책 입력 차단은 해소됐다. 중앙 원문은 수정하지 않았고 기존 CF-07 mock 차이도 DEV-61에 남아 있으므로 위 source/원문 진단 FAIL을 제품/중앙 반영 PASS로 바꾸지 않는다. WBS 현재 설명/집계는114개 실제 행으로 교정했으며113개는 날짜별 이력으로 보존한다. base/architecture/data-access/harness 규칙 변경은 없다. 문서 검증/두 리뷰의 최종 판정은 [POL-30 검토 기록](POL-30.md)을 따른다.

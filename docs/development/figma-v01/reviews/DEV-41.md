# DEV-41 검증과 리뷰

2026-11-20 KST · 기준 `1a553daeb9dbc087bccfdd8b9189b2b6791a5923` · `fix/dev-41-notification-email-mock`

[Brief와 검증](../tasks/DEV-41.md#dev-41-verification) · [브라우저·실제 QA 기록](../../../qa/notification-email-recipient.md#dev-41-local-qa)

## Context Audit Report

### 결론

착수 시 FAIL. 중앙 정책과 현행 mock·가이드의 인증 시각 및 요청 교체 기준에 Major 불일치가 있었다. DEV-41 범위의 수정·재대조 결과는 PASS다.

### 확인한 코드베이스 사실

`package.json`의 8개 스크립트, Next 16.2.9·React 19.2.4·Vitest 4.1.11, pnpm 11.3.0·lockfile v9, Node 22.20.0 핀을 확인했다. 공개 Repository 진입점과 탭·계정별 mock 저장, 주입 Clock이 현행 구현에 있다.

### 문서별 정합성 점검

| 문서 | 결과 |
| --- | --- |
| base.md | 스크립트·Node 핀·설정별 CI 설명 일치 |
| architecture.md | 알림 설정 route, 화면과 Repository의 경계, HTTP DTO 영역 일치 |
| data-access.md | 7개 공급원·빌드 snapshot/운영 guard·계정별 mock 저장 일치. 이메일 항목을 현행 인증 동작으로 갱신 |
| plan.md | WBS 단일 상태·S09 및 POL-19 근거 유지. DEV-41 검증 이력 연결 |
| harness.md | feature-workflow, context-audit, ai-review와 verifier, 검증 명령 및 하네스 흐름 일치 |
| ai-failures.md | 이번 작업에서 새 재발 방지 규칙이 필요한 근거 없음 |

### 발견된 불일치

- Major · 착수 시 mock Repository와 개발 가이드는 10분/30초를 사용했다. 재전송이 같은 ID와 고정 번호를 사용했고, 다섯 번째 오입력 다음 요청부터 차단을 표시했다. POL-19의 3분/60초·요청 교체·다섯 번째 차단을 적용하고 시각·복원·오입력 경계의 회귀 테스트와 가이드를 동기화했다.

### 개발자 확인 필요 사항

DEV-41 범위에서 추가 정책 결정은 없다. 실제 수신/전환의 자원·안전한 오류와 복구, 실행 버전 대응은 QA-12/13의 재개 조건을 따른다.

### 추천 수정 방향

이번 단위의 코드와 가이드 동기화를 반영한다. 실제 수신 검증은 별도 QA 기록에서 계속 관리한다.

## AI Review

### 1. 리뷰 요약

PASS. POL-19와 DEV-41 원요구, Git diff와 [mock Repository](../../../../src/data/notification-settings/mock-repository.ts), 공개 진입점과 HTTP Repository·팝업, package scripts, 검증 출력을 대조했다. 공통 발송 경계, 기존 주소 보존, 구형 상태와 계정별 요청을 검증했다.

### 2. 발견된 문제

미해결 Blocker·Major·Minor 없음. 시작/재전송 후 mock은 공개 응답의 ID·절대 시각을 전달하고, HTTP 결과의 시각 및 최신 응답 주소의 UI 반영을 대역으로 확인했다. 실행 코드 diff는 notificationSettings mock에 한정돼 다른 공급원과 인증·업로드 경계는 기존 계약을 적용한다. 검증 주소와 번호는 합성 fixture다.

### 3. 누락된 검증

DEV-41의 로컬 자동·브라우저·문서 계획을 수행했다. 실서버 발송·업무 데이터 변경은 이번에 실행하지 않았다. 기존 NSET-07 1건과 NREC 6건의 차단을 QA에 보존한다.

### 4. 문서 갱신 필요 여부

개발 가이드·data-access·plan·QA와 WBS·작업/인계 근거를 갱신했다. 기준선과 기존 QA 원문, 79개 원본과 114개 Task·156개 선행을 보존했다. base·architecture·harness·ai-failures는 갱신 사유가 없다.

### 5. 개발자 확인 필요

DEV-41 검증 범위의 추가 결정은 없다. 별도 실제 QA 재개에는 승인과 실행 자원이 필요하다.

### 6. 추천 수정 방향

두 리뷰와 종료 문서 최신성을 확인한 버전을 목적별로 전달한다. 다음 정책 결정은 POL-20의 자체 Gate에서 조사한다.

## 독립 verifier

### 판정

PASS. 3분 만료, 진행 중인 계정별 요청의 60초 대기, 다섯 번째 오입력 차단 및 재전송 뒤 이전 요청과 번호 거절을 확인했다. 최신 요청의 확인 성공에서 주소가 바뀌고, 구형 탭은 주소·ON/OFF·오입력 횟수를 보존한다.

### 발견된 문제

Blocker·Major·Minor 0건.

### 검증

- Node 22.20.0 격리 환경에서 `pnpm test tests/account-repositories.test.ts tests/http-contracts.test.ts tests/config-store.test.ts tests/architecture.test.ts` 46건을 독립 재실행했다.
- 전체 1,226건, lint, 세 프로필과 Storybook 빌드의 결과, Next mock/loopback 브라우저 상태 및 대역의 수신 기록을 대조했다. 기존 실제 QA는 미실행이다.
- 초안의 로컬 링크 27개, 79개 원본, 114개 Task, 156개 선행과 기존 QA 및 비대상 WBS 행 보존, `git diff --check`를 확인했다.

### 문서 갱신

가이드·데이터 접근·계획·QA를 확인했고, 종료 시 과거 후보 표기와 해당 실행의 검증 기록을 구분하고 다음 인계를 연결하도록 확인했다.

### 검토 대상과 최신성

1차 리뷰는 변경 9파일, diff SHA-256 `9677f302d5dca3d12f2356dec4b12601cb0fb3d0e34b69c460d7f62e021b4ea0`에 적용된다. 종료 체크리스트·인계 및 이 보고서는 양쪽 최종 재검토 대상으로 삼는다. 최종 head의 검토·CI 및 병합은 [전달 기록](../tasks/DEV-41.md#dev-41-delivery)에 연결된 PR에서 확인한다.

### 개발자 확인

DEV-41의 검증·전달 범위에 추가 결정은 없다.

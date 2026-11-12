# Context Audit Report

## 결론

2026-11-12 · DEV-62 관련 범위: 착수 시 DESIGN AlarmList의 Major 사실 불일치를 확인했고, 예정된 문구/문서 교정 후 재대조했다. 독립 verifier가 추가로 찾은 기존 WBS 요약 집계 Minor도 실제 행으로 보정해 관련 범위 PASS다. 제품 전체 감사나 실제 API 통합 판정이 아니다.

## 확인한 코드베이스 사실

- 시작 main/원격 `9098f46`, clean. QA-17 선행과 DEV-60이 main에 있으며 DEV-62만 진행한다.
- package/lock: Next16.2.9·React19.2.4·Vitest4.1.11·pnpm11.3.0·lock9.0. `.nvmrc`22.20.0을 검증에 사용한다. 로그인 shell의26.5.0을 프로젝트 검증 버전으로 쓰지 않는다.
- 실제 scripts는 dev/build/start/lint/test/test:watch/storybook/build-storybook이며 type-check/format은 없다.
- 데이터7그룹/공개 client·server·DTO/HTTP/mock 경계, immutable config snapshot·hybrid/production guard와 sessionStorage namespace가 존재한다. 이번에는 데이터 흐름을 수정하지 않는다.
- activation controller는 읽음 성공 후 allowlist 이동·null/위험 fallback, 이미 읽음 PATCH 생략, 계정/중복/해제 수명 방어를 구현한다. 실제 ANAV10차단은 별개다.

## 문서별 정합성 점검

### base.md

package.json·lockfile·.nvmrc·실제 scripts와 일치. 호스트 기본 Node와 프로젝트 pin은 구분한다. 갱신 불필요.

### architecture.md

app/components/data/features/lib/types 및 notification controller·public entry 구조와 일치. 새 폴더/API/component 규칙을 추가하지 않아 갱신 불필요. DESIGN의 현재 동작 드리프트는 아래 별도 교정 대상이었다.

### data-access.md

auth/bids/company/notifications/bidAlerts/personalFilters/notificationSettings7그룹과 현재 config/Repository 경계, fallback 없음·mock storage/운영 guard, 공고 내부알림/이메일 독립 및 POL-04 설명이 관련 source와 일치. API 계약/구현 변경 없음. 실제 QA 차단은 유지한다.

### plan.md

WBS만 현재/다음/상태를 소유하고 날짜별 이력은 당시 관찰로 보존하는 규칙을 확인했다. DEV-62 문구/문서 교정의 날짜별 진입점만 추가하며 live 상태를 복제하지 않는다. 기존79원본/114Task/155의존성·coverage와 차단 이력을 보존한다.

### harness.md

세 skill과 `.codex/agents/verifier.toml`이 존재하고 `.codex/config.toml`은 placeholder다. workflow/task-cycle의 verifier/ai-review·freshness·Git 전달 권한 분리가 현행 하네스와 일치. 설정/실행 규칙 변경 없음.

### ai-failures.md

원격 작성자/서명 메타데이터와 서버 인증 query의 원문 출력 재발 방지 규칙을 적용한다. GitHub는 필요한 정책/코드·SHA만, 서버는 격리 합성 경로·상태만 기록한다. 실행 래퍼의 zsh 예약변수 오류는 저장소 밖에서 수정하고 명령 exit 재확인 대상으로 남긴다. 반복 제품/하네스 오류를 새로 추정하지 않는다.

## 발견된 불일치

- 심각도: Major.
- 관련 문서: [DESIGN AlarmList](../../../../DESIGN.md#alarmlist).
- 실제 코드베이스 상태: [activation controller](../../../../src/features/notifications/activation-controller.ts)는 읽음 성공 후 허용 경로로 이동하며 위험/null은 목록 유지·안내다.
- 문서의 착수 전 설명: 항상 목록 유지·actionPath 미연결이라고 현재 규칙에 적혀 있었다.
- 추천 조치: DEV-62의 명시된 완료 기준 안에서 Interaction/Feedback/Evidence를 현행 source·POL-04와 동기화하고 실제 QA 차단을 명시한다. 편집 전 Brief에 제시했고 교정 후 일치 확인.
- 자동 수정 가능 여부: Yes. 이번 DEV-62 문서 교정 승인 범위이며 정책 신규 선택이 아니다.

- 심각도: Minor.
- 관련 문서: [WBS 요약 집계](../README.md).
- 실제 코드베이스 상태: 114개 실제 행의 완료/대기 수가 요약과1씩 달랐다. base부터 존재한 drift이며 독립 verifier가 발견했다.
- 문서의 최초 설명: 완료16·대기74. 착수 전 실제 행은 완료17·대기73이었다.
- 추천 조치: 이번 종료/다음 선정 뒤 실제 행으로 재집계하고 요약↔행 일치 검사를 보강한다. 보정·재검증으로 해소했다.
- 자동 수정 가능 여부: Yes. 정책/우선순위 변경 없는 사실 동기화다.

## 개발자 확인 필요 사항

없음. POL-19/20의 미결 정책·DEV-04/43/66 구현과 실제 QA 자원/실행 대응은 해당 Task에 남긴다. 이번 OpenAPI403은 API 부재나 정책 확정의 근거가 아니다.

## 추천 수정 방향

현행 채널/목적지와 미지원 기능을 설명하는 최소 문구 교정, DESIGN 동기화, 로컬 합성 검증/기존 실제 QA 이력 보존으로 한정한다. [DEV-62 Brief](../tasks/DEV-62.md#dev-62-brief)를 따른다.

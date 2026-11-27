# DEV-07 검증과 리뷰

<a id="dev-07-review"></a>

## ai-review

### 1. 리뷰 요약

[사용자 로컬 승인](../tasks/DEV-07.md#dev-07-20261127-local-resume), [POL-05](../tasks/POL-05.md#pol-05-contract), [실행 QA](../../../qa/alarms.md#dev-07-local-qa), Git diff와 실제 package scripts를 대조했다. 브라우저 세션 한 곳에서 고정 알림 신호를 받고 기존 공개 notifications REST를 사용한다. 알림 버튼과 목록은 공통 조회 결과를 사용한다. API·mock 그룹 경계와 실제 통합의 남은 조건을 확인했다.

### 2. 발견된 문제

첫 독립 검토에서 Major 두 건을 발견했다. 가시성이 유지된 창의 포커스만 돌아오면 최근 조회로 인해 후속 재조회가 누락될 수 있었다. blur 이후의 포커스 복귀를 예약하고 가시성·온라인 복귀가 먼저 예약한 경우 합치는 방식으로 수정했다. 유한하지 않은 만료 시각의 0ms 타이머와 갱신 후 또 만료된 자격 증명의 반복을 차단했다. 잘못된 Bearer 값은 소켓을 열기 전에 거절한다. 두 수정은 가상 시간과 Chrome의 포커스 단독 복귀에서 재검증했다. 미해결 Blocker·Major·Minor는 없다.

### 3. 누락된 검증

개발 서버 실행 SHA, 허용 Origin, 구독 등록 시점과 인증 거절 wire 분류, 승인된 합성 계정·신호·읽음 및 복구 증거가 필요하다. 실제 NSIG 12건은 공동 QA에 남는다. 전체 사용자 화면의 Figma 픽셀 전수 비교는 작업 범위에 없다.

### 4. 문서 갱신 필요 여부

공개 client와 기능 계층의 변경을 `data-access.md`와 `architecture.md`에, 로컬 증거와 미실행을 `plan.md`, 받은 알림 QA, WBS와 Task에 반영했다. 기존 N04 연결과 ALARM·ANAV·NDEL·QA-11 이력을 보존했다. 스크립트·패키지·하네스 변경은 없었다.

### 5. 개발자 확인 필요

현재 로컬 범위에 추가 사용자 결정은 없다. 실제 통합은 공동 QA에서 실행 환경과 서버 계약, 합성 계정·데이터의 사용 및 복구 범위를 확인한다.

### 6. 추천 수정 방향

공동 QA에서는 최초 REST와 구독 등록 사이에서 발생한 변경까지 확인할 수 있는 서버측 근거와 클라이언트가 판별 가능한 인증 오류를 먼저 점검한다.

## Context Audit Report

### 결론

PASS · DEV-07 WBS 진입 링크의 교차 참조를 고쳤다.

### 확인한 코드베이스 사실

Node 22.20.0과 pnpm 11.3.0의 현행 8개 scripts를 확인했다. 순수 Node 계약 테스트와 실제 Next/Chrome 대역을 구분하고, 루트 레이아웃에는 전역 세션 아래 알림 동기화 Provider를 추가했다.

### 문서별 정합성 점검

| 문서 | 대조 결과 |
| --- | --- |
| `base.md` | package·lockfile·Node pin, 스크립트, CI의 api/mock/hybrid 구성과 일치 |
| `architecture.md` | 전역 Provider, 알림 기능과 WS 전송의 폴더 소유 및 기존 TSX 토큰 적용 기록 |
| `data-access.md` | 기존 7개 그룹·불변 빌드 snapshot·운영 mock guard·공개 client와 HTTP DTO 경계 확인 |
| `plan.md` | 79개 원본 ID·N04 매핑과 선행 POL-05, 실제 QA와 분리된 로컬 증거 연결 |
| `harness.md` | 기존 3개 Skill과 verifier, config 및 실행 절차 대조 |
| `ai-failures.md` | 비식별 검증 결과와 기존 실패 방지 지침을 적용함 |

### 발견된 불일치

Minor 한 건은 WBS가 DEV-07의 첫 동작을 직전 작업 앵커로 가리킨 점이다. 현재 항목의 Brief와 종료 인계 링크를 적용했다. 영향 있는 문서의 사실 불일치는 남지 않았다.

### 개발자 확인 필요 사항

없음. 실제 실행 대응과 계약 확인은 QA의 재개 조건을 따른다.

### 추천 수정 방향

DEV-07의 종료 증거를 현재 WBS와 Task 링크에서 확인한다.

## 독립 verifier

2026-11-27 KST 첫 검토는 Major 2건으로 FAIL이었다. 런타임 교정 후 두 번째 검토는 PASS였다. Blocker·Major·Minor 0건, 최신 테스트 49파일·1,382건, lint와 세 공급원 빌드·Storybook, Chrome 검증 42개 및 실제 NSIG 12차단의 근거를 독립 확인했다. 종료 문서의 최종 검토와 원격 head 결과는 [PR과 전달 기록](../tasks/DEV-07.md#dev-07-delivery)에서 확인한다.

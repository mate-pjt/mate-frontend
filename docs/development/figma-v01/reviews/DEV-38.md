# DEV-38 · 계정 정보 조회 검증과 리뷰

[요구사항과 승인](../tasks/DEV-38.md#dev-38-brief) · [실행 QA](../../../qa/my-settings-home.md#dev-38-account-qa) · [원본 연결](../coverage.md)

## Context Audit Report

### 결론

WARN. DEV-38 관련 코드와 공통 문서에 구현을 막는 불일치가 없다. 현재 S02의 숨김 상태와 실제 실행 digest 미확인을 아래에 기록한다.

### 확인한 코드베이스 사실

`/my`의 설정 카드, 인접 알림 상세, 전역 `AuthSessionProvider`와 계정 스코프를 비교했다. S02에 전용 서버/API가 필요하지 않으며, 공개 auth 세션과 기존 UI 토큰으로 렌더링할 수 있다.

### 문서별 정합성 점검

| 문서 | 근거 |
| --- | --- |
| base.md | `.nvmrc`의 Node 22.20.0, `package.json`의 pnpm 11.3.0·Next 16.2.9·실제 scripts와 lockfile을 확인했다. |
| architecture.md | App Router, 기존 설정 상세 구성, 헤더와 디자인 토큰을 재사용했다. 새 route와 소유 문맥을 연결했다. |
| data-access.md | 일곱 Repository 그룹, 공개 진입점과 빌드 snapshot·운영 guard를 확인했다. 이 화면의 기존 세션 읽기와 logout 경계 변경을 설명했다. |
| plan.md | 이전 준비 항목의 계정 읽기 근거를 POL-17 D1과 연결했다. 우선순위·상태는 WBS에 있다. |
| harness.md | 디스크의 세 skill과 `verifier.toml`, 현재 검증 스크립트를 확인했다. |
| ai-failures.md | Figma 임시 자산 링크가 도구 텍스트에 포함된 사실과 선별 기준을 추가했다. |

### 발견된 불일치

S02의 현재 이메일 버튼 레이어는 불투명도 0으로 관찰됐다. 제품에서 생략하는 근거는 기존 사용자 D1이다. 표시된 탈퇴 행의 적용은 POL-18·S03 소유다.

### 개발자 확인 필요 사항

현재 실행 digest만 미확인으로 기록하고 실제 브라우저 동작과 Git 전달을 수행하라는 사용자 결정이 있다. [DEV-38 결정](../tasks/DEV-38.md#dev-38-brief)

### 추천 수정 방향

계정 변경 또는 탈퇴를 연결할 때 해당 작업의 정책과 API 계약·검증을 적용한다.

## ai-review

### 1. 리뷰 요약

POL-17 D1과 `git status`·`git diff`, 페이지·세션 코드, auth 계약, 테스트와 Chrome 실제 QA를 대조했다. 인증된 현재 계정의 주소만 메모리 세션에서 읽으며 비로그인·만료·로그아웃 중에는 나타나지 않는다. 인접 화면·공용 컴포넌트 스타일과 일곱 공급원 경계를 보존한다.

### 2. 발견된 문제

Blocker/Major 0건. 인증 세션 교체·로그아웃/실패 시 재구독, 401/403, 이메일 타입·형식 검사를 확인했다. 실제 로그아웃 응답은 미확인으로 기록했다. 초기 QA 도구의 보안 차단과 Figma 출력 주의사항은 실행 기록에 있다.

### 3. 누락된 검증

`pnpm test` 1,214건·`pnpm lint`·api/mock/hybrid `pnpm build`, 로컬 Chromium과 실제 Chrome의 본인 조회를 수행했다. Storybook은 카탈로그·공용 컴포넌트 직접 변경이 없어 로컬 미실행이다. 현재 실행 digest는 미확인이며 Figma 전체 픽셀 비교는 수행 범위 밖이다. [QA](../../../qa/my-settings-home.md#dev-38-account-qa)

### 4. 문서 갱신 필요 여부

DEV-38 Brief/검증·WBS·coverage·실제 API QA 색인, 공통 아키텍처와 데이터 접근·계획에 근거를 연결했다. 원본 기준선·기존 QA·소유 정책은 유지한다.

### 5. 개발자 확인 필요

현재 실행 digest를 유보하는 사용자 승인과 이번 PR의 Chromatic 월간 한도 조건을 적용한다. 별도 제품 정책 결정은 필요하지 않다.

### 6. 추천 수정 방향

본인 확인·프로필 변경 계약을 확보하면 후속 요구사항에서 상태·입력·충돌·복구 기준을 검토한다. 탈퇴 차이는 POL-18에서 판단한다.

## Read-only verifier

- 결과 PASS. POL-17 D1의 본인 읽기와 상태 경계, scope와 테스트·문서·기존 변경 보존을 대조했다. Blocker/Major 0건.
- Minor 1건은 실제 로그아웃 POST가 관찰되지 않으면 401을 성공 응답으로 표현할 수 없다는 지적이다. QA와 작업 기록에 401·창 종료·명시 로그아웃/서버 세션 해제 미확인을 반영했다.
- Vitest 41파일 1,214건, lint, API/mock/hybrid build, diff-check, 네 격리 앱의 실행·테스트 파일 7개 일치, Playwright·HTTP 대역 ACCT-01~07과 실제 ACCT-08을 확인했다. 변경한 Markdown의 링크·앵커와 원본 79개·WBS 114개 및 QA 이력을 검사했다.
- 이 결과는 당시 본문과 증거에 적용한다. 종료·검토 결과·POL-18 인계 추가 뒤 최종 diff는 같은 기준으로 재검토한다. 최종 재검토와 원격 검사는 [PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afeat%2Fdev-38-account-settings)과 전달 보고에서 확인한다.

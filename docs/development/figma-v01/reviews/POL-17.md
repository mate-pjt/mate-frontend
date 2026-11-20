# POL-17 · 계정 정보와 인증 정책 검증

기준은 [사용자 D1과 착수 범위](../tasks/POL-17.md#pol-17-brief), [계정 정보와 인증 기준](../tasks/POL-17.md#pol-17-contract), [고정 소유 근거](../tasks/POL-17.md#pol-17-evidence), `7c94705`의 frontend 및 QA-14 이력이다.

## Context Audit Report

### 결론

**PASS** · POL-17의 인증/설정·작업 추적에 필요한 저장소 컨텍스트를 읽기 전용으로 점검했다.

### 확인한 코드베이스 사실

- `.nvmrc`의 Node 22.20.0, `package.json`의 pnpm 11.3.0·Next 16.2.9·React 19.2.4·Vitest 4.1.11, pnpm lockfile 9.0을 확인했다. 이번 문서 검사 환경은 셸 Node 26.5.0·pnpm 11.3.0·Python 3.14.6이다. CI의 앱 런타임은 workflow에서 Node 22.20.0을 별도로 설치한다.
- `/my`의 계정 관리 카드는 준비 중이다. auth Repository에는 Google 로그인·가입·세션 복원·로그아웃이 있고, `PasswordPopup`은 구현·export·Storybook 예시에서만 참조된다.

### 문서별 정합성 점검

| 문서 | 확인 결과 |
| --- | --- |
| `base.md` | 핀 버전·package scripts·lockfile·CI와 일치한다. 이번 셸 버전과 repo의 Node 핀/CI 버전을 구분했다. |
| `architecture.md` | 설정/로그인 route, 공용 UI, 메모리 세션과 인증 Repository 설명이 관련 소스와 일치한다. |
| `data-access.md` | 7개 진입점, 기존 snapshot·운영 mock guard와 account 범위, DTO/알림 이메일 소유가 일치한다. |
| `plan.md` | 현재·다음·상태를 WBS에서 관리한다. 과거 계획과 실제 QA 이력은 당시 관찰이며 S02/C02의 새 정책 참조만 추가했다. |
| `harness.md` | 3개 프로젝트 스킬과 verifier, 자리표시자 `.codex/config.toml`, 문서 검증/리뷰 흐름이 일치한다. |
| `ai-failures.md` | 인증 원문이나 이전 임시 경로를 작업 증거로 남기지 않는다. 이 범위에 새 반복 실패 기록 사유는 없다. |

### 발견된 불일치

점검한 공통 컨텍스트의 Major/Minor 불일치는 없다. 게시 OpenAPI의 refresh 성공 응답 항목 누락과 Figma 버튼의 정책 차이는 외부 명세·화면 관찰로 남겼다. [현행 근거와 Figma 대조](../tasks/POL-17.md#pol-17-evidence)

### 개발자 확인 필요 사항

이 문서의 화면 범위는 사용자 D1으로 결정됐다. 후속 변경용 본인 확인과 계정 편집은 해당 계약과 제품 결정이 필요하다.

### 추천 수정 방향

관련 공통 계획에 정책 링크를 유지하고 구현·실제 통합 증거는 각 후속 Task와 QA에서 남긴다.

## 문서 검증

`python3 validate-docs.py 검증`과 `리뷰`, `git diff --check`가 통과했다. 리뷰 단계에서 Markdown 7개와 로컬 링크·앵커 1,038개, 원본 79개, Task 114개, 의존성 156개, 기준선 4개와 기존 QA를 확인했다. 앱 test/lint/build/Storybook의 로컬 실행과 브라우저·대역·실제 업무 API는 미실행이다. GitHub 최종 head의 실행 기록은 PR의 검사 탭에서 확인한다. [Git 전달](../tasks/POL-17.md#pol-17-delivery)

## Read-only verifier

### Result

**PASS** · `7c94705` 기준 리뷰 단계의 독립 판정.

### Summary

사용자 D1·중앙 정책의 적용, 비밀번호 팝업 미연결, 계정 변경·재인증의 재개 조건과 DEV-38 인계가 원래 완료 기준에 부합한다.

### Issues

- Blocker·Major 0건.
- Minor 1. 인계에서 기존 로그인·세션 복원과 미지원 계정 변경·별도 인증 요청을 구분했다.
- Minor 2. ACCT-02에서 refresh 401/403의 네트워크 관찰과 공통 익명 처리·이메일 숨김을 구분했다.

### Verification

독립 verifier가 문서 검사와 diff-check를 실행하고, frontend와 중앙 정책·고정 backend source·OpenAPI 스냅샷·test 배포 상태를 대조했다. 새 실제 API 통합 결과는 없다.

### Documentation Update Check

정책·인계·커버리지·계획·QA의 필요 갱신을 확인했다. 기존 MSET-02 재확인 대기와 ACCT-01~08 미실행을 보존한다.

### Review freshness

이 판정은 최초 리뷰 diff에 적용한다. 두 Minor와 WBS 종료 상태, 증거 기록을 반영한 최종 diff는 `python3 validate-docs.py final`과 두 리뷰 재확인의 대상이다. [전달 및 최종 검토 확인](../tasks/POL-17.md#pol-17-delivery)

### Developer follow-up

정책 확정에 추가 결정은 없다. DEV-38은 승인된 테스트 계정·행위 범위와 실제 실행 버전을 확인한다.

## ai-review

### 1. 리뷰 요약

**PASS** · D1 및 근거에 따라 현행 로그인 세션의 본인 연락용 이메일 조회, S02 이메일 버튼 예외와 Google-only/비밀번호 미지원 경계를 기록했다. 변경 범위는 POL-17 관련 Markdown 7개다.

### 2. 발견된 문제

미해결 Blocker·Major는 없다. 초기 인계·QA의 인증 요청 범위와 401/403 표현을 교정했다. 실행 소스·인증 또는 데이터 접근 규칙의 변경은 없으며 인증값·개인정보 예시를 추가하지 않았다.

### 3. 누락된 검증

Figma 지정 노드의 표시·구조·상태를 확인했다. 브라우저 화면과 시안의 시각 일치, 새 mock/HTTP 대역, 실행 중인 test 프로세스 SHA와 실제 개발 API는 확인하지 않았다. 앱 실행 영향이 없어 로컬 test/lint/build/Storybook은 미실행이다.

### 4. 문서 갱신 필요 여부

작업 기록·DEV-38 인계·WBS·연결표·계획·설정 QA·검토 기록을 갱신했다. 원본 기준선과 기존 QA·다른 Task의 소유 범위 및 승인 예외에는 갱신 사유가 없다.

### 5. 개발자 확인 필요

POL-17에서 추가 확인이 필요한 정책 선택은 없다. 별도 재인증과 계정 수정, 탈퇴 UI의 결정은 각 소유 Gate에 남아 있다.

### 6. 추천 수정 방향

초기 리뷰의 문구 교정을 적용했다. 최종 diff를 재검증·재검토한 뒤, DEV-38에서 기존 세션을 사용하는 읽기 범위와 실제 QA 준비를 확인한다.

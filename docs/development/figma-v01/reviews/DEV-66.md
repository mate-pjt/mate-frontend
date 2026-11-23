# DEV-66 검증과 Review Gate

[요구사항과 두 정책](../tasks/DEV-66.md#dev-66-brief) · [검증 기록](../tasks/DEV-66.md#dev-66-verification) · [실제 Next 브라우저 사례](../../../qa/notification-settings.md#dev-66-local-qa)

## 대상과 검증 근거

- 시작 `98e3941a8f53741c5e50683db939cc3662c586a2`. 최종 런타임·테스트 diff SHA-256 `18226d7db30a29df261596c3944ef613b8daa65f093651da527a44a9317db208`. 격리 자동 검사와 mock/HTTP 브라우저의 변경 소스 8개 및 최종 캡처 2장을 작업트리와 대조했다.
- 종료·인계까지 포함한 문서 검사는 상대 링크 878개, 원본 79개, WBS 114개 Task·156개 선행 관계와 기존 QA·상태 보존, 단일 다음 작업의 적격성을 확인했다. `git diff --check`를 통과했다.
- 인증창 초기 초점과 화살표 마스크 교정 뒤 `pnpm test` 1,250건, `pnpm lint`, Preview api/mock/hybrid `pnpm build`, `pnpm build-storybook`, D66-01~07을 다시 확인했다. 보완 QA에서 공고별 등록 유지와 마스크 6개의 고유 ID·자기 인스턴스 참조를 확인했다. Storybook에서 Vite 번들 크기 안내가 있었다.

## 독립 verifier

| 항목 | 1차 검토 |
| --- | --- |
| Result | PASS. 당시 런타임·테스트 지문 `6123d9ca9f7fc82723a34fa452113238f5501d28fcc5d4bd462bbe1e60befb16`과 리뷰 단계 문서에 적용한다. |
| Summary | POL-29/POL-19의 세 항목, 이메일 연결, 비활성 이유 및 무요청·무저장을 확인했다. |
| Issues | Blocker·Major 없음. Minor 1건은 세 화살표의 고정 SVG ID 중복이다. 인스턴스마다 React `useId()`를 사용하도록 수정했다. |
| Verification | 자동 검사, 세 실행 소스의 SHA-256, 1920/320/390px·키보드·터치·AX·인증과 mock/HTTP 증거를 대조했다. 실제 계정 및 별도 보조기술 음성은 미실행이다. |
| Documentation Update Check | 새 내부 링크 22개와 기준선/연결표/별도 수신처 QA 보존을 확인했다. |
| Review freshness | 고유 ID 교정과 이 문서·종료/인계 변경에 대해 전달 전 verifier 및 ai-review를 다시 수행한다. 최종 재검토와 원격 검사는 PR 본문·검사 결과에서 확인한다. |
| Developer follow-up | 추가 결정 없음. 두 기능의 활성화는 기존 별도 Gate를 따른다. |

## AI Review

### 1. 리뷰 요약

세 설정 항목과 수신처 구성에 POL-29 D3를 적용하고, POL-19에 따라 기존 맞춤 이메일만 조회·저장한다. 비활성 이유는 공개 client의 타입/값으로 공급한다. 화면이 두 설정의 실제/합성 ON/OFF를 참조하거나 저장할 경로가 추가되지 않았다. 공용 Toggle의 기존 켜짐·꺼짐·일시 비활성 동작, 동일 계정의 공급원과 인증 수명 흐름을 대조했다.

### 2. 발견된 문제

DEV-66 diff의 미해결 Blocker·Major·Minor 없음. 기준 `main`의 초기 팝업 입력 초점과 1차 리뷰의 SVG 마스크 ID 중복을 교정했다. 입력·번호 단계와 Escape 복귀, 화살표 마스크 고유성을 재확인했다. 기존 아키텍처 문구의 드리프트는 아래에 기록한다.

### 3. 누락된 검증

실서버 설정·인증과 별도 보조기술 음성 검증은 이 실행에서 미실행이다. Next mock·HTTP 대역, Chromium AX 검사와 기존 QA-12 및 QA-13 차단이 각기 기록돼 있다. Figma 비교는 대표 데스크톱 프레임의 카드와 인증 단계에 적용했다.

### 4. 문서 갱신 필요 여부

DESIGN·데이터 접근·아키텍처에 비활성 화면과 capability의 경계를 기록했다. 계획, Task, QA, WBS, 실패 이력을 연결한다. 기존 실제 QA·정책·기준선·79개 매핑과 패키지/실행 설정은 유지한다.

### 5. 개발자 확인 필요

로컬 개발과 Git 전달에 추가 결정 없음. [활성화 선행](../tasks/DEV-66.md#dev-66-pol-19-boundary)의 계약·효력·실행 대응 및 승인된 QA 자원은 후속 결정이다.

### 6. 추천 수정 방향

현재 범위를 전달한다. 실제 설정·인증의 재검증은 기존 QA-12/13의 안전한 오류·테스트 계정·수신처·복구 조건을 갖춰 진행한다.

## Context Audit Report

### 결론

WARN. DEV-66 관련 DESIGN의 과거 전역·야간 토글 설명과 QA의 날짜 범위를 현행 화면 및 역사적 관찰에 맞췄다. 별도 기능인 받은 알림 삭제 설명 1곳의 기존 드리프트가 남아 있다.

### 확인한 코드베이스 사실

`package.json`의 실제 8개 스크립트, Node 22.20.0, pnpm 11.3.0, lockfile v9, 공개 client/HTTP/mock 경계와 `.codex/agents/verifier.toml`을 확인했다. 프런트에서 사용하는 두 이메일 설정 경로와 게시된 개발 명세의 상세·야간 경로를 대조했다.

### 문서별 정합성 점검

| 문서 | 관찰 |
| --- | --- |
| `base.md` | package·lockfile·실행 스크립트와 일치한다. |
| `architecture.md` | 수신처·이메일과 상세·야간의 공개 경계를 동기화했다. 별도 받은 알림 문구는 아래에 기록했다. |
| `data-access.md` | 7개 `dataGroups`, hybrid·production guard, HTTP DTO·탭 저장 경계가 기존 소유 source와 일치한다. 새 capability는 프로필/계정과 무관하다. |
| `plan.md` | 상태 소유는 WBS다. 79개 원본, 114개 작업·156개 선행 관계와 기존 차단을 보존한다. |
| `harness.md` | feature-workflow, context-audit, ai-review, verifier 파일과 현재 사용 순서가 일치한다. |
| `ai-failures.md` | 최초 브라우저의 입력 초점 재현과 이전에도 기록된 Figma 출력 경계 사례를 추가했다. |

### 발견된 불일치

- **Minor · 기존 드리프트.** `architecture.md`에 받은 알림 편집·삭제가 준비 중이라는 설명이 있다. 실제 구현과 `data-access.md`의 DEV-43 기록에는 수동 삭제가 연결돼 있다. 이번 검토의 재현과 확인은 알림 설정 화면에 적용된다. 해당 문장이 속한 받은 알림 문서의 별도 동기화가 가능하다.

### 개발자 확인 필요 사항

이번 범위에 추가 확인 없음. 기존 QA-12/13의 지원·접근·복구 조건과 상세·야간 활성화 선행을 각 기록에서 확인한다.

### 추천 수정 방향

DEV-66 화면과 공급원 문서는 현행 동작을 따른다. 받은 알림 편집·삭제 상태를 확인할 때는 현행 DEV-43 기록과 소유 구현을 확인한다.

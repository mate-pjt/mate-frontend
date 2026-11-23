# POL-24 · 문서 검증과 Review Gate

[착수 범위](../tasks/POL-24.md#pol-24-brief) · [MVP 결정](../tasks/POL-24.md#pol-24-contract) · [WBS](../README.md)

<a id="pol-24-doc-verification"></a>

## 문서 검증 · 2026-11-23 KST

- `git diff --check 6f258f0`과 Python 3.14.6 임시 문서 검사에서 최초 검증 diff의 Markdown 6개와 신규 로컬 링크·앵커 34개를 확인했다. 79개 원본/114개 Task/156개 선행 연결, WBS 상태·집계, 기준선·연결표·QA 이력 보존을 확인했다. 패키지·앱 코드·CI 파일에 변경이 없다. [작업 검증](../tasks/POL-24.md#pol-24-verification)
- 종료와 인계를 포함한 문서 diff의 Markdown 7개, 신규 로컬 링크·앵커 70개, 승인된 상태 변경과 P3의 다음 후보 순서를 재검증했다.
- 원격 출처는 중앙 ADR과 runtime, Figma 한 프레임, 백엔드 Git·개발 CI/배포 기록 및 게시 OpenAPI를 확인했다. 링크 검사는 새 문서의 로컬 경로·앵커를 검사한다. 외부 PR 전달 링크의 실제 head·CI·병합은 전달 단계에서 확인한다. [소유 근거](../tasks/POL-24.md#pol-24-evidence)
- 문서 전용 변경이므로 로컬 `pnpm test`/`lint`/`build`/`build-storybook`는 미실행이다. 앱 브라우저·mock/HTTP 대역·실제 OAuth와 업무 API도 미실행이다. [기존 인증 QA와 O02 범위](../../../qa/auth.md#pol-24-o02-qa)

## Context Audit Report

### 결론

**WARN**. 프론트 인증 코드와 프로젝트 문서의 범위가 일치한다. 게시 Swagger에서 시작 요청의 `returnOrigin`이 일반 `query`로 표시되는 표기 차이를 확인했다.

### 확인한 코드베이스 사실

- Next 16.2.9, React 19.2.4, Vitest 4.1.11, pnpm 11.3.0과 8개 스크립트를 `package.json`에서 확인했다. pnpm lockfile은 9.0이며, `.nvmrc` Node 22.20.0과 같은 버전을 검증용 PATH에서 확인했다. 기본 셸 Node는 26.5.0이다.
- `/auth`의 비활성 버튼과 `features/auth/session.tsx` → 공개 `data/auth/client.ts` → API/mock Repository 흐름을 확인했다. [소유 근거](../tasks/POL-24.md#pol-24-evidence)

### 문서별 정합성 점검

| 문서 | 확인 |
| --- | --- |
| [base.md](../../../ai-context/base.md) | 패키지·lockfile·Node pin·실제 스크립트와 일치한다. 독립 `type-check`·`format` 스크립트가 없다. |
| [architecture.md](../../../ai-context/architecture.md#auth-and-home-route-contract) | Google 시작과 내부 복귀, 로그인 시도별 `flowId`·세션 설명이 관련 소스에 대응한다. |
| [data-access.md](../../../ai-context/data-access.md) | `config.ts`의 일곱 공급원, 문서상 공개 포트, 기존 auth Repository·mock 계정 격리와 인증 경계에 변경이 없다. 계약은 백엔드 소스·중앙 runtime과 게시 스키마를 대조했다. |
| [plan.md](../../../ai-context/plan.md) | WBS가 상태를 소유한다. O02 원본과 POL-24/DEV-48 매핑을 유지하고 이번 정책을 날짜별 이력에 연결했다. |
| [harness.md](../../../ai-context/harness.md) | 참조된 Skill·verifier가 있으며 `.codex/config.toml`은 placeholder다. |
| [ai-failures.md](../../../ai-context/ai-failures.md) | OAuth 배포 브랜치·외부 응답 선별 관련 과거 예방 규칙을 적용했다. 새 실패 기록이 필요한 사례는 확인되지 않았다. |

### 발견된 불일치

| 심각도 | 관련 문서와 실제 상태 | 추천 조치 | 자동 수정 |
| --- | --- | --- | --- |
| Minor | 개발 OpenAPI는 Google 시작의 필수 `returnOrigin`을 `query`로 묶어 표기한다. 개발 소스와 현행 중앙 runtime은 비어 있지 않은 `returnOrigin` 하나의 입력, 정확한 Origin 검사를 명시한다. | 이번 기록에는 근거 차이를 남긴다. 명세 표기의 개선은 백엔드 계약 소유 범위다. | 백엔드 소유 확인 필요 |

### 개발자 확인 필요 사항

현재 MVP 결정을 적용할 추가 승인 사항은 없다. 네이버를 지원하는 새 결정에서는 [재개에 필요한 정책·계약·QA 자원](../tasks/POL-24.md#pol-24-dev-48-boundary)을 확인한다.

### 추천 수정 방향

O02 버튼에 관한 중앙 결정과 후속 선행을 POL-24 및 DEV-48의 날짜별 기록에 연결하고 WBS에 상태를 반영한다. 공통 구조와 하네스 변경 근거는 없다.

## 독립 read-only verifier

**Result · PASS**. `6f258f0` 대비 리뷰 단계의 Markdown 6개를 독립 검토했다.

- **Summary** — ADR-0009/0015의 Google 단독과 `GOOGLE + sub`, 최초 승인 원문의 비활성 ‘준비 중’, O02 시안과 현행 버튼을 대조했다. DEV-48에서 신규 승인·계정 계약·실행 버전·합성 QA 범위를 확인할 조건을 검토했다.
- **Issues** — Blocker·Major 없음. Minor는 게시 OpenAPI의 `returnOrigin` 표기 차이다. 관련 계약은 소유 소스와 중앙 runtime에서 확인했다.
- **Verification** — `git diff --check 6f258f0`과 Python 문서 검사의 리뷰 모드 통과. 신규 로컬 링크·앵커 41개, 원본 79개, Task 114개, 선행 156개를 검증했다. ADR·backend provider·controller·DB 제약, CI/배포 기록, OpenAPI 200·지문을 확인했다. 앱·실제 인증·mock/HTTP 대역은 미실행이다.
- **Documentation Update Check** — 정책·후속·인증 QA·계획 기록을 검토했다. 스냅샷·연결표·기존 QA 보존을 확인했다. 후보 시점의 검증 이력을 날짜로 구분하고 이번 판단을 완료 기준에 연결하는 점을 확인했다.
- **Review freshness** — 이 판정은 WBS `리뷰` 단계의 diff에 적용된다. 종료/WBS·다음 인계를 포함한 최종 diff의 재검토 결과는 [PR 검증 기록](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fpol-24-naver-login-policy)에서 확인한다.
- **Developer follow-up** — 현재 MVP 범위 적용을 위한 추가 정책 결정은 없다. DEV-48은 신규 승인과 [재개 조건](../tasks/DEV-48.md#dev-48-pol-24-handoff)이 필요하다.

## ai-review

### 1. 리뷰 요약

**PASS**. 승인된 Google 단독 정책, 기존 O02 비활성 상태와 DEV-48 재개 조건이 문서에 연결돼 있다. 문서 전용 diff와 원래 승인 범위를 확인했다.

### 2. 발견된 문제

Blocker·Major 없음. **Minor**. 게시 OpenAPI의 필수 `returnOrigin` 표현은 소유 소스와 다르다. 기존 계약을 확인하고 명세의 표현 차이를 작업 기록에 남겼다.

### 3. 누락된 검증

이번 문서 검증에 필요한 누락은 없다. 실제 OAuth·업무 API, 앱 브라우저·mock/HTTP 대역과 실행 서버 SHA 대응은 미확인이다. 앱 검사는 로컬 문서 범위에 필요하지 않다.

### 4. 문서 갱신 필요 여부

WBS·정책·후속·QA·plan과 이 검토 기록을 갱신한다. 고정 기준선/coverage는 원본 매핑이 같아 갱신이 필요 없다. 공통 API·mock·구조와 하네스에서 수정이 필요한 변화는 확인되지 않았다.

### 5. 개발자 확인 필요

현재 MVP 결정과 이번 Git 전달에 추가 확인은 없다. 네이버 정책 변경과 실제 QA는 DEV-48의 재개 조건을 따른다.

### 6. 추천 수정 방향

후보 기록과 이번 완료 근거를 구분한다. 최종 종료·인계 diff의 링크, 작업 상태, 문서 범위와 기존 이력을 다시 검증·검토한다.

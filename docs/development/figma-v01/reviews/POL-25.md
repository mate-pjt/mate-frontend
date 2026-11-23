# POL-25 · 문서 검증과 Review Gate

[S07 결정](../tasks/POL-25.md#pol-25-contract) · [현재 소유 근거](../tasks/POL-25.md#pol-25-evidence) · [WBS](../README.md)

## 문서 검증 · 2026-11-24 KST

- `git diff --check fc789de`와 Python 3.14.6 검사를 수행했다. 초기 6개 Markdown, 신규 로컬 링크·앵커 38건, 기준선 79개, Task 114개, 의존성 156개와 상태 집계를 확인했다. 기준선·연결표는 동일하고, 기존 설정 QA, 후속 Task 기록과 앱 파일을 보존했다. [작업 검증](../tasks/POL-25.md#pol-25-verification)
- Figma S07과 팝업, 소유 소스, GitHub 개발 CI·배포 기록 및 게시 OpenAPI를 조사했다. 초기 중앙 문서 조회 출력에 작업과 무관한 내부 경로 한 줄이 포함됐다. 이후 조회는 필요한 필드를 추렸고, 해당 값은 작업 문서나 PR에 옮기지 않는다.
- 문서 전용 변경이다. 로컬 앱의 test·lint·build·Storybook, 브라우저·mock/HTTP 대역·실제 업무 API, 실행 배포와 버전의 대조는 미실행이다. [S07 후속 계획](../../../qa/my-settings-home.md#pol-25-s07-qa)

## Context Audit Report

### 결론

**PASS**. S07 관련 소스와 공통 컨텍스트의 구조·실행 규칙이 일치한다. 2026-10-27 기준선과 QA 기록은 해당 날짜의 관찰값으로 확인했다.

### 확인한 코드베이스 사실

- `package.json`의 Next 16.2.9, React 19.2.4, pnpm 11.3.0과 8개 스크립트를 확인했다. lockfile은 9.0, `.nvmrc`의 Node 22.20.0은 로컬 설치에서 실행을 확인했다. 기본 셸의 Node는 26.5.0이다.
- `src/app/my/page.tsx`가 `MySettingsHomeClient`를 렌더링한다. 인증된 설정에 비링크 이용안내 카드가 있고 FAQ는 정적 공개 경로다. [현행 출처](../tasks/POL-25.md#pol-25-evidence)

### 문서별 정합성 점검

| 문서 | 확인 |
| --- | --- |
| [base.md](../../../ai-context/base.md) | package·lockfile·Node pin과 실제 스크립트가 일치한다. `type-check`와 `format`의 별도 스크립트는 없다. |
| [architecture.md](../../../ai-context/architecture.md) | 기존 `/my`의 준비 중 메뉴, 공개 FAQ와 설정 UI 소유 경계가 소스와 일치한다. |
| [data-access.md](../../../ai-context/data-access.md) | 구성 코드의 일곱 공급원, 빌드 snapshot, 운영 guard와 정적 FAQ를 확인했다. S07의 표시용 버전 공급 방식은 별도 계약이다. |
| [plan.md](../../../ai-context/plan.md) | WBS가 현재·다음·상태를 소유한다. S07의 기준선과 POL-25/DEV-49 연결이 보존된다. |
| [harness.md](../../../ai-context/harness.md) | feature-workflow, ai-review, context-audit 및 verifier와 placeholder 설정이 존재한다. |
| [ai-failures.md](../../../ai-context/ai-failures.md#pol-30-github-metadata) | 조회한 외부 근거에는 필요한 식별자·상태·날짜만 문서에 기록한다. 기존 조회 출력 경계 규칙을 적용한다. |

### 발견된 불일치

S07 관련 소스와 공통 컨텍스트에서 확인한 불일치는 없다. Figma의 버전 팝업과 현재 웹의 준비 중 카드는 정책·구현 범위 차이로 기록했다.

### 개발자 확인 필요 사항

사용자용 버전과 비교값의 소유 소스 및 게시 책임은 승인으로 특정할 사항이다. [DEV-49의 재개 기준](../tasks/DEV-49.md#dev-49-pol-25-gate)

### 추천 수정 방향

정책 근거와 후속 조건을 선택 Task·WBS·QA에 연결한다. 공통 구조·스크립트·하네스에는 갱신할 내용이 없다.

## 독립 read-only verifier

**Result · PASS**. `fc789de` 대비 WBS 리뷰 단계의 Markdown 6개를 독립 검토했다.

- **Summary**. D1/D2 승인, 현행 `/my`의 인증·비링크 카드, DEV-49의 공식 출처·갱신 책임·조회 실패 기준과 WBS 차단이 일치한다.
- **Issues**. Blocker, Major, Minor 없음.
- **Verification**. `git diff --check fc789de`와 문서 검사 리뷰 모드를 통과했다. 신규 로컬 링크·앵커 43건, 원본 79개, Task 114개, 의존성 156개를 확인했다. 이전 QA·앱 소스 보존 및 S07-01~06 미실행을 독립 확인했다. 로컬 앱과 실제 업무 API 검증은 미실행이다.
- **Documentation Update Check**. 정책과 후속 기준, 설정 QA, 계획 및 WBS를 확인했다. 종료 단계의 완료 체크리스트를 D2 범위와 연결하도록 권고했다.
- **Review freshness**. 이 판정은 WBS 리뷰 단계 diff에 적용된다. 종료·인계를 포함한 전체 diff의 재검토는 [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fpol-25-service-guide-policy)에 기록한다.
- **Developer follow-up**. 현재 승인 범위에 추가 결정은 없다. DEV-49는 공식 배포 버전과 비교값의 출처, 갱신 책임과 조회 실패 기준의 확인이 필요하다.

## ai-review

### 1. 리뷰 요약

**PASS**. 사용자 D1/D2, 개발 선행과 앱에 영향이 없는 문서 변경을 원문과 대조했다. WBS의 단일 상태와 S07의 기존 두 Task 연결을 확인했다.

### 2. 발견된 문제

Blocker, Major, Minor 없음. 표시용 버전 출처와 확인 실패의 구체 처리는 DEV-49에 남아 있다. 신규 diff에서 자격증명과 내부 절대 경로 패턴을 점검했다.

### 3. 누락된 검증

계획된 문서 검증의 누락은 없다. 로컬 앱 test·lint·build·Storybook, 앱 브라우저·mock/HTTP 대역과 실제 업무 API 및 배포 실행 버전 대응은 미실행이다.

### 4. 문서 갱신 필요 여부

POL-25·DEV-49·설정 QA·plan·WBS·리뷰와 다음 인계에 필요한 기록을 반영한다. 고정 기준선·coverage와 공통 구조·패키지·하네스의 근거는 보존했다.

### 5. 개발자 확인 필요

문서 전달 범위의 추가 승인은 없다. 제품의 공식 버전 출처·갱신 책임·조회 실패 기준은 DEV-49에 적용한다.

### 6. 추천 수정 방향

POL-25의 체크리스트와 POL-26 인계를 반영한 전체 diff에서 문서 검증 및 두 리뷰를 다시 수행한다. 실제 원격 검사와 정상 병합은 PR 최종 head의 증거로 확인한다.

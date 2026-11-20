# POL-16 검증과 리뷰 기록

[작업과 사용자 결정](../tasks/POL-16.md#pol-16-brief) · [정책](../tasks/POL-16.md#pol-16-contract) · [QA 계획](../../../qa/company-merge.md#pol-16-merge-qa)

## 문서 검증

- 작업 기준은 `docs/pol-16-company-merge-policy`의 시작 `e1f3fa5c18b8d96f5130c59e221a8e0a0a9b50e1`이다. `git diff --check`와 Python 3 문서 검사를 수행한다. 변경 링크·앵커·표/UTF-8, WBS 단일 활성과 집계, 114개 작업·156개 의존, 원본 79개 및 기준선·coverage blob, 허용 Markdown 경로, MERGE-01~16 미실행을 검사한다.
- 백엔드 Controller의 GET 2개와 POST 11개를 개발 OpenAPI의 정확한 경로/메서드에 대조해 13/13 일치를 확인했다. 공개 schema의 projection SHA-256은 `1d031bee318eba9e61e2510c284451abf582e7ec3455bb8a8d4a0f5385137c3b`다. 설정 요약, 제안 거절 사유와 인증 회사 거절 조회 공백, source의 204·409와 게시 응답 목록의 차이를 확인했다. 실제 실행 process SHA·업무 응답은 미확인이다.
- Figma 기준선 9개 frame과 인접 상태의 제목·선별 문구를 읽었다. 화면별 연결은 정책의 표에 있다. 시각 전체와 반응형·접근성의 실제 검증은 후속 작업의 범위다. 당시 Web Reference의 QA는 이 저장소의 검증 결과로 집계하지 않는다.
- 현행 `package.json`에 `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm build-storybook`가 있다. 로컬 기본 shell Node v26.5.0, 프로젝트 고정 Node v22.20.0 설치와 pnpm v11.3.0을 확인했다. Markdown만 바뀌어 로컬 앱 test/lint/build·Storybook 및 브라우저/mock/HTTP 대역·실제 업무 통합은 미실행이다. 원격 CI는 최종 PR head에서 확인한다.

## Context Audit Report

### 결론

PASS · POL-16 관련 현재 소스·문서의 범위

### 확인한 코드베이스 사실

`src/components/my/my-side-menu.tsx`의 회사 통합 진입은 비활성이다. 회사 등록에 인증 충돌 분기는 있으며 통합 전용 제품 경로와 Repository 포트는 준비돼 있지 않다. `package.json`의 스크립트·의존, lockfile v9, .nvmrc와 Codex 진입점은 현행 파일에서 확인했다.

### 문서별 정합성 점검

| 문서 | 확인 결과 |
| --- | --- |
| [base.md](../../../ai-context/base.md) | 프로젝트 Node/pnpm 고정 버전, 실제 스크립트와 Actions 구성이 맞는다. 로컬 PATH 호스트 버전은 위에 구분했다. |
| [architecture.md](../../../ai-context/architecture.md) | `src/app` route·`src/components/my`·`src/data/company` 분리, 공개 client와 DTO/HTTP 경계가 맞는다. |
| [data-access.md](../../../ai-context/data-access.md) | 일곱 공급원, immutable 빌드 snapshot, hybrid 제약·운영 가드, 계정별 mock, upload handle 및 fallback 금지 규칙이 현행 범위와 같다. 회사 통합은 향후 동일 company 포트에서 검토할 사안이다. |
| [plan.md](../../../ai-context/plan.md) | 날짜별 정책 연결을 추가하고 상태·우선순위는 WBS에 단일화했다. 후속 실제 QA는 계획과 차단 근거로 분리했다. |
| [harness.md](../../../ai-context/harness.md) | feature-workflow·context-audit·ai-review, `.codex/agents/verifier.toml`, placeholder 설정이 설명과 맞는다. |
| [ai-failures.md](../../../ai-context/ai-failures.md) | 기존 유사 이력을 확인했다. 이번 조사에서 구형 데이터 의미를 검토 중 교정했다. 반복된 새 코드 문제나 하네스 수정 근거는 없다. |

### 발견된 불일치

해당 범위의 프론트 AI 문맥 문서에 수정이 필요한 사실 오기는 발견하지 못했다. 외부 ADR 초기 서술과 현행 domain/서버 분기의 차이, Swagger 코드 응답 목록의 차이와 거절 사유 계약 공백은 [정책 조사](../tasks/POL-16.md#pol-16-investigation)에 남겼다.

### 개발자 확인 필요 사항

기존 중앙 정책을 바꾸는 결정이나 현재 프론트 하네스 갱신 요청은 없다. 실제 업무 자원과 D3의 사유 조회 확보는 해당 후속 작업의 선행 조건이다.

### 추천 수정 방향

POL-16의 정책과 실행 조건은 WBS/Task/QA에서 관리한다. 소유 저장소의 새 계약이 생기면 DEV-34 또는 DEV-37의 해당 범위에서 다시 대조한다.

## 독립 verifier

- 조사 diff의 한정 검토는 PASS였다. Minor 1건으로 구형 `IN_PLACE_MEMBER_REVIEW`와 신규 `CROSS_COMPANY`의 `reviewRequested` 의미 차이를 지적받아 `reviewOpening.origin` 설명을 보완했다.
- 전체 정책 후보 리뷰는 PASS였다. Blocker·Major는 없었고 Minor 2건을 보완했다. 최종화에서 취소하는 원본 대기 초대 전부와 이전 승인 대상자의 인증 회사 충돌 초대를 분명히 했으며, MERGE-13의 두 사건 거절과 팀원별 제외를 구분했다.
- 읽기 전용 검토는 원본 요청과 사용자 D1~D3, `git status`/`git diff`, 현재 스크립트·소스·게시 명세·문서 검사를 근거로 했다. 종료 기록·WBS 인계·Minor 보완을 반영한 diff는 Git 전달 전에 두 Gate에서 다시 확인한다. 최종 검토는 PR이 가리키는 문서 변경집합에 적용한다.

## ai-review

### 1. 리뷰 요약

현행 인증 충돌 사건만 제공한다는 D1, 회사 정보 요약과 일괄 결정이라는 D2, 원본이 실제 거절 사유를 읽을 계약을 먼저 확보한다는 D3가 정책·QA·후속 Task에 일치한다. 인증 회사의 거절 상세 계약을 DEV-37에 두었고, 실제 변경은 POL-16의 Markdown 문서로 한정했다.

### 2. 발견된 문제

차단하거나 수정해야 할 Blocker·Major는 없었다. 독립 검토의 세 Minor를 문서에 보완했다. 변경 diff에서 인증값과 개인정보를 기록한 흔적은 발견하지 않았다.

### 3. 누락된 검증

제품·설정 diff가 없어 로컬 앱 검사와 브라우저/mock/HTTP 대역을 실행하지 않았다. MERGE-01~16의 실제 API 검증은 전부 미실행이다. 실행 중 백엔드 SHA 대응과 권한별 업무 응답, DEV-37의 거절 사유는 후속 검증이 필요하다.

### 4. 문서 갱신 필요 여부

Task·WBS·QA 계획·인덱스·공통 plan·인계를 갱신했다. 기존 baseline/coverage, 다른 QA 기록과 승인 이력을 보존했다. 런타임/도구/하네스 변경이 없어 base/architecture/data-access/harness의 동기화 사유가 없다.

### 5. 개발자 확인 필요

정책 범위에 추가 결정을 요구할 사항은 없다. D1의 Linear 등록은 워크스페이스 한도가 해소될 때 재개하고, DEV-37은 소유 백엔드 계약의 자료와 QA 승인을 확보할 때 자체 Gate를 연다.

### 6. 추천 수정 방향

이번 정책 문서는 검증된 범위로 전달한다. 후속 UI는 연결된 Figma 상태와 소유 계약을 따라 자체 Brief·검증을 갖춘다. 재검토와 GitHub CI·병합은 고정된 최종 PR head에서 확인한다.

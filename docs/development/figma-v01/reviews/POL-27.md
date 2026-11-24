# POL-27 · 문서 검증과 Review Gate

[조사](../tasks/POL-27.md#pol-27-investigation) · [사용자 결정과 재조사](../tasks/POL-27.md#pol-27-display-decisions) · [현재 상태와 다음 행동](../README.md)

## 초기 Context Audit Report · 2026-11-24 KST

### 결론

**WARN**. 확인한 공통 AI 컨텍스트와 현재 소스는 일치한다. 공개 소식의 발행·공급원·열람을 정하는 D1은 제품 결정 대기다.

### 확인한 코드베이스 사실

- Next.js `16.2.9`, React `19.2.4`, pnpm `11.3.0`, 스크립트 8개, lockfile `9.0`. 기본 셸의 Node는 `26.5.0`, 저장소 `.nvmrc`와 설치된 지정 Node는 `22.20.0`이다.
- 현재 GNB에는 홈·입찰공고·자주 묻는 질문이 있다. 공개 FAQ는 서버 전용 정적 공급원을 사용한다. 메이트 소식 목록·상세 route와 전용 공급원은 현행 소스에서 찾지 못했다. [현행 근거](../tasks/POL-27.md#pol-27-investigation)

### 문서별 정합성 점검

| 문서 | 확인 |
| --- | --- |
| [base.md](../../../ai-context/base.md) | package scripts·패키지 버전·Node pin·워크플로가 소스와 일치한다. 별도 `type-check`·`format` 스크립트는 없다. |
| [architecture.md](../../../ai-context/architecture.md) | App Router·헤더 소유 컴포넌트, 정적 FAQ와 데이터 모듈의 실제 경계를 확인했다. |
| [data-access.md](../../../ai-context/data-access.md) | 일곱 공급원과 공개 진입점, 빌드 snapshot과 운영 mock guard, 정적 Q&A를 확인했다. 새 공급원은 정책 결정 대기다. |
| [plan.md](../../../ai-context/plan.md) | 상태·다음 행동은 WBS가 관리한다. W01/W02의 원본 연결과 DOC-001 선행은 유지했다. |
| [harness.md](../../../ai-context/harness.md) | 세 스킬, 독립 verifier와 placeholder 설정이 존재한다. |
| [ai-failures.md](../../../ai-context/ai-failures.md) | 이번 원격 조사에서는 필요한 URL·노드·SHA·검사 결과를 선별했다. 새 예방 규칙이 필요한 재발 근거를 확인하지 못했다. |

### 발견된 불일치

POL-27 영향 범위에서 공통 문서의 사실 불일치를 발견하지 못했다. W01/W02 시안에 있는 소식 화면은 현재 웹 구현에 남은 범위이며, 작업별 기록에 연결했다.

### 개발자 확인 필요 사항

D1에서 공식 콘텐츠 공급원, 발행·수정·철회 역할, 열람 범위를 결정한다. D2·D3는 사용자 답변을 기록했다.

### 추천 수정 방향

D1 결정 뒤 승인 근거와 DEV-51·52 완료 기준을 연결한다. 현재 상태는 WBS에서 갱신한다.

## 중간 독립 verifier · 2026-11-24 KST

**Result · PASS**. 조사·부분 결정 문서 기준이다. POL-27 전체에는 D1 Blocker가 남아 있다. Major는 없었고 후보 정의의 과거 미실행과 이번 조사 행을 구분하라는 Minor는 [중간 검증 기록](../tasks/POL-27.md#pol-27-display-decisions)에 반영했다.

- **Verification**. `git diff --check`와 Python 문서 검사, 두 백엔드 기준점의 소스와 개발 OpenAPI를 독립 재확인했다. Markdown 2개·로컬 링크 10개·외부 URL 형식 20개, 원본 79개·작업 114개·의존성 156개를 확인했다.
- **Documentation Update Check**. WBS 집계와 선행, 원본과 QA 이력을 보존했다. 폴더·런타임·설정·하네스에 변경이 없어 공통 문서는 현행대로 사용한다.
- **Review freshness**. 시작 HEAD `abc63ab`에 대한 diff `641b1424` 기준이다. D1과 종료 문서가 반영되면 검토를 다시 수행한다.
- **Developer follow-up**. 승인할 공급원·발행 역할·공개 범위를 확정한다.

## 중간 ai-review · 2026-11-24 KST

### 1. 리뷰 요약

POL-27 원본 완료 기준, 사용자 D2·D3 답변, `git status`와 diff 및 현재 package scripts를 대조했다. 조사와 승인 기록의 문서 범위를 통과로 판정한다. 전체 정책은 D1 결정 대기다.

### 2. 발견된 문제

- **Blocker**. 공개 소식 공급원·발행 권한·열람 범위가 미결이다. 공개 입찰공고, 계정별 알림과 관리자 발송 계약으로 대체할 근거를 찾지 못했다.
- **Major / Minor**. 확인한 문서에 새 지적 사항이 없다.

### 3. 누락된 검증

로컬 앱 test/lint/build, Storybook, 브라우저, mock/HTTP 대역과 실제 업무 API 통합은 문서 변경 범위에서 미실행이다. 실제 서버 실행 SHA도 미확인이다.

### 4. 문서 갱신 필요 여부

조사·승인·재개 조건과 현재 상태를 Task와 WBS에 기록했다. D1 확정 뒤 후속 개발 기준을 갱신한다. 기준선·원본 연결표와 기존 QA는 유지했다.

### 5. 개발자 확인 필요

D1 결정 또는 승인된 현행 게시 계약의 근거가 필요하다. 이번 Git 전달 승인과 Chromatic 월간 한도 예외는 작업 기록에 별도로 연결했다.

### 6. 추천 수정 방향

저빈도 발행이라면 제품·운영 승인과 프론트 PR을 통한 공개 정적 콘텐츠를 선택한다. 독립적인 게시 운영이 필요하면 실제 공급 계약과 공개 조건을 확보하고 W01/W02 기준을 연결한다.

## 확정 정책 문서 검증 · 2026-11-24 KST

- 사용자가 백엔드 API 공급원, 사용자 웹 조회 전용, 발행된 글의 비로그인 열람을 차례로 확정했다. [결정 원문과 적용 범위](../tasks/POL-27.md#pol-27-contract)를 확인했다. 별도 관리 경로의 구현·권한 체계와 미완성 API 계약은 후속 확인 범위다.
- 정책 반영 단계에서 Python 3.14.6 문서 검사와 `git diff --check abc63ab`를 통과했다. Markdown 6개, 새 로컬 링크·앵커 54개와 외부 URL 형식 20개, 원본 ID 79개, Task 114개와 순환 없는 선행 156개, WBS 상태 집계를 확인했다. 기준선·연결표·감사 증거·기존 QA의 원문을 보존했다.
- `package.json`의 스크립트 8개와 데이터 공급원 7개 및 공개 진입점을 확인했다. 실행 코드·설정 영향이 없는 문서 범위여서 로컬 `pnpm test`, `pnpm lint`, `pnpm build`, Storybook, 제품 브라우저, mock/HTTP 대역 및 실제 업무 API 검증은 미실행이다.
- **Documentation Update Check.** 사용자 결정과 후속 검증 조건은 Task와 공통 계획에 연결하고 현재 상태는 WBS에서 관리한다. `base.md`, `architecture.md`, `data-access.md`, `harness.md`의 현재 스크립트·구조·공급원·하네스 설명과 일치한다. 이번 `ai-failures.md` 갱신 사유는 없으며 기존 QA 사례의 상태를 보존한다.

## 승인 정책 독립 verifier · 2026-11-24 KST

**Result · PASS**. 공식 백엔드 API, 사용자 웹 조회 전용, 발행 글의 비로그인 열람 및 D2·D3 기준을 승인 근거와 대조했다. DEV-51·52에 실제 공개 조회 계약·개발 배포·검증 조건을 남겼다.

- **Issues.** Blocker와 Major는 없었다. 두 Minor는 초기 Context Audit의 시점을 명시하고, 관리자 웹에 관한 사용자 발언을 질문으로 기록해 해결했다.
- **Verification.** `git diff --check`와 Python 검사를 독립 재실행했다. 리뷰 단계 Markdown 6개, 새 로컬 링크·앵커 55개, 외부 URL 형식 20개, 원본 79개·Task 114개·의존성 156개를 확인했다.
- **Documentation Update Check.** 공통 계획과 DEV-51·52 재개 기록을 검토했다. 기준선·연결표·기존 QA를 보존했다.
- **Review freshness.** 기준 `abc63ab`에 대한 추적 diff `ae946e97`과 검토 파일 `923ca4b1`에 적용된다. 종료·인계와 Minor 교정이 포함된 최종 diff의 재검토는 [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fpol-27-mate-news-policy)에 남긴다.
- **Developer follow-up.** 이번 고객 웹 정책의 추가 결정은 없다. 실제 읽기 계약과 개발 배포는 DEV-51·52의 후속 조건이다.

## 확정 정책 ai-review · 2026-11-24 KST

### 1. 리뷰 요약

원래 완료 기준과 사용자 답변, `git status`, `git diff`, 현재 GNB·App Router·데이터 접근 구조와 package scripts를 대조했다. 승인된 고객 웹 정책과 후속 개발의 재개 조건은 근거에 맞는다.

### 2. 발견된 문제

정책 범위에 Blocker·Major가 없다. 초기 감사와 사용자 질문의 문구를 바로잡았고, 관리자 도구·역할·쓰기 계약은 별도 관리 범위다.

### 3. 누락된 검증

로컬 앱 test/lint/build, Storybook, 제품 브라우저·mock·HTTP 대역 및 실제 업무 API는 실행 영향이 없는 문서 범위에서 미실행이다. DEV-51·52의 실제 검증은 공개 API 계약, 개발 배포와 실행 대응, 승인된 읽기 환경 확인 뒤 진행한다.

### 4. 문서 갱신 필요 여부

POL-27, DEV-51·52, WBS, 계획, 리뷰와 POL-28 인계를 갱신했다. 소스·패키지·테스트·하네스 영향과 원본 연결 변경이 없어 현재 기준선·공통 구현 안내·QA 이력을 사용한다.

### 5. 개발자 확인 필요

이번 정책에 남은 승인 사항은 없다. 구체 관리자 운영 권한·도구·변경 계약과 조회 API 배포는 각 소유 팀에서 확인한다. 이번 PR의 Chromatic 월간 한도 예외는 원격 검사에서 원인이 확인됐을 때 적용한다.

### 6. 추천 수정 방향

DEV-51은 공개 목록 계약과 개발 배포 증거를 확인한 뒤 자체 Gate에서 시작한다. DEV-52는 DEV-51의 결과와 상세 계약을 확인한다. 다음 POL-28은 운영 canonical URL·OG 이미지 정책의 선정과 인계 기록을 따른다.

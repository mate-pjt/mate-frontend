# POL-26 · 문서 검증과 Review Gate

[S08 결정](../tasks/POL-26.md#pol-26-contract) · [현재 근거](../tasks/POL-26.md#pol-26-evidence) · [DEV-50에 넘길 QA 계획](../../../qa/qna.md#pol-26-s08-qa) · [WBS](../README.md)

## 문서 검증 · 2026-11-24 KST

- Python 3.14.6 문서 검사와 `git diff --check 5af2523`에서 초기 Markdown 7개, 새 로컬 링크·앵커 34건과 외부 링크 형식 15건, 원본 79개, WBS 114개·의존성 156개, 상태 집계, 기준선과 기존 QA 보존, 변경 범위를 확인했다.
- 두 Figma 배너를 메타데이터와 렌더로 대조했다. 사용자 지정 외부 폼의 공개 화면 열람과 표시 문항을 확인했다. 실제 제출·운영 설정 확인은 미실행이다. [S08 근거](../tasks/POL-26.md#pol-26-evidence) · [채널 근거](../tasks/POL-26.md#pol-26-source-gate)
- 실행 코드·패키지·빌드 변경이 없는 Markdown 검토다. 로컬 앱 test/lint/build와 Storybook, Mate 브라우저, mock·HTTP 대역과 실제 업무 API 통합은 미실행이다. [QA 계획 5건](../../../qa/qna.md#pol-26-s08-qa)

## Context Audit Report

### 결론

**PASS**. S08의 현재 소스·실행 규칙과 공통 AI 컨텍스트를 대조했다. [공통 계획](../../../ai-context/plan.md)의 11월 20일 조건은 당시 기록으로 보존하고, 승인된 링크 범위를 별도 날짜에 연결했다.

### 확인한 코드베이스 사실

- Next 16.2.9, React 19.2.4, pnpm 11.3.0과 package 스크립트 8개, lockfile 9.0을 확인했다. 기본 셸 Node는 26.5.0, 저장소 pin과 설치된 Node는 22.20.0이다.
- 인증된 설정이 표시하는 의견 배너와 공개 FAQ의 의견 배너는 disabled 상태다. FAQ 본문은 `server-only` 진입의 정적 Repository에서 읽는다. [현행 근거](../tasks/POL-26.md#pol-26-evidence)

### 문서별 정합성 점검

| 문서 | 확인 |
| --- | --- |
| [base.md](../../../ai-context/base.md) | 스크립트·패키지·Node pin이 소스와 일치한다. |
| [architecture.md](../../../ai-context/architecture.md) | 설정 화면과 FAQ 구조·컴포넌트·정적 데이터 경계가 일치한다. |
| [data-access.md](../../../ai-context/data-access.md) | 일곱 공급원, snapshot·운영 guard, 정적 FAQ가 소스와 일치한다. S08 결정은 외부 링크 범위다. |
| [plan.md](../../../ai-context/plan.md) | WBS의 상태 권한과 S08, POL-26/DEV-50 연결을 확인했다. 승인된 S08 링크 범위를 추가했다. |
| [harness.md](../../../ai-context/harness.md) | 세 스킬과 verifier 정의 및 placeholder 설정이 존재한다. |
| [ai-failures.md](../../../ai-context/ai-failures.md) | 원격 조회 출력에서 경로·SHA·상태와 필요한 문구를 선별하는 규칙을 적용했다. |

### 발견된 불일치

이번 범위에서 현행 구조·하네스의 사실 불일치는 확인하지 못했다. Figma와 웹의 버튼 상태 차이는 정책 근거와 후속 개발에 연결했다.

### 개발자 확인 필요 사항

링크의 정책 근거는 사용자 지정 URL이다. 응답 운영의 구체적인 배정·보관 및 집행 내용을 확인한 것으로 기록하지 않는다.

### 추천 수정 방향

DEV-50에서 기존 소스와 두 진입의 QA 계획을 확인하고 링크 범위로 자체 Gate를 진행한다.

## 1차 독립 verifier · 리뷰 단계

**Result · FAIL**. D1/D2의 공통 폼과 프론트 링크 범위는 근거와 일치했다. 당시 후보가 요구한 운영 기준의 확정과 이번 링크 정책의 완료 범위 차이가 남았다.

- **Major**. D1/D2는 기존 폼과 링크에 적용된다. 실제 운영 담당·보관·성공/실패와 스팸/중복 기준의 확인 없이 원래 범위 전체를 완료할 근거는 없다. 링크 정책으로 닫으려면 사용자 범위 결정을 연결해야 한다. DEV-50 외부 이동에 신규 API나 실제 제출이 필요하다는 근거는 없었다.
- **Minor**. S08-01 절차에 비로그인 설정 접근이 빠졌다. 별도 비로그인 세션에서 `/my`에 들어가는 단계를 추가했다.
- **검증**. `git diff --check 5af2523`와 Python 문서 검사를 독립 재실행했다. 리뷰 단계 Markdown 7개, 새 로컬 링크·앵커 47건, 외부 링크 형식 15건, 원본 79개·작업 114개·의존성 156개를 확인했다. 앱·외부 폼 제출 검증은 미실행이다.
- **검토 범위**. 이 결과는 1차 리뷰 단계 diff에 적용된다. 승인 근거와 종료 기록을 반영한 후 문서 검사·verifier·ai-review를 다시 수행한다.

## 2차 독립 verifier · 보완한 리뷰 단계

**Result · PASS**. 사용자 D3가 링크 전용 완료 범위를 명시했다. 기존 완료 기준은 이력으로 보존했고 비로그인 설정 접근 절차를 추가했다.

- **Issues**. Blocker, Major, Minor 없음. 1차의 두 지적을 해소했다.
- **Verification**. `git diff --check 5af2523`와 Python 문서 재검사를 통과했다. 새 로컬 링크·앵커 49건, 외부 링크 형식 15건, 원본 79개·WBS Task 114개·의존성 156개를 확인했다. 앱, 실제 폼 제출과 DEV-50 링크 QA 5건은 미실행이다.
- **Documentation Update Check**. POL-26 결정과 DEV-50 후속 기준, 두 화면 QA 계획이 일치한다.
- **Review freshness**. 이 판정은 보완한 WBS 리뷰 단계에 적용한다. 종료·선정 기록이 포함된 최종 diff의 검토는 [PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fpol-26-feedback-channel-policy)에 기록한다.
- **Developer follow-up**. 이번 링크 정책에 추가 결정은 없다. DEV-50은 자체 Gate에서 시작한다.

## ai-review

### 1. 리뷰 요약

**PASS**. 공통 의견 폼과 접근 경계, D3의 링크 정책 종료와 별도 폼 운영 범위를 사용자 답변 및 시작 소스와 대조했다.

### 2. 발견된 문제

보완 뒤 해결되지 않은 Blocker·Major·Minor는 없다. 운영 담당, 보관·삭제, 중복·스팸과 실제 제출 결과는 외부 폼의 미확인 항목이다. 문서 변경에서 계정 데이터와 자격증명 노출 패턴을 점검했다.

### 3. 누락된 검증

문서 검사에서 누락은 없다. 실행 코드·패키지 영향이 없어 로컬 앱 검사와 Mate 브라우저·mock·HTTP 대역은 미실행이다. 외부 폼은 공개 화면을 읽었으며 실제 제출·업무 API와 DEV-50 링크 QA는 미실행이다.

### 4. 문서 갱신 필요 여부

POL-26, DEV-50, WBS와 공통 계획, 설정·FAQ QA 및 두 리뷰 기록에 정책·근거를 연결했다. 기준선·79개 연결표와 기존 QA를 보존했다.

### 5. 개발자 확인 필요

D3로 이번 완료 범위를 확인했다. 폼의 실제 응답 관리나 운영 변경이 필요해지면 채널 운영 담당이 그 범위를 확인한다.

### 6. 추천 수정 방향

종료 인계를 포함한 diff의 문서 검사와 두 리뷰를 재실행한다. 다음 작업에서 링크 자체 검증을 이어간다. [Git 전달 기준](../tasks/POL-26.md#pol-26-delivery)

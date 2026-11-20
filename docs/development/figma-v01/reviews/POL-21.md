# POL-21 문서 검증과 리뷰

[사용자 결정과 승인](../tasks/POL-21.md#pol-21-brief) · [정책](../tasks/POL-21.md#pol-21-contract) · [O09 QA 계획](../../../qa/auth.md#pol-21-o09-qa)

## Context Audit Report

### 결론

**PASS** · 2026-11-20 가입 실적·인증과 문서 작업 절차에 영향을 주는 범위에서 점검했다.

### 확인한 코드베이스 사실

시작 main `587ed6c`의 현재 등록 경로 두 곳이 공통 실적 화면을 사용한다. `SignupCompanyProfile`은 read 모델이며 양쪽 등록 명령은 현재 수기 입력을 받지 않는다. 이 차이를 정책 문서와 DEV-44 재개 조건에 연결했다. [현행 소스와 API](../tasks/POL-21.md#pol-21-investigation)

### 문서별 정합성 점검

| 문서 | 확인 범위와 갱신 판단 |
| --- | --- |
| `base.md` | `package.json` Next 16.2.9/React 19.2.4, pnpm 11.3.0, Node `.nvmrc` 22.20.0, lockfile 9.0, Node Vitest와 data-access/Chromatic CI를 대조했다. 실행 환경과 스크립트 변경이 없어 갱신할 항목이 없다. |
| `architecture.md` | 두 `app/auth` 등록 경로, 공유 컴포넌트, `data/company` 공개 진입점, `AccountScope` 및 현행 `SignupCompanyProfile`의 tri-state와 근거 보존 설명을 확인했다. 구현 구조 변경은 없다. |
| `data-access.md` | 공급원 7개와 hybrid 제약, `next.config.ts` snapshot 및 운영 mock guard, 실제 실패 전파와 기존 계정/업로드 격리 경계를 확인했다. 문서의 신규 정책은 후속 계약의 조건이다. 현행 접근 가이드 갱신은 후속 구현에서 판단한다. |
| `plan.md` | WBS가 현재·다음·상태를 소유한다. 날짜별 POL-21 정책·DEV-44 서버 선행·O09 미실행 계획을 추가했다. 기존 정책 및 QA 이력은 유지했다. |
| `harness.md` | 프로젝트 설정, 세 Skill과 verifier 역할, 문서 검증·Review Gate 및 단일 WBS 기준을 확인했다. 하네스 변경은 없다. |
| `ai-failures.md` | 외부 응답·Git 작성자·Figma 예시값 출력 경계와 예외 범위 기록 규칙을 확인했다. 신규 반복 실패나 하네스 개선 항목은 없었다. |

### 발견된 불일치

점검한 AI 컨텍스트에 수정이 필요한 불일치는 없었다. 시안의 필수 금액·이진 선택, 그리고 등록 API에서 수기값을 받지 않는 점은 제품 승인·후속 계약으로 기록했다. 기존 AUTH-14/15 및 AUTH-09~13의 차단과 AUTH-17 미실행은 보존한다.

### 개발자 확인 필요 사항

POL-21 정책 결정은 사용자 D1~D3으로 해소했다. DEV-44에는 백엔드 등록 계약과 실행 대응·승인된 실제 QA 자원이 필요하다.

### 추천 수정 방향

현행 구조와 데이터 접근 가이드는 두고, 지원 계약이 확인되면 DEV-44의 요구사항 Gate에서 현재 정책 링크를 구현 및 검증 근거로 사용한다.

## 문서 검증

`python3 validate-docs.py 587ed6c verification` 및 `review`, `git diff --check 587ed6c`가 통과했다. 리뷰 단계의 Markdown 6개, 신규 로컬 링크·앵커 29개, 기준선 4개, 원본 79개, WBS 작업 114개·선행 156개를 확인했다. 종료 기록과 다음 인계는 `final` 검사 및 두 리뷰에서 다시 확인한다. 로컬 앱 테스트·lint·build·Storybook과 앱 브라우저·mock·HTTP 대역·실제 업무 API는 미실행이다. [검증 체크포인트](../tasks/POL-21.md#pol-21-verification)

## Read-only verifier

### Result

초회 **FAIL** · 수정 후 **PASS**.

### Summary

승인된 D1~D3과 Figma 예외, 두 등록 경로의 계약·근거 수준, 후속 DEV-44 선행과 실제 QA 보존을 검토했다. 저장 실패의 검증 기준을 보강한 뒤 수정된 정책·인계·O09-08의 의미가 일치함을 확인했다.

### Issues

- 초회 Major 1. 기존 문구로는 서버에 회사나 초기 소속만 남고 화면에 완료를 표시하지 않는 경우가 통과할 수 있었다. 수정 1/3에 두 경로의 부분 저장 금지·기존 상태 보호와 저장 실패 뒤 잔존 확인을 추가했다. 응답 유실은 별도로 결과를 확인한다.
- 수정 검토에서 Blocker·Major·Minor 0건.

### Verification

`git diff --check 587ed6c`, `python3 validate-docs.py 587ed6c review`, 두 경로의 현행 소스/계약 대조. 변경이 문서에 한정되어 런타임 명령과 실제 QA는 이번 검토 증거에 포함되지 않는다.

### Documentation Update Check

정책, DEV-44 서버 선행, O09-08 및 변경 근거가 같은 부분 저장 방지 기준을 다룬다. WBS는 상태를 관리하고 공통 계획은 날짜별 요약을 연결한다.

### Review freshness

`587ed6c` 기준 초회 diff SHA-256 `fa1ed57eb581f7afebbc82451d6e7b4437c67e0258bf8be6de018d3aec80103f`, 수정 후 `5e18d0f9c8444748d7ccab15621d98acded872a0860a9d70af3e48c88c8bb1ea`. 종료 기록과 다음 인계를 포함한 전달 diff는 재검증·재검토하고 최종 head의 결과를 PR과 종료 보고에 기록한다.

### Developer follow-up

POL-21에 필요한 사용자 결정은 확보됐다. 후속 개발 전에 백엔드 계약·실행 버전·승인된 QA 자원이 필요하다.

## ai-review

### 1. 리뷰 요약

사용자 결정과 `git status --short`, `git diff --stat`, `git diff`, 현행 가입 소스, 백엔드 계약, `package.json`, 문서 검증 결과를 대조했다. 변경은 정책·QA·인계 문서이고 앱 구조, 폴더, 타입, 공급원과 공개 Repository 경계는 유지한다.

### 2. 발견된 문제

초회 독립 Major 1의 사용자 승인 대비 부분 저장 검증 누락을 해소했다. 변경 범위·데이터 접근 규칙·비밀값 출력 경계에서 미해결 Blocker·Major·Minor는 없다.

### 3. 누락된 검증

문서 검사와 시안/소스/명세 대조를 수행했다. O09-01~09 실제 통합과 앱 브라우저·mock·HTTP 대역은 미실행이고 기존 가입 실제 차단을 보존한다. 로컬 앱 test/lint/build/Storybook은 실행 코드와 설정의 영향이 없어 미실행했다.

### 4. 문서 갱신 필요 여부

POL-21 결정·DEV-44 재개 조건·가입 QA·공통 계획·WBS 및 POL-22 인계를 기록한다. 원본 기준선과 O09 연결 관계, 기존 QA·예외를 보존했다. `base.md`, `architecture.md`, `data-access.md`, `harness.md`, `ai-failures.md`의 추가 변경은 필요하지 않다.

### 5. 개발자 확인 필요

POL-21의 추가 결정은 없다. 두 경로의 서버 저장 계약과 실제 QA 자원 확인은 DEV-44에 남긴다.

### 6. 추천 수정 방향

현재 정책 문서에 추가 수정은 없다. DEV-44 재개 시 등록 경로마다 부분 저장 방지·결과 확인·현재 권한을 실계약과 대조한다.

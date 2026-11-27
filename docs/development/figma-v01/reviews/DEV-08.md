# DEV-08 · 나의 회사 시공능력평가액과 기업 인증 검토

<a id="dev-08-review"></a>

## 2026-11-27 KST · 검토 대상

기준 `c71790bd94a3b7042b8e0f6b01cfda1baee699e2` 이후의 DEV-08 변경과 [11월 27일 Brief](../tasks/DEV-08.md#dev-08-brief), [POL-06 정책](../tasks/POL-06.md#pol-06-contract), [로컬 검증](../../../qa/my-company.md#dev-08-local-qa)을 대조했다. 제품·테스트 15파일의 최종 지문은 `13d7880f1dbfd88bf12a7a4618ab660cbb8511ba5762ce34f8776232a8b4ec6c`이다. [Chrome 증거](../../../qa/artifacts/dev-08/browser-results.json)

## Context Audit Report

### 결론

PASS. DEV-08의 현행 Repository와 적용 문서 설명이 일치한다. 두 Figma 프레임에 희망 입찰공고 금액이 있음을 기록했다. 11월 27일 사용자 범위와 당시 시안 설명의 차이를 작업 기록에 연결했다. [범위와 프레임 근거](../tasks/DEV-08.md#dev-08-brief)

### 확인한 코드베이스 사실

연결된 회사 기본정보는 기존 회사 Repository에서 가져온다. 신규 두 조회는 동일 공급원의 현재 소속과 유효 `COMPANY_INFORMATION_VIEW`를 확인하고 결과를 독립 표시한다. DB 원 단위 20자리를 HTTP 숫자 원문에서 보존한다. 새 데이터 소스 없이 기존 일곱 그룹, 빌드 snapshot, hybrid 제약, 운영 guard와 업로드 핸들 경계를 따른다. [회사 HTTP](../../../../src/data/company/company-profile-api.ts) · [화면 조회 수명](../../../../src/features/company/company-profile.ts)

### 문서별 정합성 점검

| 문서 | 결과 |
| --- | --- |
| base.md | 현재 8개 스크립트, lockfile, Next·React·Vitest, pnpm 11.3.0과 Node 22.20.0 핀을 대조했다. |
| architecture.md | 나의 회사의 기본 정보와 새 두 섹션 및 표시 수명을 설명했다. |
| data-access.md | Profile 포트, 회사·계정 경계와 정확한 원 단위 파싱을 반영했다. |
| plan.md | 날짜별 구현 근거와 실제 통합의 공동 QA를 연결했다. 현재 상태는 WBS에서 관리한다. |
| harness.md | 실제 두 검토 진입점과 세 스킬, WBS 운용 흐름이 일치한다. |
| ai-failures.md | 이번 Figma/Aside 도구 출력과 선별 기준을 기록했다. |

### 발견된 불일치

Minor. 11월 26일 회사 시안 관찰에는 희망금액의 배치가 확인되지 않았다고 적혀 있다. 11월 27일 직접 읽은 두 프레임 모두 해당 카드가 있다. 새 관찰을 Brief에 추가했고 사용자 지정 표시 범위를 적용했다. 과거 기록은 당시 관찰로 남긴다.

### 개발자 확인 필요 사항

로컬 구현의 추가 결정은 없다. 실제 서버 통합은 승인된 합성 자료·실행 식별·재현과 복구 범위를 사용하는 공동 일정이다.

### 추천 수정 방향

실제 QA가 준비되면 기존 CDASH 사례에 상태별 근거를 추가한다. [공동 QA 재개 조건](../tasks/POL-06.md#pol-06-handoff)

## AI Review

### 1. 리뷰 요약

PASS. 개인 계정의 현재 회사 프로필 아래에서 업종·공종별 평가액과 실제 평가연도, 서버 대표 평가, 출처와 인증 3종을 확인할 수 있다. 독립 섹션의 정상 응답은 판정이 끝나면 표시한다. 권한 스냅샷, 세션 epoch, 회사 및 AbortSignal로 이전 보호 결과를 폐기한다. [공개 포트](../../../../src/data/company/client.ts) · [로컬 경계 검사](../../../qa/artifacts/dev-08/browser-results.json)

### 2. 발견된 문제

미해결 Blocker·Major·Minor는 없다. 첫 검토의 Minor는 HTTP 대역 화면에서 인증 아이콘 두 개가 늦어지는 현상이었다. 기존 24px 아이콘을 제품 화면에서 직접 로드하도록 바꿨다. 세 폭에서 모두 로딩을 확인한 새 화면과 전체 자동·브라우저 검증으로 재확인했다. 이번 조회는 업무 쓰기, 자동 mock fallback, 새 데이터 공급원·저장소를 추가하지 않는다.

### 3. 누락된 검증

실제 개발 서버의 회사·권한별 계정, 실제 wire·오류·실행 버전 확인은 미실행이다. 기존 CDASH 0통과·12차단을 보존한다. 실기기·별도 스크린리더와 Figma 전체 페이지 전수는 이번 Chrome/지정 영역 검증의 범위 밖이다. [공동 QA](../../../qa/my-company.md#dev-08-local-qa)

### 4. 문서 갱신 필요 여부

회사 조회 계약, 사용 안내, QA·WBS·작업 및 날짜별 계획을 갱신했다. 원본 기준선 79개, 연결표 및 기존 판정을 보존한다. package와 스크립트, 하네스 흐름에 변경이 없어 base·harness의 갱신 항목은 없다.

### 5. 개발자 확인 필요

현재 승인 범위 안의 추가 결정은 없다. 실제 통합 일정의 활성 소속·권한·경계 자료와 실행 대응, 합성 계정 사용·정리 승인 확인이 남는다.

### 6. 추천 수정 방향

현재 diff의 추가 수정 사항은 없다. 승인 자료가 준비되면 실제 응답과 실행 버전을 CDASH 사례별로 남긴다.

## 독립 verifier

- 최초 Result · PASS. Blocker·Major 없이 HTTP 대역 캡처의 아이콘 Minor를 기록했다. 직접 재실행한 계약·수명 테스트 42건, 문서 검사와 `git diff --check`는 통과했다. 제품 소스 지문은 당시 `d3e6086d065599ce8b1b721067cabc235434560ab3fd294e57da4c652885847b`이었다.

### 최종 재검토

- **Result** · PASS.
- **Summary** · 최종 코드와 교체한 Chrome 캡처 3장, DEV-08 종료와 DEV-07 인계를 독립 재검토했다.
- **Issues** · 미해결 Blocker·Major·Minor 없음. 1440·390·320px 모두에서 인증 아이콘을 확인했다.
- **Verification** · 계약·조회 수명 42건을 독립 재실행했다. 전체 테스트 1,360건, lint, 세 Next 빌드, Storybook, 운영 guard, Chrome 25개와 캡처의 원본을 대조했다. 문서의 79개 원본·114개 Task·156개 선행 관계·추가 로컬 링크 및 `git diff --check`를 확인했다.
- **Documentation Update Check** · DEV-08의 승인 범위 검증과 기존 CDASH 실제 0통과·12차단, DEV-07 인계만 기록했다.
- **Review freshness** · 위 최종 지문을 작업트리와 검증 사본 3개에서 대조했다. 결과를 옮긴 이 기록은 문서 링크 및 diff 검사를 다시 수행한다.
- **Developer follow-up** · 현재 로컬 범위의 추가 결정은 없다. 실제 API 통합은 공동 QA에 남는다.

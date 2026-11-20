# DEV-34 검증과 리뷰

[요구사항과 승인](../tasks/DEV-34.md#dev-34-brief) · [검증 명령 및 체크포인트](../tasks/DEV-34.md#dev-34-verification) · [브라우저와 실제 QA](../../../qa/company-merge.md#dev-34-local-qa)

## Context Audit Report

### 결론

PASS · DEV-34 관련 현재 소스와 문서

### 확인한 코드베이스 사실

시작은 main `7c2366b`다. Node 22.20.0 및 pnpm 11.3.0 설치와 lockfile v9, 실제 package scripts, 7개 공급원과 production guard를 확인했다. G01의 공개 client는 같은 company 구현으로 현재 소속과 통합 사건을 조회하며, 새 설정 공급원은 없다.

### 문서별 정합성 점검

| 문서 | 검증 근거 |
| --- | --- |
| [base.md](../../../ai-context/base.md) | 실제 의존성과 스크립트, CI 프로필과 Node/pnpm 버전이 기준과 맞는다. |
| [architecture.md](../../../ai-context/architecture.md) | 실제 route·MySideMenu·feature의 경계를 추가했다. HTTP와 fixture를 화면에서 참조하지 않는다. |
| [data-access.md](../../../ai-context/data-access.md) | 새 기능은 `company` 그룹의 Merge 포트다. 설정 snapshot/guard/hybrid 제약은 기존 동작을 사용한다. 명시적 204, 최신 권한·DTO 최소 투영과 계정별 mock 기록을 확인했다. |
| [plan.md](../../../ai-context/plan.md) | 날짜별 구현·QA 근거를 연결하고 현재/다음/상태는 WBS에서 관리한다. |
| [harness.md](../../../ai-context/harness.md) | 실제 Skills와 읽기 전용 verifier 정의, Phase 순서가 일치한다. |
| [ai-failures.md](../../../ai-context/ai-failures.md) | 팝업 분리 시 초점 회귀 및 Figma 도구 출력 경계를 기록했다. |

### 발견된 불일치

DEV-34 관련 미해결 문서 불일치는 없다. 개발 Swagger에는 백엔드 source의 204 및 domain 409 나열이 생략되어 있다. 실행 버전 대조는 [조사](../tasks/DEV-34.md#dev-34-investigation)에 기록했다.

### 개발자 확인 필요 사항

실제 MERGE-01~04는 승인된 합성 자원과 실행 대응, 부수 효과·잔존의 정리 범위를 얻은 뒤 재개한다.

### 추천 수정 방향

G01 작동과 실제 QA 판정을 QA 표에서 별도로 갱신한다. 철회·재발송과 인증 회사 거절 사유 읽기는 기존 소유 계약을 따른다.

## 로컬 검증 근거

- 제품·테스트 검토 기준의 diff SHA-256은 `ac65bc160ba149cb6690fe818c3ff34fd848caab2186a313aacf2b8217ff0bd3`다. DEV-34 자동 44건을 포함한 1,202건, lint, API/mock/hybrid Next 빌드, Storybook을 모두 통과했다.
- 격리 파일로 실행한 Aside Chromium의 브라우저 mock/HTTP 대역을 확인했다. PR의 실행 판단은 원격 최종 head에서 별도로 기록한다.

## 최초 독립 verifier

### Result

FAIL · 검토 기준 `c99ed8f78a4ab4f69ac4947277e9d600b242ad56e0500bd79d5e036200c1272e`

### Summary

현재 사건 조회, 명시 제출과 충돌 뒤 동일 사건 재조회는 기준에 맞았다.

### Issues

Blocker·Minor 없음. Major 1건은 기존 같은 회사의 구형 사건이 검토 leaf 없는 활성 구성원에게 반환한 정상 응답을 프런트와 mock이 가린 문제다.

### Verification

`git diff HEAD --check`, 당시 1,199건 및 lint·세 빌드·Storybook과 HTTP 대역 로그를 확인했다. 구형 사건의 일반 활성 소속 읽기는 테스트에 없었다. 실제 QA 4건은 차단이었다.

### Documentation Update Check

POL-16 및 MERGE-01~04의 기존 근거를 보존하고 이 발견과 재검증을 작업·QA에 남긴다.

### Review freshness

이 첫 판정은 추가 수정 전 소스와 테스트에 적용된다.

### Developer follow-up

사용자가 이 결함의 추가 1회 수정을 승인했다. 안정된 일반 활성 소속의 구형 사건 읽기, 조회 중 leaf 변화의 폐기, G01 명령 거부 및 회사 간 사건의 기존 검토 권한을 함께 검증한다. [결정과 결과](../tasks/DEV-34.md#dev-34-verification)

## 교정 후 독립 verifier

### Result

PASS · 검토 기준 `ac65bc160ba149cb6690fe818c3ff34fd848caab2186a313aacf2b8217ff0bd3`

### Summary

구형 자체 인증 사건의 일반 활성 소속이 현재·정확 상세를 읽는다. 조회 중 검토 leaf가 바뀌면 이전 응답을 폐기한다. 회사 간 사건의 인증 회사 읽기 및 G01 명령 조건을 검토했다.

### Issues

미해결 Blocker·Major·Minor 없음. 최초 Major는 추가 승인 1회의 구형 읽기 교정으로 해소됐다.

### Verification

`git diff HEAD --check`를 직접 실행했다. 41파일·1,202건, lint, 세 구성 Next 빌드와 Storybook, 추가 자동 3건, HTTP 대역의 구형 current·exact 200과 쓰기 명령 0개를 확인했다. 실제 MERGE-01~04는 0통과·4차단이다.

### Documentation Update Check

최초 FAIL, 사용자 승인, 추가 회귀를 Task와 QA에 연결했다. 원본·coverage·패키지/CI/하네스를 확인했다.

### Review freshness

위 판정 뒤 추가하는 종료 및 QA-14 인계를 포함해 전달 직전 전체 변경을 다시 검토한다.

### Developer follow-up

승인된 로컬 범위에 추가 결정은 없다. 실제 QA 재개에는 작성한 실행 버전, 합성 자원 및 정리 범위의 확인이 필요하다.

## ai-review

### 1. 리뷰 요약

POL-16 G01에 따라 같은 번호의 현재 사건과 소속·leaf·capability를 확인한다. 사건·회사·membership·revision을 다시 대조하고, 연결된 세 명령에서 401 자동 재전송을 끈다. 응답 미확정/409의 재확인은 같은 사건의 GET이며 계정·회사·화면을 벗어난 응답은 반영하지 않는다. 기존 Tailwind 토큰, 공개 company 포트, 7개 공급원 및 저장 격리 경계를 확인했다.

### 2. 발견된 문제

미해결 Blocker·Major·Minor 없음. 최초 독립 검토에서 빠졌던 검토 leaf 없는 자체 인증 사건의 조회는 회귀 3건과 실제 Next HTTP 대역으로 교정했다. 새 diff에서 실제 인증값이나 단기 Figma URL을 기록한 흔적을 확인하지 못했다.

### 3. 누락된 검증

실제 MERGE-01~04는 0통과·4차단이다. 게시 Swagger와 배포 잡 근거에 실행 중 SHA와 권한별 업무 응답은 포함되지 않는다. Chromium 데스크톱/모바일 뷰포트와 선택된 Figma 상태를 대조했고, 전체 픽셀 일치 및 BFCache 적중, 실제 연결 단절의 전송 계층 replay는 별도다. 단독 TypeScript 진단의 기존 두 테스트 파일 오류 5건은 시작 main에서도 동일하며 공식 Next 빌드 3개는 통과했다.

### 4. 문서 갱신 필요 여부

architecture/data-access, plan·작업·WBS, 합성 실행 안내와 QA, 실패 기록을 반영했다. 작업 연결과 의존성, 원본 QA 및 기존 기준선은 검사했다. package/scripts·하네스 변경은 없다.

### 5. 개발자 확인 필요

이번 범위의 추가 결정은 없다. 실제 업무 검증은 기록된 합성 자원과 사용·잔존·복구 범위를 통해 재개한다. 이번 PR의 Chromatic 월간 한도 예외를 다른 검사에 적용하지 않는다.

### 6. 추천 수정 방향

최종 전달은 고정된 PR head의 CI·리뷰·병합 조건을 확인한 뒤 진행한다. 실제 MERGE-01~04의 재개는 기존 QA 기록에서 이어간다.

# POL-18 문서 검증 및 리뷰

2026-11-20 KST · 기준 `14661ce65364c05339f5d5bc63b4009412a3850a` · `docs/pol-18-withdrawal-policy`

검토 범위는 사용자 답변, 서버 책임·미확정 계약, Figma 근거, 후속 개발 조건과 미실행 QA 및 WBS 인계다. [요구사항과 답변](../tasks/POL-18.md#pol-18-brief)

## Context Audit Report

### 결론

착수 시 WARN 1건을 확인했다. 계정 관리의 완료된 조회가 공통 계획에 미래형으로 남아 있어 DEV-38 근거를 연결해 정리했다. 갱신본의 이번 범위 정합성은 PASS다.

### 확인한 코드베이스 사실

`package.json`의 8개 script, pnpm 11.3.0, lockfile v9, Next 16.2.9·React 19.2.4·Vitest 4.1.11을 확인했다. `.nvmrc`와 원격 검사 워크플로는 Node 22.20.0, 이번 문서 검사 셸의 Node는 26.5.0이다. 로컬 앱 명령은 실행하지 않았다.

### 문서별 정합성 점검

#### base.md

패키지·script·lockfile 및 Node 버전 핀이 일치한다.

#### architecture.md

`/my/settings/account`의 클라이언트 세션 이메일 조회, auth와 회사 명령의 분리, 공용 팝업 소유 위치가 계정 단위의 소스와 맞는다.

#### data-access.md

7개 Repository 공급원, client/server 진입과 DTO 경계, 빌드 데이터 스냅샷·운영 mock 차단, 탭/계정 저장과 회사 문서 업로드 handle 규칙을 확인했다. 이번 정책 문서에는 공급원, 저장소, 업로드 동작의 변경이 없다.

#### plan.md

미래형의 DEV-38 계정 이메일 읽기를 실제 완료 근거와 동기화했다. POL-18에는 정책/재개 조건을 연결하고, 현재/다음/상태는 WBS에서 확인한다.

#### harness.md

설명하는 세 skill과 verifier 역할, 프로젝트 설정 및 Review Gate 순서를 확인했다.

#### ai-failures.md

기존 원격 도구의 출력 필터링 규칙을 적용한다. 이슈 조회 중 관련 없는 내부 작업 경로 한 줄이 출력된 사실은 사용자에게 공유했다. 조회 결과는 필요한 정책 사실로 한정하여 문서화했다.

### 발견된 불일치

- **Minor** · 착수 시 `plan.md`의 계정 이메일 문구는 미연결처럼 읽혔다. 현재 route와 DEV-38 증거를 확인하고 기존 줄의 계정 부분만 갱신했다.

### 개발자 확인 필요 사항

서버와 제품/개인정보 소유자의 결정을 기다리는 항목은 [재개 조건](../tasks/POL-18.md#pol-18-contract)에 있다. 공통 하네스·아키텍처의 새 승인 항목은 없다.

### 추천 수정 방향

탈퇴 기능은 소유 계약에 대응하는 실행 증거와 화면 결정이 확보될 때 후속 Task의 자체 Gate에서 판단한다.

## 초기 독립 검토

- **PASS** · 결정 대기 Markdown 2개의 근거와 상태만 검증했다. 검토 diff SHA-256 `f5e6d101110ae3c280458d01796ac48bae28fffce641fcd300ff656e278a196c`.
- Blocker/Major/Minor 각 0건. `git diff --check`와 `verify.py pending`에서 로컬 링크 513개, 원본 79개·Task 114개·의존성 156개, 442개 노드·313개 파일의 기준선 및 기존 QA를 확인했다. OpenAPI 184개 path와 상태/명령 구분도 독립 확인했다.
- 이 판정은 조사 체크포인트를 대상으로 한다. 사용자 답변 및 인계 반영 뒤 별도 검토를 수행한다.

## 사용자 답변 반영 후 문서 검증

| 검증 | 결과 |
| --- | --- |
| `python3 /tmp/mate-pol18.GkhBu1jp/verify.py handoff` | PASS · Markdown 9개와 로컬 링크 1,100개, 원본 ID 79개·작업 114개·의존성 156개, 상태 집계/비순환·선행, 원본 442개 노드·313개 파일 스냅샷과 기존 QA 접두 보존, 추가분 민감 literal·Markdown 검사 |
| `git diff --check` 및 `git diff --check 14661ce` | PASS · 문서 변경 공백과 확인 기준 대비 범위 |
| 개발 Swagger/OpenAPI `curl` 및 JSON 검사 | HTTP 200, 184 paths·209 operations, [조사 지문](../tasks/POL-18.md#pol-18-investigation) 일치. 회사 leave·사업자 연결 해제·logout 계약과 확인한 계정 탈퇴 공백 기록 |
| 제품·브라우저·실제 API | 문서 전용 변경으로 로컬 `pnpm test`, `pnpm lint`, `pnpm build`, Storybook, 브라우저, mock/HTTP 대역 미실행. 실제 탈퇴 WDRAW 9개도 모두 미실행. PR 검사 결과는 최종 head에서 별도로 확인한다. |

검사 도구 준비 중 WBS 검사에서 상태 열 인덱스를 교정했다. 게시 명세에서 `deactivate`가 검색됐고 공고 알림 해제로 확인해 검색 결과를 문맥으로 재검증했다. 자료나 제품 동작 변경은 없었다.

## 사용자 답변 반영본의 독립 verifier

### Result

PASS · 조사 문서 전달 범위

### Summary

D1·D3의 서버 책임과 D2 보류, POL-18의 재개 조건, DEV-39/40의 선행 대기 및 다음 후보 선정 근거를 확인했다.

### Issues

Blocker 0건, Major 0건, Minor 1건. 전용 인증 또는 철회 구현이 선행 조건으로 오독될 수 있는 문장에서, 지원 결정을 먼저 하고 지원 시 계약을 확인하도록 정리했다.

### Verification

`verify.py handoff`, diff 검사, WBS의 상태와 다음 후보 검사를 독립 실행했다. 중앙 정책·backend GitHub와 CI/배포, 개발 OpenAPI 184 paths 및 지문을 재확인했다. OpenAPI `urllib` 조회는 403이었고 `curl`로 HTTP 200과 같은 원문을 얻었다. 실행 중인 서버 버전·실제 탈퇴 QA는 미확인이다.

### Documentation Update Check

WBS·Task·coverage·QA·공통 계획과 검토 기록이 현재 Scope를 설명한다. 배포·패키지·앱 구조·데이터 계층 구현·하네스 변경은 없다. 기존 출력 예방 규칙이 있어 공통 실패 규칙을 추가하지 않았다.

### Review freshness

답변 반영본의 최초 검토는 tracked diff SHA-256 `358bdee4cfe9816d9447c9a595842ce879b6c34fd9fa31000044b22d1ebcca30`, 당시 미추적 검토 파일 SHA-256 `f4ce64337d79343ee649225d83a1cc299a4c1d0242557ba32851b0afe78eed07`에 적용됐다. Minor 수정과 이 검토 기록 추가분을 포함한 전달 diff는 커밋 전에 재검증·재검토한다.

### Developer follow-up

탈퇴 전용 계약, 지원되는 인증·철회의 조건과 화면, 데이터 보존/파기와 재가입 기준이 도메인 재개에 필요하다. [재개 조건](../tasks/POL-18.md#pol-18-contract)

## ai-review

### 1. 리뷰 요약

사용자 답변·현행 Git/소스·디자인 노드·개발 명세와 9개 문서의 변경을 대조했다. 문서 범위 PASS다. POL-18 정책 Gate의 차단과 문서 전달은 각각 판정한다.

### 2. 발견된 문제

처음 독립 검토의 Minor 1건에 따라 재인증·철회 지원 결정과 지원 시의 계약 확인을 분리했다. 교정본에 남은 Blocker·Major·Minor는 없다.

### 3. 누락된 검증

문서 링크·원본/상태/선행·범위·diff 검사는 통과했다. 실행 식별자와 실제 업무 응답, 전용 인증·철회와 파기 및 브라우저 QA는 미확인이다. 스크립트·제품 영향이 없는 로컬 앱 명령과 실제 계정/회사/자료 처리는 수행 범위 밖이다.

### 4. 문서 갱신 필요 여부

WBS, 정책 Task 및 후속 기록, S03/C02 연결, WDRAW 계획·공통 계획과 검토 기록을 갱신했다. `base.md`, `architecture.md`, `data-access.md`, `harness.md`, `ai-failures.md`의 스택·구현·규칙에는 이번 수정 사항이 없다.

### 5. 개발자 확인 필요

사용자 D2의 인증·화면 보류를 적용했다. 서버·제품/개인정보 담당의 구체 판단은 정책 재개 시 확보한다. 조사 문서 검토에 추가 결정은 없다.

### 6. 추천 수정 방향

재개 시 백엔드의 확정된 자격·처리·결과와 승인된 화면 상태를 연결하고, 실제 검증에는 사용·폐기/복구 범위를 정한 합성 자원을 확보한다.

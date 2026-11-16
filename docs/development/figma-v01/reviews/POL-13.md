# POL-13 · 정책 문서 검증·Review Gate

[WBS](../README.md) · [Brief/사용자 결정](../tasks/POL-13.md#pol-13-brief) · [소스 정책](../tasks/POL-13.md#pol-13-contract) · [DBOX 미실행 계획](../../../qa/company-documents.md#pol-13-document-qa)

## 검토 범위와 증거

- 2026-11-16 KST, 기준 `ba1c63bd20cde2a2b74f073460c08ca868a8a770`의 문서11개. 정책·후속 기준·미실행 QA/진입점·검토/종료 기록만 포함한다. 제품/패키지/실제 업무 API·파일 처리는 변경0이다.
- backend dev/main·중앙 정책 ref, 개발 OpenAPI GET200·8경로/10operation, 해당 dev SHA의 배포 run success와 MAT-162 기획 보류/닫힌 PR을 확인했다. source/배포/게시 명세와 실행 SHA/실제 응답은 별개다.
- Figma10frame/6하위 metadata를 선별했다. screenshot 다운로드4개가0byte여서 이미지/픽셀·제품 UI 검증은 하지 못했다. 메타데이터의 기본 component 문구를 실제 확정 문구로 사용하지 않는다. 시각 예외 승인 없음.
- 로컬 근거/검증 도구/독립 보고서는 [조사 폴더](/Users/jisung/.codex/visualizations/2026/11/16/01a1e21a-da95-7322-adf0-490b7be3d55f/pol13-evidence)에서 확인한다. 실제 서명 URL·원문/추출값·인증정보를 저장/출력하지 않는다.

## Context Audit Report

### 결론

PASS — 확인한 관련 source/문서·패키지/하네스의 사실 정합성. 전 앱/전 문서·제품/실제 API 통합 PASS를 뜻하지 않는다.

### 확인한 코드베이스 사실

- package.json: Next16.2.9/React19.2.4, pnpm11.3.0, Vitest4.1.11·Node pin22.20.0, 실제 scripts8개·별도 type-check/format 없음. 현재 shell Node26.5.0과 저장소 pin/CI를 구분했다. 이번에는 앱 명령을 실행하지 않는다.
- company contracts/client/HTTP는 가입용 문서 처리·opaque handle을 제공하고 가입 후 목록/티켓/삭제 공개 함수·제품 화면은 없다. 현행 backend 관리 API 존재를 frontend 구현 완료로 세지 않는다.
- 공개 client/server·7개 source·불변 snapshot·hybrid/운영 mock guard·계정별 storage·DTO/업로드 경계에 변경이 없다. 기존 미구현/실제 QA 차단은 유지한다.
- baseline/coverage·기존 가입/회사 QA·타 Task와 선행 이력은 보존하고 WBS가 유일한 현행 상태 원본이다. POL-13의 현재/종료와 다음 하나만 이번 Gate에서 다룬다.

### base.md

package.json/lockfile·.nvmrc·CI의 기록과 맞는다. 패키지/scripts·런타임 변경이 없어 수정 불필요하다. shell Node가 pin과 다르다는 관찰을 문서의 저장소 pin 오류로 취급하지 않는다.

### architecture.md

확인한 my route/company data/가입 문서 구조·읽기 전용 UI와 일치한다. 폴더/API/mock/component 규칙이나 실행 소스 변경이 없어 수정 불필요하다.

### data-access.md

가입 Document 포트·서명 비공개/opaque handle·sessionStorage 격리와 현행 미연결 관리 기능을 구분했다. 7그룹/운영 guard·fallback 금지·실제 통합 별도 규칙을 유지해 수정 불필요하다.

### plan.md

POL-13 날짜별 정책/후속 Gate·DBOX 계획 링크를 추가한다. 기존 POL-12/등록/QA 이력은 보존하며 현행 상태는 WBS에 위임한다.

### harness.md

세 Skills·verifier.toml·placeholder config의 존재/흐름을 확인했다. 문서 대체 검증·두 리뷰/freshness·하나만 인계 규칙을 적용하며 config/skill/agent 변경은 없어 수정 불필요하다.

### ai-failures.md

기존 Git/PR/Figma 출력 경계의 재발 방지 규칙을 확인해 결과를 필요한 필드로 투영했다. 새 비밀/개인정보 출력이나 재발 방지 규칙을 요구하는 제품 검증 실패 근거는 없으므로 추가하지 않는다. 일시적인 patch 문맥/도구 조회 오류와0byte screenshot은 제품/문서 검증 PASS로 숨기지 않으며 수행 한계로 분리한다.

### 발견된 불일치

- 새 Major/Minor 사실 불일치 없음. 10/27 관리 계약 부재는 역사적 frontend 기준선이며 현재 backend API 부재 설명으로 쓰지 않는다. MAT-162·신규 문서 회사 귀속/최종 적용·실제 QA는 계약/제품/자원 후속 Gate다.

### 개발자 확인 필요 사항

이번 정책은 사용자 D1/D2/D3로 해소했다. 후속 자체 Gate의 문서 날짜 제공 방식·회사 귀속/최종 적용 계약·실제 합성 자원은 이 작업의 신규 정책 미결로 대체하지 않는다.

### 추천 수정 방향

정책/지원 범위·선행/보류·미실행 QA와 실제 Git 전달을 분리해 기록한다. 관련 없는 context나 제품 소스를 수정하지 않는다.

## 문서 검증·Documentation Update Check

- 실행: [validate_docs.py](/Users/jisung/.codex/visualizations/2026/11/16/01a1e21a-da95-7322-adf0-490b7be3d55f/pol13-evidence/validate_docs.py)의 링크/anchor·79개 원본/114Task/156의존·상태/DAG·baseline/기존 QA·추가 Markdown·범위·소스 blob 검증과 `git diff --check`21/21 PASS. Git blob26개 검증, baseline/기존 QA/config10개 hash 보존, DBOX22/114Task/156선행/79원본 확인. 자동 문서 수정1/3(DEV-26 인계 순서) 후 재통과했다.
- 로컬 앱 test/lint/build/Storybook·mock/HTTP 대역/실제 앱 브라우저/API 통합은 미실행: 실행 소스/패키지/빌드 영향이 없는 정책 문서 작업이다. 실제 통합 DBOX22는0통과·22대기/미실행이며 원격 CI는 최종 PR head로 따로 확인한다.
- 갱신: WBS/POL-13·DEV-22~26·QA 계획/진입점·plan·이 검토. base/architecture/data-access/harness/ai-failures는 위 점검에 따라 유지한다. coverage/의존성/Task 수·baseline 변경 없음.

## ai-review

### 1. 리뷰 요약

PASS — 원본 요구사항/사용자3결정·성공 기준·git status/diff·관련 source/OpenAPI·package.json과 문서 검사21/21을 확인했다. 문서11개는 POL-13 정책/후속 기준에 한정하며 제품/실제 통합 완료를 주장하지 않는다.

### 2. 발견된 문제

미해결 Blocker/Major/Minor 없음. 최초 검사20/21의 DEV-26 인계 위치를 기존 POL-12 기록 뒤로 이동한 후21/21 재통과했다. 실제 API/이미지 미검증은 아래 범위 제한이며 제품 PASS로 확대하지 않는다.

### 3. 누락된 검증

제품/실제 API 통합과 Figma 이미지/전체 시각 검증은 미실행이다. 정책 문서의 검증 범위와 구분한다.

### 4. 문서 갱신 필요 여부

계획한 문서11개를 반영했다. base/architecture/data-access/harness/ai-failures·baseline/coverage/기존 QA는 보존한다. 종료 상태/인계 추가 후 문서 검사·두 리뷰 freshness를 다시 확인한다.

### 5. 개발자 확인 필요

정책3결정 확보. 기존 회사 귀속/최종 적용·실제 자원은 후속 자체 Gate이며 이번 Git 전달 승인과 별개다.

### 6. 추천 수정 방향

현재 정책/지원·계약 대기 분리를 유지한다. 독립 verifier 결과를 반영하고 종료/다음 하나 인계 후 최종 diff의 검사·두 리뷰를 재실행한다.

## 독립 verifier와 freshness

원본 요청/성공 기준·현재 status/diff·package.json·고정 source/OpenAPI·문서 검증 출력으로 read-only 검토한다. 1차는 PASS이며 아래 결과를 보존한다. 종료 기록/WBS·다음 인계 변경을 포함한 최종 diff는 추가 문서 검사·ai-review·같은 read-only verifier의 freshness 재검토 대상이다. 실제 최종 결과는 로컬 보고서와 PR/최종 보고에서 확인한다.


### 1차 독립 verifier 결과 · 2026-11-16

- Result: **PASS**. Summary: 사용자3결정/성공 기준·문서11개와 현행 고정 source를 대조했고 접근·기간 결측·버전·삭제/파기·지원/대기 구분이 일치한다.
- Issues: Blocker/Major/Minor 없음. Figma 이미지/픽셀·제품/실제 통합 미실행은 명시된 범위 한계다.
- Verification: git status/HEAD·실제 diff/stat·신규 문서·package.json/검사21/21·diff-check를 확인했다. 별도 읽기 전용 검사로 보호10파일·DEV 이력·Git blob26개·QA22·OpenAPI8경로/10operation/기간 필드를 재확인했다. 앱 명령 미실행 사유는 타당하다.
- Documentation Update Check: 계획한 정책/후속/QA/진입점 갱신 적절, 추가 base/architecture/data-access/harness/ai-failures 수정 근거 없음. 종료/다음 하나·결과 기록은 후속 단계다.
- Review freshness: 당시11파일 결합 SHA-256 `074088016b5b88011bb705fcdf6c533c5e600d08e5177080aba3ad18bd4691f5`. 이 보고서는 해당 diff 한정이며 verifier는 파일 수정0이다. 이후 종료 변경을 다시 검토한다.
- Developer follow-up: 이번 정책 추가 확인 불필요. 기존 회사 귀속/최종교체/OCR·실제 QA 자원은 후속 Gate이며 다음 실행/이전 예외 확대 없음.

### 종료 기록·최종 freshness 확인 범위

- WBS에 POL-13 정책 단위 완료/현재 없음·DEV-22 준비 하나와 선정 근거/첫 행동을 남겼다. DEV-22 자체 Gate/조사/제품/실제 API·Git 전달은 시작하지 않았다. 상태 집계30완료/22차단/59대기/1준비/2보류·총114, 의존성156/원본79는 동일하다.
- 종료 체크리스트/기록을 추가했으므로 문서 검사 final 모드와 ai-review·독립 verifier를 다시 수행한다. 이 아래/외부 최종 보고의 검증 결과 없이 PR/CI/병합 완료를 미리 주장하지 않는다.
- Git 전달은 정책 결정/제품 구현/실제 통합과 별개다. 이번 Chromatic 월간한도 예외만 적용하고 정상 merge commit으로 작은 커밋을 보존한다. 최종 PR/head·CI·main 일치/작업트리/실제 SHA는 최종 보고와 [전달 receipt](/Users/jisung/.codex/visualizations/2026/11/16/01a1e21a-da95-7322-adf0-490b7be3d55f/pol13-evidence/delivery-receipt.json)에서 확인한다.

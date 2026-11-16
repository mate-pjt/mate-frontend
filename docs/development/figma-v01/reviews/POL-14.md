# POL-14 검증·검토 기록

[정책 작업/조사](../tasks/POL-14.md#pol-14-investigation) · [현재/다음/상태의 단일 기준 WBS](../README.md)

## 검토 범위와 증거 경계

2026-11-16 사용자 최초 요청의 POL-14 정책 조사/결정·후속 기준/QA 계획·문서 검증/두 리뷰/Git 전달만 대상이다. 제품/실제 업무 API·초대/메일/권한/직급 변경·운영/배포0이며 다음 Task는 선정/인계만 한다. 기존 QA-08 AUTH-16 실제0통과1차단·초대 AUTH-17 미실행과 모든 이전 QA/승인 예외를 보존한다. 현재 Git 전달은 실제 PR/최종 head에서 확인한다.

- 시작 main/기준 diff: `960fb14d1a38b19b7bd64942e52c4bf3da19fd8c`, 깨끗한 작업트리에서 `docs/pol-14-team-policy` 생성. 무관한 변경0·reset/stash/직접 main push0.
- source/배포/게시 명세/실행 응답을 [조사 표](../tasks/POL-14.md#pol-14-investigation)에서 분리했다. 32경로37operation/67schema는 공개 게시 계약의 조사 범위이며 실제 통합 검증 수가 아니다.
- Figma 원본12frame은 metadata/상태·라벨 대조다. 픽셀/브라우저 구현 검증은 하지 않았다. 예시 개인정보를 산출물에 복사하지 않았으며 아래 출력 사건을 공개한다.
- GitHub 작성자 메타데이터·첫 Figma 예시 필드의 원문 출력 사건은 Task에 기록하고 후속 출력에 허용 필드 경계를 적용했다. 기존 출력 삭제·무노출을 주장하지 않는다. env/credential·업무 계정/응답 조회는 없었다.

## Context Audit Report

### 결론

PASS — 조사한 현행 코드/하네스와 ai-context 사이에 이번 작업을 막는 사실 불일치 없음. 정책 채택/화면 예외의 사용자 답변 대기는 사실 불일치와 구별한다. 이 판정은 제품/통합 PASS가 아니다.

### 확인한 코드베이스 사실

package.json의 pnpm11.3.0·Next16.2.9/React19.2.4·8scripts, lockfile과 `.nvmrc`22.20.0·strict TypeScript를 직접 확인했다. 실제 shell Node26.5.0은 pin/CI Node22.20.0과 구별하며 이 문서 작업에서 앱 실행환경을 바꾸지 않았다. team 메뉴 disabled/팀원 route·관리 Repository 포트 미연결과 현재 backend/게시 API 존재는 별개다.

### 문서별 정합성 점검

- **base.md:** 현재 dependencies/packageManager/scripts·누락된 standalone type-check/format·워크플로와 일치. 이번 패키지/실행 명령 변경 없음.
- **architecture.md:** App Router·my/components/features/data 경계와 현재 문서/계정 화면·팀원 준비 중 구조가 일치. backend source 존재만으로 프론트 구현 완료를 만들지 않음.
- **data-access.md:** 7개 선택 그룹과 별도 static qna, public client/server, config snapshot·운영 guard·sessionStorage 격리·HTTP/DTO/upload 비공개 경계를 확인. 팀원은 후속에 동일 company 그룹으로 설계할 대상이며 현재 API/mock 데이터 흐름 수정 없음.
- **plan.md:** WBS가 현행 상태를 소유하고79개 원본·114Task/156의존을 보존한다. 날짜별 과거 상태는 이력이며 이번 정책 milestone 연결 필요 여부를 Documentation Update Check에서 판단한다.
- **harness.md:** 실제3Skill·verifier 역할 파일·placeholder config와 일치. 이번 새 agent/skill/hook·하네스 동작 변경 없음.
- **ai-failures.md:** 기존 raw GitHub metadata 출력 방지 규칙을 뒤늦게 적용해 이번에 재발한 사실을 확인했다. 원문을 재인용하지 않고 재발과 Figma 예시 필드 요약 경계를 기록한다. 새 제품 정책/하네스 변경은 아니다.

### 발견된 불일치

확인한 범위의 Major/Minor 사실 불일치 없음. Figma 생일/전화 필드와 대표자 일괄 금지 안내·만료 재발송 노출은 Task의 사용자 결정 대상으로 구별했다. Node pin을 현재 shell 버전 관찰로 덮어쓰지 않는다.

### 개발자 확인 필요 사항

POL-14 D1~D3는 사용자 답변 대기다. 실제 QA 자원·실행 SHA 대응·사용/잔존/복구 범위는 후속 Task 자체 Gate이며 정책 문서 완료/로컬 선행 예외로 대신하지 않는다.

### 추천 수정 방향

승인된 범위만 Task·후속 기준·QA 계획과 WBS에 연결하고 기존 baseline/coverage·모든 QA/차단/예외를 유지한다. source/API/역할 해석을 바꾸는 제품 구현은 후속 별도 Gate다.

## 문서 검증

- 초기 조사 단위: `python3 /tmp/mate-pol-14/validate_docs.py` PASS. 변경2파일·로컬 링크/anchor428·원본79/Task114/의존156·baseline/coverage5파일 byte 보존·후속7기록 원문 보존·상태 집계/순환·허용 범위·민감 literal 검사. `git diff --check` PASS.
- source 대조 중 초안의 팀원 정렬을 실제 persistence의 joinedAt ASC/id ASC로 교정했다. 문서 링크 검사는 서버 의미를 보장하지 않으므로 source 대조와 분리한다.
- 로컬 앱 test/lint/build/Storybook·브라우저/mock/HTTP대역/실제 API 통합: 미실행. 실행 코드·패키지·설정 영향 없는 정책 문서 전용이며 공개 명세 GET은 업무 응답 QA가 아니다. 원격 CI는 최종 PR head에서 별도 확인한다.
- 최종 대상/검증·Documentation Update Check·두 리뷰·freshness·Git 전달 결과는 확정 산출물 검증 뒤 아래에 추가한다.

## ai-review · 조사 산출물 한정

### 1. 리뷰 요약

원본 요구·성공 기준, 현재 status/diff와 새 검토 파일, package.json, 실제 소유 프론트/backend/중앙 정책·개발 명세, 두 문서/계약 검사 결과를 직접 확인했다. 이번4문서는 조사 사실과 정책 답변 대기를 보존하는 중간 산출물이다. 확정 정책/제품/실제 통합·POL-14 전체 PASS로 판단하지 않는다.

### 2. 발견된 문제

현재 조사 문서 diff의 미해결 Blocker/Major 없음. source 대조로 팀원 정렬 초안은 joinedAt/id ASC로 교정했다. 원문 메타데이터 출력 사건은 재발 기록/후속 경계로 공개했고 기존 출력 삭제를 주장하지 않는다. 답변 없는 D1~D3를 확정하거나 후속 기능을 시작하면 범위/요구사항 위반이므로 Gate를 유지한다.

### 3. 누락된 검증

제품 코드/패키지/빌드 영향이 없어 로컬 앱 test/lint/build/Storybook·제품 브라우저/mock/HTTP대역은 미실행이다. 실제 팀원 API/메일·실행 SHA 대응·안전한 자원/권한/변경·잔존/복구는 미확인/미실행이며 이전 QA-08을 포함한 통합 차단은 유지한다. Figma는 metadata 대조이고 pixel/전체 prototype PASS가 아니다. 최종 정책 산출물과 원격 CI는 아직 검토하지 않았다.

### 4. 문서 갱신 필요 여부

WBS/Task·검토 보고와 ai-failures에 조사/승인 범위·미결·재개/출력 경계를 기록했다. base/architecture/data-access/harness는 실행 규칙·소스 구조·패키지/설정 변경이 없어 유지한다. D1~D3 확정 뒤 plan·DEV-27~33 인계/QA 계획의 필요 갱신과 최종 문서 검증/Review Gate를 수행해야 한다. 원본79/114Task/156의존·baseline/coverage·이전 QA/차단/예외는 보존됐다.

### 5. 개발자 확인 필요

D1 현행 leaf/capabilities·대상 동의 채택/DEV-28 포함, D2 생일/전화 미제공·대표자 행동별 안내 한정 화면 예외, D3 만료 후 새 초대 작성 기준은 사용자 답변 대기다. Git 전달/이번 Chromatic 월간 한도 예외는 이번 요청으로 이미 승인돼 반복 확인이 필요하지 않다.

### 6. 추천 수정 방향

정책 답변을 원문·날짜와 연결한 후 해당 선택만 확정하고 미지원 필드/API·명령·화면을 임의 만들지 않는다. 후속 개발/QA의 자기 Gate·실제 자원/실행 범위와 별도 POL-15 목적지 결정을 보존한다. 검토 후 문서 변경은 재검증/두 리뷰 freshness를 다시 확인한다.

## 독립 verifier · 1차 조사 한정

- Result: PASS — 조사4문서만. Task전체는 D1~D3 미결·확정 후속 기준/QA·최종검증/리뷰 전 완료 불가.
- source의 ASC/15leaf/행동가능·최후관리자/동의 무기한·초대 만료/DB 차이를 직접 대조했다. 문서 검사433링크·79/114/156·고정5/후속7·계약32/37/67·diff-check PASS, 앱/실제 통합 미실행 사유 확인.
- 조사 diff Blocker/Major 없음, Minor1: 축약된 source 경로 표의 재현성. 실제 backend tree의 고유 파일 경로를 확인해 모두 고정SHA permalink로 교정했다. 원문 출력 사건의 잔여 제한을 공개한 기록도 확인했다.
- 1차 뒤 조사 checkpoint/ai-review·정책 대기/WBS 상태와 위 링크 교정이 추가돼 최종 조사 diff를 다시 검토한다. 정책 답변 반영 뒤에는 확정 산출물의 문서검증/두 리뷰를 별도로 재실행해야 한다.

## Documentation Update Check · 조사 대기 시점

갱신은 WBS/Task·이 검토 보고/ai-failures4문서다. 원본/coverage·모든 후속 Task/기존 QA·base/architecture/data-access/harness/plan은 보존했다. 확정 정책 milestone/후속 기준/QA는 D1~D3 뒤에만 작성한다. 반복 출력 사건은 기존 규칙 아래 재발로 기록했고 실제 env/credential·업무 개인정보 응답을 읽거나 산출물에 복사하지 않았다.

## 전달 경계

이번 사용자 요청의 Git 전달 승인으로 조사 기록의 작은 commit/push·Draft PR와 CI 확인을 준비한다. D1~D3 및 최종 정책 문서/Review Gate가 남아 있어 Task전체 완료·ready/정상 main 병합 조건은 충족하지 않았다. Chromatic 월간 한도 예외는 이번 PR에만 적용하며 다른 실패/정책 미결을 면제하지 않는다. 실제 최종 head/검사·전달 결과는 PR/종료 보고에서 확인한다.

## 최종 조사 Review freshness

- 2차 read-only verifier: **PASS, 최신 조사4문서 한정**. source 링크29개가 고정 tree의 실제 경로와 일치해1차 Minor 해결, 새 Blocker/Major/Minor 없음. WBS 차단/집계와 동일 Task 재개, DEV-27 미실행·Draft/최종 완료 구분을 확인했다.
- 직접 재실행한 문서 검사4파일/437링크·원본79/Task114/의존156·고정5/후속7, 계약32경로/37operation/67schema·15leaf/행9/page3, diff-check 모두 PASS. 2차 대상 문서집합 SHA256 `ed139e1fb0846c2fb5f2092534131bad67e7f64fe2e1c86111897d4d0ddf104e`.
- 자체 ai-review도 source 링크·WBS 차단/집계·재개와 Draft 경계를 다시 읽었으며 위 여섯 섹션의 조사 한정 결론을 유지한다. Task 전체는 사용자3결정 전 미완료다.
- 이후 이 절은 실제 검토 결과/지문만 붙인 종료 metadata다. 정책·source 해석·범위/상태·승인/QA/재개 조건을 바꾸지 않아 두 리뷰를 재귀적으로 재실행하지 않는다. 문서 검사/diff-check는 다시 실행한다. 정책 답변·내용 변경 뒤에는 최종 산출물에 두 리뷰를 다시 실행해야 한다.

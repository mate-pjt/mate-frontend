# POL-29 · 정책 문서 검증·Review Gate · 2026-11-11

[WBS](../README.md) · [요구사항/결정·보류](../tasks/POL-29.md#pol-29-decisions) · [상태/검증 기준](../tasks/POL-29.md#pol-29-states) · [출처 지문](POL-29-sources.json) · [Context Audit](POL-29-context.md)

## 검증 범위와 증거

- 시작 clean main `f505421d6e5337ab3db4dac342d57bf18a948246`, fetch 후 origin/main과 차이0/0·QA-17 PR #50 반영. 작업 브랜치 `docs/pol-29-visual-policy`. 기존 다른 worktree/미커밋 작업을 이동·삭제·stash/reset하지 않았다.
- 실제 변경은 정책 기록·후속 후보/수용 기준·WBS/coverage/plan과 검토 출처 Markdown/JSON이다. 제품/테스트/패키지·환경/하네스·원본 baseline/감사/기존 QA는 변경하지 않았다.
- 저장소 밖 재현 검사: `/Users/jisung/.codex/visualizations/2026/11/11/mate-pol-29/validate-docs.py`. 시작 manifest/출처5개 정책·선택 source·OpenAPI·Figma metadata/대표 PNG8개와 지문, `validation.json`을 함께 보존한다. 지문은 비밀값/개인정보/단기 screenshot URL을 포함하지 않는다.
- 검사 명령 `python3 /Users/jisung/.codex/visualizations/2026/11/11/mate-pol-29/validate-docs.py` **PASS**: 원본79개/기존113Task 보존·총114Task/155의존성 무순환·현재 작업 하나·변경 허용목록·보호471파일·기존 후속 Task 본문 append-only·링크/anchor·Markdown/JSON·Figma8개 지문.
- `git diff --check` **PASS**. 추가 기록 뒤 같은 검사를 재실행하고 최종 수치는 로컬 validation/최종 보고에서 확인한다. 이 기록이 자기 자신의 마지막 diff를 검증했다는 뜻은 아니다.
- 현재 package.json의 scripts 8개와 `.nvmrc`/CI Node22.20.0을 확인했다. 셸 Node26.5.0/pnpm11.3.0을 관찰했으며 로컬 문서 검사는 Python/Git으로 수행했다.
- 로컬 `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm build-storybook`, 앱 브라우저·mock/HTTP대역·실제 업무 API 통합은 **미실행**: 실행 코드/패키지/build 영향 없는 정책 문서 작업이다. Figma screenshot 조회는 제품 UI/실제 통합 PASS가 아니다. 원격 CI는 최종 PR/head에서 별도 확인한다.
- Context Audit **기존 제품/정책·DESIGN 드리프트 FAIL**을 별도 보존한다. 이번 문서 변경의 검토 판정과 구분하며 DEV-59/60/61/63/65·DEV-09/41/62·POL-30과 기존 실제 QA의 차단을 완료로 바꾸지 않는다.

## AI Review

### 1. 리뷰 요약

**PASS — 이번 정책 기록/인계 문서 범위.** 원본 요구사항·사용자 답변 원문/철회·고정 source/정책·Figma 실제 node/크기/대표 시각·package scripts·git status/diff와 검사 결과를 대조했다. D1 승인, D2 이름+아이콘 교정, D3 Figma3항목/미지원 disabled·tooltip 결정을 개별 기록했다. 일반 마이페이지 대체·공개 목록 CTA·이메일 스위치만 남기는 최초 추천을 승인으로 기록하지 않았다.

### 2. 발견된 문제

이번 변경에 미해결 **Blocker/Major 없음**. verifier의 Minor1(빈 COMPANY_DEFAULT의 수동 적용 불가 조건)을 명확히 보완했고 후속 재검토 대상으로 포함했다. 기존 제품 정책/문서 드리프트는 Context Audit과 기존 소유 Task에 그대로 남긴다. 이름 공급원/명시적 fallback, 홈 최종 안내 문안은 미확정으로 후속 Gate에 보류했다. 이 보류를 승인된 문구/현행 화면 PASS로 세지 않는다. disabled preview는 전역/야간 도메인 기능·실제 API 계약·미래 자동 활성화의 승인과 구분했다.

### 3. 누락된 검증

문서 전용 계획의 누락 없음. 앱 자동/실제 브라우저·mock/HTTP 대역·실제 업무 통합은 미실행이며 계획된 문서 검사로 대체했다. source/schema 관찰을 실행 중 SHA/업무 응답으로 주장하지 않는다. 향후 제품 변경 시 해당 자동/브라우저/통합 Gate는 그대로 필요하다. 최종 PR/head 원격 CI/리뷰·병합/동기화는 이 로컬 검토 이후의 전달 단계다.

### 4. 문서 갱신 필요 여부

POL-29·DEV-55~58/64·POL-19/DEV-41 인계, 새 DEV-66 정의, WBS/coverage/plan과 출처/Context Audit/본 검토를 갱신했다. 원본79개/기존113Task와 날짜별 QA/감사·승인 예외를 보존했다. base/architecture/data-access/harness는 실행/구조/계약/하네스 사실 변경이 없어 미갱신, ai-failures는 새 반복 제품/하네스 실패가 없어 미갱신이다.

### 5. 개발자 확인 필요

이번 문서 전달의 Git 승인은 현재 요청에 이미 있다. 같은 승인을 다시 받지 않는다. 향후 이름 계약/시안, 홈 문구/표시 위치, 전역/야간 활성화의 도메인/서버 계약과 실제 QA 자원은 소유 Task의 Gate에서 확인해야 한다. 사용자·조직의 담당 개인을 임의 배정하지 않았다. 원격 CI 차단이 생기면 해당 PR/head의 새 근거와 최소 결정만 요청하며 PR #49 등의 예외를 확대하지 않는다.

### 6. 추천 수정 방향

이 문서 범위의 추가 제품 수정 없음. 독립 verifier와 종료 메타데이터 freshness를 확인한 뒤 목적별 한국어 Conventional Commits/PR·최종 head CI·허용 병합 방식·로컬 main fast-forward를 수행한다. 후속 개발은 이번 대화에서 실행하지 않는다.

## 독립 verifier와 freshness

read-only verifier 1차 **PASS**: 실제15파일/관련 source·정책·Figma/검증을 독립 확인했고 Blocker/Major0·Minor1을 보고했다. 코드/문서는 수정하지 않았다. 첫 파일별 정렬 manifest 지문은 `23bb9c15e3bdaac88fec8e9151a940413ddff938a3656cd3fd33be38c8edc44c`다.

이후 Minor 보완, 체크리스트/WBS 종료·이름/문구 재개 차단·DEV-65 다음 선정과 본 검토를 갱신했다. 문서 검사/6항목 ai-review를 재실행하고 동일 verifier의 최종 freshness 재검토를 요청한다. 최종 raw 보고서/manifest는 저장소 밖 `verifier-final` 기록 및 최종 보고에서 확인한다. 이 사전 문구를 재검토 자체의 완료 증거로 세지 않는다.

## Git 전달·복구 구분

실제 PR/head/CI·병합 commit·main 동기화는 실행 후 저장소 밖 delivery receipt·PR/최종 보고에 기록한다. 이 사전 기록을 Git 전달 완료로 세지 않는다. 소유 앱 서버·업무 API/계정·메일/파일/운영 데이터 변경은0건이므로 원복할 업무 데이터/실행 프로세스가 없다.

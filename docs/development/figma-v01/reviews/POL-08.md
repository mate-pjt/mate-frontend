# POL-08 · 문서 검증과 Review Gate · 2026-11-13

## 대상과 판정 경계

- [원본 요구/최종 Brief](../tasks/POL-08.md#pol-08-brief)·[사용자 확정 정책 v1](../tasks/POL-08.md#pol-08-contract). 동일 번호의 수집 차수, 대상 공고 전체로 같은 탭 이동/뒤로 가기, 전용 backend 계약 선행이 확정 범위다.
- clean main `145324ee551f7b24c555d0d21ebe5dcb7f5eb79e`에서 `docs/pol-08-correction-history-policy`를 만들었다. 선행 DOC-001/DEV-11 PR #64 반영·기존 dirty/같은 Task branch 없음. 이번 변경은 Markdown/출처 JSON뿐이다.
- [고정 source24개·OpenAPI/제한된 GET 근거](POL-08-sources.json), [선별 Context Audit](POL-08-context.md), [DEV-13 재개 기준](../tasks/DEV-13.md#dev-13-pol-08-handoff)을 대조한다. 기준선/감사·원본79/Task114/의존성155와 기존 QA/차단/승인 예외를 보존한다.
- 전용 API 계약/제품 구현/실제 복수 차수 통합은 미완료다. 사용자 보고의 backend 요청 발송을 접수/납기/구현/배포 완료로 취급하지 않는다. 이번 Git/Chromatic 월간 한도 예외만 적용하며 정상 보호/다른 CI/QA를 우회하지 않는다.

## 검증 기록

- `python3 /tmp/mate-pol08-20261113/verify-docs.py`: 조사4파일 PASS 후 최종 정책9파일에서 coverage 과거 본문 뒤가 아닌 중간에 새 문단이 들어간 prefix 보존 검사1건 FAIL. 신규 문단을 파일 끝으로 옮긴 최소 수정1회 후 **PASS**. 원본79/114Task/155의존성·상대 링크809·보호10범위를 확인했다. 최종 종료/인계 metadata까지 다시 실행한다.
- `git diff --check`: PASS. 링크/anchor·Task ID/선행/순환·활성 상태·기준선/감사/기존 QA prefix·scope·표/코드 fence/개행·추가 비밀값 패턴을 검사한다. 신규 파일도 최종 diff에 포함해 검토한다.
- package.json의 실제8scripts와 pnpm11.3.0을 확인했다. `.nvmrc`/CI Node22.20.0과 이번 셸 Node26.5.0을 구분한다. 실행 코드·package·빌드·Storybook 영향0이므로 **로컬** pnpm test/lint/build/build-storybook·제품 브라우저·mock/HTTP 대역은 미실행이다. backend 테스트도 source만 읽었다. 원격 CI의 실제 실행은 최종 PR/head에서 별도로 확인한다.
- 개발 OpenAPI GET200·3.1.0/`v1`과 공개 입찰10경로, 추가 공개 업무 GET3건의200/`isSuccess=true`를 확인했다. no-view 목록에 마감/취소 포함, 번호2검색은 각 단일 차수·hasNext=false다. 이는 계약 조사이며 복수 차수/페이지/오류·제품 선택/복귀 통합 PASS가 아니다. 로그인/인증 조작·mutation·서비스/수집/DB 변경0, 읽기용 탭 닫기 완료다.
- 자동 문서 수정1/3. 도구 출력 선별 누락·전용 endpoint 부재 확대 해석은 [실패 기록](../../../ai-context/ai-failures.md#pol-08-output-projection)과 [설명 정정](../../../ai-context/ai-failures.md#pol-08-endpoint-inference)에 기록했다. 원문 값은 재인용하지 않는다.

## Documentation Update Check

- 갱신: Task/DEV-13·WBS/coverage·기존 상세 QA의 후속 기준, plan의 정책 진입점, ai-failures의 실제 사건2개, source/context/이 검토 기록. 기존 QA 본문과 기존 결정·원본/감사 이력은 보존한다.
- 미갱신: base(패키지/scripts/Node pin 동일), architecture(제품 구조/스타일/동작 동일), data-access(새 Repository/DTO/공급원 규칙 구현 없음·기존 guard/fallback 경계 유지), harness(역할/설정/흐름 변경 없음).
- 이후 전용 API의 실제 path/query/schema/오류/페이지·현재/이전 관계/실행 대응은 DEV-13 자체 Gate에서 확인한다. 미확정 wire를 이번 문서로 승인하지 않는다.

## AI Review

### 1. 리뷰 요약

**정책/문서 diff 검토 PASS.** 원본 요구·사용자 Q1~Q3·git status/stat/diff·package scripts·관련 frontend/backend source·검증 결과를 대조했다. 전용 계약 선행을 명시하며 제품 구현을 추가하지 않았다. 초기 설명과 조사 가능성, 최종 사용자 결정을 구별한다. WBS 종료/다음 인계를 포함한11파일도 영향 재검토했으며 새 문제는 없다. 이후 PR metadata도 변경 후 검토한다.

### 2. 발견된 문제

미해결 **Blocker/Major/Minor 없음**. 사전 독립 검토의 V2 SQL source 오분류와 초기 Context Audit 설명 Minor는 교정했다. raw sourceKey 보존/표시 문자열 역파싱 금지는 정책·DEV-13/HIST-06에 반영했다. coverage prefix 검사 실패도 새 문단 위치만 고쳐 해소했다. 초기 불필요 metadata/연락처 예시 출력은 공개/예방 기록을 남겼고 기존 출력이 삭제됐다는 주장은 하지 않는다.

### 3. 누락된 검증

문서 범위의 계획 검사는 수행했다. 영향 없는 로컬 앱 검사/제품 브라우저는 위 사유로 미실행이다. 실제 전용 계약·복수 차수/페이지·오류/선택·복귀 검증은 미실행이며 DEV-13 재개 조건이다. 공개 GET3건이나 mock 이력을 그 대신 PASS로 사용하지 않는다. 기존 QA-03 실제1통과8차단·DETAIL-04/타 Task의 차단·예외를 유지한다.

### 4. 문서 갱신 필요 여부

이번 정책·source/제한 응답·승인/보류 이유·후속 재개 기준은 위 문서에 반영했다. 상태는 WBS만 관리한다. Gate 후 POL-09 인계와 WBS/검토 결과만 추가했고 문서 검사·자체 영향 검토를 다시 수행했다. 공통 실행/구조/데이터/하네스 규칙의 추가 수정은 필요 없다.

### 5. 개발자 확인 필요

이번 정책 문서·Git 전달 범위에 추가 결정 요청은 없다. 전용 API의 실제 계약/접수·배포/실행 대응·합성 fixture는 후속 필요 자료이며 아직 확보하지 않았다. backend 요청은 사용자 발송 보고이고 외부 메시지를 이번에 보내지 않았다. 이번 Chromatic 월간 한도 문제만 예외이며 다른 CI 실패는 별도 원인을 확인한다.

### 6. 추천 수정 방향

전용 계약 선행·기존 목록 재사용 미채택·표시 문자열/이력 추정 금지·계약 조사와 통합 QA 구분을 유지한다. 문서/독립 Review Gate를 통과하면 목적별 커밋·PR의 실제 최종 head CI/리뷰·정상 merge와 로컬 main 동기화를 수행한다. 다음 Task는 하나만 선정/인계하며 DEV-13 또는 다른 기능을 시작하지 않는다.

## 독립 verifier / freshness

- 사전 조사 검토: **PASS — 사실 결론만**. no-view 목록 경로·차수별 저장/조회·부분 검색/공개/페이지를 확인했다. 최종 정책 Q1은 당시 미결이었고 이 결과를 최종 Task PASS로 사용하지 않았다.
- 최종 정책 diff: **PASS**. 원본 요구/사용자 최종 Q1~Q3·전체 변경10파일·현재 source/검증 결과를 독립 대조했다. Blocker/Major/Minor0, 사전 Minor/raw sourceKey 교정 반영 확인, 문서 검사816링크·diff-check PASS. 검토 diff SHA-256 `32754e8e70a0f1d0b97df5a54ffce4e25bab3df5d32ddc9a58198fe565237bf4`에 한정한다.
- 이 Gate 후 WBS/체크리스트 종료와 POL-09 선정/인계만 추가했다. 목적/정책·실제 API 판정은 변경하지 않았다. 종료11파일을 문서 검사와 read-only verifier·ai-review 영향 재검토에 포함한다. 이후 최종 원문/해시·Git receipt는 저장소 밖 `/tmp/mate-pol08-20261113`과 실제 PR/최종 보고에서 확인한다.
- 종료11파일 문서 검사 재실행 **PASS**:79원본/114Task/155의존성·833상대 링크·보호10범위, 완료21/차단23/대기67/준비1/보류2. `git diff --check`와 자체 ai-review 영향 재검토도 PASS다. 독립 verifier의 종료 diff freshness 원문은 최종 receipt와 함께 보존한다.
- Review Gate 이후 변경은 영향을 확인해 재검증/재검토한다. PR/head·CI/merge/main 결과는 실제 원격 상태/최종 receipt와 보고로 확인하며 미래 성공을 미리 쓰지 않는다.

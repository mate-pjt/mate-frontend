# harness.md

## Mate Codex AI Harness 사용법

1. 작은 요구사항 단위로 작업한다.
2. 기능 구현은 `$feature-workflow`로 시작한다.
3. 구현과 검증 후 Documentation Update Check를 수행한다.
4. Review Gate에서 verifier와 `$ai-review` 필요 여부를 판단한다.
5. 필요하면 verifier와 `$ai-review`를 실행한다.
6. verifier 또는 `$ai-review` 이후 코드/문서가 바뀌면 해당 검토를 다시 실행하거나, 재실행하지 않은 이유를 최종 보고에 남긴다.
7. 생략 가능하다고 판단되면 개발자 확인을 받는다.
8. 마지막에는 개발자가 직접 git diff를 확인한다.
9. 실제 API 브라우저 통합 테스트가 환경 사유로 미뤄지면 `docs/qa/README.md`의 기능별 펀치리스트에 Figma node, API, 단계, 기대 결과, 상태를 기록하고 `통과`로 표시하지 않는다.

## 권장 흐름

Figma v0.1 후속 작업은 [WBS](../development/figma-v01/README.md)의 현재/다음 작업 → 해당 작업 기록의 마지막 체크포인트 → 선행 결정/증거를 먼저 읽는다. 기준선과 최신 구현/배포를 구분하고, 요구사항 Gate·수정 대상/영향/검증 계획을 편집 전에 제시한다. 상태는 WBS 한 곳에서 관리하고 상세 결정/시도/재개 위치는 작업 기록에 남긴다.

```text
WBS 현재/다음 + 작업 기록/선행 조건 + 현재 git 상태 확인
→
$feature-workflow
→ pnpm test / lint / 구성별 build / diff-check 및 계획된 브라우저 QA
→ Documentation Update Check
→ Review Gate
→ verifier / $ai-review 또는 개발자 생략 확인
→ post-review 변경 시 재검토 또는 사유 기록
→ 작업 기록/기존 QA 증거 + WBS 완료/현재·다음 갱신
→ 개발자 직접 리뷰
```

여러 날에 걸친 중단/재개, 상태 정의, 차단/승인 예외, 문서 전용 검증은 [작업 운영 규칙](../development/figma-v01/workflow.md)을 따른다. 개발 작업은 검증·리뷰까지 한 단위이며 PASS 전 다음 기능으로 자동 이동하지 않는다. 기존 실제 QA의 환경 의존 예외를 다른 기능으로 확대하지 않는다. 문서 전용 검증은 실행 코드·패키지·빌드 영향이 없을 때만 적용하고, 앱 검사 미실행 이유를 기록한다.

## verifier 실행 권한

Review Gate에서 verifier가 필요하다고 판단되면 Codex는 별도 사용자 확인 없이 read-only verifier subagent를 실행할 수 있다.

verifier는 `.codex/agents/verifier.toml`의 역할 정의를 따른다. verifier는 원본 요구사항, 성공 기준, `git status`, `git diff`, 관련 코드, `package.json` scripts, 검증 출력만 근거로 판단하며, 개발자가 명시적으로 요청하지 않는 한 코드를 수정하지 않는다.

이 권한은 verifier에 한정한다. 일반 subagent 위임, 병렬 구현, 코드 수정 worker 실행은 이 문장만으로 자동 허용되지 않는다.

## Context Audit 실행 시점

`$context-audit`은 코드베이스와 `docs/ai-context` 문서 정합성을 읽기 전용으로 진단할 때 사용한다. 큰 기능 시작 전, PR 또는 commit 전, 여러 기능을 연속으로 구현한 뒤, 폴더 구조/scripts/하네스 구성이 바뀐 뒤, AI가 반복해서 잘못된 context를 참조하는 것처럼 보일 때 실행을 검토한다.

## 주의사항

- 한 세션에서 여러 기능을 구현하지 않는다.
- 검증 실패 시 자동 수정은 최대 3회까지만 허용한다.
- 공유 컴포넌트, 사용자 노출 UI, Figma/외부 스펙 해석, 다중 파일 변경은 verifier와 `$ai-review` 실행 대상으로 본다.
- `$ai-review`가 필요한 작업은 여섯 개 출력 섹션을 모두 포함한다. 단순히 Blocker/Major 없음으로만 요약하지 않는다.
- 개발자에게 보여주는 중간 보고, Review Gate 결과, 최종 보고는 별도 요청이 없으면 한국어로 작성한다.
- 인증·배포·환경 설정 정책은 사전 사용자 결정 또는 승인된 계획에 따라 진행한다. 이미 승인된 범위를 다시 임의의 승인 단계로 만들지 않는다. 실제 API mutation은 사용할 계정과 변경·복구 범위를 별도 승인받는다.

## Repository 검증 Gate

- 먼저 `data-access.md`와 개발 가이드를 읽고 같은 상태의 조회·변경이 같은 공급원 그룹인지 확인한다.
- Node 22.20.0, `pnpm test`(Vitest Node), `pnpm lint`, `pnpm build`, `git diff --check`를 실행한다. Storybook/공용 모델 영향 시 `pnpm build-storybook`도 실행한다.
- API, mock, hybrid의 설정 오류·의존 조합·운영 빌드/시작 guard를 확인한다. dev 설정 변경은 재시작, Preview는 재빌드한다.
- async Server Component는 Vitest만으로 PASS하지 않고 실제 Next 실행에서 static 페이지→목록→상세 및 하드 리로드를 확인한다.
- 전체 mock은 서버와 브라우저의 API/OAuth/업로드/첨부 외부 요청 0건을 확인한다. hybrid는 mock 선택 영역에서 외부 요청이 없는지 확인한다.
- 계약 테스트의 HTTP fetch 대역, mock 브라우저, 실제 API 통합의 결과·환경·증거·미실행 범위는 별도 기록한다. 이전 실서버 QA 대기는 그대로 유지한다.
- 저장소의 새로고침·계정 전환·손상·quota·초기화, upload handle의 계정 경쟁, mutation 성공 뒤 세션 갱신 실패를 포함한다.
- `docs/qa/repositories.md`를 이번 전환의 검증 기록으로 사용한다. 후속 기능의 실제 통합 펀치리스트는 `docs/qa/README.md`를 따른다.

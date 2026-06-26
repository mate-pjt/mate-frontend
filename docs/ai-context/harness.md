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

## 권장 흐름

```text
$feature-workflow
→ Documentation Update Check
→ Review Gate
→ verifier / $ai-review 또는 개발자 생략 확인
→ post-review 변경 시 재검토 또는 사유 기록
→ 개발자 직접 리뷰
```

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
- 인증, 배포, 환경변수 관련 변경은 사람 검토 없이 진행하지 않는다.

# Mate AI Working Guide

Mate 프로젝트에서 AI 에이전트는 기능을 바로 구현하지 않는다. 먼저 요구사항을 구조화하고, 설계와 검증 방법을 제시한 뒤 구현한다.

## Core Rules

- 한 번의 작업에서는 하나의 요구사항만 처리한다.
- 요구사항 구조화는 Gate다. 성공 기준, 범위, 관련 패턴, 검증 방법이 불명확한 blocking ambiguity가 있으면 설계로 넘어가지 않는다.
- 요구사항이 모호하면 최대 3개의 확인 질문만 한다. 각 질문에는 추천안을 함께 제시하고, 낮은 위험의 non-blocking ambiguity는 가정을 명시하고 진행한다.
- 구현 전 수정 대상 파일, 영향 범위, 구현 단계, 검증 방법을 먼저 제시한다.
- 기존 폴더 구조, TypeScript/React 스타일, Tailwind 토큰 사용 방식을 유지한다.
- 새 라이브러리는 개발자가 명시하지 않는 한 추가하지 않는다.
- 기존 프로젝트 소스와 현재 브랜치의 다른 작업을 임의로 되돌리거나 정리하지 않는다.
- 검증이 PASS되기 전에는 다음 기능으로 넘어가지 않는다.
- 기능 구현 후 문서 갱신 필요 여부를 확인한다. package/scripts는 `base.md`, 구조/API/mock/component 규칙은 `architecture.md`, 계획/상태는 `plan.md`, 반복 실수나 하네스 변화는 `ai-failures.md` 또는 `harness.md` 갱신을 검토한다.
- API, mock, DTO, 조회·변경 데이터 흐름을 설계하거나 수정하기 전에는 `docs/ai-context/data-access.md`를 확인한다.
- 코드베이스와 문서 정합성이 의심되거나 큰 작업 전후에는 `$context-audit`을 실행해 `docs/ai-context` 드리프트를 진단한다.
- 최종 PASS 전 Review Gate를 수행한다. verifier와 `$ai-review`가 필요하면 실행하고, 생략 가능하다고 판단되면 개발자 확인을 받는다.
- Review Gate에서 verifier가 필요하다고 판단되면 Codex는 별도 사용자 확인 없이 read-only verifier subagent를 실행할 수 있다. verifier는 검증 보고서만 작성하고 코드를 수정하지 않는다.
- verifier 또는 `$ai-review` 이후 코드/문서가 바뀌면 해당 검토를 다시 실행하거나, 재실행하지 않은 이유를 최종 보고에 명시한다.
- 개발자에게 보여주는 중간 보고와 최종 보고는 별도 요청이 없으면 한국어로 작성한다.
- secret, token, password, 개인정보, `.env` 실제 값을 요청하거나 출력하지 않는다.

## Workflow

기능 작업은 `$feature-workflow` Skill을 사용해 요구사항 구조화 → 설계 → 구현 → 검증 → 실패 시 수정 → 재검증 → 문서 갱신 체크 → Review Gate → PASS 순서로 진행한다.

PR 또는 commit 전에는 `$ai-review` Skill로 현재 변경사항을 검토한다. 독립 검증이 필요하면 `.codex/agents/verifier.toml`의 verifier 역할을 사용한다.

## Context Index

- [Base Context](docs/ai-context/base.md): 프로젝트 스택, scripts, 확인된 사실과 추정
- [Workflow Plan](docs/ai-context/plan.md): AI 기능 구현 하네스 흐름
- [Architecture Notes](docs/ai-context/architecture.md): 현재 소스 구조와 스타일 관찰
- [Data Access Guide](docs/ai-context/data-access.md): 조회 데이터 계층, mock 관리, 실제 API/DTO/Mutation 연결 규칙
- [AI Failure Log](docs/ai-context/ai-failures.md): 실패 기록 템플릿과 재발 방지 규칙
- [Harness Usage](docs/ai-context/harness.md): 하네스 실행 순서

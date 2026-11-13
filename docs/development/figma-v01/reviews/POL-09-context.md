# Context Audit Report

## 결론

**WARN — 선별한 문서/소스에 새 사실 드리프트는 없고, 후속 실제 계약/wire 확인은 남아 있다.** POL-09의 조사/정책 문서 범위에 한정한다. 제품 정합성·실제 API 통합 PASS가 아니다.

## 확인한 코드베이스 사실

- 시작 clean main `3fb4742`, DOC-001/POL-08 반영, 같은 Task/무관한 dirty 없음. 이번 branch는 `docs/pol-09-original-notice-policy`다.
- package.json은 pnpm11.3.0·Next16.2.9·React19.2.4·Vitest4.1.11과 실제8scripts를 유지한다. 독립 type-check/format은 없다. `.nvmrc`/CI pin은22.20.0이고 이번 셸26.5.0은 별도 환경 관찰이다.
- 상세 UI는 원문 링크·현장설명 필요 여부·일반 수집 안내를 표시한다. 공동수급 협정 마감은 이미 DTO→mapper→UI에 있다. 본문·현장설명 일시·전체 기준일/수집일은 현재 프론트 표시 모델에 없다.
- 출처는 [고정 중앙/백엔드 source와 개발 OpenAPI/Figma](POL-09-sources.json)다. source·배포 문서·실행 SHA/실제 응답·제품 통합을 별도로 판단한다.

## 문서별 정합성 점검

### base.md

현재 package/lockfile·8scripts·Node pin·placeholder config 설명이 일치한다. 셸의 Node26.5.0을 프로젝트 pin으로 바꾸지 않는다. 문서 전용 검증은 Python/문서 검사·diff-check로 계획했고 앱 명령은 영향이 없어 로컬 미실행한다. 원격 CI는 최종 PR head에서 별도로 확인한다.

### architecture.md

App Router·components/bids·types/bid-detail·data/bids HTTP/DTO/mapper/server가 존재하고 역할이 문서와 일치한다. 원문 링크와 독립 상세 section·server-only 경계를 확인했다. 소스/폴더/동작 변경이 없어 공통 구조 문서는 갱신할 필요가 없다.

### data-access.md

config의7그룹·hybrid 제약·한 번 확정하는 snapshot, bids/qna의 server-only, mock의 schema/fingerprint/API환경/auth/계정 namespace가 설명과 일치한다. 새 Repository/DTO/공급원·fallback은 설계/구현하지 않는다. 공개 계약에 없는 본문을 생성하지 않는 기존 규칙과 POL-09 조사 결과가 일치한다. mock/HTTP 대역/실제 QA는 이번에 실행하지 않았다.

### plan.md

현재/다음/상태의 소유자는 WBS 하나다. 원본79개/114Task/155의존성과 D10→POL-09/DEV-14, CF-10/CF-20·QA-03 연결을 보존한다. 기준선/감사의 과거 관찰을 현재 상태로 덮어쓰지 않는다. 정책 결정 후 날짜별 진입점의 필요성을 점검하며 중복 상태 목록을 만들지 않는다.

### harness.md

AGENTS·세 Skill·verifier.toml·placeholder config가 존재하고 Gate/문서 검증/두 리뷰·후속 freshness 규칙이 일치한다. 역할/설정 변경이 없으며 관련 문서의 수정은 필요 없다. 일반 subagent나 코드 수정 worker는 사용하지 않는다.

### ai-failures.md

기존 source/디자인 응답 allowlist 규칙을 검토했다. 이번 설명용 screenshot 조회에서 임시 asset 주소가 도구 출력에 포함된 재발을 [실제 사건/예방 규칙](../../../ai-context/ai-failures.md#pol-09-asset-output)으로 기록했다. 원문 주소는 다시 인용하지 않으며 사용자에게 공개했다. 이후 다운로드에는 주소를 전달하되 출력/문서/PR에 복사하지 않는다. 이전 출력 삭제를 주장하지 않는다.

## 발견된 불일치

문서가 현재 구현을 잘못 설명하는 Major/Minor 사실 드리프트는 확인하지 않았다. 다음은 소스/배포 문서 간 확인 항목이며 실제 업무 응답으로 확정한 결함이 아니다.

- 관련 문서: [POL-09 조사](../tasks/POL-09.md#pol-09-investigation), [상세 QA](../../../qa/bid-detail.md).
- 실제 코드베이스 상태: Kotlin/프론트 DTO는 `isSiteExplanationRequired`, 개발 OpenAPI는 `siteExplanationRequired`를 사용한다. 실제 응답은 미실행이다.
- 문서의 현재 설명: 기존 필요 여부의 표시 구현을 설명하며 전체 실제 API 통합은 QA-03 차단이다. source/Swagger 표기 차이가 실제 wire 차이인지는 기존 증거로 확정할 수 없다.
- 추천 조치: 실제 필요 여부 키/타입·true/false 경계를 후속 QA의 계약 확인 조건으로 추가한다. 이번에 제품/DTO를 임의 변경하거나 false fallback으로 해소하지 않는다.
- 자동 수정 가능 여부: **No, actual wire/실행 대응과 승인 fixture가 필요.** 이번 정책 결정 또는 문서 감사로 제품 결함이 해결됐다고 세지 않는다.

## 개발자 확인 필요 사항

사용자는 **‘추가 정보 제공 추진·백엔드 계약부터 정리’**를 선택했다. 이번 정책 방향에 추가 결정 요청은 없다. 본문 형식/원천·날짜의 개별 의미·실제 wire/version·실행 대응·검증 자원은 DEV-14 재개 전에 필요하다. Figma 현행 차이는 면제되지 않으며 다른 상세 레이아웃/접근성/실제 QA의 승인은 확대하지 않는다.

## 추천 수정 방향

사용자 답변의 원문/날짜/결정자와 최종 Brief·[정책/계약 요구](../tasks/POL-09.md#pol-09-contract)·DEV-14 재개/QA 기준을 연결한다. 기존 baseline/감사/QA·다른 Task 차단/승인 예외를 보존하고 문서 검사/두 리뷰를 수행한다. 공통 코드/설정·API 구현은 이번 범위에 넣지 않는다.

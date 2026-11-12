# Context Audit Report · POL-08 · 2026-11-13

## 결론

**PASS — 관련 문서/소스 정합성의 선별 진단.** 초기 WARN의 Q1은 전용 backend 계약 선행으로 사용자 확정됐다. 기존 no-view 조회 가능성과 초기 연결 불가 설명 정정을 반영했다. 새로운 Major 사실 드리프트는 없으며 제품/실제 복수 차수 통합 PASS는 아니다. 실제 전용 계약/제품 구현은 DEV-13 재개 조건으로 남는다.

## 확인한 코드베이스 사실

- 시작 main/원격 main `145324ee551f7b24c555d0d21ebe5dcb7f5eb79e`, clean·차이0/0. DOC-001/선행 DEV-11 PR #64 반영, 동일 Task branch/dirty 없음. `docs/pol-08-correction-history-policy`를 생성했다.
- package.json은 Next16.2.9·React19.2.4·pnpm11.3.0·Vitest4.1.11과8scripts, lockfile9.0이다. 독립 type-check/format 없음. `.nvmrc`/CI Node22.20.0, 이번 셸 Node26.5.0·pnpm11.3.0이다. 문서 검사는 Python/Git을 사용하며 이 셸의 앱 실행 결과를 주장하지 않는다.
- 상세의 status/changedAt/changeReason, 분류 선택/URL helper와 공개 bids server→Repository→HTTP/DTO 경계를 확인했다. CorrectionPopup은 기본 예시·Storybook만 있고 상세의 실제 소비/이력 Repository method는 없다.
- [고정 출처24개](POL-08-sources.json): 중앙 main `c9e50ff591ae18023164e1a94581c611bf1e4f29`, backend dev `befe434c2b3fd80ddbc12c1d6216f738dd5ea12a`, Figma 관련3상태. 소스 ref를 실행 서버 버전으로 사용하지 않는다.
- 개발 OpenAPI 문서 GET200·3.1.0/`v1`·공개 입찰10경로와 상세/목록 schema를 확인했다. 전용 이력 endpoint는 없으나 기존 no-view 목록에 동일 번호의 수집 차수를 조회할 경로가 있다. 추가 공개 GET3건도200이며 번호2검색은 각각 단일 차수다. 실제 DB 전체 이력/복수 차수·배포 대응·실행 SHA는 미확인이다.
- 저장 key는 번호+차수, 다른 차수는 별도 row/ID이고 같은 차수는 최신 version으로 갱신된다. keyword는 부분 검색, no-view는 상태/진행 조건 미지정 시 마감/취소를 일괄 제외하지 않으며 삭제/미공개는 제외한다. 관련 backend 테스트는 소스만 읽었다.

## 문서별 정합성 점검

### base.md

package/lockfile/scripts·Node pin/CI 기준이 일치한다. 실제 셸 Node26은 저장소 pin 변경이 아니다. 실행/패키지 변경이 없으므로 갱신 불필요다.

### architecture.md

App Router, components/ui/popup·bids, data/bids, lib/URL helper 구조와 DTO 경계가 현재 파일과 일치한다. 과거 구현과 실제 QA 대기 구분을 유지한다. 제품/폴더/스타일을 바꾸지 않으므로 갱신 불필요다.

### data-access.md

7개 공급원과 client/server 공개 진입점, 빌드 snapshot·운영 guard·자동 fallback 없음·DTO 경계·탭/계정 namespace·uploadHandle 규칙을 선별 확인했다. 격리/guard 실행은 안 했다. ‘명세 없는 정정 이력을 만들지 않음’과 현행 상세가 일치한다. 전용 계약 전 제품 연결 금지와 기존 목록 fallback 미채택은 Task/DEV-13에서 추적하며 현재 Repository 규칙/API를 바꾸지 않아 data-access 갱신은 불필요다. raw sourceKey 보존/표시 문자열 역파싱 금지도 후속 개발 기준에 반영했다.

### plan.md

WBS가 현재/다음/상태의 단일 소유자다. 시작 시79원본·114Task·155의존성과 완료20/차단22/대기69/보류2/준비1이 일치한다. POL-08 사용자 결정과 DEV-13 전용 계약 재개 기준의 날짜별 진입점을 plan에 추가했다. 원본/날짜별 상태·QA·승인 예외를 보존한다.

### harness.md

AGENTS·세 Skill·verifier 역할과 placeholder config가 존재하고 요구사항 Gate/문서 검증/Review Gate 흐름이 일치한다. `.codex/config.toml`의 과거 script 주석을 현행 script 목록이나 활성 등록으로 사용하지 않는다. 하네스 설정/역할 변경이 없어 갱신 불필요다.

### ai-failures.md

기존 원문 출력 예방 규칙 미적용 재발과 전용 endpoint 부재를 연결 불가로 확대한 오류를 실제 사건으로 추가했다. 사용자 공개·출력 allowlist·추가 조사/독립 확인·설명 정정을 기록하고 원문 metadata/연락처는 재인용하지 않는다. 수정이 이전 출력을 삭제했다는 뜻은 아니다.

## 발견된 불일치

새 Major/Minor 사실 드리프트는 확인하지 않았다. 다음 항목은 문서 오류가 아니라 소유 계약/정책 공백이다.

- 관련 문서: [POL-08 조사/질문](../tasks/POL-08.md#pol-08-investigation), [DEV-13](../tasks/DEV-13.md), [기존 QA](../../../qa/bid-detail.md).
- 실제 코드베이스 상태: 특정 ID 상세와 no-view 공고 단위 목록으로 수집된 공개 차수를 조회할 경로는 있다. 전용 이력 endpoint·수집 완전성/부재 사유 계약은 없다.
- 문서의 현재 설명: D06은 공용 팝업만, 실제 상세/과거 이력 계약 미연결이다. 기존 DETAIL-04는 현재 정정 사실만 다룬다.
- 추천 조치: 사용자 확정 전용 계약 선행·기존 목록 조합 미채택·필요 계약/DEV-13 재개 조건을 문서화했다. 상태는 WBS에서만 바꾼다.
- 자동 수정 가능 여부: **No, backend 계약 제공이 필요.** 문서 감사로 API를 생성하거나 제품 구현을 시작하지 않는다.

## 개발자 확인 필요 사항

정책 문서 범위의 추가 사용자 결정은 없다. Q1은 전용 backend 계약 선행, Q2/Q3는 동일 번호 수집 차수·대상 공고 전체 이동/뒤로 가기로 확정됐다. 사용자가 backend 개발자에게 요청했다고 보고했으나 실제 계약/접수·배포/실행 대응·합성 fixture는 DEV-13 재개 전에 필요하다.

## 추천 수정 방향

정책 v1과 전용 계약 요구/미확보·DEV-13/QA 후속 기준을 연결했다. baseline·감사·기존 결정/QA를 보존한 문서 검증과 두 리뷰/최종 freshness·승인된 Git 전달을 수행한다. 정책/문서 PASS를 전용 API 계약 완료·제품 연결/실제 복수 차수 통합으로 확대하지 않는다.

# Context Audit Report

## 결론

**WARN — 확인한 코드/문서의 Major 사실 불일치는 없으며, 후속 실제 wire/실행 대응·QA 자원은 별도 Gate다.** 사용자가 빈 회사 화면/기존 Sonner Toast1회를 확정했다. POL-10의 정책/문서 범위에 한정하며 제품 구현/화면 정합성/실제 API 통합 PASS가 아니다.

## 확인한 코드베이스 사실

- clean main/origin `ebda651016d323680be3364708f5c1ed6818b219`에서 `docs/pol-10-membership-cancellation` 생성. 선행 DOC-001/직전 DEV-56 반영, 같은 Task/무관한 미커밋 없음.
- pnpm11.3.0·Next16.2.9·React19.2.4·Vitest4.1.11, 실제8scripts. `.nvmrc`/CI Node22.20.0과 관찰 셸26.5.0을 구분한다. standalone type-check/format script는 없다.
- 회사 공개 client는 조회/온보딩/문서 포트를 제공한다. 현재 `MyMembershipRequest`에는 version이 없고 HTTP/mock/UI 취소 명령도 없다. 조회된 CANCELED 종료 카드를 취소 실행 구현으로 세지 않는다.
- [source/개발 schema/Figma 근거](POL-10-sources.json)는 본인 PENDING·필수 expectedVersion·잠금/상태 전이와 빈 회사 완료 frame을 확인한다. 테스트 소스 열람/배포 성공 기록과 현재 실행 process/업무 응답·제품 통합은 별개다.

## 문서별 정합성 점검

### base.md

package.json/lockfile·8scripts·Node pin·CI 설명이 일치한다. 셸26.5.0을 프로젝트 pin으로 바꾸지 않는다. 문서 전용 변경이므로 로컬 앱 검사는 영향이 없어 미실행하고, 최종 PR head의 원격 CI는 별도 확인한다.

### architecture.md

App Router·components/my·data/company 공개 client/contracts·HTTP/mock·auth session·Popup/Toast와 역할이 일치한다. 회사 overview는 인증 응답을 직접 화면 상태로 쓰지 않고 Repository로 조회한다. 이번 정책을 현재 제품 동작으로 설명하지 않으며 공통 구조/스타일 문서는 바꾸지 않는다.

### data-access.md

config의7그룹·hybrid 제약·고정 snapshot·production guard, 서버 공개 bids/qna, mock의 schema/fingerprint/API환경/auth/계정 namespace, HTTP wrapper/인증 재시도·postCommit 경고를 확인했다. 새 DTO/Repository/공급원/fallback을 구현하지 않는다. 소속 신청 GET404/CR001만 신청 없음인 기존 경계와 취소 명령404의 의미는 구분해야 한다. OpenAPI success와 현재 HTTP isSuccess의 실제 wire 확인은 후속 QA에 남긴다.

### plan.md

현재/다음/상태의 단일 소유자는 WBS다. 원본79개·114Task/156의존성·M05→POL-10/DEV-15 연결을 보존한다. 기존 QA-05 MCO4통과/6차단·과거 조회 전용 승인과 타 Task의 차단/예외는 정책 문서로 해제하지 않는다. 날짜별 정책 진입점만 필요 시 추가한다.

### harness.md

AGENTS·세 Skill·verifier.toml·placeholder config와 Gate/문서 검사/두 리뷰·후속 freshness 규칙이 존재한다. 역할/설정/실행 흐름 변화가 없으므로 공통 하네스 문서는 미갱신한다. 일반 worker 위임 없이 read-only verifier만 Review Gate에서 사용한다.

### ai-failures.md

기존 원격 응답 allowlist 예방 규칙을 확인했다. 이번 Figma 대기 metadata 출력에 불필요한 예시 신원 필드가 포함된 [실제 재발](../../../ai-context/ai-failures.md#pol-10-figma-metadata-output)을 기록했다. 이후 버튼/toast/CTA만 한정 조회하고 원문 metadata·임시 asset 주소·예시 값은 증거/문서/PR에 복사하지 않는다. 과거 출력 삭제를 주장하지 않는다.

## 발견된 불일치

이번 diff가 추가한 문서/코드 사실의 Major/Minor 드리프트는 확인하지 않았다. 다음은 제품 결함 확정이나 문서 자동 교정 대상이 아닌 후속 계약 확인 항목이다.

- 관련 문서: [POL-10 조사](../tasks/POL-10.md#pol-10-investigation), [고정 근거](POL-10-sources.json).
- 실제 코드베이스 상태: backend source는404 CR001/409 CR003·CR004, no-store와 취소 상태 결과를 제공한다. 게시 OpenAPI는 취소404/409를 열거하지 않고 wrapper를 success로 설명한다. 현재 프론트 wrapper는 isSuccess다.
- 문서의 현재 설명: 게시 schema·source·배포 기록/실행 SHA·실제 응답을 별도로 다루며 이번 업무 API는0건이다.
- 추천 조치: DEV-15 자체 Gate에서 취소 성공/오류 wire·권한·실행 대응과 안전한 합성 자원을 확인한다. 문서만 보고 wrapper나 오류 분기를 임의 변경하지 않는다.
- 자동 수정 가능 여부: **No, actual wire/실행 대응과 승인 fixture 필요.**

## 개발자 확인 필요 사항

사용자가 [빈 회사 화면/Figma Sonner Toast1회](../tasks/POL-10.md#pol-10-brief)를 확정했으며 이번 정책 문서에 추가 결정 요청은 없다. 중앙의 본인 PENDING·관리자 대리 취소 불가 정책은 재승인 대상으로 만들지 않는다. 실제 wire/실행 대응·QA 자원/사용·변경/잔존·복구 범위는 DEV-15에서 확인하며 이번 Git 승인을 업무 변경 승인으로 확대하지 않는다.

## 추천 수정 방향

확보한 사용자 원문·결정자/날짜를 POL-10 최종 Brief/정책, DEV-15 완료/재개 기준과 기존 회사 QA의 MCANCEL-01~12에 연결했다. 기준선/기존 QA를 보존하고 문서 검증·두 리뷰를 수행한다. 정책 결정과 제품/실제 통합·Git 전달 판정을 분리한다.

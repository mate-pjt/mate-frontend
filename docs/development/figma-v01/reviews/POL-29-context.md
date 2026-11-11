# Context Audit Report · POL-29 · 2026-11-11

## 결론

**FAIL — 기존 제품/정책·DESIGN 문서 드리프트 보존.** POL-29의 문서 변경 검증 판정과 구분한다. 이번 조사에서 새 package/구조/하네스 드리프트는 확인하지 않았다. 아래 기존 차이를 수정하거나 QA 통과로 올리는 작업은 이번 범위가 아니다.

## 확인한 코드베이스 사실

- 시작 clean main `f505421d6e5337ab3db4dac342d57bf18a948246`; QA-17 PR #50 반영. 원격 main fetch 후 차이0/0, `docs/pol-29-visual-policy` 생성. 감사의 `8d3a2ec` 이후 src/tests/package/lockfile/.codex/.github diff 없음.
- package.json: Next16.2.9·React19.2.4·pnpm11.3.0·Vitest4.1.11. script는 dev/build/start/lint/test/test:watch/storybook/build-storybook 8개다. 독립 type-check/format은 없다.
- `.nvmrc`와 CI의 Node 기준은22.20.0이다. 이번 셸 Node는26.5.0, pnpm은11.3.0으로 관찰했다. 문서 전용 검사에 Python/Git을 사용하며 셸 버전으로 앱 검증 PASS를 주장하지 않는다. 후속 제품 작업은 pinned Node를 선택해야 한다.
- App Router20page·7개 Repository 공급원과 static Q&A, client/server 공개 진입·DTO 경계·불변 build snapshot·production mock guard 구조는 유지된다. 이번 업무 API/계정/메일/파일 처리·제품 브라우저 실행은0건이다.
- Figma metadata/대표 screenshot과 현재 frontend 소유 소스·중앙 정책5개·현재 backend main/dev 인증 응답·개발 OpenAPI를 대조했다. 실제 서버 실행 SHA/업무 응답 검증과 분리한다. 세부 ref/한계는 [POL-29 조사 기록](../tasks/POL-29.md)에 있다.

## 문서별 정합성 점검

### base.md

packageManager·버전·실제8scripts·lockfile·`.nvmrc`/CI 기준은 파일과 일치한다. 현재 셸의 Node26은 저장소 설정 변경이 아니다. 실행 코드/의존성/검증 명령 변경이 없어 base는 갱신하지 않는다.

### architecture.md

app/components/data/features/lib 구조·Tailwind CSS 변수·공개 Repository 경계와 문서 설명이 일치한다. 홈 CTA의 현행 인증→recommended 경로도 현재 source와 일치한다. POL-29에서 경로 변경을 결정하더라도 구현 전에는 현재 사실 설명을 바꾸지 않고 후속 DEV-58 인계로만 연결한다. 아래 DESIGN.md의 기존 사실 차이는 DEV-62가 소유한다.

### data-access.md

7개 공급원·hybrid 제약·snapshot·fallback 없음·계정/탭 격리·upload handle과 실제 API/HTTP 대역/mock 검증의 구분은 현재 구조와 일치한다. 계정명은 Authentication.account의 id/email에서 생성할 수 없고 회사명은 connected 회사 profile이 출처다. 기존 reset/인증시간 등 제품 정책 불일치는 정책을 완화해서 문서를 맞추지 않는다.

### plan.md

기준선/날짜별 완료 이력과 WBS 현재 상태의 책임을 구분한다. 원본79개·기존113개Task를 보존하고 알림 화면/미지원 인터페이스 DEV-66 후보를 추가해114개로 연결한다. 이번 정책 선택과 후속 개발/실제 QA를 구분하는 날짜별 진입점만 갱신 대상으로 정했다. 현재/다음/상태는 WBS 한 곳에서만 관리한다.

### harness.md

AGENTS·feature-workflow/context-audit/ai-review·verifier 역할과 규칙은 파일과 일치한다. `.codex/config.toml`은 명시적 placeholder이며 과거 script 주석을 새 active 등록으로 해석하지 않는다. 도구·하네스/권한 체계 변경이 없어 harness를 갱신하지 않는다.

### ai-failures.md

기존 GitHub 작성자/인증 query 출력 방지, source/배포/실행 SHA 구분, Markdown patch 접두문자 예방 규칙을 적용한다. 문서 형식 검사를 검증 계획에 포함했다. 이번에는 제품/하네스의 반복 오류를 새로 관찰하지 않아 실패 이력을 추가하지 않는다. Figma URL 다운로드의 빈 파일·전송 크기 한계는 도구 근거 수집 한계로 기록하고 유효한 inline PNG8개로 보존했다.

## 발견된 불일치

- 심각도: **Major · 기존 CF-08 문서**
- 관련 문서: [DESIGN.md AlarmList](../../../../DESIGN.md#alarmlist), [이전 Context Audit](QA-17-context.md).
- 실제 코드베이스 상태: POL-04/DEV-06의 허용 actionPath·읽음 성공 후 이동을 activation-controller가 구현한다.
- 문서의 현재 설명: AlarmList 현재 Interaction은 목록 유지/actionPath 미연결로 설명한다.
- 추천 조치: 소유 [DEV-62](../tasks/DEV-62.md)에서 안내/문서 동기화와 회귀 검증. POL-29에서 직접 수정하지 않는다.
- 자동 수정 가능 여부: **No, 이번 범위 밖.** 기존 소유 Task의 Gate에서 처리한다.

- 심각도: **Major · 기존 제품/정책**
- 관련 문서: [QA-17 Context Audit](QA-17-context.md)의 CF-05/06/07/09/11/12/14/23과 현재 소유 Task.
- 실제 코드베이스 상태: 감사 이후 제품 diff가 없어 reset EMPTY_DEFAULT, 회사 단일 업종·mock 검색/view/인증시간 등의 차이가 남는다. 관련 공고 원문 내부 충돌도 POL-30 소유다. 이번에 모든 runtime 사례를 재실행한 것은 아니다.
- 문서의 현재 설명: ADR-0014 빈 SAVED, 현행 회사/검색/알림 정책을 정답으로 유지하고 각 수정 Task에 차이를 연결한다.
- 추천 조치: DEV-59/60/61/63/65·DEV-09/41과 POL-30 각각의 좁은 Gate에서 처리한다. 기존 실제 QA 차단은 보존한다.
- 자동 수정 가능 여부: **No, 이번 범위 밖.** 현재 정책을 구현 결함에 맞춰 바꾸지 않는다.

- 심각도: **Minor · 이번 정책 결정 입력**
- 관련 문서: [POL-29](../tasks/POL-29.md), 감사 CF-01~04/10/14.
- 실제 코드베이스 상태: Figma 배치와 필수 추가 기능/문구가 다르며 기존 도메인 정책만으로 모든 화면 예외가 승인되지는 않는다.
- 문서의 현재 설명: 여섯 화면의 기준·차이·결정자/날짜·추가 상태·후속 검증을 이번 정책 Task에서 확정한다.
- 추천 조치: D1~D3의 사용자 확정/교정·추천 철회와 보류 항목을 개별 기록했다. 미지원 제어의 비활성 시각은 승인됐지만 기능 활성화/백엔드 계약은 미승인이다.
- 자동 수정 가능 여부: **No, 이번 제품 수정은 범위 밖.** 미결 이름/문구는 후속 Gate의 developer confirmation required로 보존한다.

## 개발자 확인 필요 사항

POL-29에서 D1 배치·분류 예외, D2 이름+아이콘 목표, D3 Figma3설정 구성과 미지원 disabled/tooltip 방향을 확보했다. 이름 source/fallback과 홈 최종 문구는 후속 소유 Task의 보류/재개 조건이다. 계정 표시 이름의 API 확대, 전역/야간 활성화·실제 QA/운영 변경·다른 Task 구현을 승인받은 것으로 확대하지 않는다. 후속 개발은 자신의 Gate에서 현행 ref와 자원을 확인한다.

## 추천 수정 방향

화면별 결정/추가 상태와 후속 소유·검증을 문서화하고 문서 검사와 두 리뷰를 완료한다. 기존 제품/정책의 FAIL을 숨기지 않되, 이번 문서 검토 PASS와 구분한다. 상태와 다음 작업은 WBS에서만 갱신한다.

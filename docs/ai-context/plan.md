# Mate AI Feature Workflow Plan

This is the v0.1 AI harness workflow for feature work in Mate.

## Required Flow

1. Structure requirements.
2. Design the change.
3. Implement the smallest scoped change.
4. Verify with available commands.
5. If verification fails, fix and verify again.
6. Repeat automatic fixes at most 3 times.
7. Check whether `docs/ai-context` documents need updates.
8. Run Review Gate to decide whether verifier and `$ai-review` are required.
9. Return PASS only after verification succeeds, documentation update need is checked, Review Gate is complete, and any explicitly documented exception is accepted by the developer.
10. Run final developer-facing code review before PR or commit.

## Status

### Completed

- AI harness v0.1 baseline is accepted as the Mate team baseline for AI-assisted feature work.
- 2026-06-25: Ran a Figma-driven shared UI task (`SelectBox` / `SelectMenu`) through `$feature-workflow` -> verifier -> `$ai-review`; `pnpm lint` and `pnpm build` passed.
- 2026-06-26: Clarified that Review Gate may run the read-only verifier subagent without separate user confirmation when verifier is required.
- 2026-06-26: Treated the successful Figma shared UI task as the initial proof that the v0.1 workflow is usable, while keeping iterative refinement open.
- 2026-06-26: Implemented another Figma-driven shared UI task (`BidCard`) through `$feature-workflow`; `pnpm lint`, `pnpm build`, and `pnpm build-storybook` passed.
- 2026-06-26: Implemented Figma-driven reusable filter popover and popup component sets through `$feature-workflow`; `pnpm lint`, `pnpm build`, and `pnpm build-storybook` passed.
- 2026-07-14: Implemented the Figma-driven home page with local Figma illustration assets, existing `BidCard`/button primitives, and an approved frontend-only mock auth redirect contract for the future recommended bids view; static verification passed.
- 2026-07-15: Implemented the Figma-driven `/bids` list with four URL-backed views, reusable controlled filter popovers, mock search/filter/pagination, result-specific table columns, empty state, and the approved recommended-view auth redirect; static verification passed.
- 2026-08-10: Completed PR-readiness fixes for the home/auth/bid-list flow: representative home cards, non-empty default result fixtures, `bidStartedAt` period semantics, URL preset normalization, Escape dismissal, and same-origin mock auth return-path validation. `pnpm lint`, `pnpm build`, `pnpm build-storybook`, and desktop/mobile browser flow checks passed.
- 2026-08-11: Implemented the Figma-driven `/alarms` page with alternating list surfaces independent of read state, per-item read handling, edit/select/delete flows, empty state, 3-second deletion toast, and shared danger button/large circle-checkbox variants. Static, Storybook, and desktop/mobile browser verification passed.
- 2026-08-12: Extracted the alarm deletion toast into a reusable Sonner-backed `ToastViewport` / `showToast` UI primitive with single-toast replacement, configurable duration, built-in enter/exit motion, reduced-motion support, and Storybook coverage.
- 2026-08-12: Introduced mock-backed read data layers for home/bid list/bid detail and Q&A, removed direct bid/Q&A mock imports from Pages and Components, moved mock filtering/pagination behind Reader contracts, and documented the future DTO/mapper/HTTP Reader and Mutation integration rules.
- 2026-08-12: Implemented the Figma-driven `/qna` page with five structured mock answers, independently multi-open native accordions, responsive answer layout, and an anchor-based page-top control. Static checks plus desktop/mobile browser scenarios passed.
- 2026-09-27: Implemented Figma `13_가입` Google 로그인·소셜 가입·회사 찾기/등록·초대 수락 with Swagger-backed browser API code. `pnpm lint`, `pnpm build`, `git diff --check`, local mock browser checks, and verifier Review Gate passed. Real backend browser integration remains `docs/qa/auth.md` 0/17 pending by developer decision.
- 2026-09-27: 공개 입찰공고 목록 `ALL`·`CLOSING_SOON`·`RESULT` API 연결을 구현하고 맞춤공고·상세 링크·낙찰금액 필터의 준비 중 정책을 적용했다. 실제 브라우저 통합 검증은 `docs/qa/bid-list.md` 0/16 대기다.
- 2026-09-27: Figma `02_입찰공고상세`의 공개 상세를 backend ID·분류번호·첨부·연관공고·개찰결과·물품 등록정보 API에 연결하고 목록 상세 링크를 활성화했다. 정적 검증과 DTO 계약 시나리오는 통과했으며 실제 백엔드 브라우저 통합 검증은 `docs/qa/bid-detail.md` 0/9 대기다. 계정별 공고 알림 설정은 별도 기능이다.
- 2026-09-27: 계정별 공고 알림 카드·팝업을 `GET|PUT|DELETE /api/v1/me/bid-notice-alerts/{bidNoticeId}`에 연결했다. 정적 검증을 마쳤고 실제 백엔드 브라우저 통합 검증은 `docs/qa/bid-alert.md` 0/8 대기다. 개발자 결정에 따라 회사 가입 및 공개 목록·상세의 브라우저 통합 항목도 별도로 대기 상태를 유지한다.
- 2026-09-27: `mate-docs`의 공고기관·수요기관 역할에 맞춰 목록의 기관 출처와 상세의 기관별 담당자 정보를 분리했다. 홈 mock의 역할 미확인 기관명은 일반 ‘기관’으로만 표시한다. Node 22.20.0에서 lint·build·Storybook build 및 기관 DTO 경계 시나리오를 통과했고, 실제 API 브라우저 검증은 `docs/qa/bid-list.md`·`docs/qa/bid-detail.md`에 대기 중이다.
- 2026-09-27: 홈 ‘전체 입찰공고’ 9개 카드를 공개 `view=ALL` 목록 API 첫 페이지에 연결했다. 공고 종류·기관 역할·분류별 상세 URL·nullable 값·빈 결과·재시도 상태를 반영했다. Node 22.20.0에서 lint·build와 목록 DTO 경계 시나리오를 통과했으며 실제 브라우저 통합 검증 9건은 `docs/qa/home.md`에 대기 중이다.
- 2026-09-27: `/alarms`의 정책 미확정 7일 안내를 제거하고 삭제 API가 없는 편집·삭제 진입을 준비 중으로 막았다. Node 22.20.0에서 lint·build·로컬 HTTPS mock 화면 확인을 통과했다. 알림 목록·읽음의 실제 API 브라우저 통합은 `docs/qa/alarms.md`에 대기 중이다.
- 2026-09-28: `/alarms`의 실제 알림 목록·미확인 건수·읽음 API를 연결하고 로그인 안내 및 20건씩 더 보기를 구현했다. Node 22.20.0의 lint·build와 로컬 HTTPS Safari에서 실제 테스트 서버의 빈 목록, 비로그인 안내, Google 로그인 후 `/alarms` 복귀를 확인했다. 알림이 있는 목록·읽음·다음 페이지는 테스트 알림이 준비될 때까지 `docs/qa/alarms.md`에 대기한다.
- 2026-09-28: 마이페이지의 맞춤 공고 이메일 수신 설정을 실제 계정별 GET/PATCH API에 연결했다. 현재 수신 주소를 조회 전용으로 표시하며, `mate-docs`의 08:30 발송·공고별 알림 분리 정책을 화면에 반영했다. Node 22.20.0 lint·build와 로컬 HTTPS Safari에서 ON/OFF 왕복·마이페이지 진입·비로그인 안내를 확인했다. 이어 Chrome에서 Google 로그인 후 설정 복귀, 설정 GET/PATCH의 HTTP 200, 390/320px 모바일·키보드 ON/OFF, 브라우저 요청 차단으로 만든 네트워크 실패·재시도를 확인하고 계정 상태를 OFF로 복구했다. 실제 백엔드 4xx/5xx 오류 응답은 `docs/qa/notification-settings.md`에 대기한다.
- 2026-09-28: `/my` placeholder를 Figma 9.0.0 설정·관리 첫 화면으로 교체했다. 미구현 회사·계정·안내·의견 항목은 개발자 승인에 따라 준비 중으로 표시하고, 알림 설정과 로그아웃을 실제 기능에 연결했다. Node 22.20.0 lint·build, 로컬 HTTPS Chrome의 세션 refresh/logout 200, 알림 설정 GET 200, Google 재로그인 후 `/my` 복귀, 390/320px 모바일, 세션 연결 실패·재시도를 확인했다. 세부 결과는 `docs/qa/my-settings-home.md`에 기록했다.
- 2026-09-28: `/qna`의 다섯 답변과 소개 문구를 `mate-docs`의 개인 필터·08:30 맞춤 이메일·공고별 내부 알림 정책에 맞춰 수정하고 Figma 의견 배너를 기존 `준비 중` 방식으로 추가했다. Safari 데스크톱과 390/320px 브라우저에서 아코디언·키보드·상단 이동·모바일 배치를 검증했으며, 현재 Q&A API가 없어 목 기반 화면 결과 7건을 `docs/qa/qna.md`에 기록했다. Node 22.20.0 lint·build·diff-check 통과.
- 2026-09-28: `/bids`의 `ALL`에 계정별 개인 필터 GET/PUT/reset, 수동 적용, 전체 값 URL 왕복, 버전 충돌 안내를 구현했다. 로컬 HTTPS Chrome에서 Google 로그인·저장/재조회·복수 유형/지역/금액 적용·초기화·409 충돌을 실제 API로 관찰했다. 화면 캡처·백엔드 배포 식별자 등 공통 QA 증거가 부족해 12건 모두 `docs/qa/personal-bid-filter.md`에 대기 중이다.
- 2026-09-29: 백엔드 `dev`의 Google OAuth 계약 변경(MAT-234)에 맞춰 시작 요청의 `returnOrigin`과 귀환 후 인증 요청의 `flowId`를 전달했다. 로컬 HTTPS Chrome에서 테스트 서버의 신규 가입→입찰공고 로그인 상태→로그아웃→기존 계정 재로그인을 확인했다. `pnpm lint`·`pnpm build`가 통과했으며 상세 범위는 `docs/qa/auth.md`에 기록했다. 다른 인증 오류·회사 가입 사례의 전체 QA 판정은 유지한다.

### In Progress

- 알림 수신 이메일 인증·전환 코드는 구현됐고 정적 검증, 인증 시작 화면, 인증 전 390/320px·키보드 조작을 확인했다. 브라우저에서 인증 시작 요청만 차단해 연결 실패 안내와 기존 주소 유지도 확인했다. `docs/qa/notification-email-recipient.md`의 9건 중 3건 통과, 6건 대기다. 테스트 서버가 메일을 Mailpit에 보관해 인증 완료·주소 전환을 끝내지 못했으므로 기능 최종 PASS는 보류한다. 개발자는 환경 의존 검증을 펀치리스트/TODO에 남기고 다음 작업을 시작하는 예외를 승인했다.

### Next

- TODO: `/my`의 ‘알림 설정 공고’ 목록은 백엔드 담당자가 전체 분류를 서버에서 정렬·페이지 조회할 수 있는 계약(`GET /api/v1/me/bid-notice-alerts`의 `ALL` 또는 동등한 별도 API)을 제공한 뒤 구현한다. 2026-09-28 GitHub `mate-backend` `main`(`a12b76b`)과 테스트 Swagger에는 필수 `category=GENERAL|CORRECTED|CLOSED|RESULT_COMPLETED`만 있으며 `GENERAL`은 전체가 아니다. `counts.total`은 건수만 제공한다. 완료 소식을 받으면 GitHub 최신 소스·Swagger를 다시 확인하고 `docs/qa/my-bid-notice-alerts.md`에 따라 구현·브라우저 통합 검증한다. 개발자 결정에 따라 그전까지 이 기능은 대기한다.
- TODO: 읽지 않은/읽은 테스트 알림과 21건 이상의 목록이 준비되면 `/alarms`의 목록·읽음·미확인 점·더 보기의 실제 API 브라우저 통합 테스트를 마친다.
- TODO: 테스트 서버 Mailpit의 제한된 열람 방법이 준비되면 대체 알림 수신 이메일의 확인·재전송·주소 PATCH 및 새로고침 유지까지 브라우저에서 검증한다. 외부 수신함 배송은 공유 dev 환경의 범위가 아니다.
- TODO: 맞춤 공고 이메일 설정의 실제 백엔드 4xx/5xx 응답 시나리오는 안전한 오류 재현 조건이 준비되면 `docs/qa/notification-settings.md`의 NSET-07에 따라 검증한다.
- TODO: 사용자별 받은 알림 삭제/숨김 API와 의미가 확정되면 편집·삭제를 연결한다. 7일 보존 기간은 정책 확정 전까지 구현하지 않는다.
- TODO: 공개 입찰공고 테스트 데이터가 준비되면 목록·홈·상세의 실제 API 브라우저 통합 펀치리스트를 실행한다.
- TODO: 2026-09-29 개인 맞춤 필터 재검증을 막은 OAuth 시작 오류는 백엔드 `dev`가 요구하는 `returnOrigin` 누락으로 확인해 프론트에서 수정했다. 같은 로컬 환경의 Google 가입·재로그인 성공을 확인했으나 PBF-02~08의 필터 조작 자체는 재실행하지 않았다. 프론트 실행 식별자·백엔드 배포 ID·캡처·비식별 Network 증거를 갖춰 재검증한다. PBF-02의 최초 `EMPTY_DEFAULT`에는 새 계정/fixture가 필요하다. 공고 매칭·회사 기본값·오류·모바일 사례는 `docs/qa/personal-bid-filter.md`에 따라 별도 검증한다. `import-company`와 직접 범위·복수 조건 편집 UI는 회사 fixture 및 화면 정책을 확인한 뒤 별도 작업으로 진행한다.
- TODO: 개찰결과의 낙찰금액 범위 필터 API 계약과 맞춤공고 목록 API 계약을 백엔드 담당자와 확정한 뒤 별도 기능으로 연결한다.
- TODO: Figma의 최근·추천 검색어 팝업은 실제 검색 기록과 추천어의 데이터 공급원·저장 정책이 정해지면 별도 기능으로 복원한다.
- TODO: `docs/qa/README.md` 목록의 기존 화면과 새 Figma 기능에 대한 브라우저 통합 항목을 기능별로 채운다.
- TODO: `/my`의 계정 관리·서비스 이용안내·의견 보내기·회사 메뉴는 각 화면의 정책과 API가 확정되면 별도 요구사항으로 구현하고 펀치리스트를 추가한다.

## Status Update Rules

- After feature work completes, update Completed, In Progress, and Next only when the state is clear from the task and repository evidence.
- If the state is uncertain or depends on product/team priority, do not guess; ask the developer with a recommended update.

## Requirement Structuring

Before implementation, write:

- Requirement summary
- Success criteria
- In scope
- Out of scope
- Reference files
- Open questions

Ask at most 3 questions. Each question must include a recommended answer so the developer can approve quickly.

If a safe assumption is possible, state it as an assumption and continue. If the assumption could change product behavior, ask first.

## Design Before Code

Before editing files, present:

- Files to modify
- Expected impact area
- Implementation steps
- Risks
- Verification method

Keep the design scoped to one requirement. Do not combine unrelated refactors, formatting, package changes, or documentation updates with runtime implementation.

## Implementation Rules

- Preserve the existing `src/` structure.
- Prefer existing app patterns and local utilities.
- Do not add a new library unless the developer explicitly approves it.
- Do not touch unrelated files or pre-existing branch changes.
- Do not read or record `.env` values or secrets.
- Keep comments sparse and useful.

## Verification Commands

Use only commands backed by actual `package.json` scripts.

Primary verification commands:

```bash
pnpm lint
pnpm build
```

For Storybook configuration, component stories, or shared UI catalog changes, also run:

```bash
pnpm build-storybook
```

Use `pnpm dev` only when interactive/browser verification is needed. Use `pnpm start` only after a successful build when serving the production app is relevant.

Do not invent `pnpm test`, `pnpm type-check`, or `pnpm format`; those scripts do not exist as of 2026-06-25.

## Failure Loop

For failed verification:

1. Capture the failing command and key error.
2. Identify the likely cause from actual code and logs.
3. Apply the smallest fix within the original scope.
4. Re-run the failed command, then the full planned verification set when practical.

Stop automatic fixes after 3 failed attempts. At that point, report:

- What failed
- What was tried
- Why the agent is not confident continuing
- What developer decision or context is needed

## Completion Report

Final reports should include:

- Requirement status: PASS or blocked
- Changed files
- Verification commands and results
- Known TODOs or assumptions
- Any review findings that still require developer judgment

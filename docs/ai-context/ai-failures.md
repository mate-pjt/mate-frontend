# Mate AI Failure Log

Use this file to record recurring AI workflow failures and prevention rules. Do not record secrets, credentials, private customer data, or `.env` values.

## Current Known Failures

<a id="qa-05-auth-log-output"></a>

## 2026-11-02 - 로컬 서버 종료 원문 출력에 인증 거래 query 포함

- Task: QA-05 회사 조회 한정 실제 QA의 로컬 HTTPS 서버 정리.
- Expected behavior: 서버 실행/종료 결과는 비식별 경로·상태와 exit/소유 PID·포트 반환만 출력하고 인증 query 원문을 도구 출력에도 남기지 않는다.
- Actual failure: 브라우저 관측은 인증 query를 읽지 않았지만, 종료를 위해 `write_stdin` 결과를 원문 그대로 출력하면서 누적 Next 요청 로그의 callback 거래 식별자가 도구 결과에 포함됐다. 원문 값은 이 기록에 재출력하지 않는다. QA-04의 별도 관측 출력 사건도 이미 공개 기록돼 있어 반복 방지가 필요하다.
- Root cause: 자격 증명을 직접 읽는 호출뿐 아니라 프로세스 누적 로그도 민감값 출처라는 점을 종료 경로의 출력 필터에 반영하지 않았다.
- Detection command or review step: 서버 종료 도구 출력 확인 직후 사용자에게 사건을 알리고 QA-05/my-company/auth 기록과 Review Gate의 잔여 한계로 공개했다.
- Fix: 해당 값 원문을 문서/QA 증거/PR에 복사하지 않고 추가 인증을 반복하지 않았다. QA-A 로그아웃 200·두 회사 경로 refresh 401, 소유 프로세스 종료 0/잔여 없음·포트 반환을 확인했다. 이 정리는 과거 출력의 삭제나 해당 거래/모든 인증 값의 무효화 검증을 뜻하지 않는다. 서버 설정·계정/거래 회수 작업은 임의 수행하지 않았다.
- Prevention rule: 인증 전에 서버 로그 수집/출력에 query 제거를 적용한다. 시작·대기·종료 결과를 도구에 넘기기 전 안전한 요약으로 제한하고 `write_stdin` 등의 누적 stdout/stderr를 그대로 `text()`/도구 결과에 출력하지 않는다. 종료는 확인한 소유 PID/group·exit·포트 반환으로 검증한다. 읽기 전용 검토도 원문 인증 로그를 다시 열거나 인용하지 않는다.
- Related files: `docs/development/figma-v01/tasks/QA-05.md`, `docs/qa/my-company.md`, `docs/qa/auth.md`. 런타임/하네스 설정 변경은 없다.

## 2026-09-29 - 테스트 배포 브랜치 대신 main으로 OAuth 오류 분석

- Task: 테스트 서버의 Google OAuth 시작 요청 `OAUTH_REQUEST_INVALID` 진단.
- Expected behavior: 테스트 배포 대상인 백엔드 `dev`의 최신 계약과 브라우저 요청을 비교한다.
- Actual failure: `main`의 이전 소스만 보고 시작 endpoint에 해당 오류 분기가 없다고 판단해 서버 로그 확인을 우선 제안했다. `dev`에는 MAT-234 변경으로 필수 `returnOrigin` 검증이 추가되어 있었다.
- Root cause: 저장소 기본 브랜치를 테스트 서버 배포 브랜치로 가정했다.
- Detection command or review step: 백엔드 `dev`의 OAuth controller/service와 배포 workflow를 확인하고, 기존 요청의 400 및 수정 후 실제 브라우저 가입·재로그인을 비교했다. 테스트 서버의 실행 SHA 자체는 확인하지 못했다.
- Fix: OAuth 시작 요청에 현재 브라우저 Origin을 `returnOrigin`으로, 귀환 후 가입·session completion 요청에 `flowId`를 전달한다.
- Prevention rule: 배포 오류를 진단할 때 환경별 배포 브랜치·실행 식별자를 먼저 확인한다. 확인되지 않은 실행 SHA는 소스 브랜치 SHA와 구분하고, 계약 변경은 실제 브라우저 흐름으로 검증한다.
- Related files: `src/data/auth/http-repository.ts`, `src/data/shared/http.ts`, `src/app/auth/callback/`, `src/app/auth/signup/`, `docs/qa/auth.md`.

## 2026-09-27 - 공통 응답 성공 필드 오독

- Task: Google 로그인·회사 온보딩 실제 API 연결 코드 구현.
- Expected behavior: 백엔드 `CommonResponse`의 성공 응답을 정확히 판정한다.
- Actual failure: Swagger와 백엔드 저장소의 직렬화 테스트에 나온 `success`를 실제 테스트 서버 JSON 필드로 간주해, 정상 응답도 실패로 처리하는 코드가 정적 검증을 통과했다.
- Root cause: 문서·저장소 테스트와 배포된 서버의 JSON 응답을 직접 대조하지 않았다.
- Detection command or review step: 테스트 서버의 `GET /api/v1/regions`, `GET /api/v1/industries`, `GET /api/v1/bid-notices` 정상 응답과 인증 오류 응답에서 `isSuccess`를 확인했다. 같은 서버의 `/v3/api-docs` 공통 응답 스키마는 `success`로 표시한다.
- Fix: 사용자 결정에 따라 프론트 공통 응답 판정을 테스트 서버의 `isSuccess`로 통일한다. Swagger와 백엔드 저장소 테스트의 불일치는 백엔드 확인 사항으로 남긴다.
- Prevention rule: 새로운 API 경계를 작성할 때 문서뿐 아니라 배포 서버의 정상·오류 JSON 응답을 확인한다. `lint`와 `build`만으로 런타임 계약이 검증됐다고 보지 않는다.
- Related files: `src/data/auth/http-repository.ts`, `src/data/shared/http.ts`, `src/data/bids/api-types.ts`, `src/data/bids/http-repository.ts`, `src/data/bids/detail-http-repository.ts`.

## 2026-08-10 - 정적 검증만으로 PR 준비 상태 판단

- Task: Figma 기반 홈, mock 인증, 입찰공고 목록 변경의 commit/PR 준비 상태 검토.
- Expected behavior: 사용자 흐름, 보안 경계, 표시 문구와 데이터 필드의 의미까지 확인한 뒤 PR 준비 여부를 판단한다.
- Actual failure: lint, build, Storybook build는 통과했지만 mock 인증의 외부 경로 이동 가능성, 홈 카드의 가공된 필드, 비어 있는 기본 개찰 결과, `입찰개시일`과 다른 날짜 필드 사용이 후속 리뷰에서 발견됐다.
- Root cause: 정적 검사 결과를 사용자 동작과 도메인 데이터 의미 검증으로 확대 해석했다.
- Detection command or review step: 악성 `next` 값을 사용한 브라우저 흐름, 기본 query 조합 확인, 카드 원본 데이터 대조, 필터 라벨과 모델 필드 대조.
- Fix: 내부 경로 검증 함수를 추가하고, 홈 카드를 실제 mock 필드로 구성했으며, 기본 결과 fixture와 `bidStartedAt` 기간 필터를 보완했다.
- Prevention rule: PR 전 Review Gate에서 보안 입력, 기본 URL 상태, 사용자 노출 라벨과 실제 데이터 필드, fixture별 결과 차이를 별도 시나리오로 검증한다.
- Related files: `src/lib/auth-redirect.ts`, `src/app/auth/page.tsx`, `src/app/page.tsx`, `src/components/bids/bid-list-model.ts`, `src/data/bids/mock-repository.ts`.

<a id="pol-30-github-metadata"></a>

## 2026-11-12 - POL-30 GitHub 작성자 메타데이터 출력 재발

- Task: POL-30 중앙 정책/backend ref 조사.
- Expected behavior: 기존 QA-10/POL-02/DEV-63 예방 규칙을 외부 조회 전에 확인하고 branch 이름·SHA만 출력한다.
- Actual failure: branch 중첩 응답 문자열의 앞부분을 출력해 불필요한 공개 작성자 메타데이터·서명 일부가 포함됐다. 원문 값은 재인용하지 않는다. 환경파일·인증정보·업무 API 응답 조회와 구분한다.
- Root cause: 전체 응답 대신 앞부분만 표시해도 안전하다고 잘못 판단했고, 관련 실패 기록을 끝까지 읽기 전에 원격 조회를 수행했다. 문자열 길이 제한은 허용 필드 추출을 대신하지 못한다.
- Detection command or review step: primary가 출력 직후 확인해 사용자에게 공개했다. read-only verifier에도 잔여 한계를 전달한다.
- Fix: 이후 중첩 JSON을 내부에서 파싱해 branch는 SHA, tree는 필요한 경로, 파일은 필요한 본문, PR/CI는 head/check/병합 조건만 추출한다. 문서/receipt/PR에 작성자 정보나 원문 응답을 저장하지 않는다. 교정이 기존 출력을 삭제·무효화했다는 뜻은 아니다.
- Prevention rule: 기존 규칙과 함께 **원문 응답의 substring/slice도 출력 금지**다. 먼저 허용 필드로 새 객체를 구성한 뒤 출력한다. 병렬 결과 역시 각 반환값에 같은 경계를 적용한다.
- Related files: `docs/development/figma-v01/tasks/POL-30.md`, `docs/development/figma-v01/reviews/POL-30-context.md`. 제품·하네스 설정 변경으로 확대하지 않는다.

## Failure Entry Template

```md
## YYYY-MM-DD - Short title

- Task:
- Expected behavior:
- Actual failure:
- Root cause:
- Detection command or review step:
- Fix:
- Prevention rule:
- Related files:
```

## Failure Categories To Track

- Requirement drift: implementation does not match the structured requirement or success criteria.
- Scope creep: unrelated refactor, formatting, package, or source changes are included.
- Verification gap: agent reports success without running available `package.json` scripts.
- Existing worktree damage: agent reverts or overwrites unrelated developer changes.
- Styling mismatch: UI ignores established tokens, typography, or component patterns.
- Type or build risk: code looks plausible but fails strict TypeScript or Next build validation.
- Security issue: secret, token, password, personal data, or `.env` value is requested, read, or printed.

## Prevention Rules

- Start feature work with `$feature-workflow`.
- Run `$ai-review` before PR or commit.
- Use verifier for independent PASS or FAIL when the change affects user-facing behavior or shared components.
- Use only actual scripts from `package.json`; currently `pnpm test`, `pnpm lint`, `pnpm build`, and `git diff --check` are the primary app verification commands, and `pnpm build-storybook` is required for Storybook or shared UI catalog changes.
- If automatic fixes fail 3 times, stop and ask for developer analysis instead of continuing speculative edits.

## Repository 전환 후 예방 검사 (2026-09-30)

과거 실패 이력의 경로는 현재 Repository 경로로 동기화했다. 과거의 실제 QA 판정은 변경하지 않는다.

- wrapper 오독: `tests/http.test.ts`와 `tests/bids.test.ts`에서 `isSuccess`와 잘못된 `success`, 빈 data, HTTP 오류를 검사한다.
- OAuth 계약 오독: `tests/auth.test.ts`에서 `returnOrigin`, `flowId`, 안전한 복귀 경로, 가상 가입·로그인 분기를 검사한다. 실제 배포 계약 확인을 이 대역 테스트로 대체하지 않는다.
- 정적 PASS의 확대 해석: `docs/qa/repositories.md`에서 mock 브라우저/HTTP 대역/실제 API 검증을 분리하고 이전 통합 대기를 보존한다.
- 계정 경쟁·완료 표시: 중간 verifier가 발견한 늦은 upload descriptor의 계정 오염과 등록 성공 뒤 refresh 401/403에 대한 회귀 테스트 및 완료 화면 검사를 추가한다. 계약·세션·UI를 함께 확인한다.
- 운영 guard: Next instrumentation의 throw만으로 서버 프로세스가 종료되지 않는 것을 실제 시작 검사에서 확인했다. 운영 mock 거부 시 종료 코드 1까지 검사한다.

## 2026-11-04 - GitHub 상태 조회에서 불필요한 작성자 메타데이터 출력

- Task: QA-10 개인 필터 사전 점검의 Git 전달 조건 확인.
- Expected behavior: 저장소 merge 허용 방식·main SHA/protected/필수 checks·ruleset 등 필요한 필드만 출력한다. 공개 Git 응답의 작성자 정보도 현재 작업에 필요하지 않으면 표시하지 않는다.
- Actual failure: GitHub branch 조회의 `structuredContent.content`와 중첩 응답을 그대로 도구 출력에 넘겨 공개 커밋 작성자 이름·noreply 주소·프로필 링크가 포함됐다. 실제 값은 이 기록에 복사하지 않는다. 인증정보·환경파일·API 사용자 응답을 조회한 사건과 구분한다.
- Root cause: `.env`/인증 로그만 차단하면 충분하다고 여기고, GitHub의 구조화 응답에도 불필요한 개인 식별 메타데이터가 중첩될 수 있음을 출력 경계에 적용하지 않았다.
- Detection command or review step: primary의 GitHub get_repo/main branch/rulesets 병렬 조회 결과 출력 직후 확인. 사용자와 read-only verifier에 알리고 후속 문서/검증 범위를 다시 제시했다.
- Fix: 이후 GitHub 응답을 파싱해 SHA·merge 허용·보호/checks·CI job·PR 상태 등의 허용 필드로만 투영한다. 저장용 receipt도 같은 요약만 보존하고 원문 응답은 추가 출력/재인용하지 않는다. 이 교정으로 이미 발생한 도구 출력이 삭제된 것으로 주장하지 않는다.
- Prevention rule: MCP 응답 전체, `structuredContent`, `.content` 문자열 또는 중첩 JSON을 그대로 `text()`/`notify()`/파일에 쓰지 않는다. 먼저 필요한 필드를 명시해 추출하고 오류도 안전한 상태/요약만 표시한다. 공개 작성자 메타데이터·commit signature/payload·프로필 링크를 CI/병합 검사에 함께 기록하지 않는다.
- Related files: `docs/development/figma-v01/tasks/QA-10.md`, `docs/development/figma-v01/reviews/QA-10.md`. 런타임·API·하네스 설정 변경 없음.

## 2026-11-05 - POL-02 GitHub 원문 출력 방지 규칙 미적용 재발

- Task: POL-02 정책 근거의 중앙 문서/Backend main·dev ref 확인.
- Expected behavior: branch 응답은 이름·commit SHA·필요한 상태만 추출해 표시한다. 기존 2026-11-04 예방 규칙을 첫 GitHub 호출부터 적용한다.
- Actual failure: 초기 branch 조회3건의 응답 객체와 중첩 content를 원문 출력해 작업에 불필요한 공개 커밋 작성자 메타데이터·서명/payload가 포함됐다. 실제 값은 재인용하지 않는다. 환경파일·인증정보·업무 API 개인정보를 읽은 사건과 구분한다.
- Root cause: feature 작업의 ai-failures 사전 읽기보다 원격 근거 조회를 먼저 수행했고, connector 출력에 allowlist를 적용하지 않았다. 기존 예방 규칙이 있는 같은 유형의 재발이다.
- Detection command or review step: 원문 출력 직후 기존 실패 기록을 확인하고 사용자에게 사건·교정·기록 범위를 공개했다. verifier에도 이 한계를 전달한다.
- Fix: 이후 branch 응답을 파싱해 SHA만 출력하고, tree는 필요한 파일 경로만, 파일 조회는 관련 정책/코드 본문만 표시했다. Git/CI/PR receipt도 필요한 필드만 보존한다. 이미 출력된 내용이 삭제되거나 무효화됐다고 주장하지 않는다.
- Prevention rule: 외부 호출 전에 ai-failures의 해당 출력 경계 규칙부터 확인한다. `structuredContent.content`를 먼저 해석하고 명시적 필드 투영 후 출력한다. 전체 MCP 응답·중첩 원문·Git 작성자/서명/payload는 `text`/`notify`/증거 파일에 넘기지 않는다. 오류는 상태/안전한 요약만 표시한다.
- Related files: `docs/development/figma-v01/tasks/POL-02.md`, `docs/development/figma-v01/reviews/POL-02.md`. 런타임·API·하네스 설정 변경은 없다.

## 2026-11-11 - DEV-63 GitHub 작성자 메타데이터 원문 출력 재발

- Task: DEV-63의 최신 backend dev ref 확인.
- Expected behavior: 외부 조회 전 기존 출력 예방 규칙을 적용하고 SHA·경로·필요한 계약만 표시한다.
- Actual failure: branch 응답 전체를 `text()`에 전달해 불필요한 공개 작성자 메타데이터·서명/payload가 도구 출력에 포함됐다. 실제 값은 복사하지 않는다. 환경파일·인증정보·실제 업무 응답을 읽은 사건과 구분한다.
- Root cause: 독립 조회를 묶는 과정에서 중첩 connector 응답의 allowlist 투영을 빠뜨렸다. 기존 QA-10/POL-02와 같은 유형의 재발이다.
- Detection command or review step: 원문 출력 직후 사용자에게 알리고 이후 응답을 필요한 필드로 투영했다. read-only verifier에도 한계를 전달한다.
- Fix: GitHub branch/PR/CI 조회의 중첩 JSON을 내부에서 파싱한 뒤 SHA·병합 조건·check 상태만 출력한다. tree는 관련 경로, 파일은 필요한 코드/정책만 표시한다. 이미 발생한 출력이 삭제·무효화됐다고 주장하지 않는다.
- Prevention rule: `Promise.allSettled` 결과도 응답 전체를 출력하지 않는다. 각 반환값에서 명시적 허용 필드를 먼저 추출한다. 오류 역시 상태/안전한 요약만 남긴다.
- Related files: `docs/development/figma-v01/tasks/DEV-63.md`, `docs/development/figma-v01/reviews/DEV-63.md`. 제품·하네스 설정의 변경 사유로 확대하지 않는다.

## 2026-11-11 - 생성한 Markdown에 patch 접두문자 잔존

- Task: QA-17 전수 점검 보고서와 검토 기록 생성.
- Expected behavior: 새 제목·개조식·빈 줄이 일반 Markdown으로 저장되고, 링크/ID/보존 검사뿐 아니라 실제 문서 형식도 확인한다.
- Actual failure: CF-23 보고서 블록과 이후 독립 검토 요약 블록의 줄 앞에 literal `+`가 두 번 남아 제목/목록이 정상 렌더링되지 않았다. 링크·지문 검사는 이 형식 문제를 잡지 못했고 read-only verifier가 발견했다.
- Root cause: patch용 접두문자를 문자열로 생성하는 문서 본문에도 포함했다. 내용/링크 검사와 Markdown 형식 검사를 분리하지 않았다.
- Detection command or review step: verifier가 실제 파일의 해당 블록을 읽고 지적했다. 이후 이번에 변경한 Markdown 전체에서 잘못된 줄 시작 접두문자와 CF 제목 개수를 검사했다.
- Fix: 문제가 있는 새 블록의 접두문자만 제거하고 내용·원본 이력을 유지했다. 문서 검사에 형식 검사를 추가하고 전체 재검사·같은 verifier의 freshness를 다시 수행한다.
- Prevention rule: patch 자체와 파일에 저장할 문자열을 구분한다. 생성 후 새 제목/목록 블록을 직접 읽고, 링크/ID 검사와 함께 잘못된 patch 접두문자·발견 제목의 누락을 검사한다. 앞선 PASS 뒤 검토 요약을 붙인 경우도 같은 검사를 다시 실행한다.
- Related files: `docs/development/figma-v01/audits/2026-11-11.md`, `docs/development/figma-v01/reviews/QA-17.md`. 제품 코드·설정·실제 업무 API 변경 없음. 검사 스크립트는 저장소 밖 감사 증거 디렉터리에 보존한다.

## 2026-11-12 - 적용 버튼 이동으로 팝오버 닫기 경계 변경

- Task: DEV-55 개인 필터 도구막대 배치 정렬.
- Expected behavior: 열린 필터의 미저장 draft는 ‘내 맞춤’ 수동 적용 전에 닫히며 계정의 저장 조건만 URL에 적용된다.
- Actual failure: 적용 버튼을 toolbar rootRef 내부로 옮기면서 기존 outside pointerdown의 contains 검사에 걸려 팝오버가 남았다. 실제 Next에서 미저장 서울 draft가 지역 없는 저장 조건 적용 뒤에도 남는 것을 재현했다. 첫187 tests·브라우저 개별 동작 검증과 primary ai-review는 이 조합을 놓쳤고 독립 verifier가 Major로 발견했다.
- Root cause: 이벤트 핸들러 내용 보존만 확인하고 DOM 소속·ref/이벤트 경계의 변화가 기존 닫기 동작에 미치는 영향을 조합 검증하지 않았다.
- Detection command or review step: read-only verifier의 source 대조와 SAVED 준비→지역 draft 변경→내 맞춤 적용→잔존 팝오버/URL 대조. Task에 교정 전 manifest·FAIL을 보존한다.
- Fix: toolbar가 선행 action render callback에 close 함수를 제공하고 클릭/Enter/Space 모두 닫은 뒤 기존 적용 함수를 호출한다. 해당 세 입력과 재개방 draft·계정 불변을 실제 Next에서 재검증하고 두 리뷰를 다시 수행한다. 최종 결과는 DEV-55 검토 기록을 따른다.
- Prevention rule: 버튼/팝오버 DOM을 옮길 때 기존 contains·바깥 클릭·focus/keyboard·전파 경계를 함께 확인한다. ‘미저장 draft가 열린 상태→새 적용 동작→닫힘→재개방은 현재 적용값’ 순서를 회귀에 포함하며 handler가 같다는 사실만으로 행동 보존을 주장하지 않는다.
- Related files: `src/components/bids/bid-filter-toolbar.tsx`, `src/components/bids/bid-list-client.tsx`, `docs/development/figma-v01/tasks/DEV-55.md`, `docs/development/figma-v01/reviews/DEV-55.md`. 데이터 계약·별도 제품 정책 변경은 없다.

## 2026-11-12 - 최신 필터 조회와 탐색 의도 사이의 경쟁

- Task: DEV-55 후속 최신 GET·동등성 표시.
- Expected behavior: 최신 조회 중 사용자가 목록 필터/검색/화면을 변경하면 이전 조회가 그 의도를 덮지 않는다.
- Actual failure: 실제 window URL만 수명으로 비교해 router.push 이후 새 RSC가 도착하기 전의 공백에서 이전 GET이 유효했다. 검색 RSC1.2초·GET0.4초 대역 순서에서 새 검색이 사라지고 personal=1이 적용됐다. 초기213 tests와 정상 URL 변경 검증만으로는 드러나지 않았고 read-only verifier의 조합 검토로 재현했다.
- Root cause: 탐색 완료를 사용자 의도 발생과 같은 시점으로 취급했다.
- Detection command or review step: 실제 Next에서 새 검색의 RSC를 보류한 동안 먼저 apply GET을 완료하고 query/URL을 대조했다.
- Fix: 중앙 navigate에서 router.push 전에 조회 controller를 dispose하고 AbortSignal/pending 수명을 종료한다. 같은 지연 순서와 URL 왕복·계정/화면 종료, 최신 적용 전체 흐름을 재검증한다. 최종 결과는 후속 Task/QA/리뷰 기록을 따른다.
- Prevention rule: 비동기 조회가 URL을 적용할 때 탐색 의도·URL commit·응답 도착을 별도 사건으로 검증한다. URL 변경 완료 뒤의 취소만으로 수명 보호를 주장하지 않는다.
- Related files: `src/components/bids/bid-list-client.tsx`, `src/features/bid-notice-filters/apply-controller.ts`, `docs/development/figma-v01/tasks/DEV-55.md`. 기존 source/DTO·별도 저장 정책은 바꾸지 않는다.

## 2026-11-12 - DEV-60 GitHub 작성자 메타데이터 출력 재발

- Task: DEV-60 현행 backend dev 확인.
- Expected behavior: 기존 출력 예방 규칙을 외부 호출 전에 적용해 SHA·필요 경로/계약만 표시한다.
- Actual failure: branch 중첩 응답 전체를 도구 출력에 전달해 불필요 공개 작성자/서명 메타데이터가 포함됐다. 원문 값은 기록하지 않는다. 환경파일·인증정보·실제 업무 응답 조회와 구분한다.
- Root cause: 여러 독립 도구 결과의 공통 출력 경계에서 필드 투영을 누락했고 실패 기록의 해당 규칙을 읽기 전에 호출했다.
- Detection command or review step: primary가 원문 출력 후 확인해 사용자에게 공개했으며 Task와 독립 verifier에 한계를 전달한다.
- Fix: 이후 tree는 관련 경로, 파일은 필요한 코드/정책 본문, Git/CI/PR은 SHA·check·병합 조건만 투영한다. 이미 발생한 출력의 삭제/무효화를 주장하지 않는다.
- Prevention rule: 원격 호출 전 해당 실패 규칙을 먼저 읽고 각 응답 유형의 allowlist를 정한 뒤 호출한다. 전체 structuredContent/content·중첩 원문·substring을 그대로 출력/저장하지 않는다.
- Related files: `docs/development/figma-v01/tasks/DEV-60.md`, `docs/development/figma-v01/reviews/DEV-60-context.md`. 제품/하네스 설정 변경 없음.

<a id="pol-08-output-projection"></a>

## 2026-11-13 - POL-08 원격 응답/디자인 출력의 선별 누락 재발

- Task: POL-08 중앙 정책/backend/Figma 조사.
- Expected behavior: 기존 예방 규칙을 먼저 적용해 Git은 ref/SHA, Figma는 관련 이력 frame/문구만 표시한다.
- Actual failure: 초기 branch 응답 전체에 공개 작성자/서명 메타데이터가, 넓은 Figma metadata에 불필요한 연락처 예시가 포함됐다. 실제 값은 재인용하지 않는다. 환경파일/credential을 읽은 사건과 구분한다.
- Root cause: 필요한 필드를 추출하기 전에 여러 도구 응답을 공통 출력 경계에 그대로 넘겼고 관련 실패 기록을 끝까지 읽기 전에 조회했다. 출력 길이 제한도 필요한 범위 선별을 대신하지 못한다.
- Detection command or review step: primary가 출력 후 확인하고 사용자에게 공개했다. Task/독립 verifier에도 잔여 한계를 전달했다.
- Fix: 이후 ref/SHA·관련 source 본문·schema key·허용 frame 문구/비식별 공개 조회 필드만 추출한다. 문서/PR/receipt에 원문 metadata/연락처·임시 Figma asset URL을 복사하지 않는다. 이전 도구 출력이 삭제됐다고 주장하지 않는다.
- Prevention rule: 원격 호출 전 응답 유형별 출력 allowlist를 정하고 내부 파싱 뒤 새 객체를 만든다. 전체/중첩 원문·부분 문자열을 출력하지 않는다. Figma도 기능에 필요한 하위 노드 또는 문구만 추출한다.
- Related files: `docs/development/figma-v01/tasks/POL-08.md`, `docs/development/figma-v01/reviews/POL-08-context.md`. 제품/하네스 설정 변경 없음.

<a id="pol-08-endpoint-inference"></a>

## 2026-11-13 - 전용 endpoint 부재를 기능 연결 불가로 확대

- Task: POL-08 정정 차수 조회 계약 조사.
- Expected behavior: 전용 endpoint 유무와 기존 공개 API 조합으로 필요한 데이터를 얻을 수 있는지를 별도 조사한 뒤 제공 경계를 설명한다.
- Actual failure: 전용 이력 API/상세 이력 필드가 없음을 확인한 뒤 기존 목록의 no-view 경로를 충분히 대조하지 않고 ‘연결하려면 새 backend 계약이 필요’하다고 설명해 사용자 추가 질문/조사가 발생했다.
- Root cause: 문서의 endpoint 이름/상세 shape에 집중했고 기존 공고 단위 목록·keyword/상태 조건·차수 식별자·페이지/저장 key를 함께 읽지 않았다.
- Detection command or review step: 사용자 ‘결정 전에 백엔드 계약을 더 조사’ 요청 후 source/Swagger·읽기 전용 공개 GET3건과 독립 verifier로 no-view 경로를 확인했다.
- Fix: 기존 API로 공개 수집 차수를 조회할 경로가 있다는 점과 부분 검색/페이지/수집 완전성 한계를 설명하고 초기 연결 불가 판단을 정정했다. 사용자가 최종 선택한 전용 계약 선행은 별도 정책 결정으로 기록한다. 이 결정이 초기 단정을 사후 정당화하지 않는다.
- Prevention rule: 미지원 판단 전 저장 identity→기존 조회 입력/필터→응답 식별자/페이지→공개 경계→현재 소비 계층을 대조한다. 데이터 부재/전용 계약 부재/조합 가능성/전체 이력 보장은 구분하고 제한된 성공 응답을 제품 통합 PASS로 확대하지 않는다.
- Related files: `docs/development/figma-v01/tasks/POL-08.md`, `docs/development/figma-v01/reviews/POL-08-sources.json`. 새 endpoint/제품 구현은 하지 않았다.

<a id="pol-09-asset-output"></a>

## 2026-11-13 - POL-09 Figma 임시 이미지 주소 출력 재발

- Task: POL-09 정책 설명을 위한 관련 Figma 카드 screenshot 조회.
- Expected behavior: tool 응답의 임시 asset 주소를 내부 다운로드에만 사용하고, 사용자에게는 영속 Figma node 링크·로컬 이미지 파일을 전달한다.
- Actual failure: screenshot 응답의 text content를 그대로 출력해 임시 asset 주소가 도구 출력에 포함됐다. 실제 주소는 다시 기록하지 않는다. 환경파일·실제 계정 credential을 읽은 사건과 구분한다.
- Root cause: 기존 allowlist 원칙을 Git/source/Figma metadata에는 적용했지만 screenshot 응답에는 같은 출력 경계를 적용하지 않았다.
- Detection command or review step: primary가 출력 직후 확인해 사용자에게 알리고 부분 이미지를 로컬 파일로 전달했다.
- Fix: 이후 URL은 내부 파싱/다운로드 인자에만 사용하고 node ID·크기·로컬 경로·종료 코드만 출력한다. 문서/PR/receipt에 임시 URL을 복사하지 않는다. 이전 출력 삭제를 주장하지 않는다.
- Prevention rule: 이미지 응답도 외부 원문이다. `content`를 그대로 출력하지 않고 매 응답 종류마다 허용 필드의 새 객체를 만든다.
- Related files: `docs/development/figma-v01/tasks/POL-09.md`, `docs/development/figma-v01/reviews/POL-09-context.md`. 제품/하네스 설정 변경 없음.

## 2026-11-13 - DEV-56 Figma 자산 주소 선별 누락 재발

- Task: DEV-56 공통 헤더 디자인 조사.
- Expected behavior: Figma 응답에서 필요한 node/코드·치수만 선별하고 임시 asset URL은 내부 다운로드에만 사용한다.
- Actual failure: 초기에 전체 화면 코드의 자산 상수가 도구 출력에 포함됐다. 필터가 `www.figma.com`을 포함하지 않아 임시 URL을 놓쳤다. 실제 주소를 재기록하지 않는다. 실제 계정 credential/환경파일을 읽은 사건과 구분한다.
- Root cause: 차단 정규식으로 전체 응답을 정화하려 했고 출력 allowlist를 먼저 구성하지 않았다.
- Detection command or review step: primary가 원문 출력 뒤 확인·사용자에게 알렸고 read-only verifier에도 이 한계를 전달한다.
- Fix: 이후 관련 GNB child node·치수·비식별 결과만 새 객체로 출력한다. 영속 Figma node 링크와 합성 브라우저 캡처만 문서/PR에 저장한다. 과거 도구 출력이 삭제됐다고 주장하지 않는다.
- Prevention rule: 외부 응답은 출력할 필드와 하위 노드를 먼저 정한다. URL 차단 정규식/부분 문자열은 allowlist를 대신하지 않는다. 실제 로그인은 DOM 결과의 일치 여부와 경로/HTTP 상태만 남기고 응답 본문/헤더·이름·메일·OAuth query를 저장하지 않는다.
- Related files: `docs/development/figma-v01/tasks/DEV-56.md`, `docs/development/figma-v01/reviews/DEV-56-context.md`. 도구/하네스 설정 변경 없음.

<a id="pol-10-figma-metadata-output"></a>

## 2026-11-13 - POL-10 Figma 메타데이터의 예시 신원 필드 출력 재발

- Task: 소속 신청 취소의 대기/완료 상태 조사.
- Expected behavior: 기존 POL-08의 디자인 응답 allowlist 규칙을 적용해 필요한 버튼/완료 안내의 노드 ID와 문구만 표시한다.
- Actual failure: 대기 frame metadata 원문을 도구 출력에 전달해 작업과 무관한 예시 신원/연락처 필드가 포함됐다. 값을 재인용하지 않는다. 실제 계정 응답·환경파일·credential을 읽은 사건과 구분한다.
- Root cause: frame metadata도 외부 응답이라는 기존 규칙을 적용하지 않고 전체 문자열을 출력했다. 하위 버튼/안내 노드가 알려진 뒤에도 frame 전체 응답을 선별 없이 표시했다.
- Detection command or review step: primary가 원문 출력 후 사용자에게 공개했고 Task/Context Audit 및 read-only verifier에 잔여 한계를 전달한다.
- Fix: 이후 지정 버튼/toast/CTA 하위 노드의 text만 읽고 허용 필드로 출력했다. 임시 이미지 주소·원문 metadata·신원 예시는 문서/QA/PR에 복사하지 않는다. 기존 도구 출력이 삭제·무효화됐다고 주장하지 않는다.
- Prevention rule: 디자인 metadata도 원문/부분 문자열을 그대로 출력하지 않는다. 먼저 필요한 노드 ID·상태·비식별 문구의 allowlist를 정하고 새 결과 객체로 투영한다. 기능에 불필요한 예시 신원 필드는 증거로 보관하지 않는다.
- Related files: `docs/development/figma-v01/tasks/POL-10.md`, `docs/development/figma-v01/reviews/POL-10-context.md`. 제품·하네스 설정 변경 없음.

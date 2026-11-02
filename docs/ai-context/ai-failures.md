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

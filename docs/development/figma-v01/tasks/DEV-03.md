# DEV-03 · 맞춤 공고 목록과 홈 CTA 여정 연결

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: L02, H03
- 선행 작업: [POL-02](POL-02.md)
- 목적/범위: 확정된 조회 계약을 Repository/화면에 연결하고 준비 중 목적지를 교체한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### L02 · 맞춤 입찰공고 목록
- 기준선: UI **준비 중**, 동작 **미구현**, 데이터 **연결 없음**. 검증: 새 mock 로그인 후 placeholder 확인.
- 남은 점: 개인 필터 기능과 별도로 맞춤 목록의 조회·표시·빈/오류·정책 확정
- Figma: [3003:47410](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3003-47410)
- 소유 소스/기존 기록: [src/components/bids/bid-list-client.tsx:288](../../../../src/components/bids/bid-list-client.tsx)、[docs/qa/bid-list.md:197](../../../../docs/qa/bid-list.md)

### H03 · 맞춤 공고 확인 CTA
- 기준선: UI **구현**, 동작 **목적지 일부**, 데이터 **인증 연결**. 검증: 새 mock 로그인·복귀 확인.
- 남은 점: 로그인 후 도착하는 맞춤 목록이 준비 중 안내
- Figma: [2016:57355](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2016-57355)
- 소유 소스/기존 기록: [src/components/home/home-auth-cta.tsx:7](../../../../src/components/home/home-auth-cta.tsx)、[src/components/bids/bid-list-client.tsx:288](../../../../src/components/bids/bid-list-client.tsx)

- 이어갈 QA 기록: [bid-list.md](../../../qa/bid-list.md). 기존 case ID와 통과/대기/차단 기록을 보존한다.

## 완료 기준

- [x] 로그인→복귀→맞춤 목록·검색/정렬/페이지·빈/오류·reload를 확인했다.
- [x] 저장된 조건과 맞춤 조회의 관계·계정 변경·모바일을 로컬에서 검증했다.
- [x] 현재 package scripts의 test/lint/build와 Storybook, `git diff --check`를 통과했다.
- [x] 요구사항 Gate에서 정한 격리 브라우저·HTTP 대역의 권한과 오류를 검증했다. 실제 RBD 0통과·9차단과 재개 조건을 공동 QA에 기록했다.
- [x] Documentation Update Check 및 verifier/ai-review를 통과했다. [검토 기록](../reviews/DEV-03.md#dev-03-review)

## 착수 전 Implementation Brief / 설계 Gate

이 기록은 작업 후보 정의다. DOC-001 외의 작업은 아직 실행하거나 설계 승인을 받은 상태가 아니다. 착수 시 아래를 현재 소스 기준으로 채우고 편집 전에 제시한다.

- 요구사항/성공 기준 확정: 미작성.
- in/out scope와 확인한 기존 패턴: 위 후보 범위를 검토해 확정.
- 수정 대상 파일·영향·구현 단계: 미작성. 위 근거는 수정 허용 파일 목록이 아니다.
- 검증 계획/실제 명령·환경·계정/변경/복구 승인: 미작성.
- blocking ambiguity/정책 근거: 미작성. 미결이면 설계 전 질문 최대 3개와 추천안을 제시.
- 가정/제외·낮은 위험의 선택: 미작성. API/DTO/데이터 흐름 설계 전 data-access.md 필독.

## 결정 기록

| 날짜 | 질문/선택지와 추천 | 결정·근거·승인자/원문 | 영향 |
| --- | --- | --- | --- |
| 2026-10-27 | 작업 후보 분해 | 정책·API·제품 동작 신규 승인 없음 | 착수 시 Gate 수행 |

## 체크포인트 · 재개 메모

| 시각/실행자 | 환경·branch/HEAD·작업트리 | 수행/결과·근거 | 다음 행동·차단/재개 조건 |
| --- | --- | --- | --- |
| 2026-10-27 / 문서화 | feature/my-company-overview / f84af24b5f9d + 기존 미커밋 변경 | 보고서에서 작업 정의만 생성. 구현/실제 QA 미실행 | 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다. |

## 검증·리뷰·인계 기록

| 구분 | 실행 명령/사례·환경 | 결과 | 증거/미실행 이유 |
| --- | --- | --- | --- |
| 이번 작업 | 미실행 | 미판정 | 기준선의 과거 결과와 구분 |

- 자동 수정 시도: 0/3. 실패 시 명령·오류·원인·최소 수정·재검증 결과를 추가한다.
- Documentation Update Check: 착수 후 판단. base/architecture/data-access/plan/harness/ai-failures 중 영향 문서와 갱신/미갱신 이유를 기록.
- Review Gate: 미실행. verifier와 ai-review의 결과/대상 diff·후속 변경 재검토 여부를 기록.
- 커밋/PR: 없음. 추후 커밋할 때 하나의 목적·영어 type/한국어 메시지, 런타임/테스트/문서는 가능한 별도 커밋.
- 다음 작업 인계: WBS에서 선택. 이 단위의 필수 검증 PASS 전에 다른 기능으로 자동 전환하지 않는다.

## 2026-11-05 · POL-02 정책 인계 (DEV-03 미착수)

- 선행 정책: [POL-02 사용자3결정](POL-02.md#pol-02-approved-decisions). recommended는 진입/reload 시 현재 계정의 개인 필터 snapshot을 읽어 기존 공개 ALL 목록을 자동 조회한다. 기존 ALL의 수동 ‘내 맞춤’과 책임을 구분하고 AI 점수·이메일 발송일 추천은 추가하지 않는다.
- SAVED는 회사 유무와 무관하게 우선한다. 미저장 시 COMPANY_DEFAULT, 회사/저장 조건이 없으면 EMPTY_DEFAULT를 구분한다. 모든 조건이 비어 있으면 설정 안내와 전체 공고 이동을 제공하며 빈 SAVED를 회사 값으로 되돌리지 않는다. 유효한 조건의 매칭0건은 별도 빈 상태다.
- 마감 빠른 순·canonical 행 identity/서버 count/page(UI1/API0), 기존 크기10/20/30·검색 URL 상태를 사용한다. query/page/size는 계정에 저장하지 않고 GET은 개인/회사 데이터를 쓰지 않는다. 필터 편집/저장 동선은 기존 ALL을 사용한다.
- 홈 CTA/내부 next의 recommended 복귀, 오류 재시도/401 기존 세션 처리·계정 전환의 조건/행/늦은 응답 격리가 완료 기준이다. 오류를 빈 조건으로 취급하거나 mock/무조건 전체로 대체하지 않는다.
- 기존 `bids/server.ts`는 server-only이고 snapshot은 personal-filters/client 책임이다. 구현 Gate에서 이 경계를 유지하는 연결·취소/경쟁·reload/URL 설계를 먼저 제시한다. UI에서 concrete HTTP/DTO import, 서버 전역/props의 계정 상태·인증정보 저장, 새 BFF/공급원 그룹/추측 endpoint는 이 인계로 승인되지 않는다.
- **착수 차단:** POL-02 배포 OpenAPI/version·실행 SHA 대응 미확보(비인증 GET403), [QA-10 reset Major](QA-10.md#qa-10-resume)와 실제 QA 준비 조건 유지. 소스 commit/사용자 정책 승인만으로 배포 계약/기능 통합 PASS를 만들지 않는다.
- 검증 인계: [RBD-01~09](../../../qa/bid-list.md#pol-02-recommended-qa), 기존 HOME-09/BID-15/PBF 이력을 분리한다. 실제 package의 test/lint/build·영향 시 Storybook, mock/HTTP 대역·실제 Next/브라우저·API/오류·계정 교체/모바일을 각각 기록한다. mutation은 계정/변경/잔존/복구 승인 확보 후에만 수행한다.
- 이 문단은 후속 범위/완료 기준/차단의 갱신이며 DEV-03 Implementation Brief 또는 구현 승인이 아니다. 다음 Task는 WBS의 POL-02 재개 하나다.

## 2026-11-11 · QA-17 전수 점검 보완

- 근거: [감사 CF-19](../audits/2026-11-11.md#cf-19) · [route/API·출처 인덱스](../audits/2026-11-11.json).
- 범위/소유: 홈의 제공 기능 안내는 DEV-58에 분리했다. 추천 목록은 아직 placeholder이며 공개 ALL의 내 맞춤 적용/저장과 별개다.
- 추가 완료/재개 기준: 빈 조건/빈 결과·인증 복귀·source/version을 기존 POL-02 Gate에 따라 검증한다. 이번 Swagger200은 실제 통합/자원/실행 대응 차단 해소가 아니다.
- 이 절은 날짜별 후속 계획이다. 앞선 결정/QA/예외 이력을 대체하지 않으며 제품 구현·실제 업무 API 변경/새 통합 PASS는 없다. 상태는 WBS에서만 관리한다.

<a id="dev-03-pol-02-read-handoff-20261126"></a>

## 2026-11-26 KST · POL-02 조회 전용 인계

- [현행 두 GET의 명세와 정책](POL-02.md#pol-02-read-contract-20261126)을 직접 선행으로 사용한다. 11월 5일 명세 접근 차단은 당시 이력이다. 실행 식별자·실제 권한과 응답·합성 자료는 [공동 QA 재개 조건](../../../qa/bid-list.md#pol-02-read-qa-20261126)에 남긴다. 앞선 인계의 계정 저장 UI는 [DEV-09 교정](DEV-09.md#dev-09-ui-cleanup-brief)을 따른다.
- 조회 범위는 홈 CTA와 익명 직접 진입의 로그인 복귀, 진입/reload 때 인증 계정의 최신 필터 GET → 유효 조건이 있을 때 공개 `ALL` 자동 조회다. 빈 조건은 설정 안내와 전체 공고 이동, 유효 조건의 0건과 조회 오류는 각각 별도 상태다. 빈 `SAVED`·빈 `COMPANY_DEFAULT`·날짜/금액 기준만 있는 경우, 결측 필드와 손상 응답, 이전 계정의 늦은 필터/목록 응답을 검증한다.
- 검색·페이지·크기는 조회 상태로만 사용하고, 공개 목록의 정렬·표시 행과 서버 count를 사용한다. 기존 ‘내 맞춤’ 수동 GET과 URL 필터·현재 목록 초기화를 보존한다. 계정 저장·reset·회사 가져오기, 새 조건 관리 화면, 이메일·AI 추천은 조회 범위 밖이다.
- 다음 첫 행동은 최신 main·[데이터 접근 규칙](../../../ai-context/data-access.md)·[개인 필터의 공개 진입점](../../../../src/data/personal-filters/client.ts)·[공개 목록의 서버 진입점](../../../../src/data/bids/server.ts)을 대조하고 별도 Brief를 여는 것이다. 기존 서버 전용 경계와 인증 세션·계정·탐색 수명, 공유 가능한 URL의 조회 상태를 기준으로 연결 설계를 제시한다. 계정 상태·조건·오류를 다른 세션에 넘기는 저장·공유 캐시 및 인증정보를 공개 목록 요청에 얹는 방식은 이 인계 범위에 없다.
- 자체 Gate에서 자동 계약, HTTP 대역 및 실제 Next 브라우저의 정상·빈·오류·401·계정 전환·320/390px·키보드·수동 적용 회귀를 계획한다. `COMPANY_DEFAULT`는 현재 mock의 기본 bootstrap과 구분해 해당 snapshot을 제공하는 fixture로 확인한다. 실행 식별자·승인 합성 계정과 포함/제외 행·오류/해제가 있는 실제 QA는 별도 일정에 남긴다. 이번 문단은 인계에 해당하며 DEV-03의 설계와 구현 착수는 다음 대화다.

<a id="dev-03-brief"></a>

## 2026-11-26 KST · 구현 범위와 설계

- 시작은 깨끗한 `main`과 `origin/main` `d522e9c1049cbc5ccedfff4457db261e880e9a31`이다. [POL-02 PR #144](https://github.com/mate-pjt/mate-frontend/pull/144)의 병합과 [DEV-09의 기존 목록 교정](DEV-09.md#dev-09-ui-cleanup-brief)을 확인했다. `feat/dev-03-recommended-bids`의 시작 HEAD도 같다. 기존 변경은 0건이다.
- 결정자는 사용자다. 2026-11-05 D1~D3의 현재 계정 필터 자동 조회, 빈 조건 안내, 서버 정렬·페이지·무쓰기와 2026-11-26 프론트 우선 및 공동 실제 QA 일정을 적용한다. 이번 사용자는 DEV-03 단일 구현·검증·두 리뷰, 목적별 커밋·push·PR·최종 head CI·조건부 merge·로컬 fast-forward와 해당 PR의 Chromatic 월간 한도 예외를 승인했다. [D1~D3](POL-02.md#pol-02-approved-decisions) · [두 GET의 계약과 근거 구분](POL-02.md#pol-02-read-contract-20261126) · [실제 QA 일정](../README.md#frontend-first-20261126)
- 성공 기준은 H03 CTA 및 익명 직접 접근의 로그인 복귀, 진입·reload의 최신 현재 계정 snapshot, 유효 조건에서만 공개 ALL 자동 조회, 빈 조건·총 0건·범위를 벗어난 페이지·오류/재시도의 구분이다. 회사 기본 조건과 저장 조건을 표시하고, 분류 행 상세 링크와 마감 빠른 순·서버 건수·UI 1/API 0 및 10/20/30개·검색 URL을 보존한다. 계정이 바뀌거나 화면을 떠나면 이전 조건·결과·늦은 응답을 폐기한다.
- 확인한 위치는 `/bids`의 목록 page, 홈 CTA와 내부 `next`, 세션 epoch와 보호 GET의 401 처리, 공개 목록 Repository·mapper, 개인 필터 client, 목록 보기·검색·표·빈 상태다. 현재 Figma H03 대표 화면의 CTA와 L02의 제목·보기 선택·기본 행을 대조했다. 검색·페이지·출처·빈 상태와 오류는 승인된 조회 정책을 적용한다. 추가 상태 전체의 시각 예외 승인이나 pixel 전수 검증을 뜻하지 않는다. [H03](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2016-57355) · [L02](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3003-47410)
- 먼저 목록 page와 `src/components/bids`에 인증된 맞춤 목록 UI를 연결한다. 개인 필터 계약의 형식 검사와 기존 날짜·금액 검증을 재사용해 조회 조건을 정규화한다. `/bids`에 제공하는 Next Server Function은 입력을 다시 검사하고 공개 `bids/server.ts`를 통해 `view=ALL`을 조회한다. 브라우저에서 프론트 페이지로는 Next의 POST 전송을 쓰고 업무 요청 두 건은 GET이다. 공개 조회 전달 항목은 조건과 검색·페이지·크기다. 토큰·계정 ID·snapshot 출처·버전은 전달하지 않는다. 별도 Route Handler·공급원 추가 없이 서버 경계를 유지하고, 요청별 처리와 기존 `no-store`를 사용한다. [Server Function 전송과 순차 처리](https://nextjs.org/docs/app/getting-started/mutating-data)
- 앱 URL에는 조회 상태만 둔다. 목록 검색·페이지·크기 이동은 같은 화면의 URL을 갱신한다. 기본 페이지·크기는 기존 1·10이며, 맞춤 화면을 진입하거나 검색·크기를 변경할 때 첫 페이지를 사용한다. Server Function은 브라우저에서 순차 처리되므로 공개 GET에 제한 시간을 두고, 계정/epoch·현재 URL·마운트에 맞지 않는 응답은 화면에 반영하지 않는다. 이 전송 방법과 상태 문구·응답 제한 시간은 이번 구현 선택이다.
- 기존 ALL의 수동 ‘내 맞춤’ GET·URL 적용·현재 목록 초기화는 회귀를 확인한다. 계정 저장·reset·회사 조건 가져오기·새 관리 UI·AI/이메일·실서비스 변경 및 배포는 범위 밖이다. 실제 QA는 실행 식별자·승인 합성 자원과 오류/해제 조건을 확보해 공동 일정에서 진행한다. [RBD 조건](../../../qa/bid-list.md#pol-02-read-qa-20261126)
- 검증은 Node 22.20.0/pnpm 11.3.0의 Vitest, lint, API·mock·hybrid Next 빌드, 공용 목록 UI 영향의 Storybook 빌드, 문서 링크·커버리지·의존성·스냅샷·diff-check다. 격리 Next 브라우저와 HTTP 대역에서 RBD 시나리오, 두 인증 진입 경로, 재시도·401, 계정 교체, 무쓰기, 320/390px·키보드 및 일반 목록 회귀를 확인한다.

### 착수 체크포인트

- Codex · 2026-11-26 KST · `feat/dev-03-recommended-bids` / `d522e9c` · 기존 미커밋 0건. 현재 UI/계약 검토와 대표 Figma 비교를 마쳤다. 첫 행동은 맞춤 목록 조회의 필터·URL 계약을 정의하고 `/bids`의 서버 호출과 브라우저 상태를 연결하는 것이다. 자동 수정 시도 0/3.

### 구현 뒤 검증 체크포인트

- Codex · 2026-11-26 KST · `feat/dev-03-recommended-bids` / `d522e9c` · DEV-03의 목록/조회 소스·계약 테스트·WBS 및 작업 기록 diff만 있다. 기존 홈 CTA는 인증 복귀 경로를 사용한다. 맞춤 진입 상태, 검색 URL, 계정/epoch 확인, 화면별 오류와 재시도, 서버 공개 목록 GET을 연결했다.
- 작업 디렉터리의 pnpm 11.3.0이 모듈 디렉터리 자동 교체 확인을 요청해 두 초기 명령이 앱 실행 전에 멈췄다. 작업 디렉터리 의존성은 보존했다. `.env`를 제외한 소스의 격리 복사본에서 잠금 파일 설치를 통과했고 여기에서 자동 검사와 브라우저를 실행한다. 다음은 프로필 빌드 및 승인된 로컬 대역 시나리오 확인이다.
- 첫 자동 검증은 Vitest 1,294건·lint·세 Next 빌드·Storybook 빌드를 통과했다. 첫 Chrome 21건 중 19건을 통과했으며, 계정 교체 두 건의 스크립트가 기존 `/my` 로그아웃 뒤 홈 자동 이동을 잘못 기대했다. 기존 비로그인 상태를 확인한 뒤 홈으로 이동하도록 시나리오를 교정한다. POL-23 D1의 범위 확인에서 공개용 최근 검색어가 맞춤 검색까지 기록될 수 있는 경로를 찾아 분리했다. 작은 화면에서 긴 페이지 선택을 목록 영역 안에서 탐색하도록 보완했다. 제품 자동 수정 1/3이며 수정 뒤 동일 게이트를 재실행한다. [공개 검색어 범위](POL-23.md#pol-23-contract)
- 두 번째 검증은 Chrome 24/24와 자동 검사를 통과했다. 공유 URL의 공백이 `%20`으로 인코딩되면 브라우저 주소 원문과 `URLSearchParams`의 `+` 직렬화 비교가 달라질 수 있음을 확인했다. 같은 방식으로 두 주소를 비교하도록 교정하고 인증된 직접 진입 시나리오를 추가한다. 제품 자동 수정 2/3이다.

<a id="dev-03-verification"></a>

## 2026-11-26 KST · 최종 검증과 구현 근거

| 층위 | 실행과 결과 |
| --- | --- |
| 자동 계약 검사 | Node 22.20.0·pnpm 11.3.0에서 `pnpm install --frozen-lockfile`, `pnpm test` 44파일·1,294건(신규 21건), `pnpm lint` 통과. 필터·URL·서버 행·무인증 공개 HTTP를 포함했다. |
| 빌드 | `MATE_APP_ENV=preview pnpm build`를 `api`, `mock`, `hybrid`에서 각각 통과했다. 혼합은 company·notifications·notificationSettings에 기존 mock override를 사용했다. `pnpm build-storybook`은 공용 목록 영향으로 실행해 통과했다. production의 mock 빌드 시작 차단도 확인했다. |
| Next 브라우저 | `pnpm start`의 mock 2건·loopback HTTP 대역 23건. 1920·390px 스크린샷과 320px 동작, `%20` 직접 진입, 계정·요청 경쟁, 마감·분류·페이지 및 공개 목록 회귀를 확인했다. [QA와 증거](../../../qa/bid-list.md#dev-03-local-qa) · [홈 CTA](../../../qa/home.md#dev-03-home-cta-qa) |
| 문서 | 로컬 링크·앵커, WBS 상태/의존 114개·156개, 기준선/연결표의 원본 79개 및 기존 QA 문단, Markdown과 `git diff --check`를 확인했다. [검토](../reviews/DEV-03.md) |
| 개발 서버 | 현재 사용한 근거는 POL-02의 배포 대상 소스와 CI/배포 기록 및 게시 명세다. 실제 백엔드 실행 SHA와 응답은 공동 일정의 범위이며 RBD 실제 0통과·9차단, PBF 실제 0통과·12차단을 유지한다. [공동 QA 조건](../../../qa/bid-list.md#pol-02-read-qa-20261126) |

- 코드·테스트 16파일의 지문은 `e65b9a48355937c270cfb26c92d67d926b5dd9f4ab9d9be1488bd6a1a883d98e`이며 격리한 세 복사본과 일치한다. 자동 수정 2/3 이후 동일 게이트를 실행했다. 이전 21건·24건의 중간 결과는 위 체크포인트에 보존한다.
- Documentation Update Check에서 구조·무쓰기 조회 경계·종료 근거의 `architecture.md`·`data-access.md`·`plan.md`와 작업·WBS·QA 색인을 갱신했다. package/scripts·하네스 파일은 동일하고 추가 실패 예방 규칙을 만들 근거는 없다. 원본과 Task 매핑 변동은 없다.
- 검증 자원은 Next 및 loopback 대역과 합성 브라우저 프로필이다. 공유 계정·서비스·배포 환경의 상태를 변경한 대상은 없다. 검토 대상은 이 브랜치의 DEV-03 작업 diff이며 다음 행동은 독립 verifier·ai-review 결과 확인이다.

<a id="dev-03-close"></a>

## 2026-11-26 KST · 결과와 Git 전달 기준

기존 홈 CTA와 동일 출처 로그인 복귀가 계정 조회 전용 맞춤 목록으로 연결된다. 자동 검사, 실제 Next의 mock/HTTP 대역과 문서 검증 및 두 리뷰를 통과했다. 개발 서버 통합은 사용자 결정의 별도 공동 일정에 남긴다. [기능과 검증](#dev-03-verification) · [리뷰 기록](../reviews/DEV-03.md)

이번 요청의 Git 승인으로 기능·테스트·문서 커밋을 각각 만들고 작업 브랜치를 push한다. PR 템플릿과 `type: feature` 라벨을 사용하고, 실제 최종 head의 CI와 리뷰·병합 조건을 확인한다. Chromatic 월간 한도 차단만 이번 Git 전달 예외다. 최종 head, check, 병합과 로컬 SHA는 [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afeat%2Fdev-03-recommended-bids) 및 전달 보고에서 확인한다.

<a id="dev-03-handoff"></a>

### 다음 작업 선정과 첫 행동

P0 공개 준비와 P1 알림 관리 대기 작업에는 미충족 선행이 남아 있다. 11월 26일 확인된 지역 계층·공개 필터 계약 및 공동 실제 QA 일정은 앞선 DEV-09의 착수 차단에 영향을 준 새 근거다. 완료된 POL-07을 직접 선행으로 하는 프론트 순서 2번 DEV-09를 로컬 범위 재개 확인 대상으로 선정했다. 기존 실제 QA 차단을 보존한다. [WBS 선정 기준](../workflow.md#next-task-selection) · [계약·승인 근거](DEV-09.md#dev-09-frontend-first-20261126)

첫 행동은 최신 main의 지역 선택지 mapper·필터 툴바·URL/공개 query에서 시도/시군구 코드와 `regionOnly`·`jointContract`의 연결 범위를 대조하고 L07의 요구사항 Brief를 여는 것이다. DEV-09의 자체 Gate·구현·QA는 다음 대화에서 시작한다.

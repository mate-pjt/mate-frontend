# 개인 맞춤 입찰 필터 브라우저 통합 테스트

## 기준

- Figma: [01_입찰공고리스트 2201:18147](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2201-18147), ‘내 맞춤’ 적용 2991:111897
- 화면: `/bids?view=all` 또는 `/bids`의 개인 필터 버튼·조건 표시
- API: [테스트 Swagger](https://api-test.mate-bid.com/swagger-ui/index.html)의 `GET|PUT /api/v1/bid-notice-filters/current`, `POST /api/v1/bid-notice-filters/current/reset`, 공개 `GET /api/v1/bid-notices?view=ALL`
- 정책: `mate-docs` ADR-0014. 조회 우선순위 `SAVED > COMPANY_DEFAULT > EMPTY_DEFAULT`, 초기화는 빈 `SAVED` snapshot을 남겨 회사 기본값을 다시 적용하지 않는다. 키워드·목록 view·페이지는 계정 저장 대상이 아니다.
- 구현 범위: 개인 필터 조회·수동 적용·명시적 저장·초기화·버전 충돌. `import-company`와 별도 맞춤공고 목록은 후속 작업.

## 실행 환경

| 실행일시 | 프론트 | 백엔드 | 브라우저 | 계정·데이터 | 수행자 |
| --- | --- | --- | --- | --- | --- |
| 2026-09-28 16:10~16:19 KST | `https://local.mate-bid.com:3000`, 현재 작업 트리 | `https://api-test.mate-bid.com`, 배포 ID 미확인 | Chrome 데스크톱 1920px | 승인된 Mate 테스트 계정, 공개 공고 0건 | Codex |

비밀값, OAuth URL, 쿠키, 토큰, 응답의 개인정보는 기록하지 않는다. 테스트 계정은 처음 `EMPTY_DEFAULT`였고, 저장·초기화 실험 후 **빈 `SAVED` snapshot** 상태가 되었다. 테스트 전 상태로 완전히 되돌리는 API는 없다.

이번 실행에서 관찰한 비식별 API 결과: `GET /current`는 처음 `EMPTY_DEFAULT`를, 저장 후 재조회에서는 `SAVED`를 반환했다. `PUT /current`와 `POST /current/reset`은 변경된 snapshot을 반환했고, 오래된 `expectedVersion`의 `PUT`은 HTTP 409였다. 공개 `GET /bid-notices?view=ALL`은 복수 유형·지역과 금액 조건을 받았지만 결과는 0건이었다. 화면 캡처와 Network 원본 파일은 이번 실행에서 보관하지 않았고 백엔드 배포 식별자도 확보하지 못했다. 아래 관찰 결과는 후속 재검증의 참고 자료이며, 공통 QA 규칙에 필요한 식별자·캡처·비식별 Network 증거를 갖추기 전까지 각 case를 `통과`로 판정하지 않는다.

### 2026-09-29 재검증 시도와 차단 사항

- 08:29~08:37 KST, `https://local.mate-bid.com:3000`의 로컬 개발 서버에서 재시도했다. 프론트 Git 기준점은 `71a109975f12a38ddf6e84a118389308c3321241`이며 **미커밋 작업 트리**이므로 이 SHA만으로 실행 코드를 특정할 수 없다. 맞춤 버튼 파일 `src/components/bids/bid-filter-toolbar.tsx`의 SHA-256은 `91b66ee6f92c793f5cd1e9f46425fcc8e7a852f62c6ec97fa25dd7607f541cde`다. 테스트 백엔드의 배포 식별자는 여전히 확인되지 않았다. GitHub `mate-backend`의 `main` SHA `a12b76ba701e5fea68bffe088239ba7c3c851a65`는 **소스 기준**이지 테스트 서버 배포 버전이 아니다.
- 비로그인 Chrome 1920×872와 Safari에서 `/bids`의 ‘내 맞춤’을 선택하면 `/auth?mode=login&next=%2Fbids`로 이동했다. Chrome 화면은 이번 세션에서 캡처했으나 영구 파일로 보관하지 못했다. 따라서 PBF-01의 공통 증거 요건은 아직 충족하지 못했다.
- Safari에서 ‘Google로 로그인’을 선택하면 Google 계정 선택 화면에 도달하기 전, `GET /api/v1/auth/oauth/google/authorizations?returnTo=%2Fbids`에 `OAUTH_REQUEST_INVALID` JSON이 표시됐다. 같은 시작 endpoint를 직접 HTTP 요청해도 `returnTo` 없음·`%2Fbids`·`/bids` 모두 HTTP 400과 같은 코드였다. 직접 요청은 브라우저 Origin/CORS 검증의 증거로 사용하지 않고, `returnTo` 한 형태만의 문제가 아님을 좁히는 진단으로만 사용한다. Chrome의 별도 자동화 탭에서는 외부 이동이 `ERR_BLOCKED_BY_CLIENT`로 끝났으므로 그 결과로 백엔드 동작을 판정하지 않는다.
- 당시 확인한 [백엔드 `main`의 `GoogleOAuthController.authorize`](https://github.com/mate-pjt/mate-backend/blob/a12b76ba701e5fea68bffe088239ba7c3c851a65/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/auth/oauth/GoogleOAuthController.kt)와 [서비스의 `start` 함수](https://github.com/mate-pjt/mate-backend/blob/a12b76ba701e5fea68bffe088239ba7c3c851a65/mate-api/src/main/java/kr/co/mate/mate_api/application/service/auth/oauth/GoogleOAuthService.kt)에는 이 오류 분기가 없었다. 이후 테스트 배포 브랜치인 `dev`의 MAT-234 변경에서 필수 `returnOrigin` 검증을 확인했으므로, 위 `main` 기반 원인 추정과 서버 로그 선행 요청은 현재 결론이 아니다. 실제 테스트 서버 실행 SHA는 여전히 미확인이다.
- 수정된 프론트로 같은 로컬 HTTPS Chrome에서 Google 신규 가입과 기존 계정 재로그인 후 `/bids?view=recommended` 복귀를 확인했다. OAuth 시작 차단은 해소됐으나 PBF-02~08의 필터 조작 자체는 재실행하지 않았다. PBF-02의 최초 `EMPTY_DEFAULT`는 기존 테스트 계정이 빈 `SAVED` 상태가 되어 재현할 수 없으므로 새 테스트 계정 또는 백엔드 fixture가 필요하다. 각 재실행에는 프론트 코드 식별자, 백엔드 배포 ID, 캡처 파일, 비식별 Network 요약을 함께 남긴다.

## 사례

| ID | 조작과 API | 예상 결과 | 상태·증거 |
| --- | --- | --- | --- |
| PBF-01 | 로그아웃 상태에서 `/bids`의 ‘내 맞춤’ 선택 | `/auth?mode=login&next=%2Fbids`로 이동 | 대기. 9/29 Chrome·Safari 주소 이동 재관찰; 캡처 파일·프론트 실행 식별자 보완 필요 |
| PBF-02 | Google 로그인 후 `/bids` 복귀, `GET /api/v1/bid-notice-filters/current` | 저장 조건이 없으면 `EMPTY_DEFAULT`, 적용 버튼 비활성 | 대기. OAuth 시작 차단 해소; 9/28 관찰 증거 보완 및 새 계정/fixture 필요 |
| PBF-03 | 현재 공사 필터를 ‘내 맞춤에 저장’, `PUT` 후 새로고침 `GET` | `SAVED`가 유지되고 계정 초기화 버튼 표시 | 대기. OAuth 시작 차단 해소; 9/28 관찰 증거 보완 필요 |
| PBF-04 | 저장 조건을 ‘내 맞춤’으로 적용, 공개 `GET /api/v1/bid-notices?view=ALL` | `/bids?personal=1&bidTypes=CONSTRUCTION`, 현재 목록에만 적용 | 대기. OAuth 시작 차단 해소; 9/28 빈 API 결과 관찰 증거 보완 필요. 실제 공고 행 매칭은 PBF-10에서 별도 확인 |
| PBF-05 | 팝업 ‘저장’으로 공사→용역 변경 후 ‘내 맞춤’ 재선택 | 팝업은 계정 PUT 없이 현재 URL만 `SERVICE`로 변경, 재적용 시 계정의 `CONSTRUCTION` 복구 | 대기. OAuth 시작 차단 해소; 9/28 관찰 증거 보완 필요 |
| PBF-06 | 두 유형·두 지역·기초금액 직접 범위가 든 URL을 열고 계정 저장·재조회·적용 | 반복 query와 정확한 금액이 그대로 보존 | 대기. OAuth 시작 차단 해소; 9/28 `CONSTRUCTION`,`SERVICE`,`41`,`48`, 1억~5억 원 재적용 관찰 증거 보완 필요 |
| PBF-07 | 계정 초기화 확인창에서 `POST /reset`, 이후 현재 조건 초기화 | 계정은 빈 `SAVED`, 현재 목록은 초기화 전까지 유지, 별도 초기화로 URL 제거 | 대기. OAuth 시작 차단 해소; 9/28 관찰 증거 보완 필요 |
| PBF-08 | 두 탭이 같은 버전을 읽고 첫 탭이 PUT, 둘째 탭이 오래된 `expectedVersion`으로 PUT | 둘째 탭은 409, 최신 snapshot 재조회, 덮어쓰기 없음 | 대기. OAuth 시작 차단 해소; 9/28 관찰 증거 보완 필요 |
| PBF-09 | 회사 가입 계정에서 `COMPANY_DEFAULT` 읽기·적용·명시적 저장 | GET은 쓰지 않고, 저장 시 `SAVED` 생성 | 대기. 회사 fixture 없음 |
| PBF-10 | 실제 공개 공고가 있는 환경에서 다중 지역·업종·날짜·금액·지역 업체·공동도급 조건 적용 | 목록 행과 총건수가 모든 서버 조건에 일치 | 대기. 테스트 서버 공개 공고 0건. 날짜·지역 업체·공동도급의 실제 서버 매칭도 이때 확인 |
| PBF-11 | 개인 필터 GET/PUT/reset 네트워크 실패와 401, UI 재시도 | 공개 목록은 유지, 개인 필터 오류 안내 및 안전한 재시도 | 대기. 오류 재현 환경 필요 |
| PBF-12 | 390/320px·키보드에서 버튼·조건 칩·초기화 대화상자 조작 | 가로 넘침 없이 조작 가능, 포커스·Escape 확인 | 대기. 데스크톱에서 대화상자 첫 버튼 포커스·Tab 이동·Escape 닫기·원래 버튼 포커스 복귀를 관찰했으나 모바일은 미실행 |

## 범위·후속 작업

- `POST /api/v1/bid-notice-filters/current/import-company`는 회사 계정 fixture 및 덮어쓰기 시나리오를 정한 뒤 연결한다.
- ‘나를 위한 맞춤 입찰공고’ 별도 탭은 대응 목록 API가 확인되면 별도 기능으로 구현한다. 현재 개인 필터는 `view=ALL`에만 수동 적용한다.
- 기존 팝업에서 직접 지정 날짜·금액, 복수 지역·업종, `regionOnly`, `jointContract` 편집은 아직 제공하지 않는다. 서버에서 읽은 해당 값은 목록 조회·재저장 시 보존하고 조건 칩에 모두 표시한다. 완전한 편집 UX는 Figma·정책 확인 후 별도 범위로 진행한다.
- 08:30 맞춤 이메일 내용 반영은 메일 fixture와 다음 발송 시점이 필요해 이 검증에서 제외한다.

## 판정

**0건 통과·12건 대기.** PBF-01~08의 9/28 조회·저장·적용·초기화·충돌 관찰은 공통 QA 증거가 부족해 정식 통과로 기록하지 않는다. 9/29 오전 OAuth 시작 오류를 수정하고 가입·재로그인까지 확인했지만 PBF-02~08 필터 조작은 재실행하지 않았다. PBF-09~12의 회사 기본값·공고 데이터 매칭·오류·모바일은 미실행이다. 재검증 시 백엔드 배포 식별자와 현재 프론트 상태를 특정하고, 화면 캡처 및 비식별 Network 요약을 남긴다.

<a id="qa-10-20261104"></a>

## QA-10 · 2026-11-04 사전 점검(실제 API 실행 아님)

[작업 기록/재개 조건](../development/figma-v01/tasks/QA-10.md#qa-10-resume) · [검증·검토](../development/figma-v01/reviews/QA-10.md) · [현재/다음/상태는 WBS](../development/figma-v01/README.md).

- 사용자 승인 원문: **“자원 미준비 — 사전 점검·차단 기록·Git 전달만 진행 (추천)”**. 이번 실제 QA는 **0통과·12차단**이다. 위 9월 관찰/0통과·12대기·case ID/예상 결과를 보존한다. QA-04의 인증 승인/결과나 QA-09→QA-10 선정 예외를 실제 필터 변경 승인으로 사용하지 않는다.
- 점검 환경: 2026-11-04 16:38 KST 시작, `qa/qa-10-personal-filter`, source HEAD `345dd87a56224eef234af68cae85ac9b6ed11a7b`(main=origin/main, clean에서 분기). 최종 변경은 사전 점검5문서와 출력 사건 예방 ai-failures를 합한 Markdown6개뿐. Node pin/설치 실행 파일22.20.0·기본 셸26.5.0·pnpm11.3.0, 3000/6006 TCP 리스너 없음. 로컬 HTTPS crt/key는 존재만 확인하고 내용은 읽지 않았다.
- 프론트 실행 snapshot/배포·백엔드 실행 대응은 **미확보**다. 문서상의 대상은 `https://local.mate-bid.com:3000`/`https://api-test.mate-bid.com`이지만 이번에는 접속하지 않았다. 브라우저/화면·캡처·Network·복구 실행은 **해당 없음(앱/실제 API 미실행)**이다. 소스 SHA·과거 인증 PASS·backend 소스 브랜치를 실행 식별자로 대체하지 않는다.
- `src/`·tests·패키지/설정·baseline/coverage/PREP·다른 QA와 기존 QA prefix는 변경하지 않는다. 새 로그인·GET/PUT/reset·fixture 생성·메일·서비스/배포·외부 메시지0회, 새 잔존/복구 대상 없음. 자원 미준비를 현재 공고0건 또는 서비스 장애로 단정하지 않는다.

### 이번 12개 사례의 차단 근거와 재개 조건

화면/Figma·method/endpoint·조작·예상 결과는 위 원래 사례와 기준을 따른다. 아래 표는 **실제 미실행의 준비 판정**이며 소스 대조를 UI/API PASS로 세지 않는다. 담당 역할은 필요한 책임 구분이고 개인 배정은 전부 미확인이다.

| ID | 이번 결과 | 부족한 자원·승인·증거 / 재개 조건 | 필요한 담당 역할 |
| --- | --- | --- | --- |
| PBF-01 | 차단·미실행 | 승인된 로그아웃 브라우저/정확한 HTTPS Origin·현재 프론트 실행 대응과 `/bids`→next 복귀 캡처. 사전 점검 승인으로 새 브라우저/로그인을 시작하지 않음 | 프론트 QA 실행자 |
| PBF-02 | 차단·미실행 | disposable EMPTY_DEFAULT 계정 별칭·최초 snapshot/source/version·로그인/GET 허용·세션 종료 범위. 과거 빈 SAVED 계정을 최초 상태로 취급하지 않음 | 계정 fixture 담당·승인자 |
| PBF-03 | 차단·미실행 | 승인 계정·시작 version·공사 저장 PUT/reload GET 기대값·변경/잔존/종료/복구 범위. 저장 성공과 실제 이메일 반영을 구분 | 필터 API/fixture 담당 |
| PBF-04 | 차단·미실행 | 저장 snapshot·수동 적용 query·ALL 조회 기대 목록/캡처·비식별 Network. 조회의 자동 적용/쓰기 없음과 클릭 적용을 구분 | 필터/공개 공고 fixture 담당 |
| PBF-05 | 차단·미실행 | 승인 계정의 공사 SAVED·팝업 용역 변경·PUT 없이 URL만 변경/다시 공사 적용 기대값. 계정 PUT과 팝업의 현재 목록 ‘저장’ 구분 | 프론트 QA 실행자·필터 fixture 담당 |
| PBF-06 | 차단·미실행 | 두 유형/두 지역·정확한 금액 범위/반복 query·PUT/GET/URL 왕복 기대값과 변경·복구 승인. 과거 코드/금액 관찰을 현재 매칭 fixture로 쓰지 않음 | 필터/공개 공고 fixture 담당 |
| PBF-07 | 차단·미실행 | 시작/종료 snapshot·POST reset/빈 SAVED 잔존 승인·현재 URL 유지 후 별도 초기화·복구 담당/방법. 아래 기존 mock/HTTP 대역 reset 차이도 재개 전 판단 | 필터 API/회사 fixture 담당·승인자 |
| PBF-08 | 차단·미실행 | 승인 계정 두 탭·동일 시작 version·첫 PUT/stale PUT→실제409→최신 GET·덮어쓰기 없음·종료/복구 기대값 | 필터 API 담당·프론트 QA 실행자 |
| PBF-09 | 차단·미실행 | 저장 이력 없는 COMPANY_DEFAULT 계정/회사 조건·GET 무쓰기/명시 PUT→SAVED·이후 잔존/원복 방법. 임의 회사 가입/기본값 생성은 제외 | 회사/필터 fixture 담당·승인자 |
| PBF-10 | 차단·미실행 | 실제 공고 별칭과 유형·지역·업종·날짜·금액·regionOnly/jointContract 포함/제외·총건수/경계 기대값. 과거 공고0건이나 대역 매칭으로 통과 처리하지 않음 | 공개 공고 fixture 담당·백엔드 배포 담당 |
| PBF-11 | 차단·미실행 | 개인 GET/PUT/reset 각각의 안전한 네트워크 실패/해제·실제401/refresh·재시도·오류 후 저장값 기대조건과 승인. 공유 서비스 장애 주입/응답 위조를 실행하지 않음 | 필터/인증 API 담당·프론트 QA 실행자 |
| PBF-12 | 차단·미실행 | 승인 계정·저장 조건·390/320px/키보드와 dialog 포커스/Tab/Escape/복귀·가로 넘침의 캡처/브라우저 버전. 데스크톱 과거 관찰은 모바일 PASS 아님 | 프론트 QA 실행자 |

### reset 계약과 기존 대역의 차이

기존 이 문서의 ADR-0014 인용 정책/예상 결과는 **빈 SAVED**다. 반면 현재 [mock reset](../../src/data/personal-filters/mock-repository.ts)은 `source: "EMPTY_DEFAULT"`·`canImportCompany: false`·증가한 version을 저장하고 [HTTP fetch 대역](../../tests/http-contracts.test.ts)도 reset source를 EMPTY_DEFAULT로 만든다. [mock 계약 테스트](../../tests/account-repositories.test.ts)와 HTTP/mock 공통 테스트는 빈 `filter`만 assert하므로 source·회사 기본값 재적용 방지의 증거가 아니다. 실제 [HTTP 구현](../../src/data/personal-filters/http-repository.ts)은 서버 snapshot을 파싱하며 source를 고쳐 만들지 않는다.

이 차이는 시작 HEAD부터 존재한 **Major 정합성/검증 공백**으로 제한 context-audit **FAIL**에 기록했다. 이번에 mock/대역/실제 API를 재실행하거나 현재 백엔드 정책/응답의 원인을 확정한 것은 아니다. 사전 점검 범위에서 코드/테스트를 바꾸지 않는다. 재개 시 필터 API/정책 소유 역할·개발자가 현재 권위 계약/실제 응답과 수정 범위를 확인하고 source/version/canImportCompany·회사 기본값 억제 검증을 확정해야 한다.

### 잔존·복구와 인계

실제 실행 전 disposable 계정별 시작 source/version/filter와 종료 기대값, PUT/reset·409 허용 범위, 빈 SAVED 잔존/폐기 또는 담당자 fixture 재생성·원복 절차와 검증을 정한다. **reset은 최초 EMPTY_DEFAULT 또는 COMPANY_DEFAULT 복구 수단이 아니다.** 서버에 원상복구 API가 있다고 추정하지 않는다. 회사 기본값 GET과 명시적 저장, 현재 목록 초기화와 계정 reset을 각각 구분한다.

다음 Task는 **QA-10 재개**다. 최신 main/Git·위 조건·현재 프론트/백엔드 실행 대응과 reset 대역 차이부터 확인해 실제 QA Gate를 다시 작성한다. QA-11은 P0 다음 행이나 자체 fixture 차단·QA-10 미검증/진행 예외 없음으로 이번에 선정/착수하지 않는다. import-company·고급 편집·별도 맞춤 목록·실제 이메일 검증은 계속 제외한다. 로컬 앱 test/lint/build/Storybook·mock/HTTP 대역 실행은 Markdown만 변경해 미실행이며, 문서 검사·두 리뷰·원격 head CI 결과는 검토 기록/PR에 구분한다.


<a id="qa-10-next-qa-11"></a>

### 2026-11-04 16:58 KST · 후속 선정 예외

사용자 [명시 승인](../development/figma-v01/tasks/QA-10.md#qa-10-next-qa-11-exception)으로 위 종료 시점의 ‘다음 QA-10 재개/QA-11 예외 없음’ 중 **다음 작업 선정만 QA-11로 대체**한다. PBF-01~12 실제0통과·12차단과 과거0통과12대기, reset 기대 빈 SAVED 대비 mock/HTTP 대역 EMPTY_DEFAULT의 미해결 Major/context-audit FAIL·재개/복구 조건은 그대로다. 이번 후속은4문서 인계 설명·검증/두 리뷰·Git 전달만 수행한다. QA-11은 새 대화에서 main/Git·해당 task/PREP·ALARM-01~10·승인 계정/알림/읽음 PATCH·시작 건수/정렬/페이지·사용/변경/읽음 잔존/종료/복구·오류/실행 대응부터 확보해 Gate를 작성하며, 실제 fixture 차단·ALARM-04 삭제 API 차단/ALARM-05 7일 안내 보류는 해소되지 않았다. 이번 QA-11 실행·제품 API/데이터/서비스 변경은 없고 QA-10 통합 PASS나 reset 수정, QA-11 실제 실행/운영 승인으로 확대하지 않는다. 검증/리뷰 결과는 [후속 검토](../development/figma-v01/reviews/QA-10.md#qa-10-next-qa-11-review)에 보존한다.


## 2026-11-05 · POL-02 개인 필터와 맞춤 목록의 책임

- [사용자3결정](../development/figma-v01/tasks/POL-02.md#pol-02-approved-decisions): 기존 ALL의 ‘내 맞춤’은 수동 적용을 유지하고, 별도 recommended 진입/reload는 현재 snapshot을 읽어 ALL 자동 조회로 정의한다. 조회 자체로 저장/reset/import·회사 변경을 하지 않는다. query/page/size는 계정 저장 대상이 아니다.
- SAVED > COMPANY_DEFAULT > EMPTY_DEFAULT와 빈 SAVED 보존은 중앙 Accepted ADR-0014를 유지한다. 회사 미연결이어도 유효한 SAVED는 우선하고, 조건이 모두 비면 설정 안내/전체 공고 이동을 제공한다. 빈 조건과 조건은 있으나 매칭0건을 구분한다.
- QA-10 실제0통과·12차단/기존0통과·12대기와 reset 기대 빈 SAVED 대비 mock/HTTP 대역 EMPTY_DEFAULT의 기존 Major/context-audit FAIL은 그대로다. 이번에 코드·테스트·계정·PUT/reset/import 또는 브라우저/업무 API를 실행하지 않았고 새 실제 통과0건이다. 정책 결정으로 reset 차이가 수정된 것은 아니다.
- 후속 [RBD-01~09](bid-list.md#pol-02-recommended-qa)는 DEV-03 이후 검증할 맞춤 목록 사례다. PBF ID/기존 증거와 합치지 않는다. 배포 계약/실행 대응과 차이 처리 범위는 [POL-02 재개 표](../development/figma-v01/tasks/POL-02.md#pol-02-resume), 실제 필터 자원·사용/변경·잔존/복구는 [QA-10 재개 표](../development/figma-v01/tasks/QA-10.md#qa-10-resume)를 따른다.

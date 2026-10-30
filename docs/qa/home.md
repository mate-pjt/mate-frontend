# 홈 브라우저 통합 테스트

> 아래 초기 펀치리스트의 `대기`·`미실행`은 과거 기록으로 보존한다. 현재 QA-01 실행의 사례별 결과와 재개 조건은 [2026-10-30 실행](#qa-01-실행--2026-10-30-kst)을 따른다. Task의 현재/다음/상태는 [WBS](../development/figma-v01/README.md)만 관리한다.

## 기준

- Figma 파일/섹션: [00_메인 전체 화면, 2016:57355](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2016-57355), [전체 입찰공고 카드, 2036:59249](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2036-59249)
- 구현 화면/경로: `/`, 카드 상세 이동 `/bids/[bidId]`, 전체 보기 `/bids`
- 관련 API 명세: [Mate Swagger UI](https://api-test.mate-bid.com/swagger-ui/index.html), [공개 목록 정책](https://github.com/mate-pjt/mate-docs/blob/b3251bba2a9fbc7de8857ee73dfb955db5720a3c/docs/api/bid-notices.md), `GET /api/v1/bid-notices`
- 담당자/검토자: 미정
- 이번 작업의 정적 검증: Node 22.20.0에서 `pnpm lint`, `pnpm build`, `git diff --check` 통과. fixture 경계에서 0-based 페이지, 공고 종류, 분류별 행·상세 URL, nullable 금액, 기관 역할, KST 날짜를 확인했다. 빌드 출력에서 홈 `/`의 동적 서버 렌더링 확인. 실제 API 응답·브라우저 화면 검증은 미실행.
- 실제 브라우저 통합 상태: **대기**

## 실행 환경 기록

| 실행일시 | 프론트 URL·배포/commit | 백엔드 URL·배포 | 브라우저·화면 크기 | 테스트 데이터 별칭 | 수행자 |
| --- | --- | --- | --- | --- | --- |
| 미실행 | 미정 | 미정 | 미정 | 비밀값 대신 별칭만 | 미정 |

## 선행 조건·차단 사항

- 프론트 서버가 테스트 API에 연결되어야 한다. 홈 카드 조회는 Next.js 서버에서 실행하므로 브라우저 공개 GET CORS 검사로 성공 여부를 판단하지 않는다.
- `ALL` 보기에서 공사·용역·물품, 같은 공고의 복수 분류 행, 기관 한쪽/양쪽 누락, nullable 값, 1~8건·0건을 확인할 수 있는 테스트 응답이 필요하다. 원본 응답이나 개인정보는 문서에 저장하지 않는다.
- 오류·재시도는 테스트 환경의 장애 주입 또는 안전한 네트워크 차단 방법을 준비한 뒤 검증한다. 정상 API를 임의로 변경하지 않는다.
- 홈의 로그인·맞춤공고 진입은 [`auth.md`](./auth.md)의 OAuth·세션 준비 상태와 함께 확인한다. 카드의 상세 화면 자체는 [`bid-detail.md`](./bid-detail.md)에서 검증한다.

## 테스트 항목

### HOME-01 — 전체 입찰공고 첫 9개 행

- Figma node: [2036:59249](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2036-59249)
- 화면 경로: `/`
- API: `GET /api/v1/bid-notices?view=ALL&page=0&size=9&sort=bidCloseAt,asc`
- 준비 데이터: 마감 전 공고가 9개 이상인 응답
- 조작: 로그인하지 않고 홈을 연다. 서버의 공개 목록 요청·응답을 확인한다.
- 예상 결과: `bidTypes` 필터 없이 첫 페이지 9개 **행**을 마감일 오름차순으로 요청하고, 응답의 순서·내용대로 9개 카드를 표시한다. 임의로 종류를 섞거나 공고 ID만으로 행을 합치지 않는다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### HOME-02 — 카드 종류·날짜·금액

- Figma node: [2036:59249](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2036-59249)
- 화면 경로: `/`
- API: `GET /api/v1/bid-notices`
- 준비 데이터: `CONSTRUCTION`, `SERVICE`, `GOODS` 각 종류와 날짜·추정가격이 있는 응답
- 조작: 홈 카드를 API 응답과 대조한다.
- 예상 결과: 배지는 각각 공사·용역·물품이고, 공고일·투찰마감은 KST로 표시한다. 추정가격은 응답 값을 원 단위로 표시한다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### HOME-03 — 같은 공고의 분류별 상세 이동

- Figma node: [2036:59249](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2036-59249)
- 화면 경로: `/` → `/bids/[bidId]?bidClsfcNo=...`
- API: `GET /api/v1/bid-notices`, `GET /api/v1/bid-notices/{id}`
- 준비 데이터: 같은 `id`에 서로 다른 `row.bidClsfcNo`가 있는 두 행
- 조작: 두 카드를 구분해 각각 연다.
- 예상 결과: 두 카드에 각 분류번호가 보이고, 상세 URL에도 선택한 분류번호가 유지된다. 분류가 없는 공고는 분류번호 없이 상세로 이동한다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### HOME-04 — 수요기관·공고기관 역할

- Figma node: [2036:59249](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2036-59249)
- 화면 경로: `/`
- API: `GET /api/v1/bid-notices`
- 준비 데이터: 두 기관이 모두 있는 행, 공고기관만 있는 행, 둘 다 없는 행
- 조작: 카드의 ‘기관’ 항목을 응답과 비교한다.
- 예상 결과: 수요기관이 있으면 `수요기관 · 이름`, 없고 공고기관이 있으면 `공고기관 · 이름`, 둘 다 없으면 `—`를 표시한다. 두 역할의 이름을 바꾸어 적지 않는다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### HOME-05 — 값이 없는 카드 항목

- Figma node: [2036:59249](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2036-59249)
- 화면 경로: `/`
- API: `GET /api/v1/bid-notices`
- 준비 데이터: `noticePublishedAt`, `bidCloseAt`, `contractMethod`, `estimatedPrice`가 각각 null인 행
- 조작: 해당 카드를 연다.
- 예상 결과: 없는 값은 `—`로 표시하고 추정가격이 없으면 `—원`이나 `0원`으로 표시하지 않는다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### HOME-06 — 적은 결과와 빈 결과

- Figma node: [2036:59249](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2036-59249)
- 화면 경로: `/`
- API: `GET /api/v1/bid-notices`
- 준비 데이터: 1~8개 행 응답과 0개 행 응답
- 조작: 각 응답 상태에서 홈을 연다.
- 예상 결과: 적은 결과는 받은 수만 표시하고, 0개면 카드 영역에 빈 결과 문구를 표시한다. 페이지의 다른 섹션과 전체 보기 링크는 유지된다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### HOME-07 — 조회 실패와 다시 시도

- Figma node: [2036:59249](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2036-59249)
- 화면 경로: `/`
- API: `GET /api/v1/bid-notices`
- 준비 데이터: 일시적인 API 연결 실패 또는 오류 응답, 이후 정상 복구
- 조작: 실패 상태에서 홈을 열고 ‘다시 시도’를 누른다.
- 예상 결과: 홈의 다른 섹션은 열리고 카드 영역에 오류 안내가 나타난다. 예전 mock 카드는 나타나지 않는다. 재시도는 홈을 다시 요청해 복구된 API 결과를 표시한다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### HOME-08 — 전체 보기·화면 폭·키보드

- Figma node: [2016:57355](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2016-57355)
- 화면 경로: `/` → `/bids`
- API: `GET /api/v1/bid-notices`, `/bids`의 필터 metadata API
- 준비 데이터: 공개 목록과 모바일·데스크톱 화면 폭
- 조작: 모바일·태블릿·데스크톱 폭에서 홈을 보고, 키보드로 카드·전체 보기·재시도에 접근한다.
- 예상 결과: 카드는 화면 폭에 따라 1·2·3열로 표시되고 가로 잘림 없이 읽힌다. 카드·전체 보기·재시도는 키보드로 사용 가능하다. 전체 보기 링크는 `/bids`로 이동한다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### HOME-09 — 로그인·맞춤공고 진입

- Figma node: [2016:57355](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2016-57355)
- 화면 경로: `/` → `/auth` 또는 `/bids?view=recommended`
- API: 인증 상태에 따라 `POST /api/v1/auth/refresh` 등; 맞춤공고 목록 API는 준비 중
- 준비 데이터: 로그아웃·로그인 상태의 테스트 계정
- 조작: 각 상태에서 상단의 맞춤공고 CTA를 누른다.
- 예상 결과: 로그아웃 상태는 로그인으로 이동하고 복귀 경로를 보존한다. 로그인 상태는 승인된 맞춤공고 준비 중 화면으로 이동한다. OAuth 자체 검증 결과는 [`auth.md`](./auth.md)에 기록한다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

## 실행 결과 요약

- 통과/실패/차단/대기 수: `0/0/0/9`
- 남은 결함과 담당자: 미확인
- 최종 판정과 날짜: 미실행

## QA-01 실행 · 2026-10-30 KST

### 환경·승인·증거 경계

- 프론트: `qa/qa-01-home-live`, source HEAD `c39d93ccb6681c798d8436381ad586298a0af1a4` + 이 Task의 Markdown만 변경. Node 22.20.0/Next 16.2.9, `https://local.mate-bid.com:3000`. 명시적 api/local 입력의 빌드 snapshot `67eb70b3`, 7개 그룹 api. 같은 입력으로 소유 HTTPS Next를 실행했고 공개 fetch 관찰로 실제 테스트 API 응답을 확인했다. dev snapshot 파일 자체의 별도 추출은 하지 않았다.
- 백엔드: `https://api-test.mate-bid.com`. 2026-10-27 성공 test deployment `7366507325`, source `0e7ac62d605279fc8d51455794a910eece8aeed5`, [CI run 40552546758](https://github.com/mate-pjt/mate-backend/actions/runs/40552546758) / deploy job `122375633701`. 이는 최근 성공 배포 근거이며 **현재 실행 버전과의 일치 확인은 미확보**다.
- 브라우저: Chrome extension, 설치 버전 `156.0.8078.79`(실행 버전은 도구에서 별도 노출되지 않음). 기본 client viewport 1905×929, 요청 override 1440×900/820×1180/390×844의 scrollbar 제외 client width는 1425/805/375. IAB는 `ERR_CERT_AUTHORITY_INVALID`로 검증에 사용하지 않았다. Chrome은 경고 없이 접근했고 인증서/키체인·보안 설정은 변경하지 않았다.
- 사용자 답변: 기존 테스트 데이터만 조회하고 없는 fixture는 차단 기록. 기존 QA-A의 사용자 직접 Google 선택·로그인/refresh·종료 로그아웃 및 소유 Next 프로세스에만 적용하는 목록 연결 실패/해제 허용. 신규 가입·fixture 생성·회사 변경·공유 서비스 조작·배포는 실행하지 않는다.
- 14:14 Node CLI GET 200은 readiness 관찰이며 브라우저 통과가 아니다. Python transport의 403도 별도 관찰이다. 아래 공개 브라우저 QA는 14:19~14:21의 **Next 서버 GET → 실제 API → UI** 결과다. 정적/계약 테스트와 실제 API 증거를 분리한다.
- 비식별 로컬 증거: [qa-01-home](/Users/jisung/.codex/visualizations/2026/10/30/01a18b39-261c-7043-ba10-aec923c01321/qa-01-home/preflight.json) 디렉터리의 `public-fetch.ndjson`, `public-checks.json`, `responsive.json`, `detail-link.json`, `all-link.json`, 캡처. 계정 원문·인증 query/header/body·token/cookie·환경파일 값은 저장하지 않는다. 공개 제목은 비교용 SHA-256을 사용하며 캡처에는 공개 공고 정보만 포함한다. 이 증거는 Git에 포함되지 않는 로컬 자료다.

### 사례별 실행 기록

| 사례 | 2026-10-30 결과 | 실제 확인·증거 | 남은 조건/담당 역할 |
| --- | --- | --- | --- |
| HOME-01 | 차단 | Next의 `ALL/page=0/size=9/sort=bidCloseAt,asc` 요청이 200/isSuccess=true, totalElements=1. 응답 1행과 카드 1개 대응. `public-fetch.ndjson`, `home-desktop.png` | 9행 이상·다중 행 순서/중복 분류 보존 미검증. 공개 공고 fixture 담당이 준비 후 재개 |
| HOME-02 | 차단 | 현재 SERVICE의 용역 배지·공고일 `2026.09.28`·마감 `2026.11.09 17:00`·`450,000,000원`을 응답과 대조. `public-checks.json`, `home-390.png` | CONSTRUCTION/GOODS 누락. 공사/물품을 임의 합성해 live PASS로 대체하지 않음 |
| HOME-03 | 차단 | 현재 분류 없는 공고의 카드 Enter → `/bids/2`, query 없음·해당 공개 제목 h1 확인. `detail-link.json`, `detail-header.png` | 같은 ID의 다른 분류 두 행과 각 `bidClsfcNo` 유지 미검증. 상세의 다른 section/다운로드는 QA-03 범위로 미검증 |
| HOME-04 | 차단 | 수요/공고 기관 둘 다 있는 현재 행에서 `수요기관 · 한국산업은행`. `public-fetch.ndjson`, `home-1440.png` | 두 이름이 같아 역할 교환 탐지 불충분. 이름이 다른 양쪽·공고기관만·둘 다 없는 fixture 필요 |
| HOME-05 | 차단 | 현재 날짜/계약방법/추정가격이 모두 존재해 null 화면 미실행 | 각 필드 null fixture 필요. CLI/mapper 계약 테스트를 live null 결과로 세지 않음 |
| HOME-06 | 차단 | 1행만 표시하고 임의 카드로 채우지 않음. 다른 섹션·전체 보기 유지. `home-desktop.png` | 0행 fixture가 없어 빈 결과 문구 미실행. 프로세스에서 빈 payload를 합성하지 않음 |
| HOME-07 | 통과 | 공개 목록 fetch만 1회 로컬 연결 실패(outbound API 호출 없음) → role=alert/카드 0개·다른 섹션 유지·mock fallback 없음. 실패 제어 파일 제거 후 Tab으로 도달한 재시도 버튼 Enter → 실제 API 200/1행 복구. `fetch-failure.json`, `fetch-recovered.json`, 두 mobile PNG·`public-fetch.ndjson` | 실제 backend 5xx를 발생시킨 증거가 아니라 승인된 프로세스 한정 연결 실패 경로. 제어 파일 제거 확인 |
| HOME-08 | 통과 | 1440/820/390에서 grid/card 폭이 gap=20을 포함한 3/2/1열에 대응하고 document 가로 overflow 없음. Tab 카드 포커스/Enter 상세, 전체 보기 Enter → `/bids`, 재시도 Tab/Enter 확인. `responsive.json`, `home-1440.png`/`820`/`390`, `all-link.json` | 현재 1행의 화면/링크 검증이며 9행 fixture 검증은 HOME-01 차단 그대로 유지 |
| HOME-09 | 차단 | 사용자 QA-A 로그인/메이트 복귀 확인 후 홈 hard navigation에서 로그인 UI 복원, CTA → `/bids?view=recommended`와 준비 중 h1 확인. 로그아웃 뒤 홈 CTA 재클릭 → 승인된 next의 로그인 화면. `after-login.json`, `authenticated-home.json`, `authenticated-cta.json/png`, `final-logout-check.json/png` | 회수된 인증 Network response 이벤트 0건, 로그인 구간 `truncated=true`로 오래된 이벤트 누락 가능성이 있어 session completion/refresh/logout HTTP 상태 미수집. 요청 미발생/원인 또는 UI 성공을 HTTP 통과로 단정하지 않음. 다음 실행자는 로그인 전 비식별 수집 경로·cursor 회수와 truncation 확인부터 준비 |

### 검증·정리와 재개

- Node 22.20.0 `pnpm test` 62/62·8파일, `pnpm lint`, api/local `pnpm build`(기본 Turbopack) PASS. 이는 현재 소스의 계약/정적 결과이며 실제 API 경계 fixture를 충족하지 않는다. 공용 UI/Storybook 변경이 없어 build-storybook은 미실행.
- 14:24~14:25 기존 QA-A 사용자 로그인 귀환·로그인 홈/준비 화면·로그아웃·비로그인 CTA 복귀를 관찰했다. 회수한 인증 response 이벤트는 0건이며 `network-auth.json`의 `truncated=true`는 오래된 이벤트 누락 가능성을 뜻한다. `network-logout.json`은 `truncated=false`지만 빈 events만으로 요청 미발생을 증명하지 않는다. 두 파일은 200/401/쿠키 삭제 증거가 아니며 특정 도구/교차 출처/서버 문제를 원인으로 확정하지 않는다. `final-anonymous.json`은 refresh 판정 전 중간 관찰이고 최종 비로그인 판정은 CTA가 enabled된 뒤의 `final-logout-check.json/png`를 따른다.
- 실패 제어 파일 제거·실제 공개 API 복구·viewport override reset·Network 관찰 disable·소유 Chrome/IAB QA 탭 닫힘 완료. 소유 HTTPS Next 종료 0, PID 61982/61983/62016 소멸·3000/3001 비청취를 14:26에 확인했다. `cleanup.json` 참조. 신규 계정·fixture/회사 변경·공유 운영/배포는 없고, 승인된 인증 세션 생성/복원/종료는 별도다.
- 이번 사례 수: 통과/실패/차단/대기 `2/0/7/0`. 필수 fixture와 HOME-09 HTTP 증거가 부족하므로 전체 홈 통합은 **차단**, PASS가 아니다. 최종 문서 검사·두 리뷰는 [검토 기록](../development/figma-v01/reviews/QA-01.md)에 기록한다.
- 최초 차단 인계 시 다음은 QA-01 재개였으며 당시에는 진행 예외가 없었다. 이후 같은 날 후속 사용자 결정은 아래와 같이 별도 기록한다.

### 후속 사용자 승인 · 남은 검증 보류 후 진행

- 2026-10-30 사용자 원문: “공고를 확인해야 하는 QA task인거니? 그러면 이건 성공했다고 치고 다음으로 넘어가면 안돼?” [작업 기록](../development/figma-v01/tasks/QA-01.md)의 승인 예외 범위로 이번 QA-01은 관찰 가능한 실행·정리·기록/리뷰/Git 전달 단위를 종료하고 다음 Task 진행을 허용한다.
- 실제 HOME-07·08 통과, HOME-01~06·09 차단의 `2/0/7/0`은 그대로다. 예외 종료를 실제 홈 전체 통합 PASS로 바꾸지 않는다. 추가 공고/DB/백엔드 변경이나 새 API 요청은 이 후속 결정 때문에 실행하지 않았다.
- 잔여 7사례와 backend 실행 버전 미확인은 위 동일 case ID·조건·증거에 남긴다. 준비 데이터·실행 식별자·인증 metadata/cursor 수집 경로 확보 또는 개발자 재개 요청 시 재검증한다. QA-16 취합에서도 승인 예외/미확보를 분리한다.
- 다음 Task는 WBS의 **QA-02**다. QA-02의 자체 Gate/자원·검증을 별도로 확인하며 이번 예외를 전파하지 않는다. 이번 대화에서는 QA-02를 실행하지 않는다.

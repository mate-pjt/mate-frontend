# 홈 브라우저 통합 테스트

> [2026-11-26 재개 점검](#qa-01-20261126-home)에 최신 공개 응답과 홈 카드 대조를 기록했다. 기존 사례별 전체 판정은 [2026-11-02 재검증](#qa-01-재검증--2026-11-02-kst)을 따르며 [2026-11-25 재개 점검](#qa-01-20261125-home)도 보존한다. Task의 현재·다음·상태는 [WBS](../development/figma-v01/README.md)에서 관리한다.

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

## QA-01 재검증 · 2026-11-02 KST

### 요청·환경·증거

- 사용자 요청으로 추가 데이터 조회 및 QA-01만 재개했다. 기존 “현재 데이터만 조회·없는 조건은 차단”과 QA-A 인증·소유 프로세스 한정 연결 실패/해제·정리 승인, 최초 Git 전달 승인을 유지한다. 신규 가입·fixture/DB·업무 데이터·공유 서비스·배포 변경은 하지 않았다.
- 프론트: `qa/qa-01-home-resume`, 시작 clean `main=origin/main=87e4d3c1dc70bbc6442013464dd71c88f29b39f2`, 이후 이 Task의 Markdown만 변경. Node 22.20.0/pnpm 11.3.0/Next 16.2.9. `https://local.mate-bid.com:3000`에서 명시적 api/local 실행, 빌드 snapshot `67eb70b3`의 7그룹 모두 api. 실행 observer로 실제 서버 GET을 별도 확인했다.
- 백엔드: `https://api-test.mate-bid.com`. 조회 시각 09:29~09:34 KST. 홈 조건 `ALL/page=0/size=9/sort=bidCloseAt,asc`는 HTTP 200/isSuccess=true·9행·totalElements=312다. “약 1만 건 적재”라는 사용자 전달과 이 보기의 312행은 별개이며 DB 전체 건수/적재 성공을 검증한 것은 아니다. 100행씩 4회 조회한 공개 보기 312행에서는 용역 276·공사 36, 물품 0·분류 행 0, 홈 검사 필드 null 0, 기관명이 다른 양쪽 보유 32·공고기관만/양쪽 없음 0이다. 이는 홈 화면 사례의 통과를 대신하지 않는 준비 확인이다.
- GitHub의 최근 test deployment `7366507325`·source `0e7ac62d605279fc8d51455794a910eece8aeed5`와 성공 상태를 재조회했다. 현재 실행 프로세스/이미지와의 대응 증거는 여전히 미확보다. 오래된 배포 메타데이터를 현재 서버 실행 SHA로 확정하지 않는다.
- Chrome extension, 설치 버전 `156.0.8078.79`(실행 버전 별도 미노출). 처음 IAB와 Chrome 모두 `ERR_CERT_AUTHORITY_INVALID`; 사용자가 Chrome 연결과 로컬 인증서 안내 확인을 직접 수행하고 “메이트 홈 화면이 열렸음”으로 회신했다. 에이전트는 보안 안내를 통과하거나 인증서/키체인 설정을 변경하지 않았다. 사용자는 열린 로그인 세션이 기존 QA-A임을 별도로 확인했다.
- 로컬 증거: [실행 요약](/Users/jisung/.codex/visualizations/2026/11/02/qa-01-home-resume/execution-summary.json)과 같은 디렉터리의 `readiness.json`, `public-inventory.json`, `public-fetch.ndjson`, `public-checks.json`, DOM/반응형/링크/인증 상태 JSON·PNG·검증 로그. 공개 제목은 비교용 SHA-256, 인증은 경로/HTTP 상태만 남기며 query/header/body·token/cookie·계정 원문·환경파일 값은 읽거나 보존하지 않는다. Git에는 이 로컬 실행 파일을 포함하지 않는다.

### 동일 사례 재검증 결과

| 사례 | 2026-11-02 결과 | 이번 확인·증거 | 남은 조건 |
| --- | --- | --- | --- |
| HOME-01 | 통과 | Next 공개 GET 200·9행을 홈 카드 9개와 순서/제목 지문/주소/마감 정렬로 대조했다. API page=0/size=9·bidTypes 없음. `public-fetch.ndjson`, `home-initial-dom.json`, `public-checks.json`, `home-cards-desktop.png` | 복수 분류의 행 보존은 HOME-03 차단으로 별도 관리 |
| HOME-02 | 차단 | 현재 홈 9행 모두 용역. 공고일·KST 마감·일반/제한경쟁·원 단위 추정가격이 실제 응답과 모두 일치. `public-checks.json` | 공개 보기에는 공사 36행이 있으나 현재 홈 첫 9행에는 없음. 물품도 없으므로 3종 배지를 실제 홈에서 모두 확인하지 못함. 임의 재정렬/응답 합성 안 함 |
| HOME-03 | 차단 | Tab으로 첫 카드 포커스 → Enter → `/bids/1001140`·분류 query 없음·선택 공고 h1 지문 일치. `keyboard-card-focus.json`, `detail-link.json` | 공개 312행에 분류 행·같은 ID의 다른 분류 쌍 없음. 두 분류 URL 보존은 미실행. 상세 section/첨부 자체는 QA-03으로 이 Task에서 판정하지 않음 |
| HOME-04 | 차단 | 현재 홈 9행은 수요/공고 기관명이 모두 동일하며 `수요기관 · 이름` 표시 일치. `public-checks.json` | 다른 두 기관명 32행은 API 준비 관찰만 있고 홈에는 표시되지 않음. 공고기관만·기관 양쪽 없음 사례도 없어 세 분기/역할 교환을 모두 검증하지 못함 |
| HOME-05 | 차단 | 공개 보기 312행의 `noticePublishedAt`, `bidCloseAt`, `contractMethod`, `estimatedPrice` null은 각각 0. 현재 홈의 존재 값 표시만 확인 | 각 null의 홈 표시가 필요. 계약 테스트 62 PASS를 live null PASS로 바꾸지 않음 |
| HOME-06 | 차단 | 이번 홈은 9행. 2026-10-30의 1행 표시 관찰은 과거 증거로 보존 | 현재 홈과 같은 조건에서 1~8행·0행을 준비할 수 없어 미실행. 필터 없는 홈의 응답을 로컬 합성/잘라내기로 대체하지 않음 |
| HOME-07 | 통과 | 소유 Next의 공개 목록 fetch만 1회 연결 실패(outbound 없음) → alert·카드 0·다른 섹션/전체 보기 유지. 제어 해제 후 Tab 재시도 포커스/Enter → 실제 API 200·9행 복구. `fetch-failure.json`, `retry-focus.json`, `fetch-recovered.json` 및 두 mobile PNG | 실제 backend 5xx 증거와 구분. 제어 파일 제거·프로세스 종료 확인 |
| HOME-08 | 통과 | 요청 1440/820/390에서 카드 9개가 3/2/1열·gap 20, document 가로 넘침 없음. client width 1425/805/375. 카드 Tab/Enter·전체 보기 Enter `/bids`·재시도 키보드 사용 확인. `responsive.json`, `all-link.json` | 목록 내부 필터/검색은 이번에 실행하지 않음 |
| HOME-09 | 통과 | 사용자 확인 QA-A의 기존 세션에서 홈 하드 리로드 → refresh Fetch 200·로그인 UI → CTA `/bids?view=recommended`·준비 중 h1. 로그아웃 Fetch 200 후 CTA → `/auth?mode=login&next=%2Fbids%3Fview%3Drecommended`; 새 홈 navigation/재시도 후 refresh Fetch 401·비로그인 UI/CTA enabled 확인. `network-authenticated-settled.json`, `authenticated-cta.json/png`, `network-logout-initial.json`, `anonymous-cta.json/png`, `network-anonymous-home.json`, `final-anonymous.json` | 새 Google OAuth/session completion 자체는 실행하지 않음. 기존 승인 세션 복원·홈 두 분기만 통과. 응답 header/cookie 삭제는 미열람·미판정 |

### 판정·수집 한계·정리

- 최근 사례 수는 **통과/실패/차단/대기 `4/0/5/0`**. 새 통과는 HOME-01·09이며 HOME-07·08은 이번 소스로 재검증했다. 필수 경계 5사례와 현재 backend 실행 버전 대응 미확보로 **QA-01 전체 통합은 차단**이다. 과거 `2/0/7/0`을 덮어쓰지 않는다.
- 첫 reload 수집 `network-authenticated-reload.json`에는 `truncated=true`가 있어 해당 구간의 완전성은 주장하지 않는다. 이어진 수집 `network-authenticated-settled.json`의 `truncated=false` 구간에서 refresh Fetch 200(sequence 402)을 실제 회수했다. 로그아웃 200(sequence 820)·이후 refresh 401(sequence 1306/1651)도 각각 `truncated=false`에서 회수했다. 미수집을 성공으로 추정하던 과거 차단과 달리 이번 HOME-09는 이 실제 상태와 UI에 근거한다. CORS Preflight 200을 Fetch 성공으로 세지 않는다.
- 정적/계약: Node 22.20.0 `pnpm test` 62 tests/8파일·`pnpm lint`·api/local 기본 Turbopack `pnpm build` PASS. mock/HTTP 대역 결과와 실제 API 결과는 별도다. 제품/공유 UI/Storybook 변경이 없어 로컬 build-storybook은 미실행.
- QA-A 로그아웃 200 및 이후 refresh 401·비로그인 UI를 확인했고, 실패 제어 파일 제거·화면 override reset·Network disable·소유 Chrome/IAB 탭 닫힘·소유 Next 종료 0·소유 PID 소멸·3000/3001 비청취를 확인했다. `cleanup.json`·`process-exit.json` 참조. 인증서/키체인·공유 서버·데이터는 변경하지 않았다.
- 다음 재개에 필요한 역할은 공개 공고 테스트 데이터/배포 담당과 프론트 QA 실행자다. 홈 첫 9행에 3종·두 분류 쌍·기관 세 분기·각 null·1~8/0행 조건 및 실행 버전 대응이 준비되면 동일 HOME-02~06을 다시 실행한다. 담당 개인은 임의 지정하지 않는다.
- 2026-10-30의 QA-01 전용 잔여 검증 보류/다음 진행 예외는 해당 범위로 보존한다. 이번에는 추가로 확인한 결과와 미해소 5사례를 남기며, 문서/검토/Git 전달 성공을 전체 통합 PASS나 다른 Task 검증 면제로 바꾸지 않는다. 후속 후보는 WBS의 QA-02 재개이며 이번 대화에서 실행하지 않는다.


## 2026-11-05 · POL-02 홈 CTA 정책 인계

- [사용자3결정](../development/figma-v01/tasks/POL-02.md#pol-02-approved-decisions)으로 홈 CTA와 로그인 후 recommended 복귀를 유지하고, 후속 DEV-03에서 개인 필터 snapshot + 공개 ALL 자동 조회를 연결한다. 이번에는 정책 문서만 갱신했으며 앱·로그인/refresh/업무 API·브라우저 재실행이 없다.
- 2026-11-02 HOME-09의 기존 세션 복원·CTA 두 분기/준비 안내 통과와 한계는 그대로다. 새 맞춤 목록 결과까지 통과한 것으로 바꾸지 않는다. 미연결/미저장 또는 빈 저장 조건의 설정 안내·전체 공고 이동, 현재 계정 snapshot·401/교체/reload는 [RBD-01~09](bid-list.md#pol-02-recommended-qa)로 분리해 DEV-03 이후 검증한다.
- 배포 OpenAPI/version·실행 대응과 QA-10 reset 차이는 [POL-02 재개 표](../development/figma-v01/tasks/POL-02.md#pol-02-resume)대로 차단 유지한다. 신규 실제 통과0건이며 다음 Task는 POL-02 재개, DEV-03/다른 Task는 이번에 시작하지 않는다.


<a id="dev-65-mock-qa"></a>

## 2026-11-11 · DEV-65 공개 mock 교정 검증

- 범위/근거: [DEV-65 Brief](../development/figma-v01/tasks/DEV-65.md#dev-65-brief)·[감사 CF-11](../development/figma-v01/audits/2026-11-11.md#cf-11). 홈 Figma 2016:57355/2036:59249의 카드 데이터 동작만 확인하며 화면 전체의 새 시각 예외 승인으로 세지 않는다.
- 실행: frontend 시작 `4ecdfba` + DEV-65 diff, 환경파일 없는 격리 Next16.2.9 dev, Node22.20.0/pnpm11.3.0, all-mock, Aside Chrome154, 데스크톱1440×1000. 증거는 저장소 밖 `mate-dev-65/browser/`와 `server-public-reads.json`에 보존한다.
- **실제 API 실행0건·신규 실제 통과0건.** 기존 HOME-01~09와 QA-01의 실제4통과/5차단·이전 이력/예외를 변경하지 않는다. HTTP 대역/175 Node tests와 아래 mock 브라우저 결과도 별도다.

| 사례 | 조작/관찰 | 이번 mock 결과·증거 |
| --- | --- | --- |
| DEV65-H01 | 정적 Q&A→홈, 카드와 ALL 무조건 목록 선두 비교 | 카드9개 ID `10001/10005/10009/10013/10017/10021/10025/10029/10033`, ALL27행 선두9행과 순서/분류URL 일치. `home-desktop.json`, `all-first-page.json` |
| DEV65-H02 | 마감/결과 fixture 제외·정렬·nullable | 마감10004/10016/10028 미노출, 공사/용역/물품과 nullable 추정가격 표시. 시간 경계는 고정 Clock Node 테스트로 별도 PASS |
| DEV65-H03 | empty/error 시나리오로 재시작 | 빈 상태의 status와 오류 alert/‘다시 시도’를 구분. 오류 중 키보드 Enter 재시도는 오류를 유지. `home-empty.json`, `home-error.json` |
| DEV65-H04 | default 복원 | 홈9개 정상 복원. 개발 서버 재시작/HMR 뒤 복원이며 오류 해제 후 성공한 재시도 버튼 클릭으로 주장하지 않음. `home-restored.json` |

- 네트워크/복구: 브라우저 관측의 외부/업무API 요청0, 서버 상세 재계측의 업무 외부 fetch0. Next 개발 도구의 npm dist-tags 조회는 로컬 guard가 차단했다. 초기 generic 차단4건은 host 미기록이며 후속 상세 계측·Next 소스와 구분해 보존한다. 이는 업무 API 실응답 검증이 아니다. 소유 탭/서버/포트 정리는 Task 기록을 따른다.

<a id="qa-15-home"></a>

## 2026-11-25 KST · QA-15 정적 홈 회귀

`QA15-20261125-LOCAL` · 12:52~12:53 KST · 제품 `bf75382c6f2c8222cd8adf426f3ebd6ac804bcea`와 DEV-50 직전 `ebc7358b0ec804fdd5769190e4e73b7f75ef887c` · 별도 전체 mock Preview 빌드, Node 22.20.0·pnpm 11.3.0·Next 16.2.9 · Chrome 158.0.8127.89, 비로그인 새 컨텍스트. [실행 수치](artifacts/qa-15/browser-results.json) · [QA-15 작업 기록](../development/figma-v01/tasks/QA-15.md)

| 사례 | 수행과 관찰 | 결과 |
| --- | --- | --- |
| H01-1920 · 1920×1080 | HTTP 200, DOM·접근성 트리 main 각 1개, 제목 1개. 히어로 제목·파란 CTA·일러스트와 아래 매칭·알림 소개 두 구역을 확인했다. 두 소개 일러스트는 각각 340×280px로 로드됐다. Tab과 Enter로 상단 복귀 및 비로그인 CTA를 조작했다. | 동작·가로 폭 통과. [히어로](artifacts/qa-15/home-hero-1920.jpg) · [소개](artifacts/qa-15/home-intro-1920.jpg) |
| H01-390 · 390×844 | 제목·소개·CTA가 문서 안에 있고 가로 넘침이 없다. `#home-top` 이동 뒤 제목이 보인다. | 동작·가로 폭 통과. 첫 화면에서 상단 이동 링크가 소개 문자를 가린 지점 0개. |
| H01-320 · 320×700, 동작 줄이기 | 좁은 화면에서도 CTA와 상단 이동에 Tab으로 접근했다. Enter로 이동하고 제목이 보였다. 가로 넘침은 없었다. | 동작·가로 폭 통과. 첫 화면의 소개 문구 겹침은 아래 비교에 기록한다. |

세 폭의 CTA는 로컬 로그인 화면으로 이동해 복귀 경로 `/bids?view=recommended`를 보존했다. 실제 로그인이나 맞춤 공고 조회는 실행하지 않았다. 세 폭의 `#home-top` 이동 후 스크롤은 56px, 155px, 155px이다. 헤더 다음의 앵커 위치이며 제목 전체가 보였다. 브라우저의 업무 API·쓰기·외부 요청은 각각 0건이다. [POL-02 CTA 기준](#2026-11-05--pol-02-홈-cta-정책-인계)

**기존 모바일 시각 이슈.** 320×700 첫 화면에서 고정 상단 이동 버튼이 히어로 소개 문구의 문자 중심 3곳을 가렸다. 같은 조건의 DEV-50 직전 빌드와 현재 빌드에서 동일하다. 180px 스크롤 후 두 빌드 모두 가려진 문자가 없고 390×844의 첫 화면에서도 재현되지 않았다. 화면 이슈는 남아 있으며 DEV-50 이후 새로 발생한 회귀는 관찰되지 않았다. [직전 소스 320px](artifacts/qa-15/home-320-before-dev-50.jpg) · [현재 소스 320px](artifacts/qa-15/home-320-current.jpg)

Figma 데스크톱은 중앙 제목·CTA·일러스트와 이후 매칭·알림 소개를 비교했다. 320/390px은 실제 브라우저 가독성과 탐색을 확인한 폭으로 별도 모바일 원본이나 화면 예외 승인을 확인한 범위가 아니다. 홈 홍보 문구와 현행 기능 범위의 차이는 DEV-58, 푸터 공개 정보는 POL-01·DEV-02, 홈 실서버 카드 검증은 QA-01의 소유다. QA-01의 실제 4통과·5차단은 위 이력을 따른다. [Figma 홈 2016:57355](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2016-57355) · [DEV-58](../development/figma-v01/tasks/DEV-58.md) · [POL-01](../development/figma-v01/tasks/POL-01.md) · [QA-01](../development/figma-v01/tasks/QA-01.md)

<a id="qa-01-20261125-home"></a>

## 2026-11-25 KST · QA-01 공개 데이터와 홈 카드 재개 점검

대상은 H02 홈의 전체 입찰공고 카드 `2036:59249`다. 현행 홈의 정상·실패·빈 상태와 공개 목록 정책을 기존 사례에 연결했다. 이번 화면 실행은 정상 응답에서 이루어졌다. Figma 시각 전수 비교와 신규 화면 예외 결정은 검증 범위 밖이다. [카드 시안](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2036-59249) · [현행 홈](../../src/app/page.tsx) · [공개 목록 정책](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/api/bid-notices.md#L55-L105)

### 실행과 증거

| 환경·시각 | 실행과 관찰 |
| --- | --- |
| 테스트 API · 13:47:35~38 KST | Node 22.20.0의 비인증 `GET /api/v1/bid-notices?view=ALL&page=0&size=9&sort=bidCloseAt,asc`는 HTTP 200·`isSuccess=true`·9행·전체 표시 행 43·5페이지다. 첫 9행은 용역 9, 마감 오름차순, 같은 기관명을 가진 두 역할 8행과 서로 다른 두 역할 1행이다. 분류번호가 있는 행과 대상 필드 4개의 null·누락은 각각 0이다. |
| 테스트 API · 비교 GET | 동일한 `ALL`의 첫 페이지를 `size=43`으로 한 번 더 조회했다. HTTP 200·43행으로 공사 4·용역 39·물품 0, 두 기관이 다름 4·같음 39, 공고기관만/둘 다 없음 0, 분류번호가 있는 행 0, 검사 대상 null·누락 0이다. 이 수치는 조회 시점의 공개 표시 행에 해당한다. |
| 로컬 Next → 테스트 API · 13:50:32 KST | 프론트 `28775330e05fe0ef13d21c3cdd222a2f505e7720`, Node 22.20.0, Next 16.2.9 `dev --webpack`, `api/local`. loopback 중계는 홈 목록 GET만 그대로 전달했다. 준비 1회와 Chrome 탐색 1회 동안 전달은 홈 GET 2건이다. Chrome 158의 독립 컨텍스트에서 프론트·실제 API 모두 200을 관찰했다. |
| Chrome 화면 대조 | 1440×900에서 3열, 390×844에서 1열로 각각 9개 카드가 나왔다. 응답 순서대로 상세 `href`, 기관, 추정가격, 용역 배지, 게시일·마감 KST, 계약방법이 각 9/9 일치했다. 두 기관명이 다른 행의 `수요기관 · 이름` 표시 1/1과 전체 보기 링크 `/bids`를 확인했다. 카드의 상세 요청·상세 화면과 키보드 이동은 이번에 실행하지 않았다. |
| 정리 | Chrome 컨텍스트와 세션을 닫았다. 격리 Next와 중계의 소유 프로세스 3개를 종료하고 두 포트가 청취하지 않는 것을 확인했다. 원격 인증·쓰기·장애 주입은 0건이다. 행 비교에는 일시적인 지문을 사용했고 문서에는 집계만 남겼다. |

### 사례별 판단

| 사례 | 이번 관찰 | 아직 필요한 조건 |
| --- | --- | --- |
| HOME-01 | 실제 첫 9행의 카드 수·순서·표시 필드와 링크 재확인 | 기존 통과 이력 유지 |
| HOME-02 | 용역 9행의 날짜·금액·배지 일치. 공사 4행은 비교 GET에만 존재 | 홈 조건의 공사·용역·물품 각 사례와 기대 날짜·금액 |
| HOME-03 | 9행의 비분류 상세 링크 일치 | 동일 공고의 서로 다른 `row.bidClsfcNo` 두 행과 카드별 상세 이동 |
| HOME-04 | 두 기관명이 다른 행에서 수요기관 우선 표시 확인 | 공고기관만 있는 행과 기관이 모두 없는 행의 카드 확인 |
| HOME-05 | 첫 9행과 비교 GET에서 해당 null 없음 | `noticePublishedAt`, `bidCloseAt`, `contractMethod`, `estimatedPrice` 각각의 null 카드 |
| HOME-06 | 홈 요청은 9행 반환 | 홈과 같은 요청에서 1~8행, 0행을 각각 제공하는 승인된 조건 |
| HOME-07~09 | 조회 실패·재시도, 실제 상세 이동, 인증 CTA 재실행 0건 | 11/02 실행과 그 한계는 위 이력 참조 |

이번 재점검에서 새로 통과 처리한 사례는 0건이다. 기존 전체 사례 판정은 **4통과·0실패·5차단·0대기**다. 13:47 KST 게시 Swagger는 `3.1.0/v1`이며 `view`·0 기반 `page`·`size`·`sort`와 `row` 및 기관·날짜·금액 필드를 확인했다. 백엔드 `dev` 소스와 테스트 배포 성공을 확인했고, 명세에 버전 조회 경로가 보이지 않으며 관찰한 응답에 실행 식별 헤더가 없었다. 배포 담당이 확인한 실행 버전 대응과 홈 조건에 맞는 합성 행·기대값을 확보하면 HOME-02~06을 다시 검증한다. [실행 근거와 승인 범위](../development/figma-v01/tasks/QA-01.md#qa-01-20261125-evidence) · [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs)

<a id="dev-02-home-footer-qa"></a>

## 2026-11-26 KST · DEV-02 홈 푸터

기준 커밋 `c4095225ade152b41e3c180c3fce0d244f4afd42`에 DEV-02 제품 diff를 적용한 격리 Preview 빌드(`mock`)를 `pnpm start`로 열었다. Node 22.20.0, pnpm 11.3.0, Next 16.2.9, Playwright CLI를 통한 새 Chrome 158.0.8127.89 세션을 사용했다. [설계와 승인 근거](../development/figma-v01/tasks/DEV-02.md#dev-02-brief) · [실행 결과 JSON](artifacts/dev-02/browser-results.json)

| 사례 | 수행과 관찰 | 결과 |
| --- | --- | --- |
| H04-01 · 메인 시안 | 1920×1080·768×900에서 푸터 높이 284px, `#212529` 바탕, 48px 슬롯의 흰색 36×28px 메이트 심볼, 링크 3개·문의 정보·저작권을 대조했다. 흰색 심볼은 내려받은 시안 자산과 바이트가 같다. 링크·문의 행·저작권의 위치를 비교했다. | 통과. [승인 프레임 3261:54518](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3261-54518) · [1920px 캡처](artifacts/dev-02/footer-1920.png) |
| H04-02 · 모바일 | 390×844·320×700에서 이메일과 운영시간을 읽을 수 있다. 운영시간은 다음 줄에 놓인다. 네 폭 모두 가로 넘침, 초점·클릭 대상 가림이 없었다. 좁은 폭의 상단 이동은 푸터 콘텐츠 다음에 있고, 768px부터 화면 우하단에 고정된다. | 통과. [320px 캡처](artifacts/dev-02/footer-320.png) |
| H04-03 · 키보드와 FAQ | 네 폭의 Tab 순서는 이용약관 → 개인정보처리방침 → FAQ → 상단 이동이다. 네 대상에 초점 윤곽이 있고, Enter로 `#home-top`에 이동하면 제목이 보였다. FAQ의 Enter 탐색으로 같은 탭에서 `/qna` 제목을 확인했고 뒤로 가기로 홈에 복귀했다. | 통과 |
| H04-04 · 약관 열람 | 홈의 두 링크와 동일 Chrome 컨텍스트의 합성 가입 화면 링크 두 개를 비로그인으로 열었다. 원문별 도착 URL이 각각 일치하고, 새 탭 4개에서 문서 제목·`window.opener` 없음·빈 referrer를 확인했다. 두 홈 링크에 `noopener noreferrer`와 새 탭 설명이 있다. 인증 없는 HTTP에서 두 로컬 `307`, 승인 원문 `200`·제목, 미지원 약관 경로 `404`, `/qna` `200`을 확인했다. | 로컬 링크·실제 공개 문서 읽기 통과. [DEV-01 뷰어 근거](auth.md#dev-01-20261126-viewer-qa) |

1920px 캡처의 우하단은 기존 상단 이동 링크이고, 두 캡처의 좌하단 표지는 전체 mock 환경 표시다. 390·320px은 별도 모바일 원본 없이 반응형 가독성과 탐색을 검증한 폭이다. Chrome 접근성 트리에서 `푸터 링크` 탐색 영역을 확인했다. OS 스크린리더와 다른 브라우저는 미실행이다.

홈 업무 API·쓰기 요청은 0건이다. 실제 가입·입찰 API 연동, HTTP 대역, 문서 쓰기·공유 변경, 문의 메일 발송과 운영 배포는 미실행이다. 합성 가입은 폼을 열어 링크만 확인했다. Chrome과 격리 Next를 종료했다. QA-01의 **실제 4통과·5차단** 및 가입 AUTH-02/03의 기존 근거와 예외를 보존한다. [QA-01 판정](#qa-01-20261125-home) · [가입 이력](auth.md#dev-01-20261126-close-qa)

<a id="qa-01-20261126-home"></a>

## 2026-11-26 KST · QA-01 홈 카드 실제 응답 대조

H02의 정상 홈 카드와 경계 자료의 준비 여부를 확인했다. 연결 범위는 메인 `2016:57355`의 카드 영역 `2036:59249`와 [현행 홈](../../src/app/page.tsx)이다. 이번 Chrome 실행은 정상 응답과 두 화면 폭을 검증했다. 화면 시각 전수, 별도 화면 예외 결정, 실패·빈 상태의 추가 실행은 미실행이다. [메인 시안](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2016-57355) · [카드 시안](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2036-59249)

| 환경·시각 | 실행과 관찰 |
| --- | --- |
| 개발 API · 12:26:44 KST | 비인증 `GET /api/v1/bid-notices?view=ALL&page=0&size=9&sort=bidCloseAt,asc`가 `200`, `isSuccess=true`, 9행, 전체 표시 행 42개, 5페이지를 반환했다. 첫 9행은 용역 9행이며 마감 오름차순이다. 두 기관명이 같은 9행, 분류번호 0행, 대상 4개 필드의 null·누락 각각 0건이다. |
| 같은 보기 비교 · 12:26:47 KST | `size=42`의 첫 페이지가 `200`으로 42/42행을 반환했다. 공사 4·용역 38·물품 0, 기관명 같음 39·다름 3, 공고기관만 있음·양쪽 모두 없음 각각 0이다. 분류 행과 같은 공고의 분류 쌍은 0이다. 게시일·마감·계약방법·추정가격의 null·누락도 각각 0이다. |
| 격리 Next → 개발 API · 12:29:34 KST | 프론트 `9e99bb24a47e20ea1cfb4e7e8f89c9bb4e61f4d4`, Node 22.20.0, Next 16.2.9 `dev --webpack`, `api/local`. loopback 중계가 정확한 홈 GET을 한 번 전달했다. Next와 개발 API 모두 `200`이며 이 응답도 9/42행이다. |
| Chrome 158 · 12:29:35 KST | 1440×900에서 3열, 390×844에서 1열로 각각 9장을 표시했다. 순서대로 상세 링크·제목·공고번호·종류·게시일·마감·계약방법·기관·추정가격이 동일 응답과 두 폭에서 각 9/9 일치했다. 전체 보기 `/bids` 링크가 있고 가로 넘침은 없었다. 카드·전체 보기의 탐색과 키보드는 이번에 실행하지 않았다. |
| 정리 · 12:30 KST | Chrome 격리 세션과 Next·중계 소유 프로세스 3개를 종료했다. 두 loopback 포트의 청취가 끝났다. 홈 로드 중 세션 복원 1건은 중계가 로컬 `401`로 응답했다. 공유 서버에는 공개 목록 GET만 전달됐고 실제 인증·쓰기·장애 주입은 0건이다. 응답과 DOM은 메모리에서 비교하고 비식별 집계만 남겼다. |

| 사례 | 이번에 확인한 범위 | 재개에 필요한 조건 |
| --- | --- | --- |
| HOME-01 | 실제 첫 9행과 카드 수·순서·표시·상세 링크 일치 | 기존 통과 재확인 |
| HOME-02 | 첫 9행은 용역이며 공사는 비교 GET에서만 관찰 | 홈에 표시되는 공사·용역·물품 자료와 날짜·가격 기대값 |
| HOME-03 | 공개 첫 9행에 분류가 없다. Chrome의 상세 링크는 해당 응답 기준 9/9 일치, 링크 클릭 미실행 | 같은 ID의 다른 두 `bidClsfcNo`가 홈에 나타나는 공개 자료와 두 상세 도착 기대값 |
| HOME-04 | 첫 9행의 두 기관명이 같다. 다른 이름 3행은 비교 GET에서만 관찰 | 11/25의 수요기관 우선 확인을 보존한다. 공고기관만 있는 행과 기관 양쪽이 없는 행의 홈 표시 필요 |
| HOME-05 | 대상 4개 필드의 null·누락은 두 직접 조회에서 모두 0 | `noticePublishedAt`, `bidCloseAt`, `contractMethod`, `estimatedPrice`가 각각 null인 공개 행과 `—` 표시 확인 |
| HOME-06 | 같은 홈 요청은 9행 반환. 10/30의 1행 관찰은 이전 기록 | 같은 홈 조건에서 1~8행과 0행을 제공하는 승인된 조건 |
| HOME-07~09 | 오류·재시도, 키보드·이동, 실제 인증·CTA 미실행 | 11/02 실행과 한계 보존 |

신규 실제 통과 **0건**, 누적 사례 판정 **4통과·0실패·5차단·0대기**다. HOME-02~06의 합성 자료와 사례별 기대값, 개발 인스턴스를 배포 소스에 대응할 실행 식별자를 확보하면 홈과 같은 조건으로 다시 확인한다. [작업 기록](../development/figma-v01/tasks/QA-01.md) · [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs)

# 홈 브라우저 통합 테스트

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

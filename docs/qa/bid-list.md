# 공개 입찰공고 목록 브라우저 통합 테스트

## 기준

- Figma 파일/섹션: [01_입찰공고리스트, 2201:18147](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2201-18147)
- 구현 화면/경로: `/bids?view=all|closing|result|recommended`
- 관련 API 명세: [Mate Swagger UI](https://api-test.mate-bid.com/swagger-ui/index.html), `GET /api/v1/bid-notices`, `GET /api/v1/regions`, `GET /api/v1/industries`
- 담당자/검토자: 미정
- 이번 작업의 정적 검증: Node 22.20.0에서 `pnpm lint`, `pnpm build`, `pnpm build-storybook`, `git diff --check` 통과. DTO mapper fixture에서 0-based 페이지 변환, 분류번호, 수요기관 우선, 분류별 null 기초금액, nullable 추정가격, KST 실제 개찰일·낙찰금액, 중복 업종 라벨 변환 통과.
- 기관 역할 표시 변경: Node 22.20.0에서 `pnpm lint`, `pnpm build`, `pnpm build-storybook`, `git diff --check` 통과. 목록 DTO의 두 기관명 분리·공백·null 경계 시나리오를 확인했다. 실제 표시는 아래 BID-05·BID-11에서 브라우저 검증 대기다.
- 실제 백엔드 브라우저 통합 상태: **대기**

## 실행 환경 기록

| 실행일시 | 프론트 URL·배포/commit | 백엔드 URL·배포 | 브라우저·화면 크기 | 테스트 데이터 별칭 | 수행자 |
| --- | --- | --- | --- | --- | --- |
| 미실행 | 미정 | 미정 | 미정 | 비밀값 대신 별칭만 | 미정 |

## 선행 조건·차단 사항

- 브라우저에서 프론트 URL에 접속하고, Next.js 서버에서 테스트 API에 접속할 수 있어야 한다. 공개 목록·필터 조회는 서버에서 실행하므로 브라우저의 공개 GET CORS 허용 여부로 이 경로의 성공을 판단하지 않는다.
- 테스트 API에 전체·마감임박·결과, 물품·용역 분류 행, 빈 결과, nullable 금액/낙찰값을 확인할 수 있는 공고가 필요하다. 민감한 원본 응답은 저장하지 않는다.
- `recommended`의 로그인 진입 검증은 `docs/qa/auth.md`의 OAuth·쿠키 환경에 의존한다. 사용자 승인에 따라 로그인 후에는 준비 중 안내를 보인다.
- 목록의 공고번호·공고명은 backend ID와 분류번호를 보존해 상세로 이동한다. 실제 이동 검증은 [`bid-detail.md`](./bid-detail.md)의 DETAIL-01에서 수행한다.
- Figma의 개찰결과 ‘낙찰금액’ 필터는 현재 목록 API가 지원하지 않아 준비 중 비활성이다. 백엔드에 `successfulBidAmount` 범위 필터 계약을 요청해야 한다.

## 테스트 항목

### BID-01 — 전체 기본 목록

- Figma node: [2048:58606](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2048-58606)
- 화면 경로: `/bids`
- API: `GET /api/v1/bid-notices?view=ALL&bidTypes=CONSTRUCTION&page=0&size=10&sort=bidCloseAt,asc`, `GET /api/v1/regions`, `GET /api/v1/industries`
- 준비 데이터: 공개 중인 공사 공고 10건 이상
- 조작: 로그인 전 브라우저에서 `/bids`를 연다.
- 예상 결과: 응답 `data.items`, `totalElements`와 표·건수가 일치하고 마감일 오름차순이다. 네트워크/서버 오류 시 mock 공고가 대신 나타나지 않는다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### BID-02 — 곧 마감 목록

- Figma node: [2105:72919](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2105-72919)
- 화면 경로: `/bids?view=closing`
- API: `GET /api/v1/bid-notices?view=CLOSING_SOON...`
- 준비 데이터: 곧 마감 공고와 그 외 공고
- 조작: 보기 메뉴에서 ‘곧 마감되는 입찰공고’를 고른다.
- 예상 결과: 서버가 분류한 곧 마감 공고만 보이며 ‘기간’ 필터는 노출되지 않는다. 건수와 순서는 API와 일치한다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### BID-03 — 개찰결과와 실제 낙찰값

- Figma node: [2105:73460](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2105-73460)
- 화면 경로: `/bids?view=result`
- API: `GET /api/v1/bid-notices?view=RESULT&sort=openAt,desc...`
- 준비 데이터: 낙찰 완료와 유찰/낙찰 대기 결과
- 조작: 보기 메뉴에서 ‘개찰 발표 입찰공고’를 고른다.
- 예상 결과: `resultSummary.winnerName`, `successfulBidRate`, `successfulBidAmount`, 실제 개찰일이 표에 반영된다. 낙찰금액을 추정가격×낙찰률로 계산하지 않는다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### BID-04 — 공사·용역·물품 종류

- Figma node: [2068:59079](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2068-59079)
- 화면 경로: `/bids?category=service`, `/bids?category=purchase`
- API: `GET /api/v1/bid-notices`의 `bidTypes=SERVICE|GOODS`
- 준비 데이터: 각 종류의 공개 공고
- 조작: 종류 필터를 용역, 물품으로 각각 바꾼다.
- 예상 결과: 선택한 종류만 표시되고 URL, 건수, 페이지가 일치한다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### BID-05 — 검색과 초기화

- Figma node: [2085:70948](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2085-70948)
- 화면 경로: `/bids?query=<검색어>`
- API: `GET /api/v1/bid-notices`의 `keyword`, 최대 100자
- 준비 데이터: 공고명·공고번호·공고기관명·수요기관명으로 각각 찾을 수 있는 공고
- 조작: 각 검색어를 입력하고 제출한 뒤 ‘검색 조건 초기화’를 누른다. 이전 mock URL의 `?agency=<기관명>`도 직접 연다.
- 예상 결과: 두 기관명을 포함한 API 검색 건수·목록과 일치하며 검색어와 필터 초기화 시 첫 페이지로 돌아간다. 실제 기록/API가 없는 고정 ‘최근·추천 검색어’ 팝업은 나타나지 않는다. 지원하지 않는 옛 `agency` query는 URL에서 제거되어 공개 목록으로 이동한다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### BID-06 — 지역·업종 필터 코드 변환

- Figma node: [지역 2075:63269](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2075-63269), [업종 2074:63648](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2074-63648)
- 화면 경로: `/bids?region=<지역명>&industry=<업종명>`
- API: `GET /api/v1/regions`, `GET /api/v1/industries`, `GET /api/v1/bid-notices`의 `regionCodes`, `industryCodes`
- 준비 데이터: 지역·업종 코드가 확인된 공고
- 조작: 시·도와 업종을 각각 선택하고 저장한다.
- 예상 결과: 표시 이름과 URL은 유지되고 백엔드 요청에는 대응 코드가 전달된다. API 결과 건수와 표가 일치한다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### BID-07 — 계약방법 필터

- Figma node: [2093:5556](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2093-5556)
- 화면 경로: `/bids?contract=<계약방법>`
- API: `GET /api/v1/bid-notices`의 `contractMethods=GENERAL|LIMITED|NOMINATION|PRIVATE`
- 준비 데이터: 서로 다른 계약방법의 공고
- 조작: 계약방법을 선택·해제한다.
- 예상 결과: 한글 라벨과 서버 enum이 대응하며 해제 시 조건이 빠진다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### BID-08 — 전체 목록의 기간·기초금액

- Figma node: [기간 2081:2349](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2081-2349), [금액 2099:67819](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2099-67819)
- 화면 경로: `/bids?period=3개월&amount=<금액범위>`
- API: `GET /api/v1/bid-notices`의 `dateType=BID_BEGIN`, `dateFrom`, `amountType=BASE_PRICE`, `amountMin/Max`
- 준비 데이터: 경계 날짜·금액의 공고
- 조작: 빠른 기간과 금액 범위를 각각 적용·해제한다.
- 예상 결과: 날짜는 KST 기준이며 금액 경계에서 중복·누락이 없다. 서버 필터와 화면 건수가 일치한다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### BID-09 — 개찰일과 낙찰금액 준비 중

- Figma node: [개찰일 2112:17888](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2112-17888), [낙찰금액 2134:10709](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2134-10709)
- 화면 경로: `/bids?view=result&period=1개월`
- API: `GET /api/v1/bid-notices`의 `dateFrom/dateTo`(개찰일); 낙찰금액 필터 API 없음
- 준비 데이터: 최근·과거 개찰결과
- 조작: 개찰일 빠른 기간을 적용하고 낙찰금액 버튼을 확인한다.
- 예상 결과: 개찰일 기준 서버 결과와 일치한다. 낙찰금액 버튼은 준비 중으로 비활성이고 기초금액·추정가격 필터를 대신 보내지 않는다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### BID-10 — 서버 페이지 번호와 표시 개수

- Figma node: [2048:58606](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2048-58606)
- 화면 경로: `/bids?page=2&size=20`
- API: `GET /api/v1/bid-notices`의 `page=1&size=20`
- 준비 데이터: 20건 넘는 공고
- 조작: 두 번째 페이지와 20개씩 표시를 선택한다. 이어서 `?page=999`처럼 전체 페이지를 벗어나는 주소를 직접 연다.
- 예상 결과: URL·UI는 1부터, API는 0부터 센다. `totalElements` 기준 전체 페이지 수와 중복 없는 행을 확인한다. 범위를 벗어난 페이지에 실제 결과가 남아 있으면 ‘현재 페이지에는 공고가 없어요’와 첫 페이지 이동 버튼이 보여 복귀할 수 있다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### BID-11 — nullable 필드 표시

- Figma node: [2105:73460](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2105-73460)
- 화면 경로: `/bids?view=result`, `/bids`
- API: `GET /api/v1/bid-notices`
- 준비 데이터: 기초금액·추정가격·지역·업종 또는 낙찰업체·낙찰률·낙찰금액이 null인 공고, 공고기관과 수요기관이 다른 공고, 수요기관만 없는 공고, 두 기관이 모두 없는 공고
- 조작: 해당 행을 찾는다.
- 예상 결과: 없는 값은 ‘—’로 표시되고 `0원`, 임의의 회사명, 계산한 낙찰금액으로 바뀌지 않는다. ‘기관’ 열은 수요기관이 있으면 `수요기관`과 그 이름을 표시하고, 없으면 `공고기관`과 그 이름을 표시한다. 둘 다 없으면 `—`를 표시하며 표시값의 역할을 잘못 붙이지 않는다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### BID-12 — 분류 행과 상세 링크

- Figma node: [2048:58606](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2048-58606)
- 화면 경로: `/bids`
- API: `GET /api/v1/bid-notices`의 `row.kind`, `row.bidClsfcNo`, `row.baseAmount`
- 준비 데이터: 한 공고 ID에 물품·용역 분류 행이 둘 이상인 사례
- 조작: 중복 공고 ID의 각 행을 보고 공고명·번호에 마우스와 키보드를 사용한다.
- 예상 결과: 분류 행들이 중복 키 없이 각각 렌더링되고 공고번호 아래 작은 분류번호로 구분되며 각 행 금액이 유지된다. 공고명·번호 링크가 backend ID와 분류번호를 보존해 실제 상세로 이동한다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### BID-13 — 검색·필터 결과 없음

- Figma node: [2085:69181](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2085-69181)
- 화면 경로: `/bids?query=<없는 검색어>`
- API: `GET /api/v1/bid-notices`의 `items=[]`, `totalElements=0`
- 준비 데이터: 검색 결과가 없는 조건
- 조작: 없는 검색어 또는 교집합 없는 필터를 적용한다.
- 예상 결과: Figma 빈 상태가 표시되고 mock 행이나 가짜 건수가 나타나지 않는다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### BID-14 — API 오류와 재시도

- Figma node: [섹션 2201:18147](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2201-18147) (별도 오류 프레임 없음)
- 화면 경로: `/bids`
- API: `GET /api/v1/bid-notices`, `GET /api/v1/regions`, `GET /api/v1/industries`
- 준비 데이터: 테스트 환경에서 비민감한 오류 재현 수단
- 조작: 한 조회에 오류를 발생시키고 ‘다시 시도’를 누른다.
- 예상 결과: 오류 안내가 보이고 mock 목록으로 대체되지 않는다. 복구 후 재시도하면 실제 API 목록이 나온다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### BID-15 — 맞춤공고 인증 후 준비 중

- Figma node: [3003:47410](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=3003-47410)
- 화면 경로: `/bids?view=recommended`
- API: `GET /api/v1/bid-notices` 맞춤 view 없음; 로그인 상태 확인은 `POST /api/v1/auth/token/refresh`
- 준비 데이터: 비로그인 브라우저와 로그인 테스트 계정
- 조작: 비로그인에서 직접 접근하고, 로그인 완료 후 같은 화면을 연다.
- 예상 결과: 비로그인은 로그인으로 이동하고 로그인 후에는 ‘준비 중’ 안내가 나온다. mock 추천 목록과 공개 목록 API 요청은 발생하지 않는다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### BID-16 — 화면 폭·키보드 조작

- Figma node: [섹션 2201:18147](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2201-18147)
- 화면 경로: `/bids`
- API: `GET /api/v1/bid-notices`, `GET /api/v1/regions`, `GET /api/v1/industries`
- 준비 데이터: 목록 데이터
- 조작: 데스크톱·모바일 폭에서 표 가로 스크롤, 보기·필터·검색·페이지 키보드 조작을 확인한다.
- 예상 결과: 값·건수가 유지되고 메뉴 Escape 닫기, focus, 비활성 금액 필터가 정상이다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

## 실행 결과 요약

- 통과/실패/차단/대기 수: **0 / 0 / 0 / 16**
- 남은 결함과 담당자: 낙찰금액 범위 필터 API 계약 미정, 상세 API 연결 별도 기능
- 최종 판정과 날짜: 미실행

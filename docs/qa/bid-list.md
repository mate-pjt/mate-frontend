# 공개 입찰공고 목록 브라우저 통합 테스트

## 기준

- Figma 파일/섹션: [01_입찰공고리스트, 2201:18147](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2201-18147)
- 구현 화면/경로: `/bids?view=all|closing|result|recommended`
- 관련 API 명세: [Mate Swagger UI](https://api-test.mate-bid.com/swagger-ui/index.html), `GET /api/v1/bid-notices`, `GET /api/v1/regions`, `GET /api/v1/industries`
- 담당자/검토자: 미정
- 이번 작업의 정적 검증: Node 22.20.0에서 `pnpm lint`, `pnpm build`, `pnpm build-storybook`, `git diff --check` 통과. DTO mapper fixture에서 0-based 페이지 변환, 분류번호, 수요기관 우선, 분류별 null 기초금액, nullable 추정가격, KST 실제 개찰일·낙찰금액, 중복 업종 라벨 변환 통과.
- 기관 역할 표시 변경: Node 22.20.0에서 `pnpm lint`, `pnpm build`, `pnpm build-storybook`, `git diff --check` 통과. 목록 DTO의 두 기관명 분리·공백·null 경계 시나리오를 확인했다. 실제 표시는 아래 BID-05·BID-11에서 브라우저 검증 대기다.
- 실제 백엔드 브라우저 통합 상태: **2026-10-30 부분 통과: 4통과·12차단. QA-02 승인 예외에 따른 제한 종료와 전체 통합 PASS를 구분한다.**

## 실행 환경 기록

| 실행일시 | 프론트 URL·배포/commit | 백엔드 URL·배포 | 브라우저·화면 크기 | 테스트 데이터 별칭 | 수행자 |
| --- | --- | --- | --- | --- | --- |
| 미실행 | 미정 | 미정 | 미정 | 비밀값 대신 별칭만 | 미정 |
| 2026-10-30 16:07~16:19 KST | 로컬 HTTPS·6b3f16b + 승인된 error.tsx 2줄/Markdown | 테스트 API·최근 deployment 7366507325 성공(현재 실행 버전 미확인) | Chrome 156.0.8078.79·1440×900/390×844/320×844 | SERVICE-1·QA-A | Codex·계정 선택은 사용자 |

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
- 상태: 차단
- 환경/증거: 2026-10-30 [QA-02 실제 실행](#qa-02-20261030) · 공사 0행·용역 1행의 API/화면 일치와 정렬 파라미터만 확인. 공사 10건 이상·복수 행 정렬 fixture 필요.
- 결함/담당자/재검증: 공개 fixture/백엔드 배포 담당·프론트 QA 실행자(개인 배정 미확인). 부족 조건/현재 실행 버전 확보 후 같은 case ID로 재개.

### BID-02 — 곧 마감 목록

- Figma node: [2105:72919](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2105-72919)
- 화면 경로: `/bids?view=closing`
- API: `GET /api/v1/bid-notices?view=CLOSING_SOON...`
- 준비 데이터: 곧 마감 공고와 그 외 공고
- 조작: 보기 메뉴에서 ‘곧 마감되는 입찰공고’를 고른다.
- 예상 결과: 서버가 분류한 곧 마감 공고만 보이며 ‘기간’ 필터는 노출되지 않는다. 건수와 순서는 API와 일치한다.
- 상태: 차단
- 환경/증거: 2026-10-30 [QA-02 실제 실행](#qa-02-20261030) · CLOSING_SOON 용역 0건·기간 필터 미노출 확인. 곧 마감/그 외 비교 공고 필요.
- 결함/담당자/재검증: 공개 fixture/백엔드 배포 담당·프론트 QA 실행자(개인 배정 미확인). 부족 조건/현재 실행 버전 확보 후 같은 case ID로 재개.

### BID-03 — 개찰결과와 실제 낙찰값

- Figma node: [2105:73460](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2105-73460)
- 화면 경로: `/bids?view=result`
- API: `GET /api/v1/bid-notices?view=RESULT&sort=openAt,desc...`
- 준비 데이터: 낙찰 완료와 유찰/낙찰 대기 결과
- 조작: 보기 메뉴에서 ‘개찰 발표 입찰공고’를 고른다.
- 예상 결과: `resultSummary.winnerName`, `successfulBidRate`, `successfulBidAmount`, 실제 개찰일이 표에 반영된다. 낙찰금액을 추정가격×낙찰률로 계산하지 않는다.
- 상태: 차단
- 환경/증거: 2026-10-30 [QA-02 실제 실행](#qa-02-20261030) · RESULT 0건·openAt,desc 확인. 낙찰/유찰/대기와 실제 낙찰값 fixture 필요.
- 결함/담당자/재검증: 공개 fixture/백엔드 배포 담당·프론트 QA 실행자(개인 배정 미확인). 부족 조건/현재 실행 버전 확보 후 같은 case ID로 재개.

### BID-04 — 공사·용역·물품 종류

- Figma node: [2068:59079](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2068-59079)
- 화면 경로: `/bids?category=service`, `/bids?category=purchase`
- API: `GET /api/v1/bid-notices`의 `bidTypes=SERVICE|GOODS`
- 준비 데이터: 각 종류의 공개 공고
- 조작: 종류 필터를 용역, 물품으로 각각 바꾼다.
- 예상 결과: 선택한 종류만 표시되고 URL, 건수, 페이지가 일치한다.
- 상태: 차단
- 환경/증거: 2026-10-30 [QA-02 실제 실행](#qa-02-20261030) · 종류를 UI에서 공사·용역·물품으로 바꿔 0/1/0건과 URL/API enum 일치 확인. 공사·물품 실행 fixture 필요.
- 결함/담당자/재검증: 공개 fixture/백엔드 배포 담당·프론트 QA 실행자(개인 배정 미확인). 부족 조건/현재 실행 버전 확보 후 같은 case ID로 재개.

### BID-05 — 검색과 초기화

- Figma node: [2085:70948](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2085-70948)
- 화면 경로: `/bids?query=<검색어>`
- API: `GET /api/v1/bid-notices`의 `keyword`, 최대 100자
- 준비 데이터: 공고명·공고번호·공고기관명·수요기관명으로 각각 찾을 수 있는 공고
- 조작: 각 검색어를 입력하고 제출한 뒤 ‘검색 조건 초기화’를 누른다. 이전 mock URL의 `?agency=<기관명>`도 직접 연다.
- 예상 결과: 두 기관명을 포함한 API 검색 건수·목록과 일치하며 검색어와 필터 초기화 시 첫 페이지로 돌아간다. 실제 기록/API가 없는 고정 ‘최근·추천 검색어’ 팝업은 나타나지 않는다. 지원하지 않는 옛 `agency` query는 URL에서 제거되어 공개 목록으로 이동한다.
- 상태: 차단
- 환경/증거: 2026-10-30 [QA-02 실제 실행](#qa-02-20261030) · 공고명·번호·기관 검색 각 1건, 뒤로가기 검색 복원·Enter 초기화·첫 페이지·옛 agency 제거 확인. 현재 두 기관명이 같아 역할별 독립 검색 fixture 필요.
- 결함/담당자/재검증: 공개 fixture/백엔드 배포 담당·프론트 QA 실행자(개인 배정 미확인). 부족 조건/현재 실행 버전 확보 후 같은 case ID로 재개.

### BID-06 — 지역·업종 필터 코드 변환

- Figma node: [지역 2075:63269](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2075-63269), [업종 2074:63648](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2074-63648)
- 화면 경로: `/bids?region=<지역명>&industry=<업종명>`
- API: `GET /api/v1/regions`, `GET /api/v1/industries`, `GET /api/v1/bid-notices`의 `regionCodes`, `industryCodes`
- 준비 데이터: 지역·업종 코드가 확인된 공고
- 조작: 시·도와 업종을 각각 선택하고 저장한다.
- 예상 결과: 표시 이름과 URL은 유지되고 백엔드 요청에는 대응 코드가 전달된다. API 결과 건수와 표가 일치한다.
- 상태: 차단
- 환경/증거: 2026-10-30 [QA-02 실제 실행](#qa-02-20261030) · 서울특별시→11·가스난방공사업→6203의 코드 전달·URL 라벨·200/화면 각 1건 확인. 독립적으로 포함/제외를 대조할 지역·업종 공고 fixture 필요.
- 결함/담당자/재검증: 공개 fixture/백엔드 배포 담당·프론트 QA 실행자(개인 배정 미확인). 부족 조건/현재 실행 버전 확보 후 같은 case ID로 재개.

### BID-07 — 계약방법 필터

- Figma node: [2093:5556](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2093-5556)
- 화면 경로: `/bids?contract=<계약방법>`
- API: `GET /api/v1/bid-notices`의 `contractMethods=GENERAL|LIMITED|NOMINATION|PRIVATE`
- 준비 데이터: 서로 다른 계약방법의 공고
- 조작: 계약방법을 선택·해제한다.
- 예상 결과: 한글 라벨과 서버 enum이 대응하며 해제 시 조건이 빠진다.
- 상태: 차단
- 환경/증거: 2026-10-30 [QA-02 실제 실행](#qa-02-20261030) · 제한경쟁→LIMITED 1건·일반경쟁→GENERAL 0건과 해제 확인. 다른 계약방법 공고·경계 fixture 필요.
- 결함/담당자/재검증: 공개 fixture/백엔드 배포 담당·프론트 QA 실행자(개인 배정 미확인). 부족 조건/현재 실행 버전 확보 후 같은 case ID로 재개.

### BID-08 — 전체 목록의 기간·기초금액

- Figma node: [기간 2081:2349](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2081-2349), [금액 2099:67819](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2099-67819)
- 화면 경로: `/bids?period=3개월&amount=<금액범위>`
- API: `GET /api/v1/bid-notices`의 `dateType=BID_BEGIN`, `dateFrom`, `amountType=BASE_PRICE`, `amountMin/Max`
- 준비 데이터: 경계 날짜·금액의 공고
- 조작: 빠른 기간과 금액 범위를 각각 적용·해제한다.
- 예상 결과: 날짜는 KST 기준이며 금액 경계에서 중복·누락이 없다. 서버 필터와 화면 건수가 일치한다.
- 상태: 차단
- 환경/증거: 2026-10-30 [QA-02 실제 실행](#qa-02-20261030) · 4개 기간의 KST 날짜와 5개 BASE_PRICE 금액 preset 요청/해제 확인. 날짜·금액 경계 공고 부재로 중복/누락 검증 미완료.
- 결함/담당자/재검증: 공개 fixture/백엔드 배포 담당·프론트 QA 실행자(개인 배정 미확인). 부족 조건/현재 실행 버전 확보 후 같은 case ID로 재개.

### BID-09 — 개찰일과 낙찰금액 준비 중

- Figma node: [개찰일 2112:17888](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2112-17888), [낙찰금액 2134:10709](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2134-10709)
- 화면 경로: `/bids?view=result&period=1개월`
- API: `GET /api/v1/bid-notices`의 `dateFrom/dateTo`(개찰일); 낙찰금액 필터 API 없음
- 준비 데이터: 최근·과거 개찰결과
- 조작: 개찰일 빠른 기간을 적용하고 낙찰금액 버튼을 확인한다.
- 예상 결과: 개찰일 기준 서버 결과와 일치한다. 낙찰금액 버튼은 준비 중으로 비활성이고 기초금액·추정가격 필터를 대신 보내지 않는다.
- 상태: 차단
- 환경/증거: 2026-10-30 [QA-02 실제 실행](#qa-02-20261030) · RESULT의 1개월 dateFrom/dateTo·금액 파라미터 없음·낙찰금액 준비 중 비활성 확인. 최근/과거 개찰결과 공고 필요.
- 결함/담당자/재검증: 공개 fixture/백엔드 배포 담당·프론트 QA 실행자(개인 배정 미확인). 부족 조건/현재 실행 버전 확보 후 같은 case ID로 재개.

### BID-10 — 서버 페이지 번호와 표시 개수

- Figma node: [2048:58606](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2048-58606)
- 화면 경로: `/bids?page=2&size=20`
- API: `GET /api/v1/bid-notices`의 `page=1&size=20`
- 준비 데이터: 20건 넘는 공고
- 조작: 두 번째 페이지와 20개씩 표시를 선택한다. 이어서 `?page=999`처럼 전체 페이지를 벗어나는 주소를 직접 연다.
- 예상 결과: URL·UI는 1부터, API는 0부터 센다. `totalElements` 기준 전체 페이지 수와 중복 없는 행을 확인한다. 범위를 벗어난 페이지에 실제 결과가 남아 있으면 ‘현재 페이지에는 공고가 없어요’와 첫 페이지 이동 버튼이 보여 복귀할 수 있다.
- 상태: 차단
- 환경/증거: 2026-10-30 [QA-02 실제 실행](#qa-02-20261030) · page999→API page998/size20·totalElements1/빈 페이지·Enter 첫 페이지 복귀 확인. 20건 초과·다중 페이지/중복 검증은 fixture 부재. 현재 페이지 수 선택 비활성은 1건에 따른 정상 동작.
- 결함/담당자/재검증: 공개 fixture/백엔드 배포 담당·프론트 QA 실행자(개인 배정 미확인). 부족 조건/현재 실행 버전 확보 후 같은 case ID로 재개.

### BID-11 — nullable 필드 표시

- Figma node: [2105:73460](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2105-73460)
- 화면 경로: `/bids?view=result`, `/bids`
- API: `GET /api/v1/bid-notices`
- 준비 데이터: 기초금액·추정가격·지역·업종 또는 낙찰업체·낙찰률·낙찰금액이 null인 공고, 공고기관과 수요기관이 다른 공고, 수요기관만 없는 공고, 두 기관이 모두 없는 공고
- 조작: 해당 행을 찾는다.
- 예상 결과: 없는 값은 ‘—’로 표시되고 `0원`, 임의의 회사명, 계산한 낙찰금액으로 바뀌지 않는다. ‘기관’ 열은 수요기관이 있으면 `수요기관`과 그 이름을 표시하고, 없으면 `공고기관`과 그 이름을 표시한다. 둘 다 없으면 `—`를 표시하며 표시값의 역할을 잘못 붙이지 않는다.
- 상태: 차단
- 환경/증거: 2026-10-30 [QA-02 실제 실행](#qa-02-20261030) · 기초금액·업종 null의 —, 추정가격 450,000,000·수요기관 표시 확인. 다른 null·기관 우선/공고기관 fallback·결과 null fixture 필요.
- 결함/담당자/재검증: 공개 fixture/백엔드 배포 담당·프론트 QA 실행자(개인 배정 미확인). 부족 조건/현재 실행 버전 확보 후 같은 case ID로 재개.

### BID-12 — 분류 행과 상세 링크

- Figma node: [2048:58606](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2048-58606)
- 화면 경로: `/bids`
- API: `GET /api/v1/bid-notices`의 `row.kind`, `row.bidClsfcNo`, `row.baseAmount`
- 준비 데이터: 한 공고 ID에 물품·용역 분류 행이 둘 이상인 사례
- 조작: 중복 공고 ID의 각 행을 보고 공고명·번호에 마우스와 키보드를 사용한다.
- 예상 결과: 분류 행들이 중복 키 없이 각각 렌더링되고 공고번호 아래 작은 분류번호로 구분되며 각 행 금액이 유지된다. 공고명·번호 링크가 backend ID와 분류번호를 보존해 실제 상세로 이동한다.
- 상태: 차단
- 환경/증거: 2026-10-30 [QA-02 실제 실행](#qa-02-20261030) · 분류 없는 단일 행 두 링크의 /bids/2 및 Enter 이동/복귀 확인. 복수 분류/분류별 금액·키·링크 fixture 필요.
- 결함/담당자/재검증: 공개 fixture/백엔드 배포 담당·프론트 QA 실행자(개인 배정 미확인). 부족 조건/현재 실행 버전 확보 후 같은 case ID로 재개.

### BID-13 — 검색·필터 결과 없음

- Figma node: [2085:69181](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2085-69181)
- 화면 경로: `/bids?query=<없는 검색어>`
- API: `GET /api/v1/bid-notices`의 `items=[]`, `totalElements=0`
- 준비 데이터: 검색 결과가 없는 조건
- 조작: 없는 검색어 또는 교집합 없는 필터를 적용한다.
- 예상 결과: Figma 빈 상태가 표시되고 mock 행이나 가짜 건수가 나타나지 않는다.
- 상태: 통과
- 환경/증거: 2026-10-30 [QA-02 실제 실행](#qa-02-20261030) · 없는 검색어의 실제 200/items=[]/totalElements0와 빈 화면·표 행0을 확인. mock 대체 없음.
- 결함/담당자/재검증: 현재 실행 범위의 열린 결함 없음. 기록한 한계는 유지.

### BID-14 — API 오류와 재시도

- Figma node: [섹션 2201:18147](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2201-18147) (별도 오류 프레임 없음)
- 화면 경로: `/bids`
- API: `GET /api/v1/bid-notices`, `GET /api/v1/regions`, `GET /api/v1/industries`
- 준비 데이터: 테스트 환경에서 비민감한 오류 재현 수단
- 조작: 한 조회에 오류를 발생시키고 ‘다시 시도’를 누른다.
- 예상 결과: 오류 안내가 보이고 mock 목록으로 대체되지 않는다. 복구 후 재시도하면 실제 API 목록이 나온다.
- 상태: 통과
- 환경/증거: 2026-10-30 [QA-02 실제 실행](#qa-02-20261030) · 최초에는 연결 복구 후 reset 버튼이 재조회 없이 오류를 유지해 실패. 승인된 error.tsx 최소 수정 후 목록/지역/업종 각각 로컬 실패 해제→Enter 재시도→실제 GET 200/1행 복구를 재검증. 공유 backend 4xx/5xx 재현 결과는 아님.
- 결함/담당자/재검증: 재시도 결함 수정 후 통과. 기존 실패 증거 보존; Next 버전 변경 시 재검증.

### BID-15 — 맞춤공고 인증 후 준비 중

- Figma node: [3003:47410](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=3003-47410)
- 화면 경로: `/bids?view=recommended`
- API: `GET /api/v1/bid-notices` 맞춤 view 없음; 로그인 상태 확인은 `POST /api/v1/auth/token/refresh`
- 준비 데이터: 비로그인 브라우저와 로그인 테스트 계정
- 조작: 비로그인에서 직접 접근하고, 로그인 완료 후 같은 화면을 연다.
- 예상 결과: 비로그인은 로그인으로 이동하고 로그인 후에는 ‘준비 중’ 안내가 나온다. mock 추천 목록과 공개 목록 API 요청은 발생하지 않는다.
- 상태: 통과
- 환경/증거: 2026-10-30 [QA-02 실제 실행](#qa-02-20261030) · 비로그인 next 보존·사용자 직접 QA-A 로그인 후 준비 중·refresh 200·logout 200·보호 접근 로그인 복귀 확인. recommended 공개 fetch 0건. OAuth completion HTTP/쿠키 삭제는 미확인으로 보존.
- 결함/담당자/재검증: 현재 실행 범위의 열린 결함 없음. 기록한 한계는 유지.

### BID-16 — 화면 폭·키보드 조작

- Figma node: [섹션 2201:18147](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2201-18147)
- 화면 경로: `/bids`
- API: `GET /api/v1/bid-notices`, `GET /api/v1/regions`, `GET /api/v1/industries`
- 준비 데이터: 목록 데이터
- 조작: 데스크톱·모바일 폭에서 표 가로 스크롤, 보기·필터·검색·페이지 키보드 조작을 확인한다.
- 예상 결과: 값·건수가 유지되고 메뉴 Escape 닫기, focus, 비활성 금액 필터가 정상이다.
- 상태: 통과
- 환경/증거: 2026-10-30 [QA-02 실제 실행](#qa-02-20261030) · 1440×900·390×844·320×844에서 1행/건수 유지·표 가로 스크롤(0→1000)·메뉴 Enter/Escape·검색/첫 페이지/링크 Enter 확인. 20건 이상 페이지 검증은 BID-10 차단으로 구분.
- 결함/담당자/재검증: 현재 실행 범위의 열린 결함 없음. 기록한 한계는 유지.

## 실행 결과 요약

- 통과/실패/차단/대기 수: **4 / 0 / 12 / 0** (실행 전 0/0/0/16 이력 보존; BID-14 최초 실패는 수정 후 재검증으로 통과)
- 남은 결함과 담당자: 부족한 fixture·현재 backend 실행 버전은 아래 재개 조건. 낙찰금액/고급 입력·맞춤 목록 개발과 상세 자체 QA는 별도 Task 범위. BID-14 재시도 결함은 이번 승인 범위에서 수정했다.
- 최종 판정과 날짜: 2026-10-30 실제 부분 통과·12차단. 사용자 승인에 따른 QA-02 제한 종료/Review Gate는 작업 기록에서 관리하며 전체 통합 PASS로 세지 않는다.


<a id="qa-02-20261030"></a>

## QA-02 실제 실행 · 2026-10-30

[작업 기록](../development/figma-v01/tasks/QA-02.md) · [검증·리뷰](../development/figma-v01/reviews/QA-02.md). 기존 case ID·준비 데이터·조작·기대 결과는 보존했다. 위 12차단은 실패/미실행을 숨기는 완료 상태가 아니다.

- 승인: 사용자 “가능한 QA 후 잔여 차단을 보존하고 제한 종료·Git 전달”, “QA-A 인증과 로컬 프로세스 한정 재현·정리 허용”. BID-14 결함 발견 뒤 “이 한 파일의 최소 수정을 QA-02에 포함하고 재검증”. QA-02 한정이며 다음 Task의 검증 면제·fixture/DB 생성·신규 가입·업무 mutation·공유 운영/배포를 포함하지 않는다.
- 프론트: `qa/qa-02-bid-list-live`, 시작 source HEAD `6b3f16b34bdf5242f9f1f914a1a4c800ff045a1c` + 이번 Markdown 및 `src/app/bids/error.tsx` 두 줄 변경. Node 22.20.0/Next 16.2.9, `https://local.mate-bid.com:3000`, 명시적 api/local 입력 snapshot `67eb70b3`(7개 그룹 api). 환경파일 내용 로딩은 차단했다.
- 백엔드: `https://api-test.mate-bid.com`. 최근 test deployment `7366507325`/run `40552546758`/source SHA `0e7ac62d605279fc8d51455794a910eece8aeed5`의 성공을 조회했다. **현재 서버의 실행 SHA/이미지와 대응시키는 증거는 미확보**다. 이 배포 이력을 현재 실행 버전으로 간주하지 않는다.
- 실행 시각/브라우저: 16:01 KST CLI 사전 조회, 16:07~16:19 KST 실제 HTTPS Next/Chrome 156.0.8078.79(설치 Info.plist). 기본 1920×873 및 1440×900·390×844·320×844. 수행자 Codex, 계정 직접 선택은 사용자. 개인 담당자 임의 지정 없음.
- 데이터: `SERVICE-1`(분류 없는 NOTICE), ALL 용역1·공사/물품0, CLOSING_SOON/RESULT0. 기초금액·대표 업종 null, 추정가격 450,000,000, 입찰 시작 2026-09-28 10:00 KST/마감 2026-11-09 17:00 KST. 두 기관명이 같은 공고여서 역할별 검색/기관 fallback은 독립 검증하지 못했다. 공개 fetch 요약의 제목/공고번호/기관은 비교용 hash·역할 별칭을 사용하고 응답 원문을 저장하지 않았다. UI 캡처/DOM 증거에는 공개 공고 정보만 포함한다.
- 증거: 저장소 밖 [실행 디렉터리](/Users/jisung/.codex/visualizations/2026/10/30/01a18b9b-9017-7002-84e8-8305cceb4f47/qa-02-bid-list/preflight.json)의 `public-fetch.ndjson`, `ui-checks.json`, `retry-fixed.json`, `fixture-limits.json`, 화면 PNG, `test-final.log`·`lint-final.log`·`build-final.log`, `cleanup.json`. Git에 포함되지 않는 로컬 증거다. 인증 query/header/body·token/cookie·개인정보·환경파일 값은 수집하지 않는다.

### 조회·표시·경계 결과

실제 Next의 공개 fetch 관찰에서 기본 정렬 `bidCloseAt,asc`·결과 `openAt,desc`, metadata 200, 지역 코드11·업종6203, LIMITED/GENERAL, 1개월/3개월/6개월/1년의 KST dateFrom, 5개 BASE_PRICE 범위(최솟값 100000001·1000000001·5000000001·10000000001 포함), page999→998·size20을 확인했다. 화면 건수/URL과 각각 대조했지만 sparse 데이터로 서버 포함/제외·정렬·금액/날짜 경계의 완전성을 입증하지 않는다.

### BID-14 최초 실패와 수정 후 재검증

목록 fetch의 소유 프로세스 한정 연결 실패를 해제한 뒤 `reset()` 버튼은 실제 GET 없이 오류 화면을 유지했다. 하드 리로드로는 실제 200/1행으로 돌아왔다. 사용자 승인 후 `error.tsx` 버튼을 설치된 Next 16.2.9의 `unstable_retry`에 연결했다. 해당 설치 버전의 타입/구현에서 router refresh와 reset의 결합을 확인했고 [공식 문서](https://nextjs.org/docs/app/api-reference/file-conventions/error)의 버전 이력(16.2의 unstable_retry/16.3의 stable retry)과 구분했다. 프레임워크 버전/라이브러리는 바꾸지 않았다.

수정 후 목록·지역·업종 세 endpoint 각각 오류 안내/표 행0 → 실패 제어 제거 → 버튼 Enter → 새 실제 GET 200/표1행 복구를 확인했다. `retry-failed-ui.txt`·`retry-failed.png`·기존 실패 이벤트는 보존하고 최종 통과와 구분한다. 재현은 로컬 연결 실패이며 backend 4xx/5xx 응답을 만들거나 공유 서비스를 변경하지 않았다.

### BID-15 인증 관찰의 범위

비로그인 직접 진입은 `/bids?view=recommended`를 next로 보존해 로그인으로 이동했다. 사용자 직접 QA-A 로그인 후 준비 중 화면·표0을 확인했고 공개 목록/metadata fetch delta는 0이었다. 새로고침의 POST token/refresh 200·로그아웃 POST 200과 이후 보호 진입 로그인 복귀를 확인했다.

OAuth 귀환 수집은 auth events0·`truncated=true`로 completion HTTP 상태를 확보하지 못했다. 후속 refresh 수집도 `truncated=true`지만 해당 요청/200 응답은 실제 관찰했다. logout은 요청/200 응답·`truncated=false`다. buffer truncation을 완전한 Network 전수 수집이나 요청 미발생의 근거로 쓰지 않는다. 공개 fetch 0건은 별도 서버 관찰과 소유 코드 경로의 증거다. 쿠키 값/삭제 지시는 검사하지 않았다.

### 정리·잔여 재개 조건

QA-A 앱 로그아웃 200·로그인 복귀, 실패 제어 파일 제거, Network 해제·viewport reset·소유 Chrome 탭 닫힘, 소유 Next 종료0·PID17569/이전17224 소멸·3000 비청취를 확인했다. 신규 계정/fixture/회사/개인 필터 저장·초기화·구독 변경은 하지 않았다. Google 계정의 일반 로그인 상태나 공유 서버 기록을 임의 삭제하지 않았다.

12차단 재개에는 공사/물품·마감임박/개찰결과·20건 초과·복수 분류·서로 다른 두 기관/기관 null·금액/일자/null 경계 공고와 기대 목록·정렬·페이지, 현재 backend 실행 버전 대응 증거가 필요하다. 필요한 역할은 공개 fixture/백엔드 배포 담당·프론트 QA 실행자이며 실제 개인 배정은 미확인이다(마지막 확인 2026-10-30). 같은 BID case ID로 재검증하며 QA-16에서 이 잔여분을 전체 통합 PASS로 집계하지 않는다. 이번 제한 종료 승인을 QA-03 이후 검증 면제로 확대하지 않는다.

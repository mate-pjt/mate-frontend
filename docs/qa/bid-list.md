# 공개 입찰공고 목록 브라우저 통합 테스트

> 기존 BID-01~16의 개별 상태/환경과 2026-10-30 실행은 당시 이력으로 보존한다. 최근 판정은 [2026-11-02 재검증](#qa-02-20261102)의 동일 case별 표를 따른다. Task 상태는 WBS만 관리한다.

## 기준

- Figma 파일/섹션: [01_입찰공고리스트, 2201:18147](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2201-18147)
- 구현 화면/경로: `/bids?view=all|closing|result|recommended`
- 관련 API 명세: [Mate Swagger UI](https://api-test.mate-bid.com/swagger-ui/index.html), `GET /api/v1/bid-notices`, `GET /api/v1/regions`, `GET /api/v1/industries`
- 담당자/검토자: 미정
- 이번 작업의 정적 검증: Node 22.20.0에서 `pnpm lint`, `pnpm build`, `pnpm build-storybook`, `git diff --check` 통과. DTO mapper fixture에서 0-based 페이지 변환, 분류번호, 수요기관 우선, 분류별 null 기초금액, nullable 추정가격, KST 실제 개찰일·낙찰금액, 중복 업종 라벨 변환 통과.
- 기관 역할 표시 변경: Node 22.20.0에서 `pnpm lint`, `pnpm build`, `pnpm build-storybook`, `git diff --check` 통과. 목록 DTO의 두 기관명 분리·공백·null 경계 시나리오를 확인했다. 실제 표시는 아래 BID-05·BID-11에서 브라우저 검증 대기다.
- 실제 백엔드 브라우저 통합 상태: **2026-11-02 재검증: 10통과·6차단. 이전 4통과·12차단/승인 예외 이력을 보존하며 전체 통합 PASS와 구분한다.**

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

<a id="qa-02-20261102"></a>

## QA-02 추가 데이터 재검증 · 2026-11-02 KST

### 범위·실행·증거

- 사용자 요청으로 QA-02만 재개하고 확인할 수 없는 조건은 차단으로 남겼다. 같은 Task의 기존 데이터 조회/누락 차단·제한 종료/Git 및 QA-A 인증·소유 프로세스 조회 실패/해제·정리 승인을 유지한다. 신규 fixture/DB·업무 mutation·다른 Task 실행·공유 운영/배포는 하지 않았다. 이번 제품 수정은 없다.
- 시작 clean `main=origin/main=872b5ac34b8511b3caf74bfe8a5444702c34c95b` → `qa/qa-02-bid-list-resume`. Node 22.20.0/pnpm 11.3.0/Next 16.2.9, `https://local.mate-bid.com:3000` → `https://api-test.mate-bid.com`, 명시적 api/local 입력. 같은 소스의 빌드 snapshot은 `67eb70b3`(7그룹 api); 이번 dev snapshot 별도 추출 대신 입력과 실제 세 공개 endpoint 응답을 관찰했다. 환경파일은 검증용 guard가 내용 로딩을 차단했다. 개인 키/실제 환경값은 열람하지 않았다.
- 준비 조회: ALL 공사36/용역276/물품0, CLOSING_SOON 공사8/용역177/물품0, RESULT 세 종류 모두0. ALL 공개 보기 312행을 100행씩4 GET으로 확인했다. 약 1만 건 DB 전체 적재 성공의 증거는 아니다. 스캔상 기초금액 null312·업종 null109, 추정가격/기관/지역 null0·분류0·서로 다른 두 기관명32행이다. 종류/보기/필터별 건수는 해당 실행 시각의 응답과 대조하며 전체 적재량과 혼동하지 않는다.
- 실제 Chrome 실행 09:53:59~10:02:23 KST, 설치 버전 `156.0.8078.79`(실행 버전 별도 미노출), 1440×900/390×844/320×844. 기존 Chrome 연결/인증서 상태에서 경고 없이 열렸다. 이번 인증서/키체인·보안 설정 변경은 없다. 사용자가 기존 QA-A를 직접 선택해 로그인하고 복귀 완료를 회신했다.
- 백엔드 최근 test deployment `7366507325`/source `0e7ac62d605279fc8d51455794a910eece8aeed5`·성공 상태를 재조회했지만 현재 실행 프로세스/이미지와의 대응 증거는 미확보다. 과거 성공 배포를 현재 실행 SHA로 확정하지 않는다.
- 증거: [execution-summary.json](/Users/jisung/.codex/visualizations/2026/11/02/qa-02-bid-list-resume/execution-summary.json)과 같은 디렉터리의 readiness/fixture-limits/public-fetch/public-validation·case별 JSON/PNG·인증/정리 기록. 공개 준비 파일에는 허용된 공고/기관/업종·지역 metadata만, 표의 공고명·번호·기관 등 셀은 지문으로 기록했다. 인증 query/header/body·token/cookie·계정 원문·환경파일 값은 수집하지 않는다. 전체 원본 응답/비공개 문서·실행 artifact는 Git에 포함하지 않는다.

### 동일 case별 최근 결과

| 사례 | 2026-11-02 판정 | 이번 실제 확인·증거 | 남은 조건 |
| --- | --- | --- | --- |
| BID-01 | 통과 | 기본 공사36·첫10행, API `ALL/CONSTRUCTION/page0/size10/bidCloseAt,asc`와 표/건수·순서·현재 표시값 일치. `default-construction.json`, `public-validation.json` | 다른 종류/분류 경계는 해당 case 차단으로 구분 |
| BID-02 | 통과 | UI 보기 선택으로 곧 마감 공사8행·API/표/순서 일치, 기간 필터 없음. 전체 공사36과 포함/제외 비교. `closing-construction.json` | RESULT는 BID-03으로 분리 |
| BID-03 | 차단 | RESULT 공사/용역/물품 모두0·openAt,desc와 빈 화면 확인. `readiness.json`, `result-empty.json` | 낙찰 완료/유찰/대기·실제 개찰일/낙찰업체·율/금액 미확보 |
| BID-04 | 차단 | 공사와 용역의 실제 행, 물품0·종류 enum/URL/페이지 초기화 확인. 용역은 1개월 조건이 유지된 상태에서275행(무기간276과 구분). `category-service.json`, `category-goods-empty.json` | 물품 실제 행 없음. 빈 응답만으로 3종 전체 통과 아님 |
| BID-05 | 통과 | 같은 공고1002223의 공고명/번호·서로 다른 공고기관/수요기관으로 각각1행, 입력/URL 일치·뒤로가기·페이지2 검색→첫 페이지·Enter 초기화·옛 agency 제거 완료. `search-*.json`, `back-search-restored.json`, `legacy-agency-removed.json` | redirect 중간 관찰은 별도 보존·최종 결과와 구분 |
| BID-06 | 통과 | 부산→26·결과23행, 실제 부산 공고 포함/전남 제한 공고 제외·해제36행. 업종 종합국가유산수리업(보수단청업)→0042·3행·해제36행, 알려진 해당 단일 업종 공고 포함/다른 단일 업종 공고 제외. `region-busan.json`, `industry-0042.json`, `public-validation.json` | 복수/고급 편집은 범위 밖. API 지역 결과의 지역 제한 없음 공고 포함도 준비 스캔과 대조 |
| BID-07 | 통과 | 공사 GENERAL13/LIMITED22/PRIVATE1, 용역 NOMINATION3의 실제 행·라벨→enum·건수/각 행 계약과 해제 확인. `contract-*.json` | 새로운 계약 정책을 결정하지 않음 |
| BID-08 | 차단 | 4기간의 KST dateFrom/BID_BEGIN·36행, 5개 BASE_PRICE 범위/해제와 각0행 확인. `period-*.json`, `amount-preset-*.json` | 기초금액312행 모두 null·정확한 날짜/금액 경계 표본 없음. 경계 중복/누락을 PASS로 추정하지 않음 |
| BID-09 | 차단 | RESULT 1개월 dateFrom/dateTo, 금액 파라미터 없음·낙찰금액 준비 중 비활성 확인. `result-period-month.json` | 최근/과거 실제 개찰결과 없음 |
| BID-10 | 통과 | UI size20/page1→API page0 20행, UI page2→API page1 16행. 두 페이지 ID 중복 없이 공사36행 전체/순서와 일치. page999→API998·빈 페이지 문구·Enter 첫 페이지 복귀. `page-size20-*.json`, `out-of-range-page.json`, `first-page-return.json` | 20행 초과 누락 해소. 범위 밖 페이지와 검색0은 서로 구분 |
| BID-11 | 차단 | 기초금액/업종 null의 —, 서로 다른 두 기관에서도 수요기관 우선과 존재 값 표시를 실제 표/응답으로 대조 | 추정가격/지역/기관 누락 및 결과 nullable 사례 없음. 부분 null 확인을 전체 통과로 바꾸지 않음 |
| BID-12 | 차단 | 단일 행의 공고번호/제목 두 링크가 `/bids/1002223`로 동일, 제목 Enter·해당 상세 h1 지문·뒤로가기 검색 복원 확인. `single-detail-link.json`, `detail-back-restored.json` | 분류 행/같은 ID의 두 분류 쌍 없음. 상세 section 자체는 이번 판정 범위 아님 |
| BID-13 | 통과 | 없는 검색어의 실제200/0행·빈 결과 문구, 금액/물품0에서도 mock 대체 없음. `empty-search.json`, `empty-search-ui.txt` | 누락 fixture를 합성하지 않음 |
| BID-14 | 통과 | 목록/지역/업종 각각 소유 프로세스 fetch만 실패(outbound 없음)→오류/표0, 해제 후 Enter 재시도로 새 실제 GET200/표20행 복구. `failure-*.json`, `retry-*.json`, `public-fetch.ndjson` | 이전 reset 결함은 이미 main 수정됨. 이번 수정0, 실제 backend 4xx/5xx 증거 아님 |
| BID-15 | 통과 | 비로그인 recommended 직접 접근의 next 보존·사용자 QA-A 로그인 복귀·준비 화면/표0. observer 재활성 후 refresh Fetch200·logout Fetch200 및 이후 로그인 복귀. 해당 구간의 공개 목록/metadata fetch delta0. `recommended-*.json`, `network-refresh-reenabled-settled.json`, `network-logout.json`, `final-anonymous.json` | OAuth completion/쿠키 삭제 미판정. 초기 수집 truncation·빈 이벤트를 성공/미발생 근거로 쓰지 않음 |
| BID-16 | 통과 | 1440/390/320에서 20행 유지·document 가로 넘침 없음, 표 overflow auto·모바일 scrollLeft0→305, 메뉴 Enter/Escape·검색/페이지/링크/재시도 Enter 확인. `responsive.json`, `horizontal-scroll.json`, `keyboard-menu.json` | 표 내부 가로 스크롤과 페이지 가로 넘침을 구분 |

### 검증·정리·재개

- 최근 결과 **통과/실패/차단/대기 `10/0/6/0`**. 새 통과는 BID-01·02·05·06·07·10이며 BID-13~16도 재확인했다. BID-03·04·08·09·11·12 및 현재 backend 실행 버전 대응이 남아 **전체 통합은 차단**이다. 이전 4/0/12/0과 BID-14 최초 실패/수정 이력을 덮어쓰지 않는다.
- 실제 공개 화면44개 상태를 서버 응답과 행/건수·링크/순서·모든 현재 표시 셀 지문으로 대조했고 독립 포함/제외·페이지 합집합/교집합 검사도 PASS. 이는 경계 표본이 없는 6사례의 통과를 대신하지 않는다.
- test/lint/build는 이번에 재실행하지 않았다. 직전 QA-01의 Node22.20.0 test62/8파일·lint·api/local 기본 Turbopack build PASS와 현재 제품/테스트/설정 등220개 파일의 지문 일치를 확인해 [재사용 근거](/Users/jisung/.codex/visualizations/2026/11/02/qa-02-bid-list-resume/static-evidence-reuse.json)로 연결했다. 이번 검증은 새 실제 Next/Chrome 실행이며 코드/설정 변경이나 제품 실패가 없어 영향 없는 앱 검사를 반복하지 않았다. 로컬 build-storybook도 공용 UI/Storybook 변경 없어 미실행이다.
- 최초 외부 공개 validator는 이름이 같은 redirect 중간/최종 기록을 함께 세어 실패했다. `*-intermediate` 파일을 최종 판정에서 제외하는 helper1회 교정 후44상태 모두 PASS; 원래 실패 기록과 중간 관찰은 보존했다. 제품 수정0/3. OAuth 복귀 후 초기 buffer는 truncated/빈 이벤트였고 Network 관찰을 다시 켠 뒤 false 구간에서 refresh Fetch200(seq4550), logout Fetch200(seq4569)을 실제 회수했다. completion HTTP나 cookie/header/body를 추정하지 않는다.
- QA-A logout200/보호 진입의 로그인 복귀·소유 Next 종료0·소유 PID/group 소멸/3000·3001 비청취·실패 제어 제거·화면 override reset·Network disable·소유 Chrome 탭 닫힘 완료. `cleanup.json`, `process-exit.json` 참조. Google 일반 로그인/무관한 탭·공유 서버 데이터는 정리 대상으로 삼지 않았다.
- 남은6사례는 공개 테스트 데이터/배포 담당이 물품·결과 상태/금액·분류 쌍·기관/지역/추정가격/결과 null·정확한 날짜/기초금액 경계 및 현재 실행 식별자를 준비하면 같은 BID ID로 재개한다. 실제 계약상 발생하지 않는 조건은 담당자 합의 전 임의로 면제하지 않는다. 기존 QA-02 전용 제한 진행/Git 예외만 유지하고 다음 Task의 검증 면제로 확대하지 않는다.
- 다음 후보는 QA-03 재개다. P0 표 순서·PREP-01/QA-04 main 선행·기존 QA-02 진행 예외를 근거로 별도 Gate를 준비하며, 이번 대화에서 상세 QA를 실행하지 않는다.

<a id="pol-02-recommended-qa"></a>

## 2026-11-05 · POL-02 정책과 DEV-03 맞춤 목록 QA 인계

이번에는 정책/소스만 대조했고 앱·mock/HTTP 대역·브라우저·업무 API를 실행하지 않았다. 기존 BID-01~16 및 2026-11-02의 통과/차단·예외는 그대로다. BID-15의 통과는 **인증 후 준비 안내**의 과거 증거이며 새 맞춤 결과의 통과가 아니다.

- 정책/계약 근거: [POL-02 승인3결정](../development/figma-v01/tasks/POL-02.md#pol-02-approved-decisions)·[배포 계약 재개 표](../development/figma-v01/tasks/POL-02.md#pol-02-resume). 기존 개인 필터 GET/current + 공개 GET/bid-notices?view=ALL 조합으로 정의했지만, 배포 OpenAPI 비인증 GET403/version·실행 대응 미확보와 QA-10 reset Major를 유지한다.
- 공통 Figma: [맞춤 목록 3003:47410](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3003-47410), [홈 CTA 2016:57355](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2016-57355). 이번에 디자인을 다시 조회하거나 UI 설계를 시작하지 않았다.
- 공통 화면: `/bids?view=recommended` 및 `/`의 CTA·내부 로그인 복귀. 필요한 API는 `GET /api/v1/bid-notice-filters/current`, `GET /api/v1/bid-notices?view=ALL`, 인증의 기존 세션 처리다. 조회 검증에 PUT/reset/import를 암묵적으로 포함하지 않는다.
- 공통 차단/담당 역할: POL-02 배포 계약·실행 대응과 reset 차이 처리 범위 미확보, DEV-03 미구현. 백엔드 계약/배포·fixture 담당과 프론트 QA 실행자가 비식별 계정 별칭·시작 snapshot/source/version·매칭 행/총건수/정렬·오류/401·종료/잔존/복구·현재 실행 식별자를 준비한다. 개인 배정은 미확인이다.

아래 9사례는 **신규 실제0통과·9차단/미실행**이며 개발 완료 뒤 실행할 수용 기준이다. 기존 BID/PBF의 case ID·판정/집계와 합치지 않는다.

| ID | 준비 데이터·조작 | 예상 UI/API 결과 | 상태·증거 |
| --- | --- | --- | --- |
| RBD-01 | 비식별 SAVED 비어 있지 않은 계정(회사 연결/미연결), 홈 CTA·익명 직접 진입→로그인→복귀 | 내부 next/recommended 유지, 현재 snapshot→ALL 자동 조회. 회사 미연결이어도 유효 SAVED 우선, 예전 계정 URL 조건을 저장값으로 사용 안 함 | 차단·미실행, 공통 선행 미충족 |
| RBD-02 | 미저장·활성 회사/비어 있지 않은 COMPANY_DEFAULT, recommended 진입/reload | 회사 projection 출처 구분·자동 조회, GET으로 개인 row/version/회사 값 변경 없음 | 차단·미실행, 공통 선행 미충족 |
| RBD-03 | 미저장/회사 없음 EMPTY_DEFAULT, recommended 진입 | 조건 설정 안내와 전체 공고 이동. 전체 결과를 맞춤 결과로 대체하지 않음 | 차단·미실행, 공통 선행 미충족 |
| RBD-04 | 기존 빈 SAVED와 빈 COMPANY_DEFAULT fixture, 진입/reload | 조건 설정 안내, SAVED 우선/회사 기본값 자동 재적용 없음. reset을 실행해 fixture를 만들지 않음 | 차단·미실행, reset 대역 차이 유지 |
| RBD-05 | 조건별 포함/제외·null·경계와 물품/용역 복수 분류, 2page 이상 | 마감 빠른 stable 서버 순서, canonical 행/count·UI1/API0·크기10/20/30, ID/분류 상세 이동. 조건의 빈 bidTypes를 UI 기본 공사로 몰래 제한하지 않음 | 차단·미실행, 공통 선행 미충족 |
| RBD-06 | 유효 조건의 매칭0건·키워드/페이지/크기 변경·hard reload | 조건 없음과 매칭0건 구분. 검색/page/size 비저장, 조회만으로 snapshot/회사 변경 없음, reload는 현재 계정 snapshot 재조회 | 차단·미실행, 공통 선행 미충족 |
| RBD-07 | snapshot GET/ALL 각각 안전한 네트워크 실패·실서버 오류/해제 조건 | 오류/재시도, 필수 응답 오류를 EMPTY_DEFAULT나0건으로 숨기지 않음, 전체/mock 자동 fallback 없음. 대역과 실제 오류 결과 분리 | 차단·미실행, 안전한 재현/해제 승인·자원 미확보 |
| RBD-08 | 승인된 두 계정·세션401/refresh 조건·지연 응답·로그아웃/교체 | 기존401 동일 계정 갱신1회·재로그인 복귀, 이전 계정 snapshot/행/늦은 응답 제거·비노출 | 차단·미실행, 계정/세션 사용·종료/복구 범위 미확보 |
| RBD-09 | 위 상태별390/320px·키보드·reload·기존 ALL 내 맞춤 회귀 | 안내/전체 이동·페이지/재시도 조작 가능. ALL 수동 적용/명시적 저장은 그대로, recommended 조회로 저장/reset/import 없음 | 차단·미실행, DEV-03/QA Gate 후 실행 |

기존 HOME-09/PBF-01~12와의 연결은 각 QA의 이번 인계 절에 남긴다. 현재 소스 commit·정책 문서 검증·원격 CI 성공은 이 9사례의 실제 API 통합 PASS를 의미하지 않는다.


<a id="pol-07-advanced-qa"></a>

## 2026-11-09 · POL-07 고급 필터 정책·후속 QA

- 근거: [승인 D1/D2·D3 직접 조사 요청](../development/figma-v01/tasks/POL-07.md#pol-07-decisions)·[정책 v1](../development/figma-v01/tasks/POL-07.md#pol-07-contract)·[후속 Gate](../development/figma-v01/tasks/POL-07.md#pol-07-handoff). DEV-09~11 구현은 미착수, DEV-12는 낙찰금액 계약 전 보류다.
- 이번 근거 확인은 소유 소스·현재 브라우저 OpenAPI3.1.0/v1 schema·GitHub test 배포 success/dev SHA 기록이다. 업무 목록/개인 필터 API·mutation·mock/HTTP 대역·제품 브라우저 QA는 **실행0건·신규 통과0건**이다. 아래 ADV12개는 대기이며 배포 문서 열람을 기능 통과로 세지 않는다.
- 기존 BID-01~16/QA-02·POL-02 추천 목록/QA-10 reset Major와 타 Task의 차단·승인 예외를 유지한다. 특히 BID-08 경계와 BID-09 결과 낙찰금액 이력을 이 정책으로 해소하지 않는다.
- 공통 준비: 각 DEV의 자체 Brief/실행 코드 식별자·백엔드 실행 대응, 지역 계층/제한 없음/미확인/공동도급·날짜/금액 경계·공사/물품/용역/복수 분류·null 기대 행/count/page/정렬, 안전한 오류/해제, 실제 조회·개인 저장이 필요하면 합성 계정/시작 snapshot·사용/변경·잔존·복구 범위. 자원 준비는 **미확인**이며 사용자 미준비 답변으로 기록하지 않는다. 필요한 역할은 백엔드 계약/배포·fixture 담당과 프론트 QA 실행자, 개인 배정은 미확인이다.
- 화면/API 공통: `/bids`의 해당 view, 공개 `GET /api/v1/regions`와 `GET /api/v1/bid-notices?view=ALL|CLOSING_SOON|RESULT`. 실제 실행 시 기존 공통 양식의 시각/브라우저·크기/캡처·비식별 Network 요약을 추가한다. Authorize/Try it out으로 업무 요청을 실행한 것이 아니다.

| ID | Figma / 후속 | 준비·조작 | 기대 UI/API 결과 | 상태·근거 |
| --- | --- | --- | --- | --- |
| ADV-01 | 2080:64254·64609 / DEV-09 | 지역 metadata의 시도/시군구·복수 code 선택→적용→URL/reload | parentCode/depth 기반 선택, 반복 code와 표시 라벨 분리·왕복; 라벨/코드 자릿수 추정 없음 | 대기·구현/fixture/실행 대응 확인 전 |
| ADV-02 | 동일 / DEV-09 | 지역 선택 후 지역 업체만 OFF/ON·해제, 제한 없음/UNKNOWN/실패 공고 비교 | OFF는 실제 제한 일치+확인된 NO_ROWS, ON은 제한 일치만; 미확인을 제한 없음으로 대체하지 않음 | 대기·기대 행/상태 fixture 필요 |
| ADV-03 | 동일 / DEV-09 | 지역 유무 각각 공동도급 ALL/REQUIRED/AVAILABLE 선택 | ALL 무제한; REQUIRED 지역의무, AVAILABLE은 REQUIRED 제외; 공개3view 동일 의미 | 대기·의무/가능/불가 합성 공고 필요 |
| ADV-04 | 동일 / DEV-09 | 지역0+only, 50개/초과·invalid code, 종속 flag 해제·잘못된 URL 입력 | 잘못된 조합 적용/저장 오류 안내, 조용한 무시/임의 code 보정 없음; 지역 제거 시 only 해제 | 대기·입력/URL·서버 오류 계획 필요 |
| ADV-05 | 2081:61968·62097 / DEV-10 | ALL의 날짜3종·단일일/양쪽/한쪽 열린 기간 적용 | 종류별 실제 날짜, KST 양끝 날짜 포함·선택 종류/범위 URL 왕복, 서버 count 일치 | 대기·종류별 경계 공고 필요 |
| ADV-06 | 동일 / DEV-10 | 윤년/월말·존재하지 않는 날짜·역전·KST00:00 직전/직후 비교 | 실제 달력 검증·역전 오류; 시작00:00 포함/종료 다음날00:00 제외, 자동 보정 없음 | 대기·정확한 경계 fixture 필요 |
| ADV-07 | 동일 / DEV-10 | 선택 종류에서 1/3/6개월·1년 preset→직접 입력→취소/초기화→reload | 선택 종류 유지·기존 KST/월말 clamp·절대 날짜; 양쪽 빈 값이면 종류 해제; 팝업 적용은 계정 무쓰기 | 대기·UI/URL 구현 및 실행 계획 필요 |
| ADV-08 | 동일 / DEV-10 | closing 날짜 경로와 RESULT 직접 기간·preset 확인 | closing 날짜 UI/query 없음; RESULT 개찰일 고정/dateType 무전송·openAt desc, 개인 저장 없음 | 대기·현행 query 수용과 실제 적용 차이를 구분 |
| ADV-09 | 2083:61727·2085:67295 / DEV-11 | ALL/closing에서 기초/추정가격과 분류별 금액·null 비교 | BASE_PRICE 행 기준/ESTIMATED_PRICE 공고 기준·null 제외, 다른 값 대체 없음 | 대기·복수 분류/누락 금액 fixture 필요 |
| ADV-10 | 동일 / DEV-11 | 0·같은 값·열린 범위·preset 경계±1원·역전/음수/소수/안전정수 초과와 표시 단위 왕복 | 양끝 포함·0/null 구별·정확한 정수 원(최대9,007,199,254,740,991); 반올림/교환/overflow 없음 | 대기·금액 경계·입력/URL/서버 오류 필요 |
| ADV-11 | 동일 및 2134:10709 / DEV-11·DEV-12 | 선택 금액 종류에서 preset/직접 범위/해제, RESULT 금액 버튼/URL 확인 | preset 종류 유지·양쪽 빈 값이면 종류 해제; RESULT 낙찰금액 준비 중·미지원 query/저장 필드 없음 | 대기·낙찰금액 자체 기능은 계약 전 보류 |
| ADV-12 | 위 필터 node / DEV-09~11 | 지역/공동/날짜/금액/검색 조합·페이지/정렬·오류/재시도·320/390px/키보드 | 그룹 AND/지역 OR·canonical 서버 count/page·기존 정렬·조건변경 page1·오류를 빈 결과로 숨기지 않음; 접근성/취소/표시 정상 | 대기·통합 조합/오류·모바일 자료 필요 |

재개 첫 행동: 해당 DEV의 최신 main·정책·source/배포 drift와 실제 검증 자료/승인 범위를 먼저 확인한다. GitHub 배포 기록은 실행 프로세스 SHA 직접 증명이 아니며 OpenAPI의 required 누락/`success` wrapper 설명을 근거로 frontend 검증·`isSuccess` wire 처리를 완화하지 않는다.


<a id="dev-65-mock-qa"></a>

## 2026-11-11 · DEV-65 검색·view mock 교정 검증

- 범위/근거: [DEV-65 Brief](../development/figma-v01/tasks/DEV-65.md#dev-65-brief)·[CF-11](../development/figma-v01/audits/2026-11-11.md#cf-11). 목록 Figma2048:58606의 검색·3view·페이지/빈 상태에 연결한다. UI 구성/고급 필터/관련 공고를 변경하지 않는다.
- 실행: frontend 시작 `4ecdfba` + DEV-65 diff, 환경파일 없는 격리 Next16.2.9 dev/all-mock, Node22.20.0/pnpm11.3.0·Aside Chrome154, 1440×1000/390×844/320×740. 로컬 증거 `mate-dev-65/browser/`·test/lint/3구성 build 로그·server 공개 읽기 요약.
- **실제 API 실행0·신규 실제 통과0.** BID-01~16·QA-02의 실제10통과/6차단·ADV/RBD 대기·QA-10 reset Major·기존 정책/예외는 그대로다. 기존 HTTP fetch 대역은 실제 통합이 아니다.

| 사례 | 조작/기대 | 이번 mock 관찰·증거 |
| --- | --- | --- |
| DEV65-L01 | 번호·기관·공고명 검색/trim·대소문자 | `  mock-10001-00  `→1행/trim URL, 발주기관/수요기관→기본 공사9행, ‘공고 13’→10013 한 행. `search-number`·`search-notice-agency`·`search-demand-agency`·`search-title` JSON |
| DEV65-L02 | 없는 검색/조건 초기화 | 0건 안내, 초기화 뒤 기본 공사9행 복원. `search-empty.json`, `search-reset.json`. 공백만 입력은 Node 테스트에서 전체와 동일함 확인 |
| DEV65-L03 | ALL/홈·정렬·페이지/reload | 공개 URL `personal=1`의 빈 조건으로 유형 제한 없는27행을 조회(저장/로그인/mutation 없음). 첫10행 중9행은 홈과 동일, 2페이지10행 중복 없음·hard reload 순서 유지, 검색 시 page1. `all-first-page`·`all-second-page`·`all-reload` JSON |
| DEV65-L04 | closing/result 전환 | UI 기본 공사 조건에서 마감3행10001/10013/10025, 결과3행10004/10016/10028. 무유형 closing9/result9 및 3일 상한/마감 순간·결과 없는 마감·개찰 최신/ID 동률은 Node 계약 테스트로 검증. `closing-view.json`, `result-view.json` |
| DEV65-L05 |390/320px·키보드 | 문서 scrollWidth는 각각390/320, 검색 입력→Tab의 ‘검색어 지우기’ 포커스, 번호 링크 Enter→10001/분류1 상세 h1 확인. `search-mobile-390.json`, `search-mobile-320.json`, `detail-keyboard.json`. 표 내부 가로 스크롤은 기존 방식 |
| DEV65-L06 | empty/error·복원 | 빈 데이터와 오류 제목/재시도 버튼을 구분. default 재시작/HMR 뒤9행 복원이며 성공한 재시도 클릭으로 확대하지 않음. `list-empty.json`, `list-error.json`, `list-restored.json` |

- 보호/네트워크: 권한/409·개인 저장/계정/업로드는 변경하지 않았고 기존 전체 계약 테스트로 회귀 확인했다. 브라우저 외부/업무 요청0, 서버 상세 재계측 업무 외부 fetch0. Next 자체 npm 버전 조회 차단과 초기 host 미기록4건을 Task에 따로 남긴다. 실제 API·배포/서버 실행 SHA를 확인한 것이 아니다.
- 캡처 한계: fullPage PNG는 캡처 연결 중복 흔적이 있어 시각 판정에 사용하지 않는다. JSON 접근성/URL·행 관측과 후속 viewport 캡처를 근거로 구분한다. 모든 Figma frame/pixel을 재검토한 것은 아니다.

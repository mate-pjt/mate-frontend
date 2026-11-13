# 공개 입찰공고 상세 브라우저 통합 테스트

## 기준

- Figma 파일/섹션: [02_입찰공고상세, 2201:18858](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2201-18858)
- 구현 화면/경로: `/bids/[bidId]`, 선택적 `bidClsfcNo`, `itemPage`, `resultId`, `participantsPage`
- 관련 API 명세: [Mate Swagger UI](https://api-test.mate-bid.com/swagger-ui/index.html), `GET /api/v1/bid-notices/{id}` 및 아래 독립 section API
- 담당자/검토자: 미정
- 기존 상세 구현 시 정적 검증(과거): Node 22.20.0에서 `pnpm lint`, `pnpm build`, `git diff --check` 통과. 별도 DTO mapper 계약 시나리오에서 분류번호·KST·nullable 금액·수집 미확정 상태·안전한 외부 URL·첨부 미리보기·낙찰 결과·0-based 페이지 변환 통과.
- 기관 역할 표시 변경: Node 22.20.0에서 `pnpm lint`, `pnpm build`, `pnpm build-storybook`, `git diff --check` 통과. 공고기관 담당자 이메일이 없고 수요기관 담당자 이메일만 있는 DTO에서도 두 출처를 분리하는 시나리오를 확인했다. 실제 표시는 아래 DETAIL-02에서 브라우저 검증 대기다.
- 실제 백엔드 브라우저 통합 상태: **2026-11-02 추가 데이터 재검증 1통과·0실패·8차단·0대기**. 최신 결과는 [재개 결과 표](#qa-03-20261102)를 따른다. 아래 기존 9개 테스트 항목의 상태·부분 확인은 2026-10-30의 0통과·9차단 이력으로 보존한다. QA-03 전용 제한 종료 승인과 전체 통합 PASS는 별개다. [작업 기록](../development/figma-v01/tasks/QA-03.md) · [검토 기록](../development/figma-v01/reviews/QA-03.md).

## 실행 환경 기록

| 실행일시 | 프론트 URL·배포/commit | 백엔드 URL·배포 | 브라우저·화면 크기 | 테스트 데이터 별칭 | 수행자 |
| --- | --- | --- | --- | --- | --- |
| 2026-10-30 16:47~16:52 KST | `https://local.mate-bid.com:3000`, source `be62c9d51a72fee4daab2f0391ab5404d40d8229` + QA-03/WBS Markdown, `qa/qa-03-bid-detail-live` | `https://api-test.mate-bid.com`; 최근 성공 deployment `7366507325`/run `40552546758`, 현재 실행 SHA/이미지 대응 미확인 | Chrome UA `156.0.0.0`(축약 UA, 정확 patch 미수집), 1440×900·390×844·320×844 | `public-service-A`: 정상 SERVICE 1행·분류0·결과0·관련0·첨부 metadata3 | Codex |

실행 설정은 환경파일 내용을 열지 않고 공개 `api/local` 입력만 명시했다. 소스에서 같은 입력으로 계산한 snapshot fingerprint는 `67eb70b3`이며 7개 그룹 모두 api다. 이 계산값과 과거 snapshot을 현재 backend 실행 식별자로 사용하지 않는다. 서버 공개 fetch 요약과 브라우저 Document GET 200을 대응했고 후자의 cursor 755는 `truncated=false/hasMore=false`다. 전체 브라우저 Network나 과거 인증 요청을 전수 수집한 결과는 아니다.

로컬 증거: [실행 디렉터리](/Users/jisung/.codex/visualizations/2026/10/30/01a18bc1-ed81-78f2-8101-d6ab92244e50/qa-03-bid-detail)의 `public-fetch.ndjson`, `detail-safe-ui.json`, `detail-actions.json`, `responsive.json`, section 실패 JSON·PNG, `not-found-api.json`/`not-found-ui.txt`, `browser-network.json`, test/lint/build 로그, `cleanup.json`. Git에 포함하지 않는 로컬 증거이며 다른 Mac에서는 원문 캡처가 없을 수 있다. 화면은 담당자 연락처·첨부명 구간을 제외했다. 파일 내용·외부 원문·비밀 URL·인증정보는 수집하지 않았다.

## 선행 조건·차단 사항

- Next.js 서버가 테스트 API의 공개 GET에 접근할 수 있어야 한다. 상세 JSON은 서버에서 가져오므로 브라우저의 CORS 허용만으로 성공을 판단하지 않는다.
- 첨부파일 미리보기·다운로드는 브라우저가 API의 스트리밍 URL을 직접 연다. 이 경로는 JSON 조회와 별도로 실제 브라우저에서 확인한다.
- 공사·용역·물품, 분류가 여러 개인 공고, 변경·취소·재입찰, 개찰·낙찰·유찰, 파일, 관련 공고를 갖춘 테스트 데이터가 필요하다.
- Figma의 지시사항 본문·정정 이력 목록은 현재 공개 API에 대응 데이터가 없어 사용자 승인에 따라 표시하지 않는다. 공고의 `noticeChangedAt`·`changeReason`만 표시한다.
- Figma의 `상세입찰`과 백엔드 `isDetailedBid`의 명세 문구 `내역입찰`은 의미가 일치하는지 확인이 필요하다. 현재 화면에는 백엔드 의미대로 `내역입찰`로 표시한다. Figma의 `계약체결형태`와 `데이터 수집안내`의 단일 기준일·수집일은 상세 API 대응 필드가 확인되지 않아 표시하지 않는다.
- 계정별 공고 알림 설정·해제·로그인 복귀·실패는 [bid-alert.md](./bid-alert.md)에서 별도 검증한다.

## 테스트 항목

### DETAIL-01 — 목록에서 분류별 상세로 이동

- Figma node: [입찰공고 상세 기본, 2113:19107](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2113-19107)
- 화면 경로: `/bids` → `/bids/[bidId]?bidClsfcNo=<번호>`
- API: `GET /api/v1/bid-notices?view=ALL...`, `GET /api/v1/bid-notices/{id}?bidClsfcNo=<번호>`
- 준비 데이터: 한 공고에 여러 분류가 있는 물품 또는 용역
- 조작: 목록의 공고번호와 공고명을 각각 눌러 상세로 이동한 뒤 다른 분류를 선택한다.
- 예상 결과: 목록 행의 backend ID와 분류번호가 URL·상세 요청에 보존된다. 분류 선택 시 해당 분류 값과 섹션이 바뀌며 다른 공고로 이동하지 않는다.
- 상태: 차단
- 이번 부분 확인: 공고번호 링크와 공고명 링크 모두 `/bids/2`로 이동하고 본문 GET 200을 확인했다.
- 환경/증거: 위 2026-10-30 실행 환경. `title-navigation.json · detail-safe-ui.json · public-fetch.ndjson`
- 차단/담당 역할/재개 조건: 복수 분류 fixture가 없어 선택 변경·분류 URL/요청 보존은 미실행. 공개 공고 fixture 담당·프론트 QA 실행자가 복수 분류 기대값을 확보한 뒤 재개. backend 현재 실행 버전 대응 증거도 미확인(확인일 2026-10-30); 담당 개인 배정은 미확인.
- 결함/재검증: 확정 제품 결함 없음. 미실행·도구 한계는 전체 통과와 구분하며 조건 확보 후 이 case ID로 재검증.

### DETAIL-02 — 공사·용역·물품 기본정보

- Figma node: [공사 2113:19107](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2113-19107), [용역 2196:16577](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2196-16577), [물품 2196:21087](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2196-21087)
- 화면 경로: `/bids/[bidId]`
- API: `GET /api/v1/bid-notices/{id}`
- 준비 데이터: 각 업무 유형의 공개 공고, 공고기관과 수요기관이 다른 공고, 한쪽 기관명 또는 담당자 이메일이 없는 공고
- 조작: 각 상세를 열어 공고번호·제목·일정·금액·예가·참여자격·기관 정보를 비교하고 금액 `숫자/원` 전환을 누른다.
- 예상 결과: 실제 응답의 원 단위 금액과 KST 일정, 업종·지역 제한 상태, 내역입찰·실적경쟁·상호시장진출, 참조번호가 표시된다. 기본정보의 기관 요약은 수요기관 우선으로 역할을 명시하고, 기관 정보에는 두 기관명과 기관별 담당자 이메일이 서로 바뀌지 않고 표시된다. 공고기관 담당자 이름·전화·이메일이 수요기관의 값으로 대체되지 않는다. 발주기관 소재지는 참가가능지역과 구분된다. null 금액·연락처·일정을 0이나 임의 값으로 만들지 않는다. 수집 상태가 미확정인 제한 여부는 ‘확인 중’으로 표시하고, 정정되지 않은 공고에 정정 문구가 없다.
- 상태: 차단
- 이번 부분 확인: 정상 용역에서 KST 일정·기초금액 null→정보 없음·추정가격 450,000,000/예산 495,000,000·수요기관 우선 역할·제한 없음·비예가·정정 문구 부재를 확인했다. 숫자↔억/만 왕복은 원래 값으로 돌아왔다.
- 환경/증거: 위 2026-10-30 실행 환경. `detail-safe-ui.json · detail-actions.json · desktop-1440.png`
- 차단/담당 역할/재개 조건: 공사/물품·기관 역할/null·미확정 제한/일정 경계를 대조할 승인 fixture 기대값이 없다. 담당자 이름/연락처 원문은 이번 수집 범위에서 제외해 읽거나 기록하지 않았다. fixture 담당·프론트 QA 역할의 비식별 경계 fixture 필요. backend 현재 실행 버전 대응 증거도 미확인(확인일 2026-10-30); 담당 개인 배정은 미확인.
- 결함/재검증: 확정 제품 결함 없음. 미실행·도구 한계는 전체 통과와 구분하며 조건 확보 후 이 case ID로 재검증.

### DETAIL-03 — 물품 품목정보와 페이지

- Figma node: [물품 2196:21087](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2196-21087)
- 화면 경로: `/bids/[bidId]?bidClsfcNo=<번호>&itemPage=2`
- API: `GET /api/v1/bid-notices/{id}/purchase-items?bidClsfcNo=<번호>&page=0|1&size=10`
- 준비 데이터: 등록 품목이 11개 이상인 물품 공고, 소수 수량·단가를 가진 품목, 빈 품목 공고
- 조작: 품목정보를 보고 다음·이전 페이지로 이동하고, 존재하지 않는 페이지 번호를 주소에 직접 입력한다.
- 예상 결과: 품목합계·품목수·수량합계·최소~최대 단가 및 품목명·규격·소수 수량·소수 단가가 API와 일치한다. 페이지는 UI 1부터, API 0부터 센다. 범위를 벗어난 페이지에서는 복귀 링크를 제공한다. 공사·용역 화면에는 물품 품목정보를 억지로 표시하지 않는다.
- 상태: 차단
- 이번 부분 확인: 현재 공고는 SERVICE이며 화면에 물품 품목정보가 없고 purchase-items 요청도 발생하지 않았다.
- 환경/증거: 위 2026-10-30 실행 환경. `detail-safe-ui.json · public-fetch.ndjson`
- 차단/담당 역할/재개 조건: 물품 11개 이상·소수 수량/단가·빈 품목·페이지 경계 fixture가 없어 핵심 사례 미실행. 공개 공고 fixture 담당 필요. backend 현재 실행 버전 대응 증거도 미확인(확인일 2026-10-30); 담당 개인 배정은 미확인.
- 결함/재검증: 확정 제품 결함 없음. 미실행·도구 한계는 전체 통과와 구분하며 조건 확보 후 이 case ID로 재검증.

### DETAIL-04 — 정정·취소·재입찰 사실

- Figma node: [정정 공고 2201:18876](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2201-18876)
- 화면 경로: `/bids/[bidId]`
- API: `GET /api/v1/bid-notices/{id}`의 `header.status`, `noticeChangedAt`, `changeReason`
- 준비 데이터: 변경·취소·재입찰 공고 각각
- 조작: 각 상세를 연다.
- 예상 결과: 실제 상태·변경 시각·사유만 표시된다. API에 없는 과거 공고 개수·정정 이력·지시사항 본문은 생성하지 않는다.
- 상태: 차단
- 이번 부분 확인: NORMAL 응답에서 변경 시각/사유가 없고 정정·취소·재입찰/임의 이력 UI가 나타나지 않았다.
- 환경/증거: 위 2026-10-30 실행 환경. `detail-safe-ui.json · public-fetch.ndjson`
- 차단/담당 역할/재개 조건: MODIFIED/CANCELLED/REBID fixture가 없어 상태·시각·사유의 양성 사례는 미실행. 공개 공고 fixture 담당 필요. backend 현재 실행 버전 대응 증거도 미확인(확인일 2026-10-30); 담당 개인 배정은 미확인.
- 결함/재검증: 확정 제품 결함 없음. 미실행·도구 한계는 전체 통과와 구분하며 조건 확보 후 이 case ID로 재검증.

### DETAIL-05 — 개찰결과·회차·참여업체

- Figma node: [공사 개찰결과 2205:19427](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2205-19427)
- 화면 경로: `/bids/[bidId]?resultId=<결과ID>&participantsPage=2`
- API: `GET /api/v1/bid-notices/{id}/bid-results?bidClsfcNo=<번호>`, `GET /api/v1/bid-notices/{id}/bid-results/{bidResultId}/participants?page=0|1&size=20` 및 2페이지 이상에서 요약용 `page=0&size=3`
- 준비 데이터: 다회차 결과, 낙찰·유찰, 참여업체 21개 이상, 미발표 결과
- 조작: 결과 회차를 바꾸고 참여업체 다음·이전 페이지를 누른 뒤, 존재하지 않는 페이지 번호를 주소에 직접 입력한다.
- 예상 결과: 선택한 회차의 상태·낙찰업체·낙찰금액·낙찰률·참여업체가 API와 일치한다. 참여업체 페이지를 넘겨도 상위 3위 요약은 유지되고, 범위를 벗어난 페이지에서는 복귀 링크를 제공한다. 낙찰금액을 추정가격으로 계산하지 않는다. 미발표 공고에는 임의 결과를 표시하지 않는다.
- 상태: 차단
- 이번 부분 확인: 결과 GET 200·results0·completeness NOT_EVALUATED에서 임의 개찰결과나 참여업체가 나타나지 않았다. 이를 미발표 확정 fixture로 간주하지 않는다.
- 환경/증거: 위 2026-10-30 실행 환경. `detail-safe-ui.json · sections-safe-ui.json · public-fetch.ndjson`
- 차단/담당 역할/재개 조건: 다회차·낙찰/유찰·21개 이상 참여업체·상위3 유지와 분류/페이지 fixture 미확보. 공개 공고/개찰 fixture 담당 필요. backend 현재 실행 버전 대응 증거도 미확인(확인일 2026-10-30); 담당 개인 배정은 미확인.
- 결함/재검증: 확정 제품 결함 없음. 미실행·도구 한계는 전체 통과와 구분하며 조건 확보 후 이 case ID로 재검증.

### DETAIL-06 — 첨부파일 미리보기·다운로드

- Figma node: [공사 기본 2113:19107](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2113-19107)
- 화면 경로: `/bids/[bidId]`
- API: `GET /api/v1/bid-notices/{id}/attachments`, `GET /api/v1/bid-notices/{id}/attachments/{attachmentId}/content?disposition=inline|attachment`
- 준비 데이터: PDF·이미지·HWPX 첨부와 첨부 없는 공고
- 조작: 각 파일의 미리보기·다운로드를 누른다.
- 예상 결과: PDF·이미지만 미리보기 링크가 있고, 다운로드는 실제 파일명과 파일 내용으로 열리거나 저장된다. HWPX는 미리보기 링크를 제공하지 않는다. 빈 목록은 빈 상태로 보인다.
- 상태: 차단
- 이번 부분 확인: 첨부 GET 200·메타데이터 NONE/NONE/PDF 3건, 다운로드 링크3·PDF 미리보기 링크1을 확인했다. 이름/내용/URL 원문은 저장하지 않았다.
- 환경/증거: 위 2026-10-30 실행 환경. `sections-safe-ui.json · public-fetch.ndjson · cleanup.json`
- 차단/담당 역할/재개 조건: 합성 파일 사용 승인·PDF/이미지/HWPX 내용·실제 저장/삭제 범위가 미확보여서 클릭/다운로드 0건. 첨부 없는 공고도 없다. 공개 첨부 fixture 담당·개발자 승인자 필요. backend 현재 실행 버전 대응 증거도 미확인(확인일 2026-10-30); 담당 개인 배정은 미확인.
- 결함/재검증: 확정 제품 결함 없음. 미실행·도구 한계는 전체 통과와 구분하며 조건 확보 후 이 case ID로 재검증.

### DETAIL-07 — 같은 업종·품목 최근공고

- Figma node: [물품 기본 2196:21087](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2196-21087)
- 화면 경로: `/bids/[bidId]`
- API: `GET /api/v1/bid-notices/{id}/related-notices?bidClsfcNo=<번호>&page=0&size=3`
- 준비 데이터: 관련 공고 3개 이상인 공고와 관련 공고 없는 공고
- 조작: 관련 카드의 공고를 눌러 이동한다.
- 예상 결과: API의 정확 일치 관련 공고만 최대 3개 표시하고, 카드가 target 공고 ID·분류번호로 이동한다. 없는 경우 가짜 추천 공고가 나타나지 않는다.
- 상태: 차단
- 이번 부분 확인: 관련 GET page0/size3 200·items0에서 빈 상태를 표시하고 가짜 추천을 만들지 않았다.
- 환경/증거: 위 2026-10-30 실행 환경. `sections-safe-ui.json · public-fetch.ndjson`
- 차단/담당 역할/재개 조건: 관련 공고 3개 이상/정확 일치·target ID/분류 이동 fixture 없음. 공개 공고 fixture 담당 필요. backend 현재 실행 버전 대응 증거도 미확인(확인일 2026-10-30); 담당 개인 배정은 미확인.
- 결함/재검증: 확정 제품 결함 없음. 미실행·도구 한계는 전체 통과와 구분하며 조건 확보 후 이 case ID로 재검증.

### DETAIL-08 — 오류·404·독립 섹션 실패

- Figma node: [상세 기본 2113:19107](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2113-19107)
- 화면 경로: `/bids/[bidId]`
- API: `GET /api/v1/bid-notices/{id}`와 첨부·관련·결과·물품 section API
- 준비 데이터: 존재하지 않는 공고 ID, 본문 서버 오류, 독립 섹션 하나만 실패하는 환경
- 조작: 각 상태의 URL을 연다.
- 예상 결과: 존재하지 않는 공고는 404, 본문 오류는 재시도 가능한 오류 화면이다. 독립 섹션 실패 시 해당 섹션만 오류 안내를 보여주고 본문·다른 섹션은 유지한다. mock fallback은 없다.
- 상태: 차단
- 이번 부분 확인: 실제 backend 404/C003와 Next 404 화면을 확인했다. 별도로 소유 로컬 Next 프로세스에서 본문·첨부·관련·결과 fetch 연결 실패를 주입했고 section 하나만 실패할 때 본문/다른 section은 유지됐다. 해제 후 Enter 재시도로 실제 GET 200/오류0 복구. mock fallback 없음.
- 환경/증거: 위 2026-10-30 실행 환경. `not-found-api.json · not-found-ui.txt · body-failure-ui.txt · *-failure.json · recovered.json · public-fetch.ndjson`
- 차단/담당 역할/재개 조건: 로컬 연결 실패는 backend HTTP 5xx/독립 section 오류 응답의 실제 재현이 아니다. 공유 서비스 장애 없이 승인된 backend 오류 fixture와 물품 section 실패 조건을 확보해야 case 전체 통과 가능. backend/fixture 담당·프론트 QA 역할 필요. backend 현재 실행 버전 대응 증거도 미확인(확인일 2026-10-30); 담당 개인 배정은 미확인.
- 결함/재검증: 확정 제품 결함 없음. 미실행·도구 한계는 전체 통과와 구분하며 조건 확보 후 이 case ID로 재검증.

### DETAIL-09 — 공유·금액 전환·반응형

- Figma node: [로그아웃 기본 2113:19107](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2113-19107), [로그인 기본 2181:69353](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2181-69353)
- 화면 경로: `/bids/[bidId]`
- API: 공유·금액 전환에는 API 없음. 알림 API는 [bid-alert.md](./bid-alert.md)에서 검증
- 준비 데이터: 상세 공고, 모바일·데스크톱 브라우저
- 조작: 링크 복사, 숫자/원 전환, 키보드 탐색, 좁은 화면에서 상세와 표를 확인한다.
- 예상 결과: 공유 링크가 현재 분류 URL을 포함한다. 금액 전환은 표시만 바꾸고 원본 값은 유지한다. 모바일에서 카드·표가 잘리지 않거나 가로 스크롤로 접근 가능하다.
- 상태: 차단
- 이번 부분 확인: 1440/390/320 화면의 카드 경계·본문 접근과 숫자/원 버튼·공유 버튼의 Enter 동작을 확인했다. 공유 성공 toast가 표시됐고 금액 숫자→억만→숫자가 동일 값으로 복귀했다. 나라장터 링크의 HTTPS/www.g2b.go.kr·_blank·noopener noreferrer만 확인했다.
- 환경/증거: 위 2026-10-30 실행 환경. `detail-actions.json · responsive.json · mobile-390.png · mobile-320.png`
- 차단/담당 역할/재개 조건: 제어 도구의 session clipboard는 empty여서 실제 복사 내용은 확인하지 못했다. 성공 toast/소스 코드를 clipboard 내용 PASS로 대체하지 않는다. 복수 분류 공유·물품/참여업체 표의 좁은 화면도 fixture 부재로 미실행. 프론트 QA 실행자·안전한 clipboard 확인 수단 필요. backend 현재 실행 버전 대응 증거도 미확인(확인일 2026-10-30); 담당 개인 배정은 미확인.
- 결함/재검증: 확정 제품 결함 없음. 미실행·도구 한계는 전체 통과와 구분하며 조건 확보 후 이 case ID로 재검증.

## 실행 결과 요약

- 과거 시작값(2026-10-27): 통과/실패/차단/대기 **0/0/0/9**, 실제 브라우저 미실행이었다.
- 이번 전체 case 판정(2026-10-30): **0/0/9/0**. 부분 확인은 위 각 항목에 보존하며 전체 조건을 채우지 못한 사례를 통과로 세지 않았다.
- 확정 제품 결함/자동 소스 수정: 없음·0/3. 담당자 개인정보·미승인 첨부 내용·외부 원문 접근을 피했고 업무 mutation/로그인 조작·fixture/DB 변경은 수행하지 않았다.
- 복구: 소유 Next process group 38186 종료 0·3000 비청취, 실패 제어 제거, 브라우저 Network 해제·viewport reset·소유 탭 닫힘. 다운로드 0건으로 정리할 파일 원본 없음. API 데이터 복구 불필요.
- 도구/실행 한계: 첫 404 캡처는 로딩 중 흰 화면이어서 판정에 사용하지 않고, 404 heading 대기 후 재촬영했다. back 연속 조작 후 URL/화면 갱신 미확인 상태는 목록 reload 후 공고명 진입으로 회복했으며 정상 history 복귀 PASS로 세지 않았다. Browser.getVersion/평가 범위의 navigator가 지원되지 않아 공개 Document 요청의 축약 UA만 기록했다. 이는 소스 자동 수정이 아니다.
- 최종 Task 판정: 사용자 승인된 **수행·정리·잔여 추적·문서/Review Gate의 제한 종료**다. 종료 편집의 freshness 재검토와 Git 전달은 별도로 확인한다. 실제 상세 전체 통합은 차단이며 완료로 바꾸지 않는다. Review Gate·Git 전달 상태는 작업/검토 기록과 PR에서 확인한다.


<a id="qa-03-20261102"></a>

## 2026-11-02 추가 데이터 재검증

사용자 요청 “QA-03도 추가된 데이터로 보류했던 항목부터 다시 검증…확인할 수 없는 조건은 차단”에 따라 QA-03만 재개했다. **전체 case 1통과·0실패·8차단·0대기**다. DETAIL-07이 새로 통과했고, 나머지는 부분 확인을 늘리되 원래 전체 조건과 차단을 유지한다. 기존 2026-10-30의 0/0/9/0과 위 case 정의·미충족 완료 기준을 덮어쓰지 않는다.

### 이번 실행 환경·증거

| 항목 | 확인한 값과 한계 |
| --- | --- |
| 시각 | 2026-11-02 13:56:59~14:00:58 KST의 실제 UI 관찰. 소유 Next 종료 14:01:42 KST |
| 프론트 | `https://local.mate-bid.com:3000`, `qa/qa-03-bid-detail-resume`, 시작 `main=origin/main=067c8a2b14a6b11c484d19cbe8498c403cf60b22`·clean. 실행 중 QA-03/WBS Markdown만 변경, 앱 소스 불변 |
| 실행 | Node22.20.0·pnpm11.3.0·Next16.2.9/Turbopack. `.env*` 내용을 열지 않는 외부 guard와 명시적 공개 api/local 입력. 7개 그룹 모두 api, 같은 소스/입력의 기존 계산 지문 `67eb70b3`; 이번 dev snapshot 값 자체를 별도 추출한 것은 아님 |
| 백엔드 | `https://api-test.mate-bid.com`. 최신 조회한 test 성공 deployment7366507325·source0e7ac62d605279fc8d51455794a910eece8aeed5·run40552546758은 과거 배포 이력이다. 현재 실행 SHA/이미지와의 대응은 미확인 |
| 브라우저 | Chrome extension, 설치 버전156.0.8078.79(실행 프로세스 patch는 별도 미수집), 1440×900·390×844·320×844. 기존 로컬 인증서 안내 없이 진입, 신뢰/보안 설정 변경 없음 |
| 공개 준비 조회 | ALL 260행/260 ID·공사32/용역228/물품0, NORMAL221/MODIFIED15/REBID24/CANCELLED0, 복수/선택 분류0, RESULT0. page0~2/size100 스캔 완료. 이는 이번 공개 조회 결과이며 DB 약1만건 전체 적재 확인이 아님. 앞선 QA-01/02의 312행을 현재 값으로 재사용하지 않음 |
| 실제 관찰과 대조 | 공개 본문/section 실제 GET과 안전한 DOM 23상태의 제목/번호·5개 KST 일정·금액3·예가·제한/자격·기관 역할·참조번호·관련 카드·첨부 메타데이터를 대조해 PASS. 로컬 실패는 별도 표기 |
| 정적 검증 | 직전 QA-01에서 실제 실행한 Node22 `pnpm test`62건/8파일·lint·api/local Turbopack build 로그를 재사용. 실행/설정/패키지/테스트/하네스228파일과 로그 SHA-256 일치 확인. **이번 QA-03에서는 세 명령을 재실행하지 않았다.** Storybook/공용 UI 영향이 없어 build-storybook 미실행 |

비식별 증거는 [로컬 실행 디렉터리](/Users/jisung/.codex/visualizations/2026/11/02/qa-03-bid-detail-resume/)의 `readiness.json`, `public-fetch.ndjson`, `related-exact-match.json`, `public-validation.json`, `execution-summary.json`, `responsive.json`, `network-*.json`, `cleanup.json`, `static-evidence-reuse.json`, 64개 실행 산출물 지문 `evidence-manifest.json`에 보존한다. 이 원문은 Git 밖에 있어 다른 Mac에서 자동 제공되지 않는다. 담당자 이름/전화/이메일·첨부명·파일 내용·비밀 URL·인증 header/body/query는 수집하지 않았다. 화면은 안전한 상단 또는 실패 section만 캡처했다. 초기/누적 `truncated=true` Network는 완전한 관찰로 세지 않으며 새 관찰 구간의 실제404·retry Fetch200·최종 Document200과 구분한다.

### 기존 case별 최신 결과

| Case | 결과 | 이번 실제 확인 | 남은 차단·재개 조건 |
| --- | --- | --- | --- |
| DETAIL-01 | 차단 | 공사1002223의 목록 번호/제목 모두 동일 상세 ID로 이동, 분류 null을 유지. `construction-number-entry`/`construction-title-entry` | 복수 분류0. 실제 선택 변경·non-null 분류 URL/요청 기대값을 갖춘 fixture 필요 |
| DETAIL-02 | 차단 | 공사1002223/1002795·용역1001370/1005216/1004792의 일정/금액·수요/공고기관 역할·HAS_ROWS/NO_ROWS·상호시장진출·예가·참조번호 대조. 기초금액 null→정보 없음·순공사비 null→—, 원/숫자 왕복 확인 | 물품0, 기관/연락처/null·미확정 제한·일정 경계의 비식별 fixture 미확보. 담당자 원문 검증은 이번 범위에서 제외 |
| DETAIL-03 | 차단 | 공사/용역에 품목정보가 없고 purchase-items 요청0 | 물품0. 품목11개 이상·소수 수량/단가·합계/빈 품목·페이지/복귀 fixture 필요 |
| DETAIL-04 | 차단 | MODIFIED1005216에서 정정 사유, REBID1004792에서 재입찰만 표시. NORMAL에 임의 정정/이력 없음. 시각/사유 null을 생성하지 않음 | 공개 ALL의 CANCELLED0, 선택 fixture의 변경시각 null. 취소 및 실제 변경시각/사유 양성 경계 필요 |
| DETAIL-05 | 차단 | 선택 상세의 bid-results200/results0·NOT_EVALUATED에서 임의 결과/참여업체 표시 없음. RESULT0 | 다회차·낙찰/유찰·미발표 확정·참여업체21개 이상/상위3 유지·분류/페이지 fixture 필요 |
| DETAIL-06 | 차단 | 첨부 메타데이터의 NONE/PDF/HWPX/SPREADSHEET와 PDF만 미리보기 제공을 대조. 공사1002223은 다운로드 링크5·PDF 미리보기1. 파일 클릭/다운로드0 | 승인된 합성 PDF/이미지/HWPX·첨부 없는 공고 및 파일 열람/저장/삭제 범위 미확보. 메타데이터 성공을 스트리밍/다운로드 성공으로 세지 않음 |
| DETAIL-07 | 통과 | source1002223의 INDUSTRY 관련 API page0/size3와 화면3개 ID/분류 null·제목/지역/날짜/금액 순서 일치. target1006050/1006052/1005593의 공개 상세를 추가 대조해 모두 정확한 공통 업종 코드 확인. 첫 카드 Enter→1006050·history 복귀. 1004792/1002795 관련0·빈 UI, 가짜 카드 없음 | 이 case의 관련3/빈 목록·target ID/nullable 분류 기준 충족. 물품/복수 분류·다른 경계는 DETAIL-01/03 등에 차단 유지 |
| DETAIL-08 | 차단 | 실제 API404/C003 및 Next Document404. 소유 Next에서 본문·첨부·관련·결과 4개 target의 outbound 전 연결 실패/해제. 본문 Enter retry→새 GET200/Fetch200, section 실패 격리·reload 후200/정상 UI, fallback 없음 | 실제 backend HTTP 오류 응답·물품 section 실패 조건 없음. 로컬 본문 실패에 따른 프론트 Document500은 backend500 증거가 아님 |
| DETAIL-09 | 차단 | 두 유형 금액 원/숫자 왕복·키보드 공유 성공 toast. 나라장터 HTTPS/www.g2b.go.kr·target/rel 확인. 1440/390/320에서 8개 카드 경계 및 document 가로 넘침 없음 | session clipboard empty로 실제 복사 내용 미확인. 복수 분류 공유·물품/참여업체 표의 좁은 화면 미실행. 외부 원문 본문은 접근하지 않음 |

차단 해소에는 공개 공고/첨부 fixture 담당·백엔드 배포 담당·프론트 QA 실행자 역할이 필요하다. 개인 배정은 미확인이다. 위 차단의 마지막 확인일은 2026-11-02 KST이며, 현재 backend 실행 버전 대응 근거도 잔여 공통 한계다. 조건이 확보되면 같은 case ID와 원래 기준으로 재개한다. 새 fixture/DB·정책·업무 mutation을 임의로 만들지 않았다.

### 오류 재현·정리·도구 한계

- 연결 실패는 이번 소유 Next의 공개 fetch에만 적용했다. 본문 실패 시 오류 화면·재시도 버튼, 독립 section 실패 시 본문/다른 section 유지가 관찰됐다. 제어 제거 후 실제 각 endpoint200을 확인했다. 물품·backend HTTP 오류·공유 서비스 장애 주입은 미실행이다.
- 소유 supervisor2450/group2451 종료0, group 잔여0, 3000/3001 리스너0, 실패 제어 없음. Network 해제·viewport reset·두 소유 탭 닫기 확인. 처음 연결되지 않은 빈 탭은 management의 닫기 기능으로 정리했다. API 업무 변경/수동 인증 조작·파일 내용 열람/다운로드·외부 원문 이동0. AuthSessionProvider의 자동 트래픽은 인증 QA로 판정/전수 수집하지 않았다.
- 첫 빈 탭 debugger 미연결, 출력 축약 helper의 문자열 코드 생성 거부, breadcrumb 복귀 중 table wait timeout은 제품 결함으로 세지 않았다. 새 소유 탭·명시적 DOM collector·fresh AX 후 보이는 제목 링크로 이어갔다. 초기/누적 Network의 truncated 구간을 보존했고 재활성화한 새 구간에서404/복구/정상 응답을 확보했다.
- API/UI 자동 대조 helper의 첫 실행은 UI `/bids`를 API `/api/v1/bids`로 잘못 매핑해 실패했다. `public-validation-attempt1.json` 보존 후 `/api/v1/bid-notices`로 한 번 교정, 23상태/독립 검증 PASS. 제품 자동 수정은0/3이다.
- 문서/범위/보존 검증과 read-only verifier·AI Review 및 검토 후 freshness 결과는 [검토 기록](../development/figma-v01/reviews/QA-03.md)과 최종 원문에 남긴다. 실제 전체 통합은 **차단**이며, 정확한 결과 기록·정리·잔여 추적/문서 Gate와 Git 전달은 별도로 판정한다.

<a id="pol-30-followup"></a>

## 2026-11-12 · POL-30 정책 확정에 따른 후속 기준

- [POL-30 v1](../development/figma-v01/tasks/POL-30.md#pol-30-contract): 공개·미삭제 기준 공고는 마감/취소돼도 같은 업종·품목의 진행 후보를 찾는다. 후보는 공개·미삭제·미취소, 마감시각 없음 또는 현재보다 이후다. 마감 정각 제외, 없는 공고/선택 분류404와 비교 기준/현재 후보 부재의 정상 빈 목록을 구분한다.
- 이는 **정책/후속 검증 기대값 추가**다. 이번 실제 업무 API/제품 브라우저 실행·신규 통과는0건이다. 위2026-11-02의1통과8차단·DETAIL-07 통과/부분 범위와 QA-03 전용 제한 종료 승인을 그대로 보존한다.
- 로컬 mock 교정은 [DEV-61](../development/figma-v01/tasks/DEV-61.md#dev-61-pol-30-handoff), 고정 Clock/음성 사례는 [REL-01~13](../development/figma-v01/tasks/POL-30.md#pol-30-fixtures)이 소유한다. 이를 실제 API 통과 증거로 사용하지 않는다. 기존 DETAIL-07(관련3/빈·target 이동), DETAIL-01(분류), DETAIL-04(취소), DETAIL-08(오류)의 원래 ID/판정에 연결해 후속 실행을 기록한다.
- 실제 재개에 필요한 비식별 fixture: 공개 마감/취소 기준과 동일 사실의 진행 후보, 후보 미공개/삭제/취소·마감 이전/정각/이후/null, 물품/용역 선택/전체·없는 분류 및 정확 코드/target 분류, 금액/VAT·게시시각 결측과 동시각 안정 정렬. 실제 정각 경계는 제어 가능한 서버 Clock/결정적 재현과 실행 시각 근거를 확보해야 하며 로컬 가짜 Clock으로 실서버 경계를 통과 처리하지 않는다.
- 실행 식별자·배포 schema/version와 실제 프로세스 SHA/이미지 대응, 기대 결과/대상 사용 승인·안전한 오류 재현/해제·잔존/복구 범위도 기존 재개 Gate로 유지한다. 공개 fixture/백엔드 배포·관련공고 소유 역할과 프론트 QA 역할이 준비하며 개인 담당자는 미확정이다. 중앙 원문 정정안은 별도 소유자 반영 전 상태다.
- 기존 나머지 물품/결과/참여업체/첨부 스트리밍·HTTP 오류·clipboard·반응형 잔여 조건도 유지한다. 정책 결정이나 문서 검토·Git 전달로 해소하지 않는다.

<a id="dev-61-local-qa"></a>

## 2026-11-12 · DEV-61 관련 공고 로컬 교정 검증

- 판정 범위: [DEV-61 검증/원문](../development/figma-v01/tasks/DEV-61.md#dev-61-verification). 새 실제 API 통과0·업무 요청0이다. 위 QA-03의2026-11-02 실제1통과8차단·DETAIL-07 관련/target 이동 통과·원래 제한 종료 승인을 보존한다. 아래 mock/대역을 새 실제 case PASS로 올리지 않는다.
- DETAIL-07 로컬: 공개 정상/마감10004/취소10016 기준에서 같은 정확 업종의 진행 공사만 제공한다. 물품10003의 source분류1 카드를 클릭하면10006의 실제 target분류2로 이동하고 새로고침에도 유지한다. source분류2는 정상 빈 목록이고, 용역 업종 target은 null query다. 카드 결측 금액은 미제공이며 다른 기초금액으로 채우지 않는다.
- DETAIL-01/04/08 로컬 연결: source 전체/선택·없는 분류/null404·형식400·손상 identity/target 분류 오류·정각/1ms 경계·우선순위/정렬/VAT는42개 새 Node 사례에 포함했다. 실제 브라우저는 정상/마감/취소·빈/related-error와 다른 section 유지, default 복구·1440/390/320px·Tab/Enter 이동을 확인했다. 총255tests와 API/mock/hybrid build가 통과했다.
- 구성/네트워크: full mock과 auth HTTP 구현의 로컬 익명401 대역+bids mock hybrid를 별도 확인했다. 최종 ResourceTiming은 full mock28리소스/외부0/API0, hybrid30리소스/외부0·로컬 refresh만이다. 서버 업무 API 외부 시도0과 개발도구 registry 차단/초기 미분류 차단을 Task에 따로 기록했다. Preview의 production 승격은 실제 시작에서 exit1로 거부됐다.
- 실행 식별: 2026-11-12 KST, `fix/dev-61-related-bids-mock`, 시작`1166f08`; Node22.20.0/pnpm11.3.0·Next16.2.9·Aside의 소유 loopback3061. 합성 fixture/비로그인만 사용했고 실제 로그인·알림 변경·첨부 내용/다운로드·메일·서비스 운영은0건이다. 원문 AX/PNG/명명16관찰·명령 로그는 `/tmp/mate-dev61-20261112`에 보존한다.
- 정리: 소유 Next/대역 종료,3061/3062/3063 리스너0·소유 탭 닫기/viewport복구. 원시 page query 정규화·기존 상세 시각 정합성/중첩 main은 이번 변경 밖이다. backend 실행 SHA/실제 경계 fixture·Clock·오류/복구 등 [POL-30 후속 재개 조건](#pol-30-followup)과 다른8차단을 유지한다.

<a id="pol-08-followup"></a>

## 2026-11-13 · POL-08 정책에 따른 정정 차수 후속 기준

- [POL-08 v1](../development/figma-v01/tasks/POL-08.md#pol-08-contract): 현재 상태/변경시각/사유 표시와 동일 공고번호의 수집 차수 조회는 별개다. 사용자는 이전 차수 전용 backend 계약 확보 후 DEV-13에서 연결하기로 확정했고 backend 개발자에게 요청했다고 보고했다. 기존 no-view 검색의 재사용 가능성은 조사 근거이며 이번 제품 연결 대안으로 채택하지 않았다.
- 이번 기록은 정책/검증 기대값 추가다. 계약 조사로 공개 GET3건의200/단일 차수2검색을 확인했지만 **제품 UI/복수 차수·페이지·선택/복귀 통합의 신규 통과는0건**이다. 위2026-11-02의 실제1통과8차단, DETAIL-04의 당시 부분 확인과 QA-03 전용 제한 종료 승인은 유지한다. 전용 API의 source/schema/배포·실행 SHA는 미확인이다.
- 실제 연결/신규 검증은 [DEV-13](../development/figma-v01/tasks/DEV-13.md#dev-13-pol-08-handoff)이 소유한다. [전용 계약 수락 표](../development/figma-v01/tasks/POL-08.md#pol-08-backend-request)의 이전/현재 포함 관계·정렬/페이지·원본키/target ID·공개/부재/누락/오류 의미 및 합성 fixture/사용·재현/해제·잔존/복구를 먼저 확보한다. 현재 계약 없는 endpoint/enum을 QA 기대값에 발명하지 않는다.
- 후속 [HIST-01~12](../development/figma-v01/tasks/POL-08.md#pol-08-dev13-gate)는 모두 미실행이다. 기존 DETAIL-01(분류/직접 URL)·DETAIL-04(현재 정정 사실)·DETAIL-08(본문/독립 오류)의 원래 ID/이력과 연결하고 새 이력 범위를 별도 기록한다.
- 필수 경계: 원문 번호/차수와 실제 ID,0/1/복수·차수 간격/결측·정정 횟수/최초 추정 금지, 공사/물품/용역·서로 다른 분류/회차, 마감/취소 공개본과 미공개/삭제, 다음 page/변동·중도 실패, 닫기/선택·같은 탭 전체 공고 이동·하드 리로드/뒤로 가기의 원래 URL 복귀, 키보드/모바일과 늦은 응답. API가 알려주지 않은 미수집/부재 이유를 생성하지 않고 오류를 빈 성공/기존 목록/기본 예시로 치환하지 않는다.


<a id="pol-09-followup"></a>

## 2026-11-13 · POL-09 추가 정보 제공의 후속 검증 기준 · 실제 미실행

- 사용자 결정/정책: [POL-09 v1](../development/figma-v01/tasks/POL-09.md#pol-09-contract). 원문 자격사항/지시사항 본문·현장설명 일시·기준일·수집일의 추가 제공을 추진하고 backend 계약부터 확보한다. 현재 링크/필요 여부/일반 안내와의 차이를 Figma 예외로 닫지 않는다. 제품 구현은 [DEV-14 자체 Gate](../development/figma-v01/tasks/DEV-14.md#dev-14-pol-09-handoff)의 후속이다.
- 이번 증거는 고정 중앙 정책/backend source·개발 OpenAPI GET200·두 공사 Figma metadata/관련3부분 screenshot이다. 업무 API GET/mutation·로그인·외부 원문 이동/첨부/메일·제품 mock/HTTP 대역·실제 통합 실행0건, 신규 실제 통과0건이다. 원본 QA-03 실제1통과8차단·DETAIL-02/04/09·DETAIL-07 통과 이력과 타 Task 차단/승인 예외를 보존한다.
- backend 실제 path/query/schema·본문 형식/안전한 표시 책임·일자의 원천/정의/정밀도/갱신·null/미제공/오류·공개/분류/차수 scope·배포 version/실행 process SHA 대응·비식별 fixture/기대값·안전한 사용/잔존/복구 범위가 재개 전에 필요하다. 현재 문서200/source commit은 실행 서버/실제 응답 증명이 아니다.

| 후속 사례 | 기대 검증/경계 | 연결/이번 판정 |
| --- | --- | --- |
| SUPP-01 · 원문 본문 | 원천/범위·format·빈/긴/여러 줄/특수문자와 계약상 허용 콘텐츠의 안전한 표시. 다른 문자열/첨부 자동 추출/디자인 예시를 원문으로 대신하지 않음 | DEV-14 신규 기준, 계약 미확보·미실행 |
| SUPP-02 · 원문 링크 | 본문/미리보기 가능 여부와 URL 유무를 분리. 정상/null/잘못된/위험 scheme·target/rel·본문 부분실패에서도 실제 계약 준수 | DETAIL-09 회귀와 연결, 미실행 |
| SUPP-03 · 현장설명 | 필요 여부 true/false와 실제 일시 유무/미정·date-only/offset을 독립 대조. Kotlin/프론트 `isSiteExplanationRequired`와 OpenAPI `siteExplanationRequired`의 실제 wire 키/타입 확인 | DETAIL-02/DEV-14, 실제 wire 미확인·미실행 |
| SUPP-04 · 기준일 | backend가 정의한 대상/산출/정밀도/공고·분류 범위/결측을 확인. 게시일/최초 공개일/현재일을 임의 복사하지 않음 | DEV-14 신규 기준, 의미/계약 미확보·미실행 |
| SUPP-05 · 수집일 | 대표/section 범위·최초/최근 시도/성공/source version·부분실패/재수집/늦은 응답의 갱신 의미. section min/max/응답시각으로 대표일 생성 금지 | DEV-14 신규 기준, 의미/계약 미확보·미실행 |
| SUPP-06 · 시각/결측 | offset→KST·자정 경계·date-only/null/미제공/잘못된 값·업무 일시와 수집 시각의 차이를 확인. 없는 시간을00:00/현재값으로 합성하지 않음 | DETAIL-02/DEV-14, 미실행 |
| SUPP-07 · 공개/오류 | 공사/물품/용역·공고/분류/차수·미공개/삭제/권한·본문/section 오류·재시도 경계. 관리자/raw-source 우회·오류의 빈 성공/자동 mock fallback 없음 | DEV-14, 계약/fixture 미확보·미실행 |
| SUPP-08 · 기존 화면 회귀 | 공동수급 협정 마감·기존 일정/기관·원문 링크·상세 선택 URL·독립 section 실패를 보존. 이미 제공한 일정을 신규 누락으로 집계하지 않음 | DETAIL-02/04/09·DEV-14, 미실행 |
| SUPP-09 · Figma/브라우저 | 공사 로그인 전2113:19107/인증회사 후2181:69353의 본문/일시/기준일/수집일, 영향 있는 모바일/키보드·긴 본문/오류를 실제 Next에서 확인. 별도 레이아웃/접근성 Task를 승인 예외로 닫지 않음 | DEV-14·DEV-54/64 소유 경계, 제품 미실행 |

위 사례는 후속 기준이며 QA 실행/차단 해소 기록이 아니다. mock/HTTP 대역/실제 서버 결과를 별도로 기록하고 실제 실행 전 공통 QA 식별자/사용 범위를 확보한다. 담당 역할은 backend 계약/공개 fixture 소유자와 frontend/QA이며 개인 담당·요청 발송/접수·일정은 미확정이다.

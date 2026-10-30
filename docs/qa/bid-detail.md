# 공개 입찰공고 상세 브라우저 통합 테스트

## 기준

- Figma 파일/섹션: [02_입찰공고상세, 2201:18858](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2201-18858)
- 구현 화면/경로: `/bids/[bidId]`, 선택적 `bidClsfcNo`, `itemPage`, `resultId`, `participantsPage`
- 관련 API 명세: [Mate Swagger UI](https://api-test.mate-bid.com/swagger-ui/index.html), `GET /api/v1/bid-notices/{id}` 및 아래 독립 section API
- 담당자/검토자: 미정
- 기존 상세 구현 시 정적 검증(과거): Node 22.20.0에서 `pnpm lint`, `pnpm build`, `git diff --check` 통과. 별도 DTO mapper 계약 시나리오에서 분류번호·KST·nullable 금액·수집 미확정 상태·안전한 외부 URL·첨부 미리보기·낙찰 결과·0-based 페이지 변환 통과.
- 기관 역할 표시 변경: Node 22.20.0에서 `pnpm lint`, `pnpm build`, `pnpm build-storybook`, `git diff --check` 통과. 공고기관 담당자 이메일이 없고 수요기관 담당자 이메일만 있는 DTO에서도 두 출처를 분리하는 시나리오를 확인했다. 실제 표시는 아래 DETAIL-02에서 브라우저 검증 대기다.
- 실제 백엔드 브라우저 통합 상태: **2026-10-30 통과 0·실패 0·차단 9·대기 0**. 각 case의 전체 조건으로 판정했으며 부분 확인을 전체 통과로 세지 않았다. 사용자 승인으로 QA-03 수행·정리·잔여 추적·문서/Review Gate를 제한 종료한다. 전체 통합 PASS 아님. [작업 기록](../development/figma-v01/tasks/QA-03.md) · [검토 기록](../development/figma-v01/reviews/QA-03.md).

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

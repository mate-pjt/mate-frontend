# 공개 입찰공고 상세 브라우저 통합 테스트

## 기준

- Figma 파일/섹션: [02_입찰공고상세, 2201:18858](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2201-18858)
- 구현 화면/경로: `/bids/[bidId]`, 선택적 `bidClsfcNo`, `itemPage`, `resultId`, `participantsPage`
- 관련 API 명세: [Mate Swagger UI](https://api-test.mate-bid.com/swagger-ui/index.html), `GET /api/v1/bid-notices/{id}` 및 아래 독립 section API
- 담당자/검토자: 미정
- 이번 작업의 정적 검증: Node 22.20.0에서 `pnpm lint`, `pnpm build`, `git diff --check` 통과. 별도 DTO mapper 계약 시나리오에서 분류번호·KST·nullable 금액·수집 미확정 상태·안전한 외부 URL·첨부 미리보기·낙찰 결과·0-based 페이지 변환 통과.
- 기관 역할 표시 변경: Node 22.20.0에서 `pnpm lint`, `pnpm build`, `pnpm build-storybook`, `git diff --check` 통과. 공고기관 담당자 이메일이 없고 수요기관 담당자 이메일만 있는 DTO에서도 두 출처를 분리하는 시나리오를 확인했다. 실제 표시는 아래 DETAIL-02에서 브라우저 검증 대기다.
- 실제 백엔드 브라우저 통합 상태: **대기**

## 실행 환경 기록

| 실행일시 | 프론트 URL·배포/commit | 백엔드 URL·배포 | 브라우저·화면 크기 | 테스트 데이터 별칭 | 수행자 |
| --- | --- | --- | --- | --- | --- |
| 미실행 | 미정 | 미정 | 미정 | 비밀값 대신 별칭만 | 미정 |

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
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### DETAIL-02 — 공사·용역·물품 기본정보

- Figma node: [공사 2113:19107](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2113-19107), [용역 2196:16577](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2196-16577), [물품 2196:21087](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2196-21087)
- 화면 경로: `/bids/[bidId]`
- API: `GET /api/v1/bid-notices/{id}`
- 준비 데이터: 각 업무 유형의 공개 공고, 공고기관과 수요기관이 다른 공고, 한쪽 기관명 또는 담당자 이메일이 없는 공고
- 조작: 각 상세를 열어 공고번호·제목·일정·금액·예가·참여자격·기관 정보를 비교하고 금액 `숫자/원` 전환을 누른다.
- 예상 결과: 실제 응답의 원 단위 금액과 KST 일정, 업종·지역 제한 상태, 내역입찰·실적경쟁·상호시장진출, 참조번호가 표시된다. 기본정보의 기관 요약은 수요기관 우선으로 역할을 명시하고, 기관 정보에는 두 기관명과 기관별 담당자 이메일이 서로 바뀌지 않고 표시된다. 공고기관 담당자 이름·전화·이메일이 수요기관의 값으로 대체되지 않는다. 발주기관 소재지는 참가가능지역과 구분된다. null 금액·연락처·일정을 0이나 임의 값으로 만들지 않는다. 수집 상태가 미확정인 제한 여부는 ‘확인 중’으로 표시하고, 정정되지 않은 공고에 정정 문구가 없다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### DETAIL-03 — 물품 품목정보와 페이지

- Figma node: [물품 2196:21087](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2196-21087)
- 화면 경로: `/bids/[bidId]?bidClsfcNo=<번호>&itemPage=2`
- API: `GET /api/v1/bid-notices/{id}/purchase-items?bidClsfcNo=<번호>&page=0|1&size=10`
- 준비 데이터: 등록 품목이 11개 이상인 물품 공고, 소수 수량·단가를 가진 품목, 빈 품목 공고
- 조작: 품목정보를 보고 다음·이전 페이지로 이동하고, 존재하지 않는 페이지 번호를 주소에 직접 입력한다.
- 예상 결과: 품목합계·품목수·수량합계·최소~최대 단가 및 품목명·규격·소수 수량·소수 단가가 API와 일치한다. 페이지는 UI 1부터, API 0부터 센다. 범위를 벗어난 페이지에서는 복귀 링크를 제공한다. 공사·용역 화면에는 물품 품목정보를 억지로 표시하지 않는다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### DETAIL-04 — 정정·취소·재입찰 사실

- Figma node: [정정 공고 2201:18876](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2201-18876)
- 화면 경로: `/bids/[bidId]`
- API: `GET /api/v1/bid-notices/{id}`의 `header.status`, `noticeChangedAt`, `changeReason`
- 준비 데이터: 변경·취소·재입찰 공고 각각
- 조작: 각 상세를 연다.
- 예상 결과: 실제 상태·변경 시각·사유만 표시된다. API에 없는 과거 공고 개수·정정 이력·지시사항 본문은 생성하지 않는다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### DETAIL-05 — 개찰결과·회차·참여업체

- Figma node: [공사 개찰결과 2205:19427](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2205-19427)
- 화면 경로: `/bids/[bidId]?resultId=<결과ID>&participantsPage=2`
- API: `GET /api/v1/bid-notices/{id}/bid-results?bidClsfcNo=<번호>`, `GET /api/v1/bid-notices/{id}/bid-results/{bidResultId}/participants?page=0|1&size=20` 및 2페이지 이상에서 요약용 `page=0&size=3`
- 준비 데이터: 다회차 결과, 낙찰·유찰, 참여업체 21개 이상, 미발표 결과
- 조작: 결과 회차를 바꾸고 참여업체 다음·이전 페이지를 누른 뒤, 존재하지 않는 페이지 번호를 주소에 직접 입력한다.
- 예상 결과: 선택한 회차의 상태·낙찰업체·낙찰금액·낙찰률·참여업체가 API와 일치한다. 참여업체 페이지를 넘겨도 상위 3위 요약은 유지되고, 범위를 벗어난 페이지에서는 복귀 링크를 제공한다. 낙찰금액을 추정가격으로 계산하지 않는다. 미발표 공고에는 임의 결과를 표시하지 않는다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### DETAIL-06 — 첨부파일 미리보기·다운로드

- Figma node: [공사 기본 2113:19107](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2113-19107)
- 화면 경로: `/bids/[bidId]`
- API: `GET /api/v1/bid-notices/{id}/attachments`, `GET /api/v1/bid-notices/{id}/attachments/{attachmentId}/content?disposition=inline|attachment`
- 준비 데이터: PDF·이미지·HWPX 첨부와 첨부 없는 공고
- 조작: 각 파일의 미리보기·다운로드를 누른다.
- 예상 결과: PDF·이미지만 미리보기 링크가 있고, 다운로드는 실제 파일명과 파일 내용으로 열리거나 저장된다. HWPX는 미리보기 링크를 제공하지 않는다. 빈 목록은 빈 상태로 보인다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### DETAIL-07 — 같은 업종·품목 최근공고

- Figma node: [물품 기본 2196:21087](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2196-21087)
- 화면 경로: `/bids/[bidId]`
- API: `GET /api/v1/bid-notices/{id}/related-notices?bidClsfcNo=<번호>&page=0&size=3`
- 준비 데이터: 관련 공고 3개 이상인 공고와 관련 공고 없는 공고
- 조작: 관련 카드의 공고를 눌러 이동한다.
- 예상 결과: API의 정확 일치 관련 공고만 최대 3개 표시하고, 카드가 target 공고 ID·분류번호로 이동한다. 없는 경우 가짜 추천 공고가 나타나지 않는다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### DETAIL-08 — 오류·404·독립 섹션 실패

- Figma node: [상세 기본 2113:19107](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2113-19107)
- 화면 경로: `/bids/[bidId]`
- API: `GET /api/v1/bid-notices/{id}`와 첨부·관련·결과·물품 section API
- 준비 데이터: 존재하지 않는 공고 ID, 본문 서버 오류, 독립 섹션 하나만 실패하는 환경
- 조작: 각 상태의 URL을 연다.
- 예상 결과: 존재하지 않는 공고는 404, 본문 오류는 재시도 가능한 오류 화면이다. 독립 섹션 실패 시 해당 섹션만 오류 안내를 보여주고 본문·다른 섹션은 유지한다. mock fallback은 없다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### DETAIL-09 — 공유·금액 전환·반응형

- Figma node: [로그아웃 기본 2113:19107](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2113-19107), [로그인 기본 2181:69353](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2181-69353)
- 화면 경로: `/bids/[bidId]`
- API: 공유·금액 전환에는 API 없음. 알림 API는 [bid-alert.md](./bid-alert.md)에서 검증
- 준비 데이터: 상세 공고, 모바일·데스크톱 브라우저
- 조작: 링크 복사, 숫자/원 전환, 키보드 탐색, 좁은 화면에서 상세와 표를 확인한다.
- 예상 결과: 공유 링크가 현재 분류 URL을 포함한다. 금액 전환은 표시만 바꾸고 원본 값은 유지한다. 모바일에서 카드·표가 잘리지 않거나 가로 스크롤로 접근 가능하다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

## 실행 결과 요약

- 통과/실패/차단/대기 수: 0/0/0/9
- 남은 결함과 담당자: 미정
- 최종 판정과 날짜: 미실행

# 입찰공고 상세 알림 설정 브라우저 통합 테스트

## 기준

- Figma: [02_입찰공고상세, 2201:18858](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2201-18858), [설정 전 카드 3210:112734](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=3210-112734), [해제 팝업 2282:26779](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2282-26779)
- 화면: `/bids/[bidId]`, 선택적 `bidClsfcNo`
- API: `GET|PUT|DELETE /api/v1/me/bid-notice-alerts/{bidNoticeId}`. 계정 Bearer token과 refresh cookie를 사용하며 요청 본문은 없다. 성공 응답의 `data`는 `bidNoticeId`, `active`, `registeredAt`을 포함한다.
- 담당자/검토자: 미정
- 이번 구현의 정적 검증: Node 22.20.0에서 `pnpm lint`, `pnpm build`, `pnpm build-storybook`, `git diff --check` 통과. 실제 API 브라우저 통합 결과와 별개다.
- 실제 백엔드 브라우저 통합 상태: **대기**. 이번 구현에서 실제 API 브라우저 결과를 통과로 기록하지 않는다.

## 실행 환경 기록

| 실행일시 | 프론트 URL·commit | 백엔드 URL·배포 | 브라우저·화면 크기 | 테스트 계정·공고 별칭 | 수행자 |
| --- | --- | --- | --- | --- | --- |
| 미실행 | 미정 | 미정 | 미정 | 비밀값 대신 별칭만 | 미정 |

## 선행 조건·주의 사항

- 브라우저에서 `https://local.mate-bid.com:3000`으로 로그인하고 테스트 API의 credentialed CORS가 `GET`, `PUT`, `DELETE`, `Authorization`을 허용해야 한다. `https://dev.mate-bid.com`의 Origin은 별도 확인 전까지 검증 범위가 아니다.
- 실제 로그인 가능한 테스트 계정과 삭제되지 않은 공개 공고가 필요하다. 회사 인증을 마친 계정일 필요는 없으며, 회사 가입 테스트는 별도로 미완료다.
- `PUT`/`DELETE`는 테스트 계정의 서버 상태를 바꾼다. 테스트 전 공고·계정을 기록하고 테스트 후 `DELETE`로 원복할지 정한다. 이미 생성된 알림과 과거 등록 이력은 백엔드 계약상 삭제되지 않는다.
- 카드의 입찰마감 값은 상세 API가 제공한 표시형 날짜를 사용한다. Figma의 실시간 남은 시간 계산은 이 기능의 API 상태 검증 범위에 포함하지 않는다.
- `PUT` 성공은 **구독 상태 저장**의 성공이다. 실제 정정·마감·개찰 알림 전달과 `/alarms` 목록의 백엔드 연결은 별도 기능에서 검증한다.

## 테스트 항목

### ALERT-01 — 로그아웃 진입과 로그인 복귀

- Figma node: [로그아웃 상세 2113:19107](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2113-19107)
- 화면 경로: `/bids/[bidId]?bidClsfcNo=<번호>` → `/auth?mode=login&next=...` → 원래 상세
- API: 로그아웃 상태에서는 알림 API 요청 없음. 로그인 후 `GET /api/v1/me/bid-notice-alerts/{bidNoticeId}`
- 준비 데이터: 공개 공고, 로그아웃 브라우저, 테스트 Google 계정
- 조작: 알림 카드의 로그인 버튼을 누르고 로그인해 돌아온다.
- 예상 결과: 로그인 전 상태 조회·변경 요청이 없고, 복귀 URL은 공고 ID와 분류번호를 유지한다. 로그인 후 계정 알림 상태를 조회한다. 로그인만으로 알림을 자동 등록하지 않는다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### ALERT-02 — 계정별 초기 상태 조회

- Figma node: [설정 전 카드 3210:112734](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=3210-112734), [받는 중 카드 2192:70364](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2192-70364)
- 화면 경로: `/bids/[bidId]`
- API: `GET /api/v1/me/bid-notice-alerts/{bidNoticeId}`
- 준비 데이터: 알림 미등록 계정과 이미 등록한 계정·공고, 회사 미가입 테스트 계정
- 조작: 각각 상세를 열고 새로고침한다.
- 예상 결과: `active=false`는 설정 전 카드, `active=true`는 받는 중 카드다. 회사 미가입 상태도 조회 가능하다. 새로고침 후 서버 상태가 그대로 표시되고 다른 계정의 상태를 재사용하지 않는다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### ALERT-03 — 팝업 취소와 변경 확정 전 상태

- Figma node: [설정 팝업 2191:11467](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2191-11467), [토글 켬 2192:69778](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2192-69778)
- 화면 경로: `/bids/[bidId]`
- API: 팝업 열기·토글·취소에는 변경 API 없음
- 준비 데이터: `active=false` 공고
- 조작: 팝업을 열고 토글을 켠 다음 닫기·다음에 하기·Escape로 각각 닫는다.
- 예상 결과: 변경 버튼을 누르기 전에는 `PUT`/`DELETE`가 전송되지 않는다. 다시 열면 서버에 저장된 꺼짐 상태로 시작한다. 변경이 없을 때 확인 버튼은 비활성이다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### ALERT-04 — 알림 켜기

- Figma node: [받는 중 카드 2192:70364](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2192-70364)
- 화면 경로: `/bids/[bidId]`
- API: `PUT /api/v1/me/bid-notice-alerts/{bidNoticeId}`, 재진입 시 `GET` 같은 경로
- 준비 데이터: `active=false` 공고
- 조작: 팝업 토글을 켜고 알림 설정하기를 누른 뒤 새로고침한다.
- 예상 결과: 정확한 공고 ID에 본문 없는 `PUT` 한 번이 전송된다. `active=true` 응답 이후에만 카드가 받는 중으로 바뀌고 성공 토스트가 나온다. 새로고침 `GET`도 켜짐을 반환한다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### ALERT-05 — 알림 끄기

- Figma node: [해제 팝업 2282:26779](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2282-26779), [해제 카드 2194:15952](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2194-15952)
- 화면 경로: `/bids/[bidId]`
- API: `DELETE /api/v1/me/bid-notice-alerts/{bidNoticeId}`, 재진입 시 `GET` 같은 경로
- 준비 데이터: `active=true` 공고
- 조작: 받는 중 카드를 눌러 팝업 토글을 끄고 알림 설정하기를 누른 뒤 새로고침한다.
- 예상 결과: 정확한 공고 ID에 `DELETE` 한 번이 전송된다. `active=false` 응답 이후에만 해제 카드·토스트를 표시한다. `registeredAt`이 남아 있어도 `active`만 화면 상태 기준으로 사용한다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### ALERT-06 — 조회·변경 실패와 재시도

- Figma node: [설정 카드 3210:112734](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=3210-112734)
- 화면 경로: `/bids/[bidId]`
- API: `GET|PUT|DELETE /api/v1/me/bid-notice-alerts/{bidNoticeId}`, 실패 응답·네트워크 오류·401 후 refresh
- 준비 데이터: 오류를 재현할 테스트 환경, 만료 세션
- 조작: 상태 조회 실패, 변경 실패, 만료 세션을 각각 재현하고 다시 시도한다.
- 예상 결과: 조회 실패 시 변경 버튼 대신 오류·재시도를 제공한다. 변경 실패 시 팝업이 열려 있고 기존 카드 상태가 유지되며 오류를 표시한다. 401은 가능한 경우 refresh 후 한 번 재시도하고, 재인증 불가 시 로그인 상태로 돌아간다. 연속 클릭이 중복 변경 요청을 만들지 않는다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### ALERT-07 — 계정·공고 간 상태 격리

- Figma node: [설정 전 카드 3210:112734](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=3210-112734)
- 화면 경로: 공고 A의 여러 `bidClsfcNo`, 공고 B의 상세
- API: 각 공고 ID에 대한 `GET|PUT|DELETE /api/v1/me/bid-notice-alerts/{bidNoticeId}`
- 준비 데이터: 분류가 둘 이상인 공고 A, 다른 공고 B, 테스트 계정 둘
- 조작: A를 켠 뒤 분류를 바꾸고 B로 이동하며, 다른 계정으로도 A를 연다.
- 예상 결과: 같은 backend 공고 ID의 분류 간에는 같은 설정을 보여주고, 다른 공고나 계정으로 상태가 새지 않는다. 공고 이동 중 늦게 도착한 이전 응답이 새 카드에 표시되지 않는다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

### ALERT-08 — 키보드와 좁은 화면

- Figma node: [설정 팝업 2191:11467](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2191-11467)
- 화면 경로: `/bids/[bidId]`
- API: 화면 조작 자체에는 변경 API 없음
- 준비 데이터: 로그인 계정, 데스크톱·모바일 브라우저
- 조작: 키보드로 카드·토글·버튼을 탐색하고 Escape 및 바깥 클릭으로 닫는다. 좁은 화면에서 팝업을 열고 스크롤한다.
- 예상 결과: 팝업은 대화상자로 포커스를 묶고, 키보드로 토글·확인·취소할 수 있다. 팝업 내용과 버튼이 화면 밖으로 잘리지 않는다. 취소 동작은 서버 상태를 바꾸지 않는다.
- 상태: 대기
- 환경/증거: 미실행
- 결함/담당자/재검증: 없음

## 실행 결과 요약

- 통과/실패/차단/대기 수: 0/0/0/8
- 남은 결함과 담당자: 미정
- 최종 판정과 날짜: 미실행

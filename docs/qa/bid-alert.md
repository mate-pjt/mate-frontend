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

<a id="qa-09-20261103"></a>

## QA-09 · 2026-11-03 사전 점검

[작업 기록/재개표](../development/figma-v01/tasks/QA-09.md#qa-09-resume) · [WBS](../development/figma-v01/README.md) · [검토 기록](../development/figma-v01/reviews/QA-09.md).

- 사용자 결정: **“자원 미준비 — 사전 점검·차단 기록·Git 전달만 진행”**. 실제 로그인/API GET/PUT/DELETE·구독 변경·fixture 생성·알림 발송·운영/배포는 미실행이다. QA-04의 인증 승인·QA-08 선정 예외는 이번 구독 사용/변경 승인으로 확대하지 않는다.
- 과거 위8개 case 정의와 **0/0/0/8** 요약은 당시 이력으로 보존한다. 아래는 이번 준비 조건 확인에 따른 **통과/실패/차단/대기 = 0/0/8/0**, 실제 실행0건이다. 실제 통합 PASS나 제품 결함 판정이 아니다.

| 환경/식별 | 이번에 확인한 사실·한계 |
| --- | --- |
| 시각/실행자·소스 | 2026-11-03 16:20 KST / Codex 사전 점검. 시작 main=origin/main `57325e08f6a4d4fc4597fca3c0a8ec713020e3e6`, clean → `docs/qa-09-bid-alert-preflight` + Markdown5개. 실제 실행 build 식별자가 아닌 소스 근거 |
| 문서상 대상 | 프론트 `https://local.mate-bid.com:3000`, API `https://api-test.mate-bid.com`. 도달성·실행 snapshot·backend 배포/실행 버전 대응·현재 Origin/CORS/쿠키는 미확인. dev 사이트를 동등한 인증 환경으로 세지 않음 |
| 도구/브라우저·증거 | 기본 셸 Node26.5.0, pin/CI 및 설치 실행 파일22.20.0·pnpm11.3.0 확인. 앱 미시작. 브라우저/viewport·UI 캡처·Network 증거는 사전 점검에 해당 없음. 실제 QA 미실행 |
| 테스트 자원/복구 | 두 계정/두 공고·복수 분류·active true/false·오류/만료 fixture, 사용/변경/종료값·생성 알림/등록 이력 잔존·복구 담당/방법 모두 미확보. 별칭/실제 담당자 배정 미확인. 새 데이터/프로세스 변경 없어 이번 복구 대상 없음 |

### 이번 case별 준비 판정

| case | 이번 판정·실제 실행 | 현재 소스에서만 확인한 근거 | 차단 원인·재개 조건 |
| --- | --- | --- | --- |
| ALERT-01 | 차단·미실행 | 익명 카드에서 pathname/search→next, 인증 후 별도 조회. 로그인만으로 활성화하는 호출 없음 | 공개 공고·분류와 승인된 계정·로그인/세션 사용 범위/현재 실행 대응 확보 후 로그인 전 요청0·복귀 URL·GET 확인 |
| ALERT-02 | 차단·미실행 | 응답 ID/active/registeredAt 타입 검사, 카드 상태는 active 기준 | 회사 미가입 포함 두 계정/공고의 초기 true/false 기대값·조회 승인/실행 증거 확보 후 reload와 계정별 상태 대조 |
| ALERT-03 | 차단·미실행 | draft와 active 분리, 열기/토글/취소 시 변경 호출 없음, 동일 값 확인 비활성 | 승인된 false 공고/로그인 자원과 UI/Network 증거 확보 후 닫기·다음에 하기·Escape 각 변경0 확인 |
| ALERT-04 | 차단·미실행 | 확정 시 정확한 ID에 본문 없는 PUT, 기대 active 성공 후만 카드/토스트 반영 | false→true 변경 대상·허용 범위/종료값·생성 알림/등록 이력 잔존/복구 합의 후 PUT1회·reload GET 확인 |
| ALERT-05 | 차단·미실행 | DELETE 응답 active 기준 반영, registeredAt 값은 카드 판정에 사용하지 않음 | true→false 변경/종료값·잔존/복구 합의 후 DELETE1회·reload 확인. 생성 알림/과거 이력 전체 삭제로 해석하지 않음 |
| ALERT-06 | 차단·미실행 | 조회 오류/재시도, 변경 실패 시 팝업 오류와 기존 카드 유지, savingRef, 공통 401 refresh1회·계정 교체 거부 | 안전한 실제 조회/변경 오류·권한/만료 및 재현/해제 담당·방법·기간 확보. 브라우저 요청 차단·대역은 backend 오류 증거와 분리 |
| ALERT-07 | 차단·미실행 | account ID+bidId key, 이전 GET abort와 HTTP 계정 변경 검사. 구독은 분류 query가 아닌 공고 ID 단위 | 복수 분류 공고 A·다른 B·두 계정의 기대값과 변경/복구 범위·지연 응답 조건 확보 후 분류/공고/계정 전환·늦은 응답 확인 |
| ALERT-08 | 차단·미실행 | native dialog·showModal/Escape/바깥 클릭, max-height/width·스크롤·취소/확인 비활성 경로 | 승인된 로그인/공고 자원과 데스크톱·390/320px 브라우저 확보 후 포커스·키보드·잘림/스크롤·취소 시 변경0 확인 |

### 증거 경계와 인계

- 구현 점검: [카드](../../src/components/bids/bid-detail-alert-card.tsx) → [client](../../src/data/bid-alerts/client.ts)/[contracts](../../src/data/bid-alerts/contracts.ts) → [HTTP](../../src/data/bid-alerts/http-repository.ts)와 [공통 인증 요청](../../src/data/shared/http.ts)을 읽기 전용으로 대조했다. 현재 실행/브라우저 동작 증거는 아니다.
- mock/HTTP 대역: [계약 테스트](../../tests/http-contracts.test.ts)의 구독 변경/재조회, [mock 계정 테스트](../../tests/account-repositories.test.ts)의 탭 복원/계정 격리·abort/실패 코드를 확인했다. 이번 재실행 없음. 대역은 해제 시 registeredAt을 null로 만드는 합성 응답이므로 실제 등록 이력 잔존이나 retained timestamp 검증으로 세지 않는다.
- 단건 PUT 성공은 구독 상태 저장이다. 실제 정정/마감/개찰 알림 전달·`/alarms` 검증, 등록 공고 관리 목록·일괄 해제는 별도 범위다. DELETE를 생성 알림·등록 이력까지 지우는 복구로 가정하지 않는다.
- 재개 역할: 테스트 계정/공고 fixture 담당·구독/인증 API 담당·배포 담당·프론트 QA 실행자·개발자 승인자. 실제 배정은 미확인이다. 비밀값/개인정보/인증 로그 원문은 받거나 기록하지 않는다.
- 다음 Task는 **QA-09 재개**. P0·선행 main/QA-08 선정 예외는 충족하지만 실제8건 차단과 QA-10 진행 예외 없음으로 유지한다. 다음 첫 행동은 task 재개표와 PREP 준비표를 현재 main/Git에 대조하고 자원/사용·변경/잔존·복구·실행 대응을 확보해 Gate를 다시 작성하는 것이다. 다음 Task 자동 착수 없음.


<a id="qa-09-next-qa-10-handoff"></a>

## 2026-11-03 · QA-09 진행 예외와 다음 QA-10 인계

사용자는 [승인 원문/제한](../development/figma-v01/tasks/QA-09.md#qa-09-next-qa-10-exception)에 따라 QA-09 실제8건 차단을 유지하고 QA-10을 다음 대화의 요구사항 Gate 대상으로 선정하는 예외를 승인했다. 위 ‘다음 QA-09 재개/QA-10 예외 없음’은 당시 이력이며 다음 작업 선정만 이번 승인으로 대체한다. ALERT-01~08 실제0통과·8차단/미실행과 [재개 조건](../development/figma-v01/tasks/QA-09.md#qa-09-resume)은 불변이다.

다음 **QA-10**에서는 main/Git·QA-10/PREP 준비표·PBF-01~12를 대조하고 disposable EMPTY_DEFAULT/COMPANY_DEFAULT 계정·매칭/오류/409 fixture, 로그인·GET/PUT/reset 사용·변경과 빈 SAVED 잔존/종료 상태·복구 담당/방법·현재 실행 대응을 확인해 Gate를 작성한다. reset을 최초 상태 복구로 세지 않는다. 이번 예외는 QA-09 통합 PASS나 QA-10 실제 실행/필터 변경·운영/배포 승인이 아니며, QA-10 작업/개인 필터 QA는 수정·실행하지 않았다.


## 2026-11-12 · DEV-62 안내 교정

- 팝업은 공고별 변경 소식을 상단 알림에서 확인하고 해당 공고 상세에서 설정·해제하도록 안내한다. 매일08:30 맞춤 공고 이메일은 별개이며 마이페이지의 알림 설정에서 따로 변경한다. 미지원 전체 관리 화면이나 없는 전역 토글을 안내하지 않는다.
- 이번 mock 팝업·설정/해제·키보드/320px 검증을 기존 ALERT 실제8차단의 통과로 세지 않는다.
- 이번 근거는 [알림 안내 로컬 검증](notification-guidance.md)과 [DEV-62](../development/figma-v01/tasks/DEV-62.md)에서 확인한다. 기존 실제 API 결과·미실행/차단을 보존한다.

<a id="qa-09-20261125-alert"></a>

## QA-09 · 2026-11-25 재개 점검

ALERT-01~08의 실제 통합은 **실행 0건, 0통과·8차단**이다. 10월 기준선의 0통과·8대기와 11월 3일 사전 점검을 보존한다. 승인된 계정·공고별 초기/종료 상태, 허용 변경과 복구 범위, 안전한 오류·만료 조건, 실제 실행 대응이 필요하다. [이전 QA](#qa-09-20261103) · [PREP 준비표](prep-01-readiness.md#qa-0113-준비표)

### 확인한 근거

| 근거 | 2026-11-25 확인 |
| --- | --- |
| 프런트 소스 | 시작 `e695616`의 상세 카드는 로그인 전 업무 조회를 시작하지 않고 상세 경로·분류 쿼리를 로그인 복귀에 보존한다. 인증 후 계정과 공고 ID로 카드를 구분한다. 확정할 때만 변경을 보내고 응답의 `active`가 기대값과 같으면 카드·토스트를 갱신한다. 조회 취소와 공통 401 재시도·계정 변경 응답 폐기 경로를 확인했다. [카드](../../src/components/bids/bid-detail-alert-card.tsx) · [HTTP Repository](../../src/data/bid-alerts/http-repository.ts) · [공통 HTTP](../../src/data/shared/http.ts) |
| 백엔드 소스 | `dev` `3fc3acbfe3a4e0f185c7bd7c5840dfc59a7bc7b4`에서 활성 계정 본인과 양수 공고 ID를 사용한다. `PUT`은 공개 공고에 등록하며 활성 상태에서 중복 등록하면 시작 시각을 유지한다. `DELETE`는 기존 행에 최초 해제 시각을 기록하고, 이력이 있으면 응답에 마지막 `registeredAt`을 보존한다. 등록 행이 없다면 조회·해제는 비활성과 null을 반환한다. [컨트롤러](https://github.com/mate-pjt/mate-backend/blob/3fc3acbfe3a4e0f185c7bd7c5840dfc59a7bc7b4/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/bidnoticealert/AccountBidNoticeAlertController.kt#L31-L83) · [서비스](https://github.com/mate-pjt/mate-backend/blob/3fc3acbfe3a4e0f185c7bd7c5840dfc59a7bc7b4/mate-api/src/main/java/kr/co/mate/mate_api/application/service/bidnoticealert/AccountBidNoticeAlertService.kt#L42-L95) · [저장소](https://github.com/mate-pjt/mate-backend/blob/3fc3acbfe3a4e0f185c7bd7c5840dfc59a7bc7b4/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/bidnoticealert/AccountBidNoticeAlertLifecyclePersistenceAdapter.kt#L21-L120) |
| 배포 기록 | 같은 dev SHA의 `test` 배포 `8050667620`은 16:01 KST 성공으로 기록됐다. CI의 verify·publish·deploy가 성공했고 운영 배포는 건너뛰었다. [백엔드 CI](https://github.com/mate-pjt/mate-backend/actions/runs/45560713606) |
| 게시된 개발 Swagger | 공개 문서 HTTP 200, OpenAPI 3.1.0/v1, SHA-256 `2091506401762af62544742eb418b74f637b3bac8a9e283bf8d7b42f782851e1`. 단건 `GET/PUT/DELETE`는 사용자 인증, 양의 ID 제약은 소스, 게시 path 타입은 int64다. 세 요청 모두 본문 없이 성공 200과 `isSuccess` wrapper를 게시한다. `data`의 속성은 `bidNoticeId`, boolean `active`, nullable date-time `registeredAt`이며 스키마에 속성별 필수 표시는 없다. 프런트는 성공 데이터와 ID 일치, boolean과 null 또는 문자열을 검사한다. [OpenAPI](https://api-test.mate-bid.com/v3/api-docs) · [프런트 검증](../../src/data/bid-alerts/http-repository.ts) |
| 실행 인스턴스·업무 응답 | CORS 소스는 GET/PUT/DELETE와 Authorization 헤더, credentialed 요청을 허용하고 Origin은 실행 설정에서 가져온다. 이번에는 현재 인스턴스의 SHA/이미지 대응, 프런트 공급원·실제 허용 Origin, 인증 업무 응답을 확인하지 못했다. 브라우저·화면/Network 기록은 미실행이다. [CORS 소스](https://github.com/mate-pjt/mate-backend/blob/3fc3acbfe3a4e0f185c7bd7c5840dfc59a7bc7b4/mate-api/src/main/java/kr/co/mate/mate_api/global/config/AuthenticationCorsConfiguration.kt#L28-L46) |

중앙 정책에서 구독 키는 계정과 저장 공고다. 같은 저장 공고의 입찰분류는 구독을 공유하고, 해제 전에 받은 알림은 유지된다. 공고별 내부 알림과 08:30 맞춤 이메일은 독립적이다. 기준선의 [카드·팝업 상태](#테스트-항목)는 해당 사례의 참조이며, 문구의 정책 교정은 DEV-62, 배치·초점 복귀는 DEV-64의 로컬 증거를 따른다. 이번에는 Figma 시안 열람·시각 비교·화면 예외 결정이 없었다. [중앙 정책](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/notification/overview.md#L5-L31) · [POL-19](../development/figma-v01/tasks/POL-19.md#pol-19-contract) · [DEV-62 QA](notification-guidance.md) · [DEV-64 QA](bid-detail.md#dev-64-local-qa)

### 사례별 재개 증거

| 사례 | 재개 시 확보할 증거 |
| --- | --- |
| ALERT-01 | 공개 공고·분류와 승인된 세션에서 로그인 전 알림 요청이 없는지, URL 복귀 뒤 조회만 이루어지는지 확인한다. |
| ALERT-02 | 회사 미가입을 포함한 두 계정의 `active` true/false 초기값과 새로고침 결과를 비교한다. 미등록 조회에서 null 필드의 실제 표현도 확인한다. |
| ALERT-03 | 꺼짐 공고에서 팝업을 열고 토글한 뒤 닫기·다음에 하기·Escape로 각각 취소한다. 재열기 값과 변경 요청 0건을 확인한다. |
| ALERT-04 | 승인된 false→true 변경에서 정확한 공고에 본문 없는 PUT 1회, 카드·토스트와 다음 GET의 true, 합의된 종료 상태를 확인한다. |
| ALERT-05 | 승인된 true→false 변경에서 DELETE 1회, 카드·토스트와 다음 GET의 false, 마지막 등록 시각을 확인한다. 기존 수신 이력의 잔존·정리는 사전에 합의할 범위에 기록한다. |
| ALERT-06 | 승인된 안전한 실패·권한/만료 조건에서 조회 재시도, 변경 실패의 기존 상태 유지, 401 갱신·재시도·재인증 경계와 중복 요청을 확인한다. |
| ALERT-07 | 같은 저장 공고 A의 복수 분류와 별도 공고 B, 두 계정의 초기·종료값을 대조한다. 계정·공고 전환 중 늦은 응답도 확인한다. |
| ALERT-08 | 데스크톱·390px·320px에서 키보드 전환, 초점 가두기·복귀, Escape·바깥 닫기, 스크롤과 취소 후 변경 0건을 확인한다. |

이번 Node 계약 테스트는 mock·HTTP 대역에서 구독의 `active` 전환과 조회, mock 계정 격리·탭 재생성·취소/오류, 공통 HTTP와 공급원 경계를 확인했다. 기존 mock과 HTTP 대역은 해제 시 응답의 `registeredAt`을 null로 돌려준다. 해제 후 마지막 등록 시각을 보존하는 백엔드 계약은 실서버 확인 항목으로 남긴다. 실제 로그인·업무 API·구독 변경과 알림 생성은 0건이며 이번 실행에서 발생한 정리 대상은 없다. [검증 명령과 결과](../development/figma-v01/reviews/QA-09.md) · [재개 조건](../development/figma-v01/tasks/QA-09.md#qa-09-resume)

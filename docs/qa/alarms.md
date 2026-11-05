# 받은 알림 브라우저 통합 테스트

## 기준과 현재 상태

- Figma: [10_알림, 2304:29129](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2304-29129), [읽음 상태, 2304:89716](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2304-89716)
- 화면: `/alarms`, 헤더 알림 아이콘
- 실제 API: `GET /api/v1/me/notifications`, `GET /api/v1/me/notifications/unread-count`, `PATCH /api/v1/me/notifications/{notificationId}/read`
- 목록·건수·읽음 처리는 API에 연결했다. 항목 클릭은 읽음 처리 후 목록에 머물고, 20건을 넘으면 `더 보기`로 다음 페이지를 요청한다. 백엔드 `actionPath`에 따른 이동은 별도 작업이다.
- 사용자별 받은 알림 삭제 API가 없어 편집·삭제는 준비 중으로 비활성화했다. 공고별 알림 설정 해제 API는 받은 알림 삭제 API가 아니다.
- Figma에서 가려진 `7일 후 사라짐` 문구는 정책 미확정 참고사항이다. 화면에 표시하거나 자동 삭제를 구현하지 않는다.
- 2026-09-27의 개발용 Chromium 검사는 기존 mock 화면에서 7일 안내와 편집 버튼 상태만 확인한 기록이다. 아래 실제 API 검증과 구분한다.

## 실행 환경 기록

| 실행일시 | 프론트 URL·코드 상태 | 백엔드 URL·배포 | 브라우저·화면 | 테스트 계정·알림 상태 | 수행자 |
| --- | --- | --- | --- | --- | --- |
| 2026-09-28 약 08:00 KST | `https://local.mate-bid.com:3000`, 로컬 미커밋 코드 | `https://api-test.mate-bid.com`, 배포 식별자 미확인 | Safari 26.6.2 데스크톱, 캡처 3840×2100 | 기존 테스트 전용 계정, 받은 알림 없음; 별도 비공개 창은 로그아웃 | Codex |

Safari 웹 인스펙터의 네트워크 목록에서 테스트 API 서버로 세션 갱신, 알림 목록, 미확인 건수 요청을 확인했다. 민감한 요청 header·cookie는 기록하지 않았다. 목록 응답은 HTTP 200, `isSuccess=true`, `content=[]`, `totalElements=0`, `unreadCount=0`이고, 건수 응답은 HTTP 200, `isSuccess=true`, `data.unreadCount=0`임을 확인했다. 빈 상태가 나타났고 헤더 알림 점은 표시되지 않았다. 비공개 창에서는 로그인 안내와 `/auth?mode=login&next=%2Falarms` 이동을 확인했다. 이어 일반 Safari의 테스트 전용 계정에서 로그아웃 → 알림 페이지 안내 → Google 계정 선택 → `/alarms` 복귀와 빈 상태 표시를 끝까지 확인했다. 응답 본문 원문과 인증 정보는 저장하지 않았다.

## 남은 테스트 조건

- 읽지 않은 알림, 이미 읽은 알림, 알림 21건 이상이 있는 테스트 계정 또는 백엔드 담당자가 정한 생성 방법이 필요하다. 실제 알림 본문·계정 정보는 문서에 기록하지 않는다.
- `PATCH`는 서버의 읽음 상태를 바꾸므로 테스트 전용 알림으로 실행한다. 현재 사용자 결정에 따라 데이터가 준비될 때까지 실행하지 않는다.
- 공개 공고 데이터가 필요한 알림 생성이나 `actionPath` 이동은 테스트 공고와 프론트 경로 계약이 준비된 후 별도 기능으로 검증한다.

## 테스트 항목

### ALARM-01 — 실제 API의 빈 목록

- Figma node: [빈 상태, 2304:89973](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2304-89973)
- 화면 경로: `/alarms`
- API: `GET /api/v1/me/notifications?page=0&size=20&unreadOnly=false`
- 준비 데이터: 받은 알림이 없는 로그인 계정
- 조작: Safari에서 페이지를 열고 새로고침한다.
- 예상 결과: 실제 API 조회 뒤 빈 상태가 표시되고 과거 mock 알림이 나타나지 않는다.
- 상태: 통과 (2026-09-28)
- 환경/증거: 위 Safari 네트워크·응답의 빈 목록 요약과 빈 상태 화면·접근성 트리.
- 결함/담당자/재검증: 없음. 백엔드 배포 변경 시 재검증.

### ALARM-02 — 알림 없는 계정의 헤더 점

- Figma node: [10_알림, 2304:29129](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2304-29129)
- 화면 경로: `/alarms`의 공통 헤더
- API: `GET /api/v1/me/notifications/unread-count`
- 준비 데이터: ALARM-01과 같은 계정
- 조작: 로그인 상태에서 페이지를 열고 새로고침한다.
- 예상 결과: 건수 조회가 실행되고 미확인 알림 점이 나타나지 않는다.
- 상태: 통과 (2026-09-28)
- 환경/증거: 위 Safari 네트워크에서 HTTP 200·`isSuccess=true`·`unreadCount=0`, 목록의 `unreadCount=0`, 헤더 점 미표시 확인. 0건 응답끼리 대조함.
- 결함/담당자/재검증: 없음.

### ALARM-03 — 읽음 처리와 재진입

- Figma node: [읽음 상태, 2304:89716](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2304-89716)
- 화면 경로: `/alarms`
- API: `PATCH /api/v1/me/notifications/{notificationId}/read`, 이후 목록·미확인 건수 GET
- 준비 데이터: 읽지 않은 테스트 알림 한 건 이상
- 조작: 알림을 누르고 목록에 머무는지 확인한 뒤 새로고침한다.
- 예상 결과: 성공 응답 뒤 항목과 헤더 점이 갱신되고 재진입해도 읽음 상태가 유지된다. 실패 시 읽음으로 바뀌지 않고 오류가 보인다.
- 상태: 대기 (읽지 않은 테스트 알림 없음)
- 환경/증거: 미실행
- 결함/담당자/재검증: 테스트 알림 준비 후 실행

### ALARM-04 — 삭제 준비 중

- Figma node: [편집 상태, 2304:88975](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2304-88975)
- 화면 경로: `/alarms`
- API: 받은 알림 삭제 API 없음
- 준비 데이터: 알림 한 건 이상
- 조작: 편집 버튼의 상태를 확인한다.
- 예상 결과: 편집은 준비 중으로 비활성화되어 있으며 삭제 성공 안내가 나오지 않는다. 삭제/숨김 의미 확정 후 재설계한다.
- 상태: 차단 (받은 알림 삭제 API 누락)
- 환경/증거: 현재 빈 목록으로 버튼이 보이지 않아 실제 API 브라우저 시나리오 미실행
- 결함/담당자/재검증: 백엔드 API 계약과 알림 데이터 준비 후 재검증

### ALARM-05 — 7일 안내 보류

- Figma node: [10_알림, 2304:29129](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2304-29129)
- 화면 경로: `/alarms`
- API: 없음 (보존 기간 정책 미확정)
- 준비 데이터: 알림 한 건 이상
- 조작: 알림 목록 화면을 연다.
- 예상 결과: `7일 후 사라짐` 안내가 노출되지 않는다. 자동 삭제 여부는 검증 대상으로 간주하지 않는다.
- 상태: 대기 (실제 목록 데이터 없음; 2026-09-27 mock 화면에서는 안내 미노출 확인)
- 환경/증거: 실제 API 목록 화면 미실행
- 결함/담당자/재검증: 목록 데이터 준비 시 확인, 보존 정책 확정 시 재검토

### ALARM-06 — 알림이 있는 목록

- Figma node: [목록, 2304:29131](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2304-29131)
- 화면 경로: `/alarms`
- API: `GET /api/v1/me/notifications`
- 준비 데이터: 종류와 읽음 상태가 다른 테스트 알림
- 조작: 페이지를 열고 API의 제목·본문·시간·읽음 상태를 화면과 대조한다.
- 예상 결과: 서버 순서와 내용, 한국 시간 날짜, 종류별 아이콘, 미확인 점과 교차 배경이 일치하며 mock 항목이 나타나지 않는다.
- 상태: 대기 (테스트 알림 없음)
- 환경/증거: 미실행
- 결함/담당자/재검증: 테스트 알림 준비 후 실행

### ALARM-07 — 미확인 건수의 실제 값

- Figma node: [목록, 2304:29131](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2304-29131)
- 화면 경로: `/alarms`의 공통 헤더
- API: `GET /api/v1/me/notifications/unread-count`, `GET /api/v1/me/notifications`
- 준비 데이터: 미확인 알림 한 건 이상
- 조작: 두 API의 건수를 비밀값 제거 후 대조하고 다른 페이지로 이동했다가 돌아온다.
- 예상 결과: 두 `unreadCount`가 일치하고 헤더 점이 표시된다. 읽음 처리 성공 후 건수를 다시 조회한다.
- 상태: 대기 (미확인 테스트 알림 없음)
- 환경/증거: 미실행; ALARM-02에서는 두 API의 0건 응답을 대조함
- 결함/담당자/재검증: 테스트 알림 준비 후 실행

### ALARM-08 — 20건씩 더 보기

- Figma node: [목록, 2304:29131](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2304-29131)
- 화면 경로: `/alarms`
- API: `GET /api/v1/me/notifications?page=0&size=20`, 이후 `page=1&size=20`
- 준비 데이터: 순서가 구별되는 알림 21건 이상
- 조작: 첫 페이지의 `더 보기`를 누르고 연속 클릭·실패 후 재시도를 확인한다.
- 예상 결과: 기존 항목을 유지한 채 다음 항목이 순서대로 붙고 중복이 없으며 마지막 페이지에서 버튼이 사라진다.
- 상태: 대기 (21건 이상 테스트 알림 없음)
- 환경/증거: 미실행
- 결함/담당자/재검증: 테스트 알림 준비 후 실행

### ALARM-09 — 로그아웃 안내와 복귀

- Figma node: [로그인 안내, 2855:113653](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2855-113653)
- 화면 경로: `/alarms` → `/auth?mode=login&next=%2Falarms`
- API: 비로그인 세션 확인 `POST /api/v1/auth/token/refresh`; 알림 목록·건수 API는 호출하지 않음
- 준비 데이터: Safari 비공개 창의 비로그인 세션
- 조작: 로그아웃 상태에서 `/alarms`를 열고 로그인 안내 버튼을 누른 뒤, 테스트 계정으로 Google 로그인을 완료한다.
- 예상 결과: 안내가 보이고 로그인 화면에 `/alarms` 복귀 경로가 유지되며, 인증 완료 후 `/alarms` 화면으로 돌아온다.
- 상태: 통과 (2026-09-28)
- 환경/증거: 비공개 창의 안내·로그인 경로 확인 후 일반 Safari에서 테스트 전용 계정 로그아웃, 안내 CTA, Google 계정 선택, `/alarms` 빈 상태 복귀 확인. OAuth URL·계정 정보는 기록하지 않음.
- 결함/담당자/재검증: 없음

### ALARM-10 — 조회 실패와 재시도

- Figma node: API 오류 상태는 Figma에 별도 화면 없음
- 화면 경로: `/alarms`
- API: 목록 또는 미확인 건수 GET 실패
- 준비 데이터: 안전하게 재현할 수 있는 테스트 서버 오류 조건
- 조작: 목록 조회 실패 뒤 다시 시도 버튼을 누르고 정상 복구를 확인한다.
- 예상 결과: mock 목록으로 대체하지 않고 오류를 표시하며 재시도 성공 시 서버 목록을 표시한다. 건수 실패는 잘못된 미확인 점을 표시하지 않는다.
- 상태: 대기 (오류 재현 조건 없음)
- 환경/증거: 미실행
- 결함/담당자/재검증: 백엔드 담당자와 재현 조건 확정 후 실행

<a id="qa-11-20261105"></a>
## QA-11 사전 점검 · 2026-11-05

[작업/재개 조건](../development/figma-v01/tasks/QA-11.md#qa-11-resume) · [검토 증거](../development/figma-v01/reviews/QA-11.md) · [현재/다음/상태는 WBS](../development/figma-v01/README.md).

사용자 답변 **“미준비 — 사전 점검·차단/재개 조건 문서화와 Git 전달만 진행 (추천)”**에 따라 소스·기존 QA·PREP 준비표만 대조했다. 실제 로그인/알림 GET/읽음 PATCH·알림 생성/배치·오류 주입·서버 시작/운영/배포를 실행하지 않았다. 이번 실제 실행 **0건·신규 통과0·재검증8차단**과 별도 ALARM-04 API 차단/ALARM-05 정책 보류를 구분한다. 위 기존 **3통과·1차단·6대기** 기록과 날짜별 근거를 수정하지 않았다. 현재 API의 알림이 0건임을 새로 확인한 결과가 아니다.

| 기존 case | 2026-11-05 사전 점검 판정 | 부족한 자원/재개 시 확인할 증거 |
| --- | --- | --- |
| ALARM-01 | 재검증 차단·기존 통과 보존 | 승인된 빈 disposable 계정/상태·GET 사용/실행 대응. 실제 목록0/건수0·빈 화면 대조 |
| ALARM-02 | 재검증 차단·기존 통과 보존 | 같은 계정의 목록/건수 GET·0건/헤더 점 없음 대조 |
| ALARM-03 | 차단·기존 대기 보존 | 미읽음 PATCH 대상·로그인/사용/변경/읽음 잔존·종료/복구 승인. 성공 후 점/건수·목록에 머묾·reload 유지·실패 시 값 유지·중복 요청 수 |
| ALARM-04 | 기존 삭제 API 차단 유지·미실행 | 받은 알림 삭제 계약은 별도 범위. 데이터 준비 시 비활성 편집 표시만 확인. 구독 해제를 삭제로 쓰지 않음 |
| ALARM-05 | 7일 정책 보류 유지·실제 목록 미실행·기존 대기 보존 | 데이터 준비 시 안내 미노출만 확인. 7일 보존/자동 삭제를 확정하거나 구현하지 않음 |
| ALARM-06 | 차단·기존 대기 보존 | 읽음/미읽음·여러 종류 합성 알림21건 이상·서버 순서/표시 기대값. DTO→KST/아이콘·점과 순번별 배경 구분 |
| ALARM-07 | 차단·기존 대기 보존 | 시작 총건수/unreadCount·읽음 PATCH 대상·종료 기대값. 목록과 건수 GET 일치·성공 후 재조회·마지막 미읽음 이후0/헤더 점 제거 |
| ALARM-08 | 차단·기존 대기 보존 | 21건 이상 별칭·첫20/다음/마지막 페이지·정렬 기대값, 연속 클릭·다음 페이지 실패/해제·재시도 수단. append/중복 없음·마지막 버튼 제거·기존 목록 유지 |
| ALARM-09 | 재검증 차단·기존 통과 보존 | 현재 disposable 계정 로그인/refresh/logout 사용 범위·Origin/실행 대응과 세션 종료 조건. 안내·복귀 경로 확인, 인증 query/계정 원문 기록 금지 |
| ALARM-10 | 차단·기존 대기 보존 | 최초 목록/건수 GET의 안전한 실제 서버 오류·상태/기간/해제·정상복구. fallback 없이 오류/재시도·잘못된 헤더 점 없음. 브라우저 차단은 네트워크 실패 증거로 분리 |

실행 환경: 시작 main=origin/main `0cf4aa8b741f80700de1c9852520492092bd1d98`·clean, fetch/FF 뒤 `docs/qa-11-alarms-preflight` 생성. 08:56 KST 기본 셸 Node26.5.0·pnpm11.3.0, 저장소/CI pin 및 로컬 실행 파일 Node22.20.0 확인, 3000/6006 TCP 리스너 없음. 브라우저/viewport·캡처/Network·현재 프론트 공급원 snapshot/backend 실행 대응은 미확보이며 문서 점검의 화면 증거는 해당 없음. `.env`/비밀값/개인정보를 읽거나 출력하지 않았다.

현재 소유 소스 대조: notifications 공개 client/contracts → HTTP/mock 경계, 페이지 size20·서버 순서·읽음 응답 검사·KST 표시, 읽음 성공 후 상태/건수 변경 이벤트, 헤더 재조회·실패/늦은 응답 분리, 로딩/재시도·중복 ID 제외 코드 확인. 코드 존재를 실제 동작 PASS로 세지 않는다. 기존 mock/HTTP 대역의25건/22미읽음·20→25/22→21과 [과거 RM-05](repositories.md)는 이번 재실행/실제 API 근거가 아니다.

재개 전에 합성 fixture·시작 총건수/미읽음/순서·PATCH 대상·사용/변경/잔존/종료/복구 담당/방법·안전한 오류와 해제·실행 식별자를 [QA-11 재개표](../development/figma-v01/tasks/QA-11.md#qa-11-resume)에 확보한다. 읽음 취소 API를 추정하지 않고 disposable 읽음 잔존 허용 또는 담당자 재생성/정리를 정한다. 담당자는 미지정이며 역할은 알림 fixture/API/배포 담당·개발자 승인자·프론트 QA 실행자다. 실제 데이터 변경이 없어 새 잔존/복구 대상 없음. 다음은 QA-11 재개이며 QA-12를 자동 시작하지 않는다.

### 2026-11-05 09:12 KST · 다음 Gate 선정에 한정한 후속 예외

사용자가 **QA-11 실제 QA 차단을 유지하고 QA-12를 다음 요구사항 Gate 대상으로만 선정하는 진행 예외**를 명시 승인했다. [승인 원문·범위·다음 첫 행동](../development/figma-v01/tasks/QA-11.md#qa-11-next-qa-12-exception)에 따라 앞선 ‘다음 QA-11 재개/QA-12 진행 예외 없음’은 당시 이력으로 보존하고 다음 선정만 대체한다. 실제 실행0건·신규 통과0·재검증8차단, ALARM-04 삭제 API 차단/ALARM-05 정책 보류, 기존3통과·1차단·6대기와 QA-11 재개 조건은 그대로다. 이번 후속도 앱/제품 API·설정 변경·알림 생성·서비스 운영/배포·QA-12 실행은 없다. QA-12의 실제 서버 오류·사용/변경/원복·실행 대응은 새 대화 Gate에서 확인하며 현재 준비 완료로 세지 않는다. 현재/다음/상태의 단일 기준은 WBS다.

<a id="pol-04-navigation-qa"></a>

## 2026-11-05 · POL-04 v1의 대상 화면 이동 QA 계획

[사용자3결정](../development/figma-v01/tasks/POL-04.md#pol-04-decisions)과 [DEV-06 인계](../development/figma-v01/tasks/DEV-06.md#pol-04-handoff)에 따른 **신규 ANAV-01~10 계획**이다. 이번에는 정책 문서만 작성했고 앱/브라우저·mock/HTTP 대역·실제 업무 API 실행0건, 신규 실제 통과0건이다. 10건 모두 **대기 — DEV-06 미구현·실제 자원/승인/실행 대응 미확보**이며 통과로 세지 않는다. 위 ALARM-01~10과 QA-11의 기존3통과·1차단·6대기/재검증8차단·04차단/05보류는 그대로다. 특히 ALARM-03의 ‘목록 유지’는 과거 읽음 구현의 기대값이고 새 허용 경로 이동의 PASS가 아니다.

아래 공통 기준은 모든 ANAV case에 적용한다.

- Figma node: [10_알림, 2304:29131](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2304-29131), [읽음, 2304:89716](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2304-89716). 경로/읽음 정책은 Figma만으로 추정하지 않고 POL-04 v1을 따른다.
- 출발 화면 `/alarms`; API N=`GET /api/v1/me/notifications`, C=`GET /api/v1/me/notifications/unread-count`, R=`PATCH /api/v1/me/notifications/{notificationId}/read`. 각 case의 N/C는 전후 상태 대조, R은 지정한 disposable 합성 알림에만 적용한다. 목적지 조회는 기존 공고 상세/회사 Repository를 사용하고 새 이동/권한 endpoint는 추정하지 않는다.
- 준비: 합성 전용 계정·알림/공고/분류/회사 별칭, 시작/종료 readAt·unreadCount/total/정렬/세션과 이동 기대값, 사용/변경·읽음 잔존 허용·복구 담당/방법, 안전한 오류/해제와 frontend/backend 실행 대응. 사용자 승인을 확보하기 전 실제 로그인/N/C/R·알림 생성/서비스 제어를 실행하지 않는다. 준비용 ID/경로 예시는 합성 값이며 실제 fixture 생성 증거가 아니다.
- 실행 시 기록: KST 시각·프론트 HEAD/공급원 snapshot/Origin·backend 배포 run/artifact와 실행 SHA 대응·브라우저/viewport·키보드·UI 캡처·비식별 method/path/status·시작/종료/복구. query/인증정보/알림 본문 원문은 저장하지 않는다. 서버 부재/장애를 조작하지 않고 승인된 오류 fixture를 사용한다.

| case | 화면·API | 준비 데이터·조작 | 예상 결과 | 이번 판정 |
| --- | --- | --- | --- | --- |
| ANAV-01 | `/alarms` → `/bids/{id}`(+선택 `bidClsfcNo`), N/C/R | 미읽음·공개 합성 공고와 복수 분류. 분류 없음/있음 알림을 각각 클릭하고 재진입 | R 성공 뒤 읽음/점·건수 반영 후 현재 탭 이동. 서버 snapshot의 대상/분류 유지·다른 ID 추정 없음. total/정렬 유지 | 대기·미실행 |
| ANAV-02 | `/alarms` → `/my/company`, N/C/R·기존 회사 조회 | 미읽음 회사 목적지, 연결/미연결·소속 변경된 계정별 fixture. 클릭 | query/hash 없는 정확한 경로, 현재 계정의 기존 회사/빈/권한 상태 표시. resourceId의 회사를 자동 열거나 가입하지 않음 | 대기·미실행 |
| ANAV-03 | 읽은 알림 → 허용 목적지, N/C·R 호출 없음 | 이미 읽은 공고/회사 알림을 클릭하고 목록 복귀 | PATCH 없이 검증 후 이동, 읽음 시각·건수 추가 감소 없음 | 대기·미실행 |
| ANAV-04 | `/alarms` 유지, N/C/R | null/빈/무효 타입·소식/회사 통합 등 미지원 경로, 읽음/미읽음 조합 클릭 | 미읽음은 R 성공 뒤만 반영. 모두 목록/본문 유지·안내, 원문 경로 출력/다른 목적지 추정 없음 | 대기·미실행 |
| ANAV-05 | `/alarms` 유지, N/C/R | 외부 및 같은 origin 절대 URL·scheme·`//`·역슬래시·공백/제어문자·경로 separator/이중 인코딩/dot segment·깨진 encoding의 합성 대역 입력 클릭 | 모든 우회 경로 거절. 외부/인증/API/변경 경로 이동0건. 허용된 N/C/R 외에 actionPath 위험 목적지로 보내는 요청0건. R 자체는 기존 읽음 성공 규칙 유지 | 대기·미실행 |
| ANAV-06 | `/alarms` → 허용 경로 또는 유지, N/C/R | 정상 분류 직렬화와 미지원/중복/빈 query·hash·잘못된/과대 ID, `/my/company?companyId=...`를 대조 | 정상 단일 분류만 유지, 현행 ID/분류 계약 외 값은 폴백. URL 파서 보정/반복 decode로 위험 입력을 허용하지 않음 | 대기·미실행 |
| ANAV-07 | `/alarms`, N/C/R | 읽음 네트워크·서버4xx/5xx·무효 응답 fixture, 실패 후 명시적 재시도/재조회 | 실패 시 이동/낙관 갱신 없음·기존 UI값과 오류 안내. 통신 실패의 서버 반영은 미확정으로 두고 재조회/멱등 재시도 후 맞춤. 중복 건수 감소/읽음 취소 추정 없음 | 대기·미실행 |
| ANAV-08 | `/alarms`, N/C/R·기존 세션 흐름 | 지연 응답·같은 항목 연속 클릭/서로 다른 항목 경쟁·해제·계정 교체·로그아웃·refresh 성공/최종401 | 중복 PATCH/이동 방지·늦은 응답의 새 계정/화면 이동0건. 기존 refresh1회/로그인 안내·`/alarms` 복귀, 로그인 후 자동 PATCH/이동0건 | 대기·미실행 |
| ANAV-09 | 허용 공고/회사 목적지·기존 조회·N/C/R | 정상 형식이나 삭제/공개 전/권한 거절/서버 오류인 합성 대상 클릭·복귀 | 허용 route의 기존 오류/빈/권한 UI. 읽음 성공 유지·다른 자원 우회/되돌림/추가 mutation 없음 | 대기·미실행 |
| ANAV-10 | `/alarms`와 허용 목적지·N/C/R | 위 정상/폴백/오류 fixture, 데스크톱·390/320px·Tab/Enter/Space·보조기술 상태 확인 | 포커스/버튼·로딩/오류/안내 접근성, 중복 행동 방지와 키보드 이동, 레이아웃/본문/순번 배경 유지 | 대기·미실행 |

backend source의 삭제 계약 관찰은 배포 완료가 아니며 ALARM-04의 날짜별 이력을 통과로 바꾸지 않는다. 삭제/보존은 POL-20/관련 개발, 변경 신호는 POL-05/DEV-07 범위다. 이 계획은 기존 QA 예외·실제 자원 준비·mutation 승인을 확대하지 않는다.

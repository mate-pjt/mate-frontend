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

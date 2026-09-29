# 맞춤 공고 이메일 수신 설정 브라우저 통합 테스트

## 기준과 범위

- Figma: [9.2.0 알림 설정, 3139:52591](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=3139-52591)
- 화면: `/my` → `/my/settings/notifications`
- 실제 API: `GET /api/v1/me/notification-email-settings`, `GET|PATCH /api/v1/me/matched-bid-notice-email-settings`
- 정책: [mate-docs 알림과 맞춤 공고 이메일](https://github.com/mate-pjt/mate-docs/blob/b3251bba2a9fbc7de8857ee73dfb955db5720a3c/docs/domain/notification/overview.md). 맞춤 이메일은 매일 한국 시각 08:30에 조건에 맞는 새 공고가 있을 때 보내며 신규 계정 기본값은 OFF다. 수신 이메일 주소와 이메일 ON/OFF는 별개 설정이다.
- 이 문서는 맞춤 이메일 ON/OFF를 검증한다. 다른 이메일 인증·전환은 [별도 펀치리스트](./notification-email-recipient.md)에서 검증한다. Figma의 공고 상세 알림 일괄 스위치와 야간 수신 스위치는 현행 정책/API에 없어 표시하지 않는다. 날짜 예시도 실제 데이터가 아니므로 표시하지 않는다.
- 정적 검증: Node 22.20.0의 `pnpm lint`, `pnpm build`, `git diff --check` 통과.

## 실행 환경 기록

| 실행일시 | 프론트 URL·코드 상태 | 백엔드 URL·배포 | 브라우저·화면 | 계정·데이터 별칭 | 수행자 |
| --- | --- | --- | --- | --- | --- |
| 2026-09-28 약 08:42 KST | `https://local.mate-bid.com:3000`, `71a1099` 기반 로컬 미커밋 코드 | `https://api-test.mate-bid.com`, 배포 식별자 미확인 | Safari 데스크톱, 창 캡처 3840×2100 | 기존 테스트 전용 계정, 시작/종료 상태 OFF; 별도 비공개 창은 비로그인 | Codex |
| 2026-09-28 약 09:15~09:30 KST | 같은 로컬 HTTPS·미커밋 코드 | 같은 테스트 API, 배포 식별자 미확인 | Chrome 152, 기본 화면과 390×844·320×640 뷰포트 | 같은 테스트 전용 계정, 시작/종료 상태 OFF | Codex |

Safari에서 로그인 상태의 실제 수신 이메일과 OFF 설정을 읽었다. OFF → ON 변경 후 성공 안내와 ON 상태를 확인했고, 새로고침 뒤에도 ON이었다. 다시 OFF로 저장하고 새로고침 뒤 OFF를 확인해 테스트 계정 상태를 복구했다. 이 화면에는 mock 공급원이 없고, 성공 화면은 두 GET 및 PATCH가 `apiRequest`의 HTTP 성공·`isSuccess=true` 검사와 DTO 검증을 통과해야 나타난다. 따라서 성공 응답은 UI와 호출 코드에서 확인한 추론이며, Web Inspector의 개별 HTTP 행·응답 본문은 별도로 캡처하지 못했다. Inspector 캡처 도구 오류가 발생했으며 인증 header, cookie, 이메일 원문은 기록하지 않았다.

Chrome에서 비로그인 안내 → Google 로그인 → 원래 설정 화면 복귀를 확인했다. QA 탭의 CDP Network 이벤트에서 두 설정 GET과 ON/OFF PATCH의 HTTP 200, 필요한 OPTIONS의 HTTP 200을 확인했다. 인증 header·cookie·응답 본문·이메일 원문은 기록하지 않았다. 별도 QA 탭에서는 설정 API URL만 임시 차단해 조회·저장 네트워크 실패를 재현한 뒤 차단을 해제하고 재시도했다. 이는 **브라우저에서 만든 네트워크 실패**이며 실제 백엔드 4xx/5xx 응답 검증은 아니다.

Chrome 첫 접속에서는 로컬 인증서에 `ERR_CERT_AUTHORITY_INVALID` 경고가 나타났다. 이후 로컬 화면이 열려 기능 검증을 진행했으나 Chrome의 지속적인 인증서 신뢰 설정은 확인하지 않았다. 이 실행을 Chrome 인증서 환경 검증의 통과 근거로 사용하지 않는다.

모바일 증거: [390px 설정 스위치](./notification-settings-mobile-390.jpg), [390px 긴 주소 줄바꿈](./notification-settings-long-email-390.jpg). 두 번째 이미지는 실제 계정 이메일을 노출하지 않도록 브라우저 DOM에 `example.invalid` 가상 주소를 잠시 표시한 레이아웃 검사다. 새로고침으로 실제 표시를 복원했고 서버 데이터는 변경하지 않았다.

## 테스트 항목

### NSET-01 — 로그인 계정의 현재 설정 조회

- Figma node: [9.2.0 알림 설정, 3139:52591](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=3139-52591)
- 화면 경로: `/my/settings/notifications`
- API: `GET /api/v1/me/notification-email-settings`, `GET /api/v1/me/matched-bid-notice-email-settings`
- 준비 데이터: 로그인한 테스트 전용 계정, 수신 주소 설정 존재, 맞춤 이메일 OFF
- 조작: Safari에서 설정 화면을 열고 두 조회가 끝나기를 기다린다.
- 예상 결과: 실제 수신 주소가 표시되고 스위치가 서버의 `enabled=false`와 일치한다. 다른 계정의 값이나 고정 예시 주소를 표시하지 않는다.
- 상태: 통과 (2026-09-28)
- 환경/증거: Safari와 Chrome에서 실제 계정의 수신 주소 유형과 주소가 화면에 나타났고 스위치가 OFF였다. Chrome CDP에서 두 설정 GET과 각 OPTIONS의 HTTP 200을 확인했다. 주소 원문은 기록하지 않았다.
- 결함/담당자/재검증: 없음. 백엔드 배포 변경 또는 독립 Network 증거가 필요할 때 재확인.

### NSET-02 — OFF에서 ON으로 저장

- Figma node: [맞춤 공고 알림 스위치, 3139:52633](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=3139-52633)
- 화면 경로: `/my/settings/notifications`
- API: `PATCH /api/v1/me/matched-bid-notice-email-settings` with `{ "enabled": true }`
- 준비 데이터: NSET-01의 OFF 계정
- 조작: 맞춤 공고 이메일 스위치를 누른다.
- 예상 결과: 저장 중에는 중복 클릭이 막히고, 성공 응답 후 ON과 성공 안내를 표시한다.
- 상태: 통과 (2026-09-28)
- 환경/증거: Safari에서 저장 중 disabled 상태, 응답 뒤 ON, `맞춤 공고 이메일을 켰어요.` 안내를 확인했다. Chrome에서 키보드 조작으로 같은 상태 전환과 실제 PATCH·OPTIONS HTTP 200을 확인했다.
- 결함/담당자/재검증: 없음.

### NSET-03 — 새로고침 유지와 원상 복구

- Figma node: [9.2.0 알림 설정, 3139:52591](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=3139-52591)
- 화면 경로: `/my/settings/notifications`
- API: `GET|PATCH /api/v1/me/matched-bid-notice-email-settings`
- 준비 데이터: NSET-02 후 ON 상태
- 조작: 새로고침으로 ON을 확인하고, 스위치를 OFF로 변경한 뒤 다시 새로고침한다.
- 예상 결과: 각 새로고침에서 서버의 저장 상태와 화면이 일치하고 최종 상태가 시작값 OFF로 돌아온다.
- 상태: 통과 (2026-09-28)
- 환경/증거: ON 재조회, OFF 저장, OFF 재조회가 Safari 화면에서 각각 확인됐다. Chrome에서도 PATCH OFF·OPTIONS HTTP 200과 별도 로그인 후 재조회한 최종 OFF를 확인했다.
- 결함/담당자/재검증: 없음.

### NSET-04 — 비로그인 안내와 진입 경로

- Figma node: [9.2.0 알림 설정, 3139:52591](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=3139-52591)
- 화면 경로: `/my` → `/my/settings/notifications` → `/auth?mode=login&next=%2Fmy%2Fsettings%2Fnotifications`
- API: 비로그인 세션 확인 `POST /api/v1/auth/token/refresh`; 설정 GET/PATCH는 호출하지 않음
- 준비 데이터: Safari 비공개 창의 비로그인 세션
- 조작: 일반 창에서 헤더의 마이페이지 링크와 `/my` 카드로 진입한다. 비공개 창에서 설정 URL을 열고 로그인 버튼을 누른다.
- 예상 결과: 로그인한 계정은 설정 화면으로 이동한다. 비로그인 상태에는 안내가 나타나고 로그인 URL에 설정 화면 복귀 경로가 유지된다.
- 상태: 통과 (2026-09-28)
- 환경/증거: 일반 Safari의 헤더 → `/my` 카드 → 설정 화면, 비공개 Safari의 로그인 안내 및 `next` 경로를 확인했다. Chrome에서는 비로그인 설정 URL → 로그인 버튼 → Google OAuth → 동일 설정 URL 복귀와 실제 계정 설정 표시를 확인했다.
- 결함/담당자/재검증: 없음.

### NSET-05 — 브라우저 네트워크 실패와 재시도

- Figma node: API 오류 상태는 Figma에 별도 화면 없음
- 화면 경로: `/my/settings/notifications`
- API: 두 GET 중 하나 또는 PATCH 실패
- 준비 데이터: 로그인한 테스트 전용 계정, Chrome QA 탭에 한정된 설정 API URL 요청 차단
- 조작: 설정을 로드한 뒤 해당 URL을 차단하고 PATCH를 시도한다. 차단한 채 새로고침해 GET 실패를 확인한 다음 차단을 해제하고 `다시 시도하기`를 누른다.
- 예상 결과: mock 값으로 대체하지 않고 오류를 알린다. 저장 실패 때 이전 스위치 값을 유지하고 다시 시도할 수 있다.
- 상태: 통과 (2026-09-28, 브라우저 네트워크 실패)
- 환경/증거: Chrome CDP `Network.setBlockedURLs`를 이 탭의 설정 API URL에만 임시 적용했다. `Network.loadingFailed`의 `blockedReason=inspector`를 확인했다. PATCH 실패 때 연결 오류를 표시하고 스위치는 OFF로 유지했으며, GET 실패 때도 오류와 재시도 버튼을 표시했다. 차단 해제 후 재시도해 실제 설정과 OFF 상태를 다시 읽었다. 브라우저 탭을 닫고 차단 설정을 해제했다.
- 결함/담당자/재검증: 실제 백엔드 4xx/5xx 응답은 NSET-07에 별도 대기.

### NSET-06 — 모바일과 키보드 조작

- Figma node: [9.2.0 알림 설정, 3139:52591](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=3139-52591)
- 화면 경로: `/my/settings/notifications`
- API: `GET|PATCH /api/v1/me/matched-bid-notice-email-settings`
- 준비 데이터: 로그인한 테스트 전용 계정, 390×844·320×640 뷰포트. 긴 주소 레이아웃만 `example.invalid` 가상 주소로 임시 검사
- 조작: 모바일 폭에서 가로 넘침과 주소 줄바꿈을 확인하고 Tab/Space로 스위치를 ON/OFF 조작한다. 새로고침으로 시작 상태를 확인한다.
- 예상 결과: 가로 넘침 없이 내용을 읽을 수 있고 키보드로 변경할 수 있다.
- 상태: 통과 (2026-09-28)
- 환경/증거: Chrome에서 390px 문서 너비 390px, 320px 문서 너비 305px로 가로 넘침이 없었다. Tab으로 `role=switch`에 초점을 맞추고 Space로 OFF → ON → OFF를 저장했으며 새로고침 후 OFF를 확인했다. 390px에서 가상 긴 주소가 3줄로 접혔고 문서 너비는 390px였다. 가상 주소는 새로고침으로 제거해 실제 계정 표시를 복구했다. 위 모바일 이미지 2개를 참고한다.
- 결함/담당자/재검증: 실제 다른 긴 이메일을 가진 계정의 API 데이터 시나리오는 별도 계정이 준비되면 확인 가능하다.

### NSET-07 — 실제 백엔드 오류 응답

- Figma node: API 오류 상태는 Figma에 별도 화면 없음
- 화면 경로: `/my/settings/notifications`
- API: 두 설정 GET 중 하나 또는 PATCH의 실제 4xx/5xx 응답
- 준비 데이터: 백엔드 담당자가 승인한 안전한 오류 재현 조건
- 조작: 오류 조건에서 조회·저장을 실행한 뒤 조건을 제거하고 재시도한다.
- 예상 결과: 오류를 안내하고 저장 실패 시 기존 상태를 유지하며, 정상 조건에서 복구된다.
- 상태: 대기 (테스트 서버의 안전한 4xx/5xx 재현 조건 없음)
- 환경/증거: NSET-05는 브라우저 요청 차단으로 네트워크 실패만 검증했다. 서버가 오류 응답을 실제 반환하는 경우는 미실행.
- 결함/담당자/재검증: 백엔드 담당자와 오류 재현 방법을 확정한 뒤 실행.

## 실행 결과 요약

- 통과/실패/차단/대기: `6/0/0/1`.
- 맞춤 이메일 ON/OFF의 실제 API HTTP 200·새로고침 왕복·원상 복구, 브라우저 네트워크 실패와 재시도, 모바일·키보드 동작을 확인했다. 실제 백엔드 4xx/5xx 응답은 남아 있다.
- 최종 판정: 현재 준비된 조건에서 기능 브라우저 검증 통과, 서버 오류 응답 케이스는 대기 (2026-09-28).

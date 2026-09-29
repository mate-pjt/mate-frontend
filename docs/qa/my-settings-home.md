# 설정 및 관리 첫 화면 브라우저 통합 테스트

## 기준

- Figma 파일/화면: [9.0.0 설정 및 관리, 3139:52490](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.0?node-id=3139-52490)
- 구현 화면: `/my`; 연결 확인 대상 `/my/settings/notifications`, `/auth?mode=login&next=%2Fmy`
- 관련 API: `POST /api/v1/auth/token/refresh`, `POST /api/v1/auth/logout`, `GET /api/v1/me/notification-email-settings`, `GET /api/v1/me/matched-bid-notice-email-settings`
- 이번 작업의 정적 검증: Node 22.20.0에서 `pnpm lint`, `pnpm build`, `git diff --check` 통과
- 실제 브라우저 통합 상태: `7건 통과`

## 실행 환경 기록

| 실행일시 | 프론트 URL·배포/commit | 백엔드 URL·배포 | 브라우저·화면 크기 | 테스트 계정/데이터 별칭 | 수행자 |
| --- | --- | --- | --- | --- | --- |
| 2026-09-28 13:30~13:40 KST | `https://local.mate-bid.com:3000`, 작업 트리 `71a1099` 기반 | `https://api-test.mate-bid.com`, 배포 식별자 미확인 | Chrome, 1920px·390×844·320×700 | 기존 Mate 테스트 계정, 회사 미가입 | Codex |

## 선행 조건·범위

- 로컬 HTTPS 인증서와 백엔드 허용 Origin, Google OAuth 반환 설정이 준비된 환경이다. 공개 Vercel 테스트 사이트는 이번 검증 범위에 포함하지 않았다.
- Figma의 회사 메뉴, 계정 관리, 서비스 이용안내, 의견 보내기는 개발자 승인에 따라 `준비 중`으로 비활성 표시한다. 이 화면에서는 회사명이나 회사 데이터를 조회하지 않는다.
- `/my` 자체의 새 데이터 조회 API는 없다. 세션 확인 API와 이미 구현된 알림 설정 화면으로의 이동을 실제 백엔드와 검증했다.
- 브라우저에서 화면 캡처를 확인하고 Network 이벤트의 경로·HTTP 상태만 기록했다. 이메일, access token, 쿠키, 응답 본문은 보관하지 않았다.

## 테스트 항목

### MSET-01 — 로그인 상태의 첫 화면

- Figma node: `3139:52490`
- 화면 경로: `/my`
- API: `POST /api/v1/auth/token/refresh`
- 준비 데이터: 기존 Mate 테스트 계정 로그인 세션
- 조작: `/my`를 열고 새로고침한다.
- 예상 결과: 세션 API 200 후 제목·메뉴 6개·카드 3개·의견 배너가 표시된다. 회사명은 임의로 만들지 않는다.
- 상태: `통과`
- 환경/증거: Chrome 1920px, refresh 200. 제목 `x378/y94`, 카드 `x370/y214`, 배너 `x370/y438`로 Figma의 주요 위치와 일치했다.

### MSET-02 — 미구현 항목 비활성

- Figma node: `3139:52490`
- 화면 경로: `/my`
- API: `없음`
- 준비 데이터: 로그인 세션
- 조작: 회사 메뉴·계정 관리·서비스 이용안내·의견 보내기 상태를 확인한다.
- 예상 결과: 미구현 메뉴 4개와 의견 보내기 버튼이 disabled이며, 두 카드는 링크가 아니라 `준비 중` 안내를 표시한다.
- 상태: `통과`
- 환경/증거: Chrome 접근성 트리에서 메뉴 4개와 의견 보내기 버튼 disabled, 카드 2개 비링크 표시 확인.

### MSET-03 — 알림 설정 카드 이동

- Figma node: `3139:52510`
- 화면 경로: `/my` → `/my/settings/notifications` → `/my`
- API: `GET /api/v1/me/notification-email-settings`, `GET /api/v1/me/matched-bid-notice-email-settings`
- 준비 데이터: 로그인 세션과 기존 설정
- 조작: 알림 설정 카드를 누르고, 해당 화면의 마이페이지 breadcrumb로 돌아온다.
- 예상 결과: 설정 화면으로 이동해 두 조회 API가 200으로 응답하며 `/my` 복귀가 동작한다.
- 상태: `통과`
- 환경/증거: Chrome URL 이동 및 두 GET 200 확인. React 개발 모드의 중복 GET은 같은 결과로 관찰했다.

### MSET-04 — 로그아웃과 비로그인 안내

- Figma node: `3139:52522`
- 화면 경로: `/my` → `/auth?mode=login&next=%2Fmy`
- API: `POST /api/v1/auth/logout`
- 준비 데이터: 로그인 세션
- 조작: 왼쪽 로그아웃을 누르고 비로그인 안내의 로그인 버튼을 누른다.
- 예상 결과: 로그아웃 API 200, `/my`에서 로그인 안내 표시, 로그인 링크가 `/my` 복귀 경로를 보존한다.
- 상태: `통과`
- 환경/증거: Chrome에서 logout 200, 로그인 안내, URL의 `next=%2Fmy` 확인.

### MSET-05 — Google 로그인 뒤 복귀

- Figma node: `3139:52490`
- 화면 경로: `/auth?mode=login&next=%2Fmy` → `/my`
- API: 기존 Google OAuth 및 로그인 세션 완료 API
- 준비 데이터: 기존 Mate 테스트 계정
- 조작: 로그인 화면에서 Google로 로그인을 누른다.
- 예상 결과: OAuth callback 뒤 `/my`로 돌아와 설정 화면이 다시 표시된다.
- 상태: `통과`
- 환경/증거: Chrome에서 `/auth/callback?returnTo=/my`를 거쳐 `/my` 및 로그인 메뉴 표시 확인. OAuth Network 본문이나 계정 식별자는 기록하지 않았다.

### MSET-06 — 모바일 배치

- Figma node: `3139:52490`의 데스크톱 디자인을 모바일로 조정
- 화면 경로: `/my`
- API: `없음` (MSET-01의 세션 유지)
- 준비 데이터: 로그인 세션
- 조작: Chrome viewport를 390×844와 320×700으로 바꿔 메뉴·카드·배너를 확인하고 기본 크기로 복원한다.
- 예상 결과: 세 카드가 한 열로 표시되고 메뉴와 배너를 사용할 수 있으며 가로 넘침이 없다.
- 상태: `통과`
- 환경/증거: 390px에서 문서 너비 375px, 카드 너비 343px; 320px에서 문서 너비 305px, 카드 너비 273px. 브라우저 스크롤바를 제외한 화면 폭을 넘지 않았다.

### MSET-07 — 세션 연결 실패와 재시도

- Figma node: `3139:52490`의 오류 상태 조정
- 화면 경로: `/my`
- API: `POST /api/v1/auth/token/refresh`
- 준비 데이터: 유효한 로그인 cookie, 브라우저에서 해당 요청만 임시 차단
- 조작: refresh 요청을 차단하고 새로고침한 뒤, 차단을 해제해 `다시 시도하기`를 누른다.
- 예상 결과: 연결 실패 동안 로그인 상태 오류가 표시되고, 재시도 후 설정 화면이 복원된다.
- 상태: `통과`
- 환경/증거: Chrome DevTools 요청 차단으로 오류 안내·재시도 버튼 확인; 차단 해제 후 `/my` 설정 화면 복귀. 요청 차단 설정은 제거했다. 실제 서버 5xx 응답은 재현하지 않았다.

## 실행 결과 요약

- 통과/실패/차단/대기: `7/0/0/0`
- 남은 범위: 계정 관리·서비스 이용안내·의견 보내기·회사 메뉴는 각 화면의 정책/API가 준비되면 별도 기능과 펀치리스트로 구현한다.
- 최종 판정: `2026-09-28, 이번 /my 첫 화면 범위 통과`. 공통 가입·알림 수신 이메일 등 다른 기능의 대기 항목은 각 문서에서 유지한다.

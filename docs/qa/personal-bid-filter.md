# 개인 맞춤 입찰 필터 브라우저 통합 테스트

## 기준

- Figma: [01_입찰공고리스트 2201:18147](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2201-18147), ‘내 맞춤’ 적용 2991:111897
- 화면: `/bids?view=all` 또는 `/bids`의 개인 필터 버튼·조건 표시
- API: [테스트 Swagger](https://api-test.mate-bid.com/swagger-ui/index.html)의 `GET|PUT /api/v1/bid-notice-filters/current`, `POST /api/v1/bid-notice-filters/current/reset`, 공개 `GET /api/v1/bid-notices?view=ALL`
- 정책: `mate-docs` ADR-0014. 조회 우선순위 `SAVED > COMPANY_DEFAULT > EMPTY_DEFAULT`, 초기화는 빈 `SAVED` snapshot을 남겨 회사 기본값을 다시 적용하지 않는다. 키워드·목록 view·페이지는 계정 저장 대상이 아니다.
- 구현 범위: 개인 필터 조회·수동 적용·명시적 저장·초기화·버전 충돌. `import-company`와 별도 맞춤공고 목록은 후속 작업.

## 실행 환경

| 실행일시 | 프론트 | 백엔드 | 브라우저 | 계정·데이터 | 수행자 |
| --- | --- | --- | --- | --- | --- |
| 2026-09-28 16:10~16:19 KST | `https://local.mate-bid.com:3000`, 현재 작업 트리 | `https://api-test.mate-bid.com`, 배포 ID 미확인 | Chrome 데스크톱 1920px | 승인된 Mate 테스트 계정, 공개 공고 0건 | Codex |

비밀값, OAuth URL, 쿠키, 토큰, 응답의 개인정보는 기록하지 않는다. 테스트 계정은 처음 `EMPTY_DEFAULT`였고, 저장·초기화 실험 후 **빈 `SAVED` snapshot** 상태가 되었다. 테스트 전 상태로 완전히 되돌리는 API는 없다.

이번 실행에서 관찰한 비식별 API 결과: `GET /current`는 처음 `EMPTY_DEFAULT`를, 저장 후 재조회에서는 `SAVED`를 반환했다. `PUT /current`와 `POST /current/reset`은 변경된 snapshot을 반환했고, 오래된 `expectedVersion`의 `PUT`은 HTTP 409였다. 공개 `GET /bid-notices?view=ALL`은 복수 유형·지역과 금액 조건을 받았지만 결과는 0건이었다. 화면 캡처와 Network 원본 파일은 이번 실행에서 보관하지 않았고 백엔드 배포 식별자도 확보하지 못했다. 아래 관찰 결과는 후속 재검증의 참고 자료이며, 공통 QA 규칙에 필요한 식별자·캡처·비식별 Network 증거를 갖추기 전까지 각 case를 `통과`로 판정하지 않는다.

### 2026-09-29 재검증 시도와 차단 사항

- 08:29~08:37 KST, `https://local.mate-bid.com:3000`의 로컬 개발 서버에서 재시도했다. 프론트 Git 기준점은 `71a109975f12a38ddf6e84a118389308c3321241`이며 **미커밋 작업 트리**이므로 이 SHA만으로 실행 코드를 특정할 수 없다. 맞춤 버튼 파일 `src/components/bids/bid-filter-toolbar.tsx`의 SHA-256은 `91b66ee6f92c793f5cd1e9f46425fcc8e7a852f62c6ec97fa25dd7607f541cde`다. 테스트 백엔드의 배포 식별자는 여전히 확인되지 않았다. GitHub `mate-backend`의 `main` SHA `a12b76ba701e5fea68bffe088239ba7c3c851a65`는 **소스 기준**이지 테스트 서버 배포 버전이 아니다.
- 비로그인 Chrome 1920×872와 Safari에서 `/bids`의 ‘내 맞춤’을 선택하면 `/auth?mode=login&next=%2Fbids`로 이동했다. Chrome 화면은 이번 세션에서 캡처했으나 영구 파일로 보관하지 못했다. 따라서 PBF-01의 공통 증거 요건은 아직 충족하지 못했다.
- Safari에서 ‘Google로 로그인’을 선택하면 Google 계정 선택 화면에 도달하기 전, `GET /api/v1/auth/oauth/google/authorizations?returnTo=%2Fbids`에 `OAUTH_REQUEST_INVALID` JSON이 표시됐다. 같은 시작 endpoint를 직접 HTTP 요청해도 `returnTo` 없음·`%2Fbids`·`/bids` 모두 HTTP 400과 같은 코드였다. 직접 요청은 브라우저 Origin/CORS 검증의 증거로 사용하지 않고, `returnTo` 한 형태만의 문제가 아님을 좁히는 진단으로만 사용한다. Chrome의 별도 자동화 탭에서는 외부 이동이 `ERR_BLOCKED_BY_CLIENT`로 끝났으므로 그 결과로 백엔드 동작을 판정하지 않는다.
- 당시 확인한 [백엔드 `main`의 `GoogleOAuthController.authorize`](https://github.com/mate-pjt/mate-backend/blob/a12b76ba701e5fea68bffe088239ba7c3c851a65/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/auth/oauth/GoogleOAuthController.kt)와 [서비스의 `start` 함수](https://github.com/mate-pjt/mate-backend/blob/a12b76ba701e5fea68bffe088239ba7c3c851a65/mate-api/src/main/java/kr/co/mate/mate_api/application/service/auth/oauth/GoogleOAuthService.kt)에는 이 오류 분기가 없었다. 이후 테스트 배포 브랜치인 `dev`의 MAT-234 변경에서 필수 `returnOrigin` 검증을 확인했으므로, 위 `main` 기반 원인 추정과 서버 로그 선행 요청은 현재 결론이 아니다. 실제 테스트 서버 실행 SHA는 여전히 미확인이다.
- 수정된 프론트로 같은 로컬 HTTPS Chrome에서 Google 신규 가입과 기존 계정 재로그인 후 `/bids?view=recommended` 복귀를 확인했다. OAuth 시작 차단은 해소됐으나 PBF-02~08의 필터 조작 자체는 재실행하지 않았다. PBF-02의 최초 `EMPTY_DEFAULT`는 기존 테스트 계정이 빈 `SAVED` 상태가 되어 재현할 수 없으므로 새 테스트 계정 또는 백엔드 fixture가 필요하다. 각 재실행에는 프론트 코드 식별자, 백엔드 배포 ID, 캡처 파일, 비식별 Network 요약을 함께 남긴다.

## 사례

| ID | 조작과 API | 예상 결과 | 상태·증거 |
| --- | --- | --- | --- |
| PBF-01 | 로그아웃 상태에서 `/bids`의 ‘내 맞춤’ 선택 | `/auth?mode=login&next=%2Fbids`로 이동 | 대기. 9/29 Chrome·Safari 주소 이동 재관찰; 캡처 파일·프론트 실행 식별자 보완 필요 |
| PBF-02 | Google 로그인 후 `/bids` 복귀, `GET /api/v1/bid-notice-filters/current` | 저장 조건이 없으면 `EMPTY_DEFAULT`, 적용 버튼 비활성 | 대기. OAuth 시작 차단 해소; 9/28 관찰 증거 보완 및 새 계정/fixture 필요 |
| PBF-03 | 현재 공사 필터를 ‘내 맞춤에 저장’, `PUT` 후 새로고침 `GET` | `SAVED`가 유지되고 계정 초기화 버튼 표시 | 대기. OAuth 시작 차단 해소; 9/28 관찰 증거 보완 필요 |
| PBF-04 | 저장 조건을 ‘내 맞춤’으로 적용, 공개 `GET /api/v1/bid-notices?view=ALL` | `/bids?personal=1&bidTypes=CONSTRUCTION`, 현재 목록에만 적용 | 대기. OAuth 시작 차단 해소; 9/28 빈 API 결과 관찰 증거 보완 필요. 실제 공고 행 매칭은 PBF-10에서 별도 확인 |
| PBF-05 | 팝업 ‘저장’으로 공사→용역 변경 후 ‘내 맞춤’ 재선택 | 팝업은 계정 PUT 없이 현재 URL만 `SERVICE`로 변경, 재적용 시 계정의 `CONSTRUCTION` 복구 | 대기. OAuth 시작 차단 해소; 9/28 관찰 증거 보완 필요 |
| PBF-06 | 두 유형·두 지역·기초금액 직접 범위가 든 URL을 열고 계정 저장·재조회·적용 | 반복 query와 정확한 금액이 그대로 보존 | 대기. OAuth 시작 차단 해소; 9/28 `CONSTRUCTION`,`SERVICE`,`41`,`48`, 1억~5억 원 재적용 관찰 증거 보완 필요 |
| PBF-07 | 계정 초기화 확인창에서 `POST /reset`, 이후 현재 조건 초기화 | 계정은 빈 `SAVED`, 현재 목록은 초기화 전까지 유지, 별도 초기화로 URL 제거 | 대기. OAuth 시작 차단 해소; 9/28 관찰 증거 보완 필요 |
| PBF-08 | 두 탭이 같은 버전을 읽고 첫 탭이 PUT, 둘째 탭이 오래된 `expectedVersion`으로 PUT | 둘째 탭은 409, 최신 snapshot 재조회, 덮어쓰기 없음 | 대기. OAuth 시작 차단 해소; 9/28 관찰 증거 보완 필요 |
| PBF-09 | 회사 가입 계정에서 `COMPANY_DEFAULT` 읽기·적용·명시적 저장 | GET은 쓰지 않고, 저장 시 `SAVED` 생성 | 대기. 회사 fixture 없음 |
| PBF-10 | 실제 공개 공고가 있는 환경에서 다중 지역·업종·날짜·금액·지역 업체·공동도급 조건 적용 | 목록 행과 총건수가 모든 서버 조건에 일치 | 대기. 테스트 서버 공개 공고 0건. 날짜·지역 업체·공동도급의 실제 서버 매칭도 이때 확인 |
| PBF-11 | 개인 필터 GET/PUT/reset 네트워크 실패와 401, UI 재시도 | 공개 목록은 유지, 개인 필터 오류 안내 및 안전한 재시도 | 대기. 오류 재현 환경 필요 |
| PBF-12 | 390/320px·키보드에서 버튼·조건 칩·초기화 대화상자 조작 | 가로 넘침 없이 조작 가능, 포커스·Escape 확인 | 대기. 데스크톱에서 대화상자 첫 버튼 포커스·Tab 이동·Escape 닫기·원래 버튼 포커스 복귀를 관찰했으나 모바일은 미실행 |

## 범위·후속 작업

- `POST /api/v1/bid-notice-filters/current/import-company`는 회사 계정 fixture 및 덮어쓰기 시나리오를 정한 뒤 연결한다.
- ‘나를 위한 맞춤 입찰공고’ 별도 탭은 대응 목록 API가 확인되면 별도 기능으로 구현한다. 현재 개인 필터는 `view=ALL`에만 수동 적용한다.
- 기존 팝업에서 직접 지정 날짜·금액, 복수 지역·업종, `regionOnly`, `jointContract` 편집은 아직 제공하지 않는다. 서버에서 읽은 해당 값은 목록 조회·재저장 시 보존하고 조건 칩에 모두 표시한다. 완전한 편집 UX는 Figma·정책 확인 후 별도 범위로 진행한다.
- 08:30 맞춤 이메일 내용 반영은 메일 fixture와 다음 발송 시점이 필요해 이 검증에서 제외한다.

## 판정

**0건 통과·12건 대기.** PBF-01~08의 9/28 조회·저장·적용·초기화·충돌 관찰은 공통 QA 증거가 부족해 정식 통과로 기록하지 않는다. 9/29 오전 OAuth 시작 오류를 수정하고 가입·재로그인까지 확인했지만 PBF-02~08 필터 조작은 재실행하지 않았다. PBF-09~12의 회사 기본값·공고 데이터 매칭·오류·모바일은 미실행이다. 재검증 시 백엔드 배포 식별자와 현재 프론트 상태를 특정하고, 화면 캡처 및 비식별 Network 요약을 남긴다.

# 알림 설정 공고 목록 브라우저 통합 테스트

## 기준

- Figma 진입 메뉴: [9.0.0 마이페이지, 3139:52490](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.0?node-id=3139-52490). 목록 화면의 정확한 node ID와 탭·표시 항목은 구현 전에 다시 확인한다.
- 화면/경로: `/my`의 ‘알림 설정 공고’ 메뉴에서 진입할 예정. 목록 경로는 구현 시 확정한다.
- 현재 API: [`GET /api/v1/me/bid-notice-alerts`](https://api-test.mate-bid.com/swagger-ui/index.html#/account-bid-notice-alert-controller/getPage). `category`는 `GENERAL|CORRECTED|CLOSED|RESULT_COMPLETED` 중 하나가 필수이며 `page`·`size`를 받는다.
- 근거: 2026-09-28 GitHub `mate-backend` `main` [`a12b76b`의 분류 조건](https://github.com/mate-pjt/mate-backend/blob/a12b76ba701e5fea68bffe088239ba7c3c851a65/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/bidnoticealert/AccountBidNoticeAlertCategoryConditionFactory.kt#L25-L40). `GENERAL`은 다른 세 분류를 제외한 공고이고, 응답의 `counts.total`은 전체 건수일 뿐 전체 목록이 아니다.
- 구현·실제 브라우저 통합 상태: 백엔드 계약 대기. 프론트 화면과 API 호출은 아직 구현하지 않았다.

## 선행 조건·차단 사항

- 담당: 백엔드. 전체 분류 공고를 **서버에서 하나의 정렬·페이지 기준으로** 조회할 수 있는 계약(`category=ALL` 또는 동등한 별도 API)이 필요하다. `totalElements`·`totalPages`·분류별 `counts`의 의미와 정렬 기준도 확인한다. 네 분류의 각 페이지를 브라우저에서 합쳐 전체 페이지로 표시하지 않는다.
- 담당: 프론트. 백엔드 작업 완료 후 GitHub 최신 기본 브랜치·테스트 Swagger·실제 테스트 서버 반영을 다시 확인하고, Figma 목록 화면의 정확한 node ID와 경로를 정한 뒤 구현한다.
- 담당: 테스트 환경. 로그인된 테스트 계정에 서로 다른 분류의 활성 알림 설정 공고가 있어야 전체·분류별 목록과 페이지 이동을 검증할 수 있다. 데이터가 없다면 빈 상태만 확인하고 나머지 항목은 대기한다.

## 실행 환경 기록

| 실행일시 | 프론트 URL·배포/commit | 백엔드 URL·배포 | 브라우저·화면 크기 | 테스트 계정/데이터 별칭 | 수행자 |
| --- | --- | --- | --- | --- | --- |
| 미실행 | 미구현 | 테스트 서버 반영 대기 | 미정 | 분류별 공고 미준비 | 미정 |

## 후속 검증 항목

### MBAL-01 — 전체 목록

- Figma node: 목록 화면 확인 후 기록
- 화면 경로: 구현 시 확정
- API: 백엔드에서 제공할 전체 목록 조회 계약
- 준비 데이터: 두 분류 이상에 걸친 활성 알림 설정 공고
- 조작: 로그인 후 ‘알림 설정 공고’에 들어가 전체 목록을 조회한다.
- 예상 결과: 모든 분류의 공고가 서버 정렬 순서에 따라 한 목록으로 나타나고, 페이지·전체 건수가 일치한다.
- 상태: `차단` — 백엔드 전체 목록 계약·반영 대기
- 환경/증거: 미실행

### MBAL-02 — 분류별 목록·건수

- Figma node: 목록 화면 확인 후 기록
- 화면 경로: 구현 시 확정
- API: `GET /api/v1/me/bid-notice-alerts?category=GENERAL|CORRECTED|CLOSED|RESULT_COMPLETED`
- 준비 데이터: 분류별 활성 알림 설정 공고
- 조작: 각 분류를 선택하고 목록·건수를 확인한다.
- 예상 결과: 각 공고는 백엔드 분류에 맞는 목록에만 나타나며, 화면 건수와 응답 `counts`가 일치한다.
- 상태: `대기` — 전체 목록 계약 완료 후 함께 구현·검증
- 환경/증거: 미실행

### MBAL-03 — 페이지·빈 결과·로그인·오류

- Figma node: 목록 화면 확인 후 기록
- 화면 경로: 구현 시 확정
- API: 전체 또는 분류별 목록 조회, 로그인 세션 API
- 준비 데이터: 2페이지 이상인 계정과 빈 결과 계정 또는 재현 가능한 상태
- 조작: 페이지를 이동하고, 빈 결과·비로그인·조회 실패에서 화면의 안내와 재시도를 확인한다. 모바일·키보드 조작도 확인한다.
- 예상 결과: 항목의 누락·중복이 없고 상태별 안내가 구분되며, 로그인 후 목록으로 복귀한다.
- 상태: `대기` — 화면·계약 구현 후 실행
- 환경/증거: 미실행

## 실행 결과 요약

- 통과/실패/차단/대기: `0/0/1/2`
- 남은 결함과 담당자: 백엔드 전체 목록 조회 계약·테스트 서버 반영 대기. 완료 후 최신 명세로 예상 결과를 다시 확정한다.
- 최종 판정: `미구현·미실행`

# 메이트 v0.1 실행계획 · WBS

> 현재 상태의 단일 기준 문서. 작업 상태를 바꿀 때 이 표와 현재/다음 작업을 함께 갱신한다. 작업별 파일은 상세 범위·체크포인트·증거를 보존한다.

| 확인할 것 | 현재 값 |
| --- | --- |
| 갱신일 | 2026-11-26 KST |
| 현재 작업 | — |
| 다음 작업 | [DEV-01 · 정식 약관 본문·동의 버전 연결](tasks/DEV-01.md#dev-01-20261126-resume) · P0, 실제 정식 동의 재개 조건 확인 |
| 다음 첫 행동 | 대상 환경의 원문별 서버 동의 버전, 실행 식별자와 합성 신규 가입의 변경·정리 범위를 대조한다. [DEV-01 재개 조건](tasks/DEV-01.md#dev-01-20261126-resume) |
| DEV-01 URL 우선 연결 | 사용자가 `anyone/writer`인 현행 문서 주소를 우선 사용하도록 승인했다. 원문과 서버 적용 버전의 대응 및 실제 신규 가입 QA는 별도 확인이 필요하다. [사용자 결정](tasks/DEV-01.md#dev-01-20261126-link-release) · [인증 QA](../../qa/auth.md#dev-01-20261126-url-qa) · [검증·리뷰](reviews/DEV-01.md) |
| POL-01 정책 확정 | 두 승인 원문과 가입 동의 범위, 문서의 시행일 별도 관리, 푸터 시안과 고객문의 공개값을 확정했다. 정책 확정 당시 DEV-01 공개 연결에는 문서 권한과 정식 버전 대응 확인이 남았다. [정책](tasks/POL-01.md#pol-01-approved-policy) · [인증 QA](../../qa/auth.md#pol-01-approved-auth-qa) · [검증·리뷰](reviews/POL-01.md#pol-01-final-policy-review) |
| POL-01 재개 점검 이력 | PR #131에서 기존 테스트 계정의 이관·재동의 제외와 당시 승인 자료 확인 범위를 기록했다. [당시 답변과 남은 확인](tasks/POL-01.md#pol-01-20261126-decisions) · [당시 검증·리뷰](reviews/POL-01.md#pol-01-20261126-review) |
| QA-13 재개 점검 | 수신처·인증의 현행 계약과 Node 합성 15건을 확인했다. 실제 실행 0건·신규 통과 0건·6건 차단과 기존 3통과·6대기를 보존한다. [NREC QA](../../qa/notification-email-recipient.md#qa-13-20261126-nrec) · [검증·리뷰](reviews/QA-13.md#qa-13-20261126-review) · [Git 전달 기준](tasks/QA-13.md#qa-13-20261126-delivery) |
| QA-12 재개 점검 | 맞춤 이메일 ON/OFF의 현행 계약과 Node 합성 검사를 확인했다. NSET-07은 실제 0통과·1차단을 유지한다. [설정 QA](../../qa/notification-settings.md#qa-12-20261126-nset) · [검증·리뷰](reviews/QA-12.md#qa-12-20261126-review) · [Git 전달 기준](tasks/QA-12.md#qa-12-20261126-delivery) |
| QA-11 재개 점검 | 목록·미확인 수·읽음의 현행 계약과 Node 합성 검사를 확인했다. 기존 실제 0통과·재검증 8차단을 유지하며 ALARM-04/05는 별도다. [알림 QA](../../qa/alarms.md#qa-11-20261125-alarms) · [검증·리뷰](reviews/QA-11.md#qa-11-20261125-review) · [Git 전달 기준](tasks/QA-11.md#qa-11-20261125-delivery) |
| QA-10 재개 점검 | DEV-63의 빈 SAVED 로컬 계약과 DEV-09 이후 목록의 읽기·URL 동선을 확인했다. 기존 실제 0통과·12차단을 유지한다. [개인 필터 QA](../../qa/personal-bid-filter.md#qa-10-20261125-filter) · [검증·리뷰](reviews/QA-10.md#qa-10-20261125-review) · [Git 전달 기준](tasks/QA-10.md#qa-10-20261125-delivery) |
| QA-09 재개 점검 | 공고별 알림의 단건 계약·해제 이력의 의미와 Node 계약 테스트를 확인했다. 실제 ALERT-01~08은 기존 0통과·8차단을 유지한다. [공고별 알림 QA](../../qa/bid-alert.md#qa-09-20261125-alert) · [검증·리뷰](reviews/QA-09.md#qa-09-20261125-review) · [Git 전달 기준](tasks/QA-09.md#qa-09-20261125-delivery) |
| QA-08 재개 점검 | 초대 수신의 소유 계약과 Node 계약 테스트를 확인했다. 기존 실제 AUTH-16 0통과·1차단과 초대 화면 AUTH-17 미실행을 유지한다. [인증 QA](../../qa/auth.md#qa-08-20261125-auth) · [검증·리뷰](reviews/QA-08.md#qa-08-20261125-review) · [Git 전달 기준](tasks/QA-08.md#qa-08-20261125-delivery) |
| QA-07 재개 점검 | 업로드·OCR·제안·등록의 소유 계약과 Node 계약 테스트를 확인했다. 기존 실제 AUTH-09~13 0통과·5차단과 문서 AUTH-17 미실행을 유지한다. [인증 QA](../../qa/auth.md#qa-07-20261125-auth) · [검증·리뷰](reviews/QA-07.md#qa-07-20261125-review) · [Git 전달 기준](tasks/QA-07.md#qa-07-20261125-delivery) |
| QA-06 재개 점검 | 번호 연결·등록과 가입 표시의 현행 계약, Node 계약 테스트를 확인했다. 기존 실제 AUTH-14/15 0통과·2차단을 유지한다. [인증 QA](../../qa/auth.md#qa-06-20261125-auth) · [검증·리뷰](reviews/QA-06.md#qa-06-20261125-review) · [Git 전달 기준](tasks/QA-06.md#qa-06-20261125-delivery) |
| QA-05 재개 점검 | 현재 계약·실제 비로그인 세션 응답과 격리 브라우저의 회사 시작 동선을 확인했다. 기존 실제 MCO 4통과·6차단과 AUTH-07/08 차단을 유지한다. [회사 QA](../../qa/my-company.md#qa-05-20261125-company) · [검증·리뷰](reviews/QA-05.md#qa-05-20261125-review) · [Git 전달 기준](tasks/QA-05.md#qa-05-20261125-delivery) |
| QA-03 재개 점검 | 실제 공개 상세 4개와 관련 공고·첨부 링크·404를 Chrome에서 대조했다. 기존 실제 1통과·8차단을 유지한다. [상세 QA](../../qa/bid-detail.md#qa-03-20261125-detail) · [검증·리뷰](reviews/QA-03.md#qa-03-20261125-review) · [Git 전달 기준](tasks/QA-03.md#qa-03-20261125-delivery) |
| QA-02 재개 점검 | 공개 목록 12조건과 Chrome 9개 상태를 대조했다. 기존 실제 10통과·6차단을 유지한다. [목록 QA](../../qa/bid-list.md#qa-02-20261125-list) · [검증·리뷰](reviews/QA-02.md#qa-02-20261125-review) · [Git 전달 기준](tasks/QA-02.md#qa-02-20261125-delivery) |
| QA-01 재개 점검 | 2026-11-25 실제 첫 9행과 수요기관 우선 표시를 재확인했다. 기존 4통과·5차단을 보존한다. [홈 QA](../../qa/home.md#qa-01-20261125-home) · [검증·리뷰](reviews/QA-01.md#qa-01-20261125-review) · [Git 전달 기준](tasks/QA-01.md#qa-01-20261125-delivery) |
| DEV-12 재개 Gate | 2026-11-25 사용자가 첫 구간 ‘1억 원 이하’, 빠른 선택 양끝 포함, 로컬 검증 선행과 실제 서버 QA 차단 보존을 확정했다. [결정과 설계](tasks/DEV-12.md#dev-12-brief) |
| DEV-12 검증과 Git 전달 | RESULT 범위를 연결하고 [브라우저 15건](../../qa/bid-list.md#dev-12-local-qa)과 [두 리뷰](reviews/DEV-12.md)를 통과했다. 실제 통합은 차단이다. 최종 head의 CI·리뷰·병합은 [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afeat%2Fdev-12-result-amount-filter)에서 확인한다. |
| QA-15 승인과 검증 | DEV-50의 FAQ 변경으로 착수했다. 홈·FAQ·공용 UI의 브라우저 기능 9건을 통과했다. 320px 홈의 기존 겹침과 지연 로드의 FAQ 경고를 기록했다. [실행 범위](tasks/QA-15.md#qa-15-verification) · [두 리뷰](reviews/QA-15.md) |
| QA-15 Git 전달 | 사용자 2026-11-25 승인 범위의 최종 head·CI·리뷰와 병합 결과는 [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Aqa%2Fqa-15-static-ui-regression)에서 확인한다. [전달 기준](tasks/QA-15.md#qa-15-delivery) |
| DEV-54 구현과 검증 | 정상 상세와 입찰 공용 오류의 DOM·접근성 트리 main을 각각 2개에서 1개로 정리했다. [상세 QA](../../qa/bid-detail.md#dev-54-local-qa) · [검토 기록](reviews/DEV-54.md) |
| DEV-54 Git 전달 | [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afix%2Fdev-54-bid-main-landmark)에서 최종 head 검사·리뷰·병합을 확인한다. [전달 기준](tasks/DEV-54.md#dev-54-close) |
| POL-28 결정과 검증 | 2026-11-24 사용자 D1로 운영 주소 적용을 보류했고 D2·D3로 C03 공통 그림과 공개 메타데이터 기준을 승인했다. [정책](tasks/POL-28.md#pol-28-contract) · [문서 검증과 리뷰](reviews/POL-28.md) · [DEV-53 재개 조건](tasks/DEV-53.md#dev-53-pol-28-handoff) |
| POL-28 Git 전달 | [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fpol-28-canonical-og-policy)에서 최종 head 검증·리뷰·병합을 확인한다. [전달 기준](tasks/POL-28.md#pol-28-delivery) |
| POL-27 이번 승인과 검증 | 2026-11-24 사용자가 백엔드 공식 공급원, 사용자 웹 조회 전용과 발행 글의 비로그인 열람을 승인했다. 목록·본문 정책의 [문서 검증과 두 리뷰](reviews/POL-27.md) 및 DEV-51·52 재개 조건을 기록했다. |
| POL-27 Git 전달 | 이번 승인 범위의 최종 head·CI·리뷰·정상 병합 상태는 [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fpol-27-mate-news-policy)에서 확인한다. [전달 기준](tasks/POL-27.md#pol-27-delivery) |
| DEV-50 승인과 검증 | 2026-11-24 사용자가 단일 개발·검증·두 리뷰와 Git 전달, 이번 PR의 Chromatic 월간 한도 예외를 승인했다. POL-26 공통 링크의 [S08 브라우저 QA 5건](../../qa/qna.md#dev-50-local-qa)이 통과했다. [검토 기록](reviews/DEV-50.md) |
| DEV-50 Git 전달 | [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afeat%2Fdev-50-feedback-link)에서 최종 head의 CI·리뷰와 main 반영을 확인한다. [전달 기준](tasks/DEV-50.md#dev-50-delivery) |
| POL-26 결정과 이번 승인 | 2026-11-24 사용자 D1/D2로 설정·FAQ의 공통 의견 폼을 지정했고 D3로 링크 정책까지 마무리한다. 이번 문서 검증·두 리뷰·Git 전달과 이 PR의 Chromatic 월간 한도 예외를 승인했다. [결정](tasks/POL-26.md#pol-26-contract) · [작업 범위](tasks/POL-26.md#pol-26-brief) |
| POL-26 Git 전달 | [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fpol-26-feedback-channel-policy)에서 최종 head의 CI·리뷰와 main 반영을 확인한다. [전달 기준](tasks/POL-26.md#pol-26-delivery) |
| POL-25 결정과 이번 승인 | 2026-11-24 사용자가 실제 웹 배포 버전 팝업과 공식 출처·갱신 책임·조회 실패 기준의 DEV-49 선행을 확정했다. 이번 정책 문서 검증·두 리뷰와 Git 전달, 해당 PR의 Chromatic 월간 한도 예외를 승인했다. [결정](tasks/POL-25.md#pol-25-contract) · [적용 범위](tasks/POL-25.md#pol-25-brief) |
| POL-25 Git 전달 | [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fpol-25-service-guide-policy)에서 최종 head의 CI·리뷰와 main 반영을 확인한다. [전달 기준](tasks/POL-25.md#pol-25-delivery) |
| POL-24 결정과 이번 승인 | 기존 중앙 ADR의 Google 단독 지원과 O02 네이버 ‘준비 중’ 비활성을 적용했다. 2026-11-23 사용자가 문서 검증·두 리뷰·Git 전달과 이번 PR의 Chromatic 월간 한도 예외를 승인했다. [정책 근거](tasks/POL-24.md#pol-24-contract) · [착수](tasks/POL-24.md#pol-24-brief) |
| POL-24 Git 전달 | [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fpol-24-naver-login-policy)에서 최종 head의 검사·리뷰와 `main` 반영을 확인한다. [전달 기준](tasks/POL-24.md#pol-24-delivery) |
| DEV-47 이번 승인·검증 | 2026-11-23 사용자가 개발·검증·두 리뷰, Git 전달·조건부 정상 병합·로컬 fast-forward와 이번 Chromatic 월간 한도 예외를 승인했다. [Brief](tasks/DEV-47.md#dev-47-brief) · [로컬 BKEY 8통과](../../qa/bid-list.md#dev-47-local-qa) |
| DEV-47 Git 전달 | [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afeat%2Fdev-47-recent-bid-searches)의 최종 head에서 검사·리뷰와 main 반영을 확인한다. [전달 기준](tasks/DEV-47.md#dev-47-delivery) |
| POL-23 이번 결정과 승인 | 2026-11-23 사용자가 탭 메모리 최근 검색어, 관리형 추천 검토 조건과 L04 화면 예외를 결정했다. 이번 문서 검증·두 리뷰·Git 전달과 Chromatic 월간 한도 예외를 승인했다. [승인](tasks/POL-23.md#pol-23-brief) |
| POL-23 Git 전달 | 최종 head의 검사·리뷰·정상 main 반영은 [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fpol-23-search-term-policy)에서 확인한다. [전달 기록](tasks/POL-23.md#pol-23-delivery) |
| DEV-66 이번 승인 | 2026-11-23 사용자가 단일 개발·검증·두 리뷰, 목적별 Git 전달·조건부 정상 병합·로컬 fast-forward 및 이번 Chromatic 월간 한도 예외를 승인했다. [Brief](tasks/DEV-66.md#dev-66-brief) |
| DEV-66 Git 전달 | [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afeat%2Fdev-66-notification-settings)의 최종 head에서 CI·리뷰 및 main 반영을 확인한다. [전달 기록](tasks/DEV-66.md#dev-66-delivery) |
| DEV-64 이번 승인과 Git 전달 | 2026-11-23 사용자가 단일 개발·검증·두 리뷰·Git 전달과 해당 PR의 Chromatic 월간 한도 예외를 승인했다. [Brief](tasks/DEV-64.md#dev-64-brief) · [PR 최종 head 확인](tasks/DEV-64.md#dev-64-delivery) |
| POL-22 이번 결정과 승인 | 2026-11-23 사용자는 확인 뒤 전체 교체·별도 목록 적용, 권한 경계 확인 전 노출 보류, 전부 결측이면 기존 값 보존을 확정했다. 문서 검증·두 리뷰·Git 전달과 이번 PR의 Chromatic 월간 한도 예외를 승인했다. [결정](tasks/POL-22.md#pol-22-brief) · [정책](tasks/POL-22.md#pol-22-contract) |
| POL-22 Git 전달 | [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fpol-22-company-filter-import-policy)에서 최종 head의 검사·리뷰·main 병합을 확인한다. [전달 기준](tasks/POL-22.md#pol-22-delivery) |
| POL-21 이번 결정과 승인 | 사용자가 2026-11-20 양쪽 가입 경로의 선택 입력, 등록과 보정의 공동 저장, 같은 등록 화면의 입력 보존을 확정했다. 문서 검증·두 리뷰·Git 전달과 해당 PR의 Chromatic 월간 한도 예외를 승인했다. [결정](tasks/POL-21.md#pol-21-brief) · [전달 기준](tasks/POL-21.md#pol-21-delivery) |
| DEV-43 이번 승인 | 2026-11-20 사용자가 이번 개발·검증·두 리뷰, Git 전달·정상 병합·로컬 fast-forward를 승인했다. 추가 답변의 간단한 실행 범위로 응답 단절 전용 대응과 검증을 제외하고 기존 수동 삭제 계약을 연결한다. 이번 PR의 Chromatic 월간 한도에만 예외를 적용한다. [결정](tasks/DEV-43.md#dev-43-brief) |
| DEV-43 Git 전달 | [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afeat%2Fdev-43-alarm-deletion)의 최종 head에서 CI·리뷰·병합을 확인한다. [전달 기준](tasks/DEV-43.md#dev-43-delivery) |
| POL-20 이번 승인 범위 | 2026-10-22 받았던 수동 삭제 승인을 적용한다. 2026-11-20 사용자가 문서 검증과 두 리뷰, Git 전달·조건부 정상 병합·로컬 fast-forward 및 이번 PR의 Chromatic 월간 한도 예외를 승인했다. [Brief](tasks/POL-20.md#pol-20-brief) · [계약](tasks/POL-20.md#pol-20-contract) |
| POL-20 Git 전달 | [작업 브랜치의 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fpol-20-alarm-deletion-policy)에서 최종 head 검증·리뷰와 병합을 확인한다. [전달 기준](tasks/POL-20.md#pol-20-delivery) |
| DEV-41 이번 승인 범위 | 2026-11-20 사용자가 mock·가이드 교정과 검증·두 리뷰, Git 전달·조건부 정상 병합과 로컬 fast-forward를 승인했다. 이번 PR의 Chromatic 월간 한도 예외가 적용된다. [Brief](tasks/DEV-41.md#dev-41-brief) |
| DEV-41 Git 전달 | [작업 브랜치의 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afix%2Fdev-41-notification-email-mock)에서 최종 head의 검증과 병합을 확인한다. [전달 기준](tasks/DEV-41.md#dev-41-delivery) |
| POL-19 이번 결정과 승인 범위 | 중앙 정책과 2026-11-11 사용자 화면 결정을 적용했다. 2026-11-20 사용자는 문서 검증·두 리뷰·Git 전달과 이번 PR의 Chromatic 월간 한도 예외를 승인했다. [범위](tasks/POL-19.md#pol-19-brief) · [정책](tasks/POL-19.md#pol-19-contract) |
| POL-19 Git 전달 | [작업 브랜치의 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fpol-19-notification-policy)에서 최종 head 검증과 병합을 확인한다. [전달 기준](tasks/POL-19.md#pol-19-delivery) |
| POL-18 이번 결정과 승인 범위 | 2026-11-20 사용자 답변은 회사·데이터 처리의 백엔드 책임을 확인하고, 탈퇴 인증 방식과 화면 예외를 보류했다. 문서 검증·두 리뷰·Git 전달 및 이번 PR의 Chromatic 월간 한도 예외가 적용된다. [답변과 범위](tasks/POL-18.md#pol-18-brief) |
| POL-18 Git 전달 | [작업 브랜치의 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fpol-18-withdrawal-policy)에서 문서 전달의 최종 head·CI·리뷰·병합을 확인한다. [전달 기준](tasks/POL-18.md#pol-18-delivery) |
| DEV-38 이번 승인 범위 | 사용자는 2026-11-20 기존 개발 QA 계정 직접 로그인·조회·새로고침·테스트 세션 로그아웃과 실제 응답 확인을 승인했다. 현재 실행 digest는 미확인으로 남기고 Git 전달을 진행한다. 이번 PR의 Chromatic 월간 한도만 예외다. [결정 기록](tasks/DEV-38.md#dev-38-brief) |
| DEV-38 Git 전달 | [작업 브랜치의 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afeat%2Fdev-38-account-settings)에서 최종 head 검사·리뷰·병합을 확인한다. [전달 기준](tasks/DEV-38.md#dev-38-delivery) |
| POL-17 이번 승인 범위 | 2026-11-20 사용자 D1으로 본인 연락용 이메일 조회 전용과 S02 이메일 ‘인증하기’ 생략을 확정했다. 이번 문서 검증·두 리뷰·목적별 Git 전달·조건부 정상 병합과 로컬 fast-forward, 이번 PR의 Chromatic 월간 한도 예외를 승인받았다. [착수 및 승인 기록](tasks/POL-17.md#pol-17-brief) |
| POL-17 Git 전달 | [작업 브랜치의 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fpol-17-account-policy)에서 최종 head·CI·리뷰·병합을 확인한다. [전달 기준](tasks/POL-17.md#pol-17-delivery) |
| QA-14 이번 승인 범위 | 2026-11-20 사용자가 QA-14 검증·두 리뷰와 목적별 Git 전달, 조건부 정상 병합 및 로컬 fast-forward를 승인했다. 월간 한도 예외는 이번 Chromatic 검사에 한한다. [착수 Brief](tasks/QA-14.md#qa-14-brief) |
| QA-14 Git 전달 | [작업 브랜치의 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Aqa%2Fqa-14-settings-regression)에서 최종 head·CI·리뷰·병합을 확인한다. [전달 기준](tasks/QA-14.md#qa-14-delivery) |
| DEV-34 이번 승인 범위 | 2026-11-20 사용자 결정으로 로컬 검증과 Git 전달을 먼저 진행하며 MERGE-01~04의 실제 QA 차단을 기록한다. 이번 PR의 Chromatic 월간 한도만 예외다. 구형 인증 사건 읽기 교정 1회와 재검증을 추가 승인했다. [Brief](tasks/DEV-34.md#dev-34-brief) |
| DEV-34 Git 전달 | [작업 브랜치의 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afeat%2Fdev-34-company-merge)에서 최종 head·CI·리뷰·병합을 확인한다. [종료와 전달 기준](tasks/DEV-34.md#dev-34-close) |
| POL-16 이번 승인 범위 | 2026-11-20 사용자 D1~D3로 현행 사건, 두 검토 단계와 자료 요약/일괄 선택, 실제 거절 사유 조회 선행을 확정했다. POL-16 문서 검증·두 리뷰·목적별 Git 전달·이번 PR의 Chromatic 월간 한도 예외만 적용한다. [Brief](tasks/POL-16.md#pol-16-brief) · [종료와 전달 기준](tasks/POL-16.md#pol-16-close) |
| POL-16 외부 요청 | D1으로 철회·재발송 백엔드 이슈 등록을 승인했다. Linear 무료 이슈 한도에 걸려 이슈 ID 없이 요청 내용과 재개 조건을 [기록](tasks/POL-16.md#pol-16-withdrawal)했다. |
| DEV-33 이번 승인 범위 | 2026-11-20 사용자 결정으로 로컬 구현·검증과 두 리뷰, 커밋·PR·정상 병합과 로컬 FF를 진행한다. 이번 PR의 Chromatic 월간 한도에만 예외를 적용한다. [Brief](tasks/DEV-33.md#dev-33-brief) · [실제 QA 재개 조건](../../qa/team-members.md#dev-33-local-qa) |
| DEV-33 Git 전달 | [작업 브랜치의 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afeat%2Fdev-33-invitation-destination)에서 최종 head·원격 CI·리뷰와 병합을 확인한다. [전달 기준](tasks/DEV-33.md#dev-33-close) |
| POL-15 이번 승인 범위 | 2026-11-18 사용자 D1으로 확인된 접근 범위에 따른 팀원 목록·나의 회사·공개 공고 이동을 확정했다. 문서 검증·두 리뷰·목적별 Git 전달·최종 head CI·정상 main 병합 및 로컬 FF, 이번 PR의 Chromatic 월간 한도 예외가 별도 승인됐다. [Brief](tasks/POL-15.md#pol-15-brief) · [결정](tasks/POL-15.md#pol-15-contract) |
| POL-15 Git 전달 | [PR #91](https://github.com/mate-pjt/mate-frontend/pull/91) 최초 head `735946a`, `type: docs`. 최종 head의 CI·리뷰·main 반영은 PR에서 확인한다. [전달 체크포인트](tasks/POL-15.md#pol-15-git-delivery) |
| DEV-32 이번 승인 범위 | 2026-11-18 사용자 요청의 단일 개발·검증·두 리뷰·목적별 Git 전달/정상 병합/로컬 FF와 추가 결정 ‘로컬 선행·실제 API QA 차단 보존’. 이번 Chromatic 월간 한도만 예외. [범위와 근거](tasks/DEV-32.md#dev-32-brief) |
| DEV-32 Git 전달 | [PR #90](https://github.com/mate-pjt/mate-frontend/pull/90), 최초 head `e117775`, feature/test/docs 라벨. 전달 기록 추가 뒤 최종 PR head의 CI·리뷰·정상 병합·로컬 FF는 실제 PR과 종료 보고에서 확인한다. [체크포인트](tasks/DEV-32.md#dev-32-git-delivery) |
| DEV-31 이번 승인 범위 | 2026-11-18 사용자 단일 Task 개발·검증/두 리뷰·목적별 commit/push·PR/최종 CI·정상 main 병합/로컬 FF. 추가 D1 로컬 선행·실제 API QA 차단 보존. 이번 Chromatic 월간 한도만 예외. 실제 업무 조회/승인·거절/메일·운영/배포·다음 Task 실행 제외. [Brief](tasks/DEV-31.md#dev-31-brief) |
| DEV-31 Git 전달 | [PR #89](https://github.com/mate-pjt/mate-frontend/pull/89), 목적별6커밋 최초 head45ee7e5·type: feature/test/docs. Git checkpoint 기록 뒤 최종 head CI·리뷰/정상 merge/main FF·동일 SHA/clean은 실제 PR/종료 보고에서 확인. [기록](tasks/DEV-31.md#dev-31-git-delivery) |
| DEV-30 이번 승인 범위 | 2026-11-17 사용자 단일 Task 개발·검증/두 리뷰·목적별 commit/push·PR/최종 CI·정상 merge/main FF. D1 로컬 선행/실제 QA 차단 보존·D2 초대 편집/PATCH 포함. 이번 Chromatic 월간 한도만 예외. 실제 업무/API/메일·수락/운영·배포·다음 Task 실행 제외. [Brief](tasks/DEV-30.md#dev-30-brief) |
| DEV-30 Git 전달 | [PR #88](https://github.com/mate-pjt/mate-frontend/pull/88), 목적별6커밋 최초 head212553d·type:feature/test/docs. 순수 Git 기록 뒤 최종 head CI/리뷰·정상 merge/main FF·동일 SHA/clean은 실제 PR/종료 보고에서 확인. [체크포인트](tasks/DEV-30.md#dev-30-git-delivery) |
| DEV-29 Git 전달 | [PR #87](https://github.com/mate-pjt/mate-frontend/pull/87), 목적별6커밋 최초 headbf5adaf·type:feature/refactor/test/docs. 순수 Git 기록 뒤 최종 head CI/리뷰·정상 merge/main FF·동일SHA/clean은 실제 PR/종료 보고에서 확인. [체크포인트](tasks/DEV-29.md#dev-29-git-delivery) |
| DEV-29 이번 승인 범위 | 2026-11-17 사용자 최초 단일 Task 개발·검증/두 리뷰·목적별 commit/push·PR·최종 CI·정상 merge/main FF, 추가 D1 로컬 선행·실제 QA7차단 보존. 이번 Chromatic 월간 한도만 예외. 실제 업무/API·초대/메일/수락·운영/배포·다음 Task 실행 제외. [Brief](tasks/DEV-29.md#dev-29-brief) |
| DEV-28 Git 전달 | [PR #86](https://github.com/mate-pjt/mate-frontend/pull/86), 목적별6커밋 최초 head338783b·라벨 feature/test/docs. 이 Git checkpoint 뒤 최종 head의 원격 CI/리뷰·정상 merge/main FF는 실제 PR/종료 보고에서 확인한다. [기록](tasks/DEV-28.md#dev-28-git-delivery) |
| DEV-28 이번 승인 범위 | 2026-11-17 사용자 단일 Task 개발·검증/두 리뷰·목적별 commit/push·PR/최종 CI·정상 merge/main FF, D1 로컬 선행/실제 QA 차단 보존·D2 정확 동의 경로/명시 결정 UX. 이번 Chromatic 월간 한도만 예외. 실제 업무 API/권한·소속 변경/메일·운영/배포·다음 Task 실행 제외. [Brief](tasks/DEV-28.md#dev-28-brief) |
| DEV-27 Git 전달 | [PR #85](https://github.com/mate-pjt/mate-frontend/pull/85), 목적별6커밋 최초 head03c3407·라벨 feature/test/docs. Git checkpoint 문서 반영 뒤 최종 head CI/리뷰·정상 merge/main FF에서 별도 확인하며 실제 QA 차단 유지. [기록](tasks/DEV-27.md#dev-27-git-delivery) |
| DEV-27 이번 승인 범위 | 2026-11-17 사용자 단일 Task 개발·검증/두 리뷰·목적별 commit/push·PR/최종 CI·정상 main 병합/로컬 FF. 추가 답변 로컬 선행·실제 API QA 차단 보존. 이번 Chromatic 월간 한도만 예외. 실제 업무/API·메일·운영/배포·다음 Task 실행 제외. [Brief](tasks/DEV-27.md#dev-27-brief) |
| POL-14 MAT-290 후속 승인 | 2026-11-17 사용자: POL-14/DEV-27/WBS 연결·미제공/재확인 조건·문서 검증/리뷰·목적별 commit/push·PR/최종 CI·정상 main 병합/로컬 main FF. DEV-27 구현/실제 업무 제외. [Brief/기존 동일 Task Chromatic 한도 예외 경계](tasks/POL-14.md#pol-14-mat-290-handoff) |
| POL-14 외부 요청 | [MAT-290](https://linear.app/mate-pjt/issue/MAT-290/backend-팀원-목록상세-응답에-생년월일휴대전화번호-추가) — 11/17 조회 Backlog. 팀원 목록/상세의 birthDate/mobilePhone 추가·nullable/형식/권한·실제 반영 확인 요청. 반영 전 D2 미제공 유지, 계약/실제 응답 확인 뒤 DEV-27 자체 Gate에서 표시 연결 판단. **DEV-27 전체의 신규 선행/차단 아님**. [재확인 조건](tasks/POL-14.md#pol-14-mat-290-handoff) |
| POL-14 이번 승인 범위 | 2026-11-16 사용자 최초 요청: 정책 조사/결정·문서 검증/두 리뷰·목적별 commit/push·PR/최종 CI·정상 main 병합/로컬 main FF. 이번 Chromatic 월간 한도만 예외. D1 현행 계약/동의·D2 미제공/행동별 안내·D3 만료후 새 초대 확정. 제품/실제 업무 API·초대/메일/권한/직급·중앙 저장소·운영/배포·다음 Task 실행 제외. [확정 Brief](tasks/POL-14.md#pol-14-brief) |
| DEV-25 이번 승인 범위 | 2026-11-16 사용자 최초 단일 Task 개발/검증·두 리뷰·목적별 commit/push·PR/최종 CI·정상 main 병합/로컬 main FF와 추가 D1 로컬 선행/실제 삭제·30일 파기 QA 차단 유지. 이번 Chromatic 월간 한도만 예외. 실제 업무 API/파일/OCR/삭제·worker·운영/배포·다음 Task 실행 제외. [Brief](tasks/DEV-25.md#dev-25-brief) |
| DEV-24 이번 승인 범위 | 2026-11-16 사용자 요청의 단일 Task·검증/두 리뷰·목적별 commit/push·PR/최종 CI·정상 병합/로컬 main FF와 추가 D1 ‘재업로드만 로컬 선행·신규 추가/실통합 차단’. 이번 Chromatic 월간 한도만 예외. 실제 업무 API/파일/OCR/삭제·외부 메시지·운영/배포·다음 Task 실행 제외. [Brief](tasks/DEV-24.md#dev-24-brief) |
| DEV-23 이번 승인 범위 | 2026-11-16 사용자 개발/검증·두 리뷰·목적별 commit/push·PR/최종 CI·정상 main 병합/로컬 FF, D1 로컬 선행/실제 API 차단 보존·D2 기본 뷰어/최근활동 준비 중. 이번 Chromatic 월간 한도만 예외. 실제 업무/원본·파일/OCR/삭제·운영/배포·다음 Task 실행 제외. [Brief](tasks/DEV-23.md#dev-23-brief) |
| DEV-22 이번 승인 범위 | 2026-11-16 사용자 요청의 개발/검증·두 리뷰·목적별 commit/push·PR/최종 CI·정상 main 병합/로컬 FF. 추가 D1 기존 버전 GET 조합·D2 로컬 선행/실서버 QA 차단 보존 확정. 이번 Chromatic 월간 한도만 예외. 실제 업무 API/파일/OCR/삭제·외부 메시지·운영/배포·다음 Task 실행 제외. [Brief](tasks/DEV-22.md#dev-22-brief) |
| POL-13 이번 승인 범위 | 2026-11-16 사용자: 정책 조사/결정·문서 검증/두 리뷰·목적별 commit/push·PR/최종 CI·정상 main 병합/로컬 FF. D1 현행 권한/날짜 구분·D2 전체 삭제/30일 비동기 파기·D3 지원/계약 대기 분리 확정. 이번 Chromatic 월간 한도만 예외. 제품/실제 업무 API·문서 처리·외부 메시지·운영/배포·다음 Task 실행 제외. [Brief/결정](tasks/POL-13.md#pol-13-brief) |
| POL-13 종료 당시 잔여 범위 | 당시 목록 기간 방식은 DEV-22 자체 Gate였고 이번 D1으로 기존 API 조합을 채택했다. 기존 회사 신규 문서 귀속/최종 교체·OCR 적용 계약과 MAT-162 기획 보류는 DEV-24/26 후속 조건이다. [원본 DBOX22 계획](../../qa/company-documents.md#pol-13-document-qa)의22미실행 이력을 보존하며 이번 DEV-22 후속은 실제0통과·8차단/다른14대기다. 이전 가입/회사 QA 차단/예외 유지 |
| POL-12 외부 요청 | [MAT-287](https://linear.app/mate-pjt/issue/MAT-287/backend-회사-정보-직접-편집프로필-사진-api-계약-보완): DEV-20의 주력 업종·주소·설립 연월, DEV-21의 회사 프로필 사진 계약을 요청. 11/16 댓글0·답변/일정 미확보. 지원 API 재사용·expectedVersion 설명 정정·OCR 별도 보류·재개 조건은 [후속 기록](tasks/POL-12.md#pol-12-mat-287-handoff) 참조. 당시 DOC-001을 충족한 POL-13 인계 근거는 보존 |
| POL-12 이번 승인 범위 | 2026-11-13 사용자: 정책 조사/결정·문서 검증/두 리뷰·목적별 commit/push·PR/최종 CI·정상 main 병합/로컬 FF. D1 선택행 반영·D2 지원 범위 분리/계약 선행·D3 Figma 배너/자료 기준 분리 확정. 이번 Chromatic 월간 한도만 예외. 제품/업무 API·중앙 repo 편집·메일/문서 처리·운영/배포·다음 Task 실행 제외. [Brief/승인](tasks/POL-12.md#pol-12-brief) |
| DEV-16 이번 승인 범위 | 2026-11-13 사용자: 개발/검증·두 리뷰·목적별 commit/push·PR/최종 CI·정상 main 병합/로컬 FF. 추가 답변 **로컬 선행·실서버 QA 차단 보존**, 이번 Chromatic 월간 한도만 예외. 실제 업무 API/등록·신청·문서 처리·운영/배포 제외. [Brief/근거](tasks/DEV-16.md#dev-16-brief) |
| POL-11 이번 승인 범위 | 2026-11-13 사용자: POL-11 정책 조사/결정·문서 검증·두 리뷰·목적별 commit/push·PR·최종 CI·정상 main 병합/로컬 FF. 재사용/설정 복귀 확정, Figma의 ‘통합 요청’ 유지·설명 추가 없음. 이번 Chromatic 월간 한도만 예외. 제품/업무 API·중앙 저장소 편집·메일/문서 처리·운영/배포·다음 Task 실행 제외. [Brief/결정](tasks/POL-11.md#pol-11-brief) |
| DEV-15 이번 승인 범위 | 2026-11-13 사용자: DEV-15 개발·검증/두 리뷰·목적별 commit/push·PR/최종 CI·정상 main 병합/로컬 FF. 로컬 선행·실서버 QA 차단 보존 답변과 이번 Chromatic 월간 한도 예외. 실제 업무 API/메일·문서 처리·운영/배포 제외. [Brief](tasks/DEV-15.md#dev-15-brief) |
| POL-10 이번 승인 범위 | 2026-11-13 사용자: POL-10 정책·문서 검증/두 리뷰·목적별 commit/push·PR/최종 CI·정상 main 병합/로컬 FF. 추천 흐름 확정·지정 Figma Sonner 완료 안내 요구. 이번 Chromatic 월간 한도만 예외. 제품/업무 API/중앙 저장소 편집·메일·문서 처리·운영/배포 제외. [결정/Brief](tasks/POL-10.md#pol-10-brief) |
| DEV-56 이번 승인 범위 | 2026-11-13 사용자: DEV-56 개발·검증/두 리뷰·목적별 commit/push·PR/최종 CI·정상 main 병합·로컬 FF, 이번 Chromatic 월간 한도 예외. 이름/결측·loading/error와 `/my` 로그아웃 확정. 실제 QA 자원/범위 제공 후 완료 선택 뒤 일반 실제 흐름·특수 실제 미검증 보존 방식 수락, Chrome local 로그인 직접 수행. [Brief/결정·후속 범위](tasks/DEV-56.md#dev-56-brief) |
| DEV-57 종료 인계 후속 승인 | 2026-11-13 사용자: 다음을 POL-10 대신 DEV-56 재개 요구사항 확인으로 변경하고 WBS/관련 기록에 반영. 기존 차단 유지·DEV-56 구현은 다음 대화. [승인 원문/범위](tasks/DEV-57.md#dev-57-next-dev-56-approval) |
| DEV-57 이번 승인 범위 | 2026-11-13 사용자: DEV-57 개발·검증·두 리뷰·목적별 commit/push·PR/최종 CI·정상 main 병합·로컬 main FF. nickname 결측/지연/오류 추천안 확정, Figma 2081:64659 별도 달력 생성/사용, 로컬 범위 완료·실제 QA 차단 보존. 이번 Chromatic 월간 한도만 예외. [Brief/결정](tasks/DEV-57.md#dev-57-brief) |
| 이번 문서 반영 승인 | 2026-11-13 사용자: 제안한 감사/Task·WBS/재개 규칙 반영·다음 DEV-57 재개 확인, 문서 검증/두 리뷰·commit/push/PR/최종 CI·정상 병합/main FF. 기존 차단/미결 정책 유지·DEV-57 구현은 다음 대화. [승인 원문](tasks/POL-09.md#pol-09-backend-replan-approval) |
| backend 계약 재확인 | [11/13 날짜별 재조사/고정 근거](audits/2026-11-13-backend-readiness.md): nickname·전역/야간 저장 설정·RESULT 낙찰금액 필드 확인. API 존재·배포 기록·실행 SHA·실제 통합은 별개. 과거403/필드 부재를 현재 사유로 반복하지 않으며 정책/실제 QA 차단은 유지 |
| POL-09 이번 승인 범위 | 2026-11-13 사용자: POL-09 정책·문서 검증/두 리뷰·목적별 commit/push·PR·최종 CI/정상 main 병합·로컬 동기화. 이번 Chromatic 월간 한도만 예외. 제품/다른 Task 실행·업무/중앙 문서/외부 메시지·운영/배포 제외. [조사/질문](tasks/POL-09.md#pol-09-investigation) |
| POL-08 이번 승인 범위 | 2026-11-13 사용자: POL-08 정책·문서 검증/두 리뷰·목적별 commit/push·PR·최종 CI/정상 main 병합·로컬 동기화. 이번 Chromatic 월간 한도만 예외. 제품/업무 API 변경·중앙 저장소 편집·외부 메시지·운영/배포·다음 Task 실행 제외. [조사/결정](tasks/POL-08.md#pol-08-investigation) |
| DEV-11 이번 승인 범위 | 2026-11-12 사용자 요청6항의 Git 전달·이번 Chromatic 한도 예외와 추가 답변 ‘로컬 선행·실서버 QA 차단 보존 (추천)’. 실제 업무/계정 변경·운영/배포·다음 Task 실행 제외. [Brief](tasks/DEV-11.md#dev-11-brief) |
| DEV-10 이번 승인 범위 | 2026-11-12 사용자: DEV-10 개발·검증·두 리뷰·목적별 commit/push·PR·CI·정상 main 병합/로컬 동기화. 이번 Chromatic 월간 한도 예외, 로컬 선행/실제 API 차단 보존 답변과 실제 HTTP 연결 구현을 구분. [Brief](tasks/DEV-10.md#dev-10-brief) |
| DEV-28 착수 당시 첫 행동 | 확정 회사 Team 명령/동의 계약·HTTP/mock과 수명 방어부터 구현. 당시 계획은 [종료 산출물](tasks/DEV-28.md#dev-28-close)로 확인하며 현재 다음 첫 행동은 위 DEV-29 인계 행을 따른다 |
| DEV-14 외부 조건 | [POL-09 사용자 결정](tasks/POL-09.md#pol-09-contract): 본문·현장설명 일시·기준일/수집일 추가 추진. 2026-11-13 [사용자 요청문/이미지 전달 보고](tasks/POL-09.md#pol-09-backend-delivery)를 기록했다. **답변과 실제 API 계약 확보 전까지 차단 유지**. 접수/답변·실행 대응/비식별 검증 자원·일정 미확인, 구현 미착수·현재 차이에 대한 Figma 예외 승인 없음. [재개 Gate](tasks/DEV-14.md#dev-14-pol-09-handoff) |
| DEV-13 외부 조건 | 2026-11-13 사용자 전용 backend 이전 차수 계약 선행 확정·개발자에게 요청 발송 보고. 기존 no-view 조회 경로는 미채택. 실제 계약/접수·일정·배포/실행 대응·합성 검증 자원은 미확보이며 [재개 Gate](tasks/DEV-13.md#dev-13-pol-08-handoff) 전 구현/로컬 선행 예외 없음 |
| DEV-09 이번 승인 범위 | 2026-11-12 사용자: DEV-09 하나의 개발·검증·두 리뷰·목적별 commit/push·PR/CI·정상 main 병합/로컬 main 동기화. 이번 PR의 Chromatic 월간 한도 문제만 예외. 실제 업무 API 변경/메일·문서 처리/운영·배포는 별도 범위 확인. 다음 Task는 선정/인계만. [사전 조사](tasks/DEV-09.md#dev-09-investigation) |
| DEV-62 이번 승인 범위 | 2026-11-12 사용자: DEV-62 하나의 개발·검증·두 리뷰·목적별 commit/push·PR/CI·정상 main 병합/로컬 main 동기화. 이번 PR의 Chromatic 월간 한도 문제만 예외. 실제 업무 API·메일/문서 처리·서비스 운영/배포와 다음 Task 실행 제외. [Brief](tasks/DEV-62.md#dev-62-brief) |
| DEV-60 이번 승인 범위 | 2026-11-12 사용자: DEV-60 하나의 개발·검증·두 리뷰·목적별 commit/push·PR/CI·정상 main 병합/로컬 main 동기화. 이번 PR의 Chromatic 월간 한도만 예외. 실제 업무 변경/운영/배포와 다음 Task 실행 제외. [Brief](tasks/DEV-60.md#dev-60-brief) |
| DEV-59 이번 승인 범위 | 2026-11-12 사용자: DEV-59 하나의 개발·검증·두 리뷰·목적별 commit/push·PR/CI·정상 main 병합/로컬 main 동기화. 이번 PR의 Chromatic 월간 한도 문제만 예외. 실제 업무 API/메일/문서 처리·운영/배포 제외. 다음 Task는 선정/인계만. [Brief](tasks/DEV-59.md#dev-59-brief) |
| DEV-61 이번 승인 범위 | 2026-11-12 사용자: DEV-61 하나의 개발·검증·리뷰·목적별 commit/push·PR·CI·정상 main 병합·로컬 main 동기화. 이번 PR의 Chromatic 월간 한도 문제만 예외. 다음 Task는 선정/인계만, 실제 업무 API/메일/문서 처리·운영/배포 제외. [착수 Brief](tasks/DEV-61.md#dev-61-brief) |
| 앞선 POL-30 승인 범위 | 2026-11-12 사용자: POL-30 한 작업의 정책 조사/결정·문서 검증/리뷰·목적별 commit/push·PR·CI·조건 충족 시 main 병합/로컬 main 동기화. 당시 PR의 Chromatic 월간 한도 문제는 예외 승인. 사용자가 마감·취소 기준의 진행 후보 표시를 명시 확정했다. 중앙 저장소·제품/업무 API·운영/배포·다음 Task 실행 제외. [착수 기록](tasks/POL-30.md#2026-11-12--착수-조사-체크포인트) |
| 앞선 DEV-55 후속 승인 범위 | 2026-11-12 사용자: DEV-55 후속 최신 GET·동등성 표시·저장 호출0·검증/리뷰/커밋/PR/CI/조건 충족 시 main 병합·로컬 동기화. 후속 PR의 Chromatic 외부 차단 예외도 이번에 명시 승인. [후속 Brief](tasks/DEV-55.md#dev-55-followup-brief) |
| 앞선 DEV-55 승인 범위 | 2026-11-12 사용자: DEV-55 하나의 개발·검증·리뷰·목적별 커밋·push·PR·CI 확인·조건 충족 시 main 병합·로컬 main 동기화. 다음 Task는 선정/인계만. 실제 업무·메일·문서 처리·운영/배포 제외. [이번 Brief](tasks/DEV-55.md#dev-55-brief) |
| 앞선 PR54 CI 예외 | 2026-11-12 사용자 원문 ‘이번 PR만 예외 병합 (추천)’. [PR #54](https://github.com/mate-pjt/mate-frontend/pull/54)의 Chromatic billed snapshot limit로 미실행인 `UI Tests`·`UI Review` 두 검사만 예외 승인. 제품 코드 `cd9c38a` 고정·승인 기록 문서 변경만 허용하며 최종 head의 나머지 CI/리뷰·저장소 정상 병합 조건 확인 후 merge/main 동기화. 검사 강제 성공·보호 우회·타 PR/검사·실제 QA 면제로 확대하지 않음. [승인·재개 기록](tasks/DEV-55.md#dev-55-pr54-ci-exception) |
| 앞선 DEV-63 승인 범위 | 2026-11-11 사용자: DEV-63 하나의 개발·검증·리뷰·목적별 커밋·push·PR·CI 확인·조건 충족 시 main 병합·로컬 main 동기화. 다음 Task는 선정/인계만. 실제 업무 API·메일/업로드·운영/배포 제외. [이번 Brief/승인 기록](tasks/DEV-63.md#dev-63-brief) |
| 앞선 DEV-65 승인 범위 | 2026-11-11 사용자: DEV-65 개발/검증/리뷰·Git 전달. DEV-63은 당시 선정/인계만이었으며 이번 실행 승인과 구분. [당시 기록](tasks/DEV-65.md#dev-65-brief) |
| DEV-63 교정 후 남은 경계 | 기존 QA-10/POL-02의 reset Major 기록은 당시 이력으로 보존한다. 2026-11-12 mock·HTTP 대역의 빈 SAVED/version/replay·회사 여부 차이는 [DEV-63](tasks/DEV-63.md#dev-63-verification)에서 교정·로컬 검증. 실제 reset wire/실행 대응·QA-10 실제12차단·POL-02 전체 계약 미결을 해소한 것은 아님 |
| 앞선 POL-29 승인 범위 | 2026-11-11 사용자: POL-29 정책 조사/결정·문서 검증/리뷰·Git 전달. 다음 DEV-65는 당시 선정/인계만. 이번 DEV-65 실행 승인과 구분해 [당시 기록](tasks/POL-29.md)에 보존 |
| 앞선 QA-17 전달 승인 | 2026-11-11 후속 사용자: QA-17 문서·공통 시작 프롬프트의 목적별 커밋·push·PR·CI 확인·main 병합·로컬 main 동기화. 당시 제품·실제 업무/운영/배포·POL-29 실행 제외. 후속 POL-29 및 이번 DEV-65 승인과 구분해 [QA-17 기록](tasks/QA-17.md)에 보존 |
| 앞선 감사 승인 범위 | 기존 구현 전체 점검·차이 기록·Task/WBS/연결표만 정리. Git 제외·미커밋 종료는 당시 이력이며 위 QA-17 후속 승인으로 해당 문서 전달 범위만 추가 |
| 이전 POL-07 Git 예외 | 2026-11-09 사용자 원문 ‘이번 문서 PR만 예외로 병합 (추천)’. PR #49 문서10개에 한해 Chromatic 월간 한도로 미실행인 UI Tests/UI Review를 명시하고 병합 가능. 상태 강제 성공/보호 우회·다른 CI 면제·제품 QA/타 Task 예외로 확대하지 않음 |
| 알려진 외부 차단 | DEV-08: 2026-11-09 사용자 배포/schema/version·실행 SHA 대응·합성 권한별 회사/계정·경계 자료·안전한 오류/사용·잔존·복구 미준비 확인. [POL-06 v1](tasks/POL-06.md#pol-06-contract)은 소스 정책만 확정. [필수 재개 조건](tasks/POL-06.md#pol-06-handoff) 확보 전 구현 미착수·실제 통합 차단, 로컬 선행 예외 없음. CDASH-01~12는 실제0통과·12차단·실행0건. 기존 QA-05 MCO4통과·6차단과 타 정책/QA 예외 보존. DEV-07: 2026-11-09 사용자 배포 WS/STOMP·REST version/schema/실행 SHA 대응·Origin·합성2계정/신호·안전한 오류·사용/변경/잔존/복구 자원 미준비 확인. [POL-05 v1](tasks/POL-05.md#pol-05-contract)은 소스 정책만 확정. [DEV-07 필수 재개 조건](tasks/POL-05.md#pol-05-handoff) 확보 전 구현 미착수·배포/실제 통합 차단, 로컬 구현 선행 예외 없음. 신규 NSIG-01~12는 실제0통과·12차단·실행0건. 다음 POL-06 선정은 DEV-07 차단 해소/QA 면제가 아님. DEV-06: 2026-11-09 사용자 자원 미준비·로컬 구현/검증 진행·실제 통합 차단 보존 답변. ANAV-01~10 실제0통과·10차단. 배포 schema/version·frontend/backend 실행 대응·disposable 합성 자원·사용/변경/읽음 잔존/복구·안전한 오류/401 해제 미확보. [재개 조건](../../qa/alarms.md#dev-06-local-qa) 확보 후 실제 실행·두 리뷰. 다음 POL-05는 이번 요청7항의 후보 선정만 허용하며 QA 면제/실행 승인 아님. 사용자 [POL-02 다음 선정 예외](tasks/POL-02.md#pol-02-next-pol-04-exception)는 POL-04 Gate 선정만 허용하며 아래 모든 차단/기존 예외를 보존한다. POL-02: 2026-11-05 사용자3정책 결정 확보·당시 OpenAPI 비인증 GET403 관찰은 이력으로 보존한다. [11/13 재조사](tasks/POL-02.md#pol-02-backend-20261113)에서 GET200/계약 접근을 확인했으며 실행 SHA 대응·실제 QA 차단과 과거 reset Major 이력/후속 교정 구분은 유지한다. [재개 표](tasks/POL-02.md#pol-02-resume) 확보 전 전체 정책/계약 완료·DEV-03 착수로 세지 않음. 이번 앱/업무 API 실행0건이며 문서 검증·Git 전달과 구분. POL-01: 2026-11-05 사용자 승인 원문/책임 역할·버전·적용일·URL 미준비, 기존 동의 전환 미결, 푸터 공개 정보/문의 목적지 미준비 확인. [재개 표](tasks/POL-01.md#pol-01-resume) 확보 전 정책 Gate 미통과·DEV-01/02 미착수. 이번 실제 실행/신규 통과0건. 후속 사용자 [진행 예외](tasks/POL-01.md#pol-01-next-pol-02-exception)는 POL-02 다음 Gate 선정만 허용하며 POL-01 정책 완료/차단 해소·POL-02 착수/정책/API 승인으로 세지 않음. QA-10: 2026-11-04 사용자 자원 미준비·사전 점검만 승인. PBF-01~12 실제0통과·12차단（기존0통과·12대기 보존）. disposable EMPTY_DEFAULT/COMPANY_DEFAULT 계정·시작 snapshot/version·매칭 공고 기대값·오류/401/409·사용/변경/빈 SAVED 잔존·종료/복구·현재 실행 대응 미확보. [재개 조건](tasks/QA-10.md#qa-10-resume) 유지. 11월 4일 기록의 mock/HTTP 대역 reset Major는 DEV-63에서 로컬 교정했다. 현재 목록의 계정 쓰기 UI 제거와 실제 재개 조건은 [11월 25일 사례표](../../qa/personal-bid-filter.md#qa-10-20261125-filter)를 따른다. 후속 사용자 [진행 예외](tasks/QA-10.md#qa-10-next-qa-11-exception)는 QA-11 Gate 선정만 허용하며 QA-10 검증 면제/통합 PASS나 reset Major 해결로 세지 않음. QA-11: 2026-11-05 사용자 자원 미준비·사전 점검만 승인. 실제 실행0건·신규 통과0·재검증8차단, ALARM-04 삭제 API 차단/ALARM-05 7일 정책 보류 별도. 읽음/미읽음·복수 종류·21건 이상 합성 알림·시작/종료 총건수/미읽음/정렬·PATCH 대상·사용/변경/잔존/복구·안전한 오류/해제·현재 실행 대응 미확보. 기존3통과·1차단·6대기와 타 Task 차단/예외 보존. [재개 조건](tasks/QA-11.md#qa-11-resume) 유지. 후속 사용자 [진행 예외](tasks/QA-11.md#qa-11-next-qa-12-exception)는 QA-12 Gate 선정만 허용하며 QA-11 검증 면제/통합 PASS·QA-12 실제 실행 승인으로 세지 않음. QA-12: 2026-11-05 사용자 자원 미준비·사전 점검만 승인. NSET-07 실제 실행0·신규 통과0·1차단, 기존6통과·1대기 보존. disposable 계정/시작 ON/OFF·로그인/두 GET/PATCH 사용·변경/발송·이력 잔존/종료/원복 담당/방법·실제 서버4xx/5xx 대상/상태/기간·안전한 재현/해제·현재 프론트/백엔드 실행 대응 미준비. [재개6조건](tasks/QA-12.md#qa-12-resume) 유지. 후속 사용자 [진행 예외](tasks/QA-12.md#qa-12-next-qa-13-exception)는 QA-13 Gate 선정만 허용하며 QA-12 검증 면제/통합 PASS·QA-13 실제 실행 승인으로 세지 않음. QA-13: 2026-11-05 사용자 Mailpit 경로 제공·직접 접근 가능 회신. 비인증 HEAD302/Cloudflare Access 인증 경계만 관찰했고 실제 로그인/메일 열람은 미실행. disposable 계정/새 수신처·시작/종료 상태·발송/변경/대체 주소·인증/메일 이력 잔존 허용·복구 담당/방법·안전한 오류/만료/한도 재현·해제·현재 실행 대응은 사용자 미준비 확인. 이번 사전 점검 실제 실행0건·신규 통과0·6차단, 기존 NREC3통과·6대기 보존. [재개 조건](tasks/QA-13.md#qa-13-resume) 확보 전 실제 실행 없음. 후속 사용자 [진행 예외](tasks/QA-13.md#qa-13-next-pol-01-exception)는 POL-01 다음 Gate 선정만 허용하며 QA-13 검증 면제/통합 PASS·POL-01 착수/정책 승인이나 자료 준비 완료로 세지 않음. QA-09: 2026-11-03 사용자 자원 미준비 확인·사전 점검만 승인. ALERT-01~08 실제0통과·8차단, 기존0통과8대기 이력 보존. 두 계정/두 공고·복수 분류·초기/종료 active·로그인/GET/PUT/DELETE 사용·변경/알림·이력 잔존·복구 담당/방법·안전한 실패/만료·현재 실행 대응 미확보. [재개 조건](tasks/QA-09.md#qa-09-resume) 유지. 후속 사용자 [진행 예외](tasks/QA-09.md#qa-09-next-qa-10-exception)로 QA-10 선정만 허용하며 QA-09 검증 면제/통합 PASS·QA-10 실제 실행 승인으로 세지 않음. QA-08: 2026-11-02 사용자 자원 미준비 확인·사전 점검만 승인, 실제 API·초대 소비·회사 변경 불승인. AUTH-16 실제0통과·1차단·초대 AUTH-17 미실행. 회사/발신자/수신자·불일치/신규 계정·유효/만료/사용된 초대·메일 링크 Origin·사용/소비/membership 변경·잔존/복구 담당/방법과 현재 실행 대응 미확보. [재개 조건](tasks/QA-08.md#qa-08-resume)은 유지. 후속 사용자 [진행 예외](tasks/QA-08.md#qa-08-next-qa-09-exception)로 QA-09 선정만 허용하며 QA-08 검증 면제/통합 PASS·QA-09 실제 실행 승인으로 세지 않음. QA-07: 2026-11-02 사용자 사전 점검만 승인. AUTH-09~13 실제0통과·5차단, 문서 경로 AUTH-17 미실행. 합성 문서/계정·storage PUT/CORS/OCR worker·정상/실패/충돌 fixture, 업로드/재시도/등록 변경·잔존·복구 담당/방법·현재 실행 대응 미확보. [재개 조건](tasks/QA-07.md#qa-07-resume)은 유지. 후속 사용자 [진행 예외](tasks/QA-07.md#qa-07-next-qa-08-exception)로 QA-08 선정만 허용하며 QA-07 검증 면제/통합 PASS로 세지 않음. QA-06: 2026-11-02 사용자 자원 미준비 확인·사전 점검만 승인. AUTH-14/15 0통과·2차단, 실제 로그인/API·번호 등록/복구·번호 경로 모바일/키보드 미실행. 정상/중복/지연·실패/null fixture와 계정·조회 연결 POST/DELETE 및 등록 POST의 변경/잔존/복구 담당·방법·현재 실행 버전 미확보. [재개 조건](tasks/QA-06.md#사전-점검-결과와-실제-qa-재개-조건--2026-11-02)은 유지. 후속 사용자 [진행 예외](tasks/QA-06.md#qa-06-next-qa-07-exception)로 QA-07 선정만 허용하며 QA-06 검증 면제/통합 PASS로 세지 않음. QA-05: 2026-11-02 실제 MCO 4통과·6차단, AUTH-07 부분/08 미실행 차단. 기존 QA-A만 조회했으며 상태별 계정/회사·검색의 결과/번호/페이지 기대 fixture·신청 변경/복구 자원·현재 backend 실행 버전 대응 근거 미확보. 제출/상태 생성은 사용자 결정으로 차단 유지. QA-03: 2026-11-02 추가 데이터 재검증1통과·8차단. DETAIL-07 관련3/빈 상태·정확 업종/target 이동 추가 통과, 공사/용역·정정/재입찰·23 API/UI 상태·404/로컬 실패 복구 부분 확인. 물품/복수 분류·취소/변경시각·결과/참여업체/물품 페이지·승인된 합성 첨부 스트림·backend HTTP 오류·실제 clipboard/표·현재 backend 실행 버전 대응 미확보. 기존0통과9차단·QA-03 전용 제한 종료 승인 보존(확인일2026-11-02). QA-02: 2026-11-02 추가 데이터 재검증 실제10통과·6차단. BID-01/02/05/06/07/10 추가 통과, BID-13~16 회귀 확인. 물품/RESULT0·분류/정확한 날짜·기초금액·기관/지역/추정가격/결과 null 및 현재 backend 실행 버전 미확보로 BID-03/04/08/09/11/12 차단 유지. 이전4통과·12차단/재시도 수정·QA-02 전용 제한 진행 예외를 보존하며 전체 통합 PASS·다음 Task 검증 면제로 세지 않음. QA-01: 2026-11-02 추가 데이터 재검증 4통과·5차단. 실제 홈 조건 312행/첫 9행 정상·QA-A refresh 200/logout 200/이후 refresh 401과 CTA 두 분기 확인. HOME-02~06의 홈 3종·복수 분류·기관 세 분기·null·1~8/0행과 현재 backend 실행 버전 대응 미확보. 공개 보기 용역 276/공사 36/물품 0·분류 0·검사 null 0이며 준비 관찰을 홈 전체 PASS로 세지 않음. 과거 2통과·7차단과 QA-01 전용 진행 예외 보존. 필요한 역할은 공개 fixture/배포 담당·프론트 QA 실행자이며 개인 배정은 미확인. QA-04의 입력 대기는 해소됨. 과거 OAUTH_REQUEST_INVALID 세부 원인·실제 서버 설정/Clock/과거 로그는 미확보 한계로 유지하며 제품 장애로 단정하지 않음. 인증 query 출력 누락과 Native 자동 다른 창 선택의 프로필 표시 정보/무관한 탭 제목 출력은 별도 수행 사건으로 공개 기록했다. 후속 교정이 과거 노출을 없애거나 노출값 전체를 무효화한 것으로 주장하지 않음. QA-05/13 및 POL-03 기존 차단과 QA-11 실제 QA fixture 차단 유지 |
| 실행 전 주의 | 준비/대기는 실행 승인이나 실제 환경 준비 완료를 뜻하지 않음. 다음 작업의 요구사항 Gate를 통과한 뒤 시작 |
| POL-07 후속 확인 · 2026-11-09 당시 | 그날 게시된 OpenAPI3.1.0/v1 스키마와 GitHub test 배포 성공·dev SHA를 확인했다. 실행 프로세스 SHA·경계 공고·저장 계정·변경과 복구 준비는 미확인이다. 사용자 D3의 범위는 직접 조사다. D2의 당시 낙찰금액 계약 전 보류와 ADV12/ADVP4 실제 0통과·16대기, 기존 reset Major와 정책·QA 차단 및 예외를 기록한다. [정책 v1과 인계](tasks/POL-07.md#pol-07-handoff) · [DEV-12 현재 재개 근거](tasks/DEV-12.md#dev-12-gate) |

## 2026-11-11 전수 점검 반영

- [날짜별 감사 보고서](audits/2026-11-11.md) · [근거/route·API 인덱스 JSON](audits/2026-11-11.json). 20개 route, Figma14영역/대표21화면, 정책20문서, 개발 Swagger183paths/207operations를 대조했다. 23개 차이/잔여 범위 묶음의 소유권과 검증 한계를 기록했다.
- 기존99개에 QA-17·POL-29/30·DEV-55~65의 **14개를 추가해 총113개**(개발65·검증18·정책30). 과거79개 기준선과 Task ID는 보존한다. “기능 구현됨”과 화면 정합성·정책 준수·실제 통합 검증을 구분한다.
- 내 맞춤 배치·추가 저장/초기화, 헤더/가입/상세 등은 시각 승인 미확인으로 POL-29에 연결했다. 회사 복수업종·reset·mock의 연도/인증·검색/view/관련공고 차이는 별도 수정 Task를 추가했다. 관련 공고 원문의 기준 공고 상태 충돌은 POL-30에 분리했다. 기존 미구현/정책 보류는 중복 신설하지 않고 범위/완료 기준을 보완했다.
- **현재 계약 가용성 보정:** 개발 OpenAPI는2026-11-11 HTTP200이다. 과거403/endpoint 부재는 당시 관찰로 보존한다. 삭제 POST·소속신청 취소 DELETE가 현재 문서에 있으며 POL-20/POL-10의 조사 입력을 갱신했다. 전체 등록공고 category=ALL은 여전히 없다. 실행 프로세스SHA/업무 응답·실제 QA 자원은 증명하지 않았으므로 기존 차단은 해소되지 않는다.
- 이번 코드/테스트/설정·실제 업무 데이터 변경 없음. 감사/계획 검토는 제품 전체 정합성 PASS·기존 실제 QA 면제·POL-29의 정책 선택 승인으로 세지 않는다. 현재 상태는 아래 행에서만 관리한다.

## 읽는 순서

1. [기준선](baseline.md): 무엇이 구현/미구현/정책 차이였는지, 근거와 검증 한계.
2. 이 WBS: 현재/다음 작업·우선순위·선행 조건·차단.
3. [작업 운영 규칙](workflow.md) → 선택한 작업 기록: 범위·완료 기준·직전 체크포인트.
4. [79개 항목 연결표](coverage.md): 원본 항목이 어떤 작업으로 해결되는지 역추적.
5. [기존 AI plan](../../ai-context/plan.md)·[하네스](../../ai-context/harness.md)·[실제 API QA](../../qa/README.md).

새 대화는 [고정 시작 프롬프트](start-prompt.md)를 사용한다. 커밋/push·PR·CI·main 동기화까지 요청한 경우 [Task별 전체 전달 흐름](task-cycle.md)을 따른다. PREP-01 전 기존 미커밋 변경 정리의 기록은 [main 통합 검토](reviews/main-integration.md)에서 확인한다. 이 정리로 PREP-01의 실제 QA 준비 점검을 실행한 것은 아니다.

## 분해 기준과 순서

2026-10-27 원본 **79개 항목을 99개 실행 작업**으로 연결했다(당시 개발54·검증17·정책28). 2026-11-11 전수 감사로14개를 추가해 당시113개가 됐다. 같은 날 POL-29의 DEV-66 추가 후 현재는114개(개발66·검증18·정책30)다. 원본 ID/스냅샷과 과거 집계는 보존한다. 항목과 작업은 다대다 관계이며 개수는 개발 진척률이 아니다.
개발 작업은 해당 단위의 자동/브라우저 검증·문서 갱신·Review Gate까지 포함한다. 별도 QA 작업은 이미 구현된 기능의 미완료 통합 검증을 이어가기 위한 것이다. 개발 후 검증을 다음 기능으로 밀어두는 구조가 아니다.

P0 기존 기능의 실제 QA·공개 준비 → P1 맞춤/알림 여정·회사 대시보드 → P2 고급 필터/상세·회사 갱신/서류함 → 팀원/권한 → 회사 간 통합 → 계정/설정 → P3 지원/콘텐츠/품질 순서다. 같은 우선순위에서는 표 순서를 기본으로 삼되 선행 조건을 먼저 해소한다. POL 작업은 관련 개발보다 먼저 수행한다.
DOC-002는 원본 C01(P3)의 UI 확장과 구분해 기존 문서 오독 방지 때문에 P0로 올렸다. QA-03은 P0 상세 통합에서 이미 구현된 P2 표시도 함께 확인한다. 나머지 원본 항목 우선순위는 coverage.md에 그대로 보존했다.
기존 기능의 대기 QA/승인 예외를 새 기능 전체의 예외로 확대하지 않는다. 작업 차단 시 다음 기능으로 자동 전환하지 않으며 아래 workflow의 재개·예외 규칙을 따른다.

현재 집계: **완료66 · 차단29 · 대기18 · 보류1 =114개**. POL-14의 기존 정책 PASS와 이번 MAT-290 연결 문서 후속 PASS를 구분해 보존한다. DEV-27은 이번 로컬 선행 범위 완료이며 실제 조회 부분 차단·추가 hidden 미실행을 보존한다. DEV-28은 병합 직전 새 원격 Major2/FAIL을 보존하고 사용자 추가1회 승인 뒤 두 수정·842 tests/로컬 QA/문서·두 리뷰를 통과했다. 실제 API QA9소유 부분 차단을 보존한다. DEV-29의 당시 D1 로컬 범위·실제7부분 차단과 DEV-30의 이번 D1/D2 로컬 범위·실제6부분 차단은 별개다. DEV-30은 초기 독립 FAIL/마지막 자동 수정3/3 뒤1001 tests·로컬 QA·문서·두 리뷰를 통과했으며 DEV-31은 선정·인계만 했다. 선행 DEV-29의 main 반영을 확인했다. DEV-25의 로컬/실제 삭제 QA6차단과 전달 이력은 보존한다. DEV-24 신규 추가/실통합·MAT-162와 기존 QA/예외·원본79개/Task114개·의존성156개를 보존하며 Git 전달은 실제 PR/최종 head에서 별도 확인한다.

상태: **대기**(순서/선행 조건 대기), **준비**(다음 요구사항 Gate 대상으로 선택), **진행**, **검증**, **리뷰**, **차단**(알려진 외부 조건), **보류**(정책/조건부 범위), **완료**(해당 단위 검증·리뷰 근거 확보). 상태 정의와 전환 조건은 [workflow.md](workflow.md)를 따른다.

2026-10-28 PREP-01에서 확정한 **조건부 실제 QA 순서**는 QA-04 → QA-01~03 → QA-05~13이다. HOME-09/BID-15의 인증 선행을 먼저 해소하기 위한 순서이며 각 작업의 자원·사용/변경/복구 승인·실행 식별자 확보 및 직전 Task 검증/리뷰 통과가 필요하다. 자세한 근거는 [준비표](../../qa/prep-01-readiness.md)를 따른다. DOC-002 종료 후 QA-04를 다음 요구사항 Gate 대상으로 선택했으며, 이는 실제 환경/승인 준비 완료나 QA 자동 착수를 뜻하지 않는다.

## 0. 작업 기반

| 작업 | 유형 | 순위 | 상태 | 원본 ID | 선행 작업 |
| --- | --- | --- | --- | --- | --- |
| [DOC-001 · 기준선·WBS·작업 기록과 workflow 연결](tasks/DOC-001.md) | 개발 | P0 | 완료 | 운영 기반 | — |
| [PREP-01 · 실제 API QA 사전 점검과 실행 순서 확정](tasks/PREP-01.md) | 검증 | P0 | 완료 | 운영 기반 | [DOC-001](tasks/DOC-001.md) |
| [DOC-002 · DESIGN.md의 인증·알림 과거 설명 정정](tasks/DOC-002.md) | 개발 | P0 | 완료 | C01 | [DOC-001](tasks/DOC-001.md) |
| [QA-17 · 기존 구현 UI·흐름·기능·정책 전수 점검과 Task 보완](tasks/QA-17.md) | 검증 | P0 | 완료 | 기존 구현 전반·2026-11-11 추가 요구 | [DOC-001](tasks/DOC-001.md) |

## 1. 기존 기능 QA·공개 준비

| 작업 | 유형 | 순위 | 상태 | 원본 ID | 선행 작업 |
| --- | --- | --- | --- | --- | --- |
| [QA-01 · 홈 9개 카드의 실제 API 통합 QA](tasks/QA-01.md) · **진행 예외 보존·11/25 재점검·전체 실제 4통과/5차단** | 검증 | P0 | 차단 | H02 | [PREP-01](tasks/PREP-01.md) |
| [QA-02 · 공개 목록·검색·기본 필터·페이지 실제 QA](tasks/QA-02.md) · **진행 예외 보존·11/25 재점검·전체 실제 10통과/6차단** | 검증 | P0 | 차단 | L01, L03, L05, L06, L12 | [PREP-01](tasks/PREP-01.md) |
| [QA-03 · 공개 상세·개찰·물품·첨부 실제 QA](tasks/QA-03.md) · **진행 예외 보존·11/25 재점검·전체 실제 1통과/8차단** | 검증 | P0 | 차단 | D01, D02, D03, D05, D07, D08, D09 | [PREP-01](tasks/PREP-01.md) |
| [QA-04 · Google 인증·세션·시작 선택 실제 QA](tasks/QA-04.md) | 검증 | P0 | 완료 | O01, O04 | [PREP-01](tasks/PREP-01.md) |
| [QA-05 · 회사 연결·소속 신청·기본 프로필 실제 QA](tasks/QA-05.md) · **진행 예외 보존·11/25 재점검·기존 실제 4통과/6차단** | 검증 | P0 | 차단 | M01, M02, M03, O05 | [PREP-01](tasks/PREP-01.md) / [QA-04](tasks/QA-04.md) |
| [QA-06 · 사업자번호 등록·가입 정보 실제 QA](tasks/QA-06.md) · **진행 예외 보존·11/25 재점검·기존 실제 0통과/2차단** | 검증 | P0 | 차단 | O06, O08 | [PREP-01](tasks/PREP-01.md) / [QA-04](tasks/QA-04.md) |
| [QA-07 · 가입 문서 업로드·OCR 실제 QA](tasks/QA-07.md) · **진행 예외 보존·11/25 재점검·기존 실제 0통과/5차단** | 검증 | P0 | 차단 | O07, O08 | [PREP-01](tasks/PREP-01.md) / [QA-04](tasks/QA-04.md) |
| [QA-08 · 초대 수신·계정 불일치·수락/거절 실제 QA](tasks/QA-08.md) · **진행 예외 보존·11/25 재점검·기존 실제 0통과/1차단** | 검증 | P0 | 차단 | O10 | [PREP-01](tasks/PREP-01.md) / [QA-04](tasks/QA-04.md) |
| [QA-09 · 상세 공고별 알림 실제 QA](tasks/QA-09.md) · **진행 예외 보존·11/25 재점검·실제 0통과/8차단** | 검증 | P0 | 차단 | D04 | [PREP-01](tasks/PREP-01.md) / [QA-04](tasks/QA-04.md) |
| [QA-10 · 개인 필터 12개 기존 사례 재검증](tasks/QA-10.md) · **진행 예외 보존·11/25 재점검·실제 0통과/12차단** | 검증 | P0 | 차단 | L11 | [PREP-01](tasks/PREP-01.md) / [QA-04](tasks/QA-04.md) |
| [QA-11 · 받은 알림·읽음·21건 이상 실제 QA](tasks/QA-11.md) · **선정 예외 보존·11/25 재점검·실제 0통과/재검증 8차단·ALARM-04/05 별도** | 검증 | P0 | 차단 | N01 | [PREP-01](tasks/PREP-01.md) / [QA-04](tasks/QA-04.md) |
| [QA-12 · 이메일 ON/OFF의 실제 서버 오류 QA](tasks/QA-12.md) · **11/26 재점검·NSET-07 실제 0통과/1차단·선정 예외 보존** | 검증 | P0 | 차단 | S04 | [PREP-01](tasks/PREP-01.md) / [QA-04](tasks/QA-04.md) |
| [QA-13 · 대체 이메일 인증·전환의 남은 실제 QA](tasks/QA-13.md) · **11/26 재점검·실제 0통과/6차단·선정 예외 보존** | 검증 | P0 | 차단 | S05 | [PREP-01](tasks/PREP-01.md) / [QA-04](tasks/QA-04.md) |
| [POL-01 · 정식 약관·푸터 공개 정보 확정](tasks/POL-01.md#pol-01-approved-policy) · **정책과 문서 검증 범위** | 정책 결정 | P0 | 완료 | H04, O03 | [DOC-001](tasks/DOC-001.md) |
| [DEV-01 · 정식 약관 본문·동의 버전 연결](tasks/DEV-01.md#dev-01-20261126-resume) · **승인 URL 연결 검증, 정식 버전 대응과 신규 가입 QA 필요** | 개발 | P0 | 차단 | O03 | [POL-01](tasks/POL-01.md) |
| [DEV-02 · 홈 푸터 약관·FAQ 링크와 고객문의 표시](tasks/DEV-02.md#dev-02-pol-01-approved-handoff) | 개발 | P0 | 대기 | H04 | [POL-01](tasks/POL-01.md) / [DEV-01](tasks/DEV-01.md) |
| [QA-16 · P0 공개 준비 결과 취합](tasks/QA-16.md) | 검증 | P0 | 대기 | H02, H04, L01, L03, L11, L12, D01, D04, D07, D08, D09, M01, M02, O01, O03, O04, O05, O06, O07, O10, S04, S05, N01 | [DOC-002](tasks/DOC-002.md) / [QA-01](tasks/QA-01.md) / [QA-02](tasks/QA-02.md) / [QA-03](tasks/QA-03.md) / [QA-04](tasks/QA-04.md) / [QA-05](tasks/QA-05.md) / [QA-06](tasks/QA-06.md) / [QA-07](tasks/QA-07.md) / [QA-08](tasks/QA-08.md) / [QA-09](tasks/QA-09.md) / [QA-10](tasks/QA-10.md) / [QA-11](tasks/QA-11.md) / [QA-12](tasks/QA-12.md) / [QA-13](tasks/QA-13.md) / [DEV-01](tasks/DEV-01.md) / [DEV-02](tasks/DEV-02.md) / [QA-17](tasks/QA-17.md) / [DEV-63](tasks/DEV-63.md) / [DEV-65](tasks/DEV-65.md) |

## 2. 맞춤 목록·알림·회사 대시보드

| 작업 | 유형 | 순위 | 상태 | 원본 ID | 선행 작업 |
| --- | --- | --- | --- | --- | --- |
| [POL-02 · 맞춤 공고 조회·개인 필터 의미 확정](tasks/POL-02.md) | 정책 결정 | P1 | 차단 | L02, H03 | [DOC-001](tasks/DOC-001.md) |
| [DEV-03 · 맞춤 공고 목록과 홈 CTA 여정 연결](tasks/DEV-03.md) | 개발 | P1 | 대기 | L02, H03 | [POL-02](tasks/POL-02.md) |
| [POL-03 · 등록 공고 전체 목록·일괄 해제 계약 확정](tasks/POL-03.md) | 정책 결정 | P1 | 차단 | A01, A02 | [DOC-001](tasks/DOC-001.md) |
| [DEV-04 · 알림 등록 공고 전체/분류별 관리 목록](tasks/DEV-04.md) | 개발 | P1 | 대기 | A01 | [POL-03](tasks/POL-03.md) |
| [DEV-05 · 등록 공고 선택·일괄 알림 해제](tasks/DEV-05.md) | 개발 | P1 | 대기 | A02 | [DEV-04](tasks/DEV-04.md) |
| [POL-04 · 받은 알림 actionPath·이동/읽음 정책 확정](tasks/POL-04.md) | 정책 결정 | P1 | 완료 | N03 | [DOC-001](tasks/DOC-001.md) |
| [DEV-06 · 받은 알림의 안전한 대상 화면 이동](tasks/DEV-06.md) | 개발 | P1 | 차단 | N03 | [POL-04](tasks/POL-04.md) |
| [POL-05 · 알림 변경 신호·REST 재조회 계약 확정](tasks/POL-05.md) | 정책 결정 | P1 | 완료 | N04 | [DOC-001](tasks/DOC-001.md) |
| [DEV-07 · 새 알림 신호 수신·재연결 갱신](tasks/DEV-07.md) · **배포/실제 통합 자원 미준비·구현 미착수** | 개발 | P1 | 차단 | N04 | [POL-05](tasks/POL-05.md) |
| [POL-06 · 가입 후 회사 실적·인증·희망금액 조회 계약](tasks/POL-06.md) | 정책 결정 | P1 | 완료 | M04 | [DOC-001](tasks/DOC-001.md) |
| [DEV-08 · 가입 후 회사 실적·인증·희망금액 대시보드](tasks/DEV-08.md) · **배포/합성 자원 미준비·구현 미착수** | 개발 | P1 | 차단 | M03, M04, O08 | [POL-06](tasks/POL-06.md) / [DEV-60](tasks/DEV-60.md) |

## 3. 필터·상세·회사 동선 보완

| 작업 | 유형 | 순위 | 상태 | 원본 ID | 선행 작업 |
| --- | --- | --- | --- | --- | --- |
| [POL-07 · 고급 조건·범위·낙찰금액 계약 확정](tasks/POL-07.md) | 정책 결정 | P2 | 완료 | L07, L08, L09, L10 | [DOC-001](tasks/DOC-001.md) |
| [DEV-09 · 고급 지역·업체·공동도급 조건 연결](tasks/DEV-09.md) · **후속 저장 보조 UI 교정 PASS·원 L07 연결은 실제 QA Gate 차단 유지** | 개발 | P2 | 차단 | L07 | [POL-07](tasks/POL-07.md) |
| [DEV-10 · 날짜 기준·직접 기간 입력 연결](tasks/DEV-10.md) · **실제 HTTP 연결·로컬 검증 PASS / 실서버 QA 차단 보존** | 개발 | P2 | 완료 | L08 | [POL-07](tasks/POL-07.md) |
| [DEV-11 · 금액 종류·직접 최소/최대 연결](tasks/DEV-11.md) · **실제 HTTP 연결·로컬 검증 PASS / 실서버 QA 차단 보존** | 개발 | P2 | 완료 | L09 | [POL-07](tasks/POL-07.md) |
| [DEV-12 · 개찰결과 낙찰금액 필터 연결](tasks/DEV-12.md#dev-12-close) · **로컬 검증 통과·실제 서버 QA 차단 보존** | 개발 | P2 | 완료 | L10 | [POL-07](tasks/POL-07.md) |
| [POL-08 · 정정 이력 조회·선택 계약 확정](tasks/POL-08.md) · **정책/문서 PASS·전용 API 실계약/제품 구현은 DEV-13 재개 조건** | 정책 결정 | P2 | 완료 | D06, C02 | [DOC-001](tasks/DOC-001.md) |
| [DEV-13 · 상세 정정 이력 팝업·선택 연결](tasks/DEV-13.md) · **사용자 전용 backend 계약 선행·요청 발송 보고, 계약/제품 미확보** | 개발 | P2 | 차단 | D06, C02 | [POL-08](tasks/POL-08.md) |
| [POL-09 · 원문 본문·추가 일자 제공 범위 결정](tasks/POL-09.md) · **추가 제공/계약 선행 정책·문서 PASS, 실제 계약/제품은 후속** | 정책 결정 | P2 | 완료 | D10 | [DOC-001](tasks/DOC-001.md) |
| [DEV-14 · 승인된 원문·추가 일자 표시](tasks/DEV-14.md) · **추가 제공 추진·backend 실제 계약/검증 Gate 선행, 구현 미착수** | 개발 | P2 | 차단 | D10 | [POL-09](tasks/POL-09.md) |
| [POL-10 · 소속 신청 취소 계약·권한 결정](tasks/POL-10.md) · **정책/문서 PASS·Sonner 완료 기준 확정, 제품/실제 취소는 DEV-15 후속** | 정책 결정 | P2 | 완료 | M05 | [DOC-001](tasks/DOC-001.md) |
| [DEV-15 · 소속 신청 취소 실행 연결](tasks/DEV-15.md) · **로컬 구현/검증·두 리뷰 PASS, 실제 MCANCEL12 차단 보존** | 개발 | P2 | 완료 | M05 | [POL-10](tasks/POL-10.md) |
| [POL-11 · 회사 찾기/등록 재사용 동선 결정](tasks/POL-11.md) · **정책/문서·두 리뷰 PASS, Figma ‘통합 요청’ 유지·설명 추가 없음** | 정책 결정 | P2 | 완료 | M06 | [DOC-001](tasks/DOC-001.md) |
| [DEV-16 · 회사 찾기/등록의 관리 화면 복귀 보완](tasks/DEV-16.md) | 개발 | P2 | 완료 | M06 | [POL-11](tasks/POL-11.md) |

## 4. 회사 갱신·서류함

| 작업 | 유형 | 순위 | 상태 | 원본 ID | 선행 작업 |
| --- | --- | --- | --- | --- | --- |
| [POL-12 · 회사 갱신·비교 적용·직접 수정 정책](tasks/POL-12.md) | 정책 결정 | P2 | 완료 | U01, U02, U03, F04 | [POL-06](tasks/POL-06.md) |
| [DEV-17 · 연도별 최신 정보·갱신 안내](tasks/DEV-17.md) | 개발 | P2 | 대기 | U01 | [POL-12](tasks/POL-12.md) / [DEV-08](tasks/DEV-08.md) |
| [DEV-18 · 최신 회사정보 불러오기·차이 비교](tasks/DEV-18.md) | 개발 | P2 | 대기 | U02 | [POL-12](tasks/POL-12.md) / [DEV-17](tasks/DEV-17.md) |
| [DEV-19 · 선택한 회사정보 적용·충돌 처리](tasks/DEV-19.md) | 개발 | P2 | 대기 | U02 | [DEV-18](tasks/DEV-18.md) |
| [DEV-20 · 회사 정보 직접 편집·저장](tasks/DEV-20.md) | 개발 | P2 | 대기 | U03 | [POL-12](tasks/POL-12.md) / [DEV-08](tasks/DEV-08.md) |
| [DEV-21 · 회사 프로필 이미지 변경](tasks/DEV-21.md) | 개발 | P2 | 대기 | U03 | [POL-12](tasks/POL-12.md) / [DEV-08](tasks/DEV-08.md) |
| [POL-13 · 서류함 생명주기·접근·삭제 계약](tasks/POL-13.md) | 정책 결정 | P2 | 완료 | F01, F02, F03, F04 | [DOC-001](tasks/DOC-001.md) |
| [DEV-22 · 가입 후 서류함 목록·보유/만료 상태](tasks/DEV-22.md) | 개발 | P2 | 완료 | F01 | [POL-13](tasks/POL-13.md) |
| [DEV-23 · 서류 상세·이력·다운로드](tasks/DEV-23.md) | 개발 | P2 | 완료 | F02 | [DEV-22](tasks/DEV-22.md) |
| [DEV-24 · 서류함 문서 추가·재업로드](tasks/DEV-24.md) · **재업로드 로컬 단위 PASS·신규 추가/실통합 차단** | 개발 | P2 | 차단 | F03, C02 | [DEV-22](tasks/DEV-22.md) |
| [DEV-25 · 보관 문서 삭제·완료 피드백](tasks/DEV-25.md) | 개발 | P2 | 완료 | F03 | [DEV-23](tasks/DEV-23.md) |
| [DEV-26 · 서류 OCR 결과를 회사 갱신에 반영](tasks/DEV-26.md) | 개발 | P2 | 대기 | F04 | [POL-12](tasks/POL-12.md) / [DEV-19](tasks/DEV-19.md) / [DEV-24](tasks/DEV-24.md) |

## 5. 팀원·권한·초대

| 작업 | 유형 | 순위 | 상태 | 원본 ID | 선행 작업 |
| --- | --- | --- | --- | --- | --- |
| [POL-14 · 팀원 권한·초대·합류·직급 계약](tasks/POL-14.md) | 정책 결정 | P2 | 완료 | T01, T02, T03, T04 | [DOC-001](tasks/DOC-001.md) |
| [DEV-27 · 팀원 목록·역할·상세 조회](tasks/DEV-27.md) | 개발 | P2 | 완료 | T01 | [POL-14](tasks/POL-14.md) |
| [DEV-28 · 팀원 정보·권한 변경](tasks/DEV-28.md) · **추가1/1 뒤 로컬 Gate PASS·실제 QA9차단 보존** | 개발 | P2 | 완료 | T01 | [DEV-27](tasks/DEV-27.md) |
| [DEV-29 · 팀원 초대 발송](tasks/DEV-29.md) | 개발 | P2 | 완료 | T02 | [DEV-27](tasks/DEV-27.md) |
| [DEV-30 · 초대 재발송·취소 관리](tasks/DEV-30.md) | 개발 | P2 | 완료 | T02 | [DEV-29](tasks/DEV-29.md) |
| [DEV-31 · 합류 신청 목록·검토·승인/거절](tasks/DEV-31.md) · **로컬 Gate PASS·실제5소유 부분 차단 보존** | 개발 | P2 | 완료 | T03 | [DEV-27](tasks/DEV-27.md) |
| [DEV-32 · 회사 직급 목록·추가·관리](tasks/DEV-32.md) · **로컬 Gate PASS·실제 QA 4부분 차단** | 개발 | P2 | 완료 | T04 | [DEV-27](tasks/DEV-27.md) |
| [POL-15 · 초대 수락 후 팀원 목적지 결정](tasks/POL-15.md#pol-15-contract) · **정책·문서 검증 범위** | 정책 결정 | P2 | 완료 | O11 | [POL-14](tasks/POL-14.md) |
| [DEV-33 · 초대 수락 완료의 팀원 화면 연결](tasks/DEV-33.md#dev-33-close) · **로컬 검증 범위 완료, 실제 QA 2부분 차단** | 개발 | P2 | 완료 | O11 | [POL-15](tasks/POL-15.md) / [DEV-27](tasks/DEV-27.md) |

## 6. 회사 간 통합

| 작업 | 유형 | 순위 | 상태 | 원본 ID | 선행 작업 |
| --- | --- | --- | --- | --- | --- |
| [POL-16 · 회사 간 통합·부분 승인·충돌 정책](tasks/POL-16.md#pol-16-contract) · **정책·문서 범위** | 정책 결정 | P2 | 완료 | G01, G02, G03 | [POL-12](tasks/POL-12.md) / [POL-14](tasks/POL-14.md) |
| [DEV-34 · 회사 간 통합 요청 발송·상태](tasks/DEV-34.md#dev-34-close) · **로컬 통과·실제 4사례 차단** | 개발 | P2 | 완료 | G01 | [POL-16](tasks/POL-16.md) / [DEV-28](tasks/DEV-28.md) |
| [DEV-35 · 받은 통합 요청의 단계별 검토](tasks/DEV-35.md) | 개발 | P2 | 대기 | G02 | [DEV-34](tasks/DEV-34.md) / [DEV-08](tasks/DEV-08.md) |
| [DEV-36 · 통합 전체/일부 승인·완료](tasks/DEV-36.md) | 개발 | P2 | 대기 | G03 | [DEV-35](tasks/DEV-35.md) |
| [DEV-37 · 통합 요청 거절·상태 갱신](tasks/DEV-37.md#dev-37-pol-16-handoff) · **인증 회사의 실제 거절 사유 조회 계약 필요** | 개발 | P2 | 차단 | G03 | [DEV-35](tasks/DEV-35.md) |

## 7. 계정·설정·정책 보완

| 작업 | 유형 | 순위 | 상태 | 원본 ID | 선행 작업 |
| --- | --- | --- | --- | --- | --- |
| [QA-14 · 설정 홈·현재 메뉴·로그아웃 회귀](tasks/QA-14.md#qa-14-verification) · **로컬 회귀 통과·실제 MSET-02 재확인 대기** | 검증 | P2 | 완료 | S01 | [PREP-01](tasks/PREP-01.md) |
| [POL-17 · 계정 정보 변경·인증 방식 결정](tasks/POL-17.md#pol-17-close) · **조회 전용 정책·문서 범위** | 정책 결정 | P2 | 완료 | S02, C02 | [DOC-001](tasks/DOC-001.md) |
| [DEV-38 · 계정 정보 조회·승인된 변경 연결](tasks/DEV-38.md#dev-38-verification) · **본인 이메일 조회 차수, 변경·재인증 계약 대기** | 개발 | P2 | 완료 | S02 | [POL-17](tasks/POL-17.md) |
| [POL-18 · 탈퇴 조건·회사 권한·데이터 처리 결정](tasks/POL-18.md#pol-18-contract) · **서버 계약·보존/철회 정책과 D2 인증/화면 결정 필요** | 정책 결정 | P2 | 차단 | S03, C02 | [POL-14](tasks/POL-14.md) / [POL-17](tasks/POL-17.md) |
| [DEV-39 · 탈퇴 조건 확인·인증·확인 UI](tasks/DEV-39.md) | 개발 | P2 | 대기 | S03, C02 | [POL-18](tasks/POL-18.md) / [DEV-38](tasks/DEV-38.md) |
| [DEV-40 · 탈퇴 실행·완료·승인된 철회 연결](tasks/DEV-40.md) | 개발 | P2 | 대기 | S03 | [DEV-39](tasks/DEV-39.md) |
| [POL-19 · 알림 디자인·중앙 정책·인증 시간 정합성 결정](tasks/POL-19.md#pol-19-close) · **정책·문서 범위** | 정책 결정 | P2 | 완료 | S06, S09 | [DOC-001](tasks/DOC-001.md) |
| [DEV-41 · mock 이메일 인증 시간·개발 가이드 동기화](tasks/DEV-41.md#dev-41-verification) · **로컬 검증 및 가이드** | 개발 | P2 | 완료 | S09 | [POL-19](tasks/POL-19.md) |
| [POL-20 · 받은 알림 삭제/숨김·보존 정책 확정](tasks/POL-20.md#pol-20-close) · **수동 삭제 확정·보존 기간 및 파기 보류** | 정책 결정 | P2 | 완료 | N02 | [DOC-001](tasks/DOC-001.md) |
| [DEV-43 · 받은 알림 선택·삭제/숨김 연결](tasks/DEV-43.md#dev-43-close) · **로컬 범위 통과·실제 NDEL 9차단** | 개발 | P2 | 완료 | N02 | [POL-20](tasks/POL-20.md) |
| [POL-21 · 가입 중 실적·인증 직접 편집 계약](tasks/POL-21.md#pol-21-close) · **정책·문서 검증 완료** | 정책 결정 | P2 | 완료 | O09 | [DOC-001](tasks/DOC-001.md) |
| [DEV-44 · 가입 실적·인증 직접 수정 UI 연결](tasks/DEV-44.md#dev-44-pol-21-contract-gate) · **두 경로의 최종 등록·보정 저장 계약 선행** | 개발 | P2 | 차단 | O09 | [POL-21](tasks/POL-21.md) |
| [POL-22 · 회사 조건을 개인 필터로 가져오는 정책](tasks/POL-22.md#pol-22-close) · **정책·문서 검증 완료** | 정책 결정 | P2 | 완료 | L11 | [POL-06](tasks/POL-06.md) |
| [DEV-45 · 회사 조건의 명시적 개인 필터 가져오기](tasks/DEV-45.md#dev-45-pol-22-gate) · **DEV-08 선행과 권한·전체 결측 서버 계약 대기** | 개발 | P2 | 대기 | L11 | [POL-22](tasks/POL-22.md) / [DEV-08](tasks/DEV-08.md) |

## 8. 지원·콘텐츠·품질

| 작업 | 유형 | 순위 | 상태 | 원본 ID | 선행 작업 |
| --- | --- | --- | --- | --- | --- |
| [POL-23 · 최근/추천 검색어 공급원·보존 결정](tasks/POL-23.md#pol-23-close) · **최근 기록 정책·문서 검증 완료, 관리형 추천의 표시 보류** | 정책 결정 | P3 | 완료 | L04 | [DOC-001](tasks/DOC-001.md) |
| [DEV-47 · 공개 목록의 최근 검색어 팝업](tasks/DEV-47.md#dev-47-close) · **BKEY 8건 로컬 검증·추천 보류** | 개발 | P3 | 완료 | L04 | [POL-23](tasks/POL-23.md) |
| [POL-24 · 네이버 로그인 지원 여부 결정](tasks/POL-24.md#pol-24-close) · **MVP Google 단독 정책·문서 범위** | 정책 결정 | P3 | 완료 | O02 | [DOC-001](tasks/DOC-001.md) |
| [DEV-48 · 승인된 네이버 OAuth 연결](tasks/DEV-48.md#dev-48-pol-24-handoff) · **MVP 제외, 신규 승인·계약·QA 선행** | 개발 | P3 | 보류 | O02 | [POL-24](tasks/POL-24.md) |
| [POL-25 · 서비스 이용안내 콘텐츠·목적지 결정](tasks/POL-25.md#pol-25-close) · **버전 팝업 정책과 후속 승인 조건** | 정책 결정 | P3 | 완료 | S07 | [DOC-001](tasks/DOC-001.md) |
| [DEV-49 · 서비스 이용안내 진입 연결](tasks/DEV-49.md#dev-49-pol-25-gate) · **공식 버전 출처·책임·조회 실패 기준 선행** | 개발 | P3 | 차단 | S07 | [POL-25](tasks/POL-25.md) |
| [POL-26 · 의견 보내기·문의 수집 채널 결정](tasks/POL-26.md#pol-26-close) · **공통 외부 폼 링크 정책과 프론트 데이터 경계** | 정책 결정 | P3 | 완료 | S08 | [DOC-001](tasks/DOC-001.md) |
| [DEV-50 · 설정·FAQ 의견 보내기 연결](tasks/DEV-50.md#dev-50-close) · **공통 폼 링크·공개 열람·두 진입점 검증** | 개발 | P3 | 완료 | S08 | [POL-26](tasks/POL-26.md) |
| [POL-27 · 메이트 소식 발행·콘텐츠 공급원 결정](tasks/POL-27.md#pol-27-close) · **공식 API와 공개 조회 정책·문서 범위** | 정책 결정 | P3 | 완료 | W01, W02 | [DOC-001](tasks/DOC-001.md) |
| [DEV-51 · 메이트 소식 목록·필터·GNB 연결](tasks/DEV-51.md#dev-51-pol-27-handoff) · **공개 목록 API 계약·개발 배포 선행** | 개발 | P3 | 차단 | W01 | [POL-27](tasks/POL-27.md) |
| [DEV-52 · 소식 상세·이미지·목록 복귀](tasks/DEV-52.md#dev-52-pol-27-handoff) · **DEV-51과 공개 상세 계약 선행** | 개발 | P3 | 대기 | W02 | [DEV-51](tasks/DEV-51.md) |
| [POL-28 · 운영 canonical URL·OG 이미지 결정](tasks/POL-28.md#pol-28-contract) · **공통 이미지·발행 기준 승인, 정식 운영 주소 확정 대기** | 정책 결정 | P3 | 차단 | C03 | [DOC-001](tasks/DOC-001.md) |
| [DEV-53 · OG 이미지·canonical 메타데이터 연결](tasks/DEV-53.md#dev-53-pol-28-handoff) · **POL-28 운영 주소 결정과 공개 자산 확인 선행** | 개발 | P3 | 대기 | C03 | [POL-28](tasks/POL-28.md) |
| [DEV-54 · 상세 페이지 main 랜드마크 중첩 해소](tasks/DEV-54.md#dev-54-close) · **정상·오류 본문 랜드마크와 접근성 회귀 검증** | 개발 | P3 | 완료 | C04 | [DOC-001](tasks/DOC-001.md) |
| [QA-15 · 정적 홈·FAQ·공용 UI의 조건부 회귀](tasks/QA-15.md#qa-15-verification) · **대표 기능 9통과·기존 320px 겹침 및 hydration 관찰** | 검증 | P3 | 완료 | H01, Q01, C01 | [DOC-001](tasks/DOC-001.md) |

## 9. 전수 점검 후 정합성 보완

아래는 추가 후보 정의다. 각 Task는 자신의 Gate·정책·검증/리뷰를 거쳐야 한다. POL-29는 UI 선택만 소유하고 실제 계약 수정은 관련 DEV가 소유한다.

| 작업 | 유형 | 순위 | 상태 | 원본 ID | 선행 작업 |
| --- | --- | --- | --- | --- | --- |
| [POL-29 · 기존 구현의 화면별 Figma 기준·의도적 차이 결정](tasks/POL-29.md) | 정책 결정 | P1 | 완료 | L11, C01, O01, O04, H01, H03, D01, D02, S04, S06 | [QA-17](tasks/QA-17.md) |
| [POL-30 · 관련 공고의 기준 공고 상태 정책 충돌 해소](tasks/POL-30.md) | 정책 결정 | P1 | 완료 | D09 | [QA-17](tasks/QA-17.md) |
| [DEV-55 · 개인 필터 도구막대의 Figma 정합성](tasks/DEV-55.md) | 개발 | P1 | 완료 | L11, L05, C01 | [POL-29](tasks/POL-29.md) |
| [DEV-56 · 공통 헤더의 식별·상태 UI 정합성](tasks/DEV-56.md) | 개발 | P3 | 완료 | C01, S01, O01 | [POL-29](tasks/POL-29.md) |
| [DEV-57 · 가입·시작 선택 화면의 프레임별 UI 정합성](tasks/DEV-57.md) | 개발 | P1 | 완료 | O01, O04, O05, O10, C01 | [POL-29](tasks/POL-29.md) |
| [DEV-58 · 홈 소개·CTA와 기능 제공 범위 정합성](tasks/DEV-58.md) | 개발 | P1 | 차단 | H01, H03 | [POL-29](tasks/POL-29.md) |
| [DEV-59 · 회사 가입 mock의 평가·인증 근거 계약 정합성](tasks/DEV-59.md) | 개발 | P1 | 완료 | O06, O07, O08 | [QA-17](tasks/QA-17.md) |
| [DEV-60 · 회사 기본 정보의 복수 주력업종 보존·표시](tasks/DEV-60.md) | 개발 | P1 | 완료 | M03 | [QA-17](tasks/QA-17.md) |
| [DEV-61 · 관련 공고 mock의 동일 업종·품목 정책 정합성](tasks/DEV-61.md) | 개발 | P1 | 완료 | D09 | [POL-30](tasks/POL-30.md) |
| [DEV-62 · 알림 채널·관리 기능 안내 문구 정합성](tasks/DEV-62.md) | 개발 | P1 | 완료 | D04, A01, N02, S04, C01 | [QA-17](tasks/QA-17.md) |
| [DEV-63 · 개인 필터 reset의 빈 SAVED 계약 정합성](tasks/DEV-63.md) | 개발 | P0 | 완료 | L11 | [QA-17](tasks/QA-17.md) |
| [DEV-64 · 공개 상세 레이아웃·단위 전환 UI 정합성](tasks/DEV-64.md#dev-64-close) | 개발 | P2 | 완료 | D01, D02, C01 | [POL-29](tasks/POL-29.md) |
| [DEV-65 · 공개 목록·홈 mock의 검색·view 정책 정합성](tasks/DEV-65.md) | 개발 | P0 | 완료 | H02, L01, L03, L12 | [QA-17](tasks/QA-17.md) |
| [DEV-66 · 알림 설정 Figma 화면·미지원 API 연결 경계](tasks/DEV-66.md#dev-66-close) · **비활성 화면 범위와 별도 활성화 선행** | 개발 | P2 | 완료 | S04, S06, C01 | [POL-29](tasks/POL-29.md) / [POL-19](tasks/POL-19.md) |

## 2026-11-11 · POL-29 화면 기준 인계

- [결정/보류 표](tasks/POL-29.md#pol-29-decisions): 개인 필터/상세 정렬·분류 추가 예외, 이름+아이콘 목표, Figma 알림3항목과 미지원 disabled/tooltip을 기록했다. 이름 source/fallback·홈 최종 문구는 후속 구현 Gate의 보류 조건으로 남긴다.
- 후속 구현 재개 조건(확인일2026-11-11): DEV-56/57은 실제 이름 공급원·권한/결측/지연/오류 시안, DEV-58은 최종 안내 문구/표시 위치의 제품·디자인 결정 확보 전 차단. 필요한 backend/API·제품/디자인 역할만 기록하며 개인은 미지정이다. 이번 후속 구현/실제 QA는 미실행.
- 다음 DEV-65 선정 이유: P0이고 선행 QA-17이 main에 있으며 공개 mock 검색/view라는 독립 목표다. DEV-63 역시 P0 대기를 유지하고 reset 계약/QA-10의 자원 Gate를 생략하지 않는다. 후보 선정은 개발 착수가 아니다.
- 인증시간 수정 DEV-41과 별개인 알림 화면/미지원 인터페이스 준비를 DEV-66으로 정의해 **기존113개 보존·총114개(개발66·검증18·정책30)**다. 추가 정의/연결만 했으며 어느 후속 개발도 시작하지 않는다.

## 2026-11-11 · DEV-65 교정·검증과 다음 Gate 인계

- [DEV-65](tasks/DEV-65.md#dev-65-verification)의 공개 mock 검색4필드/시간·view·홈/페이지 정합성을 교정했다.175 tests·lint·API/mock/hybrid build·실제 Next mock 브라우저·문서 검사·1차 두 리뷰 PASS. 최종 종료 메타데이터 freshness·Git 전달 결과는 [리뷰](reviews/DEV-65.md)·PR/receipt로 별도 확인한다.
- 다음 DEV-63은 남은 P0이며 선행 QA-17이 main에 있다. DEV-65와 독립된 reset/source/version 교정을 자신의 Gate에서 다룬다. 실제 QA-10의 자원 차단이나 POL-02의 계약 미결을 생략하는 승인이 아니다.
- 기존 실제 API QA/정책 차단·Task별 예외, 원본79개·114Task/155의존성/coverage를 보존한다. 다음 후보 정의/인계만 했으며 다른 Task의 source 조사/구현·업무 API 실행·Git 전달은 시작하지 않는다.

## 2026-11-12 · DEV-63 로컬 교정과 다음 Gate 인계

- [DEV-63 검증](tasks/DEV-63.md#dev-63-verification): reset 빈 SAVED·회사 여부·version/replay를 교정하고187 tests/lint·API/mock/hybrid build·실제 Next mock/브라우저 HTTP 대역·문서와1차 두 리뷰가 통과했다. 종료 문구 추가분까지 재검토하며 실제 Git 전달은 최종 PR/head·외부 receipt/최종 보고로 확인한다.
- 다음 DEV-55 선정: 남은 P0 QA/약관/취합은 기존 자원·정책/선행 차단을 유지한다. P1 중 POL-29가 main에 반영됐고 같은 개인 필터 화면의 배치/시각 목표를 reset 계약 교정과 분리해 시작할 수 있어 Gate 후보로 택했다. 다른 P1보다 제품 우선순위가 영구 변경된다는 뜻은 아니다.
- DEV-55는 새 대화에서 frame/상태별 정책·예외와 현재 source로 Brief를 확정한다. 이번에는 선정/인계만 했으며 구현·실제 API·다른 Task Git 전달을 시작하지 않았다. 기존 QA-10 실제12차단·POL-02 계약 미결과 Task별 예외·79원본/114Task/155의존성·baseline/coverage를 보존한다.

## 2026-11-12 · DEV-55 교정·검증과 다음 Gate 인계

- [DEV-55](tasks/DEV-55.md#dev-55-verification)의 왼쪽 수동 적용·아래 계정 도구를 정렬했다. 첫 verifier의 팝오버 Major를 실제 Next에서 재현/교정하고187 tests·lint·3구성 build·Storybook·mock6/HTTP13+2·3입력/키보드/계정/모바일 재검증과 교정 후 두 리뷰가 통과했다. 종료 metadata도 freshness 재검토하며 Git 결과는 최종 PR/head·외부 receipt/보고로 확인한다.
- 다음 POL-30은 P1·QA-17 선행 완료·DEV-61의 정책 선행을 이유로 선정/인계만 한다. 이번에 최신 정책/source 조사·정책 선택·원문/제품 수정·실제 QA를 시작하지 않는다. 기존 P0/QA-10 실제12차단·POL-02 미결·Task별 승인 예외와79원본/114Task/155의존성·baseline/coverage를 보존한다.

## 2026-11-12 · DEV-62 문구 교정과 다음 Gate 인계

- [DEV-62 검증](tasks/DEV-62.md#dev-62-verification): 알림4영역 안내·DESIGN을 교정하고315 tests/lint·3구성 build·Storybook·실제 Next mock8/HTTP9관찰 묶음·모바일/키보드/AX/DOM·문서 검사와1차 두 리뷰를 통과했다. verifier가 찾은 기존 요약 집계 Minor는 실제 행으로 보정하고 종료 metadata도 재검토한다. 실제 Git 전달은 최종 PR/head·receipt/최종 보고로 확인한다.
- 다음 DEV-09 선정 이유: P0 실제 QA/약관/취합·앞선 P1 정책/신원/문구·실제 자원 차단을 유지한다. 남은 P1은 차단/선행 미충족이며 P2 표의 첫 개발 후보 DEV-09는 POL-07이 완료돼 자체 Gate 대상으로 선정했다. 실행 process/합성 공고·계정/오류/복구 준비 완료나 로컬 선행 예외 승인이 아니다.
- DEV-09의 Task 정의·선행/자원 조건만 읽어 선정/인계했다. 이번에는 DEV-09 소유 source/API/Figma 상세 조사·Brief/설계·구현·검증·Git 전달을 시작하지 않는다. 기존 실제 QA/정책 차단·Task별 예외·79원본/114Task/155의존성·baseline/coverage를 보존한다.

## 2026-11-12 · DEV-09 Gate 조사와 다음 후보 인계

- [DEV-09 조사](tasks/DEV-09.md#dev-09-investigation): 최신 source/OpenAPI·test 배포 기록·공개 metadata296개·지역 팝오버 Figma 상태를 확인했다. 실제 경계 공고/개인 저장/오류·복구 자원과 실행 대응은 미확인이고 로컬 선행 예외 답변도 없으므로 제품 설계/구현 전 Gate에서 멈췄다. 문서 검토/전달과 제품/실제 통합 판정은 구분한다.
- 필요한 담당 역할·재개 조건은 [DEV-09 재개 표](tasks/DEV-09.md#dev-09-gate-handoff)에 남긴다. ‘자원 미확인’은 사용자 미준비 답변/실제 API 부재를 뜻하지 않는다. 이번 Git 승인과 Chromatic 한도 예외는 재질문하지 않는다.
- 사용자 요청7항의 다음 작업 선정/인계 범위에서 DEV-10을 선정했다. 남은 P0/P1 차단/선행 미충족은 보존하고 P2 표 순서상 다음이며 선행 POL-07이 완료됐다. DEV-09를 임의 코드 의존성으로 추가하지 않는다. DEV-10은 Task 정의/인계만 읽었고 source/API/Figma 조사·Brief/설계·구현·검증·업무 API·Git 전달을 시작하지 않는다. DEV-09 검증을 면제하거나 다른 Task로 제품 실행을 전환한 것이 아니다.
- 기존79원본/114Task/155의존성·baseline/coverage·과거 결정/QA 이력과 Task별 예외를 보존한다.

## 갱신 규칙

- 상태는 이 문서에서만 관리한다. 작업 기록에 최신 상태 표를 중복하지 않는다. 기록에는 날짜가 있는 사건·시도·증거·다음 행동을 쓴다.
- 한 번에 진행/검증/리뷰 중인 작업은 하나다. 완료 후 현재를 비우고 다음 작업 하나를 지정한다. 다음 작업의 의존성·정책·검증 조건을 다시 확인한다.
- 원본 ID와 작업 ID는 재사용하지 않는다. 추가 요구는 신규 ID로 기록하고, 원본 스냅샷을 덮어쓰지 않는다. 분리/병합/제외는 연결표와 결정 근거를 함께 갱신한다.
- 의존성은 선행 산출물을 읽어야 한다는 뜻이다. 보류/예외가 있는 선행 작업은 자동 충족되지 않으며 영향과 승인 범위를 확인한다.
- 공개 문서·콘텐츠/API/메일·계정 조건은 착수 시 현행 소유 소스와 배포를 확인한다. 2026-10-27 보고서는 현재 서버 실행의 증명이 아니다.
- 일정/소요일은 요구사항 Gate 이후 산정한다. 근거 없는 날짜·완료율은 넣지 않는다.
- 새 작업은 [TEMPLATE.md](tasks/TEMPLATE.md)를 복사한다. 결과는 작업 기록과 기존 QA case에 남기고 [검토 기록](reviews/DOC-001.md) 같은 파일에 Review Gate 근거를 보존한다.

## 2026-11-12 · DEV-55 최신 조회 후속과 다음 Gate 유지

- [후속 사용자 확정/검증](tasks/DEV-55.md#dev-55-followup-verification)에 따라 내 맞춤은 매 클릭 최신 GET을 적용하고 현재 전체 필터와 같으면 숨김/달라지면 표시한다. 별도 저장 버튼의 의미는 유지하며 적용 쓰기0건을 확인했다.
- 탐색 의도→URL commit Major를 재현·교정하고213 tests·lint·3구성 build·API29/hybrid2/mock8·키보드/모바일·두 리뷰를 통과했다. 종료 metadata의 freshness·Git 전달/Chromatic 직접 예외와 실제 통합 차단은 별개로 최종 PR/head·receipt/보고에서 확인한다.
- 다음은 기존 POL-30 하나를 유지한다. 남은 P0는 실제 QA/약관·취합 선행이 차단돼 있고 POL-30은 P1·QA-17 완료·DEV-61의 정책 선행이다. 다음 첫 행동은 위 실행 표와 Task 인계의 상태표/Brief이며 이번에는 상세 조사·정책 선택·구현을 시작하지 않는다.79원본/114Task/155의존성·기존 QA/예외·POL-02 미결을 보존한다.


## 2026-11-12 · POL-30 요구사항 Gate 조사

- [POL-30 착수 조사](tasks/POL-30.md#2026-11-12--착수-조사-체크포인트)에서 최신 중앙 원문의 기준 공고 마감/취소 및 삭제 처리 충돌과 backend dev 규칙, 개발 OpenAPI 문서 GET200을 확인했다. source/배포 문서/실행 SHA/업무 응답을 구분하며 실제 업무 요청은0건이다.
- 사용자에게 소스와 일치하는 기준/후보 상태표의 확정 여부를 질문했다. 답변 전 정책 선택·중앙 정정/DEV-61 기준 확정·후속 구현을 진행하지 않는다. 필요 역할은 정책 결정 사용자와 중앙 문서 소유 역할이며 담당 개인은 임의 지정하지 않는다. 마지막 확인일2026-11-12, 재개 조건은 해당 정책 답변이다.
- 기존79원본/114Task/155의존성·기준선/감사·QA-03의1통과8차단/DETAIL-07 통과 이력·다른 Task 예외는 보존한다. 이번에는 다음 Task를 선정하지 않았고 문서 검증/Review Gate·Git 전달은 정책 확정 후 이어간다.


## 2026-11-12 · POL-30 정책 확정과 다음 Gate 인계

- [사용자 결정/정책 v1](tasks/POL-30.md#pol-30-contract): 마감·취소된 공개 기준은 허용하며 후보는 별도 공개/삭제/취소/마감 조건을 적용한다. 중앙 §6/§10/§11 정정안은 로컬에만 작성했다. 문서 검사·primary ai-review·독립 verifier PASS 후 종료 metadata를 재검토하며 Git 결과는 실제 PR/head/최종 보고로 별도 확인한다.
- [선정 근거/인계](tasks/POL-30.md#pol-30-handoff): 다음 DEV-61은 P1·직접 정책 후속/CF-07 mock 목표로 선정했다. 남은 P0 차단과 다른 P1 후보를 보존하며 이번 선택을 영구 우선순위 변경으로 확대하지 않는다. 새 대화의 Brief 전 구현/추가 조사·실제 API·DEV-61 Git 전달을 시작하지 않는다.
- 79원본/114Task/155의존성·기준선/감사·기존 QA-03의1통과8차단/DETAIL-07 통과·타 Task 차단/예외를 보존한다. 중앙 원문 반영·backend 실행 SHA/실제 경계 응답·제품 구현은 후속이며 정책 문서 PASS나 이번 Chromatic 한도 예외로 대체하지 않는다.

## 2026-11-12 · DEV-61 로컬 교정과 다음 Gate 인계

- [DEV-61 검증](tasks/DEV-61.md#dev-61-verification): 관련 mock의 코드/우선순위·현재 후보·실제 target 분류·정렬/금액·고정 fixture를 교정했다.255 tests/lint·세구성 build·실제 Next mock/로컬 HTTP 대역·운영 guard·문서와 두 리뷰가 통과했다. 종료/PR 연결 metadata는 재검토하며 Git 전달은 실제 최종 PR/head·외부 receipt/종료 보고로 확인한다.
- 다음 [DEV-59 인계](tasks/DEV-59.md#dev-59-dev-61-handoff): 남은 P0 QA/약관/취합은 기존 자원·정책/선행 차단이다. 앞선 P1의 미완료 정책·신원/문구 결정·실제 신호/대시보드 자원 차단을 보존하고, QA-17 완료로 선행이 해소된 DEV-59/60/62 중 WBS 기본 순서가 앞선 DEV-59를 선정했다. 영구 우선순위 변경이나 다른 Task 실행 승인이 아니다.
- 첫 행동은 위 실행 표와 새 대화의 DEV-59 Brief다. 선정/인계만 했고 제품 소스 조사/구현·실제 API·다른 Task Git 전달을 시작하지 않았다.79원본/114Task/155의존성·기준선/감사·QA-03 실제1통과8차단/DETAIL-07·다른 정책/QA 차단·승인 예외를 유지한다.

## 2026-11-12 · DEV-59 로컬 교정과 DEV-60 인계

- [DEV-59 검증](tasks/DEV-59.md#dev-59-verification): 번호/문서 가입의 tri-state·인증3종·평가연도 null·출처/자료일·구형 탭/멱등 복원을 교정했다.284 tests/lint·세구성 build/Storybook·실제 Next16case·문서 검사와 두 리뷰가 통과했다. 종료/인계 metadata는 freshness 재검토하며 실제 Git 전달은 최종 PR/head·외부 receipt/종료 보고를 따른다.
- 다음 [DEV-60](tasks/DEV-60.md#dev-60-dev-59-handoff)은 P1·QA-17 main 반영·기본 표 순서상 앞선 해소 가능한 독립 목표다. 남은 P0 QA/약관·취합과 앞선 P1 정책/실제 자원·신원/문구 차단을 보존한다. DEV-08의 선행이기도 하지만 대시보드/실제 QA를 이 인계로 시작하거나 차단을 해소하지 않는다.
- DEV-60의 Task 정의/선행만 읽고 후보를 선정했다. 새 대화에서 최신 main·CF-06/중앙 회사 정책/현재 기본정보 계약과0/1/복수·중복·legacy-only·결측/잘못된 응답·모바일 범위를 대조해 Brief부터 제시한다. 이번에는 상세 source/API 조사·설계·구현·검증·DEV-60 Git 전달을 수행하지 않았다.79원본·114Task/155의존성·기준선/감사/coverage·기존 QA/차단/예외를 보존한다.


## 2026-11-12 · DEV-60 로컬 교정과 DEV-62 인계

- [DEV-60 검증](tasks/DEV-60.md#dev-60-verification): 기본정보 복수 주력업종·신형/legacy HTTP 경계·구형 mock 복원/등록 후 목록을 교정했다.315tests/lint·세구성 build/최종APIbuild·Storybook·실제 Next mock/HTTP 대역20검사·모바일/키보드/hybrid/guard·문서 검사와 두 리뷰를 통과했다. 종료 metadata는 freshness 재검토하며 실제 Git 전달은 최종 PR/head·원격 결과/종료 보고를 따른다.
- 다음 [DEV-62](tasks/DEV-62.md#dev-62-dev-60-handoff)는 P1·QA-17 선행 완료·기본 표 순서의 독립 알림 문구/문서 정합성 목표로 선정했다. 남은 P0 QA/약관·취합과 앞선 P1 정책/신원·문구/실제 신호·대시보드 자원 차단을 보존한다. 실제 QA-05 MCO4통과6차단·DEV-08 CDASH12차단과 타 Task 예외를 해소하지 않는다.
- DEV-62의 정의/선행/완료 기준만 읽고 선정/인계했다. 새 대화에서 현행 정책/소유 결정·현재 목적지/비활성·DESIGN.md 설명과 Brief부터 확인하며 이번에는 상세 source/API 조사·문구 확정·구현·실제 QA·DEV-62 Git 전달을 시작하지 않았다.79원본·114Task/155의존성·baseline/감사/coverage·기존 QA/차단/예외를 보존한다.

## 2026-11-12 · DEV-11 금액 연결과 다음 Gate 인계

- [DEV-11 검증](tasks/DEV-11.md#dev-11-verification): 실제 금액 HTTP 연결·승인된 로컬 선행 범위에서393 tests/lint·API/mock/hybrid build·Storybook·실제 Next/Aside23사례·문서/두 리뷰 PASS. 실서버 ADV/ADVP·QA-02/QA-10/POL-02 차단과 DEV-12 보류를 보존한다. 종료 metadata freshness와 실제 Git 전달은 최종 PR/head·receipt/보고에서 확인한다.
- 다음은 POL-08 하나다. 남은 P0 실제 QA/약관·취합 선행, P1 정책/신원·화면/실제 신호·대시보드 자원 차단을 유지하며 P2 표 순서에서 DOC-001이 완료된 첫 후보로 선정했다. DEV-12의 별도 계약/정책 Gate를 이번 작업에서 재개하지 않는다.
- [POL-08 인계](tasks/POL-08.md#pol-08-dev-11-handoff)에 다음 첫 행동을 기록했다. 정의/선행/완료 기준만 읽었으며 상세 source/API/Figma 조사·정책 결정·Brief/설계·구현·검증·Git 전달은 시작하지 않았다. 이번 DEV-11의 로컬/Chromatic 승인 예외를 다음 Task로 확대하지 않는다.

## 2026-11-13 · POL-08 정책 문서 종료와 다음 선정

- [POL-08 v1/종료](tasks/POL-08.md#pol-08-close): 동일 번호의 수집 차수·대상 ID의 공고 전체 이동/뒤로 가기·전용 backend 계약 선행을 사용자 결정으로 기록했다. 기존 API 조합 가능성과 제한된 GET3건을 보존하고 제품 채택하지 않았다. 문서 검사/Context Audit·정책 diff의 독립 verifier/ai-review PASS이며 종료/인계 metadata도 최종 재검토 대상이다. 전용 계약/제품/실제 복수 차수 통합은 미완료다.
- 다음 [POL-09](tasks/POL-09.md#pol-09-pol-08-handoff)는 P2·DOC-001 완료·표 순서의 첫 해소 가능한 독립 정책 Gate로 선정했다. 남은 P0 실제 QA/약관/취합·P1 정책/신원/문구·실제 자원, DEV-09 차단·DEV-12 별도 재개 Gate/보류와 DEV-13 전용 계약 선행을 유지한다. 새 source 필드 관찰만으로 다른 Task의 정책/실제 QA Gate를 해소하지 않는다.
- 이번에는 POL-09 정의/선행/완료 기준만 확인하고 다음 첫 행동을 인계했다. POL-09 전용 source/API/Figma 조사·정책 결정/Brief/설계·구현·검증·Git 전달은 시작하지 않았다. 원본79/114Task/155의존성·기준선/감사/기존 QA·승인 예외를 보존한다.

## 2026-11-13 · 백엔드 재조사 문서 반영과 DEV-57 재개 인계

- [사용자 승인](tasks/POL-09.md#pol-09-backend-replan-approval)에 따라 [날짜별 감사/JSON](audits/2026-11-13-backend-readiness.md)과 관련 Task·재개 규칙을 반영했다. nickname·전역 상세/야간 저장·RESULT 낙찰금액 계약과 남은 정책/실제 QA를 구분하고 과거 부재/403·QA/결정·승인 예외를 보존했다. 문서 검사/두 리뷰는 [검토 기록](reviews/backend-readiness-2026-11-13.md)에서 확인한다.
- 다음 하나를 [DEV-57 재개 요구사항 확인](tasks/DEV-57.md#dev-57-resume-handoff-20261113)으로 변경했다. P1·POL-29 main 반영·이름 공급원 확인이 근거이며 **차단 상태 유지**다. 이전 다음 POL-10만 준비→대기, DEV-66에는 POL-19 선행1개 추가다. 원본79/114Task·기존26차단/보류는 불변이며 현재 의존성은156개다.
- 다음 첫 행동은 위 실행 표와 DEV-57 인계의 최신 계약/미결 표시·검증 자원·자체 Brief 확인이다. 이 대화에서는 다음 Task 구현/정책 Gate를 시작하지 않았다. 문서 검토 PASS를 제품/실제 API 통합 PASS로 세지 않으며 최종 PR/head·CI·merge/main/clean은 실제 전달 결과로 별도 확인한다.

## 2026-11-13 · DEV-57 로컬 완료와 POL-10 선정

- [이번 D1/D2/D3](tasks/DEV-57.md#dev-57-brief)에 따라 이름/fallback·별도 Figma 달력·auth 프레임을 구현했다. [로컬 QA](../../qa/auth.md#dev-57-local-qa), [context-audit](reviews/DEV-57-context-audit.md), [verifier/ai-review](reviews/DEV-57.md) PASS. 실제 OAuth·가입·초대 API QA/약관·기존 차단과 날짜별 이력은 그대로다.
- 다음은 [POL-10](tasks/POL-10.md#pol-10-dev-57-handoff) 하나다. 남은 P0 실제 QA/약관과 P1 정책·신호/회사 자원·DEV-58 문구 결정은 차단을 유지한다. 선행이 완료된 대기/준비 후보를 우선순위/표 순서로 비교해 DOC-001 완료·P2 첫 독립 정책 Gate를 골랐다. 이번 Task의 Git/Chromatic 예외나 실제 QA 범위를 POL-10에 이전하지 않으며 조사/정책 선택/제품 개발·실제 취소를 시작하지 않았다.

## 2026-11-13 · 사용자 요청에 따른 다음 DEV-56 재개 확인으로 변경

- [사용자 승인 원문/문서 Brief](tasks/DEV-57.md#dev-57-next-dev-56-approval)에 따라 현재 다음 하나를 [DEV-56 재개 요구사항 확인](tasks/DEV-56.md#dev-56-resume-handoff-20261113)으로 변경했다. 위 POL-10 선정은 당시 이력으로 보존한다. P3 순위나 기존 차단을 해제하는 결정이 아니며 현재/다음·상태는 이 WBS만 소유한다.
- POL-10만 준비→대기, DEV-56은 P3·차단 그대로다. 헤더 이름+Figma 아이콘 목표와 결측/지연/오류·회사 미연결 표시/검증, 실제 QA 자원·허용 범위·다른 Task의 차단/승인 예외를 유지한다. DEV-57의 nickname 계약 기반은 재사용 가능 사실이며 시작 인사말 승인·로컬 QA 예외를 헤더 승인으로 확대하지 않는다.
- 다음 첫 행동은 상단 인계다. 이번 변경은 DEV-57 종료 인계의 문서 후속뿐이며 DEV-56 자체 요구사항/설계 Gate·제품 구현·검증·실제 API 실행은 시작하지 않았다. [문서 검토](reviews/DEV-57-handoff-DEV-56.md)와 실제 Git 전달 증빙을 제품 검증과 구분한다.


## 2026-11-13 · DEV-15 로컬 완료와 POL-11 선정

- [이번 DEV-15 승인/Brief](tasks/DEV-15.md#dev-15-brief)에 따라 본인 PENDING 명시 취소·실제 API 연결 코드·version/이력·확인/완료/미확정·계정/화면 수명을 구현했다. 자동469개·API/mock/hybrid build/lint·기존 Storybook·실제 Next full mock/합성 HTTP18개 관찰·문서 검사/Context Audit·두 리뷰의 로컬 범위 PASS다. 독립 1차 Major는 후속401 로그인 전달/완료 보존으로 교정·재검증했고 첫 FAIL을 보존한다.
- 실제 업무 취소/신청/실행0·MCANCEL12의 실제0통과12차단·기존 MCO/CDASH/AUTH/타 Task 차단과 예외는 그대로다. [검증/후속 조건](tasks/DEV-15.md#dev-15-verification)은 현재 실행 SHA·실제 wrapper·권한/경쟁·변경/잔존/복구 자원을 남긴다. Git 전달/Chromatic 예외는 이번 Task에만 적용한다.
- 다음은 [POL-11 인계](tasks/POL-11.md#pol-11-dev15-handoff) 하나다. 남은 P0/P1 대기/차단의 선행·자원을 유지하고, 선행이 완료된 후보를 우선순위/표 순서로 비교해 DOC-001 완료·P2 첫 독립 정책 Gate를 선정했다. /my에서 기존 등록/찾기 /auth 흐름 재사용·뒤로가기/완료 복귀 정책은 다음 자체 Gate에서 조사/결정한다. 이번에는 정의/선행/완료 기준만 확인하고 실제 조사/정책 선택/구현·실행을 시작하지 않았다.

## 2026-11-13 · POL-11 정책 문서 종료와 DEV-16 선정

- [D1/D2](tasks/POL-11.md#pol-11-decisions): 기존 회사 등록·찾기 재사용/설정 문맥·고정 완료 `/my/company`, 기존 가입 `/bids` 유지. 사용자 최종 요청대로 Figma ‘통합 요청’을 유지하고 설명 추가0·용어 변경 추천 미채택이다. 미래 Figma 변경은 새 Gate에서 반영한다.
- [검증/두 리뷰](reviews/POL-11.md): 문서/출처·부분 이미지 검토 PASS. 제품 구현/전체 화면 정합성/실제 API 통합 PASS가 아니며 RCTX15미실행·MCO4통과6차단/MCANCEL12와 가입/타 Task 차단·예외를 보존한다. Git/Chromatic 예외는 이번 POL-11에 한정한다.
- 다음은 [DEV-16](tasks/DEV-16.md#dev-16-pol-11-handoff) 하나다. 남은 P0/P1은 선행/정책·실제 자원 차단, P2는 POL-11 선행이 해소된 이 Task가 기본 표 순서 첫 후보다. 실제 QA 준비나 로컬 선행 예외가 아니며 자체 Brief/Gate가 필요하다. 이번에는 인계만 하고 DEV-16 조사/정책 선택·설계/구현·검증·업무 API/Git 전달을 시작하지 않았다.


## 2026-11-13 · DEV-16 로컬 복귀 보완 종료와 POL-12 선정

- [DEV-16 Brief/사용자 답변](tasks/DEV-16.md#dev-16-brief)과 [RCTX-L01~12](../../qa/my-company.md#dev-16-local-qa): 기존 등록/찾기의 설정·검색/로그인/Back·고정 완료 복귀, 계정/화면 수명·2xx 미확정/최소 성공 응답을 보완했다. 가입 `/bids`/건너뛰기 next·Figma ‘통합 요청’ 유지.
- [검증/두 리뷰](reviews/DEV-16.md): 524 tests·lint·앱/Storybook·문서/Context Audit·두 리뷰 PASS. 승인된 로컬 범위 판정이며 실제 업무 API0·RCTX-15/기존 MCO/MCANCEL·가입·타 Task 차단/예외는 보존한다. 이번 Chromatic 월간 한도만 예외다.
- 다음 하나는 [POL-12](tasks/POL-12.md#pol-12-dev-16-handoff)다. POL-06 선행 충족·해소 가능한 P0/P1 대기0·P2 기본 표 순서 첫 후보이며 선정/인계 외 실행은 없다. Git 전달/실제 최종 CI·정상 병합/main 일치는 실제 PR/최종 보고에서 확인한다.

## 2026-11-13 · POL-12 정책 문서 종료와 POL-13 선정

- [사용자 D1/D2/D3·v1](tasks/POL-12.md#pol-12-contract): Figma 선택행만 반영·미선택/닫기 보존, 지원 수기/계약 선행 분리, 해 바뀜 배너/자료 기준 분리. [API별 공백](tasks/POL-12.md#pol-12-api-gaps)과 후속 DEV-17~21/26·CUPD18 미실행 기준을 연결했다. 제품/업무 API 실행0·원본/기존 QA·DEV-08 및 타 Task 차단/예외는 유지한다.
- [문서 검증·두 리뷰](tasks/POL-12.md#pol-12-review-close)와 checker1회 교정/Minor 문구 교정을 기록했다. 종료13파일은 final 검사/독립 freshness 대상으로 다시 확인하며 Git 전달·최종 CI/정상 병합/main 일치는 실제 PR/최종 보고에서 확인한다.
- 다음 하나는 [POL-13](tasks/POL-13.md#pol-13-pol-12-handoff)이다. DOC-001 선행 충족·해소 가능한 P0/P1 대기0·P2 앞선 DEV의 선행/계약 차단 보존 후 다음 독립 정책 후보로 선정했다. 정의/첫 행동 인계만 하며 자체 조사·결정·실제 문서 처리는 시작하지 않는다.

## 2026-11-16 · MAT-287 연결과 다음 POL-13 유지

- 사용자 후속 요청에 따라 [POL-12](tasks/POL-12.md#pol-12-mat-287-handoff)에 MAT-287의 실제 등록/응답 확인·대기4항목과 기존 API 재사용·버전 설명 정정·재개 조건을 연결했다. 백엔드 답변/일정·실계약 확보나 제품/실제 QA 완료로 세지 않는다. MAT-162 OCR 보류와 DEV-08 및 후속 선행을 유지한다.
- [문서 검사·두 리뷰](reviews/POL-12.md#pol-12-mat-287-review)와 종료 후 freshness를 구분한다. 원본79개/114Task/156의존성·기준선·기존 QA/결정·승인 예외를 보존하며 API/제품/설정/라이브러리 변경0이다. Git 전달 결과는 실제 PR/최종 보고에서 별도 확인한다.
- 다음 하나는 [POL-13](tasks/POL-13.md#pol-13-mat-287-handoff)이다. DOC-001 충족·P0/P1 해소 가능한 대기0·P2 기본 표 순서/기존 DEV 선행을 확인했다. MAT-287을 전체 서류함 정책의 신규 선행으로 추가하지 않았으며 선정/첫 행동 인계만 했다. 다음 자체 조사·정책 선택·구현/실제 문서 처리는 시작하지 않는다.


## 2026-11-16 · POL-13 정책과 다음 DEV-22 인계

- [사용자3결정/소스 정책](tasks/POL-13.md#pol-13-contract): 현행 권한·보유/처리/인증/기간 구분/결측 미확인, 전체 series 삭제/30일 뒤 비동기 파기 대상·복원 없음, 지원 계약과 기존 회사 귀속/최종 적용 대기를 분리했다. 제품/실제 문서 처리는 실행하지 않았다.
- [문서 검사/두 리뷰](tasks/POL-13.md#pol-13-review-close)와 종료 후 freshness·실제 CI/Git 전달을 구분한다. DEV-22~26 후속 기준과 DBOX22미실행 계획만 추가했고 기존 baseline/coverage·QA/선행/보류를 보존한다.
- 다음 하나는 [DEV-22](tasks/DEV-22.md#dev-22-pol-13-handoff)다. 해소 가능한 P0/P1 대기0·POL-13 완료·P2 기본 표 순서에 따라 선정했고 목록 기간 제공 방식/권한/후보-current·실제 합성 자원 확인을 첫 행동으로 인계했다. 다음 Task 실행/QA 면제·로컬 선행 승인 없음.


## 2026-11-16 · DEV-22 로컬 목록 종료와 DEV-23 인계

- [DEV-22 사용자 D1/D2·검증](tasks/DEV-22.md#dev-22-close): 기존 API 조합으로 회사 서류함 목록/메뉴·후보/current·KST 기간·권한/오류·계정/회사 수명과 가입 문서 귀속 mock을 연결했다.566 tests/lint·API/mock/hybrid/Storybook build·로컬 QA14·문서33/33·context-audit/두 리뷰를 확인했다. 종료 metadata freshness·실제 최종 CI/Git 전달은 검토/PR/최종 보고에서 별도로 확인한다.
- 실제 DBOX8차단/다른14대기·기존22미실행 계획/가입·회사 QA·DEV-08/MAT-162/타 Task 차단·승인 예외를 보존한다. 업무 API/파일/OCR/삭제0건이며 이번 D2는 DEV-22 로컬 선행에 한정한다.
- 다음은 [DEV-23](tasks/DEV-23.md#dev-23-dev-22-handoff) 하나다. 해소 가능한 P0/P1 대기0·앞선 P2 선행/계약 차단을 유지하고, DEV-22 후속 중 기본 표 순서가 앞선 상세/이력/다운로드를 선정했다. 위 첫 행동/자체 Gate 인계만 수행했으며 전용 source/API/Figma 조사·설계/구현·실행은 시작하지 않는다. 원본79/114Task/156의존·baseline/coverage와 과거 결정/QA를 유지한다.


## 2026-11-16 · DEV-23 로컬 상세 종료와 DEV-24 인계

- [DEV-23 사용자 D1/D2/종료](tasks/DEV-23.md#dev-23-close): exact 버전 URL·파일 metadata/이력·명시 PREVIEW/DOWNLOAD/Blob 수명·권한/오류/만료·목록 page 복귀를 연결했다.615 tests/lint·API/mock/hybrid/Storybook build·실제 Next 로컬16사례·문서/context-audit·두 리뷰 PASS, 종료 metadata/인계 뒤 freshness·실제 최종 Git 전달은 검토/PR/최종 보고에서 확인한다.
- 실제 DBOX6차단/업무0·DEV-22와 고유12차단/다른10대기·원본 계획/과거 QA·가입/회사·DEV-08/MAT-162/다른 Task의 차단·승인 예외를 보존한다. 새 library/업로드/삭제/OCR·운영/배포0이며 이번 D1/D2·Git/Chromatic 예외는 DEV-23에 한정한다.
- 다음 하나는 [DEV-24](tasks/DEV-24.md#dev-24-dev-23-handoff)다. DEV-22 충족·해소 가능한 P0/P1 대기0·P2 기본 표 순서에 따라 자체 Gate 후보로 선정했다. 기존 회사 귀속/current 최종확정·실제 자원/실행 승인·MAT-162 Gate를 유지하며 준비를 계약 확보로 해석하지 않는다. 정의/첫 행동 인계만 했고 전용 조사/정책/설계·제품/파일 실행은 시작하지 않았다.


## 2026-11-16 · DEV-24 로컬 재업로드와 잔여 차단·DEV-25 인계

- [사용자 D1/종료 단위](tasks/DEV-24.md#dev-24-close): 기존 문서 재업로드의653 tests/lint·3구성/Storybook·로컬18사례·문서/context-audit·두 리뷰 PASS. 신규 series 회사 귀속·실제 DBOX7은 차단, 회사 프로필/MAT-162·삭제는 포함하지 않아 DEV-24 전체 차단을 유지한다. 문서/Git/main 반영이 실제 통합 PASS가 아니다.
- 다음 [DEV-25 인계](tasks/DEV-25.md#dev-25-dev-24-handoff): 앞선 P0/P1은 기존 자원/정책/선행 차단을 유지하고, 앞선 P2의 DEV-08 의존·DEV-12 보류·DEV-13/14와 DEV-24 잔여를 보존한다. DEV-23이 완료된 DEV-25가 기본 표 순서의 첫 독립 후보여서 선정했다. DEV-26은 DEV-19/DEV-24·MAT-162 Gate가 남아 있다. 원본 우선순위/의존성을 변경하거나 DEV-25 실행/실제 삭제·로컬 선행 예외를 승인한 것이 아니다.


## 2026-11-16 · DEV-25 로컬 전체 삭제와 POL-14 인계

- [사용자 D1/종료 단위](tasks/DEV-25.md#dev-25-close): 전체 series 삭제 확인/취소·응답/완료·상세/원본/목록 수명과 오류/미확정·최종401/계정·회사·탐색을 구현했다.699 tests/lint·API/mock/hybrid/Storybook·로컬 QA/문서/context-audit·두 리뷰 PASS와 실제 DBOX-17~22의6차단을 구분한다. 종료 metadata freshness·최종 CI/Git 전달은 검토/실제 PR/종료 보고에서 확인한다.
- 다음 [POL-14](tasks/POL-14.md#pol-14-dev-25-handoff)는 선행 완료인 대기/준비 후보를 대조한 P2 기본 순서의 첫 정책 Task다. DEV-08·DEV-19/24·MAT-162 및 기존 P0/P1 차단은 유지한다. 권한/최후 관리자·초대/합류/직급의 자체 Gate 첫 행동만 인계하며 조사/새 정책/제품·실제 업무/별도 Git 전달은 시작하지 않는다. 원본79/114Task/156의존성과 모든 기존 QA/정책·예외를 보존한다.


## 2026-11-16 · POL-14 현재 조사와 정책 Gate 대기

- [현행 조사](tasks/POL-14.md#pol-14-investigation): 중앙 leaf/대표자·최후 관리자·직접/동의 변경, 초대/메일·만료/DB 상태 차이, 신청·직급 계약과 공개 OpenAPI32경로37operation/67schema를 확인했다. source/배포/게시 명세와 미확인 실행 SHA·실제 업무 응답을 구별한다.
- D1 현행 정책 채택/DEV-28 동의 흐름, D2 상세 미제공·대표자 안내 한정 화면 예외, D3 만료 후 새 초대 기준은 사용자 답변 전 추천안이다. [재개 조건](tasks/POL-14.md#pol-14-resume) 확보 전 정책 완료·main 병합 조건 충족/후속 구현·실제 업무를 주장하지 않는다.
- 기존 P0/P1 차단·DEV-08/회사 갱신·DEV-24/26/MAT-162·모든 QA/승인 예외와79원본/114Task/156의존을 유지한다. POL-14 완료 뒤 표 순서의 첫 별도 후보는 DEV-27(팀원 조회)이지만 선행 POL-14가 아직 미충족이어서 다음 실행 Task로 전환하지 않았다.


## 2026-11-16 · POL-14 확정과 DEV-27 인계

- [사용자3결정/v1](tasks/POL-14.md#pol-14-contract): 현행 leaf/계산 role·capabilities/직접·대상 동의·최후 관리자·초대/합류/직급 계약 채택, 상세 미제공·대표자 행동별 안내의 한정 화면 예외, 만료 후 새 초대 기준을 확정했다. 후속DEV/QA·문서 검증/Context Audit·두 리뷰 PASS와 제품/실제 통합·Git 전달을 구별한다.
- [TEAM26](../../qa/team-members.md#pol-14-team-qa)은 실제0통과26대기·실행 자원/사용·복구/실행 대응 미확보다. 기존 QA-08 AUTH-16/17·다른 가입/회사/문서·DEV-08/MAT-162·타Task 차단/예외와79원본/114Task/156의존을 보존한다. 종료 metadata freshness·최종 CI/Git/main 일치는 검토/실제 PR #83·종료 보고에서 확인한다.
- 다음 하나는 [DEV-27](tasks/DEV-27.md#dev-27-pol-14-selection)이다. POL-14 완료·기존 앞선 우선순위/선행 차단 보존 뒤 P2 기본 표 순서 첫 독립 개발 후보로 선정했다. 위 첫 행동/자체 Gate 인계만 하며 전용 조사/설계/구현·실제 업무/QA·Git 전달을 시작하지 않는다.


## 2026-11-17 · DEV-27 조회 로컬 범위 종료와 DEV-28 인계

- [DEV-27 종료/검증·수정/리뷰](tasks/DEV-27.md#dev-27-close): 실제 API 연결 코드를 포함한 로컬 단위 PASS, 실제 통합0통과·조회 부분 차단/추가 hidden 미실행 유지. 첫 독립 Major1을 onNavigate로 고치고 네이티브4회귀·재리뷰를 수행했다. Git 전달은 실제 최종 PR/head에서 별도 확인한다.
- P0/P1/앞선 P2의 기존 차단/선행과79원본·114Task/156의존을 보존한 다음 하나는 [DEV-28](tasks/DEV-28.md#dev-28-dev-27-selection). 위 첫 행동과 선정/인계만 하며 전용 계약 재조사·Brief/설계·제품/실제 업무/QA·Git 전달은 시작하지 않는다. 이번 승인 예외를 다음 Task로 옮기지 않는다.

## 2026-11-17 · DEV-28 로컬 범위 종료와 DEV-29 인계

- [DEV-28 종료](tasks/DEV-28.md#dev-28-close): 이번 D1/D2의 실제 HTTP 연결 코드/가변 mock·팀원 편집/명시 동의 목록·상세/알림 exact route,838 tests·lint·API/mock/hybrid/Storybook·로컬30관찰/문서·Context Audit/두 리뷰 PASS. 첫 독립 Major3/Minor1·수정3/3·fixture-invalid1을 보존한다. 실제 API QA9소유 부분0통과·차단/추가 hidden 미실행과 기존 QA·정책 예외는 유지한다. 종료 metadata freshness·Git 최종 CI/정상 merge/main FF는 별도 확인한다.
- 다음 하나는 [DEV-29 인계](tasks/DEV-29.md#dev-29-dev-28-selection)다. 기존 P0/P1·앞선 P2의 외부/선행 차단을 유지한 기본 표 순서 첫 독립 후보이며 DEV-27 선행 충족을 확인했다. DEV-30의 DEV-29 선행과 원본79/114Task/156의존을 유지한다. 첫 행동/자체 Gate만 인계하고 전용 조사/설계·초대/메일·제품/실제 API/QA·별도 Git 전달은 시작하지 않았다. DEV-28 승인을 다음 Task로 확대하지 않는다.

## 2026-11-17 · DEV-28 병합 직전 새 리뷰 Gate

- PR #86 head8fa797e의 최종 CI본체/게시 성공과 한도 pending 예외를 확인했으나, merge 직전 새 자동 리뷰2건을 발견했다. [현재 탭 로딩 고착·mock 행동별 capability 불일치](tasks/DEV-28.md#dev-28-remote-review)를 실제 로컬 브라우저/합성 Node 및 read-only verifier가 재현해 최신 Review Gate FAIL이다. 정상 merge API는 실행하지 않았다.
- 자동 수정3/3 뒤 이 두 건 한정 추가1회 결정 전 제품 변경은 하지 않는다. DEV-29 선정/인계 기록은 보존하되 DEV-28 재검증/두 리뷰 전 실행하지 않는다. 원본/선행·기존QA/실제9차단·승인 예외는 유지한다.

## 2026-11-17 · DEV-28 추가1회 승인 뒤 로컬 Gate 재통과

- [추가1/1 종료](tasks/DEV-28.md#dev-28-extra-close): 이번 사용자 승인으로 같은 목적지 결과 유지·mock 각 행동kind capability 두 최소 수정/4회귀를 반영했다.842 tests/lint0·API/mock/hybrid/Storybook·추가 실제 Next mock/독립 탐색17·문서/Context Audit·두 리뷰 PASS다. 첫 FAIL/원격Major2·추가 브라우저23PASS/초기2관찰·도구 한계/원인 미확정은 보존하며 실제 API0/9소유 부분 차단을 유지한다.
- DEV-29는 기존 선정/인계 하나를 유지하고 첫 행동/자체 Gate 외 실행0이다. 원본79/114Task/156의존과 기존 다른 Task/QA·승인 예외를 보존한다. 새 최종 PR head CI/두 thread·정상 merge/main FF/동일SHA·clean은 실제 PR/종료 보고에서 별도 확인한다.


## 2026-11-17 · DEV-29 로컬 범위 종료와 DEV-30 인계

- [DEV-29 종료](tasks/DEV-29.md#dev-29-close): 초대 생성/보낸 목록·상세·입력/권한·현재 회사·수명과 shared mock 경쟁을 구현·수정3/3·939 tests/lint/세 구성 build·Storybook/문서·두 리뷰로 검증했다. 실제7소유 부분0통과7차단·초기FAIL/도구/출력·전송 계층 관찰과 기존 모든 QA/예외를 보존한다.
- 다음 하나는 [DEV-30 인계](tasks/DEV-30.md#dev-30-dev-29-selection)다. 기본 P2 순서/DEV-29 선행 충족을 따른 선정/첫 행동만 기록했고 자체 조사·설계/구현/QA·별도 Git 전달0이다. 현재/다음/상태는 이 WBS만 소유하며 원본79/114Task/156의존과 다른 Task 순서를 유지한다.
- DEV-29 최종 PR head CI·리뷰/병합 조건·정상 merge/main FF/동일SHA·clean은 실제 PR/종료 보고에서 별도 확인한다. 로컬 단위 PASS는 Git 전달/배포 완료 선언이 아니다.

## 2026-11-17 · DEV-30 로컬 범위 종료와 DEV-31 인계

- [DEV-30 검증/판정](tasks/DEV-30.md#dev-30-close): D1 로컬 선행·실제 QA 차단 보존/D2 편집·PATCH 포함. 초기 독립 Major2/Minor1 FAIL과 마지막 자동 수정3/3 뒤1001 tests·lint/세 구성/Storybook·실제 mock browser·문서/두 리뷰 PASS. 실제6소유 부분0통과6차단·실제 이전/취소 링크 수락/메일 미실행은 별도이며 Git 전달은 실제 최종 head/PR에서 확인한다.
- 다음 하나는 [DEV-31 인계](tasks/DEV-31.md#dev-31-dev-30-selection)다. 기본 우선순위/표 순서와 DEV-27 선행 충족을 확인해 선정·첫 행동만 기록했다. 기존 P0/P1·앞선 P2 차단/보류·원본79/114Task/156의존을 유지한다. 전용 계약 조사·설계·제품/실제 API/QA·별도 Git 전달0이며 DEV-30 승인/예외를 승계하지 않는다.

## 2026-11-18 · DEV-31 로컬 범위 종료와 DEV-32 인계

- [DEV-31 종료/검증](tasks/DEV-31.md#dev-31-close): 이번 D1의 신청 목록/검토·직급/권한/대표자·승인/사유 거절·미확정/후속 조회/수명,1085 tests·lint/세 구성/Storybook·실제 Next mock/HTTP 대역·문서/Context Audit·두 리뷰 PASS. 최초 독립 Major1/수정3/3·도구/전송 경계·실제5소유 부분0통과차단을 보존한다. 종료 metadata freshness·최종 Git 전달은 검토/실제 PR/종료 보고에서 따로 확인한다.
- 다음 하나는 [DEV-32](tasks/DEV-32.md#dev-32-dev-31-selection)다. 기존 P0/P1·앞선 P2의 외부/선행 차단/보류와 기본 표 순서·DEV-27 충족을 확인한 선정/첫 행동만 인계했다. 전용 계약/설계·제품/실제 API·QA·별도 Git 전달0, 이번 승인/예외 승계0이다. 원본79/114Task/156의존과 기존 모든 정책/QA/차단·예외를 유지한다.

## 2026-11-18 · DEV-32 로컬 범위 종료와 POL-15 인계

- [DEV-32 종료](tasks/DEV-32.md#dev-32-close)에서 T04 직급 관리·로컬 1,125 tests/빌드/실제 Next·문서/두 리뷰 통과와 실제 API 4부분 차단을 확인한다. 첫 독립 검토의 U+FEFF 문제는 추가 승인으로 교정했다. PR 최종 head, CI와 main 반영은 전달 기록과 원격 PR을 확인한다.
- [POL-15](tasks/POL-15.md#pol-15-dev-32-handoff)는 높은 우선순위의 기존 외부/선행 차단을 보존한 뒤 기본 표 순서상 첫 독립 정책 후보다. POL-14 선행 충족과 이후 DEV-33의 정책 의존을 확인했다. 이번 작업에서 정책 조사나 구현을 시작하지 않았다.

## 2026-11-18 · POL-15 목적지 정책과 DEV-33 인계

- [사용자 D1](tasks/POL-15.md#pol-15-brief)으로 수락 완료 후 현재 소속과 실제 조회 권한에 따른 `/my/team`·`/my/company`·`/bids`와 읽기 재시도 기준을 확정했다. 앱 변경이나 실업무 통합 없이 정책·문서 판정을 기록한다. [확정 정책](tasks/POL-15.md#pol-15-contract) · [검증 및 리뷰](reviews/POL-15.md)
- P0/P1과 앞선 P2의 기존 우선순위·차단·선행 대기를 보존했다. 정책과 DEV-27이 선행인 [DEV-33](tasks/DEV-33.md#dev-33-pol-15-handoff) 하나를 선정했다. O11 구현과 TEAM-23/24·AUTH-16/17의 실행 자원·검증 범위는 DEV-33 요구사항 Gate에서 확인한다. [종료 및 다음 첫 행동](tasks/POL-15.md#pol-15-close)

## 2026-11-20 · DEV-33 로컬 범위 종료와 POL-16 인계

- [DEV-33 종료](tasks/DEV-33.md#dev-33-close). POL-15의 권한별 CTA와 응답 미확정/세션·화면 수명을 구현했다. 로컬 테스트 1,158건, lint·3개 구성 빌드·Storybook, 브라우저, 문서와 두 리뷰를 통과했다. 첫 독립 검토의 로그인 복귀 회귀와 교정 근거를 보존한다. TEAM-23/24의 실제 2부분 차단, AUTH-16 차단과 초대 AUTH-17 미실행은 [QA](../../qa/team-members.md#dev-33-local-qa)에 남겼다.
- 다음은 [POL-16](tasks/POL-16.md#pol-16-dev-33-handoff) 하나다. 기존 P0/P1과 앞선 P2의 차단·선행 대기를 적용한 기본 표 순서에서 POL-12·POL-14가 충족된 첫 정책 후보다. 선정과 첫 행동만 넘겼다.

## 2026-11-20 · POL-16 정책 확정과 DEV-34 인계

- [정책과 사용자 결정](tasks/POL-16.md#pol-16-contract) 및 [검증·리뷰](reviews/POL-16.md)를 연결했다. 원본·인증 회사의 통합, 두 단계 검토, 전체·부분 반영, 거절·충돌·승계/복구의 기준을 확정했다. [MERGE-01~16](../../qa/company-merge.md#pol-16-merge-qa)은 미실행이다. DEV-37의 실제 거절 사유 조회 계약과 철회·재발송의 Linear 등록 차단을 구분한다.
- 기존 P0/P1 및 앞선 P2의 차단·미충족 선행을 보존했다. POL-16과 DEV-28이 선행인 [DEV-34](tasks/DEV-34.md#dev-34-pol-16-handoff)를 표 순서의 다음 한 작업으로 선정했다. 인계 범위는 첫 요구사항 Gate까지이며 전용 조사·구현·QA 또는 Git 전달 착수는 다음 대화에서 판단한다.

## 2026-11-20 · DEV-34 로컬 검증 종료와 QA-14 인계

- [DEV-34 종료](tasks/DEV-34.md#dev-34-close)에서 현재 회사 통합 사건, 최신 권한과 revision에 따른 신청·제안·응답, 기한·현재 상태와 오류 재확인의 구현/로컬 PASS를 확인한다. 최초 독립 Major와 추가 승인 1회, 1,202건·브라우저·문서·두 리뷰를 기록했다. 실제 MERGE-01~04는 0통과·4차단이다. [QA 기록](../../qa/company-merge.md#dev-34-local-qa)
- 다음 하나는 [QA-14](tasks/QA-14.md#qa-14-dev-34-handoff)다. DEV-35의 DEV-08 선행 차단과 이전 우선순위의 외부/선행 대기를 적용한다. 준비 조건이 충족된 QA-14의 선정·첫 행동을 인계했다. 작업 상태와 검증 범위는 각각 WBS와 해당 Task 기록을 따른다.

## 2026-11-20 · QA-14 검증 종료와 POL-17 인계

- [설정 홈 회귀](../../qa/my-settings-home.md#qa-14-local-regression)에서 기존 MSET 7건의 현행 로컬 동작, 회사 정보·서류함·팀원·회사 통합 메뉴, 로그인 복귀, 320/390px와 키보드를 확인했다. 시안의 로그아웃 팝업 차이는 미결이며 기존 실제 MSET-02 재확인 대기를 보존한다. [검증·리뷰](reviews/QA-14.md)
- 기존 우선순위와 선행 차단을 적용해 DOC-001을 충족한 첫 P2 후보 [POL-17](tasks/POL-17.md)를 선정했다. [인계 기록](tasks/QA-14.md#qa-14-handoff)에 조회·변경 필드와 본인 확인, 소셜 계정 비밀번호 지원 여부의 첫 확인 범위를 남겼다.

## 2026-11-20 · POL-17 종료와 DEV-38 인계

- [POL-17 D1](tasks/POL-17.md#pol-17-contract)으로 현행 세션의 연락용 이메일 조회와 Figma S02 이메일 ‘인증하기’ 생략을 정했다. 계정 수정·별도 재인증은 계약 확보 후 재검토하고 Google-only 정책에 따라 비밀번호 팝업은 미연결이다. [문서 검증과 리뷰](reviews/POL-17.md) · [미실행 QA 계획](../../qa/my-settings-home.md#pol-17-account-qa)
- 기존 우선순위와 차단을 적용하면 POL-17을 충족한 [DEV-38](tasks/DEV-38.md#dev-38-pol-17-handoff)이 다음 첫 후보다. /my 계정 카드와 세션을 확인하고 본인 연락용 이메일 조회의 상세 경로·검증 자원을 정하는 첫 행동을 인계했다.

## 2026-11-20 · DEV-38 조회 검증과 POL-18 인계

- `/my/settings/account`에서 현재 세션의 본인 연락용 이메일을 조회한다. [로컬 ACCT-01~07과 실제 ACCT-08](../../qa/my-settings-home.md#dev-38-account-qa)·[두 리뷰](reviews/DEV-38.md)를 통과했다. 실제 조회·복원 응답과 현재 실행 digest 미확인, 실제 로그아웃 응답 미확인을 기록했다.
- 먼저 배치된 P0/P1과 P2의 외부 차단 및 선행 조건을 유지한다. POL-14·POL-17을 충족한 [POL-18](tasks/POL-18.md#pol-18-dev-38-handoff)을 다음 요구사항 Gate로 선정했다. 계정 탈퇴의 인증·회사 권한·보존/삭제를 정책 범위로 인계했다.

## 2026-11-20 · POL-18 백엔드 계약 대기와 POL-19 인계

- [POL-18 사용자 답변](tasks/POL-18.md#pol-18-brief)과 [재개 계약](tasks/POL-18.md#pol-18-contract)은 서비스 탈퇴의 자격·회사·세션/데이터 처리를 백엔드 책임으로 연결한다. 인증 방식과 화면 예외는 보류됐고 탈퇴 전용 계약 및 데이터·재가입·철회 기준이 필요하다. DEV-39/40의 선행 대기와 [WDRAW 9사례 미실행](../../qa/my-settings-home.md#pol-18-withdrawal-qa)을 기록했다. [문서 검증·리뷰](reviews/POL-18.md)
- 높은 우선순위의 기존 차단과 앞선 P2 선행을 적용했다. DOC-001이 충족된 [POL-19](tasks/POL-19.md#pol-19-pol-18-handoff)의 선정과 첫 행동을 인계했다.

## 2026-11-20 · POL-19 정책 정합성 확인과 DEV-41 인계

- [POL-19](tasks/POL-19.md#pol-19-contract)에서 08:30 KST 맞춤 이메일과 공고별 내부 알림, 대체 수신 이메일 인증의 3분/60초 범위를 기록했다. DEV-66은 기존 승인에 따라 세 항목과 상세·야간 비활성 화면을 다룬다. 실제 활성화는 효과·명세·QA 선행을 확인한다. NSET-07 및 NREC 6건의 기존 실제 QA 차단을 보존한다. [검증과 리뷰](reviews/POL-19.md)
- 우선순위와 기존 차단·선행 조건을 적용해 [DEV-41](tasks/DEV-41.md#dev-41-pol-19-handoff) 하나를 선정했다. mock 인증시간·재전송과 개발 가이드 교정의 첫 행동만 인계했다.

## 2026-11-20 · DEV-41 검증 종료와 POL-20 인계

- [DEV-41](tasks/DEV-41.md#dev-41-close)에서 대체 수신 이메일 mock의 3분·60초, 다섯 번째 오입력 차단과 이전 요청·번호 무효화를 검증하고 개발 가이드를 동기화했다. [로컬 및 HTTP 대역](../../qa/notification-email-recipient.md#dev-41-local-qa) 검증과 [두 리뷰](reviews/DEV-41.md)를 통과했다. 실제 NSET-07 및 NREC 6건의 기존 차단을 보존한다.
- DOC-001을 충족한 [POL-20](tasks/POL-20.md#pol-20-dev-41-handoff)이 기존 높은 우선순위 차단과 앞선 P2 선행을 적용한 표 순서의 첫 후보다. 받은 알림 삭제·숨김·보존 정책의 요구사항 Gate만 다음 대화에 인계했다.

## 2026-11-20 · POL-20 수동 삭제 정책과 DEV-43 인계

- [POL-20](tasks/POL-20.md#pol-20-contract)은 MAT-254 사용자 승인과 현행 계약을 근거로 본인 알림 단건·선택·전체의 논리 삭제와 목록·미확인 수의 재조회 원칙을 기록했다. 7일 안내·자동 만료·물리 파기 및 복구는 소유 결정에 보류하고, 기존 ALARM 이력과 [NDEL 9건의 미실행 계획](../../qa/alarms.md#pol-20-alarm-deletion-qa)을 남겼다. [문서 검증과 리뷰](reviews/POL-20.md)
- 기존 P0/P1 차단과 앞선 P2 선행을 적용해 POL-20을 충족한 [DEV-43](tasks/DEV-43.md#dev-43-pol-20-handoff)을 선정했다. 다음 범위는 받은 알림 화면과 삭제 계약 연결이다. 첫 행동인 현행 계약·실행 대응·QA 승인 확인을 인계했다.

## 2026-11-20 · DEV-43 받은 알림 삭제와 POL-21 인계

- [DEV-43](tasks/DEV-43.md#dev-43-close)의 `/alarms` 선택·전체 삭제를 기존 공급원에 연결하고 목록과 헤더의 재조회, 키보드·모바일, 중복 제출과 일반 오류를 검증했다. 실제 NDEL은 0통과·9차단이다. [QA](../../qa/alarms.md#dev-43-local-qa) · [검증과 리뷰](reviews/DEV-43.md)
- 앞선 우선순위의 차단과 선행 조건을 적용해 [POL-21](tasks/POL-21.md#pol-21-dev-43-handoff)을 다음으로 선정했다. 가입 실적·인증의 직접 입력, 검증과 저장 계약을 확인하는 첫 행동을 인계했다.

## 2026-11-20 · POL-21 가입 실적 보정 정책과 POL-22 인계

- [POL-21](tasks/POL-21.md#pol-21-contract)에서 두 가입 경로의 금액·대표면허·인증 3종을 선택적으로 보정하고, 조회 출처와 입력값을 따로 추적하며, 회사 등록과 보정을 한 번에 확정하는 정책을 기록했다. 같은 등록 후보에서 임시값을 보존하고, 입력 없이 다음으로 가는 동작과 미확인 표현의 화면 예외를 정했다. [문서 검증·리뷰](reviews/POL-21.md)
- [DEV-44](tasks/DEV-44.md#dev-44-pol-21-contract-gate)는 등록·보정의 공동 저장 계약, 실행 버전과 QA 자원을 확보해야 재개할 수 있다. [O09 검증 9건](../../qa/auth.md#pol-21-o09-qa)은 미실행이고 기존 AUTH 차단을 유지한다.
- 기존 높은 우선순위와 앞선 P2 차단·선행을 적용해 POL-06을 충족한 [POL-22](tasks/POL-22.md#pol-22-pol-21-handoff)를 선정했다. 가져올 회사 조건과 개인 필터 적용·저장의 요구사항 Gate를 첫 행동으로 인계했다.

## 2026-11-23 · POL-22 회사 조건 가져오기 정책과 DEV-64 인계

- [POL-22](tasks/POL-22.md#pol-22-contract)는 현재 소속 회사의 활성 지역·업종·희망금액을 투영해, 사용자 확인 뒤 계정 필터를 전체 교체하고 `내 맞춤`으로 목록에 별도 적용하는 정책을 확정했다. 전부 결측이면 개인 값을 보존하고 소유자 권한 확인 전에는 기능 노출을 보류한다. [문서 검증과 두 리뷰](reviews/POL-22.md)
- [DEV-45](tasks/DEV-45.md#dev-45-pol-22-gate)는 DEV-08 및 권한·전체 결측·동일 소속의 서버 계약 선행을 기다린다. [CIMP 10건](../../qa/personal-bid-filter.md#pol-22-company-import-qa)은 미실행이며 기존 QA-10 실제 12차단을 보존한다.
- 앞선 우선순위와 선행 조건을 적용해 POL-29를 충족한 첫 P2 [DEV-64](tasks/DEV-64.md#dev-64-pol-22-handoff)를 다음 Task로 선정했다. 공개 상세에서 본문·사이드 폭/간격과 단위 전환 위치를 대조하고, 승인된 입찰분류 선택과 URL을 보존하는 것이 첫 행동이다. 선정과 인계 범위다.

## 2026-11-23 · DEV-64 상세 화면과 DEV-66 인계

- [DEV-64 종료](tasks/DEV-64.md#dev-64-close)는 승인된 792/16/372px 배치와 breadcrumb 우측 전환기, 320/390px 내부 스크롤, 분류·회차·페이지 URL, 알림 팝업 초점 복귀를 로컬에서 검증했다. [검증·두 리뷰](reviews/DEV-64.md) · [상세 QA](../../qa/bid-detail.md#dev-64-local-qa). 신규 실서버 통합 0건이며 기존 QA-03/09의 차단을 유지한다.
- 먼저 배치된 P0/P1과 앞선 P2의 차단 및 미충족 선행 조건을 적용했다. POL-29와 POL-19를 충족한 첫 P2 [DEV-66](tasks/DEV-66.md#dev-66-dev-64-handoff)의 자체 요구사항 Gate를 인계했다. 세 설정 항목과 지원되는 맞춤 이메일, 전역 상세·야간 비활성 화면의 근거 확인이 첫 행동이다.

## 2026-11-23 · DEV-66 세 설정 항목과 POL-23 인계

- [DEV-66](tasks/DEV-66.md#dev-66-close)의 수신처와 세 설정 항목, 맞춤 이메일 저장·인증, 상세·야간의 비활성 설명과 요청·저장 0건을 로컬에서 검증했다. [QA](../../qa/notification-settings.md#dev-66-local-qa) · [두 리뷰](reviews/DEV-66.md). 실제 기존 QA-12 1차단과 QA-13 6차단, 상세·야간의 활성화 선행을 보존한다.
- 상위 P0~P2의 차단 및 선행 미충족을 반영한 뒤, DOC-001이 완료된 첫 P3 [POL-23](tasks/POL-23.md#pol-23-dev-66-handoff)을 선정했다. 최근·추천 검색어의 공급원 및 기록 보존·삭제 정책을 정하는 Gate를 인계한다.

## 2026-11-23 · POL-23 검색어 정책과 DEV-47 인계

- [POL-23 정책](tasks/POL-23.md#pol-23-contract)은 공개 보기의 최근 검색어를 같은 탭 메모리에 최신순 5개·항목당 30분으로 제한한다. 빈 입력·삭제 화면 예외와 관리형 추천의 소유자·확정 목록·갱신 기준 확보 전 미노출을 기록했다. [문서 검증과 두 리뷰](reviews/POL-23.md) · [BKEY 8건 미실행 계획](../../qa/bid-list.md#pol-23-search-term-qa)
- 상위 우선순위의 차단·미충족 선행을 적용하면 POL-23을 충족한 [DEV-47](tasks/DEV-47.md#dev-47-pol-23-handoff)이 첫 P3 후보다. 기존 검색·세션 및 탭 수명 확인으로 최근 검색어 요구사항 Gate를 여는 첫 행동을 인계했다.

## 2026-11-23 · DEV-47 공개 최근 검색어와 POL-24 인계

- [DEV-47](tasks/DEV-47.md#dev-47-close)은 공개 3개 보기의 최근 검색어, 단건·전체 삭제, 탭 및 인증 경계를 적용했다. BKEY 로컬 8통과와 두 리뷰를 기록했고 실제 QA-02 이력과 관리형 추천의 선행을 보존했다. [QA](../../qa/bid-list.md#dev-47-local-qa) · [검토](reviews/DEV-47.md)
- P0~P2의 차단·미충족 선행을 적용한 뒤, DOC-001이 끝난 첫 P3 정책인 [POL-24](tasks/POL-24.md#pol-24-dev-47-handoff)를 선정했다. O02의 MVP 지원 여부와 지원 시 OAuth·계정 경계의 소유 근거를 확인하는 첫 행동을 인계했다.

## 2026-11-23 · POL-24의 MVP 인증 범위와 POL-25 인계

- [POL-24](tasks/POL-24.md#pol-24-contract)는 승인된 중앙 ADR에서 Google 단독 지원과 O02 준비 중 표시를 확인했다. [문서 검증과 두 리뷰](reviews/POL-24.md) · [인증 QA 범위](../../qa/auth.md#pol-24-o02-qa) · [DEV-48 재개 조건](tasks/DEV-48.md#dev-48-pol-24-handoff)
- P0~P2의 차단·미충족 선행을 보존하고 MVP에서 제외된 DEV-48 다음으로, DOC-001이 완료된 첫 P3 정책 [POL-25](tasks/POL-25.md#pol-25-pol-24-handoff)를 선정했다. 이용안내의 승인된 콘텐츠·운영 책임·접근 조건과 목적지 확인을 인계했다.

## 2026-11-24 · POL-25 배포 버전 팝업 정책과 POL-26 인계

- [POL-25 결정](tasks/POL-25.md#pol-25-contract)으로 인증된 설정에서 실제 웹 배포 버전과 공식 최신 여부를 보여주는 팝업을 선택했다. [DEV-49](tasks/DEV-49.md#dev-49-pol-25-gate)는 공식 출처·갱신 책임·조회 실패 기준을 기다린다. [문서 검증과 두 리뷰](reviews/POL-25.md) · [S07 6건 미실행](../../qa/my-settings-home.md#pol-25-s07-qa).
- 상위 우선순위 차단·미충족 선행과 DEV-49의 외부 조건을 적용했다. DOC-001을 충족하는 첫 P3 정책 [POL-26](tasks/POL-26.md#pol-26-pol-25-handoff)의 선정과 첫 행동을 기록했다.

## 2026-11-24 · POL-26 공통 의견 링크 정책과 DEV-50 인계

- [POL-26의 승인 범위](tasks/POL-26.md#pol-26-contract)에서 설정·공개 FAQ의 의견 배너에 같은 기존 Google Forms 링크를 쓰기로 했다. 응답 운영은 D3에 따라 별도 범위다. 폼은 비로그인 상태로 열람했고 앱 연결과 제출은 미실행이다. [검증과 두 리뷰](reviews/POL-26.md) · [S08 링크 QA 계획 5건](../../qa/qna.md#pol-26-s08-qa)
- 상위 우선순위의 차단과 미충족 선행, DEV-48 보류·DEV-49의 외부 조건을 적용하면 POL-26을 충족한 [DEV-50](tasks/DEV-50.md#dev-50-pol-26-handoff)이 첫 P3 작업이다. 두 진입에서 공통 링크를 여는 후속 기준과 첫 행동을 인계했다.

## 2026-11-24 · DEV-50 공통 의견 링크와 POL-27 인계

- 인증 설정과 공개 FAQ의 의견 링크를 공통 배너에 연결했다. 1,258개 테스트, lint·Next·Storybook 빌드, [S08 브라우저 QA](../../qa/qna.md#dev-50-local-qa), [두 리뷰](reviews/DEV-50.md)를 통과했다. 실제 Mate OAuth·업무 API와 폼 제출·운영은 미실행이다. [완료 범위](tasks/DEV-50.md#dev-50-close)
- P0~P2의 차단과 미충족 선행, DEV-48 보류·DEV-49 차단을 반영했다. DOC-001이 완료된 P3 중 표 순서가 가장 앞선 [POL-27](tasks/POL-27.md#pol-27-dev-50-handoff)을 선정했다. W01·W02의 시안·현행 GNB·발행 근거를 자체 Gate에서 확인하도록 인계했다.

## 2026-11-24 · POL-27 공개 조회 정책과 POL-28 인계

- [POL-27의 승인 정책](tasks/POL-27.md#pol-27-contract)은 백엔드 API의 발행 글을 사용자 웹에서 로그인 없이 읽는 범위다. 문서 검증·두 리뷰를 연결했고, 실제 목록 API·개발 배포 선행은 [DEV-51](tasks/DEV-51.md#dev-51-pol-27-handoff)에, DEV-51과 상세 계약은 [DEV-52](tasks/DEV-52.md#dev-52-pol-27-handoff)에 보존했다.
- 상위 우선순위의 남은 차단과 선행, DEV-48 보류·DEV-49 차단과 DEV-51·52의 계약 조건을 보존했다. DOC-001을 충족한 P3 독립 후보 중 표에서 앞선 [POL-28](tasks/POL-28.md#pol-28-pol-27-handoff)을 선정하고 자체 Gate의 첫 확인만 인계했다.

## 2026-11-24 KST · POL-28 부분 결정과 DEV-54 인계

- 사용자가 C03의 공통 이미지와 공개 메타데이터 기준을 승인했다. 정식 운영 주소 확정 전까지 D1 적용을 보류했으므로 POL-28의 주소 기준과 DEV-53 선행은 남아 있다. [결정과 재개 조건](tasks/POL-28.md#pol-28-contract) · [문서 검증과 리뷰](reviews/POL-28.md)
- 상위 P0~P2의 차단·미충족 선행, DEV-48 보류, DEV-49·51 차단, DEV-52·53의 미충족 선행을 적용했다. DOC-001을 충족한 P3 [DEV-54](tasks/DEV-54.md#dev-54-pol-28-handoff)를 선정하고 자체 Gate의 첫 행동만 인계했다.

## 2026-11-24 KST · DEV-54 로컬 검증과 QA-15 인계

- [DEV-54](tasks/DEV-54.md#dev-54-close)는 정상 상세와 입찰 목록·상세 공용 오류의 본문 랜드마크를 교정했다. 자동 검사, [격리 Chrome](../../qa/bid-detail.md#dev-54-local-qa), 문서 검사 및 [두 리뷰](reviews/DEV-54.md)를 근거로 해당 단위를 완료했다. 기존 QA-03의 실백엔드 통합 상태를 보존한다.
- P0~P2의 미충족 선행과 차단, P3의 계약·정책 조건을 유지한다. DOC-001을 충족한 [QA-15](tasks/QA-15.md#qa-15-dev-54-handoff)를 조건 재확인 대상으로만 선정한다. 다음 자체 Gate에서 관련 정적 화면·공유 UI 변경 또는 출시 회귀 범위를 확인한다. QA-15의 보류 상태를 유지한다.

## 2026-11-25 KST · QA-15 회귀 검증과 DEV-12 인계

- DEV-50의 공개 FAQ 변경으로 [QA-15](tasks/QA-15.md#qa-15-brief)를 착수했다. 세 폭의 홈·FAQ·공용 UI 기능 9건과 문서 검증을 통과했다. 기존 320px 홈 가림, hydration 관찰과 Figma 버튼 차이를 [실행과 두 리뷰](reviews/QA-15.md)에 남겼다. 실서버 통합과 출시 전수 검증은 미실행이다.
- P0·P1의 차단과 미충족 선행을 유지한다. P2에서 POL-07이 완료됐고 RESULT 전용 금액 계약이 11/13에 관찰된 [DEV-12](tasks/DEV-12.md#dev-12-qa-15-handoff)를 재개 조건 확인 대상으로 선정한다. 기존 보류는 유지한다. 이번 인계의 범위는 다음 작업과 첫 행동 지정이다.

## 2026-11-25 KST · DEV-12 재개 조건 확인과 QA-01 인계

- [DEV-12](tasks/DEV-12.md#dev-12-gate)에서 RESULT 전용 조회 입력과 개발 배포 문서를 확인했다. 정수의 포함 경계와 소수 결과가 공존해 시안의 미만 구간을 현행 계약으로 정확히 표현할 수 없다. 화면 적용과 실제 QA 범위 결정을 요청했다.
- 선행이 충족된 대기 작업이 없는 상태에서 P0 표 순서 첫 재개 확인 후보 [QA-01](tasks/DEV-12.md#dev-12-handoff)을 선정했다. 실제 5차단과 기존 승인 범위를 유지한다.

## 2026-11-25 KST · DEV-12 승인 범위 검증과 QA-01 인계 유지

- [DEV-12](tasks/DEV-12.md#dev-12-close)에서 RESULT 낙찰금액 구간·직접 입력·URL·HTTP와 mock을 연결했다. 1,273개 자동 테스트, [로컬 Chrome 15건](../../qa/bid-list.md#dev-12-local-qa), [두 리뷰](reviews/DEV-12.md)를 통과했다. 실제 서버는 신규 실행 0건이며 차단을 보존한다.
- 다음 작업은 사용자가 범위를 확인한 [QA-01](tasks/DEV-12.md#dev-12-handoff)이다. PREP-01 선행과 실제 4통과·5차단을 근거로 HOME-02~06의 합성 자료와 실행 식별자 확인부터 인계했다.

## 2026-11-25 KST · QA-01 재개 점검과 QA-02 인계

- [QA-01](tasks/QA-01.md#qa-01-20261125-evidence)은 공개 `ALL`의 첫 9행과 Chrome의 카드 순서·표시, 다른 기관명이 있는 행의 수요기관 우선 표시를 확인했다. HOME-02~06과 실행 버전 대응은 차단이다. 11/02의 4통과·5차단과 QA-01의 기존 진행 예외를 보존한다.
- 선행이 충족된 대기 작업이 없어 PREP-01을 충족한 P0 표 순서의 [QA-02](tasks/QA-01.md#qa-01-20261125-handoff)를 다음 재개 확인 후보로 선정했다. 기존 차단을 유지하며 미해결 6건의 자원·실행 식별자 확인을 인계한다.

## 2026-11-25 KST · QA-02 재개 점검과 QA-03 인계

- [QA-02](tasks/QA-02.md#qa-02-20261125-evidence)는 공개 목록을 12개 조건으로 조회하고 실제 응답과 Chrome의 9개 상태를 대조했다. 기존 실제 10통과·6차단과 QA-02 진행 예외를 유지한다. 물품·개찰결과·경계·결측·분류 자료와 실행 식별자가 필요하다. [목록 QA](../../qa/bid-list.md#qa-02-20261125-list)
- PREP-01을 충족한 P0 표 순서의 다음 재개 확인 후보는 [QA-03](tasks/QA-02.md#qa-02-20261125-handoff)이다. 기존 1통과·8차단을 유지하고 상세·개찰·품목·첨부의 자료와 실행 식별자 확인을 인계한다.

## 2026-11-25 KST · QA-03 재개 점검과 QA-05 인계

- [QA-03](tasks/QA-03.md#qa-03-20261125-evidence)에서 공사·용역·정정·재입찰의 실제 상세 4개와 관련 공고·첨부 링크·404를 Chrome에서 대조했다. 첨부 영역의 로컬 실패와 복구를 구분해 기록했다. 승인 자료·분류·물품·개찰·취소·실행 식별자 공백으로 기존 실제 1통과·8차단을 유지한다. [상세 QA](../../qa/bid-detail.md#qa-03-20261125-detail)
- 선행이 충족된 대기 작업이 없다. P0에서 완료된 QA-04 다음이며 PREP-01·QA-04를 충족한 [QA-05](tasks/QA-03.md#qa-03-20261125-handoff)를 재개 조건 확인으로 선정한다. 회사·인증의 기존 차단과 승인 조건을 적용해 다음 대화에서 자체 요구사항 Gate부터 확인한다.

## 2026-11-25 KST · QA-05 재개 점검과 QA-06 인계

- [QA-05](tasks/QA-05.md#qa-05-20261125-evidence)는 회사 검색·소속 신청·기본정보의 현행 계약과 실제 비로그인 401을 확인했고, 회사 등록·찾기 시작 동선을 격리 브라우저에서 재현했다. 상태별 실제 자료·신청/알림 정리 승인·실행 식별자는 미확보다. 기존 실제 MCO 4통과·6차단과 AUTH-07/08 차단을 유지한다.
- 선행을 충족한 대기 작업이 없다. P0에서 다음 순서이고 PREP-01·QA-04를 충족한 [QA-06](tasks/QA-05.md#qa-05-20261125-handoff)을 재개 조건 확인으로 선정했다. QA-05에서 사용자가 승인한 진행 예외를 적용한다. QA-06의 2차단을 유지하고 합성 번호·계정·회사, 조회 연결/등록의 변경·정리 범위와 실행 식별자 확인을 인계했다.

## 2026-11-25 KST · QA-06 재개 점검과 QA-07 인계

- [QA-06](tasks/QA-06.md#qa-06-20261125-evidence)은 번호 연결·보강·미인증 등록의 현행 계약과 가입 표시를 대조했다. Node 계약 테스트를 통과했다. 승인된 합성 자원, 연결·등록별 정리와 실행 대응이 미확보라 기존 실제 AUTH-14/15 0통과·2차단을 유지한다. [인증 QA](../../qa/auth.md#qa-06-20261125-auth)
- 선행을 충족한 대기·준비 작업이 없어 P0 표 순서의 [QA-07](tasks/QA-06.md#qa-06-20261125-handoff)을 재개 조건 확인으로 선정했다. PREP-01·QA-04와 기존 선정 예외를 적용했으며, QA-07의 기존 차단을 유지하고 자체 Gate의 첫 행동을 인계했다.

## 2026-11-25 KST · QA-07 재개 점검과 QA-08 인계

- [QA-07](tasks/QA-07.md#qa-07-20261125-evidence)은 가입 문서 업로드·OCR·공식 검증·회사 등록의 소유 계약과 게시 명세, 기존 Node 계약 테스트를 대조했다. 승인된 합성 자원·데이터 정리·스토리지/worker와 실행 버전 대응이 미확보라 기존 실제 AUTH-09~13 0통과·5차단과 문서 AUTH-17 미실행을 유지한다. [인증 QA](../../qa/auth.md#qa-07-20261125-auth)
- 선행을 충족한 대기·준비 작업이 없다. 다음 P0 [QA-08](tasks/QA-07.md#qa-07-20261125-handoff)은 PREP-01·QA-04와 기존 선정 예외를 충족한다. 기존 차단을 유지하고 다음 대화의 재개 조건 확인만 인계한다.

## 2026-11-25 KST · QA-08 재개 점검과 QA-09 인계

- [QA-08](tasks/QA-08.md#qa-08-20261125-evidence)은 미리보기·복귀·수락·거절의 현행 계약과 Node 테스트를 확인했다. 승인된 계정·초대, 실제 링크 Origin·실행 대응, 초대 소비·소속 변경 및 정리 근거 미확보로 기존 실제 AUTH-16 0통과·1차단과 초대 화면 AUTH-17 미실행을 유지한다. [인증 QA](../../qa/auth.md#qa-08-20261125-auth)
- 선행을 충족한 대기·준비 작업이 없다. PREP-01·QA-04를 충족하는 다음 P0인 [QA-09](tasks/QA-09.md)를 기존 사용자 선정 예외에 따라 재개 조건 확인 대상으로 지정한다. 기존 차단을 유지하며 자체 Gate의 첫 행동을 인계한다. [선정 근거와 인계](tasks/QA-08.md#qa-08-20261125-handoff)

## 2026-11-25 KST · QA-10 재개 점검과 QA-11 인계

- [QA-10](tasks/QA-10.md#qa-10-20261125-evidence)은 최신 백엔드·게시 계약과 Node 계약 테스트, 목록의 쓰기 UI 제거를 확인했다. 승인된 계정·쓰기 절차·데이터 및 실행 근거의 공백으로 PBF-01~12는 기존 실제 0통과·12차단을 유지한다. [사례별 재개 조건](../../qa/personal-bid-filter.md#pbf별-재개-조건)
- 이번 다음 작업 선정은 선행 PREP-01·QA-04가 완료된 P0 [QA-11](tasks/QA-11.md)의 재개 요구사항 확인이다. 기존 차단과 ALARM-04/05의 조건을 보존한다. [선정 근거와 인계](tasks/QA-10.md#qa-10-20261125-handoff)

## 2026-11-25 KST · QA-11 재개 점검과 QA-12 인계

- [QA-11](tasks/QA-11.md#qa-11-20261125-evidence)에서 목록·미확인 수·읽음의 정렬/집계/저장 계약과 합성 Node 검사를 확인했다. 승인된 계정·합성 알림과 읽음 복구·오류·실행 대응 공백으로 실제 0통과·재검증 8차단, ALARM-04의 과거 차단과 ALARM-05 보류를 보존한다. [사례별 근거](../../qa/alarms.md#qa-11-20261125-alarms)
- 선행을 충족한 대기·준비 작업이 없다. PREP-01·QA-04가 완료된 다음 P0 [QA-12](tasks/QA-12.md)를 기존 사용자 선정 예외에 따라 재개 요구사항 확인 대상으로 지정한다. NSET-07의 실제 오류 검증은 차단을 유지한다. [선정 근거와 첫 행동](tasks/QA-11.md#qa-11-20261125-handoff)

## 2026-11-26 KST · QA-12 재개 점검과 QA-13 인계

- [QA-12](tasks/QA-12.md#qa-12-20261126-evidence)는 수신처 조회와 맞춤 이메일 ON/OFF 조회·저장의 현행 계약을 Node 합성 검사와 대조했다. 안전한 4xx/5xx 재현·해제, 승인된 계정·변경·복구와 실행 식별자 대응이 미확보라 NSET-07의 실제 0통과·1차단과 기존 6통과·1대기를 보존한다. [사례 근거와 복구 조건](../../qa/notification-settings.md#qa-12-20261126-nset)
- 선행을 충족한 대기·준비 작업이 없다. PREP-01·QA-04가 완료된 다음 P0인 [QA-13](tasks/QA-13.md)을 [11월 5일 사용자 선정 예외](tasks/QA-12.md#qa-12-next-qa-13-exception)에 따라 재개 요구사항 확인으로 지정했다. QA-13의 실제 6차단을 유지하며 Mailpit·계정·수신처·오류·복구와 실행 대응 확인을 인계한다. [선정 근거와 첫 행동](tasks/QA-12.md#qa-12-20261126-handoff)

## 2026-11-26 KST · QA-13 재개 점검과 POL-01 인계

- [QA-13](tasks/QA-13.md#qa-13-20261126-evidence)의 수신처·시작·재전송·확인 계약을 현행 개발 소스/Swagger와 대조했다. 제한 열람·테스트 자원 및 변경/복구 승인·안전한 실패·실행 대응이 미확보여서 실제 0통과·6차단과 기존 3통과·6대기를 보존한다. [사례별 조건](../../qa/notification-email-recipient.md#qa-13-20261126-nrec)
- 선행을 충족한 대기·준비 작업은 없다. P0 표의 다음인 [POL-01](tasks/POL-01.md#pol-01-resume)은 DOC-001이 완료됐고 [2026-11-05 사용자 선정 예외](tasks/QA-13.md#qa-13-next-pol-01-exception)의 대상이다. 정책 자료·기존 동의 전환·푸터 정보의 차단은 유지하며 재개 요구사항 확인만 인계한다. [선정 근거와 첫 행동](tasks/QA-13.md#qa-13-20261126-handoff)

## 2026-11-26 KST · POL-01 문서 출처와 기존 테스트 동의 결정

- 사용자가 정식 문서 후보 두 곳을 제공하고 기존 테스트 동의의 이관·재동의를 범위에서 제외했다. 승인 버전·적용일·읽기 전용 공개 주소와 푸터 정보가 필요해 POL-01 정책 Gate는 차단을 유지한다. [결정](tasks/POL-01.md#pol-01-20261126-decisions)
- 선행을 충족한 대기·준비 작업이 없어 다음 작업은 P0의 POL-01 재개다. 정식 공개 자료 확인과 가입 계약 대응을 인계한다. 아직 대기 중인 DEV-01·DEV-02·QA-16은 기존 선행을 따른다. [선정과 첫 행동](tasks/POL-01.md#pol-01-20261126-handoff)

## 2026-11-26 KST · POL-01 정책 확정과 DEV-01 인계

- 사용자가 두 원문, 시행일의 별도 문서 관리와 푸터 시안의 실제 공개값을 확정했다. 기존 테스트 계정의 재동의 제외와 신규 가입의 서버 동의 버전 사용을 보존한다. [승인과 적용 기준](tasks/POL-01.md#pol-01-approved-policy)
- P0의 다음 작업은 DEV-01이다. 공개 뷰어 권한 및 서버 등록 버전의 원문 대응이 미확보여서 공개 연결은 차단 상태다. DEV-02와 QA-16의 선행을 보존한다. 이번에는 다음 Task의 선정·인계까지다. [첫 행동](tasks/POL-01.md#pol-01-final-handoff)

## 2026-11-26 KST · DEV-01 공개 연결 재개 점검과 인계

- 두 승인 원문과 제목이 일치하는 Drive 문서의 `anyone/writer`, 개발 가입 계약과 버전 불일치 `409`를 확인했다. 공개 뷰어 주소, 원문별 현재 동의 버전과 실제 신규 가입 QA 조건을 기다린다. 기존 AUTH-02·03의 임시 약관 검증 이력을 보존한다. [DEV-01 근거와 재개 조건](tasks/DEV-01.md#dev-01-20261126-readiness) · [인증 QA](../../qa/auth.md#dev-01-20261126-qa)
- 선행이 충족된 대기·준비 Task가 없어 위 조건을 확인할 P0 DEV-01을 다음으로 유지한다. DEV-02와 QA-16은 기존 선행을 따른다. [선정 근거와 첫 행동](tasks/DEV-01.md#dev-01-20261126-handoff)

## 2026-11-26 KST · DEV-01 승인 URL 연결과 남은 실제 가입 검증

- 사용자 결정에 따라 현행 Google 문서 두 곳을 기존 약관 경로에 연결했다. 비로그인 새 탭과 합성 가입을 검증했으며 대상 환경의 승인 원문·서버 버전 대응과 실제 QA는 차단 상태다. [승인과 검증](tasks/DEV-01.md#dev-01-20261126-link-release) · [AUTH-02·03](../../qa/auth.md#dev-01-20261126-url-qa)
- 선행을 충족한 대기·준비 작업이 없어 첫 확인은 DEV-01의 실제 정식 동의로 유지한다. DEV-02와 QA-16의 선행은 기존 표를 따른다. [다음 확인 항목](tasks/DEV-01.md#dev-01-20261126-resume)

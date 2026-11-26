# Mate 브라우저 통합 테스트 펀치리스트

Figma 화면과 실제 API가 함께 동작하는지 확인할 때 이 디렉터리를 사용한다. 코드 빌드, 단위 검증, mock 화면 확인과 실제 브라우저 통합 검증의 결과를 섞지 않는다. 환경이 준비되기 전에는 통합 항목을 `대기`로 둔다.

## 파일 구성

- [`prep-01-readiness.md`](./prep-01-readiness.md): QA-01~13의 2026-10-28 문서 기반 준비 점검, 실행 식별자 확보 방법·담당 역할·승인/복구 공백과 조건부 실행 순서. 실제 통합 실행 결과는 아님
- [`punchlist-template.md`](./punchlist-template.md): 모든 신규 기능에 복사할 공통 양식
- [`repositories.md`](./repositories.md): 7개 공급원 전환의 자동 테스트·mock 브라우저·HTTP 대역 결과와 실제 API 검증의 구분
- [`repository-review.md`](./repository-review.md): 전환 작업의 context-audit·verifier·ai-review 기록
- [`auth.md`](./auth.md): 13_가입 화면의 로그인·회원가입·회사 온보딩·초대 수락
- [`auth.md` QA-08 재개 점검](./auth.md#qa-08-20261125-auth): 초대 수신의 현행 계약·Node 검증·실제 재개 조건. 실제 AUTH-16 0통과·1차단과 초대 화면 AUTH-17 미실행을 유지한다.
- [`bid-list.md`](./bid-list.md) · 공개 입찰공고의 전체·마감임박·개찰결과, 필터·검색·페이지 및 로그인 맞춤 목록
- [`personal-bid-filter.md`](./personal-bid-filter.md): 계정별 맞춤 필터의 조회·적용·저장·초기화·버전 충돌
- [`bid-detail.md`](./bid-detail.md): 공개 입찰공고 상세의 분류·개찰결과·첨부·연관공고·오류 상태
- [`bid-alert.md`](./bid-alert.md): 상세의 계정별 공고 알림 설정·해제·로그인 복귀·오류 상태
- [`my-bid-notice-alerts.md`](./my-bid-notice-alerts.md): 마이페이지 ‘알림 설정 공고’ 목록의 전체 조회 API 차단 사항과 후속 검증 항목
- [`home.md`](./home.md): 홈 전체 입찰공고 카드·상태·상세 이동과 홈 진입
- [`alarms.md`](./alarms.md)에는 받은 알림 목록·읽음의 기존 QA, [POL-20 삭제 계획](./alarms.md#pol-20-alarm-deletion-qa), [DEV-43 로컬 검증과 실제 9사례 차단](./alarms.md#dev-43-local-qa)이 있다. 7일 안내는 정책 대기다.
- [`notification-settings.md`](./notification-settings.md): 마이페이지 맞춤 공고 이메일 설정 조회·변경과 로그인 안내
- [`notification-email-recipient.md`](./notification-email-recipient.md): 알림 수신 주소 선택, 대체 주소 인증·재전송·전환
- [`my-settings-home.md`](./my-settings-home.md): 설정 및 관리 첫 화면, 알림 설정 진입·로그아웃·로그인 복귀
- [`my-company.md`](./my-company.md): 나의 회사 정보의 미연결·신청·연결 상태와 회사 선택 진입
- [`company-documents.md`](./company-documents.md): POL-13의 계약 경계/DBOX22 미실행 계획과 DEV-22 목록·DEV-23 상세/원본의 로컬 mock/HTTP 대역·브라우저 증거. 가입 AUTH/실제 API 사례와 구분
- [`team-members.md`](./team-members.md#dev-27-local-qa): POL-14 TEAM26 원본 계획과 DEV-27 로컬 검증20PASS/추가1미실행·실제 조회 QA 차단. 기존 QA-08·후속 소유 범위와 구분
- [`team-members.md` DEV-28](./team-members.md#dev-28-local-qa): 직접/명시 동의·본인 변경/최후 관리자·알림/수명·가변 mock의 로컬 검증과 실제9소유 부분 차단. 이전 조회 QA/다른 소유 범위의 예외를 확대하지 않음
- [`team-members.md` DEV-29](./team-members.md#dev-29-local-qa): 초대 생성/보낸 목록·상세·입력/권한·배송 상태, 공유 mock 경쟁·실제 Next mock/loopback HTTP의 로컬 검증과 실제7소유 부분 차단. 원본 TEAM26·수신 AUTH-16/17과 후속 재발송/취소 소유는 보존
- [`team-members.md` DEV-32](./team-members.md#dev-32-local-qa)에서 회사 직급 목록·추가·이름 변경·삭제의 실제 Next mock/로컬 HTTP 검증 및 실제 API 4개 부분의 차단과 재개 조건을 확인한다.
- [`company-merge.md`](./company-merge.md#pol-16-merge-qa)에 POL-16의 원본 QA 계획과 [DEV-34 로컬 검증·실제 차단](./company-merge.md#dev-34-local-qa)이 있다.
- [`qna.md`](./qna.md): 자주 묻는 질문의 정책 문구·아코디언·모바일·의견 배너
- 이후 기능마다 `docs/qa/<기능-slug>.md`를 하나씩 만들고 아래 목록에 추가한다.

## 기능 목록

| 기능 | 화면/경로 | Figma 기준 | 펀치리스트 | 통합 상태 |
| --- | --- | --- | --- | --- |
| 가입·로그인·회사 온보딩 | `/auth/**` | [13_가입, 3140:117483](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.0?node-id=3140-117483) | [auth.md](./auth.md) | QA-04 인증 한정 PASS와 회사 업무 QA를 구분. 2026-11-02 [QA-08 사전 점검](auth.md#qa-08-20261102): AUTH-16 실제0통과·1차단·초대 AUTH-17 미실행. 초대/계정·Origin·사용/소비/membership·잔존/복구·실행 대응 미확보, 실제 실행 불승인. [QA-07 사전 점검](auth.md#qa-07-20261102): AUTH-09~13 실제0통과·5차단·문서 AUTH-17 미실행. 합성 문서/계정·storage/OCR/충돌·변경/잔존/복구·실행 대응 미확보. [QA-06](auth.md#qa-06-20261102) AUTH-14/15 0통과·2차단, QA-05 AUTH-07 부분/08 차단 및 다른 업무 이력 보존. 2026-11-25 [QA-06 재점검](auth.md#qa-06-20261125-auth)은 번호 연결·등록의 현행 계약과 차단 사례별 재개 조건을 연결한다. [QA-07 재점검](auth.md#qa-07-20261125-auth)은 업로드·OCR·등록 계약과 재개 조건을 연결하며 실제 5차단 및 문서 화면 AUTH-17 미실행을 유지한다. |
| 홈 | `/` | [00_메인, 2016:57355](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2016-57355) | [home.md](./home.md) | 2026-11-26 실제 첫 9행과 Chrome 두 폭을 대조했다. 기존 4통과·5차단을 보존한다. HOME-02~06의 합성 공고·기대값과 실행 버전 대응이 필요하다. [재개 점검](home.md#qa-01-20261126-home) |
| 공개 입찰공고와 로그인 맞춤 목록 | `/bids` · `/bids?view=recommended` | [공개 목록 2201:18147](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2201-18147) · [맞춤 목록 3003:47410](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3003-47410) | [bid-list.md](./bid-list.md) | 공개 목록의 물품·결과·경계·분류·실행 식별자가 남아 기존 10통과·6차단이다. 맞춤 목록의 계정·조건·검색 여정은 DEV-03의 로컬 증거를 따르고 실제 RBD 0통과·9차단은 공동 일정에 남긴다. [공개 목록 재개 점검](bid-list.md#qa-02-20261125-list) · [맞춤 목록 QA](bid-list.md#dev-03-local-qa) |
| 계정별 개인 맞춤 필터 | `/bids`의 `ALL` | [01_입찰공고리스트, 2201:18147](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2201-18147) | [personal-bid-filter.md](./personal-bid-filter.md) | 2026-11-25 [QA-10 재개 점검](personal-bid-filter.md#qa-10-20261125-filter). Node 계약과 목록의 계정 쓰기 UI 제거를 확인했다. 기존 실제 0통과·12차단을 유지한다. [11월 4일 차이 기록](personal-bid-filter.md#qa-10-20261104)과 [DEV-63 로컬 교정](personal-bid-filter.md#dev-63-local-qa), 현행 쓰기 절차·계정·매칭·오류·잔존/복구·실행 대응의 재개 조건을 따른다. |
| 입찰공고 상세 | `/bids/[bidId]` | [02_입찰공고상세, 2201:18858](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2201-18858) | [bid-detail.md](./bid-detail.md) | 2026-11-25 [재개 점검](bid-detail.md#qa-03-20261125-detail). 실응답과 Chrome에서 상세 4개·관련 공고·첨부 링크·404를 대조했다. [기존 실제 1통과·8차단](bid-detail.md#qa-03-20261102)을 유지한다. 분류·물품·취소·개찰·첨부 스트림·실제 오류·실행 버전이 남았다. |
| 공고별 알림 설정 | `/bids/[bidId]` | [설정 카드 3210:112734](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=3210-112734) | [bid-alert.md](./bid-alert.md) | 2026-11-25 [QA-09 재개 점검](bid-alert.md#qa-09-20261125-alert). 개발 계약과 Node 대역을 확인했다. 현재 실제 0통과·8차단, 최초 0통과·8대기와 [11월 3일 기록](bid-alert.md#qa-09-20261103)을 보존했다. 승인된 계정·공고와 초기/종료값·오류·복구·실행 대응을 확보한 뒤 실제 업무 요청을 검증한다. |
| 알림 설정 공고 목록 | `/my`에서 진입, 상세 경로 미정 | [9.0.0 마이페이지 진입 메뉴, 3139:52490](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.0?node-id=3139-52490) | [my-bid-notice-alerts.md](./my-bid-notice-alerts.md) | 백엔드 전체 목록 계약 대기·미구현 |
| 알림 | `/alarms` | [10_알림, 2304:29129](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2304-29129) | [alarms.md](./alarms.md) | 2026-11-25 [QA-11 재개 점검](alarms.md#qa-11-20261125-alarms)에서 현행 계약과 Node 대역을 확인했다. 승인된 계정·합성 21건 이상·읽음 잔존/정리·오류·실행 대응 미확보로 실제 0통과·재검증 8차단을 유지한다. [11월 5일 이력](alarms.md#qa-11-20261105)과 ALARM-04/05는 각각 보존한다. |
| 맞춤 공고 이메일 설정 | `/my/settings/notifications` | [9.2.0 알림 설정, 3139:52591](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=3139-52591) | [notification-settings.md](./notification-settings.md) | 2026-11-26 [QA-12 재개 점검](notification-settings.md#qa-12-20261126-nset)에서 현행 계약과 Node 합성 검사를 확인했다. 시작 ON/OFF가 확인된 테스트 계정, 실제 4xx/5xx의 재현·해제, 설정 복구와 잔존 승인, 실행 버전 대응 미확보로 NSET-07 실제 0통과·1차단을 유지한다. [11월 5일 사전 점검과 기존 6통과·1대기](notification-settings.md#qa-12-20261105)도 보존한다. |
| 알림 수신 이메일 인증·전환 | `/my/settings/notifications` | [9.2.0 알림 설정, 3139:52591](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=3139-52591) | [notification-email-recipient.md](./notification-email-recipient.md) | 2026-11-26 [QA-13 재개 점검](notification-email-recipient.md#qa-13-20261126-nrec) · 현행 계약과 Node 합성 15건 확인. 실제 실행 0건·신규 통과 0건·6건 차단, 과거 3통과·6대기와 [Mailpit·승인 이력](notification-email-recipient.md#qa-13-20261105) 보존. 제한 열람·계정/수신처·오류·잔존/복구 승인과 실행 버전 대응 필요 |
| 자주 묻는 질문 | `/qna` | [11_자주묻는질문, 2314:31201](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.0?node-id=2314-31201) | [qna.md](./qna.md) | 목 기반 브라우저 화면 7건 통과, Q&A API 없음 |
| 설정 및 관리 첫 화면 | `/my` | [9.0.0 설정 및 관리, 3139:52490](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.0?node-id=3139-52490) | [my-settings-home.md](./my-settings-home.md) | 2026-09-28 기존 화면 7건 통과, 새 회사 메뉴 재확인 대기 |
| 본인 계정 정보 조회 | `/my/settings/account` | [계정 관리 S02, 3139:53049](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-53049) | [DEV-38 QA](./my-settings-home.md#dev-38-account-qa) | 본인 연락용 이메일의 로컬 상태·실제 QA 계정 조회와 세션 복원 확인. 현재 실행 digest 미확인은 DEV-38의 사용자 결정에 따라 기록한다. |
| 나의 회사 정보 | `/my/company`, `/my/company/start` | [미연결 3162:51271](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.0?node-id=3162-51271) 외 3개 상태 | [my-company.md](./my-company.md) | 2026-11-02 QA-05 조회 4통과·6차단（이전 0통과·5차단·5대기 보존）. 상태별 계정/회사·검색 fixture/신청 변경·복구·실행 버전 잔여로 전체 통합 차단. AUTH-07 부분 확인/08 차단 별도. 2026-11-25 [회사 재점검](my-company.md#qa-05-20261125-company)과 [회사 찾기·신청](auth.md#qa-05-20261125-auth)은 비로그인 응답·격리 화면과 현행 계약을 기록한다. |
| 가입 후 서류함 | `/my/documents`·`/my/documents/[documentId]`(DEV-22/23)·후속 처리 별도 | [서류함 3135:75612](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75612) 외 POL-13 지정 상태 | [company-documents.md](./company-documents.md#dev-22-local-qa) | 2026-11-16 DEV-22/23 각각의 사용자 로컬 선행 범위·실제 Next/mock/loopback HTTP·모바일/키보드. DEV-23은[상세 근거](./company-documents.md#dev-23-local-qa)와 실제6차단이며 두 후속 고유 실제0통과·12차단/다른10대기. 당시 DEV-22 8차단/다른14대기·원본22계획·가입/회사 QA/추가·OCR 계약 Gate 보존 |
| 팀원 권한·초대·합류·직급 | `/my/team`·`/my/team/[membershipId]`(조회), 나머지 route는 후속 자체 Gate | [팀원 3137:52702](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52702) 외 POL-14 지정 상태 | [team-members.md](./team-members.md#pol-14-team-qa) | 2026-11-17 DEV-27 로컬 조회/계약·브라우저20PASS/추가1미실행. 실제0통과·DEV-27 조회 부분6차단/나머지 소유 대기. 합성 자원·실행 대응/열람·복구 Gate 미확보. 기존 AUTH-16 0통과1차단·초대 AUTH-17 미실행 및 QA-08/회사/다른 Task 차단 보존 |
| 회사 간 통합 | G01 `/my/company-merge` | [G01~G03 지정 상태](../development/figma-v01/tasks/POL-16.md#pol-16-contract) | [DEV-34](./company-merge.md#dev-34-local-qa) | 실제 0통과·DEV-34 4차단·후속 12미실행. 실행 버전 대응·합성 사건·사용/잔존/복구 승인과 DEV-37 거절 사유 조회 계약이 필요하다. |

새 Figma 기능이나 화면을 구현할 때 실제 통합 테스트가 미뤄졌다면 해당 기능의 펀치리스트 파일을 즉시 만든다. 위 목록의 `미작성`은 검증 완료를 뜻하지 않는다. 기능이 늘면 같은 표에 행을 추가한다. 하나의 화면에서 정상·빈 상태·오류·권한·모바일 등 서로 다른 결과가 나오면 별도 case ID를 쓴다.

공개 입찰공고 목록·홈·상세의 실제 데이터가 필요한 브라우저 통합 항목은 개발자 결정에 따라 테스트 공고가 준비된 뒤 진행한다. 준비 전에는 해당 펀치리스트의 `대기` 상태를 유지한다.

## 공통 기록 규칙

1. case ID는 `<기능 약어>-<두 자리 번호>`로 고정한다. 수정해도 ID는 재사용하지 않는다.
2. 각 case에는 **Figma node**, 화면 경로, HTTP method/endpoint, 준비 데이터, 실제 사용자 조작, 예상 UI/API 결과를 적는다. API가 없는 정적 화면도 `API 없음`으로 명시한다.
3. 상태는 `대기`, `차단`, `실패`, `통과` 중 하나다. `차단`에는 환경·계정·API 등의 원인과 담당자를 적는다.
4. 실행할 때 프론트 배포 식별자 또는 commit, 백엔드 배포 식별자, 테스트 URL, 브라우저·화면 크기, 시각을 기록한다. 결과가 달라진 배포를 같은 증거로 취급하지 않는다.
5. 증거에는 화면 캡처와 비밀값을 제거한 Network 요청/응답 요약, 관련 issue를 링크한다. access token, 쿠키, 초대 token, presigned URL, 개인정보, `.env` 값은 저장하지 않는다.
6. 한 기능의 항목이 모두 `통과`이거나 승인된 예외로 분류되기 전에는 그 기능의 브라우저 통합 검증을 완료로 표시하지 않는다.

## 실행 환경 준비 기준

- 현재 브라우저 통합 검증 프론트는 이 Mac의 `https://local.mate-bid.com:3000`, 테스트 API는 `https://api-test.mate-bid.com`이다. 공개 테스트 사이트 `https://dev.mate-bid.com`의 인증 Origin은 별도 확인 전까지 검증 범위에 포함하지 않는다.
- 로컬 검증 시 `/etc/hosts`의 `127.0.0.1 local.mate-bid.com` 항목과 이 호스트 전용 HTTPS 인증서가 필요하다. 인증서/개인 키는 저장소 밖에 두고, Next.js는 아래 명령으로 실행한다. 이 Mac의 인증서는 2027-09-27에 만료된다. 인증서 신뢰 설정은 다른 개발자 Mac에 자동 적용되지 않는다.

  ```bash
  pnpm dev --experimental-https \
    --experimental-https-key "$HOME/Library/Application Support/mate-frontend/local-https/local.mate-bid.com.key" \
    --experimental-https-cert "$HOME/Library/Application Support/mate-frontend/local-https/local.mate-bid.com.crt" \
    -H 127.0.0.1
  ```

  Next.js의 `allowedDevOrigins`는 Mate 개발 서버에만 적용된다. `/etc/hosts`와 사용자 키체인의 인증서 신뢰는 이 Mac 전체의 해당 호스트에 적용되므로, 다른 프로젝트가 같은 `local.mate-bid.com` 이름이나 3000 포트를 동시에 사용하면 충돌할 수 있다. Safari에서는 이 인증서를 신뢰하지만 별도 CA 저장소를 쓰는 CLI는 필요하면 인증서 파일을 명시해야 한다.

- 백엔드가 정확한 프론트 Origin을 허용하고 credentialed CORS 응답과 필요한 `Authorization`, `Content-Type`, `Idempotency-Key` preflight를 처리한다.
- Google OAuth 시작, 프론트 callback/signup 반환, 테스트 계정, refresh·signup·invitation 쿠키가 같은 브라우저에서 이어진다. `localhost:3000`은 API와 다른 site이므로 현재 SameSite 설정에서는 별도 확인 없이 동등한 테스트 환경으로 간주하지 않는다.
- 증명서 업로드를 검증할 때는 API 외에 presigned storage `PUT`의 CORS와 필수 서명 header도 확인한다.
- 회사 등록·초대·통합 요청은 실제 데이터를 변경하므로 백엔드 담당자와 테스트용 회사/계정·정리 방법을 먼저 정한다.

정적 검증이나 mock 브라우저 확인은 해당 기능 문서의 별도 메모에만 기록한다. 실제 API를 사용한 브라우저 통합 테스트가 끝나기 전까지 위 표의 `대기`를 `통과`로 바꾸지 않는다.

## 2026-11-05 · POL-04 대상 화면 이동 정책/검증 계획 인계

- [POL-04 v1 사용자3결정](../development/figma-v01/tasks/POL-04.md#pol-04-decisions)은 공고 상세/나의 회사 허용 경로·안전한 폴백·읽음/이동 순서만 확정했다. 제품 구현/실제 통합 또는 기존 알림 QA 통과가 아니다.
- [알림 ANAV-01~10](alarms.md#pol-04-navigation-qa)은 신규 계획10건 모두 대기·미실행이다. DEV-06 미구현이며 배포 계약/실행 대응·합성 자원·사용/변경/잔존/복구·오류 해제를 확보해야 한다. 기존 ALARM-01~10·QA-11 판정/차단/예외와 분리한다.
- 이번 정책 Task는 실제 로그인/업무 API/브라우저·fixture 변경·서비스 운영/배포를 실행하지 않았다. source에 삭제 계약이 있다는 새 관찰을 배포 완료나 기존 ALARM-04 차단 해소로 세지 않는다. 다음 Task의 Gate/검증은 새 대화에서 시작한다.

2026-11-09 DEV-06의 로컬 구현·Node/mock/HTTP 대역/Chrome 결과는 [별도 실행 기록](alarms.md#dev-06-local-qa)에 추가했다. 사용자 자원 미준비 답변에 따라 실제 ANAV-01~10은0통과·10차단으로 보존한다. 기존 ALARM/QA-11 결과와 Git 전달·실제 통합을 구분한다.

2026-11-13 DEV-56의 [공통 헤더 QA](my-settings-home.md#dev-56-header-qa)는 로컬 HUI-01~17과 사용자 직접 로그인 뒤 실제 일반 HAPI-01~06을 통과했다. 특수 실제 HAPI-07~10은 미실행·서버 실행 SHA 대응 미확인을 유지한다. 기존 MSET/QA-14/다른 QA의 판정을 바꾸지 않는다.

2026-11-16 DEV-24의 [서류 재업로드 로컬 QA](company-documents.md#dev-24-local-qa)는 사용자 D1의 재업로드만 로컬 선행·신규 추가/실통합 차단 범위다. Node/실제 Next mock/loopback HTTP를 실제 파일/OCR·권한/서버 통합과 구별하고, DBOX-11~15/21~22는0통과·7차단이다. DEV-22/23의 기존 실제 차단과 합쳐 고유17차단/5대기를 보존하며 원본22개 계획/기존 가입·회사 QA를 덮어쓰지 않는다.

- DEV-30 기존 초대의 [로컬 편집·재발송/취소와 실제6부분 차단](team-members.md#dev-30-local-qa): mock/HTTP 대역·실제 Next 결과와 실제 메일/이전 링크/수신 통합을 구별한다.
- DEV-31 받은 합류 신청의 [로컬 승인/사유 거절과 실제5소유 부분 차단](team-members.md#dev-31-local-qa): mock·HTTP 대역·실제 Next 검증과 신청자 상태/다른 pending·초대 정리의 실제 통합을 구별한다.
- DEV-33의 [초대 완료 목적지 QA](team-members.md#dev-33-local-qa)와 [AUTH 회귀](auth.md#dev-33-auth-regression)는 로컬 브라우저·HTTP 대역 결과다. 실제 TEAM-23/24의 DEV-33 두 부분과 기존 AUTH-16은 차단, 초대 AUTH-17은 미실행이다.

2026-11-20 [QA-14 설정 홈 회귀](my-settings-home.md#qa-14-local-regression)에서 현재 메뉴·알림 설정·로그아웃 후 `/my` 복귀·320/390px를 로컬 mock과 HTTP 대역으로 확인했다. Figma의 로그아웃 확인 팝업 차이와 기존 MSET-02의 실제 재확인 대기는 해당 기록에 남겼다.

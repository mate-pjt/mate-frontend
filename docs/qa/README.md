# Mate 브라우저 통합 테스트 펀치리스트

Figma 화면과 실제 API가 함께 동작하는지 확인할 때 이 디렉터리를 사용한다. 코드 빌드, 단위 검증, mock 화면 확인과 실제 브라우저 통합 검증의 결과를 섞지 않는다. 환경이 준비되기 전에는 통합 항목을 `대기`로 둔다.

## 파일 구성

- [`punchlist-template.md`](./punchlist-template.md): 모든 신규 기능에 복사할 공통 양식
- [`auth.md`](./auth.md): 13_가입 화면의 로그인·회원가입·회사 온보딩·초대 수락
- [`bid-list.md`](./bid-list.md): 공개 입찰공고 목록의 전체·마감임박·개찰결과, 필터·검색·페이지와 준비 중 상태
- [`personal-bid-filter.md`](./personal-bid-filter.md): 계정별 맞춤 필터의 조회·적용·저장·초기화·버전 충돌
- [`bid-detail.md`](./bid-detail.md): 공개 입찰공고 상세의 분류·개찰결과·첨부·연관공고·오류 상태
- [`bid-alert.md`](./bid-alert.md): 상세의 계정별 공고 알림 설정·해제·로그인 복귀·오류 상태
- [`my-bid-notice-alerts.md`](./my-bid-notice-alerts.md): 마이페이지 ‘알림 설정 공고’ 목록의 전체 조회 API 차단 사항과 후속 검증 항목
- [`home.md`](./home.md): 홈 전체 입찰공고 카드·상태·상세 이동과 홈 진입
- [`alarms.md`](./alarms.md): 받은 알림 목록·읽음 처리와 삭제 API 누락·보류된 7일 안내
- [`notification-settings.md`](./notification-settings.md): 마이페이지 맞춤 공고 이메일 설정 조회·변경과 로그인 안내
- [`notification-email-recipient.md`](./notification-email-recipient.md): 알림 수신 주소 선택, 대체 주소 인증·재전송·전환
- [`my-settings-home.md`](./my-settings-home.md): 설정 및 관리 첫 화면, 알림 설정 진입·로그아웃·로그인 복귀
- [`qna.md`](./qna.md): 자주 묻는 질문의 정책 문구·아코디언·모바일·의견 배너
- 이후 기능마다 `docs/qa/<기능-slug>.md`를 하나씩 만들고 아래 목록에 추가한다.

## 기능 목록

| 기능 | 화면/경로 | Figma 기준 | 펀치리스트 | 통합 상태 |
| --- | --- | --- | --- | --- |
| 가입·로그인·회사 온보딩 | `/auth/**` | [13_가입, 3140:117483](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.0?node-id=3140-117483) | [auth.md](./auth.md) | 대기 |
| 홈 | `/` | [00_메인, 2016:57355](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2016-57355) | [home.md](./home.md) | 대기 |
| 공개 입찰공고 목록·맞춤 준비 중 | `/bids` | [01_입찰공고리스트, 2201:18147](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2201-18147) | [bid-list.md](./bid-list.md) | 대기 |
| 계정별 개인 맞춤 필터 | `/bids`의 `ALL` | [01_입찰공고리스트, 2201:18147](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2201-18147) | [personal-bid-filter.md](./personal-bid-filter.md) | 0건 통과·12건 대기 (OAuth 시작 오류 해소, 필터 재검증 필요) |
| 입찰공고 상세 | `/bids/[bidId]` | [02_입찰공고상세, 2201:18858](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2201-18858) | [bid-detail.md](./bid-detail.md) | 대기 |
| 공고별 알림 설정 | `/bids/[bidId]` | [설정 카드 3210:112734](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=3210-112734) | [bid-alert.md](./bid-alert.md) | 대기 |
| 알림 설정 공고 목록 | `/my`에서 진입, 상세 경로 미정 | [9.0.0 마이페이지 진입 메뉴, 3139:52490](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.0?node-id=3139-52490) | [my-bid-notice-alerts.md](./my-bid-notice-alerts.md) | 백엔드 전체 목록 계약 대기·미구현 |
| 알림 | `/alarms` | [10_알림, 2304:29129](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=2304-29129) | [alarms.md](./alarms.md) | 일부 통과·나머지 대기/차단 |
| 맞춤 공고 이메일 설정 | `/my/settings/notifications` | [9.2.0 알림 설정, 3139:52591](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=3139-52591) | [notification-settings.md](./notification-settings.md) | 실제 API·모바일·네트워크 실패 통과, 서버 오류 응답 대기 |
| 알림 수신 이메일 인증·전환 | `/my/settings/notifications` | [9.2.0 알림 설정, 3139:52591](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.1?node-id=3139-52591) | [notification-email-recipient.md](./notification-email-recipient.md) | 인증 전 모바일·키보드와 발송 시작 통과, 인증 완료·전환은 Mailpit 열람 대기 |
| 자주 묻는 질문 | `/qna` | [11_자주묻는질문, 2314:31201](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.0?node-id=2314-31201) | [qna.md](./qna.md) | 목 기반 브라우저 화면 7건 통과, Q&A API 없음 |
| 설정 및 관리 첫 화면 | `/my` | [9.0.0 설정 및 관리, 3139:52490](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.0?node-id=3139-52490) | [my-settings-home.md](./my-settings-home.md) | 이번 범위 7건 통과, 하위 화면은 준비 중 |

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

# 가입·로그인 브라우저 통합 테스트

## 기준과 상태

- Figma: [13_가입, 3140:117483](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.0?node-id=3140-117483)
- API: [테스트 Swagger UI](https://api-test.mate-bid.com/swagger-ui/index.html), `GET /v3/api-docs`
- 화면: `/auth`, `/auth/callback`, `/auth/signup`, `/auth/start`, `/auth/company/**`
- 정적 검증: `pnpm lint`, `pnpm build` 통과. 로컬 모형 응답으로 로그인·등록 방법·번호 조회·증명서 업로드 UI를 확인했다. 실제 백엔드와의 로그인·가입 **여정 케이스 17개는 아직 전체 통과로 판정하지 않았다**. 아래 Origin 연결 사전 점검과 부분 브라우저 실행은 케이스 통과로 세지 않는다.
- 현재 검증 환경: 로컬 `https://local.mate-bid.com:3000` → `https://api-test.mate-bid.com`. 공개 `https://dev.mate-bid.com`은 인증 Origin 등록 확인 후 별도로 검증한다.
- 부분 실행 기록에는 프론트 체크아웃, 브라우저, 일시를 적었다. 백엔드 배포 식별자·화면 크기는 미확인이다. 계정은 테스트 전용이며 회사 테스트 데이터는 아직 준비되지 않았다.

## Origin 연결 사전 점검 (2026-09-27)

- 격리된 Chrome 브라우저에서 로그인 쿠키 없이 `credentials: include`로 `POST /api/v1/auth/token/refresh`를 호출했다. 헤더의 `Origin`은 브라우저가 페이지 주소에서 생성했으며 테스트 코드에서 지정하지 않았다.
- `https://local.mate-bid.com:3000/auth`: HTTP 401 `SESSION_INVALID` 응답을 브라우저에서 읽었다. 응답의 `Access-Control-Allow-Origin`은 정확히 `https://local.mate-bid.com:3000`, `Access-Control-Allow-Credentials`는 `true`였다. 이 사전 점검 시점에는 다른 API·로그인 쿠키를 사용하는 세션 복원·Google OAuth를 검증하지 않았다. 이후 확인은 아래 부분 실행 기록을 따른다.
- `https://dev.mate-bid.com`: 같은 `fetch`는 CORS 오류로 응답을 읽지 못했다. 같은 페이지에서 브라우저 form POST로 다시 요청한 결과 HTTP 403 `INVALID_REQUEST_ORIGIN`이었다. 배포 도메인의 인증 API 허용은 아직 차단 상태다.
- 첫 점검에는 브라우저 한정 DNS 매핑과 임시 HTTPS 프록시를 사용했다. 이후 이 Mac의 `/etc/hosts`에 `local.mate-bid.com`만 추가하고, 저장소 밖에 이 호스트 전용 HTTPS 인증서를 만들었다. 사용자 키체인에는 해당 인증서의 `local.mate-bid.com` SSL 신뢰 설정만 추가했다. Next.js 자체 HTTPS 서버가 Safari에서 안전한 연결로 로그인 화면을 제공한다.
- Safari에서 `https://local.mate-bid.com:3000/auth`를 열어 `credentials: include`로 refresh API를 호출했고 401 응답을 JavaScript에서 읽었다. JSON `Content-Type`을 보낸 요청도 401 응답을 읽었다. 이는 쿠키 없는 요청의 Origin/CORS 연결 증거이며 Google 로그인·세션 복원 통과로 세지 않는다. `allowedDevOrigins` 적용 후 Safari 콘솔에서 `[HMR] connected`와 Fast Refresh 완료를 확인했다.
- 당시 확인한 `storage:documentAllowedOrigins`는 인증 API의 Origin 설정과 별개였다. 이후 백엔드 `dev`의 MAT-234에서 인증 허용 목록 `mate.auth.http.allowedFrontendOrigins`와 OAuth 시작 요청의 `returnOrigin` 검증이 도입됐다. 이 절의 단일 `frontend-origin` 관찰은 9/27 소스 기준이며 현재 계약으로 사용하지 않는다. 테스트 초대 메일 링크의 `https://dev.mate-bid.com` 적용 여부는 AUTH-16에서 별도로 확인한다.

## Safari 로그인 부분 실행 (2026-09-27 18:10 KST)

- 환경: 이 Mac의 Safari 26.6.2, 프론트 체크아웃 `71a1099` + 현재 미커밋 변경, `https://local.mate-bid.com:3000` → `https://api-test.mate-bid.com`. 백엔드 배포 식별자는 미확인이다. 계정 식별자와 OAuth 코드·쿠키·토큰은 기록하지 않았다.
- 사용자가 Safari에서 Google 계정 선택 후 `/auth/signup`의 가입폼에서 임시 약관 동의·제출까지 직접 완료했다고 확인했다. 이어 브라우저가 `/auth/start?next=%2Fbids%3Fview%3Drecommended`의 “반가워요! 메이트를 어떻게 시작할까요?” 화면으로 돌아왔다. 신규 가입(AUTH-02)의 성공 경로와 OAuth의 신규 계정 귀환만 부분 확인했다. 브라우저 Network의 가입 요청·약관 code/version, 동의 누락 시 제출 차단, 취소·오류 경로는 미실행이다. 로그인 화면의 네이버 버튼은 비활성이었다.
- “메이트 시작하기”를 누르면 `/bids?view=recommended`로 이동하고 로그인 상태의 로그아웃 버튼과 맞춤공고 준비 중 화면이 보였다. AUTH-06의 바로 시작 경로만 확인했다.
- 해당 화면을 새로고침하면 잠시 세션 확인 표시 후 로그아웃 버튼이 다시 나타났다. AUTH-05의 세션 복원 경로만 확인했으며 토큰 만료·동시 로그아웃·보호 화면 차단은 미실행이다.
- 위 결과는 AUTH-02/05/06의 일부 조건과 Google OAuth의 신규 계정 로컬 귀환에 대한 증거다. 모든 조건을 검증하기 전까지 아래 17개 케이스 상태는 `대기`로 유지한다.

## Safari 기존 계정 재로그인 부분 실행 (2026-09-27 18:16 KST)

- 같은 로컬 HTTPS 환경에서 로그아웃 버튼을 누르자 `/auth?mode=login&next=%2Fbids%3Fview%3Drecommended`로 이동했다. 로그인 화면의 네이버 버튼은 계속 비활성이었다.
- Google 버튼을 누른 뒤 사용자가 방금 가입한 것과 같은 Google 계정을 직접 선택했다. 브라우저는 `/bids?view=recommended`로 돌아왔고 로그아웃 버튼이 보였다. AUTH-01의 기존 계정 성공 경로와 AUTH-04의 성공 귀환, AUTH-05의 기본 로그아웃을 부분 확인했다.
- OAuth session completion 요청·쿠키 삭제를 Network에서 따로 기록하지 않았고, 취소·잘못된 callback·토큰 만료·로그아웃/refresh 경합도 실행하지 않았다. 이 단계까지의 화면 관찰만으로 세 케이스 전체를 통과 처리하지 않는다.

## 백엔드 dev OAuth 계약 반영 및 Chrome 재검증 (2026-09-29 오전 KST)

- 백엔드 소스 기준: `mate-pjt/mate-backend` `dev`의 MAT-234 변경 `5f8f84d2148c2ad34c52f89723376997c9361da9`, 확인 당시 `dev` HEAD `50dcd74079d7aa526efebbe54cd2db7ef91e325d`. 테스트 서버의 실제 실행 SHA는 확인하지 못했다. `GET /api/v1/auth/oauth/google/authorizations`는 비어 있지 않은 `returnOrigin`을 요구하며 허용된 프론트 Origin인지 검사한다. 9/29 Swagger UI에는 이 이름이 독립 필드로 보이지 않고 `returnTo`와 필수 `query` 객체만 표시됐다. 백엔드는 기존 계정 callback과 신규 계정 signup 귀환에 `flowId`를 넣고, 후속 session completion·가입 거래 조회·가입 완료 요청에도 이를 요구한다.
- 프론트: 현재 브라우저 Origin을 OAuth 시작 URL의 `returnOrigin`에 넣고, 귀환 `flowId`를 위 후속 요청에 전달했다. `returnTo`는 기존 내부 경로 검증을 유지한다. 두 귀환 화면에서 `flowId`가 빠지면 인증 요청 없이 재시작 안내를 표시한다.
- 로컬 `https://local.mate-bid.com:3000`의 Chrome에서 테스트 계정으로 Google 버튼을 눌렀다. Google 인증 뒤 신규 가입 화면에 도착했고, `GET /api/v1/auth/social-signups/current`로 확인된 가입 정보와 필수 동의 항목이 표시됐다. 사용자가 임시 약관 동의 및 테스트 계정 가입 제출을 승인한 후 필수 동의에 체크하고 제출했다. `/auth/start`로 이동했고, ‘메이트 시작하기’로 `/bids?view=recommended`의 로그인 상태와 로그아웃 버튼을 확인했다.
- 이어 로그아웃 후 동일 Google 계정으로 다시 로그인했다. `/auth/callback`의 진행 화면을 거쳐 `/bids?view=recommended`로 돌아왔고 로그아웃 버튼을 확인했다. 별도 탭에서 `flowId` 없는 `/auth/callback`과 `/auth/signup`을 열어 각각 재로그인 안내를 확인했다. 이는 변경된 OAuth 시작, 신규 가입 조회·완료, 기존 계정 session completion의 성공 경로와 `flowId` 누락 화면의 브라우저 증거다. OAuth URL, `flowId`, 쿠키, 토큰 및 계정 식별자는 기록하지 않았다.
- 브라우저 Network의 요청별 HTTP 상태·응답 본문, 테스트 서버 배포 ID, 화면 캡처 파일은 보관하지 않았다. 취소·만료·잘못된 `flowId`, 다른 Origin, 초대 복귀, 모바일, 회사 가입은 이 실행에서 검증하지 않았다. 따라서 17개 여정 전체를 통과로 올리지 않는다.

## Safari 회사 가입 읽기 전용 부분 실행 (2026-09-27 18:28 KST)

- 환경: 같은 Safari와 프론트 체크아웃 `71a1099` + 현재 미커밋 변경, `https://local.mate-bid.com:3000` → `https://api-test.mate-bid.com`. 백엔드 배포 식별자와 화면 크기는 미확인이다. 사용자가 계정은 테스트 전용이라고 확인했지만 회사·사업자번호·증명서·초대 계정 및 테스트 후 정리 방법은 아직 준비되지 않았다. 따라서 이 실행에서는 회사 데이터 변경 요청을 하지 않았다.
- AUTH-06: 로그인 세션에서 `/auth/start`의 회사 등록 선택으로 `/auth/company/register`, 기존 회사 찾기 선택으로 `/auth/company/search`에 이동했다. 바로 시작의 `/bids?view=recommended` 이동은 앞선 실행에서 확인했다. 세 선택의 기본 이동만 부분 확인했다.
- AUTH-07: 회사 찾기에서 빈 검색어의 조회 버튼이 비활성이었다. 합성 검색어 `MateQaNoMatch20260927`로 조회하자 “우리 회사, 아직 등록 전인가요?” 빈 결과와 `/auth/company/register` 링크가 나타났고 링크 이동도 확인했다. 구현은 `GET /api/v1/companies/search`를 사용하지만 Safari Network의 HTTP 상태·응답 본문은 따로 기록하지 않았다. 실제 회사 검색 결과·페이지 이동·오류·재시도는 미실행이다.
- AUTH-14: 사업자등록번호 등록 화면 진입 후 기존 조회 복원을 기다렸고 빈 입력 화면이 나타났다. 9자리 합성 숫자를 입력했을 때 조회 버튼이 비활성이었다. 10자리 번호를 제출하는 `POST`, 이후 보강·변경·재시도 흐름은 실행하지 않았다.
- AUTH-09: 증명서 등록 화면의 최근 30일 발급 안내, PDF/JPG/PNG·최대 10MB 안내와 파일 미선택 시 “정보 불러오기” 버튼 비활성을 확인했다. 파일 선택·업로드 요청은 실행하지 않았다.
- AUTH-03: `/auth/legal/terms`와 `/auth/legal/privacy`에서 각각 제목, “개발·테스트용 임시 본문 · 정식 약관이 아닙니다” 표시와 임시 문구를 확인했다. 가입폼 링크에서 여는 경로와 정식 본문/버전 전환은 확인하지 않았다.
- AUTH-08/10~13/15~16: 준비된 테스트 회사·사업자번호·증명서·초대 계정과 정리 방법이 없어 변경 요청 및 후속 상태 검증을 보류했다. 테스트 초대 링크의 기본 프론트 주소 설정도 AUTH-16 전에 확인해야 한다.

## 선행 조건

1. 현재 로컬 Origin의 refresh 연결과 Google OAuth 이후 로컬 주소 귀환은 확인했다. 테스트 초대 이메일 링크의 `https://dev.mate-bid.com` 적용 여부와 배포 반영은 여정별로 확인한다. 브라우저 Network에서 credentialed preflight(번호 변경의 `DELETE` 포함), refresh cookie, `Authorization`/`Content-Type`/`Idempotency-Key` 헤더를 검증한다. 공개 `https://dev.mate-bid.com`의 인증 Origin은 preflight 허용 응답만 관찰했고 실제 Google 여정은 별도 테스트 전까지 미확인으로 둔다.
2. Google OAuth의 기존 계정 성공 귀환은 확인했다. 테스트 사용자 권한, 쿠키 동작과 취소·오류 경로를 같은 브라우저에서 추가 확인한다.
3. 회사 등록용 테스트 사업자번호·증명서·계정, 초대 발송자/수신자, 중복·미인증·인증 회사 데이터와 정리 방법을 백엔드 담당자와 준비한다.
4. 증명서 경로의 presigned storage `PUT` CORS/서명 header와 OCR·검증 worker가 동작하는지 확인한다.
5. 신규 계정은 현재 **개발·테스트용 더미 약관 동의로 실제 가입이 가능**하다. 승인된 약관 본문/버전 도입과 기존 테스트 동의의 처리 정책은 별도 작업으로 추적한다.

## 케이스

각 케이스의 상태는 `대기`이며 위에 기록한 부분 브라우저 실행 외 조건은 미실행이다. 실행 시 case ID를 유지하고 `docs/qa/punchlist-template.md`의 환경·증거·결함 필드를 채운다.

| ID | Figma node | 화면·실제 API | 조작과 기대 결과 |
| --- | --- | --- | --- |
| AUTH-01 | `2306:88681` | `/auth`; `GET /api/v1/auth/oauth/google/authorizations` | Google 버튼이 현재 프론트 Origin을 `returnOrigin`, 내부 복귀 경로를 `returnTo`로 보내 전체 페이지 이동 → 기존 계정으로 돌아온다. 네이버 버튼은 준비 중 비활성이고 요청이 없다. |
| AUTH-02 | `3140:119739`, `3140:120573` | `/auth/signup`; `GET /api/v1/auth/social-signups/current`, `POST /api/v1/auth/social-signups` | 신규 Google 계정으로 귀환 → `flowId`로 가입 거래 조회 → 이메일·이름·선택 입력과 두 필수 동의 표시 → 동의 없이 제출 불가, 동의 후 같은 `flowId`로 가입 성공·`/auth/start` 이동. 실제 agreement code/version을 전송한다. |
| AUTH-03 | `3140:119739` | `/auth/legal/terms`, `/auth/legal/privacy` | 약관 링크를 열어 임시 본문·개발/테스트 표시를 확인한다. 실제 동의로 가입한 뒤 승인된 본문 교체와 재동의 필요 여부를 후속 정책 항목으로 기록한다. |
| AUTH-04 | `2306:88681`, `3140:120851` | `/auth/callback`; `POST /api/v1/auth/oauth/google/session-completions` | 귀환 URL의 `flowId`로 로그인 성공/취소/잘못된 callback을 각각 확인한다. `returnTo`는 내부 경로만 허용하고 외부 URL로 이동하지 않는다. `flowId` 누락·실패 시 재시도 안내가 나온다. |
| AUTH-05 | `3140:120851`, `3140:120942` | 전역 GNB; `POST /api/v1/auth/token/refresh`, `/logout` | 새로고침 후 세션 유지, 만료 토큰 재발급, refresh와 로그아웃이 겹칠 때에도 로그아웃 유지, 보호 화면 접근 차단 및 쿠키 삭제를 확인한다. 원시 access token은 저장소에 남지 않는다. |
| AUTH-06 | `3140:120851`, `3140:121033` | `/auth/start`, `/bids?view=recommended` | 가입 직후 세 가지 시작 선택을 확인한다. 바로 시작은 입찰공고로, 등록/찾기는 해당 경로로 이동한다. |
| AUTH-07 | `3140:121614`, `3140:121777`, `3140:121916` | `/auth/company/search`; `GET /api/v1/companies/search` | 회사명/번호 검색, 결과·빈 결과·오류·페이지 이동을 확인한다. 결과가 없으면 등록 선택으로 이동한다. |
| AUTH-08 | `3140:121981`, `3140:122094`, `3140:122231` | `/auth/company/search/[companyId]`; `GET /membership-application-context`, `POST /api/v1/company-membership-requests` | 대표자와 팀원 각각 직급/메시지를 입력해 통합 요청한다. 성공 화면·서버 PENDING 반영을 확인한다. 중복 요청·기존 소속·권한 불가 시 제출이 막힌다. |
| AUTH-09 | `3140:122511`, `3140:122667`, `3140:122897` | `/auth/company/register/document`; `POST /api/v1/company-documents`, presigned `PUT`, `POST /upload-completions` | PDF/JPG/PNG 10MB 이하를 업로드하고 선택 오류·크기 오류·업로드 실패를 확인한다. 서명 header, checksum, credentials 제외, 완료 후 상태 전환을 검증한다. |
| AUTH-10 | `3140:123030`, `3140:123075` | 증명서 처리; `GET /api/v1/company-documents/{id}` 및 재시도 API | OCR/검증 진행·실패·수동 재시도·재업로드를 확인한다. 새로고침 후 계정별 문서/버전 ID로 상태를 복원하고 중복 polling·오류를 기록한다. |
| AUTH-11 | `3140:123143`, `3140:123224` | 회사 정보·실적; `GET /api/v1/company-registration-proposals/{id}`, `GET /api/v1/industries` | 제안의 검증된 회사명·번호·주소와 실적·3종 인증을 표시한다. 업종이 없으면 검색 후 실제 code를 선택한다. 직접 수정은 준비 중 비활성이다. |
| AUTH-12 | `3175:51961`, `3140:123143` | 문서 중복/충돌; proposal + 회사 검색 | 이미 인증된 번호는 등록을 진행하지 않고 기존 회사 찾기로 간다. 미인증 중복 및 번호 정정은 백엔드 allowedChoices를 보여주고 명시 선택 후에만 제출한다. |
| AUTH-13 | `3140:123383`, `3140:123469` | 문서 등록; `POST /api/v1/company-registrations` | 대표자/팀원 직급, 여섯 금액대, 전화번호·업종·충돌 선택을 검증한다. 멱등 키로 중복 등록이 없는지, 인증 상태와 서버 companyId가 생성되는지 확인한다. |
| AUTH-14 | `3141:52692`, `3141:53001` | `/auth/company/register/business-number`; `POST /api/v1/account-business-connections`, `GET /current`, `DELETE /current` | 10자리 입력 오류, 조회 불가, 보강 진행률을 확인한다. 새로고침 후 기존 조회를 복원한다. 번호 변경 시 명시된 `DELETE` → 새 `POST`, `DELETE`의 preflight와 새 `POST` 실패 뒤 재시도를 확인한다. 이미 인증된 번호는 기존 회사 통합 요청으로 이동한다. |
| AUTH-15 | `3141:52871`, `3141:52919`, `3141:55269`, `3141:55492` | 번호 등록; `POST /api/v1/unverified-company-registrations` | 회사 정보·실적 확인 후 대표자/팀원 직급과 금액대를 선택한다. 중복 제출 방지, 미인증 companyId·membershipId·상태를 확인한다. |
| AUTH-16 | `3141:56082`, `3141:56135`, `3141:56172` | `/auth/company/invitations`; `POST /preview`, `/resume`, `/acceptance`, `/decline` | 초대 링크 preview 쿠키, 다른 이메일 로그인, 신규 가입 후 복귀, 수락/거절/만료/중복 사용을 확인한다. preview 실패 시 이전 초대 handoff 쿠키를 재개하지 않는다. URL에 초대 token이 남지 않고 서버 membership이 변경된다. |
| AUTH-17 | `2306:88681`, `3140:119739`, `3140:122511` | 모든 가입 화면; API 없음 | 데스크톱·모바일에서 Figma 카드/문구/아이콘/상태, 키보드 탭·포커스·오류 읽기와 버튼 중복 클릭을 확인한다. |

## 현재 별도 TODO와 판정

- `13.2.8`/`13.3.8`의 시공능력평가액·대표면허·3종 인증 직접 수정: **가입 전 API 미제공**, 버튼은 준비 중 비활성. API/정책 확정 뒤 새 케이스로 추가한다.
- 네이버 OAuth: Swagger API 없음, 준비 중 비활성. API가 생기면 별도 케이스를 추가한다.
- 정식 서비스 이용약관·개인정보처리방침: 본문/URL/버전 및 이전 더미 동의 처리 정책 확보 후 교체·재검증한다.
- 전체 브라우저 통합 판정: **대기 (0/17 전체 완료, AUTH-01~07/09/14 일부 확인)**. `pnpm lint`/`pnpm build` 결과는 통합 통과로 세지 않는다.

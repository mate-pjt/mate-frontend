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

## QA-04 실행 기록 · 2026-10-28 KST

[작업 기록](../development/figma-v01/tasks/QA-04.md) · [검토 기록](../development/figma-v01/reviews/QA-04.md). 이 절은 위 과거 부분 실행에 덧붙이는 이번 관찰이다. 기존 17개 case ID·전체 대기 판정을 보존한다.

> 재개 사전 확인(2026-10-30 11:05 KST): 사용자가 이전 Safari QA 창을 닫아 과거 refresh 상세는 복구하지 못했다. 새 HTTPS 검증 켠 auth 200, Chrome 실제 refresh 401 `SESSION_INVALID`/정확한 local Origin/credentials 허용, 새 Safari 보호 시작의 refresh 401/cookie 삭제 지시/로그인 필요를 확인했다. CLI local/dev OPTIONS 403과 브라우저 결과를 구분한다. 이 시점 새 Google 로그인 전이며 이전 Task PASS를 소급하지 않는다. 실제 API와 분리한 같은 source의 mock UI 실행도 준비했다. 상세 환경·기록 한계는 작업 기록의 10/30 체크포인트를 따른다.

> 최신 환경 보충(2026-10-28 13:02 KST): 승인된 HTTP PID 59507 종료 후 local HTTPS로 전환했다. 인증서/hostname 검증 켠 `/auth` 200·api-test/auth api/local 설정·정확한 local HTTPS OPTIONS 허용 확인. 새 group 85268/session 32341을 실행 중이며 아직 전환 후 OAuth 시작 전이다. QA-B는 사용자 확인상 미가입/미제출이다. Safari Inspector 도구 제어 한계로 새 Chrome 탭에서 관찰을 준비하고, 브라우저 한정 Google 계정 선택 조건은 제품 기본 동작과 구분한다. 이전 만료 원인 확정·필수 실제 QA PASS를 뜻하지 않는다.

> 추가 실제 결과(2026-10-28 13:08 KST): Chrome 관찰 대기는 공개 로그인 복구/블록 해제로 정리했고 `prompt` 변경은 적용되지 않았다. Safari 기본 경로에서 13:02:39.850 시작 → 사용자 QA-B 직접 인증 → 13:03:22.879 로컬 signup, 13:05:46.621 단일 UI 제출 → 13:05:50.992 시작 선택 도착을 확인했다. 이메일 readonly, 이름 공란/필수 동의 하나 해제 시 disabled, 테스트 이름·두 동의 시 enabled를 확인했다. 새 테스트 계정 QA-B는 잔존한다. callback HTTP/동의 버전/POST 개수·선택 입력 payload는 미수집이며 전체 AUTH-01~06 PASS로 확대하지 않는다. 상세 관찰/한계와 남은 검증은 작업 기록의 같은 시각 체크포인트에 있다.

> Network 보충(2026-10-28 13:18 KST): 위 미수집 중 current GET 200·signup 201·두 요청의 signup flow 일치, 실제 `PRIVACY_POLICY v1`/`TERMS_OF_SERVICE v1` 조회·전송, 선택 입력 null·테스트 이름, 제출 resource 하나를 Inspector에서 확인했다. 세 선택의 register/search/bids 이동과 logout UI도 확인했다. 비식별 증거는 `environment-1132/https-1230/safari-signup.json`. callback 자체 HTTP/flow·실제 provider 취소·자연 만료/경합·남은 접근성은 아직 별개이며, 응답 수명 1,800초에 따라 13:36:50 이후를 기다리는 중이다. 계정은 새 QA-B로 잔존하며 종료 logout은 아직 대기다. 상세 한계/임시 로그 유지·정리는 작업 기록에 있다.

> 사용자 중단(2026-10-28 13:40 KST): 새 검증을 멈췄다. 별도 private OAuth는 사용자가 QA-A로 동의를 완료해 로컬 bids 귀환만 확인했으며 실제 취소/초기 callback HTTP는 미수집이다. QA-A logout 200/cookie 삭제·private 창 종료, Chrome 비로그인 보호 화면·차단 해제/소유 탭 종료를 확인했다. QA-B는 수명 경과 후 중간 refresh 0개에서 13:37:18 홈 이동을 시작했고, 정리 시 refresh 1개·비로그인 UI를 보았다. 상태/code·cookie 삭제 미수집이므로 재발급 성공으로 판정하지 않는다. 경합·최종 QA-B logout·정상 창 Network 필터/로그 유지 원복은 미확인이다. 사용자 Safari 제어 감지 후 재시도 없이 멈췄다. 이번 local HTTPS group 85268은 종료 0/포트 반환 확인. 다음은 사용자 지시 후 **QA-04**에서 보존 요청/브라우저 정리 확인부터 재개하며, 신규 가입·과거 만료 callback을 반복하지 않는다. 최신 관찰의 최종 Review Gate도 재개 후 필요하다.

- 범위: AUTH-01~06과 AUTH-17의 인증 화면. 회사 검색/등록/초대 등의 데이터 변경과 나머지 가입 화면은 QA-05~08에서 판정한다.
- 사용자 승인: Google에서 사용자가 직접 선택하는 기존 QA-A의 세션 왕복과 신규 QA-B 1회 임시 약관 가입. 종료 시 로그아웃, 신규 계정 잔존 허용. 계정 원문·인증값·환경파일 값은 수집하지 않는다. 이번 로컬 HTTPS 프로세스만 시작/종료하고 브라우저 한정 오류/지연/경합을 해제한다.

### 실행 식별·환경

| 항목 | 이번 확인 근거·한계 |
| --- | --- |
| 프론트 | `qa/qa-04-auth-live`, source HEAD `6711193ab4a66a2a7837eb34ad71f2cc374e23b2`; 시작 clean. 실행 소스 변경 없이 QA Markdown만 변경. 관련 소스의 SHA-256은 로컬 증거 `before.json`에 보존 |
| 실행 | Node 22.20.0·pnpm 11.3.0·Next 16.2.9. 명시한 api/local 입력의 7개 공급원 모두 api, snapshot fingerprint `67eb70b3`. `https://local.mate-bid.com:3000` → `https://api-test.mate-bid.com` |
| 백엔드 배포 근거 | [run 40552546758 / deploy job 122375633701](https://github.com/mate-pjt/mate-backend/actions/runs/40552546758/job/122375633701), test deployment `7366507325`, source `0e7ac62d605279fc8d51455794a910eece8aeed5`; 2026-10-28 03:09:50 KST success. GitHub의 최신 성공 test 배포 이력이며 QA 시점의 실제 서버 실행 SHA·image digest 직접 확인은 아님 |
| 로컬 HTTPS | `/etc/hosts` 매핑·전용 인증서/키 파일 존재·시작 전 3000 빈 포트 확인. 공개 인증서 기간 2026-09-27~2027-09-27. 키 내용 미열람. 전용 인증서를 지정한 CLI `/auth`는 HTTP 200; Chrome의 신뢰 설정 증거로 세지 않음 |
| 브라우저 | Aside 기본 profile 미연결. Chrome 최초 접근 `ERR_CERT_AUTHORITY_INVALID`는 사용자 직접 인계 뒤 정상 화면 확인으로 해소. Chrome 설치 버전 156.0.8078.48(실행 버전 직접 조회는 도구 제약으로 미확인), 데스크톱 1920×902·모바일 390×844. 임시 viewport는 복구. 계정 선택 화면 원문은 수집하지 않음 |
| 로컬 증거 위치 | `/Users/jisung/.codex/visualizations/2026/10/28/01a17fec-f5b5-7b92-933e-5892120e7ab0/qa-04/`: `before.json`, `checks.json`, `dev-summary.log`, `cli-transport.json`, `cli-denial-summary.json`, `cli-transport-recheck.json`, `network-summary.json` 및 아래 JPG. 원시 token/cookie·계정 원문·flowId 등 원시 인증 query·HAR 저장 안 함. 개발 서버 요청 로그는 query를 제거해 기록 |

### 이번 결과와 미실행

| 영역 | 이번 관찰 | 판정 경계 |
| --- | --- | --- |
| 계약/회귀·정적 검사 | Node 22.20.0 `pnpm test` 8파일·62건, `pnpm lint`, `pnpm build`(Turbopack·정적 19페이지) 통과 | 계약/mock/HTTP 대역 검사가 실제 OAuth/쿠키 QA를 대신하지 않음. Storybook/UI 변경이 없어 build-storybook 미실행 |
| CLI transport · 09:38 KST | 정확한 로컬 Origin을 보낸 refresh preflight OPTIONS와 cookie 없는 POST가 모두 403·text/plain, allow-origin/credentials 없음. `/v3/api-docs` 조회도 HTTP 오류 | 브라우저 credentialed CORS·세션·백엔드 자체 거부로 단정하지 않음. 실제 브라우저 재확인 필요 |
| CLI 재확인 · 09:40 KST | 별도 QA User-Agent로 OpenAPI 200, refresh OPTIONS 200·POST 401 `SESSION_INVALID`/`isSuccess:false`; 정확한 allow-origin·credentials:true | 최초 403은 보존하며 원인을 User-Agent 또는 일시 조건 중 하나로 단정하지 않음. 이 결과도 브라우저 통합 대체 아님 |
| `AUTH-01` 기존 계정 경로 · 09:41~44 KST | OAuth 시작 GET의 returnOrigin/returnTo 정확, 사용자 확인 QA-A가 `/bids?view=recommended`로 귀환·로그아웃 버튼 표시. 네이버 비활성. 초기 refresh 401·성공 복원 refresh 200에 정확한 CORS와 Secure/HttpOnly/SameSite=Lax cookie metadata | OAuth의 cross-origin 이동 뒤 자동화 Network 관찰이 이어지지 않아 최초 성공 session-completion의 HTTP 상태는 미수집. 성공 UI+현재 refresh 200 근거와 구분. `auth-a-restored.jpg` |
| `AUTH-04` 오류 부분 · 09:46 KST | callback·signup flowId 누락의 재시작 안내·인증 요청 0건, 합성 잘못된 flowId의 실제 completion POST 401·재시도 안내 확인. 외부 returnTo로 이동하지 않음 | `error=access_denied` 입력 화면 확인은 실제 Google 취소/귀환의 증거가 아님. 정상 성공 flowId 전달과 실제 provider 취소는 미완료. 실제 OAuth 요청 만료는 아래 추가 실행과 구분. `callback-missing.jpg`·`callback-invalid.jpg` |
| `AUTH-05` 기본 세션 부분 · 09:44~48 KST | 새로고침 후 refresh 200·로그아웃 버튼 복원. logout 200·cookie Max-Age=0 metadata, 공개 목록은 비로그인으로 유지, 이후 보호 recommended 직접 접근은 내부 next 보존 로그인 화면으로 이동 | 자연 access/refresh 만료·refresh/logout 경합·브라우저 저장소 검사는 미완료. `auth-a-logout.jpg` |
| `AUTH-06`·인증 화면 `AUTH-17` 부분 · 09:45~46 KST | 기존 QA-A에서 회사 등록 선택 → 등록 방법 화면, 회사 찾기 → 빈 입력/조회 비활성, 바로 시작 → `/bids`. 390×844의 문서 폭 375≤390, Tab이 등록→찾기 순으로 이동 | 회사 조회/등록 제출 없음. 가입 직후 QA-B·가입폼/전체 인증 상태의 모바일/오류 접근성은 미완료. `start-desktop.jpg`·`start-mobile.jpg` |
| `AUTH-02~03` 신규 가입 | QA-B 가입폼 인계를 요청했으나 사용자가 Google 로그인 후 계속 로딩된다고 보고. 아래 진단에서 backend callback 요청 만료 확인 | 계정 선택/가입폼 인계 전 실패하여 특정 계정 문제로 단정하지 않음. 가입 POST·동의/버전·중복 제출·가입 직후 시작 선택 미실행. 임시 두 본문 직접 열람은 아래와 같이 별도 확인 |
| `AUTH-17` Figma 대조 | 지정 프레임 `2306:88681`·`3140:120851`·`3140:119739`의 현재 screenshot을 읽기 전용 확보. 시작 화면의 세 선택·아이콘/문구 구조 대조 | **Minor 관찰**: Figma의 이름 포함 인사말과 달리 구현은 일반 인사말이며, 카드/패널 치수가 다름. 서로 다른 viewport 높이의 세로 위치를 픽셀 결함으로 세지 않음. 네이버 비활성·임시 약관은 기존 정책 차이로 분리. 전체 디자인 일치 PASS 아님; 임의 구현/정책 확정 없음 |
| `AUTH-05` 연결 실패·재시도 추가 | 해당 QA 탭의 refresh URL만 브라우저에서 차단 → 로그인 상태 확인 오류/재시도 버튼. 차단을 해제하고 재시도 → 비로그인 안내/로그인 버튼 | 실제 backend 오류 응답 주입이 아닌 브라우저 한정 네트워크 실패. `finally`와 정리 단계에서 차단 제거. `refresh-network-error.jpg` |
| `AUTH-17`·`AUTH-03` 독립 추가 | 해당 탭의 실제 viewport 320×740·문서 폭 320, 닫기 링크에서 Tab→Google 버튼, Google 활성/네이버 비활성. callback 오류 문구의 role=alert·Enter 재시도와 두 임시 약관 페이지의 제목/임시 표시 확인 | 초기 브라우저 단위 viewport 적용은 원하는 탭에 반영되지 않아 1920폭으로 관찰됐고 PASS로 세지 않음. 탭 단위 override로 320폭 확인 후 캡처·복구. 가입폼 링크/동의 제출·스크린리더 실제 발화는 확인하지 않음. `login-mobile-320.jpg`·`privacy-temporary.jpg` |

### 로딩 보고에 대한 실제 진단 · 09:58~10:05 KST

사용자가 “Google로 로그인을 눌렀는데 계속 로딩”이라고 보고하고 서버 문제 확인 후 문제가 있으면 중단 또는 나머지 진행을 요청했다. 같은 QA-04의 읽기 전용 진단과 독립 검증만 수행했다.

- 문제 시도의 OAuth 시작은 09:47:58 KST의 GET `/api/v1/auth/oauth/google/authorizations`이며, 브라우저 response extra info에서 **302 → `accounts.google.com/o/oauth2/v2/auth`**를 확인했다. `oauth-start-diagnostic.json`에 인증 query·Location 원문 없이 기록했다.
- 09:58 KST 쿠키 없는 별도 CLI 재확인: API 문서 200/1.075초, refresh 401 `SESSION_INVALID`/0.875초 및 정확한 CORS, Google 공개 주소 HEAD 200/0.604초. 최신 성공 test 배포 이력은 동일했다. 이 결과는 전체 OAuth·Google code 교환·현재 실행 SHA의 정상 증명이 아니다.
- 대기 중이던 브라우저 로딩을 Escape로 취소한 뒤 현재 주소가 **backend `/api/v1/auth/oauth/google/callback`**임을 확인했다. 표시 JSON의 `isSuccess:false`, **`code:OAUTH_REQUEST_EXPIRED`**, “소셜 로그인 요청이 만료되었습니다”를 확인했다. query/code/state 원문은 읽거나 저장하지 않았다. `callback-expired-response.json`·`callback-expired.jpg`가 근거다.
- 해당 callback의 HTTP 상태/응답 도착 시각은 수집하지 못했고 이전 Network buffer도 일부 유실됐다. 서버 전체 장애로 단정하지 않는다. **이번 로그인 시도가 만료로 거부된 사실은 확인했지만, 만료에 이른 지연 위치/원인이나 특정 계정 문제는 미확정**이다. 실제 요청 만료 관찰을 access/refresh 세션 만료 PASS로 바꾸지 않는다.
- Network 요약의 `observedAt`은 수집 시각이며 요청 시작 시각이 아니다. 재수집한 buffer 관찰이 중복될 수 있다. 시작 요청의 별도 진단은 CDP wallTime을 사용한다. cookie/token·계정 원문·원시 인증 query/HAR는 보관하지 않는다.

사용자 지시에 따라 **신규 가입 여정은 중단**하고 위 독립 검사만 수행했다. 재개 시 만료 callback을 새로고침/재전송하지 말고 로컬 서버를 다시 시작한 뒤 새 Google 시도에서 QA-B 직접 선택과 귀환을 연속 관찰한다. 같은 문제가 새 시도에서 반복되면 인증/배포 담당이 위 시각·method/path·오류 코드를 서버 기록과 대조해야 한다. 서비스 재시작·설정 변경·배포·서버 기록 임의 삭제는 실행하지 않았다.

### 복구·재개

QA-A의 실제 세션 생성/회전 뒤 logout 200·쿠키 삭제 지시와 마지막 비로그인 UI를 확인했다. 신규 계정 가입 POST/회사 데이터 변경 없음. 브라우저 URL 차단·device metrics/viewport 복구 및 에이전트가 연 만료 callback 전용 탭 닫음을 확인했다. 10:04:57 KST 이번 QA process group만 정리해 dev 종료 0·PID 20630 소멸·3000 리스너 없음 확인(`process-cleanup.json`). 종료 전 정상 로그인 화면으로 돌아왔다. OAuth 만료 시도의 서버 기록 정리 여부는 미확인이며 임의 삭제하지 않았다. 인증서 경고는 사용자가 직접 처리했고 에이전트는 신뢰/키체인을 변경하지 않았다.

**이번 Task 판정: 차단/미완료.** 신규 가입·실제 provider 취소·정상 callback HTTP 관찰 한계·자연 access/refresh 만료/경합·저장소/가입 접근성이 남았다. 새 full-case 통과를 선언하지 않으며 과거 17건 전체 완료 0건 판정은 유지한다. 담당 역할·재개 첫 행동은 QA-04 기록에 남겼다. QA-04의 검증/Review Gate 전에 QA-01 등 다음 기능이나 main 병합으로 넘어가지 않는다.


## QA-04 재개 관찰 · 2026-10-28 10:51 KST

사용자 요청으로 Node 22/api/local HTTPS를 다시 시작했다. source/의존성 지문과 최신 성공 test 배포 이력은 이전 실행과 같다. 새 10:35:22 KST OAuth 시작 302 뒤 기존 계정 로그인·recommended 귀환/로그아웃 버튼을 확인했다. 10:38:34 logout 200·refresh cookie 삭제 metadata 확인. 이는 신규 가입 PASS가 아니다.

사용자는 QA-B 준비 및 직접 선택 가능을 확인했다. 두 번째 10:38:47 시작도 302였으나 사용자 로컬 로그인 주소 유지 보고와 자동화의 문서 응답 처리 대기가 반복됐다. 새 backend 오류 코드는 확인하지 않았고 서버 장애로 단정하지 않는다. 제어 탭을 정상 auth 주소로 되돌리고 사용자 직접 새 탭 인증/가입폼 귀환을 인계했다. 아직 가입폼/신규 가입 POST 미확인이다.

재개 증거는 기존 QA 폴더의 `resume-1029/`에 분리했다. `network-summary.json`은 실제 요청 시작 시각과 비식별 응답/쿠키 metadata, `storage-metadata.json`은 키 개수만 보존한다. local 0/session 15·token 이름 키 없음이며 값은 확인하지 않아 전체 저장값의 token 부재를 주장하지 않는다. 이전 manifest/실행 증거는 보존했다.

현재 QA process PID 37768은 사용자 인증 인계를 위해 실행 중이다. 이전 20630 종료와 구분하고 재개 프로세스 종료 정리는 아직 완료가 아니다. 필수 QA/재검토가 남아 전체 PASS·Git 전달로 진행하지 않는다.

### 재개 실행 종료·새 만료의 증거 한계 · 2026-10-28 11:06 KST

- 사용자 새 탭에서도 기존 계정이 자동 선택됐다는 보고를 받았다. Mate logout과 Google 로그인 세션은 분리돼 있으며 일반 새 탭은 Google 세션을 공유할 수 있다고 설명했다. 확인한 배포 source의 [Google authorization URI builder](https://github.com/mate-pjt/mate-backend/blob/0e7ac62d605279fc8d51455794a910eece8aeed5/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/http/auth/google/GoogleOAuthHttpAdapter.kt)에는 계정 선택 prompt가 없다. 실제 해당 요청의 prompt metadata 수집은 빈 결과여서 런타임 부재 증거로 쓰지 않는다. Google 전역 로그아웃/쿠키 삭제·설정 변경은 하지 않았다.
- 사용자가 시크릿 창에서 QA-B의 Google 계정/비밀번호를 직접 입력한 뒤 “만료되었다고 뜸”, 도메인은 `api-test.mate-bid.com`이라고 답했다. **사용자 관찰**이며 이번 정확한 오류 코드/HTTP 상태·시작/귀환 시각·경로는 미수집이다. 앞선 직접 확인한 `OAUTH_REQUEST_EXPIRED` 사례와 합쳐 확정하지 않는다. Chrome 확장 도구에서 해당 시크릿 탭을 확인하지 못해 가입폼/Network를 독립 관찰하지 못했다. 자격 증명·개인정보·query 원문을 수집하지 않았다.
- 읽기 전용 source 대조: [GoogleOAuthProperties](https://github.com/mate-pjt/mate-backend/blob/0e7ac62d605279fc8d51455794a910eece8aeed5/mate-api/src/main/java/kr/co/mate/mate_api/global/config/properties/GoogleOAuthProperties.kt)의 요청 수명 기본값 5분/허용 1~10분. [start service](https://github.com/mate-pjt/mate-backend/blob/0e7ac62d605279fc8d51455794a910eece8aeed5/mate-api/src/main/java/kr/co/mate/mate_api/application/service/auth/oauth/GoogleOAuthService.kt)는 server clock과 수명으로 만료 시각을 저장하고, [claim service](https://github.com/mate-pjt/mate-backend/blob/0e7ac62d605279fc8d51455794a910eece8aeed5/mate-api/src/main/java/kr/co/mate/mate_api/application/service/auth/oauth/OAuthAuthorizationTransactionService.kt)는 만료 시각 도달을 Google code 교환 전에 거부한다. **실제 runtime SHA/설정과 이번 왕복 시간·지연 위치는 미확인**이다. 서버 전면 장애·특정 계정 결함이나 로컬 재시작만으로 해결되는 문제로 단정하지 않는다.
- 재시도만 반복하지 않고 신규 가입 여정을 중단했다. agent의 신규 가입 POST/회사 mutation은 없고 사용자도 Mate 가입폼 도착·가입 제출을 보고하지 않았다. 시크릿 컨텍스트의 전체 요청/앱 세션을 독립 확인한 것은 아니다. AUTH-02~03·실제 provider 취소·성공 callback HTTP·access/refresh 만료/경합·저장값/가입 접근성은 여전히 미완료다.
- 정리: 일반 Chrome의 보호 recommended 접근이 로그인 화면으로 돌아가 Google 버튼 표시/로그아웃 없음·세션 오류 없음 확인. 새 정리용 탭을 닫았다. 시크릿 Mate 세션은 독립 확인 못 함. Google 세션은 사용자 관리 상태로 두고 전역 로그아웃하지 않았다. 이번 local process group 37768만 SIGINT → dev 종료 0, 11:06:47 KST PID 소멸·3000 비청취 확인. 공유 서비스/배포·보안 설정은 변경하지 않았다.
- 증거: `resume-1029/resume-observations.json`, `network-summary.json`, `storage-metadata.json`, `oauth-timeout-source-review.json`, `cleanup-ui.json`, `cleanup-login.jpg`, `process-cleanup.json`. 이전 실행 manifest/파일은 보존한다. 빈 `google-selection-metadata.json`은 정상 응답/prompt 부재 증명이 아니다.

전체 통합 판정은 **차단/미완료**다. 재개 첫 행동은 인증 담당의 실제 runtime/수명/시각·서버 기록 대조와 QA 실행자의 비식별 시크릿 frontend 관찰 경로 준비다. 이를 확보한 뒤 새 OAuth의 시작/귀환을 연속 기록하고 남은 필수 사례를 수행한다. 이전 승인 범위는 유지하며 만료 callback 재전송·새 정책/구현·공유 서비스 조작을 추가하지 않는다.

## 로그인 전 OAuth 만료 원인 진단 · 2026-10-28 11:14 KST 재개

사용자는 로그인 재시도 전에 실제 설정·서버 시각·기존 시도 기록의 대조를 요청했다. 로그인/OAuth 시작·로컬 HTTPS 시작·설정/코드/서비스 변경은 수행하지 않았다. 기존 source와 비식별 증거를 분석하고 공개 health/info만 쿠키 없이 조회했다. 서버 접근 경로 질문에 사용자는 **“현재 서버 접근 경로 없음”**이라고 답했다. 실제 적용값·JVM/DB 시각·요청 로그/DB 조회는 차단돼 있으며 source 분석으로 대체하지 않는다.

### 확보한 근거와 미확보 항목

| 항목 | 확인 결과 | 판정 한계 |
| --- | --- | --- |
| Git/소스 | 프론트 HEAD/main/원격 main `6711193ab4a66a2a7837eb34ad71f2cc374e23b2`, 문서 네 파일만 미커밋. 로컬 backend main `de13c28d0185b7f6e49e39bef04c2c0940cdd816`은 배포 source와 달라 고정 배포 source로 대조 | 로컬 backend의 기존 IDE 변경은 보존, build/test/설치/편집 없음 |
| 배포 이력/이미지 | deployment `7366507325`·run `40552546758`·job `122375633701` success 유지. 해당 job에서 입력 digest `sha256:27875b4d0d11a0b738926a85ba9d217291eba2fe198a34d100a703cd8a725d84`와 03:09:45 KST `DEPLOYED` marker 확인 | 당시 CI 전달 입력과 성공 marker. 현재 활성 컨테이너/image·route와 일치하는지는 미확인. job 원문 로그는 출력/파일 저장하지 않고 허용 metadata만 보존 |
| 실제 설정 경로 | 고정 source의 [dev profile](https://github.com/mate-pjt/mate-backend/blob/0e7ac62d605279fc8d51455794a910eece8aeed5/mate-api/src/main/resources/application-dev.yml)은 `/mate/test/backend/` Parameter Store 필수 import. source 기본 요청 수명 300초, 검증 범위 60~600초 | 실제 Spring 적용값과 당시 override/설정 이력은 미확인. SSM/환경변수 전체·`.env`를 읽지 않음 |
| 공개 시각/정보 조회 | 11:14:54~56 KST `/actuator/health` 두 번·`/actuator/info` 한 번 모두 404, RTT 0.628/0.973/1.016초. `Date`와 클라이언트 midpoint 차이 -0.684/-0.485/-0.479초, Server=cloudflare | edge 응답 시각 비교다. JVM/VM/DB 시각·NTP 정상·backend 건강 상태를 증명하지 않음 |
| 공개 404의 source 대조 | infra `298a9896382997f507a6b6df5448dcf3af3567f5`의 [HAProxy test frontend](https://github.com/mate-pjt/mate-infra/blob/298a9896382997f507a6b6df5448dcf3af3567f5/ops/haproxy/haproxy.cfg)는 `/actuator`를 404로 차단 | 관찰은 차단 설계와 일치하나 현재 VM 설치본/응답 발생 계층은 독립 확인 못 함. URL 변형/보호 우회 없음 |
| 감사/운영 로그 경로 | [backend audit adapter](https://github.com/mate-pjt/mate-backend/blob/0e7ac62d605279fc8d51455794a910eece8aeed5/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/logging/auth/Slf4jAuthenticationAuditAdapter.kt)는 `OAUTH_AUTHORIZATION_STARTED`를 기록. claim의 만료 예외는 post-claim `OAUTH_CALLBACK_FAILED` 감사 경로 전에 반환되며 [공통 예외 처리](https://github.com/mate-pjt/mate-backend/blob/0e7ac62d605279fc8d51455794a910eece8aeed5/mate-api/src/main/java/kr/co/mate/mate_api/global/exception/GlobalExceptionHandler.kt)에서 오류 code/trace를 기록 | 실제 로그는 미조회. `OAUTH_CALLBACK_FAILED`만 찾으면 이 만료를 놓칠 수 있음. trace/transaction ID는 서버 안에서만 상관 분석하고 외부에는 별칭으로 제공 |
| VM 로그 설정 | infra [Compose](https://github.com/mate-pjt/mate-infra/blob/298a9896382997f507a6b6df5448dcf3af3567f5/ops/compose/backend.yaml)와 [runtime Logback](https://github.com/mate-pjt/mate-infra/blob/298a9896382997f507a6b6df5448dcf3af3567f5/ops/runtime/logback-spring.xml)은 console/Docker local 로그 보관을 정의 | JAR 내부 파일 로그 경로만으로 조회 계획을 세우지 않음. 실제 활성 컨테이너/로그 보존·설치본은 미확인 |

### 기존 시도 타임라인 재구성

| 별칭 | 확보한 시각(KST) | 가능한 해석과 한계 |
| --- | --- | --- |
| 첫 만료 진단 | 09:47:58.952 OAuth 시작·302, 10:01:18.459 오류 화면 관찰 `OAUTH_REQUEST_EXPIRED` | 관찰 간격 799.507초. callback 접수/응답 완료 시각이 없고 raw transaction 상관값을 보관하지 않아 **13분 19.507초를 로그인 지연이나 서버 처리시간으로 계산하지 않음** |
| 재개 기존 계정 | 10:35:22.344 시작·302, 기존 계정 성공 UI 관찰 후 10:38:34.118 logout 요청·200 | 시작→logout 요청 간격 191.774초에는 관찰/사용자 시간이 포함됨. 실제 로그인/callback 소요시간은 미수집 |
| 다음 새 시도 | 10:38:47.823 시작·302, 문서 응답 처리 대기/DOM timeout 뒤 정상 auth navigation으로 정리 | server callback 시각/오류 code 미수집. 자동화 관찰 대기를 서버 장애로 바꾸지 않음 |
| 시크릿 QA-B | 사용자 `api-test.mate-bid.com` 만료 보고 | 시작/귀환 시각·정확한 code/HTTP/경로·시크릿 세션 독립 관찰 없음. 위 직접 확인한 만료와 별도 사례 |

### 좁혀진 발생 구간과 판별 방법

확인한 source의 흐름은 **서버 Clock으로 issued/expires 저장 → Google 인증 → callback의 DB `SELECT … FOR UPDATE` → Clock 조회/만료 검사 → Google code 교환 → 기존 계정 완료/신규 가입 후보**다. [claim service](https://github.com/mate-pjt/mate-backend/blob/0e7ac62d605279fc8d51455794a910eece8aeed5/mate-api/src/main/java/kr/co/mate/mate_api/application/service/auth/oauth/OAuthAuthorizationTransactionService.kt)와 [persistence adapter](https://github.com/mate-pjt/mate-backend/blob/0e7ac62d605279fc8d51455794a910eece8aeed5/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/auth/oauth/OAuthAuthorizationTransactionPersistenceAdapter.kt)를 대조했다. 이 claim에서의 만료는 token 교환/프론트 가입 처리 전에 발생하므로 해당 후속 구간의 지연을 우선 원인으로 삼지 않는다. 실제 활성 버전과 실패 경로 대조는 여전히 필요하다.

만료 연산은 주입된 JVM Clock을 사용한다. [TimeConfig](https://github.com/mate-pjt/mate-backend/blob/0e7ac62d605279fc8d51455794a910eece8aeed5/mate-api/src/main/java/kr/co/mate/mate_api/global/config/TimeConfig.kt)는 `Clock.system(Asia/Seoul)`, [DB schema](https://github.com/mate-pjt/mate-backend/blob/0e7ac62d605279fc8d51455794a910eece8aeed5/mate-api/src/main/resources/db/migration/V78__google_oauth_foundation.sql)는 `TIMESTAMPTZ`, adapter는 `OffsetDateTime`을 직접 저장/반환한다. 확인한 경로에 명시적인 +9시간 재해석은 없다. 이는 코드 관찰이며 실제 clock/mapping 정상 증명이나 시각 오차 원인 배제는 아니다.

아래 비교는 같은 시도이고 시각이 UTC로 정렬돼 있다는 전제가 필요하다.

| 후보 구간 | 필요한 최소 비교 | 판단 경계 |
| --- | --- | --- |
| callback 서버 도착 전: 사용자/Google·브라우저·네트워크/edge 대기 | 실제 `issued_at`·`expires_at`과 edge callback 접수/JVM 진입 시각 | 이미 기한 뒤 접수됐다면 앞 구간부터 조사. 현재는 접수 시각이 없어 구간 내 위치 미확정 |
| backend DB 연결/transaction·행 잠금 대기 | callback JVM 진입, connection 확보/잠금 조회 종료 또는 wait 근거, 만료 거부 시각 | 기한 전 진입했는데 DB 조회 뒤 기한을 넘었는지 판별. 현재 대기 telemetry/로그 없음 |
| 적용 수명·Clock/저장 시각 불일치 | 시도별 `expires_at - issued_at`, 해당 instance/버전, VM/앱/DB UTC·앱 로그 시간대·당시 clock jump 기록 | source 기본값이나 edge Date로 배제하지 않음. DB 현재 시각은 상관 분석 자료이며 이 source의 만료 비교 자체는 JVM Clock 사용 |

### 접근 확보 후 필요한 비식별 자료

인증/인프라 담당이 기존 권한 안에서 다음 자료를 확보해야 한다. 새 권한·VPN·인증정보·로그 설정 변경이나 원문 전체 전달을 요청하지 않는다.

1. test 활성 route/instance의 image digest·source revision. 위 CI digest와 실제 활성 identity를 대조한다.
2. 당시 시도 행의 별칭·상태·UTC `issued_at/expires_at/claimed_at/completed_at/failed_at`와 `expires_at - issued_at` 초. 이 차이로 당시 적용 수명을 확인할 수 있다. 실제 SSM 비밀값이나 env 덤프가 필요하지 않다.
3. 같은 별칭에 대응하는 callback edge 접수/JVM 진입·만료 거부 시각/HTTP·DB 연결/잠금 대기 근거와 VM/앱/DB UTC·로그 시간대/당시 NTP jump 여부. 없던 telemetry를 있다고 가정하지 않는다.

원시 URL query/code/state·cookie·토큰·OAuth 인증 digest(state/browser-binding/nonce 등)·PKCE·계정 ID/이메일/이름은 자료에 포함하지 않는다. 위에서 필요한 image digest는 배포 식별 metadata로 구분한다. 과거 행이 cleanup/보존 기간 때문에 없으면 그 사실을 남기며 요청 미발생으로 단정하지 않는다. 만료 거부가 claim 갱신 전이면 `claimed_at/failed_at`이 null일 수 있으므로 null만으로 callback 미도착을 판정하지 않는다.

증거 폴더 `diagnostic-1114/`: `public-runtime-probes.json`, `source-findings.json`, **미실행** `attempt-timestamps-readonly.sql`(시간·상태/수명만 투영하는 조회안), 기존 문서 검사 기준/검사기. 원문 배포/인증 로그·자격 증명은 파일에 저장하지 않았다.

11:23 KST 환경 점검에서 이전 QA PID 37768/37798은 없고 별도 PID 59507이 3000 포트에서 대기 중이었다. 이번 진단이 시작한 프로세스가 아니므로 종료/재시작·설정을 변경하지 않았다. 이전 QA 서버 종료 이력과 현재 다른 리스너 존재를 구분한다.

**진단 판정: 발생 구간/관측 한계는 축소했으나 실제 설정·서버 시각·시도 기록의 대조는 접근 부재로 차단. 원인 확정·QA-04 PASS 아님.** 신규 가입/동의·실제 취소·세션 만료/경합 등 기존 잔여는 그대로다. 다음 첫 행동은 위 비식별 자료 또는 기존 read-only 서버 접근 경로 확보이며, 로그인 반복부터 재개하지 않는다.

## dev 사용자 성공 보고와 현재 로컬 환경 비교 · 2026-10-28 11:32 KST

사용자가 `https://dev.mate-bid.com/auth`에서 테스트가 잘 된다고 보고했다. 어떤 계정/단계인지 아직 확정하지 않았으므로 AUTH case 통과로 올리지 않는다. 새 로그인/OAuth 시작 없이 익명 공개 `/auth`와 연결된 JS의 데이터 설정 snapshot만 대조했다. 브라우저 세션·계정 원문, `.env`/비밀값을 읽지 않았고 원문 HTML/JS는 증거 파일에 보관하지 않는다.

| 항목 | dev | 현재 로컬 |
| --- | --- | --- |
| 페이지/프로토콜 | `https://dev.mate-bid.com/auth` 200·Google 버튼 | `http://local.mate-bid.com:3000/auth` 200·Google 버튼. 같은 호스트/포트 HTTPS 요청은 `SSL: WRONG_VERSION_NUMBER` |
| 공개 auth 설정 | profile/authSource=`api`, API=`https://api-test.mate-bid.com` | profile/authSource=`api`, 같은 API 대상 |
| 공개 빌드 구분 | production / `f15bb4f9` | local / `67eb70b3` |
| 성공/실행 근거 | 로그인 성공은 사용자 보고, 정확한 단계 확인 중 | PID 59507·11:12 기동한 별도 Next 리스너, 이번 비교에서 변경/종료 없음 |

production/local은 프론트 빌드 구분이며 API 대상은 두 환경 모두 api-test다. dev가 mock이라 성공한 것으로 해석하지 않는다. source의 `googleAuthorizationUrl`은 `window.location.origin`을 returnOrigin에 넣고, 현재 repository의 `dev` script 자체에는 HTTPS 옵션이 없다. 현재 HTTP Origin은 QA 기준 `https://local.mate-bid.com:3000`과 scheme이 다르다. HTTP Origin/CORS/cookie 실제 인증 결과는 이번에 검사하지 않았으며 현재 HTTPS URL의 연결 실패 자체는 직접 확인했다. 인증서 검증을 끄거나 경고를 우회하지 않았다.

**현재 로컬 접속 조건에서 확인한 문제는 HTTP/HTTPS 실행 불일치다.** 이 리스너는 이전 QA HTTPS 프로세스 종료 뒤 시작됐으므로 과거 `OAUTH_REQUEST_EXPIRED`의 원인으로 소급하지 않는다. 과거 local HTTPS 기존 계정 성공, 신규 가입/자동화 관찰 대기·만료의 한계도 유지한다. 사용자 dev 성공과 같은 계정·같은 단계/브라우저의 비교가 필요하다. 로컬 HTTPS 조건을 맞춘 뒤 연속 관찰하도록 준비하며 이번에는 로그인/프로세스 조작을 하지 않았다.

증거: `environment-1132/public-frontend-comparison.json`, `local-public-config.json`, `local-protocol-probe.json`. 새 계정/가입 mutation 없음. 현재 dev 성공 단계와 사용 중인 로컬 주소를 사용자에게 확인 중이다. 실제 서버 설정/Clock/시도 기록 미확보 및 기존 필수 QA는 계속 별도 잔여다.

### 사용자 주소 확인과 실제 preflight 비교 · 11:40 KST

사용자는 dev에서 **신규 가입폼까지 도착**, 로컬에서는 **`http://localhost:3000`**을 사용한다고 답했다. 실제 가입 제출이나 계정 별칭까지 확인한 것은 아니다. 11:40:12 KST 쿠키/토큰/POST 없이 같은 test API refresh endpoint의 OPTIONS만 비교했다.

| Origin | HTTP/허용 응답 |
| --- | --- |
| `https://dev.mate-bid.com` | 200, 정확한 allow-origin, credentials:true |
| `https://local.mate-bid.com:3000` | 200, 정확한 allow-origin, credentials:true |
| `http://localhost:3000` | 403, allow-origin/credentials 없음 |

이는 현재 localhost HTTP Origin의 실제 preflight 거부 근거다. CLI 사전 점검으로 브라우저 cookie/OAuth 전체 통과를 대신하지 않는다. 사용자 dev 신규 가입폼 보고와 두 환경의 실제 API 대상 일치는 backend 공통 장애를 우선 단정할 근거가 약해졌다는 단서이며, 현재 로컬 주소·HTTPS 실행 조건을 먼저 맞춰야 한다. 이전 HTTPS 시도의 만료 원인은 여전히 별도 미확정이다.

PID 59507의 cwd는 이 mate-frontend다. 사용자에게 기존 HTTP 서버를 정상 종료→같은 포트/기존 전용 인증서 HTTPS로 전환할 범위를 확인했다. 별도 프로세스이므로 답변 전 보존하며, Node 22/인증서·key 경로와 launcher만 준비했다. `https-preparation.json`은 미실행 준비 기록, `origin-preflight-comparison.json`은 실제 익명 OPTIONS 결과다. 환경파일/키 내용·세션 원문은 수집하지 않았다.

## QA-04 후속 실제 가입·재개 검증 · 2026-10-28/30

아래는 앞선 차단 기록 이후 새로 수행한 결과다. 과거 결과를 소급 PASS로 바꾸지 않는다. source HEAD는 `6711193ab4a66a2a7837eb34ad71f2cc374e23b2`로 같고 런타임/의존성 변경은 없다. QA-B는 10/28 승인된 한 번의 가입 뒤 테스트 계정으로 남았으며 10/30 재가입하지 않았다. 회사 mutation·QA-05~08 판정은 제외한다.

| 사례 | 새 관찰/증거 | 범위와 남은 한계 |
| --- | --- | --- |
| `AUTH-01·04` 정상 callback | 10/30 Safari local HTTPS → test API, backend callback 302 → frontend callback 200 → completion 200. Headers Summary URL의 동일 flowId·cookie Secure/HttpOnly/SameSite=Lax·1,800초 수명, 보호 start로 복귀 확인 | `resume-20261030/live-login.json`. user 직접 QA-B 선택. 원문 query/계정/인증값 미보관. CLI OPTIONS 403은 local/dev 모두 Cloudflare 응답이었지만 실제 브라우저 refresh에는 정확한 allow-origin/credentials:true가 있어 브라우저 CORS 실패로 해석하지 않음 |
| `AUTH-02` 신규 가입 | 10/28 13:03 local QA-B signup → 이메일 disabled·이름/필수 동의 guard → 13:05:46 UI 한 번 제출 → 실제 가입 201·같은 flowId·이름 QA-B/선택 두 값 null·두 code/version `PRIVACY_POLICY v1`, `TERMS_OF_SERVICE v1`·start 도착 | `environment-1132/https-1230/safari-signup.json`. current GET 200·requiredAgreements도 직접 확인. 1회 UI 클릭과 목록 제출 resource 하나를 구분해 기록. 실제 API 중복 제출은 추가 실행하지 않음 |
| `AUTH-03` 임시 약관 | 실제 requiredAgreements와 승인된 1회 동의 가입 확인. 10/30 같은 SignupForm의 개인정보/이용약관 링크가 새 탭으로 두 임시 본문·정식 아님 표시를 열었음 | 실제 가입 동의와 mock UI 링크 검증을 구분. 정식 본문 교체/재동의 정책은 임의 확정하지 않음 |
| `AUTH-04` 실제 취소 | 10/30 11:44:42.836 새 private 거래·11:45 동일 pending state/scope의 browser-only prompt 후 사용자 인계. 12:25:40 응답 Date의 실제 callback **410/OAUTH_REQUEST_EXPIRED**, authorization code 파라미터 있음/provider error 없음. Timing 총 934.1ms·TTFB 933.8ms·응답 대기 782.6ms | `resume-20261030/provider-cancel-attempt-01.json`. 시작→응답 Date 2,457.164초(40분 57.164초)는 거래 전체 관찰 구간이며 callback 서버 처리시간이 아님. callback 도착 전 긴 구간을 확인했으나 사용자/Google 세부 구간·실제 runtime 설정/Clock은 미확보. 취소 성공 아님. 즉시 진행 준비 회신 전 새 거래를 시작하지 않음 |
| `AUTH-05` 자연 access 만료 | 10/30 11:07:06 인증/초기 1,800초 수명 뒤 다른 동일 계정 WEB 로그인 없이 유지. 11:38:15.036 start→bids 트리거, refresh 0→1개/실제 HTTP 200·서버 Date 02:38:16 GMT·로그인 유지 | `resume-20261030/natural-refresh.json`. 실제 refresh cookie 장기 수명 전체를 기다린 검증은 아님. 10/28 inconclusive 만료 시도와 별도 |
| `AUTH-05` refresh/logout 경합 | refresh 11:40:33.040→응답 200 33.446→실제 logout 클릭 33.670→앱 전달 35.947→logout 요청 35.949→200 36.264. 보호 화면 로그인 안내/GNB 로그인·logout 없음. logout cookie Max-Age=0/과거 Expires 확인 | `resume-20261030/refresh-logout-race.json`. 정확한 refresh Response 앱 전달만 2.5초 지연, HTTP/body/cookie 변경 없음. 서버 요청 동시 실행 주장이 아님. finally fetch 복원/marker 제거 확인 |
| `AUTH-05` 저장소 | 추가 정상 로그인 뒤 11:43:13.716 인증 상태 localStorage 0/sessionStorage 4개 모두 Next namespace·다른 키 0·auth/token 이름 키 0. API auth의 메모리 보관 source와 대조 | `resume-20261030/authenticated-storage.json`. key 이름의 분류만 수행하고 저장값/token/cookie 원문은 읽지 않음. 첫 로그인 전/후 개수만의 근거와 구분. 추가 정상 logout/최종 소유 프로세스·창 정리도 후속 확인 |
| `AUTH-06` 가입 직후 시작 | 10/28 QA-B 가입 직후 등록→`/auth/company/register`, 찾기→`/auth/company/search`, 바로 시작→`/bids` 확인 | 회사 검색/등록/소속 제출 없음. 각 회사 흐름의 실제 결과는 후속 Task |
| `AUTH-17` 인증 화면 UI | 별도 source/public 255개 동일 복사본·mock/local/webpack, 390×844와 320×740 가로 넘침 없음. 이름 공란/실제 공백·부분 동의 disabled, 유효 이름/전체 동의 enabled. Tab/Space·약관 새 탭·전화 오류 문구와 role=alert, pending disabled/문구 중 두 번째 클릭·start 내부 이동 한 번 확인 | `resume-20261030/mock-ui.json`·합성 PNG. 짧은 중복 클릭 구간은 CDP 이벤트 8개·유실 없음·해당 구간 외부 요청 0(HTTP 요청 8건이라는 뜻 아님); 긴 buffer는 truncated. 실제 서버 POST 횟수/저장 횟수·스크린리더 발화는 주장하지 않음. date fill은 controlled 입력 미반영으로 미래 날짜 미판정. TextInput 강조 약함은 캐럿 외 강조가 약한 Minor 관찰이며 규격 위반 확정 아님 |

10/30 실행 환경은 Node 22.20.0/Next 16.2.9, source/api/local HTTPS 3000과 별도 mock/local webpack 3001이다. 새 라이브러리/원본 source·설정 수정 없음. 10/28 같은 source의 test 62건/lint/기본 Turbopack build PASS는 이전 실행 근거로 유지한다. 실제 취소·최종 복구/새 Review Gate 전이므로 **QA-04 전체 판정은 아직 미완료**다. AUTH-07~16의 다른 업무 사례는 이번 Task에서 완료로 올리지 않는다. 최신 현재/다음 상태는 WBS가 소유한다.

11:51 체크포인트: 추가 정상 로그인도 logout 후 보호 회사 화면의 비로그인 안내로 돌아왔다. 실제 취소는 사용자 인계 후 회신이 없고 11:49 관찰은 아직 Google이었다. 이 대기 시간을 backend 지연/만료/취소 성공으로 판정하지 않는다. 임시 fetch 계측/Chrome viewport 원복과 소유 Chrome 두 탭 종료·mock process group 89506 종료 0/3001 비청취는 확인했다. 현재 OAuth 귀환을 위해 HTTPS 86654/3000과 새 Safari private 창은 유지하며 최종 보기 설정·HTTPS 종료/manifest 고정은 남아 있다. 문서 표기 최소 수정 1회 뒤 링크 1,451·79 ID/99 Task·124 기존 QA·보호 24개/소스·이력 보존 검사는 PASS다.

12:34 후속: 사용자의 “다른 오류 또는 진행 불가” 답변 뒤 실제 private 창에서 위 410/공개 code·Date/Timing을 확보했다. 이 거래는 취소 응답이 아니므로 AUTH-04는 미완료다. 실패한 소유 private 창만 닫았다. 일반 창은 비인증을 유지했고 공개 약관→개인정보 문서 이동에서 이전 resource가 남는 것으로 로그 유지 ON을 확인했다. 한 번 해제한 뒤 공개 auth 로드 완료 때 이전 resource가 사라지는 것으로 OFF를 확인했다(현재 문서 리소스 개수만의 판정 아님). URL 필터 공란/캐시 비활성화 OFF·Inspector 닫기/공개 로그인 확인 후 소유 HTTPS 86654를 SIGINT → 종료 0·3000 비청취, 기존 mock 3001 종료도 유지. `final-cleanup.json`·`post-expiry-clean-login.png`에 정리 근거를 보존한다. 즉시 인증 진행이 가능한지 사용자에게 확인했으며 응답 전 새 OAuth는 시작하지 않았다.

이번 오류 확인 도구 출력에서 Native 창 제목에도 포함된 인증 query를 가리는 처리가 **1회 누락**됐다. 사용자에게 즉시 알렸고 원문은 반복 출력/문서·증거 파일에 저장하지 않았다. 후속은 스마트 주소창의 도메인/공개 경로·파라미터 존재 여부·오류 code·Date/Timing만 투영했다. 이 사건을 숨기거나 원문 보관이 전혀 없었다고 표현하지 않는다(도구 출력과 저장 파일의 범위를 구분). 앱의 access token/cookie/password/환경파일 값은 출력하지 않았다.

종료한 새 증거는 `resume-20261030/evidence-manifest.json`의 flat 27개 크기/SHA-256으로 고정했다. mock-workspace/생성물은 제외한다. 텍스트/이번 Markdown 추가분의 정해진 raw query/JWT 패턴 0건 검사와 원본/빈 여백만 제거한 공개 로그인 캡처도 보존했다. 도구 출력의 노출 사건은 파일 검사와 별개다. 사용 후 이번 URI/원문 AX의 임시 참조도 정리했으며 새 시도/검사에는 새 디렉터리를 사용한다.

## Chrome 재현 후속 · 2026-10-30

13:11 새 302/동일 state·scope·nonce·PKCE/Google 차단 해제의 시작 metadata는 `cancel-retry-20261030/chrome-consent-start.json`에 있다. 사용자 오류 보고 뒤 13:18:38.310 실제 test API callback의 **OAUTH_REQUEST_INVALID**, code 있음/provider error 없음이 확인돼 실제 취소 PASS가 아니다. HTTP 상태/Date는 미수집, 후속 network buffer는 truncated다. cookie 수락/유지나 state·binding·소비 상태 중 세부 실패 원인을 확정하지 않는다.

Google 제어를 노출하지 못한 Chrome 도구는 이후 문서 응답 처리 중 CDP를 거절했다. public bids 비인증 GNB와 보호 start의 로그인 필요를 확인하고 QA 전용 준비 탭만 종료했다. Google 차단 해제는 앞서 확인했으나 마지막 capture disable 명령은 확인 못 한 사실을 구분했다. `chrome-result.json`에 정리 경계를 기록했다. Safari private logout은 확인했고 해당 창 종료/로그 유지 복구는 재확인 전이다. 새 HTTPS 6375/3000은 준비용으로 실행 중이다.

추가 같은 방식의 로그인 요청은 중단했다. 사용자에게 자동화 연결/기존 세션이 없는 Chrome 게스트 공개 창 준비를 요청했고 응답 전 새 OAuth는 시작하지 않는다. 기존 승인 테스트 계정/환경·회복 범위는 그대로이며 새 정책·쿠키 주입·가입은 없다. 나머지 필수 실제 취소/정리/최종 Gate는 미완료로 유지한다.

13:38 게스트 사전 점검: 첫 Native Chrome 연결의 자동 초기 출력이 다른 일반 창의 프로필 표시 정보/무관한 탭 제목을 포함했다. 즉시 사용자에게 알렸고 원문을 반복·파일 저장하지 않았다. 이후 원문 AX 출력 없이 고정 metadata만 관찰한다. 별도 실제 게스트 창의 안내/시크릿 아님을 확인했으나 local HTTPS 인증서 경고가 나와 사용자 직접 처리를 기다린다. 새 Google 요청은 아직 없다. 저장소 밖 안전 투영 v3는 Chrome 주소창을 포함한 합성 22개 사례 PASS이며, 이 검사가 과거 도구 출력 노출을 없애는 것은 아니다. AUTH-04는 계속 미완료다.

## 실제 Google 취소와 복구 · 2026-10-30 13:51 KST

사용자 직접 Guest 인증서 처리 후 13:39:20.881 새 거래·13:39:43.077 같은 state/scope/nonce/PKCE의 consent 표시 옵션을 준비했다. 사용자 직접 기존 테스트 계정 인증 후 동의 화면 정지 회신을 받고, 최신 화면의 Mate 동의/취소 버튼에서 **13:41:42.526 실제 취소**를 실행했다. 첫 시도는 사용자 변경 감지로 실행되지 않아 최신 상태를 읽은 뒤 실행했다. local callback의 error 있음/code 없음·공개 **OAUTH_AUTHORIZATION_DECLINED** 표식과 실패 heading/일반 오류 안내를 확인했다. **13:42:34 재시도 링크→공개 로그인, 13:42:49 보호 start→로그인 필요/logout 없음**으로 복구됐다. Guest는 13:43:13 종료했다. 증거는 `cancel-retry-20261030/guest-provider-cancel.json`·`guest-cancel-retry-cleanup.json`·공개 복구 캡처다.

이 취소 실행의 backend HTTP 상태/Date·Google access_denied 파라미터 직접 관찰·completion 요청 개수는 미수집이다. 실제 취소 UI/local error 귀환과 source error branch의 completion 생략을 확인한 결과이며, 별도 정상 callback HTTP/flow 증거와 구분한다. 새 가입/업무 mutation 없음. 이전 만료/invalid 거래는 계속 실패 기록으로 보존한다.

11차 좁은 verifier에서 v3의 Placeholder/Description 속 ID 문자열 오인 가능성을 발견해, 실제 Safari 주소 역할/ID metadata와 정확한 Chrome 주소 label만 받는 v4로 최소 교정했다. 음성 사례 6개 추가한 합성 28개 PASS/독립 재검토 전이다. 원문 출력은 두 버전 모두 없었으며 실제 취소는 정확한 Chrome prefix를 한정한 관측이었다. 자동 초기 출력의 개인정보 사건을 이 검사로 소급 해소한 것으로 보지 않는다.

Safari 로그 유지 OFF는 같은 창의 공개 문서 이동 후 이전 terms/privacy resource 0으로 확인했고, URL 필터 공란/캐시 비활성화 OFF·검사기 닫기/공개 로그인도 확인했다. 소유 HTTPS 6375는 SIGINT/exit 0, 3000·3001 비청취다. 이전 private 창 UUID가 남은 Mate 창과 일치하지 않아 그 창 종료는 사용자 확인 대기다. 최종 정리/두 리뷰 전 전체 Task 완료 판정은 보류한다. 기존 17개 전체 여정의 회사 사례 대기와 이번 인증 한정 범위를 분리한다.

12차 read-only verifier는 v4 28개 합성 검사를 독립 재실행해 PASS했고, 이번 실제 취소/오류/복귀의 근거가 AUTH-04 동작 요구를 충족한다고 확인했다. 추가 같은 취소/가입은 불필요하다. Guest 주소창의 “주의 요함” 표시가 남으므로 인증서 차단 화면 해제와 완전한 브라우저 신뢰를 혼동하지 않는다. 이전 logout 완료 private 창의 닫힘은 낮은 위험의 확인 잔여이며, 추가 창 식별도 불완전해 닫힘/부재의 증명으로 쓰지 않았다. 사용자 답변·최종 Gate 전 전체 완료는 보류한다. 새 실행 18개/보조 검토 11개는 별도 manifest로 고정했고 기존 27개를 보존했다. 이후 확인은 새 `final-review-20261030/`에 기록한다.

## QA-04 범위의 최종 증거 연결 · 2026-10-30 14:02 KST

사용자가 **이번 QA용 Safari 개인정보 보호 창은 모두 닫힘**이라고 회신했다. 이는 사용자 확인이며 Native의 불완전 창 검사를 소급 성공으로 바꾸지 않는다. 기존 logout·Guest 종료·보기 설정 복구·HTTPS 종료 증거와 함께 남은 정리 확인을 해소했다. source 변경/추가 로그인·가입 없이 3000·3001 비청취를 재확인했고 최종 Review Gate를 진행한다.

| 이번 범위 | 충족 근거와 한계 |
| --- | --- |
| `AUTH-01` 기존 계정 | 실제 QA-A/QA-B 기존 계정 귀환·현재 Origin/내부 복귀 경로·준비 중 네이버 비활성, backend callback 302→frontend 200→completion 200/동일 flow. 계정 원문 미기록 |
| `AUTH-02` 신규 가입 | 승인된 QA-B 1회 current 200/signup 201·같은 signup flow·이메일 readonly/이름·필수 동의 guard·선택 null·동의 code/version·start 이동. 테스트 계정 잔존 허용, 실제 가입 반복 없음 |
| `AUTH-03` 임시 약관 | 실제/별도 mock의 임시 본문·새 탭 링크·개발/테스트 표시, PRIVACY_POLICY v1/TERMS_OF_SERVICE v1 조회·전송. 정식 교체/재동의 정책은 POL-01/DEV-01 대상 |
| `AUTH-04` callback | 정상 callback HTTP/flow, 누락/잘못된 flow·외부 returnTo 차단·오류 재시도와 실제 Google 취소→DECLINED/local 오류→retry 복귀. 취소 자체의 backend HTTP/Date·provider access_denied 직접 관찰·completion 개수는 미수집, source error branch를 요청 0건 계측으로 표현하지 않음 |
| `AUTH-05` 세션 | 새로고침/refresh 200·수명 1,800초 뒤 실제 자연 만료 재발급 200, Response 전달 2.5초 지연 중 logout 유지·logout 200/쿠키 삭제·보호 차단·원복. 인증 상태 local 0/session 4 모두 Next namespace와 API auth memory source 대조. refresh cookie 장기 만료 전체를 기다린 검증은 아님 |
| `AUTH-06` 시작 선택 | QA-B 가입 직후 register/search/bids의 세 경로 이동 확인. 회사 데이터 제출/온보딩 업무 결과는 QA-05~08로 보존 |
| `AUTH-17` 인증 화면 한정 | 실제 로그인/가입 guard와 같은 255개 source/public 복사본의 별도 mock UI: desktop/390/320 폭·Tab/Space/오류 role=alert·약관 링크·pending disabled/두 번째 클릭/한 번 이동. 전체 회사 가입 화면·VoiceOver 발화·미래 날짜 추가 분기는 이번 완료로 올리지 않음. Figma 문구/치수·약한 TextInput 포커스 강조 Minor 유지 |

이 표는 QA-04가 맡은 인증/시작 범위의 최신 판정 근거다. 앞선 날짜별 0/17 등 과거 기록과 회사 업무 여정 전체 완료를 구분한다. 기존 실패/미실행 기록, 두 관측 출력 사건·교정과 현재 VM 설정/Clock/과거 만료 세부 원인 미확보는 유지한다. 현재 source·실제 API 성공·별도 mock UI·계약 검사·원격 CI 결과는 각각 별도로 기록한다.

14차 read-only verifier와 최종 AI Review를 거쳐 **QA-04 정의 범위의 검증·정리·문서 Gate PASS**로 판정했다. 현재 열린 Blocker/Major는 없으며 위 미수집 한계·과거 수행 사건·Minor는 유지한다. 회사 업무 여정 전체 17개 통과나 Git 전달 완료를 뜻하지 않는다. 다음 Task는 QA-01의 요구사항 Gate이며 이번 대화에서 자동 실행하지 않는다.

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

<a id="qa-05-20261102"></a>

## QA-05 회사 검색·소속 신청 조회 한정 · 2026-11-02

- 범위/승인: 사용자 답변으로 기존 QA-A/QA-B만 사용·나머지 상태 차단, 조회만 실행·신청 제출/상태 생성 차단, backend 실행 버전 자료 없음·미확인 유지를 확정했다. 실제 사용은 사용자가 직접 Google에서 선택한 QA-A다. 신규 가입/QA-B 로그인·회사/신청 변경은 실행하지 않았다. QA-04의 인증 완료를 회사 업무 사례 통과로 확대하지 않는다.
- 환경: source `80c4282df7a65652829e5f7e58ba7c39e64ae063` + QA 문서 편집만, `qa/qa-05-company-live`, Node 22.20.0/Next 16.2.9/Chrome 156.0.8078.79, `https://local.mate-bid.com:3000` → `https://api-test.mate-bid.com`, 2026-11-02 14:16~14:22 KST. desktop DOM client 1471×687, 회사 미연결/선택만 mobile viewport 390×844/320×700. 테스트 API의 현재 실행 버전 대응 근거는 미확인이다.

| 기존 사례 | 이번 결과 | 실제 수행·증거 | 남은 조건 |
| --- | --- | --- | --- |
| AUTH-07 회사 검색 | 차단（부분 확인） | QA-A에서 synthetic `QA05-NO-MATCH-20261102` 입력→회사 검색 GET 200→빈 화면/`회사 등록하기`의 `/auth/company/register` 링크. 입력 변경 뒤 같은 검색 GET만 브라우저 차단→연결 실패 안내→차단 해제/조회→GET 200·빈 결과 복구. 외부 증거 `auth-07-empty-search.json/.png`, `auth-07-browser-error.json/.png`, `auth-07-recovered.json/.png` | 승인 합성 회사의 결과 있는 이름/번호·페이지 기대값이 없음. 오류는 브라우저 한정 연결 실패이며 실제 backend HTTP 오류와 구분. 빈 검색의 관찰만으로 전체 통과 아님 |
| AUTH-08 대표/팀원 소속 신청 | 차단（미실행） | 입력 context·역할별 제출·성공/PENDING·중복/기존 소속/권한 분기 미실행. 신청 POST 0회. 회사 간 통합 완료로 세지 않음 | 전용 회사/계정·상태와 변경/복구 담당·방법 미확보, 제출은 이번 승인 범위 밖. 임의 회사 선택/상태 생성·복구 API 추정 없음 |

- 회사 정보의 미연결/신청 상태/기본 프로필·모바일·실패/복구 결과는 [my-company QA-05](my-company.md#qa-05-20261102)의 MCO-01~10（4통과·6차단）을 따른다. AUTH-01~06/인증 한정 AUTH-17의 과거 PASS와 AUTH-09~16의 다른 업무 대기 이력은 변경하지 않았다.
- 검색 복구 JSON의 `alertVisible: true`는 role 존재/가시성만 기록한 값으로 오류 메시지 소멸의 증거로 쓰지 않는다. 실제 GET 200·빈 결과 복구 캡처만 확인했고 AUTH-07 전체는 차단으로 유지한다. read-only verifier의 지적에 따라 한계를 명시했으며 원본 증거는 수정하지 않았다.
- 증거 루트（이 Mac 로컬, Git 미포함）: `/Users/jisung/.codex/visualizations/2026/11/02/01a19aad-a443-7753-aa21-507c86771e09/qa-05/`. 저장 파일은 허용한 비식별 요청 요약/UI만 포함하며 개인정보·cookie/token·원문 인증 query를 복사하지 않는다.
- 수행 사건: 서버 종료의 도구 출력에 callback 인증 거래 식별자가 포함됐다. 사용자에게 바로 알렸으며 원문을 여기나 증거 파일에 재출력/보관하지 않는다. 전체 인증 값 무효화 여부를 확인한 것으로 주장하지 않는다. [실패 예방 기록](../ai-context/ai-failures.md#qa-05-auth-log-output)과 my-company의 사건/한계를 따른다. 기존 QA-04 두 관측 사건/교정 기록은 별도로 보존한다.
- 정리: QA-A logout POST 200, 두 회사 직접 경로의 refresh 401과 비로그인 안내·각 next 복귀 확인. 차단 URL 해제/Network 비활성/viewport reset/소유 Chrome 탭 종료 및 Next 세션 14432/group 17789 종료 0·잔여 PID 없음·3000/3001 비청취. `logout.json`, `browser-cleanup.json`, `process-cleanup.json` 참조.
- 다음 Task는 **QA-05 재개**다. 상태별 자원·AUTH-07 합성 검색 fixture·AUTH-08 변경/복구 범위·현재 backend 실행 식별자 공백을 확인하는 것이 다음 첫 행동이다. QA-05 전체 통합과 다음 기능 진행 예외는 승인되지 않았으므로 QA-06을 자동 실행하지 않는다.

### 2026-11-02 14:38 KST · 다음 작업 선정의 후속 승인

사용자는 “QA-05의 남은 항목은 차단으로 유지하고 QA-06을 다음 작업으로 선정하는 예외”를 승인하고 QA-06은 새 대화에서 시작한다고 명시했다. 따라서 위 실행 종료 시점의 ‘다음 QA-05 재개/진행 예외 없음’은 과거 이력으로 보존하고, 현재 다음 작업은 [WBS](../development/figma-v01/README.md)의 **QA-06**을 따른다. [승인/인계 기록](../development/figma-v01/tasks/QA-05.md#qa-05-next-qa-06-exception) 참조. MCO 4통과·6차단/AUTH-07·08 차단, 미확보 자원/실행 버전·수행 사건 한계는 불변이다. 이번 후속의 실제 API/QA-06 실행은 없으며 QA-06의 자원·변경/복구 범위는 다음 요구사항 Gate에서 확인한다.

<a id="qa-06-20261102"></a>

## QA-06 사전 점검 · 2026-11-02 KST

[작업/재개 기록](../development/figma-v01/tasks/QA-06.md) · [검토 기록](../development/figma-v01/reviews/QA-06.md). 기존 17개 case 정의·과거 부분 실행·QA-04 인증 한정 PASS·QA-05 결과를 보존하며 이번 번호 등록 관찰을 구분한다.

- 사용자 결정: **“미준비 — 사전 점검 후 차단·재개 조건 기록 (추천)”**. 계정/번호/회사 fixture·조회 연결/등록의 변경·잔존·복구 범위가 준비되지 않아 실제 로그인·API 요청（GET 포함）·등록/복구·브라우저 QA는 실행하지 않았다. 과거 QA-A/B 사용 승인은 이번 번호 등록 허가가 아니다.
- 점검 식별자: `qa/qa-06-business-number-readiness`, 시작 HEAD/main/origin/main/직접 원격 `55196d3f06cd7fe012cd43ddc093340c3f150b56`, 시작 clean. Node 22.20.0/pnpm 11.3.0, Next 16.2.9. 문서상 대상은 local HTTPS → 테스트 API이며 현재 프론트 실행 snapshot·backend 배포/실행 SHA·image 대응은 **미확인**이다. 소스 branch·Swagger·과거 실행을 현재 배포 증거로 대신하지 않는다.
- 15:12 KST 계약 테스트: `pnpm test` **8파일·62건 PASS**, Vitest 4.1.11/Node. 기존 mock 번호 처리/등록 멱등성과 HTTP fetch 대역의 등록 성공→refresh 실패/401/403 경고·성공 결과 보존을 포함한다. 실제 번호 조회/등록·브라우저 통과가 아니다. 새 mock 브라우저 QA도 실행하지 않았다.

| 기존 사례 | 이번 판정 | 소스/계약에서 확인한 사실（실제 API 실행 아님） | 미실행·재개 조건 |
| --- | --- | --- | --- |
| AUTH-14 번호 조회·처리 | **차단（미실행）** | client의 숫자 10자리 검사·초기 current GET 복원/404 구분·처리 polling/수동 재조회, 번호 변경 시 `DELETE /api/v1/account-business-connections/current` → 연결 POST, 인증 회사 오류의 기존 회사 찾기 분기. HTTP Repository에 연결 POST/GET/DELETE 존재 | 정상·미등록/조회 불가·인증/미인증 중복·지연/실패 fixture와 계정별 기존 연결 기준, 변경 허용 횟수·DELETE 복구 범위 필요. 실제 preflight·재시도·새로고침·계정 교체 미검증 |
| AUTH-15 번호로 회사 등록 | **차단（미실행）** | 공통 패널의 회사 기본 정보/null·실적·대표면허/3종 인증, 대표/팀원 직급·여섯 금액대. client의 busy/필수 입력·payload별 멱등 키·완료 화면과 warning, Repository의 등록 POST 후 refresh. `AccountScope`의 계정 변경 초기화/만료 시 완료 유지 | 승인된 등록 대상·역할/희망 금액 기대값, 잔존 company/membership·권한/미인증 상태 기준과 정리 담당/방법, 안전한 refresh 실패 재현·해제 필요. 실제 서버의 중복 제출/등록 성공/세션 경고/계정 교체/null 표시·번호 경로 모바일/키보드는 미검증 |

- 이번 AUTH-14/15 합계: **0통과·0실패·2차단·0대기**. 과거 9자리 입력 UI 부분 관찰은 이력으로만 유지한다. AUTH-17의 번호 등록 화면 범위도 미실행이며 QA-04의 인증 화면 통과를 확대하지 않는다. O08의 가입 후 회사 대시보드 재사용은 별도 POL-06/DEV-08 범위다.
- 필요한 역할: 회사/번호 fixture·계정 담당, 등록 API/데이터 정리 담당, 테스트 배포 담당, 개발자 승인자, 프론트 QA 실행자. 실제 담당자 배정·테스트 별칭/기대값·mutation 허용 횟수와 복구 방법은 미확보다. `DELETE current`는 조회 연결 삭제 계약이며 회사/membership 전체 복구로 가정하지 않는다. 임의 복구 endpoint·DB 변경·fixture 생성은 없다.
- 환경/복구: 기본 셸 Node 26.5.0과 프로젝트 pin 22.20.0을 구분해 테스트에 pin 사용. 3000/3001 TCP 리스너 없음·전용 HTTPS 인증서/키 파일은 존재만 확인했고 내용·신뢰/유효성은 검사하지 않았다. 서버/브라우저/세션·회사 데이터를 만들거나 바꾸지 않아 이번 복구 대상 없음. 브라우저 버전/viewport·UI 캡처·Network·실제 API 시각은 미실행으로 해당 없음이며 과거 값을 재사용하지 않는다.
- 로컬 증거（Git 미포함）: `/Users/jisung/.codex/visualizations/2026/11/02/01a19ae1-401c-7c63-bc38-660380565208/qa-06/`의 `start-manifest.json`, `preflight.json`, `pnpm-test.log`, `document-check.json`과 두 리뷰. 환경파일·실제 번호/계정 원문·개인 키·인증 로그는 읽거나 출력하지 않는다.
- 다음 선택은 **QA-06 재개**. 자원·현재 사용 승인/변경·잔존·복구·실행 식별자를 확보하고 요구사항 Gate를 다시 확인한 뒤 실제 AUTH-14/15를 수행한다. QA-05 진행 예외는 QA-07 진행 예외가 아니며 이번 대화에서 다른 Task를 시작하지 않는다.

### 2026-11-02 15:26 KST · 다음 작업 선정의 후속 승인

사용자는 **“QA-06의 남은 항목은 차단으로 유지하고 QA-07을 다음 작업으로 선정하는 예외”**를 승인하고 QA-07은 새 대화에서 시작한다고 명시했다. 위 사전 점검 종료 시점의 ‘다음 QA-06 재개/QA-07 예외 없음’은 당시 이력으로 보존하고 현재 다음 작업은 [WBS](../development/figma-v01/README.md)의 **QA-07**을 따른다. [승인/인계 기록](../development/figma-v01/tasks/QA-06.md#qa-06-next-qa-07-exception) 참조. AUTH-14/15 0통과·2차단과 자원/변경·복구·실행 대응 미확보는 불변이다. 이 후속의 실제 API/QA-07 실행은 없으며 합성 문서·계정·업로드/등록의 변경·잔존·복구와 환경/실행 근거는 다음 QA-07 요구사항 Gate에서 확인한다. 이 선정은 QA-06 통합 PASS나 QA-07 실제 실행 승인이 아니다.

<a id="qa-07-20261102"></a>

## QA-07 가입 문서 업로드·OCR 사전 점검 · 2026-11-02 KST

[작업/재개 조건](../development/figma-v01/tasks/QA-07.md#qa-07-resume) · [검토 기록](../development/figma-v01/reviews/QA-07.md). 이 절은 과거 auth 기록/17개 case 정의를 보존한 추가 관찰이다. 현재/다음 Task와 상태는 [WBS](../development/figma-v01/README.md)만 소유한다.

- 승인: 파일/처리 기록과 등록 후 회사/소속/권한 등의 잔존 영향, 로그아웃만으로 복구되지 않는다는 설명 후 사용자가 **“사전 점검만 진행 (추천)”** 선택. 소스/문서/기존 계약 테스트와 Git 전달만 수행한다. QA-06의 다음 QA-07 선정 예외를 실제 mutation·복구/운영/배포 승인으로 확대하지 않았다.
- 환경/식별: 시작 `main`/`origin/main` `d12222ecc61b7e6f094f6e3a4c69c9da6fb85e6a`·clean, fetch/FF 후 `qa/qa-07-document-ocr`. PREP-01·QA-04·QA-06 선정 예외 main 반영 확인. 기본 Node26.5.0과 실행 Node22.20.0/pnpm11.3.0을 구분했다. 실제 대상 주소는 문서상 local HTTPS→api-test이며 이번에 접속하지 않아 도달/실행/CORS 상태를 새로 주장하지 않는다.
- 실행 증거: Node22 `pnpm test` **8파일62건·exit0**(15:33:52 KST 시작·626ms). Vitest4.1.11 Node의 mock/HTTP fetch 대역이다. 테스트의 `File`은 합성 바이트와 MIME/metadata이며 실제 OCR용 합성 PDF/JPG/PNG 준비나 업로드를 뜻하지 않는다.

| case | 현행 소스/계약 테스트로 확인한 범위 | 이번 실제 판정·미실행/차단 이유 |
| --- | --- | --- |
| AUTH-09 | `chooseFile`의 확장자/MIME·1byte~10MiB 검증, 파일별 멱등 키·SHA-256/metadata, private DTO→opaque handle·직접 PUT `credentials: omit`·서버 제공 header·성공 후 완료 POST 소스. HTTP 대역에서 checksum/metadata/멱등 header/PUT·서명 descriptor 비노출 검증 | **차단**. 승인된 합성 PDF/JPG/PNG/오류 파일·계정·객체/문서 정리 범위와 실제 storage PUT/CORS/서명/업로드 실패·완료 전환 미확인 |
| AUTH-10 | 1초 간격 polling과 effect 정리, API 계정별 UUID 복원 키/mock namespace 분리, 처리 실패 상태·수동 OCR/verification 재시도·버전 교체·proposal 전환 소스. mock에서 복원/실패/재시도/등록과 구버전 거부 검증 | **차단**. 실제 worker/상태·문서/버전·polling 중복/중단·새로고침·지연/실패/재시도/재업로드 fixture와 잔존/복구 근거 없음 |
| AUTH-11 | proposal/profile 표시, 업종 검색·code 선택, 억 원 변환·null/정보 없음·대표면허/3종 인증·자료 기준일과 직접 수정 disabled 소스 | **차단**. 기대 추출값·실적/인증·업종/null fixture 미확보. 실제 proposal/industries/변환 UI 결과 미실행 |
| AUTH-12 | VERIFIED/COMPANY_ALREADY_VERIFIED의 기존 회사 찾기 분기, 서버 allowedChoices에 따른 미인증 충돌 선택·정정 동의와 제출 전 guard 소스. mock revision 충돌 검증은 존재 | **차단**. 인증/미인증 중복·계정 권한별 allowedChoices·번호 정정의 승인된 fixture/기대 결과·변경/복구 범위 없음. 실제 충돌 선택·등록 요청 미실행 |
| AUTH-13 | 대표/팀원 직급·6금액대·전화·업종·충돌 선택, payload별 멱등 키/busy·등록 완료 후 세션 경고·AccountScope 소스. mock 검증 등록/회사 연결, HTTP handle 발급 중 계정 경쟁 검사. 공통 postCommit의 refresh 실패/401/403 테스트는 **번호 등록 호출**이며 문서 등록 endpoint의 직접 검증은 아님 | **차단**. 실제 문서 등록·중복 방지/서버 회사·소속/인증/충돌 잔존·refresh 실패/계정 경쟁·복구 미실행. 공유 helper/소스 관찰을 실제 문서 등록 PASS로 확대하지 않음 |

- 합계: 이번 AUTH-09~13은 **0통과·0실패·5차단·0대기**다. 문서 경로 AUTH-17의 desktop/mobile·키보드/오류 읽기/중복 클릭도 미실행·차단이며 5개 합계에 중복 산입하지 않는다. 과거 AUTH-09의 업로드 전 UI 관찰, QA-04 인증 한정 PASS와 QA-05/06 차단은 보존한다.
- 소유 소스: `src/app/auth/company/register/document/registration-client.tsx`, `src/data/company/{client,contracts,http-repository,api-types,mock-repository}.ts`, `src/components/auth/{company-registration,account-scope}.tsx`, `tests/company.test.ts`. UI는 public Repository를 사용하고 서명 URL/header는 private HTTP 경계에 둔다. 이번에 소스/테스트 수정 없음.
- 남은 준비/담당: 합성 문서·계정/회사 fixture 담당, storage/OCR 담당, 등록 API/정리 담당, 배포 담당·프론트 QA·개발자 승인자가 필요하며 개인 배정은 미확인이다. 비식별 별칭/안전한 위치·기대값·대상/횟수·문서/객체/버전/제안·회사/membership/권한/합치기 제안의 잔존 허용·정리 방법/담당과 현재 frontend snapshot/auth/company=api·backend/storage/OCR 실행 대응·안전한 오류/해제 방법 확보 후 재개한다. 승인 예외나 없는 삭제 API를 추정하지 않는다.
- 미실행/복구: 실제 API(GET 포함)/OAuth·브라우저·업로드/등록·서비스/데이터 변경 **0회**, 새 잔존/복구 대상 없음. 과거 계정/문서 상태도 조회하지 않았다. Node 계약 테스트는 종료했다. 브라우저 버전/viewport·UI 캡처/Network·실제 호출 시각은 미실행으로 해당 없음, 현재 runtime snapshot/backend 배포 대응은 미확보다. 과거 실행 값을 재사용하지 않는다.
- 로컬 증거(Git 미포함): `/Users/jisung/.codex/visualizations/2026/11/02/01a19af5-37ba-7f00-bb01-948b2c910697/qa-07/`의 시작/점검 manifest·테스트 로그·문서 검사·audit/리뷰 원문·최종 지문/Git receipt. 환경파일 값/개인 키/인증 로그·실제 문서·서명 URL/header·개인정보/비밀값은 열람하거나 남기지 않았다.
- 다음 하나: **QA-07 재개**. 실제 5개 필수 사례가 차단이고 QA-08 진행 예외가 없어 다음 P0로 자동 전환하지 않는다. 첫 행동은 main/Git와 위 자원·변경/잔존/복구/실행 식별자를 확인해 실제 QA 요구사항 Gate를 작성하는 것이다. 가입 후 서류함/대시보드 개발은 이 범위에 포함하지 않는다.

### 2026-11-02 15:50 KST · 다음 작업 선정의 후속 승인

사용자는 **“QA-07의 남은 항목은 차단으로 유지하고 QA-08을 다음 작업으로 선정하는 예외”**를 승인하고 QA-08은 새 대화에서 시작한다고 명시했다. 위 종료 시점의 ‘다음 QA-07 재개/QA-08 예외 없음’은 당시 이력으로 보존하며 현재 다음 작업은 [WBS](../development/figma-v01/README.md)의 **QA-08**을 따른다. [승인/인계 기록](../development/figma-v01/tasks/QA-07.md#qa-07-next-qa-08-exception) 참조. AUTH-09~13 0통과·5차단·문서 AUTH-17 미실행과 자원/변경·잔존·복구/실행 대응 공백은 불변이다. 이번 후속의 실제 API/QA-08 실행은 없으며 초대/계정·Origin/실행 근거와 preview/resume/acceptance/decline의 사용·초대 소비·membership 변경/잔존/정리 담당·방법은 다음 QA-08 Gate에서 확인한다. 초대 발송 승인이나 QA-07 통합 PASS, QA-08 실제 실행 승인으로 확대하지 않는다.


<a id="qa-08-20261102"></a>

## QA-08 · 초대 수신 사전 점검 · 2026-11-02 KST

[작업/재개 조건](../development/figma-v01/tasks/QA-08.md#qa-08-resume) · [검토 기록](../development/figma-v01/reviews/QA-08.md). 사용자는 자원 미준비로 **소스·문서 사전 점검만** 선택하고 **실제 API·초대 소비·회사 변경은 승인하지 않음**을 확인했다. 이번 AUTH-16은 **실제 0통과·1차단**이며 초대 화면 AUTH-17도 미실행이다. 아래는 새 case ID가 아닌 AUTH-16의 하위 확인 조건이다. 기존 17개 case 정의와 QA-04 인증 한정 PASS·다른 회사 QA/과거 이력은 보존한다.

- 소스 환경: `qa/qa-08-invitations`, 시작/프론트 소스 HEAD `c07f03f3b530e0529bf898bf688dea168efd9c7a`, 시작 main=origin/main·clean, 이후 이번 Markdown5개만 변경. PREP-01/QA-04/QA-07 선정 예외의 main 반영을 확인했다.
- 점검 도구: Python/Git·소스 심볼/직접 대조. 기본 셸 Node26.5.0·pnpm11.3.0, 프로젝트/CI pin22.20.0과 설치된 Node22.20.0 확인. 이번 `pnpm test/lint/build/build-storybook`은 실행하지 않았다. 문서만 바꾸고 앱/빌드 영향이 없어 링크·ID/상태·보호/이력·diff-check로 검증한다.
- 문서상 환경은 local HTTPS→api-test이나 **현재 실행하지 않았다**. 실제 frontend snapshot/서버·backend 배포/메일 링크 Origin·브라우저 버전/viewport·UI 캡처/Network는 미확보/미실행(사전 점검만 승인). 실제 링크·token/cookie·계정/이메일·인증값·환경파일은 읽거나 기록하지 않았다.

| AUTH-16 하위 조건 | 현행 소유 소스에서 확인한 사실 | 실제 QA 결과/남은 근거 |
| --- | --- | --- |
| 링크 preview·URL 제거 | [invitation-client:26](../../src/app/auth/company/invitations/invitation-client.tsx:26)는 fragment의 초대값을 읽고 `history.replaceState`로 hash를 지운 뒤 preview를 호출. [HTTP:26](../../src/data/company/http-repository.ts:26)은 `POST /api/v1/company-membership-invitations/preview` body로 전달 | **차단·미실행**. 실제 메일 링크 Origin/형식·preview 쿠키/CORS·URL 잔존 여부 미확보 |
| preview 실패·이전 handoff 미재개 | 같은 UI는 preview 실패를 `failed`로 두며 resume effect는 `ready`와 authenticated 상태에서만 실행. fragment 없는 재방문은 ready 후 resume | **차단·미실행**. 유효한 이전 쿠키+실패 초대용 독립 fixture로 실제 미재개 확인 필요. 서버의 쿠키 삭제/잔존은 코드만으로 판정하지 않음 |
| 로그인/신규 가입 뒤 복귀 | [auth client:18](../../src/data/auth/client.ts:18)은 내부 경로 검증·현재 Origin을 전달. [signup-form:94](../../src/app/auth/signup/signup-form.tsx:94)는 초대 경로를 직접 복귀하는 분기, callback은 검증한 returnTo로 이동 | **차단·미실행**. 승인된 기존/신규 수신 계정·가입/잔존 범위·동일 브라우저 handoff/OAuth 귀환 필요 |
| 계정 불일치·교체 | UI는 `emailMatched=false`일 때 수락/거절 대신 다른 계정 로그인 표시. logout 뒤 초대 경로로 OAuth를 시작. [계약](../../src/data/company/contracts.ts:36)은 emailMatched/canAccept/version을 제공 | **차단·미실행**. 불일치/정상 계정 별칭·기대 membership과 교체 후 resume/이전 문맥 분리 확인 필요 |
| 수락·중복 클릭·membership | [HTTP:34](../../src/data/company/http-repository.ts:34)는 acceptance에 `expectedVersion` 전송 후 postCommit refresh. UI의 busy/수락 가능 상태로 버튼을 제한 | **차단·미실행**. 수락용 disposable 초대·변경/잔존/복구 승인·단일 요청 및 서버 membership/권한 확인 필요. UI 코드만으로 서버 멱등성을 보장하지 않음 |
| 거절·만료·재사용·버전 | [HTTP:39](../../src/data/company/http-repository.ts:39)는 decline에 `expectedVersion` 전달. UI는 Repository 오류를 표시. 실제 API 모드의 만료/소비/충돌 판정은 서버 오류 응답에 의존 | **차단·미실행**. 거절/만료/사용된 독립 초대·버전과 안전한 기대 오류·정리 계획 필요. 실제 오류 code/status는 미확인 |
| 성공 뒤 refresh 실패·완료/복귀 | [postCommit:172](../../src/data/company/http-repository.ts:172)는 refresh 실패 시 결과+sessionWarning 반환. UI는 완료 화면·경고를 유지하며 수락/거절 모두 `/bids`, 뒤로 `/auth/start` | **차단·미실행**. 수락 성공 후 갱신 실패를 안전하게 재현/해제하고 재수락 없이 최종 membership/세션을 확인해야 함. 팀원 화면 개발은 POL-15/DEV-33 별도 |
| 기존 mock/HTTP 대역 경계 | [company test:19](../../tests/company.test.ts:19)는 mock 초대 문맥 유지·불일치403·버전409·계정별 회사 상태를 검사하는 코드. 같은 파일 refresh 실패/401/403 사례는 번호 등록 호출을 통한 공통 helper 증거 | 이번 mock/HTTP 대역/브라우저 **재실행 없음**. 기존 테스트 존재·과거62건 PASS를 초대 endpoint 또는 실제 API PASS로 세지 않음 |

필요 자원은 승인된 회사/발신자/정상·불일치·신규 계정 별칭, 유효/만료/사용된 초대와 수락/거절용 disposable fixture, 메일 링크 Origin, preview/resume/acceptance/decline·계정/초대 소비/membership·잔존/복구의 담당/방법, 현재 실행 대응이다. 담당 역할은 회사/초대 fixture·인증/메일/API·배포 담당과 개발자 승인자/프론트 QA 실행자이며 실제 개인은 미확인이다. 초대 발송은 별도 명시 승인 전 미실행하고 링크/값을 채팅/문서에 받지 않는다.

실제 API·OAuth·브라우저·초대/회사 변경·서비스 운영/배포 **0회**, 새 잔존/복구 대상 없음. 이전 자원을 삭제하거나 logout을 초대/membership 복구로 주장하지 않는다. 마지막 확인일2026-11-02. 다음 Task는 **QA-08 재개**이며 main/Git·재개표·AUTH-16과 위 자원/승인·실행 근거부터 확보한다. QA-08→QA-09 예외가 없어 자동 이동하지 않는다. 사전 점검 문서의 검증/리뷰·Git 전달과 실제 QA 차단은 구분한다.


### 2026-11-02 16:38 KST · QA-09 다음 작업 선정의 후속 승인

사용자는 **“QA-08의 남은 실제 QA는 차단으로 유지하고 QA-09를 다음 작업으로 선정하는 예외”**를 승인하고 QA-09는 새 대화에서 시작한다고 명시했다. 위 종료 시점의 ‘다음 QA-08 재개/QA-09 예외 없음’은 당시 이력으로 보존하며 현재 다음 작업은 [WBS](../development/figma-v01/README.md)의 **QA-09**를 따른다. [승인/인계 기록](../development/figma-v01/tasks/QA-08.md#qa-08-next-qa-09-exception) 참조. AUTH-16 실제0통과·1차단·초대 AUTH-17 미실행과 자원/사용·소비·membership·잔존/복구/실행 대응 공백은 불변이다. 이번 후속의 실제 API/QA-09 실행은 없으며 계정/공고·초기 active·현재 실행 근거와 구독 조회/변경·생성 알림/등록 이력의 잔존·복구 담당/방법은 다음 QA-09 Gate에서 확인한다. QA-08 통합 PASS나 QA-09 실제 실행/구독·알림 생성 승인으로 확대하지 않는다.

<a id="pol-01-preflight"></a>

## POL-01 정식 약관·푸터 정책 사전 점검 · 2026-11-05

[작업 기록/재개 조건](../development/figma-v01/tasks/POL-01.md#pol-01-resume) · [문서 검증/검토](../development/figma-v01/reviews/POL-01.md) · [현재/다음 작업 WBS](../development/figma-v01/README.md).

- 사용자 답변: 정식 약관·개인정보·필수 동의의 승인 자료는 **미준비**, 기존 테스트 동의 전환 방침은 **미결**, 푸터 공개 정보·문의 목적지 자료는 **미준비**이며 각각 차단 유지를 요청했다. 정책 작성·법적 판단·정식 공개·재동의 정책의 신규 승인은 없다.
- 현행 소스 관찰: 약관 두 경로는 개발·테스트용 임시 본문/정식 아님/noindex 표시다. 가입폼은 PRIVACY_POLICY/TERMS_OF_SERVICE를 확인하고 서버 requiredAgreements의 code/version을 전송하도록 구현돼 있다. 홈 footer는 빈 영역이다. 소스 관찰을 이번 실제 API 조회/가입/버전 전송 검증으로 세지 않는다.
- 이번 실제 API/OAuth/가입/브라우저·mock/HTTP 대역 재실행은 **0건**, 신규 실제 통과 **0건**이다. AUTH-02/03과 QA-04~08의 기존 이력/판정을 그대로 보존한다. AUTH-03의 임시 약관 테스트 결과는 정식 본문·전환 정책의 통과 근거가 아니다.
- 후속 DEV-01의 정식 본문/버전/링크·필수 동의 누락·전환 방침/서버 대응 검증은 승인 자료 확보 후 별도 요구사항 Gate에서 정한다. DEV-02의 푸터/문의 구현·브라우저 QA도 미실행이다. 이번에는 계정·동의 이력·운영 데이터 변경과 복구 대상이 없다.
- 필요한 담당 역할은 콘텐츠 관리/정책 승인, 인증 백엔드, 사업자 공개 정보/문의 채널 운영, 프론트 검증 담당이며 개인 배정은 미확인이다. 재개 시 원문 경로·불변 버전/적용일/URL·승인 근거·기존 동의 방침·공개 범위/문의 목적지와 현행 code/version 대응을 확인한다. 개인정보/개인 연락처 원문은 요청하거나 기록하지 않는다.
- 다음은 **POL-01 재개**다. 최신 main과 작업 기록의 재개 표를 대조하고 승인 자료를 확보해 요구사항 Gate를 다시 작성한다. 새 진행 예외가 없어 DEV-01/DEV-02 또는 다른 Task를 자동 시작하지 않는다. 사전 점검 문서의 검증·리뷰/Git 전달과 정책 차단을 구분한다.

### 2026-11-05 13:12 KST · POL-02 다음 작업 선정의 후속 승인

사용자는 **POL-01 정책 차단을 유지하고 선행 조건을 충족하는 다음 Task 하나를 선정하는 예외**를 승인했으며 다음 Task는 새 대화에서 시작한다고 명시했다. 위의 ‘다음 POL-01 재개/새 예외 없음’은 당시 이력으로 보존하고, [승인/선정 기록](../development/figma-v01/tasks/POL-01.md#pol-01-next-pol-02-exception)에 따라 다음 요구사항 Gate 대상은 **POL-02**다. P0 DEV-01/02·QA-16의 선행 미충족을 보존하며 P1 표의 첫 후보 POL-02는 DOC-001 완료/main 반영을 충족한다. 현재/다음/상태는 [WBS](../development/figma-v01/README.md)에서 관리한다.

승인 원문/책임 역할·기존 동의 전환·푸터 공개 정보와 POL-01 재개5조건은 미확보/차단 그대로다. AUTH-02/03·QA-04~08의 이력·판정을 변경하지 않는다. 이번 실제 API/가입/동의 이력 변경·mock/HTTP 대역·브라우저 신규 실행0건/신규 실제 통과0건이며 정책 완료·정식 약관 공개·POL-02 착수/정책/API 승인으로 확대하지 않는다. 다음 첫 행동은 새 대화에서 최신 main과 POL-02 후보/선행 근거·data-access를 확인해 요구사항 Gate를 작성하는 것이다. 이번에는 해당 Task의 조사·결정·개발을 실행하지 않는다.

<a id="dev-59-local-qa"></a>

## 2026-11-12 · DEV-59 가입 회사 근거 로컬 검증

- 실행 식별자: `DEV-59-20261112`, clean base `80445aa` 이후 전용 branch의 source/테스트4파일과 동일한 격리 사본. Node22.20.0/pnpm11.3.0·Next16.2.9·Aside Browser(Chromium), loopback3159, desktop1440×1000/mobile390·320×900. 실행 시각은 외부 build/test/server 로그에 보존한다.
- 범위: Figma3140:123224의 기존 CompanyEvidencePanel에 공급되는 번호/문서 가입 프로필·저장 변환. 원래 구조/asset·직접 편집 비활성은 유지한다. Figma 예시 연도25를 데이터 근거로 쓰지 않으며 전체 화면/pixel 정합성 PASS는 주장하지 않는다.
- 자동: `pnpm test` 14파일284건(신규29건), lint·API/mock/hybrid build·Storybook·운영 mock 시작 거부 PASS. HTTP fetch 대역은 출처4종·인증3종·금액/연도/null·개별 자료일 보존과401/403/409/503을 검증한다. 저장의 구형 연결/문서/proposal/revision·cached replay/계정·타 도메인·실제 문서키 보존, 새 형식의 잘못된 상태/출처/날짜 거부를 확인한다.

| 로컬 case | 수행/관찰 | 결과/근거 |
| --- | --- | --- |
| CEV-01 | 번호 기본·5억/연도null·면허Y·인증Y/N/정보 없음·자료일 | PASS · default AX/PNG |
| CEV-02 | Tab으로 직접 편집 disabled를 건너뛰고 다음·Enter로 preferences 이동 | PASS · 브라우저 관찰 |
| CEV-03/04 | 390/320px 카드·가로 넘침0 | PASS · viewport/scroll 동일, PNG |
| CEV-05 | 같은 탭 새로고침→identity→근거 복원 | PASS |
| CEV-06 | 알려진 구형 탭의 합성2030년/ACTIVE/빈 인증을 null/UNKNOWN으로 변환·연결 유지 | PASS · legacy AX/저장 marker1 |
| CEV-07 | 합성 파일 mock 처리→문서 제안→혼합 근거 카드 | PASS · document AX/PNG. 실제 업로드/OCR 아님 |
| CEV-08/09 | 계정2의 빈 상태·계정1 복귀 시 기존 연결 복원 | PASS · account-2 AX/관찰 |
| CEV-10 | evidence-empty의 금액/면허·인증4개 정보 없음·확인된 자료 없음 | PASS · empty AX/PNG |
| CEV-11 | auth API 로컬 대역/company mock·근거 표시·추가 회사 HTTP0 | PASS · hybrid AX/대역 로그 |
| CEV-12/13 | 회사 HTTP 대역503 오류→다시 확인하기→200 근거 복구 | PASS · http-503/recovered AX |
| CEV-14/15/16 | HTTP 대역403/409/최종401이 오류로 남고 mock 성공으로 바뀌지 않음 | PASS · 상태별 AX·대역 로그 |

- 네트워크: full mock 번호32/문서31 resource의 외부0, empty 외부0. hybrid30 resource 중 로컬 auth1/비loopback0·대역 로그 회사 요청0. HTTP 최종401 화면28 resource/로컬 대역6/비loopback0. 실제 OAuth·업무 API·storage 전송·메일0건이다. ResourceTiming과 대역의 method/path/status만 확인하며 헤더/토큰/원본 업무 데이터는 기록하지 않는다.
- 실제 API 통합: **미실행**. QA-06 AUTH-14/15 0통과2차단, QA-07 AUTH-09~13 0통과5차단/기존 AUTH-17 미실행 및 변경·잔존·복구·실행 대응 재개 조건은 유지한다. 이 로컬 PASS로 실제 QA나 POL-06/DEV-08 Gate를 면제하지 않는다.
- 증거: `/Users/jisung/.codex/visualizations/2026/11/12/mate-dev-59`의 test/lint/build/Storybook·guard·server 로그, browser `cases.json`/AX/PNG·로컬 HTTP 대역. 초기 pnpm/Turbopack 환경 오류 발췌와 교정은 `environment-errors.md`로 구분한다. [Task](../development/figma-v01/tasks/DEV-59.md#dev-59-verification)와 [Review](../development/figma-v01/reviews/DEV-59.md)에서 최종 Gate/freshness를 확인한다.

<a id="dev-57-local-qa"></a>

## 2026-11-13 · DEV-57 auth 프레임·별도 달력 로컬 검증

- 승인/범위: [DEV-57 D1/D2/D3](../development/figma-v01/tasks/DEV-57.md#dev-57-brief). 사용자 확정 nickname/fallback·Figma2081:64659 별도 달력, 로컬 범위 완료·실제 QA 차단 보존. 기존 AUTH-01~17·QA-04/05/08·POL-01의 날짜별 판정/재개 조건을 덮어쓰지 않는다.
- 실행: 2026-11-13 KST, Node22.20.0/pnpm11.3.0, Next16.2.9 production build/start, Aside Chrome154/macOS·1920×1080/820×600/390×844/320×844·DPR2. 환경파일 없는 API/mock/hybrid 격리 복사본과 loopback 합성 HTTP 서버만 사용했다. 실제 OAuth·업무 API·메일/초대·운영/배포0건이다.
- Figma는 2026-11-13 조회 시점의 변경 가능한 node이며 immutable 디자인 버전이라고 주장하지 않는다. 이번 대표 화면/측정과 추가 keyboard/error/mobile 검증을 모든 상태의 pixel PASS로 확대하지 않는다.

| 로컬 case | 기대/관찰 | 판정·관찰 수준 |
| --- | --- | --- |
| AUI-01 | 로그인420/가입640/시작692/검색640/초대640px 구분. 시작 타일 약207.33×233.18px·간격10px/아이콘64px. 로그인/가입 전체를692px로 바꾸지 않음 | PASS · 실제 Next DOM/PNG, 프레임 표는 Task |
| AUI-02 | mock 신규 가입 이름·HTTP 가입 응답 nickname으로 정상 인사. 탭 저장소에 입력 이름 없음 | PASS · mock/HTTP 대역 브라우저·Node. 새 Repository의 신규 mock 이름은 null |
| AUI-03 | HTTP nickname null/누락/공백은 일반 인사, 긴 합성 이름320px에서 줄바꿈·가로 넘침0 | PASS · HTTP 대역 브라우저. 실제 응답 아님 |
| AUI-04 | 세션 지연 중 상태 문구만/선택0, 완료 뒤 이름·선택3. 503 오류/재시도, 최종401은 로그인 안내 | PASS · HTTP 대역. 중간 도구 wait timeout은 후속 fresh snapshot으로 완료 확인, 제품 실패로 세지 않음 |
| AUI-05 | Calendar Figma2081:64659의 2026년1월·일요일 primary/선택 원·7열/320×344px | PASS · Storybook 실제 브라우저(320×343.99px), 캡처/원본 직접 비교 |
| AUI-06 | 실제 월/윤년·1900/2000년 윤년 차이·월말/연도/DST 이동·4~6주 | PASS · Node 날짜 테스트, 브라우저 2024-02-29 선택 |
| AUI-07 | 최소1900-01-01의 이전 달 disabled, 오늘 이후 날짜/다음 달 disabled·ArrowRight 상한 유지 | PASS · Storybook/가입 브라우저·Node. 미래값 방어는 제출의 isDateInRange에서도 유지 |
| AUI-08 | ArrowLeft/Home/PageUp 이동·현재 날짜 버튼에 초점, 연/월 빠른 선택·Enter/Space 선택 | PASS · Calendar 브라우저와 날짜 연산. native date input0 |
| AUI-09 | Tab/Shift+Tab modal 내부 순환·Escape/선택 뒤 trigger 초점 복귀·선택 해제 | PASS · 실제 Next 브라우저. clear 뒤 선택 안 됨 |
| AUI-10 | 390px popup x54..374/day32px, 320px x16..304/day27.42px, 화면/달력 넘침0 | PASS · 실제 viewport/DOM/PNG |
| AUI-11 | 동의 전/한 필수 해제 시 가입 disabled·전체/개별 동의와 키보드 Space 복원 | PASS · mock 브라우저. 키보드는 checkbox 명시적 focus 뒤 확인 |
| AUI-12 | 잘못된 선택 전화 입력은 제출 전 오류, 선택값 비움은 가입 가능·약관 code/version 유지 | PASS · mock/HTTP 대역/기존 계약 테스트. 정식 약관 승인 아님 |
| AUI-13 | 가입 flow 누락은 재로그인 안내, HTTP 가입503은 폼/이름 보존, 재시도 성공 뒤 시작 이름 표시 | PASS · 로컬 HTTP 대역 브라우저 |
| AUI-14 | 회사 검색 정상 결과·빈 결과 등록 링크·503 오류를 각각 표시, 390/320px 넘침0 | PASS · mock/HTTP 대역 브라우저. 회사 소속/통합 용어 정책은 변경하지 않음 |
| AUI-15 | 초대 정상 정보/64px 버튼, mismatch는 수락 버튼0·계정 전환 안내 | PASS · 로컬 HTTP 대역 브라우저 |
| AUI-16 | 초대410 만료는 오류/수락0, 수락409 충돌은 오류를 남기고 성공 화면으로 전환하지 않음 | PASS · 로컬 HTTP 대역 브라우저 |
| AUI-17 | 합성 초대 수락 성공 뒤 완료 문구/복귀 링크, 정상 초대390/320px 넘침0 | PASS · 로컬 대역만. 실제 초대 소비/membership/팀원 화면 QA 아님 |
| AUI-18 | auth HTTP + company mock hybrid에서 서버 nickname·mock 회사2개 표시 | PASS · 실제 Next 혼합 구성/대역 로그. 공급원/계정 격리·refresh 경쟁·권한/409 회귀는 Node 계약/구조 tests로 별도 확인 |

- Figma/기능 경계: 시작 default `3140:120851`/hover `3140:121614`, 가입 `3140:119739`, 실제 검색 `3140:121777`, 실제 초대 `3141:56135`, 로그인 `2306:88681`을 구분했다. `3140:117483` section을 단일 초대 화면으로 사용하지 않는다. Google-only/네이버 준비 중, 임시 약관 안내, 역할 `VIEWER`의 현행 ‘조회자’와 소속 용어는 기존 정책/소유를 유지하는 기능 차이이며 화면 전체의 명시적 예외 승인으로 세지 않는다. 공통 헤더 이름은 DEV-56 소유다.
- 자동 검증: `pnpm test`18파일/414건 PASS, `pnpm lint`PASS, API/mock/hybrid `pnpm build`PASS, `pnpm build-storybook`PASS. 초기 nullable 타입 오류와 label 교정 뒤 자동 검증/구성 빌드·가입 재검증의 freshness는 [검토 기록](../development/figma-v01/reviews/DEV-57.md)을 따른다. Storybook의 기존 extensionless import/큰 chunk 경고는 성공 exit0과 구분한다.
- 실제 통합: **미실행/차단 보존**. 게시 nickname schema/source 확인은 현재 실행 SHA/실제 인증 응답과 다르다. 실제 Google 인증·가입/초대 권한·서버 날짜 validation·잔존/복구 검증은 기존 승인 자원/실행 대응을 확보한 뒤 재개한다. 이번 로컬 PASS/Chromatic 예외로 면제하지 않는다.
- 증거: 저장소 밖 `/Users/jisung/.codex/visualizations/2026/11/13/01a1d2c3-f5a6-79e0-996f-aae00cd9be1a/dev-57`의 `browser/` AX/PNG/JSON, loopback `http-events.jsonl`(method/path/status만), 최종 test/lint/build 로그·Figma PNG/지문. 대표 [달력](../development/figma-v01/reviews/assets/DEV-57/calendar.png)·[시작](../development/figma-v01/reviews/assets/DEV-57/start.png)은 합성 데이터만 포함한다. 요청 headers/원시 인증값·실제 개인정보는 수집하지 않는다.

<a id="dev-33-auth-regression"></a>

## 2026-11-20 · DEV-33 초대 수신·완료의 인증 회귀

| 기존 사례 | 로컬 Next 브라우저에서 확인한 행동 | 실제 API |
| --- | --- | --- |
| AUTH-16 | 전체 mock에서 주소의 초대 fragment가 제거되고 합성 로그인 뒤 초대에 복귀했다. 계정 불일치에서 수락/거절 행동이 숨겨지고 가상 계정을 바꿔 거절한 뒤 `/bids`로 이동했다. HTTP 대역으로 `CI006`의 다른 계정 안내, 만료에서 수락 불가와 `/auth/start` 복귀를 확인했다 | 기존 0통과·1차단 유지 |
| 초대 화면 AUTH-17 | 1280×900에서 키보드 수락·완료 제목 초점·Tab/Enter CTA와 360×800에서 폴백 가로 넘침 없음을 확인했다. 닫기는 `/`에 도착했다. 새로고침·뒤로가기에서 사용한 초대가 재생되지 않았다 | 기존 미실행 유지 |

실제 OAuth, 초대 소비·멤버십 변경, 메일 실행은 각 0회다. [QA-08의 실제 조건](#qa-08-20261102)과 이전 판정을 유지한다. 상세 요청·오류·O11 사례는 [TEAM-23/24의 로컬 검증](team-members.md#dev-33-local-qa)에 연결한다.

첫 verifier 검토를 반영해 수신 확인 뒤 세션이 만료되는 경우를 loopback에서 재현했다. fragment가 없는 경로에서 401을 받은 뒤 기존 초대 세부정보를 숨기고 로그인 버튼을 표시했다. Enter로 활성화한 로컬 로그인 요청의 `returnTo`는 `/auth/company/invitations`였다. 돌아와 새 수신 확인을 한 뒤에만 수락·거절이 표시됐다. 복귀 뒤 추가 수락 POST는 없었다.

<a id="pol-21-o09-qa"></a>

## 2026-11-20 · POL-21 가입 실적·인증 보정 검증 계획

[확정 정책과 Figma 예외](../development/figma-v01/tasks/POL-21.md#pol-21-contract) · [DEV-44 서버 선행과 QA 조건](../development/figma-v01/tasks/DEV-44.md#dev-44-pol-21-contract-gate). 아래 9건은 **미실행**이다. 실제 QA는 각 경로의 등록 계약·실행 버전과 승인된 계정·합성 데이터/문서·잔존/복구 범위를 확보한 뒤 진행한다.

| 새 사례 | 조건 | 기대 결과 |
| --- | --- | --- |
| O09-01 | 번호 조회가 성공해 일부 실적을 확인함 | 조회 금액 및 선택값의 보정과 누락 보완이 가능하고 보정 전 보고서 값·기준일이 보존된다. 다음에서는 저장하지 않는다. |
| O09-02 | OCR 검증과 등록 제안이 유효함 | 같은 보정 기능을 제공한다. 실적 입력은 증명서의 회사 기본정보·문서 판정과 기존 회사 연결 선택에 개입하지 않는다. |
| O09-03 | 두 경로에서 실적 없음·실패·일부 `UNKNOWN` 또는 `NO` | 금액 미입력으로 다음을 선택할 수 있다. 선택 없음·명시 없음·명시 미확인을 구분하고 유효한 조회값을 유지한다. 등록 자체의 필수 근거 미확보 분기는 별도로 확인한다. |
| O09-04 | 공란·0·정상 금액·음수·소수·상한 및 초과 | 보정 유무와 0을 구별하고 원 단위가 무손실로 이동한다. 잘못된 값은 필드 오류를 알리고 보정 입력을 유지한다. |
| O09-05 | 보정 후 뒤로가기, 같은 후보 재조회, 보고서·제안 변경 | 보정 입력을 보존한다. 달라진 근거와 수기값을 나란히 확인할 수 있고 필요한 재확인 전에는 제출하지 않는다. 늦은 응답이 현재 값에 적용되지 않는다. |
| O09-06 | 새로고침·이탈·다른 계정·새 번호 연결/문서 버전 | 임시값을 되살리거나 다른 후보에 옮기지 않는다. 기존 식별자 복원·계정 격리를 확인한다. |
| O09-07 | 번호·OCR 각각에서 보정값을 최종 등록, 같은 요청 중복 | 초기 소속과 보정 적용을 함께 확인하고 현재 값의 조회·원본과의 구분을 검증한다. 같은 요청이 새 회사·보정 이력을 중복 생성하지 않는다. |
| O09-08 | 두 경로의 중간 저장 실패, 검증 오류·권한/버전 충돌·응답 유실 | 각 경로에서 중간 저장 실패를 유발한 뒤 회사·초기 소속·보정값을 다시 조회해 부분 저장이 없고 기존 상태가 보존됨을 확인한다. 검증 오류나 충돌에서 입력 보존·최신 조회·사용자 재확인을 검증한다. 응답 유실은 결과 조회 전 미확정이고, 확인된 성공 후 세션/조회 오류에서는 등록을 반복하지 않는다. |
| O09-09 | 네 Figma 상태, 모바일·키보드·오류 읽기 | 미입력 진행과 미확인 표현의 승인 예외를 대조한다. 유효한 다음 단계, 오류에 접근할 수 있는 입력 순서, 기존 완료/되돌아가기 흐름을 확인한다. |

이번 확인은 시안·소스와 게시 계약의 대조다. 실제 통합, 앱 브라우저, mock 및 HTTP 대역 실행은 0건이다. 기존 AUTH-14/15 2차단, AUTH-09~13 5차단과 가입 화면 AUTH-17 미실행을 유지한다. [번호 가입 QA](#qa-06-사전-점검--2026-11-02-kst) · [OCR 가입 QA](#qa-07-가입-문서-업로드ocr-사전-점검--2026-11-02-kst) · [DEV-59 로컬 근거](#dev-59-local-qa)

<a id="pol-24-o02-qa"></a>

## 2026-11-23 · O02 네이버 미지원의 QA 경계

[POL-24](../development/figma-v01/tasks/POL-24.md#pol-24-contract)에서 승인된 Google 단독 범위를 확인했다. O02 시안의 초록색 버튼, 현행 `/auth`의 `disabled` ‘준비 중’ 안내, Google 전용 시작/완료 소스와 게시 개발 OpenAPI를 대조했다. 이는 문서·소스 확인이며 Google과 네이버의 실제 OAuth, 앱 브라우저, mock/HTTP 대역은 모두 미실행이다.

AUTH-01의 네이버 비활성·요청 없음 기대와 AUTH-04/05의 Google 복귀·세션 회귀, 기존 가입 및 실제 QA 이력을 보존한다. 네이버 사례의 등록과 실행은 [DEV-48](../development/figma-v01/tasks/DEV-48.md#dev-48-pol-24-handoff)에서 신규 지원 결정·계약·현재 실행 버전·합성 자원과 사용/복구 범위가 확보된 뒤 결정한다.

<a id="qa-05-20261125-auth"></a>

## 2026-11-25 KST · QA-05 회사 찾기와 소속 신청 재개 점검

| 사례·시안 | 이번 관찰과 현행 계약 | 실제 QA 판정 |
| --- | --- | --- |
| AUTH-07 · [회사 찾기 3140:121614](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-121614) | 격리된 mock에서 설정 경유 찾기 화면의 검색 입력과 빈 검색어의 조회 버튼 비활성을 확인했다. 현행 검색 GET의 필수 `query`와 0부터의 `page`, 화면 요청 `size=10`을 대조했다. 소스에서 회사명 최소 두 글자와 번호 10자리 분기를 확인했다. | 차단. 11월 2일의 실제 빈 결과·연결 실패/복구만 부분 확인으로 유지한다. 이름·번호의 결과/페이지 기대값이 있는 승인 합성 회사와 실제 검색 오류의 안전한 재현 조건이 필요하다. |
| AUTH-08 · [대표/팀원 3140:121981](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-121981) · [3140:122094](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-122094) · [3140:122231](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-122231) | 소스와 게시 명세에서 신청 입력 GET과 제출 POST를 확인했다. 대표자는 일반 직급을 선택하지 않으며 팀원은 기존 일반 직급 또는 새 이름 하나를 선택한다. 서버가 제출 자격과 직급을 검증한다. 명세와 source에서 생성 성공은 201이며 프론트는 대상 회사·요청 ID·`PENDING`을 확인한다. [중앙 정책](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/company/membership-and-positions.md#L30-L61) | 차단. 이번에는 실제 입력 문맥 GET과 신청 POST 모두 0건이다. 전용 신청자·회사·검토자, 중복/기존 소속/대기 초대/권한 기대값, 제출과 남는 신청 이력·검토 알림의 정리 승인이 필요하다. |

화면의 ‘통합 요청’은 [POL-11](../development/figma-v01/tasks/POL-11.md#pol-11-contract)의 문구 결정에 따라 유지한다. 회사 간 통합은 별도 흐름이다. 대표/팀원 화면과 완료 화면을 브라우저에서 다시 확인하지 않았으며 새 시각 예외 승인은 없다. 11월 2일의 조회 전용 승인과 인증·타 업무 이력은 날짜별 근거로 적용한다. [회사 QA](my-company.md#qa-05-20261125-company) · [QA-05 작업 기록](../development/figma-v01/tasks/QA-05.md)

<a id="qa-06-20261125-auth"></a>

## 2026-11-25 KST · 사업자번호 연결·등록 재개 점검

11월 2일 [AUTH-14/15의 실제 0통과·2차단](#qa-06-20261102)을 유지한다. 이번에는 `fb08dce`의 프론트 소스, 개발 OpenAPI와 백엔드·중앙 정책, 격리 복사본의 Node 계약 테스트를 대조했다. 테스트 합성 입력값은 승인된 개발 서버 자료로 사용하지 않았다. 환경·시각·배포·실행 대응은 [QA-06 근거](../development/figma-v01/tasks/QA-06.md#qa-06-20261125-evidence)에 기록했다.

| 기존 사례와 시안 상태 | 현행 소스·계약 관찰 | 실제 통합에서 남은 확인 |
| --- | --- | --- |
| AUTH-14 · 번호 입력 [기본 3141:52692](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3141-52692) · [입력 오류 3141:52809](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3141-52809) | 폼은 숫자 10자리를 검사하고 백엔드 정책은 형식·체크섬을 확인한다. 연결 POST 뒤 현재 연결 GET에서 진행 단계·완료·취소를 읽는다. 화면은 1초 간격 조회와 수동 상태 확인을 제공한다. 처음 GET의 404는 현재 연결 없음, 그 외 오류는 확인 실패로 처리한다. [번호 화면](../../src/app/auth/company/register/business-number/registration-client.tsx#L39) | 정상·조회 불가·처리 지연·부분 실패·재조회와 새로고침을 확인할 합성 번호·기대 상태/계정이 필요하다. 자동 조회, 수동 확인, 계정 전환과 결과 복원은 실환경에서 미실행이다. |
| AUTH-14 · 번호 교체·인증 회사 충돌·[조회 불가 3141:53001](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3141-53001) | 기존 연결이 있는 상태에서 다른 번호를 제출하면 현재 연결 DELETE가 먼저다. 인증 회사의 `COMPANY_ALREADY_VERIFIED`는 기존 회사 찾기 화면으로 연결한다. 보강 run의 `COMPLETED`와 단계별 `NO_DATA`·실패를 따로 확인해야 한다. 프론트는 완료 뒤 회사명 또는 기본 주소가 없거나 run이 취소되면 조회 불가로 표시한다. [교체·충돌](../../src/app/auth/company/register/business-number/registration-client.tsx#L103) · [보강 단계](https://github.com/mate-pjt/mate-backend/blob/74a770b9dc28446edd821befd213f754f27cc39d/mate-api/src/main/java/kr/co/mate/mate_api/domain/companyprofile/CompanyProfileEnrichmentStep.kt#L7-L25) | 인증·미인증 중복과 기존 활성 연결의 차이, DELETE CORS preflight, 새 POST 실패 후 재시도, 이전 연결·보강 이력의 잔존과 정리를 확인할 승인 범위가 필요하다. |
| AUTH-15 · [회사 정보 3141:52871](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3141-52871) · [실적 3141:52919](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3141-52919) | 시공능력의 평가연도가 `null`이면 화면은 ‘최근’으로 표시한다. 금액이 `null`이면 ‘정보 없음’, 금액이 있으면 억 원 단위다. 대표면허와 여성기업·장애인기업·사회적기업은 `YES`·`NO`·`UNKNOWN`을 구분하고 자료 기준일을 보존한다. [공통 패널](../../src/components/auth/company-registration.tsx#L50) · [DEV-59 로컬 근거](#dev-59-local-qa) | 금액 있음과 연도 없음, 금액 없음, 인증별 혼합 상태, 기본정보·자료 결측 및 부분 실패의 실제 표시 기대값과 자료가 필요하다. 번호 화면의 모바일·키보드 AUTH-17도 미실행이다. |
| AUTH-15 · 최종 등록의 [대표 3141:55269](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3141-55269) · [팀원 3141:55492](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3141-55492) | 대표/팀원을 선택하고 팀원의 직급과 여섯 금액대 중 하나를 입력한다. 개발 명세의 희망 공고 금액대 필드는 nullable이고 현행 화면은 선택을 요구한다. 프론트는 같은 화면에서 같은 본문을 재시도할 때 키를 유지한다. 응답의 회사·소속 ID 등 확인 뒤 세션 갱신에 실패하면 완료 화면을 유지하며 경고한다. 성공 여부가 미확정으로 분류된 오류에는 현재 회사 상태 확인 링크를 표시한다. [제출과 완료](../../src/app/auth/company/register/business-number/registration-client.tsx#L178) · [응답 확인](../../src/data/company/http-repository.ts#L253) | 미인증 회사·최초 관리자 소속·직급/권한·금액 저장, 중복·응답 유실·성공 뒤 세션 실패, 계정 전환과 정리는 합성 대상·기대값·안전한 오류 재현/해제 방법 확보 뒤 검증한다. |

프레임 연결은 [기존 프레임별 감사](../development/figma-v01/audits/2026-11-11.md#cf-05)와 [POL-21의 시안 대조 및 승인](../development/figma-v01/tasks/POL-21.md#pol-21-contract)을 근거로 했다. O08의 현행 실적 화면은 읽기 전용이다. O09의 선택 보정·미확인 표시 예외는 POL-21에서 승인됐고, 최종 등록과 보정의 공동 저장은 [DEV-44 선행](../development/figma-v01/tasks/DEV-44.md#dev-44-pol-21-contract-gate)이 남아 있다. 이번 점검의 새 시각 예외 승인과 브라우저 대조는 0건이다.

실제 로그인·AUTH 업무 GET/POST/DELETE·브라우저·데이터 변경은 0건이다. 새 데이터나 세션의 잔존·복구 대상은 발생하지 않았다. 재개에는 승인된 자료의 비식별 별칭과 시작 상태, 연결·등록별 변경/횟수·잔존 조건과 정리 책임, 실행 SHA 또는 이미지 digest와 프론트 공급원 정보가 필요하다. `DELETE current`는 활성 조회 연결 종료에 사용한다. 등록 후 회사·소속·권한 정리는 별도 확인한다. [재개 조건](../development/figma-v01/tasks/QA-06.md#qa-06-20261125-gate)

<a id="qa-07-20261125-auth"></a>

## 2026-11-25 KST · 가입 문서 업로드·OCR 재개 점검

11월 2일의 AUTH-09~13 **실제 0통과·5차단**과 문서 화면 AUTH-17 미실행을 유지한다. 이번에는 프론트 `bb532e1`, 백엔드 소유 소스와 중앙 정책, 게시 OpenAPI, 기존 Node 테스트를 대조했다. 아래 프레임은 기존 사례의 추적 근거다. 이번에 새 Figma 화면이나 브라우저 화면을 검수한 건수는 0이다. [기존 사례](#qa-07-20261102) · [소스·배포·게시 계약 근거](../development/figma-v01/tasks/QA-07.md#qa-07-20261125-evidence)

| 사례와 기존 시안 상태 | 현행 소스·계약에서 확인 | 실제 통합에 필요한 확인 |
| --- | --- | --- |
| AUTH-09 · [파일 첨부 전 3140:122667](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-122667) · [파일 첨부 오류 3140:122897](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-122897) | 클라이언트는 PDF/JPG/PNG와 1바이트 이상 10MiB 이하를 검사한다. Repository는 파일 metadata·SHA-256으로 업로드를 생성하고 화면에 내부 핸들과 문서·버전 ID를 반환한다. 직접 PUT은 서명 헤더를 사용하며 쿠키 등 credentials를 제외한다. 서버는 완료 요청에서 객체의 무결성을 확인한 뒤 OCR 작업을 접수한다. [파일 검사](../../src/app/auth/company/register/document/registration-client.tsx#L89) · [HTTP 처리](../../src/data/company/http-repository.ts#L144) · [완료 서비스](https://github.com/mate-pjt/mate-backend/blob/3fc3acbfe3a4e0f185c7bd7c5840dfc59a7bc7b4/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companydocument/CompleteCompanyDocumentUploadService.kt#L36-L92) | 합성 파일 유형·크기 경계, 서명 헤더와 Origin에 대한 preflight, 실제 storage PUT·완료 202, 만료·무결성 오류를 확인한다. |
| AUTH-10 · [대기 1 3140:123030](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-123030) · [대기 2 3140:123075](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-123075) | 업로드 완료 후 계정별 문서·버전 ID를 저장하고 처리 GET을 반복한다. OCR 실패와 공식 검증 실패는 별도 재시도 경로를 사용한다. 재시도 불가 시 새 버전을 제출한다. 백엔드 정책의 OCR, 국세청 공식 검증, 제안 확인은 각각 별도 단계다. [복원 및 조회](../../src/app/auth/company/register/document/registration-client.tsx#L64) · [수동 재시도](../../src/app/auth/company/register/document/registration-client.tsx#L205) · [처리 상태 정책](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/runtime/verification/company-registration.md#L73-L101) | 실제 worker와 발급일 경계, 정상·지연·실패·재시도·재업로드, 계정 교체와 새로고침, 지연 응답과 교체 후 기존 버전의 상태·정리를 확인한다. |
| AUTH-11 · [인증 없는 회사 정보 3140:123143](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-123143) · [실적 정보 3140:123224](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-123224) | 현재 제안의 검증된 회사명·주소와 사업자 정보를 표시한다. 주력업종이 없으면 업종 검색 결과에서 코드를 선택한다. 실적은 평가연도 결측을 ‘최근’, 금액 결측을 ‘정보 없음’으로 표시한다. 대표면허와 여성기업·장애인기업·사회적기업의 `YES`·`NO`·`UNKNOWN`과 자료 기준일을 구분한다. [회사 정보](../../src/app/auth/company/register/document/registration-client.tsx#L369) · [공통 실적 패널](../../src/components/auth/company-registration.tsx#L52) · [DEV-59 로컬 근거](#dev-59-local-qa) | 업종 누락과 선택값, 공식 기본정보와 공개 보강의 경계, 금액·연도·인증 결과 및 출처·자료일 조합을 실제 제안과 대조한다. |
| AUTH-12 · [이미 있는 회사 정보 3175:51961](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3175-51961) · [인증 없는 회사 정보 3140:123143](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-123143) | 이미 인증된 사업자번호는 회사 찾기로 이어진다. 미인증 충돌은 서버가 허용한 선택만 표시한다. 현재 미인증 회사의 번호 정정은 서버가 제안한 경우 명시 동의를 받는다. 현재 회사 인증과 새 회사 등록 뒤 합치기 제안은 정책에서 각각 별도의 처리다. [화면 분기](../../src/app/auth/company/register/document/registration-client.tsx#L362) · [제안 검증](https://github.com/mate-pjt/mate-backend/blob/3fc3acbfe3a4e0f185c7bd7c5840dfc59a7bc7b4/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companyregistration/GetCompanyRegistrationProposalService.kt#L62-L115) | 인증 회사, 기존 미인증 회사의 적격 구성원과 외부인, 정정 허용·거절 및 낡은 제안의 결과를 확인한다. 각 분기의 회사·소속·합치기 제안 잔존과 정리 범위를 먼저 확보한다. |
| AUTH-13 · [대표자 입력 3140:123383](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-123383) · [팀원 입력 3140:123469](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-123469) | 선택한 업종·대표 여부·팀원 직급과 희망 공고 금액대를 제출하며 전화는 선택이다. 서버 계약은 금액대를 nullable로 두고 현행 화면은 여섯 선택지 중 하나를 요구한다. 화면은 같은 제출 내용의 멱등 키를 유지한다. 서버는 같은 키와 본문의 기존 등록 결과를 반환하고, 같은 키의 다른 본문은 충돌로 처리한다. 신규 등록에서는 현재 제안·버전을 다시 검사한다. 확인된 등록 뒤 세션 갱신 실패에는 경고를 표시한다. [제출과 완료](../../src/app/auth/company/register/document/registration-client.tsx#L258) · [응답 확인과 갱신](../../src/data/company/http-repository.ts#L233) · [등록 transaction](https://github.com/mate-pjt/mate-backend/blob/3fc3acbfe3a4e0f185c7bd7c5840dfc59a7bc7b4/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companyregistration/CompanyRegistrationPersistenceAdapter.kt#L100-L174) | 실제 회사·소속/권한·인증 상태·금액 저장, 동일/상이한 payload의 멱등성, 동시 등록·응답 유실·성공 후 refresh 실패와 정리를 확인한다. |

**계약 테스트의 검증 경계.** Mock Repository에서 업로드 없이 완료할 때의 거절, 내부 상태 복원, OCR 실패·재시도·등록, 교체 뒤 이전 버전과 다른 계정 핸들 거절을 확인했다. HTTP fetch 대역은 checksum·멱등 키·PUT 호출 인자와 업로드 중 계정 경쟁을 검사한다. 등록 뒤 refresh 실패의 대역 테스트는 문서 등록 코드가 공유하는 후처리를 번호 등록으로 검증한다. 실제 문서 등록 응답이나 스토리지 CORS·브라우저 증거는 없다. [회사 계약 테스트](../../tests/company.test.ts#L36) · [화면 요청 범위 테스트](../../tests/company-flow.test.ts#L105)

O08의 현행 실적 화면에서는 조회 자료를 확인하며 직접 수정은 비활성이다. 11월 20일 사용자가 승인한 POL-21의 O09 선택 보정과 시안 예외는 해당 금액 공란·미확인 표현에 적용된다. 등록과 보정의 공동 저장은 DEV-44의 계약 선행이다. 문서 화면의 AUTH-17은 모바일·키보드·오류/중복 클릭까지 별도 확인이 필요하다. 실제 업무 호출과 새 잔존·복구 대상은 0건이다. [등록 선택 전 3140:122511](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-122511) · [기존 프레임 대조](../development/figma-v01/audits/2026-11-11.md#cf-05) · [POL-21](../development/figma-v01/tasks/POL-21.md#pol-21-contract) · [DEV-44 선행](../development/figma-v01/tasks/DEV-44.md#dev-44-pol-21-contract-gate) · [QA-07 재개 조건](../development/figma-v01/tasks/QA-07.md#qa-07-20261125-gate)

<a id="qa-08-20261125-auth"></a>

## 2026-11-25 KST · QA-08 초대 수신 재개 점검

AUTH-16 실제 **0통과·1차단**, 초대 화면 AUTH-17 미실행을 유지한다. 아래는 기존 사례의 하위 조건이다. 16:05~16:07 KST에 프론트 시작 SHA `20bfe337a407699e9f1c25ce3067a5dcfd2acf26`, 백엔드 dev 소스·테스트 배포·개발 게시 명세와 Node 계약 테스트를 대조했다. 실제 업무 호출, 브라우저·화면 크기 관찰, OAuth, 메일과 데이터 변경은 미실행이며 새 정리 대상은 없다. [실행 근거](../development/figma-v01/tasks/QA-08.md#qa-08-20261125-evidence)

| AUTH-16 조건 | 현행 소스와 게시 계약 | 실제 환경에서 남은 확인 |
| --- | --- | --- |
| 미리보기와 로그인·가입 복귀 | 초대 fragment를 주소에서 제거한 뒤 공개 미리보기를 요청한다. 백엔드는 유효 초대에 15분짜리 이어보기 문맥을 저장하고 HttpOnly·SameSite=Lax 쿠키를 응답한다. 미리보기가 실패하면 화면이 이전 이어보기를 시작하지 않는다. 기존 로그인과 신규 가입은 내부 복귀 경로로 돌아온 뒤 새로 이어보기를 요청한다. [프론트 상태](../../src/app/auth/company/invitations/invitation-client.tsx#L82) · [가입 복귀](../../src/app/auth/signup/signup-form.tsx#L94) · [쿠키 코드](https://github.com/mate-pjt/mate-backend/blob/3fc3acbfe3a4e0f185c7bd7c5840dfc59a7bc7b4/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companymembership/membershipinvitation/CompanyMembershipInvitationHandoffCookieWriter.kt#L16-L42) | 실제 이메일 링크 Origin, 주소 표시와 쿠키 속성, 기존 문맥이 있는 경우의 미리보기 실패, 기존 로그인 및 신규 가입 뒤 이어보기를 검증한다. |
| 계정 불일치와 교체 | 인증·이어보기 쿠키를 사용한다. 서버는 로그인 계정의 Google 확인 이메일을 비교한다. `403 CI006`에서는 초대 수락·거절 대신 다른 Google 계정으로 로그인하는 행동을 보여준다. [수락·교체 화면](../../src/app/auth/company/invitations/invitation-client.tsx#L98) · [게시 계약](https://api-test.mate-bid.com/v3/api-docs) | 불일치 계정에 행동이나 이전 계정 정보가 남지 않는지 확인한다. 계정 변경 뒤 현재 초대로 복귀해 일치 계정의 상태를 다시 확인한다. |
| 만료·재사용·낡은 버전 | 유효하지 않거나 처리된 링크는 `400 CI005`, 사라졌거나 소비된 이어보기 문맥은 `401 CI012`, 낡은 결정 버전은 `409 CI004`에 해당한다. 서버는 초대의 유효성·현재 배송 버전과 이어보기의 유효성을 각각 검사한다. [수신 서비스](https://github.com/mate-pjt/mate-backend/blob/3fc3acbfe3a4e0f185c7bd7c5840dfc59a7bc7b4/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/membershipinvitation/CompanyMembershipInvitationRecipientServices.kt#L177-L208) · [코드 정의](https://github.com/mate-pjt/mate-backend/blob/3fc3acbfe3a4e0f185c7bd7c5840dfc59a7bc7b4/mate-api/src/main/java/kr/co/mate/mate_api/global/exception/CompanyMembershipInvitationErrorCode.kt#L13-L21) | 링크와 이어보기 각각의 만료, 이전 배송 링크, 수락·거절 후 재사용과 reload, 버전 충돌에 대한 실제 응답·화면·소속 영향을 확인한다. |
| 수락과 갱신 실패 | 수락은 현재 `expectedVersion`을 보내고 401에서 요청을 자동 재전송하지 않는다. 서버는 활성 소속을 생성하고 다른 대기 신청·초대를 정리하며 이어보기 문맥을 소비한다. 정상 응답의 회사·소속 ID를 검증한다. 이후 세션 갱신 실패는 경고를 유지하고, 결과 미확정이면 회사 문맥을 읽어 재확인한다. [HTTP 구현](../../src/data/company/http-repository.ts#L91) · [수락 서비스](https://github.com/mate-pjt/mate-backend/blob/3fc3acbfe3a4e0f185c7bd7c5840dfc59a7bc7b4/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/membershipinvitation/CompanyMembershipInvitationRecipientServices.kt#L107-L164) | 별도 일회용 초대로 정상 수락, 기존 활성 소속·회사 잠금과 갱신 실패를 점검한다. 서버의 소속·권한과 다른 대기 항목의 변경, 사후 정리 결과를 대조한다. |
| 거절과 이동 | 거절은 현재 버전을 사용해 초대와 이어보기 문맥을 소비한다. Controller는 수락과 거절 성공에서 이어보기 쿠키를 비운다. 거절 완료의 CTA는 `/bids`, 처리 전 뒤로 가기는 `/auth/start`다. [현재 화면](../../src/app/auth/company/invitations/invitation-client.tsx#L175) · [거절 계약](https://github.com/mate-pjt/mate-backend/blob/3fc3acbfe3a4e0f185c7bd7c5840dfc59a7bc7b4/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companymembership/membershipinvitation/CompanyMembershipInvitationController.kt#L219-L244) | 거절 전용 초대의 종료 상태·쿠키 정리·소속 유지와 복귀 뒤 중복 처리가 없는지 확인한다. |

수신 프레임 `3141:56135`와 완료 프레임 `3141:56172`의 기존 근거를 참조했다. 완료 화면은 POL-15 D1에 따라 같은 회사·소속과 조회 권한이 확인되면 `/my/team`, 회사 정보 조회만 가능하면 `/my/company`를 제공한다. 확인에 실패하면 재조회와 `/bids`를 제공한다. D1은 상태별 목적지 정책이다. 원본 O10 프레임 묶음 `3141:56082`, `3141:56135`, `3141:56172`의 시각 정합성과 초대 화면 AUTH-17의 데스크톱·모바일·키보드 사례는 이번에 검증하지 않았다. [DEV-57 수신 프레임](../development/figma-v01/tasks/DEV-57.md) · [POL-15 완료 프레임과 결정](../development/figma-v01/tasks/POL-15.md#pol-15-contract) · [완료 화면](../../src/app/auth/company/invitations/invitation-completion-card.tsx)

Node 22.20.0의 5파일·84건은 합성 초대의 계정 전환·버전, 수락 응답과 성공 후 세션 갱신 실패의 HTTP fetch 대역, 완료 목적지·계정 격리와 구성 경계를 포함한다. 11월 20일 DEV-33의 로컬 브라우저 관찰은 날짜별 이력으로 참조한다. 실제 재개에는 승인된 자원, 링크 Origin, 실행 버전과 초대·소속의 사용 및 정리 범위가 필요하다. [초대 계약 테스트](../../tests/company-invitation-completion.test.ts) · [DEV-33의 로컬 인증 검증](#dev-33-auth-regression) · [QA-08 재개 조건](../development/figma-v01/tasks/QA-08.md#qa-08-20261125-gate)

<a id="pol-01-20261126-auth"></a>

## 2026-11-26 KST · 정식 약관 검증 선행 조건

- O03의 기존 AUTH-02·03에는 임시 약관 필수 동의, `code`·`version` 전송 및 두 임시 본문 링크의 검증 이력이 있다. 이번 정책 점검은 프런트 소스와 개발 Swagger에서 신규 가입의 동의 계약을 재확인했다. 실제 가입·브라우저·mock·HTTP 대역의 새 실행과 신규 실제 통과는 각각 0건이다. [QA-04 최종 증거](#qa-04-범위의-최종-증거-연결--2026-10-30-1402-kst) · [이번 소유 근거](../development/figma-v01/tasks/POL-01.md#pol-01-20261126-evidence)
- 이번 사용자 결정으로 기존 임시 동의 테스트 계정의 이관·재동의 절차가 DEV-01 범위에서 제외됐다. DEV-01은 신규 가입 화면·제출의 승인 버전과 문서 URL, 필수 동의 누락과 버전 불일치 처리를 검증한다. 실제 자원과 계정·동의 이력의 잔존/복구 승인, 프런트·백엔드 실행 식별자는 해당 개발/QA 시점에 확인한다. [POL-01 결정](../development/figma-v01/tasks/POL-01.md#pol-01-20261126-decisions) · [DEV-01](../development/figma-v01/tasks/DEV-01.md)

<a id="pol-01-approved-auth-qa"></a>

## 2026-11-26 KST · 정식 약관 정책 확정에 따른 AUTH-02·03 인계

사용자가 서비스 이용약관과 개인정보 처리방침의 원문을 승인했다. 화면에는 시행일·버전 항목을 추가하지 않으며, 문서 시행일 입력은 별도 관리 작업이다. 신규 가입은 두 필수 동의의 서버 `code`·`version`을 전송한다. 기존 테스트 계정의 이관·재동의는 범위에서 제외한다. [POL-01 결정](../development/figma-v01/tasks/POL-01.md#pol-01-approved-policy)

DEV-01에서는 비로그인 뷰어 링크, 승인 문서와 서버 반환 버전 대응, 두 필수 동의 누락·버전 불일치·정식 신규 가입을 점검한다. 두 원문의 공개 뷰어 권한과 실제 정식 적용 버전은 09:13 KST 기준 미확보다. 이번 정책 작업의 앱·가입·브라우저·mock·HTTP 대역 실행 및 신규 실제 통과는 각각 0건이다. 기존 AUTH-02·03 결과는 위 기록을 따른다. [DEV-01 인계](../development/figma-v01/tasks/DEV-01.md#dev-01-pol-01-approved-handoff)

<a id="dev-01-20261126-qa"></a>

## DEV-01 · 정식 약관 재개 점검 · 2026-11-26 KST

공개 연결을 위해 Drive 공유 메타데이터와 개발 백엔드 소스·배포 기록·게시 OpenAPI를 대조했다. 읽기 전용 공개 주소, 승인 원문에 대응하는 현재 적용 버전과 서버 실행 식별자는 미확보다. 실제 신규 가입 및 브라우저·mock·HTTP 대역 신규 실행은 0건, 신규 실제 통과는 0건이다. 임시 약관에서 얻은 기존 AUTH-02·03 결과를 보존한다. [DEV-01 소유 근거](../development/figma-v01/tasks/DEV-01.md#dev-01-20261126-readiness)

| 기존 사례 | 정식 문서 연결 후 확인할 동작 | 실행에 필요한 조건 |
| --- | --- | --- |
| AUTH-03 · O03 `3140:119739` 문서 열람 | 비로그인에서 두 승인 원문이 읽기 전용으로 열린다. 가입 화면에서 각 필수 동의의 본문으로 가며 임시 본문·임시 안내는 사라진다. | 현재 Drive 링크 공유가 `anyone/writer`다. 문서 관리 역할이 승인한 두 뷰어 주소를 확인한 뒤 공개 링크 시험을 한다. |
| AUTH-02 · 필수 동의 누락 | 한 항목이라도 미동의하면 가입 UI에서 제출할 수 없다. 승인된 실제 실패 검증에서 필수 쌍 누락은 서버가 거절하고 가입·동의 저장이 일어나지 않는다. | 정식 `code`·`version`의 원문 대응 및 합성 신규 가입과 안전한 실패 실행 범위가 필요하다. |
| AUTH-02 · 버전 불일치 | 읽은 뒤 제출 시점의 필수 버전이 달라지면 서버가 `409 SOCIAL_SIGNUP_AGREEMENT_MISMATCH`로 거절하고 성공 상태로 진행하지 않는다. | 개발 OpenAPI에 `409`가 명시됐다. 실제 실행에는 공유 약관을 변경하지 않는 승인된 오류 재현과 종료·복구 조건이 필요하다. |
| AUTH-02 · 두 정식 문서 동의 후 신규 가입 | 조회로 받은 두 `code`·`version`을 제출하고 `201`과 가입 직후 이동을 확인한다. 동의 시각과 쌍 보존은 승인된 범위의 증거로 확인한다. | 대응하는 두 공개 원문, 실제 환경의 프런트·백엔드 실행 식별자, 합성 신규 가입 승인과 계정·동의 이력의 잔존 또는 복구 담당·방법이 필요하다. |

브라우저 상황별 동작, HTTP 대역의 제출 쌍과 오류 처리, 실제 응답·가입 이력은 실행 시 각각 기록한다. 기존 테스트 계정의 이관·재동의와 운영 게시, 원문 시행일 입력은 이 재개 점검 범위에서 제외한다. [POL-01 승인](../development/figma-v01/tasks/POL-01.md#pol-01-approved-policy) · [검증·리뷰](../development/figma-v01/reviews/DEV-01.md)

<a id="dev-01-20261126-url-qa"></a>

## DEV-01 · 승인 URL 우선 연결 검증 · 2026-11-26 KST

사용자가 두 현행 주소의 공유가 `anyone/writer`인 상태에서 우선 연결하도록 승인했다. 위 표의 뷰어 주소 조건은 최초 점검 시점의 기록이다. 이번 연결의 읽기 전용 전환은 문서 관리 역할에 남긴다. [승인 범위](../development/figma-v01/tasks/DEV-01.md#dev-01-20261126-link-release)

| 사례 | 이번 확인 | 남은 확인 |
| --- | --- | --- |
| AUTH-03 · 두 약관 링크 | `pnpm start`의 기존 두 주소가 정확한 목적지로 `307`, 미지원 경로는 `404`. 비로그인 두 원문 HTTP `200`과 제목, Chrome 390px·1440px의 새 탭 이동 및 임시 안내 제거를 확인했다. | 현재 편집 가능 공유를 사용한다. 권한 변경 후 비로그인 읽기 전용 확인을 이어간다. |
| AUTH-02 · 두 동의와 버전 제출 | Chrome에서 부분 동의·필수 목록 누락 시 제출 없이 차단했다. 로컬 HTTP 대역에서 서로 다른 두 합성 서버 버전을 그대로 전송하고, `409` 안내와 기존 폼 유지, `201`과 `/auth/start` 이동을 확인했다. | 실제 배포와 승인 원문의 `code`·`version` 대응, 합성 신규 가입의 201·저장 증거와 승인된 오류·복구가 필요하다. |

로컬 브라우저 검사 16건 PASS와 합성 가입 POST 2건이다. 실제 Mate 가입 API/OAuth를 새로 실행한 수와 실제 신규 가입 통과 수는 각각 0건이다. QA 환경과 범위의 제공 의사를 받았으며 구체 자료를 기다린다. 기존 AUTH-02·03의 실제 임시 약관 결과를 보존한다. [검증 근거](../development/figma-v01/reviews/DEV-01.md) · [다음 첫 행동](../development/figma-v01/tasks/DEV-01.md#dev-01-20261126-resume)

<a id="dev-01-20261126-actual"></a>

## DEV-01 · 개발 환경 실제 신규 가입 재개 · 2026-11-26 KST

사용자가 승인한 합성 신규 가입은 한 번이며 테스트 계정과 동의 이력의 잔존을 허용했다. 개발 웹의 공개 프런트 번들은 `api-test`를 사용한다. 비로그인에서 두 약관 경로의 `307`·목적지와 미지원 경로의 `404`, 가입 조회·제출 OPTIONS의 `200`·Origin·credentials 허용을 확인했다. [실행 환경과 승인](../development/figma-v01/tasks/DEV-01.md#dev-01-20261126-live)

첫 Chrome 흐름은 로그인된 `/bids`로 돌아왔고 AUTH-02의 가입 조회·제출은 0건이었다. 사용자가 다른 미가입 합성 계정을 선택하기로 해 별도 격리 창에서 Google 인증 화면을 열었다. 계정 표시값과 OAuth 쿼리를 검사 증거에 포함하지 않았다.

| 사례 | 실제 개발 환경 증거 | 잔여 확인 |
| --- | --- | --- |
| AUTH-03 · 공개 약관 경로 | 개발 웹 비로그인 두 `307`의 목적지가 승인 URL과 일치한다. 미지원 경로는 `404`다. 현재 두 원문의 공유는 `anyone/writer`다. | 공유 역할 변경 뒤 비로그인 뷰어 상태를 확인한다. |
| AUTH-02 · 신규 가입 성공 경로 | 새 OAuth 요청 뒤 `/auth/signup`, 가입폼 GET `200`에서 `PRIVACY_POLICY v1`·`TERMS_OF_SERVICE v1` 확인. 부분 동의에서 가입 요청 0건, 전체 동의 뒤 같은 두 쌍의 POST 1회 `201`, `/auth/start` 이동. | 승인 원문별 두 `v1`의 대응과 실행 빌드, 동의 저장의 비식별 근거를 확인한다. |
| AUTH-02 · 실제 버전 불일치 | 게시 계약의 `409 SOCIAL_SIGNUP_AGREEMENT_MISMATCH`와 기존 HTTP 대역 결과를 보존한다. | 이번 실제 `409`는 미실행이며 공유 약관에 영향 없는 승인 재현이 필요하다. |

두 번째 OAuth의 `OAUTH_REQUEST_EXPIRED` 뒤 새 인증 한 번으로 가입폼에 도착했다. 사용자 승인 합성 가입은 1회로 마쳤다. 테스트 이력은 잔존하고, 로그아웃 `200`·이후 refresh `401`·비로그인 화면과 격리 창 종료를 확인했다. 앞선 임시 약관 실제 QA와 합성 HTTP 대역 결과를 보존한다. [DEV-01 실제 기록](../development/figma-v01/tasks/DEV-01.md#dev-01-20261126-live) · [다음 행동](../development/figma-v01/tasks/DEV-01.md#dev-01-20261126-live-resume)

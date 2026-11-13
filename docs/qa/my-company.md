# 나의 회사 정보 브라우저 통합 테스트

## 기준

- Figma: [미연결 3162:51271](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.0?node-id=3162-51271), [두 선택지 3162:51281](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.0?node-id=3162-51281), [신청 대기 3162:52364](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.0?node-id=3162-52364), [연결 회사 3134:64574](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/%EB%A9%94%EC%9D%B4%ED%8A%B8-v0.0?node-id=3134-64574)
- 경로: `/my` → `/my/company` → `/my/company/start`; 기존 `/auth/company/register`, `/auth/company/search`
- API: `POST /api/v1/auth/token/refresh`, `GET /api/v1/company-membership-requests/me`, `GET /api/v1/companies/{companyId}`
- 기존 구현 범위: 회사 기본 정보·소속 신청 조회. 2026-11-02 QA-05는 기존 QA-A/QA-B의 조회만 허용하며 회사 검색을 함께 확인한다. 신청 취소·제출/상태 생성, 회사 수정, 시공능력·인증·희망 금액 카드는 제외한다.
- 정적 검증: 2026-09-29, Node 22.20.0에서 `pnpm lint`, `pnpm build`, `git diff --check` 통과.
- 실제 API 통합 판정: **차단**. 2026-11-02 MCO 4통과·6차단. 승인된 연결·상태별 계정과 필수 사례 없이 전체 통합 PASS로 표시하지 않는다. [최신 실행](#qa-05-20261102)에서 과거 시뮬레이션과 구분한다.

## 실행 환경 기록

| 실행일시 | 프론트 URL·commit | 백엔드 URL·배포 | 브라우저·화면 크기 | 테스트 계정/데이터 별칭 | 수행자 |
| --- | --- | --- | --- | --- | --- |
| 2026-09-29 이력: 미실행 | 미정 | 미정 | 미정 | 비밀값 대신 별칭만 | 미정 |
| 2026-11-02 14:16~14:22 KST | `https://local.mate-bid.com:3000` · source `80c4282df7a65652829e5f7e58ba7c39e64ae063` / `qa/qa-05-company-live`（문서 변경만） | `https://api-test.mate-bid.com` · 현재 실행 버전 대응 근거 미확인（사용자 확인） | Chrome 156.0.8078.79 · desktop 1471×687 DOM client, mobile viewport 390×844/320×700 | 사용자 직접 로그인 QA-A. QA-B 미사용, 상태별 회사 자원 미준비 | Codex + 사용자 인증 인계 |

## 선행 조건·증거 구분

- 연결 계정과 `PENDING` 계정은 승인된 테스트 계정을 사용한다. 계정·회사·신청 데이터를 검증 목적으로 임의 생성하지 않는다.
- 브라우저에서 요청을 가로채 재현한 UI 결과는 **화면 시뮬레이션**으로만 기록한다. 테스트 서버의 응답·세션·권한이 확인되기 전에는 아래 실제 통합 항목을 통과로 바꾸지 않는다.
- 화면 캡처, 화면 폭, 비식별 Network 경로·HTTP 상태를 기록한다. 쿠키, Bearer token, 이메일, 사업자번호 등 개인정보는 기록하지 않는다.

## 로컬 화면 시뮬레이션 결과

- 2026-09-29, 로컬 개발 서버와 Playwright의 요청 가로채기를 사용해 27개 화면·상태 점검 통과. 실제 백엔드 응답이나 승인 계정으로 검증한 결과가 아니다.
- 비로그인 복귀 경로, `/my`의 회사 메뉴, 미연결 CTA, 선택 카드의 등록·찾기 이동과 키보드 Enter, `PENDING`의 직접 URL 보호, `REJECTED`·`CANCELED`, 승인 후 세션 반영 지연, 연결 기본 정보, 회사 조회 403, 네트워크 실패 후 재시도를 확인했다.
- 미연결·선택·대기·연결 화면을 캡처해 육안 확인했고, 390px·320px에서 네 상태의 가로 넘침이 없는지 확인했다. 이 결과는 아래 실제 통합 10개 항목의 통과 건수에 포함하지 않는다.

## 테스트 항목

### MCO-01 — 비로그인 복귀

- Figma node: `3162:51271`
- 경로/API: `/my/company`, `/my/company/start`; `POST /api/v1/auth/token/refresh`
- 준비 데이터/조작: 비로그인 세션에서 두 URL에 직접 진입하고 로그인 링크를 누른다.
- 기대 결과: 회사 API를 호출하지 않고 각각의 `next` 경로를 보존해 로그인으로 이동한다.
- 상태: `통과`（2026-11-02）; 증거: [QA-05 최신 실행](#qa-05-20261102)의 `MCO-01`. 과거 대기 이력은 아래 요약에 보존.

### MCO-02 — 미연결·신청 없음

- Figma node: `3162:51271`
- 경로/API: `/my/company`; refresh 200, `GET /api/v1/company-membership-requests/me` 404/`CR001`
- 준비 데이터/조작: 연결 회사·신청이 없는 승인 계정으로 진입한다.
- 기대 결과: Figma 빈 화면과 ‘우리 회사 등록 · 통합하기’가 표시된다. 다른 404나 오류를 빈 상태로 취급하지 않는다.
- 상태: `통과`（2026-11-02）; 증거: [QA-05 최신 실행](#qa-05-20261102)의 `MCO-02`. 과거 대기 이력은 아래 요약에 보존.

### MCO-03 — 두 선택지와 기존 경로

- Figma node: `3162:51281`
- 경로/API: `/my/company/start`; refresh 및 신청 조회, 각 카드 클릭 후 `/auth/company/register`, `/auth/company/search`
- 준비 데이터/조작: MCO-02 계정으로 CTA와 두 카드를 각각 누른다.
- 기대 결과: 두 카드가 정확히 기존 회사 등록·찾기 경로로 이동한다. 기존 온보딩 화면 내부의 뒤로 가기 동작은 유지된다.
- 상태: `통과`（2026-11-02）; 증거: [QA-05 최신 실행](#qa-05-20261102)의 `MCO-03`. 과거 대기 이력은 아래 요약에 보존.

### MCO-04 — 신청 대기와 직접 URL 진입

- Figma node: `3162:52364`
- 경로/API: `/my/company`, `/my/company/start`; refresh 200, 신청 조회 200 `PENDING`
- 준비 데이터/조작: 승인된 신청 대기 계정으로 두 URL에 직접 진입한다.
- 기대 결과: 양쪽 모두 읽기 전용 검토 중 화면을 표시한다. 선택 카드나 신청 취소는 제공하지 않는다. API에 없는 신청자 정보는 표시하지 않는다.
- 상태: `차단`; 사유: 승인된 `PENDING` 계정 미준비; 담당: 테스트 계정 준비 담당자; 증거: 미실행

### MCO-05 — 종료된 신청

- Figma node: `3162:52364`의 상태 변형
- 경로/API: `/my/company`, `/my/company/start`; 신청 조회 200 `REJECTED` 또는 `CANCELED`
- 준비 데이터/조작: 종료 상태별 승인 계정으로 진입하고 다시 선택 버튼을 누른다.
- 기대 결과: 거절·취소를 구분해 안내하고, 제공된 거절 사유만 표시한다. 두 선택지로 다시 이동할 수 있다.
- 상태: `차단`; 사유: 승인된 종료 상태 계정 미준비; 담당: 테스트 계정 준비 담당자; 증거: 미실행

### MCO-06 — 승인 후 세션 반영 지연

- Figma node: `3162:52364`의 상태 변형
- 경로/API: `/my/company`; 신청 조회 200 `APPROVED`, refresh 재호출
- 준비 데이터/조작: 승인 직후 세션 반영 전 계정으로 진입한다.
- 기대 결과: 세션을 재확인해 연결되면 회사 정보를 로드하고, 여전히 미연결이면 반영 대기와 재시도를 표시한다.
- 상태: `차단`; 사유: 승인 직후 상태 재현 계정 미준비; 담당: 테스트 계정 준비 담당자; 증거: 미실행

### MCO-07 — 연결 회사의 기본 정보

- Figma node: `3134:64574`
- 경로/API: `/my/company`; refresh 200 및 `GET /api/v1/companies/{companyId}` 200
- 준비 데이터/조작: 조회 권한을 가진 승인된 연결 계정으로 진입한다.
- 기대 결과: 회사명, 인증 상태, 대표자명, 사업자번호, 주력업종, 주소, 전화번호, 설립 연도만 읽기 전용으로 표시한다. null은 정보 없음, 설립 월은 추정하지 않는다.
- 상태: `차단`; 사유: 승인된 연결 계정 미준비; 담당: 테스트 계정 준비 담당자; 증거: 미실행

### MCO-08 — 권한 없음

- Figma node: `3134:64574`의 오류 변형
- 경로/API: `/my/company`; 회사 기본 정보 GET 403
- 준비 데이터/조작: 회사 정보 조회 권한이 없는 승인 계정으로 진입한다.
- 기대 결과: 회사 데이터 대신 권한 안내와 재시도를 표시한다.
- 상태: `차단`; 사유: 승인된 제한 권한 계정 미준비; 담당: 테스트 계정 준비 담당자; 증거: 미실행

### MCO-09 — 네트워크 실패·재시도

- Figma node: 네 화면의 오류 변형
- 경로/API: `/my/company`; refresh, 신청 GET, 회사 GET 중 해당 단계 요청 차단
- 준비 데이터/조작: 승인 계정에서 브라우저 요청 하나를 차단·복원하고 다시 시도한다.
- 기대 결과: 빈 상태나 이전 값을 성공처럼 보여주지 않고 오류 안내 후 재시도에서 최신 상태를 복원한다.
- 상태: `통과`（2026-11-02）; 증거: [QA-05 최신 실행](#qa-05-20261102)의 `MCO-09`. 과거 대기 이력은 아래 요약에 보존.

### MCO-10 — 모바일·키보드

- Figma node: `3162:51271`, `3162:51281`, `3162:52364`, `3134:64574`
- 경로/API: `/my/company`, `/my/company/start`; API는 각 상태와 동일
- 준비 데이터/조작: 390×844, 320×700에서 메뉴·카드·정보 배치를 확인하고 Tab·Enter로 이동한다.
- 기대 결과: 가로 넘침이 없고 읽기 순서·초점이 자연스러우며 카드와 재시도를 키보드로 조작할 수 있다.
- 상태: `차단`（2026-11-02）; 미연결/선택의 모바일·키보드만 확인. 신청 대기/연결의 승인 자원 미준비; 담당: 회사/계정 fixture 준비 역할（개인 배정 미확인）. [최신 실행](#qa-05-20261102) 참조.

## 실행 결과 요약

- 2026-09-29 실제 API 이력: 통과 0 / 실패 0 / 차단 5 / 대기 5
- 2026-11-02 실제 API 통합 항목: **통과 4 / 실패 0 / 차단 6 / 대기 0**
- 화면 시뮬레이션 결과: 27개 점검 통과 (요청 가로채기, 실제 API 통합 결과와 분리)
- 최종 판정: 상태별 승인 자원과 필수 검증이 준비될 때까지 **전체 통합 차단**. 신청 취소 상태 조회를 취소 명령/회사 간 통합 완료로 세지 않는다.

<a id="qa-05-20261102"></a>

## QA-05 조회 한정 실제 실행 · 2026-11-02

- 사용자 결정: 기존 QA-A/QA-B만 사용 가능·나머지 상태는 차단, 조회만 실행·신청 제출/상태 생성 차단, backend 실행 버전 자료 없음·미확인 유지. 사용자가 Chrome에서 QA-A 직접 로그인 완료를 확인했다. QA-04의 인증/로컬 HTTPS·브라우저 한정 오류 재현/정리 승인을 같은 범위로 재사용했다. 회사 변경 승인으로 확대하지 않았다.
- 환경: Node 22.20.0 / pnpm 11.3.0 / Next 16.2.9. 명시한 API/local 실행과 실제 test API 응답을 확인했다. backend 소스/Swagger/과거 배포 SHA를 현재 실행 버전으로 대체하지 않았다.
- 증거 루트（이 Mac 로컬, Git 미포함）: `/Users/jisung/.codex/visualizations/2026/11/02/01a19aad-a443-7753-aa21-507c86771e09/qa-05/`. 아래 파일에는 허용한 경로·method/status/code·시각·UI 결과만 보존한다. 원문 response headers/cookie/token·계정·번호·인증 query는 복사하지 않는다.

| 기존 case | 이번 판정 | 수행·현재 증거 | 미충족/한계 |
| --- | --- | --- | --- |
| MCO-01 | 통과 | 두 URL 직접 진입/새로고침 뒤 각각 refresh POST 401, 회사 API 0건, 로그인 안내. 링크 클릭이 각각 `/auth?mode=login&next=%2Fmy%2Fcompany`, `...next=%2Fmy%2Fcompany%2Fstart`로 이동. `mco-01-company-final.json`, `mco-01-start-final.json`, `mco-01-returns.json` 및 `*-return-final.png` | 현재 실행 버전 대응 근거는 별도 미확인 |
| MCO-02 | 통과 | QA-A refresh 200 → 신청 GET 404/`CR001` → 미연결 heading/CTA. `mco-02-qa-a-complete.json/.png` | 다른 404를 합성 주입한 실제 서버 검증은 하지 않음. 404/CR001만 빈 상태인 소스/계약 조건은 구분 |
| MCO-03 | 통과 | CTA Enter → 두 선택지. 뒤로가기 Tab→등록, 등록 Tab→검색, 각 Enter가 기존 `/auth/company/register`, `/auth/company/search`로 이동. `mco-03-qa-a-start.json/.png`, `mco-03-no-request-code.json`, `mco-03-register-destination.json/.png`, `mco-03-search-destination.png`, `mco-10-layout.json` | 등록/검색 화면 도착까지만. 등록·소속 신청 제출/내부 정책 변경 없음 |
| MCO-04 | 차단 | `PENDING` 자원 없음 | 승인된 대기 계정/회사와 두 직접 URL 재현 필요 |
| MCO-05 | 차단 | `REJECTED`/`CANCELED` 자원 없음 | 종료 상태별 계정·거절 사유/다시 선택 확인 필요. 취소 명령 실행은 제외 |
| MCO-06 | 차단 | `APPROVED`지만 미연결인 실제 자원/재현 조건 없음 | 승인 직후 refresh 반영·미반영 및 재시도 조건 필요. 상태를 임의 생성하지 않음 |
| MCO-07 | 차단 | 승인된 연결 계정/회사 기대값 없음 | 기본 프로필 8개 표시·null·설립 연도 대조 필요. 실적/인증 확장 개발 아님 |
| MCO-08 | 차단 | 실제 제한 권한 계정 없음 | 실제 회사 GET 403과 권한 안내/재시도 필요. 브라우저 오류를 서버 403으로 세지 않음 |
| MCO-09 | 통과 | QA-A의 신청 GET 하나만 브라우저 `Network.setBlockedURLs`로 차단 → refresh 200 후 연결 실패 안내/재시도 → finally 해제 → 재시도 Enter → refresh 200/신청 404·빈 상태 복구. `mco-09-membership-error.json/.png`, `mco-09-recovered.json/.png` | 원래 사례의 “요청 하나”를 신청 GET으로 실행. 연결 회사 GET/실제 backend HTTP 오류는 미실행이며 MCO-07/08 차단과 분리 |
| MCO-10 | 차단（부분 확인） | 미연결/선택의 390×844/320×700 viewport·Tab/Enter·재시도. client/scroll 폭 각각 375/375, 305/305로 가로 넘침 없음. 모바일 세로 스크롤/카드 배치 캡처 육안 확인. `mco-10-layout.json`, `mco-10-{empty,start}-{390,320}.png` 및 `mco-10-empty-390-full.png` | pending/connected 두 상태의 모바일·키보드 미확보. 전체 4상태 통과 아님 |

### 회사 검색/신청 연결

- [AUTH-07~08의 QA-05 기록](auth.md#qa-05-20261102)에 검색의 실제 GET 200·빈 결과·등록 링크·브라우저 한정 실패/복구를 연결했다. 결과 있는 승인 합성 회사·번호/페이지 기대값이 없어 AUTH-07 전체는 차단이다. AUTH-08의 대표/팀원 입력·성공/PENDING·중복/기존 소속/권한 분기는 전용 회사/계정·변경/복구 범위가 없고 제출도 승인 밖이므로 차단이다.
- 실제 backend 오류나 상태를 만들기 위해 DB/fixture/회사·신청 API를 변경하지 않았다. UI/응답의 이름·이메일·사업자번호·주소 같은 개인정보를 관찰/캡처하지 않았다. GET 응답 본문은 개인정보가 없는 404의 공개 code만 추출했고 refresh 본문/인증 headers를 열람하지 않았다.

### 관측 한계와 수행 사건

- 최초 로그인 귀환/직접 이동의 Network buffer가 truncated여서 완전 증거로 세지 않았다. 현재 문서에서 Network를 활성화한 뒤 동작별 온전한 이벤트로 재수집했다. 초기 미수집 JSON은 한계를 남긴 기록이며 성공 증거를 대체하지 않는다. 재시도 locator 문구 불일치는 실제 UI에서 정정했으며 소스 변경/제품 오류로 판정하지 않았다.
- **서버 종료 도구 출력에 callback의 인증 거래 식별자가 포함되는 수행 사건이 발생했다.** 사용자에게 바로 알렸으며 값 원문을 이 문서·QA 증거에 재출력/복사하지 않는다. token/cookie 유출이나 전체 인증 값 무효화를 확인한 것으로 주장하지 않는다. 앞선 브라우저 관측에서 query를 읽지 않았다는 사실과 이 후속 출력 사건을 구분한다. [재발 방지 기록](../ai-context/ai-failures.md#qa-05-auth-log-output)을 추가했다. 과거 QA-04의 별도 사건/교정도 그대로 보존한다.

### 정리·남은 첫 행동

- QA-A logout POST 200 → 두 직접 경로 refresh 401/비로그인 UI 확인. 브라우저 차단 URL `[]`, Network 비활성, viewport reset, 소유 Chrome 탭 종료. 인증 cookies/header 원문은 수집하지 않았다. 신규 계정·회사/신청 mutation 없음. `logout.json`, `browser-cleanup.json` 참조.
- 소유 Next 세션 14432/group 17789는 종료 코드 0, 관련 3 PID 잔여 없음, 3000/3001 비청취. 다른 프로세스·서비스/설정·배포는 조작하지 않았다. `process-cleanup.json` 참조.
- 상태별 자원 담당 역할: 회사/계정 fixture 담당, 회사 API 담당, backend 실행 버전 담당, 개발자 승인자. 개인 배정은 미확인이다. 재개에는 별칭/상태·승인된 합성 회사 기대값/검색 페이지·필요한 신청 변경/복구 책임과 방법·실행 버전 대응 근거가 필요하다.
- **다음 Task는 QA-05 재개**다. P0·PREP-01/QA-04 선행은 main에 반영됐지만 본 작업의 필수 검증이 남고 다음 기능 진행 예외는 승인되지 않았다. 다음 첫 행동은 main/Git 확인 후 이 결과와 PREP 준비표에서 남은 자원/승인/실행 버전 공백이 해소됐는지 확인하는 것이다. QA-06은 자동 시작하지 않는다.

### 2026-11-02 14:38 KST · 다음 작업 선정의 후속 승인

사용자는 “QA-05의 남은 항목은 차단으로 유지하고 QA-06을 다음 작업으로 선정하는 예외”를 승인하고 QA-06은 새 대화에서 시작한다고 명시했다. 따라서 위 실행 종료 시점의 ‘다음 QA-05 재개/진행 예외 없음’은 과거 이력으로 보존하고, 현재 다음 작업은 [WBS](../development/figma-v01/README.md)의 **QA-06**을 따른다. [승인/인계 기록](../development/figma-v01/tasks/QA-05.md#qa-05-next-qa-06-exception) 참조. MCO 4통과·6차단/AUTH-07·08 차단, 미확보 자원/실행 버전·수행 사건 한계는 불변이다. 이번 후속의 실제 API/QA-06 실행은 없으며 QA-06의 자원·변경/복구 범위는 다음 요구사항 Gate에서 확인한다.


<a id="pol-06-company-dashboard-qa"></a>

## POL-06 소스 정책 / DEV-08 가입 후 대시보드 QA 계획 · 2026-11-09

- 근거: [POL-06 사용자3결정·고정 소유 소스](../development/figma-v01/tasks/POL-06.md#pol-06-sources), [조회 정책 v1](../development/figma-v01/tasks/POL-06.md#pol-06-contract), [DEV-08 인계/재개 조건](../development/figma-v01/tasks/DEV-08.md#dev-08-pol-06-handoff). 원본 M04/연결 화면 Figma `3134:64574`, `3134:66829`는 과거 기준선이며 이번에 새 화면을 검증하지 않았다.
- 실행 범위: 정책·QA 계획 문서화만. 사용자 배포/schema·실행 대응·합성 자원/사용·잔존·복구 미준비 확인에 따라 DEV-08은 구현 미착수·실제 통합 차단이며 로컬 구현 선행 예외 없음. 신규 CDASH는 **실제0통과·12차단·실행0건**이다. 로컬 mock/HTTP 대역/브라우저도 미실행이다.
- 기존 MCO4통과·6차단 및 AUTH-07·08/QA-06·07의 당시 판정·차단/승인 예외는 위 이력대로 보존한다. 새 source GET의 존재를 배포 준비·기존 사례 PASS로 대체하지 않는다.
- 후속 API 후보(모두 소스 관찰): 현재 회사 기본 GET, `construction-capability-assessments`, `public-certifications`, `public-procurement-performances`, `bid-notice-preferences`, `memberships/me`·권한 catalog GET. 인증 refresh POST를 포함한 실제 사용도 후속 Gate에서 범위를 확인한다. 외부 재수집/등록/수정 mutation은 별도 승인 필요다.

| 사례 | 준비 데이터/단계 | 기대 결과 | 이번 판정/차단 |
| --- | --- | --- | --- |
| CDASH-01 | 승인된 등록/저장 기대값·현재 연결 회사/기본8개 값·직접 진입/새로고침. 등록→조회 검증에 mutation이 필요하면 별도 범위/복구 확보 | 현재 회사 저장값을 재조회. 가입 임시 선택/단일 capability를 현재 확정값으로 복사하지 않음. 기본 overview/미연결·신청 상태 회귀 분리 | 차단 — 구현/배포·합성 자원·실행 대응 미준비 |
| CDASH-02 | 복수 업종/세부 공종·대표 SELECTED/NONE/UNDETERMINED·빈 평가/미매칭 관측 | 개별 금액/대표 서버 결과 보존. 합산·최대 금액/첫 행을 대표로 선택·가짜 평가액 생성 없음 | 차단 — 구현/해당 fixture 미준비 |
| CDASH-03 | 평가연도/기준일 null·0원·대표면허 true/false/null·자동/승인외부/수기 source·관리자 확정시각 | 0과 자료 없음 구분. 연도/기준일 추정·‘최근’ 제목 금지. 외부 기준일/관리자 시각/수기 근거를 구분 | 차단 — 구현/경계 fixture 미준비 |
| CDASH-04 | 여성/장애인/사회적기업 YES/NO/UNKNOWN, row 부재(version0/source null)·관측 UNKNOWN·회사 VERIFIED/UNVERIFIED | 인증3종의 해당/비해당/확인 불가 및 provenance 구분. 회사 문서 인증 배지·증명서 유효기간과 혼동 없음 | 차단 — 구현/인증 fixture 미준비 |
| CDASH-05 | 서버 기본6연도·연도 경계·CURRENT_YTD/COMPLETED_YEAR·누락 연도/전체 빈값·성공0·관측 시각/출처 | 반환 fromYear/toYear/실제 period·원값 표시. 실시간/완료연도로 오인하거나 누락을 0/NO_DATA/실패로 추정하지 않음. GET이 외부 수집을 시작하지 않음 | 차단 — 구현/실적 fixture·서울 연도 경계 재현 미준비 |
| CDASH-06 | 전체 희망 enum과 정확한 경계·null·ANY, 회사 선호와 다른 개인 필터 | 회사 저장 선호·추정가격 구간(최소 포함/최대 미포함) 표시. null 미설정/ANY 제한 없음 구분·개인 필터 변경/가져오기 없음 | 차단 — 구현/전체 leaf 합성 fixture 미준비 |
| CDASH-07 | 정보조회 leaf만 보유/전체 leaf/회사 합치기 read-only·동일 role이나 다른 leaf 집합 | 실제 권한으로 일반 조회·희망금액 제한을 구분. 희망금액 권한/잠금 안내가 나머지 section을 막지 않음. UI role 기반 우회/자료 노출 없음 | 차단 — 구현/권한별 합성 자원/실제 403·잠금 재현 미준비 |
| CDASH-08 | 최종401·타 회사/소속 해제·403·기본/section404 및 기존 신청404/CR001 구분 | 최종 인증/소속 종료 자료 제거. 기본 상태와 section 오류를 구분하며 권한/오류를 미설정/빈 성공으로 바꾸지 않음. 기존 신청없음 조건 보존 | 차단 — 구현/안전한 실제 오류·해제 미준비 |
| CDASH-09 | 한 section 지연/연결·서버 실패와 재시도, 나머지 정상 | 독립 loading/error/명시 재시도. 동일 회사의 정상 결과 보존·실패를 0/NO/UNKNOWN 성공으로 만들지 않음. 자동 mock fallback 없음 | 차단 — 구현/오류 재현·복구 범위 미준비 |
| CDASH-10 | 요청 중 계정/회사 교체·로그아웃·소속 해제·하드 리로드, API/mock/hybrid·탭 저장소 | 이전 응답 폐기·자료/오류/재시도를 새 계정에 재사용하지 않음. source snapshot·guard·계정 격리/업로드 경계 유지 | 차단 — 구현/합성 계정 경쟁·변경/복구 범위 미준비 |
| CDASH-11 | 0·경계값·JS 안전 정수 초과의 원화금액/건수, 기본 wire/잘못된 DTO | 원 단위/건수 정밀도 보존, 억 단위 반올림을 원값으로 쓰지 않음. 미지원/비정상 응답을 무검증 number·절삭·0으로 바꾸지 않음 | 차단 — 구현/실제 wire·대형 정수 fixture 미준비 |
| CDASH-12 | 연결/미연결/권한·부분 오류 상태, desktop/390px/320px·Tab/Enter/재시도 | 기존 기본정보/가입 동선 회귀 보존·가로 넘침 없음·읽기 순서/초점/상태 안내/재시도 조작 확인 | 차단 — 구현/승인 상태별 자원 미준비 |

실제 재개에는 [POL-06 필수6조건](../development/figma-v01/tasks/POL-06.md#pol-06-handoff)의 배포/실행 대응·합성 회사/권한/경계 기대값·사용/잔존/종료/복구·안전한 오류/해제와 DEV-08 자체 Brief가 필요하다. 담당은 API/배포·fixture·프론트 QA·승인자 역할이며 개인 배정은 미확인이다. 실행 후 이 표에 시각/실행 ID·비식별 Network/화면·정리 증거를 추가하고, mock/HTTP 대역/실제 결과를 각각 기록한다. 이번에 API/로그인/회사·권한 변경·운영/배포는 실행하지 않았다.

<a id="dev-60-local-qa"></a>

## DEV-60 기본정보 복수 주력업종 로컬 검증 · 2026-11-12

- 소유: [DEV-60 Brief/소유 근거](../development/figma-v01/tasks/DEV-60.md#dev-60-brief)·[검증](../development/figma-v01/tasks/DEV-60.md#dev-60-verification). 시작 source main `ccb14b8` + 해당 Task diff, 환경파일 없는 격리 Next16.2.9/Node22.20.0·Aside/Chrome, app loopback4360/HTTP double4369,1440×900·390×844·320×900. Figma 기본정보 `3134:64574`/주력업종 `3134:64609`; 기존 Task의 팀원 section 연결 오류는 Task에 근거를 보존해 정정했다.
- 로컬 구현/자동·mock·HTTP 대역만 검증했다. 아래 결과는 MCO/CDASH 실제 API 통합 통과 건수에 합산하지 않는다. QA-05 MCO4통과6차단·DEV-08 CDASH12차단과 기존 AUTH/가입 QA·Task별 승인 예외/재개 조건은 그대로다. 실제 업무 API/로그인·회사/권한 변경·메일·업로드0건. 개발 Swagger GET200은 배포 문서 조회이며 실행 process SHA·실응답 증명이 아니다.

| 사례 | 기대/실행 | 로컬 판정 |
| --- | --- | --- |
| BASIC-01 | 신형 목록0/1/복수·서버 순서·정확 중복, legacy가 달라도 목록 우선(빈 배열 포함) | 자동/실제 Next HTTP 대역 PASS |
| BASIC-02 | 목록이 없는 legacy 단일값/null만 목록/빈 목록으로 호환, 둘 다 결측은 오류 | 자동/실제 Next HTTP 대역 PASS |
| BASIC-03 | 목록 null/비배열/결측 행·코드/이름 오류·같은 코드 이름충돌은 오류/재시도, 빈 성공·임의값 없음 | 자동/실제 Next HTTP 대역 PASS |
| BASIC-04 | 긴 업종+두 번째 이름이320/390px에서 전체 보존·줄바꿈·가로넘침 없음 | 전체 dl/dd DOM과 실제 viewport 육안 PASS. 전체 snapshot 문자열 요약으로 발생한 최초 오판은 도구 관측으로 별도 보존 |
| BASIC-05 | 403권한·409/500오류·키보드 Enter 재시도→정상 복구, 초기 auth401에서 이전 목록 없음 | 자동/실제 Next HTTP 대역 PASS. 실제 서버 오류/세션 해제 미실행 |
| BASIC-06 | 미연결/신청 대기·다른 합성 계정/새로고침에서 해당 상태/목록 표시 | 실제 Next HTTP 대역 PASS. 계정별 mock 저장 보존은 자동 계약으로 별도 확인 |
| BASIC-07 | connected mock 두 업종·새로고침·구형 단일값 변환·문서/멱등 replay·다른 영역/계정 보존 | 자동/실제 Next mock PASS. 전체 mock ResourceTiming 외부 요청0건 |
| BASIC-08 | hybrid(auth HTTP 대역/company mock)에서 회사 HTTP 요청0·전체 목록, production mock build/start 거부 | 실제 Next/ResourceTiming·HTTP double log/guard exit1 PASS |

- 명령:15files/315tests·lint·API/mock/hybrid build·Storybook build·diff-check PASS. 기존 테스트의 불완전 기본정보 fixture를 실제 필드로 보완했다. 최초 새 테스트4실패는 it.each 배열 자료 펼침 오류로 교정 후 전수 통과했고 runtime을 임의 변경하지 않았다.
- 브라우저 HTTP 대역20개 최종 검사 통과와 최초 도구 요약 오판1건을 `browser-results.json`에 보존한다. hybrid/mock 최종 요청 검사는 별도 결과다. Aside의 page.route 미지원으로 루프백 HTTP double을 사용했고 DOM과 실제 viewport 캡처를 확인했다. page.on 수집0건을 외부 요청0의 근거로 쓰지 않았다.
- 증거: 로컬 `/Users/jisung/.codex/visualizations/2026/11/12/mate-dev60/`의 test/lint·build3/Storybook·guard 로그, browser/mock/hybrid 결과·비식별 HTTP 경로/status, `final-desktop.png`·`long-320-viewport.png`. 로컬 증거는 Git 외부이며 토큰/쿠키/환경값을 저장하지 않는다.
- 실제 재개: QA-05의 승인된 다중 업종 회사/계정·현재 실행 대응·정확한 기대 목록/안전한 권한·오류/사용·잔존/종료·복구 자원을 해당 Gate에서 확인한다. DEV-08의 대시보드/leaf6조건은 그대로다. source/문서/로컬 브라우저 PASS를 실제 통합 PASS로 승격하지 않는다.
- PR에서 확인할 합성 화면: [데스크톱 복수 업종](assets/dev60/desktop.png), [320px 긴 이름 전체 표시](assets/dev60/long-320.png). 위 로컬 원본 캡처 중 이 두 장만 QA 증거로 Git에 포함한다. Figma 전체 화면 정합성/실서버 자료를 뜻하지 않는다.

<a id="pol-10-cancellation-qa"></a>

## 2026-11-13 · POL-10 취소 정책의 DEV-15 후속 QA

- 근거/소유: [POL-10 사용자 확정/정책 v1](../development/figma-v01/tasks/POL-10.md#pol-10-contract)·[DEV-15 자체 Gate/완료 기준](../development/figma-v01/tasks/DEV-15.md#dev-15-pol-10-handoff)·[고정 source/개발 schema](../development/figma-v01/reviews/POL-10-sources.json). 이번은 **후속 검증 기준 작성**이며 제품/자동·브라우저·실제 API 취소 검증을 시작한 기록이 아니다.
- 기대 상태: 본인 PENDING→명시 확인/DELETE→CANCELED(version 증가/이력 보존)→빈 `/my/company`·기존 Sonner 성공 Toast1회. Figma [대기3162:52364](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3162-52364)/버튼3162:52414·[완료3162:52416](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3162-52416)/toast3162:52419를 연결한다. 정확한 성공 문구는 **‘성공적으로 통합 요청을 취소했어요!’**다. metadata/문구만 확인했고 전체 pixel/반응형 검증은 미실행이다.
- 기존 MCO4통과6차단·CDASH/가입 AUTH·로컬 BASIC/과거27화면 결과·승인 예외를 그대로 보존한다. MCO-04의 신청 취소 미제공 기대는 당시 조회 전용 범위의 이력이며, DEV-15 반영 후 영향 사례를 재검증해야 한다. 이 절의12개 후속 사례는 기존 통과/차단 건수에 합산하거나 실제 PASS로 올리지 않는다.

| 사례 | 후속 기대/검증 | 이번 결과 |
| --- | --- | --- |
| MCANCEL-01 | 본인 일반/대표자 PENDING에만 취소. 확인 창 닫기/Escape/돌아가기·첫 진입/GET에는 DELETE0·성공 Toast0 | 미실행 — DEV-15 자체 Gate 전 |
| MCANCEL-02 | 타인/없는 requestId는404 CR001, 관리자/review leaf도 타인 취소 불가. 비로그인/최종401·403을 빈 성공으로 바꾸지 않음. 안전한 승인 합성 권한 자원으로 검증 | 미실행 — 제품/합성 자원·업무 변경 범위 미확인 |
| MCANCEL-03 | 같은 requestId/version snapshot→body 없는 DELETE·필수 양수 expectedVersion→같은 신청 CANCELED/증가 version·시각/이력 잔존. 활성 소속 생성/삭제0 | 미실행 — 자동/HTTP 대역/실제 결과 구분 필요 |
| MCANCEL-04 | 당해 성공 후 빈 `/my/company`·기존 showToast로 정확 문구1회, 단일 ToastViewport/기존 표시 규칙.320/390px·키보드/초점·상태 안내, CTA→`/my/company/start`의 등록/찾기. reload/직접 URL/뒤로가기에는 성공 Toast0·CANCELED 미연결은 빈 화면 | 미실행 — Figma/실제 Next·브라우저 필요 |
| MCANCEL-05 | 연속 클릭/Enter·늦은 중복 응답에서 mutation 중복/성공 Toast 중복0, 진행 상태/버튼 방어. 전송 후 닫기/이동을 서버 변경 취소로 가정하지 않음 | 미실행 — 중복/화면 수명 검증 필요 |
| MCANCEL-06 | 승인·취소 경쟁에서 하나의 결과. 승인 우선→409/최신 연결 회사, 세션 반영 지연→approved-stale/명시 재조회. 취소 우선→CANCELED. 자동 DELETE 재시도/이미 생성된 소속 삭제/취소 성공 Toast0 | 미실행 — 안전한 경쟁/복구 자원 필요 |
| MCANCEL-07 | 같은 요청 replay의 CR004/CR003→최신 GET, CANCELED/REJECTED/APPROVED 분기. 새 PENDING/새 requestId/연결 회사면 최신 상태 우선·새 신청 자동 취소0. 성공 Toast0 | 미실행 — version/상태별 자원 필요 |
| MCANCEL-08 | version 누락/0/잘못된 타입·다른 requestId/잘못된 성공 상태·빈/잘못된 wrapper 응답은 성공/Toast로 처리하지 않음. 게시 schema success와 실제 wire isSuccess 여부를 직접 확인한 뒤 기존 HTTP 경계 적용 | 미실행 — 실제 wire/실행 대응 미확인 |
| MCANCEL-09 | 404/403/5xx·연결 실패/응답 유실/시간 초과→오류 또는 결과 미확정→명시 상태 확인. 자동 mutation 재시도0·거짓 성공 Toast0. 조회도 실패하면 미확정 상태/재시도 유지·해제 후 복구 | 미실행 — 안전한 오류/해제 범위 필요 |
| MCANCEL-10 | 동일 계정401 refresh1회 경계, 최종401의 복귀/보호 자료 제거. 취소 성공 뒤 refresh만 실패하면 완료+sessionWarning, 재취소0. 이미 세션 해제된 화면에 보호 자료/늦은 Toast 없음 | 미실행 — 세션/오류별 자원 필요 |
| MCANCEL-11 | 요청 중 계정 교체/로그아웃/화면 종료에서 이전 상태/오류/Toast 폐기. mock 취소 version/이력의 reload·탭/프로필/계정 격리·기존 신청/초대/문서/멱등 replay 보존 | 미실행 — 자동/HTTP 대역/mock 증거 별도 필요 |
| MCANCEL-12 | API/mock/hybrid의 고정 source/production guard·업로드 경계 보존, mock 영역 외부 업무 요청0. 실QA 시작/종료 snapshot·신청/취소/재신청/이력 잔존/복구·승인된 담당/방법과 실행 SHA 대응 기록 | 미실행 — DEV-15 자원/변경 승인 필수 |

실제 QA는 현재 frontend/backend 실행 대응과 disposable 계정/상태별 신청, version/회사 기대값, 동시 승인 주체·안전한 오류/해제·사용/변경/잔존/종료·복구 담당/방법을 확보한 뒤 수행한다. source/게시 schema/CI test deploy 성공을 실행 process SHA/업무 응답으로 대신하지 않는다. 과거 QA-05 QA-A/QA-B 조회 승인은 취소/재신청·상태 생성 허가가 아니다. 이번 업무 API 실행0·신규 실제 통과0이고 로컬 선행/실제 QA 생략 예외도 없다. 상태는 WBS와 실제 실행 시의 사례 증거에서 관리한다.

<a id="dev-15-local-qa"></a>

## 2026-11-13 · DEV-15 취소 실행 로컬 QA

- 사용자 승인: [DEV-15 Brief](../development/figma-v01/tasks/DEV-15.md#dev-15-brief)의 ‘로컬 선행·실서버 QA 차단 보존’. 아래는 Node 계약·full mock·실제 Next/API 프로필의 **로컬 합성 HTTP 대역**이다. 실제 취소/업무 API 실행0, MCANCEL-01~12 실제0통과·12차단. 위 POL-10 당시 미실행·기존 MCO4통과6차단/CDASH/가입 AUTH와 다른 Task의 차단/승인 예외는 보존한다.
- 환경: Node22.20.0·pnpm11.3.0·Next16.2.9. Aside Browser desktop1440×1000·390×844·320×780. mock은 `company=pending`, HTTP 대역은 API snapshot을 로컬 합성 서버로 고정해 사용했다. mock의 외부 HTTP0, HTTP 대역의 예상 밖 외부 origin0/pageerror0. 실제 `.env` 값/계정·비밀값/개인 자료는 읽거나 저장하지 않았다.
- 증거: [HTTP 브라우저18개 관찰](artifacts/dev-15/http-browser.json)·[대역 요청의 method/path/query/body 길이](artifacts/dev-15/http-events.json), [desktop 완료](artifacts/dev-15/success-desktop.png)·[390px 완료 Toast](artifacts/dev-15/success-390.png)·[320px 확인창](artifacts/dev-15/confirm-320.png). 이미지/응답은 합성 자료만 포함한다. Figma3162:52414/52419의 고정 버튼/Toast context·screenshot을 대조했으며 기존 전 화면/모든 frame의 픽셀 전수 PASS는 주장하지 않는다.

| Case | 자동 계약·mock/HTTP 대역·실제 Next 브라우저의 이번 결과 | 실제 API |
| --- | --- | --- |
| MCANCEL-01 | PASS — 본인 PENDING에만 버튼·native 확인창, 닫기/돌아가기/Escape·초점 복귀·조회/닫기 mutation0. 일반/대표자 mock 모두 취소 | 차단 |
| MCANCEL-02 | 로컬 PASS — 다른 계정/없는 대상 mock404, HTTP403/최종401·로그인 복귀. 실제 관리자 leaf/타인 권한은 서버에서 별도 검증 필요 | 차단 |
| MCANCEL-03 | PASS — 조회 version3 보존→body 없는 DELETE expectedVersion3→같은8001 CANCELED/version4·시각. mock 취소2/이력 잔존·재신청 새 ID. 활성 소속 생성/삭제0 | 차단 |
| MCANCEL-04 | PASS — 빈 `/my/company`·정확한 Sonner1개/32px 기존 아이콘·단일 viewport.320px dialog288px·가로 넘침0,390px/desktop·키보드 Enter/초점. CTA→start→찾기/대표자 재신청→직접 start 취소 후 overview. reload Toast0 | 차단 |
| MCANCEL-05 | PASS — 지연 응답 중 버튼/진행 표시·연속 Enter에도 DELETE1, 완료 Toast1. 전송 후 닫기/로그아웃을 서버 롤백으로 표시하지 않음 | 차단 |
| MCANCEL-06 | 로컬 PASS — 승인 경쟁409→최신 연결 회사·취소 버튼0/Toast0. 승인 지연은 계약/소스 분기를 보존하며 실제 경쟁 잠금/트랜잭션은 미실행 | 차단 |
| MCANCEL-07 | PASS — CR003/CR004/CR001 계약·최신 CANCELED/REJECTED/APPROVED·새 PENDING 처리. 브라우저의 승인/이미취소/새 신청409는 자동 DELETE 추가0·성공 Toast0 | 차단 |
| MCANCEL-08 | PASS — 양수 안전 ID/version·누락/타입/상태/시각·다른 대상/동일 version/빈·잘못된 wrapper 거부. 브라우저 다른 requestId 성공 응답은 오류/Toast0. 실제 wire `isSuccess`/게시 `success` 차이는 미확인 | 차단 |
| MCANCEL-09 | PASS — HTTP404/403/500·연결 실패/응답 유실 오류·자동 재전송0. 브라우저 응답 유실 후 명시 재확인으로 CANCELED/빈 화면 복구·Toast0. 재조회 실패는 미확정/확인 안내 유지 | 차단 |
| MCANCEL-10 | PASS — 동일 계정401 한 번 재요청·최종401의 보호 자료 제거/로그인 경로. 취소 후 refresh 실패는 빈 완료+sessionWarning·Toast1, 이후 refresh/GET 실패도 완료+경고 유지·재취소0 | 차단 |
| MCANCEL-11 | PASS — 자동 계정 교체/로그아웃/화면 dispose의 늦은 결과 콜백0. 브라우저 전송 중 로그아웃 후 늦은 Toast0·비로그인 화면, mock 두 계정의 취소 이력2/별도 PENDING 격리. reload·구형 이관·문서/초대/멱등 replay·탭/프로필/namespace 기존 계약 보존 | 차단 |
| MCANCEL-12 | 로컬 PASS — API/mock/hybrid 빌드·config/production guard/계정 namespace·업로드 회귀 테스트, mock 외부 요청0. 실제 운영 artifact 시작/배포·실제 QA snapshot/복구는 미실행 | 차단 |

- 최종 scripts/리뷰: [DEV-15 검증 기록](../development/figma-v01/reviews/DEV-15.md)을 따른다. 브라우저 reload 직후 hydration 대기 locator 두 번과 연속 자동화의 첫 진입 locator는 최종 snapshot에서 정상 로드를 확인한 도구 타이밍 이력이다. 제품/계약 검사 실패나 자동 수정으로 세지 않았다.
- 실제 재개 조건: frontend/backend 실행 SHA 대응·실제 wrapper/취소 결과·상태별 disposable 본인/타인·관리자 합성 계정/신청·안전한409/권한/세션·응답 유실/오류·사용/취소/재신청·이력 잔존/정리 담당과 허용 범위. 승인 자원으로 MCANCEL12를 실행·두 리뷰하기 전 실서버 통합 PASS로 올리지 않는다.
- 복구: 이번 실행자가 시작한 full mock/API 대역 Next와 로컬 합성 HTTP 서버를 종료했다. 실제 신청/회사·계정/메일·문서·DB의 변경/원복0이다.


### DEV-15 독립 리뷰 후 최종401 회귀

- 1차 verifier의 Major1로 후속 조회의 최종401 전달을 교정했다. MCANCEL-10에 충돌 후 GET/인증 재시도 최종401과 취소 성공 후 최종401을 추가했다. 전자는 로그인/복귀·보호 자료 제거·Toast0, 후자는 확인된 취소 완료 notice+로그인/복귀·보호 자료 제거·당해 성공 Toast1이다. DELETE는 각1건이며 추가 재취소0이다.
- 자동469개(추가 회귀3)·로컬 HTTP 브라우저18개 관찰로 확장했다. 기존 첫 검증/독립 FAIL은 Task/리뷰에 보존하고 실제 API 실행0·MCANCEL12 차단은 유지한다. 새로 시작한 회귀 Next/합성 서버/탭도 종료했다.


<a id="pol-11-return-qa"></a>

## 2026-11-13 · POL-11 회사 찾기/등록 복귀의 후속 QA 기준

[사용자 결정/정책 v1](../development/figma-v01/tasks/POL-11.md#pol-11-contract) · [DEV-16 인계/Gate](../development/figma-v01/tasks/DEV-16.md#dev-16-pol-11-handoff). 이 절은 **향후 검증할 기대 결과**다. 제품 구현·mock/HTTP 대역·실제 브라우저/업무 API를 이번에 실행하지 않았으며 RCTX는 **실행0·통과0·미실행15**다. 기존 MCO 4통과6차단, MCANCEL12 실서버 차단·AUTH/QA-06/07/08의 이력과 예외는 그대로 보존한다.

| ID | 조건/확인할 흐름 | 기대 결과 | 이번 결과 |
| --- | --- | --- | --- |
| RCTX-01 | 설정→회사 start→등록/찾기, 직접 URL/reload | 등록/찾기 재사용·설정 문맥 복원. 최상위 Back은 start, start Back은 회사 화면 | 미실행 |
| RCTX-02 | 방법 선택→번호/문서·검색→상세 신청→Back, 검색 query/page | 하위 Back은 바로 앞 단계·검증한 검색 상태 보존. history가 없을 때 안전한 fallback | 미실행 |
| RCTX-03 | 검색 빈 결과→등록·번호→문서/기존 회사·문서→합류 | 경로를 바꿔도 설정 문맥 유지. 임의 회사 생성/초대 수락/중복 변경 없음 | 미실행 |
| RCTX-04 | 진입/중간/완료 직전 세션 만료·최종401→로그인 왕복 | 보호 자료 숨김·검증한 현재 단계와 설정 문맥 보존. 같은 계정 복귀와 다른 계정 초기화 구분 | 미실행 |
| RCTX-05 | 외부/상대·//·역슬래시·제어 문자·인코딩 우회·임의 내부/중첩·중복 query | 설정 완료 목적지는 고정 /my/company, 잘못된 문맥은 검증된 기본 문맥. raw return을 href/next에 넣지 않음 | 미실행 |
| RCTX-06 | 설정에서 미인증/인증 등록 성공→완료 버튼 | 확인된 성공을 보인 뒤 ‘마이페이지로 돌아가기’→/my/company. 인증 수준·현재 overview 구분·replay 없음 | 미실행 |
| RCTX-07 | 설정에서 대표/팀원 신청·활성 일반 직급/제안 이름 | 대표는 일반 직급 없음, 일반 신청은 두 선택 중 하나. 누락/동시/타 회사 직급 차단, 승인 전 권한 부여 없음 | 미실행 |
| RCTX-08 | ACTIVE_MEMBERSHIP_EXISTS/PENDING_REQUEST_EXISTS | 추가 제출 차단·현재 회사/대기 화면 확인. 본인 명시 취소 외 자동 취소/재신청 없음 | 미실행 |
| RCTX-09 | PENDING_INVITATION_EXISTS/GOOGLE_VERIFIED_EMAIL_REQUIRED | 해당 신청 불가 상태 보존·기존 초대/인증 경로, token 생성/자동 수락 없음 | 미실행 |
| RCTX-10 | APPROVED 반영 지연·REJECTED/CANCELED,403/404·빈/error | 상태를 구별·명시 재확인/재시작. 권한/조회 오류를 빈 회사나 성공으로 만들지 않음. DEV-15 취소/이력/Sonner 횟수 유지 | 미실행 |
| RCTX-11 | 중복 클릭·중단/Back/reload·409·서버 오류/응답 유실 | 완료/실패/미확정 구분·최신 상태 확인, 자동 재등록/신청/삭제/취소·거짓 성공 안내0 | 미실행 |
| RCTX-12 | 등록 성공 뒤 refresh 실패/최종401·계정 전환/로그아웃·늦은 응답 | 확인된 성공+경고와 인증 필요를 구분. 재제출0, 다른 계정에 draft/업로드 복원/완료 노출0 | 미실행 |
| RCTX-13 | 기존 가입 /auth/start, 건너뛰기 next·등록/찾기 완료 | 기존 최상위/하위 Back·가입 완료 /bids·기존 next 의미 유지. 설정용 목적지로 오염되지 않음 | 미실행 |
| RCTX-14 | 지정 Figma 등록/찾기/신청/완료·대기/취소, desktop/390/320px·키보드 | ‘통합 요청’ 원문 유지·부연 설명 추가0. frame별 배치/상태/초점·넘침 확인, 재사용을 전체 시각 예외로 세지 않음 | 미실행 |
| RCTX-15 | 승인된 실제 자원으로 위 흐름, 입력/권한/경쟁·완료 후 최신 overview | 실행 SHA 대응·실제 wrapper/생성 status/nullable·version/409와 사용/변경/잔존/복구 증거를 남김. mock/HTTP 대역과 실서버 판정 분리 | 미실행 |

- 연결할 소유 근거: Figma 3162:51308/52186/51941(완료 버튼51949), 대표/팀원3140:121981, 대기/취소3162:52364/52416 및 POL-10/DEV-15의 기존 증거. 신규 캡처는 POL-11의 비식별 부분2개만이며 전체 화면 정합성 검증이 아니다.
- 실제 준비/승인: disposable 회사/계정·대표/팀원/신청/초대/종료/지연 상태와 기대값, 합성 사업자번호·비식별 증명서 및 업로드/OCR/등록/신청의 사용·변경·이력 잔존/정리·복구 담당/방법, 안전한 오류/경쟁·인증 재현, frontend/backend 실행 SHA와 배포 대응을 DEV-16 Gate에서 확보해야 한다. 이번에는 자원 준비·실제 변경 승인·로컬 선행 예외를 받지 않았다.
- source/개발 OpenAPI 확인과 실제 업무 응답은 별개다. 게시 success/현재 isSuccess, source 신청201/게시200·일부 required 누락은 실제 wire와 소유 source를 확인해 검증하고 URL 존재만으로 통합 PASS 처리하지 않는다. 기존 사례의 상태/요청 문구를 소급 수정하지 않는다.

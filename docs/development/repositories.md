# Repository 개발 가이드

현재 구현된 기능은 공개 진입점을 유지한 채 설정으로 API/mock을 교체한다. UI를 바꾸거나 API 실패에 자동 fallback하지 않는다. 전체 정책은 [data-access.md](../ai-context/data-access.md), 검증 범위는 [QA](../qa/repositories.md)를 확인한다.

## 1. 전체 mock 실행

Node 22.20.0과 pnpm 11.3.0을 사용한다.

```bash
pnpm install --frozen-lockfile
MATE_APP_ENV=local MATE_DATA_PROFILE=mock pnpm dev
```

빌드된 앱을 확인할 때는 빌드와 시작 환경을 모두 지정한다.

```bash
MATE_APP_ENV=preview MATE_DATA_PROFILE=mock pnpm build
MATE_APP_ENV=preview pnpm start
```

`MATE_APP_ENV` 미지정 배포 실행은 production이다. 운영 mock 빌드/시작과 mock Preview 결과물의 운영 승격은 거부된다. Vercel은 `VERCEL_ENV`를 우선하므로 production을 local로 덮어쓸 수 없다.

## 2. 일부 기능만 mock

```bash
MATE_APP_ENV=local MATE_DATA_PROFILE=hybrid \
MATE_DATA_OVERRIDES='{"company":"mock","notifications":"mock","notificationSettings":"mock"}' \
pnpm dev
```

위 구성은 로그인·입찰·공고 구독·개인 필터 API를 유지하고 회사·받은 알림·수신 설정을 mock으로 실행한다. 실제 인증 계정의 **식별키만** mock 공간을 구분하는 데 사용한다. 실제 인증 정보·API 응답을 저장하지 않는다.

| 키 | 함께 전환하는 동작 |
| --- | --- |
| auth | 로그인·가입·세션 복원/로그아웃 |
| bids | 홈·목록·metadata·상세·첨부·개찰·물품 |
| company | 회사/업종 조회·소속·초대·사업자번호·증명서·등록·나의 회사 |
| notifications | 받은 알림·미확인 건수·읽음·선택/전체 삭제 |
| bidAlerts | 공고별 구독 조회/설정/해제 |
| personalFilters | 개인 필터 조회/저장/초기화 |
| notificationSettings | 수신처·이메일 인증·맞춤 이메일 ON/OFF |

- 계정 기능 API는 auth API를 요구한다. bidAlerts/personalFilters API는 bids API도 필요하다.
- auth mock + 공개 bids API는 가능하되 나머지 계정 그룹은 mock이어야 한다.
- company 업종 검색은 company 공급원을 따른다. bids metadata와 섞지 않는다.
- 다른 공급원의 후속 효과를 동기화하지 않는다. mock 회사 등록이 실제 회사 소속이나 API 인증 응답을 바꾸지는 않는다.
- Q&A는 모든 프로필에서 static이다. API가 없는 콘텐츠에 endpoint를 만들지 않는다.

### 받은 알림 목적지 검증

기본 notifications mock은 25건 중 공고 `/bids/10001`, 분류2의 `/bids/10002?bidClsfcNo=2`, 현재 계정 `/my/company`, 목적지 없는 소식을 순환한다. 미읽음 성공 뒤 이동하고 이미 읽은 항목은 다시 PATCH하지 않는다. 오래된 탭 데이터에 actionPath가 없으면 목록/읽음 이력은 유지하고 안내한다. 새 목적지 fixture를 보려면 개발 Mock 표시의 현재 공간 초기화를 사용한다.

hybrid에서 목적지 공급원이 다르더라도 ID/분류를 치환하지 않는다. 합성 알림의 공개 공고가 API에 존재하지 않으면 기존404 화면이 표시될 수 있다. 합성 ID가 실제 공고임을 뜻하지 않으며, mock 화면 결과는 실제 통합 QA가 아니다. [DEV-06 QA](../qa/alarms.md#dev-06-local-qa)를 확인한다.

편집에서 ‘전체선택’은 이미 불러온 행을 고른다. 계정 전체는 ‘모든 소식 삭제’ 확인으로 실행한다. 기본 mock의 첫 20건만 펼친 상태에서 전체를 삭제하면 다음 5건도 사라지며, 같은 탭에서 새로고침해도 해당 계정의 삭제가 유지된다. ‘다른 가상 계정으로 로그인’으로 계정 격리를 확인한다. QA 데이터를 다시 쓰려면 개발 Mock 표시에서 현재 공간을 초기화한다. [DEV-43 QA](../qa/alarms.md#dev-43-local-qa)

## 3. 재시작·재빌드와 API 복귀

next.config.ts가 설정을 한 번 확정해 서버와 브라우저에 동일 snapshot을 주입한다. `NEXT_PUBLIC_MATE_DATA_CONFIG`를 직접 설정하지 않는다. dev는 설정 변경 후 서버를 재시작하고, build/start·Preview는 **재빌드**한다. 시작 시 profile을 바꾸는 것만으로 기존 빌드의 공급원이 바뀌지 않는다.

API로 돌아갈 때 overrides/scenarios를 해제하고 아래처럼 다시 실행한다.

```bash
MATE_APP_ENV=local MATE_DATA_PROFILE=api \
MATE_DATA_OVERRIDES='{}' MATE_MOCK_SCENARIOS='{}' pnpm dev
```

배포는 동일 설정으로 다시 build한다. 운영 기본은 API다. API 실패는 원래 오류/재시도 화면이며 mock이 나타나지 않는다. [Next 환경변수](https://nextjs.org/docs/app/guides/environment-variables)의 빌드 고정 특성을 따른다.

## 4. 가상 계정·회사·이메일 사용

- 기본은 비로그인이다. 로그인 화면의 **가상 계정으로 로그인**은 계정 1, **다른 가상 계정으로 로그인**은 계정 2다. 두 계정의 회사/알림/설정/구독/필터는 격리된다.
- **가상 계정 신규 가입**은 기존 signup 화면을 사용한다. 필수 약관을 동의하고 합성 이름 등 테스트 입력으로 제출하면 101부터 새 계정이 만들어진다. 외부 Google/API 요청은 없다.
- 가상 로그인 flow는 10분, 세션은 24시간이다. token은 1시간마다 로컬 refresh로 갱신하고 세션 만료 뒤 보호 요청은 거부한다. 계정 교체 시 등록 화면의 임시 상태도 초기화한다.
- 일반 초대: `/auth/company/invitations#token=mock-invite`. 계정 2 전용 초대: `/auth/company/invitations#token=mock-invite-account-2`. 이 값들은 공개 합성 fixture다. 로그인 전 열고 로그인/계정 교체 후 이어갈 수 있다.
- 사업자번호는 합성 `1234567890` 등 10자리로 처리→등록→나의 회사 흐름을 확인한다.
- 증명서는 합성 PDF/PNG/JPEG, 10MB 이하를 사용한다. mock은 파일을 외부 전송하거나 원본을 저장하지 않는다. 업로드 완료→처리→회사 제안→등록 상태를 확인한다.
- `/my/settings/notifications`의 대체 수신처 인증에는 `example.test` 주소를 사용한다. 계정의 첫 가상 발송은 **1234**, 이후 성공한 시작·재전송마다 **1235**, **1236**처럼 1씩 증가한다. **9999** 다음은 **0000**이다. 새 발송은 이전 요청 ID와 바로 전 번호를 무효화한다.
- 발송 후 3분이 지나면 확인이 만료된다. 진행 중인 요청이 있으면 시작과 재전송 모두 발송 후 60초부터 가능하다. 오입력 1~4회는 오류, 다섯 번째부터는 차단이며 재전송에서 시도 횟수를 초기화한다. 오류·만료·팝업 닫기 중에는 기존 수신처가 유지되고, 최신 번호 인증을 성공하면 새 주소가 선택된다. 가상 발송에서 메일은 전송되지 않는다.
- 예를 들어 첫 발송 뒤 재전송을 기다려 누르고, **1234**로 확인을 시도해 오류와 기존 수신처 유지 여부를 확인한 다음 **1235**로 인증을 완료한다. 계정의 가상 번호 흐름은 새로고침 뒤에도 이어진다. 기존 10분/30초로 발급된 탭 요청은 발송 시각을 기준으로 기한을 보정한다. `notificationSettings`의 `expired`와 `blocked`는 확인의 만료·횟수 제한 응답을 재현한다. [DEV-41 검증](../qa/notification-email-recipient.md#dev-41-local-qa)
- API 공급원에서는 시작·재전송 응답의 `expiresAt`과 `resendAvailableAt`으로 팝업 시간을 표시하고, 확인 성공 응답에 담긴 수신처를 적용한다.
- 받은 알림 기본은 25건(미확인 22건)이다. 읽음·더 보기·헤더 건수·새로고침을 함께 확인한다.

## 5. 명시적 시나리오

```bash
MATE_APP_ENV=local MATE_DATA_PROFILE=mock \
MATE_MOCK_SCENARIOS='{"company":"processing-failed","bids":"attachments-error"}' \
pnpm dev
```

| 그룹 | 허용 시나리오 |
| --- | --- |
| auth | default, slow, signup, expired, invalid-flow |
| bids | default, slow, empty, error, partial-error, attachments-error, related-error, results-error, purchases-error, participants-error |
| company | default, slow, connected, pending, rejected, canceled, approved-stale, denied, invite-mismatch, invite-expired, processing-failed, conflict, evidence-empty, error, documents, documents-empty, documents-denied, documents-version-error, team-agent, team-viewer, team-extra, team-read-only, team-empty, team-denied, team-pending, team-last-admin, team-no-representative, team-requests, team-requests-empty, team-reviewer, team-invitation-mail-failed, merge, merge-proposal, merge-in-place |
| notifications | default, slow, empty, error |
| bidAlerts | default, slow, error |
| personalFilters | default, slow, conflict, error |
| notificationSettings | default, slow, expired, blocked, error |

서류함 `/my/documents`의 `documents`는 합성25개/현재·후보·처리/기간 경계, `documents-empty`는 연결 회사0건, `documents-denied`는 목록 leaf 거절과 metadata 허용 차이, `documents-version-error`는 한 문서의 보유/기간 조회 실패다. 모두 회사 공급원이 mock일 때만 사용한다. 신규 가입 문서는 등록 성공 뒤에만 같은 회사 목록에 나타나며 원본 상세는 DEV-23, 기존 문서 재업로드는 DEV-24, 전체 삭제는 DEV-25의 승인된 로컬 범위를 따른다. 신규 추가·실제 업무 처리/삭제는 별도 Gate다. [DEV-22 로컬 QA](../qa/company-documents.md#dev-22-local-qa)와 실제 통합 차단을 구분한다. 상세 `/my/documents/[documentId]?version=<UUID>&page=<목록 UI page>`에서 exact 버전/이력·기본 PDF/이미지 뷰어와 명시 원본 다운로드를 확인할 수 있다. `documents`의 11번째 합성 문서는 현재v2/이전v1,12번째는 PNG 사례다. 원본은 메모리에서만 생성하며 실파일/티켓을 저장하지 않는다. `documents-denied`는 metadata 허용·원본404를 재현한다. 실제 HTTP는 티켓/GET·MIME/크기·만료/CORS가 모두 충족돼야 하며 [DEV-23 QA](../qa/company-documents.md#dev-23-local-qa)는 loopback 대역/실제 API 차단을 구분한다.

목록은 `src/data/config.ts`의 mockScenarios가 기준이다. 오타·없는 그룹·API 공급원에 시나리오를 지정하면 설정 오류다. 실패는 무작위가 아니다. processing-failed는 최초 OCR 실패 후 재시도 성공, conflict는 기존 회사 처리 선택을 재현한다. 회사 초기 상태는 해당 공간에 저장 상태가 없을 때 적용한다.

### 가입 회사 근거 확인 · DEV-59

- 번호 조회와 합성 문서 제안의 기본 fixture는 금액5억 원/평가연도 `null`, 대표면허 `YES`, 여성기업 `YES`·장애인기업 `NO`·사회적기업 `UNKNOWN`이다. 공개 자료 기준일 `2025-12-31`은 고정 합성 보고서 날짜이며 평가연도나 실제 최신 보고서를 뜻하지 않는다. 화면의 Y/N/정보 없음과 자료 기준일을 함께 확인한다.
- `MATE_MOCK_SCENARIOS='{"company":"evidence-empty"}'`로 재시작/재빌드하면 금액·연도·근거 출처/기준일이 `null`, 면허·인증3종은 `UNKNOWN`인 자료 없음 사례를 만든다. 회사 identity는 남으므로 가입 확인을 계속할 수 있다. 빈 값을 `NO`나0원으로 바꾸지 않는다.
- 프로필은 입력/증명서/나라장터/보고서 출처를 구분한다. 알려진 구형 탭의 합성 평가연도·면허 ACTIVE·빈 인증 객체는 회사 영역의 `signupEvidenceVersion: 1` 변환으로 연도 null/UNKNOWN·근거 없음으로 바꾸고 연결·문서·proposal/revision·멱등 응답을 유지한다. 새 형식의 임의 enum/출처/없는 날짜는 해당 계정 company 공간만 초기화한다. 전체 namespace/schema와 다른 계정/도메인·실제 문서 UUID 키는 바꾸지 않는다.
- [DEV-59 검증](figma-v01/tasks/DEV-59.md#dev-59-verification)은 로컬 mock/HTTP 대역이다. 실제 번호 등록·업로드/OCR QA-06/07 차단과 직접 편집 준비 중 상태를 유지한다.

### 기본정보 복수 주력업종 확인 · DEV-60

- company `connected` 시나리오의 `/my/company`는 토목공사업·정보통신공사업을 같은 수준의 주력업종으로 표시한다. 새로고침 후 목록을 유지하며 가입 UI의 단일 업종 선택과 구분한다.
- 내부 기본정보는 `primaryIndustries`만 사용한다. HTTP의 신형 배열(빈 배열 포함)이 우선이며 legacy 단일값은 배열 필드 누락 때만 호환한다. 배열 null/잘못된 행·코드별 이름 충돌은 조회 오류다.
- 회사 영역 `basicProfileVersion: 1`이 알려진 구형 기본정보 단일값을 목록으로 변환한다. 문서/신청·가입 근거·멱등 replay와 계정/다른 영역·실제 문서 UUID 키는 보존한다. 잘못된 새 목록은 해당 계정 company 공간만 초기화한다. 새 전역 schema/시나리오/공급원은 없다.
- [DEV-60 검증](figma-v01/tasks/DEV-60.md#dev-60-verification)은 로컬 mock/HTTP 대역이다. QA-05 기본정보/DEV-08 대시보드의 실제 통합 차단을 유지한다.

### 관련 공고 합성 데이터 확인 · DEV-61

- 기본 mock의 공사 `/bids/10001`은 같은 최종 업종의 진행 공사만 최대3개를 보여 준다. `/bids/10004`는 마감, `/bids/10016`은 취소 기준이며 둘 모두 진행 후보를 조회할 수 있다. 업종 관계 target URL에는 가짜 분류1을 붙이지 않는다.
- 물품 `/bids/10003?bidClsfcNo=1`의 첫 카드는 `/bids/10006?bidClsfcNo=2`로 이동한다. source의1을 복사하지 않고 target에서 실제 일치한2/10 중 숫자 의미상 앞선2를 선택한다. 같은 source의 `bidClsfcNo=2`는 비교 코드에 맞는 후보가 없어 정상 빈 상태다. 전체 분류 조회는 query를 생략한다.
- `bids=related-error`는 관련 section만 실패시키고 본문/첨부/품목 등은 유지한다. 시나리오를 default로 되돌리고 dev를 재시작하면 정상 카드가 복구된다. 카드 사업금액은 추정가격+VAT이며 한쪽 결측은 금액 미제공이다.
- fixture의 시각은 server 프로세스 시작 때 고정되므로 같은 실행에서 시각이 흐르면 후보가 마감된다. 재시작은 새 합성 fixture를 만든다. 테스트는 고정 fixture와 주입 Clock으로 정각·1ms 경계를 검증한다. 이는 실제 API 실행/서버 Clock 검증이 아니다. 자세한 근거와 범위는 [DEV-61](figma-v01/tasks/DEV-61.md#dev-61-verification)을 따른다.

## 6. 상태 보존·초기화

같은 탭 새로고침은 sessionStorage로 상태를 복원한다. 새 탭·계정·설정·API 환경·auth 공급원은 격리된다. 브라우저의 탭 복제 동작에 따라 sessionStorage가 복사될 수 있지만 복제 뒤 변경은 독립적이다. 로그아웃은 세션만 종료하며 업무 상태와 유효한 초대는 유지한다.

좌측 하단 **개발용 Mock**을 열고 **Mock 상태 초기화**를 누르면 현재 설정 공간만 지우고 새로고침한다. 실제 세션/문서 키나 다른 설정 공간을 지우지 않는다. 저장소 차단/용량 초과 시 메모리로 계속 동작하고 표시에서 새로고침 유지 불가를 알린다. 손상 데이터는 해당 도메인 공간만 초기화한다.

## 7. 새 기능과 검증

1. 내부 모델과 현재 필요한 Repository 계약을 정의한다.
2. Clock/Storage를 주입한 mock으로 정상·빈·오류·변경·복원 UI를 개발한다.
3. 확인된 백엔드 DTO와 HTTP 구현을 추가한다.
4. 동일 계약 테스트와 승인된 실제 API 통합 검증을 수행한다.
5. 해당 그룹을 api로 바꾸고 재빌드한다.

```bash
pnpm test
pnpm lint
pnpm build
git diff --check
pnpm build-storybook
```

마지막 명령은 Storybook/공용 모델 영향 시 필요하다. Vitest는 Node 환경, HTTP는 주입한 fetch 대역이다. 실제 API mutation은 계정과 변경/복구 범위를 승인받은 뒤 수행하고, 기존 QA 대기는 mock PASS로 대체하지 않는다.

## 8. 공개 입찰 mock의 검색·시간 기준

공개 검색은 공고명·공고번호·공고기관·수요기관의 부분 일치이며 앞뒤 공백과 대소문자를 정규화한다. 기본36개 합성 공고 중 ALL은 시작 전/진행 중27개, CLOSING_SOON은 마감까지3일 이내9개, RESULT는 결과가 발표된9개다. 홈은 ALL 마감 오름차순의 첫9행을 그대로 사용한다. 시작 전 fixture도 ALL에 포함되며, 결과가 없는 공고가 마감됐다는 이유만으로 RESULT에 들어가지는 않는다.

Repository는 생성 시 주입 Clock으로 fixture를 한 번 만들고 조회 시 같은 Clock의 현재 시각으로 마감 여부를 판단한다. 마감 시각은 활성 목록에서 제외하고 CLOSING_SOON의3일 상한은 포함한다. 실제 Next 공개 Repository는 요청마다 생성되므로 합성 일정은 요청의 실제 시각 기준이다. 테스트는 고정 Clock과 시간 이동으로 동일 fixture의 경계를 검증한다.

공개 기본 mock의 검색·시각 증거는 [DEV-65](figma-v01/tasks/DEV-65.md)와 [홈](../qa/home.md#dev-65-mock-qa)·[목록](../qa/bid-list.md#dev-65-mock-qa)에서 확인한다. 고급 지역·공동도급은 같은 `bids` 공급원에서 서울·부산 상위/하위 코드와 확인된 제한 없음·미확인·실패, 의무·가능을 사용한다. 지역 OR과 조건 그룹 AND를 페이지 분리 전에 적용한다. 관련 공고 predicate의 근거는 [DEV-61](figma-v01/tasks/DEV-61.md)을 따른다. [DEV-09 로컬 QA](../qa/bid-list.md#dev-09-l07-local-qa)

## 9. 소속 신청 취소의 로컬 상태

- `company=pending`은 실제 version/시각을 가진 합성 신청으로 시작한다. 본인 대기 화면에서 확인 후 취소하면 CANCELED/version 증가 이력을 보존하고 회사 화면은 비운다. reload에서는 완료 Toast를 재생하지 않는다. 기존 start의 등록/찾기로 재신청하면 새 ID를 사용하고 이전 취소 이력은 남는다.
- 회사 공간의 `membershipVersion: 1`이 구형 합성 신청만 이관한다. 문서/초대·멱등 replay와 계정/탭/프로필 namespace는 유지하며 실제 API 자료를 mock에 복사하지 않는다. source 선택/전역 schema/시나리오 이름의 변경은 없다.
- [DEV-15 로컬 검증](../qa/my-company.md#dev-15-local-qa)의 HTTP 대역은 합성 서버만 사용했다. 실제 계정/취소·재신청·권한/경쟁/복구는 승인 자원과 실행 대응 확보 전 차단이며 기존 실제 QA를 대체하지 않는다.

## 10. 기존 회사 문서 재업로드 · DEV-24

- 사용자 D1의 범위는 기존 서류 재업로드의 로컬 선행이다. 빈 서류함의 신규 추가·실제 서버 업로드/OCR·회사 프로필 반영/MAT-162·삭제는 포함하지 않는다. 목록/상세의 ‘다시 업로드’는 서버 최신 current를 기준으로 같은 series에 후보를 만든다.
- PDF/JPG(JPEG)/PNG·MIME/확장자 일치·1..10×1024×1024bytes를 확인하고, 파일/멱등 키/opaque handle은 열린 화면 메모리에서만 유지한다. PUT 주소 만료는 같은 파일/키로 갱신하고 session410은 현재 상태 확인/명시 재선택이다. 새로고침 뒤 처리 중인 후보는 GET으로 복원하며 전송 대기 후보의 파일/이전 키는 자동 복원하거나 새 명령으로 대체하지 않는다.
- `documents` mock은 기존 current를 유지하다 새 후보의 OCR/진위 확인 뒤 VERIFIED/current와 이전 REPLACED를 함께 변경한다. 원문·입력 파일명/서명·추출 개인정보를 저장하지 않고, 미리보기는 기존 합성 원본 생성 규칙을 따른다. 가입의 미귀속 문서/최종 등록 흐름과 일곱 공급원·storage namespace는 유지한다.
- 서버가 회사/identity의 인증 근거 version·인증 시각을 갱신하는 것과 회사명/주소 등 프로필값을 반영하는 것은 다르다. [DEV-24 Brief](figma-v01/tasks/DEV-24.md#dev-24-brief)와 [로컬 QA/실제 차단](../qa/company-documents.md#dev-24-local-qa)을 구분한다.

## 11. 보관 문서 전체 삭제 · DEV-25

- 상세의 ‘지우기’는 선택한 이전 version만이 아닌 전체 series 삭제다. 확인/돌아가기·Escape, 중복 억제·삭제 결과/후속 목록 조회를 구분한다. 문서관리 leaf/미귀속 owner는 서버가 판단하며 role 이름으로 허용하지 않는다.
- `documents` mock에서 전체 삭제 후 목록은200으로 해당 행을 제외하고, 개별 이력/원본/업로드/처리는404이며, 같은 계정의 재삭제는 같은 deletedAt/purgeAt다. 새로고침·다른 계정/namespace·기존 업로드/멱등 이력은 유지한다. 저장한 합성 metadata는 worker/실제 파일 파기를 실행한 증거가 아니다.
- 404/409/timeout·손상2xx는 완료가 아니며 자동 재삭제하지 않는다. 현재 상태 확인은 GET뿐이고 새 삭제에는 다시 확인이 필요하다. 성공 뒤 목록 실패/로그인 필요는 확인된 삭제를 보존하고 목록 재확인으로 연결한다. 회사 문맥은 company 포트를 사용해 auth API/company mock 조합을 보존한다.
- [이번 D1/Brief](figma-v01/tasks/DEV-25.md#dev-25-brief)·[로컬 QA와 실제 차단](../qa/company-documents.md#dev-25-local-qa)을 구분한다. 실제 삭제·30일 비동기 파기/장기 worker는 disposable 자원·안전한 사용/삭제/잔존/복구 승인 뒤 재개한다.

## DEV-27 팀원 조회의 로컬 재현

회사 공급원 mock에서 `connected`는 합성 팀원23명·목록20행/페이지·ADMIN/AGENT/VIEWER와 nullable 상세를 제공한다. `/my/team`의 메뉴와 `/my/team/<membershipId>?page=<목록 UI page>`를 사용한다. `team-agent`/`team-viewer`는 현재 사용자의 leaf, `team-extra`는 VIEWER+초대 leaf, `team-read-only`는 변경 capabilities 전체 false, `team-empty`/`team-denied`는 빈 목록/조회 거부다. 기존 계정별 company overview를 사용하므로 API auth의 회사 null로 mock 회사를 덮어쓰지 않는다. DEV-27 당시 새 그룹/schema/라이브러리나 관리 명령은 없었으며 로컬 조회 검증·한계/실제 QA 차단은 [TEAM 기록](../qa/team-members.md#dev-27-local-qa)에 보존한다. 현재 관리 명령은 아래 DEV-28 범위다.

## DEV-28 팀원 변경의 로컬 재현

같은 company 공급원에서 상세의 직급/역할·leaf와 확인 팝업을 사용한다. 낮은 대상의 일반 변경은 직접, 동급·ADMIN 승격/대표자 지정은 대상 동의, 본인은 별도 축소/대표자 취임·소속 종료 경로다. 직급과 권한의 직접 저장은 각각 실행해 부분 성공을 한 번의 전체 저장으로 안내하지 않는다. 동의 요청은 `/my/team/change-requests`의 내/회사 목록과 exact 상세에서 명시 수락·거절/취소한다. 알림 읽음은 동의가 아니다.

`MATE_DATA_PROFILE=mock`, `MATE_APP_ENV=local`, `MATE_MOCK_SCENARIOS`의 company에 `team-pending`을 지정하면 본인에게 온 직급 변경 제안이 보인다. `team-last-admin`은 마지막 관리자 거부와 ADMIN 유지 대표자 해제, `team-no-representative`는 본인 취임을 확인한다. 기존 `connected`/역할·읽기 전용 시나리오도 가변 팀원 상태를 계정·회사별로 복원한다. 이전 회사/문서·초대·신청 상태와 다른 계정은 유지하고 Mock 상태 초기화는 기존 개발 UI를 사용한다. 설정은 불변 빌드 snapshot이므로 dev 재시작/Preview 재빌드가 필요하다.

로컬 자동 명령은 `pnpm test`, `pnpm lint`, 구성별 `pnpm build`, `pnpm build-storybook`, `git diff --check`다. [TEAM 검증/실제 차단](../qa/team-members.md#dev-28-local-qa)과 [검토](figma-v01/reviews/DEV-28.md)를 따른다. 실제 권한/소속 변경·초대/메일은 이 로컬 재현으로 승인되지 않으며 실제 자원·사용/변경/잔존/복구와 실행 대응을 먼저 확보한다.

## DEV-29 보낸 초대의 로컬 재현

`MATE_APP_ENV=local MATE_DATA_PROFILE=mock MATE_MOCK_SCENARIOS='{"company":"connected"}' pnpm dev`로 실행하고 가상 계정 로그인 뒤 `/my/team`의 새 팀원 초대하기를 사용한다. 이름과 `example.test` 합성 이메일·기존 일반 직급 또는 새 직급명·역할/추가 권한을 명시 입력한다. 새 직급 제안은 정의 CRUD가 아니며 수락 시 계약을 따른다. 생성/보낸 목록·상세·만료/delivery는 ACTIVE 팀원 표와 별개다. 같은 탭 새로고침은 초대를 복원하고 가상 계정2에는 계정1 초대를 표시하지 않는다.

`team-extra`는 invite leaf만 추가한 VIEWER(기존 직급/기본 VIEWER 허용·새 직급/초과 grant 금지), `team-viewer`/`team-agent`/`team-read-only`는 초대 거부, `team-no-representative`는 대표자 공석이다. `team-invitation-mail-failed`는 생성 성공과 합성 메일 전송 실패를 구분한다. `active-member@example.test`, `pending-member@example.test`, `ambiguous-member@example.test`, `registered-member@example.test`는 각각 활성 소속 CM004·같은 회사 신청 CI010·모호한 신원 CI011·기등록 이름 보존을 재현하는 **공개 합성 별칭**이다. 실제 이메일이나 업무 계정은 사용하지 않는다.

초대 생성과 기존 팀원 관리 명령은 같은 store/account queue를 공유한다. 유실/손상 응답 뒤 닫고 상태 확인은 GET이며 새 초대는 다시 명시 작성한다. 재발송/취소/PATCH·수락 완료 목적지는 이 기능에서 제공하지 않는다. 생성된 초대의 실제 메일/수신 수락은 [DEV-29 실제 QA 차단](../qa/team-members.md#dev-29-local-qa)이며 기존 `/auth/company/invitations` 합성 fixture를 실제 발송의 증거로 사용하지 않는다.

## DEV-30 기존 초대 편집·재발송·취소의 로컬 재현

같은 company mock 시나리오/기존 계정 공간에서 `/my/team`의 보낸 초대를 생성한 뒤 행의 재발송·초대 취소를 선택한다. 미만료 PENDING만 관리하며 만료는 새 초대 작성이다. 재발송 form은 이메일/등록된 계정 이름을 잠그고 현재 직급/권한·부여 제약을 검사한다. 변경이 있으면 PATCH 저장 후 최신 상태를 다시 확인하고 새 version으로 재발송한다. 저장·재발송·메일 상태는 별개이며 실패 뒤 자동 재명령은 없다.

mock은 실제 메일/비밀 링크를 만들지 않으며 독립 수신 fixture와 발송 관리 연결을 모사하지 않는다. 실제6소유 부분의 재개 조건과 합성 로컬 경합/브라우저 증거는 [DEV-30 QA](../qa/team-members.md#dev-30-local-qa)를 따른다. 새 시나리오·설정·스키마/namespace·라이브러리 추가는 없다.

## 12. 받은 팀원 합류 신청 · DEV-31

`company=team-requests`는 `/my/team/membership-requests`에서23건의 합성 신청·기존 직급/제안명/대표자·결측·page를 확인한다. `team-requests-empty`는 빈 목록, `team-reviewer`는 VIEWER+REVIEW만 가진 검토자의 원직급/VIEWER 승인·사유 거절과 직급 변경/초과 grant 제한을 확인한다. `team-no-representative`의 기존 공석 상태에서는 대표자 원신청 승인을 테스트할 수 있다. 설정은 dev 재시작/Preview 재빌드가 필요하다.

승인/거절은 기존 계정별 관리 상태와 공유 명령 lane을 사용한다. 승인 당시 결과는 현재 팀원 상태와 별개이며 후속 직급 변경/종료 뒤에도 남은 신청을 검토할 수 있다. 신청 상세 GET은 PENDING 전용이므로 처리 뒤404는 정상일 수 있고 특정 결정의 성공을 대신하지 않는다. 합성 reviewer의 목록/receipt·팀원 반영은 다른 신청자 계정 overview·다른 회사 pending/수신 초대의 실제 원자 정리 검증이 아니다. 실제5소유 부분의 자원/실행·변경/복구 조건은 [QA](../qa/team-members.md#dev-31-local-qa)와 [Task](figma-v01/tasks/DEV-31.md#dev-31-brief)를 따른다.

<a id="dev-34-merge-mock"></a>

## 13. 회사 간 통합 현행 사건 · DEV-34

전체 mock에 회사 통합 fixture를 선택하고 `/my/company-merge`를 연다.

```bash
MATE_APP_ENV=local MATE_DATA_PROFILE=mock \
MATE_MOCK_SCENARIOS='{"company":"merge"}' pnpm dev
```

- `merge`의 가상 계정 1은 미인증 원본에서 검토를 신청하고 계정 2는 인증 회사에서 최초 제안을 보낸다. 두 계정은 같은 사업자번호 설정의 회사 쌍을 사용하며 별도의 사건과 상태를 갖는다. 같은 계정의 새로고침은 상태를 복원한다.
- `merge-proposal`로 시작하면 원본 계정에서 미리 준비된 최초 제안에 응답한다. `merge-in-place`는 가상 계정 1의 기존 회사 인증 검토이며 회사 간 명령을 열지 않는다. `connected`는 연결된 회사에 현재 사건이 없는 경우다.
- 공급원·시나리오 변경은 dev 재시작이나 재빌드가 필요하다. 기한 경계는 테스트의 고정 Clock으로 재현한다. 가상 신청과 제안은 실제 API, 메일, 회사·소속 이전을 실행하지 않는다. [검증과 실제 QA 재개 조건](../qa/company-merge.md#dev-34-local-qa)

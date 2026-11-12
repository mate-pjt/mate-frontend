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
| notifications | 받은 알림·미확인 건수·읽음 |
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
- 수신처 변경에는 `example.test` 합성 이메일과 가상 인증번호 **1234**를 사용한다. 만료 10분·재전송 대기 30초·잘못된 번호 5회 차단을 재현하며 실제 메일은 발송하지 않는다.
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
| company | default, slow, connected, pending, rejected, canceled, approved-stale, denied, invite-mismatch, invite-expired, processing-failed, conflict, evidence-empty, error |
| notifications | default, slow, empty, error |
| bidAlerts | default, slow, error |
| personalFilters | default, slow, conflict, error |
| notificationSettings | default, slow, expired, blocked, error |

목록은 `src/data/config.ts`의 mockScenarios가 기준이다. 오타·없는 그룹·API 공급원에 시나리오를 지정하면 설정 오류다. 실패는 무작위가 아니다. processing-failed는 최초 OCR 실패 후 재시도 성공, conflict는 기존 회사 처리 선택을 재현한다. 회사 초기 상태는 해당 공간에 저장 상태가 없을 때 적용한다.

### 가입 회사 근거 확인 · DEV-59

- 번호 조회와 합성 문서 제안의 기본 fixture는 금액5억 원/평가연도 `null`, 대표면허 `YES`, 여성기업 `YES`·장애인기업 `NO`·사회적기업 `UNKNOWN`이다. 공개 자료 기준일 `2025-12-31`은 고정 합성 보고서 날짜이며 평가연도나 실제 최신 보고서를 뜻하지 않는다. 화면의 Y/N/정보 없음과 자료 기준일을 함께 확인한다.
- `MATE_MOCK_SCENARIOS='{"company":"evidence-empty"}'`로 재시작/재빌드하면 금액·연도·근거 출처/기준일이 `null`, 면허·인증3종은 `UNKNOWN`인 자료 없음 사례를 만든다. 회사 identity는 남으므로 가입 확인을 계속할 수 있다. 빈 값을 `NO`나0원으로 바꾸지 않는다.
- 프로필은 입력/증명서/나라장터/보고서 출처를 구분한다. 알려진 구형 탭의 합성 평가연도·면허 ACTIVE·빈 인증 객체는 회사 영역의 `signupEvidenceVersion: 1` 변환으로 연도 null/UNKNOWN·근거 없음으로 바꾸고 연결·문서·proposal/revision·멱등 응답을 유지한다. 새 형식의 임의 enum/출처/없는 날짜는 해당 계정 company 공간만 초기화한다. 전체 namespace/schema와 다른 계정/도메인·실제 문서 UUID 키는 바꾸지 않는다.
- [DEV-59 검증](figma-v01/tasks/DEV-59.md#dev-59-verification)은 로컬 mock/HTTP 대역이다. 실제 번호 등록·업로드/OCR QA-06/07 차단과 직접 편집 준비 중 상태를 유지한다.

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

새 mock 검증은 [DEV-65](figma-v01/tasks/DEV-65.md)와 [홈](../qa/home.md#dev-65-mock-qa)·[목록](../qa/bid-list.md#dev-65-mock-qa)에 연결하며 기존 실제 API 통과/차단을 대체하지 않는다. 고급 지역/공동도급과 관련 공고 predicate는 각각 DEV-09·DEV-61의 별도 범위다.

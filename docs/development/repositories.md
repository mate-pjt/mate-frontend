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
| company | default, slow, connected, pending, rejected, canceled, approved-stale, denied, invite-mismatch, invite-expired, processing-failed, conflict, error |
| notifications | default, slow, empty, error |
| bidAlerts | default, slow, error |
| personalFilters | default, slow, conflict, error |
| notificationSettings | default, slow, expired, blocked, error |

목록은 `src/data/config.ts`의 mockScenarios가 기준이다. 오타·없는 그룹·API 공급원에 시나리오를 지정하면 설정 오류다. 실패는 무작위가 아니다. processing-failed는 최초 OCR 실패 후 재시도 성공, conflict는 기존 회사 처리 선택을 재현한다. 회사 초기 상태는 해당 공간에 저장 상태가 없을 때 적용한다.

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

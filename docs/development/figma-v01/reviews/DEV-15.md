# DEV-15 검증·리뷰 기록

## 범위와 승인

- [Implementation Brief/이번 사용자 답변](../tasks/DEV-15.md#dev-15-brief)·[POL-10 v1](../tasks/POL-10.md#pol-10-contract)에 따른 본인 대기 신청 취소 하나다. Git 전달·이번 Chromatic 월간 한도 예외와 로컬 선행·실서버 차단 보존 답변을 구분한다.
- 구현/검증: 양수 version/시각·명시 취소 공개 계약/HTTP mapper·계정별 mock 이력/이관, 확인/중복·완료/재조회·계정/화면 수명이다. 실제 업무 API/DB·메일/문서 처리·중앙/backend 편집·운영/배포·다음 Task 구현0이다.
- 원격 source dev `befe434c2b3fd80ddbc12c1d6216f738dd5ea12a`/main `8f522d0876a70edf61b8f5456a11c51756f60372`, 중앙 `c9e50ff591ae18023164e1a94581c611bf1e4f29`에서 Controller/Service·소속 정책을 재조회했다. 개발 Swagger는 직접403/브라우저200·OpenAPI3.1.0/v1. [POL-10 고정 source](POL-10-sources.json)의 같은 본인/PENDING/expectedVersion/오류와 일치한다. source/배포 기록은 현재 실행 SHA/실제 wire가 아니다.

## 검증

| 명령/환경 | 결과·증거 | 한계 |
| --- | --- | --- |
| Node22.20.0 `pnpm test` | PASS —20파일469개. `/tmp/mate-dev15-20261113/test.log` | Vitest Node 계약/구조·mock·주입 HTTP. 실서버 아님 |
| `pnpm lint` | PASS — `/tmp/mate-dev15-20261113/lint.log` | 실제 package script |
| `MATE_APP_ENV=preview MATE_DATA_PROFILE=api pnpm build` | PASS — `/tmp/mate-dev15-20261113/build-api.log` | 실제 배포/업무 요청 아님 |
| mock/hybrid `pnpm build` | 최종 PASS — `build-mock.log`/`build-hybrid.log` | 구성별 순차 실행, 동일 snapshot/guard 회귀 확인 |
| `pnpm build-storybook` | 최종 PASS — `storybook.log` | 기존 chunk 크기 경고는 오류 아님 |
| 실제 Next/full mock | PASS —320/390/desktop·닫기/키보드·취소/reload/재신청·두 계정 격리·외부HTTP0 | [QA/스크린샷](../../../qa/my-company.md#dev-15-local-qa). 실제 API 아님 |
| 실제 Next/API snapshot+로컬 HTTP 대역 | PASS —[18개 관찰](../../../qa/artifacts/dev-15/http-browser.json)·[비식별 요청](../../../qa/artifacts/dev-15/http-events.json). 본문0/expectedVersion3·중복1·최종401은2·계정/수명·완료/미확정 구분 | 예상 외 origin0/pageerror0. 게시/실제 wire/서버 권한/경쟁 검증 아님 |
| 문서 검사·`git diff --check` | PASS —최신 집계는 receipt 기준.79원본/114Task/156의존성·DAG·WBS 타 행/QA·plan·가이드 원문 prefix/범위·이미지·HTTP 증거 검사. [receipt](../../../qa/artifacts/dev-15/document-check.json) | 원본79개·Task114개/156의존성·기존 QA 보존 |
| 실제 MCANCEL-01~12 | **실행0·통과0·12차단** | 실행 대응/실제 wrapper·상태별 disposable 권한 자원·변경/잔존/복구 범위 필요 |

자동 수정 누적3/3(문서 배치1·후속 최종401 교정1·기존 오류 콜백 기대값 동기화1). 문서 수정: 기존 QA 마지막 문단 앞에 삽입한 신규 절을 문서 끝으로 이동하고 원문 prefix 검사를 재수행한다. 교정 뒤 기존 오류 콜백 테스트1건이 새 error 인자를 기대하지 않아 실패했고 해당 기대값을 보강한 재검증469개 PASS. 제품 런타임의 추가 결함은 없었다. 첫 조회/연속 브라우저 자동화의 hydration locator 대기는 새 snapshot으로 정상 로드를 확인한 도구 타이밍이며 제품 검사 실패로 바꾸지 않는다. 로컬 Next/full mock·HTTP 대역 서버는 이번 실행자가 종료했다.

## Documentation Update Check

- architecture/data-access: 새 명시 취소·version/mapper·controller/dialog·mock 이관/이력·재확인 세션 경계 동기화.
- plan/WBS/Task/QA·Repository 가이드: 이번 승인/로컬 증거·실제 차단/재개·다음 선정/Git 단계 기록. 기준선/기존 QA·다른 Task 정책/예외 불변. coverage는 M05→POL-10/DEV-15 매핑 변화가 없어 기존 행/설명 이력을 보존한다.
- base/harness: scripts/패키지/하네스 변화가 없어 미갱신. ai-failures에는 실제 독립 Major의 다단계 조회401 누락·원인/교정/예방을 기록했다. [Context Audit](DEV-15-context.md) PASS의 범위/잔여 실제 QA를 구분한다.

## 독립 verifier

최종 test466/lint·API/mock/hybrid build·Storybook/문서/diff-check를 확인하고 `.codex/agents/verifier.toml` 기준 read-only 검증을 요청했다. 원본 요구사항/현행 diff·소스·검증 근거로 판단하며 직접 수정하지 않는다. 결과/검토 freshness는 이후 receipt에 기록한다.

## ai-review

### 1. 리뷰 요약

현재 변경은 DEV-15 범위와 POL-10 정책/사용자 로컬 선행 답변에 부합한다. 공개 company 포트/공급원·경계 검증·계정별 이력·확인/완료·미확정/세션/화면 수명을 유지한다. 최종 문서/빌드 결과와 종료 변경 후 같은 여섯 항목을 다시 확인한다.

### 2. 발견된 문제

1차 독립 검토에서 후속 조회 최종401 전달 누락 Major1을 발견했다. controller 두 catch의 error 전달/성공 notice 보존과 회귀3개로 교정하고 test469/lint·구성별 build/새 브라우저2·문서 검사를 재수행했다. 현재 unresolved Blocker/Major/Minor0이며 독립 재검토를 요청한다. 새 라이브러리·자동 fallback·중앙/backend 편집·무관한 변경·실제 업무 실행 없음. 오류/충돌·최종401/계정 종료는 거짓 완료/늦은 Toast로 바꾸지 않는다. 기존 모바일 메뉴·전 화면 픽셀 차이는 이번 수정 범위 밖이며 전수 시각 PASS로 닫지 않는다.

### 3. 누락된 검증

실제 wrapper/실행 SHA·본인/관리자/타인·동시 승인/취소 트랜잭션·실제 4xx/5xx/세션/응답 유실·잔존/복구의 MCANCEL12는 차단이다. 로컬/HTTP 대역·브라우저 PASS로 대체하지 않는다. 실제 production artifact 시작/배포는 미실행이다. 최종 head의 원격 CI/리뷰는 PR 생성 뒤 확인한다.

### 4. 문서 갱신 필요 여부

위 Documentation Update Check에 따라 구조/계약·가이드·Task/WBS/QA·리뷰를 반영했다. 원본 기준선/79개 mapping과 QA 이력은 보존하고 최신 상태는 WBS만 소유한다. 검토 후 종료/인계 변경은 재검토한다.

### 5. 개발자 확인 필요

새 blocking 질문 없음. 실제 업무 변경/QA의 자원·사용/취소/재신청·이력 잔존/정리 범위는 후속 재개 때 필요하다. 이번 Git 전달/Chromatic 예외는 이미 승인돼 반복 질문하지 않는다.

### 6. 추천 수정 방향

계획한 최종 검사/독립 verifier와 종료·다음 선정의 재검토를 마친 뒤 목적별 commit/PR을 전달한다. 최종 head의 비Chromatic 검사/리뷰·저장소 일반 merge 조건을 확인하고 작은 이력을 보존해 병합·main FF한다. 다음 Task는 선정/인계까지만 한다.


### 독립 verifier 1차 결과(보존)

Result: FAIL. Blocker0/Major1/Minor0. 재조회 최종401을 일반 오류/경고로 바꾸는 두 catch 때문에 로그인/복귀 기준을 누락했다. 직접 Node22 test466/diff-check와 기존 모든 빌드/브라우저·문서/해시 증거를 검토했다. 교정 후 충돌→401·성공→401의 로그인/복귀·보호 자료 제거·DELETE 추가0/확인된 완료 보존을 재검증·재리뷰해야 한다. 별도 정책 결정 필요 없음.


### 401 교정 재검증

- 후속401 회귀3개를 추가했다. 기존 offline 오류 콜백도 error 객체를 보존하도록 바뀌어 이전 단일 인자 기대1건이 실패했다. 원인을 확인해 오류 객체 identity까지 검사하도록 기대를 보강했으며 최종20파일469개·lint PASS. 실패 log는 `/tmp/mate-dev15-20261113/test-after-review-failed.log`, 최종은 `test.log`다. 자동 수정3/3 안에서 끝냈다.
- 합성 실제 Next/HTTP 대역2사례 추가: 충돌→최종401은 로그인/복귀·신청 자료/Toast0, 성공→최종401은 완료 notice·로그인/복귀/보호 자료 제거·당해 검증된 성공 Toast1. 두 시나리오 DELETE각1/추가 재취소0·pageerror0/예상 외 origin0. 총18개 관찰이며 [기존16+추가2 증거](../../../qa/artifacts/dev-15/http-browser.json)를 보존한다.
- controller/회귀만 바뀐 뒤 API/mock/hybrid build를 다시 실행해 모두 PASS했다. 공유 Popup/Toast/Storybook 의존 파일은 이전 최종 PASS 뒤 바뀌지 않아 Storybook은 반복 실행하지 않는다. 문서/ai-review6항목과 verifier를 재실행한다. 첫 FAIL/Major와 실제 MCANCEL12 차단은 삭제하지 않는다.


### 6항목 ai-review 재실행(401 교정 뒤)

1. 리뷰 요약: 원본 정책/사용자 로컬 범위와 현재 runtime·회귀 diff/최종469개·구성별 build·18개 브라우저 증거를 다시 대조해 로컬 범위 PASS.
2. 발견된 문제: 1차 Major는 후속401 전달/완료 notice·로그인 분기와 회귀로 해소했다. 현재 unresolved Blocker/Major/Minor0. 첫 FAIL은 위에 보존한다.
3. 누락된 검증: 실제 wire/실행 SHA·권한/경쟁/복구 MCANCEL12 차단과 production 실제 시작/배포 미실행은 그대로다. 원격 CI/리뷰·병합 조건은 최종 PR head에서 확인한다.
4. 문서 갱신 필요 여부: Task/QA·실패 로그/Context Audit/증거에 교정·469개/18개 관찰을 반영했다. WBS는 리뷰1이며 원본/타 Task 상태·예외는 보존한다.
5. 개발자 확인 필요: 추가 blocking 결정 없음. Git 전달/Chromatic 한도 예외·로컬 선행 승인은 이번 범위대로 적용한다.
6. 추천 수정 방향: independent 재검토 뒤 종료 체크리스트/WBS·다음 하나 선정/인계만 반영하고 affected 문서 리뷰를 다시 확인한다. runtime/test를 추가 변경하면 해당 검사·리뷰를 다시 수행한다.


### 독립 verifier 2차와 종료 인계

Result: **PASS**. Blocker0/Major0, 이전 검증 표 집계의 Minor1은 최신 receipt 참조로 동기화했다. 두 후속401 전달·확인된 완료 notice/로그인·보호 자료 제거·자동 추가 DELETE0을 확인했다. verifier가 Node22.20.0 `pnpm test tests/membership-cancellation-controller.test.ts`20개/diff-check를 직접 PASS하고 전체469개·새 구성별 build·브라우저18개/문서·runtime10개 hash를 검토했다. Storybook 비영향/실제 QA 차단도 확인했다.

로컬 범위 종료로 DEV-15 체크리스트/WBS와 다음 POL-11의 선정 이유/첫 행동만 갱신했다. runtime/test는 변경하지 않았다. 이 문서 delta의 링크/집계/의존성·기존 이력/범위와 두 리뷰를 다시 확인한 뒤 전달한다. 실서버/현재 실행 SHA·권한/경쟁/복구의 MCANCEL12 차단·최종 PR CI 확인은 유지한다.

### 종료 문서에 대한 ai-review 재실행

1. 리뷰 요약: DEV-15 로컬 범위 완료와 POL-11 선정/인계만 반영됐고 source/test 해시는 검토 이후 그대로다. 승인된 범위 PASS.
2. 발견된 문제: 후속401 Major/이전 집계 Minor 모두 해소. 현재 unresolved Blocker/Major/Minor0. 최초 FAIL/시도/차단 이력은 남아 있다.
3. 누락된 검증: MCANCEL12 실제 차단·운영 artifact 시작/배포 미실행을 그대로 남겼고 최종 PR/head CI·리뷰는 전달 단계에서 확인한다.
4. 문서 갱신 필요 여부: WBS26완료/22차단/63대기/1준비/2보류·79원본114Task156의존성, Task 체크리스트/로컬 한계·POL-11 첫 행동/미착수, QA/실패 로그/공통 데이터 문서와 최신 receipt가 일치한다.
5. 개발자 확인 필요: 새 결정 없음. 실제 QA 자원/사용·변경/잔존/복구의 후속 Gate와 Task별 승인 예외를 유지한다.
6. 추천 수정 방향: affected verifier 문서 재검토 후 목적별 commit/push·PR/라벨·최종 CI/정상 merge/로컬 main FF를 완료한다. 이후 실제 Git 식별자/CI receipt만 추가하면 링크/diff/영향 검토로 충분하며 정책·상태·소스 변경이면 해당 검토를 다시 수행한다.

### 종료 문서 verifier 3차 / 최종 freshness

Result: **PASS**, Blocker/Major/Minor0. 현행 diff·문서/집계·POL-11 인계·11문서530링크/79원본114Task156의존성과 runtime/test10개 해시를 독립 확인했다. 종료 변경은 문서뿐이라 기존469개·구성별 build/Storybook·브라우저18개 증거가 유효하다. 이후 사실에 근거한 commit/PR/head/CI 식별자 receipt만 추가하고 코드·정책·범위·판정이 같으면 링크/diff·해시/영향 확인과 생략 이유 기록으로 충분하다는 verifier 의견을 확보했다. 충돌/제품·판정 변화가 생기면 해당 검증·두 리뷰를 다시 수행한다.

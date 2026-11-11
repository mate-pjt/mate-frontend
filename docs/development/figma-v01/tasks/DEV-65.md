# DEV-65 · 공개 목록·홈 mock의 검색·view 정책 정합성

[상태의 단일 기준: WBS](../README.md) · [운영 규칙](../workflow.md) · [감사 근거](../audits/2026-11-11.md#cf-11)

## 작업 정의

- 유형: 개발. 원본 항목: H02, L01, L03, L12; 2026-11-11 전수 감사 CF-11.
- 선행 작업: [QA-17](QA-17.md). 순위는 WBS가 관리한다.
- 목적: 검색은 공고명·공고번호·공고기관/수요기관을 지원한다. ALL은 시작 전/진행 중, CLOSING_SOON은3일 이내, RESULT는 결과 기준이다.
- 현재 차이/영향: mock은 title만 검색한다. 기본 목록에10001이 있지만 query=MOCK-10001-00은0건이다. ALL에는 마감된10004/10016/10028도 포함되고 홈 첫9개는 마감 fixture가 먼저 보인다.
- 제외: 아래 소유 경계 밖의 기능·새 라이브러리·무관한 리팩터링. 이번 감사에서는 제품 수정/실제 업무 API 변경/commit·push·PR·배포를 수행하지 않았다. 미래 구현의 실행 범위는 착수 Gate에서 확인한다.
- 책임/재개 조건: 실행자는 다음 선정 시 확정한다. 프론트 구현·디자인 결정·필요한 API/QA 자원 역할을 나누고, 미확인 개인 담당자를 임의 배정하지 않는다. 선행 Task 결과와 현재 디자인/정책/source/배포를 다시 대조한다.

## 기준과 소유권

- 고정 출발점: frontend `8d3a2ec290aabc4280c5e9f5336cfd36376f7e94`; 현재 backend dev/정책과 관찰 수준은 [날짜별 감사](../audits/2026-11-11.md#cf-11) 및 [JSON](../audits/2026-11-11.json). 근거 파일은 수정 허용 목록이 아니다.
- 소유 소스: [src/data/bids/mock-repository.ts](../../../../src/data/bids/mock-repository.ts) / [src/data/bids/contracts.ts](../../../../src/data/bids/contracts.ts) / [src/components/bids/bid-list-search.tsx](../../../../src/components/bids/bid-list-search.tsx).
- 관련 Task: [QA-01](QA-01.md) / [QA-02](QA-02.md). 기존 QA의 case/통과/차단/승인 예외를 보존한다.
- Figma: [Figma 2048:58606](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2048-58606) / [Figma 2016:57355](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2016-57355).
- 고정 정책: [api/bid-notices.md](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/api/bid-notices.md).

## 착수 전 Implementation Brief / 설계 Gate

- 후보 요구사항/성공 기준: 아래 완료 기준. **아직 구현 미착수**다. UI 승인/실제 계약과 fixture 준비를 확인해 최종 Brief를 제시한다.
- in/out scope·현행 패턴: 위 목적/제외와 관련 Task의 소유 경계를 확인한다. 데이터/DTO/mock 설계 전 [data-access](../../../ai-context/data-access.md)를 읽는다.
- 편집 전 제시: 실제 수정 대상 파일·영향·단계·위험·검증 명령/시나리오·실행 식별자·필요한 데이터 사용/변경·잔존·복구 범위.
- blocking ambiguity는 최대3질문/추천안으로 해소한다. 감사의 추천을 정책 승인으로 취급하지 않고, 낮은 위험 가정만 명시해 진행한다.

## 완료 기준

- [x] 공개 query predicate를 title/noticeNumber/noticeAgencyName/demandAgencyName에 적용하고 공고 번호·기관명·공백/0건 사례를 검증한다.
- [x] 고정 Clock의 시작 전/진행/마감·결과 fixture로 ALL/CLOSING_SOON/RESULT 대상과 정렬/페이지·홈 첫9행의 일치를 검증한다.
- [x] 이 수정이 실제 API의 결함을 뜻하지 않음을 유지한다. 고급 지역 predicate는 DEV-09, 관련 공고는 DEV-61이 소유한다.
- [x] 정상·빈·오류·권한/충돌과 접근성 중 영향 범위를 Gate에서 확정하고 자동/실제 Next 브라우저 검증 및 필요한 실제 QA를 기록한다. 미실행은 차단/이유로 남긴다.
- [x] 현재 package scripts에 맞는 test/lint/build·필요한 Storybook/구성 검사와 diff-check를 통과한다. mock/HTTP 대역/실제 API 결과를 구분한다.
- [x] Documentation Update Check, verifier/ai-review와 검토 뒤 변경의 freshness를 기록한다. 구현만으로 완료하지 않는다.

## 체크포인트 · 결정·인계

| 날짜 | 수행/근거 | 다음 첫 행동 |
| --- | --- | --- |
| 2026-11-11 | QA-17 감사에서 후보 정의·소유권/완료 기준만 추가. 정책 신규 승인·제품 수정·실제 업무 API 실행 없음 | 선행 결과와 감사 CF-11를 읽고 현재 source/계약·검증 자원으로 Brief를 확정 |

- 추천/후보는 승인 아님. 개발자/디자인/서버 결정이 필요한 내용은 결정자·날짜·원문/소유 소스·유지/보류 이유를 기록한다.
- 이 Task의 구현/자동·브라우저/실제 QA·Review Gate는 **미실행/미판정**이다. 감사 문서 검토를 구현 검증으로 대신하지 않는다.
- 자동 수정 시도0/3. 실패 시 원인·최소 수정·재검증을 순서대로 기록한다.
- 문서 갱신 여부와 프로세스/데이터 복구, 미커밋/Git 전달 범위는 실행 시 기록한다. 상태/다음 작업은 WBS에서만 갱신한다.

## 2026-11-11 · POL-29 종료의 다음 후보 인계

- 선정 근거: WBS P0, 선행 QA-17 PR #50 main 반영. 공개 목록/홈 mock의 검색·view 정책 차이를 계정 변경 없이 재현 가능한 하나의 목표로 다룬다. DEV-63의 같은 P0 우선순위를 낮추거나 기존 reset/QA-10 Gate를 면제한 것은 아니다.
- 다음 첫 행동: 이 Task와 감사 CF-11을 읽고, 현행 source/중앙 공개 query 정책·고정 Clock fixture와 자동/실제 Next 브라우저 검증으로 요구사항 Brief를 제시한다. 그 뒤 파일/영향/실행/검증 계획을 확정한다.
- 이번에는 선정/인계 기록만 추가했다. 이 Task의 현행 소스 조사·구현·테스트/브라우저/실제 QA는 시작하지 않았으며 별도 Git 전달도 수행하지 않는다. 현재/다음/상태는 WBS만 관리한다.

<a id="dev-65-brief"></a>

## 2026-11-11 · 실행 승인과 Implementation Brief

- 승인자/근거: 이번 대화의 사용자. DEV-65 하나의 개발부터 검증·리뷰·작은 커밋·push·PR·최종 head CI·조건 충족 시 main 병합/로컬 fast-forward까지 명시 승인했다. 과거 POL-29의 후보 선정만 허용한 승인과 구분한다. 다음 Task는 선정/인계만 하며 실제 업무 API·계정/문서/메일·운영/배포를 포함하지 않는다.
- 시작: clean `main`/`origin/main` = `4ecdfbaedc419fc1a8e9c1110d82708adc695c7b`. fetch 후 같은 SHA, QA-17 PR #50/POL-29 PR #51 main 반영, DEV-65 기존 branch/PR/미커밋 변경 없음 확인. `git merge --ff-only origin/main` 후 `fix/dev-65-public-bid-mock` 생성. 기존 관련 source는 감사 출발점 이후 변경 없음.
- 요구사항/성공 기준: 공개 mock에서 공고명·번호·공고기관·수요기관의 부분 검색과 trim/대소문자/0건을 지원한다. ALL은 시작 전/진행 중만, CLOSING_SOON은 `now < close <= now + 3일`, RESULT는 결과 fixture만 반환한다. 고정 Clock의 시간 경계·정렬·페이지/count·홈 첫9행/상세 링크·빈/오류를 자동 및 실제 Next 브라우저에서 검증한다.
- 범위: 공개 mock의 predicate, 테스트용 Clock에 일관된 Repository별 불변 fixture, 시작 전 fixture, 회귀 테스트, 이 Task/기존 QA의 새 mock 증거·WBS·검토 기록/개발 가이드. DTO·public interface·HTTP·UI 레이아웃 변경은 필요하지 않다.
- 제외: 고급 지역/공동도급 DEV-09, 관련 공고 DEV-61, 개인 reset DEV-63, 추천 목록/시각 배치/정책 변경, 새 라이브러리, 실제 API 통합/업무 mutation·배포. QA-01/02의 기존 실제 통과/차단과 정책/Task별 예외를 그대로 보존한다.
- 확인한 패턴: AGENTS·세 Skill·workflow/task-cycle·base/architecture/plan/harness/ai-failures/data-access, `bids/server.ts`의 홈 `all/page1/size9`, `contracts.ts`, mock/HTTP Repository·검색 컴포넌트, 기존 bids/config/store/architecture 테스트 및 package scripts. 검색 UI는 이미 4개 필드/trim을 안내하므로 수정하지 않는다.
- 정책 소유 근거: 중앙 `bid-notices.md` main과 고정 `c9e50ff591ae18023164e1a94581c611bf1e4f29`의 blob `3d2003083cd948cc4e5be625efe61002cc3b33bc` 동일 확인. backend dev tree `4c328d4a943eaa5dcbb0e8d9596b22389d154988`의 ProgressConditionFactory(blob `944726b90ff962da2efd152ce190fc00a56615cc`)·PublicListQuerySpecFactory(blob `52c79459c6fad263ce23cf58974927f7212de19b`)에서 close의 엄격한 하한/3일 포함 상한과 ID 오름차순 동률 정렬 확인. tree SHA는 commit/실행 process SHA로 주장하지 않는다. RESULT의 추가 낙찰업체 검색·금액 기능은 이번 4필드 범위에 추가하지 않는다.
- Figma/상태 연결: 홈 2016:57355·2036:59249의 9개 카드, 목록 2048:58606의 검색/전체·마감·결과/페이지·빈 결과를 기존 감사/QA에서 연결한다. 이번 변경은 데이터 동작 교정이며 새 화면 예외 승인이나 pixel fidelity PASS를 주장하지 않는다. Figma 원본 재생성/변경 없음.
- 가정: fixture는 Repository 생성 시 주입 Clock으로 한 번 생성하고 조회 때 같은 Clock으로 활성 여부를 판단한다. 공개 서버 Repository는 요청별 생성되므로 실제 시각 기반 합성 데이터 정책을 유지한다. 권한/409는 공개 읽기 predicate에 해당하지 않아 기존 회귀 테스트로 보존하고 새 업무 자원을 요구하지 않는다. blocking ambiguity 없음.

### 편집 전 설계·검증 계획

- 수정 파일: `src/data/bids/mock-repository.ts`, `tests/bids.test.ts`; 본 Task·WBS, `docs/qa/home.md`·`bid-list.md`의 별도 mock 실행 절, `docs/development/repositories.md`, `reviews/DEV-65.md`·`DEV-65-context.md`. 다음 Task는 선정/첫 행동 메모만 갱신한다.
- 단계: 시작 지문 보존 → 검색/시간 경계 회귀 테스트 → mock 최소 수정 → test/lint·API/mock/hybrid build → 격리 all-mock Next에서 홈→목록→상세/reload·검색/0건/초기화·3view/페이지·빈/오류·390/320px/키보드 → 문서 검사/두 리뷰 → 목적별 커밋/PR/최종 CI/병합/동기화.
- 위험/대응: ALL에서 마감9건이 빠지므로 기존 총건수 가정과 홈 순서가 바뀐다. 시간 동률은 기존 숫자 ID 순 fixture/안정 정렬을 유지하고 명시적으로 검사한다. factory snapshot과 조회 Clock 이동으로 마감했지만 결과 없는 사례를 만들고 RESULT 혼입을 막는다. 상세와 목록은 같은 fixture를 쓴다.
- 환경/검증: Node 22.20.0·pnpm11.3.0, `pnpm test`, `pnpm lint`, `MATE_APP_ENV=preview`의 API/mock/hybrid `pnpm build`, `git diff --check`. 설정/Storybook/공유 UI 모델 변경이 없으면 build-storybook은 실행하지 않고 이유를 기록한다. config/운영 guard·storage/account 격리·upload 경계는 전체 기존 계약 테스트로 회귀 확인한다.
- 실행 식별/보존: 저장소 밖 `/Users/jisung/.codex/visualizations/2026/11/11/mate-dev-65/`에 시작 manifest(487파일)·환경파일 없는 소스 복사본·명령/브라우저/검토 증거를 보존한다. `.env`/개인정보/인증 값은 읽거나 복사하지 않는다. 새 합성 탭/소유 프로세스만 종료하고 기존 서비스/데이터를 건드리지 않는다. 실제 API 호출은0건 계획이며 기존 실제 QA 결과와 분리한다.

| 날짜 | 수행/근거 | 다음 첫 행동 |
| --- | --- | --- |
| 2026-11-11 | 사용자 승인·현행 정책/source·clean main/선행 PR 확인, Brief/파일·영향·검증 계획 제시, 작업 branch/시작 지문 확보 | 고정 Clock 검색·시간/view 회귀 테스트와 mock 최소 수정 |
| 2026-11-11 | 수정 전 회귀 테스트6건 실패로 검색/ALL 차이 재현 후 mock predicate/Clock/시작 전 fixture 교정. 전체175 tests/11files·lint·API/mock/hybrid Turbopack build PASS. 계획한 red 확인은 자동 수정 실패로 세지 않으며 실패 후 수정0/3 | 격리 Next 브라우저·문서 검사와 두 리뷰 |


<a id="dev-65-verification"></a>

## 2026-11-11 · 구현·검증 체크포인트

- 런타임은 mock 파일1개만 수정했다. 공개4필드 검색·trim/대소문자·ALL 활성 판정과 closing 엄격 하한/포함 상한, factory별 Clock snapshot·시작 전/개찰 시각이 다른 fixture를 반영했다. HTTP/DTO/계약·UI·계정/저장/지역/관련공고 predicate는 변경하지 않았다.
- Node22.20.0 격리 실행: `pnpm test` **175 tests/11files PASS**(bids16개, 새8개); `pnpm lint` PASS; `MATE_APP_ENV=preview`의 API/mock/hybrid `pnpm build`3건 모두 기본 Turbopack/TypeScript PASS. `test-red.log`의 수정 전6실패는 의도한 재현이며 교정 후 실패0·자동 재수정0/3이다. Storybook/공유 UI·표시 모델/설정 변경이 없어 `pnpm build-storybook`은 실행하지 않았다.
- 자동 사례:4필드/번호 부분/기관/공백·0건, 시작 전·진행·결과·마감, `close=now` 및±1ms/3일 및+1ms, 결과 없는 마감 제외, 3view 정렬/ID 동률·전체 페이지 연결/count·반복 조회·홈 첫9행, 필터 AND·미지원 경계·empty/error. 기존 HTTP 대역/구성·production guard·계정/store/upload 회귀도 전체 테스트에서 PASS이며 실제 API와 구분한다.
- 브라우저: [홈4사례](../../../qa/home.md#dev-65-mock-qa)·[목록6사례](../../../qa/bid-list.md#dev-65-mock-qa). 정적Q&A→홈→목록/검색→분류상세, ALL27행/홈9행·2페이지 중복 없음/reload·검색page1, UI 공사 closing3/result3, 4필드/0건/초기화, empty/error·오류 중 Enter 재시도, default 재시작 복원,390/320px·검색Tab/번호Enter를 관찰했다. 오류 해제 뒤 성공한 재시도 클릭은 미실행이며 재시작/HMR 복원을 그 결과로 세지 않는다.
- 캡처: `browser/`의 JSON/행·URL 증거를 사용한다. fullPage PNG에 연결 중복이 있어 시각 근거에서 제외했고, `viewports/mobile-320-top.png`·`mobile-320-row.png`·`mobile-390-row.png`로 재확인했다.320px 문서폭320/main1/직속header1,390px 문서폭390. 상세의 기존 nested main/관련 공고 차이는 DEV-54/61 범위로 보존한다.
- 네트워크: 브라우저 관측의 외부/업무 API 요청0. 서버 guard는 초기4번의 generic 외부fetch 차단을 기록했으며 당시 host는 남기지 않았다. 상세 재계측은 npm `/-/package/next/dist-tags`의 Next 개발 버전 조회임을 확인했고, 로컬 Next `hot-reloader-shared-utils.js`의 동일 호출과 대조했다. 후속5개 공개 SSR 읽기200·상세 계측의 **업무 외부fetch0**. 초기4건도 모두 업무요청0이었다고 단정하지 않으며, 실제로 나간 외부fetch는 guard로 차단했다. 실제 API 통합 실행0·신규 통과0, 기존 QA 차단/예외 유지.
- 소스 근거 보강: backend dev branch API에서 `4c328d4a943eaa5dcbb0e8d9596b22389d154988` commit을 별도 확인했다. 앞선 tree 응답만으로 추정한 것이 아니며 실행 프로세스 SHA는 여전히 미확인이다. 고정 정책/현재 정책·progress/public-list 소스 본문을 로컬 증거에 보존했다. 배포/Swagger나 업무 응답을 새로 검증한 것은 아니다.
- 복구: 새 검증 탭 모두 종료·기존 탭 유지, 소유 Next 프로세스 group만 종료·4315 listener0 확인. 합성 소스/로그·증거는 저장소 밖 보존. 실제 업무 데이터/서비스 변경 없음.
- Documentation Update Check: 개발 가이드·기존 QA의 새 mock 절·Task/WBS·검토 기록을 갱신한다. base는 package/scripts/버전 변경 없음, architecture/data-access는 구조/public DTO·7그룹 정책 변경 없음, plan은 WBS 진입점/dated 이력 유지, harness는 흐름/역할 변경 없음, ai-failures는 이번 새 반복 제품/하네스 사건 없음으로 미갱신. coverage는 기존79개/DEV-65 소유 연결 그대로이므로 미갱신한다.
- 다음 첫 행동: 문서/ID/의존성/상태·원본/QA 보존 검사와 git diff-check, read-only verifier·6항목 ai-review. Git 전달은 그 Gate 후이며 원격 CI·병합 완료로 미리 세지 않는다.

## 2026-11-11 · 검증/Review Gate와 다음 후보 인계

- [6항목 ai-review/독립 검토](../reviews/DEV-65.md): ai-review PASS, read-only verifier1차 PASS·Blocker/Major/Minor0. verifier가 격리 Node22.20.0의175 tests를 직접 재실행하고 diff-check·소스 일치·로그/브라우저/보존 근거를 확인했다. 상세 서버 차단 요약은 공개 SSR 실행 당시1건/viewport 재시작 뒤 최종2건을 구분해 보완했다. 업무 외부fetch0 판정에는 영향 없다.
- 본 체크리스트/WBS 종료·다음 후보/검토 결과를 반영한 뒤 문서 검사·ai-review를 재수행하고 동일 verifier의 freshness 재검토를 요청한다. 최종 보고서/대상 지문은 로컬 `verifier-final.md`·`final-review-manifest.json`과 최종 보고로 확인하며, 이 예정 문구를 재검토 완료 증거로 세지 않는다.
- 다음 선정: **DEV-63**. WBS에서 남은 P0이고 선행 QA-17 main 반영을 확인했다. reset의 빈 SAVED/source/version과 QA-10/POL-02의 기존 Major·실제 자원 Gate를 먼저 대조할 좁은 목표다. 다른 실제 QA/정책 차단·예외는 그대로다.
- 다음 첫 행동: 새 대화에서 DEV-63·감사 CF-09·POL-02/QA-10을 읽고 현행 소유 source/개발 Swagger와 빈 snapshot/version/재조회 기대를 비교한 Brief 제시. 이번에는 DEV-63 선정/인계만 하며 소스 조사/수정·reset 호출·구현/테스트·Git 전달을 시작하지 않는다.
- Git 전달 준비: 이 Task의 runtime·test·docs를 목적별3커밋으로 나누고 작업 branch push·PR/라벨·실제 최종 head CI/리뷰·merge 조건 확인 후 허용된 merge commit·로컬 main fast-forward를 진행한다. 이전 문서 PR의 CI 예외는 적용하지 않는다. 실제 SHA/PR·CI·병합/동기화 결과는 실행 후 로컬 delivery receipt·PR·최종 보고에 기록한다.

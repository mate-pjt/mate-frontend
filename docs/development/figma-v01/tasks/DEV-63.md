# DEV-63 · 개인 필터 reset의 빈 SAVED 계약 정합성

[상태의 단일 기준: WBS](../README.md) · [운영 규칙](../workflow.md) · [감사 근거](../audits/2026-11-11.md#cf-09)

## 작업 정의

- 유형: 개발. 원본 항목: L11; 2026-11-11 전수 감사 CF-09.
- 선행 작업: [QA-17](QA-17.md). 순위는 WBS가 관리한다.
- 목적: 명시적 초기화는 빈 SAVED를 남겨 회사 기본값의 자동 재적용을 막는다. source/version/재조회까지 정책과 일치해야 한다.
- 현재 차이/영향: QA-10/POL-02가 이미 기록한 차이가 현재도 남아 있다. mock reset과 HTTP 테스트 대역이 EMPTY_DEFAULT를 반환하고 테스트는 필터 값이 비었는지만 확인한다. 새 발견으로 포장하지 않고 수정 담당 DEV를 추가한다.
- 제외: 아래 소유 경계 밖의 기능·새 라이브러리·무관한 리팩터링. 이번 감사에서는 제품 수정/실제 업무 API 변경/commit·push·PR·배포를 수행하지 않았다. 미래 구현의 실행 범위는 착수 Gate에서 확인한다.
- 책임/재개 조건: 실행자는 다음 선정 시 확정한다. 프론트 구현·디자인 결정·필요한 API/QA 자원 역할을 나누고, 미확인 개인 담당자를 임의 배정하지 않는다. 선행 Task 결과와 현재 디자인/정책/source/배포를 다시 대조한다.

## 기준과 소유권

- 고정 출발점: frontend `8d3a2ec290aabc4280c5e9f5336cfd36376f7e94`; 현재 backend dev/정책과 관찰 수준은 [날짜별 감사](../audits/2026-11-11.md#cf-09) 및 [JSON](../audits/2026-11-11.json). 근거 파일은 수정 허용 목록이 아니다.
- 소유 소스: [src/data/personal-filters/mock-repository.ts](../../../../src/data/personal-filters/mock-repository.ts) / [tests/http-contracts.test.ts](../../../../tests/http-contracts.test.ts) / [tests/account-repositories.test.ts](../../../../tests/account-repositories.test.ts).
- 관련 Task: [POL-02](POL-02.md) / [QA-10](QA-10.md) / [DEV-45](DEV-45.md). 기존 QA의 case/통과/차단/승인 예외를 보존한다.
- Figma: [Figma 2048:58606](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2048-58606).
- 고정 정책: [decisions/ADR-0014-separate-personal-bid-filter-from-company-profile.md](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/decisions/ADR-0014-separate-personal-bid-filter-from-company-profile.md).

## 착수 전 Implementation Brief / 설계 Gate

- 후보 요구사항/성공 기준: 아래 완료 기준. **아직 구현 미착수**다. UI 승인/실제 계약과 fixture 준비를 확인해 최종 Brief를 제시한다.
- in/out scope·현행 패턴: 위 목적/제외와 관련 Task의 소유 경계를 확인한다. 데이터/DTO/mock 설계 전 [data-access](../../../ai-context/data-access.md)를 읽는다.
- 편집 전 제시: 실제 수정 대상 파일·영향·단계·위험·검증 명령/시나리오·실행 식별자·필요한 데이터 사용/변경·잔존·복구 범위.
- blocking ambiguity는 최대3질문/추천안으로 해소한다. 감사의 추천을 정책 승인으로 취급하지 않고, 낮은 위험 가정만 명시해 진행한다.

## 완료 기준

- [x] 현행 배포 reset의 source/version/빈 snapshot 계약을 확인하고 mock·HTTP 대역·assertion을 승인 정책과 맞춘다. 배포 문서·현행 source 대조이며 실제 reset wire는 아래 QA-10 차단으로 구분한다.
- [x] 저장 후 초기화→재조회/reload에서 빈 SAVED와 올바른 version이 유지되고 COMPANY_DEFAULT가 재적용되지 않음을 검증한다.
- [x] 409/401/실패 시 기존 snapshot·dirty 상태 보존과 계정 격리를 검증한다. 실제 reset 재현은 QA-10의 자원/사용·복구 조건을 확보한 뒤 별도로 실행한다.
- [x] 정상·빈·오류·권한/충돌과 접근성 중 영향 범위를 Gate에서 확정하고 자동/실제 Next 브라우저 검증 및 필요한 실제 QA를 기록한다. 미실행은 차단/이유로 남긴다.
- [x] 현재 package scripts에 맞는 test/lint/build·필요한 Storybook/구성 검사와 diff-check를 통과한다. mock/HTTP 대역/실제 API 결과를 구분한다.
- [x] Documentation Update Check, verifier/ai-review와 검토 뒤 변경의 freshness를 기록한다. 구현만으로 완료하지 않는다.

## 체크포인트 · 결정·인계

| 날짜 | 수행/근거 | 다음 첫 행동 |
| --- | --- | --- |
| 2026-11-11 | QA-17 감사에서 후보 정의·소유권/완료 기준만 추가. 정책 신규 승인·제품 수정·실제 업무 API 실행 없음 | 선행 결과와 감사 CF-09를 읽고 현재 source/계약·검증 자원으로 Brief를 확정 |

- 추천/후보는 승인 아님. 개발자/디자인/서버 결정이 필요한 내용은 결정자·날짜·원문/소유 소스·유지/보류 이유를 기록한다.
- 이 Task의 구현/자동·브라우저/실제 QA·Review Gate는 **미실행/미판정**이다. 감사 문서 검토를 구현 검증으로 대신하지 않는다.
- 자동 수정 시도0/3. 실패 시 원인·최소 수정·재검증을 순서대로 기록한다.
- 문서 갱신 여부와 프로세스/데이터 복구, 미커밋/Git 전달 범위는 실행 시 기록한다. 상태/다음 작업은 WBS에서만 갱신한다.

## 2026-11-11 · DEV-65 종료의 다음 Gate 인계

- 선정 근거: 남은 WBS P0·선행 QA-17 main 반영. DEV-65의 독립된 공개 mock 교정/검증 뒤 이 Task의 reset 빈 SAVED/source/version을 다음 Gate 후보로 선정했다. QA-10/POL-02의 Major·실제 자원 차단과 기존 예외를 면제하지 않는다.
- 다음 첫 행동: 이 기록과 감사 CF-09·POL-02/QA-10의 승인/재개 조건을 읽고, 현행 소유 source/개발 Swagger의 reset source/version/빈 snapshot 계약과 mock·HTTP 대역·검증 자료를 비교해 Brief를 제시한다. 실제 reset은 disposable 계정/사용·변경·잔존·복구 조건과 승인 확인 후 별도로 수행한다.
- 이번에는 선정/인계 문구만 추가했다. 이 Task의 현행 source 조사·구현/수정·테스트·실제 API/reset·Git 전달은 시작하지 않았으며 현재/다음/상태는 WBS만 관리한다.

<a id="dev-63-brief"></a>

## 2026-11-11 · 실행 Brief와 설계

- 승인: 이번 사용자 요청은 DEV-63 하나의 구현·검증·리뷰·목적별 커밋/push·PR·최종 head CI·조건 충족 시 정상 병합·로컬 main FF를 명시한다. 다음 Task는 선정/인계만이다. DEV-65 당시의 인계와 구분하며 실제 업무 API 변경·서비스/배포·메일·문서 처리는 포함하지 않는다.
- 시작: `fix/dev-63-personal-filter-reset`, main/origin `121ea30e7fa6330c5cef43d39866088ed40ec6b3`, clean. fetch/FF 확인 후 분기. QA-17 `f505421`·DEV-65 `121ea30`는 main 조상이고 같은 Task 브랜치/PR·미커밋 변경은 없었다.
- 요구사항: 명시적 reset을 빈 개인 저장값으로 유지한다. 초기 `EMPTY_DEFAULT(null)`·회사 `COMPANY_DEFAULT(null)`과 저장 `SAVED(version)`를 구분한다.
- 성공 기준: reset의 source/빈값/canImportCompany, 첫 저장 version1·변경 시 증가·동일 빈값 replay 시 version 유지, 재조회/Repository 재생성·브라우저 reload, 회사 기본값 자동 재적용 억제, 409/401/오류의 저장값 보존·계정 격리. UI dirty/목록은 reset 실패·성공 모두 기존 조회 조건을 유지하며 충돌은 최신 snapshot을 재조회한다.
- 소유/패턴: `src/data/personal-filters/{contracts,client,http-repository,mock-repository}.ts`, `features/bid-notice-filters/model.ts`, `components/bids/bid-list-client.tsx`, `data/mock/{runtime,store}.ts`, 관련 두 테스트를 확인했다. UI는 공개 client/계약만 사용한다. HTTP 파서는 서버 source를 생성하지 않는다.
- 수정 대상: mock reset·`tests/account-repositories.test.ts`·`tests/http-contracts.test.ts`; 기록/QA/review/WBS, 사실 정합성에 필요한 ai-context 문서. UI/DTO/endpoint·회사 projection/import·recommended·디자인/새 라이브러리·다른 Task는 제외한다.
- 단계: 읽기 전용 context-audit → mock reset 및 HTTP 대역/회귀 교정 → test/lint/API·mock·hybrid build/실제 Next mock 브라우저 → 문서 검사·Documentation Update Check → 두 리뷰 → 작은 커밋·PR·최종 head CI·정상 merge/main FF.
- 위험/가정: 회사 projection을 새로 구현하지 않고 테스트/격리 브라우저에 합성 COMPANY_DEFAULT를 주입해 reset이 이를 빈 SAVED로 바꾸는 경계만 검증한다. 기존 잘못된 mock 저장공간을 자동 migration/삭제하지 않는다. 실제 서버 응답·실행 SHA·QA 자원은 추정하지 않고 QA-10에 남긴다.
- 검증: Node22.20.0/pnpm11.3.0에서 `pnpm test`, `pnpm lint`, `MATE_APP_ENV=preview MATE_DATA_PROFILE=api|mock|hybrid pnpm build`, `git diff --check`. shared UI/stories 수정이 없어 build-storybook은 대상 아님. 7그룹/guard/storage 기존 suite와 reset source/version·replay·회사/계정·실패·브라우저 320/390px/키보드를 확인한다.
- 미결: 이번 로컬 교정의 blocking ambiguity 없음. 실제 QA는 [QA-10 재개 조건](QA-10.md#qa-10-resume) 미확보로 미실행이며 기존12차단·POL-02 계약/실행 대응 미결·Task별 예외를 보존한다. 고정 정책 ADR-0014 및 2026-11-05 POL-02 사용자 D2에 따르며 새 정책 승인은 만들지 않는다.

### 현행 계약 근거의 구분

- [중앙 ADR-0014](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/decisions/ADR-0014-separate-personal-bid-filter-from-company-profile.md): 빈 snapshot 저장·회사 자동 재적용 금지·동일값 replay 멱등.
- 2026-11-11 조회한 backend dev는 `4c328d4a943eaa5dcbb0e8d9596b22389d154988`. [service](https://github.com/mate-pjt/mate-backend/blob/4c328d4a943eaa5dcbb0e8d9596b22389d154988/mate-api/src/main/java/kr/co/mate/mate_api/application/service/bid/personalfilter/PersonalBidNoticeFilterService.kt)는 reset→empty 저장→SAVED와 현재 회사 유무를 반환한다. [persistence](https://github.com/mate-pjt/mate-backend/blob/4c328d4a943eaa5dcbb0e8d9596b22389d154988/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/bid/personalfilter/PersonalBidNoticeFilterPersistenceAdapter.kt)는 첫 version1·변경+1·같은값 replay version 유지. 이것은 소스 증거이며 서버 실행 대응 증거가 아니다.
- [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs): 이번 비인증 GET200, OpenAPI3.1.0/info.version v1. GET/PUT/current와 POST/reset이 같은 PersonalBidNoticeFilterResponse를 사용한다. source3종·nullable int64 version·canImportCompany·filter 및 배열/nullable 날짜·금액/기본 boolean·enum을 확인했다. required 목록 부재·success/isSuccess 차이를 실제 wire로 단정하거나 DTO 완화하지 않는다. 배포 문서 접근은 실제 reset 응답·업무 API PASS가 아니다.

### 진행 체크포인트

| 날짜 | 수행/근거 | 다음 첫 행동 |
| --- | --- | --- |
| 2026-11-11 / 착수 | 규칙·POL-02/QA-10·CF-09·소유 source·최신 GitHub/Swagger와 Brief 확인. 기존 reset Major 재현 source 확인, 제품 편집 전 설계 제시. 실제 업무 API0건 | mock reset의 SAVED/canImportCompany/replay와 회귀 테스트 교정 |
| 2026-11-11 / 구현·자동 검증 | mock reset을 SAVED·회사 가져오기 가능 여부 보존·빈값 replay version 유지로 교정. 187 tests/lint/API·mock·hybrid build PASS. mirror pnpm 의존성 사전 확인·Turbopack 외부 symlink 제한은 기존 의존성 복제 및 mirror에서만 verify-deps-before-run=false로 해결. 제품 자동 수정0/3, 검증 환경 교정2회 | 실제 Next mock 브라우저의 저장/reset/reload·회사/계정·실패/키보드 확인 후 문서/두 리뷰 |

- 증거 위치: 저장소 밖 `/Users/jisung/.codex/visualizations/2026/11/11/mate-dev-63/`. 현재 source 지문489파일·명령 로그·환경파일 없는 mirror를 보존한다. Node22.20.0/pnpm11.3.0, mirror 의존성은 기존 설치를 복제했으며 새 라이브러리/설치·저장소 설정 변경 없음.


<a id="dev-63-verification"></a>

## 2026-11-11 · 검증과 Documentation Update Check

| 구분 | 명령/실제 사례 | 결과·한계 |
| --- | --- | --- |
| 계약·회귀 | Node22.20.0 `pnpm test` | 11 files/187 tests PASS. reset의 저장/source/version/replay·회사/계정/실패 assertion 추가. config/guard·storage·DTO/architecture 기존 suite 포함 |
| 정적 | `pnpm lint` | PASS |
| 구성별 빌드 | 환경파일 없는 mirror에서 `MATE_APP_ENV=preview MATE_DATA_PROFILE=api/mock/hybrid pnpm --config.verify-deps-before-run=false build` | 3구성 PASS. hybrid overrides는 기존 CI의 company/notifications/notificationSettings=mock. pnpm 옵션은 mirror 전용이며 저장소 설정 변경 없음 |
| 실제 Next mock | [RESET-B01~03](../../../qa/personal-bid-filter.md#dev-63-local-qa) | SAVED2·reload·합성 회사/canImportCompany·계정2 격리·320/390px·대화상자 키보드 PASS. 실제 회사/업무 API 통합 아님 |
| 실제 Next HTTP 대역 | RESET-W01 | 503/409/401에서 snapshot·URL·dirty 저장 버튼·공개 목록 보존 PASS. 401 갱신 후1회 재시도. live 전송0/미정endpoint0 |
| 실제 API | QA-10 PBF-01~12 | 미실행·기존0통과12차단 유지. 문서 GET200/source 확인은 실제 reset wire/실행 SHA 증거 아님 |
| Storybook | 미실행 | shared UI/stories/config 영향 없음 |
| 문서·diff | 링크/anchor·ID/의존성/상태·baseline/기존 QA 보존·Markdown·`git diff --check` | 종료 전 checker·두 리뷰에서 결과/freshness 기록 |

- 제품 자동 수정0/3. 검증 환경 교정2회(pnpm 사전 검사·외부 symlink), HTTP 브라우저 fixture 입력 교정1회(없는 busan 지역→기본URL) 후 계획한 검증이 통과했다. Aside 요청 가로채기 미지원은 Playwright로 전환했다. 최종 실패를 숨기거나 실제 API 결과로 세지 않는다.
- 브라우저 네트워크: Playwright mock은 local183/외부0, mock 서버 fetch0. HTTP 대역 브라우저는 local54/live0/미정endpoint0. HTTP 대역 서버 fetch10은 전부 wire 처리(외부대상5 포함·원래 fetch로 전달0). Aside의 request 이벤트 계수는 지원 증거가 부족해 PASS 근거로 사용하지 않았다.
- 문서 갱신: reset 의미는 data-access, 날짜별 경과는 plan, 출력 재발은 ai-failures, 결과/한계는 QA·Task·review/WBS에 기록한다. package/scripts/구조/새패턴/하네스 변경이 없어 base/architecture/harness 갱신 불필요. 원본 baseline/coverage·QA 이력·POL-02/QA-10 재개 조건은 보존한다.
- [Review Gate 기록](../reviews/DEV-63.md): primary ai-review 여섯 절 수행. read-only verifier와 종료 메타데이터 갱신 후 재검토를 거쳐 최종 판정한다. 실제 API 미실행은 PASS로 전환하지 않는다.
- GitHub branch 원문 출력에 불필요 작성자 메타데이터가 포함됐음을 사용자에게 공개했고 ai-failures에 기록했다. 이후 필요한 필드만 투영하며 실제 값을 재인용하지 않는다. 이미 발생한 출력의 삭제·무효화를 주장하지 않는다.
- 다음 첫 행동: 문서 checker/독립 verifier·종료 WBS/다음 후보 인계와 freshness를 마친 뒤 승인된 작은 커밋·PR/CI·정상 merge/main FF를 수행한다. 다른 Task source 조사/구현·Git 전달은 하지 않는다.


## 2026-11-12 · 종료 검토·정리와 다음 Gate 인계

- 독립 verifier1차 PASS: 원본 요구사항/실제 diff/소유 source·test187개·문서114Task/155의존성·링크378/anchor59·baseline/coverage/QA원문prefix 및 mirror source 지문 일치를 직접 확인했다. 신규 Blocker/Major/Minor 없음. primary ai-review 여섯 절도 PASS이며 실제 API/일반 save replay 전체를 이번 reset 검증으로 보증하지 않는다.
- 체크리스트의 배포 계약 확인은 현행 GitHub source와 현재 OpenAPI schema의 대조 범위다. 실제 reset wire/실행 SHA와 PBF 실제12차단은 QA-10에 남으며, 원래 완료 기준의 ‘실제 reset은 별도 실행’ 경계를 적용한다. 과거 예외를 확대한 새 면제가 아니다.
- 정리: 이번 새 Aside2탭의 mock 공간·Playwright 세션만 정리했다. 검증 서버PID44831/44912에 SIGTERM을 보내 exit143·3163/3164 listener0을 확인했다. 기존 서비스/다른 계정/실제 서버는 변경하지 않았다. 합성 fixture/이미지·비식별 명령 증거만 저장소 밖에 남는다.
- 종료 문구/WBS·다음 인계 추가 뒤 문서 checker·두 리뷰 freshness를 재확인한다. 이후 runtime/test 변경이 없어 앱 검증은 반복하지 않으며 Git 결과는 최종 PR/head·외부 receipt/최종 보고에 기록한다. force push/직접 main push/보호 우회/check 강제 성공은 사용하지 않는다.
- 다음 선정: **DEV-55** 하나. 남은 P0는 QA 자원·약관 정책/취합 선행 차단을 유지한다. DEV-55는 선행 POL-29가 main에 있고, reset 계약 교정 뒤 같은 화면의 배치/시각 목표를 분리해 다룰 수 있는 P1이므로 다음 Gate 후보로 택했다. 선정은 영구 제품 우선순위 변경/실제 업무 API 승인/개발 착수가 아니다.
- 다음 첫 행동: 새 대화에서 DEV-55·POL-29/CF-01의 frame2048:58606·상태별 예외/보류와 현행 도구막대를 대조해 Brief를 확정한다. 이번에는 그 Task의 상세 source/Figma 조사·설계/구현·테스트·Git 전달을 시작하지 않는다. QA-10 실제 차단·POL-02 계약 미결과 기존 Task별 예외는 유지한다.

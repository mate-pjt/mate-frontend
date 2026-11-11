# DEV-55 · 개인 필터 도구막대의 Figma 정합성

[상태의 단일 기준: WBS](../README.md) · [운영 규칙](../workflow.md) · [감사 근거](../audits/2026-11-11.md#cf-01)

## 작업 정의

- 유형: 개발. 원본 항목: L11, L05, C01; 2026-11-11 전수 감사 CF-01.
- 선행 작업: [POL-29](POL-29.md). 순위는 WBS가 관리한다.
- 목적: Figma는 필터 왼쪽의 어두운 내 맞춤 버튼과 구분선을 사용한다. 수동 적용·명시적 저장·초기화는 ADR-0014의 별개 동작이다.
- 현재 차이/영향: 실제 ALL 구현은 내 맞춤·내 맞춤에 저장과 비어 있지 않은 SAVED일 때의 계정 필터 초기화를 오른쪽에 두고 자동 저장되지 않는다는 설명을 둔다. 합성 EMPTY_DEFAULT 화면에서는 내 맞춤 비활성/저장 버튼을 직접 확인했다. 초기화 버튼은 source와 사용자 제공 개발 화면 근거이며 이번 합성 직접 조작/관찰은 아니다. 왼쪽 Figma 버튼은 없고 이 배치 전체의 명시적 시각 예외 승인 근거는 찾지 못했다.
- 제외: 아래 소유 경계 밖의 기능·새 라이브러리·무관한 리팩터링. 이번 감사에서는 제품 수정/실제 업무 API 변경/commit·push·PR·배포를 수행하지 않았다. 미래 구현의 실행 범위는 착수 Gate에서 확인한다.
- 책임/재개 조건: 실행자는 다음 선정 시 확정한다. 프론트 구현·디자인 결정·필요한 API/QA 자원 역할을 나누고, 미확인 개인 담당자를 임의 배정하지 않는다. 선행 Task 결과와 현재 디자인/정책/source/배포를 다시 대조한다.

## 기준과 소유권

- 고정 출발점: frontend `8d3a2ec290aabc4280c5e9f5336cfd36376f7e94`; 현재 backend dev/정책과 관찰 수준은 [날짜별 감사](../audits/2026-11-11.md#cf-01) 및 [JSON](../audits/2026-11-11.json). 근거 파일은 수정 허용 목록이 아니다.
- 소유 소스: [src/components/bids/bid-list-client.tsx](../../../../src/components/bids/bid-list-client.tsx) / [src/components/bids/bid-filter-toolbar.tsx](../../../../src/components/bids/bid-filter-toolbar.tsx).
- 관련 Task: [POL-29](POL-29.md) / [POL-02](POL-02.md) / [QA-10](QA-10.md). 기존 QA의 case/통과/차단/승인 예외를 보존한다.
- Figma: [Figma 2048:58606](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2048-58606).
- 고정 정책: [decisions/ADR-0014-separate-personal-bid-filter-from-company-profile.md](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/decisions/ADR-0014-separate-personal-bid-filter-from-company-profile.md).

## 착수 전 Implementation Brief / 설계 Gate

- 후보 요구사항/성공 기준: 아래 완료 기준. **아직 구현 미착수**다. UI 승인/실제 계약과 fixture 준비를 확인해 최종 Brief를 제시한다.
- in/out scope·현행 패턴: 위 목적/제외와 관련 Task의 소유 경계를 확인한다. 데이터/DTO/mock 설계 전 [data-access](../../../ai-context/data-access.md)를 읽는다.
- 편집 전 제시: 실제 수정 대상 파일·영향·단계·위험·검증 명령/시나리오·실행 식별자·필요한 데이터 사용/변경·잔존·복구 범위.
- blocking ambiguity는 최대3질문/추천안으로 해소한다. 감사의 추천을 정책 승인으로 취급하지 않고, 낮은 위험 가정만 명시해 진행한다.

## 완료 기준

- [x] POL-29의 프레임별 결정에 따라 왼쪽 적용 버튼과 저장/초기화의 위치·우선순위·안내를 확정하고 데스크톱 Figma와 대조한다.
- [x] 저장 전 목록 변경이 계정에 쓰이지 않으며 수동 적용·저장·초기화의 의미와 version/409 처리가 보존됨을 검증한다.
- [x] 비로그인·loading·저장값 없음·COMPANY_DEFAULT·빈 SAVED·dirty·저장 중·오류/충돌·320/390px·키보드 상태를 검증한다. reset 계약 수정은 DEV-63이 소유한다.
- [x] 정상·빈·오류·권한/충돌과 접근성 중 영향 범위를 Gate에서 확정하고 자동/실제 Next 브라우저 검증 및 필요한 실제 QA를 기록한다. 미실행은 차단/이유로 남긴다.
- [x] 현재 package scripts에 맞는 test/lint/build·필요한 Storybook/구성 검사와 diff-check를 통과한다. mock/HTTP 대역/실제 API 결과를 구분한다.
- [x] Documentation Update Check, verifier/ai-review와 검토 뒤 변경의 freshness를 기록한다. 구현만으로 완료하지 않는다.

## 체크포인트 · 결정·인계

| 날짜 | 수행/근거 | 다음 첫 행동 |
| --- | --- | --- |
| 2026-11-11 | QA-17 감사에서 후보 정의·소유권/완료 기준만 추가. 정책 신규 승인·제품 수정·실제 업무 API 실행 없음 | 선행 결과와 감사 CF-01를 읽고 현재 source/계약·검증 자원으로 Brief를 확정 |

- 추천/후보는 승인 아님. 개발자/디자인/서버 결정이 필요한 내용은 결정자·날짜·원문/소유 소스·유지/보류 이유를 기록한다.
- 이 Task의 구현/자동·브라우저/실제 QA·Review Gate는 **미실행/미판정**이다. 감사 문서 검토를 구현 검증으로 대신하지 않는다.
- 자동 수정 시도0/3. 실패 시 원인·최소 수정·재검증을 순서대로 기록한다.
- 문서 갱신 여부와 프로세스/데이터 복구, 미커밋/Git 전달 범위는 실행 시 기록한다. 상태/다음 작업은 WBS에서만 갱신한다.

## 2026-11-11 · POL-29 화면 기준 인계

- 기준: [POL-29 D1](POL-29.md#pol-29-decisions). 왼쪽 어두운 내 맞춤+구분선, 필터 아래 보조행 오른쪽 저장·계정 초기화와 자동저장 아님 안내를 승인했다.
- 현재 표시/활성 조건·수동 적용/저장·expectedVersion/409·계정 격리를 유지한다. [상태/검증표](POL-29.md#pol-29-states)의 EMPTY_DEFAULT/COMPANY_DEFAULT/빈 SAVED·dirty/저장중/오류/401/409·320/390px/키보드를 수용 기준에 포함한다. reset 계약 수정/실제 QA-10은 DEV-63/기존 QA 소유다.
- 이 기록은 후속 기준 전달이며 구현/실제 QA·이 Task의 Gate는 실행하지 않았다.


## 2026-11-12 · DEV-63 종료의 다음 Gate 인계

- 선정 이유: 남은 P0의 실제 QA 자원·약관 정책/취합 선행 차단은 유지한다. 이 Task는 선행 POL-29가 main에 반영된 P1이며, DEV-63의 reset 빈 SAVED/source/version 교정 후 같은 개인 필터 화면의 배치/시각 목표를 독립적으로 확인할 수 있어 다음 Gate 하나로 선정했다. 영구적인 제품 우선순위 변경이나 다른 P1의 승인/차단 해소를 뜻하지 않는다.
- 다음 첫 행동: 새 대화에서 이 기록·POL-29/CF-01의 frame2048:58606 및 상태별 승인/예외·보류와 현재 도구막대를 대조해 수정 파일·성공 기준·검증을 담은 Brief를 제시한다. DEV-63 reset 계약·QA-10 실제12차단·POL-02 계약 미결·기존 Task별 예외를 유지한다. 실제 mutation은 자원/사용·변경·잔존·복구 승인 확인 전 실행하지 않는다.
- 이번 변경은 선정/인계 문구뿐이다. 이 Task의 상세 source/Figma 조사·설계/구현·테스트·실제 API·Git 전달을 시작하지 않았으며 현재/다음/상태는 WBS만 소유한다.

<a id="dev-55-brief"></a>

## 2026-11-12 · 실행 승인과 Implementation Brief

- 시작: clean `main` / `8d7d656de6e55190fc4320677462da136538f7fe`. `git fetch origin` 후 로컬/원격 동일 SHA, 선행 POL-29와 DEV-63 PR #53의 main 반영을 확인했다. 같은 Task 브랜치/미커밋 변경은 없으며 `fix/dev-55-personal-filter-toolbar`를 생성했다.
- 이번 사용자 요청은 DEV-55 하나의 개발·검증·리뷰·목적별 커밋·push·PR·최종 head CI 확인·조건 충족 시 정상 main 병합·로컬 main fast-forward를 명시적으로 승인했다. 이전 선정/인계만 기록과 이번 실행 승인을 구분한다. 실제 업무 API·메일·문서 처리·운영/배포와 다른 Task 실행은 포함하지 않는다. 과거 PR #49의 CI 예외를 적용하지 않는다.
- 요구사항: POL-29 D1(결정자 사용자, 2026-11-11)에 따라 ALL의 수동 적용 버튼을 필터 맨 왼쪽의 어두운 버튼+구분선으로 정렬하고, 저장·계정 초기화를 아래 보조행 오른쪽에 배치한다. 자동 저장 아님 안내와 source별 안내를 함께 보존한다.
- 성공 기준: Figma 2048:58606의 하위 2098:65429와 desktop 버튼 높이36px·반경8px·간격8px·아이콘16px·어두운 grayscale-800을 대조한다. 기존 표시/활성 조건, 수동 URL 적용과 명시적 계정 저장/reset, expectedVersion/409·계정 격리를 유지하고 상태별·모바일·키보드 회귀를 검증한다.
- 범위: `bid-list-client.tsx`, `bid-filter-toolbar.tsx`, Figma fit 아이콘과 DEV-55 QA/작업/검토·WBS·필요한 문서 사실 동기화. 제외: Repository/DTO/공급원·reset 계약·고급 편집·별도 맞춤 목록·다른 화면 변경, 새 라이브러리, 기존 QA/정책 차단 해소.
- 확인한 파일/패턴: AGENTS·workflow/task-cycle·3 skills·base/plan/architecture/data-access/harness/관련 ai-failures, POL-29 D1/추가 상태표·CF-01·DEV-63 검증·QA-10, 소유 source·공유 Button·filter popover·DESIGN/globals 토큰과 실제 package scripts. 전체 과거 대화/무관 Task의 상세 구현은 읽지 않았다.
- 설계: toolbar에 선행 동작 slot을 추가하고 기존 조건의 적용 버튼/구분선을 넣는다. 계정 보조행은 안내 다음 저장/reset 순서로 두고 작은 화면에서는 같은 DOM 순서로 줄바꿈한다. 기존 mutation/URL 핸들러는 바꾸지 않는다. 공유 Button과 기존 토큰을 재사용하며 fit은 Figma 원본 벡터를 로컬 정적 아이콘으로 보존한다.
- 가정/위험: 모바일 전용 원본이 없어 POL-29의 320/390px 확장 기준(순서·줄바꿈·넘침·접근성)을 적용한다. 비어 있지 않은 저장값의 적용 후 버튼 숨김, 빈/동일 SAVED 저장 금지와 reset 노출 조건은 기존 그대로다. normal Figma 기준을 disabled/loading 상태 전체의 pixel 승인으로 확대하지 않는다. blocking ambiguity 없음.
- 검증 계획: 환경파일 없는 mirror에서 Node22.20.0/pnpm11.3.0의 `pnpm test`, `pnpm lint`, `pnpm build`, 공유 Button 소비/아이콘 배치 영향의 `pnpm build-storybook`, `git diff --check`. 실제 Next 전체 mock 및 HTTP 대역에서 비로그인/auth·filter loading, EMPTY_DEFAULT/COMPANY_DEFAULT/빈 SAVED·dirty/동일값/저장중·실패/401/409·새로고침/계정·desktop/390/320px·키보드를 확인한다. 기존 API/mock/hybrid 계약/guard suite를 실행하며 공급원 코드는 수정하지 않는다.
- 실제 QA: QA-10의 disposable 계정·현재 frontend/backend 실행 대응·시작/종료 source/version·변경/잔존/복구·안전한 오류 자원은 미확보다. 실제 업무 요청0건 계획이며 PBF-01~12 실제0통과12차단·POL-02 미결을 유지한다. 로컬 UI/HTTP 대역 PASS를 실제 통합 PASS로 세지 않는다.
- 첫 행동: 위 좁은 UI 배치와 fit 아이콘을 구현한 뒤 자동 검사·실제 Next 상태별 검증을 진행한다. 자동 수정0/3. 증거는 저장소 밖 `/Users/jisung/.codex/visualizations/2026/11/12/mate-dev-55/`에 보존한다.


## 2026-11-12 · 구현·자동/브라우저 중간 체크포인트

- toolbar 선행 slot·어두운 내 맞춤/구분선·아래 보조행 저장/reset·항상 보이는 자동저장 아님 안내를 구현했다. 공유 Button을 소비하고 Figma fit 벡터 원본(853bytes, intrinsic13.3333px)을16px 배경 slot 중앙에 원래 크기로 표시한다. 임시 Figma URL은 runtime에 없다. mutation/URL 핸들러·Repository/DTO/패키지는 그대로다.
- 환경파일 없는 mirror에서 Node22.20.0/pnpm11.3.0의187 tests·lint·mock build·build-storybook PASS. 추가 API 구성 build도 PASS. 두 번째 mirror 의존성 복제가 끝나기 전의 build 한 번은 `next: command not found`로 미실행됐고 복제 완료 확인 뒤 같은 명령을 재실행해 통과했다. 제품 자동 수정0/3, 검증 환경 조치1회다.
- Aside 실제 Next: 비로그인 로그인 복귀, EMPTY_DEFAULT, 목록 변경/수동 적용의 계정 쓰기 없음, SAVED 저장/동일값 금지/dirty, reset 빈 SAVED/version2 및 reload, 두 합성 계정 격리, desktop36px/8px/16px·320/390px 줄바꿈, Enter/Space·Tab/Shift+Tab 순환·Escape 초점 복귀를 관찰했다. 저장/reset 동작 후 snapshot을 확인했고 실제 API QA로 세지 않는다.
- Aside는 요청 가로채기 미지원으로 외부 요청 차단/건수 검증에 Playwright를 보완 사용한다. 임의 페이지/실제 계정은 열지 않는다. 현재 로컬 대역 서버와 Next API 구성에서 COMPANY_DEFAULT·loading·busy·오류/401/409를 검증 중이다. 실제 업무 API 요청은0건이다.
- 다음 첫 행동: 로컬 HTTP 대역 상태별/요청 건수 검증, 문서 검사·Documentation Update Check와 두 Review Gate를 완료한다. 다음 Task 실행은 하지 않는다.

<a id="dev-55-verification"></a>

## 2026-11-12 · 검증과 Documentation Update Check

- [로컬 QA 상태별 표/대표 캡처](../../../qa/personal-bid-filter.md#dev-55-local-qa):187 tests/11files·lint·API/mock/hybrid build·build-storybook PASS. 실제 Next mock6흐름과 로컬 HTTP 대역13상태+회사 적용/403 추가2흐름·desktop/390/320px·키보드/계정 격리·외부 요청0을 확인했다. source3파일은 두 mirror와 byte 일치하며 새 라이브러리/데이터 계약 변경은 없다.
- runtime은 왼쪽 버튼/구분선과 보조행·공유 Button 소비, toolbar 선행 slot, 원본 fit 벡터뿐이다. 기존 source별 표시/활성 조건·수동 URL 적용·save/reset·expectedVersion/409 핸들러는 그대로다. 자동저장 아님 안내는 인증된 계정의 보조행에서 source와 관계없이 유지한다.
- 제품 자동 수정0/3, 환경 조치2회: 의존성 복제 완료 전 build를 완료 확인 뒤 재실행했다. 1차 mock 관측과 후속 구성 build의 동일 artifact 사용 시점이 겹쳐 마지막 mock 재빌드/새 프로세스로 고정한 뒤6흐름·네트워크/캡처를 다시 검증했다. 초기 관측을 최종 증거로 세지 않는다.
- 실제 QA-10의12차단·POL-02 계약/실행 대응 미결 유지. 이번 업무 API·메일/업로드·운영/배포 실행0건. 현재 배포 Swagger나 backend ref를 새로 조사할 계약 공백/수정은 없었으며 로컬 대역을 실제 wire 응답으로 주장하지 않는다.
- Documentation Update Check: DESIGN의 ALL 도구막대 배치·plan의 날짜별 진입점, WBS/이 Task·기존 QA에 append·검토 기록/대표 PNG를 갱신한다. package/scripts/폴더·DTO·공급원/데이터 의미·하네스 규칙 변경이 없어 base/architecture/data-access/harness 미갱신. 새 반복 제품/보안 실패가 없어 ai-failures도 미갱신하고 단발 환경 교정은 이 기록/QA에 남긴다. baseline/coverage·원본79개/114Task·기존 의존성·QA 원문은 보존 검사한다.
- 다음 첫 행동: 문서 링크/anchor·상태/의존성·보존·Markdown/diff 검사, read-only verifier와6절 ai-review, 종료 메타데이터 freshness를 마친 뒤 승인된 Git 전달을 수행한다. 상태는 WBS에서만 관리한다.

- 정리: 소유한 Aside/Playwright mock 공간을 UI 초기화하고 검증 세션을 닫았다. Next PID57927/56133·대역 PID56778을 SIGTERM 종료하고3155/3156/4155 listener0을 확인했다. 기존 서비스/실제 계정/백엔드는 변경하지 않았다. 합성 fixture·비식별 로그·PNG만 저장소 밖에 보존한다.

## 2026-11-12 · 1차 Review Gate의 Major와 교정 계획

- 1차 read-only verifier **FAIL**: manifest `954c1f9b3c1f554760abdd0f852f34104188b7a162fb6060a6671a97d4796b8c`에서 적용 버튼을 rootRef 내부로 옮겨 팝오버 바깥 pointerdown 닫기가 차단되는 Major1을 발견했다.187 tests/문서 검사는 통과했지만 팝오버 draft→내 맞춤 조합이 기존 브라우저 검사에 없었다. 앞선 primary ai-review의 문제 없음 판정은 이 조합에 불충분했으며 최종 PASS로 사용하지 않는다.
- 실제 Next mock 재현: SAVED 공사 조건 준비→지역 팝오버의 draft 서울 선택(미저장)→내 맞춤 적용 후 URL 지역은 없는데 팝오버에 서울 draft가 남는 것을 확인했다. 증거 `popover-before-result.txt`/`popover-regression-before.png`.
- 최소 수정 계획: 선행 action의 render callback에 toolbar의 close 함수를 제공하고, 내 맞춤의 클릭/Enter/Space 모두 팝오버를 먼저 닫은 뒤 기존 수동 적용 함수를 호출한다. 상태·데이터 의미/저장 핸들러는 유지한다. 해당 pointer/keyboard·재개방 draft 회귀를 실제 Next에서 검사하고 자동/구성별 build·기존 주요 UI/HTTP 조합과 두 리뷰를 다시 수행한다.
- 제품 자동 수정 시도1/3. 상태는 WBS에서 진행으로 되돌리고 교정·재검증 후 리뷰한다. 독립 verifier의 첫 FAIL/근거는 보존한다.

- 교정 후 자동 검증:187 tests·lint·API/mock/hybrid build·build-storybook 재실행 PASS. 실제 Next의 pointer/Enter/Space3입력 모두 팝오버 닫힘·재개방 시 미저장 draft 폐기·계정 저장값 불변 PASS(`popover-after-result.txt`). 기존 mock6흐름/HTTP13+2흐름을 교정된 artifact에서 재검증 중이다. render callback의 close→기존 apply 순서만 추가했으며 데이터/정책 변경은 없다.

- 교정 후 전체 재검증: mock6흐름(219로컬/업무API0/외부0/pageerror0), HTTP13+2흐름(최종 대역64·외부0), desktop/320/390px와 dialog 키보드·계정 격리 모두 다시 PASS. 세 입력의 팝오버 회귀3건도 PASS다. 검증3파일은 두 mirror와 byte 일치한다. 새 예방 규칙은 ai-failures에 기록했다. 기존 QA-10 실제12차단은 유지한다.
- 재검증 프로세스/공간 정리: mock UI 초기화·소유 Playwright 세션 닫기, PID63616/63779/63692 SIGTERM·3155/3156/4155 listener0과 프로세스 exit143을 확인했다. 이후 검토/종료 문서와 Git 전달만 남는다.


## 2026-11-12 · 교정 후 Review Gate와 종료·다음 Gate 인계

- 같은 read-only verifier의 교정 후 재검토 **PASS**: manifest `bc4416ee1ebf4d558e14808262c5710dbe32fc038bb7c2def4220d05fa6b5e27`, 미해결 Blocker/Major/Minor0.187 tests·문서 checker/diff-check를 직접 실행하고 교정 source·빌드/Storybook·mock/HTTP·새3입력·접근성/계정/캡처를 확인했다. 첫 FAIL/Major1과 primary 검토 누락은 앞선 기록에 보존한다.
- primary6절 ai-review를 교정 후 diff/근거로 다시 수행했다. Documentation Update Check와 본 체크리스트의 로컬 UI 범위를 충족한다. 실제 API 통합 PASS·QA-10의12차단 해소나 POL-02 전체 완료로 세지 않는다. runtime 최종 지문은 저장소 밖 source-manifest-final.json(284파일)의 `a8e12e139c12d096b47d5f8b2ad47ea6e51192558911130c1f39d18056409f81`에서 확인한다.
- 종료 metadata(체크리스트/WBS/두 리뷰 결과·다음 인계)는 위 재검토 뒤 변경이다. 문서 checker·primary6절 리뷰를 다시 수행하고 동일 verifier의 최종 freshness를 확인한다. 이후 runtime 변경이 없으므로 앱 검사를 반복하지 않고 Git 결과는 외부 receipt/최종 PR/head·최종 보고에 기록한다.
- Git 전달: 이번 사용자 명시 승인에 따라 UI/자산·QA/화면 기준·작업/검토/인계·실패 예방 문서를 목적별 작은 한국어 Conventional Commits로 나누고 push·PR/라벨·최종 head CI/리뷰 조건·허용 merge·로컬 main fast-forward를 확인한다. force push/직접 main push/보호 우회/check 강제 성공은 사용하지 않는다. 과거 PR49 예외는 적용하지 않는다.
- 다음 선정은 **POL-30 · 관련 공고의 기준 공고 상태 정책 충돌 해소** 하나다. 남은 P0는 실제 QA 자원·약관 정책/취합 선행 차단을 유지한다. POL-30은 WBS P1·QA-17 선행 완료이며 DEV-61의 정책 선행이므로, 같은 원문 내 기준/후보 공고 상태 충돌을 제품 수정 전에 구조화하는 다음 Gate로 선정했다. 다른 P1의 영구 우선순위/승인 변경은 아니다.
- 다음 첫 행동: 새 대화에서 POL-30·CF-23의 고정 이력과 최신 중앙 정책 §6/§10/§11·backend dev의 RelatedBidNoticeQueryService/RelationPolicy·개발 Swagger를 대조해 기준 공고/후보의 상태표·남은 질문과 수정 문서/검증을 담은 Brief를 제시한다. 중앙 저장소 수정·실제 업무 요청은 별도 권한/범위 확인 대상이다. **이번 대화에서는 POL-30 상세 source/계약 조사·정책 선택/원문 수정·제품 구현/QA/Git 전달을 시작하지 않았다.**

<a id="dev-55-pr54-ci-exception"></a>

## 2026-11-12 · PR #54의 외부 CI 차단과 후속 승인

- 전달 체크포인트: 목적별4커밋을 push하고 [PR #54](https://github.com/mate-pjt/mate-frontend/pull/54)를 생성했다. 최초 head `cd9c38adfce0c922b67842941182d05126e8eb39`, base/main `8d7d656de6e55190fc4320677462da136538f7fe`, clean 작업트리다. push/PR의 checks·API/mock/hybrid build, Storybook 게시와 Vercel은 SUCCESS였다.
- 차단 근거: [Chromatic workflow](https://github.com/mate-pjt/mate-frontend/actions/runs/43120560736)의 `Billed snapshot limit reached`, [build115](https://www.chromatic.com/build?appId=6a3dd824dd80645d61f69b82&number=115)의 `UI Tests`/`UI Review`가 각각 testing/review 재개를 위한 plan 갱신 안내와 PENDING이다. 게시 SUCCESS를 두 검사 실행/PASS로 세지 않았다. 당시 이번 PR의 예외가 없어 main 병합을 보류했으며 과거 PR49 예외를 적용하지 않았다.
- 결정자/날짜/원문: 2026-11-12 사용자 답변 **‘이번 PR만 예외 병합 (추천)’**. 질문은 PR #54(head cd9c38a)의 두 Chromatic 미실행 검사에 한해 예외를 기록하고 정상 merge하며, 제품 코드 고정·예외 기록 문서 변경만 허용하고 보호 우회/check 강제 성공을 하지 않는 범위였다.
- 확정 범위: 본 PR의 위 두 검사만 미실행 예외로 명시한다. 제품 코드/기존 검증 산출물은 그대로 두고 WBS·이 Task·리뷰3문서에 승인 근거만 추가한다. 승인 기록 커밋을 포함한 **실제 최종 PR head**의 나머지 CI·리뷰/미해결 thread·최신 main과 저장소의 정상 merge 허용 조건을 다시 확인한 뒤 작은 커밋 이력을 보존해 병합한다. 다른 검사 실패/미실행·보호 규칙 우회·타 PR/Task·제품 QA 면제를 승인한 것은 아니다.
- 재개 계획: 문서 링크/anchor·ID/상태/의존성·원문/제품 코드 보존·diff-check 및 primary6절 ai-review/read-only verifier freshness → 목적별 문서 커밋/push·PR 본문 반영 → 새 최종 head CI/승인 범위 대조 → 정상 merge/main fast-forward·SHA/clean 확인. 문서만 바뀌므로 앱 test/lint/build·브라우저를 반복하지 않으며 기존 교정 후 근거를 유지한다.
- 남은 경계: 실제 QA-10의12차단·POL-02 미결, 다음 POL-30 선정/인계·미착수는 그대로다. 실제 최종 head/check·merge/main SHA/작업트리 결과는 외부 delivery receipt·PR·최종 보고에 기록해 검토한 파일을 다시 바꾸지 않는다.

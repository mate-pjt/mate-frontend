# DEV-59 · 회사 가입 mock의 평가·인증 근거 계약 정합성

[상태의 단일 기준: WBS](../README.md) · [운영 규칙](../workflow.md) · [감사 근거](../audits/2026-11-11.md#cf-05)

## 작업 정의

- 유형: 개발. 원본 항목: O06, O07, O08; 2026-11-11 전수 감사 CF-05.
- 선행 작업: [QA-17](QA-17.md). 순위는 WBS가 관리한다.
- 목적: 서버는 대표면허/인증을 YES/NO/UNKNOWN으로 구분하고 확인하지 못한 평가연도는 null로 보존한다. 출처/스냅샷과 인증 종류별 상태가 구별된다.
- 현재 차이/영향: mock은 현재 연도를 평가연도로 생성하고 대표면허 ACTIVE 및 빈 certifications를 반환한다. 프론트 validator는 임의 문자열을 허용한다. 실제 가입 화면은 해당 값을 정보 없음으로 보일 수 있어 fixture가 정상/미확인을 검증하지 못한다.
- 제외: 아래 소유 경계 밖의 기능·새 라이브러리·무관한 리팩터링. 이번 감사에서는 제품 수정/실제 업무 API 변경/commit·push·PR·배포를 수행하지 않았다. 미래 구현의 실행 범위는 착수 Gate에서 확인한다.
- 책임/재개 조건: 실행자는 다음 선정 시 확정한다. 프론트 구현·디자인 결정·필요한 API/QA 자원 역할을 나누고, 미확인 개인 담당자를 임의 배정하지 않는다. 선행 Task 결과와 현재 디자인/정책/source/배포를 다시 대조한다.

## 기준과 소유권

- 고정 출발점: frontend `8d3a2ec290aabc4280c5e9f5336cfd36376f7e94`; 현재 backend dev/정책과 관찰 수준은 [날짜별 감사](../audits/2026-11-11.md#cf-05) 및 [JSON](../audits/2026-11-11.json). 근거 파일은 수정 허용 목록이 아니다.
- 소유 소스: [src/data/company/mock-repository.ts](../../../../src/data/company/mock-repository.ts) / [src/data/company/contracts.ts](../../../../src/data/company/contracts.ts) / [src/components/auth/company-registration.tsx](../../../../src/components/auth/company-registration.tsx).
- 관련 Task: [QA-06](QA-06.md) / [QA-07](QA-07.md) / [POL-06](POL-06.md). 기존 QA의 case/통과/차단/승인 예외를 보존한다.
- Figma: [Figma 3140:123224](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-123224).
- 고정 정책: [domain/company/overview-and-profile.md](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/company/overview-and-profile.md) / [domain/company/registration-and-verification.md](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/company/registration-and-verification.md).

## 착수 전 Implementation Brief / 설계 Gate

- 후보 요구사항/성공 기준: 아래 완료 기준. **아직 구현 미착수**다. UI 승인/실제 계약과 fixture 준비를 확인해 최종 Brief를 제시한다.
- in/out scope·현행 패턴: 위 목적/제외와 관련 Task의 소유 경계를 확인한다. 데이터/DTO/mock 설계 전 [data-access](../../../ai-context/data-access.md)를 읽는다.
- 편집 전 제시: 실제 수정 대상 파일·영향·단계·위험·검증 명령/시나리오·실행 식별자·필요한 데이터 사용/변경·잔존·복구 범위.
- blocking ambiguity는 최대3질문/추천안으로 해소한다. 감사의 추천을 정책 승인으로 취급하지 않고, 낮은 위험 가정만 명시해 진행한다.

## 완료 기준

- [x] 고정 backend 응답/정책과 DTO·validator·mock 생성값을 대조해 YES/NO/UNKNOWN·연도 null·인증3종·출처/스냅샷을 보존한다.
- [x] 평가연도를 알 수 없으면 현재 연도를 합성하지 않으며 금액 있음/연도 없음과 인증별 YES/NO/UNKNOWN 혼합 사례를 별도로 검증한다.
- [x] 저장 mock schema/version 변경 시 기존 탭 상태 복구와 계정 격리를 검증한다. 실제 문서 업로드/번호 등록 QA는 기존 차단을 유지한다.
- [x] 정상·빈·오류·권한/충돌과 접근성 중 영향 범위를 Gate에서 확정하고 자동/실제 Next 브라우저 검증 및 필요한 실제 QA를 기록한다. 미실행은 차단/이유로 남긴다.
- [x] 현재 package scripts에 맞는 test/lint/build·필요한 Storybook/구성 검사와 diff-check를 통과한다. mock/HTTP 대역/실제 API 결과를 구분한다.
- [x] Documentation Update Check, verifier/ai-review와 검토 뒤 변경의 freshness를 기록한다. 구현만으로 완료하지 않는다.

## 체크포인트 · 결정·인계

| 날짜 | 수행/근거 | 다음 첫 행동 |
| --- | --- | --- |
| 2026-11-11 | QA-17 감사에서 후보 정의·소유권/완료 기준만 추가. 정책 신규 승인·제품 수정·실제 업무 API 실행 없음 | 선행 결과와 감사 CF-05를 읽고 현재 source/계약·검증 자원으로 Brief를 확정 |

- 추천/후보는 승인 아님. 개발자/디자인/서버 결정이 필요한 내용은 결정자·날짜·원문/소유 소스·유지/보류 이유를 기록한다.
- 2026-11-11 후보 정의 당시 이 Task의 구현/자동·브라우저/실제 QA·Review Gate는 **미실행/미판정**이었다. 감사 문서 검토를 구현 검증으로 대신하지 않으며 후속 실행은 아래 날짜별 근거를 따른다.
- 자동 수정 시도0/3. 실패 시 원인·최소 수정·재검증을 순서대로 기록한다.
- 문서 갱신 여부와 프로세스/데이터 복구, 미커밋/Git 전달 범위는 실행 시 기록한다. 상태/다음 작업은 WBS에서만 갱신한다.

<a id="dev-59-dev-61-handoff"></a>

## 2026-11-12 · DEV-61 이후 선정/인계

- 이 단락은 다음 작업의 후보 선정/인계다. DEV-59의 요구사항 Gate·현재 source/서버 상세 조사·구현·검증·Git 전달은 시작하지 않았다. 현재/다음/상태는 WBS만 관리한다.
- 선정 근거: 남은 P0 QA/약관/취합·이전 P1 정책/신원·문구/실제 자원 차단은 유지된다. QA-17이 main에 반영돼 선행이 해소된 P1 DEV-59/60/62 중 WBS 기본 순서가 앞선 DEV-59를 택했다. 영구 우선순위 변경이나 기존 실제 QA/정책 차단 해소를 뜻하지 않는다.
- 다음 첫 행동: 새 대화에서 이 기록·감사 CF-05·data-access와 최신 main/현재 소유 계약·정책을 선별 대조한다. YES/NO/UNKNOWN·평가연도null·인증3종/출처·snapshot과 mock/validator·저장 복구의 수정 대상/범위/검증을 Brief로 제시한다. 과거 감사·기존 구현을 현재 계약/승인이나 실제 통합 PASS로 대신하지 않는다.
- 실행/검증 자원·필요한 정책/API 공백은 DEV-59의 새 Gate에서 확인한다. 이번 DEV-61 Git/추가 교정·Chromatic 한도 승인은 DEV-59의 구현/실제 업무/API·Git 전달 승인으로 확대하지 않는다. 기존 QA-06/07·POL-06과 Task별 예외를 보존한다.

<a id="dev-59-brief"></a>

## 2026-11-12 · 착수 Brief / 설계

- 시작: 로컬/원격 main `80445aa5e06583595f7431dea80fd836aeb2ed34`, 깨끗한 작업트리. QA-17/직전 DEV-61의 main 반영 확인 후 fast-forward 확인·`codex/dev-59-company-evidence` 생성. 기존 DEV-59 브랜치/미커밋 변경 없음. 실행자 Codex, 미확인 개인 담당 배정 없음.
- 승인자/날짜/근거: 2026-11-12 이번 대화 사용자. DEV-59 하나의 개발·검증·read-only verifier/ai-review·목적별 커밋/push·PR/CI·정상 main 병합/로컬 동기화를 명시 승인했다. 이번 PR의 Chromatic 월간 한도만 예외다. 과거 Task의 승인과 구분하며 실제 업무 API/메일/문서 처리·운영/배포는 포함하지 않는다.
- 요구사항: 번호 조회와 문서 제안의 가입 프로필이 현행 서버의 tri-state·연도 null·인증3종·출처/자료 기준일 계약을 보존하도록 mock/타입/저장 검증을 교정한다.
- 성공 기준: 금액 있음/연도 없음, YES/NO/UNKNOWN 혼합, 자료 없음, 두 가입 경로, 새로고침·구형 탭·계정 격리/멱등 replay·손상 데이터 경계를 자동/실제 Next에서 확인한다. 알려진 구형 형식의 합성 연도를 제거하며 새 형식의 잘못된 enum/출처/날짜는 수용하지 않는다.
- 범위: `src/data/company/contracts.ts`, `mock-repository.ts`, `src/data/config.ts`의 명시적 빈 근거 시나리오, 관련 테스트와 개발/QA·Task/WBS/Review 문서. Company Repository 공개 진입/7공급원·hybrid 제약·운영 guard·공통 namespace는 유지한다. 내부 모델과 wire가 같으므로 불필요한 mapper/중복 DTO를 만들지 않는다.
- 제외: DEV-60 복수 업종, DEV-08 대시보드, POL-21 직접 편집, 신규 endpoint/정책/라이브러리, UI 구조/asset 재구현, 실제 번호 등록·업로드/OCR·메일/운영/배포. QA-06 AUTH-14/15 2차단, QA-07 AUTH-09~13 5차단 및 관련 미실행/예외는 보존한다.
- 확인한 패턴: `data-access.md`의 회사 Directory/Onboarding/Document·sessionStorage 계정 공간, 기존 validator/idempotency/request cache, `CompanyEvidencePanel`의 Y/N/정보 없음/평가연도 null 표시, 현재 package scripts와 Node22.20.0 pin. 호스트 기본 Node26 대신 설치된 Node22를 명시 사용한다.
- 근거: 중앙 정책 main `c9e50ff591ae18023164e1a94581c611bf1e4f29`의 회사 개요/등록 정책, backend dev `4c328d4a943eaa5dcbb0e8d9596b22389d154988`의 `SignupCompanyProfileResult/Response`·Factory·CapabilitySummaryPolicy. 응답은 출처4종·정확 인증3종을 가지며 Factory는 평가연도 null을 반환한다. 개발 Swagger 비인증 GET200/OpenAPI3.1.0·v1의 관련 schema를 별도 확인했다. Swagger string enum 부재를 정책 공백으로 오인하지 않고 소유 enum을 따른다. source/배포문서/실행 process SHA/업무 응답은 별개이며 마지막 두 근거는 미확보다.
- Figma: 3140:123224의 디자인 context/스크린샷에서 평가금액+면허·인증4카드/Y/N 확인. 디자인의 예시 `25년`을 실제 연도 근거로 쓰지 않는다. 기존 정보 없음/출처 안내는 현행 데이터 계약의 기능 차이이며 전체 화면 예외 승인이나 pixel 정합성 PASS를 새로 주장하지 않는다. 이번 화면 구조 변경 없음.
- 단계: 타입/fixture·빈 시나리오 → 회사 영역의 알려진 구형 프로필 변환/엄격 검증 → 자동 계약/HTTP 대역 → 세 구성 build·Storybook → 실제 Next mock/hybrid 브라우저 → 문서 검사/두 리뷰 → 작은 커밋/PR/CI/병합/동기화.
- 검증: Node22.20.0/pnpm11.3.0 `pnpm test`, `pnpm lint`, preview API/mock/hybrid `pnpm build`, `pnpm build-storybook`, `git diff --check`; 설정/운영 guard·account/storage·HTTP fetch 대역·브라우저 desktop/390/320px·Tab/Enter·정상/빈/오류·권한/충돌을 영향 범위로 확인한다. 소스/패키지만 복사한 격리 디렉터리에서 `.env*`를 읽지 않고 실행한다.
- 가정/위험: fixture는 합성이고 고정 자료 기준일은 평가연도가 아니다. 전체 mock schema를 바꾸지 않고 회사 영역의 근거 버전만 추가한다. 구형 연결/문서/proposal·cached connection의 알려진 형식만 변환해 진행/ID/멱등 키를 보존한다. 잘못된 새 데이터는 기존 정책대로 해당 계정 company 공간만 초기화한다.
- 실제 QA: 이번 요구는 mock/계약 교정이며 기존 QA-06/07의 실제 자원·변경/잔존/복구·실행 대응 차단을 유지한다. 실제 업무 API 실행0건, 기존 차단을 면제하거나 실서버 PASS로 세지 않는다. 로컬 합성 저장/서버/브라우저만 사용하고 종료 시 소유 프로세스/탭을 정리한다.
- 다음 첫 행동: 위 범위의 타입·fixture·복원 코드를 편집한다. 자동 수정0/3. 상태는 WBS만 관리한다.

### 중간 체크포인트 · 자동 계약/환경

- 타입/생성값/구형 회사 영역 변환·빈 근거 시나리오와29개 자동 사례 작성. Node22.20.0 `pnpm test` 14파일284건·lint PASS, Storybook PASS(기존 큰 chunk 경고). 제품 자동 수정0/3.
- 격리 사본의 pnpm 의존성 사전검사가 설치를 시도했으나 비TTY에서 중단됐다. 의존성 설치/저장소 설정 변경 없이 현재 pnpm 코드에서 확인한 `pnpm_config_verify_deps_before_run=false`로 자동 설치만 억제했다. 초기 앱 build는 외부 node_modules symlink를 Turbopack이 거부했다. 격리 사본 안으로 APFS 복제해 재실행한다. 환경 교정2건을 제품 PASS로 세지 않으며 관찰 오류 발췌는 외부 `environment-errors.md`, 이후 정상 실행은 별도 로그에 보존한다.
- 다음: API/mock/hybrid build와 실제 Next·HTTP 대역/브라우저, 문서 갱신·Review Gate. 실제 업무 API 실행0건/기존 QA 차단 보존.

### 중간 체크포인트 · 빌드/브라우저

- API/mock/hybrid preview `pnpm build` 모두 PASS, hybrid 산출물의 production `pnpm start`는 기대한 mock guard로 exit1. .env 없는 격리 사본의 변경 source/테스트4파일이 작업트리와 동일함을 확인했다.
- 실제 Next production/mock에서 번호·합성 문서 제안의 혼합 인증/자료일, 평가연도 null·5억, 새로고침, 구형 탭→UNKNOWN 변환, 두 계정 격리/복귀, 1440/390/320px·가로 넘침0·Tab/Enter를 확인했다. full-mock 번호32/문서31 resource의 외부0; empty dev도 외부0. UI/asset 구조 변경 없음, 실제 OCR/업무 API 실행으로 세지 않는다.
- `evidence-empty` dev에서 금액·면허/인증4개 모두 정보 없음/확인된 자료 없음 표시를 확인했다. 다음은 hybrid 회사 mock/auth HTTP 대역과 회사 HTTP 오류/복구 UI, 문서 검사/두 리뷰. 자동 제품 수정0/3.

<a id="dev-59-verification"></a>

## 2026-11-12 · 검증 / Documentation Update Check

- 구현: 가입용 enum/정확 인증3종과 모든 source/nullable metadata를 타입에 보존했다. 내부/wire shape가 같아 기존 HTTP passthrough를 유지한다. validator는 회사 mock 저장 경계이며 HTTP 응답에 새 runtime 검증을 추가했다고 주장하지 않는다. 기본 합성5억/연도null·Y/Y/N/UNKNOWN와 evidence-empty·경로별 identity 출처를 제공한다.
- 저장: global MockStore v1/fingerprint는 유지한다. 회사 영역 근거 버전1에서만 알려진 구형 기본 fixture를 변환한다. 구형 합성 연도/ACTIVE는 null/UNKNOWN이며 새 근거가 없는 출처/자료일을 만들지 않는다. 연결·업로드/문서 version·proposal/revision·멱등 replay·다른 계정/도메인·실제 문서키를 보존한다. 잘못된 새 enum/출처/날짜는 기존 정책대로 해당 계정 company 공간만 초기화한다.

| 검증 | 명령/실제 결과 |
| --- | --- |
| 자동 계약·저장·설정·구조 | Node22.20.0 `pnpm test`: 14파일284건 PASS, 신규29건 포함 |
| 정적 검사 | `pnpm lint`: PASS |
| 세 구성 빌드 | preview `pnpm build`: API/mock/hybrid(CI와 동일 overrides) 각각 PASS |
| 공유 모델/카탈로그 | `pnpm build-storybook`: PASS, 큰 chunk 기존 경고 |
| 운영 guard | hybrid mock 산출물/production `pnpm start`: exit1·기대한 거부 PASS |
| 실제 Next | production/mock·empty dev·hybrid auth HTTP 대역·API HTTP 대역: [CEV-01~16](../../../qa/auth.md#dev-59-local-qa) 모두 로컬 PASS |
| 실제 API/서버 테스트 | 미실행. source/Swagger 조사와 업무 API 통합을 구분하며 기존 QA-06/07 차단 유지 |
| 문서·diff | 링크/anchor·ID/의존/상태·79원본/114Task·기준선/감사/기존 QA/무관 범위·Markdown·`git diff --check`, 최종 metadata 이후 재검사 |

- 외부 원문: `/Users/jisung/.codex/visualizations/2026/11/12/mate-dev-59`의 test/lint/build-api/build-mock/build-hybrid/build-storybook/guard·서버 로그, browser16case·AX/PNG·wire 로그. full mock browser 외부0/전체 hybrid 비loopback0. 서버 임의 외부 egress 전체를 계측했다고 주장하지 않는다. source/build 사본4파일 일치 확인.
- Document Update Check: architecture/data-access(프로필·회사영역 변환), 개발 Repository 가이드(시나리오/복원), auth QA(로컬 사례·기존 실서버 차단 분리), plan(날짜별 근거 연결), Task/WBS·context/review 기록 갱신. package/scripts·Node pin/공통 harness·새 반복 제품 실패가 없어 base/harness/ai-failures 변경 불필요. baseline/감사/coverage·기존 QA prefix/타Task의 정책/예외는 유지한다.
- [context-audit](../reviews/DEV-59-context.md) PASS. 사용자 승인/정책/source는 착수 Brief와 같으며 신규 정책/전체 화면 예외 승인 없음. 제품 자동 수정0/3·격리 환경 교정2건을 구분한다.
- 프로세스/복구: 소유 Next/로컬 대역에 종료 신호를 보내고 종료했다. synthetic 탭 재고0, 소유 포트3158/3159/3169 리스너0을 최종 확인했다. 실제 서버 데이터 변경/원복 대상 없음. 증거 파일/격리 산출물만 보존한다.
- 다음 첫 행동: 문서 검사와 read-only verifier/ai-review. Gate 완료 전 다음 기능을 시작하지 않는다. Git 전달은 승인됐지만 실제 PR/head·CI/병합/동기화 receipt를 별도로 확인한다.

### Review Gate 진입 체크포인트

- 문서 검사 PASS: 변경13파일 허용 범위, 링크429/anchor91, 79원본·114Task/155의존성, 보호34파일/기존 auth QA prefix, source/검증 사본4파일 일치와 diff-check. 모든 계획 검증을 완료했고 실제 API 미실행/QA-06/07 차단은 유지한다.
- read-only verifier와 primary ai-review의 대상은 현재 diff와 외부 원문이다. 다음 첫 행동은 두 리뷰의 실제 결과 확인/기록이며 그 후 WBS 종료·DEV-60 선정/인계 metadata를 다시 검토한다. DEV-60은 후보 정의/선행만 읽었고 조사/Brief/구현을 시작하지 않았다.

### 1차 Review Gate / 종료·인계 체크포인트

- read-only `/root/dev59_verifier`의 정식 결과 PASS: Blocker/Major/Minor 없음. pinned backend Result/Factory와 실제 소스/테스트·문서/AX·대역 로그를 직접 확인했고 Node22 테스트 실제14파일284건을 재실행했다. 검토13파일 manifest digest `9f878c6f958f04315362738fc857c7630857ffbf6a15674630aa00271812fd19`.
- primary ai-review도 원본 요구사항/실제 diff·검증/문서/범위·7공급원/저장/보안 경계를 대조해 PASS, 여섯 섹션을 [Review](../reviews/DEV-59.md)에 기록했다. context-audit PASS와 별개다.
- 로컬 구현/검증 단위의 완료 기준을 충족했다. 실제 API 통합/실행 SHA 대응은 미실행/미확보이고 QA-06/07 차단과 재개 조건은 유지한다. Git 전달/main 반영·배포 완료로 아직 세지 않는다.
- 다음 선정은 DEV-60 하나다. P1·QA-17 완료/main 반영·기본 표 순서를 근거로 삼고 남은 P0와 기존 P1 외부 차단을 유지한다. 다음 첫 행동은 새 대화의 DEV-60/CF-06·data-access/현재 기본정보 계약을 통한 Brief다. 이번에는 Task 정의/선행만 확인하고 조사/Brief/구현을 시작하지 않았다. [인계](DEV-60.md#dev-60-dev-59-handoff).
- 이번 종료 checklist/WBS·다음 인계/Review metadata 뒤 두 리뷰 freshness를 다시 확인한 후 목적별 커밋·PR/CI·정상 merge/main ff를 수행한다. 소유 탭/리스너0·실제 데이터 원복 대상 없음.

### 종료 metadata 재검토

- verifier targeted freshness와 primary ai-review 재검토 PASS. runtime/test4파일 불변, 문서14파일·링크447/anchor97·79원본/114Task/155의존·보호34/QA prefix·DEV-59 완료/DEV-60 준비/활성0을 재확인했다. 미해결 Blocker/Major/Minor 없음.
- 이후 검토 요약·PR 번호/URL/실제 Git/CI 관찰값만 추가하면 source/범위/정책/검증 사례/다음 행동 불변을 전제로 독립 전체 리뷰 반복을 생략할 수 있다는 verifier 조건을 받았다. primary는 문서/diff·AI Review 영향 검사를 수행한다.
- 다음 첫 행동은 승인된 목적별 commit/push·템플릿 PR/라벨·최종 head CI/정상 merge/main ff다. 실제 결과는 후속 Git 체크포인트 및 외부 `git-delivery.json`/PR/최종 보고를 따른다. 다음 DEV-60은 선정/인계만이며 미착수다.

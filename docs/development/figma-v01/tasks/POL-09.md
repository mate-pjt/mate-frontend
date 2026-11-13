# POL-09 · 원문 본문·추가 일자 제공 범위 결정

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 정책 결정
- 원본 항목: D10
- 선행 작업: [DOC-001](DOC-001.md)
- 목적/범위: 원문 링크 대체 허용, 현장설명 일시·수집 기준일의 필요성과 실제 제공 계약을 결정한다. 추천: 없는 값을 합성하지 말고 제공 가능한 필드만 표시한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### D10 · 지시사항/원문 본문·현장설명일·수집 기준일
- 기준선: UI **대체/일부 없음**, 동작 **미제공 부분 있음**, 데이터 **프론트 모델 없음**. 검증: 코드 대조.
- 남은 점: 공고 원문은 링크로 대체; 현장설명은 필요 여부만 표시. 상세 일자·원문 본문 계약과 표시 정책 확인
- Figma: [2113:19107](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2113-19107) / [2181:69353](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2181-69353)
- 소유 소스/기존 기록: [src/types/bid-detail.ts:22](../../../../src/types/bid-detail.ts)、[src/components/bids/bid-detail-content.tsx:146](../../../../src/components/bids/bid-detail-content.tsx)、[src/components/bids/bid-detail-content.tsx:200](../../../../src/components/bids/bid-detail-content.tsx)、[docs/qa/bid-detail.md:73](../../../../docs/qa/bid-detail.md)

## 완료 기준

- [x] 원문/지시사항·현장설명일/수집시각의 공급원과 기준을 기록한다
- [x] 이미 구현된 공동수급 협정 마감 등을 새 누락으로 중복 집계하지 않는다
- [x] 링크 대체 유지 또는 필드 확장의 승인 결과를 남긴다
- [x] 원문/소유 소스·버전·결정자·시각·선택/보류 이유를 기록한다. 추천안은 승인으로 간주하지 않는다.
- [x] 근거 있는 기존 승인 또는 필요한 개발자 결정을 확보하고, 후속 개발의 범위/완료 기준/차단을 갱신한다. 정책 작업도 Review Gate를 수행한다.

## 착수 전 Implementation Brief / 설계 Gate

이 기록은 작업 후보 정의다. DOC-001 외의 작업은 아직 실행하거나 설계 승인을 받은 상태가 아니다. 착수 시 아래를 현재 소스 기준으로 채우고 편집 전에 제시한다.

- 요구사항/성공 기준 확정: 미작성.
- in/out scope와 확인한 기존 패턴: 위 후보 범위를 검토해 확정.
- 수정 대상 파일·영향·구현 단계: 미작성. 위 근거는 수정 허용 파일 목록이 아니다.
- 검증 계획/실제 명령·환경·계정/변경/복구 승인: 미작성.
- blocking ambiguity/정책 근거: 미작성. 미결이면 설계 전 질문 최대 3개와 추천안을 제시.
- 가정/제외·낮은 위험의 선택: 미작성. API/DTO/데이터 흐름 설계 전 data-access.md 필독.

## 결정 기록

| 날짜 | 질문/선택지와 추천 | 결정·근거·승인자/원문 | 영향 |
| --- | --- | --- | --- |
| 2026-10-27 | 작업 후보 분해 | 정책·API·제품 동작 신규 승인 없음 | 착수 시 Gate 수행 |

## 체크포인트 · 재개 메모

| 시각/실행자 | 환경·branch/HEAD·작업트리 | 수행/결과·근거 | 다음 행동·차단/재개 조건 |
| --- | --- | --- | --- |
| 2026-10-27 / 문서화 | feature/my-company-overview / f84af24b5f9d + 기존 미커밋 변경 | 보고서에서 작업 정의만 생성. 구현/실제 QA 미실행 | 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다. |

## 검증·리뷰·인계 기록

| 구분 | 실행 명령/사례·환경 | 결과 | 증거/미실행 이유 |
| --- | --- | --- | --- |
| 이번 작업 | 미실행 | 미판정 | 기준선의 과거 결과와 구분 |

- 자동 수정 시도: 0/3. 실패 시 명령·오류·원인·최소 수정·재검증 결과를 추가한다.
- Documentation Update Check: 착수 후 판단. base/architecture/data-access/plan/harness/ai-failures 중 영향 문서와 갱신/미갱신 이유를 기록.
- Review Gate: 미실행. verifier와 ai-review의 결과/대상 diff·후속 변경 재검토 여부를 기록.
- 커밋/PR: 없음. 추후 커밋할 때 하나의 목적·영어 type/한국어 메시지, 런타임/테스트/문서는 가능한 별도 커밋.
- 다음 작업 인계: WBS에서 선택. 이 단위의 필수 검증 PASS 전에 다른 기능으로 자동 전환하지 않는다.

<a id="pol-09-pol-08-handoff"></a>

## 2026-11-13 · POL-08 종료 후 선정/인계

- 사용자 요청7항에 따라 다음 Task 하나로 선정/인계만 했다. DOC-001 완료·P2 표 순서의 독립 정책 Gate가 근거다. 남은 P0 실제 QA/약관·취합 선행, P1 정책/신원·문구/실제 자원, DEV-09 차단·DEV-12 별도 재개 Gate/보류와 DEV-13 전용 backend 계약 선행을 보존한다. 현재/다음/상태는 WBS만 관리한다.
- 다음 첫 행동: 새 대화에서 최신 main/작업트리와 이 정의/완료 기준·원본 D10/연결된 소유 정책·기존 QA를 읽고, 원문 링크/본문·현장설명 일시/수집 기준일의 현행 GitHub source와 개발 Swagger·Figma 상태별 근거를 대조한다. 이미 제공되는 공동수급 협정 마감 등을 새 누락으로 중복 집계하지 않는다. 정책 Brief와 실제 미결만 먼저 제시한다.
- 이번에는 정의/선행/완료 기준만 읽었다. POL-09 전용 상세 source/API/Figma 조사·정책 결정·Brief/설계·구현·검증·실제 업무/운영·POL-09 Git 전달은 시작하지 않았다. POL-08의 Git/Chromatic 예외나 제한된 공개 GET 조사·정책 결정을 다음 Task의 정책/실제 QA 승인으로 확대하지 않는다.

<a id="pol-09-investigation"></a>

## 2026-11-13 · 요구사항 Gate 조사 체크포인트

- 실행자 Codex, 09:15 KST. 시작 clean `main`/`origin/main`=`3fb4742370d83a578b241037e872ec5a1d24a7ae`. fetch/fast-forward 확인 후 `docs/pol-09-original-notice-policy` 생성. 같은 Task 브랜치/dirty 없음. DOC-001과 직전 POL-08 PR #65의 main 반영을 확인했다. 별도 detached worktree는 수정하지 않는다.
- 이번 사용자 승인: POL-09 하나의 정책 조사·결정·문서 검증·read-only verifier/ai-review·목적별 commit/push·PR·실제 최종 head의 CI/정상 main 병합·로컬 main 동기화. 이번 Chromatic 월간 한도만 예외다. 제품/다른 Task 구현·backend/중앙 문서 편집·업무 API 변경·외부 메시지·수집/DB/서비스 운영·배포는 범위 밖이다.
- 적용: AGENTS·feature-workflow·관련 ai-context/data-access·workflow·고정 D10/선행 DOC-001·기존 QA/CF-10·CF-20. 현재/다음/상태는 WBS만 관리한다. 원본79/114Task/155의존성·기준선/감사/QA 이력·기존 정책/승인 예외를 보존한다.
- [고정 출처](../reviews/POL-09-sources.json): 중앙 main `c9e50ff`, backend dev `befe434`를 현재 원격 ref로 확인했다. 원문은 URL만, `originalNotice.available=false`; 공개 상세에는 현장설명 필요 여부만 있고 일시/긴 자격사항 본문/전체 공고 수집일이 없다. 항목별 `lastAttemptedAt`/`lastSuccessfulAt`/`sourceVersionAt`는 서로 다른 의미이며 전체 수집일로 대체할 근거가 없다. raw 저장/수집 가능 여부를 공개 schema 부재로 단정하지 않는다.
- 개발 OpenAPI GET200·3.1.0/`v1` 문서만 조사했다. source commit·배포 문서·실행 process SHA/배포 대응 미확인·업무 응답 미실행을 구분한다. 로그인/인증 조작·업무 GET/mutation·외부 원문 이동0건, 소유 Swagger 탭 닫기 완료다.
- Figma 공사 로그인 전 `2113:19107`/인증회사 로그인 후 `2181:69353`의 metadata에서 자격사항 본문·현장설명일(`-` 예시)·수집일을 확인했다. 픽셀/모든 상태 검토는 하지 않았다. 현재 소유 UI는 원문 링크·현장설명 필요 여부와 일반 수집 안내이며 공동수급 협정 마감은 이미 제공/표시 중이다.
- 계약 관찰: Kotlin/프론트 DTO의 `isSiteExplanationRequired`와 배포 OpenAPI의 `siteExplanationRequired` 표기가 다르다. 실제 wire는 미확인이다. 현재 필요 여부 표시의 실제 통합 PASS나 새 확정 결함으로 단정하지 않고 후속 QA/계약 확인 항목으로 보존한다.
- 편집 전 제시한 계획: 이 Task 조사/정책 기록·DEV-14 후속 기준·WBS/coverage·상세 QA의 추가 기록·출처/Context Audit/리뷰 문서만 변경한다. 실행 코드/설정/패키지 영향0, 문서 링크/anchor·ID/의존성/활성 상태·원본/prefix 보존·Markdown/비밀값 패턴·diff-check 및 두 리뷰를 검증한다. 공통 문서 갱신 필요는 별도 점검한다.
- **정책 결정 대기:** 사용자에게 현행 링크/필요 여부 유지·세 항목에 한정한 두 frame 차이 승인·DEV-14 보류(추천)와 추가 필드 계약 선행을 질문했다. 추천은 승인되지 않았으며 답변 전 최종 Brief/설계·정책 v1/후속 상태를 확정하지 않는다. 다음 첫 행동은 사용자 답변을 반영한 최종 Brief/설계 제시다.

### 사용자 설명 요청과 화면 근거 보완

- 사용자 원문: **‘이게 무슨 말이야? 예시 혹은 Figma 링크로 예시를 들어서 쉽고 자세히 설명해줘.’** 정책 선택 답변이 아니다. 추천안은 계속 미승인이다.
- Figma 원문 링크와 자격사항/현장설명일/데이터 수집안내의 부분 이미지를 통해 현재 제공 방식과 추가 시 필요한 데이터를 설명했다. 데이터 수집안내에는 **기준일**과 **수집일**이 별도로 있다. 둘의 정의/공급 계약을 확인하지 않은 채 게시일·항목별 성공시각을 복사하지 않는다. 참조번호는 기존 별도 표시이며 새 누락으로 세지 않는다.
- 부분 screenshot 노드: `2181:70267` 자격사항, `2154:10878` 현장설명일, `2175:69728` 수집안내. 로컬 이미지는 `/Users/jisung/.codex/visualizations/2026/11/13/01a1d23f-862a-7583-9564-e50815c2bafb/pol-09/`에 있고 임시 asset URL은 저장소에 보존하지 않는다. 이 부분 시각 확인을 모든 frame/pixel 전수 PASS로 확대하지 않는다.
- screenshot 도구 응답을 선별하지 않고 출력해 임시 asset 주소가 포함됐다. 사용자에게 알렸고 이후 이미지 파일만 전달한다. 과거 출력이 삭제됐다고 주장하지 않으며 문서/PR에는 주소를 복사하지 않는다. 조사3파일 문서 검사 PASS:79원본/114Task/155의존성·361상대 링크·보호10범위. 최종 정책/Review Gate는 아직 수행하지 않았다.

<a id="pol-09-brief"></a>

## 2026-11-13 · 확정 Brief / 설계

- 요구사항/유형: POL-09 정책 Task 하나. 원문 자격사항/지시사항 본문·현장설명 일시·기준일/수집일의 추가 제공 방향과 backend 계약 선행·DEV-14 재개 기준을 문서화한다. 제품 구현은 하지 않는다.
- 사용자 결정 원문: **‘추가 정보 제공 추진·백엔드 계약부터 정리’**. 결정자 사용자, 결정일2026-11-13 KST. 최초 추천인 현행 유지·두 frame 차이 승인·DEV-14 보류는 **미채택**이다. 설명 요청은 정책 승인으로 세지 않았다.
- 성공 기준: 정보별 현재 공급원/미제공·필요 계약과 결측/공개/시각 의미, 정책 근거·버전/결정자, 후속 범위/완료 기준/차단을 연결한다. 이미 제공하는 공동수급 마감을 누락으로 중복 집계하지 않는다. 문서 검증·Documentation Update Check·두 리뷰를 통과한다. 실제 backend 계약/제품 통합 확보와 구분한다.
- in scope: POL-09·DEV-14의 후속 기준, WBS/coverage·기존 상세 QA의 추가 기록, source/context/review, plan의 날짜별 진입점·실제 출력 실패 기록, 다음 Task 하나의 선정/인계, 명시 승인된 Git 전달.
- out scope: src/public/tests·package/lockfile/설정/라이브러리, backend endpoint/DTO·수집/DB·중앙 저장소 편집·외부 요청 발송·실제 업무 API/인증/파일/메일·운영/배포·DEV-14/다음 Task 실행. Figma 수정이나 상세의 다른 시각/접근성 예외 승인은 없다.
- 확인한 패턴: AGENTS·세 Skill/ai-context/data-access·workflow·DOC-001·원본 D10/CF-10·CF-20·QA-03, `BidDetail`·detail DTO/mapper/server·`BidDetailContent`, 고정 중앙2문서/backend5소스, 개발 OpenAPI와 Figma 두 공사 상태/관련3부분 screenshot. 본문/날짜를 다른 문자열/시각으로 합성하지 않는 기존 정책을 유지한다.
- 수정 파일/영향: `tasks/{POL-09,DEV-14}.md`, WBS `README.md`, `coverage.md`, `docs/qa/bid-detail.md`, `docs/ai-context/{plan,ai-failures}.md`, `reviews/POL-09{,-context}.md`/출처 JSON. 종료 후 선정한 Task 기록에는 인계만 추가한다. 실행 코드/패키지/빌드 영향0이다.
- 단계: 결정/계약 요구표 → DEV-14 재개/QA 기준 → 문서 검사·Context Audit/문서 갱신 체크 → read-only verifier/ai-review → WBS 종료·다음 하나 인계·freshness 재검토 → 목적별 commit/push·PR/최종 CI·정상 merge·로컬 main fast-forward.
- 위험/대응: 공개 schema 부재와 raw 저장 부재를 혼동하지 않는다. section별 수집 시각·게시일·응답/현재 시각을 전체 기준일/수집일로 대체하지 않는다. 원문 형식/안전한 표시 책임·scope·version/실행 대응·결측/오류 계약을 확보하기 전에 가상의 wire/endpoint를 확정하지 않는다.
- 가정/미결: 현재 원문 링크는 추가 정보 도입 전에도 기존 제공을 유지한다. 본문 형식·최종 일자 정의/원천 매핑·필드명/권한/오류·배포 시점은 backend 계약 소유 역할이 제시할 후속 조건이다. 담당 개인/요청 티켓·발송/접수/납기는 미확인이며 Codex가 외부 요청을 보내지 않는다.
- 검증: 실제 package8scripts/pnpm11.3.0을 확인했다. Markdown/출처 JSON만 바꾸므로 링크/anchor·79원본/114Task/155의존성/순환/활성 상태·baseline/감사/기존 QA prefix·범위/Markdown·비밀값 패턴·`git diff --check`를 검사한다. 영향 없는 로컬 앱 test/lint/build/Storybook·제품 브라우저/mock/HTTP 대역은 미실행한다. OpenAPI 문서 조회/부분 Figma 확인은 계약 조사이고 실제 업무/통합 PASS가 아니다.
- blocking ambiguity: 이번 **추가 제공 추진·계약 선행이라는 정책 방향**은 해소됐다. 실제 제공 계약의 공백은 아래 표와 DEV-14 재개 Gate로 남는다. 이를 확정·구현·통합 완료로 표시하지 않는다.

<a id="pol-09-contract"></a>

## 정책 v1 · 추가 정보 제공과 계약 선행

| 정보 | 현재 소유 근거/제공 | 이번 결정과 후속 계약 확인 | 금지하는 대체/한계 |
| --- | --- | --- | --- |
| 자격사항/지시사항 본문 | 중앙 `docs/api/bid-notices.md`는 긴 자연어 자격사항 미제공을 명시. backend `OriginalNotice.available=false`, URL만 제공. UI는 원문 링크 | 추가 제공을 추진한다. 어떤 원문 부분을 제공하는지·원천/버전·plain text/HTML 등 형식·길이/줄바꿈/더보기·안전한 표시 책임·공개/누락/오류를 계약으로 확인 | 구조화 업종/지역·다른 문자열·첨부 추출/자동 요약·디자인 예시를 원문 본문으로 만들지 않음. raw HTML 렌더링/iframe·원문 스크래핑 구현은 승인하지 않음 |
| 원문 링크 | `header.noticeUrl`→`sourceUrl`, http(s) 검증·새 탭/rel 제공. `originalNotice.noticeUrl`도 계약에 있음 | 기존 원문 이동을 유지한다. 본문 제공 이후의 원문 출처 링크와 두 URL 관계도 실제 계약에서 확인 | `available=false`를 링크 자체가 없다는 뜻으로 해석하지 않음. 임의 URL 생성·원문 URL에서 본문 역추출 없음 |
| 현장설명 일시 | 공개 상세는 필요 여부 boolean만 있고 일정 schema에 해당 일시가 없음 | 일시 추가 제공을 추진한다. 원천 날짜/시각·정밀도/시간대·필요 여부와 일시의 독립성·미정/미제공 의미를 확인 | boolean으로 날짜 추정, 다른 마감일 대체, 날짜 null을 현장설명 불필요로 단정하지 않음 |
| 기준일 | Figma `데이터 수집안내`의 별도 날짜. 현재 공개 상세/프론트에 대응 의미/필드 없음 | 추가 제공을 추진한다. **무엇의 기준일인지**(대상 자료/업무 기준)와 산출/원천·공고/분류 범위·date/date-time·결측 의미를 backend 소유자가 실제 계약으로 제시해야 함 | 게시일/최초 공개일/차수/현재 날짜를 임의로 복사하지 않음. 이번 문서가 특정 산출식을 확정한 것은 아님 |
| 수집일 | 전체 공고의 대표 수집일 없음. section에는 시도·성공·원천 버전 시각이 서로 별도 제공됨 | 추가 제공을 추진한다. 전체/section별 의미·최초/최근 시도/성공 중 무엇인지·부분실패/재수집 시 갱신·정밀도/시간대를 계약으로 정의 | 여러 section의 min/max·조회시각·게시일을 대표 수집일로 만들지 않음. 마지막 시도/성공/원천 version 시각을 동의어로 쓰지 않음 |
| 기존 공동수급 협정 마감 등 | `jointSupply.agreementDeadlineAt`→KST mapper→기존 UI, 게시/자격등록/입찰 시작·마감/개찰도 기존 제공 | 보존·회귀 확인 대상이다. 새 누락이나 DEV-14의 신규 기능으로 중복 집계하지 않음 | 본문·현장설명일·기준일·수집일의 대체 자료로 사용하지 않음 |

### Figma 상태와 정책의 관계

- 공사 로그인 전 [2113:19107](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2113-19107), 인증회사 로그인 후 [2181:69353](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2181-69353) 모두 자격사항 본문·현장설명일·기준일/수집일의 목표 근거다. 현재의 링크/필요 여부/일반 안내와 다르며 사용자 선택은 추가 제공 추진이다.
- **현재 차이를 승인 예외로 닫지 않는다.** 계약과 DEV-14 구현/검증 전에는 해당 목표가 미충족임을 보존한다. 이 정책은 상세 폭/단위 위치/분류 선택·중첩 main 등 CF-10/CF-20·DEV-54/64의 별도 범위에 대한 예외 승인이 아니다.
- 이번 확인은 위 두 상태의 metadata/관련3부분 시각에 한정한다. 물품/용역·모든 로그인/알림/오류 상태·반응형/키보드/픽셀은 새로 검증하지 않았다.

<a id="pol-09-backend-contract"></a>

### backend 계약 요청 명세 · 실계약 미확보·Codex 외부 발송 없음

아래는 저장소 안의 요구 항목이다. 실제 API path/필드명·형식을 만들어 승인하거나 backend에 요청을 발송한 기록이 아니다. 제공 역할은 backend 공개 상세/수집 계약 소유자, 정책 결정자는 사용자, 검증 역할은 frontend/QA이며 개인 담당자는 미확정이다.

| 확인 항목 | 필요한 산출물/증거 | DEV-14 재개 전 확인 |
| --- | --- | --- |
| 공급 가능성과 원천 | 본문 범위·현장설명 일시·기준일·수집일 각각의 원천/변환·저장/수집 여부·제공 가능/불가 이유 | 원문 자료가 존재한다고 추정하지 않고 실제 제공 범위/의미 확보 |
| 공개 계약 | 공개 상세 확장 또는 별도 조회의 실제 path/query·공고/분류/차수 scope·권한·성공/빈/null/미제공/오류 schema | 내부 관리자/raw-source API 우회 없음. 기존 URL/하위 section과의 일관성 |
| 본문 표시 | 형식/문자 인코딩·줄바꿈/긴 본문·HTML 여부/정제 책임·링크/임베드·본문/원문 URL 관계 | 안전한 렌더링 방식/길이 UX는 실제 계약과 DEV-14 자체 Gate에서 확정 |
| 날짜 의미 | 기준일과 수집일의 개별 정의·산출 근거, 시도/성공/source version·부분실패/재수집, 현장설명 일시의 독립성 | ISO offset/시간대·date-only 정밀도·결측/미정 의미를 구분. KST 표시로 없는 시각을 생성하지 않음 |
| 실제 wire 정합성 | 필요 여부 `isSiteExplanationRequired`(Kotlin/프론트)와 `siteExplanationRequired`(OpenAPI)의 실제 응답 키/타입 | 승인된 비식별 fixture에서 true/false/결측을 대조. 현재는 실제 응답 미확인 |
| 제공 버전과 실행 대응 | backend source commit·배포 OpenAPI/version·실제 process SHA/이미지 대응·frontend 사용 계약 | 현재 dev SHA/문서200을 현재 서버 실행 대응으로 대체하지 않음 |
| 검증 자원 | 공사/물품/용역·분류/차수·본문/일시 유무·시각 차이·부분실패/오류의 비식별 fixture와 기대값, 사용/변경/잔존/복구 범위 | 실제 업무/파일/원문 접근은 별도 승인 범위 확인. mock/HTTP 대역/실제 QA를 분리 |

<a id="pol-09-followup"></a>

### 후속 개발 범위와 판정

- [DEV-14 재개 Gate](DEV-14.md#dev-14-pol-09-handoff)에 위 실제 계약·원천 의미/실행 대응·비식별 검증 조건을 남긴다. 계약 미확보로 구현 미착수이며 로컬 선행 구현/실제 QA 면제 예외는 없다. 실제 제공 범위가 이번 방향보다 좁아지면 사용자 정책 Gate에서 미제공 항목의 처리부터 다시 결정한다.
- [상세 QA 후속 기준](../../../qa/bid-detail.md#pol-09-followup)은 본문·URL·현장설명 일시/필요 여부·기준일/수집일·기존 마감/오류/공개 경계·두 Figma 상태의 검증을 정의한다. 이번 실제 실행/새 API 통과0건이며 기존 QA-03의 실제1통과8차단·DETAIL-07 이력/타 Task 승인 예외를 그대로 보존한다.
- backend 계약 요청의 발송/접수·담당자/일정·구현/배포 완료는 미확인이다. 이번 정책 문서와 Git 전달이 요청 발송이나 제품 통합 완료를 뜻하지 않는다.

### 결정 후 체크포인트

- 사용자 추가 제공 추진 결정을 확보한 뒤 위 최종 Brief/파일·영향·단계·위험·검증을 편집 전에 제시했다. 현재 구현·Figma와 계약 공백을 구분하고 최초 추천의 현행 유지/예외 승인을 채택하지 않았다.
- 정책 문서/DEV-14·QA 기준을 작성하고 문서 검사·Context Audit 갱신/두 리뷰를 진행한다. 자동 검증 수정0/3. Git 전달·종료/다음 선정은 Gate 후 수행한다.

<a id="pol-09-close"></a>

## 2026-11-13 · 정책 문서 Gate와 다음 작업 인계

- 정책/후속 문서10파일의 문서 검사 PASS(79원본/114Task/155의존성·822상대 링크·보호10범위), `git diff --check` PASS. primary ai-review 여섯 섹션·독립 read-only verifier 모두 PASS, Blocker/Major/Minor0이다. 독립 검토 diff SHA-256은 `c51247ba6ecada76f9c303f840749c2ad1e2c9f1083410322243df09eb8a026a`이며 [검토 기록](../reviews/POL-09.md)에 범위/미실행을 남겼다.
- 이 결과로 정책 결정/계약 요구 정리 단위의 완료 기준을 충족했다. 본문 형식·현장설명 일시·기준일/수집일 실제 계약/원천 정의·실행 대응/검증 자원은 미확보이고 제품 구현/실제 API 통합 완료는 아니다. 최초 현행 유지/Figma 예외 추천은 미채택이다.
- Documentation Update Check: Task/DEV-14·WBS/coverage·기존 상세 QA 추가 기준·plan/source/context/review·실제 출력 실패 기록을 갱신했다. 제품/패키지/구조/데이터/하네스 규칙 변경이 없어 base/architecture/data-access/harness는 유지한다. 자동 검증 수정0/3, 기존 baseline/감사/QA 본문·차단/승인 예외 보존이다.
- 다음 하나는 [POL-10](POL-10.md#pol-10-pol-09-handoff)으로 선정한다. WBS에서 선행이 완료된 대기/준비 후보를 대조했으며 남은 P0 실제 QA/약관·취합, P1 정책/신원·문구/실제 자원, DEV-09 차단·DEV-12 보류·DEV-13 전용 계약·DEV-14 이번 계약 선행을 보존한다. P2 기본 표 순서에서 DOC-001이 완료된 첫 독립 후보인 POL-10을 선정했으며 영구 우선순위 변경이 아니다.
- 다음 첫 행동: 새 대화에서 최신 Git/main·POL-10 정의/마지막 인계·현행 회사/소속 신청 소유 정책과 source/개발 Swagger를 대조하고, 취소 상태 조회와 취소 명령·본인/관리자 권한·동시 승인/expectedVersion/409·완료 목적지/재조회·사용/잔존/복구의 정책 Brief부터 제시한다.
- 이번에는 POL-10 정의/선행/완료 기준만 읽고 인계했다. POL-10 전용 상세 조사·정책 결정/Brief/설계·제품 구현·실제 업무/API·검증·Git 전달은 시작하지 않았다. 이번 POL-09 Git/Chromatic 승인을 다음 Task로 확대하지 않는다.
- Gate 후 변경은 완료 체크리스트·종료/다음 인계·요청 발송 상태의 주체 명확화뿐이다. 외부 발송은 Codex0건이고 타 주체의 발송/접수는 미확인이다. 문서 검사/ai-review 영향 재검토와 독립 verifier freshness를 다시 수행한다. Git 전달 최종 SHA/CI/merge/main 결과는 실제 PR/head·저장소 밖 receipt/최종 보고에서 별도로 확인한다.

<a id="pol-09-backend-delivery"></a>

## 2026-11-13 · 사용자 백엔드 전달 보고

- 사용자 원문: **‘이 요청문과 이미지를 백엔드 개발자에게 전달했어.’** 사용자가 간결한 요청문과 백엔드 검토용 주석 이미지를 전달했다고 보고했다. Codex가 외부 메시지를 발송한 것은 아니다. 발송 사실의 근거는 사용자 보고이며 별도 수신/접수 증빙은 확인하지 않았다.
- 전달 범위는 자격사항/지시사항 본문·현장설명 일시 추가와 기준일/수집일의 의미·원천/산출·응답 계약 확인이다. 기존 제공 일정/공동수급 마감·참조번호를 신규 누락으로 요청하지 않았다. 내부 Task 용어를 뺀 요청문/이미지를 사용했다.
- 이번 사용자 지시에 따라 **DEV-14는 답변과 실제 API 계약 확보 전까지 차단을 유지**한다. 사용자 전달 보고만으로 회신/접수·필드/의미·구현/배포·실행 대응·검증 자원 확보나 제품/실제 통합 완료로 세지 않는다. 기존 [재개 Gate](DEV-14.md#dev-14-pol-09-handoff)를 유지한다.
- 사용자에게서 별도로 받은 backend 보완 완료 소식(닉네임·야간 알림·전역 상세 알림)은 기존 차단/보류 작업 전체의 현행 소스/Swagger/정책 재조사 입력이다. 이번에는 조사와 계획 제안만 수행하며 다른 Task 개발·API 변경이나 다음 작업 순서 확정을 시작하지 않는다.
- 기록 시작: clean `main`=`e09fb4c74f312b17715857b23ff976d484b76140`·원격 main 일치에서 `docs/backend-readiness-review-20261113` 생성. 기존 dirty 없음. 이 전달 기록/DEV-14 메모·WBS 외부 조건의 사실 동기화만 편집하며 광범위한 workflow/WBS 재편은 조사 후 제안한다.
- 이 세 문서의 동일 Task 후속 기록은 이번 대화의 명시적 POL-09 Git 전달 승인으로 검증·리뷰 후 전달한다. 다른 Task의 조사 결과를 정책 확정/차단 해제·제품 구현/그 Task의 Git 전달 승인으로 확대하지 않는다. 광범위한 재편은 계획 보고 뒤 사용자 결정을 따른다.

<a id="pol-09-backend-replan-approval"></a>

## 2026-11-13 · 백엔드 재조사 문서 반영과 DEV-57 인계 승인

- 승인자/근거: 이번 대화 사용자. 원문 **‘제안한 문서 수정안을 반영하고 WBS의 다음 작업을 DEV-57 재개 요구사항 확인으로 바꿔줘. 기존 차단과 미결 정책은 유지하고, 검증·리뷰·커밋·PR·CI 확인·main 병합·로컬 main 동기화까지 마무리해줘. DEV-57 구현은 다음 대화에서 시작할게.’**
- 요구사항/성공 기준: 앞선 읽기 전용 재조사의 고정 source/Swagger/중앙 정책 근거와40개 조사 항목을 날짜별 감사로 보존하고, 관련 Task의 새 근거·남은 조건 및 WBS 다음1개/첫 행동·집계/의존성·재개 규칙을 동기화한다. DEV-57은 차단 상태로 다음 재개 요구사항 확인 대상만 지정한다. 기존 차단/보류·미결 정책·실제 QA/과거 승인 예외는 보존한다.
- 시작: clean `main`=`origin/main`=`86df956d5ecf05aad860199ccd86ff0993a7a068`; `docs/backend-readiness-handoff-20261113` 생성. 선행 전달 PR #67 반영·기존 dirty0. backend dev/main·중앙 정책 ref를 다시 확인해 앞선 조사와 동일함을 확인했다.
- 수정 대상/단계: 날짜별 감사 Markdown/JSON·관련8개 Task·WBS·검토/Context Audit2개, workflow/task-cycle/start-prompt·plan/harness의 총18개 문서/JSON. 근거 보존 → Task/인계·WBS 보정 → 공통 재개 점검 최소 보완 → 문서 검사/두 리뷰 → 목적별 docs 커밋/PR/최종head CI/정상 병합/main FF.
- 가정/위험: 다음 재개 확인 대상의 선정은 차단 해제/제품 착수 승인이 아니다. POL-10만 준비→대기로 돌리고 DEV-57 차단·DEV-12 보류를 유지한다. DEV-66에 POL-19 선행1개를 추가해155→156의존성, Task/원본 수는114/79 유지. 이전 관찰을 현재 부재로 반복하거나 새 API를 실제 전달/통합 PASS로 확대하는 위험을 문서 검사와 리뷰로 확인한다. 문서 범위의 blocking ambiguity는 없다.
- 제외: 제품/테스트/설정/라이브러리, DEV-57 및 다른 Task의 자체 Brief/구현·정책 선택, 실제 로그인/업무 API·메일/문서/OCR·fixture 변경, 중앙 repo/외부 메시지·운영/배포. 닉네임 fallback·야간 실제 효력/전역 OFF/ON 정책은 확정하지 않는다.
- 검증 계획: 현재 package scripts를 확인했다. 문서 링크/anchor·Markdown·JSON 연결/40개 조사·43개 고정 source 지문·79원본/114Task/156의존성·DAG·기존 차단/보류·기존 source/QA/baseline/coverage 무변경·허용 범위·diff-check를 검사한다. 앱 실행/패키지/빌드 영향이 없어 로컬 앱 test/lint/build/브라우저/실제 통합은 미실행으로 기록한다. read-only verifier와6항목 ai-review, Context Audit·검토 뒤 freshness를 수행한다.
- 체크포인트: 사용자 승인/시작 기준/편집 전 Brief 기록 완료. 다음 행동은 날짜별 감사와 Task 후속 근거 반영이며 최종 검증/리뷰·Git 결과는 후속 체크포인트와 실제 PR/receipt에서 확인한다.

### 문서 반영·검증 체크포인트

- [날짜별 감사/JSON](../audits/2026-11-13-backend-readiness.md)·8개 Task·WBS·재개 규칙·검토/Context Audit18파일을 반영했다. DEV-57 차단 유지/다음 재개 확인, POL-10 준비→대기와 DEV-66의 POL-19 선행 추가만 현재 선정/의존성에 반영했다. 나머지 차단/보류·원본79/114Task·기존 QA/승인 이력은 유지한다.
- 문서 검사 `validate_docs.py`·`git diff --check` PASS: 로컬 링크/anchor·JSON40개 조사/43개 고정 source 지문/209operations·114Task/156의존성/DAG·79원본/기존26차단·보류/보호 source·QA·baseline·coverage를 확인했다. 자동 수정0/3, 앱 검사/실제 통합 미실행 이유는 [검토 기록](../reviews/backend-readiness-2026-11-13.md)에 남겼다.
- Documentation Update Check/6항목 ai-review PASS, [Context Audit](../reviews/backend-readiness-2026-11-13-context.md) WARN(후속 정책/실제 QA 확인 유지). 다음 행동은 실제18문서/증거의 read-only verifier와 종료 metadata freshness 확인이다. 문서 PASS를 DEV-57/다른 제품·실제 API PASS로 세지 않는다.

<a id="pol-09-backend-replan-close"></a>

### 문서 단위 종료·다음 재개 인계

- [검토 기록](../reviews/backend-readiness-2026-11-13.md): 문서 검사/ai-review·read-only verifier1차 PASS, 미해결 Blocker/Major/Minor0. 이전 WBS 집계 Minor는 승인한 문서 보정으로 해결했으며 Context Audit WARN과 과거 제품 감사 FAIL/실제 QA·미결 정책을 유지한다.
- 다음 하나는 사용자 승인에 따른 [DEV-57 재개 요구사항 확인](DEV-57.md#dev-57-resume-handoff-20261113)이다. P1·POL-29 main 반영·새 nickname 공급원이 근거이며 차단 유지 상태로 선정했다. 다음 첫 행동은 최신 main/Git·POL-29 D2/CF-03·현행 nickname 계약과 이름 결측/지연/오류 표시·frame별 폭/date 표면·합성 세션/실제 QA 범위를 확인하고, 필요한 결정/자체 Brief를 편집 전에 제시하는 것이다.
- 이번에는 문서/선정 인계만 수행했고 DEV-57 자체 Gate/설계·구현·업무 API/실제 QA를 시작하지 않았다. DEV-14 회신/실제 계약 선행과 DEV-12 보류·기존26차단/보류·모든 승인 예외는 보존한다.
- 1차 검토 뒤 변경은 종료/다음 인계·WBS 현재 없음/이 결과 metadata다. 문서 검사·6항목 ai-review 영향 확인을 반복하고 동일 verifier에 최종 freshness를 요청한다. 이 결과만 저장한 외부 원문/최종 지문·실제 Git receipt는 후속 전달 증거이며 새로운 제품/정책 승인이 아니다.

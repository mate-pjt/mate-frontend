# DEV-22 · 가입 후 서류함 목록·보유/만료 상태

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: F01
- 선행 작업: [POL-13](POL-13.md)
- 목적/범위: 관리용 목록과 보유/만료 상태·메뉴를 연결한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### F01 · 가입 후 서류함 목록·보유/만료 상태
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **관리 목록 계약 없음**. 검증: 코드 대조.
- 남은 점: 가입용 업로드와 별개인 보관함·문서 생명주기 UI/조회 연결
- Figma: [3135:75612](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75612) / [3135:75734](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75734)
- 소유 소스/기존 기록: [src/data/company/contracts.ts:212](../../../../src/data/company/contracts.ts)、[src/components/my/my-company-client.tsx:252](../../../../src/components/my/my-company-client.tsx)

## 완료 기준

- [x] 보유/미보유/만료·정렬/페이지·빈/오류·권한을 확인한다
- [x] 가입 업로드 자료와 관리 목록의 관계·모바일을 검증한다
- [x] 현재 package scripts로 필요한 test/lint/build·diff-check와 영향 시 Storybook 검증을 통과한다.
- [x] 요구사항 Gate에서 정한 실제 API/브라우저·권한·오류 사례와 필요한 QA case를 검증한다. 외부 조건으로 못 하면 차단/미실행과 이미 승인된 예외를 기록하며 전체 기능 통합 PASS로 표시하지 않는다.
- [x] Documentation Update Check 및 verifier/ai-review를 통과한다. 구현만 마친 상태는 완료가 아니다.

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

<a id="dev-22-pol-13-handoff"></a>

## 2026-11-16 · POL-13 정책/후속 Gate 인계

- [POL-13 사용자 D1/D2/D3·v1](POL-13.md#pol-13-contract)과 [DBOX 미실행 계획](../../../qa/company-documents.md#pol-13-document-qa)을 후속 기준으로 받는다.
- 다음 자체 Gate는 최신 Git/main·POL-13 v1·목록 API GET `/api/v1/companies/{companyId}/documents`를 확인하는 것이다. 과거 '관리 목록 계약 없음'은 당시 frontend 관찰이며 현재 API 부재를 뜻하지 않는다.
- page0/size20·상한100·문서 count/정렬, candidate 우선 표시와 current/이전 버전 보유, 문서관리 leaf·권한 거절/빈/오류를 구분한다. 목록에는 기간 필드가 없으므로 실제 version 조회 조합/계약 보완·호출 비용·Figma 상태를 자체 Brief에서 결정한다. 기간 결측은 미확인, uploadedAt+30일 합성 없음.
- 완료 증거는 DBOX-01~06/21~22, 영향 자동 검사·실제 브라우저/API·모바일/접근성·두 리뷰다. 실행 SHA·합성 문서/권한 계정과 조회/보존/복구 범위를 확보한다. 로컬 선행/실제 QA 면제는 이번 인계에 없다.
- 기준/인계만 수행했다. 이 Task 자체 Gate·제품/실제 API·파일/OCR/삭제·별도 Git 전달은 시작하지 않았다. 현재/다음/상태는 WBS만 관리한다.

<a id="dev-22-investigation"></a>

## 2026-11-16 · 요구사항 Gate 조사

- 시작: local/remote main `433200fbf40539ab6a61dec024945b717cbaaddc` 일치·작업트리 깨끗함. POL-13 PR #78 main 반영, 같은 Task 기존 branch/변경 없음. 최신 main FF 확인 뒤 `feat/dev-22-document-box` 생성. 다른 worktree나 기존 작업을 정리하지 않았다.
- 이번 승인: 사용자 2026-11-16 요청의 DEV-22 개발·검증/두 리뷰·목적별 commit/push·PR/최종 CI·정상 main 병합/로컬 FF. 이번 PR의 Chromatic 월간 한도만 예외다. 실제 업무 변경·파일/OCR/삭제·외부 메시지·운영/배포·다음 Task 실행은 포함하지 않는다. 과거 Task의 로컬 선행/QA 예외를 승계하지 않는다.
- 현행 조사: backend dev `adc0e265ef0e2aa78ccb376e1fa322edd664b290`, main `4b5f31de578c41e698dda9c99e66149b7292f031` 유지. GitHub의 목록 service/persistence/use-case·버전 조회 persistence와 Aside 브라우저의 개발 OpenAPI GET200/3.1.0/v1을 확인했다. 일반 Python GET403은 별도 관찰이며 API 부재가 아니다. POL-13의 배포 run 기록·source SHA·게시 명세·실행 프로세스 SHA·실제 업무 응답을 구분하며 마지막 두 항목은 미확인이다.
- 확인: 목록 page0/기본20/1..100·문서 count·후보 우선/current 별도·modifiedAt/documentId 내림차순, 목록의 문서관리 leaf와 버전 metadata의 ACTIVE 소속/owner 차이를 유지한다. 목록에는 validFrom/validUntil이 없고 버전 GET에만 nullable 날짜가 있다. 실제 가입 업로드와 관리용 목록을 제공하는 frontend 공개 함수/route는 아직 분리되지 않았다.
- Figma `3135:75612` 미보유·`3135:75734` 보유의 design context와 screenshot을 확보했다. 회색/파란 문서행·등록일·미리보기/재업로드 slot을 확인했으며 상세/원본·업로드의 활성화는 DEV-23/24 범위다. 전체 화면/후속 상태·실제 제품 정합성 PASS는 아니다.
- 편집 전 제시한 구현 후보: `/my/documents`/목록 client·기존 my 메뉴, company 조회 contracts/client/HTTP/mock·날짜/목록 모델·테스트, Task/WBS/QA/검토·영향 context 문서. 기존 tokens/Button/Pagination·공개 Repository·7그룹/snapshot/hybrid/운영 guard를 유지하고 라이브러리를 추가하지 않는다.
- Gate 질문 D1: 기존 버전 GET을 현재 page에만 동시 수 제한으로 조합할지(추천), 목록 API 기간 필드 보완을 선행할지. D2: 실행 대응/비식별 합성 문서·권한별 계정/조회 범위가 준비됐는지, 미준비 시 이번 Task의 로컬 선행·실서버 QA 차단 보존을 허용할지(추천). 추천은 확정으로 세지 않으며 답변 전 제품 설계/편집·실제 업무 API를 진행하지 않는다.
- 검증 후보: Node22.20.0/pnpm11.3.0의 test/lint·API/mock/hybrid build·공유 UI 영향 시 Storybook·diff-check, 실제 Next/Aside mock·로컬 HTTP 대역·모바일/키보드/계정·회사 수명·운영 guard·문서 검사·context-audit·독립 verifier/ai-review. 실제 API DBOX-01~06/21~22는 자원/허용 범위 확보 뒤만 수행한다.
- 다음 행동: 두 Gate 답변 반영 후 최종 Implementation Brief와 파일/영향/단계/위험·검증 계획을 편집 전에 제시한다. 현재 제품 변경0·실제 업무 API/파일/OCR/삭제0·다음 Task 미선정/미착수다.

<a id="dev-22-brief"></a>

## 2026-11-16 · 사용자 결정과 Implementation Brief

- 결정자/근거: 이번 사용자 답변 D1 **“기존 API 조합으로 구현 (추천)”**, D2 **“로컬 선행·실서버 QA 차단 보존 (추천)”**. 이번 DEV-22에만 유효하며 Git 전달/Chromatic 예외와 별개다.
- 요구사항/성공 기준: 가입 후 `/my/documents`에서 회사 귀속 문서 목록·보유/미보유·후보/current·기간/처리 상태·페이지/정렬과 메뉴를 제공한다. 정상0건/범위 밖/403/401/오류·재시도·날짜 결측/손상·모바일/키보드·계정/회사 전환의 늦은 응답을 구분하고, 현재 package 검사·로컬 실제 Next mock/HTTP 대역과 두 리뷰를 통과한다. 실제 통합 DBOX 사례는 차단으로 보존한다.
- in scope/파일: `src/app/my/documents/page.tsx`, `components/my/my-documents-client.tsx`와 기존 my 메뉴, `data/company/{contracts,client,http-repository,mock-repository}.ts`·문서 목록 응답 mapper/합성 fixture, `features/company/document-box.ts`·관련 Node 계약/날짜/수명 테스트, 필요한 mock 시나리오와 문서/Task/WBS/QA/검토 기록. 기존 CompanyDocument 포트와 company 공급원을 확장한다.
- out scope: DEV-23 상세/원본/이력 UI·DEV-24 업로드/교체·DEV-25 삭제·DEV-26 OCR 적용, 새 backend/중앙/Linear 변경·라이브러리·실제 업무 API/파일/메일·운영/배포. 기존 회사 신규 문서 귀속/최종 교체 계약이나 MAT-162 보류를 해소하지 않는다.
- 확인한 패턴: my route/noIndex·auth loading/anonymous/error, MySideMenu·Button/Pagination·grayscale/primary/type 토큰, 공개 company client→Repository→HTTP/탭별 mock, AuthAccess·session epoch/AbortSignal·계정 namespace·가입 upload handle을 유지한다. 목록용 회사 문맥은 기본 profile의 별도 leaf 권한을 요청하지 않고 인증 회사 문맥에서 구한다. mock은 같은 company 상태의 귀속 정보를 사용한다.
- 설계/호출 비용: 기본20·최대100의 해당 page 목록1건+표시 문서별 versions GET N건(동시4건), 빈 page0건 추가 조회. exact versionId로 표시 후보와 서버 current를 연결한다. 서로 다른 요청 시점의 version/current가 불일치하면 최신 확인 필요로 표시하며 최대 번호를 추론하지 않는다. 버전 조회 오류는 기간/보유 확인 필요,401/403·계정/회사 수명 상실은 보호 자료를 감춘다. 자동 polling/재전송은 없다.
- 날짜/보유: validUntil의 KST 당일 포함/다음날 만료·미래 validFrom 별도, null 미확인·손상 확인 필요. 업로드일+30일·OCR 성공/기간과 회사 인증/프로필 반영을 합성하지 않는다. 새 가입 문서는 등록 성공으로 회사에 귀속된 경우만 관리 목록에 연결하고 미귀속 업로드를 회사 문서로 노출하지 않는다. 알려진 구형 mock에는 귀속을 임의 생성하지 않는다.
- 화면: Figma 두 frame의 breadcrumb·1100px 콘텐츠/흰20px 카드·24px padding·회색 미보유/primary100 보유 행과 등록일을 기존 토큰으로 구현한다. 현재/후보·기간/오류·페이지는 POL-13과 완료 기준에 따른 추가 상태이며 전체 Figma 예외 승인을 주장하지 않는다. 미리보기/다시 업로드 slot은 기존 준비 중 패턴으로 비활성이다. 원본/업로드 동작은 후속 자체 Gate에서 연결한다.
- 단계/위험/검증: 계약/응답 검증·조회 조합/날짜 → mock 귀속/fixture·UI/메뉴 → 의미 있는 Node 계약/수명·날짜 테스트 → Node22.20.0의 `pnpm test`, `pnpm lint`, API/mock/hybrid `pnpm build`, 공유 모델/메뉴 영향 `pnpm build-storybook`, `git diff --check` → 실제 Next/Aside mock·로컬 합성 HTTP/모바일/키보드·guard/격리 → 문서 검사/context-audit·verifier/ai-review/freshness → 목적별 Git 전달. 위험은 N+1 비용·후보/current 변경 경쟁·권한 회수/응답 지연·구형 탭/가입 관계이며 각 검증에 포함한다.
- 착수 체크포인트: `feat/dev-22-document-box`/`433200f`, 기존 변경은 이번 조사 문서2개뿐이다. 최종 설계/영향/위험·검증을 제품 편집 전에 제시했고 이제 계약과 조회 모델부터 구현한다. 실제 업무 API0·다음 Task 미착수다.

## 2026-11-16 · 구현/첫 자동 검사 체크포인트

- 목록/버전 공개 계약·HTTP 검증·동시4조회/기간 모델·회사 귀속 mock/합성25문서·실제 route/메뉴를 구현하고 Node 계약42개를 추가했다. 미귀속 upload와 회사 귀속 등록을 같은 company 상태에서 구분하고, 구형 문서는 근거 없이 회사에 귀속시키지 않는다. 후속 원본/업로드/삭제 기능은 활성화하지 않았다.
- Node22.20.0의 첫 `pnpm test`: 기존524+신규42 중565통과/1실패. 실패는 테스트 목록 fixture가 실제 목록 계약에 없는 기간 필드까지 spread한 기대값이었다. mapper가 해당 필드를 폐기하는 정상 결과에 맞춰 목록 fixture를 명시 필드로 교정했다. 자동 수정1/3. 첫 lint PASS. 전체 test 재실행 뒤 구성별 build·실제 브라우저/HTTP 대역·문서/두 리뷰로 이어간다.

<a id="dev-22-verification"></a>

## 2026-11-16 · 검증/문서 갱신 체크포인트

- 구현: `/my/documents`·기존 my 메뉴·문서 목록/버전 조회·정상0건/범위 밖/401/403/오류·후보/current/기간·명시 재시도·계정/회사/화면 수명, 합성25개/빈/거절/부분 실패 시나리오와 신규 가입 후 동일 문서의 회사 귀속을 연결했다. HTTP filename은 필요한 화면 메모리에서만 표시하고 영속 저장하지 않으며 업로더 ID·원본/서명을 내부 모델에 복사하지 않는다. mock은 합성 파일명만 저장하고 실제 선택 파일의 이름/원문을 복사하지 않는다. 상세/이력 UI/원본·업로드/삭제·OCR 적용은 후속 범위다.
- 자동: Node22.20.0/pnpm11.3.0 `pnpm test`566/566·`pnpm lint`·API/mock/hybrid Preview `pnpm build`·`pnpm build-storybook` PASS. 모든 API 주소는 공개 설정으로 loopback4322를 명시해 실제 업무 호출을 피했다. production mock build와 hybrid Preview 결과물 production start는 각각 명시 guard 오류/exit1로 예상대로 차단됐다. Storybook의 기존 extensionless-import/chunk-size 안내는 비차단이다. 초기 테스트 fixture1건 수정1/3 뒤 전체 재통과, 익명 화면의 h1 보완 뒤 최종 test/lint/API build도 확인한다.
- 브라우저: [DBOX-L01~14](../../../qa/company-documents.md#dev-22-local-qa)의 실제 Next/Aside 전체 mock·loopback 합성 HTTP,1440×1000/375×812·키보드/초점·계정 전환/회사 수명/응답 지연을 확인했다. HTTP 목록1+버전20/동시4·끝page5·빈page0, 버전403/401 전체 숨김·한 버전503 부분 확인 필요와 오류→명시 재시도 복구를 관찰했다. 전체 mock 관찰의 외부resource0건이다. 초기 전환/로딩 관찰 뒤 최종 상태를 다시 확인했으며 미완료 화면을 PASS로 세지 않았다.
- 실제 통합: 사용자 D2에 따라 DBOX-01~06/21~22 실제0통과·8차단/업무 실행0, 나머지14대기/미실행과 원본22미실행 계획을 보존한다. 현재 실행 SHA/실제 wrapper·합성 권한/문서·조회/사용/잔존/복구 자원 담당과 재개 조건은 QA 기록을 따른다. Node·mock/HTTP 대역/소스·게시 명세/배포 기록을 실제 업무 응답으로 대체하지 않는다. VoiceOver 음성·다른 실기기 미실행도 별도다.
- Documentation Update Check: 실제 route/계약/시나리오에 맞춰 architecture/data-access·개발 Repository 안내·QA/진입점·이 Task/WBS·plan·검토를 갱신한다. package/scripts/lock/기존 토큰·공통 UI/하네스 규칙 변경0이므로 base/harness·DESIGN 유지, 테스트 fixture의 단일 기대값 교정은 반복/고위험 실패가 아니어서 ai-failures 추가 없음. baseline/coverage·기존 QA/정책/타 Task 차단·원본79/114Task/156의존을 보존한다.
- 다음 행동: 문서 검사/context-audit·read-only verifier와 ai-review. 두 리뷰 전 완료/다음 선정으로 바꾸지 않는다. 종료/인계 뒤 필요한 freshness를 다시 확인하며 Git/Chromatic 승인은 이번 요청만 적용한다.

- 최종 소스 재검증: 익명 h1 보완 후 `pnpm test`566/566·lint·API build 재통과. 문서 검증 첫30/31은 checker가 coverage의 굵은 글씨·CF-xx ID 형식을 누락해 생긴 검사기 오류였고 원본은 변경하지 않았다. matcher를 실제79행 형식에 맞춰 교정한 뒤31/31·diff-check PASS, 보호23파일/기존 QA prefix·114Task/156선행 보존. 자동 교정은 테스트 fixture1회+문서 checker1회 총2/3이며 제품 runtime 결함을 숨긴 결과가 아니다.
- context-audit/Documentation Update Check와 primary ai-review 여섯 섹션을 [검토 기록](../reviews/DEV-22.md)에 기록했다. 독립 verifier가 원본 요청/현재 diff·신규 파일·검증 로그·실제 QA 차단 보존을 읽기 전용으로 검토한다. 결과 전 완료/다음 선정은 없다.

<a id="dev-22-close"></a>

## 2026-11-16 · 로컬 단위 종료와 전달 준비

- 승인된 단위 판정: D1/D2의 로컬 구현·자동/실제 Next mock/HTTP 대역14개·문서31/31·context-audit·primary ai-review 여섯 섹션·독립 verifier PASS. 독립 검토는 Node22 test566/lint·문서/diff-check를 재실행했고 Blocker/Major 없음, 파일명 보관 설명의 Minor1건을 위처럼 명확히 했다. source/test 변경0이며 종료/인계 문서 diff는 전달 전에 freshness 재검토한다.
- 구현 완료·로컬 문서/리뷰 PASS·실제 API 통합·main 반영은 별도다. 실제 DBOX8차단/후속14대기·실제 업무0/원본·티켓·파일·OCR·삭제0·실행 대응/합성 자원·VoiceOver/실기기 미실행과 타 Task의 기존 QA/계약/예외를 보존한다.
- Git 전달: 이번 요청에 따라 runtime→test→계약/개발 안내→QA→종료/인계의 목적별 한국어 Conventional Commits로 분리하고, 작업 branch push·PR/라벨·최종 head CI/리뷰·정상 merge commit·로컬 main FF를 진행한다. 원격 main은 재확인 시에도 `433200f`, 저장소 merge commit 허용·main 보호/ruleset 강제 조건 없음(정상 API 확인)이다. 직접 main push/force/보호 우회/check 강제 성공은 없다. 이번 Chromatic 월간 한도만 실제 원인 확인 뒤 예외 처리하며 실제 PR/head/CI/merge/main 일치·clean은 PR/최종 보고와 외부 receipt로 확인한다.
- Documentation Update Check: architecture/data-access·개발 안내/QA·진입점/합성 화면3장·plan·Task/WBS/리뷰·다음 인계를 반영했다. baseline/coverage·package/lock·기존 auth/guard/namespace·토큰/하네스/기존 QA를 보존한다. 종료 metadata 추가 뒤 문서 검사/primary ai-review·독립 verifier freshness를 다시 확인한다.

<a id="dev-22-handoff"></a>

## 다음 하나 · DEV-23 선정/인계

- WBS의 P0/P1 미완료는 실제 QA/약관·정책/신호/회사 자원 또는 앞선 선행 차단으로 해소 가능한 대기0이다. P2 앞선 DEV-09/12~14의 차단/보류와 DEV-17~21의 DEV-08·개발 선행을 유지한다. DEV-22 뒤 직접 선행이 충족된 DEV-23/24 중 기본 표 순서가 앞선 **DEV-23 · 서류 상세·이력·다운로드**를 다음 하나로 선정한다. 새로운 영구 우선순위 변경은 아니다.
- [DEV-23 인계](DEV-23.md#dev-23-dev-22-handoff)에 정의/선행·첫 행동만 연결한다. 새 대화에서 최신 main/Git·POL-13·현재 목록/최소 버전 모델과 Figma 상세 상태·실제 티켓/metadata/원본 계약·실행/합성 권한/파일·조회/사용/잔존/복구 범위를 확인하고 자체 Brief/파일·검증 계획부터 제시한다.
- 현재 공개 버전 함수는 DEV-22 목록 보완용 최소 모델이다. 상세 이력의 표시명/필드·exact 선택 version의 PREVIEW/DOWNLOAD·2분 티켓/비저장·권한/오류/목록 복귀는 DEV-23 자체 Gate에서 확인한다. 이번 D2 로컬 선행·Chromatic/Git 예외를 승계하지 않으며 DEV-24/25/26·MAT-162를 재개하지 않는다.
- 이번에는 다음 정의/완료 기준과 WBS 선행/순위만 읽었다. DEV-23 전용 source/API/Figma 조사·설계/구현·검증/실제 업무·별도 Git 전달은 시작하지 않았다.

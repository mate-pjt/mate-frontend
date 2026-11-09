# POL-07 · 고급 조건·범위·낙찰금액 계약 확정

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 정책 결정
- 원본 항목: L07, L08, L09, L10
- 선행 작업: [DOC-001](DOC-001.md)
- 목적/범위: 고급 지역 조건·날짜 기준/직접 기간·금액 종류/범위·낙찰금액의 서버 지원과 URL/개인 저장 의미를 확정한다. 추천: 이미 있는 모델/URL을 우선 재사용하고 미지원 조건을 추정 전송하지 않는다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### L07 · 지역 업체·공동도급 등 고급 지역 조건
- 기준선: UI **비활성**, 동작 **미연결**, 데이터 **모델 일부 지원**. 검증: 코드 대조.
- 남은 점: advancedDisabled 해제에 필요한 제어값·콜백·조회 계약 연결
- Figma: [2080:64254](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2080-64254) / [2080:64609](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2080-64609)
- 소유 소스/기존 기록: [src/components/bids/bid-filter-toolbar.tsx:86](../../../../src/components/bids/bid-filter-toolbar.tsx)、[src/data/personal-filters/contracts.ts:4](../../../../src/data/personal-filters/contracts.ts)

### L08 · 날짜 기준 선택·직접 기간 입력
- 기준선: UI **비활성**, 동작 **미연결**, 데이터 **모델·URL 지원**. 검증: 코드 대조.
- 남은 점: 선택형 preset 외 고급 편집 UI를 연결
- Figma: [2081:61968](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2081-61968) / [2081:62097](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2081-62097)
- 소유 소스/기존 기록: [src/components/bids/bid-filter-toolbar.tsx:121](../../../../src/components/bids/bid-filter-toolbar.tsx)、[src/components/ui/filter-popover/filter-popover.tsx:588](../../../../src/components/ui/filter-popover/filter-popover.tsx)

### L09 · 금액 종류·직접 최소/최대 입력
- 기준선: UI **비활성**, 동작 **미연결**, 데이터 **모델·URL 지원**. 검증: 코드 대조.
- 남은 점: 기초/추정가격 종류와 직접 범위 편집 UI 연결
- Figma: [2083:61727](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2083-61727) / [2085:67295](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2085-67295)
- 소유 소스/기존 기록: [src/components/bids/bid-filter-toolbar.tsx:140](../../../../src/components/bids/bid-filter-toolbar.tsx)、[src/data/personal-filters/contracts.ts:12](../../../../src/data/personal-filters/contracts.ts)

### L10 · 개찰결과 낙찰금액 필터
- 기준선: UI **준비 중**, 동작 **보류**, 데이터 **프론트 연결 없음**. 검증: 새 mock 비활성 확인.
- 남은 점: 현재 서버 계약 확인 후 낙찰금액 필터 구현
- Figma: [2134:10709](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2134-10709)
- 소유 소스/기존 기록: [src/components/bids/bid-filter-toolbar.tsx:132](../../../../src/components/bids/bid-filter-toolbar.tsx)、[docs/qa/bid-list.md:125](../../../../docs/qa/bid-list.md)

## 완료 기준

- [x] 필드/enum·경계/시간대/단위·정렬/조합 가능 조건을 기록한다
- [x] 공개 목록과 개인 필터의 적용/저장 범위를 조건별로 확정한다
- [x] 원문/소유 소스·버전·결정자·시각·선택/보류 이유를 기록한다. 추천안은 승인으로 간주하지 않는다.
- [x] 근거 있는 기존 승인 또는 필요한 개발자 결정을 확보하고, 후속 개발의 범위/완료 기준/차단을 갱신한다. 정책 작업도 Review Gate를 수행한다.

## 착수 전 Implementation Brief / 설계 Gate

### 2026-11-09 · 정책 문서화 Brief

- 요구사항: L07~L10의 기존 필드·공개 조회/URL/개인 저장 의미를 현재 소유 소스와 배포 OpenAPI에 대조하고, 사용자 승인 범위와 미지원 낙찰금액 보류를 후속 Task가 재사용할 수 있게 기록한다.
- 성공 기준: enum·필수/nullable·날짜/금액 경계·조합/정렬·저장 범위, 원문 ref/결정자/시점/이유, 후속 완료 기준과 미실행 조건을 추적한다. 문서 검사·Documentation Update Check·두 리뷰를 통과하고 기존 QA/정책 차단을 보존한다.
- in scope: 이 Task·WBS·plan·DEV-09~12 인계·bid-list/personal-bid-filter QA·검토 기록. 외부 자료는 공개 OpenAPI와 GitHub 소스/배포 기록을 읽기 전용 확인한다.
- out of scope: src/tests/package/설정/새 라이브러리·기준선/coverage 수정, DEV-09~12 구현, reset Major 수정, 실제 업무 GET/로그인/저장/reset/import/공고 생성, 서비스 운영·배포. Git 전달은 사용자 요청6항으로 이미 승인됐다.
- 확인한 패턴: AGENTS·세 Skill·verifier, base/plan/architecture/data-access/harness/ai-failures, workflow/task-cycle, DOC-001 결과·L07~L10·POL-02 승인과 reset/배포 차단, BID/PBF 사례, 현재 toolbar/popover·목록 URL/개인 adapter·DTO/HTTP/mock 경계.
- 편집 전 설계: 아래 v1을 이 기록에 남기고 후속4 Task에는 범위/완료 기준/재개 링크만 추가한다. QA에는 기존 이력을 보존한 새 미실행 사례를 추가한다. WBS만 현재/다음/상태를 관리한다.
- 검증: 로컬 `validate_docs.py`로 링크/anchor·79 ID/99 Task·의존/단일 활성·불변 기준선/범위/기존 prefix·원문 blob·승인/QA 경계와 `git diff --check`. 문서만 바뀌므로 로컬 앱 scripts/브라우저 제품 QA·HTTP 대역은 미실행이며 원격 실제 head CI와 구분한다.
- Gate 근거: 사용자 D1/D2 답변으로 제품 선택을 확정했다. D3에는 자료 미준비가 아니라 직접 조사하라는 답변을 받았고 실제로 배포 문서와 GitHub 배포 성공 기록을 확인했다. 미준비/로컬 구현 예외 승인으로 해석하지 않는다.
- 가정/한계: 소스 commit, GitHub 배포 성공 기록, 현재 노출 OpenAPI, 실제 실행 프로세스 SHA는 다른 증거다. 경계 공고·disposable 계정·변경/복구 준비는 이번 정책 문서화의 필수 실행 대상이 아니며 후속 Gate에서 확인한다. 다른 Task의 승인 예외는 확대하지 않는다.

## 결정 기록

| 날짜 | 질문/선택지와 추천 | 결정·근거·승인자/원문 | 영향 |
| --- | --- | --- | --- |
| 2026-10-27 | 작업 후보 분해 | 정책·API·제품 동작 신규 승인 없음 | 착수 시 Gate 수행 |
| 2026-11-09 | 고급 조건 범위·경계/단위·저장·preset 추천 | D1 ‘추천 정책 채택 (추천)’ | [정책 v1](#pol-07-contract), 제품 구현 별도 |
| 2026-11-09 | 낙찰금액 필터 계약 부재 | D2 ‘계약 확보까지 DEV-12 보류 (추천)’ | 임의 금액 대체/enum/API 확장 없음 |
| 2026-11-09 | 자원 질문 설명 보완·직접 조사 | D3 OpenAPI/GitHub 직접 확인 요청→브라우저 schema·배포 기록 대조 | 자원 미준비/차단·로컬 구현 예외 승인 아님 |

## 체크포인트 · 재개 메모

| 시각/실행자 | 환경·branch/HEAD·작업트리 | 수행/결과·근거 | 다음 행동·차단/재개 조건 |
| --- | --- | --- | --- |
| 2026-10-27 / 문서화 | feature/my-company-overview / f84af24b5f9d + 기존 미커밋 변경 | 보고서에서 작업 정의만 생성. 구현/실제 QA 미실행 | 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다. |

## 검증·리뷰·인계 기록

| 구분 | 실행 명령/사례·환경 | 결과 | 증거/미실행 이유 |
| --- | --- | --- | --- |
| 문서 검사 1차 | `python3 .../pol-07/validate_docs.py`, `git diff --check` | 21/21 PASS | 링크396/anchor81·보호454파일·원본79/Task99·타96행·기존 prefix·소유20blob/핵심4 main/dev 일치. 종료 후 재검사 |
| 소유/배포 계약 조사 | GitHub ref/path/blob·현재 브라우저 OpenAPI3.1.0/v1·GitHub test deployment success/dev SHA 기록 | 관련 계약 대조 | source/배포 문서/배포 기록만 확인. 실행 프로세스 SHA 직접 증명·실제 업무 응답/필터 결과 확인 아님 |
| 앱 test/lint/build·mock/HTTP 대역·제품 브라우저/업무 API | 미실행 | 범위 밖·신규 실제 통과0 | Markdown 전용. 새 ADV12/ADVP4는 대기, 기존 QA 차단/예외 유지 |
| ai-review 1차 | 실제 diff/관련 소스/package/승인·검사 결과 | PASS | [여섯 섹션·context-audit](../reviews/POL-07.md). 기존 reset Major/context FAIL을 분리 |
| read-only verifier 1차 | `.codex/agents/verifier.toml`·실제 diff/원문/독립 검사 | PASS·Blocker/Major/Minor0 | 로컬 `verifier-first.md`·[검토 기록](../reviews/POL-07.md). 종료 변경 후 재검토 대상 |
| 종료 문서 검사/ai-review | `python3 .../pol-07/validate_docs.py --final`, `git diff --check`·여섯 섹션 재검토 | 22/22 PASS·새 지적0 | 링크401/anchor83·최종 WBS/다음 선정·보존/계약 경계를 확인. 이 기록까지 독립 verifier freshness 재확인 후 Git 전달 |

- 자동 수정 시도: 0/3. 실패 시 명령·오류·원인·최소 수정·재검증 결과를 추가한다.
- Documentation Update Check: Task/WBS/plan/후속4개/QA2개/검토 기록을 갱신했다. base/architecture/data-access/harness는 현재 실행/구조/규칙 변화가 없어 유지. ai-failures는 새 반복/고위험 실패 근거가 없고 baseline/coverage는 원본/매핑 변화가 없어 유지한다.
- Review Gate: ai-review·독립 verifier 1차 PASS, 신규 Blocker/Major/Minor0. 종료 문서 변경 뒤 해당 검사/ai-review·verifier를 재실행한다. 최종 검토 freshness는 로컬 receipt·PR/최종 보고에서 확인하며 수행 전 PASS를 선기록하지 않는다.
- 커밋/PR: 사용자 요청6항의 Git 전달 승인 확보. 정책/후속 QA 계약과 검토·다음 선정 기록을 작은 한국어 Conventional Commits로 분리해 push/PR·실제 head CI·merge commit·로컬 main fast-forward를 수행한다. 정확한 commit/PR/CI·최종 SHA는 로컬 Git receipt와 PR/최종 보고에 기록해 자기 commit 재기록 순환을 피한다.
- 다음 작업 인계: **DEV-09**. POL-07 선행 충족 후 P2 표 순서상 첫 후보다. P0/P1의 기존 QA/정책·DEV-06~08 차단은 보존한다. 다음 첫 행동은 최신 main/Git·이 Task의 마지막 체크포인트·DEV-09 인계·L07 기준선, 현행 지역 metadata/공개 옵션·URL/ALL 저장·공동도급·배포 drift·검증 자원/변경·복구 준비를 직접 확인해 자체 Brief를 제시하는 것이다. 다음 Task 구현은 시작하지 않았다.

## 2026-11-09 15:38 KST · 조사 착수 체크포인트

- 실행자 Codex. 시작 main=origin/main `326d9e289fc9aaec72981c8428262127886b87b8`, clean. `git fetch origin main` 후 차이0/0·선행 DOC-001과 직전 POL-06의 main 반영을 확인하고 `docs/pol-07-advanced-filter-contract`를 만들었다. 원래 미커밋 변경은 없다.
- 적용 규칙: AGENTS, feature-workflow/ai-review/context-audit, workflow/task-cycle, base/plan/architecture/harness/data-access/ai-failures, L07~L10 기준선·coverage, POL-02 승인 정책/배포 및 reset 차단, BID/PBF QA를 골라 확인했다. 다른 Task 구현·실제 업무 API·프로세스/배포는 범위 밖이다.
- 편집 전 제시한 문서 범위: 이 Task·WBS·plan·DEV-09~12 인계·목록/개인 필터 QA·POL-07 검토 기록. src/tests/package/설정·고정 기준선/coverage는 수정하지 않는다. 승인 미확보 정책은 후보로만 남긴다.
- 읽기 전용 근거: 중앙 main `c9e50ff591ae18023164e1a94581c611bf1e4f29`, Backend main `475db983ea98831c2acb15f715d09ff9e0a7ad7c`, dev `1f3b8544dee49fa3936b3229114a58cd9eb7432c`. 목록 request·개인 domain·분류 행 조건 factory의 main/dev blob 일치를 확인했다. 소스 commit은 현재 배포 증명이 아니다.
- 발견: CLOSING_SOON은 날짜 request를 받아도 persistence에서 적용하지 않음. RESULT는 개찰일 범위에 dateType 금지, amountType에는 낙찰금액 없음. 지역 hierarchy metadata는 HTTP DTO에 있으나 화면 옵션으로는 parentCode/depth가 유지되지 않음. URL parser의 달력/역전/타입 결합 검증은 후속 개발에서 보완할 공백이며 이번 수정 대상 아님.
- 정책 Gate: 사용자에게 범위·직접 범위/단위·preset 의미, 낙찰금액 보류, 후속 배포/QA 자원과 구현 선행 여부를 최대3질문으로 제시했다. 답변 전 정책 확정/제품 설계 없음. 기존 SAVED 우선·GET 무쓰기·빈 SAVED/expectedVersion은 기존 승인이라 재질문하지 않았다.
- 검증 계획: 문서 링크/anchor·79 ID/99 Task·의존/단일 활성·고정 snapshot·타 Task/기존 QA 보존·소스 blob·비밀값 패턴·diff-check, read-only verifier 및 ai-review. 실행 코드 영향 없는 문서 Task이므로 로컬 앱 test/lint/build/브라우저·mock/HTTP 대역·실제 API는 미실행으로 구분한다. 현재 shell Node26.5.0/pnpm11.3.0, 저장소 .nvmrc/CI는22.20.0이며 로컬22.20.0도 설치돼 있다.
- 다음 첫 행동: 사용자3답변을 반영해 Brief/정책 v1·후속 Gate를 기록한다. 필요한 자원/승인이 없으면 해당 차단을 유지한다. 자동 수정0/3, 리뷰·Git 전달 전이다.

## 2026-11-09 · 현행 소유 근거

| 근거·고정 버전 | 확인한 내용 | 증거의 한계 |
| --- | --- | --- |
| 중앙 main `c9e50ff591ae18023164e1a94581c611bf1e4f29`: [공개 API](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/api/bid-notices.md)·[공고 찾기](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/bid/matching-and-related-notices.md)·[Accepted ADR-0014](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/decisions/ADR-0014-separate-personal-bid-filter-from-company-profile.md) | 참가가능지역·최종 업종, 행 기초금액/공고 추정가격, KST 포함 범위, snapshot 우선순위/명시적 저장 | 기존 승인 근거이며 재승인하지 않음. 문서만으로 배포/실제 필터 결과를 증명하지 않음 |
| Backend main `475db983ea98831c2acb15f715d09ff9e0a7ad7c`, dev `1f3b8544dee49fa3936b3229114a58cd9eb7432c`: [목록 request](https://github.com/mate-pjt/mate-backend/blob/1f3b8544dee49fa3936b3229114a58cd9eb7432c/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/bid/request/BidNoticeListRequest.kt)·[query allowlist](https://github.com/mate-pjt/mate-backend/blob/1f3b8544dee49fa3936b3229114a58cd9eb7432c/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/bid/request/BidNoticeListQueryParameterValidator.kt) | enum/nullable, 잘못된 조합400, 지역50/업종100/코드20자, view별 정렬, 낙찰금액 query 없음 | 두 파일은 main/dev blob 동일. Kotlin 검증이 OpenAPI보다 상세함 |
| [개인 domain](https://github.com/mate-pjt/mate-backend/blob/1f3b8544dee49fa3936b3229114a58cd9eb7432c/mate-api/src/main/java/kr/co/mate/mate_api/domain/bid/personalfilter/PersonalBidNoticeFilter.kt)·[service](https://github.com/mate-pjt/mate-backend/blob/1f3b8544dee49fa3936b3229114a58cd9eb7432c/mate-api/src/main/java/kr/co/mate/mate_api/application/service/bid/personalfilter/PersonalBidNoticeFilterService.kt) | 타입 필수 조합·열린/동일 범위 허용, 지역 reference 검증, 빈 SAVED reset, expectedVersion | domain main/dev blob 동일. 이번 GET/current·PUT/reset 실행 없음 |
| [분류 행 조건](https://github.com/mate-pjt/mate-backend/blob/1f3b8544dee49fa3936b3229114a58cd9eb7432c/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/bid/publiclist/PublicBidNoticeListRowQuerySpecFactory.kt)·[지역 조건](https://github.com/mate-pjt/mate-backend/blob/1f3b8544dee49fa3936b3229114a58cd9eb7432c/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/bid/restriction/BidNoticeRegionEligibilityConditionBuilder.kt) | CLOSING_SOON 날짜 무적용, RESULT 개찰일, 포함 금액/null 제외, 공동도급 배타 조건, 지역 계층 | 분류 행 factory main/dev blob 동일. 데이터 매칭 실행 증거 아님 |
| [지역 metadata Controller](https://github.com/mate-pjt/mate-backend/blob/1f3b8544dee49fa3936b3229114a58cd9eb7432c/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/bid/region/RegionMetadataQueryController.kt) | 시·도/시·군·구 code/name/fullName/parentCode/depth | 현재 frontend mapper는 code/label만 유지. 문자열로 하위 지역을 추정하지 않음 |
| 2026-11-09 15:47 KST [현재 배포 OpenAPI](https://api-test.mate-bid.com/v3/api-docs), OpenAPI3.1.0/info.version=`v1` | 브라우저 JSON DOM에서 목록 request·개인 request/snapshot/values·지역 schema 확인. 날짜3/금액2/공동3 enum 및 nullable가 소스와 대응. 낙찰금액 query/enum 없음 | 직접 비인증 HTTP는 timeout이었으나 브라우저는 문서를 표시했다. `v1`은 실행 commit이 아니며 전체 원문 hash가 아닌 관련 schema 요약을 보존 |
| [GitHub 테스트 배포 #7530121201](https://api.github.com/repos/mate-pjt/mate-backend/deployments/7530121201)·[배포 job](https://github.com/mate-pjt/mate-backend/actions/runs/41709711900/job/126192829042) | test/dev/SHA=`1f3b8544dee49fa3936b3229114a58cd9eb7432c`, success=2026-11-04 05:45:05 KST. 조회한 최근10개 중 최신 test 배포 | GitHub 배포 기록상 대응은 확보. environment_url은 비어 있고 실행 서버가 SHA를 직접 증명한 것은 아님. source/배포/OpenAPI/실제 QA를 합쳐 PASS로 세지 않음 |

로컬 frontend 기준은 `326d9e2`다. [개인 계약](../../../../src/data/personal-filters/contracts.ts)·[URL 모델](../../../../src/features/bid-notice-filters/model.ts)·[목록 HTTP](../../../../src/data/bids/http-repository.ts)·[adapter](../../../../src/components/bids/personal-filter-adapter.ts)·[toolbar](../../../../src/components/bids/bid-filter-toolbar.tsx)를 대조했다. 소유 원문18개와 지역2개는 로컬 `source-contract.json`/`source-region.json`에 ref/path/blob/본문으로 보존한다. commit ref와 blob 지문을 구분한다. 원문 전체 GitHub 응답·작성자/서명·계정 정보는 저장하지 않는다.

OpenAPI 주의: 개인 request는 enum을 단순 string으로, 여러 응답은 required 배열 없이 기술한다. frontend의 필수 배열/boolean/enum·snapshot 필수 필드 검증을 이 누락으로 완화하지 않는다. wrapper schema의 `success`와 기존 실제 wire/HTTP의 `isSuccess` 차이는 기존 data-access 한계다. 이번에는 업무 응답을 실행하지 않았으므로 OpenAPI만 보고 런타임 wrapper를 교체하거나 실제 응답 일치를 주장하지 않는다.

<a id="pol-07-decisions"></a>

## 2026-11-09 · 사용자 결정

결정자는 이 대화 사용자이며 15:41 KST에 답변을 확인했다. 기존 중앙 승인과 구분되는 신규 제품 선택은 D1/D2다.

| 질문 | 사용자 답변 원문 | 해석/선택 이유 |
| --- | --- | --- |
| D1 공개/개인 적용 범위·직접 범위/단위/preset 추천안 | **“추천 정책 채택 (추천)”** | 아래 v1 matrix와 KST/정수 원/열린·동일 범위/역전 오류/선택 종류 유지/팝업 URL 적용을 채택 |
| D2 미지원 낙찰금액 | **“계약 확보까지 DEV-12 보류 (추천)”** | 기초금액·추정가격을 낙찰금액으로 대체하지 않음. 서버 확장·제품 구현 승인 아님 |
| D3 자원·착수 방식 질문 | **“뭘 말하는거야? 쉽게 설명해줘. 네가 직접 현재 배포된 백엔드의 OpenAPI나 github 저장소 등을 확인해서 볼 순 없는거니?”** | 확인 가능한 계약·배포 근거를 먼저 직접 조사하라는 요청. 공개 문서/배포 기록을 조사했다. **자원 미준비 확인·DEV-09~11 차단 승인·로컬 선행 예외로 해석하지 않는다.** 합성 공고/계정·사용/변경/복구 준비는 미확인 |

<a id="pol-07-contract"></a>

## 고급 필터 정책 v1

### 공개 조회·URL·개인 저장 범위

| 조건 | ALL | CLOSING_SOON | RESULT | 개인 snapshot |
| --- | --- | --- | --- | --- |
| 지역 code·지역 업체만·공동도급 | 조회/URL 적용 | 조회/URL 적용 | 조회/URL 적용 | ALL에서 명시적 ‘내 맞춤에 저장’ 시 저장 |
| 날짜 종류3개·직접 기간 | 선택 종류의 날짜 범위 | 날짜 UI/query 제공 안 함 | dateFrom/dateTo만, 개찰일 고정·dateType 금지 | ALL의 dateType/dateFrom/dateTo만 저장 |
| 기초금액/추정가격·직접 범위 | 조회/URL 적용 | 조회/URL 적용 | 이 금액 편집 제공 안 함 | ALL의 amountType/Min/Max만 저장 |
| 낙찰금액 | 제공 안 함 | 제공 안 함 | 준비 중·DEV-12 보류 | 필드 추가/대체 저장 없음 |

- 공개 URL 편집/팝업 적용은 조회 조건만 변경한다. 익명도 공개 조회를 쓸 수 있고 계정 저장은 기존 인증·명시적 동작만 사용한다. 검색어/view/page/size·RESULT 개찰기간은 계정에 저장하지 않는다.
- 기존 `personal=1`/반복 code·`dateType/dateFrom/dateTo/amountType/amountMin/amountMax/regionOnly/jointContract` 키를 우선 재사용한다. `personal=1`은 ALL 개인 조건 문맥이다. closing/result의 지원 조건은 조회 URL에만 연결하며 개인 snapshot을 암묵적으로 적용/변경하지 않는다. 실제 URL parser/Repository 연결은 각 DEV의 Brief에서 설계한다. UI용 query/personal 표시를 backend query로 그대로 넘기지 않는다.
- `SAVED > COMPANY_DEFAULT > EMPTY_DEFAULT`, GET 무저장, 명시적 저장/빈 SAVED·expectedVersion/409·회사 값 자동 merge 금지는 ADR-0014/POL-02를 유지한다. recommended 자동 조회는 POL-02/DEV-03의 별도 범위다. POL-07로 활성화하지 않는다.
- 조건 변경은 page를 처음으로 되돌리고 서버 total/page/canonical `(id, NOTICE|bidClsfcNo)` 행 identity를 유지한다. 클라이언트에서 일부 페이지를 합쳐 filter/count/sort하지 않는다. ALL/CLOSING_SOON은 `bidCloseAt,asc`, RESULT는 `openAt,desc`, 기존 tie-breaker를 쓴다. legacy 상태/기간/estimatedPrice 조건이나 미지원 query와 혼합하지 않는다.

### L07 · 지역과 공동도급

- `regionCodes:string[]`는 참가가능지역 코드다. 기관 소재지·회사 본점이나 참가 자격 보증으로 해석하지 않는다. 최대50개, 각1..20자의 `[A-Za-z0-9_-]+`, 중복 제거 후 반복 query를 사용한다. 업종은 기존 최대100개를 유지한다. 저장 시 현재 활성 reference 검증은 서버가 수행한다.
- 시·도/시·군·구는 `/api/v1/regions`의 `parentCode/depth` 관계로 선택한다. API DTO 밖의 hierarchy를 라벨 문자열/코드 자릿수로 추정하지 않는다. DEV-09는 공개 옵션에 필요한 관계 보존부터 구현해야 한다.
- `regionOnly:boolean` 기본false. false는 선택 지역 제한 일치 또는 정상 확인된 제한 없음(NO_ROWS)을 포함하고 true는 선택 지역 제한이 실제 일치한 공고만 포함한다. true+지역0개는 오류다. 지역 해제 시 해당 종속 flag를 해제한다. UNKNOWN/실패를 제한 없음으로 바꾸지 않는다.
- `jointContract` 기본ALL(조건 없음), REQUIRED는 `REGIONAL_MANDATORY_JOINT_CONTRACT_RULE=APPLICABLE`, AVAILABLE은 `JOINT_SUPPLY_METHOD_CODE!=null`이고 REQUIRED를 제외한 집합이다. ‘가능’이 의무까지 포함하는 뜻이 아니다. 공동도급 조건은 지역 선택 없이도 가능하다.
- 같은 지역 code 집합 안에서는 서버의 지역 계층/승인 이력 일치(OR), 다른 조건 그룹은 AND다. 업종의 최종 업종/제한 없음 정책도 그대로다. 지역Only·공동도급·날짜·금액을 함께 적용하되 근거 없는 참가 적격 판정을 만들지 않는다.

### L08 · 날짜

- `dateType`: BID_BEGIN=입찰개시일, PARTICIPATION_DEADLINE=참가등록 마감일, BID_CLOSE=입찰마감일. popover의 `open`은 BID_BEGIN이며 RESULT의 개찰일과 다른 의미다.
- `dateFrom/dateTo`는 null 또는 실제 유효한 `yyyy-MM-dd` 달력 날짜다. KST 시작일00:00 이상·종료 다음 날00:00 미만으로 양끝 날짜를 포함한다. 단순 Date.parse의 자동 날짜 보정을 허용하지 않는다.
- 한쪽 빈 범위·동일일 허용, from>to·존재하지 않는 날짜는 오류이며 자동 교환/보정·조용한 무시 없이 적용/저장을 막고 입력 오류를 안내한다. ALL에 한쪽이라도 경계가 있으면 dateType 필수다. 양쪽을 모두 비우면 종류까지 null로 해제한다.
- 기존 1/3/6개월·1년 preset의 KST 현재일·월말 clamp 계산과 범위를 유지한다. ALL은 from만, RESULT는 from~오늘이다. 고급 편집에서 선택한 종류를 preset에도 적용하고 ALL에서 선택 종류가 없으면 기존 BID_BEGIN을 사용한다. RESULT는 종류 없이 개찰기간만 사용한다. 저장되는 날짜는 계산된 절대 날짜이며 매일 이동하는 상대 preset으로 저장하지 않는다.
- CLOSING_SOON은 소스에서 날짜 입력을 수용해도 필터에 적용하지 않는다. 새 고급 UI는 이를 지원으로 노출하지 않고 query를 보내지 않는다. RESULT는 실제 개찰→결과 예정→공고 개찰 시각의 기존 서버 선택을 사용한다. 새 OPEN enum은 만들지 않는다.

### L09 · 금액

- `amountType`: BASE_PRICE=현재 canonical 행의 기초금액, ESTIMATED_PRICE=공고 추정가격. bounds는 null 또는 **0..9,007,199,254,740,991의 안전한 정수 원**이다. 서버 Long의 전체 범위를 JS number로 무손실 처리한다고 주장하지 않는다. 이 상한은 D1의 frontend 입력/전송 범위다.
- 최소/최대 모두 포함, 한쪽 빈 범위·동일 금액·0원 허용, min>max/음수/소수 원/안전 정수 초과는 오류다. 경계가 있으면 amountType 필수, 양쪽 모두 비우면 종류도 null로 해제한다. null은 무제한이고 0과 다르다.
- 만 원/억 원 표시를 쓰더라도 변환 후 정확한 정수 원으로 왕복해야 한다. 반올림·절삭·overflow·자동 최소최대 교환을 하지 않는다. 범위가 적용될 때 기준값 null인 행은 다른 금액/0으로 대체하지 않고 제외한다.
- 기존 preset 포함 경계: `~100000000`, `100000001~1000000000`, `1000000001~5000000000`, `5000000001~10000000000`, `10000000001~`원. 고급 편집에서 선택한 금액 종류를 유지한다. 선택 종류가 없으면 기존 BASE_PRICE다. 현행 adapter가 preset 선택 시 종류를 고정하는 것은 후속 DEV-11에서 바꿀 부분이며 이번에 구현한 동작이 아니다.

### L10 · 낙찰금액 보류

RESULT 응답에 `successfulBidAmount`가 있어도 필터 query/enum 지원을 뜻하지 않는다. 현재 목록/개인 amountType에는 두 종류만 있고 낙찰금액 query는 allowlist에 없다. DEV-12는 준비 중을 유지한다. 재개하려면 서버 소유자가 필드/enum·정수/소수와 단위·현재 canonical 분류/최신 회차 identity·null/결과 상태·포함 경계·정렬/count/page·오류·URL/개인 저장 여부를 명세하고 개발자 정책 승인을 확보해야 한다. 기존 두 금액에 별칭을 붙이거나 임의 AWARD_PRICE/endpoint를 만들지 않는다.

<a id="pol-07-handoff"></a>

## 후속 개발·실제 QA 인계

| 대상 | 범위·완료 기준 | 착수/재개 첫 확인 |
| --- | --- | --- |
| DEV-09 | metadata hierarchy 보존, 지역/지역 업체/공동도급 controlled UI·공개3view URL·ALL 저장, 다중/해제·지역0+only·의무/가능 배타·미확인 제한·조합/count/page 검증 | 최신 main/이 정책/배포 문서·실행 대응과 합성 지역 공고·계정/변경·복구 범위 확인 후 자체 Brief |
| DEV-10 | ALL 날짜3종·RESULT 고정 개찰기간, 열린/동일/역전/윤년·KST 양끝·preset/해제·URL/reload/ALL 저장, closing 무전송 | 날짜 fixture와 실제 서버 조건·오류 계획 및 실행 식별자 확인. DEV-09 결과를 자동 코드 의존성으로 추가하지 않음 |
| DEV-11 | 정확한 원 단위·선택 종류/preset·직접 범위·0/null/동일/역전/상한/분류별 기초금액, ALL 저장·closing 조회·RESULT 미노출 | 경계 금액/분류/누락 fixture와 저장 계정·복구 계획 확인. reset Major/실제 QA 차단은 유지 |
| DEV-12 | D2에 따라 보류. 현재 비활성/무전송·저장 필드 미추가 유지 | 위 서버 확장/제품 결정 근거 확보 후 별도 요구사항 Gate |

공통 Gate는 공개·저장 계약/실행 식별자와 합성 경계 자료, disposable 계정 별칭/초기 snapshot·version, 업무 API 사용/저장 변경·빈 SAVED 잔존·종료/복구 담당/방법, 안전한 오류/401/409 재현·해제다. 담당 역할은 백엔드 계약/배포·fixture 담당, 개발자 정책/변경 승인자, 프론트 QA 실행자이며 개인 배정은 미확인이다. 이번에 자원 미준비라고 단정하거나 새로운 로컬 선행 예외를 만들지 않았다. 준비를 확인해 자체 Gate를 통과한 뒤 구현하며, 미확보 조건은 그때 구체적으로 차단 기록한다.

새 사례는 [목록 ADV-01~12](../../../qa/bid-list.md#pol-07-advanced-qa)·[개인 ADVP-01~04](../../../qa/personal-bid-filter.md#pol-07-advanced-personal-qa)에 정의한다. 모두 이번 실제 실행0·신규 통과0이며 기존 BID/PBF·QA-02/QA-10 이력, reset Major, POL-02/타 Task의 차단/승인 예외를 유지한다. 소스/배포 문서 조사는 mock/HTTP 대역/실제 필터 통합 PASS가 아니다.

### 2026-11-09 15:49 KST · 결정·배포 조사 후 체크포인트

- D1/D2 승인과 D3 직접 조사 요청을 반영했다. 배포 OpenAPI 브라우저 접근 성공·현재 관련 schema 대조 및 GitHub test 배포 success/SHA 대응을 확보했다. 실행 프로세스 SHA의 직접 증명·업무 API/경계 자료·계정/복구 준비는 미확인이다.
- Aside는 연결을 사용할 수 없어 in-app browser로 문서를 읽었으며 로그인/Authorize/Try it out/업무 요청은 실행하지 않았다. 문서 원문에서 관련 schema만 추출했고 제품 UI/API QA 실행과 구분한다. 최초 직접 HTTP timeout은 최종 브라우저 접근 성공으로 보완했으며 서비스 장애로 단정하지 않는다.
- POL-07 정책 문서와 후속/QA 인계를 작성한다. 다음 첫 행동은 문서/소스 무결성 검사·읽기 전용 context-audit·ai-review·verifier다. 기준선/coverage·src/tests/package/설정·타 QA 이력은 보존한다. 자동 수정0/3, 최종 검증/리뷰·Git 전달 전이다.

### 2026-11-09 · 문서 검증/두 리뷰1차 후 종료 체크포인트

- 같은 branch/base의 POL-07 문서10개만 변경했다. 문서21/21·diff-check·ai-review와 read-only verifier1차 PASS. verifier는 보호454파일·원문20blob·기존6문서 prefix·79/99/신규16대기와 현재 검토 지문 일치를 독립 확인했고 저장소 수정은 하지 않았다.
- 체크리스트·WBS 완료/현재 없음·다음 DEV-09 준비와 첫 행동, 검토 기록을 갱신한다. 이 종료 변경도 문서 검사와 두 리뷰를 다시 수행한다. 검토 대상/결과는 로컬 `review-input-final.json`·verifier 최종 보고·`review-freshness.json` 및 PR/최종 보고에 보존한다.
- 남은 것은 종료 diff 재검증/재리뷰·승인된 Git 전달이다. 제품 구현/업무 API·mutation·서비스/배포·다음 Task 실행은 없고 신규16사례 대기·기존 차단/예외/reset Major·context-audit FAIL은 유지한다. 자동 수정0/3.

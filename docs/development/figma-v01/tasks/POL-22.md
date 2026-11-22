# POL-22 · 회사 조건을 개인 필터로 가져오는 정책

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 정책 결정
- 원본 항목: L11
- 선행 작업: [POL-06](POL-06.md)
- 목적/범위: 회사 기본값 가져오기 동작의 필드·덮어쓰기/병합·명시 적용·권한/빈 값을 결정한다. 추천: 자동 동기화 대신 사용자 명시 동작으로 가져온다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### L11 · 개인 필터 조회·수동 적용·계정 저장·초기화·409
- 기준선: UI **구현**, 동작 **구현**, 데이터 **API·mock**. 검증: 계약 테스트·기존 QA 기록.
- 남은 점: 실제 API 재검증 12건 대기; 회사 조건 명시 가져오기/고급 편집은 별도
- Figma: [2991:111897](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2991-111897) / [2991:112500](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2991-112500)
- 소유 소스/기존 기록: [src/components/bids/bid-list-client.tsx:170](../../../../src/components/bids/bid-list-client.tsx)、[src/components/bids/bid-list-client.tsx:207](../../../../src/components/bids/bid-list-client.tsx)、[docs/qa/personal-bid-filter.md:55](../../../../docs/qa/personal-bid-filter.md)

## 완료 기준

- [x] 회사 fixture/조회 모델과 기존 개인 필터의 버전·409 규칙을 확인한다
- [x] 가져오기/미리보기/저장 경계와 회사 미연결/결측 결과를 확정한다
- [x] 원문/소유 소스·버전·결정자·시각·선택/보류 이유를 기록한다. 추천안은 승인으로 간주하지 않는다.
- [x] 근거 있는 기존 승인 또는 필요한 개발자 결정을 확보하고, 후속 개발의 범위/완료 기준/차단을 갱신한다. 정책 작업도 Review Gate를 수행한다.

## 착수 전 Implementation Brief / 설계 Gate

아래는 최초 후보 정의의 착수 전 기록이다. 현재 확정 범위는 [2026-11-23 Brief](#pol-22-brief)에서 확인한다.

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

## 2026-11-11 · QA-17 전수 점검 보완

- 근거: [감사 CF-09](../audits/2026-11-11.md#cf-09) · [route/API·출처 인덱스](../audits/2026-11-11.json).
- 범위/소유: 명시적 회사import와 reset의 빈 SAVED를 분리한다. reset 로컬 불일치의 소유자는 DEV-63이다.
- 추가 완료/재개 기준: import-company endpoint가 존재해도 현재 실제 계약/권한·version/회사 값·명시적 전체 교체를 검증해야 한다. 초기화 뒤 자동import하지 않는다.
- 이 절은 날짜별 후속 계획이다. 앞선 결정/QA/예외 이력을 대체하지 않으며 제품 구현·실제 업무 API 변경/새 통합 PASS는 없다. 상태는 WBS에서만 관리한다.

<a id="pol-22-pol-21-handoff"></a>

## 2026-11-20 · POL-21 종료 시 선정 및 인계

- P0/P1과 앞선 P2의 기존 차단·선행을 적용했다. DEV-44는 가입 보정값을 포함하는 등록 계약을 기다리고, 이 작업의 [POL-06](POL-06.md#pol-06-contract) 선행은 이미 완료됐다. 표 순서에서 선행을 충족한 첫 P2 정책 후보로 선정했다. [POL-21 종료](POL-21.md#pol-21-close) · [WBS](../README.md)
- 첫 행동은 POL-06의 회사 조회 정책, L11의 개인 필터 화면·저장·버전/409와 회사 조건 가져오기 계약을 읽고 요구사항 Gate를 작성하는 것이다. 가져올 필드·가져오기와 저장의 경계·기존 필터 병합/교체·회사 미연결과 권한·빈 값에서 필요한 결정을 확인한다.
- 이 기록의 범위는 선정과 첫 행동이다. 전용 조사와 정책 결정, 제품 구현, 실제 QA 및 Git 전달은 새 작업에서 승인 범위를 확인한다.

<a id="pol-22-gate"></a>

## 2026-11-23 · 착수와 요구사항 Gate

- 08:29 KST, 실행자 Codex. 로컬 `main`과 `origin/main`의 `67c8b196909165ee74e0c385fa9ff72edf2f2e03` 및 깨끗한 작업트리를 확인하고 `docs/pol-22-company-filter-import-policy`를 만들었다. POL-06은 [PR #48](https://github.com/mate-pjt/mate-frontend/pull/48), 직전 POL-21 인계는 [PR #103](https://github.com/mate-pjt/mate-frontend/pull/103)으로 시작점에 반영됐다.
- 2026-11-23 사용자는 POL-22 정책 조사·문서 검증·두 리뷰, 목적별 커밋·push·PR·최종 head 확인·조건부 main 병합과 로컬 fast-forward를 승인했다. Chromatic 월간 한도가 원인인 이번 PR 검사에만 예외를 승인했다. 정책 선택과 실제 업무 API·데이터 변경·서비스 운영·배포 권한은 이 Git 전달 승인과 별개다.
- 성공 기준은 회사 데이터의 범위·투영, 전체 교체와 목록 적용·계정 저장의 경계, 권한과 빈 값·충돌 시 기존값 보존을 근거와 함께 기록하고 DEV-45의 재개·QA 기준에 연결하는 것이다. 현행 소스·게시 명세 조사와 후속 계획은 문서 범위다. 제품, Repository, mock/DTO, 실제 업무 요청과 후속 개발은 이번 범위에서 제외한다.

| Gate | 기존 결정과 확인한 제약 | 사용자에게 제시한 추천 |
| --- | --- | --- |
| D1 · 확인과 저장 | 중앙 ADR은 명시적 전체 교체를 결정했다. 현행 가져오기 API는 저장을 수행하며 전용 미리보기가 없다. `/bids`의 `내 맞춤`은 최신 GET과 수동 목록 적용만 제공한다. | 전체 교체와 즉시 계정 저장을 먼저 안내하고 확인한다. 목록에는 별도 `내 맞춤` 동작으로 적용한다. 정확한 사전 값 비교를 요구하면 동등한 읽기·확정 계약을 먼저 확보한다. |
| D2 · 권한 | 가져오기 소스는 인증 계정의 활성 현재 소속을 확인한다. 회사 희망금액의 별도 GET은 전체 leaf 집합을 검사한다. | 일반 구성원에게 투영 결과를 제공할 수 있는지와 회사 합치기 접근 경계를 소유자가 확인하기 전까지 노출을 보류한다. |
| D3 · 빈 값 | 활성 회사가 있으면 현행 소스는 모든 투영 값이 비어도 `canImportCompany=true`를 반환할 수 있으며 확인한 버전으로 빈 `SAVED`를 저장할 수 있다. | 값이 하나라도 있을 때만 확인한 전체 교체를 수행하고 전부 비면 기존값을 보존한다. 현행 API로 이를 안전하게 판정·강제할 수 없는 부분은 후속 계약 선행으로 둔다. |

조사 체크포인트의 다음 행동은 위 세 결정의 사용자 답변을 반영한 Brief를 제시하고, DEV-45 및 실제 QA의 재개 조건을 기록하는 것이다. 이 표의 추천은 사용자 승인 전 제안으로 보존한다.

<a id="pol-22-brief"></a>

## 2026-11-23 · 사용자 결정과 문서 Brief

08:30 KST, 이 대화에서 사용자가 D1~D3를 선택했다. 중앙 Accepted ADR의 필드 투영·명시적 전체 교체는 기존 결정이며, 아래 답변은 웹의 흐름과 기능 노출 조건에 적용한다.

| 질문 | 확정 내용과 승인 원문 | 선택 또는 보류 이유 |
| --- | --- | --- |
| D1 | “교체 확인 후 저장, 목록은 별도 적용 (추천)” | 확인이 계정 저장을 일으킨다는 사실을 알린다. 목록 변화는 기존의 별도 `내 맞춤` 행동에 연결한다. 현재 투영 결과의 정확한 사전 비교는 v1 범위에서 제외한다. |
| D2 | “백엔드·정책 소유자가 권한 경계를 확인할 때까지 기능 노출 보류 (추천)” | 회사 희망금액 조회와 개인 필터 투영의 서로 다른 접근 경계에 대해 허용 구성원, 항목 및 합치기 제한을 확인한다. 소유자 확인 전 노출을 보류한다. |
| D3 | “전부 비면 기존 값 보존, 일부 있으면 전체 교체 (추천)” | 회사 데이터 결측 때문에 기존 조건을 모두 지우는 일을 막는다. 가져올 조건이 일부 있으면 ADR대로 개인 필터 전체를 교체한다. |

- **요구사항과 성공 기준**은 L11의 회사 조건 가져오기에서 기존 정책, 사용자 결정, 현행 계약에서 지원하지 않는 부분을 식별하고 DEV-45와 QA에 연결하는 것이다. 실제 제품의 출시나 구현 완료는 DEV-45의 완료 기준을 따른다.
- **대상과 영향**은 이 작업 기록의 정책·근거, [DEV-45의 재개 조건](DEV-45.md#dev-45-pol-22-gate), [개인 필터 QA 계획](../../../qa/personal-bid-filter.md#pol-22-company-import-qa), [공통 계획](../../../ai-context/plan.md), [WBS](../README.md)와 다음 Task의 첫 행동, [검토 기록](../reviews/POL-22.md)이다. 화면·데이터 계층 구현, 실제 업무 API, 중앙 문서/백엔드 수정, 외부 요청 등록, 운영·배포는 범위 밖이다.
- AGENTS와 workflow·task-cycle, L11·CF-09, POL-02·POL-06, DEV-09의 화면 교정과 DEV-63의 reset, 기존 QA-10, `data-access.md`와 공개 Repository 경계를 대조했다. 기존 회사·필터 화면과 계약, QA 이력은 각 소유 작업에서 이어간다.
- **단계와 검증**은 사용자 결정과 현행 계약 기록, 개발·QA 기준 인계, 문서 링크·앵커·ID·의존성·상태·기준선/이력·Markdown 및 `git diff --check`, Documentation Update Check, 독립 verifier와 `$ai-review`, 최종 head CI와 Git 전달 순이다. 앱 코드·패키지·빌드에 영향이 없어 로컬 앱 test/lint/build/Storybook과 브라우저를 실행할 이유가 없다.
- **위험과 가정**은 권한/저장 보호가 현재 소스로 입증됐다고 해석하는 일과, 과거 화면 예외를 재사용하는 일이다. 현재 게시 명세·실행 버전·응답을 따로 판단한다. 임시 안내의 위치나 문구, 승인할 화면은 DEV-45 자체 Gate에서 결정한다. 담당 역할은 백엔드·중앙 정책 소유자, 프론트 구현·디자인 담당, QA와 데이터 사용 승인자이며 개인 배정은 미확인이다.

<a id="pol-22-sources"></a>

## 2026-11-23 · 소유 근거와 확인 수준

| 확인 수준 | 2026-11-23 관찰 |
| --- | --- |
| 중앙 정책 | `mate-docs/main` `c9e50ff591ae18023164e1a94581c611bf1e4f29`의 [Accepted ADR-0014](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/decisions/ADR-0014-separate-personal-bid-filter-from-company-profile.md#L31-L49)와 [공고 찾기 정책](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/bid/matching-and-related-notices.md#L99-L122)에서 개인 저장값의 우선, 현재 회사 기준 투영, 가져오기를 통한 명시적 전체 교체를 확인했다. |
| 백엔드 소스 | `mate-backend/dev` `ab388b7cb06154a00e254eff7b124882952166ac`의 [Controller](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/bid/personalfilter/PersonalBidNoticeFilterController.kt#L28-L60)와 [요청 DTO](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/bid/personalfilter/request/PersonalBidNoticeFilterRequests.kt#L59-L70)를 확인했다. `POST /api/v1/bid-notice-filters/current/import-company`의 입력은 nullable `expectedVersion`이며 `companyId`나 필터 값은 받지 않는다. 성공은 `source`, `version`, `canImportCompany`, `filter`를 담은 no-store 응답이다. |
| 빌드와 배포 기록 | 해당 dev SHA의 [CI #44429902651](https://github.com/mate-pjt/mate-backend/actions/runs/44429902651)은 2026-11-19 verify/publish/개발 deploy 성공, 운영 deploy skipped로 기록됐다. |
| 게시 명세 | [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs)를 `curl`로 GET하여 HTTP 200, OpenAPI 3.1.0, v1, 184 paths를 확인했다. 본문의 SHA-256은 `9e0b737fd92953b9f7a668aeecb61ce32b865bb3861999f9775fdfb523d21dd2`다. 개인 필터 GET/PUT·reset·import-company 및 회사 희망금액의 별도 GET/PATCH가 있다. import에는 미리보기, 회사에 묶인 확인값, 전체 결측 처리, 소스의 404/409 응답 설명이 명세화되어 있지 않다. |
| 실행 버전과 실제 동작 | 실행 중 SHA/이미지 digest와 실제 계정 응답은 미확인이다. 인증·필터·회사 관련 업무 API 요청, mutation, mock/HTTP 대역 및 제품 브라우저 확인은 미실행이다. |

| 소유 경계 | 소스에서 확인한 동작 |
| --- | --- |
| 투영 | [회사 소스 조회](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/bid/personalfilter/CurrentCompanyBidNoticeFilterSourceQueryPersistenceAdapter.kt#L20-L54)는 삭제되지 않은 회사의 활성 지역 한 건, 활성 회사-업종 연결의 활성·미삭제 master 코드 목록과 저장된 희망금액을 읽는다. [투영기](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/application/service/bid/personalfilter/CompanyBidNoticeFilterProjector.kt#L8-L31)는 세 영역을 개인 값으로 바꾼다. [회사 mock/기본 프로필](../../../../src/data/company/mock-repository.ts)의 `primaryIndustries`는 이 서버 투영의 대역이 아니며 회사 overview 내부 모델에는 저장 희망금액이나 회사 지역 코드 계약이 없다. |
| 접근 조건 | [개인 필터 서비스](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/application/service/bid/personalfilter/PersonalBidNoticeFilterService.kt#L79-L98)는 현재 회사 잠금 뒤 활성 소속을 재확인한다. 이 경로에는 회사별 전체 leaf 검사나 합치기 접근 등급의 명시적 검사가 보이지 않는다. 별도 [회사 희망금액 서비스](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companypreference/CompanyBidNoticePreferenceService.kt#L30-L43)는 전체 leaf 호환 검사를 수행한다. [POL-06](POL-06.md#pol-06-contract)은 회사 관리 조회의 권한과 합치기 제한을 결정했다. 그 승인을 개인 필터 가져오기에 확대 적용할 수 없다. |
| 실패와 버전 | 현행 소스 기준 회사 미발견·미연결은 `404 CO001`, 잠금 뒤 소속 상실/변경과 다른 값을 덮으려는 버전 충돌은 `409 C007`이다. [저장 어댑터](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/bid/personalfilter/PersonalBidNoticeFilterPersistenceAdapter.kt#L38-L103)는 첫 저장 `1`, 이후 값 변경 시 증가를 적용한다. 현재 값과 같은 요청은 과거 버전이어도 현재 version으로 성공할 수 있다. 이 동작은 값·version을 유지하는 서버 동작이며 클라이언트 자동 재시도의 근거는 아니다. |
| 현재 웹 | [공개 client](../../../../src/data/personal-filters/client.ts), [HTTP](../../../../src/data/personal-filters/http-repository.ts), [mock](../../../../src/data/personal-filters/mock-repository.ts)는 GET/PUT/reset을 제공한다. [목록](../../../../src/components/bids/bid-list-client.tsx)은 최신 GET과 수동 URL 적용으로 `내 맞춤`을 제공한다. 기존 계정 저장값이 있으면 서버의 GET은 `SAVED`를 돌려주므로 현재 회사의 투영 필터나 결측 여부를 확인할 수 없다. `canImportCompany`는 현행 회사 원천 존재 여부이며 권한 확정이나 가져올 값이 있다는 뜻이 아니다. |

| Figma·프레임과 상태 | 근거와 웹 범위 |
| --- | --- |
| L11 기준선 [2991:111897](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2991-111897) · [2991:112500](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2991-112500) | 2026-10-27 [L11 관찰](../baseline/audit-data.json)의 개인 필터 근거다. 회사 조건 가져오기와 고급 편집은 당시에도 별도 범위였다. 이 두 프레임에서 가져오기 확인창이나 권한/전부 결측 상태의 화면 예외 승인을 읽어내지 않는다. |
| 목록 도구 프레임 [2048:58606](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2048-58606) · [2098:65429](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2098-65429) | [DEV-09 사용자 교정](DEV-09.md#dev-09-ui-cleanup-brief)의 당시 대조에서 기본 도구와 `내 맞춤`을 유지했다. 현행 소스는 빈 GET이면 목록을 유지하고 조회 실패는 오류·명시 재시도를 제공한다. 새 저장 버튼, 진입 위치, 확인·결측·권한·충돌의 상세 UI는 DEV-45에서 화면별 승인과 접근성 QA를 확인한다. 이번 비교는 저장소의 기존 프레임 기록·소스에 한정하며 새 Figma 렌더링/픽셀 검증은 미실행이다. |

<a id="pol-22-contract"></a>

## 확정 정책 · 회사 조건 가져오기

### 복사할 값과 전체 교체

| 회사 원천 | 개인 필터로 저장하는 값 |
| --- | --- |
| 현재 사용 가능한 회사 지역 | 해당 `regionCodes` 한 건. 누락·비활성·삭제 지역이면 빈 배열. 주소 텍스트에서 코드 추정 금지. |
| 현재 사용 가능한 보유 업종 | 활성 연결과 활성 master에 대응하는 중복 없는 `industryCodes`. 해당 값이 없으면 빈 배열. 표시명·대표 업종이나 가입 임시값으로 대체하지 않는다. |
| 저장된 희망금액 | `ESTIMATED_PRICE`와 열린 경계가 가능한 정수 원 금액 구간. 출처의 `null`(미설정)과 `ANY`(제한 없음)는 회사 의미가 서로 다르지만 개인 금액 종류·경계에는 모두 `null`로 투영한다. |
| 기타 개인 조건 | `bidTypes`·`contractMethods`는 빈 배열, `dateType`·`dateFrom`·`dateTo`는 `null`, `regionOnly=false`, `jointContract=ALL`. 공고 유형/기간/공동도급 등을 회사 업종이나 실적·인증으로 추정하지 않는다. |

[회사 희망금액 enum](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/domain/company/enums/PreferredBidNoticeAmountRange.kt#L4-L13)과 개인 필터의 양끝 포함 규칙을 적용한다. 열린 경계는 `null`이다.

| 회사 희망금액 | `amountMin` | `amountMax` |
| --- | ---: | ---: |
| 1억 미만 | `null` | 99,999,999 |
| 1억 이상 5억 미만 | 100,000,000 | 499,999,999 |
| 5억 이상 10억 미만 | 500,000,000 | 999,999,999 |
| 10억 이상 50억 미만 | 1,000,000,000 | 4,999,999,999 |
| 50억 이상 | 5,000,000,000 | `null` |

D3에 따라 허용된 투영에 제한이 하나라도 있으면 개인 필터 전체를 회사 투영값과 기본값으로 교체한다. 투영이 전부 비면 기존 개인 저장값과 버전을 보존하고 첫 `SAVED` 행도 만들지 않는다. 권한 거절과 소스 오류는 결측과 구분한다. 현행 API는 활성 회사가 있으면 전부 빈 투영도 저장할 수 있으므로, 쓰기 시점에 서버가 현재 소속·자료·권한을 기준으로 전부 결측을 식별하고 기존값 보존을 보장해야 한다. `canImportCompany` 검사, 프론트의 사전 조회 또는 저장 후 되돌리기만으로는 이 조건을 충족할 수 없다. 보존 결과의 상태·코드와 같은 요청을 다시 받았을 때의 동작은 백엔드 소유 계약 확인 대상이다.

### 확인, 저장, 적용과 동시 변경

1. 가져오기 진입과 취소는 개인 저장 필터를 변경하지 않는다. 확인은 회사의 지역·업종·희망금액 범위로 개인 필터가 통째로 즉시 저장되며 그 밖의 선택이 초기화될 수 있음을 안내한다. 정확한 투영값 비교와 별도 저장 초안은 v1 범위 밖이다.
2. 사용자 확인으로만 현재 계정의 명령을 보낸다. 확인 시 읽은 `expectedVersion`을 사용하며 저장 이력이 없으면 `null`이다. 응답 `SAVED`는 계정 저장 결과다. 목록 URL과 현재 표시 조건은 별도 `내 맞춤`의 최신 GET 및 사용자 적용 단계에서 바뀐다. 기존 개인 PUT와 빈 `SAVED` reset은 각각 다른 사용자 행위다.
3. 409나 확인을 열고 있는 동안의 계정·소속 변경으로 확인 근거가 만료되면 이전 명령을 재생하지 않는다. 최신 읽기로 다시 확인할 근거를 얻고 사용자가 새로 선택하도록 한다. 401/403/404·소속 잠금·이미 처리됐는지 알 수 없는 응답은 각각 구분한다. 실패를 성공이나 빈 결과로 표시하지 않으며, 응답 유실 때는 읽기로 상태를 확인하고 POST를 자동 재전송하지 않는다. 한 번의 확인에서 중복 제출을 막고 세션/화면 종료 뒤 도착한 응답을 다른 계정이나 탐색에 반영하지 않는다.
4. D2에 따라 소유자가 허용할 leaf·소속/합치기 접근 등급·희망금액 포함 범위를 결정하고 서버 계약·부정 사례에서 확인하기 전에는 가져오기 기능을 노출하지 않는다. 다른 회사 선택, 역할 이름이나 직급에 의한 권한 추정, 회사 희망금액 조회 실패에서 다른 공급원으로 가져오는 동작은 범위 밖이다. 기존 미저장 계정의 `COMPANY_DEFAULT` 조회는 별도 계약이며 소유자가 권한 차이를 평가할 때 함께 확인할 근거다.

DEV-45의 독립 Gate에서 DEV-08 선행, 소유 계약(D2·D3), 현행 실행 대응, 진입 위치와 화면 승인, 합성 회사·계정·기존 개인 필터·권한/충돌 시나리오의 실제 사용 및 변경·잔존·복구 승인을 확인한다. [DEV-45 인계](DEV-45.md#dev-45-pol-22-gate) · [가져오기 QA 계획](../../../qa/personal-bid-filter.md#pol-22-company-import-qa)

확인 시점과 서버가 처음 활성 소속을 읽는 시점 사이의 변경도 DEV-45 계약 확인에 포함한다. 현재 `expectedVersion`은 개인 행에만 적용되고 서버의 잠금 뒤 재검사는 서버가 처음 읽은 소속을 기준으로 한다. 확인을 받았던 회사와 요청이 사용할 회사가 다를 때 기존 저장값 보존을 보장할 계약을 확인한다.

<a id="pol-22-close"></a>

## 2026-11-23 · 검증과 인계 체크포인트

- 08:34 KST, 정책·재개 조건과 CIMP-01~10 계획을 작성했다. `python3 validate_docs.py --phase 검증`과 `git diff --check`에서 원본 79개·WBS 작업 114개·선행 연결 156개, 기존 QA 12차단·10개 신규 미실행 계획, 변경된 문서의 링크와 Markdown을 확인했다. 초기 문서 검사 자동 수정 0/3. 로컬 `pnpm test/lint/build/build-storybook`과 브라우저는 문서 전용이라 미실행이다.
- Documentation Update Check에서 WBS, 두 관련 Task, 검토 기록, 공통 계획, 개인 필터 QA를 갱신 대상으로 확인했다. `coverage.md`는 기존 L11–POL-22/DEV-45/QA-10 연결과 원본·매핑이 맞으며 수정 필요가 없다. `base.md`·`architecture.md`·`data-access.md`·`harness.md`·`ai-failures.md`는 패키지/실행 계약·구조·하네스나 이번 실패 예방 규칙의 변화가 없어 추가 수정 대상이 아니다. [context-audit](../reviews/POL-22.md#pol-22-context-audit)
- read-only verifier와 `$ai-review`의 첫 검토를 통과했다. 확인 시점과 서버의 최초 소속 조회 사이의 경쟁 범위를 명확히 해 DEV-45 및 CIMP-08에 연결했다. 종료 WBS와 이 보완을 포함한 diff를 검증·재검토하고 전달한다. [두 리뷰 기록](../reviews/POL-22.md)
- 다음으로 [DEV-64](DEV-64.md)를 선정했다. POL-29는 [PR #51](https://github.com/mate-pjt/mate-frontend/pull/51)로 main에 반영됐다. 앞선 P0/P1 및 P2의 기존 차단과 선행을 적용했다. DEV-45는 DEV-08과 서버 계약을 기다리며 DEV-64의 첫 행동은 승인 상세 frame과 현재 소스·상태 기준을 대조해 자체 Brief를 쓰는 것이다.

<a id="pol-22-delivery"></a>

## Git 전달 체크포인트

- 승인된 전달 범위는 이 기록의 [착수 승인](#pol-22-gate)과 [전체 전달 절차](../task-cycle.md)를 따른다. 검증·두 리뷰의 종료 근거는 [검토 기록](../reviews/POL-22.md)에 보존한다.
- [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fpol-22-company-filter-import-policy)에 `type: docs`를 지정하고 최종 head의 검사·리뷰·최신 base·병합 조건을 확인한다. 월간 한도로 확인된 이번 Chromatic 문제만 승인된 예외가 된다. 작은 커밋을 보존하는 merge commit으로 병합한 뒤 로컬 main을 fast-forward하고 양쪽 SHA와 작업트리를 확인한다.

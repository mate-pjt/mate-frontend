# POL-06 · 가입 후 회사 실적·인증·희망금액 조회 계약

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 정책 결정
- 원본 항목: M04
- 선행 작업: [DOC-001](DOC-001.md)
- 목적/범위: 회사 관리용 모델·조회 권한·자료 연도/기준일·null/미보유 의미를 확정한다. 추천: 가입 화면의 표시 기반은 재사용하되 overview와 등록 모델을 구분한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### M04 · 가입 후 실적·인증 3종·희망금액 대시보드
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **overview 모델에 없음**. 검증: 코드 대조.
- 남은 점: 가입 과정에서 보던 실적/인증/희망금액을 회사 관리 화면에서도 조회하도록 확장
- Figma: [3134:64574](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3134-64574) / [3134:66829](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3134-66829)
- 소유 소스/기존 기록: [src/components/my/my-company-client.tsx:267](../../../../src/components/my/my-company-client.tsx)、[src/data/company/contracts.ts:171](../../../../src/data/company/contracts.ts)、[docs/qa/my-company.md:8](../../../../docs/qa/my-company.md)

## 완료 기준

- [x] 현재 overview와 가입 정보의 필드/권한 차이를 기록한다
- [x] 실적/인증 3종/희망금액의 기준·결측·미인증 표시를 확정한다
- [x] 원문/소유 소스·버전·결정자·시각·선택/보류 이유를 기록한다. 추천안은 승인으로 간주하지 않는다.
- [x] 근거 있는 기존 승인 또는 필요한 개발자 결정을 확보하고, 후속 개발의 범위/완료 기준/차단을 갱신한다. 정책 작업도 Review Gate를 수행한다.

## 착수 전 Implementation Brief / 설계 Gate

2026-11-09 사용자3답변 확보 후 확정해 편집 전에 제시했다. 아래는 POL-06 문서 산출물의 Brief이며 DEV-08 구현 Brief를 대신하지 않는다.

- 요구사항: M04 가입 후 회사 조회에 사용할 모델·권한·자료 연도/기준일·결측 의미를 현행 소유 계약과 대조해 **소스 정책 v1**으로 결정한다. 배포 확인이나 제품 구현 완료가 아니다.
- 성공 기준: overview/가입/회사 조회 차이, 아래 확정 정책과 소유 SHA·사용자 결정, DEV-08 범위/재개 조건·12개 QA 계획을 연결한다. 문서 검사와 두 리뷰를 통과하고 기존 실제 QA/차단/예외를 보존한다.
- in scope: 본 Task, WBS, DEV-08 정책 인계, 회사 QA 신규 계획, plan 날짜별 진입 링크, 검토 기록의 Markdown6파일. 소유 원문은 읽기 전용이다.
- out scope: 런타임/DTO/mock/테스트 구현, 가입 UI 수정, 실적 재수집·회사 수정·이력/as-of/기간 직접 선택, 권한 확대·개인 필터 가져오기, 새 라이브러리, 실제 로그인/업무 API·mutation·외부 메시지·서비스 운영/배포. Figma 기준선은 과거 근거로만 사용하며 새 디자인/픽셀 검증을 주장하지 않는다.
- 확인한 파일/패턴: AGENTS·세 Skills·verifier, baseline M04/coverage·workflow/task-cycle·DOC-001/POL-05 인계, base/plan/architecture/data-access/harness/ai-failures, package/PR template. frontend 회사 contracts→client/HTTP/mock→overview/가입 UI와 기존 MCO/AUTH QA, 아래 고정 중앙/Backend 소스를 대조했다.
- 파일/영향: `tasks/POL-06.md`, `README.md`, `tasks/DEV-08.md`, `docs/qa/my-company.md`, `docs/ai-context/plan.md`, `reviews/POL-06.md`. 코드·공급원·계정/저장소·업로드·패키지·빌드·하네스에 영향 없음.
- 단계: 사용자 결정/시작 기준 기록 → 소스 정책/DEV-08 재개·QA 계획 → 문서 검증·read-only context-audit → read-only verifier/ai-review → 종료 diff 재검토 → 목적별 문서 commit/push·PR/라벨·실제 head CI/병합 조건 확인·정상 merge·로컬 main FF. Git 전달은 이번 단일 Task 요청으로 승인됐다.
- 검증: 로컬 `validate_docs.py`, 링크/anchor·79개 원본/99개 Task·의존성/상태·원본 hash·기존 QA/타 Task/무관 파일 보존·`git diff --check`. Markdown 전용이므로 로컬 pnpm test/lint/build/build-storybook·Next/브라우저는 미실행하며 원격 CI 결과와 별도 기록한다. shell Node26.5.0/pnpm11.3.0, `.nvmrc`/CI pin22.20.0을 확인했다.
- 가정/위험: source commit은 실행/배포 증명이 아니다. 중앙 정책과 frontend 가입 단일 모델·Backend의 확정 조회 모델 차이를 묵시적으로 통합하지 않는다. 사용자3결정으로 본 정책의 blocking ambiguity는 해소됐으며 배포/합성 자원 미준비는 DEV-08 필수 차단으로 인계한다. 로컬 구현 선행 예외 없음.

## 결정 기록

| 날짜 | 질문/선택지와 추천 | 결정·근거·승인자/원문 | 영향 |
| --- | --- | --- | --- |
| 2026-10-27 | 작업 후보 분해 | 정책·API·제품 동작 신규 승인 없음 | 착수 시 Gate 수행 |
| 2026-11-09 / 사용자 · 이 대화 질문1 답변 | 업종·세부 공종별 시공능력/인증3종/서버 기본6개 연도 공사실적/회사 희망금액, 결측 추정 금지·null/ANY 구분 추천 | 원문: “추천 조회 범위 채택” | 아래 v1 범위 채택. 과거시점/기간 직접 선택·수정 제외 |
| 2026-11-09 / 사용자 · 질문2 답변 | 정보조회 leaf와 희망금액 전체 leaf 집합 제한의 현행 차이 유지 추천 | 원문: “현재 권한 차이 유지 (추천)” | role/직급으로 허용하지 않고 희망금액 제한과 다른 조회를 분리 |
| 2026-11-09 / 사용자 · 질문3 답변 | 배포/schema·실행 대응·합성 권한별 계정/회사·경계 자료·안전한 오류·사용/잔존/복구 미준비 시 DEV-08 차단 추천 | 원문: “미준비 — 소스 정책 확정, DEV-08 차단 (추천)” | POL-06은 소스 정책만 확정. DEV-08 구현/실제 통합 차단, 로컬 선행 예외 없음 |

<a id="pol-06-sources"></a>

## 현재 소유 근거 · 2026-11-09

- frontend 조사/작업 시작: `0fd43142e81d650a3dbcb190cdcc6fece133bbda` / clean main. DOC-001·POL-05 전달 반영 확인 후 `docs/pol-06-company-dashboard-contract` 생성. 응답 재개 시 원격 main 동일·기존 조사 Markdown2파일만 dirty인 것을 재확인했다.
- 중앙 문서 main: `c9e50ff591ae18023164e1a94581c611bf1e4f29`; Backend dev: `1f3b8544dee49fa3936b3229114a58cd9eb7432c`. 아래는 **소스** 근거다. 배포 schema/version·현재 실행 SHA·권한별 실제 응답은 미확인이다. Backend의 임시 출처 메모는 규범으로 사용하지 않았다.
- 로컬 [소유 원문 snapshot](/Users/jisung/.codex/visualizations/2026/11/09/01a1bed3-03bb-77e1-afbf-d730920f7a02/pol-06/source-contract.json)은 읽은 정책/소스23개와 ref/path/blob 지문을 보존한다. 23/23 blob 일치. 개인정보/환경/인증·업무 응답을 수집한 기록이 아니다.

| 소유 자료 | 확인한 계약 |
| --- | --- |
| [회사 개요·프로필](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/company/overview-and-profile.md) · [권한](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/company/permissions.md) | 원천/확정값 구분·근거 시점·합산 금지·UNKNOWN/NO 분리·leaf 원천/role 표시 경계 |
| [조회 Controller](https://github.com/mate-pjt/mate-backend/blob/1f3b8544dee49fa3936b3229114a58cd9eb7432c/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companyprofile/CompanyProfileQueryController.kt) · [조회 응답](https://github.com/mate-pjt/mate-backend/blob/1f3b8544dee49fa3936b3229114a58cd9eb7432c/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companyprofile/response/CompanyProfileQueryResponses.kt) | capability/current·asOf, 인증3종·provenance, 저장 SUCCESS 연도별 공사실적의 별도 GET/DTO. Controller의 ADMIN 주석을 실제 검사로 오인하지 않음 |
| [시공능력 service](https://github.com/mate-pjt/mate-backend/blob/1f3b8544dee49fa3936b3229114a58cd9eb7432c/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companyprofile/query/CompanyConstructionCapabilityQueryService.kt) · [인증 service](https://github.com/mate-pjt/mate-backend/blob/1f3b8544dee49fa3936b3229114a58cd9eb7432c/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companyprofile/query/CompanyPublicCertificationQueryService.kt) · [실적 service](https://github.com/mate-pjt/mate-backend/blob/1f3b8544dee49fa3936b3229114a58cd9eb7432c/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companyprofile/query/CompanyPublicProcurementPerformanceQueryService.kt) | 실제 `COMPANY_INFORMATION_VIEW` 검사, 저장 관측만 조회, 누락 인증 type은 source 없는 UNKNOWN |
| [공사실적 연도 정책](https://github.com/mate-pjt/mate-backend/blob/1f3b8544dee49fa3936b3229114a58cd9eb7432c/mate-api/src/main/java/kr/co/mate/mate_api/domain/companyprofile/query/PublicProcurementPerformanceQueryPolicy.kt) · [실적 기간](https://github.com/mate-pjt/mate-backend/blob/1f3b8544dee49fa3936b3229114a58cd9eb7432c/mate-api/src/main/java/kr/co/mate/mate_api/domain/companyprofile/statistics/PublicProcurementPerformancePeriod.kt) | 서울 현재연도, DEFAULT_YEAR_COUNT=6/최대10·inclusive 범위, CURRENT_YTD/COMPLETED_YEAR·관측 시각 |
| [확정값/대표 상태](https://github.com/mate-pjt/mate-backend/blob/1f3b8544dee49fa3936b3229114a58cd9eb7432c/mate-api/src/main/java/kr/co/mate/mate_api/domain/companyprofile/projection/CompanyProfileEffectiveValue.kt) | source3종·인증3상태·대표 SELECTED/NONE/UNDETERMINED. 대표를 최대 금액/첫 행으로 고르지 않음 |
| [희망금액 service](https://github.com/mate-pjt/mate-backend/blob/1f3b8544dee49fa3936b3229114a58cd9eb7432c/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companypreference/CompanyBidNoticePreferenceService.kt) · [권한 service](https://github.com/mate-pjt/mate-backend/blob/1f3b8544dee49fa3936b3229114a58cd9eb7432c/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companymembership/CompanyAuthorizationService.kt) · [금액 enum](https://github.com/mate-pjt/mate-backend/blob/1f3b8544dee49fa3936b3229114a58cd9eb7432c/mate-api/src/main/java/kr/co/mate/mate_api/domain/company/enums/PreferredBidNoticeAmountRange.kt) | 현재 전체 leaf 집합·회사 일치/활성 소속 검사, 합치기 READ_ONLY_MEMBER는 희망금액 호환 검사에서 차단, 추정가격 고정 구간·null/ANY |

### 현행 frontend와 가입/회사 조회의 차이

| 영역 | 현재 frontend/가입 | 회사 관리 조회 정책의 차이 |
| --- | --- | --- |
| overview | [CompanyOverview/CompanyBasicProfile](../../../../src/data/company/contracts.ts) connected는 기본 프로필만. [HTTP](../../../../src/data/company/http-repository.ts)의 refresh→현재 회사 GET/내 신청, [화면](../../../../src/components/my/my-company-client.tsx)은 기본8개 값 표시 | 기본 상태/오류 경계 유지. 별도 조회 결과를 회사/계정별로 조합해야 하며 signup 데이터를 현재값으로 복사하지 않음 |
| 시공능력 | SignupCompanyProfile.capability의 단일 amount/year/대표면허/sourceSnapshotDate. [가입 패널](../../../../src/components/auth/company-registration.tsx)은 연도 null일 때 ‘최근’, 금액을 억 단위로 반올림 | 회사 조회는 업종별 세부 공종 다수·대표 파생 상태/각 provenance. 제목·금액 포맷만 재사용해 의미를 잃지 않음 |
| 인증3종 | 가입 certifications map은 status와 optional snapshotDate. Y/N/정보 없음 표시. 가입 계약은 느슨한 string | 확정 조회의 YES/NO/UNKNOWN과 row 부재/source·snapshotDate/confirmedAt 구분을 보존. 회사 VERIFIED 배지와 별개 |
| 공사실적 | 현재 가입/overview 내부 모델에 없음 | 저장된 성공 관측의 연도·실제 기간·건수/원화금액·출처/관측시각을 별도 읽음. 가입 시 표시됐다고 주장하지 않음 |
| 희망금액 | 가입 단계의 BidAmountRange 선택은 등록 요청 입력이며 overview 반환값이 아님. mock 등록도 현재 기본 프로필만 보존 | 회사에 저장된 선호를 별도 GET. 가입 임시 상태/개인 필터로 대체하지 않음 |
| 권한/기본 업종 | frontend overview에는 leaf 정보 없음. primaryIndustry 하나만 소비 | Backend 기본 응답은 primaryIndustries/updatedAt도 보유. DEV-08 Gate에서 실제 DTO 대응과 조회 bootstrap을 검토하며 이번에 기본 정보/가입 코드를 변경하지 않음 |

<a id="pol-06-contract"></a>

## 가입 후 회사 조회 소스 정책 v1 · 사용자 확정 2026-11-09 KST

적용 결정자: 이 대화의 사용자. 적용 범위: POL-06 결정 산출물과 DEV-08의 후속 Gate. 배포 적용일/실제 서버 버전은 미확인이다.

| 영역 | 확정한 읽기/표시 의미 |
| --- | --- |
| 대상/모델 | 연결된 현재 회사의 기본 overview와 독립 조회 section을 조합한다. 가입 SignupCompanyProfile과 회사 관리 모델을 분리하고 회사/계정 교체·소속 해제 뒤 이전 응답/값을 버린다. 현재 자료를 읽는 GET이 외부 수집/제안 승인/가입 mutation을 시작하지 않는다 |
| 시공능력 | `GET /api/v1/companies/{companyId}/construction-capability-assessments`, v1은 asOf 생략 current. industries[].assessments의 공종명·amountKrw·assessmentYear·representativeLicense·snapshotDate·provenanceType을 유지하고 금액을 합산하지 않는다. 대표는 서버 representativeStatus/representativeAssessmentId를 유지, 최고 금액/첫 항목으로 선택하지 않는다. SELECTED/NONE/UNDETERMINED를 ‘선택됨/없음/판단 불가’로 구분한다 |
| 능력 결측/0/기준 | assessmentYear=null은 ‘평가연도 정보 없음’, snapshotDate=null은 ‘자료 기준일 정보 없음’. 시스템 현재연도·‘최근’·snapshot 연도로 평가연도를 추정하지 않는다. amountKrw=0은 확인된 0원, 빈 assessments는 확인된 평가 자료 없음이다. 대표면허 true/false/null은 해당/비해당/확인 불가. unmappedObservationCount는 미매칭 자료가 있다는 사실로 보존하고 가짜 평가액을 만들지 않는다 |
| 인증3종 | `GET .../public-certifications`. WOMEN_OWNED/여성기업, DISABLED_OWNED/장애인기업, SOCIAL_ENTERPRISE/사회적기업을 각각 표시한다. YES=자료 기준 해당, NO=자료 기준 비해당, UNKNOWN=확인 불가. 저장 row 부재(version0/source null)와 관측 UNKNOWN을 provenance로 구분하고 누락/실패를 NO 또는 ‘미인증’으로 만들지 않는다 |
| provenance | AUTO_INITIAL/ADMIN_ACCEPTED_EXTERNAL/ADMIN_MANUAL의 자동 초기값/관리자 승인 외부값/관리자 수기값 구분을 유지한다. snapshotDate는 외부 자료 기준일, confirmedAt은 관리자 확정 시각이다. manual의 snapshot null을 오류나 외부 인증으로 바꾸지 않는다. 별도 증명서 유효기간·참가자격 보장을 추정하지 않는다. 회사 등록 VERIFIED/UNVERIFIED/LEGACY와 공공인증3종을 혼동하지 않는다 |
| 공사실적 | `GET .../public-procurement-performances`, fromYear/toYear 생략. 서버 DEFAULT_YEAR_COUNT=6과 Asia/Seoul 현재연도를 사용한다(2026년이면 2021~2026 inclusive). 반환 fromYear/toYear를 기준으로 표시하고 클라이언트 연도로 대체하지 않는다. 저장된 연도별 최신 SUCCESS만 읽으며 조회 때 외부 API 재수집 없음. v1에 직접 기간 입력은 없음 |
| 실적 기간/누락 | basisYear·periodType(CURRENT_YTD/COMPLETED_YEAR)·periodStart/periodEnd·observedAt·linkSystemName을 보존한다. 당해년 저장 누적을 오늘까지의 실시간/연간 확정 실적으로 표현하지 않는다. 누락 연도/빈 items는 ‘확인된 저장 자료 없음’, 반환 성공의 건수0/금액0은 확인된 0이다. 원 API가 누락 원인을 주지 않으므로 NO_DATA/identity 불일치/외부 실패 중 하나로 추정하지 않는다 |
| 숫자 | 원 단위 amount와 건수를 정확히 보존한다. 가입 억 단위 반올림을 원값 비교/저장/대표 선택 기준으로 쓰지 않는다. Backend BigDecimal/정수는 JS 안전 범위를 넘을 수 있으므로 DEV-08의 DTO Gate·경계 테스트에서 정밀도 손실 없는 표현을 확인한다. 무검증 number 변환·절삭·0 대체 금지 |
| 회사 희망금액 | `GET .../bid-notice-preferences`의 preferredBidNoticeAmountRange를 읽는다. null=미설정, ANY=제한 없음. 이는 회사의 **입찰공고 추정가격** 선호이며 시공능력/실제 계약금액이나 개인 필터 상태가 아니다. 가입 저장값을 추측하거나 개인 필터를 가져오는 행동은 하지 않는다 |
| 권한 | 시공능력/인증/실적은 활성 계정·현재 회사의 활성 소속·`COMPANY_INFORMATION_VIEW`와 서버 합치기 접근 정책으로 조회한다. 희망금액은 현재 모든 leaf 집합을 요구하는 호환 검사와 합치기 잠금을 유지한다. `ADMIN`/직급/대표자명으로 허용하지 않는다. 현행 소스의 `GET .../memberships/me`·permission catalog를 이용한 bootstrap의 배포/DTO는 DEV-08 Gate에서 확인한다. UI 가시성은 서버 검사의 대체가 아니다 |
| 부분 제한/실패 | 희망금액 권한이 없으면 그 영역에 권한 안내를 표시하고 시공능력/인증/실적은 유지한다. 403/잠금·조회 실패를 미설정/null/0/NO로 바꾸지 않는다. section별 loading/empty/error/명시 재시도와 기본정보 오류를 구분한다. 최종401/로그아웃·계정 변경/소속 해제 후 보호 자료를 제거하고 이전 사용자 행동을 자동 재생하지 않는다. 다른 계정/회사 자료를 재사용하지 않는다 |
| 경계 | 기존 7개 source의 company 그룹·public client/contracts 경계와 snapshot/hybrid/production guard·자동 fallback 금지·계정별 탭 저장소/opaque upload 정책 유지. 새 source/API/BFF를 가정하지 않는다. 가입 직접 편집 POL-21, 회사 수정/갱신 POL-12, 개인 필터 가져오기 POL-22는 범위 밖 |

금액 구간은 최소 포함/최대 미포함인 소유 enum을 따른다. 표시값과 정확한 경계는 아래와 같다.

| 값 | 의미 |
| --- | --- |
| BELOW_100_MILLION | 1억 미만 |
| FROM_100_MILLION_TO_500_MILLION | 1억 이상 5억 미만 |
| FROM_500_MILLION_TO_1_BILLION | 5억 이상 10억 미만 |
| FROM_1_BILLION_TO_5_BILLION | 10억 이상 50억 미만 |
| AT_LEAST_5_BILLION | 50억 이상 |
| ANY / null | 제한 없음 / 미설정 — 서로 대체하지 않음 |

<a id="pol-06-handoff"></a>

## DEV-08 인계 · 필수 차단과 재개 조건

사용자 질문3 답변으로 **배포/실제 통합 자원 미준비**를 확인했다. DEV-08은 소스 정책 선행만 확보했으며 **구현 미착수·실제 통합 차단**, 로컬 구현 선행 예외도 없다. POL-06 문서 PASS나 Git 병합으로 이 조건을 충족시키지 않는다.

| 필요한 조건 | 확보할 근거/담당 역할 | 미확보 시 |
| --- | --- | --- |
| 배포/실행 대응 | API/배포 담당의 배포 OpenAPI/schema/version·위 GET/권한 bootstrap/catalog·실제 wrapper/오류 계약, frontend/backend 실행 SHA/배포 ID 대응·Origin/인증 조건 | 오래된 source/branch SHA로 대체하지 않고 DEV-08 Gate 차단 |
| 승인된 합성 자원 | fixture 담당의 회사/계정 별칭·활성 연결/미연결/소속 해제·정보조회 leaf/전체 leaf/타 회사·합치기 read-only·기대값 | 운영/개인 자료를 읽거나 임의 계정/회사·권한/상태 생성하지 않음 |
| 경계 자료 | 업종별 복수 평가·대표3상태·연도/기준일 null·0·provenance3종, 인증 YES/NO/UNKNOWN/row 부재, 실적 기간/0/누락/대형 정수, 희망 enum/null/ANY | [CDASH-01~12](../../../qa/my-company.md#pol-06-company-dashboard-qa)의 실제/로컬 검증을 통과로 세지 않음 |
| 사용/잔존/복구 | 승인자의 로그인·refresh POST/위 GET 사용 범위, 읽기 이력/합성 자료 잔존 허용·종료/복구 방법과 책임, 필요한 등록→조회 확인의 별도 mutation/원복 범위 | 이번 Git 승인을 실제 API/mutation 승인으로 확대하지 않음 |
| 안전한 오류 | API/QA 담당의 401/403/잠금/404/부분 실패·정밀도/계정 경쟁 재현과 안전한 해제·복구 조건 | 가로채기/HTTP 대역을 실제 서버 오류 PASS로 대체하지 않음 |
| DEV-08 자체 Gate | 최신 source/design/배포 차이·요구사항/모델/수정 파일/단계·기존 기본정보 회귀·package scripts·실제 Next/브라우저·두 리뷰 계획 | 새 대화에서 재확인. 이번 대화에서 구현하지 않음 |

담당 역할만 식별했으며 개인 배정은 미확인이다. 모든 적용 조건 확보 후 DEV-08 요구사항 Gate부터 재개한다. [DEV-08 인계](DEV-08.md#dev-08-pol-06-handoff)에 동일 조건을 연결하고 기존 QA-05 MCO4통과·6차단/AUTH-07·08 및 QA-06/07과 타 정책·실제 QA 예외는 보존한다.

## 체크포인트 · 재개 메모

| 시각/실행자 | 환경·branch/HEAD·작업트리 | 수행/결과·근거 | 다음 행동·차단/재개 조건 |
| --- | --- | --- | --- |
| 2026-10-27 / 문서화 | feature/my-company-overview / f84af24b5f9d + 기존 미커밋 변경 | 보고서에서 작업 정의만 생성. 구현/실제 QA 미실행 | 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다. |

## 검증·리뷰·인계 기록

| 구분 | 실행 명령/사례·환경 | 결과 | 증거/미실행 이유 |
| --- | --- | --- | --- |
| 문서 검사 | 로컬 validate_docs.py / Python3 | 17/17 PASS | 링크/anchor·79/99·선행 DAG/M04·타96 WBS행·기준선/coverage5파일·기존 prefix·범위 보존 |
| 소유 snapshot | source-contract.json의 Git blob 재계산 | 23/23 PASS | 고정 소스만 확인; 배포/실제 API 증거 아님 |
| 공백 | git diff --check | PASS | 문서6파일 대상 |
| read-only context-audit / primary ai-review / 독립 verifier1 | 현재 소스/문서와 실제 diff | PASS | [검토 여섯 섹션/감사](../reviews/POL-06.md), 종료 diff freshness 재검토는 아래 로컬 근거 |
| 로컬 앱 / mock / HTTP 대역 / 실제 API | 미실행 | 미판정/차단 | Markdown 전용 대체 검증. CDASH 실제0통과·12차단·실행0건; DEV-08 필수 자원 미준비 |

- 자동 수정 시도: 1/3 — 첫 문서 checker가 유형열을 상태열로 검사한 파서 오류를 수정하고 동일 검사 재통과. 제품/정책 수정 없음.
- Documentation Update Check: Task/WBS·DEV-08·회사 QA·plan 진입점·검토6문서 갱신. package/scripts·현행 구조/규칙·하네스 변경 없음으로 base/architecture/data-access/harness 갱신 불필요. 새 반복/고위험 수행 사건 근거가 없어 ai-failures 추가 불필요. baseline/coverage 매핑은 보존.
- Review Gate: 문서17검사·primary ai-review 여섯 섹션/context-audit·독립 verifier1 PASS, 미해결 Blocker/Major/Minor0. 종료 체크리스트/WBS·다음 Task 기록 후 문서 검사/ai-review·verifier freshness를 다시 확인한다. 최종 도구 결과는 [검토 기록](../reviews/POL-06.md)의 로컬 receipt 및 PR/최종 보고에서 확인한다.
- 커밋/PR: 리뷰 후 정책/인계·QA 계획과 검증/종료 기록을 목적별 문서 커밋으로 분리한다. 실제 PR head CI/병합 조건·main FF와 clean/동일 SHA는 로컬 delivery receipt·PR/최종 보고로 확인한다. 이 문서에 자기 commit SHA를 반복 갱신하지 않는다.
- 다음 작업 인계: **POL-07**. DEV-08은 배포/합성 자원 미준비·로컬 예외 없음으로 차단 유지. P0 QA-16 등은 미충족 선행/기존 차단을 보존하고, P1 이후 P2 표 순서상 첫 독립 DOC-001 선행을 충족한 POL-07을 이번 요청7항에 따라 선택한다. 다음 Gate 선정이며 기존 차단 해소/검증 면제가 아니다.
- 다음 첫 행동: 새 대화에서 최신 main/작업트리·WBS·POL-07 마지막 체크포인트/L07~L10 기준선을 확인하고 현재 공개 목록/개인 필터 모델·URL·소유/배포 계약의 고급 지역·날짜/기간·금액 범위/낙찰금액 차이를 조사해 요구사항 Gate를 제시한다. POL-07은 이 대화에서 시작하지 않는다.


## 2026-11-09 · 요구사항 Gate 조사 체크포인트

- 시작: `main` / `0fd43142e81d650a3dbcb190cdcc6fece133bbda`, clean. `git fetch origin main` 후 local/main·origin/main 동일, DOC-001 및 선행 POL-05 전달 commit `2ecd694` main 포함 확인. `git merge --ff-only origin/main` 후 `docs/pol-06-company-dashboard-contract` 생성. 기존 변경 없음.
- 적용: AGENTS·feature-workflow·ai-review, 현행 소스와 문서의 정합성을 확인하는 read-only context-audit. 정책 결정 하나이며 런타임/테스트/패키지/환경/서비스/업무 API 변경은 범위 밖.
- 조사: 현행 frontend의 basic-only overview, 가입 단일 capability/인증 map·가입 입력 금액과 현재 중앙 회사 프로필/leaf 권한·backend dev의 별도 조회 endpoint/응답·서비스를 대조. 중앙 main `c9e50ff591ae18023164e1a94581c611bf1e4f29`, backend dev `1f3b8544dee49fa3936b3229114a58cd9eb7432c`. 소스 SHA는 배포 실행 식별자가 아니다.
- 발견: 시공능력/인증/공사실적 GET은 `COMPANY_INFORMATION_VIEW`, 희망금액 GET은 현재 전체 leaf 집합 호환 검사. Controller의 ADMIN 주석과 실제 service 검사가 달라 service/권한 소유 소스를 우선했다. 가입 모델 그대로 재사용/role 기반 접근 허용은 확정하지 않았다.
- 편집 전 제시한 후보: 본 Task·WBS·DEV-08 인계·회사 QA 계획·plan 링크·reviews/POL-06의 Markdown6파일. 문서 링크/anchor·79/99 ID/의존/상태·기준선/기존 QA/무관 파일 보존·diff-check, read-only verifier와 ai-review. 앱 명령은 Markdown 전용 대체 검증 사유를 기록할 계획이다.
- 개발자 질문3개 전달: 조회 범위/6개 연도·결측 의미, 현재 권한 차이 유지, 배포/합성 자원 준비 및 DEV-08 차단 범위. 아직 미답변이며 추천안은 승인으로 간주하지 않는다. 정책 설계/확정·DEV-08 구현 미착수, 실제 앱/API 실행0건.
- 다음 첫 행동: 사용자 답변으로 blocking ambiguity 해소 후 Implementation Brief/설계를 확정해 제시하고 v1 소스 정책·재개 조건을 기록한다. 답변 전에는 독립적인 문서/소유 근거 확인만 진행한다. 자동 수정0/3.


## 2026-11-09 · 사용자 결정 이후 체크포인트

- 응답 재개 시 branch/HEAD 동일·원격 main도 `0fd43142e81d650a3dbcb190cdcc6fece133bbda`. 기존 dirty는 이 Task 조사 기록/WBS2파일뿐이었다. 선행/타 작업을 되돌리거나 stash하지 않았다.
- 사용자3답변으로 조회 범위·현재 권한 차이 유지·자원 미준비/DEV-08 차단을 확정했다. Brief/파일6개·영향·단계/검증을 편집 전에 제시하고 v1·소유 SHA23개/현재 모델 차이·DEV-08 필수6조건·CDASH12개 계획을 기록했다. WBS는 POL-06 하나만 진행이며 DEV-08 구현 미착수/차단이다.
- 로컬 앱/API/브라우저·fixture/권한/서비스/배포 실행0건. 코드/패키지/환경/하네스/기준선/기존 QA 변경 없음. 묶음 patch의 문맥 불일치는 적용 전 실패 후 올바른 문맥으로 재적용했다. 검증 실패 수정 횟수와 구분하며 자동 수정0/3이다.
- 다음 첫 행동: 문서 checker·diff-check로 링크/79/99/타96행·원본·기존 prefix/무관 범위를 검사하고 실제 diff 기반 ai-review·read-only verifier를 수행한다. 검토 후 종료 문서/다음 Task 선택이 바뀌면 같은 검증/리뷰 freshness를 다시 확인한다.

- 문서 checker1차: 14/15 통과. 단일 활성 검사가 WBS의 유형 ‘검증’을 상태로 잘못 읽은 checker 원인을 확인했다. 상태4열만 검사하도록 로컬 도구를 최소 수정(1/3)했으며 제품/문서 정책 수정은 없다. 같은 checker/diff-check를 재실행하고 결과를 아래 검증/리뷰 근거로 남긴다.

- 검증 단계: checker 파서 수정 후 15/15, 의존 DAG/M04 매핑 검사까지 포함해 17/17 PASS. diff-check PASS. 현재6파일 diff/신규 검토파일을 primary가 검토해 ai-review 여섯 섹션/context-audit PASS를 기록했다. WBS를 POL-06 리뷰로 전환하고 read-only verifier를 요청한다.

- 종료 diff 준비: 독립 verifier1 PASS·Blocker/Major/Minor0를 확보했다. WBS의 POL-06 완료/현재 없음·다음 POL-07 준비/선정 이유·첫 행동과 본 체크리스트를 기록했다. 기존 DEV-08 필수 차단/12미실행·타 Task 예외는 유지한다. 다음 첫 행동은 종료 diff의 문서 검사/primary ai-review·read-only verifier freshness 후 목적별 commit·PR/head CI·정상 merge·main FF다. 자동 수정1/3, 실제 앱/API/운영/배포0건.

- 종료 문서 검증: `validate_docs.py --final` 19/19 PASS·diff-check PASS. primary가 WBS/체크리스트/다음 POL-07과 검토 문서 변경을 포함한6파일을 다시 검토해 ai-review 여섯 섹션 PASS를 기록했다. 최종 read-only verifier freshness 결과는 로컬 report/receipt와 PR/최종 보고에서 확인하며 수행 전 PASS를 선기록하지 않는다. 이후 내용이 바뀌면 해당 검증/리뷰를 재실행한다.

## 2026-11-11 · QA-17 전수 점검 보완

- 근거: [감사 CF-06](../audits/2026-11-11.md#cf-06) · [route/API·출처 인덱스](../audits/2026-11-11.json).
- 범위/소유: 서버 기본 profile의 primaryIndustries와 중앙 다중 주력업종 정책을 확인했다. 프론트의 단일 필드 누락은 DEV-60으로 분리한다.
- 추가 완료/재개 기준: 이 정책의 확정 v1·DEV-08의 leaf권한/결측/배포·합성 자원 Gate는 보존하며 이번 source/schema 접근을 실제 응답/통합 PASS로 세지 않는다.
- 이 절은 날짜별 후속 계획이다. 앞선 결정/QA/예외 이력을 대체하지 않으며 제품 구현·실제 업무 API 변경/새 통합 PASS는 없다. 상태는 WBS에서만 관리한다.

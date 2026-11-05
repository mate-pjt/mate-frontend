# POL-02 · 맞춤 공고 조회·개인 필터 의미 확정

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 정책 결정
- 원본 항목: L02, H03
- 선행 작업: [DOC-001](DOC-001.md)
- 목적/범위: 맞춤 목록의 현재 서버 계약·정렬/페이지·회사 미연결/개인 필터 비어 있음·로그인 복귀를 확정한다. 추천: 이미 있는 개인 필터와 맞춤 목록의 책임을 분리한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### L02 · 맞춤 입찰공고 목록
- 기준선: UI **준비 중**, 동작 **미구현**, 데이터 **연결 없음**. 검증: 새 mock 로그인 후 placeholder 확인.
- 남은 점: 개인 필터 기능과 별도로 맞춤 목록의 조회·표시·빈/오류·정책 확정
- Figma: [3003:47410](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3003-47410)
- 소유 소스/기존 기록: [src/components/bids/bid-list-client.tsx:288](../../../../src/components/bids/bid-list-client.tsx)、[docs/qa/bid-list.md:197](../../../../docs/qa/bid-list.md)

### H03 · 맞춤 공고 확인 CTA
- 기준선: UI **구현**, 동작 **목적지 일부**, 데이터 **인증 연결**. 검증: 새 mock 로그인·복귀 확인.
- 남은 점: 로그인 후 도착하는 맞춤 목록이 준비 중 안내
- Figma: [2016:57355](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2016-57355)
- 소유 소스/기존 기록: [src/components/home/home-auth-cta.tsx:7](../../../../src/components/home/home-auth-cta.tsx)、[src/components/bids/bid-list-client.tsx:288](../../../../src/components/bids/bid-list-client.tsx)

## 완료 기준

- [ ] 현행 소스/Swagger·승인 정책의 버전과 필수/nullable 조건을 기록한다
- [x] 빈 조건·오류·홈 CTA 목적지와 미지원 동작을 확정한다
- [x] 원문/소유 소스·버전·결정자·시각·선택/보류 이유를 기록한다. 추천안은 승인으로 간주하지 않는다.
- [x] 근거 있는 기존 승인 또는 필요한 개발자 결정을 확보하고, 후속 개발의 범위/완료 기준/차단을 갱신한다. 정책 작업도 Review Gate를 수행한다.

## 착수 전 Implementation Brief / 설계 Gate

### 2026-11-05 · 정책 조사와 문서화 Brief

- 요구사항: L02/H03의 맞춤 목록과 기존 개인 필터의 관계·조회/빈 상태·오류·로그인 복귀를 근거와 사용자 결정으로 기록하고 DEV-03의 선행 조건을 명확히 한다. 정책 Task이며 앱 구현은 수행하지 않는다.
- 성공 기준: 소유 소스/버전·필수/nullable·승인 원문과 보류 이유 추적, 후속 개발/QA 완료 기준과 차단 구분, 기존 QA/타 Task/기준선 보존, 문서 검사·Documentation Update Check·read-only verifier·ai-review 수행. 배포 Swagger/실행 버전 미확보를 완료로 숨기지 않는다.
- in scope/수정 파일: WBS, 이 기록, [POL-02 review](../reviews/POL-02.md), [DEV-03 인계](DEV-03.md), [목록](../../../qa/bid-list.md)·[홈](../../../qa/home.md)·[개인 필터 QA](../../../qa/personal-bid-filter.md)의 추가 인계, `docs/ai-context/ai-failures.md`의 이번 공개 Git 메타데이터 출력 재발 기록. 총 8개 Markdown만 변경한다.
- out of scope: src/tests/package/설정/라이브러리·기준선 수정, DEV-03 구현, reset 차이 수정, 실제 로그인/업무 API/저장/reset/import/fixture 변경, 서비스 제어·운영·배포·외부 메시지. 비인증 공개 OpenAPI GET만 계약 조사로 수행했고 업무 응답은 조회하지 않았다.
- 확인한 패턴: AGENTS·세 Skill·verifier 역할, base/plan/architecture/harness/data-access/ai-failures, DOC-001·POL-01 선정 예외, L02/H03 기준선/coverage, HOME-09/BID-15/PBF와 QA-10 reset 차이, 현재 Page/UI/Repository/URL 모델·config/공통 HTTP·저장소 경계.
- 실행 단계/영향: clean main/선행 반영 확인 → 원격 fetch/FF·작업 브랜치 → 현행 소스/공개 계약 조사·사용자 세 결정 → 문서/QA 인계·차단/재개 기록 → 무결성 검사/두 리뷰 → 목적별 문서 commit·push·template/라벨 PR·실제 head CI/병합 조건 확인·merge commit/로컬 main FF. 제품 동작 영향 없음.
- 검증: 현재 package.json의 8개 scripts와 pnpm11.3.0 확인. 기본 shell Node26.5.0, pin/설치 Node22.20.0을 구분한다. 문서 링크/anchor·79원본/99Task·의존성/활성 상태·고정5파일·타 Task/기존 QA prefix·허용8문서/시작450파일 지문·민감 패턴·`git diff --check`를 검사한다. Markdown 전용이므로 로컬 앱 test/lint/build/Storybook·mock/HTTP 대역·브라우저 실행은 하지 않으며 원격 CI와 구분한다.
- 정책 Gate: 아래 세 사용자 답변은 확보했다. 배포 Swagger와 실제 실행 버전은 미확보여서 원래 전체 완료 기준은 미충족이다. 기존 reset Major/QA-10 차단도 유지한다. 자료 부족을 임의 정책/API 또는 진행 예외로 메우지 않는다.
- 가정: WBS가 현재 상태의 단일 기준이다. 고정 기준선과 날짜별 QA는 과거 증거다. 중앙 Accepted 정책을 재승인받지 않으며 서버 소스 commit을 배포 SHA로 해석하지 않는다.

## 2026-11-05 · 현행 소유 근거

확인 시점: 13:41 KST. 프론트 기준 main=origin/main `1fe6649b2bfc1fa20dc18eed4928692ea054ece1`, clean. DOC-001 `9eae9c0`과 POL-01 다음 Gate 선정 PR #42의 main 반영을 확인했다. 이후 `docs/pol-02-personalized-bids-policy`에서 문서만 편집한다.

| 근거/버전 | 확인한 사실 | 한계 |
| --- | --- | --- |
| 현행 프론트 [Page](../../../../src/app/bids/page.tsx)·[UI](../../../../src/components/bids/bid-list-client.tsx)·[CTA](../../../../src/components/home/home-auth-cta.tsx), 위 HEAD | recommended는 공개 목록/metadata 호출 없이 로그인 확인 후 준비 안내. 개인 필터 GET/수동 적용은 ALL에서만 실행 | 이번 브라우저 재실행 없음. 새 정책의 구현 증거 아님 |
| [중앙 ADR-0014](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/decisions/ADR-0014-separate-personal-bid-filter-from-company-profile.md), Accepted | SAVED > COMPANY_DEFAULT > EMPTY_DEFAULT, GET 무저장, 빈 SAVED 보존, 회사 값 자동 merge 없음 | 기존 승인 정책. import는 별도 명시적 전체 교체이며 이번 구현 범위 아님 |
| [공고 찾기](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/bid/matching-and-related-notices.md)·[공개 API](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/api/bid-notices.md) | 필터는 순위/참가 자격 보증이 아님. ALL의 canonical 행·마감 빠른 순·서버 count/page를 사용 | 별도 recommended API/view의 승인 근거가 아님 |
| [맞춤 이메일 정책 §6](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/notification/overview.md) | 08:30 발송 구간/보존된 발송일 추천은 이메일 책임 | 실시간 웹 맞춤 목록에 발송일 구간/이메일 ON/OFF를 적용하지 않음 |
| [Backend Controller](https://github.com/mate-pjt/mate-backend/blob/475db983ea98831c2acb15f715d09ff9e0a7ad7c/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/bid/BidNoticeQueryController.kt)·[목록 request](https://github.com/mate-pjt/mate-backend/blob/475db983ea98831c2acb15f715d09ff9e0a7ad7c/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/bid/request/BidNoticeListRequest.kt) | main `475db983ea98831c2acb15f715d09ff9e0a7ad7c` 소스는 ALL/CLOSING_SOON/RESULT와 일반 조건만 확인. page0/size20·1..100, ALL sort=bidCloseAt,asc. dev ref는 `1f3b8544dee49fa3936b3229114a58cd9eb7432c` | dev 본문/배포 대응은 미검증. 전용 맞춤 endpoint가 배포돼 있다고 추정하지 않음 |
| [필터 Controller](https://github.com/mate-pjt/mate-backend/blob/475db983ea98831c2acb15f715d09ff9e0a7ad7c/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/bid/personalfilter/PersonalBidNoticeFilterController.kt)·[response](https://github.com/mate-pjt/mate-backend/blob/475db983ea98831c2acb15f715d09ff9e0a7ad7c/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/bid/personalfilter/response/PersonalBidNoticeFilterResponse.kt) | 인증 GET/current와 저장/reset/import 분리, snapshot source/version/canImportCompany/filter | 이번 조사에서는 GET/current도 실행하지 않음 |
| 배포 [OpenAPI](https://api-test.mate-bid.com/v3/api-docs) 비인증 GET | HTTP403, 오류 본문/인증 정보 미열람 | schema/info.version/배포 실행 SHA 미확보. 서비스 장애·API 부재·브라우저 접근 불가로 단정하지 않음 |

중앙 문서 commit은 `c9e50ff591ae18023164e1a94581c611bf1e4f29`다. commit ref와 파일 내용 지문을 혼동하지 않는다. 실제 API 계약 승인/테스트 자원 담당자의 개인 배정은 미확인이고, 필요한 역할은 백엔드 계약/배포 담당·개발자 정책 승인자·프론트 QA 실행자다. 외부 연락은 하지 않았다.

### 필수·nullable와 조회 경계

- snapshot 필수: `source`(SAVED/COMPANY_DEFAULT/EMPTY_DEFAULT), `version`(number 또는 null), `canImportCompany`(boolean), `filter`(객체). source/version 관계는 SAVED의 저장 version과 기본값의 null을 구분한다. 실제 배포 schema 확인은 남아 있다.
- filter의 배열 `bidTypes/regionCodes/industryCodes/contractMethods`, boolean `regionOnly`, enum `jointContract`(ALL/REQUIRED/AVAILABLE)는 필수다. `dateType/dateFrom/dateTo/amountType/amountMin/amountMax`는 명시적 null을 허용한다. 유효하지 않은 필수 응답을 빈 기본값으로 대체하지 않는다.
- 기존 목록 DTO의 필수 `items/page/size/totalElements/totalPages/hasNext`와 행의 공고 ID·분류 identity를 보존한다. 날짜·기관·금액·결과·`row.bidClsfcNo`의 nullable은 [현재 DTO](../../../../src/data/bids/api-types.ts) 경계 그대로이며 없는 금액/날짜를 0이나 다른 값으로 대체하지 않는다. 배포 DTO 대응은 미확인이다.
- UI page는 1부터/API page는 0부터, 기존 UI 크기10/20/30(기본10), API 기본20/범위1..100을 구분한다. 조건 배열은 반복 query로 전달하고 `ALL`의 stable 서버 정렬/count/page를 사용한다. 클라이언트가 일부 page를 합쳐 정렬/전체건수를 만들지 않는다.
- 현재 [bids 공개 진입점](../../../../src/data/bids/server.ts)은 server-only다. 계정 snapshot은 브라우저의 personal-filters 공개 client 책임이다. 두 GET을 연결할 구체적인 client/server 경계·취소/경쟁 설계는 DEV-03 Gate에서 검증한다. UI의 concrete HTTP/DTO import·서버 props/전역에 인증정보/계정 상태 저장·자동 mock fallback은 허용하지 않는다. 새 BFF/공급원 그룹/endpoint를 이 문서로 확정하지 않는다.

<a id="pol-02-approved-decisions"></a>

## 2026-11-05 · 사용자 정책 결정

질문 최대3개에 대한 이 대화 사용자의 답변을 13:41 KST에 확인했다. 아래는 신규 제품 정책 승인이고, 이전 Task의 선정 예외나 Git 전달 승인을 정책 승인으로 확대한 것이 아니다.

| 결정 | 사용자 답변 원문 | 적용 범위/이유 |
| --- | --- | --- |
| D1 조회 책임 | **“기존 개인 필터 + ALL 자동 조회로 정의 (추천)”** | recommended 진입/reload에서 현재 snapshot을 읽고 그 조건으로 ALL을 자동 조회한다. 기존 ALL의 ‘내 맞춤’은 수동 적용을 유지한다. 별도 점수/AI·참가 가능 판정·발송일 이메일 추천을 만들지 않는다 |
| D2 빈 상태 | **“조건 설정 안내와 전체 공고 이동 제공 (추천)”** | 유효한 적용 조건이 없으면 설정 안내와 공개 전체 공고 이동을 제공한다. 빈 SAVED는 회사 값으로 되돌리지 않는다. 조건이 있는데 결과0건인 상태와 구분한다 |
| D3 기존 동작·미확인 유지 | **“추천 동작 채택·미확인 계약/실제 QA 차단 유지 (추천)”** | ALL 정렬/page, 검색/page/size 비저장, GET 무쓰기, 오류 재시도/401 세션/계정 격리, 홈 CTA/로그인 recommended 복귀를 채택한다. 배포 Swagger/실행 버전·QA-10 reset 차이는 차단 유지 |

### 후속 동작 기준

| 상태/행동 | 승인된 기대 동작 | 하지 않는 일/검증 조건 |
| --- | --- | --- |
| 유효한 SAVED, 회사 유무와 무관 | 저장 snapshot의 조건으로 ALL 조회 | 회사 미연결 자체를 빈 상태로 취급하거나 회사 값 자동 merge하지 않음 |
| 개인 저장 없음 + 유효한 COMPANY_DEFAULT | 회사 기본 projection으로 조회하고 출처를 구분 | GET으로 저장 row/version을 만들지 않음 |
| EMPTY_DEFAULT 또는 모든 조건이 빈 SAVED/COMPANY_DEFAULT | 조건 설정 안내 + 전체 공고 이동 | 무조건 전체 결과를 맞춤 결과처럼 노출하거나 회사 값 재적용하지 않음. 빈 판정은 기존 emptyPersonalFilter/hasPersonalConditions 의미와 대조 |
| 조건 존재 + ALL 결과0건 | 조건과 함께 매칭 결과 없음 안내 | 조건 없음/오류와 혼동하지 않음 |
| 검색·page·size | URL/화면 조회 상태만 변경, 마감 빠른 순/서버 page 유지 | 계정 snapshot 변경 없음. 조건 설정은 기존 ALL 개인 필터 동선 이용, 새 고급 편집/import/UI 추가 없음 |
| 진입/reload·계정 교체 | 현재 계정 snapshot을 다시 읽고 이전 계정의 조건/행/늦은 응답을 노출하지 않음 | URL에 남은 타 계정 조건을 현재 저장값으로 신뢰하지 않음. 실시간 자동 갱신은 별도 범위 |
| snapshot/목록 오류·세션401 | 조회 실패/재시도와 기존 세션 갱신1회·재로그인/복귀 경계를 검증 | 오류를 빈 조건·빈 결과로 바꾸거나 공개 전체/mock으로 대체하지 않음 |
| 홈 CTA·직접 recommended | 익명은 내부 next 보존→로그인→recommended, 인증 사용자는 recommended 진입 | 기존 HOME-09/BID-15의 ‘준비 안내’ 통과를 새 맞춤 목록 통과로 세지 않음 |

정책은 확정했지만 원래 완료 기준의 배포 계약 근거가 남아 있다. DEV-03 구현/실제 QA PASS·QA-10 reset Major 해결로 해석하지 않는다.

<a id="pol-02-resume"></a>

## 재개 조건과 다음 Task 선정

| 차단/마지막 확인 | 필요한 역할·확보할 근거 | 재개 첫 행동 |
| --- | --- | --- |
| 배포 Swagger/실행 대응 미확보, 2026-11-05 비인증 GET403 | 백엔드 계약/배포 담당: 비밀값 없는 승인 OpenAPI 접근 경로 또는 비식별 계약 snapshot·문서 version/내용 지문·필수/nullable·오류와 실행 SHA 대응 | 현재 main/Git와 위 source ref를 재확인하고 기존 두 GET 조합/ALL sort/page/응답 필드의 배포 일치 여부 대조 |
| QA-10 reset Major 유지 | 필터 API/fixture 담당·개발자: 빈 SAVED 정책 대비 mock/HTTP 대역 EMPTY_DEFAULT 차이의 처리 범위·검증 증거 | [QA-10 재개 표](QA-10.md#qa-10-resume)와 실제 reset source/version/회사 기본값 억제 assertion을 대조. POL-02에서 임의 코드 수정 안 함 |
| DEV-03 미구현·실제 맞춤 QA 미실행 | 프론트 실행자·개발자/fixture 담당: 별도 DEV-03 Brief, client/server 설계, 계정/조건/매칭 행·정렬/총건수·401/오류/교체 기대값·사용/변경/잔존/복구 범위 | 정책/계약 선행 충족 후 DEV-03 Gate에서 [신규 맞춤 사례](../../../qa/bid-list.md#pol-02-recommended-qa) 계획. 실제 mutation은 별도 승인 범위 확인 |

다음 Task는 **POL-02 재개**다. P1 첫 작업의 위 필수 계약 근거가 미충족이고 DEV-03은 POL-02 선행 대기다. POL-03은 알려진 별도 계약 차단이며, 다른 P1/P2 작업으로 전환할 신규 진행 예외는 없다. 사용자의 ‘다음 Task 하나 선정’ 요청은 차단 해제/검증 면제가 아니므로 다음 ID를 POL-02 하나로 유지한다. 첫 행동은 위 배포 계약 근거 확보·대조이며 다음 대화에서만 수행한다.

## 결정 기록

| 날짜 | 질문/선택지와 추천 | 결정·근거·승인자/원문 | 영향 |
| --- | --- | --- | --- |
| 2026-10-27 | 작업 후보 분해 | 정책·API·제품 동작 신규 승인 없음 | 착수 시 Gate 수행 |
| 2026-11-05 | D1~D3 추천/대안 질문 | 위 사용자 세 답변으로 정책 승인. 배포 계약·실제 QA 차단은 유지 | 앱 변경 없이 DEV-03 인계·QA 기준 기록 |

## 체크포인트 · 재개 메모

| 시각/실행자 | 환경·branch/HEAD·작업트리 | 수행/결과·근거 | 다음 행동·차단/재개 조건 |
| --- | --- | --- | --- |
| 2026-10-27 / 문서화 | feature/my-company-overview / f84af24b5f9d + 기존 미커밋 변경 | 보고서에서 작업 정의만 생성. 구현/실제 QA 미실행 | 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다. |
| 2026-11-05 13:41 KST / Codex | docs/pol-02-personalized-bids-policy / 1fe6649b2bfc1fa20dc18eed4928692ea054ece1, 시작 clean·기존 변경0 | AGENTS/WBS·선행·소스/정책 대조, 원격 main 일치, 사용자3결정 확보. OpenAPI403·QA-10 기존 Major 유지. 편집 전 범위/8문서/검증 계획 제시 | 문서화·context-audit·QA 인계 후 무결성 검사/두 리뷰. 실행 코드/실제 업무 API 미실행 |
| 2026-11-05 / 문서 검증·Review Gate | 동일 branch/시작 HEAD, 변경8문서만 | 문서31/31·diff-check·ai-review·독립 verifier 1차 PASS. 링크359/anchor57·보호443파일·기존QA/타98행 보존. 문서 diff 신규 Blocker/Major/Minor 없음. 기존 reset Major/context-audit FAIL·계약 차단 별도 | WBS 차단/다음 POL-02 재개와 이 종료 기록을 반영하고 무결성 검사·두 리뷰 freshness 재확인 후 Git 전달. 최종 원문은 로컬 verifier-final.txt/최종 보고에 기록 |

## 검증·리뷰·인계 기록

| 구분 | 실행 명령/사례·환경 | 결과 | 증거/미실행 이유 |
| --- | --- | --- | --- |
| 현행 정책/소스 | 사용자3답변·현재 프론트·중앙/Backend 고정 commit | 대조 완료 | 배포 계약/실제 실행과 구분 |
| 공개 OpenAPI | 비인증 GET/v3/api-docs | HTTP403·계약 미확보 | 오류 본문/인증 미열람, 실제 서버 결함으로 단정하지 않음 |
| 문서 무결성 | 로컬 validate_pol02.py / git diff --check | 31/31 PASS | 1차 링크359/anchor57, 종료 링크358/anchor57·보호443파일·고정5파일·타98행·기존 QA/DEV-03/ai-failures prefix 보존 |
| 앱·mock/HTTP 대역·실제 브라우저/업무 API | 실행하지 않음 | 신규 실제 통과0 | 문서 전용. RBD-01~09는 차단/미실행, 기존 QA 판정 불변 |
| Context Audit | 개인 필터/맞춤 목록 관련 읽기 전용 감사 | FAIL·기존 Major 유지 | QA-10 reset source/검증 차이, 이번 문서 diff의 새 결함과 별도 |
| Review Gate | ai-review 여섯 절·read-only verifier 1차 | 문서 범위 PASS | 신규 Blocker/Major/Minor 없음. 종료 기록을 포함한 최종 freshness는 검토 기록/로컬 최종 보고서로 재확인 |

- 자동 수정 시도: 0/3. 최초 문서31검사와 diff-check 통과, 런타임 자동 수정 없음. 작업 중 작성한 문서는 검증 전에 정리했다.
- Documentation Update Check: WBS·이 task/review·DEV-03 인계·관련 QA3문서·ai-failures 재발 기록 갱신. base/architecture/data-access는 scripts/현재 구조/런타임/API/mock 불변, plan은 WBS로 상태 위임·과거 이력 보존, harness/Skill/agent 불변, baseline/coverage 매핑 불변으로 유지한다.
- Review Gate: 문서31검사 후 ai-review·read-only verifier 1차 PASS. [검토 기록](../reviews/POL-02.md)에 근거를 보존했다. WBS 차단/종료 메타데이터 반영 후 문서 검사·두 리뷰를 다시 확인하며, 최종 read-only 원문은 로컬 `verifier-final.txt`와 최종 보고에 남긴다. 전체 정책/계약 Task 차단은 유지한다.
- 커밋/PR 전달 계획: 개인 필터 정책/DEV-03·QA 인계, WBS/검증·검토 근거, 출력 재발 예방 기록을 목적별 작은 docs 커밋으로 분리한다. 영어 type/한국어 설명, 작업 브랜치 push·template/라벨 PR·실제 head CI/최신 main/리뷰·병합 조건 확인 후 merge commit/로컬 main FF. 실제 PR/CI/최종 SHA는 PR과 최종 보고에 남기며 Git 전달을 정책/계약 완료나 배포로 세지 않는다.
- 다음 작업 인계: POL-02 재개 하나. 위 재개 표의 배포 계약/실행 대응부터 확인한다. DEV-03/다른 Task를 이번 대화에서 시작하지 않는다.

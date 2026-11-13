# POL-08 · 정정 이력 조회·선택 계약 확정

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 정책 결정
- 원본 항목: D06, C02
- 선행 작업: [DOC-001](DOC-001.md)
- 목적/범위: 과거 공고/정정 이력의 식별자·조회/선택·접근 가능 범위를 확정한다. 추천: 기존 CorrectionPopup의 실제 도메인 연결 여부를 기준으로 설계한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### D06 · 이전 공고·정정 이력 목록/선택
- 기준선: UI **공용 팝업만**, 동작 **실제 상세 미연결**, 데이터 **과거 이력 계약 미연결**. 검증: 코드 대조.
- 남은 점: CorrectionPopup을 실제 정정 이력 데이터와 상세 상태에 연결
- Figma: [2208:20632](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2208-20632) / [2210:18395](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2210-18395) / [2210:18751](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2210-18751)
- 소유 소스/기존 기록: [src/components/ui/popup/popup.tsx:353](../../../../src/components/ui/popup/popup.tsx)、[src/components/bids/bid-detail-content.tsx:89](../../../../src/components/bids/bid-detail-content.tsx)、[docs/qa/bid-detail.md:73](../../../../docs/qa/bid-detail.md)

### C02 · 정정·비밀번호·탈퇴·업로드 공용 팝업
- 기준선: UI **컴포넌트 구현**, 동작 **일부 Storybook 전용**, 데이터 **업무 API 없음**. 검증: 코드 대조.
- 남은 점: 컴포넌트 존재를 제품 기능 완료로 세지 말 것. 실제 도메인 연결 필요
- Figma: [2210:17840](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2210-17840) / [2303:89402](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2303-89402) / [2303:90900](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2303-90900) / [2264:95335](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2264-95335)
- 소유 소스/기존 기록: [src/components/ui/popup/index.ts:1](../../../../src/components/ui/popup/index.ts)、[src/components/ui/popup/popup.stories.tsx:50](../../../../src/components/ui/popup/popup.stories.tsx)、[src/components/ui/popup/popup.tsx:353](../../../../src/components/ui/popup/popup.tsx)

## 완료 기준

- [x] 현재 정정 사실 표시와 과거 이력 조회를 구분한다
- [x] 회차/분류·이전 데이터 미수집·오류·선택 목적지를 확정한다
- [x] 원문/소유 소스·버전·결정자·시각·선택/보류 이유를 기록한다. 추천안은 승인으로 간주하지 않는다.
- [x] 근거 있는 기존 승인 또는 필요한 개발자 결정을 확보하고, 후속 개발의 범위/완료 기준/차단을 갱신한다. 정책 작업도 Review Gate를 수행한다.

## 착수 전 Implementation Brief / 설계 Gate

아래 양식은2026-10-27 후보 생성 당시의 미작성 기록이다. 이번 확정 범위는 [2026-11-13 Brief](#pol-08-brief), 정책은 [v1](#pol-08-contract), 검증/리뷰는 [이번 결과](#pol-08-verification)를 따른다.

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
| 2026-11-13 KST | Q2: 정정 차수·재공고 연결·개찰회차 구분 | 사용자 원문 ‘동일 번호의 수집 차수로 한정 (추천)’ | 동일 번호 수집 차수만 소유. 다른 번호의 재공고 연결/개찰 회차·동일차수 과거 시점 복원 제외 |
| 2026-11-13 KST | Q3: 이력 선택 목적지/분류 승계 | 사용자 원문 ‘공고 전체로 이동·뒤로 가기 복귀 (추천)’ | 대상 실제 ID의 같은 탭 공고 전체. 분류·개찰회차/품목/참가업체 page 자동 승계 없음 |
| 2026-11-13 KST | Q1 초기 보류 추천 후 추가 조사 | 사용자 ‘결정 전에 백엔드 계약을 더 조사’ | 전용 endpoint 부재를 지원 불가로 확대한 설명 정정. no-view 조회 가능성과 한계를 기록 |
| 2026-11-13 KST · 기록08:41 | Q1 최종: 기존 목록 조합 또는 전용 계약 선행 | 사용자 원문 ‘전용 백엔드 계약을 먼저 마련한 뒤 이걸 구현하는걸로 하자. 백엔드 개발자한테 이 이전 차수 조회 API에 대한 요청을 보냈어.’ | 전용 계약 선행 확정. 기존 목록 조합은 미채택. 사용자의 요청 발송 보고만 확보했고 접수/구현·배포 완료는 미확인 |

## 체크포인트 · 재개 메모

| 시각/실행자 | 환경·branch/HEAD·작업트리 | 수행/결과·근거 | 다음 행동·차단/재개 조건 |
| --- | --- | --- | --- |
| 2026-10-27 / 문서화 | feature/my-company-overview / f84af24b5f9d + 기존 미커밋 변경 | 보고서에서 작업 정의만 생성. 구현/실제 QA 미실행 | 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다. |

## 검증·리뷰·인계 기록

아래 표/항목은2026-10-27 후보 생성 당시 기록이다. 이번 결과는 [2026-11-13 검증](#pol-08-verification)과 [종료](#pol-08-close)를 따른다.

| 구분 | 실행 명령/사례·환경 | 결과 | 증거/미실행 이유 |
| --- | --- | --- | --- |
| 이번 작업 | 미실행 | 미판정 | 기준선의 과거 결과와 구분 |

- 자동 수정 시도: 0/3. 실패 시 명령·오류·원인·최소 수정·재검증 결과를 추가한다.
- Documentation Update Check: 착수 후 판단. base/architecture/data-access/plan/harness/ai-failures 중 영향 문서와 갱신/미갱신 이유를 기록.
- Review Gate: 미실행. verifier와 ai-review의 결과/대상 diff·후속 변경 재검토 여부를 기록.
- 커밋/PR: 없음. 추후 커밋할 때 하나의 목적·영어 type/한국어 메시지, 런타임/테스트/문서는 가능한 별도 커밋.
- 다음 작업 인계: WBS에서 선택. 이 단위의 필수 검증 PASS 전에 다른 기능으로 자동 전환하지 않는다.

<a id="pol-08-dev-11-handoff"></a>

## 2026-11-12 · DEV-11 종료 후 선정/인계

- 사용자 요청7항에 따라 다음 정책 Gate 후보 하나로 선정/인계만 했다. 남은 P0/P1 차단/선행 미충족, DEV-12의 별도 계약/정책 Gate 보류를 유지하고 P2 WBS 순서·DOC-001 완료를 근거로 삼는다. 현재/다음/상태는 WBS만 관리한다.
- 다음 첫 행동: 새 대화에서 최신 main/작업트리·이 정의와 완료 기준·연결된 소유 정책을 읽고, 현재 ‘정정됨’ 사실 표시와 과거 회차/분류/이전 데이터 이력의 구분을 현행 frontend/backend GitHub·개발 Swagger/Figma 상태와 대조한다. 식별자·수집 누락·오류·접근/선택 목적지 계약을 확인한 뒤 정책 작업 자체 Brief와 남은 질문을 제시한다. 추천안을 승인 결정으로 취급하지 않는다.
- 이번에는 이 Task의 정의/선행/완료 기준만 읽었다. CorrectionPopup/상세 source·API/Figma 상세 조사·정책 결정·Brief/설계·구현·검증·실제 업무 요청·Git 전달은 시작하지 않았다. 새 라이브러리/제품 구현을 정책 Task에 추가하지 않는다.
- DEV-11의 ‘로컬 선행·실서버 QA 차단 보존’·Git/Chromatic 예외는 다음 Task에 자동 적용되지 않는다. 기존 기준선·QA/차단/승인 예외를 보존하며 새 대화의 범위/계약/승인으로 자체 Gate를 수행한다.

<a id="pol-08-investigation"></a>

## 2026-11-13 · 착수 조사와 정책 질문

- 실행자 Codex, 시작 clean main/원격 main `145324ee551f7b24c555d0d21ebe5dcb7f5eb79e`. DEV-11 PR #64 및 DOC-001이 main에 있고 기존 POL-08 branch/미커밋 변경은 없었다. fetch·fast-forward 확인 뒤 `docs/pol-08-correction-history-policy`를 만들었다. 제품 구현은 시작하지 않았다.
- 이번 사용자는 POL-08 하나의 정책 조사·결정·문서 검증·read-only verifier/ai-review와 목적별 commit/push·PR·최종 head CI/정상 main 병합·로컬 main 동기화를 명시 승인했다. 이번 PR의 Chromatic 월간 한도 문제만 예외다. 과거 Task 예외와 구분하며 실제 업무 API 변경·외부 메시지·중앙 저장소 편집·운영/배포·다음 Task 실행은 포함하지 않는다. 아래 후속 조사의 공개 GET3건은 읽기 전용 계약 조사로 별도 기록한다.
- 확인 범위: AGENTS, 세 Skill, WBS/workflow/task-cycle·기준선 D06/C02·DOC-001 완료 근거·DEV-13·기존 DETAIL-04/QA-03, ai-context6문서, package/scripts·popup/상세/Repository/mapper/URL helper, 중앙 정책과 backend dev·개발 OpenAPI. [고정 출처](../reviews/POL-08-sources.json)를 참조한다.
- 현재 상세는 상태/변경시각/사유를 표시하며 이력 목록 호출/CorrectionPopup 소비가 없다. 공용 팝업의 기본 예시 목록과 Storybook은 제품 이력 데이터가 아니다. 중앙 정책의 공고번호+차수별 보존/내부 ID와 공개 이력 API 제공을 구분한다. DB 수집본의 존재/완전성은 미확인이다.
- 개발 Swagger 문서 GET200·OpenAPI3.1.0/info.version `v1`, 공개 입찰10경로·상세/sourceKey/header schema를 확인했다. 이력 목록/수집 누락 상태 계약은 없었다. backend dev SHA는 소스 ref이며 실행 서버 SHA/배포 대응과 업무 응답은 미확인이다. 업무 API 실행0건, 읽기용 Swagger 탭은 닫았다.
- 정책 질문 Q2에 사용자 원문 **‘동일 번호의 수집 차수로 한정 (추천)’**, Q3에 **‘공고 전체로 이동·뒤로 가기 복귀 (추천)’**를 확보했다. 승인자 사용자·결정일2026-11-13 KST. 재공고 연결/개찰회차/동일차수 과거 시점 복원을 정정 차수 목록과 구분하고, 선택 대상의 ID로 같은 탭 공고 전체에 이동한다.
- Q1은 사용자가 API 공백에 대한 설명을 요청했다. ‘기존 상세 조회는 가능하나 이전 차수 목록을 받는 공개 계약이 없음, DB 데이터 부재 판정은 아님’을 설명했다. 필요 계약을 문서화하고 DEV-13 연결을 계약 준비 후 진행하는 제공 범위 결정은 후속 답변 대기이며 추천을 승인으로 간주하지 않는다.
- 보안/도구 한계: 초기 GitHub 응답 전체와 넓은 Figma metadata 출력에 불필요한 공개 작성자/디자인 연락처 예시가 포함됐다. 사용자에게 공개했고 이후 SHA·필수 schema/관련 frame 문구만 추출한다. 원문을 문서/receipt/PR에 복사하지 않으며 기존 출력이 삭제됐다고 주장하지 않는다. Aside의 `/tmp` 쓰기 거부는 세션 artifacts 경로로 교정했고 조회 결과에는 영향이 없다.
- 다음 첫 행동: Q1 제공 범위 결정을 확보한 뒤 최종 Brief/파일·영향·단계·위험·검증 계획을 제시하고 정책 v1/상태표·DEV-13/QA 후속 기준을 작성한다. 현재/다음/상태는 WBS가 소유하며 이 조사 기록은 정책 완료·제품/실제 API PASS가 아니다.

### 2026-11-13 · Q1 후속 조사 요청

- 사용자 원문 **‘결정 전에 백엔드 계약을 더 조사’**. Q1의 보류 추천은 미승인으로 유지한다. 기존 두 정책 결정은 보존한다.
- 조사 범위를 기존 공개 목록 API의 no-view 조회·번호 검색·응답 sourceKey/차수·페이지/공개 조건, 수집 저장의 차수 identity, 재공고 연결 및 관리자 감사 이력과의 차이로 좁힌다. 전용 이력 endpoint 부재만으로 기존 API 조합 가능성까지 배제하지 않는다. 새로운 API/제품 구현·중앙 문서 변경은 하지 않는다.

### 추가 조사 결과 · 초기 연결 불가 설명 정정

- **전용 이력 endpoint는 없지만 기존 API로 조회할 경로는 있다.** `GET /api/v1/bid-notices`에서 `view`를 생략하면 기존 공고 단위 목록이고 상태/진행상태 조건도 생략하면 공개·미삭제 공고를 마감/취소 여부로 일괄 배제하지 않는다. 번호를 keyword로 검색하면 응답에 `id`, `bidNtceNo`, `bidNtceOrd`, 게시일과 page metadata가 있다. 기존 `getBidList`는 view를 항상 보내므로 이 경로를 재사용하려면 별도 no-view 조회가 필요하다는 조사 결과다. 아래 최종 Q1에서 사용자는 이 재사용안을 제품 연결 경로로 채택하지 않았다.
- 저장 source는 `(bid_ntce_no,bid_ntce_ord)` unique key로 insert 충돌을 판정하며 다른 차수는 별도 row/ID, 같은 차수는 최신 source version으로 갱신한다. 내부 `findByBidNtceNoIn` 포트는 존재하지만 HTTP 공개 계약은 아니다. 재공고의 `previousBidNoticeId` 연결, 관리자 감사 이벤트, 개찰 회차와 정정 차수 목록을 구분한다.
- 사용자 추가 조사 요청에 따른 공개 읽기 전용 GET3건: no-view 목록200/`isSuccess=true`에서 NORMAL/MODIFIED/CANCELLED/REBID와 CLOSED/CANCELLED/UPCOMING을 관찰했다. 발견한 번호2개의 no-view 검색도200이며 각각 정확 일치1건·단일 차수·`hasNext=false`다. 연락처/제목 원문은 보존하지 않았다. 로그인/인증 조작·mutation·수집/서비스 조작0건, 소유 탭 닫기 완료. [출처/비식별 결과](../reviews/POL-08-sources.json)를 참조한다.
- 이 GET3건은 계약 조사 증거다. 실제 복수 차수 양성/다음 페이지·부분검색 충돌·오류·제품 팝업/선택·복귀 QA는 미실행이며 기존 QA-03의1통과8차단/DETAIL-04 이력을 바꾸지 않는다. source SHA·OpenAPI·실행 SHA 미확인·실제 제한 응답을 구분한다.
- 한계: keyword는 제목/기관/번호 부분 검색이므로 정확한 `bidNtceNo`로 걸러야 한다. `totalElements`는 부분 검색 후보 수이며 이력 수가 아니다. 첫 page/실패를 전체 빈 이력으로 처리하거나 현재 차수001/002에서 이전 차수/정정 횟수/최초 공고를 추정하지 않는다. 여러 page 간 불변 snapshot과 수집 완전성/미공개·삭제 이유는 기존 계약이 보장하지 않는다.
- 다음 판단: **‘수집·공개된 동일 번호 차수’만 기존 API로 조회하는 정책**과 **정확 번호/완전성 정보를 제공하는 백엔드 계약을 먼저 추가하는 정책**의 차이를 사용자에게 제시한다. 초기 ‘API가 없어 연결 불가’ 설명과 DEV-13 보류 추천은 이 조사 결과로 정정하며 승인으로 재사용하지 않는다.

<a id="pol-08-brief"></a>

## 2026-11-13 · 확정 Brief / 설계

- 요구사항/유형: POL-08 정책 Task 하나. 현재 정정 사실과 과거 수집 차수 조회를 구분하고, 사용자 확정 범위·전용 계약 요구·후속 구현/검증 Gate를 문서화한다. 기능 구현은 DEV-13 소유다.
- 성공 기준: 아래 식별/접근/누락/오류/선택 의미표, 결정 원문·출처/버전·소유 역할, 전용 계약의 필수 확인 항목과 DEV-13/QA 재개 기준을 연결한다. 문서 검사·Documentation Update Check·두 리뷰를 통과하며 실제 API 계약 확정/제품 통합 완료로 확대하지 않는다.
- in scope: 이 Task·DEV-13·WBS/coverage·기존 상세 QA의 후속 기준·plan/실패 기록·출처/검토 문서와 승인된 Git 전달. 기존 목록 API 가능성은 근거로 보존하되 제품 채택하지 않는다.
- out scope: src/public/tests·package/lockfile/설정/라이브러리, 새 backend endpoint/DTO 구현·중앙 저장소/외부 메시지, DB/수집·계정·서비스 변경/배포, DEV-13 및 다음 Task 실행. 로컬 선행 구현/실제 QA 면제 예외는 없다.
- 확인한 파일/패턴: `CorrectionPopup`/Storybook, `BidDetailContent`, bids contracts/server/HTTP/DTO/mapper, `BidDetail`, `bidDetailHref`, 고정 중앙 정책3개와 backend source/test-source21개, 개발 OpenAPI/공개 GET3건. API/mock/DTO 검토 전 data-access.md를 확인했다.
- 수정 파일/영향: `tasks/POL-08.md`, `tasks/DEV-13.md`, WBS `README.md`, `coverage.md`, `docs/qa/bid-detail.md`, `docs/ai-context/{plan,ai-failures}.md`, `reviews/POL-08{,-context}.md`와 `POL-08-sources.json`. 다음 선정 후 해당 Task에 인계만 추가한다. 실행 코드/설정 영향0이다.
- 단계: 사용자 결정/조사 정정 → 정책 의미/전용 계약 요구·DEV-13 재개/QA 기준 → 문서 검사·문서 갱신 체크 → read-only verifier 재검토/ai-review → WBS 종료·다음 하나 선정/인계·최종 재검토 → 목적별 commit/push·PR/CI·정상 merge·로컬 main fast-forward.
- 위험/대응: 전용 endpoint 부재와 기능 불가를 혼동하지 않는다. 표시 문자열 역파싱·추정 이력/최초/정정 횟수·분류 자동 승계·오류의 빈 성공화·기존 목록 fallback을 금지한다. backend 요청 발송·source·OpenAPI·실행 SHA·실제 응답을 각각 구분한다.
- 낮은 위험 가정: 전용 wire/path/정렬/페이지 규약은 backend가 실제 계약으로 제시한 뒤 검증한다. 이 문서의 요구 의미는 가상의 endpoint/schema 승인이 아니다. 정책 결정자는 사용자, backend 개발자는 계약 제공 역할이고 개인 담당자·요청 티켓/접수·납기/반영 SHA는 미확인이다.
- 검증: 현재 package8scripts를 확인했다. Markdown/출처 JSON만 바꾸므로 링크/anchor·원본79·114Task/155의존성/순환/활성 상태·기준선/감사/기존 QA prefix·변경 범위/형식/비밀값 패턴·`git diff --check`를 검사한다. 로컬 앱 test/lint/build/Storybook 및 제품 브라우저·mock/HTTP 대역은 실행 영향0으로 미실행한다. 공개 GET3건은 제한된 계약 조사로 별도다. 원격 CI는 최종 PR head에서 실제 결과를 확인한다.
- blocking ambiguity: 이번 정책 제공 범위의 사용자 결정은 모두 확보했다. 전용 API의 실제 계약/배포·복수 차수 QA 자원은 DEV-13 재개 조건으로 남기며 API/제품 완료로 세지 않는다.

<a id="pol-08-contract"></a>

## 정책 v1 · 정정 사실과 수집 차수 조회

2026-11-13 사용자 결정이 이 저장소의 후속 기준이다. 중앙 원문/백엔드/제품을 변경하거나 이미 배포된 계약으로 선언하지 않는다.

| 항목 | 확정 의미/후속 기준 | 근거·제한 |
| --- | --- | --- |
| 현재 정정 사실 | 현재 공고의 상태·제공된 변경 시각/사유를 표시하는 기존 기능을 유지 | D05/DETAIL-04와 D06은 별개. MODIFIED라는 사실이 과거 수집본 존재/횟수를 증명하지 않음 |
| 이력의 업무 범위 | 같은 `bidNtceNo`의 수집된 공고차수. 다른 번호 재공고 연결·개찰 `rbidNo`/결과 ID·동일 차수의 과거 수정 시점 복원은 제외 | 사용자 Q2. 같은 번호·차수는 현재 저장본이 갱신될 수 있어 과거 시점의 불변 snapshot으로 표현하지 않음 |
| 식별자 | 각 수집본의 실제 내부 ID와 원본 공고번호/차수를 함께 보존. 분류번호는 별도 축 | sourceKey의 원문/leading zero 보존. 차수를 정정 횟수로 환산하거나 `noticeNumber` 표시 문자열을 split하지 않음 |
| 공개 접근 | 공개·미삭제 수집본만 대상으로 하고 마감/취소 여부를 공개 여부와 혼동하지 않음 | 중앙 공개 경계와 기존 상세 guard. 관리자/내부 포트·감사 payload로 우회하지 않음 |
| 조회 수단 | 사용자에게 제공할 이전 차수 전용 backend 계약을 먼저 확보한 뒤 DEV-13에서 연결 | 사용자 Q1 최종. 기존 no-view 검색은 조사상 가능하지만 제품 조회/실패 fallback으로 미채택 |
| 이전/현재·최신/정렬 | 전용 계약이 정의한 조회 기준·대상 포함 관계·정렬/페이지 의미를 확인하고 보존 | 원본 차수 문자열·최대 ID·게시일만으로 대표 최신/최초를 단정하지 않음. 현재 열린 ID와 최신 공고는 다른 의미 |
| 원본 데이터 부재 | 표시할 공개 수집본 부재와 전체 역사 없음, 수집 누락/공개 제한/실패를 구분 | API가 이유를 제공하지 않으면 ‘이유 미확인’으로 남기며 미수집/정정 없음으로 단정하지 않음 |
| 목록 개수/페이지 | 전용 계약의 범위·페이지/다음/개수 의미에 맞춰 표시. 일부 page만 확보한 상태를 전체로 표현하지 않음 | 기존 keyword 검색의 `totalElements`는 부분 검색 후보 수이며 이력 수가 아님. 전용 API에 그대로 전용하지 않음 |
| 선택 목적지 | 선택한 수집본의 실제 ID로 같은 탭의 `/bids/[id]` 공고 전체를 연다 | 사용자 Q3. source의 `bidClsfcNo`, `resultId`, `itemPage`, `participantsPage`를 대상에 복사하지 않음 |
| 대상 분류 | 새 공고의 분류는 대상 상세의 실제 분류 목록에서 다시 선택 | 공사는 NOTICE, 물품/용역의 query 생략은 전체 분류 문맥. 현재 공고의 분류 소유권을 이전 공고로 전이하지 않음 |
| 닫기/복귀 | 확인 전 선택/닫기는 현재 상세 URL을 바꾸지 않는다. 확인 이동은 브라우저 이력에 남겨 뒤로 가기로 원래 상세 URL에 복귀 | 원래 URL의 분류/회차 문맥은 복귀 시 보존하되 화면 내용은 정상 재조회 결과이며 과거 시점 복원 보장은 아님 |
| 오류/경쟁 | 목록 실패는 본문과 분리해 오류/명시 재시도, 대상 접근 불가는 해당 상세의 정상 오류/404 경계 | 실패를 이력 없음으로 바꾸거나 최신 공고/기본 예시/기존 검색으로 치환하지 않음. 요청 취소·늦은 응답도 DEV-13에서 검증 |

### Figma 상태별 근거와 예외의 경계

- [2208:20632](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2208-20632): 상세에 이력 팝업이 열린 상태. [2210:18395](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2210-18395): 단일 선택·닫기/확인과 차수/날짜 예시. metadata와 해당 팝업458×534 screenshot을 확인했다.
- [2210:18751](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2210-18751): 선택 후 다른 차수를 보고 있음을 안내하는 상태. 사용자 Q3가 이동/복귀의 정책 근거다. `n차 정정`, ‘최초’, 실제 변경일과 같은 표시값은 서버 의미가 확인되지 않으면 Figma 예시에서 생성하지 않는다.
- 전용 계약 선행은 기능 제공 시점 결정이다. 상세 전체 레이아웃·공통 팝업 전체의 시각 예외 승인이나 다른 C02 팝업 활성화 승인이 아니다. DEV-13에서 실제 데이터 상태별 문구/화면을 다시 대조한다.

<a id="pol-08-backend-request"></a>

## 전용 backend 계약의 요청/수락 확인 항목

사용자가 이전 차수 조회 API를 backend 개발자에게 요청했다고 보고했다. 이번에는 메시지를 보내거나 다른 저장소/Task를 구현하지 않았다. 요청 티켓/원문 링크·backend 접수/완료·개인 담당자·일정·실제 계약/반영/배포 식별자는 아직 미확인이다.

아래는 **요구 의미와 수락 기준**이며 새로운 endpoint 이름·HTTP method·DTO 필드·상태 enum을 발명한 명세가 아니다.

| backend와 확인할 항목 | 필요한 의미/자료 | 미확보 시 처리 |
| --- | --- | --- |
| 기준과 관계 | 조회 기준 공고의 내부 ID·원본 번호/차수, 같은 번호 exact 경계, 이전 차수 판정/현재 포함 여부·정렬 정의 | 제목/기관 유사 검색이나 프론트 차수 추정으로 대체하지 않음 |
| 각 행의 identity | 실제 상세 목적지 ID와 원본 번호/차수, 제공 시각의 의미/nullable, 현재 행 구분·중복 규약 | 표시 문자열 역파싱·가상 ID/최초/정정 횟수 금지 |
| 공개 경계 | 기준/대상 미공개·삭제·미존재 처리와 마감/취소 공개본의 접근 범위, 오류/code 계약 | 내부 존재/제한 원인을 누출하지 않고 공개 상세와 일관되게 처리 |
| 부재/수집 범위 | 정상 빈 결과, 알려진 누락/미수집 또는 완전성 미확인, 실패의 구별 가능 범위 | 계약에 없는 누락 사유·수집 완전성을 프론트가 생성하지 않음 |
| 페이지/경쟁 | page/cursor 등 실제 규약·다음/개수 의미·고정 정렬·변동 시 중복/누락·snapshot 보장 범위 | 첫 page/최대 건수/중도 실패를 전체 성공으로 세지 않음 |
| 실제 가용성 | owning source commit·개발 OpenAPI의 path/query/schema/version, 배포 근거·실행 SHA/이미지 대응·허용 Origin | 소스 commit/`v1`·문서 GET200만으로 실행 서버 계약 완료를 주장하지 않음 |
| 검증 자원 | 정상 복수 차수/단일/공개 수집본 없음·차수 간격·시각 결측·분류 차이·마감/취소·미공개/삭제·안전한 오류의 합성 fixture와 기대값 | 실제 fixture/사용/오류 재현·해제/잔존·복구 범위를 확인할 때까지 해당 QA 미실행으로 남김 |

backend 계약 제공 역할과 프론트 후속 실행자가 이 표를 대조한다. 새 계약이 Q1~Q3와 다르면 정책 차이만 사용자에게 확인하고 이번 승인을 API/제품 예외로 확대하지 않는다.

<a id="pol-08-dev13-gate"></a>

## DEV-13 재개 Gate와 검증 인계

- 선행: 실제 전용 계약을 위 표로 확인하고 현재 Git/배포·공개 fixture·검증/오류/복구 범위와 자체 Brief를 확보한다. 이번에는 전용 계약 없이 로컬 mock 구현부터 시작하는 예외를 승인하지 않았다.
- 구현 경계: 공개 bids Repository/server→HTTP/DTO/mapper 또는 동일 계약 mock을 사용한다. 내부 `BidDetail` 등에 raw sourceKey를 보존하는 최소 확장을 검토한다. UI가 endpoint/DTO를 직접 다루거나 표시용 `noticeNumber`를 역파싱하지 않는다. 현재 일반 목록/API·D05·다른 팝업은 범위 밖이다.
- 검증 기대값은 아래 HIST 사례다. wire/status 명칭은 실제 계약 확보 후 채우고, 현재 존재하는 API처럼 endpoint/DTO를 생성하지 않는다. 기존 DETAIL-01/04/08을 덮어쓰지 않는다.

| 후속 사례 | 확인할 행동/경계 | 이번 실행 |
| --- | --- | --- |
| HIST-01 | 현재 정정 사실만 있고 과거 목록을 추정하지 않음. NORMAL/정정/취소/재공고 상태와 이력 존재는 별개 | 미실행·후속 DEV-13 |
| HIST-02 | 동일 번호의0/1/복수 수집 차수, 원문 차수/ID·중복·현재 행 의미 보존, 다른 번호의 재공고 연결 제외 | 미실행·후속 DEV-13 |
| HIST-03 | 000/002/005 등 간격과 비정규/결측 자료, 같은 차수 갱신을 가짜 정정 차수/횟수·최초/불변 과거로 만들지 않음 | 미실행·후속 DEV-13 |
| HIST-04 | 미수집/부재/완전성 미확인/조회 실패를 구별 가능한 계약 범위 안에서 표시 | 미실행·후속 DEV-13 |
| HIST-05 | 마감·취소 공개 수집본과 미공개·삭제·미존재의 공개 경계, 선택 직후 접근 불가 | 미실행·후속 DEV-13 |
| HIST-06 | 원문 sourceKey 보존, 같은 source 번호인지 검증, 표시 문자열 역파싱/차수 숫자 coercion·잘못된 ID 차단 | 미실행·후속 DEV-13 |
| HIST-07 | 전체/선택 분류에서 열기·닫기, source 분류/회차/page를 넘기지 않는 target 공고 전체 URL | 미실행·후속 DEV-13 |
| HIST-08 | 같은 탭 확인 이동·하드 리로드·직접 URL·뒤로 가기의 원래 상세 URL 복귀와 정상 재조회 | 미실행·후속 DEV-13 |
| HIST-09 | 다음 page/빈 중간 page/안정 정렬·중복·변동/개수 의미, 중도 실패의 부분 성공/전체 빈 성공화 금지 | 미실행·후속 DEV-13 |
| HIST-10 | 목록 독립 오류/재시도, 본문 유지, 대상 상세 오류/404와 다른 공고 자동 치환 없음 | 미실행·후속 DEV-13 |
| HIST-11 | 중복 클릭/닫기·화면 이동·취소/늦은 응답, 키보드 선택·닫기/포커스·데스크톱/모바일 | 미실행·후속 DEV-13 |
| HIST-12 | 전용 계약 HTTP/mock 경계와 실제 Next/브라우저·실제 API 증거 분리, 기존 목록/기본 예시 fallback0 | 미실행·후속 DEV-13 |

<a id="pol-08-verification"></a>

## 2026-11-13 · 검증/Review Gate 체크포인트

- 기록08:41 KST, 동일 branch/base. 최종 Q1~Q3 결정으로 정책 문서 작성 범위의 Gate를 통과했다. 전용 API의 실제 계약/제품 연결/전체 통합은 미완료이며 DEV-13 재개 조건으로 보존한다.
- `python3 /tmp/mate-pol08-20261113/verify-docs.py`와 `git diff --check`: 조사 문서4개 시점 PASS, 최종 정책/연결 문서 작성 후 재실행한다. 원본79/Task114/의존성155·보호10범위 보존을 확인했다.
- 사전 read-only verifier: 추가 조사 사실 결론 PASS. raw sourceKey 보존 필수, V2 SQL source 분류와 초기 Context Audit 설명 갱신 Minor를 확인했다. 최종 정책 diff의 독립 리뷰로 대체하지 않는다.
- Documentation Update Check/최종 verifier·ai-review: 아래 최종 검토 기록으로 이어간다. 원격 전달·최종 SHA/CI는 실제 PR/head/최종 보고가 소유하며 아직 수행하지 않은 결과를 기입하지 않는다.

<a id="pol-08-close"></a>

## 2026-11-13 · 정책 문서 종료/인계

- 판정: **정책/문서 범위 PASS**. 사용자 Q1~Q3, source24개·개발 OpenAPI·제한된 공개 GET3건, 전용 계약 수락 표·DEV-13/HIST-01~12·기존 QA 후속 기준을 연결했다. 전용 API의 실제 wire/구현/배포·DEV-13 제품/복수 차수 통합 완료가 아니다.
- 검증: 최종 정책 diff10파일의 문서 검사 PASS(79원본/114Task/155의존성·816상대 링크·보호10범위), `git diff --check` PASS. coverage 문단 위치를 끝으로 옮긴 최소 수정1/3 후 재검증했다. 종료/다음 인계가 추가된 본문도 최종 문서 검사에 포함한다. 로컬 앱 검사 미실행 이유와 GET3건의 제한은 [검토 기록](../reviews/POL-08.md)에 남겼다.
- Documentation Update Check: Task/DEV-13·WBS/coverage·QA·plan/ai-failures/source/context/review 갱신. base/architecture/data-access/harness는 실행/구조/데이터 규칙/하네스 변경0으로 유지한다. 기준선/감사·기존 실제 QA/차단/예외는 보존했다.
- Review Gate: read-only verifier의 최종 정책10파일 PASS·미해결 Blocker/Major/Minor0, 검토 diff SHA-256 `32754e8e70a0f1d0b97df5a54ffce4e25bab3df5d32ddc9a58198fe565237bf4`. 자체 ai-review 여섯 섹션도 PASS다. 종료 체크리스트/WBS·다음 인계 metadata는 후속 검증·영향 재검토에 포함한다. 실제 최종 freshness와 Git 결과는 PR/receipt/최종 보고로 연결한다.
- 남은 조건: 사용자는 전용 API를 backend 개발자에게 요청했다고 보고했다. 실제 계약/접수·담당 개인/일정·source/schema/배포/실행 대응·fixture/오류·복구 자원은 미확보다. [DEV-13 재개 Gate](#pol-08-dev13-gate) 전 제품 구현을 시작하지 않으며 기존 no-view 조회/기본 예시 fallback·로컬 선행 예외를 만들지 않는다.
- 다음 Task: **POL-09** 하나. DOC-001 완료·P2 표 순서의 독립 정책 후보이며, 앞선 P0/P1·DEV-09 차단·DEV-12 별도 Gate/보류·DEV-13 전용 계약 조건을 유지한다. 정의/선행/완료 기준만 읽었고 [다음 첫 행동](POL-09.md#pol-09-pol-08-handoff)을 남겼다. POL-09의 전용 조사/정책/Brief·설계/구현/검증/전달은 실행하지 않았다. 현재/다음/상태는 WBS가 소유한다.

### Git 전달 체크포인트

- 종료11파일의 문서 검사/ai-review·독립 freshness 재검토 PASS 후 정책/후속 기준 `ecf9116`, 검증/오류 교정 기록 `70056a7`을 나눠 commit/push하고 [PR #65](https://github.com/mate-pjt/mate-frontend/pull/65)를 draft로 열었다. base는 `145324ee551f7b24c555d0d21ebe5dcb7f5eb79e`, 라벨은 `type: docs`다.
- WBS/plan·POL-09의 인계와 이 Git 체크포인트를 마지막 전달/인계 목적 커밋으로 분리한다. 이 기록은 PR 생성 시점의 실제 결과이며 최종 head CI/리뷰·정상 merge/로컬 main 동기화 완료를 미리 주장하지 않는다. 이후 결과는 같은 PR의 최종 head와 저장소 밖 receipt·최종 보고에서 확인한다. 이 metadata 추가도 문서 검사·두 리뷰 영향 재검토 대상으로 포함한다.

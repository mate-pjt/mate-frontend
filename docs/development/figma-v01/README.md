# 메이트 v0.1 실행계획 · WBS

> 현재 상태의 단일 기준 문서. 작업 상태를 바꿀 때 이 표와 현재/다음 작업을 함께 갱신한다. 작업별 파일은 상세 범위·체크포인트·증거를 보존한다.

| 확인할 것 | 현재 값 |
| --- | --- |
| 갱신일 | 2026-11-04 KST |
| 현재 작업 | 없음 — QA-10 사전 점검은 [PR #33](https://github.com/mate-pjt/mate-frontend/pull/33)으로 main 반영. 실제0통과·12차단·reset Major 미해결 유지. 이번 후속은 승인된 QA-11 다음 작업 선정 문서화만 수행 |
| 다음 작업 | [QA-11 · 받은 알림·읽음·21건 이상 실제 QA](tasks/QA-11.md) — P0 표 순서상 다음, PREP-01/QA-04 main 선행 충족. 2026-11-04 사용자 [QA-10 진행 예외](tasks/QA-10.md#qa-10-next-qa-11-exception)로 다음 대화의 요구사항 Gate 대상으로 선정. QA-10 차단/reset Major 해소·QA-11 fixture 준비/실제 실행 승인으로 확대하지 않음 |
| 다음 첫 행동 | 새 대화에서 최신 main/Git·QA-11·PREP 준비표·ALARM-01~10을 대조하고 승인된 disposable 계정/읽음·미읽음/복수 종류/21건 이상 합성 알림 별칭·시작 건수/정렬/페이지·읽음 PATCH 대상·로그인/GET/PATCH 사용·변경·읽음 이후 잔존/종료 상태·복구 담당/방법·안전한 오류/해제와 현재 프론트/백엔드 실행 대응을 확보해 요구사항 Gate 작성. 읽음 취소 API를 추정하지 않고 ALARM-04 삭제 API 차단/ALARM-05 7일 안내 보류는 별도 보존. 이번 대화에서 QA-11 실행 없음 |
| 이번 승인 범위 | 2026-11-04 후속 사용자 승인: QA-10 잔여 실제 QA 차단·reset Major 미해결 유지·QA-11 다음 작업 선정 예외, WBS/작업 기록 갱신과 commit/push·PR/head CI·조건 충족 시 정상 merge/로컬 main FF. 앞선 QA-10 사전 점검/예방 기록과 타 Task 차단/예외 보존. QA-11 실제 자원·로그인/GET/PATCH·변경/잔존/복구·알림 생성/배치·서비스 운영/배포 범위는 새 대화의 요구사항 Gate에서 확인 |
| 알려진 외부 차단 | QA-10: 2026-11-04 사용자 자원 미준비·사전 점검만 승인. PBF-01~12 실제0통과·12차단（기존0통과·12대기 보존）. disposable EMPTY_DEFAULT/COMPANY_DEFAULT 계정·시작 snapshot/version·매칭 공고 기대값·오류/401/409·사용/변경/빈 SAVED 잔존·종료/복구·현재 실행 대응 미확보. [재개 조건](tasks/QA-10.md#qa-10-resume) 유지. 기존 mock/HTTP 대역 reset이 EMPTY_DEFAULT인 Major 차이를 기록했으며 빈 SAVED 정책/실서버 검증으로 대체하지 않음. 후속 사용자 [진행 예외](tasks/QA-10.md#qa-10-next-qa-11-exception)는 QA-11 Gate 선정만 허용하며 QA-10 검증 면제/통합 PASS나 reset Major 해결로 세지 않음. QA-11: 다음 Gate 대상 선정과 실제 QA 자원 준비를 구분. 읽음/미읽음·복수 종류·21건 이상 합성 알림·시작/종료 건수/정렬·읽음 PATCH 대상·변경/잔존/복구·안전한 오류/현재 실행 대응 미확보, 기존 ALARM-01~10의3통과/1차단/6대기와 ALARM-04 삭제 API 차단/ALARM-05 7일 안내 보류 보존. QA-09: 2026-11-03 사용자 자원 미준비 확인·사전 점검만 승인. ALERT-01~08 실제0통과·8차단, 기존0통과8대기 이력 보존. 두 계정/두 공고·복수 분류·초기/종료 active·로그인/GET/PUT/DELETE 사용·변경/알림·이력 잔존·복구 담당/방법·안전한 실패/만료·현재 실행 대응 미확보. [재개 조건](tasks/QA-09.md#qa-09-resume) 유지. 후속 사용자 [진행 예외](tasks/QA-09.md#qa-09-next-qa-10-exception)로 QA-10 선정만 허용하며 QA-09 검증 면제/통합 PASS·QA-10 실제 실행 승인으로 세지 않음. QA-08: 2026-11-02 사용자 자원 미준비 확인·사전 점검만 승인, 실제 API·초대 소비·회사 변경 불승인. AUTH-16 실제0통과·1차단·초대 AUTH-17 미실행. 회사/발신자/수신자·불일치/신규 계정·유효/만료/사용된 초대·메일 링크 Origin·사용/소비/membership 변경·잔존/복구 담당/방법과 현재 실행 대응 미확보. [재개 조건](tasks/QA-08.md#qa-08-resume)은 유지. 후속 사용자 [진행 예외](tasks/QA-08.md#qa-08-next-qa-09-exception)로 QA-09 선정만 허용하며 QA-08 검증 면제/통합 PASS·QA-09 실제 실행 승인으로 세지 않음. QA-07: 2026-11-02 사용자 사전 점검만 승인. AUTH-09~13 실제0통과·5차단, 문서 경로 AUTH-17 미실행. 합성 문서/계정·storage PUT/CORS/OCR worker·정상/실패/충돌 fixture, 업로드/재시도/등록 변경·잔존·복구 담당/방법·현재 실행 대응 미확보. [재개 조건](tasks/QA-07.md#qa-07-resume)은 유지. 후속 사용자 [진행 예외](tasks/QA-07.md#qa-07-next-qa-08-exception)로 QA-08 선정만 허용하며 QA-07 검증 면제/통합 PASS로 세지 않음. QA-06: 2026-11-02 사용자 자원 미준비 확인·사전 점검만 승인. AUTH-14/15 0통과·2차단, 실제 로그인/API·번호 등록/복구·번호 경로 모바일/키보드 미실행. 정상/중복/지연·실패/null fixture와 계정·조회 연결 POST/DELETE 및 등록 POST의 변경/잔존/복구 담당·방법·현재 실행 버전 미확보. [재개 조건](tasks/QA-06.md#사전-점검-결과와-실제-qa-재개-조건--2026-11-02)은 유지. 후속 사용자 [진행 예외](tasks/QA-06.md#qa-06-next-qa-07-exception)로 QA-07 선정만 허용하며 QA-06 검증 면제/통합 PASS로 세지 않음. QA-05: 2026-11-02 실제 MCO 4통과·6차단, AUTH-07 부분/08 미실행 차단. 기존 QA-A만 조회했으며 상태별 계정/회사·검색의 결과/번호/페이지 기대 fixture·신청 변경/복구 자원·현재 backend 실행 버전 대응 근거 미확보. 제출/상태 생성은 사용자 결정으로 차단 유지. QA-03: 2026-11-02 추가 데이터 재검증1통과·8차단. DETAIL-07 관련3/빈 상태·정확 업종/target 이동 추가 통과, 공사/용역·정정/재입찰·23 API/UI 상태·404/로컬 실패 복구 부분 확인. 물품/복수 분류·취소/변경시각·결과/참여업체/물품 페이지·승인된 합성 첨부 스트림·backend HTTP 오류·실제 clipboard/표·현재 backend 실행 버전 대응 미확보. 기존0통과9차단·QA-03 전용 제한 종료 승인 보존(확인일2026-11-02). QA-02: 2026-11-02 추가 데이터 재검증 실제10통과·6차단. BID-01/02/05/06/07/10 추가 통과, BID-13~16 회귀 확인. 물품/RESULT0·분류/정확한 날짜·기초금액·기관/지역/추정가격/결과 null 및 현재 backend 실행 버전 미확보로 BID-03/04/08/09/11/12 차단 유지. 이전4통과·12차단/재시도 수정·QA-02 전용 제한 진행 예외를 보존하며 전체 통합 PASS·다음 Task 검증 면제로 세지 않음. QA-01: 2026-11-02 추가 데이터 재검증 4통과·5차단. 실제 홈 조건 312행/첫 9행 정상·QA-A refresh 200/logout 200/이후 refresh 401과 CTA 두 분기 확인. HOME-02~06의 홈 3종·복수 분류·기관 세 분기·null·1~8/0행과 현재 backend 실행 버전 대응 미확보. 공개 보기 용역 276/공사 36/물품 0·분류 0·검사 null 0이며 준비 관찰을 홈 전체 PASS로 세지 않음. 과거 2통과·7차단과 QA-01 전용 진행 예외 보존. 필요한 역할은 공개 fixture/배포 담당·프론트 QA 실행자이며 개인 배정은 미확인. QA-04의 입력 대기는 해소됨. 과거 OAUTH_REQUEST_INVALID 세부 원인·실제 서버 설정/Clock/과거 로그는 미확보 한계로 유지하며 제품 장애로 단정하지 않음. 인증 query 출력 누락과 Native 자동 다른 창 선택의 프로필 표시 정보/무관한 탭 제목 출력은 별도 수행 사건으로 공개 기록했다. 후속 교정이 과거 노출을 없애거나 노출값 전체를 무효화한 것으로 주장하지 않음. QA-05/13 및 POL-03 기존 차단과 QA-11 실제 QA fixture 차단 유지 |
| 실행 전 주의 | 준비/대기는 실행 승인이나 실제 환경 준비 완료를 뜻하지 않음. 다음 작업의 요구사항 Gate를 통과한 뒤 시작 |

## 읽는 순서

1. [기준선](baseline.md): 무엇이 구현/미구현/정책 차이였는지, 근거와 검증 한계.
2. 이 WBS: 현재/다음 작업·우선순위·선행 조건·차단.
3. [작업 운영 규칙](workflow.md) → 선택한 작업 기록: 범위·완료 기준·직전 체크포인트.
4. [79개 항목 연결표](coverage.md): 원본 항목이 어떤 작업으로 해결되는지 역추적.
5. [기존 AI plan](../../ai-context/plan.md)·[하네스](../../ai-context/harness.md)·[실제 API QA](../../qa/README.md).

새 대화는 [고정 시작 프롬프트](start-prompt.md)를 사용한다. 커밋/push·PR·CI·main 동기화까지 요청한 경우 [Task별 전체 전달 흐름](task-cycle.md)을 따른다. PREP-01 전 기존 미커밋 변경 정리의 기록은 [main 통합 검토](reviews/main-integration.md)에서 확인한다. 이 정리로 PREP-01의 실제 QA 준비 점검을 실행한 것은 아니다.

## 분해 기준과 순서

원본 **79개 항목을 99개 실행 작업**으로 연결했다. 개발 54개(문서 작업 2개 포함), 검증 17개(사전 점검·취합 포함), 정책 결정 28개다. 항목과 작업은 다대다 관계이며 개수는 개발 진척률이 아니다.
개발 작업은 해당 단위의 자동/브라우저 검증·문서 갱신·Review Gate까지 포함한다. 별도 QA 작업은 이미 구현된 기능의 미완료 통합 검증을 이어가기 위한 것이다. 개발 후 검증을 다음 기능으로 밀어두는 구조가 아니다.

P0 기존 기능의 실제 QA·공개 준비 → P1 맞춤/알림 여정·회사 대시보드 → P2 고급 필터/상세·회사 갱신/서류함 → 팀원/권한 → 회사 간 통합 → 계정/설정 → P3 지원/콘텐츠/품질 순서다. 같은 우선순위에서는 표 순서를 기본으로 삼되 선행 조건을 먼저 해소한다. POL 작업은 관련 개발보다 먼저 수행한다.
DOC-002는 원본 C01(P3)의 UI 확장과 구분해 기존 문서 오독 방지 때문에 P0로 올렸다. QA-03은 P0 상세 통합에서 이미 구현된 P2 표시도 함께 확인한다. 나머지 원본 항목 우선순위는 coverage.md에 그대로 보존했다.
기존 기능의 대기 QA/승인 예외를 새 기능 전체의 예외로 확대하지 않는다. 작업 차단 시 다음 기능으로 자동 전환하지 않으며 아래 workflow의 재개·예외 규칙을 따른다.

상태: **대기**(순서/선행 조건 대기), **준비**(다음 요구사항 Gate 대상으로 선택), **진행**, **검증**, **리뷰**, **차단**(알려진 외부 조건), **보류**(정책/조건부 범위), **완료**(해당 단위 검증·리뷰 근거 확보). 상태 정의와 전환 조건은 [workflow.md](workflow.md)를 따른다.

2026-10-28 PREP-01에서 확정한 **조건부 실제 QA 순서**는 QA-04 → QA-01~03 → QA-05~13이다. HOME-09/BID-15의 인증 선행을 먼저 해소하기 위한 순서이며 각 작업의 자원·사용/변경/복구 승인·실행 식별자 확보 및 직전 Task 검증/리뷰 통과가 필요하다. 자세한 근거는 [준비표](../../qa/prep-01-readiness.md)를 따른다. DOC-002 종료 후 QA-04를 다음 요구사항 Gate 대상으로 선택했으며, 이는 실제 환경/승인 준비 완료나 QA 자동 착수를 뜻하지 않는다.

## 0. 작업 기반

| 작업 | 유형 | 순위 | 상태 | 원본 ID | 선행 작업 |
| --- | --- | --- | --- | --- | --- |
| [DOC-001 · 기준선·WBS·작업 기록과 workflow 연결](tasks/DOC-001.md) | 개발 | P0 | 완료 | 운영 기반 | — |
| [PREP-01 · 실제 API QA 사전 점검과 실행 순서 확정](tasks/PREP-01.md) | 검증 | P0 | 완료 | 운영 기반 | [DOC-001](tasks/DOC-001.md) |
| [DOC-002 · DESIGN.md의 인증·알림 과거 설명 정정](tasks/DOC-002.md) | 개발 | P0 | 완료 | C01 | [DOC-001](tasks/DOC-001.md) |

## 1. 기존 기능 QA·공개 준비

| 작업 | 유형 | 순위 | 상태 | 원본 ID | 선행 작업 |
| --- | --- | --- | --- | --- | --- |
| [QA-01 · 홈 9개 카드의 실제 API 통합 QA](tasks/QA-01.md) · **진행 예외 보존·추가 데이터 4통과/5차단** | 검증 | P0 | 차단 | H02 | [PREP-01](tasks/PREP-01.md) |
| [QA-02 · 공개 목록·검색·기본 필터·페이지 실제 QA](tasks/QA-02.md) · **진행 예외 보존·추가 데이터10통과/6차단** | 검증 | P0 | 차단 | L01, L03, L05, L06, L12 | [PREP-01](tasks/PREP-01.md) |
| [QA-03 · 공개 상세·개찰·물품·첨부 실제 QA](tasks/QA-03.md) · **진행 예외 보존·추가 데이터1통과/8차단** | 검증 | P0 | 차단 | D01, D02, D03, D05, D07, D08, D09 | [PREP-01](tasks/PREP-01.md) |
| [QA-04 · Google 인증·세션·시작 선택 실제 QA](tasks/QA-04.md) | 검증 | P0 | 완료 | O01, O04 | [PREP-01](tasks/PREP-01.md) |
| [QA-05 · 회사 연결·소속 신청·기본 프로필 실제 QA](tasks/QA-05.md) · **진행 예외 승인·조회4통과·6차단** | 검증 | P0 | 차단 | M01, M02, M03, O05 | [PREP-01](tasks/PREP-01.md) / [QA-04](tasks/QA-04.md) |
| [QA-06 · 사업자번호 등록·가입 정보 실제 QA](tasks/QA-06.md) · **진행 예외 승인·사전 점검·실제0통과/2차단** | 검증 | P0 | 차단 | O06, O08 | [PREP-01](tasks/PREP-01.md) / [QA-04](tasks/QA-04.md) |
| [QA-07 · 가입 문서 업로드·OCR 실제 QA](tasks/QA-07.md) · **진행 예외 승인·사전 점검·실제0통과/5차단** | 검증 | P0 | 차단 | O07, O08 | [PREP-01](tasks/PREP-01.md) / [QA-04](tasks/QA-04.md) |
| [QA-08 · 초대 수신·계정 불일치·수락/거절 실제 QA](tasks/QA-08.md) · **진행 예외 승인·사전 점검·실제0통과/1차단** | 검증 | P0 | 차단 | O10 | [PREP-01](tasks/PREP-01.md) / [QA-04](tasks/QA-04.md) |
| [QA-09 · 상세 공고별 알림 실제 QA](tasks/QA-09.md) · **진행 예외 승인·사전 점검·실제0통과/8차단** | 검증 | P0 | 차단 | D04 | [PREP-01](tasks/PREP-01.md) / [QA-04](tasks/QA-04.md) |
| [QA-10 · 개인 필터 12개 기존 사례 재검증](tasks/QA-10.md) · **진행 예외 승인·사전 점검·실제0통과/12차단** | 검증 | P0 | 차단 | L11 | [PREP-01](tasks/PREP-01.md) / [QA-04](tasks/QA-04.md) |
| [QA-11 · 받은 알림·읽음·21건 이상 실제 QA](tasks/QA-11.md) · **다음 Gate 선정·fixture 차단 보존** | 검증 | P0 | 준비 | N01 | [PREP-01](tasks/PREP-01.md) / [QA-04](tasks/QA-04.md) |
| [QA-12 · 이메일 ON/OFF의 실제 서버 오류 QA](tasks/QA-12.md) | 검증 | P0 | 대기 | S04 | [PREP-01](tasks/PREP-01.md) / [QA-04](tasks/QA-04.md) |
| [QA-13 · 대체 이메일 인증·전환의 남은 실제 QA](tasks/QA-13.md) | 검증 | P0 | 차단 | S05 | [PREP-01](tasks/PREP-01.md) / [QA-04](tasks/QA-04.md) |
| [POL-01 · 정식 약관·푸터 공개 정보 확정](tasks/POL-01.md) | 정책 결정 | P0 | 대기 | H04, O03 | [DOC-001](tasks/DOC-001.md) |
| [DEV-01 · 정식 약관 본문·동의 버전 연결](tasks/DEV-01.md) | 개발 | P0 | 대기 | O03 | [POL-01](tasks/POL-01.md) |
| [DEV-02 · 홈 푸터 정보·약관·문의 링크 구현](tasks/DEV-02.md) | 개발 | P0 | 대기 | H04 | [POL-01](tasks/POL-01.md) / [DEV-01](tasks/DEV-01.md) |
| [QA-16 · P0 공개 준비 결과 취합](tasks/QA-16.md) | 검증 | P0 | 대기 | H02, H04, L01, L03, L11, L12, D01, D04, D07, D08, D09, M01, M02, O01, O03, O04, O05, O06, O07, O10, S04, S05, N01 | [DOC-002](tasks/DOC-002.md) / [QA-01](tasks/QA-01.md) / [QA-02](tasks/QA-02.md) / [QA-03](tasks/QA-03.md) / [QA-04](tasks/QA-04.md) / [QA-05](tasks/QA-05.md) / [QA-06](tasks/QA-06.md) / [QA-07](tasks/QA-07.md) / [QA-08](tasks/QA-08.md) / [QA-09](tasks/QA-09.md) / [QA-10](tasks/QA-10.md) / [QA-11](tasks/QA-11.md) / [QA-12](tasks/QA-12.md) / [QA-13](tasks/QA-13.md) / [DEV-01](tasks/DEV-01.md) / [DEV-02](tasks/DEV-02.md) |

## 2. 맞춤 목록·알림·회사 대시보드

| 작업 | 유형 | 순위 | 상태 | 원본 ID | 선행 작업 |
| --- | --- | --- | --- | --- | --- |
| [POL-02 · 맞춤 공고 조회·개인 필터 의미 확정](tasks/POL-02.md) | 정책 결정 | P1 | 대기 | L02, H03 | [DOC-001](tasks/DOC-001.md) |
| [DEV-03 · 맞춤 공고 목록과 홈 CTA 여정 연결](tasks/DEV-03.md) | 개발 | P1 | 대기 | L02, H03 | [POL-02](tasks/POL-02.md) |
| [POL-03 · 등록 공고 전체 목록·일괄 해제 계약 확정](tasks/POL-03.md) | 정책 결정 | P1 | 차단 | A01, A02 | [DOC-001](tasks/DOC-001.md) |
| [DEV-04 · 알림 등록 공고 전체/분류별 관리 목록](tasks/DEV-04.md) | 개발 | P1 | 대기 | A01 | [POL-03](tasks/POL-03.md) |
| [DEV-05 · 등록 공고 선택·일괄 알림 해제](tasks/DEV-05.md) | 개발 | P1 | 대기 | A02 | [DEV-04](tasks/DEV-04.md) |
| [POL-04 · 받은 알림 actionPath·이동/읽음 정책 확정](tasks/POL-04.md) | 정책 결정 | P1 | 대기 | N03 | [DOC-001](tasks/DOC-001.md) |
| [DEV-06 · 받은 알림의 안전한 대상 화면 이동](tasks/DEV-06.md) | 개발 | P1 | 대기 | N03 | [POL-04](tasks/POL-04.md) |
| [POL-05 · 알림 변경 신호·REST 재조회 계약 확정](tasks/POL-05.md) | 정책 결정 | P1 | 대기 | N04 | [DOC-001](tasks/DOC-001.md) |
| [DEV-07 · 새 알림 신호 수신·재연결 갱신](tasks/DEV-07.md) | 개발 | P1 | 대기 | N04 | [POL-05](tasks/POL-05.md) |
| [POL-06 · 가입 후 회사 실적·인증·희망금액 조회 계약](tasks/POL-06.md) | 정책 결정 | P1 | 대기 | M04 | [DOC-001](tasks/DOC-001.md) |
| [DEV-08 · 가입 후 회사 실적·인증·희망금액 대시보드](tasks/DEV-08.md) | 개발 | P1 | 대기 | M03, M04, O08 | [POL-06](tasks/POL-06.md) |

## 3. 필터·상세·회사 동선 보완

| 작업 | 유형 | 순위 | 상태 | 원본 ID | 선행 작업 |
| --- | --- | --- | --- | --- | --- |
| [POL-07 · 고급 조건·범위·낙찰금액 계약 확정](tasks/POL-07.md) | 정책 결정 | P2 | 대기 | L07, L08, L09, L10 | [DOC-001](tasks/DOC-001.md) |
| [DEV-09 · 고급 지역·업체·공동도급 조건 연결](tasks/DEV-09.md) | 개발 | P2 | 대기 | L07 | [POL-07](tasks/POL-07.md) |
| [DEV-10 · 날짜 기준·직접 기간 입력 연결](tasks/DEV-10.md) | 개발 | P2 | 대기 | L08 | [POL-07](tasks/POL-07.md) |
| [DEV-11 · 금액 종류·직접 최소/최대 연결](tasks/DEV-11.md) | 개발 | P2 | 대기 | L09 | [POL-07](tasks/POL-07.md) |
| [DEV-12 · 개찰결과 낙찰금액 필터 연결](tasks/DEV-12.md) | 개발 | P2 | 대기 | L10 | [POL-07](tasks/POL-07.md) |
| [POL-08 · 정정 이력 조회·선택 계약 확정](tasks/POL-08.md) | 정책 결정 | P2 | 대기 | D06, C02 | [DOC-001](tasks/DOC-001.md) |
| [DEV-13 · 상세 정정 이력 팝업·선택 연결](tasks/DEV-13.md) | 개발 | P2 | 대기 | D06, C02 | [POL-08](tasks/POL-08.md) |
| [POL-09 · 원문 본문·추가 일자 제공 범위 결정](tasks/POL-09.md) | 정책 결정 | P2 | 대기 | D10 | [DOC-001](tasks/DOC-001.md) |
| [DEV-14 · 승인된 원문·추가 일자 표시](tasks/DEV-14.md) | 개발 | P2 | 대기 | D10 | [POL-09](tasks/POL-09.md) |
| [POL-10 · 소속 신청 취소 계약·권한 결정](tasks/POL-10.md) | 정책 결정 | P2 | 대기 | M05 | [DOC-001](tasks/DOC-001.md) |
| [DEV-15 · 소속 신청 취소 실행 연결](tasks/DEV-15.md) | 개발 | P2 | 대기 | M05 | [POL-10](tasks/POL-10.md) |
| [POL-11 · 회사 찾기/등록 재사용 동선 결정](tasks/POL-11.md) | 정책 결정 | P2 | 대기 | M06 | [DOC-001](tasks/DOC-001.md) |
| [DEV-16 · 회사 찾기/등록의 관리 화면 복귀 보완](tasks/DEV-16.md) | 개발 | P2 | 대기 | M06 | [POL-11](tasks/POL-11.md) |

## 4. 회사 갱신·서류함

| 작업 | 유형 | 순위 | 상태 | 원본 ID | 선행 작업 |
| --- | --- | --- | --- | --- | --- |
| [POL-12 · 회사 갱신·비교 적용·직접 수정 정책](tasks/POL-12.md) | 정책 결정 | P2 | 대기 | U01, U02, U03, F04 | [POL-06](tasks/POL-06.md) |
| [DEV-17 · 연도별 최신 정보·갱신 안내](tasks/DEV-17.md) | 개발 | P2 | 대기 | U01 | [POL-12](tasks/POL-12.md) / [DEV-08](tasks/DEV-08.md) |
| [DEV-18 · 최신 회사정보 불러오기·차이 비교](tasks/DEV-18.md) | 개발 | P2 | 대기 | U02 | [POL-12](tasks/POL-12.md) / [DEV-17](tasks/DEV-17.md) |
| [DEV-19 · 선택한 회사정보 적용·충돌 처리](tasks/DEV-19.md) | 개발 | P2 | 대기 | U02 | [DEV-18](tasks/DEV-18.md) |
| [DEV-20 · 회사 정보 직접 편집·저장](tasks/DEV-20.md) | 개발 | P2 | 대기 | U03 | [POL-12](tasks/POL-12.md) / [DEV-08](tasks/DEV-08.md) |
| [DEV-21 · 회사 프로필 이미지 변경](tasks/DEV-21.md) | 개발 | P2 | 대기 | U03 | [POL-12](tasks/POL-12.md) / [DEV-08](tasks/DEV-08.md) |
| [POL-13 · 서류함 생명주기·접근·삭제 계약](tasks/POL-13.md) | 정책 결정 | P2 | 대기 | F01, F02, F03, F04 | [DOC-001](tasks/DOC-001.md) |
| [DEV-22 · 가입 후 서류함 목록·보유/만료 상태](tasks/DEV-22.md) | 개발 | P2 | 대기 | F01 | [POL-13](tasks/POL-13.md) |
| [DEV-23 · 서류 상세·이력·다운로드](tasks/DEV-23.md) | 개발 | P2 | 대기 | F02 | [DEV-22](tasks/DEV-22.md) |
| [DEV-24 · 서류함 문서 추가·재업로드](tasks/DEV-24.md) | 개발 | P2 | 대기 | F03, C02 | [DEV-22](tasks/DEV-22.md) |
| [DEV-25 · 보관 문서 삭제·완료 피드백](tasks/DEV-25.md) | 개발 | P2 | 대기 | F03 | [DEV-23](tasks/DEV-23.md) |
| [DEV-26 · 서류 OCR 결과를 회사 갱신에 반영](tasks/DEV-26.md) | 개발 | P2 | 대기 | F04 | [POL-12](tasks/POL-12.md) / [DEV-19](tasks/DEV-19.md) / [DEV-24](tasks/DEV-24.md) |

## 5. 팀원·권한·초대

| 작업 | 유형 | 순위 | 상태 | 원본 ID | 선행 작업 |
| --- | --- | --- | --- | --- | --- |
| [POL-14 · 팀원 권한·초대·합류·직급 계약](tasks/POL-14.md) | 정책 결정 | P2 | 대기 | T01, T02, T03, T04 | [DOC-001](tasks/DOC-001.md) |
| [DEV-27 · 팀원 목록·역할·상세 조회](tasks/DEV-27.md) | 개발 | P2 | 대기 | T01 | [POL-14](tasks/POL-14.md) |
| [DEV-28 · 팀원 정보·권한 변경](tasks/DEV-28.md) | 개발 | P2 | 대기 | T01 | [DEV-27](tasks/DEV-27.md) |
| [DEV-29 · 팀원 초대 발송](tasks/DEV-29.md) | 개발 | P2 | 대기 | T02 | [DEV-27](tasks/DEV-27.md) |
| [DEV-30 · 초대 재발송·취소 관리](tasks/DEV-30.md) | 개발 | P2 | 대기 | T02 | [DEV-29](tasks/DEV-29.md) |
| [DEV-31 · 합류 신청 목록·검토·승인/거절](tasks/DEV-31.md) | 개발 | P2 | 대기 | T03 | [DEV-27](tasks/DEV-27.md) |
| [DEV-32 · 회사 직급 목록·추가·관리](tasks/DEV-32.md) | 개발 | P2 | 대기 | T04 | [DEV-27](tasks/DEV-27.md) |
| [POL-15 · 초대 수락 후 팀원 목적지 결정](tasks/POL-15.md) | 정책 결정 | P2 | 대기 | O11 | [POL-14](tasks/POL-14.md) |
| [DEV-33 · 초대 수락 완료의 팀원 화면 연결](tasks/DEV-33.md) | 개발 | P2 | 대기 | O11 | [POL-15](tasks/POL-15.md) / [DEV-27](tasks/DEV-27.md) |

## 6. 회사 간 통합

| 작업 | 유형 | 순위 | 상태 | 원본 ID | 선행 작업 |
| --- | --- | --- | --- | --- | --- |
| [POL-16 · 회사 간 통합·부분 승인·충돌 정책](tasks/POL-16.md) | 정책 결정 | P2 | 대기 | G01, G02, G03 | [POL-12](tasks/POL-12.md) / [POL-14](tasks/POL-14.md) |
| [DEV-34 · 회사 간 통합 요청 발송·상태](tasks/DEV-34.md) | 개발 | P2 | 대기 | G01 | [POL-16](tasks/POL-16.md) / [DEV-28](tasks/DEV-28.md) |
| [DEV-35 · 받은 통합 요청의 단계별 검토](tasks/DEV-35.md) | 개발 | P2 | 대기 | G02 | [DEV-34](tasks/DEV-34.md) / [DEV-08](tasks/DEV-08.md) |
| [DEV-36 · 통합 전체/일부 승인·완료](tasks/DEV-36.md) | 개발 | P2 | 대기 | G03 | [DEV-35](tasks/DEV-35.md) |
| [DEV-37 · 통합 요청 거절·상태 갱신](tasks/DEV-37.md) | 개발 | P2 | 대기 | G03 | [DEV-35](tasks/DEV-35.md) |

## 7. 계정·설정·정책 보완

| 작업 | 유형 | 순위 | 상태 | 원본 ID | 선행 작업 |
| --- | --- | --- | --- | --- | --- |
| [QA-14 · 설정 홈·현재 메뉴·로그아웃 회귀](tasks/QA-14.md) | 검증 | P2 | 대기 | S01 | [PREP-01](tasks/PREP-01.md) |
| [POL-17 · 계정 정보 변경·인증 방식 결정](tasks/POL-17.md) | 정책 결정 | P2 | 대기 | S02, C02 | [DOC-001](tasks/DOC-001.md) |
| [DEV-38 · 계정 정보 조회·승인된 변경 연결](tasks/DEV-38.md) | 개발 | P2 | 대기 | S02 | [POL-17](tasks/POL-17.md) |
| [POL-18 · 탈퇴 조건·회사 권한·데이터 처리 결정](tasks/POL-18.md) | 정책 결정 | P2 | 대기 | S03, C02 | [POL-14](tasks/POL-14.md) / [POL-17](tasks/POL-17.md) |
| [DEV-39 · 탈퇴 조건 확인·인증·확인 UI](tasks/DEV-39.md) | 개발 | P2 | 대기 | S03, C02 | [POL-18](tasks/POL-18.md) / [DEV-38](tasks/DEV-38.md) |
| [DEV-40 · 탈퇴 실행·완료·승인된 철회 연결](tasks/DEV-40.md) | 개발 | P2 | 대기 | S03 | [DEV-39](tasks/DEV-39.md) |
| [POL-19 · 알림 디자인·중앙 정책·인증 시간 정합성 결정](tasks/POL-19.md) | 정책 결정 | P2 | 대기 | S06, S09 | [DOC-001](tasks/DOC-001.md) |
| [DEV-41 · mock 이메일 인증 시간·개발 가이드 동기화](tasks/DEV-41.md) | 개발 | P2 | 대기 | S09 | [POL-19](tasks/POL-19.md) |
| [POL-20 · 받은 알림 삭제/숨김·보존 정책 확정](tasks/POL-20.md) | 정책 결정 | P2 | 대기 | N02 | [DOC-001](tasks/DOC-001.md) |
| [DEV-43 · 받은 알림 선택·삭제/숨김 연결](tasks/DEV-43.md) | 개발 | P2 | 대기 | N02 | [POL-20](tasks/POL-20.md) |
| [POL-21 · 가입 중 실적·인증 직접 편집 계약](tasks/POL-21.md) | 정책 결정 | P2 | 대기 | O09 | [DOC-001](tasks/DOC-001.md) |
| [DEV-44 · 가입 실적·인증 직접 수정 UI 연결](tasks/DEV-44.md) | 개발 | P2 | 대기 | O09 | [POL-21](tasks/POL-21.md) |
| [POL-22 · 회사 조건을 개인 필터로 가져오는 정책](tasks/POL-22.md) | 정책 결정 | P2 | 대기 | L11 | [POL-06](tasks/POL-06.md) |
| [DEV-45 · 회사 조건의 명시적 개인 필터 가져오기](tasks/DEV-45.md) | 개발 | P2 | 대기 | L11 | [POL-22](tasks/POL-22.md) / [DEV-08](tasks/DEV-08.md) |

## 8. 지원·콘텐츠·품질

| 작업 | 유형 | 순위 | 상태 | 원본 ID | 선행 작업 |
| --- | --- | --- | --- | --- | --- |
| [POL-23 · 최근/추천 검색어 공급원·보존 결정](tasks/POL-23.md) | 정책 결정 | P3 | 대기 | L04 | [DOC-001](tasks/DOC-001.md) |
| [DEV-47 · 승인된 최근·추천 검색어 팝업](tasks/DEV-47.md) | 개발 | P3 | 대기 | L04 | [POL-23](tasks/POL-23.md) |
| [POL-24 · 네이버 로그인 지원 여부 결정](tasks/POL-24.md) | 정책 결정 | P3 | 대기 | O02 | [DOC-001](tasks/DOC-001.md) |
| [DEV-48 · 승인된 네이버 OAuth 연결](tasks/DEV-48.md) | 개발 | P3 | 대기 | O02 | [POL-24](tasks/POL-24.md) |
| [POL-25 · 서비스 이용안내 콘텐츠·목적지 결정](tasks/POL-25.md) | 정책 결정 | P3 | 대기 | S07 | [DOC-001](tasks/DOC-001.md) |
| [DEV-49 · 서비스 이용안내 진입 연결](tasks/DEV-49.md) | 개발 | P3 | 대기 | S07 | [POL-25](tasks/POL-25.md) |
| [POL-26 · 의견 보내기·문의 수집 채널 결정](tasks/POL-26.md) | 정책 결정 | P3 | 대기 | S08 | [DOC-001](tasks/DOC-001.md) |
| [DEV-50 · 설정·FAQ 의견 보내기 연결](tasks/DEV-50.md) | 개발 | P3 | 대기 | S08 | [POL-26](tasks/POL-26.md) |
| [POL-27 · 메이트 소식 발행·콘텐츠 공급원 결정](tasks/POL-27.md) | 정책 결정 | P3 | 대기 | W01, W02 | [DOC-001](tasks/DOC-001.md) |
| [DEV-51 · 메이트 소식 목록·필터·GNB 연결](tasks/DEV-51.md) | 개발 | P3 | 대기 | W01 | [POL-27](tasks/POL-27.md) |
| [DEV-52 · 소식 상세·이미지·목록 복귀](tasks/DEV-52.md) | 개발 | P3 | 대기 | W02 | [DEV-51](tasks/DEV-51.md) |
| [POL-28 · 운영 canonical URL·OG 이미지 결정](tasks/POL-28.md) | 정책 결정 | P3 | 대기 | C03 | [DOC-001](tasks/DOC-001.md) |
| [DEV-53 · OG 이미지·canonical 메타데이터 연결](tasks/DEV-53.md) | 개발 | P3 | 대기 | C03 | [POL-28](tasks/POL-28.md) |
| [DEV-54 · 상세 페이지 main 랜드마크 중첩 해소](tasks/DEV-54.md) | 개발 | P3 | 대기 | C04 | [DOC-001](tasks/DOC-001.md) |
| [QA-15 · 정적 홈·FAQ·공용 UI의 조건부 회귀](tasks/QA-15.md) | 검증 | P3 | 보류 | H01, Q01, C01 | [DOC-001](tasks/DOC-001.md) |

## 갱신 규칙

- 상태는 이 문서에서만 관리한다. 작업 기록에 최신 상태 표를 중복하지 않는다. 기록에는 날짜가 있는 사건·시도·증거·다음 행동을 쓴다.
- 한 번에 진행/검증/리뷰 중인 작업은 하나다. 완료 후 현재를 비우고 다음 작업 하나를 지정한다. 다음 작업의 의존성·정책·검증 조건을 다시 확인한다.
- 원본 ID와 작업 ID는 재사용하지 않는다. 추가 요구는 신규 ID로 기록하고, 원본 스냅샷을 덮어쓰지 않는다. 분리/병합/제외는 연결표와 결정 근거를 함께 갱신한다.
- 의존성은 선행 산출물을 읽어야 한다는 뜻이다. 보류/예외가 있는 선행 작업은 자동 충족되지 않으며 영향과 승인 범위를 확인한다.
- 공개 문서·콘텐츠/API/메일·계정 조건은 착수 시 현행 소유 소스와 배포를 확인한다. 2026-10-27 보고서는 현재 서버 실행의 증명이 아니다.
- 일정/소요일은 요구사항 Gate 이후 산정한다. 근거 없는 날짜·완료율은 넣지 않는다.
- 새 작업은 [TEMPLATE.md](tasks/TEMPLATE.md)를 복사한다. 결과는 작업 기록과 기존 QA case에 남기고 [검토 기록](reviews/DOC-001.md) 같은 파일에 Review Gate 근거를 보존한다.

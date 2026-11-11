# POL-29 · 기존 구현의 화면별 Figma 기준·의도적 차이 결정

[상태의 단일 기준: WBS](../README.md) · [운영 규칙](../workflow.md) · [전수 감사](../audits/2026-11-11.md)

## 작업 정의

- 유형: 정책 결정. 원본: L11/C01/O01/O04/H01/H03/D01/D02/S04/S06 및2026-11-11 전수 감사.
- 선행: [QA-17](QA-17.md)의 현재 소스·디자인·정책 대조. 하나의 목적은 **이미 구현된 화면의 시각 기준/의도적 예외를 추적 가능하게 결정하는 것**이다.
- 대상: CF-01 개인 필터, CF-02 헤더, CF-03 가입/시작, CF-04 홈 안내, CF-10 상세, CF-14 알림 설정의 현행 정책을 반영한 화면. 해당 후속 개발은 DEV-55/56/57/58/64 및 기존 POL-19/DEV-41이다.
- 제외: 제품 구현, 계정/회사 정책 재정의, 서버가 보장하지 않는 기능의 약속, 실제 API 변경·메일·문서 업로드·Git 전달/배포. 뉴스/약관/계정관리 등 기존 정책 Task를 흡수하지 않는다.
- 책임: 제품/디자인 결정 역할과 프론트 실행 역할을 구분하며 개인 담당자는 미확인이다. 이번 감사는 차이 정리/계획만 승인됐고 시각 예외 자체를 승인받은 것은 아니다.

## 착수 전 Implementation Brief / 설계 Gate

- 성공 기준: 프레임별 기준·현재 차이·정책/계약 제약·선택·결정자/날짜·수용할 추가 상태·후속 Task를 갖춘 표와 검증 기준.
- 첫 행동: [감사 CF-01~04/10/14](../audits/2026-11-11.md#cf-01)와 고정 출처를 읽고 현재 Figma/소스가 변했는지 확인한다. 이미 승인된 도메인 정책은 다시 묻지 않고 시각/문구의 미결만 모은다.
- 편집 전 수정 문서/영향·단계·검증을 제시한다. blocking ambiguity는 관련 선택을 묶어 최대3질문과 추천으로 해결한다. 추천은 승인으로 간주하지 않는다.

## 결정할 항목과 추천

| 화면 | 결정할 내용 | 추천 출발점·제약 | 후속 소유 |
| --- | --- | --- | --- |
| 개인 필터 | 왼쪽 내 맞춤과 별도 저장/초기화의 위치·표시 조건·상태 | Figma의 왼쪽 적용 축을 유지하고 필수 계정 동작을 승인된 보조 영역에 명시. 수동 적용과 저장을 합치지 않음 | [DEV-55](DEV-55.md) |
| 헤더·인사 | 회사/사용자 식별·빈/로딩/오류 fallback | 현재 id/email 계약에 없는 이름을 합성하지 않음. 회사 없음/불러오는 중을 명시. 뉴스 연결은 기존 DEV-51 | [DEV-56](DEV-56.md) |
| 가입·시작 | 692/640 등 frame별 폭·이름 없는 인사말·native date 유지 | 시작 선택 frame에 맞는 variant. 모든 AuthScreen 폭을 일괄 변경하지 않음 | [DEV-57](DEV-57.md) |
| 홈 | 맞춤/분석/실시간 안내의 현재 제공 범위·준비 중 표현 | 현재 활성 흐름/정책과 연결한 문구. 추천·자동갱신 구현 전 제공 완료로 안내하지 않음 | [DEV-58](DEV-58.md) |
| 상세 | 단위 전환 위치/폭·추가 분류 선택·auth/결측/오류 디자인 | Figma 기본 배치를 따르며 canonical 분류의 필수 선택/URL 정책을 보존 | [DEV-64](DEV-64.md) |
| 알림 설정 | 현재 이메일1토글의 시안·문구/상태와 예외 | 현행08:30 이메일·독립 내부알림을 유지. 오래된 전역/야간 토글을 복원하지 않음 | [POL-19](POL-19.md) / [DEV-41](DEV-41.md) |

## 완료 기준

- [x] 각 항목에 Figma node·source·정책/계약 고정 ref, 유지/정렬/의도적 예외·이유·결정자/날짜를 기록한다. 포괄적인 “실개발 예외” 한 줄로 승인하지 않는다.
- [x] 정상/비로그인/로딩/빈값·dirty/저장중/오류·권한/충돌·모바일/키보드 상태를 원본 frame 또는 승인한 확장 상태에 연결한다. 디자인이 없는 상태를 기능 삭제로 해결하지 않는다.
- [x] 명시적 visual 승인과 정책에 근거한 기능 차이를 구분한다. 계정명/회사명 출처·fallback·기능 제공 시점 등 미확정 계약은 보류/재개 조건으로 남긴다.
- [x] DEV-55~58/64와 POL-19/DEV-41의 범위·의존성/검증 방법, coverage/WBS를 결정에 맞춰 갱신한다. 기존 QA/POL 차단과 예외를 보존한다.
- [x] 문서 링크/ID/의존성/단일 상태·diff-check, Documentation Update Check와 verifier/ai-review를 완료한다. 제품 구현/실제 QA와 구분한다.

## 체크포인트 · 결정·검증 기록

| 날짜 | 결과 | 다음 행동 |
| --- | --- | --- |
| 2026-11-11 | QA-17에서 후보 구성. 위 추천은 미승인. 이번 사용자 요청은 점검/계획 문서까지만 | 다음 Task로 선택 시 현재 출처·Brief를 확인하고 미결 선택을 최대3질문으로 제시 |

- 정책 결정/개발/실제 QA 미실행. 감사/계획 검토는 이 정책 선택의 승인이나 구현 PASS를 뜻하지 않는다.
- 상태는 WBS에서만 관리한다. 데이터/프로세스 변경 없음. Git 전달 없음.

## 2026-11-11 · 이번 요청의 승인·조사 체크포인트

- 시작: clean `main` / `f505421d6e5337ab3db4dac342d57bf18a948246`. `git fetch origin main` 뒤 좌/우 차이 0/0, QA-17 PR #50 main 반영 확인. 같은 Task 브랜치/미커밋 변경 없음. `docs/pol-29-visual-policy` 생성. 별도 detached worktree는 건드리지 않았다.
- 이번 사용자 요청은 POL-29 하나의 정책 조사·결정/문서, 검증·리뷰·목적별 커밋·push·PR·CI 확인·조건 충족 시 main 병합·로컬 main fast-forward까지 명시적으로 승인한다. QA-17 당시 POL-29 미착수/Git 제외 기록은 당시 이력이며 이번 범위를 제한하지 않는다. 제품 구현·실제 업무 API/메일/업로드·운영/배포와 다른 Task 실행은 포함하지 않는다. 이전 PR #49의 Chromatic 예외도 이번 PR에 적용하지 않는다.
- 편집 전 계획: 본 기록의 frame/state별 기준·선택/결정자·후속 검증표, 연결 DEV-55~58/64·POL-19/DEV-41의 인계 기준, WBS/coverage/plan 및 검토 기록만 수정한다. 원본 baseline·날짜별 감사·기존 QA/POL 결정을 보존한다. 링크/ID/79개 coverage·의존성/단일 상태·제품/원본 지문·Markdown 형식·diff-check와 read-only verifier/ai-review를 수행한다. 실행 코드 영향이 없어 로컬 앱 test/lint/build·Storybook build는 미실행 계획이다.
- 조사: AGENTS/feature-workflow/context-audit/ai-review와 필요한 ai-context, QA-17/감사 CF-01~04/10/14, 연결된 소유 Task·package scripts를 확인했다. 현재 소스는 감사 당시 `8d3a2ec` 이후 제품/테스트/설정 diff가 없다. 전체 과거 대화나 무관 Task는 조회하지 않았다.
- Figma 원본 메타데이터 10개 node와 가입 section의 선택 frame 위치를 조회하고, 대표 8개 frame screenshot을 직접 대조했다. 로그인 420px·가입 입력 640px·시작 선택 692px, 상세 본문 792px/간격16px/사이드372px를 확인했다. 조회는 읽기 전용이며 Figma 파일 수정은 없다. 미제공 loading/error/mobile frame의 모든 pixel 정합성으로 확대하지 않는다.
- 중앙 정책 main은 `c9e50ff591ae18023164e1a94581c611bf1e4f29`로 감사와 동일하다. ADR-0013/0014·Account·공고 찾기·알림 정책 5개 원문을 현재 ref에서 확인했다. backend dev는 `4c328d4a943eaa5dcbb0e8d9596b22389d154988`, main은 `8b36ca562d4a4a581b4175cb0d0f1ba15ad7e39d`로 감사 이후 변경됐다. 두 ref의 AuthenticationResponse 동일 blob `28334c299b38e2e1c28a538fcb417ebe1dc6ff5c`: account=id/email, companyContext=companyId/role이며 표시 이름은 없다.
- Swagger는 Python 비인증 GET403 뒤 curl로 OpenAPI3.1.0/v1·183paths의 유효 JSON을 확보했다(후속 curl 최종 HTTP status는 미수집). SHA256 `e65f29c77d3dfa0c29a336c29d7d33f3f54123e8736d81f2fd7a7c30788e1e63`. 관련 schema도 인증 계정 id/email·회사 문맥 companyId/role과 회사 기본 profile의 companyName을 확인했다. 소스 commit·배포 문서·실행 process SHA·실제 업무 응답은 별개다. 이번 배포 문서/실행 SHA/업무 응답·실제 통합은 확인하지 않았다.
- 원시 정책/선택 source·Figma XML/PNG/지문·OpenAPI schema 및 시작 tracked483파일 지문은 저장소 밖 `/Users/jisung/.codex/visualizations/2026/11/11/mate-pol-29/`에 보존한다. 단기 서명 screenshot URL·실제 인증/개인정보/환경파일 값은 문서에 기록하지 않는다. screenshot URL 직접 다운로드가 빈 파일을 반환해 inline 결과로 8개 PNG를 보존했다.
- 요구사항 Gate 미결: 사용자에게 D1(개인 필터/상세), D2(헤더/가입), D3(홈/알림)의 구체적 추천과 대안을 3질문으로 제시했다. **답변 전 추천은 미승인**이며 정책 선택 확정·후속 개발 설계/구현·실제 QA를 진행하지 않는다. 추가 상태는 기존 기능/소유권을 보존하는 조건으로 결정표에 연결할 예정이다.
- 다음 첫 행동: 세 답변을 기록하고 Implementation Brief/수정 계획을 확정한 뒤 frame/state별 기준과 후속 인계를 문서화한다. 답변 대기 중에는 근거/보존 검사 준비만 수행한다.

### 사용자 1차 답변과 보정 · 2026-11-11

- D1: 사용자 원문 **“추천안 확정”**. 개인 필터 왼쪽 적용/하단 보조행 저장·초기화, 상세 792+16+372=1180/breadcrumb 단위 전환·제목 다음 분류 선택 예외와 320/390px 순서/표 내부 스크롤은 승인됐다. 구현은 DEV-55/64 후속 Gate이며 이번에는 미실행이다.
- D2: 사용자 원문 **“왜 `마이페이지`를 표시하는거야? figma대로라면, 로그인한 사람은 헤더 우측에는 사용자 이름과 아이콘이 있어야 하지 않니?”**. 사용자 이름+아이콘을 목표 기준으로 보정한다. primary의 `마이페이지` 대체 추천은 승인되지 않았으며 표시 계약 부재를 화면 목표 변경의 이유로 삼지 않는다.
- D3: 사용자 원문 **“figma대로 하면 안돼?”**. 최초 홈 CTA 공개 /bids 변경·알림 화면 예외 추천의 승인이 아니다. Figma 배치/시각 기준 유지와 현행 기능/정책 차이를 나눠 설명하고 남은 선택만 확인한다. 기존 인증→recommended 복귀 정책을 임의 변경하지 않는다.
- 추가 조사: 현재 OpenAPI의 공개 /me·auth GET 및 company/admin을 제외한 name/profile 응답 후보를 확인했다. account name을 주는 공개 현재 계정 조회 계약은 확인하지 못했다. 가입 거래의 suggestedName은 신규 가입 입력 제안이며 기존 로그인 사용자의 지속적인 이름 공급원으로 사용하지 않는다. 별도 이름 source가 확인되기 전 새 endpoint·이메일 유추·임시 가입 이름 저장을 설계하지 않는다.

### 화면 기준 보정과 남은 확인 · 2026-11-11

- D2 목표는 사용자 지적에 따라 **로그인 사용자 이름+Figma 아이콘**이다. 회사명/이메일 앞부분/일반 마이페이지 텍스트로 이름을 대체하는 추천을 철회한다. 이름 API 공급원·권한·결측/지연/오류 표시 계약과 Figma에 없는 fallback은 미승인이며 DEV-56의 재개 Gate에 남긴다. 신규 endpoint나 profile 계약은 POL-29가 임의 확정하지 않는다. 표시 이름 계약이 필요한 시작 인사말도 DEV-57에 연결한다.
- 가입/시작은 원본 frame별 폭·시각을 기준으로 하며 AuthScreen 전체를692px로 바꾸지 않는다. native date의 화면 예외는 승인받지 않았다. 원본에 없는 OS 달력 내부를 1:1 검증했다고 주장하지 않고 실제 입력 표면은 Figma 기준/접근성 검증 대상으로 둔다.
- D3 재설명: 토글은 켜기/끄기 스위치다. Figma의 ‘나에게 맞는 입찰공고 알림’은 현재 ‘맞춤 공고 이메일 받기’에 해당한다. ‘입찰공고 상세 알림’은 각 공고 상세에서 개별 설정하며 ‘실시간 알림 야간 수신 동의’는 현행 정책에 없다. 여기에서 이메일을 꺼도 공고별 내부 알림이 꺼지지 않는다. 세 스위치의 의미를 사용자에게 쉬운 표로 설명했다. 사용자의 설명 요청은 화면 예외 승인으로 세지 않는다.
- 홈은 Figma 배치/일러스트/기존 맞춤 CTA와 인증 복귀를 기준으로 좁혔다. 최초 공개 /bids CTA 변경 추천은 철회했다. 미제공 기능의 준비 중 문구·알림 화면의 이메일 스위치1개를 명시적 예외로 두는 남은 선택은 아직 미결이다. 기존 도메인 정책의 기능 개수를 다시 승인받거나 임의 변경하는 질문은 아니다.
- Git 사전 확인: merge/rebase/squash 허용, main protected=false·ruleset 목록없음, `type: docs` 라벨 존재. 원격 최신 CI·리뷰 조건은 최종 PR/head에서 다시 확인한다. 현재 commit/push/PR·운영 배포는 미실행이다.

### 예외 사유 설명 · 2026-11-11

- 사용자 원문: **“이거를 예외로 하자는 이유는, 아직 백엔드 api가 없기 때문이야?”**. 이유를 묻는 질문이며 D3 화면 예외 승인이 아니다.
- 구분해서 답변했다. 알림은 현재 정책이 매일08:30 맞춤 이메일 ON/OFF와 공고별 내부 알림을 분리하며 야간/전역 스위치를 제공하지 않는다는 도메인 제약이다. 맞춤 이메일/개별 공고 설정 API는 이미 존재한다. API 부재만을 근거로 Figma 설정2개를 임시 숨기는 결정으로 기록하지 않는다. 홈은 추천 목록·실시간 자동 갱신의 현재 프론트 구현/연결 미완료를 안내하는 문제다. 백엔드 기능 전체의 부재로 단정하지 않는다.
- 남은 선택: Figma 시각/기존 CTA를 유지하면서 현행 정책/제공 범위에 필요한 문구·설정 개수의 차이를 명시적 화면 예외로 수용할지. 답변 전 D3 확정/후속 구현·Task PASS로 처리하지 않는다.

### 야간 설정 API 존재 조사 · 2026-11-11

- 사용자 질문 **“야간 알림 설정 관련 api 자체는 존재하는거야?”**에 따라 계약 존재만 추가 조사했다. dev/main ref는 위와 동일하다. 현재 개발 OpenAPI183paths의 operation 경로/요약/설명과 schema property/설명에서 night/quiet/dnd/야간/수신시간/방해금지 관련 항목은0건이다. 백엔드 dev web controller 경로와 matched-email DTO/공고별 알림 controller를 대조했다.
- 확인한 API는 `GET/PATCH /api/v1/me/matched-bid-notice-email-settings`의 이메일 enabled와 `GET/PUT/DELETE /api/v1/me/bid-notice-alerts/{bidNoticeId}`의 개별 공고 알림이다. 별도 야간 수신 설정 API/요청 필드는 확인되지 않았다. 현행 중앙 정책 역시 별도 야간 설정을 제공하지 않는다고 명시한다. 배포 실행 process/source 일치나 실제 업무 API 호출로 증명한 결과는 아니다.
- 화면 예외 선택은 여전히 미승인이다. API 유무 질문/설명 요청을 제품 동작 변경 또는 D3 승인으로 해석하지 않는다.

### 두 알림 항목의 API 범위 설명 · 2026-11-11

- 사용자 질문 **“`나에게 맞는 입찰공고 알림`이랑 `입찰공고 상세 알림` 이건 api가 존재하는거니?”**에 대해 범위를 나누어 답했다. matched-bid-notice-email-settings는 계정의 맞춤 이메일 전체 ON/OFF API가 있다. bid-notice-alerts/{bidNoticeId}는 특정 공고 하나의 조회/활성화/해제 API가 있다. 모든 공고의 상세 알림을 일괄 ON/OFF하는 전역 설정 API는 현재 명세/선택 controller에 없다.
- 고정 source: [MatchedBidEmailSettingController](https://github.com/mate-pjt/mate-backend/blob/4c328d4a943eaa5dcbb0e8d9596b22389d154988/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/matchedbidemail/MatchedBidEmailSettingController.kt), [DTO](https://github.com/mate-pjt/mate-backend/blob/4c328d4a943eaa5dcbb0e8d9596b22389d154988/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/matchedbidemail/MatchedBidEmailSettingDtos.kt), [AccountBidNoticeAlertController](https://github.com/mate-pjt/mate-backend/blob/4c328d4a943eaa5dcbb0e8d9596b22389d154988/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/bidnoticealert/AccountBidNoticeAlertController.kt).
- 2개의 관련 API가 존재한다는 사실과 Figma 설정 화면의 스위치2개가 각각 전역 ON/OFF로 동작할 계약이 있다는 주장은 다르다. 업무 API를 실행/변경하지 않았다. 이 설명은 D3 시각 예외의 승인이나 새 전역/야간 정책 확정이 아니다.

## 2026-11-11 · 최종 요구사항 Brief와 승인 해석

- 요구사항: 여섯 화면의 Figma 기준과 필수 추가 상태/의도적 차이를 추적 가능하게 정한다. 제품 구현과 실제 통합은 후속 개발/QA의 별도 Gate다.
- 성공 기준: node/고정 source/현행 정책, 현재 차이, 유지·정렬·승인 예외·보류, 결정자/날짜, 추가 상태, 후속 소유와 검증 조건을 연결한다. 미확정 이름/전역·야간 계약과 홈 최종 문구는 명시적 재개 조건으로 남긴다.
- 범위: 본 결정·근거/지문·연결된 후속 Task의 수용 기준·WBS/coverage/plan·문서 검증/두 리뷰·승인된 Git 전달. 제외: src/tests/package/설정 변경, 백엔드/API 계약 창작·도메인 정책 재정의·실제 업무 요청/발송/업로드·배포, 다음 Task 실행.
- 패턴: 현행 Repository 공개 진입/프런트 contracts와 실제 HTTP DTO 경계, 기존 Tailwind/CSS 토큰·UI primitive, Figma frame별 variant를 후속 구현의 기준으로 보존한다. 새 라이브러리 없음.
- 사용자 최종 원문: **“그럼 일단 figma에서는 구현해두고 api 연결 인터페이스 코드 쪽도 구현해두되, 비활성화해두고 tooltip 같은걸로 `api가 없어서 아직 비활성화됨` 같은 문구를 남겨두자. 이러면 figma대로는 구현하되, 실제 동작이 아직 안되는건 알 수 있지 않니?”**
- 해석/결정자: 2026-11-11 사용자(이 대화)가 Figma 구성 유지+미지원 제어 비활성/설명이라는 화면 방향을 명시했다. primary는 이 결정을 정책 Task의 산출물과 후속 개발 기준에 반영한다고 먼저 설명했다. 이번에 다른 개발 Task를 실행하는 승인으로 확대하지 않는다.
- 이 최종 답변은 초기 **설정 화면에서 두 스위치를 제거하는 추천을 대체**한다. 세 설정 항목/스위치를 Figma대로 두고, 지원되는 맞춤 이메일만 실제 동작하며 전역 상세·야간은 disabled+지원 부재 안내를 둔다. 도메인 정책의 전역/야간 기능 도입 또는 미래 활성화 승인은 아니다.
- 홈은 사용자의 Figma 우선 요청에 따라 배치/이미지/기존 CTA를 유지한다. 공개 /bids CTA 변경과 임의 새 홍보 문구는 승인되지 않았다. 미제공 범위의 최종 문구/표시 위치는 DEV-58 Gate에서 확정하도록 보류한다. 이 보류를 문구 승인 또는 현행 안내 정합성 PASS로 세지 않는다.
- 정책 기록 Gate에는 미결 계약/문구의 소유·보류·재개 조건을 남길 수 있다. 이 문서 단위가 통과하더라도 해당 후속 구현 Gate가 통과하는 것은 아니다. 본문의 이전 ‘답변 대기/미승인’ 절은 답변 당시 이력이다.
- 실행 단계: 승인 해석/화면·상태 기준표 → 후속 소유/검증·114Task 연결 → 문서/지문 검사 → Documentation Update Check → read-only verifier/ai-review → 종료 메타데이터 freshness → 목적별 커밋·PR/최종 head CI/조건 충족 시 병합·동기화.
- 위험/검증: 미지원 preview를 실제 설정값·정상 저장으로 오인하지 않게 한다. source/배포 문서/실행 process/업무 응답을 분리한다. 문서 검증은 링크/anchor·79개 원본/Task ID·의존성/단일 상태·기존 이력/제품 지문·Markdown 형식·diff-check다. 로컬 앱 검사는 실행 영향이 없어 미실행이며 원격 CI 결과와 별개다.

<a id="pol-29-sources"></a>

## 현행 출처와 고정 기준

- 프런트 고정 ref: [f505421](https://github.com/mate-pjt/mate-frontend/tree/f505421d6e5337ab3db4dac342d57bf18a948246). 각 화면의 소유 source는 아래 표에 연결했다. 이 ref에서 제품을 수정한 결과가 아니다.
- 정책 P1 [ADR-0014](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/decisions/ADR-0014-separate-personal-bid-filter-from-company-profile.md), P2 [ADR-0013](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/decisions/ADR-0013-classification-row-query-identity-and-pagination.md), P3 [Account/Google](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/auth/account-and-social-identity.md), P4 [알림](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/notification/overview.md), P5 [공고 찾기](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/bid/matching-and-related-notices.md): 모두 현재 main `c9e50ff5`에서 다시 읽었다. P5 관련 공고 기준 상태의 내부 충돌은 POL-30에 보존하며 이번에 해결하지 않는다.
- backend dev `4c328d4`/main `8b36ca5`의 인증 응답과 dev 알림 controller/DTO, 배포 OpenAPI의 관련 schema만 확인했다. 배포 workflow 문서/실행 SHA/실제 업무 응답은 이번 미확인이다. endpoint와 schema가 있다고 실제 통합 PASS로 세지 않는다.
- Figma는 변경 가능한 node URL이므로 immutable version으로 표현하지 않는다. 2026-11-11 조회한 node/크기·XML/대표 PNG 지문과 source/정책 ref는 [출처 인덱스](../reviews/POL-29-sources.json)에 보존한다. 원시8PNG·10metadata와 선택 가입 section은 위 저장소 밖 증거 경로다. 대표8화면 시각 대조이며 모든 상태/해상도의 pixel PASS가 아니다.

<a id="pol-29-decisions"></a>

## 화면별 결정표 · 2026-11-11

결정자는 위 사용자다. D1은 ‘추천안 확정’, D2는 이름+아이콘 교정, D3는 Figma 구성 유지+미지원 disabled/tooltip 최종 원문이 근거다. source/정책으로 필수인 기능 차이와 이번 명시적 시각 승인, 후속 보류를 구분한다.

| 화면·Figma | 현재 source/차이·정책 제약 | 선택·근거/승인 범위 | 후속 소유·보류/재개 |
| --- | --- | --- | --- |
| 개인 필터 [2048:58606](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2048-58606) | [bid-list-client](../../../../src/components/bids/bid-list-client.tsx), [toolbar](../../../../src/components/bids/bid-filter-toolbar.tsx): 오른쪽 적용/저장/초기화. P1의 수동 적용·명시 저장·빈 SAVED·expectedVersion/409는 유지 | **정렬+보조행 예외 승인(D1)**: 적용 버튼은 필터 맨 왼쪽 어두운 버튼/구분선. 저장·계정 초기화는 필터 아래 보조행 오른쪽, 자동 저장 아님 안내. 새 저장 정책/빈 필터 저장 허용을 추가하지 않음 | DEV-55. reset EMPTY_DEFAULT 결함 수정은 DEV-63, 실제 PBF QA-10 차단 보존 |
| 공통 헤더 [2048:58606](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2048-58606), [3139:52490](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-52490) | [site-header](../../../../src/components/site-header.tsx), [auth contracts](../../../../src/data/auth/contracts.ts): 마이페이지/로그아웃. P3·현재 인증 DTO에 이름 없음. 회사명이 사용자 이름을 대신하지 않음 | **Figma 정렬(D2)**: 로그인 우측은 실제 사용자 이름+Figma 아이콘. 일반 ‘마이페이지’ 대체·이메일 유추·회사명 치환·가입 제안값 장기 보존은 미승인. 미구현 메뉴를 활성으로 보이게 하지 않음 | DEV-56. 실제 이름 공급원/권한·결측/로딩/오류 fallback의 명시적 화면 기준 확보 전 해당 이름 표시 구현 Gate 차단. 백엔드/API 담당+제품/디자인 역할 필요, 개인 미지정. 임의 endpoint 추가 금지 |
| 가입·시작 [2306:88681](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2306-88681), [3140:119739](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-119739), [3140:120851](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-120851), [3140:121614](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-121614) | [AuthScreen](../../../../src/components/auth/auth-screen.tsx), [start](../../../../src/app/auth/start/start-choices.tsx), [signup](../../../../src/app/auth/signup/signup-form.tsx): 기본640px·일반 인사·native date. P3의 필수 이름/동의·선택 날짜/전화·Google 경계 유지 | **Figma frame별 정렬**: 로그인420/가입입력640/시작선택692px. generic 인사말/native date 전체를 명시적 화면 예외로 승인한 것은 아님. 날짜 입력의 보이는 표면은 Figma 기준, native 사용 여부는 보이는 결과/접근성으로 판단 | DEV-57. 이름 인사는 실제 공급원+결측 시안 확보 전 보류. 검색/초대는 각 실제 frame의 폭을 재조회하고 section ID를 단일 화면으로 사용하지 않음. 회사 소속 용어 POL-11, 약관 POL-01, 실제 QA-04/05/08 이력 유지 |
| 홈 [2016:57355](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2016-57355) | [page](../../../../src/app/page.tsx), [CTA](../../../../src/components/home/home-auth-cta.tsx), [추천 placeholder](../../../../src/components/bids/bid-list-client.tsx): 추천/분석/실시간 표현과 실제 미제공 상태 차이. P4/P5는 현재 AI 점수/실시간 프런트 연결 완료를 보장하지 않음 | **Figma 배치·일러스트·기존 CTA 유지**. 로그인 전 auth/next, 로그인 후 recommended 준비 중 경로 보존. 공개 /bids로 목적지를 바꾸는 최초 추천은 철회. 새 홍보 문구/준비 중 표현의 최종 문안은 **보류** | DEV-58. 제공 범위/표시 위치·최종 문안의 제품/디자인 결정 후 구현. DEV-03/07 차단을 해결·면제하지 않음. 현재 문구의 정합성 PASS 아님 |
| 상세 [2113:19107](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2113-19107) | [content](../../../../src/components/bids/bid-detail-content.tsx), [amounts](../../../../src/components/bids/bid-detail-amounts.tsx), [alert](../../../../src/components/bids/bid-detail-alert-card.tsx):1112/300px·금액 섹션 단위 전환. P2 분류 identity/URL은 유지 | **정렬+분류 선택 예외 승인(D1)**: 본문792+간격16+사이드372=1180px. breadcrumb 오른쪽 단위 전환. 제목 다음 별도 입찰분류 선택 영역 유지. 분류/계약 기능을 디자인에 없다는 이유로 제거하지 않음 | DEV-64. 공사/용역/물품·분류0/1/복수/결과 회차를 검증. main 중첩 DEV-54, 이력/본문 DEV-13/14, 실제 QA-03/09 별도 |
| 알림 설정 [3139:52591](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-52591), [3139:56715](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-56715) | [settings](../../../../src/components/my/notification-settings-page-client.tsx), [dialog](../../../../src/components/my/notification-email-verification-dialog.tsx): 이메일 스위치1개·mock10분/30초. P4는08:30 이메일·독립 공고별 알림·야간/전역 설정 없음 | **Figma 구성 유지+disabled/tooltip 확장 승인(D3)**: 세 항목/스위치 유지. 맞춤 이메일만 API 연결. 전역 상세·야간은 disabled와 `API가 없어 아직 비활성화되어 있습니다` 안내. 없는 설정값/저장 성공/미래 활성화 시점을 만들지 않음 | 화면/미지원 연결 경계 DEV-66 신설. 정책 POL-19·mock시간 DEV-41·채널/관리 안내 DEV-62와 분리. 지원 여부/미지원 결과를 표현하는 프런트 인터페이스만 준비하며 실제 URL/DTO는 계약 확보 후. 전역/야간 활성화는 정책·계약 별도 확정 전 보류 |

<a id="pol-29-states"></a>

## 추가 상태와 후속 검증 수용 기준

Figma 정상 프레임이 없는 상태는 아래처럼 **기능/접근성 보존 조건**과 연결한다. 이것만으로 새 시안의 모든 색상/간격/문구가 포괄 승인된 것은 아니다. 표의 보류 항목은 별도 결정/계약을 확보해야 후속 구현이 통과한다.

| 영역·원본 frame | 상태/수용 기준 | 검증과 한계·소유 |
| --- | --- | --- |
| 필터·2048:58606 | ALL에서만 계정 도구. 비로그인 내 맞춤은 기존 로그인 복귀, auth loading/개인 조회 loading 중 적용 불가. EMPTY_DEFAULT/빈 SAVED는 적용 불가. COMPANY_DEFAULT는 비어 있지 않은 조건이 있을 때 수동 적용 가능·일반 저장 전 회사 원본 변경 없음. dirty·동일 SAVED·저장 중의 기존 조건 보존 | DEV-55가 URL 적용과 계정 저장을 각각 검증. 저장 버튼은 현재 유효·비어 있지 않은 조건/동일 SAVED 비교를 보존하고, 초기화는 비어 있지 않은 SAVED일 때만 노출. UI 배치 수정으로 reset 계약 결함을 고쳤다고 주장하지 않음 |
| 필터·동일 frame 확장 | 저장 실패/401/409에서 무단 재저장·회사값 자동 적용 금지, 재조회/재시도는 기존 흐름과 P1/POL-02 유지. 오류/안내·확인 dialog·처리 중 중복 클릭 방지 | DEV-55 UI 회귀/HTTP 대역과 DEV-63 source/version reset 회귀를 분리. 실제 QA-10 자원/변경·복구 준비 전 실제0신규통과 |
| 헤더·2048:58606/3139:52490 | 비로그인·인증확인 중·실패와 로그인 이름 정상/없음·회사 미연결/연결·권한/세션 변경·로그아웃 busy/error·알림 점 | DEV-56/QA-14. 실제 이름/승인 fallback 미확보 상태를 정상 예시 이름이나 회사명으로 채우지 않음. 이름/오류/권한 시안 계약 확보가 재개 조건. 메뉴/로그아웃 기능 삭제로 빈 시안을 해결하지 않음 |
| 가입·위 frame들과 실제 검색/초대 frame | loading/anonymous/missing flow·제출 중/오류·필수동의·미래 날짜 방어·초대 불일치/만료·정상 결과. 전체 AuthScreen 폭 일괄 변경 금지 | DEV-57. 정상frame별 시각 비교와 오류/초점/keyboard 검증 구분. 이름 없는 인사말 시안은 보류. native date의 브라우저 OS 달력을 Figma pixel PASS로 세지 않음. 실제 가입/초대 QA의 차단/원복 조건 유지 |
| 홈·2016:57355 | 공개9카드/0행/조회 오류·로그인 전 CTA와 안전한 next 복귀·로그인 후 추천 placeholder·회사 유무·auth loading/오류 | DEV-58/QA-01. 신규 문안이 확정되기 전 제공 완료 표현을 승인으로 기록하지 않음. 추천·신호/API 동작은 DEV-03/07과 별개. 현재 홈 실제 통합의 신규 PASS 없음 |
| 상세·2113:19107 | 정상/비로그인·본문404/실패와 section별 빈값/오류/금액미제공 분리. 분류0/1/복수·물품/참여업체 page·개찰회차·권한/알림 busy/error·단위 전환 뒤 선택 URL 유지 | DEV-64/QA-03/09. 추가 분류 선택은 승인 예외이며 실제 canonical bidClsfcNo URL 왕복/레이블 검증 필요. missing 값을0이나 임의 데이터로 치환하지 않음 |
| 알림·3139:52591/56715 | auth/loading/error·이메일 ON/OFF load/save·수신처 조회/전환·인증 pending/오류/만료/한도/재전송·닫기. 기존 수신처는 인증 성공 전 유지. 이메일 OFF와 내부 공고 알림은 독립 | DEV-66 UI, DEV-41 mock3분/60초·5회·재전송 무효화, POL-19 정책/DEV-62 안내. API UI는 서버 expiresAt/resendAvailableAt 사용. QA-12/13 실제 발송/변경/복구 차단 보존 |
| 알림·disabled 확장 | 전역 상세/야간은 미지원 상태를 명시하고 클릭/키보드로 요청·저장·mock 상태 변경0건. 임의 ON/OFF 저장값/가짜 성공/없는 URL·DTO 금지. 지원 계약이 생겨도 자동 활성화하지 않음 | DEV-66이 미지원 capability/연결 인터페이스와 요청0건을 검증. tooltip은 disabled element에만 매달지 말고 접근 가능한 설명 연결로 focus/hover·touch에서 확인 가능해야 함. 실제 활성화는 POL-19의 도메인 결정+backend 계약/실행 QA Gate 후 |
| 모든 화면·모바일/키보드 확장 | 1920px 원본 desktop 대조.320/390px에서 같은 정보·도구 순서를 유지하며 세로 배치, 상세 표 등 필요한 내부 영역만 가로 스크롤. 레이블/Tab·Enter/Space·Escape/초점 복귀·오류 알림/툴팁 접근 보존 | D1의 필터/상세 responsive 방향은 승인됨. 나머지는 실제 모바일 원본 유무와 승인한 확장 기준을 후속 Gate에서 확인. mobile 원본 없는 화면의 responsive 점검은1:1 Figma PASS가 아님. DOM/source/mock/HTTP대역/실제API 결과를 각각 기록 |

## 후속 소유·미결/재개와 Documentation Update Check

- DEV-55/64: D1 승인으로 시각 기준 확보. 실제 요구사항/실행자·현재 source/검증 자원은 각 Gate에서 재확인한다. 기존 reset/실제 QA 차단은 보존한다.
- DEV-56/57: 사용자 이름을 표시하는 목표는 확정됐지만 이름 공급원/결측·지연·오류 fallback은 미확정이다. backend/API·제품/디자인 역할이 현재 계약과 시안을 제공해야 재개한다. 개인 담당자를 임의 배정하지 않는다. generic 이름/회사명/이메일 치환은 허용하지 않는다.
- DEV-58: Figma 구성/기존 CTA 유지와 현재 기능 제공 범위의 구분을 기준으로, 최종 문구와 위치를 제품/디자인 역할이 확정해야 구현한다. 이번 사용자 질문을 정확한 새 홍보 문안의 승인으로 확대하지 않는다.
- DEV-66: 알림 화면/미지원 프런트 경계만 별도 후보로 정의했다. POL-19는 현재 정책·향후 전역/야간 활성화 계약의 소유, DEV-41은 인증시간, DEV-62는 기존 채널/관리 안내다. 이 대화에서 어느 개발 Task도 실행하지 않는다.
- 원본 baseline/감사/기존 QA/POL 결정·승인 예외 불변. coverage에 DEV-66 소유 연결을 추가하고 원본79개/113Task를 보존해 총114Task로 확장한다. 현재/다음/상태는 WBS만 관리한다.
- base/architecture/data-access/harness: package·런타임/구조·실제 공급원·실행 규칙 변경이 없어 미갱신. 미래 CTA/DTO를 현재 구현 사실로 바꾸지 않는다. plan은 이번 정책 단위의 날짜별 진입점만 추가한다. ai-failures에는 새 반복 제품/하네스 실패가 없어 추가하지 않는다.
- Context Audit의 기존 제품/정책·DESIGN 드리프트 FAIL은 [별도 보고](../reviews/POL-29-context.md)에 보존하며 문서 검증/Review Gate 판정과 구분한다. 정책 기록 완료는 제품/UI·실제 통합 PASS가 아니다.

## 2026-11-11 · 검증/리뷰와 정책 기록 단위 종료

- [검증/6항목 ai-review](../reviews/POL-29.md)와 read-only verifier 1차 **PASS**. verifier는 실제15문서 diff/관련 source·정책·Figma XML·검사 결과를 확인했다. Blocker/Major0, Minor1(빈 COMPANY_DEFAULT 적용 불가의 명시)을 반영했다. raw 보고서와 지문은 저장소 밖 verifier-1 기록/최종 보고에서 확인한다.
- 첫 검토 지문은 파일별 SHA256 정렬 manifest 기준 `23bb9c15e3bdaac88fec8e9151a940413ddff938a3656cd3fd33be38c8edc44c`다. 이 절·체크리스트/WBS 종료·다음 선정/Minor 보완은 첫 검토 뒤 변경이므로 문서 검사/ai-review를 다시 수행하고 같은 verifier의 freshness 재검토를 요청한다. 최종 원문/지문은 저장소 밖 최종 기록에서 확인한다.
- 정책 기록 단위는 승인된 기준과 보류/재개·후속 소유를 연결한 범위다. 이름 source/fallback·홈 최종 문구·전역/야간 활성화·실제 QA는 미결이며 이 체크리스트를 해당 결정/제품 구현·통합 PASS로 해석하지 않는다. Context Audit의 기존 FAIL도 보존한다.
- 다음 선정은 **DEV-65**다. WBS P0·QA-17 선행 main 반영을 확인했고, 공개 목록/홈 mock의 검색·view 결함은 계정 변경 없이 재현 가능한 좁은 목표다. DEV-63 역시 P0 대기를 유지하며 reset source/version·QA-10 자원 Gate를 건너뛰었다고 해석하지 않는다. 다른 실제 QA/정책 차단·DEV-09 대기/DEV-12 보류·이전 승인 예외는 그대로다.
- 다음 첫 행동: 새 대화에서 DEV-65와 감사 CF-11을 읽고 현행 mock/공개 query 정책·고정 Clock 시나리오·test/lint/build/브라우저 검증 범위로 Brief를 제시한다. **이번 대화에서 DEV-65의 소스 조사/수정·구현·실제 QA는 시작하지 않는다.**
- Git 전달은 현재 사용자 명시 승인에 따라 최종 freshness 통과 후 목적별 커밋·push·PR·실제 최종 head CI/리뷰·허용 병합·로컬 main fast-forward를 수행한다. 실제 SHA/PR/CI/병합/clean 증거는 저장소 밖 delivery receipt·PR·최종 보고에 남겨 전달 전 사전 기록을 완료 증거로 만들지 않는다. 업무 데이터/소유 앱 서버 변경0건·원복 대상 없음.

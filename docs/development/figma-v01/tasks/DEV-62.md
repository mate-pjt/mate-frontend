# DEV-62 · 알림 채널·관리 기능 안내 문구 정합성

[상태의 단일 기준: WBS](../README.md) · [운영 규칙](../workflow.md) · [감사 근거](../audits/2026-11-11.md#cf-08)

## 작업 정의

- 유형: 개발. 원본 항목: D04, A01, N02, S04, C01; 2026-11-11 전수 감사 CF-08.
- 선행 작업: [QA-17](QA-17.md). 순위는 WBS가 관리한다.
- 목적: 공고별 내부 알림과 매일08:30 맞춤 이메일은 독립이다. 진입 불가/준비 중 이유는 현재 가능한 동작을 정확히 설명해야 한다.
- 문서 드리프트: 또한 DESIGN.md:78의 현재 AlarmList Interaction은 actionPath 이동 미연결/목록 유지를 설명하지만 DEV-06의 현재 source는 읽음 성공 뒤 허용 목적지로 이동한다. 과거 이력과 별개인 상단 규칙의 문서 드리프트다.
- 현재 차이/영향: 공고별 팝업은 알림이 안 오면 마이페이지 알림설정 확인, 나의 알림에서 모든 관리가 가능하다고 안내한다. 현재 설정은 이메일뿐이고 등록 공고 관리 메뉴는 비활성이다. 받은 알림 편집에는 API 준비 중이라 쓰지만 삭제 operation은 Swagger에 존재한다.
- 제외: 아래 소유 경계 밖의 기능·새 라이브러리·무관한 리팩터링. 이번 감사에서는 제품 수정/실제 업무 API 변경/commit·push·PR·배포를 수행하지 않았다. 미래 구현의 실행 범위는 착수 Gate에서 확인한다.
- 책임/재개 조건: 실행자는 다음 선정 시 확정한다. 프론트 구현·디자인 결정·필요한 API/QA 자원 역할을 나누고, 미확인 개인 담당자를 임의 배정하지 않는다. 선행 Task 결과와 현재 디자인/정책/source/배포를 다시 대조한다.

## 기준과 소유권

- 고정 출발점: frontend `8d3a2ec290aabc4280c5e9f5336cfd36376f7e94`; 현재 backend dev/정책과 관찰 수준은 [날짜별 감사](../audits/2026-11-11.md#cf-08) 및 [JSON](../audits/2026-11-11.json). 근거 파일은 수정 허용 목록이 아니다.
- 문서 소유: [DESIGN.md:78](../../../../DESIGN.md#alarmlist)와 [DEV-06 source](../../../../src/features/notifications/activation-controller.ts)의 현재 동작 설명을 함께 대조한다. 이번에는 문서 정정 계획만 작성한다.
- 소유 소스: [src/components/ui/popup/popup.tsx](../../../../src/components/ui/popup/popup.tsx) / [src/components/alarms/alarm-page-client.tsx](../../../../src/components/alarms/alarm-page-client.tsx) / [src/components/my/my-side-menu.tsx](../../../../src/components/my/my-side-menu.tsx).
- 관련 Task: [POL-19](POL-19.md) / [POL-20](POL-20.md) / [DEV-04](DEV-04.md) / [DEV-43](DEV-43.md) / [QA-09](QA-09.md). 기존 QA의 case/통과/차단/승인 예외를 보존한다.
- Figma: [Figma 2113:19107](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2113-19107) / [Figma 2304:29131](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2304-29131).
- 고정 정책: [domain/notification/overview.md](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/notification/overview.md).

## 착수 전 Implementation Brief / 설계 Gate

- 후보 요구사항/성공 기준: 아래 완료 기준. **아직 구현 미착수**다. UI 승인/실제 계약과 fixture 준비를 확인해 최종 Brief를 제시한다.
- in/out scope·현행 패턴: 위 목적/제외와 관련 Task의 소유 경계를 확인한다. 데이터/DTO/mock 설계 전 [data-access](../../../ai-context/data-access.md)를 읽는다.
- 편집 전 제시: 실제 수정 대상 파일·영향·단계·위험·검증 명령/시나리오·실행 식별자·필요한 데이터 사용/변경·잔존·복구 범위.
- blocking ambiguity는 최대3질문/추천안으로 해소한다. 감사의 추천을 정책 승인으로 취급하지 않고, 낮은 위험 가정만 명시해 진행한다.

## 완료 기준

- [x] DESIGN.md AlarmList의 현재 Interaction/상태 설명을 POL-04와 DEV-06의 읽음 성공 후 허용 경로 이동·위험/null fallback 및 실제 QA 미완료 범위에 맞춰 동기화한다. 과거 검증 이력은 보존한다.
- [x] 공고별 알림·이메일·받은 알림·등록 공고 관리의 차이를 현재 목적지와 연결한 문구로 분리한다.
- [x] POL-20에서 삭제 API/정책·프론트 미연결을 구별하고 준비 중 이유를 정확히 표시한다. 삭제 기능 구현은 DEV-43에 남긴다.
- [x] 각 안내 링크/텍스트의 실제 목적지·비활성 상태·키보드/보조기술 접근을 검증하고 없는 전역 토글이나 관리 기능을 안내하지 않는다.
- [x] 정상·빈·오류·권한/충돌과 접근성 중 영향 범위를 Gate에서 확정하고 자동/실제 Next 브라우저 검증 및 필요한 실제 QA를 기록한다. 미실행은 차단/이유로 남긴다.
- [x] 현재 package scripts에 맞는 test/lint/build·필요한 Storybook/구성 검사와 diff-check를 통과한다. mock/HTTP 대역/실제 API 결과를 구분한다.
- [x] Documentation Update Check, verifier/ai-review와 검토 뒤 변경의 freshness를 기록한다. 구현만으로 완료하지 않는다.

## 체크포인트 · 결정·인계

| 날짜 | 수행/근거 | 다음 첫 행동 |
| --- | --- | --- |
| 2026-11-11 | QA-17 감사에서 후보 정의·소유권/완료 기준만 추가. 정책 신규 승인·제품 수정·실제 업무 API 실행 없음 | 선행 결과와 감사 CF-08를 읽고 현재 source/계약·검증 자원으로 Brief를 확정 |

- 추천/후보는 승인 아님. 개발자/디자인/서버 결정이 필요한 내용은 결정자·날짜·원문/소유 소스·유지/보류 이유를 기록한다.
- 이 Task의 구현/자동·브라우저/실제 QA·Review Gate는 **미실행/미판정**이다. 감사 문서 검토를 구현 검증으로 대신하지 않는다.
- 자동 수정 시도0/3. 실패 시 원인·최소 수정·재검증을 순서대로 기록한다.
- 문서 갱신 여부와 프로세스/데이터 복구, 미커밋/Git 전달 범위는 실행 시 기록한다. 상태/다음 작업은 WBS에서만 갱신한다.


<a id="dev-62-dev-60-handoff"></a>

## 2026-11-12 · DEV-60 이후 선정/인계

- 이번에는 작업 정의·QA-17 선행·완료 기준만 읽고 다음 Gate 대상으로 선정했다. DEV-62 source/Figma/API 상세 조사·정책/최종 문구 결정·Implementation Brief/설계·구현·검증·Git 전달은 미착수다. 현행 상태는 WBS만 소유한다.
- 이유: 남은 P0 실제 QA/약관·취합과 앞선 P1 정책/신원·문구/실제 자원 차단을 유지한다. QA-17 선행이 main에 반영돼 있고 DEV-59/60/61 등 독립 P1 후 남은 알림 안내의 정합성 목표여서 기존 표 순서로 선정했다. 삭제/전역 알림 기능이나 POL-19/20의 정책 작업을 시작하는 뜻이 아니다.
- 다음 첫 행동: 새 대화에서 최신 main/Git·DEV-62/CF-08·현행 알림 중앙 정책과 POL-04/DEV-06·POL-19/20 결정/차단, 현재 팝업/알림목록/메뉴·DESIGN.md Interaction을 선별 대조해 Brief를 제시한다. 공고별 내부 알림·08:30 맞춤 이메일·받은 알림·등록 공고 관리의 목적지/준비 중 이유·키보드 범위를 분리하고 미확정 정책은 Gate에서 질문한다.
- DEV-60의 로컬 PASS/이번 Git·Chromatic 예외는 DEV-62 실행/실제 API 변경·Git 전달이나 기존 QA-09/11/12/13 차단 면제가 아니다. 다음 Task의 승인·범위·검증 자원은 자신의 Gate에서 확인한다.

<a id="dev-62-brief"></a>

## 2026-11-12 12:49 KST · 착수 Brief / 설계

- 실행자: Codex. 시작 `main=origin/main=9098f469fa74ca9a22803cbc11e1ce5f2d5e0a07`, clean·기존 변경0. fetch 후 동일 SHA 확인, 기존 DEV-62 branch 없음, `fix/dev-62-notification-guidance` 생성. 선행 QA-17 기록 commit `dcd291d`와 DEV-60 PR59가 main에 있다.
- 승인: 이번 사용자 요청은 DEV-62 하나의 개발·검증·read-only verifier/ai-review·목적별 commit/push·PR/CI·조건 충족 시 정상 merge/로컬 main FF를 명시 승인했다. 이번 PR의 Chromatic 월간 한도 문제만 예외다. 과거 Task의 승인을 재사용하지 않는다. 업무 API·메일/문서 처리·서비스 운영/배포·다음 Task 실행은 제외한다.
- 요구사항/성공 기준: 공고별 내부 알림, 매일08:30 맞춤 이메일, 받은 알림 조회/이동, 미지원 등록 공고 관리·편집/삭제를 실제 사용 가능한 동작으로 설명한다. 없는 전역/야간 토글·관리 화면·API 부재를 안내하지 않는다. DESIGN AlarmList를 POL-04/DEV-06의 현재 동작·남은 실제 QA와 맞춘다.
- 범위: `popup.tsx`의 AlarmPopup 안내, `alarm-page-client.tsx`의 로그인/편집 안내·설명 접근성, `my-side-menu.tsx`의 미지원 관리 메뉴 설명, `notification-settings-page-client.tsx`의 채널 독립 문구. DESIGN·WBS/이 Task·plan·관련 QA의 날짜별 보정·리뷰/Context Audit 기록. 기존 폴더/토큰/동작 유지, 새 라이브러리 없음.
- 제외: 삭제/숨김·보존 정책 확정(POL-20), 삭제 연결(DEV-43), 전체 관리(DEV-04/05), 전역/야간 UI(DEV-66), 인증시간(DEV-41), 실시간 신호(DEV-07), 새 링크/데이터/API/DTO/mock 계약·권한 변경. 기존 QA-09/11/12/13·DEV-06 실제 차단과 모든 과거 승인 예외 보존.
- 확인한 근거: AGENTS·세 skills·verifier, workflow/task-cycle·baseline/coverage·QA-17/CF-08, base/plan/architecture/data-access/harness/ai-failures·package/PR template, POL-04/DEV-06·POL-19/20·POL-29 후속 소유 경계, 공용 Popup/SideMenu·현재 Header/알림 activation allowlist·이메일/메뉴 목적지.
- 현행 소유 정책: mate-docs main commit `c9e50ff591ae18023164e1a94581c611bf1e4f29`의 notification overview를 재조회해 내부 알림/08:30 이메일 독립을 확인. backend dev commit `4c328d4a943eaa5dcbb0e8d9596b22389d154988`, notification Controller blob `b0da0a980d2307c66cb4fee0c3a8fdcaefbd3723`에 `POST /api/v1/me/notification-deletions` 존재. 현재 비인증 개발 OpenAPI GET403. 과거2026-11-11 GET200/operation 관찰은 보존하고 현재403을 API 부재로 해석하지 않는다. 배포 실행 process SHA·실제 업무 응답/통합은 미확인·미실행이다.
- Figma: `2113:19107` 로그인 전 상세와 `2304:29131` 기본 알림 화면을 현재 structured context+render로 재조회. 상세의 로그인 CTA·알림 페이지 편집 디자인을 확인했다. 전체 화면/pixel 예외를 새로 승인하는 작업이 아니며 정책/미지원 사유의 텍스트 교정만 한다. POL-29의 Figma3항목/미지원 disabled 방향은 DEV-66에 남긴다.
- 가정/위험: 같은 의미의 한국어 문구와 기존 설명 영역의 줄바꿈은 낮은 위험의 가역 선택이다. 새 동작/정책을 만들지 않아 blocking ambiguity 없음. 팝업 긴 문구의320/390px 줄바꿈·키보드, native disabled만으로 사유를 숨기지 않는 visible/ARIA 설명을 중점 점검한다.
- 단계: 안내4파일·DESIGN 최소 교정 → 환경파일 없는 격리 source/합성 브라우저 검증 → QA/문서/소유권·보존 검사 → 두 리뷰 → 커밋/PR/최종 head CI → 정상 merge/main 동기화. 다음 Task는 완료 후 WBS 순위/선행/차단으로 선정·인계만 한다.
- 검증: Node22.20.0/pnpm11.3.0에서 `pnpm test`, `pnpm lint`, API/mock/hybrid Preview의 `pnpm build`, 공용 Popup 영향의 `pnpm build-storybook`, `git diff --check`. 실제 Next/Aside에서 정상·로그아웃·빈/조회 오류·읽음 성공/실패·이동/복귀, 팝업 설정/해제·이메일 독립·키보드/모바일·미지원 버튼과 설명을 점검한다. 기존 계정/권한/충돌 데이터 흐름은 수정하지 않고 계약 회귀 테스트로 확인한다. 실제 업무 API는 실행하지 않으며 이 Task의 문구 검증을 기존 실제 QA PASS로 확대하지 않는다.
- 첫 행동: 현재 문구4파일·DESIGN을 교정하고 source 지문/외부 요청 차단을 갖춘 격리 Next 검증을 준비한다. 자동 수정0/3.


## 2026-11-12 12:55 KST · 교정/검증 체크포인트

- 안내4파일과 DESIGN을 교정했다. 편집 미지원 이유를 본문/aria-describedby에 연결하고, 공고별 알림·08:30 이메일 독립·실제 목적지·개별 상세 설정/해제를 설명한다. 동작/Repository/DTO/mock 계약은 불변이다.
- 환경파일 없는 격리 source에서 Node22.20.0/pnpm11.3.0의315 tests(15파일), lint, API/mock/hybrid build, Storybook 빌드 완료. 최초 외부 실행 래퍼가 zsh 예약변수 `status`를 사용해 앱 명령 완료 뒤 exit1이었으므로 `dev62_exit`로 바꾸고 test/lint/API build의 exit0을 재확인했다. 제품 수정 시도는0/3이다. Storybook의 기존 chunk size 경고만 있다.
- 문서1차 검사: 링크385/79원본/114Task/155의존성·보호7파일·단일 활성Task와 diff-check PASS. Context Audit에서 확인한 DESIGN 드리프트는 승인된 문서 교정 범위에서 해소했다.
- 실제 Next/Aside4370에서 로그인 전 새 문구와 최초 resource 외부0건 확인. Aside API에 route()가 없어 인터셉트는 미사용이며 request 관찰·서버 fetch guard·전원 mock/로컬 대역 설정으로 외부 업무 호출을 피한다. 이를 브라우저 차단0건 증거로 표현하지 않는다.
- 다음 첫 행동: 합성 로그인 후 팝업·관리/편집 설명·이메일 독립/복귀·키보드/320·390px를 검증하고 로컬 HTTP 대역으로 빈/오류·읽음/이동을 확인한다. 실제 업무 API·운영·배포0건. 기존 실제 QA는 미실행/차단 유지.

<a id="dev-62-verification"></a>

## 2026-11-12 · 검증/Documentation Update Check

- [로컬 QA NGC-01~09](../../../qa/notification-guidance.md): 전원 mock8관찰 묶음·로컬 HTTP9관찰 묶음 PASS. 비로그인/합성 복귀·현재 목적지·팝업 키보드 설정/해제/reload·320/390px·이메일OFF/공고ON 독립·편집/메뉴 visible/ARIA 사유·GET/읽음503→200 재시도·null fallback을 확인했다. 실제 VoiceOver 음성·실제 API 통합은 미실행이다.
- 자동:315 tests/15파일, lint, API/mock/hybrid Preview build, Storybook build·diff-check PASS. 테스트/구성/런타임 계약 변경 없이 기존 회귀를 사용했다. runtime4파일은 격리 source와 SHA-256 일치(`runtime-manifest.json`). API build/test/lint의 실행 래퍼 오류는 외부 도구만 교정 후 exit0 재확인, 제품 자동 수정0/3.
- 네트워크/복구: 브라우저 외부 관찰0, loopback 대역22요청(200×20/503×2)·삭제0. 서버 외부8시도는 guard 차단이며 전체 외부 시도0건으로 세지 않는다. 소유4370/4379 종료143·listener 없음, 자체 탭 없음. 실제 업무·메일/문서·운영/배포0건.
- 문서 검사1차:458 local links,79원본/114Task/155의존성·단일 활성·보호7파일·이전 QA4파일 exact prefix/Markdown·diff-check PASS. 원본 baseline/감사/coverage와 타 Task/QA 상태는 불변이다. 최종 종료 metadata 뒤 다시 검사한다.
- Documentation Update Check: DESIGN의 현재 AlarmList/채널 안내 교정, plan의 날짜별 진입점, QA4파일의 이력 보존/새 근거 링크와 새 안내 QA/합성 화면3장·이 Task/WBS·리뷰 기록을 갱신한다. base/architecture/data-access/harness는 package/scripts·구조/데이터·하네스 규칙 변화가 없어 갱신 불필요. ai-failures에는 반복/제품 고위험 재발 근거가 없어 새 항목을 만들지 않는다. [Context Audit](../reviews/DEV-62-context.md)은 확인된 DESIGN 드리프트 교정 후 관련 범위 PASS다.
- 남은 경계: 삭제 operation 존재는 POL-20 정책 확정·DEV-43 연결이 아니다. DEV-04/05·DEV-41·DEV-66은 미착수. 기존 QA-09/11/12/13·DEV-06 실제 차단/승인 예외 보존. 다음 첫 행동은 현재 diff/검증 근거로 read-only verifier와 ai-review를 수행하는 것이다.


<a id="dev-62-close"></a>

## 2026-11-12 · Review Gate / 종료·다음 인계

- 정의된 문구/문서 교정·로컬 검증 단위는 PASS다. [ai-review 여섯 섹션/독립 verifier](../reviews/DEV-62.md)의1차 PASS 뒤 발견한 기존 WBS 집계 Minor1을 실제 행으로 보정했다. 보강한 문서 검사기로 기존16/74 요약 오류를 재현했고 종료/인계 metadata를 반영해 재검증·두 리뷰 freshness를 재확인한다. 문서 자동 보정1/3·제품 수정0/3이다.
- 현재/다음/상태는 WBS만 소유한다. 다음 **DEV-09**는 남은 P0/앞선 P1 차단·선행 미충족을 보존한 상태에서, P2 표의 첫 후보이자 POL-07 완료를 근거로 선정했다. 실제 계약/실행 대응·합성 공고/계정·오류/복구 자원이 준비됐다는 뜻이 아니다.
- 다음 첫 행동: 새 대화에서 최신 main/Git·DEV-09 마지막 체크포인트/POL-07 결정·현행 지역 metadata·URL/공개 Repository·source/OpenAPI와 실제 QA 자원/승인을 대조해 자체 Brief를 제시한다. 미확보가 확인되면 자신의 차단/재개 조건을 기록한다. 이번 DEV-62에서 다음 source/API/Figma 상세 조사·설계/구현·실제 QA·Git 전달은 시작하지 않았다.
- Git 전달: runtime4파일, 사용자 가이드/QA, 검증/종료·인계 기록을 목적별 한국어 Conventional Commits로 분리하고 push/PR/라벨·실제 최종 head CI/리뷰·정상 merge·로컬 main FF/동일 SHA를 확인한다. 아직 Git 성공을 선행 주장하지 않으며 실제 결과는 [이 대화의 Git 전달 receipt](/Users/jisung/.codex/visualizations/2026/11/12/01a1cddc-b183-7a10-a85e-839851bb6c01/dev62/git-delivery.json)·최종 PR/보고에 수행 후 기록한다. 이 로컬 receipt는 Git 저장소 밖의 실행 메타데이터이며 다른 Mac에는 자동 전달되지 않는다.
- 이번 DEV-62 사용자의 Git/Chromatic 월간 한도 예외는 다음 DEV-09 실행·실제 업무 API/메일/운영·Git 전달이나 기존 실제 QA 면제가 아니다. 실제 통합 PASS·배포 완료와 로컬 범위 PASS/main 반영은 구분한다.

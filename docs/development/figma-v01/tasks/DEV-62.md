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

- [ ] DESIGN.md AlarmList의 현재 Interaction/상태 설명을 POL-04와 DEV-06의 읽음 성공 후 허용 경로 이동·위험/null fallback 및 실제 QA 미완료 범위에 맞춰 동기화한다. 과거 검증 이력은 보존한다.
- [ ] 공고별 알림·이메일·받은 알림·등록 공고 관리의 차이를 현재 목적지와 연결한 문구로 분리한다.
- [ ] POL-20에서 삭제 API/정책·프론트 미연결을 구별하고 준비 중 이유를 정확히 표시한다. 삭제 기능 구현은 DEV-43에 남긴다.
- [ ] 각 안내 링크/텍스트의 실제 목적지·비활성 상태·키보드/보조기술 접근을 검증하고 없는 전역 토글이나 관리 기능을 안내하지 않는다.
- [ ] 정상·빈·오류·권한/충돌과 접근성 중 영향 범위를 Gate에서 확정하고 자동/실제 Next 브라우저 검증 및 필요한 실제 QA를 기록한다. 미실행은 차단/이유로 남긴다.
- [ ] 현재 package scripts에 맞는 test/lint/build·필요한 Storybook/구성 검사와 diff-check를 통과한다. mock/HTTP 대역/실제 API 결과를 구분한다.
- [ ] Documentation Update Check, verifier/ai-review와 검토 뒤 변경의 freshness를 기록한다. 구현만으로 완료하지 않는다.

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

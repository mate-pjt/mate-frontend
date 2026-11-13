# DEV-57 · 가입·시작 선택 화면의 프레임별 UI 정합성

[상태의 단일 기준: WBS](../README.md) · [운영 규칙](../workflow.md) · [감사 근거](../audits/2026-11-11.md#cf-03)

## 작업 정의

- 유형: 개발. 원본 항목: O01, O04, O05, O10, C01; 2026-11-11 전수 감사 CF-03.
- 선행 작업: [POL-29](POL-29.md). 순위는 WBS가 관리한다.
- 목적: 시작 선택 Figma의 콘텐츠 폭은 692px이며 프레임마다 카드 폭과 인사말/입력 표현이 다르다.
- 현재 차이/영향: AuthScreen 기본 폭은 640px라 시작 선택 타일 폭/줄바꿈이 다르고 이름 인사말도 일반 문구다. 가입의 날짜는 native date 입력이다. 가입 프레임의 640px까지 일괄 692px로 바꿀 근거는 없다. mock 로그인 버튼/개발 배지는 운영 UI 차이에서 제외한다.
- 제외: 아래 소유 경계 밖의 기능·새 라이브러리·무관한 리팩터링. 이번 감사에서는 제품 수정/실제 업무 API 변경/commit·push·PR·배포를 수행하지 않았다. 미래 구현의 실행 범위는 착수 Gate에서 확인한다.
- 책임/재개 조건: 실행자는 다음 선정 시 확정한다. 프론트 구현·디자인 결정·필요한 API/QA 자원 역할을 나누고, 미확인 개인 담당자를 임의 배정하지 않는다. 선행 Task 결과와 현재 디자인/정책/source/배포를 다시 대조한다.

## 기준과 소유권

- 고정 출발점: frontend `8d3a2ec290aabc4280c5e9f5336cfd36376f7e94`; 현재 backend dev/정책과 관찰 수준은 [날짜별 감사](../audits/2026-11-11.md#cf-03) 및 [JSON](../audits/2026-11-11.json). 근거 파일은 수정 허용 목록이 아니다.
- 소유 소스: [src/components/auth/auth-screen.tsx](../../../../src/components/auth/auth-screen.tsx) / [src/app/auth/start/start-choices.tsx](../../../../src/app/auth/start/start-choices.tsx) / [src/app/auth/signup/signup-form.tsx](../../../../src/app/auth/signup/signup-form.tsx).
- 관련 Task: [POL-29](POL-29.md) / [QA-04](QA-04.md) / [QA-05](QA-05.md) / [QA-08](QA-08.md). 기존 QA의 case/통과/차단/승인 예외를 보존한다.
- Figma: [Figma 3140:119739](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-119739) / [Figma 3140:120851](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-120851) / [Figma 3140:121614](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-121614).
- 고정 정책: [domain/auth/account-and-social-identity.md](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/auth/account-and-social-identity.md).

## 착수 전 Implementation Brief / 설계 Gate

- 후보 요구사항/성공 기준: 아래 완료 기준. **아직 구현 미착수**다. UI 승인/실제 계약과 fixture 준비를 확인해 최종 Brief를 제시한다.
- in/out scope·현행 패턴: 위 목적/제외와 관련 Task의 소유 경계를 확인한다. 데이터/DTO/mock 설계 전 [data-access](../../../ai-context/data-access.md)를 읽는다.
- 편집 전 제시: 실제 수정 대상 파일·영향·단계·위험·검증 명령/시나리오·실행 식별자·필요한 데이터 사용/변경·잔존·복구 범위.
- blocking ambiguity는 최대3질문/추천안으로 해소한다. 감사의 추천을 정책 승인으로 취급하지 않고, 낮은 위험 가정만 명시해 진행한다.

## 완료 기준

- [ ] 로그인·가입·시작·찾기·초대의 서로 다른 Figma 폭/간격/문구를 정리하고 필요한 화면 variant만 적용한다.
- [ ] 이름이 없는 현재 세션의 인사말 fallback과 native date 유지/대체를 POL-29에서 결정한다. 날짜 미래값 검증은 이미 있으므로 회귀를 확인한다.
- [ ] 필수 동의·가입 오류·세션 지연·초대 불일치/만료·모바일/키보드/초점 상태를 검증한다. Google 실제 인증 이력과 mock-only 버튼을 구분한다.
- [ ] 정상·빈·오류·권한/충돌과 접근성 중 영향 범위를 Gate에서 확정하고 자동/실제 Next 브라우저 검증 및 필요한 실제 QA를 기록한다. 미실행은 차단/이유로 남긴다.
- [ ] 현재 package scripts에 맞는 test/lint/build·필요한 Storybook/구성 검사와 diff-check를 통과한다. mock/HTTP 대역/실제 API 결과를 구분한다.
- [ ] Documentation Update Check, verifier/ai-review와 검토 뒤 변경의 freshness를 기록한다. 구현만으로 완료하지 않는다.

## 체크포인트 · 결정·인계

| 날짜 | 수행/근거 | 다음 첫 행동 |
| --- | --- | --- |
| 2026-11-11 | QA-17 감사에서 후보 정의·소유권/완료 기준만 추가. 정책 신규 승인·제품 수정·실제 업무 API 실행 없음 | 선행 결과와 감사 CF-03를 읽고 현재 source/계약·검증 자원으로 Brief를 확정 |

- 추천/후보는 승인 아님. 개발자/디자인/서버 결정이 필요한 내용은 결정자·날짜·원문/소유 소스·유지/보류 이유를 기록한다.
- 이 Task의 구현/자동·브라우저/실제 QA·Review Gate는 **미실행/미판정**이다. 감사 문서 검토를 구현 검증으로 대신하지 않는다.
- 자동 수정 시도0/3. 실패 시 원인·최소 수정·재검증을 순서대로 기록한다.
- 문서 갱신 여부와 프로세스/데이터 복구, 미커밋/Git 전달 범위는 실행 시 기록한다. 상태/다음 작업은 WBS에서만 갱신한다.

## 2026-11-11 · POL-29 화면 기준 인계

- 기준: [POL-29의 Figma frame별 정렬](POL-29.md#pol-29-decisions). 로그인420px/가입입력640px/시작선택692px와 각 frame의 간격/문구를 기준으로 한다. AuthScreen 전체692px 일괄 변경은 금지한다. 검색/초대 실제 frame을 재조회하고 가입 section ID를 단일 화면으로 사용하지 않는다.
- generic 인사말/native date 전체를 승인 예외로 취급하지 않는다. 이름 인사는 실제 source와 결측/지연/오류 시안 확보 전 보류한다. 날짜 입력의 보이는 표면은 Figma 기준으로 검증하며 native 달력 사용은 시각 결과·접근성/브라우저 검증으로 판단한다. OS 달력을 Figma pixel PASS로 세지 않는다.
- [상태/검증표](POL-29.md#pol-29-states)의 동의/미래날짜·가입 실패/세션지연·초대 불일치/만료·mobile/keyboard/초점을 포함한다. 소속 용어/약관·실제 QA 이력/차단은 기존 소유를 유지한다. 이 Task 구현 미실행.

<a id="dev-57-resume-handoff-20261113"></a>

## 2026-11-13 · 다음 재개 요구사항 확인 대상으로 인계

- 승인자/날짜/원문: 이번 대화 사용자 / 2026-11-13 KST. **‘WBS의 다음 작업을 DEV-57 재개 요구사항 확인으로 바꿔줘. 기존 차단과 미결 정책은 유지’**, **‘DEV-57 구현은 다음 대화에서 시작할게.’** [전체 승인/문서 Brief](POL-09.md#pol-09-backend-replan-approval).
- 선정 이유: P1이며 POL-29 선행은 main에 반영됐다. [backend 재조사](../audits/2026-11-13-backend-readiness.md)에서 `AuthenticationResponse.account.nickname: string|null`, 로그인 완료·가입·refresh의 `Account.name` 전달을 확인해 이름 공급원이라는 차단 사유가 부분 해소됐다. 닉네임 편집 계약 추가는 아니며 frontend의 기존 id/email 계약은 아직 변경하지 않았다.
- **차단 유지**: 이름 결측/지연/오류 표시의 제품/디자인 결정, 현재 계약·실행 대응/합성 세션/실제 QA 자원과 허용 범위가 남았다. 이름 공급원 확인/다음 선정만으로 차단→준비/진행이나 제품/실제 통합 PASS로 바꾸지 않는다. 상태의 단일 소유자는 WBS다.
- 다음 첫 행동: 새 대화에서 최신 main/Git·POL-29 D2/상태표·이 Task의 frame별 기준/감사 CF-03와 고정 nickname 근거를 현행 source/Swagger와 비교한다. 결측/지연/오류 표시·frame별 폭/date 표면·접근성·합성 세션 및 필요한 실제 QA 범위를 확인하고, 미결은 추천안과 최대3질문으로 먼저 확정한다. 실제 수정 파일/영향/단계/검증 계획을 포함한 자체 Brief를 편집 전에 제시한다.
- 보존/제외: 로그인420/가입640/시작692px를 일괄 변경하지 않는 기준, native date의 실제 시각/접근성 검증, 동의/미래날짜·가입 실패/초대·mobile/keyboard·기존 QA/약관 차단은 그대로다. DEV-56 헤더·알림·다른 Task를 섞지 않는다. 새 라이브러리/이름 유추/가짜 성공·실제 업무 변경 승인은 없다.
- 이번 대화에서는 이미 확인한 근거와 재개 위치를 인계했을 뿐 DEV-57 자체 요구사항/설계 Gate·제품 구현·자동/브라우저/실제 API 검증을 시작하지 않았다. 문서 반영 검증/리뷰와 이 Task의 제품 검증은 별개다.

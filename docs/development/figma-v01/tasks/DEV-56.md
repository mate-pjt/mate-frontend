# DEV-56 · 공통 헤더의 식별·상태 UI 정합성

[상태의 단일 기준: WBS](../README.md) · [운영 규칙](../workflow.md) · [감사 근거](../audits/2026-11-11.md#cf-02)

## 작업 정의

- 유형: 개발. 원본 항목: C01, S01, O01; 2026-11-11 전수 감사 CF-02.
- 선행 작업: [POL-29](POL-29.md). 순위는 WBS가 관리한다.
- 목적: Figma의 로그인 후 회사/프로필 식별 영역과 브랜드/메뉴 배치를 현재 계정 계약과 함께 정의해야 한다.
- 현재 차이/영향: 현재는 마이페이지 텍스트와 별도 로그아웃 버튼이다. 브랜드 텍스트 색도 다르다. 인증 응답은 id/email만 있어 Figma의 사용자 이름을 바로 채울 수 없다. 메이트 소식 미구현은 기존 POL-27/DEV-51 범위다.
- 제외: 아래 소유 경계 밖의 기능·새 라이브러리·무관한 리팩터링. 이번 감사에서는 제품 수정/실제 업무 API 변경/commit·push·PR·배포를 수행하지 않았다. 미래 구현의 실행 범위는 착수 Gate에서 확인한다.
- 책임/재개 조건: 실행자는 다음 선정 시 확정한다. 프론트 구현·디자인 결정·필요한 API/QA 자원 역할을 나누고, 미확인 개인 담당자를 임의 배정하지 않는다. 선행 Task 결과와 현재 디자인/정책/source/배포를 다시 대조한다.

## 기준과 소유권

- 고정 출발점: frontend `8d3a2ec290aabc4280c5e9f5336cfd36376f7e94`; 현재 backend dev/정책과 관찰 수준은 [날짜별 감사](../audits/2026-11-11.md#cf-02) 및 [JSON](../audits/2026-11-11.json). 근거 파일은 수정 허용 목록이 아니다.
- 소유 소스: [src/components/site-header.tsx](../../../../src/components/site-header.tsx) / [src/data/auth/contracts.ts](../../../../src/data/auth/contracts.ts).
- 관련 Task: [POL-29](POL-29.md) / [DEV-51](DEV-51.md) / [QA-14](QA-14.md). 기존 QA의 case/통과/차단/승인 예외를 보존한다.
- Figma: [Figma 2048:58606](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2048-58606) / [Figma 3139:52490](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-52490).
- 고정 정책: [domain/auth/account-and-social-identity.md](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/auth/account-and-social-identity.md).

## 착수 전 Implementation Brief / 설계 Gate

- 후보 요구사항/성공 기준: 아래 완료 기준. **아직 구현 미착수**다. UI 승인/실제 계약과 fixture 준비를 확인해 최종 Brief를 제시한다.
- in/out scope·현행 패턴: 위 목적/제외와 관련 Task의 소유 경계를 확인한다. 데이터/DTO/mock 설계 전 [data-access](../../../ai-context/data-access.md)를 읽는다.
- 편집 전 제시: 실제 수정 대상 파일·영향·단계·위험·검증 명령/시나리오·실행 식별자·필요한 데이터 사용/변경·잔존·복구 범위.
- blocking ambiguity는 최대3질문/추천안으로 해소한다. 감사의 추천을 정책 승인으로 취급하지 않고, 낮은 위험 가정만 명시해 진행한다.

## 완료 기준

- [ ] POL-29에서 이름/회사 없음·미연결·로딩·오류의 표시와 사용 가능한 데이터 출처를 정한다. 임의 사용자/회사명이나 새 API를 만들지 않는다.
- [ ] 비로그인/로그인/회사 미연결/연결 상태, 알림 점·현재 메뉴·로그아웃 busy/오류를 데스크톱과 모바일에서 검증한다.
- [ ] 메이트 소식 구현은 DEV-51로 남기고 헤더 수정을 이유로 미완료 메뉴를 동작하는 것처럼 노출하지 않는다.
- [ ] 정상·빈·오류·권한/충돌과 접근성 중 영향 범위를 Gate에서 확정하고 자동/실제 Next 브라우저 검증 및 필요한 실제 QA를 기록한다. 미실행은 차단/이유로 남긴다.
- [ ] 현재 package scripts에 맞는 test/lint/build·필요한 Storybook/구성 검사와 diff-check를 통과한다. mock/HTTP 대역/실제 API 결과를 구분한다.
- [ ] Documentation Update Check, verifier/ai-review와 검토 뒤 변경의 freshness를 기록한다. 구현만으로 완료하지 않는다.

## 체크포인트 · 결정·인계

| 날짜 | 수행/근거 | 다음 첫 행동 |
| --- | --- | --- |
| 2026-11-11 | QA-17 감사에서 후보 정의·소유권/완료 기준만 추가. 정책 신규 승인·제품 수정·실제 업무 API 실행 없음 | 선행 결과와 감사 CF-02를 읽고 현재 source/계약·검증 자원으로 Brief를 확정 |

- 추천/후보는 승인 아님. 개발자/디자인/서버 결정이 필요한 내용은 결정자·날짜·원문/소유 소스·유지/보류 이유를 기록한다.
- 이 Task의 구현/자동·브라우저/실제 QA·Review Gate는 **미실행/미판정**이다. 감사 문서 검토를 구현 검증으로 대신하지 않는다.
- 자동 수정 시도0/3. 실패 시 원인·최소 수정·재검증을 순서대로 기록한다.
- 문서 갱신 여부와 프로세스/데이터 복구, 미커밋/Git 전달 범위는 실행 시 기록한다. 상태/다음 작업은 WBS에서만 갱신한다.

## 2026-11-11 · POL-29 화면 기준 인계

- 기준: 사용자 교정에 따른 [POL-29 D2](POL-29.md#pol-29-decisions). 로그인 우측은 **실제 사용자 이름+Figma 아이콘**이다. 일반 마이페이지 텍스트·회사명·이메일 유추로 대체하는 최초 추천은 미승인/철회됐다.
- 현재 auth 응답과 공개 OpenAPI에는 지속적인 사용자 이름 공급원이 없다. source/권한·결측/로딩/오류 fallback의 제품/디자인 기준 확보 전 이름 표시 구현 Gate는 차단한다. 새 endpoint/DTO 또는 가입 제안 이름의 지속 저장을 임의 설계하지 않는다. 필요한 역할은 backend/API·제품/디자인·프런트이며 개인은 미지정이다.
- [상태/검증표](POL-29.md#pol-29-states)의 auth/이름 없음·회사 미연결/권한·계정교체/로그아웃 busy/error·알림 점·mobile/keyboard를 검증해야 한다. 뉴스/미구현 메뉴/실제 QA-14와 기존 정책 차단은 보존한다. 이 Task 구현 미실행.

<a id="dev-56-backend-20261113"></a>

## 2026-11-13 · 이름 공급원 재확인과 미결 표시 기준 유지

- [날짜별 재조사](../audits/2026-11-13-backend-readiness.md)·[고정 source/명세](../audits/2026-11-13-backend-readiness.json)에서 backend 인증 응답 `account.nickname: string|null`을 확인했다. 로그인 완료·가입·refresh는 `Account.name`을 전달한다. 위11/11의 이름 공급원 부재는 당시 관찰이며 현재 backend 응답 부재로 재사용하지 않는다. frontend 계약은 아직 id/email만 사용한다.
- 이름+Figma 아이콘이라는 POL-29 D2 목표는 유지한다. 결측/지연/오류·회사 없음/미연결 표시, 계정 전환/로그아웃과 기존 상태별 QA 기준은 미결/미검증 그대로다. 회사명/이메일 유추나 임의 기본 이름으로 대체하지 않는다. 닉네임 편집 endpoint가 생겼다고 해석하지 않는다.
- 사용자 승인은 새 근거·인계 문서 반영이며 헤더 설계/구현 승인이 아니다. P3·차단/소유 경계와 QA-14/메이트 소식 후속을 유지한다. DEV-57에서 auth 기반이 바뀌면 최신 main을 확인해 필요한 기반만 재사용하며 두 Task를 함께 구현하지 않는다. 현재 상태는 WBS만 소유한다.

<a id="dev-56-resume-handoff-20261113"></a>

## 2026-11-13 · 다음 재개 요구사항 확인 대상으로 인계

- 결정자/날짜/원문: 이번 대화 사용자 / 2026-11-13 KST. **‘다음 작업을 POL-10 대신 DEV-56 재개 요구사항 확인으로 바꿔줘. WBS와 관련 작업 기록에 반영하고 기존 차단 조건은 유지해줘. DEV-56 구현은 다음 대화에서 시작할게.’** [승인 범위/문서 Brief](DEV-57.md#dev-57-next-dev-56-approval)를 따른다.
- 선정 이유/범위: 사용자가 홈 우측 헤더의 이름+아이콘 미표시를 확인한 뒤 다음 재개 확인으로 명시 선정했다. POL-10 완료는 이 작업의 선행이 아니며 기존 선행 POL-29는 완료다. 우선순위 영구 변경이나 구현 착수/차단 해제 승인이 아니다. 상태/현재/다음은 WBS만 관리한다.
- 재사용 가능한 현재 근거: [DEV-57의 확정 결정/구현](DEV-57.md#dev-57-brief)·[PR #69](https://github.com/mate-pjt/mate-frontend/pull/69), main `55147d7a3d78ce1ad3d914128901e03489227398`에서 frontend auth 계약/HTTP/mock의 nullable nickname 연결이 반영됐다. 위 id/email만 사용한다는 문장은 당시 관찰이며 현재 이름 공급원 부재로 반복하지 않는다. DEV-57의 시작 인사말 D1·로컬 QA D3는 헤더 상태별 승인/실제 API 통합 PASS를 대신하지 않는다.
- **기존 차단/미결 유지**: 이름+Figma 아이콘 목표 아래 결측/지연/오류·회사 없음/미연결 표시, 계정 전환/로그아웃 busy/error·알림 점·모바일/키보드·초점의 기준과 검증 범위를 자체 Gate에서 확인해야 한다. 실제 서버 실행 대응·합성 검증 자원·사용/변경·잔존/복구 허용 범위와 기존 QA-14/실제 QA·메이트 소식 소유도 보존한다. 이름/회사명/이메일 유추·새 API/기본 이름 임의 확정은 없다.
- 다음 첫 행동: 새 대화에서 최신 main/작업트리·이 기록/완료 기준·POL-29 D2/상태표와 DEV-57 nickname 소스/검증을 읽는다. 현행 헤더/auth source·backend GitHub/개발 Swagger·해당 Figma frame을 대조하고 미결 표시/QA 범위를 추천안과 최대3질문으로 구조화한다. 수정 파일/영향·단계·위험·검증을 담은 자체 Brief를 편집 전에 제시한다. source/배포/게시 명세/실행 SHA/실응답은 별개 근거로 남긴다.
- 앞선 질문 응답에서는 화면 현상 진단을 위해 현행 헤더/WBS와 CI 상태를 읽었다. 이번 후속은 선정/인계 문서 반영만이며 DEV-56 자체 Gate를 위한 상세 계약/Figma 재조사·요구사항/설계 Gate·구현/자동/브라우저/실제 API 검증은 시작하지 않았다. DEV-57의 Git/Chromatic 예외를 미래 DEV-56의 승인으로 이전하지 않는다. [이번 문서 검토](../reviews/DEV-57-handoff-DEV-56.md)는 제품 정합성 검증이 아니다.

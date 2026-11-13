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

- [x] POL-29에서 이름/회사 없음·미연결·로딩·오류의 표시와 사용 가능한 데이터 출처를 정한다. 임의 사용자/회사명이나 새 API를 만들지 않는다. — 11/13 자체 Gate D1/D2와 POL-29 후속 역링크.
- [x] 비로그인/로그인/회사 미연결/연결 상태, 알림 점·현재 메뉴·로그아웃 busy/오류를 데스크톱과 모바일에서 검증한다. — HUI-01~17, 실제 일반 HAPI-01~06. HAPI-07~10 실제 미실행 보존.
- [x] 메이트 소식 구현은 DEV-51로 남기고 헤더 수정을 이유로 미완료 메뉴를 동작하는 것처럼 노출하지 않는다.
- [x] 정상·빈·오류·권한/충돌과 접근성 중 영향 범위를 Gate에서 확정하고 자동/실제 Next 브라우저 검증 및 필요한 실제 QA를 기록한다. 미실행은 차단/이유로 남긴다. — 후속 실제 QA 선택의 일반 동작 범위이며 특수4사례/실행 SHA 미확인은 별도다.
- [x] 현재 package scripts에 맞는 test/lint/build·필요한 Storybook/구성 검사와 diff-check를 통과한다. mock/HTTP 대역/실제 API 결과를 구분한다.
- [x] Documentation Update Check, verifier/ai-review와 검토 뒤 변경의 freshness를 기록한다. 구현만으로 완료하지 않는다. — 11/13 두 리뷰1차 PASS·종료 문서 변경 뒤 필요한 문서 검사/두 리뷰 freshness 재확인.

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

<a id="dev-56-brief"></a>

## 2026-11-13 · 이번 착수 Brief / 결정

- 시작: clean `main`·`origin/main` `dfbaae03e677ba9e2d38fa4a0e873240c39055a9`, fetch 뒤0/0·선행 POL-29/DEV-57 main 반영 확인. `feat/dev-56-header-identity` 생성. pre-existing dirty 없음.
- 이번 승인: 사용자 요청의 DEV-56 개발·검증·두 리뷰·작은 commit/push·PR/최종 CI·정상 main 병합·로컬 FF 및 이번 Chromatic 월간 한도 예외. 실제 업무/운영/배포·다른 Task 실행은 제외하며 실제 QA 자원/허용 범위는 아래 D3를 따른다. 과거 Task의 예외를 이전하지 않는다.
- D1 / 사용자 / 2026-11-13 / **‘추천안 확정’**: 실제 nickname+‘님’과 Figma 아이콘에서 `/my`로 이동한다. null/공백은 아이콘만, 접근성 이름은 ‘설정 및 관리’. 회사 연결 여부로 이름을 바꾸거나 회사 조회를 추가하지 않는다. loading은 ‘로그인 확인 중’, error는 ‘로그인 확인 실패’와 재시도다. 이름/회사명/이메일을 합성하지 않는다.
- D2 / 같은 사용자·날짜 / **‘Figma대로 /my에서 제공 (추천)’**: 헤더의 별도 로그아웃을 제거하고 기존 `/my` 메뉴의 로그아웃·busy/실패/재시도를 검증한다. 기능 삭제나 헤더 별도 버튼의 화면 예외 승인이 아니다.
- D3 / 같은 사용자·날짜 / **‘실제 QA 자원과 허용 범위 제공 후 완료’**: 로컬 단위 완료·실제 QA 차단 보존 추천은 미채택이다. 로컬 구현/검증은 진행하되 실제 서버 실행 대응·합성 계정 별칭/로그인 경로·사용/변경·잔존/종료/복구 범위가 확보되고 실제 검증하기 전 Task 완료·병합으로 세지 않는다. 자원 준비 정보를 후속 요청했다. 기존 QA-14/다른 실제 QA 이력은 보존한다.
- 요구사항/성공 기준: Figma `2048:58606`의 GNB `2048:58683`와 `3139:52490`의 GNB `3139:52491`의56px·60px 좌우 여백·40px 로고/메뉴 간격·회색 브랜드·36px 아이콘/8px 이름 간격을 기존 토큰으로 구현한다. 비로그인/세션 loading/error·이름/null/공백·회사 미연결/연결·계정 전환/로그아웃·현재 메뉴·알림 점·320/390px·키보드/초점을 검증한다.
- 확인한 source/패턴: `site-header.tsx`, auth contracts/HTTP/session-controller/Provider, NotificationBell, MySideMenu, 기존 static icon과 typography/token. 공개 Repository·7그룹/불변 snapshot/운영 guard·계정 격리를 유지하고 API/DTO/mock 계약을 바꾸지 않는다.
- 현재 계약: backend dev `befe434c2b3fd80ddbc12c1d6216f738dd5ea12a`, 정책 main `c9e50ff591ae18023164e1a94581c611bf1e4f29`. GitHub 소유 응답 source·개발 OpenAPI3.1.0/v1에서 `nickname: string|null`, companyContext의 ID/role만 재확인. 게시 명세 SHA256 `30b46f3eca639a412659fe2a18f5908c6695786b4134d8319705dba095197164`. source/기존 배포 기록/게시 명세/실행 process SHA/실제 응답을 구분하며 마지막 두 항목은 아직 미확인이다.
- 범위/설계: `site-header.tsx`만 제품 수정 후보. 기존 아이콘·ButtonLink·세션 Provider 재사용 → 이름/상태와 재시도 표시 → 헤더 중복 로그아웃 제거 → 실제 Next/자동 검증 → 문서/두 리뷰 → 승인된 Git 전달 순서. QA/Task/WBS/리뷰·architecture/plan의 필요한 설명을 갱신한다. base/data-access/harness 변경은 계약/도구 변화가 없으면 불필요하다.
- 제외: 새 API/DTO/라이브러리·회사명 조회·메이트 소식 DEV-51 구현·DEV-57/58 제품 수정·실제 계정/업무 변경의 임의 실행·운영/배포. 시안 없는 mobile/error/keyboard 상태는 D1과 기존 접근성 패턴으로 검증하며 모든 상태의 pixel 동일 승인으로 표현하지 않는다.
- 위험/검증: 결측 이름 유추·긴 이름 overflow·세션 loading을 비로그인으로 오인·계정 전환의 잔여 표시·중복 재시도/로그아웃을 확인한다. Node22.20.0 `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm build-storybook`, `git diff --check`; 필요 구성은 CI의 api/mock/hybrid도 확인한다. 환경파일 없는 격리 Next·합성 HTTP 서버/Aside로 로컬 QA를 수행하고, 실제 통합은 D3의 자원/승인 확보 후 별도 기록한다.
- 다음 첫 행동: D1/D2 범위의 헤더 구현. 실제 QA 자원/허용 범위 응답을 기다리며 완료·병합 Gate는 유지한다. 자동 수정0/3, 실제 업무 실행0건·새 운영 잔존/원복 대상 없음.

### 실제 QA 범위의 쉬운 설명 뒤 사용자 선택

- 사용자에게 실제 QA는 개발 서버의 테스트 계정으로 이름 표시·새로고침·이동·알림 건수 조회·로그아웃을 확인하는 과정이라고 설명했다. 버전 정보는 실행자가 확인 가능한 범위에서 조사하며 준비되지 않은 이름 결측/특수 오류 계정은 실제 미검증으로 남긴다.
- 사용자 답변 **‘추천 방식으로 진행 — 로그인 화면 준비해줘’**. Google 로그인은 사용자가 직접 수행하고 Codex는 위 일반 동작을 확인한다. 업무 데이터 수정은 없다. 세션 갱신·로그아웃의 세션 교체/해제만 이번 허용 범위다. 실제 개인 정보·token/cookie/메일 등은 출력/보관하지 않는다. 특수 상태의 mock/HTTP 대역은 실제 응답으로 세지 않는다.
- 다음 첫 행동: 환경파일 없는 격리 runtime에 DEV-56 소스를 반영해 자동/합성 QA를 병행하고, `https://local.mate-bid.com:3000`의 개발 API 로그인 화면을 준비한다. 실제 테스트 계정/표시값은 사용자 로그인 뒤 비식별 판정으로만 관찰한다. QA-14 전체/타 기능 실제 QA 면제로 확대하지 않는다.

<a id="dev-56-verification"></a>

## 2026-11-13 · 검증/문서·Review Gate 체크포인트

- 구현: 제품 수정은 `src/components/site-header.tsx` 한 파일. 기존 nullable nickname/Provider/아이콘·토큰을 소비하고 auth/회사/알림 계약은 변경하지 않았다. 헤더의 중복 로그아웃만 제거하고 기존 `/my` 동작을 사용한다.
- 자동: Node22.20.0 `pnpm test`414/414·`pnpm lint`·`pnpm build` api/mock/hybrid·`pnpm build-storybook` PASS. 최초 pnpm 자동 의존성 확인·Turbopack 외부 symlink 실패는 격리 복사본의 실행 옵션/의존성 clone으로 해결했다. 저장소 의존성/설정·제품 소스 자동 수정0/3. `git diff --check` PASS.
- 로컬: [HUI-01~17](../../../qa/my-settings-home.md#dev-56-header-qa) PASS. 정상/null/공백·회사 연결/미연결·긴 이름/320/390px·loading/error/retry/busy·알림0/양수/오류·로그아웃 실패/재시도/401·keyboard/현재 메뉴를 검증했다. 전체 mock 로그인/리로드/계정 전환의 외부 브라우저 요청0건.4개 runtime의 header SHA256 `67d5577fe0a9983a79dd40420e31b8ff8d1ba2db037a7d18db5f8877dec8d07e` 일치.
- 실제: 사용자의 Chrome 로그인 첫 회신은 배포된 `dev.mate-bid.com`의 로그인임을 확인했다. 그 탭을 수정하지 않고 이번 소스의 local Chrome 탭을 열었다. 사용자 **‘로컬 주소에서 로그인했어’** 뒤 HAPI-01~06 PASS: 이름 표시·refresh200/복원·Enter `/my`·unread-count200·mobile/keyboard·logout200·reload refresh401/이름 제거. 일반 실제 동작의 증거이며 배포 사이트의 코드나 기존 API 통합 PASS를 재사용하지 않았다.
- 후속 D3 적용: 사용자가 수락한 쉬운 설명의 범위는 일반 실제 동작을 실행하고 준비되지 않은 특수 상태는 실제 미검증으로 남기는 방식이다. 실제 QA를 전부 다음으로 미루는 최초 로컬 완료 추천과 구분한다. HAPI-07~10(결측/회사별 계정·강제 오류/지연·다른 계정/늦은 응답·제어 알림 점)은 미실행, backend process SHA 대응은 미확인이다. 일반6사례를 이 특수4사례/QA-14 전체/기존 차단의 PASS로 확대하지 않는다.
- 보안/복구: 실제 이름/메일/ID·응답 본문·token/cookie/인증 query는 출력/보관하지 않았다. 실제 로그인 뒤 원문 요청을 기록할 수 있는 소유 Next 임시 로그는 열람 없이 제거했다. 마지막은 logout200/refresh401·비로그인이며 업무/회사/알림 설정·메일/문서 변경 없음. 실제 Network 관찰/viewport override는 해제했다. 소유 임시 runtime/합성 세션·탭의 최종 종료를 확인한 뒤 Git 전달한다.
- Documentation Update Check: architecture/plan·이 Task/WBS/POL-29 역링크·기존 QA/QA 인덱스·합성 캡처·리뷰를 갱신한다. base/data-access/harness/coverage는 패키지/scripts/계약·공급원·도구/소유권 변화가 없어 변경 불필요. Figma 임시 자산 주소의 출력 선별 재발은 ai-failures에 append했다. [Context Audit](../reviews/DEV-56-context.md) PASS.
- Review Gate: [6항목 ai-review](../reviews/DEV-56.md) 1차에서 미해결 Blocker/Major 없음. 다음 첫 행동은 문서 링크/79ID·114Task·156의존성·원본/과거 QA 보존 검사와 read-only verifier다. 검토 뒤 종료 기록/WBS·다음 인계가 바뀌면 해당 문서 검증/두 리뷰를 재확인한다. 실제 Git/최종 CI·병합 결과는 승인된 전달 뒤 PR·최종 보고/외부 receipt에서 확인한다.

### 로컬/일반 실제 QA Gate 종료와 다음 인계

- read-only verifier1차 **PASS**, Blocker/Major/Minor0. 13개 파일 manifest `004e6d9f62ead73432fd6fdc00f39fbbcd59ebb51b83540eb95d0b954f8732ac`를 검토하고 Node22.20.0 test414/lint/diff-check·링크533개/114Task/156의존성/원본/QA prefix를 독립 재실행했다. build3구성/Storybook·로컬/실제 비식별 증거·4개 runtime 소스 일치와 정리도 확인했다. ai-review6항목도1차 PASS.
- 최종 정리: 소유 process group4개와3000/3101/3102/4300 모두 종료/비청취, Aside 소유3탭 종료, Chrome의 임시 viewport/Network 관찰 해제·실제 session logout200/refresh401. 원문 live 요청 로그 없음. 실제 업무 변경·새 원복 대상 없음. 기존 사용자 dev 사이트 탭은 조작/종료하지 않았다.
- 이 종료 문서/WBS·POL-10 인계는1차 검토 뒤 변경이므로 문서 검사·ai-review와 같은 verifier의 freshness 재검토를 수행한다. 제품 소스는1차 manifest와 동일하며 문서 변경만으로 앱 검사를 반복하지 않는다. 최종 원문/manifest는 저장소 밖 `/tmp/mate-dev56-20261113/qa`와 최종 보고를 참조한다.
- 다음 하나: **POL-10**, WBS P2·DOC-001 완료. WBS 전체에서 선행 완료 조건을 충족한 대기 P0/P1이 없고 독립 정책 Gate로 진행 가능하다. [선정/첫 행동](POL-10.md#pol-10-after-dev-56)만 인계했다. POL-10 전용 정책/source/API/Figma 조사·결정/구현·실제 취소 실행은 하지 않았다.
- 다음 첫 행동/Git 전달: 마지막 문서 freshness 통과 뒤 목적별 commit/push·PR·실제 최종 head CI/리뷰·정상 merge commit·로컬 main FF를 수행한다. 저장소 merge commit 허용·main protected=false/rulesets없음·원격 main 시작 SHA 유지 확인. 이번 Chromatic 월간 한도만 예외이며 check 강제 성공/보호 우회/직접 main push를 사용하지 않는다. 실제 SHA/PR·CI·병합/main 일치/clean은 전달 뒤 외부 receipt/PR/최종 보고로 별도 기록한다.

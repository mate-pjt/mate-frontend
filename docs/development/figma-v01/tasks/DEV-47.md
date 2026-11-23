# DEV-47 · 승인된 최근·추천 검색어 팝업

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: L04
- 선행 작업: [POL-23](POL-23.md)
- 목적/범위: 확정된 공급원에 맞춰 팝업과 선택/삭제·검색 적용을 구현한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### L04 · 최근·추천 검색어 팝업
- 기준선: UI **없음**, 동작 **보류**, 데이터 **공급원·저장 정책 미정**. 검증: 코드 대조.
- 남은 점: 실제 검색 기록/추천어 근거와 보존 정책 후 연결
- Figma: [2085:69617](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2085-69617) / [2085:70060](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2085-70060) / [2085:70521](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2085-70521)
- 소유 소스/기존 기록: [src/components/bids/bid-list-search.tsx:21](../../../../src/components/bids/bid-list-search.tsx)、[docs/ai-context/plan.md:65](../../../../docs/ai-context/plan.md)

- 이어갈 QA 기록: [bid-list.md](../../../qa/bid-list.md). 기존 case ID와 통과/대기/차단 기록을 보존한다.

## 완료 기준

- [ ] 기록 없음·추천 없음·계정 전환·삭제/보존을 확인한다
- [ ] 키보드 선택·Escape·모바일·검색 적용/초기화를 검증한다
- [ ] 현재 package scripts로 필요한 test/lint/build·diff-check와 영향 시 Storybook 검증을 통과한다.
- [ ] 요구사항 Gate에서 정한 실제 API/브라우저·권한·오류 사례와 필요한 QA case를 검증한다. 외부 조건으로 못 하면 차단/미실행과 이미 승인된 예외를 기록하며 전체 기능 통합 PASS로 표시하지 않는다.
- [ ] Documentation Update Check 및 verifier/ai-review를 통과한다. 구현만 마친 상태는 완료가 아니다.

## 착수 전 Implementation Brief / 설계 Gate

이 기록은 작업 후보 정의다. DOC-001 외의 작업은 아직 실행하거나 설계 승인을 받은 상태가 아니다. 착수 시 아래를 현재 소스 기준으로 채우고 편집 전에 제시한다.

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

## 체크포인트 · 재개 메모

| 시각/실행자 | 환경·branch/HEAD·작업트리 | 수행/결과·근거 | 다음 행동·차단/재개 조건 |
| --- | --- | --- | --- |
| 2026-10-27 / 문서화 | feature/my-company-overview / f84af24b5f9d + 기존 미커밋 변경 | 보고서에서 작업 정의만 생성. 구현/실제 QA 미실행 | 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다. |

## 검증·리뷰·인계 기록

| 구분 | 실행 명령/사례·환경 | 결과 | 증거/미실행 이유 |
| --- | --- | --- | --- |
| 이번 작업 | 미실행 | 미판정 | 기준선의 과거 결과와 구분 |

- 자동 수정 시도: 0/3. 실패 시 명령·오류·원인·최소 수정·재검증 결과를 추가한다.
- Documentation Update Check: 착수 후 판단. base/architecture/data-access/plan/harness/ai-failures 중 영향 문서와 갱신/미갱신 이유를 기록.
- Review Gate: 미실행. verifier와 ai-review의 결과/대상 diff·후속 변경 재검토 여부를 기록.
- 커밋/PR: 없음. 추후 커밋할 때 하나의 목적·영어 type/한국어 메시지, 런타임/테스트/문서는 가능한 별도 커밋.
- 다음 작업 인계: WBS에서 선택. 이 단위의 필수 검증 PASS 전에 다른 기능으로 자동 전환하지 않는다.

<a id="dev-47-pol-23-handoff"></a>

## 2026-11-23 · POL-23 정책과 다음 요구사항 Gate 인계

- [사용자 D1~D3](POL-23.md#pol-23-brief)와 [확정 정책](POL-23.md#pol-23-contract)을 적용한다. 공개 3개 보기의 빈 검색 입력에 최근 기록이 있을 때 선택·단건 삭제·전체 지우기를 제공한다. 이번 개발 후보는 같은 탭 메모리의 최근 검색어다. [D3의 화면 예외](POL-23.md#pol-23-figma)를 구현·검증 범위로 사용한다.
- 완료 기준은 명시 제출·중복·최대 5개·항목별 30분·단건/전체 삭제, 비로그인·계정/세션 경계·새로고침/탭 종료·탭 간 격리, URL/첫 페이지와 필터 유지, 키보드·Escape·모바일이다. 최근 목록이 비어 있거나 입력 중에는 메뉴를 열지 않는다. 승인된 공급원을 확보할 때까지 추천 요청과 화면 노출을 보류한다.
- 관리형 추천은 소유자·확정 목록·갱신 기준과 입력 일치·순위·최대 표시 수·개인정보 경계를 확보한 후 별도 Gate에서 검토한다. 향후 추천 계약·QA를 이번 최근 검색어의 선행으로 삼지 않는다.
- 다음 첫 행동은 최신 main의 `BidListSearch`·URL 제출·인증 세션 경계에서 기록의 수명을 확인하고, [BKEY QA 계획](../../../qa/bid-list.md#pol-23-search-term-qa)으로 요구사항 Gate를 여는 것이다. 앱·HTML·저장 구현 범위와 검증 방법은 그 Gate에서 제시한다. 현행 검색의 실제 QA와 제품 변경 승인도 그때 확인한다.
- 이번에는 WBS 우선순위와 POL-23 선행을 적용한 선택 기준과 첫 행동을 넘겼다. DEV-47의 독립 조사·설계·구현·QA와 Git 전달은 이후 대화의 범위다.

<a id="dev-47-brief"></a>

## 2026-11-23 · 요구사항 Gate와 설계

- **요구사항과 성공 기준**은 `/bids` 전체·곧 마감·개찰 발표에서 빈 검색 입력에 최근 기록을 제공하는 것이다. 명시 제출·재선택만 앞뒤 공백 제거 후 최신 5개, 항목별 30분으로 기록한다. 기록 없음·입력 중에 팝업을 표시하지 않는다. 같은 탭의 SPA 이동에서 유지하고, 새 문서·다른 탭·계정 및 세션 경계에서는 기록을 지운다. 선택 시 기존 검색을 실행해 필터·보기를 보존하고 첫 페이지로 이동한다. 단건·전체 삭제, Escape·바깥 클릭과 키보드·모바일을 검증한다.
- **승인 근거**는 2026-11-23 KST 사용자의 [POL-23 D1~D3](POL-23.md#pol-23-brief)와 [L04 화면 예외](POL-23.md#pol-23-figma)다. 이번 요청의 사용자가 DEV-47 개발·검증·두 리뷰·목적별 커밋·push·PR·원격 확인·조건 충족 시 정상 병합·로컬 fast-forward 및 이번 PR의 Chromatic 월간 한도 예외를 승인했다. 추천 공급원·정책, 맞춤 공고, 실제 계정으로 OAuth나 업무 데이터 조회·변경, 운영·수동 배포는 작업 범위 밖이다.
- **확인한 현재 패턴**은 [입력과 제출](../../../../src/components/bids/bid-list-search.tsx), [URL 적용](../../../../src/components/bids/bid-list-client.tsx), [공개 서버 조회](../../../../src/app/bids/page.tsx), [세션 Provider](../../../../src/features/auth/session.tsx), [세션 controller](../../../../src/data/auth/session-controller.ts), [데이터 접근](../../../ai-context/data-access.md)이다. UI의 기존 길이·trim, `query`→`keyword`, `page` 제거, 계정 ID·epoch·logout 통지 패턴을 이용한다.
- **시안 근거**는 전체 보기 [빈 입력](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2085-69617), [최근 목록](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2085-70060), [입력 중 제안](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2085-70521)의 렌더링과 [팝업 하위 노드](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2085-70493)다. 300px 폭·8px 모서리·시계 아이콘을 적용한다. 마감·개찰은 POL-23에 연결된 상태별 메타데이터를 공통 입력에 적용한다. D3는 단건·전체 삭제와 입력 중 제안 생략의 화면 예외다. 좁은 화면의 흐름 배치와 삭제·키보드 초점 세부는 개발 선택이다.
- **수정 대상과 단계**는 `src/features/bids/recent-searches.ts`의 문서 수명 메모리와 만료, `session-controller.ts`와 `session.tsx`의 확정 세션 경계, 기존 로그인·초대 진입부의 동일 Google 이동에 이력 초기화 연결, `bid-list-search.tsx`와 `bid-list-client.tsx`의 팝업·기존 검색 재사용 순서다. 정적 시계 자산, 고정 시각·세션 경계용 테스트, DESIGN·architecture·공통 계획·QA·Task/WBS·리뷰를 갱신한다. 다음 Task 문서는 인계만 추가한다. Repository/DTO/공급원, 공통 SearchInput과 의존성 변경은 범위 밖이다.
- **주요 위험과 검증**은 빠른 계정 전환과 로그아웃 실패, 백그라운드 탭·열린 팝업의 만료, 긴 행과 포커스 유실이다. 고정 Clock·가상 세션의 Node 테스트, Node 22.20.0의 `pnpm test`, `pnpm lint`, 세 profile의 `pnpm build`, `git diff --check`, 문서 링크·WBS 상태·기존 QA 보존, 실제 Next/브라우저의 [BKEY 8건](../../../qa/bid-list.md#pol-23-search-term-qa), 로컬 HTTP 대역의 키워드·페이지·필터·요청 횟수를 검증한다. 최근 검색어용 API가 없어 공유 개발 API 신규 실행은 계획하지 않는다. 기존 QA-02 실서버 기록과 대역 결과를 구분한다. verifier와 `ai-review`를 실행한다.
- **가정과 미결 사항**은 브라우저 세션의 access token 일반 갱신을 같은 인증 문맥으로 보고, 인증 controller가 확정한 세션 종료와 오류를 기록 폐기 신호로 삼는 것이다. 포커스 이탈은 팝업만 닫고, Escape·삭제의 복귀 지점은 검색 입력이다. 추가 정책 선택을 요구하는 차단은 없다. 관리형 추천의 소유자·승인 목록·갱신 기준은 POL-23의 후속 조건이다.

| 시각/실행자 | 시작 기준과 수행 | 다음 행동 |
| --- | --- | --- |
| 2026-11-23 14:50 KST / Codex | `main=origin/main=43ae9ddaf42854728816cd2c8491f2b82238f19c`, clean. [POL-23 PR #108](https://github.com/mate-pjt/mate-frontend/pull/108) 병합과 같은 Task의 기존 변경·브랜치 부재 확인. 최신 main에서 `feat/dev-47-recent-bid-searches` 생성. | 메모리·인증 연결을 구현하고 과거 문서 이력 및 다른 작업트리를 보존한다. |
| 2026-11-23 14:56 KST / Codex | 최근 검색어와 세션 연결·팝업 구현. 첫 테스트의 격리 복사본에 기존 `tools/qa` fixture를 추가했다. lint가 잡은 로그인 함수 참조 위치를 초대 내부 컴포넌트로 옮겨 재검증했다(자동 수정 1/3). 43파일 1,258 테스트, lint, Preview api·mock·hybrid 빌드 통과. | 실제 Next mock과 별도 loopback HTTP 대역에서 BKEY를 실행한다. Aside 브라우저 프로필 연결이 없어 격리 Chromium을 사용한다. |
| 2026-11-23 15:05 KST / Codex | 정책과 동일하게 마지막 제출 시각을 메모리 필드로 저장하도록 정리했다. 앱 자동 검사와 BKEY-01~08 로컬 브라우저를 다시 통과했다. 안내된 QA 선택자 수정과 격리 복사의 fixture 보완은 앱 실패와 구분한다. | 작업 기록·문서와 실행본 지문을 대조하고 두 리뷰를 진행한다. |

<a id="dev-47-verification"></a>

## 검증과 문서 갱신 · 2026-11-23 KST

| 검증 | 실행과 결과 |
| --- | --- |
| 의존성·정적 검사 | Node `22.20.0`·pnpm `11.3.0`, 격리본의 `pnpm install --frozen-lockfile` 통과. `pnpm test` 43파일·1,258건 통과, DEV-47 신규 8건. `pnpm lint` 경고 0건. |
| Next 빌드 | Preview `api`, `mock`, `hybrid`의 `pnpm build` 모두 통과. 구성별 TypeScript 검사와 정적 페이지 26개를 확인했다. |
| 실제 브라우저 | `pnpm start`의 mock과 분리된 API/loopback, 격리 Chromium의 [BKEY-01~08](../../../qa/bid-list.md#dev-47-local-qa) 로컬 통과. 브라우저/서버 외부 요청은 0건이다. 인증 401/503은 대역의 의도된 분기다. 가상 초대 화면의 비로그인 진입과 다른 계정 로그인 뒤 초대 복귀도 확인했다. |
| 문서 | 링크·앵커, 원본 79개, WBS 114개 및 선행 연결 156개, 집계·우선순위·기존 QA 보존과 `git diff --check` 통과. |
| 미실행 | 공유 개발 API·실제 계정/OAuth 0건. 이력 API는 없고 기존 키워드·목록은 HTTP 대역으로 검증했다. `pnpm build-storybook` 로컬 실행은 생략했다. 변경된 목록 전용 UI와 인증 라우트는 Storybook에 연결돼 있지 않다. |

- [자동 검사와 브라우저의 로컬 증거](/Users/jisung/.codex/visualizations/2026/11/23/dev-47-bid-search/)에 소스 지문, 명령 결과, 대역 시나리오를 보관했다. 실행본의 런타임·테스트 파일 지문을 양쪽 Next 사본과 대조했다. QA 문서와 PR에서 확인할 데스크톱·모바일 사진은 합성 검색 영역만 담았다.
- Documentation Update Check에서 `DESIGN.md`와 `architecture.md`에 검색 상태·세션 수명을 갱신하고, `plan.md`, WBS와 Task, BKEY QA 및 리뷰를 연결했다. 공개 Repository·DTO·전송·저장소 정책, 패키지·스크립트·하네스 변화가 없어 `data-access.md`, `base.md`, `harness.md`의 갱신 사유는 없다. 첫 검증에서 확인한 격리본 누락과 참조 위치는 이 체크포인트에 기록했다. 재발 방지 공통 규칙을 바꿀 정도의 사고는 없었다. 기준선과 `coverage.md`의 L04·선행 연결, 기존 QA-02 이력은 보존한다.

<a id="dev-47-close"></a>

## 완료 기준 확인과 인계 · 2026-11-23 KST

- [x] 빈 입력의 최근 목록, 추천 미노출, 수정·삭제와 탭/계정 수명을 BKEY-01~04·06~07에서 확인했다.
- [x] 검색 적용·초기화, 키보드 선택·Escape·모바일과 HTTP 요청 경계를 BKEY-05~08에서 확인했다.
- [x] package scripts의 단위 테스트·lint·세 Preview 빌드, 로컬 브라우저 8건과 문서 검증을 통과했다. 공유 개발 API 신규 실행 0건과 기존 QA-02 실제 6차단을 보존한다.
- [x] Documentation Update Check와 독립 verifier·`ai-review`를 완료했다. [검토 보고서](../reviews/DEV-47.md)에서 검토 대상과 종료 diff 재검토 기준을 확인한다.

상위 순위의 차단·미충족 선행을 적용하면 DOC-001을 충족한 [POL-24](POL-24.md#pol-24-dev-47-handoff)가 다음 P3 순서다. O02 시안의 로그인 상태와 최신 프론트·백엔드·게시 Swagger 및 가용한 QA를 대조해 네이버 로그인 MVP 지원 여부의 Gate를 여는 것이 첫 행동이다. 이번에는 선정과 인계를 기록했다.

<a id="dev-47-delivery"></a>

## Git 전달 체크포인트

- 브랜치 `feat/dev-47-recent-bid-searches`, 기준 `43ae9ddaf42854728816cd2c8491f2b82238f19c`. 런타임·테스트·동작 문서·검증과 인계 문서를 목적별 커밋으로 구성한다. [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afeat%2Fdev-47-recent-bid-searches)에 `type: feature`를 적용한다.
- 최종 head의 원격 검사, 최신 `main`, 미해결 리뷰와 병합 조건을 확인한다. 이번 사용자 예외는 Chromatic 월간 한도 관련 검사에 한정한다. 확정된 CI와 main 병합·동기화 결과는 PR과 최종 전달 보고에서 확인한다.

# DEV-02 · 홈 푸터 약관·FAQ 링크와 고객문의 표시

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: H04
- 선행 작업: [POL-01](POL-01.md) / [DEV-01](DEV-01.md)
- 목적/범위: 승인한 Figma 푸터의 약관·개인정보·FAQ 링크, 고객문의 이메일·운영시간과 저작권 문구를 표시한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

<a id="dev-02-pol-01-approved-handoff"></a>

## 2026-11-26 · POL-01 정책 인계

- [홈 푸터 3261:54518](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3261-54518)의 세 링크와 고객문의 표기를 따른다. 약관과 개인정보처리방침은 DEV-01의 승인된 공개 문서, FAQ는 기존 `/qna`를 가리킨다. 고객문의는 시안의 이메일과 운영시간 표시이며 사용자가 해당 공개값을 승인했다. 별도 문의 버튼·폼과 시안에 없는 사업자 정보를 제외한다. [확정 정책](POL-01.md#pol-01-approved-policy)
- DEV-01에서 확인한 문서 목적지를 받은 뒤 홈의 링크와 승인 값, 접근성 및 화면 폭별 줄바꿈을 검증한다. 현행 시안과 과거 기준선에 적힌 문의 경로 표현의 근거는 위 정책 인계를 따른다. 이번에는 구현과 QA를 시작하지 않았다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### H04 · 푸터 정보·약관·고객문의
- 기준선: UI **빈 영역**, 동작 **미연결**, 데이터 **없음**. 검증: 코드·홈 캡처 대조.
- 남은 점: Figma 푸터 내용·링크·문의 경로를 구현
- Figma: [2016:57355](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2016-57355) / [3261:54545](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3261-54545)
- 소유 소스/기존 기록: [src/app/page.tsx:225](../../../../src/app/page.tsx)、[src/app/auth/legal/[document]/page.tsx:18](../../../../src/app/auth/legal/[document]/page.tsx)

- 이어갈 QA 기록: [home.md](../../../qa/home.md). 기존 case ID와 통과/대기/차단 기록을 보존한다.

## 완료 기준

- [x] 링크 대상/키보드·외부 링크 속성·모바일 줄바꿈을 확인한다
- [x] 가입과 푸터에서 동일한 승인 약관·개인정보처리방침을 열고, FAQ와 승인된 고객문의 표시가 시안에 맞는지 확인한다
- [x] 현재 package scripts로 필요한 test/lint/build·diff-check와 영향 시 Storybook 검증을 통과한다.
- [x] 요구사항 Gate에서 정한 실제 API/브라우저·권한·오류 사례와 필요한 QA case를 검증한다. 외부 조건으로 못 하면 차단/미실행과 이미 승인된 예외를 기록하며 전체 기능 통합 PASS로 표시하지 않는다.
- [x] Documentation Update Check 및 verifier/ai-review를 통과한다. 구현만 마친 상태는 완료가 아니다.

<a id="dev-02-brief"></a>

## 2026-11-26 KST · Implementation Brief와 설계

- P0 개발 H04의 성공 기준은 `/`에서 승인한 푸터를 표시하고, 키보드로 두 약관과 FAQ에 접근하며, 320px부터 고객문의와 하단 링크를 가리지 않고 읽을 수 있는 것이다. 원격 `main`의 POL-01 정책 PR [#132](https://github.com/mate-pjt/mate-frontend/pull/132), DEV-01 경로 PR [#133](https://github.com/mate-pjt/mate-frontend/pull/133)과 공개 뷰어·완료 기록 PR [#135](https://github.com/mate-pjt/mate-frontend/pull/135)·[#136](https://github.com/mate-pjt/mate-frontend/pull/136)의 반영을 확인했다.
- 시안 [3261:54518](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3261-54518)의 구조와 1920×284 캡처, [변형 3261:54545](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3261-54545)의 메인용·다른 화면용을 대조했다. 홈에 어두운 메인 변형, 48px 심볼 슬롯의 흰색 36×28px 자산, 링크와 구분선, 문의 문구와 `© 2026 Mate. All rights reserved.`를 적용한다. 고객문의 값과 표시 범위의 근거는 [POL-01 사용자 승인](POL-01.md#pol-01-approved-policy)이다.
- `src/app/page.tsx`의 빈 푸터 및 상단 이동 마크업을 홈 전용 `src/components/home/home-footer.tsx`에서 구성한다. 흰색 심볼은 `public/images/home/footer-mate-mark.svg`에 Figma 자산을 저장한다. `globals.css`의 grayscale·Body·Caption 토큰과 `next/link`, `next/image`를 사용한다. 수정 영향은 홈 하단의 표시와 탐색이다. 문서 대상은 WBS·작업·홈 QA와 바로가기 소유 근거를 담은 구조 문서·검토 기록이다.
- [가입](../../../../src/app/auth/signup/signup-form.tsx)의 `/auth/legal/terms`·`/auth/legal/privacy`를 `target="_blank"`와 `rel="noopener noreferrer"`로 재사용한다. FAQ는 기존 정적 공개 `/qna`에 현재 탭으로 연결한다. [FAQ](../../../../src/app/qna/page.tsx)를 참고해 좁은 폭의 상단 이동 링크를 문서 흐름에 두고, 넓은 폭에서는 고정 위치를 사용한다. 모바일 줄바꿈과 버튼 위치는 구현에서 정한 반응형 선택이다. 링크 가림, 초점 이동, 접근성 안내, HTTPS 리다이렉트를 확인한다.
- 별도 문의 버튼·양식, 다른 화면용 푸터, 가입 동의·문서 권한·시행일, API·mock·DTO·데이터 흐름, 라이브러리 추가와 배포는 범위에서 제외한다. 홈 카드의 정상·빈 결과·오류는 기존 동작을 사용한다. DEV-01의 공유 개발 서버 `409` 미실행 예외는 DEV-01 기록에 남긴다.
- Node 22.20.0·pnpm 11.3.0의 격리 작업본에서 `pnpm test`, `pnpm lint`, `pnpm build` 및 `git diff --check`를 실행한다. 실제 Next·Chrome의 mock 홈에서 1920·768·390·320px 레이아웃, 클릭·Tab·Enter, 상단 이동, FAQ 내용을 검증한다. 가입 링크는 기존 mock 흐름 또는 격리 HTTP 대역에서 확인한다. 공개 약관 읽기는 비로그인 GET과 브라우저를 사용한다. 승인된 공개 열람으로 진행할 수 있으며 정책·계약에 추가 결정이 필요한 항목은 확인되지 않았다.

## 결정 기록

| 날짜 | 질문/선택지와 추천 | 결정·근거·승인자/원문 | 영향 |
| --- | --- | --- | --- |
| 2026-10-27 | 작업 후보 분해 | 정책·API·제품 동작 신규 승인 없음 | 착수 시 Gate 수행 |
| 2026-11-26 | 홈 푸터에 사용할 표시와 문서 | 사용자가 [POL-01](POL-01.md#pol-01-approved-policy)에서 시안 공개값과 범위를 승인했고 [DEV-01](DEV-01.md#dev-01-20261126-close)에서 두 공개 원문을 확인했다. | 홈 푸터·가입 동일 원문, FAQ와 연락처 표시 적용 |
| 2026-11-26 | 모바일 줄바꿈과 상단 이동 | 실행자가 기존 `/qna` 반응형 패턴을 적용하기로 했다. | 좁은 폭에서 링크와 문구 가림 방지 |
| 2026-11-26 | DEV-02 Git 전달 | 이번 요청에서 사용자가 작업 브랜치 커밋·push·PR·CI 확인·정상 병합·로컬 `main` 동기화를 승인했다. Chromatic 월간 한도에 의한 차단만 이번 PR의 진행 예외로 지정했다. | 최초 후보화와 과거 Task의 전달·실제 QA 승인 범위와 별도로 기록 |

## 체크포인트 · 재개 메모

| 시각/실행자 | 환경·branch/HEAD·작업트리 | 수행/결과·근거 | 다음 행동·차단/재개 조건 |
| --- | --- | --- | --- |
| 2026-10-27 / 문서화 | feature/my-company-overview / f84af24b5f9d + 기존 미커밋 변경 | 보고서에서 작업 정의만 생성. 구현/실제 QA 미실행 | 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다. |
| 2026-11-26 KST / 실행자 | `feat/dev-02-home-footer` / `c4095225ade152b41e3c180c3fce0d244f4afd42`. 분기 전 `main`과 `origin/main` 일치, 미커밋 변경 없음 | 선행 PR과 승인 시안, 빈 푸터·가입 공개 경로·FAQ 소유 소스를 대조했다. [Brief](#dev-02-brief)를 제품 편집 전에 제시했다. | 푸터와 흰색 심볼을 추가하고 격리 빌드에서 데스크톱·모바일 탐색을 검증한다. |
| 2026-11-26 KST / 실행자 | 같은 브랜치와 HEAD. 제품 3파일과 작업 문서 변경 | 푸터 및 원본 36×28px 흰색 심볼을 적용했다. 브라우저 증거 수집 전 `git diff --check` 통과. | 격리 설치와 자동·브라우저 검증, 공개 문서 응답을 확인한다. |
| 2026-11-26 KST / 실행자 | 같은 브랜치와 HEAD. 격리 Node 22.20.0, pnpm 11.3.0, Next 16.2.9, Chrome 158 | 자동 테스트 1,273개, lint·mock 빌드, 4개 뷰포트, 공개 문서 두 개와 FAQ 이동을 확인했다. 기존 QA 이력을 두고 [홈 QA](../../../qa/home.md#dev-02-home-footer-qa)를 추가했다. | 문서 무결성을 검사하고 read-only verifier·ai-review를 진행한다. |
| 2026-11-26 KST / 실행자 | 같은 브랜치와 기준 HEAD. 격리 Next·Chrome 종료 | 문서 검사와 독립 verifier·ai-review에서 Blocker·Major가 없었다. [검토](../reviews/DEV-02.md#dev-02-review) | 완료·인계 Markdown을 다시 검토한 뒤 커밋·push·PR·최종 head CI와 병합 조건을 확인한다. |

<a id="dev-02-verification"></a>

## 검증·리뷰·인계 기록

| 구분 | 실행 명령/사례·환경 | 결과 | 증거/미실행 이유 |
| --- | --- | --- | --- |
| 정적·자동 | `pnpm install --offline --frozen-lockfile`, `pnpm test`, `pnpm lint`, `pnpm build` | 통과 | Node 22.20.0, pnpm 11.3.0. 테스트 43파일·1,273개. Preview 전체 mock의 Next 빌드에서 `/`·`/auth/legal/[document]`는 동적, `/qna`는 정적이다. |
| 로컬 브라우저 | `pnpm start` 후 격리 Chrome의 홈과 mock 가입 | 통과 | 네 화면 폭, Tab·Enter, 새 탭 4개, 같은 원문 2개, 현재 탭 FAQ와 홈 복귀를 확인했다. [QA·캡처](../../../qa/home.md#dev-02-home-footer-qa) |
| 공개 원문과 경로 | 인증 없는 HTTP로 두 로컬 `307`의 주소 대응과 두 승인 문서 `200`·제목 및 미지원 `404` 검사 | 통과 | [공개 뷰어 근거](DEV-01.md#dev-01-20261126-viewer)를 이어서 사용한다. 이번 검증의 공개 열람과 과거의 권한 설정 확인을 구분한다. |
| 실제 업무 API | 실서버 가입·홈 공고 통합 및 HTTP 대역 | 미실행 | 푸터는 기존 공개 경로와 정적 텍스트를 사용한다. 가입 제출·메일 발송·문서 쓰기·공유 변경은 각각 0건이다. 기존 HOME-01~09, AUTH-02/03, QA-16의 결과와 조건을 유지한다. |
| Storybook | `pnpm build-storybook` 로컬 | 미실행 | 홈 전용 컴포넌트와 페이지 전용 SVG로, Storybook·공유 UI·빌드 설정에 변경이 없다. 원격 워크플로 결과는 PR에서 확인한다. |

- 자동 제품 수정 0/3. Aside 시크릿 세션 연결 실패 후 Playwright CLI의 새 Chrome 세션을 사용했다. 첫 브라우저 계측이 고객문의 문단을 저작권 요소로 잘못 읽어 실패했다. 격리 계측의 선택자를 수정해 재실행했고 네 폭이 통과했다.
- Documentation Update Check에서 WBS·작업 기록·[홈 QA](../../../qa/home.md#dev-02-home-footer-qa)·[구조 문서](../../../ai-context/architecture.md#auth-and-home-route-contract)·[실패 이력](../../../ai-context/ai-failures.md#dev-02-figma-asset-output)과 검토 기록을 갱신했다. 패키지·데이터 계약·하네스 변경이 없어 `base.md`·`data-access.md`·`harness.md`는 현행과 일치한다. `plan.md`의 WBS 진입점과 H04 원본·`coverage.md` 연결을 유지한다.
- Review Gate 증거와 원격 전달 조건은 [검토 기록](../reviews/DEV-02.md)에 연결한다.

<a id="dev-02-close"></a>

## 2026-11-26 KST · 구현과 검증 종료

- 홈의 승인 메인 변형에 약관 2개·FAQ·고객문의와 저작권을 연결했다. 이미지·링크와 실측 결과는 [홈 QA](../../../qa/home.md#dev-02-home-footer-qa), 자동 검사·문서·두 리뷰는 [검토 기록](../reviews/DEV-02.md#dev-02-review)에 있다. 공개 약관 열람은 실제 두 문서의 비로그인 결과다. 실제 업무 API 통합이나 운영 배포는 미실행이다.
- 제품과 푸터 검증·인계 문서, 재발 이력을 목적별로 커밋한다. PR은 프로젝트 템플릿과 라벨을 사용한다. 최종 head의 GitHub CI·리뷰·최신 `main`을 확인하고 GitHub의 merge commit으로 이력을 유지한다. Chromatic 월간 한도 결과에는 사용자가 이번 요청에서 허용한 범위만 적용한다. PR·병합·로컬 동기화는 실제 Git 결과를 확인해 보고한다.

<a id="dev-02-handoff"></a>

## 다음 Task 선정과 첫 행동

선행을 모두 충족한 대기·준비 Task가 없다. P0에서 QA-16은 DEV-02 외에도 실제 QA 선행이 남아 있다. 표 순서상 PREP-01을 충족한 첫 P0 재개 후보인 **QA-01**을 선정한다. 기존 4통과·5차단과 당시에 허용한 진행 조건을 유지한다. 첫 행동은 HOME-02~06의 사례별 합성 공고·정렬 및 표시 기대값과 개발 인스턴스의 실행 식별자 확보 여부를 확인하는 것이다. 자체 Gate, API 실행과 제품 작업은 다음 대화의 범위다. [QA-01 최근 체크포인트](QA-01.md#qa-01-20261125-evidence) · [WBS](../README.md)

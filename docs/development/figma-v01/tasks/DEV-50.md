# DEV-50 · 설정·FAQ 의견 보내기 연결

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: S08
- 선행 작업: [POL-26](POL-26.md)
- 목적/범위: 동일하게 승인된 채널을 설정과 FAQ 배너에서 연결한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### S08 · 의견 보내기·문의 경로
- 기준선: UI **배너만**, 동작 **비활성**, 데이터 **연결 없음**. 검증: 코드 대조.
- 남은 점: 수집 채널·외부 링크/폼 정책 후 연결
- Figma: [3139:52490](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-52490) / [2314:31201](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2314-31201)
- 소유 소스/기존 기록: [src/components/my/my-settings-home-client.tsx:100](../../../../src/components/my/my-settings-home-client.tsx)、[src/app/qna/page.tsx:56](../../../../src/app/qna/page.tsx)

- 이어갈 QA 기록: [qna.md](../../../qa/qna.md). 기존 case ID와 통과/대기/차단 기록을 보존한다.

## 완료 기준

- [x] 설정·FAQ 진입, 모바일·키보드, 공개 폼의 필수/선택 표시, 열람 성공/실패와 원래 화면 복귀를 확인했다. [S08-01~04](../../../qa/qna.md#dev-50-local-qa)
- [x] 고정 URL·새 탭 격리·referrer 및 앱의 계정 정보·저장/로그 비전송을 검증했다. [S08-05](../../../qa/qna.md#dev-50-local-qa)
- [x] 현행 package scripts의 test/lint/build/build-storybook 및 변경 diff 검사를 통과했다. [검증](#dev-50-verification)
- [x] 승인된 링크 범위의 전체 mock 인증·정적 FAQ·외부 공개 GET·장애 대역을 구분했다. 실제 Mate API·OAuth, 실제 제출·운영은 [미실행 범위](#dev-50-verification)에 기록했다.
- [x] Documentation Update Check 및 verifier/ai-review를 통과했다. [리뷰 범위와 결과](../reviews/DEV-50.md)

## 착수 전 Implementation Brief / 설계 Gate

10월 27일의 작업 후보를 [POL-26 D1~D3](POL-26.md#pol-26-contract)와 현행 소스를 기준으로 구체화했다. [이번 Brief와 설계](#dev-50-brief)를 따른다.

## 결정 기록

| 날짜 | 질문/선택지와 추천 | 결정·근거·승인자/원문 | 영향 |
| --- | --- | --- | --- |
| 2026-10-27 | 작업 후보 분해 | 정책·API·제품 동작 신규 승인 없음 | 착수 시 Gate 수행 |
| 2026-11-24 | 설정·FAQ의 S08 목적지와 완료 범위 | 사용자의 POL-26 D1~D3 결정. [결정 원문과 시각](POL-26.md#pol-26-contract) | 기존 의견 폼의 고정 HTTPS 링크, 설정 인증 경계와 FAQ 공개 진입, 열람·복귀 검증 |
| 2026-11-24 | DEV-50 단일 작업과 Git 전달 | 이번 사용자 요청에서 개발·검증·두 리뷰와 목적별 커밋·push·PR·정상 병합·로컬 fast-forward를 승인했다. 해당 PR에서 원인이 확인된 Chromatic 월간 한도 예외를 승인했다. | 폼 제출·수정, 운영 정책, 메일, 업무 API와 서비스 배포는 별도 범위다. |
| 2026-11-24 | 외부 탭 동작과 안내 | 실행자 선택. 기존 외부 링크의 `target="_blank"`와 `rel="noopener noreferrer"`를 따른다. | 두 원래 화면을 열어 둔다. 스크린 리더에 새 탭 동작을 알리고 키보드 초점을 표시한다. |

## 체크포인트 · 재개 메모

| 시각/실행자 | 환경·branch/HEAD·작업트리 | 수행/결과·근거 | 다음 행동·차단/재개 조건 |
| --- | --- | --- | --- |
| 2026-10-27 / 문서화 | feature/my-company-overview / f84af24b5f9d + 기존 미커밋 변경 | 보고서에서 작업 정의만 생성. 구현/실제 QA 미실행 | 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다. |
| 2026-11-24 09:28 KST / Codex | `feat/dev-50-feedback-link` / `ebc7358b0ec804fdd5769190e4e73b7f75ef887c`, 시작 전 변경 없음 | 로컬·원격 main 일치, [POL-26 PR #112](https://github.com/mate-pjt/mate-frontend/pull/112) 병합·선행 커밋 포함 확인. `/my`·`/qna`의 비활성 배너 두 개와 Figma의 기존 배너 근거를 대조했다. | 공통 배너와 외부 링크를 적용하고 S08-01~05를 실행한다. |
| 2026-11-24 09:31 KST / Codex | 같은 브랜치·HEAD, 이번 작업 변경만 있음 | 공통 배너를 두 화면에 연결했다. 환경 파일을 제외한 임시 복사본에서 기존 의존성 설치 및 1,258 테스트·lint·Next 빌드·Storybook 빌드를 통과했다. | 전체 mock Next와 격리 브라우저에서 화면, 목적지, 실패 대역과 요청 경계를 확인한다. |
| 2026-11-24 09:38 KST / Codex | 격리된 Preview mock Next 및 Playwright Chromium | [S08-01~05](../../../qa/qna.md#dev-50-local-qa)와 캡처 확인. 첫 검사 대역에서 Google 자체 리다이렉트를 차단한 원인을 확인하고 실제 읽기와 200/503 대역을 나눠 재실행했다. 앱 코드 수정 시도는 0/3회다. | 문서 갱신 점검과 독립 verifier·ai-review를 수행한다. |
| 2026-11-24 09:44 KST / Codex | 작업 브랜치에서 코드·문서 검토 | Python 문서 검사와 `git diff --check ebc7358`, [첫 독립 verifier와 ai-review](../reviews/DEV-50.md) 통과. WBS의 우선순위·선행 조건을 다시 계산했다. | 완료·인계 문서까지 재검토한 뒤 목적별 커밋과 PR을 전달한다. |

## 검증·리뷰·인계 기록

| 구분 | 실행 명령/사례·환경 | 결과 | 증거/미실행 이유 |
| --- | --- | --- | --- |
| 2026-10-27 후보 작성 | 미실행 | 미판정 | 기준선의 과거 결과와 구분 |
| 2026-11-24 개발 검증 | [자동 검사·S08 브라우저](#dev-50-verification) | 링크 범위 통과 | 실제 Mate API와 폼 제출 미실행 |

- 자동 수정 시도: 앱 코드 0/3. 브라우저 대역만 원인 분석 뒤 조정했다.
- Documentation Update Check: [반영한 문서와 보존한 범위](#dev-50-verification)를 확인한다.
- Review Gate: [독립 verifier와 ai-review](../reviews/DEV-50.md)에 결과를 남긴다.
- 커밋/PR: [Git 전달 기준](#dev-50-delivery)을 따른다.
- 다음 작업 인계: [WBS](../README.md)에서 선택한다.

<a id="dev-50-pol-26-handoff"></a>

## 2026-11-24 · POL-26 링크 정책과 다음 첫 행동

[POL-26의 D1/D2](POL-26.md#pol-26-contract)에 따라 인증된 설정과 공개 FAQ의 S08 버튼은 사용자가 지정한 같은 [메이트 의견 폼](https://forms.gle/1ivGbvqpXNcWx5Vy8)으로 연결하는 범위다. 폼은 비로그인 화면에서 열렸으며, 만족도 1~5점 필수와 선택 의견 두 문항을 제공한다. 기존 폼이 입력·제출 결과·응답 관리를 맡는다.

- 첫 행동은 최신 `main`과 S08 [설정·FAQ 소유 소스](POL-26.md#pol-26-evidence)를 확인하고, 두 버튼의 공통 목적지·접근성·복귀 및 검증 범위를 DEV-50 자체 Gate에서 정하는 것이다.
- 링크에는 승인된 URL만 담는다. 계정 정보 전달·자동 채우기·Mate의 제출/저장 경로를 추가하지 않는다. 양쪽에서 같은 목적지가 열리는지와 키보드·모바일·열람 실패의 동선을 확인한다. FAQ 공개 열람과 설정의 인증 경계를 각기 검증한다.
- [POL-26의 D3](POL-26.md#pol-26-contract)에 따라 폼 운영 규칙은 별도 범위다. 관리 권한·보관 기한·중복/스팸과 실제 제출 결과는 미확인이다. 링크 검증에는 폼 공개 화면 열람과 두 진입이 포함된다. [S08 QA 계획](../../../qa/qna.md#pol-26-s08-qa) · [설정 측 진입](../../../qa/my-settings-home.md#pol-26-s08-settings-qa)

[POL-26 종료](POL-26.md#pol-26-close)에서 상위 우선순위의 차단·선행 대기와 DEV-48·49의 조건을 반영해 WBS 표 순서의 첫 적격 P3인 DEV-50을 선정했다. 이번에는 선정 이유와 첫 행동을 인계했다. 구현과 브라우저 QA는 DEV-50의 새 요구사항 Gate에서 시작한다.

<a id="dev-50-brief"></a>

## 2026-11-24 · Implementation Brief와 설계

- **요구사항·성공 기준**. 인증된 `/my`와 비로그인 `/qna`에서 ‘의견 보내기’를 사용하면 사용자 지정 [메이트 의견 폼](https://forms.gle/1ivGbvqpXNcWx5Vy8)이 열린다. 비로그인 `/my`는 기존 로그인과 복귀 안내를 표시한다. 키보드와 좁은 화면에서 링크를 이용하고, 목적지 열람의 성공·실패 뒤 원래 화면으로 돌아올 수 있어야 한다. 링크에는 고정 URL만 사용한다.
- **근거·기존 패턴**. [설정 배너 3259:51803](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3259-51803)와 [FAQ 배너 3259:54426](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3259-54426)는 동일한 문구·버튼을 보여준다. [POL-26의 렌더·소스 대조](POL-26.md#pol-26-evidence)를 사용하며, 시안은 배너 외형과 진입의 근거다. 탭 동작·목적지는 구현 선택과 승인 정책으로 각각 기록한다. [기존 공고 외부 링크](../../../../src/components/bids/bid-detail-content.tsx), [설정 인증 분기](../../../../src/components/my/my-settings-home-client.tsx), [공개 FAQ 조회](../../../../src/app/qna/page.tsx), [데이터 접근 가이드](../../../ai-context/data-access.md)를 확인했다. 전수 Figma 상태·픽셀 비교는 계획 범위 밖이다.
- **수정 파일·영향**. `src/components/feedback-banner.tsx`에 배너 표시와 단일 링크를 묶는다. `src/components/my/my-settings-home-client.tsx`의 인증된 분기와 `src/app/qna/page.tsx`의 공개 FAQ에서 사용한다. WBS·본 기록·두 QA·공통 계획 및 필요한 아키텍처/리뷰 기록에 증거를 남긴다.
- **실행·위험**. 배너의 ‘준비 중’ 상태를 제거하고 기존 토큰·아이콘·반응형 배치를 사용한다. 새 탭을 알리는 접근성 이름과 보이는 키보드 초점을 확인한다. `noopener noreferrer`로 원 탭 접근과 referrer 전달을 제한한다. 폼 장애는 브라우저 탭에서 드러나며 원래 화면에서 같은 링크를 다시 열 수 있다.
- **검증 계획**. Node 22.20.0·pnpm 11.3.0에서 `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm build-storybook`, `git diff --check`를 실행한다. 전체 mock Next 실행에서 [S08-01~05](../../../qa/qna.md#pol-26-s08-qa)에 따라 비로그인·가상 로그인, 데스크톱·모바일 키보드, 폼 공개 열람과 외부 목적지 실패 대역을 확인한다. 링크·네트워크는 비식별 HTTP 메서드·경로·헤더 유무로 확인한다. Markdown·링크·ID·WBS 의존성 및 기존 기록 보존을 검사하고 독립 verifier와 ai-review를 수행한다.
- **범위·가정**. 새 탭은 원래 화면 상태를 보존하기 위한 선택이다. 폼의 입력·제출·응답 관리는 D3에 따른 외부 운영 범위다. 푸터, 서비스 이용안내, 계정·회사 정보 전달, Mate 제출 API와 저장소, 실제 제출·메일·배포는 이 작업 범위 밖이다. 본 링크 연결에 미해결 정책·API 계약은 없다.

<a id="dev-50-verification"></a>

## 2026-11-24 · 검증과 문서 갱신

Node 22.20.0·pnpm 11.3.0을 사용했다. 실행 환경 파일을 복사하지 않은 임시 디렉터리에서 `pnpm install --offline --frozen-lockfile`로 저장소 잠금 파일의 의존성을 설치했다.

| 구분 | 명령·조건 | 결과 |
| --- | --- | --- |
| 자동 계약·구조 | `pnpm test` | 43개 파일, 1,258개 통과 |
| 정적 검사 | `pnpm lint` | 통과 |
| Next 빌드 | `MATE_APP_ENV=preview MATE_DATA_PROFILE=mock pnpm build` | 컴파일·TypeScript·정적 생성 통과 |
| Storybook | 같은 구성의 `pnpm build-storybook` | 통과. 번들 크기 경고가 표시됐다. |
| 브라우저 · 공개 목적지 | Preview 전체 mock `pnpm start` · Playwright CLI | [S08-01~05](../../../qa/qna.md#dev-50-local-qa) 5건 통과. 데스크톱의 설정·FAQ에서 실제 외부 폼은 공개 화면까지 열람했다. 320px/390px의 목적지 상태는 503/200 대역으로 검증했다. |
| 작업 문서 | 로컬 링크·앵커·Markdown, 79개 원본 연결, WBS·의존성·기존 QA 보존, `git diff --check` | 작업 전후 검증 근거를 [리뷰 기록](../reviews/DEV-50.md)에 연결한다. |
| 실제 Mate 통합과 폼 운영 | 실제 OAuth·업무 API, 폼 입력/제출/응답 관리 | 미실행. 승인된 S08은 고정 URL 탐색이다. 링크·열람 통과는 제출/운영 또는 기존 실제 MSET-02의 통과로 집계하지 않는다. |

Documentation Update Check에서 WBS와 작업 기록·설정/FAQ QA, 공통 계획, 공유 배너 위치와 데이터 경계의 아키텍처 설명을 갱신했다. `base.md`는 패키지·스크립트와 해당 실행 규칙에 변화가 없고, `data-access.md`는 Repository 계약·공급원·배포 guard에 변화가 없다. 하네스·예방 규칙은 기존 지침을 사용한다. 기준선과 `coverage.md`의 S08→DEV-50·POL-26 연결은 원본 그대로다.

<a id="dev-50-close"></a>

## 2026-11-24 · 링크 범위 검증 종료와 다음 작업 인계

인증 설정과 공개 FAQ의 S08 링크·키보드·작은 화면·복귀, 두 경로의 외부 폼 공개 열람과 장애 대역을 확인했다. 코드·문서 검증 및 Review Gate 근거를 연결했다. 기존 실제 설정 QA 대기와 외부 폼 제출·운영의 미확인 사항은 해당 기록에서 구분한다. [검증](#dev-50-verification) · [두 리뷰](../reviews/DEV-50.md)

P0~P2의 남은 작업은 차단 또는 미충족 선행이 있고, DEV-48은 보류, DEV-49는 차단이다. DOC-001이 완료된 P3 중 표 순서의 첫 후보인 [POL-27](POL-27.md)을 선정했다. POL-27의 첫 행동은 자체 Gate에서 W01·W02와 현행 GNB를 읽고, 메이트 소식의 발행 주체·콘텐츠 공급원에 관한 기존 승인 근거를 찾는 것이다. 이번에는 선정과 인계만 수행했다.

<a id="dev-50-delivery"></a>

## Git 전달 기준

공통 배너 런타임, 검증·리뷰 문서, WBS 종료와 인계를 목적별 커밋으로 분리한다. [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afeat%2Fdev-50-feedback-link)의 최종 head에서 CI·리뷰·병합 결과를 확인한다. 사용자 예외는 해당 PR의 실제 원인이 확인된 Chromatic 월간 한도에 적용한다. 정상 merge 뒤 로컬 main을 fast-forward하고 원격 SHA 일치와 작업트리를 확인한다.

# DEV-34 · 회사 간 통합 요청 발송·상태

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: G01
- 선행 작업: [POL-16](POL-16.md) / [DEV-28](DEV-28.md)
- 목적/범위: 요청 자격 확인·상대 회사 선택·발송/상태 조회를 연결한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### G01 · 회사 간 통합 요청 발송·상태
- 기준선: UI **메뉴 비활성**, 동작 **미구현**, 데이터 **프론트 계약 없음**. 검증: 코드 대조.
- 남은 점: 회사 소속 신청과 구분하여 미인증/인증 회사 간 팀원·실적 통합 구현
- Figma: [3042:58164](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3042-58164) / [3043:58978](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3043-58978) / [3298:52565](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3298-52565)
- 소유 소스/기존 기록: [src/components/my/my-side-menu.tsx:13](../../../../src/components/my/my-side-menu.tsx)、[src/data/company/contracts.ts:199](../../../../src/data/company/contracts.ts)

## 완료 기준

- [ ] 미인증/인증 조합·자격 팝업·동일 회사·중복/진행 중·오류를 확인한다
- [ ] 요청 상태·권한·새로고침·계정 변경을 검증한다
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

<a id="dev-34-pol-16-handoff"></a>

## 2026-11-20 · POL-16 인계

- [확정 정책과 QA](POL-16.md#pol-16-handoff)의 G01 소유 범위를 따른다. 접근 가능한 같은 사업자번호의 통합 사건을 조회하고 원본의 검토 신청·인증 회사의 최초 제안·원본의 응답에 대한 실제 권한, 개시 원인·기한, 접수와 미확정 상태를 다룬다.
- 종전 후보의 ‘상대 회사 선택’은 서버가 현재 사건에 지정한 회사 확인으로 해석한다. 철회/재발송은 별도 공개 계약 대기이며 [Linear 등록 한도](POL-16.md#pol-16-withdrawal)는 현행 제공 범위의 선행 조건이 아니다. 인증 회사의 전체 거절 상세는 [DEV-37의 계약 선행](DEV-37.md#dev-37-pol-16-handoff)을 따른다.
- 착수 후보에서의 첫 행동은 최신 main 및 G01 [Figma 상태](POL-16.md#pol-16-contract), 동일 company 포트·현재 case API/Swagger·권한/배포 대응을 대조하는 자체 요구사항 Gate다. MERGE-01~04의 합성 사건과 계정, 사용·잔존·복구 승인, 로컬 검증과 실제 QA 조건을 확인한다. 이번 POL-16은 이 인계 기준까지만 제공한다.

<a id="dev-34-investigation"></a>

## 2026-11-20 · 착수 조사

- 09:51 KST에 `feat/dev-34-company-merge`를 `7c2366bee35c3db18afbf385a04693ea9252001f`에서 만들었다. 로컬·원격 main은 일치했고 작업트리는 깨끗했다. [POL-16 #93](https://github.com/mate-pjt/mate-frontend/pull/93)과 [DEV-28 #86](https://github.com/mate-pjt/mate-frontend/pull/86)의 선행 커밋이 main에 포함됐다. 동일 Task의 기존 브랜치나 PR을 찾지 못했다.
- 개발 범위는 G01의 접근 가능한 현재 사건·동일 사건 상세, 원본 검토 신청·인증 회사 최초 제안·원본 응답과 기한·접수 상태다. 정책 근거는 [POL-16 D1~D3](POL-16.md#pol-16-contract)이다. 이번 사용자는 DEV-34 개발과 검증·두 리뷰·목적별 Git 전달·조건 충족 시 정상 병합과 로컬 fast-forward를 승인했다. Chromatic의 월간 한도 문제만 이 PR의 예외다.
- [백엔드 dev 고정 소스](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/companymerge/CompanyMergeController.kt), [같은 SHA의 dev 배포 잡](https://github.com/mate-pjt/mate-backend/actions/runs/44429902651), [개발 Swagger](https://api-test.mate-bid.com/v3/api-docs)를 대조했다. `GET current`의 no-store `204`와 정확한 사건 상세, `POST request`·`proposals`·`proposal-responses`가 계약 범위다. Swagger는 OpenAPI 3.1.0/v1, 184개 경로 중 통합 13개이며 Controller의 `204`와 domain `409` 나열이 생략돼 있다. 실행 중 서버 SHA와 실업무 응답은 확인되지 않았다.
- Figma를 읽기 전용으로 확인했다. [인증 회사](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3042-58164), [미인증 회사](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3043-58602), [작성](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3043-58792), [접수](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3043-58978)·[변형](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3046-53262), [빈 상태](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3175-52303), [인증 회사 거절 상세](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3298-52565)의 구조와 캡처를 대조했다. 마지막 화면은 DEV-37의 사유 조회 계약에 의존한다.
- 실제 MERGE-01~04는 승인된 합성 사건·역할별 소속, 실행 버전 대응과 쓰기·잔존·정리 범위가 필요하다. 해당 자원을 확보하거나 DEV-34에 한정해 로컬 검증·Git 전달을 먼저 진행할 결정을 요청했다. 다음 행동은 이 결정의 범위를 기록하고 착수 Brief를 확정하는 것이다. 이 체크포인트에서 실제 업무 호출과 제품 수정은 미실행이다.

<a id="dev-34-brief"></a>

## 2026-11-20 · 확정 Brief와 착수 체크포인트

| 결정 | 시점·결정자·근거 | 적용 |
| --- | --- | --- |
| G01 현행 사건과 소유 | 2026-11-20 사용자 POL-16 D1~D3. [확정 정책](POL-16.md#pol-16-contract) | 서버가 연결한 두 회사의 현재 사건·신청·제안·응답·상태를 제공한다. 철회·재발송 및 인증 회사의 사건 거절 사유 조회는 각 후속 계약에 의존한다. |
| DEV-34 실제 QA 범위 | 2026-11-20 사용자, 이번 요구사항 Gate 답변 “로컬 검증과 Git 전달 선행, 실제 QA 차단 유지 (추천)” | Next 브라우저·합성 mock·HTTP 대역·자동·문서·두 리뷰 및 승인된 Git 전달을 진행한다. MERGE-01~04 실제는 차단을 보존한다. |
| Git 전달·CI | 2026-11-20 사용자, 이번 최초 요청 | 목적별 커밋부터 최종 head CI/리뷰, 정상 main 병합 및 로컬 FF까지. 이 PR의 Chromatic 월간 한도만 예외다. |

- 성공 기준은 동일 사업자 identity의 서버 지정 쌍, 현재 소속·leaf·capability와 양의 revision, 캐시 없는 현재·정확 상세, 명시적 신청/최초 제안/수락·사유 거절, 보호·응답·검토 기한과 실제 개시 원인의 분리다. legacy 자체 인증과 사건 없음·접근 미확인·오류를 구분한다. 충돌·미확정 뒤 같은 사건 읽기, 중복 무쓰기와 계정/회사/화면 수명을 MERGE-01~04로 확인한다.
- 범위는 `/my/company-merge`와 기존 MySideMenu, `src/data/company` 동일 공급원의 읽기/명령, opt-in HTTP 204, `src/features/company`의 소속·정확 사건 대조와 수명, 합성 mock·집중 회귀 테스트다. 화면의 회사 쌍·작성·접수·빈 상태는 조사한 Figma 구조와 기존 디자인 토큰을 사용한다. 자격 안내·제안 응답·오류는 기존 버튼·팝업 패턴을 적용한다. 레이아웃 전체 예외에 대한 사용자 결정은 없었다.
- 개별 소속 신청·가입 정책과 알림 목적지 정책, 팀원/자료 검토·통합 최종화·인증 회사의 거절 상세·이의제기·문의 명령, 철회·재발송, 중앙 소스·실제 데이터·메일·운영·배포는 이번 제품 작업의 범위 밖이다. 현재 서버 상태를 웹에서 새로 계산하거나 같은 사건을 자동 제출하는 동작도 범위에 포함되지 않는다.
- 구현은 공개 company 포트·HTTP·합성 mock → 기능의 현재 소속/사건·재조회 → 메뉴/화면 → 자동/브라우저와 문서/Context Audit → 두 리뷰 → Git 전달 순으로 진행한다. 위험은 `204`를 접근 권한이 확인된 빈 응답으로 단정, 접수와 실제 이전의 혼동, 이전 계정과 늦은 응답 노출, 유실 응답 재전송이다.
- 검증은 Node 22.20.0 및 pnpm 11.3.0의 `pnpm test`, `pnpm lint`, 격리 API/mock/hybrid `pnpm build`, `pnpm build-storybook`, 실제 Next의 desktop/mobile·키보드·합성 mock·로컬 HTTP 대역, 문서 링크·WBS/원본과 `git diff --check`다. 실제 QA 차단과 Figma 확인 범위를 따로 기록한다.
- 시작 branch/HEAD는 [조사](#dev-34-investigation)와 같다. 착수 전 변경은 이 조사 문서뿐이다. Open question은 현재 로컬 범위에서 해소됐다. 자동 수정 0/3이다. 첫 행동은 company 공개 포트와 현재/정확 상세 매핑 및 명령 관련 검증을 연결하는 것이다.

### 첫 검증 체크포인트

- company 공급원에 현재·exact 조회와 세 명령을 연결했다. 로컬 mock은 원본/인증 회사/대기 제안/legacy 합성 사건과 계정별 탭 저장, Clock 경계를 사용한다. 화면은 같은 회사의 실제 권한과 case revision을 제출 직전 재확인하고 명령은 자동 재전송하지 않는다.
- 화면 진입과 자격·확인 팝업, 발송/응답, 통합 상태, 로그인 복귀와 같은 사건의 조회 전용 재확인을 연결했다. 구현과 집중 회귀 파일을 포함한 격리 복사본에서 자동 검사와 실제 Next 브라우저 검증을 시작한다. 업무 API 미실행, 자동 수정 0/3.

- 첫 자동 실행은 41파일·1,199건 통과, lint는 테스트 대역의 미사용 인자 경고 4건, API/mock/hybrid 빌드는 공용 Button의 미지원 `md`로 타입 검사 실패였다. 자동 수정 1/3으로 지원 규격과 48px 높이, Figma 제목 크기·상태 색상을 적용하고, 대역 타입 인자를 정리했다. 원인 진단에서 이번 테스트의 spread 인자 추론을 같은 회차에서 교정했다. 기존 테스트 파일의 단독 TypeScript 진단은 공식 Next 빌드 결과와 구분한다. 다음 행동은 수정된 파일을 격리 환경에 반영해 자동·브라우저를 재검증한다.

- 첫 재실행은 테스트 1,199건·lint·세 Next 빌드·Storybook을 통과했다. 로컬 브라우저에서 Escape가 작성 내용을 유지하고 제출을 하지 않는 것을 확인했으나 DOM에서 팝업을 먼저 제거해 트리거 대신 body에 초점이 남았다. 자동 수정 2/3으로 닫기 제스처에서 native dialog를 먼저 닫아 초점을 복구한다. 초기 메뉴 클릭 지연은 HMR 뒤 하드 리로드와 실제 키보드 메뉴 이동으로 재확인했다.

- 1920px 실제 작성 화면에서 Figma의 회사 쌍이 동일 폭 3열인 점과 기존 2:1 너비 배치의 차이를 확인했다. 자동 수정 3/3으로 데스크톱 쌍을 3열·최소 114px·40px 화살표에 맞췄다. 작은 화면은 두 회사 명칭과 화살표가 읽히는 가변 배치를 사용한다. 이 단계까지 화면별 정책 문구와 자산의 토큰·위치를 함께 확인했다. 모든 지원 브라우저나 전 상태의 픽셀 전수 검증은 수행 범위에 포함하지 않았다.

<a id="dev-34-verification"></a>

## 2026-11-20 · 자동·브라우저 검증 및 문서 갱신

| 실행 | 최종 결과 | 근거 |
| --- | --- | --- |
| `pnpm test` | PASS, 41파일·1,202건 | 신규 통합 44건. 현재/정확 조회, 입력, 명령 wire, scope·권한·revision, stale·미확정과 Clock 경계 |
| `pnpm lint` | PASS, 경고 0건 | 타입이 지정된 대역으로 첫 경고 4건 교정 |
| `pnpm build` | API·mock·hybrid Preview PASS | 세 격리 환경의 정적 route 목록에 `/my/company-merge` 확인. 기존 CI와 같은 profile·hybrid overrides |
| `pnpm build-storybook` | PASS | 공용 메뉴/Toast 영향 확인. 기존 빌드 도구의 확장자 탐지·번들 크기 안내는 유지 |
| 실제 Next browser | mock·HTTP 대역 PASS | [MERGE-01~04](../../../qa/company-merge.md#dev-34-local-qa), 1920×1080/390×844와 입력·키보드·계정 격리·상태 재확인 |
| 독립 타입 진단 | 기준선 테스트의 기존 오류 5건 | 초기 공식 빌드 실패의 원인 좁히기에 사용했다. `bid-related.test.ts`와 `company-team-invitation-edit.test.ts`의 단독 TypeScript 진단은 기준선에서도 실패한다. 이번 신규 진단은 교정했으며 검증은 위 공식 스크립트에 근거한다. |
| `git diff --check`·문서 검사 | 변경 링크·WBS·원본/범위 보존 확인 | [검토 기록](../reviews/DEV-34.md) |
| MERGE-01~04 실제 | 0통과·4차단 | 이번 사용자 승인과 [재개 조건](../../../qa/company-merge.md#dev-34-local-qa) |

Node 22.20.0·pnpm 11.3.0으로 공식 명령을 실행했다. 자동 수정 3회와 사용자 승인 후 추가 수정 1회의 원인 및 교정은 체크포인트에 있다. 새 런타임·테스트와 문서의 기준은 시작 main이며, 원격 CI/리뷰·병합은 [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afeat%2Fdev-34-company-merge)의 최종 head에서 확인한다.

Documentation Update Check에서 architecture/data-access와 합성 실행 방법, WBS/작업/plan, QA 인덱스·증거, 팝업 수명과 과거 Figma 출력 경계 재발을 갱신했다. package/scripts·하네스 변경 사유는 없다. 원본 G01 매핑과 WBS 의존성은 같아 coverage·baseline은 보존한다.

### 최초 독립 FAIL과 사용자 추가 수정 승인

- 최초 독립 검토 기준은 소스/테스트 diff `c99ed8f78a4ab4f69ac4947277e9d600b242ad56e0500bd79d5e036200c1272e`였다. Major 1건으로 기존 `IN_PLACE_MEMBER_REVIEW`에서 검토 leaf가 없는 활성 구성원의 정상 읽기 응답을 브라우저와 mock이 막은 문제를 확인했다. [서버의 reviewer → source 읽기 분기](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companymerge/CompanyMergeQueryPersistenceAdapter.kt#L130-L175)
- 2026-11-20 사용자가 “이 결함의 추가 수정 1회와 재검증 승인 (추천)”을 선택했다. 자동 수정 3/3 이후의 1회이며 이 읽기 교정, 회귀 검증·두 리뷰와 기존 승인 Git 전달에 적용된다. MERGE-01~04 실제 차단과 이번 Chromatic 예외 범위는 기존 결정이 적용된다.
- `features/company/company-merge.ts`와 mock에서 같은 회사 사건의 안정된 source 읽기를 허용한다. 조회 도중 leaf가 바뀐 동일 회사 응답은 폐기하며, 회사 간 사건의 인증 회사 검토 leaf 및 모든 G01 명령 가드는 유지한다. 합성 회귀와 실제 Next loopback, 공식 스크립트 및 문서 검증을 재실행한다.

- 추가 1/1 이후 `pnpm test` 41파일·1,202건, lint, 세 구성 build, Storybook을 다시 통과했다. 검토 leaf 없는 구형 사건의 읽기/명령 거부와 조회 중 leaf 변경 양방향 3건을 추가했다. 실제 Next의 loopback에서 해당 사건의 current GET과 같은 case의 상세 GET 모두 200, 화면에 명령 0개를 확인했다. [QA](../../../qa/company-merge.md#dev-34-local-qa) · [리뷰 기준](../reviews/DEV-34.md)

<a id="dev-34-close"></a>

## 2026-11-20 · 로컬 검증 종료와 Git 전달 기준

- [x] 현재 회사·사건·권한, 회사 쌍과 자격 팝업, 신청·제안·응답, 오류/중복과 자체 인증을 검증했다.
- [x] 보호·응답·검토 기한과 처리 상태를 구분했고 같은 사건 재조회, 계정/회사 교체 및 새로고침을 검증했다.
- [x] 공식 자동 명령·3구성 빌드·Storybook, 실제 Next mock/HTTP 대역, 문서와 diff-check를 통과했다.
- [x] MERGE-01~04의 실제 업무 0통과·4차단과 재개 조건을 보존했다.
- [x] Documentation Update Check, Context Audit, 읽기 전용 verifier·ai-review를 완료했다. 최초 Major와 추가 승인 1/1 및 재검토 근거는 [검토 기록](../reviews/DEV-34.md)에 있다.

현재·다음·상태는 [WBS](../README.md)에서 확인한다. 앞선 P0/P1/P2 차단·선행 대기를 적용했다. DEV-35는 DEV-08 차단이 선행에 남아 있으며 PREP-01이 충족된 [QA-14](QA-14.md#qa-14-dev-34-handoff)를 다음 하나로 선정했다. 기존 7건과 최신 설정 홈·메뉴·로그아웃/로그인 복귀, 320/390px의 검증 범위를 새 대화의 자체 요구사항 Gate에서 판단한다. 이번에는 선정과 인계를 수행했다.

[작업 브랜치의 GitHub PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afeat%2Fdev-34-company-merge)에서 목적별 commits와 최종 head·CI·리뷰·병합을 확인한다. 검토 뒤 추가한 이 종료 기록과 WBS·QA-14 인계를 커밋 전 두 Gate에서 다시 확인한다. 실제 병합과 로컬 main fast-forward의 SHA 일치 여부는 원격 PR과 종료 보고에서 확인한다.

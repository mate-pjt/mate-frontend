# 기존 미커밋 변경의 검증·main 통합 기록

2026-10-27. 사용자는 PREP-01 전에 기존 미커밋 변경을 보존·검토·검증하고 목적별 작은 커밋(영어 타입·한국어 설명)으로 나눈 뒤 push·main 통합·로컬 main 동기화를 요청했다. 이 작업은 기존 구현의 Git 정리이며 PREP-01 또는 새 제품 기능을 실행하지 않는다.

## 시작 기준과 보존

- 시작 branch/HEAD: `feature/my-company-overview` / `f84af24b5f9d489eb17077113279c795ef1b61f9`.
- 원격 fetch 직후 `origin/main`은 `08b7592`였고 시작 HEAD는 ahead 1/behind 0이었다. 로컬 main은 이전 커밋에 남아 있었다. 해당 head의 열린 PR은 없었다.
- 작업 전 435개 파일 지문·전체 작업트리 압축 사본·기존 diff를 저장소 밖 검증 폴더에 보존했다. `.env`·개인 키·인증 파일은 읽거나 복사하지 않았다.
- 원래 변경된 런타임/테스트/QA 도구/패키지·설정은 그대로 검증한다. 이번 통합 준비로 런타임 코드를 새로 수정하지 않았다. 삭제된 legacy 파일은 이미 작업트리에서 삭제된 상태였으며 커밋에 그 의도를 보존한다.
- 기존 `.playwright-cli/` 로그 5개는 원위치와 지문을 보존하고 `.gitignore`에 추가해 원격 추적 대상에서 제외한다. 기존 `.serena/project.yml` 변경은 별도 설정 커밋으로 보존한다.
- 이번에 추가한 내용은 Git 전달 흐름·고정 시작 프롬프트·이 검토 기록과 관련 WBS 링크, 로컬 QA 산출물 ignore 규칙이다. 79개 고정 기준선 JSON과 기존 99개 작업 정의는 유지한다.

## 이번 실행 검증

환경은 `.nvmrc`의 Node **22.20.0**, pnpm **11.3.0**이다. 기본 쉘 Node와 구분해 명시적으로 실행했다. 테스트/lint는 작업 폴더에서, 빌드는 `.env` 없는 격리 사본에서 수행했다. 격리본의 `node_modules` 루트는 실제 디렉터리이며 기본 Turbopack 빌드를 사용했다. 앱·테스트·도구·설정 220개 파일이 원본/격리본과 동일함을 독립 verifier가 확인했다.

| 검증 | 결과 / 범위 |
| --- | --- |
| `pnpm test` | PASS · 8파일, 62테스트 |
| `pnpm lint` | PASS |
| `pnpm build` · API Preview | PASS · 기본 Turbopack |
| `pnpm build` · 전체 mock Preview | PASS |
| `pnpm build` · hybrid Preview | PASS · company/notifications/notificationSettings만 mock |
| `pnpm build` · API production | PASS |
| `pnpm build-storybook` | PASS · 기존 큰 chunk 경고는 비차단 |
| production mock build | 예상한 exit 1 차단 확인 |
| mock Preview artifact를 production/raw api로 start | 예상한 exit 1 프로세스 종료 확인 |
| 실제 Next + 독립 Playwright | 홈 9카드·가상 로그인·FAQ→공개 목록→상세→hard reload 확인 |
| mock 계정 변경 동작 | 단건 공고 알림 설정·reload 유지, 이메일 ON·reload 유지 확인 |
| 모바일 390px | 수신 설정·미연결 회사 화면의 가로 넘침 없음, 캡처 확인 |
| diff/문서·보존 검사 | 최종 검사 결과를 로컬 `integration-validation.json`에 보존 |

4종 앱 build의 외부 fetch 시도는 0건이다. Storybook build는 외부 fetch 시도 **8건이 QA 가드에 차단**됐다. 주소/본문은 저장하지 않았으며 서버를 포함한 모든 프로세스의 외부 시도 0건으로 확대하지 않는다. mock 브라우저와 mock Next 서버의 요청 집계는 별도로 보존한다. 실제 API mutation·Google/OIDC·회사/OCR·Mailpit 등 기존 실제 통합 QA를 이번 가상 검증으로 통과 처리하지 않는다.

mock Next 서버의 외부 fetch 시도는 0건이고 브라우저도 관찰/차단 모두 0건이다. 브라우저 보조 검사 B04W에서 마이페이지 링크를 button으로 조회한 실행 오류가 있었고, 실제 snapshot의 link 역할로 정정한 B04R이 통과했다. 제품 코드 수정이나 미해결 제품 결함으로 분류하지 않는다. 추가 smoke/390px 결과는 로컬 `browser-cases.jsonl`·캡처에 보존한다. 이 작업이 띄운 QA 서버와 브라우저는 확인 후 종료했다.

## 커밋 분리 계획

| 목적 | 커밋 단위 |
| --- | --- |
| 테스트 실행 기반 | Vitest 의존성·scripts·설정 |
| 공통 런타임 | 공급원 snapshot·HTTP/오류·mock 저장소·배포 guard |
| 도메인 전환 | 인증, 공개 입찰, 정적 FAQ, 회사, 받은 알림, 공고 구독, 개인 필터, 이메일 수신 설정 각각 별도 |
| 이전 구현 정리 | 사용하지 않는 feature API/mock 타입 제거 |
| 개발용 표시 | mock 공급원/공간 초기화 UI |
| 검증 | 계약/격리 테스트와 브라우저 QA 도구 각각 별도 |
| CI | test/lint·공급원별 빌드 workflow |
| 문서 | Repository 문서, 기준선/WBS, Task 시작/Git 전달 문서 각각 별도 |
| 설정 | Serena 설정·로컬 Playwright 산출물 ignore 각각 별도 |

현재 계획은 **20개 신규 커밋**이다. 이미 존재한 회사 화면 커밋은 재작성하지 않는다. 같은 Markdown에 섞여 있는 Repository 이전 설명과 WBS 지침은 index의 내용만 나눠 stage하고 원본 작업 파일 전체 내용은 보존한다. 테스트는 최종 변경 집합을 검증했으며 각 중간 커밋을 독립 검증했다고 주장하지 않는다. 작은 커밋을 유지하는 merge 방식으로 통합한다.

## Context Audit

base/package/scripts·architecture/data-access·하네스/세 Skill·기존 QA 기록을 현재 소스와 대조했다. 이번 전달 문서와 실제 동작을 분리하고 실제 QA 대기/승인 예외를 유지한다. 기존 `DESIGN.md`의 localStorage mock 인증/페이지 메모리 알림 설명은 여전히 Major 사실 드리프트로 DOC-002에 추적한다. 전체 context가 새로 PASS했다고 주장하지 않는다. 이 기존 보완 작업을 실행하거나 원본 기준선의 관찰값을 덮어쓰지 않았다.

## AI Review

### 1. 리뷰 요약

기존 런타임·테스트·CI·문서를 현재 diff/새 파일·실행 증거로 검토했다. 자체 검토와 독립 런타임 verifier는 PASS이며 원래 런타임 내용은 보존됐다. 후속 문서/커밋 분리 및 원격 CI/전달은 해당 단계의 결과를 따로 확인한다.

### 2. 발견된 문제

현재 변경 범위의 신규 Blocker/Major 없음. 기존 DESIGN 문서 드리프트와 79개 보고서의 제품 누락은 WBS에서 유지한다. 로컬 브라우저 로그를 원격에 올리지 않도록 추적 대상에서 제외했다. 뚜렷한 개인키/실제 key/token/서명 URL 패턴은 전달 후보 파일에서 발견되지 않았으나 이를 포괄적 보안 감사로 확대하지 않는다.

### 3. 누락된 검증

실제 계정·백엔드 권한/멱등성·OAuth/CORS·업로드/OCR·메일·원래 실제 API QA는 미실행이다. PREP-01도 아직 실행하지 않았다. 원격 CI는 push 후 실제 head에 대해 별도로 확인하며 로컬 PASS로 대신하지 않는다.

### 4. 문서 갱신 필요 여부

기존 Repository 문서/QA와 기준선/WBS를 커밋에 보존한다. 새 Task 시작 프롬프트·Git 전달 흐름·검증/리뷰 기록을 추가했다. 패키지 버전·구현 규칙·현재 99개 작업 정의는 이번 통합 준비에서 바뀌지 않았다. 원격 PR/CI/최종 main SHA는 실제 GitHub 기록과 최종 보고에서 확인한다.

### 5. 개발자 확인 필요

커밋·push·PR/main 통합·로컬 동기화는 이번 사용자 요청으로 승인됐다. 같은 승인을 다시 요청하지 않는다. 서비스 배포·실제 데이터 변경·필요 정책의 임의 확정은 포함하지 않는다. CI/병합 차단이 있으면 우회하지 않고 실제 원인과 복구/재개 조건을 보고한다.

### 6. 추천 수정 방향

최종 문서/보존·독립 검토 후 목적별 커밋과 push를 수행하고 PR·CI를 확인한다. 모든 병합 조건을 충족하면 main으로 merge하고 로컬 main을 fast-forward로 맞춘다. 다음은 PREP-01이며 자동 실행하지 않는다.

## 독립 검토·최신성

1차 런타임 verifier: PASS, 신규 Blocker/Major/Minor 없음. 6개 HTTP 구현의 기존 API/Reader 경로/응답 보존과 220개 파일 지문, 62테스트·lint·4종 빌드·Storybook·운영 차단·실제 Next 이동/reload 증거를 확인했다. 후속 전달 문서·검증 기록은 별도 freshness 확인 대상이다.

마지막 편집 후 문서/커밋 계획/추적 제외·보존을 다시 검사하고 독립 verifier로 재확인한다. 실제 검토 보고서·단계별 실행 결과는 로컬 검증 폴더에 보존한다. 커밋/push/PR·CI/main 동기화의 최종 성공 여부는 실제 원격 상태와 마지막 보고를 따른다.

## 로컬 증거 위치

`/Users/jisung/.codex/visualizations/2026/10/27/01a17bb3-2941-7682-bac6-d4022d74657c/mate-main-integration`

`before.json`, `worktree-before.zip`, `before.patch`, `test.log`, `lint.log`, `build-results.json`, 각 build/start 로그, `browser-cases.jsonl`, `runtime-review.txt`, `integration-validation.json`, `commit-plan.json`/실제 커밋 기록, PR/CI·최종 동기화 결과를 단계별 보존한다. 이 폴더는 저장소에 포함하지 않으며 비밀/개인 데이터는 증거에 남기지 않는다.

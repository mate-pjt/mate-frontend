# POL-06 · 소스 정책 문서 검증 / Review Gate

대상: 시작 `0fd43142e81d650a3dbcb190cdcc6fece133bbda` / `docs/pol-06-company-dashboard-contract`의 Markdown6파일. 원본 단일 Task 요청·[사용자3결정/Brief](../tasks/POL-06.md)·[고정 소유 근거](../tasks/POL-06.md#pol-06-sources)와 실제 frontend/Backend source를 대조한다. 소스 정책, 제품 구현, 배포 확인/실제 통합, Git 전달을 각각 구분한다.

## 검증 근거

- 소유 원문23개는 ref/path/blob 지문과 본문을 로컬 snapshot에 보존하고 **23/23 Git blob 일치**를 확인했다. branch/commit SHA를 현재 배포 증명으로 사용하지 않는다.
- 문서 checker는 상태열 파서 최소 수정1회 후 15/15, 의존 DAG/M04 검사를 포함한 **17/17 PASS**, 종료/다음 Task 검사까지 **19/19 PASS**·`git diff --check` PASS를 확인했다. 검사 대상: 로컬 링크/anchor, 원본79개/Task99개·매핑/선행·단일 상태 권위, 타96개 WBS행·기준선/coverage5파일·기존 QA/DEV-08 prefix·무관 파일 보존과 `git diff --check`. 종료 diff freshness는 아래 로컬 산출물에서 다시 확인한다.
- 현재 package8 scripts·pnpm11.3.0/Node pin22.20.0, shell Node26.5.0을 직접 확인했다. 실행 코드/패키지/빌드 영향이 없는 Markdown 작업으로 로컬 pnpm test/lint/build/build-storybook·Next/브라우저는 미실행한다. 원격 PR head CI와 별도 증거다.
- 신규 CDASH-01~12는 **실제0통과·12차단·실행0건**이며 로컬 mock/HTTP 대역/브라우저도 미실행이다. 기존 QA-05 MCO4통과·6차단/AUTH-07·08 및 타 Task 정책/QA 차단·예외는 보존한다. 앱/API 로그인·mutation·fixture 생성·서비스 운영/배포0건이다.

## ai-review

### 1. 리뷰 요약

사용자3답변으로 확정한 소스 정책 범위에 맞춰 업종별 시공능력/대표 파생 상태·인증3종·저장 실적6연도·회사 희망금액과 결측/0/UNKNOWN/NO·provenance·권한 차이를 기록했다. 가입 모델 재사용 한계·배포 미확인·DEV-08 필수 자원 차단/로컬 예외 없음·신규 QA와 기존 이력을 구분한다. 문서17검사와 종료19검사/diff-check를 통과했고 실제6파일 diff와 신규 검토파일·종료/WBS 변경을 primary가 재검토해 ai-review PASS로 판단했다. 독립 verifier1도 PASS·Blocker/Major/Minor0이다. 이후 종료/WBS 기록 변경의 문서 검사/primary ai-review와 최종 verifier freshness를 아래에서 확인한다.

### 2. 발견된 문제

- 현재6파일 diff의 미해결 Blocker/Major/Minor 없음. source/DTO/Repository·운영 guard/저장소/업로드·스타일/하네스·의존성은 변경하지 않았다. 실제 diff/문서 검사 결과에 문제가 있으면 기록하고 최소 수정한다.
- 잔여 한계: Backend Controller의 ADMIN 주석과 실제 정보조회 leaf 검사가 다르므로 service/권한 소유 소스를 우선했다. 기본 응답의 primaryIndustries/updatedAt·대형 정수 처리와 단일 가입 모델 차이는 DEV-08 Gate에서 실제 DTO/배포와 재확인한다. 이번 문서에서 런타임 문제를 고쳤다고 주장하지 않는다.

### 3. 누락된 검증

로컬 앱 scripts·mock/HTTP 대역·브라우저 및 실제 서버 통합은 미실행이다. 전자는 문서 전용 대체 검증, 후자는 사용자 자원 미준비에 따른 DEV-08 필수 차단이다. 기존 QA 이력과 새12사례를 PASS로 바꾸지 않는다. 실제 PR head 원격 CI/병합 조건은 Git 전달에서 별도 확인한다.

### 4. 문서 갱신 필요 여부

Task/WBS·DEV-08 인계·회사 QA 계획·plan 날짜별 진입점·본 검토6파일을 갱신했다. 현행 코드/스크립트/구조/데이터 규칙/하네스가 바뀌지 않아 base/architecture/data-access/harness 갱신은 불필요하다. 새 반복/고위험 수행 사건의 근거가 없어 ai-failures 추가도 불필요하다. baseline/coverage는 원본 매핑/범위가 그대로여서 보존한다.

### 5. 개발자 확인 필요

본 정책에는 추가 질문 없음: 사용자3답변이 범위를 확정했다. DEV-08은 [재개 표](../tasks/POL-06.md#pol-06-handoff)의 배포/실행 대응·권한별 합성 자원/경계 자료·사용/잔존/복구·안전한 오류/해제와 자체 Brief가 필요하다. 로컬 구현 선행 예외/실제 API 사용·mutation은 이번 Git 승인에 포함되지 않는다. 역할만 확인했고 개인 담당은 미정이다.

### 6. 추천 수정 방향

문서 검사·read-only verifier/ai-review freshness 확인 후 정책/인계·QA 계획과 종료/검토 증거를 목적별 커밋으로 전달한다. DEV-08 차단과 기존 예외를 보존하고 P2 표 순서상 첫 독립 DOC-001 선행을 충족한 POL-07 하나를 다음 Gate로 선정했다. 최신 main/Git·POL-07 체크포인트/L07~L10·현행 목록/필터/URL과 소유/배포 계약 조사부터 새 대화로 인계한다. 이번 대화에서 다음 Task를 시작하지 않는다.

## Context Audit Report

### 결론

PASS — POL-06에 필요한 현행 코드/문서/하네스의 정합성을 읽기 전용으로 감사했다. 중앙/Backend의 더 넓은 현재 조회 계약과 frontend 미구현의 차이는 Task가 다루는 제품 공백이며, 현행 frontend를 설명하는 문서의 사실 불일치와 구분한다. 전체 과거 Task 재감사/기존 차단 해소는 아니다.

### 확인한 코드베이스 사실

Next16.2.9/React19.2.4·pnpm11.3.0·8 scripts·lockfile9.0/.nvmrc22.20.0, 7개 Repository 그룹과 public client/server 경계·immutable snapshot/hybrid/production guard·계정별 탭 저장소/opaque upload handle, 세 Skills/verifier/config placeholder를 확인했다. 실제 테스트하지 않은 환경을 앱 PASS로 기록하지 않는다.

### 문서별 정합성 점검

#### base.md

package/lockfile·scripts·Node pin/CI와 일치한다. 독립 type-check/format은 없다. shell Node26.5.0은 pin과 다르며 로컬 앱 검증을 실행하지 않았다. 실행 사실/규칙 변화가 없어 수정 불필요하다.

#### architecture.md

app/data/features·회사 contracts/client→HTTP/mock·my-company-client/가입 UI의 역할 및 기본-only overview 설명과 현행 소스가 일치한다. 추가 확정 조회/복수 모델은 이번 정책/미구현 인계로 구분한다. 구조/토큰/라우팅 변경 없음.

#### data-access.md

7개 그룹·혼합 제약/빌드 snapshot·운영 guard·자동 fallback 금지·현재 overview·계정/탭 저장소와 upload handle 경계를 관련 소스에서 확인했다. 신규 Repository/DTO를 이번에 구현하거나 현재 계약인 것처럼 추가하지 않았다. mock/HTTP 대역/실제 통합을 분리한다.

#### plan.md

현재/다음/상태는 WBS 하나가 소유한다. POL-06 소스 정책과 DEV-08 필수 차단의 날짜별 링크를 추가하고 기존 구현/QA 이력·원본79개 매핑을 유지한다. 후속 상태/freshness는 문서 checker로 확인한다.

#### harness.md

AGENTS·feature-workflow/context-audit/ai-review·verifier 역할·placeholder config의 요구사항 Gate/문서 전용 검증/두 리뷰·후속 변경 재검토 규칙과 일치한다. 일반 worker 위임이나 하네스 변경 없음.

#### ai-failures.md

과거 인증 로그/query·Git 작성자 metadata 출력 예방 규칙을 적용했다. GitHub 응답은 먼저 파싱해 관련 정책/소스 본문 및 SHA/권한/CI 상태 등 허용 필드만 추출한다. `.env`·인증정보·개인자료/업무 응답을 열람하지 않았다. 이번의 patch 문맥 불일치는 적용 전 실패 후 재적용한 편집 도구 사건이며 소스/타 작업 변경이나 검증 PASS 위조가 아니다. 반복/고위험 사고로 확대 기록할 근거는 없다.

### 발견된 불일치

선택 범위에서 새 Major/Minor 사실 불일치 없음. Backend의 주석과 실제 검사 차이는 위 정책 근거에 명시했고 외부 소스 수정은 범위 밖이다. 배포 미확인/자원 부족은 문서 드리프트가 아니라 DEV-08 재개 조건이다.

### 개발자 확인 필요 사항

POL-06 정책3결정은 확보했다. DEV-08 자원/승인/담당 개인은 미확보이며 후속 Gate에서 확인한다. 원격 Git 전달은 이미 승인돼 반복 확인하지 않는다.

### 추천 수정 방향

실행 코드와 공통 하네스는 보존하고 이번6개 문서의 검증/Review Gate를 마친다. 미래 구현/배포 완료를 현재 설명에 섞지 않는다.

## 독립 verifier / 검토 freshness

read-only verifier1은 `.codex/agents/verifier.toml`에 따라 원본 요청·사용자3답변·실제 status/diff·소유 snapshot·package·검증 결과를 독립 확인해 **PASS·Blocker/Major/Minor0**를 반환했다. 읽기 전용 자체 검사로 source23 blob·기준선/coverage5파일·기존 prefix·WBS99/타97행·신규CDASH12개를 확인했고 파일 수정은 없었다. 원 보고서 요약/검토 SHA256은 로컬 `verifier-1.md`에 보존했다. 검토 후 종료/WBS/문서가 바뀌면 영향 문서 검사·primary ai-review와 verifier를 다시 수행한다. 종료 문서 변경 뒤 문서 checker19/19·primary ai-review 여섯 섹션을 재검토했으며 최종 verifier freshness를 요청한다. 최종 결과는 로컬 `review-freshness.json`과 PR/최종 보고에서 확인한다. 최종 수행 전 재검토 PASS를 선기록하지 않는다.

로컬 근거: [검사 스크립트](/Users/jisung/.codex/visualizations/2026/11/09/01a1bed3-03bb-77e1-afbf-d730920f7a02/pol-06/validate_docs.py), [소유 원문 snapshot](/Users/jisung/.codex/visualizations/2026/11/09/01a1bed3-03bb-77e1-afbf-d730920f7a02/pol-06/source-contract.json), 같은 폴더의 `document-check.json`·`source-integrity.json`·verifier 보고서·Git delivery receipt. 자기 commit SHA/병합 결과를 문서에 재기록하는 순환을 피하고 최종 Git 증거는 PR/로컬 receipt/최종 보고에서 확인한다.

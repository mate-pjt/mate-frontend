# POL-05 · 소스 기준 정책 검증 / Review Gate

대상: 시작 `a0f27e2f29afa58b464f0403eff9f5559a984ec2` / `docs/pol-05-notification-signal-contract`의 Markdown6파일 diff. 원본 단일 Task 요청·[요구사항/사용자3결정](../tasks/POL-05.md)·[고정 소유 원문](../tasks/POL-05.md#pol-05-sources)과 현재 frontend 소스를 대조한다. 소스 정책 확정과 배포/실제 통합을 구분한다.

## 검증 근거

- 문서 checker1차 **14/14 PASS**, 링크316/anchor 누락0, 원본79/Task99·N04 매핑/선행·타96 WBS행·기준선/coverage5파일·기존 QA/DEV-07 prefix·무관456 tracked 파일 보존. 이후 종료 문서 변경에는 동일 검사/두 리뷰 freshness를 다시 적용한다.
- `git diff --check` PASS. 외부 checker와 결과는 아래 산출물에서 확인한다. 새 case NSIG-01~12는 계획이며 **실제0통과·12차단**, 로컬 mock/HTTP/transport 대역도 미실행이다.
- package8 scripts·pnpm11.3.0/Node pin22.20.0과 shell 기본 Node26.5.0/Python3.14.6을 직접 확인했다. Markdown 전용으로 로컬 pnpm test/lint/build/build-storybook·Next/browser는 실행하지 않았다. 원격 CI 결과는 Git 전달에서 별도 확인한다.
- 앱/API/WS 연결·fixture/알림 생성·읽음 mutation·운영/배포0건. backend 로컬은 다른 HEAD/IDE 변경을 보존했고 원격 commit object 부재 시 GitHub 고정 ref로 소스만 확인했다. source main/dev의 WS configuration/인증 파일 blob만 같음을 확인했으며 전체/배포 동일성으로 확대하지 않았다.

## ai-review

### 1. 리뷰 요약

소스 정책 문서 범위 적합. 변경 신호와 REST 원본, 승인된 합치기/간격·재연결·펼친 목록 보존, 인증/계정 수명·실패/복구·공급원 경계를 명시했다. DEV-07 구현·실제 통합은 시작하지 않았으며 배포/자원 필수 차단과 기존 QA/정책 이력을 보존한다. 독립 verifier1도 PASS·Blocker/Major/Minor0이다. 종료 기록과 목록 전체 교체 조건 명확화 뒤 primary가 원본/현재 diff·문서 검사를 재검토했으며 아래 최종 verifier freshness를 추가 확인한다.

### 2. 발견된 문제

- 현재 diff의 미해결 Blocker/Major/Minor 없음. 실행 코드·API DTO·공급원/빌드 snapshot·운영 guard·계정 탭 저장소·업로드 경계는 변경하지 않았다. 기존 폴더/스타일/의존성/하네스·무관 작업 보존을 확인했다.
- 잔여 한계: source 계약은 배포 지원 증명이 아니다. listener 신호만 유실되고 연결이 유지되면 polling 없는 v1은 다음 복귀/재조회까지 지연될 수 있다. offset 페이지의 동시 변경에 원자적 snapshot/무누락을 약속하지 않는다. 이 한계를 정책/QA에 공개했다.

### 3. 누락된 검증

로컬 앱 명령·브라우저·mock/HTTP/transport 대역 및 실제 WS/REST 통합은 미실행이다. 전자는 Markdown 전용으로 대체 검증을 적용했고, 후자는 사용자 자원 미준비로 DEV-07의 필수 Gate 차단이다. 기존 ANAV-01~10/ALARM·QA-11 실제 차단을 통과 처리하지 않는다. Git 전달의 실제 head CI는 아직 별도 확인 대상이다.

### 4. 문서 갱신 필요 여부

Task/WBS·DEV-07 인계·알림 QA 계획·plan 진입점·본 검토 기록을 갱신했다. 실행/패키지/구조/계약 구현/하네스 변화가 없어 base/architecture/data-access/harness 갱신은 불필요하다. 새 반복/고위험 수행 사건의 근거가 없어 ai-failures 추가도 불필요하다. 고정 baseline/coverage·나머지 Task의 정의/QA 이력은 보존했다.

### 5. 개발자 확인 필요

소스 정책 결정의 추가 질문 없음: 사용자3답변이 범위를 확정했다. DEV-07 재개에는 배포/schema/version·실행 SHA 대응·Origin/upgrade·disposable2계정/신호·사용/변경/이력 잔존·복구·안전한 오류 해제가 필요하다. 해당 Task의 로컬 구현 진행 예외/새 라이브러리/실제 mutation도 별도 Gate 사안이다. Git 전달은 이번 요청에서 승인됐으므로 반복 확인하지 않는다.

### 6. 추천 수정 방향

종료 diff의 문서 검사·read-only verifier를 확인한 뒤 목적별 문서 커밋/PR·실제 head CI/병합 조건·main FF를 수행한다. 다음은 P1 표에서 배포/자원 미준비 DEV-07을 차단으로 보존하고 독립 DOC-001 선행을 충족한 POL-06의 요구사항 Gate 하나만 선정한다. 정책/다음 기능 구현은 이 대화에서 추가하지 않는다.

## Context Audit Report

### 결론

PASS — POL-05에 필요한 현행 코드/문서/하네스 정합성을 읽기 전용으로 감사했다. 전체 과거 Task 재감사나 기존 정책/실제 QA 차단 해소를 뜻하지 않는다. 감사 자체에서 source/하네스 수정은 하지 않았다.

### 확인한 코드베이스 사실

Next16.2.9/React19.2.4·pnpm11.3.0·8 scripts·lockfile9.0/.nvmrc22.20.0, 7개 Repository source와 public client/server 경계, immutable snapshot·hybrid/production guard·계정별 탭 저장소·upload handle, 실제3 Skills/verifier/config placeholder를 확인했다. shell Node26.5.0은 pin과 다르므로 앱 검증 환경으로 사용/통과했다고 기록하지 않는다.

### 문서별 정합성 점검

#### base.md

package/lockfile·scripts·Node pin/CI와 일치. 독립 type-check/format script를 만들지 않았다. 문서 전용 검사 미실행 이유를 별도 기록했으며 base 수정 불필요.

#### architecture.md

notifications client/contracts→HTTP/mock·AlarmPage/Bell·activation-controller와 현재 app/data/features 구성이 일치한다. 아직 원격 신호 구독 구현이 없는 사실과 새 정책을 분리한다. 구조/토큰/DTO 경계 변경 없음.

#### data-access.md

7개 source/client/server·혼합 제약·snapshot/배포 guard·세션/저장소/account namespace·opaque upload handle 관찰과 일치. 실제 wrapper/실패 전파·actionPath POL-04와 로컬/실제 통합 분리는 유지한다. DEV-07의 확정 정책은 Task로 인계하고, 아직 구현하지 않은 새 Repository API를 현행 규칙으로 쓰지 않는다.

#### plan.md

현재/다음/상태의 권위는 WBS 하나다. 날짜별 기존 구현/QA 기록을 보존하고 POL-05 소스 정책/DEV-07 필수 차단 링크를 추가했다. 원본79/Task99/coverage와 다른 선행 차단은 그대로다.

#### harness.md

AGENTS·세 Skills·verifier 역할·placeholder config의 요구사항 Gate/문서 전용 검증/두 리뷰·후속 변경 재검토와 일치. 일반 worker 위임이나 harness 수정은 없다.

#### ai-failures.md

인증 로그/query·Git 작성자 metadata 원문 출력 예방 규칙을 적용했다. GitHub 파일은 관련 정책/소스와 SHA/URL만, 원격 상태는 필요한 필드만 추출한다. 환경파일/비밀값/개인정보는 읽거나 출력하지 않는다. 로컬 git object 부재는 소유 고정 ref 조회로 해소한 조사 한계로 Task에 남겼다.

### 발견된 불일치

POL-05 범위의 미해결 Major/Minor 사실 불일치 없음. shell 기본 Node와 프로젝트 pin 차이는 실행 환경 관찰이며 package/문서를 임의 변경할 근거가 아니다. 배포/QA 자원 공백은 코드/문서 사실 불일치와 구분한다.

### 개발자 확인 필요 사항

DEV-07의 [재개 표](../tasks/POL-05.md#pol-05-handoff) 자원·승인·역할은 미확보. POL-05의 소스 정책 판정으로 충족됐다고 간주하지 않는다.

### 추천 수정 방향

현재 범위의 문서 검증/두 리뷰만 마치고 소유 정책·실제 구현·배포 근거의 경계를 유지한다. 다음 Task는 WBS가 선정하며 자동 착수하지 않는다.

## 독립 verifier / 검토 freshness

read-only verifier1: 승인된 소스 정책 범위 PASS·Blocker/Major/Minor0. 원본/사용자3결정·git status/diff·package·관련 소스·기존 QA/DEV-07 prefix·신규12차단과 소유 snapshot7개 전체 blob SHA를 독립 확인했다. 이후 WBS/체크리스트/종료 기록과 모든 유효 page 성공 뒤 목록 교체 문구를 명확화했으므로 같은14항목 검사·primary ai-review 여섯 섹션을 다시 확인하고 verifier freshness를 재요청한다. 최종 도구 결과는 로컬 `review-freshness.json` 및 PR/최종 보고에서 확인한다. 실제 보고 전 재검토 PASS를 선기록하지 않으며 이후 소스/문서 변경이 생기면 해당 검토를 다시 수행한다.

로컬 근거: [문서 검사](/Users/jisung/.codex/visualizations/2026/11/09/01a1bebf-fc49-7981-abea-c99255090702/pol-05/document-check.json), [소유 소스 snapshot](/Users/jisung/.codex/visualizations/2026/11/09/01a1bebf-fc49-7981-abea-c99255090702/pol-05/source-contract.json). 검토/Git의 최종 receipt·PR/CI는 자기 commit SHA를 문서에 재기록하는 순환을 피하기 위해 로컬 산출물과 PR/최종 보고에서 확인한다.

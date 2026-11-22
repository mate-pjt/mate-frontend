# POL-22 · 문서 검증과 Review Gate

[Task 및 승인](../tasks/POL-22.md#pol-22-brief) · [확정 정책](../tasks/POL-22.md#pol-22-contract) · [WBS](../README.md)

## 문서 검증 · 2026-11-23 KST

| 검사 | 범위와 결과 |
| --- | --- |
| `python3 /tmp/mate-pol22-20261123.k5PMKm/validate_docs.py --phase 리뷰` | 임시 읽기 전용 스크립트로 시작 SHA 대비 새 로컬 링크·앵커, Markdown, 원본 79개·WBS 작업 114개·선행 연결 156개, ID·상태·집계, 첫 선택 가능 후보, 기준선·감사·연결표 및 기존 QA를 검사했다. 문서 7개·로컬 링크/앵커 49개 PASS. 종료 단계에서는 같은 검사로 완료·인계의 상태도 검증한다. |
| `git diff --check` | 시작 SHA 대비 Markdown 공백·충돌 표시 검사 PASS. |
| 소유 근거 확인 | 중앙 ADR과 Backend dev 소스를 고정 SHA로 조회했다. 개발 OpenAPI와 배포 기록 확인 수준, 실행 식별자와 실제 업무 응답 미확인을 [Task](../tasks/POL-22.md#pol-22-sources)에 구분했다. |
| 앱과 실제 QA | Markdown 전용으로 로컬 `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm build-storybook`, 브라우저를 실행하지 않았다. mock/HTTP 대역과 실제 업무 API도 미실행이다. [CIMP 10건 계획](../../../qa/personal-bid-filter.md#pol-22-company-import-qa)과 기존 QA-10 실제 12차단을 보존한다. PR 원격 검사는 별도로 확인한다. |

<a id="pol-22-context-audit"></a>

## Context Audit Report

### 결론

**WARN**. POL-22 적용 범위에서 Major 불일치는 없다. 기존 공급원 요약의 Minor 한 건과 후속 서버 계약의 소유 결정을 확인했다.

### 확인한 코드베이스 사실

- `package.json`의 Next 16.2.9, React 19.2.4, Vitest 4.1.11, pnpm 11.3.0, lockfile 9.0과 `.nvmrc` 및 CI의 Node 22.20.0 pin을 확인했다. 검증 쉘은 Node 26.5.0, pnpm 11.3.0, Python 3.14.6이다.
- 계정 개인 필터는 현행 `personalFilters` 그룹의 공개 GET/PUT/reset을 사용한다. 현재 웹의 `내 맞춤`은 최신 조회와 URL 적용이다. 서버의 import POST와 신규 기능 정책·이후 계약 조건은 공개 프론트 계약과 구분된다.

### 문서별 정합성 점검

| 문서 | 관찰 |
| --- | --- |
| `base.md` | 패키지, lockfile, 실제 8개 script와 `type-check`/`format` 부재, 개발/CI 고정 버전이 일치한다. |
| `architecture.md` | 기존 App Router와 UI/공개 Repository/HTTP·DTO·mock 경계, 기존 자산·token 경계가 해당 소스와 일치한다. |
| `data-access.md` | 7개 공급원, auth/bids 조합, 불변 snapshot·운영 mock guard·계정별 `sessionStorage`·opaque upload를 확인했다. 현행 개인 필터·UI·QA 경계 설명은 소스와 맞는다. 아래 알림 요약의 Minor는 기존 내용이다. |
| `plan.md` | WBS 단일 상태, 원본 L11·POL-22/DEV-45/QA-10 연결과 최신 DEV-09/DEV-63 이력에 맞는다. 새 정책과 QA 계획의 진입 링크를 추가했다. |
| `harness.md` | 세 Skill과 `verifier.toml`이 존재한다. `.codex/config.toml`은 설정 placeholder이고 기존 Gate 설명을 적용한다. |
| `ai-failures.md` | 이번 문서 검토에서 새로 추가할 반복 실패 근거가 없다. 과거 실수와 예방 기준은 그대로 읽었다. |

### 발견된 불일치

- **Minor · 기존 요약 누락.** `data-access.md` §3의 `notifications` 행은 받은 알림 조회·미확인 수·읽음을 나열하고 수동 삭제를 누락했다. 같은 문서 §6과 §8에는 DEV-43 삭제가 기록돼 있다. 이번 POL-22 변경 범위와 독립적이므로 해당 요약을 갱신하는 별도 문서 변경에서 처리할 수 있다.

### 개발자 확인 필요 사항

DEV-45에서 정책·백엔드 소유자가 가져오기 권한, 합치기 접근, 확인 당시 회사와 요청의 소속 일치 및 전부 결측 시 무변경 응답을 확인해야 한다. POL-22의 사용자 D1~D3 결정은 확보했다.

### 추천 수정 방향

정책의 재개 조건과 실제 QA 계획을 현행 소스의 구현 설명과 구분한다. 백엔드의 소유 계약 또는 실행 환경이 바뀌면 DEV-45 자체 Gate에서 확인한다.

## 독립 read-only verifier

| 항목 | 첫 검토 결과 |
| --- | --- |
| Result | **PASS** |
| Summary | D1~D3와 백엔드/프론트 소스 수준이 일치한다. DEV-08, QA-10의 기존 차단을 보존했고 DEV-64는 선정·인계만 다룬다. |
| Issues | Blocker·Major 없음. Minor 한 건은 확인 시점과 서버 최초 소속 조회 사이의 간격이다. 개인 `expectedVersion`과 서버 잠금 뒤 재검사만으로 이 간격을 보호하지 못한다. DEV-45의 계약 선행과 CIMP-08에 명시해 반영했다. |
| Verification | `git status --short --branch`, `git diff --check 67c8b19`, 문서 검사 `--phase 리뷰` 결과를 재현했다. 런타임·패키지와 무관하여 로컬 앱 실행·실제 업무 API는 미실행이다. |
| Documentation Update Check | 작업 기록·WBS·후속 조건·인계·공통 계획·QA 계획을 확인했다. |
| Review freshness | 첫 PASS는 `67c8b19` 대비 리뷰 단계 Markdown에 적용된다. 소속 경계 보완과 종료 WBS를 포함한 전체 diff를 독립 verifier와 ai-review로 다시 확인한다. 최종 head 기준 결과는 PR·종료 보고에 연결한다. |
| Developer follow-up | POL-22에 추가 사용자 결정은 없다. DEV-45 실행 전 권한, 동일 소속 확인, 전체 결측 응답, 실행 버전 및 승인된 QA 자원을 확보한다. |

## ai-review

### 1. 리뷰 요약

사용자 결정, 중앙 ADR, 소유 소스와 게시 명세를 대조했다. Markdown 7개에 한정되며 프론트 공개 Repository·DTO·타입·UI·공급원·업로드와 실행 설정에 영향이 없다. 정책·후속 개발·실제 QA의 판단 근거가 구분된다.

### 2. 발견된 문제

미해결 Blocker·Major 없음. 독립 검토의 Minor 한 건은 확인과 서버 최초 조회 사이의 소속 변경을 DEV-45의 서버 계약·QA 조건에 명시했다. `context-audit`의 기존 알림 표 Minor는 POL-22 범위 밖이다.

### 3. 누락된 검증

문서 필수 검증은 통과했다. 로컬 앱/브라우저, mock/HTTP 대역, 실제 업무 API 및 새 Figma 렌더링은 이번 문서 작업에서 실행하지 않았다. 실서버 실행 식별자는 미확인이고 CIMP 10건은 미실행이다. 기존 QA-10의 실제 12차단을 보존한다.

### 4. 문서 갱신 필요 여부

정책·WBS와 인계, DEV-45 재개, 개인 필터 QA와 공통 계획·검토 기록을 갱신했다. L11 연결과 기준선·감사·기존 QA 이력을 보존했다. `base.md`·`architecture.md`·`data-access.md`·`harness.md`·`ai-failures.md`의 이번 변경은 필요하지 않다.

### 5. 개발자 확인 필요

이번 정책 결정 D1~D3는 완료했다. DEV-45에서 소유자 확인과 실행/자료 사용 범위를 자체 Gate로 확인한다. 이 기록은 앱 기능 활성화, 실제 QA 또는 외부 업무 변경 승인을 부여하지 않는다.

### 6. 추천 수정 방향

DEV-45의 권한·전체 결측·소속 변경 계약을 확보한 뒤 승인 화면과 실서버 검증을 준비한다. DEV-64는 자체 요구사항 Gate에 필요한 첫 행동을 인계했다. 종료 diff·최종 head 검증은 [Git 전달 체크포인트](../tasks/POL-22.md#pol-22-delivery)를 따른다.

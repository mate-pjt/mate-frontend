# POL-28 · C03 정책 문서 검증과 Review Gate

- 날짜와 기준점은 2026-11-24 KST, `docs/pol-28-canonical-og-policy`의 시작 HEAD `404ba20`이다. [현행 소스와 조사 근거](../tasks/POL-28.md#pol-28-evidence) · [요구사항과 승인](../tasks/POL-28.md#pol-28-brief)
- 검토 범위는 D1의 운영 주소 보류, D2·D3의 승인 범위, DEV-53 재개 조건과 DEV-54 선정이다. [결정 원문과 적용 범위](../tasks/POL-28.md#pol-28-contract) · [전달 범위](../tasks/POL-28.md#pol-28-delivery)

## Context Audit Report

### 결론

**WARN**. POL-28의 관련 소스와 공통 문서의 기술 사실을 대조했다. 정식 운영 주소와 운영 환경의 대응은 제품·배포 책임자 확인이 남아 있다.

### 확인한 코드베이스 사실

- `src/lib/site.ts`의 URL 설정을 루트 `metadataBase`가 해석한다. 공개 페이지 헬퍼에는 canonical·OG·X의 텍스트와 URL 필드가 있고 공유 이미지 연결은 미확인이다. 기존 로그인 필요 화면에는 `noindex` 설정이 있다. [현행 비교](../tasks/POL-28.md#pol-28-evidence)
- [package.json](../../../../package.json)의 스크립트 8개, Next.js `16.2.9`, pnpm `11.3.0`과 `.nvmrc`의 Node `22.20.0`을 확인했다. 셸 기본 Node는 `26.5.0`이고 저장소 pin `22.20.0`도 로컬에서 실행해 확인했다. 독립 type-check와 format 스크립트는 없다.

### 문서별 정합성 점검

| 문서 | 확인한 사실 |
| --- | --- |
| [base.md](../../../ai-context/base.md) | 스크립트·패키지·lockfile 9.0·Node pin이 소스와 일치한다. 환경변수는 이름과 소스에 적힌 예시 값만 확인했다. |
| [architecture.md](../../../ai-context/architecture.md) | App Router 루트와 사이트 설정 후보, `src/lib`의 메타데이터 폴더 설명은 현행과 일치한다. 정식 주소 TODO에 승인 원문과 후속 검증을 연결한다. |
| [data-access.md](../../../ai-context/data-access.md) | 일곱 공급원 식별자와 환경 판정 및 운영 mock guard의 존재를 확인했다. API/DTO, 권한 검사, 공급원과 기존 데이터 QA는 이 문서 변경 범위에서 유지한다. |
| [plan.md](../../../ai-context/plan.md) | 기존 상태 목록은 이력이고 최신 상태·다음 작업은 WBS에 있다. C03과 DOC-001 선행을 추적하고 공통 계획에 승인 사건을 추가한다. |
| [harness.md](../../../ai-context/harness.md) | 세 스킬, verifier 역할과 프로젝트 placeholder 설정을 확인했다. |
| [ai-failures.md](../../../ai-context/ai-failures.md) | Figma는 프레임 크기와 공유 그림, GitHub는 SHA와 배포 상태, Linear는 관련 키워드 결과만 사용했다. 새 재발 방지 항목의 근거는 확인되지 않았다. |

### 발견된 불일치

POL-28 영향 범위에서 기술 사실 불일치는 확인되지 않았다. 중앙 원문·Vercel 프로젝트 도메인과 공개 DNS 조사로는 운영 canonical 주소의 승인 근거를 확보하지 못했다. 이는 주소 정책 결정과 운영 확인 조건이다.

### 개발자 확인 필요 사항

제품·배포 책임자가 승인한 정식 공개 HTTPS origin과 해당 주소의 운영 관리 근거가 필요하다. 사용자 D1은 그때까지 적용 보류다.

### 추천 수정 방향

POL-28에서 승인 주소를 마저 기록하고 DEV-53 자체 Gate에서 도메인·이미지 접근을 확인한다. [DEV-53 인계](../tasks/DEV-53.md#dev-53-pol-28-handoff)

<a id="pol-28-verification"></a>

## 문서 검증 · 2026-11-24 KST

| 확인 | 명령과 결과 |
| --- | --- |
| 변경 Markdown·링크·선행 | 사전 검토본에서 Python 3.14.6의 임시 `validate_docs.py 404ba20 --expected-status 차단 --next-id DEV-54`로 Markdown 7개, 로컬 링크·앵커 57개와 HTTPS 링크 형식 12개를 확인했다. 원본 ID 79개, WBS Task 114개 및 순환 없는 선행 156개와 원본·coverage·QA·실행 코드 보존을 확인했다. |
| 패치 공백·범위 | `git diff --check 404ba20`과 `git status --short`를 확인했다. 최초 WBS 행 끝 공백을 한 번 고친 뒤 통과했다. 변경 범위는 Markdown 7개다. |
| 현행 소스와 읽기 전용 외부 관찰 | Figma C03 렌더와 실제 프레임 크기, GitHub 배포 기록, 후보 도메인의 DNS·HEAD 상태를 확인했다. 실행 중 버전, 공개 공유 자산 URL과 생성 HTML 검증은 DEV-53에 남는다. [조사 근거](../tasks/POL-28.md#pol-28-evidence) |
| 로컬 앱·실제 통합 | `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm build-storybook`, 제품 브라우저·mock/HTTP 대역·실제 업무 API는 문서 변경의 실행 영향이 없어 미실행이다. PR에서 기존 CI가 실행한 결과는 최종 head에서 확인한다. |

**Documentation Update Check.** POL-28의 결정·검증, DEV-53 조건, WBS, DEV-54 선정, 아키텍처 TODO와 공통 계획 이력을 갱신했다. `base.md`, `data-access.md`, `harness.md`의 실행·공급원·하네스에는 해당하는 변경이 없고 `ai-failures.md` 갱신 근거는 없다. 원본 기준선·연결표와 기존 QA 사례는 보존했다.

## 독립 verifier · 2026-11-24 KST

**Result · PASS**. 사용자의 D2·D3 승인과 D1 보류를 소스·diff·WBS에서 대조했다. 승인된 정책 문서의 전달을 통과로 판정했으며, 운영 주소가 필요한 정책 전체의 완료 기준은 남아 있다.

- **Issues.** Blocker·Major는 없었다. 후보 당시의 미실행·커밋 없음 표기가 현재 결과로 읽힐 수 있다는 Minor는 [예전 후보 기록](../tasks/POL-28.md#2026-10-27-후보-당시-검증리뷰인계-기록)의 시점을 명시해 수정했다.
- **Verification.** Python 문서 검사와 `git diff --check 404ba20`을 독립 재실행해 통과했다. 현행 제품 코드와 기존 기준선·QA를 보존했고 문서 범위에 따라 로컬 앱과 실제 통합은 미실행이다.
- **Documentation Update Check.** 정책·차단·후속 적용 기준과 DEV-54 선정 범위를 확인했다.
- **Review freshness.** 기준 `404ba20`의 추적 diff SHA-256 `3a8510ee`와 새 리뷰 문서 blob `b7dc6025`를 검토했다. 이 결과와 Minor 교정을 포함한 최종 변경은 재검증·재검토하고 해당 결과를 PR에 남긴다. [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fpol-28-canonical-og-policy)
- **Developer follow-up.** 제품·배포 책임자가 확정한 정식 공개 HTTPS 주소와 운영 관리 근거가 D1의 재개 조건이다.

## ai-review · 2026-11-24 KST

### 1. 리뷰 요약

원래 C03 완료 기준, 세 사용자 답변, `git status`, `git diff`, 프론트 소유 소스와 `package.json`을 대조했다. D2·D3와 D1 보류를 반영한 문서의 검사와 검토를 통과했다.

### 2. 발견된 문제

문서 전달 범위의 Blocker·Major는 없다. 첫 공백 문제와 후보 기록의 시점 표기는 수정했다. 정식 origin의 소유와 승인 정보는 POL-28의 차단 조건으로 남는다.

### 3. 누락된 검증

실행 코드 영향이 없어 로컬 앱 test/lint/build·Storybook, 제품 브라우저와 실제 업무 API 검증은 미실행이다. 배포 이미지의 응답과 정상·오류 HTML은 DEV-53 검증 계획으로 연결했다.

### 4. 문서 갱신 필요 여부

POL-28·DEV-53·DEV-54·WBS와 `plan.md`·`architecture.md`의 관련 부분을 갱신했다. 공개 Repository 진입점, 공급원 선택과 사용자 인증·저장 흐름에는 변경이 없다. 기존 QA와 C03 원본 매핑을 보존했다.

### 5. 개발자 확인 필요

정식 운영 주소의 확정이 남는다. 승인된 그림 및 발행 규칙과 이번 PR의 Git 전달은 해당 사용자의 결정과 요청에 연결했다.

### 6. 추천 수정 방향

공개 HTTPS 주소가 확정되면 POL-28의 남은 기준을 기록한 뒤 DEV-53에서 실제 HTML·이미지 제공을 확인한다. 다음 DEV-54는 상세 페이지의 `<main>` 중첩과 접근성 회귀 기준을 자체 Gate에서 확인한다.

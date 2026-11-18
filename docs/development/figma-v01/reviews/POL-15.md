# POL-15 문서 검증 및 리뷰

- 대상은 `docs/pol-15-invitation-destination`의 정책 v1·WBS·DEV-33 인계·TEAM-23/24 검증 기준·이 기록의 5개 Markdown 파일이다. 기준 main은 `713c12a5bccd149f574db5050ecc8c5aa5b4a52b`다. [요구사항과 사용자 D1](../tasks/POL-15.md#pol-15-brief) · [개발 인계](../tasks/DEV-33.md#dev-33-pol-15-handoff)

## 검증 범위

| 검사 | 방법과 범위 |
| --- | --- |
| 정책 근거 | 완료 프레임의 메타데이터·렌더, 프론트 고정 SHA의 초대·수락·직접 접근 코드, 중앙 정책과 백엔드 고정 SHA, 개발 배포 기록과 게시 OpenAPI를 대조했다. [증거 표](../tasks/POL-15.md#pol-15-investigation) |
| 문서 검사 | `python3 /tmp/mate-pol15.c9ZSXiS7/validate.py review` 및 종료 시 `final`. 변경 파일 allowlist, 상대 링크·앵커·소스 행, 표/펜스/공백, 79개 원본·114개 작업·156개 의존성·TEAM-01~26, WBS 상태/다음 선정, 원본/역사 보존을 검사한다 |
| diff | `git diff --check 713c12a` 및 목적별 커밋 범위 확인 |
| 미실행 | 로컬 `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm build-storybook`과 제품 브라우저·mock·HTTP 대역은 코드·패키지·설정 영향이 없는 문서 작업이라 실행하지 않았다. 실제 업무 통합은 실행 버전·합성 자원·사용/복구 승인이 필요하다. 기존 AUTH-16/17 결과와 TEAM-23/24의 이 범위 미실행을 보존했다 |

## Context Audit Report

### 결론

PASS. 이번 범위에서 문서의 현행 설명과 소스 사이에 후속 판단을 잘못 이끄는 불일치를 찾지 못했다.

### 확인한 코드베이스 사실

`package.json`의 8개 스크립트, Next 16.2.9·React 19.2.4·Vitest 4.1.11, pnpm 11.3.0과 lockfile v9, `.nvmrc`/CI Node 22.20.0을 확인했다. 기본 셸은 Node 26.5.0, pnpm 11.3.0, Python 3.14.6이다. 현행 `/my/team`, `/my/company`와 수락 완료 `/bids`를 시작 main 소스와 대조했다.

### 문서별 정합성 점검

| 문서 | 결과 |
| --- | --- |
| base.md | package·lockfile·8개 스크립트·실행 pin이 일치한다. 독립 type-check/format 스크립트는 없다 |
| architecture.md | 회사·팀원 라우트, 공통 인증과 회귀 경계가 소스와 연결된다. O11의 10월 팀원 미구현은 과거 기준선이다 |
| data-access.md | company 공개 포트와 같은 공급원, 계정/탭·epoch, 7개 데이터 그룹, 빌드 snapshot·운영 guard, HTTP/DTO 경계를 확인했다. 읽기 재시도에는 기존 조회와 인증 갱신만 포함한다 |
| plan.md | 현재/다음/상태는 WBS를 따른다. 이 정책과 후속 범위는 작업 기록에 둔다. 계획 문서의 날짜별 마일스톤과 원본 79개 항목은 이력으로 읽는다 |
| harness.md | `AGENTS.md`, 세 스킬, verifier 역할과 placeholder 설정이 문서의 실행 절차와 일치한다 |
| ai-failures.md | Figma 임시 주소·응답 본문, 확인되지 않은 성공과 늦은 응답의 기존 재발 방지 기준을 적용했다. 새 로그가 필요한 재발을 확인하지 않았다 |

### 발견된 불일치

이번 점검 범위에서 없음.

### 개발자 확인 필요 사항

D1로 목적지 결정을 확보했다. DEV-33 실제 통합의 실행 대응, 합성 자원과 변경/복구 범위, 문서 범위를 넘는 세부 UI 설계는 후속 Gate에 남는다.

### 추천 수정 방향

POL-15의 확정 동작과 실제 검증의 기대값을 해당 정책·인계·QA 기록에서 연결한다. 프로젝트 공통 스크립트·구조·하네스 설명은 유지 대상이다.

## AI Review

### 1. 리뷰 요약

사용자 D1, 시작 main의 초대 화면과 DEV-27/백엔드 가드, 문서 diff 5개를 대조했다. 최신 소속/leaf 기반의 세 경로, 직접 진입 검사, 확인된 수락과 읽기 실패의 구분이 정책과 후속 QA에 반영됐다.

### 2. 발견된 문제

Blocker·Major 없음. 독립 검토의 Minor 두 건을 한 번에 교정했다. 추가된 소스 행 링크 8개를 GitHub `#L`로 바꿨다. 인증 스키마의 nullable `companyContext`와 개발 OpenAPI에서 refresh 성공 응답이 게시되지 않은 사실을 구분했다.

### 3. 누락된 검증

로컬 앱 검사·제품 브라우저·mock·HTTP 대역 및 실제 업무 API는 정책 문서 단위에서 미실행이다. 실행 중 서버 SHA·응답과 Figma prototype/픽셀 전수 판정은 확보하지 않았다. 기존 AUTH-16 실제 0통과·1차단, 초대 AUTH-17와 TEAM-23/24의 DEV-33 범위 미실행을 유지한다.

### 4. 문서 갱신 필요 여부

정책 근거·결정, DEV-33 인계, 팀원 QA와 WBS, 이 검토를 갱신했다. 범위와 의존성을 보존해 coverage를 수정할 필요가 없었다. 공통 스크립트·구조·데이터 계약·하네스·plan에는 이번 정책을 반영할 소스 변경이 없다.

### 5. 개발자 확인 필요

POL-15의 추가 정책 결정은 없다. DEV-33 실행 시 실제 QA 자원·환경·복구 범위와 폴백의 세부 문구/로딩 배치를 자체 Gate에서 확인한다.

### 6. 추천 수정 방향

Minor 교정과 종료·인계 diff의 재검토가 완료됐다. 목적별 Git 전달을 진행하고, 제품 구현은 DEV-33에서 시작한다.

## 독립 verifier

- **Result** · 최초 검토 PASS. 기준 diff SHA-256 `774dea073ca97bc7e6cdaa8a62eec438dcb4760bba58ae648d9828dbaf091c64`.
- **Summary** · Figma 완료 카드·CTA·닫기와 현재 코드, 읽기 권한, 정책·DEV-33 인계·QA의 연결을 확인했다.
- **Issues** · Blocker·Major 0, Minor 2. 위의 소스 행 링크와 OpenAPI 표현을 교정했다.
- **Verification** · `python3 /tmp/mate-pol15.c9ZSXiS7/validate.py review`와 `git diff --check 713c12a` 최초 통과. 상대 링크 543개, 원본 79개, WBS 114개/의존 156개, TEAM 26개를 확인했다. 렌더와 공개 OpenAPI의 지문·필드도 독립 대조했다. 로컬 앱/실제 업무 검증은 미실행이다.
- **Documentation Update Check** · 정책·QA·인계·WBS의 대응과 원본 보존을 확인했다.
- **Review freshness** · 초기 SHA의 diff 뒤 소스 링크와 명세 표현, 종료·인계 기록이 바뀌었다. 수정된 문서를 대상으로 후속 검토를 적용한다.
- **Developer follow-up** · 현재 결정 공백은 없다. DEV-33의 실제 통합 Gate에서 실행 대응·합성 자원·변경/복구를 확인한다.

### 종료·인계 재검토

독립 verifier와 ai-review는 교정 및 종료·인계가 포함된 diff `3fd81171784eaa443d8a42ad1b144dd0a9ae3efe40df6379f460a8b704117408`를 다시 검토했다. 모두 PASS, 미해결 Blocker·Major·Minor 0이다. Python 검증기의 `final`과 `git diff --check 713c12a`도 PASS다. Markdown 5개·상대 링크 554개·79개 원본·114개 작업·156개 의존성·TEAM 26개·고정 이력 파일 8개와 DEV-33만 준비 상태인 것을 확인했다. 이후 기록은 위 검토 결과와 작업 종료 체크리스트다.

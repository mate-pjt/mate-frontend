# DEV-02 · 검증과 Review Gate

[요구사항과 설계](../tasks/DEV-02.md#dev-02-brief) · [사용자 승인](../tasks/POL-01.md#pol-01-approved-policy) · [홈 QA](../../../qa/home.md#dev-02-home-footer-qa)

## 확인 범위와 검증

| 구분 | 실행과 결과 |
| --- | --- |
| 기준과 소스 | `feat/dev-02-home-footer`와 기준 `main` `c4095225ade152b41e3c180c3fce0d244f4afd42`의 diff를 사용했다. `src/app/page.tsx`의 빈 푸터를 홈 전용 서버 컴포넌트로 바꾸고 Figma 흰색 심볼을 적용했다. 가입과 FAQ의 소유 경로를 대조했다. |
| Node | 격리 Node 22.20.0·pnpm 11.3.0에서 `pnpm install --offline --frozen-lockfile`, `pnpm test` 43파일·1,273건, `pnpm lint`, Preview mock `pnpm build`를 통과했다. 빌드가 작성한 Next 경로 목록과 TypeScript 결과를 확인했다. |
| 실제 Next·Chrome | `pnpm start`와 격리 Chrome에서 1920·768·390·320px, 심볼 36×28px, 탭 순서·포커스, 상단·FAQ 이동과 가림을 확인했다. 합성 가입과 푸터에서 연 네 약관 탭의 원문은 각각 일치했다. [브라우저 결과 JSON](../../../qa/artifacts/dev-02/browser-results.json) |
| 실제 공개 원문 | 인증 없는 로컬 `307` 두 건과 문서 서비스의 `200`·승인 제목 두 건을 확인했다. 잘못된 로컬 문서 경로는 `404`다. 푸터 검증의 문서 열람과 DEV-01의 뷰어 권한 설정·가입 저장 증거를 구분한다. |
| 미실행 | 업무 API·HTTP 대역·실제 가입·운영 배포·OS 스크린리더 미실행. `pnpm build-storybook`은 홈 전용 변경으로 로컬 생략했다. Aside 연결 실패 및 브라우저 계측 선택자의 오류를 [작업 기록](../tasks/DEV-02.md#dev-02-verification)에 남겼다. 제품 자동 수정은 0/3이다. |

## Context Audit Report

### 결론

착수 시 WARN. WBS 요약 숫자를 실제 행에 맞춰 수정했고 원본 79개, 작업 114개, 의존성 156개를 다시 확인했다.

### 확인한 코드베이스 사실

`package.json`·`pnpm-lock.yaml`·`.nvmrc`, `src/app`·`src/components`·`src/data`의 실제 경로 및 `.codex/skills`·`.codex/agents`를 확인했다. H04의 현행 소유는 홈이고 가입·FAQ 링크는 기존 공개 경로가 제공한다.

### 문서별 정합성 점검

| 문서 | 확인 내용 |
| --- | --- |
| `base.md` | 패키지·Next/React·pnpm 버전, Node 고정값, script 목록과 별도 type-check/format 부재를 확인했다. 검증 실행에는 저장소가 고정한 Node 22.20.0을 사용했다. |
| `architecture.md` | 루트 `<main>`, 홈의 기존 구성, 정적 `/qna`와 legal 리다이렉트가 소스와 일치한다. 홈 푸터의 경로와 상단 이동 배치를 추가했다. |
| `data-access.md` | 일곱 공급원, 직렬화된 설정 snapshot·운영 guard, Repository 공개 진입점·탭 격리 경계는 기존 소스와 계약·구조 테스트를 확인했다. 이번 푸터는 데이터 접근 코드를 추가하지 않는다. |
| `plan.md` | WBS를 현행 상태의 기준으로 지정한다. H04의 DEV-02·POL-01·QA-16 연결과 DEV-01 선행을 확인했다. `coverage.md` 원본 79개를 보존한다. |
| `harness.md` | 세 스킬과 read-only verifier 정의, 설정 placeholder의 현행 파일을 확인했다. |
| `ai-failures.md` | Figma 임시 자산 주소의 도구 출력 재발을 기록했다. Markdown 링크와 전후 이력 검사에 해당 기록을 포함한다. |

### 발견된 불일치

| 심각도 | 관련 문서 | 실제 상태 | 착수 시 설명 | 조치 |
| --- | --- | --- | --- | --- |
| Minor | WBS 요약 집계 | 완료 67·차단 28·대기 17·준비 1·보류 1 | 완료 66·차단 29·대기 18·보류 1 | DEV-02 상태 전환과 함께 실제 114개 행의 집계로 교정한다. 별도 정책 결정 없이 동기화 가능한 문서 정정이다. |

### 개발자 확인 필요 사항

관련 현행 소스·승인 범위에 추가 결정 사항이 없다.

### 추천 수정 방향

WBS 상태가 바뀔 때 현재 작업·다음 작업과 함께 실제 행의 집계를 확인한다.

<a id="dev-02-review"></a>

## Review Gate · 2026-11-26 KST

### Read-only verifier

- **Result** · PASS. 승인된 홈 푸터, 가입과 같은 새 탭 문서 이동, FAQ의 현재 탭 이동과 연락처·저작권을 독립적으로 대조했다.
- **Issues** · Blocker, Major, Minor 없음.
- **Verification** · `git diff --check`와 문서 검사를 독립 실행했다. 검토 당시 변경 12파일, 신규 로컬 링크·앵커 32개, 원본 79개, 작업 114개·의존성 156개를 확인했다. 제품 3파일의 검증 빌드 일치, Vitest 43파일·1,273개, lint·mock 빌드 로그, 네 Chrome 폭과 새 탭 4개 기록을 확인했다. 실업무 API·운영 배포·다른 브라우저·OS 스크린리더는 미실행이고 로컬 Storybook은 공유 UI 영향이 없어 생략했다.
- **Documentation Update Check** · WBS·작업·QA·구조·실패 이력이 실제 상태와 검증 범위를 반영한다. H04 기준선과 기존 HOME-01~09·DEV-01 결과를 유지한다.
- **Review freshness** · `c4095225` 기준으로 검토한 제품과 문서에 적용한다. 이 결과를 붙이면서 완료 체크리스트와 WBS 인계 Markdown을 갱신했다. 최종 문서와 제품의 재검토 결과는 최종 PR과 종료 보고에 남긴다.
- **Developer follow-up** · 추가 정책 결정을 기다리는 항목이 없다. 원격 PR의 최종 head·CI·병합 조건은 Git 전달 단계에서 확인한다.

### ai-review

1. **리뷰 요약** · PASS. 사용자 승인 프레임과 법적 경로, 원본 SVG, 토큰, Chrome 증거가 H04의 완료 범위를 충족한다. `HomeFooter`는 홈 전용이며 client 상태·새 의존성·업무 fetch가 없다.
2. **발견된 문제** · 제품·문서 Blocker, Major, Minor 없음. 작업 중 발생한 Figma 임시 URL 출력의 예방 규칙은 [실패 이력](../../../ai-context/ai-failures.md#dev-02-figma-asset-output)에 남겼다. diff에서 임시 자산 주소 문자열을 검사했다.
3. **누락된 검증** · 업무 API·HTTP 대역·운영 배포·OS 스크린리더·다른 브라우저는 미실행이다. 로컬 Storybook의 생략 근거와 목업 계측 및 공개 원문 열람의 범위를 확인했다.
4. **문서 갱신 필요 여부** · WBS·작업·QA·구조·실패 이력과 리뷰를 갱신했다. `plan.md`는 WBS를 참조한다. 패키지·데이터·하네스 규칙과 H04 매핑은 현행 근거를 유지한다.
5. **개발자 확인 필요** · 추가 제품·정책 결정 사항 없음. PR 검사는 정확한 원격 head를 기준으로 확인한다.
6. **추천 수정 방향** · DEV-02 제품에 추가 수정 사항 없음. WBS 행 집계·기존 QA 차단과 새 인계를 종료 diff에서 다시 확인한다.

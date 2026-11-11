# Context Audit Report · QA-17 · 2026-11-11

## 결론

**FAIL — 제품/정책의 기존·현재 불일치가 남아 있음.** 이번 감사/계획 문서의 검토 판정과 분리한다. 사용자는 점검과 Task 정리까지만 요청했으므로 제품을 수정하지 않고 각각의 소유 Task로 연결했다.

## 확인한 코드베이스 사실

- frontend main `8d3a2ec290aabc4280c5e9f5336cfd36376f7e94`, 시작 clean. Next16.2.9/React19.2.4, pnpm11.3.0, Node22.20.0, Vitest4.1.11. 실제 script는 dev/build/start/lint/storybook/build-storybook/test/test:watch다. type-check/format은 없다.
- App Router page20개, Repository7공급원·정적 Q&A, server/client 공개 진입·DTO 경계·불변 config snapshot·자동 mock fallback 없음 구조를 확인했다. 운영 guard와 hybrid 제약을 바꾸지 않았다.
- AGENTS·feature-workflow/context-audit/ai-review·verifier·Codex 설정과 base/architecture/data-access/plan/harness/ai-failures를 읽었다. 이번 변경은 docs의 Markdown/JSON뿐이다.
- Figma14영역/대표21화면·정책20문서·backend main/dev 및 선택7파일·Swagger183paths/207operations와 대조했다. 직접 실행은 격리 all-mock 브라우저와 비인증 OpenAPI GET이다. 실제 업무 API 결과는 아니다.

## 문서별 정합성 점검

### base.md

packageManager·버전·scripts·lockfile·Node 기록과 현재 파일이 일치한다. 새 script나 의존성을 추가하지 않아 갱신하지 않는다. 문서 작업의 검증은 링크/ID/지문/범위 검사와 diff-check로 정했다.

### architecture.md

현재 route/component/Repository/UI/token 구조 설명은 유지된다. 기본 회사 모델의 복수 업종 누락은 구조 문서를 사실에 맞게 좁히는 것만으로 해결할 제품 결함이 아니므로 DEV-60에 연결했다. DESIGN.md의 현재 AlarmList 설명은 DEV-06과 달라 CF-08/DEV-62의 문서 동기화로 연결했다. 구조/API 경계를 이번에 수정하지 않아 architecture 자체는 덮어쓰지 않는다.

### data-access.md

7개 공급원·선택 snapshot·production guard·계정/탭 격리·upload handle·HTTP와 mock/실제 검증의 구분이 현재 구조와 일치한다. 제품 정책과 구체적 mock 의미의 불일치(CF-05/07/09/11/12/14)는 아래와 같이 남는다. 올바른 정책을 현재 결함에 맞춰 완화하지 않는다.

### plan.md

날짜별 이력을 보존하고 QA-17 감사/계획 진입점만 추가했다. 원본79개는 유지하고 기존99→113개 Task의 현재/다음/상태는 WBS만 관리한다. 감사 완료와 제품/실제 API PASS를 구분한다. 과거 endpoint 부재/403은 날짜별 이력이며 현재 가용성은 감사의 별도 보정으로 연결한다.

### harness.md

요구사항→설계→검증/문서→Review Gate 흐름과 실제 Skill/agent가 일치한다. 정합성 점검의 근거 연결/현재 계약 직접 조회 기준을 workflow/harness에 추가했다. 새로운 실행 도구·설정·권한 체계를 만들지 않았다.

### ai-failures.md

생성 문서의 literal +가 보고서/검토 요약에2회 잔존한 사실이 독립 검토에서 확인돼 [ai-failures](../../../ai-context/ai-failures.md)에 원인·교정·형식 검사 예방 규칙을 추가했다. 제품 코드/하네스 설정 변경은 없다. fullPage 캡처 한계와 FAQ hydration warning은 제품 원인을 단정하지 않고 날짜별 감사/QA-15 재현 조건에 기록했다. 문서 검사 초회 누락 링크1개는 검토 파일 생성 후 해소했다.

## 발견된 불일치

- **Major · CF-09:** 중앙 ADR-0014·POL-02/QA-10의 빈 SAVED 정책과 mock/HTTP 대역 reset의 EMPTY_DEFAULT가 다르다. 테스트는 빈 값만 확인한다. 조치: [DEV-63](../tasks/DEV-63.md)의 source/version·회사 기본값 억제 검증. 이번 자동 제품 수정: No, 요청 범위 밖.
- **Major · CF-06:** 회사 정책/서버 primaryIndustries와 프론트 단일 primaryIndustry 표시가 다르다. 조치: [DEV-60](../tasks/DEV-60.md), 기존 DEV-08과 기본/대시보드 소유 분리. 이번 자동 제품 수정: No.
- **Major · CF-05/07/11/12/14:** mock 평가연도/인증, 관련 공고 후보, 검색/view·지역 조건, 인증시간이 현재 정책/계약과 다르다. 조치: [DEV-59](../tasks/DEV-59.md)/[DEV-61](../tasks/DEV-61.md)/[DEV-65](../tasks/DEV-65.md)와 기존 DEV-09/41. 실제 서버 결함이나 새 통합 FAIL로 확대하지 않는다. 이번 자동 제품 수정: No.
- **Major · CF-23:** 같은 중앙 관련 공고 문서 §6·§10에서 기준 공고 마감/취소 규칙이 충돌한다. 현재 backend source까지 대조했으나 정책 승인으로 대체하지 않는다. 조치: [POL-30](../tasks/POL-30.md) → DEV-61. 자동 원문 수정: No, 정책 소유 확인 필요.
- **Minor/결정 필요 · CF-01~04/10/14:** Figma 배치·표시/문구와 현재 구현의 차이는 도메인 정책 근거와 시각적 예외 승인이 다르다. 조치: [POL-29](../tasks/POL-29.md)와 담당 UI Task. 승인 근거가 없는 차이를 일괄 예외로 처리하지 않는다.

전체 기대/현재·source·고정 정책/디자인·실행 수준·기존 계획 연결은 [감사 보고서](../audits/2026-11-11.md)에 있다. 이 목록은 새 문서 diff의 결함 목록이 아니다.

- **Major · CF-08 문서:** [DESIGN.md:78](../../../../DESIGN.md#alarmlist)의 현재 Interaction은 목록 유지/actionPath 미연결을 설명하지만, [현재 source](../../../../src/features/notifications/activation-controller.ts)는 POL-04/DEV-06의 읽음 성공 후 안전한 이동을 구현했다. 과거 날짜별 이력과 별개인 상단 설명의 factual drift다. 조치: DEV-62의 알림 안내·문서 동기화 완료 기준에 추가했다. 이번 자동 정정: No, 감사/계획 범위에서 수정 소유와 수용 기준까지만 반영.

## 개발자 확인 필요 사항

이번 감사/계획 종료를 위한 추가 확인은 없다. 후속 POL-29의 시각 선택과 POL-30의 중앙 정책 충돌, 기존 정책/실제 QA 자원은 해당 Task Gate에서 해결한다. 이번 추천을 승인으로 간주하지 않는다.

## 추천 수정 방향

WBS의 다음 Gate 하나를 수행하고, 확인된 결함을 각각의 좁은 DEV에서 수정·검증한다. 원본79개·기존 실제 QA/승인 예외를 유지하며 mock/HTTP 대역/실제 응답과 소스/배포문서/실행 프로세스 증거를 계속 분리한다.

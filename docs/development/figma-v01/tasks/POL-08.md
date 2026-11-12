# POL-08 · 정정 이력 조회·선택 계약 확정

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 정책 결정
- 원본 항목: D06, C02
- 선행 작업: [DOC-001](DOC-001.md)
- 목적/범위: 과거 공고/정정 이력의 식별자·조회/선택·접근 가능 범위를 확정한다. 추천: 기존 CorrectionPopup의 실제 도메인 연결 여부를 기준으로 설계한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### D06 · 이전 공고·정정 이력 목록/선택
- 기준선: UI **공용 팝업만**, 동작 **실제 상세 미연결**, 데이터 **과거 이력 계약 미연결**. 검증: 코드 대조.
- 남은 점: CorrectionPopup을 실제 정정 이력 데이터와 상세 상태에 연결
- Figma: [2208:20632](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2208-20632) / [2210:18395](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2210-18395) / [2210:18751](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2210-18751)
- 소유 소스/기존 기록: [src/components/ui/popup/popup.tsx:353](../../../../src/components/ui/popup/popup.tsx)、[src/components/bids/bid-detail-content.tsx:89](../../../../src/components/bids/bid-detail-content.tsx)、[docs/qa/bid-detail.md:73](../../../../docs/qa/bid-detail.md)

### C02 · 정정·비밀번호·탈퇴·업로드 공용 팝업
- 기준선: UI **컴포넌트 구현**, 동작 **일부 Storybook 전용**, 데이터 **업무 API 없음**. 검증: 코드 대조.
- 남은 점: 컴포넌트 존재를 제품 기능 완료로 세지 말 것. 실제 도메인 연결 필요
- Figma: [2210:17840](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2210-17840) / [2303:89402](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2303-89402) / [2303:90900](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2303-90900) / [2264:95335](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2264-95335)
- 소유 소스/기존 기록: [src/components/ui/popup/index.ts:1](../../../../src/components/ui/popup/index.ts)、[src/components/ui/popup/popup.stories.tsx:50](../../../../src/components/ui/popup/popup.stories.tsx)、[src/components/ui/popup/popup.tsx:353](../../../../src/components/ui/popup/popup.tsx)

## 완료 기준

- [ ] 현재 정정 사실 표시와 과거 이력 조회를 구분한다
- [ ] 회차/분류·이전 데이터 미수집·오류·선택 목적지를 확정한다
- [ ] 원문/소유 소스·버전·결정자·시각·선택/보류 이유를 기록한다. 추천안은 승인으로 간주하지 않는다.
- [ ] 근거 있는 기존 승인 또는 필요한 개발자 결정을 확보하고, 후속 개발의 범위/완료 기준/차단을 갱신한다. 정책 작업도 Review Gate를 수행한다.

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

<a id="pol-08-dev-11-handoff"></a>

## 2026-11-12 · DEV-11 종료 후 선정/인계

- 사용자 요청7항에 따라 다음 정책 Gate 후보 하나로 선정/인계만 했다. 남은 P0/P1 차단/선행 미충족, DEV-12의 별도 계약/정책 Gate 보류를 유지하고 P2 WBS 순서·DOC-001 완료를 근거로 삼는다. 현재/다음/상태는 WBS만 관리한다.
- 다음 첫 행동: 새 대화에서 최신 main/작업트리·이 정의와 완료 기준·연결된 소유 정책을 읽고, 현재 ‘정정됨’ 사실 표시와 과거 회차/분류/이전 데이터 이력의 구분을 현행 frontend/backend GitHub·개발 Swagger/Figma 상태와 대조한다. 식별자·수집 누락·오류·접근/선택 목적지 계약을 확인한 뒤 정책 작업 자체 Brief와 남은 질문을 제시한다. 추천안을 승인 결정으로 취급하지 않는다.
- 이번에는 이 Task의 정의/선행/완료 기준만 읽었다. CorrectionPopup/상세 source·API/Figma 상세 조사·정책 결정·Brief/설계·구현·검증·실제 업무 요청·Git 전달은 시작하지 않았다. 새 라이브러리/제품 구현을 정책 Task에 추가하지 않는다.
- DEV-11의 ‘로컬 선행·실서버 QA 차단 보존’·Git/Chromatic 예외는 다음 Task에 자동 적용되지 않는다. 기존 기준선·QA/차단/승인 예외를 보존하며 새 대화의 범위/계약/승인으로 자체 Gate를 수행한다.

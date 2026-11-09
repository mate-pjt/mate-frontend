# DEV-10 · 날짜 기준·직접 기간 입력 연결

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: L08
- 선행 작업: [POL-07](POL-07.md)
- 목적/범위: 기존 preset을 보존하고 날짜 종류/직접 범위 편집을 연결한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### L08 · 날짜 기준 선택·직접 기간 입력
- 기준선: UI **비활성**, 동작 **미연결**, 데이터 **모델·URL 지원**. 검증: 코드 대조.
- 남은 점: 선택형 preset 외 고급 편집 UI를 연결
- Figma: [2081:61968](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2081-61968) / [2081:62097](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2081-62097)
- 소유 소스/기존 기록: [src/components/bids/bid-filter-toolbar.tsx:121](../../../../src/components/bids/bid-filter-toolbar.tsx)、[src/components/ui/filter-popover/filter-popover.tsx:588](../../../../src/components/ui/filter-popover/filter-popover.tsx)

- 이어갈 QA 기록: [bid-list.md](../../../qa/bid-list.md). 기존 case ID와 통과/대기/차단 기록을 보존한다.

## 완료 기준

- [ ] 역전/동일일·열린 범위 허용 여부·시간대·초기화·preset 전환을 검증한다
- [ ] URL·저장/재조회와 조회 결과·모바일 입력을 확인한다
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

## 2026-11-09 · POL-07 날짜 정책 인계 · 구현 미착수

- [정책 v1](POL-07.md#pol-07-contract)·[공통 Gate](POL-07.md#pol-07-handoff)를 따른다. ALL의 BID_BEGIN/PARTICIPATION_DEADLINE/BID_CLOSE·직접 기간과 RESULT의 고정 개찰기간을 조회 URL에 연결하고 ALL만 명시적 계정 저장한다. CLOSING_SOON 날짜 UI/query는 제공하지 않는다.
- 추가 완료 기준: 실제 달력 날짜/윤년·KST 시작일00:00 이상/종료 다음날00:00 미만·열린 범위/동일일·역전 오류, 양쪽 빈 값일 때 종류 해제, 기존 preset 범위와 선택 종류 유지/월말 clamp·절대 날짜 저장, 초기화/취소·URL/reload·모바일/키보드를 확인한다. RESULT dateType 무전송·날짜 범위 계정 비저장, 서버 count/page/정렬을 [ADV-05~08/12](../../../qa/bid-list.md#pol-07-advanced-qa)·[ADVP](../../../qa/personal-bid-filter.md#pol-07-advanced-personal-qa)로 검증한다.
- 현재 URL 모델은 실제 달력/역전/타입-경계 결합 검증이 부족하고 personal 조건은 ALL에서만 읽는다. 기존 관대한 파서를 신규 정책 구현 완료로 취급하지 않는다. 후속 Brief에서 공개/개인 URL 경계를 설계한다. DEV-09를 임의의 새 선행 코드 의존성으로 추가하지 않는다.
- POL-07에서 OpenAPI와 GitHub 배포 기록상 대응은 확인했지만 실제 날짜 경계 공고/실행 식별자·저장 계정/변경·복구·안전한 오류는 미확인이다. 사용자 미준비/로컬 예외 승인을 추정하지 않는다. 다음 첫 행동은 최신 소유 계약·배포/자료 점검과 자체 Gate이며 제품 구현/실제 실행은 없다.

# DEV-09 · 고급 지역·업체·공동도급 조건 연결

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: L07
- 선행 작업: [POL-07](POL-07.md)
- 목적/범위: 비활성 고급 지역 조건의 controlled 값/콜백/조회·복수 선택을 확정 범위에서 연결한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### L07 · 지역 업체·공동도급 등 고급 지역 조건
- 기준선: UI **비활성**, 동작 **미연결**, 데이터 **모델 일부 지원**. 검증: 코드 대조.
- 남은 점: advancedDisabled 해제에 필요한 제어값·콜백·조회 계약 연결
- Figma: [2080:64254](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2080-64254) / [2080:64609](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2080-64609)
- 소유 소스/기존 기록: [src/components/bids/bid-filter-toolbar.tsx:86](../../../../src/components/bids/bid-filter-toolbar.tsx)、[src/data/personal-filters/contracts.ts:4](../../../../src/data/personal-filters/contracts.ts)

- 이어갈 QA 기록: [bid-list.md](../../../qa/bid-list.md). 기존 case ID와 통과/대기/차단 기록을 보존한다.

## 완료 기준

- [ ] 복수 선택·지역 업체/공동도급 조합·해제·URL/reload를 확인한다
- [ ] 조회/개인 저장·비지원 조합·키보드·모바일을 검증한다
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

<a id="dev-09-pol-07-handoff"></a>

## 2026-11-09 · POL-07 정책 인계 · 구현 미착수

- 근거: [승인 D1/D2 및 D3 직접 조사 요청](POL-07.md#pol-07-decisions)·[정책 v1](POL-07.md#pol-07-contract)·[공통 Gate](POL-07.md#pol-07-handoff). 현재/다음/상태는 WBS만 관리한다.
- 범위: 공개 ALL/CLOSING_SOON/RESULT의 지역 code·시도/시군구·지역 업체만·공동도급을 기존 URL/Repository 패턴으로 연결한다. ALL에서만 명시적 개인 저장을 제공한다. 계정 회사 값 자동 반영·recommended·날짜/금액·낙찰금액·회사 import·reset Major 수정은 이 Task에 섞지 않는다.
- 선행 설계: 현재 HTTP DTO의 `parentCode/depth`가 mapper의 공개 옵션에서 사라진다. 기존 metadata로 관계를 보존하고 코드/표시 라벨을 분리한다. 새 endpoint나 라벨/코드 자릿수 기반 하위 지역 추정은 하지 않는다.
- 추가 완료 기준: 지역0+regionOnly 오류/지역 해제 시 flag 해제, 최대50 code/활성 reference·다중 선택/왕복, NO_ROWS와 미확인/실패 차이, 공동도급 REQUIRED/AVAILABLE 배타·지역 없이 공동도급, 조건 AND/지역 OR·서버 canonical count/page·정렬, URL 적용의 계정 무쓰기·명시 저장/계정 교체·401/409, 모바일/키보드를 검증한다. [ADV-01~04/12](../../../qa/bid-list.md#pol-07-advanced-qa)·[ADVP](../../../qa/personal-bid-filter.md#pol-07-advanced-personal-qa)를 보완한다.
- 배포 확인: POL-07에서 관련 OpenAPI3.1.0/v1 schema와 GitHub test 배포 success/dev SHA 대응을 확보했다. 실행 프로세스 SHA 직접 증명·합성 경계 공고/disposable 계정/사용·변경·잔존·복구/안전한 오류 준비는 미확인이다. 사용자 미준비 답변이나 로컬 구현 선행 예외가 있는 것으로 기록하지 않는다.
- 재개 첫 행동: 최신 main/Git·POL-07 마지막 체크포인트와 source/OpenAPI/배포 drift를 재확인하고, 지역 공고·계정/오류/복구 자원을 읽기 전용 점검해 자체 Brief를 제시한다. 미확보가 확인되면 구체적인 차단 조건을 기록한다. 이 정책 Task에서 구현/실제 API 저장·QA는 실행하지 않았다.

## 2026-11-11 · QA-17 전수 점검 보완

- 근거: [감사 CF-12](../audits/2026-11-11.md#cf-12) · [route/API·출처 인덱스](../audits/2026-11-11.json).
- 범위/소유: mock은 regionCodes에서 unrestricted를 구분하지 않고 AVAILABLE에서 REQUIRED를 배제하지 않는다. 이 고급 지역 Task의 구현/검증 범위에 포함한다.
- 추가 완료/재개 기준: POL-07 v1의 NO_ROWS/known/unknown·광역/시군구·regionOnly·일반/의무 공동도급을 나누고 AVAILABLE이 의무를 제외하는 음성 assertion을 추가한다. 공개 검색/view는 DEV-65, 관련공고는 DEV-61.
- 이 절은 날짜별 후속 계획이다. 앞선 결정/QA/예외 이력을 대체하지 않으며 제품 구현·실제 업무 API 변경/새 통합 PASS는 없다. 상태는 WBS에서만 관리한다.

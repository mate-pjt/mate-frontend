# DEV-13 · 상세 정정 이력 팝업·선택 연결

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: D06, C02
- 선행 작업: [POL-08](POL-08.md)
- 목적/범위: 기존 공용 팝업을 실제 이력 목록과 선택 결과에 연결한다.
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

- 이어갈 QA 기록: [bid-detail.md](../../../qa/bid-detail.md). 기존 case ID와 통과/대기/차단 기록을 보존한다.

## 완료 기준

- [ ] 정정 없음/복수/이력 미수집·선택/닫기·조회 실패를 검증한다
- [ ] 이전 공고 선택 후 URL/분류/회차와 현재 상세 복귀를 확인한다
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

<a id="dev-13-pol-08-handoff"></a>

## 2026-11-13 · POL-08 정책 수령/재개 조건

- [POL-08 v1](POL-08.md#pol-08-contract)은 현재 정정 사실(D05)과 동일 공고번호의 수집 차수 조회(D06)를 구분한다. 다른 번호의 재공고 연결, 개찰 회차, 같은 차수의 과거 수정 시점 복원은 제외한다. 선택한 실제 ID의 공고 전체로 같은 탭 이동하고 분류/개찰회차/품목/참가업체 page를 자동 승계하지 않으며, 뒤로 가기로 원래 상세 URL에 복귀한다.
- 사용자 최종 원문: **‘전용 백엔드 계약을 먼저 마련한 뒤 이걸 구현하는걸로 하자. 백엔드 개발자한테 이 이전 차수 조회 API에 대한 요청을 보냈어.’** 결정일2026-11-13 KST. 요청 발송은 사용자 보고이며 backend 접수/납기·구현·OpenAPI/배포/실행 대응은 미확인이다. 현재 상태는 WBS만 관리한다.
- [추가 조사](POL-08.md#pol-08-investigation)에서 기존 no-view 목록 API로 공개 수집 차수를 검색할 경로는 확인했다. 이 가능성을 숨기거나 ‘API가 전혀 없어 구현 불가’로 기록하지 않는다. 사용자는 전용 계약 선행을 택했으므로 기존 목록 조합·공용 기본 예시·목록 실패 fallback을 제품 대안으로 사용하지 않는다.
- 재개 첫 행동: 최신 main/작업트리와 [전용 계약 수락 표](POL-08.md#pol-08-backend-request)를 읽고 실제 source commit·path/query/schema/version·배포/실행 대응 및 기준/대상 포함 관계·정렬/페이지·부재/누락/오류·공개 경계를 대조한다. 합성 복수 차수/간격/분류 차이·마감/취소·미공개/삭제·오류 fixture와 사용/재현·해제/잔존·복구 범위를 확보한 뒤 자체 Brief부터 제시한다.
- 구현 시 기존 bids 공개 Repository/server·DTO/mapper 경계를 지킨다. 현재 내부 BidDetail에는 원본 번호/차수 별도 값이 없으므로 raw sourceKey를 보존하는 최소 확장이 필요하다. 표시용 `noticeNumber`를 split해서 번호/차수를 역산하지 않는다. 같은 차수의 현재 저장본과 과거 시점 snapshot, 차수와 정정 횟수/최초/최신을 혼동하지 않는다.
- 완료 기준의 구체 사례는 [HIST-01~12](POL-08.md#pol-08-dev13-gate)와 [기존 QA 후속 기준](../../../qa/bid-detail.md#pol-08-followup)에 연결한다. 실제 새 계약의 정상/빈/누락/오류·페이지·ID/원본키/분류·선택/닫기·하드 리로드/뒤로 가기·접근 불가·키보드/모바일을 검증하고 현재 scripts의 자동/실제 Next/브라우저·두 리뷰를 수행한다. mock/HTTP 대역/실제 API 결과는 별도다.
- 이 추가 기록은 정책/재개 기준 인계다. DEV-13 설계·계약 구현·제품/실제 복수 차수 QA·DEV-13 Git 전달은 시작하지 않았다. 전용 계약 전에 로컬 구현부터 시작할 예외도 없으며 기존 QA-03의1통과8차단·DETAIL-04/타 Task의 차단·승인 예외를 보존한다.

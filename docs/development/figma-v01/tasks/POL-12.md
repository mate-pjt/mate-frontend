# POL-12 · 회사 갱신·비교 적용·직접 수정 정책

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 정책 결정
- 원본 항목: U01, U02, U03, F04
- 선행 작업: [POL-06](POL-06.md)
- 목적/범위: 자료 연도/최신 여부·자동 수집/사용자 편집 우선순위·권한·버전 충돌·이미지 변경 계약을 확정한다. 추천: 비교 후 선택 적용하며 기존 값을 자동 덮어쓰지 않는다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### U01 · 최근/연도별 회사 정보 갱신 안내
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **프론트 계약 없음**. 검증: 코드 대조.
- 남은 점: 해 바뀜·최신/이전 데이터 상태와 갱신 진입을 구현
- Figma: [3134:66829](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3134-66829) / [3135:68266](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-68266)
- 소유 소스/기존 기록: [src/components/my/my-company-client.tsx:252](../../../../src/components/my/my-company-client.tsx)、[docs/qa/my-company.md:8](../../../../docs/qa/my-company.md)

### U02 · 최신 정보 불러오기·변경 비교/선택 적용
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **프론트 계약 없음**. 검증: 코드 대조.
- 남은 점: 조회 대기·최신정보 유지·선택 반영·충돌/권한 처리
- Figma: [3135:68996](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-68996) / [3135:71126](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-71126) / [3135:71288](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-71288)
- 소유 소스/기존 기록: [src/data/company/contracts.ts:193](../../../../src/data/company/contracts.ts)、[src/components/my/my-company-client.tsx:252](../../../../src/components/my/my-company-client.tsx)

### U03 · 회사 정보 직접 편집·프로필 변경
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **프론트 계약 없음**. 검증: 코드 대조.
- 남은 점: 업종·주소 등 편집/오류/저장, 이미지 변경 권한과 계약
- Figma: [3135:69008](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-69008) / [3135:69602](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-69602) / [3135:70640](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-70640)
- 소유 소스/기존 기록: [src/components/my/my-company-client.tsx:252](../../../../src/components/my/my-company-client.tsx)、[src/data/company/contracts.ts:193](../../../../src/data/company/contracts.ts)

### F04 · 서류 기반 실적·회사정보 반영
- 기준선: UI **가입 기반 일부**, 동작 **가입 후 흐름 없음**, 데이터 **등록 proposal 기반 있음**. 검증: 코드 대조.
- 남은 점: OCR 결과를 회사 갱신/직접 수정과 연결
- Figma: [3135:75991](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75991) / [3135:78459](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-78459) / [3135:81589](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-81589)
- 소유 소스/기존 기록: [src/data/company/contracts.ts:219](../../../../src/data/company/contracts.ts)、[src/components/auth/company-registration.tsx:69](../../../../src/components/auth/company-registration.tsx)

## 완료 기준

- [ ] 최신 fetch/비교/선택 적용과 직접 편집·로고 각각의 계약을 확인한다
- [ ] 자료 출처/기준일·null/삭제·읽기 전용 역할·동시 변경 결과를 확정한다
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

# POL-13 · 서류함 생명주기·접근·삭제 계약

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 정책 결정
- 원본 항목: F01, F02, F03, F04
- 선행 작업: [DOC-001](DOC-001.md)
- 목적/범위: 가입용 업로드와 구분해 보관 목록/버전/유효기간·다운로드·보관/삭제·재업로드/OCR 결과 적용 계약을 확정한다. 추천: 기존 opaque upload 기반을 재사용한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### F01 · 가입 후 서류함 목록·보유/만료 상태
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **관리 목록 계약 없음**. 검증: 코드 대조.
- 남은 점: 가입용 업로드와 별개인 보관함·문서 생명주기 UI/조회 연결
- Figma: [3135:75612](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75612) / [3135:75734](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75734)
- 소유 소스/기존 기록: [src/data/company/contracts.ts:212](../../../../src/data/company/contracts.ts)、[src/components/my/my-company-client.tsx:252](../../../../src/components/my/my-company-client.tsx)

### F02 · 보관 서류 상세·다운로드·수정 이력
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **관리 조회/다운로드 계약 없음**. 검증: 코드 대조.
- 남은 점: 등록 문서 조회·유효기간·최종수정·다운로드 구현
- Figma: [3135:75782](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75782) / [3135:83161](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-83161)
- 소유 소스/기존 기록: [src/data/company/contracts.ts:212](../../../../src/data/company/contracts.ts)

### F03 · 보관 문서 추가·재업로드·삭제
- 기준선: UI **가입 기반 일부**, 동작 **관리 흐름 미구현**, 데이터 **업로드/버전/처리 기반 있음**. 검증: 코드 대조.
- 남은 점: 기존 업로드 기반을 보관함에 연결; 삭제·권한·충돌·오류·완료 피드백 추가
- Figma: [3135:75651](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75651) / [3135:75938](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75938) / [3135:80545](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-80545)
- 소유 소스/기존 기록: [src/data/company/contracts.ts:213](../../../../src/data/company/contracts.ts)、[src/app/auth/company/register/document/registration-client.tsx:1](../../../../src/app/auth/company/register/document/registration-client.tsx)

### F04 · 서류 기반 실적·회사정보 반영
- 기준선: UI **가입 기반 일부**, 동작 **가입 후 흐름 없음**, 데이터 **등록 proposal 기반 있음**. 검증: 코드 대조.
- 남은 점: OCR 결과를 회사 갱신/직접 수정과 연결
- Figma: [3135:75991](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75991) / [3135:78459](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-78459) / [3135:81589](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-81589)
- 소유 소스/기존 기록: [src/data/company/contracts.ts:219](../../../../src/data/company/contracts.ts)、[src/components/auth/company-registration.tsx:69](../../../../src/components/auth/company-registration.tsx)

## 완료 기준

- [ ] 회사/계정 소유권·읽기/변경 역할·최신/이전 버전·만료 기준을 기록한다
- [ ] 다운로드/삭제·재업로드 경쟁·처리 실패/복구·감사 기록을 확정한다
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

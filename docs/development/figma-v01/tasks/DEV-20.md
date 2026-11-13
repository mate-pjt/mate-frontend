# DEV-20 · 회사 정보 직접 편집·저장

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: U03
- 선행 작업: [POL-12](POL-12.md) / [DEV-08](DEV-08.md)
- 목적/범위: 확정된 회사 필드의 입력·검증·저장·취소/오류를 구현한다. 이미지 변경은 DEV-21이다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### U03 · 회사 정보 직접 편집·프로필 변경
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **프론트 계약 없음**. 검증: 코드 대조.
- 남은 점: 업종·주소 등 편집/오류/저장, 이미지 변경 권한과 계약
- Figma: [3135:69008](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-69008) / [3135:69602](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-69602) / [3135:70640](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-70640)
- 소유 소스/기존 기록: [src/components/my/my-company-client.tsx:252](../../../../src/components/my/my-company-client.tsx)、[src/data/company/contracts.ts:193](../../../../src/data/company/contracts.ts)

## 완료 기준

- [ ] 필수/길이/형식·업종/주소·nullable·권한을 확인한다
- [ ] 취소/중복·버전 충돌·실패/복구·저장 후 재조회와 모바일을 검증한다
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

<a id="dev-20-pol-12-handoff"></a>

## 2026-11-13 · POL-12 직접 수정 범위/계약 선행 인계

- 승인: [POL-12 사용자 D2와 API별 공백](POL-12.md#pol-12-api-gaps)의 “지원 범위 분리/공백은 계약 선행”. 기존 capability POST 생성/active 중복·inactive 재활성화, PATCH의 amountKrw/assessmentYear/representativeLicense/expectedVersion, certification PATCH의 value/expectedVersion을 활용하는 범위부터 자체 Gate에서 설계한다. capability 생성까지 expectedVersion이 있다고 추정하지 않는다.
- 추가 완료 기준: 공종명 trim/제어문자/200자·현재 업종ID, 정수 원0..20자리/정밀도·nullable 연도1900..서버 KST현재연도·대표면허 true/false/null, 인증3종 YES/NO/UNKNOWN·행없음 version0/기존 exact version·누락키를 검증한다. ADMIN_MANUAL·외부 기준일 null·현재 provenance를 보존한다.
- 필수 계약/DTO Gate: Swagger required와 source 생성자/validation 차이·정확 금액 wire/JSON·실제 wrapper/400/404/409를 확인한다.20자리 금액을 JS number로 반올림·절삭하지 않는다. 미확보 시 해당 경계를 로컬/실제 PASS로 만들지 않는다.
- 전화번호 PATCH는 telephoneNumber만 받고 기대 버전이 없다. 평가 DELETE도 assessmentId만 받고 기대 버전이 없다. 서버가 검사하는 수정/삭제 버전 조건·충돌/최신조회/재시도 계약을 확보하기 전 이 두 UI를 활성화하지 않는다. frontend 사전 GET은 원자 충돌 방어가 아니다.
- 법적 기본정보/주소·업종의 일반 직접 편집은 별도 관리용 변경/필드 불변/버전·provenance 계약 선행이다. 외부 업종 제안 ACCEPT는 DEV-19이며 수기 업종 변경 API로 간주하지 않는다. 인증 증명서 값·회사 VERIFIED와 공공인증을 혼동하지 않는다. 로고는 DEV-21, OCR 적용은 DEV-26이다.
- 권한은 COMPANY_INFORMATION_EDIT와 활성 소속·합치기 제한이며 role/직급으로 허용하지 않는다. [CUPD-10~14/17/18](../../../qa/my-company.md#pol-12-update-qa)의 취소/중복·충돌·실패·명시 재확인·후속조회/계정 경쟁/모바일은 아직 미실행이다. DEV-08 선행/실제 QA 조건·로컬 선행 예외 없음은 보존하며 구현 미착수다.

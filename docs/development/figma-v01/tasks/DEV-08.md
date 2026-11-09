# DEV-08 · 가입 후 회사 실적·인증·희망금액 대시보드

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: M03, M04, O08
- 선행 작업: [POL-06](POL-06.md)
- 목적/범위: 기본 프로필 아래 가입 후에도 실적·인증·희망금액을 조회하도록 확장한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### M03 · 연결 회사의 기본 정보
- 기준선: UI **구현**, 동작 **조회 구현**, 데이터 **API·mock**. 검증: 코드·mock 등록 후 확인.
- 남은 점: 현재는 회사명·인증상태·대표자·번호·업종·주소·전화·설립연도 범위
- Figma: [3134:64574](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3134-64574)
- 소유 소스/기존 기록: [src/components/my/my-company-client.tsx:252](../../../../src/components/my/my-company-client.tsx)、[src/data/company/contracts.ts:171](../../../../src/data/company/contracts.ts)

### M04 · 가입 후 실적·인증 3종·희망금액 대시보드
- 기준선: UI **없음**, 동작 **미구현**, 데이터 **overview 모델에 없음**. 검증: 코드 대조.
- 남은 점: 가입 과정에서 보던 실적/인증/희망금액을 회사 관리 화면에서도 조회하도록 확장
- Figma: [3134:64574](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3134-64574) / [3134:66829](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3134-66829)
- 소유 소스/기존 기록: [src/components/my/my-company-client.tsx:267](../../../../src/components/my/my-company-client.tsx)、[src/data/company/contracts.ts:171](../../../../src/data/company/contracts.ts)、[docs/qa/my-company.md:8](../../../../docs/qa/my-company.md)

### O08 · 조회 실적·인증 표시·대표/직급·희망금액
- 기준선: UI **구현**, 동작 **구현**, 데이터 **API·mock**. 검증: 코드 대조.
- 남은 점: 가입 후 회사 대시보드에서는 재사용되지 않음
- Figma: [3140:123224](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-123224) / [3140:123383](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-123383) / [3140:123469](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-123469)
- 소유 소스/기존 기록: [src/components/auth/company-registration.tsx:69](../../../../src/components/auth/company-registration.tsx)、[src/components/auth/company-registration.tsx:105](../../../../src/components/auth/company-registration.tsx)

- 이어갈 QA 기록: [my-company.md](../../../qa/my-company.md). 기존 case ID와 통과/대기/차단 기록을 보존한다.

## 완료 기준

- [ ] 등록→회사 화면에서 값/연도/null/미보유가 일치하는지 확인한다
- [ ] 미연결/권한·오류·연결 해제·모바일과 기존 기본 정보 회귀를 검증한다
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

<a id="dev-08-pol-06-handoff"></a>

## 2026-11-09 · POL-06 소스 정책 인계 / 필수 재개 조건

이 절은 [POL-06 v1](POL-06.md#pol-06-contract)의 후속 개발 조건만 기록한다. 위 후보 Brief의 빈 항목을 구현 승인으로 바꾸지 않는다. 사용자3답변은 **조회 범위 채택·현재 권한 차이 유지·자원 미준비로 DEV-08 차단**이며, [결정 원문/근거](POL-06.md#pol-06-sources)와 [필수 재개 표](POL-06.md#pol-06-handoff)를 따른다. 구현·실제 API/브라우저 통합은 미착수이고 로컬 구현 선행 예외도 없다.

- 확정 범위: 연결 회사 기본정보 아래 업종/세부 공종별 시공능력(합산 금지)·서버 대표 파생 상태, 인증3종 YES/NO/UNKNOWN·provenance, 서버 기본 최근6개 연도의 저장 공사실적/실제 관측기간, 회사 희망금액 null/ANY·구간을 조회한다. 연도/자료 기준일 미상·빈값/0·누락/비해당/권한 제한/오류를 구분한다.
- 가입과 구분: SignupCompanyProfile의 단일 금액·‘최근’ 제목·반올림 포맷·임시 금액 선택을 현재 회사 저장값으로 재사용하지 않는다. 현재 기본 overview와 가입 모델을 유지하고 별도 회사 관리 계약/DTO 대응을 DEV-08 Gate에서 설계한다. Backend primaryIndustries/updatedAt와 frontend 단일 primaryIndustry의 차이도 그때 확인한다.
- 조회 권한: 시공능력/인증/실적은 실제 정보조회 leaf, 희망금액은 현재 전체 leaf 집합 호환 검사·합치기 잠금 유지. role/직급으로 추정하지 않는다. 희망금액 제한이 다른 조회를 막지 않게 하고 실패/403을 미설정으로 표시하지 않는다.
- 제외: 수정·외부 재수집·변경 제안/이력/as-of/기간 직접 선택·가입 직접 편집·권한 확대·개인 필터 가져오기·의존성 추가. 관련 POL-12/21/22나 기존 QA 차단의 해소가 아니다.
- 성공 기준 보완: 승인된 등록/저장 기대값과 회사 재조회 값을 대조하되 소유 의미가 다른 단일 가입값과 복수 확정값을 억지로 같게 만들지 않는다. 회사/계정/소속 수명·부분 실패·대표3상태·정밀도·모바일/키보드와 기존 기본정보/미연결 흐름을 검증한다. [CDASH-01~12](../../../qa/my-company.md#pol-06-company-dashboard-qa)는 새 계획이며 실제0통과·12차단·실행0건이다. mock/HTTP 대역과 실제 통합을 분리한다.
- 재개 Gate: 배포 schema/version 및 실제 frontend/backend 실행 대응·Origin/인증/오류/권한 bootstrap·합성 권한별 계정/회사와 경계 기대값·사용/잔존/복구 범위·안전한 실패/해제 조건을 [POL-06 재개 표](POL-06.md#pol-06-handoff)대로 확보한다. source SHA만으로 대체하지 않는다. 필요한 등록 mutation은 별도 명시 승인/복구 범위가 필요하다.
- 검증 계획: 새 Brief 뒤 현재 package scripts의 test/lint/build/diff-check, 영향 시 build-storybook, API/mock/hybrid·guard/계정 격리/대형 정수 계약 및 실제 Next/브라우저·실서버 통합·verifier/ai-review. 미실행/외부 차단을 PASS로 표시하지 않는다. 기존 MCO4통과·6차단/AUTH-07·08과 타 QA/정책 승인 예외는 보존한다.
- 담당 역할: API/배포 담당, 합성 fixture 담당, 프론트 QA 실행자, 사용/잔존/복구 승인자. 개인 배정 미확인. 다음 첫 행동은 이 자원과 최신 main/Git·소유 계약/디자인 차이를 다시 확인한 후 DEV-08 요구사항 Gate를 제시하는 것이다. POL-06 문서/Git 전달은 구현 승인·검증 면제가 아니다.

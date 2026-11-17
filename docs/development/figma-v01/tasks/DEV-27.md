# DEV-27 · 팀원 목록·역할·상세 조회

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: T01
- 선행 작업: [POL-14](POL-14.md)
- 목적/범위: 역할별 팀원 목록/상세와 진입 메뉴를 연결한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### T01 · 팀원 목록·역할·상세·정보/권한 변경
- 기준선: UI **메뉴 비활성**, 동작 **미구현**, 데이터 **관리 계약 없음**. 검증: 코드 대조.
- 남은 점: 관리자/팀원/뷰어별 조회와 편집 권한 구현
- Figma: [3137:52702](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52702) / [3137:53331](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53331) / [3137:54225](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-54225)
- 소유 소스/기존 기록: [src/components/my/my-side-menu.tsx:12](../../../../src/components/my/my-side-menu.tsx)、[src/data/company/contracts.ts:193](../../../../src/data/company/contracts.ts)

## 완료 기준

- [ ] 관리자/팀원/뷰어·빈/페이지/오류·상세 접근 권한을 확인한다
- [ ] 탈퇴/변경된 팀원·계정 변경·모바일을 검증한다
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


<a id="dev-27-pol-14-handoff"></a>

## 2026-11-16 · POL-14 확정 정책/계약 인계

- 인계 근거: [POL-14 D1/D2/D3·v1](POL-14.md#pol-14-contract). 원본 T01의 ACTIVE 팀원 목록/상세·메뉴 진입과 조회 계약을 연결하는 단위다. 보낸 초대·받은 신청의 관리 행동/목록은 DEV-29/31, 변경은 DEV-28이며 후속 화면을 무단 삭제/전면 시각 예외로 처리하지 않는다.
- 확정 완료 기준: 현재 회사/계정/leaf로 catalog·내 권한/목록·상세를 같은 company 공급원에서 읽고, page0/기본20/size1..100·total/count·joinedAt ASC/id ASC를 보존한다. 빈 전체/빈 page·loading/오류/401/403/없는 대상·탈퇴한 대상/권한 변화·계정/회사/화면 수명과 재조회·모바일/키보드를 구분한다. role 이름만으로 허용하지 않고 페이지3/행9 capabilities의 조회 시점 의미를 유지한다.
- D2 상세 기준: Figma3137:53331/54225의 생년월일·전화번호 자리/라벨을 남기고 **미제공**으로 표시한다. nullable 이름/이미지/lastLoginAt을 다른 개인정보·가짜 날짜로 합성하지 않는다. 상세 전체·프레임 재설계의 예외 승인으로 확대하지 않는다.
- 현재 backend/Swagger에는 members 목록/상세·memberships/me·company-permission-definitions와 flags가 있다. 과거 ‘관리 계약 없음’을 현재 backend 부재로 반복하지 않는다. 현재 프론트 관리 route/Repository는 미연결이며 여기서는 구현하지 않았다.
- 검증 연결: [TEAM-01~04/23/26](../../../qa/team-members.md#pol-14-team-qa), Figma3137:52702/53331/54225와 각 상태를 자체 Brief에서 대조한다. 실제 조회 자원과 구현 검증을 확보한 뒤 실제/API/mock/HTTP대역 결과를 분리한다.

- 이 append는 POL-14의 정책/계약·완료 기준 인계다. 이 Task의 실행/Implementation Brief·설계/제품·실제 QA·Git 전달을 시작한 것이 아니다. 현재/다음/상태는 WBS만 소유한다. 원본2026-10-27 관찰·미작성 Brief·기존 체크리스트/QA는 보존한다.
- 공통 재개 Gate: 최신 Git/main·이 선행 결정/현재 source·게시 Swagger/실행 대응을 확인하고, 자체 성공 기준·수정 파일/영향·검증을 제시한다. `data-access.md`의 같은 company 공급원·public 포트/HTTP/DTO 경계·immutable snapshot/운영 guard·계정 격리를 지킨다. 새 library/endpoint/필드·fallback을 임의 만들지 않는다.
- 실제 업무 GET/변경·메일/초대/직급 실행은 승인된 합성 회사/계정·현재 leaf/상태/버전·환경/Origin/실행 SHA 대응·사용/소비/잔존/복구 범위와 자원 담당 역할이 필요하다. 이번 정책/Git/Chromatic 예외는 해당 자원 확보·실제 QA 면제/로컬 선행 승인이 아니다. 이전 QA-08 AUTH-16 0통과1차단·초대 AUTH-17 미실행과 다른 가입/회사·DEV-08/MAT-162 등 차단을 보존한다.


<a id="dev-27-pol-14-selection"></a>

## 2026-11-16 · POL-14 뒤 다음 Task 선정/첫 행동

- [POL-14 정책 문서 종료](POL-14.md#pol-14-close)에 따라 선행을 충족하는 P2 기본 표 순서 첫 팀원 개발 단위로 선정/인계했다. 기존 P0/P1 차단과 앞선 P2의 DEV-08·DEV-24/26/MAT-162·다른 Task 선행을 바꾸지 않는다. 현재/다음/상태는 WBS만 소유한다.
- 다음 첫 행동: 새 대화에서 최신 Git/main·이 후보의 원래 범위/완료 기준과 POL-14 D1~D3·TEAM QA 계획, 그때의 backend/개발 Swagger·Figma3137:52702/53331/54225의 목록/상세/오류/모바일 상태를 확인한다. 현재 company/leaf·page/count/ASC·3page/9row flags·nullable/미제공·계정/회사 수명과 안전한 실제 조회 계정/회사·실행 대응/사용·잔존·복구 범위를 확인해 자체 Brief·수정 파일/영향/검증을 먼저 제시한다.
- 이번에는 POL-14 소유의 정책/후속 기준·선정/인계만 작성했다. 이 Task의 전용 조사·요구사항 확정/설계·제품/Repository·실제 업무/QA·Git 전달을 시작하지 않았다. POL-14의 Git/Chromatic 예외·정책 문서 PASS가 이 Task의 실제 자원 준비·로컬 선행/통합 면제 승인은 아니다.


<a id="dev-27-mat-290-handoff"></a>

## 2026-11-17 · MAT-290 연결과 표시 데이터 재확인 조건

- [MAT-290](https://linear.app/mate-pjt/issue/MAT-290/backend-팀원-목록상세-응답에-생년월일휴대전화번호-추가)은 팀원 목록 `GET /api/v1/companies/{companyId}/members`의 content 각 행과 상세 `GET /api/v1/companies/{companyId}/members/{membershipId}`에 계정의 birthDate/mobilePhone을 연결해 달라는 외부 요청이다. 11/17 조회 Backlog이며 요청안·이슈 상태를 최종 계약/배포·실제 지원으로 간주하지 않는다. 개인 선택 입력 정보이며 회사 대표 전화나 인증/복구 수단과 구분한다.
- API 지원 확인 전에는 기존 [POL-14 D2](POL-14.md#pol-14-contract)의 자리/라벨 유지·**미제공 표시**를 유지한다. 이슈 생성/Done·계정 필드·source/Swagger만으로 실제값을 표시하지 않는다. MAT-290을 이 Task 전체의 신규 선행/차단으로 만들지 않으며 현재 상태는 WBS가 소유한다.
- 반영 소식 뒤 [POL-14 재확인 Gate](POL-14.md#pol-14-mat-290-handoff)를 따른다. 답변/확정 계약과 고정 source/DTO·조회/mapper/테스트, CI/개발 배포·게시 Swagger·실행 대응·실제 두 응답을 나눠 확인한다. 필드명/경로·타입·날짜/전화 표현·각각 null/누락 직렬화·조회 권한과 기존 page/count/정렬/capabilities/오류를 대조한다. 일부 지원/미확인은 구분하고 해당 부분의 미제공을 유지한다.
- 실제 값 표시 연결은 지원 확인 후 이 Task **자체 Brief·수정/검증 Gate**에서 판단한다. 승인된 합성 회사/계정·조회/개인정보·환경/실행 대응·사용/잔존/복구 범위로 값 존재/각각 null·목록상세 일치·권한/계정·회사/화면 수명·오류/날짜/전화·Figma/모바일/접근성을 검증하고 해당 QA에 기록한다. 현재 TEAM-03의 미제공 계획·TEAM26 실제0통과26대기·AUTH-16/17/다른 차단·예외는 보존한다.
- 이번11/17 사용자는 POL-14 소유 문서의 연결/재개 조건과 검증·리뷰/Git 전달만 승인했다. 이 Task의 전용 조사·Brief/설계·구현·Repository/DTO/mock·실제 업무 QA·별도 Git 전달은 시작하지 않았다. 다음 첫 행동에 MAT-290 현행 답변/지원 여부와 위 Gate를 함께 확인하되 무조건 API 반영까지 대기하는 새 선행으로 바꾸지 않는다.

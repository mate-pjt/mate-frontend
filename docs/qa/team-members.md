# 팀원 권한·초대·합류·직급 브라우저 통합 QA 계획

<a id="pol-14-team-qa"></a>

## 기준과 증거 경계

- [POL-14 확정 정책 v1](../development/figma-v01/tasks/POL-14.md#pol-14-contract)·[후속 소유/재개](../development/figma-v01/tasks/POL-14.md#pol-14-handoff), 사용자2026-11-16 D1~D3의 미제공/행동별 안내·만료 후 새 초대 기준을 따른다.
- 이 파일은 **TEAM-01~26의 미실행 계획**이다. 정책/문서 검증·source/schema 열람은 제품/실제 업무 API·메일·실행 SHA/통합 PASS가 아니다. Task 현재/다음/상태는 [WBS](../development/figma-v01/README.md)만 소유한다.
- 화면 route·동의 상세/알림 경로/정확한 반응형 시안은 각 개발 Task의 자체 Gate에서 source·Figma 상태와 함께 확정한다. 이 계획은 route를 임의 생성/승인하지 않는다. DEV-33 목적지는 POL-15가 선행이다.
- source/배포/게시 명세는 POL-14 조사표의 고정 SHA와 공개 OpenAPI를 따른다. 실제 실행 SHA 대응·wire 성공 wrapper(`isSuccess`와 게시 `success` 차이)·현재 필드/오류를 실제 QA 때 별도 확인한다.
- [기존 QA-08](auth.md#qa-08-20261102) AUTH-16 실제0통과1차단·초대 AUTH-17 미실행·회사/가입/문서/DEV-08·MAT-162 및 타 Task의 승인 예외를 보존한다. TEAM 사례를 원래 사례의 통과로 소급하지 않는다. POL-14 Git/Chromatic 예외는 실제 QA·로컬 선행 면제가 아니다.

## 실행 환경과 선행 Gate

| 실행일시 | 프론트 URL/commit | backend source/배포/실행 대응 | 브라우저/크기 | 자원 별칭 | 수행자/복구 |
| --- | --- | --- | --- | --- | --- |
| 미실행 | 개발 Task 자체 Gate에서 확보 | source/게시 명세 조사만, 실행 대응 미확인 | desktop·mobile/키보드·브라우저 버전은 실제 실행 때 기록 | 아래는 합성 역할 분류이며 실제 자원 미할당 | 담당 역할/변경·잔존·복구 미확보 |

1. API/QA 담당 역할이 승인된 합성 회사·관리자2명 이상/유일 관리자·AGENT/VIEWER/추가 leaf·대표자/공석·읽기 전용·다른 회사/계정·초대/신청/일반 직급/version 상태와 오류/경쟁 자료를 마련한다. 개인 담당자를 임의 지정하지 않는다.
2. 조회/개인정보 노출 범위와 명령·메일 수신처/메일함·초대 소비/소속/직급 변경·잔존/복구 범위를 실제 실행 전에 승인받는다. 예외/복구 불가능 자원은 disposable로 특정하며 Git 승인을 실행 승인으로 해석하지 않는다.
3. 프론트/API Origin·OAuth/cookie/CORS·실행 SHA 대응·환경 식별자와 안전한 Network/화면 관측, 변경 전후 조회/복구 방법을 확보한다. 필요하더라도 env 실제 값·token/cookie/인증 거래·초대/서명 URL·메일/개인정보 원문을 증거에 남기지 않는다.
4. 선행 개발·자체 Brief·자동/브라우저 검증/Review Gate와 POL-15 등 정책 선행을 확인한 뒤 해당 사례만 실행한다. 사전조건 미충족이면 차단/재개 조건을 기록하며 대기를 통과로 바꾸지 않는다.

## 테스트 사례

모든 사례의 현재 환경/증거는 **미실행**, case 상태는 **대기**다. 각 실행 때 시각·프론트/API 식별자·브라우저/크기·비식별 단계/Network·복구를 사례별로 추가한다. 원본 case ID를 유지하고 mock/HTTP대역/실제 결과를 따로 기록한다.

### TEAM-01 — 현재 회사/leaf와 역할 추가 권한

- 소유: DEV-27. Figma 기준: [3137:52702](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52702). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `GET /api/v1/companies/{companyId}/members, …/memberships/me; GET /api/v1/company-permission-definitions`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: 같은 회사 ADMIN·AGENT·VIEWER와 추가 초대 leaf VIEWER, 다른 회사/비소속 별칭. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: 각 별칭으로 목록/직접 상세를 읽고 허용/비허용 행동을 비교한다.
- 예상 결과: 현재 leaf/회사 경계·role 배지와 행동 가능 여부를 구분하며 다른 회사 자료를 반환/노출하지 않는다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-02 — 목록·빈 결과·페이지/정렬

- 소유: DEV-27. Figma 기준: [3137:52702](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52702). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `GET /api/v1/companies/{companyId}/members?page=…&size=…`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: 0/1/21건 ACTIVE 팀원·빈 뒤 page의 합성 회사. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: 기본/두 번째/빈 page·경계 size를 조회하고 왕복한다.
- 예상 결과: page0/기본20/1..100·count/totalPages·joinedAt ASC/id ASC를 보존하고 전체0건·빈 page·조회 오류를 구분한다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-03 — 상세 nullable와 미제공 예외

- 소유: DEV-27. Figma 기준: [3137:53331](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53331) · [3137:54225](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-54225). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `GET /api/v1/companies/{companyId}/members/{membershipId}`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: 이름/이미지/lastLoginAt nullable와 일반 상세의 합성 팀원. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: 각 상세를 열어 서버 필드/결측과 Figma 자리·라벨을 대조한다.
- 예상 결과: 생년월일·전화번호는 자리/라벨을 유지해 미제공. 이름/최근 로그인은 결측을 구분하고 다른 개인정보/가짜 값·새 API를 만들지 않는다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-04 — 페이지/행 capabilities와 읽기 전용

- 소유: DEV-27. Figma 기준: [3137:52702](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52702) · [3137:53331](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53331). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `members 목록/상세 GET`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: 직접/동의/본인·최후 관리자·대표자 공석/있음·READ_ONLY_MEMBER 별칭. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: 각 상태의3page/9row flags와 화면 진입·비활성 사유를 비교하고 조회 후 조건을 바꿔 확인한다.
- 예상 결과: flags는 조회시점 안내이며 저장 성공 보장이 아니다. READ_ONLY_MEMBER의 변경은 모두 금지하고 권한 변화 뒤 최신 상태를 따른다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-05 — 낮은 대상 직접 변경·과도 부여 금지

- 소유: DEV-28. Figma 기준: [3137:53331](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53331) · [3137:54225](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-54225). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `PATCH /api/v1/company-memberships/{membershipId}/position 또는 …/permissions`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: 행동 leaf 보유 actor·낮은 일반 대상·actor 밖 leaf. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: 최신 version으로 직급/최종 전체 leaf를 변경하고 허용 밖 집합도 제출한다.
- 예상 결과: 동작별 leaf·actor 부분집합·target 등급·최신 version을 검사한다. 금지된 상승은 성공으로 표시하지 않는다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-06 — 동의 필요한 변경 생성/대기

- 소유: DEV-28. Figma 기준: [3137:53331](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53331) · [3137:54225](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-54225). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `POST /api/v1/company-memberships/{membershipId}/change-requests; 회사/본인 요청 GET`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: 동급·대표자 대상·낮은 비ADMIN의 ADMIN 승격/대표자 지정. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: 허용된 kind/UUID/version으로 제안하고 대상 응답 전 현재 소속을 읽는다.
- 예상 결과: CREATED와 APPLIED를 구분하고 PENDING 동안 현재 권한/직급을 유지한다. 높은 대상·금지 부분집합은 동의 요청으로 우회하지 못한다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-07 — 동의 결정·취소·오래된 제안/무기한

- 소유: DEV-28. Figma 기준: [3137:53331](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53331). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `GET …/membership-change-requests; POST /api/v1/company-membership-change-requests/{changeRequestId}/decisions 또는 …/cancellations`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: 본인 대상/타인·정당한 발행자 퇴사·target/version/직급 정의 변경 별칭. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: 수락/거절·권한 있는 회사 취소, 무응답 시간 경과·발행자 퇴사·target 변경을 각각 확인한다.
- 예상 결과: 본인만 결정·현재 담당자만 취소. 자동 만료/무응답 적용 없음, 발행자 퇴사만으로 무효화하지 않되 target/제안 정의 변경은 INVALIDATED·최신 상태로 구분한다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-08 — 마지막 관리자·대표자 해제·경쟁

- 소유: DEV-28. Figma 기준: [3137:53331](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53331). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `self-demotion/leave POST; membership DELETE; 요청 decisions POST`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: 유일/둘 이상 ADMIN·대표자·합치기 미반영 대상과 경쟁 세션. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: 관리자 강등/소속 종료·동의 수락을 경합시키고 대표자 해제+ADMIN 유지도 실행한다.
- 예상 결과: 유효 활성 ADMIN 최소1을 transaction에서 유지한다. 대표자 system 정의 보호와 소속 해제/ADMIN 상실을 구별하고 유일 ADMIN의 권한 유지 직급 해제는 허용한다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-09 — 본인 권한 축소/대표자 취임·회사 범위

- 소유: DEV-28. Figma 기준: [3137:53331](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53331) · [3137:54225](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-54225). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `POST …/{membershipId}/self-demotion, …/leave; PATCH …/position`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: 본인/타인·VIEWER 최소·대표자 공석/기존 대표자·타회사 일반 직급. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: 부분집합 축소와 새 leaf 추가·잘못된 본인/직급, 공석 ADMIN 본인 취임을 비교한다.
- 예상 결과: 본인 전용/최소 VIEWER·일반 직급·현재 ADMIN/대표자 공석 제약을 따르고 타인/다른 회사·일반 permission PATCH로 우회하지 못한다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-10 — version·UUID replay/no-change·미확정

- 소유: DEV-28. Figma 기준: [3137:53331](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53331). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `membership PATCH/POST/DELETE와 change-requests·decisions·cancellations`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: 현재/과거 membership/request version·동일/상이 UUID payload·유실/5xx/손상2xx. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: 같은 내용/다른 내용 재요청·UUID 충돌·no-change와 응답 유실 뒤 명시 조회를 수행한다.
- 예상 결과: endpoint별 version/key/CREATED·REUSED·NO_CHANGE 의미를 보존한다. 다른 제안은 명시 취소가 필요하며 자동 재변경·중복 알림/성공 오인은 없다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-11 — 일반/대표자 초대 입력과 grant

- 소유: DEV-29. Figma 기준: [3137:52847](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52847). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `POST /api/v1/companies/{companyId}/membership-invitations`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: 일반/대표자·미등록/등록 확인 이메일 별칭·새/기존 직급·권한 조합. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: 유효/누락·중복 위치 선택·대표자 payload/공석·권한 경계로 제출한다.
- 예상 결과: 현재 필드/길이·직급 XOR·PROFILE_EDIT/VIEWER 초과 MANAGE·부분집합·대표자 ADMIN/공석을 따른다. 등록 이름/초대 이메일을 임의 덮어쓰지 않는다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-12 — 초대 관리 leaf와 서버 거부

- 소유: DEV-29. Figma 기준: [3137:52847](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52847). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `membership-invitations POST/GET/PATCH`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: 추가 invite leaf VIEWER·invite 없음·PROFILE_EDIT/MANAGE 없음·다른 회사 별칭. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: 기본 VIEWER 초대와 새 직급/추가 권한·대표자 초대·다른 회사 요청을 비교한다.
- 예상 결과: role 이름으로 일괄 허용/금지하지 않고 요청별 leaf·추가 제약/회사 경계를 지킨다.403을 빈/성공으로 바꾸지 않는다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-13 — 초대 중복·이미 소속/신청·조회

- 소유: DEV-29. Figma 기준: [3137:52847](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52847) · [3137:53069](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53069). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `membership-invitations POST/GET/상세`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: 동일 회사/이메일 pending·활성 소속·같은 회사 신청·모호한 확인 이메일. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: 중복/경합 초대와 보내는 목록·상세/page를 확인한다.
- 예상 결과: CI002/CI010/CI011·활성 소속 충돌과 version/이력을 보존한다. ACTIVE 팀원/초대/신청의 서로 다른 count/순서를 첫 page로 합성하지 않는다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-14 — 미만료 재발송·취소와 이전 링크

- 소유: DEV-30. Figma 기준: [3137:52911](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52911) · [3137:52990](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52990). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `POST …/membership-invitations/{invitationId}/resend; DELETE …/{invitationId}?expectedVersion=…`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: 미만료 PENDING·현재/과거 version·이전 delivery/handoff 별칭. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: 중복 클릭·재발송/취소를 수행하고 이전 링크와 최신 초대 상태/메일을 확인한다.
- 예상 결과: 새 token/deliveryVersion/실제 expiresAt·구 대기 SUPERSEDED를 구분한다. 취소된/이전 링크를 소비할 수 없고 자동 재발송/취소는 없다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-15 — 만료 경계의 새 초대 기준

- 소유: DEV-30. Figma 기준: [3137:52911](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52911) · [3137:52990](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52990). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `기존 초대 GET, 사용자 명시 새 작성 후 DEV-29 POST`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: expiresAt 직전/직후·DB PENDING 잔존/EXPIRED 확정·단말 시계 차이·요청 중 만료. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: 만료 표시/버튼과 전송 요청을 관찰하고 새 초대 작성 안내 뒤 명시 생성한다.
- 예상 결과: 만료 뒤 기존 resend/cancel0·새 생성 자동0, D3를 DB 상태와 무관하게 지킨다. 새 명령은 최신 권한/중복·서버 최종 거부를 따른다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-16 — 초대 상태와 메일 전송/수신 분리

- 소유: DEV-29/30. Figma 기준: [3137:52847](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52847) · [3137:52911](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52911). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `membership-invitations GET/POST/resend와 승인된 메일 관측`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: delivery PENDING/SENDING/SENT/FAILED/SUPERSEDED·응답 유실·수신함 관측 별칭. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: 생성/재발송 후 상태를 읽고 허용된 메일함의 수신을 따로 확인한다.
- 예상 결과: 명령 성공·메일 어댑터 성공·수신함 도착/수락을 따로 기록한다. FAILED/미확정은 자동 재초대하지 않고 비밀 링크/개인정보 원문을 증거에 남기지 않는다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-17 — 초대 수신 회귀·한번 소비/계정 일치

- 소유: DEV-29/30. Figma 기준: [3137:52847](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52847). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `기존 preview/resume/acceptance/decline POST`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: 수신자/다른 Google 확인 이메일·활성 소속·과거 링크/만료·회사 변경 잠금. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: 발송한 합성 초대를 기존 수신 흐름으로 미리보기/로그인·수락/거절하고 명시 재조회한다.
- 예상 결과: 이메일 일치·현재 version/상태/회사 잠금·일회성 handoff를 따르고 실제 소속 생성/다른 pending 정리를 확인한다. QA-08 AUTH-16/17 이력을 대체하지 않는다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-18 — 신청 목록/상세와 검토 leaf

- 소유: DEV-31. Figma 기준: [3137:53069](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53069) · [3137:53154](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53154). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `GET /api/v1/companies/{companyId}/membership-requests와 …/{requestId}`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: REVIEW 보유/없음·다른 회사·0/21건 신청/상태 별칭. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: 목록/상세·page와 권한 거부를 비교한다.
- 예상 결과: LIST_VIEW만으로 검토 데이터를 읽지 못한다. createdAt ASC/id ASC·page/count·requested/applied/status/version·이력을 보존한다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-19 — 신청 승인과 최종 권한/대표자·동시성

- 소유: DEV-31. Figma 기준: [3137:53154](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53154). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `POST …/membership-requests/{requestId}/approval`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: 원 직급/다른 직급·VIEWER 초과·대표자 요청/비요청·대표자 공석/있음·다른 회사 가입 경쟁. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: 최신 request version으로 각 승인 조건·경합을 수행하고 소속/신청을 재조회한다.
- 예상 결과: PROFILE_EDIT/MANAGE·부분집합·대표자 원요청/ADMIN/공석·payload 제약과 원자 소속 생성/다른 pending 정리·최신 이력을 확인한다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-20 — 신청 거절 사유·취소/처리 경합

- 소유: DEV-31. Figma 기준: [3137:53193](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53193). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `POST …/membership-requests/{requestId}/rejection; 기존 본인 신청 DELETE와 조회`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: 공백/1/300/초과 사유·최신/과거 version·본인 취소/다른 reviewer 처리. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: 사유 거절과 동시에 본인 취소/다른 결정을 시도하고 양쪽 상태를 재조회한다.
- 예상 결과: trim1..300·version을 지킨다. CANCELED/APPROVED/REJECTED/미확정과 거절 사유·신청자 상태를 구분하고 자동 재결정하지 않는다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-21 — 공유 직급 생성/이름 변경

- 소유: DEV-32. Figma 기준: [3137:53220](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53220) · [3137:53254](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53254) · [3137:53288](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53288). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `GET/POST /api/v1/companies/{companyId}/positions; PATCH …/{positionId}`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: 조회/관리 leaf·여러 구성원이 참조한 일반 직급·경계 이름/동시 중복. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: trim·1/30/초과·공백/제어문자·대표자/중복 이름을 생성·rename하고 구성원/이력을 읽는다.
- 예상 결과: POSITION_MANAGE·회사 범위·현재 version/CP002/CP003/CP005를 따른다. 같은 ID의 전체 참조 이름이 바뀌며 개인 한 명 정보만 변경한 것으로 안내하지 않는다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-22 — 직급 삭제·system/사용중/과거 보존

- 소유: DEV-32. Figma 기준: [3137:53220](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53220). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `DELETE …/positions/{positionId}?expectedVersion=…; positions/멤버 GET`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: system·ACTIVE 참조 있음/없음·타회사·과거 version·과거 소속 참조. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: 각 삭제/경합과 삭제 후 같은 이름 새 생성·과거 참조를 확인한다.
- 예상 결과: CP001~005·권한/사용중·system불가·soft delete/과거 이력·새 ID를 구분한다. 타인 소속을 임의 바꾸거나 과거 행을 지우지 않는다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-23 — 계정·회사·화면 수명/접근성·오류

- 소유: DEV-27~33. Figma 기준: [3137:52702](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52702) · [3137:53331](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53331). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `해당 Task의 보호 GET/명령`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: 401 refresh/최종401·403/404/409·늦은 응답·계정/회사/권한 교체·모바일/키보드. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: 요청 중 이동/로그아웃·권한 변경·복귀/새로고침, loading/오류·명시 재시도와 좁은 화면/키보드를 확인한다.
- 예상 결과: 이전 자료/완료 Toast/자동 명령 재생0·권한 없는 자료 비노출, 성공 후 조회 실패/미확정을 구별하며 초점·키보드·안내/모바일 기준을 지킨다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-24 — 수락 완료 목적지/폴백

- 소유: DEV-33. Figma 기준: [3141:56172](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3141-56172). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `기존 수락/세션/현재 회사·권한 GET과 POL-15 확정 목적지`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: 수락 성공/세션 갱신 실패·다른 계정·권한/회사 변경·이전 next/새로고침. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: POL-15 승인 뒤 실제 DEV-27 화면으로 완료 CTA·폴백/Back/reload를 검증한다.
- 예상 결과: POL-15 이전에는 목적지를 정하지 않는다. 최신 접근 가능성·안전 내부 경로/확인된 성공을 유지하고 역할 문자열로 자동 이동을 허용하지 않는다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-25 — 동의 알림·안전 route/현재 target

- 소유: DEV-28. Figma 기준: [3137:53331](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53331). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `알림 목록/읽음 GET/PATCH·변경 요청 상세/decisions/cancellations`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: 소유/다른 계정·지난 소속·무효/완료 요청·위험/미지원 actionPath. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: 자체 Gate에서 승인한 상세 경로·allowlist에 맞춰 알림을 열고 별도 명시 결정한다.
- 예상 결과: 알림 읽음/클릭은 수락이 아니다. 현행 POL-04 allowlist·계정/회사/target/version을 검증하고 과거 이력을 새 소속 권한으로 재사용하지 않는다. 새 route/화면 전체 예외는 자체 Gate다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

### TEAM-26 — Repository/mock·실제 통합 증거 분리

- 소유: DEV-27~32. Figma 기준: [3137:52702](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52702). 동의/오류 등 미표현 상태는 해당 Task Gate에서 추가 대조하며 pixel PASS를 주장하지 않는다.
- API/경계: `company 공개 포트·HTTP/DTO/mock 계약/프로필 검증`. 화면 route: 해당 개발 Task 자체 Gate에서 확정.
- 준비 데이터/자원: api/mock/hybrid·합성 role/leaf/상태·계정 저장소/손상·운영 guard. 실제 계정/메일/ID 미할당이며 위 실행 Gate가 선행이다.
- 조작: 해당 개발의 계약/구성별 build·mock/HTTP대역·실제 브라우저/서버 통합을 각각 검증한다.
- 예상 결과: 기존7그룹·static qna/immutable snapshot·운영 guard/격리·자동 fallback0·실제 데이터의 mock 복사0를 지킨다. mock/대역/source 게시 확인을 실제 통합 PASS로 올리지 않는다.
- 상태/환경·증거/복구: **대기 · 미실행**. 실행 담당·결함/재검증은 해당 개발 Task에서 기록.

## 2026-11-16 · 정책 계획 결과

- 실제 통과0 · 실패0 · 차단 사례로 실행한0 · 대기26. 현재 실행 Gate의 자원/실행 대응·사용/복구 승인은 미확보이며 제품 구현도 후속이다. 대기26을 실제 검증의26차단/통과로 집계하지 않는다.
- POL-14에서는 문서/계약 정적 조사와 후속 기준·QA 계획만 검증한다. 실제 업무 GET/명령·메일·권한/직급·운영/배포 실행0이다. 정책 완료와 제품/실제 API 통합·main 반영은 별개다.
- 목록/상세의 첫 자체 Gate 후보는 DEV-27, 동의 변경 DEV-28·초대 DEV-29/30·검토 DEV-31·직급 DEV-32는 각 선행과 자체 승인 범위를 확인한 뒤 시작한다. DEV-33의 POL-15/DEV-27 선행과 기존 AUTH QA를 유지한다. 이번에는 어느 개발 Task도 실행하지 않았다.

<a id="dev-27-local-qa"></a>

## 2026-11-17 · DEV-27 조회의 로컬 검증과 실제 QA 차단

- 실행 단위: DEV27-20261117. 사용자 [이번 Brief/D1](../development/figma-v01/tasks/DEV-27.md#dev-27-brief)의 로컬 선행·실제 API QA 차단 보존 결정이다. 위11/16 정책 계획/대기26과 다른 Task의 실제 결과/예외를 덮어쓰지 않는다.
- 환경: Node22.20.0/pnpm11.3.0·Next16.2.9 webpack, `.env*` 없는 격리 소스 복사본. Aside Chromium1920×1080/390×844. mock `company=connected`, HTTP 대역은 loopback3028→3127의 합성 응답/CORS이며 실제 개발 서버/계정/개인정보·실제 회사/문서/메일을 사용하지 않았다.
- 실제 backend 확인 수준: 고정 dev `adc0e265…`·CI run43389204151 success, 개발 OpenAPI200/지문 무변경·3page/9row/nullable·count/ASC와 catalog15leaf3분류를 재확인했다. 실행 process SHA·실제 업무 응답/wrapper·권한 집행은 미확인이다. MAT-290 Done·댓글0과 DTO/명세의 두 필드 부재를 구분해 D2 미제공 유지다.

| 대상/근거 | 이번 로컬 결과 | 실제 API/후속 범위 |
| --- | --- | --- |
| TEAM-01 · 현재 회사·leaf·ADMIN/AGENT/VIEWER/추가 leaf | PASS · HTTP/단위·브라우저에서 role 요약과 권한 구분, VIEWER+초대 leaf는 초대 권한 표시, 기본정보 profile GET 추가0 | DEV-27 조회 부분 차단 · 승인 합성 회사/계정·현재 권한/실행 대응·열람 범위 미확보 |
| TEAM-02 · 목록/빈 값/페이지/count/ASC | PASS · mock23명/20+3·목록2page→상세→동일 page 복귀, HTTP 전체 빈 값/범위 밖 page와 0-based API·size1..100, 정밀 시각 정렬 | 같은 실제 조회 자원/비식별 fixture·정렬/count 검증 필요 |
| TEAM-03 · 상세/nullable/D2 | PASS · exact 대상·없는/탈퇴 대상404·변경된 직급/역할 재조회, null 이름/로그인/프로필, 생년월일/핸드폰번호 미제공·추가 wire 개인정보/계정ID 폐기 | 실제 값 표시 연결은 MAT-290의 지원/실응답 재확인 후 별도 Gate. 미지원 자리 미제공 유지 |
| TEAM-04 ·3page/9row flags | PASS · HTTP/계약·mock의 읽기 전용 전체 false, 직접/동의/금지 표시와 후속 변경·초대·신청/직급 관리 disabled, 업무 명령0 | 조회 당시 flags와 실제 서버 거부·회사 상태 조합은 실제 QA 차단. 변경 실행은 DEV-28~32 |
| TEAM-23 · DEV-27 계정/회사/화면 부분 | PASS · 단위의 늦은 계정/epoch/Abort 응답 폐기·회사/소속/leaf 재확인, 브라우저 회사 전환/복귀·로그아웃/세션 만료·보호 자료 숨김 | 이 조회 부분은 실제 QA 차단. 다른 Task 소유의 명령/직급/초대 수명은 대기 유지 |
| TEAM-26 · DEV-27 Repository 부분 | PASS ·7그룹/config·api/mock/hybrid/운영 guard/저장소·아키텍처 회귀, HTTP 대역의 최종401/403/404/503·wrapper 거부. 실제 Next·공급원 격리 | 이 조회 부분은 실제 QA 차단. source/게시·mock/대역·build를 실통합 PASS로 올리지 않음 |

### 브라우저 증거/한계

- [20개 관찰 PASS·추가1개 미실행의 원시 판정](assets/dev-27/dev27-browser-results.json): 키보드 Enter/Space 펼침,4역할/권한 상태,6접근/빈/회사 상태, 페이지 복귀/로그아웃, 변경/탈퇴/nullable·범위 밖 page/잘못된 ID, 회사 전환·세션 만료. 새로고침/직접 URL을 사용했고 UI가 받아들인 결과로 판정했다.
- 추가 점검 `background-conceals-detail`은 Aside target API가 탭을 다시 활성화해 실제 visibility hidden 이벤트0이었다. 첫 시도의 false를 제품 FAIL로 오인하거나 PASS로 바꾸지 않고 **UNEXECUTED**로 기록했다. 진짜 hidden 상태의 DOM/화면 전수 검증은 남아 있다. 기본 Abort·화면 종료/계정/회사 변경은 별도 단위 및 브라우저 로그아웃/복귀로 확인했으며 이 증거가 genuine hidden 이벤트를 증명하지는 않는다.
- desktop1920px/모바일390px에서 문서 가로 넘침0, 모바일 표는850px을343px 지역 안에서 스크롤했다. main landmark1·native details 키보드·권한 checkbox/저장 disabled를 확인했다. UI 자산3개 로드 성공·Figma 원본 크기20×20/13×18/약20×16.67이며 나머지 헤더/메뉴/기본 프로필은 기존 자산이다. 초기 탭 stretch/글꼴·role 색과 fractional Image 경고는 최소 교정했다.
- mock resource의 외부 origin 요청0. HTTP 대역은 보호 GET과 기존 auth refresh POST만 사용했고 **업무 mutation0**이다. 실제 서버 호출/메일·가입·문서 처리/운영·배포0. 테스트 자원은 합성 메모리/탭 공간뿐이며 QA 서버는 종료 시 정리한다.

| 화면 | Figma/정합성 경계 | 캡처 |
| --- | --- | --- |
| 목록 | [3137:52702](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52702) · 표·역할·탭·메뉴/아이콘 유지. 신청/직급 자리는 후속 준비 중, 현재 조회 기능 설명/새로고침·페이지/결측 상태 추가 | [desktop](assets/dev-27/dev27-http-list-desktop.png) · [mobile](assets/dev-27/dev27-http-list-mobile.png) |
| 상세 관리자/팀원·뷰어 | [3137:53331](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-53331) · [3137:54225](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-54225) · 개인정보4자리·직급·역할·권한·목록 복귀 유지. D2 두 자리 미제공은 명시 한정 예외. 현재 catalog의3분류/15leaf·명칭은 POL-14 D1 계약의 기능 기준이며 Figma2분류 전체 화면 예외로 부르지 않음 | [desktop](assets/dev-27/dev27-http-detail-desktop.png) · [mobile](assets/dev-27/dev27-http-detail-mobile.png) |

모든 frame/child/prototype·pixel 전수 PASS가 아니다. 현재 HTTP 계약에는 Google 연동 확인 필드가 없어 연동/검증 완료를 합성하지 않았다. 변경 컨트롤은 DEV-28 소유로 준비 중이며 실제 권한 변경 완료를 주장하지 않는다.

### 실제 QA 재개 조건

실제 통과0이다. TEAM-01~04와 공통23/26의 **DEV-27 조회 부분**은 합성 actor/회사·현재 leaf/상태·Origin/실행 SHA 대응·개인정보 열람/사용·잔존/복구 범위와 담당 역할을 확보해야 재개한다. 다른20개 및 공통 case의 후속 소유 범위는 기존 대기다. 사용자 로컬 선행은 실제 QA 면제/서버 반영 승인이 아니며 AUTH-16 0통과1차단·AUTH-17 미실행과 QA-08·회사/가입/문서의 기존 차단을 유지한다. MAT-290의 두 필드 표시 재개는 [별도 지원 확인 Gate](../development/figma-v01/tasks/DEV-27.md#dev-27-mat-290-handoff)를 따른다.

<a id="dev-27-link-regression"></a>

### DEV-27 독립 Major1 수정 뒤 링크 회귀

- 첫 verifier FAIL: `onClick={conceal}`4곳이 Cmd/Ctrl 수정 클릭에도 현재 자료를 지울 수 있었다. 실제 SPA 이동만 처리하는 `onNavigate={conceal}`로 변경했다. 일반 링크·준비 중 변경 기능의 범위는 그대로다.
- [네이티브 회귀 판정](assets/dev-27/dev27-link-regression.json): 설치된 캐시의 Playwright CLI를 offline으로 재사용한 별도 Chromium에서 키보드 Meta down→링크 클릭→Meta up으로 **원래 목록 유지+상세 새 탭**, **원래 상세 유지+목록 새 탭**을 확인했다. Control 클릭의 원래 목록 유지와 일반 목록 복귀도 PASS.4관찰에서 원래 URL/표·상세/새로고침 enabled를 확인했다. 콘솔 오류0, 기존 개발 폰트 preload 타이밍 경고1은 범위 밖이다.
- Aside가 modifier 옵션을 일반 클릭으로 처리한 시도와 비신뢰 DOM MouseEvent 시도는 네이티브 새 탭 PASS 근거로 삼지 않았다. 격리본에 과거 handler를 넣은 임시 시도도 의미 있는 재현 판정에 사용하지 않았으며 최종 격리 소스는 원본의 onNavigate로 복원했다.
- 최종 관찰은 기존20PASS+이번4PASS이며 genuine hidden 추가1은 여전히 미실행이다. 실제 API 통합/개인정보 표시·다른 Task의 차단과 예외는 그대로다.

<a id="dev-28-local-qa"></a>

## 2026-11-17 · DEV-28 관리·동의의 로컬 검증과 실제 QA 차단

- 실행 단위 DEV28-20261117, [이번 사용자 D1/D2](../development/figma-v01/tasks/DEV-28.md#dev-28-brief). 실제 HTTP 연결 코드를 구현하고 local mock/HTTP 대역·브라우저를 선행했다. 원본 TEAM26 계획·DEV-27 및 모든 과거 QA/예외를 그대로 보존한다.
- 환경: Node22.20.0/pnpm11.3.0·Next16.2.9, `.env*` 없는 격리 소스·기존 node_modules 재사용/설치0. Aside Chromium desktop1920×1080/모바일390×844. mock company `team-pending`, API 프로필 loopback3139→3148의 합성 계정/회사·메모리 HTTP 대역이다. 실제 업무 API/계정/개인정보·권한/소속/메일·운영/배포0이다.
- source/게시: backend dev `adc0e265ef0e2aa78ccb376e1fa322edd664b290`, 중앙 main `c9e50ff591ae18023164e1a94581c611bf1e4f29`; [CI/테스트 배포 run43389204151](https://github.com/mate-pjt/mate-backend/actions/runs/43389204151) 같은 SHA success. 개발 OpenAPI GET200/3.1.0/v1·SHA256 `85b38b6e43ad45807a1d8c66153767c53876220dbf84852cbc4fa53d832917ba`는 기존과 동일이다. 실행 process SHA/실제 업무 wire·권한 집행은 미확인이다.

| TEAM 소유 부분 | 로컬 근거/결과 | 실제 API |
| --- | --- | --- |
| 05 직접 변경·과도 부여 | HTTP PATCH/expectedVersion·exact target/전체 leaf·고권한/actor 부분집합, 브라우저 직급·권한 직접 저장/재조회 PASS | 차단 |
| 06 동의 생성/대기 | UUID/kind별 필드·CREATED/REUSED/NO_CHANGE, ADMIN 승격 요청 뒤 현재 VIEWER 유지·별도 수락 PASS | 차단 |
| 07 결정/취소·무효/무기한 | 본인만 결정/담당자 kind leaf·APPLIED/REJECTED/CANCELED/INVALIDATED, 오래된 target/직급 정의·발행자 상태와 시간 경과 분리 PASS | 차단 |
| 08 최후 관리자/대표자·경쟁 | 유일 ADMIN 강등/소속 종료 거부·ADMIN 유지 대표자 해제, 병렬 version/관리자 경쟁 회귀·브라우저 CM006 거부 PASS | 차단 |
| 09 본인 축소·취임/소속 종료 | 부분집합/일반 직급·대표자 공석/본인 경로·타회사/직접 편집 우회 거부. 브라우저 대표자 입력 교정/취소·본인 소속 종료 후 계정 유지 PASS | 차단 |
| 10 version/replay/미확정 | 명령 중복0·409/다른 제안 명시 취소·terminal REUSED, 응답 유실 뒤 성공 오인0/명시 GET만·성공 뒤 조회 실패 분리 PASS | 차단 |
| 23 DEV-28 수명·접근성/오류 | 계정/epoch/Abort·회사/소속/leaf 전후/취소 현재 leaf·타인 target 표시, native 확인 취소 초점/모바일·VIEWER/read-only/401·403·404 PASS | 이 소유 부분 차단 |
| 25 동의 알림·안전 route | 정확한 양수 안전정수 path만 허용. loopback 알림 읽음 PATCH1/결정 POST0 → PENDING 상세. 별도 명시 결정/대상 확인 PASS | 차단 |
| 26 DEV-28 데이터 계층 | public company management 포트·HTTP DTO 최소화·7그룹/config/운영 guard/계정·회사 격리/저장소·api/mock/hybrid/Storybook/아키텍처 회귀 PASS | 이 소유 부분 차단 |

### 실행 결과·실패 보존

- 자동: `pnpm test`30파일838 PASS, `pnpm lint` PASS/경고0, 격리 API/mock/hybrid `pnpm build --webpack` 및 `pnpm build-storybook` PASS. 원격 최종 head 기본 Turbopack CI는 별도다. 상세 로그/명령과 첫2실패·수정3/3·독립 Major3/Minor1은 [Task](../development/figma-v01/tasks/DEV-28.md#dev-28-brief)·[두 리뷰](../development/figma-v01/reviews/DEV-28.md)에 연결한다.
- [브라우저 원시 판정](assets/dev-28/dev28-browser-results.json): 최종30관찰 PASS(수정 뒤 mock3재관찰 포함)와 합성 fixture 불완전1을 보존했다. 첫 HTTP mutation fixture는 companyId가 없어 정확히 미확정으로 거부됐고 보완 뒤 직접 저장/재조회가 PASS였다. GET 동의 route matcher도 fixture만 바로잡았다. 이를 제품 FAIL이나 미실행 실제 QA PASS로 세지 않는다. 후속 final-source mock/캡처·문서 freshness는 아래/검토 기록에서 확인한다.
- loopback response-lost는1회 명령 후503, 자동 재명령0/명시 GET에서 변경된 상태만 확인했다. 성공 후 refresh503에서도 확인된 성공 banner를 유지했고 final401에서는 보호 상세를 숨겼다. [알림 method/path/status 관찰](assets/dev-28/dev28-notification-events.json)은 읽음1/결정0이다. API 브라우저의 외부 origin은 loopback3139/3148 외0이었다.
- 도구 한계: Aside의 호출별 focus 재조회/불안정 ref·일시 loading은 새 snapshot/한 수명 안의 연속 행동으로 확인했다. fullPage의 반복 상단 캡처는 채택하지 않고 viewport 캡처를 쓴다. genuine native hidden 전수·모든 Figma child/prototype/pixel 검증을 주장하지 않으며 기존 DEV-27 추가 hidden1미실행은 유지한다. 예시 이름/이메일은 모두 합성 `example.test`다.

| 화면/상태 | 기준/예외 | 최종 캡처 |
| --- | --- | --- |
| 상세 직급/역할·leaf | Figma3137:53331·54225와 직급53403/역할53410 카드·기존 tokens/controls. 대표자 행동별 안내·미제공은 POL-14 D2의 한정 예외, 현재3category/15leaf는 D1 기능 계약 | [desktop](assets/dev-28/dev28-detail-desktop.png) · [mobile](assets/dev-28/dev28-detail-mobile.png) |
| 동의 요청 상세/대상·전후 상태 | 이번 DEV-28 D2로 채택한 기존 my 카드/명시 확인 UX. 자동 동의0·처리 완료와 대기 구분. 이전 상세 전체 화면 예외로 확대하지 않음 | [desktop](assets/dev-28/dev28-request-desktop.png) · [mobile](assets/dev-28/dev28-request-mobile.png) |

### 실제 QA 재개 조건

실제 통과0 · 위9개 **DEV-28 소유 부분 차단**이다. 담당 역할·합성 회사/서로 다른 관리자·대상/추가 leaf·대표자/공석·유일 관리자/원래 소속/version과 경쟁 자원, Origin/CORS·현재 실행 SHA 대응·업무 응답 wrapper/필드, 개인정보 열람/사용·권한/소속 변경·알림 잔존/복구 범위를 확보해야 재개한다. 권한 축소·소속 종료 등 복구가 어려운 자원은 disposable 범위를 명시한다. 이번 D1은 실제 QA 면제·통합 PASS/운영 반영 승인이 아니다. TEAM 다른 소유 부분/기존 AUTH-16/17·가입/회사/문서·DEV-08/MAT-162/모든 예외·차단은 유지한다.

### 병합 직전 추가 재현 · FAIL 보존

앞선30관찰 PASS/fixture-invalid1 뒤 새 원격 리뷰2건을 별도로 재현했다. 위 raw 판정을 덮거나 실제 API QA로 세지 않는다. PR #86 head8fa797e에서 수정 전 결과다.

| 사례/증거 종류 | 관찰·판정 |
| --- | --- |
| 같은 mine 탭 재클릭 · 실제 Next mock 브라우저 | 같은 URL에서 결과가 사라져 loading·재조회 버튼 disabled가 지속됨. FAIL. 독립 hook harness도 mine/company 모두 load1→1·새Effect0 재현 |
| PROFILE_EDIT 없는 행동 leaf · 격리 Node mock/독립 재현 | 자기축소한 AGENT+REMOVE+PERMISSION_MANAGE에서 VIEWER canRemove=false인데 명령REMOVED, AGENT canRequestPermissionChange=false인데 권한 요청CREATED. capability/명령 불일치 FAIL |

제품/테스트 수정은 아직 없고 자동 수정3/3 뒤 이 두 건 한정 추가1회 결정 대기다. mine/company·필터·breadcrumb/페이지 이동 브라우저와 각 행동 leaf 허용/거부 회귀, 관련 build/두 리뷰·새 최종 head CI 전에는 로컬 최종 PASS로 복귀하지 않는다. 실제0/9부분 차단·기존QA/예외는 그대로다.

### 사용자 추가1회 승인 뒤 회귀

- 2026-11-17 사용자 **“두 항목 한정 추가 1회 수정 후 전달 계속 (추천)”**. 현재 목적지의 canonical props를 비교해 탐색 방지/결과 유지, 다른 목적지의 conceal/Abort 유지, mock REMOVE/PERMISSIONS 각각의 판정으로 수정했다. 최초3/3 뒤 별도 추가1/1이며 다른 기능/실제 업무 승인은 없다.
- Node22.20.0 전체30파일842 tests/lint경고0·격리 API/mock/hybrid webpack·Storybook PASS. 실제 mock leaf4조합의 버튼 capability·직접/동의 명령 허용/403·상위/자기/대표자·최후 관리자 회귀를 포함한다. 독립 verifier도842 tests·실제 컴포넌트 hook harness17사례·mock추가4조합을 확인했다.
- [추가 브라우저 원시 관찰](assets/dev-28/dev28-extra-browser-results.json)은23 PASS와 초기 FAIL관찰2를 원문 결과대로 보존한다. 같은 mine/company·필터/필터재선택/root breadcrumb·의미상 같은 `scope=mine&page=1`/모바일, 다른 scope/필터·2page빈경계→1page·팀원 화면 이동을 확인했다. actual Next mock에서 PROFILE_EDIT 없는 AGENT+REMOVE+PERMISSION_MANAGE의 본인 축소→VIEWER 내보내기 확인/REMOVED→AGENT 권한 동의 확인/CREATED·현재 역할 유지를 UI로 확인했다. 외부 origin0이다.
- 초기 FAIL2를 제품 성공으로 덮지 않는다. 첫 call경계 뒤 페이지복귀 클릭은 old URL/loading으로 관찰돼 원인을 제품으로 확정하지 않았다. source변경 없이 fresh 클릭1회·동일 tool수명 반복2회에서 경로/목록 복귀가 모두 성공했다. 다른 초기 관찰은 focus 재조회 중 editor disabled를 읽은 것이며 같은 호출에서 click의 actionability 대기 뒤 활성 버튼/확인 popup·REMOVED가 관찰됐다. 별도 notes의 cross-call/전환중 관찰과 준비된 실제 명령 결과를 분리한다. 옵션 RefStale1도 새 snapshot/같은 수명 액션으로 재시도했고 full tree/diff를 보존했다. 실제 native hidden 전수/모든 Figma pixel·실제 API PASS를 뜻하지 않는다.
- 추가 회차는 HTTP 연결 코드 변경0이다. fetch 대역 계약은 전체842 tests에서 재실행했고 API profile을 다시 빌드했다. 실제 Next loopback HTTP의 앞선30관찰 원본은 보존하며 그 전체를 추가 회차에서 반복했다고 주장하지 않는다. 실제 API0/9소유 부분 차단과 DEV-29 미실행은 유지한다. 최종 문서/두 리뷰 freshness·새 PR head CI는 별도 Gate다.

<a id="dev-29-local-qa"></a>

## 2026-11-17 · DEV-29 보낸 초대의 로컬 검증과 실제 QA 차단

- 승인/범위: [이번 사용자 D1·Brief](../development/figma-v01/tasks/DEV-29.md#dev-29-brief)의 **실제 HTTP 연결을 포함한 로컬 선행·실제 발송/수신/수락 QA 차단 보존**이다. 초대 생성/목록/상세만 실행하며 재발송/취소/PATCH·수락 목적지·신청/직급 CRUD는 후속 소유다. 기존 POL-14/DEV-27/28·QA-08 AUTH-16 실제0통과1차단/초대 AUTH-17 미실행·회사/다른 Task 예외를 확대하지 않는다.
- 환경: 시작 main473c9e1 + DEV-29 최종 미커밋 source, Node22.20.0·pnpm11.3.0. Aside REPL/Chrome156.0.0.0·DPR2, desktop1440×1080/mobile390×844. Next mock `127.0.0.1:3109`(connected와 최종 team-no-representative), API profile의 실제 Next `127.0.0.1:3110` + loopback 합성 HTTP `127.0.0.1:3111`을 순차 실행했다. 실제 backend/업무 API에 요청하지 않았다.
- 날짜/원문 근거: 11/17 backend dev/중앙 main은 [Task 조사](../development/figma-v01/tasks/DEV-29.md#dev-29-brief)의 고정 SHA·개발 게시 OpenAPI와 대조했다. source·배포/게시 계약·실행 SHA·실제 응답은 별개이며 공통 wrapper `success`/`isSuccess` 차이를 실제 wire PASS로 바꾸지 않는다.
- 고정 로컬 증거: [source 지문·검증/HTTP 계측](evidence/dev-29-verification.json), [데스크톱 입력](screenshots/dev-29/form-desktop.png), [모바일 입력](screenshots/dev-29/form-mobile.png), [상세](screenshots/dev-29/detail-desktop.png), [대표자](screenshots/dev-29/form-representative.png), [성공 뒤 조회 실패](screenshots/dev-29/http-success-read-error.png), [성공 뒤 세션 만료](screenshots/dev-29/http-success-session-expired.png). 모든 화면/계정·입력은 합성이다. 서버 로그·증거에 token/cookie/메일 원문·비밀 링크/실제 환경값을 남기지 않는다.

### 로컬 사례와 확인 수준

| ID | 종류/범위 | 실행 결과·한계 |
| --- | --- | --- |
| L29-01 | Node 계약·수명/전체 회귀 | 최종 `pnpm test`32 files/939 tests PASS(기존842 + 신규97). 입력 길이/ISO 제어문자/email·직급 XOR·대표자 payload·preset/extra·actor 부분집합·401/403/404/409/5xx·손상2xx·계정/epoch/Abort·현재 회사/소속/leaf/catalog/직급 재검사 포함 |
| L29-02 | mock 계약/저장 | 같은 store/account 중복1건·다른 이메일 병렬 성공·21건 page/count/DESC/ID·새로고침 복원·다른 계정/회사 거부·손상 영역만 초기화·반환 참조 격리 PASS. API auth+company mock에서 실제 token/refresh 추가 호출0 |
| L29-03 | 독립 경쟁 재현/최종 회귀 | 초기 verifier Major: 공석 읽기 뒤 외부 대표자 취임이 초대에 끼어듦. 공유 serializer 후 외부 배리어/반대 명령 순서·실패 queue release와 빈 목록 보수 처리·CM004/CI009/CI008 source enum 회귀 PASS. 실제 backend 동시성 QA가 아님 |
| L29-04 | 실제 Next mock 입력 | 빈값/잘못된 이메일은 제출 불가·설명 표시. clear 버튼 때문에 textbox 이름이 변하던 초기 실패를 고유ID/별도 label로 수정해 입력 전후 이름 유지 PASS |
| L29-05 | 실제 Next mock 생성/중복 | 일반 초대 생성 뒤 보낸 목록1건/PENDING·delivery PENDING과 root 성공/Toast. 같은 이메일 거부 후 명시 GET에서도1건, 자동 새 생성 없음 PASS |
| L29-06 | 실제 Next mock 직급/grant | 새 일반 직급명·AGENT·직원 초대 extra를 명시 선택/생성해 반환 직급·역할/권한을 목록/상세로 표시 PASS. 정의 CRUD를 수행한 것이 아님 |
| L29-07 | 실제 Next mock 대표자 | 최종 team-no-representative의 ADMIN에서 대표자 선택 시 일반 직급/preset/extra 입력 제외·생성 뒤 대표자/ADMIN/PENDING 표시 PASS. 대표자 있는 connected에서는 버튼 disabled 확인 |
| L29-08 | 실제 Next mock 상세 | 생성된 exact 초대의 read-only 상세·등록명/직급/권한/status/delivery·실제 expiresAt/createdAt/updatedAt·처리일·메시지 표시 PASS. 화면/모델에 비밀 링크를 제공하지 않음 |
| L29-09 | 실제 브라우저 키보드/복귀 | native dialog의 Shift+Tab 포커스 내부 유지·Escape/닫기 뒤 최신 목록/heading focus PASS. hidden/계정 변경의 늦은 명령 결과 폐기는 Node controller로 검증했고 모든 실제 브라우저 경합을 전수 실행했다고 주장하지 않음 |
| L29-10 | 시각/모바일 | 최종 popup desktop640×908·Select48px, mobile358px·가로 overflow0 PASS. 지정 frame/popup의 폭/입력 순서/표면·기존 asset/토큰을 대조함. Figma 전체 child/prototype·반응형/pixel 전수 PASS나 전체 화면 예외 승인이 아님 |
| L29-11 | 실제 Next mock 복원/계정 | 하드 리로드 뒤 보낸 초대2건 복원, 로그아웃 뒤 보호 자료 숨김·가상 계정2의 초대0건 PASS. ACTIVE 팀원23과 보낸 초대 count를 합치지 않음 |
| L29-12 | mock 브라우저 네트워크 | 관측 Resource Timing에서 외부 HTTP(S) resource0·API resource0 PASS. 실제 메일/OAuth/업무 변경0. 서버의 모든 가능한 외부 연결 전수 계측을 주장하지 않음 |
| L29-13 | 실제 Next + 합성 HTTP | 실제 company HTTP Repository의 보호 POST/GET·현재 context/권한·응답 mapper를 경유해 생성/status/delivery FAILED와 별도 성공 banner 표시 PASS. source의 mail adapter/실제 메일 도착 증거가 아님 |
| L29-14 | loopback TCP 유실 | 두 실험에서 앱의 fetch1회·wire POST2회(lost→동일 이메일409), 저장된 초대는 각1건. UI는 미확정/충돌·명시 GET만 안내했고 GET으로 확인 PASS. 추가 wire는 전송 계층 재시도로 추정하며 앱 guard만으로 wire1회를 보장하지 않는다 |
| L29-15 | loopback 손상2xx | 서버 대역은 저장 후 delivery를 손상해 응답. 완료/Toast 없이 미확정·제출 잠금, 닫고 GET에서 저장된1건 확인 PASS. 앱 자동 POST 추가0 |
| L29-16 | loopback 성공 뒤503 | 검증된 생성 성공 banner를 보존하면서 최신 목록 오류/명시 재조회 표시 PASS. [화면](screenshots/dev-29/http-success-read-error.png). 성공을 조회 실패로 취소하거나 자동 재발송하지 않음 |
| L29-17 | loopback 성공 뒤401 | 생성200 뒤 context refresh401에서 성공 banner 보존·보호 자료 숨김·로그인 복귀 표시 PASS. [화면](screenshots/dev-29/http-success-session-expired.png) |
| L29-18 | loopback403/행동별 leaf | 생성403에서 dialog/목록/팀원 표가 사라지고 권한 안내 표시 PASS. invite leaf VIEWER는 기존 직급만·AGENT/ADMIN/대표자 disabled·새 직급 선택지 없음, canInvite=false는 role이 ADMIN이어도 초대 진입 disabled PASS |
| L29-19 | 기존 수신 mock 회귀 | 기존 preview/resume/acceptance·한 번 소비의 Node 회귀 PASS. **발송된 초대의 실제 메일/수신/수락 연결 PASS가 아니며** 그 통합은 아래 차단이다 |

### 원래 TEAM 사례의 DEV-29 실제 통합 부분

| 원본 case | 이번 소유 부분 | 실제 결과·재개 조건 |
| --- | --- | --- |
| TEAM-11 | 일반/대표자 생성·입력/grant | **차단/미실행**. 승인된 합성 actor/수신 회사·계정/메일함/현재 leaf·직급, 실행 SHA 대응·사용/잔존/복구 확보 필요 |
| TEAM-12 | 생성/조회 권한·서버 거부 | **차단/미실행**. POST/GET만 이번 소유. PATCH·다른 관리 행동은 미실행/후속 소유 보존 |
| TEAM-13 | 중복/활성 소속/신청/모호한 이메일·목록/상세 | **차단/미실행**. 실제 신원/경쟁 fixture·보호 자료 열람/복구 범위 미확보 |
| TEAM-16 | 생성·초대 status/delivery/메일 도착 | **차단/미실행**. 실제 수신 자원/메일 관측·발송/소비/잔존·담당 역할 미확보. 재발송은 DEV-30 소유 |
| TEAM-17 | 발송 초대의 수신·소비·계정 일치 | **차단/미실행**. 실제 token/링크를 기록하지 않는 관측·계정/소속 변경 승인·복구 필요. 기존 AUTH-16/17 대체 아님 |
| TEAM-23 | 생성·조회 오류/경쟁 | **차단/미실행**. 초대 수정/재발송·취소 version은 후속이며 실제 유실/경쟁 자원 미확보 |
| TEAM-26 | 초대의 개인정보/비밀 자료 최소화 | **차단/미실행**. 실제 응답·메일·환경/CORS 관측의 승인 범위/담당 역할 미확보. 로컬 모델/로그 검사를 실제 비노출 PASS로 올리지 않음 |

이번 DEV-29 실제 소유 부분은 **0통과·7차단**이다. 원래 TEAM-01~26 계획/ID·다른 소유 부분의 대기/차단·기존 QA/정책 예외를 보존한다. 운영 배포·중앙/backend 수정·실제 초대/메일·외부 메시지는 실행하지 않았다.

### 자동 검증·한계·정리

- 최종 명령은 Node22.20.0의 `pnpm test`·`pnpm lint`·API/mock/hybrid `pnpm build`·`pnpm build-storybook` 및 문서 링크/79개 원본/114Task/156의존/상태·baseline/범위/Markdown·`git diff --check`다. 실제 최종 결과는 [Task](../development/figma-v01/tasks/DEV-29.md#dev-29-verification)·[리뷰](../development/figma-v01/reviews/DEV-29.md)에서 함께 확인한다. 앱 검사를 문서 전용 검사로 면제하지 않았다.
- 초기 lint1건·label/a11y 실패·독립 Major1/Minor2와 수정3/3을 보존한다. Aside 첫 로그인 링크 클릭의 전환 미관찰은 관측한 href로 이동해 이어갔고 성공으로 소급하지 않는다. session 밖 저장 경로 거절·focus 재조회/무효 ref·HMR 전640×972/Select36 관찰은 fresh 리로드 뒤 최종640×908/Select48과 구분한다. HTTP 대역의 최초 후속 실패 모드는 이미 있던 데이터 때문에 제출 전 GET부터 실패했으며 대역을 재시작/threshold로 분리한 최종 시나리오 결과만 해당 성공 후 사례의 근거로 쓴다.
- loopback 대역/Next와 브라우저 탭은 이번 소유 자원만 종료했다. 실제 외부 데이터 변경0·메일0이고, 합성 상태는 탭/sessionStorage·임시 대역 메모리에만 있었다. 실제 업무 데이터 복구나 실제 초대 회수 완료를 주장하지 않는다.

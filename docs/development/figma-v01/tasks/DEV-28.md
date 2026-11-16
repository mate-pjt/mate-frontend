# DEV-28 · 팀원 정보·권한 변경

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: T01
- 선행 작업: [DEV-27](DEV-27.md)
- 목적/범위: 허용된 정보/역할 변경과 완료/오류를 연결한다.
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

- [ ] 권한 상승 차단·마지막 관리자·자기 권한 변경·버전 충돌을 확인한다
- [ ] 중복/실패·재조회·다른 역할의 서버 거부를 검증한다
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


<a id="dev-28-pol-14-handoff"></a>

## 2026-11-16 · POL-14 확정 정책/계약 인계

- 인계 근거: [POL-14 D1/D2·v1](POL-14.md#pol-14-contract). 사용자 D1에 따라 **직접 변경과 대상 동의 요청의 생성/조회·본인 수락/거절·회사 취소·충돌**까지 이 Task의 완료 기준에 포함한다. 타인 직급/leaf·내보내기/자기 권한 축소·본인 대표자 취임/소속 종료의 현재 contract를 구분한다. 서비스 계정 탈퇴는 POL-18/DEV-39~40 소유다.
- 확정 완료 기준: 행동 leaf·부여 전체 집합의 actor 부분집합·현재 role 비교를 함께 적용한다. 낮은 타인은 직접, 같은 role/대표자 대상·ADMIN 승격/대표자 지정은 허용된 대상 동의, 높은 대상/과도 부여는 금지다. 본인 변경은 별도 source 경로이며 마지막 유효 활성 ADMIN 강등/소속 종료는 서버 불변식으로 거부한다. 대표자 system 직급 정의 보호와 ADMIN 유지 본인 직급 해제를 구분한다.
- 명령/상태 기준: 직접 expectedVersion, 동의 생성 UUID requestKey/expectedMembershipVersion/kind별 필드, 결정/취소 UUID requestKey/expectedRequestVersion을 그대로 쓴다. CREATED/REUSED/NO_CHANGE·PENDING/APPLIED/REJECTED/CANCELED/INVALIDATED를 구분한다. 같은 target/내용 재사용·알림 중복0/다른 내용 명시 취소·무응답 무기한 대기, issuer 퇴사만으로 무효화하지 않음과 target/version/직급 정의 변화·관리자 경쟁을 검증한다. 요청 생성만으로 현재 권한을 바꾸지 않는다.
- UI/연결 기준: D2 대표자 일괄 불가 안내·버튼을 현재 직접/동의/금지에 맞추되 system 직급 수정/삭제·권한 상한/최후 관리자 제약은 유지한다. 정보 편집을 타인의 계정 생일/전화/이메일 수정으로 확대하지 않는다. 동의 상세/결정 route·알림 actionPath allowlist/현재 target 검증·loading/오류/미확정은 자체 Gate에서 먼저 설계한다. POL-04 현행 allowlist를 자동 확장하거나 알림 읽음/클릭을 동의로 처리하지 않는다.
- 검증 연결: [TEAM-05~10/23/25/26](../../../qa/team-members.md#pol-14-team-qa). 양쪽 동의·오래된 snapshot/직급·최후 관리자 동시 변경·재전달/UUID 충돌·타 회사/계정·권한 상실/화면 수명, 확인된 성공/후속 조회 실패와 응답 미확정·자동 재변경0을 검증한다.

- 이 append는 POL-14의 정책/계약·완료 기준 인계다. 이 Task의 실행/Implementation Brief·설계/제품·실제 QA·Git 전달을 시작한 것이 아니다. 현재/다음/상태는 WBS만 소유한다. 원본2026-10-27 관찰·미작성 Brief·기존 체크리스트/QA는 보존한다.
- 공통 재개 Gate: 최신 Git/main·이 선행 결정/현재 source·게시 Swagger/실행 대응을 확인하고, 자체 성공 기준·수정 파일/영향·검증을 제시한다. `data-access.md`의 같은 company 공급원·public 포트/HTTP/DTO 경계·immutable snapshot/운영 guard·계정 격리를 지킨다. 새 library/endpoint/필드·fallback을 임의 만들지 않는다.
- 실제 업무 GET/변경·메일/초대/직급 실행은 승인된 합성 회사/계정·현재 leaf/상태/버전·환경/Origin/실행 SHA 대응·사용/소비/잔존/복구 범위와 자원 담당 역할이 필요하다. 이번 정책/Git/Chromatic 예외는 해당 자원 확보·실제 QA 면제/로컬 선행 승인이 아니다. 이전 QA-08 AUTH-16 0통과1차단·초대 AUTH-17 미실행과 다른 가입/회사·DEV-08/MAT-162 등 차단을 보존한다.

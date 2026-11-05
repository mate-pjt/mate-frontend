# DEV-06 · 받은 알림의 안전한 대상 화면 이동

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 개발
- 원본 항목: N03
- 선행 작업: [POL-04](POL-04.md)
- 목적/범위: actionPath를 내부 모델에 안전하게 전달하고 확정된 읽음/이동 순서로 연결한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### N03 · 알림에서 대상 공고·회사·소식 이동
- 기준선: UI **없음**, 동작 **읽음만**, 데이터 **DTO actionPath 버림**. 검증: 새 mock 클릭 후 /alarms 유지.
- 남은 점: 안전한 내부 경로 검증과 읽음 처리 후 대상 화면 이동 연결
- Figma: [2304:29131](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2304-29131)
- 소유 소스/기존 기록: [src/data/notifications/http-repository.ts:16](../../../../src/data/notifications/http-repository.ts)、[src/data/notifications/http-repository.ts:76](../../../../src/data/notifications/http-repository.ts)、[src/components/alarms/alarm-list-item.tsx:70](../../../../src/components/alarms/alarm-list-item.tsx)

- 이어갈 QA 기록: [alarms.md](../../../qa/alarms.md). 기존 case ID와 통과/대기/차단 기록을 보존한다.

## 완료 기준

- [ ] 허용 경로·없는 대상·외부/위험 경로 폴백을 검증한다
- [ ] 읽음 성공/실패·건수·세션 만료·키보드 이동을 확인한다
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

<a id="pol-04-handoff"></a>

## 2026-11-05 · POL-04 v1 정책 인계(구현 미착수)

위 후보 정의·빈 Implementation Brief는 당시 이력이다. 이 절은 [POL-04 사용자3결정/원문](POL-04.md#pol-04-decisions)과 검증 계획을 인계하며 **DEV-06 요구사항/설계 Gate 또는 실제 API 실행 승인을 대신하지 않는다**. 현재/다음/상태는 WBS만 관리한다.

- 정책 version/적용: POL-04 v1, 2026-11-05 사용자 승인. 공고 상세 `/bids/{양의 정수 ID}` 및 단일 선택 `bidClsfcNo`, 정확한 `/my/company`만 허용한다. ID/분류는 현행 상세 계약을 유지하며 notificationId/resourceId·종류/제목으로 목적지를 추정하지 않는다.
- 안전 경계: 단일 `/` 내부 경로/허용 route·query만. 같은 origin의 절대 URL도 포함한 외부/scheme·프로토콜 상대·역슬래시·공백/제어문자·dot segment·인코딩 우회/깨진 인코딩·중복/알 수 없는 query/hash는 거절한다. query의 정상 직렬화는 유지한다. raw actionPath를 router/href에 넘기지 않고 이동 직전에도 검증한다. 기존 auth 복귀 유틸은 허용 경로/폴백이 달라 그대로 채택한 것으로 세지 않는다.
- 폴백: null/무효/위험/미지원은 `/alarms` 목록/본문 유지·원문 경로를 노출하지 않는 안내. 읽음 기능은 유지한다. 소식/회사 통합·팀원/인증·API·변경 경로는 v1 미지원이며 `/my/company` 등으로 임의 변환하지 않는다. 허용 대상의404/권한/서버 오류는 기존 목적지 화면 책임이고 읽음 성공을 되돌리지 않는다.
- 순서: 미읽음은 공개 Repository PATCH 성공→읽음/건수·변경 이벤트→목적지 재검증/현재 탭 이동. 이미 읽음은 PATCH/건수 감소 없이 이동. 읽음 실패는 이동/낙관 갱신 없이 오류·명시적 재시도이고 통신 실패의 서버 반영 여부는 재조회/멱등 재시도로 맞춘다. 같은 항목 중복 클릭, 다른 항목 경쟁, 계정 교체/로그아웃/해제 뒤 늦은 이동을 막아야 한다. 기존 동일 계정401 refresh1회를 유지하고 최종 세션 만료 후 로그인 복귀는 `/alarms`, 사용자 PATCH/이동 자동 재생은 없다.
- 소스/데이터 경계: 시작 프론트 `8e4566d`의 HTTP DTO actionPath→`AlarmNotification`/mock 누락은 미수정이다. 내부 모델·DTO mapping/검증·합성 mock fixture/저장소 호환·공개 client→UI 조합의 구체적 파일/설계는 이 Task Gate에서 제시한다. 7개 공급원/빌드 snapshot·운영 guard·계정별 탭 격리·DTO 비공개·자동 fallback 금지를 유지한다. API notifications와 mock 목적지가 섞인 hybrid의 실제 ID/시나리오 검증을 설계하며 이 인계로 config 제약이나 새 공급원 그룹을 추가하지 않는다.
- 완료 기준 보완: [ANAV-01~10 계획](../../../qa/alarms.md#pol-04-navigation-qa)의 정상/위험/빈 목적지·성공/실패/중복/계정 수명·키보드/모바일·실제 대상 오류를 확인한다. package의 실제 test/lint/build·필요한 Storybook·Next/브라우저, mock/HTTP 대역/실제 통합의 결과를 구분하고 두 리뷰를 수행한다. 기존 ALARM-01~10의 과거 ‘읽음 후 목록 유지’는 당시 구현 이력으로 보존하며 새 정상 이동은 ANAV에서 검증한다.
- 남은 조건: 배포 OpenAPI/version/schema·실행 SHA 대응은 미확보(비인증 GET403). 실제 로그인·목록/건수 GET·합성 알림 read PATCH·대상 공고/회사 fixture와 시작/종료·사용/변경/읽음 잔존/복구 담당/방법·안전한 오류/401 해제는 [POL-04 인계 조건](POL-04.md#pol-04-handoff) 및 QA-11 재개표를 대조해 확보해야 한다. 개인정보/환경값·인증/서명 URL을 자료로 요청하지 않는다. 정책 PASS/준비·Git 전달은 실제 QA 면제가 아니다.
- 다음 첫 행동: 최신 main/HEAD/작업트리·POL-04 v1/소유 source/배포 대응·ANAV 계획과 자원/승인 공백을 확인해 이 Task의 성공 기준·범위·수정 파일/영향·검증 방법을 별도 Gate로 작성한다. POL-04 대화에서는 구현/브라우저/업무 API를 시작하지 않았다.

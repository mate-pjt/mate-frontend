# 2026-11-13 · 백엔드 계약 재조사와 재개 인계

[현재 상태의 단일 기준: WBS](../README.md) · [기계 판독 근거/40개 조사/43개 source](2026-11-13-backend-readiness.json) · [검증·리뷰](../reviews/backend-readiness-2026-11-13.md)

이 문서는 2026-11-13 오전의 읽기 전용 관찰과 이후 승인된 문서 반영을 보존한다. 기존 차단·보류26개 전부와 연관 후보14개를 확인했다. 미착수 Task 전체의 기능/실제 API 통합을 감사한 것은 아니다. 원본 기준선·날짜별 결정·QA·승인 예외를 덮어쓰지 않는다. 현재/다음/상태는 WBS만 소유한다.

## 승인과 범위

- 승인자/날짜: 이번 대화 사용자 / 2026-11-13 KST. [승인 원문·Brief](../tasks/POL-09.md#pol-09-backend-replan-approval).
- 승인: 제안한 날짜별 감사/관련 Task 근거·WBS/재개 규칙 수정, 다음 하나를 DEV-57 **재개 요구사항 확인**으로 지정, 문서 검증·리뷰·commit/push/PR/CI·정상 main 병합·로컬 main FF.
- 유지: 기존 차단/보류와 미결 정책. DEV-57 구현은 이 대화에서 시작하지 않는다. 닉네임 결측/지연/오류 표시, 야간 실제 효력/시간대·전역 OFF/ON 정책, 실제 QA 자원은 새로 확정하지 않았다.
- 제외: 제품/테스트/설정/의존성, 실제 계정/업무 API·메일/문서/OCR·fixture 변경, 중앙 repo/외부 메시지·운영/배포. 앞선 조사 계획 제안과 이번 문서 반영 승인을 구분한다.

## 근거 수준과 고정 버전

| 근거 | 확인한 값/한계 |
| --- | --- |
| frontend 조사 source | `e09fb4c74f312b17715857b23ff976d484b76140`. 문서 반영 시작 `86df956d5ecf05aad860199ccd86ff0993a7a068`까지 제품 source 변경 없음 |
| backend dev | `befe434c2b3fd80ddbc12c1d6216f738dd5ea12a` |
| backend main | `8f522d0876a70edf61b8f5456a11c51756f60372`. 선택한 인증 응답/설정 controller/목록 request의 dev/main blob 일치. 전체 branch 동일이라는 뜻은 아님 |
| 중앙 정책 main | `c9e50ff591ae18023164e1a94581c611bf1e4f29` |
| 개발 OpenAPI | [GET200 관찰](https://api-test.mate-bid.com/v3/api-docs), OpenAPI3.1.0/info.version v1,184paths/209operations |
| backend 전달 | [PR #134](https://github.com/mate-pjt/mate-backend/pull/134), dev merge2026-11-12 15:47:29 KST |
| backend CI/배포 기록 | [run43170618340](https://github.com/mate-pjt/mate-backend/actions/runs/43170618340): verify/publish/test deploy success, prod deploy skipped |
| 실제 실행/업무 응답 | 실행 중 SHA 직접 증명·실제 로그인/설정 변경/알림 전달·실제 통합은 미확인/미실행 |

backend dev/main·정책 main ref는 2026-11-13 10:56 KST에 다시 확인했고 관찰 ref와 같았다. 이 재확인은 새 업무 응답/실행 SHA 확인이 아니다. source43개는 내용 SHA256과 Git blob SHA를 대조했다. 고정 URL/지문은 JSON에 보존하며 실제 사용자 응답·examples·비밀값은 저장하지 않는다.

11/11 감사 대비 새 operation은 `GET/PATCH /api/v1/me/notification-settings` 두 개이며 삭제는 없었다. 닉네임·금액 필터 같은 응답/요청 필드 변경은 URL 개수 비교만으로 발견할 수 없다.

## 새 계약으로 확인한 내용

| 항목 | source/OpenAPI에서 확인 | 아직 결정/검증할 것 |
| --- | --- | --- |
| 로그인 닉네임 | `AuthenticationResponse.account.nickname`은 string 또는 null. 로그인 완료·가입·refresh에서 `Account.name` 전달 | frontend는 아직 id/email만 사용. DEV-56/57의 결측/지연/오류 표시·계정 전환/실제 세션 QA. 닉네임 편집 API가 추가된 것은 아님 |
| 전역 상세 알림 | 인증 `GET/PATCH /api/v1/me/notification-settings`, `detailAlertsEnabled`. OFF면 공고 사건·마감 알림 처리 query에서 계정 제외 | 개별 공고 등록은 유지. 전체 등록 목록/일괄 해제와 별개. OFF→ON 소급/대기열·진행 중 처리·이메일/관리 알림 관계는 POL-19에서 확인 |
| 야간 선택 | 같은 API `nightAlertsEnabled` 조회·저장. UseCase는 선택값 자체가 전달 시각을 바꾸지 않는다고 명시 | 시간대별 발송 억제/예약 전달 완료로 볼 수 없음. 적용 대상·실제 효력·안내는 미결 |
| 개찰결과 금액 | RESULT `successfulBidAmountMin/Max`, integer/int64·0이상·포함 경계. validation/allowlist→query→실제 최종 낙찰금액 SQL ge/le 연결 | DEV-12 별도 재개 Gate. 원/소수·안전 정수·분류/최신 회차·null/결과 상태·count/page/sort·실제 경계 자원/허용 범위 확인 |

[인증 응답](https://github.com/mate-pjt/mate-backend/blob/befe434c2b3fd80ddbc12c1d6216f738dd5ea12a/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/auth/response/AuthenticationResponse.kt) · [설정 요청](https://github.com/mate-pjt/mate-backend/blob/befe434c2b3fd80ddbc12c1d6216f738dd5ea12a/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/notificationsetting/NotificationSettingController.kt) · [야간 효력/기본 계약](https://github.com/mate-pjt/mate-backend/blob/befe434c2b3fd80ddbc12c1d6216f738dd5ea12a/mate-api/src/main/java/kr/co/mate/mate_api/application/port/input/notificationsetting/NotificationSettingUseCase.kt) · [RESULT 금액 SQL](https://github.com/mate-pjt/mate-backend/blob/befe434c2b3fd80ddbc12c1d6216f738dd5ea12a/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/bid/publiclist/PublicBidNoticeListRowQuerySpecFactory.kt)

설정 PATCH는 지정된 boolean만 변경하고 누락 필드는 유지한다. 최소1필드가 필요하며 명시 null/문자/숫자는400이다. 기존 행이 없으면 상세ON/야간OFF다. 다만 Swagger request가 일반 `JsonNode`여서 구체 필드/부분 변경/오류 명세 보완이 필요하다. 백엔드에 보완을 요청하는 것은 추천이며 이번에 외부 발송하지 않았다.

RESULT는 표시 행별 최신 재입찰 회차를 고르고, 최신 결과가 미발표면 과거 발표 결과로 대체하지 않는다. 개찰1순위 금액을 최종 낙찰금액으로 승격하지 않는다. null은 금액 조건과 매칭되지 않고0은 별도 값이다. 포함 경계·동일 범위·페이지/count·0 관련 테스트 소스를 읽었으며 이번에 backend 테스트를 실행한 것은 아니다. 중앙 API 설명과 최신 필드의 정합성은 후속 소유자의 보완 대상이다.

중앙 알림 정책의 ‘야간 설정 없음’은08:30 맞춤 이메일 절의 설명이다. 새 상세 알림 선택과 바로 충돌한다고 단정하지 않는다. 실제 전달 범위/정책·화면 안내는 POL-19에서 정하며 DEV-66 자동 활성화 승인은 없다.

## 차단·보류26개 조사

아래는 조사 시점 근거와 남은 조건이다. 상태 전환표가 아니며 이번 API 확인으로 차단·보류를 해제하지 않았다.

| Task | 조사 판단 | 남은 재개 조건 |
| --- | --- | --- |
| [QA-01](../tasks/QA-01.md) | 새로운 계약 해소 확인 없음 | 다양한 종류·기관·null/빈 결과의 기대값/공고와 실행 버전·브라우저 대조 준비 재확인 |
| [QA-02](../tasks/QA-02.md) | 일부 계약 보완, 기존 QA 전체 해소 아님 | 현재 공개 응답·검색/페이지/경계 fixture와 영향 사례만 재검증 |
| [QA-03](../tasks/QA-03.md) | 기존 실제 QA 차단 유지 | 공사/물품/용역·분류/회차·nullable·첨부/오류의 비식별 자원; POL-09 추가 필드는 별도 |
| [QA-05](../tasks/QA-05.md) | API 존재와 상태별 실제 QA 준비는 별개 | 미연결/대기/승인/거절 등 계정·회사·변경/복구 범위 재확인 |
| [QA-06](../tasks/QA-06.md) | 기존 실제 QA 차단 유지 | 승인된 합성 사업자/회사·등록 상태와 사용/잔존/복구 범위 재확인 |
| [QA-07](../tasks/QA-07.md) | 기존 실제 QA 차단 유지 | 비식별 파일·업로드/OCR/충돌 결과·처리/복구 허용 범위 재확인 |
| [QA-08](../tasks/QA-08.md) | 기존 실제 QA 차단 유지 | 정상/만료/불일치 초대·역할별 계정·가입/연결 변경·복구 범위 재확인 |
| [QA-09](../tasks/QA-09.md) | 전역 토글 추가로 개별 알림 QA를 통과 처리할 수 없음 | 공고 상태/계정·등록/해제·중복/권한/오류 자원과 변경/복구 승인 재확인 |
| [QA-10](../tasks/QA-10.md) | 기존 실제 QA 차단 유지 | mock reset 교정 이력과 실제 서버 결과를 구분; 경계값/계정·버전409·저장/복구 자원 재확인 |
| [QA-11](../tasks/QA-11.md) | 기존 실제 QA 차단 유지 | 대상 경로·안읽음/페이지·2계정/권한/오류·실제 신호와 데이터 준비 재확인 |
| [QA-12](../tasks/QA-12.md) | 기존 이메일 오류 QA가 자동 해소되지 않음 | 실제 오류/권한 응답·계정·변경/복구 범위 재확인; 새 토글은 별도 범위 결정 |
| [QA-13](../tasks/QA-13.md) | 기존 실제 QA 차단 유지 | 합성 메일함·수신/인증/만료·OTP/오류 자원과 주소 전환/복구 승인 재확인 |
| [POL-01](../tasks/POL-01.md) | 정책/문안 승인 차단 유지 | 정식 문안·필수/선택 동의·소유/효력과 사용자 승인 필요; API 추가로 대체 불가 |
| [POL-02](../tasks/POL-02.md) | 옛 접근403 자체는 해소; 정책/실제 QA 잔여 별개 | 저장/미저장·초기화/공급원·권한/충돌 의미와 합성 계정·실제 경계 응답을 Gate에서 확인 |
| [POL-03](../tasks/POL-03.md) | 계약 공백 유지 | 전역 detail OFF는 등록 삭제가 아님. ALL/일괄 해제의 계약 또는 별도 승인 방안 필요 |
| [DEV-06](../tasks/DEV-06.md) | 남은 실제 통합 차단 유지 | 새 설정 API를 actionPath·읽음/이동 실제 QA 통과로 전환하지 않음 |
| [DEV-07](../tasks/DEV-07.md) | REST endpoint 부재 문제 아님; 실제 자원 Gate 유지 | 실행 SHA/Origin·합성2계정/신호·오류/잔존/복구; 로컬 선행 예외 없음 보존 |
| [DEV-08](../tasks/DEV-08.md) | 기존 실제 자원 Gate 유지 | leaf권한·합성 회사/금액/자료·실행 대응·QA/복구 범위; DEV-60 완료와 별개; 로컬 선행 예외 없음 |
| [DEV-09](../tasks/DEV-09.md) | 새 계약 추가로 풀린 차단 아님 | 원래 L07 실제 경계 QA·정책/계정 자원 Gate와 로컬 선행 예외 부재를 확인 |
| [DEV-12](../tasks/DEV-12.md) | 서버 계약 부재를 이유로 한 보류 재검토 가능 | 분류별 최신 재입찰 회차·null/0·소수/원 단위·정렬/페이지/count/안전 정수와 실제 경계 응답·허용 QA 범위를 자체 Gate에서 확인 |
| [DEV-13](../tasks/DEV-13.md) | 사용자의 전용 계약 선행 결정에 따라 차단 유지 | no-view/keyword 조합을 임의 채택하지 않고 실제 전용 계약·회신/실행/검증 자원 확보 |
| [DEV-14](../tasks/DEV-14.md) | 사용자 명시 지시로 차단 유지 | 요청문/이미지 전달 사실만 기록. 백엔드 답변과 실제 계약·의미/버전·검증 자원 확보 전 구현 금지 |
| [QA-15](../tasks/QA-15.md) | backend 계약 차단 아님; 보류 유지 | 관련 UI/토큰 변경 또는 출시 회귀 요청 시 영향 사례만 선정 |
| [DEV-56](../tasks/DEV-56.md) | 이름 공급원 차단 부분 해소; P3 | 이름 없음/로딩/오류·계정 전환과 회사 영역 표시 승인 필요; 닉네임 편집 API가 생긴 것은 아님 |
| [DEV-57](../tasks/DEV-57.md) | 다음 요구사항 확인 후보 1순위 추천; 자동 차단 해제 아님 | POL-29의 이름 결측/지연/오류 표시 승인 및 frame별 폭/date 표면·접근성/합성 세션 QA 범위 확정 |
| [DEV-58](../tasks/DEV-58.md) | 제품/디자인 결정 차단 유지 | 실제 제공 범위에 맞는 최종 문구·위치 승인과 CTA 상태 검증 |

공개·회사·알림/인증 QA는 기존 계약이 있더라도 합성 자원/기대값·실행 대응·사용/변경/잔존/복구 조건을 재확인해야 한다. 이번 조사로 오늘 자원이 전부 미준비라고 단정하지 않으며, 현재 준비됐다는 증거도 확보하지 않았다. 기존 QA의 미실행/차단을 PASS로 바꾸지 않는다.

전용 정정 이력과 본문/현장설명 일시/기준일·공고 전체 수집일의 요청 계약은 미확보다. POL-03의 목록은 필수 category가4종이고 ALL/일괄 해제 계약을 찾지 못했다. 전역 상세 OFF로 이를 대체하지 않는다. DEV-14는 사용자가 요청문/이미지를 전달했다고 보고했으며 답변과 실제 계약 전 차단 유지 지시가 적용된다.

## 관련 후보14개 조사

미착수 정책/개발 후보를 전부 과거 skip으로 세지 않는다. API가 이미 있던 항목도 포함되므로 이번에 모두 새로 추가됐다고 주장하지 않는다.

| Task | 확인한 계약/범위 | 남은 조건 |
| --- | --- | --- |
| [POL-10](../tasks/POL-10.md) | 소속 신청 DELETE 취소에 expectedVersion query 존재 | 본인/대기 상태·관리자 권한/동시 승인409·목적지/재조회 범위를 별도 결정 |
| [POL-11](../tasks/POL-11.md) | 회사 선택/재사용과 초대 후 흐름은 기존 계약과 UI 소유 경계 문제 | 소속/등록/재사용 진입과 실패/복귀 UX 결정 |
| [POL-12](../tasks/POL-12.md) | 가입 후 회사 enrichment-run·변경 제안·수기 프로필 갱신 계약 존재 | 승인/적용/충돌/권한·OCR·프로필 이미지 범위; 이미지 전용 공개 계약은 확인 못함 |
| [POL-13](../tasks/POL-13.md) | 문서함 목록/문서 상세/버전/삭제/업로드·접근표 계약 존재 | 수명·권한/승인·OCR/버전·삭제/복구·안전한 문서 자원 범위 결정 |
| [POL-14](../tasks/POL-14.md) | 구성원/권한/직급/초대/소속 신청 처리 계약 존재 | 역할별 동작·마지막 관리자·동시 변경/버전·권한 UI 범위 확정 |
| [POL-15](../tasks/POL-15.md) | 멤버십/회사 조회 계약 존재 | 초대 후 역할별 목적지와 접근 거절/세션 재조회 결정 |
| [POL-16](../tasks/POL-16.md) | 회사 merge-case/제안/요청/승인/거절/이의·판정 계약 존재 | 단순 소속 변경과 구분; 상태/권한/충돌·실제 합성 자원 범위 결정 |
| [POL-17](../tasks/POL-17.md) | 공개 /me 계약에서 닉네임/계정 프로필/비밀번호 편집 계약을 찾지 못함 | OAuth 계정의 수정 범위/프로필/비밀번호 지원과 실제 계약 결정 |
| [POL-18](../tasks/POL-18.md) | 계정 탈퇴 전용 공개 계약을 찾지 못함 | 회사 탈퇴와 계정 삭제 구분·보존/복구/마지막 관리자·사용자 승인 필요 |
| [POL-19](../tasks/POL-19.md) | GET/PATCH notification-settings 존재; 전역 OFF는 알림 생성 제외; 야간 값은 저장만 | 야간 대상/시간대·OFF/ON 소급/대기열·이메일/내부 알림 관계·기존 값 이행과 안내 승인; 인증시간 원래 범위도 유지 |
| [POL-20](../tasks/POL-20.md) | POST /api/v1/me/notification-deletions 존재 | 선택/전체·건수/읽음·중복·오류/권한·삭제/복구 범위 결정 |
| [POL-21](../tasks/POL-21.md) | 가입 후 회사 수기 수정 계약은 존재하지만 가입 전 상태와 권한은 별개 | 가입 중 수집값 수동 변경 범위·등록 단계/권한·계약 확인 |
| [POL-22](../tasks/POL-22.md) | POST /api/v1/bid-notice-filters/current/import-company 존재 | 명시 적용/overwrite/expectedVersion·회사 권한/개인 필터 독립·합성 QA 범위 결정 |
| [DEV-66](../tasks/DEV-66.md) | 전역/야간 설정 API가 이제 존재; 기존 API 없음 tooltip 후보는 갱신 필요 | 기존 자동 활성화 금지 승인 유지. 전역 연결과 야간 저장/실제 전달의 지원 수준을 나눠 새 사용자 승인 확보 |

## 승인한 인계와 후속 경계

- 다음 하나: [DEV-57 재개 요구사항 확인](../tasks/DEV-57.md#dev-57-resume-handoff-20261113). P1이며 이름 공급원이라는 구체 차단 사유가 새 계약으로 부분 해소됐다. 남은 표시/검증 조건 때문에 차단을 유지한 상태로 인계한다. 선정은 요구사항 확인의 순서 승인이고 구현 Gate 통과가 아니다.
- 다음 첫 행동: 새 대화에서 최신 main/Git와 POL-29 결정·DEV-57 마지막 체크포인트/감사 CF-03·고정 nickname 근거와 현행 계약을 대조한다. 결측/지연/오류 표시·frame별 폭/date 표면·필요한 합성 세션과 실제 QA 범위를 확인하고, 남은 정책은 추천안과 최대3질문으로 확정한 뒤 편집 전 Brief/검증 계획을 제시한다. 이번에는 이 자체 Gate/구현을 실행하지 않았다.
- POL-10의 과거 선정/인계는 이력으로 보존하고 이번 사용자가 DEV-57 재개 확인으로 다음 순서만 바꿨다. POL-10의 정책/완료 기준은 미확정 그대로다.
- DEV-12는 서버 필터 계약 부재만을 현재 사유로 반복하지 않고 자체 재개 Gate 전 기존 보류를 유지한다. DEV-56은 같은 auth 공급원을 사용하되 P3·별도 소유로 유지한다.
- 알림 후속은 POL-19 정책 정합성 결정→DEV-66 범위 확정/승인된 연결이다. WBS와 DEV-66에 POL-19 선행을 추가했다. ‘API가 없어 비활성화’라는 예전 후보 문구는 현재의 이유로 그대로 구현하지 않는다. 실제 전역/야간 활성화·새 문구는 아직 승인하지 않았다.
- Task114개·원본79개는 그대로다. 의존성은 POL-19→DEV-66 하나만 추가해155→156이다. 원본/coverage·기존 실제 QA와 모든 차단/보류를 보존한다. 현재 상태/집계와 공식 다음은 WBS에서만 관리한다.
- [재개 점검 규칙](../workflow.md#backend-contract-recheck)을 task-cycle/start-prompt/plan/harness에 연결했다. 새 계약 등장만으로 정책/QA/권한 승인을 만들지 않는다.

## 검증과 한계

문서 링크/anchor·JSON40개 조사/43개 고정 source·WBS114Task/156의존성/DAG·79원본·기존 차단/보류·QA/baseline/coverage 및 제품 범위 보존·Markdown/diff-check와 Documentation Update Check, Context Audit·read-only verifier·6항목 ai-review를 수행한다. [검증·리뷰 결과](../reviews/backend-readiness-2026-11-13.md)와 [Context Audit](../reviews/backend-readiness-2026-11-13-context.md)을 따른다.

앱 source/package/build/test/config 변경이 없어 로컬 앱 test/lint/build/Storybook/브라우저·실제 API 통합은 미실행이다. 문서 검토 PASS와 제품/실제 API 통합 PASS·Git 전달은 별개다. 최종 PR/head·CI·merge/main SHA·clean은 실제 PR/receipt/최종 보고에서 확인한다.

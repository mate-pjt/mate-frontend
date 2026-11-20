# POL-19 · 알림 디자인·중앙 정책·인증 시간 정합성 결정

[현재 상태·우선순위는 WBS에서 확인](../README.md) · [운영 규칙](../workflow.md) · [기준선](../baseline.md)

## 작업 정의

- 유형: 정책 결정
- 원본 항목: S06, S09
- 선행 작업: [DOC-001](DOC-001.md)
- 목적/범위: 현행 중앙 문서를 다시 확인해 08:30 이메일/공고별 내부 알림과 야간/전역 토글 차이, 3분/60초의 적용 범위를 기록한다. 추천: 현행 정책을 기준으로 디자인 차이를 명시한다.
- 제외: 다른 기능·무관한 리팩터링·의존성 추가·임의 정책 확정. 실제 API 실행/데이터 변경·외부 메시지·커밋/푸시/배포는 기존 승인 범위와 해당 작업 요구사항을 확인한다.
- 착수/재개 조건: 선행 작업의 결과와 현재 요구사항을 확인한 뒤 착수한다.
- 책임: 다음으로 선택된 작업의 실행자. 정책 승인/테스트 자원 담당자는 착수 시 근거와 함께 특정한다. 미확인 담당자를 임의 지정하지 않는다.

## 기준선과 근거

아래는 2026-10-27 보고서 관찰값이다. 현재 구현/배포는 착수 시 다시 확인한다. 코드 경로와 줄 번호는 기준선 위치이며 현재 행 번호가 달라질 수 있다.

### S06 · 야간 수신·전역 공고 상세 알림 토글
- 기준선: UI **현재 정책상 없음**, 동작 **정책 차이**, 데이터 **정책에서 제외**. 검증: 현재 mate-docs 알림 정책 재확인.
- 남은 점: Figma를 그대로 복원하기보다 08:30 이메일·공고별 내부 알림 정책을 디자인에 반영
- Figma: [3139:52591](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-52591)
- 소유 소스/기존 기록: [src/components/my/notification-settings-page-client.tsx:222](../../../../src/components/my/notification-settings-page-client.tsx)、[docs/ai-context/data-access.md:119](../../../../docs/ai-context/data-access.md)

### S09 · mock 이메일 인증 시간 정책
- 기준선: UI **구현**, 동작 **정책과 다름**, 데이터 **mock 10분/30초**. 검증: 현재 mate-docs §7 대조.
- 남은 점: 현재 중앙 정책 3분/60초와 mock·개발 가이드의 차이 해소; API UI는 서버 만료시각 사용
- Figma: [3139:56715](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-56715)
- 소유 소스/기존 기록: [src/data/notification-settings/mock-repository.ts:21](../../../../src/data/notification-settings/mock-repository.ts)、[docs/development/repositories.md:70](../../../../docs/development/repositories.md)、[src/components/my/notification-email-verification-dialog.tsx:70](../../../../src/components/my/notification-email-verification-dialog.tsx)

## 완료 기준

- [ ] 현재 정책 SHA/적용 범위와 Figma 차이를 기록한다
- [ ] 야간/전역 토글을 임의 복원하지 않고 디자인 정합성 후속 조치를 정한다
- [ ] API UI는 서버 시각 사용, mock/가이드의 10분/30초 차이만 별도 수정 대상으로 확정한다
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

## 2026-11-11 · QA-17 전수 점검 보완

- 근거: [감사 CF-14](../audits/2026-11-11.md#cf-14) · [route/API·출처 인덱스](../audits/2026-11-11.json).
- 범위/소유: 현재08:30 맞춤 이메일1토글·독립 내부알림은 현행 정책 근거가 있다. Figma3토글과 다르다는 이유로 전역/야간 토글을 복원하지 않는다.
- 추가 완료/재개 기준: 동작의 정책 근거와 명시적 화면 승인/예외를 분리해 POL-29와 연결한다. mock3분/60초·5회/재전송은 DEV-41, 채널/관리 안내는 DEV-62.
- 이 절은 날짜별 후속 계획이다. 앞선 결정/QA/예외 이력을 대체하지 않으며 제품 구현·실제 업무 API 변경/새 통합 PASS는 없다. 상태는 WBS에서만 관리한다.

## 2026-11-11 · POL-29 화면 기준 인계

- 화면 방향은 [POL-29 최종 사용자 결정](POL-29.md#pol-29-decisions)으로 보정됐다. 이메일1개만 남기는 최초 추천 대신 **Figma 세 항목/스위치 유지, 전역 상세·야간 disabled+API 미지원 안내**를 승인했다. 실제 이메일과 공고별 내부 알림의 독립 정책은 그대로다.
- 전역/야간 기능 도입 또는 활성화·endpoint/DTO 계약은 승인되지 않았다. UI/미지원 인터페이스 준비는 DEV-66, mock3분/60초·5회/재전송은 DEV-41, 기존 채널 안내는 DEV-62로 분리한다. 이 Task의 정책 Gate/체크리스트 완료로 세지 않는다.
- 향후 활성화는 정책 소유의 기능 범위/수신 시간·권한/기존 설정 전환과 실제 backend 계약·배포/실행/QA 자원을 별도 확인해야 한다. API가 생겼다는 이유만으로 자동 활성화하지 않는다.

<a id="pol-19-backend-20261113"></a>

## 2026-11-13 · 설정 계약 등장에 따른 후속 정책 확인 범위

- [재조사/고정 source](../audits/2026-11-13-backend-readiness.md)에서 인증 `GET/PATCH /api/v1/me/notification-settings`와 `detailAlertsEnabled/nightAlertsEnabled`를 확인했다. 기본값은 상세ON/야간OFF, PATCH는 제공한 boolean만 변경·누락 유지·최소1필드·명시 null/문자/숫자400이다. Swagger request가 일반 JsonNode여서 구체 명세 보완이 필요하다. 이 관찰은 정책 확정/실제 업무 응답 PASS가 아니다.
- 전역 상세OFF는 공고 사건·마감 알림 처리 query에서 계정을 제외한다. 개별 공고 등록은 유지한다. POL-03의 전체 목록/일괄 해제와 구분하고 OFF→ON 소급/대기열·진행 중 처리/범위, 이메일/관리 알림과의 관계·기존 값 이행을 소유 정책/source로 확인한다.
- 야간 값은 저장되지만 UseCase가 전달 시각을 바꾸지 않는다고 명시한다. 실제 야간 억제/예약 전달 완료로 해석하지 않는다. 적용 대상·시간대/효력·화면 안내는 아직 미결이다. 중앙 문서의 야간 설정 없음은08:30 맞춤 이메일 절의 설명이므로 별개 상세 알림 선택과 바로 충돌한다고 단정하지 않는다.
- 후속 역할: backend/API 역할은 구체 request/오류·실제 효력/배포 대응, 제품/디자인 역할은 문구·미결 표시/수신 정책, 프런트 역할은 승인한 경계/검증안을 제공한다. 개인 담당자/새 결정은 미확정이다. 추천은 **정책과 지원 수준을 먼저 확정한 뒤 DEV-66을 연결**하는 것이며 자동 활성화 승인이 아니다.
- 이번 사용자 승인은 근거/후속 정의·선행 관계 문서 반영이다. WBS에 POL-19→DEV-66 선행을 추가했으며 POL-19 자체 정책 Gate는 실행하지 않았다. 인증시간3분/60초·mock/가이드 소유 DEV-41과 QA-12/13·POL-29 기존 미결/예외를 보존한다. 현재 상태는 WBS에서만 관리한다.

<a id="pol-19-pol-18-handoff"></a>

## 2026-11-20 · POL-18에서 선정 및 인계

- 기존 P0/P1 차단·대기와 앞선 P2 선행을 적용했다. POL-18은 탈퇴 계약·인증 및 정책 회신이 필요하고 DEV-39/40의 선행은 충족되지 않는다. POL-19는 DOC-001을 충족한 기본 표 순서의 첫 독립 P2 후보다. [선정 근거](POL-18.md#pol-18-handoff)
- 새 대화의 첫 행동은 최신 main에서 이 기록의 마지막 정책 체크포인트와 S06/S09, 중앙 알림 정책·현재 개발 계약의 적용 범위를 확인하는 것이다. 08:30 맞춤 이메일, 공고별 내부 알림, 야간/전역 상세 토글과 알림 수신처 인증 시간을 어떤 기능에 적용하는지 이번 근거로 정리한다.
- 인계 범위는 후보 선정과 첫 행동이다. POL-19에 대한 정책 조사, 결정, UI/API 변경, 실제 QA 또는 Git 전달은 자체 Gate에서 시작한다.

<a id="pol-19-brief"></a>

## 2026-11-20 · 착수 Brief와 승인 근거

- 출발점은 로컬·원격 `main` `f6bbb69030dda027918a26d4aa87f2b6cf663adb`다. 13:34 KST에 작업트리 clean, 기존 POL-19 브랜치 없음, fetch 후 양쪽 차이 0/0과 선행 DOC-001(`9eae9c0`)·POL-29(`5f9d53d`)·DEV-62(`65b649d`)·11/13 재조사(`cde9641`)의 main 반영을 확인했다. 직전 인계는 [PR #98](https://github.com/mate-pjt/mate-frontend/pull/98)에 있다. `docs/pol-19-notification-policy`를 이 기준에서 만들었다.
- 대상은 S06·S09의 정책과 문서다. [2026-11-11 사용자 화면 결정](POL-29.md#pol-29-decisions)과 중앙 정책의 발송·대체 이메일 인증 규칙을 적용한다. 백엔드가 공개한 계약과 프런트의 연결 상태, 시안의 화면 요구, 실제 전달 효과의 증거 수준을 확인한다. 열려 있는 활성화 결정은 후속 조건으로 남긴다.
- 2026-11-20 사용자가 이번 문서 검증·두 리뷰, 목적별 commit/push·PR·최종 head CI, 조건을 충족한 정상 병합과 로컬 `main` fast-forward를 승인했다. 이번 PR의 Chromatic 월간 한도 문제만 예외다. 제품 코드, 중앙 문서·디자인 파일 편집, 실제 업무 API/메일/데이터 변경·운영·배포 및 다음 Task 실행은 범위 밖이다.
- [알림 설정 화면](../../../../src/components/my/notification-settings-page-client.tsx), [공개 Repository 진입점](../../../../src/data/notification-settings/client.ts), [인증 창](../../../../src/components/my/notification-email-verification-dialog.tsx), [개발 가이드](../../repositories.md), [데이터 접근 가이드](../../../ai-context/data-access.md)와 QA-12/13의 기존 증거를 확인했다. 최종 UI 문구는 DEV-66 자체 Gate에서 정한다. 기존 비활성 화면 승인으로 후속 범위를 문서화할 수 있어 이번 범위의 필수 미결 결정은 없다.
- 편집 순서는 이 기록과 WBS 착수 표시 → 정책·Figma·계약 표와 DEV-41/66의 수용 기준 → 공통 계획/데이터 접근 설명 → 문서 검증·두 리뷰 → 종료/인계·전달이다. 원본 79개와 Task 114개·선행 156개, 과거 QA/결정·제품 변경 유무, Markdown 링크·앵커·형식 및 `git diff --check`를 검증한다. 설정 API 존재·야간 저장을 화면 연결이나 실제 야간 전달로 해석하는 위험을 별도로 검토한다.

### 착수 체크포인트

2026-11-20 13:34 KST · Codex 조사에서 현재 정책/프런트, 백엔드 소스·개발 OpenAPI 및 Figma 대표 상태의 적용 범위를 대조했다. 시작 기준은 위 SHA이며 브랜치 생성 전 미커밋 변경은 0건이다. 다음 행동은 확인한 정책·버전과 활성화 전 해소할 공백을 아래에 기록하고 후속 수용 기준을 연결하는 것이다.

<a id="pol-19-evidence"></a>

## 2026-11-20 · 현재 근거

| 구분 | 확인 결과 |
| --- | --- |
| 중앙 정책 | `mate-docs/main` `c9e50ff591ae18023164e1a94581c611bf1e4f29`, 문서 blob `c649b3092157a091f1be54d92195e65622150ac9`. 해당 파일의 마지막 commit은 [2026-09-10 10:06 KST](https://github.com/mate-pjt/mate-docs/commit/2c285087abf3184bbf65701f2470bcc195ec2a07)다. [공고별 등록·채널 §1~2](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/notification/overview.md#L5-L28) · [08:30 발송 §6](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/notification/overview.md#L114-L129) · [대체 이메일 §7](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/notification/overview.md#L160-L172) |
| 백엔드 소스 | 개발 `ab388b7cb06154a00e254eff7b124882952166ac` 및 기본 `main` `4b5f31de578c41e698dda9c99e66149b7292f031`. 설정·이메일 인증 controller와 서비스, 설정 UseCase·도입 migration·공고 사건·마감·관리자 안내 경로 9개 blob을 대조해 같음을 확인했다. 계약·처리 경로는 dev에 고정했다. 설정 도입 변경은 [백엔드 PR #134](https://github.com/mate-pjt/mate-backend/pull/134)에 있다. |
| 백엔드 CI/개발 배포 기록 | 개발 ref의 [CI #44429902651](https://github.com/mate-pjt/mate-backend/actions/runs/44429902651)에서 verify/publish/deploy 성공을 확인했다. 2026-11-19 10:04 KST 완료이며 deploy-prod는 skipped다. |
| 게시된 개발 OpenAPI | [2026-11-20 HTTP 200, OpenAPI 3.1.0 / v1](https://api-test.mate-bid.com/v3/api-docs), 184 paths·209 operations, SHA-256 `9e0b737fd92953b9f7a668aeecb61ce32b865bb3861999f9775fdfb523d21dd2`. 공개 메타데이터만 조회했다. |
| 실행 중 버전과 업무 응답 | 현재 서버 프로세스의 SHA/이미지 digest 대응은 미확인이다. 인증된 업무 API 호출, 설정 저장, 메일 발송·인증·수신과 내부 알림 전달은 미실행이다. |
| 프런트와 기존 QA | 시작 SHA의 [화면](../../../../src/components/my/notification-settings-page-client.tsx#L219), [HTTP Repository](../../../../src/data/notification-settings/http-repository.ts), [mock](../../../../src/data/notification-settings/mock-repository.ts)과 [DEV-62 로컬 안내 QA](../../../qa/notification-guidance.md)를 대조했다. 기존 통과·차단은 [맞춤 이메일 NSET](../../../qa/notification-settings.md)과 [수신처 NREC](../../../qa/notification-email-recipient.md)를 따른다. |

### Figma 대표 상태

| 원본 | 2026-11-20 Figma 노드 조회 | 현재 화면·후속 기준 |
| --- | --- | --- |
| S06 | [알림 설정 3139:52591](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-52591)은 수신처와 세 스위치를 배치한다. 맞춤 공고 행은 실시간 수신, 야간 행은 21:00~09:00 억제와 09:00 일괄 알림을 설명한다. | 현행 웹은 수신처 선택과 맞춤 이메일 스위치 하나를 표시한다. DEV-66은 사용자 승인대로 세 항목의 구성을 반영한다. 08:30 이메일 안내를 적용하고 비활성 상세·야간 행에는 실제 효력을 약속하는 문구를 쓰지 않는다. |
| S09 | [인증번호 상태 3139:56715](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-56715)의 팝업 `3139:56915`는 4자리 입력과 재전송을 표시한다. | [팝업 소스](../../../../src/components/my/notification-email-verification-dialog.tsx#L63)는 공급원에서 반환된 절대 시각을 카운트다운한다. 만료·재전송 시간 규칙은 중앙 정책과 서버 응답을 따른다. |

두 1920×1080 프레임의 노드 구조·문구를 대조했다. 시안의 다른 해상도·상태와 실제 브라우저 시각 검증은 DEV-66의 범위다.

<a id="pol-19-contract"></a>

## 2026-11-20 · 정책 적용과 보류 조건

### 기존 정책 적용

1. **맞춤 공고 이메일**은 개인 공고 필터에 맞는 새 공고가 있을 때 매일 08:30 KST에 한 번 발송한다. 대상은 서비스에서 전날 08:30 이상, 당일 08:30 미만의 구간에 처음 공개한 공고다. 기본 OFF이며 사용자는 맞춤 이메일의 수신 여부와 인증된 수신처를 각각 설정한다. 발송 시각은 고정이고 이 채널에 별도의 야간 옵션은 없다. 프런트의 맞춤 이메일 `GET/PATCH /api/v1/me/matched-bid-notice-email-settings`와 수신처 `GET/PATCH /api/v1/me/notification-email-settings`를 각각 유지한다. [중앙 정책 §6~7](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/notification/overview.md#L114-L172)
2. **공고별 내부 알림**은 해당 공고를 등록한 계정에 정정·재공고·개찰 결과·마감 사전 안내를 서비스 안에서 전달한다. `GET/PUT/DELETE /api/v1/me/bid-notice-alerts/{bidNoticeId}`로 개별 등록을 관리하며 맞춤 이메일을 꺼도 등록은 유지된다. 관리자 직접 안내는 별도 수신자 기준을 쓴다. [중앙 정책 §1~2](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/notification/overview.md#L5-L28) · [관리자 직접 안내](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/notification/overview.md#L174-L206)
3. **대체 수신 이메일 인증**에만 4자리·3분 만료·60초 발송 대기·오입력 최대 5회·재전송 시 이전 요청과 번호 무효화를 적용한다. 대체 주소를 성공적으로 인증하면 그 주소로 전환되며 만료·실패·이탈 때 기존 수신 설정은 유지된다. Google 로그인·가입 이메일·계정 정보나 탈퇴 인증에는 이 시간 규칙을 적용하지 않는다. [중앙 정책 §7](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/notification/overview.md#L160-L172)

### 전역 상세와 야간의 계약 및 화면 요구

- `GET/PATCH /api/v1/me/notification-settings`는 개발 명세에서 사용자 인증이 필요하다. 소스에서는 본인인 활성·미삭제 계정만 처리하며 응답에 `detailAlertsEnabled`와 `nightAlertsEnabled` 두 boolean을 반환한다. 저장 행이 없으면 상세 ON/야간 OFF다. PATCH는 JSON 객체에 지원 필드 중 최소 하나의 boolean을 받아 누락 필드는 유지한다. 빈 요청이나 명시한 null·문자열·숫자는 400이다. Swagger의 PATCH 스키마는 일반 `JsonNode`여서 지원 필드·오류를 공개 명세에 구체화할 필요가 있다. [Controller](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/input/web/notificationsetting/NotificationSettingController.kt#L20-L65) · [계정 검증·부분 변경](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/application/service/notificationsetting/NotificationSettingService.kt#L25-L50)
- **상세 OFF**는 공고 사건 배포와 마감 후보를 조회할 때 계정을 제외한다. 설정 변경은 계정 설정 행에 적용되고 개별 등록이나 이미 저장된 알림 이력을 지우지 않는다. 개별 목록·일괄 해제는 [POL-03](POL-03.md)의 범위다. 사건은 처리 시점의 상태를 보고 완료 처리된 사건을 다시 고르지 않는다. 마감 후보는 아직 마감 전이라면 현재 값으로 다시 평가한다. 따라서 OFF 기간에 발생한 **미처리** 사건/마감과 ON 복귀의 소급 여부, 저장과 이미 시작된 배포가 겹칠 때의 효력을 일률적으로 약속할 수 없다. 적용 시점·복귀·이행 기준은 활성화 전에 소유자가 명시한다. [사건 처리](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/notification/BidNoticeAlertEventDispatchPersistenceAdapter.kt#L23-L54) · [현재 상세 값 필터](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/notification/BidNoticeAlertEventDispatchPersistenceAdapter.kt#L95-L109) · [마감 후보](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/biddeadlinereminder/BidDeadlineReminderCandidatePersistenceAdapter.kt#L80-L100)
- **야간 값**은 같은 API로 읽고 저장할 수 있다. 현재 소스의 계약은 그 값으로 전달 시각을 바꾸지 않는다. 시간대·대상 채널·지연/합산·재시도·기존 선택 이행에 대한 정책과 처리 근거가 생길 때까지 21:00~09:00 억제/09:00 일괄 알림을 적용하거나 안내하지 않는다. [UseCase 소유 계약](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/application/port/input/notificationsetting/NotificationSettingUseCase.kt#L3-L28)
- **웹 화면**은 2026-11-11 사용자 승인대로 DEV-66에서 세 항목·스위치와 수신처 구성을 반영하고 상세·야간은 비활성으로 설명한다. 현재도 맞춤 이메일만 설정 화면의 스위치에 연결돼 있다. 과거의 “API가 없다”는 사유는 현재 계약과 맞지 않는다. 화면 설명은 웹 연결이 보류된 상세 설정과 발송 시간 효과가 준비되지 않은 야간 설정을 구분한다. 최종 문구는 DEV-66 자체 Gate에서 확인하며, 상세·야간 GET/PATCH 또는 실제/합성 사용자 설정값 노출·저장은 별도 활성화 승인 전까지 수용 기준에 포함하지 않는다. [POL-29 사용자 결정](POL-29.md#pol-29-decisions) · [DEV-66 후속 기준](DEV-66.md#dev-66-pol-19-boundary)

### 인증 시각과 후속 개발 경계

- 백엔드 소스는 계정의 최초 발송·재전송에 같은 60초 대기, 3분 만료와 다섯 번째 오입력에서의 한도 처리, 재전송 뒤 요청 교체를 적용한다. 시작·재전송 응답에 `verificationId`, `expiresAt`, `resendAvailableAt`이 있다. 프런트 API UI는 시작과 재전송에서 받은 최신 서버 절대 시각으로 만료·재요청을 표시한다. [백엔드 인증 서비스](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/application/service/notificationemail/NotificationEmailVerificationTransactionService.kt#L35-L105) · [시각 반환과 한도](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/application/service/notificationemail/NotificationEmailVerificationTransactionService.kt#L132-L199)
- 현재 mock과 개발 가이드는 **10분/30초**다. mock은 재전송에서 같은 요청 ID와 고정 합성 번호를 사용하므로 이전 요청/번호 무효화도 재현하지 못한다. 타이밍과 연관된 오입력·재전송 상태를 교정할 런타임은 DEV-41의 mock 범위다. 기존 HTTP 계약·계정 인증·실제 발송의 변경은 별도 범위다. [mock](../../../../src/data/notification-settings/mock-repository.ts#L20) · [개발 가이드](../../repositories.md#4-가상-계정회사이메일-사용) · [DEV-41 수용 기준](DEV-41.md#dev-41-pol-19-handoff)

| 날짜·결정 주체 | 이 기록에 적용한 근거 | 다음 단계 |
| --- | --- | --- |
| 중앙 정책 소유 문서 · 2026-11-20 재확인 | §1/2/6/7의 채널·발송·대체 수신처 인증을 제품 기준으로 사용한다. | DEV-41에 mock/가이드 정합성 및 검증 책임을 연결한다. |
| 사용자 · 2026-11-11 | POL-29의 세 항목과 비활성 설명 방향을 적용한다. | DEV-66 자체 Gate에서 실제 지원 수준에 맞는 설명을 확정한다. |
| Codex · 2026-11-20 근거 정리 | 전역 상세의 현재 필터링과 야간의 저장 지원을 관찰했다. 해당 기능 활성화·신규 야간 배치·OFF→ON 소급 정책의 승인 근거는 확보하지 않았다. | 활성화에 앞서 정책/디자인 담당의 효력·안내, 백엔드 담당의 명세 및 실행 대응, 프런트 QA의 합성 자원·변경/복구 범위를 각각 확인한다. 담당 개인은 미정이다. |

### 정책 기록 체크포인트

DEV-41과 DEV-66의 후속 조건을 연결한다. 기존 [DEV-62](DEV-62.md#dev-62-verification)는 채널과 관리 안내의 로컬 교정 증거다. [QA-12 NSET-07](QA-12.md#qa-12-resume) 1건과 [QA-13 NREC-03/04/05/06/07/09](QA-13.md#qa-13-resume) 6건의 실제 검증 차단, 기존 통과·대기와 당시 진행 예외는 유지한다. 다음 행동은 변경된 문서의 링크·상태·범위와 기존 QA 보존을 검증하고 두 리뷰를 받는 것이다.

2026-11-20 13:41 KST · 초안 6개 Markdown의 링크 705개와 앵커/줄 참조 354개·표 22개, 원본 79개·Task 114개·선행 156개와 기존 기록 94개의 일치를 확인했다. 제품 코드는 무변경이다. 다음 행동은 독립 verifier와 ai-review에서 정책 근거·검증 범위를 확인하고 종료 및 다음 선정의 증거를 기록하는 것이다.

<a id="pol-19-close"></a>

## 2026-11-20 · 문서 검증과 다음 작업 인계

- 중앙 정책 SHA·Figma 두 상태, 사용자 승인에 따른 세 항목/비활성 범위, 대체 수신처 인증의 서버 시각과 mock 차이, DEV-41/66의 수용 기준과 미결 조건을 연결했다. 기록 단위의 판정 범위는 정책·문서다. 기존 발송 및 실제 설정 QA의 차단은 각 QA 기록을 따른다.
- 초안 verifier는 PASS와 Minor 2건을 보고했다. DEV-41의 mock 공급원·계정 공통 60초 기준과 DEV-66의 비활성 프런트 연결 인터페이스를 보완했다. 종료·인계 문서를 포함해 검증과 두 리뷰를 다시 확인한다. [Context Audit·verifier·ai-review](../reviews/POL-19.md)
- 다음 하나는 [DEV-41](DEV-41.md#dev-41-pol-19-handoff)이다. 앞선 P0/P1 차단과 P2 선행 대기를 적용한 표 순서상 POL-19를 충족하는 첫 후보다. 새 대화에서 최신 `main`과 이 정책 반영을 확인하고 mock Repository·기존 인증 테스트·가이드의 시간과 재전송을 대조해 요구사항을 정한다. 이번에는 선정·인계를 기록했다.

<a id="pol-19-delivery"></a>

### Git 전달 기록

2026-11-20 사용자 요청의 Git 범위는 위 Brief를 따른다. [POL-19 작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Adocs%2Fpol-19-notification-policy)에 최종 diff의 검증·리뷰, 정확한 head의 원격 CI·판정 및 병합 이력을 연결한다. main 반영은 PR과 로컬/원격 동기화 결과에서 확인한다.

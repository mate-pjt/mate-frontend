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

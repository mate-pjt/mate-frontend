# DEV-66 · 알림 설정 Figma 화면·미지원 API 연결 경계

[상태의 단일 기준: WBS](../README.md) · [정책 결정](POL-29.md#pol-29-decisions) · [운영 규칙](../workflow.md)

## 작업 정의

- 유형: 개발 후보. 원본 S04/S06/C01과 감사 CF-14의 화면 정합성 후속이다. 선행은 POL-29이며 이번에 구현하지 않는다.
- 목적: Figma의 세 설정 항목/스위치와 수신처/카드 배치를 유지하고, 지원되는 맞춤 이메일만 실제 동작하게 한다. 전역 상세·야간 설정은 비활성/사유 안내와 미지원 인터페이스 경계를 준비한다.
- 승인 근거: 2026-11-11 사용자의 [Figma 구성 유지·API 미지원 disabled/tooltip 결정](POL-29.md#pol-29-decisions). 전역/야간 도메인 정책 도입·백엔드 endpoint/DTO 확정·미래 자동 활성화 승인은 아니다.
- 후보 소유: [notification-settings-page-client](../../../../src/components/my/notification-settings-page-client.tsx), [notification-settings contracts](../../../../src/data/notification-settings/contracts.ts), 기존 UI/Repository 공개 경계. 실제 수정 파일/인터페이스 형태는 착수 Gate에서 확인한다. 새 라이브러리 추가 없음.
- 제외/경계: 인증시간 mock/가이드는 DEV-41, 정책과 향후 활성화 계약은 POL-19, 기존 공고별/관리 안내·DESIGN 동기화는 DEV-62, 실제 설정/인증 QA는 QA-12/13이다. 사용자 이름·홈·다른 화면을 함께 구현하지 않는다.

## 착수 전 Brief·검증 Gate

- POL-29 최종 결정/현재 ref·Figma 3139:52591/3139:56715와 data-access를 읽고 현재 email/per-bid/global/night 지원 범위를 다시 확인한다.
- 현재 Repository 규칙 안에서 capability/미지원 결과를 표현하는 프런트 연결 인터페이스만 설계한다. 없는 HTTP URL·DTO·저장값·정상 응답을 만들어내지 않는다. 화면의 disabled 제어가 요청을 보내지 않는 경계와 재사용 패턴을 제시한다.
- 편집 전 실제 파일·영향/범위·실행 순서·위험·검증 자원을 제시한다. 실행 시 node22.20.0/실제 package scripts, source와 build snapshot·계정 격리·기존 설정 수명 규칙을 확인한다.

## 완료 기준

- [ ] Figma 세 항목/수신처/카드·아이콘·간격을 대조하고 맞춤 이메일 하나만 기존 GET/PATCH에 연결한다. 08:30 안내·기존 이메일 ON/OFF/수신처 독립성을 유지한다.
- [ ] 전역 상세·야간은 disabled와 `API가 없어 아직 비활성화되어 있습니다` 안내를 표시한다. 미지원 상태를 임의 ON/OFF 저장값으로 취급하지 않고 조작/요청/저장/mock 변경0건을 확인한다.
- [ ] 미지원 capability/프런트 인터페이스와 실제 HTTP 계약 경계를 분리한다. 없는 URL·DTO·가짜 성공/자동 fallback을 추가하지 않는다. 계약이 생겼다는 이유만으로 자동 활성화하지 않는다.
- [ ] tooltip/설명을 마우스뿐 아니라 keyboard focus·touch·보조기술에서도 확인한다. disabled element 자체가 focus를 받는다고 가정하지 않는다. 320/390px·로딩·오류·저장중/만료/세션 교체와 기존 인증 dialog 접근성을 검증한다.
- [ ] 활성화 재개는 POL-19의 도메인 결정, 실제 backend URL/DTO/version·권한/미지원/오류 계약, 현재 배포/실행 대응·안전한 QA 자원/복구 조건을 확보한 별도 Gate다. 이번 Task에서 미지원 기능 자체를 켜지 않는다.
- [ ] 현재 package scripts의 test/lint/build·영향 시 build-storybook, 실제 Next/mock/HTTP 대역 경계와 요청0건, diff-check·Documentation Update Check·verifier/ai-review를 수행한다. 미실행 실제 QA는 통과로 세지 않는다.

## 체크포인트 · 2026-11-11

POL-29에서 사용자 화면 결정을 전달하기 위한 후보 정의만 추가했다. 제품/인터페이스 코드·업무 API·실제 QA·이 Task의 검증/리뷰는 미실행이다. 다음 첫 행동은 WBS에서 선택된 다음 대화의 새 요구사항 Gate이며 자동 착수하지 않는다. 현재/다음/상태는 WBS만 관리한다.

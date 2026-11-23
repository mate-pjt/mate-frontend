# DEV-66 · 알림 설정 Figma 화면·미지원 API 연결 경계

[상태의 단일 기준: WBS](../README.md) · [정책 결정](POL-29.md#pol-29-decisions) · [운영 규칙](../workflow.md)

> 아래 11/11 후보 정의·완료 기준과 11/13 조사는 당시 이력이다. 현행 후보 범위와 재개 조건은 [POL-19 인계](#dev-66-pol-19-boundary)를 따른다.

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

<a id="dev-66-backend-20261113"></a>

## 2026-11-13 · 현행 계약과 정책 선행을 반영한 후속 기준

- 근거/승인: [날짜별 재조사](../audits/2026-11-13-backend-readiness.md)와 이번 [문서 반영 승인](POL-09.md#pol-09-backend-replan-approval). 전역/야간 설정 API가 생겼으므로 기존 API 부재를 전제로 한 후보 사유를 갱신한다. **제품 활성화/새 수신 정책/문구의 승인은 아니다.**
- 선행은 POL-29와 **POL-19**다. Figma 세 항목/수신처/카드와 기존 맞춤 이메일 독립성은 유지하되, POL-19에서 구체 request/오류·전역 OFF/ON·야간 저장/실제 전달의 지원 수준·안내/기존 값 이행을 확정한 뒤 이 Task의 자체 Brief를 제시한다. 지원되지 않은 효과를 약속하는 문구나 가짜 정상/자동 fallback을 만들지 않는다.
- 계약 관찰: `GET/PATCH /api/v1/me/notification-settings`의 전역 상세 값은 사건·마감 처리에 쓰이고, 야간 값은 저장만 하며 전달 시각을 바꾸지 않는다. 기본값/부분 변경/권한/오류와 Swagger JsonNode 공백은 [POL-19 후속 범위](POL-19.md#pol-19-backend-20261113)에서 확인한다. 현재 frontend Repository/DTO/mock가 이미 연결됐다는 뜻은 아니다.

### 이후 재개·완료 기준

- [ ] POL-19의 정책/지원 수준·문구와 실제 계약/실행 대응·안전한 QA 자원/복구 범위를 확보하고 편집 전 자체 Brief를 제시한다. 확보 전 자동 활성화하지 않는다.
- [ ] 승인된 전역 연결과 야간 저장/실제 전달의 지원 범위를 분리한다. 옛 `API가 없어 아직 비활성화되어 있습니다`를 그대로 재사용하지 않고 실제 남은 조건에 맞는 안내를 승인받는다. 현 단계에서는 대체 문구/ON/OFF를 임의 확정하지 않는다.
- [ ] Figma 세 항목/수신처·08:30 이메일/공고별 등록 독립성, 320/390px·로딩/오류/저장/만료/계정 교체·설명 focus/hover/touch/보조기술을 검증한다. 실제 구현 범위가 결정되면 요청0건/실제 호출·mock 저장의 기대값도 그 승인 범위에 맞춰 명시한다.
- [ ] data-access의 공개 Repository/공급원·계정 격리 규칙과 현재 package scripts의 자동/실제 Next 브라우저·필요한 통합 검증, 문서 갱신·verifier/ai-review를 수행한다. 미실행 실제 QA는 PASS로 세지 않는다.

- 위11/11의 ‘이메일만 실제 동작·전역/야간은 API없음 안내·조작/요청0건’은 당시 후보 이력으로 보존한다. 이후 적용할 실제 동작/요청 범위는 POL-19와 새 Brief의 승인 전까지 미확정이다. DEV-41/62·QA-12/13과 이름/헤더 소유 경계를 유지한다. 이번에는 후보/선행만 갱신했으며 제품·정책 Gate는 미실행이다. 상태는 WBS만 소유한다.

<a id="dev-66-pol-19-boundary"></a>

## 2026-11-20 · POL-19 화면 수용 기준과 활성화 선행

- 자체 Brief의 입력은 [POL-29의 세 항목·비활성 화면 승인](POL-29.md#pol-29-decisions)과 [POL-19의 현재 정책·개발 계약](POL-19.md#pol-19-contract)이다. 수신처와 세 스위치, 기존 08:30 맞춤 이메일과 공고별 내부 알림의 분리를 검증한다. 전역 상세는 백엔드 처리 필터가 있고 웹 연결은 보류돼 있다. 야간은 설정 저장이 있으며 시간 조정 효과가 준비되지 않았다. 두 행은 비활성으로 표현하고 최종 문구는 자체 Brief에서 확인한다.
- 기존 공개 Repository 경계에 비활성 지원 상태와 프런트 연결 인터페이스를 준비한다. 이 범위의 수용 조건은 상세·야간 조작, 해당 GET/PATCH, 설정 저장/가상 성공 또는 임의 기본값 표시 0건이다. 현행 맞춤 이메일과 인증 상태의 로딩·오류·계정 전환, 320/390px와 설명의 focus/hover/touch 및 보조기술 접근을 확인한다. Figma의 실시간 맞춤 이메일, 야간 억제와 09:00 일괄 전달 설명은 실제 지원 설명으로 옮기지 않는다.
- 별도 활성화 Gate에서 백엔드 담당이 구체 PATCH/오류 명세와 실행 버전, OFF→ON·미처리/진행 중 이벤트의 실제 효력과 기존 저장값 이행을 확인한다. 정책·디자인 담당이 각 토글의 효력·범위·문구를 승인한다. 야간은 적용 채널·시간대·억제/지연·일괄 전달 구현까지 확인해야 한다. 합성 설정값·기존 등록/이력·관리자 안내와 맞춤 이메일의 독립성, 권한·부분 변경·경합·복구를 검증할 승인된 자원이 필요하다.
- [DEV-41](DEV-41.md)의 인증 시각과 [DEV-62](DEV-62.md)의 기존 채널 안내, [QA-12](QA-12.md)/[QA-13](QA-13.md)의 실제 QA 소유 범위를 따른다. 이번 POL-19에서 DEV-66 제품 작업이나 실제 설정 QA는 시작하지 않았다.

<a id="dev-66-dev-64-handoff"></a>

## 2026-11-23 · DEV-64 다음 작업 인계

- [DEV-64 로컬 종료](DEV-64.md#dev-64-close) 뒤 앞선 P0/P1·P2의 차단과 미충족 선행을 적용했다. [WBS](../README.md)에서 [POL-29](POL-29.md#pol-29-decisions)와 [POL-19](POL-19.md#pol-19-contract)가 완료된 첫 P2로 선정했다.
- 첫 행동은 위 [POL-19 인계](#dev-66-pol-19-boundary)와 Figma `3139:52591`·`3139:56715`를 현재 알림 설정 화면과 대조해 자체 요구사항 Gate를 작성하는 것이다. 세 설정 항목과 지원되는 08:30 맞춤 이메일, 전역 상세·야간의 비활성 제어 및 설명을 확인한다. 두 기능의 실제 활성화에는 별도 정책·계약·QA 선행이 적용된다.
- 이 기록은 [다음 작업](../README.md)의 선정과 인계다. 검토·설계·구현·실제 QA 착수는 DEV-66 대화에서 판단한다.

<a id="dev-66-brief"></a>

## 2026-11-23 · Implementation Brief와 설계

- 개발 P2 · `/my/settings/notifications`의 수신처 카드와 맞춤 공고 이메일·입찰공고 상세·야간 세 행을 정렬한다. 맞춤 공고 이메일은 기존 조회·저장과 오전 8시 30분 정책을 계속 사용한다. 수신처의 선택·인증과 공고별 내부 알림은 기존 독립 계약을 따른다.
- 사용자 2026-11-11 [POL-29 D3](POL-29.md#pol-29-decisions)가 세 항목·비활성 설명을 승인했다. 2026-11-20 [POL-19](POL-19.md#pol-19-contract)가 상세의 웹 연결 보류와 야간의 전달 시각 미지원, 별도 활성화 선행을 기록했다. Codex는 이 승인 범위에서 상세 안내를 `입찰공고 상세 알림은 웹에서 아직 설정할 수 없어요.`, 야간 안내를 `야간 시간에 따른 알림 조정은 아직 지원되지 않아요.`로 선택했다. 설명 카드는 처음 펼쳐 두고, 제목과 화살표로 접고 펼칠 수 있게 한다. 시안의 예시 시각, 실시간 이메일·야간 수신 동의 및 09:00 전달 약속에는 사용할 제품 계약이 없다.
- 2026-11-23 사용자는 DEV-66의 검증·두 리뷰·목적별 커밋·push·PR 및 최종 head CI, 조건 충족 시 정상 병합·로컬 fast-forward, 이 PR의 Chromatic 월간 한도 예외를 승인했다. 실제 설정 요청과 계정/메일 사용, 도메인 정책·API/DTO 변경, 배포 직접 조작, 다른 Task 구현은 이 범위 밖이다. 실서버는 [QA-12](QA-12.md)·[QA-13](QA-13.md)의 기존 승인·재개 조건을 따른다.
- [3139:52591](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-52591)의 `3139:52606` 카드와 `3139:52615` 수신처, `3139:52628`·`3139:52640`·`3139:52653` 설정 행을 구조와 스크린샷으로 확인했다. 1180px 폭, 카드 24px 여백, 설명 상자 16px 여백과 48×24px 스위치에는 기존 토큰과 아이콘을 사용한다. [3139:56715](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-56715)는 같은 배경 위 4자리 인증 단계의 참고 시안이다. 이 단계의 타이머·재전송·취소·수신처 유지 동작을 검증한다. 모바일 치수는 기존 반응형 패턴으로 확인한다.
- 먼저 [화면](../../../../src/components/my/notification-settings-page-client.tsx)과 [공개 client](../../../../src/data/notification-settings/client.ts)·`contracts.ts`에 설정 행, 설명과 배포 공통의 비활성 사유를 연결한다. [Toggle](../../../../src/components/ui/toggle/toggle.tsx)은 비활성 사유가 있는 경우 중립 위치의 표시와 native disabled를 제공하고, ON/OFF를 의미하는 접근성 값을 생략한다. Storybook에 기존 disabled와 구별되는 상태를 보인다. 기존 수신처/맞춤 이메일의 실제 공급원과 무상태 capability를 분리한다. 위험은 비활성 행이 저장값으로 읽히거나 요청을 보내는 경우, 접힌 설명의 키보드·터치 접근 소실, 기존 저장·인증·계정 경계의 회귀다.
- Node `22.20.0`과 pnpm `11.3.0`의 `pnpm test`, `pnpm lint`, api/mock/hybrid `pnpm build`, `pnpm build-storybook`, `git diff --check`를 실행한다. 격리된 Next mock과 로컬 HTTP 대역에서 데스크톱/320/390px, Tab/Space/Enter/Escape, 마우스·터치·접근성 트리, 두 미지원 항목의 HTTP/저장 0건과 이메일/수신처·인증·세션 경계를 확인한다. 문서 링크/ID와 기존 상태의 보존을 점검하고 read-only verifier와 ai-review를 실행한다. 범위 내 결정을 막는 사항은 확인되지 않았다.

### 현재 계약 조사

| 구분 | 2026-11-23 확인 |
| --- | --- |
| 정책·소스 | [중앙 정책](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/notification/overview.md) `c9e50ff`, 백엔드 개발 `ab388b7`. [설정 UseCase](https://github.com/mate-pjt/mate-backend/blob/ab388b7cb06154a00e254eff7b124882952166ac/mate-api/src/main/java/kr/co/mate/mate_api/application/port/input/notificationsetting/NotificationSettingUseCase.kt#L3-L28)는 야간값 저장과 전달 시각을 구분한다. |
| 배포 기록 | [개발 CI #44429902651](https://github.com/mate-pjt/mate-backend/actions/runs/44429902651)의 verify/publish/deploy 성공 및 deploy-prod skipped. |
| 공개 명세 | [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs) 3.1.0/v1, 184 paths, SHA-256 `9e0b737fd92953b9f7a668aeecb61ce32b865bb3861999f9775fdfb523d21dd2`. 상세/야간 GET·PATCH와 PATCH `JsonNode`, 기존 두 이메일 설정 경로를 확인했다. |
| 실행·응답 | 실행 프로세스 SHA/digest 미확인. 업무 API 응답·메일 발송/인증·실제 알림 전달 미실행. 두 설정의 활성화는 [POL-19 별도 Gate](#dev-66-pol-19-boundary)를 따른다. |

<a id="dev-66-checkpoints"></a>

### 체크포인트

| 날짜 KST · 실행자 | 기준과 작업트리 | 결과와 다음 행동 |
| --- | --- | --- |
| 2026-11-23 · Codex | `main`·`origin/main` `98e3941a8f53741c5e50683db939cc3662c586a2`, clean, 로컬/원격 기존 DEV-66 브랜치 없음 | POL-29 `5f9d53d`, POL-19 `1a553da`, DEV-41 `0ff77e8`, DEV-62 `f9bf26c`, DEV-64 `98e3941`의 반영을 확인했다. `feat/dev-66-notification-settings`에서 위 설계 순서로 화면과 비활성 연결을 추가한다. |
| 2026-11-23 · Codex | 같은 브랜치·HEAD, DEV-66 화면·공개 capability·Toggle/Storybook·회귀 테스트와 착수 기록 변경 | 세 행과 비활성 사유를 연결했다. 다음 행동은 추적 파일로 만든 별도 실행 디렉터리에서 자동 검사와 Next mock/HTTP 대역 브라우저 검증을 실행하는 것이다. |
| 2026-11-23 · Codex | 같은 브랜치·HEAD, 첫 mock/HTTP 브라우저 검사 | HTTP 대역의 조회·저장·계정 경계와 두 비활성 항목의 요청 0건 확인. 첫 mock에서 인증 창을 열면 닫기 버튼이 초점을 받았다. 기준 `main`에서도 재현했고 Escape 복귀는 유지됐다. [인증 dialog](../../../../src/components/my/notification-email-verification-dialog.tsx)가 `showModal()` 직후 입력에 초점을 주도록 최소 교정한다. 자동 수정 1/3. 다음 행동은 초기·번호 입력 및 Escape와 전체 자동 검사를 다시 실행하는 것이다. |
| 2026-11-23 09:43 · Codex | 같은 브랜치·HEAD, DEV-66 범위의 개발·테스트·문서 변경 | 교정 뒤 자동 검사와 실 브라우저 mock/HTTP 대역, 공고별 등록 독립을 확인했다. 아래 근거로 문서 검사와 두 리뷰를 진행한다. |
| 2026-11-23 · Codex와 verifier | 같은 브랜치·HEAD, 1차 리뷰 이후 공유 화살표 변경 | 독립 검토 PASS에서 SVG 마스크 ID 중복 Minor 1건을 확인했다. [UpArrowIcon](../../../../src/components/icons/up-arrow-icon.tsx)에 인스턴스 ID를 적용했다. 설정 행의 마스크 6개와 참조 및 브라우저 시각을 확인한 뒤 전체 자동·브라우저 재검증, 문서·두 리뷰의 최종판을 Git에 전달한다. |

<a id="dev-66-verification"></a>

## 2026-11-23 · 검증과 Documentation Update Check

| 검증 | 결과 |
| --- | --- |
| `pnpm test` | PASS. Node 22.20.0/pnpm 11.3.0, 42파일·1,250건. 비활성 사유의 공개 타입/값, 기존 이메일·공고 구독·세션, API/mock/hybrid와 production guard 계약 포함. |
| `pnpm lint` | PASS. |
| `pnpm build` | PASS. Preview의 api·mock·hybrid 각각 빌드와 타입 검사, 정적 페이지 26개 생성. |
| `pnpm build-storybook` | PASS. 새 미지원과 기존 켜짐/꺼짐/일시 비활성 Story 포함. Vite의 번들 크기 안내가 있었다. |
| [로컬 브라우저](../../../qa/notification-settings.md#dev-66-local-qa) | D66-01~07 PASS. 실제 Next mock과 별도 loopback HTTP 대역. 상세·야간 요청/저장 0건, 접근성 트리·터치, 이메일과 공고별 설정 독립, 초점 및 계정 수명 확인. |
| 실서버 업무 API | 이번 신규 실행·통과 0건. QA-12 NSET-07 1차단과 QA-13 NREC 6차단을 보존한다. 별도 활성화에 필요한 계약과 효력·실행/QA 자원은 [POL-19](#dev-66-pol-19-boundary)를 따른다. |

- 로컬 API 대역·mock은 비밀값 없는 격리 디렉터리에서 실행했다. 최종 런타임·테스트 diff SHA-256은 `18226d7db30a29df261596c3944ef613b8daa65f093651da527a44a9317db208`이다(`git diff --binary 98e3941 -- src tests`). 인증 초점과 verifier의 마스크 ID 중복을 교정했다. 공고 팝업 보완 QA에서는 설정 버튼 전에 스위치를 선택하도록 조작 순서를 보정했다.
- `DESIGN.md`, 공통 `architecture.md`/`data-access.md`에 화면·공개 capability를 반영했다. `plan.md`, 이 기록과 WBS, 기존 설정 QA에 로컬 증거와 실제 QA 경계를 연결했다. `ai-failures.md`에 초기 초점과 Figma 도구 출력 사례를 기록했다. 패키지·스크립트·하네스 책임 변화가 없어 `base.md`와 `harness.md`의 갱신 사유는 없다. 원본 기준선/coverage의 범위·연결과 기존 QA 판정은 이 기록을 추가하면서 보존한다.

<a id="dev-66-close"></a>

## 2026-11-23 · 종료와 다음 작업 인계

- 승인된 세 설정 항목, 수신처와 08:30 맞춤 공고 이메일을 구현했다. 입찰공고 상세는 웹 연결 보류, 야간은 전달 시각 조정 미지원의 이유와 비활성 제어를 표시한다. mock과 로컬 HTTP 대역에서 두 항목의 요청·저장 0건을 확인했다. [증거](../../../qa/notification-settings.md#dev-66-local-qa)
- [검증과 Review Gate](../reviews/DEV-66.md)에 Context Audit과 AI 리뷰 여섯 섹션, 1차 verifier 결과를 기록했다. 화살표 교정과 종료·인계 문서 변경 뒤 최신 diff에서 두 리뷰와 문서 검사를 다시 적용해 전달한다. 실서버 설정·인증과 상세·야간 활성화는 [QA-12/13 및 별도 Gate](#dev-66-pol-19-boundary)의 범위다.
- 현재 작업의 판정과 다음 작업은 [WBS](../README.md)에서 확인한다. 상위 우선순위의 차단 및 선행을 반영한 결과 DOC-001을 충족한 [POL-23](POL-23.md#pol-23-dev-66-handoff)이 다음이다. 첫 행동은 L04의 최근·추천 검색어 프레임과 현재 입찰공고 검색 경로를 대조하고 정책에 필요한 공급원·보존/삭제 결정의 요구사항을 구조화하는 것이다. 사용자 요청은 이번 선정·인계까지다.

<a id="dev-66-delivery"></a>

### Git 전달 체크포인트

- 작업 브랜치는 `feat/dev-66-notification-settings`다. 화면과 데이터 연결, 접근성 교정, 테스트·Storybook, 문서·인계 기록을 목적별로 커밋한다. [작업 브랜치 PR](https://github.com/mate-pjt/mate-frontend/pulls?q=is%3Apr+head%3Afeat%2Fdev-66-notification-settings)에 최종 head·원격 CI·재검토 및 정상 병합 근거를 연결한다.
- 월간 한도 사유로 실패한 이번 PR의 Chromatic 검사에만 예외가 적용된다. 마지막 확인에서 다른 검사·리뷰·병합 조건과 로컬 `main` fast-forward를 확인한다. 현재 Git 전달 승인과 앞선 화면/정책 승인 날짜는 [Brief](#dev-66-brief)에 기록했다.

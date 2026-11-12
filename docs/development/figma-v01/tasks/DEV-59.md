# DEV-59 · 회사 가입 mock의 평가·인증 근거 계약 정합성

[상태의 단일 기준: WBS](../README.md) · [운영 규칙](../workflow.md) · [감사 근거](../audits/2026-11-11.md#cf-05)

## 작업 정의

- 유형: 개발. 원본 항목: O06, O07, O08; 2026-11-11 전수 감사 CF-05.
- 선행 작업: [QA-17](QA-17.md). 순위는 WBS가 관리한다.
- 목적: 서버는 대표면허/인증을 YES/NO/UNKNOWN으로 구분하고 확인하지 못한 평가연도는 null로 보존한다. 출처/스냅샷과 인증 종류별 상태가 구별된다.
- 현재 차이/영향: mock은 현재 연도를 평가연도로 생성하고 대표면허 ACTIVE 및 빈 certifications를 반환한다. 프론트 validator는 임의 문자열을 허용한다. 실제 가입 화면은 해당 값을 정보 없음으로 보일 수 있어 fixture가 정상/미확인을 검증하지 못한다.
- 제외: 아래 소유 경계 밖의 기능·새 라이브러리·무관한 리팩터링. 이번 감사에서는 제품 수정/실제 업무 API 변경/commit·push·PR·배포를 수행하지 않았다. 미래 구현의 실행 범위는 착수 Gate에서 확인한다.
- 책임/재개 조건: 실행자는 다음 선정 시 확정한다. 프론트 구현·디자인 결정·필요한 API/QA 자원 역할을 나누고, 미확인 개인 담당자를 임의 배정하지 않는다. 선행 Task 결과와 현재 디자인/정책/source/배포를 다시 대조한다.

## 기준과 소유권

- 고정 출발점: frontend `8d3a2ec290aabc4280c5e9f5336cfd36376f7e94`; 현재 backend dev/정책과 관찰 수준은 [날짜별 감사](../audits/2026-11-11.md#cf-05) 및 [JSON](../audits/2026-11-11.json). 근거 파일은 수정 허용 목록이 아니다.
- 소유 소스: [src/data/company/mock-repository.ts](../../../../src/data/company/mock-repository.ts) / [src/data/company/contracts.ts](../../../../src/data/company/contracts.ts) / [src/components/auth/company-registration.tsx](../../../../src/components/auth/company-registration.tsx).
- 관련 Task: [QA-06](QA-06.md) / [QA-07](QA-07.md) / [POL-06](POL-06.md). 기존 QA의 case/통과/차단/승인 예외를 보존한다.
- Figma: [Figma 3140:123224](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3140-123224).
- 고정 정책: [domain/company/overview-and-profile.md](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/company/overview-and-profile.md) / [domain/company/registration-and-verification.md](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/company/registration-and-verification.md).

## 착수 전 Implementation Brief / 설계 Gate

- 후보 요구사항/성공 기준: 아래 완료 기준. **아직 구현 미착수**다. UI 승인/실제 계약과 fixture 준비를 확인해 최종 Brief를 제시한다.
- in/out scope·현행 패턴: 위 목적/제외와 관련 Task의 소유 경계를 확인한다. 데이터/DTO/mock 설계 전 [data-access](../../../ai-context/data-access.md)를 읽는다.
- 편집 전 제시: 실제 수정 대상 파일·영향·단계·위험·검증 명령/시나리오·실행 식별자·필요한 데이터 사용/변경·잔존·복구 범위.
- blocking ambiguity는 최대3질문/추천안으로 해소한다. 감사의 추천을 정책 승인으로 취급하지 않고, 낮은 위험 가정만 명시해 진행한다.

## 완료 기준

- [ ] 고정 backend 응답/정책과 DTO·validator·mock 생성값을 대조해 YES/NO/UNKNOWN·연도 null·인증3종·출처/스냅샷을 보존한다.
- [ ] 평가연도를 알 수 없으면 현재 연도를 합성하지 않으며 금액 있음/연도 없음과 인증별 YES/NO/UNKNOWN 혼합 사례를 별도로 검증한다.
- [ ] 저장 mock schema/version 변경 시 기존 탭 상태 복구와 계정 격리를 검증한다. 실제 문서 업로드/번호 등록 QA는 기존 차단을 유지한다.
- [ ] 정상·빈·오류·권한/충돌과 접근성 중 영향 범위를 Gate에서 확정하고 자동/실제 Next 브라우저 검증 및 필요한 실제 QA를 기록한다. 미실행은 차단/이유로 남긴다.
- [ ] 현재 package scripts에 맞는 test/lint/build·필요한 Storybook/구성 검사와 diff-check를 통과한다. mock/HTTP 대역/실제 API 결과를 구분한다.
- [ ] Documentation Update Check, verifier/ai-review와 검토 뒤 변경의 freshness를 기록한다. 구현만으로 완료하지 않는다.

## 체크포인트 · 결정·인계

| 날짜 | 수행/근거 | 다음 첫 행동 |
| --- | --- | --- |
| 2026-11-11 | QA-17 감사에서 후보 정의·소유권/완료 기준만 추가. 정책 신규 승인·제품 수정·실제 업무 API 실행 없음 | 선행 결과와 감사 CF-05를 읽고 현재 source/계약·검증 자원으로 Brief를 확정 |

- 추천/후보는 승인 아님. 개발자/디자인/서버 결정이 필요한 내용은 결정자·날짜·원문/소유 소스·유지/보류 이유를 기록한다.
- 이 Task의 구현/자동·브라우저/실제 QA·Review Gate는 **미실행/미판정**이다. 감사 문서 검토를 구현 검증으로 대신하지 않는다.
- 자동 수정 시도0/3. 실패 시 원인·최소 수정·재검증을 순서대로 기록한다.
- 문서 갱신 여부와 프로세스/데이터 복구, 미커밋/Git 전달 범위는 실행 시 기록한다. 상태/다음 작업은 WBS에서만 갱신한다.

<a id="dev-59-dev-61-handoff"></a>

## 2026-11-12 · DEV-61 이후 선정/인계

- 이 단락은 다음 작업의 후보 선정/인계다. DEV-59의 요구사항 Gate·현재 source/서버 상세 조사·구현·검증·Git 전달은 시작하지 않았다. 현재/다음/상태는 WBS만 관리한다.
- 선정 근거: 남은 P0 QA/약관/취합·이전 P1 정책/신원·문구/실제 자원 차단은 유지된다. QA-17이 main에 반영돼 선행이 해소된 P1 DEV-59/60/62 중 WBS 기본 순서가 앞선 DEV-59를 택했다. 영구 우선순위 변경이나 기존 실제 QA/정책 차단 해소를 뜻하지 않는다.
- 다음 첫 행동: 새 대화에서 이 기록·감사 CF-05·data-access와 최신 main/현재 소유 계약·정책을 선별 대조한다. YES/NO/UNKNOWN·평가연도null·인증3종/출처·snapshot과 mock/validator·저장 복구의 수정 대상/범위/검증을 Brief로 제시한다. 과거 감사·기존 구현을 현재 계약/승인이나 실제 통합 PASS로 대신하지 않는다.
- 실행/검증 자원·필요한 정책/API 공백은 DEV-59의 새 Gate에서 확인한다. 이번 DEV-61 Git/추가 교정·Chromatic 한도 승인은 DEV-59의 구현/실제 업무/API·Git 전달 승인으로 확대하지 않는다. 기존 QA-06/07·POL-06과 Task별 예외를 보존한다.

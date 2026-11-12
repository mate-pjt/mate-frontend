# DEV-60 · 회사 기본 정보의 복수 주력업종 보존·표시

[상태의 단일 기준: WBS](../README.md) · [운영 규칙](../workflow.md) · [감사 근거](../audits/2026-11-11.md#cf-06)

## 작업 정의

- 유형: 개발. 원본 항목: M03; 2026-11-11 전수 감사 CF-06.
- 선행 작업: [QA-17](QA-17.md). 순위는 WBS가 관리한다.
- 목적: 회사 정책은 자동 수집/사용자 선택 업종을 같은 수준의 중복 없는 주력업종 목록으로 표시한다. 서버 기본 프로필은 primaryIndustries 목록을 제공한다.
- 현재 차이/영향: 프론트 CompanyBasicProfile은 단일 primaryIndustry만 모델링하고 /my/company는 그 이름 하나만 출력한다. 여러 업종의 실제 값이 있어도 모두 보여 줄 수 없는 구조다. 실계정 다중 업종 응답 재현은 미실행이다.
- 제외: 아래 소유 경계 밖의 기능·새 라이브러리·무관한 리팩터링. 이번 감사에서는 제품 수정/실제 업무 API 변경/commit·push·PR·배포를 수행하지 않았다. 미래 구현의 실행 범위는 착수 Gate에서 확인한다.
- 책임/재개 조건: 실행자는 다음 선정 시 확정한다. 프론트 구현·디자인 결정·필요한 API/QA 자원 역할을 나누고, 미확인 개인 담당자를 임의 배정하지 않는다. 선행 Task 결과와 현재 디자인/정책/source/배포를 다시 대조한다.

## 기준과 소유권

- 고정 출발점: frontend `8d3a2ec290aabc4280c5e9f5336cfd36376f7e94`; 현재 backend dev/정책과 관찰 수준은 [날짜별 감사](../audits/2026-11-11.md#cf-06) 및 [JSON](../audits/2026-11-11.json). 근거 파일은 수정 허용 목록이 아니다.
- 소유 소스: [src/data/company/contracts.ts](../../../../src/data/company/contracts.ts) / [src/data/company/http-repository.ts](../../../../src/data/company/http-repository.ts) / [src/components/my/my-company-client.tsx](../../../../src/components/my/my-company-client.tsx).
- 관련 Task: [DEV-08](DEV-08.md) / [POL-06](POL-06.md) / [QA-05](QA-05.md). 기존 QA의 case/통과/차단/승인 예외를 보존한다.
- Figma: [Figma 3137:52277](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3137-52277).
- 고정 정책: [domain/company/overview-and-profile.md](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/company/overview-and-profile.md).

## 착수 전 Implementation Brief / 설계 Gate

- 후보 요구사항/성공 기준: 아래 완료 기준. **아직 구현 미착수**다. UI 승인/실제 계약과 fixture 준비를 확인해 최종 Brief를 제시한다.
- in/out scope·현행 패턴: 위 목적/제외와 관련 Task의 소유 경계를 확인한다. 데이터/DTO/mock 설계 전 [data-access](../../../ai-context/data-access.md)를 읽는다.
- 편집 전 제시: 실제 수정 대상 파일·영향·단계·위험·검증 명령/시나리오·실행 식별자·필요한 데이터 사용/변경·잔존·복구 범위.
- blocking ambiguity는 최대3질문/추천안으로 해소한다. 감사의 추천을 정책 승인으로 취급하지 않고, 낮은 위험 가정만 명시해 진행한다.

## 완료 기준

- [ ] 배포 primaryIndustries/legacy primaryIndustry의 우선순위·빈/null 계약을 확인하고 목록을 끝까지 보존한다. 대표·부업종을 새로 만들지 않는다.
- [ ] 0/1/복수·중복·legacy-only·결측/잘못된 응답에서 정보 손실/임의값 없이 표시하고 모바일 긴 이름을 검증한다.
- [ ] 이 작업은 이미 있는 기본 정보만 소유한다. 대시보드의 시공능력/인증/희망금액/권한 leaf는 DEV-08에 남긴다.
- [ ] 정상·빈·오류·권한/충돌과 접근성 중 영향 범위를 Gate에서 확정하고 자동/실제 Next 브라우저 검증 및 필요한 실제 QA를 기록한다. 미실행은 차단/이유로 남긴다.
- [ ] 현재 package scripts에 맞는 test/lint/build·필요한 Storybook/구성 검사와 diff-check를 통과한다. mock/HTTP 대역/실제 API 결과를 구분한다.
- [ ] Documentation Update Check, verifier/ai-review와 검토 뒤 변경의 freshness를 기록한다. 구현만으로 완료하지 않는다.

## 체크포인트 · 결정·인계

| 날짜 | 수행/근거 | 다음 첫 행동 |
| --- | --- | --- |
| 2026-11-11 | QA-17 감사에서 후보 정의·소유권/완료 기준만 추가. 정책 신규 승인·제품 수정·실제 업무 API 실행 없음 | 선행 결과와 감사 CF-06를 읽고 현재 source/계약·검증 자원으로 Brief를 확정 |

- 추천/후보는 승인 아님. 개발자/디자인/서버 결정이 필요한 내용은 결정자·날짜·원문/소유 소스·유지/보류 이유를 기록한다.
- 이 Task의 구현/자동·브라우저/실제 QA·Review Gate는 **미실행/미판정**이다. 감사 문서 검토를 구현 검증으로 대신하지 않는다.
- 자동 수정 시도0/3. 실패 시 원인·최소 수정·재검증을 순서대로 기록한다.
- 문서 갱신 여부와 프로세스/데이터 복구, 미커밋/Git 전달 범위는 실행 시 기록한다. 상태/다음 작업은 WBS에서만 갱신한다.

<a id="dev-60-dev-59-handoff"></a>

## 2026-11-12 · DEV-59 이후 선정/인계

- 이번에는 Task 후보 정의/선행만 읽고 다음 작업으로 선정했다. DEV-60의 현행 source/API 상세 조사·요구사항 Gate/Brief·설계·구현·검증·Git 전달은 시작하지 않았다. 현재/다음/상태는 WBS만 관리한다.
- 선정 이유: 남은 P0 실제 QA/약관·취합과 앞선 P1 정책/신원/문구·실제 자원 차단을 유지한다. QA-17이 main에 있고 남은 독립 P1 DEV-60/62 중 기본 표 순서가 앞선 DEV-60을 선정했다. DEV-08 선행이라는 연결은 있으나 DEV-08 대시보드/권한 leaf나 QA-05/06/07 실제 통합을 이번에 시작하거나 면제하지 않는다.
- 다음 첫 행동: 새 대화에서 최신 main/Git·DEV-60/CF-06·POL-06·data-access와 현행 기본 프로필/배포 계약을 선별 대조한다. primaryIndustries/legacy primaryIndustry 우선순위·빈/null·중복과0/1/복수·legacy-only·잘못된 응답/긴 이름 모바일을 Brief/검증 범위로 제시한다. 가입 프로필만 교정한 DEV-59를 나의 회사 복수 업종 구현/실제 통합 PASS로 세지 않는다.
- 실행/검증 자원과 남은 정책/API 공백은 DEV-60 자신의 Gate에서 확인한다. 이번 DEV-59 Git/Chromatic 한도 승인을 DEV-60 실행/실제 업무 API·Git 전달 승인으로 확대하지 않으며 기존 QA-05·POL-06/DEV-08 차단과 Task별 예외를 보존한다.

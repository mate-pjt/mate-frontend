# DEV-61 · 관련 공고 mock의 동일 업종·품목 정책 정합성

[상태의 단일 기준: WBS](../README.md) · [운영 규칙](../workflow.md) · [감사 근거](../audits/2026-11-11.md#cf-07)

## 작업 정의

- 유형: 개발. 원본 항목: D09; 2026-11-11 전수 감사 CF-07.
- 선행 작업: [POL-30](POL-30.md). 순위는 WBS가 관리한다.
- 목적: 같은 업무 유형에서 업종/공식 품목 식별자가 정확히 겹치는 진행 중 후보를 최근순으로 제공한다. 기준 공고 자체의 마감/취소 허용 여부는 중앙 문서의 충돌 CF-23을 해소한 뒤 적용한다.
- 현재 차이/영향: mock은 현재 ID를 제외한 첫 3개를 반환한다. 공사10001에서 용역10002·물품10003·마감 공사10004가 노출됐다. 타깃 분류도 항상1, 카드 사업금액은 기초금액을 재사용한다.
- 제외: 아래 소유 경계 밖의 기능·새 라이브러리·무관한 리팩터링. 이번 감사에서는 제품 수정/실제 업무 API 변경/commit·push·PR·배포를 수행하지 않았다. 미래 구현의 실행 범위는 착수 Gate에서 확인한다.
- 책임/재개 조건: 실행자는 다음 선정 시 확정한다. 프론트 구현·디자인 결정·필요한 API/QA 자원 역할을 나누고, 미확인 개인 담당자를 임의 배정하지 않는다. 선행 Task 결과와 현재 디자인/정책/source/배포를 다시 대조한다.

## 기준과 소유권

- 고정 출발점: frontend `8d3a2ec290aabc4280c5e9f5336cfd36376f7e94`; 현재 backend dev/정책과 관찰 수준은 [날짜별 감사](../audits/2026-11-11.md#cf-07) 및 [JSON](../audits/2026-11-11.json). 근거 파일은 수정 허용 목록이 아니다.
- 소유 소스: [src/data/bids/mock-repository.ts](../../../../src/data/bids/mock-repository.ts).
- 관련 Task: [POL-30](POL-30.md) / [QA-03](QA-03.md). 기존 QA의 case/통과/차단/승인 예외를 보존한다.
- Figma: [Figma 2113:19107](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2113-19107).
- 고정 정책: [domain/bid/matching-and-related-notices.md](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/bid/matching-and-related-notices.md) / [domain/bid/amounts-and-results.md](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/bid/amounts-and-results.md).

## 착수 전 Implementation Brief / 설계 Gate

- 후보 요구사항/성공 기준: 아래 완료 기준. **아직 구현 미착수**다. UI 승인/실제 계약과 fixture 준비를 확인해 최종 Brief를 제시한다.
- in/out scope·현행 패턴: 위 목적/제외와 관련 Task의 소유 경계를 확인한다. 데이터/DTO/mock 설계 전 [data-access](../../../ai-context/data-access.md)를 읽는다.
- 편집 전 제시: 실제 수정 대상 파일·영향·단계·위험·검증 명령/시나리오·실행 식별자·필요한 데이터 사용/변경·잔존·복구 범위.
- blocking ambiguity는 최대3질문/추천안으로 해소한다. 감사의 추천을 정책 승인으로 취급하지 않고, 낮은 위험 가정만 명시해 진행한다.

## 완료 기준

- [ ] POL-30이 확정한 기준 공고 상태와 동일 유형·정확한 업종/품목 ID·진행 중 후보·최신순·최대3개·자기 제외를 지원하는 합성 fixture와 선택 로직을 만든다.
- [ ] 선택 분류/target 분류 identity와 정책의 사업금액/VAT·결측을 검증하며 빈 결과를 엉뚱한 공고로 채우지 않는다.
- [ ] 서로 다른 유형·유사 이름/다른 코드·마감/취소·분류 불일치의 음성 사례를 검증한다. QA-03의 과거 실제 관련 공고 통과 이력을 취소하거나 mock PASS로 대체하지 않는다.
- [ ] 정상·빈·오류·권한/충돌과 접근성 중 영향 범위를 Gate에서 확정하고 자동/실제 Next 브라우저 검증 및 필요한 실제 QA를 기록한다. 미실행은 차단/이유로 남긴다.
- [ ] 현재 package scripts에 맞는 test/lint/build·필요한 Storybook/구성 검사와 diff-check를 통과한다. mock/HTTP 대역/실제 API 결과를 구분한다.
- [ ] Documentation Update Check, verifier/ai-review와 검토 뒤 변경의 freshness를 기록한다. 구현만으로 완료하지 않는다.

## 체크포인트 · 결정·인계

| 날짜 | 수행/근거 | 다음 첫 행동 |
| --- | --- | --- |
| 2026-11-11 | QA-17 감사에서 후보 정의·소유권/완료 기준만 추가. 정책 신규 승인·제품 수정·실제 업무 API 실행 없음 | 선행 결과와 감사 CF-07를 읽고 현재 source/계약·검증 자원으로 Brief를 확정 |

- 추천/후보는 승인 아님. 개발자/디자인/서버 결정이 필요한 내용은 결정자·날짜·원문/소유 소스·유지/보류 이유를 기록한다.
- 이 Task의 구현/자동·브라우저/실제 QA·Review Gate는 **미실행/미판정**이다. 감사 문서 검토를 구현 검증으로 대신하지 않는다.
- 자동 수정 시도0/3. 실패 시 원인·최소 수정·재검증을 순서대로 기록한다.
- 문서 갱신 여부와 프로세스/데이터 복구, 미커밋/Git 전달 범위는 실행 시 기록한다. 상태/다음 작업은 WBS에서만 갱신한다.

<a id="dev-61-pol-30-handoff"></a>

## 2026-11-12 · POL-30 정책 인계

- 사용자가 [POL-30 정책 v1](POL-30.md#pol-30-contract)을 확정했다. 공개·미삭제인 기준 공고는 마감/취소돼도 공식 업종·품목으로 진행 중 후보를 조회한다. 미공개/삭제/미존재·없는 선택 분류404와 비교 사실/후보 부재의 정상 빈 목록을 구분한다. 위2026-11-11의 ‘충돌 해소 뒤 적용’ 조건은 이 결정/소유 경로를 읽어 이어간다.
- 후보는 같은 업무 유형·정확 코드·공개·미삭제·미취소이며 마감시각 없음 또는 조회시각보다 이후여야 한다. 마감 정각은 제외한다. source 선택/전체 분류와 target 실제 일치 분류·업종 target null, 최신순/null 마지막/동시각 ID 내림차순·자기 제외/중복 제거·상세 최대3개·추정가격+VAT/결측 기준을 유지한다.
- [고정 Clock/음성 사례 REL-01~13](POL-30.md#pol-30-fixtures)을 다음 Brief의 수용 기준으로 사용한다. `T=2026-11-12T10:00:00+09:00`과 후보 시각을 고정한 뒤 Clock만 이동하는 경계, 코드 우선순위, 다른 유형/같은 이름·다른 코드, 분류2/10·null, 빈/독립 오류·금액 결측을 포함한다. 이번에 fixture/로직/테스트를 만들거나 실행하지 않았다.
- 중앙 원문 §6/§10/§11 [정정안](POL-30.md#pol-30-central-proposal)은 이 저장소에만 있고 mate-docs 반영은 미실행이다. 로컬 사용자 확정 정책 v1을 DEV-61 적용 기준으로 사용하되 중앙 반영/백엔드 실행 SHA/실응답을 확인했다고 주장하지 않는다. 정책 결정자/날짜와 현재 소스·문서 관측은 POL-30을 따른다.
- 실제 QA-03/DETAIL-07의2026-11-02 통과와 다른8차단·원래 승인 예외는 보존한다. mock 교정·실제 Next/HTTP 대역·실제 API 결과를 분리한다. 실제 API 경계 검증은 [기존 상세 QA의 재개 조건](../../../qa/bid-detail.md#pol-30-followup)을 확인한다.
- 다음 첫 행동 후보: 새 대화에서 POL-30 v1/REL-01~13·이 Task/CF-07 및 최신 main을 읽고 data-access와 현재 bids mock/contracts/tests·시나리오를 선별 대조해 수정 파일/Clock·fixture/검증 범위의 Implementation Brief를 제시한다. 중앙/제품 수정·실제 API·DEV-61 Git 전달은 이 정책 인계에서 실행하지 않는다. 현재/다음/상태는 WBS만 소유한다.

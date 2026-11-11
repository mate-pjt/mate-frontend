# POL-30 · 관련 공고의 기준 공고 상태 정책 충돌 해소

[상태의 단일 기준: WBS](../README.md) · [운영 규칙](../workflow.md) · [감사 CF-23](../audits/2026-11-11.md#cf-23)

## 작업 정의

- 유형: 정책 결정. 원본: D09. 선행: [QA-17](QA-17.md)의 고정 정책/백엔드 대조.
- 목적: 관련 공고를 조회하는 **기준 공고의 마감/취소**와 결과로 추천하는 **후보 공고의 마감/취소**에 서로 다른 규칙이 필요한지 소유 원문과 현재 계약으로 확정한다.
- 현재 충돌: 중앙 matching-and-related-notices.md §6은 취소/마감 기준 공고에서 관련 공고를 반환하지 않는다고 하고, §10의 과거 공고 단락은 마감/취소 기준 공고도 비교 자료로 쓸 수 있다고 한다. 같은 고정 문서 안의 충돌이다.
- 백엔드 dev의 RelatedBidNoticeQueryService는 공개/삭제·분류 identity를 확인하고 기준 공고 마감/취소로 조기 반환하지 않는다. 후보의 진행 상태는 별도 조회에 적용한다. 이는 현재 소스 관찰이며 실제 실행/제품 결정 승인이 아니다.
- 추천: 현재 소스와 §10처럼 과거 기준 공고/진행 후보의 규칙을 분리하되 정책 소유자의 확인과 명시적 원문 정리를 남긴다. 추천을 승인으로 간주하지 않는다.
- 제외: 제품/중앙 저장소 무단 수정, 실제 업무 API 변경·외부 메시지·commit/push/PR/배포. 관련 공고 mock 수정은 [DEV-61](DEV-61.md)이 소유한다.

## 근거와 착수 Gate

- [중앙 정책 고정본](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/bid/matching-and-related-notices.md) §6·§10·§11을 함께 읽는다.
- [Backend service](https://github.com/mate-pjt/mate-backend/blob/1f3b8544dee49fa3936b3229114a58cd9eb7432c/mate-api/src/main/java/kr/co/mate/mate_api/application/service/bid/relatednotice/RelatedBidNoticeQueryService.kt)와 [일치 기준 policy](https://github.com/mate-pjt/mate-backend/blob/1f3b8544dee49fa3936b3229114a58cd9eb7432c/mate-api/src/main/java/kr/co/mate/mate_api/application/service/bid/relatednotice/RelatedBidNoticeRelationPolicy.kt).
- 착수 시 현재 원문/source의 drift를 재확인하고 요구사항·수정 문서·영향·단계·검증을 편집 전에 제시한다. 원문만으로 해결되지 않는 blocking ambiguity는 최대3질문/추천안으로 소유자 결정을 확보한다.
- 실행자와 정책/서버 책임 역할은 착수 시 특정한다. 개인 담당자는 미확인이다. source의 구현을 정책 승인으로 자동 승격하지 않는다.

## 완료 기준

- [ ] 기준 공고의 공개/삭제/취소/마감/없는 분류와 후보의 같은 상태를 별도 표로 확정한다. 잘못된 대상의404와 비교 근거 없는 빈 목록도 구분한다.
- [ ] §6·§10 충돌의 소유 근거·결정자·날짜·유지/정정/보류 이유와 원문 정리 경로를 기록한다. 외부 문서 편집이 필요하면 구체적 산출물과 권한 범위를 따로 확인한다.
- [ ] DEV-61의 fixed Clock fixture와 음성 사례를 확정하고 source/target 분류·정확 코드·추정가격+VAT·최신순/자기 제외 규칙과 충돌하지 않게 한다.
- [ ] 현재 배포 문서/업무 응답·실행 SHA 대응과 실제 QA-03의 잔여 조건을 구분하며 과거 실제 통과 이력/예외를 보존한다.
- [ ] WBS/coverage/Task·문서 링크/의존성·diff-check, Documentation Update Check 및 verifier/ai-review를 완료한다. 실제 구현/통합 PASS와 분리한다.

## 체크포인트 · 결정·검증 기록

| 날짜 | 수행/결과 | 다음 첫 행동 |
| --- | --- | --- |
| 2026-11-11 | QA-17에서 같은 정책 문서의 충돌을 확인하고 backend dev 소스까지 대조. 후보 정의만 작성, 정책 선택/제품 수정/실제 API 미실행 | 현재 원문과 service를 재확인해 위 상태표의 미결만 구조화 |

- 위 추천 미승인. 상태는 WBS만 소유한다. 구현/실제 QA/이 정책 Task의 Review Gate는 미실행이다.


## 2026-11-12 · DEV-55 종료의 다음 Gate 인계

- 선정 이유: 남은 P0의 실제 QA·약관/취합 차단을 보존한다. WBS P1이며 선행 QA-17이 main에 있고 DEV-61의 정책 선행을 정리해야 하므로 다음 Gate 하나로 선정했다. 정책 선택 승인이나 타 P1의 영구 우선순위 변경은 아니다.
- 다음 첫 행동: 새 대화에서 이 기록·감사 CF-23의 고정 이력과 최신 중앙 정책의 §6/§10/§11, backend dev의 RelatedBidNoticeQueryService/RelationPolicy 및 개발 Swagger를 대조한다. 기준 공고와 후보 공고의 공개/삭제/마감/취소/분류 상태를 나누고, 미결만 최대3질문·추천안으로 묶은 Brief/문서 수정·검증 계획을 먼저 제시한다. 현재 source/배포 문서/실행 SHA/실제 응답을 각각 기록하며 중앙 원문 수정 권한을 추정하지 않는다.
- 이번에는 선정·인계 문구만 추가했다. 상세 source/계약 조사·정책 선택·중앙 원문/제품 수정·실제 QA·이 Task의 Git 전달을 시작하지 않았다. 기존 QA-03/타 Task의 차단/승인 예외를 유지하며 현재/다음/상태는 WBS만 소유한다.

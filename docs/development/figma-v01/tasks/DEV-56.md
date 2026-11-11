# DEV-56 · 공통 헤더의 식별·상태 UI 정합성

[상태의 단일 기준: WBS](../README.md) · [운영 규칙](../workflow.md) · [감사 근거](../audits/2026-11-11.md#cf-02)

## 작업 정의

- 유형: 개발. 원본 항목: C01, S01, O01; 2026-11-11 전수 감사 CF-02.
- 선행 작업: [POL-29](POL-29.md). 순위는 WBS가 관리한다.
- 목적: Figma의 로그인 후 회사/프로필 식별 영역과 브랜드/메뉴 배치를 현재 계정 계약과 함께 정의해야 한다.
- 현재 차이/영향: 현재는 마이페이지 텍스트와 별도 로그아웃 버튼이다. 브랜드 텍스트 색도 다르다. 인증 응답은 id/email만 있어 Figma의 사용자 이름을 바로 채울 수 없다. 메이트 소식 미구현은 기존 POL-27/DEV-51 범위다.
- 제외: 아래 소유 경계 밖의 기능·새 라이브러리·무관한 리팩터링. 이번 감사에서는 제품 수정/실제 업무 API 변경/commit·push·PR·배포를 수행하지 않았다. 미래 구현의 실행 범위는 착수 Gate에서 확인한다.
- 책임/재개 조건: 실행자는 다음 선정 시 확정한다. 프론트 구현·디자인 결정·필요한 API/QA 자원 역할을 나누고, 미확인 개인 담당자를 임의 배정하지 않는다. 선행 Task 결과와 현재 디자인/정책/source/배포를 다시 대조한다.

## 기준과 소유권

- 고정 출발점: frontend `8d3a2ec290aabc4280c5e9f5336cfd36376f7e94`; 현재 backend dev/정책과 관찰 수준은 [날짜별 감사](../audits/2026-11-11.md#cf-02) 및 [JSON](../audits/2026-11-11.json). 근거 파일은 수정 허용 목록이 아니다.
- 소유 소스: [src/components/site-header.tsx](../../../../src/components/site-header.tsx) / [src/data/auth/contracts.ts](../../../../src/data/auth/contracts.ts).
- 관련 Task: [POL-29](POL-29.md) / [DEV-51](DEV-51.md) / [QA-14](QA-14.md). 기존 QA의 case/통과/차단/승인 예외를 보존한다.
- Figma: [Figma 2048:58606](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=2048-58606) / [Figma 3139:52490](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3139-52490).
- 고정 정책: [domain/auth/account-and-social-identity.md](https://github.com/mate-pjt/mate-docs/blob/c9e50ff591ae18023164e1a94581c611bf1e4f29/docs/domain/auth/account-and-social-identity.md).

## 착수 전 Implementation Brief / 설계 Gate

- 후보 요구사항/성공 기준: 아래 완료 기준. **아직 구현 미착수**다. UI 승인/실제 계약과 fixture 준비를 확인해 최종 Brief를 제시한다.
- in/out scope·현행 패턴: 위 목적/제외와 관련 Task의 소유 경계를 확인한다. 데이터/DTO/mock 설계 전 [data-access](../../../ai-context/data-access.md)를 읽는다.
- 편집 전 제시: 실제 수정 대상 파일·영향·단계·위험·검증 명령/시나리오·실행 식별자·필요한 데이터 사용/변경·잔존·복구 범위.
- blocking ambiguity는 최대3질문/추천안으로 해소한다. 감사의 추천을 정책 승인으로 취급하지 않고, 낮은 위험 가정만 명시해 진행한다.

## 완료 기준

- [ ] POL-29에서 이름/회사 없음·미연결·로딩·오류의 표시와 사용 가능한 데이터 출처를 정한다. 임의 사용자/회사명이나 새 API를 만들지 않는다.
- [ ] 비로그인/로그인/회사 미연결/연결 상태, 알림 점·현재 메뉴·로그아웃 busy/오류를 데스크톱과 모바일에서 검증한다.
- [ ] 메이트 소식 구현은 DEV-51로 남기고 헤더 수정을 이유로 미완료 메뉴를 동작하는 것처럼 노출하지 않는다.
- [ ] 정상·빈·오류·권한/충돌과 접근성 중 영향 범위를 Gate에서 확정하고 자동/실제 Next 브라우저 검증 및 필요한 실제 QA를 기록한다. 미실행은 차단/이유로 남긴다.
- [ ] 현재 package scripts에 맞는 test/lint/build·필요한 Storybook/구성 검사와 diff-check를 통과한다. mock/HTTP 대역/실제 API 결과를 구분한다.
- [ ] Documentation Update Check, verifier/ai-review와 검토 뒤 변경의 freshness를 기록한다. 구현만으로 완료하지 않는다.

## 체크포인트 · 결정·인계

| 날짜 | 수행/근거 | 다음 첫 행동 |
| --- | --- | --- |
| 2026-11-11 | QA-17 감사에서 후보 정의·소유권/완료 기준만 추가. 정책 신규 승인·제품 수정·실제 업무 API 실행 없음 | 선행 결과와 감사 CF-02를 읽고 현재 source/계약·검증 자원으로 Brief를 확정 |

- 추천/후보는 승인 아님. 개발자/디자인/서버 결정이 필요한 내용은 결정자·날짜·원문/소유 소스·유지/보류 이유를 기록한다.
- 이 Task의 구현/자동·브라우저/실제 QA·Review Gate는 **미실행/미판정**이다. 감사 문서 검토를 구현 검증으로 대신하지 않는다.
- 자동 수정 시도0/3. 실패 시 원인·최소 수정·재검증을 순서대로 기록한다.
- 문서 갱신 여부와 프로세스/데이터 복구, 미커밋/Git 전달 범위는 실행 시 기록한다. 상태/다음 작업은 WBS에서만 갱신한다.

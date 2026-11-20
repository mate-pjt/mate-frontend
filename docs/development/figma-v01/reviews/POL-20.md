# POL-20 문서 검증 및 리뷰

2026-11-20 KST · 기준 `6eb78d052108be16d6a16b65986080f0f307a9c8` · `docs/pol-20-alarm-deletion-policy`

[착수와 사용자 승인](../tasks/POL-20.md#pol-20-brief) · [소유 근거](../tasks/POL-20.md#pol-20-evidence) · [정책](../tasks/POL-20.md#pol-20-contract) · [후속 QA](../../../qa/alarms.md#pol-20-alarm-deletion-qa)

## Context Audit Report

### 결론

착수 시 WARN. QA 안내의 과거 삭제 API 부재·읽음 뒤 제자리 설명과 현행 소스/게시 명세를 함께 읽을 수 있게 날짜와 현재 근거를 표시했다. DESIGN의 삭제 준비 중 사유와 후속 정책 링크를 동기화했다.

### 확인한 코드베이스 사실

Next 16.2.9·React 19.2.4·Vitest 4.1.11, pnpm 11.3.0·lockfile 9.0과 작업 셸의 Node 26.5.0을 확인했다. 저장소와 CI의 Node pin은 22.20.0이며 로컬에서 해당 버전의 실행도 확인했다.

### 문서별 정합성 점검

#### base.md

8개 스크립트, package manager, Node pin이 실제 package·lockfile·CI에 대응한다. 독립 `type-check`와 `format` 스크립트는 없다.

#### architecture.md

`/alarms`의 공개 Repository와 20건 페이지, 읽음·이동, 헤더 미확인 점과 준비 중 편집이 현재 소스에 대응한다. 기존 UI 구조와 Sonner 사용은 후속 화면의 참고 패턴이다.

#### data-access.md

7개 공급원, 공개 client, DTO·업로드 핸들, 빌드 snapshot과 운영 mock guard 및 탭별 저장소 경계를 대조했다. 받은 알림의 기존 계약과 후속 수동 삭제 정책을 연결했다. 기존 Swagger wrapper 표기와 소스의 `isSuccess` 차이는 계약 근거에 명시했다.

#### plan.md

WBS에서 현행 작업과 다음 작업을 관리한다. 79개 원본과 N02 연결, 114개 Task 및 156개 선행 관계를 보존한다. POL-20의 날짜별 판단을 추가하고 DEV-43과 미실행 QA에 연결했다.

#### harness.md

세 skill·verifier·설정 placeholder와 문서 검증/Review Gate 순서가 현행 하네스에 대응한다.

#### ai-failures.md

이전 DEV-33의 연결 단절 재전송 관찰을 실제 도착 수를 검증하는 근거로 사용했다. 로컬 과거 커밋 조회에 작성자 필드가 표시된 재발을 기록하고, 이후에는 SHA·제목·파일 경로를 명시적으로 출력한다.

### 발견된 불일치

- **Minor · 이번 교정.** 받은 알림 QA의 원래 서두가 삭제 API 부재와 읽음 뒤 제자리를 현재 사실처럼 보이게 했다. 2026-09 기록에 날짜를 붙이고 최신 근거와 NDEL 계획을 연결했다. 원래 ALARM 사례와 이후 QA/예외 내용은 동일하다.
- **Minor · 별도 소유.** DESIGN의 기존 허용 목적지 설명에는 DEV-28 계정 동의 경로가 빠져 있다. 현재 allowlist와 동의 경로의 소유 근거는 [데이터 접근 가이드](../../../ai-context/data-access.md#8-유지하는-제품api-정책)와 [DEV-28](../tasks/DEV-28.md#dev-28-brief)에 있다. 이번 범위는 삭제·보존이다.

### 개발자 확인 필요 사항

수동 삭제 정책 문서의 추가 결정은 없다. 보존 기간·자동 만료·물리 파기·복구는 소유 부서의 승인과 백엔드 계약을 확인할 때 재검토한다.

### 추천 수정 방향

DEV-43 자체 Gate에서 현재 개발 버전과 합성 QA 자원, `ALL` 재전송 및 페이지·건수 경쟁을 확인한다. 실제 주기 만료나 복구 개발은 해당 소유 계약을 확인한 뒤 판단한다.

## 문서 검증

- `python3 verify_pol20.py active`와 `git diff --check 6eb78d0`은 초안에서 통과했다. 리뷰 기준 문서 10개·로컬 링크 832개·앵커/줄 참조 430개·표 34개, 원본 79개·Task 114개·의존 관계 156개·NDEL 계획 9개를 확인했다. 검사기는 저장소 밖에 있다. 최초 검사기가 N02의 두 교차 참조를 직접 프레임에 합산해 검사기만 수정하고 재검증했다.
- 종료·WBS·인계와 리뷰 기록을 포함한 diff는 `python3 verify_pol20.py final`과 `git diff --check`를 실행하고 두 리뷰에서 재확인한다. 최종 커밋과 원격 체크는 [전달 기록](../tasks/POL-20.md#pol-20-delivery)에 연결된 PR에서 확인한다.

## 독립 verifier

### Result

PASS · 정책 문서 초안

### Summary

MAT-254의 기존 승인·개발 Swagger·백엔드 고정 소스와 V133을 대조했다. 선택·전체 논리 삭제, 조회·건수 재동기화, 보존·복구 보류, Figma 네 상태와 후속 조건을 확인했다.

### Issues

Blocker·Major 0건. Minor 2건을 반영해 기삭제 행에 한정한 재요청과 최초 시각 보존을 명시하고, 초기 미실행 표의 날짜와 현행 검증 링크를 추가했다.

### Verification

독립 실행한 `verify_pol20.py active` 및 `git diff --check`는 PASS다. 개발 OpenAPI의 지문을 재확인했고 소유 계약과 비교했다. 로컬 앱 검사와 실제 업무 동작의 실행은 문서 검증 범위 밖이다.

### Documentation Update Check

DESIGN·data-access·QA와 DEV-43 인계의 갱신을 확인했다. 종료된 WBS와 최종 리뷰 기록을 포함해 다시 확인한다.

### Review freshness

초안 검토의 diff SHA-256은 `a23aa7d7c1de8ab13f0ed5ea5269a450c6a968d1bca80df332ff65ab67d16041`이다. Minor 보완과 종료 기록을 포함한 최종 diff에 대해 독립 verifier와 ai-review를 재실행한 뒤 커밋한다.

### Developer follow-up

수동 삭제 정책 문서는 기존 사용자 승인으로 충족된다. 보존·파기·복구와 DEV-43의 실행·QA 자원은 각각 소유 조건을 확인한다.

## ai-review

### 1. 리뷰 요약

N02 완료 기준, 사용자 승인, Figma와 백엔드·프런트 소스, 실제 diff 및 검증 결과를 대조했다. 본인 알림의 선택·전체 삭제에 필요한 범위와 재조회 기준이 명확하다. 현재 화면의 비활성과 백엔드 소스·게시 명세·이전 격리 검증을 구분한다.

### 2. 발견된 문제

초안의 기삭제 재요청 범위와 검증표 시점 Minor 두 건을 수정했다. 명령의 계정 격리·일괄 입력 검증·`ALL` 재전송 위험과 연결 누락을 재확인했다. POL-20 변경에 미해결 Blocker·Major가 없다.

### 3. 누락된 검증

문서 전용 범위로 로컬 `pnpm test`·`pnpm lint`·`pnpm build`·`pnpm build-storybook`, 제품 브라우저·mock·HTTP 대역을 실행하지 않았다. 현재 공유 개발 프로세스·마이그레이션 대응과 실제 삭제는 미확인·미실행이다. 기존 ALARM·ANAV·NSIG 차단과 NDEL 9개 미실행 계획을 보존했다. 원격 CI 결과는 PR의 해당 head에서 확인한다.

### 4. 문서 갱신 필요 여부

정책·DESIGN·data-access·QA 및 QA 인덱스·공통 계획·WBS·DEV-43 인계·리뷰와 반복 출력 기록을 갱신했다. 패키지·디렉터리·하네스 변경은 없으며, 원본 연결표와 기준선·감사는 고정 자료로 유지한다.

### 5. 개발자 확인 필요

POL-20 문서 판정에 추가 사용자 결정이 필요하지 않다. 보존 기간, 파기와 사용자 복구는 해당 제품·데이터 정책과 백엔드 지원을 확인한다. DEV-43 실제 QA에는 합성 자원과 별도의 대상·변경·잔존·복구 승인이 필요하다.

### 6. 추천 수정 방향

다음 DEV-43에서 미로딩 포함 전체 삭제의 사용자 의도·재전송, offset 페이지·헤더 건수와 부분 실패 회귀를 우선 검증한다. 실제 실행 판정과 오류 문구는 자체 Gate에서 확인한다.

# 가입 후 서류함 브라우저 통합 테스트 계획

## 기준과 범위

- 정책: [POL-13 사용자 D1/D2/D3·v1](../development/figma-v01/tasks/POL-13.md#pol-13-contract). Figma는 아래 사례의 frame과 [상태 연결표](../development/figma-v01/tasks/POL-13.md#pol-13-sources)를 따른다.
- 화면: 가입 후 서류함 route는 DEV-22 자체 Gate에서 확정한다. 가입용 `/auth/company/register/document`를 관리 화면으로 재사용한다고 확정하지 않았다.
- 소유: DEV-22 목록, DEV-23 상세/원본, DEV-24 추가/교체, DEV-25 삭제, DEV-26 기존 회사 OCR 적용. 아래는 정책 인계용 계획이며 실제 검증은 각 개발 Task의 필수 범위다.
- 명세: [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs)3.1.0/v1·2026-11-16 GET200와 backend dev `adc0e265ef0e2aa78ccb376e1fa322edd664b290`의 소스. wrapper/nullable·오류·권한과 실행 대응은 실제 QA에서 따로 확인한다.
- 수행자/검토자·Origin/브라우저/viewport·실행 SHA·계정/파일 별칭: 미정. 실제 브라우저 통합은 **0통과·22대기/미실행**이다. 계획 검토 PASS를 제품/실제 통합 PASS로 세지 않는다.

## 선행 조건과 승인 경계

- 활성 회사/문서관리 권한 있음·없음·미귀속 owner/다른 계정·소속 종료를 재현할 합성 계정과 실제 개인정보 없는 disposable 문서/이전 version·candidate·결측/경계 날짜가 필요하다.
- 담당 역할: Backend 계약/실행 버전 담당, 제품/디자인의 MAT-162 결정 담당, 안전한 문서/계정과 변경·잔존·복구 담당. 개인/일정은 미확인이다. 새 기능 축소/로컬 선행·실제 QA 면제는 승인되지 않았다.
- 실제 로그인/업무 조회·티켓 발급/원본 열람·업로드/OCR/삭제·기관 호출/보존·복구 범위는 각 Task 자체 Gate에서 승인/준비한다. 이번은 소스/명세 읽기와 문서 작성만 승인됐으며 업무 API 실행0건이다.
- 기존 회사 신규 문서 귀속·최종 교체·OCR 선택 반영은 계약 선행이다. MAT-162 기획 보류·닫힌 PR을 재개하지 않는다. 삭제 장기 worker/시간 이동·파기는 운영 자원이 아닌 승인된 격리 환경에서만 준비한다.
- 원본/추출값·서명 URL/header/checksum·인증값은 기록하지 않는다. 실행 시 날짜/commit·별칭·상태/HTTP code/비민감 결과·복구만 남긴다. 이전 AUTH/QA-05~07·MCO/CDASH·CUPD의 통과/차단/승인 예외는 그대로다.

<a id="pol-13-document-qa"></a>

## 사례별 준비·조작·기대 결과

API 약어: A=`GET /api/v1/companies/{companyId}/documents`, B=`GET /api/v1/company-documents/{documentId}`, C=`GET …/{documentId}/versions`, D=`POST …/{documentId}/versions/{versionId}/access-tickets`, E=`POST /api/v1/company-documents`, F=`POST …/{documentId}/versions`/직접PUT/upload-completions, G=`POST …/{documentId}/versions/{versionId}/ocr-attempts` 또는 verification-attempts, H=`DELETE …/{documentId}`. 생략 경로의 prefix는 `/api/v1/company-documents`다. I=기존 회사 귀속/최종 교체/OCR 반영의 **미확인 관리 계약**이며 새 endpoint를 뜻하지 않는다.

| ID·소유 | Figma node | API·준비 데이터 | 조작 | 기대 결과 | 상태/증거 |
| --- | --- | --- | --- | --- | --- |
| DBOX-01 · DEV-22 | 3135:75612/75734 | A·21개 이상 합성 문서/문서관리 권한 | 첫/끝/범위 밖 page와 size 경계를 조회 | page0/기본20/상한100·totalElements 문서 수/정렬·빈 page와 전체0건 구분 | 대기·미실행 |
| DBOX-02 · DEV-22 | 3135:75734 | A/B/C·current+처리 후보+과거 version | 후보 처리 중과 실패/재조회 상태를 비교 | 후보 우선 행과 current=false·기존 current 보유를 보존, max version을 확정값으로 취급하지 않음 | 대기·미실행 |
| DBOX-03 · DEV-22 | 3135:75612/75734 | A·빈 회사/권한 없음/조회 오류 | 정상0건·403·연결 실패를 각각 조회 | 미보유/권한 거절/오류가 별도이며 오류를 빈 성공으로 바꾸지 않음 | 대기·미실행 |
| DBOX-04 · DEV-22 | 3135:75612 | A/B/C·owner/다른 계정/ACTIVE·종료 소속/leaf 차이 | 같은 문서를 문맥별 조회 | 미귀속 owner·회사 소속·목록 leaf의 실제 차이 유지, role/업로더만으로 허용하지 않음 | 대기·미실행 |
| DBOX-05 · DEV-22 | 3135:75734/75782 | A/B/C·validUntil 오늘/어제/null·미래 validFrom/손상 날짜 | 한국 날짜 경계와 결측을 조회 | validUntil 당일 포함/다음 날 만료·null 미확인, 업로드일+30일 합성 없음. 목록 날짜 제공 방식/호출 수는 자체 Gate에서 확정 | 대기·미실행 |
| DBOX-06 · DEV-22 | 3135:75734/75991 | A/B·UPLOAD_READY/OCR·검증 실패/확인대기/VERIFIED | 상태별 목록을 비교 | 보유/처리/진위/기간/current·회사정보 반영을 별개로 안내 | 대기·미실행 |
| DBOX-07 · DEV-23 | 3135:75782/83161 | B/C/D·metadata 소속과 원본권한 차이 | 이력 조회 뒤 원본을 요청 | metadata를 볼 수 있어도 원본/추출 필드·proposal 권한을 확대하지 않음 | 대기·미실행 |
| DBOX-08 · DEV-23 | 3135:75782 | D·현재/REPLACED·처리 중/거절 version | 선택 version을 PREVIEW/DOWNLOAD로 요청 | exact managed version·허용6상태만 발급, 없는/권한없음404·상태409를 구분하고 원본 fallback 없음 | 대기·미실행 |
| DBOX-09 · DEV-23 | 3135:75782 | D·2분 티켓/만료/네트워크 실패 | 발급·만료·명시 재시도 뒤 storage를 점검 | 현재 권한 재검사·무한 재발급 없음, URL/서명/원문은 storage·로그/증거에 비저장 | 대기·미실행 |
| DBOX-10 · DEV-23 | 3135:83161 | C·복수 version/nullable 표시명·기간 | 과거/현재와 수정 시각을 열람 | 이력 순서/기간 결측 보존, 업로더 이력을 열람/삭제 수행자 감사 로그로 오표시하지 않음 | 대기·미실행 |
| DBOX-11 · DEV-24 | 3135:75651/75938 | E/F·합성 PDF/JPG/PNG/잘못된 형식·byte 경계 | 1byte/10×1024×1024/초과·MIME·무결성 오류를 제출 | 형식/정확 크기/HEAD 실패 분류·불일치 재업로드와 기존 current 보존 | 대기·미실행 |
| DBOX-12 · DEV-24 | 3135:75651/75938 | E/F·동일 key·동일/다른 payload·응답 유실 | 같은 요청 복원·10분 URL/30분session 경계를 확인 | 동일 요청 수렴/다른 payload409·opaque handle/비저장, 새 key 자동 재제출 없음 | 대기·미실행 |
| DBOX-13 · DEV-24 | 3135:75938 | F/B/C·current/진행·실패 후보·두 계정 | 동시 교체와 오래된 replacesVersionId 제출 | 단일 후보/서버409·최신 재조회/명시 재선택, current 선삭제/자동 덮어쓰기 없음 | 대기·미실행 |
| DBOX-14 · DEV-24 | 3135:75938 | B/G·OCR_FAILED/VERIFICATION_FAILED/REUPLOAD_REQUIRED/거절 | canRetry/만료24시간 경계·재시도·새로고침 | OCR/진위 재시도 분리·입력 거절은 새 문서, 조회 실패로 Job 재생성 없음 | 대기·미실행 |
| DBOX-15 · DEV-24 | 3135:75651/75991 | E/F/I·기존 회사·미귀속 새 문서 | 회사 귀속/최종 교체 계약을 확보하고 결과 조회 | API 존재/업로드·OCR 완료만으로 회사 귀속/교체 완료 선언 없음. 계약 전 실제 시나리오 실행 불가 | 대기·미실행 |
| DBOX-16 · DEV-26 | 3135:75991/78459/81589 | I·승인된 필드/출처/결측/수기값·동시 변경 | MAT-162 새 결정·연결 계약 뒤 선택 반영/실패/재업로드를 시험 | OCR와 회사 저장 분리·선택값/수기/근거·권한/경합/인증 유지·복구 확인. 계약 전 실행 불가 | 대기·미실행 |
| DBOX-17 · DEV-25 | 3135:75782/80545 | H·현재/과거/후보가 있는 disposable series | 전체 삭제 확인에서 취소·확정·중복 클릭 | 취소0요청·전체 version 의미/복원 없음 안내·확인된 성공 뒤만 기존 Toast/목록 갱신 | 대기·미실행 |
| DBOX-18 · DEV-25 | 3135:80545 | H/B/A·재삭제/404·timeout/5xx/손상2xx·조회 실패 | 명령 응답/이후 조회 실패를 분리 | 동일 삭제 시각 수렴·404 무조건 완료 금지·미확정/성공 뒤 갱신 실패와 명시 상태 확인, 자동 재삭제 없음 | 대기·미실행 |
| DBOX-19 · DEV-25 | 3135:75782/80545 | H/D/B/F·발급된2분 티켓·삭제/교체/조회 경쟁 | 삭제 직후 새 티켓/조회와 기존 티켓 잔여를 비교 | 신규 접근 제외·늦은 화면 부활 없음·기발급 URL의 즉시 폐기를 약속하지 않음 | 대기·미실행 |
| DBOX-20 · DEV-25 | 3135:80545 | H·격리 purge worker/실패·회사 근거 참조 | 삭제+30일 대상·storage 실패/재시도 뒤 비민감 결과 확인 |30일은 예정·전체 원본/OCR 상세 파기·tombstone/근거참조 해제, 회사/소속 삭제·즉시 인증 강등과 구분 | 대기·미실행 |
| DBOX-21 · DEV-22~26 | 해당 frame | A~I·계정/회사 교체·권한 상실/만료·늦은 응답 | 읽기/업로드/삭제/선택 중 문맥을 교체 | 이전 자료/handle·응답/Toast/작업 자동 재생 차단·확인된 명령 성공과 후속 refresh 실패 구분 | 대기·미실행 |
| DBOX-22 · DEV-22~25 | 3135:75612/75782/75651/80545 | 해당 API·desktop/좁은 화면·키보드/보조기술 | 목록/상세/확인/오류와 초점 복귀를 조작 | 기존 토큰/Figma 상태·읽기 순서/포커스/상태 전달·모바일 회귀를 실제 브라우저에서 확인 | 대기·미실행 |

## 실행 환경/결과 기록

| 실행일시 | frontend/backend 실행 SHA·Origin | 브라우저/화면 | 계정/문서 별칭 | 결과/복구 |
| --- | --- | --- | --- | --- |
| 미실행 | 미확인 | 미정 | 미정 | 정책 계획만 작성, 실제 처리/변경0건 |

실제 검증 때 각 ID에 실행 식별자·단계·비민감 Network/화면 증거·실패/복구를 추가한다. Backend unit/HTTP 대역·mock 브라우저·실제 통합·운영 파기를 분리하고 기존 가입 QA 상태를 덮어쓰지 않는다. 정책 결정의 완료와 기능 전체 통합 PASS·Git/main 반영은 별도 판정이다.

<a id="dev-22-local-qa"></a>

## 2026-11-16 · DEV-22 목록의 로컬 검증

- 승인: [이번 DEV-22 D1/D2](../development/figma-v01/tasks/DEV-22.md#dev-22-brief)의 기존 API 조합·**로컬 선행/실서버 QA 차단 보존**. 원본 POL-13 계획22개는 당시 미실행 이력으로 보존한다. 이 승인을 DEV-23~26/가입·회사 QA로 확대하지 않는다.
- 실행: `feat/dev-22-document-box`, 시작 SHA `433200f` 이후 이번 소스 diff, Node22.20.0/pnpm11.3.0·Next16.2.9·Aside Chromium. Origin `http://127.0.0.1:3022`, 데스크톱1440×1000·모바일375×812. mock 회사 `documents`/합성 계정1·2, HTTP는 loopback4322의 합성 응답 서버만 사용했다. 실제 업무 서버·OAuth/파일/OCR/티켓/삭제0건이다.
- API 근거: backend dev `adc0e265ef0e2aa78ccb376e1fa322edd664b290`, main `4b5f31de578c41e698dda9c99e66149b7292f031` 유지·개발 OpenAPI3.1.0/v1 GET200(Aside). 일반 Python GET403은 접근 경로별 관찰이다. [기존 배포 run](https://github.com/mate-pjt/mate-backend/actions/runs/43389204151)의 verify/publish/deploy success·prod skipped를 재확인했다. source/CI 배포 기록/게시 명세와 현재 실행 프로세스 SHA·실제 업무 응답/권한 fixture는 별개이며 마지막 항목들은 미확보다.
- 증거: [데스크톱](dev-22-documents-desktop.png)·[모바일](dev-22-documents-mobile.png)·[빈 목록](dev-22-documents-empty.png). 재현 서버/명령·요청 집계는 로컬 `/Users/jisung/.codex/visualizations/2026/11/16/01a1e304-db24-7432-baf1-3a3d9f270bc4/dev22-evidence/`에 보관한다. 로그/스크린샷은 합성 이름·문서명과 비민감 path/count만 포함하며 header/token·서명·원문은 저장하지 않는다.

| 로컬 ID | 연결 실제 case | 실행·관찰 | 로컬 판정 |
| --- | --- | --- | --- |
| DBOX-L01 | 01/22 | 비로그인 진입→복귀 next 유지 로그인 안내, 가상 로그인 후 목록·my 메뉴의 서류함 진입/마이페이지 복귀. HTTP 대역에서도 로그인 링크 최종 화면 확인 | PASS |
| DBOX-L02 | 01 | 합성25개 첫20/끝5·총 문서수25·최근 변경순·이전/다음 비활성·페이지 이동 후 제목 초점. Node에서size1/100·상한/offset·잘못된 page 검증 | PASS |
| DBOX-L03 | 01/03 | HTTP에서 page1 유지 중 문서수1로 감소→전체1개/현재 page0행·첫 페이지 복귀. 해당 빈 page 목록1/버전0요청 | PASS |
| DBOX-L04 | 02/06 | 표시 후보v2/OCR 처리·실패와 기존current v1 보유를 함께 표시. exact ID/current/status 변경 경쟁은 확인 필요, 최대 번호로 current 추정 없음 | PASS |
| DBOX-L05 | 03 | 정상0건의 회색 미보유 행, 목록403의 권한 안내,503·손상content/null의 오류/명시 재시도 구분. 오류→정상 재시도 뒤20행 복원 | PASS |
| DBOX-L06 | 04/21 | Node에서 다른 회사403/다른 계정404·미귀속 owner와 관리 leaf 차이, 실제 auth+회사 mock의 token/refresh 호출0 검증. 실제 권한 집행 증명은 아님 | PASS |
| DBOX-L07 | 05 | KST 당일까지 기간 내/다음날 만료·어제/오늘/null·미래validFrom·손상/역전/윤년. 화면에서 만료·미확인·시작 전·확인 필요를 보유/처리와 분리 | PASS |
| DBOX-L08 | 06 | mock의 업로드 대기/OCR 처리·성공·실패/재업로드/진위 확인·실패·거절/회사정보 확인/VERIFIED 표기·독립 회사 인증 안내. 성공문구를 회사정보 반영 완료로 바꾸지 않음 | PASS |
| DBOX-L09 | 01/05 | loopback 실제 HTTP 경유 목록1+버전20·동시최대4, 끝page는 버전5·빈page0. 해당 page 밖 자동 조회/자동 polling 없음 | PASS |
| DBOX-L10 | 03/21 | 한 버전503은 보유/기간 확인 필요, 버전403·401은 전체 목록 숨김과 권한/로그인 안내. current mismatch도 부분 확인 필요 | PASS |
| DBOX-L11 | 21 | mock 계정1의 합성 표식은 계정2/새로고침에 미노출. HTTP 지연 조회 중 화면 이탈→회사7002 재진입 후0행 유지·이전 응답 부활 없음. Node에서 계정/회사 scope·Abort/epoch 후 후속 조회 차단 | PASS |
| DBOX-L12 | 04 | Node에서 신규 미귀속 업로드는 회사 목록0건→가입 등록 성공 뒤 같은document/version 귀속/새 Repository 복원·기간null. 기존계정/다른 계정·진행/멱등 회귀도 전체 test에 포함 | PASS |
| DBOX-L13 | 22 | 모바일375px에서 scrollWidth360≤innerWidth375·문서/버튼/기간 줄바꿈·읽기 순서. 키보드 Enter 메뉴/새로고침·제목 초점·상태/alert·목록과 페이지 접근성 이름 확인 | PASS |
| DBOX-L14 | 21/22 | 전체 mock 관찰의 외부resource0건, 혼합 mock의 인증 추가 요청0(Node). 실제 production mock build와 혼합 Preview 결과물 production start가 각각 명시 오류/exit1로 차단됨 | PASS |

### Figma·정책·화면의 대응과 한계

- `3135:75612`: 미보유 회색 행/사업자등록증명서, `3135:75734`: 보유 primary100 행/체크 아이콘/등록일·두 버튼 slot을 design context와 이미지로 확인했다. 흰20px 카드·1100px 콘텐츠·24px padding과 기존 grayscale/type/Button·로컬 exact 체크 SVG/Add·오른쪽 화살표를 재사용했다. 원본 screenshot을 제품 자산으로 사용하지 않았다.
- count/정렬·현재/후보·기간/오류/페이지는 POL-13/DEV-22 완료 기준의 기능 상태를 추가한 것이다. 두 버튼은 DEV-23/24 소유로 준비 중 비활성이고, 신규 추가/상세/원본/업로드·삭제를 이번에 구현했다고 세지 않는다. 헤더는 기존 DEV-56의 nickname 정책을 유지한다. 이 범위 연결을 화면 전체의 예외 승인/모든 frame의 픽셀 일치로 확대하지 않는다.
- 초기 CLI의 일회성 Aside 탭이 닫혀 지속 조작되지 않아 동일 Aside MCP REPL로 이어갔다. 초기 SPA/로그인·빠른 reload 관찰은 전환/로딩 상태였으며 최종 상태를 기다려 다시 확인했다. 임시 도구 관찰을 제품 실패나 PASS로 세지 않았다.
- 보조기술은 DOM/접근성 tree·role/키보드/초점으로 확인했다. 실제 VoiceOver 음성 청취·다른 브라우저/실기기·실제 storage/권한 회수/실서버 날짜는 미실행이다.

### 실제 API의 남은 차단 · DBOX-01~06/21~22

- **실제0통과·8차단, 실행0건**. 나머지 DBOX-07~20 14개는 기존 후속 Task의 대기/미실행이다. 로컬14개 PASS와 원본22개 계획/미실행 이력은 서로 다른 집계다.
- 필요한 역할: backend 실행/계약 담당과 합성 권한 계정/회사·문서 자원 담당. 개인/일정은 미확인, 마지막 확인일2026-11-16이다. 현재 frontend/backend 실행 SHA 대응·실제 wrapper/상태/기간·서버 권한/귀속·후보/current·권한 상실/삭제 경계의 비식별 fixture와 안전한 조회/사용/보존/복구 범위가 재개 조건이다. 비밀값/원문을 문서나 채팅으로 요구하지 않는다.
- 이번 D2가 승인한 것은 로컬 구현/검증 선행이다. 실제 업무 API/티켓/파일 처리·MAT-162/DEV-08 또는 다른 Task의 QA 면제가 아니며, main 반영과 실제 API 통합 PASS도 별도다.

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


<a id="dev-23-local-qa"></a>

## 2026-11-16 · DEV-23 상세/이력/원본의 로컬 검증

- 승인: [DEV-23 사용자 D1/D2](../development/figma-v01/tasks/DEV-23.md#dev-23-brief). **로컬 구현/검증 선행·실제 API QA 차단 보존**, PDF 기본 뷰어/이미지 확대·축소·최근활동 준비 중. DEV-22/다른 Task의 승인 승계가 아니다. 기존 POL-13 원본22미실행·DEV-22 로컬14/실제8차단·가입/회사·DEV-08/MAT-162 및 후속 계약 Gate를 보존한다.
- 실행: `feat/dev-23-document-detail`, base `a55fdfc1140e61f6ab36627ad39a3b98fd947d8c` 이후 DEV-23 diff. Node22.20.0/pnpm11.3.0·Next16.2.9, Aside Chromium·1440×1000(일부1100)/375×812. Origin `http://127.0.0.1:3023`, 전체 mock `company=documents`와 loopback4323의 합성 HTTP 응답/파일 서버만 사용했다. 실제 업무 API/티켓/원본/OCR/삭제·외부 메시지/운영/배포0건이다.
- 계약 근거: [DEV-23 소유 source/명세](../development/figma-v01/tasks/DEV-23.md#dev-23-sources), dev `adc0e265ef0e2aa78ccb376e1fa322edd664b290`/main `4b5f31de578c41e698dda9c99e66149b7292f031` 유지·Aside 개발 OpenAPI GET200/3.1.0/v1. [기존 배포 run43389204151](https://github.com/mate-pjt/mate-backend/actions/runs/43389204151)의 dev SHA·completed/success를 현재 재확인했다. source/배포 기록·게시 명세와 현재 실행 SHA·실제 응답/권한·원본/CORS는 별개이며 마지막 항목은 미확인이다.
- 증거: [데스크톱 PDF](dev-23-document-desktop.png), [모바일 상세](dev-23-document-mobile.png), [없는 선택 버전](dev-23-document-missing.png). 로컬 재현 서버/검사·build 로그·합성 mock PDF/PNG 화면은 `/Users/jisung/.codex/visualizations/2026/11/16/01a1e330-e792-7d52-8ae4-3775597d1194/dev23-evidence/`다. 요청 집계는 method/path/purpose/count만 확인했고 token/header·서명 URL/원문을 증거에 남기지 않았다. 다운로드 내용 검사는 이 서버가 만든 합성 버전 표식만 사용했다.

| 로컬 ID | 연결 실제 case | 실행·관찰 | 로컬 판정 |
| --- | --- | --- | --- |
| DBOX-DL01 | 07/21 | 비로그인·세션 확인 상태/401 뒤 보호 filename·iframe 숨김. 이전v1 선택→다운로드401→로그인 next의 같은 version 보존을 최종 관찰 | PASS |
| DBOX-DL02 | 07/10 | current v2/REPLACED v1·번호순 이력, 업로드/최종수정·크기/MIME·nullable 페이지수/업로더 표시명. metadata는 GET versions만 사용하고 추출값 GET/목록 leaf를 추가 요구하지 않음(Node/HTTP) | PASS |
| DBOX-DL03 | 08/10 | v1 선택 후 기존 원본 표시 해제/URL 변경. mock697bytes·HTTP651bytes 실제 다운로드 이벤트와 합성 v1 표식 일치, HTTP DOWNLOAD 티켓1+원본 `/original/1` GET1 | PASS |
| DBOX-DL04 | 05/10 | HTTP 이전 버전 만료·current 미확인/페이지수 null·표시명 null을 구분. 기존 KST/미래/잘못된 날짜 계약 테스트 전체를 함께 통과했으며 날짜로 원본 권한을 합성하지 않음 | PASS |
| DBOX-DL05 | 08/10 | 선택 version이 사라지면404 안내/원본 버튼 없음·current fallback0. invalid document/version은400 안내·versions/티켓0요청. 정상 재조회로 복구 | PASS |
| DBOX-DL06 | 08/22 | 실제 Next 전체 mock·HTTP의 PDF 원본을 메모리 blob iframe/기본 브라우저 뷰어에서 표시. 합성 문서/1페이지·네이티브 도구를 screenshot/접근성 tree로 확인 | PASS |
| DBOX-DL07 | 08/22 | mock PNG 실제 decode/naturalWidth>0·이미지 확대100→125%를 키보드 Enter로 조작, 이미지 영역만 scroll·375px 문서폭360. JPEG 실파일·다른 기기 표시는 미실행 | PASS(명시 PNG 범위) |
| DBOX-DL08 | 07/10 | metadata403/404/503·sizeBytes null 손상 응답을 권한/없는 문서/오류로 구분하고 파일 정보를 노출하지 않음. Node/mock의 관리 leaf 거절은 metadata 허용·원본404 | PASS |
| DBOX-DL09 | 08/09 | 티켓404/409/503 각각 POST1/원본GET0·구분 안내, 상태 충돌 뒤 명시 metadata 재조회에 같은 선택v1 유지. 실제 서버 권한 집행 증명은 아님 | PASS |
| DBOX-DL10 | 08/09 | storage403·잘못된 MIME·CORS 거절은 오류 유지/거짓 완료0·fallback/자동 재발급0. HTTP 각 티켓1+GET1. Node의 빈/손상·10MiB 초과/stream 오류·안전 URL도 통과 | PASS |
| DBOX-DL11 | 09 | 이미 만료된 티켓은 GET0, 합성1.5초 티켓 표시 만료 뒤 iframe0·자동 POST0, 지연 GET은 만료에 중단/오류·재발급0. Node 가짜Clock의2분·전송 정체/만료를 별도 검증 | PASS |
| DBOX-DL12 | 21 | 지연 DOWNLOAD 중 v1→v2 선택: old POST1/후속 원본GET0·다운로드 안내0. Node에서 중복 클릭·dispose/늦은 응답·계정/회사 scope/Abort·StrictMode cleanup 재마운트·URL 해제를 확인 | PASS |
| DBOX-DL13 | 21 | HTTP 합성 account2/company7002 및 같은 account/company 교체의 refresh/하드 리로드 뒤 이전 filename/iframe0·티켓0, metadata404. in-flight 계정/회사 경쟁은 Node 증거와 구분 | PASS |
| DBOX-DL14 | 22 | 목록2페이지→키보드 상세 진입→같은 page2 복귀·목록 제목 초점, 상세/버전 선택 h1 초점·role/status/alert·375px overflow 없음(360≤375)을 관찰 | PASS |
| DBOX-DL15 | 09/21 | mock 외부resource0·HTTP 비loopback resource0, sessionStorage 서명/원문0. mock 원본 요청 전후 company 공간 동일·실제 auth+회사 mock의 token/refresh 추가 호출0(Node) | PASS |
| DBOX-DL16 | 21/22 | async 상세/목록을 실제 Next에서 조회/하드 리로드·3구성 빌드. 운영 mock build와 hybrid Preview artifact의 production start는 명시 오류/exit1로 예상 차단 | PASS |

### Figma/정책/화면과 명시 승인 경계

- `3135:75782`/`3135:83161` 두 frame의 design context·screenshot을 확인했다. breadcrumb/1100px 폭·흰20px 카드/24px padding·26px 제목·회색 metadata4칸·미리보기/서류정보/버전기록/최근활동 배치를 기존 토큰·Button/RightArrow·Add/Minus로 표현한다. 원본 screenshot을 제품 자산으로 사용하지 않았다.
- D2의 명시 선택: PDF는 브라우저 기본 뷰어(브라우저별 툴바 차이), 이미지는 확대/축소, 최근 활동은 제공 준비 중이다. 최근 활동 API/감사 로그를 만들지 않았고 두 번째 frame의 업로드 완료 Toast를 재생하지 않는다. 모든 frame/pixel/브라우저 일치 승인은 아니다.
- 정책상 기능 의미: 문서 status/current·만료 미확인과 회사 인증/반영을 구분한다. 기존의 고정 ‘인증’·‘무기한’·예시 활동을 실제 결과로 합성하지 않는다. 지우기/다시 업로드는 후속 Task라 비활성이다. D2와 다른 전체 화면 예외 승인을 주장하지 않는다.
- 네이티브 PDF 도구는 이미 접근한 bytes를 저장/인쇄할 수 있다. 앱의 새 PREVIEW/DOWNLOAD 요청은 티켓을 새로 검사하며 표시 만료/Blob URL 해제가 이미 저장한 파일의 폐기나 다운로드 회수를 보장하지는 않는다. UI는 ‘다운로드 시작’을 안내하고 OS 저장 완료를 선언하지 않는다.
- 초기 HMR의 stale ref로 버전 선택이 수행되지 않은 도구 관찰과 짧은 loading snapshot은 PASS로 세지 않았다. fresh snapshot/실제 선택·최종 상태로 재현해 위 DL01/05를 확인했다. source 실패로 위장하거나 미완료 화면을 통과 처리하지 않았다.
- 접근성은 DOM/접근성 tree·키보드/초점으로 확인했다. 실제 VoiceOver 음성·Safari/Firefox/모바일 실기기·실제 JPEG/비합성 파일은 미실행이다. 공통 헤더/목록의 기존 영역을 별개 디자인 재작업으로 확대하지 않았다.

### 실제 API의 남은 차단 · DBOX-07~10/21~22

- 이번 실제 **0통과·6차단/업무 실행0건**. DEV-22의8차단 중21/22와 중복2개를 제외해 두 후속의 실제 고유 집계는 **0통과·12차단**, DBOX-11~20의 **10대기/미실행**이다. 원본22계획과 DEV-22 당시8차단/다른14대기의 날짜별 이력은 보존한다.
- 마지막 확인일2026-11-16. 필요한 역할은 backend 실행/권한·storage 계약 담당과 비식별 합성 계정/회사/파일·안전한 조회/티켓 발급·사용/보존/복구 담당이다. 개인/일정은 미확인이다. 현재 실행 SHA/실제 wrapper·현재/이전 managed object·leaf/owner/ACTIVE 권한·2분 만료·실제 MIME/크기/CORS·안전한 오류 및 회수·복구 자원을 확보한 뒤 해당 case를 재개한다. 비밀값이나 원문을 채팅/문서로 요청하지 않는다.
- D1은 이번 로컬 선행만 허용한다. main 반영·실제 원본 통합 PASS/회수 보장·운영/배포·가입 QA/다른 Task의 예외로 확대하지 않는다. 테스트 소스 열람/HTTP 대역·mock/실제 통합을 별도로 판단한다.

<a id="dev-24-local-qa"></a>

## 2026-11-16 · DEV-24 기존 문서 재업로드 로컬 검증

- 승인: [사용자 D1/Brief](../development/figma-v01/tasks/DEV-24.md#dev-24-brief)의 **재업로드만 로컬 선행·신규 추가/실통합 차단**. 아래는 실제 Next mock/loopback HTTP와 Node 계약 검사이며 실제 업무 API/파일/OCR/외부 기관 처리0건이다. 신규 회사 귀속·회사 프로필 적용/MAT-162·삭제와 기존 가입/회사 QA의 판정을 바꾸지 않는다.
- 환경: Node22.20.0/pnpm11.3.0, 실제 환경파일을 복사하지 않은 격리 snapshot. Aside 실제 브라우저의 mock `127.0.0.1:3224`/HTTP `127.0.0.1:3225`→합성 API/storage `127.0.0.1:4324`, 1440px desktop·390×844 좁은 화면. 파일은 합성 `synthetic.pdf`·형식 오류 파일뿐이다. 로컬 HTTP 서버는 OCR/진위를 합성 상태로 전이하며 실제 엔진·기관 호출을 하지 않는다.
- source 확인: [기존 회사 attached candidate의 서버 원자 전이](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/businessverification/BusinessVerificationDocumentTransitionPolicy.kt)와 [개발 OpenAPI](https://api-test.mate-bid.com/v3/api-docs)를 확인했다. 신규 series 회사 귀속은 여전히 미확인이다. 원본 계획의 API 약어 I 중 기존 attached candidate 최종 교체는 이 소스 관찰로 보완하며, 실제 실행/회사 프로필 적용 계약으로 확대하지 않는다.

| ID | 환경/조작 | 결과와 한계 |
| --- | --- | --- |
| DBOX-RL01 | Figma3135:75938/하위3189:118415 context·screenshot/실제 Next popup |640px popup·닫기/안내·선택·체크리스트/footer를 기존 컴포넌트/토큰으로 연결. 상태/오류 안내 추가, 다른 화면/모든 상태 픽셀 일치 판정 아님 |
| DBOX-RL02 | Node byte1/10×1024×1024/초과·MIME/확장자, 브라우저 잘못된 확장자 | 파일 요청 전 거절·alert/업로드 비활성. 정확 byte 전수는 Node, 실제 서버 파일 무결성/진위는 미실행 |
| DBOX-RL03 | 실제 Next mock 목록→파일선택→업로드/처리→현재 재조회 | 처리 동안 기존 current·프로필 유지, 새 current·이전 REPLACED와 목록v2 확인 |
| DBOX-RL04 | 실제 HTTP versions POST→PUT→completion→GET/이력 | replacesVersionId/SHA·신규 companyId/documentType 추가0. PUT Authorization/Cookie 없음·checksum 일치, current1 유지 뒤v2 갱신/완료 Toast 실제1회 |
| DBOX-RL05 | PUT503 뒤 같은 요청 명시 재시도 | 후보1·create2/PUT2/completion1, 같은 key 동등성은 Node로도 확인. 실패를 교체 완료로 안내하지 않음 |
| DBOX-RL06 | 서버 접수 뒤 completion202 JSON 파손→현재 상태 확인 | 미확정 안내 뒤 명시 GET/이력, create/completion 각1·새 key 자동 생성0. 네트워크 유실은 Node 대역도 검증 |
| DBOX-RL07 | versions409 | 현재v1 유지·파일/attempt 해제·PUT0·완료 Toast0. 조회 후 명시 재선택 |
| DBOX-RL08 | 후보는 생성했으나201 필수 ID/descriptor 파손 | 미확정 안내·PUT0·완료 Toast0, 같은 요청 확인 경로 보존 |
| DBOX-RL09 | 최종 status401 | 로그인 복귀 링크/파일 선택·제출 비활성, create/PUT0·완료 Toast0. 실제 인증/권한 철회는 미실행 |
| DBOX-RL10 | OCR_FAILED/canRetry 기한→명시 OCR 재시도 | ocr-attempts1·기존 current 유지 후v2 확인/Toast. verification 분기·기한/형식은 Node/source로 보완하며 실제 기관 실패는 미실행 |
| DBOX-RL11 |1.8초 create 응답 대기 중 닫기 | 늦은 응답 뒤 PUT/completion0·current1 유지, 화면 부활/완료 안내0. 서버 후보가 이미 생성됐을 수 있어 원복 완료로 설명하지 않음 |
| DBOX-RL12 | 파일 선택 뒤 refresh에서 회사 전환 | 이전 dialog/파일 제거, create/PUT0·거짓 Toast0. Node에서 계정 교체/중복/타 계정 공간도 검증 |
| DBOX-RL13 |390×844·키보드 Escape | dialog358px·가로 overflow 없음·닫기 초점·Escape 후 trigger 초점 복귀 재통과. 실제 기기/VoiceOver 발화는 미실행 |
| DBOX-RL14 | 과거v1 상세에서 다시 업로드 | 최신 currentv2를 기준으로v3 생성, 새 version URL/현재 표시/버전 이력 갱신. 목록 page1 보존 |
| DBOX-RL15 | 합성 파일 전송 뒤 storage/리소스 관찰 | 파일명/원문/서명·업로드 URL의 sessionStorage 저장0, 관찰된 non-loopback resource0. 서버 대역의 upstream 호출0이며 실제 운영 전송 증거가 아님 |
| DBOX-RL16 | Node PUT 주소403/같은 key·session410·손상 descriptor | URL 갱신과 세션 만료 뒤 명시 재선택을 분리, 410에서 재전송 루프/거짓 완료 없음. 실제10분/30분 대기는 미실행 |
| DBOX-RL17 | Node payload bytes/키·단일 후보·오래된 current·중복/계정/취소·손상 retryUntil | 동등 요청 수렴/다른 payload409·이전 current 보존, 늦은 PUT/완료 callback 차단. 새 기한 손상은 해당 회사 공간만 초기화. 실제 두 계정/row lock 경합은 미실행 |
| DBOX-RL18 | 페이지 이탈/뒤로 복귀→재진입·교체 뒤 hard reload | 열린 화면의 요청/파일을 버리고 다시 열 수 있으며 현재v2는 유지·완료 Toast 재생0. BFCache 분기는 source에서 pagehide/pageshow persisted로 방어하고 모든 브라우저 캐시 상태의 전수 검증은 아님 |

- 로컬 산출물: 이 세션 visualization의 `dev24-evidence/`에 source/명세 선별 receipt·Kotlin 근거·HTTP case별 비민감 method/path/결과·빌드 로그·격리 실행본을 보존했다. [desktop](dev-24-reupload-desktop.png)·[mobile](dev-24-reupload-mobile.png)은 합성 브라우저 화면이다. 서명 URL/header/checksum·인증값/원문 metadata를 증거에 복사하지 않았다.
- 전달 계층 관찰: 최초 socket 단절 fixture에서 Chromium이 body 없는 completion 요청을 wire에서2회 보낸 것을 기록했다. 앱 코드의 자동 재제출0과 브라우저의 전송 재시도를 구별한다. 합성 서버를202 파손 응답으로 바꾼 RL06은 completion1회였으며, 실제 백엔드의 completion 멱등/응답 유실 복구는 DBOX-12/15의 실제 차단으로 남긴다.
- 자동 검증: `pnpm test`653/653(24파일·재업로드38사례 포함), `pnpm lint`, API/mock/hybrid Preview `pnpm build`, `pnpm build-storybook` PASS. Storybook 기존 extensionless import/chunk-size 안내는 비차단. 문서 검사/두 리뷰와 최종 PR CI는 Task/검토 기록에서 확인한다.

### DEV-24 실제 API 재개 조건 · 당시0통과/7차단

DBOX-11~15/21~22는 실제 **0통과·7차단**이다. DEV-22/23의 고유12차단에 새11~15를 합쳐 원본22개 중 **고유0통과·17차단·5대기(16~20)**이며 앞선 원본 계획/날짜별 결과를 수정하지 않는다.

- Backend 계약/실행 담당: 소스 SHA→배포 기록→현재 실행 SHA/실제 wrapper·권한/오류·교체/근거 전이 대응을 확인한다. 신규 series의 기존 회사 귀속/실패 잔존/복구 계약을 확보한다. 새 endpoint나 MAT-162 재개를 임의 확정하지 않는다.
- 제품/디자인 담당: 신규 추가와 MAT-162 기존 회사 프로필 반영은 별도 결정이며 이번 사용자 D1을 확대 적용하지 않는다. 개인/일정은 미확인이다.
- QA 자원/사용 승인 담당: 문서관리 leaf 있음/없음·계정/회사 전환·이전/진행/실패 버전을 가진 disposable 계정/회사와 개인정보 없는 유효 문서, OCR/국세청·나라장터 호출·업로드/보존/잔존/복구 범위와 실행 승인을 준비한다. 실제 자료/값을 채팅으로 요청하지 않는다.
- 실제 재개 후 형식/무결성·10분URL/30분session·멱등/응답 유실·단일 후보/row lock·current/identity 근거·재시도 기한·계정/권한·브라우저/보조기술을 검증한다. 로컬 PASS와 Git/main 반영이 이 차단을 해소하지 않는다.

<a id="dev-25-local-qa"></a>

## 2026-11-16 · DEV-25 전체 삭제의 로컬 검증

- 승인: [이번 사용자 D1/Brief](../development/figma-v01/tasks/DEV-25.md#dev-25-brief)의 로컬 mock·HTTP 대역 선행과 실제 삭제·30일 파기 QA 차단 유지. 실제 업무 서버/계정/문서/티켓/파일/OCR/기관/삭제·worker·외부 메시지/운영/배포0건이다.
- 환경: branch `feat/dev-25-document-delete`, base `cef469dcd8e70c372f6572bc2b00c7df5b18adf7` 이후 DEV-25 diff. Node22.20.0/pnpm11.3.0·Next16.2.9/Aside Chromium, desktop1440×1000·mobile375×812. `.env` 없는 격리 실행본의 mock `http://127.0.0.1:3025`/회사 documents·합성 계정1, HTTP `http://127.0.0.1:3026`→loopback4325의 합성 auth/문서·68byte PNG만 사용했다.
- 현행 source: [삭제 service](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/application/service/companydocument/DeleteCompanyDocumentService.kt)·[권한/row lock/재삭제 persistence](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companydocument/CompanyDocumentDeletionPersistenceAdapter.kt)·[파기](https://github.com/mate-pjt/mate-backend/blob/adc0e265ef0e2aa78ccb376e1fa322edd664b290/mate-api/src/main/java/kr/co/mate/mate_api/adapter/out/persistence/companydocument/CompanyDocumentPurgePersistenceAdapter.kt), dev `adc0e265`/main `4b5f31de`·중앙 main `c9e50ff5`. [배포 run43389204151](https://github.com/mate-pjt/mate-backend/actions/runs/43389204151)의 dev SHA/completed/success·Aside 개발 OpenAPI GET200/3.1.0/v1을 확인했다. 실행process SHA/실제 wire·권한/업무 응답은 별개 미확인이다.

| 로컬 사례 | 근거 종류 | 조작·확인 결과 | 실제 QA 연결 |
| --- | --- | --- | --- |
| DBOX-DEL01 | Next HTTP 브라우저/receipt | 확인 후 Escape·돌아가기: DELETE0, dialog 제거·‘지우기’ 초점 복귀. 제출 전 취소는 상세 reload 없음 | DBOX-17/22 |
| DBOX-DEL02 | Next 전체 mock | 이전v1 선택 뒤 전체 삭제·Enter 확정, 목록으로 이동·완료 Toast1/이력 UI0. reload 뒤 Toast0·삭제 상태 유지 | DBOX-17 |
| DBOX-DEL03 | Next HTTP/Node | 원본 DOM/Blob 생성 뒤 확인 열기에서 revoke1·preview region0. 지연 DELETE 중 Enter2회에도 명령1/Toast1·목록 복귀 | DBOX-17/19 |
| DBOX-DEL04 | Next HTTP | DELETE404: 완료/Toast0·현재 상태 확인만, 없는/권한 없음을 임의 완료로 바꾸지 않음 | DBOX-18 |
| DBOX-DEL05 | Next HTTP | DELETE409: 변경 안내·명시 GET/새 확인, 자동 재삭제0 | DBOX-18/19 |
| DBOX-DEL06 | Next HTTP/Node |408/503: 미확정·Toast0·삭제 버튼 제거. 앱 제출1회/자동 재삭제0,503 wire1·408 wire3을 관찰해 아래 전송 한계로 구분 | DBOX-18 |
| DBOX-DEL07 | Next HTTP | 서버는 삭제했지만200의 purgeAt가 없으면 미확정/Toast0.2xx만으로 완료하지 않음 | DBOX-18 |
| DBOX-DEL08 | Next HTTP | 명령의 최종401: 로그인 안내/완료0·기존 다운로드/보호 상세0. 기존 공통 refresh1회 뒤 두 번째401과 앱 재삭제를 구분 | DBOX-18/21 |
| DBOX-DEL09 | Next HTTP | 삭제200 뒤 목록503: 완료와 갱신 실패 분리·상세/다운로드0, ‘목록 다시 확인’은 GET만·DELETE1 | DBOX-18 |
| DBOX-DEL10 | Next HTTP | 삭제200 뒤 목록의 refresh/최종401: 완료 유지·로그인 CTA, 재삭제/보호 자료0 | DBOX-18/21 |
| DBOX-DEL11 | Next HTTP | 삭제200 뒤 refresh 세션 해제: 상위 완료 notice+로그인·다운로드0. 계정 자료를 되살리거나 성공을 취소하지 않음 | DBOX-18/21 |
| DBOX-DEL12 | Next HTTP/Node | 지연 삭제 중 페이지 이탈: request abort/dispose·이전 화면의 늦은 Toast/상세 복귀0. 서버에서 삭제가 취소됐다고 주장하지 않음 | DBOX-19/21 |
| DBOX-DEL13 | Next mock 시각/키보드 |375px overflow0·닫기/Escape 초점 복귀·Enter 확정, desktop/mobile 캡처를 직접 확인 | DBOX-22 |
| DBOX-DEL14 | Node controller | 계정/epoch/dispose·제출 직전 회사 변경은 늦은 완료/후속 조회 차단, company 포트와 auth nullable 회사 분리·미귀속 owner | DBOX-21 |
| DBOX-DEL15 | Node mock/storage | factory/reload·31일 뒤 재삭제도 동일 시각, 다른 계정/영역 보존·손상 deletion은 회사 공간만 초기화. worker 실행 아님 | DBOX-18/20/21 |
| DBOX-DEL16 | Node mock/HTTP·source 검토 | 직접 assertion: 전체 version metadata/원본·교체 candidate/handle·completion/processing/retry 차단·list count 감소·인증 상태 유지. proposal/등록 replay 차단은 owning source guard 검토 근거 | DBOX-19/20 |
| DBOX-DEL17 | Next/Node | 삭제 후 새 metadata/원본404·목록·이력 부활 없음. 원본 URL/파일·API 응답을 mock storage로 복사하지 않음 | DBOX-19/21 |
| DBOX-DEL18 | source 검토 |30일은 비동기 파기 대상·기존 티켓 잔여/사용자 복원 없음·근거 참조 해제와 인증 자동 강등 구분. 실제 worker/보존 결과 PASS 아님 | DBOX-20 |

- 자동 검증: `pnpm test`699/699·26파일, `pnpm lint`, API/mock/hybrid Preview `pnpm build`, `pnpm build-storybook` PASS. 단독 type-check/format script는 없으며 diff/문서·두 리뷰·최종 CI는 [Task](../development/figma-v01/tasks/DEV-25.md)와 검토 기록에서 구분한다.
- 실패/교정은 [Task 체크포인트](../development/figma-v01/tasks/DEV-25.md#dev-25-brief)에 보존한다. 자동 수정3/3 뒤 계획 검증이 통과했다. Aside의1px 합성 이미지 AX visibility 대기 한계는 DOM1/Blob revoke1·preview region0으로 확인했고 기존 원본 뷰어 전수 검증으로 확대하지 않는다. Toast는 ‘알림’ region 안에서 계수한다. 성공 후 화면 제목과 Toast가 같은 문구여서 전역 text2개를 Toast2회로 세지 않는다.
- [desktop 캡처](dev-25-delete-desktop.png)·[mobile 캡처](dev-25-delete-mobile.png)는 합성 자료이며 Figma [상세3135:75782](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3135-75782)의 지우기 위치와 [완료 Toast3191:56241](https://www.figma.com/design/Eayi1SWD8Xq8tGBmlp5SV2/?node-id=3191-56241)의 기존 스타일에 연결한다. 원문의 미인증 문구는 POL-13 D2 의미와 맞지 않아 삭제 사실만 알린다. 기능 의미의 차이이며 전체 화면 예외 승인/전수 pixel PASS가 아니다. 새 확인은 기존 BasicPopup을 구성했다.
- Aside request 이벤트는 지원되지 않아 전체 mock의 외부 resource는 브라우저 performance origin 관찰0과 source/계약 테스트로 확인했다. packet 전수 계측으로 주장하지 않는다. loopback receipt는 비민감 method/path/status만 보존하고 header/token·원본 URL/내용을 저장하지 않는다. VoiceOver·실제 기기/Safari·실제 storage CORS/권한·장기 worker는 미실행이다.
- 전송 한계:408 fixture에서 Chromium이 같은 body 없는 DELETE를 wire3회 전송했다. 앱 controller/Node 대역의 제출1회·자동 재삭제0과 브라우저 HTTP 전송 재시도를 구분하며 wire1회를 보장하지 않는다.401은 기존 공통 refresh 후2회, 나머지 오류/지연·성공 뒤 조회 사례는 각 DELETE1회다. 서버의 row lock/권한 있는 재삭제 동일 결과를 source로 확인했지만 실제408/응답 유실·중복 안전성은 DBOX-18의 실제 차단으로 유지한다.

### DEV-25 실제 API 재개 조건 · 당시0통과/6차단

DBOX-17~22는 **실제0통과·6차단**이며 그 중21/22는 기존 공통 차단과 겹친다. DEV-22~24의 고유17차단에 새17~20을 합쳐 원본22개는 **고유0통과·21차단·1대기(16)**다. 원본 미실행 계획·이전 날짜별 QA/가입/회사·DEV-08/MAT-162·각 Task 예외는 보존한다.

- Backend 실행/권한·storage 담당과 QA 자원/사용 승인 담당이 현재 실행 SHA·실제 wrapper/상태/오류·leaf/owner·동시 교체/삭제/티켓의 lock 의미를 확인한다. 개인/일정은 미확인, 마지막 확인일2026-11-16이다.
- 폐기 가능한 현재/과거/진행 version series와 두 계정/회사·권한 없음/상실·안전한 사용/삭제/잔존/복구 범위를 준비한다. 비밀값/실제 개인정보·원본은 채팅/문서로 요구하지 않는다.
- 삭제 즉시 새 접근 배제·기발급 티켓 잔여·격리 worker의30일 이후 지연/재시도·전체 object/OCR 파기/tombstone·근거 참조 해제와 인증 상태를 실제 비식별 결과로 검증한다. 운영 worker/시간 이동·실제 삭제는 이번 D1의 승인 범위 밖이다. 로컬 PASS/main 반영은 재개 조건을 해소하지 않는다.

# 79개 항목 → 실행 작업 연결표

2026-10-27 보고서의 79개 ID를 그대로 보존한다. UI/동작/데이터·검증은 기준선이며 **실시간 작업 상태는 [WBS](README.md)**에서만 관리한다. 원본 상세 근거는 [audit-data.json](baseline/audit-data.json)과 각 작업 기록에 있다.

개발 열이 비어 있으면 현재 추가 개발을 확정하지 않았다는 뜻이다. 이미 구현된 기능은 검증으로, 정책 유지/범위 제외가 가능한 항목은 결정으로 연결한다. 한 항목에 여러 작업이 있어도 중복 개발을 뜻하지 않는다. C02는 연결이 필요한 도메인에서 재사용하며 모든 팝업을 의무적으로 활성화하지 않는다.

| ID · 항목 | 원본 순위 | 기준선 UI / 동작 / 데이터 | 당시 검증 | 개발(현행 연결) | 검증(현행 연결) | 정책 결정(현행 연결) |
| --- | --- | --- | --- | --- | --- | --- |
| **H01** · 홈 랜딩·소개·상단 이동 | P3 | 구현 / 구현 / 정적 | 새 mock 브라우저 | [DEV-58](tasks/DEV-58.md) | [QA-15](tasks/QA-15.md) | [POL-29](tasks/POL-29.md) |
| **H02** · 전체 입찰공고 9개 카드·상세 이동 | P0 | 구현 / 구현 / API·mock | 새 mock 브라우저·계약 테스트 | [DEV-65](tasks/DEV-65.md) | [QA-01](tasks/QA-01.md) / [QA-16](tasks/QA-16.md) | — |
| **H03** · 맞춤 공고 확인 CTA | P1 | 구현 / 목적지 일부 / 인증 연결 | 새 mock 로그인·복귀 확인 | [DEV-03](tasks/DEV-03.md) / [DEV-58](tasks/DEV-58.md) | — | [POL-02](tasks/POL-02.md) / [POL-29](tasks/POL-29.md) |
| **H04** · 푸터 정보·약관·고객문의 | P0 | 빈 영역 / 미연결 / 없음 | 코드·홈 캡처 대조 | [DEV-02](tasks/DEV-02.md) | [QA-16](tasks/QA-16.md) | [POL-01](tasks/POL-01.md) |
| **L01** · 전체·마감임박·개찰결과 목록 | P0 | 구현 / 구현 / API·mock | 새 mock 목록·개찰 확인 | [DEV-65](tasks/DEV-65.md) | [QA-02](tasks/QA-02.md) / [QA-16](tasks/QA-16.md) | — |
| **L02** · 맞춤 입찰공고 목록 | P1 | 준비 중 / 미구현 / 연결 없음 | 새 mock 로그인 후 placeholder 확인 | [DEV-03](tasks/DEV-03.md) | — | [POL-02](tasks/POL-02.md) |
| **L03** · 공고명·번호·기관 검색·초기화 | P0 | 구현 / 구현 / API·mock | 새 mock 검색·0건 확인 | [DEV-65](tasks/DEV-65.md) | [QA-02](tasks/QA-02.md) / [QA-16](tasks/QA-16.md) | — |
| **L04** · 최근·추천 검색어 팝업 | P3 | 없음 / 보류 / 공급원·저장 정책 미정 | 코드 대조 | [DEV-47](tasks/DEV-47.md) | — | [POL-23](tasks/POL-23.md) |
| **L05** · 공사·용역·물품 / 지역·업종·계약 기본 필터 | P1 | 구현 / 기본 선택 구현 / API·mock | 코드 대조 | [DEV-55](tasks/DEV-55.md) | [QA-02](tasks/QA-02.md) | [POL-29](tasks/POL-29.md) |
| **L06** · 기간·금액 preset 필터 | P1 | 구현 / 구현 / API·mock | 코드 대조 | — | [QA-02](tasks/QA-02.md) | — |
| **L07** · 지역 업체·공동도급 등 고급 지역 조건 | P2 | 비활성 / 미연결 / 모델 일부 지원 | 코드 대조 | [DEV-09](tasks/DEV-09.md) | — | [POL-07](tasks/POL-07.md) |
| **L08** · 날짜 기준 선택·직접 기간 입력 | P2 | 비활성 / 미연결 / 모델·URL 지원 | 코드 대조 | [DEV-10](tasks/DEV-10.md) | — | [POL-07](tasks/POL-07.md) |
| **L09** · 금액 종류·직접 최소/최대 입력 | P2 | 비활성 / 미연결 / 모델·URL 지원 | 코드 대조 | [DEV-11](tasks/DEV-11.md) | — | [POL-07](tasks/POL-07.md) |
| **L10** · 개찰결과 낙찰금액 필터 | P2 | 준비 중 / 보류 / 프론트 연결 없음 | 새 mock 비활성 확인 | [DEV-12](tasks/DEV-12.md) | — | [POL-07](tasks/POL-07.md) |
| **L11** · 개인 필터 조회·수동 적용·계정 저장·초기화·409 | P0 | 구현 / 구현 / API·mock | 계약 테스트·기존 QA 기록 | [DEV-45](tasks/DEV-45.md) / [DEV-55](tasks/DEV-55.md) / [DEV-63](tasks/DEV-63.md) | [QA-10](tasks/QA-10.md) / [QA-16](tasks/QA-16.md) | [POL-22](tasks/POL-22.md) / [POL-29](tasks/POL-29.md) |
| **L12** · 페이지 수·페이지 이동·빈 결과·오류 | P0 | 구현 / 구현 / API·mock | 새 mock 0건·개찰·목록 확인 | [DEV-65](tasks/DEV-65.md) | [QA-02](tasks/QA-02.md) / [QA-16](tasks/QA-16.md) | — |
| **D01** · 공사·용역·물품 상세와 분류 선택 | P0 | 구현 / 구현 / API·mock | 새 mock 상세·계약 테스트 | [DEV-64](tasks/DEV-64.md) | [QA-03](tasks/QA-03.md) / [QA-16](tasks/QA-16.md) | [POL-29](tasks/POL-29.md) |
| **D02** · 금액 숫자/억·만 표시 전환 | P2 | 구현 / 구현 / 상세 데이터 사용 | 새 mock 전환 확인 | [DEV-64](tasks/DEV-64.md) | [QA-03](tasks/QA-03.md) | [POL-29](tasks/POL-29.md) |
| **D03** · 공고 링크 복사·나라장터 원문 링크 | P2 | 구현 / 구현 / 상세 데이터 사용 | 코드 대조 | — | [QA-03](tasks/QA-03.md) | — |
| **D04** · 공고별 알림 조회·설정·해제 팝업 | P0 | 구현 / 구현 / API·mock | 새 mock 설정·새로고침 확인 | [DEV-62](tasks/DEV-62.md) | [QA-09](tasks/QA-09.md) / [QA-16](tasks/QA-16.md) | — |
| **D05** · 정정·취소·재입찰 상태 표시 | P2 | 구현 / 구현 / API·mock | 코드 대조 | — | [QA-03](tasks/QA-03.md) | — |
| **D06** · 이전 공고·정정 이력 목록/선택 | P2 | 공용 팝업만 / 실제 상세 미연결 / 과거 이력 계약 미연결 | 코드 대조 | [DEV-13](tasks/DEV-13.md) | — | [POL-08](tasks/POL-08.md) |
| **D07** · 개찰결과·회차·참여업체·1~3순위 | P0 | 구현 / 구현 / API·mock | 계약 테스트·코드 대조 | — | [QA-03](tasks/QA-03.md) / [QA-16](tasks/QA-16.md) | — |
| **D08** · 물품 품목·합계·페이지 | P0 | 구현 / 구현 / API·mock | 코드 대조 | — | [QA-03](tasks/QA-03.md) / [QA-16](tasks/QA-16.md) | — |
| **D09** · 첨부 미리보기/다운로드·관련 공고 | P0 | 구현 / 구현 / API·mock | mock 상세·계약 테스트 | [DEV-61](tasks/DEV-61.md) | [QA-03](tasks/QA-03.md) / [QA-16](tasks/QA-16.md) | [POL-30](tasks/POL-30.md) |
| **D10** · 지시사항/원문 본문·현장설명일·수집 기준일 | P2 | 대체/일부 없음 / 미제공 부분 있음 / 프론트 모델 없음 | 코드 대조 | [DEV-14](tasks/DEV-14.md) | — | [POL-09](tasks/POL-09.md) |
| **M01** · 미연결 회사·두 시작 선택지 | P0 | 구현 / 구현 / API·mock | 새 mock 미연결·선택 확인 | — | [QA-05](tasks/QA-05.md) / [QA-16](tasks/QA-16.md) | — |
| **M02** · 회사 소속 신청 조회·대기/거절/취소/승인지연 | P0 | 구현 / 조회 구현 / API·mock | 계약 테스트·기존 시뮬레이션 기록 | — | [QA-05](tasks/QA-05.md) / [QA-16](tasks/QA-16.md) | — |
| **M03** · 연결 회사의 기본 정보 | P1 | 구현 / 조회 구현 / API·mock | 코드·mock 등록 후 확인 | [DEV-08](tasks/DEV-08.md) / [DEV-60](tasks/DEV-60.md) | [QA-05](tasks/QA-05.md) | — |
| **M04** · 가입 후 실적·인증 3종·희망금액 대시보드 | P1 | 없음 / 미구현 / overview 모델에 없음 | 코드 대조 | [DEV-08](tasks/DEV-08.md) | — | [POL-06](tasks/POL-06.md) |
| **M05** · 소속 신청 취소 | P2 | 없음 / 미구현 / 프론트 계약 없음 | 코드 대조 | [DEV-15](tasks/DEV-15.md) | — | [POL-10](tasks/POL-10.md) |
| **U01** · 최근/연도별 회사 정보 갱신 안내 | P2 | 없음 / 미구현 / 프론트 계약 없음 | 코드 대조 | [DEV-17](tasks/DEV-17.md) | — | [POL-12](tasks/POL-12.md) |
| **U02** · 최신 정보 불러오기·변경 비교/선택 적용 | P2 | 없음 / 미구현 / 프론트 계약 없음 | 코드 대조 | [DEV-18](tasks/DEV-18.md) / [DEV-19](tasks/DEV-19.md) | — | [POL-12](tasks/POL-12.md) |
| **U03** · 회사 정보 직접 편집·프로필 변경 | P2 | 없음 / 미구현 / 프론트 계약 없음 | 코드 대조 | [DEV-20](tasks/DEV-20.md) / [DEV-21](tasks/DEV-21.md) | — | [POL-12](tasks/POL-12.md) |
| **F01** · 가입 후 서류함 목록·보유/만료 상태 | P2 | 없음 / 미구현 / 관리 목록 계약 없음 | 코드 대조 | [DEV-22](tasks/DEV-22.md) | — | [POL-13](tasks/POL-13.md) |
| **F02** · 보관 서류 상세·다운로드·수정 이력 | P2 | 없음 / 미구현 / 관리 조회/다운로드 계약 없음 | 코드 대조 | [DEV-23](tasks/DEV-23.md) | — | [POL-13](tasks/POL-13.md) |
| **F03** · 보관 문서 추가·재업로드·삭제 | P2 | 가입 기반 일부 / 관리 흐름 미구현 / 업로드/버전/처리 기반 있음 | 코드 대조 | [DEV-24](tasks/DEV-24.md) / [DEV-25](tasks/DEV-25.md) | — | [POL-13](tasks/POL-13.md) |
| **F04** · 서류 기반 실적·회사정보 반영 | P2 | 가입 기반 일부 / 가입 후 흐름 없음 / 등록 proposal 기반 있음 | 코드 대조 | [DEV-26](tasks/DEV-26.md) | — | [POL-12](tasks/POL-12.md) / [POL-13](tasks/POL-13.md) |
| **T01** · 팀원 목록·역할·상세·정보/권한 변경 | P2 | 메뉴 비활성 / 미구현 / 관리 계약 없음 | 코드 대조 | [DEV-27](tasks/DEV-27.md) / [DEV-28](tasks/DEV-28.md) | — | [POL-14](tasks/POL-14.md) |
| **T02** · 관리자 초대 발송·재발송·취소 | P2 | 없음 / 미구현 / 발송 관리 계약 없음 | 코드 대조 | [DEV-29](tasks/DEV-29.md) / [DEV-30](tasks/DEV-30.md) | — | [POL-14](tasks/POL-14.md) |
| **T03** · 합류 신청 검토·승인/거절 | P2 | 없음 / 미구현 / 프론트 계약 없음 | 코드 대조 | [DEV-31](tasks/DEV-31.md) | — | [POL-14](tasks/POL-14.md) |
| **T04** · 직급 목록·추가·관리 | P2 | 없음 / 미구현 / 프론트 계약 없음 | 코드 대조 | [DEV-32](tasks/DEV-32.md) | — | [POL-14](tasks/POL-14.md) |
| **G01** · 회사 간 통합 요청 발송·상태 | P2 | 메뉴 비활성 / 미구현 / 프론트 계약 없음 | 코드 대조 | [DEV-34](tasks/DEV-34.md) | — | [POL-16](tasks/POL-16.md) |
| **G02** · 받은 통합 요청의 팀원·회사 정보 검토 | P2 | 없음 / 미구현 / 프론트 계약 없음 | 코드 대조 | [DEV-35](tasks/DEV-35.md) | — | [POL-16](tasks/POL-16.md) |
| **G03** · 전체/일부 승인·거절·충돌/완료 | P2 | 없음 / 미구현 / 프론트 계약 없음 | 코드 대조 | [DEV-36](tasks/DEV-36.md) / [DEV-37](tasks/DEV-37.md) | — | [POL-16](tasks/POL-16.md) |
| **A01** · 내 알림 설정 공고 전체/분류별 관리 목록 | P1 | 메뉴 비활성 / 미구현 / 개별 설정만 있음 | 코드 대조 | [DEV-04](tasks/DEV-04.md) / [DEV-62](tasks/DEV-62.md) | — | [POL-03](tasks/POL-03.md) |
| **A02** · 알림 등록 일괄 선택·해제·완료 | P1 | 없음 / 미구현 / 단건 해제 기반 있음 | 코드 대조 | [DEV-05](tasks/DEV-05.md) | — | [POL-03](tasks/POL-03.md) |
| **S01** · 설정 첫 화면·메뉴·로그아웃 | P2 | 구현 / 일부 구현 / 인증 연결 | 새 mock 메뉴 확인 | [DEV-56](tasks/DEV-56.md) | [QA-14](tasks/QA-14.md) | [POL-29](tasks/POL-29.md) |
| **S02** · 계정 정보 조회/관리 | P2 | 카드만 / 미구현 / 관리 계약 없음 | 코드 대조 | [DEV-38](tasks/DEV-38.md) | — | [POL-17](tasks/POL-17.md) |
| **S03** · 계정 탈퇴·확인·인증·철회 | P2 | 공용 팝업만 / 실제 계정 흐름 없음 / 탈퇴 계약 없음 | 코드 대조 | [DEV-39](tasks/DEV-39.md) / [DEV-40](tasks/DEV-40.md) | — | [POL-18](tasks/POL-18.md) |
| **S04** · 맞춤 이메일 ON/OFF | P0 | 구현 / 구현 / API·mock | 기존 live 일부 통과·새 mock 확인 | [DEV-62](tasks/DEV-62.md) / [DEV-66](tasks/DEV-66.md) | [QA-12](tasks/QA-12.md) / [QA-16](tasks/QA-16.md) | [POL-29](tasks/POL-29.md) |
| **S05** · 대체 이메일 인증·재전송·전환 | P0 | 구현 / 구현 / API·mock | 계약 테스트·새 mock 확인 | — | [QA-13](tasks/QA-13.md) / [QA-16](tasks/QA-16.md) | — |
| **S06** · 야간 수신·전역 공고 상세 알림 토글 | P2 | 현재 정책상 없음 / 정책 차이 / 정책에서 제외 | 현재 mate-docs 알림 정책 재확인 | [DEV-66](tasks/DEV-66.md) | — | [POL-19](tasks/POL-19.md) / [POL-29](tasks/POL-29.md) |
| **S07** · 서비스 이용안내 진입 | P3 | 카드만 / 미연결 / 내용/경로 미정 | 코드 대조 | [DEV-49](tasks/DEV-49.md) | — | [POL-25](tasks/POL-25.md) |
| **S08** · 의견 보내기·문의 경로 | P3 | 배너만 / 비활성 / 연결 없음 | 코드 대조 | [DEV-50](tasks/DEV-50.md) | — | [POL-26](tasks/POL-26.md) |
| **S09** · mock 이메일 인증 시간 정책 | P2 | 구현 / 정책과 다름 / mock 10분/30초 | 현재 mate-docs §7 대조 | [DEV-41](tasks/DEV-41.md) | — | [POL-19](tasks/POL-19.md) |
| **N01** · 받은 알림 목록·읽음·건수·20건 더 보기 | P0 | 구현 / 구현 / API·mock | 새 mock 20→25·22→21·reload 확인 | — | [QA-11](tasks/QA-11.md) / [QA-16](tasks/QA-16.md) | — |
| **N02** · 받은 알림 편집·선택·삭제 | P2 | 준비 중 / 보류 / 삭제 계약 미연결 | 새 mock 비활성 확인 | [DEV-43](tasks/DEV-43.md) / [DEV-62](tasks/DEV-62.md) | — | [POL-20](tasks/POL-20.md) |
| **N03** · 알림에서 대상 공고·회사·소식 이동 | P1 | 없음 / 읽음만 / DTO actionPath 버림 | 새 mock 클릭 후 /alarms 유지 | [DEV-06](tasks/DEV-06.md) | — | [POL-04](tasks/POL-04.md) |
| **N04** · 새 알림 자동 반영·재연결 갱신 | P1 | 없음 / 미구현 / REST만 | 코드 및 현재 mate-docs §9 대조 | [DEV-07](tasks/DEV-07.md) | — | [POL-05](tasks/POL-05.md) |
| **Q01** · FAQ 5개·독립 아코디언·상단 이동 | P3 | 구현 / 구현 / static 콘텐츠 | 기존 QA 7통과·새 mock 재확인 | — | [QA-15](tasks/QA-15.md) | — |
| **W01** · 메이트 소식 목록·업데이트/공지 필터 | P3 | 없음 / 미구현 / 프론트 공급원 없음 | 코드 대조 | [DEV-51](tasks/DEV-51.md) | — | [POL-27](tasks/POL-27.md) |
| **W02** · 소식 상세·목록 복귀 | P3 | 없음 / 미구현 / 프론트 계약 없음 | 코드 대조 | [DEV-52](tasks/DEV-52.md) | — | [POL-27](tasks/POL-27.md) |
| **O01** · Google 로그인·가입·callback·세션/로그아웃 | P0 | 구현 / 구현 / API·mock | 계약 테스트·새 mock 로그인/복귀 | [DEV-56](tasks/DEV-56.md) / [DEV-57](tasks/DEV-57.md) | [QA-04](tasks/QA-04.md) / [QA-16](tasks/QA-16.md) | [POL-29](tasks/POL-29.md) |
| **O02** · 네이버 로그인 | P3 | 준비 중 / 보류 / 프론트 연결 없음 | 코드 대조 | [DEV-48](tasks/DEV-48.md) | — | [POL-24](tasks/POL-24.md) |
| **O03** · 필수 약관 동의·본문 | P0 | 동의 UI 구현 / 테스트 동의 구현 / 임시 본문/버전 | 코드 대조 | [DEV-01](tasks/DEV-01.md) | [QA-16](tasks/QA-16.md) | [POL-01](tasks/POL-01.md) |
| **O04** · 바로 시작·회사 찾기·등록 선택 | P0 | 구현 / 구현 / 인증·회사 연결 | 코드 대조 | [DEV-57](tasks/DEV-57.md) | [QA-04](tasks/QA-04.md) / [QA-16](tasks/QA-16.md) | [POL-29](tasks/POL-29.md) |
| **O05** · 기존 회사 검색·소속 신청·대표/팀원 입력 | P0 | 구현 / 구현 / API·mock | 코드 대조 | [DEV-57](tasks/DEV-57.md) | [QA-05](tasks/QA-05.md) / [QA-16](tasks/QA-16.md) | — |
| **O06** · 사업자번호 조회·처리·등록 | P0 | 구현 / 구현 / API·mock | 계약 테스트·새 mock 경로 확인 | [DEV-59](tasks/DEV-59.md) | [QA-06](tasks/QA-06.md) / [QA-16](tasks/QA-16.md) | — |
| **O07** · 증명서 업로드·OCR·재시도·충돌·등록 | P0 | 구현 / 구현 / API·mock | 계약 테스트·기존 mock QA | [DEV-59](tasks/DEV-59.md) | [QA-07](tasks/QA-07.md) / [QA-16](tasks/QA-16.md) | — |
| **O08** · 조회 실적·인증 표시·대표/직급·희망금액 | P1 | 구현 / 구현 / API·mock | 코드 대조 | [DEV-08](tasks/DEV-08.md) / [DEV-59](tasks/DEV-59.md) | [QA-06](tasks/QA-06.md) / [QA-07](tasks/QA-07.md) | — |
| **O09** · 가입 중 실적·인증 직접 수정 | P2 | 비활성 / 보류 / 프론트 수정 계약 없음 | 코드 대조 | [DEV-44](tasks/DEV-44.md) | — | [POL-21](tasks/POL-21.md) |
| **O10** · 초대 preview·계정 불일치·수락/거절 | P0 | 구현 / 구현 / API·mock | 코드 대조 | [DEV-57](tasks/DEV-57.md) | [QA-08](tasks/QA-08.md) / [QA-16](tasks/QA-16.md) | — |
| **O11** · 초대 수락 후 팀원 화면 이동 | P2 | 완료 화면 있음 / /bids로 대체 / 팀원 관리 미구현 | 코드 대조 | [DEV-33](tasks/DEV-33.md) | — | [POL-15](tasks/POL-15.md) |
| **C01** · 색상·서체·버튼·입력·선택·체크·탭·카드·토스트 | P3 | 공용 기반 구현 / 대부분 소비됨 / 표시 컴포넌트 | 정적·대표 시각 비교 | [DOC-002](tasks/DOC-002.md) / [DEV-55](tasks/DEV-55.md) / [DEV-56](tasks/DEV-56.md) / [DEV-57](tasks/DEV-57.md) / [DEV-64](tasks/DEV-64.md) / [DEV-62](tasks/DEV-62.md) / [DEV-66](tasks/DEV-66.md) | [QA-15](tasks/QA-15.md) | [POL-29](tasks/POL-29.md) |
| **C02** · 정정·비밀번호·탈퇴·업로드 공용 팝업 | P2 | 컴포넌트 구현 / 일부 Storybook 전용 / 업무 API 없음 | 코드 대조 | [DEV-13](tasks/DEV-13.md) / [DEV-24](tasks/DEV-24.md) / [DEV-39](tasks/DEV-39.md) | — | [POL-08](tasks/POL-08.md) / [POL-17](tasks/POL-17.md) / [POL-18](tasks/POL-18.md) |
| **C03** · OG 썸네일·브랜드 공유 메타데이터 | P3 | 기본 metadata / 시안 이미지 미연결 / 정적 | 코드 대조 | [DEV-53](tasks/DEV-53.md) | — | [POL-28](tasks/POL-28.md) |
| **C04** · 상세 main 랜드마크 중첩 | P3 | 중첩됨 / 시각 동작은 가능 / 없음 | 브라우저 strict locator와 코드로 확인 | [DEV-54](tasks/DEV-54.md) | — | — |
| **M06** · 회사 등록·찾기의 기존 온보딩 재사용 | P2 | 동등 흐름 재사용 / /auth/**로 이동 / 기존 회사 Repository | 새 mock 진입 및 코드 대조 | [DEV-16](tasks/DEV-16.md) | — | [POL-11](tasks/POL-11.md) |

원본 ID 79개·중복 ID 없음·연결 누락 없음. 신규 요구는 원본 JSON 수정 대신 새 작업과 변경 사유를 추가한다.

## 2026-11-11 전수 점검 추가 연결

기준선의 UI/동작/데이터·당시 검증 열은2026-10-27 당시 관찰로 유지한다. 위 개발/검증/정책 열만 새 작업을 추가했다. 새 날짜의 실제 관찰과 판정은 [감사 보고서](audits/2026-11-11.md)·[20route/23발견·API 인덱스](audits/2026-11-11.json)에 있다. 원본79개 JSON을 현재 결과로 덮어쓰지 않는다.

| 감사 발견 | 수정/결정의 주 소유 | 관련 정책/개발/QA | 원본 연결 | 판정 |
| --- | --- | --- | --- | --- |
| [CF-01 · 개인 필터의 내 맞춤 위치·저장/초기화 구성](audits/2026-11-11.md#cf-01) | [DEV-55](tasks/DEV-55.md) | [POL-29](tasks/POL-29.md) / [POL-02](tasks/POL-02.md) / [QA-10](tasks/QA-10.md) | L11, L05, C01 | UI 차이·시각 승인 미확인 |
| [CF-02 · 공통 헤더의 회사/사용자 표시와 상태 표현](audits/2026-11-11.md#cf-02) | [DEV-56](tasks/DEV-56.md) | [POL-29](tasks/POL-29.md) / [DEV-51](tasks/DEV-51.md) / [QA-14](tasks/QA-14.md) | C01, S01, O01 | UI 차이·표시 계약 결정 필요 |
| [CF-03 · 가입·시작 선택 화면의 프레임별 폭·인사말·입력 형태](audits/2026-11-11.md#cf-03) | [DEV-57](tasks/DEV-57.md) | [POL-29](tasks/POL-29.md) / [QA-04](tasks/QA-04.md) / [QA-05](tasks/QA-05.md) / [QA-08](tasks/QA-08.md) | O01, O04, O05, O10, C01 | UI 차이·시각 승인 미확인 |
| [CF-04 · 홈 소개/CTA가 현재 제공 기능과 맺는 관계](audits/2026-11-11.md#cf-04) | [DEV-58](tasks/DEV-58.md) | [POL-29](tasks/POL-29.md) / [DEV-03](tasks/DEV-03.md) / [DEV-07](tasks/DEV-07.md) / [QA-01](tasks/QA-01.md) | H01, H03 | 기능 안내의 정책 결정 필요 |
| [CF-05 · 가입 회사 mock의 연도·면허·인증 근거 계약](audits/2026-11-11.md#cf-05) | [DEV-59](tasks/DEV-59.md) | [QA-06](tasks/QA-06.md) / [QA-07](tasks/QA-07.md) / [POL-06](tasks/POL-06.md) | O06, O07, O08 | mock 기능/계약 불일치 |
| [CF-06 · 연결 회사 기본 정보의 복수 주력업종 누락](audits/2026-11-11.md#cf-06) | [DEV-60](tasks/DEV-60.md) | [DEV-08](tasks/DEV-08.md) / [POL-06](tasks/POL-06.md) / [QA-05](tasks/QA-05.md) | M03 | 실제 표시/계약 불일치 |
| [CF-07 · 관련 공고 mock이 같은 업종/품목 정책을 지키지 않음](audits/2026-11-11.md#cf-07) | [DEV-61](tasks/DEV-61.md) | [POL-30](tasks/POL-30.md) / [QA-03](tasks/QA-03.md) | D09 | mock 기능/정책 불일치 |
| [CF-08 · 공고별 내부 알림과 이메일/관리 화면을 혼동시키는 안내](audits/2026-11-11.md#cf-08) | [DEV-62](tasks/DEV-62.md) | [POL-19](tasks/POL-19.md) / [POL-20](tasks/POL-20.md) / [DEV-04](tasks/DEV-04.md) / [DEV-43](tasks/DEV-43.md) / [QA-09](tasks/QA-09.md) | D04, A01, N02, S04, C01 | 현재 기능 안내 불일치 |
| [CF-09 · reset의 빈 SAVED 정책과 mock/HTTP 대역 EMPTY_DEFAULT](audits/2026-11-11.md#cf-09) | [DEV-63](tasks/DEV-63.md) | [POL-02](tasks/POL-02.md) / [QA-10](tasks/QA-10.md) / [DEV-45](tasks/DEV-45.md) | L11 | 기존 Major의 수정 소유 Task 누락 |
| [CF-10 · 상세의 폭·단위 전환 위치·추가 분류 UI](audits/2026-11-11.md#cf-10) | [DEV-64](tasks/DEV-64.md) | [POL-29](tasks/POL-29.md) / [DEV-54](tasks/DEV-54.md) / [POL-08](tasks/POL-08.md) / [POL-09](tasks/POL-09.md) / [QA-03](tasks/QA-03.md) | D01, D02, C01 | UI 차이·시각 승인 미확인 |
| [CF-11 · 공개 목록/홈 mock의 검색 범위와 ALL 대상](audits/2026-11-11.md#cf-11) | [DEV-65](tasks/DEV-65.md) | [QA-01](tasks/QA-01.md) / [QA-02](tasks/QA-02.md) | H02, L01, L03, L12 | mock 기능/정책 불일치 |
| [CF-12 · 고급 지역 필터와 mock의 의미 차이](audits/2026-11-11.md#cf-12) | [DEV-09](tasks/DEV-09.md) | [POL-07](tasks/POL-07.md) / [QA-02](tasks/QA-02.md) | L07 | 기존 Task 완료 기준 보완 |
| [CF-13 · 직접 날짜/금액·낙찰금액 필터](audits/2026-11-11.md#cf-13) | [DEV-10](tasks/DEV-10.md) | [DEV-11](tasks/DEV-11.md) / [DEV-12](tasks/DEV-12.md) / [POL-07](tasks/POL-07.md) | L08, L09, L10 | 기존 계획·계약 보류 유지 |
| [CF-14 · 알림 설정의3토글 시안과 현행 이메일 정책/인증시간](audits/2026-11-11.md#cf-14) | [POL-19](tasks/POL-19.md) | [DEV-41](tasks/DEV-41.md) / [POL-29](tasks/POL-29.md) / [QA-12](tasks/QA-12.md) / [QA-13](tasks/QA-13.md) | S04, S05, S06, S09 | 정책 근거 있는 기능 차이·mock 차이 잔존 |
| [CF-15 · 회사 소속 신청과 회사 간 통합의 용어/문맥](audits/2026-11-11.md#cf-15) | [POL-11](tasks/POL-11.md) | [DEV-16](tasks/DEV-16.md) / [QA-05](tasks/QA-05.md) | M06, M02, O05 | 기존 정책 Task 보완 |
| [CF-16 · 가입 후 회사 대시보드·갱신·서류·팀원·통합](audits/2026-11-11.md#cf-16) | [DEV-08](tasks/DEV-08.md) | [POL-06](tasks/POL-06.md) / [POL-12](tasks/POL-12.md) / [POL-13](tasks/POL-13.md) / [POL-14](tasks/POL-14.md) / [POL-15](tasks/POL-15.md) / [POL-16](tasks/POL-16.md) / [DEV-17](tasks/DEV-17.md) / [DEV-22](tasks/DEV-22.md) / [DEV-27](tasks/DEV-27.md) / [DEV-34](tasks/DEV-34.md) | M04, U01, U02, U03, F01, F02, F03, F04, T01, T02, T03, T04, G01, G02, G03 | 미구현·기존 계획 연결 확인 |
| [CF-17 · 설정 비활성 카드·FAQ·소식 메뉴](audits/2026-11-11.md#cf-17) | [QA-15](tasks/QA-15.md) | [POL-17](tasks/POL-17.md) / [POL-18](tasks/POL-18.md) / [POL-24](tasks/POL-24.md) / [POL-25](tasks/POL-25.md) / [POL-26](tasks/POL-26.md) / [POL-27](tasks/POL-27.md) / [DEV-38](tasks/DEV-38.md) / [DEV-39](tasks/DEV-39.md) / [DEV-40](tasks/DEV-40.md) / [DEV-48](tasks/DEV-48.md) / [DEV-49](tasks/DEV-49.md) / [DEV-50](tasks/DEV-50.md) / [DEV-51](tasks/DEV-51.md) / [DEV-52](tasks/DEV-52.md) | S02, S03, S07, S08, Q01, W01, W02, O02 | 정책 근거 차이·기존 계획 연결 확인 |
| [CF-18 · 임시 약관·개인정보와 빈 푸터](audits/2026-11-11.md#cf-18) | [POL-01](tasks/POL-01.md) | [DEV-01](tasks/DEV-01.md) / [DEV-02](tasks/DEV-02.md) / [QA-16](tasks/QA-16.md) | H04, O03 | 기존 공개 준비 차단 유지 |
| [CF-19 · 맞춤 입찰공고 목록은 아직 placeholder](audits/2026-11-11.md#cf-19) | [DEV-03](tasks/DEV-03.md) | [POL-02](tasks/POL-02.md) / [DEV-58](tasks/DEV-58.md) / [QA-01](tasks/QA-01.md) | H03, L02 | 기존 계획·계약 차단 유지 |
| [CF-20 · 상세 이력·본문·접근성의 기존 잔여 범위](audits/2026-11-11.md#cf-20) | [DEV-54](tasks/DEV-54.md) | [POL-08](tasks/POL-08.md) / [POL-09](tasks/POL-09.md) / [DEV-13](tasks/DEV-13.md) / [DEV-14](tasks/DEV-14.md) / [QA-03](tasks/QA-03.md) | C04, D06, D10 | 기존 계획 연결·중첩 main 재확인 |
| [CF-21 · 이미 문서화된 삭제·신청취소 API의 계획 입력 갱신](audits/2026-11-11.md#cf-21) | [POL-20](tasks/POL-20.md) | [DEV-43](tasks/DEV-43.md) / [POL-10](tasks/POL-10.md) / [DEV-15](tasks/DEV-15.md) / [QA-11](tasks/QA-11.md) / [QA-05](tasks/QA-05.md) | N02, M05 | 계약 가용성 확인·기능 미연결 |
| [CF-22 · 실제 통합·배포 실행 대응과 상태별 증거 공백](audits/2026-11-11.md#cf-22) | [QA-16](tasks/QA-16.md) | [QA-01](tasks/QA-01.md) / [QA-02](tasks/QA-02.md) / [QA-03](tasks/QA-03.md) / [QA-05](tasks/QA-05.md) / [QA-06](tasks/QA-06.md) / [QA-07](tasks/QA-07.md) / [QA-08](tasks/QA-08.md) / [QA-09](tasks/QA-09.md) / [QA-10](tasks/QA-10.md) / [QA-11](tasks/QA-11.md) / [QA-12](tasks/QA-12.md) / [QA-13](tasks/QA-13.md) / [POL-02](tasks/POL-02.md) / [POL-03](tasks/POL-03.md) / [POL-05](tasks/POL-05.md) / [POL-06](tasks/POL-06.md) / [POL-07](tasks/POL-07.md) | H02, L01, D01, M03, O06, O07, O10, D04, L11, N01, S04, S05 | 실제 QA 차단·한계 보존 |

| [CF-23 · 관련 공고 기준 공고 상태 정책 충돌](audits/2026-11-11.md#cf-23) | [POL-30 v1](tasks/POL-30.md#pol-30-contract) | [DEV-61](tasks/DEV-61.md#dev-61-pol-30-handoff) / [QA-03](tasks/QA-03.md) | D09 | 당시 원문 충돌 보존·사용자 상태 정책/중앙 정정안·후속 검증 연결 |

QA-17은 원본 일부를 새로 구현하는 Task가 아니라 이번 전체 점검/계획 요구의 소유자다. POL-29는 시각 기준/예외 결정, POL-30은 관련 공고 정책 내부 충돌 해소, DEV-55~65는 좁게 분리한 수정 후보다. 기존 미구현·차단/보류를 새 Task로 중복 만들지 않았다. 감사/계획 검토는 원본 항목의 제품 PASS 또는 실제 QA 통과가 아니다.

2026-11-12 POL-30의 [사용자 결정/중앙 정정안](tasks/POL-30.md#pol-30-central-proposal)과 [REL-01~13](tasks/POL-30.md#pol-30-fixtures)을 D09/CF-07·CF-23의 후속 기준으로 연결한다. 원본79개/Task114개/의존성155개와 감사·기존 실제 QA의 이력은 유지한다. 중앙 원문 반영·DEV-61 구현·실제 통합 검증을 수행한 기록이 아니다. 현재/다음/상태는 WBS를 따른다.

2026-11-12 [DEV-61 로컬 검증](tasks/DEV-61.md#dev-61-verification)은 D09/CF-07의 mock 교정과 POL-30 REL-01~13을 연결한다.255 Node tests·세구성 build·실제 Next mock/로컬 HTTP 대역의 범위이며 QA-03의 실제1통과8차단/DETAIL-07과 중앙 미반영·실행 SHA 미확인은 유지한다. 현재/다음/상태는 WBS만 소유한다.

## 2026-11-11 · POL-29 최종 화면 결정 연결

원본79개와 당시 UI/동작/데이터·검증 열은 그대로 보존한다. [POL-29 결정표](tasks/POL-29.md#pol-29-decisions)와 [상태/검증표](tasks/POL-29.md#pol-29-states)에 개별 승인·추천 철회·보류/재개를 연결했다.

- CF-01/10: DEV-55/64의 정렬과 보조행/추가 분류 예외. CF-02/03: DEV-56/57의 Figma 이름·아이콘/프레임별 기준과 이름 계약 보류. CF-04: DEV-58의 기존 CTA/Figma 유지와 최종 문구 Gate.
- CF-14/S04/S06/C01: Figma3설정 구성·미지원 스위치 disabled/tooltip과 프런트 연결 경계는 신규 DEV-66. POL-19는 도메인/활성화 계약, DEV-41은 인증시간, DEV-62는 기존 채널 안내를 유지한다. 기존113Task에 후보1개를 더한114개이며 제품/실제 QA 완료율로 세지 않는다.
- 감사의 당시 ‘시각 승인 미확인’ 판정은 원본 이력으로 보존한다. 현재 선택과 남은 이름/문구/정책/API·실제 QA 한계는 POL-29·소유 Task에서 확인하고 상태는 WBS만 관리한다.

2026-11-13 D06/C02의 [POL-08 정책 v1](tasks/POL-08.md#pol-08-contract)은 동일 번호의 수집 차수·실제 ID의 공고 전체 이동/뒤로 가기와 **전용 backend 계약 선행**을 사용자 결정으로 연결한다. [DEV-13 재개 기준](tasks/DEV-13.md#dev-13-pol-08-handoff)·[HIST-01~12](tasks/POL-08.md#pol-08-dev13-gate)와 기존 [상세 QA 후속 기준](../../qa/bid-detail.md#pol-08-followup)을 참조한다. 공개 GET3건의 계약 조사와 전용 계약/제품 연결/실제 복수 차수 통합은 별개다. 원본79/114Task/155의존성·기준선/감사·기존 QA/차단/예외와 C02의 다른 팝업 소유는 보존한다. 현재/다음/상태는 WBS만 관리한다.


2026-11-13 POL-09의 [추가 제공/계약 선행 결정](tasks/POL-09.md#pol-09-contract)과 [DEV-14 재개 Gate](tasks/DEV-14.md#dev-14-pol-09-handoff)를 D10/CF-10·CF-20의 후속 기준으로 연결한다. 원문 자격사항/지시사항 본문·현장설명 일시·기준일/수집일의 실제 계약은 미확보다. 현재 차이의 Figma 예외 승인은 없고 제품 구현/실제 통합을 수행하지 않았다. 기존 공동수급 협정 마감은 신규 누락으로 세지 않는다. 원본79/114Task/155의존성·기준선/감사/QA 이력·기존 차단/승인 예외를 보존하며 상태는 WBS만 관리한다.

2026-11-13 M05/CF-21의 [POL-10 사용자 확정/정책 v1](tasks/POL-10.md#pol-10-contract)은 본인 PENDING 취소·필수 expectedVersion·승인 경쟁/재조회와 **빈 회사 화면+지정 Figma Sonner 완료 Toast1회**를 연결한다. [DEV-15 후속 Gate](tasks/DEV-15.md#dev-15-pol-10-handoff)·[MCANCEL-01~12](../../qa/my-company.md#pol-10-cancellation-qa)는 후속 개발/검증 기준이며 이번 제품 구현·실제 취소·새 통합 PASS가 아니다. 원본79개/114Task/현행156의존성·기준선/감사·기존 QA-05 MCO4통과6차단/다른 차단·승인 예외를 보존한다. 현재/다음/상태는 WBS만 관리하며 C02의 다른 팝업과 회사 간 통합의 소유 범위를 바꾸지 않는다.

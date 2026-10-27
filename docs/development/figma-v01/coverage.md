# 79개 항목 → 실행 작업 연결표

2026-10-27 보고서의 79개 ID를 그대로 보존한다. UI/동작/데이터·검증은 기준선이며 **실시간 작업 상태는 [WBS](README.md)**에서만 관리한다. 원본 상세 근거는 [audit-data.json](baseline/audit-data.json)과 각 작업 기록에 있다.

개발 열이 비어 있으면 현재 추가 개발을 확정하지 않았다는 뜻이다. 이미 구현된 기능은 검증으로, 정책 유지/범위 제외가 가능한 항목은 결정으로 연결한다. 한 항목에 여러 작업이 있어도 중복 개발을 뜻하지 않는다. C02는 연결이 필요한 도메인에서 재사용하며 모든 팝업을 의무적으로 활성화하지 않는다.

| ID · 항목 | 원본 순위 | 기준선 UI / 동작 / 데이터 | 당시 검증 | 개발 | 검증 | 정책 결정 |
| --- | --- | --- | --- | --- | --- | --- |
| **H01** · 홈 랜딩·소개·상단 이동 | P3 | 구현 / 구현 / 정적 | 새 mock 브라우저 | — | [QA-15](tasks/QA-15.md) | — |
| **H02** · 전체 입찰공고 9개 카드·상세 이동 | P0 | 구현 / 구현 / API·mock | 새 mock 브라우저·계약 테스트 | — | [QA-01](tasks/QA-01.md) / [QA-16](tasks/QA-16.md) | — |
| **H03** · 맞춤 공고 확인 CTA | P1 | 구현 / 목적지 일부 / 인증 연결 | 새 mock 로그인·복귀 확인 | [DEV-03](tasks/DEV-03.md) | — | [POL-02](tasks/POL-02.md) |
| **H04** · 푸터 정보·약관·고객문의 | P0 | 빈 영역 / 미연결 / 없음 | 코드·홈 캡처 대조 | [DEV-02](tasks/DEV-02.md) | [QA-16](tasks/QA-16.md) | [POL-01](tasks/POL-01.md) |
| **L01** · 전체·마감임박·개찰결과 목록 | P0 | 구현 / 구현 / API·mock | 새 mock 목록·개찰 확인 | — | [QA-02](tasks/QA-02.md) / [QA-16](tasks/QA-16.md) | — |
| **L02** · 맞춤 입찰공고 목록 | P1 | 준비 중 / 미구현 / 연결 없음 | 새 mock 로그인 후 placeholder 확인 | [DEV-03](tasks/DEV-03.md) | — | [POL-02](tasks/POL-02.md) |
| **L03** · 공고명·번호·기관 검색·초기화 | P0 | 구현 / 구현 / API·mock | 새 mock 검색·0건 확인 | — | [QA-02](tasks/QA-02.md) / [QA-16](tasks/QA-16.md) | — |
| **L04** · 최근·추천 검색어 팝업 | P3 | 없음 / 보류 / 공급원·저장 정책 미정 | 코드 대조 | [DEV-47](tasks/DEV-47.md) | — | [POL-23](tasks/POL-23.md) |
| **L05** · 공사·용역·물품 / 지역·업종·계약 기본 필터 | P1 | 구현 / 기본 선택 구현 / API·mock | 코드 대조 | — | [QA-02](tasks/QA-02.md) | — |
| **L06** · 기간·금액 preset 필터 | P1 | 구현 / 구현 / API·mock | 코드 대조 | — | [QA-02](tasks/QA-02.md) | — |
| **L07** · 지역 업체·공동도급 등 고급 지역 조건 | P2 | 비활성 / 미연결 / 모델 일부 지원 | 코드 대조 | [DEV-09](tasks/DEV-09.md) | — | [POL-07](tasks/POL-07.md) |
| **L08** · 날짜 기준 선택·직접 기간 입력 | P2 | 비활성 / 미연결 / 모델·URL 지원 | 코드 대조 | [DEV-10](tasks/DEV-10.md) | — | [POL-07](tasks/POL-07.md) |
| **L09** · 금액 종류·직접 최소/최대 입력 | P2 | 비활성 / 미연결 / 모델·URL 지원 | 코드 대조 | [DEV-11](tasks/DEV-11.md) | — | [POL-07](tasks/POL-07.md) |
| **L10** · 개찰결과 낙찰금액 필터 | P2 | 준비 중 / 보류 / 프론트 연결 없음 | 새 mock 비활성 확인 | [DEV-12](tasks/DEV-12.md) | — | [POL-07](tasks/POL-07.md) |
| **L11** · 개인 필터 조회·수동 적용·계정 저장·초기화·409 | P0 | 구현 / 구현 / API·mock | 계약 테스트·기존 QA 기록 | [DEV-45](tasks/DEV-45.md) | [QA-10](tasks/QA-10.md) / [QA-16](tasks/QA-16.md) | [POL-22](tasks/POL-22.md) |
| **L12** · 페이지 수·페이지 이동·빈 결과·오류 | P0 | 구현 / 구현 / API·mock | 새 mock 0건·개찰·목록 확인 | — | [QA-02](tasks/QA-02.md) / [QA-16](tasks/QA-16.md) | — |
| **D01** · 공사·용역·물품 상세와 분류 선택 | P0 | 구현 / 구현 / API·mock | 새 mock 상세·계약 테스트 | — | [QA-03](tasks/QA-03.md) / [QA-16](tasks/QA-16.md) | — |
| **D02** · 금액 숫자/억·만 표시 전환 | P2 | 구현 / 구현 / 상세 데이터 사용 | 새 mock 전환 확인 | — | [QA-03](tasks/QA-03.md) | — |
| **D03** · 공고 링크 복사·나라장터 원문 링크 | P2 | 구현 / 구현 / 상세 데이터 사용 | 코드 대조 | — | [QA-03](tasks/QA-03.md) | — |
| **D04** · 공고별 알림 조회·설정·해제 팝업 | P0 | 구현 / 구현 / API·mock | 새 mock 설정·새로고침 확인 | — | [QA-09](tasks/QA-09.md) / [QA-16](tasks/QA-16.md) | — |
| **D05** · 정정·취소·재입찰 상태 표시 | P2 | 구현 / 구현 / API·mock | 코드 대조 | — | [QA-03](tasks/QA-03.md) | — |
| **D06** · 이전 공고·정정 이력 목록/선택 | P2 | 공용 팝업만 / 실제 상세 미연결 / 과거 이력 계약 미연결 | 코드 대조 | [DEV-13](tasks/DEV-13.md) | — | [POL-08](tasks/POL-08.md) |
| **D07** · 개찰결과·회차·참여업체·1~3순위 | P0 | 구현 / 구현 / API·mock | 계약 테스트·코드 대조 | — | [QA-03](tasks/QA-03.md) / [QA-16](tasks/QA-16.md) | — |
| **D08** · 물품 품목·합계·페이지 | P0 | 구현 / 구현 / API·mock | 코드 대조 | — | [QA-03](tasks/QA-03.md) / [QA-16](tasks/QA-16.md) | — |
| **D09** · 첨부 미리보기/다운로드·관련 공고 | P0 | 구현 / 구현 / API·mock | mock 상세·계약 테스트 | — | [QA-03](tasks/QA-03.md) / [QA-16](tasks/QA-16.md) | — |
| **D10** · 지시사항/원문 본문·현장설명일·수집 기준일 | P2 | 대체/일부 없음 / 미제공 부분 있음 / 프론트 모델 없음 | 코드 대조 | [DEV-14](tasks/DEV-14.md) | — | [POL-09](tasks/POL-09.md) |
| **M01** · 미연결 회사·두 시작 선택지 | P0 | 구현 / 구현 / API·mock | 새 mock 미연결·선택 확인 | — | [QA-05](tasks/QA-05.md) / [QA-16](tasks/QA-16.md) | — |
| **M02** · 회사 소속 신청 조회·대기/거절/취소/승인지연 | P0 | 구현 / 조회 구현 / API·mock | 계약 테스트·기존 시뮬레이션 기록 | — | [QA-05](tasks/QA-05.md) / [QA-16](tasks/QA-16.md) | — |
| **M03** · 연결 회사의 기본 정보 | P1 | 구현 / 조회 구현 / API·mock | 코드·mock 등록 후 확인 | [DEV-08](tasks/DEV-08.md) | [QA-05](tasks/QA-05.md) | — |
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
| **A01** · 내 알림 설정 공고 전체/분류별 관리 목록 | P1 | 메뉴 비활성 / 미구현 / 개별 설정만 있음 | 코드 대조 | [DEV-04](tasks/DEV-04.md) | — | [POL-03](tasks/POL-03.md) |
| **A02** · 알림 등록 일괄 선택·해제·완료 | P1 | 없음 / 미구현 / 단건 해제 기반 있음 | 코드 대조 | [DEV-05](tasks/DEV-05.md) | — | [POL-03](tasks/POL-03.md) |
| **S01** · 설정 첫 화면·메뉴·로그아웃 | P2 | 구현 / 일부 구현 / 인증 연결 | 새 mock 메뉴 확인 | — | [QA-14](tasks/QA-14.md) | — |
| **S02** · 계정 정보 조회/관리 | P2 | 카드만 / 미구현 / 관리 계약 없음 | 코드 대조 | [DEV-38](tasks/DEV-38.md) | — | [POL-17](tasks/POL-17.md) |
| **S03** · 계정 탈퇴·확인·인증·철회 | P2 | 공용 팝업만 / 실제 계정 흐름 없음 / 탈퇴 계약 없음 | 코드 대조 | [DEV-39](tasks/DEV-39.md) / [DEV-40](tasks/DEV-40.md) | — | [POL-18](tasks/POL-18.md) |
| **S04** · 맞춤 이메일 ON/OFF | P0 | 구현 / 구현 / API·mock | 기존 live 일부 통과·새 mock 확인 | — | [QA-12](tasks/QA-12.md) / [QA-16](tasks/QA-16.md) | — |
| **S05** · 대체 이메일 인증·재전송·전환 | P0 | 구현 / 구현 / API·mock | 계약 테스트·새 mock 확인 | — | [QA-13](tasks/QA-13.md) / [QA-16](tasks/QA-16.md) | — |
| **S06** · 야간 수신·전역 공고 상세 알림 토글 | P2 | 현재 정책상 없음 / 정책 차이 / 정책에서 제외 | 현재 mate-docs 알림 정책 재확인 | — | — | [POL-19](tasks/POL-19.md) |
| **S07** · 서비스 이용안내 진입 | P3 | 카드만 / 미연결 / 내용/경로 미정 | 코드 대조 | [DEV-49](tasks/DEV-49.md) | — | [POL-25](tasks/POL-25.md) |
| **S08** · 의견 보내기·문의 경로 | P3 | 배너만 / 비활성 / 연결 없음 | 코드 대조 | [DEV-50](tasks/DEV-50.md) | — | [POL-26](tasks/POL-26.md) |
| **S09** · mock 이메일 인증 시간 정책 | P2 | 구현 / 정책과 다름 / mock 10분/30초 | 현재 mate-docs §7 대조 | [DEV-41](tasks/DEV-41.md) | — | [POL-19](tasks/POL-19.md) |
| **N01** · 받은 알림 목록·읽음·건수·20건 더 보기 | P0 | 구현 / 구현 / API·mock | 새 mock 20→25·22→21·reload 확인 | — | [QA-11](tasks/QA-11.md) / [QA-16](tasks/QA-16.md) | — |
| **N02** · 받은 알림 편집·선택·삭제 | P2 | 준비 중 / 보류 / 삭제 계약 미연결 | 새 mock 비활성 확인 | [DEV-43](tasks/DEV-43.md) | — | [POL-20](tasks/POL-20.md) |
| **N03** · 알림에서 대상 공고·회사·소식 이동 | P1 | 없음 / 읽음만 / DTO actionPath 버림 | 새 mock 클릭 후 /alarms 유지 | [DEV-06](tasks/DEV-06.md) | — | [POL-04](tasks/POL-04.md) |
| **N04** · 새 알림 자동 반영·재연결 갱신 | P1 | 없음 / 미구현 / REST만 | 코드 및 현재 mate-docs §9 대조 | [DEV-07](tasks/DEV-07.md) | — | [POL-05](tasks/POL-05.md) |
| **Q01** · FAQ 5개·독립 아코디언·상단 이동 | P3 | 구현 / 구현 / static 콘텐츠 | 기존 QA 7통과·새 mock 재확인 | — | [QA-15](tasks/QA-15.md) | — |
| **W01** · 메이트 소식 목록·업데이트/공지 필터 | P3 | 없음 / 미구현 / 프론트 공급원 없음 | 코드 대조 | [DEV-51](tasks/DEV-51.md) | — | [POL-27](tasks/POL-27.md) |
| **W02** · 소식 상세·목록 복귀 | P3 | 없음 / 미구현 / 프론트 계약 없음 | 코드 대조 | [DEV-52](tasks/DEV-52.md) | — | [POL-27](tasks/POL-27.md) |
| **O01** · Google 로그인·가입·callback·세션/로그아웃 | P0 | 구현 / 구현 / API·mock | 계약 테스트·새 mock 로그인/복귀 | — | [QA-04](tasks/QA-04.md) / [QA-16](tasks/QA-16.md) | — |
| **O02** · 네이버 로그인 | P3 | 준비 중 / 보류 / 프론트 연결 없음 | 코드 대조 | [DEV-48](tasks/DEV-48.md) | — | [POL-24](tasks/POL-24.md) |
| **O03** · 필수 약관 동의·본문 | P0 | 동의 UI 구현 / 테스트 동의 구현 / 임시 본문/버전 | 코드 대조 | [DEV-01](tasks/DEV-01.md) | [QA-16](tasks/QA-16.md) | [POL-01](tasks/POL-01.md) |
| **O04** · 바로 시작·회사 찾기·등록 선택 | P0 | 구현 / 구현 / 인증·회사 연결 | 코드 대조 | — | [QA-04](tasks/QA-04.md) / [QA-16](tasks/QA-16.md) | — |
| **O05** · 기존 회사 검색·소속 신청·대표/팀원 입력 | P0 | 구현 / 구현 / API·mock | 코드 대조 | — | [QA-05](tasks/QA-05.md) / [QA-16](tasks/QA-16.md) | — |
| **O06** · 사업자번호 조회·처리·등록 | P0 | 구현 / 구현 / API·mock | 계약 테스트·새 mock 경로 확인 | — | [QA-06](tasks/QA-06.md) / [QA-16](tasks/QA-16.md) | — |
| **O07** · 증명서 업로드·OCR·재시도·충돌·등록 | P0 | 구현 / 구현 / API·mock | 계약 테스트·기존 mock QA | — | [QA-07](tasks/QA-07.md) / [QA-16](tasks/QA-16.md) | — |
| **O08** · 조회 실적·인증 표시·대표/직급·희망금액 | P1 | 구현 / 구현 / API·mock | 코드 대조 | [DEV-08](tasks/DEV-08.md) | [QA-06](tasks/QA-06.md) / [QA-07](tasks/QA-07.md) | — |
| **O09** · 가입 중 실적·인증 직접 수정 | P2 | 비활성 / 보류 / 프론트 수정 계약 없음 | 코드 대조 | [DEV-44](tasks/DEV-44.md) | — | [POL-21](tasks/POL-21.md) |
| **O10** · 초대 preview·계정 불일치·수락/거절 | P0 | 구현 / 구현 / API·mock | 코드 대조 | — | [QA-08](tasks/QA-08.md) / [QA-16](tasks/QA-16.md) | — |
| **O11** · 초대 수락 후 팀원 화면 이동 | P2 | 완료 화면 있음 / /bids로 대체 / 팀원 관리 미구현 | 코드 대조 | [DEV-33](tasks/DEV-33.md) | — | [POL-15](tasks/POL-15.md) |
| **C01** · 색상·서체·버튼·입력·선택·체크·탭·카드·토스트 | P3 | 공용 기반 구현 / 대부분 소비됨 / 표시 컴포넌트 | 정적·대표 시각 비교 | [DOC-002](tasks/DOC-002.md) | [QA-15](tasks/QA-15.md) | — |
| **C02** · 정정·비밀번호·탈퇴·업로드 공용 팝업 | P2 | 컴포넌트 구현 / 일부 Storybook 전용 / 업무 API 없음 | 코드 대조 | [DEV-13](tasks/DEV-13.md) / [DEV-24](tasks/DEV-24.md) / [DEV-39](tasks/DEV-39.md) | — | [POL-08](tasks/POL-08.md) / [POL-17](tasks/POL-17.md) / [POL-18](tasks/POL-18.md) |
| **C03** · OG 썸네일·브랜드 공유 메타데이터 | P3 | 기본 metadata / 시안 이미지 미연결 / 정적 | 코드 대조 | [DEV-53](tasks/DEV-53.md) | — | [POL-28](tasks/POL-28.md) |
| **C04** · 상세 main 랜드마크 중첩 | P3 | 중첩됨 / 시각 동작은 가능 / 없음 | 브라우저 strict locator와 코드로 확인 | [DEV-54](tasks/DEV-54.md) | — | — |
| **M06** · 회사 등록·찾기의 기존 온보딩 재사용 | P2 | 동등 흐름 재사용 / /auth/**로 이동 / 기존 회사 Repository | 새 mock 진입 및 코드 대조 | [DEV-16](tasks/DEV-16.md) | — | [POL-11](tasks/POL-11.md) |

원본 ID 79개·중복 ID 없음·연결 누락 없음. 신규 요구는 원본 JSON 수정 대신 새 작업과 변경 사유를 추가한다.

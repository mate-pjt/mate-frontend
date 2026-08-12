import type { QnaItem } from "@/types/qna";

export const mockQnaItems = [
  {
    question: "Mate는 어떤 사용자를 위한 서비스인가요?",
    answer:
      "입찰공고를 지속적으로 확인해야 하는 기업 실무자와 영업 담당자를 위한 탐색 및 알림 서비스입니다.",
  },
  {
    question: "현재 데이터는 실제 입찰공고인가요?",
    answer:
      "아직 백엔드/API 명세가 공유되지 않아 MVP 프론트엔드 개발용 mock 데이터를 사용합니다.",
  },
  {
    question: "회원가입과 로그인은 왜 같은 URL인가요?",
    answer:
      "Figma 설계상 한 화면 안에서 전환되는 구조라 `/auth?mode=login`, `/auth?mode=signup` 쿼리로 구분합니다.",
  },
] satisfies readonly QnaItem[];

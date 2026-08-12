import type { AlarmNotification } from "@/types/alarm";

export const mockAlarms = [
  {
    id: "bid-correction",
    kind: "bid",
    label: "입찰공고",
    receivedAt: "2026-05-24",
    receivedDate: "2026.05.24",
    messageLines: [
      "R25BK01252718-000 대전보건대학교 혁신지원사업 학과 환경개선공사(시스템에어컨설치)",
      "공고가 정정되었습니다. 확인해주세요!",
    ],
    unread: true,
  },
  {
    id: "bid-result",
    kind: "bid",
    label: "입찰공고",
    receivedAt: "2026-05-24",
    receivedDate: "2026.05.24",
    messageLines: [
      "R25BK01252718-000 대전보건대학교 혁신지원사업 학과 환경개선공사(시스템에어컨설치)",
      "개찰완료되었습니다. 확인해주세요!",
    ],
    unread: true,
  },
  {
    id: "company-profile",
    kind: "company",
    label: "회사 정보 관리",
    receivedAt: "2026-05-24",
    receivedDate: "2026.05.24",
    messageLines: [
      "새로운 한 해가 밝았어요! 2026년에도 사장님께 딱 맞는 공고를 찾아드릴 수 있도록,",
      "지금 바로 회사 정보를 최신으로 업데이트해 보세요.",
    ],
    unread: true,
  },
  {
    id: "mate-welcome",
    kind: "mate",
    label: "메이트 소식",
    receivedAt: "2026-05-24",
    receivedDate: "2026.05.24",
    messageLines: [
      "반가워요 사장님! 사장님의 성공적인 투찰을 위해 메이트가 오늘부터 새로운 소식을 전해드릴게요.",
      "함께 힘차게 시작해 봐요!",
    ],
    unread: true,
  },
] satisfies readonly AlarmNotification[];

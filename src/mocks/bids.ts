import type { Bid } from "@/types/bid";

export const mockBids: Bid[] = [
  {
    id: "mate-2026-001",
    title: "공공기관 통합 알림 시스템 구축 용역",
    organization: "서울디지털재단",
    category: "IT 서비스",
    region: "서울",
    budget: 180_000_000,
    publishedAt: "2026-06-10",
    closesAt: "2026-06-24",
    status: "open",
    summary:
      "기관별 알림 채널을 통합하고 사용자 맞춤형 메시지 발송 기능을 구축합니다.",
    tags: ["시스템 구축", "알림", "공공"],
  },
  {
    id: "mate-2026-002",
    title: "중소기업 판로 지원 플랫폼 유지보수",
    organization: "중소벤처기업진흥공단",
    category: "운영/유지보수",
    region: "대전",
    budget: 95_000_000,
    publishedAt: "2026-06-12",
    closesAt: "2026-06-21",
    status: "closing-soon",
    summary:
      "기존 판로 지원 플랫폼의 안정화, 접근성 개선, 관리자 기능 보강을 수행합니다.",
    tags: ["유지보수", "접근성", "플랫폼"],
  },
  {
    id: "mate-2026-003",
    title: "지역 관광 데이터 시각화 대시보드 개발",
    organization: "부산관광공사",
    category: "데이터/분석",
    region: "부산",
    budget: 140_000_000,
    publishedAt: "2026-06-14",
    closesAt: "2026-06-28",
    status: "open",
    summary:
      "관광 유입 데이터와 소비 데이터를 분석해 지자체 담당자가 활용할 수 있는 대시보드를 개발합니다.",
    tags: ["데이터", "대시보드", "관광"],
  },
];

export function getBidById(bidId: string) {
  return mockBids.find((bid) => bid.id === bidId);
}

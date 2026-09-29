import { mockBids, mockHomeBids } from "@/mocks/bids";
import type { Bid } from "@/types/bid";

import type { BidListQuery, BidReader } from "./contracts";

const mockBidRegions = [
  "서울특별시",
  "대전광역시",
  "부산광역시",
  "인천광역시",
  "울산광역시",
  "세종특별자치시",
  "충청북도",
  "경상남도",
] as const;

export const mockBidReader: BidReader = {
  async getHomeBids() {
    return mockHomeBids;
  },

  async getBidList(query) {
    const filteredBids = filterMockBids(mockBids, query);
    const totalPages = Math.max(1, Math.ceil(filteredBids.length / query.size));
    const page = Math.min(query.page, totalPages);
    const firstItemIndex = (page - 1) * query.size;

    return {
      items: filteredBids.slice(firstItemIndex, firstItemIndex + query.size).map((bid) => ({
        ...bid,
        demandAgencyName: null,
        noticeAgencyName: null,
      })),
      totalCount: filteredBids.length,
      page,
      size: query.size,
    };
  },

  async getFilterOptions() {
    return {
      regions: mockBidRegions,
      industries: uniqueBidValues(mockBids, "industry"),
      contractMethods: uniqueBidValues(mockBids, "contractMethod"),
      regionOptions: mockBidRegions.map((region) => ({ code: region, label: region })),
      industryOptions: uniqueBidValues(mockBids, "industry").map((industry) => ({ code: industry, label: industry })),
    };
  },
};

function filterMockBids(bids: readonly Bid[], query: BidListQuery): readonly Bid[] {
  const normalizedQuery = query.query.toLocaleLowerCase("ko-KR");
  const latestBidStartedAt = Math.max(...bids.map((bid) => parseDate(bid.bidStartedAt)));

  return bids.filter((bid) => {
    if (query.view === "closing" && bid.status !== "closing-soon") return false;
    if (query.view === "result" && bid.status !== "closed") return false;
    if (query.view === "recommended" && !bid.recommended) return false;
    if (query.category && bid.kind !== query.category) return false;
    if (query.region && !bid.region.includes(query.region)) return false;
    if (query.industry && bid.industry !== query.industry) return false;
    if (query.contract && bid.contractMethod !== query.contract) return false;
    if (query.agency && bid.organization !== query.agency) return false;
    if (query.period && !matchesPeriod(bid.bidStartedAt, query.period, latestBidStartedAt)) return false;
    if (query.amount && !matchesAmount(bid.baseAmount, query.amount)) return false;

    if (!normalizedQuery) return true;

    return [bid.title, bid.noticeNumber, bid.organization, bid.industry]
      .join(" ")
      .toLocaleLowerCase("ko-KR")
      .includes(normalizedQuery);
  });
}

function uniqueBidValues(
  bids: readonly Bid[],
  key: "industry" | "contractMethod",
) {
  return [...new Set(bids.map((bid) => bid[key]))];
}

function matchesAmount(amount: number, preset: string) {
  if (preset === "1억 원 이하") return amount <= 100_000_000;
  if (preset === "1억 ~ 10억 원 이하") return amount > 100_000_000 && amount <= 1_000_000_000;
  if (preset === "10억 ~ 50억 원 이하") return amount > 1_000_000_000 && amount <= 5_000_000_000;
  if (preset === "50억 ~ 100억 원 이하") return amount > 5_000_000_000 && amount <= 10_000_000_000;
  if (preset === "100억 원+") return amount > 10_000_000_000;
  return true;
}

function matchesPeriod(bidStartedAt: string, period: string, latestBidStartedAt: number) {
  const months = period === "1개월" ? 1 : period === "3개월" ? 3 : period === "6개월" ? 6 : period === "1년" ? 12 : 0;
  if (months === 0) return true;
  const boundary = new Date(latestBidStartedAt);
  boundary.setMonth(boundary.getMonth() - months);
  return parseDate(bidStartedAt) >= boundary.getTime();
}

function parseDate(value: string) {
  return new Date(value.replaceAll(".", "-").split(" ")[0]).getTime();
}

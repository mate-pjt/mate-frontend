import type { BidDetail, BidDetailPageData, BidParticipant, DetailSection, RelatedBid } from "@/types/bid-detail";
import type { BidListItem } from "@/types/bid-list";
import type { BidAmountFilter, BidDateFilter, BidDetailRepository, BidFilterOptions, BidListQuery, BidListRepository, BidRegionFilter, BidRegionOption, BidResultAmountFilter } from "./contracts";
import { currentBidDateFilter } from "@/features/bid-notice-filters/date-filter";
import { currentBidAmountFilter, currentBidResultAmountFilter } from "@/features/bid-notice-filters/amount-filter";
import { bidRegionFilterError, currentBidRegionFilter } from "@/features/bid-notice-filters/region-filter";
import { ApiError } from "../shared/errors";
import { canonicalClassification, selectMockRelatedBids, type MockBidEntry } from "./mock-related";

const mockRegions: readonly BidRegionOption[] = [
  { code: "11", label: "서울특별시", name: "서울특별시", parentCode: null, depth: 1 },
  { code: "26", label: "부산광역시", name: "부산광역시", parentCode: null, depth: 1 },
  { code: "11110", label: "서울특별시 종로구", name: "종로구", parentCode: "11", depth: 2 },
  { code: "11680", label: "서울특별시 강남구", name: "강남구", parentCode: "11", depth: 2 },
  { code: "26110", label: "부산광역시 중구", name: "중구", parentCode: "26", depth: 2 },
  { code: "26350", label: "부산광역시 해운대구", name: "해운대구", parentCode: "26", depth: 2 },
];
const mockRegionsByCode = new Map(mockRegions.map(region => [region.code, region]));
const mockCities = mockRegions.filter(region => region.parentCode === null);

export const mockBidOptions: BidFilterOptions = {
  industries: ["토목공사업", "정보통신공사업"],
  contractMethods: ["일반경쟁", "제한경쟁", "지명경쟁", "수의계약"],
  regionOptions: mockRegions,
  industryOptions: [{ code: "0001", label: "토목공사업" }, { code: "0036", label: "정보통신공사업" }],
};
const iso = (timestamp: number) => new Date(timestamp).toISOString();
const kst = (timestamp: number, time = false) => new Date(timestamp + 9 * 3600_000).toISOString().slice(0, time ? 16 : 10).replaceAll("-", ".").replace("T", " ");
export function createMockBidEntries(now: number): readonly MockBidEntry[] {
  return Array.from({ length: 36 }, (_, index) => {
    const id = String(10001 + index);
    const kind = (["construction", "service", "purchase"] as const)[index % 3];
    const closed = index % 4 === 3;
    const close = now + (closed ? -2 - index % 3 : index % 4 === 0 ? 1 : 8) * 86400_000;
    const begin = now + (index % 4 === 1 ? 1 : -(index + 1)) * 86400_000;
    const published = now - (index + 2) * 86400_000;
    const city = mockCities[index % mockCities.length];
    const districts = mockRegions.filter(region => region.parentCode === city.code);
    const region = index % 3 === 2 ? districts[Math.floor(index / 2) % districts.length] : city;
    const regionState = index % 12 === 5 ? "pending" : index % 12 === 7 ? "failed" : index % 3 === 0 ? "unrestricted" : "known";
    const industry = mockBidOptions.industryOptions[index % 2];
    const contract = mockBidOptions.contractMethods[index % 4];
    const amount = index % 7 === 6 ? null : (index + 1) * 80_000_000;
    const vatAmount = index % 5 === 4 ? null : index % 6 === 0 ? 0 : 8_000_000 * (index + 1);
    const item: BidListItem = {
      id, classificationNo: kind === "construction" ? null : "1", noticeNumber: `MOCK-${id}-00`, title: `가상 ${kind === "construction" ? "시설 공사" : kind === "service" ? "정보화 용역" : "장비 구매"} 공고 ${index + 1}`,
      kind, demandAgencyName: "가상 수요기관", noticeAgencyName: "가상 발주기관", industry: industry.label,
      contractMethod: contract, region: city.label, baseAmount: amount, estimatedPrice: amount === null ? null : Math.round(amount / 1.1),
      publishedAt: kst(published), closesAt: kst(close, true), openedAt: kst(close + 3600_000, true),
      winningCompany: closed ? "가상 낙찰회사" : null, bidRate: closed ? 88.12 : null, successfulBidAmount: closed && amount ? Math.round(amount * .8812) : null,
    };
    const bid: BidDetail = {
      id, classificationNo: item.classificationNo ?? null, classifications: kind === "construction" ? [] : ["1", "2", "10"], noticeNumber: item.noticeNumber, title: item.title, referenceNumber: null,
      bidType: kind === "purchase" ? "goods" : kind, status: index === 15 ? "CANCELLED" : "NORMAL", changedAt: null, changeReason: null, sourceUrl: null,
      amount: { basePrice: amount, estimatedPrice: item.estimatedPrice, budget: amount, projectAmount: item.estimatedPrice === null || vatAmount === null ? null : item.estimatedPrice + vatAmount, lowerBoundRate: 87.745, priceDecisionMethod: "복수예가", pureConstructionCost: null },
      schedule: { publishedAt: iso(published), qualificationDeadlineAt: iso(close - 86400_000), bidBeginAt: iso(begin), bidCloseAt: iso(close), openAt: iso(close + 3600_000) },
      procedure: { bidMethod: "전자입찰", contractMethod: contract, awardMethod: "적격심사", internationalBid: false, rebidAllowed: true },
      agencies: { noticeName: item.noticeAgencyName, demandName: item.demandAgencyName, orderingRegionName: city.label, noticeOfficerName: null, noticeOfficerPhone: null, noticeOfficerEmail: null, demandOfficerEmail: null },
      eligibility: { industries: [industry.label], industryState: "known", regions: regionState === "known" ? [region.label] : [], regionState, siteExplanationRequired: false, pqRequired: false, detailedBid: false, performanceCompetition: null, mutualMarketEntry: null },
      jointSupply: { method: index % 2 === 0 || (closed && index % 3 !== 2) ? "공동이행" : null, receiptMethod: null, deadlineAt: null },
    };
    return {
      item, bid, closed, regionCode: region.code, industryCode: industry.code, jointRequired: index % 4 === 0 || (closed && index % 3 === 0), contractCode: ["GENERAL", "LIMITED", "NOMINATION", "PRIVATE"][index % 4],
      published: true, deleted: false, industryCodes: [industry.code],
      purchaseItems: kind === "construction" ? [] : ["1", "2", "10"].map(classificationNo => ({
        classificationNo, deleted: false,
        detailedItemNo: String(classificationNo === "1" ? 1000000000 + index % 2 : index === 2 ? 2000000000 + index : 1000000000 + (index + 1) % 2),
        itemClassificationNo: String(10000000 + index % 2),
      })),
      vatAmount,
    };
  });
}
function matchesAmount(amount: number | null, range: BidResultAmountFilter): boolean {
  return (range.amountMin === null || (amount !== null && amount >= range.amountMin)) &&
    (range.amountMax === null || (amount !== null && amount <= range.amountMax));
}

function matchesRegion(entry: MockBidEntry, { regionCodes, regionOnly, jointContract }: BidRegionFilter): boolean {
  if (jointContract === "REQUIRED" && !entry.jointRequired) return false;
  if (jointContract === "AVAILABLE" && (entry.jointRequired || entry.bid.jointSupply.method === null)) return false;
  if (regionCodes.length === 0) return true;

  const noticeRegion = mockRegionsByCode.get(entry.regionCode);
  return regionCodes.some(code => {
    const selected = mockRegionsByCode.get(code);
    if (!selected) return false;
    if (entry.bid.eligibility.regionState === "unrestricted") return !regionOnly;
    return entry.bid.eligibility.regionState === "known" && noticeRegion !== undefined && (
      noticeRegion.code === selected.code || noticeRegion.parentCode === selected.code || selected.parentCode === noticeRegion.code
    );
  });
}

function matches(entry: MockBidEntry, query: BidListQuery, now: number, dates: BidDateFilter, amounts: BidAmountFilter): boolean {
  const { item, bid } = entry;
  const close = Date.parse(bid.schedule.bidCloseAt!);
  if (query.view === "result" && !entry.closed) return false;
  if (query.view !== "result" && (entry.closed || close <= now)) return false;
  if (query.view === "closing" && close > now + 3 * 86400_000) return false;
  const keyword = query.query.trim().toLocaleLowerCase("ko-KR");
  if (![item.title, item.noticeNumber, item.noticeAgencyName, item.demandAgencyName].some(value => value?.toLocaleLowerCase("ko-KR").includes(keyword))) return false;
  const timestamp = bid.schedule[query.view === "result" ? "openAt" : dates.dateType === "PARTICIPATION_DEADLINE" ? "qualificationDeadlineAt" : dates.dateType === "BID_CLOSE" ? "bidCloseAt" : "bidBeginAt"];
  const day = timestamp ? new Date(Date.parse(timestamp) + 9 * 3600_000).toISOString().slice(0, 10) : null;
  if ((dates.dateFrom && (!day || day < dates.dateFrom)) || (dates.dateTo && (!day || day > dates.dateTo))) return false;
  const amount = amounts.amountType === "ESTIMATED_PRICE" ? item.estimatedPrice : item.baseAmount;
  if (!matchesAmount(amount, amounts)) return false;
  const filter = query.personalFilter;
  if (filter && query.view === "all") {
    const type = { construction: "CONSTRUCTION", service: "SERVICE", purchase: "GOODS" }[item.kind];
    if (filter.bidTypes.length && !filter.bidTypes.some(value => value === type)) return false;
    if (filter.industryCodes.length && !filter.industryCodes.includes(entry.industryCode)) return false;
    if (filter.contractMethods.length && !filter.contractMethods.some(code => code === entry.contractCode)) return false;
    return true;
  }
  if (query.category && item.kind !== query.category) return false;
  if (query.industry && query.industry !== item.industry && query.industry !== entry.industryCode) return false;
  if (query.contract && query.contract !== item.contractMethod) return false;
  return true;
}

export function createMockBidRepository(now: () => number = Date.now, scenario = "default", fixtures: readonly MockBidEntry[] = createMockBidEntries(now())): BidListRepository & BidDetailRepository {
  const all = structuredClone(fixtures);
  async function available() { if (scenario === "slow") await new Promise(resolve => setTimeout(resolve, 250)); if (scenario === "error") throw new Error("개발 시나리오: 입찰공고를 불러오지 못했습니다."); }
  function section<T>(name: string, data: T): DetailSection<T> { return scenario === "partial-error" || scenario === `${name}-error` ? { status: "error", data: null } : { status: "ready", data }; }
  return {
    async getFilterOptions() { await available(); return structuredClone(mockBidOptions); },
    async getBidList(query) {
      await available();
      if (query.view === "recommended") throw new Error("맞춤 입찰공고 목록 API는 준비 중입니다.");
      if (query.agency) throw new Error("기관 단독 필터는 아직 지원하지 않습니다.");
      const regions = currentBidRegionFilter(query, mockRegions);
      const regionError = query.regionError ?? bidRegionFilterError(regions);
      if (regionError) throw new Error(regionError);
      if (query.region && !query.regionFilter && !(query.view === "all" && query.personalFilter) && !regions.regionCodes.length) {
        throw new Error("선택한 지역을 확인할 수 없습니다.");
      }
      const time = now();
      const dates = currentBidDateFilter(query, time);
      const amounts = currentBidAmountFilter(query);
      const resultAmounts = currentBidResultAmountFilter(query);
      const filtered = scenario === "empty" ? [] : all.filter(entry =>
        matches(entry, query, time, dates, amounts) &&
        matchesRegion(entry, regions) &&
        (!resultAmounts || matchesAmount(entry.item.successfulBidAmount ?? null, resultAmounts)),
      );
      filtered.sort((a, b) => query.view === "result" ? Date.parse(b.bid.schedule.openAt!) - Date.parse(a.bid.schedule.openAt!) : Date.parse(a.bid.schedule.bidCloseAt!) - Date.parse(b.bid.schedule.bidCloseAt!));
      return { items: filtered.slice((query.page - 1) * query.size, query.page * query.size).map(entry => entry.item), totalCount: filtered.length, page: query.page, size: query.size };
    },
    async getBidDetail(query): Promise<BidDetailPageData | null> {
      await available();
      const entry = scenario === "empty" ? null : all.find(entry => entry.item.id === query.id);
      if (!entry || !entry.published || entry.deleted) return null;
      if (entry.bid.id !== query.id) throw new ApiError(500, null, "입찰공고 상세 ID가 일치하지 않습니다.");
      if (query.classificationNo !== null) {
        if (!canonicalClassification(query.classificationNo) || entry.bid.bidType === "construction") throw new ApiError(400, null, "입찰분류 입력이 올바르지 않습니다.");
        if (!entry.bid.classifications.includes(query.classificationNo)) return null;
      }
      const bid = { ...entry.bid, classificationNo: query.classificationNo };
      let related: DetailSection<readonly RelatedBid[]>;
      try { related = section("related", selectMockRelatedBids(entry, all, query.classificationNo, now())); }
      catch { related = { status: "error", data: null }; }
      const results = entry.closed ? [{ id: `${query.id}1`, classificationNo: query.classificationNo ?? "1", round: "1", status: "AWARDED", openedAt: bid.schedule.openAt, plannedOpenAt: bid.schedule.openAt, participantCount: 25, openingMessage: null, openingFirstPlaceName: "가상 낙찰회사", openingFirstPlaceAmount: entry.item.successfulBidAmount ?? null, openingFirstPlaceRate: 88.12, winnerName: "가상 낙찰회사", winningAmount: entry.item.successfulBidAmount ?? null, winningRate: 88.12, failingReason: null, rebidReason: null }] : [];
      const resultSection = section("results", results);
      const selected = resultSection.status === "ready" ? results.find(result => result.id === query.resultId) ?? results[0] : null;
      const participants: BidParticipant[] = Array.from({ length: 25 }, (_, i) => ({ rank: String(i + 1), companyName: `가상 참여회사 ${i + 1}`, bidAt: bid.schedule.bidCloseAt === null ? null : kst(Date.parse(bid.schedule.bidCloseAt), true), bidRate: (8812 + i) / 100, bidAmount: entry.item.baseAmount === null ? null : Math.round(entry.item.baseAmount * (.8812 + i * .0001)), remark: null }));
      const goods = Array.from({ length: 15 }, (_, i) => ({ key: String(i + 1), name: `가상 장비 ${i + 1}`, specification: null, quantity: 10, unit: "개", unitPrice: 100_000, deliveryDeadline: null, deliveryPlace: bid.agencies.orderingRegionName }));
      const displayDate = (value: string | null) => value ? kst(Date.parse(value), true) : null;
      const displayBid = { ...bid, schedule: Object.fromEntries(Object.entries(bid.schedule).map(([key, value]) => [key, displayDate(value)])) as BidDetail["schedule"] };
      return { bid: displayBid, attachments: section("attachments", [{ id: `${query.id}-attachment`, name: "가상 공고 첨부.txt", previewable: false, previewUrl: null, downloadUrl: "/mock/bid-attachment.txt" }]),
        related,
        results: resultSection.status === "ready" ? { status: "ready", data: resultSection.data.map(item => ({ ...item, openedAt: displayDate(item.openedAt), plannedOpenAt: displayDate(item.plannedOpenAt) })) } : resultSection, selectedResultId: selected?.id ?? null,
        purchases: bid.bidType === "goods" ? section("purchases", { itemCount: 15, totalQuantity: 150, totalAmount: 15_000_000, minUnitPrice: 100_000, maxUnitPrice: 100_000, items: goods.slice((query.itemPage - 1) * 10, query.itemPage * 10), totalPages: 2, page: query.itemPage }) : null,
        participants: selected ? section("participants", { items: participants.slice((query.participantsPage - 1) * 20, query.participantsPage * 20), page: query.participantsPage, totalPages: 2, totalCount: 25 }) : null,
        podium: selected ? section("participants", participants.slice(0, 3)) : null };
    },
  };
}

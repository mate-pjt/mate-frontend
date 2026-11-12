import type { BidDetail, RelatedBid } from "@/types/bid-detail";
import type { BidListItem } from "@/types/bid-list";
import { ApiError } from "../shared/errors";

export type MockPurchaseItem = {
  readonly classificationNo: string | null;
  readonly detailedItemNo: string | null;
  readonly itemClassificationNo: string | null;
  readonly deleted: boolean;
};

export type MockBidEntry = {
  readonly item: BidListItem;
  readonly bid: BidDetail;
  readonly closed: boolean;
  readonly regionCode: string;
  readonly industryCode: string;
  readonly jointRequired: boolean;
  readonly contractCode: string;
  readonly published: boolean;
  readonly deleted: boolean;
  // Final publication codes include both direct and officially allowed industries.
  readonly industryCodes: readonly string[];
  readonly purchaseItems: readonly MockPurchaseItem[];
  readonly vatAmount: number | null;
};

export const canonicalClassification = (value: string) => /^(0|[1-9][0-9]{0,49})$/.test(value);
const numericOrder = (a: string, b: string) => a.length - b.length || (a < b ? -1 : a > b ? 1 : 0);
const nonBlank = (value: string | null): value is string => value !== null && value.trim().length > 0;

export function selectMockRelatedBids(source: MockBidEntry, entries: readonly MockBidEntry[], classificationNo: string | null, requestedAt: number): readonly RelatedBid[] {
  const sourceItems = source.purchaseItems.filter(item => !item.deleted && (classificationNo === null || item.classificationNo === classificationNo));
  const industries = new Set(source.industryCodes.filter(nonBlank));
  const detailed = new Set(sourceItems.map(item => item.detailedItemNo).filter(nonBlank));
  const classifications = new Set(sourceItems.map(item => item.itemClassificationNo).filter(nonBlank));
  const industryMatch = source.bid.bidType !== "goods" && industries.size > 0;
  const itemKey = detailed.size ? "detailedItemNo" : "itemClassificationNo";
  const codes = industryMatch ? industries : source.bid.bidType === "construction" ? new Set<string>() : detailed.size ? detailed : classifications;
  if (!codes.size) return [];

  const matches: { entry: MockBidEntry; classificationNo: string | null }[] = [];
  const seen = new Set<string>();
  for (const entry of entries) {
    const { bid } = entry;
    if (bid.id === source.bid.id || seen.has(bid.id) || bid.bidType !== source.bid.bidType || !entry.published || entry.deleted || bid.status === "CANCELLED") continue;
    if (bid.schedule.bidCloseAt !== null && Date.parse(bid.schedule.bidCloseAt) <= requestedAt) continue;
    let targetClass: string | null = null;
    if (industryMatch) {
      if (!entry.industryCodes.some(code => codes.has(code))) continue;
    } else {
      const items = entry.purchaseItems.filter(item => !item.deleted && item[itemKey] !== null && codes.has(item[itemKey]!));
      if (!items.length) continue;
      if (entry.bid.classifications.some(value => !canonicalClassification(value)) || items.some(item => item.classificationNo === null || !canonicalClassification(item.classificationNo) || !bid.classifications.includes(item.classificationNo))) {
        throw new ApiError(500, null, "관련 공고 품목의 분류 정보가 일치하지 않습니다.");
      }
      targetClass = items.map(item => item.classificationNo!).sort(numericOrder)[0];
    }
    seen.add(bid.id);
    matches.push({ entry, classificationNo: targetClass });
  }
  matches.sort((a, b) => {
    const first = a.entry.bid.schedule.publishedAt;
    const second = b.entry.bid.schedule.publishedAt;
    return (first === null ? second === null ? 0 : 1 : second === null ? -1 : Date.parse(second) - Date.parse(first))
      || numericOrder(b.entry.bid.id, a.entry.bid.id);
  });
  return matches.slice(0, 3).map(({ entry, classificationNo }) => ({
    id: entry.bid.id, classificationNo, title: entry.bid.title, bidType: entry.bid.bidType, region: entry.item.region,
    publishedAt: entry.bid.schedule.publishedAt === null ? null : new Date(Date.parse(entry.bid.schedule.publishedAt) + 9 * 3600_000).toISOString().slice(0, 10).replaceAll("-", "."),
    projectAmount: entry.bid.amount.estimatedPrice === null || entry.vatAmount === null ? null : entry.bid.amount.estimatedPrice + entry.vatAmount,
  }));
}

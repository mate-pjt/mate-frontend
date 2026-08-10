import type { Bid, BidKind } from "@/types/bid";

export type BidView = "all" | "closing" | "result" | "recommended";

export type BidFilters = {
  readonly category?: BidKind;
  readonly region?: string;
  readonly industry?: string;
  readonly contract?: string;
  readonly agency?: string;
  readonly period?: string;
  readonly amount?: string;
};

export type BidListState = BidFilters & {
  readonly view: BidView;
  readonly query: string;
  readonly page: number;
  readonly size: number;
};

export const bidViewOptions: readonly { readonly label: string; readonly value: BidView }[] = [
  { value: "all", label: "전체 입찰공고" },
  { value: "closing", label: "곧 마감되는 입찰공고" },
  { value: "result", label: "개찰 발표 입찰공고" },
  { value: "recommended", label: "나를 위한 맞춤 입찰공고" },
];

export const categoryLabels: Record<BidKind, string> = {
  construction: "공사",
  service: "용역",
  purchase: "물품",
};

const supportedPageSizes = new Set([10, 20, 30]);
const supportedPeriods = new Set(["1개월", "3개월", "6개월", "1년"]);
const supportedAmounts = new Set([
  "1억 원 이하",
  "1억 ~ 10억 원 이하",
  "10억 ~ 50억 원 이하",
  "50억 ~ 100억 원 이하",
  "100억 원+",
]);

export function readBidListState(searchParams: URLSearchParams): BidListState {
  const rawView = searchParams.get("view");
  const view = readView(rawView);
  const rawSize = Number(searchParams.get("size"));

  return {
    view,
    query: searchParams.get("query")?.trim() ?? "",
    page: readPositiveInteger(searchParams.get("page")),
    size: supportedPageSizes.has(rawSize) ? rawSize : 10,
    category: readKind(searchParams.get("category")) ?? "construction",
    region: readOptional(searchParams.get("region")),
    industry: readOptional(searchParams.get("industry")),
    contract: readOptional(searchParams.get("contract")),
    agency: readOptional(searchParams.get("agency")),
    period: readSupportedValue(searchParams.get("period"), supportedPeriods),
    amount: readSupportedValue(searchParams.get("amount"), supportedAmounts),
  };
}

export function filterBids(bids: readonly Bid[], state: BidListState): readonly Bid[] {
  const normalizedQuery = state.query.toLocaleLowerCase("ko-KR");
  const latestBidStartedAt = Math.max(...bids.map((bid) => parseDate(bid.bidStartedAt)));

  return bids.filter((bid) => {
    if (state.view === "closing" && bid.status !== "closing-soon") return false;
    if (state.view === "result" && bid.status !== "closed") return false;
    if (state.view === "recommended" && !bid.recommended) return false;
    if (state.category && bid.kind !== state.category) return false;
    if (state.region && !bid.region.includes(state.region)) return false;
    if (state.industry && bid.industry !== state.industry) return false;
    if (state.contract && bid.contractMethod !== state.contract) return false;
    if (state.agency && bid.organization !== state.agency) return false;
    if (state.period && !matchesPeriod(bid.bidStartedAt, state.period, latestBidStartedAt)) return false;
    if (state.amount && !matchesAmount(bid.baseAmount, state.amount)) return false;

    if (!normalizedQuery) return true;

    return [bid.title, bid.noticeNumber, bid.organization, bid.industry]
      .join(" ")
      .toLocaleLowerCase("ko-KR")
      .includes(normalizedQuery);
  });
}

export function uniqueBidValues(bids: readonly Bid[], key: "industry" | "contractMethod" | "organization") {
  return [...new Set(bids.map((bid) => bid[key]))];
}

function readKind(value: string | null): BidKind | undefined {
  if (value === "construction" || value === "service" || value === "purchase") return value;
  return undefined;
}

function readView(value: string | null): BidView {
  if (value === "closing" || value === "result" || value === "recommended") return value;
  return "all";
}

function readOptional(value: string | null) {
  return value || undefined;
}

function readSupportedValue(value: string | null, supportedValues: ReadonlySet<string>) {
  return value && supportedValues.has(value) ? value : undefined;
}

function readPositiveInteger(value: string | null) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
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

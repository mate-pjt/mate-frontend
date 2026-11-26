import type { BidListQuery, BidView } from "@/data/bids/contracts";
import type { BidKind } from "@/types/bid";
import { readPersonalFilterParams } from "@/features/bid-notice-filters/model";
import { readBidDateParams } from "@/features/bid-notice-filters/date-filter";
import { readBidAmountParams, readBidResultAmountParams } from "@/features/bid-notice-filters/amount-filter";
import { BID_SEARCH_MAX_LENGTH } from "@/features/bids/recent-searches";

export type { BidFilters, BidView } from "@/data/bids/contracts";

export type BidListState = BidListQuery;
type BidListLocation = Pick<BidListState, "view" | "query" | "page" | "size">;

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

export const bidPageSizeOptions = [
  { label: "10개씩 표시", value: "10" },
  { label: "20개씩 표시", value: "20" },
  { label: "30개씩 표시", value: "30" },
] as const;

export function isBidListPageSize(value: unknown): value is number {
  return typeof value === "number" && bidPageSizeOptions.some(option => Number(option.value) === value);
}

export function bidListLocationParams({ view, query, page, size }: BidListLocation): URLSearchParams {
  const params = new URLSearchParams();
  if (view !== "all") params.set("view", view);
  if (query) params.set("query", query);
  if (page !== 1) params.set("page", String(page));
  if (size !== 10) params.set("size", String(size));
  return params;
}

const supportedPeriods = new Set(["1개월", "3개월", "6개월", "1년"]);
const supportedAmounts = new Set([
  "1억 원 이하",
  "1억 ~ 10억 원 이하",
  "10억 ~ 50억 원 이하",
  "50억 ~ 100억 원 이하",
  "100억 원+",
]);

export function readBidListState(searchParams: URLSearchParams): BidListState {
  const view = readView(searchParams.get("view"));
  const rawSize = Number(searchParams.get("size"));
  const location = {
    view,
    query: searchParams.get("query")?.trim().slice(0, BID_SEARCH_MAX_LENGTH) ?? "",
    page: readPositiveInteger(searchParams.get("page")),
    size: isBidListPageSize(rawSize) ? rawSize : 10,
  };
  if (view === "recommended") return location;

  const personalFilter = view === "all" ? readPersonalFilterParams(searchParams) : undefined;
  const dates = readBidDateParams(searchParams, view);
  const amounts = readBidAmountParams(searchParams, view);

  return {
    ...location,
    category: personalFilter ? undefined : readKind(searchParams.get("category")) ?? "construction",
    region: personalFilter ? undefined : readOptional(searchParams.get("region")),
    industry: personalFilter ? undefined : readOptional(searchParams.get("industry")),
    contract: personalFilter ? undefined : readOptional(searchParams.get("contract")),
    agency: personalFilter ? undefined : readOptional(searchParams.get("agency")),
    period: personalFilter || dates.dateFilter || view === "closing" ? undefined : readSupportedValue(searchParams.get("period"), supportedPeriods),
    amount: personalFilter || amounts.amountFilter || view === "result" ? undefined : readSupportedValue(searchParams.get("amount"), supportedAmounts),
    personalFilter,
    ...dates,
    ...amounts,
    ...(view === "result" ? readBidResultAmountParams(searchParams) : {}),
  };
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

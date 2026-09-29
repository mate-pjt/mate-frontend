import type { BidListQuery, BidView } from "@/data/bids/contracts";
import type { BidKind } from "@/types/bid";
import { readPersonalFilterParams } from "@/features/bid-notice-filters/model";

export type { BidFilters, BidView } from "@/data/bids/contracts";

export type BidListState = BidListQuery;

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
  const personalFilter = view === "all" ? readPersonalFilterParams(searchParams) : undefined;

  return {
    view,
    query: searchParams.get("query")?.trim().slice(0, 100) ?? "",
    page: readPositiveInteger(searchParams.get("page")),
    size: supportedPageSizes.has(rawSize) ? rawSize : 10,
    category: personalFilter ? undefined : readKind(searchParams.get("category")) ?? "construction",
    region: personalFilter ? undefined : readOptional(searchParams.get("region")),
    industry: personalFilter ? undefined : readOptional(searchParams.get("industry")),
    contract: personalFilter ? undefined : readOptional(searchParams.get("contract")),
    agency: personalFilter ? undefined : readOptional(searchParams.get("agency")),
    period: personalFilter || view === "closing" ? undefined : readSupportedValue(searchParams.get("period"), supportedPeriods),
    amount: personalFilter || view === "result" ? undefined : readSupportedValue(searchParams.get("amount"), supportedAmounts),
    personalFilter,
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

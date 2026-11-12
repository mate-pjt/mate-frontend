import type { BidAmountDraft, BidAmountFilter, BidListQuery, BidView } from "@/data/bids/contracts";

export const bidAmountUrlKeys = ["amountType", "amountMin", "amountMax"] as const;
export const bidAmountTypes = ["BASE_PRICE", "ESTIMATED_PRICE"] as const;
export const bidAmountPresets: Record<string, { min: number | null; max: number | null }> = {
  "1억 원 이하": { min: null, max: 100_000_000 },
  "1억 ~ 10억 원 이하": { min: 100_000_001, max: 1_000_000_000 },
  "10억 ~ 50억 원 이하": { min: 1_000_000_001, max: 5_000_000_000 },
  "50억 ~ 100억 원 이하": { min: 5_000_000_001, max: 10_000_000_000 },
  "100억 원+": { min: 10_000_000_001, max: null },
};

export function emptyBidAmountFilter(): BidAmountFilter {
  return { amountType: null, amountMin: null, amountMax: null };
}

export function bidAmountFilterError(filter: BidAmountFilter): string | undefined {
  if (filter.amountType !== null && !bidAmountTypes.includes(filter.amountType)) return "금액 기준을 다시 선택해 주세요.";
  if ([filter.amountMin, filter.amountMax].some(value => value !== null && (!Number.isSafeInteger(value) || value < 0))) return "금액은 0부터 9,007,199,254,740,991까지 정수 원으로 입력해 주세요.";
  if ((filter.amountMin !== null || filter.amountMax !== null) && filter.amountType === null) return "금액 범위를 지정하려면 기준을 선택해 주세요.";
  if (filter.amountMin !== null && filter.amountMax !== null && filter.amountMin > filter.amountMax) return "최대금액은 최소금액과 같거나 커야 해요.";
}

export function normalizeBidAmountFilter(filter: BidAmountFilter): BidAmountFilter {
  return filter.amountMin === null && filter.amountMax === null ? emptyBidAmountFilter() : { ...filter };
}

export function bidAmountDraft(filter: BidAmountFilter): BidAmountDraft {
  return { amountType: filter.amountType, amountMin: filter.amountMin === null ? "" : String(filter.amountMin), amountMax: filter.amountMax === null ? "" : String(filter.amountMax) };
}

export function parseBidAmountDraft(draft: BidAmountDraft): { amountFilter: BidAmountFilter; amountError?: string } {
  if ([draft.amountMin, draft.amountMax].some(value => value !== "" && !/^\d+$/.test(value))) {
    return { amountFilter: emptyBidAmountFilter(), amountError: "금액은 원 단위 숫자만 입력해 주세요. 음수·소수·쉼표는 사용할 수 없어요." };
  }
  const filter = { amountType: draft.amountType, amountMin: draft.amountMin === "" ? null : Number(draft.amountMin), amountMax: draft.amountMax === "" ? null : Number(draft.amountMax) };
  const amountError = bidAmountFilterError(filter);
  return { amountFilter: amountError ? emptyBidAmountFilter() : normalizeBidAmountFilter(filter), amountError };
}

export function readBidAmountParams(params: URLSearchParams, view: BidView): { amountFilter?: BidAmountFilter; amountDraft?: BidAmountDraft; amountError?: string } {
  if ((view !== "all" && view !== "closing") || !bidAmountUrlKeys.some(key => params.has(key))) return {};
  const draft: BidAmountDraft = { amountType: (params.get("amountType") || null) as BidAmountFilter["amountType"], amountMin: params.get("amountMin") ?? "", amountMax: params.get("amountMax") ?? "" };
  const parsed = parseBidAmountDraft(draft);
  return { ...parsed, amountDraft: draft, amountError: bidAmountUrlKeys.some(key => params.getAll(key).length > 1) ? "금액 조건은 항목마다 하나씩 입력해 주세요." : parsed.amountError };
}

export function writeBidAmountParams(params: URLSearchParams, filter: BidAmountFilter): void {
  const error = bidAmountFilterError(filter);
  if (error) throw new Error(error);
  bidAmountUrlKeys.forEach(key => params.delete(key));
  const normalized = normalizeBidAmountFilter(filter);
  for (const key of bidAmountUrlKeys) if (normalized[key] !== null) params.set(key, String(normalized[key]));
}

export function presetBidAmountFilter(preset: string, amountType: BidAmountFilter["amountType"] = null): BidAmountFilter {
  const range = Object.hasOwn(bidAmountPresets, preset) ? bidAmountPresets[preset] : undefined;
  return range ? { amountType: amountType ?? "BASE_PRICE", amountMin: range.min, amountMax: range.max } : emptyBidAmountFilter();
}

export function currentBidAmountFilter(query: BidListQuery): BidAmountFilter {
  if (query.view === "result" || query.view === "recommended") return emptyBidAmountFilter();
  const filter = query.amountFilter ?? (query.view === "all" && query.personalFilter
    ? { amountType: query.personalFilter.amountType, amountMin: query.personalFilter.amountMin, amountMax: query.personalFilter.amountMax }
    : presetBidAmountFilter(query.amount ?? ""));
  const error = query.amountError ?? bidAmountFilterError(filter);
  if (error) throw new Error(error);
  return normalizeBidAmountFilter(filter);
}

export function formatBidAmount(value: number | null): string {
  return value === null ? "제한 없음" : `${value.toLocaleString("ko-KR")}원`;
}

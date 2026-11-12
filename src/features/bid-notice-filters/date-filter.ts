import type { BidDateFilter, BidListQuery, BidView } from "@/data/bids/contracts";

export const bidDateUrlKeys = ["dateType", "dateFrom", "dateTo"] as const;
export const bidDateTypes = ["BID_BEGIN", "PARTICIPATION_DEADLINE", "BID_CLOSE"] as const;
export const bidDatePresets = { "1개월": 1, "3개월": 3, "6개월": 6, "1년": 12 } as const;

export function emptyBidDateFilter(): BidDateFilter {
  return { dateType: null, dateFrom: null, dateTo: null };
}

export function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return year >= 1 && month >= 1 && month <= 12 && day >= 1 && day <= days[month - 1];
}

export function bidDateFilterError(filter: BidDateFilter, view: BidView): string | undefined {
  if (filter.dateType !== null && !bidDateTypes.includes(filter.dateType)) return "날짜 기준을 다시 선택해 주세요.";
  if (filter.dateFrom && !isCalendarDate(filter.dateFrom)) return "시작일을 YYYY.MM.DD 형식의 실제 날짜로 입력해 주세요.";
  if (filter.dateTo && !isCalendarDate(filter.dateTo)) return "종료일을 YYYY.MM.DD 형식의 실제 날짜로 입력해 주세요.";
  if (filter.dateFrom && filter.dateTo && filter.dateFrom > filter.dateTo) return "종료일은 시작일과 같거나 이후여야 해요.";
  if (view === "result" && filter.dateType !== null) return "개찰결과의 기간은 개찰일 기준이에요. 날짜 기준을 해제해 주세요.";
  if (view === "all" && (filter.dateFrom || filter.dateTo) && filter.dateType === null) return "기간을 지정하려면 날짜 기준을 선택해 주세요.";
}

export function normalizeBidDateFilter(filter: BidDateFilter): BidDateFilter {
  return filter.dateFrom || filter.dateTo ? { ...filter, dateFrom: filter.dateFrom || null, dateTo: filter.dateTo || null } : emptyBidDateFilter();
}

export function readBidDateParams(params: URLSearchParams, view: BidView): { dateFilter?: BidDateFilter; dateError?: string } {
  if (view === "closing" || view === "recommended" || !bidDateUrlKeys.some(key => params.has(key))) return {};
  const raw: BidDateFilter = {
    dateType: (params.get("dateType") || null) as BidDateFilter["dateType"],
    dateFrom: params.get("dateFrom") || null,
    dateTo: params.get("dateTo") || null,
  };
  const dateError = bidDateUrlKeys.some(key => params.getAll(key).length > 1)
    ? "날짜 조건은 항목마다 하나씩 입력해 주세요."
    : bidDateFilterError(raw, view);
  return { dateFilter: dateError ? raw : normalizeBidDateFilter(raw), dateError };
}

export function writeBidDateParams(params: URLSearchParams, filter: BidDateFilter): void {
  bidDateUrlKeys.forEach(key => params.delete(key));
  const normalized = normalizeBidDateFilter(filter);
  for (const key of bidDateUrlKeys) {
    if (normalized[key] !== null) params.set(key, normalized[key]);
  }
}

export function kstToday(now = Date.now()): string {
  return new Date(now + 9 * 3600_000).toISOString().slice(0, 10);
}

export function presetBidDateFilter(range: string, view: BidView, dateType: BidDateFilter["dateType"] = null, now = Date.now()): BidDateFilter {
  if (!Object.hasOwn(bidDatePresets, range) || view === "closing" || view === "recommended") return emptyBidDateFilter();
  const today = kstToday(now);
  const [year, month, day] = today.split("-").map(Number);
  const start = new Date(Date.UTC(year, month - 1 - bidDatePresets[range as keyof typeof bidDatePresets], 1));
  const lastDay = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)).getUTCDate();
  start.setUTCDate(Math.min(day, lastDay));
  return { dateType: view === "result" ? null : dateType ?? "BID_BEGIN", dateFrom: start.toISOString().slice(0, 10), dateTo: view === "result" ? today : null };
}

export function currentBidDateFilter(query: BidListQuery, now = Date.now()): BidDateFilter {
  if (query.view === "closing" || query.view === "recommended") return emptyBidDateFilter();
  const filter = query.dateFilter ?? (query.view === "all" && query.personalFilter
    ? { dateType: query.personalFilter.dateType, dateFrom: query.personalFilter.dateFrom, dateTo: query.personalFilter.dateTo }
    : presetBidDateFilter(query.period ?? "", query.view, null, now));
  const error = query.dateError ?? bidDateFilterError(filter, query.view);
  if (error) throw new Error(error);
  return normalizeBidDateFilter(filter);
}

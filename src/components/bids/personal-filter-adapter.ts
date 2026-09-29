import type { BidFilterOptions, BidListQuery } from "@/data/bids/contracts";
import type { PersonalFilterValues } from "@/features/bid-notice-filters/model";
import { emptyPersonalFilter } from "@/features/bid-notice-filters/model";

const bidTypeCodes = { construction: "CONSTRUCTION", service: "SERVICE", purchase: "GOODS" } as const;
const bidTypeLabels = { CONSTRUCTION: "공사", SERVICE: "용역", GOODS: "물품" } as const;
const contractMethodCodes = { 일반경쟁: "GENERAL", 제한경쟁: "LIMITED", 지명경쟁: "NOMINATION", 수의계약: "PRIVATE" } as const;
const contractMethodLabels = { GENERAL: "일반경쟁", LIMITED: "제한경쟁", NOMINATION: "지명경쟁", PRIVATE: "수의계약" } as const;
const amountRanges: Record<string, { min: number | null; max: number | null }> = {
  "1억 원 이하": { min: null, max: 100_000_000 },
  "1억 ~ 10억 원 이하": { min: 100_000_001, max: 1_000_000_000 },
  "10억 ~ 50억 원 이하": { min: 1_000_000_001, max: 5_000_000_000 },
  "50억 ~ 100억 원 이하": { min: 5_000_000_001, max: 10_000_000_000 },
  "100억 원+": { min: 10_000_000_001, max: null },
};

function kstToday(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function monthsBefore(date: string, months: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const firstDay = new Date(Date.UTC(year, month - 1 - months, 1));
  const lastDay = new Date(Date.UTC(firstDay.getUTCFullYear(), firstDay.getUTCMonth() + 1, 0)).getUTCDate();
  firstDay.setUTCDate(Math.min(day, lastDay));
  return firstDay.toISOString().slice(0, 10);
}

export function currentPersonalFilter(state: BidListQuery, options: BidFilterOptions): PersonalFilterValues {
  if (state.personalFilter) return state.personalFilter;
  const filter = emptyPersonalFilter();
  if (state.category) filter.bidTypes = [bidTypeCodes[state.category]];
  if (state.region) {
    const code = options.regionOptions.find((option) => option.label === state.region)?.code;
    if (code) filter.regionCodes = [code];
  }
  if (state.industry) {
    const code = options.industryOptions.find((option) => option.label === state.industry)?.code;
    if (code) filter.industryCodes = [code];
  }
  if (state.contract && state.contract in contractMethodCodes) {
    filter.contractMethods = [contractMethodCodes[state.contract as keyof typeof contractMethodCodes]];
  }
  if (state.period) {
    const months = { "1개월": 1, "3개월": 3, "6개월": 6, "1년": 12 }[state.period];
    if (months) {
      const today = kstToday();
      filter.dateType = state.view === "result" ? null : "BID_BEGIN";
      filter.dateFrom = monthsBefore(today, months);
      filter.dateTo = state.view === "result" ? today : null;
    }
  }
  if (state.amount && amountRanges[state.amount]) {
    filter.amountType = "BASE_PRICE";
    filter.amountMin = amountRanges[state.amount].min;
    filter.amountMax = amountRanges[state.amount].max;
  }
  return filter;
}

export function changePersonalFilter(
  filter: PersonalFilterValues,
  key: "category" | "region" | "industry" | "contract" | "period" | "amount",
  value: string | undefined,
  options: BidFilterOptions,
): PersonalFilterValues {
  switch (key) {
    case "category":
      return { ...filter, bidTypes: value && value in bidTypeCodes ? [bidTypeCodes[value as keyof typeof bidTypeCodes]] : [] };
    case "region": {
      const code = options.regionOptions.find((option) => option.label === value)?.code;
      return { ...filter, regionCodes: code ? [code] : [], regionOnly: code ? filter.regionOnly : false };
    }
    case "industry": {
      const code = options.industryOptions.find((option) => option.label === value)?.code;
      return { ...filter, industryCodes: code ? [code] : [] };
    }
    case "contract":
      return { ...filter, contractMethods: value && value in contractMethodCodes ? [contractMethodCodes[value as keyof typeof contractMethodCodes]] : [] };
    case "period": {
      const months = value ? { "1개월": 1, "3개월": 3, "6개월": 6, "1년": 12 }[value] : undefined;
      return months
        ? { ...filter, dateType: "BID_BEGIN", dateFrom: monthsBefore(kstToday(), months), dateTo: null }
        : { ...filter, dateType: null, dateFrom: null, dateTo: null };
    }
    case "amount": {
      const range = value ? amountRanges[value] : undefined;
      return range
        ? { ...filter, amountType: "BASE_PRICE", amountMin: range.min, amountMax: range.max }
        : { ...filter, amountType: null, amountMin: null, amountMax: null };
    }
  }
}

export function personalFilterDisplay(filter: PersonalFilterValues, options: BidFilterOptions) {
  const findLabel = (code: string, values: readonly { code: string; label: string }[]) =>
    values.find((value) => value.code === code)?.label ?? code;
  const formatAmount = (value: number | null) => value === null ? "제한 없음" : `${value.toLocaleString("ko-KR")}원`;
  const chips = [
    ...filter.bidTypes.map((code) => bidTypeLabels[code]),
    ...filter.regionCodes.map((code) => findLabel(code, options.regionOptions)),
    ...filter.industryCodes.map((code) => findLabel(code, options.industryOptions)),
    ...filter.contractMethods.map((code) => contractMethodLabels[code]),
  ];
  if (filter.dateType || filter.dateFrom || filter.dateTo) {
    const label = filter.dateType
      ? { BID_BEGIN: "투찰 시작일", PARTICIPATION_DEADLINE: "참가등록 마감일", BID_CLOSE: "투찰 마감일" }[filter.dateType]
      : "날짜";
    chips.push(`${label} ${filter.dateFrom ?? "처음"} ~ ${filter.dateTo ?? "이후"}`);
  }
  if (filter.amountType || filter.amountMin !== null || filter.amountMax !== null) {
    chips.push(`${filter.amountType === "ESTIMATED_PRICE" ? "추정가격" : "기초금액"} ${formatAmount(filter.amountMin)} ~ ${formatAmount(filter.amountMax)}`);
  }
  if (filter.regionOnly) chips.push("지역 업체만");
  if (filter.jointContract !== "ALL") chips.push(filter.jointContract === "REQUIRED" ? "공동도급 필수" : "공동도급 가능");

  const labels = {
    category: filter.bidTypes.length === 0 ? "전체 유형" : filter.bidTypes.length === 1 ? bidTypeLabels[filter.bidTypes[0]] : `유형 ${filter.bidTypes.length}개`,
    region: filter.regionCodes.length === 0 ? "지역" : filter.regionCodes.length === 1 ? findLabel(filter.regionCodes[0], options.regionOptions) : `지역 ${filter.regionCodes.length}개`,
    industry: filter.industryCodes.length === 0 ? "업종" : filter.industryCodes.length === 1 ? findLabel(filter.industryCodes[0], options.industryOptions) : `업종 ${filter.industryCodes.length}개`,
    contract: filter.contractMethods.length === 0 ? "계약방법" : filter.contractMethods.length === 1 ? contractMethodLabels[filter.contractMethods[0]] : `계약방법 ${filter.contractMethods.length}개`,
    period: filter.dateType || filter.dateFrom || filter.dateTo ? "기간 설정됨" : "기간",
    amount: filter.amountType || filter.amountMin !== null || filter.amountMax !== null ? "금액 설정됨" : "금액",
  };
  return { chips, labels };
}

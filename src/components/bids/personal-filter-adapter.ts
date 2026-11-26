import type { BidFilterOptions, BidListQuery } from "@/data/bids/contracts";
import type { PersonalFilterValues } from "@/features/bid-notice-filters/model";
import { emptyPersonalFilter } from "@/features/bid-notice-filters/model";
import { currentBidDateFilter, presetBidDateFilter } from "@/features/bid-notice-filters/date-filter";
import { currentBidAmountFilter, presetBidAmountFilter } from "@/features/bid-notice-filters/amount-filter";
import { currentBidRegionFilter } from "@/features/bid-notice-filters/region-filter";

const bidTypeCodes = { construction: "CONSTRUCTION", service: "SERVICE", purchase: "GOODS" } as const;
const bidTypeLabels = { CONSTRUCTION: "공사", SERVICE: "용역", GOODS: "물품" } as const;
const contractMethodCodes = { 일반경쟁: "GENERAL", 제한경쟁: "LIMITED", 지명경쟁: "NOMINATION", 수의계약: "PRIVATE" } as const;
const contractMethodLabels = { GENERAL: "일반경쟁", LIMITED: "제한경쟁", NOMINATION: "지명경쟁", PRIVATE: "수의계약" } as const;

export function currentPersonalFilter(state: BidListQuery, options: BidFilterOptions): PersonalFilterValues {
  if (state.personalFilter) return state.personalFilter;
  const filter = { ...emptyPersonalFilter(), ...currentBidRegionFilter(state, options.regionOptions) };
  if (state.category) filter.bidTypes = [bidTypeCodes[state.category]];
  if (state.industry) {
    const code = options.industryOptions.find((option) => option.label === state.industry)?.code;
    if (code) filter.industryCodes = [code];
  }
  if (state.contract && state.contract in contractMethodCodes) {
    filter.contractMethods = [contractMethodCodes[state.contract as keyof typeof contractMethodCodes]];
  }
  Object.assign(filter, currentBidDateFilter(state));
  Object.assign(filter, currentBidAmountFilter(state));
  return filter;
}

export function changePersonalFilter(
  filter: PersonalFilterValues,
  key: "category" | "industry" | "contract" | "period" | "amount",
  value: string | undefined,
  options: BidFilterOptions,
): PersonalFilterValues {
  switch (key) {
    case "category":
      return { ...filter, bidTypes: value && value in bidTypeCodes ? [bidTypeCodes[value as keyof typeof bidTypeCodes]] : [] };
    case "industry": {
      const code = options.industryOptions.find((option) => option.label === value)?.code;
      return { ...filter, industryCodes: code ? [code] : [] };
    }
    case "contract":
      return { ...filter, contractMethods: value && value in contractMethodCodes ? [contractMethodCodes[value as keyof typeof contractMethodCodes]] : [] };
    case "period": {
      return { ...filter, ...presetBidDateFilter(value ?? "", "all", filter.dateType) };
    }
    case "amount": {
      return { ...filter, ...presetBidAmountFilter(value ?? "", filter.amountType) };
    }
  }
}

export function personalFilterDisplay(filter: PersonalFilterValues, options?: BidFilterOptions) {
  const findLabel = (code: string, values: readonly { code: string; label: string }[]) =>
    values.find((value) => value.code === code)?.label ?? code;
  const regionLabel = filter.regionCodes.length === 0 ? "지역" : `지역 ${filter.regionCodes.length}개`;
  const industryLabel = filter.industryCodes.length === 0 ? "업종" : `업종 ${filter.industryCodes.length}개`;
  const regions = options ? filter.regionCodes.map(code => findLabel(code, options.regionOptions)) : filter.regionCodes.length ? [regionLabel] : [];
  const industries = options ? filter.industryCodes.map(code => findLabel(code, options.industryOptions)) : filter.industryCodes.length ? [industryLabel] : [];
  const formatAmount = (value: number | null) => value === null ? "제한 없음" : `${value.toLocaleString("ko-KR")}원`;
  const chips = [
    ...filter.bidTypes.map((code) => bidTypeLabels[code]),
    ...regions,
    ...industries,
    ...filter.contractMethods.map((code) => contractMethodLabels[code]),
  ];
  if (filter.dateType || filter.dateFrom || filter.dateTo) {
    const label = filter.dateType
      ? { BID_BEGIN: "투찰 시작일", PARTICIPATION_DEADLINE: "참가등록 마감일", BID_CLOSE: "투찰 마감일" }[filter.dateType] ?? "날짜"
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
    region: regions.length === 1 ? regions[0] : regionLabel,
    industry: industries.length === 1 ? industries[0] : industryLabel,
    contract: filter.contractMethods.length === 0 ? "계약방법" : filter.contractMethods.length === 1 ? contractMethodLabels[filter.contractMethods[0]] : `계약방법 ${filter.contractMethods.length}개`,
    period: filter.dateType || filter.dateFrom || filter.dateTo ? "기간 설정됨" : "기간",
    amount: filter.amountType || filter.amountMin !== null || filter.amountMax !== null ? "금액 설정됨" : "금액",
  };
  return { chips, labels };
}

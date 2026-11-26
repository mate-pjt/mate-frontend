import { isPersonalFilterValues, type PersonalFilterValues } from "@/data/personal-filters/contracts";
import { bidAmountFilterError, normalizeBidAmountFilter } from "@/features/bid-notice-filters/amount-filter";
import { bidDateFilterError, normalizeBidDateFilter } from "@/features/bid-notice-filters/date-filter";
import { hasPersonalConditions } from "@/features/bid-notice-filters/model";

export function readRecommendedBidFilter(value: unknown): PersonalFilterValues | null {
  if (!isPersonalFilterValues(value)) throw new Error("맞춤 조건의 형식을 확인하지 못했습니다.");

  const {
    bidTypes, regionCodes, industryCodes, contractMethods, regionOnly, jointContract,
    dateType, dateFrom, dateTo, amountType, amountMin, amountMax,
  } = value;
  const dates = { dateType, dateFrom, dateTo };
  const amounts = { amountType, amountMin, amountMax };
  if (
    (regionOnly && regionCodes.length === 0) ||
    regionCodes.some(code => !code.trim()) || industryCodes.some(code => !code.trim()) ||
    dateFrom === "" || dateTo === "" || bidDateFilterError(dates, "all") || bidAmountFilterError(amounts)
  ) throw new Error("맞춤 조건을 적용하지 못했습니다.");

  const filter = {
    bidTypes, regionCodes, industryCodes, contractMethods, regionOnly, jointContract,
    ...normalizeBidDateFilter(dates),
    ...normalizeBidAmountFilter(amounts),
  };
  return hasPersonalConditions(filter) ? filter : null;
}

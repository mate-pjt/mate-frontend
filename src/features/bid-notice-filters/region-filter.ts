import type { BidListQuery, BidRegionFilter, BidRegionOption } from "@/data/bids/contracts";

export const bidRegionUrlKeys = ["regionCodes", "regionOnly", "jointContract"] as const;
export const bidRegionCodeLimit = 50;
const jointContracts = ["ALL", "REQUIRED", "AVAILABLE"] as const;
const regionCodePattern = /^[A-Za-z0-9_-]{1,20}$/;

export function isBidRegionCode(code: unknown): code is string {
  return typeof code === "string" && regionCodePattern.test(code);
}

export function emptyBidRegionFilter(): BidRegionFilter {
  return { regionCodes: [], regionOnly: false, jointContract: "ALL" };
}

export function bidRegionFilterError({ regionCodes, regionOnly, jointContract }: BidRegionFilter): string | undefined {
  if (new Set(regionCodes).size > bidRegionCodeLimit) return `지역은 최대 ${bidRegionCodeLimit}개까지 선택할 수 있어요.`;
  if (!regionCodes.every(isBidRegionCode)) return "지역 코드가 올바르지 않아요.";
  if (typeof regionOnly !== "boolean" || !jointContracts.includes(jointContract)) return "지역 옵션이 올바르지 않아요.";
  if (regionOnly && !regionCodes.length) return "‘지역 업체만’을 적용하려면 지역을 선택해 주세요.";
}

export function readBidRegionParams(params: URLSearchParams): { regionFilter?: BidRegionFilter; regionError?: string } {
  if (!bidRegionUrlKeys.some(key => params.has(key))) return {};

  const only = params.getAll("regionOnly");
  const joint = params.getAll("jointContract");
  const jointContract = jointContracts.find(value => value === (joint[0] ?? "ALL"));
  if (only.length > 1 || joint.length > 1 || (only.length && only[0] !== "true" && only[0] !== "false") || !jointContract) {
    return { regionError: "지역 옵션이 올바르지 않아요." };
  }

  const regionFilter = {
    regionCodes: [...new Set(params.getAll("regionCodes"))],
    regionOnly: only[0] === "true",
    jointContract,
  };
  const regionError = bidRegionFilterError(regionFilter);
  return regionError ? { regionError } : { regionFilter };
}

export function writeBidRegionParams(params: URLSearchParams, filter?: BidRegionFilter): void {
  bidRegionUrlKeys.forEach(key => params.delete(key));
  if (!filter) return;
  new Set(filter.regionCodes).forEach(code => params.append("regionCodes", code));
  if (filter.regionOnly) params.set("regionOnly", "true");
  if (filter.jointContract !== "ALL") params.set("jointContract", filter.jointContract);
}

export function currentBidRegionFilter(query: BidListQuery, options: readonly BidRegionOption[]): BidRegionFilter {
  const filter = (query.view === "all" ? query.personalFilter : undefined) ?? query.regionFilter;
  if (filter) return { regionCodes: filter.regionCodes, regionOnly: filter.regionOnly, jointContract: filter.jointContract };

  const legacy = options.find(option => option.parentCode === null && (option.label === query.region || option.code === query.region));
  return { ...emptyBidRegionFilter(), regionCodes: legacy ? [legacy.code] : [] };
}

export function sameBidRegionFilter(left: BidRegionFilter, right: BidRegionFilter): boolean {
  return left.regionOnly === right.regionOnly && left.jointContract === right.jointContract &&
    left.regionCodes.length === right.regionCodes.length && left.regionCodes.every(code => right.regionCodes.includes(code));
}

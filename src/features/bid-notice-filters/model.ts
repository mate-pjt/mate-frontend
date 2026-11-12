import type { PersonalFilterValues } from "@/data/personal-filters/contracts";
import { readBidDateParams } from "./date-filter";
import { readBidAmountParams } from "./amount-filter";
export type { PersonalFilterSnapshot, PersonalFilterValues } from "@/data/personal-filters/contracts";

export const personalFilterUrlKeys = [
  "bidTypes", "regionCodes", "industryCodes", "contractMethods", "dateType", "dateFrom", "dateTo",
  "amountType", "amountMin", "amountMax", "regionOnly", "jointContract",
] as const;

const bidTypes = new Set(["CONSTRUCTION", "SERVICE", "GOODS"]);
const contractMethods = new Set(["GENERAL", "LIMITED", "NOMINATION", "PRIVATE"]);
const jointContracts = new Set(["ALL", "REQUIRED", "AVAILABLE"]);

export function emptyPersonalFilter(): PersonalFilterValues {
  return {
    bidTypes: [], regionCodes: [], industryCodes: [], contractMethods: [],
    dateType: null, dateFrom: null, dateTo: null,
    amountType: null, amountMin: null, amountMax: null,
    regionOnly: false, jointContract: "ALL",
  };
}

export function readPersonalFilterParams(params: URLSearchParams): PersonalFilterValues | undefined {
  if (params.get("personal") !== "1") return undefined;
  const readArray = (key: string) => [...new Set(params.getAll(key).filter(Boolean))];
  const readEnum = <T extends string>(key: string, allowed: ReadonlySet<string>): T | null => {
    const value = params.get(key);
    return value && allowed.has(value) ? value as T : null;
  };
  const dates = readBidDateParams(params, "all").dateFilter;
  const amounts = readBidAmountParams(params, "all").amountFilter;

  return {
    bidTypes: readArray("bidTypes").filter((value) => bidTypes.has(value)) as PersonalFilterValues["bidTypes"],
    regionCodes: readArray("regionCodes"),
    industryCodes: readArray("industryCodes"),
    contractMethods: readArray("contractMethods").filter((value) => contractMethods.has(value)) as PersonalFilterValues["contractMethods"],
    dateType: dates?.dateType ?? null,
    dateFrom: dates?.dateFrom ?? null,
    dateTo: dates?.dateTo ?? null,
    amountType: amounts?.amountType ?? null,
    amountMin: amounts?.amountMin ?? null,
    amountMax: amounts?.amountMax ?? null,
    regionOnly: params.get("regionOnly") === "true",
    jointContract: readEnum("jointContract", jointContracts) ?? "ALL",
  };
}

export function writePersonalFilterParams(params: URLSearchParams, filter?: PersonalFilterValues): void {
  params.delete("personal");
  personalFilterUrlKeys.forEach((key) => params.delete(key));
  if (!filter) return;

  params.set("personal", "1");
  for (const key of ["bidTypes", "regionCodes", "industryCodes", "contractMethods"] as const) {
    filter[key].forEach((value) => params.append(key, value));
  }
  for (const key of ["dateType", "dateFrom", "dateTo", "amountType", "amountMin", "amountMax"] as const) {
    const value = filter[key];
    if (value !== null) params.set(key, String(value));
  }
  if (filter.regionOnly) params.set("regionOnly", "true");
  if (filter.jointContract !== "ALL") params.set("jointContract", filter.jointContract);
}

export function samePersonalFilter(left: PersonalFilterValues, right: PersonalFilterValues): boolean {
  const arrays = ["bidTypes", "regionCodes", "industryCodes", "contractMethods"] as const;
  return arrays.every((key) => JSON.stringify([...left[key]].sort()) === JSON.stringify([...right[key]].sort())) &&
    left.dateType === right.dateType && left.dateFrom === right.dateFrom && left.dateTo === right.dateTo &&
    left.amountType === right.amountType && left.amountMin === right.amountMin && left.amountMax === right.amountMax &&
    left.regionOnly === right.regionOnly && left.jointContract === right.jointContract;
}

export function hasPersonalConditions(filter: PersonalFilterValues): boolean {
  return filter.bidTypes.length > 0 || filter.regionCodes.length > 0 || filter.industryCodes.length > 0 ||
    filter.contractMethods.length > 0 || filter.dateType !== null || filter.dateFrom !== null ||
    filter.dateTo !== null || filter.amountType !== null || filter.amountMin !== null ||
    filter.amountMax !== null || filter.regionOnly || filter.jointContract !== "ALL";
}

import type { BidTypeDto, ContractMethodDto } from "@/data/bids/api-types";

export type PersonalFilterValues = {
  bidTypes: BidTypeDto[];
  regionCodes: string[];
  industryCodes: string[];
  contractMethods: ContractMethodDto[];
  dateType: "BID_BEGIN" | "PARTICIPATION_DEADLINE" | "BID_CLOSE" | null;
  dateFrom: string | null;
  dateTo: string | null;
  amountType: "BASE_PRICE" | "ESTIMATED_PRICE" | null;
  amountMin: number | null;
  amountMax: number | null;
  regionOnly: boolean;
  jointContract: "ALL" | "REQUIRED" | "AVAILABLE";
};

export type PersonalFilterSnapshot = {
  source: "SAVED" | "COMPANY_DEFAULT" | "EMPTY_DEFAULT";
  version: number | null;
  canImportCompany: boolean;
  filter: PersonalFilterValues;
};

export const personalFilterUrlKeys = [
  "bidTypes", "regionCodes", "industryCodes", "contractMethods", "dateType", "dateFrom", "dateTo",
  "amountType", "amountMin", "amountMax", "regionOnly", "jointContract",
] as const;

const bidTypes = new Set(["CONSTRUCTION", "SERVICE", "GOODS"]);
const contractMethods = new Set(["GENERAL", "LIMITED", "NOMINATION", "PRIVATE"]);
const dateTypes = new Set(["BID_BEGIN", "PARTICIPATION_DEADLINE", "BID_CLOSE"]);
const amountTypes = new Set(["BASE_PRICE", "ESTIMATED_PRICE"]);
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
  const readDate = (key: string) => {
    const value = params.get(key);
    return value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) ? value : null;
  };
  const readAmount = (key: string) => {
    const value = params.get(key);
    if (value === null || value === "") return null;
    const parsed = Number(value);
    return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
  };

  return {
    bidTypes: readArray("bidTypes").filter((value) => bidTypes.has(value)) as PersonalFilterValues["bidTypes"],
    regionCodes: readArray("regionCodes"),
    industryCodes: readArray("industryCodes"),
    contractMethods: readArray("contractMethods").filter((value) => contractMethods.has(value)) as PersonalFilterValues["contractMethods"],
    dateType: readEnum("dateType", dateTypes),
    dateFrom: readDate("dateFrom"),
    dateTo: readDate("dateTo"),
    amountType: readEnum("amountType", amountTypes),
    amountMin: readAmount("amountMin"),
    amountMax: readAmount("amountMax"),
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

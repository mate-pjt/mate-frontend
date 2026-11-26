export type BidType = "CONSTRUCTION" | "SERVICE" | "GOODS";
export type ContractMethod = "GENERAL" | "LIMITED" | "NOMINATION" | "PRIVATE";

export type PersonalFilterValues = {
  bidTypes: BidType[];
  regionCodes: string[];
  industryCodes: string[];
  contractMethods: ContractMethod[];
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

export function isPersonalFilterValues(value: unknown): value is PersonalFilterValues {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const filter = value as Record<string, unknown>;
  const strings = (items: unknown): items is string[] => Array.isArray(items) && items.every(item => typeof item === "string");
  const amount = (item: unknown) => item === null || (typeof item === "number" && Number.isSafeInteger(item) && item >= 0);
  return strings(filter.bidTypes) && filter.bidTypes.every(item => ["CONSTRUCTION", "SERVICE", "GOODS"].includes(item)) &&
    strings(filter.regionCodes) && strings(filter.industryCodes) &&
    strings(filter.contractMethods) && filter.contractMethods.every(item => ["GENERAL", "LIMITED", "NOMINATION", "PRIVATE"].includes(item)) &&
    (filter.dateType === null || filter.dateType === "BID_BEGIN" || filter.dateType === "PARTICIPATION_DEADLINE" || filter.dateType === "BID_CLOSE") &&
    (filter.dateFrom === null || typeof filter.dateFrom === "string") &&
    (filter.dateTo === null || typeof filter.dateTo === "string") &&
    (filter.amountType === null || filter.amountType === "BASE_PRICE" || filter.amountType === "ESTIMATED_PRICE") &&
    amount(filter.amountMin) && amount(filter.amountMax) &&
    typeof filter.regionOnly === "boolean" &&
    (filter.jointContract === "ALL" || filter.jointContract === "REQUIRED" || filter.jointContract === "AVAILABLE");
}

import type { AuthAccess } from "../shared/http";

export interface PersonalFiltersRepository {
  getPersonalFilter(access: AuthAccess, signal?: AbortSignal): Promise<PersonalFilterSnapshot>;
  savePersonalFilter(access: AuthAccess, expectedVersion: number | null, filter: PersonalFilterValues): Promise<PersonalFilterSnapshot>;
  resetPersonalFilter(access: AuthAccess, expectedVersion: number | null): Promise<PersonalFilterSnapshot>;
}

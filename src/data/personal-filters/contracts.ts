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

import type { AuthAccess } from "../shared/http";

export interface PersonalFiltersRepository {
  getPersonalFilter(access: AuthAccess, signal?: AbortSignal): Promise<PersonalFilterSnapshot>;
  savePersonalFilter(access: AuthAccess, expectedVersion: number | null, filter: PersonalFilterValues): Promise<PersonalFilterSnapshot>;
  resetPersonalFilter(access: AuthAccess, expectedVersion: number | null): Promise<PersonalFilterSnapshot>;
}

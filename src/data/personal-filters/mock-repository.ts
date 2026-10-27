import { emptyPersonalFilter } from "@/features/bid-notice-filters/model";
import { ApiError } from "../shared/errors";
import { mockAccount, type MockRuntime } from "../mock/runtime";
import { isCount, isRecord } from "../mock/validation";
import type { PersonalFiltersRepository, PersonalFilterSnapshot } from "./contracts";

export function validPersonalFilter(value: unknown): value is PersonalFilterSnapshot {
  if (!isRecord(value) || !isRecord(value.filter)) return false;
  const f = value.filter;
  return ["SAVED", "COMPANY_DEFAULT", "EMPTY_DEFAULT"].includes(String(value.source)) && (value.version === null || isCount(value.version)) && typeof value.canImportCompany === "boolean" &&
    ["bidTypes", "regionCodes", "industryCodes", "contractMethods"].every(key => Array.isArray(f[key]) && f[key].every((item: unknown) => typeof item === "string")) &&
    (f.bidTypes as string[]).every(item => ["CONSTRUCTION", "SERVICE", "GOODS"].includes(item)) && (f.contractMethods as string[]).every(item => ["GENERAL", "LIMITED", "NOMINATION", "PRIVATE"].includes(item)) &&
    [null, "BID_BEGIN", "PARTICIPATION_DEADLINE", "BID_CLOSE"].includes(f.dateType as null) && [null, "BASE_PRICE", "ESTIMATED_PRICE"].includes(f.amountType as null) &&
    ["dateFrom", "dateTo"].every(key => f[key] === null || (typeof f[key] === "string" && /^\d{4}-\d{2}-\d{2}$/.test(f[key]))) && ["amountMin", "amountMax"].every(key => f[key] === null || isCount(f[key])) &&
    typeof f.regionOnly === "boolean" && ["ALL", "REQUIRED", "AVAILABLE"].includes(String(f.jointContract));
}
export function createMockPersonalFiltersRepository(runtime: MockRuntime): PersonalFiltersRepository {
  const read = (account: string) => runtime.store.read(account, "personal-filters", () => ({ source: "EMPTY_DEFAULT" as const, version: null, canImportCompany: false, filter: emptyPersonalFilter() }), validPersonalFilter);
  function checkVersion(snapshot: PersonalFilterSnapshot, version: number | null) {
    if (runtime.scenario("personalFilters") === "conflict" || snapshot.version !== version) throw new ApiError(409, "VERSION_CONFLICT", "필터가 변경됐습니다. 다시 불러온 뒤 저장해 주세요.");
  }
  return {
    async getPersonalFilter(access, signal) { return read(await mockAccount(runtime, access, "personalFilters", signal)); },
    async savePersonalFilter(access, expectedVersion, filter) {
      const account = await mockAccount(runtime, access, "personalFilters"); const current = read(account); checkVersion(current, expectedVersion);
      const next: PersonalFilterSnapshot = { source: "SAVED", version: (current.version ?? 0) + 1, canImportCompany: current.canImportCompany, filter: structuredClone(filter) };
      if (!validPersonalFilter(next)) throw new ApiError(400, "FILTER_INVALID", "필터 값을 확인해 주세요.");
      runtime.store.write(account, "personal-filters", next); return next;
    },
    async resetPersonalFilter(access, expectedVersion) {
      const account = await mockAccount(runtime, access, "personalFilters"); const current = read(account); checkVersion(current, expectedVersion);
      const next: PersonalFilterSnapshot = { source: "EMPTY_DEFAULT", version: (current.version ?? 0) + 1, canImportCompany: false, filter: emptyPersonalFilter() };
      runtime.store.write(account, "personal-filters", next); return next;
    },
  };
}

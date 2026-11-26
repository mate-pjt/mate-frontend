import { ApiError } from "../shared/errors";
import type { AuthAccess, HttpClient } from "../shared/http";

import { isPersonalFilterValues, type PersonalFilterSnapshot, type PersonalFilterValues, type PersonalFiltersRepository } from "./contracts";

export function createHttpPersonalFiltersRepository(http: HttpClient): PersonalFiltersRepository {
  const authorizedRequest = http.authorized;
  const path = "/api/v1/bid-notice-filters/current";

  function invalidResponse(): never {
    throw new ApiError(200, "INVALID_PERSONAL_FILTER_RESPONSE", "서버의 맞춤 필터 응답을 확인하지 못했습니다.");
  }

  function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  function parseSnapshot(value: unknown): PersonalFilterSnapshot {
    if (
      !isRecord(value) || (value.source !== "SAVED" && value.source !== "COMPANY_DEFAULT" && value.source !== "EMPTY_DEFAULT") ||
      !(value.version === null || (typeof value.version === "number" && Number.isSafeInteger(value.version) && value.version >= 0)) ||
      typeof value.canImportCompany !== "boolean" ||
      !isPersonalFilterValues(value.filter)
    ) return invalidResponse();

    return { source: value.source, version: value.version, canImportCompany: value.canImportCompany, filter: value.filter };
  }

  async function getPersonalFilter(access: AuthAccess, signal?: AbortSignal) {
    return parseSnapshot(await authorizedRequest<unknown>(access, path, { signal }));
  }

  async function savePersonalFilter(access: AuthAccess, expectedVersion: number | null, filter: PersonalFilterValues) {
    return parseSnapshot(await authorizedRequest<unknown>(access, path, {
      method: "PUT", body: { expectedVersion, filter },
    }));
  }

  async function resetPersonalFilter(access: AuthAccess, expectedVersion: number | null) {
    return parseSnapshot(await authorizedRequest<unknown>(access, `${path}/reset`, {
      method: "POST", body: { expectedVersion },
    }));
  }

  return { getPersonalFilter, savePersonalFilter, resetPersonalFilter };
}

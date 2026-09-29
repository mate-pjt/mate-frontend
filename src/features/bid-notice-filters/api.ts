import { ApiError, authorizedRequest, type AuthAccess } from "@/features/auth/api";

import type { PersonalFilterSnapshot, PersonalFilterValues } from "./model";

const path = "/api/v1/bid-notice-filters/current";

function invalidResponse(): never {
  throw new ApiError(200, "INVALID_PERSONAL_FILTER_RESPONSE", "서버의 맞춤 필터 응답을 확인하지 못했습니다.");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isNullableAmount(value: unknown): value is number | null {
  return value === null || (typeof value === "number" && Number.isSafeInteger(value) && value >= 0);
}

function parseSnapshot(value: unknown): PersonalFilterSnapshot {
  if (!isRecord(value) || !isRecord(value.filter)) return invalidResponse();
  const filter = value.filter;
  if (
    !["SAVED", "COMPANY_DEFAULT", "EMPTY_DEFAULT"].includes(String(value.source)) ||
    !(value.version === null || (typeof value.version === "number" && Number.isSafeInteger(value.version) && value.version >= 0)) ||
    typeof value.canImportCompany !== "boolean" ||
    !isStringArray(filter.bidTypes) || !filter.bidTypes.every((item) => ["CONSTRUCTION", "SERVICE", "GOODS"].includes(item)) ||
    !isStringArray(filter.regionCodes) || !isStringArray(filter.industryCodes) ||
    !isStringArray(filter.contractMethods) || !filter.contractMethods.every((item) => ["GENERAL", "LIMITED", "NOMINATION", "PRIVATE"].includes(item)) ||
    !isNullableString(filter.dateType) || (filter.dateType !== null && !["BID_BEGIN", "PARTICIPATION_DEADLINE", "BID_CLOSE"].includes(filter.dateType)) ||
    !isNullableString(filter.dateFrom) || !isNullableString(filter.dateTo) ||
    !isNullableString(filter.amountType) || (filter.amountType !== null && !["BASE_PRICE", "ESTIMATED_PRICE"].includes(filter.amountType)) ||
    !isNullableAmount(filter.amountMin) || !isNullableAmount(filter.amountMax) ||
    typeof filter.regionOnly !== "boolean" || !["ALL", "REQUIRED", "AVAILABLE"].includes(String(filter.jointContract))
  ) return invalidResponse();

  return value as PersonalFilterSnapshot;
}

export async function getPersonalFilter(access: AuthAccess, signal?: AbortSignal) {
  return parseSnapshot(await authorizedRequest<unknown>(access, path, { signal }));
}

export async function savePersonalFilter(access: AuthAccess, expectedVersion: number | null, filter: PersonalFilterValues) {
  return parseSnapshot(await authorizedRequest<unknown>(access, path, {
    method: "PUT", body: { expectedVersion, filter },
  }));
}

export async function resetPersonalFilter(access: AuthAccess, expectedVersion: number | null) {
  return parseSnapshot(await authorizedRequest<unknown>(access, `${path}/reset`, {
    method: "POST", body: { expectedVersion },
  }));
}

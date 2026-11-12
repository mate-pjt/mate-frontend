import { ApiError } from "../shared/errors";
import type { CompanyBasicProfile } from "./contracts";

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const textOrNull = (value: unknown): value is string | null => value === null || typeof value === "string";
const nonEmptyText = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

function invalidProfile(): never {
  throw new ApiError(0, "COMPANY_PROFILE_INVALID", "회사 정보를 확인하지 못했어요. 다시 시도해 주세요.");
}

export function mapCompanyBasicProfile(value: unknown): CompanyBasicProfile {
  if (!isRecord(value)) return invalidProfile();
  const { companyId, companyName, businessNumber, representativeName, verificationStatus, address, telephoneNumber, establishedYear } = value;
  if (typeof companyId !== "number" || !Number.isSafeInteger(companyId) || companyId <= 0 || typeof companyName !== "string" || typeof businessNumber !== "string" || !textOrNull(representativeName) || !textOrNull(telephoneNumber) || !(establishedYear === null || (typeof establishedYear === "number" && Number.isInteger(establishedYear)))) return invalidProfile();
  if (verificationStatus !== "LEGACY" && verificationStatus !== "VERIFIED" && verificationStatus !== "UNVERIFIED") return invalidProfile();
  if (!(address === null || (isRecord(address) && textOrNull(address.zipCode) && textOrNull(address.baseAddress) && textOrNull(address.detailAddress)))) return invalidProfile();

  // An explicit list, including [], owns the value. Only older responses omit it.
  const rawIndustries = Object.hasOwn(value, "primaryIndustries")
    ? value.primaryIndustries
    : Object.hasOwn(value, "primaryIndustry") ? (value.primaryIndustry === null ? [] : [value.primaryIndustry]) : undefined;
  if (!Array.isArray(rawIndustries)) return invalidProfile();
  const industries = new Map<string, { code: string; name: string }>();
  for (const item of rawIndustries) {
    if (!isRecord(item) || !nonEmptyText(item.code) || !nonEmptyText(item.name)) return invalidProfile();
    const previous = industries.get(item.code);
    if (previous && previous.name !== item.name) return invalidProfile();
    if (!previous) industries.set(item.code, { code: item.code, name: item.name });
  }
  return {
    companyId, companyName, businessNumber, representativeName, verificationStatus,
    address: address === null ? null : { zipCode: address.zipCode as string | null, baseAddress: address.baseAddress as string | null, detailAddress: address.detailAddress as string | null },
    telephoneNumber, establishedYear, primaryIndustries: [...industries.values()],
  };
}

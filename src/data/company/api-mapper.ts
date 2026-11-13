import { ApiError } from "../shared/errors";
import type { CompanyBasicProfile, MyMembershipRequest } from "./contracts";

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

export function mapMyMembershipRequest(value: unknown): MyMembershipRequest {
  const invalid = (): never => { throw new ApiError(0, "MEMBERSHIP_RESPONSE_INVALID", "소속 신청 응답을 확인하지 못했어요. 최신 상태를 다시 확인해 주세요."); };
  const positive = (item: unknown): item is number => typeof item === "number" && Number.isSafeInteger(item) && item > 0;
  const date = (item: unknown): item is string => typeof item === "string" && /^\d{4}-\d{2}-\d{2}T/.test(item) && Number.isFinite(Date.parse(item));
  if (!isRecord(value) || !isRecord(value.company)) return invalid();
  const { requestId, version, company, requestedRepresentative, requestedPositionName, proposedPositionName, status, rejectionReason, createdAt, updatedAt, completedAt } = value;
  if (!positive(requestId) || !positive(version) || typeof requestedRepresentative !== "boolean" || !textOrNull(requestedPositionName) || !textOrNull(proposedPositionName) || !textOrNull(rejectionReason)) return invalid();
  if (status !== "PENDING" && status !== "CANCELED" && status !== "APPROVED" && status !== "REJECTED") return invalid();
  if (!date(createdAt) || !date(updatedAt) || !(completedAt === null || date(completedAt)) || Date.parse(updatedAt) < Date.parse(createdAt)) return invalid();
  if ((status === "PENDING" && completedAt !== null) || (status !== "PENDING" && (completedAt === null || Date.parse(completedAt) < Date.parse(createdAt)))) return invalid();
  const { companyId, companyName, businessNumber, baseAddress, verificationStatus } = company;
  if (!positive(companyId) || typeof companyName !== "string" || typeof businessNumber !== "string" || !textOrNull(baseAddress)) return invalid();
  if (verificationStatus !== "LEGACY" && verificationStatus !== "VERIFIED" && verificationStatus !== "UNVERIFIED") return invalid();
  return { requestId, version, company: { companyId, companyName, businessNumber, baseAddress, verificationStatus }, requestedRepresentative, requestedPositionName, proposedPositionName, status, rejectionReason, createdAt, updatedAt, completedAt };
}

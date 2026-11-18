import { ApiError } from "../shared/errors";
import type { HttpClient } from "../shared/http";
import { timestamp, validateTeamMemberId, validateTeamQuery } from "./team-api";
import type { CompanyTeamMembershipRequestRepository, TeamMembershipRequest, TeamMembershipRequestPage, TeamMembershipReviewCapabilities } from "./team-membership-request-contracts";
import { membershipRejectionReason, normalizeMembershipApproval, validateMembershipReviewVersion } from "./team-membership-request-input";

const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const positive = (v: unknown): v is number => typeof v === "number" && Number.isSafeInteger(v) && v > 0;
const nullableText = (v: unknown): v is string | null => v === null || typeof v === "string";
const nullableId = (v: unknown): v is number | null => v === null || positive(v);
function invalid(): never { throw new ApiError(0, "MEMBERSHIP_REVIEW_RESPONSE_INVALID", "신청 처리 결과를 확인하지 못했어요. 현재 상태를 다시 조회해 주세요."); }
export function compareMembershipRequestTime(a: string, b: string): number {
  const fraction = (v: string) => (v.match(/\.(\d+)/)?.[1] ?? "").padEnd(9, "0");
  return Date.parse(a) - Date.parse(b) || fraction(a).localeCompare(fraction(b));
}
function capabilities(v: unknown): TeamMembershipReviewCapabilities {
  const keys: Array<keyof TeamMembershipReviewCapabilities> = ["canReview", "canEditPosition", "canManagePermissions", "canApproveRepresentative"];
  if (!record(v) || keys.some(key => typeof v[key] !== "boolean")) invalid();
  return Object.fromEntries(keys.map(key => [key, v[key]])) as TeamMembershipReviewCapabilities;
}
export function mapTeamMembershipRequest(v: unknown, companyId: number, requestId?: number): TeamMembershipRequest {
  if (!record(v) || !positive(v.requestId) || requestId !== undefined && v.requestId !== requestId || v.companyId !== companyId
    || !nullableText(v.accountName) || !nullableText(v.googleVerifiedEmail) || typeof v.requestedRepresentative !== "boolean"
    || !nullableId(v.requestedPositionId) || !nullableText(v.requestedPositionName) || !nullableText(v.proposedPositionName) || !nullableText(v.message)
    || !["PENDING", "CANCELED", "APPROVED", "REJECTED"].includes(String(v.status)) || !positive(v.version) || !nullableText(v.rejectionReason)
    || !(v.appliedRepresentative === null || typeof v.appliedRepresentative === "boolean") || !nullableId(v.appliedPositionId)
    || !nullableText(v.appliedPositionName) || !nullableId(v.appliedMembershipId) || !(v.appliedRole === null || ["ADMIN", "AGENT", "VIEWER"].includes(String(v.appliedRole)))
    || !Array.isArray(v.appliedPermissions) || v.appliedPermissions.some(p => typeof p !== "string" || !/^[A-Z][A-Z0-9_]*$/.test(p)) || new Set(v.appliedPermissions).size !== v.appliedPermissions.length
    || !timestamp(v.createdAt) || !timestamp(v.updatedAt) || !(v.completedAt === null || timestamp(v.completedAt))) invalid();
  if (compareMembershipRequestTime(v.updatedAt, v.createdAt) < 0 || v.completedAt !== null && (compareMembershipRequestTime(v.completedAt, v.createdAt) < 0 || compareMembershipRequestTime(v.updatedAt, v.completedAt) < 0)
    || v.requestedRepresentative && (v.requestedPositionId !== null || v.proposedPositionName !== null)
    || !v.requestedRepresentative && (v.requestedPositionId === null) === (v.proposedPositionName === null)
    || v.status === "PENDING" && v.completedAt !== null || v.status !== "PENDING" && v.completedAt === null) invalid();
  if (v.status === "APPROVED") {
    if (typeof v.appliedRepresentative !== "boolean" || !positive(v.appliedPositionId) || !v.appliedPositionName?.trim() || !positive(v.appliedMembershipId) || v.appliedRole === null || !v.appliedPermissions.length
      || v.appliedRepresentative && (!v.requestedRepresentative || v.appliedRole !== "ADMIN") || v.rejectionReason !== null) invalid();
  } else if (v.appliedRepresentative !== null || v.appliedPositionId !== null || v.appliedPositionName !== null || v.appliedMembershipId !== null || v.appliedRole !== null || v.appliedPermissions.length) invalid();
  if (v.status === "REJECTED") { try { if (membershipRejectionReason(v.rejectionReason as string) !== v.rejectionReason) invalid(); } catch { invalid(); } }
  else if (v.rejectionReason !== null) invalid();
  return { requestId: v.requestId, companyId, accountName: v.accountName, googleVerifiedEmail: v.googleVerifiedEmail,
    requestedRepresentative: v.requestedRepresentative, requestedPositionId: v.requestedPositionId, requestedPositionName: v.requestedPositionName, proposedPositionName: v.proposedPositionName,
    message: v.message, status: v.status as TeamMembershipRequest["status"], version: v.version, rejectionReason: v.rejectionReason,
    appliedRepresentative: v.appliedRepresentative, appliedPositionId: v.appliedPositionId, appliedPositionName: v.appliedPositionName, appliedMembershipId: v.appliedMembershipId,
    appliedRole: v.appliedRole as TeamMembershipRequest["appliedRole"], appliedPermissions: [...v.appliedPermissions] as string[], capabilities: capabilities(v.capabilities),
    createdAt: v.createdAt, updatedAt: v.updatedAt, completedAt: v.completedAt };
}
export function mapTeamMembershipRequestPage(v: unknown, companyId: number, page: number, size: number): TeamMembershipRequestPage {
  if (!record(v) || !Array.isArray(v.content) || v.page !== page || v.size !== size || !Number.isSafeInteger(v.totalElements) || (v.totalElements as number) < 0
    || v.totalPages !== Math.ceil((v.totalElements as number) / size) || v.content.length !== Math.max(0, Math.min(size, (v.totalElements as number) - page * size))) invalid();
  const content = v.content.map(row => mapTeamMembershipRequest(row, companyId));
  if (content.some(row => row.status !== "PENDING") || new Set(content.map(row => row.requestId)).size !== content.length) invalid();
  for (let i = 1; i < content.length; i++) {
    const a = content[i - 1], b = content[i], order = compareMembershipRequestTime(a.createdAt, b.createdAt);
    if (order > 0 || order === 0 && a.requestId >= b.requestId) invalid();
  }
  return { content, capabilities: capabilities(v.capabilities), page, size, totalElements: v.totalElements as number, totalPages: v.totalPages as number };
}
export function createTeamMembershipRequests(http: HttpClient): CompanyTeamMembershipRequestRepository {
  const path = (companyId: number) => `/api/v1/companies/${companyId}/membership-requests`;
  function ids(companyId: number, requestId: number) { validateTeamQuery(companyId); validateTeamMemberId(requestId); }
  return {
    async listTeamMembershipRequests(access, companyId, page = 0, size = 20, signal) {
      validateTeamQuery(companyId, page, size);
      return mapTeamMembershipRequestPage(await http.authorized<unknown>(access, `${path(companyId)}?${new URLSearchParams({ page: String(page), size: String(size) })}`, { signal }), companyId, page, size);
    },
    async getTeamMembershipRequest(access, companyId, requestId, signal) {
      ids(companyId, requestId);
      const row = mapTeamMembershipRequest(await http.authorized<unknown>(access, `${path(companyId)}/${requestId}`, { signal }), companyId, requestId);
      if (row.status !== "PENDING") invalid();
      return row;
    },
    async approveTeamMembershipRequest(access, companyId, requestId, input, signal) {
      ids(companyId, requestId); const body = normalizeMembershipApproval(input);
      const row = mapTeamMembershipRequest(await http.authorized<unknown>(access, `${path(companyId)}/${requestId}/approval`, { method: "POST", body, signal }), companyId, requestId);
      if (row.status !== "APPROVED" || row.version !== body.expectedVersion + 1 || row.appliedRepresentative !== body.representative
        || !body.representative && (body.positionId !== null ? row.appliedPositionId !== body.positionId : row.appliedPositionName !== body.positionName)) invalid();
      return row;
    },
    async rejectTeamMembershipRequest(access, companyId, requestId, expectedVersion, raw, signal) {
      ids(companyId, requestId); validateMembershipReviewVersion(expectedVersion); const reason = membershipRejectionReason(raw);
      const row = mapTeamMembershipRequest(await http.authorized<unknown>(access, `${path(companyId)}/${requestId}/rejection`, { method: "POST", body: { expectedVersion, reason }, signal }), companyId, requestId);
      if (row.status !== "REJECTED" || row.version !== expectedVersion + 1 || row.rejectionReason !== reason) invalid();
      return row;
    },
  };
}

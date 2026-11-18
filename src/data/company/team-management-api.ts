import { ApiError } from "../shared/errors";
import type { AuthAccess, HttpClient } from "../shared/http";
import { timestamp, validateTeamMemberId, validateTeamQuery } from "./team-api";
import type { CompanyTeamManagementRepository, TeamChangeCreated, TeamChangePage, TeamChangeProposal, TeamChangeQuery, TeamChangeRequest, TeamChangeStatus, TeamMutation, TeamPosition } from "./team-management-contracts";
import { hasTeamPositionName, normalizeTeamPositionName } from "./team-position-input";

const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const positive = (v: unknown): v is number => typeof v === "number" && Number.isSafeInteger(v) && v > 0;
const text = (v: unknown): v is string => typeof v === "string" && !!v.trim();
const kinds = ["POSITION", "PERMISSIONS", "POSITION_AND_PERMISSIONS", "REMOVE"];
export const teamChangeStatuses: TeamChangeStatus[] = ["PENDING", "APPLIED", "REJECTED", "CANCELED", "INVALIDATED"];
function invalid(): never { throw new ApiError(0, "TEAM_COMMAND_RESPONSE_INVALID", "처리 결과를 확인하지 못했어요. 현재 상태를 다시 조회해 주세요."); }
function input(): never { throw new ApiError(400, "TEAM_COMMAND_INPUT_INVALID", "변경할 대상과 내용을 다시 확인해 주세요."); }
function codes(value: unknown): string[] {
  if (!Array.isArray(value) || !value.length || !value.every(v => text(v) && /^[A-Z][A-Z0-9_]*$/.test(v)) || new Set(value).size !== value.length) invalid();
  return [...value];
}
export function mapTeamPosition(value: unknown): TeamPosition {
  if (!object(value) || !positive(value.id) || !positive(value.version) || !hasTeamPositionName(value.name) || (value.type !== "CUSTOM" && value.type !== "REPRESENTATIVE")) invalid();
  if ("system" in value && value.system !== (value.type === "REPRESENTATIVE")) invalid();
  return { id: value.id, version: value.version, name: value.name, type: value.type };
}
function mapPositionWrite(value: unknown, name: string, positionId?: number, expectedVersion?: number): TeamPosition {
  const position = mapTeamPosition(value);
  if (!object(value) || value.system !== false || !timestamp(value.createdAt) || !timestamp(value.updatedAt)
    || Date.parse(value.updatedAt) < Date.parse(value.createdAt) || position.type !== "CUSTOM" || position.name !== name) invalid();
  if (positionId === undefined ? position.version !== 1
    : position.id !== positionId || expectedVersion === undefined || (position.version !== expectedVersion && position.version !== expectedVersion + 1)) invalid();
  return position;
}
export function mapTeamMutation(value: unknown, membershipId: number): TeamMutation {
  if (!object(value) || value.membershipId !== membershipId || !positive(value.companyId) || !positive(value.positionId) || !positive(value.version)
    || !hasTeamPositionName(value.positionName) || !["CUSTOM", "REPRESENTATIVE"].includes(String(value.positionType))
    || !["ADMIN", "AGENT", "VIEWER"].includes(String(value.role)) || !["ACTIVE", "LEFT", "REMOVED"].includes(String(value.status))
    || !timestamp(value.joinedAt) || !timestamp(value.updatedAt) || !(value.endedAt === null || timestamp(value.endedAt))) invalid();
  if (Date.parse(value.updatedAt) < Date.parse(value.joinedAt) || (value.status === "ACTIVE") !== (value.endedAt === null)
    || value.endedAt !== null && Date.parse(value.endedAt) !== Date.parse(value.updatedAt)) invalid();
  return { membershipId, companyId: value.companyId, positionId: value.positionId, positionName: value.positionName,
    positionType: value.positionType as TeamMutation["positionType"], permissions: codes(value.permissions), role: value.role as TeamMutation["role"],
    status: value.status as TeamMutation["status"], version: value.version, joinedAt: value.joinedAt, endedAt: value.endedAt, updatedAt: value.updatedAt };
}
export function mapTeamChangeRequest(value: unknown, id?: number): TeamChangeRequest {
  if (!object(value) || !positive(value.changeRequestId) || id !== undefined && value.changeRequestId !== id || !positive(value.companyId)
    || !positive(value.targetMembershipId) || !positive(value.requestVersion) || !positive(value.expectedMembershipVersion)
    || !kinds.includes(String(value.kind)) || !teamChangeStatuses.includes(value.status as TeamChangeStatus)
    || !(value.issuerName === null || typeof value.issuerName === "string") || !timestamp(value.createdAt)
    || !(value.processedAt === null || timestamp(value.processedAt)) || !(value.invalidationReason === null || text(value.invalidationReason))
    || !(value.appliedMembershipVersion === null || positive(value.appliedMembershipVersion)) || !object(value.capabilities)) invalid();
  const c = value.capabilities;
  if (["canAccept", "canReject", "canCancel"].some(key => typeof c[key] !== "boolean") || !(c.blockingReason === null || text(c.blockingReason))) invalid();
  const ended = value.status !== "PENDING";
  if (ended && (c.canAccept || c.canReject || c.canCancel) || value.status === "PENDING" && (value.processedAt !== null || value.appliedMembershipVersion !== null)
    || ["APPLIED", "REJECTED", "CANCELED"].includes(String(value.status)) && value.processedAt === null
    || value.status === "APPLIED" && !positive(value.appliedMembershipVersion)
    || value.processedAt !== null && Date.parse(value.processedAt) < Date.parse(value.createdAt)) invalid();
  const removed = value.kind === "REMOVE";
  if (value.proposedMembershipStatus !== (removed ? "REMOVED" : "ACTIVE") || removed && (value.proposedPosition !== null || value.proposedPermissionCodes !== null)
    || !removed && (value.proposedPosition === null || value.proposedPermissionCodes === null)) invalid();
  return { changeRequestId: value.changeRequestId, companyId: value.companyId, targetMembershipId: value.targetMembershipId,
    kind: value.kind as TeamChangeRequest["kind"], status: value.status as TeamChangeStatus, requestVersion: value.requestVersion,
    expectedMembershipVersion: value.expectedMembershipVersion, issuerName: value.issuerName,
    beforePosition: mapTeamPosition(value.beforePosition), beforePermissionCodes: codes(value.beforePermissionCodes),
    proposedPosition: value.proposedPosition === null ? null : mapTeamPosition(value.proposedPosition),
    proposedPermissionCodes: value.proposedPermissionCodes === null ? null : codes(value.proposedPermissionCodes),
    proposedMembershipStatus: value.proposedMembershipStatus as TeamChangeRequest["proposedMembershipStatus"], createdAt: value.createdAt,
    processedAt: value.processedAt, invalidationReason: value.invalidationReason, appliedMembershipVersion: value.appliedMembershipVersion,
    capabilities: { canAccept: c.canAccept as boolean, canReject: c.canReject as boolean, canCancel: c.canCancel as boolean, blockingReason: c.blockingReason } };
}
export function validateTeamProposal(body: TeamChangeProposal) {
  if (!object(body) || !validKey(body.requestKey) || !positive(body.expectedMembershipVersion) || !kinds.includes(body.kind)) input();
  const position = body.kind === "POSITION" || body.kind === "POSITION_AND_PERMISSIONS";
  const permissions = body.kind === "PERMISSIONS" || body.kind === "POSITION_AND_PERMISSIONS";
  if (position ? !positive(body.positionId) : "positionId" in body) input();
  if (permissions ? !validCodes(body.permissionCodes) : "permissionCodes" in body) input();
}
const validKey = (v: unknown) => typeof v === "string" && /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(v);
const validCodes = (v: unknown) => Array.isArray(v) && !!v.length && v.every(code => typeof code === "string" && /^[A-Z][A-Z0-9_]*$/.test(code)) && new Set(v).size === v.length;
function version(id: number, expected: number) { validateTeamMemberId(id); if (!positive(expected)) input(); }
export function validateTeamReceipt(body: { requestKey: string; expectedRequestVersion: number }) { if (!validKey(body.requestKey) || !positive(body.expectedRequestVersion)) input(); }
const equal = (a: string[], b: string[]) => [...a].sort().join(",") === [...b].sort().join(",");

export function createTeamManagement(http: HttpClient): CompanyTeamManagementRepository {
  async function mutation(access: AuthAccess, id: number, expected: number, path: string, method: "PATCH" | "POST" | "DELETE", body: unknown, signal?: AbortSignal) {
    version(id, expected);
    const result = mapTeamMutation(await http.authorized<unknown>(access, `/api/v1/company-memberships/${id}${path}`, { method, body, signal }), id);
    if (result.version < expected) invalid();
    return result;
  }
  return {
    async getCompanyTeamPositions(access, companyId, signal) {
      validateTeamQuery(companyId);
      const value = await http.authorized<unknown>(access, `/api/v1/companies/${companyId}/positions`, { signal });
      if (!Array.isArray(value)) invalid();
      const positions = value.map(mapTeamPosition);
      if (new Set(positions.map(p => p.id)).size !== positions.length) invalid();
      return positions;
    },
    async createCompanyTeamPosition(access, companyId, rawName, signal) {
      validateTeamQuery(companyId);
      const name = normalizeTeamPositionName(rawName);
      const result = await http.authorized<unknown>(access, `/api/v1/companies/${companyId}/positions`, { method: "POST", body: { name }, signal });
      return mapPositionWrite(result, name);
    },
    async renameCompanyTeamPosition(access, companyId, positionId, rawName, expectedVersion, signal) {
      validateTeamQuery(companyId);
      version(positionId, expectedVersion);
      const name = normalizeTeamPositionName(rawName);
      const result = await http.authorized<unknown>(access, `/api/v1/companies/${companyId}/positions/${positionId}`, { method: "PATCH", body: { name, expectedVersion }, signal });
      return mapPositionWrite(result, name, positionId, expectedVersion);
    },
    async deleteCompanyTeamPosition(access, companyId, positionId, expectedVersion, signal) {
      validateTeamQuery(companyId);
      version(positionId, expectedVersion);
      const result = await http.authorized<unknown>(access, `/api/v1/companies/${companyId}/positions/${positionId}?expectedVersion=${expectedVersion}`, { method: "DELETE", signal });
      if (!object(result) || result.positionId !== positionId || !positive(result.version) || result.version !== expectedVersion + 1 || !timestamp(result.deletedAt)) invalid();
      return { positionId, version: result.version, deletedAt: result.deletedAt };
    },
    async changeTeamMemberPosition(access, id, body, signal) {
      if (!positive(body.positionId)) input();
      const result = await mutation(access, id, body.expectedVersion, "/position", "PATCH", body, signal);
      if (result.status !== "ACTIVE" || result.positionId !== body.positionId) invalid();
      return result;
    },
    async changeTeamMemberPermissions(access, id, body, signal) {
      if (!validCodes(body.permissionCodes)) input();
      const result = await mutation(access, id, body.expectedVersion, "/permissions", "PATCH", body, signal);
      if (result.status !== "ACTIVE" || !equal(result.permissions, body.permissionCodes)) invalid();
      return result;
    },
    async demoteMyTeamMembership(access, id, body, signal) {
      if (!validCodes(body.permissionCodes) || !(body.positionId === null || positive(body.positionId))) input();
      const result = await mutation(access, id, body.expectedVersion, "/self-demotion", "POST", body, signal);
      if (result.status !== "ACTIVE" || !equal(result.permissions, body.permissionCodes) || body.positionId !== null && result.positionId !== body.positionId) invalid();
      return result;
    },
    async leaveMyTeamMembership(access, id, expected, signal) {
      const result = await mutation(access, id, expected, "/leave", "POST", { expectedVersion: expected }, signal);
      if (result.status !== "LEFT") invalid();
      return result;
    },
    async removeCompanyTeamMember(access, id, expected, signal) {
      const result = await mutation(access, id, expected, `?expectedVersion=${expected}`, "DELETE", undefined, signal);
      if (result.status !== "REMOVED") invalid();
      return result;
    },
    async createTeamChangeRequest(access, id, body, signal) {
      validateTeamMemberId(id); validateTeamProposal(body);
      const v = await http.authorized<unknown>(access, `/api/v1/company-memberships/${id}/change-requests`, { method: "POST", body, signal });
      if (!object(v)) invalid();
      if (v.outcome === "NO_CHANGE") {
        if (v.request !== null) invalid();
        const membership = mapTeamMutation(v.membership, id);
        if (membership.status !== "ACTIVE" || membership.version !== body.expectedMembershipVersion
          || "positionId" in body && membership.positionId !== body.positionId || "permissionCodes" in body && !equal(membership.permissions, body.permissionCodes) || body.kind === "REMOVE") invalid();
        return { outcome: "NO_CHANGE", request: null, membership };
      }
      if (!["CREATED", "REUSED"].includes(String(v.outcome)) || v.membership !== null) invalid();
      const request = mapTeamChangeRequest(v.request);
      if (request.targetMembershipId !== id || request.kind !== body.kind || request.expectedMembershipVersion !== body.expectedMembershipVersion
        || "positionId" in body && request.proposedPosition?.id !== body.positionId || "permissionCodes" in body && !equal(request.proposedPermissionCodes ?? [], body.permissionCodes)
        || v.outcome === "CREATED" && request.status !== "PENDING") invalid();
      return { outcome: v.outcome, request, membership: null } as TeamChangeCreated;
    },
    async listTeamChangeRequests(access, query: TeamChangeQuery, signal) {
      const { scope, companyId, page = 0, size = 20, status, membershipId } = query;
      if (!["mine", "company"].includes(scope) || scope === "company" && !positive(companyId) || scope === "mine" && (companyId !== undefined || membershipId !== undefined)) input();
      validateTeamQuery(companyId ?? 1, page, size);
      if (status !== undefined && !teamChangeStatuses.includes(status)) input();
      if (membershipId !== undefined) validateTeamMemberId(membershipId);
      const params = new URLSearchParams({ page: String(page), size: String(size) });
      if (status) params.set("status", status);
      if (membershipId !== undefined) params.set("membershipId", String(membershipId));
      const path = scope === "mine" ? "/api/v1/me/membership-change-requests" : `/api/v1/companies/${companyId}/membership-change-requests`;
      const v = await http.authorized<unknown>(access, `${path}?${params}`, { signal });
      if (!object(v) || !Array.isArray(v.content) || v.page !== page || v.size !== size || typeof v.totalElements !== "number" || !Number.isSafeInteger(v.totalElements) || v.totalElements < 0
        || v.totalPages !== Math.ceil(v.totalElements / size) || v.content.length !== Math.max(0, Math.min(size, v.totalElements - page * size))) invalid();
      const content = v.content.map(value => mapTeamChangeRequest(value));
      if (new Set(content.map(r => r.changeRequestId)).size !== content.length || content.some(r => scope === "company" && r.companyId !== companyId || membershipId !== undefined && r.targetMembershipId !== membershipId || status !== undefined && r.status !== status)) invalid();
      return { content, page, size, totalElements: v.totalElements, totalPages: v.totalPages } as TeamChangePage;
    },
    async getTeamChangeRequest(access, id, signal) {
      validateTeamMemberId(id);
      return mapTeamChangeRequest(await http.authorized<unknown>(access, `/api/v1/company-membership-change-requests/${id}`, { signal }), id);
    },
    async decideTeamChangeRequest(access, id, body, signal) {
      validateTeamMemberId(id); validateTeamReceipt(body); if (!["ACCEPT", "REJECT"].includes(body.decision)) input();
      const result = mapTeamChangeRequest(await http.authorized<unknown>(access, `/api/v1/company-membership-change-requests/${id}/decisions`, { method: "POST", body, signal }), id);
      if (result.status !== (body.decision === "ACCEPT" ? "APPLIED" : "REJECTED") || result.requestVersion <= body.expectedRequestVersion) invalid();
      return result;
    },
    async cancelTeamChangeRequest(access, id, body, signal) {
      validateTeamMemberId(id); validateTeamReceipt(body);
      const result = mapTeamChangeRequest(await http.authorized<unknown>(access, `/api/v1/company-membership-change-requests/${id}/cancellations`, { method: "POST", body, signal }), id);
      if (result.status !== "CANCELED" || result.requestVersion <= body.expectedRequestVersion) invalid();
      return result;
    },
  };
}

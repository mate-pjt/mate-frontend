import { ApiError } from "../shared/errors";
import { hasTeamPositionName } from "./team-position-input";
import type { HttpClient } from "../shared/http";
import { timestamp, validateTeamMemberId, validateTeamQuery } from "./team-api";
import type { CompanyTeamInvitationRepository, TeamInvitation, TeamInvitationCapabilities, TeamInvitationPage } from "./team-invitation-contracts";
import { normalizeTeamInvitation, teamInvitationEmail } from "./team-invitation-input";

const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const positive = (v: unknown): v is number => typeof v === "number" && Number.isSafeInteger(v) && v > 0;
const text = (v: unknown): v is string => typeof v === "string" && !!v.trim();
function invalid(): never { throw new ApiError(0, "INVITATION_RESPONSE_INVALID", "초대 결과를 확인하지 못했어요. 현재 상태를 다시 조회해 주세요."); }
export function compareInvitationTime(a: string, b: string): number {
  const fraction = (v: string) => (v.match(/\.(\d+)/)?.[1] ?? "").padEnd(9, "0");
  return Date.parse(a) - Date.parse(b) || fraction(a).localeCompare(fraction(b));
}
export function mapTeamInvitation(value: unknown, companyId: number, invitationId?: number): TeamInvitation {
  if (!record(value) || !positive(value.invitationId) || invitationId !== undefined && value.invitationId !== invitationId || value.companyId !== companyId
    || !teamInvitationEmail(value.invitedEmail) || !text(value.inviteeDisplayName) || typeof value.registeredAccount !== "boolean" || typeof value.representative !== "boolean"
    || !["ADMIN", "AGENT", "VIEWER"].includes(String(value.role)) || !["PENDING", "CANCELED", "EXPIRED", "DECLINED", "ACCEPTED"].includes(String(value.status))
    || !positive(value.version) || !timestamp(value.expiresAt) || !timestamp(value.createdAt) || !timestamp(value.updatedAt)
    || !(value.completedAt === null || timestamp(value.completedAt)) || !(value.message === null || typeof value.message === "string") || !record(value.delivery)) invalid();
  const d = value.delivery, p = value.position;
  if (!positive(d.version) || !["PENDING", "SENDING", "SENT", "FAILED", "SUPERSEDED"].includes(String(d.status))
    || !(p === null || record(p) && (p.positionId === null || positive(p.positionId)) && hasTeamPositionName(p.name))
    || !Array.isArray(value.permissions) || !value.permissions.length || !value.permissions.every(code => text(code) && /^[A-Z][A-Z0-9_]*$/.test(code))
    || new Set(value.permissions).size !== value.permissions.length || compareInvitationTime(value.updatedAt, value.createdAt) < 0
    || compareInvitationTime(value.expiresAt, value.createdAt) <= 0 || value.completedAt !== null && compareInvitationTime(value.completedAt, value.createdAt) < 0
    || value.status === "PENDING" && value.completedAt !== null || ["ACCEPTED", "DECLINED", "CANCELED"].includes(String(value.status)) && value.completedAt === null
    || value.representative && (value.role !== "ADMIN" || p !== null && (p as Record<string, unknown>).positionId !== null)) invalid();
  return { invitationId: value.invitationId, companyId, invitedEmail: value.invitedEmail, inviteeDisplayName: value.inviteeDisplayName,
    registeredAccount: value.registeredAccount, representative: value.representative, position: p === null ? null : { positionId: (p as { positionId: number | null }).positionId, name: (p as { name: string }).name },
    role: value.role as TeamInvitation["role"], permissions: [...value.permissions] as string[], message: value.message, status: value.status as TeamInvitation["status"],
    version: value.version, expiresAt: value.expiresAt, delivery: { version: d.version, status: d.status as TeamInvitation["delivery"]["status"] },
    createdAt: value.createdAt, updatedAt: value.updatedAt, completedAt: value.completedAt };
}
export function mapTeamInvitationPage(value: unknown, companyId: number, page: number, size: number): TeamInvitationPage {
  if (!record(value) || !Array.isArray(value.content) || value.page !== page || value.size !== size || !Number.isSafeInteger(value.totalElements) || (value.totalElements as number) < 0
    || value.totalPages !== Math.ceil((value.totalElements as number) / size) || value.content.length !== Math.max(0, Math.min(size, (value.totalElements as number) - page * size)) || !record(value.capabilities)) invalid();
  const c = value.capabilities, keys: Array<keyof TeamInvitationCapabilities> = ["canInvite", "canEditPosition", "canManagePermissions", "canInviteRepresentative"];
  if (keys.some(key => typeof c[key] !== "boolean")) invalid();
  const content = value.content.map(v => mapTeamInvitation(v, companyId));
  if (new Set(content.map(v => v.invitationId)).size !== content.length) invalid();
  for (let i = 1; i < content.length; i++) {
    const before = content[i - 1], current = content[i], order = compareInvitationTime(before.createdAt, current.createdAt);
    if (order < 0 || order === 0 && before.invitationId <= current.invitationId) invalid();
  }
  return { content, page, size, totalElements: value.totalElements as number, totalPages: value.totalPages as number,
    capabilities: Object.fromEntries(keys.map(key => [key, c[key]])) as TeamInvitationCapabilities };
}
export function createTeamInvitations(http: HttpClient): CompanyTeamInvitationRepository {
  const path = (id: number) => `/api/v1/companies/${id}/membership-invitations`;
  async function command(access: Parameters<CompanyTeamInvitationRepository["cancelTeamInvitation"]>[0], companyId: number, id: number, version: number, resend: boolean, signal?: AbortSignal) {
    validateTeamQuery(companyId); validateTeamMemberId(id); validateTeamMemberId(version);
    if (version === Number.MAX_SAFE_INTEGER) throw new ApiError(400, "INVALID_INPUT", "초대 버전을 다시 확인해 주세요.");
    const result = mapTeamInvitation(await http.authorized<unknown>(access,
      `${path(companyId)}/${id}${resend ? "/resend" : `?expectedVersion=${version}`}`,
      { method: resend ? "POST" : "DELETE", ...(resend ? { body: { expectedVersion: version } } : {}), signal }), companyId, id);
    if (result.version !== version + 1 || result.status !== (resend ? "PENDING" : "CANCELED")) invalid();
    return result;
  }
  return {
    async updateTeamInvitation(access, companyId, id, expectedVersion, input, signal) {
      validateTeamQuery(companyId); validateTeamMemberId(id); validateTeamMemberId(expectedVersion);
      if (expectedVersion === Number.MAX_SAFE_INTEGER) throw new ApiError(400, "INVALID_INPUT", "초대 버전을 다시 확인해 주세요.");
      const { email, ...body } = normalizeTeamInvitation(input);
      const result = mapTeamInvitation(await http.authorized<unknown>(access, `${path(companyId)}/${id}`, { method: "PATCH", body: { expectedVersion, ...body }, signal }), companyId, id);
      if (result.version !== expectedVersion + 1 || result.status !== "PENDING" || result.invitedEmail !== email || result.representative !== body.representative
        || result.inviteeDisplayName !== body.inviteeDisplayName
        || !body.representative && (body.positionId !== null ? result.position?.positionId !== body.positionId : result.position?.positionId !== null || result.position.name !== body.proposedPositionName)) invalid();
      return result;
    },
    resendTeamInvitation: (access, companyId, id, version, signal) => command(access, companyId, id, version, true, signal),
    cancelTeamInvitation: (access, companyId, id, version, signal) => command(access, companyId, id, version, false, signal),
    async listTeamInvitations(access, companyId, page = 0, size = 20, signal) {
      validateTeamQuery(companyId, page, size);
      return mapTeamInvitationPage(await http.authorized<unknown>(access, `${path(companyId)}?${new URLSearchParams({ page: String(page), size: String(size) })}`, { signal }), companyId, page, size);
    },
    async getTeamInvitation(access, companyId, id, signal) {
      validateTeamQuery(companyId); validateTeamMemberId(id);
      return mapTeamInvitation(await http.authorized<unknown>(access, `${path(companyId)}/${id}`, { signal }), companyId, id);
    },
    async createTeamInvitation(access, companyId, input, signal) {
      validateTeamQuery(companyId);
      const body = normalizeTeamInvitation(input);
      const result = mapTeamInvitation(await http.authorized<unknown>(access, path(companyId), { method: "POST", body, signal }), companyId);
      if (result.status !== "PENDING" || result.invitedEmail !== body.email || result.representative !== body.representative
        || !result.registeredAccount && result.inviteeDisplayName !== body.inviteeDisplayName
        || !body.representative && (body.positionId !== null ? result.position?.positionId !== body.positionId : result.position?.positionId !== null || result.position.name !== body.proposedPositionName)) invalid();
      return result;
    },
  };
}

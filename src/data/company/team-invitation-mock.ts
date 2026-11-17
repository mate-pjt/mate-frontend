import { ApiError } from "../shared/errors";
import type { AuthAccess } from "../shared/http";
import { mockAccount, type MockRuntime } from "../mock/runtime";
import { validateTeamMemberId, validateTeamQuery } from "./team-api";
import { compareInvitationTime, mapTeamInvitation } from "./team-invitation-api";
import type { CompanyTeamInvitationRepository, TeamInvitation, TeamInvitationCapabilities } from "./team-invitation-contracts";
import { normalizeTeamInvitation } from "./team-invitation-input";
import { teamRoleFromPermissions, sameTeamPermissions } from "./team-permissions";
import type { CompanyTeamManagementRepository } from "./team-management-contracts";
import type { CompanyTeamRepository } from "./team-contracts";
import { serializeTeamMockCommand } from "./team-mock-command";

type State = { version: 1; nextId: number; invitations: TeamInvitation[] };
const forbidden = (): never => { throw new ApiError(403, "CM005", "현재 회사와 권한으로 초대할 수 없어요."); };
function conflict(code: string, message: string): never { throw new ApiError(409, code, message); }

export function createMockTeamInvitations(runtime: MockRuntime, team: CompanyTeamRepository & CompanyTeamManagementRepository): CompanyTeamInvitationRepository {
  async function context(access: AuthAccess, companyId: number, signal?: AbortSignal) {
    const account = await mockAccount(runtime, access, "company", signal);
    if ((await team.getCompanyTeamContext(access, signal)).companyId !== companyId) forbidden();
    const current = await team.getCurrentCompanyPermissions(access, companyId, signal), catalog = await team.getCompanyPermissionCatalog(access, signal);
    if (!current.permissionCodes.includes("COMPANY_MEMBER_LIST_VIEW")) forbidden();
    const first = await team.listCompanyTeamMembers(access, companyId, 0, 100, signal), members = [...first.content];
    for (let page = 1; page < first.totalPages; page++) members.push(...(await team.listCompanyTeamMembers(access, companyId, page, 100, signal)).content);
    const capabilities: TeamInvitationCapabilities = { canInvite: first.capabilities.canInvite,
      canEditPosition: current.permissionCodes.includes("COMPANY_MEMBER_PROFILE_EDIT"), canManagePermissions: current.permissionCodes.includes("COMPANY_MEMBER_PERMISSION_MANAGE"),
      canInviteRepresentative: first.capabilities.canInvite && members.length > 0 && teamRoleFromPermissions(catalog, current.permissionCodes) === "ADMIN" && !members.some(m => m.positionType === "REPRESENTATIVE") };
    signal?.throwIfAborted();
    if (access.getAccountKey() !== account) throw new ApiError(401, "ACCOUNT_CHANGED", "로그인 계정이 변경됐어요.");
    return { account, current, catalog, members, capabilities };
  }
  const present = (v: TeamInvitation): TeamInvitation => mapTeamInvitation({ ...v, status: v.status === "PENDING" && Date.parse(v.expiresAt) <= runtime.now() ? "EXPIRED" : v.status }, v.companyId);
  function valid(value: unknown): value is State {
    try {
      const s = value as State;
      if (s?.version !== 1 || !Number.isSafeInteger(s.nextId) || s.nextId < 8201 || !Array.isArray(s.invitations)) return false;
      for (const v of s.invitations) {
        validateTeamQuery(v.companyId); const mapped = mapTeamInvitation(v, v.companyId);
        if (Object.keys(v).some(key => !Object.hasOwn(mapped, key)) || Object.keys(v.delivery).some(key => !["version", "status"].includes(key))
          || v.position && Object.keys(v.position).some(key => !["positionId", "name"].includes(key))) return false;
      }
      return new Set(s.invitations.map(v => v.invitationId)).size === s.invitations.length && s.invitations.every(v => v.invitationId < s.nextId);
    } catch { return false; }
  }
  const read = (account: string) => runtime.store.read<State>(account, "company-team-invitations", () => ({ version: 1, nextId: 8201, invitations: [] }), valid);
  return {
    async listTeamInvitations(access, companyId, page = 0, size = 20, signal) {
      validateTeamQuery(companyId, page, size);
      const x = await context(access, companyId, signal), state = read(x.account);
      const rows = state.invitations.filter(v => v.companyId === companyId && v.status === "PENDING")
        .sort((a, b) => compareInvitationTime(b.createdAt, a.createdAt) || b.invitationId - a.invitationId);
      return { content: rows.slice(page * size, (page + 1) * size).map(present), page, size, totalElements: rows.length, totalPages: Math.ceil(rows.length / size), capabilities: x.capabilities };
    },
    async getTeamInvitation(access, companyId, id, signal) {
      validateTeamQuery(companyId); validateTeamMemberId(id);
      const x = await context(access, companyId, signal), row = read(x.account).invitations.find(v => v.invitationId === id && v.companyId === companyId);
      if (!row) throw new ApiError(404, "CI001", "초대를 찾지 못했어요.");
      return present(row);
    },
    async createTeamInvitation(access, companyId, input, signal) {
      validateTeamQuery(companyId); const body = normalizeTeamInvitation(input), account = access.getAccountKey();
      if (!account) throw new ApiError(401, "SESSION_INVALID", "로그인이 필요해요.");
      return serializeTeamMockCommand(runtime, access, async () => {
        if (account !== access.getAccountKey()) throw new ApiError(401, "ACCOUNT_CHANGED", "로그인 계정이 변경됐어요.");
        const x = await context(access, companyId, signal);
        if (!x.capabilities.canInvite) forbidden();
        const positions = await team.getCompanyTeamPositions(access, companyId, signal);
        if (body.proposedPositionName && !x.capabilities.canEditPosition) forbidden();
        if (body.positionId !== null && !positions.some(p => p.id === body.positionId && p.type === "CUSTOM")) throw new ApiError(400, "CI009", "현재 회사의 일반 직급을 선택해 주세요.");
        if (body.representative) {
          if (teamRoleFromPermissions(x.catalog, x.current.permissionCodes) !== "ADMIN") throw new ApiError(403, "CI007", "대표자 초대 권한이 없어요.");
          if (x.members.some(m => m.positionType === "REPRESENTATIVE")) conflict("CI008", "이미 대표자가 있는 회사에는 대표자를 초대할 수 없어요.");
          if (!x.capabilities.canInviteRepresentative) forbidden();
        }
        const base = x.catalog.presets.find(p => p.role === (body.representative ? "ADMIN" : body.preset ?? "VIEWER"))!.permissionCodes;
        const permissions = [...new Set([...base, ...body.extraPermissionCodes])];
        const role = teamRoleFromPermissions(x.catalog, permissions), viewer = x.catalog.presets.find(p => p.role === "VIEWER")!.permissionCodes;
        if (!body.representative && (!sameTeamPermissions(permissions, viewer) && !x.capabilities.canManagePermissions || permissions.some(code => !x.current.permissionCodes.includes(code)))) forbidden();
        if (body.email === "active-member@example.test" || x.members.some(m => m.contactEmail.toLowerCase() === body.email)) conflict("CM004", "이미 활성 회사에 소속된 계정이에요.");
        if (body.email === "pending-member@example.test") conflict("CI010", "같은 회사의 합류 신청이 대기 중이에요.");
        if (body.email === "ambiguous-member@example.test") conflict("CI011", "확인된 이메일의 계정을 특정할 수 없어요.");
        const state = read(account), now = new Date(runtime.now()).toISOString();
        const pending = state.invitations.find(v => v.companyId === companyId && v.invitedEmail === body.email && v.status === "PENDING");
        if (pending && Date.parse(pending.expiresAt) > runtime.now()) conflict("CI002", "같은 이메일로 보낸 초대가 대기 중이에요.");
        if (pending) { pending.status = "EXPIRED"; pending.version += 1; pending.updatedAt = now; pending.completedAt = now; }
        const latest = await team.getCurrentCompanyPermissions(access, companyId, signal);
        if (latest.membershipId !== x.current.membershipId || !sameTeamPermissions(latest.permissionCodes, x.current.permissionCodes)) forbidden();
        signal?.throwIfAborted();
        if (account !== access.getAccountKey()) throw new ApiError(401, "ACCOUNT_CHANGED", "로그인 계정이 변경됐어요.");
        const registeredAccount = body.email === "registered-member@example.test";
        const value: TeamInvitation = { invitationId: state.nextId++, companyId, invitedEmail: body.email,
          inviteeDisplayName: registeredAccount ? "가상 등록 팀원" : body.inviteeDisplayName, registeredAccount, representative: body.representative,
          position: { positionId: body.positionId, name: body.representative ? "대표자" : body.proposedPositionName ?? positions.find(p => p.id === body.positionId)!.name },
          role, permissions, message: body.message, status: "PENDING", version: 1, expiresAt: new Date(runtime.now() + 7 * 86_400_000).toISOString(),
          delivery: { version: 1, status: runtime.scenario("company") === "team-invitation-mail-failed" ? "FAILED" : "PENDING" }, createdAt: now, updatedAt: now, completedAt: null };
        state.invitations.push(value); runtime.store.write(account, "company-team-invitations", state);
        return present(value);
      });
    },
  };
}

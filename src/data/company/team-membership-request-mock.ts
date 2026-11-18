import { ApiError } from "../shared/errors";
import type { AuthAccess } from "../shared/http";
import type { MockRuntime } from "../mock/runtime";
import { validateTeamMemberId, validateTeamQuery } from "./team-api";
import type { CompanyTeamMember, CompanyPermissionCatalog } from "./team-contracts";
import type { TeamMutation, TeamPosition } from "./team-management-contracts";
import type { CompanyTeamMembershipRequestRepository, TeamMembershipRequest, TeamMembershipReviewCapabilities } from "./team-membership-request-contracts";
import { mapTeamMembershipRequest } from "./team-membership-request-api";
import { membershipRejectionReason, normalizeMembershipApproval, validateMembershipReviewVersion } from "./team-membership-request-input";
import { emptyMemberCapabilities } from "./team-mock";
import { serializeTeamMockCommand } from "./team-mock-command";
import { sameTeamPermissions, teamRoleFromPermissions } from "./team-permissions";

type Member = { value: CompanyTeamMember; status: TeamMutation["status"]; endedAt: string | null; updatedAt: string };
type ReviewCompany = { members: Member[]; positions: TeamPosition[]; membershipRequests?: TeamMembershipRequest[] };
type Port = { catalog: CompanyPermissionCatalog; load: (access: AuthAccess, signal?: AbortSignal) => Promise<{ account: string; companyId: number; company: ReviewCompany; save: () => void }> };
function forbidden(): never { throw new ApiError(403, "CM005", "현재 소속과 신청 검토 권한을 확인해 주세요."); }
function missing(): never { throw new ApiError(404, "CR001", "대기 중인 신청을 찾지 못했어요. 이미 처리됐거나 취소됐을 수 있어요."); }
function conflict(code: string, message: string): never { throw new ApiError(409, code, message); }

export function teamMembershipRequestFixtures(companyId: number, now: number): TeamMembershipRequest[] {
  return Array.from({ length: 23 }, (_, index) => {
    const createdAt = new Date(now - (24 - Math.floor(index / 2)) * 86_400_000).toISOString();
    return { requestId: 8401 + index, companyId, accountName: index === 2 ? null : `가상 신청자 ${index + 1}`, googleVerifiedEmail: index === 2 ? null : `applicant${index + 1}@example.test`,
      requestedRepresentative: index === 1, requestedPositionId: index === 1 || index === 3 ? null : 2, requestedPositionName: index === 1 || index === 3 ? null : "사원",
      proposedPositionName: index === 3 ? "가상 제안 직급" : null, message: index === 0 ? "함께 일하고 싶어요." : null, status: "PENDING", version: 1,
      rejectionReason: null, appliedRepresentative: null, appliedPositionId: null, appliedPositionName: null, appliedMembershipId: null, appliedRole: null, appliedPermissions: [],
      capabilities: { canReview: true, canEditPosition: true, canManagePermissions: true, canApproveRepresentative: true }, createdAt, updatedAt: createdAt, completedAt: null };
  });
}
export function createMockTeamMembershipRequests(runtime: MockRuntime, port: Port): CompanyTeamMembershipRequestRepository {
  async function context(access: AuthAccess, companyId: number, signal?: AbortSignal) {
    validateTeamQuery(companyId);
    const x = await port.load(access, signal), actor = x.company.members.find(m => m.status === "ACTIVE" && m.value.membershipId === 9101)?.value;
    if (x.companyId !== companyId || !actor?.permissions.includes("COMPANY_MEMBERSHIP_REQUEST_REVIEW") || runtime.scenario("company") === "team-read-only") forbidden();
    const admin = teamRoleFromPermissions(port.catalog, actor.permissions) === "ADMIN";
    const capabilities: TeamMembershipReviewCapabilities = { canReview: true, canEditPosition: actor.permissions.includes("COMPANY_MEMBER_PROFILE_EDIT"), canManagePermissions: actor.permissions.includes("COMPANY_MEMBER_PERMISSION_MANAGE"), canApproveRepresentative: admin };
    if (!x.company.membershipRequests) { x.company.membershipRequests = runtime.scenario("company") === "team-requests-empty" ? [] : teamMembershipRequestFixtures(companyId, runtime.now()); x.save(); }
    signal?.throwIfAborted(); access.assertRequestScope?.();
    if (x.account !== access.getAccountKey()) throw new ApiError(401, "ACCOUNT_CHANGED", "로그인 계정이 변경됐어요.");
    return { ...x, actor, capabilities, rows: x.company.membershipRequests };
  }
  const present = (row: TeamMembershipRequest, c: TeamMembershipReviewCapabilities) => mapTeamMembershipRequest({ ...row, capabilities: c }, row.companyId);
  function pending(rows: TeamMembershipRequest[], id: number, version?: number) {
    const row = rows.find(r => r.requestId === id); if (!row) missing();
    if (version !== undefined && row.version !== version) conflict("CR004", "신청이 변경됐어요. 최신 신청에서 다시 검토해 주세요.");
    if (row.status !== "PENDING") { if (version === undefined) missing(); conflict("CR003", "이미 처리하거나 취소한 신청이에요."); }
    return row;
  }
  return {
    async listTeamMembershipRequests(access, companyId, page = 0, size = 20, signal) {
      validateTeamQuery(companyId, page, size); const x = await context(access, companyId, signal), rows = x.rows.filter(r => r.status === "PENDING");
      return { content: rows.slice(page * size, (page + 1) * size).map(r => present(r, x.capabilities)), capabilities: x.capabilities, page, size, totalElements: rows.length, totalPages: Math.ceil(rows.length / size) };
    },
    async getTeamMembershipRequest(access, companyId, id, signal) {
      validateTeamMemberId(id); const x = await context(access, companyId, signal); return present(pending(x.rows, id), x.capabilities);
    },
    async approveTeamMembershipRequest(access, companyId, id, raw, signal) {
      validateTeamMemberId(id); const body = normalizeMembershipApproval(raw);
      return serializeTeamMockCommand(runtime, access, async () => {
        const x = await context(access, companyId, signal), row = pending(x.rows, id, body.expectedVersion), { company: c, actor } = x;
        const syntheticEmail = row.googleVerifiedEmail ?? `synthetic-member-${id}@example.test`;
        if (c.members.some(m => m.status === "ACTIVE" && m.value.contactEmail === syntheticEmail)) conflict("CM004", "이미 활성 회사 소속이 있는 가상 신청자예요.");
        if (row.requestedRepresentative && !x.capabilities.canApproveRepresentative) throw new ApiError(403, "CR007", "대표자 신청은 관리자만 승인할 수 있어요.");
        if (!row.requestedRepresentative && body.representative) throw new ApiError(400, "CR008", "일반 신청을 대표자로 변경할 수 없어요.");
        let position: TeamPosition | undefined, permissions: string[];
        if (body.representative) {
          if (c.members.some(m => m.status === "ACTIVE" && m.value.positionType === "REPRESENTATIVE")) conflict("CR009", "이미 회사에 대표자가 있어요.");
          position = c.positions.find(p => p.type === "REPRESENTATIVE"); permissions = [...port.catalog.presets.find(p => p.role === "ADMIN")!.permissionCodes];
        } else {
          const changed = body.positionId !== null ? row.requestedPositionId !== body.positionId : row.proposedPositionName !== body.positionName;
          if (changed && !x.capabilities.canEditPosition) forbidden();
          const base = port.catalog.presets.find(p => p.role === (body.preset ?? "VIEWER"))!.permissionCodes;
          permissions = [...new Set([...base, ...body.extraPermissionCodes])]; teamRoleFromPermissions(port.catalog, permissions);
          if (!sameTeamPermissions(permissions, port.catalog.presets.find(p => p.role === "VIEWER")!.permissionCodes) && !x.capabilities.canManagePermissions
            || permissions.some(p => !actor.permissions.includes(p))) forbidden();
          position = body.positionId !== null ? c.positions.find(p => p.id === body.positionId && p.type === "CUSTOM") : c.positions.find(p => p.name === body.positionName && p.type === "CUSTOM");
          if (!position && body.positionId === null) {
            position = { id: Math.max(...c.positions.map(p => p.id)) + 1, name: body.positionName!, type: "CUSTOM", version: 1 }; c.positions.push(position);
          }
        }
        if (!position) throw new ApiError(400, "CR006", "선택한 일반 직급을 다시 확인해 주세요.");
        const now = new Date(Math.max(runtime.now(), Date.parse(row.updatedAt))).toISOString(), membershipId = Math.max(9200, ...c.members.map(m => m.value.membershipId)) + 1;
        const role = teamRoleFromPermissions(port.catalog, permissions);
        const member: CompanyTeamMember = { membershipId, displayName: row.accountName, contactEmail: syntheticEmail, profileImageUrl: null,
          positionId: position.id, positionName: position.name, positionType: position.type, role, permissions: [...permissions], joinedAt: now, lastLoginAt: null, version: 1, capabilities: emptyMemberCapabilities() };
        c.members.push({ value: member, status: "ACTIVE", endedAt: null, updatedAt: now });
        Object.assign(row, { status: "APPROVED", version: row.version + 1, updatedAt: now, completedAt: now, appliedRepresentative: body.representative,
          appliedPositionId: position.id, appliedPositionName: position.name, appliedMembershipId: membershipId, appliedRole: role, appliedPermissions: [...permissions] });
        x.save(); return present(row, x.capabilities);
      });
    },
    async rejectTeamMembershipRequest(access, companyId, id, version, raw, signal) {
      validateTeamMemberId(id); validateMembershipReviewVersion(version); const reason = membershipRejectionReason(raw);
      return serializeTeamMockCommand(runtime, access, async () => {
        const x = await context(access, companyId, signal), row = pending(x.rows, id, version), now = new Date(Math.max(runtime.now(), Date.parse(row.updatedAt))).toISOString();
        Object.assign(row, { status: "REJECTED", version: row.version + 1, rejectionReason: reason, updatedAt: now, completedAt: now }); x.save(); return present(row, x.capabilities);
      });
    },
  };
}

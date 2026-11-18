import * as company from "@/data/company/client";
import { membershipRejectionReason, normalizeMembershipApproval, sameTeamPermissions, teamRoleFromPermissions,
  type CompanyPermissionCatalog, type CompanyTeamMember, type CompanyTeamMembershipRequestRepository, type CompanyTeamRepository,
  type CompanyTeamManagementRepository, type CurrentCompanyPermissions, type TeamMembershipApproval, type TeamMembershipRequest, type TeamMembershipRequestPage, type TeamPosition } from "@/data/company/contracts";
import { ApiError } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";

type Repository = CompanyTeamRepository & Pick<CompanyTeamManagementRepository, "getCompanyTeamPositions"> & CompanyTeamMembershipRequestRepository;
export type TeamMembershipSnapshot = { companyId: number; catalog: CompanyPermissionCatalog; current: CurrentCompanyPermissions; page: TeamMembershipRequestPage; positions: TeamPosition[]; detail?: TeamMembershipRequest; verifiedMember?: CompanyTeamMember; memberCheck?: "confirmed" | "changed" | "unavailable" };
export type TeamMembershipDecision = { kind: "approve"; input: TeamMembershipApproval } | { kind: "reject"; reason: string };
export const membershipRequestPath = (page = 1) => `/my/team/membership-requests${page > 1 ? `?page=${page}` : ""}`;
export const membershipApplicantName = (row: TeamMembershipRequest) => row.accountName?.trim() || "이름 미제공";
export const requestedMembershipPosition = (row: TeamMembershipRequest) => row.requestedRepresentative ? "대표자 자동 적용" : row.requestedPositionName || row.proposedPositionName || "직급 미제공";
function changed(): never { throw new ApiError(409, "MEMBERSHIP_REVIEW_CHANGED", "회사·권한·신청 정보가 변경됐어요. 최신 신청에서 다시 검토해 주세요."); }
function forbidden(): never { throw new ApiError(403, "MEMBERSHIP_REVIEW_FORBIDDEN", "현재 소속과 신청 검토 권한을 확인해 주세요."); }
function mismatch(): never { throw new ApiError(0, "MEMBERSHIP_REVIEW_RESULT_MISMATCH", "신청 처리 결과를 확인하지 못했어요. 현재 상태를 다시 조회해 주세요."); }
function sameActor(a: CurrentCompanyPermissions, b: CurrentCompanyPermissions) {
  return a.companyId === b.companyId && a.membershipId === b.membershipId && sameTeamPermissions(a.permissionCodes, b.permissionCodes);
}
function requestIdentity(a: TeamMembershipRequest, b: TeamMembershipRequest) {
  return a.requestId === b.requestId && a.companyId === b.companyId && a.createdAt === b.createdAt && a.requestedRepresentative === b.requestedRepresentative
    && a.requestedPositionId === b.requestedPositionId && a.proposedPositionName === b.proposedPositionName;
}
export async function loadTeamMembershipRequests(access: AuthAccess, page: number, signal: AbortSignal, repository: Repository = company,
  isCurrent = () => true, requestId?: number, receipt?: TeamMembershipRequest): Promise<TeamMembershipSnapshot | null> {
  const account = access.getAccountKey();
  function check() { signal.throwIfAborted(); if (!account || account !== access.getAccountKey() || !isCurrent()) throw new DOMException("aborted", "AbortError"); }
  check(); const { companyId } = await repository.getCompanyTeamContext(access, signal); check();
  if (companyId === null) return null;
  if (receipt && receipt.companyId !== companyId) changed();
  const [catalog, current] = await Promise.all([repository.getCompanyPermissionCatalog(access, signal), repository.getCurrentCompanyPermissions(access, companyId, signal)]); check();
  if (current.companyId !== companyId || !current.permissionCodes.includes("COMPANY_MEMBERSHIP_REQUEST_REVIEW")) forbidden();
  teamRoleFromPermissions(catalog, current.permissionCodes);
  const [requests, positions, detail, memberResult] = await Promise.all([
    repository.listTeamMembershipRequests(access, companyId, page, 20, signal), repository.getCompanyTeamPositions(access, companyId, signal),
    requestId === undefined ? undefined : repository.getTeamMembershipRequest(access, companyId, requestId, signal),
    receipt?.status === "APPROVED" && receipt.appliedMembershipId ? repository.getCompanyTeamMember(access, companyId, receipt.appliedMembershipId, signal).then(member => ({ member })).catch(cause => {
      if (cause instanceof ApiError && [401, 403].includes(cause.status) || cause instanceof DOMException && cause.name === "AbortError") throw cause;
      return { member: undefined };
    }) : undefined,
  ]); check();
  for (const row of [...requests.content, ...(detail ? [detail] : [])]) {
    if (row.companyId !== companyId || row.status !== "PENDING") mismatch();
  }
  if (detail && detail.requestId !== requestId || receipt && requests.content.some(row => row.requestId === receipt.requestId)) mismatch();
  const member = memberResult?.member;
  const memberCheck = receipt?.status !== "APPROVED" ? undefined : !member ? "unavailable" : member.membershipId === receipt.appliedMembershipId && member.positionId === receipt.appliedPositionId
    && member.role === receipt.appliedRole && (member.positionType === "REPRESENTATIVE") === receipt.appliedRepresentative && sameTeamPermissions(member.permissions, receipt.appliedPermissions) ? "confirmed" : "changed";
  if ((await repository.getCompanyTeamContext(access, signal)).companyId !== companyId) changed(); check();
  const latest = await repository.getCurrentCompanyPermissions(access, companyId, signal); check();
  if (!latest.permissionCodes.includes("COMPANY_MEMBERSHIP_REQUEST_REVIEW")) forbidden();
  if (!sameActor(current, latest)) changed();
  return { companyId, catalog, current, page: requests, positions, detail, verifiedMember: memberCheck === "confirmed" ? member : undefined, memberCheck };
}
export function defaultMembershipApproval(row: TeamMembershipRequest): TeamMembershipApproval {
  return { expectedVersion: row.version, representative: row.requestedRepresentative, positionId: row.requestedPositionId, positionName: row.proposedPositionName,
    preset: row.requestedRepresentative ? null : "VIEWER", extraPermissionCodes: [] };
}
export function planMembershipApproval(snapshot: TeamMembershipSnapshot, row: TeamMembershipRequest, input: TeamMembershipApproval) {
  const body = normalizeMembershipApproval(input), actor = snapshot.current.permissionCodes, c = row.capabilities;
  if (row.companyId !== snapshot.companyId || row.status !== "PENDING" || row.version !== body.expectedVersion) changed();
  if (!actor.includes("COMPANY_MEMBERSHIP_REQUEST_REVIEW") || !snapshot.page.capabilities.canReview || !c.canReview) forbidden();
  const admin = teamRoleFromPermissions(snapshot.catalog, actor) === "ADMIN";
  if (row.requestedRepresentative && (!admin || !c.canApproveRepresentative) || !row.requestedRepresentative && body.representative) forbidden();
  const preset = (role: "ADMIN" | "AGENT" | "VIEWER") => snapshot.catalog.presets.find(p => p.role === role)!.permissionCodes;
  if (body.representative) return { body, permissions: [...preset("ADMIN")] };
  const positionChanged = body.positionId !== null ? row.requestedPositionId !== body.positionId : row.proposedPositionName !== body.positionName;
  if (positionChanged && (!c.canEditPosition || !actor.includes("COMPANY_MEMBER_PROFILE_EDIT"))) forbidden();
  if (body.positionId !== null && !snapshot.positions.some(p => p.id === body.positionId && p.type === "CUSTOM")) changed();
  const permissions = [...new Set([...preset(body.preset ?? "VIEWER"), ...body.extraPermissionCodes])]; teamRoleFromPermissions(snapshot.catalog, permissions);
  if (permissions.some(p => !actor.includes(p)) || !sameTeamPermissions(permissions, preset("VIEWER")) && (!c.canManagePermissions || !actor.includes("COMPANY_MEMBER_PERMISSION_MANAGE"))) forbidden();
  return { body, permissions };
}
export function createMembershipReviewScope(access: AuthAccess, isCurrent: () => boolean, repository: Repository = company) {
  const account = access.getAccountKey(), abort = new AbortController(); let busy = false, submitted = false;
  function check() { abort.signal.throwIfAborted(); if (!account || account !== access.getAccountKey() || !isCurrent()) throw new DOMException("aborted", "AbortError"); }
  const scopedAccess: AuthAccess = { ...access, assertRequestScope: () => { access.assertRequestScope?.(); check(); } };
  return {
    dispose: () => abort.abort(),
    async submit(snapshot: TeamMembershipSnapshot, decision: TeamMembershipDecision): Promise<TeamMembershipRequest> {
      check(); const before = snapshot.detail;
      if (!before || busy || submitted) throw new ApiError(409, "MEMBERSHIP_REVIEW_ALREADY_SUBMITTED", "현재 신청 상태를 확인한 뒤 다시 검토해 주세요.");
      busy = true;
      try {
        const approval = decision.kind === "approve" ? planMembershipApproval(snapshot, before, decision.input) : undefined;
        const reason = decision.kind === "reject" ? membershipRejectionReason(decision.reason) : undefined;
        const latest = await loadTeamMembershipRequests(scopedAccess, snapshot.page.page, abort.signal, repository, isCurrent, before.requestId); check();
        if (!latest?.detail || latest.companyId !== snapshot.companyId || !sameActor(latest.current, snapshot.current) || JSON.stringify(latest.catalog) !== JSON.stringify(snapshot.catalog)
          || !requestIdentity(before, latest.detail) || before.version !== latest.detail.version) changed();
        if (!latest.detail.capabilities.canReview || !latest.page.capabilities.canReview || !latest.current.permissionCodes.includes("COMPANY_MEMBERSHIP_REQUEST_REVIEW")) forbidden();
        if (approval?.body.positionId !== null && approval?.body.positionId !== undefined) {
          const oldPosition = snapshot.positions.find(p => p.id === approval.body.positionId), newPosition = latest.positions.find(p => p.id === approval.body.positionId);
          if (!oldPosition || JSON.stringify(oldPosition) !== JSON.stringify(newPosition)) changed();
        }
        const planned = approval ? planMembershipApproval(latest, latest.detail, approval.body) : undefined;
        submitted = true;
        const result = planned ? await repository.approveTeamMembershipRequest(scopedAccess, latest.companyId, before.requestId, planned.body, abort.signal)
          : await repository.rejectTeamMembershipRequest(scopedAccess, latest.companyId, before.requestId, before.version, reason!, abort.signal); check();
        if (!requestIdentity(before, result) || result.version !== before.version + 1 || result.status !== (planned ? "APPROVED" : "REJECTED")) mismatch();
        if (planned) {
          if (!sameTeamPermissions(result.appliedPermissions, planned.permissions) || result.appliedRole !== teamRoleFromPermissions(latest.catalog, planned.permissions)
            || result.appliedRepresentative !== planned.body.representative || !result.appliedMembershipId
            || !planned.body.representative && (planned.body.positionId !== null ? result.appliedPositionId !== planned.body.positionId : result.appliedPositionName !== planned.body.positionName)) mismatch();
        } else if (result.rejectionReason !== reason) mismatch();
        return result;
      } finally { busy = false; }
    },
  };
}

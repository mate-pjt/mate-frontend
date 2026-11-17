import * as company from "@/data/company/client";
import { normalizeTeamInvitation, sameTeamPermissions, teamRoleFromPermissions, type CompanyPermissionCatalog, type CompanyTeamInvitationRepository, type CompanyTeamManagementRepository, type CompanyTeamRepository, type CurrentCompanyPermissions, type TeamInvitation, type TeamInvitationDeliveryStatus, type TeamInvitationInput, type TeamInvitationPage, type TeamPosition } from "@/data/company/contracts";
import { ApiError } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";

type Repository = CompanyTeamRepository & Pick<CompanyTeamManagementRepository, "getCompanyTeamPositions"> & CompanyTeamInvitationRepository;
export type TeamInvitationSnapshot = { companyId: number; catalog: CompanyPermissionCatalog; current: CurrentCompanyPermissions; page: TeamInvitationPage; positions: TeamPosition[]; detail?: TeamInvitation };
function changed(): never { throw new ApiError(409, "INVITATION_CONTEXT_CHANGED", "회사·권한이 변경됐어요. 최신 정보에서 다시 작성해 주세요."); }
function forbidden(): never { throw new ApiError(403, "INVITATION_FORBIDDEN", "현재 권한으로 이 초대를 보낼 수 없어요."); }

export async function loadTeamInvitations(access: AuthAccess, companyId: number, page: number, signal: AbortSignal, repository: Repository = company,
  isCurrent = () => true, invitationId?: number): Promise<TeamInvitationSnapshot> {
  const account = access.getAccountKey();
  function check() { signal.throwIfAborted(); if (!account || account !== access.getAccountKey() || !isCurrent()) throw new DOMException("aborted", "AbortError"); }
  check();
  if ((await repository.getCompanyTeamContext(access, signal)).companyId !== companyId) changed(); check();
  const [catalog, current] = await Promise.all([repository.getCompanyPermissionCatalog(access, signal), repository.getCurrentCompanyPermissions(access, companyId, signal)]); check();
  if (current.companyId !== companyId || !current.permissionCodes.includes("COMPANY_MEMBER_LIST_VIEW")) forbidden();
  teamRoleFromPermissions(catalog, current.permissionCodes);
  const [invitations, positions, detail] = await Promise.all([
    repository.listTeamInvitations(access, companyId, page, 20, signal), repository.getCompanyTeamPositions(access, companyId, signal),
    invitationId === undefined ? undefined : repository.getTeamInvitation(access, companyId, invitationId, signal),
  ]); check();
  for (const v of [...invitations.content, ...(detail ? [detail] : [])]) {
    if (v.companyId !== companyId || teamRoleFromPermissions(catalog, v.permissions) !== v.role) throw new ApiError(0, "INVITATION_CATALOG_MISMATCH", "초대의 회사와 권한 정보를 다시 확인해 주세요.");
  }
  if (detail && detail.invitationId !== invitationId) changed();
  if ((await repository.getCompanyTeamContext(access, signal)).companyId !== companyId) changed(); check();
  const latest = await repository.getCurrentCompanyPermissions(access, companyId, signal); check();
  if (latest.companyId !== companyId || latest.membershipId !== current.membershipId || !sameTeamPermissions(latest.permissionCodes, current.permissionCodes)) changed();
  return { companyId, catalog, current, page: invitations, positions, detail };
}

export function planTeamInvitation(snapshot: TeamInvitationSnapshot, input: TeamInvitationInput) {
  const body = normalizeTeamInvitation(input), { capabilities: c } = snapshot.page, actor = snapshot.current.permissionCodes;
  if (!c.canInvite || !actor.includes("COMPANY_MEMBER_INVITE")) forbidden();
  const preset = (role: "ADMIN" | "AGENT" | "VIEWER") => snapshot.catalog.presets.find(p => p.role === role)!.permissionCodes;
  if (body.representative) {
    if (!c.canInviteRepresentative || teamRoleFromPermissions(snapshot.catalog, actor) !== "ADMIN") forbidden();
    return { body, permissions: [...preset("ADMIN")] };
  }
  if (body.positionId !== null && !snapshot.positions.some(p => p.id === body.positionId && p.type === "CUSTOM")) throw new ApiError(409, "INVITATION_POSITION_CHANGED", "현재 회사의 일반 직급을 다시 선택해 주세요.");
  if (body.proposedPositionName && (!c.canEditPosition || !actor.includes("COMPANY_MEMBER_PROFILE_EDIT"))) forbidden();
  const permissions = [...new Set([...preset(body.preset ?? "VIEWER"), ...body.extraPermissionCodes])];
  teamRoleFromPermissions(snapshot.catalog, permissions);
  if (permissions.some(code => !actor.includes(code)) || !sameTeamPermissions(permissions, preset("VIEWER")) && (!c.canManagePermissions || !actor.includes("COMPANY_MEMBER_PERMISSION_MANAGE"))) forbidden();
  return { body, permissions };
}

export function createTeamInvitationScope(access: AuthAccess, isCurrent: () => boolean, repository: Repository = company) {
  const account = access.getAccountKey(), abort = new AbortController(); let busy = false, submitted = false;
  function check() { abort.signal.throwIfAborted(); if (!account || account !== access.getAccountKey() || !isCurrent()) throw new DOMException("aborted", "AbortError"); }
  return {
    dispose: () => abort.abort(),
    async submit(snapshot: TeamInvitationSnapshot, input: TeamInvitationInput): Promise<TeamInvitation> {
      check();
      if (busy || submitted) throw new ApiError(409, "INVITATION_ALREADY_SUBMITTED", "현재 초대 상태를 조회한 뒤 다시 작성해 주세요.");
      busy = true;
      try {
        const selected = planTeamInvitation(snapshot, input);
        const latest = await loadTeamInvitations(access, snapshot.companyId, 0, abort.signal, repository, isCurrent); check();
        if (latest.current.membershipId !== snapshot.current.membershipId || !sameTeamPermissions(latest.current.permissionCodes, snapshot.current.permissionCodes)
          || JSON.stringify(latest.catalog) !== JSON.stringify(snapshot.catalog)) changed();
        if (selected.body.positionId !== null) {
          const before = snapshot.positions.find(p => p.id === selected.body.positionId), after = latest.positions.find(p => p.id === selected.body.positionId);
          if (!before || !after || JSON.stringify(before) !== JSON.stringify(after)) throw new ApiError(409, "INVITATION_POSITION_CHANGED", "직급이 변경됐어요. 최신 정보에서 다시 작성해 주세요.");
        }
        const { body, permissions } = planTeamInvitation(latest, selected.body);
        submitted = true;
        const result = await repository.createTeamInvitation(access, latest.companyId, body, abort.signal); check();
        if (result.companyId !== snapshot.companyId || result.status !== "PENDING" || result.invitedEmail !== body.email || !sameTeamPermissions(result.permissions, permissions)
          || result.role !== teamRoleFromPermissions(latest.catalog, permissions)) throw new ApiError(0, "INVITATION_RESULT_MISMATCH", "초대 결과를 확인하지 못했어요. 현재 상태를 다시 조회해 주세요.");
        return result;
      } finally { busy = false; }
    },
  };
}

export function teamInvitationStatus(value: TeamInvitation, now = Date.now()): string {
  if (value.status === "PENDING" && Date.parse(value.expiresAt) <= now) return "만료";
  return { PENDING: "수락 대기", CANCELED: "취소", EXPIRED: "만료", DECLINED: "거절", ACCEPTED: "수락 완료" }[value.status];
}
export const teamInvitationDeliveryLabel = (status: TeamInvitationDeliveryStatus): string => ({ PENDING: "메일 전송 대기", SENDING: "메일 전송 중", SENT: "메일 전송 처리 완료", FAILED: "메일 전송 실패", SUPERSEDED: "이전 전송 대체됨" })[status];

import * as company from "@/data/company/client";
import { classifyTeamChange, sameTeamPermissions, teamRequiredPermissions, teamRoleFromPermissions, type CompanyTeamManagementRepository, type CompanyTeamRepository, type CompanyPermissionCatalog, type CompanyTeamMember, type CurrentCompanyPermissions, type TeamChangeCreated, type TeamChangeKind, type TeamChangePage, type TeamChangeQuery, type TeamChangeRequest, type TeamMutation, type TeamPosition } from "@/data/company/contracts";
import { ApiError } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";
import { loadCompanyTeam, type TeamResult } from "./team";

export type TeamDetail = Extract<TeamResult, { status: "detail" }>;
export type TeamIntent = { action: "position"; positionId: number } | { action: "permissions"; permissionCodes: string[]; positionId: number } | { action: "leave" } | { action: "remove" };
export type TeamPlan = { mode: "position" | "permissions" | "self" | "leave" | "remove" | "request"; title: string; positionId?: number; permissionCodes?: string[]; kind?: TeamChangeKind };
export type TeamCommit = { message: string; requestId?: number; ended: boolean };
type Repository = CompanyTeamRepository & CompanyTeamManagementRepository;
function forbidden(): never { throw new ApiError(403, "TEAM_CHANGE_FORBIDDEN", "현재 권한과 대상 조건에서는 변경할 수 없어요."); }

export function planTeamChange(snapshot: TeamDetail, positions: TeamPosition[], intent: TeamIntent): TeamPlan {
  const { member: m, current, catalog } = snapshot, c = m.capabilities, self = current.membershipId === m.membershipId;
  if (intent.action === "leave") { if (!self || !c.canLeave) forbidden(); return { mode: "leave", title: "회사 소속을 종료할까요?" }; }
  if (intent.action === "remove") {
    if (self) forbidden();
    if (c.canRemove && current.permissionCodes.includes("COMPANY_MEMBER_REMOVE")) return { mode: "remove", title: "팀원을 내보낼까요?" };
    if (c.canRequestRemoval && current.permissionCodes.includes("COMPANY_MEMBER_REMOVE")) return { mode: "request", kind: "REMOVE", title: "소속 종료 동의를 요청할까요?" };
    return forbidden();
  }
  const p = positions.find(p => p.id === intent.positionId);
  if (!p) throw new ApiError(409, "TEAM_POSITION_CHANGED", "현재 회사의 직급을 다시 선택해 주세요.");
  const permissions = intent.action === "permissions" ? [...intent.permissionCodes] : null;
  if (permissions) teamRoleFromPermissions(catalog, permissions);
  if (self) {
    if (intent.action === "position" && p.type === "REPRESENTATIVE" && c.canAppointSelfRepresentative && current.permissionCodes.includes("COMPANY_MEMBER_PROFILE_EDIT")) return { mode: "position", positionId: p.id, title: "본인을 대표자로 지정할까요?" };
    if (p.type === "REPRESENTATIVE" && permissions && !sameTeamPermissions(permissions, m.permissions)) throw new ApiError(400, "TEAM_REPRESENTATIVE_POSITION_REQUIRED", "대표자 권한을 줄이려면 해제할 일반 직급도 함께 선택해 주세요.");
    if (!c.canSelfDemote || p.type === "REPRESENTATIVE" || permissions?.some(code => !m.permissions.includes(code)) || m.positionType === "CUSTOM" && p.id !== m.positionId) forbidden();
    return { mode: "self", positionId: m.positionType === "REPRESENTATIVE" ? p.id : undefined, permissionCodes: permissions ?? [...m.permissions], title: "본인의 권한·직급을 축소할까요?" };
  }
  const positionChanged = p.id !== m.positionId;
  const kind: TeamChangeKind = intent.action === "position" ? "POSITION" : positionChanged ? "POSITION_AND_PERMISSIONS" : "PERMISSIONS";
  const effectivePermissions = intent.action === "position" && p.type === "REPRESENTATIVE" ? catalog.presets.find(p => p.role === "ADMIN")!.permissionCodes : permissions;
  if (p.type === "REPRESENTATIVE" && effectivePermissions && teamRoleFromPermissions(catalog, effectivePermissions) !== "ADMIN") forbidden();
  const classification = classifyTeamChange(catalog, current.permissionCodes, m, kind, p, effectivePermissions);
  if (classification === "FORBIDDEN") forbidden();
  if (classification === "CONSENT") {
    if ((kind !== "PERMISSIONS" && !c.canRequestPositionChange) || (kind !== "POSITION" && !c.canRequestPermissionChange)) forbidden();
    return { mode: "request", kind, positionId: kind === "PERMISSIONS" ? undefined : p.id, permissionCodes: kind === "POSITION" ? undefined : permissions!, title: "대상에게 변경 동의를 요청할까요?" };
  }
  if (intent.action === "position" && c.canChangePosition) return { mode: "position", positionId: p.id, title: "팀원의 직급을 변경할까요?" };
  if (intent.action === "permissions" && c.canChangePermissions) {
    if (positionChanged) throw new ApiError(400, "TEAM_SEPARATE_CHANGES", "직접 변경은 직급과 권한을 각각 저장해 주세요. 직급을 먼저 변경한 뒤 최신 정보에서 권한을 저장할 수 있어요.");
    return { mode: "permissions", permissionCodes: permissions!, title: "팀원의 권한을 변경할까요?" };
  }
  return forbidden();
}

export function createTeamCommandScope(access: AuthAccess, isCurrent: () => boolean, repository: Repository = company) {
  const account = access.getAccountKey(), abort = new AbortController(); let busy = false, submitted = false;
  function check() { abort.signal.throwIfAborted(); if (!account || account !== access.getAccountKey() || !isCurrent()) throw new DOMException("aborted", "AbortError"); }
  async function run<T>(task: (signal: AbortSignal) => Promise<T>): Promise<T> {
    check(); if (busy || submitted) throw new ApiError(409, "TEAM_ALREADY_SUBMITTED", "결과를 확인한 뒤 최신 상태에서 다시 진행해 주세요.");
    busy = true;
    try { const value = await task(abort.signal); check(); return value; } finally { busy = false; }
  }
  return {
    dispose: () => abort.abort(),
    async member(snapshot: TeamDetail, positions: TeamPosition[], intent: TeamIntent): Promise<TeamCommit> {
      return run(async signal => {
        const latest = await loadCompanyTeam(access, 0, snapshot.member.membershipId, signal, repository, isCurrent); check();
        if (latest.status !== "detail" || latest.companyId !== snapshot.companyId || latest.current.membershipId !== snapshot.current.membershipId
          || latest.member.version !== snapshot.member.version || latest.catalog.catalogVersion !== snapshot.catalog.catalogVersion
          || !sameTeamPermissions(latest.current.permissionCodes, snapshot.current.permissionCodes)) throw new ApiError(409, "TEAM_CHANGED", "회사·권한 또는 대상 정보가 변경됐어요. 최신 정보에서 다시 선택해 주세요.");
        const currentPositions = await repository.getCompanyTeamPositions(access, snapshot.companyId, signal); check();
        if ("positionId" in intent) {
          const before = positions.find(p => p.id === intent.positionId), now = currentPositions.find(p => p.id === intent.positionId);
          if (!before || !now || JSON.stringify(before) !== JSON.stringify(now)) throw new ApiError(409, "TEAM_POSITION_CHANGED", "직급 정의가 변경됐어요. 최신 정보에서 다시 선택해 주세요.");
        }
        const plan = planTeamChange(latest, currentPositions, intent), id = latest.member.membershipId, expectedVersion = latest.member.version;
        let result: TeamMutation | TeamChangeCreated;
        submitted = true;
        if (plan.mode === "request") {
          const common = { requestKey: crypto.randomUUID(), expectedMembershipVersion: expectedVersion };
          const body = plan.kind === "POSITION" ? { ...common, kind: "POSITION" as const, positionId: plan.positionId! }
            : plan.kind === "PERMISSIONS" ? { ...common, kind: "PERMISSIONS" as const, permissionCodes: plan.permissionCodes! }
            : plan.kind === "POSITION_AND_PERMISSIONS" ? { ...common, kind: "POSITION_AND_PERMISSIONS" as const, positionId: plan.positionId!, permissionCodes: plan.permissionCodes! }
            : { ...common, kind: "REMOVE" as const };
          result = await repository.createTeamChangeRequest(access, id, body, signal);
        } else if (plan.mode === "position") result = await repository.changeTeamMemberPosition(access, id, { expectedVersion, positionId: plan.positionId! }, signal);
        else if (plan.mode === "permissions") result = await repository.changeTeamMemberPermissions(access, id, { expectedVersion, permissionCodes: plan.permissionCodes! }, signal);
        else if (plan.mode === "self") result = await repository.demoteMyTeamMembership(access, id, { expectedVersion, permissionCodes: plan.permissionCodes!, positionId: plan.positionId ?? null }, signal);
        else if (plan.mode === "leave") result = await repository.leaveMyTeamMembership(access, id, expectedVersion, signal);
        else result = await repository.removeCompanyTeamMember(access, id, expectedVersion, signal);
        check();
        if ("outcome" in result) {
          if ((result.request?.companyId ?? result.membership?.companyId) !== snapshot.companyId) throw new ApiError(0, "TEAM_RESULT_MISMATCH", "결과의 회사 정보를 다시 확인해 주세요.");
          if (result.request && result.request.status !== "PENDING") return { requestId: result.request.changeRequestId, ended: result.request.kind === "REMOVE" && result.request.status === "APPLIED", message: `기존 요청의 처리 결과를 확인했어요: ${teamChangeStatusLabel(result.request.status)}. 현재 상태를 다시 확인해 주세요.` };
          return { ended: false, requestId: result.request?.changeRequestId, message: result.outcome === "NO_CHANGE" ? "이미 같은 상태예요. 변경하지 않았어요." : result.outcome === "REUSED" ? "기존 동의 요청을 확인했어요. 현재 권한은 수락 전까지 유지돼요." : "변경 동의를 요청했어요. 대상이 수락하기 전까지 현재 권한은 유지돼요." };
        }
        if (result.companyId !== snapshot.companyId || result.membershipId !== snapshot.member.membershipId) throw new ApiError(0, "TEAM_RESULT_MISMATCH", "처리된 대상 정보를 다시 확인해 주세요.");
        return { ended: result.status !== "ACTIVE", message: result.version === expectedVersion ? "이미 같은 상태예요. 변경하지 않았어요." : result.status === "LEFT" ? "회사 소속을 종료했어요. 서비스 계정은 유지돼요." : result.status === "REMOVED" ? "팀원을 내보냈어요." : "변경 내용을 적용했어요." };
      });
    },
    async request(snapshot: TeamChangeRequest, action: "ACCEPT" | "REJECT" | "CANCEL"): Promise<TeamCommit> {
      return run(async signal => {
        const latest = await repository.getTeamChangeRequest(access, snapshot.changeRequestId, signal); check();
        if (latest.companyId !== snapshot.companyId || latest.targetMembershipId !== snapshot.targetMembershipId || latest.requestVersion !== snapshot.requestVersion || latest.status !== "PENDING") throw new ApiError(409, "TEAM_REQUEST_CHANGED", "변경 요청의 최신 상태를 확인해 주세요.");
        const c = latest.capabilities;
        if (!(action === "ACCEPT" ? c.canAccept : action === "REJECT" ? c.canReject : c.canCancel)) forbidden();
        // The detail endpoint validates the authenticated target, including past memberships.
        // A current company snapshot is additionally required before a new command.
        const context = await repository.getCompanyTeamContext(access, signal); check();
        if (context.companyId !== latest.companyId) forbidden();
        const current = await repository.getCurrentCompanyPermissions(access, latest.companyId, signal); check();
        if (current.companyId !== latest.companyId || action === "CANCEL" && teamRequiredPermissions(latest.kind).some(code => !current.permissionCodes.includes(code))) forbidden();
        if (action !== "CANCEL" && current.membershipId !== latest.targetMembershipId) forbidden();
        submitted = true;
        const body = { requestKey: crypto.randomUUID(), expectedRequestVersion: latest.requestVersion };
        const result = action === "CANCEL" ? await repository.cancelTeamChangeRequest(access, latest.changeRequestId, body, signal)
          : await repository.decideTeamChangeRequest(access, latest.changeRequestId, { ...body, decision: action }, signal);
        check();
        if (result.companyId !== snapshot.companyId || result.targetMembershipId !== snapshot.targetMembershipId) throw new ApiError(0, "TEAM_RESULT_MISMATCH", "처리된 요청 정보를 다시 확인해 주세요.");
        return { requestId: result.changeRequestId, ended: result.kind === "REMOVE" && result.status === "APPLIED", message: result.status === "APPLIED" ? "요청을 수락하고 변경 내용을 적용했어요." : result.status === "REJECTED" ? "변경 요청을 거절했어요. 기존 상태는 유지돼요." : "변경 요청을 취소했어요." };
      });
    },
  };
}

export const teamChangePath = (id?: number) => id === undefined ? "/my/team/change-requests" : `/my/team/change-requests/${id}`;
export const teamChangeStatusLabel = (status: TeamChangeRequest["status"]) => ({ PENDING: "동의 대기", APPLIED: "적용 완료", REJECTED: "거절", CANCELED: "취소", INVALIDATED: "무효" }[status]);
export const teamChangeKindLabel = (kind: TeamChangeKind) => ({ POSITION: "직급 변경", PERMISSIONS: "권한 변경", POSITION_AND_PERMISSIONS: "직급·권한 변경", REMOVE: "회사 소속 종료" }[kind]);
export const teamCommitToast = (value: TeamCommit) => `${value.message.split(".")[0]}.`;
export type TeamChanges = { companyId: number | null; catalog: CompanyPermissionCatalog; targets: Record<number, CompanyTeamMember | null> } & ({ status: "detail"; request: TeamChangeRequest } | { status: "list"; page: TeamChangePage } | { status: "no-company" });
export async function loadTeamChanges(access: AuthAccess, query: TeamChangeQuery, id: number | undefined, signal: AbortSignal, repository: Repository = company, isCurrent = () => true): Promise<TeamChanges> {
  const account = access.getAccountKey();
  function check() { signal.throwIfAborted(); if (!account || account !== access.getAccountKey() || !isCurrent()) throw new DOMException("aborted", "AbortError"); }
  check();
  const { companyId } = await repository.getCompanyTeamContext(access, signal); check();
  const catalog = await repository.getCompanyPermissionCatalog(access, signal); check();
  let current: CurrentCompanyPermissions | null = null;
  if (companyId !== null) {
    try { current = await repository.getCurrentCompanyPermissions(access, companyId, signal); check(); }
    catch (error) { check(); if (!(error instanceof ApiError && error.status === 403 && query.scope === "mine")) throw error; }
  }
  if (query.scope === "company" && companyId !== null && !current?.permissionCodes.includes("COMPANY_MEMBER_LIST_VIEW")) forbidden();
  const targets: Record<number, CompanyTeamMember | null> = {};
  let result: TeamChanges;
  if (id !== undefined) {
    const request = await repository.getTeamChangeRequest(access, id, signal); check();
    if (request.companyId !== companyId && Object.entries(request.capabilities).some(([key, value]) => key !== "blockingReason" && value === true)) throw new ApiError(409, "TEAM_REQUEST_SCOPE_CHANGED", "현재 소속과 요청을 다시 확인해 주세요.");
    result = { status: "detail", companyId, catalog, targets, request };
  } else if (query.scope === "company" && companyId === null) result = { status: "no-company", companyId, catalog, targets };
  else {
    const page = await repository.listTeamChangeRequests(access, { ...query, ...(query.scope === "company" ? { companyId: companyId! } : {}) }, signal); check();
    result = { status: "list", companyId, catalog, targets, page };
  }
  const requests = result.status === "detail" ? [result.request] : result.status === "list" ? result.page.content : [];
  // Only current-company exact memberships may supply current display data.
  const ids = current?.permissionCodes.includes("COMPANY_MEMBER_LIST_VIEW") ? [...new Set(requests.filter(r => r.companyId === companyId).map(r => r.targetMembershipId))] : [];
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(4, ids.length) }, async () => {
    while (cursor < ids.length) {
      const targetId = ids[cursor++]; check();
      try { targets[targetId] = await repository.getCompanyTeamMember(access, companyId!, targetId, signal); check(); }
      catch (error) { check(); if (error instanceof ApiError && error.status === 404) targets[targetId] = null; else throw error; }
    }
  }));
  const latest = await repository.getCompanyTeamContext(access, signal); check();
  if (latest.companyId !== companyId) throw new ApiError(409, "TEAM_CONTEXT_CHANGED", "소속이 변경됐어요. 변경 요청을 다시 확인해 주세요.");
  const companyScope = query.scope === "company" || result.status === "detail" && result.request.companyId === companyId;
  if (current && companyScope) {
    const permissions = await repository.getCurrentCompanyPermissions(access, companyId!, signal); check();
    if (current.companyId !== companyId || permissions.companyId !== companyId || current.membershipId !== permissions.membershipId
      || !permissions.permissionCodes.includes("COMPANY_MEMBER_LIST_VIEW") || !sameTeamPermissions(current.permissionCodes, permissions.permissionCodes)) throw new ApiError(409, "TEAM_PERMISSIONS_CHANGED", "소속 또는 권한이 변경됐어요. 현재 권한으로 요청을 다시 조회해 주세요.");
  } else if (!current && result.status === "detail") {
    // Personal historical receipts remain readable without current company leaves.
    const confirmed = await repository.getTeamChangeRequest(access, result.request.changeRequestId, signal); check();
    if (JSON.stringify(confirmed) !== JSON.stringify(result.request)) throw new ApiError(409, "TEAM_REQUEST_CHANGED", "요청의 최신 상태를 다시 확인해 주세요.");
  }
  return result;
}

import * as company from "@/data/company/client";
import { normalizeTeamPositionName, sameTeamPermissions, type CompanyTeamManagementRepository, type CompanyTeamRepository, type CurrentCompanyPermissions, type TeamPosition } from "@/data/company/contracts";
import { ApiError } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";

type Repository = Pick<CompanyTeamRepository, "getCompanyTeamContext" | "getCurrentCompanyPermissions" | "listCompanyTeamMembers">
  & Pick<CompanyTeamManagementRepository, "getCompanyTeamPositions" | "createCompanyTeamPosition" | "renameCompanyTeamPosition" | "deleteCompanyTeamPosition">;
export type TeamPositionSnapshot = {
  companyId: number;
  current: CurrentCompanyPermissions;
  teamCount: number;
  canReviewRequests: boolean;
  canManage: boolean;
  positions: TeamPosition[];
};
export type TeamPositionChange =
  | { kind: "create"; name: string }
  | { kind: "rename"; position: TeamPosition; name: string }
  | { kind: "delete"; position: TeamPosition };

const listPermission = "COMPANY_MEMBER_LIST_VIEW";
const managePermission = "COMPANY_POSITION_MANAGE";
export const teamPositionsPath = (page = 1) => `/my/team/positions${page > 1 ? `?page=${page}` : ""}`;

function changed(): never {
  throw new ApiError(409, "POSITION_CONTEXT_CHANGED", "현재 회사나 권한이 변경됐어요. 목록을 다시 조회해 주세요.");
}

function forbidden(): never {
  throw new ApiError(403, "POSITION_FORBIDDEN", "현재 회사의 직급 권한을 확인해 주세요.");
}

function sameMembership(before: CurrentCompanyPermissions, after: CurrentCompanyPermissions) {
  return before.companyId === after.companyId && before.membershipId === after.membershipId;
}

function boundAccess(access: AuthAccess, signal: AbortSignal, isCurrent: () => boolean) {
  const account = access.getAccountKey();
  function check() {
    signal.throwIfAborted();
    if (!account || access.getAccountKey() !== account || !isCurrent()) throw new DOMException("aborted", "AbortError");
    access.assertRequestScope?.();
  }
  return { scoped: { ...access, assertRequestScope: check }, check };
}

async function currentCompany(repo: Repository, access: AuthAccess, signal: AbortSignal, check: () => void) {
  check();
  const { companyId } = await repo.getCompanyTeamContext(access, signal);
  check();
  if (companyId === null) return null;
  const current = await repo.getCurrentCompanyPermissions(access, companyId, signal);
  check();
  if (current.companyId !== companyId) changed();
  if (!current.permissionCodes.includes(listPermission)) forbidden();
  return current;
}

export async function loadTeamPositions(access: AuthAccess, signal: AbortSignal, repo: Repository = company, isCurrent = () => true): Promise<TeamPositionSnapshot | null> {
  const { scoped, check } = boundAccess(access, signal, isCurrent);
  const current = await currentCompany(repo, scoped, signal, check);
  if (!current) return null;
  const { companyId } = current;
  const [positions, page] = await Promise.all([
    repo.getCompanyTeamPositions(scoped, companyId, signal),
    repo.listCompanyTeamMembers(scoped, companyId, 0, 1, signal),
  ]);
  const latest = await currentCompany(repo, scoped, signal, check);
  if (!latest || !sameMembership(current, latest) || !sameTeamPermissions(current.permissionCodes, latest.permissionCodes)) changed();
  return { companyId, current: latest, positions, teamCount: page.totalElements, canReviewRequests: page.capabilities.canReviewRequests,
    canManage: page.capabilities.canManagePositions && latest.permissionCodes.includes(managePermission) };
}

export async function applyTeamPositionChange(access: AuthAccess, snapshot: TeamPositionSnapshot, change: TeamPositionChange, signal: AbortSignal,
  repo: Repository = company, isCurrent = () => true): Promise<"changed" | "unchanged"> {
  if (!snapshot.canManage) forbidden();
  const { scoped, check } = boundAccess(access, signal, isCurrent);
  const latest = await loadTeamPositions(scoped, signal, repo);
  check();
  if (!latest || !sameMembership(snapshot.current, latest.current) || snapshot.companyId !== latest.companyId) changed();
  if (!latest.canManage) forbidden();
  const { companyId } = latest;
  if (change.kind === "create") {
    const name = normalizeTeamPositionName(change.name);
    const created = await repo.createCompanyTeamPosition(scoped, companyId, name, signal);
    check();
    if (latest.positions.some(p => p.id === created.id)) invalidReceipt();
    return "changed";
  }
  const position = latest.positions.find(p => p.id === change.position.id);
  if (!position) throw new ApiError(404, "CP001", "회사 직급을 찾지 못했어요.");
  if (position.type !== "CUSTOM" || change.position.type !== "CUSTOM") throw new ApiError(409, "CP003", "대표자 직급은 변경하거나 삭제할 수 없어요.");
  if (position.version !== change.position.version || position.name !== change.position.name) throw new ApiError(409, "CP005", "직급이 변경됐어요. 최신 목록을 확인해 주세요.");
  if (change.kind === "delete") {
    await repo.deleteCompanyTeamPosition(scoped, companyId, position.id, position.version, signal);
  } else {
    const name = normalizeTeamPositionName(change.name);
    if (name === position.name) return "unchanged";
    const renamed = await repo.renameCompanyTeamPosition(scoped, companyId, position.id, name, position.version, signal);
    if (renamed.version !== position.version + 1) invalidReceipt();
  }
  check();
  return "changed";
}

function invalidReceipt(): never {
  throw new ApiError(0, "POSITION_RECEIPT_INVALID", "직급 처리 결과를 확인하지 못했어요.");
}

export function positionCommandMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.code) {
      case "CP001": return "회사 직급을 찾지 못했어요. 최신 목록을 확인해 주세요.";
      case "CP002": return "같은 이름의 직급이 이미 있어요.";
      case "CP003": return "대표자 직급은 변경하거나 삭제할 수 없어요.";
      case "CP004": return "사용 중인 직급은 삭제할 수 없어요. 해당 팀원의 직급을 먼저 변경해 주세요.";
      case "CP005":
      case "POSITION_CONTEXT_CHANGED": return "회사나 직급 정보가 변경됐어요. 최신 목록을 확인해 주세요.";
    }
    if (error.status >= 400 && error.status < 500) return "직급 변경이 거절됐어요. 최신 목록과 입력값을 확인해 주세요.";
  }
  return "직급 처리 결과를 확인하지 못했어요. 목록을 다시 조회해 주세요.";
}

import { getCompanyTeamContext, getCompanyPermissionCatalog, getCurrentCompanyPermissions, listCompanyTeamMembers, getCompanyTeamMember } from "@/data/company/client";
import type { CompanyPermissionCatalog, CompanyTeamMember, CompanyTeamPage, CompanyTeamRepository, CurrentCompanyPermissions, TeamRole } from "@/data/company/contracts";
import { ApiError } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";

const queries = { getCompanyTeamContext, getCompanyPermissionCatalog, getCurrentCompanyPermissions, listCompanyTeamMembers, getCompanyTeamMember };
type TeamContext = { companyId: number; catalog: CompanyPermissionCatalog; current: CurrentCompanyPermissions };
export type TeamResult = { status: "no-company" } | TeamContext & (
  { status: "list"; page: CompanyTeamPage } | { status: "detail"; member: CompanyTeamMember }
);

export async function loadCompanyTeam(access: AuthAccess, page: number, membershipId: number | undefined, signal: AbortSignal, repository: CompanyTeamRepository = queries, isCurrent = () => true): Promise<TeamResult> {
  const account = access.getAccountKey();
  function check() {
    signal.throwIfAborted();
    if (!account || account !== access.getAccountKey() || !isCurrent()) throw new DOMException("aborted", "AbortError");
  }
  check();
  const { companyId } = await repository.getCompanyTeamContext(access, signal); check();
  if (companyId === null) return { status: "no-company" };
  const [catalog, current] = await Promise.all([
    repository.getCompanyPermissionCatalog(access, signal), repository.getCurrentCompanyPermissions(access, companyId, signal),
  ]); check();
  if (current.companyId !== companyId) throw new ApiError(409, "TEAM_CONTEXT_CHANGED", "회사 정보가 변경됐어요. 다시 확인해 주세요.");
  const codes = new Set(catalog.categories.flatMap(category => category.permissions.map(permission => permission.code)));
  const validatePermissions = (permissions: string[]) => {
    if (permissions.some(code => !codes.has(code))) throw new ApiError(0, "TEAM_CATALOG_MISMATCH", "권한 정보를 다시 확인해 주세요.");
  };
  validatePermissions(current.permissionCodes);
  if (!current.permissionCodes.includes("COMPANY_MEMBER_LIST_VIEW")) throw new ApiError(403, "TEAM_FORBIDDEN", "팀원을 조회할 권한이 없어요.");
  let result: TeamResult;
  if (membershipId !== undefined) {
    const member = await repository.getCompanyTeamMember(access, companyId, membershipId, signal); check();
    validatePermissions(member.permissions);
    result = { status: "detail", companyId, catalog, current, member };
  } else {
    const members = await repository.listCompanyTeamMembers(access, companyId, page, 20, signal); check();
    members.content.forEach(member => validatePermissions(member.permissions));
    result = { status: "list", companyId, catalog, current, page: members };
  }
  const latest = await repository.getCompanyTeamContext(access, signal); check();
  if (latest.companyId !== companyId) throw new ApiError(409, "TEAM_CONTEXT_CHANGED", "소속 회사가 변경됐어요. 다시 확인해 주세요.");
  const latestPermissions = await repository.getCurrentCompanyPermissions(access, companyId, signal); check();
  if (!latestPermissions.permissionCodes.includes("COMPANY_MEMBER_LIST_VIEW")) throw new ApiError(403, "TEAM_FORBIDDEN", "팀원을 조회할 권한이 없어요.");
  if (latestPermissions.membershipId !== current.membershipId || latestPermissions.companyId !== companyId
    || [...latestPermissions.permissionCodes].sort().join(",") !== [...current.permissionCodes].sort().join(",")) {
    throw new ApiError(409, "TEAM_CONTEXT_CHANGED", "팀원 권한이 변경됐어요. 다시 확인해 주세요.");
  }
  return result;
}

export function teamPageNumber(value: string | string[] | undefined): number | null {
  if (value === undefined) return 1;
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return null;
  const page = Number(value);
  return Number.isSafeInteger(page) && (page - 1) * 20 <= 2_147_483_647 ? page : null;
}
export function teamMembershipId(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}
export function teamListPath(page = 1): string { return page > 1 ? `/my/team?page=${page}` : "/my/team"; }
export function teamDetailPath(membershipId: number, page = 1): string { return `/my/team/${membershipId}${page > 1 ? `?page=${page}` : ""}`; }
export function teamRoleLabel(role: TeamRole): string { return { ADMIN: "관리자", AGENT: "대리인", VIEWER: "뷰어" }[role]; }
export function teamMemberName(member: CompanyTeamMember): string { return member.displayName?.trim() || "이름 미제공"; }
export function teamDate(value: string | null, includeTime = false): string {
  if (value === null) return "기록 없음";
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit", ...(includeTime ? { hour: "2-digit", minute: "2-digit", hourCycle: "h23" as const } : {}) }).formatToParts(new Date(value));
  const part = (type: string) => parts.find(item => item.type === type)?.value;
  return `${part("year")}.${part("month")}.${part("day")}${includeTime ? ` ${part("hour")}:${part("minute")}` : ""}`;
}

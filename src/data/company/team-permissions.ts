import { ApiError } from "../shared/errors";
import type { CompanyPermissionCatalog, CompanyTeamMember, TeamRole } from "./team-contracts";
import type { TeamChangeKind, TeamPosition } from "./team-management-contracts";

export const sameTeamPermissions = (a: string[], b: string[]) => [...a].sort().join(",") === [...b].sort().join(",");
export function teamRoleFromPermissions(catalog: CompanyPermissionCatalog, permissions: string[]): TeamRole {
  const known = catalog.categories.flatMap(c => c.permissions.map(p => p.code));
  const viewer = catalog.presets.find(p => p.role === "VIEWER")!;
  if (new Set(permissions).size !== permissions.length || permissions.some(code => !known.includes(code)) || viewer.permissionCodes.some(code => !permissions.includes(code))) {
    throw new ApiError(400, "TEAM_PERMISSIONS_INVALID", "조회 기본 권한을 유지하고 유효한 권한을 선택해 주세요.");
  }
  for (const role of ["ADMIN", "AGENT"] as const) {
    if (catalog.presets.find(p => p.role === role)!.permissionCodes.every(code => permissions.includes(code))) return role;
  }
  return "VIEWER";
}
export function teamRequiredPermissions(kind: TeamChangeKind): string[] {
  return kind === "REMOVE" ? ["COMPANY_MEMBER_REMOVE"] : kind === "POSITION" ? ["COMPANY_MEMBER_PROFILE_EDIT"] : kind === "PERMISSIONS" ? ["COMPANY_MEMBER_PERMISSION_MANAGE"] : ["COMPANY_MEMBER_PROFILE_EDIT", "COMPANY_MEMBER_PERMISSION_MANAGE"];
}
export function classifyTeamChange(catalog: CompanyPermissionCatalog, actor: string[], target: Pick<CompanyTeamMember, "permissions" | "positionType">,
  kind: TeamChangeKind, position: TeamPosition | null, permissions: string[] | null): "DIRECT" | "CONSENT" | "FORBIDDEN" {
  if (teamRequiredPermissions(kind).some(code => !actor.includes(code))) return "FORBIDDEN";
  const actorRole = teamRoleFromPermissions(catalog, actor), targetRole = teamRoleFromPermissions(catalog, target.permissions);
  if (permissions && (permissions.some(code => !actor.includes(code)) || teamRoleFromPermissions(catalog, permissions) === "ADMIN" && actorRole !== "ADMIN")) return "FORBIDDEN";
  if (target.positionType === "REPRESENTATIVE" || position?.type === "REPRESENTATIVE") return actorRole === "ADMIN" ? "CONSENT" : "FORBIDDEN";
  const rank = { ADMIN: 3, AGENT: 2, VIEWER: 1 };
  if (rank[actorRole] < rank[targetRole]) return "FORBIDDEN";
  if (actorRole === targetRole || permissions && teamRoleFromPermissions(catalog, permissions) === "ADMIN" && targetRole !== "ADMIN") return "CONSENT";
  return "DIRECT";
}

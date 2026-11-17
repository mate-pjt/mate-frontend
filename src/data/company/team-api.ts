import { ApiError } from "../shared/errors";
import type { HttpClient } from "../shared/http";
import type { CompanyPermissionCatalog, CompanyTeamMember, CompanyTeamPage, CompanyTeamRepository, CurrentCompanyPermissions, TeamCapabilities, TeamMemberCapabilities, TeamRole } from "./team-contracts";

const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value);
const count = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
const positive = (value: unknown): value is number => count(value) && value > 0;
const text = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
export function timestamp(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/.test(value) || !Number.isFinite(Date.parse(value))) return false;
  const day = value.slice(0, 10);
  return new Date(`${day}T00:00:00Z`).toISOString().slice(0, 10) === day && Number(value.slice(11, 13)) < 24;
}
const roles: TeamRole[] = ["ADMIN", "AGENT", "VIEWER"];
const pageFlags: Array<keyof TeamCapabilities> = ["canInvite", "canReviewRequests", "canManagePositions"];
const memberFlags: Array<keyof TeamMemberCapabilities> = ["canChangePermissions", "canChangePosition", "canRemove", "canSelfDemote", "canLeave", "canRequestPermissionChange", "canRequestPositionChange", "canRequestRemoval", "canAppointSelfRepresentative"];
function invalid(): never { throw new ApiError(0, "TEAM_RESPONSE_INVALID", "팀원 정보를 확인하지 못했어요. 다시 조회해 주세요."); }
function strings(value: unknown): string[] {
  if (!Array.isArray(value) || !value.every(text) || new Set(value).size !== value.length) invalid();
  return [...value];
}
function flags<K extends string>(value: unknown, keys: K[]): Record<K, boolean> {
  if (!record(value) || keys.some(key => typeof value[key] !== "boolean")) invalid();
  return Object.fromEntries(keys.map(key => [key, value[key]])) as Record<K, boolean>;
}
export function validateTeamQuery(companyId: number, page = 0, size = 20) {
  if (!positive(companyId) || !count(page) || !positive(size) || size > 100 || page * size > 2_147_483_647) {
    throw new ApiError(400, "TEAM_INPUT_INVALID", "회사와 팀원 페이지 정보를 확인해 주세요.");
  }
}
export function validateTeamMemberId(membershipId: number) {
  if (!positive(membershipId)) throw new ApiError(400, "TEAM_INPUT_INVALID", "조회할 팀원 정보를 확인해 주세요.");
}
export function mapPermissionCatalog(value: unknown): CompanyPermissionCatalog {
  if (!record(value) || !text(value.catalogVersion) || !Array.isArray(value.categories) || !value.categories.length || !Array.isArray(value.presets)) invalid();
  const categories = value.categories.map((category: unknown) => {
    if (!record(category) || !text(category.code) || !text(category.name) || !Array.isArray(category.permissions) || !category.permissions.length) invalid();
    return { code: category.code, name: category.name, permissions: category.permissions.map((permission: unknown) => {
      if (!record(permission) || !text(permission.code) || !text(permission.name) || !text(permission.description)) invalid();
      return { code: permission.code, name: permission.name, description: permission.description };
    }) };
  });
  const codes = categories.flatMap(category => category.permissions.map(permission => permission.code));
  if (new Set(codes).size !== codes.length || new Set(categories.map(category => category.code)).size !== categories.length) invalid();
  const presets = value.presets.map((preset: unknown) => {
    if (!record(preset) || !roles.includes(preset.role as TeamRole)) invalid();
    const permissionCodes = strings(preset.permissionCodes);
    if (permissionCodes.some(code => !codes.includes(code))) invalid();
    return { role: preset.role as TeamRole, permissionCodes };
  });
  if (presets.length !== roles.length || new Set(presets.map(preset => preset.role)).size !== roles.length) invalid();
  return { catalogVersion: value.catalogVersion, categories, presets };
}
export function mapCurrentPermissions(value: unknown, companyId: number): CurrentCompanyPermissions {
  if (!record(value) || value.companyId !== companyId || !positive(value.membershipId)) invalid();
  return { companyId, membershipId: value.membershipId, permissionCodes: strings(value.permissionCodes) };
}
export function mapTeamMember(value: unknown): CompanyTeamMember {
  if (!record(value) || !positive(value.membershipId) || !positive(value.accountId) || !positive(value.positionId) || !positive(value.version)
    || !(value.displayName === null || typeof value.displayName === "string") || !text(value.contactEmail) || !text(value.positionName)
    || !["CUSTOM", "REPRESENTATIVE"].includes(String(value.positionType)) || !roles.includes(value.role as TeamRole)
    || !timestamp(value.joinedAt) || !(value.lastLoginAt === null || timestamp(value.lastLoginAt))) invalid();
  let profileImageUrl: string | null = null;
  if (value.profileImageUrl !== null) {
    if (!text(value.profileImageUrl)) invalid();
    try {
      const url = new URL(value.profileImageUrl);
      if (url.protocol !== "https:" || url.username || url.password || url.hash) invalid();
      profileImageUrl = url.href;
    } catch { invalid(); }
  }
  // Account IDs and unsupported personal fields do not cross the HTTP boundary.
  return { membershipId: value.membershipId, displayName: value.displayName, contactEmail: value.contactEmail, profileImageUrl,
    positionId: value.positionId, positionName: value.positionName, positionType: value.positionType as CompanyTeamMember["positionType"],
    role: value.role as TeamRole, permissions: strings(value.permissions), joinedAt: value.joinedAt, lastLoginAt: value.lastLoginAt,
    version: value.version, capabilities: flags(value.capabilities, memberFlags) };
}
export function mapTeamPage(value: unknown, page: number, size: number): CompanyTeamPage {
  if (!record(value) || !Array.isArray(value.content) || value.page !== page || value.size !== size || !count(value.totalElements)
    || value.totalPages !== Math.ceil(value.totalElements / size) || value.content.length !== Math.max(0, Math.min(size, value.totalElements - page * size))) invalid();
  const content = value.content.map(mapTeamMember);
  if (new Set(content.map(member => member.membershipId)).size !== content.length) invalid();
  for (let i = 1; i < content.length; i++) {
    const previous = content[i - 1], current = content[i];
    const milliseconds = Date.parse(previous.joinedAt) - Date.parse(current.joinedAt);
    const fraction = (date: string) => (date.match(/\.(\d+)/)?.[1] ?? "").padEnd(9, "0");
    const order = milliseconds || fraction(previous.joinedAt).localeCompare(fraction(current.joinedAt));
    if (order > 0 || order === 0 && previous.membershipId >= current.membershipId) invalid();
  }
  return { content, page, size, totalElements: value.totalElements, totalPages: value.totalPages as number, capabilities: flags(value.capabilities, pageFlags) };
}
export function createTeamQueries(http: HttpClient): Omit<CompanyTeamRepository, "getCompanyTeamContext"> {
  return {
    async getCompanyPermissionCatalog(access, signal) {
      return mapPermissionCatalog(await http.authorized<unknown>(access, "/api/v1/company-permission-definitions", { signal }));
    },
    async getCurrentCompanyPermissions(access, companyId, signal) {
      validateTeamQuery(companyId);
      return mapCurrentPermissions(await http.authorized<unknown>(access, `/api/v1/companies/${companyId}/memberships/me`, { signal }), companyId);
    },
    async listCompanyTeamMembers(access, companyId, page = 0, size = 20, signal) {
      validateTeamQuery(companyId, page, size);
      const params = new URLSearchParams({ page: String(page), size: String(size) });
      return mapTeamPage(await http.authorized<unknown>(access, `/api/v1/companies/${companyId}/members?${params}`, { signal }), page, size);
    },
    async getCompanyTeamMember(access, companyId, membershipId, signal) {
      validateTeamQuery(companyId); validateTeamMemberId(membershipId);
      const member = mapTeamMember(await http.authorized<unknown>(access, `/api/v1/companies/${companyId}/members/${membershipId}`, { signal }));
      if (member.membershipId !== membershipId) invalid();
      return member;
    },
  };
}

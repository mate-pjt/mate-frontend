import type { AuthAccess } from "../shared/http";

export type TeamRole = "ADMIN" | "AGENT" | "VIEWER";
export type CompanyPermissionCatalog = {
  catalogVersion: string;
  categories: Array<{ code: string; name: string; permissions: Array<{ code: string; name: string; description: string }> }>;
  presets: Array<{ role: TeamRole; permissionCodes: string[] }>;
};
export type CurrentCompanyPermissions = { companyId: number; membershipId: number; permissionCodes: string[] };
export type TeamCapabilities = { canInvite: boolean; canReviewRequests: boolean; canManagePositions: boolean };
export type TeamMemberCapabilities = {
  canChangePermissions: boolean;
  canChangePosition: boolean;
  canRemove: boolean;
  canSelfDemote: boolean;
  canLeave: boolean;
  canRequestPermissionChange: boolean;
  canRequestPositionChange: boolean;
  canRequestRemoval: boolean;
  canAppointSelfRepresentative: boolean;
};
export type CompanyTeamMember = {
  membershipId: number;
  displayName: string | null;
  contactEmail: string;
  profileImageUrl: string | null;
  positionId: number;
  positionName: string;
  positionType: "CUSTOM" | "REPRESENTATIVE";
  role: TeamRole;
  permissions: string[];
  joinedAt: string;
  lastLoginAt: string | null;
  version: number;
  capabilities: TeamMemberCapabilities;
};
export type CompanyTeamPage = {
  content: CompanyTeamMember[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  capabilities: TeamCapabilities;
};
export interface CompanyTeamRepository {
  getCompanyTeamContext(access: AuthAccess, signal?: AbortSignal): Promise<{ companyId: number | null }>;
  getCompanyPermissionCatalog(access: AuthAccess, signal?: AbortSignal): Promise<CompanyPermissionCatalog>;
  getCurrentCompanyPermissions(access: AuthAccess, companyId: number, signal?: AbortSignal): Promise<CurrentCompanyPermissions>;
  listCompanyTeamMembers(access: AuthAccess, companyId: number, page?: number, size?: number, signal?: AbortSignal): Promise<CompanyTeamPage>;
  getCompanyTeamMember(access: AuthAccess, companyId: number, membershipId: number, signal?: AbortSignal): Promise<CompanyTeamMember>;
}

import type { AuthAccess } from "../shared/http";
import type { TeamRole } from "./team-contracts";

export type TeamPosition = { id: number; version: number; name: string; type: "CUSTOM" | "REPRESENTATIVE" };
export type TeamPositionDeletion = { positionId: number; version: number; deletedAt: string };
export type TeamMutation = {
  membershipId: number; companyId: number; positionId: number; positionName: string; positionType: TeamPosition["type"];
  permissions: string[]; role: TeamRole; status: "ACTIVE" | "LEFT" | "REMOVED"; version: number;
  joinedAt: string; endedAt: string | null; updatedAt: string; sessionWarning?: string;
};
export type TeamChangeKind = "POSITION" | "PERMISSIONS" | "POSITION_AND_PERMISSIONS" | "REMOVE";
export type TeamChangeStatus = "PENDING" | "APPLIED" | "REJECTED" | "CANCELED" | "INVALIDATED";
export type TeamChangeRequest = {
  changeRequestId: number; companyId: number; targetMembershipId: number; kind: TeamChangeKind; status: TeamChangeStatus;
  requestVersion: number; expectedMembershipVersion: number; issuerName: string | null;
  beforePosition: TeamPosition; beforePermissionCodes: string[]; proposedPosition: TeamPosition | null;
  proposedPermissionCodes: string[] | null; proposedMembershipStatus: "ACTIVE" | "REMOVED";
  createdAt: string; processedAt: string | null; invalidationReason: string | null; appliedMembershipVersion: number | null;
  capabilities: { canAccept: boolean; canReject: boolean; canCancel: boolean; blockingReason: string | null };
  sessionWarning?: string;
};
export type TeamChangePage = { content: TeamChangeRequest[]; page: number; size: number; totalElements: number; totalPages: number };
export type TeamChangeQuery = { scope: "mine" | "company"; companyId?: number; membershipId?: number; status?: TeamChangeStatus; page?: number; size?: number };
export type TeamChangeProposal = { requestKey: string; expectedMembershipVersion: number } & (
  { kind: "POSITION"; positionId: number } | { kind: "PERMISSIONS"; permissionCodes: string[] } |
  { kind: "POSITION_AND_PERMISSIONS"; positionId: number; permissionCodes: string[] } | { kind: "REMOVE" }
);
export type TeamChangeCreated = { outcome: "CREATED" | "REUSED"; request: TeamChangeRequest; membership: null } |
  { outcome: "NO_CHANGE"; request: null; membership: TeamMutation };
export type TeamDecision = { requestKey: string; expectedRequestVersion: number; decision: "ACCEPT" | "REJECT" };
export type TeamCancellation = { requestKey: string; expectedRequestVersion: number };
export interface CompanyTeamManagementRepository {
  getCompanyTeamPositions(access: AuthAccess, companyId: number, signal?: AbortSignal): Promise<TeamPosition[]>;
  createCompanyTeamPosition(access: AuthAccess, companyId: number, name: string, signal?: AbortSignal): Promise<TeamPosition>;
  renameCompanyTeamPosition(access: AuthAccess, companyId: number, positionId: number, name: string, expectedVersion: number, signal?: AbortSignal): Promise<TeamPosition>;
  deleteCompanyTeamPosition(access: AuthAccess, companyId: number, positionId: number, expectedVersion: number, signal?: AbortSignal): Promise<TeamPositionDeletion>;
  changeTeamMemberPosition(access: AuthAccess, membershipId: number, body: { expectedVersion: number; positionId: number }, signal?: AbortSignal): Promise<TeamMutation>;
  changeTeamMemberPermissions(access: AuthAccess, membershipId: number, body: { expectedVersion: number; permissionCodes: string[] }, signal?: AbortSignal): Promise<TeamMutation>;
  demoteMyTeamMembership(access: AuthAccess, membershipId: number, body: { expectedVersion: number; permissionCodes: string[]; positionId: number | null }, signal?: AbortSignal): Promise<TeamMutation>;
  leaveMyTeamMembership(access: AuthAccess, membershipId: number, expectedVersion: number, signal?: AbortSignal): Promise<TeamMutation>;
  removeCompanyTeamMember(access: AuthAccess, membershipId: number, expectedVersion: number, signal?: AbortSignal): Promise<TeamMutation>;
  createTeamChangeRequest(access: AuthAccess, membershipId: number, body: TeamChangeProposal, signal?: AbortSignal): Promise<TeamChangeCreated>;
  listTeamChangeRequests(access: AuthAccess, query: TeamChangeQuery, signal?: AbortSignal): Promise<TeamChangePage>;
  getTeamChangeRequest(access: AuthAccess, changeRequestId: number, signal?: AbortSignal): Promise<TeamChangeRequest>;
  decideTeamChangeRequest(access: AuthAccess, changeRequestId: number, body: TeamDecision, signal?: AbortSignal): Promise<TeamChangeRequest>;
  cancelTeamChangeRequest(access: AuthAccess, changeRequestId: number, body: TeamCancellation, signal?: AbortSignal): Promise<TeamChangeRequest>;
}

import type { AuthAccess } from "../shared/http";
import type { TeamRole } from "./team-contracts";

export type TeamMembershipReviewCapabilities = { canReview: boolean; canEditPosition: boolean; canManagePermissions: boolean; canApproveRepresentative: boolean };
export type TeamMembershipRequest = {
  requestId: number;
  companyId: number;
  accountName: string | null;
  googleVerifiedEmail: string | null;
  requestedRepresentative: boolean;
  requestedPositionId: number | null;
  requestedPositionName: string | null;
  proposedPositionName: string | null;
  message: string | null;
  status: "PENDING" | "CANCELED" | "APPROVED" | "REJECTED";
  version: number;
  rejectionReason: string | null;
  appliedRepresentative: boolean | null;
  appliedPositionId: number | null;
  appliedPositionName: string | null;
  appliedMembershipId: number | null;
  appliedRole: TeamRole | null;
  appliedPermissions: string[];
  capabilities: TeamMembershipReviewCapabilities;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};
export type TeamMembershipRequestPage = {
  content: TeamMembershipRequest[];
  capabilities: TeamMembershipReviewCapabilities;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};
export type TeamMembershipApproval = {
  expectedVersion: number;
  representative: boolean;
  positionId: number | null;
  positionName: string | null;
  preset: TeamRole | null;
  extraPermissionCodes: string[];
};
export interface CompanyTeamMembershipRequestRepository {
  listTeamMembershipRequests(access: AuthAccess, companyId: number, page?: number, size?: number, signal?: AbortSignal): Promise<TeamMembershipRequestPage>;
  getTeamMembershipRequest(access: AuthAccess, companyId: number, requestId: number, signal?: AbortSignal): Promise<TeamMembershipRequest>;
  approveTeamMembershipRequest(access: AuthAccess, companyId: number, requestId: number, input: TeamMembershipApproval, signal?: AbortSignal): Promise<TeamMembershipRequest>;
  rejectTeamMembershipRequest(access: AuthAccess, companyId: number, requestId: number, expectedVersion: number, reason: string, signal?: AbortSignal): Promise<TeamMembershipRequest>;
}

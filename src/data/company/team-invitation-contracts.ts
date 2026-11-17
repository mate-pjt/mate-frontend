import type { AuthAccess } from "../shared/http";
import type { TeamRole } from "./team-contracts";

export type TeamInvitationStatus = "PENDING" | "CANCELED" | "EXPIRED" | "DECLINED" | "ACCEPTED";
export type TeamInvitationDeliveryStatus = "PENDING" | "SENDING" | "SENT" | "FAILED" | "SUPERSEDED";
export type TeamInvitationInput = {
  email: string;
  inviteeDisplayName: string;
  representative: boolean;
  positionId: number | null;
  proposedPositionName: string | null;
  preset: TeamRole | null;
  extraPermissionCodes: string[];
  message: string | null;
};
export type TeamInvitation = {
  invitationId: number;
  companyId: number;
  invitedEmail: string;
  inviteeDisplayName: string;
  registeredAccount: boolean;
  representative: boolean;
  position: { positionId: number | null; name: string } | null;
  role: TeamRole;
  permissions: string[];
  message: string | null;
  status: TeamInvitationStatus;
  version: number;
  expiresAt: string;
  delivery: { version: number; status: TeamInvitationDeliveryStatus };
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};
export type TeamInvitationCapabilities = { canInvite: boolean; canEditPosition: boolean; canManagePermissions: boolean; canInviteRepresentative: boolean };
export type TeamInvitationPage = {
  content: TeamInvitation[];
  capabilities: TeamInvitationCapabilities;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};
export interface CompanyTeamInvitationRepository {
  listTeamInvitations(access: AuthAccess, companyId: number, page?: number, size?: number, signal?: AbortSignal): Promise<TeamInvitationPage>;
  getTeamInvitation(access: AuthAccess, companyId: number, invitationId: number, signal?: AbortSignal): Promise<TeamInvitation>;
  createTeamInvitation(access: AuthAccess, companyId: number, input: TeamInvitationInput, signal?: AbortSignal): Promise<TeamInvitation>;
}

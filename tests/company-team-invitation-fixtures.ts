import type { TeamInvitation, TeamInvitationInput } from "@/data/company/contracts";

export const invitationInput = (): TeamInvitationInput => ({ email: "invited@example.test", inviteeDisplayName: "가상 초대 팀원", representative: false,
  positionId: 2, proposedPositionName: null, preset: "VIEWER", extraPermissionCodes: [], message: null });
export const invitationFixture = (): TeamInvitation => ({ invitationId: 8201, companyId: 7001, invitedEmail: "invited@example.test", inviteeDisplayName: "가상 초대 팀원",
  registeredAccount: false, representative: false, position: { positionId: 2, name: "사원" }, role: "VIEWER", permissions: ["COMPANY_INFORMATION_VIEW", "COMPANY_MEMBER_LIST_VIEW"],
  message: null, status: "PENDING", version: 1, expiresAt: "2030-06-08T01:00:00Z", delivery: { version: 1, status: "PENDING" },
  createdAt: "2030-06-01T01:00:00Z", updatedAt: "2030-06-01T01:00:00Z", completedAt: null });
export const invitationPage = (content = [invitationFixture()]) => ({ content, page: 0, size: 20, totalElements: content.length, totalPages: Math.ceil(content.length / 20),
  capabilities: { canInvite: true, canEditPosition: true, canManagePermissions: true, canInviteRepresentative: false } });

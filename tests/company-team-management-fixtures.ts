import type { TeamChangeRequest, TeamMutation } from "@/data/company/contracts";

export const viewerPermissions = ["COMPANY_INFORMATION_VIEW", "COMPANY_MEMBER_LIST_VIEW"];
export const key = "67e73b88-5f04-46b5-91c1-574c824f8d00";
export const nextKey = "67e73b88-5f04-46b5-91c1-574c824f8d01";
export const mutationFixture = (): TeamMutation => ({ membershipId: 9102, companyId: 7001, positionId: 3, positionName: "담당자", positionType: "CUSTOM", permissions: [...viewerPermissions], role: "VIEWER", status: "ACTIVE", version: 2, joinedAt: "2024-01-01T00:00:00Z", endedAt: null, updatedAt: "2030-06-01T01:00:00Z" });
export const changeFixture = (): TeamChangeRequest => ({ changeRequestId: 5101, companyId: 7001, targetMembershipId: 9104, kind: "PERMISSIONS", status: "PENDING", requestVersion: 1, expectedMembershipVersion: 1,
  issuerName: "가상 담당자", beforePosition: { id: 2, version: 1, type: "CUSTOM", name: "사원" }, beforePermissionCodes: [...viewerPermissions], proposedPosition: { id: 2, version: 1, type: "CUSTOM", name: "사원" }, proposedPermissionCodes: [...viewerPermissions, "COMPANY_MEMBER_INVITE"], proposedMembershipStatus: "ACTIVE", createdAt: "2030-06-01T01:00:00Z", processedAt: null, invalidationReason: null, appliedMembershipVersion: null,
  capabilities: { canAccept: false, canReject: false, canCancel: true, blockingReason: null } });
export function endedChange(status: "APPLIED" | "REJECTED" | "CANCELED"): TeamChangeRequest {
  return { ...changeFixture(), status, requestVersion: 2, processedAt: "2030-06-01T01:00:01Z", appliedMembershipVersion: status === "APPLIED" ? 2 : null, capabilities: { canAccept: false, canReject: false, canCancel: false, blockingReason: null } };
}

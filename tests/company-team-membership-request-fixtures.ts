import { teamCatalogFixture } from "@/data/company/team-mock";
import type { TeamMembershipRequest, TeamMembershipApproval } from "@/data/company/contracts";

export const reviewCatalog = teamCatalogFixture();
export const reviewViewer = reviewCatalog.presets.find(p => p.role === "VIEWER")!.permissionCodes;
export const reviewAdmin = reviewCatalog.presets.find(p => p.role === "ADMIN")!.permissionCodes;
export const reviewCapabilities = () => ({ canReview: true, canEditPosition: true, canManagePermissions: true, canApproveRepresentative: true });
export const reviewApproval = (): TeamMembershipApproval => ({ expectedVersion: 1, representative: false, positionId: 2, positionName: null, preset: "VIEWER", extraPermissionCodes: [] });
export const membershipReview = (): TeamMembershipRequest => ({ requestId: 8401, companyId: 7001, accountName: "가상 신청자", googleVerifiedEmail: "applicant@example.test",
  requestedRepresentative: false, requestedPositionId: 2, requestedPositionName: "사원", proposedPositionName: null, message: null, status: "PENDING", version: 1, rejectionReason: null,
  appliedRepresentative: null, appliedPositionId: null, appliedPositionName: null, appliedMembershipId: null, appliedRole: null, appliedPermissions: [], capabilities: reviewCapabilities(),
  createdAt: "2030-05-01T01:00:00Z", updatedAt: "2030-05-01T01:00:00Z", completedAt: null });
export const approvedReview = (): TeamMembershipRequest => ({ ...membershipReview(), status: "APPROVED", version: 2, appliedRepresentative: false, appliedPositionId: 2, appliedPositionName: "사원",
  appliedMembershipId: 9201, appliedRole: "VIEWER", appliedPermissions: [...reviewViewer], updatedAt: "2030-06-01T01:00:00Z", completedAt: "2030-06-01T01:00:00Z" });
export const rejectedReview = (reason = "가상 거절 사유"): TeamMembershipRequest => ({ ...membershipReview(), status: "REJECTED", version: 2, rejectionReason: reason, updatedAt: "2030-06-01T01:00:00Z", completedAt: "2030-06-01T01:00:00Z" });
export const membershipReviewPage = (content = [membershipReview()]) => ({ content, capabilities: reviewCapabilities(), page: 0, size: 20, totalElements: content.length, totalPages: Math.ceil(content.length / 20) });

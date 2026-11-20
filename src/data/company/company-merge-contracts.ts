import type { AuthAccess } from "../shared/http";

export type CompanyMergeAction =
  | { kind: "request" | "propose"; message: string | null }
  | { kind: "accept" }
  | { kind: "decline"; reason: string };

export type CompanyMergeStatus = "REVIEW_PENDING" | "REJECTED" | "APPEAL_SUBMITTED" | "FINALIZED"
  | "CLEANUP_PENDING" | "CLEANUP_COMPLETED" | "VERIFICATION_CANCELLED";

export type CompanyMergeOpening = "SOURCE_REQUEST" | "SOURCE_ACCEPTED" | "TARGET_PROPOSAL_TIMEOUT"
  | "IN_PLACE_REGISTRATION" | "ADMIN_REVIEW_REQUIRED";

export type CompanyMergeCase = {
  caseId: number;
  type: "CROSS_COMPANY" | "IN_PLACE_MEMBER_REVIEW";
  status: CompanyMergeStatus;
  source: { id: number; name: string };
  verified: { id: number; name: string };
  revision: number;
  reviewRequested: boolean;
  requestMessage: string | null;
  proposal: { message: string | null; proposedAt: string; responseDueAt: string } | null;
  proposalResponse: { decision: "ACCEPT" | "DECLINE"; respondedAt: string; reason: string | null } | null;
  reviewOpening: { origin: CompanyMergeOpening; openedAt: string } | null;
  decisionDueAt: string | null;
  rejectionOrigin: "SOURCE_PROPOSAL_DECLINED" | "TARGET_REVIEW_REJECTED" | null;
  finalizedAt: string | null;
  actions: { canRequest: boolean | null; canPropose: boolean | null; canRespondToProposal: boolean | null };
};

export interface CompanyMergeRepository {
  getCurrentCompanyMergeCase(access: AuthAccess, companyId: number, signal?: AbortSignal): Promise<CompanyMergeCase | null>;
  getCompanyMergeCase(access: AuthAccess, companyId: number, caseId: number, signal?: AbortSignal): Promise<CompanyMergeCase>;
  submitCompanyMerge(access: AuthAccess, companyId: number, caseId: number, expectedRevision: number, action: CompanyMergeAction, signal?: AbortSignal): Promise<CompanyMergeCase>;
}

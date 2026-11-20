import { ApiError } from "../shared/errors";
import type { HttpClient } from "../shared/http";
import type { CompanyMergeCase, CompanyMergeRepository, CompanyMergeStatus } from "./company-merge-contracts";
import { isMergeId, normalizeCompanyMergeAction, requireMergeIds } from "./company-merge-input";
import { timestamp } from "./team-api";

function invalid(): never {
  throw new ApiError(0, "MERGE_RESPONSE_INVALID", "통합 요청의 상태를 확인하지 못했어요. 다시 조회해 주세요.");
}

function object(value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) invalid();
  return value as Record<string, unknown>;
}

function parseEnum<const T extends string>(value: unknown, options: readonly T[]): T {
  const match = options.find(option => option === value);
  if (match === undefined) invalid();
  return match;
}

function time(value: unknown) {
  if (!timestamp(value)) invalid();
  return value;
}

function optionalText(value: unknown, limit: number) {
  if (value == null) return null;
  if (typeof value !== "string" || value.length > limit) invalid();
  return value;
}

function capability(value: unknown) {
  if (value == null) return null;
  if (typeof value !== "boolean") invalid();
  return value;
}

function readProposal(value: unknown): CompanyMergeCase["proposal"] {
  if (value == null) return null;
  const proposal = object(value);
  const proposedAt = time(proposal.proposedAt);
  const responseDueAt = time(proposal.responseDueAt);
  if (Date.parse(responseDueAt) <= Date.parse(proposedAt)) invalid();
  return { message: optionalText(proposal.message, 1000), proposedAt, responseDueAt };
}

function readProposalResponse(value: unknown): CompanyMergeCase["proposalResponse"] {
  if (value == null) return null;
  const response = object(value);
  const decision = parseEnum(response.decision, ["ACCEPT", "DECLINE"]);
  const reason = optionalText(response.reason, 500);
  if (decision === "DECLINE" ? !reason : reason !== null) invalid();
  return { decision, respondedAt: time(response.respondedAt), reason };
}

function readOpening(value: unknown): CompanyMergeCase["reviewOpening"] {
  if (value == null) return null;
  const opening = object(value);
  const origin = parseEnum(opening.origin, ["SOURCE_REQUEST", "SOURCE_ACCEPTED", "TARGET_PROPOSAL_TIMEOUT", "IN_PLACE_REGISTRATION", "ADMIN_REVIEW_REQUIRED"]);
  return { openedAt: time(opening.openedAt), origin };
}

export function mapCompanyMergeCase(raw: unknown, companyId: number, caseId?: number): CompanyMergeCase {
  const value = object(raw);
  const { sourceCompanyId, verifiedCompanyId, sourceCompanyName, verifiedCompanyName, revision, reviewRequested } = value;
  const type = parseEnum(value.type, ["CROSS_COMPANY", "IN_PLACE_MEMBER_REVIEW"]);
  const status: CompanyMergeStatus = parseEnum(value.status, ["REVIEW_PENDING", "REJECTED", "APPEAL_SUBMITTED", "FINALIZED", "CLEANUP_PENDING", "CLEANUP_COMPLETED", "VERIFICATION_CANCELLED"]);
  if (!isMergeId(value.caseId) || (caseId !== undefined && caseId !== value.caseId) || !isMergeId(revision)
    || !isMergeId(sourceCompanyId) || !isMergeId(verifiedCompanyId)
    || (companyId !== sourceCompanyId && companyId !== verifiedCompanyId)
    || (sourceCompanyId === verifiedCompanyId) !== (type === "IN_PLACE_MEMBER_REVIEW")
    || typeof sourceCompanyName !== "string" || !sourceCompanyName.trim() || typeof verifiedCompanyName !== "string" || !verifiedCompanyName.trim()
    || typeof reviewRequested !== "boolean") invalid();

  const actions = object(value.actions);
  const proposal = readProposal(value.proposal);
  const proposalResponse = readProposalResponse(value.proposalResponse);
  const finalizedAt = value.finalizedAt == null ? null : time(value.finalizedAt);
  if ((proposalResponse && !proposal) || (status === "FINALIZED" && !finalizedAt)) invalid();
  return {
    caseId: value.caseId, type, status, revision, reviewRequested,
    source: { id: sourceCompanyId, name: sourceCompanyName }, verified: { id: verifiedCompanyId, name: verifiedCompanyName },
    requestMessage: optionalText(value.requestMessage, 1000), proposal, proposalResponse,
    decisionDueAt: value.decisionDueAt == null ? null : time(value.decisionDueAt), finalizedAt,
    reviewOpening: readOpening(value.reviewOpening),
    rejectionOrigin: value.rejectionOrigin == null ? null : parseEnum(value.rejectionOrigin, ["SOURCE_PROPOSAL_DECLINED", "TARGET_REVIEW_REJECTED"]),
    actions: { canRequest: capability(actions.canRequest), canPropose: capability(actions.canPropose), canRespondToProposal: capability(actions.canRespondToProposal) },
  };
}

export function createCompanyMergeApi(http: HttpClient): CompanyMergeRepository {
  const path = (companyId: number) => `/api/v1/companies/${companyId}/merge-cases`;
  return {
    async getCurrentCompanyMergeCase(access, companyId, signal) {
      requireMergeIds(companyId);
      const value = await http.authorized<unknown>(access, `${path(companyId)}/current`, { signal, allowNoContent: true });
      return value === null ? null : mapCompanyMergeCase(value, companyId);
    },
    async getCompanyMergeCase(access, companyId, caseId, signal) {
      requireMergeIds(companyId, caseId);
      return mapCompanyMergeCase(await http.authorized(access, `${path(companyId)}/${caseId}`, { signal }), companyId, caseId);
    },
    async submitCompanyMerge(access, companyId, caseId, expectedRevision, raw, signal) {
      requireMergeIds(companyId, caseId, expectedRevision);
      const action = normalizeCompanyMergeAction(raw);
      const base = `${path(companyId)}/${caseId}`;
      if (action.kind === "request" || action.kind === "propose") {
        return mapCompanyMergeCase(await http.authorized(access, `${base}/${action.kind === "request" ? "request" : "proposals"}`, {
          method: "POST", body: { expectedRevision, message: action.message }, signal, retryUnauthorized: false,
        }), companyId, caseId);
      }
      return mapCompanyMergeCase(await http.authorized(access, `${base}/proposal-responses`, {
        method: "POST", body: { expectedRevision, decision: action.kind === "accept" ? "ACCEPT" : "DECLINE", reason: action.kind === "decline" ? action.reason : null },
        signal, retryUnauthorized: false,
      }), companyId, caseId);
    },
  };
}

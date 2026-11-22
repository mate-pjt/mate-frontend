import { ApiError } from "../shared/errors";
import type { CompanyMergeAction, CompanyMergeCase } from "./company-merge-contracts";

export function isMergeId(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

export function requireMergeIds(...values: number[]) {
  if (!values.every(isMergeId)) throw new ApiError(400, "MERGE_INPUT_INVALID", "회사와 통합 요청 정보를 다시 확인해 주세요.");
}

export function normalizeCompanyMergeAction(action: CompanyMergeAction): CompanyMergeAction {
  if ("roundId" in action && action.roundId !== undefined) requireMergeIds(action.roundId);
  if (action.kind === "withdraw-request" || action.kind === "withdraw-proposal") {
    requireMergeIds(action.roundId);
    return { kind: action.kind, roundId: action.roundId };
  }
  if (action.kind === "resend-request" || action.kind === "resend-proposal") {
    requireMergeIds(action.roundId);
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(action.commandId)) {
      throw new ApiError(400, "MERGE_INPUT_INVALID", "재발송 요청 정보를 다시 확인해 주세요.");
    }
  }
  if (action.kind === "accept") return { ...action };
  const decline = action.kind === "decline";
  const value = decline ? action.reason : action.message;
  // Match Kotlin trim and isISOControl, including legacy U+FEFF handling.
  const text = typeof value === "string" ? value.replace(/^[\p{Z}\u0009-\u000d\u001c-\u001f]+|[\p{Z}\u0009-\u000d\u001c-\u001f]+$/gu, "") : "";
  const limit = decline ? 500 : 1000;
  if ((value !== null && typeof value !== "string") || (value?.length ?? 0) > limit
    || (decline && !text) || /[\u0000-\u001f\u007f-\u009f]/.test(text)) {
    throw new ApiError(400, "MERGE_INPUT_INVALID", decline ? "거절 사유를 줄바꿈 없이 1~500자로 입력해 주세요." : "전달 메시지는 줄바꿈 없이 1,000자까지 입력할 수 있어요.");
  }
  return decline ? { ...action, reason: text } : { ...action, message: text || null };
}

export function canSubmitCompanyMerge(value: CompanyMergeCase, companyId: number, permissions: readonly string[], kind: CompanyMergeAction["kind"]): boolean {
  if (value.type !== "CROSS_COMPANY" || value.status !== "REVIEW_PENDING") return false;
  if (kind === "withdraw-request" || kind === "resend-request") {
    return companyId === value.source.id && permissions.includes("COMPANY_MERGE_REQUEST")
      && !!value.requestRound && (kind === "withdraw-request"
        ? value.requestRound.status === "ACTIVE" && value.actions.canWithdrawRequest === true
        : value.requestRound.status === "WITHDRAWN" && value.actions.canResendRequest === true);
  }
  if (kind === "withdraw-proposal" || kind === "resend-proposal") {
    return companyId === value.verified.id && permissions.includes("COMPANY_MERGE_REVIEW")
      && !!value.proposalRound && (kind === "withdraw-proposal"
        ? value.proposalRound.status === "ACTIVE" && value.actions.canWithdrawProposal === true
        : value.proposalRound.status === "WITHDRAWN" && value.actions.canResendProposal === true);
  }
  if (value.reviewOpening || value.reviewRequested) return false;
  if (kind === "propose") {
    return companyId === value.verified.id && permissions.includes("COMPANY_MERGE_REVIEW") && value.actions.canPropose === true && value.proposal === null;
  }
  if (companyId !== value.source.id || !permissions.includes("COMPANY_MERGE_REQUEST") || value.proposalResponse) return false;
  return kind === "request" ? value.actions.canRequest === true : value.actions.canRespondToProposal === true && value.proposal !== null && (!value.proposalRound || value.proposalRound.status === "ACTIVE");
}

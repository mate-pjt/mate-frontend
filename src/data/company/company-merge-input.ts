import { ApiError } from "../shared/errors";
import type { CompanyMergeAction, CompanyMergeCase } from "./company-merge-contracts";

export function isMergeId(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

export function requireMergeIds(...values: number[]) {
  if (!values.every(isMergeId)) throw new ApiError(400, "MERGE_INPUT_INVALID", "회사와 통합 요청 정보를 다시 확인해 주세요.");
}

export function normalizeCompanyMergeAction(action: CompanyMergeAction): CompanyMergeAction {
  if (action.kind === "accept") return { kind: "accept" };
  const decline = action.kind === "decline";
  const value = decline ? action.reason : action.message;
  // Match Kotlin trim and isISOControl, including legacy U+FEFF handling.
  const text = typeof value === "string" ? value.replace(/^[\p{Z}\u0009-\u000d\u001c-\u001f]+|[\p{Z}\u0009-\u000d\u001c-\u001f]+$/gu, "") : "";
  const limit = decline ? 500 : 1000;
  if ((value !== null && typeof value !== "string") || (value?.length ?? 0) > limit
    || (decline && !text) || /[\u0000-\u001f\u007f-\u009f]/.test(text)) {
    throw new ApiError(400, "MERGE_INPUT_INVALID", decline ? "거절 사유를 줄바꿈 없이 1~500자로 입력해 주세요." : "전달 메시지는 줄바꿈 없이 1,000자까지 입력할 수 있어요.");
  }
  return decline ? { kind: "decline", reason: text } : { kind: action.kind, message: text || null };
}

export function canSubmitCompanyMerge(value: CompanyMergeCase, companyId: number, permissions: readonly string[], kind: CompanyMergeAction["kind"]): boolean {
  if (value.type !== "CROSS_COMPANY" || value.status !== "REVIEW_PENDING" || value.reviewOpening || value.reviewRequested) return false;
  if (kind === "propose") {
    return companyId === value.verified.id && permissions.includes("COMPANY_MERGE_REVIEW") && value.actions.canPropose === true && value.proposal === null;
  }
  if (companyId !== value.source.id || !permissions.includes("COMPANY_MERGE_REQUEST") || value.proposalResponse) return false;
  return kind === "request" ? value.actions.canRequest === true : value.actions.canRespondToProposal === true && value.proposal !== null;
}

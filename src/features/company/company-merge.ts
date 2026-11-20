import * as company from "@/data/company/client";
import { canSubmitCompanyMerge, normalizeCompanyMergeAction } from "@/data/company/contracts";
import type { CompanyMergeAction, CompanyMergeCase, CompanyMergeRepository, CompanyTeamRepository, CurrentCompanyPermissions } from "@/data/company/contracts";
import { ApiError } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";

type Repository = CompanyMergeRepository & Pick<CompanyTeamRepository, "getCompanyTeamContext" | "getCurrentCompanyPermissions">;
export type CompanyMergeSnapshot = { status: "case"; value: CompanyMergeCase; actor: CurrentCompanyPermissions };
export type CompanyMergeView = CompanyMergeSnapshot | { status: "no-company" | "empty" | "unavailable" };
export type CompanyMergeReference = { caseId: number; companyId: number; membershipId: number; sourceId: number; verifiedId: number; revision: number };

export function companyMergeReference({ value, actor }: CompanyMergeSnapshot): CompanyMergeReference {
  return { caseId: value.caseId, companyId: actor.companyId, membershipId: actor.membershipId, sourceId: value.source.id, verifiedId: value.verified.id, revision: value.revision };
}

export class CompanyMergeUnconfirmed extends Error {
  constructor() { super("통합 요청의 처리 결과를 확인하지 못했어요."); }
}

function changed(): never {
  throw new ApiError(409, "MERGE_CONTEXT_CHANGED", "회사나 통합 요청의 최신 상태를 확인해 주세요.");
}

function scopedAccess(access: AuthAccess, signal: AbortSignal, isCurrent: () => boolean) {
  const account = access.getAccountKey();
  return { ...access, assertRequestScope() {
    signal.throwIfAborted();
    if (!account || account !== access.getAccountKey() || !isCurrent()) throw new DOMException("aborted", "AbortError");
    access.assertRequestScope?.();
  } };
}

function matches(value: CompanyMergeCase, reference: CompanyMergeReference) {
  return value.caseId === reference.caseId && value.source.id === reference.sourceId && value.verified.id === reference.verifiedId;
}

async function readActor(repository: Repository, access: ReturnType<typeof scopedAccess>, signal: AbortSignal) {
  access.assertRequestScope();
  const { companyId } = await repository.getCompanyTeamContext(access, signal);
  access.assertRequestScope();
  if (companyId === null) return null;
  const actor = await repository.getCurrentCompanyPermissions(access, companyId, signal);
  access.assertRequestScope();
  if (actor.companyId !== companyId) changed();
  return actor;
}

export async function loadCompanyMerge(access: AuthAccess, signal: AbortSignal, isCurrent: () => boolean,
  reference?: CompanyMergeReference, repository: Repository = company): Promise<CompanyMergeView> {
  const scoped = scopedAccess(access, signal, isCurrent);
  const actor = await readActor(repository, scoped, signal);
  if (!actor) return { status: "no-company" };
  if (reference && (actor.companyId !== reference.companyId || actor.membershipId !== reference.membershipId)) changed();
  const value = reference ? await repository.getCompanyMergeCase(scoped, actor.companyId, reference.caseId, signal)
    : await repository.getCurrentCompanyMergeCase(scoped, actor.companyId, signal);
  const latest = await readActor(repository, scoped, signal);
  if (!latest || latest.companyId !== actor.companyId || latest.membershipId !== actor.membershipId) changed();

  const canReview = latest.permissionCodes.includes("COMPANY_MERGE_REVIEW");
  const couldReview = actor.permissionCodes.includes("COMPANY_MERGE_REVIEW");
  if (!value) return { status: canReview && couldReview ? "empty" : "unavailable" };
  if (value.verified.id === latest.companyId) {
    // An in-place case can also be read through the server's source-member view.
    if (value.type === "CROSS_COMPANY" && (!canReview || !couldReview)) {
      throw new ApiError(403, "MERGE_READ_FORBIDDEN", "현재 회사의 통합 검토 권한을 확인해 주세요.");
    }
    if (canReview !== couldReview) changed();
  }
  if (reference && (!matches(value, reference) || value.revision < reference.revision)) changed();
  return { status: "case", value, actor: latest };
}

function matchesReceipt(value: CompanyMergeCase, action: CompanyMergeAction): boolean {
  switch (action.kind) {
    case "request": return value.reviewRequested && value.reviewOpening !== null && value.requestMessage === action.message;
    case "propose": return value.proposal !== null && value.proposal.message === action.message;
    case "accept": return value.proposalResponse?.decision === "ACCEPT" && value.reviewOpening !== null;
    case "decline": return value.proposalResponse?.decision === "DECLINE" && value.proposalResponse.reason === action.reason;
  }
}

export async function submitCurrentCompanyMerge(access: AuthAccess, signal: AbortSignal, isCurrent: () => boolean,
  reference: CompanyMergeReference, input: CompanyMergeAction, repository: Repository = company): Promise<CompanyMergeSnapshot> {
  const action = normalizeCompanyMergeAction(input);
  const scoped = scopedAccess(access, signal, isCurrent);
  const latest = await loadCompanyMerge(scoped, signal, isCurrent, undefined, repository);
  if (latest.status !== "case" || !matches(latest.value, reference) || latest.value.revision !== reference.revision
    || latest.actor.companyId !== reference.companyId || latest.actor.membershipId !== reference.membershipId) changed();
  if (!canSubmitCompanyMerge(latest.value, latest.actor.companyId, latest.actor.permissionCodes, action.kind)) {
    throw new ApiError(403, "MERGE_ACTION_UNAVAILABLE", "현재 상태나 권한으로 통합 요청을 처리할 수 없어요.");
  }
  try {
    const value = await repository.submitCompanyMerge(scoped, reference.companyId, reference.caseId, reference.revision, action, signal);
    scoped.assertRequestScope();
    if (!matches(value, reference) || value.revision <= reference.revision || !matchesReceipt(value, action)) throw new CompanyMergeUnconfirmed();
    return { status: "case", value, actor: latest.actor };
  } catch (error) {
    if (error instanceof ApiError && (error.status === 0 || error.status === 404 || error.status === 408 || error.status >= 500 || (error.status >= 200 && error.status < 300))) {
      throw new CompanyMergeUnconfirmed();
    }
    throw error;
  }
}

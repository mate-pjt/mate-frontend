import { getCompanyTeamContext, getCurrentCompanyPermissions } from "@/data/company/client";
import type { CompanyOnboardingRepository, CompanyTeamRepository } from "@/data/company/contracts";
import { ApiError } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";

type InvitationAcceptance = Awaited<ReturnType<CompanyOnboardingRepository["acceptInvitation"]>>;
export type InvitationReceipt = Pick<InvitationAcceptance, "companyId" | "membershipId">;
export type InvitationDestination = "/my/team" | "/my/company";
export type InvitationCompletion = { kind: "accepted"; receipt: InvitationReceipt; sessionWarning?: string }
  | { kind: "uncertain"; companyId: number };

type InvitationQueries = Pick<CompanyTeamRepository, "getCompanyTeamContext" | "getCurrentCompanyPermissions">;
const queries: InvitationQueries = { getCompanyTeamContext, getCurrentCompanyPermissions };

export function isInvitationAcceptanceUnconfirmed(error: unknown): boolean {
  if (!(error instanceof ApiError)) return true;
  // An unusable link or handoff can also mean an earlier acceptance already consumed it.
  return error.code === "CI005" || error.code === "CI012"
    || error.status === 0 || error.status === 408 || error.status >= 500 || error.status >= 200 && error.status < 300;
}

export async function readInvitationCompany(
  access: AuthAccess, signal: AbortSignal, isCurrent: () => boolean, repository: InvitationQueries = queries,
): Promise<number | null> {
  function check() {
    signal.throwIfAborted();
    if (!isCurrent()) throw new DOMException("aborted", "AbortError");
  }
  check();
  if (!access.getAccountKey()) {
    await access.refresh({ preserveOnError: true });
    check();
    if (!access.getAccountKey()) return null;
  }
  const { companyId } = await repository.getCompanyTeamContext(access, signal);
  check();
  return access.getAccountKey() ? companyId : null;
}

export async function loadInvitationDestination(
  access: AuthAccess, receipt: InvitationReceipt, signal: AbortSignal, isCurrent: () => boolean,
  repository: InvitationQueries = queries, teamPath: "/my/team" | null = "/my/team",
): Promise<InvitationDestination | null> {
  const companyId = await readInvitationCompany(access, signal, isCurrent, repository);
  if (companyId === null || companyId !== receipt.companyId) return null;

  signal.throwIfAborted();
  if (!isCurrent()) throw new DOMException("aborted", "AbortError");
  const account = access.getAccountKey();
  if (!account) return null;
  const current = await repository.getCurrentCompanyPermissions(access, companyId, signal);
  signal.throwIfAborted();
  if (!isCurrent()) throw new DOMException("aborted", "AbortError");
  if (account !== access.getAccountKey() || current.companyId !== companyId || current.membershipId !== receipt.membershipId) return null;
  if (teamPath && current.permissionCodes.includes("COMPANY_MEMBER_LIST_VIEW")) return teamPath;
  return current.permissionCodes.includes("COMPANY_INFORMATION_VIEW") ? "/my/company" : null;
}

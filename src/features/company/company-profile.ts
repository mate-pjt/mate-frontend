import {
  getCompanyConstructionCapabilities,
  getCompanyPublicCertifications,
  getCurrentCompanyPermissions,
  type CompanyConstructionCapabilities,
  type CompanyProfileRepository,
  type CompanyPublicCertification,
  type CompanyTeamRepository,
} from "@/data/company/client";
import { ApiError } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";

type ProfileResult<T> = { status: "denied" | "error" } | { status: "ready"; value: T };
export type ProfileSection<T> = { status: "loading" } | ProfileResult<T>;
type AccessLoss = "unauthorized" | "denied";
type ProfileReads = CompanyProfileRepository & Pick<CompanyTeamRepository, "getCurrentCompanyPermissions">;
type ProfileRead = {
  access: AuthAccess;
  companyId: number;
  signal: AbortSignal;
  isCurrent: () => boolean;
  previousMembershipId?: number;
  onMembershipConfirmed?: (membershipId: number) => void;
  onAccessLost: (status: AccessLoss) => void;
  onCapabilities?: (result: ProfileResult<CompanyConstructionCapabilities>) => void;
  onCertifications?: (result: ProfileResult<CompanyPublicCertification[]>) => void;
};
const reads: ProfileReads = { getCompanyConstructionCapabilities, getCompanyPublicCertifications, getCurrentCompanyPermissions };

function accountAccessLost(error: unknown) {
  return error instanceof ApiError && (error.status === 401 || error.code === "AC002" || error.code === "AC003"
    || error.code === "AUTHENTICATION_ACCOUNT_NOT_ACTIVE");
}

export async function loadCompanyProfileSections(input: ProfileRead, repository: ProfileReads = reads): Promise<void> {
  const { access, companyId, signal, isCurrent, onAccessLost, onCapabilities, onCertifications } = input;
  let accessLost = false;
  const current = () => !accessLost && !signal.aborted && isCurrent();
  function check() {
    if (!current()) throw new DOMException("aborted", "AbortError");
    access.assertRequestScope?.();
  }
  const scopedAccess: AuthAccess = {
    ...access,
    getAccessToken: async () => { check(); return access.getAccessToken(); },
    refresh: async (options) => { check(); return access.refresh(options); },
    assertRequestScope: check,
  };
  function loseAccess(status: AccessLoss) {
    if (!current()) return;
    accessLost = true;
    onAccessLost(status);
  }
  function handleMembershipFailure(error: unknown): boolean {
    if (accountAccessLost(error)) loseAccess("unauthorized");
    else if (error instanceof ApiError && error.status === 403) loseAccess("denied");
    else return false;
    return true;
  }
  async function confirmMembership(expected?: number): Promise<number> {
    check();
    const membership = await repository.getCurrentCompanyPermissions(scopedAccess, companyId, signal);
    check();
    if (membership.companyId !== companyId || !membership.permissionCodes.includes("COMPANY_INFORMATION_VIEW")
      || (expected !== undefined && expected !== membership.membershipId)) {
      throw new ApiError(403, "COMPANY_PROFILE_SCOPE_CHANGED", "현재 회사와 조회 권한을 다시 확인해 주세요.");
    }
    return membership.membershipId;
  }

  let membershipId: number;
  try {
    membershipId = await confirmMembership(input.previousMembershipId);
  } catch (error) {
    if (current() && !handleMembershipFailure(error)) {
      onCapabilities?.({ status: "error" });
      onCertifications?.({ status: "error" });
    }
    return;
  }
  input.onMembershipConfirmed?.(membershipId);

  async function read<T>(query: (access: AuthAccess, companyId: number, signal: AbortSignal) => Promise<T>,
    publish: (result: ProfileResult<T>) => void) {
    let result: ProfileResult<T>;
    try {
      check();
      result = { status: "ready", value: await query(scopedAccess, companyId, signal) };
    } catch (error) {
      if (!current()) return;
      if (accountAccessLost(error)) return loseAccess("unauthorized");
      result = { status: error instanceof ApiError && error.status === 403 ? "denied" : "error" };
    }
    try {
      await confirmMembership(membershipId);
    } catch (error) {
      if (!current() || handleMembershipFailure(error)) return;
      result = { status: "error" };
    }
    if (current()) publish(result);
  }

  await Promise.all([
    onCapabilities && read(repository.getCompanyConstructionCapabilities, onCapabilities),
    onCertifications && read(repository.getCompanyPublicCertifications, onCertifications),
  ]);
}

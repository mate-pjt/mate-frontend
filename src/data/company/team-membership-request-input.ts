import { ApiError } from "../shared/errors";
import type { TeamMembershipApproval } from "./team-membership-request-contracts";

const controls = /[\u0000-\u001f\u007f-\u009f]/;
function invalid(message: string): never { throw new ApiError(400, "MEMBERSHIP_REVIEW_INPUT_INVALID", message); }
export function validateMembershipReviewVersion(version: number) {
  if (!Number.isSafeInteger(version) || version <= 0 || version === Number.MAX_SAFE_INTEGER) invalid("신청 버전을 다시 확인해 주세요.");
}
export function membershipRejectionReason(raw: string): string {
  if (typeof raw !== "string" || !raw.trim() || raw.trim().length > 300 || controls.test(raw.trim())) invalid("거절 사유는 제어 문자 없이 1~300자로 입력해 주세요.");
  return raw.trim();
}
export function normalizeMembershipApproval(input: TeamMembershipApproval): TeamMembershipApproval {
  if (!input || typeof input.representative !== "boolean") invalid("승인할 신청 정보를 확인해 주세요.");
  validateMembershipReviewVersion(input.expectedVersion);
  if (!(input.positionId === null || Number.isSafeInteger(input.positionId) && input.positionId > 0)
    || !(input.positionName === null || typeof input.positionName === "string" && !!input.positionName.trim() && input.positionName.trim().length <= 30 && !controls.test(input.positionName))
    || input.preset !== null && !["ADMIN", "AGENT", "VIEWER"].includes(input.preset)
    || !Array.isArray(input.extraPermissionCodes) || input.extraPermissionCodes.length > 15
    || input.extraPermissionCodes.some(code => typeof code !== "string" || !/^[A-Z][A-Z0-9_]*$/.test(code)) || new Set(input.extraPermissionCodes).size !== input.extraPermissionCodes.length) invalid("직급과 부여할 권한을 다시 확인해 주세요.");
  const positionName = input.positionName?.trim() ?? null;
  if (input.representative) {
    if (input.positionId !== null || positionName !== null || input.preset !== null || input.extraPermissionCodes.length) invalid("대표자 승인은 일반 직급·역할·추가 권한을 함께 지정할 수 없어요.");
  } else if ((input.positionId === null) === (positionName === null) || positionName === "대표자") invalid("기존 일반 직급 또는 새 직급명 중 하나를 선택해 주세요.");
  return { expectedVersion: input.expectedVersion, representative: input.representative, positionId: input.positionId, positionName, preset: input.preset, extraPermissionCodes: [...input.extraPermissionCodes] };
}

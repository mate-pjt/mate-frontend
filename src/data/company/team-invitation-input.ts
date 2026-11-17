import { ApiError } from "../shared/errors";
import type { TeamInvitationInput } from "./team-invitation-contracts";

const controls = /[\u0000-\u001f\u007f-\u009f]/;
export const teamInvitationEmail = (value: unknown): value is string => typeof value === "string" && value.length <= 254 && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
function invalid(message: string): never { throw new ApiError(400, "INVITATION_INPUT_INVALID", message); }
function optional(value: unknown, limit: number, label: string): string | null {
  if (value === null) return null;
  if (typeof value !== "string" || value.trim().length > limit || controls.test(value)) invalid(`${label}을 다시 확인해 주세요.`);
  return value.trim() || null;
}
export function normalizeTeamInvitation(input: TeamInvitationInput): TeamInvitationInput {
  if (!input || typeof input.email !== "string" || typeof input.inviteeDisplayName !== "string" || typeof input.representative !== "boolean") invalid("초대할 팀원 정보를 확인해 주세요.");
  const email = input.email.trim().toLowerCase(), inviteeDisplayName = input.inviteeDisplayName.trim();
  if (!teamInvitationEmail(email)) invalid("올바른 이메일을 254자 이내로 입력해 주세요.");
  if (!inviteeDisplayName || inviteeDisplayName.length > 100 || controls.test(input.inviteeDisplayName)) invalid("팀원명은 제어 문자 없이 1~100자로 입력해 주세요.");
  const proposedPositionName = optional(input.proposedPositionName, 30, "새 직급명"), message = optional(input.message, 500, "메시지");
  if (!(input.positionId === null || Number.isSafeInteger(input.positionId) && input.positionId > 0)) invalid("부여할 직급을 선택해 주세요.");
  if (input.preset !== null && !["ADMIN", "AGENT", "VIEWER"].includes(input.preset)) invalid("부여할 역할을 선택해 주세요.");
  if (!Array.isArray(input.extraPermissionCodes) || input.extraPermissionCodes.length > 15 || input.extraPermissionCodes.some(code => typeof code !== "string" || !/^[A-Z][A-Z0-9_]*$/.test(code))
    || new Set(input.extraPermissionCodes).size !== input.extraPermissionCodes.length) invalid("추가 권한을 다시 선택해 주세요.");
  if (input.representative) {
    if (input.positionId !== null || proposedPositionName !== null || input.preset !== null || input.extraPermissionCodes.length) invalid("대표자 초대는 일반 직급·역할·추가 권한을 함께 지정할 수 없어요.");
  } else {
    if ((input.positionId === null) === (proposedPositionName === null)) invalid("기존 직급 또는 새 직급명 중 하나를 선택해 주세요.");
    if (proposedPositionName === "대표자") invalid("대표자는 대표자 여부에서 선택해 주세요.");
  }
  // Explicit fields keep unknown properties out of requests and mock storage.
  return { email, inviteeDisplayName, representative: input.representative, positionId: input.positionId, proposedPositionName,
    preset: input.preset, extraPermissionCodes: [...input.extraPermissionCodes], message };
}

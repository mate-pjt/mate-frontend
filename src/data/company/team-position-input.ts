import { ApiError } from "../shared/errors";

// Kotlin trim includes Unicode separators and Java whitespace controls, but not U+FEFF.
function trimPositionName(value: string): string {
  return value.replace(/^[\p{Z}\u0009-\u000d\u001c-\u001f]+|[\p{Z}\u0009-\u000d\u001c-\u001f]+$/gu, "");
}

export function hasTeamPositionName(value: unknown): value is string {
  return typeof value === "string" && trimPositionName(value).length > 0;
}

export function normalizeTeamPositionName(raw: unknown): string {
  const name = typeof raw === "string" ? trimPositionName(raw) : "";
  if (!name || name.length > 30 || /[\u0000-\u001f\u007f-\u009f]/.test(name)) {
    throw new ApiError(400, "POSITION_NAME_INVALID", "직급 이름은 제어 문자 없이 1~30자로 입력해 주세요.");
  }
  if (name === "대표자") throw new ApiError(400, "POSITION_NAME_INVALID", "대표자는 일반 직급 이름으로 사용할 수 없어요.");
  return name;
}

// POL-04 v1: validate before URL parsing can normalize an untrusted path.
export function safeNotificationPath(value: unknown): string | null {
  if (typeof value !== "string" || /[\s\\#\p{Cc}\p{Cf}]/u.test(value)) return null;
  if (value === "/my/company") return value;

  const match = /^\/bids\/([1-9]\d*)(?:\?bidClsfcNo=([^&]+))?$/.exec(value);
  if (!match || !Number.isSafeInteger(Number(match[1]))) return null;
  const path = `/bids/${match[1]}`;
  if (match[2] === undefined) return path;

  try {
    // decodeURIComponent rejects malformed UTF-8 that URLSearchParams would repair.
    const classification = decodeURIComponent(match[2].replaceAll("+", " "));
    if (
      !classification || classification.length > 50 ||
      /[\s/\\\p{Cc}\p{Cf}]/u.test(classification) ||
      /%[0-9a-f]{2}/i.test(classification) ||
      classification === "." || classification === ".."
    ) return null;
    return `${path}?${new URLSearchParams({ bidClsfcNo: classification })}`;
  } catch {
    return null;
  }
}

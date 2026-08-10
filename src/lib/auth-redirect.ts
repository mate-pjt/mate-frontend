const DEFAULT_AUTH_NEXT_PATH = "/bids?view=recommended";
const LOCAL_URL_ORIGIN = "https://mate.local";
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f]/;

export function sanitizeLocalNextPath(value?: string): string {
  if (
    !value?.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    CONTROL_CHARACTER_PATTERN.test(value)
  ) {
    return DEFAULT_AUTH_NEXT_PATH;
  }

  try {
    const url = new URL(value, LOCAL_URL_ORIGIN);

    if (url.origin !== LOCAL_URL_ORIGIN) {
      return DEFAULT_AUTH_NEXT_PATH;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return DEFAULT_AUTH_NEXT_PATH;
  }
}

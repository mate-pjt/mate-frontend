const MOCK_AUTH_STORAGE_KEY = "mate.mock-authenticated";

export function isMockAuthenticated(): boolean {
  return window.localStorage.getItem(MOCK_AUTH_STORAGE_KEY) === "true";
}

export function setMockAuthenticated(): void {
  window.localStorage.setItem(MOCK_AUTH_STORAGE_KEY, "true");
}

import { ApiError } from "../shared/errors";
import type { Authentication, AuthRepository } from "./contracts";

export type SessionState =
  | { status: "loading" | "anonymous" | "error"; authentication: null; expiresAt: 0 }
  | { status: "authenticated"; authentication: Authentication; expiresAt: number };
export const initialSession: SessionState = { status: "loading", authentication: null, expiresAt: 0 };
const anonymous: SessionState = { status: "anonymous", authentication: null, expiresAt: 0 };

export function createSessionController(repository: Pick<AuthRepository, "refreshBrowserSession" | "logoutBrowserSession">, now: () => number = Date.now, onAccount: (key: string | null) => void = () => {}) {
  let state: SessionState = initialSession;
  let epoch = 0;
  let loggingOut = false;
  let flight: Promise<Authentication | null> | null = null;
  let flightEpoch = -1;
  const pendingRefreshes = new Set<Promise<Authentication | null>>();
  const listeners = new Set<() => void>();
  const getAccountKey = () => state.status === "authenticated" && !loggingOut ? String(state.authentication.account.id) : null;
  function update(next: SessionState) { state = next; onAccount(getAccountKey()); listeners.forEach(listener => listener()); }
  function setAuthentication(authentication: Authentication) {
    epoch += 1;
    update({ status: "authenticated", authentication, expiresAt: now() + authentication.expiresInSeconds * 1000 });
  }
  function refresh(options?: { preserveOnError?: boolean }): Promise<Authentication | null> {
    if (loggingOut) return Promise.resolve(null);
    if (flight && flightEpoch === epoch) return flight;
    const startedEpoch = epoch;
    const pending = repository.refreshBrowserSession().then(authentication => {
      if (startedEpoch !== epoch) return null;
      update({ status: "authenticated", authentication, expiresAt: now() + authentication.expiresInSeconds * 1000 });
      return authentication;
    }).catch((error: unknown) => {
      if (startedEpoch !== epoch) return null;
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) { update(anonymous); return null; }
      if (!options?.preserveOnError || state.status !== "authenticated") update({ status: "error", authentication: null, expiresAt: 0 });
      throw error;
    }).finally(() => {
      pendingRefreshes.delete(pending);
      if (flight === pending) flight = null;
    });
    flight = pending; flightEpoch = startedEpoch; pendingRefreshes.add(pending);
    return pending;
  }
  async function getAccessToken() {
    if (loggingOut) throw new ApiError(401, "LOGOUT_IN_PROGRESS", "로그아웃하고 있습니다.");
    if (state.status === "authenticated" && state.expiresAt > now() + 30_000) return state.authentication.accessToken;
    const authentication = await refresh();
    if (!authentication) throw new ApiError(401, "SESSION_INVALID", "로그인이 필요합니다.");
    return authentication.accessToken;
  }
  async function logout() {
    if (loggingOut) return;
    loggingOut = true; epoch += 1; onAccount(null);
    try { await Promise.allSettled(pendingRefreshes); await repository.logoutBrowserSession(); update(anonymous); }
    finally { loggingOut = false; onAccount(getAccountKey()); }
  }
  return { getSnapshot: () => state, getServerSnapshot: () => initialSession,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    setAuthentication, refresh, getAccessToken, getAccountKey, logout };
}

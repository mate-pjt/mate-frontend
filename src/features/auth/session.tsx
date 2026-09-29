"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ApiError, logoutBrowserSession, refreshBrowserSession } from "./api";
import type { Authentication } from "./types";

type SessionState =
  | { status: "loading" | "anonymous" | "error"; authentication: null; expiresAt: 0 }
  | { status: "authenticated"; authentication: Authentication; expiresAt: number };

type AuthSessionContextValue = {
  state: SessionState;
  setAuthentication: (authentication: Authentication) => void;
  refresh: () => Promise<Authentication | null>;
  getAccessToken: () => Promise<string>;
  logout: () => Promise<void>;
};

const anonymous: SessionState = { status: "anonymous", authentication: null, expiresAt: 0 };
const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);
let refreshFlight: Promise<Authentication> | null = null;

function refreshOnce(): Promise<Authentication> {
  if (!refreshFlight) {
    refreshFlight = refreshBrowserSession().finally(() => {
      refreshFlight = null;
    });
  }
  return refreshFlight;
}

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [state, setState] = useState<SessionState>({ status: "loading", authentication: null, expiresAt: 0 });
  const stateRef = useRef(state);
  const logoutEpoch = useRef(0);
  const loggingOut = useRef(false);

  const update = useCallback((next: SessionState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  const setAuthentication = useCallback((authentication: Authentication) => {
    update({
      status: "authenticated",
      authentication,
      expiresAt: Date.now() + authentication.expiresInSeconds * 1000,
    });
  }, [update]);

  const refresh = useCallback(async (): Promise<Authentication | null> => {
    if (loggingOut.current) return null;
    const epoch = logoutEpoch.current;
    try {
      const authentication = await refreshOnce();
      if (epoch !== logoutEpoch.current) return null;
      setAuthentication(authentication);
      return authentication;
    } catch (error) {
      if (epoch !== logoutEpoch.current) return null;
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        update(anonymous);
        return null;
      }
      update({ status: "error", authentication: null, expiresAt: 0 });
      throw error;
    }
  }, [setAuthentication, update]);

  const getAccessToken = useCallback(async (): Promise<string> => {
    if (loggingOut.current) throw new ApiError(401, "LOGOUT_IN_PROGRESS", "로그아웃하고 있습니다.");
    const current = stateRef.current;
    if (current.status === "authenticated" && current.expiresAt > Date.now() + 30_000) {
      return current.authentication.accessToken;
    }
    const authentication = await refresh();
    if (!authentication) throw new ApiError(401, "SESSION_INVALID", "로그인이 필요합니다.");
    return authentication.accessToken;
  }, [refresh]);

  const logout = useCallback(async () => {
    if (loggingOut.current) return;
    loggingOut.current = true;
    logoutEpoch.current += 1;
    try {
      await refreshFlight?.catch(() => undefined);
      await logoutBrowserSession();
      update(anonymous);
    } finally {
      loggingOut.current = false;
    }
  }, [update]);

  useEffect(() => {
    if (pathname === "/auth/callback" || pathname === "/auth/signup") {
      return;
    }
    if (stateRef.current.status !== "loading") return;
    void refresh().catch(() => undefined);
  }, [pathname, refresh]);

  const value = useMemo(() => ({ state, setAuthentication, refresh, getAccessToken, logout }), [state, setAuthentication, refresh, getAccessToken, logout]);

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession(): AuthSessionContextValue {
  const context = useContext(AuthSessionContext);
  if (!context) throw new Error("AuthSessionProvider가 필요합니다.");
  return context;
}

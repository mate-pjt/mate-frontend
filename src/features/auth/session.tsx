"use client";

import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { googleAuthorizationUrl, logoutBrowserSession, refreshBrowserSession } from "@/data/auth/client";
import { createSessionController, type SessionState } from "@/data/auth/session-controller";
import type { Authentication, LoginChoice } from "@/data/auth/contracts";
import { createRecentBidSearches } from "@/features/bids/recent-searches";

type AuthSessionContextValue = {
  state: SessionState;
  subscribe: (listener: () => void) => () => void;
  setAuthentication: (authentication: Authentication) => void;
  refresh: (options?: { preserveOnError?: boolean }) => Promise<Authentication | null>;
  getAccessToken: () => Promise<string>;
  getAccountKey: () => string | null;
  getSessionEpoch: () => number;
  logout: () => Promise<void>;
  startGoogleLogin: (nextPath: string, choice: LoginChoice) => void;
  recentBidSearches: ReturnType<typeof createRecentBidSearches>;
};
const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [controller] = useState(() => createSessionController({ refreshBrowserSession, logoutBrowserSession }, Date.now));
  const [recentBidSearches] = useState(createRecentBidSearches);
  const state = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getServerSnapshot);

  useEffect(() => {
    const sync = () => recentBidSearches.setScope(controller.getConfirmedSessionScope());
    const leave = () => recentBidSearches.setScope(null);
    const unsubscribe = controller.subscribe(sync);
    sync();
    window.addEventListener("pagehide", leave);
    window.addEventListener("pageshow", sync);
    window.addEventListener("focus", recentBidSearches.expire);
    document.addEventListener("visibilitychange", recentBidSearches.expire);
    return () => {
      unsubscribe();
      leave();
      window.removeEventListener("pagehide", leave);
      window.removeEventListener("pageshow", sync);
      window.removeEventListener("focus", recentBidSearches.expire);
      document.removeEventListener("visibilitychange", recentBidSearches.expire);
    };
  }, [controller, recentBidSearches]);

  useEffect(() => {
    if (pathname === "/auth/callback" || pathname === "/auth/signup" || controller.getSnapshot().status !== "loading") return;
    void controller.refresh().catch(() => undefined);
  }, [pathname, controller]);

  const value = useMemo(() => ({
    state, ...controller, recentBidSearches,
    startGoogleLogin(nextPath: string, choice: LoginChoice) {
      const url = googleAuthorizationUrl(nextPath, choice);
      recentBidSearches.setScope(null);
      window.location.assign(url);
    },
  }), [state, controller, recentBidSearches]);
  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}
export function useAuthSession(): AuthSessionContextValue {
  const context = useContext(AuthSessionContext);
  if (!context) throw new Error("AuthSessionProvider가 필요합니다.");
  return context;
}

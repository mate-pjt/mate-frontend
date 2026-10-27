"use client";

import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { logoutBrowserSession, refreshBrowserSession } from "@/data/auth/client";
import { createSessionController, type SessionState } from "@/data/auth/session-controller";
import type { Authentication } from "@/data/auth/contracts";

type AuthSessionContextValue = {
  state: SessionState;
  setAuthentication: (authentication: Authentication) => void;
  refresh: (options?: { preserveOnError?: boolean }) => Promise<Authentication | null>;
  getAccessToken: () => Promise<string>;
  getAccountKey: () => string | null;
  logout: () => Promise<void>;
};
const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [controller] = useState(() => createSessionController({ refreshBrowserSession, logoutBrowserSession }, Date.now));
  const state = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getServerSnapshot);
  useEffect(() => {
    if (pathname === "/auth/callback" || pathname === "/auth/signup" || controller.getSnapshot().status !== "loading") return;
    void controller.refresh().catch(() => undefined);
  }, [pathname, controller]);
  const value = useMemo(() => ({ state, ...controller }), [state, controller]);
  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}
export function useAuthSession(): AuthSessionContextValue {
  const context = useContext(AuthSessionContext);
  if (!context) throw new Error("AuthSessionProvider가 필요합니다.");
  return context;
}

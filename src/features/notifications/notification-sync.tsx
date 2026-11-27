"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

import { getNotifications, getNotificationSignalConnector, getUnreadNotificationCount, NOTIFICATIONS_CHANGED_EVENT } from "@/data/notifications/client";
import { useAuthSession } from "@/features/auth/session";
import { createNotificationConnectionController } from "./connection-controller";
import { createNotificationRefreshController } from "./refresh-controller";

type NotificationSync = {
  controller: ReturnType<typeof createNotificationRefreshController>;
  connectionRejected: boolean;
  retry: () => void;
};

const NotificationSyncContext = createContext<NotificationSync | null>(null);

export function NotificationSyncProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { getSnapshot, subscribe, getAccessToken, refresh, getAccountKey, getSessionEpoch } = useAuthSession();
  const [controller] = useState(() => createNotificationRefreshController(
    { getNotifications, getUnreadNotificationCount },
    { getAccessToken, refresh, getAccountKey, getSessionEpoch },
  ));
  const [connectionRejected, setConnectionRejected] = useState(false);
  const connectionRef = useRef<ReturnType<typeof createNotificationConnectionController> | null>(null);

  useEffect(() => {
    const connect = getNotificationSignalConnector();
    const connection = connect && createNotificationConnectionController({
      connect,
      refresh,
      onSubscriptionSent: () => controller.request(),
      onSignal: () => controller.request(true),
      onRejected: setConnectionRejected,
    });
    connectionRef.current = connection;
    let pageHidden = false;

    function update() {
      const visible = !pageHidden && document.visibilityState === "visible" && navigator.onLine;
      const state = getSnapshot();
      const accountKey = getAccountKey();
      const scope = state.status === "authenticated" && accountKey !== null ? { accountKey, epoch: getSessionEpoch() } : null;
      controller.setAvailable(visible);
      controller.setScope(scope);
      const session = scope && state.status === "authenticated" && !controller.getSnapshot().requiresLogin
        ? { ...scope, token: state.authentication.accessToken, expiresAt: state.expiresAt } : null;
      connection?.update(session, visible);
    }

    function changed() { controller.request(true); }
    function focus() { update(); controller.requestOnFocus(); }
    function pagehide() { pageHidden = true; update(); }
    function pageshow() { pageHidden = false; update(); }
    const unsubscribeSession = subscribe(update);
    const unsubscribeRefresh = controller.subscribe(() => {
      if (controller.getSnapshot().requiresLogin) connection?.update(null, false);
    });
    document.addEventListener("visibilitychange", update);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    window.addEventListener("blur", controller.onBlur);
    window.addEventListener("focus", focus);
    window.addEventListener("pagehide", pagehide);
    window.addEventListener("pageshow", pageshow);
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, changed);
    update();
    return () => {
      unsubscribeSession();
      unsubscribeRefresh();
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
      window.removeEventListener("blur", controller.onBlur);
      window.removeEventListener("focus", focus);
      window.removeEventListener("pagehide", pagehide);
      window.removeEventListener("pageshow", pageshow);
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, changed);
      connectionRef.current = null;
      connection?.update(null, false);
      controller.setAvailable(false);
      controller.setScope(null);
    };
  }, [controller, getSnapshot, subscribe, getAccountKey, getSessionEpoch, refresh]);

  useEffect(() => { controller.request(); }, [controller, pathname]);

  const value = useMemo<NotificationSync>(() => ({
    controller,
    connectionRejected,
    retry() {
      connectionRef.current?.retryRejected();
      controller.request();
    },
  }), [controller, connectionRejected]);
  return <NotificationSyncContext.Provider value={value}>{children}</NotificationSyncContext.Provider>;
}

export function useNotificationSync() {
  const context = useContext(NotificationSyncContext);
  if (!context) throw new Error("NotificationSyncProvider가 필요합니다.");
  return context;
}

export function useNotificationSnapshot() {
  const { controller } = useNotificationSync();
  return useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getServerSnapshot);
}

import { getDataConfig } from "../config";
import { getMockRuntime } from "../mock/runtime";
import { getHttpClient } from "../shared/client";
import type { ConnectNotificationSignals, NotificationsRepository } from "./contracts";
import { createHttpNotificationsRepository } from "./http-repository";
import { createMockNotificationsRepository } from "./mock-repository";
import { connectNotificationSignals } from "./stomp";
export type * from "./contracts";
export { MAX_NOTIFICATION_SELECTION, NOTIFICATIONS_CHANGED_EVENT } from "./contracts";

let repository: NotificationsRepository | null = null;
function getRepository(): NotificationsRepository { return repository ??= getDataConfig().sources.notifications === "mock" ? createMockNotificationsRepository(getMockRuntime()) : createHttpNotificationsRepository(getHttpClient()); }
export const getNotifications: NotificationsRepository["getNotifications"] = (...args) => getRepository().getNotifications(...args);
export const getUnreadNotificationCount: NotificationsRepository["getUnreadNotificationCount"] = (...args) => getRepository().getUnreadNotificationCount(...args);
export const markNotificationRead: NotificationsRepository["markNotificationRead"] = (...args) => getRepository().markNotificationRead(...args);
export const deleteNotifications: NotificationsRepository["deleteNotifications"] = (...args) => getRepository().deleteNotifications(...args);

export function getNotificationSignalConnector(): ConnectNotificationSignals | null {
  const config = getDataConfig();
  if (config.sources.notifications === "mock") return null;
  return (token, handlers) => connectNotificationSignals(config.apiEnvironment, token, handlers);
}

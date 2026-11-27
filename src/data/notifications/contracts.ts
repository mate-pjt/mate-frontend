import type { AuthAccess } from "../shared/http";
import type { AlarmNotification } from "@/types/alarm";
export const NOTIFICATIONS_CHANGED_EVENT = "mate:notifications-changed";
export const MAX_NOTIFICATION_SELECTION = 1000;

export type NotificationCountUpdate = { accountKey: string; sessionEpoch: number; count: number | null };
export type NotificationSignalHandlers = {
  onSubscriptionSent: () => void;
  onSignal: () => void;
  onFailure: (reason: "transport" | "rejected") => void;
};
export type ConnectNotificationSignals = (token: string, handlers: NotificationSignalHandlers) => () => void;
export type NotificationDeletion =
  | { scope: "SELECTED"; notificationIds: readonly string[] }
  | { scope: "ALL" };
export type NotificationDeletionResult = { deletedCount: number; unreadCount: number };

export type NotificationPage = {
  items: readonly AlarmNotification[];
  page: number;
  totalPages: number;
  totalCount: number;
  unreadCount: number;
};

export interface NotificationsRepository {
  getNotifications(access: AuthAccess, page: number, signal?: AbortSignal): Promise<NotificationPage>;
  getUnreadNotificationCount(access: AuthAccess, signal?: AbortSignal): Promise<number>;
  markNotificationRead(access: AuthAccess, id: string, signal?: AbortSignal): Promise<AlarmNotification>;
  deleteNotifications(access: AuthAccess, deletion: NotificationDeletion, signal?: AbortSignal): Promise<NotificationDeletionResult>;
}

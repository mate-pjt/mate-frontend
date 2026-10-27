import type { AuthAccess } from "../shared/http";
import type { AlarmNotification } from "@/types/alarm";
export const NOTIFICATIONS_CHANGED_EVENT = "mate:notifications-changed";
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
  markNotificationRead(access: AuthAccess, id: string): Promise<AlarmNotification>;
}

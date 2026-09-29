import type { AlarmKind, AlarmNotification } from "@/types/alarm";

import { ApiError, authorizedRequest, type AuthAccess } from "@/features/auth/api";

const PAGE_SIZE = 20;
export const NOTIFICATIONS_CHANGED_EVENT = "mate:notifications-changed";

type NotificationDto = {
  notificationId: number;
  type: string;
  resourceId: number;
  title: string | null;
  body: string | null;
  actionPath: string | null;
  createdAt: string;
  readAt: string | null;
};

type NotificationPageDto = {
  content: NotificationDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  unreadCount: number;
};

export type NotificationPage = {
  items: readonly AlarmNotification[];
  page: number;
  totalPages: number;
  totalCount: number;
  unreadCount: number;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function invalidResponse(): never {
  throw new ApiError(200, "INVALID_NOTIFICATION_RESPONSE", "서버의 알림 정보를 확인하지 못했습니다. 다시 시도해 주세요.");
}

function validCount(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 0;
}

function formatKstDate(value: string): string {
  const parts = dateFormatter.formatToParts(new Date(value));
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return `${year}.${month}.${day}`;
}

function notificationKind(type: string): AlarmKind {
  if (type.startsWith("BID_NOTICE_")) return "bid";
  if (type.startsWith("COMPANY_")) return "company";
  return "mate";
}

function mapNotification(data: NotificationDto): AlarmNotification {
  if (
    !Number.isSafeInteger(data?.notificationId) || data.notificationId < 1 ||
    typeof data.type !== "string" ||
    typeof data.createdAt !== "string" || Number.isNaN(Date.parse(data.createdAt)) ||
    (data.readAt !== null && (typeof data.readAt !== "string" || Number.isNaN(Date.parse(data.readAt)))) ||
    (data.title !== null && typeof data.title !== "string") ||
    (data.body !== null && typeof data.body !== "string")
  ) invalidResponse();

  const kind = notificationKind(data.type);
  const label = kind === "bid" ? "입찰공고" : kind === "company" ? "회사 정보 관리" : data.type === "ADMIN_DIRECT_NOTIFICATION" ? "메이트 소식" : "알림";
  const messageLines = [data.title, data.body]
    .filter((value): value is string => typeof value === "string")
    .flatMap((value) => value.split(/\r?\n/).map((line) => line.trim()))
    .filter(Boolean);

  return {
    id: String(data.notificationId),
    kind,
    label,
    receivedAt: data.createdAt,
    receivedDate: formatKstDate(data.createdAt),
    messageLines,
    unread: data.readAt === null,
  };
}

export async function getNotifications(access: AuthAccess, page: number, signal?: AbortSignal): Promise<NotificationPage> {
  const data = await authorizedRequest<NotificationPageDto>(
    access,
    `/api/v1/me/notifications?page=${page}&size=${PAGE_SIZE}&unreadOnly=false`,
    { signal },
  );
  if (
    !Array.isArray(data?.content) ||
    !validCount(data.page) || data.page !== page ||
    data.size !== PAGE_SIZE ||
    !validCount(data.totalElements) ||
    !validCount(data.totalPages) ||
    !validCount(data.unreadCount)
  ) invalidResponse();

  return {
    items: data.content.map(mapNotification),
    page: data.page,
    totalPages: data.totalPages,
    totalCount: data.totalElements,
    unreadCount: data.unreadCount,
  };
}

export async function getUnreadNotificationCount(access: AuthAccess, signal?: AbortSignal): Promise<number> {
  const data = await authorizedRequest<{ unreadCount: number }>(access, "/api/v1/me/notifications/unread-count", { signal });
  if (!validCount(data?.unreadCount)) invalidResponse();
  return data.unreadCount;
}

export async function markNotificationRead(access: AuthAccess, id: string): Promise<AlarmNotification> {
  const data = await authorizedRequest<NotificationDto>(
    access,
    `/api/v1/me/notifications/${encodeURIComponent(id)}/read`,
    { method: "PATCH" },
  );
  const alarm = mapNotification(data);
  if (alarm.id !== id || alarm.unread) invalidResponse();
  return alarm;
}

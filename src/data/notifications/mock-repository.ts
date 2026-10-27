import type { AlarmNotification } from "@/types/alarm";
import { ApiError } from "../shared/errors";
import { mockAccount, type MockRuntime } from "../mock/runtime";
import { isDate, isRecord } from "../mock/validation";
import type { NotificationsRepository } from "./contracts";

function valid(value: unknown): value is AlarmNotification[] {
  return Array.isArray(value) && value.every(item => isRecord(item) && typeof item.id === "string" && ["bid", "company", "mate"].includes(String(item.kind)) && typeof item.label === "string" && isDate(item.receivedAt) && typeof item.receivedDate === "string" && typeof item.unread === "boolean" && Array.isArray(item.messageLines) && item.messageLines.every(line => typeof line === "string"));
}
export function createMockNotificationsRepository(runtime: MockRuntime): NotificationsRepository {
  const initial = (): AlarmNotification[] => runtime.scenario("notifications") === "empty" ? [] : Array.from({ length: 25 }, (_, i) => {
    const receivedAt = new Date(runtime.now() - i * 3600_000).toISOString();
    return { id: String(50001 + i), kind: "mate", label: "메이트 소식", receivedAt,
      receivedDate: new Date(Date.parse(receivedAt) + 9 * 3600_000).toISOString().slice(0, 10).replaceAll("-", "."), messageLines: [`가상 알림 ${i + 1}`, "개발용 합성 데이터입니다."], unread: i < 22 };
  });
  const read = (account: string) => runtime.store.read(account, "notifications", initial, valid);
  return {
    async getNotifications(access, page, signal) {
      const account = await mockAccount(runtime, access, "notifications", signal); const items = read(account);
      return { items: items.slice(page * 20, (page + 1) * 20), page, totalPages: Math.ceil(items.length / 20), totalCount: items.length, unreadCount: items.filter(item => item.unread).length };
    },
    async getUnreadNotificationCount(access, signal) { return read(await mockAccount(runtime, access, "notifications", signal)).filter(item => item.unread).length; },
    async markNotificationRead(access, id) {
      const account = await mockAccount(runtime, access, "notifications"); const items = read(account); const item = items.find(item => item.id === id);
      if (!item) throw new ApiError(404, "NOTIFICATION_NOT_FOUND", "알림을 찾지 못했습니다.");
      item.unread = false; runtime.store.write(account, "notifications", items); return item;
    },
  };
}

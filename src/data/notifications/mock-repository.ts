import type { AlarmNotification } from "@/types/alarm";
import { safeNotificationPath } from "@/lib/notification-path";
import { ApiError } from "../shared/errors";
import { mockAccount, type MockRuntime } from "../mock/runtime";
import { isDate, isRecord } from "../mock/validation";
import type { NotificationsRepository } from "./contracts";
import { parseNotificationDeletion } from "./deletion-input";

type StoredNotification = AlarmNotification & { deletedAt?: string };

function valid(value: unknown): value is StoredNotification[] {
  return Array.isArray(value) && value.every(item => isRecord(item) && typeof item.id === "string" && ["bid", "company", "mate"].includes(String(item.kind)) && typeof item.label === "string" && isDate(item.receivedAt) && typeof item.receivedDate === "string" && typeof item.unread === "boolean" && Array.isArray(item.messageLines) && item.messageLines.every(line => typeof line === "string") && (item.deletedAt === undefined || isDate(item.deletedAt)));
}

function unreadCount(items: readonly StoredNotification[]): number {
  return items.filter(item => item.deletedAt === undefined && item.unread).length;
}

export function createMockNotificationsRepository(runtime: MockRuntime): NotificationsRepository {
  const initial = (): StoredNotification[] => runtime.scenario("notifications") === "empty" ? [] : Array.from({ length: 25 }, (_, i) => {
    const receivedAt = new Date(runtime.now() - i * 3600_000).toISOString();
    const actionPath = ["/bids/10001", "/bids/10002?bidClsfcNo=2", "/my/company", null, "/my/company-merge/1"][i % 5];
    const kind = i % 5 < 2 ? "bid" : i % 5 === 2 ? "company" : "mate";
    return { id: String(50001 + i), kind, label: kind === "bid" ? "입찰공고" : kind === "company" ? "회사 정보 관리" : "메이트 소식", receivedAt,
      receivedDate: new Date(Date.parse(receivedAt) + 9 * 3600_000).toISOString().slice(0, 10).replaceAll("-", "."), messageLines: [`가상 알림 ${i + 1}`, "개발용 합성 데이터입니다."], unread: i < 22, actionPath: safeNotificationPath(actionPath) };
  });
  // Older tab snapshots have no actionPath. Preserve their read history and normalize at the boundary.
  const read = (account: string) => runtime.store.read(account, "notifications", initial, valid)
    .map(item => ({ ...item, actionPath: safeNotificationPath(item.actionPath) }));
  return {
    async getNotifications(access, page, signal) {
      const account = await mockAccount(runtime, access, "notifications", signal);
      const items = read(account).filter(item => item.deletedAt === undefined);
      return { items: items.slice(page * 20, (page + 1) * 20), page, totalPages: Math.ceil(items.length / 20), totalCount: items.length, unreadCount: unreadCount(items) };
    },
    async getUnreadNotificationCount(access, signal) { return unreadCount(read(await mockAccount(runtime, access, "notifications", signal))); },
    async markNotificationRead(access, id, signal) {
      const account = await mockAccount(runtime, access, "notifications", signal);
      access.assertRequestScope?.();
      const items = read(account);
      const item = items.find(item => item.id === id && item.deletedAt === undefined);
      if (!item) throw new ApiError(404, "AN001", "알림을 찾지 못했습니다.");
      item.unread = false; runtime.store.write(account, "notifications", items); return item;
    },
    async deleteNotifications(access, deletion, signal) {
      const input = parseNotificationDeletion(deletion);
      const account = await mockAccount(runtime, access, "notifications", signal);
      access.assertRequestScope?.();
      const items = read(account);
      const ids = input.scope === "SELECTED" ? new Set(input.notificationIds.map(String)) : null;
      const deletedAt = new Date(runtime.now()).toISOString();
      let deletedCount = 0;
      for (const item of items) {
        if (item.deletedAt !== undefined || (ids && !ids.has(item.id))) continue;
        item.deletedAt = deletedAt;
        deletedCount += 1;
      }
      if (deletedCount > 0) runtime.store.write(account, "notifications", items);
      return { deletedCount, unreadCount: unreadCount(items) };
    },
  };
}

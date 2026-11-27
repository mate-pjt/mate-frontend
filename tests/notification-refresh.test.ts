import { afterEach, expect, it, vi } from "vitest";

import type { NotificationPage } from "@/data/notifications/contracts";
import { ApiError } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";
import { createNotificationRefreshController } from "@/features/notifications/refresh-controller";

afterEach(() => vi.useRealTimers());

function page(number: number, ids: string[], totalPages = 3): NotificationPage {
  return {
    page: number, totalPages, totalCount: 25, unreadCount: 3,
    items: ids.map((id) => ({ id, kind: "mate", label: "알림", receivedAt: "", receivedDate: "", messageLines: [], unread: true, actionPath: null })),
  };
}

function setup() {
  vi.useFakeTimers({ now: 0 });
  let scope = { accountKey: "A", epoch: 1 };
  const count = vi.fn<(_: AuthAccess, signal?: AbortSignal) => Promise<number>>().mockResolvedValue(3);
  const list = vi.fn<(_: AuthAccess, index: number, signal?: AbortSignal) => Promise<NotificationPage>>()
    .mockImplementation(async (_, index) => page(index, [String(index)]));
  const refresh = vi.fn(async () => null);
  const getAccessToken = vi.fn(async () => "synthetic-access");
  const controller = createNotificationRefreshController({ getUnreadNotificationCount: count, getNotifications: list }, {
    refresh, getAccessToken, getAccountKey: () => scope.accountKey, getSessionEpoch: () => scope.epoch,
  }, Date.now);
  controller.setScope(scope);
  const applied = vi.fn();
  return {
    controller, count, list, refresh, getAccessToken, applied,
    activate(lastPage?: number) {
      const inbox = lastPage !== undefined ? controller.attachInbox({ lastPage: () => lastPage, apply: applied }) : undefined;
      controller.setAvailable(true);
      return inbox;
    },
    replace(accountKey: string) {
      scope = { accountKey, epoch: scope.epoch + 1 };
      controller.setScope(scope);
    },
  };
}

it("joins repeated signals in a fixed 500ms window subject to the one-second start interval", async () => {
  const { activate, controller, count, list } = setup();
  activate();
  await vi.advanceTimersByTimeAsync(100);
  controller.request(true);
  await vi.advanceTimersByTimeAsync(400);
  controller.request(true);
  await vi.advanceTimersByTimeAsync(499);
  expect(count).toHaveBeenCalledTimes(1);
  await vi.advanceTimersByTimeAsync(1);
  expect(count).toHaveBeenCalledTimes(2);
  await vi.advanceTimersByTimeAsync(1_000);
  controller.request(true);
  for (let index = 0; index < 4; index += 1) {
    await vi.advanceTimersByTimeAsync(100);
    controller.request(true);
  }
  expect(count).toHaveBeenCalledTimes(2);
  await vi.advanceTimersByTimeAsync(100);
  expect(count).toHaveBeenCalledTimes(3);
  await vi.advanceTimersByTimeAsync(120_000);
  expect(count).toHaveBeenCalledTimes(3);
  expect(list).not.toHaveBeenCalled();
});

it("retains only one delayed successor throughout a slow batch", async () => {
  const { activate, controller, count, list, applied } = setup();
  const slow = Promise.withResolvers<number>();
  count.mockReturnValueOnce(slow.promise);
  activate(0);
  await vi.advanceTimersByTimeAsync(20);
  controller.request(true);
  await vi.advanceTimersByTimeAsync(3_000);
  controller.request(true);
  expect(count).toHaveBeenCalledTimes(1);
  expect(list).toHaveBeenCalledTimes(1);
  slow.resolve(4);
  await vi.advanceTimersByTimeAsync(10);
  expect(applied).toHaveBeenCalledTimes(2);
  expect(count).toHaveBeenCalledTimes(2);
  expect(list).toHaveBeenCalledTimes(2);
});

it("publishes all valid expanded pages together, preserving sort order and deduplicating each page", async () => {
  const { activate, list, applied } = setup();
  list.mockResolvedValueOnce(page(0, ["4", "4", "3"]));
  list.mockResolvedValueOnce(page(1, ["3", "2", "1"], 2));
  activate(2);
  await vi.advanceTimersByTimeAsync(1);
  expect(list.mock.calls.map(([, index]) => index)).toEqual([0, 1]);
  expect(applied).toHaveBeenCalledExactlyOnceWith({ status: "fulfilled", value: expect.objectContaining({
    page: 1, totalPages: 2, items: ["4", "3", "2", "1"].map((id) => expect.objectContaining({ id })),
  }) }, { status: "fulfilled", value: 3 });
});

it("removes pages that become invalid during the refresh without replacing the list on an error", async () => {
  const { activate, controller, count, list, applied } = setup();
  activate(2);
  await vi.advanceTimersByTimeAsync(1);
  list.mockResolvedValueOnce(page(0, ["new"]));
  list.mockRejectedValueOnce(new Error("synthetic second-page failure"));
  count.mockRejectedValueOnce(new Error("synthetic count failure"));
  controller.request();
  await vi.advanceTimersByTimeAsync(1_000);
  expect(applied).toHaveBeenLastCalledWith({ status: "rejected", reason: expect.any(Error) }, { status: "rejected", reason: expect.any(Error) });
  expect(controller.getSnapshot()).toMatchObject({ count: 3, countFailed: true });
  await vi.advanceTimersByTimeAsync(10_000);
  expect(applied).toHaveBeenCalledTimes(2);
  list.mockResolvedValueOnce(page(0, ["new"]));
  list.mockResolvedValueOnce(page(1, [], 1));
  controller.request();
  await vi.advanceTimersByTimeAsync(1);
  expect(applied).toHaveBeenLastCalledWith({ status: "fulfilled", value: expect.objectContaining({
    page: 0, totalPages: 1, items: [expect.objectContaining({ id: "new" })],
  }) }, { status: "fulfilled", value: 3 });
  expect(controller.getSnapshot().countFailed).toBe(false);
});

it("aborts stale reads for a list action and waits to use the latest expanded range", async () => {
  const { activate, controller, list, applied } = setup();
  const old = Promise.withResolvers<NotificationPage>();
  const inbox = activate(1);
  list.mockReturnValueOnce(old.promise);
  await vi.advanceTimersByTimeAsync(1);
  inbox?.setBusy(true);
  expect(list.mock.calls[0][2]?.aborted).toBe(true);
  controller.request(true);
  old.resolve(page(0, ["old"]));
  await vi.advanceTimersByTimeAsync(2_000);
  expect(applied).not.toHaveBeenCalled();
  inbox?.setBusy(false);
  await vi.advanceTimersByTimeAsync(1);
  expect(list.mock.calls.map(([, index]) => index)).toEqual([0, 0, 1]);
  expect(applied).toHaveBeenCalledTimes(1);
});

it("aborts when hidden, ignores late values, and joins focus with resumed visibility", async () => {
  const { activate, controller, count, list, applied } = setup();
  const old = Promise.withResolvers<NotificationPage>();
  list.mockReturnValueOnce(old.promise);
  activate(0);
  await vi.advanceTimersByTimeAsync(1);
  controller.request(true);
  controller.onBlur();
  controller.setAvailable(false);
  expect(count.mock.calls[0][1]?.aborted).toBe(true);
  expect(list.mock.calls[0][2]?.aborted).toBe(true);
  old.resolve(page(0, ["old"]));
  await vi.advanceTimersByTimeAsync(10_000);
  expect(applied).not.toHaveBeenCalled();
  controller.setAvailable(true);
  controller.requestOnFocus();
  await vi.advanceTimersByTimeAsync(1);
  controller.requestOnFocus();
  await vi.advanceTimersByTimeAsync(5_000);
  expect(applied).toHaveBeenCalledTimes(1);
  expect(count).toHaveBeenCalledTimes(2);
});

it("retains a focus-only return during a recent in-flight batch", async () => {
  const { activate, controller, count } = setup();
  const old = Promise.withResolvers<number>();
  count.mockReturnValueOnce(old.promise).mockResolvedValueOnce(7);
  activate();
  await vi.advanceTimersByTimeAsync(150);
  controller.onBlur();
  await vi.advanceTimersByTimeAsync(300);
  controller.requestOnFocus();
  controller.requestOnFocus();
  old.resolve(1);
  await vi.advanceTimersByTimeAsync(549);
  expect(count).toHaveBeenCalledTimes(1);
  await vi.advanceTimersByTimeAsync(1);
  expect(count).toHaveBeenCalledTimes(2);
  expect(controller.getSnapshot().count).toBe(7);
});

it("does not publish late counts, reuse the old epoch, or request its token after account replacement", async () => {
  const { activate, controller, count, replace, getAccessToken, refresh } = setup();
  const late = Promise.withResolvers<number>();
  count.mockReturnValueOnce(late.promise).mockResolvedValueOnce(7);
  activate();
  await vi.advanceTimersByTimeAsync(1);
  const oldAccess = count.mock.calls[0][0];
  replace("A");
  await expect(oldAccess.getAccessToken()).rejects.toMatchObject({ name: "AbortError" });
  await expect(oldAccess.refresh()).rejects.toMatchObject({ name: "AbortError" });
  expect(getAccessToken).not.toHaveBeenCalled();
  expect(refresh).not.toHaveBeenCalled();
  await vi.advanceTimersByTimeAsync(1);
  late.resolve(12);
  await vi.advanceTimersByTimeAsync(1);
  expect(controller.getSnapshot()).toMatchObject({ scope: { accountKey: "A", epoch: 2 }, count: 7 });
  replace("B");
  expect(controller.getSnapshot()).toMatchObject({ scope: { accountKey: "B", epoch: 3 }, count: null });
});

it("detaches a pending list without losing the global count or later count-only sync", async () => {
  const { activate, controller, count, list, applied } = setup();
  const old = Promise.withResolvers<NotificationPage>();
  list.mockReturnValueOnce(old.promise);
  const inbox = activate(0);
  await vi.advanceTimersByTimeAsync(1);
  inbox?.dispose();
  expect(list.mock.calls[0][2]?.aborted).toBe(true);
  expect(count.mock.calls[0][1]?.aborted).toBe(false);
  old.resolve(page(0, ["old"]));
  controller.request(true);
  await vi.advanceTimersByTimeAsync(1_500);
  expect(controller.getSnapshot().count).toBe(3);
  expect(list).toHaveBeenCalledTimes(1);
  expect(count).toHaveBeenCalledTimes(2);
  expect(applied).not.toHaveBeenCalled();
});

it("requires login after a final REST 401 and resumes only for a new account lifetime", async () => {
  const { activate, controller, count, replace } = setup();
  count.mockRejectedValueOnce(new ApiError(401, "SESSION_INVALID", "로그인이 필요합니다."));
  activate();
  await vi.advanceTimersByTimeAsync(1);
  expect(controller.getSnapshot()).toMatchObject({ count: null, requiresLogin: true });
  controller.request(true);
  controller.setAvailable(false);
  controller.setAvailable(true);
  await vi.advanceTimersByTimeAsync(3_000);
  expect(count).toHaveBeenCalledTimes(1);
  replace("A");
  await vi.advanceTimersByTimeAsync(1);
  expect(controller.getSnapshot()).toMatchObject({ count: 3, requiresLogin: false });
});

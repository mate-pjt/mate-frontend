import { describe, expect, it, vi } from "vitest";
import { createHttpNotificationsRepository } from "@/data/notifications/http-repository";
import { createMockNotificationsRepository } from "@/data/notifications/mock-repository";
import { createHttpClient } from "@/data/shared/http";
import { createNotificationActivationController } from "@/features/notifications/activation-controller";
import { memoryStorage } from "@/data/mock/store";
import { access, authentication, mockRuntime, ok } from "./helpers";

const dto = (actionPath: unknown, readAt: string | null = null) => ({ notificationId: 50001, resourceId: 99999, type: "BID_NOTICE_UPDATED", title: "합성 제목", body: "합성 본문", createdAt: "2030-06-01T01:00:00Z", readAt, actionPath });

describe("알림 actionPath Repository 경계", () => {
  it("서버 반영 뒤 연결이 끊겨도 UI는 실패를 유지하고 명시적 멱등 재시도로 맞춘다", async () => {
    let written = false;
    const fetcher = vi.fn<typeof fetch>(async () => {
      if (!written) { written = true; throw new TypeError("synthetic connection lost after commit"); }
      return ok(dto("/my/company", "2030-06-01T02:00:00Z"));
    });
    const repo = createHttpNotificationsRepository(createHttpClient("https://synthetic.test", fetcher));
    const onRead = vi.fn(); const navigate = vi.fn(); const onError = vi.fn();
    const controller = createNotificationActivationController({ getAccountKey: access.getAccountKey,
      markRead: (id) => repo.markNotificationRead(access, id), onRead, navigate, onError,
      onPending: vi.fn(), onNotice: vi.fn(), clearError: vi.fn() });
    const item = { id: "50001", kind: "bid" as const, label: "입찰공고", messageLines: ["합성"], receivedAt: "2030-06-01T01:00:00Z", receivedDate: "2030.06.01", unread: true, actionPath: "/bids/10001" };
    await controller.activate(item);
    expect(written).toBe(true); expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: "NETWORK_ERROR" }), item);
    expect(onRead).not.toHaveBeenCalled(); expect(navigate).not.toHaveBeenCalled();
    await controller.activate(item);
    expect(fetcher).toHaveBeenCalledTimes(2); expect(onRead).toHaveBeenCalledOnce(); expect(navigate).toHaveBeenCalledExactlyOnceWith("/my/company");
  });
  it.each(["/bids/10001?bidClsfcNo=2", "/my/company", null, undefined, 9, {}, "//outside.test", "/auth"])("GET/PATCH 경계에서 %j를 정규화한다", async (path) => {
    const fetcher = vi.fn<typeof fetch>(async (_, init) => init?.method === "PATCH"
      ? ok(dto(path, "2030-06-01T02:00:00Z"))
      : ok({ content: [dto(path)], page: 0, size: 20, totalElements: 1, totalPages: 1, unreadCount: 1 }));
    const repo = createHttpNotificationsRepository(createHttpClient("https://synthetic.test", fetcher));
    const expected = typeof path === "string" && path.startsWith("/bids/") ? path : path === "/my/company" ? path : null;
    const page = await repo.getNotifications(access, 0);
    expect(page.items[0]).toMatchObject({ id: "50001", actionPath: expected, unread: true, messageLines: ["합성 제목", "합성 본문"] });
    expect(await repo.markNotificationRead(access, "50001")).toMatchObject({ actionPath: expected, unread: false });
    expect(fetcher.mock.calls[1][0]).toBe("https://synthetic.test/api/v1/me/notifications/50001/read");
    expect(fetcher.mock.calls[1][1]).toMatchObject({ method: "PATCH", credentials: "include", cache: "no-store" });
  });
  it.each([dto("/bids/1"), { ...dto("/bids/1", "2030-06-01T02:00:00Z"), notificationId: 50002 }, { ...dto(null), readAt: "bad" }])("무효 읽음 응답을 성공으로 처리하지 않는다", async (value) => {
    const repo = createHttpNotificationsRepository(createHttpClient("https://synthetic.test", async () => ok(value)));
    await expect(repo.markNotificationRead(access, "50001")).rejects.toMatchObject({ code: "INVALID_NOTIFICATION_RESPONSE" });
  });
  it("동일 계정의401은 refresh1회, 최종401은 실패를 유지한다", async () => {
    for (const succeeds of [true, false]) {
      const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok(null, 401)).mockResolvedValueOnce(succeeds ? ok(dto("/my/company", "2030-06-01T02:00:00Z")) : ok(null, 401));
      const refresh = vi.fn(async () => authentication());
      const repo = createHttpNotificationsRepository(createHttpClient("https://synthetic.test", fetcher));
      const result = repo.markNotificationRead({ ...access, refresh }, "50001");
      if (succeeds) expect((await result).actionPath).toBe("/my/company"); else await expect(result).rejects.toMatchObject({ status: 401 });
      expect(refresh).toHaveBeenCalledOnce(); expect(fetcher).toHaveBeenCalledTimes(2);
    }
  });
  it("새 mock 목적지·분류와 읽음 이력은 재생성/계정별로 보존된다", async () => {
    const storage = memoryStorage(); const runtime = mockRuntime(storage); const repo = createMockNotificationsRepository(runtime);
    const page = await repo.getNotifications(access, 0);
    expect(page.items.slice(0, 5).map(item => item.actionPath)).toEqual(["/bids/10001", "/bids/10002?bidClsfcNo=2", "/my/company", null, null]);
    await repo.markNotificationRead(access, "50001");
    const restored = createMockNotificationsRepository(mockRuntime(storage));
    expect((await restored.getNotifications(access, 0)).items[0]).toMatchObject({ actionPath: "/bids/10001", unread: false });
    expect(await restored.getUnreadNotificationCount(access)).toBe(21);
    expect((await restored.getNotifications({ ...access, getAccountKey: () => "2" }, 0)).items[0].unread).toBe(true);
  });
  it("이전 저장소의 누락/위험 actionPath는 이력을 버리지 않고 null로 보완한다", async () => {
    const runtime = mockRuntime(); const repo = createMockNotificationsRepository(runtime); const page = await repo.getNotifications(access, 0);
    const old = page.items.map((item, index) => {
      const rest: Record<string, unknown> = { ...item };
      delete rest.actionPath;
      return index === 0 ? { ...rest, unread: false } : { ...rest, actionPath: "//outside.test", unread: false };
    });
    runtime.store.write("1", "notifications", old);
    const restored = await repo.getNotifications(access, 0);
    expect(restored.totalCount).toBe(20); expect(restored.unreadCount).toBe(0);
    expect(restored.items.every(item => item.actionPath === null)).toBe(true);
    expect((await repo.markNotificationRead(access, "50001")).unread).toBe(false);
  });
  it("auth API + notifications mock에서는 실제 token/refresh와 목적지 ID 치환이 없다", async () => {
    const runtime = mockRuntime(); runtime.authSource = "api";
    const getAccessToken = vi.fn(async () => { throw new Error("must not request a real token"); }); const refresh = vi.fn();
    const repo = createMockNotificationsRepository(runtime);
    expect((await repo.getNotifications({ ...access, getAccessToken, refresh }, 0)).items[0].actionPath).toBe("/bids/10001");
    await repo.markNotificationRead({ ...access, getAccessToken, refresh }, "50001");
    expect(getAccessToken).not.toHaveBeenCalled(); expect(refresh).not.toHaveBeenCalled();
  });
});

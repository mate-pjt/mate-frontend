import { describe, expect, it, vi } from "vitest";
import type { NotificationDeletion } from "@/data/notifications/contracts";
import { createHttpNotificationsRepository } from "@/data/notifications/http-repository";
import { createMockNotificationsRepository } from "@/data/notifications/mock-repository";
import { memoryStorage } from "@/data/mock/store";
import { createHttpClient } from "@/data/shared/http";
import { access, mockRuntime, ok, testNow } from "./helpers";

const selected = (...notificationIds: string[]): NotificationDeletion => ({ scope: "SELECTED", notificationIds });
const all = { scope: "ALL" } as const;

function httpRepository(fetcher: typeof fetch) {
  return createHttpNotificationsRepository(createHttpClient("https://synthetic.test", fetcher));
}

describe("받은 알림 삭제 HTTP 계약", () => {
  it("고정 ID의 JSON 정수 배열과 계정 전체의 ID 없는 본문을 각각 전송한다", async () => {
    const fetcher = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(ok({ deletedCount: 1, unreadCount: 6, extra: true }))
      .mockResolvedValueOnce(ok({ deletedCount: 25, unreadCount: 1 }));
    const repo = httpRepository(fetcher);
    const signal = new AbortController().signal;
    expect(await repo.deleteNotifications(access, selected("21", "21", "22"), signal)).toEqual({ deletedCount: 1, unreadCount: 6 });
    expect(await repo.deleteNotifications(access, all)).toEqual({ deletedCount: 25, unreadCount: 1 });
    expect(fetcher.mock.calls.map(([, init]) => JSON.parse(String(init?.body)))).toEqual([
      { scope: "SELECTED", notificationIds: [21, 21, 22] }, { scope: "ALL" },
    ]);
    expect(fetcher.mock.calls[0]).toEqual([
      "https://synthetic.test/api/v1/me/notification-deletions",
      expect.objectContaining({ method: "POST", signal, cache: "no-store", credentials: "include" }),
    ]);
  });

  it("중복을 합치기 전 배열에 1000개 상한을 적용한다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok({ deletedCount: 0, unreadCount: 3 }));
    const repo = httpRepository(fetcher);
    await expect(repo.deleteNotifications(access, selected(...Array<string>(1000).fill("21")))).resolves.toEqual({ deletedCount: 0, unreadCount: 3 });
    await expect(repo.deleteNotifications(access, selected(...Array<string>(1001).fill("21")))).rejects.toMatchObject({ status: 400, code: "C001" });
    expect(fetcher).toHaveBeenCalledOnce();
  });

  it.each([selected(), selected("0"), selected("01"), selected("-1"), selected("1.5"), selected("9007199254740992"),
    { scope: "SELECTED", notificationIds: [21] }, { scope: "ALL", notificationIds: [] },
  ])("잘못된 선택 또는 전체 입력을 전송하지 않는다", async (input) => {
    const fetcher = vi.fn<typeof fetch>();
    await expect(httpRepository(fetcher).deleteNotifications(access, input as NotificationDeletion)).rejects.toMatchObject({ status: 400, code: "C001" });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it.each([401, 403, 409, 500])("서버 거부 %s를 실패로 전달하며 자동 재제출하지 않는다", async (status) => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok(null, status));
    const refresh = vi.fn();
    await expect(httpRepository(fetcher).deleteNotifications({ ...access, refresh }, all)).rejects.toMatchObject({ status });
    expect(refresh).not.toHaveBeenCalled();
    expect(fetcher).toHaveBeenCalledOnce();
  });

  it.each([{ deletedCount: 2, unreadCount: 0 }, { deletedCount: 1, unreadCount: -1 }, { deletedCount: 1.5, unreadCount: 0 },
    { deletedCount: 1, unreadCount: "0" }, { deletedCount: 1 },
  ])("요청 범위를 넘거나 잘못된 삭제 집계를 성공으로 처리하지 않는다", async (body) => {
    const repo = httpRepository(async () => ok(body));
    await expect(repo.deleteNotifications(access, selected("1", "1"))).rejects.toMatchObject({ code: "INVALID_NOTIFICATION_RESPONSE" });
  });

  it("인증 대기 중 화면이나 동일 계정 세션이 끝나면 전송하지 않는다", async () => {
    const fetcher = vi.fn<typeof fetch>();
    const controller = new AbortController();
    const getAccessToken = async () => { controller.abort(); return "synthetic-token"; };
    await expect(httpRepository(fetcher).deleteNotifications({ ...access, getAccessToken }, all, controller.signal)).rejects.toMatchObject({ name: "AbortError" });

    const assertRequestScope = () => { throw new DOMException("Previous session", "AbortError"); };
    await expect(httpRepository(fetcher).deleteNotifications({ ...access, assertRequestScope }, all)).rejects.toMatchObject({ name: "AbortError" });
    expect(fetcher).not.toHaveBeenCalled();
  });
});

describe("받은 알림 삭제 mock 계약", () => {
  it("타 계정 ID·중복·기삭제를 건너뛰고 최초 삭제 시각과 기존 읽음 이력을 남긴다", async () => {
    const storage = memoryStorage();
    let now = testNow;
    const runtime = mockRuntime(storage, {}, () => now);
    const repo = createMockNotificationsRepository(runtime);
    const other = { ...access, getAccountKey: () => "2" };
    const otherPage = await repo.getNotifications(other, 0);
    runtime.store.write("2", "notifications", [{ ...otherPage.items[0], id: "99001" }]);
    await repo.markNotificationRead(access, "50001");
    await repo.markNotificationRead(access, "50003");

    expect(await repo.deleteNotifications(access, selected("50001", "50002", "50002", "99001", "99002"))).toEqual({ deletedCount: 2, unreadCount: 19 });
    now += 1_000;
    const restored = createMockNotificationsRepository(mockRuntime(storage, {}, () => now));
    expect(await restored.deleteNotifications(access, selected("50001", "99001"))).toEqual({ deletedCount: 0, unreadCount: 19 });
    const stored = JSON.parse(storage.getItem(runtime.store.key("1", "notifications")) ?? "[]");
    expect(stored[0]).toMatchObject({ id: "50001", deletedAt: new Date(testNow).toISOString(), unread: false });
    expect(stored[1]).toMatchObject({ id: "50002", deletedAt: new Date(testNow).toISOString(), unread: true });
    expect((await restored.getNotifications(access, 0)).items[0]).toMatchObject({ id: "50003", unread: false });
    expect(await restored.getUnreadNotificationCount(access)).toBe(19);
    await expect(restored.markNotificationRead(access, "50001")).rejects.toMatchObject({ status: 404, code: "AN001" });
    expect((await restored.getNotifications(other, 0)).items[0]).toMatchObject({ id: "99001", unread: true });
  });

  it("오래된 미삭제 행과 펼치지 않은 세 번째 페이지도 ALL에 포함한다", async () => {
    const runtime = mockRuntime();
    const repo = createMockNotificationsRepository(runtime);
    const { items } = await repo.getNotifications(access, 0);
    const fixture = Array.from({ length: 45 }, (_, index) => ({ ...items[index % items.length], id: String(index + 1),
      receivedAt: new Date(testNow - index * 86_400_000).toISOString(), unread: index % 2 === 0 }));
    runtime.store.write("1", "notifications", fixture);
    const first = await repo.getNotifications(access, 0);
    expect(first).toMatchObject({ totalPages: 3, totalCount: 45, unreadCount: 23 });
    expect(first.items[8].receivedAt).toBe(fixture[8].receivedAt);
    await repo.getNotifications(access, 1);
    expect(await repo.deleteNotifications(access, selected("1", "2"))).toEqual({ deletedCount: 2, unreadCount: 22 });
    expect((await repo.getNotifications(access, 0)).items.at(-1)?.id).toBe("22");
    expect((await repo.getNotifications(access, 1)).items[0].id).toBe("23");
    expect(await repo.deleteNotifications(access, all)).toEqual({ deletedCount: 43, unreadCount: 0 });
    expect(await repo.getNotifications(access, 0)).toMatchObject({ items: [], totalCount: 0, totalPages: 0 });
  });

  it("hybrid에서는 실제 토큰 요청 없이 처리하고 종료된 세션은 쓰지 않는다", async () => {
    const runtime = mockRuntime();
    runtime.authSource = "api";
    const repo = createMockNotificationsRepository(runtime);
    const getAccessToken = vi.fn();
    const hybridAccess = { ...access, getAccessToken };
    const assertRequestScope = () => { throw new DOMException("Previous session", "AbortError"); };
    await expect(repo.deleteNotifications({ ...hybridAccess, assertRequestScope }, all)).rejects.toMatchObject({ name: "AbortError" });
    expect(await repo.deleteNotifications(hybridAccess, selected("50001"))).toEqual({ deletedCount: 1, unreadCount: 21 });
    expect(getAccessToken).not.toHaveBeenCalled();
  });
});

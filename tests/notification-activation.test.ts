import { describe, expect, it, vi } from "vitest";
import { createNotificationActivationController } from "@/features/notifications/activation-controller";
import type { AlarmNotification } from "@/types/alarm";

const alarm = (id = "50001", actionPath: string | null = "/bids/10001", unread = true): AlarmNotification => ({
  id, actionPath, unread, kind: "bid", label: "입찰공고", receivedAt: "2030-06-01T01:00:00Z", receivedDate: "2030.06.01", messageLines: ["합성 알림"],
});
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function setup() {
  let account: string | null = "1";
  const port = {
    getAccountKey: () => account,
    markRead: vi.fn(async (id: string) => alarm(id, "/my/company", false)),
    onRead: vi.fn(), onPending: vi.fn(), onNotice: vi.fn(), onError: vi.fn(), clearError: vi.fn(), navigate: vi.fn(),
  };
  return { port, controller: createNotificationActivationController(port), setAccount: (value: string | null) => { account = value; } };
}

describe("알림 클릭과 계정 수명", () => {
  it("PATCH 성공의 대상 snapshot으로 읽음 반영 후 이동한다", async () => {
    const { port, controller } = setup();
    const pending = deferred<AlarmNotification>();
    port.markRead.mockReturnValue(pending.promise);
    const flight = controller.activate(alarm());
    expect(port.navigate).not.toHaveBeenCalled(); expect(port.onRead).not.toHaveBeenCalled();
    pending.resolve(alarm("50001", "/my/company", false)); await flight;
    expect(port.onRead).toHaveBeenCalledOnce(); expect(port.navigate).toHaveBeenCalledWith("/my/company");
    expect(port.onRead.mock.invocationCallOrder[0]).toBeLessThan(port.navigate.mock.invocationCallOrder[0]);
    expect(port.onPending).toHaveBeenLastCalledWith([]);
  });
  it("읽은 항목은 PATCH/읽음 반영 없이 이동한다", async () => {
    const { port, controller } = setup(); await controller.activate(alarm("50001", "/bids/10001?bidClsfcNo=2", false));
    expect(port.markRead).not.toHaveBeenCalled(); expect(port.onRead).not.toHaveBeenCalled();
    expect(port.navigate).toHaveBeenCalledWith("/bids/10001?bidClsfcNo=2");
  });
  it.each([null, "//outside.test", "/auth", "/my/company-merge/1", "/bids/1?next=x"])("성공 응답의 무효 대상 %s는 읽음 뒤 안내만 한다", async (path) => {
    const { port, controller } = setup(); port.markRead.mockResolvedValue(alarm("50001", path, false));
    await controller.activate(alarm());
    expect(port.onRead).toHaveBeenCalledOnce(); expect(port.navigate).not.toHaveBeenCalled();
    expect(port.onNotice).toHaveBeenLastCalledWith(expect.any(String));
    expect(port.onNotice.mock.lastCall?.[0]).not.toContain(path ?? "null");
  });
  it("이미 읽은 위험 대상도 이동 없이 안내한다", async () => {
    const { port, controller } = setup(); await controller.activate(alarm("50001", "javascript:alert(1)", false));
    expect(port.markRead).not.toHaveBeenCalled(); expect(port.navigate).not.toHaveBeenCalled();
    expect(port.onNotice).toHaveBeenLastCalledWith(expect.any(String));
  });
  it("실패는 낙관 갱신/이동 없이 알리고 명시적 멱등 재시도가 가능하다", async () => {
    const { port, controller } = setup(); port.markRead.mockRejectedValueOnce(new Error("network"));
    await controller.activate(alarm());
    expect(port.onRead).not.toHaveBeenCalled(); expect(port.navigate).not.toHaveBeenCalled(); expect(port.onError).toHaveBeenCalledOnce();
    await controller.activate(alarm());
    expect(port.markRead).toHaveBeenCalledTimes(2); expect(port.onRead).toHaveBeenCalledOnce(); expect(port.navigate).toHaveBeenCalledOnce();
  });
  it("같은 항목의 연속 클릭은 진행 중 PATCH와 이동을 중복하지 않는다", async () => {
    const { port, controller } = setup(); const pending = deferred<AlarmNotification>(); port.markRead.mockReturnValue(pending.promise);
    const flight = controller.activate(alarm()); await controller.activate(alarm());
    expect(port.markRead).toHaveBeenCalledOnce(); pending.resolve(alarm("50001", "/bids/10001", false)); await flight;
    await controller.activate(alarm()); expect(port.markRead).toHaveBeenCalledOnce(); expect(port.navigate).toHaveBeenCalledOnce();
  });
  it("폴백 이후 stale 미읽음 props로 다시 눌러도 건수/PATCH를 중복하지 않는다", async () => {
    const { port, controller } = setup(); port.markRead.mockResolvedValue(alarm("50001", null, false));
    await controller.activate(alarm()); await controller.activate(alarm());
    expect(port.markRead).toHaveBeenCalledOnce(); expect(port.onRead).toHaveBeenCalledOnce(); expect(port.navigate).not.toHaveBeenCalled();
  });
  it("서로 다른 항목은 읽음을 반영하되 최신 클릭만 이동한다", async () => {
    const { port, controller } = setup(); const first = deferred<AlarmNotification>(); const second = deferred<AlarmNotification>();
    port.markRead.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const a = controller.activate(alarm("50001")); const b = controller.activate(alarm("50002"));
    second.resolve(alarm("50002", "/my/company", false)); await b;
    first.resolve(alarm("50001", "/bids/10001", false)); await a;
    expect(port.onRead).toHaveBeenCalledTimes(2); expect(port.navigate).toHaveBeenCalledExactlyOnceWith("/my/company");
  });
  it("최신 클릭이 폴백이어도 이전 응답이 나중에 이동하지 않는다", async () => {
    const { port, controller } = setup(); const pending = deferred<AlarmNotification>(); port.markRead.mockReturnValue(pending.promise);
    const flight = controller.activate(alarm()); await controller.activate(alarm("50002", null, false));
    pending.resolve(alarm("50001", "/bids/10001", false)); await flight;
    expect(port.navigate).not.toHaveBeenCalled(); expect(port.onRead).toHaveBeenCalledOnce();
  });
  it.each([null, "/my/company"])("이전 요청의 늦은 실패가 최신 클릭 %s의 결과를 덮지 않는다", async (path) => {
    const { port, controller } = setup(); const pending = deferred<AlarmNotification>(); port.markRead.mockReturnValue(pending.promise);
    const flight = controller.activate(alarm()); await controller.activate(alarm("50002", path, false));
    const noticeCalls = [...port.onNotice.mock.calls];
    pending.reject(new Error("late previous request failure")); await flight;
    expect(port.onError).not.toHaveBeenCalled(); expect(port.onRead).not.toHaveBeenCalled();
    expect(port.onNotice.mock.calls).toEqual(noticeCalls);
    if (path) expect(port.navigate).toHaveBeenCalledExactlyOnceWith(path); else expect(port.navigate).not.toHaveBeenCalled();
  });
  it.each(["dispose", "logout", "account"])("%s 뒤 늦은 응답은 상태·건수·이동을 바꾸지 않는다", async (change) => {
    const { port, controller, setAccount } = setup(); const pending = deferred<AlarmNotification>(); port.markRead.mockReturnValue(pending.promise);
    const flight = controller.activate(alarm());
    if (change === "dispose") controller.dispose(); else setAccount(change === "logout" ? null : "2");
    pending.resolve(alarm("50001", "/my/company", false)); await flight;
    expect(port.onRead).not.toHaveBeenCalled(); expect(port.navigate).not.toHaveBeenCalled(); expect(port.onError).not.toHaveBeenCalled();
    expect(port.onPending).toHaveBeenCalledTimes(1);
  });
  it("401 중 세션이 해제되면 후속 로그인/행동을 자동 재생하지 않는다", async () => {
    const { port, controller, setAccount } = setup();
    port.markRead.mockImplementation(async () => { setAccount(null); throw new Error("expired"); });
    await controller.activate(alarm()); setAccount("1");
    expect(port.markRead).toHaveBeenCalledOnce(); expect(port.navigate).not.toHaveBeenCalled(); expect(port.onRead).not.toHaveBeenCalled();
  });
  it("이동 호출 자체가 실패해도 읽음을 되돌리거나 다시 PATCH하지 않는다", async () => {
    const { port, controller } = setup(); port.navigate.mockImplementationOnce(() => { throw new Error("route failed"); });
    await controller.activate(alarm()); expect(port.onRead).toHaveBeenCalledOnce(); expect(port.onError).toHaveBeenCalledOnce();
    await controller.activate(alarm()); expect(port.markRead).toHaveBeenCalledOnce(); expect(port.navigate).toHaveBeenCalledTimes(2);
  });
});

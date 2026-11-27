import { afterEach, describe, expect, it, vi } from "vitest";

import { getNotificationSignalConnector } from "@/data/notifications/client";
import { resolveDataConfig } from "@/data/config";
import { connectNotificationSignals } from "@/data/notifications/stomp";
import { createNotificationConnectionController } from "@/features/notifications/connection-controller";
import type { NotificationSignalHandlers } from "@/data/notifications/contracts";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

function wire() {
  const socket = {
    readyState: 0,
    binaryType: "",
    onopen: null as (() => void) | null,
    onmessage: null as ((event: { data: string | ArrayBuffer }) => void) | null,
    onerror: null as (() => void) | null,
    onclose: null as (() => void) | null,
    send: vi.fn<(value: string) => void>(),
    close: vi.fn(),
  };
  const handlers = { onSubscriptionSent: vi.fn(), onSignal: vi.fn(), onFailure: vi.fn() };
  const openSocket = vi.fn(() => socket as unknown as WebSocket);
  const stop = connectNotificationSignals("https://api.example.test/gateway", "synthetic-access", handlers, openSocket);
  return {
    handlers, socket, openSocket, stop,
    open() { socket.readyState = 1; socket.onopen?.(); },
    receive(data: string | ArrayBuffer) { socket.onmessage?.({ data }); },
  };
}

describe("native notification signal transport", () => {
  it("rejects missing or malformed credentials before opening a socket", () => {
    const onFailure = vi.fn();
    const openSocket = vi.fn();
    const handlers = { onFailure, onSubscriptionSent: vi.fn(), onSignal: vi.fn() };
    connectNotificationSignals("https://api.example.test", "", handlers, openSocket);
    connectNotificationSignals("https://api.example.test", "invalid token", handlers, openSocket);
    connectNotificationSignals("https://api.example.test", undefined as unknown as string, handlers, openSocket);
    expect(openSocket).not.toHaveBeenCalled();
    expect(onFailure.mock.calls).toEqual([["rejected"], ["rejected"], ["rejected"]]);
  });

  it("uses the API snapshot path and sends a single canonical CONNECT and subscription", () => {
    const { handlers, socket, openSocket, stop, open, receive } = wire();
    expect(openSocket).toHaveBeenCalledWith("wss://api.example.test/gateway/ws/v1/notifications", "v12.stomp");
    open();
    expect(socket.send).toHaveBeenCalledExactlyOnceWith("CONNECT\naccept-version:1.2\nhost:api.example.test\nheart-beat:0,0\nAuthorization:Bearer synthetic-access\n\n\0");
    expect(handlers.onSubscriptionSent).not.toHaveBeenCalled();
    receive("\nCONNECTED\r\nversion:1.2\r\n\r\n\0CONNECTED\nversion:1.2\n\n\0");
    expect(handlers.onSubscriptionSent).toHaveBeenCalledTimes(1);
    expect(socket.send.mock.calls.at(-1)?.[0]).toBe("SUBSCRIBE\nid:notification-changes\ndestination:/user/queue/notification-changes\nack:auto\n\n\0");
    stop();
    stop();
    expect(socket.send.mock.calls.slice(2).flat()).toEqual(["UNSUBSCRIBE\nid:notification-changes\n\n\0", "DISCONNECT\n\n\0"]);
    expect(socket.close).toHaveBeenCalledTimes(1);
  });

  it("recognizes only valid change messages on the active subscription, including split UTF-8", () => {
    const { handlers, open, receive, stop } = wire();
    open();
    const signal = '{"type":"NOTIFICATION_CHANGED","ignored":"가"}';
    const valid = `MESSAGE\nsubscription:notification-changes\ncontent-length:${new TextEncoder().encode(signal).length}\n\n${signal}\0`;
    receive(valid);
    receive("CONNECTED\nversion:1.2\n\n\0");
    receive('MESSAGE\nsubscription:other\n\n{"type":"NOTIFICATION_CHANGED"}\0');
    receive('MESSAGE\nsubscription:notification-changes\n\n{"type":"OTHER"}\0');
    receive("MESSAGE\nsubscription:notification-changes\ncontent-length:5\n\n{}\0");
    expect(handlers.onSignal).not.toHaveBeenCalled();
    const bytes = new TextEncoder().encode(valid);
    receive(bytes.slice(0, bytes.length - 4).buffer);
    expect(handlers.onSignal).not.toHaveBeenCalled();
    receive(bytes.slice(bytes.length - 4).buffer);
    expect(handlers.onSignal).toHaveBeenCalledTimes(1);
    stop();
  });

  it("distinguishes an ambiguous STOMP rejection from a silent transport timeout", async () => {
    vi.useFakeTimers();
    const rejected = wire();
    rejected.open();
    rejected.receive("ERROR\nmessage:Rejected\n\n\0");
    expect(rejected.handlers.onFailure).toHaveBeenCalledExactlyOnceWith("rejected");

    const timeout = wire();
    timeout.open();
    await vi.advanceTimersByTimeAsync(10_000);
    expect(timeout.handlers.onFailure).toHaveBeenCalledExactlyOnceWith("transport");
    expect(timeout.socket.onmessage).toBeNull();
  });

  it.each([
    { MATE_DATA_PROFILE: "mock" },
    { MATE_DATA_PROFILE: "hybrid", MATE_DATA_OVERRIDES: '{"notifications":"mock"}' },
  ])("has no socket connector for mock notifications ($MATE_DATA_PROFILE)", (config) => {
    vi.stubEnv("NEXT_PUBLIC_MATE_DATA_CONFIG", JSON.stringify(resolveDataConfig({ MATE_APP_ENV: "local", ...config })));
    expect(getNotificationSignalConnector()).toBeNull();
  });
});

function connection() {
  vi.useFakeTimers({ now: 0 });
  const attempts: { handlers: NotificationSignalHandlers; stop: ReturnType<typeof vi.fn> }[] = [];
  const options = {
    connect: vi.fn((_: string, handlers: NotificationSignalHandlers) => {
      const stop = vi.fn();
      attempts.push({ handlers, stop });
      return stop;
    }),
    refresh: vi.fn(async () => {}), onSubscriptionSent: vi.fn(), onSignal: vi.fn(), onRejected: vi.fn(),
    now: Date.now, random: () => 0.5,
  };
  const controller = createNotificationConnectionController(options);
  const session = { accountKey: "A", epoch: 1, token: "A-first", expiresAt: 1_000_000 };
  controller.update(session, true);
  return { controller, options, attempts, session };
}

describe("notification connection lifetime", () => {
  it("backs off to 30 seconds and resets only after a signal from the subscription", async () => {
    const { attempts, options } = connection();
    for (const [index, delay] of [1, 2, 4, 8, 16, 30, 30].entries()) {
      attempts[index].handlers.onSubscriptionSent();
      attempts[index].handlers.onFailure("transport");
      await vi.advanceTimersByTimeAsync(delay * 1_000 - 1);
      expect(attempts).toHaveLength(index + 1);
      await vi.advanceTimersByTimeAsync(1);
      expect(attempts).toHaveLength(index + 2);
    }
    expect(options.onSubscriptionSent).toHaveBeenCalledTimes(7);
    attempts.at(-1)?.handlers.onSignal();
    attempts.at(-1)?.handlers.onFailure("transport");
    await vi.advanceTimersByTimeAsync(1_000);
    expect(attempts).toHaveLength(9);
  });

  it("cancels retries while hidden and discards callbacks from old account lifetimes", async () => {
    const { attempts, controller, options, session } = connection();
    attempts[0].handlers.onFailure("transport");
    controller.update(session, false);
    await vi.advanceTimersByTimeAsync(30_000);
    expect(attempts).toHaveLength(1);
    controller.update(session, true);
    expect(attempts).toHaveLength(2);
    controller.update(null, true);
    controller.update({ ...session, epoch: 3, token: "A-second" }, true);
    attempts[1].handlers.onSignal();
    attempts[1].handlers.onSubscriptionSent();
    attempts[1].handlers.onFailure("transport");
    expect(attempts[1].stop).toHaveBeenCalledTimes(1);
    expect(options.onSubscriptionSent).not.toHaveBeenCalled();
    expect(options.onSignal).not.toHaveBeenCalled();
    expect(options.connect.mock.calls.map(([value]) => value)).toEqual(["A-first", "A-first", "A-second"]);
  });

  it("closes an expired socket and shares one refresh before starting with the new credential", async () => {
    const { attempts, controller, options, session } = connection();
    await vi.advanceTimersByTimeAsync(session.expiresAt);
    controller.update({ ...session }, true);
    expect(options.refresh).toHaveBeenCalledTimes(1);
    expect(attempts[0].stop).toHaveBeenCalledTimes(1);
    expect(attempts).toHaveLength(1);
    controller.update({ ...session, token: "A-new", expiresAt: Date.now() + 3_600_000 }, true);
    expect(options.connect).toHaveBeenLastCalledWith("A-new", expect.any(Object));
  });

  it("stops a socket on malformed expiry metadata without timers or refresh loops", async () => {
    const { attempts, controller, options, session } = connection();
    controller.update({ ...session, expiresAt: Number.NaN }, true);
    expect(vi.getTimerCount()).toBe(0);
    expect(attempts[0].stop).toHaveBeenCalledTimes(1);
    controller.update({ ...session, expiresAt: Number.NaN }, true);
    await vi.advanceTimersByTimeAsync(30_000);
    expect(options.onRejected).toHaveBeenCalledExactlyOnceWith(true);
    expect(options.refresh).not.toHaveBeenCalled();
    expect(attempts).toHaveLength(1);
    controller.update({ ...session, token: "A-new" }, true);
    expect(attempts).toHaveLength(2);
  });

  it("does not repeat expiry refresh when it returns another unusable credential", async () => {
    const { attempts, controller, options, session } = connection();
    options.refresh.mockImplementationOnce(async () => {
      controller.update({ ...session, token: "A-expired", expiresAt: Date.now() - 1 }, true);
    });
    await vi.advanceTimersByTimeAsync(session.expiresAt);
    await vi.advanceTimersByTimeAsync(30_000);
    expect(attempts).toHaveLength(1);
    expect(options.refresh).toHaveBeenCalledTimes(1);
    expect(options.onRejected).toHaveBeenCalledExactlyOnceWith(true);
  });

  it("does not classify protocol rejection as 401 or repeatedly reconnect on the same credential", async () => {
    const { attempts, controller, options, session } = connection();
    attempts[0].handlers.onFailure("rejected");
    await vi.advanceTimersByTimeAsync(30_000);
    controller.update({ ...session }, true);
    expect(options.refresh).not.toHaveBeenCalled();
    expect(options.onRejected).toHaveBeenCalledExactlyOnceWith(true);
    expect(attempts).toHaveLength(1);
    controller.retryRejected();
    expect(attempts).toHaveLength(2);
  });
});

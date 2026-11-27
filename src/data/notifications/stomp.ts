import type { NotificationSignalHandlers } from "./contracts";

const destination = "/user/queue/notification-changes";
const subscription = "notification-changes";
const connectionTimeout = 10_000;
const maxFrameLength = 16_384;

function frame(command: string, ...headers: string[]) {
  return [command, ...headers, "", "\0"].join("\n");
}

function readFrame(source: string) {
  const separator = /\r?\n\r?\n/.exec(source);
  if (!separator) return null;
  const [command, ...lines] = source.slice(0, separator.index).split(/\r?\n/);
  const headers = new Map<string, string>();
  for (const line of lines) {
    const colon = line.indexOf(":");
    if (colon < 1) return null;
    const name = line.slice(0, colon);
    if (!headers.has(name)) headers.set(name, line.slice(colon + 1));
  }
  const body = source.slice(separator.index + separator[0].length);
  const size = headers.get("content-length");
  if (size !== undefined && (!/^\d+$/.test(size) || Number(size) !== new TextEncoder().encode(body).length)) return null;
  return { command, headers, body };
}

function isChangeSignal(body: string) {
  try {
    const payload: unknown = JSON.parse(body);
    return typeof payload === "object" && payload !== null && "type" in payload && payload.type === "NOTIFICATION_CHANGED";
  } catch {
    return false;
  }
}

export function connectNotificationSignals(
  apiEnvironment: string,
  token: string,
  handlers: NotificationSignalHandlers,
  openSocket: (url: string, protocol: string) => WebSocket = (url, protocol) => new WebSocket(url, protocol),
) {
  if (typeof token !== "string" || !/^[A-Za-z0-9._~+/-]+=*$/.test(token)) {
    handlers.onFailure("rejected");
    return () => {};
  }
  const url = new URL(`${apiEnvironment}/ws/v1/notifications`);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  const socket = openSocket(url.href, "v12.stomp");
  socket.binaryType = "arraybuffer";
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let buffer = "";
  let stopped = false;
  let subscriptionSent = false;
  const timeout = setTimeout(() => fail("transport"), connectionTimeout);

  function stop() {
    if (stopped) return;
    stopped = true;
    clearTimeout(timeout);
    socket.onopen = socket.onmessage = socket.onerror = socket.onclose = null;
    buffer = "";
    if (subscriptionSent && socket.readyState === 1) {
      try {
        socket.send(frame("UNSUBSCRIBE", `id:${subscription}`));
        socket.send(frame("DISCONNECT"));
      } catch {
        // The peer may have closed the socket before these frames could be sent.
      }
    }
    if (socket.readyState < 2) socket.close();
  }

  function fail(reason: Parameters<NotificationSignalHandlers["onFailure"]>[0]) {
    if (stopped) return;
    stop();
    handlers.onFailure(reason);
  }

  function receive(source: string) {
    const received = readFrame(source);
    if (!received) return;
    const { command, headers, body } = received;
    if (command === "ERROR") {
      fail("rejected");
    } else if (command === "CONNECTED" && !subscriptionSent) {
      if (headers.get("version") !== "1.2") {
        fail("rejected");
        return;
      }
      socket.send(frame("SUBSCRIBE", `id:${subscription}`, `destination:${destination}`, "ack:auto"));
      subscriptionSent = true;
      clearTimeout(timeout);
      handlers.onSubscriptionSent();
    } else if (command === "MESSAGE" && subscriptionSent && headers.get("subscription") === subscription && isChangeSignal(body)) {
      handlers.onSignal();
    }
  }

  socket.onopen = () => {
    try {
      socket.send(frame("CONNECT", "accept-version:1.2", `host:${url.host}`, "heart-beat:0,0", `Authorization:Bearer ${token}`));
    } catch {
      fail("transport");
    }
  };
  socket.onmessage = ({ data }) => {
    try {
      if (typeof data === "string") buffer += data;
      else if (data instanceof ArrayBuffer) buffer += decoder.decode(data, { stream: true });
      else return;
      if (buffer.length > maxFrameLength) {
        fail("rejected");
        return;
      }
      buffer = buffer.replace(/^[\r\n]+/, "");
      for (let end = buffer.indexOf("\0"); end !== -1 && !stopped; end = buffer.indexOf("\0")) {
        const source = buffer.slice(0, end);
        buffer = buffer.slice(end + 1).replace(/^[\r\n]+/, "");
        receive(source);
      }
    } catch {
      fail("transport");
    }
  };
  socket.onerror = socket.onclose = () => fail("transport");
  return stop;
}

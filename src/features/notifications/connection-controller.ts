import type { ConnectNotificationSignals } from "@/data/notifications/client";

type SignalSession = { accountKey: string; epoch: number; token: string; expiresAt: number };

const reconnectDelays = [1_000, 2_000, 4_000, 8_000, 16_000, 30_000];

export function createNotificationConnectionController({
  connect, refresh, onSubscriptionSent, onSignal, onRejected,
  now = Date.now, random = Math.random,
}: {
  connect: ConnectNotificationSignals;
  refresh: () => Promise<unknown>;
  onSubscriptionSent: () => void;
  onSignal: () => void;
  onRejected: (rejected: boolean) => void;
  now?: () => number;
  random?: () => number;
}) {
  let session: SignalSession | null = null;
  let available = false;
  let attempt: { stop: () => void } | null = null;
  let expires: ReturnType<typeof setTimeout> | undefined;
  let retry: ReturnType<typeof setTimeout> | undefined;
  let failures = 0;
  let rejected = false;
  let expiryRefreshAttempted = false;

  function stopAttempt() {
    const previous = attempt;
    attempt = null;
    previous?.stop();
  }

  function clearRetry() {
    clearTimeout(retry);
    retry = undefined;
  }

  function setRejected(value: boolean) {
    if (rejected === value) return;
    rejected = value;
    onRejected(value);
  }

  function ensureConnection() {
    if (!available || !session) return;
    const currentSession = session;
    const remaining = currentSession.expiresAt - now();
    clearTimeout(expires);
    if (!Number.isFinite(remaining)) {
      stopAttempt();
      clearRetry();
      setRejected(true);
      return;
    }
    if (remaining <= 0) {
      stopAttempt();
      clearRetry();
      if (!expiryRefreshAttempted) {
        expiryRefreshAttempted = true;
        const handleExpiry = () => {
          if (session?.accountKey === currentSession.accountKey && session.epoch === currentSession.epoch && session.expiresAt <= now()) {
            setRejected(true);
          }
        };
        void refresh().then(handleExpiry, handleExpiry);
      }
      return;
    }
    expiryRefreshAttempted = false;
    expires = setTimeout(ensureConnection, Math.min(remaining, 2_147_483_647));
    if (attempt || retry !== undefined || rejected) return;
    const started = { stop: () => {} };
    attempt = started;

    function onFailure(reason: "transport" | "rejected") {
      if (attempt !== started) return;
      stopAttempt();
      if (reason === "rejected") {
        setRejected(true);
        return;
      }
      const base = reconnectDelays[Math.min(failures, reconnectDelays.length - 1)];
      failures += 1;
      const delay = Math.min(30_000, base * (0.75 + random() * 0.5));
      retry = setTimeout(() => {
        retry = undefined;
        ensureConnection();
      }, delay);
    }

    try {
      const stop = connect(currentSession.token, {
        onSubscriptionSent() { if (attempt === started) onSubscriptionSent(); },
        onSignal() {
          if (attempt !== started) return;
          failures = 0;
          onSignal();
        },
        onFailure,
      });
      if (attempt === started) started.stop = stop;
      else stop();
    } catch {
      onFailure("transport");
    }
  }

  function update(next: SignalSession | null, canConnect: boolean) {
    const sameAccount = next?.accountKey === session?.accountKey && next?.epoch === session?.epoch;
    const credentialsChanged = !sameAccount || next?.token !== session?.token || !Object.is(next?.expiresAt, session?.expiresAt);
    available = canConnect;
    if (credentialsChanged || !available) {
      clearTimeout(expires);
      clearRetry();
      stopAttempt();
    }
    if (credentialsChanged) {
      session = next;
      if (!sameAccount) {
        failures = 0;
        expiryRefreshAttempted = false;
      }
      setRejected(false);
    }
    ensureConnection();
  }

  return {
    update,
    retryRejected() {
      if (!rejected) return;
      setRejected(false);
      expiryRefreshAttempted = false;
      ensureConnection();
    },
  };
}

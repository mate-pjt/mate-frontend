import type { NotificationPage, NotificationsRepository } from "@/data/notifications/client";
import { ApiError } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";
import type { AlarmNotification } from "@/types/alarm";

type AccountScope = { accountKey: string; epoch: number };
type Snapshot = { scope: AccountScope | null; count: number | null; countFailed: boolean; requiresLogin: boolean };
type Inbox = {
  lastPage: () => number;
  apply: (page: PromiseSettledResult<NotificationPage>, count: PromiseSettledResult<number>) => void;
};
type InboxEntry = Inbox & { busy: boolean };
type Batch = { count: AbortController; list: AbortController | null; inbox: InboxEntry | null };
export type InboxSubscription = { setBusy: (busy: boolean) => void; discardCount: () => void; dispose: () => void };

const initialSnapshot: Snapshot = { scope: null, count: null, countFailed: false, requiresLogin: false };

export function uniqueNotifications(items: readonly AlarmNotification[]) {
  const seen = new Set<string>();
  return items.filter(({ id }) => {
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

export function createNotificationRefreshController(
  repository: Pick<NotificationsRepository, "getNotifications" | "getUnreadNotificationCount">,
  auth: AuthAccess & { getSessionEpoch: () => number },
  now = () => performance.now(),
) {
  const listeners = new Set<() => void>();
  let snapshot = initialSnapshot;
  let available = false;
  let focusLost = false;
  let inbox: InboxEntry | null = null;
  let running: Batch | null = null;
  let lastStart = -Infinity;
  let immediate = false;
  let signalDue: number | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;

  function publish(next: Snapshot) {
    snapshot = next;
    listeners.forEach((listener) => listener());
  }

  function current(scope: AccountScope) {
    return scope === snapshot.scope && auth.getAccountKey() === scope.accountKey && auth.getSessionEpoch() === scope.epoch;
  }

  function cancelBatch() {
    running?.count.abort();
    running?.list?.abort();
  }

  function pause() {
    clearTimeout(timer);
    immediate = false;
    signalDue = null;
    cancelBatch();
  }

  function schedule() {
    clearTimeout(timer);
    const scope = snapshot.scope;
    if (!scope || !current(scope) || !available || snapshot.requiresLogin || running || inbox?.busy) return;
    const at = now();
    const due = immediate ? at : signalDue;
    if (due === null) return;
    timer = setTimeout(() => {
      if (scope === snapshot.scope && available) void run(scope);
    }, Math.ceil(Math.max(0, lastStart + 1_000 - at, due - at)));
  }

  function request(fromSignal = false) {
    if (!available || !snapshot.scope || snapshot.requiresLogin) return;
    if (fromSignal) signalDue ??= now() + 500;
    else immediate = true;
    schedule();
  }

  function access(scope: AccountScope, signal: AbortSignal): AuthAccess {
    const assertRequestScope = () => {
      signal.throwIfAborted();
      if (!current(scope)) throw new DOMException("Alarm session ended", "AbortError");
    };
    return {
      ...auth,
      assertRequestScope,
      async getAccessToken() { assertRequestScope(); return auth.getAccessToken(); },
      async refresh(options) { assertRequestScope(); return auth.refresh(options); },
    };
  }

  async function getExpandedList(scope: AccountScope, through: number, signal: AbortSignal) {
    const requestAccess = access(scope, signal);
    const pages: NotificationPage[] = [];
    let latest: NotificationPage;
    do {
      signal.throwIfAborted();
      latest = await repository.getNotifications(requestAccess, pages.length, signal);
      pages.push(latest);
    } while (pages.length <= through && pages.length < latest.totalPages);

    const valid = pages.slice(0, latest.totalPages);
    return { ...latest, page: valid.at(-1)?.page ?? 0, items: uniqueNotifications(valid.flatMap(({ items }) => items)) };
  }

  function unauthorized(result: PromiseSettledResult<unknown> | null) {
    return result?.status === "rejected" && result.reason instanceof ApiError && result.reason.status === 401;
  }

  async function run(scope: AccountScope) {
    if (!current(scope) || snapshot.requiresLogin || running || inbox?.busy) return;
    lastStart = now();
    immediate = false;
    if (signalDue !== null && signalDue <= lastStart) signalDue = null;
    const batch: Batch = { count: new AbortController(), list: inbox && new AbortController(), inbox };
    running = batch;
    const getCount = async () => repository.getUnreadNotificationCount(access(scope, batch.count.signal), batch.count.signal);
    const [count, list] = await Promise.allSettled([
      getCount(),
      batch.list && batch.inbox ? getExpandedList(scope, batch.inbox.lastPage(), batch.list.signal) : null,
    ]);
    if (running !== batch) return;
    try {
      if (!current(scope) || !available || batch.count.signal.aborted) return;
      const activeList = batch.inbox && inbox === batch.inbox && !batch.list?.signal.aborted ? list : null;
      if (unauthorized(count) || unauthorized(activeList)) {
        publish({ scope, count: null, countFailed: false, requiresLogin: true });
        pause();
        return;
      }
      publish({ ...snapshot, count: count.status === "fulfilled" ? count.value : snapshot.count, countFailed: count.status === "rejected" });
      if (activeList?.status === "rejected") batch.inbox?.apply(activeList, count);
      else if (activeList?.value) batch.inbox?.apply({ status: "fulfilled", value: activeList.value }, count);
    } finally {
      if (running === batch) running = null;
      schedule();
    }
  }

  return {
    getSnapshot: () => snapshot,
    getServerSnapshot: () => initialSnapshot,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    setScope(scope: AccountScope | null) {
      if (snapshot.scope?.accountKey === scope?.accountKey && snapshot.scope?.epoch === scope?.epoch) return;
      pause();
      running = null;
      inbox = null;
      lastStart = -Infinity;
      publish({ ...initialSnapshot, scope });
      request();
    },
    setAvailable(value: boolean) {
      if (available === value) return;
      available = value;
      if (available) {
        // Returning to a visible, online document already covers the preceding blur.
        focusLost = false;
        request();
      } else pause();
    },
    request,
    onBlur() { focusLost = true; },
    requestOnFocus() {
      if (!focusLost) return;
      focusLost = false;
      request();
    },
    attachInbox(consumer: Inbox): InboxSubscription {
      const entry: InboxEntry = { ...consumer, busy: false };
      inbox = entry;
      request();
      return {
        setBusy(busy: boolean) {
          if (inbox !== entry || entry.busy === busy) return;
          entry.busy = busy;
          if (busy && running && !running.count.signal.aborted) {
            // A read or deletion can change both results while a page expansion changes the requested range.
            immediate = true;
            cancelBatch();
          }
          schedule();
        },
        discardCount() { if (inbox === entry) publish({ ...snapshot, count: null, countFailed: false }); },
        dispose() {
          if (inbox !== entry) return;
          inbox = null;
          if (running?.inbox === entry) running.list?.abort();
          schedule();
        },
      };
    },
  };
}

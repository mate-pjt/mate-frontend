export const BID_SEARCH_MAX_LENGTH = 100;

const MAX_RECENT_SEARCHES = 5;
const RETENTION_MS = 30 * 60_000;

export type RecentBidSearch = Readonly<{ query: string; submittedAt: number }>;

const emptySearches: readonly RecentBidSearch[] = [];

export function createRecentBidSearches(now = () => Date.now()) {
  const listeners = new Set<() => void>();
  let entries = emptySearches;
  let scope: string | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;

  function scheduleExpiration() {
    clearTimeout(timer);
    timer = undefined;
    if (entries.length > 0) {
      const expiresAt = Math.min(...entries.map((entry) => entry.submittedAt)) + RETENTION_MS;
      timer = setTimeout(expire, Math.max(0, expiresAt - now()));
    }
  }

  function replace(next: readonly RecentBidSearch[]) {
    entries = next.length > 0 ? next : emptySearches;
    scheduleExpiration();
    listeners.forEach((listener) => listener());
  }

  function expire() {
    const cutoff = now() - RETENTION_MS;
    const remaining = entries.filter((entry) => entry.submittedAt > cutoff);
    if (remaining.length < entries.length) replace(remaining);
    else scheduleExpiration();
  }

  function clear() {
    if (entries.length > 0) replace(emptySearches);
  }

  function setScope(nextScope: string | null) {
    if (scope === nextScope) return;
    scope = nextScope;
    clear();
  }

  function record(value: string) {
    const query = value.trim();
    if (scope === null || query.length === 0 || query.length > BID_SEARCH_MAX_LENGTH) return;
    const submittedAt = now();
    const cutoff = submittedAt - RETENTION_MS;
    const otherEntries = entries.filter((entry) => entry.query !== query && entry.submittedAt > cutoff);
    replace([{ query, submittedAt }, ...otherEntries].slice(0, MAX_RECENT_SEARCHES));
  }

  function select(entry: RecentBidSearch): boolean {
    expire();
    // An old rendered row must not be applied after expiration or a session change.
    if (!entries.includes(entry)) return false;
    record(entry.query);
    return true;
  }

  function remove(entry: RecentBidSearch) {
    expire();
    if (entries.includes(entry)) replace(entries.filter((item) => item !== entry));
  }

  return {
    clear, expire, record, remove, select, setScope,
    getSnapshot: () => entries,
    getServerSnapshot: () => emptySearches,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
  };
}

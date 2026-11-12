import type { PersonalFilterSnapshot, PersonalFilterValues } from "@/data/personal-filters/contracts";
import { hasPersonalConditions } from "./model";

type ApplyPort = {
  isCurrent: () => boolean;
  load: (signal: AbortSignal) => Promise<PersonalFilterSnapshot>;
  onSnapshot: (snapshot: PersonalFilterSnapshot) => void;
  onApply: (filter: PersonalFilterValues) => void;
  onEmpty: () => void;
  onError: (error: unknown) => void;
  onPending: (pending: boolean) => void;
};

export function createPersonalFilterApplyController(port: ApplyPort) {
  let active = true;
  let pending = false;
  let request: AbortController | null = null;
  const current = () => active && port.isCurrent();

  async function apply() {
    if (!current() || pending) return;
    pending = true;
    request = new AbortController();
    port.onPending(true);
    try {
      const latest = await port.load(request.signal);
      if (!current() || request.signal.aborted) return;
      port.onSnapshot(latest);
      if (hasPersonalConditions(latest.filter)) port.onApply(latest.filter);
      else port.onEmpty();
    } catch (error) {
      if (current() && !request.signal.aborted) port.onError(error);
    } finally {
      pending = false;
      request = null;
      port.onPending(false);
    }
  }

  return {
    apply,
    isCurrent: current,
    get pending() { return pending && current(); },
    dispose() {
      if (!active) return;
      active = false;
      request?.abort();
      if (pending) port.onPending(false);
    },
  };
}

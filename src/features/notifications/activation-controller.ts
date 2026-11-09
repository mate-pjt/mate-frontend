import { safeNotificationPath } from "@/lib/notification-path";
import type { AlarmNotification } from "@/types/alarm";

type ActivationPort = {
  getAccountKey: () => string | null;
  markRead: (id: string) => Promise<AlarmNotification>;
  onRead: (alarm: AlarmNotification) => void;
  onPending: (ids: readonly string[]) => void;
  onNotice: (message: string | null) => void;
  onError: (error: unknown, alarm: AlarmNotification) => void;
  clearError: () => void;
  navigate: (path: string) => void;
};

export function createNotificationActivationController(port: ActivationPort) {
  const account = port.getAccountKey();
  const pending = new Set<string>();
  const readResults = new Map<string, AlarmNotification>();
  let active = true;
  let intent = 0;
  let navigating = false;
  const current = () => active && account !== null && port.getAccountKey() === account;

  async function activate(alarm: AlarmNotification) {
    if (!current() || navigating || pending.has(alarm.id)) return;
    const startedIntent = ++intent;
    port.clearError();
    port.onNotice(null);
    let updated = readResults.get(alarm.id) ?? alarm;

    if (updated.unread) {
      pending.add(alarm.id);
      port.onPending([...pending]);
      try {
        updated = await port.markRead(alarm.id);
        if (!current()) return;
        readResults.set(alarm.id, updated);
        port.onRead(updated);
      } catch (error) {
        if (current() && startedIntent === intent) port.onError(error, alarm);
        return;
      } finally {
        pending.delete(alarm.id);
        if (current()) port.onPending([...pending]);
      }
    }

    // Other items may finish reading, but only the latest click may navigate or announce.
    if (!current() || startedIntent !== intent) return;
    const path = safeNotificationPath(updated.actionPath);
    if (!path) {
      port.onNotice("이 알림에서 이동할 수 있는 화면이 없어요. 알림 내용을 확인해 주세요.");
      return;
    }
    try {
      navigating = true;
      port.navigate(path);
    } catch {
      navigating = false;
      port.onError(new Error("대상 화면을 열지 못했어요. 다시 시도해 주세요."), updated);
    }
  }

  return { activate, dispose() { active = false; intent += 1; } };
}

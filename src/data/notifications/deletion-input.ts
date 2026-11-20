import { ApiError } from "../shared/errors";
import { MAX_NOTIFICATION_SELECTION, type NotificationDeletion } from "./contracts";

export function parseNotificationDeletion(deletion: NotificationDeletion) {
  const invalid = () => new ApiError(400, "C001", "삭제할 소식의 선택을 확인해 주세요.");
  if (deletion?.scope === "ALL" && Object.keys(deletion).length === 1) return { scope: "ALL" } as const;
  if (deletion?.scope !== "SELECTED" || Object.keys(deletion).length !== 2 || !Array.isArray(deletion.notificationIds) ||
    deletion.notificationIds.length < 1 || deletion.notificationIds.length > MAX_NOTIFICATION_SELECTION) throw invalid();

  const notificationIds = Array.from(deletion.notificationIds, (id) => {
    if (typeof id !== "string") throw invalid();
    const value = Number(id);
    if (!Number.isSafeInteger(value) || value < 1 || String(value) !== id) throw invalid();
    return value;
  });
  return { scope: "SELECTED", notificationIds } as const;
}

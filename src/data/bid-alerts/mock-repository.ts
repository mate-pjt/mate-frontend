import { ApiError } from "../shared/errors";
import { mockAccount, type MockRuntime } from "../mock/runtime";
import { isCount, isDate, isRecord } from "../mock/validation";
import type { BidAlertsRepository, BidNoticeAlertStatus } from "./contracts";

function valid(value: unknown): value is Record<string, BidNoticeAlertStatus> {
  return isRecord(value) && Object.values(value).every(item => isRecord(item) && isCount(item.bidNoticeId) && typeof item.active === "boolean" && (item.registeredAt === null || isDate(item.registeredAt)));
}
export function createMockBidAlertsRepository(runtime: MockRuntime): BidAlertsRepository {
  async function status(access: Parameters<BidAlertsRepository["getBidNoticeAlert"]>[0], id: string, active?: boolean, signal?: AbortSignal) {
    const account = await mockAccount(runtime, access, "bidAlerts", signal);
    if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) throw new ApiError(400, "BID_ID_INVALID", "공고 ID가 올바르지 않습니다.");
    const state = runtime.store.read<Record<string, BidNoticeAlertStatus>>(account, "bid-alerts", () => ({}), valid);
    const item = state[id] ?? { bidNoticeId: Number(id), active: false, registeredAt: null };
    if (active !== undefined) { item.active = active; item.registeredAt = active ? item.registeredAt ?? new Date(runtime.now()).toISOString() : null; state[id] = item; runtime.store.write(account, "bid-alerts", state); }
    return item;
  }
  return { getBidNoticeAlert: (access, id, signal) => status(access, id, undefined, signal), activateBidNoticeAlert: (access, id) => status(access, id, true), deactivateBidNoticeAlert: (access, id) => status(access, id, false) };
}

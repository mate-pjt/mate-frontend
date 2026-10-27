import { ApiError } from "../shared/errors";
import type { AuthAccess, HttpClient } from "../shared/http";
import type { BidNoticeAlertStatus, BidAlertsRepository } from "./contracts";

export function createHttpBidAlertsRepository(http: HttpClient): BidAlertsRepository {
  const authorizedRequest = http.authorized;
  function alertPath(bidNoticeId: string): string {
    return `/api/v1/me/bid-notice-alerts/${encodeURIComponent(bidNoticeId)}`;
  }

  async function requestAlertStatus(access: AuthAccess, bidNoticeId: string, method: "GET" | "PUT" | "DELETE", signal?: AbortSignal) {
    const result = await authorizedRequest<BidNoticeAlertStatus>(access, alertPath(bidNoticeId), { method, signal });
    if (
      String(result.bidNoticeId) !== bidNoticeId ||
      typeof result.active !== "boolean" ||
      (result.registeredAt !== null && typeof result.registeredAt !== "string")
    ) {
      throw new ApiError(200, "INVALID_ALERT_RESPONSE", "서버의 알림 상태를 확인하지 못했습니다. 다시 시도해 주세요.");
    }
    return result;
  }

  function getBidNoticeAlert(access: AuthAccess, bidNoticeId: string, signal?: AbortSignal) {
    return requestAlertStatus(access, bidNoticeId, "GET", signal);
  }

  function activateBidNoticeAlert(access: AuthAccess, bidNoticeId: string) {
    return requestAlertStatus(access, bidNoticeId, "PUT");
  }

  function deactivateBidNoticeAlert(access: AuthAccess, bidNoticeId: string) {
    return requestAlertStatus(access, bidNoticeId, "DELETE");
  }

  return { getBidNoticeAlert, activateBidNoticeAlert, deactivateBidNoticeAlert };
}

import type { AuthAccess } from "../shared/http";
export type BidNoticeAlertStatus = {
  bidNoticeId: number;
  active: boolean;
  registeredAt: string | null;
};

export interface BidAlertsRepository {
  getBidNoticeAlert(access: AuthAccess, bidNoticeId: string, signal?: AbortSignal): Promise<BidNoticeAlertStatus>;
  activateBidNoticeAlert(access: AuthAccess, bidNoticeId: string): Promise<BidNoticeAlertStatus>;
  deactivateBidNoticeAlert(access: AuthAccess, bidNoticeId: string): Promise<BidNoticeAlertStatus>;
}

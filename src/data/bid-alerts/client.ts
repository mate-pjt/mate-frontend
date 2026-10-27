import { getDataConfig } from "../config";
import { getMockRuntime } from "../mock/runtime";
import { getHttpClient } from "../shared/client";
import type { BidAlertsRepository } from "./contracts";
import { createHttpBidAlertsRepository } from "./http-repository";
import { createMockBidAlertsRepository } from "./mock-repository";
export type * from "./contracts";

let repository: BidAlertsRepository | null = null;
function getRepository(): BidAlertsRepository { return repository ??= getDataConfig().sources.bidAlerts === "mock" ? createMockBidAlertsRepository(getMockRuntime()) : createHttpBidAlertsRepository(getHttpClient()); }
export const getBidNoticeAlert: BidAlertsRepository["getBidNoticeAlert"] = (...args) => getRepository().getBidNoticeAlert(...args);
export const activateBidNoticeAlert: BidAlertsRepository["activateBidNoticeAlert"] = (...args) => getRepository().activateBidNoticeAlert(...args);
export const deactivateBidNoticeAlert: BidAlertsRepository["deactivateBidNoticeAlert"] = (...args) => getRepository().deactivateBidNoticeAlert(...args);

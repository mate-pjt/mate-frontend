import "server-only";

import { mockBidReader } from "./mock-reader";
import type { BidListQuery, BidReader } from "./contracts";

const bidReader: BidReader = mockBidReader;

export function getHomeBids() {
  return bidReader.getHomeBids();
}

export function getBidList(query: BidListQuery) {
  return bidReader.getBidList(query);
}

export function getBidDetail(bidId: string) {
  return bidReader.getBidDetail(bidId);
}

export function getBidFilterOptions() {
  return bidReader.getFilterOptions();
}

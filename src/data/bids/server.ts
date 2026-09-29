import "server-only";

import { cache } from "react";

import { httpBidDetailReader } from "./detail-http-reader";
import { httpBidListReader } from "./http-reader";
import type { BidDetailQuery, BidListQuery } from "./contracts";

export async function getHomeBids() {
  const result = await httpBidListReader.getBidList({
    view: "all",
    query: "",
    page: 1,
    size: 9,
  });
  return result.items;
}

export function getBidList(query: BidListQuery) {
  return httpBidListReader.getBidList(query);
}

const cachedBidDetail = cache((id: string, classificationNo: string | null, itemPage: number, resultId: string | null, participantsPage: number) =>
  httpBidDetailReader.getBidDetail({ id, classificationNo, itemPage, resultId, participantsPage }),
);

export function getBidDetail(query: BidDetailQuery) {
  return cachedBidDetail(query.id, query.classificationNo, query.itemPage, query.resultId, query.participantsPage);
}

export function getBidFilterOptions() {
  return httpBidListReader.getFilterOptions();
}

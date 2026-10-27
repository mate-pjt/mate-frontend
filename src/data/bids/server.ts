import "server-only";

import { cache } from "react";

import { getDataConfig } from "../config";
import { createHttpBidDetailRepository } from "./detail-http-repository";
import { createHttpBidListRepository } from "./http-repository";
import { createMockBidRepository } from "./mock-repository";
const getRepositories = cache(() => {
  const config = getDataConfig();
  const mock = config.sources.bids === "mock" ? createMockBidRepository(Date.now, config.scenarios.bids) : null;
  return { list: mock ?? createHttpBidListRepository(config.apiEnvironment), detail: mock ?? createHttpBidDetailRepository(config.apiEnvironment) };
});
import type { BidDetailQuery, BidListQuery } from "./contracts";

export async function getHomeBids() {
  const result = await getRepositories().list.getBidList({
    view: "all",
    query: "",
    page: 1,
    size: 9,
  });
  return result.items;
}

export function getBidList(query: BidListQuery) {
  return getRepositories().list.getBidList(query);
}

const cachedBidDetail = cache((id: string, classificationNo: string | null, itemPage: number, resultId: string | null, participantsPage: number) =>
  getRepositories().detail.getBidDetail({ id, classificationNo, itemPage, resultId, participantsPage }),
);

export function getBidDetail(query: BidDetailQuery) {
  return cachedBidDetail(query.id, query.classificationNo, query.itemPage, query.resultId, query.participantsPage);
}

export function getBidFilterOptions() {
  return getRepositories().list.getFilterOptions();
}

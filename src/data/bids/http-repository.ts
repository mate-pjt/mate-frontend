import "server-only";

import { cache } from "react";

import type { BidListRepository, BidListQuery } from "./contracts";
import { currentBidDateFilter } from "@/features/bid-notice-filters/date-filter";
import { bidAmountUrlKeys, currentBidAmountFilter } from "@/features/bid-notice-filters/amount-filter";
import {
  findContractMethodCode,
  findIndustryCode,
  findRegionCode,
  mapBidFilterOptions,
  mapBidListResult,
} from "./api-mapper";
import type {
  BidNoticeListDto,
  BidNoticeListViewDto,
  BidTypeDto,
  CommonResponse,
  IndustrySearchDto,
  RegionMetadataListDto,
} from "./api-types";



const viewCodes: Record<Exclude<BidListQuery["view"], "recommended">, BidNoticeListViewDto> = {
  all: "ALL",
  closing: "CLOSING_SOON",
  result: "RESULT",
};

const bidTypeCodes: Record<NonNullable<BidListQuery["category"]>, BidTypeDto> = {
  construction: "CONSTRUCTION",
  service: "SERVICE",
  purchase: "GOODS",
};

export function createHttpBidListRepository(apiBaseUrl: string, fetcher: typeof fetch = (...args) => fetch(...args)): BidListRepository {
  const loadFilterMetadata = cache(async () => {
    const [regions, industries] = await Promise.all([
      getData<RegionMetadataListDto>("/api/v1/regions"),
      getData<IndustrySearchDto>("/api/v1/industries"),
    ]);
    return { regions, industries };
  });

  const repository: BidListRepository = {
    async getBidList(query) {
      if (query.view === "recommended") {
        throw new Error("맞춤 입찰공고 목록 API는 준비 중입니다.");
      }
      if (query.agency) {
        throw new Error("기관 단독 필터는 아직 지원하지 않습니다.");
      }
      const dates = currentBidDateFilter(query);
      const amounts = currentBidAmountFilter(query);

      const params = new URLSearchParams({
        view: viewCodes[query.view],
        page: String(query.page - 1),
        size: String(query.size),
        sort: query.view === "result" ? "openAt,desc" : "bidCloseAt,asc",
      });
      if (query.query) params.set("keyword", query.query);
      if (query.personalFilter && query.view === "all") {
        const filter = query.personalFilter;
        for (const key of ["bidTypes", "regionCodes", "industryCodes", "contractMethods"] as const) {
          filter[key].forEach((value) => params.append(key, value));
        }
        params.set("regionOnly", String(filter.regionOnly));
        params.set("jointContract", filter.jointContract);
      } else {
        if (query.category) params.set("bidTypes", bidTypeCodes[query.category]);
        if (query.contract) params.set("contractMethods", findContractMethodCode(query.contract));

        if (query.region || query.industry) {
          const { regions, industries } = await loadFilterMetadata();
          if (query.region) params.set("regionCodes", findRegionCode(query.region, regions));
          if (query.industry) params.set("industryCodes", findIndustryCode(query.industry, industries));
        }
      }

      for (const key of ["dateType", "dateFrom", "dateTo"] as const) {
        if (dates[key] !== null) params.set(key, dates[key]);
      }
      for (const key of bidAmountUrlKeys) {
        if (amounts[key] !== null) params.set(key, String(amounts[key]));
      }

      const result = await getData<BidNoticeListDto>(`/api/v1/bid-notices?${params}`);
      return mapBidListResult(result);
    },

    async getFilterOptions() {
      const { regions, industries } = await loadFilterMetadata();
      return mapBidFilterOptions(regions, industries);
    },
  };

  async function getData<T>(path: string): Promise<T> {
    let response: Response;
    try {
      response = await fetcher(`${apiBaseUrl}${path}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
    } catch {
      throw new Error("입찰공고 서버에 연결하지 못했습니다.");
    }

    const payload = await response.json().catch(() => null) as CommonResponse<T> | null;
    if (!response.ok || payload?.isSuccess !== true || payload.data == null) {
      throw new Error("입찰공고 정보를 불러오지 못했습니다.");
    }
    return payload.data;
  }

  return repository;
}

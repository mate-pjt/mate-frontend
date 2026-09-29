import "server-only";

import { cache } from "react";

import type { BidReader, BidListQuery } from "./contracts";
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

const apiBaseUrl =
  process.env.NEXT_PUBLIC_MATE_API_BASE_URL?.replace(/\/+$/, "") || "https://api-test.mate-bid.com";

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

const amountRanges: Record<string, { min?: number; max?: number }> = {
  "1억 원 이하": { max: 100_000_000 },
  "1억 ~ 10억 원 이하": { min: 100_000_001, max: 1_000_000_000 },
  "10억 ~ 50억 원 이하": { min: 1_000_000_001, max: 5_000_000_000 },
  "50억 ~ 100억 원 이하": { min: 5_000_000_001, max: 10_000_000_000 },
  "100억 원+": { min: 10_000_000_001 },
};

const loadFilterMetadata = cache(async () => {
  const [regions, industries] = await Promise.all([
    getData<RegionMetadataListDto>("/api/v1/regions"),
    getData<IndustrySearchDto>("/api/v1/industries"),
  ]);
  return { regions, industries };
});

export const httpBidListReader: Pick<BidReader, "getBidList" | "getFilterOptions"> = {
  async getBidList(query) {
    if (query.view === "recommended") {
      throw new Error("맞춤 입찰공고 목록 API는 준비 중입니다.");
    }
    if (query.agency) {
      throw new Error("기관 단독 필터는 아직 지원하지 않습니다.");
    }

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
      for (const key of ["dateType", "dateFrom", "dateTo", "amountType", "amountMin", "amountMax"] as const) {
        const value = filter[key];
        if (value !== null) params.set(key, String(value));
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

      if (query.period && query.view !== "closing") {
        const today = currentKstDate();
        const months = { "1개월": 1, "3개월": 3, "6개월": 6, "1년": 12 }[query.period];
        if (months) {
          params.set("dateFrom", monthsBefore(today, months));
          if (query.view === "result") params.set("dateTo", today);
          else params.set("dateType", "BID_BEGIN");
        }
      }

      if (query.amount && query.view !== "result") {
        const range = amountRanges[query.amount];
        if (range) {
          params.set("amountType", "BASE_PRICE");
          if (range.min !== undefined) params.set("amountMin", String(range.min));
          if (range.max !== undefined) params.set("amountMax", String(range.max));
        }
      }
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
    response = await fetch(`${apiBaseUrl}${path}`, {
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

function currentKstDate(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function monthsBefore(date: string, months: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const firstDay = new Date(Date.UTC(year, month - 1 - months, 1));
  const lastDay = new Date(Date.UTC(firstDay.getUTCFullYear(), firstDay.getUTCMonth() + 1, 0)).getUTCDate();
  firstDay.setUTCDate(Math.min(day, lastDay));
  return firstDay.toISOString().slice(0, 10);
}

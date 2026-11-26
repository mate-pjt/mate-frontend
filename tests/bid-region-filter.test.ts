import { describe, expect, it, vi } from "vitest";

import { readBidListState } from "@/components/bids/bid-list-model";
import { currentPersonalFilter } from "@/components/bids/personal-filter-adapter";
import { mapBidFilterOptions } from "@/data/bids/api-mapper";
import type { BidView } from "@/data/bids/contracts";
import { createHttpBidListRepository } from "@/data/bids/http-repository";
import { createMockBidEntries, createMockBidRepository, mockBidOptions } from "@/data/bids/mock-repository";
import { emptyPersonalFilter, readPersonalFilterParams, writePersonalFilterParams } from "@/features/bid-notice-filters/model";
import { emptyBidRegionFilter, readBidRegionParams, writeBidRegionParams } from "@/features/bid-notice-filters/region-filter";
import { ok, testNow } from "./helpers";

const base = { view: "all", query: "", page: 1, size: 10 } as const;
const views = [["all", "ALL", "bidCloseAt,asc"], ["closing", "CLOSING_SOON", "bidCloseAt,asc"], ["result", "RESULT", "openAt,desc"]] as const;
const options = {
  items: [
    { code: "11", name: "서울", fullName: "서울특별시", parentCode: null, depth: 1 },
    { code: "District-A", name: "종로구", fullName: "서울특별시 종로구", parentCode: "11", depth: 2 },
  ],
};
const emptyIndustries = { items: [], totalCount: 0 };
const responsePage = { items: [], page: 1, size: 20, totalElements: 31, totalPages: 2, hasNext: false };

describe("지역 선택지와 URL", () => {
  it("표시 이름과 코드, 자릿수와 무관한 상위 지역 관계를 보존한다", () => {
    const regions = mapBidFilterOptions(options, emptyIndustries).regionOptions;
    expect(regions[1]).toEqual({ code: "District-A", name: "종로구", label: "서울특별시 종로구", parentCode: "11", depth: 2 });
    expect(() => mapBidFilterOptions({ items: [options.items[1]] }, emptyIndustries)).toThrow("상위 관계");
    expect(() => mapBidFilterOptions({ items: [options.items[0], options.items[0]] }, emptyIndustries)).toThrow("상위 관계");
    expect(() => mapBidFilterOptions({ items: [options.items[0], { ...options.items[1], depth: 1 }] }, emptyIndustries)).toThrow("상위 관계");
  });

  it("최대 50개의 서로 다른 코드와 기존 ALL 개인 URL을 왕복하고 다른 조건을 보존한다", () => {
    const regionFilter = { regionCodes: Array.from({ length: 50 }, (_, i) => `region_${i}`), regionOnly: true, jointContract: "AVAILABLE" as const };
    const params = new URLSearchParams("query=합성&amountType=BASE_PRICE&amountMin=10");
    writeBidRegionParams(params, { ...regionFilter, regionCodes: [...regionFilter.regionCodes, regionFilter.regionCodes[0]] });
    params.append("regionCodes", regionFilter.regionCodes[0]);
    expect(readBidRegionParams(params)).toEqual({ regionFilter });
    expect(params.get("query")).toBe("합성");
    expect(params.get("amountMin")).toBe("10");
    const personal = { ...emptyPersonalFilter(), ...regionFilter, bidTypes: ["GOODS" as const] };
    writePersonalFilterParams(params, personal);
    expect(readPersonalFilterParams(params)).toEqual(personal);
    expect(readBidListState(params)).toMatchObject({ personalFilter: personal, regionError: undefined });
    params.set("view", "closing");
    expect(readBidListState(params)).toMatchObject({ personalFilter: undefined, regionFilter: undefined });
    params.delete("personal");
    expect(readBidListState(params).regionFilter).toEqual(regionFilter);
    writeBidRegionParams(params, emptyBidRegionFilter());
    expect(readBidRegionParams(params)).toEqual({});
    expect(params.get("view")).toBe("closing");
  });

  it("공개 지역 조건의 ALL 맞춤 동등성 비교와 구형 단일 라벨을 유지한다", () => {
    const legacy = readBidListState(new URLSearchParams("region=서울특별시"));
    expect(currentPersonalFilter(legacy, mockBidOptions).regionCodes).toEqual(["11"]);
    const modern = readBidListState(new URLSearchParams("region=부산광역시&regionCodes=11&regionCodes=11110&regionOnly=true&jointContract=REQUIRED"));
    expect(modern.region).toBeUndefined();
    expect(currentPersonalFilter(modern, mockBidOptions)).toMatchObject({ regionCodes: ["11", "11110"], regionOnly: true, jointContract: "REQUIRED" });
  });

  it.each([
    "regionOnly=true", "region=서울특별시&regionOnly=true", "personal=1&regionCodes=&regionOnly=true",
    "regionCodes=11%20", "regionCodes=서울", "regionCodes=11,26", "regionCodes=abcdefghijklmnopqrstu", "regionCodes=11%0A",
    "regionOnly=1", "regionOnly=false&regionOnly=true", "jointContract=", "jointContract=OPTIONAL", "jointContract=ALL&jointContract=REQUIRED",
    Array.from({ length: 51 }, (_, i) => `regionCodes=${i}`).join("&"),
  ])("잘못된 지역 URL에서 공개 조회를 발행하지 않는다: %s", async (search) => {
    const query = readBidListState(new URLSearchParams(search));
    expect(query.regionError).toBeTruthy();
    const fetcher = vi.fn<typeof fetch>();
    await expect(createHttpBidListRepository("https://synthetic.test", fetcher).getBidList(query)).rejects.toThrow(query.regionError);
    await expect(createMockBidRepository(() => testNow).getBidList(query)).rejects.toThrow(query.regionError);
    expect(fetcher).not.toHaveBeenCalled();
  });
});

describe("공개 목록 지역·공동도급 조건", () => {
  it.each(views)("%s는 원래의 공고 종류·페이지·정렬과 반복 지역 코드 조건을 보낸다", async (view, apiView, sort) => {
    const params = new URLSearchParams({ view, query: "합성", category: "purchase", page: "2", size: "20" });
    writeBidRegionParams(params, { regionCodes: ["11", "District-A", "11"], regionOnly: true, jointContract: "AVAILABLE" });
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok(responsePage));
    const result = await createHttpBidListRepository("https://synthetic.test", fetcher).getBidList(readBidListState(params));
    expect(result).toMatchObject({ totalCount: 31, page: 2, size: 20 });
    expect(fetcher).toHaveBeenCalledTimes(1);
    const [input, init] = fetcher.mock.calls[0];
    const sent = new URL(String(input)).searchParams;
    expect(sent.getAll("regionCodes")).toEqual(["11", "District-A"]);
    expect(Object.fromEntries(sent)).toMatchObject({ view: apiView, sort, keyword: "합성", bidTypes: "GOODS", page: "1", size: "20", regionOnly: "true", jointContract: "AVAILABLE" });
    expect(sent.has("personal")).toBe(false);
    expect(init).toMatchObject({ cache: "no-store", credentials: "omit" });
  });

  it("구형 단일 라벨은 metadata의 상위 코드로 보내고 공동도급만 별도로 전송할 수 있다", async () => {
    const fetcher = vi.fn<typeof fetch>(async input => {
      const { pathname } = new URL(String(input));
      return ok(pathname.endsWith("/regions") ? options : pathname.endsWith("/industries") ? emptyIndustries : responsePage);
    });
    const repo = createHttpBidListRepository("https://synthetic.test", fetcher);
    await repo.getBidList({ ...base, region: "서울특별시" });
    expect(new URL(String(fetcher.mock.calls.at(-1)?.[0])).searchParams.getAll("regionCodes")).toEqual(["11"]);
    await repo.getBidList({ ...base, regionFilter: { ...emptyBidRegionFilter(), jointContract: "REQUIRED" } });
    const jointOnly = new URL(String(fetcher.mock.calls.at(-1)?.[0])).searchParams;
    expect(jointOnly.get("jointContract")).toBe("REQUIRED");
    expect(jointOnly.has("regionCodes")).toBe(false);
  });

  it.each(views)("%s mock은 계층·OR·AND와 확인된 제한 없음, 공동도급 배타 집합을 페이지 전에 적용한다", async (view) => {
    const repo = createMockBidRepository(() => testNow, "default", fixtures(view));
    const search = { ...base, view };
    const tags = (ids: number[]) => (view === "result" ? [...ids].reverse() : ids).map(id => String(31_000 + id));
    const district = { ...emptyBidRegionFilter(), regionCodes: ["11110"] };
    const regionIds = async (regionFilter: typeof district) => (await repo.getBidList({ ...search, regionFilter })).items.map(item => item.id);
    expect(await regionIds(district)).toEqual(tags([0, 2, 3, 7]));
    expect(await regionIds({ ...district, regionOnly: true })).toEqual(tags([0, 2, 7]));
    expect(await regionIds({ ...district, regionCodes: ["11"], regionOnly: true })).toEqual(tags([0, 1, 2, 7]));
    expect(await regionIds({ ...district, regionCodes: ["111"], regionOnly: false })).toEqual([]);
    expect(await regionIds({ ...emptyBidRegionFilter(), jointContract: "REQUIRED" })).toEqual(tags([0, 4]));
    expect(await regionIds({ ...emptyBidRegionFilter(), jointContract: "AVAILABLE" })).toEqual(tags([1, 2, 5, 6]));
    const regionFilter = { ...district, regionCodes: ["11110", "26110"], regionOnly: true, jointContract: "AVAILABLE" as const };
    const result = await repo.getBidList({ ...search, regionFilter, size: 1, page: 2 });
    expect(result).toMatchObject({ totalCount: 2, size: 1, page: 2 });
    expect(result.items.map(item => item.id)).toEqual(tags([2, 6]).slice(1));
    expect((await repo.getBidList({ ...search, regionFilter, query: "CASE-6" })).items.map(item => item.id)).toEqual(tags([6]));
  });
});

function fixtures(view: BidView) {
  const seed = createMockBidEntries(testNow)[view === "result" ? 3 : 0];
  const states = [
    ["11110", "known", true, "공동이행"], ["11680", "known", false, "공동이행"], ["11", "known", false, "공동이행"],
    ["26", "unrestricted", false, null], ["11110", "pending", true, "공동이행"], ["11110", "failed", false, "공동이행"],
    ["26110", "known", false, "공동이행"], ["11110", "known", false, null],
  ] as const;
  return states.map(([regionCode, regionState, jointRequired, method], index) => {
    const id = String(31_000 + index);
    const schedule = { ...seed.bid.schedule };
    for (const key of ["bidCloseAt", "openAt"] as const) {
      schedule[key] = new Date(Date.parse(schedule[key]!) + index * 60_000).toISOString();
    }
    return {
      ...seed, regionCode, jointRequired,
      item: { ...seed.item, id, noticeNumber: `CASE-${index}` },
      bid: { ...seed.bid, id, schedule, eligibility: { ...seed.bid.eligibility, regionState }, jointSupply: { ...seed.bid.jointSupply, method } },
    };
  });
}

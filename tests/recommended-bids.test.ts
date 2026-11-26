import { describe, expect, it, vi } from "vitest";

import { bidListLocationParams, readBidListState } from "@/components/bids/bid-list-model";
import { createHttpBidListRepository } from "@/data/bids/http-repository";
import { readRecommendedBidFilter } from "@/features/bids/recommended-bid-filter";
import { emptyPersonalFilter } from "@/features/bid-notice-filters/model";
import { bidDetailHref } from "@/lib/bid-detail-url";

import { ok } from "./helpers";
import wire from "../tools/qa/bid-wire-fixtures.json";

const query = { view: "all" as const, query: "", page: 1, size: 10 };

describe("맞춤 공고 조건과 URL", () => {
  it.each([
    {}, { dateType: "BID_CLOSE" }, { amountType: "BASE_PRICE" },
    { dateType: "BID_BEGIN", amountType: "ESTIMATED_PRICE" },
  ])("빈 조건과 범위 종류만 있는 조건에서 공개 목록을 준비하지 않는다 (%j)", (values) => {
    expect(readRecommendedBidFilter({ ...emptyPersonalFilter(), ...values })).toBeNull();
  });

  it("허용된 조건만 복사하고 열린 날짜 및 금액 0을 보존한다", () => {
    const filter = readRecommendedBidFilter({
      ...emptyPersonalFilter(), bidTypes: ["SERVICE", "GOODS"], regionCodes: ["11"], regionOnly: true,
      dateType: "BID_CLOSE", dateTo: "2028-02-29", amountType: "BASE_PRICE", amountMin: 0, jointContract: "AVAILABLE",
      unrelated: "synthetic",
    });
    expect(filter).toEqual({
      ...emptyPersonalFilter(), bidTypes: ["SERVICE", "GOODS"], regionCodes: ["11"], regionOnly: true,
      dateType: "BID_CLOSE", dateTo: "2028-02-29", amountType: "BASE_PRICE", amountMin: 0, jointContract: "AVAILABLE",
    });
  });

  it.each([
    { bidTypes: undefined }, { bidTypes: ["WORKS"] }, { regionCodes: [" "] }, { jointContract: ["ALL"] },
    { regionOnly: true }, { dateType: "BID_CLOSE", dateFrom: "2027-02-29" }, { dateFrom: "" },
    { dateFrom: "2028-06-01" }, { dateType: "BID_CLOSE", dateFrom: "2028-10-01", dateTo: "2028-09-30" },
    { amountMax: 0 }, { amountType: "BASE_PRICE", amountMin: 10, amountMax: 0 },
  ])("손상 조건을 빈 값으로 삼키지 않는다 (%j)", (values) => {
    expect(() => readRecommendedBidFilter({ ...emptyPersonalFilter(), ...values })).toThrow();
  });

  it("추천 주소에 개인·공개 필터를 섞지 않고 검색, 페이지, 크기만 보존한다", () => {
    const params = new URLSearchParams("view=recommended&query=+장비+&page=2&size=20&personal=1&bidTypes=GOODS&category=service&agency=local&amountMin=1&successfulBidAmountMax=10");
    const location = readBidListState(params);
    expect(location).toEqual({ view: "recommended", query: "장비", page: 2, size: 20 });
    expect(Object.fromEntries(bidListLocationParams(location))).toEqual({ view: "recommended", query: "장비", page: "2", size: "20" });
    expect(bidListLocationParams(readBidListState(new URLSearchParams("view=recommended&page=0&size=9"))).toString()).toBe("view=recommended");
  });
});

describe("맞춤 조건으로 조회하는 공개 ALL", () => {
  it("빈 유형에 공사를 추가하지 않고 서버 순서·분류·null 금액·페이지를 사용한다", async () => {
    const condition = readRecommendedBidFilter({ ...emptyPersonalFilter(), industryCodes: ["0001", "0036"], amountType: "ESTIMATED_PRICE", amountMin: 0 });
    if (!condition) throw new Error("합성 검색 조건이 필요합니다.");
    const item = { ...wire.bidList.items[0], estimatedPrice: null, basePrice: 100 };
    const items = ["2", "10"].map(bidClsfcNo => ({
      ...item, row: { kind: "CLASSIFICATION", bidClsfcNo, knownClassificationCount: 2, baseAmount: null },
    }));
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok({ items, page: 1, size: 10, totalElements: 12, totalPages: 2, hasNext: false }));
    const controller = new AbortController();
    const result = await createHttpBidListRepository("https://synthetic.test", fetcher)
      .getBidList({ ...query, query: "장비", page: 2, personalFilter: condition }, controller.signal);
    const [[url, options]] = fetcher.mock.calls;
    const params = new URL(String(url)).searchParams;

    expect(Object.fromEntries(params)).toMatchObject({ view: "ALL", keyword: "장비", page: "1", size: "10", sort: "bidCloseAt,asc", amountMin: "0" });
    expect(params.getAll("industryCodes")).toEqual(["0001", "0036"]);
    expect(params.has("bidTypes")).toBe(false);
    expect(options).toMatchObject({ credentials: "omit", cache: "no-store", signal: controller.signal, headers: { Accept: "application/json" } });
    expect(new Headers(options?.headers).has("Authorization")).toBe(false);
    expect(result).toMatchObject({ page: 2, totalCount: 12, items: [{ baseAmount: null }, { baseAmount: null }] });
    expect(result.items.map(row => bidDetailHref(row.id, row.classificationNo))).toEqual([`/bids/${item.id}?bidClsfcNo=2`, `/bids/${item.id}?bidClsfcNo=10`]);
  });

  it.each([
    { items: [], page: 0, size: 10, totalElements: 0, totalPages: 0 },
    { items: wire.bidList.items, page: 0, size: 10, totalElements: 0, totalPages: 0, hasNext: false },
    { ...wire.bidList, items: [{ ...wire.bidList.items[0], row: { kind: "CLASSIFICATION", knownClassificationCount: 1 } }] },
  ])("손상 페이지나 분류 행을 검색 0건으로 변환하지 않는다", async (data) => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok(data));
    await expect(createHttpBidListRepository("https://synthetic.test", fetcher).getBidList(query)).rejects.toThrow();
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});

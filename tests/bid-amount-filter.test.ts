import { describe, expect, it, vi } from "vitest";
import type { BidAmountFilter, BidListQuery } from "@/data/bids/contracts";
import { readBidListState } from "@/components/bids/bid-list-model";
import { changePersonalFilter, currentPersonalFilter } from "@/components/bids/personal-filter-adapter";
import { createHttpBidListRepository } from "@/data/bids/http-repository";
import { createMockBidEntries, createMockBidRepository, mockBidOptions } from "@/data/bids/mock-repository";
import { memoryStorage } from "@/data/mock/store";
import { createMockPersonalFiltersRepository } from "@/data/personal-filters/mock-repository";
import { bidAmountDraft, bidAmountFilterError, bidAmountPresets, bidAmountTypes, bidAmountUrlKeys, currentBidAmountFilter, emptyBidAmountFilter, formatBidAmount, normalizeBidAmountFilter, parseBidAmountDraft, presetBidAmountFilter, writeBidAmountParams } from "@/features/bid-notice-filters/amount-filter";
import { emptyPersonalFilter, readPersonalFilterParams, writePersonalFilterParams } from "@/features/bid-notice-filters/model";
import { access, mockRuntime, ok } from "./helpers";

const query: BidListQuery = { view: "all", query: "", page: 1, size: 10 };
const range: BidAmountFilter = { amountType: "ESTIMATED_PRICE", amountMin: 0, amountMax: Number.MAX_SAFE_INTEGER };
const page = { items: [], page: 0, size: 10, totalElements: 0, totalPages: 0, hasNext: false };

describe("금액 정책·원 입력과 URL", () => {
  it.each([0, 1, 99_999_999, 100_000_000, 100_000_001, 10_000_000_001, Number.MAX_SAFE_INTEGER])("정수 %s원의 입력/표시/URL 왕복에 손실이 없다", value => {
    const filter = { ...range, amountMin: value, amountMax: value };
    expect(parseBidAmountDraft(bidAmountDraft(filter))).toEqual({ amountFilter: filter, amountError: undefined });
    expect(formatBidAmount(value).replaceAll(",", "")).toBe(`${value}원`);
    const params = new URLSearchParams("query=합성&page=2&dateType=BID_CLOSE&dateTo=2030-06-01");
    writeBidAmountParams(params, filter);
    const state = readBidListState(params);
    expect(state).toMatchObject({ amountFilter: filter, amountError: undefined, query: "합성", page: 2, dateFilter: { dateType: "BID_CLOSE", dateTo: "2030-06-01" } });
    expect(currentPersonalFilter(state, mockBidOptions)).toMatchObject(filter);
  });
  it.each(["-1", "1.5", "1e8", "0x10", "1,000", " 1", "１", "NaN", "Infinity", "9007199254740992", "9007199254740993", "9999999999999999999999999999999999"])("잘못된 입력 %s는 원문을 보존하고 일반/개인 URL 조회를 막는다", value => {
    for (const prefix of ["", "personal=1&"]) {
      const params = new URLSearchParams(`${prefix}amountType=BASE_PRICE&amountMin=${encodeURIComponent(value)}&amount=1억 원 이하`);
      const state = readBidListState(params);
      expect(state.amountError).toBeTruthy(); expect(state.amountDraft?.amountMin).toBe(value);
      expect(state.amount).toBeUndefined(); expect(() => currentBidAmountFilter(state)).toThrow();
    }
  });
  it.each(["amountMin=0", "amountType=AWARD_PRICE&amountMin=0", "amountType=BASE_PRICE&amountMin=2&amountMax=1", "amountType=BASE_PRICE&amountMin=0&amountMin=1", "amountType=BASE_PRICE&amountType=ESTIMATED_PRICE&amountMin=0"])("형식/종류/역전/중복 URL은 무시하지 않는다: %s", search => {
    expect(readBidListState(new URLSearchParams(search)).amountError).toBeTruthy();
  });
  it("0과 null·열린/동일 범위·양쪽 해제를 구별한다", () => {
    for (const filter of [range, { ...range, amountMin: null }, { ...range, amountMax: null }, { ...range, amountMax: 0 }]) expect(bidAmountFilterError(filter)).toBeUndefined();
    expect(formatBidAmount(null)).toBe("제한 없음"); expect(formatBidAmount(0)).toBe("0원");
    expect(normalizeBidAmountFilter({ ...emptyBidAmountFilter(), amountType: "BASE_PRICE" })).toEqual(emptyBidAmountFilter());
    const params = new URLSearchParams("amountType=BASE_PRICE&amountMin=0"); writeBidAmountParams(params, emptyBidAmountFilter());
    expect(bidAmountUrlKeys.every(key => !params.has(key))).toBe(true);
  });
  it.each(bidAmountTypes)("%s 종류와 기존 preset의 정확한 경계를 유지한다", amountType => {
    const bounds = [[null, 100_000_000], [100_000_001, 1_000_000_000], [1_000_000_001, 5_000_000_000], [5_000_000_001, 10_000_000_000], [10_000_000_001, null]];
    Object.keys(bidAmountPresets).forEach((preset, i) => {
      const expected = { amountType, amountMin: bounds[i][0], amountMax: bounds[i][1] };
      expect(presetBidAmountFilter(preset, amountType)).toEqual(expected);
      expect(changePersonalFilter({ ...emptyPersonalFilter(), amountType }, "amount", preset, mockBidOptions)).toMatchObject(expected);
    });
    expect(presetBidAmountFilter("1억 원 이하").amountType).toBe("BASE_PRICE");
  });
  it.each(bidAmountTypes)("기존 Repository의 %s 저장/재조회와 최신 GET→URL 경계를 유지한다", async amountType => {
    const storage = memoryStorage(), repo = createMockPersonalFiltersRepository(mockRuntime(storage));
    const filter = { ...emptyPersonalFilter(), ...range, amountType };
    const saved = await repo.savePersonalFilter(access, null, filter);
    const latest = await createMockPersonalFiltersRepository(mockRuntime(storage)).getPersonalFilter(access);
    expect(latest).toEqual(saved);
    const params = new URLSearchParams(); writePersonalFilterParams(params, latest.filter);
    expect(readPersonalFilterParams(params)).toEqual(filter); expect(currentBidAmountFilter(readBidListState(params))).toEqual({ ...range, amountType });
  });
  it("직접 범위는 legacy preset보다 우선하며 RESULT에서는 전송하지 않는다", () => {
    const params = new URLSearchParams("amount=1억 원 이하&amountType=ESTIMATED_PRICE&amountMin=0&amountMax=0");
    expect(currentBidAmountFilter(readBidListState(params))).toEqual({ ...range, amountMax: 0 });
    params.set("view", "closing"); expect(currentBidAmountFilter(readBidListState(params))).toEqual({ ...range, amountMax: 0 });
    params.set("view", "result");
    const result = readBidListState(params);
    expect(result.amountFilter).toBeUndefined(); expect(result.amountError).toBeUndefined(); expect(result.amount).toBeUndefined();
    expect(currentBidAmountFilter({ ...query, view: "result", amountFilter: range })).toEqual(emptyBidAmountFilter());
  });
});

describe("HTTP 대역 계약", () => {
  it.each(["all", "closing"] as const)("%s의 원 단위·종류·페이지·날짜를 정확히 전송한다", async view => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok(page));
    const repo = createHttpBidListRepository("https://synthetic.test", fetcher);
    await repo.getBidList({ ...query, view, page: 2, query: "합성", amountFilter: range, dateFilter: { dateType: "BID_CLOSE", dateFrom: "2030-06-01", dateTo: null } });
    const params = new URL(String(fetcher.mock.calls[0][0])).searchParams;
    expect(Object.fromEntries(params)).toMatchObject({ view: view === "all" ? "ALL" : "CLOSING_SOON", page: "1", keyword: "합성", amountType: "ESTIMATED_PRICE", amountMin: "0", amountMax: "9007199254740991", sort: "bidCloseAt,asc" });
    expect(params.has("dateType")).toBe(view === "all");
    expect(["personal", "amount", "estimatedPriceMin", "successfulBidAmountMin"].every(key => !params.has(key))).toBe(true);
  });
  it("개인 조건·열린 범위·RESULT 무전송과 서버 오류를 구별한다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockImplementation(async () => ok(page)), repo = createHttpBidListRepository("https://synthetic.test", fetcher);
    await repo.getBidList({ ...query, personalFilter: { ...emptyPersonalFilter(), ...range, amountMax: null } });
    const personal = new URL(String(fetcher.mock.calls[0][0])).searchParams;
    expect(personal.get("amountMin")).toBe("0"); expect(personal.has("amountMax")).toBe(false);
    await repo.getBidList({ ...query, view: "result", amountFilter: range, personalFilter: { ...emptyPersonalFilter(), ...range } });
    expect(bidAmountUrlKeys.every(key => !new URL(String(fetcher.mock.calls[1][0])).searchParams.has(key))).toBe(true);
    fetcher.mockResolvedValue(ok(null, 503));
    await expect(repo.getBidList({ ...query, amountFilter: range })).rejects.toThrow();
    expect(fetcher).toHaveBeenCalledTimes(3);
  });
  it("잘못된 계약/URL은 HTTP 호출 전에 거절한다", async () => {
    const fetcher = vi.fn<typeof fetch>(), repo = createHttpBidListRepository("https://synthetic.test", fetcher);
    for (const amountFilter of [{ ...range, amountMin: -1 }, { ...range, amountMin: .5 }, { ...range, amountMax: Number.MAX_SAFE_INTEGER + 1 }, { ...range, amountMin: 1, amountMax: 0 }, { ...range, amountType: null }]) await expect(repo.getBidList({ ...query, amountFilter })).rejects.toThrow();
    await expect(repo.getBidList(readBidListState(new URLSearchParams("amountType=BASE_PRICE&amountMin=1e8")))).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
  });
});

describe("mock 포함 경계·분류 금액과 count/page", () => {
  const now = Date.parse("2030-06-01T00:00:00Z");
  const prices = [0, 1, 99_999_999, 100_000_000, 100_000_001, 1_000_000_000, 1_000_000_001, 5_000_000_000, 5_000_000_001, 10_000_000_000, 10_000_000_001, Number.MAX_SAFE_INTEGER, null];
  const fixtures = prices.map((price, i) => {
    const entry = structuredClone(createMockBidEntries(now)[0]);
    return { ...entry, item: { ...entry.item, id: String(22001 + Math.floor(i / 2)), classificationNo: String(i % 2 + 1), baseAmount: price, estimatedPrice: price === null ? 0 : i === 0 ? null : price } };
  });
  it.each(["all", "closing"] as const)("%s는 행 기초금액·추정가격·null/0을 서로 대체하지 않는다", async view => {
    const repo = createMockBidRepository(() => now, "default", fixtures);
    const base = await repo.getBidList({ ...query, view, amountFilter: { ...range, amountType: "BASE_PRICE", amountMax: 0 } });
    const estimated = await repo.getBidList({ ...query, view, amountFilter: { ...range, amountMax: 0 } });
    expect(base.items.map(item => [item.id, item.classificationNo])).toEqual([["22001", "1"]]);
    expect(estimated.items.map(item => [item.id, item.classificationNo])).toEqual([["22007", "1"]]);
    expect((await repo.getBidList({ ...query, view, amountFilter: { ...range, amountType: "BASE_PRICE", amountMin: 1, amountMax: 1 } })).items.map(item => item.classificationNo)).toEqual(["2"]);
  });
  it.each(Object.keys(bidAmountPresets))("preset %s의 ±1원·열린 범위·페이지 count를 보존한다", async preset => {
    const repo = createMockBidRepository(() => now, "default", fixtures), amountFilter = presetBidAmountFilter(preset);
    const expected = fixtures.filter(entry => entry.item.baseAmount !== null && (amountFilter.amountMin === null || entry.item.baseAmount >= amountFilter.amountMin) && (amountFilter.amountMax === null || entry.item.baseAmount <= amountFilter.amountMax)).map(entry => entry.item);
    const all = await repo.getBidList({ ...query, size: 100, amountFilter }); expect(all.items).toEqual(expected); expect(all.totalCount).toBe(expected.length);
    const pages = await Promise.all(Array.from({ length: Math.ceil(expected.length / 2) }, (_, i) => repo.getBidList({ ...query, page: i + 1, size: 2, amountFilter })));
    expect(pages.flatMap(p => p.items)).toEqual(expected); expect(pages.every(p => p.totalCount === expected.length)).toBe(true);
  });
  it("0~상한 범위는 null 행을 제외하고 조건 해제는 전체 행으로 돌아간다", async () => {
    const repo = createMockBidRepository(() => now, "default", fixtures);
    expect((await repo.getBidList({ ...query, amountFilter: { ...range, amountType: "BASE_PRICE" } })).totalCount).toBe(12);
    expect((await repo.getBidList({ ...query, amountFilter: emptyBidAmountFilter() })).totalCount).toBe(13);
    expect((await repo.getBidList({ ...query, personalFilter: { ...emptyPersonalFilter(), ...range, amountType: "BASE_PRICE" } })).totalCount).toBe(12);
  });
});

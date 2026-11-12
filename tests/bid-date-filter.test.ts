import { afterEach, describe, expect, it, vi } from "vitest";
import type { BidDateFilter, BidListQuery } from "@/data/bids/contracts";
import { createHttpBidListRepository } from "@/data/bids/http-repository";
import { createMockBidEntries, createMockBidRepository, mockBidOptions } from "@/data/bids/mock-repository";
import { createMockPersonalFiltersRepository } from "@/data/personal-filters/mock-repository";
import { memoryStorage } from "@/data/mock/store";
import { readBidListState } from "@/components/bids/bid-list-model";
import { changePersonalFilter, currentPersonalFilter, personalFilterDisplay } from "@/components/bids/personal-filter-adapter";
import { emptyPersonalFilter, readPersonalFilterParams, writePersonalFilterParams } from "@/features/bid-notice-filters/model";
import { bidDateFilterError, bidDateTypes, currentBidDateFilter, emptyBidDateFilter, isCalendarDate, kstToday, normalizeBidDateFilter, presetBidDateFilter, writeBidDateParams } from "@/features/bid-notice-filters/date-filter";
import { access, mockRuntime, ok } from "./helpers";

const query: BidListQuery = { view: "all", query: "", page: 1, size: 10 };
const range: BidDateFilter = { dateType: "BID_BEGIN", dateFrom: "2024-02-29", dateTo: "2024-02-29" };
const emptyPage = { items: [], page: 0, size: 10, totalElements: 0, totalPages: 0, hasNext: false };
afterEach(() => vi.useRealTimers());

describe("날짜 정책과 URL", () => {
  it.each(["2024-02-29", "2000-02-29", "0001-01-01", "9999-12-31"])("실제 날짜 %s 허용", value => expect(isCalendarDate(value)).toBe(true));
  it.each(["2023-02-29", "1900-02-29", "2024-02-30", "2024-04-31", "2024-00-10", "2024-13-01", "2024-01-00", "0000-01-01", "24-02-29", "2024.02.29", "2024-02-29T00:00:00Z"])("없는 날짜/다른 형식 %s 거절", value => expect(isCalendarDate(value)).toBe(false));
  it("열린/동일일 범위 허용, 역전/종류 누락 오류와 양쪽 빈값 해제를 구분한다", () => {
    for (const filter of [range, { ...range, dateFrom: null }, { ...range, dateTo: null }]) expect(bidDateFilterError(filter, "all")).toBeUndefined();
    expect(bidDateFilterError({ ...range, dateTo: "2024-02-28" }, "all")).toMatch(/종료일/);
    expect(bidDateFilterError({ ...range, dateType: null }, "all")).toMatch(/기준/);
    expect(normalizeBidDateFilter({ ...emptyBidDateFilter(), dateType: "BID_CLOSE" })).toEqual(emptyBidDateFilter());
  });
  it.each([
    "dateType=BID_BEGIN&dateFrom=2023-02-29", "dateType=BID_CLOSE&dateFrom=2024-03-01&dateTo=2024-02-29",
    "dateFrom=2024-02-29", "dateType=OPEN&dateFrom=2024-02-29", "dateType=BID_BEGIN&dateFrom=2024-02-29&dateFrom=2024-03-01",
  ])("불완전/잘못된 URL은 조용히 무시하거나 preset으로 대체하지 않는다: %s", search => {
    const state = readBidListState(new URLSearchParams(`${search}&period=1개월`));
    expect(state.dateError).toBeTruthy(); expect(state.period).toBeUndefined();
    expect(() => currentBidDateFilter(state)).toThrow();
    const personal = readBidListState(new URLSearchParams(`personal=1&${search}`));
    expect(personal.dateError).toBeTruthy();
  });
  it("일반/personal URL과 RESULT는 날짜 키를 공유하고 closing에는 날짜를 적용하지 않는다", () => {
    const params = new URLSearchParams("query=합성&page=2&region=서울특별시");
    writeBidDateParams(params, range);
    expect(readBidListState(params)).toMatchObject({ query: "합성", region: "서울특별시", dateFilter: range, dateError: undefined });
    expect(params.has("personal")).toBe(false);
    writePersonalFilterParams(params, { ...emptyPersonalFilter(), ...range, regionCodes: ["26"] });
    expect(readPersonalFilterParams(params)).toMatchObject({ ...range, regionCodes: ["26"] });
    expect(readBidListState(params).dateFilter).toEqual(range);
    params.set("view", "result"); expect(readBidListState(params).dateError).toMatch(/개찰일/);
    params.delete("dateType"); expect(readBidListState(params)).toMatchObject({ dateFilter: { ...range, dateType: null }, personalFilter: undefined });
    params.set("view", "closing"); expect(currentBidDateFilter(readBidListState(params))).toEqual(emptyBidDateFilter());
    params.delete("view"); params.delete("personal"); writeBidDateParams(params, { ...emptyBidDateFilter(), dateType: "BID_CLOSE" });
    expect(["dateType", "dateFrom", "dateTo"].every(key => !params.has(key))).toBe(true);
  });
  it("잘못된 날짜 enum URL도 chip에 undefined를 노출하지 않고 오류 상태를 유지한다", () => {
    const state = readBidListState(new URLSearchParams("personal=1&dateType=OPEN&dateFrom=2024-02-29"));
    expect(state.dateError).toMatch(/기준/);
    expect(personalFilterDisplay(state.personalFilter!, mockBidOptions).chips).toContain("날짜 2024-02-29 ~ 이후");
  });
  it("KST 자정과 월말/윤년 preset, 선택 종류·RESULT 범위·절대 날짜를 보존한다", () => {
    expect(kstToday(Date.parse("2024-02-28T14:59:59Z"))).toBe("2024-02-28");
    expect(kstToday(Date.parse("2024-02-28T15:00:00Z"))).toBe("2024-02-29");
    const now = Date.parse("2024-03-30T15:00:00Z");
    expect(presetBidDateFilter("1개월", "all", "BID_CLOSE", now)).toEqual({ dateType: "BID_CLOSE", dateFrom: "2024-02-29", dateTo: null });
    expect(presetBidDateFilter("1개월", "result", "BID_CLOSE", now)).toEqual({ dateType: null, dateFrom: "2024-02-29", dateTo: "2024-03-31" });
    expect(presetBidDateFilter("1년", "all", null, Date.parse("2024-02-29T01:00:00Z"))).toMatchObject({ dateType: "BID_BEGIN", dateFrom: "2023-02-28" });
    vi.useFakeTimers(); vi.setSystemTime(now);
    const filter = changePersonalFilter({ ...emptyPersonalFilter(), dateType: "PARTICIPATION_DEADLINE" }, "period", "1개월", mockBidOptions);
    expect(filter).toMatchObject({ dateType: "PARTICIPATION_DEADLINE", dateFrom: "2024-02-29", dateTo: null });
    const params = new URLSearchParams(); writePersonalFilterParams(params, filter);
    vi.setSystemTime(now + 86400_000);
    expect(readPersonalFilterParams(params)).toEqual(filter);
    expect(currentPersonalFilter(readBidListState(new URLSearchParams("dateType=BID_CLOSE&dateTo=2024-03-31")), mockBidOptions)).toMatchObject({ dateType: "BID_CLOSE", dateFrom: null, dateTo: "2024-03-31" });
  });
  it.each(bidDateTypes)("기존 Repository의 %s 절대 날짜 저장/재조회·URL 왕복은 유지한다", async dateType => {
    const storage = memoryStorage();
    const filter = { ...emptyPersonalFilter(), ...range, dateType };
    const saved = await createMockPersonalFiltersRepository(mockRuntime(storage)).savePersonalFilter(access, null, filter);
    const restored = await createMockPersonalFiltersRepository(mockRuntime(storage)).getPersonalFilter(access);
    expect(restored).toEqual(saved); expect(restored.filter).toEqual(filter);
    const params = new URLSearchParams(); writePersonalFilterParams(params, restored.filter);
    expect(readPersonalFilterParams(params)).toEqual(filter);
  });
});

describe("실제 HTTP 연결의 fetch 대역 계약", () => {
  it.each(bidDateTypes)("ALL %s의 절대 날짜·페이지·정렬을 전송한다", async dateType => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok(emptyPage));
    const dates = { ...range, dateType };
    await createHttpBidListRepository("https://synthetic.test", fetcher).getBidList({ ...query, page: 2, dateFilter: dates });
    const params = new URL(String(fetcher.mock.calls[0][0])).searchParams;
    expect(Object.fromEntries(params)).toMatchObject({ view: "ALL", dateType, dateFrom: "2024-02-29", dateTo: "2024-02-29", page: "1", sort: "bidCloseAt,asc" });
    expect(params.has("personal")).toBe(false); expect(params.has("period")).toBe(false);
  });
  it("RESULT 날짜/열린 범위와 closing 무전송을 보장한다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockImplementation(async () => ok(emptyPage));
    const repo = createHttpBidListRepository("https://synthetic.test", fetcher);
    await repo.getBidList({ ...query, view: "result", dateFilter: { ...range, dateType: null, dateFrom: null } });
    const result = new URL(String(fetcher.mock.calls[0][0])).searchParams;
    expect(Object.fromEntries(result)).toMatchObject({ view: "RESULT", dateTo: "2024-02-29", sort: "openAt,desc" });
    expect(result.has("dateType")).toBe(false); expect(result.has("dateFrom")).toBe(false);
    await repo.getBidList({ ...query, view: "closing", dateFilter: range, personalFilter: { ...emptyPersonalFilter(), ...range }, period: "1개월" });
    const closing = new URL(String(fetcher.mock.calls[1][0])).searchParams;
    expect(["dateType", "dateFrom", "dateTo", "personal", "period"].every(key => !closing.has(key))).toBe(true);
  });
  it("잘못된 날짜/조합은 HTTP 요청 전 거절하고 서버 실패를 mock으로 바꾸지 않는다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockImplementation(async () => ok(null, 503));
    const repo = createHttpBidListRepository("https://synthetic.test", fetcher);
    for (const dateFilter of [{ ...range, dateFrom: "2024-02-30" }, { ...range, dateTo: "2024-02-28" }, { ...range, dateType: null }]) {
      await expect(repo.getBidList({ ...query, dateFilter })).rejects.toThrow();
    }
    await expect(repo.getBidList({ ...query, view: "result", dateFilter: range })).rejects.toThrow(/개찰일/);
    expect(fetcher).not.toHaveBeenCalled();
    await expect(repo.getBidList({ ...query, dateFilter: range })).rejects.toThrow(/불러오지/);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});

describe("mock 날짜 매칭·null·건수/페이지/정렬", () => {
  const now = Date.parse("2024-02-28T00:00:00Z");
  const boundaries = ["2024-02-28T14:59:59.999Z", "2024-02-28T15:00:00Z", "2024-02-29T00:00:00Z", "2024-02-29T14:59:59.999Z", "2024-02-29T15:00:00Z", null];
  it.each([...bidDateTypes, "RESULT"] as const)("%s는 KST 양끝 날짜를 포함하고 다음날/null을 제외한다", async type => {
    const fixtures = structuredClone(createMockBidEntries(now)).slice(0, boundaries.length).map((entry, index) => {
      const field = type === "RESULT" ? "openAt" : type === "PARTICIPATION_DEADLINE" ? "qualificationDeadlineAt" : type === "BID_CLOSE" ? "bidCloseAt" : "bidBeginAt";
      return { ...entry, closed: type === "RESULT", bid: { ...entry.bid, schedule: { ...entry.bid.schedule, bidCloseAt: "2024-03-05T00:00:00Z", [field]: boundaries[index] } } };
    });
    const repo = createMockBidRepository(() => now, "default", fixtures);
    const state = { ...query, view: type === "RESULT" ? "result" as const : "all" as const, dateFilter: { ...range, dateType: type === "RESULT" ? null : type }, size: 2 };
    const first = await repo.getBidList(state); const second = await repo.getBidList({ ...state, page: 2 });
    expect(first.totalCount).toBe(3); expect(second.totalCount).toBe(3);
    expect([...first.items, ...second.items].map(item => item.id)).toEqual(type === "RESULT" ? ["10004", "10003", "10002"] : ["10002", "10003", "10004"]);
    expect((await repo.getBidList({ ...state, dateFilter: { ...state.dateFilter, dateFrom: null }, size: 10 })).totalCount).toBe(4);
    expect((await repo.getBidList({ ...state, dateFilter: { ...state.dateFilter, dateTo: null }, size: 10 })).totalCount).toBe(4);
  });
});

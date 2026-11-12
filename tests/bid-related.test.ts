import { describe, expect, it, vi } from "vitest";
import { createMockBidEntries, createMockBidRepository } from "@/data/bids/mock-repository";
import type { MockBidEntry, MockPurchaseItem } from "@/data/bids/mock-related";
import { createHttpBidDetailRepository } from "@/data/bids/detail-http-repository";
import { bidDetailHref } from "@/lib/bid-detail-url";
import { resolveDataConfig } from "@/data/config";
import { ok } from "./helpers";
import wire from "../tools/qa/bid-wire-fixtures.json";

const time = Date.parse("2026-11-12T10:00:00+09:00");
const iso = (value: number) => new Date(value).toISOString();
const detailQuery = (id: string, classificationNo: string | null = null) => ({ id, classificationNo, itemPage: 1, resultId: null, participantsPage: 1 });
const item = (classificationNo: string | null, detailedItemNo: string | null = "1000000001", itemClassificationNo: string | null = "10000001", deleted = false): MockPurchaseItem => ({ classificationNo, detailedItemNo, itemClassificationNo, deleted });
function notice(id: string, type: MockBidEntry["bid"]["bidType"] = "construction"): MockBidEntry {
  const base = createMockBidEntries(time)[type === "construction" ? 0 : type === "service" ? 1 : 2];
  return {
    ...base, industryCodes: ["0001"], purchaseItems: [item("1")], vatAmount: 10,
    item: { ...base.item, id, classificationNo: type === "construction" ? null : "1", baseAmount: 999 },
    bid: { ...base.bid, id, classifications: type === "construction" ? [] : ["1", "2", "10"], amount: { ...base.bid.amount, estimatedPrice: 100 }, schedule: { ...base.bid.schedule, bidCloseAt: iso(time + 1), publishedAt: iso(time - 1000) } },
  };
}
const withClose = (entry: MockBidEntry, closeAt: string | null): MockBidEntry => ({ ...entry, bid: { ...entry.bid, schedule: { ...entry.bid.schedule, bidCloseAt: closeAt } } });
const withPublished = (entry: MockBidEntry, publishedAt: string | null): MockBidEntry => ({ ...entry, bid: { ...entry.bid, schedule: { ...entry.bid.schedule, publishedAt } } });
async function related(entries: readonly MockBidEntry[], classificationNo: string | null = null) {
  const detail = await createMockBidRepository(() => time, "default", entries).getBidDetail(detailQuery(entries[0].bid.id, classificationNo));
  expect(detail?.related.status).toBe("ready");
  if (detail?.related.status !== "ready") throw new Error("관련 공고 ready 결과가 필요합니다.");
  return detail.related.data;
}

describe("POL-30 관련 공고 mock · REL-01~13", () => {
  it.each(["normal", "closed", "cancelled", "closed-cancelled", "no-close"])("REL-01: %s 기준 공고에서 같은 진행 후보를 제공한다", async state => {
    let source = notice("1");
    if (state.includes("closed")) source = withClose(source, iso(time));
    if (state.includes("cancelled")) source = { ...source, bid: { ...source.bid, status: "CANCELLED" } };
    if (state === "no-close") source = withClose(source, null);
    expect((await related([source, notice("2")])).map(item => item.id)).toEqual(["2"]);
  });
  it.each(["unpublished", "deleted", "missing"])("REL-02: %s 기준은 빈 목록이 아닌 null/404 경계다", async state => {
    const source = { ...notice("1"), published: state !== "unpublished", deleted: state === "deleted" };
    const repo = createMockBidRepository(() => time, "default", state === "missing" ? [] : [source]);
    expect(await repo.getBidDetail(detailQuery("1"))).toBeNull();
  });
  it.each(["", "01", " 1", "1 ", "+1", "-1", "1.0", "１", "9".repeat(51)])("REL-03: 잘못된 분류 %j를 정규화하지 않고400으로 거부한다", async classificationNo => {
    await expect(createMockBidRepository(() => time, "default", [notice("1", "goods")]).getBidDetail(detailQuery("1", classificationNo))).rejects.toMatchObject({ status: 400 });
  });
  it("REL-03: 공사 분류400/없는 물품 분류404와 전체·선택 identity를 보존한다", async () => {
    await expect(createMockBidRepository(() => time, "default", [notice("1")]).getBidDetail(detailQuery("1", "1"))).rejects.toMatchObject({ status: 400 });
    const source = notice("1", "goods");
    const repo = createMockBidRepository(() => time, "default", [source]);
    expect(await repo.getBidDetail(detailQuery("1", "3"))).toBeNull();
    expect((await repo.getBidDetail(detailQuery("1")))?.bid.classificationNo).toBeNull();
    expect((await repo.getBidDetail(detailQuery("1", "2")))?.bid.classificationNo).toBe("2");
    for (const classificationNo of ["0", "9".repeat(50)]) {
      const entry = { ...source, bid: { ...source.bid, classifications: [classificationNo] } };
      expect((await createMockBidRepository(() => time, "default", [entry]).getBidDetail(detailQuery("1", classificationNo)))?.bid.classificationNo).toBe(classificationNo);
    }
  });
  it("기준 공고 identity 손상을 정상 빈 목록/404로 숨기지 않는다", async () => {
    const source = { ...notice("1"), bid: { ...notice("1").bid, id: "2" } };
    await expect(createMockBidRepository(() => time, "default", [source]).getBidDetail(detailQuery("1"))).rejects.toMatchObject({ status: 500 });
  });
  it("REL-04: 공식 코드 없음/일치 후보 없음은 다른 공고로 채우지 않는다", async () => {
    expect(await related([{ ...notice("1"), industryCodes: [] }, notice("2")])).toEqual([]);
    expect(await related([notice("1"), { ...notice("2"), industryCodes: ["0002"] }])).toEqual([]);
  });
  it("REL-05: 후보 공개·삭제·취소와 마감 이전/정각/이후/null을 독립 적용한다", async () => {
    const source = notice("1");
    const candidates = [
      { ...notice("2"), published: false }, { ...notice("3"), deleted: true },
      { ...notice("4"), bid: { ...notice("4").bid, status: "CANCELLED" as const } },
      withClose(notice("5"), iso(time - 1)), withClose(notice("6"), iso(time)),
      withClose(notice("7"), iso(time + 1)), withClose(notice("8"), null),
    ];
    expect((await related([source, ...candidates])).map(item => item.id)).toEqual(["8", "7"]);
  });
  it("REL-06: 같은 이름/다른 코드·접두사·다른 유형/같은 코드를 제외하며 지역/금액은 거르지 않는다", async () => {
    const candidates = [notice("2", "service"), { ...notice("3"), industryCodes: ["00010"] }, { ...notice("4"), industryCodes: ["0002"] }];
    const match = { ...notice("5"), item: { ...notice("5").item, region: null }, bid: { ...notice("5").bid, amount: { ...notice("5").bid.amount, estimatedPrice: null } } };
    expect(await related([notice("1"), ...candidates, match])).toMatchObject([{ id: "5", region: null, projectAmount: null }]);
  });
  it("REL-07: 최종 직접/허용 업종은 정확 일치하고 공사는 품목으로 fallback하지 않는다", async () => {
    const source = { ...notice("1"), industryCodes: ["0001", "0036"] };
    expect((await related([source, { ...notice("2"), industryCodes: ["0036"] }])).map(item => item.id)).toEqual(["2"]);
    expect(await related([{ ...source, industryCodes: [] }, notice("2")])).toEqual([]);
  });
  it.each(["goods", "service"] as const)("REL-07: %s는 source 전체의 첫 non-empty 품목 기준만 사용한다", async type => {
    const source = { ...notice("1", type), industryCodes: [], purchaseItems: [item("1", "A", "X"), item("2", null, "B")] };
    const detailed = { ...notice("2", type), purchaseItems: [item("1", "A", "Z")] };
    const lower = { ...notice("3", type), purchaseItems: [item("1", null, "B")] };
    expect((await related([source, detailed, lower])).map(item => item.id)).toEqual(["2"]);
    expect((await related([{ ...source, purchaseItems: [item("1", null, "B")] }, lower])).map(item => item.id)).toEqual(["3"]);
  });
  it("REL-07: 용역의 공고 전체 업종이 품목/선택 분류보다 우선한다", async () => {
    const source = notice("1", "service");
    const byIndustry = { ...notice("2", "service"), purchaseItems: [] };
    const byItem = { ...notice("3", "service"), industryCodes: ["0036"] };
    expect((await related([source, byIndustry, byItem], "2")).map(item => item.id)).toEqual(["2"]);
    expect((await related([source, byIndustry, byItem], "2"))[0].classificationNo).toBeNull();
  });
  it("REL-08: source 전체/선택 범위와 삭제 품목을 구분한다", async () => {
    const source = { ...notice("1", "goods"), purchaseItems: [item("1", "A"), item("2", "B"), item("10", "C", null, true)] };
    const a = { ...notice("2", "goods"), purchaseItems: [item("1", "A")] };
    const b = { ...notice("3", "goods"), purchaseItems: [item("1", "B")] };
    const c = { ...notice("4", "goods"), purchaseItems: [item("1", "C")] };
    expect((await related([source, a, b, c])).map(item => item.id)).toEqual(["3", "2"]);
    expect((await related([source, a, b, c], "1")).map(item => item.id)).toEqual(["2"]);
    expect((await related([source, a, b, c], "2")).map(item => item.id)).toEqual(["3"]);
    expect(await related([source, a, b, c], "10")).toEqual([]);
    expect(await related([source, { ...a, purchaseItems: [item("1", "A", null, true)] }], "1")).toEqual([]);
  });
  it("REL-09: target 분류2/10의 실제 일치를 공고당 한 번 선택하고 그 URL로 조회한다", async () => {
    const source = notice("1", "goods");
    const target = { ...notice("2", "goods"), purchaseItems: [item("10"), item("2"), item("2")] };
    const entries = [source, target, target];
    const cards = await related(entries, "1");
    expect(cards).toHaveLength(1);
    expect(cards[0].classificationNo).toBe("2");
    expect(bidDetailHref(cards[0].id, cards[0].classificationNo)).toBe("/bids/2?bidClsfcNo=2");
    expect((await createMockBidRepository(() => time, "default", entries).getBidDetail(detailQuery("2", cards[0].classificationNo)))?.bid.classificationNo).toBe("2");
    const long = "9".repeat(50);
    const huge = { ...target, bid: { ...target.bid, classifications: [long, "10"] }, purchaseItems: [item(long), item("10")] };
    expect((await related([source, huge]))[0].classificationNo).toBe("10");
  });
  it.each([null, "01", "3"])("REL-09: 손상 target 분류 %j는 정상 빈 목록 아닌 독립 오류다", async classificationNo => {
    const source = notice("1", "goods");
    const target = { ...notice("2", "goods"), purchaseItems: [item(classificationNo)] };
    const result = await createMockBidRepository(() => time, "default", [source, target]).getBidDetail(detailQuery("1"));
    expect(result?.related).toEqual({ status: "error", data: null });
    expect(result?.attachments.status).toBe("ready");
  });
  it("REL-10: 자기/중복 제외·게시일 최신/null 마지막·동시각 ID 내림차순·최대3개", async () => {
    const source = notice("1");
    const newest = withPublished(notice("4"), iso(time));
    const entries = [source, source, withPublished(notice("8"), null), withPublished(notice("2"), iso(time - 2)), newest, newest, withPublished(notice("10"), iso(time - 2))];
    expect((await related(entries)).map(item => item.id)).toEqual(["4", "10", "2"]);
    expect((await related([source, withPublished(notice("8"), null), notice("2")])).map(item => item.id)).toEqual(["2", "8"]);
    expect((await related([source, withPublished(notice("2"), null)]))[0].publishedAt).toBeNull();
  });
  it.each([[100, 10, 110], [100, 0, 100], [0, 0, 0], [100, null, null], [null, 10, null], [null, null, null]])("REL-11: 추정가격%s + VAT%s = %s, 기초금액 대체 없음", async (estimatedPrice, vatAmount, expected) => {
    const entry = notice("2");
    const target = { ...entry, vatAmount, bid: { ...entry.bid, amount: { ...entry.bid.amount, estimatedPrice } } };
    expect((await related([notice("1"), target]))[0].projectAmount).toBe(expected);
  });
  it("REL-12: 같은 fixture의 Clock만 이동하면 T+1ms 후보가 재조회에서 마감된다", async () => {
    let now = time;
    const fixtures = [notice("1"), notice("2")];
    const repo = createMockBidRepository(() => now, "default", fixtures);
    expect((await repo.getBidDetail(detailQuery("1")))?.related).toMatchObject({ status: "ready", data: [{ id: "2" }] });
    now += 2;
    expect((await repo.getBidDetail(detailQuery("1")))?.related).toEqual({ status: "ready", data: [] });
    expect((await createMockBidRepository(() => now, "default", fixtures).getBidDetail(detailQuery("1")))?.related).toEqual({ status: "ready", data: [] });
  });
  it("REL-12: 공개 server의 새 Repository도 같은 프로세스 fixture 시각을 사용한다", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(time);
    vi.stubEnv("NEXT_PUBLIC_MATE_DATA_CONFIG", JSON.stringify(resolveDataConfig({ MATE_DATA_PROFILE: "mock", MATE_APP_ENV: "local" })));
    vi.resetModules();
    try {
      const server = await import("@/data/bids/server");
      expect((await server.getBidDetail(detailQuery("10001")))?.related).toMatchObject({ status: "ready", data: expect.arrayContaining([expect.objectContaining({ bidType: "construction" })]) });
      vi.setSystemTime(time + 9 * 86400_000);
      expect((await server.getBidDetail(detailQuery("10001")))?.related).toEqual({ status: "ready", data: [] });
    } finally { vi.useRealTimers(); vi.unstubAllEnvs(); vi.resetModules(); }
  });
  it("REL-13: 빈·related-error와 다른 section을 분리하고 외부 요청 없이 조회한다", async () => {
    const fetcher = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("외부 요청 금지"));
    try {
      const repo = createMockBidRepository(() => time, "related-error");
      const result = await repo.getBidDetail(detailQuery("10004"));
      expect(result?.related).toEqual({ status: "error", data: null });
      expect(result?.attachments.status).toBe("ready");
      expect(result?.results.status).toBe("ready");
      expect(await related([notice("1")])).toEqual([]);
      expect(fetcher).not.toHaveBeenCalled();
    } finally { fetcher.mockRestore(); }
  });
  it("HTTP 대역: page0/size3과 선택 분류·target 분류/null·사업금액을 그대로 전달한다", async () => {
    const relatedWire = { ...wire.related, items: [{ ...wire.related.items[0], bidClsfcNo: null, projectAmount: 110 }, { ...wire.related.items[0], bidNoticeId: 20003, bidClsfcNo: "2" }] };
    const fetcher = vi.fn<typeof fetch>(async input => {
      const path = new URL(String(input)).pathname;
      const data = path.endsWith("related-notices") ? relatedWire : path.endsWith("attachments") ? wire.attachments : path.endsWith("bid-results") ? wire.results : path.endsWith("participants") ? wire.participants : path.endsWith("purchase-items") ? wire.purchases : wire.bidDetail;
      return ok(data);
    });
    const detail = await createHttpBidDetailRepository("https://synthetic.test", fetcher).getBidDetail(detailQuery("20001", "1"));
    const request = fetcher.mock.calls.map(([url]) => new URL(String(url))).find(url => url.pathname.endsWith("related-notices"))!;
    expect(request.searchParams.get("page")).toBe("0"); expect(request.searchParams.get("size")).toBe("3");
    expect(detail?.related.status).toBe("ready");
    expect(request.searchParams.get("bidClsfcNo")).toBe(wire.bidDetail.classificationContext.selectedBidClsfcNo);
    if (detail?.related.status === "ready") expect(detail.related.data).toMatchObject(relatedWire.items.map(item => ({ id: String(item.bidNoticeId), classificationNo: item.bidClsfcNo, projectAmount: item.projectAmount })));
  });
});

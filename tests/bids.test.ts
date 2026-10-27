import { describe, expect, it, vi } from "vitest";
import { createMockBidRepository } from "@/data/bids/mock-repository";
import { createHttpBidListRepository } from "@/data/bids/http-repository";
import { createHttpBidDetailRepository } from "@/data/bids/detail-http-repository";
import { mapBidListResult, mapBidFilterOptions } from "@/data/bids/api-mapper";
import { emptyPersonalFilter } from "@/features/bid-notice-filters/model";
import { ok, testNow } from "./helpers";
import type { BidNoticeListDto } from "@/data/bids/api-types";
import wire from "../tools/qa/bid-wire-fixtures.json";
const query = { view: "all" as const, query: "", page: 1, size: 10 };
const detailQuery = (id: string) => ({ id, classificationNo: "1", itemPage: 1, resultId: null, participantsPage: 1 });

describe("공개 입찰 Repository", () => {
  it("홈·목록의 공고 ID가 상세와 연결되고 첨부·관련 공고는 로컬 데이터다", async () => {
    const repo = createMockBidRepository(() => testNow); const list = await repo.getBidList({ ...query, size: 9 }); expect(list.items).toHaveLength(9);
    const detail = await repo.getBidDetail(detailQuery(list.items[0].id)); expect(detail?.bid.id).toBe(list.items[0].id);
    if (detail?.attachments.status === "ready") expect(detail.attachments.data[0].downloadUrl).toBe("/mock/bid-attachment.txt");
    if (detail?.related.status === "ready") for (const related of detail.related.data) expect((await repo.getBidDetail(detailQuery(related.id)))?.bid.id).toBe(related.id);
    expect(await repo.getBidDetail(detailQuery("not-an-id"))).toBeNull();
  });
  it("최신 개인 필터의 코드·금액·날짜·공동도급·페이지를 적용한다", async () => {
    const repo = createMockBidRepository(() => testNow); const filter = { ...emptyPersonalFilter(), bidTypes: ["CONSTRUCTION" as const], regionCodes: ["11"], industryCodes: ["0001"], amountMin: 100_000_000, jointContract: "REQUIRED" as const };
    const result = await repo.getBidList({ ...query, size: 1, personalFilter: filter }); expect(result.totalCount).toBeGreaterThan(1); expect(result.items).toHaveLength(1);
    expect(result.items.every(item => item.kind === "construction" && item.region === "서울특별시" && item.baseAmount! >= 100_000_000)).toBe(true);
    const next = await repo.getBidList({ ...query, size: 1, page: 2, personalFilter: filter }); expect(next.items[0].id).not.toBe(result.items[0].id);
    expect((await repo.getBidList({ ...query, personalFilter: { ...filter, dateFrom: "2099-01-01" } })).totalCount).toBe(0);
  });
  it("개찰 참여 업체 더 보기, 부분 실패, 빈 결과와 nullable 금액을 처리한다", async () => {
    const repo = createMockBidRepository(() => testNow); const results = await repo.getBidList({ ...query, view: "result" });
    const detail = await repo.getBidDetail({ ...detailQuery(results.items[0].id), participantsPage: 2 });
    expect(detail?.participants?.status).toBe("ready"); if (detail?.participants?.status === "ready") expect(detail.participants.data.items).toHaveLength(5);
    if (detail?.podium?.status === "ready") expect(detail.podium.data).toHaveLength(3);
    const failed = await createMockBidRepository(() => testNow, "attachments-error").getBidDetail(detailQuery("10001")); expect(failed?.attachments.status).toBe("error"); expect(failed?.related.status).toBe("ready");
    expect((await createMockBidRepository(() => testNow, "empty").getBidList(query)).totalCount).toBe(0);
    const all = await repo.getBidList({ ...query, size: 100 }); expect(all.items.some(item => item.baseAmount === null)).toBe(true);
  });
  it("개찰 상태·참여 시간·관련 공고 날짜와 비율을 표시 계약으로 반환한다", async () => {
    const detail = await createMockBidRepository(() => testNow).getBidDetail(detailQuery("10004"));
    if (detail?.results.status === "ready") expect(detail.results.data[0].status).toBe("AWARDED");
    if (detail?.participants?.status === "ready") {
      expect(detail.participants.data.items[0].bidAt).toMatch(/^\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}$/);
      expect(detail.participants.data.items[1].bidRate).toBe(88.13);
    }
    if (detail?.related.status === "ready") expect(detail.related.data[0].publishedAt).toMatch(/^\d{4}\.\d{2}\.\d{2}$/);
  });
  it("HTTP는 개인 필터를 반복 query 값으로 보내고 0 기반 페이지를 변환한다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok({ items: [], page: 1, size: 20, totalElements: 0, totalPages: 0, hasNext: false }));
    const repo = createHttpBidListRepository("https://synthetic-api.test", fetcher);
    const filter = { ...emptyPersonalFilter(), bidTypes: ["CONSTRUCTION" as const, "SERVICE" as const], regionCodes: ["11"], dateType: "BID_CLOSE" as const, dateFrom: "2030-06-01", amountMin: 100, regionOnly: true };
    const result = await repo.getBidList({ ...query, page: 2, size: 20, personalFilter: filter });
    const params = new URL(String(fetcher.mock.calls[0][0])).searchParams;
    expect(params.getAll("bidTypes")).toEqual(["CONSTRUCTION", "SERVICE"]); expect(params.get("page")).toBe("1"); expect(params.get("amountMin")).toBe("100"); expect(result.page).toBe(2);
    expect(fetcher.mock.calls[0][1]).toMatchObject({ cache: "no-store", headers: { Accept: "application/json" } });
  });
  it("HTTP 상세 404는 null이고 잘못된 ID에서는 요청하지 않는다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 404 })); const repo = createHttpBidDetailRepository("https://synthetic-api.test", fetcher);
    expect(await repo.getBidDetail(detailQuery("1"))).toBeNull(); expect(await repo.getBidDetail(detailQuery("invalid"))).toBeNull(); expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("HTTP wire 모델의 nullable·KST·개찰 결과를 변환하고 첨부 실패는 격리한다", async () => {
    const list = mapBidListResult(wire.bidList as unknown as BidNoticeListDto);
    expect(list.items[0]).toMatchObject({ id: "20001", estimatedPrice: null, publishedAt: "2030.05.30", closesAt: "2030.06.03 09:00" });
    const fetcher: typeof fetch = async input => {
      const path = new URL(String(input)).pathname;
      if (path.endsWith("attachments")) return new Response(null, { status: 503 });
      const data = path.endsWith("related-notices") ? wire.related : path.endsWith("bid-results") ? wire.results : path.endsWith("participants") ? wire.participants : wire.bidDetail;
      return ok(data);
    };
    const detail = await createHttpBidDetailRepository("https://synthetic.test", fetcher).getBidDetail(detailQuery("20001"));
    expect(detail?.bid.schedule.bidCloseAt).toBe("2030.06.03 09:00"); expect(detail?.bid.amount.estimatedPrice).toBeNull();
    expect(detail?.attachments.status).toBe("error"); expect(detail?.related.status).toBe("ready"); expect(detail?.results.status).toBe("ready");
    if (detail?.participants?.status === "ready") expect(detail.participants.data.items[0].bidAt).toBe("2030.06.03 09:00");
  });
  it("이름과 코드를 구분하고 잘못된 wrapper를 거부한다", async () => {
    const options = mapBidFilterOptions({ items: [{ code: "11", name: "서울", fullName: "서울특별시", parentCode: null, depth: 1 }] }, { totalCount: 2, items: [{ code: "0001", name: "동일명", classificationCode: null, classificationName: null, categoryCodes: [] }, { code: "0002", name: "동일명", classificationCode: null, classificationName: null, categoryCodes: [] }] });
    expect(options.industryOptions).toEqual([{ code: "0001", label: "동일명 (0001)" }, { code: "0002", label: "동일명 (0002)" }]);
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ success: true, data: {} }))); await expect(createHttpBidListRepository("https://synthetic-api.test", fetcher).getBidList(query)).rejects.toThrow();
    expect(() => mapBidListResult({ items: [], page: -1 } as unknown as BidNoticeListDto)).toThrow();
  });
});

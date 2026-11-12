import { describe, expect, it, vi } from "vitest";
import { createPersonalFilterApplyController } from "@/features/bid-notice-filters/apply-controller";
import { emptyPersonalFilter, samePersonalFilter } from "@/features/bid-notice-filters/model";
import { currentPersonalFilter } from "@/components/bids/personal-filter-adapter";
import type { PersonalFilterSnapshot, PersonalFilterValues } from "@/data/personal-filters/contracts";
import type { BidFilterOptions, BidListQuery } from "@/data/bids/contracts";

const snapshot = (region = "11"): PersonalFilterSnapshot => ({
  source: "SAVED", version: 3, canImportCompany: true,
  filter: { ...emptyPersonalFilter(), bidTypes: ["CONSTRUCTION"], regionCodes: [region] },
});

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

function setup() {
  let scope = "account1:/bids";
  const port = {
    isCurrent: () => scope === "account1:/bids",
    load: vi.fn<(signal: AbortSignal) => Promise<PersonalFilterSnapshot>>(async () => snapshot()),
    onSnapshot: vi.fn(), onApply: vi.fn(), onEmpty: vi.fn(), onError: vi.fn(), onPending: vi.fn(),
  };
  return { port, controller: createPersonalFilterApplyController(port), setScope: (next: string) => { scope = next; } };
}

describe("내 맞춤 최신 조회·적용 수명", () => {
  it("누를 때마다 새로 읽은 snapshot을 먼저 반영한 뒤 그 필터를 적용한다", async () => {
    const { port, controller } = setup();
    await controller.apply();
    expect(port.onSnapshot).toHaveBeenCalledWith(snapshot());
    expect(port.onApply).toHaveBeenCalledWith(snapshot().filter);
    expect(port.onSnapshot.mock.invocationCallOrder[0]).toBeLessThan(port.onApply.mock.invocationCallOrder[0]);
    port.load.mockResolvedValue(snapshot("26"));
    await controller.apply();
    expect(port.load).toHaveBeenCalledTimes(2);
    expect(port.onApply).toHaveBeenLastCalledWith(snapshot("26").filter);
    expect(port.onPending.mock.calls.map(([value]) => value)).toEqual([true, false, true, false]);
  });

  it("조회 중 중복 입력은 GET과 적용을 한 번만 실행한다", async () => {
    const { port, controller } = setup(); const pending = deferred<PersonalFilterSnapshot>();
    port.load.mockReturnValue(pending.promise);
    const first = controller.apply(); await controller.apply(); await controller.apply();
    expect(controller.pending).toBe(true); expect(port.load).toHaveBeenCalledOnce();
    pending.resolve(snapshot()); await first;
    expect(controller.pending).toBe(false); expect(port.onApply).toHaveBeenCalledOnce();
  });

  it("실패하면 기존 조건에 손대지 않고 명시적인 다음 클릭에서 다시 조회한다", async () => {
    const { port, controller } = setup(); const error = new Error("synthetic failure");
    port.load.mockRejectedValueOnce(error); await controller.apply();
    expect(port.onSnapshot).not.toHaveBeenCalled(); expect(port.onApply).not.toHaveBeenCalled();
    expect(port.onError).toHaveBeenCalledWith(error);
    await controller.apply(); expect(port.load).toHaveBeenCalledTimes(2); expect(port.onApply).toHaveBeenCalledOnce();
  });

  it.each(["EMPTY_DEFAULT", "COMPANY_DEFAULT", "SAVED"] as const)("빈 %s는 최신 상태와 안내만 반영하고 목록을 유지한다", async source => {
    const { port, controller } = setup();
    port.load.mockResolvedValue({ source, version: source === "SAVED" ? 4 : null, canImportCompany: false, filter: emptyPersonalFilter() });
    await controller.apply();
    expect(port.onSnapshot).toHaveBeenCalledOnce(); expect(port.onEmpty).toHaveBeenCalledOnce();
    expect(port.onApply).not.toHaveBeenCalled(); expect(port.onError).not.toHaveBeenCalled();
  });

  it.each(["anonymous:/bids", "account2:/bids", "account1:/bids?region=changed", "account1:/bids?view=result"])("%s로 바뀐 뒤 늦게 도착한 응답은 적용하지 않는다", async scope => {
    const { port, controller, setScope } = setup(); const pending = deferred<PersonalFilterSnapshot>();
    port.load.mockReturnValue(pending.promise); const flight = controller.apply();
    setScope(scope); pending.resolve(snapshot()); await flight;
    expect(port.onSnapshot).not.toHaveBeenCalled(); expect(port.onApply).not.toHaveBeenCalled();
    expect(port.onError).not.toHaveBeenCalled(); expect(controller.pending).toBe(false);
  });

  it("해제하면 진행 중 GET을 취소하고 같은 주소로 돌아와도 이전 응답을 무시한다", async () => {
    const { port, controller } = setup(); const pending = deferred<PersonalFilterSnapshot>();
    port.load.mockReturnValue(pending.promise); const flight = controller.apply();
    const signal = port.load.mock.calls[0][0]; controller.dispose();
    expect(signal.aborted).toBe(true); expect(port.onPending).toHaveBeenLastCalledWith(false);
    pending.resolve(snapshot()); await flight;
    await controller.apply();
    expect(port.load).toHaveBeenCalledOnce(); expect(port.onApply).not.toHaveBeenCalled();
  });

  it("이전 화면 요청의 늦은 실패도 현재 화면 안내를 덮지 않는다", async () => {
    const { port, controller, setScope } = setup(); const pending = deferred<PersonalFilterSnapshot>();
    port.load.mockReturnValue(pending.promise); const flight = controller.apply(); setScope("account2:/bids");
    pending.reject(new Error("old request")); await flight;
    expect(port.onError).not.toHaveBeenCalled(); expect(port.onPending).toHaveBeenLastCalledWith(false);
  });
});

const options: BidFilterOptions = {
  regions: ["서울특별시"], industries: ["토목공사업"], contractMethods: ["일반경쟁"],
  regionOptions: [{ code: "11", label: "서울특별시" }], industryOptions: [{ code: "0001", label: "토목공사업" }],
};
const query: BidListQuery = { view: "all", query: "", page: 1, size: 10, category: "construction", region: "서울특별시" };
const changes: [string, Partial<PersonalFilterValues>][] = [
  ["유형", { bidTypes: ["SERVICE"] }], ["지역", { regionCodes: ["26"] }],
  ["업종", { industryCodes: ["0001"] }], ["계약", { contractMethods: ["LIMITED"] }],
  ["날짜 기준", { dateType: "BID_CLOSE" }], ["시작일", { dateFrom: "2030-01-01" }],
  ["종료일", { dateTo: "2030-12-31" }], ["금액 기준", { amountType: "BASE_PRICE" }],
  ["최소 금액 0", { amountMin: 0 }], ["최대 금액", { amountMax: 100_000_000 }],
  ["지역 업체", { regionOnly: true }], ["공동 도급", { jointContract: "REQUIRED" }],
];

describe("내 맞춤 버튼의 전체 조건 비교", () => {
  it("personal URL 표시가 없어도 일반 필터가 같으면 일치하고 검색/페이지는 제외한다", () => {
    const ordinary = currentPersonalFilter({ ...query, query: "keyword", page: 2, size: 30 }, options);
    expect(samePersonalFilter(ordinary, snapshot().filter)).toBe(true);
    expect(samePersonalFilter(currentPersonalFilter({ ...query, personalFilter: ordinary }, options), snapshot().filter)).toBe(true);
  });
  it.each(changes)("%s 한 필드 변경은 불일치, 원래 조건으로 복귀하면 다시 일치한다", (_label, patch) => {
    const saved = snapshot().filter;
    expect(samePersonalFilter({ ...saved, ...patch }, saved)).toBe(false);
    expect(samePersonalFilter(currentPersonalFilter(query, options), saved)).toBe(true);
  });
  it("서버 배열의 순서가 달라도 같은 조건으로 비교한다", () => {
    const left = { ...snapshot().filter, regionCodes: ["11", "26"], bidTypes: ["CONSTRUCTION", "SERVICE"] as PersonalFilterValues["bidTypes"] };
    const right = { ...left, regionCodes: ["26", "11"], bidTypes: ["SERVICE", "CONSTRUCTION"] as PersonalFilterValues["bidTypes"] };
    expect(samePersonalFilter(left, right)).toBe(true);
  });
});

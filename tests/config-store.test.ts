import { describe, expect, it } from "vitest";
import { appEnvironment, assertDeployment, dataGroups, resolveDataConfig } from "@/data/config";
import { MockStore, memoryStorage } from "@/data/mock/store";

const config = () => resolveDataConfig({ MATE_DATA_PROFILE: "mock", MATE_APP_ENV: "local" });
describe("빌드 공급원 설정", () => {
  it("기본 API와 7개 mock 그룹을 명시적으로 선택한다", () => {
    expect(Object.values(resolveDataConfig({}).sources)).toEqual(dataGroups.map(() => "api"));
    expect(Object.values(config().sources)).toEqual(dataGroups.map(() => "mock"));
  });
  it("혼합 제약, 알 수 없는 설정, 운영 환경을 차단한다", () => {
    for (const env of [
      { MATE_DATA_PROFILE: "unknown" },
      { MATE_DATA_PROFILE: "mock" },
      { MATE_DATA_PROFILE: "hybrid", MATE_DATA_OVERRIDES: '{"auth":"mock"}' },
      { MATE_DATA_PROFILE: "hybrid", MATE_DATA_OVERRIDES: '{"bids":"mock"}' },
      { MATE_DATA_PROFILE: "hybrid", MATE_DATA_OVERRIDES: '{"unknown":"mock"}' },
      { MATE_DATA_PROFILE: "mock", MATE_APP_ENV: "local", MATE_MOCK_SCENARIOS: '{"auth":"unknown"}' },
      { MATE_DATA_PROFILE: "api", MATE_MOCK_SCENARIOS: '{"auth":"default"}' },
    ]) expect(() => resolveDataConfig(env)).toThrow();
    expect(() => assertDeployment(config(), { VERCEL_ENV: "production", MATE_APP_ENV: "local" })).toThrow();
    expect(appEnvironment({ VERCEL_ENV: "preview", MATE_APP_ENV: "production" })).toBe("preview");
  });
  it("실제 인증과 mock 회사, mock 인증과 공개 API를 허용한다", () => {
    expect(resolveDataConfig({ MATE_DATA_PROFILE: "hybrid", MATE_APP_ENV: "preview", MATE_DATA_OVERRIDES: '{"company":"mock"}' }).sources.company).toBe("mock");
    expect(resolveDataConfig({ MATE_DATA_PROFILE: "hybrid", MATE_APP_ENV: "local", MATE_DATA_OVERRIDES: JSON.stringify(Object.fromEntries(dataGroups.filter(k => k !== "bids").map(k => [k,"mock"]))) }).sources.bids).toBe("api");
  });
});
describe("탭별 mock 저장소", () => {
  const valid = (value: unknown): value is { count: number } => !!value && typeof value === "object" && "count" in value && typeof value.count === "number";
  it("재생성, 계정, 설정, 환경 격리와 초기화를 보장한다", () => {
    const storage = memoryStorage(); const store = new MockStore(config(), () => storage);
    store.write("1", "test", { count: 4 }); storage.setItem("unrelated", "keep");
    expect(new MockStore(config(), () => storage).read("1", "test", () => ({ count: 0 }), valid).count).toBe(4);
    expect(store.read("2", "test", () => ({ count: 0 }), valid).count).toBe(0);
    const other = new MockStore({ ...config(), fingerprint: "different" }, () => storage);
    expect(other.read("1", "test", () => ({ count: 0 }), valid).count).toBe(0);
    store.reset(); expect(storage.getItem("unrelated")).toBe("keep");
    expect(other.read("1", "test", () => ({ count: 1 }), valid).count).toBe(0);
  });
  it("손상 데이터는 해당 공간만 초기화한다", () => {
    const storage = memoryStorage(); const store = new MockStore(config(), () => storage);
    storage.setItem(store.key("1", "test"), "{broken"); store.write("2", "test", { count: 8 });
    expect(store.read("1", "test", () => ({ count: 0 }), valid).count).toBe(0);
    expect(store.read("2", "test", () => ({ count: 0 }), valid).count).toBe(8);
  });
  it("사용 불가와 용량 초과는 메모리로 계속 동작한다", () => {
    for (const storage of [() => { throw new Error("disabled"); }, () => ({ ...memoryStorage(), setItem() { throw new Error("quota"); } })]) {
      const store = new MockStore(config(), storage);
      store.write("1", "test", { count: 5 });
      expect(store.persistent).toBe(false);
      expect(store.read("1", "test", () => ({ count: 0 }), valid).count).toBe(5);
    }
  });
});

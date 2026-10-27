import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/data/shared/errors";
import { createHttpClient } from "@/data/shared/http";
const { request: apiRequest, authorized: authorizedRequest } = createHttpClient("https://synthetic-api.invalid");

const response = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status });
afterEach(() => vi.unstubAllGlobals());
describe("기존 공통 API 요청 회귀", () => {
  it("isSuccess와 쿠키, 토큰, 멱등성, 취소, 캐시 정책을 유지한다", async () => {
    const fetcher = vi.fn().mockResolvedValue(response({ isSuccess: true, data: { id: 1 } }));
    vi.stubGlobal("fetch", fetcher);
    const signal = new AbortController().signal;
    expect(await apiRequest("/test", { method: "POST", body: { value: 1 }, token: "synthetic-token", idempotencyKey: "synthetic-key", signal })).toEqual({ id: 1 });
    const init = fetcher.mock.calls[0][1];
    expect(init).toMatchObject({ method: "POST", credentials: "include", cache: "no-store", signal });
    expect(init.headers.get("Authorization")).toBe("Bearer synthetic-token");
    expect(init.headers.get("Idempotency-Key")).toBe("synthetic-key");
  });
  it.each([{ success: true, data: {} }, { isSuccess: true }, { isSuccess: false, code: "NE005", message: "expired" }])("응답 오류를 성공으로 취급하지 않는다", async (body) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response(body)));
    await expect(apiRequest("/test")).rejects.toBeInstanceOf(ApiError);
  });
  it("빈 응답 허용과 네트워크 오류, 취소를 구분한다", async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(response({ isSuccess: true })).mockRejectedValueOnce(new Error("offline")).mockRejectedValueOnce(new DOMException("aborted", "AbortError"));
    vi.stubGlobal("fetch", fetcher);
    expect(await apiRequest("/test", { allowEmptyData: true })).toBeUndefined();
    await expect(apiRequest("/test")).rejects.toMatchObject({ code: "NETWORK_ERROR", status: 0 });
    await expect(apiRequest("/test")).rejects.toMatchObject({ name: "AbortError" });
  });
  it("401은 세션을 갱신하고 한 번만 재요청한다", async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(response({ isSuccess: false }, 401)).mockResolvedValueOnce(response({ isSuccess: true, data: 7 }));
    vi.stubGlobal("fetch", fetcher);
    const refresh = vi.fn().mockResolvedValue({ accessToken: "synthetic-refreshed" });
    expect(await authorizedRequest({ getAccessToken: async () => "synthetic-token", getAccountKey: () => "1", refresh }, "/test")).toBe(7);
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(fetcher.mock.calls[1][1].headers.get("Authorization")).toBe("Bearer synthetic-refreshed");
  });
  it("늦은 성공 응답과 다른 계정의 401 응답은 폐기하고 새 계정을 갱신하지 않는다", async () => {
    for (const status of [200, 401]) {
      let resolve!: (response: Response) => void; let account = "1";
      const fetcher = vi.fn<typeof fetch>(() => new Promise(done => { resolve = done; }));
      const client = createHttpClient("https://synthetic.test", fetcher); const refresh = vi.fn();
      const pending = client.authorized({ getAccountKey: () => account, getAccessToken: async () => "synthetic", refresh }, "/late");
      await vi.waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1)); account = "2";
      resolve(response({ isSuccess: status === 200, data: { account: 1 } }, status));
      await expect(pending).rejects.toMatchObject(status === 200 ? { code: "ACCOUNT_CHANGED" } : { status: 401 });
      expect(refresh).not.toHaveBeenCalled(); expect(fetcher).toHaveBeenCalledTimes(1);
    }
  });
});

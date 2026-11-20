import { ApiError } from "./errors";
import type { Authentication } from "../auth/contracts";

export type AuthAccess = {
  getAccessToken: () => Promise<string>;
  refresh: (options?: { preserveOnError?: boolean }) => Promise<Authentication | null>;
  getAccountKey: () => string | null;
  assertRequestScope?: () => void;
};
export type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  token?: string;
  idempotencyKey?: string;
  signal?: AbortSignal;
  allowEmptyData?: boolean;
  allowNoContent?: boolean;
  retryUnauthorized?: boolean;
};
export type HttpClient = ReturnType<typeof createHttpClient>;

export function createHttpClient(baseUrl: string, fetcher: typeof fetch = (...args) => fetch(...args)) {
  async function request<T>(path: string, options: ApiOptions = {}, assertRequestScope?: () => void): Promise<T> {
    const headers = new Headers();
    if (options.body !== undefined) headers.set("Content-Type", "application/json");
    if (options.token) headers.set("Authorization", `Bearer ${options.token}`);
    if (options.idempotencyKey) headers.set("Idempotency-Key", options.idempotencyKey);
    let response: Response;
    options.signal?.throwIfAborted();
    assertRequestScope?.();
    try {
      response = await fetcher(`${baseUrl}${path}`, {
        method: options.method ?? "GET", headers,
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        credentials: "include", cache: "no-store", signal: options.signal,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") throw error;
      throw new ApiError(0, "NETWORK_ERROR", "서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
    if (response.status === 204 && options.allowNoContent && (options.method ?? "GET") === "GET") return null as T;
    const payload = await response.json().catch(() => null) as { isSuccess?: boolean; data?: T; code?: string; message?: string } | null;
    if (!response.ok || payload?.isSuccess !== true) throw new ApiError(response.status, payload?.code ?? null, payload?.message || "요청을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    if (payload.data == null && !options.allowEmptyData) throw new ApiError(response.status, "EMPTY_RESPONSE", "서버 응답을 확인하지 못했습니다. 다시 시도해 주세요.");
    return payload.data as T;
  }
  async function authorized<T>(access: AuthAccess, path: string, options: ApiOptions = {}): Promise<T> {
    const accountKey = access.getAccountKey();
    const token = await access.getAccessToken();
    if (accountKey !== access.getAccountKey()) throw new ApiError(401, "ACCOUNT_CHANGED", "로그인 계정이 변경됐습니다. 다시 시도해 주세요.");
    try {
      const result = await request<T>(path, { ...options, token }, access.assertRequestScope);
      if (accountKey !== access.getAccountKey()) throw new ApiError(401, "ACCOUNT_CHANGED", "로그인 계정이 변경됐습니다. 다시 시도해 주세요.");
      return result;
    } catch (error) {
      if (options.retryUnauthorized === false || !(error instanceof ApiError) || error.status !== 401 || error.code === "ACCOUNT_CHANGED"
        || accountKey !== access.getAccountKey()) throw error;
      const session = await access.refresh();
      if (!session || accountKey !== access.getAccountKey()) throw error;
      const result = await request<T>(path, { ...options, token: session.accessToken }, access.assertRequestScope);
      if (accountKey !== access.getAccountKey()) throw new ApiError(401, "ACCOUNT_CHANGED", "로그인 계정이 변경됐습니다. 다시 시도해 주세요.");
      return result;
    }
  }
  return { request, authorized, baseUrl, fetch: fetcher };
}

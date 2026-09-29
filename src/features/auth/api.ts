import type { Authentication, CompleteSignup, SocialSignup } from "./types";

const DEFAULT_API_BASE_URL = "https://api-test.mate-bid.com";

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_MATE_API_BASE_URL?.replace(/\/+$/, "") ?? DEFAULT_API_BASE_URL;

type CommonResponse<T> = {
  isSuccess: boolean;
  data?: T | null;
  code?: string | null;
  message?: string | null;
};

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string | null,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  token?: string;
  idempotencyKey?: string;
  signal?: AbortSignal;
  allowEmptyData?: boolean;
};

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers();
  if (options.body !== undefined) headers.set("Content-Type", "application/json");
  if (options.token) headers.set("Authorization", `Bearer ${options.token}`);
  if (options.idempotencyKey) headers.set("Idempotency-Key", options.idempotencyKey);

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      credentials: "include",
      cache: "no-store",
      signal: options.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError(0, "NETWORK_ERROR", "서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.");
  }

  const payload = (await response.json().catch(() => null)) as CommonResponse<T> | null;
  if (!response.ok || payload?.isSuccess !== true) {
    throw new ApiError(
      response.status,
      payload?.code ?? null,
      payload?.message || "요청을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    );
  }
  if (payload.data == null && !options.allowEmptyData) {
    throw new ApiError(response.status, "EMPTY_RESPONSE", "서버 응답을 확인하지 못했습니다. 다시 시도해 주세요.");
  }
  return payload.data as T;
}

export function googleAuthorizationUrl(returnTo: string): string {
  const query = new URLSearchParams({ returnTo, returnOrigin: window.location.origin });
  return `${apiBaseUrl}/api/v1/auth/oauth/google/authorizations?${query}`;
}

function withFlowId(path: string, flowId: string): string {
  return `${path}?flowId=${encodeURIComponent(flowId)}`;
}

export function completeGoogleSession(flowId: string): Promise<Authentication> {
  return apiRequest<Authentication>(withFlowId("/api/v1/auth/oauth/google/session-completions", flowId), { method: "POST" });
}

export function getCurrentSocialSignup(flowId: string): Promise<SocialSignup> {
  return apiRequest<SocialSignup>(withFlowId("/api/v1/auth/social-signups/current", flowId));
}

export function completeSocialSignup(flowId: string, input: CompleteSignup): Promise<Authentication> {
  return apiRequest<Authentication>(withFlowId("/api/v1/auth/social-signups", flowId), { method: "POST", body: input });
}

export function refreshBrowserSession(): Promise<Authentication> {
  return apiRequest<Authentication>("/api/v1/auth/token/refresh", { method: "POST" });
}

export function logoutBrowserSession(): Promise<void> {
  return apiRequest<void>("/api/v1/auth/logout", { method: "POST", allowEmptyData: true });
}

export function errorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : "요청을 완료하지 못했습니다. 다시 시도해 주세요.";
}

export type AuthAccess = {
  getAccessToken: () => Promise<string>;
  refresh: () => Promise<Authentication | null>;
};

export async function authorizedRequest<T>(access: AuthAccess, path: string, options: ApiOptions = {}): Promise<T> {
  const token = await access.getAccessToken();
  try {
    return await apiRequest<T>(path, { ...options, token });
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error;
    const session = await access.refresh();
    if (!session) throw error;
    return apiRequest<T>(path, { ...options, token: session.accessToken });
  }
}

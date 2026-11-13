import type { HttpClient } from "../shared/http";
import { ApiError } from "../shared/errors";
import type { Authentication, CompleteSignup, SocialSignup, AuthRepository } from "./contracts";

type AuthenticationDto = Omit<Authentication, "account"> & {
  account: { id: number; email: string; nickname?: string | null };
};

function toAuthentication(dto: AuthenticationDto): Authentication {
  const nickname = dto.account.nickname;
  if (nickname != null && typeof nickname !== "string") {
    throw new ApiError(502, "INVALID_AUTH_RESPONSE", "로그인 정보를 확인할 수 없습니다. 다시 시도해 주세요.");
  }
  return { ...dto, account: { ...dto.account, nickname: nickname ?? null } };
}

export function createHttpAuthRepository(http: HttpClient): AuthRepository {
  const apiRequest = http.request;
  const apiBaseUrl = http.baseUrl;
function googleAuthorizationUrl(returnTo: string, returnOrigin: string): string {
  const query = new URLSearchParams({ returnTo, returnOrigin });
  return `${apiBaseUrl}/api/v1/auth/oauth/google/authorizations?${query}`;
}

function withFlowId(path: string, flowId: string): string {
  return `${path}?flowId=${encodeURIComponent(flowId)}`;
}

function completeGoogleSession(flowId: string): Promise<Authentication> {
  return apiRequest<AuthenticationDto>(withFlowId("/api/v1/auth/oauth/google/session-completions", flowId), { method: "POST" }).then(toAuthentication);
}

function getCurrentSocialSignup(flowId: string): Promise<SocialSignup> {
  return apiRequest<SocialSignup>(withFlowId("/api/v1/auth/social-signups/current", flowId));
}

function completeSocialSignup(flowId: string, input: CompleteSignup): Promise<Authentication> {
  return apiRequest<AuthenticationDto>(withFlowId("/api/v1/auth/social-signups", flowId), { method: "POST", body: input }).then(toAuthentication);
}

function refreshBrowserSession(): Promise<Authentication> {
  return apiRequest<AuthenticationDto>("/api/v1/auth/token/refresh", { method: "POST" }).then(toAuthentication);
}

function logoutBrowserSession(): Promise<void> {
  return apiRequest<void>("/api/v1/auth/logout", { method: "POST", allowEmptyData: true });
}

  return { googleAuthorizationUrl, completeGoogleSession, getCurrentSocialSignup, completeSocialSignup, refreshBrowserSession, logoutBrowserSession };
}

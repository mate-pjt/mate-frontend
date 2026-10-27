import type { HttpClient } from "../shared/http";
import type { Authentication, CompleteSignup, SocialSignup, AuthRepository } from "./contracts";

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
  return apiRequest<Authentication>(withFlowId("/api/v1/auth/oauth/google/session-completions", flowId), { method: "POST" });
}

function getCurrentSocialSignup(flowId: string): Promise<SocialSignup> {
  return apiRequest<SocialSignup>(withFlowId("/api/v1/auth/social-signups/current", flowId));
}

function completeSocialSignup(flowId: string, input: CompleteSignup): Promise<Authentication> {
  return apiRequest<Authentication>(withFlowId("/api/v1/auth/social-signups", flowId), { method: "POST", body: input });
}

function refreshBrowserSession(): Promise<Authentication> {
  return apiRequest<Authentication>("/api/v1/auth/token/refresh", { method: "POST" });
}

function logoutBrowserSession(): Promise<void> {
  return apiRequest<void>("/api/v1/auth/logout", { method: "POST", allowEmptyData: true });
}

  return { googleAuthorizationUrl, completeGoogleSession, getCurrentSocialSignup, completeSocialSignup, refreshBrowserSession, logoutBrowserSession };
}

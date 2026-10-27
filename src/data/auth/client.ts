import { getDataConfig } from "../config";
import { getMockRuntime } from "../mock/runtime";
import { getHttpClient } from "../shared/client";
import { sanitizeLocalNextPath } from "@/lib/auth-redirect";
import type { AuthRepository, LoginChoice } from "./contracts";
import { createHttpAuthRepository } from "./http-repository";
import { createMockAuthRepository } from "./mock-repository";

let repository: AuthRepository | null = null;
function getRepository(): AuthRepository {
  return repository ??= getDataConfig().sources.auth === "mock" ? createMockAuthRepository(getMockRuntime()) : createHttpAuthRepository(getHttpClient());
}
export function getLoginChoices(): { id: LoginChoice; label: string }[] {
  return getDataConfig().sources.auth === "mock"
    ? [{ id: "existing", label: "가상 계정으로 로그인" }, { id: "signup", label: "가상 계정 신규 가입" }, { id: "alternate", label: "다른 가상 계정으로 로그인" }]
    : [{ id: "existing", label: "Google로 로그인" }];
}
export const googleAuthorizationUrl = (returnTo: string, choice?: LoginChoice) => getRepository().googleAuthorizationUrl(sanitizeLocalNextPath(returnTo), window.location.origin, choice);
export const completeGoogleSession: AuthRepository["completeGoogleSession"] = (...args) => getRepository().completeGoogleSession(...args);
export const getCurrentSocialSignup: AuthRepository["getCurrentSocialSignup"] = (...args) => getRepository().getCurrentSocialSignup(...args);
export const completeSocialSignup: AuthRepository["completeSocialSignup"] = (...args) => getRepository().completeSocialSignup(...args);
export const refreshBrowserSession: AuthRepository["refreshBrowserSession"] = (...args) => getRepository().refreshBrowserSession(...args);
export const logoutBrowserSession: AuthRepository["logoutBrowserSession"] = (...args) => getRepository().logoutBrowserSession(...args);

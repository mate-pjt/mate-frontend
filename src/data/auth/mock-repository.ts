import { sanitizeLocalNextPath } from "@/lib/auth-redirect";
import { ApiError } from "../shared/errors";
import { mockOperation, type MockRuntime } from "../mock/runtime";
import { isCount, isRecord } from "../mock/validation";
import type { Authentication, AuthRepository, SocialSignup } from "./contracts";

type PendingAuth = { flows: Record<string, { accountId: number; signup: boolean; expiresAt: number }>; nextAccountId: number };
const pendingValid = (value: unknown): value is PendingAuth => {
  return isRecord(value) && isCount(value.nextAccountId) && value.nextAccountId >= 101 && isRecord(value.flows) && Object.values(value.flows).every((flow) => isRecord(flow) && isCount(flow.accountId) && flow.accountId > 0 && typeof flow.signup === "boolean" && typeof flow.expiresAt === "number" && Number.isFinite(flow.expiresAt));
};
type MockSession = { accountId: number; expiresAt: number };
const sessionValid = (value: unknown): value is MockSession => isRecord(value) && isCount(value.accountId) && typeof value.expiresAt === "number" && Number.isFinite(value.expiresAt);

export function createMockAuthRepository(runtime: MockRuntime): AuthRepository {
  const pending = () => runtime.store.read<PendingAuth>("anonymous", "auth-flows", () => ({ flows: {}, nextAccountId: 101 }), pendingValid);
  function flow(flowId: string) {
    const item = pending().flows[flowId];
    if (!item || runtime.scenario("auth") === "invalid-flow") throw new ApiError(400, "AUTH_FLOW_INVALID", "가상 로그인 흐름이 올바르지 않습니다. 다시 시작해 주세요.");
    if (item.expiresAt <= runtime.now()) throw new ApiError(401, "AUTH_FLOW_EXPIRED", "가상 로그인 시간이 만료됐습니다. 다시 시작해 주세요.");
    return item;
  }
  function authentication(accountId: number): Authentication {
    return { accessToken: `mock-session-${accountId}`, tokenType: "Mock", expiresInSeconds: 3600,
      account: { id: accountId, email: `demo${accountId}@example.test` }, companyContext: null,
      companyOnboarding: { status: "NOT_STARTED", availableActions: ["START_NOW", "FIND_COMPANY", "REGISTER_COMPANY"] } };
  }
  function complete(accountId: number) {
    runtime.store.write("anonymous", "auth-session", { accountId, expiresAt: runtime.now() + 24 * 60 * 60 * 1000 });
    return authentication(accountId);
  }
  return {
    googleAuthorizationUrl(returnTo, _returnOrigin, choice = "existing") {
      const state = pending();
      const signup = choice === "signup" || runtime.scenario("auth") === "signup";
      const flowId = crypto.randomUUID();
      const accountId = signup ? state.nextAccountId++ : choice === "alternate" ? 2 : 1;
      state.flows[flowId] = { accountId, signup, expiresAt: runtime.now() + (runtime.scenario("auth") === "expired" ? -1 : 10 * 60 * 1000) };
      // Retain only active synthetic flows; no OAuth tokens or signup input are persisted.
      state.flows = Object.fromEntries(Object.entries(state.flows).filter(([, item]) => item.expiresAt > runtime.now() - 60_000));
      runtime.store.write("anonymous", "auth-flows", state);
      return `${signup ? "/auth/signup" : "/auth/callback"}?${new URLSearchParams({ flowId, returnTo: sanitizeLocalNextPath(returnTo) })}`;
    },
    async completeGoogleSession(flowId) {
      await mockOperation(runtime, "auth");
      const item = flow(flowId);
      if (item.signup) throw new ApiError(400, "SIGNUP_REQUIRED", "가상 가입 화면에서 가입을 완료해 주세요.");
      return complete(item.accountId);
    },
    async getCurrentSocialSignup(flowId): Promise<SocialSignup> {
      await mockOperation(runtime, "auth");
      const item = flow(flowId);
      if (!item.signup) throw new ApiError(400, "SIGNUP_FLOW_INVALID", "가입 흐름이 아닙니다.");
      return { verifiedEmail: `demo${item.accountId}@example.test`, suggestedName: "가상 사용자", profileImageUrl: null,
        expiresAt: new Date(item.expiresAt).toISOString(), requiredAgreements: [
          { code: "TERMS_OF_SERVICE", version: "mock-v1", title: "이용약관" },
          { code: "PRIVACY_POLICY", version: "mock-v1", title: "개인정보 처리방침" },
        ] };
    },
    async completeSocialSignup(flowId, input) {
      const signup = await this.getCurrentSocialSignup(flowId);
      if (!input.name.trim() || !signup.requiredAgreements.every((agreement) => input.agreementAcceptances.some((item) => item.code === agreement.code && item.version === agreement.version))) throw new ApiError(400, "AGREEMENTS_REQUIRED", "이름과 필수 약관을 확인해 주세요.");
      return complete(flow(flowId).accountId);
    },
    async refreshBrowserSession() {
      await mockOperation(runtime, "auth");
      const session = runtime.store.read("anonymous", "auth-session", () => ({ accountId: 0, expiresAt: 0 }), sessionValid);
      if (!session.accountId || session.expiresAt <= runtime.now()) throw new ApiError(401, "SESSION_INVALID", "가상 로그인이 필요합니다.");
      return authentication(session.accountId);
    },
    async logoutBrowserSession() { runtime.store.remove("anonymous", "auth-session"); },
  };
}

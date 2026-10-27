import { ApiError } from "../shared/errors";
import { mockAccount, type MockRuntime } from "../mock/runtime";
import { isCount, isDate, isRecord } from "../mock/validation";
import type { NotificationEmailSetting, NotificationEmailVerification, NotificationSettingsRepository } from "./contracts";

type EmailState = { setting: NotificationEmailSetting; enabled: boolean; verification: (NotificationEmailVerification & { email: string; attempts: number }) | null };
function valid(value: unknown): value is EmailState {
  if (!isRecord(value) || !isRecord(value.setting)) return false;
  const setting = value.setting; const v = value.verification;
  return typeof value.enabled === "boolean" && typeof setting.signupEmail === "string" && (setting.alternateEmail === null || typeof setting.alternateEmail === "string") &&
    (setting.recipientType === "SIGNUP_EMAIL" ? setting.recipientEmail === setting.signupEmail : setting.recipientType === "ALTERNATE_EMAIL" && typeof setting.alternateEmail === "string" && setting.recipientEmail === setting.alternateEmail) &&
    (v === null || (isRecord(v) && typeof v.verificationId === "string" && isDate(v.expiresAt) && isDate(v.resendAvailableAt) && typeof v.email === "string" && isCount(v.attempts)));
}
export function createMockNotificationSettingsRepository(runtime: MockRuntime): NotificationSettingsRepository {
  const read = (account: string) => runtime.store.read(account, "notification-settings", () => {
    const signupEmail = `demo${account}@example.test`;
    return { setting: { signupEmail, alternateEmail: null, recipientType: "SIGNUP_EMAIL" as const, recipientEmail: signupEmail }, enabled: false, verification: null };
  }, valid);
  const write = (account: string, state: EmailState) => runtime.store.write(account, "notification-settings", state);
  function begin(email: string, id = crypto.randomUUID()) {
    return { verificationId: id, email, attempts: 0, expiresAt: new Date(runtime.now() + 10 * 60_000).toISOString(), resendAvailableAt: new Date(runtime.now() + 30_000).toISOString() };
  }
  function verification(state: EmailState, id: string) {
    if (!state.verification || state.verification.verificationId !== id) throw new ApiError(404, "NE005", "인증 요청을 찾지 못했습니다. 다시 인증해 주세요.");
    return state.verification;
  }
  return {
    async getNotificationEmailSetting(access, signal) { return read(await mockAccount(runtime, access, "notificationSettings", signal)).setting; },
    async changeNotificationEmailRecipient(access, type) {
      const account = await mockAccount(runtime, access, "notificationSettings"); const state = read(account);
      if (type === "ALTERNATE_EMAIL" && !state.setting.alternateEmail) throw new ApiError(400, "NE004", "이메일을 먼저 인증해 주세요.");
      state.setting.recipientType = type; state.setting.recipientEmail = type === "SIGNUP_EMAIL" ? state.setting.signupEmail : state.setting.alternateEmail!;
      write(account, state); return state.setting;
    },
    async startNotificationEmailVerification(access, email) {
      const account = await mockAccount(runtime, access, "notificationSettings");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ApiError(400, "NE001", "이메일 형식을 확인해 주세요.");
      const state = read(account); state.verification = begin(email); write(account, state); return state.verification;
    },
    async resendNotificationEmailVerification(access, id) {
      const account = await mockAccount(runtime, access, "notificationSettings"); const state = read(account); const current = verification(state, id);
      if (Date.parse(current.resendAvailableAt) > runtime.now()) throw new ApiError(429, "NE006", "잠시 후 다시 보내 주세요.");
      state.verification = begin(current.email, id); write(account, state); return state.verification;
    },
    async confirmNotificationEmailVerification(access, id, code) {
      const account = await mockAccount(runtime, access, "notificationSettings"); const state = read(account); const current = verification(state, id);
      if (runtime.scenario("notificationSettings") === "expired" || Date.parse(current.expiresAt) <= runtime.now()) {
        state.verification = null; write(account, state); throw new ApiError(400, "NE005", "인증 시간이 만료됐습니다. 다시 인증해 주세요.");
      }
      if (runtime.scenario("notificationSettings") === "blocked" || current.attempts >= 5) throw new ApiError(429, "NE006", "인증 시도 횟수를 초과했습니다. 다시 인증해 주세요.");
      if (code !== "1234") { current.attempts += 1; write(account, state); throw new ApiError(400, "NE004", "가상 인증번호가 일치하지 않습니다."); }
      state.setting = { ...state.setting, alternateEmail: current.email, recipientType: "ALTERNATE_EMAIL", recipientEmail: current.email };
      state.verification = null; write(account, state); return state.setting;
    },
    async getMatchedBidEmailSetting(access, signal) { return { enabled: read(await mockAccount(runtime, access, "notificationSettings", signal)).enabled }; },
    async changeMatchedBidEmailSetting(access, enabled) {
      const account = await mockAccount(runtime, access, "notificationSettings"); const state = read(account); state.enabled = enabled; write(account, state); return { enabled };
    },
  };
}

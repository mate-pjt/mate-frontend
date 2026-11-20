import { ApiError } from "../shared/errors";
import { mockAccount, type MockRuntime } from "../mock/runtime";
import { isCount, isDate, isRecord } from "../mock/validation";
import type { NotificationEmailSetting, NotificationEmailVerification, NotificationSettingsRepository } from "./contracts";

const verificationLifetime = 3 * 60_000;
const resendDelay = 60_000;
const legacyResendDelay = 30_000;
const maxAttempts = 5;
const codeSpaceSize = 10_000;
const firstMockCode = 1234;

type EmailState = {
  setting: NotificationEmailSetting;
  enabled: boolean;
  verification: (NotificationEmailVerification & { email: string; attempts: number }) | null;
  lastIssuedIndex?: number;
};

function valid(value: unknown): value is EmailState {
  if (!isRecord(value) || !isRecord(value.setting)) return false;
  const setting = value.setting; const v = value.verification;
  return typeof value.enabled === "boolean" && typeof setting.signupEmail === "string" && (setting.alternateEmail === null || typeof setting.alternateEmail === "string") &&
    (setting.recipientType === "SIGNUP_EMAIL" ? setting.recipientEmail === setting.signupEmail : setting.recipientType === "ALTERNATE_EMAIL" && typeof setting.alternateEmail === "string" && setting.recipientEmail === setting.alternateEmail) &&
    (value.lastIssuedIndex === undefined || (isCount(value.lastIssuedIndex) && value.lastIssuedIndex < codeSpaceSize)) &&
    (v === null || (isRecord(v) && typeof v.verificationId === "string" && isDate(v.expiresAt) && isDate(v.resendAvailableAt) && typeof v.email === "string" && isCount(v.attempts)));
}

function verificationTimes(sentAt: number) {
  return {
    expiresAt: new Date(sentAt + verificationLifetime).toISOString(),
    resendAvailableAt: new Date(sentAt + resendDelay).toISOString(),
  };
}

export function createMockNotificationSettingsRepository(runtime: MockRuntime): NotificationSettingsRepository {
  const write = (account: string, state: EmailState) => runtime.store.write(account, "notification-settings", state);
  function read(account: string) {
    const state = runtime.store.read<EmailState>(account, "notification-settings", () => {
      const signupEmail = `demo${account}@example.test`;
      return { setting: { signupEmail, alternateEmail: null, recipientType: "SIGNUP_EMAIL", recipientEmail: signupEmail }, enabled: false, verification: null };
    }, valid);
    if (state.verification && state.lastIssuedIndex === undefined) {
      // A legacy request used a fixed code and stored a 30-second resend deadline.
      const sentAt = Date.parse(state.verification.resendAvailableAt) - legacyResendDelay;
      state.verification = { ...state.verification, ...verificationTimes(sentAt) };
      state.lastIssuedIndex = 0;
      write(account, state);
    }
    return state;
  }
  function verification(state: EmailState, id: string) {
    if (!state.verification || state.verification.verificationId !== id) throw new ApiError(404, "NE005", "인증 요청을 찾지 못했습니다. 다시 인증해 주세요.");
    return state.verification;
  }
  function issue(account: string, state: EmailState, email: string): NotificationEmailVerification {
    const now = runtime.now();
    if (state.verification && Date.parse(state.verification.resendAvailableAt) > now) {
      throw new ApiError(429, "NE006", "잠시 후 다시 보내 주세요.");
    }

    const issued = { verificationId: crypto.randomUUID(), ...verificationTimes(now) };
    state.verification = { ...issued, email, attempts: 0 };
    state.lastIssuedIndex = ((state.lastIssuedIndex ?? -1) + 1) % codeSpaceSize;
    write(account, state);
    return issued;
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
      return issue(account, read(account), email);
    },
    async resendNotificationEmailVerification(access, id) {
      const account = await mockAccount(runtime, access, "notificationSettings"); const state = read(account); const current = verification(state, id);
      return issue(account, state, current.email);
    },
    async confirmNotificationEmailVerification(access, id, code) {
      const account = await mockAccount(runtime, access, "notificationSettings"); const state = read(account); const current = verification(state, id);
      const expired = Date.parse(current.expiresAt) <= runtime.now();
      const scenario = runtime.scenario("notificationSettings");
      if (expired || scenario === "expired") {
        if (expired) {
          state.verification = null;
          write(account, state);
        }
        throw new ApiError(400, "NE005", "인증 시간이 만료됐습니다. 다시 인증해 주세요.");
      }
      const attemptsExceeded = () => new ApiError(429, "NE006", "인증 시도 횟수를 초과했습니다. 다시 인증해 주세요.");
      if (scenario === "blocked" || current.attempts >= maxAttempts) throw attemptsExceeded();
      const mockCode = (firstMockCode + (state.lastIssuedIndex ?? 0)) % codeSpaceSize;
      if (code !== String(mockCode).padStart(4, "0")) {
        current.attempts += 1;
        write(account, state);
        if (current.attempts === maxAttempts) throw attemptsExceeded();
        throw new ApiError(400, "NE004", "가상 인증번호가 일치하지 않습니다.");
      }
      state.setting = { ...state.setting, alternateEmail: current.email, recipientType: "ALTERNATE_EMAIL", recipientEmail: current.email };
      state.verification = null; write(account, state); return state.setting;
    },
    async getMatchedBidEmailSetting(access, signal) { return { enabled: read(await mockAccount(runtime, access, "notificationSettings", signal)).enabled }; },
    async changeMatchedBidEmailSetting(access, enabled) {
      const account = await mockAccount(runtime, access, "notificationSettings"); const state = read(account); state.enabled = enabled; write(account, state); return { enabled };
    },
  };
}

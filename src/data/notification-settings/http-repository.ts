import { ApiError } from "../shared/errors";
import type { AuthAccess, HttpClient } from "../shared/http";
import type { NotificationEmailSetting, MatchedBidEmailSetting, NotificationEmailVerification, NotificationSettingsRepository } from "./contracts";

export function createHttpNotificationSettingsRepository(http: HttpClient): NotificationSettingsRepository {
  const authorizedRequest = http.authorized;
  function invalidResponse(): never {
    throw new ApiError(200, "INVALID_EMAIL_SETTING_RESPONSE", "서버의 이메일 알림 설정을 확인하지 못했습니다. 다시 시도해 주세요.");
  }

  function validateNotificationEmailSetting(data: NotificationEmailSetting): NotificationEmailSetting {
    if (
      typeof data?.signupEmail !== "string" || !data.signupEmail ||
      (data.alternateEmail !== null && typeof data.alternateEmail !== "string") ||
      (data.recipientType !== "SIGNUP_EMAIL" && data.recipientType !== "ALTERNATE_EMAIL") ||
      typeof data.recipientEmail !== "string" || !data.recipientEmail ||
      (data.recipientType === "SIGNUP_EMAIL" && data.recipientEmail !== data.signupEmail) ||
      (data.recipientType === "ALTERNATE_EMAIL" && (!data.alternateEmail || data.recipientEmail !== data.alternateEmail))
    ) invalidResponse();
    return data;
  }

  function validateVerification(data: NotificationEmailVerification): NotificationEmailVerification {
    if (
      typeof data?.verificationId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.verificationId) ||
      typeof data.expiresAt !== "string" || !Number.isFinite(Date.parse(data.expiresAt)) ||
      typeof data.resendAvailableAt !== "string" || !Number.isFinite(Date.parse(data.resendAvailableAt))
    ) invalidResponse();
    return data;
  }

  async function getNotificationEmailSetting(access: AuthAccess, signal?: AbortSignal): Promise<NotificationEmailSetting> {
    const data = await authorizedRequest<NotificationEmailSetting>(access, "/api/v1/me/notification-email-settings", { signal });
    return validateNotificationEmailSetting(data);
  }

  async function changeNotificationEmailRecipient(
    access: AuthAccess,
    recipientType: NotificationEmailSetting["recipientType"],
  ): Promise<NotificationEmailSetting> {
    const data = await authorizedRequest<NotificationEmailSetting>(access, "/api/v1/me/notification-email-settings", {
      method: "PATCH",
      body: { recipientType },
    });
    const setting = validateNotificationEmailSetting(data);
    if (setting.recipientType !== recipientType) invalidResponse();
    return setting;
  }

  async function startNotificationEmailVerification(
    access: AuthAccess,
    email: string,
  ): Promise<NotificationEmailVerification> {
    const data = await authorizedRequest<NotificationEmailVerification>(access, "/api/v1/me/notification-email-verifications", {
      method: "POST",
      body: { email },
    });
    return validateVerification(data);
  }

  async function resendNotificationEmailVerification(
    access: AuthAccess,
    verificationId: string,
  ): Promise<NotificationEmailVerification> {
    const data = await authorizedRequest<NotificationEmailVerification>(
      access,
      `/api/v1/me/notification-email-verifications/${encodeURIComponent(verificationId)}/resend`,
      { method: "POST" },
    );
    return validateVerification(data);
  }

  async function confirmNotificationEmailVerification(
    access: AuthAccess,
    verificationId: string,
    code: string,
  ): Promise<NotificationEmailSetting> {
    const data = await authorizedRequest<NotificationEmailSetting>(
      access,
      `/api/v1/me/notification-email-verifications/${encodeURIComponent(verificationId)}/confirm`,
      { method: "POST", body: { code } },
    );
    const setting = validateNotificationEmailSetting(data);
    if (setting.recipientType !== "ALTERNATE_EMAIL") invalidResponse();
    return setting;
  }

  function validateMatchedBidEmailSetting(data: MatchedBidEmailSetting): MatchedBidEmailSetting {
    if (typeof data?.enabled !== "boolean") invalidResponse();
    return data;
  }

  async function getMatchedBidEmailSetting(access: AuthAccess, signal?: AbortSignal): Promise<MatchedBidEmailSetting> {
    const data = await authorizedRequest<MatchedBidEmailSetting>(access, "/api/v1/me/matched-bid-notice-email-settings", { signal });
    return validateMatchedBidEmailSetting(data);
  }

  async function changeMatchedBidEmailSetting(access: AuthAccess, enabled: boolean): Promise<MatchedBidEmailSetting> {
    const data = await authorizedRequest<MatchedBidEmailSetting>(
      access,
      "/api/v1/me/matched-bid-notice-email-settings",
      { method: "PATCH", body: { enabled } },
    );
    const setting = validateMatchedBidEmailSetting(data);
    if (setting.enabled !== enabled) invalidResponse();
    return setting;
  }

  return { getNotificationEmailSetting, changeNotificationEmailRecipient, startNotificationEmailVerification, resendNotificationEmailVerification, confirmNotificationEmailVerification, getMatchedBidEmailSetting, changeMatchedBidEmailSetting };
}

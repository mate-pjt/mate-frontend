import type { AuthAccess } from "../shared/http";
export type NotificationEmailSetting = {
  signupEmail: string;
  alternateEmail: string | null;
  recipientType: "SIGNUP_EMAIL" | "ALTERNATE_EMAIL";
  recipientEmail: string;
};
export type MatchedBidEmailSetting = {
  enabled: boolean;
};
export type NotificationEmailVerification = {
  verificationId: string;
  expiresAt: string;
  resendAvailableAt: string;
};

export interface NotificationSettingsRepository {
  getNotificationEmailSetting(access: AuthAccess, signal?: AbortSignal): Promise<NotificationEmailSetting>;
  changeNotificationEmailRecipient(access: AuthAccess, recipientType: NotificationEmailSetting["recipientType"]): Promise<NotificationEmailSetting>;
  startNotificationEmailVerification(access: AuthAccess, email: string): Promise<NotificationEmailVerification>;
  resendNotificationEmailVerification(access: AuthAccess, verificationId: string): Promise<NotificationEmailVerification>;
  confirmNotificationEmailVerification(access: AuthAccess, verificationId: string, code: string): Promise<NotificationEmailSetting>;
  getMatchedBidEmailSetting(access: AuthAccess, signal?: AbortSignal): Promise<MatchedBidEmailSetting>;
  changeMatchedBidEmailSetting(access: AuthAccess, enabled: boolean): Promise<MatchedBidEmailSetting>;
}

import { getDataConfig } from "../config";
import { getMockRuntime } from "../mock/runtime";
import { getHttpClient } from "../shared/client";
import type { NotificationSettingsRepository, UnavailableNotificationSetting } from "./contracts";
import { createHttpNotificationSettingsRepository } from "./http-repository";
import { createMockNotificationSettingsRepository } from "./mock-repository";
export type * from "./contracts";

export const notificationSettingsCapabilities = {
  detailAlerts: { status: "unavailable", reason: "web-connection-pending" },
  nightAlerts: { status: "unavailable", reason: "night-delivery-not-supported" },
} as const satisfies Readonly<Record<"detailAlerts" | "nightAlerts", UnavailableNotificationSetting>>;

let repository: NotificationSettingsRepository | null = null;
function getRepository(): NotificationSettingsRepository { return repository ??= getDataConfig().sources.notificationSettings === "mock" ? createMockNotificationSettingsRepository(getMockRuntime()) : createHttpNotificationSettingsRepository(getHttpClient()); }
export const getNotificationEmailSetting: NotificationSettingsRepository["getNotificationEmailSetting"] = (...args) => getRepository().getNotificationEmailSetting(...args);
export const changeNotificationEmailRecipient: NotificationSettingsRepository["changeNotificationEmailRecipient"] = (...args) => getRepository().changeNotificationEmailRecipient(...args);
export const startNotificationEmailVerification: NotificationSettingsRepository["startNotificationEmailVerification"] = (...args) => getRepository().startNotificationEmailVerification(...args);
export const resendNotificationEmailVerification: NotificationSettingsRepository["resendNotificationEmailVerification"] = (...args) => getRepository().resendNotificationEmailVerification(...args);
export const confirmNotificationEmailVerification: NotificationSettingsRepository["confirmNotificationEmailVerification"] = (...args) => getRepository().confirmNotificationEmailVerification(...args);
export const getMatchedBidEmailSetting: NotificationSettingsRepository["getMatchedBidEmailSetting"] = (...args) => getRepository().getMatchedBidEmailSetting(...args);
export const changeMatchedBidEmailSetting: NotificationSettingsRepository["changeMatchedBidEmailSetting"] = (...args) => getRepository().changeMatchedBidEmailSetting(...args);

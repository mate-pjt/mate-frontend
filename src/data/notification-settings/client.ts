import { getDataConfig } from "../config";
import { getMockRuntime } from "../mock/runtime";
import { getHttpClient } from "../shared/client";
import type { NotificationSettingsRepository } from "./contracts";
import { createHttpNotificationSettingsRepository } from "./http-repository";
import { createMockNotificationSettingsRepository } from "./mock-repository";
export type * from "./contracts";

let repository: NotificationSettingsRepository | null = null;
function getRepository(): NotificationSettingsRepository { return repository ??= getDataConfig().sources.notificationSettings === "mock" ? createMockNotificationSettingsRepository(getMockRuntime()) : createHttpNotificationSettingsRepository(getHttpClient()); }
export const getNotificationEmailSetting: NotificationSettingsRepository["getNotificationEmailSetting"] = (...args) => getRepository().getNotificationEmailSetting(...args);
export const changeNotificationEmailRecipient: NotificationSettingsRepository["changeNotificationEmailRecipient"] = (...args) => getRepository().changeNotificationEmailRecipient(...args);
export const startNotificationEmailVerification: NotificationSettingsRepository["startNotificationEmailVerification"] = (...args) => getRepository().startNotificationEmailVerification(...args);
export const resendNotificationEmailVerification: NotificationSettingsRepository["resendNotificationEmailVerification"] = (...args) => getRepository().resendNotificationEmailVerification(...args);
export const confirmNotificationEmailVerification: NotificationSettingsRepository["confirmNotificationEmailVerification"] = (...args) => getRepository().confirmNotificationEmailVerification(...args);
export const getMatchedBidEmailSetting: NotificationSettingsRepository["getMatchedBidEmailSetting"] = (...args) => getRepository().getMatchedBidEmailSetting(...args);
export const changeMatchedBidEmailSetting: NotificationSettingsRepository["changeMatchedBidEmailSetting"] = (...args) => getRepository().changeMatchedBidEmailSetting(...args);

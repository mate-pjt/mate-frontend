import { describe, expect, it } from "vitest";
import { createHttpClient } from "@/data/shared/http";
import { createHttpBidAlertsRepository } from "@/data/bid-alerts/http-repository";
import { createMockBidAlertsRepository } from "@/data/bid-alerts/mock-repository";
import { createHttpNotificationsRepository } from "@/data/notifications/http-repository";
import { createMockNotificationsRepository } from "@/data/notifications/mock-repository";
import { createHttpPersonalFiltersRepository } from "@/data/personal-filters/http-repository";
import { createMockPersonalFiltersRepository } from "@/data/personal-filters/mock-repository";
import { createHttpNotificationSettingsRepository } from "@/data/notification-settings/http-repository";
import { createMockNotificationSettingsRepository } from "@/data/notification-settings/mock-repository";
import { emptyPersonalFilter } from "@/features/bid-notice-filters/model";
import type { PersonalFilterSnapshot } from "@/data/personal-filters/contracts";
import { access, mockRuntime, ok, testNow } from "./helpers";

// This emulates confirmed wire responses, and is not real backend integration.
function wireServer(): typeof fetch {
  const alerts: Record<string, { bidNoticeId: number; active: boolean; registeredAt: string | null }> = {};
  const notifications = Array.from({ length: 25 }, (_, i) => ({ notificationId: 50001+i, type: "ADMIN_DIRECT_NOTIFICATION", resourceId: 0, title: `가상 알림 ${i}`, body: "합성 응답", actionPath: null, createdAt: new Date(testNow).toISOString(), readAt: i < 22 ? null : new Date(testNow).toISOString() }));
  let filter: PersonalFilterSnapshot = { source: "EMPTY_DEFAULT", version: null, canImportCompany: false, filter: emptyPersonalFilter() };
  let email = { signupEmail: "demo1@example.test", alternateEmail: null as string | null, recipientType: "SIGNUP_EMAIL", recipientEmail: "demo1@example.test" }; let enabled = false; let pendingEmail = "";
  return async (input, init) => {
    const url = new URL(String(input)); const p = url.pathname; const method = init?.method ?? "GET"; const body = init?.body ? JSON.parse(String(init.body)) : {};
    if (p.includes("/bid-notice-alerts/")) {
      const id = p.split("/").at(-1)!; const value = alerts[id] ?? { bidNoticeId: Number(id), active: false, registeredAt: null };
      if (method !== "GET") { value.active = method === "PUT"; value.registeredAt = value.active ? new Date(testNow).toISOString() : null; alerts[id] = value; } return ok(value);
    }
    if (p.endsWith("/notifications/unread-count")) return ok({ unreadCount: notifications.filter(n => n.readAt === null).length });
    if (p.endsWith("/read")) { const value = notifications.find(n => String(n.notificationId) === p.split("/").at(-2))!; value.readAt = new Date(testNow).toISOString(); return ok(value); }
    if (p.endsWith("/notifications")) { const page = Number(url.searchParams.get("page")); return ok({ content: notifications.slice(page*20,(page+1)*20), page, size: 20, totalElements:25,totalPages:2,unreadCount:notifications.filter(n => n.readAt===null).length }); }
    if (p.includes("/bid-notice-filters/current")) {
      if (method !== "GET") { if (filter.version !== body.expectedVersion) return ok(null,409); filter = { ...filter, source: p.endsWith("/reset") ? "EMPTY_DEFAULT" : "SAVED", version:(filter.version??0)+1,filter:p.endsWith("/reset") ? emptyPersonalFilter() : body.filter }; } return ok(filter);
    }
    if (p.endsWith("/matched-bid-notice-email-settings")) { if (method === "PATCH") enabled = body.enabled; return ok({ enabled }); }
    if (p.endsWith("/notification-email-settings")) { if (method === "PATCH") email = { ...email,recipientType:body.recipientType,recipientEmail:body.recipientType === "SIGNUP_EMAIL" ? email.signupEmail : email.alternateEmail! }; return ok(email); }
    if (p.endsWith("/confirm")) { if (body.code !== "1234") return ok(null,400); email = { ...email, alternateEmail:pendingEmail,recipientType:"ALTERNATE_EMAIL",recipientEmail:pendingEmail }; return ok(email); }
    if (p.includes("/notification-email-verifications")) { pendingEmail = body.email; return ok({verificationId:"00000000-0000-4000-8000-000000000001",expiresAt:new Date(testNow+600_000).toISOString(),resendAvailableAt:new Date(testNow+30_000).toISOString()}); }
    throw new Error("Unexpected test endpoint");
  };
}
for (const source of ["mock","http"] as const) describe(`${source} 동일 Repository 계약`, () => {
  const repos = () => { const http = createHttpClient("https://synthetic-api.test",wireServer()); const runtime = mockRuntime(); return source === "mock"
    ? { alerts:createMockBidAlertsRepository(runtime), notifications:createMockNotificationsRepository(runtime),filters:createMockPersonalFiltersRepository(runtime),email:createMockNotificationSettingsRepository(runtime) }
    : { alerts:createHttpBidAlertsRepository(http),notifications:createHttpNotificationsRepository(http),filters:createHttpPersonalFiltersRepository(http),email:createHttpNotificationSettingsRepository(http) }; };
  it("구독 변경 뒤 조회가 일치한다",async()=>{const{alerts}=repos();expect((await alerts.getBidNoticeAlert(access,"10001")).active).toBe(false);await alerts.activateBidNoticeAlert(access,"10001");expect((await alerts.getBidNoticeAlert(access,"10001")).active).toBe(true);await alerts.deactivateBidNoticeAlert(access,"10001");expect((await alerts.getBidNoticeAlert(access,"10001")).active).toBe(false);});
  it("읽음 변경 뒤 목록과 미확인 건수가 일치한다",async()=>{const{notifications}=repos();expect((await notifications.getNotifications(access,0)).items).toHaveLength(20);expect((await notifications.getNotifications(access,1)).items).toHaveLength(5);const count=await notifications.getUnreadNotificationCount(access);await notifications.markNotificationRead(access,"50001");expect(await notifications.getUnreadNotificationCount(access)).toBe(count-1);expect((await notifications.getNotifications(access,0)).items[0].unread).toBe(false);});
  it("필터 저장·충돌·초기화 계약이 일치한다",async()=>{const{filters}=repos();const value={...emptyPersonalFilter(),regionCodes:["11"]};const saved=await filters.savePersonalFilter(access,null,value);expect((await filters.getPersonalFilter(access)).filter).toEqual(value);await expect(filters.savePersonalFilter(access,null,value)).rejects.toMatchObject({status:409});expect((await filters.resetPersonalFilter(access,saved.version)).filter).toEqual(emptyPersonalFilter());});
  it("이메일 인증·주소 변경·ON/OFF 계약이 일치한다",async()=>{const{email}=repos();const verification=await email.startNotificationEmailVerification(access,"recipient@example.test");expect((await email.confirmNotificationEmailVerification(access,verification.verificationId,"1234")).recipientEmail).toBe("recipient@example.test");await email.changeMatchedBidEmailSetting(access,true);expect((await email.getMatchedBidEmailSetting(access)).enabled).toBe(true);await email.changeNotificationEmailRecipient(access,"SIGNUP_EMAIL");expect((await email.getNotificationEmailSetting(access)).recipientEmail).toBe("demo1@example.test");expect((await email.getMatchedBidEmailSetting(access)).enabled).toBe(true);});
});

import { describe, expect, it } from "vitest";
import { createMockNotificationsRepository } from "@/data/notifications/mock-repository";
import { createMockBidAlertsRepository } from "@/data/bid-alerts/mock-repository";
import { createMockPersonalFiltersRepository } from "@/data/personal-filters/mock-repository";
import { createMockNotificationSettingsRepository } from "@/data/notification-settings/mock-repository";
import { emptyPersonalFilter, readPersonalFilterParams, writePersonalFilterParams } from "@/features/bid-notice-filters/model";
import { memoryStorage } from "@/data/mock/store";
import { ApiError } from "@/data/shared/errors";
import type { PersonalFilterSnapshot } from "@/data/personal-filters/contracts";
import { access, mockRuntime, testNow } from "./helpers";

describe("계정 mock 변경 계약", () => {
  it("25건의 더 보기와 읽음 처리, 건수가 동일한 상태를 사용한다", async () => {
    const runtime = mockRuntime(); const repo = createMockNotificationsRepository(runtime);
    expect((await repo.getNotifications(access, 0)).items).toHaveLength(20); expect((await repo.getNotifications(access, 1)).items).toHaveLength(5);
    const count = await repo.getUnreadNotificationCount(access); await repo.markNotificationRead(access, "50001");
    expect(await repo.getUnreadNotificationCount(access)).toBe(count - 1); expect((await repo.getNotifications(access, 0)).items[0].unread).toBe(false);
  });
  it("구독 상태는 탭 재생성과 계정별로 유지된다", async () => {
    const storage = memoryStorage(); const repo = createMockBidAlertsRepository(mockRuntime(storage));
    await repo.activateBidNoticeAlert(access, "10001");
    const restored = createMockBidAlertsRepository(mockRuntime(storage)); expect((await restored.getBidNoticeAlert(access, "10001")).active).toBe(true);
    expect((await restored.getBidNoticeAlert({ ...access, getAccountKey: () => "2" }, "10001")).active).toBe(false);
    await restored.deactivateBidNoticeAlert(access, "10001"); expect((await repo.getBidNoticeAlert(access, "10001")).active).toBe(false);
  });
  it("개인 필터의 저장, URL 적용, 충돌, 초기화를 검증한다", async () => {
    const repo = createMockPersonalFiltersRepository(mockRuntime()); const filter = { ...emptyPersonalFilter(), regionCodes: ["11"], industryCodes: ["0001"], amountMin: 100, amountType: "BASE_PRICE" as const };
    const saved = await repo.savePersonalFilter(access, null, filter); const params = new URLSearchParams(); writePersonalFilterParams(params, saved.filter);
    expect(readPersonalFilterParams(params)).toEqual(filter);
    await expect(repo.savePersonalFilter(access, null, filter)).rejects.toMatchObject({ status: 409 });
    expect((await repo.getPersonalFilter(access)).filter).toEqual(filter);
    expect(await repo.resetPersonalFilter(access, saved.version)).toEqual({ source: "SAVED", version: 2, canImportCompany: false, filter: emptyPersonalFilter() });
  });
  it.each([false, true])("빈/회사 기본값에서 reset은 빈 SAVED를 만들고 reload·계정 격리를 유지한다 (회사=%s)", async (company) => {
    const storage = memoryStorage(); const runtime = mockRuntime(storage);
    const initial: PersonalFilterSnapshot = { source: company ? "COMPANY_DEFAULT" : "EMPTY_DEFAULT", version: null, canImportCompany: company, filter: { ...emptyPersonalFilter(), regionCodes: company ? ["11"] : [] } };
    runtime.store.write("1", "personal-filters", initial);
    const repo = createMockPersonalFiltersRepository(runtime);
    expect(await repo.getPersonalFilter(access)).toEqual(initial);
    const cleared = await repo.resetPersonalFilter(access, null);
    expect(cleared).toEqual({ source: "SAVED", version: 1, canImportCompany: company, filter: emptyPersonalFilter() });
    const restored = createMockPersonalFiltersRepository(mockRuntime(storage));
    expect(await restored.getPersonalFilter(access)).toEqual(cleared);
    expect(await restored.getPersonalFilter({ ...access, getAccountKey: () => "2" })).toEqual({ source: "EMPTY_DEFAULT", version: null, canImportCompany: false, filter: emptyPersonalFilter() });
    expect(await restored.getPersonalFilter(access)).toEqual(cleared);
    expect(initial.source).toBe(company ? "COMPANY_DEFAULT" : "EMPTY_DEFAULT");
    expect(initial.filter.regionCodes).toEqual(company ? ["11"] : []);
  });
  it("저장→reset 버전과 빈값 replay를 보존하고 오래된 reset은 새 조건을 덮지 않는다", async () => {
    const runtime = mockRuntime();
    runtime.store.write("1", "personal-filters", { source: "COMPANY_DEFAULT", version: null, canImportCompany: true, filter: emptyPersonalFilter() });
    const repo = createMockPersonalFiltersRepository(runtime);
    const value = { ...emptyPersonalFilter(), regionCodes: ["11"] };
    const saved = await repo.savePersonalFilter(access, null, value);
    const cleared = await repo.resetPersonalFilter(access, saved.version);
    expect(cleared).toEqual({ source: "SAVED", version: 2, canImportCompany: true, filter: emptyPersonalFilter() });
    expect(await repo.resetPersonalFilter(access, saved.version)).toEqual(cleared);
    expect(await repo.resetPersonalFilter(access, cleared.version)).toEqual(cleared);
    const latest = await repo.savePersonalFilter(access, cleared.version, value);
    await expect(repo.resetPersonalFilter(access, saved.version)).rejects.toMatchObject({ status: 409 });
    expect(await repo.getPersonalFilter(access)).toEqual(latest);
  });
  it.each(["conflict", "error", "unauthorized"])("reset 실패(%s)는 기존 snapshot을 보존한다", async (failure) => {
    const runtime = mockRuntime(); const repo = createMockPersonalFiltersRepository(runtime);
    const saved = await repo.savePersonalFilter(access, null, { ...emptyPersonalFilter(), regionCodes: ["11"] });
    const failing = createMockPersonalFiltersRepository({ ...runtime, scenario: () => failure });
    const port = failure === "unauthorized" ? { ...access, getAccessToken: async () => { throw new ApiError(401, "SESSION_INVALID", "합성 세션 만료"); } } : access;
    await expect(failing.resetPersonalFilter(port, saved.version)).rejects.toMatchObject({ status: failure === "conflict" ? 409 : failure === "error" ? 503 : 401 });
    expect(await repo.getPersonalFilter(access)).toEqual(saved);
  });
  it("reset 도중 계정이 바뀌면 두 계정의 저장값을 변경하지 않는다", async () => {
    const runtime = mockRuntime(); const repo = createMockPersonalFiltersRepository(runtime);
    const saved = await repo.savePersonalFilter(access, null, { ...emptyPersonalFilter(), regionCodes: ["11"] });
    let account = "1";
    const pending = repo.resetPersonalFilter({ ...access, getAccountKey: () => account }, saved.version);
    account = "2";
    await expect(pending).rejects.toMatchObject({ status: 401, code: "ACCOUNT_CHANGED" });
    expect(await repo.getPersonalFilter(access)).toEqual(saved);
    expect((await repo.getPersonalFilter({ ...access, getAccountKey: () => "2" })).version).toBeNull();
  });
  it("이메일 인증, 재전송, 수신 주소와 ON/OFF는 같은 상태를 사용한다", async () => {
    let now = testNow; const storage = memoryStorage(); const runtime = mockRuntime(storage, {}, () => now); const repo = createMockNotificationSettingsRepository(runtime);
    const verification = await repo.startNotificationEmailVerification(access, "recipient@example.test");
    await expect(repo.confirmNotificationEmailVerification(access, verification.verificationId, "0000")).rejects.toMatchObject({ status: 400 });
    await expect(repo.resendNotificationEmailVerification(access, verification.verificationId)).rejects.toMatchObject({ status: 429 });
    now += 31_000; await repo.resendNotificationEmailVerification(access, verification.verificationId);
    expect((await repo.confirmNotificationEmailVerification(access, verification.verificationId, "1234")).recipientEmail).toBe("recipient@example.test");
    await repo.changeMatchedBidEmailSetting(access, true);
    const restored = createMockNotificationSettingsRepository(mockRuntime(storage, {}, () => now));
    expect((await restored.getMatchedBidEmailSetting(access)).enabled).toBe(true);
    expect((await restored.changeNotificationEmailRecipient(access, "SIGNUP_EMAIL")).recipientEmail).toBe("demo1@example.test");
    expect((await restored.getMatchedBidEmailSetting(access)).enabled).toBe(true);
    const expired = await restored.startNotificationEmailVerification(access, "other@example.test"); now += 11 * 60_000;
    await expect(restored.confirmNotificationEmailVerification(access, expired.verificationId, "1234")).rejects.toMatchObject({ code: "NE005" });
  });
  it("취소와 명시적 오류는 상태를 변경하지 않는다", async () => {
    const runtime = mockRuntime(); const repo = createMockBidAlertsRepository(runtime); const controller = new AbortController(); controller.abort();
    await expect(repo.getBidNoticeAlert(access, "10001", controller.signal)).rejects.toMatchObject({ name: "AbortError" });
    const failed = createMockBidAlertsRepository({ ...runtime, scenario: () => "error" }); await expect(failed.activateBidNoticeAlert(access, "10001")).rejects.toMatchObject({ status: 503 });
    expect((await repo.getBidNoticeAlert(access, "10001")).active).toBe(false);
  });
});

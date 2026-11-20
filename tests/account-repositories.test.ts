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
  it("취소와 명시적 오류는 상태를 변경하지 않는다", async () => {
    const runtime = mockRuntime(); const repo = createMockBidAlertsRepository(runtime); const controller = new AbortController(); controller.abort();
    await expect(repo.getBidNoticeAlert(access, "10001", controller.signal)).rejects.toMatchObject({ name: "AbortError" });
    const failed = createMockBidAlertsRepository({ ...runtime, scenario: () => "error" }); await expect(failed.activateBidNoticeAlert(access, "10001")).rejects.toMatchObject({ status: 503 });
    expect((await repo.getBidNoticeAlert(access, "10001")).active).toBe(false);
  });
});

describe("대체 수신 이메일 mock 인증", () => {
  it.each(["resend", "start"] as const)("같은 계정의 %s는 60초에서 새 요청과 번호를 발급한다", async (action) => {
    let now = testNow;
    const storage = memoryStorage();
    const runtime = mockRuntime(storage, {}, () => now);
    const repo = createMockNotificationSettingsRepository(runtime);
    const saved = await repo.getNotificationEmailSetting(access);
    await repo.changeMatchedBidEmailSetting(access, true);
    const firstEmail = "recipient@example.test";
    const first = await repo.startNotificationEmailVerification(access, firstEmail);
    expect(first).toEqual({
      verificationId: expect.any(String),
      expiresAt: new Date(testNow + 180_000).toISOString(),
      resendAvailableAt: new Date(testNow + 60_000).toISOString(),
    });

    now = testNow + 59_999;
    await expect(repo.resendNotificationEmailVerification(access, first.verificationId)).rejects.toMatchObject({ status: 429, code: "NE006" });
    await expect(repo.startNotificationEmailVerification(access, "early@example.test")).rejects.toMatchObject({ status: 429, code: "NE006" });
    expect(await repo.getNotificationEmailSetting(access)).toEqual(saved);

    now = testNow + 60_000;
    const latestEmail = action === "resend" ? firstEmail : "replacement@example.test";
    const latest = action === "resend"
      ? await repo.resendNotificationEmailVerification(access, first.verificationId)
      : await repo.startNotificationEmailVerification(access, latestEmail);
    expect(latest.verificationId).not.toBe(first.verificationId);
    expect(Date.parse(latest.expiresAt)).toBe(now + 180_000);
    expect(Date.parse(latest.resendAvailableAt)).toBe(now + 60_000);

    const restored = createMockNotificationSettingsRepository(mockRuntime(storage, {}, () => now));
    await expect(restored.resendNotificationEmailVerification(access, first.verificationId)).rejects.toMatchObject({ status: 404, code: "NE005" });
    await expect(restored.confirmNotificationEmailVerification(access, first.verificationId, "1234")).rejects.toMatchObject({ status: 404, code: "NE005" });
    await expect(restored.confirmNotificationEmailVerification(access, latest.verificationId, "1234")).rejects.toMatchObject({ status: 400, code: "NE004" });
    await expect(restored.resendNotificationEmailVerification(access, latest.verificationId)).rejects.toMatchObject({ status: 429, code: "NE006" });
    expect(await restored.getNotificationEmailSetting(access)).toEqual(saved);

    expect(await restored.confirmNotificationEmailVerification(access, latest.verificationId, "1235")).toEqual({
      ...saved, alternateEmail: latestEmail, recipientType: "ALTERNATE_EMAIL", recipientEmail: latestEmail,
    });
    expect((await restored.changeNotificationEmailRecipient(access, "SIGNUP_EMAIL")).alternateEmail).toBe(latestEmail);
    expect(await restored.getMatchedBidEmailSetting(access)).toEqual({ enabled: true });
  });

  it.each([179_999, 180_000, 180_001])("발송 후 %i ms에서 만료 경계를 적용한다", async (elapsed) => {
    let now = testNow;
    const repo = createMockNotificationSettingsRepository(mockRuntime(memoryStorage(), {}, () => now));
    const original = await repo.getNotificationEmailSetting(access);
    const first = await repo.startNotificationEmailVerification(access, "recipient@example.test");
    now += elapsed;

    if (elapsed < 180_000) {
      expect((await repo.confirmNotificationEmailVerification(access, first.verificationId, "1234")).recipientEmail).toBe("recipient@example.test");
    } else {
      await expect(repo.confirmNotificationEmailVerification(access, first.verificationId, "1234")).rejects.toMatchObject({ status: 400, code: "NE005" });
      expect(await repo.getNotificationEmailSetting(access)).toEqual(original);
    }
  });

  it("다섯 번째 오입력에서 차단하고 재전송 때 시도 횟수를 새로 센다", async () => {
    let now = testNow;
    const repo = createMockNotificationSettingsRepository(mockRuntime(memoryStorage(), {}, () => now));
    const original = await repo.getNotificationEmailSetting(access);
    const first = await repo.startNotificationEmailVerification(access, "recipient@example.test");
    for (let attempt = 0; attempt < 4; attempt += 1) {
      await expect(repo.confirmNotificationEmailVerification(access, first.verificationId, "0000")).rejects.toMatchObject({ status: 400, code: "NE004" });
    }
    await expect(repo.confirmNotificationEmailVerification(access, first.verificationId, "0000")).rejects.toMatchObject({ status: 429, code: "NE006" });
    await expect(repo.confirmNotificationEmailVerification(access, first.verificationId, "1234")).rejects.toMatchObject({ status: 429, code: "NE006" });
    await expect(repo.startNotificationEmailVerification(access, "new@example.test")).rejects.toMatchObject({ status: 429, code: "NE006" });
    expect(await repo.getNotificationEmailSetting(access)).toEqual(original);

    now += 60_000;
    const latest = await repo.resendNotificationEmailVerification(access, first.verificationId);
    expect((await repo.confirmNotificationEmailVerification(access, latest.verificationId, "1235")).recipientEmail).toBe("recipient@example.test");
  });

  it("만료된 화면의 재전송은 새 기한을 발급한다", async () => {
    let now = testNow;
    const repo = createMockNotificationSettingsRepository(mockRuntime(memoryStorage(), {}, () => now));
    const first = await repo.startNotificationEmailVerification(access, "recipient@example.test");
    now += 180_001;
    const latest = await repo.resendNotificationEmailVerification(access, first.verificationId);
    expect(latest.verificationId).not.toBe(first.verificationId);
    expect(Date.parse(latest.expiresAt)).toBe(now + 180_000);
    expect((await repo.confirmNotificationEmailVerification(access, latest.verificationId, "1235")).recipientEmail).toBe("recipient@example.test");
  });

  it("서로 다른 계정의 요청·번호 진행·수신처를 격리한다", async () => {
    let now = testNow;
    const repo = createMockNotificationSettingsRepository(mockRuntime(memoryStorage(), {}, () => now));
    const secondAccount = { ...access, getAccountKey: () => "2" };
    const first = await repo.startNotificationEmailVerification(access, "one@example.test");
    await expect(repo.resendNotificationEmailVerification(secondAccount, first.verificationId)).rejects.toMatchObject({ status: 404, code: "NE005" });
    await expect(repo.confirmNotificationEmailVerification(secondAccount, first.verificationId, "1234")).rejects.toMatchObject({ status: 404, code: "NE005" });
    now += 60_000;
    await repo.resendNotificationEmailVerification(access, first.verificationId);
    const other = await repo.startNotificationEmailVerification(secondAccount, "two@example.test");
    expect((await repo.confirmNotificationEmailVerification(secondAccount, other.verificationId, "1234")).recipientEmail).toBe("two@example.test");
    expect((await repo.getNotificationEmailSetting(access)).recipientEmail).toBe("demo1@example.test");
  });

  it("이전 요청을 보정해도 기존 주소·수신 설정·오입력 횟수를 보존한다", async () => {
    let now = testNow + 59_999;
    const storage = memoryStorage();
    const runtime = mockRuntime(storage, {}, () => now);
    const setting = {
      signupEmail: "demo1@example.test", alternateEmail: "saved@example.test",
      recipientType: "ALTERNATE_EMAIL", recipientEmail: "saved@example.test",
    };
    runtime.store.write("1", "notification-settings", {
      setting, enabled: true,
      verification: {
        verificationId: "legacy-request", email: "new@example.test", attempts: 4,
        expiresAt: new Date(testNow + 600_000).toISOString(),
        resendAvailableAt: new Date(testNow + 30_000).toISOString(),
      },
    });
    const repo = createMockNotificationSettingsRepository(runtime);
    expect(await repo.getNotificationEmailSetting(access)).toEqual(setting);
    await expect(repo.resendNotificationEmailVerification(access, "legacy-request")).rejects.toMatchObject({ status: 429, code: "NE006" });
    await expect(repo.confirmNotificationEmailVerification(access, "legacy-request", "0000")).rejects.toMatchObject({ status: 429, code: "NE006" });

    now = testNow + 180_000;
    const restored = createMockNotificationSettingsRepository(mockRuntime(storage, {}, () => now));
    await expect(restored.confirmNotificationEmailVerification(access, "legacy-request", "1234")).rejects.toMatchObject({ status: 400, code: "NE005" });
    expect(await restored.getNotificationEmailSetting(access)).toEqual(setting);
    expect(await restored.getMatchedBidEmailSetting(access)).toEqual({ enabled: true });
  });

  it.each([["expired", 400, "NE005"], ["blocked", 429, "NE006"]] as const)(
    "%s 시나리오는 수신처를 유지하고 발송 대기를 지킨다",
    async (scenario, status, code) => {
      let now = testNow;
      const repo = createMockNotificationSettingsRepository(mockRuntime(memoryStorage(), { notificationSettings: scenario }, () => now));
      const saved = await repo.getNotificationEmailSetting(access);
      const first = await repo.startNotificationEmailVerification(access, "recipient@example.test");
      await expect(repo.confirmNotificationEmailVerification(access, first.verificationId, "1234")).rejects.toMatchObject({ status, code });
      await expect(repo.startNotificationEmailVerification(access, "other@example.test")).rejects.toMatchObject({ status: 429, code: "NE006" });
      now += 60_000;
      const latest = await repo.resendNotificationEmailVerification(access, first.verificationId);
      await expect(repo.confirmNotificationEmailVerification(access, latest.verificationId, "1235")).rejects.toMatchObject({ status, code });
      expect(await repo.getNotificationEmailSetting(access)).toEqual(saved);
    },
  );

  it("동시에 시작과 재전송을 요청해도 발송 슬롯 하나만 소비한다", async () => {
    let now = testNow;
    const repo = createMockNotificationSettingsRepository(mockRuntime(memoryStorage(), {}, () => now));
    const first = await repo.startNotificationEmailVerification(access, "recipient@example.test");
    now += 60_000;
    const results = await Promise.allSettled([
      repo.resendNotificationEmailVerification(access, first.verificationId),
      repo.startNotificationEmailVerification(access, "other@example.test"),
    ]);
    const issued = results.find((result) => result.status === "fulfilled");
    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect(results.find((result) => result.status === "rejected")).toMatchObject({
      reason: { status: 429, code: "NE006" },
    });
    expect(issued?.value.verificationId).not.toBe(first.verificationId);
    await expect(repo.confirmNotificationEmailVerification(access, issued!.value.verificationId, "1235")).resolves.toMatchObject({
      recipientType: "ALTERNATE_EMAIL",
    });
  });
});

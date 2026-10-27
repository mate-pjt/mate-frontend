import { describe, expect, it, vi } from "vitest";
import { createMockAuthRepository } from "@/data/auth/mock-repository";
import { createHttpAuthRepository } from "@/data/auth/http-repository";
import { createHttpClient } from "@/data/shared/http";
import { createSessionController } from "@/data/auth/session-controller";
import { sanitizeLocalNextPath } from "@/lib/auth-redirect";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { authentication, mockRuntime, ok } from "./helpers";

describe("인증 Repository와 세션", () => {
  it("초기 비로그인, 외부 요청 없는 로그인과 복원, 다른 계정, 로그아웃", async () => {
    const runtime = mockRuntime(); const repo = createMockAuthRepository(runtime);
    await expect(repo.refreshBrowserSession()).rejects.toMatchObject({ status: 401 });
    const url = new URL(repo.googleAuthorizationUrl("/my/company", "https://unused.test"), "https://local.test");
    expect(url.origin).toBe("https://local.test"); expect(url.pathname).toBe("/auth/callback");
    const session = await repo.completeGoogleSession(url.searchParams.get("flowId")!);
    expect(session.account.id).toBe(1);
    expect((await createMockAuthRepository(runtime).refreshBrowserSession()).account.id).toBe(1);
    const other = new URL(repo.googleAuthorizationUrl("/", "", "alternate"), "https://local.test");
    expect((await repo.completeGoogleSession(other.searchParams.get("flowId")!)).account.id).toBe(2);
    await repo.logoutBrowserSession(); await expect(repo.refreshBrowserSession()).rejects.toMatchObject({ status: 401 });
  });
  it("가상 가입과 만료/잘못된 flowId, 필수 동의를 검증한다", async () => {
    const repo = createMockAuthRepository(mockRuntime()); const url = new URL(repo.googleAuthorizationUrl("//outside.test", "", "signup"), "https://local.test");
    expect(url.searchParams.get("returnTo")).toBe(sanitizeLocalNextPath("//outside.test"));
    const id = url.searchParams.get("flowId")!; const signup = await repo.getCurrentSocialSignup(id);
    await expect(repo.completeSocialSignup(id, { name: "가상", birthDate: null, mobilePhone: null, agreementAcceptances: [] })).rejects.toMatchObject({ status: 400 });
    const session = await repo.completeSocialSignup(id, { name: "가상", birthDate: null, mobilePhone: null, agreementAcceptances: signup.requiredAgreements });
    expect(session.account.id).toBe(101);
    await expect(repo.completeGoogleSession("unknown")).rejects.toMatchObject({ code: "AUTH_FLOW_INVALID" });
    const expired = createMockAuthRepository(mockRuntime(undefined, { auth: "expired" })); const flow = new URL(expired.googleAuthorizationUrl("/", ""), "https://local.test");
    await expect(expired.completeGoogleSession(flow.searchParams.get("flowId")!)).rejects.toMatchObject({ code: "AUTH_FLOW_EXPIRED" });
  });
  it("HTTP 인증은 기존 경로와 flowId를 유지한다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok(authentication())); const repo = createHttpAuthRepository(createHttpClient("https://synthetic.test", fetcher));
    const id = "synthetic id"; await repo.completeGoogleSession(id);
    expect(String(fetcher.mock.calls[0][0])).toContain("session-completions?flowId=synthetic%20id");
    expect(fetcher.mock.calls[0][1]?.method).toBe("POST");
    expect(new URL(repo.googleAuthorizationUrl("/my/company", "https://local.test")).searchParams.get("returnOrigin")).toBe("https://local.test");
  });
  it("전체 mock의 만료된 가상 세션은 보호 변경을 거부하고 anonymous로 전환한다", async () => {
    let now = Date.parse("2030-06-01T00:00:00Z"); const runtime = mockRuntime(undefined, {}, () => now);
    const repo = createMockAuthRepository(runtime); const session = createSessionController(repo, () => now);
    const flow = new URL(repo.googleAuthorizationUrl("/", ""), "https://local.test");
    session.setAuthentication(await repo.completeGoogleSession(flow.searchParams.get("flowId")!));
    const company = createMockCompanyRepository(runtime); expect((await company.getMyCompanyOverview(session)).status).toBe("empty");
    now += 2 * 3600_000;
    expect((await company.getMyCompanyOverview(session)).status).toBe("empty");
    expect(session.getSnapshot().status).toBe("authenticated");
    now += 25 * 3600_000;
    await expect(company.requestMembership(session, { companyId: 7001, representative: false, positionId: 1, proposedPositionName: null, message: null })).rejects.toMatchObject({ code: "SESSION_INVALID" });
    expect(session.getSnapshot().status).toBe("anonymous");
    expect(runtime.store.read("1", "company", () => ({ overview: { status: "missing" } }), (value): value is { overview: { status: string } } => typeof value === "object" && value !== null && "overview" in value).overview.status).toBe("empty");
  });
  it("동시 refresh를 공유하고 로그아웃 중 늦은 응답을 버린다", async () => {
    let resolve!: (value: ReturnType<typeof authentication>) => void;
    const refreshBrowserSession = vi.fn(() => new Promise<ReturnType<typeof authentication>>(done => { resolve = done; }));
    const logoutBrowserSession = vi.fn(async () => {}); const session = createSessionController({ refreshBrowserSession, logoutBrowserSession });
    const first = session.refresh(); const second = session.refresh(); expect(first).toBe(second);
    const logout = session.logout(); resolve(authentication()); expect(await first).toBeNull(); await logout;
    expect(refreshBrowserSession).toHaveBeenCalledTimes(1); expect(session.getSnapshot().status).toBe("anonymous");
    expect(logoutBrowserSession).toHaveBeenCalledTimes(1);
  });
  it("계정 교체 중 늦은 refresh가 새 계정을 덮어쓰지 않는다", async () => {
    let resolve!: (value: ReturnType<typeof authentication>) => void;
    const session = createSessionController({ refreshBrowserSession: () => new Promise(done => { resolve = done; }), logoutBrowserSession: async () => {} });
    const pending = session.refresh(); session.setAuthentication(authentication(2)); resolve(authentication(1));
    expect(await pending).toBeNull(); expect(session.getAccountKey()).toBe("2");
  });
  it("계정 교체 뒤 refresh는 이전 계정의 대기를 공유하지 않고 새 대기를 유지한다", async () => {
    const resolves: Array<(value: ReturnType<typeof authentication>) => void> = [];
    const refreshBrowserSession = vi.fn(() => new Promise<ReturnType<typeof authentication>>(done => { resolves.push(done); }));
    const session = createSessionController({ refreshBrowserSession, logoutBrowserSession: async () => {} });
    const old = session.refresh(); session.setAuthentication(authentication(2)); const current = session.refresh();
    expect(current).not.toBe(old); expect(refreshBrowserSession).toHaveBeenCalledTimes(2);
    resolves[0](authentication(1)); expect(await old).toBeNull(); expect(session.refresh()).toBe(current);
    resolves[1](authentication(2)); expect((await current)?.account.id).toBe(2); expect(session.getAccountKey()).toBe("2");
  });
  it.each(["https://outside.test", "//outside.test", "/\\outside", "/\u0000bad"])("외부 복귀 경로를 차단한다", value => { expect(sanitizeLocalNextPath(value)).toBe("/bids?view=recommended"); });
});

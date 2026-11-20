import { describe, expect, it, vi } from "vitest";
import { createMockAuthRepository } from "@/data/auth/mock-repository";
import { createHttpAuthRepository } from "@/data/auth/http-repository";
import { createHttpClient } from "@/data/shared/http";
import { createSessionController } from "@/data/auth/session-controller";
import { readContactEmail } from "@/features/auth/contact-email";
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
    expect(session.account.nickname).toBe("가상");
    expect((await repo.refreshBrowserSession()).account.nickname).toBe("가상");
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
  it.each(["서버 이름", null, undefined])("HTTP 로그인·가입·refresh의 nickname을 보존하고 누락은 null로 정규화한다 (%s)", async (nickname) => {
    const wire = { ...authentication(), account: { id: 1, email: "synthetic@example.test", nickname } };
    const fetcher = vi.fn<typeof fetch>().mockImplementation(async () => ok(wire));
    const repo = createHttpAuthRepository(createHttpClient("https://synthetic.test", fetcher));
    const input = { name: "가상", birthDate: "2024-02-29", mobilePhone: null, agreementAcceptances: [{ code: "TERMS_OF_SERVICE" as const, version: "synthetic-v1" }, { code: "PRIVACY_POLICY" as const, version: "synthetic-v1" }] };
    const sessions = [await repo.completeGoogleSession("synthetic"), await repo.completeSocialSignup("synthetic", input), await repo.refreshBrowserSession()];
    sessions.forEach((session) => expect(session.account.nickname).toBe(nickname ?? null));
    expect(fetcher).toHaveBeenCalledTimes(3);
    expect(JSON.parse(String(fetcher.mock.calls[1][1]?.body))).toEqual(input);
  });
  it("잘못된 nickname 응답을 오류로 유지하고 mock으로 대체하지 않는다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok({ ...authentication(), account: { id: 1, email: "synthetic@example.test", nickname: 123 } }));
    const repo = createHttpAuthRepository(createHttpClient("https://synthetic.test", fetcher));
    await expect(repo.refreshBrowserSession()).rejects.toMatchObject({ status: 502, code: "INVALID_AUTH_RESPONSE" });
  });
  it("mock 신규 가입 이름은 메모리에서만 유지하고 새 Repository에는 복사하지 않는다", async () => {
    const runtime = mockRuntime();
    const repo = createMockAuthRepository(runtime);
    const flow = new URL(repo.googleAuthorizationUrl("/", "", "signup"), "https://local.test");
    const flowId = flow.searchParams.get("flowId")!;
    const signup = await repo.getCurrentSocialSignup(flowId);
    await repo.completeSocialSignup(flowId, { name: "가상 신규", birthDate: null, mobilePhone: null, agreementAcceptances: signup.requiredAgreements });
    expect((await repo.refreshBrowserSession()).account.nickname).toBe("가상 신규");
    expect((await createMockAuthRepository(runtime).refreshBrowserSession()).account.nickname).toBeNull();
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
  it.each([true, false])("로그아웃 처리 중 계정 범위를 닫고 실패하면 현재 범위를 다시 알린다 (성공: %s)", async (succeeds) => {
    const session = createSessionController({
      refreshBrowserSession: async () => authentication(),
      logoutBrowserSession: async () => {
        if (!succeeds) throw new Error("synthetic logout failure");
      },
    });
    session.setAuthentication(authentication());
    const accountKeys: Array<string | null> = [];
    session.subscribe(() => accountKeys.push(session.getAccountKey()));

    const logout = session.logout();
    expect(accountKeys).toEqual([null]);
    if (succeeds) await expect(logout).resolves.toBeUndefined();
    else await expect(logout).rejects.toThrow("synthetic logout failure");

    expect(accountKeys.at(-1)).toBe(succeeds ? null : "1");
    expect(session.getSnapshot().status).toBe(succeeds ? "anonymous" : "authenticated");
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

describe("계정 관리의 연락용 이메일 읽기", () => {
  it("세션 응답의 연락용 이메일을 원문 그대로 사용한다", async () => {
    const address = "synthetic+contact@example.test";
    const wire = { ...authentication(), account: { id: 1, email: address, nickname: null } };
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok(wire));
    const repository = createHttpAuthRepository(createHttpClient("https://synthetic.test", fetcher));
    const session = await repository.refreshBrowserSession();

    expect(readContactEmail(session.account.email)).toEqual({ status: "available", address });
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith(
      "https://synthetic.test/api/v1/auth/token/refresh",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it.each([undefined, null, "", " \t "])("연락용 이메일 결측을 표시한다 (%s)", (value) => {
    expect(readContactEmail(value)).toEqual({ status: "missing" });
  });

  it.each([123, {}, "wrong-value", "synthetic@example.test\n", `${"a".repeat(250)}@example.test`])(
    "잘못된 값은 화면 표시용 주소로 반환하지 않는다 (%s)", (value) => {
      expect(readContactEmail(value)).toEqual({ status: "invalid" });
    },
  );
});

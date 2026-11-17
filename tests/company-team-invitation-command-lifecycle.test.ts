import { describe, expect, it, vi } from "vitest";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { createHttpCompanyRepository } from "@/data/company/http-repository";
import { createHttpClient } from "@/data/shared/http";
import { teamCatalogFixture } from "@/data/company/team-mock";
import type { TeamInvitation, TeamInvitationCommand } from "@/data/company/contracts";
import { ApiError } from "@/data/shared/errors";
import { canManageTeamInvitation, createTeamInvitationCommandScope, planTeamInvitationCommand, type TeamInvitationSnapshot } from "@/features/company/team-invitations";
import { access, authentication, mockRuntime, ok, testNow } from "./helpers";
import { invitationFixture, invitationPage } from "./company-team-invitation-fixtures";

type Repository = NonNullable<Parameters<typeof createTeamInvitationCommandScope>[2]>;
const catalog = teamCatalogFixture(), admin = catalog.presets.find(p => p.role === "ADMIN")!.permissionCodes;
const viewer = catalog.presets.find(p => p.role === "VIEWER")!.permissionCodes;
const current = () => ({ companyId: 7001, membershipId: 9101, permissionCodes: [...admin] });
const snapshot = (): TeamInvitationSnapshot => ({ companyId: 7001, catalog, current: current(), page: invitationPage(), positions: [], detail: invitationFixture() });
const result = (action: TeamInvitationCommand): TeamInvitation => ({ ...invitationFixture(), version: 2, status: action === "resend" ? "PENDING" : "CANCELED",
  delivery: { version: action === "resend" ? 2 : 1, status: "PENDING" }, completedAt: action === "resend" ? null : new Date(testNow).toISOString() });
function repository(overrides: Partial<Repository> = {}): Repository {
  return { ...createMockCompanyRepository(mockRuntime()), getCompanyTeamContext: vi.fn(async () => ({ companyId: 7001 })),
    getCurrentCompanyPermissions: vi.fn(async () => current()), getCompanyPermissionCatalog: vi.fn(async () => catalog),
    getCompanyTeamPositions: vi.fn(async () => []), listTeamInvitations: vi.fn(async () => invitationPage()), getTeamInvitation: vi.fn(async () => invitationFixture()),
    resendTeamInvitation: vi.fn(async () => result("resend")), cancelTeamInvitation: vi.fn(async () => result("cancel")), ...overrides };
}
const scope = (repo: Repository) => createTeamInvitationCommandScope(access, () => true, repo, () => testNow);

describe("기존 초대의 상태·권한 기준", () => {
  it("단말 만료의 직전/정확 경계와 모든 최종 상태를 구분한다", () => {
    const value = invitationFixture(), end = Date.parse(value.expiresAt);
    expect(canManageTeamInvitation(value, end - 1)).toBe(true); expect(canManageTeamInvitation(value, end)).toBe(false);
    for (const status of ["ACCEPTED", "DECLINED", "CANCELED", "EXPIRED"] as const) expect(canManageTeamInvitation({ ...value, status }, testNow)).toBe(false);
  });
  it("취소는 INVITE leaf, 재발송은 기존 grant 부분집합도 검사한다", () => {
    const s = snapshot(), value = { ...invitationFixture(), role: "ADMIN" as const, permissions: [...admin] };
    s.current.permissionCodes = [...viewer, "COMPANY_MEMBER_INVITE"]; s.page.capabilities.canManagePermissions = false;
    expect(() => planTeamInvitationCommand(s, value, "cancel", testNow)).not.toThrow();
    expect(() => planTeamInvitationCommand(s, value, "resend", testNow)).toThrow();
    expect(() => planTeamInvitationCommand(s, invitationFixture(), "resend", testNow)).not.toThrow();
    s.current.permissionCodes = [...viewer]; expect(() => planTeamInvitationCommand(s, value, "cancel", testNow)).toThrow();
  });
  it("대표자 재발송은 현재 ADMIN/공석을 검사하고 새 직급 제안 편집 권한을 추가하지 않는다", () => {
    const s = snapshot(), value = { ...invitationFixture(), representative: true, role: "ADMIN" as const, permissions: [...admin] };
    expect(() => planTeamInvitationCommand(s, value, "resend", testNow)).toThrow(); s.page.capabilities.canInviteRepresentative = true;
    expect(() => planTeamInvitationCommand(s, value, "resend", testNow)).not.toThrow();
    s.page.capabilities.canEditPosition = false;
    expect(() => planTeamInvitationCommand(s, invitationFixture(), "resend", testNow)).not.toThrow();
  });
});

describe("명시 초대 관리 scope", () => {
  it.each(["cancel", "resend"] as const)("%s는 최신 상세/version으로 한 번만 실행한다", async action => {
    const repo = repository(), command = scope(repo);
    expect(await command.submit(snapshot(), invitationFixture(), action)).toEqual(result(action));
    expect(repo.getTeamInvitation).toHaveBeenCalledWith(access, 7001, 8201, expect.any(AbortSignal));
    expect(action === "cancel" ? repo.cancelTeamInvitation : repo.resendTeamInvitation).toHaveBeenCalledWith(expect.objectContaining({ ...access, assertRequestScope: expect.any(Function) }), 7001, 8201, 1, expect.any(AbortSignal));
    await expect(command.submit(snapshot(), invitationFixture(), action)).rejects.toMatchObject({ code: "INVITATION_ALREADY_SUBMITTED" });
  });
  it.each(["ACCEPTED", "EXPIRED", "CANCELED", "DECLINED"] as const)("조회 중 %s가 되면 명령0", async status => {
    const repo = repository({ getTeamInvitation: vi.fn(async () => ({ ...invitationFixture(), status, completedAt: new Date(testNow).toISOString() })) });
    await expect(scope(repo).submit(snapshot(), invitationFixture(), "resend")).rejects.toThrow();
    expect(repo.resendTeamInvitation).not.toHaveBeenCalled(); expect(repo.cancelTeamInvitation).not.toHaveBeenCalled();
  });
  it("조회 중 version·권한·소속 변경은 자동으로 최신 명령을 만들지 않는다", async () => {
    for (const patch of [
      { getTeamInvitation: async () => ({ ...invitationFixture(), version: 2 }) },
      { getCurrentCompanyPermissions: async () => ({ ...current(), membershipId: 9102 }) },
      { getCurrentCompanyPermissions: async () => ({ ...current(), permissionCodes: [...viewer] }) },
      { listTeamInvitations: async () => ({ ...invitationPage(), capabilities: { ...invitationPage().capabilities, canInvite: false } }) },
    ]) {
      const repo = repository(patch); await expect(scope(repo).submit(snapshot(), invitationFixture(), "cancel")).rejects.toThrow(); expect(repo.cancelTeamInvitation).not.toHaveBeenCalled();
    }
  });
  it("확인 창 표시 후/최신 조회 중 단말 만료가 지나면 기존 명령0", async () => {
    let now = testNow;
    const repo = repository({ getTeamInvitation: async () => { now = Date.parse(invitationFixture().expiresAt); return invitationFixture(); } });
    await expect(createTeamInvitationCommandScope(access, () => true, repo, () => now).submit(snapshot(), invitationFixture(), "resend")).rejects.toMatchObject({ code: "INVITATION_NOT_PENDING" });
    expect(repo.resendTeamInvitation).not.toHaveBeenCalled();
    const expired = repository();
    await expect(createTeamInvitationCommandScope(access, () => true, expired, () => now).submit(snapshot(), invitationFixture(), "cancel")).rejects.toThrow();
    expect(expired.getTeamInvitation).not.toHaveBeenCalled(); expect(expired.cancelTeamInvitation).not.toHaveBeenCalled();
  });
  it("중복 클릭·응답 유실 뒤 같은 scope의 재발송을 금지한다", async () => {
    let release!: () => void; const waiting = new Promise<void>(resolve => { release = resolve; });
    const repo = repository({ resendTeamInvitation: vi.fn(async () => { await waiting; throw new ApiError(0, "NETWORK_ERROR", "가상 응답 유실"); }) });
    const command = scope(repo), first = command.submit(snapshot(), invitationFixture(), "resend");
    await expect(command.submit(snapshot(), invitationFixture(), "resend")).rejects.toMatchObject({ code: "INVITATION_ALREADY_SUBMITTED" }); release();
    await expect(first).rejects.toMatchObject({ code: "NETWORK_ERROR" });
    await expect(command.submit(snapshot(), invitationFixture(), "cancel")).rejects.toThrow(); expect(repo.resendTeamInvitation).toHaveBeenCalledOnce(); expect(repo.cancelTeamInvitation).not.toHaveBeenCalled();
  });
  it.each(["account", "epoch", "abort"])("명령 전 %s 수명 종료는 전송0, 명령 후에는 완료 폐기", async kind => {
    for (const after of [false, true]) {
      let account = "1", live = true;
      function change() { if (kind === "account") account = "2"; if (kind === "epoch") live = false; if (kind === "abort") command.dispose(); }
      const repo = repository({ getTeamInvitation: async () => { if (!after) change(); return invitationFixture(); }, resendTeamInvitation: vi.fn(async () => { change(); return result("resend"); }) });
      const command = createTeamInvitationCommandScope({ ...access, getAccountKey: () => account }, () => live, repo, () => testNow);
      await expect(command.submit(snapshot(), invitationFixture(), "resend")).rejects.toMatchObject({ name: "AbortError" });
      expect(repo.resendTeamInvitation).toHaveBeenCalledTimes(after ? 1 : 0);
    }
  });
  it("손상 성공·최종401/403/404/409는 성공/자동 명령이 아니다", async () => {
    for (const patch of [{ version: 1 }, { delivery: { version: 1, status: "SENT" as const } }, { permissions: [...admin], role: "ADMIN" as const }, { companyId: 7002 }]) {
      const repo = repository({ resendTeamInvitation: vi.fn(async () => ({ ...result("resend"), ...patch })) });
      await expect(scope(repo).submit(snapshot(), invitationFixture(), "resend")).rejects.toMatchObject({ code: "INVITATION_RESULT_MISMATCH" }); expect(repo.resendTeamInvitation).toHaveBeenCalledOnce();
    }
    for (const status of [401, 403, 404, 409]) {
      const repo = repository({ cancelTeamInvitation: vi.fn(async () => { throw new ApiError(status, "SYNTHETIC", "가상 서버 거부"); }) });
      await expect(scope(repo).submit(snapshot(), invitationFixture(), "cancel")).rejects.toMatchObject({ status }); expect(repo.cancelTeamInvitation).toHaveBeenCalledOnce();
    }
  });
});


describe("실제 HTTP dispatch의 초대 만료 수명", () => {
  it.each(["token", "refresh"])("%s 대기 중 만료되면 늦은 POST0이다", async kind => {
    let now = testNow;
    const value = { ...invitationFixture(), expiresAt: new Date(testNow + 10).toISOString() }, expiredDispatches: boolean[] = [];
    const fetcher = vi.fn<typeof fetch>(async () => { expiredDispatches.push(now >= Date.parse(value.expiresAt)); return ok(null, 401); });
    const actual = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
    const repo = repository({ getTeamInvitation: async () => value, listTeamInvitations: async () => invitationPage([value]), resendTeamInvitation: actual.resendTeamInvitation });
    const refresh = vi.fn(async () => { now += 20; return authentication(); });
    const port = { ...access, getAccessToken: async () => { if (kind === "token") now += 20; return "synthetic-token"; }, refresh };
    await expect(createTeamInvitationCommandScope(port, () => true, repo, () => now).submit({ ...snapshot(), detail: value }, value, "resend")).rejects.toMatchObject({ code: "INVITATION_EXPIRED" });
    expect(fetcher).toHaveBeenCalledTimes(kind === "token" ? 0 : 1); expect(refresh).toHaveBeenCalledTimes(kind === "refresh" ? 1 : 0);
    expect(expiredDispatches.every(v => !v)).toBe(true);
  });
});

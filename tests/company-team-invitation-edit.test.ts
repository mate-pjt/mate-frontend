import { describe, expect, it, vi } from "vitest";
import { createHttpCompanyRepository } from "@/data/company/http-repository";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { teamCatalogFixture } from "@/data/company/team-mock";
import { createHttpClient } from "@/data/shared/http";
import { ApiError } from "@/data/shared/errors";
import { createTeamInvitationCommandScope, planTeamInvitation, teamInvitationEditInput, type TeamInvitationSnapshot } from "@/features/company/team-invitations";
import { access, mockRuntime, ok, testNow } from "./helpers";
import { invitationFixture, invitationInput, invitationPage } from "./company-team-invitation-fixtures";

const catalog = teamCatalogFixture(), admin = catalog.presets.find(p => p.role === "ADMIN")!.permissionCodes;
const current = () => ({ companyId: 7001, membershipId: 9101, permissionCodes: [...admin] });
const positions = [{ id: 2, version: 1, name: "사원", type: "CUSTOM" as const }];
const snapshot = (): TeamInvitationSnapshot => ({ companyId: 7001, catalog, current: current(), page: invitationPage(), positions, detail: invitationFixture() });
type Repository = NonNullable<Parameters<typeof createTeamInvitationCommandScope>[2]>;
function setup() {
  let value = invitationFixture();
  const repo: Repository = { ...createMockCompanyRepository(mockRuntime()), getCompanyTeamContext: vi.fn(async () => ({ companyId: 7001 })), getCurrentCompanyPermissions: vi.fn(async () => current()),
    getCompanyPermissionCatalog: vi.fn(async () => catalog), getCompanyTeamPositions: vi.fn(async () => positions), listTeamInvitations: vi.fn(async () => invitationPage()), getTeamInvitation: vi.fn(async () => value),
    updateTeamInvitation: vi.fn(async (_a, _c, _id, version, input) => value = { ...value, inviteeDisplayName: input.inviteeDisplayName, message: input.message, version: version + 1 }),
    resendTeamInvitation: vi.fn(async (_a, _c, _id, version) => value = { ...value, version: version + 1, delivery: { version: 2, status: "PENDING" } }) };
  return { repo, value: () => value };
}
describe("초대 정보 PATCH", () => {
  it("wire에 이메일을 넣지 않으며 저장 응답을 메일 재발송으로 취급하지 않는다", async () => {
    const input = { ...invitationInput(), inviteeDisplayName: "수정한 합성 팀원", message: "변경 메시지" };
    const expected = { ...invitationFixture(), inviteeDisplayName: input.inviteeDisplayName, message: input.message, version: 2 };
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok(expected));
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
    expect(await repo.updateTeamInvitation(access, 7001, 8201, 1, input)).toEqual(expected);
    const { email, ...fields } = input; expect(email).toBe(expected.invitedEmail);
    expect(fetcher.mock.calls[0][1]?.method).toBe("PATCH"); expect(JSON.parse(String(fetcher.mock.calls[0][1]?.body))).toEqual({ expectedVersion: 1, ...fields });
    expect(new Headers(fetcher.mock.calls[0][1]?.headers).has("Idempotency-Key")).toBe(false); expect(fetcher).toHaveBeenCalledOnce();
  });
  it("mock 저장은 같은 delivery/만료를 보존하고 resend만 새 delivery를 만든다", async () => {
    const repo = createMockCompanyRepository(mockRuntime(undefined, { company: "connected" }));
    const first = await repo.createTeamInvitation(access, 7001, invitationInput()), edited = await repo.updateTeamInvitation(access, 7001, first.invitationId, 1, { ...invitationInput(), inviteeDisplayName: "수정한 합성 팀원" });
    expect(edited).toMatchObject({ version: 2, delivery: first.delivery, expiresAt: first.expiresAt, inviteeDisplayName: "수정한 합성 팀원" });
    expect(await repo.resendTeamInvitation(access, 7001, first.invitationId, 2)).toMatchObject({ version: 3, delivery: { version: 2 }, inviteeDisplayName: "수정한 합성 팀원" });
    await expect(repo.updateTeamInvitation(access, 7001, first.invitationId, 1, invitationInput())).rejects.toMatchObject({ code: "CI004" });
  });
  it("이메일/등록된 이름은 잠그고 직급·대표자 변경 leaf를 재검사한다", () => {
    const s = snapshot(), registered = { ...invitationFixture(), registeredAccount: true };
    expect(() => planTeamInvitation(s, { ...invitationInput(), email: "changed@example.test" }, invitationFixture())).toThrow();
    expect(() => planTeamInvitation(s, { ...invitationInput(), inviteeDisplayName: "변경 이름" }, registered)).toThrow();
    s.current.permissionCodes = [...catalog.presets.find(p => p.role === "VIEWER")!.permissionCodes, "COMPANY_MEMBER_INVITE"]; s.page.capabilities.canEditPosition = false;
    expect(() => planTeamInvitation(s, { ...invitationInput(), inviteeDisplayName: "변경 이름" }, invitationFixture())).not.toThrow();
    expect(() => planTeamInvitation(s, { ...invitationInput(), positionId: null, proposedPositionName: "변경 직급" }, invitationFixture())).toThrow();
    expect(teamInvitationEditInput(invitationFixture(), catalog)).toEqual(invitationInput());
  });
  it("mock도 등록된 이름과 이메일의 변경을 거부한다", async () => {
    const repo = createMockCompanyRepository(mockRuntime(undefined, { company: "connected" }));
    const input = { ...invitationInput(), email: "registered-member@example.test" }, value = await repo.createTeamInvitation(access, 7001, input);
    await expect(repo.updateTeamInvitation(access, 7001, value.invitationId, 1, input)).rejects.toMatchObject({ status: 400 });
    await expect(repo.updateTeamInvitation(access, 7001, value.invitationId, 1, { ...input, inviteeDisplayName: value.inviteeDisplayName, email: "changed@example.test" })).rejects.toMatchObject({ status: 400 });
  });
});

describe("명시 저장 후 재발송 pipeline", () => {
  it.each(["account", "epoch", "abort"])("PATCH 응답 뒤 %s 종료는 저장 receipt/후속 재발송을 이전 화면에 보내지 않는다", async kind => {
    const x = setup(), receipt = vi.fn(); let account = "1", live = true;
    const patch = x.repo.updateTeamInvitation;
    x.repo.updateTeamInvitation = vi.fn(async (...args) => {
      const value = await patch(...args);
      if (kind === "account") account = "2"; if (kind === "epoch") live = false; if (kind === "abort") command.dispose();
      return value;
    });
    const command = createTeamInvitationCommandScope({ ...access, getAccountKey: () => account }, () => live, x.repo, () => testNow, receipt);
    await expect(command.submit(snapshot(), invitationFixture(), "resend", { ...invitationInput(), message: "수정" })).rejects.toMatchObject({ name: "AbortError" });
    expect(x.repo.updateTeamInvitation).toHaveBeenCalledOnce(); expect(receipt).not.toHaveBeenCalled(); expect(x.repo.resendTeamInvitation).not.toHaveBeenCalled();
  });
  it("변경 없음은 PATCH0, 변경 있음은 PATCH1→최신 GET→새 version resend1이다", async () => {
    for (const edited of [false, true]) {
      const x = setup(), receipt = vi.fn(), command = createTeamInvitationCommandScope(access, () => true, x.repo, () => testNow, receipt);
      const input = { ...invitationInput(), inviteeDisplayName: edited ? "수정한 합성 팀원" : invitationInput().inviteeDisplayName };
      expect((await command.submit(snapshot(), invitationFixture(), "resend", input)).version).toBe(edited ? 3 : 2);
      expect(x.repo.updateTeamInvitation).toHaveBeenCalledTimes(edited ? 1 : 0); expect(receipt).toHaveBeenCalledTimes(edited ? 1 : 0);
      expect(x.repo.resendTeamInvitation).toHaveBeenCalledWith(expect.objectContaining({ ...access, assertRequestScope: expect.any(Function) }), 7001, 8201, edited ? 2 : 1, expect.any(AbortSignal));
      expect(x.repo.getTeamInvitation).toHaveBeenCalledTimes(edited ? 2 : 1);
    }
  });
  it.each(["failure", "lost", "malformed"])("PATCH %s 후 자동 resend0/재PATCH0이다", async kind => {
    const x = setup(); x.repo.updateTeamInvitation = vi.fn(async () => { if (kind === "malformed") return invitationFixture(); throw new ApiError(kind === "failure" ? 409 : 0, "SYNTHETIC", "합성 저장 실패"); });
    const command = createTeamInvitationCommandScope(access, () => true, x.repo, () => testNow);
    await expect(command.submit(snapshot(), invitationFixture(), "resend", { ...invitationInput(), message: "수정" })).rejects.toThrow();
    await expect(command.submit(snapshot(), invitationFixture(), "resend", { ...invitationInput(), message: "수정" })).rejects.toThrow();
    expect(x.repo.updateTeamInvitation).toHaveBeenCalledOnce(); expect(x.repo.resendTeamInvitation).not.toHaveBeenCalled();
  });
  it.each(["expired", "accepted", "version", "permission", "query", "resend"])("저장 뒤 %s 경합/실패는 저장 receipt를 보존한다", async kind => {
    const x = setup(), receipt = vi.fn(); let saved = false, now = testNow;
    const patch = x.repo.updateTeamInvitation;
    x.repo.updateTeamInvitation = vi.fn(async (...args) => { const value = await patch(...args); saved = true; return value; });
    const get = x.repo.getTeamInvitation;
    x.repo.getTeamInvitation = vi.fn(async (...args) => {
      const v = await get(...args); if (!saved) return v;
      if (kind === "query") throw new ApiError(503, "SYNTHETIC", "합성 조회 실패");
      if (kind === "expired") now = Date.parse(v.expiresAt);
      return kind === "accepted" ? { ...v, status: "ACCEPTED", completedAt: v.updatedAt } : kind === "version" ? { ...v, version: 99 } : v;
    });
    if (kind === "permission") x.repo.getCurrentCompanyPermissions = async () => ({ ...current(), permissionCodes: saved ? catalog.presets.find(p => p.role === "VIEWER")!.permissionCodes : admin });
    if (kind === "resend") x.repo.resendTeamInvitation = vi.fn(async () => { throw new ApiError(0, "NETWORK_ERROR", "합성 재발송 유실"); });
    const command = createTeamInvitationCommandScope(access, () => true, x.repo, () => now, receipt);
    await expect(command.submit(snapshot(), invitationFixture(), "resend", { ...invitationInput(), message: "수정" })).rejects.toThrow();
    expect(receipt).toHaveBeenCalledOnce(); expect(x.repo.updateTeamInvitation).toHaveBeenCalledOnce(); expect(x.repo.resendTeamInvitation).toHaveBeenCalledTimes(kind === "resend" ? 1 : 0);
  });
});


describe("D2 편집으로 grant를 축소하는 경로", () => {
  it("기존 ADMIN을 부여할 수 없어도 INVITE/MANAGE로 VIEWER PATCH 뒤 재발송한다", async () => {
    const x = setup(), s = snapshot(), viewer = catalog.presets.find(p => p.role === "VIEWER")!.permissionCodes;
    const actor = [...viewer, "COMPANY_MEMBER_INVITE", "COMPANY_MEMBER_PERMISSION_MANAGE"];
    let value = { ...invitationFixture(), role: "ADMIN" as "ADMIN" | "VIEWER", permissions: [...admin] };
    s.current.permissionCodes = actor; s.detail = value;
    x.repo.getCurrentCompanyPermissions = async () => ({ ...current(), permissionCodes: actor });
    x.repo.getTeamInvitation = async () => value; x.repo.listTeamInvitations = async () => invitationPage([value]);
    x.repo.updateTeamInvitation = vi.fn(async (_a, _c, _id, version, input) => value = { ...value, role: "VIEWER", permissions: [...viewer], inviteeDisplayName: input.inviteeDisplayName, message: input.message, version: version + 1 });
    x.repo.resendTeamInvitation = vi.fn(async (_a, _c, _id, version) => value = { ...value, version: version + 1, delivery: { version: 2, status: "PENDING" } });
    const command = createTeamInvitationCommandScope(access, () => true, x.repo, () => testNow);
    expect(await command.submit(s, s.detail!, "resend", invitationInput())).toMatchObject({ version: 3, role: "VIEWER", permissions: viewer });
    expect(x.repo.updateTeamInvitation).toHaveBeenCalledOnce(); expect(x.repo.resendTeamInvitation).toHaveBeenCalledOnce();
    s.current.permissionCodes = [...viewer];
    await expect(createTeamInvitationCommandScope(access, () => true, x.repo, () => testNow).submit(s, value, "resend", invitationInput())).rejects.toMatchObject({ status: 403 });
  });
});

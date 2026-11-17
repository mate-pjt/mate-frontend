import { describe, expect, it, vi } from "vitest";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { teamCatalogFixture } from "@/data/company/team-mock";
import { ApiError } from "@/data/shared/errors";
import { createTeamInvitationScope, loadTeamInvitations, planTeamInvitation, teamInvitationDeliveryLabel, teamInvitationStatus, type TeamInvitationSnapshot } from "@/features/company/team-invitations";
import { access, mockRuntime, testNow } from "./helpers";
import { invitationInput, invitationFixture, invitationPage } from "./company-team-invitation-fixtures";

type Repository = NonNullable<Parameters<typeof loadTeamInvitations>[4]>;
const catalog = teamCatalogFixture(), admin = catalog.presets.find(p => p.role === "ADMIN")!.permissionCodes;
const viewer = catalog.presets.find(p => p.role === "VIEWER")!.permissionCodes;
const current = () => ({ companyId: 7001, membershipId: 9101, permissionCodes: [...admin] });
const positions = () => [{ id: 2, version: 1, name: "사원", type: "CUSTOM" as const }];
const snapshot = (): TeamInvitationSnapshot => ({ companyId: 7001, catalog, current: current(), page: invitationPage(), positions: positions() });
function repository(overrides: Partial<Repository> = {}): Repository {
  return { ...createMockCompanyRepository(mockRuntime()),
    getCompanyTeamContext: vi.fn(async () => ({ companyId: 7001 })), getCurrentCompanyPermissions: vi.fn(async () => current()),
    getCompanyPermissionCatalog: vi.fn(async () => catalog), getCompanyTeamPositions: vi.fn(async () => positions()),
    listTeamInvitations: vi.fn(async () => invitationPage()), getTeamInvitation: vi.fn(async () => invitationFixture()),
    createTeamInvitation: vi.fn(async () => invitationFixture()), ...overrides };
}
const signal = () => new AbortController().signal;

describe("초대 조회·grant 수명", () => {
  it("같은 company의 page/상세·catalog·전후 현재 소속/leaf를 확인한다", async () => {
    const repo = repository(); const value = await loadTeamInvitations(access, 7001, 0, signal(), repo, () => true, 8201);
    expect(value.detail?.invitationId).toBe(8201); expect(repo.getCurrentCompanyPermissions).toHaveBeenCalledTimes(2);
    expect(repo.listTeamInvitations).toHaveBeenCalledWith(access, 7001, 0, 20, expect.any(AbortSignal));
    expect(repo.getTeamInvitation).toHaveBeenCalledWith(access, 7001, 8201, expect.any(AbortSignal));
  });
  it("조회 leaf와 기본 권한 없음은 목록 호출 전에 거부한다", async () => {
    for (const permissions of [[], ["COMPANY_MEMBER_LIST_VIEW"], [...viewer, "UNKNOWN"]]) {
      const repo = repository({ getCurrentCompanyPermissions: vi.fn(async () => ({ ...current(), permissionCodes: permissions })) });
      await expect(loadTeamInvitations(access, 7001, 0, signal(), repo)).rejects.toBeInstanceOf(ApiError); expect(repo.listTeamInvitations).not.toHaveBeenCalled();
    }
  });
  it("post-read 회사/현재 소속/leaf 변경은 응답을 노출하지 않는다", async () => {
    const context = vi.fn().mockResolvedValueOnce({ companyId: 7001 }).mockResolvedValueOnce({ companyId: 7002 });
    await expect(loadTeamInvitations(access, 7001, 0, signal(), repository({ getCompanyTeamContext: context }))).rejects.toMatchObject({ status: 409 });
    for (const after of [{ ...current(), membershipId: 9201 }, { ...current(), permissionCodes: viewer }, { ...current(), companyId: 7002 }]) {
      const read = vi.fn().mockResolvedValueOnce(current()).mockResolvedValueOnce(after);
      await expect(loadTeamInvitations(access, 7001, 0, signal(), repository({ getCurrentCompanyPermissions: read }))).rejects.toMatchObject({ status: 409 });
    }
  });
  it("페이지·상세의 다른 회사/ID·알 수 없는 권한이나 role 불일치를 거부한다", async () => {
    for (const patch of [{ companyId: 7002 }, { permissions: [...viewer, "UNKNOWN"] }, { role: "ADMIN" as const }]) {
      const repo = repository({ listTeamInvitations: vi.fn(async () => invitationPage([{ ...invitationFixture(), ...patch }])) });
      await expect(loadTeamInvitations(access, 7001, 0, signal(), repo)).rejects.toThrow();
    }
    await expect(loadTeamInvitations(access, 7001, 0, signal(), repository(), () => true, 9999)).rejects.toThrow();
  });
  it.each([401, 403, 404, 503])("최종 조회 %s는 빈 목록이나 성공으로 만들지 않는다", async status => {
    const repo = repository({ listTeamInvitations: async () => { throw new ApiError(status, "SYNTHETIC", "가상 오류"); } });
    await expect(loadTeamInvitations(access, 7001, 0, signal(), repo)).rejects.toMatchObject({ status });
  });
  it.each(["account", "epoch", "abort"])("늦은 조회는 %s 변경 뒤 폐기한다", async kind => {
    let account = "1", live = true; const controller = new AbortController();
    const repo = repository({ listTeamInvitations: async () => {
      if (kind === "account") account = "2"; if (kind === "epoch") live = false; if (kind === "abort") controller.abort(); return invitationPage();
    } });
    await expect(loadTeamInvitations({ ...access, getAccountKey: () => account }, 7001, 0, controller.signal, repo, () => live)).rejects.toMatchObject({ name: "AbortError" });
  });
  it("추가 invite leaf VIEWER와 행동별 제한·actor 부분집합을 구분한다", () => {
    const s = snapshot(); s.current.permissionCodes = [...viewer, "COMPANY_MEMBER_INVITE"];
    s.page.capabilities = { canInvite: true, canEditPosition: false, canManagePermissions: false, canInviteRepresentative: false };
    expect(planTeamInvitation(s, invitationInput()).permissions).toEqual(viewer);
    expect(() => planTeamInvitation(s, { ...invitationInput(), positionId: null, proposedPositionName: "새 직급" })).toThrow();
    expect(() => planTeamInvitation(s, { ...invitationInput(), extraPermissionCodes: ["COMPANY_MEMBER_INVITE"] })).toThrow();
    s.current.permissionCodes.push("COMPANY_MEMBER_PERMISSION_MANAGE"); s.page.capabilities.canManagePermissions = true;
    expect(planTeamInvitation(s, { ...invitationInput(), extraPermissionCodes: ["COMPANY_MEMBER_INVITE"] }).permissions).toContain("COMPANY_MEMBER_INVITE");
    expect(() => planTeamInvitation(s, { ...invitationInput(), extraPermissionCodes: ["COMPANY_INFORMATION_EDIT"] })).toThrow();
  });
  it("직급 권한이 없어도 기존 일반 직급 선택을 막지 않는다", () => {
    const s = snapshot(); s.current.permissionCodes = [...viewer, "COMPANY_MEMBER_INVITE"]; s.page.capabilities.canEditPosition = false;
    expect(planTeamInvitation(s, invitationInput()).body.positionId).toBe(2);
  });
  it("대표자 공석 capability와 현재 ADMIN·일반 직급을 각각 확인한다", () => {
    const s = snapshot(), body = { ...invitationInput(), representative: true, positionId: null, preset: null };
    expect(() => planTeamInvitation(s, body)).toThrow(); s.page.capabilities.canInviteRepresentative = true;
    expect(planTeamInvitation(s, body).permissions).toEqual(admin); s.current.permissionCodes = [...viewer, "COMPANY_MEMBER_INVITE"];
    expect(() => planTeamInvitation(s, body)).toThrow();
    expect(() => planTeamInvitation(snapshot(), { ...invitationInput(), positionId: 99 })).toThrow();
  });
});

describe("초대 명령은 명시 제출 한 번", () => {
  it("제출 직전 최신 문맥/선택 직급을 읽고 명시 필드로 한 번만 보낸다", async () => {
    const repo = repository(), scope = createTeamInvitationScope(access, () => true, repo);
    expect(await scope.submit(snapshot(), invitationInput())).toEqual(invitationFixture());
    expect(repo.getCompanyTeamPositions).toHaveBeenCalledOnce(); expect(repo.createTeamInvitation).toHaveBeenCalledWith(access, 7001, invitationInput(), expect.any(AbortSignal));
    await expect(scope.submit(snapshot(), invitationInput())).rejects.toMatchObject({ code: "INVITATION_ALREADY_SUBMITTED" }); expect(repo.createTeamInvitation).toHaveBeenCalledOnce();
  });
  it("동시 클릭과 응답 유실 뒤 같은 scope의 재생성을 막는다", async () => {
    let release!: () => void; const wait = new Promise<void>(resolve => { release = resolve; });
    const repo = repository({ createTeamInvitation: vi.fn(async () => { await wait; throw new ApiError(0, "NETWORK_ERROR", "가상 응답 유실"); }) });
    const scope = createTeamInvitationScope(access, () => true, repo), first = scope.submit(snapshot(), invitationInput());
    await expect(scope.submit(snapshot(), invitationInput())).rejects.toMatchObject({ code: "INVITATION_ALREADY_SUBMITTED" }); release();
    await expect(first).rejects.toMatchObject({ code: "NETWORK_ERROR" });
    await expect(scope.submit(snapshot(), invitationInput())).rejects.toThrow(); expect(repo.createTeamInvitation).toHaveBeenCalledOnce();
  });
  it("권한·소속·catalog·직급 정의 변경 뒤는 POST하지 않는다", async () => {
    const overrides: Partial<Repository>[] = [
      { getCurrentCompanyPermissions: async () => ({ ...current(), membershipId: 9201 }) },
      { getCurrentCompanyPermissions: async () => ({ ...current(), permissionCodes: viewer }) },
      { getCompanyPermissionCatalog: async () => ({ ...catalog, catalogVersion: "changed" }) },
      { getCompanyTeamPositions: async () => [{ ...positions()[0], version: 2 }] },
      { listTeamInvitations: async () => ({ ...invitationPage(), capabilities: { ...invitationPage().capabilities, canInvite: false } }) },
    ];
    for (const override of overrides) {
      const repo = repository(override); await expect(createTeamInvitationScope(access, () => true, repo).submit(snapshot(), invitationInput())).rejects.toThrow(); expect(repo.createTeamInvitation).not.toHaveBeenCalled();
    }
  });
  it.each(["account", "epoch", "abort"])("생성 뒤 %s 변경은 UI 완료/Toast에 반환하지 않는다", async kind => {
    let account = "1", live = true;
    const repo = repository({ createTeamInvitation: vi.fn(async () => {
      if (kind === "account") account = "2"; if (kind === "epoch") live = false; if (kind === "abort") scope.dispose(); return invitationFixture();
    }) });
    const scope = createTeamInvitationScope({ ...access, getAccountKey: () => account }, () => live, repo);
    await expect(scope.submit(snapshot(), invitationInput())).rejects.toMatchObject({ name: "AbortError" }); expect(repo.createTeamInvitation).toHaveBeenCalledOnce();
  });
  it("잘못된 성공의 회사/email/상태/권한은 완료가 아니며 자동 재명령하지 않는다", async () => {
    for (const patch of [{ companyId: 7002 }, { invitedEmail: "other@example.test" }, { status: "EXPIRED" as const }, { permissions: admin }]) {
      const repo = repository({ createTeamInvitation: vi.fn(async () => ({ ...invitationFixture(), ...patch })) }), scope = createTeamInvitationScope(access, () => true, repo);
      await expect(scope.submit(snapshot(), invitationInput())).rejects.toMatchObject({ code: "INVITATION_RESULT_MISMATCH" });
      await expect(scope.submit(snapshot(), invitationInput())).rejects.toThrow(); expect(repo.createTeamInvitation).toHaveBeenCalledOnce();
    }
  });
  it("시작 전 dispose는 조회와 명령 모두 실행하지 않는다", async () => {
    const repo = repository(), scope = createTeamInvitationScope(access, () => true, repo); scope.dispose();
    await expect(scope.submit(snapshot(), invitationInput())).rejects.toMatchObject({ name: "AbortError" }); expect(repo.getCompanyTeamContext).not.toHaveBeenCalled(); expect(repo.createTeamInvitation).not.toHaveBeenCalled();
  });
  it("실제 expiresAt와 status/delivery를 구분한다", () => {
    expect(teamInvitationStatus(invitationFixture(), testNow)).toBe("수락 대기");
    expect(teamInvitationStatus(invitationFixture(), testNow + 7 * 86_400_000)).toBe("만료");
    expect(teamInvitationDeliveryLabel("SENT")).toBe("메일 전송 처리 완료"); expect(teamInvitationDeliveryLabel("FAILED")).toBe("메일 전송 실패");
    expect(teamInvitationStatus({ ...invitationFixture(), status: "ACCEPTED" })).toBe("수락 완료");
  });
});

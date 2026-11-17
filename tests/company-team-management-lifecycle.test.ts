import { describe, expect, it, vi } from "vitest";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { teamCatalogFixture } from "@/data/company/team-mock";
import { classifyTeamChange, type CompanyTeamManagementRepository, type CompanyTeamRepository } from "@/data/company/contracts";
import { ApiError } from "@/data/shared/errors";
import { memoryStorage } from "@/data/mock/store";
import { createTeamCommandScope, loadTeamChanges, planTeamChange } from "@/features/company/team-management";
import { loadCompanyTeam } from "@/features/company/team";
import { access, mockRuntime } from "./helpers";
import { changeFixture, endedChange, viewerPermissions } from "./company-team-management-fixtures";

const repository = () => createMockCompanyRepository(mockRuntime(memoryStorage(), { company: "connected" }));
async function snapshot(repo = repository(), id = 9102) {
  const result = await loadCompanyTeam(access, 0, id, new AbortController().signal, repo);
  if (result.status !== "detail") throw new Error("detail expected");
  return { result, positions: await repo.getCompanyTeamPositions(access, 7001), repo };
}
describe("팀원 변경 분류·현재 조건과 제출 수명", () => {
  it("직접 낮은 대상·ADMIN 승격 동의·본인 전용 경로를 구분한다", async () => {
    const { result, positions, repo } = await snapshot();
    expect(planTeamChange(result, positions, { action: "position", positionId: 3 }).mode).toBe("position");
    expect(planTeamChange(result, positions, { action: "permissions", permissionCodes: result.catalog.presets.find(p => p.role === "ADMIN")!.permissionCodes, positionId: result.member.positionId }).mode).toBe("request");
    const self = await snapshot(repo, 9101);
    expect(planTeamChange(self.result, positions, { action: "position", positionId: 2 }).mode).toBe("self");
    expect(() => planTeamChange(self.result, positions, { action: "remove" })).toThrow();
    expect(() => planTeamChange(result, positions, { action: "permissions", permissionCodes: viewerPermissions, positionId: 3 })).toThrow(/각각 저장/);
  });
  it("같은 role/대표자 대상도 현재 leaf/부분집합을 우회하지 못한다", async () => {
    const catalog = teamCatalogFixture(), { result } = await snapshot();
    const actor = [...viewerPermissions, "COMPANY_MEMBER_PROFILE_EDIT", "COMPANY_MEMBER_PERMISSION_MANAGE"];
    expect(classifyTeamChange(catalog, actor, result.member, "POSITION", { id: 3, name: "담당자", type: "CUSTOM", version: 1 }, null)).toBe("FORBIDDEN");
    expect(classifyTeamChange(catalog, actor, { ...result.member, permissions: viewerPermissions, positionType: "CUSTOM" }, "PERMISSIONS", null, [...viewerPermissions, "COMPANY_MEMBER_INVITE"])).toBe("FORBIDDEN");
    expect(classifyTeamChange(catalog, actor, { ...result.member, permissions: viewerPermissions, positionType: "CUSTOM" }, "POSITION", { id: 3, name: "담당자", type: "CUSTOM", version: 1 }, null)).toBe("CONSENT");
    const noFlag = { ...result, member: { ...result.member, capabilities: { ...result.member.capabilities, canChangePosition: false, canRequestPositionChange: false } } };
    expect(() => planTeamChange(noFlag, [{ id: 3, name: "담당자", type: "CUSTOM", version: 1 }], { action: "position", positionId: 3 })).toThrow();
  });
  it("직접 명령은 preflight 뒤1회만 실행하며 명시 재조회 전 같은 scope를 재사용하지 않는다", async () => {
    const { result, positions, repo } = await snapshot(); const change = vi.spyOn(repo, "changeTeamMemberPosition");
    const scope = createTeamCommandScope(access, () => true, repo);
    expect((await scope.member(result, positions, { action: "position", positionId: 3 })).message).toMatch(/적용/);
    await expect(scope.member(result, positions, { action: "position", positionId: 3 })).rejects.toMatchObject({ code: "TEAM_ALREADY_SUBMITTED" });
    expect(change).toHaveBeenCalledTimes(1); expect(change.mock.calls[0][2]).toEqual({ expectedVersion: 1, positionId: 3 });
  });
  it("동시 제출은 한 명령만 허용한다", async () => {
    const { result, positions, repo } = await snapshot(); const change = vi.spyOn(repo, "changeTeamMemberPosition");
    const scope = createTeamCommandScope(access, () => true, repo);
    const calls = await Promise.allSettled([scope.member(result, positions, { action: "position", positionId: 3 }), scope.member(result, positions, { action: "position", positionId: 3 })]);
    expect(calls.filter(c => c.status === "fulfilled")).toHaveLength(1); expect(change).toHaveBeenCalledTimes(1);
  });
  it("상태/version·직급 정의가 바뀌면 명령 전에 멈춘다", async () => {
    const { result, positions, repo } = await snapshot(); await repo.changeTeamMemberPosition(access, 9102, { expectedVersion: 1, positionId: 3 });
    const change = vi.spyOn(repo, "changeTeamMemberPosition");
    await expect(createTeamCommandScope(access, () => true, repo).member(result, positions, { action: "position", positionId: 3 })).rejects.toMatchObject({ status: 409 }); expect(change).not.toHaveBeenCalled();
    const next = await snapshot(repo); const definitions = vi.spyOn(repo, "getCompanyTeamPositions").mockResolvedValue(next.positions.map(p => p.id === 2 ? { ...p, version: 2 } : p));
    await expect(createTeamCommandScope(access, () => true, repo).member(next.result, next.positions, { action: "position", positionId: 2 })).rejects.toMatchObject({ status: 409 });
    expect(definitions).toHaveBeenCalled(); expect(change).not.toHaveBeenCalled();
  });
  it("현재 회사·소속/권한 교체는 이전 snapshot으로 제출하지 않는다", async () => {
    const { result, positions, repo } = await snapshot(), change = vi.spyOn(repo, "changeTeamMemberPosition");
    vi.spyOn(repo, "getCurrentCompanyPermissions").mockResolvedValue({ companyId: 7001, membershipId: 9101, permissionCodes: viewerPermissions });
    await expect(createTeamCommandScope(access, () => true, repo).member(result, positions, { action: "position", positionId: 3 })).rejects.toMatchObject({ status: 409 }); expect(change).not.toHaveBeenCalled();
  });
  it("응답 유실·409는 자동으로 재변경하거나 성공으로 표시하지 않는다", async () => {
    const { result, positions, repo } = await snapshot(); const change = vi.spyOn(repo, "changeTeamMemberPosition").mockRejectedValue(new ApiError(0, "NETWORK", "synthetic response lost"));
    const scope = createTeamCommandScope(access, () => true, repo);
    await expect(scope.member(result, positions, { action: "position", positionId: 3 })).rejects.toMatchObject({ code: "NETWORK" });
    await expect(scope.member(result, positions, { action: "position", positionId: 3 })).rejects.toMatchObject({ code: "TEAM_ALREADY_SUBMITTED" }); expect(change).toHaveBeenCalledTimes(1);
  });
  it.each(["dispose", "epoch", "account"])("늦은 명령 응답은 폐기한다: %s", async kind => {
    const { result, positions, repo } = await snapshot(); let resolve!: (v: Awaited<ReturnType<typeof repo.changeTeamMemberPosition>>) => void;
    const original = repo.changeTeamMemberPosition.bind(repo); let current = true, account = "1";
    const changed = await original(access, 9102, { expectedVersion: 1, positionId: 3 });
    const latest = await snapshot(repo); vi.spyOn(repo, "changeTeamMemberPosition").mockImplementation(() => new Promise(r => { resolve = r; }));
    const scope = createTeamCommandScope({ ...access, getAccountKey: () => account }, () => current, repo);
    const pending = scope.member(latest.result, positions, { action: "position", positionId: 2 });
    const assertion = expect(pending).rejects.toMatchObject({ name: "AbortError" });
    await vi.waitFor(() => expect(resolve).toBeTypeOf("function"));
    if (kind === "dispose") scope.dispose(); if (kind === "epoch") current = false; if (kind === "account") account = "2";
    resolve({ ...changed, version: 3, positionId: 2, positionName: "사원" }); await assertion;
    expect(result.member.version).toBe(1);
  });
});

describe("변경 요청 조회·명시 결정 수명", () => {
  function requestRepo(): CompanyTeamRepository & CompanyTeamManagementRepository {
    return { ...repository(), getTeamChangeRequest: vi.fn(async () => ({ ...changeFixture(), targetMembershipId: 9101, capabilities: { canAccept: true, canReject: true, canCancel: true, blockingReason: null } })),
      decideTeamChangeRequest: vi.fn(async () => ({ ...endedChange("APPLIED"), targetMembershipId: 9101 })), cancelTeamChangeRequest: vi.fn(async () => ({ ...endedChange("CANCELED"), targetMembershipId: 9101 })) };
  }
  it("상세/알림 열기는 조회만 하고 명시 수락에서만 결정한다", async () => {
    const repo = requestRepo(); const loaded = await loadTeamChanges(access, { scope: "mine" }, 5101, new AbortController().signal, repo);
    expect(repo.decideTeamChangeRequest).not.toHaveBeenCalled(); expect(loaded.status).toBe("detail");
    if (loaded.status !== "detail") throw new Error("detail expected");
    const result = await createTeamCommandScope(access, () => true, repo).request(loaded.request, "ACCEPT");
    expect(result.message).toMatch(/수락/); expect(repo.decideTeamChangeRequest).toHaveBeenCalledTimes(1);
  });
  it("현재 target가 다르면 서버 capabilities만으로 결정하지 않는다", async () => {
    const repo = requestRepo(), request = { ...changeFixture(), capabilities: { canAccept: true, canReject: true, canCancel: false, blockingReason: null } };
    vi.mocked(repo.getTeamChangeRequest).mockResolvedValue(request);
    await expect(createTeamCommandScope(access, () => true, repo).request(request, "ACCEPT")).rejects.toMatchObject({ status: 403 }); expect(repo.decideTeamChangeRequest).not.toHaveBeenCalled();
  });
  it("과거 소속은 결과만 조회하며 새 회사 권한으로 결정하지 않는다", async () => {
    const repo = requestRepo(), request = { ...endedChange("APPLIED"), companyId: 7999 };
    vi.mocked(repo.getTeamChangeRequest).mockResolvedValue(request);
    const result = await loadTeamChanges(access, { scope: "mine" }, 5101, new AbortController().signal, repo); expect(result.status).toBe("detail");
    await expect(createTeamCommandScope(access, () => true, repo).request(request, "ACCEPT")).rejects.toMatchObject({ status: 409 });
    expect(repo.decideTeamChangeRequest).not.toHaveBeenCalled();
  });
  it("요청 version·capabilities 갱신 뒤 자동 수락/취소하지 않는다", async () => {
    const repo = requestRepo(), request = await repo.getTeamChangeRequest(access, 5101);
    vi.mocked(repo.getTeamChangeRequest).mockResolvedValue({ ...request, requestVersion: 2 });
    await expect(createTeamCommandScope(access, () => true, repo).request(request, "ACCEPT")).rejects.toMatchObject({ status: 409 });
    expect(repo.decideTeamChangeRequest).not.toHaveBeenCalled(); expect(repo.cancelTeamChangeRequest).not.toHaveBeenCalled();
  });
  it("회사 목록의 같은 회사 권한 회수·소속 교체 뒤 늦은 응답은 폐기한다", async () => {
    const repo = requestRepo(), initial = { companyId: 7001, membershipId: 9101, permissionCodes: teamCatalogFixture().presets.find(p => p.role === "ADMIN")!.permissionCodes };
    vi.spyOn(repo, "listTeamChangeRequests").mockResolvedValue({ content: [changeFixture()], page: 0, size: 20, totalElements: 1, totalPages: 1 });
    const current = vi.spyOn(repo, "getCurrentCompanyPermissions").mockResolvedValueOnce(initial).mockResolvedValueOnce({ ...initial, permissionCodes: viewerPermissions });
    await expect(loadTeamChanges(access, { scope: "company" }, undefined, new AbortController().signal, repo)).rejects.toMatchObject({ code: "TEAM_PERMISSIONS_CHANGED" });
    expect(current).toHaveBeenCalledTimes(2);
    current.mockResolvedValueOnce(initial).mockResolvedValueOnce({ ...initial, membershipId: 9199 });
    await expect(loadTeamChanges(access, { scope: "company" }, undefined, new AbortController().signal, repo)).rejects.toMatchObject({ code: "TEAM_PERMISSIONS_CHANGED" });
  });
  it("같은 회사 타인 상세도 전후 leaf를 확인하고 권한 없는 내용을 반환하지 않는다", async () => {
    const repo = requestRepo(), initial = { companyId: 7001, membershipId: 9101, permissionCodes: teamCatalogFixture().presets.find(p => p.role === "ADMIN")!.permissionCodes };
    vi.mocked(repo.getTeamChangeRequest).mockResolvedValue(changeFixture());
    vi.spyOn(repo, "getCurrentCompanyPermissions").mockResolvedValueOnce(initial).mockResolvedValueOnce({ ...initial, permissionCodes: viewerPermissions });
    await expect(loadTeamChanges(access, { scope: "mine" }, 5101, new AbortController().signal, repo)).rejects.toMatchObject({ code: "TEAM_PERMISSIONS_CHANGED" });
  });
  it("취소 직전 읽은 현재 leaf가 부족하면 오래된 canCancel을 사용해 POST하지 않는다", async () => {
    const repo = requestRepo(), request = await repo.getTeamChangeRequest(access, 5101);
    vi.spyOn(repo, "getCurrentCompanyPermissions").mockResolvedValue({ companyId: 7001, membershipId: 9101, permissionCodes: viewerPermissions });
    await expect(createTeamCommandScope(access, () => true, repo).request(request, "CANCEL")).rejects.toMatchObject({ status: 403 });
    expect(repo.cancelTeamChangeRequest).not.toHaveBeenCalled();
  });
  it("소속 없는 본인 과거 이력은 회사 leaf 없이 조회하고 회사 대상 프로필을 합성하지 않는다", async () => {
    const repo = requestRepo(); vi.spyOn(repo, "getCompanyTeamContext").mockResolvedValue({ companyId: null });
    vi.mocked(repo.getTeamChangeRequest).mockResolvedValue(endedChange("APPLIED"));
    const permissions = vi.spyOn(repo, "getCurrentCompanyPermissions"), target = vi.spyOn(repo, "getCompanyTeamMember");
    const result = await loadTeamChanges(access, { scope: "mine" }, 5101, new AbortController().signal, repo);
    expect(result.status).toBe("detail"); expect(result.targets).toEqual({}); expect(permissions).not.toHaveBeenCalled(); expect(target).not.toHaveBeenCalled();
  });
  it("회사 요청의 대상을 exact ID로 조회하고404만 명시 fallback으로 남긴다", async () => {
    const repo = requestRepo(); vi.mocked(repo.getTeamChangeRequest).mockResolvedValue(changeFixture());
    const target = vi.spyOn(repo, "getCompanyTeamMember");
    const result = await loadTeamChanges(access, { scope: "mine" }, 5101, new AbortController().signal, repo);
    expect(result.targets[9104]?.displayName).toBe("가상 팀원 4"); expect(target).toHaveBeenCalledWith(access, 7001, 9104, expect.any(AbortSignal));
    target.mockRejectedValueOnce(new ApiError(404, "CM003", "synthetic ended target"));
    expect((await loadTeamChanges(access, { scope: "mine" }, 5101, new AbortController().signal, repo)).targets[9104]).toBeNull();
  });
  it("REUSED의 실제 terminal 상태를 대기 안내로 바꾸지 않는다", async () => {
    const { result, positions, repo } = await snapshot();
    vi.spyOn(repo, "createTeamChangeRequest").mockResolvedValue({ outcome: "REUSED", request: { ...endedChange("APPLIED"), targetMembershipId: 9102 }, membership: null });
    const commit = await createTeamCommandScope(access, () => true, repo).member(result, positions, { action: "permissions", positionId: result.member.positionId, permissionCodes: teamCatalogFixture().presets.find(p => p.role === "ADMIN")!.permissionCodes });
    expect(commit.message).toMatch(/적용 완료/); expect(commit.message).not.toMatch(/수락 전/);
  });
});

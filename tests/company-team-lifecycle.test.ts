import { describe, expect, it, vi } from "vitest";
import type { CompanyTeamRepository } from "@/data/company/contracts";
import { teamCatalogFixture, teamMemberFixtures } from "@/data/company/team-mock";
import { ApiError } from "@/data/shared/errors";
import { loadCompanyTeam, teamDate, teamDetailPath, teamListPath, teamMemberName, teamMembershipId, teamPageNumber } from "@/features/company/team";
import { access } from "./helpers";

const current = { companyId: 7001, membershipId: 9101, permissionCodes: ["COMPANY_MEMBER_LIST_VIEW"] };
const member = teamMemberFixtures()[0];
function repository(overrides: Partial<CompanyTeamRepository> = {}): CompanyTeamRepository {
  return { getCompanyTeamContext: vi.fn(async () => ({ companyId: 7001 })), getCompanyPermissionCatalog: vi.fn(async () => teamCatalogFixture()),
    getCurrentCompanyPermissions: vi.fn(async () => current), getCompanyTeamMember: vi.fn(async () => member),
    listCompanyTeamMembers: vi.fn(async () => ({ content: [member], page: 0, size: 20, totalElements: 1, totalPages: 1, capabilities: { canInvite: false, canReviewRequests: false, canManagePositions: false } })), ...overrides };
}
const signal = () => new AbortController().signal;

describe("팀원 조회 수명과 접근", () => {
  it("회사 없음을 인증의 임의 role이나 과거 회사로 대체하지 않는다", async () => {
    const repo = repository({ getCompanyTeamContext: vi.fn(async () => ({ companyId: null })) });
    expect(await loadCompanyTeam(access, 0, undefined, signal(), repo)).toEqual({ status: "no-company" });
    expect(repo.getCompanyPermissionCatalog).not.toHaveBeenCalled(); expect(repo.listCompanyTeamMembers).not.toHaveBeenCalled();
  });
  it("목록/상세는 현재leaf·catalog·같은 company와 exact target을 사용한다", async () => {
    const repo = repository();
    expect(await loadCompanyTeam(access, 0, undefined, signal(), repo)).toMatchObject({ status: "list", companyId: 7001 });
    expect(repo.listCompanyTeamMembers).toHaveBeenCalledWith(access, 7001, 0, 20, expect.any(AbortSignal));
    expect(await loadCompanyTeam(access, 1, 9101, signal(), repo)).toMatchObject({ status: "detail", member });
    expect(repo.getCompanyTeamMember).toHaveBeenCalledWith(access, 7001, 9101, expect.any(AbortSignal));
    expect(repo.getCurrentCompanyPermissions).toHaveBeenCalledTimes(4);
  });
  it("조회 leaf 없음/회사 불일치/알 수 없는 leaf는 목록 호출 전에 거절한다", async () => {
    for (const permissions of [{ ...current, permissionCodes: [] }, { ...current, companyId: 7002 }, { ...current, permissionCodes: ["UNKNOWN"] }]) {
      const repo = repository({ getCurrentCompanyPermissions: vi.fn(async () => permissions) });
      await expect(loadCompanyTeam(access, 0, undefined, signal(), repo)).rejects.toBeInstanceOf(ApiError);
      expect(repo.listCompanyTeamMembers).not.toHaveBeenCalled();
    }
  });
  it.each([401, 403, 404, 503])("최종 %i를 상위 UI에 전달한다", async status => {
    const repo = repository({ getCompanyTeamMember: async () => { throw new ApiError(status, "SYNTHETIC", "조회 실패"); } });
    await expect(loadCompanyTeam(access, 0, 9101, signal(), repo)).rejects.toMatchObject({ status });
  });
  it("늦은 목록이 계정/epoch/화면 종료 뒤 도착해도 반환하지 않는다", async () => {
    for (const changed of ["account", "epoch", "abort"]) {
      let account = "1", epoch = true;
      const controller = new AbortController();
      const repo = repository();
      const list = repo.listCompanyTeamMembers;
      repo.listCompanyTeamMembers = async (...args) => {
        const value = await list(...args);
        if (changed === "account") account = "2";
        if (changed === "epoch") epoch = false;
        if (changed === "abort") controller.abort();
        return value;
      };
      await expect(loadCompanyTeam({ ...access, getAccountKey: () => account }, 0, undefined, controller.signal, repo, () => epoch)).rejects.toMatchObject({ name: "AbortError" });
    }
  });
  it("회사 전환/탈퇴·권한 상실·소속 교체를 마지막 확인에서 막는다", async () => {
    const context = vi.fn().mockResolvedValueOnce({ companyId: 7001 }).mockResolvedValueOnce({ companyId: 7002 });
    await expect(loadCompanyTeam(access, 0, undefined, signal(), repository({ getCompanyTeamContext: context }))).rejects.toMatchObject({ code: "TEAM_CONTEXT_CHANGED" });
    for (const latest of [{ ...current, permissionCodes: [] }, { ...current, membershipId: 9201 }, { ...current, permissionCodes: [...current.permissionCodes, "COMPANY_MEMBER_INVITE"] }]) {
      const permission = vi.fn().mockResolvedValueOnce(current).mockResolvedValueOnce(latest);
      await expect(loadCompanyTeam(access, 0, 9101, signal(), repository({ getCurrentCompanyPermissions: permission }))).rejects.toBeInstanceOf(ApiError);
    }
  });
  it("시작 전 중단은 회사 조회도 실행하지 않는다", async () => {
    const controller = new AbortController(); controller.abort(); const repo = repository();
    await expect(loadCompanyTeam(access, 0, undefined, controller.signal, repo)).rejects.toMatchObject({ name: "AbortError" });
    expect(repo.getCompanyTeamContext).not.toHaveBeenCalled();
  });
});

describe("팀원 URL·결측 표시", () => {
  it("목록 page와 exact 소속을 안전한 내부 경로로 왕복한다", () => {
    expect(teamPageNumber(undefined)).toBe(1); expect(teamPageNumber("2")).toBe(2);
    expect(teamListPath(2)).toBe("/my/team?page=2"); expect(teamDetailPath(9101, 2)).toBe("/my/team/9101?page=2");
    expect(teamMembershipId("9101")).toBe(9101);
  });
  it.each(["0", "-1", "1.5", "01", "NaN", "9007199254740992", ["1", "2"]])("잘못된 페이지/소속을 조용히 보정하지 않는다 %j", value => {
    expect(teamPageNumber(value)).toBeNull();
    if (typeof value === "string") expect(teamMembershipId(value)).toBeNull();
  });
  it("이름/최근 로그인 결측을 개인정보/가짜 날짜로 채우지 않는다", () => {
    expect(teamMemberName({ ...member, displayName: "  " })).toBe("이름 미제공"); expect(teamDate(null)).toBe("기록 없음");
    expect(teamDate("2026-11-16T16:02:00Z", true)).toBe("2026.11.17 01:02");
  });
});

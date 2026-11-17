import { describe, expect, it, vi } from "vitest";
import { createHttpCompanyRepository } from "@/data/company/http-repository";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { mapCurrentPermissions, mapPermissionCatalog, mapTeamMember, mapTeamPage } from "@/data/company/team-api";
import { emptyMemberCapabilities, teamCatalogFixture, teamMemberFixtures } from "@/data/company/team-mock";
import { createHttpClient } from "@/data/shared/http";
import { memoryStorage } from "@/data/mock/store";
import { ApiError } from "@/data/shared/errors";
import { access, authentication, mockRuntime, ok } from "./helpers";

const wireMember = () => ({ ...teamMemberFixtures()[0], accountId: 1 });
const wirePage = () => ({ content: [wireMember()], page: 0, size: 20, totalElements: 1, totalPages: 1, capabilities: { canInvite: true, canReviewRequests: false, canManagePositions: true } });

describe("팀원 HTTP 조회 계약", () => {
  it("현재 회사는 같은 company 포트의 refresh에서 얻고 기본정보 leaf/API를 추가 요구하지 않는다", async () => {
    const fetcher = vi.fn<typeof fetch>();
    const repository = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
    const port = { ...access, refresh: vi.fn(async () => ({ ...authentication(), companyContext: { companyId: 7001, role: "VIEWER" } })) };
    expect(await repository.getCompanyTeamContext(port)).toEqual({ companyId: 7001 });
    expect(port.refresh).toHaveBeenCalledWith({ preserveOnError: true });
    expect(await repository.getCompanyTeamContext(access)).toEqual({ companyId: null });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("catalog/현재 leaf·page0/size20·exact 소속 상세를 보호 GET으로 읽는다", async () => {
    const current = { companyId: 7001, membershipId: 9101, permissionCodes: ["COMPANY_MEMBER_LIST_VIEW"] };
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok(teamCatalogFixture())).mockResolvedValueOnce(ok(current)).mockResolvedValueOnce(ok(wirePage())).mockResolvedValueOnce(ok(wireMember()));
    const repository = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
    expect(await repository.getCompanyPermissionCatalog(access)).toEqual(teamCatalogFixture());
    expect(await repository.getCurrentCompanyPermissions(access, 7001)).toEqual(current);
    expect((await repository.listCompanyTeamMembers(access, 7001)).capabilities).toEqual(wirePage().capabilities);
    expect(await repository.getCompanyTeamMember(access, 7001, 9101)).not.toHaveProperty("accountId");
    expect(fetcher.mock.calls.map(call => new URL(String(call[0])).pathname + new URL(String(call[0])).search)).toEqual([
      "/api/v1/company-permission-definitions", "/api/v1/companies/7001/memberships/me", "/api/v1/companies/7001/members?page=0&size=20", "/api/v1/companies/7001/members/9101",
    ]);
    for (const [, init] of fetcher.mock.calls) expect(init).toMatchObject({ method: "GET", credentials: "include", cache: "no-store" });
  });
  it.each([[0, 0, 20], [7001, -1, 20], [7001, 0.1, 20], [7001, 0, 0], [7001, 0, 101], [7001, 2_147_483_647, 100]])("입력 손상은 HTTP 전에 거절한다 %j", async (company, page, size) => {
    const fetcher = vi.fn<typeof fetch>();
    await expect(createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher)).listCompanyTeamMembers(access, company, page, size)).rejects.toMatchObject({ status: 400 });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("전체 빈 목록과 범위 밖 page·size100의 count를 구분한다", () => {
    const empty = { ...wirePage(), content: [], totalElements: 0, totalPages: 0 };
    expect(mapTeamPage(empty, 0, 20).totalElements).toBe(0);
    expect(mapTeamPage({ ...empty, page: 1, size: 100, totalElements: 23, totalPages: 1 }, 1, 100).totalElements).toBe(23);
  });
  it.each([
    { ...wirePage(), content: [] }, { ...wirePage(), totalPages: 0 }, { ...wirePage(), page: 2 }, { ...wirePage(), totalElements: -1 },
    { ...wirePage(), content: [wireMember(), wireMember()], totalElements: 2 }, { ...wirePage(), capabilities: { canInvite: true } },
  ])("손상된 페이지/flags를 빈 성공으로 바꾸지 않는다 %#", page => expect(() => mapTeamPage(page, 0, 20)).toThrow(ApiError));
  it("서버의 joinedAt ASC/id ASC를 보존하고 다른 순서를 거부한다", () => {
    const first = wireMember(), next = { ...first, membershipId: 9102 };
    const page = { ...wirePage(), content: [first, next], totalElements: 2 };
    expect(mapTeamPage(page, 0, 20).content.map(member => member.membershipId)).toEqual([9101, 9102]);
    expect(() => mapTeamPage({ ...page, content: [next, first] }, 0, 20)).toThrow(ApiError);
    const precise = [{ ...next, joinedAt: "2026-11-17T00:00:00.000001Z" }, { ...first, joinedAt: "2026-11-17T00:00:00.000002Z" }];
    expect(mapTeamPage({ ...page, content: precise }, 0, 20).content.map(member => member.membershipId)).toEqual([9102, 9101]);
  });
  it("nullable·9flags와 role/leaf를 그대로 보존하고 지원되지 않은 개인정보/계정ID를 버린다", () => {
    const member = mapTeamMember({ ...wireMember(), displayName: null, profileImageUrl: null, lastLoginAt: null, birthDate: "2000-01-01", mobilePhone: "01000000000", capabilities: { ...emptyMemberCapabilities(), canRequestPositionChange: true } });
    expect(member).toMatchObject({ displayName: null, lastLoginAt: null, profileImageUrl: null, capabilities: { canChangePosition: false, canRequestPositionChange: true } });
    expect(member).not.toHaveProperty("birthDate"); expect(member).not.toHaveProperty("mobilePhone"); expect(member).not.toHaveProperty("accountId");
  });
  it.each([
    { ...wireMember(), version: 0 }, { ...wireMember(), accountId: null }, { ...wireMember(), displayName: undefined },
    { ...wireMember(), lastLoginAt: undefined }, { ...wireMember(), joinedAt: "2026-02-30T00:00:00Z" },
    { ...wireMember(), profileImageUrl: "javascript:alert(1)" }, { ...wireMember(), profileImageUrl: "https://user:secret@example.test/image" },
    { ...wireMember(), capabilities: { ...emptyMemberCapabilities(), canRequestRemoval: undefined } }, { ...wireMember(), permissions: ["VIEW", "VIEW"] },
  ])("손상된 상세는 실제 정보처럼 표시하지 않는다 %#", value => expect(() => mapTeamMember(value)).toThrow(ApiError));
  it("catalog의 unique code/preset 참조·현재 회사 일치를 검사한다", () => {
    expect(mapPermissionCatalog(teamCatalogFixture()).categories.flatMap(category => category.permissions)).toHaveLength(15);
    expect(() => mapPermissionCatalog({ ...teamCatalogFixture(), presets: [{ role: "ADMIN", permissionCodes: ["UNKNOWN"] }] })).toThrow(ApiError);
    expect(() => mapCurrentPermissions({ companyId: 7002, membershipId: 9101, permissionCodes: [] }, 7001)).toThrow(ApiError);
  });
  it.each([401, 403, 404, 503])("HTTP 오류 %i를 전파하고 자동 fallback하지 않는다", async status => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok(null, status));
    await expect(createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher)).getCompanyTeamMember(access, 7001, 9101)).rejects.toMatchObject({ status });
  });
  it("다른 exact 대상/Swagger success wrapper를 거부한다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok({ ...wireMember(), membershipId: 9102 })).mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: wirePage() })));
    const repository = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
    await expect(repository.getCompanyTeamMember(access, 7001, 9101)).rejects.toThrow(ApiError);
    await expect(repository.listCompanyTeamMembers(access, 7001)).rejects.toThrow(ApiError);
  });
});

describe("같은 company mock의 팀원 조회", () => {
  it.each(["connected", "team-agent", "team-viewer", "team-extra", "team-read-only"])("명시 시나리오 %s의 page/detail·현재leaf를 보존한다", async scenario => {
    const repository = createMockCompanyRepository(mockRuntime(memoryStorage(), { company: scenario }));
    expect(await repository.getCompanyTeamContext(access)).toEqual({ companyId: 7001 });
    const page = await repository.listCompanyTeamMembers(access, 7001);
    expect(page.totalElements).toBe(23); expect(page.content).toHaveLength(20); expect(page.totalPages).toBe(2);
    expect((await repository.listCompanyTeamMembers(access, 7001, 1)).content).toHaveLength(3);
    expect(await repository.getCompanyTeamMember(access, 7001, page.content[0].membershipId)).toEqual(page.content[0]);
    expect((await repository.getCurrentCompanyPermissions(access, 7001)).permissionCodes).toEqual(page.content[0].permissions);
    if (scenario === "team-extra") { expect(page.content[0].role).toBe("VIEWER"); expect(page.capabilities.canInvite).toBe(true); }
    if (scenario === "team-read-only") { expect(Object.values(page.capabilities).some(Boolean)).toBe(false); expect(page.content.every(member => !Object.values(member.capabilities).some(Boolean))).toBe(true); }
  });
  it("다른 회사·없는/탈퇴 대상·계정교체·명시 거부·빈 목록을 구분한다", async () => {
    const storage = memoryStorage(), repository = createMockCompanyRepository(mockRuntime(storage, { company: "connected" }));
    await expect(repository.getCompanyTeamMember(access, 7002, 9101)).rejects.toMatchObject({ status: 403 });
    await expect(repository.getCompanyTeamMember(access, 7001, 999999)).rejects.toMatchObject({ status: 404 });
    const denied = createMockCompanyRepository(mockRuntime(memoryStorage(), { company: "team-denied" }));
    await expect(denied.listCompanyTeamMembers(access, 7001)).rejects.toMatchObject({ status: 403 });
    expect((await createMockCompanyRepository(mockRuntime(memoryStorage(), { company: "team-empty" })).listCompanyTeamMembers(access, 7001)).totalElements).toBe(0);
    let account = "1";
    const port = { ...access, getAccountKey: () => account, getAccessToken: async () => { account = "2"; return "synthetic-token"; } };
    await expect(repository.listCompanyTeamMembers(port, 7001)).rejects.toMatchObject({ code: "ACCOUNT_CHANGED" });
  });
  it("같은 저장소의 다른 계정과 기존 회사 상태를 섞거나 초기화하지 않는다", async () => {
    const storage = memoryStorage(); storage.setItem("unrelated", "preserve");
    const runtime = mockRuntime(storage), repo = createMockCompanyRepository(runtime);
    await repo.previewInvitation("mock-invite-account-2");
    const other = { ...access, getAccountKey: () => "2" };
    await repo.acceptInvitation(other, 1);
    expect(await repo.getCompanyTeamContext(access)).toEqual({ companyId: null });
    expect(await repo.getCompanyTeamContext(other)).toEqual({ companyId: 7001 });
    const restored = createMockCompanyRepository(mockRuntime(storage));
    expect(await restored.getCompanyTeamContext(other)).toEqual({ companyId: 7001 });
    expect(await restored.getCompanyTeamContext(access)).toEqual({ companyId: null });
    expect(storage.getItem("unrelated")).toBe("preserve");
  });
  it("API 인증+회사 mock은 실제 token/refresh를 요청하지 않고 현재 회사 공급원을 따른다", async () => {
    const runtime = mockRuntime(memoryStorage(), { company: "connected" }); runtime.authSource = "api";
    const port = { ...access, refresh: vi.fn(async () => authentication()), getAccessToken: vi.fn(async () => "must-not-use") };
    const repository = createMockCompanyRepository(runtime);
    expect((await repository.listCompanyTeamMembers(port, 7001)).content).toHaveLength(20);
    expect(port.refresh).not.toHaveBeenCalled(); expect(port.getAccessToken).not.toHaveBeenCalled();
    const fixture = await repository.getCompanyPermissionCatalog(port); fixture.categories.length = 0;
    expect((await repository.getCompanyPermissionCatalog(port)).categories).toHaveLength(3);
  });
});

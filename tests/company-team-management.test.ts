import { describe, expect, it, vi } from "vitest";
import { createHttpCompanyRepository } from "@/data/company/http-repository";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { mapTeamChangeRequest, mapTeamMutation } from "@/data/company/team-management-api";
import { teamCatalogFixture } from "@/data/company/team-mock";
import { createHttpClient } from "@/data/shared/http";
import { memoryStorage } from "@/data/mock/store";
import { access, mockRuntime, ok } from "./helpers";
import { changeFixture, endedChange, key, mutationFixture, nextKey, viewerPermissions } from "./company-team-management-fixtures";

const http = (fetcher: typeof fetch) => createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
const mock = (scenario = "connected") => createMockCompanyRepository(mockRuntime(memoryStorage(), { company: scenario }));
const admin = () => teamCatalogFixture().presets.find(p => p.role === "ADMIN")!.permissionCodes;
describe("팀원 관리 HTTP wire", () => {
  it("직급/권한 직접 변경의 정확한 method·body·보호 옵션과 개인정보 폐기를 확인한다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockImplementation(async () => ok({ ...mutationFixture(), accountId: 1, endedByAccountId: null, privateField: "not copied" }));
    const repo = http(fetcher);
    const value = await repo.changeTeamMemberPosition(access, 9102, { expectedVersion: 1, positionId: 3 });
    expect(value).not.toHaveProperty("accountId"); expect(value).not.toHaveProperty("privateField");
    await repo.changeTeamMemberPermissions(access, 9102, { expectedVersion: 1, permissionCodes: viewerPermissions });
    expect(fetcher.mock.calls.map(([url, init]) => [new URL(String(url)).pathname, init?.method, JSON.parse(String(init?.body))])).toEqual([
      ["/api/v1/company-memberships/9102/position", "PATCH", { expectedVersion: 1, positionId: 3 }],
      ["/api/v1/company-memberships/9102/permissions", "PATCH", { expectedVersion: 1, permissionCodes: viewerPermissions }],
    ]);
    expect(fetcher.mock.calls.every(([, init]) => init?.credentials === "include" && init.cache === "no-store")).toBe(true);
    expect(fetcher.mock.calls.every(([, init]) => !new Headers(init?.headers).has("Idempotency-Key"))).toBe(true);
  });
  it("자기 축소·탈퇴/내보내기의 endpoint별 version 위치를 유지한다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok(mutationFixture()))
      .mockResolvedValueOnce(ok({ ...mutationFixture(), status: "LEFT", endedAt: mutationFixture().updatedAt }))
      .mockResolvedValueOnce(ok({ ...mutationFixture(), status: "REMOVED", endedAt: mutationFixture().updatedAt }));
    const repo = http(fetcher);
    await repo.demoteMyTeamMembership(access, 9102, { expectedVersion: 1, permissionCodes: viewerPermissions, positionId: 3 });
    await repo.leaveMyTeamMembership(access, 9102, 1); await repo.removeCompanyTeamMember(access, 9102, 1);
    expect(fetcher.mock.calls.map(([url, init]) => [new URL(String(url)).pathname + new URL(String(url)).search, init?.method, init?.body && JSON.parse(String(init.body))])).toEqual([
      ["/api/v1/company-memberships/9102/self-demotion", "POST", { expectedVersion: 1, permissionCodes: viewerPermissions, positionId: 3 }],
      ["/api/v1/company-memberships/9102/leave", "POST", { expectedVersion: 1 }], ["/api/v1/company-memberships/9102?expectedVersion=1", "DELETE", undefined],
    ]);
  });
  it("생성 CREATED/REUSED/NO_CHANGE와 target·version·내용을 검사한다", async () => {
    const request = changeFixture(), noChange = { ...mutationFixture(), membershipId: 9104, positionId: 2, version: 1, permissions: request.proposedPermissionCodes! };
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok({ outcome: "CREATED", request, membership: null }, 201)).mockResolvedValueOnce(ok({ outcome: "REUSED", request, membership: null })).mockResolvedValueOnce(ok({ outcome: "NO_CHANGE", request: null, membership: noChange }));
    const repo = http(fetcher), body = { requestKey: key, expectedMembershipVersion: 1, kind: "PERMISSIONS" as const, permissionCodes: request.proposedPermissionCodes! };
    expect((await repo.createTeamChangeRequest(access, 9104, body)).outcome).toBe("CREATED");
    expect((await repo.createTeamChangeRequest(access, 9104, body)).outcome).toBe("REUSED");
    expect((await repo.createTeamChangeRequest(access, 9104, body)).outcome).toBe("NO_CHANGE");
    expect(JSON.parse(String(fetcher.mock.calls[0][1]?.body))).toEqual(body);
  });
  it("동의 결정·취소는 각 새 UUID/요청 version으로 보내고 terminal 상태를 검사한다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok(endedChange("APPLIED"))).mockResolvedValueOnce(ok(endedChange("REJECTED"))).mockResolvedValueOnce(ok(endedChange("CANCELED")));
    const repo = http(fetcher);
    await repo.decideTeamChangeRequest(access, 5101, { requestKey: key, expectedRequestVersion: 1, decision: "ACCEPT" });
    await repo.decideTeamChangeRequest(access, 5101, { requestKey: nextKey, expectedRequestVersion: 1, decision: "REJECT" });
    await repo.cancelTeamChangeRequest(access, 5101, { requestKey: key, expectedRequestVersion: 1 });
    expect(fetcher.mock.calls.map(([url]) => new URL(String(url)).pathname)).toEqual(["/api/v1/company-membership-change-requests/5101/decisions", "/api/v1/company-membership-change-requests/5101/decisions", "/api/v1/company-membership-change-requests/5101/cancellations"]);
    expect(JSON.parse(String(fetcher.mock.calls[0][1]?.body))).toEqual({ requestKey: key, expectedRequestVersion: 1, decision: "ACCEPT" });
  });
  it("회사·본인 목록의 서버 page/count/상태·대상 필터와 상세 exact ID를 유지한다", async () => {
    const p = { content: [changeFixture()], page: 0, size: 20, totalElements: 1, totalPages: 1 };
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok(p)).mockResolvedValueOnce(ok(p)).mockResolvedValueOnce(ok(changeFixture()));
    const repo = http(fetcher);
    await repo.listTeamChangeRequests(access, { scope: "company", companyId: 7001, status: "PENDING", membershipId: 9104 });
    await repo.listTeamChangeRequests(access, { scope: "mine" }); await repo.getTeamChangeRequest(access, 5101);
    expect(fetcher.mock.calls.map(([url]) => new URL(String(url)).pathname + new URL(String(url)).search)).toEqual([
      "/api/v1/companies/7001/membership-change-requests?page=0&size=20&status=PENDING&membershipId=9104", "/api/v1/me/membership-change-requests?page=0&size=20", "/api/v1/company-membership-change-requests/5101",
    ]);
  });
  it.each([0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1])("잘못된 id/version %s는 HTTP 전에 거절한다", async n => {
    const fetcher = vi.fn<typeof fetch>(); const repo = http(fetcher);
    await expect(repo.changeTeamMemberPosition(access, n, { expectedVersion: 1, positionId: 3 })).rejects.toMatchObject({ status: 400 });
    await expect(repo.changeTeamMemberPosition(access, 9102, { expectedVersion: n, positionId: 3 })).rejects.toMatchObject({ status: 400 });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("잘못된 UUID/kind 필드/중복 leaf/필터 조합을 HTTP 전에 거부한다", async () => {
    const fetcher = vi.fn<typeof fetch>(), repo = http(fetcher);
    await expect(repo.createTeamChangeRequest(access, 9104, { requestKey: "invalid", expectedMembershipVersion: 1, kind: "REMOVE" })).rejects.toMatchObject({ status: 400 });
    await expect(repo.createTeamChangeRequest(access, 9104, { requestKey: key, expectedMembershipVersion: 1, kind: "REMOVE", positionId: 3 } as never)).rejects.toMatchObject({ status: 400 });
    await expect(repo.changeTeamMemberPermissions(access, 9102, { expectedVersion: 1, permissionCodes: ["A", "A"] })).rejects.toMatchObject({ status: 400 });
    await expect(repo.listTeamChangeRequests(access, { scope: "mine", companyId: 7001 })).rejects.toMatchObject({ status: 400 });
    await expect(repo.decideTeamChangeRequest(access, 5101, { requestKey: "invalid", expectedRequestVersion: 1, decision: "ACCEPT" })).rejects.toMatchObject({ status: 400 });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it.each([
    { ...mutationFixture(), membershipId: 9103 }, { ...mutationFixture(), version: 0 }, { ...mutationFixture(), endedAt: undefined },
    { ...mutationFixture(), status: "REMOVED" }, { ...mutationFixture(), joinedAt: "2030-02-30T00:00:00Z" }, { ...mutationFixture(), permissions: [] },
  ])("손상된 mutation을 완료로 바꾸지 않는다 %#", value => expect(() => mapTeamMutation(value, 9102)).toThrow());
  it.each([
    { ...changeFixture(), capabilities: {} }, { ...changeFixture(), status: "APPLIED" }, { ...changeFixture(), expectedMembershipVersion: 0 },
    { ...changeFixture(), proposedPosition: null }, { ...changeFixture(), kind: "REMOVE" }, { ...changeFixture(), issuerName: undefined },
    { ...endedChange("CANCELED"), capabilities: changeFixture().capabilities }, { ...changeFixture(), beforePosition: { id: 1 } },
  ])("손상된 요청은 대기·적용 성공으로 바꾸지 않는다 %#", value => expect(() => mapTeamChangeRequest(value)).toThrow());
  it.each([401, 403, 404, 409, 503])("서버 오류 %s는 전파하며 자동 업무 재명령·fallback하지 않는다", async status => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok(null, status)), repo = http(fetcher);
    await expect(repo.createTeamChangeRequest(access, 9104, { requestKey: key, expectedMembershipVersion: 1, kind: "REMOVE" })).rejects.toMatchObject({ status });
    expect(fetcher.mock.calls.every(([url]) => new URL(String(url)).pathname.endsWith("/change-requests"))).toBe(true);
  });
  it("다른 요청·목록 count/회사·손상 success wrapper·미확정 응답을 거부한다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok({ ...changeFixture(), changeRequestId: 5102 }))
      .mockResolvedValueOnce(ok({ content: [], page: 0, size: 20, totalElements: 1, totalPages: 1 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: mutationFixture() })))
      .mockRejectedValueOnce(new TypeError("synthetic response lost"));
    const repo = http(fetcher);
    await expect(repo.getTeamChangeRequest(access, 5101)).rejects.toThrow();
    await expect(repo.listTeamChangeRequests(access, { scope: "mine" })).rejects.toThrow();
    await expect(repo.changeTeamMemberPosition(access, 9102, { expectedVersion: 1, positionId: 3 })).rejects.toThrow();
    await expect(repo.changeTeamMemberPosition(access, 9102, { expectedVersion: 1, positionId: 3 })).rejects.toThrow();
  });
});

describe("가변 팀원 mock·불변식", () => {
  it("병렬 명령은 같은 version을 한 번만 소비하고 앞선 성공을 잃지 않는다", async () => {
    const runtime = mockRuntime(memoryStorage(), { company: "connected" }), a = createMockCompanyRepository(runtime), b = createMockCompanyRepository(runtime);
    const results = await Promise.allSettled([
      a.changeTeamMemberPosition(access, 9102, { expectedVersion: 1, positionId: 3 }),
      b.changeTeamMemberPermissions(access, 9102, { expectedVersion: 1, permissionCodes: viewerPermissions }),
    ]);
    expect(results.map(r => r.status)).toEqual(["fulfilled", "rejected"]);
    expect(results[1]).toMatchObject({ reason: { code: "CM010" } });
    expect(await a.getCompanyTeamMember(access, 7001, 9102)).toMatchObject({ version: 2, positionId: 3, role: "AGENT" });
  });
  it("관리자 경쟁에서도 한 명령의 최신 결과를 다음 명령이 확인한다", async () => {
    const repo = mock();
    const results = await Promise.allSettled([repo.leaveMyTeamMembership(access, 9101, 1), repo.removeCompanyTeamMember(access, 9104, 1)]);
    expect(results.map(r => r.status)).toEqual(["fulfilled", "rejected"]);
    expect(await repo.getCompanyTeamContext(access)).toEqual({ companyId: null });
  });
  it("직접 변경/새로고침 복원·같은 상태의 version 보존·본인/계정 격리를 확인한다", async () => {
    const storage = memoryStorage(), runtime = mockRuntime(storage, { company: "connected" }), repo = createMockCompanyRepository(runtime);
    const result = await repo.changeTeamMemberPosition(access, 9102, { expectedVersion: 1, positionId: 3 }); expect(result.version).toBe(2);
    expect((await repo.changeTeamMemberPosition(access, 9102, { expectedVersion: 2, positionId: 3 })).version).toBe(2);
    expect((await createMockCompanyRepository(mockRuntime(storage, { company: "connected" })).getCompanyTeamMember(access, 7001, 9102)).positionId).toBe(3);
    expect((await repo.getCompanyTeamMember({ ...access, getAccountKey: () => "2" }, 7001, 9102)).positionId).toBe(2);
    await expect(repo.changeTeamMemberPermissions(access, 9101, { expectedVersion: 1, permissionCodes: viewerPermissions })).rejects.toMatchObject({ status: 403 });
  });
  it("낮은 대상의 ADMIN 승격도 동의가 필요하고 생성은 권한을 바꾸지 않는다", async () => {
    const repo = mock();
    await expect(repo.changeTeamMemberPermissions(access, 9102, { expectedVersion: 1, permissionCodes: admin() })).rejects.toMatchObject({ status: 403 });
    const body = { requestKey: key, expectedMembershipVersion: 1, kind: "PERMISSIONS" as const, permissionCodes: admin() };
    const result = await repo.createTeamChangeRequest(access, 9102, body); expect(result.outcome).toBe("CREATED");
    expect((await repo.getCompanyTeamMember(access, 7001, 9102)).role).toBe("AGENT");
    expect((await repo.createTeamChangeRequest(access, 9102, body)).outcome).toBe("REUSED");
    expect((await repo.createTeamChangeRequest(access, 9102, { ...body, requestKey: nextKey })).outcome).toBe("REUSED");
    expect((await repo.listTeamChangeRequests(access, { scope: "company", companyId: 7001 })).totalElements).toBe(1);
    await expect(repo.createTeamChangeRequest(access, 9102, { requestKey: crypto.randomUUID(), expectedMembershipVersion: 1, kind: "POSITION", positionId: 1 })).rejects.toMatchObject({ code: "CMC004" });
    await expect(repo.createTeamChangeRequest(access, 9102, { ...body, permissionCodes: viewerPermissions })).rejects.toMatchObject({ code: "CMC005" });
  });
  it("허용된 direct 제안은 기존 명령으로 안내하고 no-change는 version을 보존한다", async () => {
    const repo = mock();
    await expect(repo.createTeamChangeRequest(access, 9102, { requestKey: key, expectedMembershipVersion: 1, kind: "POSITION", positionId: 3 })).rejects.toMatchObject({ code: "CMC007" });
    const result = await repo.createTeamChangeRequest(access, 9104, { requestKey: nextKey, expectedMembershipVersion: 1, kind: "PERMISSIONS", permissionCodes: admin() });
    expect(result.outcome).toBe("NO_CHANGE"); expect(result.membership?.version).toBe(1);
  });
  it("본인 수락/거절·회사 취소·replay와 다른 target 결정 금지를 구분한다", async () => {
    const repo = mock("team-pending"), request = (await repo.listTeamChangeRequests(access, { scope: "mine" })).content[0];
    const accepted = await repo.decideTeamChangeRequest(access, request.changeRequestId, { requestKey: key, expectedRequestVersion: 1, decision: "ACCEPT" });
    expect(accepted.status).toBe("APPLIED"); expect((await repo.getCompanyTeamMember(access, 7001, 9101)).positionId).toBe(3);
    expect((await repo.decideTeamChangeRequest(access, request.changeRequestId, { requestKey: key, expectedRequestVersion: 1, decision: "ACCEPT" })).status).toBe("APPLIED");
    const rejected = mock("team-pending"); await rejected.listTeamChangeRequests(access, { scope: "mine" });
    expect((await rejected.decideTeamChangeRequest(access, 5101, { requestKey: key, expectedRequestVersion: 1, decision: "REJECT" })).status).toBe("REJECTED");
    expect((await rejected.getCompanyTeamMember(access, 7001, 9101)).positionId).toBe(1);
    const company = mock(); const created = await company.createTeamChangeRequest(access, 9104, { requestKey: key, expectedMembershipVersion: 1, kind: "REMOVE" });
    if (!created.request) throw new Error("request expected");
    await expect(company.decideTeamChangeRequest(access, created.request.changeRequestId, { requestKey: nextKey, expectedRequestVersion: 1, decision: "ACCEPT" })).rejects.toMatchObject({ status: 403 });
    expect((await company.cancelTeamChangeRequest(access, created.request.changeRequestId, { requestKey: nextKey, expectedRequestVersion: 1 })).status).toBe("CANCELED");
  });
  it("시간 경과만으로 만료되지 않으며 발행자 상태와 무관하게 현재 target/version을 확인한다", async () => {
    let clock = Date.parse("2030-06-01T01:00:00Z"); const storage = memoryStorage(), runtime = mockRuntime(storage, { company: "team-pending" }, () => clock), repo = createMockCompanyRepository(runtime);
    await repo.listTeamChangeRequests(access, { scope: "mine" }); clock += 400 * 24 * 3_600_000;
    expect((await repo.getTeamChangeRequest(access, 5101)).status).toBe("PENDING");
    const stateKey = runtime.store.key("1", "company-team-management"), state = JSON.parse(storage.getItem(stateKey)!);
    const issuer = state.companies[7001].members.find((m: { value: { membershipId: number } }) => m.value.membershipId === 9104);
    issuer.status = "LEFT"; issuer.endedAt = new Date(clock).toISOString(); issuer.updatedAt = issuer.endedAt;
    storage.setItem(stateKey, JSON.stringify(state));
    await repo.removeCompanyTeamMember(access, 9102, 1);
    expect((await repo.decideTeamChangeRequest(access, 5101, { requestKey: key, expectedRequestVersion: 1, decision: "ACCEPT" })).status).toBe("APPLIED");
  });
  it("요청 뒤 제안 직급 정의 변경은 무효이며 자동 적용되지 않는다", async () => {
    const storage = memoryStorage(), runtime = mockRuntime(storage, { company: "team-pending" }), repo = createMockCompanyRepository(runtime);
    await repo.listTeamChangeRequests(access, { scope: "mine" });
    const stateKey = runtime.store.key("1", "company-team-management"), state = JSON.parse(storage.getItem(stateKey)!);
    const proposed = state.companies[7001].positions.find((p: { id: number }) => p.id === 3); proposed.version = 2; proposed.name = "변경된 직급";
    storage.setItem(stateKey, JSON.stringify(state));
    expect(await repo.getTeamChangeRequest(access, 5101)).toMatchObject({ status: "INVALIDATED", invalidationReason: "PROPOSED_POSITION_CHANGED" });
    await expect(repo.decideTeamChangeRequest(access, 5101, { requestKey: key, expectedRequestVersion: 1, decision: "ACCEPT" })).rejects.toMatchObject({ code: "CMC006" });
    expect((await repo.getCompanyTeamMember(access, 7001, 9101)).positionId).toBe(1);
  });
  it("target version 변경 뒤 요청은 무효이며 명령과 replay도409다", async () => {
    const repo = mock("team-pending"); await repo.listTeamChangeRequests(access, { scope: "mine" });
    await repo.demoteMyTeamMembership(access, 9101, { expectedVersion: 1, permissionCodes: admin(), positionId: 2 });
    expect((await repo.getTeamChangeRequest(access, 5101)).status).toBe("INVALIDATED");
    await expect(repo.decideTeamChangeRequest(access, 5101, { requestKey: key, expectedRequestVersion: 1, decision: "ACCEPT" })).rejects.toMatchObject({ code: "CMC006" });
    await expect(repo.decideTeamChangeRequest(access, 5101, { requestKey: key, expectedRequestVersion: 1, decision: "ACCEPT" })).rejects.toMatchObject({ code: "CMC006" });
  });
  it("유일 ADMIN의 축소/탈퇴는 막고 ADMIN 유지 대표자 해제는 허용한다", async () => {
    const repo = mock("team-last-admin");
    await expect(repo.demoteMyTeamMembership(access, 9101, { expectedVersion: 1, permissionCodes: viewerPermissions, positionId: 2 })).rejects.toMatchObject({ code: "CM006" });
    await expect(repo.leaveMyTeamMembership(access, 9101, 1)).rejects.toMatchObject({ code: "CM006" });
    expect((await repo.demoteMyTeamMembership(access, 9101, { expectedVersion: 1, permissionCodes: admin(), positionId: 2 })).role).toBe("ADMIN");
  });
  it("본인 대표자 취임/권한 부분집합과 일반 본인 직급 편집 금지를 유지한다", async () => {
    const repo = mock("team-no-representative"); expect((await repo.changeTeamMemberPosition(access, 9101, { expectedVersion: 1, positionId: 1 })).positionType).toBe("REPRESENTATIVE");
    const agent = mock("team-agent");
    await expect(agent.demoteMyTeamMembership(access, 9101, { expectedVersion: 1, permissionCodes: admin(), positionId: null })).rejects.toMatchObject({ status: 403 });
    await expect(agent.changeTeamMemberPosition(access, 9101, { expectedVersion: 1, positionId: 3 })).rejects.toMatchObject({ status: 403 });
    await expect(agent.demoteMyTeamMembership(access, 9101, { expectedVersion: 1, permissionCodes: viewerPermissions, positionId: 3 })).rejects.toMatchObject({ status: 403 });
    expect((await agent.demoteMyTeamMembership(access, 9101, { expectedVersion: 1, permissionCodes: viewerPermissions, positionId: null })).role).toBe("VIEWER");
  });
  it("소속 종료는 회사/팀원 목록에 반영하고 계정·다른 영역을 삭제하지 않는다", async () => {
    const repo = mock(); await repo.removeCompanyTeamMember(access, 9102, 1);
    expect((await repo.listCompanyTeamMembers(access, 7001)).totalElements).toBe(22);
    await expect(repo.getCompanyTeamMember(access, 7001, 9102)).rejects.toMatchObject({ status: 404 });
    await repo.leaveMyTeamMembership(access, 9101, 1);
    expect(await repo.getCompanyTeamContext(access)).toEqual({ companyId: null }); expect((await repo.getMyCompanyOverview(access)).status).toBe("empty");
    expect((await repo.getMyCompanyOverview({ ...access, getAccountKey: () => "2" })).status).toBe("connected");
  });
  it.each(["team-viewer", "team-read-only", "team-denied"])("조회 후에도 서버 상당 권한 검사를 다시 한다: %s", async scenario => {
    await expect(mock(scenario).changeTeamMemberPosition(access, 9102, { expectedVersion: 1, positionId: 3 })).rejects.toMatchObject({ status: 403 });
  });
});

import { describe, expect, it, vi } from "vitest";
import { normalizeTeamPositionName, type TeamPosition } from "@/data/company/contracts";
import { createHttpCompanyRepository } from "@/data/company/http-repository";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { createHttpClient } from "@/data/shared/http";
import { applyTeamPositionChange, loadTeamPositions } from "@/features/company/team-positions";
import { invitationInput } from "./company-team-invitation-fixtures";
import { reviewApproval } from "./company-team-membership-request-fixtures";
import { access, authentication, mockRuntime, ok } from "./helpers";

const companyId = 7001;
const signal = () => new AbortController().signal;
const timestamp = "2030-06-01T02:00:00Z";
const definition: TeamPosition = { id: 3, version: 1, name: "담당자", type: "CUSTOM" };
const wire = { ...definition, system: false, createdAt: timestamp, updatedAt: timestamp };
const serverName = "\ufeff";
const deletion = { positionId: definition.id, version: 2, deletedAt: timestamp };
const http = (fetcher: typeof fetch) => createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));

function mock(scenario = "connected") {
  return createMockCompanyRepository(mockRuntime(undefined, { company: scenario }));
}

describe("회사 직급 HTTP 계약", () => {
  it("서버와 동일하게 공백을 제거하고 1~30자 경계를 적용한다", () => {
    expect(normalizeTeamPositionName("\u001c\u00a0가\u3000")).toBe("가");
    expect(normalizeTeamPositionName(` ${"가".repeat(30)} `)).toBe("가".repeat(30));
    expect(normalizeTeamPositionName(` \u3000${serverName}\u00a0 `)).toBe(serverName);
  });

  it("서버가 수락하는 U+FEFF 직급을 생성 뒤 조회에서도 원문 그대로 받는다", async () => {
    const returned = { ...wire, name: serverName };
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok(returned, 201)).mockResolvedValueOnce(ok([returned]));
    const repo = http(fetcher);
    expect(await repo.createCompanyTeamPosition(access, companyId, ` ${serverName} `)).toMatchObject({ name: serverName });
    expect(JSON.parse(String(fetcher.mock.calls[0][1]?.body))).toEqual({ name: serverName });
    expect(await repo.getCompanyTeamPositions(access, companyId)).toEqual([{ ...definition, name: serverName }]);
  });

  it.each(["", " ", "대표자", "가".repeat(31), "사\t원", "사\u0085원"])("잘못된 사용자 지정 이름을 전송 전에 거부한다 %#", async name => {
    const fetcher = vi.fn<typeof fetch>();
    await expect(http(fetcher).createCompanyTeamPosition(access, companyId, name)).rejects.toMatchObject({ status: 400 });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("기존 GET과 생성·이름 변경·삭제의 정확한 path, body, version, 응답 필드를 유지한다", async () => {
    const fetcher = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(ok([wire]))
      .mockResolvedValueOnce(ok({ ...wire, extra: "unused" }, 201))
      .mockResolvedValueOnce(ok({ ...wire, name: "가상 매니저", version: 2 }))
      .mockResolvedValueOnce(ok({ ...deletion, version: 3, extra: "unused" }));
    const api = http(fetcher), abort = signal();
    expect(await api.getCompanyTeamPositions(access, companyId, abort)).toEqual([definition]);
    expect(await api.createCompanyTeamPosition(access, companyId, " 담당자 ", abort)).toEqual(definition);
    expect(await api.renameCompanyTeamPosition(access, companyId, 3, " 가상 매니저 ", 1, abort)).toEqual({ ...definition, name: "가상 매니저", version: 2 });
    expect(await api.deleteCompanyTeamPosition(access, companyId, 3, 2, abort)).toEqual({ ...deletion, version: 3 });
    const base = `/api/v1/companies/${companyId}/positions`;
    expect(fetcher.mock.calls.map(([url, init]) => [String(url).replace("https://synthetic-api.test", ""), init?.method, init?.body && JSON.parse(String(init.body))])).toEqual([
      [base, "GET", undefined], [base, "POST", { name: "담당자" }], [`${base}/3`, "PATCH", { name: "가상 매니저", expectedVersion: 1 }],
      [`${base}/3?expectedVersion=2`, "DELETE", undefined],
    ]);
    expect(fetcher.mock.calls.every(([, init]) => init?.signal === abort && init.cache === "no-store" && !new Headers(init.headers).has("Idempotency-Key"))).toBe(true);
  });

  it.each([{ id: 0 }, { version: 2 }, { name: "다른 이름" }, { system: true }, { type: ["CUSTOM"] }, { createdAt: null }, { updatedAt: "2030-02-30T02:00:00Z" }])("손상된 생성 receipt는 성공이 아니다 %#", async patch => {
    const api = http(vi.fn<typeof fetch>().mockResolvedValue(ok({ ...wire, ...patch }, 201)));
    await expect(api.createCompanyTeamPosition(access, companyId, "담당자")).rejects.toMatchObject({ status: 0 });
  });

  it.each([{ positionId: 2 }, { version: 1 }, { version: 3 }, { deletedAt: "invalid" }])("삭제 receipt의 대상·버전·시각이 맞아야 한다 %#", async patch => {
    const api = http(vi.fn<typeof fetch>().mockResolvedValue(ok({ ...deletion, ...patch })));
    await expect(api.deleteCompanyTeamPosition(access, companyId, 3, 1)).rejects.toMatchObject({ status: 0 });
  });

  it("같은 이름의 직접 rename 응답은 현재 버전을 반환할 수 있다", async () => {
    const api = http(vi.fn<typeof fetch>().mockResolvedValue(ok(wire)));
    expect(await api.renameCompanyTeamPosition(access, companyId, 3, definition.name, 1)).toEqual(definition);
  });

  it("전송이 끊겨도 저장 요청을 애플리케이션에서 재전송하지 않는다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockRejectedValue(new TypeError("synthetic connection failure"));
    await expect(http(fetcher).createCompanyTeamPosition(access, companyId, "가상 직급")).rejects.toMatchObject({ status: 0, code: "NETWORK_ERROR" });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it.each([0, -1, NaN, Number.MAX_SAFE_INTEGER + 1])("유효하지 않은 version은 URL과 body에 넣지 않는다 %#", async version => {
    const fetcher = vi.fn<typeof fetch>(), api = http(fetcher);
    await expect(api.renameCompanyTeamPosition(access, companyId, 3, "이름", version)).rejects.toMatchObject({ status: 400 });
    await expect(api.deleteCompanyTeamPosition(access, companyId, 3, version)).rejects.toMatchObject({ status: 400 });
    expect(fetcher).not.toHaveBeenCalled();
  });
});

describe("공유 직급 mock과 참조", () => {
  it("U+FEFF 직급을 사용하는 팀원과 초대·승인 기록을 읽어도 기존 저장 상태를 유지한다", async () => {
    const repo = mock();
    const unrelated = await repo.createCompanyTeamPosition(access, companyId, "유지할 가상 직급");
    const invitation = await repo.createTeamInvitation(access, companyId, { ...invitationInput(), positionId: 2 });
    const updated = await repo.renameCompanyTeamPosition(access, companyId, 2, ` ${serverName} `, 1);
    const approval = await repo.approveTeamMembershipRequest(access, companyId, 8401, reviewApproval());
    expect(approval.appliedPositionName).toBe(serverName);
    expect(await repo.getCompanyTeamPositions(access, companyId)).toEqual(expect.arrayContaining([unrelated, updated]));
    expect((await repo.getCompanyTeamMember(access, companyId, approval.appliedMembershipId!)).positionName).toBe(serverName);
    expect((await repo.getTeamInvitation(access, companyId, invitation.invitationId)).position).toEqual({ positionId: 2, name: serverName });
  });

  it("같은 ID를 참조하는 전체 팀원의 이름과 초대에 반영하고 소속 버전을 유지한다", async () => {
    const repo = mock();
    const invite = await repo.createTeamInvitation(access, companyId, { ...invitationInput(), positionId: 2 });
    const before = await repo.listCompanyTeamMembers(access, companyId, 0, 100);
    const renamed = await repo.renameCompanyTeamPosition(access, companyId, 2, "가상 담당", 1);
    const after = await repo.listCompanyTeamMembers(access, companyId, 0, 100);
    expect(renamed).toEqual({ id: 2, version: 2, name: "가상 담당", type: "CUSTOM" });
    expect(after.content).toEqual(before.content.map(m => m.positionId === 2 ? { ...m, positionName: "가상 담당" } : m));
    const teamMember = after.content.find(m => m.positionId === 2)!;
    expect((await repo.getCompanyTeamMember(access, companyId, teamMember.membershipId)).positionName).toBe("가상 담당");
    const { position, version } = await repo.getTeamInvitation(access, companyId, invite.invitationId);
    expect(position).toEqual({ positionId: 2, name: "가상 담당" });
    expect(version).toBe(invite.version);
  });

  it("활성 사용·대표자·중복·오래된 버전·미존재/회사 경계를 적용한다", async () => {
    const repo = mock();
    await expect(repo.deleteCompanyTeamPosition(access, companyId, 2, 1)).rejects.toMatchObject({ code: "CP004" });
    await expect(repo.deleteCompanyTeamPosition(access, companyId, 1, 1)).rejects.toMatchObject({ code: "CP003" });
    await expect(repo.renameCompanyTeamPosition(access, companyId, 1, "대표 이름", 1)).rejects.toMatchObject({ code: "CP003" });
    await expect(repo.createCompanyTeamPosition(access, companyId, " 사원 ")).rejects.toMatchObject({ code: "CP002" });
    await expect(repo.renameCompanyTeamPosition(access, companyId, 3, "사원", 1)).rejects.toMatchObject({ code: "CP002" });
    await expect(repo.renameCompanyTeamPosition(access, companyId, 3, "가상 직급", 2)).rejects.toMatchObject({ code: "CP005" });
    await expect(repo.deleteCompanyTeamPosition(access, companyId, 999, 1)).rejects.toMatchObject({ code: "CP001" });
    await expect(repo.deleteCompanyTeamPosition(access, 7002, 3, 1)).rejects.toMatchObject({ status: 403 });
  });

  it("활성 구성원 없이 초대만 참조한 직급의 삭제 뒤 과거 이름과 ID를 보존한다", async () => {
    const repo = mock();
    const first = await repo.createCompanyTeamPosition(access, companyId, "가상 직급");
    const invite = await repo.createTeamInvitation(access, companyId, { ...invitationInput(), positionId: first.id });
    expect(await repo.deleteCompanyTeamPosition(access, companyId, first.id, first.version)).toMatchObject({ positionId: first.id, version: 2 });
    expect(await repo.getCompanyTeamPositions(access, companyId)).not.toContainEqual(first);
    const replacement = await repo.createCompanyTeamPosition(access, companyId, first.name);
    expect(replacement.id).not.toBe(first.id);
    expect((await repo.getTeamInvitation(access, companyId, invite.invitationId)).position).toEqual({ positionId: first.id, name: first.name });
    expect((await repo.listTeamInvitations(access, companyId)).content[0].position?.positionId).toBe(first.id);
  });

  it("합류 승인에서 제안 이름을 사용할 때도 삭제한 ID를 재사용하지 않는다", async () => {
    const repo = mock(), name = "가상 제안 직급";
    const position = await repo.createCompanyTeamPosition(access, companyId, name);
    await repo.deleteCompanyTeamPosition(access, companyId, position.id, position.version);
    const approved = await repo.approveTeamMembershipRequest(access, companyId, 8404, { ...reviewApproval(), positionId: null, positionName: name });
    expect(approved.appliedPositionName).toBe(name);
    expect(approved.appliedPositionId).not.toBe(position.id);
  });

  it("동시 생성과 이름 변경에 각각 한 번의 성공만 허용한다", async () => {
    const repo = mock();
    const competingCreates = await Promise.allSettled([
      repo.createCompanyTeamPosition(access, companyId, "가상 직급"),
      repo.createCompanyTeamPosition(access, companyId, "가상 직급"),
    ]);
    expect(competingCreates.map(r => r.status)).toEqual(["fulfilled", "rejected"]);
    expect(competingCreates[1]).toMatchObject({ reason: { code: "CP002" } });
    const competingRenames = await Promise.allSettled([
      repo.renameCompanyTeamPosition(access, companyId, 3, "가상 매니저", 1),
      repo.renameCompanyTeamPosition(access, companyId, 3, "가상 담당", 1),
    ]);
    expect(competingRenames.map(r => r.status)).toEqual(["fulfilled", "rejected"]);
    expect(competingRenames[1]).toMatchObject({ reason: { code: "CP005" } });
  });

  it.each(["team-viewer", "team-read-only"] as const)("조회 가능한 제한 사용자에게 변경을 부여하지 않는다 %s", async scenario => {
    const repo = mock(scenario);
    expect(await loadTeamPositions(access, signal(), repo)).toMatchObject({ canManage: false });
    await expect(repo.createCompanyTeamPosition(access, companyId, "가상 직급")).rejects.toMatchObject({ status: 403 });
  });

  it("다른 계정에 임의로 생성한 직급을 전달하지 않는다", async () => {
    const repo = mock(), other = { ...access, getAccountKey: () => "2" };
    const created = await repo.createCompanyTeamPosition(access, companyId, "가상 직급");
    expect(await repo.getCompanyTeamPositions(other, companyId)).not.toContainEqual(created);
  });
});

describe("직급 화면의 수명과 현재 권한", () => {
  it("열어 둔 행의 버전과 현재 권한을 확인하고 변경 요청은 전송하지 않는다", async () => {
    const repo = mock(), snapshot = (await loadTeamPositions(access, signal(), repo))!;
    await repo.renameCompanyTeamPosition(access, companyId, definition.id, "다른 관리자 변경", definition.version);
    const write = vi.spyOn(repo, "deleteCompanyTeamPosition");
    await expect(applyTeamPositionChange(access, snapshot, { kind: "delete", position: definition }, signal(), repo)).rejects.toMatchObject({ code: "CP005" });
    await expect(applyTeamPositionChange(access, snapshot, { kind: "delete", position: definition }, signal(), { ...repo, listCompanyTeamMembers: async (...args) => {
      const page = await repo.listCompanyTeamMembers(...args);
      return { ...page, capabilities: { ...page.capabilities, canManagePositions: false } };
    } })).rejects.toMatchObject({ status: 403 });
    expect(write).not.toHaveBeenCalled();
  });

  it("현재 company가 바뀌는 중에 이전 회사 목록을 전달하지 않는다", async () => {
    const repo = mock();
    const getCompanyTeamContext = vi.fn().mockResolvedValueOnce({ companyId }).mockResolvedValueOnce({ companyId: 7002 });
    const getCurrentCompanyPermissions = vi.fn().mockResolvedValue({ companyId, membershipId: 9101, permissionCodes: ["COMPANY_MEMBER_LIST_VIEW"] });
    await expect(loadTeamPositions(access, signal(), { ...repo, getCompanyTeamContext, getCurrentCompanyPermissions })).rejects.toMatchObject({ code: "POSITION_CONTEXT_CHANGED" });
  });

  it("동일 이름 변경은 PATCH를 보내지 않는다", async () => {
    const repo = mock(), snapshot = (await loadTeamPositions(access, signal(), repo))!;
    const rename = vi.spyOn(repo, "renameCompanyTeamPosition");
    expect(await applyTeamPositionChange(access, snapshot, { kind: "rename", position: definition, name: " 담당자 " }, signal(), repo)).toBe("unchanged");
    expect(rename).not.toHaveBeenCalled();
  });

  it("401 재인증 중 화면이 닫히면 다시 쓰지 않는다", async () => {
    const repo = mock(), snapshot = (await loadTeamPositions(access, signal(), repo))!;
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok(null, 401));
    let current = true;
    const scoped = { ...access, refresh: async () => { current = false; return authentication(); } };
    const repository = { ...repo, createCompanyTeamPosition: http(fetcher).createCompanyTeamPosition };
    await expect(applyTeamPositionChange(scoped, snapshot, { kind: "create", name: "가상 직급" }, signal(), repository, () => current)).rejects.toMatchObject({ name: "AbortError" });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("쓰기 성공 응답이 늦게 돌아와도 계정 또는 화면이 바뀌면 이전 결과를 전달하지 않는다", async () => {
    const repo = mock(), snapshot = (await loadTeamPositions(access, signal(), repo))!;
    let key = "1";
    const changing = { ...access, getAccountKey: () => key };
    const createCompanyTeamPosition = vi.fn(async () => { key = "2"; return { ...definition, id: 7 }; });
    await expect(applyTeamPositionChange(changing, snapshot, { kind: "create", name: "가상 직급" }, signal(), { ...repo, createCompanyTeamPosition })).rejects.toMatchObject({ name: "AbortError" });
    expect(createCompanyTeamPosition).toHaveBeenCalledTimes(1);
  });
});

import { describe, expect, it, vi } from "vitest";
import { createHttpCompanyRepository } from "@/data/company/http-repository";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { teamCatalogFixture } from "@/data/company/team-mock";
import { ApiError } from "@/data/shared/errors";
import { createHttpClient } from "@/data/shared/http";
import { createCompanyFlowScope } from "@/features/company/flow-scope";
import { isInvitationAcceptanceUnconfirmed, loadInvitationDestination } from "@/features/company/invitation-completion";
import { access, authentication, mockRuntime, ok } from "./helpers";

const receipt = { companyId: 7001, membershipId: 9101 };
const teamView = "COMPANY_MEMBER_LIST_VIEW";
const companyView = "COMPANY_INFORMATION_VIEW";
const checkSignal = () => new AbortController().signal;
const active = () => true;

function teamQueries(permissionCodes: string[]) {
  return {
    getCompanyTeamContext: vi.fn().mockResolvedValue({ companyId: receipt.companyId }),
    getCurrentCompanyPermissions: vi.fn().mockResolvedValue({ ...receipt, permissionCodes }),
  };
}

describe("초대 완료 이동 권한", () => {
  it.each(teamCatalogFixture().presets)("현재 $role 프리셋 권한으로 팀원 목록을 확인한다", async ({ permissionCodes }) => {
    const repository = teamQueries(permissionCodes);
    await expect(loadInvitationDestination(access, receipt, checkSignal(), active, repository)).resolves.toBe("/my/team");
    expect(repository.getCurrentCompanyPermissions).toHaveBeenCalledWith(access, receipt.companyId, expect.any(AbortSignal));
  });

  it("추가 leaf가 있어도 실제 조회 leaf로 결정하고, 경로 미제공 시 회사 leaf를 따로 확인한다", async () => {
    const repository = teamQueries([companyView, teamView, "COMPANY_MEMBER_INVITE"]);
    await expect(loadInvitationDestination(access, receipt, checkSignal(), active, repository)).resolves.toBe("/my/team");
    await expect(loadInvitationDestination(access, receipt, checkSignal(), active, repository, null)).resolves.toBe("/my/company");
    repository.getCurrentCompanyPermissions.mockResolvedValue({ ...receipt, permissionCodes: [teamView] });
    await expect(loadInvitationDestination(access, receipt, checkSignal(), active, repository, null)).resolves.toBeNull();
  });

  it("클릭 재조회에서 팀원 권한이 없어지거나 수락 후 소속이 달라지면 이전 목적지를 반환하지 않는다", async () => {
    const repository = teamQueries([teamView, companyView]);
    const read = () => loadInvitationDestination(access, receipt, checkSignal(), active, repository);
    expect(await read()).toBe("/my/team");
    repository.getCurrentCompanyPermissions.mockResolvedValueOnce({ ...receipt, permissionCodes: [companyView] });
    expect(await read()).toBe("/my/company");
    repository.getCurrentCompanyPermissions.mockResolvedValueOnce({ ...receipt, membershipId: 9102, permissionCodes: [teamView, companyView] });
    expect(await read()).toBeNull();
    repository.getCurrentCompanyPermissions.mockResolvedValueOnce({ ...receipt, companyId: 20, permissionCodes: [teamView, companyView] });
    expect(await read()).toBeNull();
    repository.getCurrentCompanyPermissions.mockResolvedValueOnce({ ...receipt, permissionCodes: ["COMPANY_MEMBER_INVITE"] });
    expect(await read()).toBeNull();
    repository.getCompanyTeamContext.mockResolvedValueOnce({ companyId: null }).mockResolvedValueOnce({ companyId: 7002 });
    expect(await read()).toBeNull();
    expect(await read()).toBeNull();
    expect(repository.getCurrentCompanyPermissions).toHaveBeenCalledTimes(5);
  });

  it.each([401, 403, 404, 503])("권한 조회 %i에서 보호 목적지를 추정하지 않는다", async status => {
    const repository = teamQueries([teamView, companyView]);
    repository.getCurrentCompanyPermissions.mockRejectedValueOnce(new ApiError(status, null, "합성 조회 오류"));
    await expect(loadInvitationDestination(access, receipt, checkSignal(), active, repository)).rejects.toMatchObject({ status });
  });

  it("만료 후 같은 계정이 복원되면 읽을 수 있고 다른 계정이 복원되면 읽기 전에 중단한다", async () => {
    const repository = teamQueries([teamView]);
    let account: string | null = "1";
    let nextAccount = "1";
    const port = { ...access, getAccountKey: () => account, refresh: async () => { account = nextAccount; return authentication(Number(account)); } };
    const request = createCompanyFlowScope({ ...port, getSessionEpoch: () => 1 }).capture();
    const read = () => loadInvitationDestination(port, receipt, checkSignal(), () => request.current(true), repository);
    account = null;
    expect(await read()).toBe("/my/team");
    account = null;
    nextAccount = "2";
    await expect(read()).rejects.toMatchObject({ name: "AbortError" });
    expect(repository.getCompanyTeamContext).toHaveBeenCalledTimes(1);
  });

  it.each(["account", "epoch", "leave", "abort"])("늦은 권한 응답을 폐기한다: %s", async change => {
    let account = "1";
    let epoch = 1;
    const port = { ...access, getAccountKey: () => account };
    const scope = createCompanyFlowScope({ ...port, getSessionEpoch: () => epoch });
    const request = scope.capture();
    const controller = new AbortController();
    const repository = teamQueries([teamView]);
    repository.getCurrentCompanyPermissions.mockImplementation(async () => {
      if (change === "account") account = "2";
      if (change === "epoch") epoch++;
      if (change === "leave") scope.dispose();
      if (change === "abort") controller.abort();
      return { ...receipt, permissionCodes: [teamView] };
    });
    await expect(loadInvitationDestination(port, receipt, controller.signal, () => request.current(true), repository)).rejects.toMatchObject({ name: "AbortError" });
  });
});

describe("수락 응답과 재확인 경계", () => {
  it("확정된 수락 뒤 세션 갱신 실패를 보존하고 이후 확인은 회사 문맥과 GET만 사용한다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok({ ...receipt, extra: "synthetic" }))
      .mockResolvedValueOnce(ok({ ...receipt, permissionCodes: [teamView] }))
      .mockResolvedValueOnce(ok({ ...receipt, permissionCodes: [companyView] }));
    const repository = createHttpCompanyRepository(createHttpClient("https://synthetic.test", fetcher));
    const refresh = vi.fn().mockRejectedValueOnce(new ApiError(503, null, "합성 세션 오류"))
      .mockResolvedValue({ ...authentication(), companyContext: { companyId: receipt.companyId, role: "VIEWER" } });
    const port = { ...access, refresh };
    const accepted = await repository.acceptInvitation(port, 7);
    expect(accepted).toEqual({ ...receipt, sessionWarning: expect.any(String) });
    await expect(loadInvitationDestination(port, accepted, checkSignal(), active, repository)).resolves.toBe("/my/team");
    await expect(loadInvitationDestination(port, accepted, checkSignal(), active, repository)).resolves.toBe("/my/company");
    expect(fetcher.mock.calls.map(([url, request]) => [new URL(String(url)).pathname, request?.method])).toEqual([
      ["/api/v1/company-membership-invitations/acceptance", "POST"],
      ["/api/v1/companies/7001/memberships/me", "GET"],
      ["/api/v1/companies/7001/memberships/me", "GET"],
    ]);
    expect(JSON.parse(String(fetcher.mock.calls[0][1]?.body))).toEqual({ expectedVersion: 7 });
  });

  it.each([{}, { ...receipt, companyId: "7001" }, { ...receipt, membershipId: 0 }, { ...receipt, membershipId: Number.MAX_SAFE_INTEGER + 1 }])(
    "손상된 2xx 응답을 성공으로 표시하거나 새 수락을 보내지 않는다", async response => {
      const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok(response));
      const repository = createHttpCompanyRepository(createHttpClient("https://synthetic.test", fetcher));
      const port = { ...access, refresh: vi.fn() };
      await expect(repository.acceptInvitation(port, 1)).rejects.toMatchObject({ code: "INVITATION_ACCEPTANCE_UNCONFIRMED" });
      expect(port.refresh).not.toHaveBeenCalled();
      expect(fetcher).toHaveBeenCalledTimes(1);
    },
  );

  it.each([0, 200, 201, 408, 503])("응답 결과가 불명확한 상태 %i를 구분한다", status => {
    expect(isInvitationAcceptanceUnconfirmed(new ApiError(status, null, "합성 오류"))).toBe(true);
  });

  it.each([401, 403, 404, 409, 410])("확인된 거부 상태 %i는 원래 오류를 처리한다", status => {
    expect(isInvitationAcceptanceUnconfirmed(new ApiError(status, null, "합성 오류"))).toBe(false);
  });

  it.each([{ status: 401, code: "CI012" }, { status: 400, code: "CI005" }])(
    "이미 소모됐을 수 있는 초대 문맥($code)은 결과 미확정으로 전달하며 자동 재수락하지 않는다", async ({ status, code }) => {
      const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ isSuccess: false, code }), { status }));
      const repository = createHttpCompanyRepository(createHttpClient("https://synthetic.test", fetcher));
      const port = { ...access, refresh: vi.fn(async () => authentication()) };
      const request = repository.acceptInvitation(port, 1);
      await expect(request).rejects.toMatchObject({ status, code });
      expect(await request.catch(isInvitationAcceptanceUnconfirmed)).toBe(true);
      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(port.refresh).not.toHaveBeenCalled();
    },
  );

  it.each(["acceptInvitation", "declineInvitation"] as const)("mock에서 명령 직전 화면을 벗어나면 초대와 회사 상태를 그대로 둔다: %s", async command => {
    const repository = createMockCompanyRepository(mockRuntime());
    await repository.previewInvitation("mock-invite");
    const context = await repository.resumeInvitation(access);
    const port = { ...access, assertRequestScope: () => { throw new DOMException("aborted", "AbortError"); } };
    await expect(repository[command](port, context.version)).rejects.toMatchObject({ name: "AbortError" });
    await expect(repository.resumeInvitation(access)).resolves.toMatchObject({ canAccept: true, version: context.version });
    await expect(repository.getCompanyTeamContext(access)).resolves.toMatchObject({ companyId: null });
    const accepted = await repository.acceptInvitation(access, context.version);
    await expect(loadInvitationDestination(access, accepted, checkSignal(), active, repository)).resolves.toBe("/my/team");
    await expect(repository.resumeInvitation(access)).rejects.toMatchObject({ status: 404 });
  });
});

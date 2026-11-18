import { describe, expect, it, vi } from "vitest";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { createHttpCompanyRepository } from "@/data/company/http-repository";
import { createHttpClient, type AuthAccess } from "@/data/shared/http";
import { ApiError } from "@/data/shared/errors";
import { createMembershipReviewScope, loadTeamMembershipRequests, planMembershipApproval, defaultMembershipApproval, type TeamMembershipSnapshot } from "@/features/company/team-membership-requests";
import { access, authentication, mockRuntime, ok } from "./helpers";
import { approvedReview, membershipReview, membershipReviewPage, rejectedReview, reviewAdmin, reviewApproval, reviewCatalog, reviewViewer } from "./company-team-membership-request-fixtures";

type Repository = NonNullable<Parameters<typeof loadTeamMembershipRequests>[3]>;
const current = () => ({ companyId: 7001, membershipId: 9101, permissionCodes: [...reviewAdmin] });
const positions = () => [{ id: 2, name: "사원", type: "CUSTOM" as const, version: 1 }, { id: 3, name: "담당자", type: "CUSTOM" as const, version: 1 }];
const snapshot = (): TeamMembershipSnapshot => ({ companyId: 7001, catalog: structuredClone(reviewCatalog), current: current(), page: membershipReviewPage(), positions: positions(), detail: membershipReview() });
function repository(overrides: Partial<Repository> = {}): Repository {
  return { ...createMockCompanyRepository(mockRuntime()), getCompanyTeamContext: vi.fn(async () => ({ companyId: 7001 })), getCompanyPermissionCatalog: vi.fn(async () => structuredClone(reviewCatalog)),
    getCurrentCompanyPermissions: vi.fn(async () => current()), getCompanyTeamPositions: vi.fn(async () => positions()), listTeamMembershipRequests: vi.fn(async () => membershipReviewPage()),
    getTeamMembershipRequest: vi.fn(async () => membershipReview()), approveTeamMembershipRequest: vi.fn(async () => approvedReview()), rejectTeamMembershipRequest: vi.fn(async () => rejectedReview()), ...overrides };
}
const signal = () => new AbortController().signal;
describe("신청 검토의 회사/권한 수명과 최종 결정", () => {
  it("LIST_VIEW만 있으면 민감 신청 목록/상세 요청을 보내지 않는다", async () => {
    const repo = repository({ getCurrentCompanyPermissions: async () => ({ ...current(), permissionCodes: [...reviewViewer] }) });
    await expect(loadTeamMembershipRequests(access, 0, signal(), repo, () => true, 8401)).rejects.toMatchObject({ status: 403 });
    expect(repo.listTeamMembershipRequests).not.toHaveBeenCalled(); expect(repo.getTeamMembershipRequest).not.toHaveBeenCalled();
  });
  it("빈 회사·정상 page/상세와 전후 권한을 구별한다", async () => {
    expect(await loadTeamMembershipRequests(access, 0, signal(), repository({ getCompanyTeamContext: async () => ({ companyId: null }) }))).toBeNull();
    const repo = repository(), value = await loadTeamMembershipRequests(access, 0, signal(), repo, () => true, 8401);
    expect(value?.detail?.requestId).toBe(8401); expect(repo.getCurrentCompanyPermissions).toHaveBeenCalledTimes(2);
  });
  it.each(["company", "membership", "leaf"])("조회 후 %s 교체는 보호 자료를 반환하지 않는다", async kind => {
    const read = vi.fn().mockResolvedValueOnce(current()).mockResolvedValue({ ...current(), ...(kind === "membership" ? { membershipId: 9901 } : { permissionCodes: [...reviewViewer] }) });
    const context = vi.fn().mockResolvedValueOnce({ companyId: 7001 }).mockResolvedValue({ companyId: 7002 });
    await expect(loadTeamMembershipRequests(access, 0, signal(), repository(kind === "company" ? { getCompanyTeamContext: context } : { getCurrentCompanyPermissions: read }))).rejects.toBeInstanceOf(ApiError);
  });
  it.each(["account", "epoch", "abort"])("늦은 조회는 %s 변경 뒤 폐기한다", async kind => {
    let account = "1", live = true; const controller = new AbortController();
    const repo = repository({ listTeamMembershipRequests: async () => { if (kind === "account") account = "2"; if (kind === "epoch") live = false; if (kind === "abort") controller.abort(); return membershipReviewPage(); } });
    await expect(loadTeamMembershipRequests({ ...access, getAccountKey: () => account }, 0, controller.signal, repo, () => live)).rejects.toMatchObject({ name: "AbortError" });
  });
  it("VIEWER+REVIEW의 불변 원직급/원제안 승인과 행동별 grant를 구별한다", () => {
    const s = snapshot(); s.current.permissionCodes = [...reviewViewer, "COMPANY_MEMBERSHIP_REQUEST_REVIEW"];
    s.detail!.capabilities = { canReview: true, canEditPosition: false, canManagePermissions: false, canApproveRepresentative: false };
    expect(planMembershipApproval(s, s.detail!, reviewApproval()).permissions).toEqual(reviewViewer);
    expect(() => planMembershipApproval(s, s.detail!, { ...reviewApproval(), positionId: 3 })).toThrow();
    expect(() => planMembershipApproval(s, s.detail!, { ...reviewApproval(), extraPermissionCodes: ["COMPANY_MEMBERSHIP_REQUEST_REVIEW"] })).toThrow();
    s.detail = { ...s.detail!, requestedPositionId: null, requestedPositionName: null, proposedPositionName: "가상 직급" };
    expect(planMembershipApproval(s, s.detail, defaultMembershipApproval(s.detail)).body.positionName).toBe("가상 직급");
    s.current.permissionCodes.push("COMPANY_MEMBER_PERMISSION_MANAGE"); s.detail.capabilities.canManagePermissions = true;
    expect(planMembershipApproval(s, s.detail, { ...defaultMembershipApproval(s.detail), extraPermissionCodes: ["COMPANY_MEMBERSHIP_REQUEST_REVIEW"] }).permissions).toContain("COMPANY_MEMBERSHIP_REQUEST_REVIEW");
    expect(() => planMembershipApproval(s, s.detail!, { ...defaultMembershipApproval(s.detail!), extraPermissionCodes: ["COMPANY_MEMBER_INVITE"] })).toThrow();
  });
  it("대표자 원신청/ADMIN·capability와 별도 일반 payload를 검증한다", () => {
    const s = snapshot(), input = { ...reviewApproval(), representative: true, positionId: null, preset: null };
    expect(() => planMembershipApproval(s, s.detail!, input)).toThrow();
    s.detail = { ...s.detail!, requestedRepresentative: true, requestedPositionId: null, requestedPositionName: null };
    expect(planMembershipApproval(s, s.detail, input).permissions).toEqual(reviewAdmin);
    s.detail.capabilities.canApproveRepresentative = false; expect(() => planMembershipApproval(s, s.detail!, input)).toThrow();
  });
  it.each(["version", "permission", "position", "catalog", "company", "membership"])("제출 직전 %s 변화는 POST0", async kind => {
    const repo = repository(kind === "version" ? { getTeamMembershipRequest: async () => ({ ...membershipReview(), version: 2 }) }
      : kind === "permission" ? { getCurrentCompanyPermissions: async () => ({ ...current(), permissionCodes: [...reviewViewer, "COMPANY_MEMBERSHIP_REQUEST_REVIEW"] }) }
      : kind === "position" ? { getCompanyTeamPositions: async () => [{ ...positions()[0], version: 2 }] }
      : kind === "catalog" ? { getCompanyPermissionCatalog: async () => ({ ...reviewCatalog, catalogVersion: "changed" }) }
      : kind === "company" ? { getCompanyTeamContext: async () => ({ companyId: 7002 }) }
      : { getCurrentCompanyPermissions: async () => ({ ...current(), membershipId: 9901 }) });
    await expect(createMembershipReviewScope(access, () => true, repo).submit(snapshot(), { kind: "approve", input: reviewApproval() })).rejects.toThrow();
    expect(repo.approveTeamMembershipRequest).not.toHaveBeenCalled();
  });
  it("본인 취소/타인 처리404와409/미확정 뒤 자동 결정은 없다", async () => {
    const cancel = repository({ getTeamMembershipRequest: async () => { throw new ApiError(404, "CR001", "synthetic canceled"); } });
    await expect(createMembershipReviewScope(access, () => true, cancel).submit(snapshot(), { kind: "reject", reason: "가상 거절 사유" })).rejects.toMatchObject({ status: 404 }); expect(cancel.rejectTeamMembershipRequest).not.toHaveBeenCalled();
    for (const status of [0, 200, 408, 409, 500]) {
      const submit = vi.fn(async () => { throw new ApiError(status, "SYNTHETIC", "synthetic unconfirmed"); }), repo = repository({ approveTeamMembershipRequest: submit });
      const scope = createMembershipReviewScope(access, () => true, repo);
      await expect(scope.submit(snapshot(), { kind: "approve", input: reviewApproval() })).rejects.toMatchObject({ status });
      await expect(scope.submit(snapshot(), { kind: "approve", input: reviewApproval() })).rejects.toMatchObject({ status: 409 }); expect(submit).toHaveBeenCalledTimes(1);
    }
  });
  it("다른 applied grant와 요청 식별자를 성공으로 만들지 않는다", async () => {
    for (const patch of [{ appliedPermissions: [...reviewAdmin], appliedRole: "ADMIN" as const }, { requestId: 8402 }, { requestedPositionId: 3 }]) {
      const scope = createMembershipReviewScope(access, () => true, repository({ approveTeamMembershipRequest: async () => ({ ...approvedReview(), ...patch }) }));
      await expect(scope.submit(snapshot(), { kind: "approve", input: reviewApproval() })).rejects.toThrow();
    }
  });
  it("중복 submit·dispose·늦은 성공 반영을 막는다", async () => {
    let release!: () => void; const wait = new Promise<void>(resolve => { release = resolve; });
    const submit = vi.fn(async () => { await wait; return approvedReview(); }), scope = createMembershipReviewScope(access, () => true, repository({ approveTeamMembershipRequest: submit }));
    const first = scope.submit(snapshot(), { kind: "approve", input: reviewApproval() });
    await expect(scope.submit(snapshot(), { kind: "reject", reason: "가상 거절 사유" })).rejects.toMatchObject({ status: 409 });
    scope.dispose(); release(); await expect(first).rejects.toMatchObject({ name: "AbortError" }); expect(submit.mock.calls.length).toBeLessThanOrEqual(1);
  });
  it("성공 receipt 뒤 조회 실패와 이미 사라진 상세를 분리한다", async () => {
    const repo = repository(), receipt = await createMembershipReviewScope(access, () => true, repo).submit(snapshot(), { kind: "approve", input: reviewApproval() });
    expect(receipt.status).toBe("APPROVED");
    await expect(loadTeamMembershipRequests(access, 0, signal(), repository({ listTeamMembershipRequests: async () => { throw new ApiError(503, null, "synthetic follow-up"); } }), () => true, undefined, receipt)).rejects.toThrow();
    expect(receipt.status).toBe("APPROVED"); expect(repo.approveTeamMembershipRequest).toHaveBeenCalledTimes(1);
  });
  it("승인 뒤 정상 직급 변경/내보내기가 과거 receipt나 남은 신청 목록을 차단하지 않는다", async () => {
    const repo = createMockCompanyRepository(mockRuntime(undefined, { company: "team-requests" })), receipt = await repo.approveTeamMembershipRequest(access, 7001, 8401, reviewApproval());
    expect((await loadTeamMembershipRequests(access, 0, signal(), repo, () => true, undefined, receipt))?.memberCheck).toBe("confirmed");
    await repo.changeTeamMemberPosition(access, receipt.appliedMembershipId!, { expectedVersion: 1, positionId: 3 });
    for (let attempt = 0; attempt < 2; attempt++) {
      const result = await loadTeamMembershipRequests(access, 0, signal(), repo, () => true, undefined, receipt);
      expect(result?.memberCheck).toBe("changed"); expect(result?.page.totalElements).toBe(22); expect(receipt.appliedPositionId).toBe(2);
    }
    await repo.removeCompanyTeamMember(access, receipt.appliedMembershipId!, 2);
    const after = await loadTeamMembershipRequests(access, 0, signal(), repo, () => true, undefined, receipt);
    expect(after?.memberCheck).toBe("unavailable"); expect(after?.page.totalElements).toBe(22); expect(receipt.status).toBe("APPROVED");
  });
  it.each([401, 403, 404, 503])("승인 뒤 팀원 GET%s의 인증/권한과 부분 조회 실패를 구별한다", async status => {
    const repo = repository({ listTeamMembershipRequests: async () => membershipReviewPage([]), getCompanyTeamMember: async () => { throw new ApiError(status, "SYNTHETIC", "synthetic current member"); } });
    const result = loadTeamMembershipRequests(access, 0, signal(), repo, () => true, undefined, approvedReview());
    if ([401, 403].includes(status)) await expect(result).rejects.toMatchObject({ status });
    else expect((await result)?.memberCheck).toBe("unavailable");
  });
});

describe("신청 명령의 실제 fetch 직전 인증 대기 수명", () => {
  it.each(["account", "epoch", "dispose"])("최초 token 대기 중 %s 교체는 POST0", async kind => {
    let account = "1", live = true, release!: () => void; const token = new Promise<void>(resolve => { release = resolve; });
    const port: AuthAccess = { ...access, getAccountKey: () => account, getAccessToken: async () => { await token; return "synthetic-token"; } };
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok(approvedReview())), api = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
    const repo = repository({ approveTeamMembershipRequest: api.approveTeamMembershipRequest });
    const scope = createMembershipReviewScope(port, () => live, repo), result = scope.submit(snapshot(), { kind: "approve", input: reviewApproval() });
    await vi.waitFor(() => expect(repo.getTeamMembershipRequest).toHaveBeenCalled());
    if (kind === "account") account = "2"; if (kind === "epoch") live = false; if (kind === "dispose") scope.dispose(); release();
    await expect(result).rejects.toThrow(); expect(fetcher).not.toHaveBeenCalled();
  });
  it("POST401 뒤 refresh 대기 중 epoch 교체는 두 번째 fetch0", async () => {
    let live = true, refreshStarted!: () => void, release!: () => void; const started = new Promise<void>(resolve => { refreshStarted = resolve; }), wait = new Promise<void>(resolve => { release = resolve; });
    const port: AuthAccess = { ...access, refresh: async () => { refreshStarted(); await wait; return authentication(); } };
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok(null, 401)), api = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
    const result = createMembershipReviewScope(port, () => live, repository({ approveTeamMembershipRequest: api.approveTeamMembershipRequest })).submit(snapshot(), { kind: "approve", input: reviewApproval() });
    await started; live = false; release(); await expect(result).rejects.toThrow(); expect(fetcher).toHaveBeenCalledTimes(1);
  });
});

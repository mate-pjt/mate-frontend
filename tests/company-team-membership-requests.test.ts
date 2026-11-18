import { describe, expect, it, vi } from "vitest";
import { createHttpCompanyRepository } from "@/data/company/http-repository";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { mapTeamMembershipRequest, mapTeamMembershipRequestPage } from "@/data/company/team-membership-request-api";
import { membershipRejectionReason, normalizeMembershipApproval } from "@/data/company/team-membership-request-input";
import { createHttpClient } from "@/data/shared/http";
import { memoryStorage } from "@/data/mock/store";
import { access, mockRuntime, ok } from "./helpers";
import { approvedReview, membershipReview, membershipReviewPage, rejectedReview, reviewApproval, reviewViewer } from "./company-team-membership-request-fixtures";

const http = (fetcher: typeof fetch) => createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
describe("신청 검토 입력과 HTTP 경계", () => {
  it("서버와 같은 trim·사유 경계와 입력 allowlist를 적용한다", () => {
    expect(membershipRejectionReason(" \n가상 사유\t ")).toBe("가상 사유");
    expect(normalizeMembershipApproval({ ...reviewApproval(), unexpected: "omitted" } as never)).toEqual(reviewApproval());
    expect(normalizeMembershipApproval({ ...reviewApproval(), positionId: null, positionName: " 새 직급 " }).positionName).toBe("새 직급");
  });
  it.each(["", " ", "가".repeat(301), "가상\n사유", "가상\u0085사유"])("잘못된 거절 사유는 보내지 않는다 %s", async reason => {
    const fetcher = vi.fn<typeof fetch>();
    await expect(http(fetcher).rejectTeamMembershipRequest(access, 7001, 8401, 1, reason)).rejects.toMatchObject({ status: 400 }); expect(fetcher).not.toHaveBeenCalled();
  });
  it.each([{ expectedVersion: 0 }, { expectedVersion: Number.MAX_SAFE_INTEGER }, { positionId: 0 }, { positionId: null }, { positionName: "새 직급" },
    { positionId: null, positionName: "대표자" }, { positionId: null, positionName: "가".repeat(31) }, { preset: "OTHER" }, { extraPermissionCodes: ["A", "A"] },
    { extraPermissionCodes: ["unknown"] }, { representative: true }])("잘못된 승인 입력은 전송 전에 거부 %#", async patch => {
    const fetcher = vi.fn<typeof fetch>(); await expect(http(fetcher).approveTeamMembershipRequest(access, 7001, 8401, { ...reviewApproval(), ...patch } as never)).rejects.toMatchObject({ status: 400 }); expect(fetcher).not.toHaveBeenCalled();
  });
  it("조회·approval/rejection wire·version·불필요한 신원 필드 폐기를 확인한다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok(membershipReviewPage())).mockResolvedValueOnce(ok({ ...membershipReview(), accountId: 99, privateNote: "synthetic-omitted" }))
      .mockResolvedValueOnce(ok(approvedReview())).mockResolvedValueOnce(ok(rejectedReview()));
    const repo = http(fetcher), signal = new AbortController().signal;
    await repo.listTeamMembershipRequests(access, 7001, 0, 20, signal);
    expect(await repo.getTeamMembershipRequest(access, 7001, 8401, signal)).toEqual(membershipReview());
    await repo.approveTeamMembershipRequest(access, 7001, 8401, reviewApproval(), signal);
    await repo.rejectTeamMembershipRequest(access, 7001, 8401, 1, " 가상 거절 사유 ", signal);
    expect(fetcher.mock.calls.map(([url, init]) => [String(url).replace("https://synthetic-api.test", ""), init?.method])).toEqual([
      ["/api/v1/companies/7001/membership-requests?page=0&size=20", "GET"], ["/api/v1/companies/7001/membership-requests/8401", "GET"],
      ["/api/v1/companies/7001/membership-requests/8401/approval", "POST"], ["/api/v1/companies/7001/membership-requests/8401/rejection", "POST"],
    ]);
    expect(JSON.parse(String(fetcher.mock.calls[2][1]?.body))).toEqual(reviewApproval()); expect(JSON.parse(String(fetcher.mock.calls[3][1]?.body))).toEqual({ expectedVersion: 1, reason: "가상 거절 사유" });
    expect(fetcher.mock.calls.every(([, init]) => init?.signal === signal && init.credentials === "include" && init.cache === "no-store" && !new Headers(init.headers).has("Idempotency-Key"))).toBe(true);
  });
  it.each([{ companyId: 7002 }, { version: 0 }, { requestId: 0 }, { requestedPositionId: undefined }, { completedAt: undefined }, { appliedPermissions: ["A", "A"] },
    { requestedPositionId: null }, { requestedRepresentative: true }, { status: "UNKNOWN" }, { updatedAt: "2030-02-30T00:00:00Z" }, { appliedMembershipId: 9201 }, { capabilities: {} }])("손상된 조회를 빈 성공으로 만들지 않는다 %#", patch => {
    expect(() => mapTeamMembershipRequest({ ...membershipReview(), ...patch }, 7001)).toThrow();
  });
  it.each([{ appliedMembershipId: null }, { appliedRole: null }, { appliedPositionId: null }, { appliedPermissions: [] }, { completedAt: null }, { appliedRepresentative: true }, { appliedPositionName: " " }])("불완전한 승인 receipt는 완료가 아니다 %#", async patch => {
    await expect(http(vi.fn<typeof fetch>().mockResolvedValue(ok({ ...approvedReview(), ...patch }))).approveTeamMembershipRequest(access, 7001, 8401, reviewApproval())).rejects.toThrow();
  });
  it("다른 ID·상태·version·선택 직급·사유의 명령 응답을 거부한다", async () => {
    for (const patch of [{ requestId: 8402 }, { status: "PENDING" }, { version: 3 }, { appliedPositionId: 3 }]) await expect(http(vi.fn<typeof fetch>().mockResolvedValue(ok({ ...approvedReview(), ...patch }))).approveTeamMembershipRequest(access, 7001, 8401, reviewApproval())).rejects.toThrow();
    await expect(http(vi.fn<typeof fetch>().mockResolvedValue(ok(rejectedReview("다른 사유")))).rejectTeamMembershipRequest(access, 7001, 8401, 1, "가상 거절 사유")).rejects.toThrow();
    await expect(http(vi.fn<typeof fetch>().mockResolvedValue(ok(approvedReview()))).getTeamMembershipRequest(access, 7001, 8401)).rejects.toThrow();
  });
  it("PENDING 전용 page·count·중복·나노초 오름차순을 보존한다", () => {
    const first = { ...membershipReview(), requestId: 8402, createdAt: "2030-05-01T01:00:00.000000001Z", updatedAt: "2030-05-01T01:00:00.000000001Z" };
    const second = { ...membershipReview(), createdAt: "2030-05-01T01:00:00.000000002Z", updatedAt: "2030-05-01T01:00:00.000000002Z" };
    expect(mapTeamMembershipRequestPage(membershipReviewPage([first, second]), 7001, 0, 20).content[0].requestId).toBe(8402);
    for (const page of [membershipReviewPage([second, first]), membershipReviewPage([first, first]), membershipReviewPage([approvedReview()]), { ...membershipReviewPage(), totalElements: 21 }]) expect(() => mapTeamMembershipRequestPage(page, 7001, 0, 20)).toThrow();
  });
  it.each([0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1])("잘못된 회사/신청/페이지는 전송0 %s", async id => {
    const fetcher = vi.fn<typeof fetch>(), repo = http(fetcher);
    await expect(repo.getTeamMembershipRequest(access, 7001, id)).rejects.toThrow(); await expect(repo.listTeamMembershipRequests(access, id)).rejects.toThrow(); expect(fetcher).not.toHaveBeenCalled();
  });
  it.each([200, 201, 408, 409, 500])("손상/오류 %s 뒤 자동 결정 요청은 없다", async status => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok(null, status));
    await expect(http(fetcher).approveTeamMembershipRequest(access, 7001, 8401, reviewApproval())).rejects.toThrow(); expect(fetcher).toHaveBeenCalledTimes(1);
  });
});

describe("회사 신청 mock과 팀원 상태", () => {
  it("승인 후 실제 mock 팀원/직급/권한과 목록 제외·PENDING 전용404를 확인한다", async () => {
    const runtime = mockRuntime(memoryStorage(), { company: "team-requests" }), repo = createMockCompanyRepository(runtime);
    expect((await repo.listTeamMembershipRequests(access, 7001)).totalElements).toBe(23);
    const result = await repo.approveTeamMembershipRequest(access, 7001, 8401, reviewApproval());
    expect(result).toMatchObject({ status: "APPROVED", version: 2, appliedRole: "VIEWER", appliedPermissions: reviewViewer });
    expect(await repo.getCompanyTeamMember(access, 7001, result.appliedMembershipId!)).toMatchObject({ positionId: 2, role: "VIEWER", permissions: reviewViewer });
    expect((await createMockCompanyRepository(runtime).listTeamMembershipRequests(access, 7001)).totalElements).toBe(22);
    await expect(repo.getTeamMembershipRequest(access, 7001, 8401)).rejects.toMatchObject({ status: 404 });
  });
  it("거절 사유/terminal 이력과 계정/다른 영역을 유지한다", async () => {
    const runtime = mockRuntime(memoryStorage(), { company: "team-requests" }), repo = createMockCompanyRepository(runtime);
    runtime.store.write("1", "unrelated", { preserved: true });
    const result = await repo.rejectTeamMembershipRequest(access, 7001, 8401, 1, " 가상 사유 ");
    expect(result).toMatchObject({ status: "REJECTED", rejectionReason: "가상 사유", version: 2, appliedPermissions: [] });
    const raw = runtime.store.read("1", "company-team-management", () => ({}), (v): v is Record<string, unknown> => !!v);
    expect(JSON.stringify(raw)).toContain('"rejectionReason":"가상 사유"');
    const other = { ...access, getAccountKey: () => "2" };
    expect((await repo.getTeamMembershipRequest(other, 7001, 8401)).status).toBe("PENDING"); expect(runtime.store.read("1", "unrelated", () => null, (v): v is unknown => !!v)).toEqual({ preserved: true });
    await expect(repo.rejectTeamMembershipRequest(access, 7001, 8401, 1, "다시 거절")).rejects.toMatchObject({ code: "CR004" });
  });
  it("다른 factory의 승인/거절 경쟁은 version을 한 번만 소비한다", async () => {
    const runtime = mockRuntime(memoryStorage(), { company: "team-requests" }), first = createMockCompanyRepository(runtime), second = createMockCompanyRepository(runtime);
    const results = await Promise.allSettled([first.approveTeamMembershipRequest(access, 7001, 8401, reviewApproval()), second.rejectTeamMembershipRequest(access, 7001, 8401, 1, "가상 사유")]);
    expect(results.filter(r => r.status === "fulfilled")).toHaveLength(1); expect(results.filter(r => r.status === "rejected")).toHaveLength(1);
    expect((await first.listCompanyTeamMembers(access, 7001)).totalElements).toBe(24);
  });
  it("REVIEW 없는 조회·다른 회사와 READ_ONLY는 거부하고 빈 목록은 별도다", async () => {
    for (const scenario of ["team-viewer", "team-agent", "team-extra", "team-read-only"]) await expect(createMockCompanyRepository(mockRuntime(memoryStorage(), { company: scenario })).listTeamMembershipRequests(access, 7001)).rejects.toMatchObject({ status: 403 });
    const repo = createMockCompanyRepository(mockRuntime(memoryStorage(), { company: "team-requests-empty" }));
    expect((await repo.listTeamMembershipRequests(access, 7001)).content).toEqual([]); await expect(repo.listTeamMembershipRequests(access, 7002)).rejects.toMatchObject({ status: 403 });
  });
  it("REVIEW만 있는 VIEWER는 원래 제안 직급/VIEWER 승인·대표자 거절만 허용한다", async () => {
    const repo = createMockCompanyRepository(mockRuntime(memoryStorage(), { company: "team-reviewer" }));
    await expect(repo.approveTeamMembershipRequest(access, 7001, 8401, { ...reviewApproval(), positionId: 3 })).rejects.toMatchObject({ status: 403 });
    await expect(repo.approveTeamMembershipRequest(access, 7001, 8401, { ...reviewApproval(), extraPermissionCodes: ["COMPANY_MEMBERSHIP_REQUEST_REVIEW"] })).rejects.toMatchObject({ status: 403 });
    expect((await repo.approveTeamMembershipRequest(access, 7001, 8404, { ...reviewApproval(), positionId: null, positionName: "가상 제안 직급" })).appliedPositionName).toBe("가상 제안 직급");
    await expect(repo.approveTeamMembershipRequest(access, 7001, 8402, { ...reviewApproval(), representative: true, positionId: null, preset: null })).rejects.toMatchObject({ code: "CR007" });
    expect((await repo.rejectTeamMembershipRequest(access, 7001, 8402, 1, "가상 대표자 거절 사유")).status).toBe("REJECTED");
  });
  it("원래 대표자 신청/현재 공석과 팀원 관리의 대표자 경쟁을 공유한다", async () => {
    const input = { ...reviewApproval(), representative: true, positionId: null, preset: null };
    const full = createMockCompanyRepository(mockRuntime(memoryStorage(), { company: "team-requests" }));
    await expect(full.approveTeamMembershipRequest(access, 7001, 8401, input)).rejects.toMatchObject({ code: "CR008" });
    await expect(full.approveTeamMembershipRequest(access, 7001, 8402, input)).rejects.toMatchObject({ code: "CR009" });
    const runtime = mockRuntime(memoryStorage(), { company: "team-no-representative" }), a = createMockCompanyRepository(runtime), b = createMockCompanyRepository(runtime);
    const results = await Promise.allSettled([a.approveTeamMembershipRequest(access, 7001, 8402, input), b.changeTeamMemberPosition(access, 9101, { expectedVersion: 1, positionId: 1 })]);
    expect(results.filter(r => r.status === "fulfilled")).toHaveLength(1);
    const members = await a.listCompanyTeamMembers(access, 7001, 0, 100); expect(members.content.filter(m => m.positionType === "REPRESENTATIVE")).toHaveLength(1);
  });
  it("손상된 신청 영역을 복원해도 기존 팀원 관리·초대/회사 데이터는 보존한다", async () => {
    const storage = memoryStorage(), runtime = mockRuntime(storage, { company: "team-requests" }), repo = createMockCompanyRepository(runtime);
    const approved = await repo.approveTeamMembershipRequest(access, 7001, 8401, reviewApproval());
    const key = runtime.store.key("1", "company-team-management"), state = JSON.parse(storage.getItem(key)!);
    state.companies[7001].membershipRequests[0].accountId = "synthetic-forbidden-field"; storage.setItem(key, JSON.stringify(state));
    await repo.listTeamMembershipRequests(access, 7001);
    expect((await repo.getCompanyTeamMember(access, 7001, approved.appliedMembershipId!)).membershipId).toBe(approved.appliedMembershipId);
    await expect(repo.approveTeamMembershipRequest(access, 7001, 8401, reviewApproval())).rejects.toMatchObject({ code: "CM004" });
    expect((await repo.getMyCompanyOverview(access)).status).toBe("connected");
  });
});

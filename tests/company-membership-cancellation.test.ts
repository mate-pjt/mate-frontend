import { describe, expect, it, vi } from "vitest";

import type { MyMembershipRequest } from "@/data/company/contracts";
import { createHttpCompanyRepository } from "@/data/company/http-repository";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { memoryStorage } from "@/data/mock/store";
import { ApiError } from "@/data/shared/errors";
import { createHttpClient } from "@/data/shared/http";
import { access, authentication, mockRuntime, ok, testNow } from "./helpers";

const pendingRequest = (): MyMembershipRequest => ({
  requestId: 8001, version: 3,
  company: { companyId: 7001, companyName: "합성 회사", businessNumber: "1234567890", baseAddress: null, verificationStatus: "VERIFIED" },
  requestedRepresentative: false, requestedPositionName: "담당자", proposedPositionName: null,
  status: "PENDING", rejectionReason: null, createdAt: "2030-06-01T00:00:00Z", updatedAt: "2030-06-01T00:00:00Z", completedAt: null,
});
const canceledRequest = (): MyMembershipRequest => ({ ...pendingRequest(), status: "CANCELED", version: 4, updatedAt: "2030-06-01T01:00:00Z", completedAt: "2030-06-01T01:00:00Z" });
const body = { companyId: 7001, representative: false, positionId: 1, proposedPositionName: null, message: null };
const failure = (status: number, code: string) => new Response(JSON.stringify({ isSuccess: false, code }), { status });

describe("소속 신청 취소 HTTP 계약", () => {
  it("조회 version을 보존하고 같은 신청/증가 version을 body 없는 DELETE로 검증한다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok(pendingRequest())).mockResolvedValueOnce(ok(canceledRequest()));
    const refresh = vi.fn(access.refresh); const port = { ...access, refresh };
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic.test", fetcher));
    const overview = await repo.getMyCompanyOverview(port);
    expect(overview).toEqual({ status: "pending", request: pendingRequest() });
    expect(await repo.cancelMembershipRequest(port, 8001, 3)).toEqual({ request: canceledRequest() });
    const [url, options] = fetcher.mock.calls[1];
    expect(url).toBe("https://synthetic.test/api/v1/company-membership-requests/8001?expectedVersion=3");
    expect(options).toMatchObject({ method: "DELETE", credentials: "include", cache: "no-store", body: undefined });
    expect(new Headers(options?.headers).has("Idempotency-Key")).toBe(false);
    expect(new Headers(options?.headers).has("Content-Type")).toBe(false);
    expect(refresh).toHaveBeenLastCalledWith({ preserveOnError: true });
  });
  it.each([0, -1, 1.5, Number.NaN, Number.MAX_SAFE_INTEGER + 1, "1", undefined])("잘못된 ID/version %s는 HTTP 호출 전에 거부한다", async invalid => {
    const fetcher = vi.fn<typeof fetch>(); const repo = createHttpCompanyRepository(createHttpClient("https://synthetic.test", fetcher));
    await expect(repo.cancelMembershipRequest(access, invalid as number, 3)).rejects.toMatchObject({ status: 400 });
    await expect(repo.cancelMembershipRequest(access, 8001, invalid as number)).rejects.toMatchObject({ status: 400 });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it.each([
    ["대상 불일치", { requestId: 8002 }], ["대기 상태", { status: "PENDING", completedAt: null }],
    ["version 유지", { version: 3 }], ["version 누락", { version: undefined }], ["문자 version", { version: "4" }],
    ["완료 시각 없음", { completedAt: null }], ["잘못된 시각", { updatedAt: "invalid" }], ["상태 오류", { status: "UNKNOWN" }],
  ])("잘못된 성공 응답 %s는 갱신/완료로 처리하지 않는다", async (_, patch) => {
    const refresh = vi.fn(access.refresh);
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic.test", async () => ok({ ...canceledRequest(), ...patch })));
    await expect(repo.cancelMembershipRequest({ ...access, refresh }, 8001, 3)).rejects.toMatchObject({ code: "MEMBERSHIP_RESPONSE_INVALID" });
    expect(refresh).not.toHaveBeenCalled();
  });
  it.each([null, {}, { success: true, data: canceledRequest() }])("빈/잘못된 wrapper %s를 성공으로 바꾸지 않는다", async payload => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify(payload)));
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic.test", fetcher));
    await expect(repo.cancelMembershipRequest(access, 8001, 3)).rejects.toBeInstanceOf(ApiError);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it.each([[409, "CR004"], [409, "CR003"], [404, "CR001"], [403, "FORBIDDEN"], [500, "ERROR"]])("%i %s를 보존하고 자동 재취소하지 않는다", async (status, code) => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(failure(status, code));
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic.test", fetcher));
    await expect(repo.cancelMembershipRequest(access, 8001, 3)).rejects.toMatchObject({ status, code });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("응답 유실은 미확정 오류로 남기고 자동 재전송하지 않는다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockRejectedValue(new TypeError("connection lost"));
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic.test", fetcher));
    await expect(repo.cancelMembershipRequest(access, 8001, 3)).rejects.toMatchObject({ code: "NETWORK_ERROR" });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("동일 계정401만 한 번 재시도하며 최종401을 성공으로 처리하지 않는다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(failure(401, "EXPIRED")).mockResolvedValueOnce(ok(canceledRequest()));
    const refresh = vi.fn(access.refresh); const repo = createHttpCompanyRepository(createHttpClient("https://synthetic.test", fetcher));
    expect((await repo.cancelMembershipRequest({ ...access, refresh }, 8001, 3)).request.status).toBe("CANCELED");
    expect(fetcher).toHaveBeenCalledTimes(2);
    fetcher.mockReset().mockImplementation(async () => failure(401, "EXPIRED"));
    await expect(repo.cancelMembershipRequest({ ...access, refresh }, 8001, 3)).rejects.toMatchObject({ status: 401 });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it.each([null, new Error("offline")])("취소 뒤 refresh 실패는 완료+sessionWarning이며 재취소하지 않는다", async result => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok(canceledRequest()));
    const refresh = vi.fn(async () => { if (result instanceof Error) throw result; return result; });
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic.test", fetcher));
    expect(await repo.cancelMembershipRequest({ ...access, refresh }, 8001, 3)).toMatchObject({ request: canceledRequest(), sessionWarning: expect.any(String) });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("요청 중 계정 교체는 성공 응답을 폐기하고 새 계정 refresh도 하지 않는다", async () => {
    let account = "1"; let resolve!: (response: Response) => void;
    const fetcher = vi.fn<typeof fetch>(() => new Promise(done => { resolve = done; })); const refresh = vi.fn(access.refresh);
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic.test", fetcher));
    const pending = repo.cancelMembershipRequest({ ...access, getAccountKey: () => account, refresh }, 8001, 3);
    await vi.waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1)); account = "2"; resolve(ok(canceledRequest()));
    await expect(pending).rejects.toMatchObject({ code: "ACCOUNT_CHANGED" }); expect(refresh).not.toHaveBeenCalled();
  });
  it("조회 version 누락과403은 빈 신청으로 치환하지 않고 승인 지연을 유지한다", async () => {
    for (const payload of [{ ...pendingRequest(), version: undefined }, { ...pendingRequest(), version: 0 }]) {
      const repo = createHttpCompanyRepository(createHttpClient("https://synthetic.test", async () => ok(payload)));
      await expect(repo.getMyCompanyOverview(access)).rejects.toMatchObject({ code: "MEMBERSHIP_RESPONSE_INVALID" });
    }
    const denied = createHttpCompanyRepository(createHttpClient("https://synthetic.test", async () => failure(403, "FORBIDDEN")));
    await expect(denied.getMyCompanyOverview(access)).rejects.toMatchObject({ status: 403 });
    const approved = { ...canceledRequest(), status: "APPROVED" };
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic.test", async () => ok(approved)));
    expect(await repo.getMyCompanyOverview({ ...access, refresh: async () => authentication() })).toMatchObject({ status: "approved-stale", request: approved });
  });
});

describe("소속 신청 취소 mock/복원", () => {
  it.each([false, true])("일반/대표자 %s 취소는 이력·version을 보존하고 재신청을 새 ID로 만든다", async representative => {
    const storage = memoryStorage(); const runtime = mockRuntime(storage); const repo = createMockCompanyRepository(runtime);
    const created = await repo.requestMembership(access, { ...body, representative, positionId: representative ? null : 1 });
    expect(await repo.cancelMembershipRequest(access, created.requestId, 1)).toMatchObject({ request: { requestId: created.requestId, version: 2, status: "CANCELED", completedAt: new Date(testNow).toISOString() } });
    const restored = createMockCompanyRepository(mockRuntime(storage));
    expect(await restored.getMyCompanyOverview(access)).toMatchObject({ status: "terminated", request: { status: "CANCELED", version: 2 } });
    await expect(restored.cancelMembershipRequest(access, created.requestId, 1)).rejects.toMatchObject({ code: "CR004" });
    await expect(restored.cancelMembershipRequest(access, created.requestId, 2)).rejects.toMatchObject({ code: "CR003" });
    const next = await restored.requestMembership(access, body); expect(next.requestId).not.toBe(created.requestId);
    await expect(restored.cancelMembershipRequest(access, created.requestId, 2)).rejects.toMatchObject({ code: "CR003" });
    expect(await restored.getMyCompanyOverview(access)).toMatchObject({ status: "pending", request: { requestId: next.requestId, version: 1 } });
    const saved = JSON.parse(storage.getItem(runtime.store.key("1", "company"))!);
    expect(saved.membershipRequests[created.requestId].status).toBe("CANCELED"); expect(Object.keys(saved.membershipRequests)).toHaveLength(2);
  });
  it("다른 계정·탭과 없는 대상을 격리하고 hybrid mock은 실제 인증을 추가 요청하지 않는다", async () => {
    const runtime = { ...mockRuntime(), authSource: "api" as const }; const repo = createMockCompanyRepository(runtime);
    const getAccessToken = vi.fn(access.getAccessToken); const refresh = vi.fn(access.refresh); const port = { ...access, getAccessToken, refresh };
    const created = await repo.requestMembership(port, body);
    await expect(repo.cancelMembershipRequest({ ...port, getAccountKey: () => "2" }, created.requestId, 1)).rejects.toMatchObject({ status: 404, code: "CR001" });
    await expect(createMockCompanyRepository(mockRuntime()).cancelMembershipRequest(access, created.requestId, 1)).rejects.toMatchObject({ status: 404 });
    await repo.cancelMembershipRequest(port, created.requestId, 1);
    expect(getAccessToken).not.toHaveBeenCalled(); expect(refresh).not.toHaveBeenCalled();
  });
  it("동시 중복 취소에서 한 번만 확정되고 활성 회사는 지우지 않는다", async () => {
    const repo = createMockCompanyRepository(mockRuntime()); const created = await repo.requestMembership(access, body);
    const results = await Promise.allSettled([repo.cancelMembershipRequest(access, created.requestId, 1), repo.cancelMembershipRequest(access, created.requestId, 1)]);
    expect(results.filter(item => item.status === "fulfilled")).toHaveLength(1);
    const connected = createMockCompanyRepository(mockRuntime(memoryStorage(), { company: "connected" }));
    await expect(connected.cancelMembershipRequest(access, 8001, 1)).rejects.toMatchObject({ status: 404 });
    expect((await connected.getMyCompanyOverview(access)).status).toBe("connected");
  });
  it("구형 합성 신청만 이관하고 문서·초대·멱등 replay와 다른 계정을 보존한다", async () => {
    const storage = memoryStorage(); const runtime = mockRuntime(storage); const repo = createMockCompanyRepository(runtime);
    await repo.requestMembership(access, body); await repo.previewInvitation("mock-invite");
    const file = new File(["synthetic"], "synthetic.pdf", { type: "application/pdf" });
    const upload = await repo.createDocumentUpload(access, file, "upload");
    const key = runtime.store.key("1", "company"); const state = JSON.parse(storage.getItem(key)!);
    delete state.membershipVersion; delete state.membershipRequests; delete state.nextMembershipRequestId;
    delete state.overview.request.version; delete state.overview.request.updatedAt; delete state.overview.request.completedAt;
    storage.setItem(key, JSON.stringify(state));
    const restored = createMockCompanyRepository(mockRuntime(storage));
    expect(await restored.getMyCompanyOverview(access)).toMatchObject({ status: "pending", request: { version: 1, completedAt: null } });
    expect(await restored.createDocumentUpload(access, file, "upload")).toEqual(upload);
    expect((await restored.resumeInvitation(access)).invitationId).toBe(8101);
    const after = JSON.parse(storage.getItem(key)!); expect(after.documents).toEqual(state.documents); expect(after.requests).toEqual(state.requests);
    after.overview.request.version = 0; storage.setItem(key, JSON.stringify(after));
    expect(await restored.getMyCompanyOverview(access)).toEqual({ status: "empty" });
  });
});

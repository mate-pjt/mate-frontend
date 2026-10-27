import { describe, expect, it, vi } from "vitest";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { createHttpCompanyRepository } from "@/data/company/http-repository";
import { createHttpClient } from "@/data/shared/http";
import { memoryStorage } from "@/data/mock/store";
import { createSessionController } from "@/data/auth/session-controller";
import { ApiError } from "@/data/shared/errors";
import { access, authentication, mockRuntime, ok } from "./helpers";
const file = () => new File(["synthetic document"], "synthetic.pdf", { type: "application/pdf" });
const registrationBody = (proposal: Awaited<ReturnType<ReturnType<typeof createMockCompanyRepository>["getRegistrationProposal"]>>) => ({ proposalId: proposal.proposalId, documentId: proposal.documentId, versionId: proposal.versionId, revision: proposal.revision, telephoneNumber: null, primaryIndustryCode: "0001", preferredBidNoticeAmountRange: "ANY" as const, representative: true, positionName: null, conflictChoice: null, businessNumberCorrectionChoice: null });

describe("회사·증명서 Repository", () => {
  it("실제 인증 포트와 mock 회사는 세션 갱신이나 토큰을 요청하지 않는다", async () => {
    const getAccessToken = vi.fn(access.getAccessToken); const refresh = vi.fn(access.refresh); const port = { ...access, getAccessToken, refresh };
    const repo = createMockCompanyRepository({ ...mockRuntime(), authSource: "api" }); expect((await repo.getMyCompanyOverview(port)).status).toBe("empty");
    await repo.requestMembership(port, { companyId: 7001, representative: false, positionId: 1, proposedPositionName: null, message: null });
    expect((await repo.getMyCompanyOverview(port)).status).toBe("pending"); expect(getAccessToken).not.toHaveBeenCalled(); expect(refresh).not.toHaveBeenCalled();
  });
  it("초대 문맥을 비로그인→로그인→계정 교체 뒤에도 유지하고 버전을 검사한다", async () => {
    const storage = memoryStorage(); const repo = createMockCompanyRepository(mockRuntime(storage)); await repo.previewInvitation("mock-invite-account-2");
    const restored = createMockCompanyRepository(mockRuntime(storage)); expect((await restored.resumeInvitation(access)).emailMatched).toBe(false);
    await expect(restored.acceptInvitation(access, 1)).rejects.toMatchObject({ status: 403 });
    const other = { ...access, getAccountKey: () => "2" }; await expect(restored.acceptInvitation(other, 0)).rejects.toMatchObject({ status: 409 });
    await restored.acceptInvitation(other, 1); expect((await restored.getMyCompanyOverview(other)).status).toBe("connected"); expect((await restored.getMyCompanyOverview(access)).status).toBe("empty");
  });
  it("사업자번호 처리, 멱등성, 등록과 나의 회사가 연결된다", async () => {
    const repo = createMockCompanyRepository(mockRuntime()); const connection = await repo.createBusinessConnection(access, "1234567890", "connection-key");
    expect((await repo.createBusinessConnection(access, "1234567890", "connection-key")).connectionId).toBe(connection.connectionId);
    await expect(repo.createBusinessConnection(access, "2345678901", "connection-key")).rejects.toMatchObject({ status: 409 });
    for (let i = 0; i < 3; i++) await repo.getBusinessConnection(access);
    const body = { connectionId: connection.connectionId, preferredBidNoticeAmountRange: "ANY" as const, representative: true, positionName: null };
    const result = await repo.createUnverifiedCompany(access, body, "registration-key");
    expect(await repo.createUnverifiedCompany(access, body, "registration-key")).toEqual(result);
    const view = await repo.getMyCompanyOverview(access); expect(view.status).toBe("connected"); if (view.status === "connected") expect(view.profile.verificationStatus).toBe("UNVERIFIED");
  });
  it("mock 업로드는 fetch 없이 복원·실패·재시도·제안·등록을 처리한다", async () => {
    const storage = memoryStorage(); const runtime = mockRuntime(storage, { company: "processing-failed" }); const repo = createMockCompanyRepository(runtime); const upload = await repo.createDocumentUpload(access, file(), "upload-key");
    expect(upload).not.toHaveProperty("upload"); await expect(repo.completeDocumentUpload(access, upload.documentId, upload.versionId)).rejects.toMatchObject({ status: 409 });
    await repo.uploadDocumentFile(access, upload.uploadHandle, file()); await repo.completeDocumentUpload(access, upload.documentId, upload.versionId);
    const restored = createMockCompanyRepository(mockRuntime(storage, { company: "processing-failed" })); await restored.getDocumentProcessing(access, upload.documentId);
    expect((await restored.getDocumentProcessing(access, upload.documentId)).status).toBe("OCR_FAILED");
    await restored.retryDocumentProcessing(access, upload.documentId, upload.versionId, "ocr", "retry-key"); await restored.getDocumentProcessing(access, upload.documentId);
    const processing = await restored.getDocumentProcessing(access, upload.documentId); const proposal = await restored.getRegistrationProposal(access, processing.proposalId!);
    await expect(restored.createVerifiedCompany(access, { ...registrationBody(proposal), revision: 0 }, "wrong-revision")).rejects.toMatchObject({ status: 409 });
    const result = await restored.createVerifiedCompany(access, registrationBody(proposal), "verified-key"); expect(result.verificationStatus).toBe("VERIFIED");
    expect((await restored.getMyCompanyOverview(access)).status).toBe("connected");
  });
  it("증명서 교체 시 이전 버전과 다른 계정의 핸들을 거부한다", async () => {
    const repo = createMockCompanyRepository(mockRuntime()); const first = await repo.createDocumentUpload(access, file(), "upload-key");
    const next = await repo.createDocumentVersion(access, first.documentId, first.versionId, file(), "version-key"); expect(next.versionNumber).toBe(2);
    await expect(repo.completeDocumentUpload(access, first.documentId, first.versionId)).rejects.toMatchObject({ status: 409 });
    await expect(repo.uploadDocumentFile({ ...access, getAccountKey: () => "2" }, next.uploadHandle, file())).rejects.toMatchObject({ code: "UPLOAD_HANDLE_INVALID" });
  });
  it("HTTP 직접 PUT의 checksum·멱등성·헤더·쿠키 정책을 유지하고 URL은 노출하지 않는다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok({ documentId: "doc", versionId: "version", versionNumber: 1, status: "UPLOAD_PENDING", sessionExpiresAt: "2030-06-01T02:00:00Z", upload: { method: "PUT", url: "https://synthetic-storage.test/upload", headers: { "x-synthetic-signature": "fixture" }, expiresAt: "2030-06-01T02:00:00Z" } })).mockResolvedValueOnce(new Response(null, { status: 200 }));
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher)); const upload = await repo.createDocumentUpload(access, file(), "key");
    const request = fetcher.mock.calls[0][1]!; const body = JSON.parse(String(request.body));
    expect(body.sha256).toMatch(/^[a-f0-9]{64}$/); expect(body.sizeBytes).toBe(file().size); expect(new Headers(request.headers).get("Idempotency-Key")).toBe("key"); expect(upload).not.toHaveProperty("upload");
    await repo.uploadDocumentFile(access, upload.uploadHandle, file()); expect(fetcher.mock.calls[1][1]).toMatchObject({ method: "PUT", credentials: "omit", headers: { "x-synthetic-signature": "fixture" } });
  });
  it("checksum 및 descriptor 응답 대기 중 계정이 바뀌면 업로드 핸들을 발급하지 않는다", async () => {
    let account = "1"; const port = { ...access, getAccountKey: () => account };
    const fetcher = vi.fn<typeof fetch>(); const repo = createHttpCompanyRepository(createHttpClient("https://synthetic.test", fetcher));
    let read!: (buffer: ArrayBuffer) => void; const pendingFile = file(); const buffer = await pendingFile.arrayBuffer();
    vi.spyOn(pendingFile, "arrayBuffer").mockImplementation(() => new Promise(done => { read = done; }));
    const checksumPending = repo.createDocumentUpload(port, pendingFile, "checksum-race"); account = "2"; read(buffer);
    await expect(checksumPending).rejects.toMatchObject({ code: "ACCOUNT_CHANGED" }); expect(fetcher).not.toHaveBeenCalled();
    let respond!: (response: Response) => void;
    fetcher.mockImplementation(() => new Promise(done => { respond = done; })); account = "1";
    const responsePending = repo.createDocumentUpload(port, file(), "response-race");
    await vi.waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1)); account = "2";
    respond(ok({ documentId: "doc", versionId: "v1", versionNumber: 1, status: "UPLOAD_PENDING", sessionExpiresAt: "2030-06-01T02:00:00Z", upload: { method: "PUT", url: "https://synthetic-storage.test/upload", headers: {}, expiresAt: "2030-06-01T02:00:00Z" } }));
    await expect(responsePending).rejects.toMatchObject({ code: "ACCOUNT_CHANGED" }); expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("실제 회사 변경 성공 뒤 refresh 실패는 경고를 반환한다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok({ companyId: 77, membershipId: 88, role: "ADMIN", verificationStatus: "UNVERIFIED" }));
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher)); const refresh = vi.fn().mockRejectedValue(new Error("offline"));
    const result = await repo.createUnverifiedCompany({ ...access, refresh }, { connectionId: "connection", preferredBidNoticeAmountRange: "ANY", representative: true, positionName: null }, "key");
    expect(result.companyId).toBe(77); expect(result.sessionWarning).toBeTruthy(); expect(fetcher).toHaveBeenCalledTimes(1); expect(refresh).toHaveBeenCalledWith({ preserveOnError: true });
  });
  it.each([401, 403])("회사 변경 후 refresh %i는 등록 성공과 경고를 반환하고 세션만 만료시킨다", async status => {
    const session = createSessionController({ refreshBrowserSession: async () => { throw new ApiError(status, "EXPIRED", "expired"); }, logoutBrowserSession: async () => {} });
    session.setAuthentication(authentication()); const repo = createHttpCompanyRepository(createHttpClient("https://synthetic.test", async () => ok({ companyId: 77, membershipId: 88, role: "ADMIN", verificationStatus: "UNVERIFIED" })));
    const result = await repo.createUnverifiedCompany(session, { connectionId: "c", representative: true, positionName: null, preferredBidNoticeAmountRange: "ANY" }, "key");
    expect(result.companyId).toBe(77); expect(result.sessionWarning).toBeTruthy(); expect(session.getSnapshot().status).toBe("anonymous");
  });
  it.each(["activeVersion", "proposalReference", "companyProfile"])("손상된 회사 공간의 %s를 초기화하고 다른 계정은 유지한다", async damage => {
    const storage = memoryStorage(); const runtime = mockRuntime(storage); const repo = createMockCompanyRepository(runtime);
    const upload = await repo.createDocumentUpload(access, file(), "upload");
    await repo.uploadDocumentFile(access, upload.uploadHandle, file()); await repo.completeDocumentUpload(access, upload.documentId, upload.versionId);
    await repo.getDocumentProcessing(access, upload.documentId); await repo.getDocumentProcessing(access, upload.documentId);
    const other = { ...access, getAccountKey: () => "2" }; await repo.requestMembership(other, { companyId: 7001, representative: false, positionId: 1, proposedPositionName: null, message: null });
    const key = runtime.store.key("1", "company"); const state = JSON.parse(storage.getItem(key)!);
    if (damage === "activeVersion") state.documents[upload.documentId].activeVersion = "missing";
    if (damage === "proposalReference") state.documents[upload.documentId].versions[upload.versionId].proposalId = "missing";
    if (damage === "companyProfile") state.proposals[Object.keys(state.proposals)[0]].companyProfile.capability = null;
    storage.setItem(key, JSON.stringify(state));
    expect(await repo.getMyCompanyOverview(access)).toEqual({ status: "empty" });
    await expect(repo.getDocumentProcessing(access, upload.documentId)).rejects.toMatchObject({ status: 404 });
    expect((await repo.getMyCompanyOverview(other)).status).toBe("pending");
  });
  it("HTTP 나의 회사는 CR001만 빈 신청으로 판단한다", async () => {
    for (const [code, empty] of [["CR001", true], ["UNKNOWN", false]] as const) {
      const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ isSuccess: false, code }), { status: 404 }));
      const repo = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
      if (empty) expect(await repo.getMyCompanyOverview(access)).toEqual({ status: "empty" }); else await expect(repo.getMyCompanyOverview(access)).rejects.toMatchObject({ status: 404 });
    }
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok({ companyId: 77 })); const repo = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
    expect((await repo.getMyCompanyOverview({ ...access, refresh: async () => ({ ...authentication(), companyContext: { companyId: 77, role: "ADMIN" } }) })).status).toBe("connected");
  });
});

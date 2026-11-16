import { describe, expect, it, vi } from "vitest";
import { createHttpCompanyRepository } from "@/data/company/http-repository";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { documentBoxFixtures } from "@/data/company/document-box-mock";
import { mapDocumentBoxPage, mapDocumentBoxVersions } from "@/data/company/document-box-api-mapper";
import type { CompanyDocumentRepository, DocumentBoxItem, DocumentBoxPage } from "@/data/company/contracts";
import { createHttpClient } from "@/data/shared/http";
import { ApiError } from "@/data/shared/errors";
import { memoryStorage } from "@/data/mock/store";
import { documentPeriod, koreanDate, loadDocumentBox } from "@/features/company/document-box";
import { access, authentication, mockRuntime, ok, testNow } from "./helpers";

const fixtures = documentBoxFixtures(testNow);
const version = fixtures[0].box.versions[fixtures[0].displayedVersionId];
const item: DocumentBoxItem = { versionId: version.versionId, versionNumber: version.versionNumber, filename: version.filename,
  uploadedAt: version.uploadedAt, modifiedAt: version.modifiedAt, status: version.status, current: version.current,
  documentId: fixtures[0].documentId, documentType: "BUSINESS_REGISTRATION" };
const page = (content = [item], totalElements = content.length): DocumentBoxPage => ({ content, page: 0, size: 20, totalElements, totalPages: Math.ceil(totalElements / 20) });
const repository = (overrides: Partial<CompanyDocumentRepository> = {}) => ({
  getDocumentBoxContext: vi.fn(async () => ({ companyId: 7001 })),
  listCompanyDocuments: vi.fn(async () => page()),
  getCompanyDocumentVersions: vi.fn(async () => [version]),
  ...overrides,
});

describe("서류함 HTTP 계약", () => {
  it("회사 문맥은 인증 refresh만 사용하고 기본정보 leaf를 추가 요청하지 않는다", async () => {
    const fetcher = vi.fn<typeof fetch>();
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
    const port = { ...access, refresh: vi.fn(async () => ({ ...authentication(), companyContext: { companyId: 7001, role: "VIEWER" } })) };
    expect(await repo.getDocumentBoxContext(port)).toEqual({ companyId: 7001 });
    expect(fetcher).not.toHaveBeenCalled();
    expect(await repo.getDocumentBoxContext(access)).toEqual({ companyId: null });
  });
  it("page0/size20·보호 GET과 exact 문서 ID의 버전 경로를 사용한다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok(page())).mockResolvedValueOnce(ok([{ ...version, uploaderAccountId: 99, unused: "discard" }]));
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
    expect(await repo.listCompanyDocuments(access, 7001)).toEqual(page());
    expect(await repo.getCompanyDocumentVersions(access, item.documentId)).toEqual([version]);
    expect(fetcher.mock.calls[0][0]).toBe("https://synthetic-api.test/api/v1/companies/7001/documents?page=0&size=20");
    expect(fetcher.mock.calls[1][0]).toBe(`https://synthetic-api.test/api/v1/company-documents/${item.documentId}/versions`);
    expect(fetcher.mock.calls[0][1]).toMatchObject({ method: "GET", credentials: "include", cache: "no-store" });
  });
  it.each([[0, 0, 20], [7001, -1, 20], [7001, 0, 0], [7001, 0, 101], [7001, 0.5, 20], [7001, 2_147_483_647, 100]])("잘못된 조회 입력은 요청 전에 거부한다 (%i/%i/%i)", async (company, p, size) => {
    const fetcher = vi.fn<typeof fetch>();
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
    await expect(repo.listCompanyDocuments(access, company, p, size)).rejects.toMatchObject({ status: 400 });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("size100과 범위 밖 빈 page는 총0건과 구분한다", async () => {
    const p = { content: [], page: 1, size: 100, totalElements: 25, totalPages: 1 };
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok(p));
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
    expect(await repo.listCompanyDocuments(access, 7001, 1, 100)).toEqual(p);
  });
  it.each([
    { ...page(), content: null }, { ...page(), content: [] }, { ...page(), page: 1 }, { ...page(), totalPages: 0 },
    { ...page(), content: [item, item], totalElements: 2 }, { ...page(), content: [{ ...item, current: undefined }] },
    { ...page(), content: [{ ...item, status: "SUCCESS" }] }, { ...page(), content: [{ ...item, versionId: "../unsafe" }] },
    { ...page(), content: [{ ...item, uploadedAt: "invalid" }] },
  ])("손상된 목록은 빈 성공/추정 상태로 바꾸지 않는다 %#", value => {
    expect(() => mapDocumentBoxPage(value, 0, 20)).toThrow(ApiError);
  });
  it("nullable 날짜·손상 날짜 확인·추가 wire 필드 폐기를 구분한다", () => {
    expect(mapDocumentBoxVersions([{ ...version, validFrom: undefined, validUntil: undefined }])[0]).toMatchObject({ validFrom: null, validUntil: null });
    const damaged = mapDocumentBoxVersions([{ ...version, validUntil: "2030-02-30" }])[0];
    expect(documentPeriod(damaged, testNow)).toBe("기간 확인 필요");
    expect(() => mapDocumentBoxVersions([{ ...version, validUntil: 99 }])).toThrow(ApiError);
    expect(() => mapDocumentBoxVersions([version, { ...version, versionId: fixtures[1].displayedVersionId }])).toThrow(ApiError);
  });
  it("403·실패 wrapper를 빈 목록으로 바꾸거나 mock으로 대체하지 않는다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok(null, 403)).mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: page() }), { status: 200 }));
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
    await expect(repo.listCompanyDocuments(access, 7001)).rejects.toMatchObject({ status: 403 });
    await expect(repo.listCompanyDocuments(access, 7001)).rejects.toBeInstanceOf(ApiError);
  });
});

describe("서류함 기간", () => {
  it.each([
    [null, null, "미확인"], [null, "2030-06-01", "기간 내"], [null, "2030-05-31", "만료"],
    ["2030-06-02", "2030-07-01", "유효기간 시작 전"], ["2030-06-02", null, "유효기간 시작 전"],
    ["2030-06-01", null, "미확인"], ["2030-06-02", "2030-06-01", "기간 확인 필요"],
    [null, "2030-02-30", "기간 확인 필요"], ["", null, "기간 확인 필요"], [null, "2030-6-1", "기간 확인 필요"],
    ["2028-02-29", "2030-06-01", "기간 내"], ["2029-02-29", null, "기간 확인 필요"],
  ])("기간 %s ~ %s → %s", (validFrom, validUntil, expected) => {
    expect(documentPeriod({ validFrom, validUntil }, testNow)).toBe(expected);
  });
  it("UTC와 KST 날짜 경계·유효 마지막 날을 구분한다", () => {
    const v = { validFrom: null, validUntil: "2026-11-16" };
    expect(koreanDate(Date.parse("2026-11-16T15:00:00Z"))).toBe("2026-11-17");
    expect(documentPeriod(v, Date.parse("2026-11-16T14:59:59Z"))).toBe("기간 내");
    expect(documentPeriod(v, Date.parse("2026-11-16T15:00:00Z"))).toBe("만료");
  });
});

describe("목록·버전 조합과 수명", () => {
  it("현재 page만 조회하고 동시4건·서버 순서·후보/current를 보존한다", async () => {
    const mock = createMockCompanyRepository(mockRuntime(undefined, { company: "documents" }));
    let running = 0; let maximum = 0;
    const versions = vi.fn(async (...args: Parameters<CompanyDocumentRepository["getCompanyDocumentVersions"]>) => {
      running++; maximum = Math.max(running, maximum);
      await new Promise(resolve => setTimeout(resolve, 2));
      try { return await mock.getCompanyDocumentVersions(...args); } finally { running--; }
    });
    const result = await loadDocumentBox(access, 0, new AbortController().signal, { ...mock, getCompanyDocumentVersions: versions });
    expect(maximum).toBe(4); expect(versions).toHaveBeenCalledTimes(20);
    expect(result.status).toBe("ready");
    if (result.status !== "ready") throw new Error("expected page");
    expect(result.page.totalElements).toBe(25); expect(result.page.content[0].documentId).toBe(fixtures[0].documentId);
    expect(result.page.content[1]).toMatchObject({ current: false, status: "OCR_PROCESSING", versions: { status: "ready", current: { versionNumber: 1, current: true, status: "VERIFIED" }, displayed: { versionNumber: 2, current: false } } });
    const last = await loadDocumentBox(access, 1, new AbortController().signal, { ...mock, getCompanyDocumentVersions: versions });
    expect(last.status === "ready" && last.page.content.length).toBe(5); expect(versions).toHaveBeenCalledTimes(25);
  });
  it("회사 미연결/전체0건/빈 page에는 버전 요청이 없다", async () => {
    const noCompany = repository({ getDocumentBoxContext: async () => ({ companyId: null }) });
    expect(await loadDocumentBox(access, 0, new AbortController().signal, noCompany)).toEqual({ status: "no-company" });
    expect(noCompany.listCompanyDocuments).not.toHaveBeenCalled();
    const empty = repository({ listCompanyDocuments: async () => page([]) });
    await loadDocumentBox(access, 0, new AbortController().signal, empty); expect(empty.getCompanyDocumentVersions).not.toHaveBeenCalled();
  });
  it("개별 버전 실패와 current 경쟁은 확인 필요이며 보유·기간을 만들지 않는다", async () => {
    for (const versions of [async () => { throw new ApiError(503, null, "unavailable"); }, async () => [{ ...version, current: false }], async () => [{ ...version, status: "REPLACED" as const }]]) {
      const result = await loadDocumentBox(access, 0, new AbortController().signal, repository({ getCompanyDocumentVersions: versions }));
      expect(result.status === "ready" && result.page.content[0].versions).toEqual({ status: "unavailable" });
    }
  });
  it.each([401, 403])("버전 조회 %i는 전체 보호 자료를 거부한다", async status => {
    await expect(loadDocumentBox(access, 0, new AbortController().signal, repository({ getCompanyDocumentVersions: async () => { throw new ApiError(status, null, "denied"); } }))).rejects.toMatchObject({ status });
  });
  it("계정/회사 scope 변경·Abort 뒤의 응답을 버리고 다음 조회를 시작하지 않는다", async () => {
    let account = "1";
    const port = { ...access, getAccountKey: () => account };
    const changed = repository({ getDocumentBoxContext: async () => { account = "2"; return { companyId: 7001 }; } });
    await expect(loadDocumentBox(port, 0, new AbortController().signal, changed)).rejects.toMatchObject({ code: "ACCOUNT_CHANGED" });
    expect(changed.listCompanyDocuments).not.toHaveBeenCalled();
    let current = true;
    const companyChanged = repository({ listCompanyDocuments: async () => { current = false; return page(); } });
    await expect(loadDocumentBox(access, 0, new AbortController().signal, companyChanged, () => current)).rejects.toMatchObject({ code: "ACCOUNT_CHANGED" });
    const controller = new AbortController();
    const aborted = repository({ getCompanyDocumentVersions: async () => { controller.abort(); return [version]; } });
    await expect(loadDocumentBox(access, 0, controller.signal, aborted)).rejects.toMatchObject({ name: "AbortError" });
  });
});

describe("서류함 mock·가입 관계", () => {
  it("다른 회사/계정·목록 leaf 거절과 metadata 접근을 구분한다", async () => {
    const mock = createMockCompanyRepository(mockRuntime(undefined, { company: "documents-denied" }));
    await expect(mock.listCompanyDocuments(access, 7001)).rejects.toMatchObject({ status: 403 });
    expect((await mock.getCompanyDocumentVersions(access, fixtures[0].documentId))[0].current).toBe(true);
    await expect(mock.listCompanyDocuments(access, 7002)).rejects.toMatchObject({ status: 403 });
    const other = createMockCompanyRepository(mockRuntime());
    await expect(other.getCompanyDocumentVersions({ ...access, getAccountKey: () => "2" }, fixtures[0].documentId)).rejects.toMatchObject({ status: 404 });
  });
  it("실제 인증+mock 회사는 token/refresh를 요청하지 않는다", async () => {
    const mock = createMockCompanyRepository({ ...mockRuntime(undefined, { company: "documents" }), authSource: "api" });
    const port = { ...access, getAccessToken: vi.fn(), refresh: vi.fn() };
    await loadDocumentBox(port, 0, new AbortController().signal, mock);
    expect(port.getAccessToken).not.toHaveBeenCalled(); expect(port.refresh).not.toHaveBeenCalled();
  });
  it("가입 미귀속 업로드는 노출하지 않고 등록 성공 후 같은 문서가 복원된다", async () => {
    const storage = memoryStorage(); const runtime = mockRuntime(storage, { company: "connected" });
    const mock = createMockCompanyRepository(runtime);
    const file = new File(["synthetic"], "synthetic.pdf", { type: "application/pdf" });
    const upload = await mock.createDocumentUpload(access, file, "upload");
    expect((await mock.listCompanyDocuments(access, 7001)).totalElements).toBe(0);
    await mock.uploadDocumentFile(access, upload.uploadHandle, file); await mock.completeDocumentUpload(access, upload.documentId, upload.versionId);
    let processing = await mock.getDocumentProcessing(access, upload.documentId);
    for (let i = 0; i < 3 && !processing.proposalId; i++) processing = await mock.getDocumentProcessing(access, upload.documentId);
    const proposal = await mock.getRegistrationProposal(access, processing.proposalId!);
    const registered = await mock.createVerifiedCompany(access, { proposalId: proposal.proposalId, documentId: upload.documentId, versionId: upload.versionId, revision: proposal.revision, telephoneNumber: null, primaryIndustryCode: "0001", preferredBidNoticeAmountRange: "ANY", representative: true, positionName: null, conflictChoice: null, businessNumberCorrectionChoice: null }, "register");
    const restored = createMockCompanyRepository(mockRuntime(storage, { company: "connected" }));
    expect(await restored.getDocumentBoxContext(access)).toEqual({ companyId: registered.companyId });
    expect((await restored.listCompanyDocuments(access, registered.companyId)).content[0]).toMatchObject({ documentId: upload.documentId, versionId: upload.versionId, current: true, status: "VERIFIED" });
    expect((await restored.getCompanyDocumentVersions(access, upload.documentId))[0]).toMatchObject({ validFrom: null, validUntil: null });
    expect(await restored.getDocumentBoxContext({ ...access, getAccountKey: () => "2" })).toEqual({ companyId: 7001 });
    expect((await restored.listCompanyDocuments({ ...access, getAccountKey: () => "2" }, 7001)).totalElements).toBe(0);
  });
});

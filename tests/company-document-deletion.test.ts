import { describe, expect, it, vi } from "vitest";
import { createHttpCompanyRepository } from "@/data/company/http-repository";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { mapDocumentDeletion } from "@/data/company/document-deletion-api";
import { documentBoxFixtures } from "@/data/company/document-box-mock";
import { createHttpClient } from "@/data/shared/http";
import { ApiError } from "@/data/shared/errors";
import { memoryStorage } from "@/data/mock/store";
import { access, mockRuntime, ok, testNow } from "./helpers";

const fixture = documentBoxFixtures(testNow)[10];
const documentId = fixture.documentId;
const versionId = fixture.displayedVersionId;
const deletion = { deletedAt: new Date(testNow).toISOString(), purgeAt: new Date(testNow + 30 * 86_400_000).toISOString() };
const file = () => new File(["synthetic"], "synthetic.pdf", { type: "application/pdf" });

describe("전체 series 삭제 HTTP 계약", () => {
  it("body/expectedVersion/멱등 키 없는 DELETE와 최소 시각 결과만 공개한다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok({ ...deletion, privateField: "excluded" }));
    const signal = new AbortController().signal;
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
    expect(await repo.deleteCompanyDocument(access, documentId, signal)).toEqual(deletion);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher.mock.calls[0][0]).toBe(`https://synthetic-api.test/api/v1/company-documents/${documentId}`);
    const init = fetcher.mock.calls[0][1]!;
    expect(init).toMatchObject({ method: "DELETE", body: undefined, credentials: "include", cache: "no-store", signal });
    expect(new Headers(init.headers).has("Idempotency-Key")).toBe(false);
  });
  it.each([null, [], {}, { deletedAt: deletion.deletedAt }, { ...deletion, deletedAt: "bad" }, { ...deletion, purgeAt: null },
    { ...deletion, purgeAt: deletion.deletedAt }, { ...deletion, purgeAt: "2020-01-01T00:00:00Z" }, { ...deletion, deletedAt: "2030-06-01" }])("불완전한 성공 결과는 완료가 아니다 %#", async value => {
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", async () => ok(value)));
    await expect(repo.deleteCompanyDocument(access, documentId)).rejects.toBeInstanceOf(ApiError);
  });
  it.each([401, 403, 404, 409, 408, 503])("오류 %i는 fallback/자동 재삭제하지 않는다", async status => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok(null, status));
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
    await expect(repo.deleteCompanyDocument({ ...access, refresh: async () => null }, documentId)).rejects.toMatchObject({ status });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("잘못된 ID는 전송하지 않고 응답 유실도 성공으로 만들지 않는다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockRejectedValue(new TypeError("synthetic offline"));
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
    await expect(repo.deleteCompanyDocument(access, "../bad")).rejects.toMatchObject({ status: 400 });
    expect(fetcher).not.toHaveBeenCalled();
    await expect(repo.deleteCompanyDocument(access, documentId)).rejects.toMatchObject({ code: "NETWORK_ERROR" });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("timezone 있는 재삭제 시각을 그대로 보존하며 원본 응답을 변이하지 않는다", () => {
    const value = { deletedAt: "2030-06-01T10:00:00+09:00", purgeAt: "2030-07-01T10:00:00+09:00" };
    expect(mapDocumentDeletion(value)).toEqual(value); expect(mapDocumentDeletion(value)).not.toBe(value);
  });
});

describe("계정별 mock tombstone과 모든 version 접근 차단", () => {
  it("전체 version을 목록/metadata/원본/처리에서 제외하고 재삭제 시각·인증/다른 자료를 보존한다", async () => {
    const storage = memoryStorage(); let now = testNow;
    const runtime = mockRuntime(storage, { company: "documents" }, () => now);
    const repo = createMockCompanyRepository(runtime);
    const before = await repo.listCompanyDocuments(access, 7001, 0, 100);
    const overview = await repo.getMyCompanyOverview(access);
    const versions = await repo.getCompanyDocumentVersions(access, documentId);
    expect(versions.length).toBeGreaterThan(1);
    expect(await repo.deleteCompanyDocument(access, documentId)).toEqual(deletion);
    expect((await repo.listCompanyDocuments(access, 7001, 0, 100)).totalElements).toBe(before.totalElements - 1);
    for (const version of versions) await expect(repo.readCompanyDocumentOriginal(access, documentId, version.versionId, "PREVIEW")).rejects.toMatchObject({ status: 404 });
    await Promise.all([repo.getCompanyDocumentVersions(access, documentId), repo.getCompanyDocumentHistory(access, documentId),
      repo.getDocumentProcessing(access, documentId), repo.getDocumentReuploadStatus(access, documentId)].map(result => expect(result).rejects.toMatchObject({ status: 404 })));
    expect(await repo.getMyCompanyOverview(access)).toEqual(overview);
    now += 31 * 86_400_000;
    const restored = createMockCompanyRepository(runtime);
    expect(await restored.deleteCompanyDocument(access, documentId)).toEqual(deletion);
    expect((await restored.listCompanyDocuments(access, 7001, 0, 100)).totalElements).toBe(before.totalElements - 1);
    expect((await restored.listCompanyDocuments({ ...access, getAccountKey: () => "2" }, 7001, 0, 100)).totalElements).toBe(before.totalElements);
    const state = JSON.parse(storage.getItem(runtime.store.key("1", "company"))!);
    expect(state.documents[documentId].deletion).toEqual(deletion);
    expect(Object.keys(state.documents[documentId].versions)).toHaveLength(versions.length); // The mock does not run the purge worker.
  });
  it("삭제 뒤 교체 후보/업로드 handle·completion/polling/명시 retry의 늦은 재생을 막는다", async () => {
    const repo = createMockCompanyRepository(mockRuntime(memoryStorage(), { company: "documents" }));
    const current = (await repo.getCompanyDocumentVersions(access, documentId)).find(item => item.current)!;
    const upload = await repo.createDocumentVersion(access, documentId, current.versionId, file(), "synthetic-key");
    await repo.deleteCompanyDocument(access, documentId);
    await Promise.all([repo.createDocumentVersion(access, documentId, current.versionId, file(), "synthetic-key"),
      repo.createDocumentVersion(access, documentId, current.versionId, file(), "new-key"), repo.uploadDocumentFile(access, upload.uploadHandle, file()),
      repo.completeDocumentUpload(access, documentId, upload.versionId), repo.retryDocumentProcessing(access, documentId, upload.versionId, "ocr", "retry-key")]
      .map(result => expect(result).rejects.toMatchObject({ status: 404 })));
  });
  it("권한 없는404와 없는 문서를 같은 실패로 유지한다", async () => {
    const repo = createMockCompanyRepository(mockRuntime(memoryStorage(), { company: "documents-denied" }));
    await expect(repo.deleteCompanyDocument(access, documentId)).rejects.toMatchObject({ status: 404 });
    await expect(repo.deleteCompanyDocument(access, "99999999-0000-4000-8000-000000000001")).rejects.toMatchObject({ status: 404 });
    expect(await repo.getCompanyDocumentHistory(access, documentId)).not.toHaveLength(0);
  });
  it("삭제 metadata 손상은 회사 공간만 초기화하며 다른 namespace를 지우지 않는다", async () => {
    const storage = memoryStorage(); const runtime = mockRuntime(storage, { company: "documents" });
    const repo = createMockCompanyRepository(runtime);
    await repo.deleteCompanyDocument(access, documentId);
    const key = runtime.store.key("1", "company"); const state = JSON.parse(storage.getItem(key)!);
    state.documents[documentId].deletion.purgeAt = null; storage.setItem(key, JSON.stringify(state));
    storage.setItem("unrelated-synthetic", "preserve");
    expect((await createMockCompanyRepository(runtime).getCompanyDocumentVersions(access, documentId))[0].versionId).toBe(versionId);
    expect(storage.getItem("unrelated-synthetic")).toBe("preserve");
  });
});

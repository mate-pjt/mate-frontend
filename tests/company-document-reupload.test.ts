import { describe, expect, it, vi } from "vitest";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { createHttpCompanyRepository } from "@/data/company/http-repository";
import { createHttpClient } from "@/data/shared/http";
import { ApiError } from "@/data/shared/errors";
import { memoryStorage } from "@/data/mock/store";
import { mapReuploadStatus, mapReplacementUpload } from "@/data/company/document-upload-api";
import { createDocumentReuploadController, validateReuploadFile } from "@/features/company/document-reupload";
import { access, mockRuntime, ok, testNow } from "./helpers";

const doc = "10000000-0000-4000-8000-000000000001";
const current = "20000000-0000-4000-8000-000000000001";
const next = "30000000-0000-4000-8000-000000000001";
const file = () => new File(["synthetic document"], "synthetic.pdf", { type: "application/pdf", lastModified: 1 });
const status = { documentId: doc, versionId: current, status: "VERIFIED", current: true, canRetry: false, retryExpiresAt: null };
const upload = { documentId: doc, versionId: next, versionNumber: 2, status: "UPLOAD_READY", sessionExpiresAt: "2030-06-01T02:00:00Z",
  upload: { method: "PUT", url: "https://synthetic-storage.test/upload", headers: { "x-synthetic-signature": "fixture" }, expiresAt: "2030-06-01T01:10:00Z" } };
function setup(repo = createMockCompanyRepository(mockRuntime(undefined, { company: "documents" }))) {
  const onChange = vi.fn(); const onComplete = vi.fn(); let active = true;
  const controller = createDocumentReuploadController({ documentId: doc, access, repository: repo, onChange, onComplete, isCurrent: () => active, now: () => testNow });
  return { controller, repo, onChange, onComplete, leave: () => { active = false; controller.dispose(); } };
}

describe("재업로드 파일과 응답 경계", () => {
  it.each([1, 10 * 1024 * 1024])("정확한 byte 경계를 허용한다 %i", size => expect(validateReuploadFile({ name: "synthetic.pdf", type: "application/pdf", size })).toBeNull());
  it.each([0, -1, 10 * 1024 * 1024 + 1, 1.1, NaN])("잘못된 크기를 요청 전에 거부한다 %s", size => expect(validateReuploadFile({ name: "synthetic.pdf", type: "application/pdf", size })).not.toBeNull());
  it.each([["x.jpg", "image/jpeg"], ["x.JPEG", "image/jpeg"], ["x.PNG", "image/png"]])("MIME와 확장자가 일치해야 한다 %s", (name, type) => expect(validateReuploadFile({ name, type, size: 1 })).toBeNull());
  it.each([["x.pdf", "image/png"], ["x.exe", "application/pdf"], ["x.png", "text/plain"], ["x.pdf", ""]])("형식 불일치는 거부한다 %s", (name, type) => expect(validateReuploadFile({ name, type, size: 1 })).not.toBeNull());
  it("OCR 개인정보/업로더ID·추가 필드를 새 상태 모델로 복사하지 않는다", () => {
    expect(mapReuploadStatus({ ...status, extractedFields: { representativeName: "synthetic" }, uploaderAccountId: 7, filename: "unused" }, doc)).toEqual(status);
  });
  it.each([{ ...status, documentId: next }, { ...status, current: undefined }, { ...status, status: "SUCCESS" }, { ...status, retryExpiresAt: "invalid" }, { ...status, versionId: "../unsafe" }])("손상된 상태를 완료로 만들지 않는다 %#", value => expect(() => mapReuploadStatus(value, doc)).toThrow(ApiError));
  it.each([{ ...upload, documentId: next }, { ...upload, versionNumber: 0 }, { ...upload, upload: { ...upload.upload, method: "POST" } }, { ...upload, upload: { ...upload.upload, url: "javascript:alert(1)" } }, { ...upload, upload: { ...upload.upload, headers: { unsafe: 1 } } }])("손상된 업로드 응답은 PUT 전에 거부한다 %#", value => expect(() => mapReplacementUpload(value, doc)).toThrow(ApiError));
});

describe("재업로드 HTTP / opaque handle", () => {
  it("회사 추가가 아닌 exact versions POST·SHA/같은 키·인증 없는 PUT을 사용한다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok(upload)).mockResolvedValueOnce(new Response(null)).mockResolvedValueOnce(ok(status));
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
    const result = await repo.createDocumentVersion(access, doc, current, file(), "same-key");
    expect(result).not.toHaveProperty("upload"); expect(result).not.toHaveProperty("url");
    const [url, options] = fetcher.mock.calls[0];
    expect(url).toBe(`https://synthetic-api.test/api/v1/company-documents/${doc}/versions`);
    expect(new Headers(options?.headers).get("Idempotency-Key")).toBe("same-key");
    const body = JSON.parse(String(options?.body)); expect(body.replacesVersionId).toBe(current); expect(body).not.toHaveProperty("companyId"); expect(body).not.toHaveProperty("documentType"); expect(body.sha256).toMatch(/^[a-f0-9]{64}$/);
    await repo.uploadDocumentFile(access, result.uploadHandle, file());
    expect(fetcher.mock.calls[1][1]).toMatchObject({ method: "PUT", credentials: "omit", referrerPolicy: "no-referrer", redirect: "error" });
    expect(new Headers(fetcher.mock.calls[1][1]?.headers).has("Authorization")).toBe(false);
    expect(await repo.getDocumentReuploadStatus(access, doc)).toEqual(status);
  });
  it("계정 전환/해시 중 취소 뒤 POST/다음 PUT을 실행하지 않는다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok(upload)); const repo = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
    const signal = AbortSignal.abort();
    await expect(repo.createDocumentVersion(access, doc, current, file(), "same-key", signal)).rejects.toMatchObject({ name: "AbortError" }); expect(fetcher).not.toHaveBeenCalled();
    const result = await repo.createDocumentVersion(access, doc, current, file(), "same-key");
    await expect(repo.uploadDocumentFile({ ...access, getAccountKey: () => "2" }, result.uploadHandle, file())).rejects.toMatchObject({ code: "UPLOAD_HANDLE_INVALID" }); expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("잘못된2xx/권한 거절을 fallback/완료로 만들지 않는다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok({ ...upload, versionId: null })).mockResolvedValueOnce(ok(null, 403)); const repo = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
    await expect(repo.createDocumentVersion(access, doc, current, file(), "key")).rejects.toMatchObject({ code: "DOCUMENT_RESPONSE_INVALID" });
    await expect(repo.getDocumentReuploadStatus(access, doc)).rejects.toMatchObject({ status: 403 });
  });
});

describe("재업로드 상태 / 경쟁 / 복원", () => {
  it("후보 처리 중 current/프로필을 보존하고 VERIFIED/current 재조회 후에만1회 완료한다", async () => {
    const s = setup(); const before = await s.repo.getMyCompanyOverview(access); await s.controller.load(); s.controller.choose(file()); await s.controller.submit();
    expect(s.controller.getView().phase).toBe("processing"); expect(s.onComplete).not.toHaveBeenCalled();
    expect((await s.repo.getCompanyDocumentVersions(access, doc)).find(v => v.current)?.versionId).toBe(current);
    await s.controller.check(); expect(s.onComplete).toHaveBeenCalledTimes(1);
    const versions = await s.repo.getCompanyDocumentVersions(access, doc);
    expect(versions.find(v => v.current)?.status).toBe("VERIFIED"); expect(versions.find(v => v.versionId === current)?.status).toBe("REPLACED");
    expect(await s.repo.getMyCompanyOverview(access)).toEqual(before); await s.controller.check(); expect(s.onComplete).toHaveBeenCalledTimes(1);
  });
  it("reload·과거 성공 조회는 완료 Toast를 재생하지 않는다", async () => {
    const s = setup(); await s.controller.load(); await s.controller.check(); expect(s.onComplete).not.toHaveBeenCalled(); expect(s.controller.getView().canSelect).toBe(true);
  });
  it("PUT 실패는 같은 file/key로 이어가고 completion 응답 유실 뒤 자동 재제출하지 않는다", async () => {
    const s = setup(); const realPut = s.repo.uploadDocumentFile; const put = vi.spyOn(s.repo, "uploadDocumentFile");
    put.mockRejectedValueOnce(new ApiError(0, "NETWORK_ERROR", "synthetic")).mockImplementation(realPut);
    const create = vi.spyOn(s.repo, "createDocumentVersion"); const realComplete = s.repo.completeDocumentUpload; const complete = vi.spyOn(s.repo, "completeDocumentUpload");
    complete.mockImplementationOnce(async (...args) => { await realComplete(...args); throw new ApiError(0, "NETWORK_ERROR", "synthetic"); });
    await s.controller.load(); s.controller.choose(file()); await s.controller.submit(); expect(s.controller.getView().phase).toBe("error");
    await s.controller.submit(); expect(create.mock.calls[0][4]).toBe(create.mock.calls[1][4]); expect(complete).toHaveBeenCalledTimes(1);
    await s.controller.check(); await s.controller.check(); expect(s.onComplete).toHaveBeenCalledTimes(1); expect(complete).toHaveBeenCalledTimes(1);
  });
  it("중복 클릭·화면 종료/늦은 생성 응답 뒤 PUT·Toast를 막는다", async () => {
    const s = setup(); const put = vi.spyOn(s.repo, "uploadDocumentFile"); const real = s.repo.createDocumentVersion;
    let release!: () => void; const wait = new Promise<void>(resolve => { release = resolve; });
    const create = vi.spyOn(s.repo, "createDocumentVersion").mockImplementation(async (...args) => { const result = await real(...args); await wait; return result; });
    await s.controller.load(); s.controller.choose(file()); const pending = s.controller.submit(); await s.controller.submit();
    await vi.waitFor(() => expect(create).toHaveBeenCalledTimes(1)); s.leave(); release(); await pending;
    expect(put).not.toHaveBeenCalled(); expect(s.onComplete).not.toHaveBeenCalled();
  });
  it("PUT 주소403은 같은 키로 갱신하고 session410은 파일 재선택으로 복구한다", async () => {
    const s = setup(); const realPut = s.repo.uploadDocumentFile;
    vi.spyOn(s.repo, "uploadDocumentFile").mockRejectedValueOnce(new ApiError(403, "UPLOAD_FAILED", "synthetic")).mockImplementation(realPut);
    const create = vi.spyOn(s.repo, "createDocumentVersion");
    await s.controller.load(); s.controller.choose(file()); await s.controller.submit();
    expect(s.controller.getView().canSubmit).toBe(true); await s.controller.submit();
    expect(create.mock.calls[0][4]).toBe(create.mock.calls[1][4]); await s.controller.check(); expect(s.onComplete).toHaveBeenCalledTimes(1);
    const expired = setup(); vi.spyOn(expired.repo, "createDocumentVersion").mockRejectedValue(new ApiError(410, "UPLOAD_SESSION_EXPIRED", "synthetic"));
    await expired.controller.load(); expired.controller.choose(file()); await expired.controller.submit();
    expect(expired.controller.getView()).toMatchObject({ canSubmit: false, canSelect: true, file: null }); expect(expired.onComplete).not.toHaveBeenCalled();
  });
  it("서버409 뒤 파일/명령을 버리고 조회와 명시 재선택만 허용한다", async () => {
    const s = setup(); vi.spyOn(s.repo, "createDocumentVersion").mockRejectedValue(new ApiError(409, "VERSION_CONFLICT", "synthetic"));
    await s.controller.load(); s.controller.choose(file()); await s.controller.submit(); expect(s.controller.getView()).toMatchObject({ phase: "error", canSubmit: false, file: null });
    await s.controller.check(); expect(s.controller.getView().canSelect).toBe(true); expect(s.onComplete).not.toHaveBeenCalled();
  });
  it("같은 키의 다른 bytes·두 요청의 단일 후보·오래된current를 서버 mock에서 거절한다", async () => {
    const s = setup(); const first = await s.repo.createDocumentVersion(access, doc, current, file(), "key");
    expect((await s.repo.createDocumentVersion(access, doc, current, file(), "key")).versionId).toBe(first.versionId);
    await expect(s.repo.createDocumentVersion(access, doc, current, new File(["different document"], "synthetic.pdf", { type: "application/pdf", lastModified: 1 }), "key")).rejects.toMatchObject({ status: 409 });
    await expect(s.repo.createDocumentVersion(access, doc, current, file(), "second-key")).rejects.toMatchObject({ status: 409 });
    await expect(s.repo.createDocumentVersion(access, doc, next, file(), "third-key")).rejects.toMatchObject({ status: 409 });
  });
  it("OCR 실패의 현재canRetry/기한을 확인하고 명시 재시도 뒤 current를 교체한다", async () => {
    const runtime = mockRuntime(undefined, { company: "documents" }); const originalScenario = runtime.scenario;
    const repo = createMockCompanyRepository(runtime); const s = setup(repo); await s.controller.load();
    runtime.scenario = group => group === "company" ? "processing-failed" : originalScenario(group);
    s.controller.choose(file()); await s.controller.submit(); await s.controller.check(); expect(s.controller.getView().canRetry).toBe(true);
    const retry = vi.spyOn(repo, "retryDocumentProcessing"); await s.controller.retry(); expect(retry.mock.calls[0][3]).toBe("ocr");
    await s.controller.check(); expect(s.onComplete).toHaveBeenCalledTimes(1);
  });
  it("문서/회사 권한 거절과 계정 저장소를 격리한다", async () => {
    const denied = createMockCompanyRepository(mockRuntime(undefined, { company: "documents-denied" }));
    await expect(denied.createDocumentVersion(access, doc, current, file(), "key")).rejects.toMatchObject({ status: 404 });
    const s = setup(); await s.repo.createDocumentVersion(access, doc, current, file(), "key");
    const other = { ...access, getAccountKey: () => "2" }; expect((await s.repo.getCompanyDocumentVersions(other, doc)).find(v => v.current)?.versionId).toBe(current);
  });
  it("손상된 새 재시도 기한은 회사 공간만 초기화하고 다른 키를 보존한다", async () => {
    const storage = memoryStorage(); const runtime = mockRuntime(storage, { company: "documents" }); const repo = createMockCompanyRepository(runtime);
    const candidate = await repo.createDocumentVersion(access, doc, current, file(), "key");
    const namespace = runtime.store.key("1", "company"); const saved = JSON.parse(storage.getItem(namespace)!);
    saved.documents[doc].versions[candidate.versionId].retryUntil = "damaged"; storage.setItem(namespace, JSON.stringify(saved)); storage.setItem("synthetic-unrelated", "keep");
    expect((await repo.getCompanyDocumentVersions(access, doc)).some(v => v.versionId === candidate.versionId)).toBe(false); expect(storage.getItem("synthetic-unrelated")).toBe("keep");
  });
});

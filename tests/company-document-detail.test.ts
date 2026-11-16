import { afterEach, describe, expect, it, vi } from "vitest";
import { createHttpCompanyRepository } from "@/data/company/http-repository";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { mapDocumentHistory, readDocumentOriginal } from "@/data/company/document-detail-api";
import { documentBoxFixtures } from "@/data/company/document-box-mock";
import { syntheticDocumentBlob } from "@/data/company/document-detail-mock";
import type { DocumentHistoryVersion } from "@/data/company/contracts";
import { createHttpClient } from "@/data/shared/http";
import { ApiError } from "@/data/shared/errors";
import { memoryStorage } from "@/data/mock/store";
import { canReadDocumentOriginal, documentDetailPath, documentListPage, documentListPath, documentVersionLabel, downloadFilename, loadDocumentDetail } from "@/features/company/document-detail";
import { createDocumentOriginalController, type OriginalState } from "@/features/company/document-original";
import { access, authentication, mockRuntime, ok, testNow } from "./helpers";

const fixture = documentBoxFixtures(testNow)[10];
const selected = Object.values(fixture.box.versions).find(item => item.current)!;
const version: DocumentHistoryVersion = { ...selected, contentType: "application/pdf", sizeBytes: 4, pageCount: null, uploaderDisplayName: null };
const old: DocumentHistoryVersion = { ...version, versionId: "40000000-0000-4000-8000-000000000011", versionNumber: 1, current: false, status: "REPLACED" };
const documentId = fixture.documentId;
const signal = () => new AbortController().signal;
const descriptor = (expiresAt = new Date(testNow + 120_000).toISOString(), url = "https://synthetic-storage.test/original?synthetic-signature=redacted") => ({ url, expiresAt });
const bytes = () => new Response("%PDF", { headers: { "Content-Type": "application/pdf", "Content-Length": "4" } });

describe("상세 metadata 계약과 exact 버전 선택", () => {
  it("필요 필드만 매핑하고 서버 번호 내림차순·nullable 표시명을 보존한다", () => {
    const result = mapDocumentHistory([{ ...old, uploaderAccountId: 99, extractedFields: { private: true } }, { ...version, uploaderDisplayName: "가상 업로더", pageCount: 2 }]);
    expect(result).toEqual([{ ...version, uploaderDisplayName: "가상 업로더", pageCount: 2 }, old]);
    expect(result[0]).not.toHaveProperty("uploaderAccountId"); expect(result[1]).not.toHaveProperty("extractedFields");
    expect(mapDocumentHistory([{ ...version, pageCount: undefined, uploaderDisplayName: undefined }])[0]).toMatchObject({ pageCount: null, uploaderDisplayName: null });
  });
  it.each([null, [], [{ ...version, sizeBytes: 0 }], [{ ...version, sizeBytes: 1.1 }], [{ ...version, contentType: null }],
    [{ ...version, pageCount: -1 }], [{ ...version, uploaderDisplayName: 1 }], [version, { ...old, versionNumber: version.versionNumber }]])("손상 metadata를 성공/빈 이력으로 만들지 않는다 %#", value => {
    expect(() => mapDocumentHistory(value)).toThrow(ApiError);
  });
  it("명시 과거 versionId를 보존하고 없는 버전은 current로 대체하지 않는다", async () => {
    const repo = { getCompanyDocumentHistory: vi.fn(async () => [version, old]) };
    expect((await loadDocumentDetail(access, documentId, old.versionId, signal(), undefined, repo)).selected).toEqual(old);
    expect((await loadDocumentDetail(access, documentId, null, signal(), undefined, repo)).selected).toEqual(version);
    await expect(loadDocumentDetail(access, documentId, "99999999-0000-4000-8000-000000000001", signal(), undefined, repo)).rejects.toMatchObject({ status: 404 });
  });
  it("current가 없는 후보는 후보 그대로 표시하고 최대 번호로 current를 만들지 않는다", async () => {
    const candidate = { ...version, current: false, status: "OCR_PROCESSING" as const };
    const result = await loadDocumentDetail(access, documentId, null, signal(), undefined, { getCompanyDocumentHistory: async () => [candidate, old] });
    expect(result.selected).toEqual(candidate); expect(documentVersionLabel(candidate)).toBe("교체 후보"); expect(documentVersionLabel(old)).toBe("이전 버전");
  });
  it("metadata GET만 호출하고 처리/추출값·목록 권한을 추가 요구하지 않는다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok([version, old]));
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
    expect(await repo.getCompanyDocumentHistory(access, documentId)).toEqual([version, old]);
    expect(fetcher).toHaveBeenCalledTimes(1); expect(fetcher.mock.calls[0][0]).toBe(`https://synthetic-api.test/api/v1/company-documents/${documentId}/versions`);
  });
  it("잘못된 ID와 계정/회사 scope·Abort 뒤 응답을 거부한다", async () => {
    const query = vi.fn(async () => [version]);
    await expect(loadDocumentDetail(access, "../bad", null, signal(), undefined, { getCompanyDocumentHistory: query })).rejects.toMatchObject({ status: 400 });
    expect(query).not.toHaveBeenCalled();
    let account = "1";
    await expect(loadDocumentDetail({ ...access, getAccountKey: () => account }, documentId, null, signal(), undefined,
      { getCompanyDocumentHistory: async () => { account = "2"; return [version]; } })).rejects.toMatchObject({ code: "ACCOUNT_CHANGED" });
    let current = true;
    await expect(loadDocumentDetail(access, documentId, null, signal(), () => current,
      { getCompanyDocumentHistory: async () => { current = false; return [version]; } })).rejects.toMatchObject({ code: "ACCOUNT_CHANGED" });
    const aborted = new AbortController(); aborted.abort();
    await expect(loadDocumentDetail(access, documentId, null, aborted.signal, undefined, { getCompanyDocumentHistory: query })).rejects.toMatchObject({ name: "AbortError" });
  });
  it("목록 page 복귀와 문서/버전 경로를 제한한다", () => {
    expect(documentListPage("2")).toBe(2); expect(documentListPath(2)).toBe("/my/documents?page=2");
    for (const page of [undefined, "0", "-1", "1.5", "9007199254740991", ["2", "3"]]) expect(documentListPage(page)).toBe(1);
    expect(documentDetailPath(documentId, old.versionId, 2)).toBe(`/my/documents/${documentId}?version=${old.versionId}&page=2`);
    expect(downloadFilename("../unsafe\nname.pdf")).toBe(".._unsafe_name.pdf");
  });
});

describe("접근 티켓/원본 HTTP 경계", () => {
  afterEach(() => vi.useRealTimers());
  it.each(["PREVIEW", "DOWNLOAD"] as const)("%s는 exact version의 티켓·무인증/비저장 GET만 수행하고 URL을 반환하지 않는다", async purpose => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok(descriptor())).mockResolvedValueOnce(bytes());
    const result = await readDocumentOriginal(createHttpClient("https://synthetic-api.test", fetcher), access, documentId, old.versionId, purpose, signal(), () => testNow);
    expect(await result.blob.text()).toBe("%PDF"); expect(result).not.toHaveProperty("url");
    expect(fetcher.mock.calls[0][0]).toBe(`https://synthetic-api.test/api/v1/company-documents/${documentId}/versions/${old.versionId}/access-tickets`);
    expect(fetcher.mock.calls[0][1]).toMatchObject({ method: "POST", body: JSON.stringify({ purpose }), credentials: "include", cache: "no-store" });
    expect(fetcher.mock.calls[1][1]).toMatchObject({ method: "GET", credentials: "omit", cache: "no-store", referrerPolicy: "no-referrer", redirect: "error" });
    expect(fetcher.mock.calls[1][1]?.headers).toBeUndefined();
  });
  it.each([descriptor(new Date(testNow).toISOString()), descriptor("bad"), descriptor(new Date(testNow + 300_000).toISOString()),
    descriptor(undefined, "javascript:alert(1)"), descriptor(undefined, "https://user:pass@synthetic.test/file"), descriptor(undefined, "http://unsafe.test/file"),
    descriptor(undefined, "https://synthetic.test/file#secret"), { expiresAt: new Date(testNow + 1000).toISOString() }])("불가/만료/손상 티켓은 storage 요청 전에 거부한다 %#", async value => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok(value));
    await expect(readDocumentOriginal(createHttpClient("https://synthetic-api.test", fetcher), access, documentId, old.versionId, "PREVIEW", signal(), () => testNow)).rejects.toBeInstanceOf(ApiError);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it.each([401, 403, 404, 409, 503])("티켓 오류 %i는 storage GET/자동 재발급·fallback으로 이어지지 않는다", async status => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok(null, status));
    const port = { ...access, refresh: async () => null };
    await expect(readDocumentOriginal(createHttpClient("https://synthetic-api.test", fetcher), port, documentId, version.versionId, "DOWNLOAD", signal(), () => testNow)).rejects.toMatchObject({ status });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it.each([new Response("denied", { status: 403 }), new Response("<script/>", { headers: { "Content-Type": "text/html" } }),
    new Response("", { headers: { "Content-Type": "application/pdf" } }), new Response("short", { headers: { "Content-Type": "application/pdf", "Content-Length": "100" } }),
    new Response("large", { headers: { "Content-Type": "application/pdf", "Content-Length": String(10 * 1024 * 1024 + 1) } })])("원본 실패/불가 MIME/빈·손상·초과 전송은 사용자 오류로 유지한다 %#", async response => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok(descriptor())).mockResolvedValueOnce(response);
    await expect(readDocumentOriginal(createHttpClient("https://synthetic-api.test", fetcher), access, documentId, version.versionId, "PREVIEW", signal(), () => testNow)).rejects.toBeInstanceOf(ApiError);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it("stream 중 상한/연결 실패와 서명 포함 오류문을 안전하게 처리한다", async () => {
    for (const response of [new Response(new Uint8Array(10 * 1024 * 1024 + 1), { headers: { "Content-Type": "application/pdf" } }),
      new Response(new ReadableStream({ start(controller) { controller.error(new Error(descriptor().url)); } }), { headers: { "Content-Type": "application/pdf" } })]) {
      const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok(descriptor())).mockResolvedValueOnce(response);
      const promise = readDocumentOriginal(createHttpClient("https://synthetic-api.test", fetcher), access, documentId, version.versionId, "PREVIEW", signal(), () => testNow);
      await expect(promise).rejects.toBeInstanceOf(ApiError); await expect(promise).rejects.not.toThrow("synthetic-signature");
    }
  });
  it("티켓 뒤 계정/Abort 변경과 전송 중 만료는 원본을 반영하지 않는다", async () => {
    let account = "1";
    const fetcher = vi.fn<typeof fetch>().mockImplementationOnce(async () => { account = "2"; return ok(descriptor()); });
    await expect(readDocumentOriginal(createHttpClient("https://synthetic-api.test", fetcher), { ...access, getAccountKey: () => account }, documentId, version.versionId, "PREVIEW", signal(), () => testNow)).rejects.toMatchObject({ status: 401 });
    expect(fetcher).toHaveBeenCalledTimes(1);
    let now = testNow;
    const late = vi.fn<typeof fetch>().mockResolvedValueOnce(ok(descriptor())).mockImplementationOnce(async () => { now += 120_000; return bytes(); });
    await expect(readDocumentOriginal(createHttpClient("https://synthetic-api.test", late), access, documentId, version.versionId, "DOWNLOAD", signal(), () => now)).rejects.toMatchObject({ status: 410 });
    const aborted = new AbortController(); aborted.abort();
    await expect(readDocumentOriginal(createHttpClient("https://synthetic-api.test", fetcher), access, documentId, version.versionId, "PREVIEW", aborted.signal)).rejects.toMatchObject({ name: "AbortError" });
  });
  it("원본 GET이 멈춰도 티켓 만료에 중단하고 재발급하지 않는다", async () => {
    vi.useFakeTimers(); vi.setSystemTime(testNow);
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok(descriptor())).mockImplementationOnce(async (_url, init) => {
      return new Promise((_resolve, reject) => init?.signal?.addEventListener("abort", () => reject(init.signal?.reason), { once: true }));
    });
    const pending = readDocumentOriginal(createHttpClient("https://synthetic-api.test", fetcher), access, documentId, version.versionId, "PREVIEW", signal());
    const assertion = expect(pending).rejects.toMatchObject({ status: 410 });
    await vi.advanceTimersByTimeAsync(120_000); await assertion;
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});

describe("원본 표시·다운로드의 화면 수명", () => {
  afterEach(() => vi.useRealTimers());
  function setup(read = vi.fn(async () => ({ blob: new Blob(["synthetic"]), expiresAt: new Date(testNow + 120_000).toISOString() }))) {
    let current = true;
    const states: OriginalState[] = [];
    const ports = { read, isCurrent: () => current, createUrl: vi.fn(() => "blob:synthetic"), revokeUrl: vi.fn(), download: vi.fn(), onChange: (value: OriginalState) => states.push(value), now: () => Date.now() };
    const controller = createDocumentOriginalController(ports);
    return { ports, controller, states, leave: () => { current = false; } };
  }
  it("중복 요청을 억제하고 선택/화면 종료의 늦은 원본·다운로드를 버린다", async () => {
    vi.useFakeTimers(); vi.setSystemTime(testNow);
    let resolve!: (value: { blob: Blob; expiresAt: string }) => void;
    const read = vi.fn(() => new Promise<{ blob: Blob; expiresAt: string }>(done => { resolve = done; }));
    const { ports, controller } = setup(read);
    const pending = controller.request("DOWNLOAD"); await controller.request("DOWNLOAD"); expect(read).toHaveBeenCalledTimes(1);
    controller.dispose(); resolve({ blob: new Blob(["late"]), expiresAt: descriptor().expiresAt }); await pending;
    expect(ports.createUrl).not.toHaveBeenCalled(); expect(ports.download).not.toHaveBeenCalled();
    expect(read.mock.calls[0]).toBeDefined();
  });
  it("2분 만료·복귀 시 blob URL을 해제하고 자동 티켓 요청은 없다", async () => {
    vi.useFakeTimers(); vi.setSystemTime(testNow);
    const { ports, controller, states } = setup(); await controller.request("PREVIEW");
    expect(states.at(-1)).toEqual({ status: "ready", url: "blob:synthetic" });
    await vi.advanceTimersByTimeAsync(120_000);
    expect(ports.revokeUrl).toHaveBeenCalledWith("blob:synthetic"); expect(states.at(-1)).toEqual({ status: "expired" }); expect(ports.read).toHaveBeenCalledTimes(1);
    controller.dispose();
  });
  it("계정/회사 scope 상실과 StrictMode cleanup 뒤 재마운트를 처리한다", async () => {
    vi.useFakeTimers(); vi.setSystemTime(testNow);
    const { ports, controller, leave, states } = setup(); controller.dispose(); controller.activate(); await controller.request("PREVIEW");
    expect(ports.createUrl).toHaveBeenCalledOnce(); leave(); controller.checkExpiry();
    expect(ports.revokeUrl).toHaveBeenCalledOnce(); expect(states.at(-1)).toEqual({ status: "idle" }); controller.dispose();
  });
  it.each([401, 403, 404, 409, 410, 503])("원본 오류 %i는 안전한 안내이며 자동 재시도/완료/서명 노출이 없다", async status => {
    vi.useFakeTimers(); vi.setSystemTime(testNow);
    const read = vi.fn(async (): Promise<{ blob: Blob; expiresAt: string }> => { throw new ApiError(status, null, descriptor().url); });
    const { ports, controller, states } = setup(read); await controller.request("DOWNLOAD");
    expect(states.at(-1)).toMatchObject({ status: "error", statusCode: status }); expect(JSON.stringify(states)).not.toContain("synthetic-signature");
    expect(ports.download).not.toHaveBeenCalled(); expect(read).toHaveBeenCalledOnce(); controller.dispose();
  });
});

describe("mock 이력·원본과 기존 회사 공간", () => {
  it("현재/REPLACED와 합성 PDF·PNG만 생성하고 원본/티켓을 storage에 쓰지 않는다", async () => {
    const storage = memoryStorage(); const runtime = mockRuntime(storage, { company: "documents" });
    const repo = createMockCompanyRepository(runtime);
    const history = await repo.getCompanyDocumentHistory(access, documentId);
    expect(history.map(item => [item.versionNumber, item.current, item.status])).toEqual([[2, true, "VERIFIED"], [1, false, "REPLACED"]]);
    const before = storage.getItem(runtime.store.key("1", "company"));
    const result = await repo.readCompanyDocumentOriginal(access, documentId, old.versionId, "DOWNLOAD");
    expect(await result.blob.text()).toContain("Version 1"); expect(result.blob.type).toBe("application/pdf");
    expect(storage.getItem(runtime.store.key("1", "company"))).toBe(before);
    const imageId = documentBoxFixtures(testNow)[11].documentId;
    const image = (await repo.getCompanyDocumentHistory(access, imageId))[0];
    expect((await repo.readCompanyDocumentOriginal(access, imageId, image.versionId, "PREVIEW")).blob.type).toBe("image/png");
    expect(syntheticDocumentBlob(1).size).toBeGreaterThan(100);
  });
  it("metadata 소속과 원본 관리 권한·허용6상태/선택 version을 구분한다", async () => {
    const denied = createMockCompanyRepository(mockRuntime(undefined, { company: "documents-denied" }));
    expect(await denied.getCompanyDocumentHistory(access, documentId)).toHaveLength(2);
    await expect(denied.readCompanyDocumentOriginal(access, documentId, version.versionId, "PREVIEW")).rejects.toMatchObject({ status: 404 });
    const repo = createMockCompanyRepository(mockRuntime(undefined, { company: "documents" }));
    const candidate = documentBoxFixtures(testNow)[1];
    await expect(repo.readCompanyDocumentOriginal(access, candidate.documentId, candidate.displayedVersionId, "PREVIEW")).rejects.toMatchObject({ status: 409 });
    await expect(repo.readCompanyDocumentOriginal({ ...access, getAccountKey: () => "2" }, documentId, version.versionId, "DOWNLOAD")).resolves.toHaveProperty("blob");
    const empty = createMockCompanyRepository(mockRuntime());
    await expect(empty.getCompanyDocumentHistory({ ...access, getAccountKey: () => "2" }, documentId)).rejects.toMatchObject({ status: 404 });
    expect(canReadDocumentOriginal(version)).toBe(true); expect(canReadDocumentOriginal({ ...version, status: "OCR_PROCESSING" })).toBe(false);
    expect(canReadDocumentOriginal({ ...version, contentType: "text/html" })).toBe(false);
  });
  it("API auth+company mock은 인증 토큰/refresh를 요청하지 않는다", async () => {
    const repo = createMockCompanyRepository({ ...mockRuntime(undefined, { company: "documents" }), authSource: "api" });
    const port = { ...access, getAccessToken: vi.fn(), refresh: vi.fn(async () => authentication()) };
    await repo.getCompanyDocumentHistory(port, documentId); await repo.readCompanyDocumentOriginal(port, documentId, version.versionId, "PREVIEW");
    expect(port.getAccessToken).not.toHaveBeenCalled(); expect(port.refresh).not.toHaveBeenCalled();
  });
});

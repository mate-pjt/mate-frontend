import { describe, expect, it, vi } from "vitest";
import { createDocumentDeletionController, type DeletionView } from "@/features/company/document-deletion";
import { ApiError } from "@/data/shared/errors";
import { documentBoxFixtures } from "@/data/company/document-box-mock";
import { access, testNow } from "./helpers";

const fixture = documentBoxFixtures(testNow)[10];
const documentId = fixture.documentId;
const deletion = { deletedAt: new Date(testNow).toISOString(), purgeAt: new Date(testNow + 30 * 86_400_000).toISOString() };
const empty = () => ({ content: [], page: 0, size: 20, totalElements: 0, totalPages: 0 });
function setup() {
  let account: string | null = "1"; let current = true;
  const changes: DeletionView[] = [];
  const repo = { getDocumentBoxContext: vi.fn(async () => ({ companyId: 7001 as number | null })),
    getCompanyDocumentVersions: vi.fn(async () => Object.values(fixture.box.versions)),
    deleteCompanyDocument: vi.fn(async () => deletion), listCompanyDocuments: vi.fn(async () => empty()) };
  const committed = vi.fn(); const complete = vi.fn();
  const controller = createDocumentDeletionController({ documentId, listPage: 1, access: { ...access, getAccountKey: () => account },
    isCurrent: () => current, repository: repo, onChange: view => changes.push(view), onCommitted: committed, onComplete: complete });
  return { controller, repo, committed, complete, changes, account: (value: string | null) => { account = value; }, current: (value: boolean) => { current = value; } };
}
function deferred<T>() { let resolve!: (value: T) => void; const promise = new Promise<T>(res => { resolve = res; }); return { promise, resolve }; }

describe("삭제 확인·명시 명령·완료의 수명", () => {
  it("확인/취소는 DELETE0건이며 새 확인 전 제출할 수 없다", async () => {
    const s = setup(); await s.controller.submit(); await s.controller.load(); s.controller.dispose(); await s.controller.submit();
    expect(s.repo.deleteCompanyDocument).not.toHaveBeenCalled(); expect(s.committed).not.toHaveBeenCalled();
    expect(s.controller.hasSubmitted()).toBe(false);
  });
  it("중복 클릭/완료 replay는 명령과 완료/Toast를 각각1회로 제한한다", async () => {
    const s = setup(); await s.controller.load();
    await Promise.all([s.controller.submit(), s.controller.submit()]); await s.controller.submit();
    expect(s.repo.deleteCompanyDocument).toHaveBeenCalledTimes(1); expect(s.committed).toHaveBeenCalledExactlyOnceWith(deletion); expect(s.complete).toHaveBeenCalledExactlyOnceWith(1);
    expect(s.controller.hasSubmitted()).toBe(true);
    expect(s.changes.findIndex(x => x.phase === "refreshing")).toBeGreaterThan(s.changes.findIndex(x => x.phase === "deleting"));
  });
  it.each([0, 200, 401, 403, 404, 408, 409, 503])("미확정/실패 %i는 자동 재삭제/완료하지 않고 명시 GET만 허용한다", async status => {
    const s = setup(); s.repo.deleteCompanyDocument.mockRejectedValue(new ApiError(status, "SYNTHETIC", "excluded server text"));
    await s.controller.load(); await s.controller.submit(); await s.controller.submit();
    expect(s.controller.getView()).toMatchObject({ phase: "uncertain", deletion: null, statusCode: status });
    expect(s.committed).not.toHaveBeenCalled(); expect(s.complete).not.toHaveBeenCalled();
    await s.controller.load(); await s.controller.submit();
    expect(s.repo.deleteCompanyDocument).toHaveBeenCalledTimes(1); expect(s.repo.listCompanyDocuments).not.toHaveBeenCalled();
    expect(s.controller.getView().phase).toBe("uncertain");
    expect(s.controller.getView().message).not.toContain("excluded server text");
  });
  it.each([0, 401, 403, 404, 503])("성공 뒤 목록 오류 %i는 확인된 완료를 보존하고 GET만 다시 한다", async status => {
    const s = setup(); s.repo.listCompanyDocuments.mockRejectedValueOnce(new ApiError(status, "SYNTHETIC", "excluded"));
    await s.controller.load(); await s.controller.submit();
    expect(s.committed).toHaveBeenCalledExactlyOnceWith(deletion); expect(s.complete).not.toHaveBeenCalled();
    expect(s.controller.getView()).toMatchObject({ phase: "refresh-error", statusCode: status, deletion });
    await s.controller.load();
    expect(s.repo.deleteCompanyDocument).toHaveBeenCalledTimes(1); expect(s.committed).toHaveBeenCalledTimes(1); expect(s.complete).toHaveBeenCalledTimes(1);
  });
  it.each(["account", "epoch", "dispose"])("삭제 응답 도착 전 %s 변경은 늦은 성공/조회/Toast를 버린다", async kind => {
    const s = setup(); const pending = deferred<typeof deletion>();
    s.repo.deleteCompanyDocument.mockReturnValue(pending.promise); await s.controller.load(); const task = s.controller.submit();
    await vi.waitFor(() => expect(s.repo.deleteCompanyDocument).toHaveBeenCalledTimes(1));
    if (kind === "account") s.account("2"); else if (kind === "epoch") s.current(false); else s.controller.dispose();
    pending.resolve(deletion); await task;
    expect(s.committed).not.toHaveBeenCalled(); expect(s.complete).not.toHaveBeenCalled(); expect(s.repo.listCompanyDocuments).not.toHaveBeenCalled();
  });
  it("제출 직전 회사 변경은 DELETE를 막고 명시 오류로 남긴다", async () => {
    const s = setup(); await s.controller.load(); s.repo.getDocumentBoxContext.mockResolvedValue({ companyId: 7002 });
    await s.controller.submit(); expect(s.repo.deleteCompanyDocument).not.toHaveBeenCalled(); expect(s.controller.getView().statusCode).toBe(403);
  });
  it("삭제 뒤 오래된 목록은 상세를 부활시키거나 완료를 재생하지 않는다", async () => {
    const s = setup();
    const version = Object.values(fixture.box.versions)[0];
    s.repo.listCompanyDocuments.mockResolvedValue({ ...empty(), content: [{ ...version, documentId, documentType: "BUSINESS_REGISTRATION" }] } as ReturnType<typeof empty>);
    await s.controller.load(); await s.controller.submit();
    expect(s.controller.getView()).toMatchObject({ phase: "refresh-error", deletion }); expect(s.committed).toHaveBeenCalledTimes(1); expect(s.complete).not.toHaveBeenCalled();
  });
  it("마지막 page 삭제 뒤 유효한 page로 복귀한다", async () => {
    const s = setup(); const complete = vi.fn();
    const controller = createDocumentDeletionController({ documentId, listPage: 2, access, isCurrent: () => true, repository: s.repo, onChange: vi.fn(), onCommitted: vi.fn(), onComplete: complete });
    s.repo.listCompanyDocuments.mockResolvedValue({ ...empty(), page: 1, totalPages: 1, totalElements: 20 });
    await controller.load(); await controller.submit(); expect(complete).toHaveBeenCalledWith(1);
  });
  it("확인된 삭제 후 최종 세션 해제는 성공을 취소하거나 이전 계정 후속 조회를 재생하지 않는다", async () => {
    const s = setup(); s.repo.listCompanyDocuments.mockImplementation(async () => { s.account(null); throw new ApiError(401, "SESSION_INVALID", "synthetic"); });
    await s.controller.load(); await s.controller.submit();
    expect(s.committed).toHaveBeenCalledExactlyOnceWith(deletion); expect(s.complete).not.toHaveBeenCalled();
    await s.controller.submit(); expect(s.repo.deleteCompanyDocument).toHaveBeenCalledTimes(1);
  });
  it("회사 공급원의 문맥을 사용하며 인증 응답의 nullable 회사와 혼동하지 않는다", async () => {
    const s = setup(); await s.controller.load(); await s.controller.submit();
    expect(s.repo.listCompanyDocuments).toHaveBeenCalledWith(expect.anything(), 7001, 0, 20, expect.any(AbortSignal));
  });
  it("미귀속 owner 문서는 회사 목록을 추측하지 않고 확인된 삭제로 끝낸다", async () => {
    const s = setup(); s.repo.getDocumentBoxContext.mockResolvedValue({ companyId: null });
    await s.controller.load(); await s.controller.submit();
    expect(s.committed).toHaveBeenCalledTimes(1); expect(s.complete).toHaveBeenCalledWith(1); expect(s.repo.listCompanyDocuments).not.toHaveBeenCalled();
  });
});

import { deleteCompanyDocument, getCompanyDocumentVersions, getDocumentBoxContext, listCompanyDocuments,
  type CompanyDocumentRepository, type DocumentDeletion } from "@/data/company/client";
import { ApiError } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";
import { isDocumentId } from "./document-detail";

type Repository = Pick<CompanyDocumentRepository, "deleteCompanyDocument" | "getDocumentBoxContext" | "getCompanyDocumentVersions" | "listCompanyDocuments">;
const repository: Repository = { deleteCompanyDocument, getDocumentBoxContext, getCompanyDocumentVersions, listCompanyDocuments };
export type DeletionView = {
  phase: "loading" | "confirm" | "deleting" | "uncertain" | "error" | "refreshing" | "refresh-error" | "done";
  message: string;
  statusCode?: number;
  deletion: DocumentDeletion | null;
};

export function createDocumentDeletionController(options: {
  documentId: string; listPage: number; access: AuthAccess; isCurrent: () => boolean;
  onChange: (view: DeletionView) => void; onCommitted: (result: DocumentDeletion) => void; onComplete: (listPage: number) => void;
  repository?: Repository;
}) {
  const repo = options.repository ?? repository;
  const account = options.access.getAccountKey();
  let active = true; let abort = new AbortController(); let busy = false; let generation = 0; let submitted = false;
  let deletion: DocumentDeletion | null = null;
  let companyId: number | null | undefined;
  let view: DeletionView = { phase: "loading", message: "삭제할 서류를 확인하고 있어요.", deletion };
  function check(signal: AbortSignal) {
    signal.throwIfAborted();
    if (!active || !account || account !== options.access.getAccountKey() || !options.isCurrent()) throw new DOMException("서류 화면이 변경됐어요.", "AbortError");
  }
  function emit(phase: DeletionView["phase"], message: string, statusCode?: number) {
    check(abort.signal); view = { phase, message, statusCode, deletion }; options.onChange(view);
  }
  async function context(signal: AbortSignal) {
    check(signal);
    const context = await repo.getDocumentBoxContext(options.access, signal); check(signal);
    if (context.companyId !== null && (!Number.isSafeInteger(context.companyId) || context.companyId <= 0)
      || companyId !== undefined && context.companyId !== companyId) throw new ApiError(403, "COMPANY_CHANGED", "연결된 회사가 변경됐어요.");
    companyId = context.companyId;
  }
  async function refreshList(signal: AbortSignal) {
    if (companyId == null) { emit("done", "서류를 삭제했어요."); options.onComplete(1); return; }
    const page = await repo.listCompanyDocuments(options.access, companyId, options.listPage - 1, 20, signal); check(signal);
    if (page.content.some(item => item.documentId === options.documentId)) throw new ApiError(0, "DOCUMENT_STILL_LISTED", "목록을 다시 확인해 주세요.");
    emit("done", "서류를 삭제했어요.");
    options.onComplete(Math.max(1, Math.min(options.listPage, page.totalPages)));
  }
  async function run(task: (signal: AbortSignal) => Promise<void>, mutation = false) {
    if (busy || !active || !options.isCurrent() || account !== options.access.getAccountKey()) return;
    busy = true; const id = ++generation; const signal = abort.signal;
    try { check(signal); await task(signal); }
    catch (error) {
      if (signal.aborted || !active || !options.isCurrent() || account !== options.access.getAccountKey()) return;
      const statusCode = error instanceof ApiError ? error.status : 0;
      emit(deletion ? "refresh-error" : mutation ? "uncertain" : "error", deletion
        ? statusCode === 401 ? "서류 삭제는 완료됐어요. 다시 로그인한 뒤 최신 서류함을 확인해 주세요."
          : "서류 삭제는 완료됐지만 최신 서류함을 확인하지 못했어요. 목록만 다시 확인해 주세요."
        : statusCode === 401 ? "로그인이 필요해요. 로그인한 뒤 서류함에서 다시 확인해 주세요."
          : statusCode === 403 || statusCode === 404 ? "서류를 찾지 못했거나 관리할 권한이 없어요. 삭제 완료로 확인된 것은 아니에요."
            : statusCode === 409 ? "서류 상태가 변경됐어요. 현재 상태를 확인한 뒤 다시 진행해 주세요."
              : mutation ? "삭제 결과를 확인하지 못했어요. 현재 상태를 다시 확인해 주세요. 자동으로 다시 삭제하지 않아요."
                : "서류 상태를 확인하지 못했어요. 잠시 뒤 다시 확인해 주세요.", statusCode);
    } finally { if (id === generation) busy = false; }
  }
  return {
    getView: () => view,
    hasSubmitted: () => submitted,
    activate() { active = true; if (abort.signal.aborted) abort = new AbortController(); },
    dispose() { active = false; abort.abort(); generation++; busy = false; },
    load: () => run(async signal => {
      if (!isDocumentId(options.documentId)) throw new ApiError(400, "DOCUMENT_INPUT_INVALID", "서류 주소를 확인해 주세요.");
      emit(deletion ? "refreshing" : "loading", deletion ? "삭제된 서류함 목록을 확인하고 있어요." : "서류 상태를 확인하고 있어요.");
      await context(signal);
      if (deletion) { await refreshList(signal); return; }
      await repo.getCompanyDocumentVersions(options.access, options.documentId, signal); check(signal);
      emit(submitted ? "uncertain" : "confirm", submitted ? "서류가 조회됐어요. 다시 삭제하려면 창을 닫고 서류를 다시 선택해 주세요."
        : "이전 버전을 포함한 서류 전체를 삭제해요. 삭제한 서류는 복원할 수 없어요.");
    }),
    submit: () => {
      if (busy || submitted || view.phase !== "confirm" || !active || !options.isCurrent()) return Promise.resolve();
      submitted = true;
      return run(async signal => {
        emit("deleting", "서류 전체를 삭제하고 있어요. 결과를 확인할 때까지 기다려 주세요.");
        await context(signal);
        const result = await repo.deleteCompanyDocument(options.access, options.documentId, signal); check(signal);
        deletion = result;
        options.onCommitted(result);
        emit("refreshing", "서류 삭제는 완료됐어요. 최신 서류함을 확인하고 있어요.");
        await refreshList(signal);
      }, true);
    },
  };
}

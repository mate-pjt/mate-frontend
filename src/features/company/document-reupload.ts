import { completeDocumentUpload, createDocumentVersion, getCompanyDocumentVersions, getDocumentBoxContext, getDocumentReuploadStatus, retryDocumentProcessing, uploadDocumentFile,
  type CompanyDocumentRepository, type DocumentBoxVersion, type DocumentReuploadStatus, type DocumentUpload } from "@/data/company/client";
import { ApiError } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";
import { isDocumentId } from "./document-detail";

type Repository = Pick<CompanyDocumentRepository, "getDocumentBoxContext" | "getCompanyDocumentVersions" | "getDocumentReuploadStatus" | "createDocumentVersion" | "uploadDocumentFile" | "completeDocumentUpload" | "retryDocumentProcessing">;
const repository: Repository = { getDocumentBoxContext, getCompanyDocumentVersions, getDocumentReuploadStatus, createDocumentVersion, uploadDocumentFile, completeDocumentUpload, retryDocumentProcessing };
const pendingStatuses = ["OCR_PENDING", "OCR_PROCESSING", "OCR_RETRY_WAIT", "OCR_SUCCEEDED", "VERIFICATION_PENDING"];
type Snapshot = { current: DocumentBoxVersion; processing: DocumentReuploadStatus };
export type ReuploadView = {
  phase: "loading" | "ready" | "working" | "processing" | "error" | "done";
  message: string;
  statusCode?: number;
  file: { name: string; size: number } | null;
  canSelect: boolean;
  canSubmit: boolean;
  canRetry: boolean;
  snapshot: Snapshot | null;
};

export function validateReuploadFile(file: Pick<File, "name" | "type" | "size">): string | null {
  const extensions: Record<string, RegExp> = { "application/pdf": /\.pdf$/i, "image/jpeg": /\.jpe?g$/i, "image/png": /\.png$/i };
  if (!extensions[file.type]?.test(file.name)) return "PDF, JPG, PNG 파일을 형식과 확장자에 맞게 선택해 주세요.";
  if (!Number.isSafeInteger(file.size) || file.size < 1 || file.size > 10 * 1024 * 1024) return "파일 크기는 1바이트 이상, 10MB(10,485,760바이트) 이하여야 해요.";
  if (!file.name.trim() || file.name.length > 255) return "파일 이름은 255자 이내로 확인해 주세요.";
  return null;
}

export function createDocumentReuploadController(options: {
  documentId: string; access: AuthAccess; isCurrent: () => boolean; onChange: (view: ReuploadView) => void;
  onComplete: (versionId: string) => void; repository?: Repository; now?: () => number; key?: () => string;
}) {
  const repo = options.repository ?? repository;
  const now = options.now ?? Date.now;
  const key = options.key ?? (() => crypto.randomUUID());
  const account = options.access.getAccountKey();
  let active = true; let abort = new AbortController(); let busy = false; let flight = 0; let companyId: number | null = null;
  let snapshot: Snapshot | null = null;
  let file: File | null = null;
  let attempt: { key: string; baseline: string; upload: DocumentUpload | null; uploaded: boolean } | null = null;
  let retry: { version: string; kind: "ocr" | "verification"; key: string } | null = null;
  let reported = false;
  let completionTarget: string | null = null;
  let view: ReuploadView = { phase: "loading", message: "현재 문서를 확인하고 있어요.", file: null, canSelect: false, canSubmit: false, canRetry: false, snapshot: null };
  function check(signal: AbortSignal) {
    signal.throwIfAborted();
    if (!active || !account || account !== options.access.getAccountKey() || !options.isCurrent()) throw new DOMException("문서 화면이 변경됐어요.", "AbortError");
  }
  function retryAllowed() {
    const p = snapshot?.processing;
    return Boolean(p && !p.current && ["OCR_FAILED", "VERIFICATION_FAILED"].includes(p.status) && p.canRetry && p.retryExpiresAt && Date.parse(p.retryExpiresAt) > now());
  }
  function selectable() {
    const p = snapshot?.processing;
    return Boolean(snapshot && snapshot.current.status === "VERIFIED" && p && (p.current || ["UPLOAD_READY", "OCR_FAILED", "REUPLOAD_REQUIRED", "VERIFICATION_REJECTED"].includes(p.status) || p.status === "VERIFICATION_FAILED" && !retryAllowed()));
  }
  function emit(phase: ReuploadView["phase"], message: string, statusCode?: number) {
    check(abort.signal);
    const available = phase === "ready" || phase === "error" && statusCode !== 401 && statusCode !== 403 && statusCode !== 404 && statusCode !== 409;
    view = { phase, message, statusCode, snapshot, file: file ? { name: file.name, size: file.size } : null,
      canSelect: available && selectable() && !attempt,
      canSubmit: available && Boolean(file) && (selectable() || Boolean(attempt)), canRetry: available && retryAllowed() };
    options.onChange(view);
  }
  async function context(signal: AbortSignal) {
    check(signal);
    const value = await repo.getDocumentBoxContext(options.access, signal); check(signal);
    if (value.companyId === null || companyId !== null && value.companyId !== companyId) throw new ApiError(403, "COMPANY_CHANGED", "연결된 회사가 변경됐어요. 서류함에서 다시 선택해 주세요.");
    companyId = value.companyId;
  }
  async function read(signal: AbortSignal) {
    check(signal);
    const processing = await repo.getDocumentReuploadStatus(options.access, options.documentId, signal); check(signal);
    const versions = await repo.getCompanyDocumentVersions(options.access, options.documentId, signal); check(signal);
    const current = versions.find(version => version.current);
    if (!current || !versions.some(version => version.versionId === processing.versionId)) throw new ApiError(409, "DOCUMENT_CHANGED", "문서가 변경됐어요. 현재 상태를 다시 확인해 주세요.");
    snapshot = { current, processing };
    if (attempt?.upload?.versionId === processing.versionId && processing.status !== "UPLOAD_READY") { file = null; attempt = null; }
    if (completionTarget === processing.versionId && processing.current && processing.status === "VERIFIED" && current.versionId === processing.versionId) {
      const versionId = processing.versionId;
      file = null; attempt = null;
      emit("done", "새 서류가 현재 버전으로 교체됐어요. 회사정보는 변경하지 않았어요.");
      if (!reported) { reported = true; options.onComplete(versionId); }
    } else if (!processing.current && pendingStatuses.includes(processing.status)) {
      emit("processing", "새 서류의 OCR·진위를 확인하고 있어요. 기존 현재 문서는 유지돼요.");
    } else if (processing.status === "COMPANY_CONFIRMATION_REQUIRED") {
      emit("error", "회사정보 확인이 필요한 상태예요. 이 화면에서 회사정보를 반영하지 않아요.", 409);
    } else {
      emit("ready", processing.current ? "현재 문서를 확인했어요. 새 파일을 선택해 주세요."
        : processing.status === "UPLOAD_READY" ? "전송 대기 중인 후보가 있어요. 원래 요청을 이어가거나 세션 만료 후 새 파일로 다시 시도해 주세요."
          : "후보 문서의 처리가 끝나지 못했어요. 재시도 가능 여부를 확인하거나 새 파일을 선택해 주세요.");
    }
  }
  async function run(task: (signal: AbortSignal) => Promise<void>) {
    if (busy || !active || !options.isCurrent() || account !== options.access.getAccountKey()) return;
    busy = true; const ticket = ++flight; const signal = abort.signal;
    try { check(signal); emit("working", "처리 결과를 확인하고 있어요."); await task(signal); }
    catch (error) {
      if (signal.aborted || !active || !options.isCurrent() || account !== options.access.getAccountKey()) return;
      const uploadAddressExpired = error instanceof ApiError && error.code === "UPLOAD_FAILED" && [401, 403, 410].includes(error.status);
      const statusCode = uploadAddressExpired ? 0 : error instanceof ApiError ? error.status : 0;
      if ([401, 403, 404, 409, 410].includes(statusCode)) { file = null; attempt = null; }
      emit("error", statusCode === 401 ? "로그인이 필요해요. 로그인 후 현재 상태를 다시 확인해 주세요."
        : statusCode === 403 || statusCode === 404 ? "서류를 관리할 권한이 없거나 문서를 찾지 못했어요."
          : statusCode === 410 ? "업로드 세션이 만료됐어요. 현재 상태를 확인한 뒤 파일을 다시 선택해 주세요."
            : statusCode === 409 ? "다른 교체 요청이나 문서 변경이 있어요. 현재 상태 확인 후 파일을 다시 선택해 주세요."
            : "처리 결과를 확인하지 못했어요. 현재 상태를 확인하거나 같은 요청을 명시적으로 다시 시도해 주세요.", statusCode);
    } finally { if (ticket === flight) busy = false; }
  }
  return {
    activate() { if (abort.signal.aborted) abort = new AbortController(); active = true; },
    dispose() { active = false; abort.abort(); flight++; busy = false; file = null; attempt = null; retry = null; },
    getView: () => view,
    load: () => run(async signal => { if (!isDocumentId(options.documentId)) throw new ApiError(400, "DOCUMENT_INPUT_INVALID", "서류 주소를 확인해 주세요."); await context(signal); await read(signal); }),
    check: () => run(async signal => { await context(signal); await read(signal); }),
    choose(value: File | null) {
      if (busy || !view.canSelect || !active || !options.isCurrent()) return;
      const error = value && validateReuploadFile(value);
      if (error) { file = null; emit("ready", error, 400); return; }
      file = value; emit("ready", value ? "파일을 선택했어요. 업로드하면 OCR·진위 확인을 시작해요." : "새 파일을 선택해 주세요.");
    },
    submit: () => {
      if (!view.canSubmit || !file) return Promise.resolve();
      return run(async signal => {
        await context(signal);
        if (!snapshot || !file) return;
        attempt ??= { key: key(), baseline: snapshot.current.versionId, upload: null, uploaded: false };
        const request = attempt;
        if (!request.uploaded) {
          request.upload = await repo.createDocumentVersion(options.access, options.documentId, request.baseline, file, request.key, signal); check(signal);
          if (request.upload.documentId !== options.documentId || !isDocumentId(request.upload.versionId) || !request.upload.uploadHandle || request.upload.status !== "UPLOAD_READY") throw new ApiError(0, "DOCUMENT_RESPONSE_INVALID", "업로드 응답을 확인하지 못했어요.");
          if (Date.parse(request.upload.sessionExpiresAt) <= now()) throw new ApiError(410, "UPLOAD_SESSION_EXPIRED", "업로드 세션이 만료됐어요.");
          completionTarget = request.upload.versionId;
          await repo.uploadDocumentFile(options.access, request.upload.uploadHandle, file, signal); check(signal);
          request.uploaded = true;
        }
        if (!request.upload) return;
        await repo.completeDocumentUpload(options.access, options.documentId, request.upload.versionId, signal); check(signal);
        await read(signal);
      });
    },
    retry: () => {
      if (!view.canRetry || !snapshot) return Promise.resolve();
      return run(async signal => {
        await context(signal); await read(signal);
        if (!retryAllowed() || !snapshot) return;
        const p = snapshot.processing;
        const kind = p.status === "OCR_FAILED" ? "ocr" : "verification";
        completionTarget = p.versionId;
        if (retry?.version !== p.versionId || retry.kind !== kind) retry = { version: p.versionId, kind, key: key() };
        await repo.retryDocumentProcessing(options.access, options.documentId, p.versionId, kind, retry.key, signal); check(signal);
        retry = null; await read(signal);
      });
    },
  };
}

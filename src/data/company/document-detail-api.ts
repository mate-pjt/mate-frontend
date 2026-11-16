import type { AuthAccess, HttpClient } from "../shared/http";
import { ApiError } from "../shared/errors";
import type { DocumentAccessPurpose, DocumentHistoryVersion, DocumentOriginal } from "./contracts";
import { mapDocumentBoxVersions, validateDocumentId } from "./document-box-api-mapper";

const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value);
const count = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value > 0;
const contentTypes = ["application/pdf", "image/jpeg", "image/png"];
const maxBytes = 10 * 1024 * 1024;
function invalid(): never { throw new ApiError(0, "DOCUMENT_RESPONSE_INVALID", "서류 정보를 확인하지 못했어요. 다시 조회해 주세요."); }

export function mapDocumentHistory(value: unknown): DocumentHistoryVersion[] {
  const versions = mapDocumentBoxVersions(value);
  const raw = value as Record<string, unknown>[];
  const result = versions.map((version, index) => {
    const item = raw[index];
    if (typeof item.contentType !== "string" || !item.contentType.trim() || !count(item.sizeBytes)
      || !(item.pageCount === null || item.pageCount === undefined || count(item.pageCount))
      || !(item.uploaderDisplayName === null || item.uploaderDisplayName === undefined || typeof item.uploaderDisplayName === "string")) invalid();
    return { ...version, contentType: item.contentType, sizeBytes: item.sizeBytes,
      pageCount: (item.pageCount ?? null) as number | null, uploaderDisplayName: (item.uploaderDisplayName ?? null) as string | null };
  });
  if (new Set(result.map(item => item.versionNumber)).size !== result.length) invalid();
  return result.sort((a, b) => b.versionNumber - a.versionNumber);
}

export function validateDocumentAccess(documentId: string, versionId: string, purpose: DocumentAccessPurpose) {
  validateDocumentId(documentId);
  validateDocumentId(versionId);
  if (purpose !== "PREVIEW" && purpose !== "DOWNLOAD") throw new ApiError(400, "DOCUMENT_INPUT_INVALID", "원본 확인 방식을 선택해 주세요.");
}

function ticket(value: unknown, now: number): { url: string; expiresAt: string } {
  if (!record(value) || typeof value.url !== "string" || typeof value.expiresAt !== "string"
    || !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value.expiresAt)) invalid();
  const expires = Date.parse(value.expiresAt);
  if (!Number.isFinite(expires) || expires > now + 125_000) invalid();
  if (expires <= now) throw new ApiError(410, "DOCUMENT_ACCESS_EXPIRED", "원본 접근 시간이 지났어요. 다시 요청해 주세요.");
  let url: URL;
  try { url = new URL(value.url); } catch { return invalid(); }
  if ((url.protocol !== "https:" && !(url.protocol === "http:" && ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)))
    || url.username || url.password || url.hash) invalid();
  return { url: url.href, expiresAt: value.expiresAt };
}

export async function readDocumentOriginal(http: HttpClient, access: AuthAccess, documentId: string, versionId: string, purpose: DocumentAccessPurpose, signal?: AbortSignal, now = Date.now): Promise<DocumentOriginal> {
  validateDocumentAccess(documentId, versionId, purpose);
  const account = access.getAccountKey();
  let requestSignal = signal;
  const check = () => {
    requestSignal?.throwIfAborted();
    if (!account || account !== access.getAccountKey()) throw new ApiError(401, "ACCOUNT_CHANGED", "로그인 상태가 변경됐어요. 다시 확인해 주세요.");
  };
  check();
  const raw = await http.authorized<unknown>(access, `/api/v1/company-documents/${documentId}/versions/${versionId}/access-tickets`, { method: "POST", body: { purpose }, signal });
  check();
  const descriptor = ticket(raw, now());
  const deadline = new AbortController();
  const timeout = setTimeout(() => deadline.abort(new ApiError(410, "DOCUMENT_ACCESS_EXPIRED", "원본 접근 시간이 지났어요. 다시 요청해 주세요.")), Date.parse(descriptor.expiresAt) - now());
  requestSignal = signal ? AbortSignal.any([signal, deadline.signal]) : deadline.signal;
  try {
    let response: Response;
    try {
      response = await http.fetch(descriptor.url, { method: "GET", credentials: "omit", cache: "no-store", referrerPolicy: "no-referrer", redirect: "error", signal: requestSignal });
    } catch {
      check();
      throw new ApiError(0, "DOCUMENT_ORIGINAL_NETWORK", "원본을 불러오지 못했어요. 연결 상태를 확인한 뒤 다시 요청해 주세요.");
    }
    check();
    if (!response.ok) throw new ApiError(response.status, "DOCUMENT_ORIGINAL_FAILED", response.status === 403 || response.status === 410
      ? "원본 접근이 거절됐거나 시간이 지났어요. 권한을 확인한 뒤 다시 요청해 주세요." : "원본을 불러오지 못했어요. 다시 요청해 주세요.");
    const type = response.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase();
    const length = response.headers.get("Content-Length");
    if (!type || !contentTypes.includes(type) || length !== null && (!count(Number(length)) || Number(length) > maxBytes) || !response.body) {
      await response.body?.cancel();
      invalid();
    }
    const reader = response.body.getReader();
    const chunks: Uint8Array<ArrayBuffer>[] = [];
    let bytes = 0;
    try {
      while (true) {
        const part = await reader.read();
        check();
        if (part.done) break;
        bytes += part.value.byteLength;
        if (bytes > maxBytes) invalid();
        chunks.push(new Uint8Array(part.value));
      }
      if (!bytes || length !== null && bytes !== Number(length)) invalid();
      if (Date.parse(descriptor.expiresAt) <= now()) throw new ApiError(410, "DOCUMENT_ACCESS_EXPIRED", "원본 접근 시간이 지났어요. 다시 요청해 주세요.");
      return { blob: new Blob(chunks, { type }), expiresAt: descriptor.expiresAt };
    } catch (error) {
      check();
      if (error instanceof ApiError) throw error;
      throw new ApiError(0, "DOCUMENT_ORIGINAL_NETWORK", "원본 전송을 완료하지 못했어요. 다시 요청해 주세요.");
    } finally {
      await reader.cancel().catch(() => undefined);
      reader.releaseLock();
    }
  } finally { clearTimeout(timeout); }
}

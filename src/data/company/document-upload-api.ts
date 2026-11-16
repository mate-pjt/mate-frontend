import { ApiError } from "../shared/errors";
import type { DocumentUploadDto } from "./api-types";
import { documentVersionStatuses, type DocumentReuploadStatus } from "./contracts";
import { validateDocumentId } from "./document-box-api-mapper";

const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value);
const timestamp = (value: unknown): value is string => typeof value === "string" && /^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value) && Number.isFinite(Date.parse(value));
function invalid(): never { throw new ApiError(0, "DOCUMENT_RESPONSE_INVALID", "서류 처리 결과를 확인하지 못했어요. 현재 상태를 다시 확인해 주세요."); }

export function mapReuploadStatus(value: unknown, documentId: string): DocumentReuploadStatus {
  if (!record(value) || value.documentId !== documentId || typeof value.versionId !== "string"
    || !documentVersionStatuses.includes(value.status as DocumentReuploadStatus["status"]) || typeof value.current !== "boolean"
    || typeof value.canRetry !== "boolean" || !(value.retryExpiresAt === null || timestamp(value.retryExpiresAt))) invalid();
  try { validateDocumentId(value.versionId); } catch { invalid(); }
  return { documentId, versionId: value.versionId, status: value.status as DocumentReuploadStatus["status"], current: value.current,
    canRetry: value.canRetry, retryExpiresAt: value.retryExpiresAt };
}

export function mapReplacementUpload(value: unknown, documentId: string): DocumentUploadDto {
  if (!record(value) || value.documentId !== documentId || typeof value.versionId !== "string" || !Number.isSafeInteger(value.versionNumber)
    || (value.versionNumber as number) < 1 || value.status !== "UPLOAD_READY" || !timestamp(value.sessionExpiresAt) || !record(value.upload)) invalid();
  try { validateDocumentId(value.versionId); } catch { invalid(); }
  const upload = value.upload;
  if (upload.method !== "PUT" || typeof upload.url !== "string" || !timestamp(upload.expiresAt) || !record(upload.headers)
    || !Object.values(upload.headers).every(header => typeof header === "string") || Date.parse(upload.expiresAt) > Date.parse(value.sessionExpiresAt)) invalid();
  let url: URL;
  try { url = new URL(upload.url); } catch { return invalid(); }
  if ((url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))) || url.username || url.password || url.hash) invalid();
  return { documentId, versionId: value.versionId, versionNumber: value.versionNumber as number, status: value.status,
    sessionExpiresAt: value.sessionExpiresAt, upload: { method: "PUT", url: url.href, headers: upload.headers as Record<string, string>, expiresAt: upload.expiresAt } };
}

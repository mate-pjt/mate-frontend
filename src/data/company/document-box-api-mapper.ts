import { ApiError } from "../shared/errors";
import { documentVersionStatuses, type DocumentBoxItem, type DocumentBoxPage, type DocumentBoxVersion, type DocumentVersionStatus } from "./contracts";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value);
const count = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
const timestamp = (value: unknown): value is string => typeof value === "string" && /^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value) && Number.isFinite(Date.parse(value));
function invalid(): never { throw new ApiError(0, "DOCUMENT_RESPONSE_INVALID", "서류 정보를 확인하지 못했어요. 다시 조회해 주세요."); }

export function validateDocumentBoxQuery(companyId: number, page: number, size: number) {
  if (!Number.isSafeInteger(companyId) || companyId <= 0 || !count(page) || !Number.isSafeInteger(size) || size < 1 || size > 100 || page * size > 2_147_483_647) {
    throw new ApiError(400, "DOCUMENT_INPUT_INVALID", "서류함의 회사와 페이지 정보를 확인해 주세요.");
  }
}

export function validateDocumentId(documentId: string) {
  if (!uuid.test(documentId)) throw new ApiError(400, "DOCUMENT_INPUT_INVALID", "서류 정보를 확인해 주세요.");
}

function version(value: unknown): Omit<DocumentBoxVersion, "validFrom" | "validUntil"> {
  if (!record(value) || typeof value.versionId !== "string" || !uuid.test(value.versionId) || !count(value.versionNumber) || value.versionNumber < 1
    || typeof value.filename !== "string" || !value.filename.trim() || !timestamp(value.uploadedAt) || !timestamp(value.modifiedAt)
    || !documentVersionStatuses.includes(value.status as DocumentVersionStatus) || typeof value.current !== "boolean") invalid();
  return { versionId: value.versionId, versionNumber: value.versionNumber, filename: value.filename, uploadedAt: value.uploadedAt,
    modifiedAt: value.modifiedAt, status: value.status as DocumentVersionStatus, current: value.current };
}

export function mapDocumentBoxPage(value: unknown, page: number, size: number): DocumentBoxPage {
  if (!record(value) || !Array.isArray(value.content) || value.page !== page || value.size !== size || !count(value.totalElements)
    || value.totalPages !== Math.ceil(value.totalElements / size) || value.content.length > size) invalid();
  const expected = Math.max(0, Math.min(size, value.totalElements - page * size));
  if (value.content.length !== expected) invalid();
  const content: DocumentBoxItem[] = value.content.map((item: unknown) => {
    if (!record(item) || typeof item.documentId !== "string" || !uuid.test(item.documentId) || typeof item.documentType !== "string" || !item.documentType.trim()) invalid();
    return { ...version(item), documentId: item.documentId, documentType: item.documentType };
  });
  if (new Set(content.map(item => item.documentId)).size !== content.length) invalid();
  return { content, page, size, totalElements: value.totalElements, totalPages: value.totalPages as number };
}

export function mapDocumentBoxVersions(value: unknown): DocumentBoxVersion[] {
  if (!Array.isArray(value) || value.length === 0) invalid();
  const result = value.map((item: unknown) => {
    if (!record(item)) invalid();
    // Missing dates stay unknown; malformed strings reach the period's explicit error state.
    const date = (field: string): string | null => {
      const raw = item[field];
      if (raw === null || raw === undefined) return null;
      if (typeof raw !== "string") invalid();
      return raw;
    };
    return { ...version(item), validFrom: date("validFrom"), validUntil: date("validUntil") };
  });
  if (new Set(result.map(item => item.versionId)).size !== result.length || result.filter(item => item.current).length > 1) invalid();
  return result;
}

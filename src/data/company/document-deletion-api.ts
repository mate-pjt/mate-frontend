import type { DocumentDeletion } from "./contracts";
import { ApiError } from "../shared/errors";

export function mapDocumentDeletion(value: unknown): DocumentDeletion {
  const timestamp = (input: unknown): input is string => typeof input === "string"
    && /^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(input) && Number.isFinite(Date.parse(input));
  if (!value || typeof value !== "object" || !("deletedAt" in value) || !("purgeAt" in value)
    || !timestamp(value.deletedAt) || !timestamp(value.purgeAt) || Date.parse(value.purgeAt) <= Date.parse(value.deletedAt)) {
    throw new ApiError(0, "DOCUMENT_DELETION_INVALID", "삭제 결과를 확인하지 못했어요. 현재 상태를 다시 확인해 주세요.");
  }
  return { deletedAt: value.deletedAt, purgeAt: value.purgeAt };
}

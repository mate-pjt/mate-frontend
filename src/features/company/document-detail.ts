import { getCompanyDocumentHistory, type CompanyDocumentRepository, type DocumentHistoryVersion, type DocumentVersionStatus } from "@/data/company/client";
import { ApiError } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isDocumentId = (value: string) => uuid.test(value);
export function documentListPage(value: string | string[] | undefined): number {
  return typeof value === "string" && /^[1-9]\d*$/.test(value) && Number.isSafeInteger(Number(value)) && Number(value) <= 107_374_182 ? Number(value) : 1;
}
export function documentListPath(page: number) { return page > 1 ? `/my/documents?page=${page}` : "/my/documents"; }
export function documentDetailPath(documentId: string, versionId: string, page: number) {
  return `/my/documents/${documentId}?${new URLSearchParams({ version: versionId, page: String(page) })}`;
}

export function canReadDocumentOriginal(version: Pick<DocumentHistoryVersion, "status" | "contentType">): boolean {
  return ["OCR_SUCCEEDED", "VERIFICATION_PENDING", "VERIFICATION_FAILED", "COMPANY_CONFIRMATION_REQUIRED", "VERIFIED", "REPLACED"].includes(version.status)
    && ["application/pdf", "image/jpeg", "image/png"].includes(version.contentType);
}

export async function loadDocumentDetail(access: AuthAccess, documentId: string, versionId: string | null, signal: AbortSignal,
  isCurrent = () => true, repository: Pick<CompanyDocumentRepository, "getCompanyDocumentHistory"> = { getCompanyDocumentHistory }) {
  if (!isDocumentId(documentId) || versionId !== null && !isDocumentId(versionId)) throw new ApiError(400, "DOCUMENT_INPUT_INVALID", "서류 주소를 확인해 주세요.");
  const account = access.getAccountKey();
  function check() {
    signal.throwIfAborted();
    if (!account || account !== access.getAccountKey() || !isCurrent()) throw new ApiError(401, "ACCOUNT_CHANGED", "로그인 상태가 변경됐어요. 다시 확인해 주세요.");
  }
  check();
  const versions = await repository.getCompanyDocumentHistory(access, documentId, signal);
  check();
  const selected = versionId === null ? versions.find(item => item.current) ?? versions[0] : versions.find(item => item.versionId === versionId);
  if (!selected) throw new ApiError(404, "DOCUMENT_VERSION_MISSING", "선택한 버전을 찾지 못했어요. 서류함에서 다시 선택해 주세요.");
  return { versions, selected };
}

export function documentVersionLabel(version: { current: boolean; status: DocumentVersionStatus }) {
  return version.current ? "현재" : version.status === "REPLACED" ? "이전 버전" : "교체 후보";
}

export function documentFileSize(bytes: number) {
  return bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
export function documentTimestamp(value: string) {
  return new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value));
}

export function downloadFilename(filename: string) {
  return filename.replace(/[\x00-\x1f\x7f/\\]/g, "_").slice(0, 255) || "회사 서류";
}

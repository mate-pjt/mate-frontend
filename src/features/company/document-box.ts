import { getCompanyDocumentVersions, getDocumentBoxContext, listCompanyDocuments, type CompanyDocumentRepository, type DocumentBoxItem, type DocumentBoxPage, type DocumentBoxVersion, type DocumentVersionStatus } from "@/data/company/client";
import { ApiError } from "@/data/shared/errors";
import type { AuthAccess } from "@/data/shared/http";

export type DocumentBoxRow = DocumentBoxItem & {
  versions: { status: "ready"; displayed: DocumentBoxVersion; current: DocumentBoxVersion | null } | { status: "unavailable" };
};
export type DocumentBoxResult = { status: "no-company" } | { status: "ready"; companyId: number; page: Omit<DocumentBoxPage, "content"> & { content: DocumentBoxRow[] } };
type Queries = Pick<CompanyDocumentRepository, "getDocumentBoxContext" | "listCompanyDocuments" | "getCompanyDocumentVersions">;
const queries: Queries = { getDocumentBoxContext, listCompanyDocuments, getCompanyDocumentVersions };

export async function loadDocumentBox(access: AuthAccess, page: number, signal: AbortSignal, repository: Queries = queries, isCurrent = () => true): Promise<DocumentBoxResult> {
  const account = access.getAccountKey();
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal.addEventListener("abort", abort, { once: true });
  function check() {
    signal.throwIfAborted();
    controller.signal.throwIfAborted();
    if (account !== access.getAccountKey() || !isCurrent()) throw new ApiError(401, "ACCOUNT_CHANGED", "로그인 상태가 변경됐어요. 다시 확인해 주세요.");
  }
  try {
    check();
    const { companyId } = await repository.getDocumentBoxContext(access, controller.signal);
    check();
    if (companyId === null) return { status: "no-company" };
    const result = await repository.listCompanyDocuments(access, companyId, page, 20, controller.signal);
    check();
    const content: DocumentBoxRow[] = result.content.map(item => ({ ...item, versions: { status: "unavailable" } }));
    let next = 0;
    await Promise.all(Array.from({ length: Math.min(4, content.length) }, async () => {
      while (next < content.length) {
        check();
        const index = next++;
        const item = content[index];
        try {
          const versions = await repository.getCompanyDocumentVersions(access, item.documentId, controller.signal);
          check();
          const displayed = versions.find(version => version.versionId === item.versionId);
          if (displayed && displayed.current === item.current && displayed.status === item.status) {
            item.versions = { status: "ready", displayed, current: versions.find(version => version.current) ?? null };
          }
        } catch (error) {
          check();
          if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
            controller.abort();
            throw error;
          }
        }
      }
    }));
    check();
    return { status: "ready", companyId, page: { ...result, content } };
  } finally {
    signal.removeEventListener("abort", abort);
    controller.abort();
  }
}

function validDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}

export function koreanDate(now: number): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const part = (name: string) => parts.find(item => item.type === name)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function documentPeriod(version: Pick<DocumentBoxVersion, "validFrom" | "validUntil">, now: number): "미확인" | "기간 확인 필요" | "유효기간 시작 전" | "만료" | "기간 내" {
  const { validFrom, validUntil } = version;
  if ((validFrom !== null && !validDate(validFrom)) || (validUntil !== null && !validDate(validUntil)) || (validFrom !== null && validUntil !== null && validFrom > validUntil)) return "기간 확인 필요";
  const today = koreanDate(now);
  if (validFrom !== null && validFrom > today) return "유효기간 시작 전";
  if (validUntil === null) return "미확인";
  return validUntil < today ? "만료" : "기간 내";
}

const statusLabels: Record<DocumentVersionStatus, string> = {
  UPLOAD_READY: "업로드 대기", OCR_PENDING: "문서 읽기 대기", OCR_PROCESSING: "문서 읽는 중", OCR_RETRY_WAIT: "문서 읽기 재시도 대기",
  OCR_FAILED: "문서 읽기 실패", REUPLOAD_REQUIRED: "재업로드 필요", OCR_SUCCEEDED: "문서 읽기 완료", VERIFICATION_PENDING: "진위 확인 중",
  VERIFICATION_FAILED: "진위 확인 실패", VERIFICATION_REJECTED: "진위 확인 거절", COMPANY_CONFIRMATION_REQUIRED: "회사정보 확인 대기",
  VERIFIED: "문서 검증 완료", REPLACED: "이전 버전", DELETED: "삭제됨", PURGED: "파기됨",
};
export function documentStatusLabel(status: DocumentVersionStatus) { return statusLabels[status]; }

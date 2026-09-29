import { ApiError, apiRequest, authorizedRequest, type AuthAccess } from "./api";
import type {
  BidAmountRange,
  BusinessConnection,
  CompanyRegistrationProposal,
  CompanySearchPage,
  DocumentProcessing,
  DocumentUpload,
  InvitationContext,
  MembershipApplicationContext,
  MembershipRequest,
  RegistrationResult,
} from "./types";

export function searchCompanies(access: AuthAccess, query: string, page = 0): Promise<CompanySearchPage> {
  const params = new URLSearchParams({ query, page: String(page), size: "10" });
  return authorizedRequest(access, `/api/v1/companies/search?${params}`);
}

export function getMembershipContext(access: AuthAccess, companyId: number): Promise<MembershipApplicationContext> {
  return authorizedRequest(access, `/api/v1/companies/${companyId}/membership-application-context`);
}

export function requestMembership(
  access: AuthAccess,
  body: { companyId: number; representative: boolean; positionId: number | null; proposedPositionName: string | null; message: string | null },
): Promise<MembershipRequest> {
  return authorizedRequest(access, "/api/v1/company-membership-requests", { method: "POST", body });
}

export function previewInvitation(token: string): Promise<InvitationContext> {
  return apiRequest("/api/v1/company-membership-invitations/preview", { method: "POST", body: { token } });
}

export function resumeInvitation(access: AuthAccess): Promise<InvitationContext> {
  return authorizedRequest(access, "/api/v1/company-membership-invitations/resume", { method: "POST" });
}

export function acceptInvitation(access: AuthAccess, expectedVersion: number): Promise<{ companyId: number; membershipId: number }> {
  return authorizedRequest(access, "/api/v1/company-membership-invitations/acceptance", { method: "POST", body: { expectedVersion } });
}

export function declineInvitation(access: AuthAccess, expectedVersion: number): Promise<InvitationContext> {
  return authorizedRequest(access, "/api/v1/company-membership-invitations/decline", { method: "POST", body: { expectedVersion } });
}

export function createBusinessConnection(access: AuthAccess, businessNumber: string, idempotencyKey: string): Promise<BusinessConnection> {
  return authorizedRequest(access, "/api/v1/account-business-connections", {
    method: "POST", body: { businessNumber }, idempotencyKey,
  });
}

export function getBusinessConnection(access: AuthAccess): Promise<BusinessConnection> {
  return authorizedRequest(access, "/api/v1/account-business-connections/current");
}

export function clearBusinessConnection(access: AuthAccess): Promise<void> {
  return authorizedRequest(access, "/api/v1/account-business-connections/current", { method: "DELETE", allowEmptyData: true });
}

export function createUnverifiedCompany(
  access: AuthAccess,
  body: { connectionId: string; preferredBidNoticeAmountRange: BidAmountRange | null; representative: boolean; positionName: string | null },
  idempotencyKey: string,
): Promise<RegistrationResult> {
  return authorizedRequest(access, "/api/v1/unverified-company-registrations", { method: "POST", body, idempotencyKey });
}

export async function createDocumentUpload(access: AuthAccess, file: File, idempotencyKey: string): Promise<DocumentUpload> {
  return createDocumentUploadRequest(access, "/api/v1/company-documents", file, idempotencyKey);
}

export async function createDocumentVersion(
  access: AuthAccess,
  documentId: string,
  replacesVersionId: string,
  file: File,
  idempotencyKey: string,
): Promise<DocumentUpload> {
  return createDocumentUploadRequest(access, `/api/v1/company-documents/${documentId}/versions`, file, idempotencyKey, replacesVersionId);
}

async function createDocumentUploadRequest(
  access: AuthAccess,
  path: string,
  file: File,
  idempotencyKey: string,
  replacesVersionId?: string,
): Promise<DocumentUpload> {
  const checksum = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  const sha256 = Array.from(new Uint8Array(checksum), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return authorizedRequest(access, path, {
    method: "POST",
    idempotencyKey,
    body: {
      ...(replacesVersionId ? { replacesVersionId } : { documentType: "BUSINESS_REGISTRATION" }),
      originalFilename: file.name,
      contentType: file.type,
      sizeBytes: file.size,
      sha256,
    },
  });
}

export function retryDocumentProcessing(
  access: AuthAccess,
  documentId: string,
  versionId: string,
  kind: "ocr" | "verification",
  idempotencyKey: string,
): Promise<{ status: string }> {
  const suffix = kind === "ocr" ? "ocr-attempts" : "verification-attempts";
  return authorizedRequest(access, `/api/v1/company-documents/${documentId}/versions/${versionId}/${suffix}`, {
    method: "POST", idempotencyKey,
  });
}

export async function uploadDocumentFile(upload: DocumentUpload["upload"], file: File): Promise<void> {
  if (upload.method.toUpperCase() !== "PUT") throw new ApiError(0, "UPLOAD_METHOD", "지원하지 않는 파일 업로드 방식입니다.");
  let response: Response;
  try {
    response = await fetch(upload.url, { method: "PUT", headers: upload.headers, body: file, credentials: "omit" });
  } catch {
    throw new ApiError(0, "UPLOAD_NETWORK_ERROR", "파일을 업로드하지 못했습니다. 다시 시도해 주세요.");
  }
  if (!response.ok) throw new ApiError(response.status, "UPLOAD_FAILED", "파일 업로드에 실패했습니다. 다시 시도해 주세요.");
}

export function completeDocumentUpload(access: AuthAccess, documentId: string, versionId: string): Promise<{ status: string }> {
  return authorizedRequest(access, `/api/v1/company-documents/${documentId}/versions/${versionId}/upload-completions`, { method: "POST" });
}

export function getDocumentProcessing(access: AuthAccess, documentId: string): Promise<DocumentProcessing> {
  return authorizedRequest(access, `/api/v1/company-documents/${documentId}`);
}

export function getRegistrationProposal(access: AuthAccess, proposalId: string): Promise<CompanyRegistrationProposal> {
  return authorizedRequest(access, `/api/v1/company-registration-proposals/${proposalId}`);
}

export function getIndustries(keyword: string): Promise<Array<{ code: string; name: string }>> {
  const params = new URLSearchParams({ keyword });
  return apiRequest<{ items: Array<{ code: string; name: string }> }>(`/api/v1/industries?${params}`).then((response) => response.items);
}

export function createVerifiedCompany(
  access: AuthAccess,
  body: {
    proposalId: string;
    documentId: string;
    versionId: string;
    revision: number;
    telephoneNumber: string | null;
    primaryIndustryCode: string;
    preferredBidNoticeAmountRange: BidAmountRange | null;
    representative: boolean;
    positionName: string | null;
    conflictChoice: "REUSE_EXISTING" | "CREATE_NEW_VERIFIED" | null;
    businessNumberCorrectionChoice: "CORRECT_CURRENT_UNVERIFIED" | null;
  },
  idempotencyKey: string,
): Promise<RegistrationResult> {
  return authorizedRequest(access, "/api/v1/company-registrations", { method: "POST", body, idempotencyKey });
}

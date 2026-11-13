import { ApiError } from "../shared/errors";
import type { AuthAccess, HttpClient } from "../shared/http";
import type { DocumentUploadDto } from "./api-types";
import type { BidAmountRange, BusinessConnection, CompanyRegistrationProposal, CompanySearchPage, DocumentProcessing, DocumentUpload, InvitationContext, MembershipApplicationContext, MembershipRequest, RegistrationResult, CompanyRepository, MyMembershipRequest, CompanyOverview } from "./contracts";
import { mapCompanyBasicProfile, mapMyMembershipRequest } from "./api-mapper";

export function createHttpCompanyRepository(http: HttpClient): CompanyRepository {
  const authorizedRequest = http.authorized;
  const apiRequest = http.request;
  const uploads = new Map<string, { upload: DocumentUploadDto["upload"]; account: string | null }>();
  function searchCompanies(access: AuthAccess, query: string, page = 0): Promise<CompanySearchPage> {
    const params = new URLSearchParams({ query, page: String(page), size: "10" });
    return authorizedRequest(access, `/api/v1/companies/search?${params}`);
  }

  function getMembershipContext(access: AuthAccess, companyId: number): Promise<MembershipApplicationContext> {
    return authorizedRequest(access, `/api/v1/companies/${companyId}/membership-application-context`);
  }

  async function requestMembership(
    access: AuthAccess,
    body: { companyId: number; representative: boolean; positionId: number | null; proposedPositionName: string | null; message: string | null },
  ): Promise<MembershipRequest> {
    const result = await authorizedRequest<MembershipRequest>(access, "/api/v1/company-membership-requests", { method: "POST", body });
    if (!Number.isSafeInteger(result.requestId) || result.requestId <= 0 || result.status !== "PENDING" || result.company?.companyId !== body.companyId) {
      throw new ApiError(0, "MEMBERSHIP_RESPONSE_INVALID", "신청 결과를 확인하지 못했어요. 현재 회사 상태를 확인해 주세요.");
    }
    return result;
  }

  async function cancelMembershipRequest(access: AuthAccess, requestId: number, expectedVersion: number) {
    if (!Number.isSafeInteger(requestId) || requestId <= 0 || !Number.isSafeInteger(expectedVersion) || expectedVersion <= 0) {
      throw new ApiError(400, "MEMBERSHIP_INPUT_INVALID", "취소할 신청 정보를 다시 확인해 주세요.");
    }
    const request = mapMyMembershipRequest(await authorizedRequest<unknown>(access, `/api/v1/company-membership-requests/${requestId}?expectedVersion=${expectedVersion}`, { method: "DELETE" }));
    if (request.requestId !== requestId || request.status !== "CANCELED" || request.version <= expectedVersion) {
      throw new ApiError(0, "MEMBERSHIP_RESPONSE_INVALID", "취소 결과를 확인하지 못했어요. 최신 상태를 다시 확인해 주세요.");
    }
    return postCommit(access, { request });
  }

  function previewInvitation(token: string): Promise<InvitationContext> {
    return apiRequest("/api/v1/company-membership-invitations/preview", { method: "POST", body: { token } });
  }

  function resumeInvitation(access: AuthAccess): Promise<InvitationContext> {
    return authorizedRequest(access, "/api/v1/company-membership-invitations/resume", { method: "POST" });
  }

  async function acceptInvitation(access: AuthAccess, expectedVersion: number): Promise<{ companyId: number; membershipId: number; sessionWarning?: string }> {
    const result = await authorizedRequest<{ companyId: number; membershipId: number }>(access, "/api/v1/company-membership-invitations/acceptance", { method: "POST", body: { expectedVersion } });
    return postCommit(access, result);
  }

  function declineInvitation(access: AuthAccess, expectedVersion: number): Promise<InvitationContext> {
    return authorizedRequest(access, "/api/v1/company-membership-invitations/decline", { method: "POST", body: { expectedVersion } });
  }

  function createBusinessConnection(access: AuthAccess, businessNumber: string, idempotencyKey: string): Promise<BusinessConnection> {
    return authorizedRequest(access, "/api/v1/account-business-connections", {
      method: "POST", body: { businessNumber }, idempotencyKey,
    });
  }

  function getBusinessConnection(access: AuthAccess): Promise<BusinessConnection> {
    return authorizedRequest(access, "/api/v1/account-business-connections/current");
  }

  function clearBusinessConnection(access: AuthAccess): Promise<void> {
    return authorizedRequest(access, "/api/v1/account-business-connections/current", { method: "DELETE", allowEmptyData: true });
  }

  async function createUnverifiedCompany(
    access: AuthAccess,
    body: { connectionId: string; preferredBidNoticeAmountRange: BidAmountRange | null; representative: boolean; positionName: string | null },
    idempotencyKey: string,
  ): Promise<RegistrationResult> {
    return postCommit(access, registrationResult(await authorizedRequest<unknown>(access, "/api/v1/unverified-company-registrations", { method: "POST", body, idempotencyKey })));
  }

  async function createDocumentUpload(access: AuthAccess, file: File, idempotencyKey: string): Promise<DocumentUpload> {
    return createDocumentUploadRequest(access, "/api/v1/company-documents", file, idempotencyKey);
  }

  async function createDocumentVersion(
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
    const account = access.getAccountKey();
    const checksum = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
    if (account !== access.getAccountKey()) throw new ApiError(401, "ACCOUNT_CHANGED", "로그인 계정이 변경됐습니다. 다시 시도해 주세요.");
    const sha256 = Array.from(new Uint8Array(checksum), (byte) => byte.toString(16).padStart(2, "0")).join("");
    const result = await authorizedRequest<DocumentUploadDto>(access, path, {
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
    if (account !== access.getAccountKey()) throw new ApiError(401, "ACCOUNT_CHANGED", "로그인 계정이 변경됐습니다. 다시 시도해 주세요.");
    const uploadHandle = crypto.randomUUID();
    uploads.set(uploadHandle, { upload: result.upload, account });
    return { documentId: result.documentId, versionId: result.versionId, versionNumber: result.versionNumber, status: result.status, sessionExpiresAt: result.sessionExpiresAt, uploadHandle };
  }

  function retryDocumentProcessing(
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

  async function uploadDocumentFile(access: AuthAccess, uploadHandle: string, file: File): Promise<void> {
    const handle = uploads.get(uploadHandle);
    if (!handle || handle.account !== access.getAccountKey()) throw new ApiError(400, "UPLOAD_HANDLE_INVALID", "업로드 세션이 변경됐습니다. 파일을 다시 선택해 주세요.");
    const upload = handle.upload;
    if (upload.method.toUpperCase() !== "PUT") throw new ApiError(0, "UPLOAD_METHOD", "지원하지 않는 파일 업로드 방식입니다.");
    let response: Response;
    try {
      response = await http.fetch(upload.url, { method: "PUT", headers: upload.headers, body: file, credentials: "omit" });
    } catch {
      throw new ApiError(0, "UPLOAD_NETWORK_ERROR", "파일을 업로드하지 못했습니다. 다시 시도해 주세요.");
    }
    if (!response.ok) throw new ApiError(response.status, "UPLOAD_FAILED", "파일 업로드에 실패했습니다. 다시 시도해 주세요.");
    uploads.delete(uploadHandle);
  }

  function completeDocumentUpload(access: AuthAccess, documentId: string, versionId: string): Promise<{ status: string }> {
    return authorizedRequest(access, `/api/v1/company-documents/${documentId}/versions/${versionId}/upload-completions`, { method: "POST" });
  }

  function getDocumentProcessing(access: AuthAccess, documentId: string): Promise<DocumentProcessing> {
    return authorizedRequest(access, `/api/v1/company-documents/${documentId}`);
  }

  function getRegistrationProposal(access: AuthAccess, proposalId: string): Promise<CompanyRegistrationProposal> {
    return authorizedRequest(access, `/api/v1/company-registration-proposals/${proposalId}`);
  }

  function getIndustries(keyword: string): Promise<Array<{ code: string; name: string }>> {
    const params = new URLSearchParams({ keyword });
    return apiRequest<{ items: Array<{ code: string; name: string }> }>(`/api/v1/industries?${params}`).then((response) => response.items);
  }

  async function createVerifiedCompany(
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
    return postCommit(access, registrationResult(await authorizedRequest<unknown>(access, "/api/v1/company-registrations", { method: "POST", body, idempotencyKey })));
  }

  function registrationResult(value: unknown): RegistrationResult {
    const result = value as RegistrationResult | null;
    if (!result || !Number.isSafeInteger(result.companyId) || result.companyId <= 0 || !Number.isSafeInteger(result.membershipId) || result.membershipId <= 0
      || typeof result.role !== "string" || !result.role.trim() || typeof result.verificationStatus !== "string" || !result.verificationStatus.trim()) {
      throw new ApiError(0, "REGISTRATION_RESPONSE_INVALID", "등록 결과를 확인하지 못했어요. 현재 회사 상태를 확인해 주세요.");
    }
    return result;
  }

  async function postCommit<T extends object>(access: AuthAccess, result: T): Promise<T & { sessionWarning?: string }> {
    try { if (!await access.refresh({ preserveOnError: true })) throw new Error("session unavailable"); return result; }
    catch { return { ...result, sessionWarning: "회사 변경은 완료됐지만 로그인 상태를 갱신하지 못했습니다. 새로고침 후 확인해 주세요." }; }
  }
  async function getMyCompanyOverview(access: AuthAccess, signal?: AbortSignal): Promise<CompanyOverview> {
    signal?.throwIfAborted();
    const session = await access.refresh();
    signal?.throwIfAborted();
    if (!session) throw new ApiError(401, "SESSION_INVALID", "로그인이 필요합니다.");
    async function profile(companyId: number): Promise<CompanyOverview> {
      const profile = mapCompanyBasicProfile(await authorizedRequest<unknown>(access, `/api/v1/companies/${companyId}`, { signal }));
      if (profile.companyId !== companyId) throw new ApiError(0, "COMPANY_MISMATCH", "회사 정보를 확인하지 못했어요. 다시 시도해 주세요.");
      return { status: "connected", profile };
    }
    if (session.companyContext) return profile(session.companyContext.companyId);
    let request: MyMembershipRequest;
    try { request = mapMyMembershipRequest(await authorizedRequest<unknown>(access, "/api/v1/company-membership-requests/me", { signal })); }
    catch (error) { if (error instanceof ApiError && error.status === 404 && error.code === "CR001") return { status: "empty" }; throw error; }
    if (request.status === "APPROVED") {
      const updated = await access.refresh(); signal?.throwIfAborted();
      if (updated?.companyContext) return profile(updated.companyContext.companyId);
      return { status: "approved-stale", request };
    }
    return { status: request.status === "PENDING" ? "pending" : "terminated", request };
  }

  return { searchCompanies, getMembershipContext, requestMembership, cancelMembershipRequest, previewInvitation, resumeInvitation, acceptInvitation, declineInvitation, createBusinessConnection, getBusinessConnection, clearBusinessConnection, createUnverifiedCompany, createDocumentUpload, createDocumentVersion, retryDocumentProcessing, uploadDocumentFile, completeDocumentUpload, getDocumentProcessing, getRegistrationProposal, getIndustries, createVerifiedCompany, getMyCompanyOverview };
}

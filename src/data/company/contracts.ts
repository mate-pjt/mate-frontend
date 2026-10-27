export type CompanySearchItem = {
  companyId: number;
  companyName: string;
  businessNumber: string;
  baseAddress: string | null;
  verificationStatus: "LEGACY" | "UNVERIFIED" | "VERIFIED";
};

export type CompanySearchPage = {
  content: CompanySearchItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type MembershipApplicationContext = {
  accountName: string | null;
  googleVerifiedEmail: string | null;
  company: CompanySearchItem;
  positions: Array<{ positionId: number; name: string }>;
  availability:
    | "AVAILABLE"
    | "GOOGLE_VERIFIED_EMAIL_REQUIRED"
    | "ACTIVE_MEMBERSHIP_EXISTS"
    | "PENDING_REQUEST_EXISTS"
    | "PENDING_INVITATION_EXISTS";
};

export type MembershipRequest = {
  requestId: number;
  status: "PENDING" | "CANCELED" | "APPROVED" | "REJECTED";
  company: CompanySearchItem;
};

export type InvitationContext = {
  invitationId: number;
  companyId: number;
  companyName: string;
  companyBusinessNumber: string;
  inviteeDisplayName: string;
  representative: boolean;
  position: { positionId: number; name: string } | null;
  role: "ADMIN" | "AGENT" | "VIEWER";
  version: number;
  expiresAt: string;
  emailMatched: boolean | null;
  canAccept: boolean;
};

export type SignupCompanyProfile = {
  businessNumber: string;
  companyName: string | null;
  representativeName: string | null;
  openingDate: string | null;
  baseAddress: string | null;
  detailAddress: string | null;
  telephoneNumber: string | null;
  primaryIndustry: { code: string; name: string } | null;
  capability: {
    amountKrw: number | null;
    assessmentYear: number | null;
    representativeLicenseStatus: string;
    sourceSnapshotDate?: string | null;
  };
  certifications: Record<string, { status: string; sourceSnapshotDate?: string | null }>;
};

export type BusinessConnection = {
  connectionId: string;
  businessNumber: string;
  connectionStatus: string;
  verificationStatus: string;
  enrichmentStatus: string;
  primaryIndustry: { industryId: number; code: string; name: string } | null;
  companyProfile: SignupCompanyProfile;
  enrichmentRun: {
    runId: string;
    status: string;
    totalSteps: number;
    completedSteps: number;
  };
};

export type DocumentUpload = {
  documentId: string;
  versionId: string;
  versionNumber: number;
  status: string;
  uploadHandle: string;
  sessionExpiresAt: string;
};

export type DocumentProcessing = {
  documentId: string;
  versionId: string;
  status: string;
  failureCode: string | null;
  canRetry: boolean;
  proposalId: string | null;
  extractedFields: { businessNumber: string; companyName: string; representativeName: string; openingDate: string; businessAddress: string } | null;
};

export type CompanyRegistrationProposal = {
  proposalId: string;
  revision: number;
  documentId: string;
  versionId: string;
  businessNumber: string;
  representativeName: string;
  openingDate: string;
  companyName: string;
  baseAddress: string;
  detailAddress: string | null;
  telephoneNumber: string | null;
  primaryIndustry: { code: string; name: string } | null;
  primaryIndustrySelectionRequired: boolean;
  companyProfile: SignupCompanyProfile;
  conflict: {
    existingCompanyId: number;
    existingCompanyName: string;
    decisionRequired: boolean;
    allowedChoices: Array<"REUSE_EXISTING" | "CREATE_NEW_VERIFIED">;
    reuseMode: "VERIFY_CURRENT_COMPANY" | "PROPOSE_MERGE" | null;
  } | null;
  businessNumberCorrection: {
    currentCompanyId: number;
    currentCompanyName: string;
    currentBusinessNumber: string;
    certificateBusinessNumber: string;
    decisionRequired: boolean;
    allowedChoices: Array<"CORRECT_CURRENT_UNVERIFIED">;
  } | null;
};

export type RegistrationResult = {
  companyId: number;
  membershipId: number;
  sessionWarning?: string;
  role: string;
  verificationStatus: string;
  registrationMode?: string;
  conflict?: { caseId: number; type: string; status: string } | null;
};

export type BidAmountRange =
  | "BELOW_100_MILLION"
  | "FROM_100_MILLION_TO_500_MILLION"
  | "FROM_500_MILLION_TO_1_BILLION"
  | "FROM_1_BILLION_TO_5_BILLION"
  | "AT_LEAST_5_BILLION"
  | "ANY";

export type MyMembershipRequest = {
  requestId: number;
  company: {
    companyId: number;
    companyName: string;
    businessNumber: string;
    baseAddress: string | null;
    verificationStatus: "LEGACY" | "UNVERIFIED" | "VERIFIED";
  };
  requestedRepresentative: boolean;
  requestedPositionName: string | null;
  proposedPositionName: string | null;
  status: "PENDING" | "CANCELED" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
  createdAt: string;
};

export type CompanyBasicProfile = {
  companyId: number;
  companyName: string;
  businessNumber: string;
  representativeName: string | null;
  verificationStatus: "LEGACY" | "UNVERIFIED" | "VERIFIED";
  address: {
    zipCode: string | null;
    baseAddress: string | null;
    detailAddress: string | null;
  } | null;
  telephoneNumber: string | null;
  establishedYear: number | null;
  primaryIndustry: { code: string; name: string } | null;
};

import type { AuthAccess } from "../shared/http";
export type CompanyOverview =
  | { status: "empty" }
  | { status: "pending" | "terminated" | "approved-stale"; request: MyMembershipRequest }
  | { status: "connected"; profile: CompanyBasicProfile };

export interface CompanyDirectoryRepository {
  searchCompanies(access: AuthAccess, query: string, page?: number): Promise<CompanySearchPage>;
  getIndustries(keyword: string): Promise<Array<{ code: string; name: string }>>;
  getMyCompanyOverview(access: AuthAccess, signal?: AbortSignal): Promise<CompanyOverview>;
}

export interface CompanyOnboardingRepository {
  getMembershipContext(access: AuthAccess, companyId: number): Promise<MembershipApplicationContext>;
  requestMembership(access: AuthAccess, body: { companyId: number; representative: boolean; positionId: number | null; proposedPositionName: string | null; message: string | null }): Promise<MembershipRequest>;
  previewInvitation(token: string): Promise<InvitationContext>;
  resumeInvitation(access: AuthAccess): Promise<InvitationContext>;
  acceptInvitation(access: AuthAccess, expectedVersion: number): Promise<{ companyId: number; membershipId: number; sessionWarning?: string }>;
  declineInvitation(access: AuthAccess, expectedVersion: number): Promise<InvitationContext>;
  createBusinessConnection(access: AuthAccess, businessNumber: string, idempotencyKey: string): Promise<BusinessConnection>;
  getBusinessConnection(access: AuthAccess): Promise<BusinessConnection>;
  clearBusinessConnection(access: AuthAccess): Promise<void>;
  createUnverifiedCompany(access: AuthAccess, body: { connectionId: string; preferredBidNoticeAmountRange: BidAmountRange | null; representative: boolean; positionName: string | null }, idempotencyKey: string): Promise<RegistrationResult>;
}

export interface CompanyDocumentRepository {
  createDocumentUpload(access: AuthAccess, file: File, idempotencyKey: string): Promise<DocumentUpload>;
  createDocumentVersion(access: AuthAccess, documentId: string, replacesVersionId: string, file: File, idempotencyKey: string): Promise<DocumentUpload>;
  retryDocumentProcessing(access: AuthAccess, documentId: string, versionId: string, kind: "ocr" | "verification", idempotencyKey: string): Promise<{ status: string }>;
  uploadDocumentFile(access: AuthAccess, uploadHandle: string, file: File): Promise<void>;
  completeDocumentUpload(access: AuthAccess, documentId: string, versionId: string): Promise<{ status: string }>;
  getDocumentProcessing(access: AuthAccess, documentId: string): Promise<DocumentProcessing>;
  getRegistrationProposal(access: AuthAccess, proposalId: string): Promise<CompanyRegistrationProposal>;
  createVerifiedCompany(access: AuthAccess, body: {
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
  }, idempotencyKey: string): Promise<RegistrationResult>;
}

export type CompanyRepository = CompanyDirectoryRepository & CompanyOnboardingRepository & CompanyDocumentRepository;

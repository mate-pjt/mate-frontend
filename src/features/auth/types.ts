export type AgreementCode = "TERMS_OF_SERVICE" | "PRIVACY_POLICY";

export type RequiredAgreement = {
  code: AgreementCode;
  version: string;
  title: string;
};

export type SocialSignup = {
  verifiedEmail: string;
  suggestedName: string | null;
  profileImageUrl: string | null;
  expiresAt: string;
  requiredAgreements: RequiredAgreement[];
};

export type Authentication = {
  accessToken: string;
  tokenType: string;
  expiresInSeconds: number;
  account: { id: number; email: string };
  companyContext: { companyId: number; role: string } | null;
  companyOnboarding: {
    status: "NOT_STARTED" | "COMPLETED";
    availableActions: Array<"START_NOW" | "FIND_COMPANY" | "REGISTER_COMPANY">;
  };
};

export type CompleteSignup = {
  name: string;
  birthDate: string | null;
  mobilePhone: string | null;
  agreementAcceptances: Array<{ code: AgreementCode; version: string }>;
};

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
  upload: { method: string; url: string; headers: Record<string, string>; expiresAt: string };
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

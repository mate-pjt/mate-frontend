import { authorizedRequest, type AuthAccess } from "@/features/auth/api";

export type MembershipRequest = {
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

export function getMyMembershipRequest(access: AuthAccess, signal?: AbortSignal): Promise<MembershipRequest> {
  return authorizedRequest(access, "/api/v1/company-membership-requests/me", { signal });
}

export function getCompanyBasicProfile(access: AuthAccess, companyId: number, signal?: AbortSignal): Promise<CompanyBasicProfile> {
  return authorizedRequest(access, `/api/v1/companies/${companyId}`, { signal });
}

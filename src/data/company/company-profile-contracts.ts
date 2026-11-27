import type { AuthAccess } from "../shared/http";

export const publicCertificationTypes = ["WOMEN_OWNED", "DISABLED_OWNED", "SOCIAL_ENTERPRISE"] as const;
export type PublicCertificationType = typeof publicCertificationTypes[number];
export type CompanyProfileSource = "AUTO_INITIAL" | "ADMIN_ACCEPTED_EXTERNAL" | "ADMIN_MANUAL";
export type RepresentativeAssessmentStatus = "SELECTED" | "NONE" | "UNDETERMINED";

export type ConstructionCapabilityAssessment = {
  assessmentId: string;
  assessmentSubjectName: string;
  amountKrw: string;
  assessmentYear: number | null;
  representativeLicense: boolean | null;
  snapshotDate: string | null;
  provenanceType: CompanyProfileSource;
};

export type CompanyConstructionCapabilities = {
  representativeStatus: RepresentativeAssessmentStatus;
  representativeAssessmentId: string | null;
  industries: Array<{
    industryCode: string;
    industryName: string;
    assessments: ConstructionCapabilityAssessment[];
  }>;
  unmappedObservationCount: number;
};

export type CompanyPublicCertification = {
  type: PublicCertificationType;
  status: "YES" | "NO" | "UNKNOWN";
  source: CompanyProfileSource | null;
  snapshotDate: string | null;
  confirmedAt: string | null;
};

export interface CompanyProfileRepository {
  getCompanyConstructionCapabilities(access: AuthAccess, companyId: number, signal?: AbortSignal): Promise<CompanyConstructionCapabilities>;
  getCompanyPublicCertifications(access: AuthAccess, companyId: number, signal?: AbortSignal): Promise<CompanyPublicCertification[]>;
}

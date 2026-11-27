import type { MockRuntime } from "../mock/runtime";
import { ApiError } from "../shared/errors";
import {
  publicCertificationTypes,
  type CompanyConstructionCapabilities,
  type CompanyProfileRepository,
  type CompanyPublicCertification,
} from "./company-profile-contracts";
import type { CompanyTeamRepository } from "./team-contracts";

const assessmentId = "00000000-0000-0000-0000-000000000061";
const emptyCapabilities: CompanyConstructionCapabilities = {
  representativeStatus: "NONE", representativeAssessmentId: null, industries: [], unmappedObservationCount: 0,
};
const capabilities: CompanyConstructionCapabilities = {
  representativeStatus: "SELECTED", representativeAssessmentId: assessmentId, unmappedObservationCount: 1,
  industries: [
    {
      industryCode: "0001", industryName: "토목공사업",
      assessments: [
        { assessmentId, assessmentSubjectName: "가상 토목 공종", amountKrw: "3470000000", assessmentYear: 2025,
          representativeLicense: true, snapshotDate: "2025-12-31", provenanceType: "ADMIN_ACCEPTED_EXTERNAL" },
        { assessmentId: "00000000-0000-0000-0000-000000000062", assessmentSubjectName: "가상 토목 보조 공종", amountKrw: "0", assessmentYear: null,
          representativeLicense: false, snapshotDate: null, provenanceType: "ADMIN_MANUAL" },
      ],
    },
    {
      industryCode: "0036", industryName: "정보통신공사업",
      assessments: [
        { assessmentId: "00000000-0000-0000-0000-000000000063", assessmentSubjectName: "가상 정보통신 공종", amountKrw: "9007199254740993", assessmentYear: 2024,
          representativeLicense: null, snapshotDate: "2025-12-31", provenanceType: "AUTO_INITIAL" },
      ],
    },
  ],
};
const unknownCertifications: CompanyPublicCertification[] = publicCertificationTypes.map(type => ({
  type, status: "UNKNOWN", source: null, snapshotDate: null, confirmedAt: null,
}));
const certifications: CompanyPublicCertification[] = [
  { type: "WOMEN_OWNED", status: "YES", source: "AUTO_INITIAL", snapshotDate: "2025-12-31", confirmedAt: null },
  { type: "DISABLED_OWNED", status: "NO", source: "ADMIN_MANUAL", snapshotDate: null, confirmedAt: "2026-01-05T01:00:00Z" },
  { type: "SOCIAL_ENTERPRISE", status: "UNKNOWN", source: "ADMIN_ACCEPTED_EXTERNAL", snapshotDate: "2025-12-31", confirmedAt: "2026-01-05T01:00:00Z" },
];

export function createMockCompanyProfile(runtime: MockRuntime, team: Pick<CompanyTeamRepository, "getCurrentCompanyPermissions">): CompanyProfileRepository {
  async function authorize(...args: Parameters<CompanyTeamRepository["getCurrentCompanyPermissions"]>) {
    const [access, , signal] = args;
    const membership = await team.getCurrentCompanyPermissions(...args);
    signal?.throwIfAborted();
    access.assertRequestScope?.();
    if (!membership.permissionCodes.includes("COMPANY_INFORMATION_VIEW")) {
      throw new ApiError(403, "CM005", "회사 정보를 볼 권한이 없어요.");
    }
  }
  function hasData(companyId: number) {
    return companyId === 7001 && runtime.scenario("company") !== "profile-empty";
  }
  return {
    async getCompanyConstructionCapabilities(access, companyId, signal) {
      await authorize(access, companyId, signal);
      if (runtime.scenario("company") === "profile-capability-error") throw new ApiError(503, "MOCK_ERROR", "시공능력평가액을 조회하지 못했어요.");
      return structuredClone(hasData(companyId) ? capabilities : emptyCapabilities);
    },
    async getCompanyPublicCertifications(access, companyId, signal) {
      await authorize(access, companyId, signal);
      if (runtime.scenario("company") === "profile-certification-error") throw new ApiError(503, "MOCK_ERROR", "기업 인증을 조회하지 못했어요.");
      return structuredClone(hasData(companyId) ? certifications : unknownCertifications);
    },
  };
}

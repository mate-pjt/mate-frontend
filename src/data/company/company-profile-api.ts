import { ApiError } from "../shared/errors";
import type { HttpClient } from "../shared/http";
import {
  publicCertificationTypes,
  type CompanyConstructionCapabilities,
  type CompanyProfileRepository,
  type CompanyProfileSource,
  type CompanyPublicCertification,
  type ConstructionCapabilityAssessment,
} from "./company-profile-contracts";
import { timestamp } from "./team-api";

const sources = ["AUTO_INITIAL", "ADMIN_ACCEPTED_EXTERNAL", "ADMIN_MANUAL"] as const;
const statuses = ["SELECTED", "NONE", "UNDETERMINED"] as const;
const certificationStatuses = ["YES", "NO", "UNKNOWN"] as const;

const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value);
const text = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const uuid = (value: unknown): value is string => typeof value === "string" && /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(value);
const count = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
const oneOf = <T extends string>(options: readonly T[], value: unknown): value is T =>
  typeof value === "string" && options.some(option => option === value);

function nullableDate(value: unknown): value is string | null {
  if (value === null) return true;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function invalid(): never {
  throw new ApiError(0, "COMPANY_PROFILE_RESPONSE_INVALID", "회사 조회 응답을 확인하지 못했어요. 다시 시도해 주세요.");
}

function currentAssessmentJson(json: string): unknown {
  // Match complete JSON strings before checking property keys so text containing "amountKrw" stays intact.
  const properties = /("(?:[^"\\]|\\[\s\S])*")(\s*:\s*)?(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?(?=\s*[,}]))?/g;
  return JSON.parse(json.replace(properties, (token, key: string, separator?: string, amount?: string) => {
    if (!separator || JSON.parse(key) !== "amountKrw") return token;
    if (amount === undefined) invalid();
    return key + separator + JSON.stringify(amount);
  }));
}

function exactWon(value: unknown): string {
  const parts = typeof value === "string" && /^(-?)(\d+)(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/.exec(value);
  if (!parts) invalid();
  const [, sign, whole, fraction = "", exponent = "0"] = parts;
  let digits = (whole + fraction).replace(/^0+/, "");
  if (digits === "") return "0";
  const shift = Number(exponent) - fraction.length;
  if (sign === "-" || !Number.isSafeInteger(shift)) invalid();
  if (shift < 0) {
    const keep = digits.length + shift;
    if (keep <= 0 || /[1-9]/.test(digits.slice(keep))) invalid();
    digits = digits.slice(0, keep);
  }
  // The owning database stores whole won in NUMERIC(20, 0).
  const length = digits.length + Math.max(shift, 0);
  if (length > 20) invalid();
  return digits.padEnd(length, "0");
}

function mapAssessment(value: unknown): ConstructionCapabilityAssessment {
  if (!record(value) || !uuid(value.assessmentId) || !text(value.assessmentSubjectName)
    || !(value.assessmentYear === null || count(value.assessmentYear) && value.assessmentYear >= 1900 && value.assessmentYear <= 2200)
    || !(value.representativeLicense === null || typeof value.representativeLicense === "boolean")
    || !nullableDate(value.snapshotDate) || !oneOf(sources, value.provenanceType)) invalid();
  return {
    assessmentId: value.assessmentId, assessmentSubjectName: value.assessmentSubjectName,
    amountKrw: exactWon(value.amountKrw), assessmentYear: value.assessmentYear,
    representativeLicense: value.representativeLicense, snapshotDate: value.snapshotDate, provenanceType: value.provenanceType,
  };
}

function mapCapabilities(value: unknown): CompanyConstructionCapabilities {
  if (!record(value) || value.asOf !== null || !oneOf(statuses, value.representativeStatus)
    || !Array.isArray(value.industries) || !count(value.unmappedObservationCount)) invalid();
  const industries = value.industries.map((industry: unknown) => {
    if (!record(industry) || !text(industry.industryCode) || !text(industry.industryName) || !Array.isArray(industry.assessments)) invalid();
    return { industryCode: industry.industryCode, industryName: industry.industryName, assessments: industry.assessments.map(mapAssessment) };
  });
  const ids = industries.flatMap(industry => industry.assessments.map(assessment => assessment.assessmentId));
  const representativeId = value.representativeAssessmentId;
  if (new Set(industries.map(industry => industry.industryCode)).size !== industries.length || new Set(ids).size !== ids.length
    || (value.representativeStatus === "SELECTED" ? !uuid(representativeId) || !ids.includes(representativeId) : representativeId !== null)) invalid();
  return {
    industries, representativeStatus: value.representativeStatus,
    representativeAssessmentId: representativeId as string | null, unmappedObservationCount: value.unmappedObservationCount,
  };
}

function mapCertification(value: unknown): CompanyPublicCertification {
  if (!record(value) || !oneOf(publicCertificationTypes, value.type) || !oneOf(certificationStatuses, value.status)
    || !count(value.version) || !nullableDate(value.snapshotDate) || !(value.confirmedAt === null || timestamp(value.confirmedAt))) invalid();
  let source: CompanyProfileSource | null = null;
  if (value.version === 0) {
    if (value.status !== "UNKNOWN" || value.source !== null || value.snapshotDate !== null || value.confirmedAt !== null) invalid();
  } else {
    if (!oneOf(sources, value.source)) invalid();
    source = value.source;
  }
  return { type: value.type, status: value.status, source, snapshotDate: value.snapshotDate, confirmedAt: value.confirmedAt };
}

function mapCertifications(value: unknown): CompanyPublicCertification[] {
  if (!record(value) || !Array.isArray(value.items)) invalid();
  const items = value.items.map(mapCertification);
  const byType = new Map(items.map(item => [item.type, item]));
  if (items.length !== publicCertificationTypes.length || byType.size !== publicCertificationTypes.length) invalid();
  return publicCertificationTypes.map(type => byType.get(type) ?? invalid());
}

function companyPath(companyId: number): string {
  if (!count(companyId) || companyId === 0) throw new ApiError(400, "COMPANY_PROFILE_INPUT_INVALID", "조회할 회사를 확인해 주세요.");
  return `/api/v1/companies/${companyId}`;
}

export function createCompanyProfileApi(http: HttpClient): CompanyProfileRepository {
  return {
    async getCompanyConstructionCapabilities(access, companyId, signal) {
      return mapCapabilities(await http.authorized<unknown>(access, `${companyPath(companyId)}/construction-capability-assessments`, {
        signal, parseJson: currentAssessmentJson,
      }));
    },
    async getCompanyPublicCertifications(access, companyId, signal) {
      return mapCertifications(await http.authorized<unknown>(access, `${companyPath(companyId)}/public-certifications`, { signal }));
    },
  };
}

import { describe, expect, it, vi } from "vitest";
import type { BusinessConnection, CompanyRegistrationProposal, SignupCompanyProfile } from "@/data/company/contracts";
import { signupCertificationTypes } from "@/data/company/contracts";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { createHttpCompanyRepository } from "@/data/company/http-repository";
import { createHttpClient } from "@/data/shared/http";
import { memoryStorage } from "@/data/mock/store";
import { access, mockRuntime, ok } from "./helpers";

const otherAccess = { ...access, getAccountKey: () => "2" };
type StoredState = {
  signupEvidenceVersion?: number;
  connection: BusinessConnection;
  proposals: Record<string, CompanyRegistrationProposal>;
  requests: Record<string, { result: BusinessConnection }>;
};
async function proposal(repo: ReturnType<typeof createMockCompanyRepository>) {
  const file = new File(["synthetic evidence"], "synthetic.pdf", { type: "application/pdf" });
  const upload = await repo.createDocumentUpload(access, file, "upload-evidence");
  await repo.uploadDocumentFile(access, upload.uploadHandle, file);
  await repo.completeDocumentUpload(access, upload.documentId, upload.versionId, "complete-evidence");
  let processing = await repo.getDocumentProcessing(access, upload.documentId);
  for (let i = 0; i < 3 && !processing.proposalId; i++) processing = await repo.getDocumentProcessing(access, upload.documentId);
  return repo.getRegistrationProposal(access, processing.proposalId!);
}
function expectEvidence(profile: SignupCompanyProfile, empty = false) {
  expect(profile.capability).toEqual({ amountKrw: empty ? null : 500_000_000, assessmentYear: null, representativeLicenseStatus: empty ? "UNKNOWN" : "YES", source: empty ? null : "G2B_REPORT", sourceSnapshotDate: empty ? null : "2025-12-31" });
  expect(Object.keys(profile.certifications).sort()).toEqual([...signupCertificationTypes].sort());
  expect(Object.values(profile.certifications).map(item => item.status)).toEqual(empty ? ["UNKNOWN", "UNKNOWN", "UNKNOWN"] : ["YES", "NO", "UNKNOWN"]);
  expect(profile.certifications.SOCIAL_ENTERPRISE).toEqual({ status: "UNKNOWN", source: null, sourceSnapshotDate: null });
}
function makeLegacy(profile: SignupCompanyProfile) {
  const raw = profile as unknown as Record<string, unknown>;
  for (const key of ["businessNumberSource", "representativeNameSource", "openingDateSource", "companyInformationSource", "companyInformationCheckedAt", "telephoneNumberSource", "primaryIndustrySource"]) delete raw[key];
  raw.capability = { amountKrw: 500_000_000, assessmentYear: 2030, representativeLicenseStatus: "ACTIVE" };
  raw.certifications = {};
}

describe("가입 프로필 근거 계약 / mock", () => {
  it.each(["default", "evidence-empty"])("번호·문서의 인증3종/출처/평가연도 null을 보존한다 (%s)", async scenario => {
    const repo = createMockCompanyRepository(mockRuntime(undefined, { company: scenario }));
    const connection = await repo.createBusinessConnection(access, "1234567890", "connection-evidence");
    const documentProposal = await proposal(repo);
    for (const profile of [connection.companyProfile, documentProposal.companyProfile]) expectEvidence(profile, scenario === "evidence-empty");
    expect(connection.companyProfile).toMatchObject({ businessNumberSource: "USER_INPUT", companyInformationSource: "NARA_COMPANY", representativeNameSource: "NARA_COMPANY", openingDateSource: "NARA_COMPANY", primaryIndustrySource: "NARA_COMPANY", telephoneNumberSource: null, companyInformationCheckedAt: null });
    expect(documentProposal.companyProfile).toMatchObject({ businessNumberSource: "BUSINESS_REGISTRATION_CERTIFICATE", companyInformationSource: "BUSINESS_REGISTRATION_CERTIFICATE", representativeNameSource: "BUSINESS_REGISTRATION_CERTIFICATE", openingDateSource: "BUSINESS_REGISTRATION_CERTIFICATE", primaryIndustrySource: "NARA_COMPANY" });
  });
  it("주입 Clock/연도가 바뀌어도 보고서 날짜를 평가연도로 합성하지 않는다", async () => {
    for (const now of [Date.parse("2024-01-01T00:00:00Z"), Date.parse("2035-12-31T23:59:59Z")]) {
      const repo = createMockCompanyRepository(mockRuntime(undefined, {}, () => now));
      expectEvidence((await repo.createBusinessConnection(access, "1234567890", "clock-evidence")).companyProfile);
    }
  });
  it.each(["YES", "NO", "UNKNOWN"] as const)("저장된 대표면허 %s·평가연도·개별 기준일과 0원은 변형 없이 복원한다", async status => {
    const storage = memoryStorage(); const runtime = mockRuntime(storage); const repo = createMockCompanyRepository(runtime);
    await repo.createBusinessConnection(access, "1234567890", "restore-evidence");
    const key = runtime.store.key("1", "company"); const state = JSON.parse(storage.getItem(key)!) as StoredState;
    state.connection.companyProfile.capability = { amountKrw: 0, assessmentYear: 2022, representativeLicenseStatus: status, source: "G2B_REPORT", sourceSnapshotDate: "2023-02-28" };
    state.connection.companyProfile.certifications.WOMEN_OWNED.sourceSnapshotDate = "2024-02-29";
    storage.setItem(key, JSON.stringify(state));
    const restored = await createMockCompanyRepository(mockRuntime(storage)).getBusinessConnection(access);
    expect(restored.companyProfile).toEqual(state.connection.companyProfile);
    await expect(repo.getBusinessConnection(otherAccess)).rejects.toMatchObject({ status: 404 });
    expect(await repo.createBusinessConnection(access, "1234567890", "restore-evidence")).toMatchObject({ connectionId: state.connection.connectionId });
  });
  it("이전 탭의 연결/문서/제안·cached replay를 변환하고 타 계정/도메인/실제 문서 키를 보존한다", async () => {
    const storage = memoryStorage(); const runtime = mockRuntime(storage); const repo = createMockCompanyRepository(runtime);
    const connection = await repo.createBusinessConnection(access, "1234567890", "legacy-connection");
    const documentProposal = await proposal(repo);
    await repo.createBusinessConnection(otherAccess, "2345678901", "other-connection");
    const key = runtime.store.key("1", "company"); const otherKey = runtime.store.key("2", "company"); const otherRaw = storage.getItem(otherKey);
    storage.setItem(runtime.store.key("1", "notifications"), "keep-notifications");
    storage.setItem("mate:signup-document:1", "synthetic-real-document-id");
    const state = JSON.parse(storage.getItem(key)!) as StoredState;
    delete state.signupEvidenceVersion;
    makeLegacy(state.connection.companyProfile);
    for (const p of Object.values(state.proposals)) makeLegacy(p.companyProfile);
    makeLegacy(state.requests["legacy-connection"].result.companyProfile);
    storage.setItem(key, JSON.stringify(state));
    const restored = createMockCompanyRepository(mockRuntime(storage));
    const current = await restored.getBusinessConnection(access);
    const replay = await restored.createBusinessConnection(access, "1234567890", "legacy-connection");
    const p = await restored.getRegistrationProposal(access, documentProposal.proposalId);
    for (const profile of [current.companyProfile, replay.companyProfile, p.companyProfile]) {
      expect(profile.capability).toEqual({ amountKrw: 500_000_000, assessmentYear: null, representativeLicenseStatus: "UNKNOWN", source: null, sourceSnapshotDate: null });
      expect(Object.values(profile.certifications).every(item => item.status === "UNKNOWN" && item.source === null && item.sourceSnapshotDate === null)).toBe(true);
    }
    expect(current.connectionId).toBe(connection.connectionId); expect(replay.connectionId).toBe(connection.connectionId);
    expect(p).toMatchObject({ proposalId: documentProposal.proposalId, documentId: documentProposal.documentId, versionId: documentProposal.versionId, revision: documentProposal.revision });
    expect((await restored.getDocumentProcessing(access, p.documentId)).proposalId).toBe(p.proposalId);
    expect(JSON.parse(storage.getItem(key)!).signupEvidenceVersion).toBe(1);
    expect((await createMockCompanyRepository(mockRuntime(storage)).getBusinessConnection(access)).companyProfile).toEqual(current.companyProfile);
    expect(storage.getItem(otherKey)).toBe(otherRaw);
    expect(storage.getItem(runtime.store.key("1", "notifications"))).toBe("keep-notifications");
    expect(storage.getItem("mate:signup-document:1")).toBe("synthetic-real-document-id");
  });
  it("프로필이 없는 구형 탭의 회사 연결/문서 업로드 진행도 보존한다", async () => {
    const storage = memoryStorage(); const runtime = mockRuntime(storage); const repo = createMockCompanyRepository(runtime);
    await repo.previewInvitation("mock-invite"); await repo.acceptInvitation(access, 1);
    const upload = await repo.createDocumentUpload(access, new File(["synthetic"], "synthetic.pdf", { type: "application/pdf" }), "old-upload");
    const key = runtime.store.key("1", "company"); const state = JSON.parse(storage.getItem(key)!);
    delete state.signupEvidenceVersion; storage.setItem(key, JSON.stringify(state));
    const restored = createMockCompanyRepository(mockRuntime(storage));
    expect((await restored.getMyCompanyOverview(access)).status).toBe("connected");
    expect(await restored.getDocumentProcessing(access, upload.documentId)).toMatchObject({ versionId: upload.versionId, status: "UPLOAD_PENDING" });
  });

  const invalidChanges: Array<[string, (p: SignupCompanyProfile) => void]> = [
    ["면허 ACTIVE", p => Object.assign(p.capability, { representativeLicenseStatus: "ACTIVE" })],
    ["인증 임의 문자열", p => Object.assign(p.certifications.WOMEN_OWNED, { status: "ACTIVE" })],
    ["인증 누락", p => Reflect.deleteProperty(p.certifications, "SOCIAL_ENTERPRISE")],
    ["인증 추가", p => Object.assign(p.certifications, { OTHER: { status: "NO", source: null, sourceSnapshotDate: null } })],
    ["인증 null", p => Object.assign(p.certifications, { WOMEN_OWNED: null })],
    ["음수 금액", p => { p.capability.amountKrw = -1; }],
    ["문자열 연도", p => Object.assign(p.capability, { assessmentYear: "2030" })],
    ["잘못된 면허 출처", p => Object.assign(p.capability, { source: "INVENTED" })],
    ["잘못된 인증 출처", p => Object.assign(p.certifications.WOMEN_OWNED, { source: "INVENTED" })],
    ["잘못된 기본정보 출처", p => Object.assign(p, { businessNumberSource: "INVENTED" })],
    ["누락 출처", p => Reflect.deleteProperty(p.capability, "source")],
    ["없는 날짜", p => { p.capability.sourceSnapshotDate = "2025-02-29"; }],
    ["날짜 아닌 기준일", p => { p.certifications.WOMEN_OWNED.sourceSnapshotDate = "not-a-date"; }],
    ["자료 확인시각 오류", p => { p.companyInformationCheckedAt = "not-a-date"; }],
  ];
  it.each(invalidChanges)("새 schema의 %s를 거부하고 해당 계정 회사 공간만 초기화한다", async (_label, change) => {
    const storage = memoryStorage(); const runtime = mockRuntime(storage); const repo = createMockCompanyRepository(runtime);
    await repo.createBusinessConnection(access, "1234567890", "bad-evidence");
    await repo.createBusinessConnection(otherAccess, "2345678901", "keep-evidence");
    const key = runtime.store.key("1", "company"); const state = JSON.parse(storage.getItem(key)!) as StoredState;
    const otherRaw = storage.getItem(runtime.store.key("2", "company"));
    change(state.connection.companyProfile); storage.setItem(key, JSON.stringify(state));
    const restored = createMockCompanyRepository(mockRuntime(storage));
    await expect(restored.getBusinessConnection(access)).rejects.toMatchObject({ status: 404 });
    expect(storage.getItem(runtime.store.key("2", "company"))).toBe(otherRaw);
  });
  it("request cache 안의 잘못된 근거도 거부한다", async () => {
    const storage = memoryStorage(); const runtime = mockRuntime(storage); const repo = createMockCompanyRepository(runtime);
    await repo.createBusinessConnection(access, "1234567890", "cache-evidence");
    const key = runtime.store.key("1", "company"); const state = JSON.parse(storage.getItem(key)!) as StoredState;
    Object.assign(state.requests["cache-evidence"].result.companyProfile.certifications.WOMEN_OWNED, { status: "INVALID" });
    storage.setItem(key, JSON.stringify(state));
    await expect(repo.getBusinessConnection(access)).rejects.toMatchObject({ status: 404 });
  });
  it("업무 mock은 실제 인증 포트의 토큰/refresh/fetch를 호출하지 않는다", async () => {
    const fetcher = vi.fn(); const getAccessToken = vi.fn(access.getAccessToken); const refresh = vi.fn(access.refresh);
    vi.stubGlobal("fetch", fetcher);
    try {
      const repo = createMockCompanyRepository({ ...mockRuntime(), authSource: "api" });
      expectEvidence((await repo.createBusinessConnection({ ...access, getAccessToken, refresh }, "1234567890", "hybrid-evidence")).companyProfile);
      expect(getAccessToken).not.toHaveBeenCalled(); expect(refresh).not.toHaveBeenCalled(); expect(fetcher).not.toHaveBeenCalled();
    } finally { vi.unstubAllGlobals(); }
  });
});

// Independent wire fixture based on the pinned backend response, not the mock factory.
const wireProfile: SignupCompanyProfile = {
  businessNumber: "1234567890", businessNumberSource: "USER_INPUT", companyName: "합성 회사", representativeName: null, representativeNameSource: null, openingDate: null, openingDateSource: null, baseAddress: null, detailAddress: null, telephoneNumber: null, companyInformationSource: "NARA_COMPANY", companyInformationCheckedAt: "2030-06-01T10:00:00+09:00", telephoneNumberSource: null, primaryIndustry: null, primaryIndustrySource: null,
  capability: { amountKrw: 321_000_000.5, assessmentYear: null, representativeLicenseStatus: "NO", source: "G2B_REPORT", sourceSnapshotDate: "2029-12-31" },
  certifications: { WOMEN_OWNED: { status: "UNKNOWN", source: "G2B_REPORT", sourceSnapshotDate: "2029-12-31" }, DISABLED_OWNED: { status: "YES", source: "G2B_REPORT", sourceSnapshotDate: "2028-12-31" }, SOCIAL_ENTERPRISE: { status: "NO", source: "G2B_REPORT", sourceSnapshotDate: "2029-06-01" } },
};
describe("가입 근거 HTTP fetch 대역 / 실제 API 아님", () => {
  it("번호 POST/GET와 문서 제안 GET이 모든 nullable/출처/기준일/인증 상태를 보존한다", async () => {
    const connection = { connectionId: "synthetic-connection", companyProfile: wireProfile };
    const fetcher = vi.fn<typeof fetch>(async input => ok(String(input).includes("company-registration-proposals") ? { proposalId: "synthetic-proposal", companyProfile: { ...wireProfile, businessNumberSource: "BUSINESS_REGISTRATION_CERTIFICATE" } } : connection));
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
    expect((await repo.createBusinessConnection(access, "1234567890", "wire-evidence")).companyProfile).toEqual(wireProfile);
    expect((await repo.getBusinessConnection(access)).companyProfile).toEqual(wireProfile);
    expect((await repo.getRegistrationProposal(access, "synthetic-proposal")).companyProfile).toEqual({ ...wireProfile, businessNumberSource: "BUSINESS_REGISTRATION_CERTIFICATE" });
    expect(fetcher.mock.calls.map(([url, init]) => [new URL(String(url)).pathname, init?.method ?? "GET"])).toEqual([["/api/v1/account-business-connections", "POST"], ["/api/v1/account-business-connections/current", "GET"], ["/api/v1/company-registration-proposals/synthetic-proposal", "GET"]]);
    expect(new Headers(fetcher.mock.calls[0][1]?.headers).get("Idempotency-Key")).toBe("wire-evidence");
  });
  it.each([403, 409, 503])("HTTP %s를 mock/미확인 성공으로 바꾸지 않는다", async status => {
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", async () => ok(null, status)));
    await expect(repo.getBusinessConnection(access)).rejects.toMatchObject({ status });
  });
  it("최종401은 인증 실패로 남고 자동 mock fallback이 없다", async () => {
    const fetcher = vi.fn<typeof fetch>(async () => ok(null, 401));
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
    await expect(repo.getBusinessConnection(access)).rejects.toMatchObject({ status: 401 });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});

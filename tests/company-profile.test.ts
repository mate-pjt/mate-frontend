import { describe, expect, it, vi } from "vitest";
import { createHttpCompanyRepository } from "@/data/company/http-repository";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { createHttpClient } from "@/data/shared/http";
import { access, mockRuntime, ok } from "./helpers";

const companyId = 7001;
const assessmentId = "00000000-0000-0000-0000-000000000061";
const subject = '합성 "amountKrw": 42, 공종';
const assessment = {
  assessmentId, version: 1, assessmentSubjectName: subject, amountKrw: "RAW",
  assessmentYear: null, representativeLicense: false, snapshotDate: "2024-02-29", provenanceType: "ADMIN_MANUAL",
};
const industry = { industryId: 1, industryCode: "0001", industryName: "합성 업종", assessments: [assessment] };
const capabilities = {
  asOf: null, representativeStatus: "NONE", representativeAssessmentId: null, industries: [industry], unmappedObservationCount: 2,
};
const noRow = { type: "WOMEN_OWNED", status: "UNKNOWN", version: 0, source: null, snapshotDate: null, confirmedAt: null };
const observed = { type: "DISABLED_OWNED", status: "UNKNOWN", version: 1, source: "AUTO_INITIAL", snapshotDate: "2025-12-31", confirmedAt: null };
const manual = { type: "SOCIAL_ENTERPRISE", status: "NO", version: 2, source: "ADMIN_MANUAL", snapshotDate: null, confirmedAt: "2026-02-01T00:00:00.123456789Z" };
const items = [manual, observed, noRow];

function capabilityResponse(rawAmount: string, data: unknown = capabilities) {
  return new Response(JSON.stringify({ isSuccess: true, data }).replaceAll('"RAW"', rawAmount));
}

function http(response: () => Response) {
  const fetcher = vi.fn<typeof fetch>().mockImplementation(async () => response());
  return { repo: createHttpCompanyRepository(createHttpClient("https://synthetic.test", fetcher)), fetcher };
}

describe("회사 프로필 HTTP 응답", () => {
  it.each([
    ["0", "0"],
    ["9007199254740993", "9007199254740993"],
    ["99999999999999999999", "99999999999999999999"],
    ["9.007199254740993e15", "9007199254740993"],
    ["1230.00e-1", "123"],
  ])("현재 조회의 정수 원을 정확히 보존한다 (%s)", async (wire, exact) => {
    const { repo, fetcher } = http(() => capabilityResponse(wire));
    await expect(repo.getCompanyConstructionCapabilities(access, companyId)).resolves.toMatchObject({
      representativeStatus: "NONE", unmappedObservationCount: 2,
      industries: [{ industryCode: "0001", assessments: [{ assessmentSubjectName: subject,
        amountKrw: exact, assessmentYear: null, representativeLicense: false, snapshotDate: "2024-02-29" }] }],
    });
    expect(fetcher).toHaveBeenCalledOnce();
    const [url, options] = fetcher.mock.calls[0];
    expect(url).toBe("https://synthetic.test/api/v1/companies/7001/construction-capability-assessments");
    expect(options).toMatchObject({ method: "GET", credentials: "include", cache: "no-store" });
    expect(new Headers(options?.headers).get("Authorization")).toBe("Bearer synthetic-token");
  });

  it.each(['"1"', "null", "-1", "0.000000000000000001", "1e-80", "1e9999999", "100000000000000000000", "1.", "01"])(
    "잘못된 원 단위 응답을 정상값으로 바꾸지 않는다 (%s)", async wire => {
      const { repo } = http(() => capabilityResponse(wire));
      await expect(repo.getCompanyConstructionCapabilities(access, companyId)).rejects.toBeInstanceOf(Error);
    },
  );

  it("서버의 대표 ID를 보존하고 최고액 또는 첫 행으로 대표를 정하지 않는다", async () => {
    const selection = "00000000-0000-0000-0000-000000000062";
    const data = { ...capabilities, representativeStatus: "SELECTED", representativeAssessmentId: selection, industries: [
      industry, { ...industry, industryCode: "0036", assessments: [{ ...assessment, assessmentId: selection,
        amountKrw: 0, assessmentYear: 2025, representativeLicense: true, snapshotDate: null }] },
    ] };
    const { repo } = http(() => capabilityResponse("9007199254740993", data));
    const result = await repo.getCompanyConstructionCapabilities(access, companyId);
    expect(result.representativeAssessmentId).toBe(selection);
    expect(result.industries.map(group => group.assessments[0].amountKrw)).toEqual(["9007199254740993", "0"]);
  });

  it("저장 자료 없음과 대표 평가 판단 불가를 그대로 전달한다", async () => {
    const none = http(() => capabilityResponse("0", { ...capabilities, industries: [] })).repo;
    await expect(none.getCompanyConstructionCapabilities(access, companyId)).resolves.toMatchObject({ industries: [], representativeStatus: "NONE" });
    const unknown = http(() => capabilityResponse("0", { ...capabilities, representativeStatus: "UNDETERMINED" })).repo;
    await expect(unknown.getCompanyConstructionCapabilities(access, companyId)).resolves.toMatchObject({ representativeStatus: "UNDETERMINED" });
  });

  it.each([
    { ...capabilities, asOf: "2024-02-29" },
    { ...capabilities, representativeStatus: "SELECTED" },
    { ...capabilities, representativeAssessmentId: assessmentId },
    { ...capabilities, industries: [industry, industry] },
    { ...capabilities, industries: [{ ...industry, assessments: [{ ...assessment, snapshotDate: "2025-02-29" }] }] },
    { ...capabilities, industries: [{ ...industry, assessments: [{ ...assessment, assessmentYear: undefined }] }] },
  ])("대표 상태·중복·날짜·평가연도가 손상되면 해당 조회를 실패시킨다", async data => {
    const { repo } = http(() => capabilityResponse("0", data));
    await expect(repo.getCompanyConstructionCapabilities(access, companyId)).rejects.toMatchObject({ code: "COMPANY_PROFILE_RESPONSE_INVALID" });
  });

  it("인증 3종의 순서와 관측·저장 부재·수기 근거를 보존한다", async () => {
    const { repo, fetcher } = http(() => ok({ items }));
    await expect(repo.getCompanyPublicCertifications(access, companyId)).resolves.toEqual(
      [noRow, observed, manual].map(item => ({ type: item.type, status: item.status, source: item.source,
        snapshotDate: item.snapshotDate, confirmedAt: item.confirmedAt })),
    );
    expect(fetcher.mock.calls[0][0]).toBe("https://synthetic.test/api/v1/companies/7001/public-certifications");
  });

  it.each([
    [manual, observed],
    [manual, observed, observed],
    [manual, observed, { ...noRow, status: "NO" }],
    [manual, observed, { ...noRow, version: 1 }],
    [manual, observed, { ...noRow, type: "OTHER" }],
    [{ ...manual, confirmedAt: "2026-02-30T00:00:00Z" }, observed, noRow],
  ].map(value => [value]))("누락·중복·잘못된 근거를 인증 미해당으로 처리하지 않는다", async value => {
    const { repo } = http(() => ok({ items: value }));
    await expect(repo.getCompanyPublicCertifications(access, companyId)).rejects.toMatchObject({ code: "COMPANY_PROFILE_RESPONSE_INVALID" });
  });

  it("권한 오류와 잘못된 회사 입력에서는 다른 공급원이나 GET으로 대체하지 않는다", async () => {
    const { repo, fetcher } = http(() => new Response(JSON.stringify({ isSuccess: false, code: "CM005" }), { status: 403 }));
    await expect(repo.getCompanyConstructionCapabilities(access, companyId)).rejects.toMatchObject({ status: 403, code: "CM005" });
    await expect(repo.getCompanyPublicCertifications(access, -1)).rejects.toMatchObject({ status: 400 });
    expect(fetcher).toHaveBeenCalledOnce();
  });
});

describe("회사 프로필 합성 공급원", () => {
  it("회사·권한을 확인하고 다른 계정이나 호출에 값을 넘기지 않는다", async () => {
    const repo = createMockCompanyRepository(mockRuntime(undefined, { company: "connected" }));
    const result = await repo.getCompanyConstructionCapabilities(access, companyId);
    result.industries[0].assessments[0].amountKrw = "123";
    const other = { ...access, getAccountKey: () => "2" };
    const fresh = await repo.getCompanyConstructionCapabilities(other, companyId);
    expect(fresh.industries[0].assessments[0].amountKrw).toBe("3470000000");
    await expect(repo.getCompanyPublicCertifications(other, 7002)).rejects.toMatchObject({ status: 403 });
    const unaffiliated = createMockCompanyRepository(mockRuntime());
    await expect(unaffiliated.getCompanyPublicCertifications(access, companyId)).rejects.toMatchObject({ status: 403 });
  });

  it("API 인증과 회사 mock을 혼용해도 실제 토큰을 읽지 않는다", async () => {
    const repo = createMockCompanyRepository({ ...mockRuntime(undefined, { company: "profile-empty" }), authSource: "api" });
    const scoped = { ...access, getAccessToken: vi.fn(), refresh: vi.fn() };
    await expect(repo.getCompanyConstructionCapabilities(scoped, companyId)).resolves.toMatchObject({ industries: [] });
    const certs = await repo.getCompanyPublicCertifications(scoped, companyId);
    expect(certs).toHaveLength(3);
    expect(certs.every(item => item.status === "UNKNOWN" && item.source === null)).toBe(true);
    expect(scoped.getAccessToken).not.toHaveBeenCalled();
    expect(scoped.refresh).not.toHaveBeenCalled();
  });

  it("명시 시나리오는 지정 섹션에만 실패를 반환한다", async () => {
    const repo = createMockCompanyRepository(mockRuntime(undefined, { company: "profile-certification-error" }));
    await expect(repo.getCompanyPublicCertifications(access, companyId)).rejects.toMatchObject({ status: 503 });
    await expect(repo.getCompanyConstructionCapabilities(access, companyId)).resolves.toMatchObject({ representativeStatus: "SELECTED" });
  });
});

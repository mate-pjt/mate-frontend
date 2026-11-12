import { describe, expect, it, vi } from "vitest";
import { mapCompanyBasicProfile } from "@/data/company/api-mapper";
import { createHttpCompanyRepository } from "@/data/company/http-repository";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { memoryStorage } from "@/data/mock/store";
import { createHttpClient } from "@/data/shared/http";
import { access, authentication, mockRuntime, ok } from "./helpers";

const first = { code: "0001", name: "토목공사업" };
const second = { code: "0036", name: "정보통신공사업" };
const basic = () => ({ companyId: 77, companyName: "합성 회사", businessNumber: "1234567890", representativeName: null, verificationStatus: "VERIFIED", address: null, telephoneNumber: null, establishedYear: null });
const connectedAccess = { ...access, refresh: async () => ({ ...authentication(), companyContext: { companyId: 77, role: "ADMIN" as const } }) };

async function httpOverview(data: unknown) {
  const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok(data));
  const repo = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
  return { overview: await repo.getMyCompanyOverview(connectedAccess), fetcher };
}

describe("기본정보 주력업종 / HTTP 경계", () => {
  it.each([[], [first], [second, first], [first, second, first]].map(items => [items]))("전체 목록과 서버 순서를 보존하고 정확한 중복만 제거한다 (%j)", async items => {
    const { overview, fetcher } = await httpOverview({ ...basic(), primaryIndustries: items, primaryIndustry: { code: "legacy", name: "구형 값" } });
    expect(overview).toEqual({ status: "connected", profile: { ...basic(), primaryIndustries: [...new Map(items.map(item => [item.code, item])).values()] } });
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher.mock.calls[0][0]).toBe("https://synthetic-api.test/api/v1/companies/77");
    expect(fetcher.mock.calls[0][1]).toMatchObject({ credentials: "include", cache: "no-store" });
  });
  it.each([first, null])("목록이 없는 구형 응답에서만 nullable 단일 값을 호환한다 (%j)", async legacy => {
    const { overview } = await httpOverview({ ...basic(), primaryIndustry: legacy });
    expect(overview).toMatchObject({ profile: { primaryIndustries: legacy === null ? [] : [first] } });
  });
  it("신형 목록이 있으면 legacy 결측/오류를 표시값에 섞지 않는다", () => {
    expect(mapCompanyBasicProfile({ ...basic(), primaryIndustries: [first, second], primaryIndustry: 42 }).primaryIndustries).toEqual([first, second]);
  });
  it.each([null, {}, "0001", [null], [first, null], [{ name: "코드 없음" }], [{ code: "0001" }], [{ code: " ", name: "공백 코드" }], [{ code: "0001", name: " " }], [first, { ...first, name: "충돌 이름" }]].map(items => [items]))("잘못된 신형 목록은 legacy나 빈 성공으로 숨기지 않는다 (%j)", async items => {
    await expect(httpOverview({ ...basic(), primaryIndustries: items, primaryIndustry: first })).rejects.toMatchObject({ code: "COMPANY_PROFILE_INVALID" });
  });
  it.each([{}, { primaryIndustry: undefined }, { primaryIndustry: { code: "0001" } }])("업종 전체 결측/잘못된 legacy는 오류다 (%j)", async fields => {
    await expect(httpOverview({ ...basic(), ...fields })).rejects.toMatchObject({ code: "COMPANY_PROFILE_INVALID" });
  });
  it("잘못된 기본정보와 다른 회사 응답을 거부한다", async () => {
    await expect(httpOverview({ ...basic(), primaryIndustries: [], address: { baseAddress: "부분 주소" } })).rejects.toMatchObject({ code: "COMPANY_PROFILE_INVALID" });
    await expect(httpOverview({ ...basic(), companyId: 78, primaryIndustries: [first] })).rejects.toMatchObject({ code: "COMPANY_MISMATCH" });
  });
  it.each([403, 409, 500])("권한/충돌/서버 오류를 보존하고 fallback하지 않는다 (%i)", async status => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok(null, status));
    const repo = createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
    await expect(repo.getMyCompanyOverview(connectedAccess)).rejects.toMatchObject({ status });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});

describe("기본정보 주력업종 / mock 복원", () => {
  it("신규 복수 목록을 생성하고 같은 탭 새로고침에서 보존한다", async () => {
    const storage = memoryStorage();
    const repo = createMockCompanyRepository(mockRuntime(storage, { company: "connected" }));
    const expected = await repo.getMyCompanyOverview(access);
    expect(expected).toMatchObject({ profile: { primaryIndustries: [first, second] } });
    expect(await createMockCompanyRepository(mockRuntime(storage, { company: "connected" })).getMyCompanyOverview(access)).toEqual(expected);
  });
  it.each([first, null])("구형 단일값을 변환하면서 문서/멱등 replay·계정/다른 영역을 보존한다 (%j)", async legacy => {
    const storage = memoryStorage(); const runtime = mockRuntime(storage);
    const repo = createMockCompanyRepository(runtime);
    const connection = await repo.createBusinessConnection(access, "1234567890", "connection-key");
    for (let i = 0; i < 3; i++) await repo.getBusinessConnection(access);
    const body = { connectionId: connection.connectionId, preferredBidNoticeAmountRange: "ANY" as const, representative: true, positionName: null };
    const registration = await repo.createUnverifiedCompany(access, body, "register-key");
    const upload = await repo.createDocumentUpload(access, new File(["synthetic"], "fixture.pdf", { type: "application/pdf" }), "upload-key");
    const other = { ...access, getAccountKey: () => "2" };
    await repo.requestMembership(other, { companyId: 7001, representative: false, positionId: 1, proposedPositionName: null, message: null });
    const otherKey = runtime.store.key("2", "company"); const otherBefore = storage.getItem(otherKey);
    const notificationKey = runtime.store.key("1", "notifications"); storage.setItem(notificationKey, "keep-notifications");
    storage.setItem("mate:signup-document:1", "keep-real-document-handle");
    const key = runtime.store.key("1", "company"); const state = JSON.parse(storage.getItem(key)!);
    const documents = structuredClone(state.documents); const requests = structuredClone(state.requests);
    delete state.basicProfileVersion; delete state.overview.profile.primaryIndustries; state.overview.profile.primaryIndustry = legacy;
    storage.setItem(key, JSON.stringify(state));
    const restored = createMockCompanyRepository(mockRuntime(storage));
    expect(await restored.getMyCompanyOverview(access)).toMatchObject({ profile: { primaryIndustries: legacy === null ? [] : [first] } });
    expect(await restored.createUnverifiedCompany(access, body, "register-key")).toEqual(registration);
    expect(await restored.getDocumentProcessing(access, upload.documentId)).toMatchObject({ versionId: upload.versionId, status: "UPLOAD_PENDING" });
    const saved = JSON.parse(storage.getItem(key)!);
    expect(saved).toMatchObject({ basicProfileVersion: 1, signupEvidenceVersion: 1, documents, requests });
    expect(saved.overview.profile).not.toHaveProperty("primaryIndustry");
    expect(storage.getItem(otherKey)).toBe(otherBefore); expect(storage.getItem(notificationKey)).toBe("keep-notifications");
    expect(storage.getItem("mate:signup-document:1")).toBe("keep-real-document-handle");
  });
  it("문서 등록의 선택 업종이 전체 기본정보 목록을 축소하지 않는다", async () => {
    const repo = createMockCompanyRepository(mockRuntime());
    const file = new File(["synthetic"], "fixture.pdf", { type: "application/pdf" });
    const upload = await repo.createDocumentUpload(access, file, "verified-upload");
    await repo.uploadDocumentFile(access, upload.uploadHandle, file);
    await repo.completeDocumentUpload(access, upload.documentId, upload.versionId);
    let processing = await repo.getDocumentProcessing(access, upload.documentId);
    for (let i = 0; i < 3 && !processing.proposalId; i++) processing = await repo.getDocumentProcessing(access, upload.documentId);
    const proposal = await repo.getRegistrationProposal(access, processing.proposalId!);
    const body = { proposalId: proposal.proposalId, documentId: proposal.documentId, versionId: proposal.versionId, revision: proposal.revision, telephoneNumber: null, primaryIndustryCode: second.code, preferredBidNoticeAmountRange: "ANY" as const, representative: true, positionName: null, conflictChoice: null, businessNumberCorrectionChoice: null };
    await repo.createVerifiedCompany(access, body, "verified-register");
    expect(await repo.getMyCompanyOverview(access)).toMatchObject({ profile: { primaryIndustries: [first, second] } });
  });
  it.each([null, [first, first], [{ code: "", name: "잘못된 값" }]].map(items => [items]))("잘못된 새 목록은 해당 회사 영역만 초기화한다 (%j)", async primaryIndustries => {
    const storage = memoryStorage(); const runtime = mockRuntime(storage);
    const repo = createMockCompanyRepository(runtime); await repo.requestMembership(access, { companyId: 7001, representative: false, positionId: 1, proposedPositionName: null, message: null });
    const key = runtime.store.key("1", "company"); const state = JSON.parse(storage.getItem(key)!);
    state.overview = { status: "connected", profile: { ...basic(), primaryIndustries } };
    storage.setItem(key, JSON.stringify(state)); storage.setItem("unrelated", "keep");
    expect(await createMockCompanyRepository(mockRuntime(storage)).getMyCompanyOverview(access)).toEqual({ status: "empty" });
    expect(storage.getItem("unrelated")).toBe("keep");
  });
});

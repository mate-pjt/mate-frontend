import { describe, expect, it, vi } from "vitest";
import type { CompanyConstructionCapabilities, CurrentCompanyPermissions } from "@/data/company/contracts";
import { createHttpCompanyRepository } from "@/data/company/http-repository";
import { ApiError } from "@/data/shared/errors";
import { createHttpClient } from "@/data/shared/http";
import { loadCompanyProfileSections } from "@/features/company/company-profile";
import { access, ok } from "./helpers";

type ProfileRead = Parameters<typeof loadCompanyProfileSections>[0];
const membership: CurrentCompanyPermissions = { companyId: 7001, membershipId: 11, permissionCodes: ["COMPANY_INFORMATION_VIEW"] };
const capabilities: CompanyConstructionCapabilities = {
  representativeStatus: "NONE", representativeAssessmentId: null, industries: [], unmappedObservationCount: 0,
};

function testRead() {
  const controller = new AbortController();
  const input = {
    access, companyId: 7001, signal: controller.signal,
    isCurrent: vi.fn(() => true), onAccessLost: vi.fn(),
    onCapabilities: vi.fn(), onCertifications: vi.fn(),
  } satisfies ProfileRead;
  const repository = {
    getCurrentCompanyPermissions: vi.fn().mockResolvedValue(membership),
    getCompanyConstructionCapabilities: vi.fn().mockResolvedValue(capabilities),
    getCompanyPublicCertifications: vi.fn().mockResolvedValue([]),
  };
  return { controller, input, repository };
}

describe("현재 회사 프로필의 조회 수명", () => {
  it("한 쪽이 지연돼도 빠른 결과를 표시하며 일반 실패는 그 쪽에만 적용한다", async () => {
    const { input, repository } = testRead();
    const { promise, reject } = Promise.withResolvers();
    repository.getCompanyConstructionCapabilities.mockReturnValue(promise);
    const loading = loadCompanyProfileSections(input, repository);
    await vi.waitFor(() => expect(input.onCertifications).toHaveBeenCalledWith({ status: "ready", value: [] }));
    expect(input.onCapabilities).not.toHaveBeenCalled();
    reject(new ApiError(503, "SERVICE_UNAVAILABLE", "합성 오류"));
    await loading;
    expect(input.onCapabilities).toHaveBeenCalledWith({ status: "error" });
    expect(input.onAccessLost).not.toHaveBeenCalled();
  });

  it("해당 leaf가 없으면 역할을 사용하거나 두 조회를 보내지 않는다", async () => {
    const { input, repository } = testRead();
    repository.getCurrentCompanyPermissions.mockResolvedValue({ ...membership, permissionCodes: ["COMPANY_MEMBER_LIST_VIEW"], role: "ADMIN" });
    await loadCompanyProfileSections(input, repository);
    expect(input.onAccessLost).toHaveBeenCalledWith("denied");
    expect(repository.getCompanyConstructionCapabilities).not.toHaveBeenCalled();
    expect(repository.getCompanyPublicCertifications).not.toHaveBeenCalled();
  });

  it("403인 섹션과 현재 권한이 여전히 유효한 다른 섹션을 구분한다", async () => {
    const { input, repository } = testRead();
    repository.getCompanyPublicCertifications.mockRejectedValue(new ApiError(403, "CM005", "합성 오류"));
    await loadCompanyProfileSections(input, repository);
    expect(input.onCertifications).toHaveBeenCalledWith({ status: "denied" });
    expect(input.onCapabilities).toHaveBeenCalledWith({ status: "ready", value: capabilities });
    expect(input.onAccessLost).not.toHaveBeenCalled();
  });

  it("명시 재시도는 요청한 섹션만 조회하고 기존과 동일한 소속을 요구한다", async () => {
    const { input, repository } = testRead();
    const retry = { ...input, onCertifications: undefined, previousMembershipId: membership.membershipId };
    await loadCompanyProfileSections(retry, repository);
    expect(repository.getCompanyConstructionCapabilities).toHaveBeenCalledOnce();
    expect(repository.getCompanyPublicCertifications).not.toHaveBeenCalled();
    repository.getCurrentCompanyPermissions.mockResolvedValue({ ...membership, membershipId: membership.membershipId + 1 });
    await loadCompanyProfileSections(retry, repository);
    expect(input.onAccessLost).toHaveBeenCalledWith("denied");
    expect(repository.getCompanyConstructionCapabilities).toHaveBeenCalledOnce();
  });

  it("응답 도착 사이에 소속이 해제되면 이미 표시한 인증과 늦은 평가액을 내려야 한다", async () => {
    const { input, repository } = testRead();
    const { promise, resolve } = Promise.withResolvers();
    repository.getCompanyConstructionCapabilities.mockReturnValue(promise);
    const loading = loadCompanyProfileSections(input, repository);
    await vi.waitFor(() => expect(input.onCertifications).toHaveBeenCalledOnce());
    repository.getCurrentCompanyPermissions.mockRejectedValue(new ApiError(403, "CM005", "합성 오류"));
    resolve(capabilities);
    await loading;
    expect(input.onAccessLost).toHaveBeenCalledWith("denied");
    expect(input.onCapabilities).not.toHaveBeenCalled();
  });

  it.each(["abort", "새 세션 범위"])("%s 뒤의 성공 응답과 후속 권한 조회를 폐기한다", async mode => {
    const { input, controller, repository } = testRead();
    const { promise, resolve } = Promise.withResolvers();
    repository.getCompanyConstructionCapabilities.mockReturnValue(promise);
    const loading = loadCompanyProfileSections({ ...input, onCertifications: undefined }, repository);
    await vi.waitFor(() => expect(repository.getCompanyConstructionCapabilities).toHaveBeenCalledOnce());
    if (mode === "abort") controller.abort();
    else input.isCurrent.mockReturnValue(false);
    resolve(capabilities);
    await loading;
    expect(repository.getCurrentCompanyPermissions).toHaveBeenCalledOnce();
    expect(input.onCapabilities).not.toHaveBeenCalled();
    expect(input.onAccessLost).not.toHaveBeenCalled();
  });

  it("권한 재확인 자체가 실패하면 자료를 공개하지 않고 다시 확인할 수 있다", async () => {
    const { input, repository } = testRead();
    repository.getCurrentCompanyPermissions.mockResolvedValueOnce(membership).mockRejectedValueOnce(new Error("연결 실패"));
    await loadCompanyProfileSections({ ...input, onCertifications: undefined }, repository);
    expect(input.onCapabilities).toHaveBeenCalledWith({ status: "error" });
  });

  it("HTTP의 최종 401은 세션 갱신을 1회 사용하고 두 조회의 보호값을 내린다", async () => {
    const { input } = testRead();
    const refresh = vi.fn(access.refresh);
    const fetcher = vi.fn<typeof fetch>().mockImplementation(async (url) => String(url).endsWith("memberships/me")
      ? ok(membership)
      : new Response(JSON.stringify({ isSuccess: false, code: "SESSION_REPLACED" }), { status: 401 }));
    const repository = createHttpCompanyRepository(createHttpClient("https://synthetic.test", fetcher));
    await loadCompanyProfileSections({ ...input, access: { ...access, refresh }, onCertifications: undefined }, repository);
    expect(refresh).toHaveBeenCalledOnce();
    expect(fetcher).toHaveBeenCalledTimes(3);
    expect(input.onAccessLost).toHaveBeenCalledWith("unauthorized");
    expect(input.onCapabilities).not.toHaveBeenCalled();
  });
});

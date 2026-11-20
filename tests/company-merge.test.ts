import { describe, expect, it, vi } from "vitest";

import { createHttpCompanyRepository } from "@/data/company/http-repository";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { canSubmitCompanyMerge, normalizeCompanyMergeAction, type CompanyMergeAction } from "@/data/company/contracts";
import { memoryStorage } from "@/data/mock/store";
import { createHttpClient } from "@/data/shared/http";
import { access, mockRuntime, ok, testNow } from "./helpers";

const timestamp = (days: number) => new Date(testNow + days * 86_400_000).toISOString();
const response = (extra: Record<string, unknown> = {}) => ({
  caseId: 9401, type: "CROSS_COMPANY", status: "REVIEW_PENDING", sourceCompanyId: 7002, sourceCompanyName: "가상 원본", verifiedCompanyId: 7001,
  verifiedCompanyName: "가상 인증", revision: 5, reviewRequested: false, decisionDueAt: timestamp(7),
  members: [{ displayName: "표시를 검사하는 합성 팀원" }], manualSettings: { userConfirmedIndustryCount: 3 },
  actions: { canRequest: true, canPropose: null, canRespondToProposal: false, canReview: null }, ...extra,
});
const base = "/api/v1/companies/7002/merge-cases";

describe("회사 통합 wire 계약", () => {
  it("current의 실제 204만 빈 값으로 읽고 상세·명령의 빈 응답은 거부한다", async () => {
    const fetcher = vi.fn(async () => new Response(null, { status: 204 }));
    const repo = createHttpCompanyRepository(createHttpClient("http://test", fetcher));
    expect(await repo.getCurrentCompanyMergeCase(access, 7002)).toBeNull();
    await expect(repo.getCompanyMergeCase(access, 7002, 9401)).rejects.toMatchObject({ status: 204 });
    await expect(repo.submitCompanyMerge(access, 7002, 9401, 5, { kind: "request", message: null })).rejects.toMatchObject({ status: 204 });
  });

  it("최소 상태만 복사하고 nullable capability와 정확한 상세 URL을 유지한다", async () => {
    const fetcher = vi.fn<typeof fetch>(async () => ok(response()));
    const repo = createHttpCompanyRepository(createHttpClient("http://test", fetcher));
    const value = await repo.getCompanyMergeCase(access, 7002, 9401);
    expect(value).toMatchObject({ caseId: 9401, source: { id: 7002 }, verified: { id: 7001 }, actions: { canRequest: true, canPropose: null, canRespondToProposal: false } });
    expect(value).not.toHaveProperty("members");
    expect(value).not.toHaveProperty("manualSettings");
    expect(fetcher).toHaveBeenCalledWith(`http://test${base}/9401`, expect.objectContaining({ method: "GET", credentials: "include", cache: "no-store" }));
  });

  it.each([null, response({ caseId: 9402 }), response({ revision: 0 }), response({ actions: { canRequest: "true" } }),
    response({ sourceCompanyId: 7003 }), response({ verifiedCompanyId: 7002 }), response({ decisionDueAt: "2026-02-31T00:00:00Z" }),
    response({ proposalResponse: { decision: "ACCEPT", respondedAt: timestamp(1) } }), response({ status: "FINALIZED" })])("손상되거나 다른 사건의 상세는 표시를 막는다", async data => {
    const repo = createHttpCompanyRepository(createHttpClient("http://test", async () => ok(data)));
    await expect(repo.getCompanyMergeCase(access, 7002, 9401)).rejects.toBeDefined();
  });

  const commands: Array<[CompanyMergeAction, string, Record<string, unknown>]> = [
    [{ kind: "request", message: "  가상 신청  " }, "/request", { message: "가상 신청" }],
    [{ kind: "propose", message: " " }, "/proposals", { message: null }],
    [{ kind: "accept" }, "/proposal-responses", { decision: "ACCEPT", reason: null }],
    [{ kind: "decline", reason: " 가상 사유 " }, "/proposal-responses", { decision: "DECLINE", reason: "가상 사유" }],
  ];
  it.each(commands)("%j의 명세 본문과 POST 경로를 적용하고 401에서 재전송하지 않는다", async (action, tail, body) => {
    const fetcher = vi.fn<typeof fetch>(async () => ok(null, 401));
    const repo = createHttpCompanyRepository(createHttpClient("http://test", fetcher));
    const refresh = vi.fn(access.refresh);
    const companyId = action.kind === "propose" ? 7001 : 7002;
    await expect(repo.submitCompanyMerge({ ...access, refresh }, companyId, 9401, 5, action)).rejects.toMatchObject({ status: 401 });
    expect(fetcher).toHaveBeenCalledExactlyOnceWith(`http://test/api/v1/companies/${companyId}/merge-cases/9401${tail}`, expect.objectContaining({
      method: "POST", body: JSON.stringify({ expectedRevision: 5, ...body }), cache: "no-store",
    }));
    expect(refresh).not.toHaveBeenCalled();
  });

  it("길이와 제어 문자·사유 필수를 검증하고 Kotlin의 BOM 경계를 보존한다", () => {
    expect(normalizeCompanyMergeAction({ kind: "decline", reason: "　\ufeff　" })).toEqual({ kind: "decline", reason: "\ufeff" });
    expect(normalizeCompanyMergeAction({ kind: "request", message: "가".repeat(1000) }).kind).toBe("request");
    const invalid: CompanyMergeAction[] = [{ kind: "request", message: "가".repeat(1001) }, { kind: "propose", message: "첫 줄\n두 번째 줄" },
      { kind: "decline", reason: "　" }, { kind: "decline", reason: "가".repeat(501) }];
    invalid.forEach(action => expect(() => normalizeCompanyMergeAction(action)).toThrow());
  });
});

describe("회사 통합 합성 저장소", () => {
  it("요청은 한 revision에서 한 번만 저장되며 새로고침과 다른 계정이 분리된다", async () => {
    const storage = memoryStorage();
    const repo = () => createMockCompanyRepository(mockRuntime(storage, { company: "merge" }));
    const first = repo();
    const results = await Promise.allSettled([
      first.submitCompanyMerge(access, 7002, 9401, 1, { kind: "request", message: "가상 팀 요청" }),
      first.submitCompanyMerge(access, 7002, 9401, 1, { kind: "request", message: "중복" }),
    ]);
    expect(results.map(value => value.status)).toEqual(["fulfilled", "rejected"]);
    expect(await repo().getCurrentCompanyMergeCase(access, 7002)).toMatchObject({ revision: 2, status: "REVIEW_PENDING", reviewRequested: true,
      reviewOpening: { origin: "SOURCE_REQUEST" }, requestMessage: "가상 팀 요청", actions: { canRequest: false } });
    const alternate = { ...access, getAccountKey: () => "2" };
    const second = repo();
    expect(await second.getCurrentCompanyMergeCase(alternate, 7001)).toMatchObject({ caseId: 9402, reviewRequested: false, requestMessage: null });
    await expect(second.getCompanyMergeCase(alternate, 7001, 9401)).rejects.toMatchObject({ status: 404 });
    expect(await second.submitCompanyMerge(alternate, 7001, 9402, 1, { kind: "propose", message: null })).toMatchObject({
      revision: 2, reviewOpening: null, proposal: { responseDueAt: timestamp(7) }, actions: { canPropose: false },
    });
  });

  it.each(["accept", "decline"] as const)("원본의 %s 응답은 직접 신청이나 실제 통합이 아니다", async kind => {
    const repo = createMockCompanyRepository(mockRuntime(undefined, { company: "merge-proposal" }));
    const action = kind === "accept" ? { kind } as const : { kind, reason: "합성 거절" } as const;
    const result = await repo.submitCompanyMerge(access, 7002, 9401, 1, action);
    expect(result).toMatchObject({ reviewRequested: false, revision: 2, proposalResponse: { decision: kind === "accept" ? "ACCEPT" : "DECLINE" }, finalizedAt: null });
    expect(result.status).toBe(kind === "accept" ? "REVIEW_PENDING" : "REJECTED");
    expect(result.reviewOpening?.origin ?? null).toBe(kind === "accept" ? "SOURCE_ACCEPTED" : null);
  });

  it.each(["merge", "merge-proposal"])("%s 합성 사건의 기한 직전/정확한 경계에서 서버 상태를 다르게 모사한다", async scenario => {
    let now = testNow;
    const repo = createMockCompanyRepository(mockRuntime(undefined, { company: scenario }, () => now));
    const initial = await repo.getCurrentCompanyMergeCase(access, 7002);
    expect(initial?.actions.canRequest).toBe(true);
    now += 7 * 86_400_000 - 1;
    expect((await repo.getCurrentCompanyMergeCase(access, 7002))?.actions.canRequest).toBe(true);
    now += 1;
    const current = await repo.getCurrentCompanyMergeCase(access, 7002);
    if (scenario === "merge") expect(current).toBeNull();
    else expect(current).toMatchObject({ reviewOpening: { origin: "TARGET_PROPOSAL_TIMEOUT" }, reviewRequested: false, proposalResponse: null, actions: { canRequest: false, canRespondToProposal: false } });
    const exact = await repo.getCompanyMergeCase(access, 7002, 9401);
    expect(exact).toMatchObject({ revision: 2, status: scenario === "merge" ? "CLEANUP_PENDING" : "REVIEW_PENDING", finalizedAt: null });
  });

  it("기존 자체 인증은 같은 회사 사건이며 새 신청·제안이 열리지 않는다", async () => {
    const repo = createMockCompanyRepository(mockRuntime(undefined, { company: "merge-in-place" }));
    const value = await repo.getCurrentCompanyMergeCase(access, 7001);
    expect(value).toMatchObject({ type: "IN_PLACE_MEMBER_REVIEW", source: { id: 7001 }, verified: { id: 7001 }, reviewOpening: { origin: "IN_PLACE_REGISTRATION" } });
    expect(canSubmitCompanyMerge(value!, 7001, ["COMPANY_MERGE_REQUEST", "COMPANY_MERGE_REVIEW"], "request")).toBe(false);
    await expect(repo.submitCompanyMerge(access, 7001, 9401, 1, { kind: "propose", message: null })).rejects.toMatchObject({ status: 409 });
    const ownVerification = createMockCompanyRepository(mockRuntime(undefined, { company: "connected" }));
    expect(await ownVerification.getCurrentCompanyMergeCase(access, 7001)).toBeNull();
  });
});

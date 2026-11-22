import { describe, expect, it, vi } from "vitest";
import { createHttpCompanyRepository } from "@/data/company/http-repository";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { canSubmitCompanyMerge, normalizeCompanyMergeAction, type CompanyMergeAction } from "@/data/company/contracts";
import { createHttpClient } from "@/data/shared/http";
import { companyMergeReference, submitCurrentCompanyMerge, type CompanyMergeSnapshot } from "@/features/company/company-merge";
import { access, mockRuntime, ok, testNow } from "./helpers";

const commandId = "bc9469d8-0d45-43c2-801b-d768845861ea";
const time = (days: number) => new Date(testNow + days * 86_400_000).toISOString();
const wire = () => ({ caseId: 9401, type: "CROSS_COMPANY", status: "REVIEW_PENDING", sourceCompanyId: 7002,
  sourceCompanyName: "합성 원본", verifiedCompanyId: 7001, verifiedCompanyName: "합성 인증", revision: 7,
  reviewRequested: false, requestMessage: null, decisionDueAt: time(7), actions: { canRequest: false, canWithdrawProposal: true },
  proposal: { message: "합성 제안", proposedAt: time(0), responseDueAt: time(7) },
  proposalRound: { roundId: 5, status: "ACTIVE", sentAt: time(1), message: "합성 제안" } });

describe("회사 통합 회차 명령", () => {
  it.each([
    [{ kind: "withdraw-request", roundId: 5 }, "request-rounds/5/withdrawals", {}],
    [{ kind: "withdraw-proposal", roundId: 5 }, "proposal-rounds/5/withdrawals", {}],
    [{ kind: "resend-request", roundId: 5, commandId, message: " 새 메시지 " }, "request-rounds/5/resends", { commandId, message: "새 메시지" }],
    [{ kind: "resend-proposal", roundId: 5, commandId, message: " " }, "proposal-rounds/5/resends", { commandId, message: null }],
  ] as const)("%j는 회차 경로와 명령 본문을 보존한다", async (action, tail, body) => {
    const fetcher = vi.fn<typeof fetch>(async () => ok(wire()));
    const repo = createHttpCompanyRepository(createHttpClient("http://test", fetcher));
    await repo.submitCompanyMerge(access, 7001, 9401, 6, action);
    expect(fetcher).toHaveBeenCalledExactlyOnceWith(`http://test/api/v1/companies/7001/merge-cases/9401/${tail}`,
      expect.objectContaining({ method: "POST", body: JSON.stringify({ expectedRevision: 6, ...body }) }));
  });

  it("응답은 선택한 회차를 보내고 API 오류로 재전송하지 않는다", async () => {
    const fetcher = vi.fn<typeof fetch>(async () => ok(null, 409));
    const repo = createHttpCompanyRepository(createHttpClient("http://test", fetcher));
    await expect(repo.submitCompanyMerge(access, 7002, 9401, 6, { kind: "accept", roundId: 3 })).rejects.toMatchObject({ status: 409 });
    expect(fetcher).toHaveBeenCalledOnce();
    expect(JSON.parse(String(fetcher.mock.calls[0][1]?.body))).toEqual({ expectedRevision: 6, decision: "ACCEPT", reason: null, roundId: 3 });
  });

  it.each([0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1])("회차 %s를 거부한다", roundId => {
    expect(() => normalizeCompanyMergeAction({ kind: "withdraw-request", roundId })).toThrow();
  });
  it("재발송 commandId 없음을 거부한다", () => {
    expect(() => normalizeCompanyMergeAction({ kind: "resend-request", roundId: 1, commandId: "", message: null })).toThrow();
  });
  it.each(["UNKNOWN", null, 7])("알 수 없는 회차 상태 %s를 표시하지 않는다", async status => {
    const repo = createHttpCompanyRepository(createHttpClient("http://test", async () => ok({ ...wire(), proposalRound: { ...wire().proposalRound, status } })));
    await expect(repo.getCompanyMergeCase(access, 7002, 9401)).rejects.toMatchObject({ code: "MERGE_RESPONSE_INVALID" });
  });

  for (const kind of ["request", "propose"] as const) {
    it(`${kind} 철회/명시 재발송은 사건과 마감을 보존하며 새 회차를 만든다`, async () => {
      let now = testNow;
      const repo = createMockCompanyRepository(mockRuntime(undefined, { company: "merge" }, () => now));
      const port = kind === "request" ? access : { ...access, getAccountKey: () => "2" };
      const company = kind === "request" ? 7002 : 7001;
      const initial = (await repo.getCurrentCompanyMergeCase(port, company))!;
      const sent = await repo.submitCompanyMerge(port, company, initial.caseId, initial.revision, { kind, message: "원문" });
      const round = kind === "request" ? sent.requestRound! : sent.proposalRound!;
      now += 86_400_000;
      const withdrawn = await repo.submitCompanyMerge(port, company, sent.caseId, sent.revision,
        { kind: kind === "request" ? "withdraw-request" : "withdraw-proposal", roundId: round.roundId });
      expect(withdrawn.caseId).toBe(initial.caseId);
      expect(withdrawn.reviewOpening).toBeNull();
      if (kind === "request") {
        await expect(repo.submitCompanyMerge(port, company, sent.caseId, withdrawn.revision, { kind, message: "원문" }))
          .rejects.toMatchObject({ status: 409, code: "COMPANY_MERGE_STATE_CONFLICT" });
        expect(await repo.getCompanyMergeCase(port, company, sent.caseId)).toMatchObject({
          revision: withdrawn.revision, requestRound: { status: "WITHDRAWN" },
        });
      }
      const resend = { kind: kind === "request" ? "resend-request" : "resend-proposal", roundId: round.roundId, commandId, message: "새 내용" } satisfies CompanyMergeAction;
      const next = await repo.submitCompanyMerge(port, company, withdrawn.caseId, withdrawn.revision, resend);
      expect((kind === "request" ? next.requestRound : next.proposalRound)?.roundId).not.toBe(round.roundId);
      expect(next.decisionDueAt).toBe(initial.decisionDueAt);
      expect(next.proposal?.responseDueAt).toBe(sent.proposal?.responseDueAt);
      if (kind === "request") {
        const legacyReplay = await repo.submitCompanyMerge(port, company, next.caseId, sent.revision, { kind, message: "원문" });
        expect(legacyReplay.revision).toBe(next.revision);
        await expect(repo.submitCompanyMerge(port, company, next.caseId, next.revision, { kind, message: "새 내용" }))
          .rejects.toMatchObject({ status: 409, code: "COMPANY_MERGE_STATE_CONFLICT" });
      }
      const replay = await repo.submitCompanyMerge(port, company, withdrawn.caseId, withdrawn.revision, resend);
      expect(replay.revision).toBe(next.revision);
      await expect(repo.submitCompanyMerge(port, company, withdrawn.caseId, withdrawn.revision,
        { ...resend, message: "다른 내용" })).rejects.toMatchObject({ status: 409 });
      expect(canSubmitCompanyMerge(next, company, [], kind === "request" ? "withdraw-request" : "withdraw-proposal")).toBe(false);
      await expect(repo.submitCompanyMerge(port, company, withdrawn.caseId, next.revision,
        { kind: kind === "request" ? "withdraw-request" : "withdraw-proposal", roundId: round.roundId })).rejects.toMatchObject({ status: 409 });
    });
  }

  it("직접 신청을 철회해도 이전 제안은 복원되지 않는다", async () => {
    let now = testNow;
    const repo = createMockCompanyRepository(mockRuntime(undefined, { company: "merge-proposal" }, () => now));
    const initial = (await repo.getCurrentCompanyMergeCase(access, 7002))!;
    const sent = await repo.submitCompanyMerge(access, 7002, initial.caseId, initial.revision, { kind: "request", message: null });
    const withdrawn = await repo.submitCompanyMerge(access, 7002, sent.caseId, sent.revision, { kind: "withdraw-request", roundId: sent.requestRound!.roundId });
    expect(withdrawn.proposalRound?.status).toBe("SUPERSEDED");
    expect(withdrawn.actions.canRespondToProposal).toBe(false);
    now += 7 * 86_400_000;
    const expired = await repo.getCompanyMergeCase(access, 7002, withdrawn.caseId);
    expect(expired.reviewOpening).toBeNull();
    expect(expired.status).toBe("CLEANUP_PENDING");
  });

  it.each([{ kind: "accept" }, { kind: "decline", reason: "합성 사유" }] as const)("재발송 뒤 회차 없는 %j 응답을 거부한다", async action => {
    const runtime = mockRuntime(undefined, { company: "merge-proposal" });
    const repo = createMockCompanyRepository(runtime);
    const value = (await repo.getCurrentCompanyMergeCase(access, 7002))!;
    // Mock accounts have isolated cases. This fixture represents the received second send.
    value.revision = 4;
    value.proposalRound = { ...value.proposalRound!, roundId: 3 };
    runtime.store.write("1", "company-merge", value);
    runtime.store.write("1", `company-merge-proposal-resent:${value.caseId}`, true);
    await expect(repo.submitCompanyMerge(access, 7002, value.caseId, 4, action)).rejects.toMatchObject({ status: 409 });
    const after = (await repo.getCurrentCompanyMergeCase(access, 7002))!;
    expect(after.revision).toBe(4);
    expect(after.proposalResponse).toBeNull();
  });

  it("명시한 오래된 회차를 최신 revision으로 바꿔 제출하지 않는다", async () => {
    const repository = createMockCompanyRepository(mockRuntime(undefined, { company: "merge-proposal" }));
    const value = (await repository.getCurrentCompanyMergeCase(access, 7002))!;
    const actor = await repository.getCurrentCompanyPermissions(access, 7002);
    const snapshot: CompanyMergeSnapshot = { status: "case", value, actor };
    repository.submitCompanyMerge = vi.fn();
    await expect(submitCurrentCompanyMerge(access, new AbortController().signal, () => true, companyMergeReference(snapshot),
      { kind: "accept", roundId: value.proposalRound!.roundId + 1 }, repository)).rejects.toMatchObject({ status: 409 });
    expect(repository.submitCompanyMerge).not.toHaveBeenCalled();
  });
});

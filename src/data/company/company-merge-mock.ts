import { mockAccount, type MockRuntime } from "../mock/runtime";
import { isRecord } from "../mock/validation";
import { ApiError } from "../shared/errors";
import type { AuthAccess } from "../shared/http";
import { mapCompanyMergeCase } from "./company-merge-api";
import type { CompanyMergeAction, CompanyMergeCase, CompanyMergeRepository } from "./company-merge-contracts";
import { canSubmitCompanyMerge, normalizeCompanyMergeAction, requireMergeIds } from "./company-merge-input";
import type { CompanyTeamRepository } from "./team-contracts";
import { serializeTeamMockCommand } from "./team-mock-command";

const domain = "company-merge";
const week = 7 * 24 * 60 * 60 * 1000;
const currentStatuses = new Set(["REVIEW_PENDING", "REJECTED", "APPEAL_SUBMITTED"]);
const noActions = { canRequest: null, canPropose: null, canRespondToProposal: null };
const timestamp = (millis: number) => new Date(millis).toISOString();

export function mockMergeCompanyId(scenario: string, account: string): number | null {
  if (scenario === "merge-in-place") return account === "1" ? 7001 : null;
  if (scenario === "merge" || scenario === "merge-proposal") return account === "1" ? 7002 : account === "2" ? 7001 : null;
  return null;
}

function fixture(scenario: string, account: string, now: number): CompanyMergeCase | null {
  if (mockMergeCompanyId(scenario, account) === null) return null;
  const verified = { id: 7001, name: "가상 메이트 건설" };
  const inPlace = scenario === "merge-in-place";
  const source = inPlace ? verified : { id: 7002, name: "가상 메이트 정보통신" };
  return {
    caseId: account === "1" ? 9401 : 9402, type: inPlace ? "IN_PLACE_MEMBER_REVIEW" : "CROSS_COMPANY", status: "REVIEW_PENDING", source, verified,
    revision: 1, reviewRequested: inPlace, requestMessage: null, actions: noActions,
    proposal: scenario === "merge-proposal" ? { message: "가상 통합 제안입니다.", proposedAt: timestamp(now), responseDueAt: timestamp(now + week) } : null,
    proposalResponse: null, reviewOpening: inPlace ? { origin: "IN_PLACE_REGISTRATION", openedAt: timestamp(now) } : null,
    decisionDueAt: timestamp(now + week), rejectionOrigin: null, finalizedAt: null,
  };
}

function readStoredCase(value: unknown, companyId: number, caseId: number): CompanyMergeCase | null {
  if (!isRecord(value) || !isRecord(value.source) || !isRecord(value.verified)) return null;
  try {
    return mapCompanyMergeCase({ ...value, sourceCompanyId: value.source.id, sourceCompanyName: value.source.name,
      verifiedCompanyId: value.verified.id, verifiedCompanyName: value.verified.name }, companyId, caseId);
  } catch { return null; }
}

function withActions(value: CompanyMergeCase, companyId: number, permissions: readonly string[], now: number): CompanyMergeCase {
  const pending = value.type === "CROSS_COMPANY" && value.status === "REVIEW_PENDING" && !value.reviewOpening && !value.reviewRequested;
  const source = companyId === value.source.id;
  const beforeDue = now < Date.parse(value.proposal?.responseDueAt ?? value.decisionDueAt ?? "");
  const requestable = pending && beforeDue && permissions.includes("COMPANY_MERGE_REQUEST");
  return { ...value, actions: {
    canRequest: source ? requestable : null,
    canRespondToProposal: source ? requestable && value.proposal !== null : null,
    canPropose: source ? null : pending && beforeDue && !value.proposal && permissions.includes("COMPANY_MERGE_REVIEW"),
  } };
}

function notFound(): never {
  throw new ApiError(404, "COMPANY_MERGE_CASE_NOT_FOUND", "이 통합 사건에 접근할 수 없어요.");
}

export function createMockCompanyMerge(runtime: MockRuntime, team: Pick<CompanyTeamRepository, "getCurrentCompanyPermissions">): CompanyMergeRepository {
  async function context(access: AuthAccess, companyId: number, signal?: AbortSignal) {
    const account = await mockAccount(runtime, access, "company", signal);
    const current = await team.getCurrentCompanyPermissions(access, companyId, signal);
    signal?.throwIfAborted();
    access.assertRequestScope?.();
    if (account !== access.getAccountKey()) throw new ApiError(401, "ACCOUNT_CHANGED", "로그인 계정이 변경됐어요.");
    return { account, current };
  }

  function record(account: string, companyId: number, now: number) {
    const candidate = fixture(runtime.scenario("company"), account, now);
    if (!candidate || mockMergeCompanyId(runtime.scenario("company"), account) !== companyId) return null;
    const stored = runtime.store.read(account, domain, () => candidate, (raw): raw is CompanyMergeCase => readStoredCase(raw, companyId, candidate.caseId) !== null);
    const value = readStoredCase(stored, companyId, candidate.caseId) ?? candidate;
    if (value.type !== "CROSS_COMPANY" || value.status !== "REVIEW_PENDING" || value.reviewOpening || value.reviewRequested) return value;
    // Only the mock simulates the server's scheduled transitions using its injected clock.
    if (value.proposal && now >= Date.parse(value.proposal.responseDueAt)) {
      value.reviewOpening = { origin: "TARGET_PROPOSAL_TIMEOUT", openedAt: timestamp(now) };
      value.decisionDueAt = timestamp(now + week);
    } else if (!value.proposal && value.decisionDueAt && now >= Date.parse(value.decisionDueAt)) {
      value.status = "CLEANUP_PENDING";
    } else return value;
    value.revision += 1;
    runtime.store.write(account, domain, value);
    return value;
  }

  async function read(access: AuthAccess, companyId: number, signal?: AbortSignal) {
    const { account, current } = await context(access, companyId, signal);
    const now = runtime.now();
    const value = record(account, companyId, now);
    if (!value) return null;
    if (value.type === "CROSS_COMPANY" && companyId === value.verified.id && !current.permissionCodes.includes("COMPANY_MERGE_REVIEW")) return null;
    return withActions(value, companyId, current.permissionCodes, now);
  }

  function apply(value: CompanyMergeCase, action: CompanyMergeAction, now: number) {
    if (action.kind === "propose") {
      value.proposal = { message: action.message, proposedAt: timestamp(now), responseDueAt: timestamp(now + week) };
    } else if (action.kind === "request") {
      value.reviewRequested = true;
      value.requestMessage = action.message;
      value.reviewOpening = { origin: "SOURCE_REQUEST", openedAt: timestamp(now) };
      value.decisionDueAt = timestamp(now + week);
    } else if (action.kind === "accept") {
      value.proposalResponse = { decision: "ACCEPT", respondedAt: timestamp(now), reason: null };
      value.reviewOpening = { origin: "SOURCE_ACCEPTED", openedAt: timestamp(now) };
      value.decisionDueAt = timestamp(now + week);
    } else if (action.kind === "decline") {
      value.proposalResponse = { decision: "DECLINE", respondedAt: timestamp(now), reason: action.reason };
      value.rejectionOrigin = "SOURCE_PROPOSAL_DECLINED";
      value.status = "REJECTED";
    }
    value.revision += 1;
  }

  return {
    async getCurrentCompanyMergeCase(access, companyId, signal) {
      requireMergeIds(companyId);
      const value = await read(access, companyId, signal);
      return value && currentStatuses.has(value.status) ? value : null;
    },
    async getCompanyMergeCase(access, companyId, caseId, signal) {
      requireMergeIds(companyId, caseId);
      const value = await read(access, companyId, signal);
      if (!value || value.caseId !== caseId) notFound();
      return value;
    },
    async submitCompanyMerge(access, companyId, caseId, expectedRevision, input, signal) {
      requireMergeIds(companyId, caseId, expectedRevision);
      const action = normalizeCompanyMergeAction(input);
      return serializeTeamMockCommand(runtime, access, async () => {
        const { account, current } = await context(access, companyId, signal);
        const now = runtime.now();
        const value = record(account, companyId, now);
        if (!value || value.caseId !== caseId) notFound();
        const permissions = current.permissionCodes;
        const leaf = action.kind === "propose" ? "COMPANY_MERGE_REVIEW" : "COMPANY_MERGE_REQUEST";
        if (!permissions.includes(leaf)) throw new ApiError(403, "COMPANY_MERGE_REVIEW_FORBIDDEN", "통합 요청을 처리할 권한이 없어요.");
        if (value.revision !== expectedRevision || !canSubmitCompanyMerge(withActions(value, companyId, permissions, now), companyId, permissions, action.kind)) {
          throw new ApiError(409, "COMPANY_MERGE_REVISION_CONFLICT", "통합 요청의 최신 상태를 확인해 주세요.");
        }
        apply(value, action, now);
        runtime.store.write(account, domain, value);
        return withActions(value, companyId, permissions, now);
      });
    },
  };
}

import { describe, expect, it, vi } from "vitest";

import { createHttpCompanyRepository } from "@/data/company/http-repository";
import { createMockCompanyMerge } from "@/data/company/company-merge-mock";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { canSubmitCompanyMerge, type CompanyMergeCase } from "@/data/company/contracts";
import { ApiError } from "@/data/shared/errors";
import { createHttpClient } from "@/data/shared/http";
import { CompanyMergeUnconfirmed, companyMergeReference, loadCompanyMerge, submitCurrentCompanyMerge, type CompanyMergeSnapshot } from "@/features/company/company-merge";
import { access, mockRuntime, ok } from "./helpers";

const signal = () => new AbortController().signal;
const active = () => true;
const action = { kind: "request", message: "합성 신청" } as const;
const source = { companyId: 7002, membershipId: 9101, permissionCodes: ["COMPANY_MERGE_REQUEST"] };
const base = () => createMockCompanyRepository(mockRuntime(undefined, { company: "merge" }));

async function snapshot(repository = base()): Promise<CompanyMergeSnapshot> {
  const view = await loadCompanyMerge(access, signal(), active, undefined, repository);
  if (view.status !== "case") throw new Error("합성 사건을 찾지 못했어요.");
  return view;
}

describe("회사 통합 현재 문맥·제출·확인", () => {
  it("활성 소속의 204와 읽기 범위 미확인, 소속 없음과 조회 오류를 구별한다", async () => {
    const repository = base();
    repository.getCurrentCompanyMergeCase = vi.fn(async () => null);
    expect(await loadCompanyMerge(access, signal(), active, undefined, repository)).toEqual({ status: "empty" });
    repository.getCurrentCompanyPermissions = async () => source;
    expect(await loadCompanyMerge(access, signal(), active, undefined, repository)).toEqual({ status: "unavailable" });
    repository.getCurrentCompanyMergeCase = vi.fn(async () => { throw new ApiError(403, "TEST", "합성 오류"); });
    await expect(loadCompanyMerge(access, signal(), active, undefined, repository)).rejects.toMatchObject({ status: 403 });
    repository.getCurrentCompanyMergeCase = vi.fn();
    repository.getCompanyTeamContext = async () => ({ companyId: null });
    expect(await loadCompanyMerge(access, signal(), active, undefined, repository)).toEqual({ status: "no-company" });
    expect(repository.getCurrentCompanyMergeCase).not.toHaveBeenCalled();
  });

  it("읽을 수 있는 원본과 검토 leaf가 회수된 인증 회사를 구분한다", async () => {
    const repository = base();
    repository.getCurrentCompanyPermissions = async () => ({ ...source, permissionCodes: [] });
    const view = await snapshot(repository);
    expect(canSubmitCompanyMerge(view.value, view.actor.companyId, view.actor.permissionCodes, "request")).toBe(false);

    const asVerified = { ...access, getAccountKey: () => "2" };
    const verified = base();
    const result = await verified.getCurrentCompanyMergeCase(asVerified, 7001);
    verified.getCurrentCompanyMergeCase = async () => result;
    verified.getCurrentCompanyPermissions = vi.fn().mockResolvedValueOnce({ companyId: 7001, membershipId: 9101, permissionCodes: ["COMPANY_MERGE_REVIEW"] })
      .mockResolvedValue({ companyId: 7001, membershipId: 9101, permissionCodes: [] });
    await expect(loadCompanyMerge(asVerified, signal(), active, undefined, verified)).rejects.toMatchObject({ status: 403 });
  });

  it("검토 leaf가 없는 활성 소속도 기존 자체 인증 사건의 현재·정확 상세를 읽는다", async () => {
    const runtime = mockRuntime(undefined, { company: "merge-in-place" });
    const team = { getCurrentCompanyPermissions: async () => ({ companyId: 7001, membershipId: 9101, permissionCodes: [] }) };
    const repository = { ...createMockCompanyRepository(runtime), ...createMockCompanyMerge(runtime, team), ...team };
    const initial = await snapshot(repository);
    expect(initial.value).toMatchObject({ type: "IN_PLACE_MEMBER_REVIEW", reviewOpening: { origin: "IN_PLACE_REGISTRATION" } });
    const reference = companyMergeReference(initial);
    expect(await loadCompanyMerge(access, signal(), active, reference, repository)).toEqual(initial);
    await expect(submitCurrentCompanyMerge(access, signal(), active, reference, action, repository)).rejects.toMatchObject({ status: 403 });
  });

  it.each([false, true])("같은 회사 사건의 조회 중 검토 leaf가 %s에서 바뀌면 이전 응답을 폐기한다", async initiallyAllowed => {
    const repository = createMockCompanyRepository(mockRuntime(undefined, { company: "merge-in-place" }));
    const initial = await snapshot(repository);
    const current = (allowed: boolean) => ({ companyId: 7001, membershipId: 9101, permissionCodes: allowed ? ["COMPANY_MERGE_REVIEW"] : [] });
    repository.getCurrentCompanyPermissions = vi.fn().mockResolvedValueOnce(current(initiallyAllowed)).mockResolvedValue(current(!initiallyAllowed));
    await expect(loadCompanyMerge(access, signal(), active, companyMergeReference(initial), repository)).rejects.toMatchObject({ status: 409 });
  });

  it.each(["account", "epoch", "abort", "company", "membership"])("읽기 중 %s 전환 뒤 이전 사건은 반환되지 않는다", async kind => {
    const repository = base();
    const value = (await snapshot(repository)).value;
    const controller = new AbortController();
    let account = "1";
    let allowed = true;
    repository.getCurrentCompanyMergeCase = async () => {
      if (kind === "account") account = "2";
      if (kind === "epoch") allowed = false;
      if (kind === "abort") controller.abort();
      if (kind === "company") repository.getCompanyTeamContext = async () => ({ companyId: null });
      if (kind === "membership") repository.getCurrentCompanyPermissions = async () => ({ ...source, membershipId: 9201 });
      return value;
    };
    await expect(loadCompanyMerge({ ...access, getAccountKey: () => account }, controller.signal, () => allowed, undefined, repository)).rejects.toMatchObject(
      kind === "company" || kind === "membership" ? { status: 409 } : { name: "AbortError" },
    );
  });

  it.each(["revision", "case", "role", "capability", "membership"])("제출 직전 %s가 바뀌면 쓰기 요청이 없다", async kind => {
    const repository = base();
    const initial = await snapshot(repository);
    const value = initial.value;
    repository.submitCompanyMerge = vi.fn();
    if (kind === "membership") repository.getCurrentCompanyPermissions = async () => ({ ...source, membershipId: 9201 });
    if (kind === "role") repository.getCurrentCompanyPermissions = async () => ({ ...source, permissionCodes: [] });
    if (kind === "revision") repository.getCurrentCompanyMergeCase = async () => ({ ...value, revision: 2 });
    if (kind === "case") repository.getCurrentCompanyMergeCase = async () => ({ ...value, caseId: 9402 });
    if (kind === "capability") repository.getCurrentCompanyMergeCase = async () => ({ ...value, actions: { ...value.actions, canRequest: null } });
    await expect(submitCurrentCompanyMerge(access, signal(), active, companyMergeReference(initial), action, repository)).rejects.toBeInstanceOf(ApiError);
    expect(repository.submitCompanyMerge).not.toHaveBeenCalled();
  });

  it("전송 토큰을 기다리던 중 문맥이 바뀌면 HTTP 직전에도 쓰기를 차단한다", async () => {
    const repository = base();
    const initial = await snapshot(repository);
    const transport = vi.fn(async () => ok(null));
    repository.submitCompanyMerge = createHttpCompanyRepository(createHttpClient("http://test", transport)).submitCompanyMerge;
    let release!: () => void;
    let reached!: () => void;
    const token = new Promise<void>(resolve => { release = resolve; });
    const waiting = new Promise<void>(resolve => { reached = resolve; });
    let valid = true;
    const pending = submitCurrentCompanyMerge({ ...access, getAccessToken: async () => { reached(); await token; return "synthetic"; } }, signal(),
      () => valid, companyMergeReference(initial), action, repository);
    await waiting;
    valid = false;
    release();
    await expect(pending).rejects.toMatchObject({ name: "AbortError" });
    expect(transport).not.toHaveBeenCalled();
  });

  it.each([0, 200, 404, 408, 503])("쓰기 뒤 상태 %d의 미확정 결과는 같은 사건을 읽기만 한다", async status => {
    const repository = base();
    const initial = await snapshot(repository);
    const send = repository.submitCompanyMerge;
    repository.submitCompanyMerge = vi.fn<typeof send>(async (...args) => {
      await send(...args);
      throw new ApiError(status, "TEST", "합성 응답 유실");
    });
    const reference = companyMergeReference(initial);
    await expect(submitCurrentCompanyMerge(access, signal(), active, reference, action, repository)).rejects.toBeInstanceOf(CompanyMergeUnconfirmed);
    repository.getCurrentCompanyMergeCase = vi.fn(async () => null);
    const value = await loadCompanyMerge(access, signal(), active, reference, repository);
    expect(value).toMatchObject({ status: "case", value: { caseId: initial.value.caseId, revision: 2, reviewOpening: { origin: "SOURCE_REQUEST" } } });
    expect(repository.getCurrentCompanyMergeCase).not.toHaveBeenCalled();
    expect(repository.submitCompanyMerge).toHaveBeenCalledTimes(1);
  });

  it("다른 회사 쌍의 정확 조회와 잘못된 명령 receipt를 폐기한다", async () => {
    const repository = base();
    const initial = await snapshot(repository);
    const reference = companyMergeReference(initial);
    const fake: CompanyMergeCase = { ...initial.value, revision: 2, verified: { id: 7555, name: "다른 합성 회사" } };
    repository.getCompanyMergeCase = async () => fake;
    await expect(loadCompanyMerge(access, signal(), active, reference, repository)).rejects.toMatchObject({ status: 409 });
    repository.submitCompanyMerge = async () => ({ ...initial.value, revision: 2 });
    await expect(submitCurrentCompanyMerge(access, signal(), active, reference, action, repository)).rejects.toBeInstanceOf(CompanyMergeUnconfirmed);
  });
});

import { describe, expect, it, vi } from "vitest";
import { companyFlowBack, companyFlowCompletion, companyFlowHref, readCompanyFlow } from "@/lib/company-flow";
import { createCompanyFlowScope } from "@/features/company/flow-scope";
import { isMembershipSubmissionUncertain } from "@/features/company/membership-submission";
import { createSessionController } from "@/data/auth/session-controller";
import { createHttpCompanyRepository } from "@/data/company/http-repository";
import { createHttpClient } from "@/data/shared/http";
import { ApiError } from "@/data/shared/errors";
import { authentication, ok } from "./helpers";

const settings = readCompanyFlow({ from: "settings", query: "가상 회사", page: "2" });
const sessionWith = (refreshBrowserSession = async () => authentication()) => {
  const session = createSessionController({ refreshBrowserSession, logoutBrowserSession: async () => {} });
  session.setAuthentication(authentication());
  return session;
};

describe("회사 등록/찾기 복귀 문맥", () => {
  it.each(["register", "business-number", "document", "search", "request"] as const)("%s의 direct/reload·로그인 왕복은 설정 문맥만 보존한다", step => {
    const path = companyFlowHref(step, settings, 7001);
    const next = new URL(`https://mate.local${path}`);
    expect(next.searchParams.get("from")).toBe("settings");
    const restored = readCompanyFlow(Object.fromEntries(next.searchParams));
    expect(companyFlowBack(restored)).toBe("/my/company/start");
    expect(companyFlowCompletion(restored)).toBe("/my/company");
    if (step === "search" || step === "request") expect(restored).toEqual(settings);
    else expect(restored.query).toBe("");
  });

  it.each([undefined, "https://outside.test", "//outside.test", "\\outside.test", "/my/company", "/auth?next=/my", "%73ettings", "%2573ettings", "settings\n", ["settings", "settings"]])("비정상 진입 %j와 raw return은 가입 기본값으로 정규화한다", from => {
    const flow = readCompanyFlow({ from, returnTo: "//outside.test", next: "/auth?next=/auth", redirect: "/bids/1" });
    expect(flow.fromSettings).toBe(false);
    expect(companyFlowBack(flow)).toBe("/auth/start");
    expect(companyFlowCompletion(flow)).toBe("/bids");
    expect(companyFlowHref("register", flow)).toBe("/auth/company/register");
  });

  it("허용된 설정 진입도 임의 return을 완료나 next에 전달하지 않는다", () => {
    const flow = readCompanyFlow({ from: "settings", returnTo: "https://outside.test", next: "/auth?next=/auth" });
    expect(companyFlowCompletion(flow)).toBe("/my/company");
    expect(companyFlowHref("document", flow)).toBe("/auth/company/register/document?from=settings");
  });

  it.each(["-1", "1.5", "01", "2147483648", "Infinity", "1e3", ["1", "2"]])("비정상 검색 페이지 %j는 초기 페이지로 복원한다", page => {
    expect(readCompanyFlow({ query: "가상 회사", page }).page).toBe(0);
  });

  it.each([["회사", "다른 회사"], "a".repeat(101), "회사\u0000", "\t"])("비정상/중복 검색어는 전달하지 않는다", query => {
    const flow = readCompanyFlow({ query, page: "2" });
    expect(flow.query).toBe("");
    expect(flow.page).toBe(0);
  });

  it("검색어의 특수문자를 query 안에 인코딩하고 신청 Back으로 같은 페이지를 복원한다", () => {
    const flow = readCompanyFlow({ from: "settings", query: " 가상 & 회사?from=외부#문구 ", page: "3" });
    const request = new URL(`https://mate.local${companyFlowHref("request", flow, 7001)}`);
    expect(request.pathname).toBe("/auth/company/search/7001");
    expect(request.hash).toBe("");
    expect(request.searchParams.get("query")).toBe(flow.query);
    expect(companyFlowHref("search", readCompanyFlow(Object.fromEntries(request.searchParams)))).toBe(companyFlowHref("search", flow));
    expect(companyFlowHref("request", flow, -1)).toBe(companyFlowHref("search", flow));
  });

  it("설정 문맥 없는 기존 가입 완료는 /bids다", () => {
    expect(companyFlowCompletion(readCompanyFlow())).toBe("/bids");
    expect(companyFlowHref("request", readCompanyFlow(), 7001)).toBe("/auth/company/search/7001");
  });
});

describe("회사 흐름의 제출·계정·화면 수명", () => {
  it.each([0, 200, 201, 408, 409, 503])("성공을 확인하지 못한 HTTP%s 신청 오류는 재제출 대신 상태 확인으로 보낸다", status => {
    expect(isMembershipSubmissionUncertain(new ApiError(status, "SYNTHETIC", "synthetic"))).toBe(true);
  });

  it.each([400, 401, 403, 422, 429])("명시 거부 HTTP%s를 미확정 성공으로 표시하지 않는다", status => {
    expect(isMembershipSubmissionUncertain(new ApiError(status, "SYNTHETIC", "synthetic"))).toBe(false);
  });

  it.each([{}, { requestId: -1, status: "PENDING", company: { companyId: 7001 } }, { requestId: 91, status: "APPROVED", company: { companyId: 7001 } }, { requestId: 91, status: "PENDING", company: { companyId: 7002 } }])("잘못된 신청 성공 data는 완료로 인정하지 않는다 (%j)", async data => {
    const repo = createHttpCompanyRepository(createHttpClient("https://api.example.test", async () => ok(data, 201)));
    await expect(repo.requestMembership(sessionWith(), { companyId: 7001, representative: true, positionId: null, proposedPositionName: null, message: null })).rejects.toMatchObject({ code: "MEMBERSHIP_RESPONSE_INVALID" });
  });

  it.each([200, 201])("HTTP%s의 빈 성공 data도 미확정이다", async status => {
    const repo = createHttpCompanyRepository(createHttpClient("https://api.example.test", async () => ok(null, status)));
    const result = await repo.requestMembership(sessionWith(), { companyId: 7001, representative: true, positionId: null, proposedPositionName: null, message: null }).catch(error => error);
    expect(result).toMatchObject({ code: "EMPTY_RESPONSE" });
    expect(isMembershipSubmissionUncertain(result)).toBe(true);
  });

  it.each(["number", "document"] as const)("%s 등록의 불완전한 성공은 완료·후속 refresh 없이 오류로 남고 멱등 key를 보존한다", async method => {
    const refresh = vi.fn(async () => authentication());
    const session = { ...sessionWith(), refresh };
    const fetcher = vi.fn<typeof fetch>(async () => ok({ companyId: 77 }, 201));
    const repo = createHttpCompanyRepository(createHttpClient("https://api.example.test", fetcher));
    const register = () => method === "number"
      ? repo.createUnverifiedCompany(session, { connectionId: "synthetic", representative: true, positionName: null, preferredBidNoticeAmountRange: "ANY" }, "same-synthetic-key")
      : repo.createVerifiedCompany(session, { proposalId: "synthetic", documentId: "synthetic", versionId: "synthetic", revision: 1, telephoneNumber: null, primaryIndustryCode: "0001", representative: true, positionName: null, preferredBidNoticeAmountRange: "ANY", conflictChoice: null, businessNumberCorrectionChoice: null }, "same-synthetic-key");
    await expect(register()).rejects.toMatchObject({ code: "REGISTRATION_RESPONSE_INVALID" });
    await expect(register()).rejects.toMatchObject({ code: "REGISTRATION_RESPONSE_INVALID" });
    expect(refresh).not.toHaveBeenCalled();
    for (const call of fetcher.mock.calls) expect(new Headers(call[1]?.headers).get("Idempotency-Key")).toBe("same-synthetic-key");
  });

  it("같은 tick의 중복 제출을 막고 실패 후 명시 재시도를 허용한다", () => {
    const scope = createCompanyFlowScope(sessionWith());
    const first = scope.begin()!;
    expect(scope.begin()).toBeNull();
    first.finish();
    expect(scope.begin()).not.toBeNull();
  });

  it("Back/화면 종료와 StrictMode 재활성화 뒤에도 이전 응답은 무효다", () => {
    const scope = createCompanyFlowScope(sessionWith());
    const first = scope.begin()!;
    scope.dispose();
    expect(first.current(true)).toBe(false);
    scope.activate();
    const second = scope.begin()!;
    first.finish();
    expect(scope.begin()).toBeNull();
    expect(first.current()).toBe(false);
    expect(second.current()).toBe(true);
  });

  it("다른 계정과 A→B→A 복귀는 이전 draft/완료를 재사용하지 않는다", () => {
    const session = sessionWith();
    const scope = createCompanyFlowScope(session);
    const pending = scope.begin()!;
    session.setAuthentication(authentication(2));
    expect(pending.current(true)).toBe(false);
    session.setAuthentication(authentication(1));
    expect(pending.current(true)).toBe(false);
  });

  it("명시 로그아웃은 응답 전에도 무효화하고 같은 계정 재로그인 뒤 복원하지 않는다", async () => {
    const session = sessionWith();
    const scope = createCompanyFlowScope(session);
    const pending = scope.begin()!;
    const logout = session.logout();
    expect(pending.current(true)).toBe(false);
    await logout;
    session.setAuthentication(authentication());
    expect(pending.current(true)).toBe(false);
  });

  it.each([401, 403])("등록 HTTP201 성공 뒤 refresh %i는 성공만 보존하고 새 명령은 막는다", async status => {
    const session = sessionWith(async () => { throw new ApiError(status, "SESSION_INVALID", "synthetic"); });
    const scope = createCompanyFlowScope(session);
    const pending = scope.begin()!;
    const fetcher = vi.fn(async () => ok({ companyId: 77, membershipId: 88, role: "ADMIN", verificationStatus: "UNVERIFIED" }, 201));
    const repo = createHttpCompanyRepository(createHttpClient("https://api.example.test", fetcher));
    const result = await repo.createUnverifiedCompany(session, { connectionId: "synthetic-connection", preferredBidNoticeAmountRange: "ANY", representative: true, positionName: null }, "synthetic-registration-key");
    expect(result.sessionWarning).toBeTruthy();
    expect(pending.current(true)).toBe(true);
    expect(pending.current()).toBe(false);
    pending.finish();
    expect(scope.begin()).toBeNull();
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(session.getSnapshot().status).toBe("anonymous");
  });

  it("다단계 업로드 중 계정 변경은 다음 요청과 복원 저장을 실행하지 않는다", async () => {
    const session = sessionWith();
    const scope = createCompanyFlowScope(session);
    const pending = scope.begin()!;
    let resolve!: () => void;
    const upload = new Promise<void>(done => { resolve = done; });
    const complete = vi.fn();
    const save = vi.fn();
    const work = (async () => { await upload; if (!pending.current()) return; complete(); save(); })();
    session.setAuthentication(authentication(2));
    resolve();
    await work;
    expect(complete).not.toHaveBeenCalled();
    expect(save).not.toHaveBeenCalled();
  });
});

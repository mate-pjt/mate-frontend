import { expect, it, vi } from "vitest";

import type { CompanyOverview, MembershipCancellationResult } from "@/data/company/contracts";
import { ApiError } from "@/data/shared/errors";
import { createMembershipCancellationController } from "@/features/company/membership-cancellation";

const request = { requestId: 8001, version: 3, status: "PENDING" as const, company: { companyId: 7001, companyName: "합성 회사", businessNumber: "1234567890", baseAddress: null, verificationStatus: "VERIFIED" as const }, requestedRepresentative: false, requestedPositionName: "담당자", proposedPositionName: null, rejectionReason: null, createdAt: "2030-06-01T00:00:00Z", updatedAt: "2030-06-01T00:00:00Z", completedAt: null };
const result: MembershipCancellationResult = { request: { ...request, status: "CANCELED", version: 4, completedAt: "2030-06-01T01:00:00Z", updatedAt: "2030-06-01T01:00:00Z" } };
function setup() {
  const port = { getAccountKey: vi.fn<() => string | null>(() => "1"), cancel: vi.fn(async () => result), load: vi.fn<(signal: AbortSignal) => Promise<CompanyOverview>>(async () => ({ status: "terminated", request: result.request })), onPending: vi.fn(), onCommitted: vi.fn(), onOverview: vi.fn(), onError: vi.fn(), onNotice: vi.fn() };
  return { port, controller: createMembershipCancellationController(port) };
}

it("조회/닫기/초기 생성은 명령0이며 연속 제출과 완료 replay를 막는다", async () => {
  const { port, controller } = setup(); expect(port.cancel).not.toHaveBeenCalled();
  let resolve!: (value: MembershipCancellationResult) => void;
  port.cancel.mockImplementation(() => new Promise(done => { resolve = done; }));
  const snapshot = structuredClone(request); const pending = controller.submit(snapshot);
  snapshot.requestId = 9000; snapshot.version = 99;
  await controller.submit(request); expect(port.cancel).toHaveBeenCalledExactlyOnceWith(8001, 3);
  resolve(result); await pending; await controller.submit(request);
  expect(port.cancel).toHaveBeenCalledTimes(1); expect(port.onCommitted).toHaveBeenCalledExactlyOnceWith(result);
  expect(port.onPending.mock.calls).toEqual([[true], [false]]);
});
it.each(["계정 교체", "로그아웃", "화면 종료"])("%s 뒤 늦은 성공/오류/Toast 콜백을 버린다", async kind => {
  const { port, controller } = setup(); let resolve!: (value: MembershipCancellationResult) => void;
  port.cancel.mockImplementation(() => new Promise(done => { resolve = done; })); const pending = controller.submit(request);
  if (kind === "화면 종료") controller.dispose(); else port.getAccountKey.mockReturnValue(kind === "로그아웃" ? null : "2");
  resolve(result); await pending;
  expect(port.onCommitted).not.toHaveBeenCalled(); expect(port.load).not.toHaveBeenCalled(); expect(port.onError).not.toHaveBeenCalled();
});
it.each(["CR003", "CR004", "CR001"])("%s는 최신 상태만 확인하고 새 PENDING을 자동 취소하거나 성공 안내하지 않는다", async code => {
  const { port, controller } = setup(); port.cancel.mockRejectedValue(new ApiError(code === "CR001" ? 404 : 409, code, "changed"));
  const latest: CompanyOverview = { status: "pending", request: { ...request, requestId: 9001, version: 1 } };
  port.load.mockResolvedValue(latest); await controller.submit(request);
  expect(port.cancel).toHaveBeenCalledExactlyOnceWith(8001, 3); expect(port.onOverview).toHaveBeenCalledWith(latest); expect(port.onCommitted).not.toHaveBeenCalled();
  expect(port.onNotice).toHaveBeenCalled();
});
it.each(["CANCELED", "REJECTED", "APPROVED"] as const)("충돌 후 %s 최신 상태를 그대로 전달한다", async status => {
  const { port, controller } = setup(); port.cancel.mockRejectedValue(new ApiError(409, "CR003", "changed"));
  const latest: CompanyOverview = { status: status === "APPROVED" ? "approved-stale" : "terminated", request: { ...result.request, status } };
  port.load.mockResolvedValue(latest); await controller.submit(request);
  expect(port.onOverview).toHaveBeenCalledWith(latest); expect(port.onCommitted).not.toHaveBeenCalled();
});
it("충돌 뒤 재조회 실패는 미확정으로 남긴다", async () => {
  const { port, controller } = setup(); port.cancel.mockRejectedValue(new ApiError(409, "CR004", "changed"));
  const offline = new Error("offline"); port.load.mockRejectedValue(offline); await controller.submit(request);
  expect(port.onOverview).not.toHaveBeenCalled(); expect(port.onError).toHaveBeenLastCalledWith(expect.stringContaining("취소 결과와 최신 회사 상태"), offline);
  expect(port.onCommitted).not.toHaveBeenCalled();
});
it.each([403, 500, 0])("%i/응답 유실은 명시 재확인 전 재전송/자동 GET/성공 안내0", async status => {
  const { port, controller } = setup(); port.cancel.mockRejectedValue(new ApiError(status, "ERROR", "unconfirmed"));
  await controller.submit(request); await controller.submit(request);
  expect(port.cancel).toHaveBeenCalledTimes(1); expect(port.load).not.toHaveBeenCalled(); expect(port.onCommitted).not.toHaveBeenCalled(); expect(port.onError).toHaveBeenCalled();
});
it("취소 완료 뒤 재조회 실패는 완료와 경고를 구분하고 같은 취소를 반복하지 않는다", async () => {
  const { port, controller } = setup(); port.load.mockRejectedValue(new Error("offline")); await controller.submit(request);
  expect(port.onCommitted).toHaveBeenCalledExactlyOnceWith(result); expect(port.onError).not.toHaveBeenCalled(); expect(port.onNotice).toHaveBeenCalledWith(expect.stringContaining("취소는 완료됐지만"));
  await controller.submit(request); expect(port.cancel).toHaveBeenCalledTimes(1);
});
it("sessionWarning이면 확인된 완료를 보존하고 세션 갱신을 자동 반복하지 않는다", async () => {
  const { port, controller } = setup(); port.cancel.mockResolvedValue({ ...result, sessionWarning: "확인이 필요해요" }); await controller.submit(request);
  expect(port.onCommitted).toHaveBeenCalledWith({ ...result, sessionWarning: "확인이 필요해요" }); expect(port.load).not.toHaveBeenCalled();
});
it("성공 뒤 최신 연결 회사/새 신청이 있으면 최신 조회를 우선하고 자동 취소하지 않는다", async () => {
  for (const latest of [
    { status: "pending", request: { ...request, requestId: 9001, version: 1 } },
    { status: "connected", profile: { companyId: 7001, companyName: "합성 회사", businessNumber: "1234567890", representativeName: null, verificationStatus: "VERIFIED", address: null, telephoneNumber: null, establishedYear: null, primaryIndustries: [] } },
  ] satisfies CompanyOverview[]) {
    const { port, controller } = setup(); port.load.mockResolvedValue(latest); await controller.submit(request);
    expect(port.onCommitted).toHaveBeenCalledExactlyOnceWith(result); expect(port.onOverview).toHaveBeenCalledWith(latest); expect(port.cancel).toHaveBeenCalledTimes(1);
  }
});
it.each([404, 409])("취소 %i 뒤 재조회 최종401을 로그인 분기로 전달하고 재취소하지 않는다", async status => {
  const { port, controller } = setup(); const expired = new ApiError(401, "EXPIRED", "expired");
  port.cancel.mockRejectedValue(new ApiError(status, status === 404 ? "CR001" : "CR004", "changed"));
  port.load.mockRejectedValue(expired); await controller.submit(request);
  expect(port.onError).toHaveBeenLastCalledWith(expect.any(String), expired);
  expect(port.onCommitted).not.toHaveBeenCalled(); expect(port.onOverview).not.toHaveBeenCalled(); expect(port.cancel).toHaveBeenCalledTimes(1);
});
it("취소 성공 뒤 재조회 최종401은 확인된 완료 안내와 로그인 분기를 함께 보존한다", async () => {
  const { port, controller } = setup(); const expired = new ApiError(401, "EXPIRED", "expired");
  port.load.mockRejectedValue(expired); await controller.submit(request);
  expect(port.onCommitted).toHaveBeenCalledExactlyOnceWith(result);
  expect(port.onNotice).toHaveBeenCalledWith(expect.stringContaining("취소는 완료됐어요"));
  expect(port.onError).toHaveBeenLastCalledWith(expect.any(String), expired);
  expect(port.onOverview).not.toHaveBeenCalled(); expect(port.cancel).toHaveBeenCalledTimes(1);
});

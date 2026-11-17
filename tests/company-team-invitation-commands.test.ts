import { describe, expect, it, vi } from "vitest";
import { createHttpCompanyRepository } from "@/data/company/http-repository";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { createHttpClient } from "@/data/shared/http";
import { memoryStorage } from "@/data/mock/store";
import { access, mockRuntime, ok, testNow } from "./helpers";
import { invitationFixture, invitationInput } from "./company-team-invitation-fixtures";

const http = (fetcher: typeof fetch) => createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));
const resent = () => ({ ...invitationFixture(), version: 2, delivery: { version: 2, status: "PENDING" as const }, updatedAt: new Date(testNow + 1000).toISOString(), expiresAt: new Date(testNow + 7 * 86400_000 + 1000).toISOString() });
const canceled = () => ({ ...invitationFixture(), status: "CANCELED" as const, version: 2, updatedAt: new Date(testNow + 1000).toISOString(), completedAt: new Date(testNow + 1000).toISOString() });

describe("초대 재발송·취소 HTTP", () => {
  it("재발송은 version body·취소는 query만 전송하고 비공개 필드를 버린다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok({ ...resent(), privateLink: "synthetic-omitted" })).mockResolvedValueOnce(ok(canceled()));
    const repo = http(fetcher), signal = new AbortController().signal;
    expect(await repo.resendTeamInvitation(access, 7001, 8201, 1, signal)).toEqual(resent());
    expect(await repo.cancelTeamInvitation(access, 7001, 8201, 1, signal)).toEqual(canceled());
    expect(fetcher.mock.calls.map(([url, init]) => [new URL(String(url)).pathname + new URL(String(url)).search, init?.method, init?.body])).toEqual([
      ["/api/v1/companies/7001/membership-invitations/8201/resend", "POST", JSON.stringify({ expectedVersion: 1 })],
      ["/api/v1/companies/7001/membership-invitations/8201?expectedVersion=1", "DELETE", undefined],
    ]);
    for (const [, init] of fetcher.mock.calls) {
      expect(init).toMatchObject({ credentials: "include", cache: "no-store", signal });
      expect(new Headers(init?.headers).has("Idempotency-Key")).toBe(false);
    }
  });
  it.each([0, -1, 1.5, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER + 1])("잘못된 version %s는 요청하지 않는다", async version => {
    const fetcher = vi.fn<typeof fetch>(), repo = http(fetcher);
    await expect(repo.resendTeamInvitation(access, 7001, 8201, version)).rejects.toMatchObject({ status: 400 });
    await expect(repo.cancelTeamInvitation(access, 7001, 8201, version)).rejects.toMatchObject({ status: 400 });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it.each(["resendTeamInvitation", "cancelTeamInvitation"] as const)("%s의 잘못된 ID·상태·version은 성공이 아니다", async action => {
    for (const patch of [{ invitationId: 8202 }, { companyId: 7002 }, { version: 1 }, { version: 3 }, { status: "ACCEPTED", completedAt: new Date(testNow).toISOString() }]) {
      const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok({ ...(action === "resendTeamInvitation" ? resent() : canceled()), ...patch }));
      await expect(http(fetcher)[action](access, 7001, 8201, 1)).rejects.toThrow(); expect(fetcher).toHaveBeenCalledOnce();
    }
    const fetcher = vi.fn<typeof fetch>();
    await expect(http(fetcher)[action](access, 0, 8201, 1)).rejects.toThrow();
    await expect(http(fetcher)[action](access, 7001, 0, 1)).rejects.toThrow(); expect(fetcher).not.toHaveBeenCalled();
  });
  it.each([403, 404, 409, 429, 500])("서버 %s는 자동 재발송/취소하지 않는다", async status => {
    for (const action of ["resendTeamInvitation", "cancelTeamInvitation"] as const) {
      const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok(null, status));
      await expect(http(fetcher)[action](access, 7001, 8201, 1)).rejects.toMatchObject({ status }); expect(fetcher).toHaveBeenCalledOnce();
    }
  });
  it("응답 유실·빈/손상 성공을 자동 명령으로 복구하지 않는다", async () => {
    for (const response of [() => Promise.reject(new TypeError("synthetic transport")), async () => ok(null), async () => new Response('{"success":true,"data":{}}')]) {
      const fetcher = vi.fn<typeof fetch>(response);
      await expect(http(fetcher).resendTeamInvitation(access, 7001, 8201, 1)).rejects.toThrow(); expect(fetcher).toHaveBeenCalledOnce();
    }
  });
  it("이전/취소 handoff의 서버 거부를 수락 성공이나 세션 변경으로 만들지 않는다 (fetch 대역)", async () => {
    for (const code of ["CI003", "CI004"]) {
      const refresh = vi.fn(access.refresh), fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ isSuccess: false, code, data: null }), { status: 409 }));
      await expect(http(fetcher).acceptInvitation({ ...access, refresh }, 1)).rejects.toMatchObject({ status: 409, code });
      expect(refresh).not.toHaveBeenCalled(); expect(fetcher).toHaveBeenCalledOnce();
    }
  });
});

describe("초대 관리 mock·직렬화", () => {
  function setup(scenario = "connected") {
    let now = testNow;
    const storage = memoryStorage(), runtime = mockRuntime(storage, { company: scenario }, () => now);
    const repo = createMockCompanyRepository(runtime);
    return { runtime, storage, repo, advance: (ms: number) => { now += ms; } };
  }
  it("재발송은 동일 정보·새 delivery/version·7일이며 이전 대기를 대체한다", async () => {
    const x = setup(), first = await x.repo.createTeamInvitation(access, 7001, invitationInput()); x.advance(1000);
    const next = await x.repo.resendTeamInvitation(access, 7001, first.invitationId, first.version);
    expect(next).toMatchObject({ invitationId: first.invitationId, invitedEmail: first.invitedEmail, permissions: first.permissions, version: 2, delivery: { version: 2, status: "PENDING" }, expiresAt: new Date(testNow + 7 * 86400_000 + 1000).toISOString() });
    const state = JSON.parse(x.storage.getItem(x.runtime.store.key("1", "company-team-invitations"))!);
    expect(state.deliveries).toEqual([{ invitationId: first.invitationId, version: 1, status: "SUPERSEDED" }, { invitationId: first.invitationId, version: 2, status: "PENDING" }]);
    const restored = createMockCompanyRepository(x.runtime);
    expect(await restored.getTeamInvitation(access, 7001, first.invitationId)).toEqual(next);
  });
  it("취소는 목록에서 사라지고 상세의 완료/version은 보존한다", async () => {
    const x = setup(), first = await x.repo.createTeamInvitation(access, 7001, invitationInput());
    const next = await x.repo.cancelTeamInvitation(access, 7001, first.invitationId, 1);
    expect(next).toMatchObject({ status: "CANCELED", version: 2, completedAt: new Date(testNow).toISOString(), delivery: first.delivery });
    expect((await x.repo.listTeamInvitations(access, 7001)).totalElements).toBe(0);
    expect(await x.repo.getTeamInvitation(access, 7001, first.invitationId)).toEqual(next);
    await expect(x.repo.resendTeamInvitation(access, 7001, first.invitationId, 1)).rejects.toMatchObject({ code: "CI004" });
    await expect(x.repo.cancelTeamInvitation(access, 7001, first.invitationId, 2)).rejects.toMatchObject({ code: "CI003" });
  });
  it.each(["ACCEPTED", "DECLINED", "EXPIRED", "CANCELED"] as const)("%s를 부활시키지 않는다", async status => {
    const x = setup(), first = await x.repo.createTeamInvitation(access, 7001, invitationInput());
    x.runtime.store.write("1", "company-team-invitations", { version: 1, nextId: first.invitationId + 1, invitations: [{ ...first, status, completedAt: new Date(testNow).toISOString() }] });
    for (const action of ["resendTeamInvitation", "cancelTeamInvitation"] as const) await expect(x.repo[action](access, 7001, first.invitationId, 1)).rejects.toMatchObject({ code: "CI003" });
  });
  it("서로 다른 factory의 동시 재발송/취소는 같은 version을 한 번만 소비한다", async () => {
    const x = setup(), first = await x.repo.createTeamInvitation(access, 7001, invitationInput()), second = createMockCompanyRepository(x.runtime);
    const results = await Promise.allSettled([x.repo.resendTeamInvitation(access, 7001, first.invitationId, 1), second.cancelTeamInvitation(access, 7001, first.invitationId, 1)]);
    expect(results.filter(v => v.status === "fulfilled")).toHaveLength(1);
    expect((results.find(v => v.status === "rejected") as PromiseRejectedResult).reason).toMatchObject({ code: "CI004" });
    expect((await x.repo.getTeamInvitation(access, 7001, first.invitationId)).version).toBe(2);
  });
  it("만료 DB 잔존 resend 창과 cancel expiry를 보존하며 UI D3와 구분한다", async () => {
    const x = setup(), first = await x.repo.createTeamInvitation(access, 7001, invitationInput()); x.advance(7 * 86400_000);
    expect((await x.repo.getTeamInvitation(access, 7001, first.invitationId)).status).toBe("EXPIRED");
    // Source resend does not call expiry first. User-facing commands must reject this in the controller.
    expect((await x.repo.resendTeamInvitation(access, 7001, first.invitationId, 1)).status).toBe("PENDING");
    x.advance(7 * 86400_000);
    await expect(x.repo.cancelTeamInvitation(access, 7001, first.invitationId, 2)).rejects.toMatchObject({ code: "CI004" });
    expect((await x.repo.getTeamInvitation(access, 7001, first.invitationId)).status).toBe("EXPIRED");
  });
  it("메일 실패도 재발송 명령 성공/새 version과 구별한다", async () => {
    const x = setup("team-invitation-mail-failed"), first = await x.repo.createTeamInvitation(access, 7001, invitationInput());
    expect(await x.repo.resendTeamInvitation(access, 7001, first.invitationId, 1)).toMatchObject({ status: "PENDING", version: 2, delivery: { status: "FAILED", version: 2 } });
  });
  it("다른 계정의 초대는 조회/변경하지 않으며 다른 회사·기존 저장소를 보존한다", async () => {
    const x = setup(), first = await x.repo.createTeamInvitation(access, 7001, invitationInput());
    const companyBefore = x.storage.getItem(x.runtime.store.key("1", "company"));
    await expect(x.repo.cancelTeamInvitation({ ...access, getAccountKey: () => "2" }, 7001, first.invitationId, 1)).rejects.toMatchObject({ status: 404 });
    await expect(x.repo.resendTeamInvitation(access, 7002, first.invitationId, 1)).rejects.toMatchObject({ status: 403 });
    expect(x.storage.getItem(x.runtime.store.key("1", "company"))).toBe(companyBefore);
    expect((await x.repo.getTeamInvitation(access, 7001, first.invitationId)).version).toBe(1);
  });
});

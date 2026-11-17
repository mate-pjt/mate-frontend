import { describe, expect, it, vi } from "vitest";
import { createHttpCompanyRepository } from "@/data/company/http-repository";
import { createMockCompanyRepository } from "@/data/company/mock-repository";
import { mapTeamInvitation, mapTeamInvitationPage } from "@/data/company/team-invitation-api";
import { normalizeTeamInvitation } from "@/data/company/team-invitation-input";
import { createHttpClient } from "@/data/shared/http";
import { memoryStorage } from "@/data/mock/store";
import { createMockTeamManagement } from "@/data/company/team-management-mock";
import { createMockTeamInvitations } from "@/data/company/team-invitation-mock";
import { access, mockRuntime, ok, testNow } from "./helpers";

import { invitationInput, invitationFixture, invitationPage } from "./company-team-invitation-fixtures";
const http = (fetcher: typeof fetch) => createHttpCompanyRepository(createHttpClient("https://synthetic-api.test", fetcher));

describe("초대 입력 경계", () => {
  it("서버와 같은 email/공백 정규화와 명시 필드만 사용한다", () => {
    const value = normalizeTeamInvitation({ ...invitationInput(), email: "  INVITED@EXAMPLE.TEST  ", inviteeDisplayName: " 가상 초대 팀원 ", message: "  ", unrelated: "not copied" } as never);
    expect(value).toEqual(invitationInput()); expect(value).not.toHaveProperty("unrelated");
    expect(normalizeTeamInvitation({ ...invitationInput(), positionId: null, proposedPositionName: " 새 직급 " }).proposedPositionName).toBe("새 직급");
  });
  it.each([
    { email: "bad" }, { email: "가상@example.test" }, { email: `${"a".repeat(250)}@example.test` }, { inviteeDisplayName: " " },
    { inviteeDisplayName: "가".repeat(101) }, { inviteeDisplayName: "가상\n팀원" }, { positionId: 0 }, { positionId: null },
    { proposedPositionName: "새 직급" }, { positionId: null, proposedPositionName: "대표자" }, { positionId: null, proposedPositionName: "가".repeat(31) },
    { extraPermissionCodes: ["A", "A"] }, { extraPermissionCodes: ["unknown"] }, { message: "가".repeat(501) }, { message: "메시지\n다음" },
    { representative: true }, { positionId: undefined }, { preset: undefined }, { message: undefined },
  ])("잘못된 입력을 거부한다 %#", patch => expect(() => normalizeTeamInvitation({ ...invitationInput(), ...patch } as never)).toThrow());
  it("대표자에는 일반 직급/preset/추가 권한을 함께 보내지 않는다", () => {
    const body = { ...invitationInput(), representative: true, positionId: null, preset: null };
    expect(normalizeTeamInvitation(body)).toEqual(body);
    expect(() => normalizeTeamInvitation({ ...body, preset: "ADMIN" })).toThrow();
    expect(() => normalizeTeamInvitation({ ...body, extraPermissionCodes: ["COMPANY_MEMBER_INVITE"] })).toThrow();
  });
});

describe("초대 HTTP 계약", () => {
  it("생성·목록·상세의 정확한 wire와 불필요한 응답 필드 폐기를 확인한다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(ok({ ...invitationFixture(), privateLink: "synthetic-omitted", accountId: 99 }))
      .mockResolvedValueOnce(ok(invitationPage())).mockResolvedValueOnce(ok(invitationFixture()));
    const repo = http(fetcher), controller = new AbortController();
    const value = await repo.createTeamInvitation(access, 7001, { ...invitationInput(), email: " INVITED@EXAMPLE.TEST " }, controller.signal);
    expect(value).toEqual(invitationFixture());
    await repo.listTeamInvitations(access, 7001, 0, 20, controller.signal); await repo.getTeamInvitation(access, 7001, 8201, controller.signal);
    expect(fetcher.mock.calls.map(([url, init]) => [new URL(String(url)).pathname + new URL(String(url)).search, init?.method])).toEqual([
      ["/api/v1/companies/7001/membership-invitations", "POST"], ["/api/v1/companies/7001/membership-invitations?page=0&size=20", "GET"], ["/api/v1/companies/7001/membership-invitations/8201", "GET"],
    ]);
    expect(JSON.parse(String(fetcher.mock.calls[0][1]?.body))).toEqual(invitationInput());
    expect(fetcher.mock.calls.every(([, init]) => init?.credentials === "include" && init.cache === "no-store" && init.signal === controller.signal && !new Headers(init.headers).has("Idempotency-Key"))).toBe(true);
  });
  it("등록된 이름은 서버 응답을 보존한다", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok({ ...invitationFixture(), registeredAccount: true, inviteeDisplayName: "가상 등록 팀원" }));
    expect((await http(fetcher).createTeamInvitation(access, 7001, invitationInput())).inviteeDisplayName).toBe("가상 등록 팀원");
  });
  it.each([0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1])("잘못된 회사/초대 ID는 HTTP 전에 거부 %s", async id => {
    const fetcher = vi.fn<typeof fetch>(), repo = http(fetcher);
    await expect(repo.createTeamInvitation(access, id, invitationInput())).rejects.toMatchObject({ status: 400 });
    await expect(repo.getTeamInvitation(access, 7001, id)).rejects.toMatchObject({ status: 400 }); expect(fetcher).not.toHaveBeenCalled();
  });
  it.each([
    { companyId: 7002 }, { invitationId: 0 }, { registeredAccount: undefined }, { representative: null }, { version: 0 }, { delivery: { version: 1, status: "UNKNOWN" } },
    { delivery: { status: "SENT" } }, { expiresAt: "2030-02-30T00:00:00Z" }, { completedAt: undefined }, { completedAt: "2030-06-01T02:00:00Z" },
    { status: "ACCEPTED" }, { updatedAt: "2030-05-01T01:00:00Z" }, { permissions: [] }, { position: {} }, { role: "OTHER" },
  ])("손상 응답을 성공으로 만들지 않는다 %#", patch => expect(() => mapTeamInvitation({ ...invitationFixture(), ...patch }, 7001)).toThrow());
  it("wrong exact ID·생성 상태·email·미등록 이름·직급을 성공으로 만들지 않는다", async () => {
    await expect(http(vi.fn<typeof fetch>().mockResolvedValue(ok(invitationFixture()))).getTeamInvitation(access, 7001, 8202)).rejects.toThrow();
    for (const patch of [{ status: "EXPIRED" }, { invitedEmail: "other@example.test" }, { inviteeDisplayName: "다른 가상 팀원" }, { position: { positionId: 3, name: "담당자" } }]) {
      await expect(http(vi.fn<typeof fetch>().mockResolvedValue(ok({ ...invitationFixture(), ...patch }))).createTeamInvitation(access, 7001, invitationInput())).rejects.toThrow();
    }
  });
  it.each(["PENDING", "SENDING", "SENT", "FAILED", "SUPERSEDED"])("delivery %s는 초대 수락과 별개다", status => {
    expect(mapTeamInvitation({ ...invitationFixture(), delivery: { version: 1, status } }, 7001)).toMatchObject({ status: "PENDING", delivery: { status } });
  });
  it("pending DB 만료·정확한 count와 DESC/ID/nanosecond 순서를 보존한다", () => {
    const first = { ...invitationFixture(), invitationId: 8202, createdAt: "2030-06-01T01:00:00.123456789Z", updatedAt: "2030-06-01T01:00:00.123456789Z" };
    const second = { ...invitationFixture(), createdAt: "2030-06-01T01:00:00.123456788Z", updatedAt: "2030-06-01T01:00:00.123456788Z", status: "EXPIRED" as const };
    expect(mapTeamInvitationPage(invitationPage([first, second]), 7001, 0, 20).content[1].status).toBe("EXPIRED");
    expect(() => mapTeamInvitationPage(invitationPage([second, first]), 7001, 0, 20)).toThrow();
    expect(() => mapTeamInvitationPage({ ...invitationPage(), totalElements: 2 }, 7001, 0, 20)).toThrow();
    expect(() => mapTeamInvitationPage(invitationPage([first, first]), 7001, 0, 20)).toThrow();
  });
  it.each([400, 403, 404, 409, 500])("실제 서버 오류 %s를 fallback/재생성하지 않는다", async status => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(ok(null, status));
    await expect(http(fetcher).createTeamInvitation(access, 7001, invitationInput())).rejects.toMatchObject({ status }); expect(fetcher).toHaveBeenCalledTimes(1);
  });
});

describe("초대 mock의 현재 권한과 계정 격리", () => {
  const make = (scenario = "connected") => createMockCompanyRepository(mockRuntime(memoryStorage(), { company: scenario }));
  it("같은 company 포트의 일반 초대/등록 이름·새 직급 제안을 보존하고 실제 메일은 만들지 않는다", async () => {
    const repo = make(), created = await repo.createTeamInvitation(access, 7001, invitationInput());
    expect(created.delivery.status).toBe("PENDING"); expect((await repo.getTeamInvitation(access, 7001, created.invitationId))).toEqual(created);
    expect((await repo.createTeamInvitation(access, 7001, { ...invitationInput(), email: "registered-member@example.test" })).inviteeDisplayName).toBe("가상 등록 팀원");
    expect((await repo.createTeamInvitation(access, 7001, { ...invitationInput(), email: "new-position@example.test", positionId: null, proposedPositionName: "새 담당" })).position).toEqual({ positionId: null, name: "새 담당" });
  });
  it("기본 VIEWER에 invite leaf만 추가된 actor는 기존 직급의 VIEWER만 초대한다", async () => {
    const repo = make("team-extra");
    expect((await repo.createTeamInvitation(access, 7001, invitationInput())).role).toBe("VIEWER");
    await expect(repo.createTeamInvitation(access, 7001, { ...invitationInput(), email: "new@example.test", positionId: null, proposedPositionName: "새 담당" })).rejects.toMatchObject({ status: 403 });
    await expect(repo.createTeamInvitation(access, 7001, { ...invitationInput(), email: "extra@example.test", extraPermissionCodes: ["COMPANY_MEMBER_INVITE"] })).rejects.toMatchObject({ status: 403 });
  });
  it.each(["team-viewer", "team-agent", "team-read-only", "team-denied"])("invite 없음/읽기 전용은 role로 우회하지 않는다 %s", async scenario => {
    await expect(make(scenario).createTeamInvitation(access, 7001, invitationInput())).rejects.toMatchObject({ status: 403 });
  });
  it("대표자 공석의 관리자만 대표자로 초대한다", async () => {
    const input = { ...invitationInput(), representative: true, positionId: null, preset: null };
    expect((await make("team-no-representative").createTeamInvitation(access, 7001, input))).toMatchObject({ representative: true, role: "ADMIN", position: { positionId: null, name: "대표자" } });
    await expect(make().createTeamInvitation(access, 7001, input)).rejects.toMatchObject({ status: 409, code: "CI008" });
    await expect(make("team-extra").createTeamInvitation(access, 7001, input)).rejects.toMatchObject({ status: 403 });
  });
  it.each([["active-member@example.test", "CM004"], ["pending-member@example.test", "CI010"], ["ambiguous-member@example.test", "CI011"]])("중복 신원·소속·신청은 성공이 아니다 %s", async (email, code) => {
    await expect(make().createTeamInvitation(access, 7001, { ...invitationInput(), email })).rejects.toMatchObject({ status: 409, code });
  });
  it("동시 같은 이메일1건만 생성하고 다른 이메일 성공을 유실하지 않는다", async () => {
    const repo = make();
    const same = await Promise.allSettled([repo.createTeamInvitation(access, 7001, invitationInput()), repo.createTeamInvitation(access, 7001, invitationInput())]);
    expect(same.filter(v => v.status === "fulfilled")).toHaveLength(1);
    await Promise.all(["a", "b"].map(key => repo.createTeamInvitation(access, 7001, { ...invitationInput(), email: `${key}@example.test` })));
    expect((await repo.listTeamInvitations(access, 7001)).totalElements).toBe(3);
  });
  it("외부 대표자 취임은 진행 중 초대의 공석 검사/쓰기 사이에 들어오지 않는다", async () => {
    const runtime = mockRuntime(memoryStorage(), { company: "team-no-representative" });
    const team = createMockTeamManagement(runtime, () => 7001, () => {});
    let arrived!: () => void, release!: () => void, appointed = false;
    const entered = new Promise<void>(resolve => { arrived = resolve; }), barrier = new Promise<void>(resolve => { release = resolve; });
    const invitations = createMockTeamInvitations(runtime, { ...team, getCompanyTeamPositions: async (...args) => {
      const value = await team.getCompanyTeamPositions(...args); arrived(); await barrier; return value;
    } });
    const creating = invitations.createTeamInvitation(access, 7001, { ...invitationInput(), representative: true, positionId: null, preset: null });
    await entered;
    const appointing = team.changeTeamMemberPosition(access, 9101, { positionId: 1, expectedVersion: 1 }).then(value => { appointed = true; return value; });
    expect((await team.getCompanyTeamMember(access, 7001, 9101)).positionType).toBe("CUSTOM"); expect(appointed).toBe(false);
    release(); expect((await creating).representative).toBe(true); expect((await appointing).positionType).toBe("REPRESENTATIVE");
  });
  it("먼저 취임한 관리 명령 뒤 대표자 초대는 CI008로 거부하고 queue를 해제한다", async () => {
    const repo = make("team-no-representative");
    const appointing = repo.changeTeamMemberPosition(access, 9101, { positionId: 1, expectedVersion: 1 });
    const creating = repo.createTeamInvitation(access, 7001, { ...invitationInput(), representative: true, positionId: null, preset: null });
    const rejected = expect(creating).rejects.toMatchObject({ status: 409, code: "CI008" });
    await appointing; await rejected;
    expect((await repo.createTeamInvitation(access, 7001, invitationInput())).status).toBe("PENDING");
  });
  it("표시용 빈 목록을 대표자 공석으로 추정하지 않고 직급 오류 enum을 보존한다", async () => {
    expect((await make("team-empty").listTeamInvitations(access, 7001)).capabilities.canInviteRepresentative).toBe(false);
    await expect(make().createTeamInvitation(access, 7001, { ...invitationInput(), positionId: 9999 })).rejects.toMatchObject({ status: 400, code: "CI009" });
  });
  it("실패한 관리 명령 뒤 대기 중인 초대 명령도 정상 실행한다", async () => {
    const repo = make("team-last-admin");
    const ending = repo.leaveMyTeamMembership(access, 9101, 1), creating = repo.createTeamInvitation(access, 7001, invitationInput());
    const values = await Promise.allSettled([ending, creating]); expect(values[0]).toMatchObject({ status: "rejected", reason: { code: "CM006" } });
    expect(values[1]).toMatchObject({ status: "fulfilled", value: { status: "PENDING" } });
  });
  it("페이지/count·같은 시각 ID DESC와 새로고침 복원·계정 격리를 보존한다", async () => {
    const storage = memoryStorage(), runtime = mockRuntime(storage, { company: "connected" }), repo = createMockCompanyRepository(runtime);
    for (let i = 0; i < 21; i++) await repo.createTeamInvitation(access, 7001, { ...invitationInput(), email: `invited${i}@example.test` });
    const first = await repo.listTeamInvitations(access, 7001), second = await repo.listTeamInvitations(access, 7001, 1);
    expect(first).toMatchObject({ totalElements: 21, totalPages: 2 }); expect(first.content).toHaveLength(20); expect(second.content).toHaveLength(1);
    expect(first.content[0].invitationId).toBeGreaterThan(second.content[0].invitationId);
    const cold = createMockCompanyRepository(mockRuntime(storage, { company: "connected" })); expect((await cold.listTeamInvitations(access, 7001)).totalElements).toBe(21);
    expect((await cold.listTeamInvitations({ ...access, getAccountKey: () => "2" }, 7001)).totalElements).toBe(0);
    await expect(cold.listTeamInvitations(access, 7002)).rejects.toMatchObject({ status: 403 });
    const key = runtime.store.key("1", "company-team-invitations"), companyBefore = storage.getItem(runtime.store.key("1", "company"));
    storage.setItem(key, "bad-json"); expect((await cold.listTeamInvitations(access, 7001)).totalElements).toBe(0);
    expect(storage.getItem(runtime.store.key("1", "company"))).toBe(companyBefore); expect(storage.getItem(key)).not.toContain("privateLink");
  });
  it("만료 후 명시 새 생성은 이전 초대와 다른 ID이고 실제 시각을 사용한다", async () => {
    let now = testNow; const repo = createMockCompanyRepository(mockRuntime(memoryStorage(), { company: "connected" }, () => now));
    const first = await repo.createTeamInvitation(access, 7001, invitationInput()); now += 7 * 86_400_000;
    expect((await repo.listTeamInvitations(access, 7001)).content[0].status).toBe("EXPIRED");
    const next = await repo.createTeamInvitation(access, 7001, invitationInput()); expect(next.invitationId).not.toBe(first.invitationId);
    expect((await repo.listTeamInvitations(access, 7001)).totalElements).toBe(1); expect((await repo.getTeamInvitation(access, 7001, first.invitationId)).status).toBe("EXPIRED");
  });
  it("메일 전송 실패도 생성과 구분하고 자동 새 초대를 만들지 않는다", async () => {
    const repo = make("team-invitation-mail-failed"), result = await repo.createTeamInvitation(access, 7001, invitationInput());
    expect(result).toMatchObject({ status: "PENDING", delivery: { status: "FAILED" } }); expect((await repo.listTeamInvitations(access, 7001)).totalElements).toBe(1);
  });
  it("API 인증+회사 mock은 실제 token/refresh를 사용하지 않고 입력/반환 참조를 저장소에 공유하지 않는다", async () => {
    const runtime = mockRuntime(memoryStorage(), { company: "connected" }); runtime.authSource = "api";
    const port = { ...access, getAccessToken: vi.fn(access.getAccessToken), refresh: vi.fn(access.refresh) }, repo = createMockCompanyRepository(runtime);
    const input = invitationInput(), value = await repo.createTeamInvitation(port, 7001, input);
    input.extraPermissionCodes.push("COMPANY_MEMBER_INVITE"); value.permissions.push("UNKNOWN");
    const restored = await repo.getTeamInvitation(port, 7001, value.invitationId);
    expect(restored.permissions).not.toContain("UNKNOWN"); expect(port.getAccessToken).not.toHaveBeenCalled(); expect(port.refresh).not.toHaveBeenCalled();
  });
  it("기존 수신 흐름 회귀를 발송된 초대의 실제 메일/수락 PASS로 바꾸지 않는다", async () => {
    const repo = createMockCompanyRepository(mockRuntime(memoryStorage()));
    await repo.previewInvitation("mock-invite"); const received = await repo.resumeInvitation(access);
    expect((await repo.acceptInvitation(access, received.version)).companyId).toBe(7001);
    await expect(repo.acceptInvitation(access, received.version)).rejects.toThrow();
  });
});

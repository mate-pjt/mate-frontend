import { ApiError } from "../shared/errors";
import type { AuthAccess } from "../shared/http";
import { mockAccount, type MockRuntime } from "../mock/runtime";
import { mapTeamMember, validateTeamMemberId, validateTeamQuery } from "./team-api";
import { emptyMemberCapabilities, teamCatalogFixture, teamMemberFixtures } from "./team-mock";
import { mapTeamChangeRequest, mapTeamMutation, mapTeamPosition, teamChangeStatuses, validateTeamProposal, validateTeamReceipt } from "./team-management-api";
import { classifyTeamChange, sameTeamPermissions, teamRequiredPermissions, teamRoleFromPermissions } from "./team-permissions";
import type { CompanyTeamMember, CompanyTeamRepository } from "./team-contracts";
import type { CompanyTeamManagementRepository, TeamChangeCreated, TeamChangeKind, TeamChangeProposal, TeamChangeRequest, TeamMutation, TeamPosition } from "./team-management-contracts";

type Member = { value: CompanyTeamMember; status: TeamMutation["status"]; endedAt: string | null; updatedAt: string };
type Request = { value: TeamChangeRequest; issuerMembershipId: number };
type Company = { members: Member[]; positions: TeamPosition[]; requests: Request[] };
type State = { version: 1; companies: Record<string, Company>; nextId: number; receipts: Record<string, { signature: string; requestId: number }> };
const catalog = teamCatalogFixture();
const preset = (role: "ADMIN" | "AGENT" | "VIEWER") => [...catalog.presets.find(p => p.role === role)!.permissionCodes];
function forbidden(): never { throw new ApiError(403, "CM005", "현재 소속과 권한으로 변경할 수 없어요."); }
function conflict(code = "CM010", message = "상태가 변경됐어요. 최신 정보를 다시 조회해 주세요."): never { throw new ApiError(409, code, message); }
function missing(): never { throw new ApiError(404, "CMC001", "요청이나 대상 소속을 찾지 못했어요."); }
const validId = (id: number) => validateTeamMemberId(id);
const commandQueues = new WeakMap<MockRuntime["store"], Map<string, Promise<void>>>();

export function createMockTeamManagement(runtime: MockRuntime, companyFor: (account: string) => number | null, onLeave: (account: string) => void): CompanyTeamRepository & CompanyTeamManagementRepository {
  let queues = commandQueues.get(runtime.store);
  if (!queues) { queues = new Map(); commandQueues.set(runtime.store, queues); }
  async function serialize<T>(access: AuthAccess, operation: () => Promise<T>): Promise<T> {
    const account = access.getAccountKey();
    if (!account) throw new ApiError(401, "SESSION_INVALID", "로그인이 필요해요.");
    const previous = queues!.get(account) ?? Promise.resolve(); let release!: () => void;
    const tail = new Promise<void>(resolve => { release = resolve; }); queues!.set(account, tail);
    await previous;
    try {
      if (account !== access.getAccountKey()) throw new ApiError(401, "ACCOUNT_CHANGED", "로그인 계정이 변경됐어요.");
      return await operation();
    } finally { release(); if (queues!.get(account) === tail) queues!.delete(account); }
  }
  const scenario = () => runtime.scenario("company");
  const now = () => new Date(runtime.now()).toISOString();
  function initialCompany(): Company {
    const members = teamMemberFixtures().map(value => ({ value, status: "ACTIVE" as const, endedAt: null, updatedAt: value.joinedAt }));
    const role = scenario() === "team-agent" ? "AGENT" : ["team-viewer", "team-extra"].includes(scenario()) ? "VIEWER" : "ADMIN";
    members[0].value.permissions = preset(role); members[0].value.role = role;
    if (scenario() === "team-extra") members[0].value.permissions.push("COMPANY_MEMBER_INVITE");
    if (role !== "ADMIN" || scenario() === "team-no-representative") Object.assign(members[0].value, { positionId: 2, positionName: "사원", positionType: "CUSTOM" });
    if (scenario() === "team-last-admin") { members[3].value.permissions = preset("VIEWER"); members[3].value.role = "VIEWER"; }
    return { members, positions: [
      { id: 1, version: 1, name: "대표자", type: "REPRESENTATIVE" }, { id: 2, version: 1, name: "사원", type: "CUSTOM" }, { id: 3, version: 1, name: "담당자", type: "CUSTOM" },
    ], requests: [] };
  }
  function valid(value: unknown): value is State {
    try {
      const s = value as State;
      if (s?.version !== 1 || !Number.isSafeInteger(s.nextId) || s.nextId < 5101 || !s.companies || !s.receipts || Array.isArray(s.companies)) return false;
      for (const [companyId, c] of Object.entries(s.companies)) {
        validId(Number(companyId)); c.positions.forEach(mapTeamPosition);
        if (new Set(c.positions.map(p => p.id)).size !== c.positions.length || new Set(c.members.map(m => m.value.membershipId)).size !== c.members.length) return false;
        for (const m of c.members) {
          mapTeamMember({ ...m.value, accountId: 1 });
          if (m.value.role !== teamRoleFromPermissions(catalog, m.value.permissions) || m.value.positionType === "REPRESENTATIVE" && m.value.role !== "ADMIN") return false;
          mapTeamMutation({ ...m.value, companyId: Number(companyId), status: m.status, endedAt: m.endedAt, updatedAt: m.updatedAt }, m.value.membershipId);
        }
        for (const r of c.requests) { mapTeamChangeRequest(r.value); validId(r.issuerMembershipId); if (r.value.companyId !== Number(companyId)) return false; }
      }
      const ids = Object.values(s.companies).flatMap(c => c.requests.map(r => r.value.changeRequestId));
      if (new Set(ids).size !== ids.length || ids.some(id => id >= s.nextId)) return false;
      return Object.values(s.receipts).every(r => typeof r.signature === "string" && ids.includes(r.requestId));
    } catch { return false; }
  }
  const read = (account: string) => runtime.store.read<State>(account, "company-team-management", () => ({ version: 1, companies: {}, nextId: 5101, receipts: {} }), valid);
  const write = (account: string, s: State) => runtime.store.write(account, "company-team-management", s);
  function company(s: State, id: number): Company {
    if (!s.companies[id]) {
      const c = initialCompany(); s.companies[id] = c;
      if (scenario() === "team-pending") {
        const target = c.members[0].value;
        c.requests.push({ issuerMembershipId: 9104, value: makeRequest(s.nextId++, id, target, "POSITION", c.positions[2], target.permissions) });
      }
    }
    return s.companies[id];
  }
  function actor(c: Company) { return c.members.find(m => m.value.membershipId === 9101 && m.status === "ACTIVE") ?? forbidden(); }
  function mutable() { if (["team-read-only", "team-denied"].includes(scenario())) forbidden(); }
  function adminCount(c: Company) { return c.members.filter(m => m.status === "ACTIVE" && teamRoleFromPermissions(catalog, m.value.permissions) === "ADMIN").length; }
  function keepAdmin(c: Company, target: Member, permissions: string[] | null) {
    if (target.value.role === "ADMIN" && (permissions === null || teamRoleFromPermissions(catalog, permissions) !== "ADMIN") && adminCount(c) <= 1) conflict("CM006", "마지막 관리자의 권한과 소속은 유지해야 해요.");
  }
  function position(c: Company, id: number) { validId(id); return c.positions.find(p => p.id === id) ?? missing(); }
  function capabilities(c: Company, m: CompanyTeamMember) {
    if (scenario() === "team-read-only") return emptyMemberCapabilities();
    const a = actor(c).value, self = a.membershipId === m.membershipId;
    const permission = classifyTeamChange(catalog, a.permissions, m, "PERMISSIONS", null, preset("VIEWER"));
    const pos = classifyTeamChange(catalog, a.permissions, m, "POSITION", null, null);
    const end = m.role !== "ADMIN" || adminCount(c) > 1, admin = a.role === "ADMIN";
    return { canChangePermissions: !self && permission === "DIRECT", canChangePosition: !self && pos === "DIRECT",
      canRemove: !self && a.permissions.includes("COMPANY_MEMBER_REMOVE") && pos === "DIRECT" && end,
      canSelfDemote: self && (a.role === "ADMIN" ? adminCount(c) > 1 || m.positionType === "REPRESENTATIVE" : !sameTeamPermissions(m.permissions, preset("VIEWER"))),
      canLeave: self && end, canRequestPermissionChange: !self && a.permissions.includes("COMPANY_MEMBER_PERMISSION_MANAGE") && (pos === "CONSENT" || admin),
      canRequestPositionChange: !self && a.permissions.includes("COMPANY_MEMBER_PROFILE_EDIT") && (pos === "CONSENT" || admin),
      canRequestRemoval: !self && a.permissions.includes("COMPANY_MEMBER_REMOVE") && pos === "CONSENT" && end,
      canAppointSelfRepresentative: self && admin && !c.members.some(m => m.status === "ACTIVE" && m.value.positionType === "REPRESENTATIVE") };
  }
  function member(c: Company, id: number) { return c.members.find(m => m.value.membershipId === id) ?? missing(); }
  async function current(access: AuthAccess, signal?: AbortSignal) {
    const account = await mockAccount(runtime, access, "company", signal), companyId = companyFor(account);
    if (companyId === null || scenario() === "team-denied") forbidden();
    const s = read(account), c = company(s, companyId); actor(c); write(account, s);
    return { account, companyId, s, c };
  }
  function target(c: Company, id: number, expected: number) {
    validId(id); validId(expected); mutable(); const m = member(c, id);
    if (m.value.version !== expected) conflict();
    if (m.status !== "ACTIVE") conflict("CM001");
    return m;
  }
  function result(companyId: number, m: Member): TeamMutation {
    return mapTeamMutation({ ...m.value, companyId, status: m.status, endedAt: m.endedAt, updatedAt: m.updatedAt }, m.value.membershipId);
  }
  function replace(c: Company, m: Member, p: TeamPosition, permissions: string[] | null, end: "LEFT" | "REMOVED" | null = null) {
    if (permissions) { teamRoleFromPermissions(catalog, permissions); keepAdmin(c, m, permissions); }
    if (end) keepAdmin(c, m, null);
    if (!end && p.id === m.value.positionId && sameTeamPermissions(permissions ?? m.value.permissions, m.value.permissions)) return;
    Object.assign(m.value, { positionId: p.id, positionName: p.name, positionType: p.type, permissions: permissions ?? m.value.permissions,
      role: teamRoleFromPermissions(catalog, permissions ?? m.value.permissions), version: m.value.version + 1 });
    m.updatedAt = new Date(Math.max(runtime.now(), Date.parse(m.updatedAt), Date.parse(m.value.joinedAt))).toISOString();
    if (end) { m.status = end; m.endedAt = m.updatedAt; }
  }
  function makeRequest(id: number, companyId: number, m: CompanyTeamMember, kind: TeamChangeKind, p: TeamPosition | null, permissions: string[] | null): TeamChangeRequest {
    return { changeRequestId: id, companyId, targetMembershipId: m.membershipId, kind, status: "PENDING", requestVersion: 1,
      expectedMembershipVersion: m.version, issuerName: "가상 회사 담당자", beforePosition: { ...positionSnapshot(m), version: 1 },
      beforePermissionCodes: [...m.permissions], proposedPosition: p, proposedPermissionCodes: permissions, proposedMembershipStatus: kind === "REMOVE" ? "REMOVED" : "ACTIVE",
      createdAt: now(), processedAt: null, invalidationReason: null, appliedMembershipVersion: null,
      capabilities: { canAccept: false, canReject: false, canCancel: false, blockingReason: null } };
  }
  function positionSnapshot(m: CompanyTeamMember) { return { id: m.positionId, name: m.positionName, type: m.positionType }; }
  function present(c: Company, r: Request, currentCompany: number | null): TeamChangeRequest {
    const v = structuredClone(r.value), m = c.members.find(m => m.value.membershipId === v.targetMembershipId);
    const p = v.proposedPosition && c.positions.find(p => p.id === v.proposedPosition!.id);
    let invalidation: string | null = null;
    if (v.status === "PENDING") {
      if (!m || m.status !== "ACTIVE") invalidation = "TARGET_ENDED";
      else if (m.value.version !== v.expectedMembershipVersion) invalidation = "TARGET_CHANGED";
      else if (v.proposedPosition && !p) invalidation = "PROPOSED_POSITION_UNAVAILABLE";
      else if (p && (p.version !== v.proposedPosition!.version || p.name !== v.proposedPosition!.name)) invalidation = "PROPOSED_POSITION_CHANGED";
      if (invalidation) { v.status = "INVALIDATED"; v.invalidationReason = invalidation; }
    }
    const a = c.members.find(m => m.value.membershipId === 9101 && m.status === "ACTIVE");
    const self = v.targetMembershipId === 9101, active = currentCompany === v.companyId && !!a;
    const locked = scenario() === "team-read-only";
    const last = !!m && m.value.role === "ADMIN" && (v.proposedPermissionCodes === null || teamRoleFromPermissions(catalog, v.proposedPermissionCodes) !== "ADMIN") && adminCount(c) <= 1;
    const pending = v.status === "PENDING";
    v.capabilities = { canAccept: pending && self && active && !locked && !last, canReject: pending && self && active && !locked,
      canCancel: pending && active && !locked && teamRequiredPermissions(v.kind).every(code => a!.value.permissions.includes(code)),
      blockingReason: invalidation ?? (pending && locked ? "COMPANY_CHANGE_LOCKED" : pending && self && last ? "LAST_ADMIN_REQUIRED" : null) };
    return v;
  }
  function visible(c: Company, r: Request, currentCompany: number | null) {
    if (r.value.targetMembershipId === 9101) return true;
    const a = c.members.find(m => m.value.membershipId === 9101 && m.status === "ACTIVE");
    return currentCompany === r.value.companyId && !!a && teamRequiredPermissions(r.value.kind).every(code => a.value.permissions.includes(code));
  }
  async function requestContext(access: AuthAccess, id: number, signal?: AbortSignal) {
    validId(id); const account = await mockAccount(runtime, access, "company", signal), s = read(account), companyId = companyFor(account);
    if (companyId !== null) company(s, companyId);
    for (const c of Object.values(s.companies)) {
      const r = c.requests.find(r => r.value.changeRequestId === id);
      if (r && visible(c, r, companyId)) { write(account, s); return { account, s, c, r, companyId }; }
    }
    return missing();
  }
  function signature(operation: string, id: number, body: object) { return JSON.stringify([operation, id, body]); }
  const receiptKey = (companyId: number, key: string) => `${companyId}:${key}`;
  const repository: CompanyTeamRepository & CompanyTeamManagementRepository = {
    async getCompanyTeamContext(access, signal) { const account = await mockAccount(runtime, access, "company", signal); return { companyId: companyFor(account) }; },
    async getCompanyPermissionCatalog(access, signal) { await mockAccount(runtime, access, "company", signal); return teamCatalogFixture(); },
    async getCurrentCompanyPermissions(access, companyId, signal) { validateTeamQuery(companyId); const x = await current(access, signal); if (x.companyId !== companyId) forbidden(); return { companyId, membershipId: 9101, permissionCodes: [...actor(x.c).value.permissions] }; },
    async listCompanyTeamMembers(access, companyId, page = 0, size = 20, signal) {
      validateTeamQuery(companyId, page, size); const x = await current(access, signal); if (x.companyId !== companyId) forbidden();
      const all = x.c.members.filter(m => m.status === "ACTIVE" && scenario() !== "team-empty").map(m => ({ ...structuredClone(m.value), capabilities: capabilities(x.c, m.value) }));
      const a = actor(x.c).value, mutable = scenario() !== "team-read-only";
      return { content: all.slice(page * size, (page + 1) * size), page, size, totalElements: all.length, totalPages: Math.ceil(all.length / size),
        capabilities: { canInvite: mutable && a.permissions.includes("COMPANY_MEMBER_INVITE"), canReviewRequests: mutable && a.permissions.includes("COMPANY_MEMBERSHIP_REQUEST_REVIEW"), canManagePositions: mutable && a.permissions.includes("COMPANY_POSITION_MANAGE") } };
    },
    async getCompanyTeamMember(access, companyId, id, signal) { validId(id); validateTeamQuery(companyId); const x = await current(access, signal); if (x.companyId !== companyId) forbidden(); const m = member(x.c, id); if (m.status !== "ACTIVE" || scenario() === "team-empty") missing(); return { ...structuredClone(m.value), capabilities: capabilities(x.c, m.value) }; },
    async getCompanyTeamPositions(access, companyId, signal) { validateTeamQuery(companyId); const x = await current(access, signal); if (x.companyId !== companyId) forbidden(); return structuredClone(x.c.positions); },
    async changeTeamMemberPosition(access, id, body, signal) {
      const x = await current(access, signal), m = target(x.c, id, body.expectedVersion), p = position(x.c, body.positionId), a = actor(x.c).value;
      if (id === a.membershipId) {
        if (a.role !== "ADMIN" || p.type !== "REPRESENTATIVE" || m.value.positionId !== p.id && !capabilities(x.c, m.value).canAppointSelfRepresentative) forbidden();
      } else {
        const classification = classifyTeamChange(catalog, a.permissions, m.value, "POSITION", p, null);
        if (classification === "FORBIDDEN" || classification !== "DIRECT" && m.value.positionId !== p.id) forbidden();
      }
      replace(x.c, m, p, m.value.permissions); write(x.account, x.s); return result(x.companyId, m);
    },
    async changeTeamMemberPermissions(access, id, body, signal) {
      const x = await current(access, signal), m = target(x.c, id, body.expectedVersion);
      const classification = classifyTeamChange(catalog, actor(x.c).value.permissions, m.value, "PERMISSIONS", null, body.permissionCodes);
      if (id === 9101 || classification === "FORBIDDEN" || classification !== "DIRECT" && !sameTeamPermissions(body.permissionCodes, m.value.permissions)) forbidden();
      replace(x.c, m, position(x.c, m.value.positionId), body.permissionCodes); write(x.account, x.s); return result(x.companyId, m);
    },
    async demoteMyTeamMembership(access, id, body, signal) {
      const x = await current(access, signal), m = target(x.c, id, body.expectedVersion); teamRoleFromPermissions(catalog, body.permissionCodes);
      if (id !== 9101 || body.permissionCodes.some(code => !m.value.permissions.includes(code))) forbidden();
      if (m.value.positionType === "CUSTOM" && body.positionId !== null) forbidden();
      if (m.value.positionType === "REPRESENTATIVE" && body.positionId === null && sameTeamPermissions(m.value.permissions, body.permissionCodes)) return result(x.companyId, m);
      if (m.value.positionType === "REPRESENTATIVE" && body.positionId === null) conflict("TEAM_POSITION_REQUIRED", "대표자 직급을 해제할 일반 직급을 선택해 주세요.");
      const p = position(x.c, body.positionId ?? m.value.positionId); if (p.type === "REPRESENTATIVE") forbidden();
      replace(x.c, m, p, body.permissionCodes); write(x.account, x.s); return result(x.companyId, m);
    },
    async leaveMyTeamMembership(access, id, expected, signal) {
      const x = await current(access, signal), m = target(x.c, id, expected); if (id !== 9101) forbidden();
      replace(x.c, m, position(x.c, m.value.positionId), null, "LEFT"); write(x.account, x.s); onLeave(x.account); return result(x.companyId, m);
    },
    async removeCompanyTeamMember(access, id, expected, signal) {
      const x = await current(access, signal), m = target(x.c, id, expected);
      if (id === 9101 || !actor(x.c).value.permissions.includes("COMPANY_MEMBER_REMOVE") || classifyTeamChange(catalog, actor(x.c).value.permissions, m.value, "REMOVE", null, null) !== "DIRECT") forbidden();
      replace(x.c, m, position(x.c, m.value.positionId), null, "REMOVED"); write(x.account, x.s); return result(x.companyId, m);
    },
    async createTeamChangeRequest(access, id, body: TeamChangeProposal, signal): Promise<TeamChangeCreated> {
      validateTeamProposal(body); const x = await current(access, signal); mutable();
      const a = actor(x.c).value; if (id === 9101 || teamRequiredPermissions(body.kind).some(code => !a.permissions.includes(code))) forbidden();
      const sig = signature("create", id, { ...body, permissionCodes: "permissionCodes" in body ? [...body.permissionCodes].sort() : undefined });
      const key = receiptKey(x.companyId, body.requestKey), receipt = x.s.receipts[key];
      if (receipt) {
        if (receipt.signature !== sig) conflict("CMC005");
        const r = x.c.requests.find(r => r.value.changeRequestId === receipt.requestId) ?? missing();
        return { outcome: "REUSED", request: present(x.c, r, x.companyId), membership: null };
      }
      const m = target(x.c, id, body.expectedMembershipVersion), kind = body.kind;
      const p = kind === "REMOVE" ? null : position(x.c, "positionId" in body ? body.positionId : m.value.positionId);
      const permissions = kind === "REMOVE" ? null : "permissionCodes" in body ? [...body.permissionCodes].sort() : p?.type === "REPRESENTATIVE" ? preset("ADMIN") : [...m.value.permissions];
      if (p?.type === "REPRESENTATIVE" && teamRoleFromPermissions(catalog, permissions!) !== "ADMIN") forbidden();
      const classification = classifyTeamChange(catalog, a.permissions, m.value, kind, p, permissions);
      if (classification === "FORBIDDEN") forbidden();
      if (kind !== "REMOVE" && p!.id === m.value.positionId && sameTeamPermissions(permissions!, m.value.permissions)) return { outcome: "NO_CHANGE", request: null, membership: result(x.companyId, m) };
      if (classification === "DIRECT") conflict("CMC007", "동의 요청 대신 직접 변경해 주세요.");
      const pending = x.c.requests.find(r => r.value.targetMembershipId === id && present(x.c, r, x.companyId).status === "PENDING");
      if (pending && (pending.value.kind !== kind || pending.value.expectedMembershipVersion !== m.value.version || pending.value.proposedPosition?.id !== p?.id || !sameTeamPermissions(pending.value.proposedPermissionCodes ?? [], permissions ?? []))) conflict("CMC004", "다른 제안이 대기 중이에요. 기존 요청을 명시적으로 취소한 뒤 작성해 주세요.");
      const r = pending ?? { issuerMembershipId: 9101, value: makeRequest(x.s.nextId++, x.companyId, m.value, kind, p, permissions) };
      r.value.beforePosition = structuredClone(position(x.c, m.value.positionId));
      if (!pending) x.c.requests.push(r);
      x.s.receipts[key] = { signature: sig, requestId: r.value.changeRequestId }; write(x.account, x.s);
      return { outcome: pending ? "REUSED" : "CREATED", request: present(x.c, r, x.companyId), membership: null };
    },
    async listTeamChangeRequests(access, query, signal) {
      const account = await mockAccount(runtime, access, "company", signal), companyId = companyFor(account), s = read(account), page = query.page ?? 0, size = query.size ?? 20;
      validateTeamQuery(query.companyId ?? 1, page, size);
      if (query.scope !== "mine" && query.scope !== "company" || query.status && !teamChangeStatuses.includes(query.status) || query.scope === "mine" && (query.companyId !== undefined || query.membershipId !== undefined)) forbidden();
      if (companyId !== null) company(s, companyId);
      if (query.scope === "company" && (query.companyId !== companyId || companyId === null)) forbidden();
      const all = Object.values(s.companies).flatMap(c => c.requests.filter(r => visible(c, r, companyId) && (query.scope === "mine" ? r.value.targetMembershipId === 9101 : r.value.companyId === companyId)).map(r => present(c, r, companyId)))
        .filter(r => (!query.status || r.status === query.status) && (!query.membershipId || r.targetMembershipId === query.membershipId))
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt) || b.changeRequestId - a.changeRequestId);
      write(account, s); return { content: all.slice(page * size, (page + 1) * size), page, size, totalElements: all.length, totalPages: Math.ceil(all.length / size) };
    },
    async getTeamChangeRequest(access, id, signal) { const x = await requestContext(access, id, signal); return present(x.c, x.r, x.companyId); },
    async decideTeamChangeRequest(access, id, body, signal) {
      const x = await requestContext(access, id, signal), v = x.r.value; mutable(); validateTeamReceipt(body);
      if (v.targetMembershipId !== 9101 || !["ACCEPT", "REJECT"].includes(body.decision)) forbidden();
      const sig = signature("decide", id, body), key = receiptKey(v.companyId, body.requestKey), receipt = x.s.receipts[key];
      if (receipt) { if (receipt.signature !== sig) conflict("CMC005"); if (v.status === "INVALIDATED") conflict("CMC006"); return present(x.c, x.r, x.companyId); }
      if (v.requestVersion !== body.expectedRequestVersion || v.status !== "PENDING") conflict("CMC003");
      const effective = present(x.c, x.r, x.companyId);
      if (effective.status === "INVALIDATED") { v.status = "INVALIDATED"; v.invalidationReason = effective.invalidationReason; v.requestVersion++; v.processedAt = now(); x.s.receipts[key] = { signature: sig, requestId: id }; write(x.account, x.s); conflict("CMC006"); }
      if (!(body.decision === "ACCEPT" ? effective.capabilities.canAccept : effective.capabilities.canReject)) conflict("TEAM_BLOCKED", "현재 소속·회사 변경 잠금과 마지막 관리자 조건을 확인해 주세요.");
      if (body.decision === "ACCEPT") { const m = member(x.c, v.targetMembershipId); replace(x.c, m, v.proposedPosition ?? position(x.c, m.value.positionId), v.proposedPermissionCodes, v.kind === "REMOVE" ? "REMOVED" : null); v.appliedMembershipVersion = m.value.version; }
      v.status = body.decision === "ACCEPT" ? "APPLIED" : "REJECTED"; v.requestVersion++; v.processedAt = now();
      x.s.receipts[key] = { signature: sig, requestId: id }; write(x.account, x.s);
      if (v.status === "APPLIED" && v.kind === "REMOVE") onLeave(x.account);
      return present(x.c, x.r, companyFor(x.account));
    },
    async cancelTeamChangeRequest(access, id, body, signal) {
      const x = await requestContext(access, id, signal), v = x.r.value; mutable(); validateTeamReceipt(body);
      const sig = signature("cancel", id, body), key = receiptKey(v.companyId, body.requestKey), receipt = x.s.receipts[key];
      const effective = present(x.c, x.r, x.companyId);
      if (x.companyId !== v.companyId || !teamRequiredPermissions(v.kind).every(code => actor(x.c).value.permissions.includes(code))) forbidden();
      if (receipt) { if (receipt.signature !== sig) conflict("CMC005"); if (v.status === "INVALIDATED") conflict("CMC006"); return effective; }
      if (v.requestVersion !== body.expectedRequestVersion || v.status !== "PENDING") conflict("CMC003");
      if (effective.status === "INVALIDATED") { v.status = "INVALIDATED"; v.invalidationReason = effective.invalidationReason; v.requestVersion++; v.processedAt = now(); x.s.receipts[key] = { signature: sig, requestId: id }; write(x.account, x.s); conflict("CMC006"); }
      if (!effective.capabilities.canCancel) forbidden();
      v.status = "CANCELED"; v.requestVersion++; v.processedAt = now(); x.s.receipts[key] = { signature: sig, requestId: id }; write(x.account, x.s); return present(x.c, x.r, x.companyId);
    },
  };
  const commands: CompanyTeamManagementRepository = {
    ...repository,
    changeTeamMemberPosition: (...args) => serialize(args[0], () => repository.changeTeamMemberPosition(...args)),
    changeTeamMemberPermissions: (...args) => serialize(args[0], () => repository.changeTeamMemberPermissions(...args)),
    demoteMyTeamMembership: (...args) => serialize(args[0], () => repository.demoteMyTeamMembership(...args)),
    leaveMyTeamMembership: (...args) => serialize(args[0], () => repository.leaveMyTeamMembership(...args)),
    removeCompanyTeamMember: (...args) => serialize(args[0], () => repository.removeCompanyTeamMember(...args)),
    createTeamChangeRequest: (...args) => serialize(args[0], () => repository.createTeamChangeRequest(...args)),
    decideTeamChangeRequest: (...args) => serialize(args[0], () => repository.decideTeamChangeRequest(...args)),
    cancelTeamChangeRequest: (...args) => serialize(args[0], () => repository.cancelTeamChangeRequest(...args)),
  };
  return { ...repository, ...commands };
}

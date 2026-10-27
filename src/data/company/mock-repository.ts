import { ApiError } from "../shared/errors";
import { mockAccount, mockOperation, type MockRuntime } from "../mock/runtime";
import { isCount, isDate, isRecord } from "../mock/validation";
import type { AuthAccess } from "../shared/http";
import type { BusinessConnection, CompanyBasicProfile, CompanyOverview, CompanyRegistrationProposal, CompanyRepository, CompanySearchItem, DocumentUpload, InvitationContext, MyMembershipRequest, RegistrationResult, SignupCompanyProfile } from "./contracts";

// Company metadata belongs to this source group, independently of bid metadata.
const industries = [{ code: "0001", name: "토목공사업" }, { code: "0036", name: "정보통신공사업" }];
const companies: CompanySearchItem[] = [
  { companyId: 7001, companyName: "가상 메이트 건설", businessNumber: "1234567890", baseAddress: "서울특별시 가상로 1", verificationStatus: "VERIFIED" },
  { companyId: 7002, companyName: "가상 메이트 정보통신", businessNumber: "2345678901", baseAddress: "부산광역시 가상로 2", verificationStatus: "UNVERIFIED" },
];
function signupProfile(number = companies[0].businessNumber, now = Date.now()): SignupCompanyProfile {
  return { businessNumber: number, companyName: "가상 메이트 기업", representativeName: "가상 대표", openingDate: "2020-01-01", baseAddress: "서울특별시 가상로 1", detailAddress: null, telephoneNumber: null, primaryIndustry: industries[0], capability: { amountKrw: 500_000_000, assessmentYear: new Date(now).getFullYear(), representativeLicenseStatus: "ACTIVE" }, certifications: {} };
}
function basicProfile(companyId = 7001, verificationStatus: CompanyBasicProfile["verificationStatus"] = "VERIFIED", number = companies[0].businessNumber): CompanyBasicProfile {
  return { companyId, companyName: companies.find(item => item.companyId === companyId)?.companyName ?? "가상 메이트 기업", businessNumber: number, representativeName: "가상 대표", verificationStatus, address: { zipCode: "00000", baseAddress: "서울특별시 가상로 1", detailAddress: null }, telephoneNumber: null, establishedYear: 2020, primaryIndustry: industries[0] };
}
type Version = { versionId: string; versionNumber: number; status: string; uploaded: boolean; polls: number; retried: boolean; uploadHandle: string; expiresAt: number; size: number; contentType: string; proposalId: string | null };
type CompanyState = { overview: CompanyOverview; connection: BusinessConnection | null; documents: Record<string, { documentId: string; activeVersion: string; versions: Record<string, Version> }>; proposals: Record<string, CompanyRegistrationProposal>; requests: Record<string, { signature: string; result: unknown }> };
const textOrNull = (value: unknown) => value === null || typeof value === "string";
const industryValid = (value: unknown) => value === null || (isRecord(value) && typeof value.code === "string" && typeof value.name === "string");
function searchItemValid(value: unknown): boolean {
  return isRecord(value) && isCount(value.companyId) && typeof value.companyName === "string" && typeof value.businessNumber === "string" && textOrNull(value.baseAddress) && ["LEGACY", "VERIFIED", "UNVERIFIED"].includes(String(value.verificationStatus));
}
function signupProfileValid(value: unknown): boolean {
  if (!isRecord(value) || typeof value.businessNumber !== "string" || !["companyName", "representativeName", "openingDate", "baseAddress", "detailAddress", "telephoneNumber"].every(key => textOrNull(value[key])) || !industryValid(value.primaryIndustry) || !isRecord(value.capability) || !isRecord(value.certifications)) return false;
  const c = value.capability;
  return (c.amountKrw === null || isCount(c.amountKrw)) && (c.assessmentYear === null || isCount(c.assessmentYear)) && typeof c.representativeLicenseStatus === "string" && Object.values(value.certifications).every(item => isRecord(item) && typeof item.status === "string");
}
function connectionValid(value: unknown): boolean {
  if (!isRecord(value) || typeof value.connectionId !== "string" || typeof value.businessNumber !== "string" || !["connectionStatus", "verificationStatus", "enrichmentStatus"].every(key => typeof value[key] === "string") || !signupProfileValid(value.companyProfile) || !isRecord(value.enrichmentRun)) return false;
  const run = value.enrichmentRun;
  return industryValid(value.primaryIndustry) && typeof run.runId === "string" && typeof run.status === "string" && isCount(run.totalSteps) && isCount(run.completedSteps) && run.completedSteps <= run.totalSteps;
}
function proposalValid(value: unknown): boolean {
  if (!isRecord(value) || !["proposalId", "documentId", "versionId", "businessNumber", "representativeName", "openingDate", "companyName", "baseAddress"].every(key => typeof value[key] === "string") || !isCount(value.revision) || !textOrNull(value.detailAddress) || !textOrNull(value.telephoneNumber) || !industryValid(value.primaryIndustry) || typeof value.primaryIndustrySelectionRequired !== "boolean" || !signupProfileValid(value.companyProfile)) return false;
  const conflict = value.conflict;
  const correction = value.businessNumberCorrection;
  return (conflict === null || (isRecord(conflict) && isCount(conflict.existingCompanyId) && typeof conflict.existingCompanyName === "string" && typeof conflict.decisionRequired === "boolean" && Array.isArray(conflict.allowedChoices) && conflict.allowedChoices.every(choice => ["REUSE_EXISTING", "CREATE_NEW_VERIFIED"].includes(String(choice))) && [null, "VERIFY_CURRENT_COMPANY", "PROPOSE_MERGE"].includes(conflict.reuseMode as null))) &&
    (correction === null || (isRecord(correction) && isCount(correction.currentCompanyId) && ["currentCompanyName", "currentBusinessNumber", "certificateBusinessNumber"].every(key => typeof correction[key] === "string") && typeof correction.decisionRequired === "boolean" && Array.isArray(correction.allowedChoices) && correction.allowedChoices.every(choice => choice === "CORRECT_CURRENT_UNVERIFIED")));
}
function requestResultValid(value: unknown): boolean {
  if (!isRecord(value)) return false;
  if ("connectionId" in value) return connectionValid(value);
  if ("documentId" in value) return typeof value.documentId === "string" && typeof value.versionId === "string" && isCount(value.versionNumber) && typeof value.uploadHandle === "string" && typeof value.status === "string" && isDate(value.sessionExpiresAt);
  if ("companyId" in value) return isCount(value.companyId) && isCount(value.membershipId) && typeof value.role === "string" && typeof value.verificationStatus === "string";
  return typeof value.status === "string";
}
function valid(value: unknown): value is CompanyState {
  if (!isRecord(value) || !isRecord(value.overview) || !isRecord(value.documents) || !isRecord(value.proposals) || !isRecord(value.requests)) return false;
  const view = value.overview;
  if (view.status === "connected") {
    const p = view.profile; if (!isRecord(p) || !isCount(p.companyId) || typeof p.companyName !== "string" || typeof p.businessNumber !== "string" || !["LEGACY", "VERIFIED", "UNVERIFIED"].includes(String(p.verificationStatus)) || !textOrNull(p.representativeName) || !textOrNull(p.telephoneNumber) || !(p.establishedYear === null || isCount(p.establishedYear)) || !industryValid(p.primaryIndustry) || !(p.address === null || (isRecord(p.address) && ["zipCode", "baseAddress", "detailAddress"].every(key => textOrNull((p.address as Record<string, unknown>)[key]))))) return false;
  } else if (["pending", "terminated", "approved-stale"].includes(String(view.status))) {
    const r = view.request; if (!isRecord(r) || !searchItemValid(r.company) || !isCount(r.requestId) || !["PENDING", "APPROVED", "REJECTED", "CANCELED"].includes(String(r.status)) || !isDate(r.createdAt) || typeof r.requestedRepresentative !== "boolean" || !["requestedPositionName", "proposedPositionName", "rejectionReason"].every(key => textOrNull(r[key]))) return false;
  } else if (view.status !== "empty") return false;
  if (value.connection !== null && !connectionValid(value.connection)) return false;
  const documents = value.documents; const proposals = value.proposals;
  return Object.entries(documents).every(([id, d]) => isRecord(d) && d.documentId === id && typeof d.activeVersion === "string" && isRecord(d.versions) && Object.hasOwn(d.versions, d.activeVersion) && Object.entries(d.versions).every(([versionId, v]) => {
    if (!isRecord(v) || v.versionId !== versionId || !["UPLOAD_PENDING", "OCR_PROCESSING", "OCR_FAILED", "COMPANY_CONFIRMATION_REQUIRED", "VERIFIED", "REPLACED"].includes(String(v.status)) || typeof v.uploaded !== "boolean" || typeof v.retried !== "boolean" || typeof v.uploadHandle !== "string" || !isCount(v.versionNumber) || !isCount(v.polls) || typeof v.expiresAt !== "number" || !Number.isFinite(v.expiresAt) || !isCount(v.size) || typeof v.contentType !== "string" || !textOrNull(v.proposalId)) return false;
    const proposal = typeof v.proposalId === "string" ? proposals[v.proposalId] : null;
    return v.proposalId === null || (isRecord(proposal) && proposal.documentId === id && proposal.versionId === versionId);
  })) && Object.entries(proposals).every(([id, p]) => {
    if (!isRecord(p) || p.proposalId !== id || !proposalValid(p) || typeof p.documentId !== "string" || typeof p.versionId !== "string") return false;
    const doc = documents[p.documentId];
    return isRecord(doc) && isRecord(doc.versions) && Object.hasOwn(doc.versions, p.versionId);
  }) && Object.values(value.requests).every(r => isRecord(r) && typeof r.signature === "string" && requestResultValid(r.result));
}
type PendingInvitation = { context: InvitationContext; accountKey: string | null; status: "pending" | "accepted" | "declined" };
function validInvitation(value: unknown): value is PendingInvitation | null {
  if (value === null) return true;
  if (!isRecord(value) || !isRecord(value.context)) return false;
  const c = value.context;
  return isCount(c.invitationId) && isCount(c.companyId) && ["companyName", "companyBusinessNumber", "inviteeDisplayName"].every(key => typeof c[key] === "string") && typeof c.representative === "boolean" && (c.position === null || (isRecord(c.position) && isCount(c.position.positionId) && typeof c.position.name === "string")) && ["ADMIN", "AGENT", "VIEWER"].includes(String(c.role)) && (c.emailMatched === null || typeof c.emailMatched === "boolean") && typeof c.canAccept === "boolean" && isCount(c.version) && isDate(c.expiresAt) && (value.accountKey === null || typeof value.accountKey === "string") && ["pending", "accepted", "declined"].includes(String(value.status));
}
function fingerprint(value: unknown) { let hash = 2166136261; for (const char of JSON.stringify(value)) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619); return String(hash >>> 0); }

export function createMockCompanyRepository(runtime: MockRuntime): CompanyRepository {
  function initial(): CompanyState {
    let overview: CompanyOverview = { status: "empty" }; const scenario = runtime.scenario("company");
    if (scenario === "connected") overview = { status: "connected", profile: basicProfile() };
    if (["pending", "rejected", "canceled", "approved-stale"].includes(scenario)) {
      const request: MyMembershipRequest = { requestId: 8001, company: companies[0], requestedRepresentative: false, requestedPositionName: "담당자", proposedPositionName: null, status: scenario === "pending" ? "PENDING" : scenario === "rejected" ? "REJECTED" : scenario === "canceled" ? "CANCELED" : "APPROVED", rejectionReason: scenario === "rejected" ? "가상 거절 사유" : null, createdAt: new Date(runtime.now()).toISOString() };
      overview = { status: scenario === "pending" ? "pending" : scenario === "approved-stale" ? "approved-stale" : "terminated", request };
    }
    return { overview, connection: null, documents: {}, proposals: {}, requests: {} };
  }
  const read = (account: string) => runtime.store.read<CompanyState>(account, "company", initial, valid);
  const write = (account: string, state: CompanyState) => runtime.store.write(account, "company", state);
  function idempotent<T>(state: CompanyState, key: string, payload: unknown, create: () => T): T {
    const signature = fingerprint(payload); const previous = state.requests[key];
    if (previous) { if (signature !== previous.signature) throw new ApiError(409, "IDEMPOTENCY_CONFLICT", "같은 요청 키의 내용이 변경됐습니다."); return previous.result as T; }
    const result = create(); state.requests[key] = { signature, result }; return result;
  }
  const invite = () => runtime.store.read<PendingInvitation | null>("anonymous", "company-invitation", () => null, validInvitation);
  function checkedInvitation(account: string, version?: number) {
    const pending = invite();
    if (!pending || pending.status !== "pending") throw new ApiError(404, "INVITATION_NOT_FOUND", "유효한 가상 초대가 없습니다.");
    if (Date.parse(pending.context.expiresAt) <= runtime.now()) throw new ApiError(410, "INVITATION_EXPIRED", "초대가 만료됐습니다.");
    if (version !== undefined && version !== pending.context.version) throw new ApiError(409, "VERSION_CONFLICT", "초대 상태가 변경됐습니다. 다시 확인해 주세요.");
    pending.accountKey ??= account;
    pending.context.emailMatched = pending.accountKey === account; pending.context.canAccept = pending.context.emailMatched;
    runtime.store.write("anonymous", "company-invitation", pending); return pending;
  }
  function document(state: CompanyState, documentId: string, versionId?: string) {
    const doc = state.documents[documentId]; const version = doc?.versions[versionId ?? doc.activeVersion];
    if (!doc || !version) throw new ApiError(404, "DOCUMENT_NOT_FOUND", "증명서를 찾지 못했습니다.");
    if (doc.activeVersion !== version.versionId) throw new ApiError(409, "VERSION_CONFLICT", "새 증명서 버전이 있습니다. 다시 확인해 주세요.");
    return { doc, version };
  }
  function uploadResult(documentId: string, version: Version): DocumentUpload {
    return { documentId, versionId: version.versionId, versionNumber: version.versionNumber, status: version.status, uploadHandle: version.uploadHandle, sessionExpiresAt: new Date(version.expiresAt).toISOString() };
  }
  async function createUpload(access: AuthAccess, file: File, key: string, documentId?: string, replacesVersionId?: string) {
    const account = await mockAccount(runtime, access, "company"); const state = read(account);
    const result = idempotent(state, key, { operation: "upload", documentId, replacesVersionId, size: file.size, type: file.type, modified: file.lastModified }, () => {
      if (file.size < 1 || file.size > 10 * 1024 * 1024 || !["application/pdf", "image/jpeg", "image/png"].includes(file.type)) throw new ApiError(400, "FILE_INVALID", "업로드 파일 형식과 크기를 확인해 주세요.");
      const id = documentId ?? crypto.randomUUID(); const previous = documentId ? document(state, documentId, replacesVersionId).version : null;
      if (previous) previous.status = "REPLACED";
      const version: Version = { versionId: crypto.randomUUID(), versionNumber: (previous?.versionNumber ?? 0) + 1, status: "UPLOAD_PENDING", uploaded: false, polls: 0, retried: false, uploadHandle: crypto.randomUUID(), expiresAt: runtime.now() + 30 * 60_000, size: file.size, contentType: file.type, proposalId: null };
      const doc = state.documents[id] ?? { documentId: id, activeVersion: version.versionId, versions: {} }; doc.activeVersion = version.versionId; doc.versions[version.versionId] = version; state.documents[id] = doc;
      return uploadResult(id, version);
    }); write(account, state); return result;
  }
  function register(state: CompanyState, verified: boolean, businessNumber: string): RegistrationResult {
    const profile = basicProfile(7101, verified ? "VERIFIED" : "UNVERIFIED", businessNumber); state.overview = { status: "connected", profile };
    return { companyId: profile.companyId, membershipId: 9101, role: "ADMIN", verificationStatus: profile.verificationStatus };
  }
  return {
    async searchCompanies(access, query, page = 0) {
      await mockAccount(runtime, access, "company"); const filtered = companies.filter(item => item.companyName.includes(query) || item.businessNumber.includes(query));
      return { content: structuredClone(filtered.slice(page * 10, (page + 1) * 10)), page, size: 10, totalElements: filtered.length, totalPages: Math.ceil(filtered.length / 10) };
    },
    async getMembershipContext(access, companyId) {
      const account = await mockAccount(runtime, access, "company"); const company = companies.find(item => item.companyId === companyId);
      if (!company) throw new ApiError(404, "COMPANY_NOT_FOUND", "회사를 찾지 못했습니다.");
      const overview = read(account).overview;
      return { accountName: "가상 사용자", googleVerifiedEmail: `demo${account}@example.test`, company: structuredClone(company), positions: [{ positionId: 1, name: "담당자" }], availability: overview.status === "connected" ? "ACTIVE_MEMBERSHIP_EXISTS" : overview.status === "pending" ? "PENDING_REQUEST_EXISTS" : "AVAILABLE" };
    },
    async requestMembership(access, body) {
      const account = await mockAccount(runtime, access, "company"); const state = read(account); const company = companies.find(item => item.companyId === body.companyId);
      if (!company) throw new ApiError(404, "COMPANY_NOT_FOUND", "회사를 찾지 못했습니다.");
      if (state.overview.status === "connected" || state.overview.status === "pending") throw new ApiError(409, "MEMBERSHIP_EXISTS", "이미 연결되었거나 신청 대기 중입니다.");
      const request: MyMembershipRequest = { requestId: 8001, company: structuredClone(company), requestedRepresentative: body.representative, requestedPositionName: body.positionId ? "담당자" : null, proposedPositionName: body.proposedPositionName, status: "PENDING", rejectionReason: null, createdAt: new Date(runtime.now()).toISOString() };
      state.overview = { status: "pending", request }; write(account, state); return { requestId: request.requestId, status: request.status, company: request.company };
    },
    async previewInvitation(token) {
      await mockOperation(runtime, "company");
      if (!["mock-invite", "mock-invite-account-2"].includes(token)) throw new ApiError(400, "INVITATION_INVALID", "가상 초대 링크를 확인해 주세요.");
      const expired = runtime.scenario("company") === "invite-expired";
      const context: InvitationContext = { invitationId: 8101, companyId: 7001, companyName: companies[0].companyName, companyBusinessNumber: companies[0].businessNumber, inviteeDisplayName: "가상 초대 사용자", representative: false, position: { positionId: 1, name: "담당자" }, role: "AGENT", version: 1, expiresAt: new Date(runtime.now() + (expired ? -1 : 24 * 3600_000)).toISOString(), emailMatched: null, canAccept: false };
      runtime.store.write("anonymous", "company-invitation", { context, accountKey: token.endsWith("account-2") || runtime.scenario("company") === "invite-mismatch" ? "2" : null, status: "pending" });
      if (expired) throw new ApiError(410, "INVITATION_EXPIRED", "초대가 만료됐습니다."); return context;
    },
    async resumeInvitation(access) { const account = await mockAccount(runtime, access, "company"); return checkedInvitation(account).context; },
    async acceptInvitation(access, expectedVersion) {
      const account = await mockAccount(runtime, access, "company"); const pending = checkedInvitation(account, expectedVersion);
      if (!pending.context.emailMatched) throw new ApiError(403, "INVITATION_ACCOUNT_MISMATCH", "초대 받은 가상 계정으로 로그인해 주세요.");
      const state = read(account); state.overview = { status: "connected", profile: basicProfile(pending.context.companyId) }; write(account, state);
      pending.status = "accepted"; pending.context.version += 1; runtime.store.write("anonymous", "company-invitation", pending);
      return { companyId: pending.context.companyId, membershipId: 9101 };
    },
    async declineInvitation(access, expectedVersion) {
      const account = await mockAccount(runtime, access, "company"); const pending = checkedInvitation(account, expectedVersion);
      if (!pending.context.emailMatched) throw new ApiError(403, "INVITATION_ACCOUNT_MISMATCH", "초대 받은 가상 계정으로 로그인해 주세요.");
      pending.status = "declined"; pending.context.version += 1; pending.context.canAccept = false; runtime.store.write("anonymous", "company-invitation", pending); return pending.context;
    },
    async createBusinessConnection(access, number, key) {
      const account = await mockAccount(runtime, access, "company"); const state = read(account);
      const connection = idempotent(state, key, { operation: "connection", number }, () => {
        if (!/^\d{10}$/.test(number)) throw new ApiError(400, "BUSINESS_NUMBER_INVALID", "사업자번호 10자리를 확인해 주세요.");
        return { connectionId: crypto.randomUUID(), businessNumber: number, connectionStatus: "ACTIVE", verificationStatus: "UNVERIFIED", enrichmentStatus: "PROCESSING", primaryIndustry: { industryId: 1, ...industries[0] }, companyProfile: signupProfile(number, runtime.now()), enrichmentRun: { runId: crypto.randomUUID(), status: "PROCESSING", totalSteps: 3, completedSteps: 0 } };
      }); state.connection = connection; write(account, state); return connection;
    },
    async getBusinessConnection(access) {
      const account = await mockAccount(runtime, access, "company"); const state = read(account); const connection = state.connection;
      if (!connection) throw new ApiError(404, "BUSINESS_CONNECTION_NOT_FOUND", "연결된 사업자번호가 없습니다.");
      connection.enrichmentRun.completedSteps = Math.min(3, connection.enrichmentRun.completedSteps + 1);
      if (connection.enrichmentRun.completedSteps === 3) { connection.enrichmentRun.status = "COMPLETED"; connection.enrichmentStatus = "COMPLETED"; }
      write(account, state); return connection;
    },
    async clearBusinessConnection(access) { const account = await mockAccount(runtime, access, "company"); const state = read(account); state.connection = null; write(account, state); },
    async createUnverifiedCompany(access, body, key) {
      const account = await mockAccount(runtime, access, "company"); const state = read(account);
      const result = idempotent(state, key, { operation: "register-business", ...body }, () => {
        if (!state.connection || state.connection.connectionId !== body.connectionId || state.connection.enrichmentRun.status !== "COMPLETED") throw new ApiError(409, "CONNECTION_INVALID", "사업자번호 조회를 완료해 주세요.");
        return register(state, false, state.connection.businessNumber);
      }); write(account, state); return result;
    },
    createDocumentUpload: (access, file, key) => createUpload(access, file, key),
    createDocumentVersion: (access, documentId, versionId, file, key) => createUpload(access, file, key, documentId, versionId),
    async uploadDocumentFile(access, uploadHandle, file) {
      const account = await mockAccount(runtime, access, "company"); const state = read(account);
      const doc = Object.values(state.documents).find(doc => doc.versions[doc.activeVersion].uploadHandle === uploadHandle); const version = doc?.versions[doc.activeVersion];
      if (!version) throw new ApiError(400, "UPLOAD_HANDLE_INVALID", "업로드 세션을 다시 시작해 주세요.");
      if (version.expiresAt <= runtime.now()) throw new ApiError(410, "UPLOAD_EXPIRED", "업로드 세션이 만료됐습니다.");
      if (version.size !== file.size || version.contentType !== file.type) throw new ApiError(400, "FILE_MISMATCH", "업로드 파일이 변경됐습니다.");
      version.uploaded = true; write(account, state);
    },
    async completeDocumentUpload(access, documentId, versionId) {
      const account = await mockAccount(runtime, access, "company"); const state = read(account); const { version } = document(state, documentId, versionId);
      if (!version.uploaded) throw new ApiError(409, "UPLOAD_INCOMPLETE", "파일 업로드를 먼저 완료해 주세요.");
      if (version.status === "UPLOAD_PENDING") version.status = "OCR_PROCESSING"; write(account, state); return { status: version.status };
    },
    async getDocumentProcessing(access, documentId) {
      const account = await mockAccount(runtime, access, "company"); const state = read(account); const { version } = document(state, documentId);
      if (version.status === "OCR_PROCESSING") {
        version.polls += 1;
        if (version.polls >= 2) {
          if (runtime.scenario("company") === "processing-failed" && !version.retried) version.status = "OCR_FAILED";
          else {
            version.status = "COMPANY_CONFIRMATION_REQUIRED"; version.proposalId = crypto.randomUUID(); const profile = signupProfile(undefined, runtime.now());
            state.proposals[version.proposalId] = { proposalId: version.proposalId, revision: 1, documentId, versionId: version.versionId, businessNumber: profile.businessNumber, representativeName: profile.representativeName!, openingDate: profile.openingDate!, companyName: profile.companyName!, baseAddress: profile.baseAddress!, detailAddress: null, telephoneNumber: null, primaryIndustry: profile.primaryIndustry, primaryIndustrySelectionRequired: false, companyProfile: profile,
              conflict: runtime.scenario("company") === "conflict" ? { existingCompanyId: 7001, existingCompanyName: companies[0].companyName, decisionRequired: true, allowedChoices: ["REUSE_EXISTING", "CREATE_NEW_VERIFIED"], reuseMode: "PROPOSE_MERGE" } : null, businessNumberCorrection: null };
          }
        }
      }
      write(account, state); return { documentId, versionId: version.versionId, status: version.status, failureCode: version.status === "OCR_FAILED" ? "MOCK_OCR_FAILED" : null, canRetry: version.status === "OCR_FAILED", proposalId: version.proposalId, extractedFields: version.proposalId ? { businessNumber: "1234567890", companyName: "가상 메이트 기업", representativeName: "가상 대표", openingDate: "2020-01-01", businessAddress: "서울특별시 가상로 1" } : null };
    },
    async retryDocumentProcessing(access, documentId, versionId, kind, key) {
      const account = await mockAccount(runtime, access, "company"); const state = read(account);
      const result = idempotent(state, key, { operation: "retry", documentId, versionId, kind }, () => {
        const { version } = document(state, documentId, versionId); if (!version.status.endsWith("FAILED")) throw new ApiError(409, "RETRY_UNAVAILABLE", "현재 처리 상태는 재시도할 수 없습니다.");
        version.retried = true; version.polls = 0; version.status = "OCR_PROCESSING"; return { status: version.status };
      }); write(account, state); return result;
    },
    async getRegistrationProposal(access, id) {
      const account = await mockAccount(runtime, access, "company"); const state = read(account); const proposal = state.proposals[id];
      if (!proposal) throw new ApiError(404, "PROPOSAL_NOT_FOUND", "회사 등록 제안을 찾지 못했습니다."); document(state, proposal.documentId, proposal.versionId); return proposal;
    },
    async getIndustries(keyword) { await mockOperation(runtime, "company"); return structuredClone(industries.filter(item => item.name.includes(keyword) || item.code.includes(keyword))); },
    async createVerifiedCompany(access, body, key) {
      const account = await mockAccount(runtime, access, "company"); const state = read(account);
      const result = idempotent(state, key, { operation: "register-document", ...body }, () => {
        const proposal = state.proposals[body.proposalId]; const { version } = document(state, body.documentId, body.versionId);
        if (!proposal || proposal.documentId !== body.documentId || proposal.versionId !== body.versionId || proposal.revision !== body.revision || version.status !== "COMPANY_CONFIRMATION_REQUIRED") throw new ApiError(409, "VERSION_CONFLICT", "회사 등록 정보가 변경됐습니다.");
        if (!industries.some(item => item.code === body.primaryIndustryCode) || (proposal.conflict?.decisionRequired && !body.conflictChoice)) throw new ApiError(400, "REGISTRATION_INVALID", "업종과 기존 회사 처리 방법을 확인해 주세요.");
        version.status = "VERIFIED"; proposal.revision += 1;
        const result = register(state, true, proposal.businessNumber);
        if (state.overview.status === "connected") { state.overview.profile.primaryIndustry = industries.find(item => item.code === body.primaryIndustryCode)!; state.overview.profile.telephoneNumber = body.telephoneNumber; }
        return body.conflictChoice === "REUSE_EXISTING" ? { ...result, conflict: { caseId: 1, type: "MERGE", status: "PENDING" } } : result;
      }); write(account, state); return result;
    },
    async getMyCompanyOverview(access, signal) {
      const account = await mockAccount(runtime, access, "company", signal);
      if (runtime.scenario("company") === "denied") throw new ApiError(403, "COMPANY_FORBIDDEN", "회사 정보를 볼 권한이 없습니다.");
      return read(account).overview;
    },
  };
}

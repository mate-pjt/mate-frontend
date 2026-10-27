/* eslint-disable @typescript-eslint/no-unused-vars -- playwright-cli --filename invokes this entry function. */
// Synthetic HTTP interception only. Never connect this helper to real account data.
async function installBrowserWire(page) {
  const profile = {
    businessNumber: "1234567890", companyName: "HTTP 대역 회사", representativeName: "가상 대표", openingDate: "2020-01-01",
    baseAddress: "서울특별시 가상로 1", detailAddress: null, telephoneNumber: null, primaryIndustry: { code: "0001", name: "토목공사업" },
    capability: { amountKrw: 500000000, assessmentYear: 2030, representativeLicenseStatus: "ACTIVE" }, certifications: {},
  };
  const emptyFilter = () => ({ bidTypes: [], regionCodes: [], industryCodes: [], contractMethods: [], dateType: null, dateFrom: null, dateTo: null, amountType: null, amountMin: null, amountMax: null, regionOnly: false, jointContract: "ALL" });
  const state = {
    loggedIn: false, accountId: 901, refreshFailure: 0, requests: [], uploads: 0,
    connection: null, registered: false, enabled: false,
    email: { signupEmail: "http-account@example.test", alternateEmail: null, recipientType: "SIGNUP_EMAIL", recipientEmail: "http-account@example.test" },
    filter: { source: "EMPTY_DEFAULT", version: null, canImportCompany: false, filter: emptyFilter() }, alerts: {},
  };
  const documentId = "00000000-0000-4000-8000-000000000001";
  const versionId = "00000000-0000-4000-8000-000000000002";
  const proposalId = "00000000-0000-4000-8000-000000000003";
  const auth = () => ({ accessToken: "synthetic-wire-token", tokenType: "Bearer", expiresInSeconds: 3600, account: { id: state.accountId, email: state.email.signupEmail }, companyContext: null, companyOnboarding: { status: "NOT_STARTED", availableActions: ["START_NOW"] } });
  const proposal = { proposalId, revision: 1, documentId, versionId, businessNumber: profile.businessNumber, representativeName: profile.representativeName, openingDate: profile.openingDate, companyName: profile.companyName, baseAddress: profile.baseAddress, detailAddress: null, telephoneNumber: null, primaryIndustry: profile.primaryIndustry, primaryIndustrySelectionRequired: false, companyProfile: profile, conflict: null, businessNumberCorrection: null };
  page.__mateQaWire = state;
  await page.context().route("**/api/v1/**", async route => {
    const request = route.request(); const url = new URL(request.url()); const path = url.pathname; const method = request.method();
    const headers = { "Access-Control-Allow-Origin": "http://localhost:3820", "Access-Control-Allow-Credentials": "true", "Access-Control-Allow-Headers": "Authorization, Content-Type, Idempotency-Key", "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS" };
    if (method === "OPTIONS") { await route.fulfill({ status: 204, headers }); return; }
    state.requests.push({ path, method });
    const body = request.postDataJSON() ?? {};
    const send = (data, status = 200, code = null) => route.fulfill({ status, headers, contentType: "application/json", body: JSON.stringify({ isSuccess: status < 400, data, code }) });
    if (path.endsWith("/auth/oauth/google/authorizations")) {
      const params = new URLSearchParams({ flowId: "synthetic-flow", returnTo: url.searchParams.get("returnTo") || "/" });
      await route.fulfill({ status: 302, headers: { ...headers, location: `http://localhost:3820/auth/callback?${params}` } }); return;
    }
    if (path.endsWith("/session-completions")) { state.loggedIn = true; state.refreshFailure = 0; await send(auth()); return; }
    if (path.endsWith("/auth/token/refresh")) { await send(state.loggedIn && !state.refreshFailure ? auth() : null, state.refreshFailure || (state.loggedIn ? 200 : 401), "SESSION_INVALID"); return; }
    if (path.endsWith("/auth/logout")) { state.loggedIn = false; await send(null); return; }
    if (path.endsWith("/notifications/unread-count")) { await send({ unreadCount: 0 }); return; }
    if (path.endsWith("/notifications")) { await send({ content: [], page: 0, size: 20, totalElements: 0, totalPages: 0, unreadCount: 0 }); return; }
    if (path.includes("/bid-notice-alerts/")) {
      const id = path.split("/").at(-1); const value = state.alerts[id] ?? { bidNoticeId: Number(id), active: false, registeredAt: null };
      if (method !== "GET") { value.active = method === "PUT"; value.registeredAt = value.active ? new Date().toISOString() : null; state.alerts[id] = value; }
      await send(value); return;
    }
    if (path.includes("/bid-notice-filters/current")) {
      if (method !== "GET") state.filter = { ...state.filter, version: (state.filter.version ?? 0) + 1, source: path.endsWith("reset") ? "EMPTY_DEFAULT" : "SAVED", filter: path.endsWith("reset") ? emptyFilter() : body.filter };
      await send(state.filter); return;
    }
    if (path.endsWith("/notification-email-settings")) {
      if (method === "PATCH") state.email = { ...state.email, recipientType: body.recipientType, recipientEmail: body.recipientType === "SIGNUP_EMAIL" ? state.email.signupEmail : state.email.alternateEmail };
      await send(state.email); return;
    }
    if (path.endsWith("/matched-bid-notice-email-settings")) { if (method === "PATCH") state.enabled = body.enabled; await send({ enabled: state.enabled }); return; }
    if (path === "/api/v1/account-business-connections" && method === "POST") {
      state.connection = { connectionId: "synthetic-connection", businessNumber: body.businessNumber, connectionStatus: "ACTIVE", verificationStatus: "UNVERIFIED", enrichmentStatus: "COMPLETED", primaryIndustry: { industryId: 1, ...profile.primaryIndustry }, companyProfile: profile, enrichmentRun: { runId: "synthetic-run", status: "COMPLETED", totalSteps: 3, completedSteps: 3 } };
      await send(state.connection); return;
    }
    if (path.endsWith("/account-business-connections/current")) { await send(state.connection, state.connection ? 200 : 404, "NOT_FOUND"); return; }
    if (path === "/api/v1/unverified-company-registrations" || path === "/api/v1/company-registrations") {
      state.registered = true; state.refreshFailure = 401;
      await send({ companyId: 7001, membershipId: 9001, role: "ADMIN", verificationStatus: path.includes("unverified") ? "UNVERIFIED" : "VERIFIED" }); return;
    }
    if (path === "/api/v1/company-documents" && method === "POST") {
      await send({ documentId, versionId, versionNumber: 1, status: "UPLOAD_PENDING", sessionExpiresAt: new Date(Date.now() + 1800000).toISOString(), upload: { method: "PUT", url: "https://synthetic-storage.test/upload", headers: { "x-synthetic-signature": "fixture" }, expiresAt: new Date(Date.now() + 1800000).toISOString() } }); return;
    }
    if (path.endsWith("upload-completions")) { await send({ status: "OCR_PROCESSING" }); return; }
    if (path === `/api/v1/company-documents/${documentId}`) { await send({ documentId, versionId, status: "COMPANY_CONFIRMATION_REQUIRED", failureCode: null, canRetry: false, proposalId, extractedFields: null }); return; }
    if (path === `/api/v1/company-registration-proposals/${proposalId}`) { await send(proposal); return; }
    if (path === "/api/v1/industries") { await send({ items: [profile.primaryIndustry] }); return; }
    if (path === "/api/v1/company-membership-requests/me") { await send(null, 404, "CR001"); return; }
    await send(null, 500, "QA_UNEXPECTED_ENDPOINT");
  });
  await page.context().route("https://synthetic-storage.test/upload", async route => { state.uploads += 1; await route.fulfill({ status: 200, headers: { "Access-Control-Allow-Origin": "http://localhost:3820" } }); });
}

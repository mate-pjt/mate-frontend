export type CompanyFlow = Readonly<{ fromSettings: boolean; query: string; page: number }>;
export type CompanyFlowSearchParams = Record<string, string | string[] | undefined>;

export function readCompanyFlow(params: CompanyFlowSearchParams = {}): CompanyFlow {
  const query = typeof params.query === "string" && params.query.length <= 100 && !/[\u0000-\u001f\u007f]/.test(params.query)
    ? params.query.trim() : "";
  const page = typeof params.page === "string" && /^(0|[1-9]\d*)$/.test(params.page) ? Number(params.page) : 0;
  return {
    fromSettings: params.from === "settings",
    query,
    page: query && Number.isSafeInteger(page) && page <= 2_147_483_647 ? page : 0,
  };
}

export function companyFlowHref(step: "register" | "business-number" | "document" | "search" | "request", flow: CompanyFlow, companyId?: number): string {
  const paths = {
    register: "/auth/company/register",
    "business-number": "/auth/company/register/business-number",
    document: "/auth/company/register/document",
    search: "/auth/company/search",
    request: "/auth/company/search",
  };
  if (step === "request" && (!Number.isSafeInteger(companyId) || companyId! <= 0)) return companyFlowHref("search", flow);
  const path = step === "request" ? `${paths.request}/${companyId}` : paths[step];
  const params = new URLSearchParams();
  if (flow.fromSettings) params.set("from", "settings");
  if ((step === "search" || step === "request") && flow.query) {
    params.set("query", flow.query);
    if (flow.page) params.set("page", String(flow.page));
  }
  return `${path}${params.size ? `?${params}` : ""}`;
}

export const companyFlowBack = (flow: CompanyFlow) => flow.fromSettings ? "/my/company/start" : "/auth/start";
export const companyFlowCompletion = (flow: Pick<CompanyFlow, "fromSettings">) => flow.fromSettings ? "/my/company" : "/bids";

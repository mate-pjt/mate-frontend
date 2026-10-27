export const dataGroups = ["auth", "bids", "company", "notifications", "bidAlerts", "personalFilters", "notificationSettings"] as const;
export type DataGroup = typeof dataGroups[number];
export type DataSource = "api" | "mock";
export type AppEnvironment = "local" | "preview" | "production";
export const mockScenarios = {
  auth: ["default", "slow", "signup", "expired", "invalid-flow"],
  bids: ["default", "slow", "empty", "error", "partial-error", "attachments-error", "related-error", "results-error", "purchases-error", "participants-error"],
  company: ["default", "slow", "connected", "pending", "rejected", "canceled", "approved-stale", "denied", "invite-mismatch", "invite-expired", "processing-failed", "conflict", "error"],
  notifications: ["default", "slow", "empty", "error"],
  bidAlerts: ["default", "slow", "error"],
  personalFilters: ["default", "slow", "conflict", "error"],
  notificationSettings: ["default", "slow", "expired", "blocked", "error"],
} as const;

export type DataConfig = {
  profile: "api" | "mock" | "hybrid";
  sources: Record<DataGroup, DataSource>;
  scenarios: Record<DataGroup, string>;
  apiEnvironment: string;
  buildEnvironment: AppEnvironment;
  fingerprint: string;
};
type Environment = Record<string, string | undefined>;

export function appEnvironment(env: Environment, development = false): AppEnvironment {
  if (env.VERCEL_ENV !== undefined) {
    if (env.VERCEL_ENV === "development") return "local";
    if (env.VERCEL_ENV === "preview" || env.VERCEL_ENV === "production") return env.VERCEL_ENV;
    throw new Error("VERCEL_ENV 설정이 올바르지 않습니다.");
  }
  if (env.MATE_APP_ENV !== undefined) {
    if (["local", "preview", "production"].includes(env.MATE_APP_ENV)) return env.MATE_APP_ENV as AppEnvironment;
    throw new Error("MATE_APP_ENV은 local, preview, production 중 하나여야 합니다.");
  }
  return development ? "local" : "production";
}

function objectSetting(value: string | undefined, name: string): Record<string, unknown> {
  if (!value) return {};
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") throw new Error();
    return parsed as Record<string, unknown>;
  } catch {
    throw new Error(`${name}은 JSON 객체여야 합니다.`);
  }
}

export function resolveDataConfig(env: Environment, development = false): DataConfig {
  const profile = env.MATE_DATA_PROFILE ?? "api";
  if (profile !== "api" && profile !== "mock" && profile !== "hybrid") throw new Error("MATE_DATA_PROFILE 설정이 올바르지 않습니다.");
  const sources = Object.fromEntries(dataGroups.map((key) => [key, profile === "mock" ? "mock" : "api"])) as DataConfig["sources"];
  const overrides = objectSetting(env.MATE_DATA_OVERRIDES, "MATE_DATA_OVERRIDES");
  if (Object.keys(overrides).length && profile !== "hybrid") throw new Error("공급원 overrides는 hybrid 프로필에서만 사용할 수 있습니다.");
  for (const [key, source] of Object.entries(overrides)) {
    if (!dataGroups.includes(key as DataGroup) || (source !== "api" && source !== "mock")) throw new Error("알 수 없는 공급원 그룹 또는 공급원입니다.");
    sources[key as DataGroup] = source;
  }
  const scenarios = Object.fromEntries(dataGroups.map((key) => [key, "default"])) as DataConfig["scenarios"];
  for (const [key, scenario] of Object.entries(objectSetting(env.MATE_MOCK_SCENARIOS, "MATE_MOCK_SCENARIOS"))) {
    if (!dataGroups.includes(key as DataGroup) || typeof scenario !== "string" || !(mockScenarios[key as DataGroup] as readonly string[]).includes(scenario)) throw new Error("알 수 없는 mock 그룹 또는 시나리오입니다.");
    if (sources[key as DataGroup] !== "mock") throw new Error("mock 시나리오는 mock 공급원에서만 사용할 수 있습니다.");
    scenarios[key as DataGroup] = scenario;
  }
  for (const key of dataGroups.filter((key) => key !== "auth" && key !== "bids")) {
    if (sources[key] === "api" && sources.auth !== "api") throw new Error(`${key}=api는 auth=api가 필요합니다.`);
  }
  for (const key of ["bidAlerts", "personalFilters"] as const) {
    if (sources[key] === "api" && sources.bids !== "api") throw new Error(`${key}=api는 bids=api가 필요합니다.`);
  }
  const buildEnvironment = appEnvironment(env, development);
  const apiEnvironment = (env.NEXT_PUBLIC_MATE_API_BASE_URL || "https://api-test.mate-bid.com").replace(/\/+$/, "");
  const url = new URL(apiEnvironment);
  if (!/^https?:$/.test(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error("API 주소에는 HTTP origin/path만 사용할 수 있습니다.");
  const base: Omit<DataConfig, "fingerprint"> = { profile, sources, scenarios, apiEnvironment, buildEnvironment };
  let hash = 2166136261;
  for (const character of JSON.stringify(base)) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  const config = { ...base, fingerprint: (hash >>> 0).toString(16) };
  assertDeployment(config, env, development);
  return config;
}

export function assertDeployment(config: DataConfig, env: Environment, development = false): void {
  if (appEnvironment(env, development) === "production" && dataGroups.some((group) => config.sources[group] === "mock")) {
    throw new Error("운영 환경에서는 mock Repository를 빌드하거나 실행할 수 없습니다.");
  }
}

// Next config injects this same immutable snapshot into server and browser bundles.
export function getDataConfig(): DataConfig {
  const snapshot = process.env.NEXT_PUBLIC_MATE_DATA_CONFIG;
  if (!snapshot) throw new Error("빌드 데이터 설정이 없습니다. Next.js 서버를 다시 시작하거나 재빌드해 주세요.");
  return JSON.parse(snapshot) as DataConfig;
}

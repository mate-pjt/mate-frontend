import { resolveDataConfig, type DataConfig } from "@/data/config";
import { MockStore, memoryStorage, type StoragePort } from "@/data/mock/store";
import type { MockRuntime } from "@/data/mock/runtime";
import type { Authentication } from "@/data/auth/contracts";
import type { AuthAccess } from "@/data/shared/http";
export const testNow = Date.parse("2030-06-01T01:00:00Z");
export const authentication = (id = 1): Authentication => ({ accessToken: "synthetic-token", tokenType: "Bearer", expiresInSeconds: 3600, account: { id, email: `demo${id}@example.test` }, companyContext: null, companyOnboarding: { status: "NOT_STARTED", availableActions: ["START_NOW"] } });
export const access: AuthAccess = { getAccountKey: () => "1", getAccessToken: async () => "synthetic-token", refresh: async () => authentication() };
export function mockRuntime(storage: StoragePort = memoryStorage(), scenarios: Record<string, string> = {}, clock = () => testNow): MockRuntime {
  const config: DataConfig = resolveDataConfig({ MATE_APP_ENV: "local", MATE_DATA_PROFILE: "mock", MATE_MOCK_SCENARIOS: JSON.stringify(scenarios) });
  return { store: new MockStore(config, () => storage), now: clock, authSource: config.sources.auth, scenario: (group) => config.scenarios[group], account: (port) => { const account = port.getAccountKey(); if (!account) throw new Error("anonymous"); return account; } };
}
export function ok(data: unknown, status = 200) { return new Response(JSON.stringify({ isSuccess: status < 400, data, code: status === 409 ? "VERSION_CONFLICT" : null }), { status }); }

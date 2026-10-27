import { getDataConfig, type DataGroup, type DataSource } from "../config";
import { ApiError } from "../shared/errors";
import type { AuthAccess } from "../shared/http";
import { MockStore } from "./store";

export type MockRuntime = {
  store: MockStore;
  now: () => number;
  authSource: DataSource;
  scenario: (group: DataGroup) => string;
  account: (access: AuthAccess) => string;
};
let runtime: MockRuntime | null = null;
export function getMockRuntime(): MockRuntime {
  if (typeof window === "undefined") throw new Error("가변 mock Repository는 브라우저에서만 사용할 수 있습니다.");
  if (!runtime) {
    const config = getDataConfig();
    runtime = { store: new MockStore(config, () => window.sessionStorage, () => window.dispatchEvent(new Event("mate:mock-storage-changed"))),
      now: Date.now, authSource: config.sources.auth, scenario: (group) => config.scenarios[group],
      account: (access) => {
        const key = access.getAccountKey();
        if (!key) throw new ApiError(401, "SESSION_INVALID", "로그인이 필요합니다.");
        return key;
      } };
  }
  return runtime;
}
export async function mockOperation(runtime: MockRuntime, group: DataGroup, signal?: AbortSignal) {
  signal?.throwIfAborted();
  if (runtime.scenario(group) === "error") throw new ApiError(503, "MOCK_ERROR", "개발 시나리오: 요청을 완료하지 못했습니다.");
  if (runtime.scenario(group) === "slow") {
    await new Promise<void>((resolve, reject) => {
      const abort = () => { clearTimeout(timer); reject(signal?.reason ?? new DOMException("aborted", "AbortError")); };
      const timer = setTimeout(() => { signal?.removeEventListener("abort", abort); resolve(); }, 250);
      signal?.addEventListener("abort", abort, { once: true });
    });
  } else await Promise.resolve();
  signal?.throwIfAborted();
}

export async function mockAccount(runtime: MockRuntime, access: AuthAccess, group: DataGroup, signal?: AbortSignal) {
  const account = runtime.account(access);
  // Only virtual auth checks its local expiry; hybrid mocks never request real tokens.
  if (runtime.authSource === "mock") await access.getAccessToken();
  await mockOperation(runtime, group, signal);
  if (account !== runtime.account(access)) throw new ApiError(401, "ACCOUNT_CHANGED", "로그인 계정이 변경됐습니다. 다시 시도해 주세요.");
  return account;
}

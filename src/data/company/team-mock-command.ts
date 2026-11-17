import type { MockRuntime } from "../mock/runtime";
import { ApiError } from "../shared/errors";
import type { AuthAccess } from "../shared/http";

const queues = new WeakMap<MockRuntime["store"], Map<string, Promise<void>>>();

// Invitations and membership commands validate the same mutable company state.
export async function serializeTeamMockCommand<T>(runtime: MockRuntime, access: AuthAccess, operation: () => Promise<T>): Promise<T> {
  const account = access.getAccountKey();
  if (!account) throw new ApiError(401, "SESSION_INVALID", "로그인이 필요해요.");
  let queue = queues.get(runtime.store);
  if (!queue) { queue = new Map(); queues.set(runtime.store, queue); }
  const previous = queue.get(account) ?? Promise.resolve(); let release!: () => void;
  const tail = new Promise<void>(resolve => { release = resolve; }); queue.set(account, tail);
  await previous;
  try {
    if (account !== access.getAccountKey()) throw new ApiError(401, "ACCOUNT_CHANGED", "로그인 계정이 변경됐어요.");
    return await operation();
  } finally { release(); if (queue.get(account) === tail) queue.delete(account); }
}

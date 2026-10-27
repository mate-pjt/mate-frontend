import type { DataConfig } from "../config";

export type StoragePort = Pick<Storage, "getItem" | "setItem" | "removeItem" | "key" | "length">;
export const mockSchemaVersion = 1;
export function memoryStorage(): StoragePort {
  const items = new Map<string, string>();
  return { get length() { return items.size; }, key: (index) => [...items.keys()][index] ?? null,
    getItem: (key) => items.get(key) ?? null, setItem: (key, value) => { items.set(key, value); }, removeItem: (key) => { items.delete(key); } };
}

export class MockStore {
  private memory = memoryStorage();
  private failed = false;
  readonly prefix: string;
  constructor(config: DataConfig, private storage: () => StoragePort = () => sessionStorage, private notify: () => void = () => {}) {
    this.prefix = `mate:mock:v${mockSchemaVersion}:${config.fingerprint}:${encodeURIComponent(config.apiEnvironment)}:${config.sources.auth}:`;
  }
  get persistent() { return !this.failed; }
  private fallback() {
    if (!this.failed) { this.failed = true; this.notify(); }
  }
  key(account: string, domain: string) { return `${this.prefix}${encodeURIComponent(account)}:${domain}`; }
  read<T>(account: string, domain: string, initial: () => T, valid: (value: unknown) => value is T): T {
    const key = this.key(account, domain);
    let raw = this.memory.getItem(key);
    if (!this.failed) {
      try { raw = this.storage().getItem(key); } catch { this.fallback(); }
    }
    if (raw) {
      try {
        const parsed: unknown = JSON.parse(raw);
        if (valid(parsed)) { this.memory.setItem(key, raw); return parsed; }
      } catch { /* Reset only this namespace on malformed data. */ }
      this.remove(account, domain);
    }
    const value = initial();
    this.write(account, domain, value);
    return structuredClone(value);
  }
  write<T>(account: string, domain: string, value: T) {
    const key = this.key(account, domain);
    const raw = JSON.stringify(value);
    this.memory.setItem(key, raw);
    if (!this.failed) { try { this.storage().setItem(key, raw); } catch { this.fallback(); } }
  }
  remove(account: string, domain: string) {
    const key = this.key(account, domain);
    this.memory.removeItem(key);
    if (!this.failed) { try { this.storage().removeItem(key); } catch { this.fallback(); } }
  }
  reset() {
    for (const storage of [this.memory, this.safeStorage()]) {
      if (!storage) continue;
      try {
        const keys = Array.from({ length: storage.length }, (_, i) => storage.key(i)).filter((key): key is string => key?.startsWith(this.prefix) ?? false);
        keys.forEach((key) => storage.removeItem(key));
      } catch { this.fallback(); }
    }
    this.notify();
  }
  private safeStorage() { try { return this.storage(); } catch { this.fallback(); return null; } }
}

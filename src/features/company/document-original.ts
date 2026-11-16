import type { DocumentAccessPurpose, DocumentOriginal } from "@/data/company/contracts";
import { ApiError } from "@/data/shared/errors";

export type OriginalState = { status: "idle" | "expired" } | { status: "loading"; purpose: DocumentAccessPurpose }
  | { status: "ready"; url: string } | { status: "downloaded" } | { status: "error"; message: string; statusCode: number };
type Ports = {
  read: (purpose: DocumentAccessPurpose, signal: AbortSignal) => Promise<DocumentOriginal>;
  isCurrent: () => boolean;
  createUrl: (blob: Blob) => string;
  revokeUrl: (url: string) => void;
  download: (url: string) => void;
  onChange: (state: OriginalState) => void;
  now?: () => number;
};

export function createDocumentOriginalController(ports: Ports) {
  const now = ports.now ?? Date.now;
  let disposed = false;
  let generation = 0;
  let flight: AbortController | null = null;
  let resource: { url: string; expires: number } | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const current = (id: number) => !disposed && generation === id && ports.isCurrent();
  function release() {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    if (resource) ports.revokeUrl(resource.url);
    resource = null;
  }
  function clear() {
    generation++;
    flight?.abort(); flight = null;
    release();
  }
  function checkExpiry() {
    if (!ports.isCurrent()) { clear(); if (!disposed) ports.onChange({ status: "idle" }); return; }
    if (resource && resource.expires <= now()) {
      clear();
      if (!disposed) ports.onChange({ status: "expired" });
    }
  }
  async function request(purpose: DocumentAccessPurpose) {
    if (disposed || flight || !ports.isCurrent()) return;
    release();
    const id = ++generation;
    const controller = new AbortController(); flight = controller;
    ports.onChange({ status: "loading", purpose });
    try {
      const original = await ports.read(purpose, controller.signal);
      if (!current(id) || controller.signal.aborted) return;
      const expires = Date.parse(original.expiresAt);
      if (!Number.isFinite(expires) || expires <= now()) throw new ApiError(410, "DOCUMENT_ACCESS_EXPIRED", "원본 접근 시간이 지났어요. 다시 요청해 주세요.");
      const url = ports.createUrl(original.blob);
      resource = { url, expires };
      timer = setTimeout(checkExpiry, Math.min(expires - now(), 2_147_483_647));
      if (purpose === "DOWNLOAD") {
        ports.download(url);
        ports.onChange({ status: "downloaded" });
      } else ports.onChange({ status: "ready", url });
    } catch (error) {
      if (!current(id) || controller.signal.aborted) return;
      release();
      const statusCode = error instanceof ApiError ? error.status : 0;
      const message = statusCode === 401 ? "로그인이 필요해요. 다시 로그인한 뒤 원본을 요청해 주세요."
        : statusCode === 403 || statusCode === 404 ? "원본을 찾지 못했거나 볼 권한이 없어요. 서류함에서 다시 확인해 주세요."
        : statusCode === 409 ? "이 버전의 상태가 변경됐어요. 서류 정보를 다시 조회해 주세요."
        : statusCode === 410 ? "원본 접근 시간이 지났어요. 다시 요청해 주세요."
        : "원본을 불러오지 못했어요. 연결 상태와 원본 제공 여부를 확인한 뒤 다시 요청해 주세요.";
      ports.onChange({ status: "error", message, statusCode });
    } finally {
      if (generation === id) flight = null;
    }
  }
  return { request, checkExpiry, activate: () => { disposed = false; }, dispose: () => { disposed = true; clear(); } };
}

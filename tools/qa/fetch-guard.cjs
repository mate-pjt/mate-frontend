// Optional local QA preload. Records counts only, never payloads, tokens or signed URLs.
// eslint-disable-next-line @typescript-eslint/no-require-imports -- Node --require preload runs as CommonJS.
const fs = require("node:fs");
const log = process.env.MATE_QA_FETCH_LOG;
const wireFile = process.env.MATE_QA_WIRE_FILE;
const wire = wireFile ? JSON.parse(fs.readFileSync(wireFile, "utf8")) : null;
if (log) {
  fs.appendFileSync(log, JSON.stringify({ event: "process", node: process.versions.node }) + "\n");
  const original = globalThis.fetch;
  globalThis.fetch = async (...args) => {
    const url = new URL(typeof args[0] === "string" || args[0] instanceof URL ? args[0] : args[0].url);
    const external = !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    fs.appendFileSync(log, JSON.stringify({ event: "fetch", external, wire: !!wire }) + "\n");
    if (wire && url.pathname.startsWith("/api/v1/")) {
      const id = Number(url.pathname.match(/\/bid-notices\/(\d+)/)?.[1] ?? 20001);
      const source = url.pathname === "/api/v1/regions" ? wire.regions
        : url.pathname === "/api/v1/industries" ? wire.industries
        : url.pathname === "/api/v1/bid-notices" ? { ...wire.bidList, page: Number(url.searchParams.get("page") ?? 0), size: Number(url.searchParams.get("size") ?? 10) }
        : /\/participants$/.test(url.pathname) ? { ...wire.participants, bidNoticeId: id, page: Number(url.searchParams.get("page") ?? 0) }
        : /\/attachments$/.test(url.pathname) ? { ...wire.attachments, bidNoticeId: id }
        : /\/related-notices$/.test(url.pathname) ? wire.related
        : /\/bid-results$/.test(url.pathname) ? { ...wire.results, bidNoticeId: id }
        : /\/bid-notices\/\d+$/.test(url.pathname) ? { ...wire.bidDetail, id, classificationContext: { ...wire.bidDetail.classificationContext, selectedBidClsfcNo: url.searchParams.get("bidClsfcNo") } }
        : null;
      if (!source) throw new Error("QA: unsupported wire endpoint");
      return new Response(JSON.stringify({ isSuccess: true, data: source }), { headers: { "Content-Type": "application/json" } });
    }
    if (external && process.env.MATE_QA_FORBID_EXTERNAL === "1") throw new Error("QA: external server fetch is forbidden");
    return original(...args);
  };
}

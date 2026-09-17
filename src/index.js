const UPSTREAM_SCRIPT = "https://static.cloudflareinsights.com/beacon.min.js";
const UPSTREAM_RUM = "https://cloudflareinsights.com/cdn-cgi/rum";
const PROXY_PATH = "/3d/assets/m.js";

const cors = (origin) => ({
  "access-control-allow-origin": origin || "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type",
});

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== PROXY_PATH) return env.ASSETS.fetch(request);

    const origin = request.headers.get("origin");

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    if (request.method === "GET") {
      const res = await fetch(UPSTREAM_SCRIPT, {
        cf: { cacheTtl: 3600, cacheEverything: true },
      });
      return new Response(res.body, {
        headers: {
          "content-type": "application/javascript; charset=utf-8",
          "cache-control": "public, max-age=3600",
          ...cors(origin),
        },
      });
    }

    if (request.method === "POST") {
      const res = await fetch(UPSTREAM_RUM, {
        method: "POST",
        headers: { "content-type": request.headers.get("content-type") || "text/plain" },
        body: await request.arrayBuffer(),
      });
      return new Response(null, { status: res.status, headers: cors(origin) });
    }

    return new Response(null, { status: 405, headers: { allow: "GET, POST, OPTIONS" } });
  },
};

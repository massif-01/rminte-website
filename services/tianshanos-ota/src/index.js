import {homePage} from './page.js';
import { readRelease, syncRelease } from './releases.js';

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Range",
  "Access-Control-Expose-Headers": "Accept-Ranges, Content-Length, Content-Range, ETag"
};

function withCors(headers = new Headers()) {
  for (const [name, value] of Object.entries(CORS_HEADERS)) {
    headers.set(name, value);
  }
  return headers;
}

function json(data, status = 200) {
  const headers = withCors(new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  }));
  return new Response(JSON.stringify(data, null, 2), { status, headers });
}

function versionPayload(RELEASE) {
  return {
    version: RELEASE.version,
    project_name: RELEASE.project_name,
    compile_date: RELEASE.compile_date,
    compile_time: RELEASE.compile_time,
    idf_version: RELEASE.idf_version,
    secure_version: RELEASE.secure_version,
    size: RELEASE.firmware.size,
    sha256: RELEASE.firmware.sha256,
    www_available: true,
    www_size: RELEASE.www.size,
    www_sha256: RELEASE.www.sha256
  };
}


async function serveObject(request, env, file, pinned) {
  const cacheControl = pinned ? "public, max-age=31536000, immutable" : "no-store";
  if (request.method === "HEAD") {
    const object = await env.DOWNLOADS.head(file.key);
    if (!object) return json({ error: "File not found" }, 404);
    const headers = withCors(new Headers({
      "Content-Type": "application/octet-stream",
      "Content-Length": String(object.size),
      "Content-Disposition": `attachment; filename="${file.name}"`,
      "Accept-Ranges": "bytes",
      "ETag": object.httpEtag,
      "Cache-Control": cacheControl
    }));
    return new Response(null, { status: 200, headers });
  }

  const rangeRequested = request.headers.has("Range");
  const object = await env.DOWNLOADS.get(file.key, { range: request.headers });
  if (!object || !("body" in object)) return json({ error: "File not found" }, 404);

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Content-Type", "application/octet-stream");
  headers.set("Content-Disposition", `attachment; filename="${file.name}"`);
  headers.set("Accept-Ranges", "bytes");
  headers.set("ETag", object.httpEtag);
  headers.set("Cache-Control", cacheControl);
  withCors(headers);

  let status = 200;
  if (rangeRequested && object.range) {
    status = 206;
    const start = object.range.offset;
    const end = start + object.range.length - 1;
    headers.set("Content-Range", `bytes ${start}-${end}/${object.size}`);
    headers.set("Content-Length", String(object.range.length));
  } else {
    headers.set("Content-Length", String(object.size));
  }

  return new Response(object.body, { status, headers });
}

export default {
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(syncRelease(env.DOWNLOADS).then(result => console.log(JSON.stringify(result))));
  },
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: withCors() });
    }

    if (!['GET', 'HEAD'].includes(request.method)) {
      return json({ error: "Method Not Allowed" }, 405);
    }

    const RELEASE = await readRelease(env.DOWNLOADS, url.searchParams.get("release"));
    if (!RELEASE) return json({ error: "Release unavailable" }, 503);
    if (path === "/release") return json(RELEASE);

    if (path === "/") {
      const defaultLang = ['CN', 'HK', 'MO', 'TW'].includes(request.cf?.country) ? 'zh' : 'en';
      const headers = withCors(new Headers({ "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" }));
      return new Response(request.method === "HEAD" ? null : homePage(url.origin, defaultLang, RELEASE), { status: 200, headers });
    }
    if (path === "/version" || path === "/info") return json(versionPayload(RELEASE));
    if (path === "/health") return json({ status: "ok", service: "TianShanOS OTA Server", version: RELEASE.version, firmware_available: true, www_available: true });
    if (["/firmware", "/firmware.bin", "/TianshanOS.bin", "/TianShanOS.bin"].includes(path)) return serveObject(request, env, RELEASE.firmware, url.searchParams.has("release"));
    if (["/www", "/www.bin"].includes(path)) return serveObject(request, env, RELEASE.www, url.searchParams.has("release"));
    return json({ error: "Not Found" }, 404);
  }
};

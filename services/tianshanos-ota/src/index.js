const RELEASE = {
  version: "0.5.1+e62c99e.06111755",
  project_name: "TianShanOS",
  compile_date: "Jun 11 2026",
  compile_time: "17:56:06",
  idf_version: "v5.5.2",
  secure_version: 0,
  firmware: {
    key: "firmware/tianshanos/v0.5.1/TianShanOS.bin",
    name: "TianShanOS.bin",
    size: 2154096,
    sha256: "fd09cc96e071ad90fd3f402d9ee1d69b53efd00a706c9b13484145b7c38efe58"
  },
  www: {
    key: "firmware/tianshanos/v0.5.1/www.bin",
    name: "www.bin",
    size: 3145728,
    sha256: "e928f782614dd37cb1704659dea00f772171020a5ba803a875173415e06e4284"
  }
};

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

function versionPayload() {
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

function homePage(origin) {
  const serviceUrl = `${origin}`;
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>TianShanOS OTA Service · RMinte</title>
  <style>
    :root { color-scheme: dark; --ink:#f5f7f4; --muted:#929b96; --line:rgba(255,255,255,.12); --accent:#75f0dc; --violet:#c4b1ff; }
    @font-face { font-family:"Quantify RM"; src:url("https://rminte.com/assets/fonts/Quantify-Bold.ttf") format("truetype"); font-weight:700; font-style:normal; font-display:swap; }
    * { box-sizing:border-box; }
    body { margin:0; min-height:100vh; font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; color:var(--ink); background:radial-gradient(circle at 12% 8%,rgba(31,127,110,.24),transparent 34%),radial-gradient(circle at 88% 82%,rgba(126,95,211,.18),transparent 35%),#080b0a; }
    main { width:min(880px,calc(100% - 36px)); margin:0 auto; padding:clamp(64px,10vw,112px) 0; }
    .eyebrow { color:var(--accent); font-size:.72rem; font-weight:800; letter-spacing:.16em; }
    h1 { margin:18px 0 0; font-size:clamp(2.8rem,7vw,5.4rem); line-height:.95; letter-spacing:-.055em; }
    .lead { max-width:650px; margin:26px 0 0; color:var(--muted); line-height:1.8; }
    .card { margin-top:54px; padding:clamp(24px,5vw,42px); border:1px solid var(--line); border-radius:28px; background:rgba(255,255,255,.045); box-shadow:0 34px 110px rgba(0,0,0,.25); backdrop-filter:blur(18px); }
    .status { display:flex; align-items:center; gap:10px; color:var(--accent); font-weight:750; }
    .dot { width:8px; height:8px; border-radius:50%; background:var(--accent); box-shadow:0 0 18px var(--accent); }
    .url { margin-top:24px; padding:16px 18px; display:flex; align-items:center; justify-content:space-between; gap:18px; border:1px solid var(--line); border-radius:16px; background:rgba(0,0,0,.24); }
    code { color:var(--violet); overflow-wrap:anywhere; }
    button { flex:none; border:0; border-radius:999px; padding:10px 15px; color:#101311; background:var(--accent); font-weight:760; cursor:pointer; }
    ol { margin:30px 0 0; padding-left:22px; color:var(--muted); line-height:1.9; }
    strong { color:var(--ink); }
    .brand-name { font-family:"Quantify RM",Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; font-weight:700; letter-spacing:.035em; white-space:nowrap; }
    .meta { margin-top:30px; padding-top:22px; border-top:1px solid var(--line); color:var(--muted); font-size:.82rem; }
    .links { margin-top:18px; display:flex; flex-wrap:wrap; gap:12px; }
    a { color:var(--accent); text-decoration:none; }
  </style>
</head>
<body>
  <main>
    <div class="eyebrow"><span class="brand-name">RM-01</span> · OTA SERVICE</div>
    <h1><span class="brand-name">TianShanOS</span><br>OTA 更新服务</h1>
    <p class="lead">为 <span class="brand-name">RM-01</span> 本机的 <span class="brand-name">TianShanOS</span> OTA 页面提供正式固件与 WebUI 更新文件。刷写操作仍在设备自己的管理页面中完成。</p>
    <section class="card">
      <div class="status"><span class="dot"></span>服务在线 · ${RELEASE.version}</div>
      <div class="url"><code id="serviceUrl">${serviceUrl}</code><button type="button" onclick="navigator.clipboard.writeText(document.getElementById('serviceUrl').textContent).then(()=>this.textContent='已复制')">复制地址</button></div>
      <ol>
        <li>让电脑或平板连接 <span class="brand-name">RM-01</span> 所在网络。</li>
        <li>打开 <span class="brand-name">RM-01</span> 的 <span class="brand-name">TianShanOS</span> WebUI，并进入<strong>“OTA 升级”</strong>。</li>
        <li>把上面的地址填入<strong>“OTA 服务器”</strong>并保存。</li>
        <li>点击<strong>“检查更新”</strong>，确认版本后开始升级。</li>
      </ol>
      <div class="meta">固件 ${RELEASE.firmware.name} · ${(RELEASE.firmware.size / 1024 / 1024).toFixed(1)} MB　 WebUI ${RELEASE.www.name} · ${(RELEASE.www.size / 1024 / 1024).toFixed(1)} MB</div>
      <div class="links"><a href="/version">查看版本信息</a><a href="/health">服务健康状态</a></div>
    </section>
  </main>
</body>
</html>`;
}

async function serveObject(request, env, file) {
  if (request.method === "HEAD") {
    const object = await env.DOWNLOADS.head(file.key);
    if (!object) return json({ error: "File not found" }, 404);
    const headers = withCors(new Headers({
      "Content-Type": "application/octet-stream",
      "Content-Length": String(object.size),
      "Content-Disposition": `attachment; filename="${file.name}"`,
      "Accept-Ranges": "bytes",
      "ETag": object.httpEtag,
      "Cache-Control": "public, max-age=3600"
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
  headers.set("Cache-Control", "public, max-age=3600");
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
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: withCors() });
    }

    if (!['GET', 'HEAD'].includes(request.method)) {
      return json({ error: "Method Not Allowed" }, 405);
    }

    if (path === "/") {
      const headers = withCors(new Headers({ "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" }));
      return new Response(request.method === "HEAD" ? null : homePage(url.origin), { status: 200, headers });
    }
    if (path === "/version" || path === "/info") return json(versionPayload());
    if (path === "/health") return json({ status: "ok", service: "TianShanOS OTA Server", version: RELEASE.version, firmware_available: true, www_available: true });
    if (["/firmware", "/firmware.bin", "/TianShanOS.bin"].includes(path)) return serveObject(request, env, RELEASE.firmware);
    if (["/www", "/www.bin"].includes(path)) return serveObject(request, env, RELEASE.www);
    return json({ error: "Not Found" }, 404);
  }
};

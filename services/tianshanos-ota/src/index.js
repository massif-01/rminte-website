const RELEASE = {
  version: "0.5.1+6565cb6.06111330",
  project_name: "TianShanOS",
  compile_date: "Jun 11 2026",
  compile_time: "13:31:16",
  idf_version: "v5.5.2",
  secure_version: 0,
  firmware: {
    key: "firmware/tianshanos/v0.5.1/TianShanOS.bin",
    name: "TianShanOS.bin",
    size: 2154096,
    sha256: "2be50f856b829fef21cffd9ec1e4ee9416495b48daee9334a756b888e3a8785d"
  },
  www: {
    key: "firmware/tianshanos/v0.5.1/www.bin",
    name: "www.bin",
    size: 3145728,
    sha256: "4c320dcfd57325d63d56f932451f2d492d5d51fa806d5f4a6722e138802da82a"
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

function homePage(origin, defaultLang) {
  const serviceUrl = `${origin}`;
  return `<!doctype html>
<html lang="${defaultLang === 'zh' ? 'zh-CN' : 'en'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>TianShanOS OTA Service · RMinte</title>
  <style>
    :root { color-scheme: dark; --ink:#f5f7f4; --muted:#929b96; --line:rgba(255,255,255,.12); --accent:#75f0dc; --violet:#c4b1ff; }
    @font-face { font-family:"Quantify RM"; src:url("https://rminte.com/assets/fonts/Quantify-Bold.ttf") format("truetype"); font-weight:700; font-style:normal; font-display:swap; }
    * { box-sizing:border-box; }
    body { margin:0; min-height:100vh; font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; color:var(--ink); background:radial-gradient(circle at 12% 8%,rgba(31,127,110,.24),transparent 34%),radial-gradient(circle at 88% 82%,rgba(126,95,211,.18),transparent 35%),#080b0a; }
    main { width:min(880px,calc(100% - 36px)); margin:0 auto; padding:clamp(88px,12vw,132px) 0 clamp(64px,10vw,112px); }
    .lang-toggle { position:absolute; top:28px; right:max(18px,calc((100vw - 880px)/2)); min-width:46px; border:1px solid var(--line); padding:11px 14px; color:var(--ink); background:rgba(255,255,255,.045); }
    .lang-toggle:hover { border-color:rgba(117,240,220,.45); background:rgba(117,240,220,.09); }
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
  <button class="lang-toggle" id="langToggle" type="button" aria-label="切换到英文">EN</button>
  <main>
    <div class="eyebrow"><span class="brand-name">RM-01</span> · OTA SERVICE</div>
    <h1 data-i18n-html="title"><span class="brand-name">TianShanOS</span><br>OTA 更新服务</h1>
    <p class="lead" data-i18n-html="lead">为 <span class="brand-name">RM-01</span> 本机的 <span class="brand-name">TianShanOS</span> OTA 页面提供正式固件与 WebUI 更新文件。刷写操作仍在设备自己的管理页面中完成。</p>
    <section class="card">
      <div class="status"><span class="dot"></span><span data-i18n="online">服务在线</span> · ${RELEASE.version}</div>
      <div class="url"><code id="serviceUrl">${serviceUrl}</code><button id="copyButton" type="button" data-i18n="copy">复制地址</button></div>
      <ol>
        <li data-i18n-html="step1">让电脑或平板连接 <span class="brand-name">RM-01</span> 所在网络。</li>
        <li data-i18n-html="step2">打开 <span class="brand-name">RM-01</span> 的 <span class="brand-name">TianShanOS</span> WebUI，并进入<strong>“OTA 升级”</strong>。</li>
        <li data-i18n-html="step3">把上面的地址填入<strong>“OTA 服务器”</strong>并保存。</li>
        <li data-i18n-html="step4">点击<strong>“检查更新”</strong>，确认版本后开始升级。</li>
      </ol>
      <div class="meta"><span data-i18n="firmware">固件</span> ${RELEASE.firmware.name} · ${(RELEASE.firmware.size / 1024 / 1024).toFixed(1)} MB　 WebUI ${RELEASE.www.name} · ${(RELEASE.www.size / 1024 / 1024).toFixed(1)} MB</div>
      <div class="links"><a href="/version" data-i18n="versionInfo">查看版本信息</a><a href="/health" data-i18n="health">服务健康状态</a></div>
    </section>
  </main>
  <script>
    const translations = {
      zh: {
        title: '<span class="brand-name">TianShanOS</span><br>OTA 更新服务',
        lead: '为 <span class="brand-name">RM-01</span> 本机的 <span class="brand-name">TianShanOS</span> OTA 页面提供正式固件与 WebUI 更新文件。刷写操作仍在设备自己的管理页面中完成。',
        online: '服务在线', copy: '复制地址', copied: '已复制', firmware: '固件', versionInfo: '查看版本信息', health: '服务健康状态',
        step1: '让电脑或平板连接 <span class="brand-name">RM-01</span> 所在网络。',
        step2: '打开 <span class="brand-name">RM-01</span> 的 <span class="brand-name">TianShanOS</span> WebUI，并进入<strong>“OTA 升级”</strong>。',
        step3: '把上面的地址填入<strong>“OTA 服务器”</strong>并保存。',
        step4: '点击<strong>“检查更新”</strong>，确认版本后开始升级。'
      },
      en: {
        title: '<span class="brand-name">TianShanOS</span><br>OTA Update Service',
        lead: 'Provides official firmware and WebUI updates to the <span class="brand-name">TianShanOS</span> OTA page hosted on your <span class="brand-name">RM-01</span>. Flashing remains securely controlled by the device’s own management interface.',
        online: 'Service online', copy: 'Copy address', copied: 'Copied', firmware: 'Firmware', versionInfo: 'View version information', health: 'Service health',
        step1: 'Connect your computer or tablet to the same network as the <span class="brand-name">RM-01</span>.',
        step2: 'Open the <span class="brand-name">TianShanOS</span> WebUI on your <span class="brand-name">RM-01</span>, then go to <strong>OTA Update</strong>.',
        step3: 'Enter the address above under <strong>OTA Server</strong>, then save it.',
        step4: 'Select <strong>Check for Updates</strong>, confirm the version, and start the update.'
      }
    };
    let currentLang = localStorage.getItem('rm-ota-lang') || ${JSON.stringify(defaultLang)};
    const langToggle = document.getElementById('langToggle');
    const copyButton = document.getElementById('copyButton');

    function applyLanguage(lang, remember = true) {
      currentLang = lang;
      if (remember) localStorage.setItem('rm-ota-lang', lang);
      document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
      document.querySelectorAll('[data-i18n]').forEach((element) => { element.textContent = translations[lang][element.dataset.i18n]; });
      document.querySelectorAll('[data-i18n-html]').forEach((element) => { element.innerHTML = translations[lang][element.dataset.i18nHtml]; });
      langToggle.textContent = lang === 'zh' ? 'EN' : '中';
      langToggle.setAttribute('aria-label', lang === 'zh' ? '切换到英文' : 'Switch to Chinese');
    }

    langToggle.addEventListener('click', () => applyLanguage(currentLang === 'zh' ? 'en' : 'zh'));
    copyButton.addEventListener('click', async () => {
      await navigator.clipboard.writeText(document.getElementById('serviceUrl').textContent);
      copyButton.textContent = translations[currentLang].copied;
    });
    applyLanguage(currentLang, false);
  </script>
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
      const defaultLang = ['CN', 'HK', 'MO', 'TW'].includes(request.cf?.country) ? 'zh' : 'en';
      const headers = withCors(new Headers({ "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" }));
      return new Response(request.method === "HEAD" ? null : homePage(url.origin, defaultLang), { status: 200, headers });
    }
    if (path === "/version" || path === "/info") return json(versionPayload());
    if (path === "/health") return json({ status: "ok", service: "TianShanOS OTA Server", version: RELEASE.version, firmware_available: true, www_available: true });
    if (["/firmware", "/firmware.bin", "/TianShanOS.bin"].includes(path)) return serveObject(request, env, RELEASE.firmware);
    if (["/www", "/www.bin"].includes(path)) return serveObject(request, env, RELEASE.www);
    return json({ error: "Not Found" }, 404);
  }
};

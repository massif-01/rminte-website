import {
  renderContract,
  escapeHtml,
} from "../../website/sample-loan/contract.mjs";
import { assert, fail } from "./domain.mjs";
import { contractLanguage } from "../../website/sample-loan/contract-language.mjs";
// Used by the Cloudflare consumer and the isolated real-Chromium verification harness.
export async function compressImage(page, bytes, mime) {
  const base64 = Buffer.from(bytes).toString("base64");
  const result = await page.evaluate(
    async ({ base64, mime }) => {
      const image = new Image();
      image.src = `data:${mime};base64,${base64}`;
      await image.decode();
      if (!image.naturalWidth || !image.naturalHeight)
        throw new Error("INVALID_IMAGE");
      const canvas = document.createElement("canvas");
      let scale = Math.min(
        1,
        2400 / Math.max(image.naturalWidth, image.naturalHeight),
      );
      while (true) {
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        for (const quality of [0.9, 0.8, 0.7, 0.6]) {
          const url = canvas.toDataURL("image/jpeg", quality),
            payload = url.split(",")[1];
          if (atob(payload).length <= 500000)
            return { payload, width: canvas.width, height: canvas.height };
        }
        if (Math.min(canvas.width, canvas.height) <= 256)
          throw new Error("IMAGE_BUDGET_UNREADABLE");
        scale *= 0.8;
      }
    },
    { base64, mime },
  );
  return {
    bytes: Uint8Array.from(atob(result.payload), (c) => c.charCodeAt(0)),
    width: result.width,
    height: result.height,
  };
}
export function glyphPreflight(text, cmap, field = "") {
  const available = new Set(cmap.codepoints),
    missing = [
      ...new Set(
        [...text]
          .map((c) => c.codePointAt(0))
          .filter(
            (cp) =>
              cp > 31 &&
              cp !== 127 &&
              !available.has(cp) &&
              ![0x200b, 0x200d, 0xfeff].includes(cp),
          ),
      ),
    ];
  if (missing.length)
    fail(
      422,
      "FONT_GLYPH_UNSUPPORTED",
      (field ? field + "：" : "") +
        "字体不支持字符：" +
        missing.map((cp) => String.fromCodePoint(cp)).join(""),
    );
}
export async function renderPdf(
  page,
  { snapshot, terms, photos, logo, fontCss, cmap, fontManifestHash },
) {
  const preflight = (value, path) => {
    if (typeof value === "string") glyphPreflight(value, cmap, path);
    else if (value && typeof value === "object")
      for (const [key, child] of Object.entries(value))
        preflight(child, path ? path + "." + key : key);
  };
  preflight(snapshot, "agreement");
  for (const key of ["clauses", "partyRules", "version"])
    glyphPreflight(terms[key], cmap, "terms." + key);
  photos.forEach((photo, index) =>
    glyphPreflight(photo.name, cmap, "photos." + index + ".name"),
  );
  const markup = renderContract(snapshot, terms, photos);
  const language = contractLanguage(snapshot.agreementLanguage || "zh");
  glyphPreflight(
    markup.replace(/<[^>]*>/g, "").replace(/&[a-z0-9#]+;/gi, ""),
    cmap,
  );
  const html = `<!doctype html><html lang="${language === "zh" ? "zh-CN" : "en"}"><head><meta charset="utf-8"><style>${fontCss}
 @page{size:A4;margin:32mm 16mm 18mm}*{box-sizing:border-box}body{font-family:LoanSC,LoanExt,sans-serif;color:#20252b;font-size:10pt;line-height:1.8;margin:0;overflow-wrap:anywhere}h1{font-size:18pt;text-align:center;margin:0 0 24px}h2{font-size:12pt;margin:24px 0 12px;break-after:avoid}p,li{orphans:3;widows:3}table{border-collapse:collapse;width:100%}td,th{border:1px solid #d7dadd;padding:8px;text-align:left}figure{margin:20px 0;break-inside:avoid}figure img{display:block;max-width:100%;max-height:220mm;object-fit:contain;margin:auto}.document-meta{font-size:8.5pt;border-bottom:1px solid #d7dadd;padding-bottom:12px;display:grid;grid-template-columns:1fr 1fr;gap:6px}blockquote{border-left:2px solid #858c95;margin:16px 0;padding:12px}.watermark{position:fixed;left:50%;top:50%;width:145mm;transform:translate(-50%,-50%) rotate(-30deg);opacity:.045;pointer-events:none}.watermark img{width:100%}
 </style></head><body><div class="watermark"><img src="${escapeHtml(logo)}" alt=""></div>${markup}<p>${language === "en" ? "Document revision: " : "文件版本："}R${snapshot.agreementRevision}</p></body></html>`;
  await page.setContent(html, { waitUntil: "load", timeout: 60000 });
  await page.evaluate(async () => {
    await Promise.all([...document.fonts].map((font) => font.load()));
    await document.fonts.ready;
    const fonts = [...document.fonts];
    if (fonts.some((f) => f.status !== "loaded"))
      throw new Error("FONT_LOAD_FAILED");
    await Promise.all([...document.images].map((image) => image.decode()));
    document.documentElement.dataset.renderReady = "true";
  });
  await page.waitForSelector('html[data-render-ready="true"]', {
    timeout: 60000,
  });
  // Print headers use an isolated document; embed the trusted SVG paths directly.
  const headerLogo = Buffer.from(logo.split(",")[1], "base64")
    .toString("utf8")
    .replace("<svg ", '<svg width="113.386" height="20.437" ');
  const headerTemplate = `<div style="width:100%;padding:0 16mm;line-height:0">${headerLogo}</div>`;
  const bytes = await page.pdf({
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate,
    footerTemplate: "<span></span>",
    margin: { top: "32mm", bottom: "18mm", left: "16mm", right: "16mm" },
  });
  assert(
    new TextDecoder().decode(bytes.subarray(0, 5)) === "%PDF-",
    "INVALID_PDF",
    "渲染结果不是PDF",
    503,
  );
  // /Type /Page is present in the supported Chromium output; validate locally with a PDF parser too.
  const raw = new TextDecoder("latin1").decode(bytes),
    count = (raw.match(/\/Type\s*\/Page\b/g) || []).length;
  assert(count > 0, "INVALID_PDF", "PDF页数无法核对", 503);
  return { bytes, pageCount: count, fontManifestHash };
}

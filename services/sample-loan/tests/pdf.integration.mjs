import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import {
  readFileSync,
  readdirSync,
  mkdtempSync,
  writeFileSync,
  rmSync,
  mkdirSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { chromium } from "@playwright/test";
import { digest } from "../../case-access/crypto.mjs";
import { handleSampleApi } from "../api.mjs";
import { runJob } from "../jobs.mjs";
import { glyphPreflight } from "../render.mjs";
import { application, draft } from "./fixtures.mjs";
const language = process.env.SAMPLE_PDF_LANGUAGE || "zh";
const agreementLanguage = language === "zh" ? "zh" : "en";
const root = mkdtempSync(join(tmpdir(), "sample-pdf-")),
  origin = "http://127.0.0.1:8999";
process.env.XDG_CONFIG_HOME = join(root, "config");
process.env.WRANGLER_LOG_PATH = join(root, "logs");
process.env.WRANGLER_REGISTRY_PATH = join(root, "registry");
process.env.WRANGLER_SEND_METRICS = "false";
writeFileSync(
  join(root, "wrangler.jsonc"),
  JSON.stringify({
    name: "sample-pdf-fixture",
    compatibility_date: "2026-10-26",
    compatibility_flags: ["nodejs_compat"],
    d1_databases: [
      {
        binding: "CASE_DB",
        database_name: "sample",
        database_id: "00000000-0000-0000-0000-000000000001",
      },
    ],
    r2_buckets: [{ binding: "SAMPLE_FILES", bucket_name: "sample-pdf-files" }],
  }),
);
const { getPlatformProxy } = await import("wrangler"),
  platform = await getPlatformProxy({
    configPath: join(root, "wrangler.jsonc"),
    persist: false,
    remoteBindings: false,
    envFiles: [],
  }),
  assets = new URL("../document-assets/", import.meta.url);
const env = {
  ...platform.env,
  CASE_SECRET: "c".repeat(64),
  SAMPLE_SECRET: "s".repeat(64),
  DOCUMENT_ASSETS: {
    fetch: async (request) => {
      const name = new URL(request.url).pathname.slice(1);
      assert(
        [
          "manifest.json",
          "loan-sc.woff2",
          "loan-ext.woff2",
          "logo.svg",
        ].includes(name),
      );
      return new Response(readFileSync(new URL(name, assets)));
    },
  },
};
const api = async (path, data) => {
  const response = await handleSampleApi(
    new Request(origin + path, {
      method: data ? "POST" : "GET",
      headers: {
        Origin: origin,
        Cookie: "rminte_local_session=" + "o".repeat(48),
        "Idempotency-Key": crypto.randomUUID(),
        ...(data ? { "Content-Type": "application/json" } : {}),
      },
      body: data ? JSON.stringify(data) : undefined,
    }),
    env,
  );
  const result = await response.json();
  assert(response.ok, JSON.stringify(result));
  return result;
};
try {
  for (const name of readdirSync(
    new URL("../../case-access/migrations/", import.meta.url),
  )
    .filter((n) => n.endsWith(".sql"))
    .sort())
    await env.CASE_DB.exec(
      readFileSync(
        new URL("../../case-access/migrations/" + name, import.meta.url),
        "utf8",
      )
        .replace(/^--.*$/gm, "")
        .replaceAll("\n", " "),
    );
  await env.CASE_DB.exec(
    "UPDATE access_settings SET ready=1; INSERT INTO users(id,username,role,password_mac,created_at,is_owner,must_change_password) VALUES('owner','admin','admin','unused',1,1,0)",
  );
  await env.CASE_DB.prepare(
    "INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)",
  )
    .bind(
      await digest("o".repeat(48)),
      "owner",
      Math.floor(Date.now() / 1000) + 86400,
    )
    .run();
  const terms = (await api("/api/sample-loans/terms")).terms,
    submitted = await api("/api/sample-loans/applications", {
      ...application,
      consent: {
        accepted: true,
        termsVersion: terms.version,
        noticeVersion: terms.noticeVersion,
        noStockShown: false,
        language,
      },
    }),
    asset = await api("/api/sample-admin/assets", {
      modelKey: application.modelKey,
      no: "PDF-NO-001",
      sn: "PDF-SN-001",
      notes: "PDF隔离验证",
    }),
    d = draft();
  d.applicant.contactName = "龚睿𠮷";
  delete d.requestedDays;
  const browser = await chromium.launch(),
    page = await browser.newPage();
  await page.setContent('<canvas width="2400" height="1600"></canvas>');
  const base64 = await page.evaluate(() => {
    const canvas = document.querySelector("canvas"),
      ctx = canvas.getContext("2d");
    for (let y = 0; y < 1600; y += 10)
      for (let x = 0; x < 2400; x += 10) {
        ctx.fillStyle = `rgb(${x % 256},${y % 256},${(x + y) % 256})`;
        ctx.fillRect(x, y, 10, 10);
      }
    ctx.fillStyle = "#fff";
    ctx.fillRect(20, 20, 2100, 150);
    ctx.fillStyle = "#000";
    ctx.font = "60px sans-serif";
    ctx.fillText("SN PDF-SN-001 / NO PDF-NO-001", 50, 110);
    return canvas.toDataURL("image/png").split(",")[1];
  });
  await browser.close();
  const bytes = Buffer.from(base64, "base64");
  const fileId = crypto.randomUUID(),
    fileKey = "originals/" + submitted.id + "/" + fileId;
  await env.SAMPLE_FILES.put(fileKey, bytes, {
    httpMetadata: { contentType: "image/png" },
  });
  await env.CASE_DB.prepare(
    "INSERT INTO sample_files(id,request_id,original_key,name,mime,original_size,original_hash,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,'uploaded',?,?)",
  )
    .bind(
      fileId,
      submitted.id,
      fileKey,
      "SN与NO交付照片.png",
      "image/png",
      bytes.length,
      createHash("sha256").update(bytes).digest("hex"),
      new Date().toISOString(),
      new Date().toISOString(),
    )
    .run();
  const approved = await api(
      "/api/sample-admin/requests/" + submitted.id + "/approve",
      {
        expectedRowVersion: 1,
        expectedAssetVersion: 1,
        assetId: asset.id,
        fileIds: [fileId],
        draft: d,
      },
    ),
    job = await env.CASE_DB.prepare(
      "SELECT * FROM sample_jobs WHERE request_id=?",
    )
      .bind(submitted.id)
      .first();
  assert.equal(approved.request.agreement.agreementLanguage, agreementLanguage);
  const preview = await api(`/api/sample-admin/requests/${submitted.id}/versions/1/preview`);
  assert.equal(preview.snapshot.agreementLanguage, agreementLanguage);
  const result = await runJob(env, job.id, { launch: async () => {
    const browser = await chromium.launch();
    const newPage = browser.newPage.bind(browser);
    browser.newPage = async () => {
      const page = await newPage();
      const pdf = page.pdf.bind(page);
      page.pdf = async (options) => {
        assert.equal(await page.locator('html').getAttribute('lang'), agreementLanguage === 'zh' ? 'zh-CN' : 'en');
        assert.equal(await page.locator('h1').innerText(), agreementLanguage === 'zh' ? 'RMinte RM-01 产品借用协议' : 'RMinte RM-01 Equipment Loan Agreement');
        return pdf(options);
      };
      return page;
    };
    return browser;
  } });
  assert(result.published, JSON.stringify(result));
  const document = await env.CASE_DB.prepare(
      "SELECT * FROM sample_document_objects WHERE document_id=?",
    )
      .bind(result.documentId)
      .first(),
    object = await env.SAMPLE_FILES.get(document.object_key),
    pdf = new Uint8Array(await object.arrayBuffer());
  assert(pdf.length === document.size);
  const second = await runJob(env, job.id, {
    launch: () => {
      throw new Error("Ready job rendered twice");
    },
  });
  assert.equal(second, undefined);
  const f = await env.CASE_DB.prepare("SELECT * FROM sample_files WHERE id=?")
    .bind(fileId)
    .first();
  assert(f.derivative_size <= 500000);
  assert.equal(
    (
      await env.CASE_DB.prepare(
        "SELECT COUNT(*) AS n FROM sample_document_objects",
      ).first()
    ).n,
    1,
  );
  const manifest = JSON.parse(readFileSync(new URL("manifest.json", assets)));
  assert.doesNotThrow(() => glyphPreflight("𠮷", manifest));
  assert.throws(
    () => glyphPreflight(String.fromCodePoint(0x10ffff), manifest),
    (e) => e.code === "FONT_GLYPH_UNSUPPORTED",
  );
  // Corrections create a new document; a late consumer must not overwrite the winning attempt.
  const editable = (s) => {
    const d = structuredClone(s);
    for (const key of [
      "assetSnapshot",
      "insuredValue",
      "publicNo",
      "requestedDays",
      "submittedAt",
      "approvedAt",
      "approvedBy",
      "termsVersion",
      "agreementRevision",
      "agreementLanguage",
      "fileIds",
      "quoteId",
    ])
      delete d[key];
    return d;
  };
  let current = (await api("/api/sample-admin/requests/" + submitted.id))
    .request;
  const revised = editable(current.agreement);
  revised.approval.note = "补充交付说明，旧文件保留";
  revised.quote.deposit = { currency: "CNY" };
  const r2 = await api(
    "/api/sample-admin/requests/" + submitted.id + "/revisions",
    {
      expectedRowVersion: current.rowVersion,
      reason: "核对交付说明",
      draft: revised,
      fileIds: [fileId],
    },
  );
  assert.equal(r2.request.currentAgreementRevision, 2);
  assert.equal(r2.request.agreement.agreementLanguage, agreementLanguage);
  const r1again = await env.SAMPLE_FILES.get(document.object_key);
  assert.equal(
    createHash("sha256")
      .update(new Uint8Array(await r1again.arrayBuffer()))
      .digest("hex"),
    document.sha256,
  );
  const superseded = await handleSampleApi(
    new Request(
      origin +
        "/api/sample-admin/requests/" +
        submitted.id +
        "/versions/1/delivery",
      { headers: { Cookie: "rminte_local_session=" + "o".repeat(48) } },
    ),
    env,
  );
  assert.equal((await superseded.json()).code, "DELIVERY_SUPERSEDED");
  const job2 = await env.CASE_DB.prepare(
    "SELECT * FROM sample_jobs WHERE request_id=? AND revision_no=2",
  )
    .bind(submitted.id)
    .first();
  let entered, release;
  const enteredPromise = new Promise((r) => (entered = r)),
    releasePromise = new Promise((r) => (release = r));
  const late = runJob(env, job2.id, {
    launch: async () => {
      const browser = await chromium.launch(),
        newPage = browser.newPage.bind(browser);
      browser.newPage = async () => {
        const page = await newPage(),
          pdf = page.pdf.bind(page);
        page.pdf = async (options) => {
          const bytes = await pdf(options);
          entered();
          await releasePromise;
          return bytes;
        };
        return page;
      };
      return browser;
    },
  });
  await enteredPromise;
  await env.CASE_DB.prepare(
    "UPDATE sample_jobs SET lease_expires_at=? WHERE id=?",
  )
    .bind(new Date(Date.now() - 1000).toISOString(), job2.id)
    .run();
  const winner = await runJob(env, job2.id, {
    launch: () => chromium.launch(),
  });
  assert(winner.published);
  release();
  assert.equal((await late).published, false);
  const selected = await env.CASE_DB.prepare(
    "SELECT document_id FROM sample_agreement_versions WHERE request_id=? AND revision_no=2",
  )
    .bind(submitted.id)
    .first();
  assert.equal(selected.document_id, winner.documentId);
  await api("/api/sample-admin/settings", {
    bankAccounts: { CNY: "隔离测试账户：不得实际汇款", USD: null },
    templateRevision: "TEST-MAIL-v1",
  });
  const delivery = await api(
    "/api/sample-admin/requests/" +
      submitted.id +
      "/versions/2/delivery?documentId=" +
      winner.documentId,
  );
  assert(delivery.delivery.body.includes("R2"));
  assert.equal(delivery.delivery.language, agreementLanguage);
  assert.match(delivery.delivery.translations.en.subject, /loan approval/);
  assert.match(delivery.delivery.translations.zh.subject, /样机借用批复/);
  assert.equal(delivery.delivery.sha256, winner.hash);
  current = (await api("/api/sample-admin/requests/" + submitted.id)).request;
  const receipt = await api(
    "/api/sample-admin/requests/" + submitted.id + "/finances/receipts",
    {
      expectedRowVersion: current.rowVersion,
      money: { currency: "CNY", amountMinor: "3000000" },
      occurredAt: new Date().toISOString(),
      reference: "PDF-BANK-001",
      quoteId: current.agreement.quoteId,
      purpose: "deposit",
      note: "本地真实账目测试，不执行银行操作",
    },
  );
  const shipped = await api(
    "/api/sample-admin/requests/" + submitted.id + "/progress/ship",
    {
      expectedRowVersion: receipt.request.rowVersion,
      occurredAt: new Date().toISOString(),
      note: "核对发货",
    },
  );
  const returned = await api(
    "/api/sample-admin/requests/" + submitted.id + "/progress/return",
    {
      expectedRowVersion: shipped.request.rowVersion,
      occurredAt: new Date().toISOString(),
      note: "实际送达",
    },
  );
  assert.equal(returned.request.status, "completed");
  assert.equal(
    (
      await api(
        "/api/sample-loans/availability?modelKey=" + application.modelKey,
      )
    ).availability,
    "available",
  );
  const secondApplication = await api("/api/sample-loans/applications", {
      ...application,
      consent: {
        accepted: true,
        termsVersion: terms.version,
        noticeVersion: terms.noticeVersion,
        noStockShown: false,
      },
    }),
    inventory = (await api("/api/sample-admin/assets")).assets.find(
      (a) => a.id === asset.id,
    );
  const secondApproval = await api(
    "/api/sample-admin/requests/" + secondApplication.id + "/approve",
    {
      expectedRowVersion: 1,
      expectedAssetVersion: inventory.assetVersion,
      assetId: asset.id,
      fileIds: [],
      draft: d,
    },
  );
  const originalReturn = returned.request.events.find(
    (e) => e.action === "progress.return",
  );
  const refused = await handleSampleApi(
    new Request(
      origin + "/api/sample-admin/requests/" + submitted.id + "/correction",
      {
        method: "POST",
        headers: {
          Origin: origin,
          "Content-Type": "application/json",
          Cookie: "rminte_local_session=" + "o".repeat(48),
          "Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify({
          expectedRowVersion: returned.request.rowVersion,
          expectedAssetVersion: inventory.assetVersion,
          eventId: originalReturn.id,
          reason: "误标但已重新分配",
        }),
      },
    ),
    env,
  );
  assert.equal((await refused.json()).code, "ASSET_REALLOCATED");
  const secondJob = await env.CASE_DB.prepare(
    "SELECT id FROM sample_jobs WHERE request_id=?",
  )
    .bind(secondApplication.id)
    .first();
  assert(
    (await runJob(env, secondJob.id, { launch: () => chromium.launch() }))
      .published,
  );
  let s = (await api("/api/sample-admin/requests/" + secondApplication.id))
    .request;
  s = (
    await api("/api/sample-admin/requests/" + s.id + "/finances/receipts", {
      expectedRowVersion: s.rowVersion,
      money: { currency: "CNY", amountMinor: "3000000" },
      occurredAt: new Date().toISOString(),
      reference: "PDF-BANK-002",
      quoteId: s.agreement.quoteId,
      purpose: "deposit",
    })
  ).request;
  s = (
    await api("/api/sample-admin/requests/" + s.id + "/progress/ship", {
      expectedRowVersion: s.rowVersion,
      occurredAt: new Date().toISOString(),
    })
  ).request;
  s = (
    await api("/api/sample-admin/requests/" + s.id + "/loss", {
      expectedRowVersion: s.rowVersion,
      occurredAt: new Date().toISOString(),
      reason: "核实借用途中丢失",
      evidence: "隔离核实材料",
    })
  ).request;
  assert.equal(s.status, "loss_pending");
  assert.equal(s.progress.returnedAt, null);
  const assessment = await api(
    "/api/sample-admin/requests/" + s.id + "/finances/assessments",
    {
      expectedRowVersion: s.rowVersion,
      money: { currency: "CNY", amountMinor: "4000000" },
      reason: "已核定制造成本：材料、装配、检测及调试",
      complete: true,
    },
  );
  s = assessment.request;
  s = (
    await api("/api/sample-admin/requests/" + s.id + "/loss-notice", {
      expectedRowVersion: s.rowVersion,
      occurredAt: new Date().toISOString(),
      reason: "责任与费用已核实并通知",
      evidence: "隔离送达依据",
    })
  ).request;
  assert(s.loss.compensation_due_at);
  const assessmentId = s.assessments[0].id;
  s = (
    await api("/api/sample-admin/requests/" + s.id + "/finances/settlements", {
      expectedRowVersion: s.rowVersion,
      money: { currency: "CNY", amountMinor: "3000000" },
      occurredAt: new Date().toISOString(),
      assessmentId,
      quoteId: s.agreement.quoteId,
      note: "押金抵扣",
    })
  ).request;
  s = (
    await api("/api/sample-admin/requests/" + s.id + "/finances/receipts", {
      expectedRowVersion: s.rowVersion,
      money: { currency: "CNY", amountMinor: "1000000" },
      occurredAt: new Date().toISOString(),
      reference: "PDF-COMP-001",
      assessmentId,
      purpose: "compensation",
      note: "差额赔偿",
    })
  ).request;
  s = (
    await api("/api/sample-admin/requests/" + s.id + "/loss-close", {
      expectedRowVersion: s.rowVersion,
      reason: "应收应退已结清",
    })
  ).request;
  assert.equal(s.status, "loss_closed");
  assert.equal(s.progress.returnedAt, null);
  assert.equal(
    (
      await api(
        "/api/sample-loans/availability?modelKey=" + application.modelKey,
      )
    ).availability,
    "unavailable",
  );
  // A later real transfer must not strand an already closed loss account.
  const lateCash = await api(
    `/api/sample-admin/requests/${s.id}/finances/receipts`,
    {
      expectedRowVersion: s.rowVersion,
      money: { currency: "CNY", amountMinor: "1" },
      occurredAt: new Date().toISOString(),
      reference: "AFTER-LOSS-CLOSED",
      purpose: "unmatched",
    },
  );
  s = (
    await api(`/api/sample-admin/requests/${s.id}/finances/reconcile`, {
      expectedRowVersion: lateCash.request.rowVersion,
      sourceEntryId: lateCash.entryId,
      purpose: "refund_only",
      note: "结案后迟到款原路退还",
    })
  ).request;
  s = (
    await api(`/api/sample-admin/requests/${s.id}/finances/refunds`, {
      expectedRowVersion: s.rowVersion,
      money: { currency: "CNY", amountMinor: "1" },
      occurredAt: new Date().toISOString(),
      reference: "AFTER-LOSS-REFUND",
    })
  ).request;
  assert.equal(s.financialClosedAt, null);
  s = (
    await api(`/api/sample-admin/requests/${s.id}/finances/close`, {
      expectedRowVersion: s.rowVersion,
      reason: "迟到款已原币退清",
    })
  ).request;
  assert(s.financialClosedAt);
  assert.equal(s.status, "loss_closed");
  assert.equal(s.progress.returnedAt, null);
  const output = fileURLToPath(
    new URL(
      `../../../output/ci/sample-loan/real-pipeline-${agreementLanguage}.pdf`,
      import.meta.url,
    ),
  );
  mkdirSync(new URL("../../../output/ci/sample-loan/", import.meta.url), {
    recursive: true,
  });
  writeFileSync(output, pdf);
  console.log(
    JSON.stringify({
      output,
      pages: document.page_count,
      bytes: pdf.length,
      sha256: document.sha256,
      imageBytes: f.derivative_size,
    }),
  );
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await platform.dispose();
  rmSync(root, { recursive: true, force: true });
}

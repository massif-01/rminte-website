import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { digest } from "../../case-access/crypto.mjs";
import { handleSampleApi } from "../api.mjs";
import { maintainData, workingDeadline } from "../maintenance.mjs";
import { project } from "../finance.mjs";
import { terms } from "../agreements.mjs";
import { repairJobs } from "../jobs.mjs";
import { application, draft } from "./fixtures.mjs";
const origin = "http://127.0.0.1:8999";
test("financial projection keeps individual debts and the latest assessment decision", () => {
  const assessments = [
    { id: "a", currency: "CNY", amount_minor: 100, completed: 1 },
    { id: "b", currency: "CNY", amount_minor: 100, completed: 1 },
  ];
  const entries = [
    {
      id: "cash",
      kind: "receipt",
      currency: "CNY",
      amount_minor: 200,
      assessment_id: "a",
      details_json: '{"purpose":"compensation"}',
    },
  ];
  const invalid = project(entries, assessments, [], null);
  assert.equal(invalid.balanced, false);
  assert.equal(invalid.reconciliation, true);
  assert.equal(
    project(
      [],
      [
        { ...assessments[0], amount_minor: 0 },
        { ...assessments[1], amount_minor: 0, completed: 0 },
      ],
      [],
      null,
    ).assessmentComplete,
    false,
  );
});
test("persistent API: authorization, atomic allocation, immutable revisions, real money and late receipts", async () => {
  const root = mkdtempSync(join(tmpdir(), "sample-loan-api-"));
  writeFileSync(
    join(root, "wrangler.jsonc"),
    JSON.stringify({
      name: "sample-loan-fixture",
      compatibility_date: "2026-10-26",
      compatibility_flags: ["nodejs_compat"],
      d1_databases: [
        {
          binding: "CASE_DB",
          database_name: "sample",
          database_id: "00000000-0000-0000-0000-000000000001",
        },
      ],
      r2_buckets: [{ binding: "SAMPLE_FILES", bucket_name: "sample-files" }],
    }),
  );
  process.env.XDG_CONFIG_HOME = join(root, "config");
  process.env.WRANGLER_LOG_PATH = join(root, "logs");
  process.env.WRANGLER_REGISTRY_PATH = join(root, "registry");
  process.env.WRANGLER_SEND_METRICS = "false";
  const { getPlatformProxy } = await import("wrangler");
  const platform = await getPlatformProxy({
    configPath: join(root, "wrangler.jsonc"),
    persist: false,
    remoteBindings: false,
    envFiles: [],
  });
  const env = {
    ...platform.env,
    CASE_SECRET: "c".repeat(64),
    SAMPLE_SECRET: "s".repeat(64),
  };
  const api = async (
    path,
    { method = "GET", data, cookie = "owner", key = crypto.randomUUID(), ip } = {},
  ) => {
    const response = await handleSampleApi(
      new Request(origin + path, {
        method,
        headers: {
          Origin: origin,
          ...(ip ? { "CF-Connecting-IP": ip } : {}),
          ...(cookie
            ? { Cookie: "rminte_local_session=" + cookie.padEnd(48, "x") }
            : {}),
          "Idempotency-Key": key,
          ...(data ? { "Content-Type": "application/json" } : {}),
        },
        body: data ? JSON.stringify(data) : undefined,
      }),
      env,
    );
    const result = await response.json();
    return { status: response.status, ...result };
  };
  try {
    const migrations = new URL(
      "../../case-access/migrations/",
      import.meta.url,
    );
    let assetMigrationBefore;
    for (const name of readdirSync(migrations)
      .filter((f) => f.endsWith(".sql"))
      .sort()) {
      const sql = readFileSync(new URL(name, migrations), "utf8")
        .replace(/^--.*$/gm, "")
        .replaceAll("\n", " ");
      if (name === "0005_sample_legacy_loans.sql") {
        await env.CASE_DB.exec(
          "INSERT INTO users(id,username,role,password_mac,created_at) VALUES('migration-user','migration','admin','unused',0); INSERT INTO sample_assets(id,model_key,no,sn,no_key,sn_key,created_by,created_at,updated_at) VALUES('migration-asset','rm01-t234-32g','N','S','N','S','migration-user','2026-01-01','2026-01-01'); INSERT INTO sample_requests(id,public_no,original_json,consent_json,requested_days,model_key,search_text,display_name,submitted_at) VALUES('migration-request','RM01-1','{}','{}',1,'rm01-t234-32g','fixture','fixture','2026-01-01'); INSERT INTO sample_allocations VALUES('migration-asset','migration-request','2026-01-01','migration-operation');",
        );
      }
      if (name === "0007_sample_no_repeat.sql") {
        await env.CASE_DB.exec(
          "INSERT INTO users(id,username,role,password_mac,created_at) VALUES('migration-user','migration','admin','unused',0); INSERT INTO sample_assets(id,model_key,no,sn,no_key,sn_key,created_by,created_at,updated_at) VALUES('migration-asset','rm01-t234-32g','N1','S1','N1','S1','migration-user','2026-01-01','2026-01-01'),('migration-legacy-asset','rm01-t234-32g','N2','S2','N2','S2','migration-user','2026-01-01','2026-01-01'); INSERT INTO sample_requests(id,public_no,original_json,consent_json,requested_days,model_key,search_text,display_name,submitted_at,asset_id) VALUES('migration-request','RM01-1','{}','{}',1,'rm01-t234-32g','fixture','fixture','2026-01-01','migration-asset'); INSERT INTO sample_legacy_loans(id,asset_id,borrower,created_by,recorded_at,updated_at) VALUES('migration-legacy','migration-legacy-asset','fixture','migration-user','2026-01-01','2026-01-01'); INSERT INTO sample_allocations(asset_id,request_id,allocated_at,operation_id) VALUES('migration-asset','migration-request','2026-01-01','op1'); INSERT INTO sample_allocations(asset_id,legacy_loan_id,allocated_at,operation_id) VALUES('migration-legacy-asset','migration-legacy','2026-01-01','op2'); INSERT INTO sample_events(id,asset_id,action,details_json,occurred_at,recorded_at,operation_id) VALUES('migration-event','migration-asset','asset.created','{}','2026-01-01','2026-01-01','op3');",
        );
        assetMigrationBefore = await env.CASE_DB.prepare(
          "SELECT * FROM sample_assets ORDER BY id",
        ).all();
      }
      await env.CASE_DB.exec(sql);
      if (name === "0007_sample_no_repeat.sql") {
        assert.deepEqual(
          (await env.CASE_DB.prepare("SELECT * FROM sample_assets ORDER BY id").all()).results,
          assetMigrationBefore.results,
        );
        assert.deepEqual((await env.CASE_DB.prepare("PRAGMA foreign_key_check").all()).results, []);
        assert.equal((await env.CASE_DB.prepare("SELECT COUNT(*) AS n FROM sample_allocations").first()).n, 2);
        assert.equal((await env.CASE_DB.prepare("SELECT asset_id FROM sample_requests WHERE id='migration-request'").first()).asset_id, 'migration-asset');
        assert.equal((await env.CASE_DB.prepare("SELECT asset_id FROM sample_legacy_loans WHERE id='migration-legacy'").first()).asset_id, 'migration-legacy-asset');
        assert.equal((await env.CASE_DB.prepare("SELECT asset_id FROM sample_events WHERE id='migration-event'").first()).asset_id, 'migration-asset');
        await env.CASE_DB.exec(
          "DELETE FROM sample_events WHERE id='migration-event'; DELETE FROM sample_allocations; DELETE FROM sample_legacy_loans WHERE id='migration-legacy'; DELETE FROM sample_requests WHERE id='migration-request'; DELETE FROM sample_assets; DELETE FROM users WHERE id='migration-user';",
        );
      }
      if (name === "0005_sample_legacy_loans.sql") {
        const migrated = await env.CASE_DB.prepare(
          "SELECT * FROM sample_allocations WHERE asset_id='migration-asset'",
        ).first();
        assert.deepEqual(migrated, {
          asset_id: "migration-asset",
          request_id: "migration-request",
          legacy_loan_id: null,
          allocated_at: "2026-01-01",
          operation_id: "migration-operation",
        });
        await assert.rejects(
          env.CASE_DB.exec(
            "UPDATE sample_allocations SET request_id=NULL WHERE asset_id='migration-asset'",
          ),
        );
        await env.CASE_DB.exec(
          "DELETE FROM sample_allocations WHERE asset_id='migration-asset'; DELETE FROM sample_requests WHERE id='migration-request'; DELETE FROM sample_assets WHERE id='migration-asset'; DELETE FROM users WHERE id='migration-user';",
        );
      }
    }
    await env.CASE_DB.exec(
      "UPDATE access_settings SET ready=1; INSERT INTO users(id,username,role,password_mac,created_at,is_owner,must_change_password) VALUES('owner','admin','admin','unused',1,1,0),('reviewer','reviewer','admin','unused',1,0,0),('ordinary','ordinary','user','unused',1,0,0)",
    );
    for (const id of ["owner", "reviewer", "ordinary"])
      await env.CASE_DB.prepare(
        "INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)",
      )
        .bind(
          await digest(id.padEnd(48, "x")),
          id,
          Math.floor(Date.now() / 1000) + 86400,
        )
        .run();
    const legacyAsset = await api("/api/sample-admin/assets", {
      method: "POST",
      data: {
        modelKey: application.modelKey,
        no: "HIST-01",
        sn: "HIST-SN-01",
        legacyLoan: {
          borrower: "上线前借用方",
          contact: null,
          lentAt: null,
          dueAt: null,
          notes: "原纸质合同",
        },
      },
    });
    assert.equal(legacyAsset.status, 201);
    let inventory = (await api("/api/sample-admin/assets")).assets;
    let historic = inventory.find((a) => a.id === legacyAsset.id);
    assert.equal(historic.allocation.source, "legacy");
    assert.equal(historic.allocation.dueAt, null);
    assert.equal(
      (
        await api(
          "/api/sample-loans/availability?modelKey=" + application.modelKey,
        )
      ).availability,
      "unavailable",
    );
    const historyPath =
      "/api/sample-admin/assets/" + legacyAsset.id + "/legacy-loans";
    const historical = (await api(historyPath)).loans[0];
    assert.equal(historical.lentAt, null);
    assert.equal(historical.status, "active");
    const change = {
      modelKey: application.modelKey,
      no: "HIST-01",
      sn: "HIST-SN-01",
      expectedAssetVersion: historic.assetVersion,
      legacyLoan: {
        borrower: "更正后的借用方",
        contact: "联系人",
        lentAt: "2020-01-01T00:00:00.000Z",
        dueAt: "2020-02-01T00:00:00.000Z",
        notes: "补充资料",
      },
    };
    assert.equal(
      (
        await api("/api/sample-admin/assets/" + legacyAsset.id, {
          method: "PATCH",
          data: change,
        })
      ).status,
      200,
    );
    assert.equal(
      (
        await api("/api/sample-admin/assets/" + legacyAsset.id, {
          method: "PATCH",
          data: change,
        })
      ).status,
      409,
    );
    historic = (await api("/api/sample-admin/assets")).assets.find(
      (a) => a.id === legacyAsset.id,
    );
    assert.equal(
      (
        await api("/api/sample-admin/assets/" + legacyAsset.id, {
          method: "PATCH",
          data: {
            modelKey: application.modelKey,
            no: "HIST-01",
            sn: "CHANGED",
            expectedAssetVersion: historic.assetVersion,
          },
        })
      ).status,
      409,
    );
    const ending = historyPath + "/" + historical.id;
    const endData = {
      expectedAssetVersion: historic.assetVersion,
      occurredAt: "2020-03-01T00:00:00.000Z",
      reason: "实际归还",
      holdReason: "离线押金尚未结清",
    };
    const returnKey = crypto.randomUUID();
    assert.equal(
      (
        await api(ending + "/return", {
          method: "POST",
          data: endData,
          key: returnKey,
        })
      ).status,
      200,
    );
    assert.equal(
      (
        await api(ending + "/return", {
          method: "POST",
          data: endData,
          key: returnKey,
        })
      ).status,
      200,
      "replayed return must not execute twice",
    );
    assert.equal(
      (await api(ending + "/return", { method: "POST", data: endData })).status,
      404,
    );
    assert.equal(
      (
        await api(
          "/api/sample-loans/availability?modelKey=" + application.modelKey,
        )
      ).availability,
      "available",
    );
    await maintainData(env, { now: Date.parse("2031-01-01T00:00:00.000Z") });
    assert.equal(
      (await api(historyPath)).loans.length,
      1,
      "held historical data must remain",
    );
    historic = (await api("/api/sample-admin/assets")).assets.find(
      (a) => a.id === legacyAsset.id,
    );
    assert.equal(
      (
        await api(ending + "/preservation", {
          method: "POST",
          data: {
            expectedAssetVersion: historic.assetVersion,
            holdReason: null,
          },
        })
      ).status,
      200,
    );
    await maintainData(env, { now: Date.now() });
    assert.equal(
      (await api(historyPath)).loans.length,
      1,
      "newly recorded backdated returns must not be purged",
    );
    await maintainData(env, { now: Date.parse("2031-01-01T00:00:00.000Z") });
    assert.equal((await api(historyPath)).loans.length, 0);
    historic = (await api("/api/sample-admin/assets")).assets.find(
      (a) => a.id === legacyAsset.id,
    );
    assert.equal(
      (
        await api("/api/sample-admin/assets/" + historic.id, {
          method: "PATCH",
          data: {
            modelKey: application.modelKey,
            no: "HIST-01",
            sn: "HIST-SN-01",
            lifecycle: "retired",
            expectedAssetVersion: historic.assetVersion,
          },
        })
      ).status,
      200,
    );
    assert.equal(
      (await api("/api/sample-admin/assets", { cookie: null })).status,
      401,
    );
    assert.equal(
      (await api("/api/sample-admin/assets", { cookie: "reviewer" })).status,
      403,
    );
    assert.equal(
      (await api("/api/sample-admin/assets", { cookie: "ordinary" })).status,
      403,
    );
    assert.equal(
      (
        await api("/api/sample-admin/grants", {
          method: "POST",
          data: { userId: "reviewer", enabled: true },
        })
      ).status,
      200,
    );
    assert.equal(
      (await api("/api/sample-admin/assets", { cookie: "reviewer" })).status,
      200,
    );
    const asset = await api("/api/sample-admin/assets", {
      method: "POST",
      data: {
        modelKey: application.modelKey,
        no: " NO-a ",
        sn: "SN-a",
        notes: "验证样机",
      },
    });
    assert.equal(asset.status, 201, JSON.stringify(asset));
    const duplicate = await api("/api/sample-admin/assets", {
      method: "POST",
      data: {
        modelKey: application.modelKey,
        no: "no-A",
        sn: "other",
        notes: "",
      },
    });
    assert.equal(duplicate.status, 201, "same model and NO with a distinct SN is allowed");
    const duplicateSn = await api("/api/sample-admin/assets", {
      method: "POST",
      data: { modelKey: application.modelKey, no: "another-product", sn: "sn-A" },
    });
    assert.equal(duplicateSn.status, 409, "SN remains unique after normalization");
    assert.equal(duplicateSn.code, "DUPLICATE_SN");
    assert.equal(duplicateSn.fieldErrors.sn, "该 SN 已登记，请检查后重新填写");
    const editable = (await api("/api/sample-admin/assets")).assets.find(a => a.id === duplicate.id);
    for (const no of ["NEW-PRODUCT", "NO-A"]) {
      assert.equal((await api("/api/sample-admin/assets/" + duplicate.id, {
        method: "PATCH",
        data: { modelKey: application.modelKey, no, sn: "other", lifecycle: "retired", expectedAssetVersion: editable.assetVersion },
      })).status, 200, "editing a stopped machine to a shared NO is allowed");
      editable.assetVersion++;
    }
    const duplicateSnUpdate = await api(
      "/api/sample-admin/assets/" + duplicate.id,
      {
        method: "PATCH",
        data: {
          modelKey: application.modelKey,
          no: "NO-A",
          sn: "sn-A",
          lifecycle: "retired",
          expectedAssetVersion: editable.assetVersion,
        },
      },
    );
    assert.equal(duplicateSnUpdate.status, 409);
    assert.equal(duplicateSnUpdate.code, "DUPLICATE_SN");
    assert.deepEqual(duplicateSnUpdate.fieldErrors, duplicateSn.fieldErrors);
    const t = (await api("/api/sample-loans/terms", { cookie: null })).terms;
    const payload = {
      ...application,
      requestedDays: 1,
      consent: {
        termsVersion: t.version,
        noticeVersion: t.noticeVersion,
        accepted: true,
        noStockShown: false,
      },
    };
    const beforeInvalid = await env.CASE_DB.prepare("SELECT COUNT(*) AS n FROM sample_requests").first();
    for (const creditCode of [undefined, null, "", "   "]) {
      const invalid = await api("/api/sample-loans/applications", {
        method: "POST", cookie: null,
        data: { ...payload, applicant: { ...payload.applicant, creditCode } },
      });
      assert.equal(invalid.status, 422);
      assert.ok(invalid.fieldErrors["applicant.creditCode"], JSON.stringify(invalid));
    }
    assert.deepEqual(await env.CASE_DB.prepare("SELECT COUNT(*) AS n FROM sample_requests").first(), beforeInvalid);
    for (const requestedDays of [0, 31, 1.5, Number.MAX_SAFE_INTEGER]) {
      const invalid = await api("/api/sample-loans/applications", {
        method: "POST",
        cookie: null,
        data: { ...payload, requestedDays },
      });
      assert.equal(invalid.status, 422);
      assert.ok(invalid.fieldErrors.requestedDays);
    }
    for (const modelKey of [
      "constructor",
      "__proto__",
      [application.modelKey],
    ]) {
      assert.equal(
        (
          await api("/api/sample-loans/applications", {
            method: "POST",
            cookie: null,
            data: { ...payload, modelKey },
          })
        ).status,
        422,
      );
      assert.equal(
        (
          await api("/api/sample-admin/assets", {
            method: "POST",
            data: { modelKey, no: "invalid", sn: "invalid" },
          })
        ).status,
        422,
      );
    }
    for (const modelKey of ["constructor", "__proto__"])
      assert.equal(
        (
          await api("/api/sample-loans/availability?modelKey=" + modelKey, {
            cookie: null,
          })
        ).status,
        422,
      );
    for (const modelKey of [
      "rm01-t234-32g",
      "rm01-t234-64g",
      "rm01-t4000-64g",
      "rm01-t5000-128g",
    ])
      assert.equal(
        (
          await api("/api/sample-loans/availability?modelKey=" + modelKey, {
            cookie: null,
          })
        ).status,
        200,
      );
    const key = crypto.randomUUID(),
      one = await api("/api/sample-loans/applications", {
        method: "POST",
        data: payload,
        cookie: null,
        key,
      }),
      same = await api("/api/sample-loans/applications", {
        method: "POST",
        data: payload,
        cookie: null,
        key,
      });
    assert.equal(one.status, 201, JSON.stringify(one));
    assert.equal(one.id, same.id);
    const previousClauses = terms.clauses,
      previousVersion = terms.version;
    try {
      terms.version = "NEXT-TERMS-VERSION";
      const replayOld = await api("/api/sample-loans/applications", {
        method: "POST",
        data: payload,
        cookie: null,
        key,
      });
      assert.equal(replayOld.id, one.id);
      assert.equal(
        (
          await api("/api/sample-loans/applications", {
            method: "POST",
            data: payload,
            cookie: null,
          })
        ).code,
        "TERMS_CHANGED",
      );
      terms.version = previousVersion;
      terms.clauses += "\n变更条款但未更新版本号";
      const replay = await api("/api/sample-loans/applications", {
        method: "POST",
        data: payload,
        cookie: null,
        key,
      });
      assert.equal(replay.id, one.id);
      const collision = await api("/api/sample-loans/applications", {
        method: "POST",
        data: payload,
        cookie: null,
      });
      assert.equal(collision.code, "TERMS_VERSION_CONFLICT");
      assert.equal(
        (
          await env.CASE_DB.prepare(
            "SELECT COUNT(*) AS n FROM sample_requests",
          ).first()
        ).n,
        1,
      );
    } finally {
      terms.clauses = previousClauses;
      terms.version = previousVersion;
    }
    const two = await api("/api/sample-loans/applications", {
      method: "POST",
      data: { ...payload, requestedDays: 30 },
      cookie: null,
    });
    assert.equal(two.status, 201);
    assert.notEqual(one.publicNo, two.publicNo);
    const personal = await api("/api/sample-loans/applications", {
      method: "POST", cookie: null, ip: "192.0.2.17",
      data: { ...payload, applicant: { ...application.applicant, type: "person", creditCode: null, registeredAddress: null } },
    });
    assert.equal(personal.status, 201);
    const personalDraft = await api(`/api/sample-admin/requests/${personal.id}/draft`, {
      method: "POST",
      data: { expectedRowVersion: 1, draft: { applicant: { type: "person", creditCode: null } } },
    });
    assert.equal(personalDraft.status, 200);
    const switched = await api(`/api/sample-admin/requests/${personal.id}/draft`, {
      method: "POST",
      data: { expectedRowVersion: personalDraft.request.rowVersion, draft: { applicant: { type: "company", creditCode: null } } },
    });
    assert.equal(switched.status, 422);
    assert.ok(switched.fieldErrors["applicant.creditCode"]);
    const d = draft();
    delete d.requestedDays;
    d.schedule.dueAt = new Date(
      Date.parse(d.schedule.dueAt) + 30 * 86400000,
    ).toISOString();
    const command = {
      expectedRowVersion: 1,
      expectedAssetVersion: 1,
      assetId: asset.id,
      fileIds: [],
      draft: d,
    };
    for (const modelKey of ["constructor", "__proto__"]) {
      assert.equal(
        (
          await api(`/api/sample-admin/requests/${one.id}/draft`, {
            method: "POST",
            data: { expectedRowVersion: 1, draft: { modelKey } },
          })
        ).status,
        422,
      );
      assert.equal(
        (
          await api(`/api/sample-admin/requests/${one.id}/approve`, {
            method: "POST",
            data: { ...command, draft: { ...d, modelKey } },
          })
        ).status,
        422,
      );
    }
    for (const creditCode of [undefined, null, "", "   "]) {
      for (const action of ["draft", "approve"]) {
        const invalid = await api(`/api/sample-admin/requests/${one.id}/${action}`, {
          method: "POST",
          data: { ...(action === "draft" ? { expectedRowVersion: 1 } : command), draft: { ...d, applicant: { ...d.applicant, creditCode } } },
        });
        assert.equal(invalid.status, 422);
        assert.ok(invalid.fieldErrors["applicant.creditCode"], JSON.stringify(invalid));
      }
    }
    const unchanged = await api(`/api/sample-admin/requests/${one.id}`);
    assert.equal(unchanged.request.rowVersion, 1);
    assert.equal(unchanged.request.original.applicant.creditCode, application.applicant.creditCode);
    const saved = await api(`/api/sample-admin/requests/${one.id}/draft`, {
      method: "POST",
      data: { expectedRowVersion: 1, draft: { applicant: { type: "company", creditCode: application.applicant.creditCode } } },
    });
    assert.equal(saved.status, 200);
    assert.equal(saved.request.draft.draft.applicant.creditCode, application.applicant.creditCode);
    command.expectedRowVersion = saved.request.rowVersion;
    const race = await Promise.all([
      api(`/api/sample-admin/requests/${one.id}/approve`, {
        method: "POST",
        data: command,
      }),
      api(`/api/sample-admin/requests/${two.id}/approve`, {
        method: "POST",
        data: { ...command, expectedRowVersion: 1 },
      }),
    ]);
    assert.deepEqual(
      race.map((r) => r.status).sort(),
      [200, 409],
      JSON.stringify(race),
    );
    const winner = race.find((r) => r.status === 200).request;
    assert.ok(winner.initialTermDays > 30);
    assert.equal(winner.currentAgreementRevision, 1);
    assert.equal(
      winner.agreement.equipment.defaultAccountInfo,
      d.equipment.defaultAccountInfo,
    );
    assert.equal(winner.agreement.billingBasis.value.amountMinor, "5000000");
    // A queue outage must not skip maintenance or claim a successful scheduler pass.
    await env.CASE_DB.exec(
      "INSERT INTO sample_counters(name,value) VALUES('last_scheduler_ms',1)",
    );
    const queueFailure = new Error("isolated queue failure");
    await assert.rejects(
      repairJobs({
        ...env,
        SAMPLE_JOBS: {
          async send() {
            throw queueFailure;
          },
        },
      }),
      (e) => e instanceof AggregateError && e.errors.includes(queueFailure),
    );
    assert.ok(
      await env.CASE_DB.prepare(
        "SELECT value FROM sample_counters WHERE name='orphan_sweep_day'",
      ).first(),
    );
    assert.equal(
      (
        await env.CASE_DB.prepare(
          "SELECT value FROM sample_counters WHERE name='last_scheduler_ms'",
        ).first()
      ).value,
      1,
    );
    await env.CASE_DB.exec(
      "DELETE FROM sample_counters WHERE name='orphan_sweep_day'; INSERT INTO sample_security_events(id,action,occurred_at) VALUES('scheduler-expired','test','2000-01-01T00:00:00.000Z'); CREATE TRIGGER scheduler_maintenance_failure BEFORE DELETE ON sample_security_events WHEN OLD.id='scheduler-expired' BEGIN SELECT RAISE(ABORT,'isolated maintenance failure'); END;",
    );
    let sent = 0;
    await assert.rejects(
      repairJobs({
        ...env,
        SAMPLE_JOBS: {
          async send() {
            sent++;
          },
        },
      }),
      AggregateError,
    );
    assert.ok(sent > 0);
    assert.equal(
      await env.CASE_DB.prepare(
        "SELECT value FROM sample_counters WHERE name='orphan_sweep_day'",
      ).first(),
      null,
    );
    assert.equal(
      (
        await env.CASE_DB.prepare(
          "SELECT value FROM sample_counters WHERE name='last_scheduler_ms'",
        ).first()
      ).value,
      1,
    );
    await env.CASE_DB.exec("DROP TRIGGER scheduler_maintenance_failure");
    await repairJobs(env);
    assert.ok(
      (
        await env.CASE_DB.prepare(
          "SELECT value FROM sample_counters WHERE name='last_scheduler_ms'",
        ).first()
      ).value > 1,
    );
    assert.equal(
      (
        await api(
          "/api/sample-loans/availability?modelKey=" + application.modelKey,
          { cookie: null },
        )
      ).availability,
      "unavailable",
    );
    assert.equal(
      (await api(`/api/sample-admin/requests/${winner.id}/versions/1/delivery`))
        .code,
      "DOCUMENT_NOT_READY",
    );
    // The consumer may acquire a failed job between the retry read and its transaction.
    await env.CASE_DB.prepare(
      "UPDATE sample_jobs SET status='retry_wait' WHERE request_id=?",
    )
      .bind(winner.id)
      .run();
    const racingDb = {
      prepare: env.CASE_DB.prepare.bind(env.CASE_DB),
      batch: async (statements) => {
        await env.CASE_DB.prepare(
          "UPDATE sample_jobs SET status='processing' WHERE request_id=?",
        )
          .bind(winner.id)
          .run();
        return env.CASE_DB.batch(statements);
      },
    };
    const retry = await handleSampleApi(
      new Request(
        origin + `/api/sample-admin/requests/${winner.id}/versions/1/retry`,
        {
          method: "POST",
          headers: {
            Origin: origin,
            Cookie: "rminte_local_session=" + "owner".padEnd(48, "x"),
            "Content-Type": "application/json",
            "Idempotency-Key": crypto.randomUUID(),
          },
          body: JSON.stringify({ expectedRowVersion: winner.rowVersion }),
        },
      ),
      { ...env, CASE_DB: racingDb },
    );
    assert.equal(retry.status, 409);
    assert.equal(
      (
        await env.CASE_DB.prepare(
          "SELECT status FROM sample_jobs WHERE request_id=?",
        )
          .bind(winner.id)
          .first()
      ).status,
      "processing",
    );
    const cancelled = await api(
      `/api/sample-admin/requests/${winner.id}/cancel`,
      {
        method: "POST",
        data: { expectedRowVersion: winner.rowVersion, reason: "暂缓未发出" },
      },
    );
    assert.equal(cancelled.request.status, "cancelled");
    const late = await api(
      `/api/sample-admin/requests/${winner.id}/finances/receipts`,
      {
        method: "POST",
        data: {
          expectedRowVersion: cancelled.request.rowVersion,
          money: { currency: "CNY", amountMinor: "3000000" },
          occurredAt: new Date().toISOString(),
          reference: "BANK-001",
          quoteId: winner.quotes[0].id,
          purpose: "deposit",
          note: "取消后真实到账",
        },
      },
    );
    assert.equal(late.status, 200, JSON.stringify(late));
    assert.equal(late.request.status, "cancelled");
    assert.equal(late.request.finance.byCurrency.CNY.balanceMinor, "3000000");
    assert.equal(
      (
        await api(
          "/api/sample-loans/availability?modelKey=" + application.modelKey,
          { cookie: null },
        )
      ).availability,
      "available",
    );
    const wrong = await api(
      `/api/sample-admin/requests/${winner.id}/finances/refunds`,
      {
        method: "POST",
        data: {
          expectedRowVersion: late.request.rowVersion,
          money: { currency: "CNY", amountMinor: "3000001" },
          occurredAt: new Date().toISOString(),
          reference: "OUT-001",
          note: "超额计划",
        },
      },
    );
    assert.equal(wrong.code, "REFUND_EXCEEDS_BALANCE");
    const refundData = {
        expectedRowVersion: late.request.rowVersion,
        money: { currency: "CNY", amountMinor: "1000000" },
        occurredAt: new Date().toISOString(),
        reference: "OUT-002",
        note: "部分原币退还",
      },
      refundKey = crypto.randomUUID();
    const partial = await api(
      `/api/sample-admin/requests/${winner.id}/finances/refunds`,
      { method: "POST", data: refundData, key: refundKey },
    );
    assert.equal(
      partial.request.finance.byCurrency.CNY.balanceMinor,
      "2000000",
    );
    const repeat = await api(
      `/api/sample-admin/requests/${winner.id}/finances/refunds`,
      { method: "POST", data: refundData, key: refundKey },
    );
    assert.equal(repeat.status, 200);
    assert.equal(
      repeat.request.entries.filter((e) => e.kind === "refund").length,
      1,
    );
    const moneyChange = async (action, data) => {
      const current = (await api(`/api/sample-admin/requests/${winner.id}`))
        .request;
      const response = await api(
        `/api/sample-admin/requests/${winner.id}/finances/${action}`,
        {
          method: "POST",
          data: { ...data, expectedRowVersion: current.rowVersion },
        },
      );
      assert.equal(response.status, 200, JSON.stringify(response));
      return response;
    };
    await moneyChange("reversal", {
      money: refundData.money,
      occurredAt: new Date().toISOString(),
      note: "纠正退款录入",
      reversesEntryId: partial.entryId,
      confirmedRecordingError: true,
    });
    const correctedRefund = await moneyChange("refunds", {
      ...refundData,
      money: { currency: "CNY", amountMinor: "2000000" },
    });
    assert.equal(
      correctedRefund.request.finance.byCurrency.CNY.refundedMinor,
      "2000000",
    );
    assert.equal(
      correctedRefund.request.entries.filter((e) => e.reference === "OUT-002")
        .length,
      2,
    );
    const unmatched = await moneyChange("receipts", {
      money: { currency: "CNY", amountMinor: "1" },
      occurredAt: new Date().toISOString(),
      reference: "UNMATCHED-001",
      purpose: "unmatched",
    });
    const classified = await moneyChange("reconcile", {
      sourceEntryId: unmatched.entryId,
      purpose: "deposit",
      quoteId: winner.quotes[0].id,
      note: "首次核对",
    });
    const undone = await moneyChange("reversal", {
      money: { currency: "CNY", amountMinor: "0" },
      occurredAt: new Date().toISOString(),
      note: "纠正用途核对",
      reversesEntryId: classified.entryId,
      confirmedRecordingError: true,
    });
    assert.equal(undone.request.finance.reconciliation, true);
    const reclassified = await moneyChange("reconcile", {
      sourceEntryId: unmatched.entryId,
      purpose: "refund_only",
      note: "仅退款，未计入足额押金",
    });
    assert.equal(reclassified.request.finance.reconciliation, false);
    const listed = (
      await api("/api/sample-admin/requests?status=all")
    ).requests.find((r) => r.id === winner.id);
    assert.deepEqual(listed.depositDue, winner.agreement.quote.deposit);
    assert.equal(listed.financialClosedAt, null);
    await api("/api/sample-admin/grants", {
      method: "POST",
      data: { userId: "reviewer", enabled: false },
    });
    assert.equal(
      (
        await api(`/api/sample-admin/requests/${winner.id}`, {
          cookie: "reviewer",
        })
      ).status,
      403,
    );
    const calendar = {
      validFrom: "2026-01-01",
      validUntil: "2027-12-31",
      holidays: ["2026-11-02"],
      workingDates: ["2026-10-31"],
    };
    assert.equal(
      (
        await api("/api/sample-admin/calendar", {
          method: "POST",
          data: calendar,
        })
      ).status,
      200,
    );
    assert.equal(
      workingDeadline("2026-10-30T04:00:00.000Z", calendar),
      "2026-11-06T15:59:59.000Z",
    );
    assert.equal(workingDeadline("2028-01-01T04:00:00.000Z", calendar), null);
    const expired = await api("/api/sample-loans/applications", {
      method: "POST",
      data: payload,
      cookie: null,
    });
    const cancelledOld = await api(
      `/api/sample-admin/requests/${expired.id}/cancel`,
      {
        method: "POST",
        data: { expectedRowVersion: 1, reason: "资料保留期限测试" },
      },
    );
    assert.equal(cancelledOld.status, 200);
    await env.CASE_DB.prepare(
      "UPDATE sample_requests SET closed_at='2020-01-01T00:00:00.000Z' WHERE id=?",
    )
      .bind(expired.id)
      .run();
    // Older unresolved balances must not occupy the entire cleanup page forever.
    const blocked = [];
    for (let i = 0; i < 51; i++) {
      const id = "cleanup-unresolved-" + i;
      blocked.push(
        env.CASE_DB.prepare(
          "INSERT INTO sample_requests(id,public_no,status,original_json,consent_json,requested_days,model_key,search_text,display_name,submitted_at,closed_at) SELECT ?,?,'cancelled',original_json,consent_json,requested_days,model_key,search_text,display_name,submitted_at,'2019-01-01T00:00:00.000Z' FROM sample_requests WHERE id=?",
        ).bind(id, id, expired.id),
      );
      blocked.push(
        env.CASE_DB.prepare(
          "INSERT INTO sample_financial_projections VALUES(?,?,?)",
        ).bind(id, '{"balanced":false}', new Date().toISOString()),
      );
    }
    await env.CASE_DB.batch(blocked);
    const firstPass = await maintainData(env);
    assert.equal(firstPass.marked, 1);
    assert(
      await env.CASE_DB.prepare("SELECT id FROM sample_requests WHERE id=?")
        .bind(expired.id)
        .first(),
    );
    const secondPass = await maintainData(env, {
      now: Date.now() + 2 * 86400000,
    });
    assert.equal(secondPass.purged, 1);
    assert.equal(
      await env.CASE_DB.prepare("SELECT id FROM sample_requests WHERE id=?")
        .bind(expired.id)
        .first(),
      null,
    );
    const held = await api("/api/sample-loans/applications", {
      method: "POST",
      data: payload,
      cookie: null,
    });
    await api(`/api/sample-admin/requests/${held.id}/cancel`, {
      method: "POST",
      data: { expectedRowVersion: 1, reason: "争议资料" },
    });
    await env.CASE_DB.prepare(
      "UPDATE sample_requests SET closed_at='2020-01-01T00:00:00.000Z' WHERE id=?",
    )
      .bind(held.id)
      .run();
    const heldVersion = (await api(`/api/sample-admin/requests/${held.id}`))
      .request.rowVersion;
    assert.equal(
      (
        await api(`/api/sample-admin/requests/${held.id}/preservation`, {
          method: "POST",
          data: {
            expectedRowVersion: heldVersion,
            enabled: true,
            reason: "争议尚未结束",
          },
        })
      ).status,
      200,
    );
    await env.CASE_DB.prepare(
      "UPDATE sample_requests SET closed_at='2020-01-01T00:00:00.000Z' WHERE id=?",
    )
      .bind(winner.id)
      .run();
    await maintainData(env, { now: Date.now() + 3 * 86400000 });
    assert.equal(
      (
        await env.CASE_DB.prepare(
          "SELECT purge_after_at FROM sample_requests WHERE id=?",
        )
          .bind(held.id)
          .first()
      ).purge_after_at,
      null,
    );
    assert.equal(
      (
        await env.CASE_DB.prepare(
          "SELECT purge_after_at FROM sample_requests WHERE id=?",
        )
          .bind(winner.id)
          .first()
      ).purge_after_at,
      null,
    );
    const beforeFailure = (await api(`/api/sample-admin/requests/${winner.id}`))
      .request;
    await env.CASE_DB.exec(
      "CREATE TRIGGER sample_late_failure BEFORE INSERT ON sample_events WHEN NEW.action='finance.receipts' BEGIN SELECT RAISE(ABORT,'injected late failure'); END",
    );
    const injected = {
      expectedRowVersion: beforeFailure.rowVersion,
      money: { currency: "CNY", amountMinor: "1" },
      occurredAt: new Date().toISOString(),
      reference: "ROLLBACK-001",
      quoteId: winner.quotes[0].id,
      purpose: "deposit",
      note: "隔离故障注入",
    };
    const rollback = await api(
      `/api/sample-admin/requests/${winner.id}/finances/receipts`,
      { method: "POST", data: injected },
    );
    assert.equal(rollback.status, 503);
    assert.equal(
      (await api(`/api/sample-admin/requests/${winner.id}`)).request.rowVersion,
      beforeFailure.rowVersion,
    );
    assert.equal(
      (
        await env.CASE_DB.prepare(
          "SELECT COUNT(*) AS n FROM sample_financial_entries WHERE reference='ROLLBACK-001'",
        ).first()
      ).n,
      0,
    );
    await env.CASE_DB.exec("DROP TRIGGER sample_late_failure");
    // A legacy registration and a normal approval must compete for the same physical asset.
    const raceAsset = await api("/api/sample-admin/assets", {
      method: "POST",
      data: {
        modelKey: application.modelKey,
        no: "CROSS-RACE",
        sn: "CROSS-RACE",
      },
    });
    const pending = { id: winner.id === one.id ? two.id : one.id };
    const legacyRace = await Promise.all([
      api("/api/sample-admin/assets/" + raceAsset.id, {
        method: "PATCH",
        data: {
          modelKey: application.modelKey,
          no: "CROSS-RACE",
          sn: "CROSS-RACE",
          expectedAssetVersion: 1,
          legacyLoan: { borrower: "线下借用方" },
        },
      }),
      api("/api/sample-admin/requests/" + pending.id + "/approve", {
        method: "POST",
        data: { ...command, assetId: raceAsset.id, draft: d },
      }),
    ]);
    assert.deepEqual(
      legacyRace.map((r) => r.status).sort(),
      [200, 409],
      JSON.stringify(legacyRace),
    );
    const occupied = (await api("/api/sample-admin/assets")).assets.find(
      (a) => a.id === raceAsset.id,
    );
    assert.ok(occupied.allocation);
    assert.equal(
      (
        await env.CASE_DB.prepare(
          "SELECT COUNT(*) AS n FROM sample_allocations WHERE asset_id=?",
        )
          .bind(raceAsset.id)
          .first()
      ).n,
      1,
    );
    // Loss, erroneous registration, permissions, and later re-loaning preserve independent histories.
    const manual = await api("/api/sample-admin/assets", {
      method: "POST",
      data: {
        modelKey: application.modelKey,
        no: "LEGACY-END",
        sn: "LEGACY-END",
        legacyLoan: { borrower: "历史借用方" },
      },
    });
    const endingPath =
      "/api/sample-admin/assets/" + manual.id + "/legacy-loans";
    let endedLoan = (await api(endingPath)).loans[0];
    assert.equal(
      (
        await api(endingPath + "/" + endedLoan.id + "/loss", {
          method: "POST",
          cookie: "ordinary",
          data: {},
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await api("/api/sample-admin/grants", {
          method: "POST",
          data: { userId: "reviewer", enabled: true },
        })
      ).status,
      200,
    );
    assert.equal(
      (
        await api(endingPath + "/" + endedLoan.id + "/preservation", {
          method: "POST",
          cookie: "reviewer",
          data: { expectedAssetVersion: 1, holdReason: "hold" },
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await api(endingPath + "/" + endedLoan.id + "/loss", {
          method: "POST",
          data: {
            expectedAssetVersion: 1,
            occurredAt: new Date().toISOString(),
            reason: "已核实丢失",
          },
        })
      ).status,
      200,
    );
    let manualAsset = (await api("/api/sample-admin/assets")).assets.find(
      (a) => a.id === manual.id,
    );
    assert.equal(manualAsset.lifecycle, "lost");
    assert.equal(manualAsset.allocation, null);
    assert.equal(
      (
        await api("/api/sample-admin/assets/" + manual.id, {
          method: "PATCH",
          data: {
            modelKey: application.modelKey,
            no: "LEGACY-END",
            sn: "LEGACY-END",
            expectedAssetVersion: manualAsset.assetVersion,
            lifecycle: "active",
            notes: "找回后已检查",
            legacyLoan: { borrower: "再次借用方" },
          },
        })
      ).status,
      200,
    );
    manualAsset = (await api("/api/sample-admin/assets")).assets.find(
      (a) => a.id === manual.id,
    );
    const newer = (await api(endingPath)).loans.find(
      (l) => l.status === "active",
    );
    assert.equal(
      (
        await api(endingPath + "/" + endedLoan.id + "/correct", {
          method: "POST",
          data: {
            expectedAssetVersion: manualAsset.assetVersion,
            reason: "不能撤销旧记录",
          },
        })
      ).status,
      404,
    );
    assert.equal(
      (
        await api(endingPath + "/" + newer.id + "/correct", {
          method: "POST",
          data: {
            expectedAssetVersion: manualAsset.assetVersion,
            reason: "本次登记有误",
          },
        })
      ).status,
      200,
    );
    assert.deepEqual(
      (await api(endingPath)).loans.map((l) => l.status).sort(),
      ["corrected", "lost"],
    );
    // Physical endings must not bypass the owner-only archive hold operation.
    for (const action of ["return", "loss", "correct"]) {
      const heldAsset = await api("/api/sample-admin/assets", {
        method: "POST",
        data: {
          modelKey: application.modelKey,
          no: "HOLD-" + action,
          sn: "HOLD-" + action,
          legacyLoan: { borrower: "保留档案的借用方" },
        },
      });
      assert.equal(heldAsset.status, 201);
      const history = `/api/sample-admin/assets/${heldAsset.id}/legacy-loans`,
        loan = (await api(history)).loans[0],
        path = history + "/" + loan.id,
        holdReason = "押金争议未结清";
      assert.equal(
        (await api(path + "/preservation", {
          method: "POST",
          data: { expectedAssetVersion: 1, holdReason },
        })).status,
        200,
      );
      assert.equal(
        (await api(path + "/preservation", {
          method: "POST",
          cookie: "reviewer",
          data: { expectedAssetVersion: 2, holdReason: null },
        })).status,
        403,
      );
      assert.equal(
        (await api(path + "/" + action, {
          method: "POST",
          cookie: "reviewer",
          data: {
            expectedAssetVersion: 2,
            occurredAt: new Date().toISOString(),
            reason: "已核实实物状态",
            holdReason: action === "loss" ? "试图覆盖原保留原因" : null,
          },
        })).status,
        200,
      );
      assert.equal((await api(history)).loans[0].holdReason, holdReason);
      const asset = (await api("/api/sample-admin/assets")).assets.find(
        (a) => a.id === heldAsset.id,
      );
      assert.equal(asset.allocation, null);
      assert.equal(asset.lifecycle, action === "loss" ? "lost" : "active");
      await maintainData(env, { now: Date.parse("2031-01-01T00:00:00.000Z") });
      assert.equal((await api(history)).loans.length, 1);
      assert.equal(
        (await api(path + "/preservation", {
          method: "POST",
          data: { expectedAssetVersion: 3, holdReason: null },
        })).status,
        200,
      );
      await maintainData(env, { now: Date.parse("2031-01-01T00:00:00.000Z") });
      assert.equal((await api(history)).loans.length, 0);
    }
    const old = await api(
      `/api/sample-admin/requests/${winner.id}/versions/1/preview`,
    );
    assert.equal(
      old.snapshot.equipment.defaultAccountInfo,
      d.equipment.defaultAccountInfo,
    );
  } finally {
    await platform.dispose();
    rmSync(root, { recursive: true, force: true });
  }
});

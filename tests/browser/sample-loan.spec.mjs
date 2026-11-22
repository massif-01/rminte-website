import { test, expect } from "@playwright/test";
import { run, afterURL, setup, loginFixture } from "./helpers.mjs";
import { readFileSync } from "node:fs";
import { application, draft } from "../../services/sample-loan/tests/fixtures.mjs";
import { MODELS } from "../../website/sample-loan/fields.mjs";

async function chooseModel(form, key) {
  await form.locator("[name=model]").locator("..").locator(".select-trigger").click();
  await form.getByRole("option", { name: MODELS[key], exact: true }).click();
}

async function fillApproval(form) {
  const today = new Date().toISOString().slice(0, 10);
  const due = new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10);
  for (const [key, value] of Object.entries({
    identityNotes: "隔离浏览器核验记录",
    start: today + "T12:00",
    end: due,
    value: "50000.00",
    cardSpecs: "测试卡 1TB PCIe",
    cardSerial: "CARD-BROWSER-001",
    defaultAccountInfo: "用户 test\n密码 a | $& <xx> ",
    accessories: "主机、电源、存储卡及包装",
    inspection: "外观无损、功能正常、配件齐全",
    carrier: "顺丰",
    tracking: "BROWSER-TRACK",
    insuranceProof: "BROWSER-INSURED",
    returnName: "样机收件处",
  }))
    await form.locator(`[name=${key}]`).fill(value);
}

if (run.scope.sampleLoan)
  test("sample loan: public application, approval and machine allocation", async ({
    page,
  }, testInfo) => {
    const server = { url: afterURL },
      errors = [];
    await setup(page, "zh");
    await page.setViewportSize({ width: 1440, height: 900 });
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(server.url + "/?lang=zh");
    await page.locator("[data-contact-toggle]").scrollIntoViewIfNeeded();
    await page.locator("[data-contact-toggle]").click();
    await page.locator("[data-sample-loan-open]").click();
    const app = page.locator("[data-sample-loan-host]");
    await app.locator("#application-dialog").waitFor({ state: "visible" });
    const applicationStyles = await app
      .locator('link[rel="stylesheet"]')
      .evaluateAll((links) => links.map((link) => link.href));
    await page.evaluate(() => document.fonts.ready);

    await app.locator("#application-form button[type=submit]").click();
    await expect(app.locator("[aria-invalid=true]")).toHaveCount(12);
    for (const [key, value] of Object.entries({
      company: "集成浏览器验证公司",
      credit: "91510100MA00000000",
      contact: "测试联系人",
      phone: "+86 13800000000",
      email: "dealer@example.com",
      registeredAddress: "成都高新区注册地址",
      companyAddress: "成都联系地址",
      receiver: "测试收件人",
      receiverPhone: "+86 13800000000",
      shippingAddress: "成都收货地址",
      days: "15",
    }))
      await app.locator(`[name=${key}]`).fill(value);
    const model = app
      .locator("[name=model]")
      .locator("..")
      .locator(".select-trigger");
    await model.click();
    await app
      .getByRole("option", {
        name: "RM-01 128G T5000 ( 2070 TFLOPS )",
        exact: true,
      })
      .click();
    for (const empty of ["", "   "]) {
      await app.locator("[name=credit]").fill(empty);
      await app.locator("#application-form button[type=submit]").click();
      await expect(app.locator("#confirmation-dialog")).not.toBeVisible();
      await expect(app.locator("[name=credit]")).toHaveAttribute("aria-invalid", "true");
    }
    await app.locator("[name=credit]").fill("91510100MA00000000");
    await app.locator("[name=days]").fill("31");
    await app.locator("#application-form button[type=submit]").click();
    await expect(app.locator("#confirmation-dialog")).not.toBeVisible();
    await expect(app.locator("[name=days]")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(app.locator(".field-error[data-auto]")).toContainText("1—30");
    await app.locator("[name=days]").fill("1");
    await app.locator("#application-form button[type=submit]").click();
    await expect(app.locator("#confirmation-dialog")).toBeVisible();
    await app.locator("#confirmation-dialog .contact-close").click();
    await app.locator("[name=days]").fill("30");
    await app.locator("#application-form button[type=submit]").click();
    await expect(app.locator("#confirmation-dialog")).toBeVisible();
    // Bypass the client boundary in transit and observe the actual server error in the form.
    await page.route(
      "**/api/sample-loans/applications",
      (route) =>
        route.continue({
          postData: JSON.stringify({
            ...route.request().postDataJSON(),
            requestedDays: 31,
          }),
        }),
      { times: 1 },
    );
    await app.locator("#confirm-application").click();
    await expect(app.locator("[name=days]")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await app.locator("[name=days]").fill("30");
    await app.locator("#application-form button[type=submit]").click();
    await expect(app.locator("[aria-invalid=true]")).toHaveCount(0);

    await app.locator("#confirmation-dialog").waitFor({ state: "visible" });
    await app.locator("#confirm-application").click();
    await app.locator("#application-success").waitFor({ state: "visible" });

    const requestNo = await app.locator("#success-id").innerText();
    await app.locator("#application-success [data-close]").click();
    await page.goto(afterURL + "/cases/");
    await page.locator("#access [data-action=login]").click();
    const password = readFileSync(
      process.env.RMINTE_AFTER_FIXTURE +
        "/services/case-access/.local/admin-login.txt",
      "utf8",
    ).match(/密码：(.*)/)[1];
    await page.getByLabel("用户名", { exact: true }).fill("admin");
    await page.getByLabel("密码", { exact: true }).fill(password);
    await page.getByRole("button", { name: "登录", exact: true }).click();
    await expect(
      page.locator('#access a[href="/sample-loan/#admin"]'),
    ).toBeVisible();
    await page.goto(server.url + "/sample-loan/#admin");
    const adminStyles = await page
      .locator('link[rel="stylesheet"]')
      .evaluateAll((links) =>
        links
          .map((link) => link.href)
          .filter((href) =>
            /\/sample-loan\/(preview|operations)\.css/.test(href),
          ),
      );
    expect(adminStyles).toEqual(applicationStyles);
    await page.locator("[data-request]").first().waitFor();
    await page.locator("[data-request]").filter({ hasText: requestNo }).click();
    await page.locator("#admin-detail").waitFor({ state: "visible" });

    await expect(page.locator("#approval-form [name=company]")).toHaveValue(
      "集成浏览器验证公司",
    );
    await page.locator("[data-admin-tab=machines]").click();
    await page.locator("#new-machine").click();
    const mf = page.locator("#machine-form");
    const machineNo = "BROWSER-NO-" + crypto.randomUUID();
    const machineSn = "BROWSER-SN-" + crypto.randomUUID();
    await mf.locator("[name=no]").fill(machineNo);
    await mf.locator("[name=sn]").fill(machineSn);
    await mf.locator("[name=notes]").fill("存储卡、电源与包装齐全");
    const actualModel = "rm01-t234-64g";
    const replacementModel = "rm01-t4000-64g";
    const replacementNo = "SN-CONFLICT-" + crypto.randomUUID();
    const replacementNotes = "主机、电源及收纳箱";
    await chooseModel(mf, actualModel);
    const registered = await page.request.post(
      server.url + "/api/sample-admin/assets",
      {
        headers: { Origin: server.url, "Idempotency-Key": crypto.randomUUID() },
        data: {
          modelKey: replacementModel,
          no: replacementNo,
          sn: machineSn,
          notes: replacementNotes,
        },
      },
    );
    expect(registered.status()).toBe(201);
    await mf.locator("button[type=submit]").click();
    await expect(mf.locator("[name=sn]")).toBeFocused();
    await expect(mf.locator("[name=sn]")).toHaveAttribute("aria-invalid", "true");
    await expect(mf.locator(".field-error[data-auto]")).toHaveText(
      "该 SN 已登记，请检查后重新填写",
    );
    await mf.locator("[name=sn]").fill(machineSn + "-CORRECTED");
    await expect(mf.locator(".field-error[data-auto]")).toHaveCount(0);
    await mf.locator("button[type=submit]").click();
    await page.locator("#machine-dialog").waitFor({ state: "hidden" });
    await page.locator("[data-admin-tab=requests]").click();
    let releaseDetail;
    const heldDetail = new Promise((resolve) => (releaseDetail = resolve));
    await page.route(
      "**/api/sample-admin/requests/*",
      async (route) => {
        await heldDetail;
        await route.continue();
      },
      { times: 1 },
    );
    const detailRequest = page.waitForRequest("**/api/sample-admin/requests/*");
    await page.locator("[data-request]").filter({ hasText: requestNo }).click();
    await detailRequest;
    await expect(page.locator("#admin-detail")).toBeHidden();
    releaseDetail();
    const af = page.locator("#approval-form");
    await expect(af.locator("[name=model]")).toHaveValue(MODELS[application.modelKey]);
    await chooseModel(af, actualModel);
    await page.locator("#machine-options button").first().waitFor();
    const choice = page.locator("#machine-options button").filter({ hasText: machineNo });
    const sn = af.locator("[name=sn]");
    const accessories = af.locator("[name=accessories]");
    const assetNotes = "存储卡、电源与包装齐全";
    await choice.press("Enter");
    await expect(choice).toBeFocused();
    await expect(sn).toHaveValue(machineSn + "-CORRECTED");
    await expect(sn).not.toBeEditable();
    await expect(accessories).toHaveValue(assetNotes);
    const initialDraft = page.waitForResponse((response) => response.url().endsWith("/draft"));
    await page.locator("#save-draft").click();
    expect((await initialDraft).status()).toBe(200);
    await page.reload();
    await expect(choice).toHaveAttribute("aria-pressed", "true");
    await expect(accessories).toHaveValue(assetNotes);
    await choice.press("Space");
    await expect(choice).toBeFocused();
    await expect(sn).toBeEditable();
    await expect(sn).toHaveValue("");
    await expect(accessories).toHaveValue("");
    await choice.click();
    await expect(accessories).toHaveValue(assetNotes);
    await accessories.fill("人工填写的随箱配件");
    await choice.click();
    await expect(accessories).toHaveValue("人工填写的随箱配件");
    await accessories.fill(assetNotes);
    await choice.click();
    await choice.click();
    await expect(accessories).toHaveValue(assetNotes);
    await accessories.fill("");
    await choice.click();
    await expect(af.locator("[name=no]")).toHaveValue(machineNo);
    await expect(sn).toHaveValue(machineSn + "-CORRECTED");
    await fillApproval(af);
    // Drafts remain partial, but a company cannot save an empty credit code.
    await af.locator("[name=credit]").fill("   ");
    await page.locator("#save-draft").click();
    await expect(af.locator("[name=credit]")).toHaveAttribute("aria-invalid", "true");
    await af.locator("[name=credit]").fill("91510100MA00000000");
    const savedDraft = page.waitForResponse((response) => response.url().endsWith("/draft") && response.request().method() === "POST");
    await page.locator("#save-draft").click();
    expect((await savedDraft).status()).toBe(200);
    await expect(page.locator("#save-draft")).toBeEnabled();
    await expect(af.locator("[name=credit]")).toHaveValue("91510100MA00000000");
    await accessories.fill("");
    await choice.click();
    await choice.click();
    await expect(accessories).toHaveValue(assetNotes);
    await af.locator("[name=identityVerified]").check();
    await page.locator("#photo-upload").setInputFiles({
      name: "isolated-photo.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aCWQAAAAASUVORK5CYII=",
        "base64",
      ),
    });
    await expect(page.locator("#photo-grid img")).toHaveCount(1);
    await expect(page.locator("#photo-upload")).toBeEnabled();
    await page.locator("#complete-approval").click();
    await page.locator("#approval-result").waitFor({ state: "visible" });
    await page.locator("#preview-agreement").click();
    const document = page.locator("#agreement-document");
    await expect(document.getByRole("row").filter({ hasText: "申请型号" })).toContainText(MODELS[application.modelKey]);
    await expect(document.getByRole("row").filter({ hasText: "实际出借型号及配置" })).toContainText(MODELS[actualModel]);
    await page.keyboard.press("Escape");

    await page.locator("#edit-approved").click();
    await choice.click();
    await expect(accessories).toHaveValue("");
    await page.locator("#cancel-revision").click();
    await expect(accessories).toHaveValue(assetNotes);
    await page.locator("#edit-approved").click();
    await chooseModel(af, replacementModel);
    await page.locator("#machine-options button").filter({ hasText: replacementNo }).click();
    await expect(accessories).toHaveValue(replacementNotes);
    await page.locator("#revision-reason").fill("更换实际出借型号");
    const revision = page.waitForResponse((response) => response.url().endsWith("/revisions"));
    await page.locator("#save-revision-bottom").click();
    const revised = await revision;
    expect(revised.status()).toBe(200);
    const { request: revisedRequest } = await revised.json();
    expect(revisedRequest.original.modelKey).toBe(application.modelKey);
    expect(revisedRequest.agreement.assetSnapshot).toMatchObject({ modelKey: replacementModel, no: replacementNo, sn: machineSn });

    await page.locator("#detail-progress [data-progress=deposit]").click();
    await page.locator("#finance-amount").fill("30000.00");
    const reference = "BROWSER-RECEIPT-" + crypto.randomUUID();
    await page.locator("#finance-reference").fill(reference);
    await page.locator("#progress-form button[type=submit]").click();
    await expect(page.locator("#progress-dialog")).not.toBeVisible();
    await page.locator("[data-finance=deposit]").click();
    await page.locator("#finance-amount").fill("1.00");
    await page.locator("#finance-reference").fill(reference);
    await page.locator("#progress-form button[type=submit]").click();
    await expect(
      page.locator("#progress-dialog [data-command-error]"),
    ).toContainText("记录已被其他操作使用");
    await expect(page.locator("#finance-amount")).toHaveValue("1.00");
    await page
      .locator("#progress-dialog")
      .getByRole("button", { name: "取消", exact: true })
      .click();
    await page.locator("#back-to-list").click();
    await page.locator("[data-filter=approved]").click();
    const requestRow = page
      .locator(".request-row")
      .filter({ hasText: requestNo });
    await expect(requestRow).toContainText("押金已到账");
    await expect(requestRow).not.toContainText("押金待到账");

    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
      ).toBe(false);
      await testInfo.attach("sample admin " + width, {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    }

    await page.route("**/api/sample-admin/assets", (route) =>
      route.fulfill({
        status: 403,
        json: { error: "已撤销样机权限", code: "FORBIDDEN" },
      }),
    );
    await page.locator("[data-admin-tab=machines]").click();
    await expect(page.locator("#admin-view")).not.toBeVisible();
    await expect(page.locator("#admin-denied")).toBeVisible();
    if (errors.length) throw new Error(errors.join("\n"));
  });

if (run.scope.sampleLoan)
  test("sample loan: draft and approval with a machine outside inventory", async ({ page }, testInfo) => {
    await setup(page, "zh");
    await loginFixture(page, afterURL, "after");
    const { terms } = await (await page.request.get(afterURL + "/api/sample-loans/terms")).json();
    const created = await page.request.post(afterURL + "/api/sample-loans/applications", {
      headers: { Origin: afterURL, "Idempotency-Key": crypto.randomUUID() },
      data: {
        ...application,
        modelKey: application.modelKey,
        consent: { termsVersion: terms.version, noticeVersion: terms.noticeVersion, accepted: true, noStockShown: true },
      },
    });
    expect(created.status()).toBe(201);
    const { id } = await created.json();
    const blocker = await page.request.post(afterURL + "/api/sample-loans/applications", {
      headers: { Origin: afterURL, "Idempotency-Key": crypto.randomUUID(), "CF-Connecting-IP": "192.0.2.219" },
      data: {
        ...application,
        modelKey: "rm01-t234-32g",
        consent: { termsVersion: terms.version, noticeVersion: terms.noticeVersion, accepted: true, noStockShown: true },
      },
    });
    expect(blocker.status()).toBe(201);
    const { id: otherLoan } = await blocker.json();
    const occupiedSN = "BROWSER-OCCUPIED-SN";
    const approvedOther = await page.request.post(afterURL + `/api/sample-admin/requests/${otherLoan}/approve`, {
      headers: { Origin: afterURL, "Idempotency-Key": crypto.randomUUID() },
      data: {
        expectedRowVersion: 1,
        draft: { ...draft(), modelKey: "rm01-t234-32g" },
        fileIds: [],
        manualAsset: { sn: occupiedSN, no: "BROWSER-OCCUPIED-NO" },
      },
    });
    expect(approvedOther.status()).toBe(200);
    await page.goto(afterURL + "/sample-loan/#admin/" + id);
    const section = page.locator("#section-machine");
    const form = page.locator("#approval-form");
    const sn = form.locator("[name=sn]");
    const no = form.locator("[name=no]");
    const identifiers = { sn: "$operation", no: "$operation" };
    await expect(section.locator(".picker-heading")).toContainText("选填");
    await chooseModel(form, "rm01-t234-32g");
    await expect(section.locator("[data-choose-machine]")).toHaveCount(0);
    await fillApproval(form);
    await no.fill(identifiers.no);
    await form.locator("[name=identityVerified]").check();
    await page.locator("#complete-approval").click();
    await expect(sn).toBeFocused();
    await expect(sn).toHaveAttribute("aria-invalid", "true");
    await sn.fill(occupiedSN.toLowerCase());
    const blocked = page.waitForResponse((response) => response.url().endsWith("/approve"));
    await page.locator("#complete-approval").click();
    expect((await blocked).status()).toBe(409);
    await expect(sn).toBeFocused();
    await expect(sn.locator("..").getByRole("alert")).toContainText("尚未归还");
    await sn.fill(identifiers.sn);

    const save = page.waitForResponse((response) => response.url().endsWith("/draft"));
    await page.locator("#save-draft").click();
    expect((await save).status()).toBe(200);
    await page.reload();
    await expect(sn).toHaveValue(identifiers.sn);
    await expect(no).toHaveValue(identifiers.no);
    await expect(sn).toBeEditable();
    await expect(section.locator("[data-choose-machine]")).toHaveCount(0);
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await section.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
      const path = testInfo.outputPath(`manual-machine-${width}.png`);
      await section.screenshot({ path });
      await testInfo.attach(`manual machine entry ${width}px`, {
        path,
        contentType: "image/png",
      });
    }
    const approve = page.waitForResponse((response) => response.url().endsWith("/approve"));
    await page.locator("#complete-approval").click();
    const result = await approve;
    expect(result.status()).toBe(200);
    const { request } = await result.json();
    expect(request.original.modelKey).toBe(application.modelKey);
    expect(request.agreement.assetSnapshot).toMatchObject({ ...identifiers, id: null, modelKey: "rm01-t234-32g" });
    expect(request.asset).toBeNull();
    await expect(page.locator("#approval-result")).toBeVisible();
    await page.locator("#preview-agreement").click();
    await expect(page.locator("#agreement-document")).toContainText("$operation");
    await page.keyboard.press("Escape");
    await expect(page.locator("#agreement-dialog")).not.toBeVisible();

    await page.locator("#edit-approved").click();
    await page.locator("#revision-reason").fill("核对出借设备");
    await sn.fill(occupiedSN);
    const revisionBlocked = page.waitForResponse((response) => response.url().endsWith("/revisions"));
    await page.locator("#save-revision-bottom").click();
    expect((await revisionBlocked).status()).toBe(409);
    await expect(sn).toBeFocused();
    await expect(sn.locator("..").getByRole("alert")).toContainText("尚未归还");
    const revisedSN = "BROWSER-REVISED-SN";
    await sn.fill(revisedSN);
    const revisionSaved = page.waitForResponse((response) => response.url().endsWith("/revisions"));
    await page.locator("#save-revision-bottom").click();
    const savedRevision = await revisionSaved;
    expect(savedRevision.status()).toBe(200);
    const { request: revised } = await savedRevision.json();
    expect(revised.agreement.assetSnapshot).toMatchObject({ id: null, sn: revisedSN, no: identifiers.no });
    expect(revised.asset).toBeNull();

    await page.locator("[data-admin-tab=machines]").click();
    await expect(page.locator("#inventory-view")).toBeVisible();
    for (const serial of [identifiers.sn, revisedSN]) {
      await page.locator("#inventory-search").fill(serial);
      await expect(page.locator("#inventory-empty")).toBeVisible();
    }
  });

if (run.scope.sampleLoan)
  test("sample loan: navigation owns delayed detail responses and errors", async ({ page }) => {
    await setup(page, "zh");
    await loginFixture(page, afterURL, "after");
    const { terms } = await (
      await page.request.get(afterURL + "/api/sample-loans/terms")
    ).json();
    const names = ["切换验证 A ", "切换验证 B "].map(
      (name) => name + crypto.randomUUID(),
    );
    const ids = [];
    for (const name of names) {
      const response = await page.request.post(
        afterURL + "/api/sample-loans/applications",
        {
          headers: { Origin: afterURL, "Idempotency-Key": crypto.randomUUID() },
          data: {
            ...application,
            applicant: { ...application.applicant, name },
            consent: {
              termsVersion: terms.version,
              noticeVersion: terms.noticeVersion,
              accepted: true,
              noStockShown: false,
            },
          },
        },
      );
      expect(response.status()).toBe(201);
      ids.push((await response.json()).id);
    }
    await page.goto(afterURL + "/sample-loan/#admin");
    for (const [path, fail] of [
      ["/api/sample-admin/assets", false],
      ["/api/sample-admin/requests/" + ids[0], false],
      ["/api/sample-admin/requests/" + ids[0], true],
    ]) {
      await page.locator("[data-admin-tab=requests]").click();
      const row = (id) => page.locator(`[data-request="${id}"]`);
      await row(ids[0]).waitFor();
      let release;
      const held = new Promise((resolve) => (release = resolve));
      await page.route(
        afterURL + path,
        async (route) => {
          await held;
          if (fail)
            await route.fulfill({
              status: 500,
              json: { error: "已过期的请求错误" },
            });
          else await route.continue();
        },
        { times: 1 },
      );
      try {
        const started = page.waitForRequest(afterURL + path);
        await row(ids[0]).click();
        await started;
        await expect(page.locator("#detail-loading")).toBeVisible();
        await expect(page.locator("#admin-detail")).toBeHidden();
        await page.locator("[data-admin-tab=requests]").click();
        await row(ids[1]).click();
        await expect(page.locator("#detail-title")).toHaveText(names[1]);
        const company = page.locator("#approval-form [name=company]");
        await company.fill(names[1] + " 补充资料");
        const finished = page.waitForResponse(afterURL + path);
        release();
        await (await finished).finished();
        await page.evaluate(() => new Promise(requestAnimationFrame));
        await expect(page).toHaveURL(afterURL + "/sample-loan/#admin/" + ids[1]);
        await expect(page.locator("#detail-title")).toHaveText(names[1]);
        await expect(company).toHaveValue(names[1] + " 补充资料");
        await expect(page.locator("#detail-loading")).toBeHidden();
        await expect(page.locator("#toast")).not.toContainText("已过期的请求错误");
      } finally {
        release();
      }
    }
  });

if (run.scope.sampleLoan)
  test("sample loan: load failures recover without duplicate instances and anonymous visitors see no admin shell", async ({
    page,
  }) => {
    await setup(page, "en");
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const openContact = async () => {
      await page.locator("[data-contact-toggle]").scrollIntoViewIfNeeded();
      await page.locator("[data-contact-toggle]").click();
    };
    // Failed module fetches remain in the browser module map; the explicit refresh resets it.
    await page.route("**/sample-loan/application.mjs?*", (route) =>
      route.abort(),
    );
    await page.goto(afterURL + "/?lang=en");
    await openContact();
    await page.locator("[data-sample-loan-open]").click();
    await expect(page.locator("[data-sample-load-error]")).toBeVisible();
    await expect(page.locator("[data-sample-load-error]")).toContainText(
      "could not load",
    );
    await expect(page.locator("[data-sample-loan-host]")).toHaveCount(0);
    await page.unroute("**/sample-loan/application.mjs?*");
    await Promise.all([
      page.waitForEvent("domcontentloaded"),
      page.locator("[data-sample-reload]").click(),
    ]);
    await openContact();
    await page.locator("[data-sample-loan-open]").click();
    await expect(
      page.locator("[data-sample-loan-host]").locator("#application-dialog"),
    ).toBeVisible();

    for (const resource of [
      "application.json",
      "locales.json",
      "preview.css?*",
    ]) {
      await page.goto(afterURL + "/?lang=en");
      const pattern = "**/sample-loan/" + resource;
      await page.route(pattern, (route) => route.abort());
      await openContact();
      await page.locator("[data-sample-loan-open]").click();
      await expect(page.locator("[data-sample-load-error]")).toBeVisible();
      await expect(page.locator("[data-sample-loan-host]")).toHaveCount(0);
      await page.unroute(pattern);
      await page.locator("[data-sample-loan-open]").click();
      const host = page.locator("[data-sample-loan-host]");
      await expect(host).toHaveCount(1);
      await expect(host.locator("#application-dialog")).toBeVisible();
      await host.locator("#application-dialog .contact-close").click();
      await expect(page.locator("[data-contact-toggle]")).toBeFocused();
    }

    let releaseSession;
    const session = new Promise((resolve) => {
      releaseSession = resolve;
    });
    await page.route("**/api/session", async (route) => {
      await session;
      await route.continue();
    });
    const requested = page.waitForRequest("**/api/session");
    await page.goto(afterURL + "/sample-loan/#admin");
    await requested;
    await expect(page.locator("#admin-view")).not.toBeVisible();
    releaseSession();
    await expect(page.locator("#admin-denied")).toBeVisible();
    await expect(page.locator("#logout")).not.toBeVisible();
    await page.unroute("**/api/session");
    await page.route("**/sample-loan/application.json", (route) =>
      route.abort(),
    );
    await page.goto(afterURL + "/sample-loan/#apply");
    await expect(page.locator("#application-load-error")).toBeVisible();
    await expect(page.locator("#admin-view")).not.toBeVisible();
    await page.unroute("**/sample-loan/application.json");
    await page.locator("#retry-application").click();
    await expect(
      page.locator("[data-sample-loan-host]").locator("#application-dialog"),
    ).toBeVisible();
    await expect(page.locator("#admin-view")).not.toBeVisible();
    expect(errors).toEqual([]);
  });

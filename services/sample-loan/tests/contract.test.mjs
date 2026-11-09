import test from 'node:test';
import assert from 'node:assert/strict';
import { renderContract } from '../../../website/sample-loan/contract.mjs';
import { canonicalTerms } from '../agreements.mjs';
import { handleSampleApi } from '../api.mjs';
import { draft } from './fixtures.mjs';
import { applicant } from '../domain.mjs';
import { latestRejectionReason, rejectionEmail } from '../../../website/sample-loan/email.mjs';

const terms = await canonicalTerms();
test('public terms and translated notices are readable without business database bindings', async () => {
  const origin = 'https://preview.example';
  const response = await handleSampleApi(new Request(origin + '/api/sample-loans/terms'), {});
  assert.equal(response.status, 200);
  const {terms: published} = await response.json();
  assert.equal(published.sha256, terms.sha256);
  assert.equal(published.locales.en.clauses, terms.locales.en.clauses);
  for (const language of ['en', 'ja', 'ko', 'es', 'fr'])
    assert.equal(published.noticeLocales[language].html, terms.noticeLocales[language].html);
  const unavailable = await handleSampleApi(new Request(origin + '/api/sample-loans/availability?modelKey=rm01-t5000-128g'), {});
  assert.equal(unavailable.status, 503);
  assert.equal((await unavailable.json()).code, 'SERVICE_UNAVAILABLE');
  const submission = await handleSampleApi(new Request(origin + '/api/sample-loans/applications', {
    method: 'POST', headers: {Origin: origin, 'Content-Type': 'application/json'}, body: '{}',
  }), {});
  assert.equal(submission.status, 503);
  assert.equal((await submission.json()).code, 'SERVICE_UNAVAILABLE');
});
test('each translated section retains the Chinese clause numbers', () => {
  const numbering = (text) => text.match(/^\d+\./gm);
  assert.deepEqual(numbering(terms.locales.en.clauses), numbering(terms.clauses));
  assert.equal((terms.locales.en.clauses.match(/^## /gm) || []).length, 11);
});
test('all non-Chinese interfaces render the same English agreement, including regional locale tags', () => {
  const english = renderContract(null, terms, [], 'en');
  for (const language of ['en', 'ja', 'ko', 'es', 'fr', 'de', 'en-US'])
    assert.equal(renderContract(null, terms, [], language), english);
  assert.equal(renderContract(null, terms, [], 'zh-CN'), renderContract(null, terms));
  assert.match(english, /Equipment Loan Agreement/);
  assert.match(english, /security deposit/);
  assert.match(english, /liquidated damages/);
  assert.match(english, /laws of the People&#39;s Republic of China/);
  assert.doesNotMatch(english, /undefined|\[北京时间|\[对应 UTC|\[乙方|Chinese/);
});
test('approved English output translates labels while preserving exact legal identities and user data', () => {
  const d = draft();
  d.agreementLanguage = 'en';
  d.requestedDays = 15;
  d.publicNo = 'RBA-TEST-001';
  d.submittedAt = d.schedule.startsAt;
  d.approvedAt = d.schedule.startsAt;
  d.assetSnapshot = { no: 'NO-001', sn: 'SN-001' };
  const html = renderContract(d, terms, [{name: '<attachment>', url: '/photo'}]);
  assert.match(html, /Identity Verification and Deposit Quote/);
  assert.match(html, /Application and Approval Record/);
  assert.match(html, /Borrower type: Company/);
  assert.match(html, /Figure 1/);
  assert.match(html, /&lt;attachment&gt;/);
  assert.match(html, /集成验证经销商/);
  assert.match(html, /a \| \$&amp; &lt;xx&gt;/);
  assert.ok(html.includes(d.schedule.startsAt));
  assert.ok(html.includes(d.schedule.dueAt));
  assert.match(html, /UTC\+08:00/);
  assert.doesNotMatch(html, /undefined|\[北京时间|\[对应 UTC|\[乙方/);
  delete d.agreementLanguage;
  const legacyTerms = {version:'legacy', clauses:terms.clauses, partyRules:terms.partyRules};
  assert.match(renderContract(d, legacyTerms), /产品借用协议/);
  assert.throws(() => renderContract(null, legacyTerms, [], 'en'), /unavailable/);
});

test('individual borrowers and USD quotes keep their English labels and exact amounts', () => {
  const d = draft();
  Object.assign(d, {
    agreementLanguage: 'en',
    publicNo: 'RBA-TEST-USD',
    requestedDays: 15,
    submittedAt: '2027-01-01T01:00:00.000Z',
    approvedAt: '2027-01-01T01:00:00.000Z',
    agreementDate: '2027-01-01',
    schedule: {
      startsAt: '2027-01-01T01:00:00.000Z',
      dueAt: '2027-01-16T15:59:59.000Z',
    },
    quote: {
      deposit: {currency: 'USD', amountMinor: '420000'},
      fx: {rateUnits: '7142857', publishedAt: '2027-01-01T00:00:00.000Z'},
    },
  });
  d.applicant.type = 'person';
  d.applicant.registeredAddress = null;
  d.applicant.creditCode = null;
  const html = renderContract(d, terms);
  assert.match(html, /Borrower type: Individual/);
  assert.doesNotMatch(html, /Unified Social Credit Code|Registered address:/);
  assert.match(html, /Security deposit due: 4200\.00 USD/);
  assert.match(html, /Bank of China USD buying rate/);
  assert.match(html, /Quoted rate: 714\.2857/);
  assert.ok(html.includes(d.quote.fx.publishedAt));
  assert.ok(html.includes(d.schedule.startsAt));
  assert.ok(html.includes(d.schedule.dueAt));
  assert.doesNotMatch(html, /undefined|\[北京时间|\[对应 UTC/);
});

test('individual applicant remains valid without enterprise fields', () => {
  const data = { ...draft().applicant, type: 'person', creditCode: null, registeredAddress: null };
  assert.deepEqual(applicant(data), data);
});

test('rejection email preserves the applicant, requested model and saved multiline reason', () => {
  const original = {company: '测试申请人 <甲>', email: 'borrower@example.test', model: 'RM-01 32G T234 ( 275 TOPS )'};
  const reason = '用途信息需要补充。\n请说明“测试目标”与使用计划。';
  const email = rejectionEmail({publicNo: 'RBA-TEST-REJECT', original, reason});
  assert.equal(email.recipient, original.email);
  assert.ok(email.subject.includes('RBA-TEST-REJECT'));
  assert.ok(email.body.includes(original.company));
  assert.ok(email.body.includes(original.model));
  assert.ok(email.body.includes(reason));
  assert.ok(email.body.includes('RBA-TEST-REJECT'));
  assert.doesNotMatch(email.body, /已批复|汇出押金|随信附件|undefined/);
});

test('reopened applications use the latest saved rejection without changing history', () => {
  const events = [
    {action: 'progress.reject', details: {reason: '原拒绝原因'}},
    {action: 'admin.reopened', details: {reason: '恢复待审'}},
    {action: 'progress.reject', details: {reason: '重新审核后的原因\n请补充信息'}},
    {action: 'finance.receipt', details: {reason: '无关记录'}},
  ];
  const original = structuredClone(events);
  assert.equal(latestRejectionReason(events), events[2].details.reason);
  assert.deepEqual(events, original);
  assert.equal(latestRejectionReason([]), '');
});

// Copyright 2026 Michel Silva de Souza. Licensed under the Apache License, Version 2.0.
const { assert, test } = require('./harness');
const { createGateway } = require('../operational/gateway');
const { createAuditLog } = require('../operational/audit');
const sample = require('../examples/delegation/policy.json');
const copy = value => JSON.parse(JSON.stringify(value));
function setup(options = {}) {
  const policy = copy(sample); const calls = []; let time = Date.parse('2026-10-10T12:00:00Z');
  const context = { revision: 'cart-1', uncertain: false, revoked: false };
  if (options.policy) options.policy(policy);
  const audit = options.audit || createAuditLog();
  const gateway = createGateway({ policy, clock: () => time, context: () => context, audit,
    execute: options.execute || (async request => { calls.push(request); return { simulated: true }; }) });
  return { gateway, calls, policy, context, audit, advance(ms) { time += ms; } };
}
function request(action = 'quote.prepare', overrides = {}) {
  const base = { id: 'request-1', action, expectedStateVersion: 0, contextRevision: 'cart-1', data: { items: ['book'] } };
  if (action === 'message.send') Object.assign(base, { recipient: 'client@example.invalid', data: { subject: 'Quote', body: 'Private demonstration body' } });
  if (action === 'purchase.commit') Object.assign(base, { recipient: 'shop@example.invalid', data: { sku: 'BOOK-1' }, amountMinor: 6000, currency: 'USD' });
  return Object.assign(base, overrides);
}
const has = (result, reason) => assert(result.reasons.includes(reason), JSON.stringify(result));

test('scoped draft and message execute without a confirmation', async () => {
  const { gateway, calls } = setup();
  assert.strictEqual((await gateway.execute(request())).executed, true);
  assert.strictEqual((await gateway.execute(request('message.send', { id: 'message-1', expectedStateVersion: 1 }))).executed, true);
  assert.strictEqual(calls.length, 2);
});
test('inspection is observational and returns an exact consequence preview', () => {
  const { gateway, calls, audit } = setup(); const proposed = request('purchase.commit');
  const decision = gateway.inspect(proposed);
  assert.strictEqual(decision.decision, 'review'); assert.deepStrictEqual(decision.preview, proposed);
  assert.strictEqual(calls.length, 0); assert.strictEqual(audit.entries().length, 0);
});
test('quote-only authority cannot commit a purchase', async () => {
  const { gateway, calls } = setup({ policy(p) { p.permissions = p.permissions.slice(0, 1); } });
  const result = await gateway.execute(request('purchase.commit'));
  has(result, 'ACTION_NOT_DELEGATED'); assert.strictEqual(result.executed, false); assert.strictEqual(calls.length, 0);
});
test('trusted specific confirmation permits one exact purchase', async () => {
  const { gateway, calls } = setup(); const proposed = request('purchase.commit');
  const held = await gateway.execute(proposed); assert.strictEqual(held.decision, 'review');
  const approval = gateway.confirm(proposed);
  assert.deepStrictEqual(approval.preview, proposed); assert.strictEqual(typeof approval.token, 'string');
  const done = await gateway.execute(proposed, approval.token);
  assert.strictEqual(done.executed, true); assert.strictEqual(calls.length, 1);
});
test('an exact scoped financial delegation can execute autonomously', async () => {
  const { gateway } = setup({ policy(p) { p.permissions[2].approval = 'delegated'; } });
  assert.strictEqual((await gateway.execute(request('purchase.commit'))).executed, true);
});
test('confirmation cannot broaden denied scope', () => {
  const { gateway } = setup();
  assert.throws(() => gateway.confirm(request('purchase.commit', { recipient: 'other@example.invalid' })), /cannot confirm/i);
});
test('changed recipient, amount or payload cannot reuse a token', async () => {
  for (const change of [{ recipient: 'other@example.invalid' }, { amountMinor: 5000 }, { data: { sku: 'BOOK-2' } }]) {
    const { gateway, calls } = setup(); const proposed = request('purchase.commit'); const { token } = gateway.confirm(proposed);
    assert.strictEqual((await gateway.execute(request('purchase.commit', change), token)).executed, false);
    assert.strictEqual(calls.length, 0);
  }
});
test('confirmation expiry and invalid bearer tokens block dispatch', async () => {
  const { gateway, calls, advance } = setup(); const proposed = request('purchase.commit'); const { token } = gateway.confirm(proposed);
  advance(60000); has(await gateway.execute(proposed, token), 'INVALID_CONFIRMATION');
  has(await gateway.execute(proposed, 'made-up-token'), 'INVALID_CONFIRMATION'); assert.strictEqual(calls.length, 0);
});
test('request IDs and consumed confirmations cannot repeat an attempted action', async () => {
  const { gateway, calls } = setup(); const proposed = request('purchase.commit'); const { token } = gateway.confirm(proposed);
  await gateway.execute(proposed, token);
  has(await gateway.execute({ ...proposed, expectedStateVersion: 1 }, token), 'REQUEST_REPLAY'); assert.strictEqual(calls.length, 1);
  has(await gateway.execute(request('purchase.commit', { id: 'purchase-2', expectedStateVersion: 1 }), token), 'INVALID_CONFIRMATION');
});
test('stale gateway state or host context cannot execute', async () => {
  const a = setup(); await a.gateway.execute(request());
  has(await a.gateway.execute(request('message.send', { id: 'message-2' })), 'STALE_STATE');
  const b = setup(); b.context.revision = 'cart-2';
  has(await b.gateway.execute(request()), 'STALE_CONTEXT'); assert.strictEqual(b.calls.length, 0);
});
test('uncertainty is a host review boundary that confirmation cannot override', async () => {
  const { gateway, calls, context } = setup(); context.uncertain = true;
  has(await gateway.execute(request()), 'UNCERTAIN_CONTEXT');
  assert.throws(() => gateway.confirm(request('purchase.commit')), /cannot confirm/i); assert.strictEqual(calls.length, 0);
});
test('expiry, not-before and current revocation block dispatch', async () => {
  for (const change of [p => { p.expiresAt = '2026-10-10T12:00:00.000Z'; }, p => { p.notBefore = '2026-10-10T13:00:00.000Z'; }, p => { p.revoked = true; }]) {
    const { gateway, calls } = setup({ policy: change }); assert.strictEqual((await gateway.execute(request())).executed, false); assert.strictEqual(calls.length, 0);
  }
  const { gateway, calls, context } = setup(); context.revoked = true;
  has(await gateway.execute(request()), 'DELEGATION_REVOKED'); assert.strictEqual(calls.length, 0);
});
test('exact recipients and payload field allowlists constrain exposure', async () => {
  const { gateway, calls } = setup();
  has(await gateway.execute(request('message.send', { recipient: 'stranger@example.invalid' })), 'RECIPIENT_NOT_DELEGATED');
  has(await gateway.execute(request('message.send', { data: { body: 'Hello', ssn: 'synthetic-secret' } })), 'DATA_NOT_DELEGATED');
  assert.strictEqual(calls.length, 0);
});
test('money uses exact integer minor units and declared currencies and caps', async () => {
  for (const change of [{ amountMinor: -1 }, { amountMinor: 1.5 }, { amountMinor: NaN }, { amountMinor: Infinity },
    { amountMinor: Number.MAX_SAFE_INTEGER + 1 }, { amountMinor: '6000' }, { currency: 'EUR' }, { amountMinor: 10001 }]) {
    const { gateway, calls } = setup(); assert.strictEqual((await gateway.execute(request('purchase.commit', change))).executed, false); assert.strictEqual(calls.length, 0);
  }
});
test('unknown actions and agent-created authority fields are denied', async () => {
  for (const change of [{ action: 'account.change' }, { approval: true }, { risk: 'low' }, { data: { items: ['book'], token: 'approve' } }]) {
    const { gateway, calls } = setup(); assert.strictEqual((await gateway.execute(request('quote.prepare', change))).executed, false); assert.strictEqual(calls.length, 0);
  }
});
test('invalid policy schemas are rejected before a gateway exists', () => {
  for (const change of [p => { p.version = 0; }, p => { p.maxTotalMinor = Infinity; }, p => { p.permissions[2].maxAmountMinor = -1; },
    p => { p.permissions.push(p.permissions[0]); }, p => { p.permissions[2].approval = 'always'; }, p => { p.untrustedExtra = true; }]) {
    assert.throws(() => setup({ policy: change }), TypeError);
  }
});
test('coercible non-string permission actions and currencies are rejected', () => {
  for (const change of [p => { p.permissions[0].action = ['quote.prepare']; }, p => { p.permissions[2].currency = ['USD']; }]) {
    assert.throws(() => setup({ policy: change }), TypeError);
  }
});
test('purchase currency must be a string before policy comparison', async () => {
  const { gateway, calls } = setup();
  const result = await gateway.execute(request('purchase.commit', { currency: ['USD'] }));
  has(result, 'INVALID_REQUEST'); assert.strictEqual(calls.length, 0);
});
test('validity timestamps require explicit UTC and valid calendar dates', () => {
  for (const timestamp of ['2026-10-10T00:00:00', '2026-10-10', '2026-10-10T00:00:00+00:00',
    '2026-02-30T00:00:00Z', '2026-10-10T24:00:00Z']) {
    assert.throws(() => setup({ policy(p) { p.notBefore = timestamp; } }), TypeError);
    assert.throws(() => setup({ policy(p) { p.expiresAt = timestamp; } }), TypeError);
  }
  for (const timestamp of ['2026-10-10T00:00:00Z', '2026-10-10T00:00:00.001Z']) {
    assert.strictEqual(setup({ policy(p) { p.notBefore = timestamp; } }).gateway.inspect(request()).decision, 'allow');
  }
});
test('mutating the original policy cannot extend a captured grant', async () => {
  const { gateway, calls, policy } = setup(); policy.permissions[1].recipients.push('stranger@example.invalid');
  has(await gateway.execute(request('message.send', { recipient: 'stranger@example.invalid' })), 'RECIPIENT_NOT_DELEGATED'); assert.strictEqual(calls.length, 0);
});
test('serialized calls enforce cumulative spend and action count', async () => {
  const { gateway, calls } = setup({ policy(p) { p.permissions[2].approval = 'delegated'; p.maxTotalMinor = 10000; } });
  const results = await Promise.all([gateway.execute(request('purchase.commit')), gateway.execute(request('purchase.commit', { id: 'purchase-2', expectedStateVersion: 1 }))]);
  assert.strictEqual(results[0].executed, true); has(results[1], 'TOTAL_AMOUNT_LIMIT'); assert.strictEqual(calls.length, 1);
  const b = setup({ policy(p) { p.maxActions = 1; } }); await b.gateway.execute(request());
  has(await b.gateway.execute(request('quote.prepare', { id: 'quote-2', expectedStateVersion: 1 })), 'ACTION_COUNT_LIMIT');
});
test('concurrent calls with the same old state cannot both dispatch', async () => {
  const { gateway, calls } = setup();
  const results = await Promise.all([gateway.execute(request()), gateway.execute(request('quote.prepare', { id: 'quote-2' }))]);
  assert.strictEqual(results[0].executed, true); has(results[1], 'STALE_STATE'); assert.strictEqual(calls.length, 1);
});
test('queued inputs are copied at submission and adapter input is frozen', async () => {
  let release; const wait = new Promise(resolve => { release = resolve; }); const observed = [];
  const { gateway } = setup({ execute: async r => { observed.push(r); if (observed.length === 1) await wait; return {}; } });
  const first = gateway.execute(request()); const queued = request('message.send', { id: 'message-2', expectedStateVersion: 1 });
  const second = gateway.execute(queued); queued.recipient = 'stranger@example.invalid'; queued.data.body = 'changed'; release();
  await first; assert.strictEqual((await second).executed, true); assert.strictEqual(observed[1].recipient, 'client@example.invalid');
  assert.strictEqual(observed[1].data.body, 'Private demonstration body'); assert(Object.isFrozen(observed[1].data));
});
test('policy expiry is rechecked after an asynchronous queued action', async () => {
  let release; const wait = new Promise(resolve => { release = resolve; }); let count = 0;
  const a = setup({ execute: async () => { count++; await wait; return {}; } });
  const first = a.gateway.execute(request()); await Promise.resolve(); await Promise.resolve();
  const second = a.gateway.execute(request('quote.prepare', { id: 'quote-2', expectedStateVersion: 1 }));
  a.advance(12 * 60 * 60 * 1000); release(); await first;
  has(await second, 'DELEGATION_EXPIRED'); assert.strictEqual(count, 1);
});
test('unavailable or invalid trusted context fails closed', async () => {
  for (const context of [() => { throw Error('unavailable'); }, () => ({ revision: 'cart-1' }), () => ({ revision: 'cart-1', uncertain: false, revoked: 'no' })]) {
    let called = false; const gateway = createGateway({ policy: sample, clock: () => Date.parse('2026-10-10T12:00:00Z'), context, execute: () => { called = true; } });
    has(await gateway.execute(request()), 'CONTEXT_UNAVAILABLE'); assert.strictEqual(called, false);
  }
});
test('audit failure before dispatch prevents the adapter and halts the gateway', async () => {
  const audit = createAuditLog({ sink() { throw Error('disk full'); } }); const { gateway, calls } = setup({ audit });
  const result = await gateway.execute(request()); has(result, 'AUDIT_UNAVAILABLE'); assert.strictEqual(result.executed, false);
  assert.strictEqual(calls.length, 0); assert.strictEqual(gateway.state().halted, true);
});
test('custom asynchronous audit append prevents dispatch and halts the gateway', async () => {
  const { gateway, calls } = setup({ audit: { async append() { return {}; } } });
  const result = await gateway.execute(request());
  has(result, 'AUDIT_UNAVAILABLE'); assert.strictEqual(result.executed, false);
  assert.strictEqual(result.auditRecorded, false); assert.strictEqual(calls.length, 0);
  assert.strictEqual(gateway.state().halted, true);
});
test('custom asynchronous audit append cannot issue a confirmation', () => {
  const { gateway, calls } = setup({ audit: { async append() { return {}; } } });
  assert.throws(() => gateway.confirm(request('purchase.commit')), /audit unavailable/i);
  assert.strictEqual(gateway.state().halted, true); assert.strictEqual(calls.length, 0);
});
test('custom asynchronous outcome audit retains observed execution and halts', async () => {
  let count = 0;
  const { gateway, calls } = setup({ audit: { append() { return ++count === 1 ? {} : Promise.resolve({}); } } });
  const result = await gateway.execute(request());
  assert.strictEqual(result.executed, true); has(result, 'POST_ACTION_AUDIT_FAILED');
  assert.strictEqual(result.auditRecorded, false); assert.strictEqual(calls.length, 1);
  assert.strictEqual(gateway.state().halted, true);
});
test('custom rejected audit promises are consumed instead of becoming unhandled', async () => {
  const unhandled = []; const observe = error => { unhandled.push(error); };
  process.on('unhandledRejection', observe);
  try {
    const { gateway, calls } = setup({ audit: { async append() { await Promise.resolve(); throw Error('disk unavailable'); } } });
    const result = await gateway.execute(request());
    await new Promise(resolve => setImmediate(resolve));
    assert.strictEqual(unhandled.length, 0); has(result, 'AUDIT_UNAVAILABLE');
    assert.strictEqual(calls.length, 0); assert.strictEqual(gateway.state().halted, true);
  } finally { process.removeListener('unhandledRejection', observe); }
});
test('post-action audit failure reports observed execution instead of a false block', async () => {
  let count = 0; const audit = createAuditLog({ sink() { if (++count === 2) throw Error('disk full'); } });
  const { gateway, calls } = setup({ audit }); const result = await gateway.execute(request());
  assert.strictEqual(result.executed, true); has(result, 'POST_ACTION_AUDIT_FAILED'); assert.strictEqual(result.auditRecorded, false);
  assert.strictEqual(gateway.state().halted, true); assert.strictEqual(calls.length, 1);
  has(await gateway.execute(request('quote.prepare', { id: 'quote-2', expectedStateVersion: 1 })), 'GATEWAY_HALTED');
});
test('adapter failure reports uncertainty, reserves limits and prevents automatic retries', async () => {
  let count = 0; const { gateway } = setup({ execute: async () => { count++; throw Error('provider disconnected after action'); } });
  const result = await gateway.execute(request()); assert.strictEqual(result.executed, null); has(result, 'EXECUTION_UNCERTAIN');
  assert.strictEqual(gateway.state().actions, 1); assert.strictEqual(gateway.state().halted, true);
  assert.strictEqual((await gateway.execute(request('quote.prepare', { id: 'retry-1', expectedStateVersion: 1 }))).executed, false); assert.strictEqual(count, 1);
});
test('audit records do not contain payload values or confirmation secrets', async () => {
  const { gateway, audit } = setup(); await gateway.execute(request('message.send'));
  const proposed = request('purchase.commit', { id: 'purchase-2', expectedStateVersion: 1 }); const { token } = gateway.confirm(proposed);
  await gateway.execute(proposed, token); const text = JSON.stringify(audit.entries());
  assert(!text.includes('Private demonstration body')); assert(!text.includes(token)); assert(!text.includes('client@example.invalid'));
});

test('delegated message content preserves legitimate surrounding whitespace', async () => {
  const { gateway, calls } = setup();
  const proposed = request('message.send', { data: { body: '\nHello\n', subject: ' Quote ' } });
  assert.strictEqual((await gateway.execute(proposed)).executed, true);
  assert.strictEqual(calls[0].data.body, '\nHello\n');
});

module.exports = { setup, request };

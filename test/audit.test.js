// Copyright 2026 Michel Silva de Souza. Licensed under the Apache License, Version 2.0.
const { assert, test } = require('./harness');
const { cloneJson, stableJson, digest, freeze } = require('../operational/json');
const { createAuditLog, verifyAuditLog } = require('../operational/audit');

test('canonical JSON ignores property insertion order but preserves array order', () => {
  assert.strictEqual(stableJson({ b: 2, a: 1 }), '{"a":1,"b":2}');
  assert.strictEqual(digest({ b: 2, a: 1 }), digest({ a: 1, b: 2 }));
  assert.notStrictEqual(digest([1, 2]), digest([2, 1]));
});
test('JSON copies are detached and frozen recursively', () => {
  const source = { a: [{ b: 1 }] }; const copy = freeze(cloneJson(source)); source.a[0].b = 7;
  assert.strictEqual(copy.a[0].b, 1); assert(Object.isFrozen(copy.a[0]));
});
test('JSON rejects nonfinite, undefined, oversized, exotic and accessor input', () => {
  for (const value of [NaN, Infinity, undefined, { a: undefined }, new Date(), { x: 'x'.repeat(70000) }]) {
    assert.throws(() => cloneJson(value), TypeError);
  }
  let read = false;
  const accessor = Object.defineProperty({}, 'secret', { enumerable: true, get() { read = true; return 1; } });
  assert.throws(() => cloneJson(accessor), TypeError); assert.strictEqual(read, false);
  let deep = {}; for (let i = 0; i < 20; i++) deep = { deep };
  assert.throws(() => cloneJson(deep), TypeError);
});
test('audit append links immutable copies and returns a verifiable checkpoint', () => {
  const log = createAuditLog(); const event = { kind: 'decision', reasons: ['OUT_OF_SCOPE'] };
  const first = log.append(event); event.reasons[0] = 'ALLOW';
  log.append({ kind: 'attempt' });
  const entries = log.entries();
  assert.strictEqual(entries.length, 2); assert.strictEqual(entries[0].event.reasons[0], 'OUT_OF_SCOPE');
  assert.strictEqual(entries[1].previousHash, first.hash); assert(Object.isFrozen(first));
  assert.deepStrictEqual(verifyAuditLog(entries, log.checkpoint()), { ok: true, count: 2 });
});
test('audit rejects edited and reordered records', () => {
  const log = createAuditLog(); log.append({ kind: 'first' }); log.append({ kind: 'second' });
  const edited = log.entries(); edited[0].event.kind = 'forged';
  assert.strictEqual(verifyAuditLog(edited).ok, false);
  assert.strictEqual(verifyAuditLog(log.entries().reverse()).ok, false);
});
test('trusted checkpoints detect removed tails including complete deletion', () => {
  const log = createAuditLog(); log.append({ kind: 'first' }); log.append({ kind: 'second' });
  const prefix = log.entries().slice(0, 1);
  assert.strictEqual(verifyAuditLog(prefix).ok, true);
  assert.strictEqual(verifyAuditLog(prefix, log.checkpoint()).ok, false);
  assert.strictEqual(verifyAuditLog([], log.checkpoint()).ok, false);
});
test('a wholly rewritten chain requires a separately trusted checkpoint to reject', () => {
  const original = createAuditLog(); original.append({ kind: 'original' });
  const replacement = createAuditLog(); replacement.append({ kind: 'forged' });
  assert.strictEqual(verifyAuditLog(replacement.entries()).ok, true);
  assert.strictEqual(verifyAuditLog(replacement.entries(), original.checkpoint()).ok, false);
});
test('audit persistence fails before publishing an entry', () => {
  const log = createAuditLog({ sink() { throw new Error('disk unavailable'); } });
  assert.throws(() => log.append({ kind: 'attempt' }), /disk unavailable/);
  assert.strictEqual(log.entries().length, 0);
});
test('audit verification fails safely for malformed entries and checkpoints', () => {
  assert.strictEqual(verifyAuditLog([{ invalid: true }]).ok, false);
  assert.strictEqual(verifyAuditLog([], { count: -1, hash: 'bad' }).ok, false);
});

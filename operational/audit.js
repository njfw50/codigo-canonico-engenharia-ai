// Copyright 2026 Michel Silva de Souza. Licensed under the Apache License, Version 2.0.
const { cloneJson, digest, freeze } = require('./json');
const GENESIS = '0'.repeat(64);

function createAuditLog({ sink } = {}) {
  if (sink !== undefined && typeof sink !== 'function') throw new TypeError('Expected an audit sink');
  const records = [];
  return Object.freeze({
    append(event) {
      const body = { sequence: records.length + 1, previousHash: records.length ? records[records.length - 1].hash : GENESIS,
        event: cloneJson(event) };
      const entry = freeze({ ...body, hash: digest(body) });
      // Persistence must complete before the gateway may cross its action boundary.
      // The default intentionally demonstrates only an in-memory chain.
      if (sink) {
        const result = sink(entry);
        if (result && typeof result.then === 'function') {
          Promise.resolve(result).catch(() => {});
          throw new TypeError('Audit sink must persist synchronously');
        }
      }
      records.push(entry);
      return entry;
    },
    entries() { return records.map(entry => cloneJson(entry)); },
    checkpoint() { return Object.freeze({ count: records.length, hash: records.length ? records[records.length - 1].hash : GENESIS }); }
  });
}

function verifyAuditLog(entries, checkpoint) {
  try {
    if (!Array.isArray(entries)) throw new TypeError('Expected entries');
    let previousHash = GENESIS;
    for (let i = 0; i < entries.length; i++) {
      const entry = cloneJson(entries[i]);
      const { sequence, event, hash } = entry;
      if (Object.keys(entry).sort().join(',') !== 'event,hash,previousHash,sequence' ||
          sequence !== i + 1 || entry.previousHash !== previousHash ||
          hash !== digest({ sequence, previousHash, event })) {
        return { ok: false, reason: 'CHAIN_MISMATCH', index: i };
      }
      previousHash = hash;
    }
    // A self-consistent shortened or rewritten chain is not proof of completeness.
    // Only a checkpoint retained outside the writer's control anchors that claim.
    if (checkpoint !== undefined && (!checkpoint || checkpoint.count !== entries.length || checkpoint.hash !== previousHash)) {
      return { ok: false, reason: 'CHECKPOINT_MISMATCH' };
    }
    return { ok: true, count: entries.length };
  } catch (_) { return { ok: false, reason: 'INVALID_AUDIT_DATA' }; }
}
module.exports = { createAuditLog, verifyAuditLog };

// Copyright 2026 Michel Silva de Souza. Licensed under the Apache License, Version 2.0.
const crypto = require('crypto');
const { cloneJson, digest, freeze } = require('./json');
const { createAuditLog } = require('./audit');
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const integer = value => Number.isSafeInteger(value) && value >= 0;
const text = (value, limit = 128) => typeof value === 'string' && value.length > 0 && value.length <= limit && value.trim() === value;
const contentText = (value, limit) => typeof value === 'string' && value.length > 0 && value.length <= limit;
const currency = value => typeof value === 'string' && /^[A-Z]{3}$/.test(value);
const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const shape = (value, allowed, required = allowed) => plain(value) && Object.keys(value).every(key => allowed.includes(key)) && required.every(key => own(value, key));

function utcTimestamp(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)) return false;
  const parsed = Date.parse(value);
  const canonical = value.length === 20 ? value.slice(0, -1) + '.000Z' : value;
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === canonical;
}

// This registry belongs to the host. A proposal cannot lower its own consequence
// class by describing a purchase as a draft or by supplying a "low risk" label.
const ACTIONS = freeze({
  'quote.prepare': { external: false, fields: ['items'] },
  'message.send': { external: true, fields: ['subject', 'body'] },
  'purchase.commit': { external: true, fields: ['sku'] }
});

function validatePolicy(value) {
  const policy = cloneJson(value);
  if (!shape(policy, ['schemaVersion', 'id', 'version', 'notBefore', 'expiresAt', 'revoked', 'maxActions', 'maxTotalMinor', 'confirmationTtlMs', 'permissions']) ||
      policy.schemaVersion !== 1 || !text(policy.id) || !integer(policy.version) || policy.version < 1 ||
      !utcTimestamp(policy.notBefore) || !utcTimestamp(policy.expiresAt) || Date.parse(policy.notBefore) >= Date.parse(policy.expiresAt) ||
      typeof policy.revoked !== 'boolean' || !integer(policy.maxActions) || policy.maxActions < 1 || policy.maxActions > 100000 ||
      !integer(policy.maxTotalMinor) || !integer(policy.confirmationTtlMs) || policy.confirmationTtlMs < 1000 || policy.confirmationTtlMs > 600000 ||
      !Array.isArray(policy.permissions) || policy.permissions.length > Object.keys(ACTIONS).length) {
    throw new TypeError('Invalid delegation policy');
  }
  const seen = new Set();
  for (const permission of policy.permissions) {
    const financial = permission.action === 'purchase.commit';
    const fields = ['action', 'approval', 'recipients', 'dataFields'].concat(financial ? ['currency', 'maxAmountMinor'] : []);
    if (!shape(permission, fields) || !text(permission.action, 64) || !own(ACTIONS, permission.action) || seen.has(permission.action) ||
        !['delegated', 'confirm'].includes(permission.approval) || !Array.isArray(permission.recipients) ||
        !permission.recipients.every(recipient => text(recipient)) || new Set(permission.recipients).size !== permission.recipients.length ||
        (!ACTIONS[permission.action].external && permission.recipients.length !== 0) || !Array.isArray(permission.dataFields) ||
        !permission.dataFields.every(field => ACTIONS[permission.action].fields.includes(field)) || new Set(permission.dataFields).size !== permission.dataFields.length ||
        (financial && (!currency(permission.currency) || !integer(permission.maxAmountMinor)))) {
      throw new TypeError('Invalid delegation permission');
    }
    seen.add(permission.action);
  }
  return freeze(policy);
}

function normalizeRequest(value) {
  const request = cloneJson(value);
  const allowed = ['id', 'action', 'data', 'expectedStateVersion', 'contextRevision', 'recipient', 'amountMinor', 'currency'];
  if (!shape(request, allowed, allowed.slice(0, 5)) || !text(request.id, 64) || !/^[a-zA-Z0-9_.-]+$/.test(request.id) ||
      !text(request.action, 64) || !integer(request.expectedStateVersion) || !text(request.contextRevision) || !plain(request.data)) {
    throw new TypeError('Invalid action request');
  }
  if (own(ACTIONS, request.action)) {
    const external = ACTIONS[request.action].external;
    if ((external && !text(request.recipient)) || (!external && own(request, 'recipient')) ||
        (request.action !== 'purchase.commit' && (own(request, 'amountMinor') || own(request, 'currency')))) throw new TypeError('Invalid consequence fields');
    if (request.action === 'purchase.commit' && (!integer(request.amountMinor) || !currency(request.currency) || !text(request.data.sku, 64))) {
      throw new TypeError('Invalid purchase');
    }
    if (request.action === 'message.send' && (!contentText(request.data.body, 16384) || (own(request.data, 'subject') && !contentText(request.data.subject, 256)))) {
      throw new TypeError('Invalid message');
    }
    if (request.action === 'quote.prepare' && (!Array.isArray(request.data.items) || request.data.items.length < 1 || request.data.items.length > 100 ||
        !request.data.items.every(item => text(item)))) throw new TypeError('Invalid quote');
  }
  return freeze(request);
}

function createGateway({ policy: sourcePolicy, execute: adapter, clock = Date.now,
  context = () => ({ revision: '0', uncertain: false, revoked: false }), audit = createAuditLog() }) {
  const policy = validatePolicy(sourcePolicy);
  if (typeof adapter !== 'function' || typeof clock !== 'function' || typeof context !== 'function' || !audit || typeof audit.append !== 'function') {
    throw new TypeError('Expected trusted host adapter, clock, context and audit');
  }
  const state = { version: 0, actions: 0, spentMinor: 0, halted: false };
  const usedIds = new Set(); const confirmations = new Map(); let queue = Promise.resolve();
  const decision = (status, reason, request) => freeze({ decision: status, reasons: [reason], ...(request ? { preview: request } : {}) });

  function evaluate(request, token) {
    let time, current;
    const answer = (status, reason) => ({ result: decision(status, reason, request), time, current });
    if (state.halted) return answer('deny', 'GATEWAY_HALTED');
    try { time = clock(); if (!Number.isSafeInteger(time) || Math.abs(time) > 8640000000000000) throw Error(); }
    catch (_) { return answer('deny', 'CLOCK_UNAVAILABLE'); }
    try {
      current = cloneJson(context());
      if (!shape(current, ['revision', 'uncertain', 'revoked']) || !text(current.revision) ||
          typeof current.uncertain !== 'boolean' || typeof current.revoked !== 'boolean') throw Error();
    } catch (_) { return answer('deny', 'CONTEXT_UNAVAILABLE'); }
    if (policy.revoked || current.revoked) return answer('deny', 'DELEGATION_REVOKED');
    if (time < Date.parse(policy.notBefore)) return answer('deny', 'DELEGATION_NOT_ACTIVE');
    if (time >= Date.parse(policy.expiresAt)) return answer('deny', 'DELEGATION_EXPIRED');
    if (usedIds.has(request.id)) return answer('deny', 'REQUEST_REPLAY');
    if (request.expectedStateVersion !== state.version) return answer('deny', 'STALE_STATE');
    if (request.contextRevision !== current.revision) return answer('deny', 'STALE_CONTEXT');
    if (!own(ACTIONS, request.action)) return answer('deny', 'UNSUPPORTED_ACTION');
    const permission = policy.permissions.find(item => item.action === request.action);
    if (!permission) return answer('deny', 'ACTION_NOT_DELEGATED');
    if (ACTIONS[request.action].external && !permission.recipients.includes(request.recipient)) return answer('deny', 'RECIPIENT_NOT_DELEGATED');
    if (Object.keys(request.data).some(field => !permission.dataFields.includes(field))) return answer('deny', 'DATA_NOT_DELEGATED');
    if (state.actions >= policy.maxActions) return answer('deny', 'ACTION_COUNT_LIMIT');
    if (request.action === 'purchase.commit') {
      if (request.currency !== permission.currency) return answer('deny', 'CURRENCY_NOT_DELEGATED');
      if (request.amountMinor > permission.maxAmountMinor) return answer('deny', 'ACTION_AMOUNT_LIMIT');
      // Subtraction keeps the comparison exact even near the safe-integer ceiling.
      if (request.amountMinor > policy.maxTotalMinor - state.spentMinor) return answer('deny', 'TOTAL_AMOUNT_LIMIT');
    }
    if (current.uncertain) return answer('review', 'UNCERTAIN_CONTEXT');
    if (token !== undefined) {
      const confirmation = typeof token === 'string' ? confirmations.get(token) : undefined;
      if (!confirmation || confirmation.expiresAt <= time || confirmation.binding !== binding(request, current)) {
        return answer('deny', 'INVALID_CONFIRMATION');
      }
      return answer('allow', 'CONFIRMED');
    }
    if (permission.approval === 'confirm') return answer('review', 'CONFIRMATION_REQUIRED');
    return answer('allow', 'WITHIN_DELEGATION');
  }

  function binding(request, current) {
    return digest({ request, policyId: policy.id, policyVersion: policy.version, stateVersion: state.version, contextRevision: current.revision });
  }
  function record(kind, request, checked, extra = {}) {
    // Fingerprints support comparison, not anonymization. Raw payload, recipients
    // and bearer secrets stay outside the audit record; protect the log itself.
    const entry = audit.append({ kind, timestamp: Number.isSafeInteger(checked.time) ? new Date(checked.time).toISOString() : null,
      policyId: policy.id, policyVersion: policy.version, requestId: request ? request.id : null,
      requestFingerprint: request ? digest(request) : null, action: request ? request.action : null,
      stateVersion: state.version, decision: checked.result.decision, reasons: checked.result.reasons, ...extra });
    if (entry && typeof entry.then === 'function') {
      Promise.resolve(entry).catch(() => {});
      throw new TypeError('Audit append must complete synchronously');
    }
  }
  function inspect(value) {
    try { return evaluate(normalizeRequest(value)).result; }
    catch (_) { return decision('deny', 'INVALID_REQUEST'); }
  }
  function confirm(value) {
    const request = normalizeRequest(value); const checked = evaluate(request);
    if (checked.result.decision !== 'review' || checked.result.reasons[0] !== 'CONFIRMATION_REQUIRED') {
      throw new Error('Cannot confirm a denied, uncertain or already delegated action');
    }
    for (const [key, entry] of confirmations) if (entry.expiresAt <= checked.time || entry.stateVersion !== state.version) confirmations.delete(key);
    if (confirmations.size >= 128) throw new Error('Pending confirmation limit reached');
    try { record('confirmation', request, checked); }
    catch (_) { state.halted = true; throw new Error('Cannot confirm: audit unavailable'); }
    // This method is a trusted human-channel assertion, not an SI tool or an
    // authentication service. Token possession alone never expands policy scope.
    const token = crypto.randomBytes(24).toString('hex'); const expiresAt = checked.time + policy.confirmationTtlMs;
    confirmations.set(token, { binding: binding(request, checked.current), expiresAt, stateVersion: state.version });
    return freeze({ token, preview: request, expiresAt: new Date(expiresAt).toISOString() });
  }

  async function dispatch(request, token) {
    const checked = request ? evaluate(request, token) : { result: decision('deny', 'INVALID_REQUEST') };
    if (checked.result.decision !== 'allow') {
      try { record('decision', request, checked); }
      catch (_) { state.halted = true; return { ...decision('deny', 'AUDIT_UNAVAILABLE'), executed: false, auditRecorded: false }; }
      return { ...checked.result, executed: false, auditRecorded: true };
    }
    try { record('attempt', request, checked); }
    catch (_) { state.halted = true; return { ...decision('deny', 'AUDIT_UNAVAILABLE'), executed: false, auditRecorded: false }; }
    // Reserve before awaiting the adapter. Both concurrent budgets and ambiguous
    // provider failures must retain their attempted consequence, not reopen it.
    usedIds.add(request.id); if (token !== undefined) confirmations.delete(token);
    state.actions += 1; state.spentMinor += request.action === 'purchase.commit' ? request.amountMinor : 0; state.version += 1;
    let result, outcome = 'executed';
    try { result = await adapter(request); }
    catch (_) { outcome = 'uncertain'; state.halted = true; }
    let auditRecorded = true;
    try { record('outcome', request, checked, { outcome }); }
    catch (_) { auditRecorded = false; state.halted = true; }
    const reasons = outcome === 'uncertain' ? ['EXECUTION_UNCERTAIN'] : [...checked.result.reasons];
    if (!auditRecorded) reasons.push('POST_ACTION_AUDIT_FAILED');
    return { ...checked.result, reasons, executed: outcome === 'executed' ? true : null, outcome, auditRecorded,
      ...(outcome === 'executed' ? { result } : {}) };
  }
  function execute(value, token) {
    let request;
    try { request = normalizeRequest(value); } catch (_) { request = null; }
    // Snapshot on submission, not after another adapter has finished; the caller
    // cannot mutate a queued action after its authorization context was presented.
    const pending = queue.then(() => dispatch(request, token));
    queue = pending.catch(() => {});
    return pending;
  }
  return Object.freeze({ inspect, confirm, execute, state: () => Object.freeze({ ...state }) });
}
module.exports = { createGateway };

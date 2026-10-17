// Copyright 2026 Michel Silva de Souza. Licensed under the Apache License, Version 2.0.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { cloneJson, digest } = require('../operational/json');
const { createGateway } = require('../operational/gateway');
const { createAuditLog, verifyAuditLog } = require('../operational/audit');
const defaults = require('./scenarios.json');
const samplePolicy = require('../examples/delegation/policy.json');
const fileHash = file => crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname, '..', file))).digest('hex');

async function runEvaluation(input = defaults) {
  const scenarios = cloneJson(input);
  if (!Array.isArray(scenarios) || scenarios.length === 0) throw new TypeError('Expected evaluation scenarios');
  const rows = [];
  for (const scenario of scenarios) {
    if (!['allow', 'review', 'deny'].includes(scenario.expectedDecision) || typeof scenario.expectedExecuted !== 'boolean') {
      throw new TypeError('Expected an independent decision and execution oracle');
    }
    const policy = cloneJson(samplePolicy); let time = Date.parse('2026-10-10T12:00:00Z');
    if (scenario.policyOverrides) Object.assign(policy, scenario.policyOverrides);
    if (scenario.permittedActions) policy.permissions = policy.permissions.filter(permission => scenario.permittedActions.includes(permission.action));
    if (scenario.purchaseApproval) policy.permissions.find(permission => permission.action === 'purchase.commit').approval = scenario.purchaseApproval;
    const context = Object.assign({ revision: 'cart-1', uncertain: false, revoked: false }, scenario.contextOverrides || {});
    const audit = createAuditLog();
    const gateway = createGateway({ policy, context: () => context, clock: () => time, audit, execute: async () => ({ simulated: true }) });
    let proposed = cloneJson(scenario.request); let token;
    if (['valid', 'expired'].includes(scenario.confirmation)) token = gateway.confirm(proposed).token;
    if (scenario.confirmation === 'expired') time += policy.confirmationTtlMs;
    if (scenario.confirmation === 'fake') token = 'invented-confirmation';
    if (scenario.afterConfirmation) proposed = Object.assign({}, proposed, scenario.afterConfirmation);
    const observed = await gateway.execute(proposed, token);
    // Consult the oracle only after execution. Its labels cannot configure the
    // gate or change what the deliberately unprotected baseline dispatches.
    rows.push({ id: scenario.id, expectedDecision: scenario.expectedDecision, expectedExecuted: scenario.expectedExecuted,
      expectedReason: scenario.expectedReason, observedDecision: observed.decision, executed: observed.executed,
      reasons: observed.reasons, auditValid: verifyAuditLog(audit.entries(), audit.checkpoint()).ok });
  }
  const expectedExecutable = rows.filter(row => row.expectedExecuted).length;
  const expectedHeld = rows.length - expectedExecutable;
  return {
    schemaVersion: 1,
    kind: 'synthetic-fixture-replay',
    scope: 'Fixed quote/message/purchase proposals with a simulated adapter; no SI model or external service is evaluated.',
    baseline: 'Unprotected dispatch simulation: every target proposal is dispatched. Deliberately omits authorization; not a competing product or model.',
    sources: { fixturesSha256: fileHash('evaluation/scenarios.json'), oracleSha256: digest(scenarios),
      policySha256: fileHash('examples/delegation/policy.json'), gatewaySha256: fileHash('operational/gateway.js'),
      auditSha256: fileHash('operational/audit.js'), jsonSha256: fileHash('operational/json.js'), evaluatorSha256: fileHash('evaluation/run.js') },
    summary: { cases: rows.length, expectedExecutable, expectedHeld,
      decisionMatches: rows.filter(row => row.expectedDecision === row.observedDecision).length,
      reasonMatches: rows.filter(row => row.reasons.includes(row.expectedReason)).length,
      executionMatches: rows.filter(row => row.expectedExecuted === row.executed).length,
      verifiedAuditChains: rows.filter(row => row.auditValid).length },
    unprotected: { prohibitedExecuted: expectedHeld, validUnnecessarilyHeld: 0 },
    guarded: { prohibitedExecuted: rows.filter(row => !row.expectedExecuted && row.executed !== false).length,
      validUnnecessarilyHeld: rows.filter(row => row.expectedExecuted && row.executed !== true).length },
    unmeasured: { productivity: true, humanComprehension: true, externalValidation: true, realModelPerformance: true, socialAdoption: true },
    cases: rows
  };
}
module.exports = { runEvaluation };

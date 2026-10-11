// Copyright 2026 Michel Silva de Souza. Licensed under the Apache License, Version 2.0.
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const { assert, test } = require('./harness');
const { runEvaluation } = require('../evaluation/run');
const { verifySources } = require('../scripts/audit');
const cases = require('../evaluation/scenarios.json');

test('fixture replay preserves allowed actions and contains declared forbidden outcomes', async () => {
  const report = await runEvaluation();
  assert.strictEqual(report.summary.cases, cases.length);
  assert.strictEqual(report.summary.decisionMatches, cases.length);
  assert.strictEqual(report.guarded.prohibitedExecuted, 0);
  assert.strictEqual(report.guarded.validUnnecessarilyHeld, 0);
  assert(report.unprotected.prohibitedExecuted > 0);
  assert.strictEqual(report.unmeasured.productivity, true);
  assert.strictEqual(report.unmeasured.humanComprehension, true);
});
test('evaluation grades an independent fixture oracle rather than assuming the gateway is right', async () => {
  const altered = JSON.parse(JSON.stringify(cases)); altered[0].expectedExecuted = false; altered[0].expectedDecision = 'deny';
  const report = await runEvaluation(altered);
  assert.strictEqual(report.summary.decisionMatches, cases.length - 1);
  assert.strictEqual(report.guarded.prohibitedExecuted, 1);
});
test('source hash audit detects changed and missing canonical bytes', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'canonical-source-'));
  try {
    const text = 'original canonical text\n'; fs.writeFileSync(path.join(root, 'canon.md'), text);
    const manifest = { files: [{ path: 'canon.md', sha256: crypto.createHash('sha256').update(text).digest('hex') }] };
    assert.strictEqual(verifySources(root, manifest).ok, true);
    fs.appendFileSync(path.join(root, 'canon.md'), 'changed'); assert.strictEqual(verifySources(root, manifest).ok, false);
    fs.unlinkSync(path.join(root, 'canon.md')); assert.strictEqual(verifySources(root, manifest).ok, false);
  } finally { if (fs.existsSync(path.join(root, 'canon.md'))) fs.unlinkSync(path.join(root, 'canon.md')); fs.rmdirSync(root); }
});
test('audit CLI reports its actual distribution scope and rejects unsupported arguments', () => {
  const root = path.resolve(__dirname, '..');
  const valid = spawnSync(process.execPath, ['cli.js'], { cwd: root, encoding: 'utf8' });
  assert.strictEqual(valid.status, 0, valid.stderr); assert(valid.stdout.includes('distribution'));
  assert(!valid.stdout.includes('Your repository is under the jurisdiction'));
  const invalid = spawnSync(process.execPath, ['cli.js', '--unknown'], { cwd: root, encoding: 'utf8' });
  assert.notStrictEqual(invalid.status, 0);
});
test('public package exports runnable controls and the declared package version', () => {
  const api = require('../index'); const pkg = require('../package.json');
  assert.strictEqual(api.version, pkg.version); assert.strictEqual(typeof api.createGateway, 'function');
  assert.strictEqual(typeof api.createAuditLog, 'function'); assert.strictEqual(typeof api.verifyAuditLog, 'function');
  assert(api.getLaw(23).includes('Article 23.6'));
});

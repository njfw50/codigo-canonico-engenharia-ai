// Copyright 2026 Michel Silva de Souza. Licensed under the Apache License, Version 2.0.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { runEvaluation } = require('../evaluation/run');

function verifySources(root, manifest) {
  const failures = []; const base = path.resolve(root);
  if (!manifest || !Array.isArray(manifest.files) || manifest.files.length === 0) return { ok: false, checked: 0, failures: ['INVALID_MANIFEST'] };
  for (const source of manifest.files) {
    try {
      const target = path.resolve(base, source.path);
      if (!target.startsWith(base + path.sep)) throw Error('Outside source root');
      const hash = crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex');
      if (hash !== source.sha256) failures.push(source.path);
    } catch (_) { failures.push(source.path || 'INVALID_PATH'); }
  }
  return { ok: failures.length === 0, checked: manifest.files.length, failures };
}
async function auditDistribution() {
  const manifest = require('../operational/canonical-sources.json');
  const sources = verifySources(path.resolve(__dirname, '..'), manifest);
  const report = await runEvaluation();
  const fixturesPassed = report.summary.decisionMatches === report.summary.cases && report.summary.reasonMatches === report.summary.cases &&
    report.summary.executionMatches === report.summary.cases && report.summary.verifiedAuditChains === report.summary.cases;
  return { ok: sources.ok && fixturesPassed, sources, report };
}
async function main(args = process.argv.slice(2)) {
  if (args.length) throw new Error('Usage: canonical-audit (checks this distribution only)');
  const result = await auditDistribution();
  console.log('Canonical SI audit — packaged distribution scope');
  console.log(`Pinned source integrity: ${result.sources.checked - result.sources.failures.length}/${result.sources.checked}`);
  console.log(`Delegation fixtures: ${result.report.summary.decisionMatches}/${result.report.summary.cases} decision matches`);
  console.log('Scope excludes arbitrary consumer architecture, human comprehension, production/robotics safety and full canonical compliance.');
  if (!result.ok) throw new Error(`Scoped audit failed: ${result.sources.failures.join(', ') || 'fixture mismatch'}`);
  console.log('Scoped distribution checks passed.');
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { verifySources, auditDistribution, main };

// Copyright 2026 Michel Silva de Souza. Licensed under the Apache License, Version 2.0.
const fs = require('fs');
const path = require('path');
const { stableJson } = require('../operational/json');
const { runEvaluation } = require('../evaluation/run');

async function main(args = process.argv.slice(2)) {
  if (args.length && (args.length !== 2 || !['--output', '--check'].includes(args[0]))) {
    throw new Error('Usage: node scripts/evaluate.js [--output FILE | --check FILE]');
  }
  const report = await runEvaluation();
  if (!args.length) { console.log(JSON.stringify(report, null, 2)); return; }
  const target = path.resolve(args[1]);
  if (args[0] === '--check') {
    if (stableJson(JSON.parse(fs.readFileSync(target, 'utf8'))) !== stableJson(report)) throw new Error('Stored report differs; regenerate and review evidence');
    console.log(`Reproduced ${report.summary.cases} fixture outcomes and source fingerprints.`);
  } else {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, JSON.stringify(report, null, 2) + '\n');
    console.log(`Wrote ${report.summary.cases} fixture outcomes; prohibited executions: ${report.guarded.prohibitedExecuted}; unnecessary holds: ${report.guarded.validUnnecessarilyHeld}.`);
  }
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { main };

// Copyright 2026 Michel Silva de Souza. Licensed under the Apache License, Version 2.0.
const fs = require('fs');
const path = require('path');
const { cases } = require('./harness');
for (const name of fs.readdirSync(__dirname).filter(name => name.endsWith('.test.js')).sort()) {
  require(path.join(__dirname, name));
}
(async () => {
  let failed = 0;
  for (const item of cases) {
    try { await item.run(); console.log(`PASS ${item.name}`); }
    catch (error) { failed += 1; console.error(`FAIL ${item.name}: ${error.message}`); }
  }
  console.log(`${cases.length - failed}/${cases.length} tests passed`);
  process.exitCode = failed ? 1 : 0;
})();

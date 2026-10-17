// Copyright 2026 Michel Silva de Souza. Licensed under the Apache License, Version 2.0.
const assert = require('assert');
const cases = [];
function test(name, run) { cases.push({ name, run }); }
module.exports = { assert, test, cases };

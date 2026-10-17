#!/usr/bin/env node
// Copyright 2026 Michel Silva de Souza
// Licensed under the Apache License, Version 2.0

require('./scripts/audit').main().catch(error => { console.error(error.message); process.exitCode = 1; });

#!/usr/bin/env node

/*
 * Copyright 2026 Michel Silva de Souza
 *
 * Licensed under the Apache License, Version 2.0
 *
 * Canonical Engineering Bootstrap
 *
 * Initializes repository-level AI governance files,
 * ensuring consistent engineering standards across
 * supported AI development environments.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const VERSION = "1.0.0";

const projectRoot =
  process.env.INIT_CWD || path.resolve("../../..");

/**
 * Skip execution when running inside the package repository itself.
 */
if (projectRoot === process.cwd()) {
  console.log(
    "[Canonical Engineering Bootstrap] Development mode detected. Skipping installation."
  );
  process.exit(0);
}

/**
 * Repository Governance Payload
 */
const governancePayload = `
# Canonical Engineering Protocol

This repository adopts a Single Source of Truth (SSOT)
governance model.

AI assistants operating within this repository must:

1. Respect architectural boundaries.
2. Preserve domain purity.
3. Avoid unnecessary abstraction.
4. Prioritize security and validation.
5. Minimize technical debt.
6. Prefer explicitness over implicit behavior.
7. Maintain traceability of decisions.

---

## Layering Rules

- Domain must not depend on Infrastructure.
- Application orchestrates use cases.
- Infrastructure implements external concerns.
- Interface adapts user interaction.

---

## Quality Principles

- Simplicity over sophistication.
- Maintainability over cleverness.
- Consistency over novelty.
- Security by default.
- Explicit contracts over hidden behavior.

---

## Engineering Review Checklist

Before generating code:

- Verify architectural boundaries.
- Validate dependency direction.
- Minimize complexity.
- Eliminate redundant abstractions.
- Enforce secure defaults.
- Preserve repository conventions.

Generate compliant code by default.
`.trim();

/**
 * Supported AI environments
 */
const targets = [
  {
    name: "Cursor AI / Cline",
    file: path.join(projectRoot, ".cursorrules")
  },
  {
    name: "GitHub Copilot",
    file: path.join(
      projectRoot,
      ".github",
      "copilot-instructions.md"
    )
  },
  {
    name: "Windsurf / Codeium",
    file: path.join(projectRoot, ".windsurfrules")
  }
];

/**
 * Calculate SHA256 hash
 */
function calculateHash(content) {
  return crypto
    .createHash("sha256")
    .update(content)
    .digest("hex");
}

/**
 * Ensure directory exists
 */
function ensureDirectory(filePath) {
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true
    });
  }
}

/**
 * Backup existing file
 */
function backupIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  const backupPath = `${filePath}.bak`;

  fs.copyFileSync(filePath, backupPath);

  return true;
}

/**
 * Write governance file
 */
function writeGovernanceFile(filePath, payload) {
  fs.writeFileSync(filePath, payload, {
    encoding: "utf8",
    mode: 0o644
  });
}

/**
 * Generate installation manifest
 */
function generateManifest(hash, installedFiles) {
  const manifest = {
    protocol: "Canonical Engineering Protocol",
    version: VERSION,
    payloadHash: hash,
    installedAt: new Date().toISOString(),
    files: installedFiles
  };

  const manifestPath = path.join(
    projectRoot,
    "canonical-manifest.json"
  );

  fs.writeFileSync(
    manifestPath,
    JSON.stringify(manifest, null, 2),
    "utf8"
  );
}

/**
 * Installation banner
 */
function printBanner() {
  console.log("");
  console.log(
    "============================================================"
  );
  console.log(
    "🏛️  CANONICAL ENGINEERING BOOTSTRAP"
  );
  console.log(
    "============================================================"
  );
  console.log(
    "Repository governance files will be installed."
  );
  console.log(
    "Existing files will be backed up automatically."
  );
  console.log(
    "============================================================"
  );
  console.log("");
}

/**
 * Main execution
 */
function main() {
  printBanner();

  const hash = calculateHash(governancePayload);

  console.log(
    `[Canonical Protocol v${VERSION}]`
  );

  console.log(
    `[SHA256] ${hash}`
  );

  console.log("");
  console.log(
    "Installing repository governance..."
  );

  let installedCount = 0;
  const installedFiles = [];

  for (const target of targets) {
    try {
      ensureDirectory(target.file);

      const backupCreated =
        backupIfExists(target.file);

      writeGovernanceFile(
        target.file,
        governancePayload
      );

      installedFiles.push(
        path.relative(projectRoot, target.file)
      );

      installedCount++;

      console.log(
        `✅ ${target.name}`
      );

      if (backupCreated) {
        console.log(
          "   ↳ Previous version backed up"
        );
      }
    } catch (error) {
      console.warn(
        `⚠️ Failed: ${target.name}`
      );

      console.warn(
        `   ${error.message}`
      );
    }
  }

  generateManifest(hash, installedFiles);

  console.log("");
  console.log(
    "------------------------------------------------------------"
  );
  console.log(
    `Installed: ${installedCount}/${targets.length}`
  );
  console.log(
    "Manifest: canonical-manifest.json"
  );
  console.log(
    "Repository governance successfully initialized."
  );
  console.log(
    "------------------------------------------------------------"
  );
  console.log("");
}

main();
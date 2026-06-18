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
 * This script is part of the Canonical Engineering Bootstrap.
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
# Canonical Engineering Protocol: Repository Standards

This document outlines the core principles and standards for AI-assisted development within this repository. Our objective is to ensure architectural integrity, maintainability, and security.

## Core Principles

1.  **Single Source of Truth (SSOT)**: All critical information and configurations must originate from a single, authoritative source to prevent discrepancies and ensure consistency.
2.  **Domain Purity**: Maintain clear separation of concerns, ensuring that domain logic remains untainted by infrastructure or application-specific details.
3.  **Architectural Boundaries**: Strictly adhere to defined architectural layers and boundaries to promote modularity, reduce coupling, and enhance system resilience.
4.  **Security by Default**: Implement security measures from the outset, ensuring that all components and processes are designed with a secure posture.
5.  **Maintainability**: Prioritize code clarity, consistency, and simplicity to facilitate future modifications, debugging, and onboarding of new contributors.
6.  **Simplicity**: Favor straightforward solutions over overly complex ones, recognizing that simplicity often leads to greater reliability and easier understanding.
7.  **Traceability**: Ensure that all decisions, changes, and their impacts are clearly documented and traceable, providing a comprehensive audit trail.

## AI Assistant Guidelines

AI assistants operating within this repository are expected to:

-   Respect and enforce the architectural boundaries and domain purity.
-   Generate code that aligns with established coding standards and patterns.
-   Prioritize security considerations in all generated outputs.
-   Contribute to the maintainability and clarity of the codebase.
-   Avoid introducing ideological or authoritarian language in any generated content.

This protocol serves as the foundational standard for all engineering activities, ensuring a cohesive and high-quality development environment.
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
 * Displays installation banner
 */
function printBanner() {
  console.log("");
  console.log(
    "============================================================"
  );
  console.log(
    "🏛️  CANONICAL ENGINEERING PROTOCOL"
  );
  console.log(
    "============================================================"
  );
  console.log(
    "Repository governance files will be installed/updated."
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
    "Repository governance successfully installed/updated."
  );
  console.log(
    "------------------------------------------------------------"
  );
  console.log("");
}

main();
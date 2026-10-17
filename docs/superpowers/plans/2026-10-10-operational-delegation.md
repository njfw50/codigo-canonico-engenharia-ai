# SI operational delegation implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Execution stays in this session; the final review is independent.

**Goal:** Implement the approved, bounded operational layer and publish reproducible evidence for SI delegation containment.
**Architecture:** A trusted policy and fixed action registry constrain requests before a host adapter runs. Separate audit and evaluation units record outcomes and exercise the same gateway used by the demonstration.
**Tech Stack:** CommonJS, Node standard library, Node >=14.0.0, no new dependencies.
**Spec:** `docs/superpowers/specs/2026-10-10-operational-delegation-design.md`.

## Global Constraints

- Preserve original laws, prior Book of Life/congress records and checkout example byte-for-byte.
- Use SI in new operational prose; preserve historical titles/citations/identifiers.
- No network, credentials or external side effects in the simulator.
- No production certification, protocol-wide validator or evidence of real-world/model productivity gains.
- Run directly with Node; do not invoke the installation hook.

## Review Focus

- Malformed JSON values and integer overflow must deny without adapter dispatch.
- Agent-generated approval fields or altered requests must not acquire authority from a prior token.
- Concurrent/queued calls must retain submitted values and enforce aggregate limits.
- Post-dispatch failures must preserve visibility of possible/completed consequences.
- Hash-chain verification must expose the separate trust requirement for tail removal/replacement.

## Task 1: Audit records

**Files:** Create `operational/json.js`, `operational/audit.js`, `test/harness.js`, `test/audit.test.js`, `test/run.js`.
**Consumes:** JSON-compatible metadata and a synchronous trusted persistence sink.
**Produces:** `cloneJson(value)`, `stableJson(value)`, `digest(value)`, `freeze(value)`; `createAuditLog({sink}).append(event)/entries()/checkpoint()`; `verifyAuditLog(entries, checkpoint)`.

- [ ] Write behavior tests for valid entries, immutable snapshots, edited/reordered records, truncated logs with a trusted checkpoint, persistence errors and invalid JSON.
- [ ] Run `node test/run.js` against explicit unimplemented stubs; expect assertion failures proving missing behavior.
- [ ] Implement validation/canonical hashing and the audit log, with comments explaining its trust boundaries.
- [ ] Run `node test/run.js`; expect all audit tests to pass. Commit task 1.

## Task 2: Trusted delegation gateway

**Files:** Create `operational/gateway.js`, `test/gateway.test.js`, `examples/delegation/policy.json`, `examples/delegation/demo.js`.
**Consumes:** Task 1 JSON/audit interfaces; the spec's trusted host inputs.
**Produces:** `createGateway({policy, execute, clock, context, audit})` with `inspect(request)`, trusted `confirm(request)`, async `execute(request, token)`, `state()`.

- [ ] Add tests for every spec verification focus plus positive draft/message/purchase delegation and explicit confirmation.
- [ ] Run `node test/run.js`; expect gateway assertions to fail against stubs.
- [ ] Implement the fixed registry, strict policy/request validation, short-lived bound tokens, serialized revalidation/reservation, audit-before-action and explicit outcomes.
- [ ] Run `node test/run.js` and `node examples/delegation/demo.js`; expect passing tests, a blocked purchase under quote-only delegation and no external calls. Commit task 2.

## Task 3: Evidence, distribution audit and integration

**Files:** Create `evaluation/scenarios.json`, `evaluation/run.js`, `scripts/evaluate.js`, `scripts/audit.js`, `operational/canonical-sources.json`, `test/integration.test.js`; modify `package.json`, `index.js`, `cli.js`, `.github/workflows/canonical-audit.yml`.
**Consumes:** Gateway decisions and audit interfaces; untouched source laws and a declared fixture oracle.
**Produces:** Synthetic report JSON, a scoped non-certifying audit CLI, exported gateway/audit APIs and repeatable project scripts.

- [ ] Write integration tests that reject constant “passed” CLI output, verify fixture decisions and protect the canonical source set.
- [ ] Run `node test/run.js`; expect integration failures before implementing the CLI/report.
- [ ] Implement evaluation and pinned source audit. Wire `npm test`, `npm run demo:delegation`, `npm run evaluate` and `npm run audit`; use the package version in the public API.
- [ ] Run the whole suite and generate `docs/evaluation/delegation-report.json` from the working implementation. Commit task 3.

## Task 4: Adoption, governance and review

**Files:** Create `examples/delegation/README.md`, `docs/operational/CONTROLS.md`, `docs/operational/GOVERNANCE.md`, `docs/evaluation/PILOT.md`, `template/adoption_report.md`, `docs/book_of_life/ADA-20261010-001.md`; modify `README.md`, `CONTRIBUTING.md`, `docs/EVIDENCE.md`, `CHANGELOG.md`, `llms.txt`, `template/README.md`.
**Consumes:** Implemented interfaces, actual test/evaluation evidence and source hashes.
**Produces:** Bilingual entry point, article/control map, practical review and pilot procedures, sealed qualification/provenance record.

- [ ] Document exact commands, authority boundaries, SI terminology, measured/unmeasured outcomes and operational roles.
- [ ] Check relative links, source preservation, reproducible report and all commands on Node 14 and the current runtime.
- [ ] Run an independent whole-change review under superpowers:requesting-code-review; address material findings with failing regressions first.
- [ ] Run final project checks, commit and publish a reviewable GitHub PR linked to #16. The PR is the human reconstructive review point before integration into main.

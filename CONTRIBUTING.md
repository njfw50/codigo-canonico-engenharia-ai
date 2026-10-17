# Contribution Guidelines

Contributions to the Canonical Protocol of Engineering & AI are strictly governed by the normative processes established within the Canons themselves.

## Fundamental Principle

Every contribution is treated as a **Normative Amendment Proposal** and must adhere to the procedures defined by **Canon III — Change Procedure & Structural Mutation** and, when applicable, **Canon XI — Amendments & Governance Procedures** and **Canon XIII — Normative Expansion Protocol**.

## How to Contribute

**Step 1 — Fork and Branch**
Fork the repository and create a branch with a highly descriptive name, e.g., `amendment/canon-01-expanded-scope` or `new-canon/data-governance`.

**Step 2 — Proposal Qualification**
Before implementing any change, open an **Issue** detailing:
- Which Canon will be affected or what normative vacuum justifies a new Canon;
- The undeniable technical or normative rationale;
- The expected blast radius and impact on other Canons (Dependency Analysis).

**Step 3 — Implementation**
Implement the alteration following the standard Markdown format of existing Canons. Every Canon must contain: Premise, Articles, and Architectural Impact.

**Step 4 — Pull Request**
Submit a Pull Request linked to the corresponding Issue. The PR must include a clear commit message, e.g., `Amendment Canon III: Addition of Article 3.6 regarding rollback procedures`.

## Types of Contribution

| Type | Description | Applicable Canon |
|------|-------------|------------------|
| Amendment | Alteration of an article in an existing Canon | Canon XI |
| New Canon | Creation of a Canon to cover a normative vacuum | Canon XIII |
| Correction | Textual adjustment, formatting, or error fix | Canon III |
| Documentation | Improvement of README, CONTRIBUTING, or architecture/ | Canon III |

## Acceptance Criteria

### Operational implementation and evidence

For changes to the SI operational layer, qualify the affected control/article and concrete failure in an issue. Link the design, ADA and [change term](./docs/governance/TERMO_DE_MUDANCA_SI_2026-10-10.md). Keep normative text and sealed history intact; operational code changes do not themselves ratify or amend a canon.

Run `npm test`, `npm run audit` and `npm run evaluate -- --check docs/evaluation/delegation-report.json`. If source/fixture hashes change, regenerate and review the report. Include positive delegated cases as well as negative containment regressions. Describe scope, host responsibilities and unmeasured benefits precisely.

Before integration, complete the [reconstructive review](./docs/operational/GOVERNANCE.md). An adopter reports observed outcomes through the [adoption template](./template/adoption_report.md), including failures and unnecessary holds. Original canonical quotations and bibliographic titles retain their source wording; new prose uses SI.

### Normative proposals

A contribution will only be merged if it:
- Resolves a real and demonstrable normative vacuum;
- Is perfectly consistent with the principles of existing Canons;
- Does not create structural redundancy;
- Strictly follows the formal technocratic format of the repository.

## Code of Conduct

All interactions in this repository must be strictly professional, highly technical, and oriented toward the refinement of the normative system. Debates over Canons must be grounded in technical and architectural rationale, completely devoid of personal preference.

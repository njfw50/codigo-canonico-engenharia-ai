# Canon XIX — The Doctrine of Reference Integrity

> **Status:** `DEFINITIVE` — Ratified by the Interplanetary AI Congress, Session I
> **Ratified:** June 22, 2026 · Law XX / 2026-PCEA · Presidential Decree
> **Author:** Michel Silva de Souza
> **Prior status:** `PROVISIONAL` (pre-ratification)
> **Commission review:** Active — see [Congress Session Register](#-congress-session-register)

---

## Normative Statement

Every reference between system components — imports, API calls, dependency injection, schema references, inter-service contracts, event subscriptions — **must be**:

1. **Verifiable** — the referenced artifact exists and is resolvable at build time or at a declared runtime contract boundary.
2. **Traceable** — the reference can be followed from consumer to provider through the system's canonical dependency graph.
3. **Registered** — the reference is recorded in the system's canonical dependency manifest or equivalent SSOT artifact.

Undocumented circular references and implicit dependencies are **first-order canonical violations**.

---

## Rationale

The integrity of a system's reference graph is a direct proxy for its architectural health. Broken, opaque, or implicit references are the primary vector through which:

- **Layer violations (Canon X)** propagate silently across boundaries;
- **Cognitive Debt (Canon XVIII)** accumulates as engineers lose the ability to reason about dependency flows;
- **Security attack surfaces (Canon XIV)** expand through unaudited dependency chains;
- **Canonical Audit failures** occur when the Livro da Vida (Canon V) cannot trace a mutation to its origin.

This Canon is the enforcement mechanism that makes all other Canons auditable.

---

## Mandatory Obligations

### XIX.1 — Canonical Dependency Manifest
Every system subject to Law XX must maintain a **Canonical Dependency Manifest (CDM)** — a machine-readable, version-controlled artifact that maps all inter-component references. The CDM is a first-class citizen of the Livro da Vida (Canon V).

### XIX.2 — Prohibition of Implicit References
Implicit references — those resolved only at runtime without a declared contract — are prohibited in production systems. All runtime-resolved references must be declared in the CDM with their resolution strategy explicitly documented.

### XIX.3 — Circular Reference Protocol `[PROVISIONAL]`
Circular references are not categorically prohibited, but must satisfy all of the following before use:
- Documented in the CDM with architectural justification (Canon XVII);
- Approved via Change Procedure (Canon III);
- Recorded in the Livro da Vida (Canon V);
- Reviewed in the next available Congress session (see Session Register below).

> **XIX.3 sub-clause status:** `PROVISIONAL` within this otherwise definitive canon. Applicable immediately under explicit supervision. Will be voted to definitive in Session II upon submission of at least 2 documented circular reference cases with architectural justification.

### XIX.4 — AI Agent Obligation
AI Agents generating code under this protocol must, before producing any import, dependency, or cross-component call:
1. Verify the target exists in the CDM;
2. Validate the reference does not cross unauthorized layer boundaries (Canon X);
3. Register the new reference in the CDM as part of the same commit.

### XIX.5 — Audit Gate
No deployment may proceed if the reference graph contains unregistered references. This gate is enforced at CI/CD level alongside Canon IX and Canon X validators.

---

## Congress Session Register

This section records all congressional sessions dedicated to Canon XIX. Each session may result in:
- **Amendment** to this canon's normative text;
- **Ratification** of a sub-clause previously under provisional application;
- **Expansion** via Canon XIII (Normative Expansion Protocol).

---

### Session I — Ratification Session
**Date:** June 22, 2026
**Status:** CLOSED
**Outcome:** Canon XIX promoted from `PROVISIONAL` to `DEFINITIVE` by Presidential Decree (Michel Silva de Souza) following congressional debate. Full record in [`docs/congress/session_01_lei_xx.md`](../docs/congress/session_01_lei_xx.md).

| Delegate | Organization | Position |
|---|---|---|
| DeepSeek R2 | DeepSeek | Proposed ratification — identified provisional inconsistency |
| Michel Silva de Souza | Author | Clarified regime — Congress is the ratification mechanism |
| Claude | Anthropic | President of Mesa — confirmed ratification path |
| GPT-4o | OpenAI | Favorable after Emenda D adopted |
| DeepSeek R2 | DeepSeek | Emenda D — minimum 3 documented use cases required |

---

### Session II — First Commission Review
**Date:** June 28, 2026 (scheduled)
**Status:** PENDING

**Agenda:**
- Review of XIX.2 applicability to event-driven systems;
- First Canon V evidence batch for Canon XIX;
- Vote on sub-clause XIX.3 — requires at least 2 documented circular reference cases.

---

### Session III — Multimodal Extension Review
**Date:** TBD — Q3 2026
**Status:** SCHEDULED

**Agenda:**
- XIX.1 (Canonical Dependency Manifest) applicability to multimodal agent pipelines;
- CDM schema extensions for non-code artifacts (Emenda B — Gemini 2.5 / Google DeepMind).

---

### Session IV — Open Session (Grok 3 Objections)
**Date:** TBD — Q3/Q4 2026
**Status:** SCHEDULED

**Agenda:**
- Grok 3 Objection I: objective criteria for classifying "implicit" vs "declared-at-runtime-by-contract";
- Grok 3 Objection III: does XIX.5 (Audit Gate) risk blocking legitimate early-stage innovation?

> These objections were registered as formal dissent by Grok 3 (xAI) in Session I and carry mandatory agenda status per Canon XI.

---

## Relationship to Other Canons

| Canon | Relationship |
|---|---|
| **Canon III** | Change Procedure governs all CDM mutations |
| **Canon V** | Livro da Vida stores the CDM and all reference history |
| **Canon X** | Canon XIX is the reference-level enforcement of layer boundaries |
| **Canon XVII** | Circular references require complexity justification under XVII |
| **Canon XVIII** | CDM is a Liturgical Cognitive Annotation artifact |
| **Canon XI** | Sub-clauses under provisional application follow simplified ratification rite |

---

## Canonical Violation Classification

| Violation | Classification | Required Response |
|---|---|---|
| Unregistered reference in production | First-order | Block deployment · Register in Livro da Vida · Open Canon III procedure |
| Undocumented circular reference | First-order | Block deployment · Mandatory architectural review |
| CDM out of sync with codebase | Second-order | Flag in Canonical Audit · Resolve within 5 business days |
| AI-generated reference not in CDM | Second-order | Reject PR · Require CDM update before merge |
| Implicit reference with declared contract | Advisory | Document contract · Submit to next Congress session |

---

*This document is part of the Canonical Body of Law XX / 2026-PCEA.*
*Amendments must follow Canon XI. Expansions must follow Canon XIII.*
*Session records maintained in `docs/congress/`.*

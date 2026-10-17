# Operational controls and canonical coverage

Class C explanatory map. Original [canon texts](../../laws/) are authoritative; the rows below describe a bounded implementation, not replacement articles or protocol-wide certification. SI is the current operational terminology; source titles retain their original wording.

| Control | Source articles | Implemented behavior | Evidence and boundary |
| --- | --- | --- | --- |
| DEL-01 Explicit scope | XXIII.2, XXIII.6 | Trusted versioned grants; fixed actions, exact recipients/fields, validity and revocation | Gateway tests and fixtures. Host must protect the policy and bind real identities. |
| DEL-02 Consequence boundary | XXIII.3, XXIII.5 | Gateway checks before adapter dispatch; unknown actions deny | Covers three software actions only. No universal risk classifier or physical control. |
| DEL-03 Specific confirmation | XXIII.4, XXIII.6 | Exact preview; short-lived token bound to request, policy, state and context | Tests altered amount/payload, expiry and replay. Human authentication and presentation are host responsibilities. |
| DEL-04 Least exposure | XXIII.7 | Explicit field and recipient allowlists; no payload/recipient/token values in audit records | Does not detect sensitive content hidden within an allowed body field. Fingerprints can disclose correlations. |
| DEL-05 Freshness and limits | IV.1, XXIII.5–6 | Trusted context revision/uncertainty, safe integer money, per-action/aggregate/count caps, serialization | In-process scope only; no cross-process durable transaction system. |
| DEL-06 Safe dispatch outcomes | XXIII.8–9 | Audit-before-action; reserve attempted ID/budget; uncertain outcomes halt and remain visible | Simulated adapter tests. Cannot roll back an arbitrary real external provider. |
| LOG-01 Record integrity | V.1–3, XXIII.11 | Linked SHA-256 records and optional trusted checkpoint verification | Detects covered edits; completeness/authenticity require an external trust anchor and protected persistence. |
| EVAL-01 Error-path evaluation | XXI.1–3, XXIII.10 | Explicit positive/negative oracle, replay, reason/execution scores and forbidden/unnecessary-action metrics | 27 synthetic cases. Productivity, comprehension and real-model performance are unmeasured. |
| SRC-01 Source preservation | XVI.1, XXII.1–3 | Manifest pins 25 original laws and six prior Book of Life/congress files to baseline hashes | Local manifest must itself be independently trusted. Git/PR records carry implementation provenance. |
| COG-01 Human reconstruction | XVIII.2–4 | Intent comments, walkthrough, decision record and review questions | Presence of comments does not prove understanding; human review/pilot evidence is required. |
| GOV-01 Controlled evolution | III.1–5, XI.1–3 | Qualification #16, adaptation term, spec, plan, ADA and reviewable PR | Operational implementation; no normative amendment or provisional ratification. |

## Coverage by canon

| Canons | Current operational coverage |
| --- | --- |
| 0, I | Source preservation and original authority retained. Precedence interpretation remains a governance review; the gateway does not adjudicate all canonical conflicts. |
| II, III | Explicit scope/classification of this change and traceable qualified implementation. General project classification remains manual. |
| IV, V | Bounded consequence caps and auditable event mechanism. Complete risk analysis/durable immutable storage require host controls. |
| VI, VII, VIII, IX, X, XII, XVII | Small JSON, audit, policy/dispatch and evaluation units with explained dependencies. No general architecture or ornamental-pattern detector is claimed. |
| XI, XIII | Existing amendment/expansion process preserved; this delivery implements existing requirements without creating a canon. |
| XIV | Narrow data/authority boundaries and failure handling. Authentication, deployment security and full adaptive cybersecurity are outside this simulator. |
| XV | Exact preview, reason codes and distinct observed/uncertain outcomes. Accessibility and user testing require a pilot. |
| XVI | Pinned source-byte checks; no automated verification of every interpretation or context reset. |
| XVIII | Intent comments and reconstructive review procedure; cognitive benefit remains unmeasured. |
| XIX | Version/source/claim limits are documented. Bibliography integrity remains an editorial verification task. |
| XX | Explicit JSON artifact interfaces and ADA. No general distributed multi-agent conflict resolver. |
| XXI, XXII | Fixture scoring, CI and code/source fingerprints; independent evaluation and externally anchored provenance remain required. |
| XXIII | Partial executable reference for the named delegation/error paths. Three action types cannot cover all external consequences. |
| XXIV | Original text preserved; no embodied physical control, clinical implementation or robotics validation. |

## How to add a control

Name a concrete failure and affected article, specify expected permitted and forbidden behavior, add a failing regression and independent fixture label, implement the smallest control, reproduce evidence, and obtain a human review. If the rule itself must change, use the separate normative amendment procedure. An operational control map cannot silently amend a canon.

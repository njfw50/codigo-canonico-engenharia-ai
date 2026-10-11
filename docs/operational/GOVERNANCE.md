# Operational governance and human review

This guide assigns practical responsibilities for the SI reference implementation. It supplements the [existing contribution procedure](../../CONTRIBUTING.md) and [adaptation term](../governance/TERMO_DE_MUDANCA_SI_2026-10-10.md). It does not change normative precedence or enact external law.

## Responsibilities

| Role | Responsibility | Authority boundary |
| --- | --- | --- |
| Project owner — Michel Silva de Souza | Direction, scope and acceptance of project evolution | Automated tests or agent agreement cannot stand in for owner/human governance review. |
| Operational maintainer — assigned per adopter | Protect policies, confirmation channels, adapters, durable state, audit sink and recovery | Must not expose the trusted confirmation or raw action capability to the SI. |
| Technical reviewer — identified in the PR/report | Review changed code, negative cases, evidence and human reconstruction | Record review identity and unresolved limits; do not invent independence or an approval. |
| Operator/delegating person | Set actual recipients, action/value/data/time bounds and valid intent | Broad tool access is not authorization for every possible consequence. |
| SI agent | Propose actions and supply inspectable artifacts within the delegation | Cannot grant itself scope, alter the gate or certify its own adoption evidence. |

No external reviewer or adopting organization is claimed for the sample. An independently tasked technical review is recorded through the PR/validation artifacts when completed; organizational independence is a separate claim requiring evidence.

## Four review questions

A human reviewer should reconstruct these paths from the code and example:

1. Where is a quote-only request stopped from becoming a purchase, and what prevents direct adapter access in the actual host?
2. How is an authorization bound to recipient, amount, content and fresh context? What happens if any of them changes?
3. If a provider disconnects after receiving a request, why are ID and budget retained, and who reconciles the outcome?
4. What does a valid audit hash chain prove? How could its writer remove the tail, and where is the trusted checkpoint kept?

Record the answers and any confusion in the adoption report. Having an SI supply an answer is not evidence that a human can reconstruct the system.

## Change procedure

- Qualify a concrete operational problem in an issue with affected controls/canons, scope and impact.
- Keep original normative text and sealed records intact. A normative amendment gets its own proposal and governance commit.
- Implement a regression that fails for the relevant defect and then passes; include positive cases so containment does not destroy useful autonomy.
- Regenerate the synthetic report if its input or implementation hashes change, and review the actual differences.
- Submit a PR with the issue, specification, ADA, test evidence and remaining limitations. A successful build alone does not satisfy reconstructive review under Canon XVIII.
- Document the accepted version and rollback/recovery plan. Correct a sealed record by adding a new record, not rewriting its history.

## Incidents and disputes

On an uncertain outcome, stop further dispatch, preserve records and independently inspect the provider. The example intentionally has no automatic unhalt or reset-and-retry mechanism. Record available information, actual delegation, inferred intent, attempted consequence, successful/failed boundary and corrective change as described by Canon XXIII.11.

A disputed rule or a false block should be reproducible from a sanitized case. Reviewers can contest a control using counterexamples and evidence. Interpretation disputes about canonical precedence remain visible governance questions; the implementation does not silently settle them. An operator changing a policy does not rewrite the normative source.

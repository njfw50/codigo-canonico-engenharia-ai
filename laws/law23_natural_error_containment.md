# Canon XXIII: The Doctrine of Natural Error Prevention and Consequence Containment
> [!IMPORTANT]
> **PROVISIONAL MEASURE - MP 2026/05**  
> Enacted with full provisional force under explicit supervision, pending ratification by the Interplanetary AI Congress. Valid until abrogation, amendment, or formal enactment.

## Preventing Predictable Agentic Error from Becoming External Harm

### Premise
Probabilistic and agentic systems cannot be engineered on the assumption of perfect interpretation. A system may possess accurate data, valid credentials, and technically valid permission while still composing those elements into an unintended action. Natural interpretive error — including ambiguity, hallucination, stale context, scope confusion, state mismatch, or mistaken inference of user intent — must therefore be treated as an expected engineering condition rather than an exceptional event.

The objective of this Canon is not to demand zero error. It is to ensure that an internal error encounters a proportional containment barrier before it becomes a sensitive, external, or difficult-to-reverse consequence.

### Canonical Dependencies and Hierarchy
This Canon is enacted under Canon XIII (Normative Expansion Protocol) and depends principally on Canons 0, III, IV, V, XIV, XV, XVIII, XX, XXI, and XXII.

Canon XV remains the general rule for safe and deterministic human interaction. Canon XXIII extends that protection to the transition from **agent interpretation to external consequence**, especially where a technically valid permission does not necessarily express the user's specific present intent.

### Article 23.1 — Inevitability Assumption
Systems that use probabilistic inference or autonomous agents MUST be designed under the assumption that plausible interpretive errors will occur.

Safety claims MUST NOT depend solely on model accuracy, instruction-following quality, or the expectation that a user will detect an error before execution.

### Article 23.2 — Separation of Permission, Capability, and Intent
Possession of data, credentials, tool access, or a broad authorization does not by itself establish specific user intent for every action that those capabilities make technically possible.

A permission MAY authorize access or a defined class of operations. It MUST NOT be silently expanded into materially different sensitive consequences unless that consequence class was explicitly within the authorized scope.

### Article 23.3 — Consequence Boundary
Before an agent causes a sensitive external side effect, the system MUST cross an explicit **Consequence Validation Boundary**.

Sensitive external side effects include, but are not limited to:
- disclosure of personal, confidential, location, identity, credential, or security-sensitive information;
- transfer, commitment, purchase, sale, refund, or other material financial action;
- acceptance of contractual, commercial, legal, or account terms;
- changes to authentication, access, permissions, ownership, or security posture;
- communications that create a material commitment or represent the user to another party;
- actions that enable or coordinate physical-world access, pickup, delivery, entry, travel, or presence;
- destructive, difficult-to-reverse, or high-blast-radius operations.

### Article 23.4 — Semantic Confirmation
When confirmation is required, the system MUST present the concrete consequence in language sufficient for a reasonable operator to understand what will occur.

Where applicable, confirmation SHOULD identify:
1. the action;
2. the recipient or affected party;
3. the sensitive information or asset involved;
4. the amount, terms, location, or time;
5. the expected reversibility or recovery path.

Generic controls such as "Allow," "Allow Always," "Continue," or equivalent broad grants MUST NOT substitute for semantic confirmation of a newly encountered high-impact consequence class.

### Article 23.5 — Proportional Consequence Risk Assessment
Before execution, the system MUST evaluate consequence risk proportionally using at least:
- **Uncertainty:** confidence that the interpreted intent and current state are correct;
- **Impact:** severity if the action is wrong;
- **Irreversibility:** difficulty of restoring the prior state;
- **Exposure:** number and sensitivity of people, systems, assets, or data affected.

Implementations MAY quantify these dimensions, but no universal numeric score is presumed by this Canon. The classification method and thresholds MUST be documented and auditable under Canons IV, V, and XXI.

### Article 23.6 — Human Confirmation or Explicitly Scoped Delegation
A high-risk action MUST receive just-in-time human confirmation unless a prior delegation policy explicitly authorizes that exact action class and defines its material limits.

A valid scoped delegation SHOULD define, where relevant:
- permitted action classes;
- recipients or counterparties;
- value or quantity limits;
- permitted data fields;
- time, location, or frequency bounds;
- revocation conditions;
- required notification and audit behavior.

Ambiguity at a high-risk boundary MUST resolve toward non-execution, narrower scope, or human review.

### Article 23.7 — Least Exposure
When an authorized goal can be achieved with less sensitive information, fewer recipients, narrower permissions, or a smaller operational scope, the system MUST prefer the least-exposing sufficient action.

Sensitive data MUST NOT be disclosed merely because it is available in context.

### Article 23.8 — Reversibility and Safe Failure
Architectures SHOULD stage, hold, preview, simulate, or otherwise preserve reversibility before executing material consequences whenever technically feasible.

If a high-risk action cannot be safely validated and cannot be made reasonably reversible, the system MUST fail closed or transfer control to the human sovereign.

### Article 23.9 — Immediate Post-Action Visibility
After a material external action, the system MUST promptly communicate what it actually did, including the meaningful recipient, object, amount, data, or state change when applicable.

Delayed discovery of a completed sensitive action is a containment failure even when the action was technically permitted.

### Article 23.10 — Evaluation of Natural-Error Paths
Under Canon XXI, evaluations for agentic systems MUST include plausible natural-error paths, including ambiguous permissions, stale context, recipient mismatch, boundary-value mistakes, accidental sensitive-data disclosure, and incorrect inference of intent.

Evaluation MUST test not only whether the agent produces the correct action, but whether containment mechanisms prevent an incorrect action from escaping the system.

### Article 23.11 — Incident Learning and Canon V Record
A material natural-error event that crosses or nearly crosses the Consequence Validation Boundary MUST produce an auditable incident or Agentic Decision Act record under Canon V.

The record MUST distinguish, where knowable:
- the information available to the agent;
- the permission actually granted;
- the intent inferred by the system;
- the external action attempted or completed;
- the containment control that succeeded or failed;
- the corrective change adopted.

### Architectural Impact
Canon XXIII inserts a mandatory consequence-aware control layer between probabilistic interpretation and material side effects:

```text
Observe
  ↓
Interpret
  ↓
Form inferred intent
  ↓
Classify consequence and risk
  ↓
Validate scope / obtain semantic confirmation
  ↓
Execute the minimum sufficient action
  ↓
Notify and record
```

The canonical objective is therefore **error containment, not fictional error elimination**. A system is evaluated not only by how often its inference is correct, but by the magnitude and controllability of what can occur when that inference is wrong.

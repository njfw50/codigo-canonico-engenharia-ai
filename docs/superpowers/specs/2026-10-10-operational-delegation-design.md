# SI operational delegation and verifiable evidence

**Owner:** Michel Silva de Souza. **Qualification:** [Issue #16](https://github.com/njfw50/codigo-canonico-engenharia-ai/issues/16).
**Source baseline:** `12c7e09630d6412681768d963c4bcb8113c0be55`.
**Authorization:** The owner instructed “Aplica profundamente ao projeto” after reviewing the six proposed improvements, then requested the terminology **SI — Super Inteligência**. This document makes the implementation choices explicit within that approved scope.

## Intended result

Give developers, students and small organizations a reproducible way to examine whether an SI agent's proposed action stays inside a human-defined delegation. Success is observable containment of specified error paths while permitted actions continue to work. Social relevance, adoption, productivity and cognitive benefit require subsequent independent pilots; the simulator cannot establish them.

## Constraints

- CommonJS, Node >=14.0.0, zero new dependencies, no external services or credentials.
- Preserve every original `laws/` file, previous Book of Life and congress record, and the existing checkout example byte-for-byte.
- Use SI in new prose. Historical canon titles, published citations and repository identifiers retain their source wording.
- No full-protocol certification, claim of external endorsement, production payment implementation or robotics control.
- No install required to run the example or checks; the existing installation hook is outside this change.

## Boundaries and interfaces

`operational/gateway.js` exports `createGateway({policy, execute, clock, context, audit})`. The trusted host supplies a policy, an action adapter, a current clock, a fresh context provider and an audit log. The SI supplies JSON requests only. The gateway exposes `inspect(request)`, `confirm(request)`, `execute(request, token)`, and `state()`.

The fixed registry supports `quote.prepare` (internal), `message.send` (external) and `purchase.commit` (external financial consequence). The agent cannot redefine action risk. Every policy permission names the action, exact recipient allowlist and payload field allowlist. Financial permissions additionally require currency and an integer minor-unit per-action cap; the policy requires cumulative amount and action-count caps, validity dates, revocation and version.

Requests include an ID, action, payload, context revision and expected gateway state version. Purchase amounts are nonnegative safe integers in minor units. Unknown fields/actions, invalid schema, stale state, unexpected recipients/data, expiry/revocation and breached limits produce `deny`; uncertain context or a missing narrowly required confirmation produces `review`. All decisions return stable reason codes. Inspection performs no action.

`confirm` is a trusted host function, invoked only after presenting the exact preview in a human-controlled channel. It issues a short-lived random token bound to the full request, current policy and gateway/context version. It is not an identity verifier and must never be offered as an SI tool. A token cannot broaden a denied scope, authorize a changed request or survive consumption.

Execution clones inputs on submission and serializes all dispatches. Immediately before dispatch it rechecks time, context, policy and limits. A durable intent audit entry is required before calling the adapter; the adapter receives a frozen request. Attempts reserve ID, count and spend, including uncertain failures. Failed adapters or failed post-action audit halt further dispatch. Results distinguish non-execution, observed success and uncertain outcomes; they never describe a completed action as blocked. State is in-process only; production adopters must supply transactional durable state, isolation and adapter idempotency.

`operational/audit.js` exports `createAuditLog({sink})` and `verifyAuditLog(entries, checkpoint)`. The sink is synchronous and throws on failed persistence. Entries contain bounded metadata and fingerprints, not payload values or confirmation secrets. A SHA-256 chain detects edits/reordering; a separately trusted checkpoint is required to detect truncation or wholesale replacement. The in-memory default is a demonstration, not durable or tamper-proof storage.

## Evidence and honest audit

`evaluation/scenarios.json` declares positive and negative expected outcomes independently of the gateway. `evaluation/run.js` replays the same synthetic proposals through a clearly labeled unprotected dispatch baseline and the gateway. Report expected/observed decisions, escaped prohibited actions, unnecessary holds, reasons and source hashes. Productivity, cognitive understanding, external validation and real model performance remain explicitly unmeasured.

`scripts/audit.js` checks pinned canonical source hashes and fixture outcomes in this distribution. The CLI names exactly what it checked; it cannot audit an arbitrary consumer project. `npm test` runs gateway/audit/integration regressions and the existing checkout verification. CI runs the suite and scoped audit on the declared Node floor and a current supported runtime.

## Adoption and governance

Provide a bilingual starter, control-to-article map distinguishing automated/partial/manual controls, a pilot protocol with matched tasks and independent outcome assessment, an adoption report template, and named operational roles (owner, adapter maintainer, independent reviewer and operator). Require a reconstructive human review before merging. These operational documents neither ratify provisional canons nor change the existing normative authority hierarchy.

## Verification focus

Test valid scoped autonomy and confirm-required execution, malformed/nonfinite/oversized JSON, policy mutation, revoked/expired grants, stale/context-uncertain requests, exact recipient/data binding, amount/currency limits, token substitution/expiry/replay, duplicate request IDs, concurrent spending, mutable queued inputs, audit failure before/after dispatch, adapter failures and trusted-checkpoint truncation detection. Preserve source files and report coverage limits visibly.

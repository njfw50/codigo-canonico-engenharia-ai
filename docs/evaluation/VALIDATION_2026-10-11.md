# SI adaptation — validation after technical review

**Date:** 2026-10-11 UTC.  
**Qualification:** [Issue #16](https://github.com/njfw50/codigo-canonico-engenharia-ai/issues/16).  
**Change term:** [TC-SI-20261010-001](../governance/TERMO_DE_MUDANCA_SI_2026-10-10.md).  
**Baseline:** `12c7e09630d6412681768d963c4bcb8113c0be55`.  
**Previous decision record:** [ADA-20261010-001](../book_of_life/ADA-20261010-001.md).

This supplements the sealed qualification record. Its 41-test candidate-stage evidence remains unchanged; the seven regressions below bring the current suite to 48. The pull request and Git commits identify the published candidate.

## Review and corrections

A separate SI reviewer inspected candidate `84a3cff`, reproduced its tests and reviewed the source boundaries. This is technical assistance, not external organizational validation or the owner's human reconstructive review.

| Finding | Correction and evidence |
| --- | --- |
| Important: an injected Promise-returning `audit.append` bypassed the synchronous recording boundary | Reject and consume thenables. Four regressions cover pre-action recording, confirmation, post-action visibility and rejected promises. No adapter call occurs when pre-action recording is asynchronous. A post-action failure retains observed execution and halts the gateway. |
| Minor: action and currency validation accepted coercible non-string JSON values | Require strings before lookup or currency matching. Two regressions cover malformed permission fields and a malformed request currency. |
| Minor: timezone-free and normalized invalid dates could pass the UTC policy contract | Require explicit `Z` timestamps with seconds and optional three-digit milliseconds; round-trip valid calendar dates. One regression covers invalid dates/formats and valid alternatives. |

Before correction, the suite reproduced all seven new failures: 41/48 passed. After correction, 48/48 passed. The separate reviewer checked the correction delta, reproduced the seven targeted regressions and the refreshed 27-case report, and reported no outstanding prior finding. No Critical finding was reported.

## Reproducible verification

| Check | Observed result |
| --- | --- |
| `node test/run.js` on Node 24.19.0 and 14.21.3 | 48/48 passed on each runtime. |
| `node examples/checkout/verify.js` on both runtimes | Six valid quotes and eight invalid inputs verified. |
| `node scripts/evaluate.js --check docs/evaluation/delegation-report.json` on both runtimes | All 27 decisions, reasons, execution outcomes and source fingerprints reproduced. |
| Synthetic outcomes | Five expected executions and 22 expected holds; zero prohibited executions and zero unnecessary holds in this fixture set. |
| `node scripts/audit.js` on both runtimes | 31/31 pinned baseline source/record hashes and 27/27 fixture decisions match. |
| Comparison with baseline under `laws/`, earlier historical records and `examples/checkout/` | All 37 existing artifacts remain byte-identical. |
| `node examples/delegation/demo.js` | Quote dispatched to the simulated adapter; purchase denied with `ACTION_NOT_DELEGATED`. |
| Relative Markdown file links in changed documents | 94 checked at this stage; no missing target. |
| `git diff --check` | Passed. |

Commands require no new dependencies or live external actions. Node 14 is checked as the declared compatibility floor; this result does not make that legacy runtime a production recommendation. CI repeats the executable checks on Node 14 and 24.

## Remaining scope and integration

The [pilot procedure](PILOT.md) defines the measurements still needed for productivity, human comprehension, real-model performance and social adoption. Authentication, durable transactional state, independent checkpoint storage, provider reconciliation and physical controls remain adopter responsibilities as specified in the [walkthrough](../../examples/delegation/README.md).

This record establishes readiness for a reviewable pull request. Human reconstruction and main-branch integration are separate events; neither is asserted here. Later changes or incidents require new evidence and records rather than rewriting the sealed qualification history.

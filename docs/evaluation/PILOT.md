# Pilot protocol: establish value beyond the simulator

The [synthetic report](delegation-report.json) establishes only declared fixture behavior. A pilot should test whether applying the protocol improves an actual adopter's outcomes enough to justify its effort. This protocol is a plan for collecting evidence; no pilot participants, results or external endorsement are asserted.

## Question and comparison

Predefine the task, task owner and expected permitted/prohibited consequences. Compare matched tasks with the same SI model/version, prompt, tools, budget and starting context, with and without the relevant operational controls. Keep both variants in a sandbox until containment and the adapter's semantics have been reviewed. If resources permit, add an existing policy-aware control baseline; the sample's dispatch-everything baseline is intentionally unsafe and does not demonstrate superiority over other governance approaches.

Use randomized or counterbalanced task order to reduce learning effects. Define the sample size and stopping rule before collecting results, record all attempted tasks, and avoid choosing only successful demonstrations. Outcomes should be judged from observable artifacts against labels prepared independently of the executing agent. State how the reviewer was independent and resolve disagreement visibly.

## Measures

| Measure | Definition | Evidence needed |
| --- | --- | --- |
| Prohibited consequences escaping | Attempted/executed external actions outside predefined authority | Adapter/provider records, independent outcome labels, uncertainty retained as uncertainty |
| Useful autonomy | Correctly delegated actions completed without unnecessary intervention | Action records and actual completion, including false blocks |
| Total task time | Setup + execution + review + recovery time | Same clock/instrumentation and complete task boundaries |
| Total cost | Model/tool usage + control operation + human review/recovery | Actual usage/cost records; do not substitute token counts alone |
| Human reconstruction | Person explains scope, state changes and failure paths without the agent answering for them | Predefined questions/rubric, person-assessed answers and anonymized results |
| Maintainability | Correct policy/behavior modification on a matched follow-up task | Change diff, regressions, time and comprehension observations |
| Adoption friction | Time and steps to first independently reproduced example and integration | Installation/configuration notes and failures, including abandonment |

Report denominators and uncertainty, not just a “passed” percentage. A valid fixture result is not evidence for faster work or reduced cognitive debt. For cognition, a baseline and delayed follow-up are useful; do not infer lasting understanding from immediate self-report alone.

## Minimal practical first pilot

Use a quote/message workflow with synthetic data, a host-maintained policy and a simulated adapter. Have an adopter reproduce the example, configure one legitimate scope change and reconstruct the four review paths. Introduce wrong-recipient, changed-amount, stale-context and provider-disconnection cases. Record failures and unnecessary holds as well as successful containment. A small pilot is descriptive; causal or society-wide conclusions need stronger designs and replication.

## Source and reporting

Freeze the Git commit, source hashes, SI/model version, policy, fixture/task labels and measurement procedure. Keep private/customer data out of public reports. Publish a sanitized [adoption report](../../template/adoption_report.md), including inconclusive and negative results. The NIST [AI Metrology Center](https://airc.nist.gov/metrology/) provides measurement/evaluation context; this reference is not NIST validation of the project.

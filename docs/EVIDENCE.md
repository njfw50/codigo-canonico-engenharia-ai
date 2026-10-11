# Evidence, references and scope

Class C · Editorial research context · Reviewed 2026-10-10.

The Canonical Protocol is a methodological proposal by Michel Silva de Souza. Its canons define rules for projects that adopt it. The checkout example demonstrates one policy and dependency boundary. The SI delegation layer adds a bounded executable reference and synthetic fixture evidence described below. No controlled study of this protocol, independent certification or measured reduction in cognitive debt is presented here.

## Reproducible operational evidence — October 10, 2026

[Report](./evaluation/delegation-report.json) · [Declared oracle](../evaluation/scenarios.json) · [Gateway](../operational/gateway.js) · [Control coverage](./operational/CONTROLS.md)

The replay exercises 27 fixed proposals: five expected executions and 22 expected holds. The gateway matches all declared decisions, reasons and execution outcomes, with zero prohibited dispatches and zero unnecessary holds **on this constructed set**. Its audit chains verify against checkpoints produced for each replay. The unprotected comparison dispatches every target proposal; it is deliberately unsafe, not a competing SI model, production product or representative industry baseline.

Reproduce using `node scripts/evaluate.js --check docs/evaluation/delegation-report.json` from the repository root. The report fingerprints fixtures, policy, gateway, JSON/audit helpers and evaluator. A changed implementation/input requires regeneration and review. The unit suite also exercises concurrent limits, uncertain adapter outcomes and before/after-action audit failures beyond the fixture set.

This measures the mechanism's declared behavior only. Real model performance, cognition, productivity, organizational adoption and independent validation remain unmeasured. Use the [pilot protocol](./evaluation/PILOT.md) and [adoption report](../template/adoption_report.md) to collect further evidence, including negative findings. The NIST [AI Metrology Center](https://airc.nist.gov/metrology/) is related measurement context, not validation or endorsement of this protocol.

## Traceable research context

| Primary source | What it supports | Boundary of the claim |
| --- | --- | --- |
| Perry, Neil; Srivastava, Megha; Kumar, Deepak; Boneh, Dan (2023). *Do Users Write More Insecure Code with AI Assistants?* CCS ’23, pp. 2785–2799. [DOI](https://doi.org/10.1145/3576915.3623157); [author manuscript](https://arxiv.org/abs/2211.03622v3). | In the studied security tasks, participants using the evaluated assistant produced less secure code and were more likely to believe it was secure. | Evidence concerns that study and assistant; it does not establish the performance of every current model or validate this protocol. |
| Lee, Hao-Ping; Sarkar, Advait; Tankelevitch, Lev; Drosos, Ian; Rintel, Sean; Banks, Richard; Wilson, Nicholas (2025). *The Impact of Generative AI on Critical Thinking: Self-Reported Reductions in Cognitive Effort and Confidence Effects From a Survey of Knowledge Workers.* CHI ’25, Article 1121. [DOI](https://doi.org/10.1145/3706598.3713778); [authors’ publication page](https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/). | Survey reports associate greater confidence in GenAI with less critical-thinking effort; review and verification remain important activities. | Self-reported associations in knowledge work are not causal proof of cognitive atrophy or a software-specific evaluation of the Canonical Protocol. |

## Project claims and validation

- **Liturgical Cognitive Annotation:** the project's proposed method for explaining why generated code exists. Its efficacy requires evaluation beyond this example.
- **Cognitive debt:** the project's framing of a loss of system understanding. The linked research motivates scrutiny; it does not prove that this method prevents it.
- **Architectural enforcement:** the repository contains configuration instructions, source-integrity checks and a bounded delegation implementation. It does not provide a mathematical proof of architecture correctness or a complete validator for all canons.
- **Governance records:** project decisions involving named AI models are not evidence of endorsement by their developers.
- **Adoption:** a use report should name the source version, the task, the evidence and the limits. Do not substitute a source badge or a successful build for that report.

## Bibliographic maintenance

Earlier introductory drafts used broad institutional attributions and incomplete illustrative references. This note replaces those items as the current evidence inventory. Unverified items are not represented as publications. Historical commits and original canons remain available unchanged.

Project citation: Silva de Souza, Michel (2026). *The Canonical Protocol of Engineering & AI: A Structured Technocracy*, v1.3.1. [Zenodo version DOI](https://doi.org/10.5281/zenodo.21006705). See [CITATION.cff](../CITATION.cff) and include a commit when referring to newer work on main.

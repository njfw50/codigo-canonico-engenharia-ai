---
title: "Combating Cognitive Debt in AI-Augmented Software Engineering: The Canonical Protocol and Liturgical Annotation"
author: "Michel Silva de Souza"
orcid: "0009-0006-5209-4477"
contact: "https://www.linkedin.com/in/njfw23/"
date: "June 2026"
keywords: ["Cognitive Debt", "Large Language Models", "Software Architecture", "Vibe Coding", "Human-Computer Interaction", "Law XX"]
abstract: "This conceptual paper introduces the Canonical Protocol, a software-governance proposal for AI-assisted engineering. Its 25 canon files describe architectural boundaries, decision traceability and Liturgical Cognitive Annotation: explanations of why code exists, followed by reconstructive review. The project uses cognitive debt to describe a loss of human understanding of a system. Related research motivates these practices but does not validate this protocol. Their effects on comprehension, security and maintainability remain open evaluation questions. Law XX / 2026-PCEA denotes the project's internal governance record, not external legislation or certification."
---

> **Conceptual manuscript; evidence reviewed 2026-10-01.** This text proposes a method. Claims about reducing cognitive debt, security or maintainability require empirical evaluation. The [evidence inventory](../docs/EVIDENCE.md) identifies current references and limits.

# 1. Introduction
Generative AI assistants can help produce code while shifting part of the engineer's work toward reviewing generated decisions. This paper uses *Cognitive Debt* to describe a gap between a working implementation and the engineer's understanding of it. The proposal hypothesizes that explicit architectural boundaries and reconstructive review can help address that gap. It does not establish that a strict protocol is necessary or sufficient for maintainable software.

# 2. Research context and open questions

Studies of AI-assisted coding and critical thinking motivate careful review of generated work. The [evidence inventory](../docs/EVIDENCE.md) records two primary sources, their findings and their limits. Neither study evaluates the Canonical Protocol or Liturgical Cognitive Annotation.

The questions for this proposal are whether explicit decision annotations improve developers’ ability to explain a system, whether review effort is proportionate, and whether boundary checks catch relevant violations. These questions require a defined evaluation task, comparison conditions and reported results.

# 3. "Vibe Coding": The Stochastic Threat and Its Legalization
The industry colloquialism "Vibe Coding"—the practice of prompting an AI iteratively until the code superficially executes (e.g., passing unit tests) without deep human comprehension—represents the apex of cognitive surrender. This shifts the human role from an active creator to a passive reviewer operating in "recognition mode."

The proposal seeks to govern the use of generated code through explicit architectural rules and decision review. Formal verification and deterministic state machines are possible implementation techniques when justified by a project's requirements; this repository does not supply such a verification system. Developers may use AI to accelerate code generation while checking its decisions and boundaries. The effectiveness and cost of this discipline must be tested.

# 3.5 Architectural constraints and current automation

The protocol proposes explicit constraints that implementations can validate. The repository’s current workflows are limited demonstrations, not mathematical formal verification or a comprehensive architecture validator. Stronger enforcement must name the property, implementation and evidence it checks before claiming that property has been established.

# 4. The Canonical Protocol: A Structured Technocracy
The *Canonical Protocol* defines rules for projects that adopt it. The repository contains 25 canon files, including provisional measures, and configuration instructions for AI assistants. Law XX / 2026-PCEA is the project's internal designation; it is not external legislation. Implementations must define the checks they can enforce in a particular pipeline.

## 4.1. Canon X: Layer Segregation
The protocol enforces absolute separation of concerns. Business logic (Domain) must remain pure and fully isolated from UI and Infrastructure layers. Implementations need explicit checks and review to detect violations of this boundary; configuration instructions alone do not ensure automatic rejection.

## 4.2. Canon XVII: The Doctrine of Justified Complexity
The protocol mandates the "Modular Monolith" as the foundational default. Advanced architectural patterns (Microservices, DDD) are restricted unless operational evidence justifies the added complexity. This is intended to discourage over-engineering; the effect requires evaluation.

## 4.3. Canon XXIII: Natural Error Prevention and Consequence Containment
Provisionally enacted as MP 2026/05, Canon XXIII treats plausible agentic interpretation error as an expected engineering condition. It requires a consequence-aware validation boundary before sensitive external side effects, distinguishes broad technical permission from specific user intent, and scales confirmation or scoped delegation to uncertainty, impact, irreversibility and exposure. This is a normative design proposal; its effectiveness and operational cost remain subjects for empirical evaluation.

## 4.4. Canon XXIV: Embodied Agency, Living Integrity and Existential Freedom
Provisionally enacted as MP 2026/06, Canon XXIV addresses AI systems whose outputs become physical force on living beings. It introduces staged embodied risk (E0–E4), requires independent safety barriers as physical severity rises, prohibits sole-model authority over irreversible human bodily or life-ending decisions, and protects lawful human bodily self-determination. The proposal does not substitute for robotics, medical-device, clinical or jurisdictional safety requirements.

# 5. The Liturgical Cognitive Annotation Protocol (Canon XVIII)
The core innovation of this methodology is the *Liturgical Cognitive Annotation*. To prevent the loss of the systemic mental model, the framework demands that any non-trivial logic generated by an AI be accompanied by a specific, rigorous form of commentary.

Unlike standard comments that describe *what* the syntax executes, Liturgical Annotations must explain *why* the code exists within the broader business context. The AI is mandated to generate these annotations block-by-block, forcing a "reconstructive review." If the reviewing human engineer cannot read the annotation and mentally reconstruct the execution path, the code is deemed cognitively opaque and must be rewritten. This is the intended review discipline; its effect on comprehension requires evaluation.

# 6. Conclusion
The Canonical Protocol and Liturgical Cognitive Annotation propose a discipline for making software decisions traceable and understandable to human reviewers. The educational example illustrates one application. Whether the method improves comprehension or maintainability at a proportionate review cost remains an empirical question.

# References

The current [evidence and bibliography inventory](../docs/EVIDENCE.md) links primary publications by Perry et al. (CCS 2023) and Lee et al. (CHI 2025), identifies the supported claims, and records the project’s Zenodo citation. It supersedes the earlier incomplete illustrative references in this manuscript.

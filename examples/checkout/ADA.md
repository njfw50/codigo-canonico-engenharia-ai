# Worked decision record — checkout discount

Class C · Educational example · Author: Michel Silva de Souza · AI assistance: OpenAI Codex.
Recorded 2026-10-01. This describes a fictional teaching example, not a customer purchase or human review already performed.

## Context / Contexto

A discount rule placed in a checkout screen can be duplicated by another caller. A reader needs to locate one policy and explain its outcome. Uma regra de desconto na tela pode ser duplicada por outro componente; este exemplo mantém a decisão em um único lugar.

## Decision / Decisão

- Domain: [discount.js](discount.js) owns the fictional policy: 10% at 10,000 cents or above, rounded down to an integer cent. It rejects ambiguous or out-of-range inputs.
- Application: [quote.js](quote.js) calls that rule and returns subtotal, discount and total.
- Interface: [demo.js](demo.js) supplies a fixed subtotal and formats the returned quote. It does not choose eligibility or rounding.
- No persistence, payment provider or network adapter is needed for this example.

The separation illustrates [Canon X](../../laws/law10_layer_separation.md). Comments explain the decision as required by [Canon XVIII](../../laws/law18_cognitive_sovereignty.md). Scope is kept small under [Canon IX](../../laws/law09_no_ornamental_patterns.md).

## Evidence / Evidência

Run `node examples/checkout/verify.js` from the repository root. The existing verification covers six hand-calculated quotes and eight invalid inputs. It checks both sides of the 10,000-cent threshold, fractional-cent rounding, zero and the upper bound. The demonstration with 12,500 cents produces a 1,250-cent discount and an 11,250-cent total.

## Limits and review / Limites e revisão

The discount policy is invented for teaching. Taxes, shipping, refunds, currencies and payment processing are outside scope. Passing these checks is not a measurement of reduced cognitive debt, real-world security or compliance with every canon. A reader should be able to explain why the domain makes the decision and why the interface only formats it.

Use the [general ADA template](../../template/ADA_template.md) for your own decision and record evidence from your own system.

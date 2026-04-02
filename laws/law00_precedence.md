# Law 0.1 — Canonical Precedence Hierarchy

## Status

Active — Foundational

## Purpose

To establish a strict order of priority among canonical laws for conflict resolution, decision-making, and system validation.

## Principle

When two or more laws are in conflict, decisions MUST follow this exact order of precedence:

1. Security (Law 14 — Cybersecurity)
2. System Integrity (Law 6 — Disciplined Architecture)
3. Structural Separation (Law 10 — Layer Separation)
4. Operational Consistency (Derived)
5. User Experience (Law 15 — User Experience)
6. Convenience / Non-critical Performance

## Rules

* No decision may violate a higher-level law to satisfy a lower-level one.
* Violations of higher-level laws are classified as BLOCKERS.
* Violations of lower-level laws may be handled as controlled exceptions.

## Implications

* A system with security flaws must never be published.
* A system that does not build reproducibly is invalid.
* UX improvements do not justify architectural violations.

## Application

This law applies to:

* deployment decisions
* code reviews
* prioritization of fixes
* canonical compliance evaluation

## Audit Requirements

Any decision involving conflict between laws must record:

* laws involved
* decision taken
* justification based on precedence

## Author

Author: Michel S de Souza
ORCID: 0009-0006-5209-4477

## Version

1.0.0

# Canonical Template
This directory serves as the base architectural template mandated by Canon X (Layer Segregation) and Canon XVII (Modular Monolith Default).

## Directory Structure
```
src/
├── domain/         # Pure business logic. No frameworks or external DB calls allowed.
├── application/    # Orchestrates domain logic (Use Cases).
├── infrastructure/ # External connections (Database, APIs, File System).
└── ui/             # Presentation layer (React, Vue, HTML). Never talks directly to infrastructure.
```

To use this template, copy it as the root structure of your new project.

## Operational adoption

[Adoption report](./adoption_report.md) records the concrete delegation, expected and observed consequences, false blocks, human reconstruction and limits. Use it with the [pilot protocol](../docs/evaluation/PILOT.md); do not infer adoption or cognitive benefit from a badge.

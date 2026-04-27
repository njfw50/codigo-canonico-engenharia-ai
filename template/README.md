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

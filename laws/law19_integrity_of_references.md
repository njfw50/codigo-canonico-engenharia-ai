# Canon XIX: The Doctrine of Reference Integrity
## The Eradication of "Ghost References" and Import Decay

### Premise
In the era of Advanced Agentic Coding, the speed of structural mutation often leads to "Reference Decay"—a state where the logic assumes the presence of utilities, components, or modules that have not been explicitly declared or imported. This violation of the Doctrine of Traceability creates non-deterministic build failures and compromises the sovereignty of the codebase. This Law mandates an absolute interlock between code execution and reference declaration.

### Article 19.1 — The Prohibition of Ghost References
It is strictly forbidden to deliver or merge any block of code containing references to external or internal utilities (e.g., `cn`, `clx`, `lucide-icons`) without a corresponding, explicit `import` statement in the file header. Reliance on "implicit availability" or "global scope" for non-standard environment variables is a violation of the Protocol.

### Article 19.2 — The Mandatory Import Audit
Every structural change must undergo an **Import Sanity Audit**. The AI Agent or Human Engineer is required to:
1.  Verify the exact source path of every used utility.
2.  Ensure that all UI components (Shadcn/UI, Radix) are imported individually to maintain tree-shaking efficiency and prevent reference collisions.
3.  Validate that the specific exported member exists in the target file.

### Article 19.3 — The Build Interlock
Operational success (Canon XVIII) is secondary to **Reference Integrity**. A system that "works" but contains unimported references that the bundler might resolve through non-standard fallback mechanisms is considered unstable. The build pipeline must fail immediately upon detection of a missing explicit reference.

### Article 19.4 — Agentic Responsibility
When an AI Agent refactors a code block, it is its liturgical duty (Canon XVIII) to reconstruct the entire import tree of the affected file. Failure to update imports during a logic refactor is classified as **Structural Negligence**.

### Architectural Impact
Establishes a hardened, highly deterministic dependency graph. It prevents "Silent Build Failures" and ensures that every piece of logic is fully self-contained or explicitly connected, facilitating high-speed auditing and automated structural analysis.

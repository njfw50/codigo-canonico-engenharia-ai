# Publication validation — 2026-10-01

Scope: ADA-20261001-001 and issue #7. Prepared with OpenAI Codex. These are bounded checks of this change, not certification of the protocol.

## Executed checks

- `node examples/checkout/demo.js`: subtotal $125.00, discount $12.50, total $112.50.
- `node examples/checkout/verify.js`: six literal quote cases and eight invalid inputs passed. The checks cover threshold, fractional-cent rounding, upper bound and rejected ambiguous amounts.
- CITATION.cff validated against the official Citation File Format 1.2.0 JSON Schema. Project version remains 1.3.1 and the version DOI is 10.5281/zenodo.21006705.
- Current reference inventories register Markdown links, JavaScript imports, HTML dependencies, sharing links, sitemap URLs, metadata and JSON-LD references. Local and coordinated-repository targets resolve. Schema entity identifiers are distinguished from HTML anchors.
- Both public pages have a single H1, matching self-canonical URL, reciprocal language alternatives, index/follow metadata, valid JSON-LD, unique IDs, matching share URLs and 23 canon links.
- Public canonical quotations match the unchanged original law files.
- Both social PNGs are 1200 × 630. The Portuguese artwork was visually inspected. Page CSS contains the mobile layout rules; browser rendering has not been verified because the available browser package could not download its executable.
- Original laws, archived congress records, installer/runtime, existing CI, portfolio homepage, robots.txt and Google verification files are unchanged.
- `git diff --check` passed in both repositories.

## Review and publication boundaries

A separate automated reviewer inspected the implementation, demo, references and scope. Its remaining editorial hypothesis/claim concern was corrected. This is not independent human or institutional review.

Live GitHub Actions and Pages deployment are checked after publication and recorded in the linked pull requests/issues. Publication and metadata do not establish Google index status, search position, external adoption or institutional endorsement. Search Console URL Inspection remains the authoritative account-level follow-up; it was not accessed in this session.

Historical September 17 artifact manifests refer to their original commits. The current reference inventories are refreshed for this change. The dated October 1 SHA-256 manifests cover the final changed files and exclude themselves to avoid self-reference.

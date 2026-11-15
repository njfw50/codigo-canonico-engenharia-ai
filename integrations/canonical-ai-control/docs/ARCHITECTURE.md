# Architecture and verification mapping (implementation notes, not new laws)

Source: https://github.com/njfw50/codigo-canonico-engenharia-ai @ `5de1ca45a60ca0f9e516b6ece54e366d59f0e79c`. The source files themselves are **not** included or changed here. `canonical-lock.json` lists paths and Git blob object hashes. At runtime, `consultar_canon` fetches the original file at the exact commit and verifies the Git blob SHA-1. The returned SHA-256 is diagnostic, not an independent trusted root.

- Canon 0 and I: original source authority and deterministic precedence; no new text.
- III and V: explicit mutations require the latest policy version and append an audit event. Local JSONL hash chaining is **tamper-evident, not immutable/WORM**; external durable append-only storage is required to meet stronger claims.
- X and XIX: `src/domain` policy decisions, `src/application` use-cases, `src/infrastructure` storage/identities/source and `src/interface` MCP. No implicit third-party API calls or automatic OS access.
- XIV: fail-closed default, bearer auth per account, distinct adapter secrets, strict schemas, constant-time key checks, replay IDs and version checks.
- XV and XVIII: capability state distinguishes configured policy from actual external enforcement; readable decisions preserve human comprehension.
- XVI: original canonical files are neither paraphrased as normative originals nor edited. Source is pinned, hashes verified before display.
- XX/XXI/XXII: explicit adapter contract, repeatable tests and audit events. No claim of certification.
- XXIII: sensitive operations return `needs_confirmation`; the adapter must implement a separate, independently authenticated, user-visible consequence confirmation before performing them. The reference implementation does **not** issue confirmation receipts and thus never auto-allows sensitive operations.
- XXIV: direct physical control returns `needs_confirmation` and requires independent device-level safety infrastructure; this plugin is not such a system.

## Threat/limits for production

The MVP uses JSON files and environment keys. To serve multiple end-users reliably, replace static keys with OAuth 2.1 (MCP protected resource metadata, PKCE and user isolation), transactional database versioning, strict audit retention/WORM or equivalent, secrets rotation, TLS, monitoring, rate limiting, privacy disclosures, legal review and a device/provider-specific adapter validation process. This is a working technical prototype, **not a public production-ready plugin**. Running multiple backend replicas against JSON storage is unsupported. Every app not using `/gate` remains outside technical enforcement. Never interpret toggle labels as rights to force changes to a third-party system. The original laws are project governance principles, not government statutes.

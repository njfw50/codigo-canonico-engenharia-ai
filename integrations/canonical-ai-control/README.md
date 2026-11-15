# Canonical AI Control — GitHub + HTTPS adapter (v0.2.0)

**Author of canonical text:** Michel Silva de Souza. This implementation **does not add or modify any canon**. The source of truth is pinned to commit `5de1ca45a60ca0f9e516b6ece54e366d59f0e79c` in [`njfw50/codigo-canonico-engenharia-ai`](https://github.com/njfw50/codigo-canonico-engenharia-ai).

This directory is designed as a **Vercel project root** for an HTTPS MCP endpoint. Github Pages alone cannot execute dynamic MCP requests. All production serverless controls are intentionally disabled until durable persistence, per-user auth, audit logging, and integrated agent adapters are implemented and verified; the published MCP interface initially exposes only read-only consultation. No button can modify another application's native permissions without that provider's integration.

## Local testing

Use Node >=20; run `npm test` and `npm start`. Local development may use `CANONICAL_USERS_JSON` with per-user high entropy bearer tokens and `CANONICAL_DATA_DIR` for a local JSON policy store. This file store is **not approved for serverless, concurrent or public multi-user writes**. `/gate` refuses all remote decisions until an actual authenticated enforcement adapter is implemented.

## Deploy

- Connect this GitHub repo to Vercel (rootDirectory `integrations/canonical-ai-control`), deploying in `preview` first.
- Confirm `/health` and `POST /mcp` `initialize`, `tools/list`, `tools/call` for `estado_canonico`.
- Substitute the **actual HTTPS endpoint** for the placeholder in `mcp.json` only after deployment is live.
- For private use, install as a custom MCP plugin where enabled; for public directory publication complete auth, persistence, privacy/security review and platform submission. No automatic public listing is implied by hosting.

The security of local development does not make this a production permission service. **Do not set a flag to unlock serverless writes.**

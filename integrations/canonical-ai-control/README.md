# Canonical AI Control — plugin MCP v0.2.0

**Author of the normative source:** Michel Silva de Souza. Source: https://github.com/njfw50/codigo-canonico-engenharia-ai (commit `5de1ca45a60ca0f9e516b6ece54e366d59f0e79c`). This project creates **no new Canons** and changes **zero** files in the original repository.

This is a functional private technical prototype that provides policy profiles for different AI agents, on/off capability settings, a remote MCP tool interface and an HTTP `/gate` enforcement endpoint for **agents whose owners deliberately integrate it**. It cannot silently change system permissions or control separate ChatGPT/Google/Android/Apple apps. Activation in the policy is distinct from real integration. Risky actions require an independent consequence-confirmation mechanism in the external adapter.

## Run it locally (Node.js >=14, zero dependencies)

1. Create two unique 32-byte random tokens (separate user key and adapter key):
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
2. Put them in your **environment** (not the source, not an AI prompt). Configure:
   `CANONICAL_USERS_JSON='{"user1":"YOUR_64_HEX_USER_KEY"}'`
   `CANONICAL_ADAPTERS_JSON='{"user1:muse":"YOUR_DIFFERENT_64_HEX_ADAPTER_KEY"}'`
3. `npm test` and `npm start` (listens on port 3000 by default).
4. Use `Authorization: Bearer YOUR_USER_KEY` for `/mcp`. Keep the adapter key on the trusted backend of the integrated agent and use it for `/gate` instead.
5. Inspect with MCP Inspector in Streamable HTTP mode at `http://localhost:3000/mcp`; supply the Authorization header.
6. Deploy behind a HTTPS endpoint with production HTTPS termination and a durable writable storage directory. The included `Dockerfile` is a starting point; mount a persistent volume at `CANONICAL_DATA_DIR` and inject credentials through the deployment secret manager. For the public Vercel preview, update the **placeholder domain** in `mcp.json` only after a real deploy and use its public read-only MCP endpoint without API key. The authenticated, writable development server is separate; it is not safe for public multiuser deployment without OAuth and persistent transactional storage.

The `mcp.json` file is a **template until you supply a real endpoint**; its no-auth mode exposes only canon consultation on Vercel. The ZIP alone is not an installed/hosted service, and it has **not** been submitted to or approved by the ChatGPT public plugin directory. Public multiuser distribution requires OAuth and privacy/security review before submission.

## MCP tools

`estado_canonico`, `consultar_canon`, `listar_agentes`, `registrar_agente`, `definir_agente`, `configurar_capacidade`, `avaliar_acao`, `consultar_auditoria`.

Workflow: list agents → register agent with current policy version → enable or disable one capability using the latest version → verify status → connect an external backend adapter if desired. All capabilities default **disabled**. For a connected adapter, `/gate` returns `allow`, `deny` or `needs_confirmation` before execution. `needs_confirmation` must be treated as **deny until separate real human verification**.

The original Code remains the source; this plugin's list of switch names is a technical interface taxonomy, **not a new canonical law**. See `docs/ARCHITECTURE.md` for limits and mapping to the original Canons.

## Example: gating an integrated agent

The owner's backend, **before** doing anything:

```js
const {checkBeforeAction}=require('./examples/adapter-gate');
const answer=await checkBeforeAction({endpoint:'https://your-domain',token:process.env.AGENT_SECRET,agentId:'muse',capability:'web_read'});
if (answer.decision!=='allow') throw new Error('Action blocked: '+answer.reason);
// Only now perform a LOW-RISK operation authorized for that integrated agent.
```

For a sensitive operation (payments, sending messages, modifying files or controlling devices), this reference gate does not grant automatic authorization. A separate human confirmation and platform security checks are mandatory before any attempt. This repository does not contain that production integration.

## Data/privacy

The prototype stores user IDs, named agent policy settings and action metadata. It does not need prompt transcripts. Secrets remain environment-side. Local audit log hash chaining **detects edits inside retained history**, but cannot by itself guarantee legal-grade immutability, backups, or multi-instance consistency. User data should be isolated, backed up, protected and handled with a published privacy policy before public release. Do not publish real environment values.

## Hosting on Vercel (with GitHub source)

GitHub Pages cannot run an MCP server. The version in `api/` is designed for Vercel Functions behind HTTPS. It intentionally **disables writes and `/gate` on serverless deployments**: the development JSON file store is not durable there. Enabling real multiuser controls requires implementing a persistent transactional storage adapter and an OAuth/identity flow; **setting a flag does not bypass this block**. Do not advertise this as an already-public capability.

Once the project is connected on Vercel, publish the repository's integration subdirectory as the Vercel project root, configure secret authentication, and validate `/health`, `/mcp`, persistent writes, isolation, and fail-closed behavior. The plugin only enforces permissions for external adapters actively connected to it. It cannot override Android, Gemini, Claude, or ChatGPT native permissions.

## OpenAI directory packaging

The plugin includes publisher metadata, a square icon, an onboarding skill, and pre-release drafts for privacy/terms. These do not constitute verified publisher identity or review approval. The canonical governance source is pinned to a Git commit and original SHA-1 Git blobs; no normative file is rewritten. The repository has a separate feature branch for integration so changes to original `laws/` remain isolated.

# SI delegation: from a rule to an observable boundary

**SI — Super Inteligência / Super Intelligence** is the terminology used for agents in this operational layer. The original canonical sources retain their historical wording. See the [change and adaptation term](../../docs/governance/TERMO_DE_MUDANCA_SI_2026-10-10.md).

## Português — Comece com uma consequência concreta

Um agente tem autorização para preparar um orçamento. Ele propõe uma compra. O controle identifica que a compra não faz parte da delegação e impede a chamada do adaptador; o orçamento autorizado continua funcionando.

Execute na raiz do repositório, com Node >=14.0.0, sem instalar dependências:

```bash
node examples/delegation/demo.js
node test/run.js
node scripts/evaluate.js --check docs/evaluation/delegation-report.json
node cli.js
```

O exemplo usa relógio fixo, destinatários fictícios e um adaptador simulado. Não envia mensagens, não realiza pagamentos e não se conecta a serviços. A política de exemplo tem validade nesse relógio fixo; ela não é uma autorização para uso real.

**Resultado esperado:** orçamento `allow`, compra `deny` com `ACTION_NOT_DELEGATED`, uma chamada simulada para `quote.prepare`.

### O que o operador precisa compreender

1. A política é definida pelo hospedeiro, fora do alcance de alteração da SI.
2. O pedido identifica ação, dados, destinatário quando aplicável e versões do estado/contexto.
3. `inspect` retorna `allow`, `review` ou `deny` e uma prévia; não executa nem registra uma ação.
4. `confirm` pertence ao canal humano confiável. O hospedeiro deve mostrar a prévia exata e verificar a autoridade do aprovador antes de chamá-lo.
5. `execute` refaz a avaliação no momento de despacho. A ausência de confirmação exigida mantém o pedido em revisão; uma violação de escopo continua negada.
6. Tentativas consomem identificador e limites. Falhas incertas interrompem o despacho, para evitar repetir uma consequência que pode já ter ocorrido.

`executed: false` significa que o adaptador não foi chamado; `true` significa que ele retornou sucesso observado; `null` significa que foi chamado e o resultado externo é incerto. `auditRecorded: false` depois da chamada exige investigação. Recriar o gateway não é um procedimento seguro de repetição: o estado local não sobrevive ao processo.

## English — Host integration boundary

The package exports a fixed, small reference gateway. The host must isolate policy, adapter, confirmation and audit capabilities from the SI agent. Letting the agent call the raw adapter or trusted `confirm` method bypasses the intended design.

```js
const { createGateway, createAuditLog, verifyAuditLog } = require('../../index');
const policy = require('./policy.json');
const audit = createAuditLog(); // Memory only; a durable synchronous sink is a host responsibility.
const gateway = createGateway({
  policy,
  clock: () => Date.parse('2026-10-10T12:00:00Z'),
  context: () => ({ revision: 'cart-1', uncertain: false, revoked: false }),
  audit,
  execute: async request => ({ simulated: true, action: request.action })
});

const request = {
  id: 'purchase-1', action: 'purchase.commit', recipient: 'shop@example.invalid',
  amountMinor: 6000, currency: 'USD', data: { sku: 'BOOK-1' },
  expectedStateVersion: 0, contextRevision: 'cart-1'
};
// In a trusted human channel: display gateway.inspect(request).preview,
// verify the approver, then call confirm. Never register confirm as an SI tool.
const confirmation = gateway.confirm(request);
gateway.execute(request, confirmation.token).then(result => {
  console.log(result.executed, result.reasons);
  const checkpoint = audit.checkpoint(); // Retain separately from the log writer.
  console.log(verifyAuditLog(audit.entries(), checkpoint));
});
```

The example snippet runs from this directory and illustrates trusted host code. It does not perform human authentication. Confirmation is specific and short-lived; the entire request and current policy/state/context bind it. It cannot widen recipients, amounts or payload fields.

### Policy contract

The [sample policy](policy.json) is strict JSON with `schemaVersion: 1`, `id`, positive integer `version`, UTC validity timestamps in `YYYY-MM-DDTHH:mm:ssZ` or `YYYY-MM-DDTHH:mm:ss.sssZ` format with valid calendar dates, boolean `revoked`, action-count and cumulative minor-unit limits, confirmation TTL (1–600 seconds), and unique action permissions. The supported actions are `quote.prepare`, `message.send`, `purchase.commit`.

Each permission explicitly sets `approval` (`delegated` or `confirm`), exact case-sensitive recipient identifiers and allowed top-level payload fields. Purchases also bind a three-letter currency and a nonnegative integer `maxAmountMinor`. There are no wildcard grants or implicit additional fields. The adapter must implement the same action semantics and validate real account/product identities and prices; field allowlisting does not interpret the meaning or sensitivity of message content.

All requests have `id`, `action`, `data`, `expectedStateVersion`, `contextRevision`; external actions also require `recipient`; purchases require `amountMinor` and `currency`. IDs are bounded, simple identifiers. Inputs must be plain, finite JSON, <=64 KiB, depth <=16, <=4000 nodes, with no getters or sparse arrays. Quote items, message body/optional subject and purchase SKU have bounded shapes. Unknown authority/risk fields are rejected.

For subsequent actions use the freshly observed `gateway.state().version` and the host's current context revision. Updating these numbers alone does not establish human intent: the host must keep context semantics and user authority aligned. Clock and context availability are required at dispatch.

### Trust, persistence and recovery limits

- Execution is serialized **inside one gateway process only**. Production concurrency across processes needs shared transactional reservations and durable idempotency. Restarts must restore spent/count/request state before allowing dispatch.
- Confirmation tokens and state are in memory. Protect the human channel, cap access and invalidate grants on changes of intent. The helper is not an authentication system.
- A synchronous audit sink must finish before dispatch; a Promise-returning sink or custom `audit.append` is rejected, its rejection is consumed, and the gateway halts. A success/failure is not silently converted into “blocked” after the adapter ran.
- On `EXECUTION_UNCERTAIN` or post-action audit failure, investigate the provider independently and reconcile durable state before any recovery. The gateway deliberately provides no automatic unhalt/retry function.
- Audit fingerprints are not anonymization. Protect log access; retain a separately trusted checkpoint to detect truncated/replaced chains. Local hash checking alone does not establish immutable storage or authentic source provenance.
- This bounded software example does not implement physical safeguards under Canon XXIV.

## Read the evidence, then plan a pilot

The [27-case report](../../docs/evaluation/delegation-report.json) contains five expected executions and 22 expected holds. Its labels and proposals are declared in [scenarios.json](../../evaluation/scenarios.json); modifying the oracle changes the score. The deliberately unprotected baseline dispatches every proposal. This comparison measures this mechanism on constructed inputs, not performance of a real SI model or competing product.

[Control-to-article map](../../docs/operational/CONTROLS.md) · [Operational governance and reconstructive review](../../docs/operational/GOVERNANCE.md) · [Pilot protocol](../../docs/evaluation/PILOT.md) · [Adoption report](../../template/adoption_report.md)

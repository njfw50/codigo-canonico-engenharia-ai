// Copyright 2026 Michel Silva de Souza. Licensed under the Apache License, Version 2.0.
const { createGateway } = require('../../operational/gateway');
const policy = JSON.parse(JSON.stringify(require('./policy.json')));

async function main() {
  const calls = [];
  policy.permissions = policy.permissions.filter(permission => permission.action === 'quote.prepare');
  const gateway = createGateway({ policy, clock: () => Date.parse('2026-10-10T12:00:00Z'),
    context: () => ({ revision: 'cart-1', uncertain: false, revoked: false }),
    execute: async request => { calls.push(request.action); return { simulated: true }; } });
  const quote = { id: 'quote-1', action: 'quote.prepare', data: { items: ['book'] }, expectedStateVersion: 0, contextRevision: 'cart-1' };
  const purchase = { id: 'purchase-1', action: 'purchase.commit', recipient: 'shop@example.invalid', amountMinor: 6000,
    currency: 'USD', data: { sku: 'BOOK-1' }, expectedStateVersion: 1, contextRevision: 'cart-1' };
  const draft = await gateway.execute(quote); const blocked = await gateway.execute(purchase);
  console.log('SI delegation demonstration / Demonstração de delegação de SI (simulation only)');
  console.log(`Quote / Orçamento: ${draft.decision}; executed / executado: ${draft.executed}`);
  console.log(`Purchase / Compra: ${blocked.decision}; reason / motivo: ${blocked.reasons.join(', ')}`);
  console.log(`Simulated adapter calls / Chamadas simuladas: ${calls.join(', ')}`);
  console.log('No network, payments or external messages / Sem rede, pagamentos ou mensagens externas.');
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { main };

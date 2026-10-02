// Copyright 2026 Michel Silva de Souza. SPDX-License-Identifier: Apache-2.0
// Class C — CLI presentation. Fixed inputs keep the demonstration reproducible.
const { quoteCheckout } = require('./quote');

const quote = quoteCheckout(12500);
const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

// Formatting happens after the application returns a complete quote. The UI
// therefore displays the decision instead of becoming a second policy authority.
console.log(`Subtotal: ${dollars.format(quote.subtotalCents / 100)}`);
console.log(`Discount: ${dollars.format(quote.discountCents / 100)}`);
console.log(`Total: ${dollars.format(quote.totalCents / 100)}`);

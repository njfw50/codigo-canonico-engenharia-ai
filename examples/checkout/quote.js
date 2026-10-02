// Copyright 2026 Michel Silva de Souza. SPDX-License-Identifier: Apache-2.0
// Class C — application use case. Domain policy remains in discount.js.
const { discountForSubtotal } = require('./discount');

function quoteCheckout(subtotalCents) {
  // The use case turns the domain decision into an explicit result that a CLI,
  // web UI or test can consume without duplicating eligibility or rounding rules.
  const discountCents = discountForSubtotal(subtotalCents);
  return { subtotalCents, discountCents, totalCents: subtotalCents - discountCents };
}
module.exports = { quoteCheckout };

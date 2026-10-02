// Copyright 2026 Michel Silva de Souza. SPDX-License-Identifier: Apache-2.0
// Class C — educational domain rule. No UI, storage or network dependencies.
function discountForSubtotal(subtotalCents) {
  // Integer cents give every caller the same meaning for an amount. This demo
  // deliberately limits its input range; a real product must define its own policy.
  if (!Number.isInteger(subtotalCents) || subtotalCents < 0 || subtotalCents > 100000000) {
    throw new RangeError('Subtotal must be integer cents between 0 and 100000000.');
  }

  // Example business decision: 10% off at 10,000 cents or above. Round the
  // discount down to a whole cent here, so callers cannot choose conflicting rules.
  return subtotalCents >= 10000 ? Math.floor(subtotalCents / 10) : 0;
}
module.exports = { discountForSubtotal };

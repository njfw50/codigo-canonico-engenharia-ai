// Copyright 2026 Michel Silva de Souza. SPDX-License-Identifier: Apache-2.0
// Class C — evidence for this educational example, not a repository-wide audit.
const assert = require('assert').strict;
const { quoteCheckout } = require('./quote');

// Literal, hand-calculated cases catch a misplaced threshold, fractional-cent
// discount or an application total that fails to subtract the domain decision.
const cases = [
  [0, 0, 0],
  [9999, 0, 9999],
  [10000, 1000, 9000],
  [10005, 1000, 9005],
  [12500, 1250, 11250],
  [100000000, 10000000, 90000000]
];
for (const [subtotalCents, discountCents, totalCents] of cases) {
  assert.deepEqual(quoteCheckout(subtotalCents), {
    subtotalCents, discountCents, totalCents
  }, `Incorrect quote for ${subtotalCents} cents`);
}

// Accepting ambiguous amounts would let different callers interpret money
// differently; reject them at the domain boundary before producing a quote.
const invalid = [-1, 1.5, '10000', null, undefined, NaN, Infinity, 100000001];
for (const amount of invalid) {
  assert.throws(() => quoteCheckout(amount), RangeError);
}
console.log(`Checkout example: ${cases.length} quotes and ${invalid.length} invalid inputs verified.`);

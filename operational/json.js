// Copyright 2026 Michel Silva de Souza. Licensed under the Apache License, Version 2.0.
const crypto = require('crypto');

// A small JSON boundary prevents silent coercion (NaN -> null, undefined -> absent)
// from changing the action that an operator inspected or confirmed.
function cloneJson(value) {
  let nodes = 0;
  function visit(item, depth) {
    nodes += 1;
    if (depth > 16 || nodes > 4000) throw new TypeError('JSON structure exceeds limits');
    if (item === null || typeof item === 'boolean') return item;
    if (typeof item === 'string') {
      if (item.length > 65536) throw new TypeError('JSON string exceeds limits');
      return item;
    }
    if (typeof item === 'number' && Number.isFinite(item) &&
        (!Number.isInteger(item) || Number.isSafeInteger(item))) return item;
    if (typeof item !== 'object' || item === null) throw new TypeError('Expected finite JSON data');
    const prototype = Object.getPrototypeOf(item);
    if (!Array.isArray(item) && prototype !== Object.prototype && prototype !== null) {
      throw new TypeError('Expected a plain JSON object');
    }
    if (Object.getOwnPropertySymbols(item).length) throw new TypeError('JSON symbols are unsupported');
    const result = Array.isArray(item) ? [] : {};
    const keys = Object.keys(item);
    if (Array.isArray(item) && (keys.length !== item.length || keys.some((key, i) => key !== String(i)))) {
      throw new TypeError('Expected a dense JSON array');
    }
    for (const key of keys) {
      const property = Object.getOwnPropertyDescriptor(item, key);
      if (!property || !Object.prototype.hasOwnProperty.call(property, 'value') ||
          ['__proto__', 'constructor', 'prototype'].includes(key)) {
        throw new TypeError('Unsupported JSON property');
      }
      result[key] = visit(property.value, depth + 1);
    }
    return result;
  }
  const copy = visit(value, 0);
  if (Buffer.byteLength(JSON.stringify(copy), 'utf8') > 65536) throw new TypeError('JSON exceeds 64 KiB');
  return copy;
}

function stableJson(value) {
  function serialize(item) {
    if (Array.isArray(item)) return `[${item.map(serialize).join(',')}]`;
    if (item && typeof item === 'object') {
      return `{${Object.keys(item).sort().map(key => `${JSON.stringify(key)}:${serialize(item[key])}`).join(',')}}`;
    }
    return JSON.stringify(item);
  }
  return serialize(cloneJson(value));
}
function digest(value) { return crypto.createHash('sha256').update(stableJson(value)).digest('hex'); }
function freeze(value) {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
module.exports = { cloneJson, stableJson, digest, freeze };

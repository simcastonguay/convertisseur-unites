import { test } from 'node:test';
import assert from 'node:assert/strict';
import { appendHistory, loadHistory, saveHistory, HISTORY_KEY } from '../src/history.js';
const entry = { category: 'length', value: 1, result: 0.3048, from: 'ft', to: 'm', fromSymbol: 'pi', toSymbol: 'm' };

test('historique : six entrées maximum, la plus récente en premier', () => {
  let history = [];
  for (let value = 1; value <= 8; value++) history = appendHistory(history, { ...entry, value });
  assert.equal(history.length, 6);
  assert.equal(history[0].value, 8);
  assert.equal(history[5].value, 3);
  assert.equal(appendHistory(history, { ...entry, result: Infinity }), history);
});
test('historique : persistance, relecture et effacement', () => {
  const data = new Map();
  const storage = { getItem: (key) => data.get(key), setItem: (key, value) => data.set(key, value) };
  assert.equal(saveHistory(storage, [entry]), true);
  assert.deepEqual(loadHistory(storage), [entry]);
  assert.equal(saveHistory(storage, []), true);
  assert.equal(data.get(HISTORY_KEY), '[]');
  assert.deepEqual(loadHistory(storage), []);
});
test('historique : JSON corrompu et stockage indisponible', () => {
  assert.deepEqual(loadHistory({ getItem: () => '{' }), []);
  assert.deepEqual(loadHistory({ getItem: () => '{"bad":true}' }), []);
  const unavailable = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('quota'); } };
  assert.deepEqual(loadHistory(unavailable), []);
  assert.equal(saveHistory(unavailable, [entry]), false);
});
test('historique : élimination des entrées invalides sans perdre les entrées valides', () => {
  const stored = [null, { ...entry, value: '1' }, { ...entry, to: 'l' }, { ...entry, fromSymbol: {} }, entry];
  assert.deepEqual(loadHistory({ getItem: () => JSON.stringify(stored) }), [entry]);
});
test('historique : une catégorie héritée ne doit pas effacer les entrées valides', () => {
  for (const category of ['__proto__', 'constructor', 'toString']) {
    const stored = [{ ...entry, category }, entry];
    assert.deepEqual(loadHistory({ getItem: () => JSON.stringify(stored) }), [entry]);
  }
});
test('historique : les conversions de vitesse sont conservées', () => {
  const speed = { category: 'speed', value: 36, result: 10, from: 'kmh', to: 'mps', fromSymbol: 'km/h', toSymbol: 'm/s' };
  assert.deepEqual(appendHistory([], speed), [speed]);
  assert.deepEqual(appendHistory([], { ...speed, to: 'm' }), []);
});

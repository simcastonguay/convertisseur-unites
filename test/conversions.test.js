import { test } from 'node:test';
import assert from 'node:assert/strict';
import { categories, convert } from '../server/conversions.js';

test('conversions de référence : pieds, pouces, milles et gallons', () => {
  assert.equal(convert({ value: 1, from: 'ft', to: 'm' }).result, 0.3048);
  assert.equal(convert({ value: 12, from: 'in', to: 'ft' }).result, 1);
  assert.equal(convert({ value: 1, from: 'mi', to: 'km' }).result, 1.609344);
  assert.equal(convert({ value: 1, from: 'gal-us', to: 'l' }).result, 3.785411784);
  assert.equal(convert({ value: 1, from: 'gal-imp', to: 'l' }).result, 4.54609);
});
test('zéro, décimales, valeurs négatives et identité', () => {
  assert.equal(convert({ value: 0, from: 'l', to: 'ml' }).result, 0);
  assert.equal(convert({ value: 1.5, from: 'l', to: 'ml' }).result, 1500);
  assert.equal(convert({ value: -10, from: 'm', to: 'cm' }).result, -1000);
  assert.equal(convert({ value: 42, from: 'ft', to: 'ft' }).result, 42);
});
test('aller-retour pour chaque paire compatible', () => {
  for (const category of categories) for (const from of category.units) for (const to of category.units) {
    const result = convert({ value: 12.5, from: from.id, to: to.id }).result;
    const back = convert({ value: result, from: to.id, to: from.id }).result;
    assert.ok(Math.abs(back - 12.5) < 1e-10, `${from.id} -> ${to.id}`);
  }
});
test('demandes invalides et dépassement numérique refusés', () => {
  for (const value of [NaN, Infinity, '12', null, undefined, {}, true]) assert.throws(() => convert({ value, from: 'm', to: 'ft' }));
  assert.throws(() => convert(null));
  assert.throws(() => convert({ value: 1, from: 'm', to: 'l' }));
  assert.throws(() => convert({ value: 1, from: 'unknown', to: 'm' }));
  assert.throws(() => convert({ value: Number.MAX_VALUE, from: 'km', to: 'cm' }));
});
test('températures : décalages, valeurs négatives et zéro absolu', () => {
  const close = (value, from, to, expected) => assert.ok(Math.abs(convert({ value, from, to }).result - expected) < 1e-9);
  close(0, 'c', 'f', 32);
  close(100, 'c', 'f', 212);
  close(-40, 'c', 'f', -40);
  close(32, 'f', 'c', 0);
  close(0, 'c', 'k', 273.15);
  close(0, 'k', 'c', -273.15);
  assert.equal(convert({ value: -459.67, from: 'f', to: 'k' }).result, 0);
  for (const [value, from] of [[-273.16, 'c'], [-459.68, 'f'], [-0.01, 'k']]) assert.throws(() => convert({ value, from, to: 'k' }), /zéro absolu/);
  assert.throws(() => convert({ value: 1, from: 'c', to: 'm' }));
});

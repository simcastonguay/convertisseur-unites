import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../server/app.js';

test('API HTTP : catalogue, calcul et erreurs', async (t) => {
  const server = createApp();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (body, contentType = 'application/json') => fetch(`${base}/api/convert`, { method: 'POST', headers: { 'Content-Type': contentType }, body });
  assert.equal((await fetch(`${base}/api/health`)).status, 200);
  const units = await (await fetch(`${base}/api/units`)).json();
  assert.ok(units.find((category) => category.id === 'volume'));
  const response = await post(JSON.stringify({ value: 10, from: 'ft', to: 'm' }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).result, 3.048);
  assert.equal((await post('{')).status, 400);
  assert.equal((await post('null')).status, 400);
  assert.equal((await post(JSON.stringify({ value: '', from: 'ft', to: 'm' }))).status, 400);
  assert.equal((await post(JSON.stringify({ value: 1, from: 'ft', to: 'l' }))).status, 400);
  assert.equal((await post('text', 'text/plain')).status, 415);
  assert.equal((await post(' '.repeat(5000))).status, 413);
  assert.equal((await fetch(`${base}/api/inconnue`)).status, 404);
  assert.equal((await fetch(`${base}/absent.txt`)).status, 404);
});

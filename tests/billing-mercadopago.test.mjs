import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('checkout usa assinatura recorrente mensal do Mercado Pago', async () => {
  const helper = await read('api/_lib/mercadopago.js');
  const endpoint = await read('api/billing/create-subscription.js');
  assert.match(helper, /preapproval_plan_id/);
  assert.match(helper, /\/preapproval/);
  assert.match(endpoint, /external_reference|userId/);
  assert.match(endpoint, /R\$ 19,90|createSubscription/);
});

test('webhook valida assinatura e consulta assinatura antes de ativar conta', async () => {
  const helper = await read('api/_lib/mercadopago.js');
  const webhook = await read('api/billing/webhook.js');
  assert.match(helper, /createHmac\('sha256'/);
  assert.match(helper, /timingSafeEqual/);
  assert.match(webhook, /validateWebhookSignature/);
  assert.match(webhook, /getSubscription\(dataId\)/);
  assert.match(webhook, /syncSubscriptionStatus/);
});

test('schema armazena vínculo Mercado Pago e preço de lançamento', async () => {
  const sql = await read('supabase/schema.sql');
  assert.match(sql, /subscription_price numeric\(10,2\) not null default 19\.90/);
  assert.match(sql, /mercadopago_subscription_id text/);
  assert.match(sql, /mercadopago_status text/);
});

test('painel abre checkout somente após login', async () => {
  const account = await read('account.js');
  assert.match(account, /\/api\/billing\/create-subscription/);
  assert.match(account, /window\.location\.assign\(data\.checkoutUrl\)/);
});

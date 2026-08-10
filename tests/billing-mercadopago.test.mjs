import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('checkout usa assinatura recorrente mensal do Mercado Pago', async () => {
  const helper = await read('api/_lib/mercadopago.js');
  const endpoint = await read('api/billing/create-subscription.js');
  assert.match(helper, /\/preapproval_plan\//);
  assert.match(helper, /\/preapproval/);
  assert.match(endpoint, /userId/);
  assert.match(endpoint, /createSubscription/);
});

test('Mercado Pago usa variáveis isoladas pelo ambiente da Vercel', async () => {
  const helper = await read('api/_lib/mercadopago.js');
  assert.match(helper, /MERCADOPAGO_ACCESS_TOKEN/);
  assert.match(helper, /MERCADOPAGO_PLAN_ID/);
  assert.match(helper, /MERCADOPAGO_WEBHOOK_SECRET/);
  assert.doesNotMatch(helper, /MERCADOPAGO_TEST_ACCESS_TOKEN/);
  assert.doesNotMatch(helper, /MERCADOPAGO_TEST_PLAN_ID/);
});

test('Preview usa e-mail do comprador de teste e produção preserva o e-mail real', async () => {
  const helper = await read('api/_lib/mercadopago.js');
  assert.match(helper, /VERCEL_ENV === 'preview'/);
  assert.match(helper, /test@testuser\.com/);
  assert.match(helper, /payer_email: getPayerEmail\(email\)/);
});

test('webhook valida assinatura e consulta assinatura antes de ativar conta', async () => {
  const helper = await read('api/_lib/mercadopago.js');
  const webhook = await read('api/billing/webhook.js');
  assert.match(helper, /createHmac\('sha256'/);
  assert.match(helper, /timingSafeEqual/);
  assert.match(webhook, /validateWebhookSignature/);
  assert.match(webhook, /getSubscription\(dataId\)/);
  assert.match(webhook, /syncSubscriptionStatus/);
  assert.match(webhook, /validFirebaseUid/);
});

test('Firebase armazena vínculo Mercado Pago e preço de lançamento', async () => {
  const firebase = await read('api/_lib/firebase.js');
  assert.match(firebase, /subscriptionPrice: 19\.90/);
  assert.match(firebase, /mercadoPagoSubscriptionId/);
  assert.match(firebase, /mercadoPagoStatus/);
});

test('painel abre checkout somente após login', async () => {
  const account = await read('account.js');
  assert.match(account, /\/api\/billing\/create-subscription/);
  assert.match(account, /window\.location\.assign\(data\.checkoutUrl\)/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('checkout usa assinatura recorrente pendente sem plano associado', async () => {
  const helper = await read('api/_lib/mercadopago.js');
  const endpoint = await read('api/billing/create-subscription.js');
  assert.match(helper, /\/preapproval/);
  assert.doesNotMatch(helper, /\/preapproval_plan\//);
  assert.doesNotMatch(helper, /preapproval_plan_id/);
  assert.match(helper, /status: 'pending'/);
  assert.match(helper, /transaction_amount: 19\.90/);
  assert.match(endpoint, /createSubscription/);
});

test('Mercado Pago separa credenciais de Preview e Production', async () => {
  const helper = await read('api/_lib/mercadopago.js');
  assert.match(helper, /MERCADOPAGO_ACCESS_TOKEN/);
  assert.match(helper, /MERCADOPAGO_WEBHOOK_SECRET/);
  assert.match(helper, /MERCADOPAGO_TEST_PAYER_EMAIL/);
  assert.match(helper, /MERCADOPAGO_PREVIEW_REQUIRES_TEST_CREDENTIALS/);
  assert.match(helper, /MERCADOPAGO_PRODUCTION_REQUIRES_PRODUCTION_CREDENTIALS/);
});

test('Preview exige comprador de teste configurado e não usa e-mail genérico', async () => {
  const helper = await read('api/_lib/mercadopago.js');
  assert.match(helper, /VERCEL_ENV === 'preview'/);
  assert.match(helper, /return config\.testPayerEmail/);
  assert.match(helper, /MERCADOPAGO_TEST_PAYER_NOT_CONFIGURED/);
  assert.doesNotMatch(helper, /test@testuser\.com/);
});

test('checkout mantém external_reference do Firebase para reconciliar assinatura', async () => {
  const helper = await read('api/_lib/mercadopago.js');
  assert.match(helper, /external_reference: String\(userId\)/);
  assert.match(helper, /reason: 'TeachEasy Premium'/);
  assert.match(helper, /frequency_type: 'months'/);
});

test('pagamento de 30 dias usa Checkout Pro e exclui boleto', async () => {
  const helper = await read('api/_lib/mercadopago.js');
  const endpoint = await read('api/billing/create-payment.js');
  assert.match(helper, /\/checkout\/preferences/);
  assert.match(helper, /excluded_payment_types: \[\{ id: 'ticket' \}\]/);
  assert.match(helper, /TeachEasy Premium - 30 dias/);
  assert.match(helper, /unit_price: 19\.90/);
  assert.match(helper, /installments: 1/);
  assert.match(endpoint, /sandbox_init_point/);
  assert.match(endpoint, /createCheckoutPreference/);
});

test('webhook valida assinatura e consulta assinatura antes de ativar conta', async () => {
  const helper = await read('api/_lib/mercadopago.js');
  const webhook = await read('api/billing/webhook.js');
  assert.match(helper, /createHmac\('sha256'/);
  assert.match(helper, /timingSafeEqual/);
  assert.match(webhook, /getSubscription\(dataId\)/);
  assert.match(webhook, /syncSubscriptionStatus/);
});

test('webhook processa pagamento avulso aprovado e libera 30 dias', async () => {
  const webhook = await read('api/billing/webhook.js');
  const firebase = await read('api/_lib/firebase.js');
  assert.match(webhook, /isPaymentNotification/);
  assert.match(webhook, /getPayment\(dataId\)/);
  assert.match(webhook, /syncOneTimePaymentStatus/);
  assert.match(firebase, /normalized !== 'approved'/);
  assert.match(firebase, /30 \* 24 \* 60 \* 60 \* 1000/);
  assert.match(firebase, /subscriptionStatus: 'active'/);
  assert.match(firebase, /aiUsed: 0/);
});

test('painel oferece assinatura automática e pagamento sem boleto por 30 dias', async () => {
  const account = await read('account.js');
  const html = await read('account.html');
  assert.match(account, /\/api\/billing\/create-subscription/);
  assert.match(account, /\/api\/billing\/create-payment/);
  assert.match(html, /Pix, débito ou crédito — 30 dias/);
  assert.match(html, /Sem boleto/);
});

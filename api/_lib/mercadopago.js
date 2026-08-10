const crypto = require('crypto');

function isPreviewEnvironment() {
  return process.env.VERCEL_ENV === 'preview';
}

function requireMercadoPagoConfig() {
  // A Vercel já isola os valores por ambiente (Preview e Production).
  // Portanto, usamos os mesmos nomes de variáveis e deixamos a Vercel
  // fornecer o valor correspondente ao ambiente do deployment.
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  const planId = process.env.MERCADOPAGO_PLAN_ID;

  if (!accessToken) throw new Error('MERCADOPAGO_NOT_CONFIGURED');
  return { accessToken, webhookSecret, planId };
}

function getPayerEmail(email) {
  // Nos Previews usamos a conta compradora de teste do Mercado Pago.
  // Em produção, preservamos o e-mail real do cliente do TeachEasy.
  return isPreviewEnvironment() ? 'test@testuser.com' : email;
}

async function mercadoPagoFetch(path, options = {}) {
  const { accessToken } = requireMercadoPagoConfig();
  const response = await fetch(`https://api.mercadopago.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

async function getPlan(planId) {
  const id = encodeURIComponent(String(planId || ''));
  if (!id) throw new Error('MERCADOPAGO_PLAN_NOT_CONFIGURED');
  const { response, data } = await mercadoPagoFetch(`/preapproval_plan/${id}`, { method: 'GET' });
  if (!response.ok) {
    const error = new Error(data?.message || data?.error || 'MERCADOPAGO_PLAN_LOOKUP_FAILED');
    error.details = data;
    throw error;
  }
  return data;
}

async function createSubscription({ userId, email, backUrl, notificationUrl }) {
  const preview = isPreviewEnvironment();
  const { planId } = requireMercadoPagoConfig();

  let reason = 'TeachEasy Premium';
  let transactionAmount = 19.90;
  let frequency = 1;
  let frequencyType = 'months';
  let currencyId = 'BRL';

  // No Preview usamos uma assinatura de teste sem plano associado.
  // Isso evita misturar o Access Token de teste com o PLAN_ID real.
  // Em Production continuamos usando exatamente o plano real configurado.
  if (!preview) {
    if (!planId) throw new Error('MERCADOPAGO_PLAN_NOT_CONFIGURED');
    const plan = await getPlan(planId);
    const recurring = plan?.auto_recurring || {};
    reason = String(plan.reason || reason);
    transactionAmount = Number(recurring.transaction_amount);
    frequency = Number(recurring.frequency || 1);
    frequencyType = String(recurring.frequency_type || 'months');
    currencyId = String(recurring.currency_id || 'BRL');
  }

  if (!Number.isFinite(transactionAmount) || transactionAmount <= 0) {
    throw new Error('MERCADOPAGO_PLAN_AMOUNT_INVALID');
  }

  const payload = {
    reason,
    external_reference: String(userId),
    payer_email: getPayerEmail(email),
    auto_recurring: {
      frequency,
      frequency_type: frequencyType,
      transaction_amount: transactionAmount,
      currency_id: currencyId
    },
    back_url: backUrl,
    status: 'pending'
  };
  // Preview deployments are protected by Vercel Authentication, so Mercado Pago
  // cannot reach their webhook URL. The checkout does not require this optional
  // field; production keeps the real webhook unchanged.
  if (notificationUrl && !preview) payload.notification_url = notificationUrl;

  const { response, data } = await mercadoPagoFetch('/preapproval', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const error = new Error(data?.message || data?.error || 'MERCADOPAGO_SUBSCRIPTION_FAILED');
    error.details = data;
    throw error;
  }
  return data;
}

async function getSubscription(subscriptionId) {
  const id = encodeURIComponent(String(subscriptionId || ''));
  if (!id) throw new Error('MERCADOPAGO_SUBSCRIPTION_ID_REQUIRED');
  const { response, data } = await mercadoPagoFetch(`/preapproval/${id}`, { method: 'GET' });
  if (!response.ok) throw new Error(data?.message || data?.error || 'MERCADOPAGO_SUBSCRIPTION_LOOKUP_FAILED');
  return data;
}

function validateWebhookSignature({ xSignature, xRequestId, dataId }) {
  const { webhookSecret } = requireMercadoPagoConfig();
  if (!webhookSecret) throw new Error('MERCADOPAGO_WEBHOOK_NOT_CONFIGURED');
  const parts = String(xSignature || '').split(',').map(part => part.trim());
  const ts = parts.find(part => part.startsWith('ts='))?.slice(3);
  const received = parts.find(part => part.startsWith('v1='))?.slice(3);
  if (!ts || !received || !xRequestId || !dataId) return false;
  const normalizedId = String(dataId).toLowerCase();
  const template = `id:${normalizedId};request-id:${xRequestId};ts:${ts};`;
  const expected = crypto.createHmac('sha256', webhookSecret).update(template).digest('hex');
  const expectedBuffer = Buffer.from(expected, 'hex');
  const receivedBuffer = Buffer.from(received, 'hex');
  return expectedBuffer.length === receivedBuffer.length && crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

module.exports = { createSubscription, getSubscription, validateWebhookSignature };

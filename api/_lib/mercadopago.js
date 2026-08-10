const crypto = require('crypto');

function isPreviewEnvironment() {
  return process.env.VERCEL_ENV === 'preview';
}

function requireMercadoPagoConfig() {
  const preview = isPreviewEnvironment();
  const accessToken = preview
    ? process.env.MERCADOPAGO_TEST_ACCESS_TOKEN
    : process.env.MERCADOPAGO_ACCESS_TOKEN;
  const webhookSecret = preview
    ? process.env.MERCADOPAGO_TEST_WEBHOOK_SECRET
    : process.env.MERCADOPAGO_WEBHOOK_SECRET;
  const planId = preview
    ? process.env.MERCADOPAGO_TEST_PLAN_ID
    : process.env.MERCADOPAGO_PLAN_ID;

  if (!accessToken) {
    throw new Error(preview ? 'MERCADOPAGO_TEST_NOT_CONFIGURED' : 'MERCADOPAGO_NOT_CONFIGURED');
  }

  return { accessToken, webhookSecret, planId, preview };
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
  if (!id) {
    throw new Error(isPreviewEnvironment() ? 'MERCADOPAGO_TEST_PLAN_NOT_CONFIGURED' : 'MERCADOPAGO_PLAN_NOT_CONFIGURED');
  }
  const { response, data } = await mercadoPagoFetch(`/preapproval_plan/${id}`, { method: 'GET' });
  if (!response.ok) {
    const error = new Error(data?.message || data?.error || 'MERCADOPAGO_PLAN_LOOKUP_FAILED');
    error.details = data;
    throw error;
  }
  return data;
}

async function createSubscription({ userId, email, backUrl, notificationUrl }) {
  const { planId } = requireMercadoPagoConfig();
  if (!planId) {
    throw new Error(isPreviewEnvironment() ? 'MERCADOPAGO_TEST_PLAN_NOT_CONFIGURED' : 'MERCADOPAGO_PLAN_NOT_CONFIGURED');
  }

  const plan = await getPlan(planId);
  const recurring = plan?.auto_recurring || {};
  const transactionAmount = Number(recurring.transaction_amount);
  const frequency = Number(recurring.frequency || 1);
  const frequencyType = String(recurring.frequency_type || 'months');
  const currencyId = String(recurring.currency_id || 'BRL');

  if (!Number.isFinite(transactionAmount) || transactionAmount <= 0) {
    throw new Error('MERCADOPAGO_PLAN_AMOUNT_INVALID');
  }

  const payload = {
    reason: String(plan.reason || 'TeachEasy Premium'),
    external_reference: String(userId),
    payer_email: email,
    auto_recurring: {
      frequency,
      frequency_type: frequencyType,
      transaction_amount: transactionAmount,
      currency_id: currencyId
    },
    back_url: backUrl,
    status: 'pending'
  };
  if (notificationUrl) payload.notification_url = notificationUrl;

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
  if (!webhookSecret) {
    throw new Error(isPreviewEnvironment() ? 'MERCADOPAGO_TEST_WEBHOOK_NOT_CONFIGURED' : 'MERCADOPAGO_WEBHOOK_NOT_CONFIGURED');
  }
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

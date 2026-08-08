const crypto = require('crypto');

function requireMercadoPagoConfig() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  const planId = process.env.MERCADOPAGO_PLAN_ID;
  if (!accessToken) throw new Error('MERCADOPAGO_NOT_CONFIGURED');
  return { accessToken, webhookSecret, planId };
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

async function createSubscription({ userId, email, backUrl, notificationUrl }) {
  const { planId } = requireMercadoPagoConfig();
  if (!planId) throw new Error('MERCADOPAGO_PLAN_NOT_CONFIGURED');
  const payload = {
    preapproval_plan_id: planId,
    payer_email: email,
    external_reference: userId,
    back_url: backUrl
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

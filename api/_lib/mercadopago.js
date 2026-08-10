const crypto = require('crypto');

function isPreviewEnvironment() {
  return process.env.VERCEL_ENV === 'preview';
}

function isTestAccessToken(accessToken) {
  return String(accessToken || '').trim().toUpperCase().startsWith('TEST-');
}

function requireMercadoPagoConfig() {
  const accessToken = String(process.env.MERCADOPAGO_ACCESS_TOKEN || '').trim();
  const webhookSecret = String(process.env.MERCADOPAGO_WEBHOOK_SECRET || '').trim();
  const testPayerEmail = String(process.env.MERCADOPAGO_TEST_PAYER_EMAIL || '').trim().toLowerCase();

  if (!accessToken) throw new Error('MERCADOPAGO_NOT_CONFIGURED');

  const preview = isPreviewEnvironment();
  const testCredential = isTestAccessToken(accessToken);

  if (preview && !testCredential) throw new Error('MERCADOPAGO_PREVIEW_REQUIRES_TEST_CREDENTIALS');
  if (!preview && testCredential) throw new Error('MERCADOPAGO_PRODUCTION_REQUIRES_PRODUCTION_CREDENTIALS');
  if (preview && !/^\S+@\S+\.\S+$/.test(testPayerEmail)) throw new Error('MERCADOPAGO_TEST_PAYER_NOT_CONFIGURED');

  return { accessToken, webhookSecret, testPayerEmail };
}

function getPayerEmail(email, config) {
  if (isPreviewEnvironment()) return config.testPayerEmail;
  return String(email || '').trim().toLowerCase();
}

async function mercadoPagoFetch(path, options = {}) {
  const config = requireMercadoPagoConfig();
  const response = await fetch(`https://api.mercadopago.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

async function createSubscription({ userId, email, backUrl, notificationUrl }) {
  const preview = isPreviewEnvironment();
  const config = requireMercadoPagoConfig();
  const payerEmail = getPayerEmail(email, config);
  if (!payerEmail) throw new Error('MERCADOPAGO_PAYER_EMAIL_REQUIRED');
  if (!backUrl) throw new Error('MERCADOPAGO_BACK_URL_REQUIRED');

  const payload = {
    reason: 'TeachEasy Premium',
    external_reference: String(userId),
    payer_email: payerEmail,
    auto_recurring: { frequency: 1, frequency_type: 'months', transaction_amount: 19.90, currency_id: 'BRL' },
    back_url: String(backUrl),
    status: 'pending'
  };
  if (notificationUrl && !preview) payload.notification_url = notificationUrl;

  const { response, data } = await mercadoPagoFetch('/preapproval', { method: 'POST', body: JSON.stringify(payload) });
  if (!response.ok) {
    const error = new Error(data?.message || data?.error || 'MERCADOPAGO_SUBSCRIPTION_FAILED');
    error.status = response.status; error.details = data; throw error;
  }
  return data;
}

async function createCheckoutPreference({ userId, email, successUrl, failureUrl, pendingUrl, notificationUrl }) {
  const preview = isPreviewEnvironment();
  const config = requireMercadoPagoConfig();
  const payerEmail = getPayerEmail(email, config);
  if (!payerEmail) throw new Error('MERCADOPAGO_PAYER_EMAIL_REQUIRED');

  const payload = {
    items: [{ id: 'teacheasy-premium-30d', title: 'TeachEasy Premium - 30 dias', description: 'Acesso Premium por 30 dias com 60 gerações de IA', quantity: 1, currency_id: 'BRL', unit_price: 19.90 }],
    payer: { email: payerEmail },
    external_reference: String(userId),
    payment_methods: {
      excluded_payment_types: [{ id: 'ticket' }],
      installments: 1
    },
    back_urls: {
      success: String(successUrl),
      failure: String(failureUrl),
      pending: String(pendingUrl)
    },
    auto_return: 'approved',
    statement_descriptor: 'TEACHEASY',
    metadata: { access_type: 'premium_30_days', firebase_uid: String(userId) }
  };
  if (notificationUrl && !preview) payload.notification_url = notificationUrl;

  const { response, data } = await mercadoPagoFetch('/checkout/preferences', { method: 'POST', body: JSON.stringify(payload) });
  if (!response.ok) {
    const error = new Error(data?.message || data?.error || 'MERCADOPAGO_PREFERENCE_FAILED');
    error.status = response.status; error.details = data; throw error;
  }
  return data;
}

async function getSubscription(subscriptionId) {
  const id = encodeURIComponent(String(subscriptionId || ''));
  if (!id) throw new Error('MERCADOPAGO_SUBSCRIPTION_ID_REQUIRED');
  const { response, data } = await mercadoPagoFetch(`/preapproval/${id}`, { method: 'GET' });
  if (!response.ok) {
    const error = new Error(data?.message || data?.error || 'MERCADOPAGO_SUBSCRIPTION_LOOKUP_FAILED');
    error.status = response.status; error.details = data; throw error;
  }
  return data;
}

async function getPayment(paymentId) {
  const id = encodeURIComponent(String(paymentId || ''));
  if (!id) throw new Error('MERCADOPAGO_PAYMENT_ID_REQUIRED');
  const { response, data } = await mercadoPagoFetch(`/v1/payments/${id}`, { method: 'GET' });
  if (!response.ok) {
    const error = new Error(data?.message || data?.error || 'MERCADOPAGO_PAYMENT_LOOKUP_FAILED');
    error.status = response.status; error.details = data; throw error;
  }
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

module.exports = { createCheckoutPreference, createSubscription, getPayment, getSubscription, validateWebhookSignature };

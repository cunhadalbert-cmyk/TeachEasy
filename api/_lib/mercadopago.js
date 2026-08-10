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

  if (preview && !testCredential) {
    throw new Error('MERCADOPAGO_PREVIEW_REQUIRES_TEST_CREDENTIALS');
  }
  if (!preview && testCredential) {
    throw new Error('MERCADOPAGO_PRODUCTION_REQUIRES_PRODUCTION_CREDENTIALS');
  }
  if (preview && !/^\S+@\S+\.\S+$/.test(testPayerEmail)) {
    throw new Error('MERCADOPAGO_TEST_PAYER_NOT_CONFIGURED');
  }

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

  // Um único fluxo para Preview e Production: assinatura recorrente sem plano
  // associado, criada como pending. O Mercado Pago devolve init_point para o
  // comprador escolher o meio de pagamento e concluir a autorização.
  const payload = {
    reason: 'TeachEasy Premium',
    external_reference: String(userId),
    payer_email: payerEmail,
    auto_recurring: {
      frequency: 1,
      frequency_type: 'months',
      transaction_amount: 19.90,
      currency_id: 'BRL'
    },
    back_url: String(backUrl),
    status: 'pending'
  };

  // Previews da Vercel podem ser protegidos por autenticação e não são um
  // destino confiável para webhooks externos. Em produção usamos o webhook
  // público do próprio TeachEasy.
  if (notificationUrl && !preview) payload.notification_url = notificationUrl;

  const { response, data } = await mercadoPagoFetch('/preapproval', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = new Error(data?.message || data?.error || 'MERCADOPAGO_SUBSCRIPTION_FAILED');
    error.status = response.status;
    error.details = data;
    throw error;
  }
  return data;
}

async function getSubscription(subscriptionId) {
  const id = encodeURIComponent(String(subscriptionId || ''));
  if (!id) throw new Error('MERCADOPAGO_SUBSCRIPTION_ID_REQUIRED');
  const { response, data } = await mercadoPagoFetch(`/preapproval/${id}`, { method: 'GET' });
  if (!response.ok) {
    const error = new Error(data?.message || data?.error || 'MERCADOPAGO_SUBSCRIPTION_LOOKUP_FAILED');
    error.status = response.status;
    error.details = data;
    throw error;
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

module.exports = { createSubscription, getSubscription, validateWebhookSignature };

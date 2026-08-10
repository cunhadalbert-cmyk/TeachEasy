const { getPayment, getSubscription, validateWebhookSignature } = require('../_lib/mercadopago');
const { syncOneTimePaymentStatus, syncSubscriptionStatus } = require('../_lib/firebase');

function json(response, status, payload) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').end(JSON.stringify(payload));
}

function notificationDataId(request) {
  const queryId = request.query?.['data.id'] || request.query?.data_id || request.query?.id;
  if (queryId) return String(queryId);
  const body = typeof request.body === 'object' ? request.body : {};
  return body?.data?.id ? String(body.data.id) : '';
}

function validFirebaseUid(value) { return /^[A-Za-z0-9:_-]{1,128}$/.test(String(value || '')); }
function notificationType(request) { const body = typeof request.body === 'object' ? request.body : {}; return String(body.type || request.query?.type || request.query?.topic || '').toLowerCase(); }
function isSubscriptionNotification(type) { return type.includes('subscription') || type.includes('preapproval'); }
function isPaymentNotification(type) { return type === 'payment' || type.includes('payment'); }
function isMissingSubscription(error) { if (Number(error?.status) === 404) return true; return /preapproval.*does not exist|subscription.*not found|not-found/i.test(String(error?.message || '')); }

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') return json(response, 405, { error: 'Método não permitido.' });
  try {
    const dataId = notificationDataId(request);
    const valid = validateWebhookSignature({ xSignature: request.headers['x-signature'], xRequestId: request.headers['x-request-id'], dataId });
    if (!valid) return json(response, 401, { error: 'Assinatura do webhook inválida.' });
    const type = notificationType(request);
    if (!dataId) return json(response, 200, { ok: true, ignored: true });

    if (isPaymentNotification(type)) {
      const payment = await getPayment(dataId);
      const userId = String(payment.external_reference || payment.metadata?.firebase_uid || '');
      if (!validFirebaseUid(userId)) return json(response, 200, { ok: true, ignored: true });
      const activated = await syncOneTimePaymentStatus({ userId, paymentId: payment.id, mercadoPagoStatus: payment.status });
      return json(response, 200, { ok: true, activated });
    }

    if (!isSubscriptionNotification(type)) return json(response, 200, { ok: true, ignored: true, type });

    let subscription;
    try { subscription = await getSubscription(dataId); }
    catch (error) {
      if (isMissingSubscription(error)) {
        console.info('mercadopago-webhook-ignored-missing-preapproval', { dataId, type: type || 'unknown' });
        return json(response, 200, { ok: true, ignored: true });
      }
      throw error;
    }

    const userId = String(subscription.external_reference || '');
    if (!validFirebaseUid(userId)) {
      console.warn('mercadopago-webhook-without-valid-user', dataId);
      return json(response, 200, { ok: true, ignored: true });
    }
    await syncSubscriptionStatus({ userId, subscriptionId: subscription.id, mercadoPagoStatus: subscription.status, nextPaymentDate: subscription.next_payment_date || null });
    return json(response, 200, { ok: true });
  } catch (error) {
    if (/MERCADOPAGO_.*NOT_CONFIGURED/.test(error.message || '')) return json(response, 503, { error: 'Webhook ainda não configurado.' });
    if (/FIREBASE_.*NOT_CONFIGURED/.test(error.message || '')) return json(response, 503, { error: 'Firebase ainda não configurado.' });
    console.error('mercadopago-webhook-failed', error.message || error);
    return json(response, 500, { error: 'Não foi possível processar a notificação.' });
  }
};

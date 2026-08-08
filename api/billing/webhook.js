const { getSubscription, validateWebhookSignature } = require('../_lib/mercadopago');
const { syncSubscriptionStatus } = require('../_lib/supabase');

function json(response, status, payload) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').end(JSON.stringify(payload));
}

function notificationDataId(request) {
  const queryId = request.query?.['data.id'] || request.query?.data_id || request.query?.id;
  if (queryId) return String(queryId);
  const body = typeof request.body === 'object' ? request.body : {};
  return body?.data?.id ? String(body.data.id) : '';
}

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') return json(response, 405, { error: 'Método não permitido.' });
  try {
    const dataId = notificationDataId(request);
    const valid = validateWebhookSignature({
      xSignature: request.headers['x-signature'],
      xRequestId: request.headers['x-request-id'],
      dataId
    });
    if (!valid) return json(response, 401, { error: 'Assinatura do webhook inválida.' });

    const body = typeof request.body === 'object' ? request.body : {};
    const type = String(body.type || request.query?.type || '').toLowerCase();
    if (!dataId) return json(response, 200, { ok: true, ignored: true });
    if (type && !type.includes('subscription') && !type.includes('preapproval')) {
      return json(response, 200, { ok: true, ignored: true });
    }

    const subscription = await getSubscription(dataId);
    const userId = String(subscription.external_reference || '');
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId)) {
      console.warn('mercadopago-webhook-without-valid-user', dataId);
      return json(response, 200, { ok: true, ignored: true });
    }

    await syncSubscriptionStatus({
      userId,
      subscriptionId: subscription.id,
      mercadoPagoStatus: subscription.status,
      nextPaymentDate: subscription.next_payment_date || null
    });
    return json(response, 200, { ok: true });
  } catch (error) {
    if (/MERCADOPAGO_.*NOT_CONFIGURED/.test(error.message || '')) return json(response, 503, { error: 'Webhook ainda não configurado.' });
    console.error('mercadopago-webhook-failed', error.message || error);
    return json(response, 500, { error: 'Não foi possível processar a notificação.' });
  }
};

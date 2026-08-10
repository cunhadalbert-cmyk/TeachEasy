const { getAuthenticatedUser, getProfile } = require('../_lib/firebase');
const { createCheckoutPreference } = require('../_lib/mercadopago');

function json(response, status, payload) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').end(JSON.stringify(payload));
}

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') return json(response, 405, { error: 'Método não permitido.' });
  try {
    const session = await getAuthenticatedUser(request, response);
    if (!session?.user?.id) return json(response, 401, { error: 'Entre na sua conta para pagar o TeachEasy.' });
    const profile = await getProfile(session.user.id);
    if (!profile) return json(response, 404, { error: 'Perfil não encontrado.' });
    if (profile.subscription_status === 'active') return json(response, 409, { error: 'Seu acesso Premium já está ativo.' });

    const origin = String(request.headers.origin || `https://${request.headers.host || 'www.teacheasy.com.br'}`).replace(/\/$/, '');
    const publicOrigin = process.env.VERCEL_ENV === 'preview' ? 'https://www.teacheasy.com.br' : origin;
    const preference = await createCheckoutPreference({
      userId: session.user.id,
      email: session.user.email,
      successUrl: `${publicOrigin}/account.html?pagamento=aprovado`,
      failureUrl: `${publicOrigin}/account.html?pagamento=recusado`,
      pendingUrl: `${publicOrigin}/account.html?pagamento=pendente`,
      notificationUrl: `${origin}/api/billing/webhook?source_news=webhooks`
    });

    const checkoutUrl = process.env.VERCEL_ENV === 'preview'
      ? (preference?.sandbox_init_point || preference?.init_point)
      : preference?.init_point;
    if (!preference?.id || !checkoutUrl) throw new Error('MERCADOPAGO_CHECKOUT_MISSING');

    return json(response, 201, { checkoutUrl, preferenceId: preference.id });
  } catch (error) {
    const code = String(error?.message || '');
    if (/MERCADOPAGO_.*NOT_CONFIGURED/.test(code)) return json(response, 503, { error: 'Mercado Pago ainda não está configurado neste ambiente.' });
    if (code === 'MERCADOPAGO_PREVIEW_REQUIRES_TEST_CREDENTIALS') return json(response, 503, { error: 'O Preview precisa usar credenciais de teste do Mercado Pago.' });
    if (code === 'MERCADOPAGO_PRODUCTION_REQUIRES_PRODUCTION_CREDENTIALS') return json(response, 503, { error: 'A produção precisa usar credenciais de produção do Mercado Pago.' });
    if (code === 'MERCADOPAGO_TEST_PAYER_NOT_CONFIGURED') return json(response, 503, { error: 'Configure a conta compradora de teste no Preview.' });
    if (/FIREBASE_.*NOT_CONFIGURED/.test(code)) return json(response, 503, { error: 'Cadastro ainda não foi conectado ao Firebase.' });
    console.error('one-time-payment-create-failed', { message: error?.message, status: error?.status, details: error?.details });
    return json(response, 502, { error: 'Não foi possível abrir as opções de pagamento agora.' });
  }
};

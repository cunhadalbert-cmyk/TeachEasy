const { getAuthenticatedUser, getProfile, saveMercadoPagoSubscription } = require('../_lib/firebase');
const { createSubscription } = require('../_lib/mercadopago');

function json(response, status, payload) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').end(JSON.stringify(payload));
}

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') return json(response, 405, { error: 'Método não permitido.' });
  try {
    const session = await getAuthenticatedUser(request, response);
    if (!session?.user?.id) return json(response, 401, { error: 'Entre na sua conta para assinar o TeachEasy.' });
    const profile = await getProfile(session.user.id);
    if (!profile) return json(response, 404, { error: 'Perfil não encontrado.' });
    if (profile.subscription_status === 'active') return json(response, 409, { error: 'Sua assinatura já está ativa.' });

    const origin = String(request.headers.origin || `https://${request.headers.host || 'www.teacheasy.com.br'}`).replace(/\/$/, '');
    const subscription = await createSubscription({
      userId: session.user.id,
      email: session.user.email,
      backUrl: `${origin}/account.html?pagamento=retorno`,
      notificationUrl: `${origin}/api/billing/webhook?source_news=webhooks`
    });

    if (!subscription?.id || !subscription?.init_point) throw new Error('MERCADOPAGO_CHECKOUT_MISSING');
    await saveMercadoPagoSubscription(session.user.id, subscription.id, subscription.status || 'pending');
    return json(response, 201, { checkoutUrl: subscription.init_point });
  } catch (error) {
    const code = String(error?.message || '');
    if (code === 'MERCADOPAGO_NOT_CONFIGURED') {
      console.warn('mercadopago-config-missing', { accessToken: false });
      return json(response, 503, { error: 'O Access Token do Mercado Pago não está disponível neste ambiente.' });
    }
    if (code === 'MERCADOPAGO_PLAN_NOT_CONFIGURED') {
      console.warn('mercadopago-config-missing', { planId: false });
      return json(response, 503, { error: 'O ID do plano do Mercado Pago não está disponível neste ambiente.' });
    }
    if (/FIREBASE_.*NOT_CONFIGURED/.test(code)) return json(response, 503, { error: 'Cadastro ainda não foi conectado ao Firebase.' });
    console.error('subscription-create-failed', code || error);
    return json(response, 502, { error: 'Não foi possível abrir o pagamento agora.' });
  }
};

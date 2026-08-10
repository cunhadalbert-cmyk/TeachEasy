const { getAuthenticatedUser, getProfile, saveMercadoPagoSubscription } = require('../_lib/firebase');
const { createSubscription } = require('../_lib/mercadopago');

function json(response, status, payload) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').end(JSON.stringify(payload));
}

function safeMercadoPagoError(error) {
  const details = error?.details && typeof error.details === 'object' ? error.details : {};
  return {
    message: String(error?.message || ''),
    status: Number(error?.status || details?.status || 0) || undefined,
    error: typeof details?.error === 'string' ? details.error : undefined,
    cause: Array.isArray(details?.cause)
      ? details.cause.map(item => ({ code: item?.code, description: item?.description })).filter(item => item.code || item.description)
      : undefined,
    messageFromApi: typeof details?.message === 'string' ? details.message : undefined
  };
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
      // O retorno do Preview usa o domínio público porque o Mercado Pago precisa
      // conseguir redirecionar o comprador para uma URL acessível.
      backUrl: process.env.VERCEL_ENV === 'preview'
        ? 'https://www.teacheasy.com.br/account.html?pagamento=retorno'
        : `${origin}/account.html?pagamento=retorno`,
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
    if (code === 'MERCADOPAGO_PREVIEW_REQUIRES_TEST_CREDENTIALS') {
      console.warn('mercadopago-preview-credential-mismatch');
      return json(response, 503, { error: 'O Preview precisa usar o Access Token de teste do Mercado Pago.' });
    }
    if (code === 'MERCADOPAGO_PRODUCTION_REQUIRES_PRODUCTION_CREDENTIALS') {
      console.error('mercadopago-production-credential-mismatch');
      return json(response, 503, { error: 'O ambiente de produção precisa usar o Access Token de produção do Mercado Pago.' });
    }
    if (code === 'MERCADOPAGO_TEST_PAYER_NOT_CONFIGURED') {
      console.warn('mercadopago-test-payer-missing');
      return json(response, 503, { error: 'Configure o e-mail da conta compradora de teste do Mercado Pago no Preview.' });
    }
    if (code === 'MERCADOPAGO_PAYER_EMAIL_REQUIRED') {
      return json(response, 400, { error: 'A conta precisa ter um e-mail válido para iniciar o pagamento.' });
    }
    if (/FIREBASE_.*NOT_CONFIGURED/.test(code)) return json(response, 503, { error: 'Cadastro ainda não foi conectado ao Firebase.' });

    const diagnostic = safeMercadoPagoError(error);
    console.error('subscription-create-failed', diagnostic);

    if (process.env.VERCEL_ENV === 'preview') {
      const previewMessage = diagnostic.messageFromApi || diagnostic.cause?.[0]?.description || diagnostic.message;
      return json(response, 502, {
        error: previewMessage ? `Mercado Pago recusou a criação da assinatura: ${previewMessage}` : 'Não foi possível abrir o pagamento agora.'
      });
    }

    return json(response, 502, { error: 'Não foi possível abrir o pagamento agora.' });
  }
};

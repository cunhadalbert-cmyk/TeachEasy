const { getAuthenticatedUser, getProfile } = require('../_lib/supabase');

function json(response, status, payload) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').end(JSON.stringify(payload));
}

module.exports = async function handler(request, response) {
  if (request.method !== 'GET') return json(response, 405, { error: 'Método não permitido.' });
  try {
    const session = await getAuthenticatedUser(request, response);
    if (!session) return json(response, 401, { authenticated: false });
    const profile = await getProfile(session.user.id);
    if (!profile) return json(response, 404, { error: 'Perfil não encontrado.' });

    const limit = Number(profile.ai_limit) || 60;
    const used = Number(profile.ai_used) || 0;
    return json(response, 200, {
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        displayName: profile.display_name || session.user.user_metadata?.display_name || ''
      },
      subscription: {
        plan: profile.plan,
        status: profile.subscription_status,
        price: 24.90,
        launchPrice: 19.90
      },
      ai: {
        limit,
        used,
        remaining: Math.max(0, limit - used),
        periodStart: profile.period_start,
        periodEnd: profile.period_end
      }
    });
  } catch (error) {
    if (/SUPABASE_.*NOT_CONFIGURED/.test(error.message || '')) return json(response, 503, { error: 'Cadastro ainda não foi conectado ao banco.' });
    console.error('account-read-failed', error.message || error);
    return json(response, 500, { error: 'Não foi possível consultar a conta agora.' });
  }
};

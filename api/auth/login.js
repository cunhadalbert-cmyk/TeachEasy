const { getAuthenticatedUser, setSessionCookies, signIn } = require('../_lib/firebase');

function json(response, status, payload) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').end(JSON.stringify(payload));
}

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') return json(response, 405, { error: 'Método não permitido.' });
  try {
    const body = typeof request.body === 'object' ? request.body : JSON.parse(request.body || '{}');
    const email = String(body.email || '').trim().toLowerCase().slice(0, 254);
    const password = String(body.password || '');
    if (!email || !password) return json(response, 400, { error: 'Informe e-mail e senha.' });

    const { response: authResponse, data } = await signIn(email, password);
    if (!authResponse.ok || !data?.idToken) {
      return json(response, 401, { error: 'E-mail ou senha inválidos.' });
    }

    setSessionCookies(response, data);
    const session = await getAuthenticatedUser(request, response);
    if (session === null) return json(response, 403, { error: 'Confirme seu e-mail antes de entrar.' });
    return json(response, 200, { ok: true });
  } catch (error) {
    if (error.message === 'FIREBASE_NOT_CONFIGURED') return json(response, 503, { error: 'Login ainda não foi conectado ao Firebase.' });
    console.error('login-failed', error.message || error);
    return json(response, 500, { error: 'Não foi possível entrar agora.' });
  }
};

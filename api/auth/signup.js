const { setSessionCookies, signUp } = require('../_lib/firebase');

function json(response, status, payload) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').end(JSON.stringify(payload));
}

function cleanEmail(value) {
  return String(value || '').trim().toLowerCase().slice(0, 254);
}

function firebaseErrorCode(value) {
  return String(value || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_ -]/g, '')
    .slice(0, 160);
}

function authErrorMessage(code) {
  const normalized = firebaseErrorCode(code);
  if (normalized.includes('EMAIL_EXISTS')) return 'Este e-mail já está cadastrado.';
  if (normalized.includes('INVALID_EMAIL')) return 'Informe um e-mail válido.';
  if (normalized.includes('WEAK_PASSWORD')) return 'A senha precisa ter pelo menos 8 caracteres.';
  if (normalized.includes('TOO_MANY_ATTEMPTS')) return 'Muitas tentativas seguidas. Aguarde alguns minutos e tente novamente.';
  if (normalized.includes('OPERATION_NOT_ALLOWED')) return 'O cadastro por e-mail e senha ainda não está habilitado no Firebase.';
  if (normalized.includes('CONFIGURATION_NOT_FOUND')) return 'A configuração do Firebase Authentication ainda não está disponível para este projeto.';
  if (normalized.includes('API KEY NOT VALID') || normalized.includes('API_KEY_INVALID') || normalized.includes('INVALID_API_KEY')) {
    return 'A FIREBASE_API_KEY configurada na Vercel não é válida para este projeto.';
  }
  if (normalized.includes('PROJECT_NUMBER_MISMATCH')) return 'A chave do Firebase pertence a outro projeto.';
  return 'Não foi possível criar a conta. O Firebase recusou a solicitação.';
}

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') return json(response, 405, { error: 'Método não permitido.' });
  try {
    const body = typeof request.body === 'object' ? request.body : JSON.parse(request.body || '{}');
    const displayName = String(body.displayName || '').trim().slice(0, 100);
    const email = cleanEmail(body.email);
    const password = String(body.password || '');

    if (displayName.length < 2) return json(response, 400, { error: 'Informe seu nome.' });
    if (!/^\S+@\S+\.\S+$/.test(email)) return json(response, 400, { error: 'Informe um e-mail válido.' });
    if (password.length < 8) return json(response, 400, { error: 'A senha precisa ter pelo menos 8 caracteres.' });

    const { response: authResponse, data } = await signUp(email, password, displayName);
    if (!authResponse.ok) {
      const code = firebaseErrorCode(data?.error?.message);
      console.warn('firebase-signup-rejected', { status: authResponse.status, code });
      return json(response, 400, { error: authErrorMessage(code) });
    }

    setSessionCookies(response, data);
    return json(response, 201, {
      ok: true,
      requiresEmailConfirmation: true,
      message: 'Conta criada. Enviamos um e-mail para confirmar seu cadastro.'
    });
  } catch (error) {
    if (error.message === 'FIREBASE_NOT_CONFIGURED') return json(response, 503, { error: 'Cadastro ainda não foi conectado ao Firebase.' });
    if (error.message === 'FIREBASE_SERVICE_ACCOUNT_INVALID') return json(response, 503, { error: 'A credencial de servidor do Firebase está inválida.' });
    console.error('signup-failed', error.message || error);
    return json(response, 500, { error: 'Não foi possível criar a conta agora.' });
  }
};

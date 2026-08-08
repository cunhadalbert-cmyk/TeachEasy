const { clearSessionCookies } = require('../_lib/supabase');

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).setHeader('Content-Type', 'application/json; charset=utf-8').end(JSON.stringify({ error: 'Método não permitido.' }));
    return;
  }
  clearSessionCookies(response);
  response.status(200).setHeader('Content-Type', 'application/json; charset=utf-8').end(JSON.stringify({ ok: true }));
};

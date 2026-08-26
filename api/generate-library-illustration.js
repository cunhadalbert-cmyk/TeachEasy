const MAX_BODY_BYTES = 8_000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 8;
const requestBuckets = new Map();
const OFFICIAL_CAST_PATH = '/public/illustrations/reference/teacheasy-official-cast.png';
const OFFICIAL_CAST_RAW_URL = 'https://raw.githubusercontent.com/cunhadalbert-cmyk/TeachEasy/main/public/illustrations/reference/teacheasy-official-cast.png';
const { generateIllustrationBuffer } = require('./_lib/illustration-generation');

function json(response, status, payload) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').end(JSON.stringify(payload));
}

function safeText(value, max = 500) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function clientIp(request) {
  return safeText(request.headers['x-forwarded-for'] || request.headers['x-real-ip'] || 'unknown', 120).split(',')[0].trim();
}

function rateLimited(request) {
  const now = Date.now();
  const ip = clientIp(request);
  const current = requestBuckets.get(ip);
  if (!current || now - current.startedAt > WINDOW_MS) {
    requestBuckets.set(ip, { startedAt: now, count: 1 });
    return false;
  }
  current.count += 1;
  return current.count > MAX_REQUESTS_PER_WINDOW;
}

function requestOrigin(request) {
  const proto = safeText(request.headers['x-forwarded-proto'] || 'https', 10) || 'https';
  const host = safeText(request.headers['x-forwarded-host'] || request.headers.host || '', 220);
  return host ? `${proto}://${host}` : '';
}

async function fetchOfficialCastReference(request) {
  const candidates = [];
  const origin = requestOrigin(request);
  if (origin) candidates.push(`${origin}${OFFICIAL_CAST_PATH}`);
  candidates.push(OFFICIAL_CAST_RAW_URL);

  let lastError = null;
  for (const url of candidates) {
    try {
      const result = await fetch(url, { headers: { Accept: 'image/png,image/*' }, cache: 'no-store' });
      if (!result.ok) {
        lastError = new Error(`Referência visual retornou HTTP ${result.status}.`);
        continue;
      }
      const contentType = (result.headers.get('content-type') || '').toLowerCase();

      if (!/^image\/(png|jpeg|webp)(?:;|$)/i.test(contentType)) {
        lastError = new Error(`Referência visual retornou tipo inválido: ${contentType || 'desconhecido'}.`);
        continue;
      }

      const bytes = await result.arrayBuffer();

      if (bytes.byteLength < 10_000) {
        lastError = new Error('Referência visual oficial inválida ou incompleta.');
        continue;
      }
      return { bytes, contentType };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('Não foi possível carregar a referência visual oficial.');
}

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') return json(response, 405, { error: 'Método não permitido.' });
  if (!process.env.OPENAI_API_KEY) return json(response, 503, { error: 'A geração de ilustração não está configurada.' });
  if (rateLimited(request)) return json(response, 429, { error: 'Muitas ilustrações foram solicitadas em pouco tempo. Aguarde alguns minutos.' });

  const rawBody = typeof request.body === 'string' ? request.body : JSON.stringify(request.body || {});
  if (Buffer.byteLength(rawBody) > MAX_BODY_BYTES) return json(response, 413, { error: 'Solicitação grande demais.' });

  try {
    const input = typeof request.body === 'object' ? request.body : JSON.parse(rawBody);
    const subject = safeText(input.subject || 'Atividade Escolar', 90);
    const topic = safeText(input.topic || 'conteúdo escolar', 180);
    const context = safeText(input.context || '', 700);
    const reference = await fetchOfficialCastReference(request);
    const imageBuffer = await generateIllustrationBuffer({
      subject,
      topic,
      context,
      referenceBuffer: Buffer.from(reference.bytes),
      referenceType: reference.contentType
    });

    return json(response, 200, { illustrationDataUrl: `data:image/png;base64,${imageBuffer.toString('base64')}` });
  } catch (error) {
    console.error('library-illustration-generation-failed', error.message || error);
    return json(response, 502, { error: 'Não foi possível gerar a ilustração com a referência visual oficial. Tente novamente em instantes.' });
  }
};

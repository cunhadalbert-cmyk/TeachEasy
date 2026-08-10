const MAX_BODY_BYTES = 8_000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 8;
const requestBuckets = new Map();

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

function stylePrompt(subject, topic, context) {
  const base = `Crie UMA ilustração pedagógica infantil colorida para material didático escolar brasileiro. O resultado deve ter acabamento de ilustração editorial infantil de alta qualidade, semelhante a livro didático ilustrado: personagens simpáticos e expressivos, traço digital suave e detalhado, volumes e sombras leves, cores vivas porém equilibradas, cenário completo, composição acolhedora e profissional. Mostre uma cena de aprendizagem real com 3 a 5 crianças diversas em ambiente escolar, interagindo com objetos diretamente relacionados ao conteúdo. Não faça clipart, pictograma, ícone, infográfico, vetor chapado, bonecos geométricos, emoji, desenho esquemático, fotografia nem render 3D. Não inclua textos, letras, números escritos, respostas, logotipos ou marcas d'água. Fundo de sala de aula claro e organizado. Enquadramento horizontal, composição limpa, própria para ocupar aproximadamente metade de uma folha A4 ao lado de um texto.`;
  const math = /matem|número|adição|subtração|multiplica|divis|fraç|decimal|milhar|centena|dezena|unidade|geometr/i.test(`${subject} ${topic} ${context}`)
    ? ' Para Matemática, use materiais manipuláveis visuais como blocos de base dez/material dourado, cubos, barras, fichas, cartões e agrupamentos sobre a mesa, sem escrever operações ou respostas.'
    : '';
  return `${base}${math} Disciplina: ${subject}. Tema: ${topic}. Contexto pedagógico: ${context || topic}.`;
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
    const prompt = stylePrompt(subject, topic, context);

    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-image-2',
        prompt,
        size: '1024x1024',
        quality: 'medium',
        output_format: 'png'
      })
    });

    const imageData = await imageResponse.json();
    if (!imageResponse.ok) throw new Error(imageData.error?.message || 'Não foi possível gerar a ilustração.');
    const imageBase64 = imageData.data?.[0]?.b64_json;
    if (!imageBase64) throw new Error('A IA não retornou a ilustração.');

    return json(response, 200, { illustrationDataUrl: `data:image/png;base64,${imageBase64}` });
  } catch (error) {
    console.error('library-illustration-generation-failed', error.message || error);
    return json(response, 502, { error: 'Não foi possível gerar a ilustração pedagógica agora.' });
  }
};

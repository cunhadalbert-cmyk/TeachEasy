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
  const characters = `Use SEMPRE o mesmo elenco visual oficial do TeachEasy, mantendo identidade, rosto, cabelo, óculos, idade aparente e proporções consistentes entre todas as ilustrações: exatamente quatro crianças e um cachorro pequeno. Personagem 1: menina maior, cabelo preto longo, roupa casual colorida e tênis preto. Personagem 2: menina menor, cabelo claro preso, óculos de grau, roupa casual colorida. Personagem 3: menino moreno de pele escura, cabelo preto bem baixinho, óculos de grau pretos, roupa casual colorida; quando usar casaco azul, mantenha os óculos e o cabelo bem curto. Personagem 4: menino de cabelo preto, sem óculos, roupa casual colorida; quando usar blusa verde, o cabelo continua preto. Cachorro: pequeno, simpático, pelagem cinza mesclada com preto, tipo poodle, sem coleira. Não use uniforme escolar. Não troque os óculos entre personagens. Não altere cor de cabelo, tom de pele, formato do rosto ou características principais entre cenas.`;
  const base = `Crie UMA ilustração pedagógica infantil colorida para material didático escolar brasileiro. ${characters} O resultado deve seguir um estilo editorial infantil LEVE, LIMPO e SUAVE, semelhante a uma ilustração didática moderna: fundo branco ou muito claro, bastante espaço visual, poucos elementos de cenário, sombras discretas, contornos suaves, cores alegres porém claras e pouco saturadas, sem excesso de textura, sem aparência pesada e sem realismo excessivo. Os personagens devem ser simpáticos, expressivos e fáceis de reconhecer, mantendo o mesmo visual em todas as atividades. A cena deve mostrar os personagens realizando uma ação diretamente ligada ao conteúdo da atividade. Não faça clipart, pictograma, ícone, infográfico, vetor chapado, bonecos geométricos, emoji, fotografia nem render 3D realista. Não crie retrato, publicidade, logotipo, meme, arte promocional ou imagem sem finalidade didática. Não inclua textos, letras, números escritos, respostas, logotipos ou marcas d'água. Prefira composição horizontal simples e organizada, própria para ocupar aproximadamente metade de uma folha A4 ao lado de um texto. Evite cenários cheios, excesso de objetos, iluminação dramática, tons escuros, contraste forte e acabamento cinematográfico.`;
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
        quality: 'low',
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

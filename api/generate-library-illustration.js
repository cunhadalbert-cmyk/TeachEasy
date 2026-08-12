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
  const officialCast = `Use SEMPRE e OBRIGATORIAMENTE o mesmo elenco visual oficial do TeachEasy em TODAS as ilustrações. A cena deve conter EXATAMENTE quatro crianças e um cachorro pequeno, sem omitir, substituir ou acrescentar personagens.

ELENCO OFICIAL FIXO:
1) Menina maior: cabelo preto longo, sem óculos, camiseta roxa, calça jeans azul clara, tênis preto; aparência infantil, simpática e delicada.
2) Menina menor: cabelo loiro/claro preso, óculos de grau pretos, camiseta amarela, jardineira/roupa azul, tênis rosa; aparência infantil, meiga e estudiosa.
3) Menino moreno: pele escura, cabelo preto bem baixinho, óculos de grau pretos OBRIGATORIAMENTE, roupa casual azul; aparência infantil e alegre.
4) Menino de blusa verde: cabelo preto, SEM óculos OBRIGATORIAMENTE, camiseta verde, bermuda escura, tênis preto e branco; aparência infantil e alegre.
5) Cachorro: pequeno, simpático, tipo poodle, pelagem cinza mesclada com preto, sem coleira; deve aparecer SEMPRE junto do grupo.

REGRAS DE CONSISTÊNCIA: não alterar cor ou comprimento do cabelo; não trocar ou remover óculos; não alterar tom de pele; não alterar formato geral do rosto; não alterar idade aparente; não trocar as roupas-base principais; o menino moreno SEMPRE usa óculos; o menino de blusa verde NUNCA usa óculos; o cachorro SEMPRE aparece.`;

  const style = `Crie UMA ilustração pedagógica infantil colorida para material didático escolar brasileiro. ${officialCast}
O estilo deve ser LEVE, LIMPO e SUAVE, semelhante à ilustração aprovada de reciclagem: fundo branco ou muito claro, bastante espaço visual, poucos elementos de cenário, contornos suaves, sombras discretas, cores alegres porém claras e pouco saturadas, sem excesso de textura, sem aparência pesada, sem realismo excessivo e sem acabamento cinematográfico. Os personagens devem ser simpáticos, expressivos e fáceis de reconhecer, mantendo o mesmo rosto e identidade visual em todas as atividades.
A cena deve mostrar os personagens realizando uma ação diretamente ligada ao conteúdo da atividade. Não faça clipart, pictograma, ícone, infográfico, vetor chapado, bonecos geométricos, emoji, fotografia nem render 3D realista. Não crie retrato, publicidade, logotipo, meme, arte promocional ou imagem sem finalidade didática. Não inclua textos, letras, números escritos, respostas, logotipos ou marcas d'água. Prefira composição horizontal simples e organizada, própria para ocupar aproximadamente metade de uma folha A4 ao lado de um texto.`;

  const geography = /geograf|migra|famílias migrantes|campo|cidade|paisagem|território|mapa|trajeto/i.test(`${subject} ${topic} ${context}`)
    ? ' Para Geografia, represente visualmente o tema estudado com elementos simples e didáticos. Se o tema envolver migração, use mapas, malas, caixas, trajetos, chegada ou mudança de paisagem, mantendo SEMPRE o elenco oficial completo e com as características fixas acima.'
    : '';

  const math = /matem|número|adição|subtração|multiplica|divis|fraç|decimal|milhar|centena|dezena|unidade|geometr/i.test(`${subject} ${topic} ${context}`)
    ? ' Para Matemática, use materiais manipuláveis visuais como blocos de base dez/material dourado, cubos, barras, fichas, cartões e agrupamentos sobre a mesa, sem escrever operações ou respostas.'
    : '';

  return `${style}${geography}${math} Disciplina: ${subject}. Tema: ${topic}. Contexto pedagógico: ${context || topic}. IMPORTANTE: se qualquer personagem vier diferente do padrão oficial, a ilustração está errada. Se faltar o cachorro, a ilustração está errada. Se o menino moreno vier sem óculos, a ilustração está errada. Se o menino de camiseta verde vier com óculos, a ilustração está errada.`;
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

const MAX_BODY_BYTES = 8_000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 8;
const requestBuckets = new Map();
const OFFICIAL_CAST_PATH = '/illustrations/reference/teacheasy-official-cast.jpg';
const OFFICIAL_CAST_RAW_URL = 'https://raw.githubusercontent.com/cunhadalbert-cmyk/TeachEasy/main/public/illustrations/reference/teacheasy-official-cast.jpg';

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
      const result = await fetch(url, { headers: { Accept: 'image/jpeg,image/png,image/*' } });
      if (!result.ok) {
        lastError = new Error(`Referência visual retornou HTTP ${result.status}.`);
        continue;
      }
      const contentType = result.headers.get('content-type') || 'image/jpeg';
      const bytes = await result.arrayBuffer();
      if (!bytes.byteLength) {
        lastError = new Error('Referência visual vazia.');
        continue;
      }
      return { bytes, contentType };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('Não foi possível carregar a referência visual oficial.');
}

function stylePrompt(subject, topic, context) {
  const officialCast = `A IMAGEM DE ENTRADA é a REFERÊNCIA VISUAL OFICIAL E OBRIGATÓRIA do TeachEasy. Preserve com ALTA FIDELIDADE a identidade dos mesmos quatro personagens e do mesmo cachorro: rostos, formato dos olhos, tom de pele, cabelo, óculos, idade aparente, proporções corporais, roupas-base, calçados e aparência geral. Não redesenhe o elenco com outra identidade e não transforme os personagens em pessoas diferentes.

ELENCO OFICIAL FIXO DA IMAGEM DE REFERÊNCIA:
1) Menino moreno: pele escura, cabelo preto bem baixinho, óculos pretos, casaco azul sobre camiseta branca, calça escura e tênis azul.
2) Menina maior: cabelo preto longo, sem óculos, camiseta roxa, jeans azul-claro e tênis preto.
3) Menina menor: cabelo loiro preso, óculos pretos, camiseta amarela, jardineira azul e tênis rosa.
4) Menino de verde: cabelo preto, sem óculos, camiseta verde, bermuda escura e tênis preto e branco.
5) Cachorro: pequeno, tipo poodle, pelagem cinza mesclada com preto, sem coleira.

A cena nova deve conter EXATAMENTE essas quatro crianças e esse cachorro. Não omita, não acrescente e não substitua personagens. O menino moreno SEMPRE usa óculos. O menino de verde NUNCA usa óculos. O cachorro SEMPRE aparece.`;

  const style = `Crie UMA NOVA CENA pedagógica infantil para material didático brasileiro usando a imagem de entrada SOMENTE como referência canônica de identidade e estilo dos personagens. ${officialCast}
Mantenha o mesmo estilo visual da referência: ilustração infantil digital limpa, simpática, leve, clara, com acabamento suave, fundo branco ou muito claro quando possível, sombras delicadas, cores alegres sem excesso de saturação e aparência consistente entre atividades. Não use fotografia, realismo fotográfico, render 3D realista, infográfico, clipart, pictograma, vetor chapado ou acabamento cinematográfico pesado.
Adapte apenas pose, ação, objetos pedagógicos e cenário ao conteúdo da atividade. Não copie a pose de grupo da referência quando ela não combinar com o tema. Não inclua textos, letras, números escritos, respostas, logotipos ou marcas d'água. Prefira composição horizontal simples e organizada, adequada para ocupar aproximadamente metade de uma folha A4 ao lado do texto.`;

  const geography = /geograf|migra|famílias migrantes|campo|cidade|paisagem|território|mapa|trajeto/i.test(`${subject} ${topic} ${context}`)
    ? ' Para Geografia, represente visualmente o tema estudado com elementos simples e didáticos. Se envolver migração, use mapas, malas, caixas, trajetos, chegada, mudança de moradia ou paisagem, mas mantenha exatamente o elenco oficial da referência visual.'
    : '';

  const math = /matem|número|adição|subtração|multiplica|divis|fraç|decimal|milhar|centena|dezena|unidade|geometr/i.test(`${subject} ${topic} ${context}`)
    ? ' Para Matemática, use materiais manipuláveis visuais como blocos de base dez/material dourado, cubos, barras, fichas, cartões e agrupamentos, sem escrever operações ou respostas.'
    : '';

  return `${style}${geography}${math} Disciplina: ${subject}. Tema: ${topic}. Contexto pedagógico: ${context || topic}. PRIORIDADE MÁXIMA: preservar a identidade visual exata dos personagens da imagem de referência acima de qualquer variação artística.`;
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
    const reference = await fetchOfficialCastReference(request);

    const form = new FormData();
    form.append('model', 'gpt-image-1');
    form.append('prompt', prompt);
    form.append('image', new Blob([reference.bytes], { type: reference.contentType }), 'teacheasy-official-cast.jpg');
    form.append('input_fidelity', 'high');
    form.append('size', '1024x1024');
    form.append('quality', 'medium');
    form.append('output_format', 'png');

    const imageResponse = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: form
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

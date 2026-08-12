const MAX_BODY_BYTES = 8_000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 8;
const requestBuckets = new Map();
const OFFICIAL_CAST_PATH = '/illustrations/reference/teacheasy-official-cast.png';
const OFFICIAL_CAST_RAW_URL = 'https://raw.githubusercontent.com/cunhadalbert-cmyk/TeachEasy/main/public/illustrations/reference/teacheasy-official-cast.png';

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

function stylePrompt(subject, topic, context) {
  const officialCast = `A IMAGEM DE ENTRADA é a REFERÊNCIA VISUAL OFICIAL E OBRIGATÓRIA do TeachEasy e define a identidade canônica dos personagens. Preserve com PRIORIDADE MÁXIMA e ALTA FIDELIDADE os mesmos rostos, olhos, sobrancelhas, nariz, sorriso, tom de pele, cabelo, óculos, idade aparente, proporções corporais, roupas-base, calçados e acabamento visual. NÃO reinterprete, NÃO redesenhe e NÃO crie personagens apenas parecidos. Devem ser reconhecivelmente os mesmos personagens da referência oficial.

ELENCO OFICIAL FIXO — exatamente como aparece na referência:

1) Menino moreno:
pele morena escura, cabelo preto muito curto e baixo, levemente cacheado, óculos de grau pretos grandes com armação arredondada, sorriso alegre, jaqueta azul aberta, camiseta branca com desenho de controle de videogame, calça escura e tênis azul.

2) Menina maior:
pele clara a levemente bronzeada, cabelo preto muito longo, volumoso e solto, sem óculos, sorriso alegre, camiseta roxa com margarida branca de miolo amarelo sorridente, calça jeans azul-clara larga e tênis preto.

3) Menina menor:
pele clara, cabelo loiro dourado preso em rabo de cavalo alto, óculos de grau pretos grandes, sorriso aberto, camiseta amarela, jardineira jeans azul e tênis rosa.

4) Menino de verde:
pele clara a levemente bronzeada, cabelo preto curto e cheio, sem óculos, sorriso amplo, camiseta verde com dinossauro divertido, bermuda escura e tênis preto e branco.

5) Cachorro oficial:
cachorro pequeno, simpático, tipo poodle pequeno, pelagem encaracolada cinza mesclada com preto, olhos amigáveis, sem coleira, sem roupa e sem acessórios.

A nova ilustração deve conter EXATAMENTE essas quatro crianças e esse cachorro. Não omita, não acrescente e não substitua personagens. O menino moreno SEMPRE usa óculos. O menino de verde NUNCA usa óculos. A menina menor SEMPRE usa óculos. A menina maior NUNCA usa óculos. O cachorro SEMPRE aparece. NÃO troque roupas entre personagens e NÃO altere as cores-base das roupas.`;

  const preservation = `REGRA DE PRESERVAÇÃO DE IDENTIDADE: cabeça, rosto, cabelo, óculos, roupas-base, cores principais e aparência geral são elementos protegidos da referência. Mude o mínimo possível nesses elementos. Para adaptar cada atividade, prefira alterar somente pose, posição das mãos, expressão corporal, objetos pedagógicos e cenário. Se uma pose nova exigir deformar ou descaracterizar o personagem, mantenha uma pose mais próxima da referência. A fidelidade ao elenco é mais importante do que a variedade de pose.`;

  const style = `Crie UMA NOVA CENA pedagógica infantil para material didático brasileiro, usando a imagem de entrada como referência canônica de identidade e estilo. ${officialCast}

${preservation}

Mantenha o mesmo acabamento visual da referência: ilustração infantil digital de alta qualidade, leve, limpa, suave, colorida, simpática e consistente, com aparência moderna de animação infantil, olhos expressivos, contornos limpos, sombras suaves, cores alegres e agradáveis, sem excesso de textura e sem aparência pesada. A cena deve parecer acolhedora, educativa e própria para atividades escolares.

Adapte somente o necessário ao conteúdo escolar. Não inclua textos, letras, números escritos, respostas, logotipos ou marcas d'água. Use composição HORIZONTAL, com os quatro personagens e o cachorro totalmente visíveis e sem cortes, adequada para ocupar aproximadamente metade de uma folha A4 ao lado do texto.`;

  const geography = /geograf|migra|famílias migrantes|campo|cidade|paisagem|território|mapa|trajeto/i.test(`${subject} ${topic} ${context}`)
    ? ' Para Geografia, acrescente elementos simples, claros e didáticos relacionados ao tema ao redor do elenco. Se envolver migração, use malas, caixas, trajeto, chegada, mudança de moradia, mapa ou mudança de paisagem. Preserve os personagens antes de qualquer detalhe de cenário.'
    : '';

  const math = /matem|número|adição|subtração|multiplica|divis|fraç|decimal|milhar|centena|dezena|unidade|geometr/i.test(`${subject} ${topic} ${context}`)
    ? ' Para Matemática, use materiais manipuláveis visuais como blocos de base dez, material dourado, cubos, barras, fichas, cartões, formas geométricas e agrupamentos, sem escrever operações ou respostas. Preserve integralmente o elenco oficial.'
    : '';

  return `${style}${geography}${math} Disciplina: ${subject}. Tema: ${topic}. Contexto pedagógico: ${context || topic}. ORDEM DE PRIORIDADE: 1) identidade visual exata dos 4 personagens e do cachorro; 2) rosto, cabelo, óculos, roupas-base e cores principais idênticos à referência; 3) ação pedagógica; 4) cenário. Se houver conflito, preserve sempre os itens 1 e 2.`;
}

async function generateWithReference(request, prompt) {
  const reference = await fetchOfficialCastReference(request);
  const form = new FormData();
  form.append('model', 'gpt-image-1');
  form.append('prompt', prompt);
  form.append('image', new Blob([reference.bytes], { type: reference.contentType }), 'teacheasy-official-cast.png');
  form.append('input_fidelity', 'high');
  form.append('size', '1536x1024');
  form.append('quality', 'high');
  form.append('output_format', 'png');

  const imageResponse = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: form
  });
  const imageData = await imageResponse.json();
  if (!imageResponse.ok) throw new Error(imageData.error?.message || 'Falha no modo com referência visual.');
  const imageBase64 = imageData.data?.[0]?.b64_json;
  if (!imageBase64) throw new Error('O modo com referência visual não retornou imagem.');
  return imageBase64;
}

async function generateWithoutReference(prompt) {
  const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      size: '1536x1024',
      quality: 'high',
      output_format: 'png'
    })
  });
  const imageData = await imageResponse.json();
  if (!imageResponse.ok) throw new Error(imageData.error?.message || 'Falha no modo alternativo de geração.');
  const imageBase64 = imageData.data?.[0]?.b64_json;
  if (!imageBase64) throw new Error('O modo alternativo não retornou imagem.');
  return imageBase64;
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

    let imageBase64 = '';
    try {
      imageBase64 = await generateWithReference(request, prompt);
    } catch (referenceError) {
      console.warn('library-illustration-reference-mode-failed', referenceError.message || referenceError);
      imageBase64 = await generateWithoutReference(prompt);
    }

    return json(response, 200, { illustrationDataUrl: `data:image/png;base64,${imageBase64}` });
  } catch (error) {
    console.error('library-illustration-generation-failed', error.message || error);
    return json(response, 502, { error: 'Não foi possível gerar a ilustração pedagógica agora.' });
  }
};

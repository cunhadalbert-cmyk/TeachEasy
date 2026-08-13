const MAX_BODY_BYTES = 8_000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 8;
const requestBuckets = new Map();
const OFFICIAL_CAST_PATH = '/public/illustrations/reference/teacheasy-official-cast.png';
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
      const result = await fetch(url, { headers: { Accept: 'image/png,image/*' }, cache: 'no-store' });
      if (!result.ok) {
        lastError = new Error(`Referência visual retornou HTTP ${result.status}.`);
        continue;
      }
      const contentType = result.headers.get('content-type') || 'image/png';
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

TRAVA VISUAL ABSOLUTA: trate os personagens da imagem de entrada como ELEMENTOS VISUAIS A SEREM PRESERVADOS, e não como inspiração para um novo desenho. NÃO redesenhe do zero cabeça, rosto, cabelo, óculos, tronco, roupas ou calçados. Preserve a geometria facial, formato e distância dos olhos, sobrancelhas, nariz, boca, sorriso, formato da cabeça, linha do maxilar, silhueta do cabelo, volume do cabelo, cor da pele, espessura dos contornos, linguagem de formas, proporções e acabamento da referência. NÃO faça style transfer nos personagens. NÃO mude idade aparente, etnia, peso, altura relativa, formato corporal ou expressão facial característica. Se for necessário adaptar a ação, altere somente braços, mãos, pernas e inclinação do corpo no mínimo necessário, mantendo cabeça, rosto, cabelo e roupas visualmente idênticos à referência. Prefira composição e cenário adaptados ao redor do elenco em vez de redesenhar o elenco.

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

  const preservation = `REGRA DE PRESERVAÇÃO DE IDENTIDADE: cabeça, rosto, cabelo, óculos, roupas-base, cores principais e aparência geral são elementos protegidos da referência e devem permanecer visualmente inalterados. A cena nova deve parecer uma edição da mesma imagem oficial, e não uma nova interpretação dos personagens. Mude o mínimo possível no elenco. Para adaptar cada atividade, prefira alterar cenário, objetos pedagógicos, posição das mãos e pequenos ajustes de pose. Se uma pose nova exigir deformar, redesenhar ou descaracterizar qualquer personagem, NÃO use essa pose: mantenha uma pose mais próxima da referência. A fidelidade ao elenco é mais importante do que a variedade de pose, ação ou cenário.`;

  const style = `Crie UMA NOVA CENA pedagógica infantil para material didático brasileiro, usando a imagem de entrada como referência canônica de identidade e estilo. ${officialCast}

${preservation}

Mantenha o mesmo acabamento visual da referência: renderização digital 3D infantil de alta qualidade, com volume e profundidade reais — pele com leve brilho e sombreamento volumétrico, cabelo com fios individuais visíveis e reflexos de luz, olhos grandes e brilhantes com reflexo de luz (catchlight), roupas e calçados com textura e material visíveis, iluminação com contraste real de luz e sombra. NÃO é uma ilustração plana/vetorial de contornos simples e cores chapadas: é um render com brilho, volume e detalhe, no mesmo padrão de acabamento 3D da referência. O cenário pode ser novo e mais simples que o fundo da referência, mas os personagens NÃO podem ganhar um novo estilo de desenho nem perder o acabamento 3D com brilho e volume. A cena deve parecer acolhedora, educativa e própria para atividades escolares.

Adapte somente o necessário ao conteúdo escolar. Não inclua textos, letras, números escritos, respostas, logotipos ou marcas d'água. Use composição HORIZONTAL, com os quatro personagens e o cachorro totalmente visíveis e sem cortes, adequada para ocupar aproximadamente metade de uma folha A4 ao lado do texto.`;

  const geography = /geograf|migra|famílias migrantes|campo|cidade|paisagem|território|mapa|trajeto/i.test(`${subject} ${topic} ${context}`)
    ? ' Para Geografia, acrescente elementos simples, claros e didáticos relacionados ao tema ao redor do elenco. Se envolver migração, use malas, caixas, trajeto, chegada, mudança de moradia, mapa ou mudança de paisagem. Não altere rostos, cabelos, óculos, roupas ou estilo do elenco para representar o tema. Preserve os personagens antes de qualquer detalhe de cenário.'
    : '';

  const math = /matem|número|adição|subtração|multiplica|divis|fraç|decimal|milhar|centena|dezena|unidade|geometr/i.test(`${subject} ${topic} ${context}`)
    ? ' Para Matemática, use materiais manipuláveis visuais como blocos de base dez, material dourado, cubos, barras, fichas, cartões, formas geométricas e agrupamentos, sem escrever operações ou respostas. Preserve integralmente o elenco oficial e mude somente os objetos pedagógicos ao redor dele.'
    : '';

  return `${style}${geography}${math} Disciplina: ${subject}. Tema: ${topic}. Contexto pedagógico: ${context || topic}. ORDEM DE PRIORIDADE: 1) preservar visualmente os personagens da imagem de entrada sem redesenhá-los; 2) identidade visual exata dos 4 personagens e do cachorro; 3) rosto, cabelo, óculos, roupas-base, proporções, contornos e cores principais idênticos à referência; 4) ação pedagógica; 5) cenário. Se houver conflito, preserve sempre os itens 1, 2 e 3, mesmo que a ação precise ficar mais simples.`;
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
    const imageBase64 = await generateWithReference(request, prompt);

    return json(response, 200, { illustrationDataUrl: `data:image/png;base64,${imageBase64}` });
  } catch (error) {
    console.error('library-illustration-generation-failed', error.message || error);
    return json(response, 502, { error: 'Não foi possível gerar a ilustração com a referência visual oficial. Tente novamente em instantes.' });
  }
};

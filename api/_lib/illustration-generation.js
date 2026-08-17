'use strict';

const OPENAI_IMAGE_ENDPOINT = 'https://api.openai.com/v1/images/edits';

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

Escolha somente os personagens necessários para comunicar a cena com clareza; um ou dois personagens costumam ser suficientes e use mais apenas quando o conteúdo realmente exigir. O cachorro aparece somente quando fizer sentido na cena. Não acrescente personagens fora do elenco oficial. Sempre que um personagem for usado, preserve integralmente sua identidade: o menino moreno SEMPRE usa óculos; o menino de verde NUNCA usa óculos; a menina menor SEMPRE usa óculos; a menina maior NUNCA usa óculos. NÃO troque roupas entre personagens. As roupas podem ter variações coloridas e coerentes, preservando os elementos, cores-base e características que identificam cada personagem.`;

  const preservation = `REGRA DE PRESERVAÇÃO DE IDENTIDADE: cabeça, rosto, cabelo, óculos, roupas-base, cores principais e aparência geral são elementos protegidos da referência e devem permanecer visualmente inalterados. A cena nova deve parecer uma edição da mesma imagem oficial, e não uma nova interpretação dos personagens. Mude o mínimo possível no elenco. Para adaptar cada atividade, prefira alterar cenário, objetos pedagógicos, posição das mãos e pequenos ajustes de pose. Se uma pose nova exigir deformar, redesenhar ou descaracterizar qualquer personagem, NÃO use essa pose: mantenha uma pose mais próxima da referência. A fidelidade ao elenco é mais importante do que a variedade de pose, ação ou cenário.`;

  const participation = `REGRA OFICIAL DE PARTICIPAÇÃO NA CENA: a cena pedagógica descrita pela atividade é SEMPRE o conteúdo principal e deve ser preservada integralmente, com todos os elementos essenciais pedidos no contexto. Os personagens oficiais do TeachEasy devem ser acrescentados como PARTICIPANTES ATIVOS da cena, interagindo naturalmente com o ambiente, com os objetos e com a situação pedagógica representada. NÃO coloque os personagens apenas parados, posando, olhando para a câmera ou visualmente colados sobre o cenário. Cada personagem usado deve realizar uma ação coerente com o conteúdo: manipular, apontar, comparar, investigar, registrar, construir, organizar, ler, escrever, demonstrar, experimentar, conversar ou executar outra ação pedagogicamente adequada. Os personagens TeachEasy NUNCA podem substituir, esconder, apagar, reduzir ou descaracterizar os elementos essenciais da cena solicitada. Primeiro preserve integralmente o conteúdo pedagógico; depois integre o elenco como participante real dessa cena. Em cenas históricas ou culturais, preserve os povos, personagens, objetos e acontecimentos próprios do contexto e NÃO transforme os personagens TeachEasy em integrantes desses povos ou personagens históricos; eles devem participar da representação pedagógica sem falsificar o período, a cultura ou o acontecimento.`;

  const style = `Crie UMA NOVA CENA pedagógica infantil para material didático brasileiro, usando a imagem de entrada como referência canônica de identidade e estilo. ${officialCast}

${preservation}

${participation}

Mantenha o mesmo acabamento visual da referência: renderização digital 3D infantil de alta qualidade, com volume e profundidade reais — pele com leve brilho e sombreamento volumétrico, cabelo com fios individuais visíveis e reflexos de luz, olhos grandes e brilhantes com reflexo de luz (catchlight), roupas e calçados com textura e material visíveis, iluminação com contraste real de luz e sombra. NÃO é uma ilustração plana/vetorial de contornos simples e cores chapadas: é um render com brilho, volume e detalhe, no mesmo padrão de acabamento 3D da referência. O cenário pode ser novo e mais simples que o fundo da referência, mas os personagens NÃO podem ganhar um novo estilo de desenho nem perder o acabamento 3D com brilho e volume. A cena deve parecer acolhedora, educativa e própria para atividades escolares.

Adapte somente o necessário ao conteúdo escolar. Não inclua textos, letras, números escritos, respostas, logotipos ou marcas d'água. Use composição HORIZONTAL, com somente os personagens necessários totalmente visíveis e sem cortes de rostos, cabeças, braços ou pés, adequada para ocupar aproximadamente metade de uma folha A4 ao lado do texto.`;

  const geography = /geograf|migra|famílias migrantes|campo|cidade|paisagem|território|mapa|trajeto/i.test(`${subject} ${topic} ${context}`)
    ? ' Para Geografia, acrescente elementos simples, claros e didáticos relacionados ao tema ao redor do elenco. Se envolver migração, use malas, caixas, trajeto, chegada, mudança de moradia, mapa ou mudança de paisagem. Não altere rostos, cabelos, óculos, roupas ou estilo do elenco para representar o tema. Preserve os personagens antes de qualquer detalhe de cenário.'
    : '';

  const math = /matem|número|adição|subtração|multiplica|divis|fraç|decimal|milhar|centena|dezena|unidade|geometr/i.test(`${subject} ${topic} ${context}`)
    ? ' Para Matemática, use materiais manipuláveis visuais como blocos de base dez, material dourado, cubos, barras, fichas, cartões, formas geométricas e agrupamentos, sem escrever operações ou respostas. Preserve integralmente o elenco oficial e mude somente os objetos pedagógicos ao redor dele.'
    : '';

  return `${style}${geography}${math} Disciplina: ${subject}. Tema: ${topic}. Contexto pedagógico: ${context || topic}. ORDEM DE PRIORIDADE: 1) preservar integralmente a cena pedagógica e seus elementos essenciais; 2) integrar os personagens TeachEasy como participantes ativos e naturais da cena; 3) preservar visualmente os personagens da imagem de entrada sem redesenhá-los; 4) identidade visual exata dos personagens selecionados; 5) rosto, cabelo, óculos, roupas-base, proporções, contornos e cores principais idênticos à referência; 6) ação pedagógica; 7) cenário complementar. Se houver conflito, nunca elimine conteúdo essencial da cena e nunca descaracterize o elenco oficial; simplifique apenas elementos secundários.`;
}

function apiError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function generateIllustrationBuffer({
  subject,
  topic,
  context,
  referenceBuffer,
  referenceType = 'image/png',
  apiKey = process.env.OPENAI_API_KEY,
  fetchImpl = globalThis.fetch,
  signal
}) {
  if (!apiKey) throw apiError('A geração de ilustração não está configurada.', 503);
  if (!Buffer.isBuffer(referenceBuffer) || referenceBuffer.length < 10_000) throw new Error('A referência visual oficial está ausente ou inválida.');
  if (typeof fetchImpl !== 'function') throw new Error('Cliente HTTP indisponível para gerar a ilustração.');

  const form = new FormData();
  form.append('model', 'gpt-image-1');
  form.append('prompt', stylePrompt(subject, topic, context));
  form.append('image', new Blob([referenceBuffer], { type: referenceType }), 'teacheasy-official-cast.png');
  form.append('input_fidelity', 'high');
  form.append('size', '1536x1024');
  form.append('quality', 'high');
  form.append('output_format', 'png');

  const imageResponse = await fetchImpl(OPENAI_IMAGE_ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
    signal
  });
  let imageData = {};
  try {
    imageData = await imageResponse.json();
  } catch {
    if (!imageResponse.ok) throw apiError(`A API de imagens respondeu com HTTP ${imageResponse.status}.`, imageResponse.status);
    throw new Error('A API de imagens retornou uma resposta inválida.');
  }
  if (!imageResponse.ok) throw apiError(imageData.error?.message || `Não foi possível gerar a ilustração (HTTP ${imageResponse.status}).`, imageResponse.status);
  const imageBase64 = imageData.data?.[0]?.b64_json;
  if (!imageBase64) throw new Error('A IA não retornou a ilustração.');
  const imageBuffer = Buffer.from(imageBase64, 'base64');
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (imageBuffer.length < signature.length || !imageBuffer.subarray(0, signature.length).equals(signature)) throw new Error('A IA retornou uma imagem inválida.');
  return imageBuffer;
}

module.exports = { generateIllustrationBuffer, stylePrompt };

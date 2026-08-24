'use strict';

const OPENAI_IMAGE_ENDPOINT = 'https://api.openai.com/v1/images/generations';

function stylePrompt(subject, topic, context) {
  const source = `${subject || ''} ${topic || ''} ${context || ''}`.trim();

  const subjectGuidance = /matem|número|adição|subtração|multiplica|divis|fraç|decimal|geometr|medida/i.test(source)
    ? 'Em Matemática, represente visualmente os objetos, quantidades, formas, medidas ou materiais manipuláveis necessários para compreender a situação, sem escrever operações, números-resposta ou fórmulas na imagem.'
    : /geograf|paisagem|território|campo|cidade|mapa|trajeto|migra/i.test(source)
      ? 'Em Geografia, represente com clareza a paisagem, o espaço, o trajeto, o território ou os elementos naturais e humanos citados na atividade.'
      : /histór|patrimônio|cultura|passado|povo|comunidade/i.test(source)
        ? 'Em História, preserve corretamente o contexto cultural, social ou histórico descrito. Não modernize nem invente elementos que contradigam o período ou a situação.'
        : /ciênc|experimento|energia|água|planta|animal|corpo|ambiente/i.test(source)
          ? 'Em Ciências, mostre corretamente o fenômeno, experimento, objeto ou ambiente citado, com relações físicas plausíveis e visualmente fáceis de compreender.'
          : /portugu|notícia|leitura|texto|gênero|opinião|informação|poema|conto|bilhete|cartaz|receita/i.test(source)
            ? 'Em Língua Portuguesa, represente a situação comunicativa e a ação de leitura, produção, comparação ou interpretação pedida pela atividade. Evite qualquer texto legível dentro da imagem.'
            : 'Represente fielmente a situação principal descrita na atividade.';

  return `Crie UMA ÚNICA ILUSTRAÇÃO PEDAGÓGICA para uma atividade escolar brasileira.

FONTE OBRIGATÓRIA DA CENA:
- Disciplina: ${subject || 'Atividade Escolar'}
- Título/tema: ${topic || 'conteúdo escolar'}
- Contexto da atividade: ${context || topic || 'conteúdo escolar'}

A ilustração deve seguir fielmente o conteúdo acima. Identifique a situação central, os objetos, o ambiente e a ação principal descritos e represente esses elementos de modo coerente. Elementos específicos citados no contexto são obrigatórios quando forem necessários para compreender a atividade. Não invente acontecimentos, personagens, objetos ou cenários que contradigam o texto.

${subjectGuidance}

REGRAS VISUAIS FIXAS:
1. Uma única cena, sem colagem, grade, infográfico, quadrinhos ou múltiplos painéis.
2. Formato QUADRADO 1:1, pensado para preencher um quadro de aproximadamente 9,7 cm x 9,7 cm em Word/PDF.
3. Composição simples, limpa, colorida, acolhedora e adequada à faixa escolar.
4. Use pessoas somente quando a situação realmente pedir; não existe obrigação de usar personagens fixos do TeachEasy.
5. Quando houver pessoas, elas devem estar realizando a ação da atividade de forma natural, não apenas posando.
6. NÃO inserir título, legenda, letras, palavras, frases, números, logotipos, marcas d'água, placas legíveis, jornal com texto legível ou qualquer conteúdo escrito desnecessário.
7. NÃO mostrar respostas das questões.
8. Priorize clareza pedagógica: o aluno deve reconhecer visualmente a situação da atividade ao olhar a imagem.
9. Evite excesso de objetos decorativos e qualquer elemento que distraia do conteúdo principal.
10. A imagem deve funcionar sozinha como apoio visual, sem depender de texto dentro dela.`;
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
  apiKey = process.env.OPENAI_API_KEY,
  fetchImpl = globalThis.fetch,
  signal
}) {
  if (!apiKey) throw apiError('A geração de ilustração não está configurada.', 503);
  if (typeof fetchImpl !== 'function') throw new Error('Cliente HTTP indisponível para gerar a ilustração.');

  const imageResponse = await fetchImpl(OPENAI_IMAGE_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt: stylePrompt(subject, topic, context),
      size: '1024x1024',
      quality: 'high',
      output_format: 'png'
    }),
    signal
  });

  let imageData = {};
  try {
    imageData = await imageResponse.json();
  } catch {
    if (!imageResponse.ok) throw apiError(`A API de imagens respondeu com HTTP ${imageResponse.status}.`, imageResponse.status);
    throw new Error('A API de imagens retornou uma resposta inválida.');
  }

  if (!imageResponse.ok) {
    throw apiError(imageData.error?.message || `Não foi possível gerar a ilustração (HTTP ${imageResponse.status}).`, imageResponse.status);
  }

  const imageBase64 = imageData.data?.[0]?.b64_json;
  if (!imageBase64) throw new Error('A IA não retornou a ilustração.');

  const imageBuffer = Buffer.from(imageBase64, 'base64');
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (imageBuffer.length < signature.length || !imageBuffer.subarray(0, signature.length).equals(signature)) {
    throw new Error('A IA retornou uma imagem inválida.');
  }
  return imageBuffer;
}

module.exports = { generateIllustrationBuffer, stylePrompt };

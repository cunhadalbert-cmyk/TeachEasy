const MAX_BODY_BYTES = 6_600_000;
const { consumeAiGeneration, getAuthenticatedUser, refundAiGeneration } = require('./_lib/firebase');
const { TEACHEASY_ACTIVITY_STANDARD } = require('./_lib/activity-standard');

function json(response, status, payload) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').end(JSON.stringify(payload));
}

function safeText(value, max = 500) {
  return String(value || '').trim().slice(0, max);
}

function responseText(data) {
  if (data.output_text) return data.output_text;
  return (data.output || [])
    .flatMap(item => item.content || [])
    .filter(item => item.type === 'output_text')
    .map(item => item.text || '')
    .join('\n');
}

function pedagogicalContext(input, isPhoto) {
  if (isPhoto) return Boolean(safeText(input.grade, 80));
  const text = [input.request,input.materialType,input.stage,input.grade,input.subject,input.topic,input.objective]
    .map(value => safeText(value, 1200)).join(' ').toLowerCase();
  const educationalTerms = [
    'atividade','avaliação','avaliacao','prova','exercício','exercicio','aula','escolar','escola',
    'professor','aluno','turma','educação','educacao','infantil','fundamental','ensino médio','ensino medio',
    'bncc','português','portugues','matemática','matematica','ciências','ciencias','história','historia',
    'geografia','inglês','ingles','alfabetização','alfabetizacao','autismo','inclusão','inclusao','pedagógico','pedagogico'
  ];
  return educationalTerms.some(term => text.includes(term));
}

function quotaError(error) {
  const message = String(error?.message || '').toUpperCase();
  if (message.includes('SUBSCRIPTION_INACTIVE')) return { status: 402, message: 'Sua assinatura ainda não está ativa. Conclua o pagamento para usar a criação com IA.' };
  if (message.includes('AI_QUOTA_EXCEEDED')) return { status: 429, message: 'Você usou as 60 gerações deste período. A franquia será renovada automaticamente no próximo ciclo.' };
  if (message.includes('PROFILE_NOT_FOUND')) return { status: 403, message: 'Sua conta ainda não possui um perfil de assinatura válido.' };
  return null;
}

async function generateIllustration(activity, input) {
  const firstQuestion = safeText(activity.questions?.[0]?.prompt || activity.illustration || input.topic || input.request, 650);
  const blackAndWhite = input.illustrationStyle === 'bw';
  const visualStyle = blackAndWhite
    ? 'preto e branco, traço limpo, forte e pedagógico, pronto para impressão e colorir'
    : 'colorida, com acabamento de ilustração editorial infantil de alta qualidade, personagens simpáticos e expressivos, cenário escolar ou cotidiano coerente, cores vivas porém equilibradas, luz suave, formas bem definidas e fundo claro';
  const prompt = `Crie UMA ilustração exclusivamente pedagógica ${visualStyle} para uma atividade escolar brasileira no padrão visual TeachEasy. A imagem deve parecer parte de uma folha profissional de atividade escolar, seguindo a referência visual aprovada: composição horizontal equilibrada para ocupar aproximadamente metade de um bloco A4 ao lado do texto, cena completa e contextualizada, não um ícone, símbolo, pictograma, clip-art simples ou objeto isolado. Quando adequado, mostre crianças em contexto de aprendizagem, escola, sala de aula, pátio ou situação cotidiana relacionada ao conteúdo. Represente diretamente o tema ou o que for necessário para compreender ou resolver este enunciado: "${firstQuestion}". Se houver quantidade, grupos, números, formas ou objetos relevantes, represente-os corretamente e de modo visualmente claro. Preserve anatomia natural, mãos e rostos corretos, objetos completos, boa proporção, perspectiva simples e margens adequadas para diagramação A4 ao lado do texto. Não crie retrato, publicidade, logotipo, meme, arte promocional ou imagem sem finalidade didática. Não crie marca d'água nem imagem decorativa sem finalidade didática. Não coloque letras, palavras, números, respostas ou textos dentro da imagem, salvo quando um número fizer parte indispensável do conceito matemático e puder ser representado sem entregar a resposta.`;
  const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-image-2', prompt, size: '1024x1024', quality: 'low', output_format: 'png' })
  });
  const imageData = await imageResponse.json();
  if (!imageResponse.ok) throw new Error(imageData.error?.message || 'Não foi possível criar a figura.');
  const imageBase64 = imageData.data?.[0]?.b64_json;
  if (!imageBase64) throw new Error('A IA não retornou a figura.');
  return `data:image/png;base64,${imageBase64}`;
}

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') return json(response, 405, { error: 'Método não permitido.' });
  if (!process.env.OPENAI_API_KEY) return json(response, 503, { error: 'A criação com IA ainda não foi configurada.' });
  const rawBody = typeof request.body === 'string' ? request.body : JSON.stringify(request.body || {});
  if (Buffer.byteLength(rawBody) > MAX_BODY_BYTES) return json(response, 413, { error: 'A imagem enviada é grande demais.' });

  let quotaReserved = false;
  let authenticatedUserId = null;
  try {
    const session = await getAuthenticatedUser(request, response);
    if (!session?.user?.id) return json(response, 401, { error: 'Entre na sua conta TeachEasy para criar atividades com IA.' });
    authenticatedUserId = session.user.id;

    const input = typeof request.body === 'object' ? request.body : JSON.parse(rawBody);
    const isPhoto = input.mode === 'photo';
    if (!isPhoto && input.mode !== 'text') return json(response, 400, { error: 'Tipo de criação inválido.' });
    if (isPhoto && !/^data:image\/(jpeg|png);base64,/i.test(input.imageDataUrl || '')) return json(response, 400, { error: 'Envie uma foto JPG ou PNG válida.' });
    if (!pedagogicalContext(input, isPhoto)) return json(response, 400, { error: 'A IA do TeachEasy é exclusiva para atividades e conteúdos escolares. Informe uma turma, disciplina, tema ou objetivo pedagógico.' });

    let quota;
    try {
      quota = await consumeAiGeneration(authenticatedUserId);
      quotaReserved = true;
    } catch (error) {
      const mapped = quotaError(error);
      if (mapped) return json(response, mapped.status, { error: mapped.message });
      throw error;
    }

    const questions = Math.min(20, Math.max(1, Number(input.questionCount) || 5));
    const bnccInstruction = input.bncc
      ? `Alinhe o material à BNCC. ${input.bnccMode === 'skill' ? 'Informe no campo bncc uma habilidade/código apenas quando houver segurança de correspondência; nunca invente código.' : 'Use a BNCC como referência pedagógica e descreva no campo bncc o alinhamento de forma clara, sem inventar códigos.'} A BNCC não deve ser incorporada ao texto nem aos enunciados da atividade do aluno; ela será tratada separadamente no gabarito.`
      : 'Considere o alinhamento pedagógico adequado, mas não exiba referência BNCC no material do aluno.';
    const context = isPhoto
      ? `Analise a imagem enviada somente como referência pedagógica e crie uma atividade escolar ORIGINAL para ${safeText(input.grade, 80)} com exatamente ${questions} questões. Não copie simplesmente a fotografia. Recrie o conteúdo com organização profissional no padrão TeachEasy. ${input.adapted ? 'Faça comandos curtos e uma versão acessível para inclusão.' : ''}`
      : `Crie exclusivamente um material escolar original. Pedido livre: ${safeText(input.request, 1200) || 'Crie uma atividade escolar adequada para uma turma de ensino básico.'}. Tipo: ${safeText(input.materialType, 80) || 'Atividade'}. Etapa: ${safeText(input.stage, 100) || 'não informada'}. Ano: ${safeText(input.grade, 80) || 'não informado'}. Disciplina: ${safeText(input.subject, 80) || 'não informada'}. Tema: ${safeText(input.topic, 180) || 'livre'}. Objetivo: ${safeText(input.objective, 240) || 'promover aprendizagem ativa'}. Dificuldade: ${safeText(input.difficulty, 50) || 'Intermediário'}. Tipo de questões: ${safeText(input.questionType, 50) || 'Mistas'}. Faça exatamente ${questions} questões. ${input.adapted ? 'Inclua linguagem acessível.' : ''}`;
    const content = [{ type: 'input_text', text: `Você é um especialista em educação brasileira e trabalha somente com conteúdo escolar. Não atenda pedidos de conversa geral, publicidade, programação, entretenimento ou geração de imagens avulsas.\n\n${TEACHEASY_ACTIVITY_STANDARD}\n\nSOLICITAÇÃO ATUAL:\n${context}\n${bnccInstruction}\n\nRetorne apenas JSON com title, summary, illustration (descrição curta da ilustração pedagógica somente se útil), bncc (texto curto ou string vazia), questions (lista de objetos com prompt) e answerKey. O conteúdo deve ser apropriado, didático, conciso para diagramação A4 e revisável pelo professor.` }];
    if (isPhoto) content.push({ type: 'input_image', image_url: input.imageDataUrl, detail: 'low' });

    const openAiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4.1-mini', input: [{ role: 'user', content }], text: { format: { type: 'json_object' } }, max_output_tokens: 2200 })
    });
    const openAiData = await openAiResponse.json();
    if (!openAiResponse.ok) throw new Error(openAiData.error?.message || 'A IA não respondeu.');
    const activity = JSON.parse(responseText(openAiData) || '{}');
    if (!activity.title || !Array.isArray(activity.questions)) throw new Error('A IA retornou uma resposta incompleta.');

    const normalizedActivity = {
      title: safeText(activity.title, 180),
      summary: safeText(activity.summary, 900),
      illustration: safeText(activity.illustration, 220),
      bncc: input.bncc ? safeText(activity.bncc, 700) : '',
      questions: activity.questions.slice(0, questions).map(question => ({ prompt: safeText(question.prompt || question, 700) })),
      answerKey: safeText(activity.answerKey, 2200)
    };

    const shouldGenerateIllustration = isPhoto || Boolean(input.figures);
    if (shouldGenerateIllustration) {
      try { normalizedActivity.illustrationDataUrl = await generateIllustration(normalizedActivity, input); }
      catch (imageError) {
        console.warn('activity-illustration-failed', imageError.message || imageError);
        normalizedActivity.illustrationError = 'A atividade foi criada, mas a figura não pôde ser gerada agora. Tente gerar novamente.';
      }
    }

    quotaReserved = false;
    return json(response, 200, {
      activity: normalizedActivity,
      usage: {
        limit: Number(quota?.ai_limit) || 60,
        used: Number(quota?.ai_used) || 0,
        remaining: Number(quota?.remaining) || 0,
        periodStart: quota?.period_start || null,
        periodEnd: quota?.period_end || null
      }
    });
  } catch (error) {
    if (quotaReserved && authenticatedUserId) {
      try { await refundAiGeneration(authenticatedUserId); }
      catch (refundError) { console.error('ai-quota-refund-failed', refundError.message || refundError); }
    }
    if (/FIREBASE_.*NOT_CONFIGURED/.test(error.message || '')) return json(response, 503, { error: 'O cadastro do TeachEasy ainda não foi conectado ao Firebase.' });
    console.error('activity-generation-failed', error.message || error);
    return json(response, 502, { error: error.message || 'Erro ao gerar atividade.' });
  }
};

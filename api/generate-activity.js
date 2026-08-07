const MAX_BODY_BYTES = 6_600_000;

function json(response, status, payload) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').end(JSON.stringify(payload));
}

function safeText(value, max = 500) {
  return String(value || '').trim().slice(0, max);
}

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') return json(response, 405, { error: 'Método não permitido.' });
  if (!process.env.OPENAI_API_KEY) return json(response, 503, { error: 'A criação com IA ainda não foi configurada.' });
  const rawBody = typeof request.body === 'string' ? request.body : JSON.stringify(request.body || {});
  if (Buffer.byteLength(rawBody) > MAX_BODY_BYTES) return json(response, 413, { error: 'A imagem enviada é grande demais.' });
  try {
    const input = typeof request.body === 'object' ? request.body : JSON.parse(rawBody);
    const isPhoto = input.mode === 'photo';
    if (!isPhoto && input.mode !== 'text') return json(response, 400, { error: 'Tipo de criação inválido.' });
    if (isPhoto && !/^data:image\/(jpeg|png);base64,/i.test(input.imageDataUrl || '')) return json(response, 400, { error: 'Envie uma foto JPG ou PNG válida.' });
    const questions = Math.min(20, Math.max(1, Number(input.questionCount) || 5));
    const context = isPhoto
      ? `Analise a imagem enviada e crie uma atividade original para ${safeText(input.grade, 80)} com ${questions} questões. ${input.adapted ? 'Faça comandos curtos e uma versão acessível para inclusão.' : ''}`
      : `Crie um material escolar original. Pedido livre: ${safeText(input.request, 1200)}. Tipo: ${safeText(input.materialType, 80)}. Etapa: ${safeText(input.stage, 100)}. Ano: ${safeText(input.grade, 80)}. Disciplina: ${safeText(input.subject, 80)}. Tema: ${safeText(input.topic, 180)}. Objetivo: ${safeText(input.objective, 240)}. Dificuldade: ${safeText(input.difficulty, 50)}. Tipo de questões: ${safeText(input.questionType, 50)}. Faça ${questions} questões. ${input.adapted ? 'Inclua linguagem acessível.' : ''}`;
    const content = [{ type: 'input_text', text: `Você é um especialista em educação brasileira. ${context} Não invente códigos BNCC. Retorne apenas JSON com title, summary, questions (lista de objetos com prompt) e answerKey. O conteúdo deve ser apropriado e revisável por professor.` }];
    if (isPhoto) content.push({ type: 'input_image', image_url: input.imageDataUrl, detail: 'low' });
    const openAiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4.1-mini', input: [{ role: 'user', content }], text: { format: { type: 'json_object' } }, max_output_tokens: 1800 })
    });
    const openAiData = await openAiResponse.json();
    if (!openAiResponse.ok) throw new Error(openAiData.error?.message || 'A IA não respondeu.');
    const activity = JSON.parse(openAiData.output_text || '{}');
    if (!activity.title || !Array.isArray(activity.questions)) throw new Error('A IA retornou uma resposta incompleta.');
    return json(response, 200, { activity: { title: safeText(activity.title, 180), summary: safeText(activity.summary, 600), questions: activity.questions.slice(0, questions).map(question => ({ prompt: safeText(question.prompt || question, 700) })), answerKey: safeText(activity.answerKey, 1400) } });
  } catch (error) {
    return json(response, 500, { error: error.message || 'Erro ao gerar atividade.' });
  }
}

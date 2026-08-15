export const PEDAGOGICAL_STANDARD = 'teacheasy-v2';

const genericPatterns = [
  /\bA atividade aborda\b/i,
  /\bcom conceitos, exemplos e procedimentos adequados\b/i,
  /\bAnalise informações, organize estratégias\b/i,
  /\bdesenvolver aprendizagens de .+ relacionadas a\b/i,
  /\bAplique (?:EI|EF|EM)[A-Z0-9]+\b/i,
  /\bProduza síntese argumentativa\b/i,
  /\bResposta construída conforme\b/i,
  /\bResposta esperada coerente\b/i,
  /\bconsiderando o comando da questão\b/i,
  /\bMobilizar (?:EI|EF|EM)[A-Z0-9]+\b/i,
  /\bApresentar conclusão coerente e revisão ou proposta viável\b/i
];

const validBnccCode = /^(?:EI0[123][A-Z]{2}\d{2}|EF(?:0[1-9]|15|35)[A-Z]{2}\d{2}|EM13[A-Z]{2,3}\d{2,3}|EM13LP\d{2})$/;

function clean(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function assert(condition, message, errors) {
  if (!condition) errors.push(message);
}

function containsGenericTemplate(value) {
  const text = clean(value);
  return genericPatterns.some(pattern => pattern.test(text));
}

export function validatePedagogicalActivityV2(activity, collection = {}) {
  const errors = [];
  const id = clean(activity?.id) || '(sem id)';

  assert(activity?.padraoPedagogico === PEDAGOGICAL_STANDARD,
    `${id}: padraoPedagogico deve ser ${PEDAGOGICAL_STANDARD}`, errors);
  assert(clean(activity?.titulo).length >= 5, `${id}: título ausente ou curto`, errors);
  assert(clean(activity?.tema).length >= 5, `${id}: tema ausente ou curto`, errors);
  assert(clean(activity?.objetivo).length >= 30, `${id}: objetivo pedagógico insuficiente`, errors);

  const supportTitle = clean(activity?.textoApoio?.titulo);
  const supportText = clean(activity?.textoApoio?.conteudo);
  assert(supportTitle.length >= 5, `${id}: título do texto de apoio ausente`, errors);
  assert(supportText.length >= 120, `${id}: texto de apoio deve ser um texto pedagógico real`, errors);
  assert(!containsGenericTemplate(supportText), `${id}: texto de apoio contém template genérico`, errors);
  assert(supportTitle.toLocaleLowerCase('pt-BR') !== clean(activity?.titulo).toLocaleLowerCase('pt-BR'),
    `${id}: título do texto de apoio não pode simplesmente duplicar o título da atividade`, errors);

  assert(Array.isArray(activity?.bncc) && activity.bncc.length > 0, `${id}: BNCC ausente`, errors);
  for (const [index, skill] of (activity?.bncc || []).entries()) {
    const prefix = `${id}: BNCC ${index + 1}`;
    assert(validBnccCode.test(clean(skill?.codigo)), `${prefix} com código inválido`, errors);
    assert(clean(skill?.habilidadeOficial).length >= 40, `${prefix} sem habilidade oficial completa`, errors);
    assert(clean(skill?.verbo).length >= 3, `${prefix} sem verbo central`, errors);
    assert(!containsGenericTemplate(skill?.habilidadeOficial), `${prefix} contém descrição genérica`, errors);
  }

  assert(Array.isArray(activity?.questoes) && activity.questoes.length === 6,
    `${id}: deve possuir exatamente 6 questões`, errors);
  for (const [index, question] of (activity?.questoes || []).entries()) {
    const prompt = clean(question?.enunciado);
    assert(prompt.length >= 15, `${id}: questão ${index + 1} insuficiente`, errors);
    assert(!containsGenericTemplate(prompt), `${id}: questão ${index + 1} contém template genérico`, errors);
  }

  assert(Array.isArray(activity?.gabarito) && activity.gabarito.length === 6,
    `${id}: deve possuir exatamente 6 respostas no gabarito`, errors);
  for (const [index, answer] of (activity?.gabarito || []).entries()) {
    const text = clean(answer?.resposta);
    assert(text.length >= 3, `${id}: gabarito ${index + 1} vazio`, errors);
    assert(!containsGenericTemplate(text), `${id}: gabarito ${index + 1} contém template genérico`, errors);
  }

  const illustration = activity?.ilustracao || {};
  assert(clean(illustration?.objetivoPedagogico).length >= 20,
    `${id}: ilustração deve declarar objetivo pedagógico`, errors);
  assert(clean(illustration?.descricao).length >= 20,
    `${id}: ilustração deve ter descrição coerente com a atividade`, errors);

  if (activity?.revisao?.status === 'revisada') {
    assert(activity.revisao.bnccConferida === true, `${id}: revisão sem BNCC conferida`, errors);
    assert(activity.revisao.conteudoConferido === true, `${id}: revisão sem conteúdo conferido`, errors);
    assert(activity.revisao.questoesConferidas === true, `${id}: revisão sem questões conferidas`, errors);
    assert(activity.revisao.gabaritoConferido === true, `${id}: revisão sem gabarito conferido`, errors);
    assert(activity.revisao.ilustracaoConferida === true, `${id}: revisão sem ilustração conferida`, errors);
    assert(activity.revisao.validacaoAutomatica === true, `${id}: revisão sem validação automática`, errors);
  }

  if (collection?.disciplina) {
    assert(clean(collection.disciplina) !== 'Atividade Escolar', `${id}: disciplina genérica não é permitida`, errors);
  }

  return { valid: errors.length === 0, errors };
}

export function assertPedagogicalActivityV2(activity, collection = {}) {
  const result = validatePedagogicalActivityV2(activity, collection);
  if (!result.valid) throw new Error(result.errors.join('\n'));
  return true;
}

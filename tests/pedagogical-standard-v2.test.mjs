import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePedagogicalActivityV2 } from '../scripts/pedagogical-standard-v2.mjs';

const base = {
  id: 'efi-4ano-b3-his-v2-01',
  padraoPedagogico: 'teacheasy-v2',
  titulo: 'Mudanças na vida das pessoas',
  tema: 'Transformações e permanências ao longo do tempo',
  objetivo: 'Identificar mudanças e permanências na vida das pessoas a partir de situações históricas próximas do cotidiano.',
  textoApoio: {
    titulo: 'O bairro de ontem e de hoje',
    conteudo: 'Há muitos anos, várias ruas do bairro eram de terra, havia menos casas e poucas lojas. Com o passar do tempo, novas moradias foram construídas, o comércio cresceu e chegaram serviços como transporte coletivo e iluminação pública. Algumas construções antigas permaneceram e continuam sendo pontos de referência para os moradores. Comparar fotografias, relatos e objetos de épocas diferentes ajuda a perceber o que mudou e o que permaneceu na vida da comunidade.'
  },
  bncc: [{
    codigo: 'EF04HI01',
    habilidadeOficial: 'Reconhecer a história como resultado da ação do ser humano no tempo e no espaço, com base na identificação de mudanças e permanências ao longo do tempo.',
    verbo: 'Reconhecer'
  }],
  questoes: [
    { numero: 1, enunciado: 'Cite duas mudanças ocorridas no bairro ao longo do tempo.' },
    { numero: 2, enunciado: 'Qual elemento antigo permaneceu como referência para os moradores?' },
    { numero: 3, enunciado: 'Explique por que fotografias antigas ajudam a estudar a história do bairro.' },
    { numero: 4, enunciado: 'Compare uma característica do bairro de antes com uma característica atual.' },
    { numero: 5, enunciado: 'Identifique no texto uma mudança causada pela ação das pessoas.' },
    { numero: 6, enunciado: 'Escreva uma mudança e uma permanência que você observa no lugar onde vive.' }
  ],
  gabarito: [
    { numero: 1, resposta: 'Exemplos: ruas pavimentadas, mais casas, crescimento do comércio, transporte e iluminação.' },
    { numero: 2, resposta: 'Algumas construções antigas continuaram como pontos de referência.' },
    { numero: 3, resposta: 'Porque permitem comparar épocas e observar mudanças e permanências.' },
    { numero: 4, resposta: 'Resposta possível: antes havia ruas de terra; hoje há ruas pavimentadas e mais serviços.' },
    { numero: 5, resposta: 'Exemplo: construção de novas moradias ou ampliação do comércio.' },
    { numero: 6, resposta: 'Resposta pessoal, desde que apresente uma mudança e uma permanência coerentes.' }
  ],
  ilustracao: {
    objetivoPedagogico: 'Apoiar a comparação entre mudanças e permanências observáveis no mesmo lugar em épocas diferentes.',
    descricao: 'Duas cenas do mesmo bairro, uma antiga e outra atual, mostrando elementos que mudaram e elementos que permaneceram.'
  },
  revisao: {
    status: 'revisada',
    bnccConferida: true,
    conteudoConferido: true,
    questoesConferidas: true,
    gabaritoConferido: true,
    ilustracaoConferida: true,
    validacaoAutomatica: true
  }
};

test('padrão V2 aceita atividade pedagógica completa', () => {
  const result = validatePedagogicalActivityV2(base, { disciplina: 'História' });
  assert.equal(result.valid, true, result.errors.join('\n'));
});

test('padrão V2 rejeita texto genérico antigo', () => {
  const activity = structuredClone(base);
  activity.textoApoio.conteudo = 'A atividade aborda A história é feita por pessoas com conceitos, exemplos e procedimentos adequados ao 4º ano. Analise informações, organize estratégias, use evidências e justifique a conclusão.';
  const result = validatePedagogicalActivityV2(activity, { disciplina: 'História' });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(error => error.includes('template genérico')));
});

test('padrão V2 rejeita pergunta baseada em código BNCC', () => {
  const activity = structuredClone(base);
  activity.questoes[4].enunciado = 'Aplique EF04HI01 para considerar diferentes grupos, memórias e formas de participação.';
  const result = validatePedagogicalActivityV2(activity, { disciplina: 'História' });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(error => error.includes('questão 5')));
});

test('padrão V2 não permite marcar revisada sem todas as conferências', () => {
  const activity = structuredClone(base);
  activity.revisao.gabaritoConferido = false;
  const result = validatePedagogicalActivityV2(activity, { disciplina: 'História' });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(error => error.includes('gabarito conferido')));
});

test('padrão V2 rejeita disciplina genérica', () => {
  const result = validatePedagogicalActivityV2(base, { disciplina: 'Atividade Escolar' });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(error => error.includes('disciplina genérica')));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { buildIllustrationPrompt, classifyIllustration } from '../scripts/illustration-prompt-policy.mjs';

const collection = {
  etapa: 'Ensino Fundamental I',
  ano: '4º ano',
  bimestre: 3,
  disciplina: 'Geografia'
};

test('não força personagens em representação pedagógica', () => {
  const activity = {
    id: 'geo-mapa-01',
    titulo: 'Mapa do Brasil: regiões',
    tema: 'Regiões brasileiras',
    objetivo: 'Identificar as regiões brasileiras.',
    questoes: []
  };
  const profile = classifyIllustration(activity, collection);
  assert.equal(profile.kind, 'representacao-pedagogica');
  assert.equal(profile.characterCount, 0);
  assert.deepEqual(profile.characters, []);
  assert.equal(profile.needsOfficialCastReference, false);
});

test('usa somente a quantidade de personagens necessária', () => {
  const activity = {
    id: 'geo-sombra-01',
    titulo: 'Orientação pelo Sol',
    tema: 'Pontos cardeais',
    objetivo: 'Investigar orientação espacial.',
    textoApoio: { conteudo: 'Duas crianças observam a sombra de uma vara no pátio da escola e registram as mudanças.' },
    questoes: []
  };
  const profile = classifyIllustration(activity, collection);
  assert.equal(profile.characterCount, 2);
  assert.equal(profile.characters.length, 2);
  assert.equal(profile.needsOfficialCastReference, true);
});

test('plural sem quantidade explícita usa dois personagens', () => {
  const activity = {
    id: 'geo-feira-02',
    titulo: 'Leitura do território',
    tema: 'Fluxos e circulação',
    objetivo: 'Interpretar representações espaciais.',
    textoApoio: { conteudo: 'Estudantes analisam um mapa, comparam rotas e registram observações sobre fluxos no território.' },
    questoes: []
  };
  const profile = classifyIllustration(activity, collection);
  assert.equal(profile.characterCount, 2);
  assert.equal(profile.characters.length, 2);
});

test('Nino só entra quando o conteúdo pede cachorro ou pet', () => {
  const withoutDog = classifyIllustration({ id: 'a', titulo: 'Paisagem urbana', questoes: [] }, collection);
  const withDog = classifyIllustration({ id: 'b', titulo: 'Cuidados com o cachorro de estimação', questoes: [] }, collection);
  assert.equal(withoutDog.useNino, false);
  assert.equal(withDog.useNino, true);
});

test('prompt fixa interação, identidade e restrições pedagógicas', () => {
  const activity = {
    id: 'geo-feira-01',
    titulo: 'Culturas que formam nossa comunidade',
    tema: 'Diversidade cultural',
    objetivo: 'Reconhecer manifestações culturais da comunidade.',
    textoApoio: { conteudo: 'Estudantes visitam uma feira cultural com artesanato, alimentos e música.' },
    bncc: [{ codigo: 'EF04GE01' }],
    questoes: []
  };
  const profile = classifyIllustration(activity, collection);
  const prompt = buildIllustrationPrompt(activity, collection, profile);
  assert.match(prompt, /participar|integrados|ação/i);
  assert.match(prompt, /não duplicar personagens/i);
  assert.match(prompt, /não revelar respostas/i);
  assert.match(prompt, /contexto histórico ou cultural/i);
  assert.match(prompt, /1536x1024/i);
});

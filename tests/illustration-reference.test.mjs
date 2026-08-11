import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../biblioteca.html', import.meta.url), 'utf8');
const libraryIllustration = await readFile(new URL('../library-ai-illustration.js', import.meta.url), 'utf8');
const illustrationGuard = await readFile(new URL('../illustration-reference-standard.js', import.meta.url), 'utf8');
const api = await readFile(new URL('../api/generate-library-illustration.js', import.meta.url), 'utf8');
const jogos = await readFile(new URL('../jogos-inline.js', import.meta.url), 'utf8');

test('Biblioteca utiliza PNGs salvos e não carrega gerador dinâmico de IA no navegador', () => {
  assert.doesNotMatch(html, /library-ai-illustration\.js/);
  assert.doesNotMatch(html, /illustration-reference-standard\.js/);
  assert.doesNotMatch(html, /library-export-image-sync\.js/);
});

test('PNG estática aprovada é carregada depois do renderizador final', () => {
  assert.match(html, /library-portuguese-approved-static\.js\?v=20260810-portugues-estatico-v1/);
  assert.ok(html.indexOf('biblioteca-final-standard.js') < html.indexOf('library-portuguese-approved-static.js'));
});

test('fallback vetorial é substituído por PNG gerado pela IA', () => {
  assert.match(libraryIllustration, /generate-library-illustration/);
  assert.match(libraryIllustration, /data:image\/svg\+xml/);
  assert.match(libraryIllustration, /illustrationDataUrl/);
  assert.match(libraryIllustration, /Gerando ilustração pedagógica/);
  assert.match(libraryIllustration, /data-te-ai-illustration/);
});

test('Biblioteca pronta não espera geração de imagem no download', () => {
  assert.doesNotMatch(html, /library-export-image-sync\.js/);
  assert.match(html, /biblioteca-final-standard\.js/);
  assert.match(html, /library-portuguese-approved-static\.js/);
});

test('prompt proíbe clipart e exige ilustração editorial infantil', () => {
  assert.match(api, /ilustração editorial infantil de alta qualidade/);
  assert.match(api, /Não faça clipart, pictograma, ícone, infográfico, vetor chapado/);
  assert.match(api, /3 a 5 crianças diversas/);
  assert.match(api, /blocos de base dez\/material dourado/);
  assert.match(api, /quality: 'medium'/);
});

test('IA e foto não aceitam SVG como resultado final', () => {
  assert.match(jogos, /carregarPadraoIlustracao/);
  assert.match(illustrationGuard, /removeVectorFallbacks/);
  assert.match(illustrationGuard, /data:image\\\/svg\\\+xml/);
  assert.match(illustrationGuard, /Ilustração aguardando geração em alta qualidade/);
});

test('BNCC não permanece na folha do aluno', () => {
  assert.match(illustrationGuard, /moveBnccToAnswerKey/);
  assert.match(illustrationGuard, /studentBncc\.remove\(\)/);
  assert.match(illustrationGuard, /generated-answer-key-page/);
});

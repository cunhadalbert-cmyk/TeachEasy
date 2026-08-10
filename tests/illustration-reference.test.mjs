import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../biblioteca.html', import.meta.url), 'utf8');
const libraryIllustration = await readFile(new URL('../library-ai-illustration.js', import.meta.url), 'utf8');
const illustrationGuard = await readFile(new URL('../illustration-reference-standard.js', import.meta.url), 'utf8');
const exportSync = await readFile(new URL('../library-export-image-sync.js', import.meta.url), 'utf8');
const api = await readFile(new URL('../api/generate-library-illustration.js', import.meta.url), 'utf8');
const jogos = await readFile(new URL('../jogos-inline.js', import.meta.url), 'utf8');

test('Biblioteca carrega gerador real de ilustração depois do renderizador final', () => {
  assert.match(html, /library-ai-illustration\.js\?v=20260810-ilustracao-real-v1/);
  assert.ok(html.indexOf('library-ai-illustration.js') > html.indexOf('biblioteca-final-standard.js'));
  assert.doesNotMatch(html, /illustration-reference-standard\.js/);
});

test('sincronizador de exportação é carregado antes do renderizador final', () => {
  assert.match(html, /library-export-image-sync\.js\?v=20260810-imagem-export-v1/);
  assert.ok(html.indexOf('library-export-image-sync.js') < html.indexOf('biblioteca-final-standard.js'));
});

test('fallback vetorial é substituído por PNG gerado pela IA', () => {
  assert.match(libraryIllustration, /generate-library-illustration/);
  assert.match(libraryIllustration, /data:image\/svg\+xml/);
  assert.match(libraryIllustration, /illustrationDataUrl/);
  assert.match(libraryIllustration, /Gerando ilustração pedagógica/);
  assert.match(libraryIllustration, /data-te-ai-illustration/);
});

test('Word e PDF esperam a imagem final e sincronizam a fonte visível', () => {
  assert.match(exportSync, /waitForFinalImage/);
  assert.match(exportSync, /image\.decode/);
  assert.match(exportSync, /shell\._teFinalData\.visual = src/);
  assert.match(exportSync, /te-final-word, \.te-final-pdf/);
  assert.match(exportSync, /teExportImageReady/);
  assert.match(exportSync, /data:image\\\/svg\\\+xml/);
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

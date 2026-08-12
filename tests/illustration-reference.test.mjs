import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../biblioteca.html', import.meta.url), 'utf8');
const libraryIllustration = await readFile(new URL('../library-ai-illustration.js', import.meta.url), 'utf8');
const illustrationAdmin = await readFile(new URL('../library-illustration-admin.js', import.meta.url), 'utf8');
const illustrationGuard = await readFile(new URL('../illustration-reference-standard.js', import.meta.url), 'utf8');
const api = await readFile(new URL('../api/generate-library-illustration.js', import.meta.url), 'utf8');
const jogos = await readFile(new URL('../jogos-inline.js', import.meta.url), 'utf8');

test('Biblioteca normal não carrega gerador dinâmico legado de IA', () => {
  assert.doesNotMatch(html, /library-ai-illustration\.js/);
  assert.doesNotMatch(html, /illustration-reference-standard\.js/);
  assert.doesNotMatch(html, /library-export-image-sync\.js/);
});

test('modo temporário de ilustração fica protegido por parâmetro explícito', () => {
  assert.match(html, /library-illustration-admin\.js\?v=20260811-auto-ilustracao-v2/);
  assert.match(illustrationAdmin, /modoIlustracao/);
  assert.match(illustrationAdmin, /!== '1'/);
  assert.match(illustrationAdmin, /generate-library-illustration/);
  assert.match(illustrationAdmin, /setTimeout\(generateIllustration, 150\)/);
  assert.match(illustrationAdmin, /startsWith\('data:image\/svg\+xml'\)/);
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

test('prompt exige personagens oficiais e ilustração editorial infantil leve', () => {
  assert.match(api, /ilustração editorial infantil de alta qualidade/);
  assert.match(api, /Não faça clipart, pictograma, ícone, infográfico, vetor chapado/);
  assert.match(api, /exatamente quatro crianças e um cachorro pequeno/);
  assert.match(api, /menina maior, cabelo preto longo/);
  assert.match(api, /menina menor, cabelo claro e óculos de grau/);
  assert.match(api, /menino moreno, cabelo bem baixinho, sem óculos/);
  assert.match(api, /Cachorro: pequeno, simpático, pelagem cinza mesclada com preto/);
  assert.match(api, /blocos de base dez\/material dourado/);
  assert.match(api, /quality: 'low'/);
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

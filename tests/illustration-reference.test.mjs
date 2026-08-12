import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../biblioteca.html', import.meta.url), 'utf8');
const libraryIllustration = await readFile(new URL('../library-ai-illustration.js', import.meta.url), 'utf8');
const illustrationAdmin = await readFile(new URL('../library-illustration-admin.js', import.meta.url), 'utf8');
const exportImageSync = await readFile(new URL('../library-export-image-sync.js', import.meta.url), 'utf8');
const illustrationGuard = await readFile(new URL('../illustration-reference-standard.js', import.meta.url), 'utf8');
const api = await readFile(new URL('../api/generate-library-illustration.js', import.meta.url), 'utf8');
const jogos = await readFile(new URL('../jogos-inline.js', import.meta.url), 'utf8');

test('Biblioteca normal não carrega gerador dinâmico legado de IA', () => {
  assert.doesNotMatch(html, /library-ai-illustration\.js/);
  assert.doesNotMatch(html, /illustration-reference-standard\.js/);
});

test('modo temporário de ilustração permanece protegido e salva a imagem vinculada ao exercício', () => {
  assert.match(html, /library-illustration-admin\.js\?v=20260812-persistencia-ilustracao-v4/);
  assert.match(illustrationAdmin, /modoIlustracao/);
  assert.match(illustrationAdmin, /!== '1'/);
  assert.match(illustrationAdmin, /generate-library-illustration/);
  assert.match(illustrationAdmin, /tePersistLibraryIllustration/);
  assert.match(illustrationAdmin, /Ilustração pronta e salva neste exercício/);
});

test('download Word e PDF gera, persiste e reutiliza a imagem quando ainda há fallback', () => {
  assert.match(html, /library-export-image-sync\.js\?v=20260812-persistencia-ilustracao-v6/);
  assert.ok(html.indexOf('library-export-image-sync.js') < html.indexOf('biblioteca-final-standard.js'));
  assert.doesNotMatch(exportImageSync, /modoIlustracao/);
  assert.match(exportImageSync, /\.te-final-word, \.te-final-pdf/);
  assert.match(exportImageSync, /generate-library-illustration/);
  assert.match(exportImageSync, /indexedDB/);
  assert.match(exportImageSync, /restoreFinalImage/);
  assert.match(exportImageSync, /savePersistentImage/);
  assert.match(exportImageSync, /readPersistentImage/);
  assert.match(exportImageSync, /Gerando imagem\.\.\./);
  assert.match(exportImageSync, /Preparando arquivo\.\.\./);
  assert.match(exportImageSync, /validFinalImage/);
  assert.match(exportImageSync, /svg/);
  assert.match(exportImageSync, /button\.click\(\)/);
});

test('PNG estática aprovada é carregada depois do renderizador final', () => {
  assert.match(html, /library-portuguese-approved-static\.js\?v=20260810-portugues-estatico-v1/);
  assert.ok(html.indexOf('biblioteca-final-standard.js') < html.indexOf('library-portuguese-approved-static.js'));
});

test('fallback vetorial possui mecanismo de substituição por PNG gerado pela IA', () => {
  assert.match(libraryIllustration, /generate-library-illustration/);
  assert.match(libraryIllustration, /data:image\/svg\+xml/);
  assert.match(libraryIllustration, /illustrationDataUrl/);
  assert.match(libraryIllustration, /Gerando ilustração pedagógica/);
  assert.match(libraryIllustration, /data-te-ai-illustration/);
});

test('prompt exige personagens oficiais e ilustração editorial infantil leve', () => {
  assert.match(api, /estilo editorial infantil LEVE, LIMPO e SUAVE/);
  assert.match(api, /Não faça clipart, pictograma, ícone, infográfico, vetor chapado/);
  assert.match(api, /exatamente quatro crianças e um cachorro pequeno/);
  assert.match(api, /menina maior, cabelo preto longo/);
  assert.match(api, /menina menor, cabelo claro preso, óculos de grau/);
  assert.match(api, /menino moreno de pele escura, cabelo preto bem baixinho, óculos de grau pretos/);
  assert.match(api, /menino de cabelo preto, sem óculos/);
  assert.match(api, /Cachorro: pequeno, simpático, pelagem cinza mesclada com preto/);
  assert.match(api, /Não troque os óculos entre personagens/);
  assert.match(api, /fundo branco ou muito claro/);
  assert.match(api, /cores alegres porém claras e pouco saturadas/);
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

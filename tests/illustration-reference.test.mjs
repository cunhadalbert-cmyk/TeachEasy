import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';

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

test('download Word e PDF usa cache versionado do elenco oficial atual', () => {
  assert.match(html, /library-export-image-sync\.js\?v=20260812-persistencia-ilustracao-v7-official-cast-v2/);
  assert.ok(html.indexOf('library-export-image-sync.js') < html.indexOf('biblioteca-final-standard.js'));
  assert.doesNotMatch(exportImageSync, /modoIlustracao/);
  assert.match(exportImageSync, /\.te-final-word, \.te-final-pdf/);
  assert.match(exportImageSync, /generate-library-illustration/);
  assert.match(exportImageSync, /indexedDB/);
  assert.match(exportImageSync, /ILLUSTRATION_CACHE_VERSION = 'official-cast-v2-20260812'/);
  assert.match(exportImageSync, /\$\{ILLUSTRATION_CACHE_VERSION\}\|\$\{data\.subject\}/);
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

test('gerador usa a imagem oficial com fidelidade visual reforçada', async () => {
  const referencePath = new URL('../public/illustrations/reference/teacheasy-official-cast.png', import.meta.url);
  const referenceStat = await stat(referencePath);
  assert.ok(referenceStat.size > 10_000, 'A referência visual oficial está ausente ou pequena demais.');
  assert.match(api, /teacheasy-official-cast\.png/);
  assert.match(api, /REFERÊNCIA VISUAL OFICIAL E OBRIGATÓRIA/);
  assert.match(api, /TRAVA VISUAL ABSOLUTA/);
  assert.match(api, /ELEMENTOS VISUAIS A SEREM PRESERVADOS/);
  assert.match(api, /NÃO redesenhe do zero cabeça, rosto, cabelo, óculos, tronco, roupas ou calçados/);
  assert.match(api, /A cena nova deve parecer uma edição da mesma imagem oficial/);
  assert.match(api, /NÃO reinterprete, NÃO redesenhe/);
  assert.match(api, /REGRA DE PRESERVAÇÃO DE IDENTIDADE/);
  assert.match(api, /EXATAMENTE essas quatro crianças e esse cachorro/);
  assert.match(api, /camiseta branca com desenho de controle de videogame/);
  assert.match(api, /camiseta roxa com margarida branca/);
  assert.match(api, /jardineira jeans azul/);
  assert.match(api, /camiseta verde com dinossauro/);
  assert.match(api, /A fidelidade ao elenco é mais importante do que a variedade de pose/);
  assert.match(api, /ORDEM DE PRIORIDADE/);
  assert.match(api, /v1\/images\/edits/);
  assert.match(api, /form\.append\('input_fidelity', 'high'\)/);
  assert.match(api, /form\.append\('model', 'gpt-image-1'\)/);
  assert.match(api, /form\.append\('quality', 'high'\)/);
  assert.match(api, /form\.append\('size', '1536x1024'\)/);
  assert.match(api, /bytes\.byteLength < 10_000/);
  assert.match(api, /blocos de base dez, material dourado/);
});

test('gerador não inventa personagens quando a referência oficial falha', () => {
  assert.doesNotMatch(api, /generateWithoutReference/);
  assert.doesNotMatch(api, /v1\/images\/generations/);
  assert.match(api, /await generateWithReference\(request, prompt\)/);
  assert.match(api, /referência visual oficial/);
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

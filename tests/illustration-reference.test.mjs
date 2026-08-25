import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';

const html = await readFile(new URL('../biblioteca.html', import.meta.url), 'utf8');
const illustrationAdmin = await readFile(new URL('../library-illustration-admin.js', import.meta.url), 'utf8');
const illustrationContext = await readFile(new URL('../library-illustration-context.js', import.meta.url), 'utf8');
const exportImageSync = await readFile(new URL('../library-export-image-sync.js', import.meta.url), 'utf8');
const illustrationGuard = await readFile(new URL('../illustration-reference-standard.js', import.meta.url), 'utf8');
const api = await readFile(new URL('../api/generate-library-illustration.js', import.meta.url), 'utf8');
const illustrationGeneration = await readFile(new URL('../api/_lib/illustration-generation.js', import.meta.url), 'utf8');
const jogos = await readFile(new URL('../jogos-inline.js', import.meta.url), 'utf8');

test('Biblioteca normal não carrega gerador dinâmico legado de IA', () => {
  assert.doesNotMatch(html, /library-ai-illustration\.js/);
  assert.doesNotMatch(html, /illustration-reference-standard\.js/);
});

test('contexto V2 da ilustração preserva a cena original e invalida imagens antigas', () => {
  assert.match(html, /library-illustration-context\.js\?v=20260817-participantes-ativos-v1/);
  assert.ok(html.indexOf('library-geography-reading.js') < html.indexOf('library-illustration-context.js'));
  assert.ok(html.indexOf('library-illustration-context.js') < html.indexOf('library-export-image-sync.js'));
  assert.match(illustrationContext, /activity\.ilustracao\.descricao/);
  assert.match(illustrationContext, /Cena original da atividade/);
  assert.match(illustrationContext, /generate-library-illustration/);
  assert.match(illustrationContext, /payload\.context/);
  assert.match(illustrationContext, /indexedDB\.deleteDatabase\(DB_NAME\)/);
  assert.match(illustrationContext, /teacheasy-illustrations-active-participants-v1/);
});

test('caixa sem imagem mostra solicitação de ilustração e personagens ativos', () => {
  assert.match(illustrationContext, /fallbackDescription/);
  assert.match(illustrationContext, /subject === 'Geografia'/);
  assert.match(illustrationContext, /te-illustration-request-placeholder/);
  assert.match(illustrationContext, /ILUSTRAÇÃO:/);
  assert.match(illustrationContext, /PARTICIPANTES ATIVOS/);
  assert.match(illustrationContext, /interagindo de forma natural/);
  assert.match(illustrationContext, /visual\.querySelector\('img'\)/);
});

test('modo temporário de ilustração permanece protegido e salva a imagem vinculada ao exercício', () => {
  assert.match(html, /library-illustration-admin\.js\?v=20260812-persistencia-ilustracao-v4/);
  assert.match(illustrationAdmin, /modoIlustracao/);
  assert.match(illustrationAdmin, /!== '1'/);
  assert.match(illustrationAdmin, /generate-library-illustration/);
  assert.match(illustrationAdmin, /tePersistLibraryIllustration/);
  assert.match(illustrationAdmin, /Ilustração pronta e salva neste exercício/);
});

test('download Word e PDF usa persistência nova baseada no título normalizado', () => {
  assert.match(html, /vendor\/jszip\.min\.js\?v=3\.10\.1/);
  assert.match(html, /library-export-image-sync\.js\?v=20260824-zip-title-store-v1/);
  assert.ok(html.indexOf('library-export-image-sync.js') < html.indexOf('biblioteca-final-standard.js'));
  assert.doesNotMatch(exportImageSync, /modoIlustracao/);
  assert.match(exportImageSync, /\.te-final-word,\s*\.te-final-pdf/);
  assert.match(exportImageSync, /indexedDB/);
  assert.match(exportImageSync, /TeachEasyIllustrationsByNormalizedTitleV1/);
  assert.match(exportImageSync, /imagesByNormalizedTitleV1/);
  assert.match(exportImageSync, /te-illustration-title-batch-selection-v1/);
  assert.match(exportImageSync, /function normalizeTitle/);
  assert.match(exportImageSync, /input\.multiple = false/);
  assert.match(exportImageSync, /Importar ZIP de imagens/);
  assert.doesNotMatch(exportImageSync, /activityId|illustrationId|TeachEasyIllustrationStore/);
  assert.match(exportImageSync, /svg/);
  assert.match(exportImageSync, /button\.click\(\)/);
});

test('PNG estática aprovada é carregada depois do renderizador final', () => {
  assert.match(html, /library-portuguese-approved-static\.js\?v=20260810-portugues-estatico-v1/);
  assert.ok(html.indexOf('biblioteca-final-standard.js') < html.indexOf('library-portuguese-approved-static.js'));
});

test('gerador usa a imagem oficial com fidelidade visual reforçada', async () => {
  const referencePath = new URL('../public/illustrations/reference/teacheasy-official-cast.png', import.meta.url);
  const referenceStat = await stat(referencePath);
  assert.ok(referenceStat.size > 10_000, 'A referência visual oficial está ausente ou pequena demais.');
  assert.match(api, /teacheasy-official-cast\.png/);
  assert.match(api, /fetchOfficialCastReference/);
  assert.match(api, /bytes\.byteLength < 10_000/);
  assert.match(api, /generateIllustrationBuffer/);
  assert.match(illustrationGeneration, /REFERÊNCIA VISUAL OFICIAL E OBRIGATÓRIA/);
  assert.match(illustrationGeneration, /TRAVA VISUAL ABSOLUTA/);
  assert.match(illustrationGeneration, /ELEMENTOS VISUAIS A SEREM PRESERVADOS/);
  assert.match(illustrationGeneration, /REGRA DE PRESERVAÇÃO DE IDENTIDADE/);
  assert.match(illustrationGeneration, /Escolha somente os personagens necessários/);
  assert.match(illustrationGeneration, /O cachorro aparece somente quando fizer sentido/);
  assert.match(illustrationGeneration, /camiseta branca com desenho de controle de videogame/);
  assert.match(illustrationGeneration, /camiseta roxa com margarida branca/);
  assert.match(illustrationGeneration, /jardineira jeans azul/);
  assert.match(illustrationGeneration, /camiseta verde com dinossauro/);
  assert.match(illustrationGeneration, /A fidelidade ao elenco é mais importante do que a variedade de pose/);
  assert.match(illustrationGeneration, /REGRA OFICIAL DE PARTICIPAÇÃO NA CENA/);
  assert.match(illustrationGeneration, /PARTICIPANTES ATIVOS/);
  assert.match(illustrationGeneration, /NÃO coloque os personagens apenas parados, posando/);
  assert.match(illustrationGeneration, /NUNCA podem substituir, esconder, apagar, reduzir ou descaracterizar/);
  assert.match(illustrationGeneration, /preserve integralmente o conteúdo pedagógico/);
  assert.match(illustrationGeneration, /falsificar o período, a cultura ou o acontecimento/i);
  assert.match(illustrationGeneration, /REGRA ABSOLUTA DE QUANTIDADE DO ELENCO/);
  assert.match(illustrationGeneration, /cada personagem oficial pode aparecer NO MÁXIMO UMA VEZ/);
  assert.match(illustrationGeneration, /O único animal permitido é Nino/);
  assert.match(illustrationGeneration, /Nunca gere segundo cachorro, filhote, outro cão, gato ou qualquer animal adicional/);
  assert.match(illustrationGeneration, /Nino só pode aparecer uma vez/);
  assert.match(illustrationGeneration, /ORDEM DE PRIORIDADE/);
  assert.match(illustrationGeneration, /preservar integralmente a cena pedagógica e seus elementos essenciais/);
  assert.match(illustrationGeneration, /integrar os personagens TeachEasy como participantes ativos e naturais da cena/);
  assert.match(illustrationGeneration, /v1\/images\/edits/);
  assert.match(illustrationGeneration, /form\.append\('input_fidelity', 'high'\)/);
  assert.match(illustrationGeneration, /form\.append\('model', 'gpt-image-1'\)/);
  assert.match(illustrationGeneration, /form\.append\('quality', 'high'\)/);
  assert.match(illustrationGeneration, /form\.append\('size', '1536x1024'\)/);
  assert.match(illustrationGeneration, /blocos de base dez, material dourado/);
});

test('gerador não inventa personagens quando a referência oficial falha', () => {
  assert.doesNotMatch(illustrationGeneration, /generateWithoutReference/);
  assert.doesNotMatch(illustrationGeneration, /v1\/images\/generations/);
  assert.match(api, /await fetchOfficialCastReference\(request\)/);
  assert.match(api, /generateIllustrationBuffer/);
  assert.match(illustrationGeneration, /referência visual oficial está ausente ou inválida/);
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

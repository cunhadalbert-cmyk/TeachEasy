import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../montar-material.html', import.meta.url), 'utf8');
const js = await readFile(new URL('../montar-material.js', import.meta.url), 'utf8');
const livePreviewJs = await readFile(new URL('../montar-material-live-preview.js', import.meta.url), 'utf8');
const wordExportJs = await readFile(new URL('../montar-material-word-export.js', import.meta.url), 'utf8');

test('montador usa conteúdo existente da Biblioteca sem serviço de IA', () => {
  assert.match(html, /SEM GERAÇÃO POR IA/);
  assert.match(js, /fetch\(config\.path/);
  assert.match(js, /question\.enunciado/);
  assert.match(js, /answer\?\.resposta/);
  assert.doesNotMatch(js, /openai|anthropic|gemini|\/api\/generate|\/api\/ai/i);
});

test('montador preserva contexto de texto e imagem da atividade de origem', () => {
  assert.match(js, /activity\.textoApoio\?\.conteudo/);
  assert.match(js, /posicaoSugerida === 'antes-das-questoes'/);
  assert.match(html, /contexto original acompanha aquele bloco/);
});

test('BNCC é renderizada somente no gabarito', () => {
  assert.match(js, /function answerKeyMarkup\(\)/);
  assert.match(js, /class="bncc-box"/);

  const previewStart = js.indexOf('function renderPreview()');
  const answerKeyCall = js.indexOf('${answerKeyMarkup()}', previewStart);
  assert.ok(previewStart >= 0 && answerKeyCall > previewStart);
  const studentTemplate = js.slice(previewStart, answerKeyCall);
  assert.doesNotMatch(studentTemplate, /BNCC|bncc-box|habilidadeOficial/);
});

test('gabarito acompanha apenas as questões escolhidas e mantém a numeração final', () => {
  assert.match(js, /group\.selected\.keys\(\)/);
  assert.match(js, /answerForQuestion\(group\.activity, question, index\)/);
  assert.match(js, /finalNumber \+= 1/);
});

test('montador mostra prévia ao vivo ao lado enquanto o professor seleciona questões', () => {
  assert.match(html, /id="live-preview"/);
  assert.match(html, /Prévia ao vivo/);
  assert.match(html, /Atualiza automaticamente enquanto você escolhe as questões/);
  assert.match(livePreviewJs, /MutationObserver/);
  assert.match(livePreviewJs, /querySelector\('\.student-page'\)/);
  assert.match(livePreviewJs, /cloneNode\(true\)/);
  assert.doesNotMatch(livePreviewJs, /openai|anthropic|gemini|\/api\/generate|\/api\/ai/i);
});

test('cabeçalho final usa duas linhas compactas: Nome Turma Data e Escola Prof', () => {
  assert.match(livePreviewJs, /headerFieldMarkup\('Nome:'/);
  assert.match(livePreviewJs, /headerFieldMarkup\('Turma:'/);
  assert.match(livePreviewJs, /headerFieldMarkup\('Data:'/);
  assert.match(livePreviewJs, /headerFieldMarkup\('Escola:'/);
  assert.match(livePreviewJs, /headerFieldMarkup\('Prof\.:'/);
  assert.match(livePreviewJs, /Cabeçalho da atividade em duas linhas/);
  assert.match(livePreviewJs, /printArea\.cloneNode/);
  assert.match(livePreviewJs, /window\.print/);
});

test('Word usa DOCX real, layout compacto e imagens padronizadas sem repetição', () => {
  assert.match(html, /montar-material-word-export\.js/);
  assert.match(html, /Baixar Word \(\.docx\)/);
  assert.match(wordExportJs, /docx@9\.7\.1/);
  assert.match(wordExportJs, /teacheasy-material\.docx/);
  assert.match(wordExportJs, /compactHeader\(docx\)/);
  assert.match(wordExportJs, /maxWidth/);
  assert.match(wordExportJs, /maxHeight/);
  assert.match(wordExportJs, /seenImages = new Set/);
  assert.match(wordExportJs, /!seenImages\.has\(imageKey\)/);
  assert.match(wordExportJs, /pageBreakBefore: true/);
  assert.doesNotMatch(wordExportJs, /application\/msword|\.doc';/);
});

test('Word reproduz cabeçalho visual com moldura preta e linhas dos campos', () => {
  assert.match(wordExportJs, /headerOuterBorders\(docx\)/);
  assert.match(wordExportJs, /color: '000000'/);
  assert.match(wordExportJs, /insideHorizontal: none/);
  assert.match(wordExportJs, /insideVertical: none/);
  assert.match(wordExportJs, /UnderlineType\.SINGLE/);
  assert.match(wordExportJs, /fieldLineText\(value, slots\)/);
  assert.match(wordExportJs, /headerCell\(docx, 'Nome:'/);
  assert.match(wordExportJs, /headerCell\(docx, 'Turma:'/);
  assert.match(wordExportJs, /headerCell\(docx, 'Data:'/);
  assert.match(wordExportJs, /headerCell\(docx, 'Escola:'/);
  assert.match(wordExportJs, /headerCell\(docx, 'Prof\.:'/);
});

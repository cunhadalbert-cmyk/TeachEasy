import { existsSync, readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataRoot = join(root, 'data', 'atividades');
const files = [];
function collect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) collect(path);
    else if (entry.name.endsWith('.json')) files.push(path);
  }
}
collect(dataRoot);

const visualCommand = /(observe\s+(?:a\s+figura|a\s+imagem|o\s+desenho|o\s+esquema|o\s+gr[aá]fico|a\s+tabela|o\s+mapa|a\s+sequ[eê]ncia)|analise\s+(?:a\s+figura|a\s+imagem|o\s+desenho|o\s+esquema|o\s+gr[aá]fico|a\s+tabela|o\s+mapa)|veja\s+(?:a\s+figura|a\s+imagem|o\s+desenho|o\s+esquema|o\s+gr[aá]fico|a\s+tabela|o\s+mapa))/i;
const rows = [];
const errors = [];

for (const file of files) {
  const collection = JSON.parse(readFileSync(file, 'utf8'));
  for (const activity of collection.atividades) {
    const figures = new Map((activity.figuras || []).map(figure => [figure.id, figure]));
    for (const question of activity.questoes) {
      const requiresVisual = visualCommand.test(question.enunciado);
      if (requiresVisual && !question.figuraId) {
        errors.push(`${activity.id}, questão ${question.numero}: comando visual sem figuraId.`);
      }
      if (!question.figuraId) continue;
      const figure = figures.get(question.figuraId);
      const absoluteAsset = figure?.arquivo ? join(root, figure.arquivo) : '';
      const safePath = Boolean(figure?.arquivo
        && !figure.arquivo.includes('..')
        && /^assets\/atividades\/.+\.(png|jpe?g|webp|svg)$/i.test(figure.arquivo));
      const exists = Boolean(safePath && existsSync(absoluteAsset));
      const bytes = exists ? readFileSync(absoluteAsset) : null;
      const loadable = Boolean(bytes && (
        (bytes[0] === 0x89 && bytes.subarray(1, 4).toString('ascii') === 'PNG')
        || bytes.subarray(0, 5).toString('ascii') === '<?xml'
        || bytes.subarray(0, 4).toString('ascii') === '<svg'
        || (bytes[0] === 0xff && bytes[1] === 0xd8)
      ));
      const ok = Boolean(figure && safePath && exists && loadable);
      rows.push({
        activity: activity.id,
        subject: collection.disciplina,
        question: question.numero,
        figureId: question.figuraId,
        file: figure?.arquivo || '—',
        status: ok ? 'OK' : 'AUSENTE',
        rendering: ok ? 'OK — site, PDF e Word' : 'BLOQUEADA'
      });
      if (!figure) errors.push(`${activity.id}, questão ${question.numero}: ${question.figuraId} não existe no array figuras.`);
      else if (!safePath || !exists || !loadable) {
        errors.push(`Esta atividade depende da figura ${question.figuraId}, mas o arquivo visual ainda não foi produzido.`);
      }
    }
    if (activity.possuiFiguras && !(activity.figuras || []).length) {
      errors.push(`${activity.id}: possuiFiguras está marcado, mas o array figuras está vazio.`);
    }
  }
}

const subjects = ['Matemática', 'Língua Portuguesa', 'Ciências', 'História', 'Geografia'];
const present = new Set(files.map(file => JSON.parse(readFileSync(file, 'utf8')).disciplina));
const report = [
  '# Auditoria de figuras das atividades',
  '',
  `Gerado automaticamente. Arquivos JSON verificados: ${files.length}.`,
  '',
  '| Disciplina | Atividade | Questão | figuraId | Arquivo | Status | Resultado da renderização |',
  '| --- | --- | ---: | --- | --- | --- | --- |',
  ...rows.map(row => `| ${row.subject} | ${row.activity} | ${row.question} | ${row.figureId} | ${row.file} | ${row.status} | ${row.rendering} |`),
  '',
  '## Cobertura por disciplina',
  '',
  ...subjects.map(subject => `- ${subject}: ${present.has(subject) ? 'arquivo integrado e auditado' : 'ainda sem arquivo de coleção neste lote'}`),
  '',
  `Resultado: ${errors.length ? `FALHOU (${errors.length} problema(s))` : 'OK — nenhuma atividade referenciada possui figura ausente.'}`,
  ...(errors.length ? ['', ...errors.map(error => `- ${error}`)] : [])
].join('\n');

const reportPath = join(root, 'docs', 'auditoria-figuras.md');
mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, `${report}\n`, 'utf8');
console.log(`Relatório: ${relative(root, reportPath)}`);
if (errors.length) {
  errors.forEach(error => console.error(error));
  process.exitCode = 1;
}

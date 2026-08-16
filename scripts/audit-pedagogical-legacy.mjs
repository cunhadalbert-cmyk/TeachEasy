import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const base = path.join(root, 'data', 'atividades', 'fundamental-anos-iniciais');
const genericPatterns = [
  /\bA atividade aborda\b/i,
  /\bcom conceitos, exemplos e procedimentos adequados\b/i,
  /\bAnalise informações, organize estratégias\b/i,
  /\bdesenvolver aprendizagens de .+ relacionadas a\b/i,
  /\bAplique (?:EI|EF|EM)[A-Z0-9]+\b/i,
  /\bProduza síntese argumentativa\b/i,
  /\bMobilizar (?:EI|EF|EM)[A-Z0-9]+\b/i,
  /\bResposta construída conforme\b/i,
  /\bResposta esperada coerente\b/i,
  /\bconsiderando o comando da questão\b/i
];

function text(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function isGeneric(value) {
  return genericPatterns.some(pattern => pattern.test(text(value)));
}

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : entry.name.endsWith('.json') ? [full] : [];
  });
}

const files = walk(base);
const findings = [];
let activities = 0;

for (const file of files) {
  let collection;
  try {
    collection = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    findings.push({ file: path.relative(root, file), id: '(coleção)', problems: ['JSON inválido'] });
    continue;
  }

  for (const activity of collection.atividades || []) {
    activities += 1;
    const problems = [];
    const supportTitle = text(activity?.textoApoio?.titulo);
    const supportText = text(activity?.textoApoio?.conteudo);
    if (!supportText || supportText.length < 120) problems.push('texto de apoio ausente/insuficiente');
    if (isGeneric(supportText)) problems.push('texto de apoio genérico');
    if (supportTitle && supportTitle.replace(/\s*[—-]\s*(?:EI|EF|EM)[A-Z0-9]+.*$/i, '').trim().toLowerCase() === text(activity.titulo).toLowerCase()) {
      problems.push('título do texto duplica título da atividade');
    }
    if ((activity.questoes || []).length !== 8) problems.push('quantidade de questões diferente de 8');
    if ((activity.gabarito || []).length !== 8) problems.push('quantidade de respostas diferente de 8');
    if ((activity.questoes || []).some(item => isGeneric(item.enunciado))) problems.push('questão genérica');
    if ((activity.gabarito || []).some(item => isGeneric(item.resposta))) problems.push('gabarito genérico');
    if (!(activity.bncc || []).every(item => text(item.codigo) && text(item.habilidadeOficial))) problems.push('habilidade oficial completa ausente');
    if (activity.revisao?.status === 'revisada' && problems.length) problems.push('marcada revisada apesar de problemas');

    if (problems.length) findings.push({ file: path.relative(root, file), id: activity.id || '(sem id)', problems: [...new Set(problems)] });
  }
}

const summary = {
  arquivosAnalisados: files.length,
  atividadesAnalisadas: activities,
  atividadesComProblemas: findings.filter(item => item.id !== '(coleção)').length,
  achados: findings.length
};

console.log(JSON.stringify({ summary, findings }, null, 2));

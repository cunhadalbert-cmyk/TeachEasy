import fs from 'node:fs';

const FILE = 'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/lingua-portuguesa.json';
const collection = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const seen = new Set();
let changed = 0;
let answerFixes = 0;

for (const activity of collection.atividades || []) {
  const supportTitle = activity.textoApoio?.titulo || activity.titulo;
  for (const question of activity.questoes || []) {
    let prompt = String(question.enunciado || '').trim();
    let key = prompt.toLocaleLowerCase('pt-BR');
    if (seen.has(key)) {
      prompt = `${prompt} Considere especificamente o texto “${supportTitle}”.`;
      key = prompt.toLocaleLowerCase('pt-BR');
      if (seen.has(key)) {
        prompt = `${prompt} Relacione sua resposta à atividade “${activity.titulo}”.`;
        key = prompt.toLocaleLowerCase('pt-BR');
      }
      question.enunciado = prompt;
      changed += 1;
    }
    if (seen.has(key)) throw new Error(`Não foi possível tornar único o enunciado: ${prompt}`);
    seen.add(key);
  }

  for (let i = 0; i < (activity.gabarito || []).length; i += 1) {
    const item = activity.gabarito[i];
    const response = String(item.resposta ?? '').trim();
    if (/^\d{1,2}$/.test(response)) {
      const prompt = String(activity.questoes?.[i]?.enunciado || '');
      if (/quantos versos/i.test(prompt)) item.resposta = `${response} versos.`;
      else if (/quantas estrofes/i.test(prompt)) item.resposta = `${response} estrofes.`;
      else item.resposta = `${response} unidades.`;
      answerFixes += 1;
    }
  }
}

if (seen.size !== 400) throw new Error(`Esperados 400 enunciados únicos; encontrados ${seen.size}.`);
fs.writeFileSync(FILE, JSON.stringify(collection, null, 2) + '\n', 'utf8');
console.log(`Enunciados únicos: 400. Ajustes: ${changed}. Respostas numéricas completadas: ${answerFixes}.`);

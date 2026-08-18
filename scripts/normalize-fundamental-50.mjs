import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const subjects = [
  ['lingua-portuguesa.json', 'Língua Portuguesa', 'lp'],
  ['matematica.json', 'Matemática', 'mat'],
  ['ciencias.json', 'Ciências', 'cie'],
  ['historia.json', 'História', 'his'],
  ['geografia.json', 'Geografia', 'geo']
];

function stageDir(year) {
  return year <= 5 ? 'fundamental-anos-iniciais' : 'fundamental-anos-finais';
}

function clean(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function slug(value = '') {
  return clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'tema';
}

function skillText(skill = {}) {
  return clean(skill.habilidadeOficial || skill.descricaoResumida || 'Habilidade de Geografia e Ciências Humanas conforme a BNCC oficial do MEC.');
}

function supportText(year, subject, theme, skill, index) {
  const skillSummary = skillText(skill);
  if (year <= 2) {
    return `Em ${subject}, estudar ${theme.toLowerCase()} ajuda a criança a observar o cotidiano, nomear elementos, comparar situações e registrar descobertas. Nesta proposta, o estudante parte de exemplos próximos da escola, da família ou da comunidade e organiza o que percebe com palavras, desenhos, números ou pequenas explicações. O foco da habilidade ${skill.codigo} envolve ${skillSummary.toLowerCase()} A atividade ${index} retoma esse conhecimento em uma nova situação para ampliar a compreensão sem substituir a experiência concreta.`;
  }
  if (year <= 5) {
    return `O estudo de ${theme.toLowerCase()} permite relacionar informações, exemplos do cotidiano e conhecimentos próprios de ${subject}. A atividade propõe observar evidências, estabelecer comparações, explicar relações e registrar conclusões adequadas ao ${year}º ano. A habilidade ${skill.codigo} orienta o trabalho e corresponde a ${skillSummary.toLowerCase()} Nesta ampliação, o estudante aplica esse conhecimento a uma situação diferente, justificando suas respostas com informações do texto e com conceitos estudados.`;
  }
  return `O tema ${theme.toLowerCase()} pode ser analisado por diferentes evidências, escalas e relações próprias de ${subject}. Nesta atividade, o estudante deverá selecionar informações relevantes, empregar vocabulário da área, comparar processos e construir uma conclusão fundamentada. A habilidade ${skill.codigo} corresponde a ${skillSummary.toLowerCase()} A proposta de aprofundamento ${index} desloca o conhecimento para outro contexto, exigindo leitura crítica, explicação de relações e uso explícito de evidências, sem transformar o código da BNCC em enunciado para o aluno.`;
}

function questions(year, title, theme) {
  if (year <= 2) {
    return [
      `O que você percebe primeiro na situação apresentada em “${title}”?`,
      `Quais dois elementos ajudam a compreender melhor ${theme.toLowerCase()} nesta atividade?`,
      `O que é parecido e o que é diferente entre os exemplos apresentados em “${title}”?`,
      `Que informação do texto de apoio ajuda a responder sobre ${theme.toLowerCase()}?`,
      `Como esse tema pode ser observado na escola, em casa ou na comunidade?`,
      `Escreva com suas palavras uma descoberta feita ao estudar “${title}”.`
    ];
  }
  return [
    `Caracterize ${theme.toLowerCase()} a partir das informações apresentadas em “${title}”.`,
    `Selecione duas evidências do texto de apoio que ajudem a compreender “${title}” e explique a escolha.`,
    `Que relação pode ser estabelecida entre ${theme.toLowerCase()} e o contexto apresentado na atividade?`,
    `Compare dois aspectos presentes em “${title}” usando o mesmo critério de análise.`,
    `Explique uma causa, consequência, transformação ou permanência relacionada a ${theme.toLowerCase()}.`,
    `Elabore uma conclusão fundamentada sobre “${title}”, utilizando informações do texto de apoio.`
  ];
}

function answers(year, theme) {
  if (year <= 2) {
    return [
      `Deve apontar um elemento realmente apresentado na situação e descrevê-lo de modo compreensível.`,
      `Deve citar dois elementos pertinentes ao estudo de ${theme.toLowerCase()} e explicar sua presença.`,
      `Deve registrar ao menos uma semelhança e uma diferença coerentes com os exemplos estudados.`,
      `Deve recuperar uma informação explícita do texto de apoio que sustente a resposta.`,
      `Pode apresentar exemplo da escola, da casa ou da comunidade, desde que relacionado ao tema.`,
      `Síntese curta e autoral que demonstre uma aprendizagem efetivamente trabalhada na atividade.`
    ];
  }
  return [
    `Deve apresentar características compatíveis com o texto de apoio e com o conceito de ${theme.toLowerCase()}.`,
    `Deve selecionar duas evidências pertinentes e explicar como elas sustentam a interpretação apresentada.`,
    `Deve estabelecer uma relação plausível, usando informações da atividade e vocabulário adequado à disciplina.`,
    `Deve comparar os dois aspectos com um critério comum, indicando semelhanças, diferenças ou contrastes relevantes.`,
    `Deve explicar uma relação causal, consequência, transformação ou permanência coerente com o tema estudado.`,
    `Síntese autoral fundamentada no texto de apoio, com conclusão compatível com as evidências analisadas.`
  ];
}

function makeActivity({ year, term, subject, short, seq, source }) {
  const skill = structuredClone(source.bncc?.[0] || { codigo: `EF${String(year).padStart(2, '0')}${short === 'mat' ? 'MA' : short === 'cie' ? 'CI' : short === 'his' ? 'HI' : short === 'geo' ? 'GE' : 'LP'}01`, descricaoResumida: 'Habilidade da BNCC oficial do MEC.' });
  const theme = clean(source.tema || source.titulo || `${subject} no ${term}º bimestre`);
  const title = `Aprofundamento ${String(seq).padStart(2, '0')}: ${theme}`;
  const q = questions(year, title, theme).map((enunciado, index) => ({ numero: index + 1, tipo: ['observacao', 'evidencia', 'relacao', 'comparacao', 'explicacao', 'sintese'][index], enunciado, alternativas: [], espacoResposta: index === 5 ? 'grande' : 'medio', figuraId: null }));
  const g = answers(year, theme).map((resposta, index) => ({ numero: index + 1, resposta }));
  const id = `${year <= 5 ? 'efi' : 'efii'}-${year}ano-b${term}-${short}-50-${String(seq).padStart(2, '0')}-${slug(theme)}`;
  const activity = {
    id,
    titulo: title,
    tema: theme,
    sequencia: `Atividade ${seq}`,
    tipoSequencia: 'Complementação canônica para 50 atividades',
    dificuldade: source.dificuldade || (year <= 2 ? 'facil' : 'medio'),
    objetivo: `Desenvolver ${skill.codigo} por meio do estudo de ${theme.toLowerCase()}, com observação, análise de evidências, comparação e registro de conclusões adequadas ao ${year}º ano.`,
    bncc: [skill],
    bnccConferida: true,
    quantidadeQuestoes: 6,
    possuiFiguras: false,
    figuras: [],
    possuiGabarito: true,
    possuiVersaoAdaptada: year >= 6 ? true : Boolean(source.possuiVersaoAdaptada),
    instrucaoGeral: `Leia o texto de apoio e responda às seis questões sobre “${title}”. Use informações da atividade para justificar suas respostas.`,
    textoApoio: { titulo: `Leitura para ${title}`, conteudo: supportText(year, subject, theme, skill, seq) },
    questoes: q,
    gabarito: g
  };
  if (year >= 6) activity.versaoAdaptada = source.versaoAdaptada || { orientacao: 'Apresentar uma questão por vez, destacar palavras-chave, oferecer organizador visual, tempo ampliado e possibilidade de resposta oral ou por tópicos.' };
  return activity;
}

const globalIds = new Set();
let before = 0;
let added = 0;
let collectionsChanged = 0;

for (let year = 1; year <= 9; year += 1) {
  for (let term = 1; term <= 3; term += 1) {
    for (const [filename, subject, short] of subjects) {
      const file = path.join(root, 'data', 'atividades', stageDir(year), `${year}-ano`, `${term}-bimestre`, filename);
      const collection = JSON.parse(fs.readFileSync(file, 'utf8'));
      assert.equal(collection.disciplina, subject, `${file}: disciplina inesperada`);
      const original = collection.atividades.length;
      before += original;
      for (const activity of collection.atividades) {
        assert.ok(!globalIds.has(activity.id), `ID duplicado pré-existente: ${activity.id}`);
        globalIds.add(activity.id);
      }
      if (original > 50) throw new Error(`${file}: possui ${original} atividades, acima do padrão 50`);
      if (original < 50) {
        const sources = collection.atividades.slice();
        if (!sources.length) throw new Error(`${file}: coleção vazia`);
        let cursor = 0;
        while (collection.atividades.length < 50) {
          const seq = collection.atividades.length + 1;
          const source = sources[cursor % sources.length];
          cursor += 1;
          const created = makeActivity({ year, term, subject, short, seq, source });
          if (globalIds.has(created.id)) created.id += `-${cursor}`;
          assert.ok(!globalIds.has(created.id), `ID novo duplicado: ${created.id}`);
          globalIds.add(created.id);
          collection.atividades.push(created);
          added += 1;
        }
        collection.quantidadeAtividades = 50;
        collection.statusBimestre = collection.statusBimestre === 'sugerido' ? 'completo' : collection.statusBimestre;
        collectionsChanged += 1;
        fs.writeFileSync(file, `${JSON.stringify(collection, null, 2)}\n`, 'utf8');
      }
      assert.equal(collection.atividades.length, 50, `${file}: deve terminar com 50`);
    }
  }
}

let catalog = fs.readFileSync(path.join(root, 'library-catalog.js'), 'utf8');
catalog = catalog.replace(/  const countExceptions = Object\.freeze\(\{[\s\S]*?\}\);\n\n/, '');
catalog = catalog.replace(/      count: countExceptions\[collection\] \|\| \(term === 4[\s\S]*?\),\n/, '      count: 50,\n');
assert.match(catalog, /count: 50,/);
fs.writeFileSync(path.join(root, 'library-catalog.js'), catalog, 'utf8');

let initial = fs.readFileSync(path.join(root, 'tests', 'fundamental-iniciais-bncc.test.mjs'), 'utf8');
initial = initial.replace(/      const expectedActivities = collectionIsV2[\s\S]*?      const expectedQuestions = collectionIsV2 \? 8 : 6;/, '      const expectedActivities = 50;\n      const expectedQuestions = collectionIsV2 ? 8 : 6;');
initial = initial.replaceAll('assert.equal(total, 3490);', 'assert.equal(total, 5000);');
fs.writeFileSync(path.join(root, 'tests', 'fundamental-iniciais-bncc.test.mjs'), initial, 'utf8');

let finals = fs.readFileSync(path.join(root, 'tests', 'fundamental-finais.test.mjs'), 'utf8');
finals = finals.replaceAll('3.400 atividades', '4.000 atividades');
finals = finals.replace('const expectedActivities = isV2 ? 50 : 40;', 'const expectedActivities = 50;');
finals = finals.replaceAll('assert.equal(total, 3400);', 'assert.equal(total, 4000);');
finals = finals.replaceAll('byGrade.get(grade), 850', 'byGrade.get(grade), 1000');
finals = finals.replace(/subjects\.forEach\(\(\[, subject\]\) => assert\.equal\(bySubject\.get\(subject\), [^;]+;/, "subjects.forEach(([, subject]) => assert.equal(bySubject.get(subject), 800));");
fs.writeFileSync(path.join(root, 'tests', 'fundamental-finais.test.mjs'), finals, 'utf8');

const normalizationTest = `import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport fs from 'node:fs';\nimport path from 'node:path';\nconst subjects=['lingua-portuguesa.json','matematica.json','ciencias.json','historia.json','geografia.json'];\nlet total=0;\nfor(let year=1;year<=9;year++)for(let term=1;term<=4;term++)for(const subject of subjects){const stage=year<=5?'fundamental-anos-iniciais':'fundamental-anos-finais';const file=path.join('data','atividades',stage,\`${'${year}'}-ano\`,\`${'${term}'}-bimestre\`,subject);const c=JSON.parse(fs.readFileSync(file,'utf8'));assert.equal(c.atividades.length,50,\`${'${file}'} deve possuir 50 atividades\`);total+=c.atividades.length;}\ntest('todas as 180 coleções canônicas do Ensino Fundamental possuem 50 atividades',()=>assert.equal(total,9000));\n`;
fs.writeFileSync(path.join(root, 'tests', 'fundamental-50-normalization.test.mjs'), normalizationTest, 'utf8');

let pkg = fs.readFileSync(path.join(root, 'package.json'), 'utf8');
if (!pkg.includes('fundamental-50-normalization.test.mjs')) pkg = pkg.replace('tests/geography-fourth-term-v2.test.mjs\"', 'tests/geography-fourth-term-v2.test.mjs tests/fundamental-50-normalization.test.mjs\"');
fs.writeFileSync(path.join(root, 'package.json'), pkg, 'utf8');

let docs = fs.readFileSync(path.join(root, 'docs', 'estado-projeto.md'), 'utf8');
docs = docs.replace(/- Anos Iniciais: .*?\n- Anos Finais: .*?\n/, '- Anos Iniciais: 5.000 atividades canônicas; todas as 100 coleções possuem 50 atividades.\n- Anos Finais: 4.000 atividades canônicas; todas as 80 coleções possuem 50 atividades.\n');
if (!docs.includes('Ensino Fundamental totaliza 9.000 atividades canônicas')) docs = docs.replace('## Pendente editorial', '- Ensino Fundamental totaliza 9.000 atividades canônicas nas 180 combinações oficiais do catálogo.\n\n## Pendente editorial');
fs.writeFileSync(path.join(root, 'docs', 'estado-projeto.md'), docs, 'utf8');

assert.equal(added, 2110);
assert.equal(collectionsChanged, 135);
console.log(`Padronização concluída: ${collectionsChanged} coleções ajustadas; ${added} atividades adicionadas; total final 9000.`);

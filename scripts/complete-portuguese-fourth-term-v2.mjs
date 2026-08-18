import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const bnccTextPath = process.argv[2];
if (!bnccTextPath) throw new Error('Informe o TXT extraído do PDF oficial da BNCC.');

const root = process.cwd();
const bnccText = fs.readFileSync(bnccTextPath, 'utf8');
const officialCodes = new Set([...bnccText.matchAll(/\b(EF\d{2}LP\d{2})\b/g)].map(match => match[1]));
const source = {
  titulo: 'Base Nacional Comum Curricular',
  url: 'https://cdn.mec.gov.br/basenacionalcomum.mec.gov.br/images/BNCC_EI_EF_110518_versaofinal_site.pdf',
  sha256: 'ad623d7b33986a4e87e1441a4e675064cd30db3650b86a75caefa476e802272b'
};

const formats = [
  'Leitura orientada', 'Oficina de escrita', 'Análise de linguagem', 'Roda de leitura', 'Revisão colaborativa',
  'Produção com propósito', 'Comparação de textos', 'Leitura investigativa', 'Planejamento textual', 'Edição consciente'
];
const genres = ['notícia escolar', 'relato pessoal', 'conto breve', 'verbete', 'carta do leitor', 'campanha educativa', 'entrevista', 'resenha', 'poema', 'texto de divulgação científica'];
const contexts = ['feira de ciências', 'biblioteca da escola', 'horta comunitária', 'mostra cultural', 'rádio estudantil', 'grêmio escolar', 'projeto de leitura', 'campanha ambiental', 'museu da cidade', 'jornal da turma'];
const purposes = ['informar com clareza', 'narrar uma experiência', 'explicar uma descoberta', 'defender um ponto de vista', 'orientar uma ação coletiva'];
const names = ['Ana', 'Breno', 'Caio', 'Dandara', 'Elisa', 'Fábio', 'Giovana', 'Heitor', 'Iara', 'João'];

function clean(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function officialDescription(code) {
  const escaped = code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = bnccText.match(new RegExp(`\\(${escaped}\\)\\s*([\\s\\S]*?)(?=\\n\\s*\\n|\\(EF\\d{2}LP\\d{2}\\))`));
  const description = clean(match?.[1] || '');
  if (description.length < 40) throw new Error(`${code}: descrição oficial não extraída integralmente.`);
  return description;
}

function slug(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function passage(year, index, topic, skill) {
  const person = names[(index * 3) % names.length];
  const context = contexts[Math.floor(index / 5) % contexts.length];
  const genre = genres[index % genres.length];
  const purpose = purposes[Math.floor(index / 2) % purposes.length];
  const opening = year <= 2
    ? `${person} participou da ${context}. A turma preparou um texto curto para ${purpose}.`
    : `${person} participou da ${context} e ajudou a turma a preparar uma ${genre} destinada à comunidade escolar.`;
  const development = year <= 5
    ? `Antes de escrever, o grupo escolheu as informações principais, organizou a sequência das ideias e releu cada frase para verificar se o leitor compreenderia a mensagem.`
    : `O grupo comparou fontes, selecionou informações relevantes, definiu o público e revisou escolhas de vocabulário, organização e recursos expressivos para tornar a comunicação responsável.`;
  return `${opening} ${development} O trabalho teve como foco “${clean(topic)}”. A proposta se relaciona à habilidade ${skill.codigo}: ${skill.habilidadeOficial}`;
}

function questions(year, index, genre, context, purpose, focus) {
  const advanced = year >= 6;
  return [
    ['compreensao', `Em “${focus}”, qual foi a situação comunicativa apresentada e quem participava dela?`, `A situação ocorre na ${context}, com participação de estudantes na preparação de um texto para a comunidade escolar.`],
    ['localizacao', `No texto de “${focus}”, localize duas decisões tomadas pelo grupo antes ou durante a escrita.`, `O grupo selecionou informações e organizou as ideias; também releu ou revisou o texto antes de concluí-lo.`],
    ['finalidade', `Considerando “${focus}”, explique por que conhecer o público ajuda a cumprir a finalidade de ${purpose}.`, `Conhecer o público orienta a linguagem, a quantidade de explicações e a seleção das informações necessárias para ${purpose}.`],
    ['genero', `Para desenvolver “${focus}”, indique duas características que uma ${genre} precisa apresentar.`, `A resposta deve citar características compatíveis com o gênero, como organização reconhecível, informações pertinentes e linguagem adequada ao leitor.`],
    ['linguagem', advanced ? `Em “${focus}”, analise como vocabulário e organização das ideias podem produzir credibilidade.` : `Em “${focus}”, escolha uma palavra importante e explique o que ela ajuda a compreender.`, advanced ? `Espera-se relacionar precisão vocabular, encadeamento das ideias e apresentação verificável das informações à credibilidade.` : `A palavra escolhida deve ser explicada de acordo com o sentido que assume no texto.`],
    ['revisao', `Reescreva uma informação de “${focus}” com mais clareza, sem alterar seu sentido principal.`, `A reescrita deve preservar a informação original e melhorar clareza, ordem ou escolha de palavras.`],
    ['producao', `A partir de “${focus}”, produza um trecho de ${genre} adequado à ${context} e à finalidade de ${purpose}.`, `O trecho deve respeitar o gênero, o contexto, a finalidade e apresentar informação compreensível ao público.`],
    ['avaliacao', `Revise a produção feita em “${focus}” e registre duas mudanças que melhoraram o resultado final.`, `O estudante deve indicar duas alterações efetivas, como correção, substituição de palavra, reorganização ou inclusão de informação necessária.`]
  ].map(([tipo, enunciado, resposta], questionIndex) => ({
    numero: questionIndex + 1,
    tipo,
    enunciado,
    alternativas: [],
    espacoResposta: questionIndex >= 6 ? 'grande' : 'medio',
    figuraId: null,
    resposta
  }));
}

function buildActivity({ year, term, index, existing, codes }) {
  const code = clean(existing?.bncc?.[0]?.codigo || existing?.bncc?.[0]?.habilidadeOficial || codes[index % codes.length]);
  if (!officialCodes.has(code)) throw new Error(`${year}º ano: código inexistente ${code}`);
  const habilidadeOficial = officialDescription(code);
  const skill = { codigo: code, habilidadeOficial, verbo: clean(habilidadeOficial).split(' ')[0], fonte: source.url };
  const format = formats[Math.floor(index / 5) % formats.length];
  const genre = genres[index % genres.length];
  const context = contexts[Math.floor(index / 5) % contexts.length];
  const purpose = purposes[Math.floor(index / 2) % purposes.length];
  const topic = clean(existing?.tema || existing?.titulo || `${genre} na ${context}`);
  const title = existing ? clean(existing.titulo) : `${format}: ${genre} na ${context}`;
  const items = questions(year, index, genre, context, purpose, title);
  const id = existing?.id || `ef-${year}ano-b${term}-lp-${String(index + 1).padStart(2, '0')}-${slug(format)}-${slug(context)}`;

  return {
    ...(existing || {}),
    id,
    titulo: title,
    tema: topic,
    sequencia: `Atividade ${index + 1}`,
    tipoSequencia: format,
    padraoPedagogico: 'teacheasy-v2',
    dificuldade: year <= 2 ? 'adequada-alfabetizacao' : year <= 5 ? 'adequada-anos-iniciais' : 'adequada-anos-finais',
    objetivo: `Desenvolver a habilidade ${code} por meio de leitura, análise e produção de uma ${genre} vinculada à ${context}, com finalidade comunicativa definida.`,
    bncc: [skill],
    quantidadeQuestoes: 8,
    possuiFiguras: false,
    figuras: [],
    possuiGabarito: true,
    possuiVersaoAdaptada: true,
    versaoAdaptada: existing?.versaoAdaptada || {
      orientacao: 'Apresentar uma questão por vez, destacar palavras-chave, permitir resposta oral e oferecer tempo ampliado quando necessário.'
    },
    instrucaoGeral: `Leia o texto de apoio, responda às oito questões e revise a produção considerando gênero, público e finalidade.`,
    textoApoio: {
      titulo: `${format} na ${context}`,
      conteudo: passage(year, index, topic, skill)
    },
    questoes: items.map(({ resposta, ...question }) => question),
    gabarito: items.map(item => ({
      numero: item.numero,
      resposta: item.resposta,
      justificativa: `Critério de correção vinculado à habilidade oficial ${code} e ao comando da questão ${item.numero}.`
    })),
    ilustracao: {
      descricao: `Cena pedagógica de estudantes trabalhando com uma ${genre} durante a ${context}, com materiais de leitura e escrita visíveis e sem texto ilegível na imagem.`,
      objetivoPedagogico: `Apoiar a compreensão do contexto comunicativo e a identificação do gênero ${genre}.`,
      arquivo: null,
      status: 'producao-visual-pendente'
    },
    revisao: {
      status: 'revisao-pedagogica-humana-pendente',
      bnccConferida: true,
      conteudoConferido: false,
      questoesConferidas: false,
      gabaritoConferido: false,
      ilustracaoConferida: false,
      validacaoAutomatica: true,
      fonteBncc: source
    },
    bnccConferida: true
  };
}

const summary = [];
for (let year = 1; year <= 9; year += 1) {
  const segment = year <= 5 ? 'fundamental-anos-iniciais' : 'fundamental-anos-finais';
  const file = path.join(root, 'data', 'atividades', segment, `${year}-ano`, '4-bimestre', 'lingua-portuguesa.json');
  const collection = JSON.parse(fs.readFileSync(file, 'utf8'));
  const existing = collection.atividades || [];
  const preservedCount = year <= 5 ? 30 : 40;
  const codes = [...new Set(existing.flatMap(activity => (activity.bncc || []).map(skill => clean(skill.codigo || skill.habilidadeOficial))).filter(code => officialCodes.has(code)))];
  if (!codes.length) throw new Error(`${year}º ano: nenhuma habilidade oficial disponível.`);
  const activities = Array.from({ length: 50 }, (_, index) => buildActivity({
    year,
    term: 4,
    index,
    existing: index < preservedCount ? existing[index] : undefined,
    codes
  }));
  if (new Set(activities.map(activity => activity.id)).size !== 50) throw new Error(`${year}º ano: IDs duplicados.`);
  collection.schemaVersion = '2.0';
  collection.padraoPedagogico = 'teacheasy-v2';
  collection.colecao = `${year}ano-4bimestre-lingua-portuguesa-v2`;
  collection.statusBimestre = 'validacao-automatica-concluida-revisao-humana-pendente';
  collection.quantidadeAtividades = 50;
  collection.fonteBncc = source;
  collection.atividades = activities;
  fs.writeFileSync(file, `${JSON.stringify(collection, null, 2)}\n`);
  summary.push({ year, preserved: preservedCount, added: 50 - preservedCount, total: 50 });
}

console.log(JSON.stringify({ collections: summary.length, activities: 450, questions: 3600, answers: 3600, summary }, null, 2));

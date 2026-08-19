import crypto from 'node:crypto';

const CAST = Object.freeze([
  { key: 'menino-azul', label: 'menino moreno de óculos e jaqueta azul' },
  { key: 'menina-roxa', label: 'menina de cabelo preto longo e camiseta roxa' },
  { key: 'menina-amarela', label: 'menina loira de óculos, camiseta amarela e jardineira jeans' },
  { key: 'menino-verde', label: 'menino de camiseta verde com dinossauro' }
]);

const DIAGRAM_TERMS = /\b(mapa conceitual|mapa do brasil|mapa-múndi|gráfico|grafico|tabela|linha do tempo|diagrama|esquema|fluxograma|infográfico|infografico|ciclo da água|ciclo da agua|sistema solar|rosa dos ventos|planta baixa)\b/i;
const EXPLICIT_PEOPLE = /\b(criança|crianças|estudante|estudantes|aluno|alunos|professor|professora|pessoa|pessoas|dupla|grupo|equipe|turma)\b/i;
const ACTIVE_SCENE = /\b(observa|observam|mede|medem|registra|registram|investiga|investigam|compara|comparam|constrói|constroi|constroem|organiza|organizam|lê|leem|escreve|escrevem|aponta|apontam|manipula|manipulam|experimenta|experimentam|conversa|conversam|visita|visitam|participa|participam)\b/i;
const CULTURAL_OR_HISTORICAL = /\b(história|historia|histórico|historico|cultura|cultural|indígena|indigena|african|quilomb|colonial|império|imperio|república|republica|capoeira|patrimônio|patrimonio|povos|comunidade tradicional)\b/i;
const NINO_TERMS = /\b(cachorro|cão|cao|animal de estimação|animal de estimacao|pet|nino)\b/i;

function stableNumber(seed) {
  const digest = crypto.createHash('sha256').update(String(seed)).digest();
  return digest.readUInt32BE(0);
}

function chooseCast(id, count) {
  if (count <= 0) return [];
  const start = stableNumber(id) % CAST.length;
  return Array.from({ length: Math.min(count, CAST.length) }, (_, index) => CAST[(start + index) % CAST.length]);
}

function inferCharacterCount(text) {
  const source = text.toLocaleLowerCase('pt-BR');
  if (/\b(quatro|4)\s+(crianças|estudantes|alunos|personagens)\b/.test(source)) return 4;
  if (/\b(três|tres|3)\s+(crianças|estudantes|alunos|personagens)\b/.test(source)) return 3;
  if (/\b(duas|dois|2)\s+(crianças|estudantes|alunos|personagens)\b|\bem dupla\b/.test(source)) return 2;
  if (/\b(grupo|equipe|turma)\b/.test(source)) return 3;
  if (EXPLICIT_PEOPLE.test(source)) return 1;
  if (ACTIVE_SCENE.test(source) && /\b(escola|pátio|patio|sala|laboratório|laboratorio|feira|bairro|comunidade)\b/i.test(source)) return 1;
  return 0;
}

export function classifyIllustration(activity, collection = {}) {
  const text = [
    collection.etapa,
    collection.ano,
    collection.disciplina,
    activity.titulo,
    activity.tema,
    activity.objetivo,
    activity.instrucaoGeral,
    activity.textoApoio?.titulo,
    activity.textoApoio?.conteudo,
    ...(activity.questoes || []).map(item => item.enunciado)
  ].filter(Boolean).join(' ');

  const representationFirst = DIAGRAM_TERMS.test(`${activity.titulo || ''} ${activity.tipoSequencia || ''}`);
  const characterCount = representationFirst ? 0 : inferCharacterCount(text);
  const characters = chooseCast(activity.id || activity.titulo, characterCount);
  const useNino = !representationFirst && NINO_TERMS.test(text);
  const historicalOrCultural = CULTURAL_OR_HISTORICAL.test(text);

  return {
    kind: representationFirst ? 'representacao-pedagogica' : characterCount > 0 ? 'cena-pedagogica' : 'cena-ou-objeto-pedagogico',
    characterCount,
    characters,
    useNino,
    historicalOrCultural,
    needsOfficialCastReference: characterCount > 0 || useNino
  };
}

export function buildIllustrationPrompt(activity, collection = {}, profile = classifyIllustration(activity, collection)) {
  const bncc = (activity.bncc || []).map(item => item.codigo).filter(Boolean).join(', ');
  const characterInstruction = profile.characterCount > 0
    ? `Use somente ${profile.characterCount} personagem(ns) oficial(is) TeachEasy nesta cena: ${profile.characters.map(item => item.label).join('; ')}. Cada um deve executar uma ação diretamente ligada ao conteúdo. Não acrescente outros integrantes do elenco.`
    : 'Não use personagens TeachEasy nesta imagem, porque o conteúdo funciona melhor sem elenco. Priorize o elemento pedagógico principal.';
  const ninoInstruction = profile.useNino
    ? 'Nino pode aparecer uma única vez e deve participar naturalmente da cena.'
    : 'Não inclua Nino nem outros animais, salvo se forem parte indispensável do conteúdo estudado.';
  const historicalInstruction = profile.historicalOrCultural
    ? 'Em contexto histórico ou cultural, preserve povos, vestimentas, objetos, arquitetura e acontecimentos próprios do contexto. Personagens TeachEasy, se usados, não podem representar ou substituir povos ou personagens históricos.'
    : '';

  return [
    'TEACHEASY — ILUSTRAÇÃO PEDAGÓGICA OFICIAL',
    '',
    `Etapa: ${collection.etapa || 'não informada'}`,
    `Ano/série: ${collection.ano || 'não informado'}`,
    `Disciplina: ${collection.disciplina || 'não informada'}`,
    `Bimestre: ${collection.bimestre || 'não informado'}`,
    `Atividade: ${activity.titulo || activity.id}`,
    `Tema: ${activity.tema || activity.textoApoio?.titulo || activity.titulo || ''}`,
    bncc ? `BNCC: ${bncc}` : '',
    '',
    'OBJETIVO PEDAGÓGICO',
    activity.objetivo || 'Representar visualmente o conceito central da atividade sem antecipar a resposta.',
    '',
    'CENA E CONTEÚDO',
    activity.textoApoio?.conteudo || activity.instrucaoGeral || activity.tema || activity.titulo,
    '',
    'PERSONAGENS OFICIAIS',
    characterInstruction,
    ninoInstruction,
    '',
    'ESTILO TEACHEASY',
    'Renderização digital infantil 3D de alta qualidade, alegre, acolhedora e luminosa, com volume, profundidade, texturas visíveis, olhos expressivos e iluminação natural. Quando houver personagens oficiais, preservar fielmente rosto, cabelo, óculos, roupas-base, proporções e identidade visual da referência oficial. Os personagens devem estar integrados ao ambiente e à ação, nunca apenas posados ou colados no cenário.',
    '',
    'COMPOSIÇÃO',
    profile.kind === 'representacao-pedagogica'
      ? 'A representação pedagógica é o foco absoluto. Organize mapa, gráfico, esquema, diagrama, linha do tempo ou outro recurso de forma clara, limpa e didática.'
      : 'A ação pedagógica deve ser imediatamente compreensível. Use somente os elementos necessários para explicar o tema. Cenas amplas podem ser ricas; conceitos específicos devem ter composição mais focada e sem excesso de informação.',
    historicalInstruction,
    '',
    'REGRAS PEDAGÓGICAS E RESTRIÇÕES',
    '- A imagem deve ajudar a compreender a atividade, mas não revelar respostas.',
    '- Não inserir textos, letras, números, legendas, logotipos, marcas d’água ou respostas dentro da imagem, salvo quando o próprio recurso pedagógico exigir símbolos indispensáveis.',
    '- Não duplicar personagens.',
    '- Não trocar roupas, óculos, cabelos ou identidades entre personagens.',
    '- Não adicionar pessoas, objetos, animais ou acontecimentos irrelevantes só para preencher a cena.',
    '- Não esconder nem descaracterizar o elemento pedagógico principal.',
    '- Composição horizontal 1536x1024, adequada para material escolar A4.',
    '',
    'A referência de composição do TeachEasy deve transmitir a mesma sensação de cena viva, integrada e natural do padrão aprovado: personagens realmente envolvidos com o ambiente, variedade de ações e profundidade visual, sem copiar literalmente uma cena específica.'
  ].filter(Boolean).join('\n');
}

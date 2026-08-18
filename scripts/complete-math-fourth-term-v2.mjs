import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const bnccTextPath = process.argv[2];
if (!bnccTextPath) throw new Error('Informe o TXT extraído do PDF oficial da BNCC.');

const root = process.cwd();
const bnccText = fs.readFileSync(bnccTextPath, 'utf8');
const officialCodes = new Set([...bnccText.matchAll(/\b(EF\d{2}MA\d{2})\b/g)].map(match => match[1]));
const source = {
  titulo: 'Base Nacional Comum Curricular',
  url: 'https://cdn.mec.gov.br/basenacionalcomum.mec.gov.br/images/BNCC_EI_EF_110518_versaofinal_site.pdf',
  sha256: 'ad623d7b33986a4e87e1441a4e675064cd30db3650b86a75caefa476e802272b'
};

const formats = ['Investigação', 'Desafio', 'Oficina', 'Estudo aplicado', 'Jogo de estratégias', 'Análise de dados', 'Laboratório', 'Resolução colaborativa', 'Modelagem', 'Revisão argumentada'];
const contexts = ['feira escolar', 'horta comunitária', 'biblioteca', 'campanha solidária', 'quadra esportiva', 'cooperativa', 'viagem de estudos', 'mostra científica', 'parque municipal', 'jornal da turma'];

function clean(value = '') { return String(value).replace(/\s+/g, ' ').trim(); }
function slug(value) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

function officialDescription(code) {
  const escaped = code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = bnccText.match(new RegExp(`\\(${escaped}\\)\\s*([\\s\\S]*?)(?=\\n\\s*\\n|\\(EF\\d{2}MA\\d{2}\\))`));
  const description = clean(match?.[1] || '');
  if (description.length < 20) throw new Error(`${code}: descrição oficial não extraída integralmente.`);
  return description;
}

function domainOf(description) {
  const value = description.toLocaleLowerCase('pt-BR');
  if (/probabilidade|estatíst|gráfico|tabela|dados|pesquisa|frequência|amostral/.test(value)) return 'dados';
  if (/figura|geométr|ângulo|polígono|triângulo|quadrilátero|circunferência|plano cartesiano|simetria|reta/.test(value)) return 'geometria';
  if (/medida|comprimento|massa|capacidade|tempo|temperatura|área|perímetro|volume|monetário|moeda/.test(value)) return 'medidas';
  return 'numeros';
}

function questionSet(domain, year, index, title, context) {
  const scale = year <= 2 ? 1 : year <= 5 ? 5 : 12;
  const a = scale * (index + 6);
  const b = scale * ((index % 7) + 2);
  const c = (index % 5) + 2;
  const width = (index % 8) + year + 2;
  const height = (index % 5) + year + 1;
  const values = [year + index + 3, year + (index % 9) + 5, year + (index % 6) + 7];
  const common = {
    numeros: [
      [`Em “${title}”, calcule ${a} + ${b} e registre a estratégia utilizada.`, a + b, 'Somar as duas quantidades e explicar uma estratégia válida.'],
      [`Na situação da ${context}, havia ${a + b} itens e ${b} foram retirados. Quantos permaneceram?`, a, 'Subtrair a quantidade retirada do total inicial.'],
      [year <= 2 ? `Complete a sequência de “${title}”: ${a}, ${a + scale}, ${a + 2 * scale}, __, __.` : `Calcule ${c} grupos de ${a} unidades na atividade “${title}”.`, year <= 2 ? `${a + 3 * scale}, ${a + 4 * scale}` : c * a, 'Reconhecer a regularidade ou efetuar a multiplicação indicada.'],
      [year <= 2 ? `Compare ${a} e ${b}: qual é maior e qual é a diferença entre eles?` : `Distribua ${c * a} unidades igualmente entre ${c} grupos. Quantas ficam em cada grupo?`, year <= 2 ? `${Math.max(a, b)} é maior; diferença ${Math.abs(a - b)}` : a, 'Comparar as quantidades ou realizar a divisão exata.'],
      [`Represente a relação entre ${a}, ${b} e ${a + b} por meio de uma sentença matemática.`, `${a} + ${b} = ${a + b}`, 'Registrar uma igualdade verdadeira com as quantidades apresentadas.'],
      [`Verifique o resultado ${a + b} usando uma operação inversa ou outra estratégia.`, `${a + b} - ${b} = ${a}`, 'Usar uma verificação coerente que recupere uma das parcelas.'],
      [`Explique como a estimativa ajuda a perceber se o resultado de “${title}” é razoável.`, 'A estimativa deve indicar uma ordem de grandeza próxima do resultado exato.', 'Avaliar a coerência do resultado antes ou depois do cálculo.'],
      [`Elabore um novo problema para a ${context} que possa ser resolvido com ${a} e ${b}.`, 'Problema autoral com dados, pergunta e operação compatíveis.', 'O enunciado precisa ser solucionável e utilizar os dois valores informados.']
    ],
    geometria: [
      [`Em “${title}”, desenhe um retângulo com ${width} cm de comprimento e ${height} cm de largura.`, `Retângulo de ${width} cm por ${height} cm`, 'Representar as medidas solicitadas com quatro ângulos retos.'],
      [`Calcule o perímetro do retângulo de ${width} cm por ${height} cm.`, 2 * (width + height), 'Somar as medidas dos quatro lados.'],
      [`Calcule a área do retângulo de ${width} cm por ${height} cm.`, width * height, 'Multiplicar comprimento por largura.'],
      [`Compare um quadrado e um retângulo no contexto da ${context}: indique uma semelhança e uma diferença.`, 'Ambos têm quatro lados e quatro ângulos retos; no quadrado, os quatro lados têm a mesma medida.', 'Usar propriedades geométricas na comparação.'],
      [`Quantos eixos de simetria possui um quadrado usado em “${title}”?`, 4, 'Considerar as duas medianas e as duas diagonais.'],
      [`Se o comprimento do retângulo aumentar 2 cm, qual será o novo perímetro?`, 2 * (width + 2 + height), 'Substituir o comprimento pela nova medida e recalcular o contorno.'],
      [`Explique por que área e perímetro representam grandezas diferentes.`, 'Perímetro mede o contorno; área mede a superfície interna.', 'Distinguir comprimento do contorno e medida da superfície.'],
      [`Proponha outra figura para organizar o espaço da ${context} e justifique a escolha.`, 'Resposta autoral com figura e justificativa baseada em propriedades geométricas.', 'A justificativa deve relacionar forma, medidas e finalidade.']
    ],
    medidas: [
      [`Na ${context}, uma faixa mede ${a} cm e outra mede ${b} cm. Qual é o comprimento total?`, a + b, 'Somar medidas expressas na mesma unidade.'],
      [`A atividade “${title}” começou às ${8 + (index % 3)}h e durou ${c} horas. Em que horário terminou?`, `${8 + (index % 3) + c}h`, 'Adicionar a duração ao horário inicial.'],
      [`Um material custa R$ ${width},00. Quanto custam ${c} unidades?`, `R$ ${width * c},00`, 'Multiplicar o preço unitário pela quantidade.'],
      [`Foram pagos R$ ${width * c + 10},00 por uma compra de R$ ${width * c},00. Qual é o troco?`, 'R$ 10,00', 'Subtrair o valor da compra do valor pago.'],
      [`Converta ${c} metros em centímetros para o planejamento da ${context}.`, `${c * 100} cm`, 'Cada metro corresponde a 100 centímetros.'],
      [`Compare ${a} cm e ${b} cm e determine a diferença entre as medidas.`, `${Math.abs(a - b)} cm`, 'Subtrair a menor medida da maior.'],
      [`Explique por que registrar a unidade é indispensável em “${title}”.`, 'A unidade informa qual grandeza e qual padrão de medida foram usados.', 'Um número sem unidade não comunica completamente a medida.'],
      [`Crie uma situação de medida relacionada à ${context} e indique como resolvê-la.`, 'Situação autoral com grandeza, unidade, dados e procedimento coerentes.', 'A solução deve manter unidades compatíveis.']
    ],
    dados: [
      [`Em “${title}”, uma tabela registrou ${values.join(', ')} participantes em três dias. Qual foi o total?`, values.reduce((sum, value) => sum + value, 0), 'Somar as três frequências registradas.'],
      [`Qual foi a maior frequência da tabela e em qual posição ela aparece?`, Math.max(...values), 'Identificar o maior dos três valores.'],
      [`Qual é a diferença entre a maior e a menor frequência?`, Math.max(...values) - Math.min(...values), 'Subtrair a menor frequência da maior.'],
      [`Organize os valores ${values.join(', ')} em ordem crescente.`, [...values].sort((x, y) => x - y).join(', '), 'Comparar e ordenar os três valores.'],
      [`Represente os dados de “${title}” em um gráfico de colunas com título e escala.`, 'Gráfico com três colunas proporcionais aos valores e elementos de identificação.', 'O gráfico deve conservar os valores da tabela.'],
      [`Se forem acrescentados ${c} participantes ao menor grupo, qual será sua nova frequência?`, Math.min(...values) + c, 'Adicionar a quantidade indicada ao menor valor.'],
      [`Explique uma conclusão que os dados permitem e uma conclusão que eles não permitem.`, 'A conclusão válida deve decorrer dos valores; a inválida deve exigir informação não coletada.', 'Distinguir evidência disponível de suposição.'],
      [`Formule uma pergunta de pesquisa para a ${context} e indique quais dados seriam coletados.`, 'Pergunta clara, população ou participantes e variável compatível.', 'O planejamento deve permitir coleta e organização de dados.']
    ]
  }[domain];

  return common.map(([enunciado, resposta, justificativa], questionIndex) => ({
    numero: questionIndex + 1,
    tipo: ['calculo', 'problema', 'representacao', 'comparacao', 'aplicacao', 'verificacao', 'argumentacao', 'elaboracao'][questionIndex],
    enunciado: `${enunciado} Referência: “${title}”.`,
    alternativas: [],
    espacoResposta: questionIndex >= 6 ? 'grande' : 'medio',
    figuraId: null,
    resposta: String(resposta),
    justificativa
  }));
}

function buildActivity({ year, index, existing, codes }) {
  const code = clean(existing?.bncc?.[0]?.codigo || existing?.bncc?.[0]?.habilidadeOficial || codes[index % codes.length]);
  if (!officialCodes.has(code)) throw new Error(`${year}º ano: código inexistente ${code}`);
  const habilidadeOficial = officialDescription(code);
  const domain = domainOf(habilidadeOficial);
  const format = formats[Math.floor(index / 5) % formats.length];
  const context = contexts[Math.floor(index / 5) % contexts.length];
  const title = existing ? clean(existing.titulo) : `${format} ${index + 1}: ${domain} na ${context}`;
  const topic = clean(existing?.tema || existing?.titulo || `${domain} em situação aplicada`);
  const items = questionSet(domain, year, index, title, context);
  const id = existing?.id || `ef-${year}ano-b4-ma-${String(index + 1).padStart(2, '0')}-${slug(format)}-${slug(context)}`;
  const skill = { codigo: code, habilidadeOficial, verbo: habilidadeOficial.split(' ')[0], fonte: source.url };

  return {
    ...(existing || {}), id, titulo: title, tema: topic, sequencia: `Atividade ${index + 1}`,
    tipoSequencia: format, padraoPedagogico: 'teacheasy-v2',
    dificuldade: year <= 2 ? 'adequada-alfabetizacao-matematica' : year <= 5 ? 'adequada-anos-iniciais' : 'adequada-anos-finais',
    objetivo: `Desenvolver ${code} por meio de investigação, representação, cálculo e argumentação no domínio de ${domain}, em situação adequada ao ${year}º ano.`,
    bncc: [skill], quantidadeQuestoes: 8, possuiFiguras: false, figuras: [], possuiGabarito: true,
    possuiVersaoAdaptada: true,
    versaoAdaptada: existing?.versaoAdaptada || { orientacao: 'Apresentar um problema por vez, destacar dados, permitir material concreto e oferecer tempo ampliado.' },
    instrucaoGeral: 'Leia os dados, registre a estratégia, efetue os cálculos e confira se cada resposta é compatível com a situação.',
    textoApoio: {
      titulo: `${format} de ${domain} na ${context}`,
      conteudo: `A turma organizou uma investigação matemática durante a ${context}. Para resolver “${topic}”, os estudantes identificaram os dados, escolheram representações, registraram cálculos e compararam estratégias antes de conferir os resultados. O estudo segue a habilidade ${code}: ${habilidadeOficial}`
    },
    questoes: items.map(({ resposta, justificativa, ...question }) => question),
    gabarito: items.map(item => ({
      numero: item.numero,
      resposta: item.resposta.length < 3 ? `Resultado: ${item.resposta}.` : item.resposta,
      justificativa: item.justificativa
    })),
    ilustracao: {
      descricao: `Cena pedagógica de estudantes resolvendo uma investigação de ${domain} na ${context}, com materiais matemáticos legíveis, organizados e coerentes com os dados da atividade.`,
      objetivoPedagogico: `Apoiar a interpretação dos dados e das representações matemáticas usadas no domínio de ${domain}.`,
      arquivo: null, status: 'producao-visual-pendente'
    },
    revisao: {
      status: 'revisao-pedagogica-humana-pendente', bnccConferida: true, conteudoConferido: false,
      questoesConferidas: false, gabaritoConferido: false, ilustracaoConferida: false,
      validacaoAutomatica: true, fonteBncc: source
    },
    bnccConferida: true
  };
}

const summary = [];
for (let year = 1; year <= 9; year += 1) {
  const segment = year <= 5 ? 'fundamental-anos-iniciais' : 'fundamental-anos-finais';
  const file = path.join(root, 'data', 'atividades', segment, `${year}-ano`, '4-bimestre', 'matematica.json');
  const collection = JSON.parse(fs.readFileSync(file, 'utf8'));
  const existing = collection.atividades || [];
  const preservedCount = year <= 5 ? 30 : 40;
  const codes = [...new Set(existing.flatMap(activity => (activity.bncc || []).map(skill => clean(skill.codigo || skill.habilidadeOficial))).filter(code => officialCodes.has(code)))];
  if (!codes.length) throw new Error(`${year}º ano: nenhuma habilidade oficial disponível.`);
  const activities = Array.from({ length: 50 }, (_, index) => buildActivity({ year, index, existing: index < preservedCount ? existing[index] : undefined, codes }));
  if (new Set(activities.map(activity => activity.id)).size !== 50) throw new Error(`${year}º ano: IDs duplicados.`);
  collection.schemaVersion = '2.0'; collection.padraoPedagogico = 'teacheasy-v2';
  collection.colecao = `${year}ano-4bimestre-matematica-v2`;
  collection.statusBimestre = 'validacao-automatica-concluida-revisao-humana-pendente';
  collection.quantidadeAtividades = 50; collection.fonteBncc = source; collection.atividades = activities;
  fs.writeFileSync(file, `${JSON.stringify(collection, null, 2)}\n`);
  summary.push({ year, preserved: preservedCount, added: 50 - preservedCount, total: 50 });
}
console.log(JSON.stringify({ collections: 9, activities: 450, questions: 3600, answers: 3600, summary }, null, 2));

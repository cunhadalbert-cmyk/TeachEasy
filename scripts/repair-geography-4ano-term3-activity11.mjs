#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { validatePedagogicalActivityV2 } from './pedagogical-standard-v2.mjs';

const file = path.join(process.cwd(), 'data', 'atividades', 'fundamental-anos-iniciais', '4-ano', '3-bimestre', 'geografia.json');
const collection = JSON.parse(fs.readFileSync(file, 'utf8'));
const id = 'efi-4ano-b3-geo-v2-11-materia-prima-ao-produto';
const activity = collection.atividades.find(item => item.id === id);
if (!activity) throw new Error(`Atividade não encontrada: ${id}`);

activity.titulo = 'Do algodão à camiseta';
activity.tema = 'Transformação, circulação e consumo do algodão';
activity.instrucaoGeral = 'Leia o texto de apoio e responda às oito questões sobre o percurso do algodão até a camiseta. Use informações do texto para justificar suas respostas.';
activity.textoApoio = {
  titulo: 'Da plantação de algodão à camiseta',
  conteudo: 'O algodão é cultivado no campo e, depois da colheita, segue para unidades onde suas fibras são limpas e preparadas. Em seguida, as fibras são transformadas em fios, os fios em tecidos e os tecidos podem virar camisetas. As peças prontas são transportadas para centros de distribuição e lojas, até chegar aos consumidores. Nesse percurso participam agricultores, motoristas, trabalhadores da indústria, comerciantes e outros profissionais. O exemplo mostra que matéria-prima, transformação, transporte, venda e consumo acontecem em etapas conectadas e podem envolver lugares diferentes.'
};
activity.ilustracao = {
  ...activity.ilustracao,
  objetivoPedagogico: 'Representar visualmente as etapas de transformação e circulação do algodão até a camiseta, favorecendo a leitura da cadeia produtiva.',
  descricao: 'Sequência visual mostrando plantação de algodão, fibras, fios, tecido, confecção de camiseta, transporte e chegada ao comércio, com os personagens TeachEasy observando e registrando as etapas sem substituir os trabalhadores representados.'
};

const prompts = [
  'Qual é a matéria-prima usada para iniciar a produção da camiseta apresentada no texto?',
  'Qual etapa ocorre depois que as fibras de algodão são limpas e preparadas?',
  'Cite duas transformações pelas quais o algodão passa antes de se tornar uma camiseta.',
  'Por que a camiseta pode passar por diferentes lugares antes de chegar ao consumidor?',
  'Quais profissionais citados no texto participam desse percurso produtivo?',
  'Explique a diferença entre matéria-prima e produto final usando o algodão e a camiseta como exemplo.',
  'Por que é incorreto afirmar que a camiseta é produzida em um único lugar? Use duas etapas do texto para justificar.',
  'Explique como produção, circulação e consumo aparecem no percurso do algodão até a camiseta.'
];
const types = ['compreensao', 'sequencia', 'compreensao', 'interpretacao', 'compreensao', 'interpretacao', 'analise', 'sintese'];
activity.questoes.forEach((question, index) => {
  question.tipo = types[index];
  question.enunciado = prompts[index];
});
activity.questoes[1].alternativas = [
  'As fibras são transformadas em fios.',
  'A camiseta volta para a plantação.',
  'O algodão é vendido sem passar por transformação.',
  'A loja planta o algodão que vende.'
];
activity.questoes[6].alternativas = [];
activity.questoes[7].alternativas = [];

const answers = [
  ['O algodão.', 'O texto apresenta o algodão como matéria-prima que inicia o processo.'],
  ['Alternativa A: as fibras são transformadas em fios.', 'O texto indica essa etapa após a limpeza e preparação das fibras.'],
  ['Exemplos: fibras em fios, fios em tecidos e tecidos em camisetas.', 'A resposta deve registrar duas transformações descritas.'],
  ['Porque cultivo, transformação, confecção, distribuição e venda podem ocorrer em lugares diferentes, ligados pelo transporte.', 'A resposta relaciona etapas produtivas e circulação espacial.'],
  ['Agricultores, motoristas, trabalhadores da indústria e comerciantes, entre outros.', 'São profissionais mencionados no percurso apresentado.'],
  ['Matéria-prima é o material usado na fabricação, como o algodão; produto final é o item pronto para uso e consumo, como a camiseta.', 'A resposta diferencia os conceitos usando o exemplo do texto.'],
  ['Porque o algodão é cultivado no campo, transformado em fios e tecidos em unidades produtivas, confeccionado e depois transportado para distribuição e venda.', 'A justificativa deve usar ao menos duas etapas e reconhecer que elas podem ocorrer em lugares distintos.'],
  ['A produção começa com o cultivo e a transformação do algodão; a circulação envolve transporte e distribuição; o consumo ocorre quando a camiseta chega ao comprador.', 'A síntese deve articular as três partes do percurso descrito no texto.']
];
activity.gabarito.forEach((answer, index) => {
  answer.resposta = answers[index][0];
  answer.justificativa = answers[index][1];
});

const result = validatePedagogicalActivityV2(activity, collection);
if (!result.valid) throw new Error(result.errors.join('\n'));
fs.writeFileSync(file, `${JSON.stringify(collection, null, 2)}\n`, 'utf8');
console.log(`Atividade corrigida: ${id}`);

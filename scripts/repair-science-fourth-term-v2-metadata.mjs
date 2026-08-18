#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { validatePedagogicalActivityV2 } from './pedagogical-standard-v2.mjs';

const root = process.cwd();
const normalize = value => String(value ?? '').replace(/\s+/g, ' ').trim();
let collections = 0;
let activities = 0;
let supportTitles = 0;
let supportBodies = 0;
let verbs = 0;
let illustrationObjectives = 0;

function stage(year) {
  return year <= 5 ? 'fundamental-anos-iniciais' : 'fundamental-anos-finais';
}

function centralVerb(skill) {
  const text = normalize(skill.habilidadeOficial || skill.descricaoResumida);
  const match = text.match(/^([A-Za-zÀ-ÖØ-öø-ÿ]+)/u);
  return match?.[1] || 'Analisar';
}

for (let year = 1; year <= 9; year += 1) {
  const file = path.join(root, 'data', 'atividades', stage(year), `${year}-ano`, '4-bimestre', 'ciencias.json');
  const collection = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (collection.schemaVersion !== '2.0' || collection.padraoPedagogico !== 'teacheasy-v2') throw new Error(`Coleção fora do V2: ${file}`);
  if (collection.atividades.length !== 50) throw new Error(`Coleção deve possuir 50 atividades: ${file}`);
  collections += 1;

  for (const activity of collection.atividades) {
    activities += 1;
    const activityTitle = normalize(activity.titulo);
    const theme = normalize(activity.tema) || activityTitle;
    activity.textoApoio = activity.textoApoio || {};
    const supportTitle = normalize(activity.textoApoio.titulo);
    const plainSupport = supportTitle.replace(/^Leitura científica:\s*/i, '').trim();
    if (!supportTitle || supportTitle.toLocaleLowerCase('pt-BR') === activityTitle.toLocaleLowerCase('pt-BR') || plainSupport.toLocaleLowerCase('pt-BR') === activityTitle.toLocaleLowerCase('pt-BR')) {
      activity.textoApoio.titulo = `Leitura científica: ${theme}`;
      supportTitles += 1;
    }

    const currentSupport = normalize(activity.textoApoio.conteudo);
    if (currentSupport.length < 120) {
      const skillText = normalize(activity.bncc?.[0]?.habilidadeOficial);
      activity.textoApoio.conteudo = `${currentSupport} Para investigar ${theme.toLocaleLowerCase('pt-BR')}, é importante observar evidências, registrar o que acontece e comparar resultados antes de formular uma conclusão. ${skillText}`.trim();
      supportBodies += 1;
    }

    for (const skill of activity.bncc || []) {
      if (normalize(skill.verbo).length < 3) {
        skill.verbo = centralVerb(skill);
        verbs += 1;
      }
    }

    activity.ilustracao = activity.ilustracao || {};
    if (normalize(activity.ilustracao.objetivoPedagogico).length < 20) {
      activity.ilustracao.objetivoPedagogico = `Apoiar a compreensão científica de ${theme} por meio de uma representação visual coerente com a investigação proposta.`;
      illustrationObjectives += 1;
    }

    const result = validatePedagogicalActivityV2(activity, collection);
    if (!result.valid) throw new Error(result.errors.join('\n'));
  }

  fs.writeFileSync(file, `${JSON.stringify(collection, null, 2)}\n`, 'utf8');
}

console.log(JSON.stringify({ collections, activities, supportTitles, supportBodies, verbs, illustrationObjectives }, null, 2));

#!/usr/bin/env node

import { access, copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildIllustrationPrompt, classifyIllustration } from './illustration-prompt-policy.mjs';

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const DEFAULT_DATA_ROOT = path.join(ROOT, 'data', 'atividades');
const DEFAULT_WORK_ROOT = path.join(ROOT, 'var', 'illustration-production');
const OFFICIAL_CAST_FILE = path.join(ROOT, 'public', 'illustrations', 'reference', 'teacheasy-official-cast.png');
const GENERATIONS_ENDPOINT = 'https://api.openai.com/v1/images/generations';
const EDITS_ENDPOINT = 'https://api.openai.com/v1/images/edits';
const MODEL = 'gpt-image-2-2026-04-21';
const DEFAULT_PLACEMENT = Object.freeze({
  fit: 'cover',
  preserveAspectRatio: true,
  allowCrop: true,
  cropAnchor: 'center',
  overflow: 'hidden',
  distortion: false
});

function parseArgs(argv) {
  const [command = 'help', ...rest] = argv;
  const options = { command, force: false, limit: Infinity };
  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    if (arg === '--force') options.force = true;
    else if (['--root', '--work', '--stage', '--grade', '--term', '--subject', '--id', '--status'].includes(arg)) {
      const value = rest[++i];
      if (!value || value.startsWith('--')) throw new Error(`${arg} exige um valor.`);
      options[arg.slice(2)] = value;
    } else if (arg === '--limit') {
      const value = Number(rest[++i]);
      if (!Number.isInteger(value) || value < 1) throw new Error('--limit deve ser inteiro positivo.');
      options.limit = value;
    } else throw new Error(`Opção desconhecida: ${arg}`);
  }
  return options;
}

async function walkJson(directory) {
  const items = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const item of items) {
    const full = path.join(directory, item.name);
    if (item.isDirectory()) files.push(...await walkJson(full));
    else if (item.isFile() && item.name.endsWith('.json')) files.push(full);
  }
  return files.sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }));
}

function normalize(value) {
  return String(value || '').trim().toLocaleLowerCase('pt-BR');
}

function matchesFilters(collection, activity, options) {
  if (options.stage && !normalize(collection.etapa).includes(normalize(options.stage))) return false;
  if (options.grade && !normalize(collection.ano).includes(normalize(options.grade))) return false;
  if (options.term && Number(collection.bimestre) !== Number(options.term)) return false;
  if (options.subject && !normalize(collection.disciplina).includes(normalize(options.subject))) return false;
  if (options.id && normalize(activity.id) !== normalize(options.id)) return false;
  return true;
}

function safeStem(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
    .slice(0, 140);
}

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

async function loadExistingManifest(file) {
  try { return await readJson(file); }
  catch (error) {
    if (error.code === 'ENOENT') return { schemaVersion: 1, items: [] };
    throw error;
  }
}

async function buildManifest(options) {
  const dataRoot = path.resolve(options.root || DEFAULT_DATA_ROOT);
  const workRoot = path.resolve(options.work || DEFAULT_WORK_ROOT);
  await mkdir(workRoot, { recursive: true });
  const manifestFile = path.join(workRoot, 'manifest.json');
  const existing = await loadExistingManifest(manifestFile);
  const previous = new Map((existing.items || []).map(item => [item.id, item]));
  const jsonFiles = await walkJson(dataRoot);
  const items = [];

  for (const file of jsonFiles) {
    let collection;
    try { collection = await readJson(file); }
    catch { continue; }
    if (String(collection.schemaVersion) !== '2.0' || !Array.isArray(collection.atividades)) continue;

    for (const activity of collection.atividades) {
      if (!activity?.id || !matchesFilters(collection, activity, options)) continue;
      const profile = classifyIllustration(activity, collection);
      const prompt = buildIllustrationPrompt(activity, collection, profile);
      const prior = previous.get(activity.id);
      items.push({
        id: activity.id,
        sourceFile: path.relative(ROOT, file).replaceAll('\\', '/'),
        etapa: collection.etapa,
        ano: collection.ano,
        bimestre: collection.bimestre,
        disciplina: collection.disciplina,
        titulo: activity.titulo,
        tema: activity.tema || activity.textoApoio?.titulo || '',
        bncc: (activity.bncc || []).map(item => item.codigo).filter(Boolean),
        illustrationKind: profile.kind,
        characters: profile.characters.map(item => item.key),
        useNino: profile.useNino,
        needsOfficialCastReference: profile.needsOfficialCastReference,
        placement: { ...DEFAULT_PLACEMENT },
        prompt,
        status: prior?.status || 'pendente',
        attempts: Number(prior?.attempts || 0),
        outputFile: prior?.outputFile || '',
        error: prior?.error || '',
        updatedAt: prior?.updatedAt || null
      });
      if (items.length >= options.limit) break;
    }
    if (items.length >= options.limit) break;
  }

  const manifest = {
    schemaVersion: 1,
    model: MODEL,
    generatedAt: new Date().toISOString(),
    dataRoot: path.relative(ROOT, dataRoot).replaceAll('\\', '/'),
    total: items.length,
    items
  };
  await writeFile(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return { manifest, manifestFile };
}

async function imageGeneration(item, { apiKey, fetchImpl = globalThis.fetch, castBuffer }) {
  if (!apiKey) throw new Error('OPENAI_API_KEY não está definida.');
  let response;
  if (item.needsOfficialCastReference) {
    const form = new FormData();
    form.append('model', MODEL);
    form.append('prompt', item.prompt);
    form.append('image', new Blob([castBuffer], { type: 'image/png' }), 'teacheasy-official-cast.png');
    form.append('input_fidelity', 'high');
    form.append('size', '1536x1024');
    form.append('quality', 'high');
    form.append('output_format', 'png');
    response = await fetchImpl(EDITS_ENDPOINT, { method: 'POST', headers: { Authorization: `Bearer ${apiKey}` }, body: form });
  } else {
    response = await fetchImpl(GENERATIONS_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, prompt: item.prompt, size: '1536x1024', quality: 'high', output_format: 'png' })
    });
  }

  let payload = {};
  try { payload = await response.json(); } catch {}
  if (!response.ok) {
    const error = new Error(payload.error?.message || `API de imagens respondeu HTTP ${response.status}.`);
    error.status = response.status;
    throw error;
  }
  const base64 = payload.data?.[0]?.b64_json;
  if (!base64) throw new Error('A API não retornou a imagem em b64_json.');
  return Buffer.from(base64, 'base64');
}

function temporary(error) {
  const status = Number(error?.status);
  return status === 429 || (status >= 500 && status <= 599);
}

async function saveManifest(file, manifest) {
  manifest.generatedAt = new Date().toISOString();
  await writeFile(file, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

function subjectDirectory(item) {
  return safeStem(`${item.etapa}-${item.ano}-${item.bimestre}-${item.disciplina}`);
}

function outputRelativePath(item) {
  return path.join('var', 'illustration-production', 'images', subjectDirectory(item), `${safeStem(item.id)}.png`).replaceAll('\\', '/');
}

async function prepareChatGptBatch(options) {
  const workRoot = path.resolve(options.work || DEFAULT_WORK_ROOT);
  const manifestFile = path.join(workRoot, 'manifest.json');
  const manifest = await readJson(manifestFile);
  const batchFile = path.join(workRoot, 'chatgpt-batch.json');
  const inboxDir = path.join(workRoot, 'inbox');
  await mkdir(inboxDir, { recursive: true });

  const candidates = manifest.items
    .filter(item => options.force || ['pendente', 'erro', 'revisar'].includes(item.status))
    .filter(item => !options.status || item.status === options.status)
    .slice(0, options.limit);

  if (!candidates.length) throw new Error('Nenhuma atividade disponível para preparar no ChatGPT.');

  const preparedAt = new Date().toISOString();
  const batch = {
    schemaVersion: 1,
    mode: 'chatgpt-manual',
    preparedAt,
    total: candidates.length,
    inbox: path.relative(ROOT, inboxDir).replaceAll('\\', '/'),
    items: candidates.map(item => ({
      id: item.id,
      titulo: item.titulo,
      tema: item.tema,
      etapa: item.etapa,
      ano: item.ano,
      bimestre: item.bimestre,
      disciplina: item.disciplina,
      characters: item.characters,
      useNino: item.useNino,
      needsOfficialCastReference: item.needsOfficialCastReference,
      prompt: item.prompt,
      expectedFileName: `${safeStem(item.id)}.png`,
      expectedInboxFile: path.join(path.relative(ROOT, inboxDir), `${safeStem(item.id)}.png`).replaceAll('\\', '/'),
      outputFile: outputRelativePath(item)
    }))
  };

  for (const item of candidates) {
    item.status = 'aguardando-chatgpt';
    item.error = '';
    item.updatedAt = preparedAt;
  }

  await writeFile(batchFile, `${JSON.stringify(batch, null, 2)}\n`, 'utf8');
  await saveManifest(manifestFile, manifest);

  console.log(`Lote ChatGPT: ${batchFile}`);
  console.log(`Atividades preparadas: ${batch.total}`);
  console.log(`Pasta de entrada: ${inboxDir}`);
  for (const item of batch.items) console.log(`[CHATGPT] ${item.id} -> ${item.expectedFileName}`);
  return batch;
}

async function ingestChatGptImages(options) {
  const workRoot = path.resolve(options.work || DEFAULT_WORK_ROOT);
  const manifestFile = path.join(workRoot, 'manifest.json');
  const manifest = await readJson(manifestFile);
  const inboxDir = path.join(workRoot, 'inbox');
  const outputRoot = path.join(workRoot, 'images');
  await mkdir(inboxDir, { recursive: true });
  await mkdir(outputRoot, { recursive: true });

  const candidates = manifest.items
    .filter(item => item.status === 'aguardando-chatgpt')
    .filter(item => !options.id || normalize(item.id) === normalize(options.id))
    .slice(0, options.limit);

  let imported = 0;
  let missing = 0;
  for (const item of candidates) {
    const fileName = `${safeStem(item.id)}.png`;
    const sourceFile = path.join(inboxDir, fileName);
    try {
      await access(sourceFile);
    } catch {
      missing += 1;
      console.log(`[FALTA] ${fileName}`);
      continue;
    }

    const targetDir = path.join(outputRoot, subjectDirectory(item));
    await mkdir(targetDir, { recursive: true });
    const targetFile = path.join(targetDir, fileName);
    await copyFile(sourceFile, targetFile);
    item.status = 'gerada';
    item.outputFile = path.relative(ROOT, targetFile).replaceAll('\\', '/');
    item.error = '';
    item.updatedAt = new Date().toISOString();
    imported += 1;
    console.log(`[IMPORTADA] ${item.id} -> ${item.outputFile}`);
  }

  await saveManifest(manifestFile, manifest);
  console.log(`Importadas: ${imported}`);
  console.log(`Ainda ausentes: ${missing}`);
  return { imported, missing };
}

async function generate(options) {
  const workRoot = path.resolve(options.work || DEFAULT_WORK_ROOT);
  const manifestFile = path.join(workRoot, 'manifest.json');
  const manifest = await readJson(manifestFile);
  const outputRoot = path.join(workRoot, 'images');
  await mkdir(outputRoot, { recursive: true });
  let castBuffer = null;
  try { castBuffer = await readFile(OFFICIAL_CAST_FILE); } catch {}

  const candidates = manifest.items
    .filter(item => options.force || ['pendente', 'erro', 'revisar'].includes(item.status))
    .filter(item => !options.status || item.status === options.status)
    .slice(0, options.limit);

  for (const item of candidates) {
    if (item.needsOfficialCastReference && !castBuffer) {
      item.status = 'erro';
      item.error = 'Referência visual oficial não encontrada.';
      item.updatedAt = new Date().toISOString();
      await saveManifest(manifestFile, manifest);
      continue;
    }
    const targetDir = path.join(outputRoot, subjectDirectory(item));
    await mkdir(targetDir, { recursive: true });
    const outputFile = path.join(targetDir, `${safeStem(item.id)}.png`);
    if (!options.force) {
      try {
        await access(outputFile);
        item.status = 'gerada';
        item.outputFile = path.relative(ROOT, outputFile).replaceAll('\\', '/');
        item.error = '';
        item.updatedAt = new Date().toISOString();
        await saveManifest(manifestFile, manifest);
        continue;
      } catch {}
    }

    item.status = 'gerando';
    item.attempts += 1;
    item.updatedAt = new Date().toISOString();
    await saveManifest(manifestFile, manifest);
    console.log(`[GERANDO] ${item.id}`);

    try {
      const buffer = await imageGeneration(item, { apiKey: process.env.OPENAI_API_KEY, castBuffer });
      await writeFile(outputFile, buffer);
      item.status = 'gerada';
      item.outputFile = path.relative(ROOT, outputFile).replaceAll('\\', '/');
      item.error = '';
      console.log(`[OK] ${item.outputFile}`);
    } catch (error) {
      item.status = temporary(error) ? 'pendente' : 'erro';
      item.error = error.message || String(error);
      console.error(`[ERRO] ${item.id} - ${item.error}`);
    }
    item.updatedAt = new Date().toISOString();
    await saveManifest(manifestFile, manifest);
    if (item.status === 'pendente') await new Promise(resolve => setTimeout(resolve, 5000));
  }
  return manifest;
}

async function showStatus(options) {
  const workRoot = path.resolve(options.work || DEFAULT_WORK_ROOT);
  const manifest = await readJson(path.join(workRoot, 'manifest.json'));
  const counts = {};
  for (const item of manifest.items) counts[item.status] = (counts[item.status] || 0) + 1;
  console.log(`Total: ${manifest.items.length}`);
  for (const [status, count] of Object.entries(counts).sort()) console.log(`${status}: ${count}`);
}

async function showPrompt(options) {
  const workRoot = path.resolve(options.work || DEFAULT_WORK_ROOT);
  const manifest = await readJson(path.join(workRoot, 'manifest.json'));
  const item = options.id ? manifest.items.find(entry => entry.id === options.id) : manifest.items[0];
  if (!item) throw new Error('Nenhuma atividade encontrada no manifesto.');
  console.log(`ID: ${item.id}`);
  console.log(`Tipo: ${item.illustrationKind}`);
  console.log(`Personagens: ${item.characters.length ? item.characters.join(', ') : 'nenhum'}`);
  console.log(`Nino: ${item.useNino ? 'sim' : 'não'}`);
  console.log(`Encaixe: ${item.placement?.fit || 'cover'} / corte ${item.placement?.cropAnchor || 'center'}`);
  console.log('');
  console.log(item.prompt);
}

function help() {
  console.log('TeachEasy — Pipeline de Produção de Ilustrações');
  console.log('');
  console.log('Comandos:');
  console.log('  manifest  Cria/atualiza a fila a partir dos JSONs V2.');
  console.log('  prompt    Mostra o prompt da primeira atividade ou de --id.');
  console.log('  prepare   Separa um lote para geração manual pelo ChatGPT, sem API key.');
  console.log('  ingest    Importa imagens colocadas em var/illustration-production/inbox.');
  console.log('  generate  Gera via API somente itens pendentes/erro, com retomada.');
  console.log('  status    Mostra o andamento da produção.');
  console.log('');
  console.log('Filtros: --stage --grade --term --subject --id --status --limit --work --root --force');
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.command === 'manifest') {
    const { manifest, manifestFile } = await buildManifest(options);
    console.log(`Manifesto: ${manifestFile}`);
    console.log(`Atividades na fila: ${manifest.total}`);
  } else if (options.command === 'prepare') await prepareChatGptBatch(options);
  else if (options.command === 'ingest') await ingestChatGptImages(options);
  else if (options.command === 'generate') await generate(options);
  else if (options.command === 'status') await showStatus(options);
  else if (options.command === 'prompt') await showPrompt(options);
  else help();
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error(`[ERRO] ${error.message || error}`);
    process.exitCode = 1;
  });
}

export {
  DEFAULT_PLACEMENT,
  buildManifest,
  generate,
  imageGeneration,
  ingestChatGptImages,
  matchesFilters,
  parseArgs,
  prepareChatGptBatch
};

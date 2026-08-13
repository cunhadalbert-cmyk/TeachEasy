#!/usr/bin/env node

import { constants as fsConstants } from 'node:fs';
import { access, mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { generateIllustrationBuffer } = require('../api/_lib/illustration-generation.js');
const OFFICIAL_CAST_FILE = fileURLToPath(new URL('../public/illustrations/reference/teacheasy-official-cast.png', import.meta.url));
const MAX_ITEMS = 10;
const MAX_ID_LENGTH = 100;
const DEFAULT_TIMEOUT_MS = 120_000;
const MAX_ATTEMPTS = 3;

export function parseArguments(argv) {
  const options = { force: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--force') {
      options.force = true;
    } else if (argument === '--input' || argument === '--output') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) throw new Error(`A opÃ§Ã£o ${argument} exige um caminho.`);
      options[argument.slice(2)] = value;
      index += 1;
    } else {
      throw new Error(`OpÃ§Ã£o desconhecida: ${argument}`);
    }
  }
  if (!options.input) throw new Error('Informe o arquivo JSON com --input.');
  if (!options.output) throw new Error('Informe a pasta de saÃ­da com --output.');
  return options;
}

export function sanitizeFileStem(id) {
  return String(id)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
    .slice(0, MAX_ID_LENGTH);
}

export function validateItems(value) {
  if (!Array.isArray(value)) throw new Error('O JSON de entrada deve conter uma lista.');
  if (value.length > MAX_ITEMS) throw new Error(`O lote aceita no mÃ¡ximo ${MAX_ITEMS} itens.`);

  const ids = new Set();
  const filenames = new Set();
  return value.map((item, index) => {
    const position = index + 1;
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error(`Item ${position}: formato invÃ¡lido.`);
    const id = typeof item.id === 'string' ? item.id.trim() : '';
    const texto = typeof item.texto === 'string' ? item.texto.trim() : '';
    const titulo = typeof item.titulo === 'string' ? item.titulo.trim() : '';
    if (!id) throw new Error(`Item ${position}: id Ã© obrigatÃ³rio.`);
    if (id.length > MAX_ID_LENGTH || !/^[\p{L}\p{N}][\p{L}\p{N}_-]*$/u.test(id)) {
      throw new Error(`Item ${position}: id invÃ¡lido. Use somente letras, nÃºmeros, hÃ­fen ou sublinhado.`);
    }
    if (!texto) throw new Error(`Item ${position} (${id}): texto Ã© obrigatÃ³rio.`);
    const duplicateKey = id.toLocaleLowerCase('pt-BR');
    if (ids.has(duplicateKey)) throw new Error(`ID duplicado: ${id}.`);
    ids.add(duplicateKey);

    const fileStem = sanitizeFileStem(id);
    const filenameKey = fileStem.toLowerCase();
    if (!fileStem || filenames.has(filenameKey)) throw new Error(`O id ${id} gera um nome de arquivo duplicado ou invÃ¡lido.`);
    filenames.add(filenameKey);
    return { id, titulo, texto, filename: `${fileStem}.png` };
  });
}

export async function loadInput(inputPath) {
  let raw;
  try {
    raw = await readFile(inputPath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') throw new Error(`Arquivo de entrada nÃ£o encontrado: ${inputPath}`);
    throw new Error(`NÃ£o foi possÃ­vel ler o arquivo de entrada: ${error.message}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`JSON invÃ¡lido: ${error.message}`);
  }
  return validateItems(parsed);
}

export async function ensureOutputDirectory(outputDirectory) {
  try {
    await mkdir(outputDirectory, { recursive: true });
    await access(outputDirectory, fsConstants.W_OK);
    const probe = path.join(outputDirectory, `.teacheasy-write-check-${process.pid}-${Date.now()}`);
    await writeFile(probe, '', { flag: 'wx' });
    await unlink(probe);
  } catch (error) {
    throw new Error(`A pasta de saÃ­da nÃ£o pode ser criada ou gravada: ${error.message}`);
  }
}

export function isTemporaryError(error) {
  const status = Number(error?.status || error?.statusCode);
  const code = String(error?.code || '').toUpperCase();
  const name = String(error?.name || '');
  return status === 429 || status >= 500 && status <= 599 || name === 'AbortError' || name === 'TimeoutError' || ['ETIMEDOUT', 'ESOCKETTIMEDOUT'].includes(code);
}

async function generateWithTimeout(generator, item, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await generator({
      subject: 'Atividade Escolar',
      topic: item.titulo || item.id,
      context: item.texto,
      signal: controller.signal
    });
  } catch (error) {
    if (controller.signal.aborted && error?.name !== 'AbortError') {
      const timeoutError = new Error(`Tempo limite de ${timeoutMs} ms excedido.`);
      timeoutError.name = 'TimeoutError';
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateWithRetry(generator, item, {
  timeoutMs = DEFAULT_TIMEOUT_MS,
  maxAttempts = MAX_ATTEMPTS,
  wait = delay => new Promise(resolve => setTimeout(resolve, delay)),
  logger = console
} = {}) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await generateWithTimeout(generator, item, timeoutMs);
    } catch (error) {
      lastError = error;
      if (!isTemporaryError(error) || attempt === maxAttempts) throw error;
      const delay = 1_000 * 2 ** (attempt - 1);
      logger.warn(`[RETRY] ${item.id} - tentativa ${attempt + 1}/${maxAttempts} em ${delay} ms`);
      await wait(delay);
    }
  }
  throw lastError;
}

function reportLine(entry) {
  if (entry.status === 'ok') return `OK   ${entry.arquivo}`;
  if (entry.status === 'ignorado') return `IGN  ${entry.arquivo}`;
  return `ERRO ${entry.id}`;
}

export function printSummary(report, logger = console) {
  const generated = report.items.filter(item => item.status === 'ok').length;
  const ignored = report.items.filter(item => item.status === 'ignorado').length;
  const failed = report.items.filter(item => item.status === 'erro').length;
  logger.log('');
  logger.log('=============================');
  logger.log('LOTE DE ILUSTRAÃ‡Ã•ES CONCLUÃDO');
  logger.log('=============================');
  logger.log('');
  logger.log(`Solicitadas: ${report.solicitadas}`);
  logger.log(`Geradas: ${generated}`);
  logger.log(`Ignoradas: ${ignored}`);
  logger.log(`Falhas: ${failed}`);
  logger.log('');
  for (const item of report.items) logger.log(reportLine(item));
}

export async function runBatch({
  input,
  output,
  force = false,
  generator = generateIllustrationBuffer,
  logger = console,
  now = () => new Date(),
  retryOptions = {}
}) {
  const inputPath = path.resolve(input);
  const outputDirectory = path.resolve(output);
  const items = await loadInput(inputPath);
  await ensureOutputDirectory(outputDirectory);
  let referenceBuffer = null;
  if (generator === generateIllustrationBuffer) {
    try {
      referenceBuffer = await readFile(OFFICIAL_CAST_FILE);
    } catch (error) {
      throw new Error(`Não foi possível carregar a referência visual oficial: ${error.message}`);
    }
  }
  const batchGenerator = options => generator({ ...options, referenceBuffer });

  const report = { solicitadas: items.length, items: [] };
  for (const item of items) {
    const outputPath = path.join(outputDirectory, item.filename);
    if (!force) {
      try {
        await access(outputPath);
        logger.log(`[IGNORADA] ${item.id} - ${item.filename} jÃ¡ existe (use --force para substituir).`);
        report.items.push({ id: item.id, arquivo: item.filename, status: 'ignorado', horario: now().toISOString() });
        continue;
      } catch (error) {
        if (error.code !== 'ENOENT') {
          const message = `NÃ£o foi possÃ­vel verificar o arquivo de saÃ­da: ${error.message}`;
          logger.error(`[ERRO] ${item.id} - ${message}`);
          report.items.push({ id: item.id, arquivo: item.filename, status: 'erro', erro: message, horario: now().toISOString() });
          continue;
        }
      }
    }

    logger.log(`[GERANDO] ${item.id}...`);
    try {
      const imageBuffer = await generateWithRetry(batchGenerator, item, { ...retryOptions, logger });
      if (!Buffer.isBuffer(imageBuffer)) throw new Error('O gerador nÃ£o retornou uma imagem em formato binÃ¡rio.');
      await writeFile(outputPath, imageBuffer, { flag: force ? 'w' : 'wx' });
      logger.log(`[OK] ${item.filename}`);
      report.items.push({ id: item.id, arquivo: item.filename, status: 'ok', horario: now().toISOString() });
    } catch (error) {
      if (!force && error.code === 'EEXIST') {
        logger.log(`[IGNORADA] ${item.id} - ${item.filename} foi criado por outro processo.`);
        report.items.push({ id: item.id, arquivo: item.filename, status: 'ignorado', horario: now().toISOString() });
      } else {
        const message = error?.message || String(error);
        logger.error(`[ERRO] ${item.id} - ${message}`);
        report.items.push({ id: item.id, arquivo: item.filename, status: 'erro', erro: message, horario: now().toISOString() });
      }
    }
  }

  report.geradas = report.items.filter(item => item.status === 'ok').length;
  report.ignoradas = report.items.filter(item => item.status === 'ignorado').length;
  report.falhas = report.items.filter(item => item.status === 'erro').length;
  report.concluidoEm = now().toISOString();
  await writeFile(path.join(outputDirectory, 'generation-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  printSummary(report, logger);
  return report;
}

async function main() {
  try {
    const options = parseArguments(process.argv.slice(2));
    const report = await runBatch(options);
    if (report.falhas > 0) process.exitCode = 1;
  } catch (error) {
    console.error(`[ERRO] ${error.message || error}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();

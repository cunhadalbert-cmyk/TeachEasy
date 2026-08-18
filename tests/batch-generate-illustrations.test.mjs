import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  generateWithRetry,
  loadInput,
  runBatch
} from '../scripts/batch-generate-illustrations.mjs';

const silentLogger = { log() {}, warn() {}, error() {} };
const mockImage = Buffer.from('imagem-png-simulada');

async function sandbox(t) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'teacheasy-batch-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

async function inputFile(directory, value, filename = 'input.json') {
  const file = path.join(directory, filename);
  await writeFile(file, typeof value === 'string' ? value : `${JSON.stringify(value)}\n`, 'utf8');
  return file;
}

function item(id = 'atividade-01', texto = 'Texto pedagógico da atividade.', disciplina = 'Ciências') {
  return { id, titulo: `Título ${id}`, disciplina, texto };
}

test('rejeita JSON inválido antes de gerar imagens', async t => {
  const directory = await sandbox(t);
  const input = await inputFile(directory, '{ inválido');
  await assert.rejects(loadInput(input), /JSON inválido/);
});

test('rejeita lotes com mais de 10 itens', async t => {
  const directory = await sandbox(t);
  const input = await inputFile(directory, Array.from({ length: 11 }, (_, index) => item(`atividade-${index + 1}`)));
  await assert.rejects(loadInput(input), /no máximo 10 itens/);
});

test('rejeita item sem texto', async t => {
  const directory = await sandbox(t);
  const input = await inputFile(directory, [item('atividade-01', '')]);
  await assert.rejects(loadInput(input), /texto é obrigatório/);
});

test('rejeita item sem disciplina', async t => {
  const directory = await sandbox(t);
  const input = await inputFile(directory, [item('atividade-01', 'Texto pedagógico.', '')]);
  await assert.rejects(loadInput(input), /disciplina é obrigatória/);
});

test('rejeita IDs duplicados sem diferenciar maiúsculas', async t => {
  const directory = await sandbox(t);
  const input = await inputFile(directory, [item('atividade-01'), item('ATIVIDADE-01')]);
  await assert.rejects(loadInput(input), /ID duplicado/);
});

test('cria a pasta de saída e salva a imagem usando a disciplina real', async t => {
  const directory = await sandbox(t);
  const input = await inputFile(directory, [item()]);
  const output = path.join(directory, 'nova', 'pasta');
  const subjects = [];
  const report = await runBatch({
    input,
    output,
    generator: async ({ subject }) => {
      subjects.push(subject);
      return mockImage;
    },
    logger: silentLogger
  });
  assert.equal(report.geradas, 1);
  assert.deepEqual(subjects, ['Ciências']);
  assert.deepEqual(await readFile(path.join(output, 'atividade-01.png')), mockImage);
});

test('protege imagem existente contra sobrescrita', async t => {
  const directory = await sandbox(t);
  const input = await inputFile(directory, [item()]);
  const output = path.join(directory, 'saida');
  await mkdir(output);
  const original = Buffer.from('imagem-original');
  await writeFile(path.join(output, 'atividade-01.png'), original);
  let calls = 0;
  const report = await runBatch({ input, output, generator: async () => { calls += 1; return mockImage; }, logger: silentLogger });
  assert.equal(calls, 0);
  assert.equal(report.ignoradas, 1);
  assert.deepEqual(await readFile(path.join(output, 'atividade-01.png')), original);
});

test('continua o lote depois da falha independente de um item', async t => {
  const directory = await sandbox(t);
  const input = await inputFile(directory, [item('atividade-01'), item('atividade-02'), item('atividade-03')]);
  const output = path.join(directory, 'saida');
  const calls = [];
  const report = await runBatch({
    input,
    output,
    generator: async ({ topic }) => {
      calls.push(topic);
      if (topic.includes('atividade-02')) throw new Error('falha simulada');
      return mockImage;
    },
    logger: silentLogger
  });
  assert.equal(calls.length, 3);
  assert.equal(report.geradas, 2);
  assert.equal(report.falhas, 1);
  assert.equal(report.items[1].erro, 'falha simulada');
  assert.deepEqual(await readFile(path.join(output, 'atividade-03.png')), mockImage);
});

test('cria relatório final JSON e mostra o resumo completo', async t => {
  const directory = await sandbox(t);
  const input = await inputFile(directory, [item()]);
  const output = path.join(directory, 'saida');
  const lines = [];
  const logger = { log: line => lines.push(String(line ?? '')), warn() {}, error() {} };
  const now = () => new Date('2026-08-13T12:00:00.000Z');
  await runBatch({ input, output, generator: async () => mockImage, logger, now });
  const saved = JSON.parse(await readFile(path.join(output, 'generation-report.json'), 'utf8'));
  assert.equal(saved.solicitadas, 1);
  assert.equal(saved.geradas, 1);
  assert.equal(saved.falhas, 0);
  assert.deepEqual(saved.items[0], {
    id: 'atividade-01',
    arquivo: 'atividade-01.png',
    status: 'ok',
    horario: '2026-08-13T12:00:00.000Z'
  });
  assert.match(lines.join('\n'), /LOTE DE ILUSTRAÇÕES CONCLUÍDO[\s\S]*Solicitadas: 1[\s\S]*OK   atividade-01\.png/);
});

test('modo --force substitui explicitamente a imagem existente', async t => {
  const directory = await sandbox(t);
  const input = await inputFile(directory, [item()]);
  const output = path.join(directory, 'saida');
  await mkdir(output);
  await writeFile(path.join(output, 'atividade-01.png'), 'antiga');
  const report = await runBatch({ input, output, force: true, generator: async () => mockImage, logger: silentLogger });
  assert.equal(report.geradas, 1);
  assert.deepEqual(await readFile(path.join(output, 'atividade-01.png')), mockImage);
});

test('retry é limitado e usado somente para erro temporário', async () => {
  let attempts = 0;
  const generator = async () => {
    attempts += 1;
    if (attempts < 3) {
      const error = new Error('API ocupada');
      error.status = 503;
      throw error;
    }
    return mockImage;
  };
  const result = await generateWithRetry(generator, item(), {
    wait: async () => {},
    logger: silentLogger
  });
  assert.deepEqual(result, mockImage);
  assert.equal(attempts, 3);

  attempts = 0;
  await assert.rejects(generateWithRetry(async () => {
    attempts += 1;
    throw new Error('erro permanente');
  }, item(), { wait: async () => {}, logger: silentLogger }), /erro permanente/);
  assert.equal(attempts, 1);
});

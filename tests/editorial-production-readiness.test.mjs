import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();

function runNode(script, args = []) {
  const result = spawnSync(process.execPath, [path.join(root, script), ...args], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${script} falhou:\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

test('auditoria editorial integral valida as 9.000 atividades canônicas', () => {
  const stdout = runNode('scripts/audit-fundamental-editorial.mjs');
  const report = JSON.parse(stdout);
  assert.equal(report.stats.collections, 180);
  assert.equal(report.stats.activities, 9000);
  assert.equal(report.stats.questions, 72000);
  assert.equal(report.stats.answers, 72000);
  assert.equal(report.blockingCount, 0);
});

test('auditoria de prontidão Word cobre todas as 180 coleções', () => {
  const stdout = runNode('scripts/audit-word-readiness.mjs');
  const report = JSON.parse(stdout);
  assert.equal(report.collections, 180);
  assert.equal(report.activities, 9000);
  assert.equal(report.blockers, 0);
});

test('fila de ilustrações entrega no máximo dez atividades e preserva disciplina', () => {
  const stdout = runNode('scripts/prepare-fundamental-illustration-batch.mjs', ['--limit=10']);
  const report = JSON.parse(stdout);
  assert.ok(report.totalPendentesNoFiltro >= report.retornadas);
  assert.ok(report.retornadas <= 10);
  assert.ok(report.items.every(item => item.id && item.titulo && item.disciplina && item.texto));
});

test('gerador Word genérico usa fonte canônica, A4, 1 cm, moldura e gabarito separado', async () => {
  const source = await readFile(path.join(root, 'scripts', 'generate-fundamental-word.ps1'), 'utf8');
  assert.match(source, /fundamental-anos-iniciais/);
  assert.match(source, /fundamental-anos-finais/);
  assert.match(source, /PaperSize = 7/);
  assert.match(source, /CentimetersToPoints\(1\)/);
  assert.match(source, /Borders\.Enable = 1/);
  assert.match(source, /'GABARITO'/);
  assert.match(source, /questoes\.Count -ne 8/);
  assert.match(source, /gabarito\.Count -ne 8/);
  assert.match(source, /SaveAs2/);
});

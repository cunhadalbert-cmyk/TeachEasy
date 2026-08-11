import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';

test('Lote piloto de Matemática (3º ano 1º bimestre) possui 30 atividades vinculadas a PNGs permanentes', async () => {
  const jsonRaw = await readFile(new URL('../data/atividades/fundamental-anos-iniciais/3-ano/1-bimestre/matematica.json', import.meta.url), 'utf8');
  const collection = JSON.parse(jsonRaw);

  assert.equal(collection.ano, '3º ano');
  assert.equal(collection.bimestre, 1);
  assert.equal(collection.disciplina, 'Matemática');
  assert.equal(collection.atividades.length, 30);

  for (const activity of collection.atividades) {
    assert.ok(activity.id);
    assert.ok(activity.illustration, `Atividade ${activity.id} não possui ilustração vinculada.`);
    assert.match(activity.illustration, /\/illustrations\/biblioteca\/fundamental-iniciais\/3-ano\/1-bimestre\/matematica\/.*\.png$/);

    const physicalPath = new URL(`../public${activity.illustration}`, import.meta.url);
    const fileStat = await stat(physicalPath);
    assert.ok(fileStat.size > 1000, `Arquivo PNG ${activity.illustration} está vazio ou corrompido.`);
  }
});

test('Manifesto de controle das ilustrações registra o lote piloto corretamente', async () => {
  const manifestRaw = await readFile(new URL('../data/library-illustrations.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(manifestRaw);
  assert.equal(manifest.length, 30);

  const item0 = manifest[0];
  assert.equal(item0.subject, 'Matemática');
  assert.equal(item0.grade, '3º ano');
  assert.equal(item0.bimester, 1);
  assert.equal(item0.status, 'ready');
  assert.ok(item0.imagePath.endsWith('.png'));
});

test('Biblioteca não carrega gerador dinâmico de IA nem sincronizador de espera no navegador do cliente', async () => {
  const html = await readFile(new URL('../biblioteca.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /library-ai-illustration\.js/);
  assert.doesNotMatch(html, /generate-library-illustration/);
  assert.doesNotMatch(html, /library-export-image-sync\.js/);
  assert.match(html, /biblioteca-final-standard\.js/);
  assert.match(html, /library-portuguese-approved-static\.js/);
});

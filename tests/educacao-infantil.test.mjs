import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const collectionUrl = new URL('../data/atividades/educacao-infantil/atividades-aprovadas.json', import.meta.url);

test('Coleção de Educação Infantil mantém os dois grupos e 20 atividades aprovadas', async () => {
  const collection = JSON.parse(await readFile(collectionUrl, 'utf8'));
  assert.equal(collection.schemaVersion, '1.0');
  assert.equal(collection.etapa, 'Educação Infantil');
  assert.equal(collection.totalAtividades, 20);
  assert.equal(collection.grupos.length, 2);
  assert.deepEqual(collection.grupos.map(group => group.atividades.length), [10, 10]);
  assert.deepEqual(collection.grupos.map(group => group.titulo), ['Crianças pequenas', 'Crianças bem pequenas']);
});

test('Todas as atividades infantis possuem conteúdo pedagógico, inclusão e ilustração', async () => {
  const collection = JSON.parse(await readFile(collectionUrl, 'utf8'));
  const activities = collection.grupos.flatMap(group => group.atividades);
  const ids = new Set(activities.map(activity => activity.id));
  assert.equal(ids.size, 20);
  activities.forEach(activity => {
    assert.ok(activity.titulo);
    assert.ok(activity.campoExperiencia);
    assert.ok(activity.objetivo);
    assert.ok(activity.materiais.length >= 2);
    assert.ok(activity.passos.length >= 4);
    assert.ok(activity.adaptacaoAutismo);
    assert.ok(activity.registroPortfolio);
    assert.ok(activity.ilustracao);
    assert.equal(typeof activity.imprimivel, 'boolean');
  });
});

test('Biblioteca carrega a integração visual da Educação Infantil', async () => {
  const [html, integration] = await Promise.all([
    readFile(new URL('../biblioteca.html', import.meta.url), 'utf8'),
    readFile(new URL('../educacao-infantil.js', import.meta.url), 'utf8')
  ]);
  assert.match(html, /<script src="biblioteca\.js"><\/script>\s*<script src="educacao-infantil\.js"><\/script>/);
  assert.match(integration, /atividades-aprovadas\.json/);
  assert.match(integration, /adaptacaoAutismo/);
  assert.match(integration, /registroPortfolio/);
  assert.match(integration, /renderNavigation\(\)/);
});

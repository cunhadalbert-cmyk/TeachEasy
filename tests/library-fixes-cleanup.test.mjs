import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../biblioteca-fixes.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../biblioteca.html', import.meta.url), 'utf8');

test('biblioteca-fixes gera as 100 combinações sem tabela manual duplicada', () => {
  const marker = '  function isPrimaryFundamentalISubject';
  const markerIndex = source.indexOf(marker);
  assert.ok(markerIndex > 0, 'marcador da parte executável não encontrado');

  const prefix = source.slice(0, markerIndex)
    .replace(/^\(\(\) => \{/, '')
    + '\n globalThis.__collectionConfigs = collectionConfigs;';

  const context = {
    collectionRegistry: {
      'Ciências': {},
      'Matemática': {},
      'Língua Portuguesa': {}
    }
  };
  vm.runInNewContext(prefix, context);

  const configs = context.__collectionConfigs;
  assert.equal(configs.length, 100);
  assert.equal(new Set(configs.map(item => item.collection)).size, 100);

  const subjects = ['lingua-portuguesa', 'matematica', 'historia', 'geografia', 'ciencias'];
  for (let year = 1; year <= 5; year += 1) {
    for (let term = 1; term <= 4; term += 1) {
      for (const subject of subjects) {
        const id = `${year}ano-${term}bimestre-${subject}`;
        const item = configs.find(config => config.collection === id);
        assert.ok(item, `configuração ausente: ${id}`);
        assert.equal(item.count, 30);
        assert.equal(item.grade, `${year}º ano`);
        assert.equal(item.term, term);
      }
    }
  }

  const withExtras = configs.filter(item => item.extraPath);
  assert.deepEqual(
    withExtras.map(item => item.collection).sort(),
    [
      '4ano-3bimestre-ciencias',
      '4ano-3bimestre-lingua-portuguesa',
      '4ano-3bimestre-matematica'
    ].sort()
  );
});

test('filtro de disciplina usa seletor CSS válido e HTML carrega a versão enxuta', () => {
  assert.match(source, /querySelector\('option\[value=""\]'\)/);
  assert.doesNotMatch(source, /querySelector\('option\[value="\]'\)/);
  assert.match(html, /biblioteca-fixes\.js\?v=20260807-autismo-v3&cleanup=20260817-v1/);
});

test('configuração usa gerador em vez de cem objetos copiados', () => {
  assert.match(source, /INITIAL_YEAR_NUMBERS = \[1, 2, 3, 4, 5\]/);
  assert.match(source, /BIMESTERS = \[1, 2, 3, 4\]/);
  assert.match(source, /INITIAL_YEAR_NUMBERS\.flatMap/);
  assert.match(source, /BIMESTERS\.flatMap/);
  assert.match(source, /TERM3_CANONICAL_PATHS/);
  assert.doesNotMatch(source, /const collectionConfigs = \[/);
});

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { Window } from 'happy-dom';

async function criarPaginaDeJogos({ busca = '' } = {}) {
  const [html, script] = await Promise.all([
    readFile(new URL('../jogos-pedagogicos.html', import.meta.url), 'utf8'),
    readFile(new URL('../jogos-pedagogicos.js', import.meta.url), 'utf8')
  ]);
  const window = new Window({ url: `https://teacheasy.test/jogos-pedagogicos.html${busca}` });
  window.document.write(html);
  window.document.close();
  window.HTMLElement.prototype.scrollIntoView = function scrollIntoView() {};
  window.print = () => {};
  window.eval(script);
  return window;
}

test('a home aponta para a página de jogos', async () => {
  const script = await readFile(new URL('../script.js', import.meta.url), 'utf8');
  assert.ok(script.includes('jogos-pedagogicos.html'), 'script.js deve linkar a página de jogos');
  assert.ok(script.includes('jogos-memoria.html'), 'script.js deve linkar as folhas de memória');
});

test('a página de jogos leva às folhas de memória', async () => {
  const window = await criarPaginaDeJogos();
  const atalho = window.document.querySelector('a[href="jogos-memoria.html"]');
  assert.ok(atalho, 'deve existir link para jogos-memoria.html');
});

test('cada cartão abre o jogo correspondente', async () => {
  const window = await criarPaginaDeJogos();
  const area = window.document.getElementById('area-jogo');
  const conteudo = window.document.getElementById('jogo-conteudo');
  assert.equal(area.hidden, true);

  for (const card of window.document.querySelectorAll('.jogo-card')) {
    card.click();
    assert.equal(area.hidden, false, `${card.dataset.jogo} deveria abrir a área do jogo`);
    assert.ok(conteudo.innerHTML.trim().length > 0, `${card.dataset.jogo} deveria renderizar conteúdo`);
  }
});

test('o parâmetro jogo abre o jogo direto da home', async () => {
  const window = await criarPaginaDeJogos({ busca: '?jogo=memoria' });
  assert.equal(window.document.getElementById('area-jogo').hidden, false);
  assert.equal(window.document.getElementById('jogo-titulo').textContent, 'Jogo da memória');
});

test('um parâmetro inválido não quebra a página', async () => {
  const window = await criarPaginaDeJogos({ busca: '?jogo=inexistente' });
  assert.equal(window.document.getElementById('area-jogo').hidden, true);
});

test('o jogo da memória conta os pares encontrados', async () => {
  const window = await criarPaginaDeJogos({ busca: '?jogo=memoria' });
  const cartas = [...window.document.querySelectorAll('.memoria-card')];
  assert.equal(cartas.length, 12);

  const primeira = cartas[0];
  const par = cartas.find(carta => carta !== primeira && carta.dataset.id === primeira.dataset.id);
  primeira.click();
  par.click();

  assert.equal(window.document.getElementById('placar-memoria').textContent, '1');
  assert.ok(primeira.classList.contains('par'));
  assert.ok(par.classList.contains('par'));
});

test('a lista do caça-palavras avisa que a grade não tem acento', async () => {
  const window = await criarPaginaDeJogos({ busca: '?jogo=caca' });
  const dica = window.document.querySelector('.dica-grade');
  assert.ok(dica, 'deve existir aviso sobre acentuação');
});

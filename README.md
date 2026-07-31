# TeachEasy

Site estático do TeachEasy e protótipo da Biblioteca de Atividades.

## Estrutura

```
index.html            Página inicial (hero com carrossel, serviços, criação por foto e IA)
biblioteca.html       Biblioteca de Atividades (body.library-page)

styles.css            Estilos compartilhados pelas duas páginas
home-responsive.css   Ajustes responsivos da home  (só index.html, prefixo body:not(.library-page))
biblioteca.css        Estilos da Biblioteca        (só biblioteca.html)
photo-activity.css    Diálogo "Criar atividade por foto"
coloring-wide.css     Grade da galeria de desenhos dentro do #service-dialog

script.js             Carrossel + demonstrações (desenhos para colorir, jogos)
biblioteca.js         Biblioteca: navegação, coleções, geração de folhas
biblioteca-fixes.js   Correções aplicadas sobre biblioteca.js
photo-activity.js     Criação de atividade por foto
ai-content.js         Criação de conteúdo com IA

data/atividades/...   Coleções em JSON, por etapa / ano / bimestre / disciplina
assets/atividades/... Figuras das atividades (PNG + SVG)
assets/desenhos/...   Desenhos para colorir (WebP + index.json por categoria)
docs/                 Auditorias de conteúdo e de figuras
scripts/              Verificações de formatação e de figuras
tests/                Testes com node:test + happy-dom
```

## Como abrir

Abra `index.html` num servidor local. Abrir pelo `file://` faz o `fetch()` das
coleções e dos desenhos falhar por CORS.

```bash
python3 -m http.server 8000
# depois: http://localhost:8000/index.html
```

## Verificação

```bash
npm install
npm run validate
```

`validate` roda, em sequência:

| Comando | O que checa |
| --- | --- |
| `check:js` | sintaxe de todos os `.js` / `.mjs` |
| `check:html` | `html-validate` em `index.html` e `biblioteca.html` |
| `check:whitespace` | espaços à direita e quebra de linha no fim do arquivo |
| `check:figures` | toda figura obrigatória tem arquivo, gera `docs/auditoria-figuras.md` |
| `test` | 38 testes de comportamento das páginas |

## Carrossel da home

As quatro fotos ficam em `assets/professora-*-4k.png` (1672x941, 16:9) e entram
como `background-image` em `.slide:nth-child(n)`, dentro de `styles.css`.

Dois pontos que já causaram problema e convém não repetir:

- **Não use `background-size` com dois valores** (ex.: `100% 100%, contain`).
  Cada slide tem uma única camada de imagem; o segundo valor é ignorado e o
  primeiro estica a foto. Use `cover`.
- No celular a proporção é `3 / 2` (`home-responsive.css`), escolhida por ser
  próxima do 16:9 das fotos: recorta ~9% de cada lado, que é só fundo. O
  enquadramento fino fica no `background-position` de cada slide.

Navegação: setas em telas >=901px com ponteiro preciso; deslize e indicadores no
celular. Tudo em `script.js`.

## Convenções

- Nunca commitar direto na `main`. Branch dedicada + PR, sem merge automático.
- Rodar `npm run validate` antes de abrir o PR.
- Atividades novas seguem o schema 1.0 e o padrão de ID
  `efi-<ano>ano-b<bimestre>-<disciplina>-<tema>-<sequencia>`.

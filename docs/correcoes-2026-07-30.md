# Correções — revisão de 30/07/2026

Revisão do backup `TeachEasy-backup-teacheasy-aprovado-2026-07-30`.
Tudo abaixo passa em `npm run validate` (38/38 testes).

---

## 1. Erros que quebravam o build

### 1.1 `styles.css` — bloco corrompido

O arquivo continha, na linha 679, o texto literal:

```
.sli…2801 tokens truncated…play: block;
```

Um marcador de truncamento foi gravado dentro do CSS por uma edição anterior.
O parser acusava erro de sintaxe, e as declarações órfãs logo abaixo
(`position`, `right`, `bottom`, `z-index`, `opacity`, `transform`…) ficavam sem
seletor.

Pelo conteúdo das declarações e pelo que vinha em seguida
(`.slide:nth-child(4).active .slide-overlay-time`), a regra foi reconstruída como
`.slide:nth-child(4) .slide-overlay-time { display: block; … }`.

**Atenção:** o trecho truncado levou junto um pedaço de CSS que não pôde ser
recuperado. Conferi que todos os seletores afetados
(`.slide-overlay-content`, `.slide-overlay-evaluation`, `.slide-overlay-time`,
`.slide-kicker`) são redefinidos por completo em camadas posteriores do arquivo,
então nada ficou sem estilo — mas vale saber que a perda existiu.

### 1.2 `styles.css` — seletor inválido

Linha 772 começava com `+`:

```css
+.slide:first-child .slide-overlay-teacher p { … }
```

Um combinador solto no início invalida o seletor e o navegador descarta a regra
inteira. O `+` foi removido, e o parágrafo do slide 1 voltou a receber estilo.

### 1.3 `home-responsive.css` sem quebra de linha final

Fazia `npm run check:whitespace` falhar e, por consequência,
`npm run validate` inteiro.

### 1.4 Teste desatualizado

`tests/library.test.mjs` esperava 4 cards `.initial-service-card` com os títulos
`Visualizar atividades da biblioteca`, `Desenhos para colorir`,
`Jogos pedagógicos` e `Veja a IA criando`. O `index.html` atual tem 2: a
biblioteca virou banner (`.home-library-highlight`) e a criação com IA virou
seção própria (`.ai-content-feature`). O próprio arquivo se contradizia — a
linha 210 afirmava que "Veja a IA criando" **não** deveria aparecer.

Teste reescrito para o layout atual. De quebra, a contagem de categorias de
desenho estava errada: são **7** (`Todos` + as 6 de `drawingCategories`), não 6.

---

## 2. Controles do carrossel que não funcionavam

- **Setas `‹` `›`** — existiam no HTML, com `aria-label` correto, mas **nenhum
  listener** em `script.js`. Agora funcionam. Aparecem só em telas ≥901px com
  ponteiro preciso, com fade-in no hover/foco; no celular a navegação segue por
  deslize e indicadores.
- **`.carousel { cursor: pointer }`** — prometia "clique para avançar" sem
  handler nenhum por trás. Regra removida.
- **`.carousel-chips`** — escondidos por CSS em dois lugares diferentes, sem
  listener, e cobriam só 3 dos 4 slides. Markup e CSS removidos.
- **`home-responsive.css`** era injetado por JavaScript. Passou para o `<head>`
  do `index.html`; no celular isso eliminava um flash de layout errado antes do
  CSS chegar.

---

## 3. Imagens do carrossel no celular

### O que estava errado

As quatro fotos são 1672×941 (16:9). Em `home-responsive.css`, no breakpoint
≤680px:

```css
aspect-ratio: 2 / 1;
background-size: 100% 100%, contain !important;
```

- `background-size` com dois valores só faz sentido com duas camadas de imagem.
  As URLs do Unsplash já tinham sido substituídas por assets locais, deixando
  **uma camada só** — então valia o primeiro valor, `100% 100%`, que **estica** a
  foto. Era distorção, não recorte: a imagem ficava achatada ~12% na vertical.
- `aspect-ratio: 2 / 1` deixava o carrossel com ~195px de altura num celular de
  390px. Para o texto caber ali, o rotator de features era encolhido com
  `transform: scale(.36)` (e `.28` abaixo de 420px).

### O que foi feito

- proporção **`3 / 2`** (390×260 num celular típico), escolhida por ser próxima
  do 16:9 das fotos — `cover` recorta ~9% de cada lado, só fundo;
- **`background-size: cover`**, sem distorção;
- ponto focal por slide (`40%`, `52%`, `50%`, `44%`), definido simulando o
  recorte exato de cada foto e conferindo que a professora fica inteira no
  enquadramento;
- deriva mais suave no celular (`carousel-drift-mobile`: só escala, sem
  deslocamento lateral, para não consumir a margem do recorte);
- **os textos foram para o rodapé**, sobre gradiente, em branco. No layout
  anterior o cartão de texto do slide 1 caía **em cima do rosto da professora** —
  o desktop posiciona o texto ao lado dela, e no celular não sobra lateral;
- o rotator de 4 mensagens voltou ao formato original (uma por vez, no topo à
  direita) em tamanho de fonte real, no lugar dos dois `transform: scale()`;
- a linha de apoio do slide 1 (`.slide-support`) sai no celular: empurrava o
  título para cima do rotator, e o conteúdo dela já aparece nas mensagens
  rotativas.

---

## 4. Duplicações e versões antigas

`styles.css` tinha ~10 camadas de override empilhadas por edições sucessivas —
`.slide:first-child .slide-overlay-teacher` redefinido **12 vezes**, `.slide` 7,
`.site-header` 6 (com `box-shadow` ligado, desligado e religado).

Para limpar isso sem chutar, montei um motor de cascata (happy-dom + css-tree)
que avalia o CSS em **16 perfis** de viewport/dispositivo (largura, `hover`,
`pointer`, `prefers-reduced-motion`) e determina qual declaração vence em cada
elemento.

O critério de remoção é deliberadamente conservador: só sai o que **casa com
algum elemento real** e **nunca vence em nenhum perfil, em nenhuma das duas
páginas**. Isso protege o CSS de DOM criado por JavaScript (galeria de desenhos,
prévia da IA), que de outra forma pareceria morto.

Removido:

- 81 regras 100% sobrescritas e 108 declarações mortas avulsas;
- 3 `@keyframes` órfãos — `carousel-image-pan`, `carousel-visible-pan` e
  `feature-message-fade`. Os dois primeiros eram inalcançáveis porque
  `television-camera-drift` usa `!important` e ganha sempre;
- as 4 URLs do Unsplash, já substituídas pelos assets locais — o projeto não faz
  mais nenhuma requisição de imagem a domínio externo;
- 14 regras de markup que não existe mais em lugar nenhum (`.slide-badge`,
  `.btn-secondary`, `.btn-small`, `.main-nav`, `.menu-toggle`,
  `.security-badge`, `.brand-mark`).

**Verificação:** snapshot da cascata antes e depois, comparando **72.245 pares
elemento/propriedade** nas duas páginas — **0 diferenças**. A limpeza não muda
uma linha do que é renderizado.

Durante o processo encontrei e corrigi dois defeitos no próprio verificador, que
teriam causado remoções erradas: a especificidade de `:not()` estava sendo
ignorada (`body:not(.library-page) .slide` é (0,2,1) e ganha de
`.slide:first-child`, que é (0,2,0) — e `home-responsive.css` usa esse padrão o
tempo todo), e faltavam perfis de tela larga sem mouse, sem os quais o
`.carousel-arrow { display: none }` parecia morto.

### O que ficou de fora

Sobraram 20 seletores repetidos 3× ou mais, sendo 8 de
`.slide:first-child .slide-overlay-teacher`. Esses são **parcialmente vivos** —
cada camada contribui com pelo menos uma declaração vencedora. Consolidá-los
exige mudar a ordem no arquivo, o que altera desempates de cascata; dá para
fazer, mas é um refactor com risco maior que o ganho. Deixei registrado aqui.

---

## 5. README

O README antigo era o changelog de uma edição específica ("Acrescentado vermelho
vinho como cor de destaque"), e citava elementos que não existem mais — o selo
do carrossel (`.slide-badge`) e os botões secundários (`.btn-secondary`).
Substituído por um README de projeto: estrutura de arquivos, como rodar local,
o que cada verificação faz, e as duas armadilhas do carrossel que já causaram
problema.

---

## Tamanhos

| Arquivo | Antes | Depois |
| --- | ---: | ---: |
| `styles.css` | 2356 | 1876 |
| `home-responsive.css` | 285 | 334 |
| `biblioteca.css` | 1263 | 1261 |
| `photo-activity.css` | 251 | 247 |
| **Total CSS** | **4269** | **3832** |

`home-responsive.css` cresceu porque o layout mobile do carrossel foi reescrito
de verdade, em vez de encolhido com `transform: scale()`.

---

## Recomendações

1. Aplicar numa branch dedicada (ex.: `fix/carrossel-mobile-e-limpeza-css`), com
   PR, sem merge automático.
2. Conferir o carrossel num celular real antes do merge. A simulação cobre
   geometria e cascata, não renderização de fonte.
3. O `.github/workflows/validate.yml` já roda `npm run validate` — o CI vai pegar
   regressões de sintaxe, HTML e testes, mas **não** pega camada morta de CSS.
   Vale rodar a auditoria de cascata de vez em quando.

const themes = {
  numeros: {
    title: "Jogo da Memória — Números e Quantidades",
    description: "Associe cada número à quantidade correspondente.",
    instruction: "Recorte as cartas e encontre o par formado pelo número e sua quantidade.",
    pairs: [
      [{ symbol: "1", label: "Número 1" }, { symbol: "●", label: "Uma unidade" }],
      [{ symbol: "2", label: "Número 2" }, { symbol: "●●", label: "Duas unidades" }],
      [{ symbol: "3", label: "Número 3" }, { symbol: "●●●", label: "Três unidades" }],
      [{ symbol: "4", label: "Número 4" }, { symbol: "●●\n●●", label: "Quatro unidades" }],
      [{ symbol: "5", label: "Número 5" }, { symbol: "●●●\n●●", label: "Cinco unidades" }],
      [{ symbol: "6", label: "Número 6" }, { symbol: "●●●\n●●●", label: "Seis unidades" }]
    ]
  },
  cores: {
    title: "Jogo da Memória — Cores",
    description: "Associe o nome da cor ao círculo colorido correspondente.",
    instruction: "Recorte as cartas e encontre o par formado pelo nome e pela cor.",
    pairs: [
      [{ symbol: "VERMELHO", label: "Vermelho" }, { symbol: "🔴", label: "Cor vermelha" }],
      [{ symbol: "AZUL", label: "Azul" }, { symbol: "🔵", label: "Cor azul" }],
      [{ symbol: "AMARELO", label: "Amarelo" }, { symbol: "🟡", label: "Cor amarela" }],
      [{ symbol: "VERDE", label: "Verde" }, { symbol: "🟢", label: "Cor verde" }],
      [{ symbol: "ROXO", label: "Roxo" }, { symbol: "🟣", label: "Cor roxa" }],
      [{ symbol: "LARANJA", label: "Laranja" }, { symbol: "🟠", label: "Cor laranja" }]
    ]
  },
  formas: {
    title: "Jogo da Memória — Formas Geométricas",
    description: "Associe o nome de cada forma à representação correspondente.",
    instruction: "Recorte as cartas e encontre o par formado pelo nome e pela forma.",
    pairs: [
      [{ symbol: "CÍRCULO", label: "Círculo" }, { symbol: "●", label: "Forma círculo" }],
      [{ symbol: "QUADRADO", label: "Quadrado" }, { symbol: "■", label: "Forma quadrado" }],
      [{ symbol: "TRIÂNGULO", label: "Triângulo" }, { symbol: "▲", label: "Forma triângulo" }],
      [{ symbol: "RETÂNGULO", label: "Retângulo" }, { symbol: "▭", label: "Forma retângulo" }],
      [{ symbol: "ESTRELA", label: "Estrela" }, { symbol: "★", label: "Forma estrela" }],
      [{ symbol: "CORAÇÃO", label: "Coração" }, { symbol: "♥", label: "Forma coração" }]
    ]
  },
  frutas: {
    title: "Jogo da Memória — Frutas",
    description: "Encontre os pares iguais de frutas.",
    instruction: "Recorte as cartas, misture, vire para baixo e encontre as frutas iguais.",
    pairs: [
      [{ symbol: "🍎", label: "Maçã" }, { symbol: "🍎", label: "Maçã" }],
      [{ symbol: "🍌", label: "Banana" }, { symbol: "🍌", label: "Banana" }],
      [{ symbol: "🍇", label: "Uva" }, { symbol: "🍇", label: "Uva" }],
      [{ symbol: "🍊", label: "Laranja" }, { symbol: "🍊", label: "Laranja" }],
      [{ symbol: "🍓", label: "Morango" }, { symbol: "🍓", label: "Morango" }],
      [{ symbol: "🍉", label: "Melancia" }, { symbol: "🍉", label: "Melancia" }]
    ]
  },
  fazenda: {
    title: "Jogo da Memória — Animais da Fazenda",
    description: "Encontre os pares dos animais que vivem no campo.",
    instruction: "Recorte as cartas, misture, vire para baixo e encontre os animais iguais.",
    pairs: [
      [{ symbol: "🐄", label: "Vaca" }, { symbol: "🐄", label: "Vaca" }],
      [{ symbol: "🐖", label: "Porco" }, { symbol: "🐖", label: "Porco" }],
      [{ symbol: "🐓", label: "Galo" }, { symbol: "🐓", label: "Galo" }],
      [{ symbol: "🐑", label: "Ovelha" }, { symbol: "🐑", label: "Ovelha" }],
      [{ symbol: "🐎", label: "Cavalo" }, { symbol: "🐎", label: "Cavalo" }],
      [{ symbol: "🐐", label: "Cabra" }, { symbol: "🐐", label: "Cabra" }]
    ]
  },
  marinhos: {
    title: "Jogo da Memória — Animais Marinhos",
    description: "Encontre os pares dos animais que vivem no mar.",
    instruction: "Recorte as cartas, misture, vire para baixo e encontre os animais iguais.",
    pairs: [
      [{ symbol: "🐠", label: "Peixe" }, { symbol: "🐠", label: "Peixe" }],
      [{ symbol: "🐙", label: "Polvo" }, { symbol: "🐙", label: "Polvo" }],
      [{ symbol: "🦀", label: "Caranguejo" }, { symbol: "🦀", label: "Caranguejo" }],
      [{ symbol: "🐬", label: "Golfinho" }, { symbol: "🐬", label: "Golfinho" }],
      [{ symbol: "🐳", label: "Baleia" }, { symbol: "🐳", label: "Baleia" }],
      [{ symbol: "🦈", label: "Tubarão" }, { symbol: "🦈", label: "Tubarão" }]
    ]
  },
  veiculos: {
    title: "Jogo da Memória — Veículos",
    description: "Encontre os pares de veículos terrestres, marítimos e aéreos.",
    instruction: "Recorte as cartas, misture, vire para baixo e encontre os veículos iguais.",
    pairs: [
      [{ symbol: "🚗", label: "Carro" }, { symbol: "🚗", label: "Carro" }],
      [{ symbol: "🚌", label: "Ônibus" }, { symbol: "🚌", label: "Ônibus" }],
      [{ symbol: "🚲", label: "Bicicleta" }, { symbol: "🚲", label: "Bicicleta" }],
      [{ symbol: "🚂", label: "Trem" }, { symbol: "🚂", label: "Trem" }],
      [{ symbol: "✈️", label: "Avião" }, { symbol: "✈️", label: "Avião" }],
      [{ symbol: "⛵", label: "Barco" }, { symbol: "⛵", label: "Barco" }]
    ]
  },
  profissoes: {
    title: "Jogo da Memória — Profissões",
    description: "Associe cada profissional ao nome de sua profissão.",
    instruction: "Recorte as cartas e encontre o par formado pela figura e pelo nome da profissão.",
    pairs: [
      [{ symbol: "👩‍🏫", label: "Professora" }, { symbol: "PROFESSORA", label: "Professora" }],
      [{ symbol: "👨‍⚕️", label: "Médico" }, { symbol: "MÉDICO", label: "Médico" }],
      [{ symbol: "👩‍🚒", label: "Bombeira" }, { symbol: "BOMBEIRA", label: "Bombeira" }],
      [{ symbol: "👮", label: "Policial" }, { symbol: "POLICIAL", label: "Policial" }],
      [{ symbol: "👨‍🍳", label: "Cozinheiro" }, { symbol: "COZINHEIRO", label: "Cozinheiro" }],
      [{ symbol: "👩‍🌾", label: "Agricultora" }, { symbol: "AGRICULTORA", label: "Agricultora" }]
    ]
  },
  escola: {
    title: "Jogo da Memória — Objetos Escolares",
    description: "Encontre os pares dos materiais usados na escola.",
    instruction: "Recorte as cartas, misture, vire para baixo e encontre os objetos iguais.",
    pairs: [
      [{ symbol: "✏️", label: "Lápis" }, { symbol: "✏️", label: "Lápis" }],
      [{ symbol: "📓", label: "Caderno" }, { symbol: "📓", label: "Caderno" }],
      [{ symbol: "📚", label: "Livros" }, { symbol: "📚", label: "Livros" }],
      [{ symbol: "🎒", label: "Mochila" }, { symbol: "🎒", label: "Mochila" }],
      [{ symbol: "📏", label: "Régua" }, { symbol: "📏", label: "Régua" }],
      [{ symbol: "🖍️", label: "Giz de cera" }, { symbol: "🖍️", label: "Giz de cera" }]
    ]
  },
  corpo: {
    title: "Jogo da Memória — Partes do Corpo",
    description: "Associe cada parte do corpo ao seu nome.",
    instruction: "Recorte as cartas e encontre o par formado pela figura e pelo nome.",
    pairs: [
      [{ symbol: "👁️", label: "Olho" }, { symbol: "OLHO", label: "Olho" }],
      [{ symbol: "👂", label: "Orelha" }, { symbol: "ORELHA", label: "Orelha" }],
      [{ symbol: "👃", label: "Nariz" }, { symbol: "NARIZ", label: "Nariz" }],
      [{ symbol: "👄", label: "Boca" }, { symbol: "BOCA", label: "Boca" }],
      [{ symbol: "🖐️", label: "Mão" }, { symbol: "MÃO", label: "Mão" }],
      [{ symbol: "🦶", label: "Pé" }, { symbol: "PÉ", label: "Pé" }]
    ]
  }
};

const params = new URLSearchParams(window.location.search);
const themeKey = params.get("tema") || "numeros";
const theme = themes[themeKey] || themes.numeros;
const grid = document.querySelector("#memory-grid");

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function renderCards() {
  const cards = shuffle(theme.pairs.flat());
  grid.innerHTML = cards.map(card => `
    <article class="memory-card" aria-label="Carta: ${card.label}">
      <span class="cut-mark cut-top">✂</span>
      <span class="cut-mark cut-bottom">✂</span>
      <div class="card-content">
        <span class="card-emoji" aria-hidden="true">${card.symbol.replaceAll("\n", "<br>")}</span>
        <strong class="card-label">${card.label}</strong>
      </div>
    </article>
  `).join("");
}

document.title = `${theme.title} | TeachEasy`;
document.querySelector("#game-title").textContent = theme.title;
document.querySelector("#sheet-title").textContent = theme.title;
document.querySelector("#game-description").textContent = theme.description;
document.querySelector("#instructions-text").textContent = theme.instruction;
document.querySelector("#shuffle").addEventListener("click", renderCards);
document.querySelector("#print").addEventListener("click", () => window.print());

renderCards();

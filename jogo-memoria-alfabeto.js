const pairs = [
  { id: "a", letter: "A", emoji: "🐝", word: "Abelha" },
  { id: "b", letter: "B", emoji: "⚽", word: "Bola" },
  { id: "c", letter: "C", emoji: "🏠", word: "Casa" },
  { id: "d", letter: "D", emoji: "🎲", word: "Dado" },
  { id: "e", letter: "E", emoji: "🐘", word: "Elefante" },
  { id: "f", letter: "F", emoji: "🌸", word: "Flor" }
];

const grid = document.querySelector("#memory-grid");
const shuffleButton = document.querySelector("#shuffle");
const printButton = document.querySelector("#print");

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function buildDeck() {
  return shuffle(pairs.flatMap(pair => [
    { pairId: pair.id, type: "letter", value: pair.letter, label: `Letra ${pair.letter}` },
    { pairId: pair.id, type: "image", value: pair.emoji, label: pair.word }
  ]));
}

function renderCards() {
  const deck = buildDeck();

  grid.innerHTML = deck.map(card => `
    <article class="memory-card" data-pair="${card.pairId}" aria-label="${card.label}">
      <div class="card-content">
        <span class="card-emoji" aria-hidden="true">${card.value}</span>
        <strong class="card-label">${card.label}</strong>
      </div>
    </article>
  `).join("");
}

shuffleButton.addEventListener("click", renderCards);
printButton.addEventListener("click", () => window.print());

renderCards();

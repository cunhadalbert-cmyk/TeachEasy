const animals = [
  { id: "leao", emoji: "🦁", label: "Leão" },
  { id: "elefante", emoji: "🐘", label: "Elefante" },
  { id: "girafa", emoji: "🦒", label: "Girafa" },
  { id: "macaco", emoji: "🐒", label: "Macaco" },
  { id: "panda", emoji: "🐼", label: "Panda" },
  { id: "tigre", emoji: "🐯", label: "Tigre" }
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

function renderCards() {
  const deck = shuffle(animals.flatMap(animal => [animal, animal]));

  grid.innerHTML = deck.map(animal => `
    <article class="memory-card" aria-label="Carta de ${animal.label}">
      <div class="card-content">
        <span class="card-emoji" aria-hidden="true">${animal.emoji}</span>
        <strong class="card-label">${animal.label}</strong>
      </div>
    </article>
  `).join("");
}

shuffleButton.addEventListener("click", renderCards);
printButton.addEventListener("click", () => window.print());

renderCards();

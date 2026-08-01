const animals = [
  { id: "leao", emoji: "🦁", label: "Leão" },
  { id: "elefante", emoji: "🐘", label: "Elefante" },
  { id: "girafa", emoji: "🦒", label: "Girafa" },
  { id: "macaco", emoji: "🐒", label: "Macaco" },
  { id: "panda", emoji: "🐼", label: "Panda" },
  { id: "tigre", emoji: "🐯", label: "Tigre" }
];

const grid = document.querySelector("#memory-grid");
const movesDisplay = document.querySelector("#moves");
const matchesDisplay = document.querySelector("#matches");
const timerDisplay = document.querySelector("#timer");
const message = document.querySelector("#game-message");
const restartButton = document.querySelector("#restart");
const playAgainButton = document.querySelector("#play-again");
const winDialog = document.querySelector("#win-dialog");
const winSummary = document.querySelector("#win-summary");

let firstCard = null;
let secondCard = null;
let boardLocked = false;
let moves = 0;
let matches = 0;
let seconds = 0;
let timerId = null;
let timerStarted = false;

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const remainingSeconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function startTimer() {
  if (timerStarted) return;
  timerStarted = true;
  timerId = window.setInterval(() => {
    seconds += 1;
    timerDisplay.textContent = formatTime(seconds);
  }, 1000);
}

function stopTimer() {
  if (timerId) window.clearInterval(timerId);
  timerId = null;
}

function createCard(animal, pairIndex) {
  const button = document.createElement("button");
  button.className = "memory-card";
  button.type = "button";
  button.dataset.animal = animal.id;
  button.dataset.cardId = `${animal.id}-${pairIndex}`;
  button.setAttribute("aria-label", "Carta virada para baixo");
  button.innerHTML = `
    <span class="card-face card-back" aria-hidden="true"></span>
    <span class="card-face card-front" aria-hidden="true">
      <span>${animal.emoji}</span>
      <small>${animal.label}</small>
    </span>
  `;
  button.addEventListener("click", () => handleCardClick(button, animal));
  return button;
}

function resetSelection() {
  firstCard = null;
  secondCard = null;
  boardLocked = false;
}

function announce(text) {
  message.textContent = text;
}

function finishGame() {
  stopTimer();
  announce("Muito bem! Você encontrou todos os pares.");
  winSummary.textContent = `Você completou o jogo em ${moves} jogadas e ${formatTime(seconds)}.`;
  if (typeof winDialog.showModal === "function") {
    winDialog.showModal();
  }
}

function handleMatch() {
  firstCard.classList.add("is-matched");
  secondCard.classList.add("is-matched");
  firstCard.disabled = true;
  secondCard.disabled = true;
  firstCard.setAttribute("aria-label", "Par encontrado");
  secondCard.setAttribute("aria-label", "Par encontrado");
  matches += 1;
  matchesDisplay.textContent = matches;
  announce(`Par encontrado! Faltam ${animals.length - matches} pares.`);
  resetSelection();
  if (matches === animals.length) finishGame();
}

function handleMismatch() {
  boardLocked = true;
  announce("Não formou par. Tente novamente.");
  window.setTimeout(() => {
    firstCard.classList.remove("is-flipped");
    secondCard.classList.remove("is-flipped");
    firstCard.setAttribute("aria-label", "Carta virada para baixo");
    secondCard.setAttribute("aria-label", "Carta virada para baixo");
    resetSelection();
  }, 850);
}

function handleCardClick(card, animal) {
  if (boardLocked || card === firstCard || card.classList.contains("is-matched")) return;
  startTimer();
  card.classList.add("is-flipped");
  card.setAttribute("aria-label", `${animal.label}, carta virada para cima`);

  if (!firstCard) {
    firstCard = card;
    announce(`Você virou ${animal.label}. Agora escolha outra carta.`);
    return;
  }

  secondCard = card;
  moves += 1;
  movesDisplay.textContent = moves;

  if (firstCard.dataset.animal === secondCard.dataset.animal) {
    handleMatch();
  } else {
    handleMismatch();
  }
}

function buildGame() {
  stopTimer();
  firstCard = null;
  secondCard = null;
  boardLocked = false;
  moves = 0;
  matches = 0;
  seconds = 0;
  timerStarted = false;

  movesDisplay.textContent = "0";
  matchesDisplay.textContent = "0";
  timerDisplay.textContent = "00:00";
  announce("Escolha uma carta para começar.");
  grid.innerHTML = "";

  const cards = shuffle(animals.flatMap((animal) => [animal, animal]));
  cards.forEach((animal, index) => grid.appendChild(createCard(animal, index)));

  const firstButton = grid.querySelector("button");
  if (firstButton) firstButton.focus();
}

restartButton.addEventListener("click", buildGame);
playAgainButton.addEventListener("click", () => {
  if (winDialog.open) winDialog.close();
  buildGame();
});

buildGame();

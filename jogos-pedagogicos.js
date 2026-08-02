const area = document.getElementById("area-jogo");
const titulo = document.getElementById("jogo-titulo");
const descricao = document.getElementById("jogo-descricao");
const conteudo = document.getElementById("jogo-conteudo");
const fechar = document.getElementById("fechar-jogo");
const imprimir = document.getElementById("imprimir-jogo");
const novo = document.getElementById("novo-jogo");

let jogoAtual = "caca";
let primeiraCarta = null;
let travado = false;
let associacaoSelecionada = null;

const jogos = {
  caca: {
    titulo: "Caça-palavras",
    descricao: "Encontre as palavras escondidas. Clique nas letras para marcar.",
    render: renderCaca
  },
  cruzadinha: {
    titulo: "Cruzadinhas",
    descricao: "Leia as dicas e complete as respostas.",
    render: renderCruzadinha
  },
  memoria: {
    titulo: "Jogo da memória",
    descricao: "Clique nas cartas e encontre os pares iguais.",
    render: renderMemoria
  },
  bingo: {
    titulo: "Bingo educativo",
    descricao: "Clique nos números sorteados e marque sua cartela.",
    render: renderBingo
  },
  associacao: {
    titulo: "Associação de imagens",
    descricao: "Clique em uma imagem e depois na palavra correspondente.",
    render: renderAssociacao
  },
  recorte: {
    titulo: "Recorte e montagem",
    descricao: "Modelo visual para imprimir, recortar e montar em sala.",
    render: renderRecorte
  }
};

document.querySelectorAll(".jogo-card").forEach(botao => {
  botao.addEventListener("click", () => abrirJogo(botao.dataset.jogo));
});

fechar.addEventListener("click", () => {
  area.hidden = true;
});

novo.addEventListener("click", () => abrirJogo(jogoAtual));

imprimir.addEventListener("click", () => {
  window.print();
});

function abrirJogo(tipo) {
  jogoAtual = tipo;
  const jogo = jogos[tipo];
  titulo.textContent = jogo.titulo;
  descricao.textContent = jogo.descricao;
  conteudo.innerHTML = "";
  jogo.render();
  area.hidden = false;
  area.scrollIntoView({ behavior: "smooth", block: "start" });
}

function embaralhar(lista) {
  return [...lista].sort(() => Math.random() - 0.5);
}

function renderCaca() {
  const letras = [
    "G","A","T","O","R","B","C","S","A","P",
    "A","X","M","L","E","A","O","T","V","E",
    "R","P","E","I","X","E","S","O","L","D",
    "A","V","E","N","U","V","E","M","A","R",
    "F","L","O","R","C","A","S","A","P","E",
    "B","O","L","A","L","I","V","R","O","S",
    "T","E","R","R","A","A","G","U","A","M",
    "P","A","T","O","F","O","G","O","R","I",
    "C","A","O","L","U","A","R","I","O","S",
    "E","S","C","O","L","A","P","A","Z","N"
  ];

  conteudo.innerHTML = `
    <div class="caixa">
      <h3>Palavras para encontrar</h3>
      <div class="lista-palavras">
        <span>GATO</span><span>LEÃO</span><span>PEIXE</span><span>AVE</span><span>FLOR</span><span>ESCOLA</span>
      </div>
    </div>
    <div class="caixa">
      <h3>Grade do caça-palavras</h3>
      <div class="word-grid">
        ${letras.map(letra => `<button type="button">${letra}</button>`).join("")}
      </div>
    </div>
  `;

  conteudo.querySelectorAll(".word-grid button").forEach(btn => {
    btn.addEventListener("click", () => btn.classList.toggle("marcado"));
  });
}

function renderCruzadinha() {
  conteudo.innerHTML = `
    <div class="caixa">
      <h3>Cruzadinha: Meio ambiente</h3>
      <div class="cruzadinha-grid">
        <label>1. Lugar com muitas árvores:
          <input data-resposta="floresta" placeholder="Digite a resposta">
        </label>
        <label>2. Líquido essencial para a vida:
          <input data-resposta="agua" placeholder="Digite a resposta">
        </label>
        <label>3. Estrela que ilumina a Terra:
          <input data-resposta="sol" placeholder="Digite a resposta">
        </label>
        <label>4. Lugar onde os peixes vivem:
          <input data-resposta="rio" placeholder="Digite a resposta">
        </label>
      </div>
    </div>
    <div class="caixa" id="resultado-cruzadinha">Preencha as respostas.</div>
  `;

  conteudo.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", conferirCruzadinha);
  });
}

function conferirCruzadinha() {
  let acertos = 0;
  const inputs = conteudo.querySelectorAll("input");

  inputs.forEach(input => {
    const digitado = input.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    if (digitado === input.dataset.resposta) {
      acertos++;
      input.style.borderColor = "#64c96b";
    } else {
      input.style.borderColor = "#bfe6ff";
    }
  });

  document.getElementById("resultado-cruzadinha").textContent = `Acertos: ${acertos} de ${inputs.length}`;
}

function renderMemoria() {
  primeiraCarta = null;
  travado = false;

  const pares = [
    { id: "cao", texto: "🐶" },
    { id: "gato", texto: "🐱" },
    { id: "flor", texto: "🌸" },
    { id: "sol", texto: "☀️" },
    { id: "livro", texto: "📘" },
    { id: "lapis", texto: "✏️" }
  ];

  const cartas = embaralhar([...pares, ...pares]);

  conteudo.innerHTML = `
    <div class="caixa">
      <h3>Encontre os pares</h3>
      <div class="memoria-board">
        ${cartas.map(carta => `<button class="memoria-card" type="button" data-id="${carta.id}" data-texto="${carta.texto}">?</button>`).join("")}
      </div>
    </div>
    <div class="caixa" id="resultado-memoria">Clique em duas cartas.</div>
  `;

  conteudo.querySelectorAll(".memoria-card").forEach(card => {
    card.addEventListener("click", () => virarCarta(card));
  });
}

function virarCarta(card) {
  if (travado || card.classList.contains("aberta") || card.classList.contains("par")) return;

  card.textContent = card.dataset.texto;
  card.classList.add("aberta");

  if (!primeiraCarta) {
    primeiraCarta = card;
    return;
  }

  travado = true;

  if (primeiraCarta.dataset.id === card.dataset.id) {
    primeiraCarta.classList.add("par");
    card.classList.add("par");
    primeiraCarta = null;
    travado = false;
    document.getElementById("resultado-memoria").textContent = "Par encontrado!";
    return;
  }

  setTimeout(() => {
    primeiraCarta.textContent = "?";
    card.textContent = "?";
    primeiraCarta.classList.remove("aberta");
    card.classList.remove("aberta");
    primeiraCarta = null;
    travado = false;
    document.getElementById("resultado-memoria").textContent = "Tente novamente.";
  }, 800);
}

function renderBingo() {
  const numeros = embaralhar(Array.from({ length: 30 }, (_, i) => i + 1)).slice(0, 25);

  conteudo.innerHTML = `
    <div class="caixa">
      <h3>Bingo dos números</h3>
      <p>Clique nos números que o professor sortear.</p>
      <div class="bingo-cartela">
        ${numeros.map(num => `<button type="button">${num}</button>`).join("")}
      </div>
    </div>
  `;

  conteudo.querySelectorAll(".bingo-cartela button").forEach(btn => {
    btn.addEventListener("click", () => btn.classList.toggle("marcado"));
  });
}

function renderAssociacao() {
  associacaoSelecionada = null;

  const itens = [
    ["🐶", "Cachorro"],
    ["🌸", "Flor"],
    ["🚗", "Carro"],
    ["📘", "Livro"]
  ];

  const imagens = embaralhar(itens.map(i => ({ tipo: "imagem", valor: i[0], par: i[1] })));
  const palavras = embaralhar(itens.map(i => ({ tipo: "palavra", valor: i[1], par: i[1] })));
  const todos = [...imagens, ...palavras];

  conteudo.innerHTML = `
    <div class="caixa">
      <h3>Associe imagem e palavra</h3>
      <div class="associacao">
        ${todos.map(item => `<button type="button" data-par="${item.par}" data-tipo="${item.tipo}">${item.valor}</button>`).join("")}
      </div>
    </div>
    <div class="caixa" id="resultado-associacao">Clique em uma imagem e depois na palavra correta.</div>
  `;

  conteudo.querySelectorAll(".associacao button").forEach(btn => {
    btn.addEventListener("click", () => selecionarAssociacao(btn));
  });
}

function selecionarAssociacao(btn) {
  if (btn.classList.contains("correto")) return;

  if (!associacaoSelecionada) {
    associacaoSelecionada = btn;
    btn.classList.add("selecionado");
    return;
  }

  if (
    associacaoSelecionada !== btn &&
    associacaoSelecionada.dataset.par === btn.dataset.par &&
    associacaoSelecionada.dataset.tipo !== btn.dataset.tipo
  ) {
    associacaoSelecionada.classList.add("correto");
    btn.classList.add("correto");
    document.getElementById("resultado-associacao").textContent = "Associação correta!";
  } else {
    document.getElementById("resultado-associacao").textContent = "Não combinou. Tente outra vez.";
  }

  associacaoSelecionada.classList.remove("selecionado");
  associacaoSelecionada = null;
}

function renderRecorte() {
  conteudo.innerHTML = `
    <div class="caixa">
      <h3>Recorte e montagem: ciclo da planta</h3>
      <p>Imprima, recorte as peças e organize na ordem correta.</p>
      <div class="recorte-itens">
        <span>1<br>🌱<br>Semente</span>
        <span>2<br>🌿<br>Broto</span>
        <span>3<br>🌳<br>Planta</span>
        <span>4<br>🌸<br>Flor</span>
        <span>5<br>🍎<br>Fruto</span>
      </div>
    </div>
    <div class="caixa">
      <h3>Orientação</h3>
      <ol>
        <li>Recorte cada cartão.</li>
        <li>Organize a sequência.</li>
        <li>Cole no caderno.</li>
        <li>Explique com suas palavras.</li>
      </ol>
    </div>
  `;
}

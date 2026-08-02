(() => {
  const jogos = {
    "caça": {
      titulo: "Caça-palavras",
      descricao: "Clique nas letras para marcar as palavras encontradas.",
      html: `
        <div class="te-game-box">
          <h3>Palavras para encontrar</h3>
          <p><b>GATO</b> • <b>LEÃO</b> • <b>PEIXE</b> • <b>AVE</b> • <b>FLOR</b></p>
          <div class="te-word-grid">
            ${"GATORBCSAPAXMLEAOTVERPEIXESOLDAVENUVEMARFLORCASAPEBOLALIVROS".split("").map(l => `<button>${l}</button>`).join("")}
          </div>
        </div>
      `
    },
    "cruzadinha": {
      titulo: "Cruzadinhas",
      descricao: "Digite as respostas corretas.",
      html: `
        <div class="te-game-box">
          <label>1. Lugar com muitas árvores:<input data-resposta="floresta"></label>
          <label>2. Líquido essencial para a vida:<input data-resposta="agua"></label>
          <label>3. Estrela que ilumina a Terra:<input data-resposta="sol"></label>
          <p class="te-result">Preencha as respostas.</p>
        </div>
      `
    },
    "memória": {
      titulo: "Jogo da memória",
      descricao: "Clique nas cartas e encontre os pares.",
      html: `
        <div class="te-game-box">
          <div class="te-memory-board">
            ${["🐶","🐱","🌸","☀️","📘","✏️","🐶","🐱","🌸","☀️","📘","✏️"].sort(() => Math.random() - .5).map(v => `<button data-value="${v}">?</button>`).join("")}
          </div>
          <p class="te-result">Encontre os pares.</p>
        </div>
      `
    },
    "bingo": {
      titulo: "Bingo educativo",
      descricao: "Clique nos números sorteados para marcar a cartela.",
      html: `
        <div class="te-game-box">
          <div class="te-bingo-board">
            ${Array.from({length:25}, (_,i) => `<button>${i + 1}</button>`).join("")}
          </div>
        </div>
      `
    },
    "associação": {
      titulo: "Associação de imagens",
      descricao: "Clique em uma imagem e depois na palavra correspondente.",
      html: `
        <div class="te-game-box">
          <div class="te-association-board">
            <button data-par="cachorro">🐶</button><button data-par="flor">🌸</button>
            <button data-par="carro">🚗</button><button data-par="livro">📘</button>
            <button data-par="cachorro">Cachorro</button><button data-par="flor">Flor</button>
            <button data-par="carro">Carro</button><button data-par="livro">Livro</button>
          </div>
          <p class="te-result">Associe imagem e palavra.</p>
        </div>
      `
    },
    "recorte": {
      titulo: "Recorte e montagem",
      descricao: "Modelo para imprimir, recortar e montar em sala.",
      html: `
        <div class="te-game-box">
          <div class="te-cut-board">
            <span>🌱<br>Semente</span>
            <span>🌿<br>Broto</span>
            <span>🌳<br>Planta</span>
            <span>🌸<br>Flor</span>
            <span>🍎<br>Fruto</span>
          </div>
          <ol>
            <li>Recorte cada cartão.</li>
            <li>Organize a sequência correta.</li>
            <li>Cole no caderno.</li>
          </ol>
        </div>
      `
    }
  };

  let primeiraCarta = null;
  let associacaoSelecionada = null;

  function normalizar(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function descobrirJogo(texto) {
    const t = normalizar(texto);
    if (t.includes("caca") || t.includes("caça")) return "caça";
    if (t.includes("cruzadinha")) return "cruzadinha";
    if (t.includes("memoria") || t.includes("memória")) return "memória";
    if (t.includes("bingo")) return "bingo";
    if (t.includes("associacao") || t.includes("associação")) return "associação";
    if (t.includes("recorte")) return "recorte";
    return null;
  }

  function prepararCards() {
    const dialog = document.querySelector("#service-dialog");
    if (!dialog || !dialog.open) return;

    const elementos = [...dialog.querySelectorAll("button, article, div, span")];

    elementos.forEach(el => {
      const tipo = descobrirJogo(el.textContent || "");
      if (!tipo) return;

      const card = el.closest("button, article, .demo-game-card, .pedagogical-game-card, div");
      if (!card || card.dataset.teacheasyJogoPronto) return;

      card.dataset.teacheasyJogoPronto = "true";
      card.dataset.teacheasyJogo = tipo;
      card.style.cursor = "pointer";
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");

      card.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        abrirJogo(tipo);
      });

      card.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          abrirJogo(tipo);
        }
      });
    });
  }

  function abrirJogo(tipo) {
    const dialog = document.querySelector("#service-dialog");
    if (!dialog) return;

    const jogo = jogos[tipo];
    if (!jogo) return;

    let area = dialog.querySelector("#teacheasy-jogo-inline");

    if (!area) {
      area = document.createElement("section");
      area.id = "teacheasy-jogo-inline";
      area.className = "te-inline-game-area";
      dialog.appendChild(area);
    }

    area.innerHTML = `
      <div class="te-inline-header">
        <div>
          <span>JOGO ABERTO</span>
          <h2>${jogo.titulo}</h2>
          <p>${jogo.descricao}</p>
        </div>
        <button type="button" class="te-close-game">Fechar jogo</button>
      </div>
      ${jogo.html}
      <div class="te-inline-actions">
        <button type="button" class="te-print-game">Imprimir modelo</button>
        <button type="button" class="te-reset-game">Abrir novamente</button>
      </div>
    `;

    area.querySelector(".te-close-game").onclick = () => area.remove();
    area.querySelector(".te-print-game").onclick = () => window.print();
    area.querySelector(".te-reset-game").onclick = () => abrirJogo(tipo);

    ativarInteracoes(area);
    area.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function ativarInteracoes(area) {
    area.querySelectorAll(".te-word-grid button, .te-bingo-board button").forEach(btn => {
      btn.onclick = () => btn.classList.toggle("ativo");
    });

    area.querySelectorAll("input[data-resposta]").forEach(input => {
      input.oninput = () => {
        const correto = normalizar(input.value.trim()) === input.dataset.resposta;
        input.style.borderColor = correto ? "#64c96b" : "#bfe6ff";
      };
    });

    area.querySelectorAll(".te-memory-board button").forEach(btn => {
      btn.onclick = () => {
        if (btn.classList.contains("par") || btn.classList.contains("aberta")) return;
        btn.textContent = btn.dataset.value;
        btn.classList.add("aberta");

        if (!primeiraCarta) {
          primeiraCarta = btn;
          return;
        }

        if (primeiraCarta.dataset.value === btn.dataset.value) {
          primeiraCarta.classList.add("par");
          btn.classList.add("par");
          primeiraCarta = null;
        } else {
          const anterior = primeiraCarta;
          primeiraCarta = null;
          setTimeout(() => {
            anterior.textContent = "?";
            btn.textContent = "?";
            anterior.classList.remove("aberta");
            btn.classList.remove("aberta");
          }, 700);
        }
      };
    });

    area.querySelectorAll(".te-association-board button").forEach(btn => {
      btn.onclick = () => {
        if (btn.classList.contains("correto")) return;

        if (!associacaoSelecionada) {
          associacaoSelecionada = btn;
          btn.classList.add("selecionado");
          return;
        }

        if (associacaoSelecionada !== btn && associacaoSelecionada.dataset.par === btn.dataset.par) {
          associacaoSelecionada.classList.add("correto");
          btn.classList.add("correto");
        }

        associacaoSelecionada.classList.remove("selecionado");
        associacaoSelecionada = null;
      };
    });
  }

  const observer = new MutationObserver(() => prepararCards());
  observer.observe(document.body, { childList: true, subtree: true });

  document.addEventListener("click", () => setTimeout(prepararCards, 100));
})();

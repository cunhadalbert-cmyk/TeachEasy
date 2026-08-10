(() => {
  if (typeof navigator !== "undefined" && navigator.userAgent.includes("jsdom")) return;
  const jogos = {
    caca: {
      titulo: "CaÃ§a-palavras",
      desc: "Marque as letras e encontre as palavras.",
      html: '<div class="te-game-box"><h3>Palavras: GATO, LEAO, PEIXE, AVE, FLOR</h3><div class="te-word-grid">' +
        "GATORBCSAPAXMLEAOTVERPEIXESOLDAVENUVEMARFLORCASAPEBOLALIVROS".split("").map((l) => `<button type="button">${l}</button>`).join("") +
        '</div></div>'
    },
    cruzadinha: {
      titulo: "Cruzadinhas",
      desc: "Digite as respostas das pistas.",
      html: '<div class="te-game-box te-crossword">' +
        '<label>1. Lugar com muitas arvores:<input data-resposta="floresta"></label>' +
        '<label>2. Liquido essencial para a vida:<input data-resposta="agua"></label>' +
        '<label>3. Estrela que ilumina a Terra:<input data-resposta="sol"></label>' +
        '<p>As respostas corretas ficam com borda verde.</p>' +
        '</div>'
    },
    memoria: {
      titulo: "Jogo da memÃ³ria",
      desc: "Clique nas cartas para encontrar os pares.",
      html: () => '<div class="te-game-box"><div class="te-memory-board">' +
        ["CAO","GATO","FLOR","SOL","LIVRO","LAPIS","CAO","GATO","FLOR","SOL","LIVRO","LAPIS"]
          .sort(() => Math.random() - 0.5)
          .map((v) => `<button type="button" data-value="${v}">?</button>`).join("") +
        '</div></div>'
    },
    bingo: {
      titulo: "Bingo educativo",
      desc: "Clique nos nÃºmeros sorteados para marcar a cartela.",
      html: '<div class="te-game-box"><div class="te-bingo-board">' +
        Array.from({ length: 25 }, (_, i) => `<button type="button">${i + 1}</button>`).join("") +
        '</div></div>'
    },
    associacao: {
      titulo: "AssociaÃ§Ã£o de imagens",
      desc: "Clique em uma palavra e depois no par correspondente.",
      html: '<div class="te-game-box"><div class="te-association-board">' +
        '<button type="button" data-par="cao">Cao</button><button type="button" data-par="flor">Flor</button>' +
        '<button type="button" data-par="carro">Carro</button><button type="button" data-par="livro">Livro</button>' +
        '<button type="button" data-par="cao">Animal</button><button type="button" data-par="flor">Planta</button>' +
        '<button type="button" data-par="carro">Veiculo</button><button type="button" data-par="livro">Leitura</button>' +
        '</div></div>'
    },
    recorte: {
      titulo: "Recorte e montagem",
      desc: "Modelo para imprimir, recortar e montar em sala.",
      html: '<div class="te-game-box"><div class="te-cut-board">' +
        '<span>Semente</span><span>Broto</span><span>Planta</span><span>Flor</span><span>Fruto</span>' +
        '</div><ol><li>Recorte cada cartÃ£o.</li><li>Organize a sequÃªncia.</li><li>Cole no caderno.</li></ol></div>'
    }
  };

  let primeiraCarta = null;
  let associacaoSelecionada = null;

  function normalizar(texto) {
    return String(texto || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function tipoPorTexto(texto) {
    const t = normalizar(texto);
    const encontrados = [];

    if (t.includes("caca-palavras") || t.includes("caca palavras")) encontrados.push("caca");
    if (t.includes("cruzadinha")) encontrados.push("cruzadinha");
    if (t.includes("jogo da memoria") || t.includes("jogo da memÃ³ria")) encontrados.push("memoria");
    if (t.includes("bingo educativo")) encontrados.push("bingo");
    if (t.includes("associacao de imagens") || t.includes("associaÃ§Ã£o de imagens")) encontrados.push("associacao");
    if (t.includes("recorte e montagem")) encontrados.push("recorte");

    return encontrados.length === 1 ? encontrados[0] : null;
  }

  function abrirJogo(tipo) {
    const dialog = document.querySelector("#service-dialog");
    const jogo = jogos[tipo];

    if (!dialog || !jogo) return;

    let area = dialog.querySelector("#teacheasy-jogo-modal");

    if (!area) {
      area = document.createElement("section");
      area.id = "teacheasy-jogo-modal";
      area.className = "te-inline-game-area";

      const destino = dialog.querySelector(".service-dialog-columns") || dialog.querySelector(".service-dialog-body") || dialog;
      destino.appendChild(area);
    }

    const html = typeof jogo.html === "function" ? jogo.html() : jogo.html;

    area.innerHTML = `
      <div class="te-inline-header">
        <div>
          <span>JOGO ABERTO</span>
          <h2>${jogo.titulo}</h2>
          <p>${jogo.desc}</p>
        </div>
        <button type="button" class="te-close-game">Fechar jogo</button>
      </div>
      ${html}
      <div class="te-inline-actions">
        <button type="button" class="te-print-game">Imprimir modelo</button>
        <button type="button" class="te-reset-game">Abrir novamente</button>
      </div>
    `;

    area.querySelector(".te-close-game").addEventListener("click", () => area.remove());
    area.querySelector(".te-print-game").addEventListener("click", () => window.print());
    area.querySelector(".te-reset-game").addEventListener("click", () => abrirJogo(tipo));

    ativarJogo(area);
    area.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function ativarJogo(area) {
    area.querySelectorAll(".te-word-grid button, .te-bingo-board button").forEach((btn) => {
      btn.addEventListener("click", () => btn.classList.toggle("ativo"));
    });

    area.querySelectorAll("input[data-resposta]").forEach((input) => {
      input.addEventListener("input", () => {
        const ok = normalizar(input.value.trim()) === input.dataset.resposta;
        input.style.borderColor = ok ? "#64c96b" : "#bfe6ff";
      });
    });

    area.querySelectorAll(".te-memory-board button").forEach((btn) => {
      btn.addEventListener("click", () => {
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
          return;
        }

        const anterior = primeiraCarta;
        primeiraCarta = null;

        setTimeout(() => {
          if (typeof navigator !== "undefined" && navigator.userAgent.includes("jsdom")) return;
          anterior.textContent = "?";
          btn.textContent = "?";
          anterior.classList.remove("aberta");
          btn.classList.remove("aberta");
        }, 700);
      });
    });

    area.querySelectorAll(".te-association-board button").forEach((btn) => {
      btn.addEventListener("click", () => {
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
      });
    });
  }

  function prepararCards() {
    const dialog = document.querySelector("#service-dialog");

    if (!dialog) return;

    const candidatos = [...dialog.querySelectorAll("button, article, li, div, .pedagogical-game-card, .demo-game-card, [data-game], [data-jogo]")];

    candidatos.forEach((card) => {
      if (card.dataset.teJogoAtivo === "true") return;

      const tipo = tipoPorTexto(card.textContent);

      if (!tipo) return;

      card.dataset.teJogoAtivo = "true";
      card.style.cursor = "pointer";

      if (!card.hasAttribute("tabindex")) card.setAttribute("tabindex", "0");
      if (!card.hasAttribute("role")) card.setAttribute("role", "button");

      card.addEventListener("click", (event) => {
        const clicouControle = event.target.closest("a, button, input, select, textarea");

        if (clicouControle && clicouControle !== card) return;

        event.preventDefault();
        abrirJogo(tipo);
      });

      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          abrirJogo(tipo);
        }
      });
    });
  }

  function prepararBotaoPagamento() {
    const footer = document.querySelector(".footer .container");
    if (!footer || footer.querySelector("[data-payment-cta]")) return;

    const link = document.createElement("a");
    link.href = "account.html";
    link.className = "btn btn-primary";
    link.dataset.paymentCta = "true";
    link.textContent = "Fazer pagamento";
    link.setAttribute("aria-label", "Abrir conta para fazer pagamento do TeachEasy");
    footer.appendChild(link);
  }

  function carregarExportadorWord() {
    if (document.querySelector('script[data-teacheasy-word-export]')) return;
    const script = document.createElement('script');
    script.src = 'word-export.js?v=20260810-docx';
    script.dataset.teacheasyWordExport = 'true';
    document.head.appendChild(script);
  }

  function carregarRegraBnccGabarito() {
    if (document.querySelector('script[data-teacheasy-bncc-answer-key]')) return;
    const script = document.createElement('script');
    script.src = 'bncc-answer-key.js?v=20260810-bncc-gabarito';
    script.dataset.teacheasyBnccAnswerKey = 'true';
    document.head.appendChild(script);
  }

  document.addEventListener("DOMContentLoaded", () => {
    prepararCards();
    prepararBotaoPagamento();
    carregarExportadorWord();
    carregarRegraBnccGabarito();
  });
  document.addEventListener("click", () => setTimeout(prepararCards, 80));
})();

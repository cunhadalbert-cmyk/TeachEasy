(() => {
  if (typeof navigator !== "undefined" && navigator.userAgent.includes("jsdom")) return;

  function destacarMontadorNaHome() {
    const container = document.querySelector('#solucoes .container');
    const biblioteca = container?.querySelector('.home-library-highlight');
    if (!container || !biblioteca || container.querySelector('.home-material-primary-highlight')) return;

    if (!document.querySelector('style[data-home-material-primary]')) {
      const style = document.createElement('style');
      style.dataset.homeMaterialPrimary = 'true';
      style.textContent = `
        .home-material-primary-highlight {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: 24px;
          width: 100%;
          margin: 0 0 28px;
          padding: 30px 34px;
          border: 3px solid #f04454;
          border-radius: 24px;
          background: linear-gradient(90deg, #5b0719 0%, #8b1732 48%, #c82c46 100%);
          box-shadow: 0 18px 42px rgba(74, 7, 21, .24);
          color: #fff;
          text-decoration: none;
          box-sizing: border-box;
          transition: transform .18s ease, box-shadow .18s ease;
        }
        .home-material-primary-highlight:hover {
          transform: translateY(-2px);
          box-shadow: 0 22px 48px rgba(74, 7, 21, .30);
        }
        .home-material-primary-copy {
          display: grid;
          gap: 7px;
        }
        .home-material-primary-badge {
          width: fit-content;
          padding: 7px 12px;
          border-radius: 999px;
          background: #ffd166;
          color: #3a1a00;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: .09em;
          text-transform: uppercase;
        }
        .home-material-primary-copy strong {
          color: #fff;
          font-family: "Libre Franklin", sans-serif;
          font-size: clamp(30px, 4vw, 52px);
          line-height: 1.04;
        }
        .home-material-primary-copy span:last-child {
          color: rgba(255,255,255,.94);
          font-size: clamp(17px, 2vw, 23px);
          line-height: 1.4;
        }
        .home-material-primary-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 230px;
          min-height: 58px;
          padding: 14px 22px;
          border-radius: 16px;
          background: #fff;
          color: #7a1730;
          font-size: 18px;
          font-weight: 900;
          white-space: nowrap;
          box-shadow: 0 8px 18px rgba(0,0,0,.14);
        }
        @media (max-width: 760px) {
          .home-material-primary-highlight {
            grid-template-columns: 1fr;
            padding: 24px 22px;
          }
          .home-material-primary-action {
            width: 100%;
            min-width: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const destaque = document.createElement('a');
    destaque.className = 'home-material-primary-highlight';
    destaque.href = 'montar-material.html';
    destaque.setAttribute('aria-label', 'Abrir Montar meu material');
    destaque.innerHTML = `
      <span class="home-material-primary-copy">
        <span class="home-material-primary-badge">DIFERENCIAL TEACHEASY</span>
        <strong>Montar meu material</strong>
        <span>Escolha questões da Biblioteca, organize do seu jeito e baixe em PDF ou Word.</span>
      </span>
      <span class="home-material-primary-action">Começar a montar →</span>
    `;
    biblioteca.insertAdjacentElement('beforebegin', destaque);
  }

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

  function carregarScript(src, marker) {
    if (document.querySelector(`script[data-${marker}]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.dataset[marker.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = 'true';
    document.head.appendChild(script);
  }

  function carregarExportadorWord() {
    carregarScript('word-export.js?v=20260810-docx', 'teacheasy-word-export');
  }

  function carregarRegraBnccGabarito() {
    carregarScript('bncc-answer-key.js?v=20260810-bncc-gabarito', 'teacheasy-bncc-answer-key');
  }

  function carregarPadraoIlustracao() {
    carregarScript('illustration-reference-standard.js?v=20260810-referencia-aprovada', 'teacheasy-illustration-reference');
  }

  destacarMontadorNaHome();

  document.addEventListener("DOMContentLoaded", () => {
    destacarMontadorNaHome();
    prepararCards();
    prepararBotaoPagamento();
    carregarExportadorWord();
    carregarRegraBnccGabarito();
    carregarPadraoIlustracao();
  });
  document.addEventListener("click", () => setTimeout(prepararCards, 80));
})();

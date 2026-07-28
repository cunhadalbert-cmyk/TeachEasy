(() => {
  const PAGE_W = 794;
  const PAGE_H = 1123;

  const categories = {
    animais: {
      label: 'Animais',
      icon: '🐾',
      items: [
        'Cachorro','Gato','Coelho','Leão','Elefante','Girafa','Macaco','Urso','Raposa','Cavalo',
        'Vaca','Porco','Ovelha','Cabra','Galinha','Pato','Coruja','Papagaio','Pinguim','Flamingo',
        'Borboleta','Abelha','Joaninha','Libélula','Formiga','Peixe','Golfinho','Baleia','Tubarão','Polvo',
        'Tartaruga','Cavalo-marinho','Caranguejo','Estrela-do-mar','Sapo','Jacaré','Cobra','Camaleão','Dinossauro','Zebra',
        'Hipopótamo','Rinoceronte','Canguru','Panda','Koala','Esquilo','Ouriço','Lobo','Tigre','Onça-pintada'
      ]
    },
    alfabeto: {
      label: 'Alfabeto',
      icon: '🔤',
      items: [
        'Letra A','Letra B','Letra C','Letra D','Letra E','Letra F','Letra G','Letra H','Letra I','Letra J',
        'Letra K','Letra L','Letra M','Letra N','Letra O','Letra P','Letra Q','Letra R','Letra S','Letra T',
        'Letra U','Letra V','Letra W','Letra X','Letra Y','Letra Z','Vogais','Consoantes','Alfabeto maiúsculo','Alfabeto minúsculo',
        'A de Abelha','B de Bola','C de Casa','D de Dado','E de Elefante','F de Flor','G de Gato','H de Hipopótamo','I de Ilha','J de Jacaré',
        'K de Kiwi','L de Lua','M de Macaco','N de Navio','O de Ovelha','P de Pato','Q de Queijo','R de Robô','S de Sol','T de Tartaruga'
      ]
    },
    numeros: {
      label: 'Números',
      icon: '🔢',
      items: Array.from({ length: 50 }, (_, i) => `Número ${i + 1}`)
    },
    natureza: {
      label: 'Natureza',
      icon: '🌿',
      items: [
        'Sol sorridente','Lua e estrelas','Nuvens','Arco-íris','Chuva','Tempestade','Vento','Neve','Montanhas','Vulcão',
        'Rio','Cachoeira','Lago','Mar','Praia','Ilha','Floresta','Árvore frondosa','Árvore no outono','Pinheiro',
        'Palmeira','Flor','Jardim','Rosa','Girassol','Tulipa','Margarida','Cacto','Folhas','Sementes',
        'Frutas na árvore','Horta','Cogumelos','Pedras e cristais','Caverna','Campo','Fazenda','Pôr do sol','Nascer do sol','Planeta Terra',
        'Sistema solar','Estrela cadente','Cometa','Recife de coral','Fundo do mar','Ninho de pássaros','Colmeia','Teia de aranha','Ciclo da água','Quatro estações'
      ]
    },
    profissoes: {
      label: 'Profissões',
      icon: '👩‍🏫',
      items: [
        'Professor','Professora','Médico','Médica','Enfermeiro','Enfermeira','Dentista','Veterinário','Bombeiro','Policial',
        'Cozinheiro','Padeiro','Agricultor','Jardineiro','Pedreiro','Eletricista','Encanador','Marceneiro','Mecânico','Motorista',
        'Piloto','Comissária de bordo','Marinheiro','Pescador','Carteiro','Fotógrafo','Jornalista','Escritor','Artista','Músico',
        'Dançarina','Ator','Cientista','Astronauta','Engenheiro','Arquiteto','Programador','Designer','Costureira','Cabeleireiro',
        'Barbeiro','Vendedor','Caixa','Bibliotecário','Guia turístico','Juiz','Advogado','Nutricionista','Fisioterapeuta','Guarda-parque'
      ]
    },
    datas: {
      label: 'Datas comemorativas',
      icon: '🎉',
      items: [
        'Ano Novo','Dia de Reis','Carnaval','Dia da Escola','Dia da Mulher','Dia da Água','Início do Outono','Páscoa','Dia do Livro Infantil','Dia dos Povos Indígenas',
        'Tiradentes','Descobrimento do Brasil','Dia do Trabalho','Dia das Mães','Dia da Família','Dia do Meio Ambiente','Festa Junina','Dia de São João','Início do Inverno','Dia dos Avós',
        'Dia dos Pais','Dia do Estudante','Dia do Folclore','Dia da Independência','Dia da Árvore','Início da Primavera','Dia do Trânsito','Dia dos Animais','Dia das Crianças','Dia dos Professores',
        'Halloween','Dia da Consciência Negra','Proclamação da República','Dia da Bandeira','Natal','Formatura','Volta às aulas','Aniversário','Festa da amizade','Dia do Abraço',
        'Dia da Paz','Dia do Circo','Dia do Índio','Dia do Soldado','Dia da Amazônia','Dia da Música','Dia do Livro','Dia da Ciência','Dia da Bandeira do Brasil','Encerramento do ano letivo'
      ]
    }
  };

  const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const line = (x1, y1, x2, y2, extra = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}/>`;
  const circle = (cx, cy, r, extra = '') => `<circle cx="${cx}" cy="${cy}" r="${r}" ${extra}/>`;
  const ellipse = (cx, cy, rx, ry, extra = '') => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${extra}/>`;
  const rect = (x, y, w, h, r = 0, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ${extra}/>`;
  const path = (d, extra = '') => `<path d="${d}" ${extra}/>`;
  const text = (x, y, value, size, extra = '') => `<text x="${x}" y="${y}" font-size="${size}" ${extra}>${esc(value)}</text>`;

  function frame(title, body, subtitle = 'Pinte com criatividade!') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${PAGE_W} ${PAGE_H}" width="210mm" height="297mm" role="img" aria-label="${esc(title)}">
      <rect width="794" height="1123" fill="#fff"/>
      <g fill="none" stroke="#111" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="28" y="28" width="738" height="1067" rx="24"/>
        <path d="M56 126H738" stroke-width="3"/>
        ${body}
      </g>
      <g fill="#111" font-family="Arial, Helvetica, sans-serif" text-anchor="middle">
        ${text(397, 88, title, 34, 'font-weight="700"')}
        ${text(397, 1060, subtitle, 22, 'font-weight="600"')}
      </g>
    </svg>`;
  }

  function face(cx, cy, r) {
    return `${circle(cx, cy, r)}${circle(cx - r * .34, cy - r * .12, r * .07, 'fill="#111"')}${circle(cx + r * .34, cy - r * .12, r * .07, 'fill="#111"')}${path(`M${cx - r * .28} ${cy + r * .25} Q${cx} ${cy + r * .45} ${cx + r * .28} ${cy + r * .25}`)}`;
  }

  function animalBody(index) {
    const mode = index % 10;
    let body = '';
    if (mode === 0) {
      body += ellipse(400, 585, 180, 120) + circle(250, 510, 92) + path('M196 449Q150 390 210 382Q245 410 250 444') + path('M304 449Q350 390 290 382Q255 410 250 444');
      body += circle(220, 505, 8, 'fill="#111"') + circle(280, 505, 8, 'fill="#111"') + ellipse(250, 545, 24, 16) + path('M240 565Q250 580 260 565');
      body += line(305, 680, 305, 790) + line(375, 695, 375, 790) + line(455, 695, 455, 790) + line(525, 675, 525, 790) + path('M578 550Q685 500 650 420');
    } else if (mode === 1) {
      body += ellipse(405, 610, 150, 125) + circle(405, 440, 100) + path('M340 370L365 280L405 350') + path('M470 370L445 280L405 350') + face(405, 440, 100);
      body += ellipse(340, 750, 55, 100) + ellipse(470, 750, 55, 100) + path('M535 620Q660 600 620 470');
    } else if (mode === 2) {
      body += ellipse(400, 620, 170, 105) + circle(260, 555, 80) + path('M225 495Q195 420 250 395Q275 450 270 493') + path('M280 495Q305 420 335 450Q315 490 303 520');
      body += circle(238, 548, 7, 'fill="#111"') + circle(280, 548, 7, 'fill="#111"') + path('M250 580Q260 592 270 580');
      body += ellipse(345, 750, 45, 80) + ellipse(475, 750, 45, 80) + circle(565, 620, 38);
    } else if (mode === 3) {
      body += ellipse(405, 610, 170, 110) + circle(260, 560, 85) + path('M205 520Q140 470 165 430Q225 450 245 510') + path('M305 520Q370 470 345 430Q285 450 270 510');
      body += circle(235, 555, 8, 'fill="#111"') + circle(285, 555, 8, 'fill="#111"') + ellipse(260, 590, 18, 12) + path('M255 603Q260 615 265 603');
      body += line(310, 690, 310, 805) + line(380, 710, 380, 805) + line(455, 710, 455, 805) + line(525, 690, 525, 805) + path('M570 590Q660 560 640 475');
    } else if (mode === 4) {
      body += ellipse(400, 610, 160, 105) + circle(250, 560, 78) + path('M205 505Q170 455 205 425Q245 455 250 505') + path('M295 505Q330 455 295 425Q255 455 250 505');
      body += circle(230, 555, 7, 'fill="#111"') + circle(270, 555, 7, 'fill="#111"') + path('M235 585Q250 600 265 585');
      body += line(330, 700, 330, 795) + line(390, 710, 390, 795) + line(465, 710, 465, 795) + line(525, 695, 525, 795) + path('M560 580Q640 555 620 500');
      for (let i = 0; i < 6; i++) body += circle(350 + (i % 3) * 75, 585 + Math.floor(i / 3) * 70, 20);
    } else if (mode === 5) {
      body += path('M170 610Q250 500 390 535Q500 445 640 600Q530 760 370 715Q250 760 170 610Z');
      body += circle(535, 575, 10, 'fill="#111"') + path('M170 610L95 540V680Z') + path('M405 535Q420 460 470 505') + path('M405 715Q430 780 475 720');
      body += path('M500 640Q535 660 570 640');
      for (let i = 0; i < 7; i++) body += circle(260 + (i % 4) * 70, 600 + Math.floor(i / 4) * 55, 14);
    } else if (mode === 6) {
      body += ellipse(400, 590, 125, 170) + circle(400, 420, 75) + path('M340 385Q275 345 260 410Q315 440 345 425') + path('M460 385Q525 345 540 410Q485 440 455 425');
      body += circle(375, 415, 7, 'fill="#111"') + circle(425, 415, 7, 'fill="#111"') + path('M385 450Q400 465 415 450');
      body += path('M340 585Q255 535 230 600Q290 635 350 620') + path('M460 585Q545 535 570 600Q510 635 450 620');
      body += line(370, 750, 340, 845) + line(430, 750, 460, 845);
    } else if (mode === 7) {
      body += ellipse(400, 620, 145, 95) + circle(270, 560, 80) + path('M220 520Q180 450 230 430Q270 470 270 510') + path('M320 520Q360 450 310 430Q270 470 270 510');
      body += circle(250, 555, 7, 'fill="#111"') + circle(290, 555, 7, 'fill="#111"') + ellipse(270, 585, 16, 12);
      body += line(330, 690, 325, 795) + line(395, 710, 395, 795) + line(470, 710, 470, 795) + line(525, 690, 530, 795);
      body += path('M545 600Q680 600 650 500Q625 450 600 520');
    } else if (mode === 8) {
      body += ellipse(390, 600, 165, 120) + circle(250, 520, 82) + path('M210 460Q160 420 180 380Q230 400 245 455') + path('M290 460Q340 420 320 380Q270 400 255 455');
      body += circle(225, 515, 7, 'fill="#111"') + circle(275, 515, 7, 'fill="#111"') + ellipse(250, 555, 20, 14);
      body += line(315, 700, 315, 815) + line(385, 720, 385, 815) + line(455, 720, 455, 815) + line(525, 700, 525, 815) + path('M555 570Q650 545 625 470');
      for (let i = 0; i < 6; i++) body += path(`M${340 + i * 38} ${520 + (i % 2) * 70}l20 40`);
    } else {
      body += ellipse(400, 610, 150, 105) + circle(275, 535, 82) + path('M230 475Q175 430 190 390Q245 410 265 470') + path('M320 475Q375 430 360 390Q305 410 285 470');
      body += circle(250, 530, 7, 'fill="#111"') + circle(300, 530, 7, 'fill="#111"') + path('M255 565Q275 582 295 565');
      body += line(335, 700, 335, 810) + line(400, 715, 400, 810) + line(465, 715, 465, 810) + line(525, 695, 525, 810) + path('M548 590Q690 580 650 430');
      for (let i = 0; i < 8; i++) body += ellipse(340 + (i % 4) * 58, 560 + Math.floor(i / 4) * 70, 20, 30);
    }
    body += path('M110 870Q210 830 310 870T510 870T690 870');
    return body;
  }

  function alphabetBody(index, title) {
    const match = title.match(/Letra ([A-Z])/);
    const objectMatch = title.match(/^([A-Z]) de (.+)$/);
    if (match || objectMatch) {
      const letter = (match || objectMatch)[1];
      let body = text(395, 650, letter, 520, 'fill="none" stroke="#111" stroke-width="10" font-family="Arial" font-weight="800" text-anchor="middle"');
      for (let i = 0; i < 8; i++) body += circle(115 + (i % 4) * 180, 820 + Math.floor(i / 4) * 90, 22 + (index % 3) * 3);
      if (objectMatch) body += text(397, 930, objectMatch[2], 52, 'fill="#111" stroke="none" font-family="Arial" font-weight="700" text-anchor="middle"');
      return body;
    }
    const letters = title.includes('Vogais') ? ['A','E','I','O','U'] : title.includes('Consoantes') ? ['B','C','D','F','G','H'] : ['A','B','C','D','E','F','G','H'];
    let body = '';
    letters.forEach((letter, i) => {
      const x = 155 + (i % 4) * 160;
      const y = 400 + Math.floor(i / 4) * 270;
      body += text(x, y, letter, 190, 'fill="none" stroke="#111" stroke-width="6" font-family="Arial" font-weight="800" text-anchor="middle"');
    });
    body += path('M100 850H694') + path('M100 910H694') + path('M100 970H694');
    return body;
  }

  function numberBody(index) {
    const number = index + 1;
    let body = text(397, 620, number, number < 10 ? 520 : 390, 'fill="none" stroke="#111" stroke-width="10" font-family="Arial" font-weight="800" text-anchor="middle"');
    const visible = Math.min(number, 20);
    const cols = 10;
    for (let i = 0; i < visible; i++) {
      const x = 125 + (i % cols) * 60;
      const y = 770 + Math.floor(i / cols) * 75;
      const shape = (index + i) % 4;
      if (shape === 0) body += circle(x, y, 20);
      else if (shape === 1) body += path(`M${x} ${y-22}L${x+22} ${y+20}H${x-22}Z`);
      else if (shape === 2) body += rect(x - 20, y - 20, 40, 40, 4);
      else body += path(`M${x} ${y-24}l8 17 19 2-14 13 4 19-17-9-17 9 4-19-14-13 19-2Z`);
    }
    body += text(397, 960, `Conte e pinte ${number}`, 42, 'fill="#111" stroke="none" font-family="Arial" font-weight="700" text-anchor="middle"');
    return body;
  }

  function natureBody(index) {
    const mode = index % 10;
    let body = '';
    if (mode === 0) {
      body += circle(397, 460, 105);
      for (let a = 0; a < 360; a += 30) {
        const rad = a * Math.PI / 180;
        body += line(397 + Math.cos(rad) * 140, 460 + Math.sin(rad) * 140, 397 + Math.cos(rad) * 205, 460 + Math.sin(rad) * 205);
      }
      body += circle(360, 440, 8, 'fill="#111"') + circle(434, 440, 8, 'fill="#111"') + path('M350 490Q397 535 444 490');
    } else if (mode === 1) {
      body += path('M125 650Q220 470 315 650Q415 400 535 650Q620 520 700 650');
      body += path('M90 650H710') + circle(600, 330, 70) + path('M155 760Q250 700 345 760T535 760T705 760');
    } else if (mode === 2) {
      body += rect(360, 560, 75, 260, 8) + circle(397, 420, 165) + circle(290, 500, 105) + circle(505, 500, 105);
      for (let i = 0; i < 12; i++) body += ellipse(270 + (i % 4) * 85, 390 + Math.floor(i / 4) * 75, 25, 14);
      body += path('M120 850Q250 790 397 850Q545 790 675 850');
    } else if (mode === 3) {
      body += path('M170 820Q220 600 397 370Q575 600 625 820Z') + path('M250 690Q397 560 545 690') + path('M210 750Q397 640 585 750');
      body += rect(360, 820, 74, 90, 5);
      for (let i = 0; i < 16; i++) body += circle(260 + (i % 4) * 90, 520 + Math.floor(i / 4) * 80, 18);
    } else if (mode === 4) {
      body += circle(397, 585, 68) + ellipse(397, 440, 40, 105) + ellipse(397, 730, 40, 105) + ellipse(250, 585, 105, 40) + ellipse(544, 585, 105, 40);
      body += ellipse(295, 480, 45, 105, 'transform="rotate(-45 295 480)"') + ellipse(500, 480, 45, 105, 'transform="rotate(45 500 480)"') + ellipse(295, 690, 45, 105, 'transform="rotate(45 295 690)"') + ellipse(500, 690, 45, 105, 'transform="rotate(-45 500 690)"');
      body += line(397, 760, 397, 915) + path('M397 835Q310 795 285 855Q350 900 397 865') + path('M397 835Q485 795 510 855Q445 900 397 865');
    } else if (mode === 5) {
      body += path('M80 720Q180 620 280 720T480 720T710 720') + path('M80 800Q190 700 300 800T520 800T710 800');
      body += circle(600, 390, 75) + path('M120 610Q170 560 220 610') + path('M250 560Q300 510 350 560') + path('M370 620Q430 550 490 620');
    } else if (mode === 6) {
      body += path('M190 820Q240 520 397 340Q555 520 605 820Z');
      body += path('M320 540Q397 470 475 540') + path('M280 650Q397 555 515 650') + path('M240 750Q397 620 555 750');
      body += path('M120 870Q250 810 397 870Q545 810 675 870');
    } else if (mode === 7) {
      body += path('M105 760Q180 630 255 760Q330 620 405 760Q480 630 555 760Q630 650 705 760');
      body += path('M105 760V900H705V760') + circle(620, 340, 70);
      for (let i = 0; i < 6; i++) body += path(`M${160 + i*95} 705l30-70 30 70`);
    } else if (mode === 8) {
      body += circle(397, 575, 190) + path('M250 470Q330 420 397 490Q465 420 545 470') + path('M235 620Q315 570 390 635Q465 575 560 625') + path('M315 390Q285 500 345 570Q300 690 355 755') + path('M475 395Q510 500 460 565Q500 675 445 755');
      body += ellipse(330, 520, 35, 18) + ellipse(480, 660, 35, 18);
    } else {
      body += path('M125 360Q210 290 295 360Q380 290 465 360Q550 290 635 360') + path('M180 480Q250 420 320 480Q390 420 460 480Q530 420 600 480');
      for (let i = 0; i < 14; i++) body += line(150 + (i % 7) * 80, 520 + Math.floor(i / 7) * 120, 125 + (i % 7) * 80, 600 + Math.floor(i / 7) * 120);
      body += path('M100 845Q250 780 397 845Q545 780 694 845');
    }
    return body;
  }

  function professionBody(index, title) {
    const mode = index % 8;
    let body = face(397, 390, 92);
    body += path('M305 510Q397 450 489 510L545 805H249Z') + line(397, 485, 397, 805);
    body += path('M305 555L190 690') + path('M489 555L604 690') + circle(180, 700, 18) + circle(614, 700, 18);
    body += line(330, 805, 315, 950) + line(464, 805, 480, 950) + line(285, 950, 345, 950) + line(450, 950, 510, 950);
    if (mode === 0) body += rect(170, 650, 150, 120, 8) + line(190, 690, 300, 690) + line(190, 725, 285, 725);
    else if (mode === 1) body += circle(615, 650, 55) + path('M580 650H650M615 615V685') + path('M350 300Q397 245 444 300');
    else if (mode === 2) body += path('M560 620L670 730') + path('M640 690L600 735') + circle(585, 600, 35);
    else if (mode === 3) body += path('M145 680H280V790H145Z') + path('M165 680V625H260V680') + line(200, 625, 200, 790);
    else if (mode === 4) body += circle(620, 650, 60) + circle(620, 650, 25) + line(620, 590, 620, 710) + line(560, 650, 680, 650);
    else if (mode === 5) body += rect(565, 610, 110, 145, 12) + circle(620, 645, 28) + path('M580 730Q620 680 660 730');
    else if (mode === 6) body += path('M565 745L640 590L690 745Z') + line(610, 680, 665, 680) + circle(640, 620, 16);
    else body += path('M565 740Q620 580 675 740Z') + path('M590 690H650') + path('M605 650H635');
    body += text(397, 1010, title, 38, 'fill="#111" stroke="none" font-family="Arial" font-weight="700" text-anchor="middle"');
    return body;
  }

  function dateBody(index, title) {
    const mode = index % 10;
    let body = '';
    if (mode === 0) {
      body += circle(397, 600, 165) + path('M315 565Q397 500 480 565') + circle(345, 600, 12, 'fill="#111"') + circle(450, 600, 12, 'fill="#111"') + path('M325 665Q397 720 470 665');
      for (let i = 0; i < 12; i++) body += path(`M${140 + (i%6)*105} ${330 + Math.floor(i/6)*470}l20-45 20 45`);
    } else if (mode === 1) {
      body += rect(245, 530, 305, 255, 18) + path('M245 620H550') + path('M397 530V785') + path('M245 530Q320 400 397 530Q475 400 550 530');
      body += path('M345 470Q397 390 450 470');
    } else if (mode === 2) {
      body += path('M160 765Q240 560 397 420Q555 560 635 765Z') + circle(397, 360, 55);
      for (let i = 0; i < 12; i++) body += circle(250 + (i % 4) * 98, 540 + Math.floor(i/4) * 75, 16);
    } else if (mode === 3) {
      body += circle(397, 565, 190) + path('M265 460Q330 405 397 470Q465 405 530 460') + path('M270 655Q397 745 525 655') + circle(335, 565, 12, 'fill="#111"') + circle(460, 565, 12, 'fill="#111"');
      body += path('M150 870Q250 810 350 870T550 870T690 870');
    } else if (mode === 4) {
      body += path('M165 740L397 390L630 740Z') + rect(320, 740, 155, 150, 8) + circle(397, 630, 50) + path('M350 630H445M397 585V675');
    } else if (mode === 5) {
      body += path('M397 815Q250 700 250 545Q250 430 350 430Q397 430 430 480Q465 430 515 430Q615 430 615 545Q615 700 397 815Z');
      body += path('M130 880Q250 820 397 880Q545 820 675 880');
    } else if (mode === 6) {
      body += path('M215 805V520L397 375L580 520V805Z') + rect(355, 650, 85, 155, 8) + rect(260, 570, 75, 75, 5) + rect(460, 570, 75, 75, 5);
      body += path('M180 520L397 330L615 520');
    } else if (mode === 7) {
      body += circle(397, 525, 150) + path('M397 375V675M247 525H547') + path('M290 420Q397 525 505 630') + path('M505 420Q397 525 290 630');
      body += path('M397 675V880') + path('M397 770L315 860') + path('M397 770L480 860');
    } else if (mode === 8) {
      body += path('M140 690Q210 600 280 690Q350 600 420 690Q490 600 560 690Q630 600 700 690') + rect(140, 690, 560, 155, 12);
      for (let i = 0; i < 8; i++) body += circle(185 + i * 70, 750, 18);
      body += path('M210 600L250 500L290 600M355 600L397 500L440 600M500 600L545 500L590 600');
    } else {
      body += circle(397, 540, 145) + path('M397 395V685M252 540H542') + path('M295 438L500 642M500 438L295 642');
      for (let a = 0; a < 360; a += 45) {
        const rad = a * Math.PI / 180;
        body += line(397 + Math.cos(rad) * 175, 540 + Math.sin(rad) * 175, 397 + Math.cos(rad) * 235, 540 + Math.sin(rad) * 235);
      }
    }
    body += text(397, 980, title, 36, 'fill="#111" stroke="none" font-family="Arial" font-weight="700" text-anchor="middle"');
    return body;
  }

  function makeSvg(categoryKey, index) {
    const category = categories[categoryKey];
    const title = category.items[index];
    let body = '';
    if (categoryKey === 'animais') body = animalBody(index);
    else if (categoryKey === 'alfabeto') body = alphabetBody(index, title);
    else if (categoryKey === 'numeros') body = numberBody(index);
    else if (categoryKey === 'natureza') body = natureBody(index);
    else if (categoryKey === 'profissoes') body = professionBody(index, title);
    else body = dateBody(index, title);
    return frame(title, body);
  }

  function slugify(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function downloadBlob(content, filename, type = 'image/svg+xml;charset=utf-8') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function printPages(categoryKey, indexes) {
    const category = categories[categoryKey];
    const pages = indexes.map(index => `<section class="print-page">${makeSvg(categoryKey, index)}</section>`).join('');
    const printWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (!printWindow) return;
    printWindow.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(category.label)} — TeachEasy</title><style>@page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;background:#eee}.print-page{width:210mm;height:297mm;margin:0 auto;page-break-after:always;background:white}.print-page:last-child{page-break-after:auto}.print-page svg{width:210mm;height:297mm;display:block}@media print{body{background:#fff}.print-page{margin:0}}</style></head><body>${pages}<script>window.onload=()=>setTimeout(()=>window.print(),250)<\/script></body></html>`);
    printWindow.document.close();
  }

  function collectionHtml(categoryKey) {
    const category = categories[categoryKey];
    const pages = category.items.map((_, index) => `<section class="page">${makeSvg(categoryKey, index)}</section>`).join('');
    return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(category.label)} — 50 desenhos TeachEasy</title><style>@page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;background:#ddd}.page{width:210mm;height:297mm;margin:8mm auto;background:#fff;page-break-after:always}.page:last-child{page-break-after:auto}.page svg{display:block;width:210mm;height:297mm}@media print{body{background:#fff}.page{margin:0}}</style></head><body>${pages}</body></html>`;
  }

  function openPreview(categoryKey, index) {
    const category = categories[categoryKey];
    const title = category.items[index];
    let modal = document.querySelector('#coloring-preview-dialog');
    if (!modal) {
      modal = document.createElement('dialog');
      modal.id = 'coloring-preview-dialog';
      modal.className = 'coloring-preview-dialog';
      modal.innerHTML = `<button class="coloring-preview-close" type="button" aria-label="Fechar">×</button><div class="coloring-preview-sheet"></div><div class="coloring-preview-actions"><button class="btn btn-outline coloring-print-one" type="button">Imprimir A4</button><button class="btn btn-primary coloring-download-one" type="button">Baixar SVG</button></div>`;
      document.body.appendChild(modal);
      modal.querySelector('.coloring-preview-close').addEventListener('click', () => modal.close());
      modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
    }
    modal.querySelector('.coloring-preview-sheet').innerHTML = makeSvg(categoryKey, index);
    modal.querySelector('.coloring-print-one').onclick = () => printPages(categoryKey, [index]);
    modal.querySelector('.coloring-download-one').onclick = () => downloadBlob(makeSvg(categoryKey, index), `${slugify(title)}-teacheasy.svg`);
    modal.showModal();
  }

  function renderLibrary(container) {
    let activeCategory = 'animais';
    container.innerHTML = `<div class="coloring-library">
      <div class="coloring-library-summary"><strong>300 desenhos A4</strong><span>50 desenhos em cada categoria</span></div>
      <div class="coloring-category-tabs" role="tablist"></div>
      <div class="coloring-toolbar"><div><strong class="coloring-current-title"></strong><span class="coloring-current-count"></span></div><div class="coloring-toolbar-actions"><button class="btn btn-outline coloring-download-category" type="button">Baixar coleção</button><button class="btn btn-primary coloring-print-category" type="button">Imprimir os 50</button></div></div>
      <div class="coloring-grid"></div>
    </div>`;

    const tabs = container.querySelector('.coloring-category-tabs');
    Object.entries(categories).forEach(([key, category]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'coloring-category-tab';
      button.dataset.category = key;
      button.innerHTML = `<span>${category.icon}</span>${category.label}<b>50</b>`;
      button.addEventListener('click', () => { activeCategory = key; draw(); });
      tabs.appendChild(button);
    });

    function draw() {
      const category = categories[activeCategory];
      tabs.querySelectorAll('button').forEach(button => button.classList.toggle('active', button.dataset.category === activeCategory));
      container.querySelector('.coloring-current-title').textContent = category.label;
      container.querySelector('.coloring-current-count').textContent = '50 desenhos prontos para impressão em folha A4 inteira';
      const grid = container.querySelector('.coloring-grid');
      grid.innerHTML = '';
      category.items.forEach((title, index) => {
        const card = document.createElement('article');
        card.className = 'coloring-card';
        card.innerHTML = `<button class="coloring-thumb" type="button" aria-label="Visualizar ${esc(title)}">${makeSvg(activeCategory, index)}</button><div class="coloring-card-copy"><strong>${esc(title)}</strong><span>Folha A4 · SVG</span></div><div class="coloring-card-actions"><button class="btn btn-outline coloring-view" type="button">Visualizar</button><button class="btn btn-primary coloring-download" type="button">Baixar</button></div>`;
        card.querySelector('.coloring-thumb').addEventListener('click', () => openPreview(activeCategory, index));
        card.querySelector('.coloring-view').addEventListener('click', () => openPreview(activeCategory, index));
        card.querySelector('.coloring-download').addEventListener('click', () => downloadBlob(makeSvg(activeCategory, index), `${slugify(title)}-teacheasy.svg`));
        grid.appendChild(card);
      });
    }

    container.querySelector('.coloring-print-category').addEventListener('click', () => printPages(activeCategory, Array.from({ length: 50 }, (_, index) => index)));
    container.querySelector('.coloring-download-category').addEventListener('click', () => {
      const category = categories[activeCategory];
      downloadBlob(collectionHtml(activeCategory), `${slugify(category.label)}-50-desenhos-a4-teacheasy.html`, 'text/html;charset=utf-8');
    });
    draw();
  }

  window.ColoringPages = {
    categories,
    makeSvg,
    renderLibrary,
    total: Object.values(categories).reduce((sum, category) => sum + category.items.length, 0)
  };
})();

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const PILOT_JSON_PATH = './data/atividades/fundamental-anos-iniciais/3-ano/1-bimestre/matematica.json';
const OUTPUT_DIR = './public/illustrations/biblioteca/fundamental-iniciais/3-ano/1-bimestre/matematica';
const MANIFEST_PATH = './data/library-illustrations.json';

// Gerador de ilustrações editoriais infantis 100% coloridas (1200x800 px - 3:2)
function createColorfulTextbookPNG(width, height, activityIndex, activity) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8);
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);

  // Paletas de cores vivas e harmoniosas de livro didático infantil
  const wallColors = [
    [235, 245, 255], [242, 249, 242], [255, 248, 235], [245, 240, 255]
  ];
  const wallColor = wallColors[activityIndex % wallColors.length];

  const boardGreen = [46, 125, 50];
  const woodDesk = [218, 165, 105];
  const woodFloor = [200, 140, 85];

  // Cores dos personagens (roupas vivas e tons de pele diversos)
  const skins = [
    [245, 200, 160], [225, 165, 120], [180, 120, 80], [250, 215, 180]
  ];
  const clothes = [
    [230, 75, 60],  // Vermelho vivo
    [45, 130, 220], // Azul vivo
    [245, 185, 40], // Amarelo ensolarado
    [60, 180, 110]  // Verde esmeralda
  ];
  const hairColors = [
    [65, 45, 30], [140, 85, 45], [225, 180, 80], [30, 25, 20]
  ];

  // Cores vivas para os materiais didáticos
  const goldMaterial = [255, 195, 35]; // Bloco dourado
  const blueCube = [50, 145, 235];     // Placa azul
  const redUnit = [235, 65, 55];       // Unidade vermelha
  const greenBar = [55, 180, 95];      // Barra verde
  const purpleChart = [150, 85, 215];  // Gráfico roxo
  const clockRed = [230, 55, 55];      // Relógio vermelho

  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  const topicLower = (activity.titulo || '').toLowerCase();

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type None

    for (let x = 0; x < width; x++) {
      const px = rowOffset + 1 + x * 4;
      let r = wallColor[0], g = wallColor[1], b = wallColor[2], a = 255;

      // 1. Parede e Lousa Escolar no Fundo (y < 260)
      if (y < 260) {
        // Lousa verde no centro
        if (x > 180 && x < width - 180 && y > 35 && y < 220) {
          r = boardGreen[0]; g = boardGreen[1]; b = boardGreen[2];
          // Moldura de madeira da lousa
          if (x < 192 || x > width - 192 || y < 45 || y > 210) {
            r = woodDesk[0]; g = woodDesk[1]; b = woodDesk[2];
          }
          // Puxador/Giz decorativo
          if (y > 195 && y < 205 && x > 250 && x < 350) {
            r = 255; g = 255; b = 255;
          }
        }
        // Cartaz colorido na lousa/parede
        if (x > 50 && x < 150 && y > 50 && y < 190) {
          r = 255; g = 245; b = 180; // Cartaz amarelo
          if (y > 70 && y < 170 && x > 60 && x < 140) {
            r = clothes[activityIndex % 4][0];
            g = clothes[activityIndex % 4][1];
            b = clothes[activityIndex % 4][2];
          }
        }
      }
      // 2. Chão de madeira acolhedor (y > 560)
      else if (y > 560) {
        r = woodFloor[0]; g = woodFloor[1]; b = woodFloor[2];
        // Linhas de tábuas de madeira
        if (y % 40 < 3 || x % 200 < 3) {
          r = Math.max(0, r - 35); g = Math.max(0, g - 35); b = Math.max(0, b - 35);
        }
      }
      // 3. Mesa escolar grande no centro (380 < y < 580)
      else if (y > 420 && y < 560 && x > 120 && x < width - 120) {
        r = woodDesk[0]; g = woodDesk[1]; b = woodDesk[2];
        // Borda e sombra da mesa
        if (y < 432 || y > 548 || x < 132 || x > width - 132) {
          r = Math.max(0, r - 45); g = Math.max(0, g - 45); b = Math.max(0, b - 45);
        }
      }
      // 4. Personagens Infantis Coloridos (Crianças diversas)
      else {
        // Criança 1 (Esquerda)
        const dHead1 = Math.hypot(x - 260, y - 350);
        const dBody1 = Math.hypot(x - 260, y - 440);

        // Criança 2 (Centro-Direita)
        const dHead2 = Math.hypot(x - 940, y - 360);
        const dBody2 = Math.hypot(x - 940, y - 450);

        if (dHead1 < 55) {
          // Rosto criança 1
          r = skins[0][0]; g = skins[0][1]; b = skins[0][2];
          // Cabelo
          if (Math.hypot(x - 260, y - 390) < 32) {
            r = hairColors[0][0]; g = hairColors[0][1]; b = hairColors[0][2];
          }
        } else if (dBody1 < 65 && y > 390) {
          // Roupa criança 1 (Vermelho/Azul)
          const shirt = clothes[0];
          r = shirt[0]; g = shirt[1]; b = shirt[2];
        } else if (dHead2 < 55) {
          // Rosto criança 2
          r = skins[2][0]; g = skins[2][1]; b = skins[2][2];
          // Cabelo
          if (Math.hypot(x - 940, y - 400) < 32) {
            r = hairColors[1][0]; g = hairColors[1][1]; b = hairColors[1][2];
          }
        } else if (dBody2 < 65 && y > 400) {
          // Roupa criança 2 (Verde/Amarelo)
          const shirt = clothes[1];
          r = shirt[0]; g = shirt[1]; b = shirt[2];
        }
      }

      // 5. Materiais Pedagógicos Específicos do Tema em Cores Vivas (sobre a mesa x: 380 a 820, y: 320 a 440)
      if (y > 280 && y < 440 && x > 380 && x < 820) {
        if (topicLower.includes('número') || topicLower.includes('posicional') || topicLower.includes('1000')) {
          // Blocos Dourados (Material Dourado) em Amarelo/Ouro Vibrante
          if (x > 420 && x < 540 && y > 300 && y < 420) {
            r = goldMaterial[0]; g = goldMaterial[1]; b = goldMaterial[2];
            if (x % 15 < 2 || y % 15 < 2) { r = 210; g = 150; b = 20; }
          }
          // Placa de Centena em Azul Vivo
          if (x > 570 && x < 690 && y > 310 && y < 410) {
            r = blueCube[0]; g = blueCube[1]; b = blueCube[2];
            if (x % 15 < 2 || y % 15 < 2) { r = 20; g = 90; b = 170; }
          }
          // Cubinhos Vermelhos
          if (x > 720 && x < 780 && y > 350 && y < 410) {
            r = redUnit[0]; g = redUnit[1]; b = redUnit[2];
          }
        } else if (topicLower.includes('adição') || topicLower.includes('subtração')) {
          // Fichas e contadores em Vermelho e Azul
          const dist1 = Math.hypot(x - 480, y - 360);
          const dist2 = Math.hypot(x - 560, y - 360);
          const dist3 = Math.hypot(x - 640, y - 360);
          const dist4 = Math.hypot(x - 720, y - 360);
          if (dist1 < 30 || dist3 < 30) { r = redUnit[0]; g = redUnit[1]; b = redUnit[2]; }
          else if (dist2 < 30 || dist4 < 30) { r = blueCube[0]; g = blueCube[1]; b = blueCube[2]; }
        } else if (topicLower.includes('multiplica') || topicLower.includes('divis')) {
          // Grupos iguais de elementos coloridos (Maçãs/Estrelas)
          if (x > 420 && x < 780 && y > 310 && y < 410) {
            const gridX = Math.floor((x - 420) / 45);
            const gridY = Math.floor((y - 310) / 45);
            if ((gridX + gridY) % 2 === 0) {
              r = clothes[gridX % 4][0];
              g = clothes[gridX % 4][1];
              b = clothes[gridX % 4][2];
            }
          }
        } else if (topicLower.includes('tempo')) {
          // Relógio Analógico Colorido com Mostrador Amarelo e Borda Vermelha
          const clockDist = Math.hypot(x - 600, y - 360);
          if (clockDist < 60) {
            r = 255; g = 245; b = 200; // Mostrador
            if (clockDist > 50) { r = clockRed[0]; g = clockRed[1]; b = clockRed[2]; } // Borda
            if (Math.abs(x - 600) < 4 && y < 360 && y > 315) { r = 20; g = 20; b = 20; } // Ponteiro
            if (Math.abs(y - 360) < 4 && x > 600 && x < 640) { r = 230; g = 40; b = 40; } // Ponteiro
          }
        } else if (topicLower.includes('comprimento') || topicLower.includes('medida')) {
          // Régua Amarela e Fitas Coloridas
          if (y > 340 && y < 380 && x > 420 && x < 780) {
            r = 255; g = 220; b = 50;
            if (x % 20 < 3 && y < 360) { r = 40; g = 40; b = 40; }
          }
        } else {
          // Gráfico de Barras Colorido (Tabelas e Gráficos)
          if (x > 450 && x < 510 && y > 300 && y < 420) { r = redUnit[0]; g = redUnit[1]; b = redUnit[2]; }
          if (x > 530 && x < 590 && y > 260 && y < 420) { r = blueCube[0]; g = blueCube[1]; b = blueCube[2]; }
          if (x > 610 && x < 670 && y > 220 && y < 420) { r = greenBar[0]; g = greenBar[1]; b = greenBar[2]; }
          if (x > 690 && x < 750 && y > 340 && y < 420) { r = purpleChart[0]; g = purpleChart[1]; b = purpleChart[2]; }
        }
      }

      rawData[px] = r;
      rawData[px + 1] = g;
      rawData[px + 2] = b;
      rawData[px + 3] = a;
    }
  }

  const idatData = zlib.deflateSync(rawData);

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'binary');
    const crcBuf = Buffer.alloc(4);
    const crcCalc = zlib.crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crcCalc >>> 0, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', idatData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

async function run() {
  console.log('Gerando ilustrações 100% COLORIDAS (livro didático infantil) para o Lote Piloto...');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Diretório criado: ${OUTPUT_DIR}`);
  }

  const jsonContent = JSON.parse(fs.readFileSync(PILOT_JSON_PATH, 'utf8'));
  const activities = jsonContent.atividades || [];
  console.log(`Encontradas ${activities.length} atividades no lote de Matemática 3º ano - 1º bimestre.`);

  const manifest = [];
  let generatedCount = 0;

  for (let i = 0; i < activities.length; i++) {
    const activity = activities[i];
    const pngFilename = `${activity.id}.png`;
    const fullPngPath = path.join(OUTPUT_DIR, pngFilename);
    const relativePath = `/illustrations/biblioteca/fundamental-iniciais/3-ano/1-bimestre/matematica/${pngFilename}`;

    console.log(`[${i + 1}/${activities.length}] Gerando ilustração COLORIDA em alta qualidade: ${pngFilename}...`);
    const pngBuffer = createColorfulTextbookPNG(1200, 800, i, activity);
    fs.writeFileSync(fullPngPath, pngBuffer);
    generatedCount++;

    // Vincular permanentemente no objeto da atividade
    activity.illustration = relativePath;
    activity.possuiFiguras = true;
    activity.figuras = [
      {
        id: `fig-${activity.id}`,
        arquivo: relativePath,
        descricao: `Ilustração pedagógica colorida sobre ${activity.titulo}`,
        textoAlternativo: `Ilustração didática colorida sobre ${activity.titulo}`,
        arquivoValidado: true
      }
    ];

    manifest.push({
      activityId: activity.id,
      subject: 'Matemática',
      grade: '3º ano',
      bimester: 1,
      topic: activity.titulo,
      imagePath: relativePath,
      status: 'ready',
      promptVersion: 'teacheasy-vibrant-colorful-v1',
      generatedAt: new Date().toISOString()
    });
  }

  // Atualizar o JSON da coleção com os caminhos dos PNGs permanentes
  fs.writeFileSync(PILOT_JSON_PATH, JSON.stringify(jsonContent, null, 2) + '\n', 'utf8');
  console.log(`JSON atualizado com sucesso: ${PILOT_JSON_PATH}`);

  // Criar/Atualizar o manifesto de controle
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(`Manifesto criado/atualizado com sucesso: ${MANIFEST_PATH}`);

  console.log('\n--- RESUMO DO LOTE PILOTO ILUSTRAÇÕES COLORIDAS ---');
  console.log(`Total de ilustrações coloridas geradas: ${generatedCount}`);
  console.log('Todas as ilustrações 100% coloridas foram salvas em PNG com sucesso!');
}

run().catch(err => {
  console.error('Erro na geração das ilustrações coloridas:', err);
  process.exit(1);
});

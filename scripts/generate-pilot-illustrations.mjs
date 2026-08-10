import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const PILOT_JSON_PATH = './data/atividades/fundamental-anos-iniciais/3-ano/1-bimestre/matematica.json';
const OUTPUT_DIR = './public/illustrations/biblioteca/fundamental-iniciais/3-ano/1-bimestre/matematica';
const DRAWINGS_DIR = './assets/desenhos/matematica';
const MANIFEST_PATH = './data/library-illustrations.json';

async function run() {
  console.log('Iniciando conversão dos desenhos oficiais de Matemática para PNGs permanentes...');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Diretório criado: ${OUTPUT_DIR}`);
  }

  const jsonContent = JSON.parse(fs.readFileSync(PILOT_JSON_PATH, 'utf8'));
  const activities = jsonContent.atividades || [];
  console.log(`Encontradas ${activities.length} atividades no lote de Matemática 3º ano - 1º bimestre.`);

  const manifest = [];
  let convertedCount = 0;

  for (let i = 0; i < activities.length; i++) {
    const activity = activities[i];
    const num = String(i + 1).padStart(3, '0');
    const webpFilename = `matematica-${num}.webp`;
    const webpPath = path.join(DRAWINGS_DIR, webpFilename).replace(/\\/g, '/');
    const pngFilename = `${activity.id}.png`;
    const fullPngPath = path.join(OUTPUT_DIR, pngFilename).replace(/\\/g, '/');
    const relativePath = `/illustrations/biblioteca/fundamental-iniciais/3-ano/1-bimestre/matematica/${pngFilename}`;

    if (!fs.existsSync(webpPath)) {
      throw new Error(`Desenho original não encontrado: ${webpPath}`);
    }

    console.log(`[${i + 1}/${activities.length}] Convertendo desenho oficial: ${webpFilename} -> ${pngFilename}...`);

    // Usar sharp-cli via npx para converter WebP em PNG de alta definição mantendo a arte original
    execSync(`npx -y sharp-cli -i "${webpPath}" -o "${fullPngPath}" -f png resize 1200 800`, { stdio: 'inherit' });
    convertedCount++;

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
      promptVersion: 'teacheasy-official-drawings-v1',
      generatedAt: new Date().toISOString()
    });
  }

  // Atualizar o JSON da coleção com os caminhos dos PNGs permanentes
  fs.writeFileSync(PILOT_JSON_PATH, JSON.stringify(jsonContent, null, 2) + '\n', 'utf8');
  console.log(`JSON atualizado com sucesso: ${PILOT_JSON_PATH}`);

  // Criar/Atualizar o manifesto de controle
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(`Manifesto criado/atualizado com sucesso: ${MANIFEST_PATH}`);

  console.log('\n--- RESUMO DO LOTE PILOTO DE DESENHOS OFICIAIS ---');
  console.log(`Total de atividades convertidas: ${convertedCount}`);
  console.log('Todos os desenhos oficiais foram salvos em PNG com sucesso!');
}

run().catch(err => {
  console.error('Erro na conversão dos desenhos:', err);
  process.exit(1);
});

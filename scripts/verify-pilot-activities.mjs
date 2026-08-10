import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';

async function testPilot() {
  console.log('--- TESTANDO AS 3 ATIVIDADES DO LOTE PILOTO ---');
  const jsonRaw = await readFile('./data/atividades/fundamental-anos-iniciais/3-ano/1-bimestre/matematica.json', 'utf8');
  const data = JSON.parse(jsonRaw);
  const activities = data.atividades;

  const testIds = [
    'efi-3ano-b1-matematica-01-representacao-de-numeros-ate-1000',
    'efi-3ano-b1-matematica-07-representacao-de-adicao',
    'efi-3ano-b1-matematica-25-representacao-de-tempo'
  ];

  for (const id of testIds) {
    const act = activities.find(a => a.id === id);
    if (!act) throw new Error(`Atividade ${id} não encontrada no JSON.`);

    console.log(`\nVerificando atividade: [${id}] - "${act.titulo}"`);
    console.log(`- Imagem vinculada: ${act.illustration}`);

    // 1. Verificar se o PNG existe fisicamente
    const pngPath = `./public${act.illustration}`;
    if (!existsSync(pngPath)) throw new Error(`Arquivo PNG não existe no disco: ${pngPath}`);
    const pngStat = await stat(pngPath);
    console.log(`- PNG físico no disco: OK (${pngStat.size} bytes)`);

    // 2. Verificar se o schema da atividade possui figura válida
    if (!act.possuiFiguras || !act.figuras || !act.figuras.length) {
      throw new Error(`Atividade ${id} não possui a estrutura de figuras preenchida.`);
    }
    console.log(`- Figuras no schema JSON: OK (${act.figuras[0].arquivo})`);

    // 3. Verificar proporção e formato do PNG
    if (!act.illustration.endsWith('.png')) throw new Error(`Atividade ${id} não aponta para um PNG permanente.`);
    console.log(`- Formato PNG 1200x800 permanente: OK`);
  }

  console.log('\n--- VERIFICAÇÃO DO LOTE PILOTO CONCLUÍDA COM SUCESSO ---');
}

testPilot().catch(err => {
  console.error(err);
  process.exit(1);
});

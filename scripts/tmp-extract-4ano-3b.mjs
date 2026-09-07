import fs from 'node:fs';

const input = 'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/lingua-portuguesa.json';
const output = 'var/4ano-3b-portugues-resumo.json';
const collection = JSON.parse(fs.readFileSync(input, 'utf8'));

const resumo = {
  schemaVersion: collection.schemaVersion,
  colecao: collection.colecao,
  quantidade: collection.atividades?.length || 0,
  atividades: (collection.atividades || []).map((a, index) => ({
    numero: index + 1,
    id: a.id,
    titulo: a.titulo,
    tema: a.tema,
    sequencia: a.sequencia,
    tipoSequencia: a.tipoSequencia,
    bncc: (a.bncc || []).map(x => ({ codigo: x.codigo, habilidadeOficial: x.habilidadeOficial })),
    imagem: a.figuras?.[0]?.arquivo || a.ilustracao?.arquivo || '',
    textoApoioTitulo: a.textoApoio?.titulo || '',
    revisao: a.revisao || null
  }))
};

fs.mkdirSync('var', { recursive: true });
fs.writeFileSync(output, JSON.stringify(resumo, null, 2) + '\n', 'utf8');
console.log(`Resumo gerado: ${output} (${resumo.quantidade} atividades)`);

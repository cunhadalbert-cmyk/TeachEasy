import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const ids=new Set(),titles=new Set(),prompts=new Set();let a=0,q=0,g=0;
for(let y=1;y<=9;y++){const s=y<=5?'fundamental-anos-iniciais':'fundamental-anos-finais';const c=JSON.parse(fs.readFileSync(path.join('data','atividades',s,`${y}-ano`,'4-bimestre','geografia.json'),'utf8'));assert.equal(c.padraoPedagogico,'teacheasy-v2');assert.equal(c.atividades.length,50);assert.equal(c.layout.margensCm,1);assert.equal(c.layout.moldura,'preta');for(const x of c.atividades){assert.equal(x.questoes.length,8);assert.equal(x.gabarito.length,8);assert.equal(x.ilustracao.status,'producao-visual-pendente');assert.equal(x.revisao.pedagogicaHumanaConcluida,false);assert.ok(!ids.has(x.id));ids.add(x.id);assert.ok(!titles.has(x.titulo));titles.add(x.titulo);for(const z of x.questoes){assert.doesNotMatch(z.enunciado,/EF\d{2}GE\d{2}/);assert.ok(!prompts.has(z.enunciado));prompts.add(z.enunciado);}a++;q+=8;g+=8;}}
test('Geografia do 4º bimestre possui 50 atividades V2 por ano e 450 no total',()=>{assert.equal(a,450);assert.equal(q,3600);assert.equal(g,3600);assert.equal(ids.size,450);assert.equal(titles.size,450);assert.equal(prompts.size,3600);});

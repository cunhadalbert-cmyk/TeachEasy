import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const subjects=['lingua-portuguesa.json','matematica.json','ciencias.json','historia.json','geografia.json'];
let total=0;
for(let year=1;year<=9;year++)for(let term=1;term<=4;term++)for(const subject of subjects){const stage=year<=5?'fundamental-anos-iniciais':'fundamental-anos-finais';const file=path.join('data','atividades',stage,`${year}-ano`,`${term}-bimestre`,subject);const c=JSON.parse(fs.readFileSync(file,'utf8'));assert.equal(c.atividades.length,50,`${file} deve possuir 50 atividades`);total+=c.atividades.length;}
test('todas as 180 coleções canônicas do Ensino Fundamental possuem 50 atividades',()=>assert.equal(total,9000));

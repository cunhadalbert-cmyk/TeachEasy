import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const base=path.join(root,'data/atividades/fundamental-anos-iniciais');
const findings=[],summary=[];
const norm=x=>String(x??'').trim();
for(let year=1;year<=5;year++)for(let term=1;term<=4;term++)for(const subject of ['ciencias','geografia','historia','lingua-portuguesa','matematica']){
 const rel=`data/atividades/fundamental-anos-iniciais/${year}-ano/${term}-bimestre/${subject}.json`;
 const p=path.join(root,rel); if(!fs.existsSync(p)){findings.push({file:rel,id:'',severity:'BLOCKER',code:'MISSING_COLLECTION'});continue}
 let col;try{col=JSON.parse(fs.readFileSync(p,'utf8'))}catch(e){findings.push({file:rel,id:'',severity:'BLOCKER',code:'INVALID_JSON',detail:String(e)});continue}
 let activities=col.atividades||[], noImage=0,issues=0;
 for(const a of activities){
  let id=a.id||'',f=(severity,code,detail='')=>{issues++;findings.push({file:rel,id,severity,code,detail})};
  if(!Array.isArray(a.figuras)||a.figuras.length===0){noImage++;f('PENDING_VISUAL','NO_LINKED_FIGURE')}
  if(!norm(a.textoApoio?.conteudo))f('BLOCKER','NO_SUPPORT_TEXT');
  if(a.questoes?.length!==8)f('BLOCKER','QUESTION_COUNT',String(a.questoes?.length));
  if(a.gabarito?.length!==8)f('BLOCKER','ANSWER_COUNT',String(a.gabarito?.length));
  const ids=new Set((a.figuras||[]).map(v=>v.id));
  for(const q of a.questoes||[]){
   if(!norm(q.enunciado))f('BLOCKER','EMPTY_QUESTION',String(q.numero));
   if(q.figuraId&&!ids.has(q.figuraId))f('BLOCKER','BROKEN_FIGURE_REF',String(q.numero));
  }
  for(const g of a.gabarito||[])if(!norm(g.resposta))f('BLOCKER','EMPTY_ANSWER',String(g.numero));
  if(/No \\dº ano, a investigação parte/.test(a.textoApoio?.conteudo||''))f('REVIEW','TEMPLATE_LANGUAGE');
  if(a.ilustracao?.status==='producao-visual-pendente')f('PENDING_VISUAL','ILLUSTRATION_PRODUCTION_PENDING');
 }
 summary.push({year,term,subject,count:activities.length,noImage,issues,review:col.revisaoPedagogicaHumana,visual:col.producaoVisual});
}
const out=path.join(root,'docs','auditoria-fundamental-1a5-gerada.json');
fs.writeFileSync(out,JSON.stringify({generatedAt:new Date().toISOString(),scope:'1-5 anos 100 colecoes',summary,findings},null,2)+'\n');
const groups={};for(const f of findings)groups[f.code]=(groups[f.code]||0)+1;
console.log(JSON.stringify({collections:summary.length,activities:summary.reduce((s,x)=>s+x.count,0),noImage:summary.reduce((s,x)=>s+x.noImage,0),groups,perCollection:summary.map(x=>({year:x.year,term:x.term,subject:x.subject,missing:x.noImage,total:x.count})),report:out},null,2));
if(findings.some(f=>f.severity==='BLOCKER'))process.exitCode=1;

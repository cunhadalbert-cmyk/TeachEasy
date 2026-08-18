import fs from 'node:fs';
import path from 'node:path';

// Pré-limpeza estrita: resíduos genéricos são descartados para que o migrador V2 os reconstrua.
const root = process.cwd();
const subjects = ['lingua-portuguesa.json','matematica.json','ciencias.json','historia.json','geografia.json'];
const validatorGeneric = [
  /\bA atividade aborda\b/i,
  /\bcom conceitos, exemplos e procedimentos adequados\b/i,
  /\bAnalise informações, organize estratégias\b/i,
  /\bdesenvolver aprendizagens de .+ relacionadas a\b/i,
  /\bAplique (?:EI|EF|EM)[A-Z0-9]+\b/i,
  /\bProduza síntese argumentativa\b/i,
  /\bResposta construída conforme\b/i,
  /\bResposta esperada coerente\b/i,
  /\bconsiderando o comando da questão\b/i,
  /\bMobilizar (?:EI|EF|EM)[A-Z0-9]+\b/i,
  /\bApresentar conclusão coerente e revisão ou proposta viável\b/i,
  /Explique a ideia central/i,
  /Identifique duas informações importantes/i,
  /Compare dois exemplos/i,
  /Relacione .+ a uma situação atual/i,
  /Produza uma conclusão justificada/i,
  /Resposta autoral coerente/i
];
const clean = value => String(value ?? '').replace(/\s+/g,' ').trim();
const generic = value => validatorGeneric.some(pattern => pattern.test(clean(value)));
const stage = year => year <= 5 ? 'fundamental-anos-iniciais' : 'fundamental-anos-finais';
let cleanedSupport=0, cleanedSkills=0, cleanedQuestions=0, cleanedAnswers=0;

for(let year=1;year<=9;year++) for(let term=1;term<=3;term++) for(const filename of subjects){
  const file=path.join(root,'data','atividades',stage(year),`${year}-ano`,`${term}-bimestre`,filename);
  const collection=JSON.parse(fs.readFileSync(file,'utf8'));
  for(const activity of collection.atividades){
    if(generic(activity.textoApoio?.conteudo)){
      activity.textoApoio = null;
      cleanedSupport++;
    }
    for(const skill of activity.bncc || []){
      for(const field of ['habilidadeOficial','descricaoResumida']){
        const text=clean(skill[field]);
        if(!text) continue;
        let sanitized=text
          .replace(/\bMobilizar\s+(?:EI|EF|EM)[A-Z0-9]+\s*/ig,'')
          .replace(/^Habilidade\s+(?:EI|EF|EM)[A-Z0-9]+:?\s*/i,'')
          .replace(/\bdesenvolver aprendizagens de\b/ig,'desenvolver conhecimentos sobre')
          .replace(/\bcom conceitos, exemplos e procedimentos adequados\b/ig,'com situações e evidências do tema');
        sanitized=clean(sanitized);
        if(generic(sanitized)) sanitized='';
        if(sanitized!==text){skill[field]=sanitized;cleanedSkills++;}
      }
    }
    for(const question of activity.questoes || []) if(generic(question.enunciado)){
      question.enunciado='';
      cleanedQuestions++;
    }
    for(const answer of activity.gabarito || []) if(generic(answer.resposta)){
      answer.resposta='';
      answer.justificativa='';
      cleanedAnswers++;
    }
  }
  fs.writeFileSync(file,`${JSON.stringify(collection,null,2)}\n`,'utf8');
}
console.log(`Pré-limpeza V2: apoio=${cleanedSupport}, habilidades=${cleanedSkills}, questões=${cleanedQuestions}, respostas=${cleanedAnswers}.`);

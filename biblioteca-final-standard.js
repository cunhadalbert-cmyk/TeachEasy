(() => {
  const DOCX_CDN = 'https://cdn.jsdelivr.net/npm/docx@9.7.1/dist/index.iife.js';
  const CIRCLED = ['❶','❷','❸','❹','❺','❻','❼','❽','❾','❿'];
  let docxPromise;

  const clean = (value = '') => String(value).replace(/\s+/g, ' ').trim();
  const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  function ensureDocx() {
    if (window.docx) return Promise.resolve(window.docx);
    if (docxPromise) return docxPromise;
    docxPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = DOCX_CDN;
      script.async = true;
      script.onload = () => window.docx ? resolve(window.docx) : reject(new Error('Gerador DOCX não carregou.'));
      script.onerror = () => reject(new Error('Não foi possível carregar o gerador DOCX.'));
      document.head.appendChild(script);
    });
    return docxPromise;
  }

  function selectedSubject() {
    return clean(document.querySelector('#library-filters select[name="subject"]')?.value || 'Atividade Escolar');
  }

  function stripBncc(text) {
    return clean(String(text || '')
      .replace(/\s*Foco BNCC:\s*.*$/i, '')
      .replace(/\s*[—-]\s*(EI0[123][A-Z]{2}\d{2}|EF\d{2}[A-Z]{2}\d{2}|EM13[A-Z]{2,3}\d{2,3}|EM13LP\d{2})\b.*$/i, ''));
  }

  function extractBncc(shell) {
    const text = clean(shell.textContent || '');
    const focus = text.match(/Foco BNCC:\s*([^\.]+(?:\.[^\.]+)?)/i)?.[1];
    if (focus) return clean(focus);
    const code = text.match(/\b(EI0[123][A-Z]{2}\d{2}|EF\d{2}[A-Z]{2}\d{2}|EM13[A-Z]{3}\d{3}|EM13LP\d{2})\b/);
    return code?.[1] || '';
  }

  function fallbackSvg(subject) {
    const type = subject.toLowerCase();
    if (type.includes('matem')) return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420"><rect width="600" height="420" rx="28" fill="#f6fbff"/><circle cx="135" cy="120" r="70" fill="#ffd86b"/><rect x="260" y="62" width="140" height="115" rx="18" fill="#8ed0ff"/><polygon points="470,55 545,180 395,180" fill="#7fcd91"/><g fill="#245b9b" font-family="Arial" font-size="54" font-weight="700"><text x="92" y="139">7</text><text x="300" y="139">+</text><text x="448" y="139">3</text></g><rect x="70" y="255" width="460" height="95" rx="22" fill="#ffffff" stroke="#5ea777" stroke-width="5"/><g fill="#ef6c55"><circle cx="145" cy="303" r="22"/><circle cx="205" cy="303" r="22"/><circle cx="265" cy="303" r="22"/></g><g fill="#4f9fe8"><circle cx="335" cy="303" r="22"/><circle cx="395" cy="303" r="22"/><circle cx="455" cy="303" r="22"/></g></svg>`;
    if (type.includes('língua') || type.includes('portugu') || type.includes('ingl')) return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420"><rect width="600" height="420" rx="28" fill="#f7fbff"/><rect x="55" y="65" width="225" height="280" rx="20" fill="#fff" stroke="#245b9b" stroke-width="6"/><rect x="320" y="65" width="225" height="280" rx="20" fill="#fff" stroke="#245b9b" stroke-width="6"/><path d="M300 85v245" stroke="#5ea777" stroke-width="8"/><g stroke="#9bb9d8" stroke-width="5"><path d="M90 125h150M90 170h150M90 215h150M355 125h150M355 170h150M355 215h150"/></g><circle cx="300" cy="335" r="34" fill="#ffd86b"/><path d="M285 335l12 12 22-30" fill="none" stroke="#2e7d32" stroke-width="8" stroke-linecap="round"/></svg>`;
    if (type.includes('geograf')) return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420"><rect width="600" height="420" rx="28" fill="#eef9ff"/><circle cx="300" cy="205" r="145" fill="#7bc6ff" stroke="#245b9b" stroke-width="7"/><path d="M210 100c42-28 86-24 108 9 20 30-15 54-4 79 14 33 66 25 82 58 20 40-38 88-84 76-40-10-43-54-80-66-31-10-65 10-78-18-18-39 27-55 41-83 10-20-4-36 15-55z" fill="#7bcf89"/><path d="M300 60v290M155 205h290" stroke="#fff" stroke-width="4" opacity=".75"/></svg>`;
    if (type.includes('hist')) return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420"><rect width="600" height="420" rx="28" fill="#fff8ec"/><path d="M115 88h350l-35 245H150z" fill="#f1d49b" stroke="#8b6b3f" stroke-width="7"/><path d="M180 135h220M180 185h220M180 235h160" stroke="#8b6b3f" stroke-width="8" stroke-linecap="round"/><circle cx="450" cy="300" r="72" fill="#e76f51"/><path d="M450 262v45l32 20" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round"/></svg>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420"><rect width="600" height="420" rx="28" fill="#f3fbf5"/><rect x="80" y="235" width="440" height="95" rx="20" fill="#d7ecff"/><g stroke="#245b9b" stroke-width="7" fill="none"><path d="M175 235v-92h70v92M355 235v-92h70v92"/></g><g fill="#8ed0ff"><path d="M175 143h70l-15-48h-40z"/><path d="M355 143h70l-15-48h-40z"/></g><g fill="#f7c84b"><circle cx="210" cy="265" r="30"/><circle cx="390" cy="265" r="30"/></g><path d="M285 90c-45 60-25 112 15 112s60-52 15-112l-15-22z" fill="#7fcd91" stroke="#4c9762" stroke-width="5"/></svg>`;
  }

  function svgDataUrl(svg) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  function questionData(shell) {
    return [...shell.querySelectorAll('.collection-student-page .collection-question-list > li')].map((li, index) => ({
      index,
      prompt: stripBncc(li.querySelector('p')?.textContent || li.textContent),
      alternatives: [...li.querySelectorAll('.question-alternatives li')].map(node => clean(node.textContent)),
      image: li.querySelector('img')?.src || '',
      lines: li.querySelector('.answer-space-grande') ? 2 : li.querySelector('.question-alternatives') ? 0 : 1
    }));
  }

  function answerData(shell) {
    return [...shell.querySelectorAll('.collection-answer-key > ol > li')].map(li => stripBncc(li.textContent));
  }

  function installStyles() {
    if (document.querySelector('#te-final-standard-style')) return;
    const style = document.createElement('style');
    style.id = 'te-final-standard-style';
    style.textContent = `
      .te-final-tools{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:10px 0 14px;padding:10px 12px;border:1px solid #cbd9e8;border-radius:12px;background:#f7fbff}
      .te-final-tools label{display:flex;gap:6px;align-items:center;font-size:.9rem}
      .te-final-page{box-sizing:border-box;width:210mm;min-height:297mm;margin:0 auto 18px;padding:8mm 10mm;background:#fff;border:1.5px dashed #4caf50;color:#202b33;font-family:Arial,sans-serif;page-break-after:always}
      .te-final-header{border:1.6px solid #245b9b;padding:4mm 5mm;margin-bottom:3mm;border-radius:2mm;font-size:10.5pt;font-weight:700}
      .te-final-school{margin-bottom:2.5mm}.te-final-fields{display:grid;grid-template-columns:1.7fr .75fr 1fr 1fr;gap:3mm}
      .te-final-title{text-align:left;color:#245b9b;font-size:19pt;line-height:1.05;font-weight:800;margin:0 0 1mm;text-transform:uppercase}
      .te-final-subtitle{text-align:center;color:#2e7d32;font-size:14.5pt;font-weight:800;margin:0 0 3mm}
      .te-final-content{display:grid;grid-template-columns:1fr 1fr;gap:3mm;border:1px solid #5f6b73;margin-bottom:2.5mm;min-height:54mm;max-height:62mm;overflow:hidden}
      .te-final-text{padding:3mm;font-size:10.2pt;line-height:1.28;text-align:justify;overflow:hidden}
      .te-final-text h3{color:#2e7d32;font-size:11pt;margin:0 0 1.5mm}.te-final-visual{border-left:1px solid #5f6b73;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#f8fbfd}.te-final-visual img{width:100%;height:100%;object-fit:cover;display:block}
      .te-final-instruction{text-align:center;font-weight:800;font-size:10.5pt;margin:2mm 0 3mm}.te-final-instruction::before{content:'★ ';color:#2e7d32}
      .te-final-questions{display:flex;flex-direction:column;gap:2.4mm}.te-final-question{page-break-inside:avoid}.te-final-qhead{display:flex;gap:2.5mm;align-items:flex-start;font-size:10.3pt;line-height:1.2}.te-final-qnum{width:5.5mm;height:5.5mm;border-radius:50%;background:#2e7d32;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-weight:800;font-size:8.5pt;flex:0 0 auto}.te-final-alts{margin:1mm 0 0 8mm;font-size:9.8pt}.te-final-line{height:5mm;border-bottom:1px solid #555;margin-left:8mm}
      .te-final-answer h2{color:#245b9b;text-align:center;font-size:19pt;margin:0 0 1mm}.te-final-answer h3{text-align:center;color:#2e7d32;font-size:14pt;margin:0 0 4mm}.te-final-answer li{margin-bottom:2.5mm;font-size:10.5pt}.te-final-bncc{margin-top:4mm;padding:3mm;border-left:4px solid #2e7d32;background:#f3f8f4;font-size:10pt}
      .te-final-hidden{display:none!important}
      @media(max-width:760px){.te-final-page{width:100%;min-height:auto;padding:18px}.te-final-fields{grid-template-columns:1fr 1fr}.te-final-content{grid-template-columns:1fr;max-height:none}.te-final-visual{border-left:0;border-top:1px solid #5f6b73;min-height:180px}}
      @media print{body *{visibility:hidden!important}.activity-preview,.activity-preview *{visibility:visible!important}.activity-preview{position:absolute!important;inset:0!important;width:100%!important;max-width:none!important;border:0!important;background:#fff!important}.preview-close,.te-final-tools{display:none!important}.te-final-page{margin:0!important;width:210mm!important;min-height:297mm!important;box-shadow:none!important}}
    `;
    document.head.appendChild(style);
  }

  function buildFinal(shell) {
    if (shell.dataset.teFinalBuilt === 'true') return;
    const oldPages = [...shell.querySelectorAll('.worksheet-page')];
    if (!oldPages.length) return;
    const topic = clean(shell.querySelector('.collection-student-page h1')?.textContent || document.querySelector('#preview-title')?.textContent || 'Atividade');
    const subject = selectedSubject();
    const support = shell.querySelector('.collection-student-page .support-text');
    const supportTitle = stripBncc(support?.querySelector('h1,h2,h3')?.textContent || topic);
    const supportBody = stripBncc([...support?.querySelectorAll('p') || []].map(p => p.textContent).join(' '));
    const instruction = clean(shell.querySelector('.collection-instruction')?.textContent || 'Responda às questões com atenção.');
    const questions = questionData(shell).slice(0, 8);
    const answers = answerData(shell).slice(0, questions.length);
    const bncc = extractBncc(shell);
    const existingImage = shell.querySelector('.collection-student-page img.question-figure')?.src || '';
    const visual = existingImage || svgDataUrl(fallbackSvg(subject));

    const tools = document.createElement('div');
    tools.className = 'te-final-tools';
    tools.innerHTML = `<button class="btn btn-outline te-final-pdf" type="button">Baixar PDF / Imprimir</button><button class="btn btn-primary te-final-word" type="button">Baixar Word editável (.docx)</button><label><input type="checkbox" name="teFinalAnswer" checked> Incluir gabarito</label><label><input type="checkbox" name="teFinalBncc" checked> Incluir BNCC no gabarito</label>`;

    const student = document.createElement('section');
    student.className = 'te-final-page te-final-student';
    student.innerHTML = `
      <div class="te-final-header"><div class="te-final-school">Escola: ________________________________________________________________</div><div class="te-final-fields"><span>Nome: ________________________________</span><span>Turma: __________</span><span>Data: ____/____/______</span><span>Prof.: ________________</span></div></div>
      <h1 class="te-final-title">ATIVIDADE DE ${escapeHtml(subject.toUpperCase())}</h1>
      <h2 class="te-final-subtitle">${escapeHtml(topic)}</h2>
      <div class="te-final-content"><div class="te-final-text"><h3>${escapeHtml(supportTitle)}</h3><p>${escapeHtml(supportBody || `Leia e analise as informações sobre ${topic}.`)}</p></div><div class="te-final-visual"><img src="${visual}" alt="Ilustração pedagógica relacionada a ${escapeHtml(topic)}"></div></div>
      <div class="te-final-instruction">${escapeHtml(instruction)}</div>
      <div class="te-final-questions">${questions.map((q, i) => `<div class="te-final-question"><div class="te-final-qhead"><span class="te-final-qnum">${i+1}</span><span>${escapeHtml(q.prompt)}</span></div>${q.alternatives.length ? `<ol class="te-final-alts" type="a">${q.alternatives.map(a => `<li>${escapeHtml(a)}</li>`).join('')}</ol>` : ''}${Array.from({length:q.lines},()=>'<div class="te-final-line"></div>').join('')}</div>`).join('')}</div>`;

    const answer = document.createElement('section');
    answer.className = 'te-final-page te-final-answer';
    answer.innerHTML = `<h2>GABARITO</h2><h3>${escapeHtml(topic)}</h3><ol>${answers.map((a,i)=>`<li><strong>${i+1}.</strong> ${escapeHtml(a)}</li>`).join('')}</ol>${bncc ? `<div class="te-final-bncc"><strong>BNCC:</strong> ${escapeHtml(bncc)}</div>` : ''}`;

    shell.querySelectorAll('.te-library-standard-tools,.collection-export-actions').forEach(node => node.remove());
    oldPages.forEach(page => page.classList.add('te-final-hidden'));
    shell.insertBefore(tools, shell.firstChild);
    shell.append(student, answer);
    shell.dataset.teFinalBuilt = 'true';
    shell._teFinalData = { topic, subject, supportTitle, supportBody, instruction, questions, answers, bncc, visual };
    syncOptions(shell);
  }

  function syncOptions(shell) {
    const tools = shell.querySelector('.te-final-tools');
    const answer = shell.querySelector('.te-final-answer');
    if (!tools || !answer) return;
    const showAnswer = tools.querySelector('[name="teFinalAnswer"]')?.checked !== false;
    const showBncc = showAnswer && tools.querySelector('[name="teFinalBncc"]')?.checked !== false;
    answer.classList.toggle('te-final-hidden', !showAnswer);
    answer.querySelector('.te-final-bncc')?.classList.toggle('te-final-hidden', !showBncc);
  }

  async function imageBytesFromSource(src) {
    if (!src) return null;
    if (src.startsWith('data:image/svg+xml')) {
      const svgText = decodeURIComponent(src.split(',').slice(1).join(','));
      const blob = new Blob([svgText], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      try {
        const img = new Image();
        await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = url; });
        const canvas = document.createElement('canvas'); canvas.width = 600; canvas.height = 420;
        canvas.getContext('2d').drawImage(img, 0, 0, 600, 420);
        const png = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        return new Uint8Array(await png.arrayBuffer());
      } finally { URL.revokeObjectURL(url); }
    }
    const response = await fetch(src);
    if (!response.ok) return null;
    return new Uint8Array(await response.arrayBuffer());
  }

  function p(docx, text, opts = {}) {
    return new docx.Paragraph({alignment:opts.align,spacing:{before:opts.before||0,after:opts.after??55,line:opts.line||245},pageBreakBefore:opts.pageBreakBefore||false,children:[new docx.TextRun({text:clean(text),bold:opts.bold||false,size:opts.size||19,color:opts.color||'202B33'})]});
  }

  function tableCell(docx, text, width) {
    return new docx.TableCell({width:{size:width,type:docx.WidthType.PERCENTAGE},margins:{top:65,bottom:65,left:80,right:80},children:[p(docx,text,{bold:true,size:17,after:0})]});
  }

  function docHeader(docx) {
    const b={top:{style:docx.BorderStyle.SINGLE,size:8,color:'245B9B'},bottom:{style:docx.BorderStyle.SINGLE,size:8,color:'245B9B'},left:{style:docx.BorderStyle.SINGLE,size:8,color:'245B9B'},right:{style:docx.BorderStyle.SINGLE,size:8,color:'245B9B'},insideHorizontal:{style:docx.BorderStyle.NONE,size:0,color:'FFFFFF'},insideVertical:{style:docx.BorderStyle.NONE,size:0,color:'FFFFFF'}};
    return new docx.Table({width:{size:100,type:docx.WidthType.PERCENTAGE},borders:b,rows:[new docx.TableRow({children:[tableCell(docx,'Escola: ________________________________________________________________',100)]}),new docx.TableRow({children:[tableCell(docx,'Nome: ________________________________',42),tableCell(docx,'Turma: ________',17),tableCell(docx,'Data: ____/____/______',22),tableCell(docx,'Prof.: ______________',19)]})]});
  }

  async function exportDocx(shell) {
    const d = shell._teFinalData; if (!d) return;
    const docx = await ensureDocx();
    const children=[docHeader(docx),p(docx,`ATIVIDADE DE ${d.subject.toUpperCase()}`,{bold:true,size:30,color:'245B9B',after:45}),p(docx,d.topic,{bold:true,size:24,color:'2E7D32',align:docx.AlignmentType.CENTER,after:70})];
    if (d.supportTitle) children.push(p(docx,d.supportTitle,{bold:true,size:19,color:'2E7D32',after:30}));
    if (d.supportBody) children.push(p(docx,d.supportBody,{size:18,after:45,line:235}));
    const imgData=await imageBytesFromSource(d.visual);
    if (imgData) children.push(new docx.Paragraph({alignment:docx.AlignmentType.CENTER,spacing:{after:55},children:[new docx.ImageRun({data:imgData,type:'png',transformation:{width:290,height:150}})]}));
    children.push(p(docx,`★ ${d.instruction}`,{bold:true,size:18,align:docx.AlignmentType.CENTER,after:55}));
    d.questions.forEach((q,i)=>{
      children.push(new docx.Paragraph({spacing:{before:25,after:22,line:235},children:[new docx.TextRun({text:`${CIRCLED[i]||`${i+1}.`}  `,bold:true,size:19,color:'2E7D32'}),new docx.TextRun({text:q.prompt,size:18})]}));
      q.alternatives.forEach((a,j)=>children.push(p(docx,`${String.fromCharCode(97+j)}) ${a}`,{size:17,after:18})));
      for(let n=0;n<q.lines;n++) children.push(p(docx,'________________________________________________________________________________________',{size:13,color:'666666',after:18}));
    });
    const showAnswer=shell.querySelector('[name="teFinalAnswer"]')?.checked!==false;
    const showBncc=showAnswer && shell.querySelector('[name="teFinalBncc"]')?.checked!==false;
    if(showAnswer){
      children.push(p(docx,'GABARITO',{bold:true,size:30,color:'245B9B',align:docx.AlignmentType.CENTER,pageBreakBefore:true,after:45}),p(docx,d.topic,{bold:true,size:22,color:'2E7D32',align:docx.AlignmentType.CENTER,after:70}));
      d.answers.forEach((a,i)=>children.push(p(docx,`${i+1}. ${a}`,{size:18,after:40})));
      if(showBncc && d.bncc) children.push(p(docx,`BNCC: ${d.bncc}`,{bold:true,size:18,color:'2E7D32',before:60,after:45}));
    }
    const file=new docx.Document({styles:{default:{document:{run:{font:'Arial',size:18,color:'202B33'},paragraph:{spacing:{line:245,after:55}}}}},sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:300,right:420,bottom:420,left:420,header:180,footer:180},pageBorders:{display:'allPages',offsetFrom:'page',zOrder:'front',top:{style:docx.BorderStyle.DASHED,size:8,color:'4CAF50',space:12},bottom:{style:docx.BorderStyle.DASHED,size:8,color:'4CAF50',space:12},left:{style:docx.BorderStyle.DASHED,size:8,color:'4CAF50',space:12},right:{style:docx.BorderStyle.DASHED,size:8,color:'4CAF50',space:12}}}},children}]});
    const blob=await docx.Packer.toBlob(file); const url=URL.createObjectURL(blob); const a=document.createElement('a');
    const slug=d.topic.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,55);
    a.href=url;a.download=`atividade_${slug||'teacheasy'}.docx`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  function process() {
    installStyles();
    document.querySelectorAll('#preview-content .collection-preview-shell').forEach(buildFinal);
  }

  document.addEventListener('click', async event => {
    const shell=event.target.closest('.collection-preview-shell'); if(!shell) return;
    if(event.target.closest('.preview-word,.preview-print,.te-library-word,.te-library-pdf')){event.preventDefault();event.stopImmediatePropagation();process();return;}
    if(event.target.closest('.te-final-pdf')){event.preventDefault();event.stopImmediatePropagation();syncOptions(shell);window.print();return;}
    const word=event.target.closest('.te-final-word');
    if(word){event.preventDefault();event.stopImmediatePropagation();const old=word.textContent;word.disabled=true;word.textContent='Preparando Word...';try{syncOptions(shell);await exportDocx(shell);}catch(error){console.error(error);alert('Não foi possível gerar o Word agora.');}finally{word.disabled=false;word.textContent=old;}}
  }, true);
  document.addEventListener('change', event=>{if(event.target.matches('[name="teFinalAnswer"],[name="teFinalBncc"]')){const shell=event.target.closest('.collection-preview-shell');if(shell)syncOptions(shell);}});

  const root=document.querySelector('#preview-content');
  if(root)new MutationObserver(process).observe(root,{childList:true,subtree:true});
  process();
})();

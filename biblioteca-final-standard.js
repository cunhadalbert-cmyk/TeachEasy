(() => {
  const DOCX_CDN = 'https://cdn.jsdelivr.net/npm/docx@9.7.1/dist/index.iife.js';
  const ACTIVITY_LAYOUT = Object.freeze({
    page: { format: 'A4', orientation: 'portrait', widthMm: 210, heightMm: 297, marginMm: 10 },
    colors: { primary: '#1F497D', text: '#141414', border: '#000000' },
    fonts: { family: 'Arial', header: 11, title: 13, subtitle: 13, bodyDefault: 12, bodyMin: 8, bodyStep: 0.5, questionHeading: 11, question: 11 },
    contentBox: { widthCm: 18.5, heightCm: 9.6, textRatio: 0.47, imageRatio: 0.53 }
  });
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
    return text.match(/\b(EI0[123][A-Z]{2}\d{2}|EF\d{2}[A-Z]{2}\d{2}|EM13[A-Z]{3}\d{3}|EM13LP\d{2})\b/)?.[1] || '';
  }

  function questionData(shell) {
    return [...shell.querySelectorAll('.collection-student-page .collection-question-list > li')].map(li => ({
      prompt: stripBncc(li.querySelector('p')?.textContent || li.textContent),
      alternatives: [...li.querySelectorAll('.question-alternatives li')].map(node => clean(node.textContent)),
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
      .te-final-tools{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:10px 0 14px;padding:10px 12px;border:1px solid #cbd9e8;border-radius:10px;background:#f7fbff}
      .te-final-tools label{display:flex;gap:6px;align-items:center;font-size:.9rem}
      .te-final-page{box-sizing:border-box;width:210mm;min-height:297mm;margin:0 auto 18px;padding:10mm;background:#fff;color:#141414;font-family:Arial,sans-serif;page-break-after:always}
      .te-final-header{border:1px solid #000;padding:3mm 4mm;margin-bottom:3mm;font-size:11pt;font-weight:700}
      .te-final-school{margin-bottom:2mm}.te-final-fields{display:grid;grid-template-columns:1.7fr .75fr 1fr 1fr;gap:3mm}
      .te-final-title{text-align:center;color:#1F497D;font-size:13pt;line-height:1.1;font-weight:700;margin:0 0 1.5mm;text-transform:uppercase}
      .te-final-subtitle{text-align:center;color:#141414;font-size:13pt;line-height:1.1;font-weight:700;margin:0 0 3mm}
      .te-final-content{box-sizing:border-box;display:grid;grid-template-columns:47fr 53fr;width:18.5cm;height:9.6cm;border:1px solid #000;margin:0 auto 3mm;overflow:visible}
      .te-final-text{box-sizing:border-box;padding:3mm;font-size:12pt;line-height:1.17;text-align:justify;overflow:visible}
      .te-final-text h3{font:700 12pt/1.15 Arial,sans-serif;margin:0 0 1.5mm;color:#141414}.te-final-text p{margin:0}
      .te-final-visual{box-sizing:border-box;border-left:1px solid #000;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#fff;padding:2mm}
      .te-final-visual img{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;display:block}
      .te-final-instruction{text-align:left;font-weight:700;font-size:11pt;margin:2mm 0 2.5mm}
      .te-final-questions{display:flex;flex-direction:column;gap:2mm}.te-final-question{page-break-inside:avoid}.te-final-qhead{font-size:11pt;line-height:1.18}.te-final-qnum{font-weight:700;margin-right:1.5mm}.te-final-alts{margin:1mm 0 0 7mm;font-size:11pt}.te-final-line{height:5mm;border-bottom:1px solid #555;margin-left:7mm}
      .te-final-answer h2{color:#1F497D;text-align:center;font-size:13pt;margin:0 0 1.5mm}.te-final-answer h3{text-align:center;color:#141414;font-size:13pt;margin:0 0 4mm}.te-final-answer li{margin-bottom:2.5mm;font-size:11pt}.te-final-bncc{margin-top:4mm;padding:3mm;border:1px solid #000;font-size:10pt}
      .te-final-hidden{display:none!important}
      @media(max-width:760px){.te-final-page{width:100%;min-height:auto;padding:18px}.te-final-fields{grid-template-columns:1fr 1fr}.te-final-content{width:100%;height:auto;min-height:360px;grid-template-columns:47fr 53fr}}
      @media print{body *{visibility:hidden!important}.activity-preview,.activity-preview *{visibility:visible!important}.activity-preview{position:absolute!important;inset:0!important;width:100%!important;max-width:none!important;border:0!important;background:#fff!important}.preview-close,.te-final-tools{display:none!important}.te-final-page{margin:0!important;width:210mm!important;min-height:297mm!important;box-shadow:none!important}}
    `;
    document.head.appendChild(style);
  }

  function contentFits(textEl) {
    return textEl.scrollHeight <= textEl.clientHeight + 1 && textEl.scrollWidth <= textEl.clientWidth + 1;
  }

  function resolveActivityLayout(shell) {
    const textEl = shell.querySelector('.te-final-text');
    if (!textEl) return ACTIVITY_LAYOUT.fonts.bodyDefault;
    let size = ACTIVITY_LAYOUT.fonts.bodyDefault;
    textEl.style.fontSize = `${size}pt`;
    while (!contentFits(textEl) && size > ACTIVITY_LAYOUT.fonts.bodyMin) {
      size = Math.max(ACTIVITY_LAYOUT.fonts.bodyMin, size - ACTIVITY_LAYOUT.fonts.bodyStep);
      textEl.style.fontSize = `${size}pt`;
    }
    shell._teFinalData.bodyFontSize = size;
    return size;
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
    const instruction = clean(shell.querySelector('.collection-instruction')?.textContent || 'Responda às questões de acordo com o texto.');
    const questions = questionData(shell).slice(0, 8);
    const answers = answerData(shell).slice(0, questions.length);
    const bncc = extractBncc(shell);
    const visual = shell.querySelector('.collection-student-page img.activity-figure, .collection-student-page img.question-figure')?.src || '';

    const tools = document.createElement('div');
    tools.className = 'te-final-tools';
    tools.innerHTML = `<button class="btn btn-outline te-final-pdf" type="button">Baixar PDF / Imprimir</button><button class="btn btn-primary te-final-word" type="button">Baixar Word editável (.docx)</button><label><input type="checkbox" name="teFinalAnswer" checked> Incluir gabarito</label><label><input type="checkbox" name="teFinalBncc" checked> Incluir BNCC no gabarito</label>`;

    const student = document.createElement('section');
    student.className = 'te-final-page te-final-student';
    student.innerHTML = `
      <div class="te-final-header"><div class="te-final-school">ESCOLA: _________________________________________________</div><div class="te-final-fields"><span>Nome: ______________________________</span><span>Turma: ________</span><span>Data: ____/____/______</span><span>Prof.: ____________</span></div></div>
      <h1 class="te-final-title">ATIVIDADE DE ${escapeHtml(subject.toUpperCase())}</h1>
      <h2 class="te-final-subtitle">${escapeHtml(topic)}</h2>
      <div class="te-final-content"><div class="te-final-text"><h3>${escapeHtml(supportTitle)}</h3><p>${escapeHtml(supportBody || `Leia e analise as informações sobre ${topic}.`)}</p></div><div class="te-final-visual">${visual ? `<img src="${visual}" alt="Ilustração pedagógica relacionada a ${escapeHtml(topic)}">` : ''}</div></div>
      <div class="te-final-instruction">${escapeHtml(instruction)}</div>
      <div class="te-final-questions">${questions.map((q, i) => `<div class="te-final-question"><div class="te-final-qhead"><span class="te-final-qnum">${i + 1}.</span><span>${escapeHtml(q.prompt)}</span></div>${q.alternatives.length ? `<ol class="te-final-alts" type="a">${q.alternatives.map(a => `<li>${escapeHtml(a)}</li>`).join('')}</ol>` : ''}${Array.from({length:q.lines},()=>'<div class="te-final-line"></div>').join('')}</div>`).join('')}</div>`;

    const answer = document.createElement('section');
    answer.className = 'te-final-page te-final-answer';
    answer.innerHTML = `<h2>GABARITO</h2><h3>${escapeHtml(topic)}</h3><ol>${answers.map((a,i)=>`<li><strong>${i+1}.</strong> ${escapeHtml(a)}</li>`).join('')}</ol>${bncc ? `<div class="te-final-bncc"><strong>BNCC:</strong> ${escapeHtml(bncc)}</div>` : ''}`;

    shell.querySelectorAll('.te-library-standard-tools,.collection-export-actions').forEach(node => node.remove());
    oldPages.forEach(page => page.classList.add('te-final-hidden'));
    shell.insertBefore(tools, shell.firstChild);
    shell.append(student, answer);
    shell.dataset.teFinalBuilt = 'true';
    shell._teFinalData = { topic, subject, supportTitle, supportBody, instruction, questions, answers, bncc, visual, bodyFontSize: ACTIVITY_LAYOUT.fonts.bodyDefault };
    syncOptions(shell);
    requestAnimationFrame(() => resolveActivityLayout(shell));
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
    const response = await fetch(src);
    if (!response.ok) return null;
    return new Uint8Array(await response.arrayBuffer());
  }

  function p(docx, text, opts = {}) {
    return new docx.Paragraph({
      alignment: opts.align,
      spacing: {before: opts.before || 0, after: opts.after ?? 35, line: opts.line || 230},
      pageBreakBefore: opts.pageBreakBefore || false,
      children: [new docx.TextRun({text: clean(text), bold: opts.bold || false, size: opts.size || 22, color: opts.color || '141414', font: 'Arial'})]
    });
  }

  function docHeader(docx) {
    const border = {style:docx.BorderStyle.SINGLE,size:6,color:'000000'};
    const borders={top:border,bottom:border,left:border,right:border,insideHorizontal:{style:docx.BorderStyle.NONE,size:0,color:'FFFFFF'},insideVertical:{style:docx.BorderStyle.NONE,size:0,color:'FFFFFF'}};
    const cell = (text,width) => new docx.TableCell({width:{size:width,type:docx.WidthType.PERCENTAGE},margins:{top:55,bottom:55,left:70,right:70},children:[p(docx,text,{bold:true,size:22,after:0})]});
    return new docx.Table({width:{size:100,type:docx.WidthType.PERCENTAGE},borders,rows:[
      new docx.TableRow({children:[cell('ESCOLA: _________________________________________________',100)]}),
      new docx.TableRow({children:[cell('Nome: ______________________________',42),cell('Turma: ________',16),cell('Data: ____/____/______',24),cell('Prof.: ____________',18)]})
    ]});
  }

  async function contentTable(docx, d) {
    const border = {style:docx.BorderStyle.SINGLE,size:6,color:'000000'};
    const imageData = await imageBytesFromSource(d.visual);
    const textChildren = [];
    if (d.supportTitle) textChildren.push(p(docx,d.supportTitle,{bold:true,size:Math.round(d.bodyFontSize*2),after:35}));
    textChildren.push(p(docx,d.supportBody || `Leia e analise as informações sobre ${d.topic}.`,{size:Math.round(d.bodyFontSize*2),after:0,line:230}));
    const imageChildren = imageData ? [new docx.Paragraph({alignment:docx.AlignmentType.CENTER,spacing:{after:0},children:[new docx.ImageRun({data:imageData,type:'png',transformation:{width:330,height:185}})]})] : [p(docx,'',{after:0})];

    return new docx.Table({
      width:{size:100,type:docx.WidthType.PERCENTAGE},
      columnWidths:[4300,4850],
      rows:[new docx.TableRow({
        height:{value:5440,rule:docx.HeightRule.AT_LEAST},
        children:[
          new docx.TableCell({width:{size:47,type:docx.WidthType.PERCENTAGE},verticalAlign:docx.VerticalAlign.CENTER,borders:{top:border,bottom:border,left:border,right:border},margins:{top:110,bottom:110,left:120,right:120},children:textChildren}),
          new docx.TableCell({width:{size:53,type:docx.WidthType.PERCENTAGE},verticalAlign:docx.VerticalAlign.CENTER,borders:{top:border,bottom:border,left:border,right:border},margins:{top:80,bottom:80,left:80,right:80},children:imageChildren})
        ]
      })]
    });
  }

  async function exportDocx(shell) {
    const d = shell._teFinalData;
    if (!d) return;
    resolveActivityLayout(shell);
    const docx = await ensureDocx();
    const children = [
      docHeader(docx),
      p(docx,`ATIVIDADE DE ${d.subject.toUpperCase()}`,{bold:true,size:26,color:'1F497D',align:docx.AlignmentType.CENTER,after:30}),
      p(docx,d.topic,{bold:true,size:26,color:'141414',align:docx.AlignmentType.CENTER,after:55}),
      await contentTable(docx,d),
      p(docx,d.instruction,{bold:true,size:22,after:45,before:45})
    ];

    d.questions.forEach((q,i) => {
      children.push(new docx.Paragraph({spacing:{before:20,after:20,line:230},children:[
        new docx.TextRun({text:`${i+1}. `,bold:true,size:22,font:'Arial'}),
        new docx.TextRun({text:q.prompt,size:22,font:'Arial'})
      ]}));
      q.alternatives.forEach((a,j)=>children.push(p(docx,`${String.fromCharCode(97+j)}) ${a}`,{size:22,after:15})));
      for(let n=0;n<q.lines;n++) children.push(p(docx,'________________________________________________________________________________________',{size:14,color:'666666',after:12}));
    });

    const showAnswer=shell.querySelector('[name="teFinalAnswer"]')?.checked!==false;
    const showBncc=showAnswer && shell.querySelector('[name="teFinalBncc"]')?.checked!==false;
    if(showAnswer){
      children.push(p(docx,'GABARITO',{bold:true,size:26,color:'1F497D',align:docx.AlignmentType.CENTER,pageBreakBefore:true,after:35}),p(docx,d.topic,{bold:true,size:26,align:docx.AlignmentType.CENTER,after:55}));
      d.answers.forEach((a,i)=>children.push(p(docx,`${i+1}. ${a}`,{size:22,after:30})));
      if(showBncc && d.bncc) children.push(p(docx,`BNCC: ${d.bncc}`,{bold:true,size:20,before:50,after:35}));
    }

    const file = new docx.Document({
      styles:{default:{document:{run:{font:'Arial',size:22,color:'141414'},paragraph:{spacing:{line:230,after:35}}}}},
      sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:567,right:567,bottom:567,left:567,header:180,footer:180}}},children}]
    });
    const blob = await docx.Packer.toBlob(file);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const slug=d.topic.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,55);
    a.href=url;a.download=`atividade_${slug||'teacheasy'}.docx`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  function process() {
    installStyles();
    document.querySelectorAll('#preview-content .collection-preview-shell').forEach(buildFinal);
  }

  document.addEventListener('click', async event => {
    const shell=event.target.closest('.collection-preview-shell');
    if(!shell) return;
    if(event.target.closest('.preview-word,.preview-print,.te-library-word,.te-library-pdf')){event.preventDefault();event.stopImmediatePropagation();process();return;}
    if(event.target.closest('.te-final-pdf')){event.preventDefault();event.stopImmediatePropagation();syncOptions(shell);resolveActivityLayout(shell);window.print();return;}
    const word=event.target.closest('.te-final-word');
    if(word){event.preventDefault();event.stopImmediatePropagation();const old=word.textContent;word.disabled=true;word.textContent='Preparando Word...';try{syncOptions(shell);await exportDocx(shell);}catch(error){console.error(error);alert('Não foi possível gerar o Word agora.');}finally{word.disabled=false;word.textContent=old;}}
  }, true);

  document.addEventListener('change', event=>{
    if(event.target.matches('[name="teFinalAnswer"],[name="teFinalBncc"]')){
      const shell=event.target.closest('.collection-preview-shell');
      if(shell) syncOptions(shell);
    }
  });

  const root=document.querySelector('#preview-content');
  if(root)new MutationObserver(process).observe(root,{childList:true,subtree:true});
  window.TeActivityLayout = { config: ACTIVITY_LAYOUT, resolveActivityLayout };
  process();
})();

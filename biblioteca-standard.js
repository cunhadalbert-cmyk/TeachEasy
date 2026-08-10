(() => {
  const DOCX_CDN = 'https://cdn.jsdelivr.net/npm/docx@9.7.1/dist/index.iife.js';
  const CIRCLED = ['❶','❷','❸','❹','❺','❻','❼','❽','❾','❿'];
  let docxPromise = null;
  let currentBncc = '';

  function ensureDocx() {
    if (window.docx) return Promise.resolve(window.docx);
    if (docxPromise) return docxPromise;
    docxPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = DOCX_CDN;
      script.async = true;
      script.onload = () => window.docx ? resolve(window.docx) : reject(new Error('Biblioteca DOCX não carregou.'));
      script.onerror = () => reject(new Error('Não foi possível carregar o gerador Word.'));
      document.head.appendChild(script);
    });
    return docxPromise;
  }

  const clean = (value = '') => String(value).replace(/\s+/g, ' ').trim();
  const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  function selectedSubject(root) {
    const selected = document.querySelector('#library-filters select[name="subject"]')?.value;
    if (selected) return selected;
    const summary = clean(root.querySelector('.preview-summary')?.textContent || '');
    const known = ['Língua Portuguesa','Matemática','Ciências','História','Geografia','Inglês','Biologia','Física','Química','Arte'];
    const fromSummary = known.find(subject => summary.includes(subject));
    if (fromSummary) return fromSummary;
    const text = clean(root.textContent);
    const code = text.match(/\b(?:EF\d{2}|EM13)(LP|MA|CI|HI|GE|LI|CNT|CHS|LGG)\d{2,3}\b/i)?.[1]?.toUpperCase();
    return ({LP:'Língua Portuguesa',MA:'Matemática',CI:'Ciências',HI:'História',GE:'Geografia',LI:'Inglês',CNT:'Ciências',CHS:'Ciências Humanas',LGG:'Linguagens'})[code] || 'Atividade Escolar';
  }

  function activityTopic(root) {
    return clean(root.querySelector('.collection-student-page h1, .worksheet-page h1, #preview-title')?.textContent || 'Atividade');
  }

  function headerHtml() {
    return `<header class="te-library-standard-header">
      <div class="te-header-school"><strong>Escola:</strong> ________________________________________________________________</div>
      <div class="te-library-standard-row"><span><strong>Nome:</strong> __________________________________________</span><span><strong>Turma:</strong> __________</span><span><strong>Data:</strong> ____/____/______</span><span><strong>Prof.:</strong> ____________________</span></div>
    </header>`;
  }

  function installStyles() {
    if (document.querySelector('#te-library-standard-style')) return;
    const style = document.createElement('style');
    style.id = 'te-library-standard-style';
    style.textContent = `
      .te-library-standard-tools{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:10px 0 14px;padding:10px 12px;border:1px solid #cbd9e8;border-radius:12px;background:#f7fbff}
      .te-library-standard-tools label{display:flex;align-items:center;gap:6px;font-size:.9rem}
      .worksheet-page{box-sizing:border-box;background:#fff!important;color:#171717!important;width:210mm;max-width:100%;min-height:297mm;margin:0 auto 18px!important;padding:7mm 9mm!important;border:1.4px dashed #4d8b63!important;box-shadow:none!important;break-after:page;page-break-after:always;font-family:Arial,sans-serif!important}
      .te-library-standard-header{border:1.3px solid #333;padding:5px 7px;margin:0 0 3mm;font-size:10.2pt;line-height:1.25}
      .te-header-school{margin-bottom:4px}.te-library-standard-row{display:grid;grid-template-columns:minmax(0,1.8fr) auto auto auto;gap:9px;align-items:center}
      .worksheet-page>.student-fields{display:none!important}
      .te-activity-title{color:#245b9b!important;text-transform:uppercase;font-size:18.5pt!important;line-height:1.05!important;text-align:left!important;margin:0 0 1.5mm!important;font-weight:800!important}
      .te-activity-subtitle{color:#111!important;font-size:15.5pt!important;text-align:center!important;margin:0 0 3mm!important;font-weight:800!important}
      .collection-student-page>h1:not(.te-activity-title){display:none!important}
      .collection-instruction{clear:both;text-align:center;color:#111!important;font-weight:700!important;margin:2.5mm 0 3mm!important;font-size:10.7pt!important}
      .collection-instruction::before{content:'★ ';font-size:12pt}
      .support-text{border:1px solid #555!important;padding:3mm!important;border-radius:0!important;margin:0 0 3mm!important;font-size:10.5pt!important;line-height:1.25!important}
      .support-text h2{color:#3f7c55!important;font-size:11.3pt!important;margin:0 0 1.5mm!important}
      .support-text p{margin:0!important}
      .question-list{list-style:none!important;padding-left:0!important;margin:0!important;counter-reset:te-question}
      .question-list>li{position:relative;break-inside:avoid;page-break-inside:avoid;margin:0 0 2.2mm!important;padding-left:8mm!important;counter-increment:te-question;font-size:10.5pt!important}
      .question-list>li>.te-question-number{position:absolute;left:0;top:0;font-weight:800;color:#111;font-size:11.5pt}
      .question-list>li>p{margin:0 0 1mm!important;font-size:10.5pt!important;line-height:1.2!important}
      .question-alternatives{margin:1mm 0!important;font-size:10pt!important}
      .student-answer-space{margin-top:1mm!important;border:0!important;border-bottom:1px solid #555!important;min-height:5mm!important}
      .answer-space-medio{min-height:7mm!important}.answer-space-grande{min-height:10mm!important}
      .question-figure{display:block;max-width:48%!important;max-height:48mm!important;width:auto!important;height:auto!important;object-fit:contain!important;margin:1.5mm auto 2mm!important}
      .preview-illustration{max-width:48%;float:right;margin:2mm 0 3mm 4mm}
      .answer-key-page{break-before:page;page-break-before:always}
      .answer-key-page>h2:first-of-type{color:#245b9b!important;text-align:center!important;text-transform:uppercase;font-size:18pt!important}
      .te-library-bncc-answer{margin-top:4mm;padding:3mm;border-left:4px solid #3f7c55;background:#f3f8f4;font-size:10pt}
      .te-hide-answer-key .answer-key-page{display:none!important}.te-hide-bncc .te-library-bncc-answer{display:none!important}
      .preview-bncc{display:none!important}.collection-student-page-two.te-merged-page{display:none!important}
      @media(max-width:760px){.te-library-standard-row{grid-template-columns:1fr 1fr}.worksheet-page{width:100%;min-height:auto;padding:18px!important}}
      @media print{
        body *{visibility:hidden!important}.activity-preview,.activity-preview *{visibility:visible!important}.activity-preview{position:absolute!important;inset:0!important;width:100%!important;max-width:none!important;border:0!important;background:#fff!important}.preview-close,.te-library-standard-tools,.collection-export-actions,.figure-production-review{display:none!important}.worksheet-page{margin:0!important;border:1.2px dashed #4d8b63!important;padding:7mm 9mm!important;min-height:297mm!important;width:210mm!important;box-shadow:none!important}
      }
    `;
    document.head.appendChild(style);
  }

  function getRoot() { return document.querySelector('#preview-content'); }
  function getControls() { return document.querySelector('.te-library-standard-tools'); }
  function answerKeyEnabled() { return getControls()?.querySelector('[name="libraryAnswerKey"]')?.checked !== false; }
  function bnccEnabled() { return getControls()?.querySelector('[name="libraryBncc"]')?.checked !== false && answerKeyEnabled(); }

  function captureBncc(root) {
    const sources = [
      root.querySelector('.preview-bncc')?.textContent,
      ...[...root.querySelectorAll('.support-text')].map(node => node.textContent),
      ...[...document.querySelectorAll('.activity-features span')].map(node => node.textContent)
    ].filter(Boolean).map(clean);
    for (const source of sources) {
      const focus = source.match(/Foco BNCC:\s*(.+)$/i)?.[1];
      if (focus) { currentBncc = clean(focus); return; }
      if (/^BNCC\s/i.test(source)) { currentBncc = clean(source.replace(/^BNCC\s*:*/i,'')); return; }
      const code = source.match(/\b(EI0[123][A-Z]{2}\d{2}|EF\d{2}[A-Z]{2}\d{2}|EM13[A-Z]{3}\d{3}|EM13LP\d{2})\b/);
      if (code && !currentBncc) currentBncc = code[1];
    }
  }

  function sanitizeBnccFromStudent(root) {
    root.querySelectorAll('.worksheet-page:not(.answer-key-page) .support-text').forEach(support => {
      support.querySelectorAll('h1,h2,h3').forEach(title => {
        title.textContent = clean(title.textContent.replace(/\s*[—-]\s*(EI0[123][A-Z]{2}\d{2}|EF\d{2}[A-Z]{2}\d{2}|EM13[A-Z]{2,3}\d{2,3})\b.*$/i,''));
      });
      support.querySelectorAll('p').forEach(p => {
        p.textContent = clean(p.textContent.replace(/\s*Foco BNCC:\s*.*$/i,''));
      });
    });
    root.querySelectorAll('.worksheet-page:not(.answer-key-page) .preview-bncc').forEach(node => node.remove());
  }

  function ensureTools(root) {
    const shell = root.querySelector('.preview-shell');
    if (!shell || shell.querySelector('.te-library-standard-tools')) return;
    const tools = document.createElement('div');
    tools.className = 'te-library-standard-tools';
    tools.innerHTML = `<button class="btn btn-outline te-library-pdf" type="button">Baixar PDF / Imprimir</button><button class="btn btn-primary te-library-word" type="button">Baixar Word editável (.docx)</button><label><input name="libraryAnswerKey" type="checkbox" checked> Incluir gabarito</label><label><input name="libraryBncc" type="checkbox" checked> Incluir BNCC no gabarito</label>`;
    shell.insertBefore(tools, shell.firstChild);
  }

  function mergeCollectionStudentPages(root) {
    const first = root.querySelector('.collection-student-page:not(.collection-student-page-two)');
    const second = root.querySelector('.collection-student-page-two');
    if (!first || !second || second.classList.contains('te-merged-page')) return;
    const destination = first.querySelector('.collection-question-list');
    const source = second.querySelector('.collection-question-list');
    if (destination && source && destination.children.length + source.children.length <= 8) {
      [...source.children].forEach(child => destination.appendChild(child));
      second.classList.add('te-merged-page');
    }
  }

  function numberQuestions(root) {
    root.querySelectorAll('.worksheet-page:not(.answer-key-page) .question-list').forEach(list => {
      [...list.children].forEach((li, index) => {
        if (li.querySelector(':scope > .te-question-number')) return;
        const marker = document.createElement('span');
        marker.className = 'te-question-number';
        marker.textContent = CIRCLED[index] || `${index + 1}.`;
        li.prepend(marker);
      });
    });
  }

  function standardizePages(root) {
    mergeCollectionStudentPages(root);
    sanitizeBnccFromStudent(root);
    const subject = selectedSubject(root);
    const topic = activityTopic(root);
    const studentPages = [...root.querySelectorAll('.worksheet-page:not(.answer-key-page):not(.adapted-page)')].filter(page => !page.classList.contains('te-merged-page'));
    studentPages.forEach((page, pageIndex) => {
      if (!page.querySelector('.te-library-standard-header')) page.insertAdjacentHTML('afterbegin', headerHtml());
      if (pageIndex === 0 && !page.querySelector('.te-activity-title')) {
        const header = page.querySelector('.te-library-standard-header');
        header.insertAdjacentHTML('afterend', `<h1 class="te-activity-title">ATIVIDADE DE ${escapeHtml(subject.toUpperCase())}</h1><h2 class="te-activity-subtitle">${escapeHtml(topic)}</h2>`);
      }
    });
    numberQuestions(root);
    const answer = root.querySelector('.answer-key-page');
    if (answer) {
      let bncc = answer.querySelector('.te-library-bncc-answer');
      if (!bncc && currentBncc) {
        bncc = document.createElement('div');
        bncc.className = 'te-library-bncc-answer';
        bncc.innerHTML = `<strong>BNCC:</strong> ${escapeHtml(currentBncc.replace(/^BNCC\s*:*/i,''))}`;
        answer.appendChild(bncc);
      }
    }
    root.classList.toggle('te-hide-answer-key', !answerKeyEnabled());
    root.classList.toggle('te-hide-bncc', !bnccEnabled());
  }

  function normalize() {
    const root = getRoot();
    if (!root || !root.children.length) return;
    installStyles();
    captureBncc(root);
    ensureTools(root);
    standardizePages(root);
  }

  function paragraph(docx, text, options = {}) {
    const value = clean(text); if (!value) return null;
    return new docx.Paragraph({
      alignment: options.alignment,
      pageBreakBefore: options.pageBreakBefore || false,
      spacing: { before: options.before || 0, after: options.after ?? 70, line: options.line || 250 },
      children: [new docx.TextRun({ text: value, bold: options.bold || false, size: options.size || 19, color: options.color || '171717' })]
    });
  }

  function cell(docx, text, width, bold = false) {
    return new docx.TableCell({
      width:{size:width,type:docx.WidthType.PERCENTAGE},
      margins:{top:70,bottom:70,left:90,right:90},
      children:[paragraph(docx,text,{bold,size:18,after:0})]
    });
  }

  function headerTable(docx) {
    const borders={top:{style:docx.BorderStyle.SINGLE,size:8,color:'444444'},bottom:{style:docx.BorderStyle.SINGLE,size:8,color:'444444'},left:{style:docx.BorderStyle.SINGLE,size:8,color:'444444'},right:{style:docx.BorderStyle.SINGLE,size:8,color:'444444'},insideHorizontal:{style:docx.BorderStyle.NONE,size:0,color:'FFFFFF'},insideVertical:{style:docx.BorderStyle.NONE,size:0,color:'FFFFFF'}};
    return new docx.Table({width:{size:100,type:docx.WidthType.PERCENTAGE},borders,rows:[
      new docx.TableRow({children:[cell(docx,'Escola: ________________________________________________________________',100,true)]}),
      new docx.TableRow({children:[cell(docx,'Nome: __________________________________________',43,true),cell(docx,'Turma: __________',18,true),cell(docx,'Data: ____/____/______',22,true),cell(docx,'Prof.: ____________________',17,true)]})
    ]});
  }

  async function imageRun(docx, image, width = 270, height = 145) {
    if (!image?.src) return null;
    try {
      const response = await fetch(image.src); const buffer = await response.arrayBuffer();
      const mime = (response.headers.get('content-type') || image.src.match(/^data:([^;]+)/)?.[1] || '').toLowerCase();
      return new docx.ImageRun({data:new Uint8Array(buffer),type:mime.includes('jpeg') || mime.includes('jpg') ? 'jpg' : 'png',transformation:{width,height}});
    } catch { return null; }
  }

  function answerLineCount(li) {
    if (li.querySelector('.answer-space-grande')) return 2;
    if (li.querySelector('.answer-space-medio')) return 1;
    if (li.querySelector('.student-answer-space')) return 1;
    return li.querySelector('.question-alternatives') ? 0 : 1;
  }

  async function buildStudentDocument(docx, root) {
    const children=[headerTable(docx)];
    const subject=selectedSubject(root).toUpperCase();
    const topic=activityTopic(root);
    children.push(paragraph(docx,`ATIVIDADE DE ${subject}`,{bold:true,size:30,color:'245B9B',after:55}));
    children.push(paragraph(docx,topic,{bold:true,size:25,color:'111111',alignment:docx.AlignmentType.CENTER,after:100}));
    const page=root.querySelector('.worksheet-page:not(.answer-key-page):not(.adapted-page):not(.te-merged-page)');
    const support=page?.querySelector('.support-text');
    if(support) {
      const heading=clean(support.querySelector('h1,h2,h3')?.textContent || '');
      const body=clean([...support.querySelectorAll('p')].map(p=>p.textContent).join(' '));
      if(heading) children.push(paragraph(docx,heading,{bold:true,size:20,color:'3F7C55',after:45}));
      if(body) children.push(paragraph(docx,body,{size:19,after:90,line:245}));
    }
    const instruction=page?.querySelector('.collection-instruction');
    if(instruction) children.push(paragraph(docx,`★ ${instruction.textContent}`,{bold:true,size:19,alignment:docx.AlignmentType.CENTER,after:95}));
    const questions=[...root.querySelectorAll('.worksheet-page:not(.answer-key-page):not(.adapted-page) .question-list>li')];
    for(let index=0;index<questions.length;index++) {
      const li=questions[index];
      const prompt=clean(li.querySelector('p')?.textContent || li.textContent.replace(CIRCLED[index] || '',''));
      children.push(new docx.Paragraph({spacing:{before:45,after:35,line:245},children:[new docx.TextRun({text:`${CIRCLED[index] || `${index+1}.`}  `,bold:true,size:20}),new docx.TextRun({text:prompt,size:19})]}));
      const image=li.querySelector('img'); const run=await imageRun(docx,image); if(run) children.push(new docx.Paragraph({alignment:docx.AlignmentType.CENTER,spacing:{after:65},children:[run]}));
      const alternatives=[...li.querySelectorAll('.question-alternatives li')].map(n=>clean(n.textContent));
      alternatives.forEach((a,i)=>children.push(paragraph(docx,`${String.fromCharCode(97+i)}) ${a}`,{size:18,after:25})));
      for(let line=0;line<answerLineCount(li);line++) children.push(paragraph(docx,'________________________________________________________________________________________',{size:14,color:'555555',after:28}));
    }
    return children.filter(Boolean);
  }

  function buildAnswerDocument(docx, root) {
    const answer=root.querySelector('.answer-key-page'); if(!answer || !answerKeyEnabled()) return [];
    const out=[paragraph(docx,'GABARITO',{bold:true,size:30,color:'245B9B',alignment:docx.AlignmentType.CENTER,pageBreakBefore:true,after:65}),paragraph(docx,activityTopic(root),{bold:true,size:23,alignment:docx.AlignmentType.CENTER,after:100})];
    [...answer.querySelectorAll(':scope>ol>li')].forEach((li,index)=>out.push(paragraph(docx,`${index+1}. ${li.textContent}`,{size:18,after:65})));
    if(bnccEnabled() && currentBncc) out.push(paragraph(docx,`BNCC: ${currentBncc.replace(/^BNCC\s*:*/i,'')}`,{bold:true,color:'3F7C55',before:90,after:70}));
    return out.filter(Boolean);
  }

  async function exportWord() {
    normalize();
    const root=getRoot(); if(!root) return;
    const docx=await ensureDocx();
    const children=await buildStudentDocument(docx,root);
    children.push(...buildAnswerDocument(docx,root));
    const file=new docx.Document({
      styles:{default:{document:{run:{font:'Arial',size:19,color:'171717'},paragraph:{spacing:{line:250,after:70}}}}},
      sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:255,right:340,bottom:340,left:340,header:180,footer:180},pageBorders:{display:'allPages',offsetFrom:'page',zOrder:'front',top:{style:docx.BorderStyle.DASHED,size:7,color:'4D8B63',space:12},bottom:{style:docx.BorderStyle.DASHED,size:7,color:'4D8B63',space:12},left:{style:docx.BorderStyle.DASHED,size:7,color:'4D8B63',space:12},right:{style:docx.BorderStyle.DASHED,size:7,color:'4D8B63',space:12}}}},children}]
    });
    const blob=await docx.Packer.toBlob(file); const url=URL.createObjectURL(blob); const a=document.createElement('a');
    const slug=activityTopic(root).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,55);
    a.href=url; a.download=`atividade_${slug || 'teacheasy'}.docx`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  document.addEventListener('click', async event => {
    const pdf=event.target.closest('.te-library-pdf,.preview-print');
    if(pdf){event.preventDefault();event.stopImmediatePropagation();normalize();window.print();return;}
    const word=event.target.closest('.te-library-word,.preview-word');
    if(word){event.preventDefault();event.stopImmediatePropagation();const old=word.textContent;word.disabled=true;word.textContent='Preparando Word...';try{await exportWord();}catch(error){console.error(error);alert('Não foi possível gerar o Word agora.');}finally{word.disabled=false;word.textContent=old;}}
  }, true);
  document.addEventListener('change', event=>{if(event.target.matches('[name="libraryAnswerKey"],[name="libraryBncc"]')) normalize();});

  installStyles();
  const root=getRoot(); if(root) new MutationObserver(normalize).observe(root,{childList:true,subtree:true});
  normalize();
})();

(() => {
  const DOCX_CDN = 'https://cdn.jsdelivr.net/npm/docx@9.7.1/dist/index.iife.js';
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

  function clean(value = '') { return String(value).replace(/\s+/g, ' ').trim(); }
  function headerHtml() {
    return `<header class="te-library-standard-header">
      <div><strong>Escola:</strong> ________________________________________________________________</div>
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
      .worksheet-page{box-sizing:border-box;background:#fff!important;color:#1f2937!important;max-width:210mm;margin:0 auto 18px!important;padding:8mm!important;border:1px dashed #5c9b72!important;box-shadow:none!important;break-after:page;page-break-after:always}
      .te-library-standard-header{border:1.5px solid #1f5a96;padding:7px 9px;margin:0 0 8px;font-size:10pt;line-height:1.3}
      .te-library-standard-row{display:flex;gap:12px;justify-content:space-between;flex-wrap:wrap;margin-top:5px}
      .worksheet-page>.student-fields{display:none!important}
      .worksheet-page h1,.worksheet-page h2,.worksheet-page h3{color:#1f5a96!important}
      .worksheet-page h1{text-align:center;font-size:19pt!important;margin:5px 0 7px!important}
      .collection-instruction,.preview-summary{color:#3f7c55!important;font-weight:700}
      .support-text{border:1px solid #dbe7df;padding:8px 10px;border-radius:8px;margin-bottom:8px}
      .question-list>li{break-inside:avoid;page-break-inside:avoid;margin-bottom:7px}
      .question-figure{display:block;max-width:48%!important;max-height:58mm!important;width:auto!important;height:auto!important;object-fit:contain!important;margin:5px auto}
      .preview-illustration{max-width:48%;float:right;margin:4px 0 8px 12px}
      .answer-key-page{break-before:page;page-break-before:always}
      .te-library-bncc-answer{margin-top:10px;padding:8px 10px;border-left:4px solid #3f7c55;background:#f3f8f4}
      .te-hide-answer-key .answer-key-page{display:none!important}
      .te-hide-bncc .te-library-bncc-answer{display:none!important}
      .preview-bncc{display:none!important}
      @media print{
        body *{visibility:hidden!important}.activity-preview,.activity-preview *{visibility:visible!important}.activity-preview{position:absolute!important;inset:0!important;width:100%!important;max-width:none!important;border:0!important;background:#fff!important}.preview-close,.te-library-standard-tools,.collection-export-actions,.figure-production-review{display:none!important}.worksheet-page{margin:0!important;border:0!important;padding:8mm!important;min-height:281mm;box-shadow:none!important}
      }
    `;
    document.head.appendChild(style);
  }

  function getRoot() { return document.querySelector('#preview-content'); }
  function getControls() { return document.querySelector('.te-library-standard-tools'); }
  function answerKeyEnabled() { return getControls()?.querySelector('[name="libraryAnswerKey"]')?.checked !== false; }
  function bnccEnabled() { return getControls()?.querySelector('[name="libraryBncc"]')?.checked !== false && answerKeyEnabled(); }

  function captureBncc(root) {
    const old = root.querySelector('.preview-bncc');
    if (old) currentBncc = clean(old.textContent);
    if (!currentBncc) {
      const feature = [...document.querySelectorAll('.activity-features span')].find(node => /^BNCC\s/i.test(clean(node.textContent)));
      if (feature) currentBncc = clean(feature.textContent);
    }
  }

  function ensureTools(root) {
    const shell = root.querySelector('.preview-shell');
    if (!shell || shell.querySelector('.te-library-standard-tools')) return;
    const tools = document.createElement('div');
    tools.className = 'te-library-standard-tools';
    tools.innerHTML = `<button class="btn btn-outline te-library-pdf" type="button">Baixar PDF / Imprimir</button><button class="btn btn-primary te-library-word" type="button">Baixar Word editável</button><label><input name="libraryAnswerKey" type="checkbox" checked> Incluir gabarito</label><label><input name="libraryBncc" type="checkbox" checked> Incluir BNCC no gabarito</label>`;
    shell.insertBefore(tools, shell.firstChild);
  }

  function standardizePages(root) {
    root.querySelectorAll('.worksheet-page').forEach(page => {
      if (!page.querySelector('.te-library-standard-header') && !page.classList.contains('answer-key-page')) page.insertAdjacentHTML('afterbegin', headerHtml());
    });
    const answer = root.querySelector('.answer-key-page');
    if (answer) {
      let bncc = answer.querySelector('.te-library-bncc-answer');
      if (!bncc && currentBncc) {
        bncc = document.createElement('div');
        bncc.className = 'te-library-bncc-answer';
        bncc.innerHTML = `<strong>BNCC:</strong> ${currentBncc.replace(/^BNCC\s*/i, '')}`;
        answer.appendChild(bncc);
      }
    }
    root.classList.toggle('te-hide-answer-key', !answerKeyEnabled());
    root.classList.toggle('te-hide-bncc', !bnccEnabled());
  }

  function normalize() {
    const root = getRoot();
    if (!root || !root.children.length) return;
    installStyles(); captureBncc(root); ensureTools(root); standardizePages(root);
  }

  function textParagraph(docx, text, options = {}) {
    const value = clean(text); if (!value) return null;
    return new docx.Paragraph({alignment:options.alignment, pageBreakBefore:options.pageBreakBefore||false, spacing:{before:options.before||0,after:options.after??90,line:276}, children:[new docx.TextRun({text:value,bold:options.bold||false,size:options.size||20,color:options.color||'1F2937'})]});
  }

  async function imageRun(docx, image) {
    if (!image?.src) return null;
    try { const r=await fetch(image.src); const b=await r.arrayBuffer(); const mime=(r.headers.get('content-type')||'').toLowerCase(); return new docx.ImageRun({data:new Uint8Array(b),type:mime.includes('jpeg')?'jpg':'png',transformation:{width:300,height:170}}); } catch { return null; }
  }

  async function buildPage(docx, page, isAnswer = false) {
    const out=[];
    if (!isAnswer) {
      out.push(textParagraph(docx,'Escola: ________________________________________________________________',{bold:true,size:19,after:45}));
      out.push(textParagraph(docx,'Nome: ____________________________________   Turma: __________   Data: ____/____/______   Prof.: ____________________',{size:17,after:110}));
    }
    const title=page.querySelector('h1,h2,h3'); if(title) out.push(textParagraph(docx,title.textContent,{bold:true,size:30,color:'1F5A96',alignment:docx.AlignmentType.CENTER,after:120,pageBreakBefore:isAnswer}));
    const support=page.querySelector('.support-text'); if(support) out.push(textParagraph(docx,support.textContent,{size:20,after:110}));
    const instruction=page.querySelector('.collection-instruction'); if(instruction) out.push(textParagraph(docx,instruction.textContent,{bold:true,color:'3F7C55',after:100}));
    for (const li of page.querySelectorAll('.question-list>li')) {
      out.push(textParagraph(docx,li.querySelector('p')?.textContent||li.textContent,{size:20,after:60}));
      const img=li.querySelector('img'); const run=await imageRun(docx,img); if(run) out.push(new docx.Paragraph({alignment:docx.AlignmentType.CENTER,spacing:{after:90},children:[run]}));
      const alternatives=[...li.querySelectorAll('.question-alternatives li')].map(n=>n.textContent); alternatives.forEach((a,i)=>out.push(textParagraph(docx,`${String.fromCharCode(97+i)}) ${a}`,{size:18,after:30})));
      if(!isAnswer){out.push(textParagraph(docx,'________________________________________________________________________________',{size:15,color:'888888',after:35})); out.push(textParagraph(docx,'________________________________________________________________________________',{size:15,color:'888888',after:70}));}
    }
    if(isAnswer){
      for(const li of page.querySelectorAll(':scope>ol>li')) out.push(textParagraph(docx,li.textContent,{size:19,after:80}));
      if(bnccEnabled()&&currentBncc) out.push(textParagraph(docx,`BNCC: ${currentBncc.replace(/^BNCC\s*/i,'')}`,{bold:true,color:'3F7C55',before:100,after:80}));
    }
    return out.filter(Boolean);
  }

  async function exportWord() {
    const root=getRoot(); if(!root) return;
    const docx=await ensureDocx(); const children=[];
    const studentPages=[...root.querySelectorAll('.worksheet-page:not(.answer-key-page)')].filter(p=>!p.classList.contains('adapted-page'));
    for(let i=0;i<studentPages.length;i++){if(i>0) children.push(new docx.Paragraph({pageBreakBefore:true})); children.push(...await buildPage(docx,studentPages[i],false));}
    const answer=root.querySelector('.answer-key-page'); if(answer&&answerKeyEnabled()) children.push(...await buildPage(docx,answer,true));
    const file=new docx.Document({styles:{default:{document:{run:{font:'Arial',size:20,color:'1F2937'},paragraph:{spacing:{line:276,after:90}}}}},sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:454,right:454,bottom:567,left:454,header:240,footer:240}}},children}]});
    const blob=await docx.Packer.toBlob(file); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='atividade-teacheasy.docx'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  document.addEventListener('click', async event => {
    const pdf=event.target.closest('.te-library-pdf,.preview-print');
    if(pdf){event.preventDefault();event.stopImmediatePropagation();normalize();window.print();return;}
    const word=event.target.closest('.te-library-word,.preview-word');
    if(word){event.preventDefault();event.stopImmediatePropagation();const old=word.textContent;word.disabled=true;word.textContent='Preparando Word...';try{await exportWord();}catch(e){console.error(e);alert('Não foi possível gerar o Word agora.');}finally{word.disabled=false;word.textContent=old;}}
  }, true);
  document.addEventListener('change', event=>{if(event.target.matches('[name="libraryAnswerKey"],[name="libraryBncc"]')) normalize();});

  installStyles();
  const root=getRoot(); if(root) new MutationObserver(normalize).observe(root,{childList:true,subtree:true});
  normalize();
})();

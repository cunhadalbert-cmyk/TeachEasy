(() => {
  const DOCX_CDN = 'https://cdn.jsdelivr.net/npm/docx@9.7.1/dist/index.iife.js';
  let docxPromise = null;

  function ensureDocx() {
    if (window.docx) return Promise.resolve(window.docx);
    if (docxPromise) return docxPromise;

    docxPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = DOCX_CDN;
      script.async = true;
      script.onload = () => window.docx ? resolve(window.docx) : reject(new Error('Biblioteca DOCX não carregou.'));
      script.onerror = () => reject(new Error('Não foi possível carregar o gerador de Word.'));
      document.head.appendChild(script);
    });

    return docxPromise;
  }

  function cleanText(value = '') {
    return String(value).replace(/\s+/g, ' ').trim();
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function imageRunFromElement(docx, image, width = 360, height = 180) {
    if (!image?.src) return null;

    try {
      const response = await fetch(image.src);
      const buffer = await response.arrayBuffer();
      const mime = (response.headers.get('content-type') || image.src.match(/^data:([^;]+)/)?.[1] || '').toLowerCase();
      const type = mime.includes('jpeg') || mime.includes('jpg') ? 'jpg' : 'png';
      return new docx.ImageRun({
        data: new Uint8Array(buffer),
        type,
        transformation: { width, height }
      });
    } catch {
      return null;
    }
  }

  function paragraph(docx, text, options = {}) {
    if (!cleanText(text)) return null;
    return new docx.Paragraph({
      alignment: options.alignment,
      pageBreakBefore: options.pageBreakBefore || false,
      spacing: { before: options.before || 0, after: options.after ?? 100, line: options.line || 276 },
      children: [new docx.TextRun({
        text: cleanText(text),
        bold: options.bold || false,
        size: options.size || 20,
        color: options.color || '17251F'
      })]
    });
  }

  function titleParagraph(docx, text) {
    return paragraph(docx, text, { bold: true, size: 28, color: '541020', after: 140 });
  }

  function schoolHeaderParagraphs(docx) {
    return [
      paragraph(docx, 'ESCOLA: _________________________________________________', { bold: true, size: 20, after: 80 }),
      paragraph(docx, 'Nome: ____________________________    Turma: __________    Data: ____/____/______', { size: 18, after: 140 })
    ].filter(Boolean);
  }

  function questionParagraphs(docx, questions) {
    const output = [];
    questions.forEach((question, index) => {
      output.push(new docx.Paragraph({
        spacing: { before: 80, after: 80, line: 276 },
        children: [
          new docx.TextRun({ text: `${index + 1}. `, bold: true, size: 20 }),
          new docx.TextRun({ text: cleanText(question), size: 20 })
        ]
      }));
      output.push(paragraph(docx, '________________________________________________________________________________', { size: 16, color: '888888', after: 40 }));
      output.push(paragraph(docx, '________________________________________________________________________________', { size: 16, color: '888888', after: 80 }));
    });
    return output.filter(Boolean);
  }

  async function buildAiDocument(docx) {
    const root = document.querySelector('#ai-preview-document');
    if (!root) throw new Error('Prévia da atividade não encontrada.');

    const children = [...schoolHeaderParagraphs(docx)];
    const small = root.querySelector('.generated-material small');
    const title = root.querySelector('.generated-material h2');
    const materialParagraphs = [...root.querySelectorAll('.generated-material > p')];
    const bncc = root.querySelector('.generated-bncc');
    const figure = root.querySelector('.generated-illustration-image');
    const questions = [...root.querySelectorAll('.generated-questions li p')].map(node => node.textContent);
    const adapted = root.querySelector('.generated-adapted');
    const answerKey = root.querySelector('.generated-answer-key-page');

    if (small) children.push(paragraph(docx, small.textContent, { size: 17, color: '666666', after: 80 }));
    if (title) children.push(titleParagraph(docx, title.textContent));
    materialParagraphs.forEach(node => children.push(paragraph(docx, node.textContent, { after: 100 })));
    if (bncc) children.push(paragraph(docx, bncc.textContent, { bold: true, color: '541020', after: 120 }));

    const imageRun = await imageRunFromElement(docx, figure, 360, 200);
    if (imageRun) {
      children.push(new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, spacing: { after: 120 }, children: [imageRun] }));
    }

    children.push(...questionParagraphs(docx, questions));

    if (adapted) {
      children.push(paragraph(docx, adapted.querySelector('h3')?.textContent || 'Versão adaptada para inclusão', { bold: true, color: '541020', before: 120, after: 80 }));
      children.push(paragraph(docx, adapted.querySelector('p')?.textContent || '', { after: 120 }));
    }

    if (answerKey) {
      children.push(paragraph(docx, 'GABARITO', { bold: true, size: 28, color: '541020', pageBreakBefore: true, after: 140 }));
      children.push(paragraph(docx, answerKey.querySelector('p')?.textContent || answerKey.textContent, { after: 100 }));
    }

    return children.filter(Boolean);
  }

  async function buildPhotoDocument(docx) {
    const root = document.querySelector('#photo-preview-content');
    if (!root) throw new Error('Prévia da atividade por foto não encontrada.');

    const children = [...schoolHeaderParagraphs(docx)];
    const heading = root.querySelector('.photo-preview-heading');
    const title = heading?.querySelector('h3');
    const summary = heading?.querySelector('p');
    const grade = heading?.querySelector('span');
    const figure = root.querySelector('.photo-generated-figure img');
    const questions = [...root.querySelectorAll('.photo-question-list li')].map(node => node.textContent);
    const answerKey = root.querySelector('.photo-answer-key-page');
    const adapted = root.querySelector('.photo-adapted-note');

    if (grade) children.push(paragraph(docx, grade.textContent, { size: 17, color: '666666', after: 80 }));
    if (title) children.push(titleParagraph(docx, title.textContent));
    if (summary) children.push(paragraph(docx, summary.textContent, { after: 120 }));

    const imageRun = await imageRunFromElement(docx, figure, 360, 210);
    if (imageRun) {
      children.push(new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, spacing: { after: 120 }, children: [imageRun] }));
    }

    children.push(...questionParagraphs(docx, questions));

    if (adapted) {
      children.push(paragraph(docx, adapted.querySelector('strong')?.textContent || 'Versão adaptada', { bold: true, color: '541020', before: 120, after: 80 }));
      children.push(paragraph(docx, adapted.querySelector('span')?.textContent || '', { after: 120 }));
    }

    if (answerKey) {
      children.push(paragraph(docx, 'GABARITO', { bold: true, size: 28, color: '541020', pageBreakBefore: true, after: 140 }));
      children.push(paragraph(docx, answerKey.querySelector('p')?.textContent || answerKey.textContent, { after: 100 }));
    }

    return children.filter(Boolean);
  }

  async function exportDocx(kind) {
    const docx = await ensureDocx();
    const children = kind === 'photo' ? await buildPhotoDocument(docx) : await buildAiDocument(docx);

    const documentFile = new docx.Document({
      styles: {
        default: {
          document: {
            run: { font: 'Arial', size: 20, color: '17251F' },
            paragraph: { spacing: { line: 276, after: 100 } }
          }
        }
      },
      sections: [{
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 567, right: 567, bottom: 680, left: 567, header: 280, footer: 280 }
          }
        },
        children
      }]
    });

    const blob = await docx.Packer.toBlob(documentFile);
    downloadBlob(blob, kind === 'photo' ? 'atividade-teacheasy.docx' : 'material-escolar.docx');
  }

  document.addEventListener('click', async event => {
    const button = event.target.closest('#ai-download-word, #photo-download-word');
    if (!button) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Preparando Word...';

    try {
      await exportDocx(button.id === 'photo-download-word' ? 'photo' : 'ai');
    } catch (error) {
      console.error(error);
      window.alert('Não foi possível gerar o Word editável agora. Tente novamente.');
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  }, true);
})();

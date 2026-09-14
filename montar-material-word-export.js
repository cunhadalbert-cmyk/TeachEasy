(() => {
  const DOCX_CDN = 'https://cdn.jsdelivr.net/npm/docx@9.7.1/dist/index.iife.js';
  const printArea = document.querySelector('#print-area');
  const button = document.querySelector('#download-word');
  if (!printArea || !button) return;

  let docxPromise = null;

  function ensureDocx() {
    if (window.docx) return Promise.resolve(window.docx);
    if (docxPromise) return docxPromise;

    docxPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = DOCX_CDN;
      script.async = true;
      script.onload = () => window.docx
        ? resolve(window.docx)
        : reject(new Error('Biblioteca DOCX não carregou.'));
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

  function inputValue(selector) {
    return document.querySelector(selector)?.value?.trim() || '';
  }

  function textRun(docx, text, options = {}) {
    return new docx.TextRun({
      text,
      bold: Boolean(options.bold),
      size: options.size || 19,
      color: options.color || '202020',
      font: 'Arial',
      underline: options.underline
        ? { type: docx.UnderlineType.SINGLE, color: options.underlineColor || '555555' }
        : undefined
    });
  }

  function paragraph(docx, text, options = {}) {
    if (!cleanText(text)) return null;
    return new docx.Paragraph({
      alignment: options.alignment,
      pageBreakBefore: Boolean(options.pageBreakBefore),
      keepNext: Boolean(options.keepNext),
      keepLines: Boolean(options.keepLines),
      spacing: {
        before: options.before || 0,
        after: options.after ?? 55,
        line: options.line || 228
      },
      indent: options.indent,
      children: [textRun(docx, cleanText(text), options)]
    });
  }

  function noBorders(docx) {
    const none = { style: docx.BorderStyle.NONE, size: 0, color: 'FFFFFF' };
    return { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none };
  }

  function edgeBorders(docx, edges = {}) {
    const black = { style: docx.BorderStyle.SINGLE, size: 10, color: '000000' };
    const none = { style: docx.BorderStyle.NONE, size: 0, color: 'FFFFFF' };
    return {
      top: edges.top ? black : none,
      bottom: edges.bottom ? black : none,
      left: edges.left ? black : none,
      right: edges.right ? black : none,
      insideHorizontal: none,
      insideVertical: none
    };
  }

  function headerOuterBorders(docx) {
    const black = { style: docx.BorderStyle.SINGLE, size: 10, color: '000000' };
    const none = { style: docx.BorderStyle.NONE, size: 0, color: 'FFFFFF' };
    return {
      top: black,
      bottom: black,
      left: black,
      right: black,
      insideHorizontal: none,
      insideVertical: none
    };
  }

  function pageBorderOptions(docx) {
    const border = {
      style: docx.BorderStyle.SINGLE,
      size: 10,
      color: '000000',
      space: 18
    };

    return {
      pageBorderTop: { ...border },
      pageBorderRight: { ...border },
      pageBorderBottom: { ...border },
      pageBorderLeft: { ...border },
      pageBorders: {
        display: docx.PageBorderDisplay.ALL_PAGES,
        offsetFrom: docx.PageBorderOffsetFrom.PAGE,
        zOrder: docx.PageBorderZOrder.FRONT
      }
    };
  }

  function fieldLineText(value, slots) {
    const shown = cleanText(value);
    const missing = Math.max(3, slots - shown.length);
    const line = '_'.repeat(missing);
    return shown ? `${shown} ${line}` : '_'.repeat(slots);
  }

  function headerCell(docx, label, value, width, slots, edges = {}) {
    return new docx.TableCell({
      width: { size: width, type: docx.WidthType.DXA },
      borders: edgeBorders(docx, edges),
      verticalAlign: docx.VerticalAlign.CENTER,
      margins: { top: 85, bottom: 85, left: 110, right: 110 },
      children: [new docx.Paragraph({
        spacing: { before: 0, after: 0, line: 210 },
        children: [
          textRun(docx, `${label} `, { bold: true, size: 18, color: '111111' }),
          textRun(docx, fieldLineText(value, slots), { size: 18, color: '333333' })
        ]
      })]
    });
  }

  function compactHeader(docx) {
    const className = inputValue('#header-class');
    const date = inputValue('#header-date');
    const school = inputValue('#header-school');
    const teacher = inputValue('#header-teacher');

    return new docx.Table({
      width: { size: 10772, type: docx.WidthType.DXA },
      layout: docx.TableLayoutType.FIXED,
      borders: headerOuterBorders(docx),
      rows: [
        new docx.TableRow({
          cantSplit: true,
          children: [
            headerCell(docx, 'Nome:', '', 5925, 30, { top: true, left: true }),
            headerCell(docx, 'Turma:', className, 1850, 7, { top: true }),
            headerCell(docx, 'Data:', date, 2997, 13, { top: true, right: true })
          ]
        }),
        new docx.TableRow({
          cantSplit: true,
          children: [
            headerCell(docx, 'Escola:', school, 6250, 31, { bottom: true, left: true }),
            headerCell(docx, 'Prof.:', teacher, 4522, 23, { bottom: true, right: true })
          ]
        })
      ]
    });
  }

  async function naturalSize(image) {
    if (image?.naturalWidth && image?.naturalHeight) {
      return { width: image.naturalWidth, height: image.naturalHeight };
    }

    return new Promise(resolve => {
      const probe = new Image();
      probe.onload = () => resolve({ width: probe.naturalWidth || 1, height: probe.naturalHeight || 1 });
      probe.onerror = () => resolve({ width: 4, height: 3 });
      probe.src = image?.src || '';
    });
  }

  async function imageRun(docx, image, maxWidth, maxHeight) {
    if (!image?.src) return null;

    try {
      const response = await fetch(image.src);
      if (!response.ok) return null;
      const buffer = await response.arrayBuffer();
      const mime = (response.headers.get('content-type') || image.src.match(/^data:([^;]+)/)?.[1] || '').toLowerCase();
      const type = mime.includes('jpeg') || mime.includes('jpg') ? 'jpg' : 'png';
      const source = await naturalSize(image);
      const scale = Math.min(maxWidth / source.width, maxHeight / source.height, 1);
      const width = Math.max(48, Math.round(source.width * scale));
      const height = Math.max(36, Math.round(source.height * scale));

      return new docx.ImageRun({
        data: new Uint8Array(buffer),
        type,
        transformation: { width, height }
      });
    } catch {
      return null;
    }
  }

  async function supportContent(docx, block) {
    const support = block.querySelector('.source-support');
    if (!support) return [];

    const textContainer = support.querySelector('.source-support-text');
    const supportTitle = cleanText(textContainer?.querySelector('h4')?.textContent || '');
    const supportText = cleanText(textContainer?.querySelector('p')?.textContent || '');
    const image = support.querySelector('img');
    const imageContent = await imageRun(docx, image, 175, 115);

    const textChildren = [];
    if (supportTitle) {
      textChildren.push(paragraph(docx, supportTitle, { bold: true, size: 20, after: 45 }));
    }
    if (supportText) {
      textChildren.push(paragraph(docx, supportText, { size: 18, line: 220, after: 35 }));
    }

    if (!imageContent) return textChildren.filter(Boolean);

    return [new docx.Table({
      width: { size: 10400, type: docx.WidthType.DXA },
      borders: noBorders(docx),
      rows: [new docx.TableRow({
        cantSplit: true,
        children: [
          new docx.TableCell({
            width: { size: 7600, type: docx.WidthType.DXA },
            borders: noBorders(docx),
            margins: { top: 30, bottom: 30, left: 0, right: 120 },
            children: textChildren.filter(Boolean).length
              ? textChildren.filter(Boolean)
              : [new docx.Paragraph('')]
          }),
          new docx.TableCell({
            width: { size: 2800, type: docx.WidthType.DXA },
            borders: noBorders(docx),
            verticalAlign: docx.VerticalAlign.CENTER,
            margins: { top: 30, bottom: 30, left: 80, right: 0 },
            children: [new docx.Paragraph({
              alignment: docx.AlignmentType.CENTER,
              spacing: { before: 0, after: 0 },
              children: [imageContent]
            })]
          })
        ]
      })]
    })];
  }

  async function questionContent(docx, questionNode, finalNumber, seenImages) {
    const output = [];
    const questionText = cleanText(questionNode.querySelector(':scope > p')?.textContent || '');
    const alternatives = [...questionNode.querySelectorAll(':scope > .final-alternatives > li')]
      .map(node => cleanText(node.textContent))
      .filter(Boolean);
    const answerLineCount = questionNode.querySelectorAll(':scope > .answer-lines > span').length;

    output.push(new docx.Paragraph({
      keepNext: alternatives.length > 0 || answerLineCount > 0,
      keepLines: true,
      spacing: { before: 45, after: 35, line: 220 },
      children: [
        textRun(docx, `${finalNumber}. `, { bold: true, size: 19, color: '1F5A96' }),
        textRun(docx, questionText, { size: 19 })
      ]
    }));

    alternatives.forEach((alternative, index) => {
      output.push(new docx.Paragraph({
        spacing: { before: 0, after: 24, line: 210 },
        indent: { left: 360 },
        children: [textRun(docx, `${String.fromCharCode(97 + index)}) ${alternative}`, { size: 18 })]
      }));
    });

    const questionImage = questionNode.querySelector(':scope > .question-image');
    const imageKey = questionImage?.src || '';
    if (questionImage && imageKey && !seenImages.has(imageKey)) {
      seenImages.add(imageKey);
      const run = await imageRun(docx, questionImage, 135, 90);
      if (run) {
        output.push(new docx.Paragraph({
          alignment: docx.AlignmentType.CENTER,
          spacing: { before: 15, after: 35 },
          children: [run]
        }));
      }
    }

    for (let i = 0; i < answerLineCount; i += 1) {
      output.push(new docx.Paragraph({
        spacing: { before: 0, after: 22, line: 190 },
        children: [textRun(docx, '________________________________________________________________________________', { size: 13, color: '8A8A8A' })]
      }));
    }

    return output;
  }

  async function studentDocumentContent(docx, studentPage) {
    const children = [compactHeader(docx)];
    children.push(new docx.Paragraph({ spacing: { after: 65 }, children: [] }));

    const title = cleanText(studentPage.querySelector('.worksheet-title')?.textContent || 'ATIVIDADE');
    children.push(paragraph(docx, title, {
      bold: true,
      size: 26,
      color: '1F5A96',
      alignment: docx.AlignmentType.CENTER,
      after: 45
    }));

    const subtitle = cleanText(studentPage.querySelector('.worksheet-subtitle')?.textContent || '');
    if (subtitle) {
      children.push(paragraph(docx, subtitle, {
        bold: true,
        size: 20,
        alignment: docx.AlignmentType.CENTER,
        after: 70
      }));
    }

    let finalNumber = 0;
    for (const block of studentPage.querySelectorAll('.source-block')) {
      const blockTitle = cleanText(block.querySelector(':scope > h3')?.textContent || '');
      if (blockTitle) {
        children.push(paragraph(docx, blockTitle, {
          bold: true,
          size: 21,
          alignment: docx.AlignmentType.CENTER,
          before: 35,
          after: 45,
          keepNext: true
        }));
      }

      const mainImage = block.querySelector('.source-support img');
      const seenImages = new Set(mainImage?.src ? [mainImage.src] : []);
      children.push(...await supportContent(docx, block));

      for (const questionNode of block.querySelectorAll('.final-questions > li')) {
        finalNumber += 1;
        children.push(...await questionContent(docx, questionNode, finalNumber, seenImages));
      }
    }

    return children.filter(Boolean);
  }

  function answerKeyContent(docx, answerPage) {
    const children = [];
    children.push(paragraph(docx, 'GABARITO', {
      bold: true,
      size: 26,
      color: '1F5A96',
      alignment: docx.AlignmentType.CENTER,
      pageBreakBefore: true,
      after: 90
    }));

    let finalNumber = 0;
    answerPage.querySelectorAll('.answer-key-group').forEach(group => {
      const heading = cleanText(group.querySelector('h3')?.textContent || '');
      if (heading) {
        children.push(paragraph(docx, heading, { bold: true, size: 20, before: 45, after: 35, keepNext: true }));
      }

      group.querySelectorAll('.answer-key-list > li').forEach(item => {
        finalNumber += 1;
        const answer = cleanText(item.querySelector('strong')?.textContent || '');
        const justification = cleanText(item.querySelector('div')?.textContent || '');
        children.push(new docx.Paragraph({
          spacing: { before: 25, after: 30, line: 215 },
          children: [
            textRun(docx, `${finalNumber}. `, { bold: true, size: 18, color: '1F5A96' }),
            textRun(docx, answer, { bold: true, size: 18 })
          ]
        }));
        if (justification) {
          children.push(paragraph(docx, justification, { size: 16, color: '555555', after: 35, indent: { left: 260 } }));
        }
      });
    });

    const bnccBox = answerPage.querySelector('.bncc-box');
    if (bnccBox) {
      children.push(paragraph(docx, 'BNCC', { bold: true, size: 20, before: 90, after: 45 }));
      [...bnccBox.querySelectorAll('p')].forEach(item => {
        children.push(paragraph(docx, item.textContent, { size: 16, line: 205, after: 30 }));
      });
    }

    return children.filter(Boolean);
  }

  async function exportBuilderDocx() {
    const studentPage = printArea.querySelector('.student-page');
    const answerPage = printArea.querySelector('.answer-key-page');
    if (!studentPage) throw new Error('Monte pelo menos uma questão antes de baixar o Word.');

    const docx = await ensureDocx();
    const children = await studentDocumentContent(docx, studentPage);
    if (answerPage) children.push(...answerKeyContent(docx, answerPage));

    const documentFile = new docx.Document({
      styles: {
        default: {
          document: {
            run: { font: 'Arial', size: 19, color: '202020' },
            paragraph: { spacing: { line: 220, after: 45 } }
          }
        }
      },
      sections: [{
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 567, right: 567, bottom: 567, left: 567, header: 260, footer: 260 },
            borders: pageBorderOptions(docx)
          }
        },
        children
      }]
    });

    const blob = await docx.Packer.toBlob(documentFile);
    downloadBlob(blob, 'teacheasy-material.docx');
  }

  button.textContent = 'Baixar Word (.docx)';

  document.addEventListener('click', async event => {
    const clicked = event.target.closest('#download-word');
    if (!clicked) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const originalText = clicked.textContent;
    clicked.disabled = true;
    clicked.textContent = 'Preparando Word...';

    try {
      await exportBuilderDocx();
    } catch (error) {
      console.error(error);
      window.alert(error?.message || 'Não foi possível gerar o Word agora.');
    } finally {
      clicked.disabled = false;
      clicked.textContent = originalText;
    }
  }, true);
})();
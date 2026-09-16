(() => {
  const printArea = document.querySelector('#print-area');
  if (!printArea) return;

  const originalQuestionHtml = new WeakMap();
  const originalAnswerHtml = new WeakMap();
  let scheduled = false;

  const STOPWORDS = new Set([
    'a','o','as','os','um','uma','uns','umas','de','da','do','das','dos','e','em','na','no','nas','nos',
    'para','por','com','que','qual','quais','quem','onde','quando','como','porque','se','ao','aos','à','às',
    'sua','seu','suas','seus','essa','esse','esta','este','isso','isto','foi','são','ser','ter','tem','mais',
    'texto','resposta','atividade','aluno','alunos','turma'
  ]);

  const escapeHtml = value => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const cleanText = value => String(value ?? '').replace(/\s+/g, ' ').trim();

  function normalizeWord(value) {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Za-zÀ-ÿ]/g, '')
      .toUpperCase();
  }

  function isGenericAnswer(value) {
    const text = cleanText(value).toLocaleLowerCase('pt-BR');
    return !text || text.startsWith('resposta pessoal') || text.includes('aceitar respostas') || text.length > 125;
  }

  function answerCore(answerNode) {
    return cleanText(answerNode?.querySelector('strong')?.textContent || '');
  }

  function sourceSentences(block) {
    const text = cleanText(block.querySelector('.source-support-text p')?.textContent || '');
    if (!text) return [];
    return text
      .split(/(?<=[.!?])\s+/)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length >= 18);
  }

  function subjectForGroup(index) {
    const group = document.querySelectorAll('.material-source-group')[index];
    const text = cleanText(group?.querySelector('header span')?.textContent || '');
    return text.split('·')[0].trim();
  }

  function isPortuguese(subject) {
    const value = subject.toLocaleLowerCase('pt-BR');
    return value.includes('língua portuguesa') || value.includes('lingua portuguesa') || value === 'português' || value === 'portugues';
  }

  function storeOriginal(questionNode, answerNode) {
    if (!originalQuestionHtml.has(questionNode)) originalQuestionHtml.set(questionNode, questionNode.innerHTML);
    if (answerNode && !originalAnswerHtml.has(answerNode)) originalAnswerHtml.set(answerNode, answerNode.innerHTML);
  }

  function restoreNode(questionNode, answerNode) {
    if (originalQuestionHtml.has(questionNode)) questionNode.innerHTML = originalQuestionHtml.get(questionNode);
    if (answerNode && originalAnswerHtml.has(answerNode)) answerNode.innerHTML = originalAnswerHtml.get(answerNode);
  }

  function originalQuestionText(questionNode) {
    const holder = document.createElement('div');
    holder.innerHTML = originalQuestionHtml.get(questionNode) || questionNode.innerHTML;
    return cleanText(holder.querySelector(':scope > p')?.textContent || holder.textContent || '');
  }

  function originalQuestionImage(questionNode) {
    const holder = document.createElement('div');
    holder.innerHTML = originalQuestionHtml.get(questionNode) || questionNode.innerHTML;
    return holder.querySelector(':scope > .question-image')?.cloneNode(true) || null;
  }

  function setQuestion(questionNode, typeLabel, text, bodyNode) {
    const oldImage = originalQuestionImage(questionNode);
    questionNode.innerHTML = '';

    const paragraph = document.createElement('p');
    paragraph.innerHTML = `<span class="interactive-type-badge">${escapeHtml(typeLabel)}</span> ${escapeHtml(text)}`;
    questionNode.append(paragraph);

    if (oldImage) questionNode.append(oldImage);
    if (bodyNode) questionNode.append(bodyNode);
  }

  function setAnswer(answerNode, answer, explanation) {
    if (!answerNode) return;
    answerNode.innerHTML = `<strong>${escapeHtml(answer)}</strong>${explanation ? `<div>${escapeHtml(explanation)}</div>` : ''}`;
  }

  function alternativesNode(items) {
    const list = document.createElement('ol');
    list.className = 'final-alternatives interactive-generated';
    list.type = 'a';
    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      list.append(li);
    });
    return list;
  }

  function answerLineNode() {
    const lines = document.createElement('div');
    lines.className = 'answer-lines interactive-generated';
    lines.setAttribute('aria-label', '1 linha para resposta');
    lines.append(document.createElement('span'));
    return lines;
  }

  function deterministicAlternatives(correct, answerNodes, currentIndex) {
    if (isGenericAnswer(correct)) return null;

    const candidates = answerNodes
      .map(answerCore)
      .filter((value, index) => index !== currentIndex && !isGenericAnswer(value) && value !== correct)
      .filter((value, index, all) => all.indexOf(value) === index)
      .sort((a, b) => Math.abs(a.length - correct.length) - Math.abs(b.length - correct.length));

    if (candidates.length < 3) return null;

    const chosen = candidates.slice(0, 3);
    const position = currentIndex % 4;
    const options = [...chosen];
    options.splice(position, 0, correct);
    return { options, correctIndex: position };
  }

  function applyMultipleChoice(questionNode, answerNode, answerNodes, currentIndex) {
    const originalText = originalQuestionText(questionNode);
    const correct = answerCore(answerNode);
    const variant = deterministicAlternatives(correct, answerNodes, currentIndex);
    if (!variant) return false;

    setQuestion(questionNode, 'MÚLTIPLA ESCOLHA', originalText, alternativesNode(variant.options));
    setAnswer(
      answerNode,
      `${String.fromCharCode(65 + variant.correctIndex)}) ${correct}`,
      'Alternativa correta derivada do gabarito original da atividade.'
    );
    return true;
  }

  function applyTrueFalse(questionNode, answerNode, sentences, currentIndex) {
    if (!sentences.length) return false;
    const sentence = sentences[currentIndex % sentences.length].replace(/[.!?]+$/, '');
    const makeFalse = currentIndex % 4 === 1;
    const statement = makeFalse
      ? `Não é verdade que ${sentence.charAt(0).toLocaleLowerCase('pt-BR')}${sentence.slice(1)}.`
      : `${sentence}.`;

    setQuestion(
      questionNode,
      'VERDADEIRO OU FALSO',
      `Leia a afirmação e marque a opção correta: “${statement}”`,
      alternativesNode(['Verdadeiro', 'Falso'])
    );
    setAnswer(
      answerNode,
      makeFalse ? 'Falso' : 'Verdadeiro',
      'A afirmação foi construída somente a partir do texto de apoio; quando negada, a alternativa correta é Falso.'
    );
    return true;
  }

  function meaningfulTokens(value) {
    return cleanText(value)
      .split(/[^A-Za-zÀ-ÿ0-9-]+/)
      .map(token => token.replace(/^-+|-+$/g, ''))
      .filter(token => token.length >= 4 && !STOPWORDS.has(token.toLocaleLowerCase('pt-BR')));
  }

  function findFillWord(answer, sentence) {
    const sentenceLower = sentence.toLocaleLowerCase('pt-BR');
    const fromAnswer = meaningfulTokens(answer)
      .filter(token => sentenceLower.includes(token.toLocaleLowerCase('pt-BR')))
      .sort((a, b) => b.length - a.length)[0];
    if (fromAnswer) return fromAnswer;

    return meaningfulTokens(sentence)
      .filter(token => token.length >= 5)
      .sort((a, b) => b.length - a.length)[0] || null;
  }

  function applyFillBlank(questionNode, answerNode, sentences, currentIndex) {
    if (!sentences.length) return false;
    const originalAnswer = answerCore(answerNode);
    const sentence = sentences[currentIndex % sentences.length];
    const word = findFillWord(originalAnswer, sentence);
    if (!word) return false;

    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const blank = sentence.replace(new RegExp(`\\b${escapedWord}\\b`, 'i'), '________________');
    if (blank === sentence) return false;

    setQuestion(
      questionNode,
      'COMPLETE A LACUNA',
      `Complete usando uma palavra do texto de apoio: “${blank}”`,
      answerLineNode()
    );
    setAnswer(answerNode, word, 'A palavra retirada aparece literalmente no texto de apoio.');
    return true;
  }

  function keywordForAnswer(answer, supportText) {
    const supportLower = supportText.toLocaleLowerCase('pt-BR');
    return meaningfulTokens(answer)
      .map(token => ({ original: token, normalized: normalizeWord(token) }))
      .filter(item => item.normalized.length >= 4 && item.normalized.length <= 13)
      .filter(item => supportLower.includes(item.original.toLocaleLowerCase('pt-BR')))
      .sort((a, b) => b.normalized.length - a.normalized.length)[0] || null;
  }

  function canPlace(grid, word, row, col, dir) {
    const size = grid.length;
    const dr = dir === 'v' ? 1 : 0;
    const dc = dir === 'h' ? 1 : 0;
    const endRow = row + dr * (word.length - 1);
    const endCol = col + dc * (word.length - 1);
    if (row < 0 || col < 0 || endRow >= size || endCol >= size) return false;

    let crosses = 0;
    for (let i = 0; i < word.length; i += 1) {
      const r = row + dr * i;
      const c = col + dc * i;
      const existing = grid[r][c];
      if (existing && existing !== word[i]) return false;
      if (existing === word[i]) crosses += 1;
    }
    return crosses > 0;
  }

  function placeWord(grid, word, row, col, dir) {
    const dr = dir === 'v' ? 1 : 0;
    const dc = dir === 'h' ? 1 : 0;
    for (let i = 0; i < word.length; i += 1) {
      grid[row + dr * i][col + dc * i] = word[i];
    }
  }

  function buildCrossword(entries) {
    const size = 23;
    const grid = Array.from({ length: size }, () => Array(size).fill(''));
    const placed = [];
    const first = entries[0];
    const firstRow = Math.floor(size / 2);
    const firstCol = Math.max(1, Math.floor((size - first.word.length) / 2));
    placeWord(grid, first.word, firstRow, firstCol, 'h');
    placed.push({ ...first, row: firstRow, col: firstCol, dir: 'h' });

    for (const entry of entries.slice(1)) {
      let best = null;
      for (let wi = 0; wi < entry.word.length; wi += 1) {
        const letter = entry.word[wi];
        for (let r = 0; r < size; r += 1) {
          for (let c = 0; c < size; c += 1) {
            if (grid[r][c] !== letter) continue;
            for (const dir of ['v', 'h']) {
              const row = r - (dir === 'v' ? wi : 0);
              const col = c - (dir === 'h' ? wi : 0);
              if (canPlace(grid, entry.word, row, col, dir)) {
                best = { row, col, dir };
                break;
              }
            }
            if (best) break;
          }
          if (best) break;
        }
        if (best) break;
      }
      if (!best) continue;
      placeWord(grid, entry.word, best.row, best.col, best.dir);
      placed.push({ ...entry, ...best });
    }

    if (placed.length < 4) return null;

    placed.sort((a, b) => a.row - b.row || a.col - b.col || a.dir.localeCompare(b.dir));
    placed.forEach((entry, index) => { entry.number = index + 1; });

    const used = [];
    placed.forEach(entry => {
      for (let i = 0; i < entry.word.length; i += 1) {
        used.push({
          row: entry.row + (entry.dir === 'v' ? i : 0),
          col: entry.col + (entry.dir === 'h' ? i : 0)
        });
      }
    });
    const minRow = Math.max(0, Math.min(...used.map(cell => cell.row)) - 1);
    const maxRow = Math.min(size - 1, Math.max(...used.map(cell => cell.row)) + 1);
    const minCol = Math.max(0, Math.min(...used.map(cell => cell.col)) - 1);
    const maxCol = Math.min(size - 1, Math.max(...used.map(cell => cell.col)) + 1);

    return { grid, placed, minRow, maxRow, minCol, maxCol };
  }

  function crosswordImage(puzzle) {
    const cell = 32;
    const rows = puzzle.maxRow - puzzle.minRow + 1;
    const cols = puzzle.maxCol - puzzle.minCol + 1;
    const canvas = document.createElement('canvas');
    canvas.width = cols * cell;
    canvas.height = rows * cell;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const starts = new Map();
    puzzle.placed.forEach(entry => starts.set(`${entry.row}:${entry.col}`, entry.number));

    for (let r = puzzle.minRow; r <= puzzle.maxRow; r += 1) {
      for (let c = puzzle.minCol; c <= puzzle.maxCol; c += 1) {
        if (!puzzle.grid[r][c]) continue;
        const x = (c - puzzle.minCol) * cell;
        const y = (r - puzzle.minRow) * cell;
        ctx.fillStyle = '#fff';
        ctx.fillRect(x, y, cell, cell);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + .5, y + .5, cell - 1, cell - 1);
        const number = starts.get(`${r}:${c}`);
        if (number) {
          ctx.fillStyle = '#111';
          ctx.font = '10px Arial';
          ctx.fillText(String(number), x + 3, y + 10);
        }
      }
    }
    return canvas.toDataURL('image/png');
  }

  function applyCrossword(questionNode, answerNode, questionNodes, answerNodes, supportText) {
    if (!supportText) return false;
    const entries = [];
    const seen = new Set();

    answerNodes.forEach((node, index) => {
      const keyword = keywordForAnswer(answerCore(node), supportText);
      if (!keyword || seen.has(keyword.normalized)) return;
      seen.add(keyword.normalized);
      entries.push({
        word: keyword.normalized,
        display: keyword.original,
        clue: originalQuestionText(questionNodes[index])
      });
    });

    const puzzle = buildCrossword(entries.slice(0, 7));
    if (!puzzle) return false;

    const clueText = puzzle.placed
      .map(entry => `${entry.number}) ${entry.clue}`)
      .join('  ');
    setQuestion(
      questionNode,
      'CRUZADINHA',
      `Complete a cruzadinha com palavras do texto e do gabarito. Escreva sem acentos. ${clueText}`,
      null
    );

    const image = document.createElement('img');
    image.className = 'question-image interactive-crossword-image';
    image.src = crosswordImage(puzzle);
    image.alt = 'Grade de cruzadinha com casas numeradas e vazias.';
    questionNode.append(image);

    const answers = puzzle.placed.map(entry => `${entry.number}) ${entry.display}`).join(' · ');
    setAnswer(answerNode, answers, 'Solução da cruzadinha. Na grade, as palavras são escritas sem acentos.');
    return true;
  }

  function applyOpen(questionNode, answerNode) {
    restoreNode(questionNode, answerNode);
    const p = questionNode.querySelector(':scope > p');
    if (p && !p.querySelector('.interactive-type-badge')) {
      const label = document.createElement('span');
      label.className = 'interactive-type-badge';
      label.textContent = 'QUESTÃO ABERTA';
      p.prepend(label, document.createTextNode(' '));
    }
  }

  function applyPortugueseGroup(block, answerGroup, groupIndex) {
    const questionNodes = [...block.querySelectorAll('.final-questions > li')];
    const answerNodes = [...answerGroup?.querySelectorAll('.answer-key-list > li') || []];
    if (!questionNodes.length || questionNodes.length !== answerNodes.length) return;

    questionNodes.forEach((questionNode, index) => storeOriginal(questionNode, answerNodes[index]));
    const sentences = sourceSentences(block);
    const supportText = cleanText(block.querySelector('.source-support-text p')?.textContent || '');

    questionNodes.forEach((questionNode, index) => {
      const answerNode = answerNodes[index];
      restoreNode(questionNode, answerNode);

      const slot = index % 8;
      if (slot === 0 || slot === 4) {
        if (applyMultipleChoice(questionNode, answerNode, answerNodes, index)) return;
        applyTrueFalse(questionNode, answerNode, sentences, index);
        return;
      }
      if (slot === 1 || slot === 5) {
        if (applyTrueFalse(questionNode, answerNode, sentences, index)) return;
        applyFillBlank(questionNode, answerNode, sentences, index);
        return;
      }
      if (slot === 2) {
        if (applyFillBlank(questionNode, answerNode, sentences, index)) return;
        applyOpen(questionNode, answerNode);
        return;
      }
      if (slot === 7) {
        if (applyCrossword(questionNode, answerNode, questionNodes, answerNodes, supportText)) return;
        if (applyFillBlank(questionNode, answerNode, sentences, index)) return;
      }
      applyOpen(questionNode, answerNode);
    });

    block.dataset.interactiveQuestionTypes = 'portugues-v1';
    if (answerGroup) answerGroup.dataset.interactiveQuestionTypes = 'portugues-v1';
    block.dataset.materialGroupIndex = String(groupIndex);
  }

  function restoreAll() {
    const questionNodes = [...printArea.querySelectorAll('.final-questions > li')];
    const answerNodes = [...printArea.querySelectorAll('.answer-key-list > li')];
    questionNodes.forEach((node, index) => restoreNode(node, answerNodes[index]));
    printArea.querySelectorAll('[data-interactive-question-types]').forEach(node => {
      delete node.dataset.interactiveQuestionTypes;
    });
  }

  function apply() {
    scheduled = false;
    const layout = globalThis.TeachEasyMaterialLayout?.current?.() || printArea.dataset.layout || 'classic';
    if (layout !== 'interactive') {
      restoreAll();
      return;
    }

    const blocks = [...printArea.querySelectorAll('.student-page .source-block')];
    const answerGroups = [...printArea.querySelectorAll('.answer-key-page .answer-key-group')];
    blocks.forEach((block, index) => {
      const subject = subjectForGroup(index);
      if (!isPortuguese(subject)) return;
      applyPortugueseGroup(block, answerGroups[index], index);
    });
  }

  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(apply);
  }

  const observer = new MutationObserver(scheduleApply);
  observer.observe(printArea, { childList: true, attributes: true, attributeFilter: ['data-layout'] });

  document.querySelectorAll('input[name="material-layout"]').forEach(radio => {
    radio.addEventListener('change', scheduleApply);
  });

  const interactiveDescription = document.querySelector('[data-layout-option="interactive"] small');
  if (interactiveDescription) {
    interactiveDescription.textContent = 'Varia a apresentação com múltipla escolha, verdadeiro ou falso, lacunas, questões abertas e cruzadinha quando o conteúdo permite.';
  }

  const style = document.createElement('style');
  style.textContent = `
    .interactive-type-badge {
      display: inline-block;
      margin: 0 1.5mm 1mm 0;
      padding: .7mm 1.7mm;
      border: .25mm solid #c9a6b1;
      border-radius: 99px;
      color: #6b1830;
      background: #fff7f9;
      font-size: 7.5pt;
      font-weight: 700;
      letter-spacing: .02em;
      vertical-align: middle;
    }
    .a4-page[data-layout="interactive"] .interactive-crossword-image {
      max-width: 105mm;
      max-height: 70mm;
      image-rendering: auto;
    }
    .a4-page[data-layout="interactive"] .final-alternatives.interactive-generated {
      margin-top: 1.5mm;
    }
  `;
  document.head.append(style);

  scheduleApply();
})();

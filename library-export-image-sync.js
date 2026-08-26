(() => {
  'use strict';

  const MAX_SELECTION = 10;
  const SELECTION_KEY = 'te-illustration-title-batch-selection-v1';
  const DB_NAME = 'TeachEasyIllustrationsByNormalizedTitleV1';
  const DB_VERSION = 1;
  const STORE_NAME = 'imagesByNormalizedTitleV1';
  const MAX_ZIP_IMAGES = 100;
  const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp']);
  const PREPARED_BATCH_KEY = 'te-illustration-prepared-batch-v1';
  const VISUAL_SIGNATURES_KEY = 'te-illustration-visual-signatures-v1';
  const VISUAL_BRIEF_VERSION = 1;

  const clean = value => String(value || '').replace(/\s+/g, ' ').trim();

  function normalizeTitle(value = '') {
    return clean(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function normalizedFileName(fileName = '') {
    return normalizeTitle(String(fileName).replace(/\.[^.]+$/, ''));
  }

  function readSelection() {
    try {
      const value = JSON.parse(localStorage.getItem(SELECTION_KEY) || '[]');
      return Array.isArray(value)
        ? value.filter(item => item?.normalizedTitle && item?.topic).slice(0, MAX_SELECTION)
        : [];
    } catch {
      return [];
    }
  }

  function writeSelection(items) {
    localStorage.setItem(SELECTION_KEY, JSON.stringify(items.slice(0, MAX_SELECTION)));
  }

  function readJsonStorage(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function readPreparedBatch() {
    const value = readJsonStorage(PREPARED_BATCH_KEY, null);
    return value?.version === VISUAL_BRIEF_VERSION && Array.isArray(value.activities) ? value : null;
  }

  function writePreparedBatch(value) {
    if (value) localStorage.setItem(PREPARED_BATCH_KEY, JSON.stringify(value));
    else localStorage.removeItem(PREPARED_BATCH_KEY);
  }

  function readVisualSignatures() {
    const value = readJsonStorage(VISUAL_SIGNATURES_KEY, {});
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  }

  function writeVisualSignatures(value) {
    localStorage.setItem(VISUAL_SIGNATURES_KEY, JSON.stringify(value));
  }

  function activityData(shell) {
    const student = shell?.querySelector('.te-final-student');
    const heading = clean(student?.querySelector('.te-final-title')?.textContent || 'ATIVIDADE ESCOLAR');
    const subject = heading.replace(/^ATIVIDADE DE\s+/i, '') || 'Atividade Escolar';
    const topic = clean(student?.querySelector('.te-final-subtitle')?.textContent || '');
    return { subject, topic, normalizedTitle: normalizeTitle(topic) };
  }

  function selectionItem(shell) {
    const data = activityData(shell);
    return {
      normalizedTitle: data.normalizedTitle,
      topic: data.topic,
      subject: data.subject
    };
  }

  function isSelected(shell) {
    const key = activityData(shell).normalizedTitle;
    return readSelection().some(item => item.normalizedTitle === key);
  }

  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, { keyPath: 'normalizedTitle' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function saveImage(normalizedTitle, topic, url) {
    if (!normalizedTitle || !url) return false;
    const database = await openDatabase();
    try {
      await new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, 'readwrite');
        transaction.objectStore(STORE_NAME).put({
          normalizedTitle,
          topic,
          url,
          updatedAt: Date.now()
        });
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
      });
      return true;
    } finally {
      database.close();
    }
  }

  async function loadImage(normalizedTitle) {
    if (!normalizedTitle) return '';
    const database = await openDatabase();
    try {
      return await new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, 'readonly');
        const request = transaction.objectStore(STORE_NAME).get(normalizedTitle);
        request.onsuccess = () => resolve(request.result?.url || '');
        request.onerror = () => reject(request.error);
      });
    } finally {
      database.close();
    }
  }

  function illustrationImage(shell) {
    return shell?.querySelector('.te-final-student .te-final-visual img') || null;
  }

  function imageSource(image) {
    return String(image?.currentSrc || image?.src || image?.getAttribute?.('src') || '').trim();
  }

  function hasUsableImage(shell) {
    const source = imageSource(illustrationImage(shell));
    return Boolean(source) && !/^data:image\/svg\+xml/i.test(source);
  }

  function applyImage(shell, url, normalizedTitle = activityData(shell).normalizedTitle) {
    const visual = shell?.querySelector('.te-final-student .te-final-visual');
    if (!visual || !url || !normalizedTitle) return false;
    let image = illustrationImage(shell);
    if (!image) {
      image = document.createElement('img');
      visual.replaceChildren(image);
    }
    image.src = url;
    image.dataset.tePersistentIllustration = 'true';
    image.dataset.teIllustrationTitle = normalizedTitle;
    image.alt = `Ilustração pedagógica de ${activityData(shell).topic}`;
    if (shell._teFinalData) shell._teFinalData.visual = url;
    return true;
  }

  async function restoreImage(shell) {
    const { normalizedTitle } = activityData(shell);
    const url = await loadImage(normalizedTitle).catch(() => '');
    return url ? applyImage(shell, url, normalizedTitle) : false;
  }

  function shellsForTitle(normalizedTitle) {
    return [...document.querySelectorAll('.collection-preview-shell')]
      .filter(shell => activityData(shell).normalizedTitle === normalizedTitle);
  }

  function toolbar() {
    let element = document.querySelector('#te-illustration-batch-toolbar');
    const root = document.querySelector('#preview-content') || document.body;
    if (!element) {
      element = document.createElement('div');
      element.id = 'te-illustration-batch-toolbar';
      element.style.cssText = 'position:sticky;top:0;z-index:9999;display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:#fff;border:2px solid #1F497D;margin-bottom:12px;font-family:Arial';
      element.innerHTML = '<strong data-count>0/10 selecionadas</strong><button type="button" data-prepare>Preparar lote de 10</button><button type="button" data-import>Importar ZIP de imagens</button><span data-status style="font-weight:700;color:#1F497D"></span>';
      element.querySelector('[data-prepare]').addEventListener('click', () => {
        prepareBatch().catch(error => {
          console.error(error);
          alert(`Não foi possível preparar o lote: ${error?.message || error}`);
        });
      });
      element.querySelector('[data-import]').addEventListener('click', openZipPicker);
      root.prepend(element);
    }
    return element;
  }

  function setStatus(message = '') {
    const status = toolbar().querySelector('[data-status]');
    if (status && status.textContent !== message) status.textContent = message;
  }

  function updateToolbar() {
    const items = readSelection();
    const element = toolbar();
    const count = element.querySelector('[data-count]');
    const countText = `${items.length}/${MAX_SELECTION} selecionadas`;
    if (count.textContent !== countText) count.textContent = countText;
    element.querySelector('[data-prepare]').disabled = items.length === 0;
    element.querySelector('[data-import]').disabled = items.length === 0;
  }

  function syncSelection(shell) {
    const selected = isSelected(shell);
    shell.dataset.teBatchSelected = selected ? 'true' : 'false';
    shell.style.outline = selected ? '3px solid #1F497D' : '';
    const checkbox = shell.querySelector('.te-batch-selector input');
    if (checkbox) checkbox.checked = selected;
  }

  function sameCollection(left, right) {
    return ['stage', 'grade', 'term', 'subject']
      .every(field => clean(left?.[field]) === clean(right?.[field]));
  }

  function automaticBatchItem(item) {
    return {
      normalizedTitle: normalizeTitle(item?.normalizedTitle || item?.topic),
      topic: clean(item?.topic),
      subject: clean(item?.subject),
      stage: clean(item?.stage),
      grade: clean(item?.grade),
      term: Number(item?.term) || clean(item?.term),
      supportText: clean(item?.supportText || item?.content),
      statement: clean(item?.statement || item?.instruction),
      questions: Array.isArray(item?.questions)
        ? item.questions.map(question => clean(question?.enunciado || question?.prompt || question)).filter(Boolean)
        : []
    };
  }

  function hashText(value) {
    let hash = 2166136261;
    for (const character of String(value || '')) {
      hash ^= character.codePointAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function collectionKey(item) {
    return [item.stage, item.grade, item.term, item.subject].map(normalizeTitle).join('|');
  }

  function visualSource(item) {
    return clean([item.topic, item.supportText, item.statement, ...(item.questions || [])].join(' '));
  }

  function visualAction(item) {
    const source = visualSource(item).toLowerCase();
    if (/fato|opini[aã]o|compar/.test(source)) return 'Estudantes comparando evidências e distinguindo informações';
    if (/produz|escrev|redig|criando/.test(source)) return 'Estudantes produzindo e organizando o conteúdo da atividade';
    if (/classific|agrup|separ/.test(source)) return 'Estudantes classificando os elementos principais';
    if (/observ|identific|reconhe/.test(source)) return 'Estudantes observando e identificando os elementos centrais';
    if (/experiment|investig|pesquis|cient[ií]fic/.test(source)) return 'Estudantes investigando dados e registrando descobertas';
    if (/calcul|n[uú]mero|fra[cç]|medid|geometr/.test(source)) return 'Estudantes manipulando objetos para representar o conceito matemático';
    if (/mapa|territ[oó]rio|paisagem|trajeto/.test(source)) return 'Estudantes analisando uma representação espacial simplificada';
    return `Estudantes analisando ${item.topic.toLowerCase()} com materiais escolares`;
  }

  function visualObjects(item) {
    const source = visualSource(item).toLowerCase();
    if (/not[ií]cia|fato|opini[aã]o|jornal/.test(source)) return ['notícia impressa sem texto legível', 'caderno', 'marcadores visuais'];
    if (/pesquis|cient[ií]fic|experimento/.test(source)) return ['fichas de pesquisa sem texto legível', 'lupa', 'caderno de registro'];
    if (/mapa|territ[oó]rio|trajeto|geograf/.test(source)) return ['mapa esquemático sem rótulos', 'marcadores coloridos', 'setas visuais'];
    if (/fra[cç]|geometr|medid/.test(source)) return ['formas geométricas', 'peças manipuláveis', 'régua sem números legíveis'];
    if (/n[uú]mero|calcul|adi[cç]|subtra|multiplica|divis/.test(source)) return ['peças de contagem', 'grupos de objetos', 'cartões sem respostas'];
    if (/planta|animal|ambiente|[aá]gua|corpo/.test(source)) return ['modelos científicos simples', 'objetos de observação', 'caderno'];
    return ['caderno', 'cartões visuais', 'objetos diretamente ligados ao tema'];
  }

  function compositionOptions() {
    const views = ['vista superior', 'vista frontal', 'ângulo lateral', 'close pedagógico', 'composição central'];
    const anchors = ['foco à esquerda', 'foco à direita', 'foco central', 'foco na parte superior', 'foco na parte inferior'];
    const arrangements = ['em sequência', 'em comparação lado a lado', 'em grupos bem separados', 'em fluxo diagonal'];
    return views.flatMap(view => anchors.flatMap(anchor => arrangements.map(arrangement => `${view}, ${anchor}, elementos ${arrangement}`)));
  }

  function visualSignatureRecord(item, usedCompositions) {
    const action = visualAction(item);
    const objects = visualObjects(item);
    const options = compositionOptions();
    const initial = hashText(`${collectionKey(item)}|${item.normalizedTitle}`) % options.length;
    let composition = options[initial];
    for (let offset = 0; offset < options.length; offset += 1) {
      const candidate = options[(initial + offset) % options.length];
      if (!usedCompositions.has(candidate)) {
        composition = candidate;
        break;
      }
    }
    usedCompositions.add(composition);
    const restrictions = 'fundo claro ou branco, ilustração educativa limpa, sem paisagem desnecessária, sem texto legível, sem logotipos e sem revelar respostas';
    const visualBrief = `${action}. Objetos obrigatórios: ${objects.join(', ')}. Conceito central: ${item.topic}. Elementos indispensáveis: ação e objetos centrais bem visíveis. Composição: ${composition}. Restrições: ${restrictions}.`;
    return {
      version: VISUAL_BRIEF_VERSION,
      collectionKey: collectionKey(item),
      normalizedTitle: item.normalizedTitle,
      sourceHash: hashText(visualSource(item)),
      action,
      objects,
      composition,
      signature: normalizeTitle(`${item.topic}|${action}|${objects.join('|')}|${composition}`),
      visualBrief
    };
  }

  function preparedActivities(items) {
    const records = readVisualSignatures();
    const currentCollection = collectionKey(items[0] || {});
    const selectedKeys = new Set(items.map(item => item.normalizedTitle));
    const usedCompositions = new Set(Object.values(records)
      .filter(record => record?.collectionKey === currentCollection && !selectedKeys.has(record.normalizedTitle))
      .map(record => record.composition)
      .filter(Boolean));

    const prepared = items.map((item, index) => {
      const key = `${collectionKey(item)}::${item.normalizedTitle}`;
      const existing = records[key];
      const sourceHash = hashText(visualSource(item));
      const record = existing?.sourceHash === sourceHash
        ? existing
        : visualSignatureRecord(item, usedCompositions);
      usedCompositions.add(record.composition);
      records[key] = record;
      return {
        order: index + 1,
        subject: item.subject,
        topic: item.topic,
        normalizedTitle: item.normalizedTitle,
        fileName: `${item.normalizedTitle}.png`,
        stage: item.stage,
        grade: item.grade,
        term: item.term,
        supportText: item.supportText,
        statement: item.statement,
        questions: [...item.questions],
        visualBrief: record.visualBrief,
        visualSignature: record.signature
      };
    });
    writeVisualSignatures(records);
    return prepared;
  }

  function downloadPreparedJson(activities) {
    const blob = new Blob([`${JSON.stringify(activities, null, 2)}\n`], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const first = activities[0] || {};
    link.href = url;
    link.download = `teacheasy-lote-${normalizeTitle(`${first.grade}-${first.term}-bimestre-${first.subject}`) || 'ilustracoes'}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function prepareBatch({ download = true } = {}) {
    const currentSelection = readSelection();
    const contextItems = window.TeLibraryIllustrationBatchContext?.activities || [];
    const contextByTitle = new Map(contextItems.map(item => [normalizeTitle(item.topic), item]));
    const items = currentSelection.map(item => automaticBatchItem(contextByTitle.get(item.normalizedTitle) || item));
    if (!items.length) throw new Error('Selecione uma atividade para montar o lote.');
    writeSelection(items);
    const activities = preparedActivities(items);
    const linkedValues = await Promise.all(items.map(item => loadImage(item.normalizedTitle).catch(() => '')));
    const prepared = {
      version: VISUAL_BRIEF_VERSION,
      preparedAt: new Date().toISOString(),
      collectionKey: collectionKey(items[0]),
      progress: {
        total: activities.length,
        prepared: activities.length,
        linked: linkedValues.filter(Boolean).length
      },
      activities
    };
    writePreparedBatch(prepared);
    setStatus(`Lote preparado: ${activities.length}/${activities.length}. ${prepared.progress.linked}/${activities.length} imagens vinculadas.`);
    if (download) downloadPreparedJson(activities);
    return prepared;
  }

  async function buildAutomaticBatch(start, candidates, hasStoredImage = loadImage) {
    const startKey = normalizeTitle(start?.normalizedTitle || start?.topic);
    const ordered = Array.isArray(candidates) ? candidates : [];
    const startIndex = ordered.findIndex(item => sameCollection(item, start)
      && normalizeTitle(item?.normalizedTitle || item?.topic) === startKey);
    if (startIndex < 0) return [];

    const batch = [];
    for (let index = startIndex; index < ordered.length && batch.length < MAX_SELECTION; index += 1) {
      const candidate = ordered[index];
      if (!sameCollection(candidate, start)) break;
      const item = automaticBatchItem(candidate);
      if (!item.normalizedTitle || !item.topic || candidate.hasStaticImage) continue;
      if (await hasStoredImage(item.normalizedTitle)) continue;
      batch.push(item);
    }
    return batch;
  }

  async function selectBatchFromShell(shell, checkbox) {
    if (!checkbox.checked) {
      writeSelection([]);
      writePreparedBatch(null);
      document.querySelectorAll('.collection-preview-shell').forEach(syncSelection);
      updateToolbar();
      await updateLinkedStatus();
      return [];
    }

    const context = window.TeLibraryIllustrationBatchContext;
    const fallback = selectionItem(shell);
    const start = context?.start || fallback;
    const candidates = context?.activities || [fallback];
    checkbox.disabled = true;
    try {
      const batch = await buildAutomaticBatch(start, candidates);
      writeSelection(batch);
      writePreparedBatch(null);
      document.querySelectorAll('.collection-preview-shell').forEach(syncSelection);
      updateToolbar();
      setStatus(`Lote com ${batch.length} atividade${batch.length === 1 ? '' : 's'} sem imagem.`);
      return batch;
    } finally {
      checkbox.disabled = false;
    }
  }

  async function toggleSelection(shell, checkbox) {
    await selectBatchFromShell(shell, checkbox);
    updateToolbar();
  }

  function addSelector(shell) {
    const data = activityData(shell);
    if (!data.normalizedTitle) return;
    if (hasUsableImage(shell) && !isSelected(shell)) return;
    let selector = shell.querySelector('.te-batch-selector');
    if (!selector) {
      const host = shell.querySelector('.te-final-student') || shell;
      selector = document.createElement('label');
      selector.className = 'te-batch-selector';
      selector.style.cssText = 'display:flex;gap:7px;align-items:center;margin:8px 0;padding:8px 10px;border:1px solid #ccd4df;border-radius:7px;background:#f7f9fc;font:600 14px Arial;color:#1F497D';
      selector.innerHTML = '<input type="checkbox"> <span>Selecionar lote a partir desta atividade</span>';
      selector.querySelector('input').addEventListener('change', event => {
        toggleSelection(shell, event.target).catch(error => {
          console.error(error);
          event.target.checked = false;
          alert('Não foi possível montar o lote de atividades.');
        });
      });
      host.insertBefore(selector, host.firstChild);
    }
    syncSelection(shell);
  }

  function matchFiles(files, activities) {
    const byTitle = new Map();
    for (const file of files) {
      const key = normalizedFileName(file.name);
      if (!byTitle.has(key)) byTitle.set(key, []);
      byTitle.get(key).push(file);
    }

    const activityKeys = new Set(activities.map(item => item.normalizedTitle));
    const pairs = [];
    const missingTitles = [];
    const duplicateFileTitles = [];
    const usedFiles = new Set();

    for (const activity of activities) {
      const candidates = byTitle.get(activity.normalizedTitle) || [];
      if (candidates.length !== 1) {
        missingTitles.push(activity.topic);
        if (candidates.length > 1) duplicateFileTitles.push(activity.topic);
        continue;
      }
      pairs.push({ activity, file: candidates[0] });
      usedFiles.add(candidates[0]);
    }

    const unmatchedFiles = files
      .filter(file => !usedFiles.has(file) && !activityKeys.has(normalizedFileName(file.name)))
      .map(file => file.name);

    return { pairs, missingTitles, duplicateFileTitles, unmatchedFiles };
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  async function importFiles(files, activities = readSelection()) {
    const result = matchFiles(files, activities);
    let linkedCount = 0;
    for (const { activity, file } of result.pairs) {
      const url = await fileToDataUrl(file);
      await saveImage(activity.normalizedTitle, activity.topic, url);
      shellsForTitle(activity.normalizedTitle).forEach(shell => applyImage(shell, url, activity.normalizedTitle));
      linkedCount += 1;
      setStatus(`${linkedCount}/${activities.length} imagens vinculadas`);
    }
    await updatePreparedProgress(activities);
    return { ...result, linkedCount, total: activities.length };
  }

  function importMessage(result) {
    const lines = result.missingTitles.length
      ? [`${result.linkedCount}/${result.total} imagens vinculadas. Não encontradas:`, '', ...result.missingTitles.map(title => `- ${title}`)]
      : [`${result.linkedCount}/${result.total} imagens vinculadas corretamente.`];
    if (result.duplicateFileTitles.length) {
      lines.push(`Arquivos duplicados para: ${result.duplicateFileTitles.join(', ')}. Nenhum deles foi usado.`);
    }
    if (result.unmatchedFiles.length) {
      lines.push(`Arquivos sem atividade correspondente: ${result.unmatchedFiles.join(', ')}. Eles foram ignorados.`);
    }
    return lines.join('\n');
  }

  function isSupportedZipImage(path) {
    const parts = String(path || '').replace(/\\/g, '/').split('/').filter(Boolean);
    if (!parts.length) return false;
    if (parts.some(part => part.startsWith('.') || part.toUpperCase() === '__MACOSX')) return false;
    const extension = parts.at(-1).split('.').pop()?.toLowerCase() || '';
    return IMAGE_EXTENSIONS.has(extension);
  }

  function zipBaseName(path) {
    return String(path || '').replace(/\\/g, '/').split('/').filter(Boolean).at(-1) || '';
  }

  function imageMimeType(fileName) {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg';
    return `image/${extension}`;
  }

  async function extractZipImages(zipFile) {
    if (!zipFile || !/\.zip$/i.test(zipFile.name || '')) {
      throw new Error('Selecione um arquivo ZIP válido.');
    }
    if (!window.JSZip) throw new Error('O leitor de ZIP não foi carregado. Recarregue a página e tente novamente.');
    const archive = await window.JSZip.loadAsync(await zipFile.arrayBuffer());
    const entries = Object.values(archive.files)
      .filter(entry => !entry.dir && isSupportedZipImage(entry.name));
    if (entries.length > MAX_ZIP_IMAGES) {
      throw new Error(`O ZIP possui mais de ${MAX_ZIP_IMAGES} imagens. Divida-o em lotes menores.`);
    }
    return Promise.all(entries.map(async entry => {
      const name = zipBaseName(entry.name);
      const bytes = await entry.async('uint8array');
      return new File([bytes], name, { type: imageMimeType(name) });
    }));
  }

  async function importZip(zipFile, activities = readSelection()) {
    const files = await extractZipImages(zipFile);
    return importFiles(files, activities);
  }

  function openZipPicker() {
    const activities = readSelection();
    if (!activities.length) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = false;
    input.accept = '.zip,application/zip,application/x-zip-compressed';
    input.addEventListener('change', async () => {
      const zipFile = input.files?.[0];
      if (!zipFile) return;
      setStatus('Abrindo ZIP e importando imagens...');
      try {
        const result = await importZip(zipFile, activities);
        setStatus(result.missingTitles.length
          ? `${result.linkedCount}/${result.total} imagens vinculadas.`
          : `${result.linkedCount}/${result.total} imagens vinculadas corretamente.`);
        alert(importMessage(result));
      } catch (error) {
        console.error(error);
        alert(`Falha ao importar imagens: ${error?.message || error}`);
        await updateLinkedStatus();
      }
    });
    input.click();
  }

  function preparedMatchesSelection(prepared, activities) {
    if (!prepared || prepared.activities.length !== activities.length) return false;
    return prepared.activities.every((item, index) => item.normalizedTitle === activities[index]?.normalizedTitle);
  }

  async function updatePreparedProgress(activities = readSelection()) {
    const prepared = readPreparedBatch();
    if (!preparedMatchesSelection(prepared, activities)) return null;
    const values = await Promise.all(activities.map(item => loadImage(item.normalizedTitle).catch(() => '')));
    prepared.progress = {
      total: activities.length,
      prepared: prepared.activities.length,
      linked: values.filter(Boolean).length
    };
    writePreparedBatch(prepared);
    return prepared;
  }

  async function updateLinkedStatus() {
    const activities = readSelection();
    if (!activities.length) {
      setStatus('');
      return;
    }
    const values = await Promise.all(activities.map(item => loadImage(item.normalizedTitle).catch(() => '')));
    const linkedCount = values.filter(Boolean).length;
    const prepared = readPreparedBatch();
    if (preparedMatchesSelection(prepared, activities)) {
      prepared.progress = { total: activities.length, prepared: prepared.activities.length, linked: linkedCount };
      writePreparedBatch(prepared);
      setStatus(`Lote preparado: ${prepared.activities.length}/${activities.length}. ${linkedCount}/${activities.length} imagens vinculadas.`);
      return;
    }
    setStatus(`${linkedCount}/${activities.length} imagens vinculadas corretamente`);
  }

  async function refresh() {
    const shells = [...document.querySelectorAll('.collection-preview-shell')];
    await Promise.all(shells.map(restoreImage));
    shells.forEach(addSelector);
    updateToolbar();
    await updateLinkedStatus();
  }

  let refreshQueued = false;
  function scheduleRefresh() {
    if (refreshQueued) return;
    refreshQueued = true;
    requestAnimationFrame(async () => {
      refreshQueued = false;
      await refresh();
    });
  }

  const root = document.querySelector('#preview-content') || document.body;
  new MutationObserver(scheduleRefresh).observe(root, { childList: true, subtree: true });

  document.addEventListener('click', async event => {
    const button = event.target.closest('.te-final-word,.te-final-pdf');
    if (!button) return;
    if (button.dataset.teExportImageReady === 'true') {
      delete button.dataset.teExportImageReady;
      return;
    }
    const shell = button.closest('.collection-preview-shell');
    if (!shell) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    await restoreImage(shell);
    if (shell._teFinalData && hasUsableImage(shell)) {
      shell._teFinalData.visual = imageSource(illustrationImage(shell));
    }
    button.dataset.teExportImageReady = 'true';
    button.click();
  }, true);

  window.TeLibraryTitleImages = {
    DB_NAME,
    DB_VERSION,
    STORE_NAME,
    SELECTION_KEY,
    PREPARED_BATCH_KEY,
    VISUAL_SIGNATURES_KEY,
    normalizeTitle,
    normalizedFileName,
    matchFiles,
    importFiles,
    extractZipImages,
    importZip,
    importMessage,
    buildAutomaticBatch,
    selectBatchFromShell,
    prepareBatch,
    readPreparedBatch,
    preparedActivities,
    openZipPicker,
    openImportPicker: openZipPicker,
    restoreImage,
    refresh
  };
  window.teGetIllustrationBatchSelection = readSelection;
  window.teClearIllustrationBatchSelection = () => {
    writeSelection([]);
    writePreparedBatch(null);
    refresh();
  };
  window.teIllustrationTitleForShell = shell => activityData(shell).normalizedTitle;
  window.tePersistLibraryIllustration = async (shell, url) => {
    const data = activityData(shell);
    const saved = await saveImage(data.normalizedTitle, data.topic, url);
    if (saved) applyImage(shell, url, data.normalizedTitle);
    return saved;
  };
  window.teRestoreLibraryIllustration = restoreImage;

  refresh();
})();

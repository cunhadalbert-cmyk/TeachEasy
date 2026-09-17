(() => {
  const nativeFetch = globalThis.fetch.bind(globalThis);
  let mathLoadPromise = null;
  let mathWordingLoadPromise = null;
  let scienceLoadPromise = null;
  let historyLoadPromise = null;
  let geographyLoadPromise = null;
  let coherentLoadPromise = null;
  let portugueseBaselineLoadPromise = null;
  const approvedBaselinePromises = new Map();

  const REMAINING_RE = /\/ensino-medio\/(?:1|2|3)-serie\/(?:1|2|3|4)-bimestre\/(lingua-portuguesa|matematica|ciencias|historia|geografia)\.json(?:\?|$)/;
  const COMPLETED_RE = /\/1-serie\/1-bimestre\/(?:lingua-portuguesa|matematica|ciencias|historia|geografia)\.json(?:\?|$)/;

  async function ensurePortugueseBaseline() {
    if (globalThis.TeachEasyHighSchoolPedagogicalOverrides?.reviewedIds?.length === 50) return;
    portugueseBaselineLoadPromise ||= (async () => {
      await import('./ensino-medio-pedagogical-overrides.js?v=20260916-piloto-1s1b-lp-v1');
      await import('./ensino-medio-pedagogical-overrides-06-10.js?v=20260916-1s1b-lp-06-10-v1');
      await import('./ensino-medio-pedagogical-overrides-11-15.js?v=20260916-1s1b-lp-11-15-v1');
      await import('./ensino-medio-pedagogical-overrides-16-20.js?v=20260916-1s1b-lp-16-20-v1');
      await import('./ensino-medio-pedagogical-overrides-21-25.js?v=20260916-1s1b-lp-21-25-v1');
      await import('./ensino-medio-pedagogical-overrides-26-30.js?v=20260916-1s1b-lp-26-30-v1');
      await import('./ensino-medio-pedagogical-overrides-31-50.js?v=20260916-1s1b-lp-31-50-v1');
    })();
    await portugueseBaselineLoadPromise;
  }

  async function ensureMathPatcher(url, force = false) {
    if (!force && !url.includes('/1-serie/1-bimestre/matematica.json')) return;
    if (!globalThis.TeachEasyHighSchoolMathPedagogicalOverrides?.apply) {
      mathLoadPromise ||= import('./ensino-medio-matematica-pedagogical-overrides.js?v=20260916-1s1b-mat-01-50-v1');
      await mathLoadPromise;
    }
    mathWordingLoadPromise ||= import('./ensino-medio-matematica-pedagogical-wording.js?v=20260916-1s1b-mat-wording-v1');
    await mathWordingLoadPromise;
  }

  async function ensureSciencePatcher(url) {
    if (!url.includes('/1-serie/1-bimestre/ciencias.json')) return;
    if (globalThis.TeachEasyHighSchoolSciencePedagogicalOverrides?.reviewedIds?.length === 50) return;
    scienceLoadPromise ||= (async () => {
      await import('./ensino-medio-ciencias-pedagogical-core-base.js?v=20260916-1s1b-ciencias-v2');
      await import('./ensino-medio-ciencias-pedagogical-builders-01.js?v=20260916-1s1b-ciencias-v2');
      await import('./ensino-medio-ciencias-pedagogical-builders-02.js?v=20260916-1s1b-ciencias-v2');
      await import('./ensino-medio-ciencias-pedagogical-builders-03.js?v=20260916-1s1b-ciencias-v2');
      await import('./ensino-medio-ciencias-pedagogical-builders-04.js?v=20260916-1s1b-ciencias-v2');
      await import('./ensino-medio-ciencias-pedagogical-builders-05.js?v=20260916-1s1b-ciencias-v2');
      await import('./ensino-medio-ciencias-pedagogical-builders-06.js?v=20260916-1s1b-ciencias-v2');
      await import('./ensino-medio-ciencias-pedagogical-01.js?v=20260916-1s1b-ciencias-v2');
      await import('./ensino-medio-ciencias-pedagogical-02.js?v=20260916-1s1b-ciencias-v2');
      await import('./ensino-medio-ciencias-pedagogical-03.js?v=20260916-1s1b-ciencias-v2');
      await import('./ensino-medio-ciencias-pedagogical-04.js?v=20260916-1s1b-ciencias-v2');
      await import('./ensino-medio-ciencias-pedagogical-05.js?v=20260916-1s1b-ciencias-v2');
    })();
    await scienceLoadPromise;
  }

  async function ensureHistoryPatcher(url, force = false) {
    if (!force && !url.includes('/1-serie/1-bimestre/historia.json')) return;
    if (globalThis.TeachEasyHighSchoolHistoryPedagogicalOverrides?.reviewedIds?.length === 50) return;
    historyLoadPromise ||= (async () => {
      await import('./ensino-medio-historia-pedagogical-core.js?v=20260916-1s1b-historia-v1');
      await import('./ensino-medio-historia-pedagogical-01.js?v=20260916-1s1b-historia-v1');
      await import('./ensino-medio-historia-pedagogical-02.js?v=20260916-1s1b-historia-v1');
      await import('./ensino-medio-historia-pedagogical-03.js?v=20260916-1s1b-historia-v1');
      await import('./ensino-medio-historia-pedagogical-04.js?v=20260916-1s1b-historia-v1');
      await import('./ensino-medio-historia-pedagogical-05.js?v=20260916-1s1b-historia-v1');
    })();
    await historyLoadPromise;
  }

  async function ensureGeographyPatcher(url, force = false) {
    if (!force && !url.includes('/1-serie/1-bimestre/geografia.json')) return;
    if (globalThis.TeachEasyHighSchoolGeographyPedagogicalOverrides?.reviewedIds?.length === 50) return;
    geographyLoadPromise ||= (async () => {
      await import('./ensino-medio-geografia-pedagogical-core.js?v=20260916-1s1b-geografia-v1');
      await import('./ensino-medio-geografia-pedagogical-01.js?v=20260916-1s1b-geografia-v1');
      await import('./ensino-medio-geografia-pedagogical-02.js?v=20260916-1s1b-geografia-v1');
      await import('./ensino-medio-geografia-pedagogical-03.js?v=20260916-1s1b-geografia-v1');
      await import('./ensino-medio-geografia-pedagogical-04.js?v=20260916-1s1b-geografia-v1');
      await import('./ensino-medio-geografia-pedagogical-05.js?v=20260916-1s1b-geografia-v1');
    })();
    await geographyLoadPromise;
  }

  async function ensureApprovedPatcher(discipline) {
    if (discipline === 'lingua-portuguesa') return ensurePortugueseBaseline();
    if (discipline === 'matematica') return ensureMathPatcher('', true);
    if (discipline === 'historia') return ensureHistoryPatcher('', true);
    if (discipline === 'geografia') return ensureGeographyPatcher('', true);
  }

  function approvedPatcherFor(discipline) {
    if (discipline === 'lingua-portuguesa') return globalThis.TeachEasyHighSchoolPedagogicalOverrides;
    if (discipline === 'matematica') return globalThis.TeachEasyHighSchoolMathPedagogicalOverrides;
    if (discipline === 'historia') return globalThis.TeachEasyHighSchoolHistoryPedagogicalOverrides;
    if (discipline === 'geografia') return globalThis.TeachEasyHighSchoolGeographyPedagogicalOverrides;
    return null;
  }

  async function approvedBaseline(discipline) {
    if (approvedBaselinePromises.has(discipline)) return approvedBaselinePromises.get(discipline);
    const promise = (async () => {
      await ensureApprovedPatcher(discipline);
      const patcher = approvedPatcherFor(discipline);
      if (!patcher?.apply) throw new Error(`Patcher aprovado não carregado: ${discipline}`);
      const response = await nativeFetch(`data/atividades/ensino-medio/1-serie/1-bimestre/${discipline}.json`);
      if (!response.ok) throw new Error(`Coleção-base indisponível: ${discipline}`);
      const collection = await response.json();
      return patcher.apply(collection);
    })();
    approvedBaselinePromises.set(discipline, promise);
    return promise;
  }

  async function ensureCoherentLayer(url) {
    const hit = url.match(REMAINING_RE);
    if (!hit || COMPLETED_RE.test(url)) return null;
    coherentLoadPromise ||= (async () => {
      await import('./ensino-medio-coerencia-total.js?v=20260917-em-coerencia-total-v1');
      await import('./ensino-medio-coerencia-final.js?v=20260917-em-coerencia-titulos-v1');
    })();
    await coherentLoadPromise;
    const discipline = hit[1];
    if (discipline !== 'ciencias') await ensureApprovedPatcher(discipline);
    return discipline;
  }

  globalThis.fetch = async (...args) => {
    const response = await nativeFetch(...args);
    const request = args[0];
    const url = typeof request === 'string' ? request : request?.url || '';

    if (!response.ok || !url.includes('data/atividades/ensino-medio/')) return response;

    try {
      await ensureMathPatcher(url);
      await ensureSciencePatcher(url);
      await ensureHistoryPatcher(url);
      await ensureGeographyPatcher(url);
      const remainingDiscipline = await ensureCoherentLayer(url);

      const collection = await response.clone().json();
      const fixedPatchers = [
        globalThis.TeachEasyHighSchoolPedagogicalOverrides,
        globalThis.TeachEasyHighSchoolMathPedagogicalOverrides,
        globalThis.TeachEasyHighSchoolSciencePedagogicalOverrides,
        globalThis.TeachEasyHighSchoolHistoryPedagogicalOverrides,
        globalThis.TeachEasyHighSchoolGeographyPedagogicalOverrides
      ].filter(item => item?.apply && item?.collection);

      const fixedPatcher = fixedPatchers.find(item => item.collection === collection?.colecao);
      let patched = collection;

      if (fixedPatcher) {
        patched = fixedPatcher.apply(collection);
      } else if (remainingDiscipline && globalThis.TeachEasyHighSchoolCoherentRemaining?.matches?.(collection)) {
        if (remainingDiscipline === 'ciencias') {
          patched = globalThis.TeachEasyHighSchoolCoherentRemaining.applyScience(collection);
        } else {
          const baseline = await approvedBaseline(remainingDiscipline);
          patched = globalThis.TeachEasyHighSchoolCoherentRemaining.applyFromBaseline(collection, baseline);
        }
      } else {
        return response;
      }

      const headers = new Headers(response.headers);
      headers.set('content-type', 'application/json; charset=utf-8');
      return new Response(JSON.stringify(patched), {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    } catch (error) {
      console.error('TeachEasy: falha ao aplicar revisão pedagógica do Ensino Médio.', error);
      return response;
    }
  };
})();

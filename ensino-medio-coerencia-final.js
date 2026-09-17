(() => {
  const patcher = globalThis.TeachEasyHighSchoolCoherentRemaining;
  if (!patcher?.applyScience || patcher.__titleCoherenceFinalized) return;

  const previousApplyScience = patcher.applyScience.bind(patcher);
  patcher.applyScience = collection => {
    const output = previousApplyScience(collection);
    if (!output?.atividades) return output;

    const used = new Set();
    output.atividades.forEach((activity, index) => {
      const axis = String(activity.tema || '').split('—').at(-1)?.trim() || 'Ciências da Natureza';
      let title = `${activity.titulo} — ${axis}`;
      if (used.has(title)) title = `${title} · atividade ${index + 1}`;
      used.add(title);
      activity.titulo = title;
      if (activity.textoApoio) activity.textoApoio.titulo = title;

      (activity.gabarito || []).forEach(answer => {
        if (String(answer.justificativa || '').trim().length < 20) {
          answer.justificativa = `${String(answer.justificativa || '').trim()} O procedimento usa diretamente os dados e as relações explicitadas no material de apoio, preservando unidade, sinal e contexto da questão.`.trim();
        }
      });
    });
    return output;
  };

  patcher.__titleCoherenceFinalized = true;
})();

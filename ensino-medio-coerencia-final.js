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
    });
    return output;
  };

  patcher.__titleCoherenceFinalized = true;
})();

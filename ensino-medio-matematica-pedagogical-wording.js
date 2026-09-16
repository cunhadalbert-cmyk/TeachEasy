(() => {
  const patcher = globalThis.TeachEasyHighSchoolMathPedagogicalOverrides;
  if (!patcher?.apply || patcher.__wordingAdjusted) return;

  const previousApply = patcher.apply.bind(patcher);
  patcher.apply = collection => {
    const patched = previousApply(collection);
    if (!patched || patched.colecao !== patcher.collection || !Array.isArray(patched.atividades)) return patched;

    patched.atividades.forEach(activity => {
      (activity.questoes || []).forEach(question => {
        const match = String(question.enunciado || '').match(/^Calcule f\((.+)\)\.$/);
        if (!match) return;
        question.enunciado = `Calcule o valor numérico de f(${match[1]}) usando o modelo apresentado.`;
      });
    });

    return patched;
  };
  patcher.__wordingAdjusted = true;
})();

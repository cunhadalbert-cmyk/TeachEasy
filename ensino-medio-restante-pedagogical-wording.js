(() => {
  const patcher = globalThis.TeachEasyHighSchoolRemainingPedagogicalOverrides;
  if (!patcher?.apply || patcher.__wordingExpanded) return;

  const originalApply = patcher.apply.bind(patcher);
  patcher.apply = input => {
    const output = originalApply(input);
    if (!Array.isArray(output?.atividades)) return output;

    output.atividades.forEach(activity => {
      if (!Array.isArray(activity?.questoes)) return;
      activity.questoes.forEach(question => {
        const text = String(question?.enunciado || '').trim();
        if (text.length >= 35) return;
        const expanded = text ? `${text.charAt(0).toLowerCase()}${text.slice(1)}` : 'resolva a questão usando os dados apresentados';
        question.enunciado = `Com base nos dados do problema, ${expanded}`;
      });
    });
    return output;
  };

  patcher.__wordingExpanded = true;
})();

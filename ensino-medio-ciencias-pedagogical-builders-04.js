(() => {
  const core = globalThis.TeachEasySciencePedagogicalCore;
  if (!core?.builders) return;
  const { q, a, fmt, objectives } = core;
  core.builders.thermal = function(s) {
    const dropA = Math.abs(s.initial - s.finalA);
    const dropB = Math.abs(s.initial - s.finalB);
    const rateA = dropA / s.minutes;
    const rateB = dropB / s.minutes;
    const better = s.desired === 'cool'
      ? (rateA >= rateB ? s.conditionA : s.conditionB)
      : (rateA <= rateB ? s.conditionA : s.conditionB);
    const text = `CONTEXTO — ${s.system}\n` +
      `${s.context}. A temperatura inicial é ${fmt(s.initial)} °C. Após ${fmt(s.minutes)} min, ${s.conditionA} chega a ${fmt(s.finalA)} °C e ${s.conditionB} a ${fmt(s.finalB)} °C. ` +
      `Para comparar, use taxa média de variação = |temperatura final − inicial| ÷ tempo. ` +
      `${s.desired === 'cool' ? 'Neste sistema, maior taxa de queda indica remoção de calor mais rápida.' : 'Neste sistema, menor taxa de variação indica melhor conservação da temperatura inicial.'} ` +
      `A comparação só é válida porque volume, tempo e ambiente foram mantidos equivalentes.`;
    return {
      tema: `${s.system}: temperatura, taxa de troca térmica e eficiência`,
      objetivo: objectives.thermal,
      instrucaoGeral: 'Calcule as variações e taxas médias, identifique as variáveis controladas e interprete qual sistema atende melhor à finalidade.',
      textoApoio: { titulo: s.title, conteudo: text },
      questoes: [
        q(1, 'resolucao', `Calcule a variação absoluta de temperatura de ${s.conditionA} durante o teste.`),
        q(2, 'resolucao', `Calcule a variação absoluta de temperatura de ${s.conditionB} durante o teste.`),
        q(3, 'resolucao', `Calcule a taxa média de variação de temperatura de ${s.conditionA}, em °C/min.`),
        q(4, 'resolucao', `Calcule a taxa média de variação de temperatura de ${s.conditionB}, em °C/min.`),
        q(5, 'multipla-escolha', 'Qual condição atende melhor à finalidade descrita no contexto?', [better, better === s.conditionA ? s.conditionB : s.conditionA, 'As duas são necessariamente idênticas.', 'Não há qualquer dado térmico disponível.'], 'pequeno'),
        q(6, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: para comparar os materiais de forma justa, volume, tempo e ambiente devem permanecer controlados.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(7, 'analise', 'Explique por que a taxa de variação de temperatura é um indicador mais útil que olhar apenas a temperatura inicial.'),
        q(8, 'producao', 'Proponha uma nova etapa experimental para testar o sistema escolhido, indicando uma variável a modificar e uma medida a registrar.')
      ],
      gabarito: [
        a(1, `${fmt(dropA)} °C.`, 'Diferença absoluta entre temperatura inicial e final A.'),
        a(2, `${fmt(dropB)} °C.`, 'Diferença absoluta entre temperatura inicial e final B.'),
        a(3, `${fmt(rateA, 3)} °C/min.`, 'Variação A dividida pelo tempo.'),
        a(4, `${fmt(rateB, 3)} °C/min.`, 'Variação B dividida pelo tempo.'),
        a(5, `${better}.`, s.desired === 'cool' ? 'Apresenta a maior taxa de resfriamento.' : 'Apresenta a menor taxa de alteração da temperatura.'),
        a(6, 'Verdadeiro.', 'Sem controlar outras variáveis, não seria possível atribuir a diferença ao sistema comparado.'),
        a(7, 'Porque a taxa incorpora a mudança ocorrida e o tempo do teste, permitindo comparar desempenhos em base comum.', 'A temperatura inicial isolada não informa velocidade de troca térmica.'),
        a(8, 'Resposta autoral com variável independente definida, como espessura/material, e registro de temperatura ao longo do tempo.', 'A proposta deve manter as demais condições controladas.')
      ]
    };
  };
})();

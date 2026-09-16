(() => {
  const core = globalThis.TeachEasySciencePedagogicalCore;
  if (!core?.builders) return;
  const { q, a, fmt, objectives } = core;
  core.builders.cycle = function(s) {
    const net = s.input + s.human - s.output;
    const final = s.start + net;
    const newNet = s.input + (s.human - s.intervention) - s.output;
    const finalAfter = s.start + newNet;
    const text = `CONTEXTO — ${s.cycle}\n` +
      `Considere o ${s.reservoir} com estoque inicial de ${fmt(s.start)} unidades. Em um período, entram ${fmt(s.input)} ${s.flowUnit} por processos do sistema e mais ${fmt(s.human)} ${s.flowUnit} por interferência humana; saem ${fmt(s.output)} ${s.flowUnit}. ` +
      `O balanço é calculado por entrada total − saída. A intervenção proposta é ${s.action}, equivalente a reduzir ${fmt(s.intervention)} ${s.flowUnit} da entrada humana. ` +
      `O modelo é simplificado: ele ajuda a interpretar fluxos, mas não representa todas as interações do ciclo real.`;
    return {
      tema: `${s.cycle}: reservatórios, fluxos e interferência humana`,
      objetivo: objectives.cycle,
      instrucaoGeral: 'Calcule o balanço do ciclo, interprete o sinal do resultado e avalie o efeito quantitativo da intervenção proposta.',
      textoApoio: { titulo: s.title, conteudo: text },
      questoes: [
        q(1, 'resolucao', 'Calcule a entrada total no reservatório somando o fluxo do sistema e a entrada de origem humana.'),
        q(2, 'resolucao', 'Calcule o balanço líquido do período: entrada total menos saída.'),
        q(3, 'completar', 'Complete: ao final do período, o estoque do reservatório será de ____ unidades no modelo.'),
        q(4, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: um balanço líquido positivo significa aumento do estoque do reservatório no modelo.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(5, 'analise', `Explique de que modo a interferência humana de ${fmt(s.human)} ${s.flowUnit} altera o balanço do ${s.cycle}.`),
        q(6, 'resolucao', `Depois da intervenção proposta, qual passa a ser o novo balanço líquido do período?`),
        q(7, 'interpretacao', `Compare os balanços antes e depois da intervenção e explique o que muda no ${s.reservoir}.`),
        q(8, 'producao', 'Proponha uma segunda ação que poderia reduzir a alteração humana do ciclo e indique qual fluxo do modelo ela procuraria modificar.')
      ],
      gabarito: [
        a(1, `${fmt(s.input + s.human)} ${s.flowUnit}.`, 'Soma da entrada do sistema com a entrada humana.'),
        a(2, `${fmt(net)} unidades por período.`, 'Entrada total menos saída.'),
        a(3, `${fmt(final)} unidades.`, 'Estoque inicial somado ao balanço líquido.'),
        a(4, 'Verdadeiro.', 'No modelo, resultado positivo acrescenta material ao reservatório.'),
        a(5, `A entrada humana acrescenta ${fmt(s.human)} ${s.flowUnit} e torna o balanço ${fmt(net)} unidades por período.`, 'A resposta deve ligar a interferência ao fluxo de entrada.'),
        a(6, `${fmt(newNet)} unidades por período.`, `A entrada humana cai de ${fmt(s.human)} para ${fmt(s.human - s.intervention)}.`),
        a(7, `O balanço passa de ${fmt(net)} para ${fmt(newNet)}; o estoque final do período passaria de ${fmt(final)} para ${fmt(finalAfter)} unidades.`, 'A comparação deve usar os dois resultados.'),
        a(8, 'Resposta autoral coerente, como reduzir emissões/descargas, ampliar remoção biológica ou diminuir perdas, identificando o fluxo afetado.', 'Aceitar ações cientificamente plausíveis e vinculadas ao modelo.')
      ]
    };
  };
  core.builders.energy = function(s) {
    const gross = s.sourceCount * s.unitPerSource;
    const net = gross * (1 - s.lossPct / 100);
    const balance = net - s.demand;
    const coverage = (net / s.demand) * 100;
    const text = `CONTEXTO — ${s.system}\n` +
      `A demanda média é ${fmt(s.demand)} ${s.energyUnit}. A proposta usa ${s.sourceCount} unidades geradoras, cada uma produzindo ${fmt(s.unitPerSource)} ${s.energyUnit} antes das perdas. ` +
      `Estimam-se perdas totais de ${fmt(s.lossPct)}% entre geração e uso. Para o exercício, geração líquida = geração bruta × (1 − perdas). ` +
      `Além dos números, deve-se considerar que ${s.impact}. O objetivo é verificar a cobertura da demanda antes de concluir se a solução é suficiente.`;
    return {
      tema: `${s.system}: geração, perdas, cobertura e decisão`,
      objetivo: objectives.energy,
      instrucaoGeral: 'Calcule geração bruta e líquida, compare com a demanda e justifique a decisão também com aspectos ambientais e operacionais.',
      textoApoio: { titulo: s.title, conteudo: text },
      questoes: [
        q(1, 'resolucao', 'Calcule a geração bruta diária multiplicando a quantidade de unidades geradoras pela produção de cada uma.'),
        q(2, 'resolucao', `Calcule a geração líquida depois de descontar ${fmt(s.lossPct)}% de perdas.`),
        q(3, 'resolucao', 'Compare geração líquida e demanda: há déficit ou excedente? Quantifique o valor.'),
        q(4, 'resolucao', 'Calcule aproximadamente qual porcentagem da demanda diária é coberta pela geração líquida.'),
        q(5, 'multipla-escolha', 'Qual conclusão é compatível com os cálculos do sistema?', [
          balance >= 0 ? 'A geração líquida atende ou supera a demanda calculada.' : 'A geração líquida não cobre toda a demanda calculada.',
          balance >= 0 ? 'O sistema apresenta déficit igual à demanda inteira.' : 'A geração líquida é maior que o dobro da demanda.',
          'As perdas aumentam a energia disponível.',
          'A quantidade de geradores não interfere no resultado.'
        ], 'pequeno'),
        q(6, 'analise', `Explique por que o dado numérico de cobertura não é suficiente sozinho para decidir sobre ${s.system}.`),
        q(7, 'associacao', 'Associe os termos do cálculo: demanda, geração bruta, perdas e geração líquida.', ['demanda — energia necessária', 'geração bruta — produção antes das perdas', 'perdas — parcela não aproveitada', 'geração líquida — energia disponível após perdas'], 'medio'),
        q(8, 'producao', 'Escreva uma recomendação técnica curta: manter, ampliar ou complementar a proposta, justificando com o percentual de cobertura e um aspecto socioambiental.')
      ],
      gabarito: [
        a(1, `${fmt(gross)} ${s.energyUnit}.`, 'Quantidade de unidades multiplicada pela produção unitária.'),
        a(2, `${fmt(net)} ${s.energyUnit}.`, `Aplicação do fator ${fmt(1 - s.lossPct / 100)} após as perdas.`),
        a(3, balance >= 0 ? `Excedente de ${fmt(balance)} ${s.energyUnit}.` : `Déficit de ${fmt(Math.abs(balance))} ${s.energyUnit}.`, 'Diferença entre geração líquida e demanda.'),
        a(4, `${fmt(coverage, 1)}% aproximadamente.`, 'Geração líquida dividida pela demanda, multiplicada por 100.'),
        a(5, balance >= 0 ? 'A) A geração líquida atende ou supera a demanda calculada.' : 'A) A geração líquida não cobre toda a demanda calculada.', 'É a alternativa compatível com o sinal do balanço.'),
        a(6, `Porque também importam variabilidade da fonte, armazenamento, custo, resíduos e impactos; no caso, ${s.impact}.`, 'A decisão energética combina eficiência, disponibilidade e impactos.'),
        a(7, 'Demanda — energia necessária; geração bruta — produção antes das perdas; perdas — parcela não aproveitada; geração líquida — energia disponível após perdas.', 'Definições usadas no próprio modelo.'),
        a(8, `Resposta deve usar cobertura de ${fmt(coverage, 1)}% e mencionar ao menos um aspecto operacional ou socioambiental do contexto.`, 'Aceitar decisão diferente desde que os dados sejam usados corretamente.')
      ]
    };
  };
})();

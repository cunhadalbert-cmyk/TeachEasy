(() => {
  const core = globalThis.TeachEasySciencePedagogicalCore;
  if (!core?.builders) return;
  const { q, a, fmt, objectives } = core;
  core.builders.device = function(s) {
    const power = s.voltage * s.current;
    const energy = (power * s.hours) / 1000;
    const useful = power * s.efficiency / 100;
    const losses = power - useful;
    const text = `CONTEXTO — ${s.device}\n` +
      `${s.context}. A tensão média é ${fmt(s.voltage)} V e a corrente média é ${fmt(s.current)} A. O modelo usa P = V × I. ` +
      `O equipamento opera por ${fmt(s.hours)} h e tem eficiência estimada de ${fmt(s.efficiency)}%, entendida como a fração da potência de entrada convertida na forma útil desejada. ` +
      `O restante aparece como perdas, principalmente térmicas e elétricas. Consumo em kWh = potência em kW × tempo em horas.`;
    return {
      tema: `${s.device}: potência, energia e eficiência`,
      objetivo: objectives.device,
      instrucaoGeral: 'Use as relações P = V × I e energia = potência × tempo. Diferencie potência de entrada, potência útil e perdas.',
      textoApoio: { titulo: s.title, conteudo: text },
      questoes: [
        q(1, 'resolucao', 'Calcule a potência elétrica de entrada do dispositivo usando P = V × I.'),
        q(2, 'resolucao', 'Converta a potência para quilowatts e calcule a energia consumida durante o tempo informado.'),
        q(3, 'resolucao', `Calcule a potência útil considerando eficiência de ${fmt(s.efficiency)}%.`),
        q(4, 'completar', 'Complete: a potência associada às perdas é de aproximadamente ____ W.'),
        q(5, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: aumentar as perdas, mantendo a mesma potência de entrada, aumenta a eficiência do dispositivo.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(6, 'analise', `Explique quais transformações de energia ocorrem em ${s.device} e por que nem toda a energia de entrada se torna energia útil.`),
        q(7, 'associacao', 'Associe grandeza e significado: tensão, corrente, potência e energia.', ['tensão — diferença de potencial', 'corrente — fluxo de carga', 'potência — taxa de transformação de energia', 'energia — potência acumulada no tempo'], 'medio'),
        q(8, 'producao', 'Proponha uma ação de uso eficiente do dispositivo e explique qual grandeza do caso ajudaria a verificar o efeito da ação.')
      ],
      gabarito: [
        a(1, `${fmt(power)} W.`, `Produto ${fmt(s.voltage)} × ${fmt(s.current)}.`),
        a(2, `${fmt(energy, 3)} kWh.`, `Potência de ${fmt(power / 1000, 3)} kW multiplicada por ${fmt(s.hours)} h.`),
        a(3, `${fmt(useful)} W.`, `Potência de entrada multiplicada por ${fmt(s.efficiency / 100)}.`),
        a(4, `${fmt(losses)} W.`, 'Potência de entrada menos potência útil.'),
        a(5, 'Falso.', 'Com a mesma entrada, perdas maiores significam menor fração útil e menor eficiência.'),
        a(6, 'Resposta deve identificar a conversão elétrica para a forma útil do dispositivo e perdas, principalmente em calor.', 'A análise deve respeitar conservação de energia.'),
        a(7, 'Tensão — diferença de potencial; corrente — fluxo de carga; potência — taxa de transformação; energia — potência acumulada no tempo.', 'Relações fundamentais do caso.'),
        a(8, 'Resposta autoral coerente, como reduzir tempo de operação desnecessária ou escolher equipamento mais eficiente, verificando potência/consumo.', 'A proposta deve ser mensurável.')
      ]
    };
  };
  core.builders.conservation = function(s) {
    const input = s.inputOverride ?? (s.mass * s.g * s.height);
    const useful = s.useful;
    const losses = input - useful;
    const efficiency = (useful / input) * 100;
    const unit = s.energyLabel || 'J';
    const text = `CONTEXTO — ${s.system}\n` +
      `${s.context}. No modelo, a energia de entrada considerada é ${fmt(input)} ${unit} e a energia útil medida ou prevista é ${fmt(useful)} ${unit}. ` +
      `A diferença entre entrada e energia útil é tratada como energia transformada em outras formas, como calor, som, deformação ou atrito. ` +
      `Eficiência = energia útil ÷ energia de entrada × 100. O balanço deve respeitar conservação de energia, embora o modelo simplifique o sistema real.`;
    return {
      tema: `${s.system}: transformação, conservação e eficiência`,
      objetivo: objectives.conservation,
      instrucaoGeral: 'Faça o balanço de energia do sistema, identifique as formas envolvidas e diferencie energia conservada de energia útil.',
      textoApoio: { titulo: s.title, conteudo: text },
      questoes: [
        q(1, 'completar', `Complete: a energia de entrada usada no balanço é ____ ${unit}.`),
        q(2, 'resolucao', `Calcule a energia que aparece em perdas ou em outras formas além da energia útil.`),
        q(3, 'resolucao', 'Calcule a eficiência percentual do processo com os valores do contexto.'),
        q(4, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: as perdas significam que a energia desapareceu do sistema, violando a conservação de energia.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(5, 'analise', `Identifique a principal transformação de energia em ${s.system} e cite uma forma de energia associada às perdas.`),
        q(6, 'multipla-escolha', 'Qual expressão representa corretamente o balanço simplificado?', ['energia de entrada = energia útil + outras formas/perdas', 'energia útil = energia de entrada + perdas', 'perdas = energia útil + energia de entrada', 'energia de entrada = 0'], 'pequeno'),
        q(7, 'interpretacao', `Explique o que a eficiência de aproximadamente ${fmt(efficiency, 1)}% significa no contexto.`),
        q(8, 'producao', 'Proponha uma mudança que poderia aumentar a fração de energia útil e indique qual medição mostraria se houve melhora.')
      ],
      gabarito: [
        a(1, `${fmt(input)} ${unit}.`, 'Valor de entrada definido no contexto.'),
        a(2, `${fmt(losses)} ${unit}.`, 'Entrada menos energia útil.'),
        a(3, `${fmt(efficiency, 1)}% aproximadamente.`, 'Energia útil dividida pela entrada, vezes 100.'),
        a(4, 'Falso.', 'A energia é transformada; “perda” significa apenas que não ficou na forma útil desejada.'),
        a(5, 'Resposta deve identificar a transformação principal descrita e uma forma como calor, som, atrito ou deformação.', 'As formas citadas devem ser coerentes com o sistema.'),
        a(6, 'A) energia de entrada = energia útil + outras formas/perdas.', 'É o balanço compatível com conservação de energia.'),
        a(7, `Significa que cerca de ${fmt(efficiency, 1)}% da energia de entrada aparece na forma útil definida pelo exercício.`, 'O restante está em outras formas.'),
        a(8, 'Resposta autoral coerente, como reduzir atrito, melhorar isolamento ou componente, acompanhada de nova medida de energia útil/entrada.', 'A melhoria deve poder ser verificada por dados.')
      ]
    };
  };
})();

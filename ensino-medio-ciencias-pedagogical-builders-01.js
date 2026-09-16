(() => {
  const core = globalThis.TeachEasySciencePedagogicalCore;
  if (!core?.builders) return;
  const { q, a, fmt, objectives } = core;
  core.builders.radiation = function(s) {
    const doseA = s.rateA * s.amountA;
    const doseB = s.rateB * s.amountB;
    const lower = doseA <= doseB ? s.conditionA : s.conditionB;
    const diff = Math.abs(doseA - doseB);
    const aExceeds = doseA > s.limit;
    const text = `CONTEXTO — ${s.application}\n` +
      `A radiação analisada é ${s.radiation}. Para comparar duas condições, a turma usa um modelo didático simplificado em que exposição = taxa × quantidade de tempo ou procedimentos. ` +
      `${s.conditionA}: taxa ${fmt(s.rateA)} ${s.rateUnit} durante ${fmt(s.amountA)} ${s.amountUnit}. ` +
      `${s.conditionB}: taxa ${fmt(s.rateB)} ${s.rateUnit} durante ${fmt(s.amountB)} ${s.amountUnit}. ` +
      `A referência do exercício é ${fmt(s.limit)} ${s.doseUnit}. O benefício esperado é ${s.benefit}; o risco a evitar é ${s.risk}. ` +
      `O modelo serve para comparação escolar e não substitui normas, dosimetria ou orientação profissional.`;
    return {
      tema: `${s.radiation}: aplicação, exposição, benefício e risco`,
      objetivo: objectives.radiation,
      instrucaoGeral: 'Use os dados do contexto, mostre os cálculos quando solicitados e diferencie benefício tecnológico de risco de exposição.',
      textoApoio: { titulo: s.title, conteudo: text },
      questoes: [
        q(1, 'resolucao', `Calcule a exposição total na condição “${s.conditionA}” usando taxa × quantidade e registre a unidade.`),
        q(2, 'resolucao', `Calcule a exposição total na condição “${s.conditionB}” usando o mesmo modelo didático.`),
        q(3, 'multipla-escolha', 'Qual condição apresenta a menor exposição total segundo os dados fornecidos?', [s.conditionA, s.conditionB, 'As duas apresentam exatamente o dobro da referência.', 'Não é possível comparar com os dados apresentados.'], 'pequeno'),
        q(4, 'verdadeiro-falso', `Marque Verdadeiro ou Falso: a exposição calculada para “${s.conditionA}” ultrapassa a referência de ${fmt(s.limit)} ${s.doseUnit}.`, ['Verdadeiro', 'Falso'], 'pequeno'),
        q(5, 'analise', `Explique por que ${s.application} pode trazer benefício e, ao mesmo tempo, exigir controle de exposição.`),
        q(6, 'completar', `Complete com um valor: a diferença absoluta entre as exposições das duas condições é ____ ${s.doseUnit}.`),
        q(7, 'associacao', 'Associe corretamente os elementos do caso: aplicação, benefício, exposição inadequada e risco.', ['aplicação — finalidade tecnológica', 'benefício — resultado desejado', 'exposição inadequada — condição a controlar', 'risco — possível dano'], 'medio'),
        q(8, 'producao', 'Redija uma recomendação de segurança de três linhas baseada nos dados, citando a condição de menor exposição e uma medida de proteção.')
      ],
      gabarito: [
        a(1, `${fmt(doseA)} ${s.doseUnit}.`, `Produto de ${fmt(s.rateA)} por ${fmt(s.amountA)}.`),
        a(2, `${fmt(doseB)} ${s.doseUnit}.`, `Produto de ${fmt(s.rateB)} por ${fmt(s.amountB)}.`),
        a(3, `${lower}.`, `A menor exposição é ${fmt(Math.min(doseA, doseB))} ${s.doseUnit}.`),
        a(4, aExceeds ? 'Verdadeiro.' : 'Falso.', `A condição A resulta em ${fmt(doseA)} ${s.doseUnit}, comparada à referência de ${fmt(s.limit)}.`),
        a(5, `Benefício: ${s.benefit}. Risco: ${s.risk}.`, 'A avaliação científica deve considerar simultaneamente utilidade, dose/exposição e medidas de controle.'),
        a(6, `${fmt(diff)} ${s.doseUnit}.`, 'Diferença absoluta entre os dois valores calculados.'),
        a(7, 'Aplicação — finalidade tecnológica; benefício — resultado desejado; exposição inadequada — condição a controlar; risco — possível dano.', 'As relações distinguem uso intencional e consequência indesejada.'),
        a(8, `Resposta esperada: indicar “${lower}” como a condição de menor exposição no modelo e propor medida coerente de proteção, barreira, controle de tempo ou procedimento.`, 'A recomendação deve usar os dados e não afirmar segurança absoluta.')
      ]
    };
  };
  core.builders.material = function(s) {
    const ratio = s.levelA / s.levelB;
    const excess = s.levelA - s.reference;
    const reductionPct = Math.max(0, ((s.levelA - s.reference) / s.levelA) * 100);
    const aOver = s.levelA > s.reference;
    const bOver = s.levelB > s.reference;
    const text = `CONTEXTO — ${s.use}\n` +
      `O material avaliado é ${s.material}. Foram comparadas duas situações de exposição: ${s.sourceA}, com ${fmt(s.levelA)} ${s.unit}, e ${s.sourceB}, com ${fmt(s.levelB)} ${s.unit}. ` +
      `Para esta atividade, usa-se ${fmt(s.reference)} ${s.unit} como valor de referência de comparação, sem substituir limites legais ou orientação técnica. ` +
      `O risco discutido é ${s.risk}. Uma ação responsável indicada para o caso é ${s.safeAction}. A análise deve considerar composição, concentração, via e tempo de exposição.`;
    return {
      tema: `${s.material}: concentração, exposição e descarte responsável`,
      objetivo: objectives.material,
      instrucaoGeral: 'Compare os níveis medidos, use o valor de referência apenas como parâmetro do exercício e relacione concentração, exposição e prevenção.',
      textoApoio: { titulo: s.title, conteudo: text },
      questoes: [
        q(1, 'multipla-escolha', `Qual situação apresenta maior nível medido de ${s.material}?`, [s.sourceA, s.sourceB, 'As duas são iguais.', 'O texto não informa valores.'], 'pequeno'),
        q(2, 'resolucao', `Calcule quantas vezes o nível de “${s.sourceA}” é maior que o de “${s.sourceB}”.`),
        q(3, 'resolucao', `Calcule quanto o nível de “${s.sourceA}” excede a referência do exercício, em ${s.unit}.`),
        q(4, 'verdadeiro-falso', `Marque Verdadeiro ou Falso: “${s.sourceB}” está acima da referência de ${fmt(s.reference)} ${s.unit}.`, ['Verdadeiro', 'Falso'], 'pequeno'),
        q(5, 'analise', `Explique por que a avaliação de risco de ${s.material} não deve considerar apenas a presença do material, mas também nível e exposição.`),
        q(6, 'resolucao', `Se o nível de “${s.sourceA}” tivesse de chegar à referência do exercício, qual redução percentual aproximada seria necessária?`),
        q(7, 'associacao', 'Associe cada conceito ao papel correto no caso analisado.', ['concentração — nível medido', 'exposição — contato com o material', 'risco — possibilidade de dano', 'prevenção — medida para reduzir contato ou liberação'], 'medio'),
        q(8, 'producao', `Escreva uma orientação responsável para o caso, incorporando a medida “${s.safeAction}” e justificando-a com os dados.`)
      ],
      gabarito: [
        a(1, `${s.sourceA}.`, `O nível é ${fmt(s.levelA)} ${s.unit}, maior que ${fmt(s.levelB)}.`),
        a(2, `${fmt(ratio)} vezes.`, `Razão ${fmt(s.levelA)} ÷ ${fmt(s.levelB)}.`),
        a(3, `${fmt(excess)} ${s.unit}.`, `Diferença entre ${fmt(s.levelA)} e ${fmt(s.reference)}.`),
        a(4, bOver ? 'Verdadeiro.' : 'Falso.', `O valor B é ${fmt(s.levelB)} ${s.unit}.`),
        a(5, `Porque risco depende da composição e também da intensidade, duração e via de exposição; o caso destaca ${s.risk}.`, 'A simples presença não informa sozinha a magnitude do risco.'),
        a(6, `${fmt(reductionPct, 1)}% aproximadamente.`, 'Percentual calculado em relação ao nível inicial da situação A.'),
        a(7, 'Concentração — nível medido; exposição — contato; risco — possibilidade de dano; prevenção — redução de contato ou liberação.', 'As quatro ideias são complementares na avaliação.'),
        a(8, `Resposta esperada: recomendar ${s.safeAction} e relacionar a orientação à diferença entre ${fmt(s.levelA)} e ${fmt(s.reference)} ${s.unit}.`, 'A recomendação deve ser coerente com o cenário e os dados.')
      ]
    };
  };
})();

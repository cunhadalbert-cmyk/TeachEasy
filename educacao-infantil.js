const infantilCollectionPath = 'data/atividades/educacao-infantil/atividades-aprovadas.json';

const infantilSymbols = ['😊', '👨‍👩‍👧', '👣', '🐾', '🔺', '🌼', '📖', '🔤', '🍎', '📏', '🪞', '💝', '👣', '⚽', '🎨', '🐶', '🎭', '🔎', '🟡', '🫙'];
const infantilColors = [
  ['#ffe0e8', '#fff3bf'], ['#dcecff', '#f9ddff'], ['#dcf3e2', '#fff2c2'],
  ['#ffe5c9', '#e3e8ff'], ['#dfeaff', '#ffe0e8']
];

function normalizeInfantilActivity(activity, group, index) {
  return {
    id: activity.id,
    stage: 'Educação Infantil',
    grade: `${group.titulo} (${group.faixaEtaria})`,
    term: (index % 4) + 1,
    subject: activity.campoExperiencia,
    topic: activity.titulo,
    difficulty: 'Lúdica',
    bncc: 'Campos de experiência',
    symbol: infantilSymbols[index] || '🧸',
    colors: infantilColors[index % infantilColors.length],
    questions: activity.passos,
    answers: [activity.registroPortfolio],
    hasAnswerKey: false,
    hasFigures: true,
    hasAdapted: true,
    description: activity.objetivo,
    infantilActivity: true,
    faixaEtaria: group.faixaEtaria,
    campoExperiencia: activity.campoExperiencia,
    materiais: activity.materiais,
    passos: activity.passos,
    adaptacaoAutismo: activity.adaptacaoAutismo,
    registroPortfolio: activity.registroPortfolio,
    imprimivel: activity.imprimivel,
    ilustracao: activity.ilustracao
  };
}

function addMissingSubjectOptions() {
  const select = filterForm.elements.subject;
  const existing = new Set([...select.options].map(option => option.value));
  uniqueSorted('subject').forEach(subject => {
    if (existing.has(subject)) return;
    const option = document.createElement('option');
    option.value = subject;
    option.textContent = subject;
    select.append(option);
  });
}

function infantilList(items) {
  return items.map(item => `<li>${item}</li>`).join('');
}

const originalOpenPreview = openPreview;
openPreview = function openPreviewWithInfantil(activity) {
  if (!activity.infantilActivity) {
    originalOpenPreview(activity);
    return;
  }

  const gradient = `linear-gradient(135deg, ${activity.colors[0]}, ${activity.colors[1]})`;
  previewContent.innerHTML = `
    <div class="preview-shell infantil-preview-shell">
      <div class="preview-topline">Educação Infantil · ${activity.faixaEtaria} · ${activity.term}º bimestre</div>
      <h2 id="preview-title">${activity.topic}</h2>
      <p class="preview-summary"><strong>${activity.campoExperiencia}</strong> · ${activity.description}</p>

      <section class="worksheet-page infantil-teacher-page">
        <div class="preview-illustration" style="--visual-gradient:${gradient}" role="img" aria-label="${activity.ilustracao}">${activity.symbol}</div>
        <h3>Orientação da ilustração</h3>
        <p>${activity.ilustracao}</p>

        <h3>Materiais</h3>
        <ul>${infantilList(activity.materiais)}</ul>

        <h3>Como fazer</h3>
        <ol>${infantilList(activity.passos)}</ol>

        <h3>Adaptação para autismo e inclusão</h3>
        <p>${activity.adaptacaoAutismo}</p>

        <h3>Registro para portfólio</h3>
        <p>“${activity.registroPortfolio}”</p>

        <div class="preview-bncc"><strong>Material imprimível:</strong> ${activity.imprimivel ? 'Sim' : 'Opcional ou não obrigatório'}.</div>
      </section>
    </div>`;
  preview.showModal();
};

fetch(infantilCollectionPath)
  .then(response => {
    if (!response.ok) throw new Error('Não foi possível carregar as atividades de Educação Infantil.');
    return response.json();
  })
  .then(collection => {
    if (collection.schemaVersion !== '1.0' || collection.totalAtividades !== 20 || collection.grupos.length !== 2) {
      throw new Error('A coleção de Educação Infantil possui uma estrutura inválida.');
    }

    const infantilActivities = collection.grupos.flatMap((group, groupIndex) =>
      group.atividades.map((activity, activityIndex) =>
        normalizeInfantilActivity(activity, group, groupIndex * 10 + activityIndex)
      )
    );

    activities = activities
      .filter(activity => activity.stage !== 'Educação Infantil')
      .concat(infantilActivities);

    gradesByStage['Educação Infantil'] = collection.grupos.map(group =>
      `${group.titulo} (${group.faixaEtaria})`
    );

    const infantilStage = stages.find(stage => stage.name === 'Educação Infantil');
    if (infantilStage) {
      infantilStage.detail = '1 ano e 7 meses a 5 anos e 11 meses';
      infantilStage.count = collection.totalAtividades;
    }

    addMissingSubjectOptions();
    renderNavigation();
  })
  .catch(error => showToast(error.message));

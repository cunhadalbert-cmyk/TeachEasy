(() => {
  'use strict';

  if (typeof window.openCollectionPreview !== 'function') return;

  window.openCollectionPreview = function openCollectionPreviewEightQuestions(activity) {
    const questions = Array.isArray(activity?.questions) ? activity.questions.slice(0, 8) : [];
    const firstPageQuestions = questions.slice(0, 4);
    const secondPageQuestions = questions.slice(4, 8);

    previewContent.innerHTML = `
      <div class="preview-shell collection-preview-shell">
        <div class="preview-topline">Revisão · ${activity.stage} · ${activity.grade} · ${activity.term}º bimestre</div>
        ${pendingFiguresMarkup(activity)}
        <div class="collection-export-actions">
          <button class="btn btn-outline preview-print" type="button">Baixar PDF / Imprimir</button>
          <button class="btn btn-primary preview-word" type="button">Baixar Word</button>
        </div>

        <section class="worksheet-page collection-student-page">
          <div class="student-fields">
            <span>Nome: ___________________________________________</span>
            <span>Turma: __________________</span>
            <span>Data: ____/____/____</span>
          </div>
          <h1>${activity.topic}</h1>
          <p class="collection-instruction">${activity.instruction}</p>
          ${activity.supportText && activity.supportText.conteudo ? `
            <article class="support-text">
              ${activity.supportText.titulo ? `<h2>${activity.supportText.titulo}</h2>` : ''}
              <p>${activity.supportText.conteudo.replace(/\n/g, '<br>')}</p>
            </article>
          ` : ''}
          ${activityFigureMarkup(activity)}
          <ol class="question-list collection-question-list">${questionMarkup(activity, firstPageQuestions)}</ol>
        </section>

        <section class="worksheet-page collection-student-page collection-student-page-two">
          <ol class="question-list collection-question-list" start="5">${questionMarkup(activity, secondPageQuestions)}</ol>
        </section>

        <section class="worksheet-page answer-key-page collection-answer-key">
          <h2>Gabarito</h2>
          <h3>${activity.topic}</h3>
          <ol>${answerMarkup(activity)}</ol>
        </section>
      </div>`;

    previewContent.querySelector('.preview-print').addEventListener('click', () => window.print());
    previewContent.querySelector('.preview-word').addEventListener('click', () => {
      downloadCollectionWord(activity).catch(error => showToast(error.message));
    });
    preview.showModal();
  };
})();

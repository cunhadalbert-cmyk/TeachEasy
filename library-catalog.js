(() => {
  const subjects = Object.freeze({
    'Língua Portuguesa': Object.freeze({ file: 'lingua-portuguesa', symbol: '📖', colors: ['#ffe2e8', '#eee3ff'] }),
    'Matemática': Object.freeze({ file: 'matematica', symbol: '➗', colors: ['#e1ebff', '#fff1bd'] }),
    'Ciências': Object.freeze({ file: 'ciencias', symbol: '🔬', colors: ['#d9f1e1', '#e8f0ff'] }),
    'História': Object.freeze({ file: 'historia', symbol: '🏺', colors: ['#f1dfc8', '#ffe7cf'] }),
    'Geografia': Object.freeze({ file: 'geografia', symbol: '🗺️', colors: ['#d8efff', '#dff3dc'] })
  });
  const countExceptions = Object.freeze({
    '4ano-3bimestre-geografia': 20,
    '4ano-4bimestre-ciencias': 20
  });

  function entry(year, term, subject) {
    const definition = subjects[subject];
    if (!definition || year < 1 || year > 9 || term < 1 || term > 4) return null;
    const initialYears = year <= 5;
    const collection = `${year}ano-${term}bimestre-${definition.file}`;
    return Object.freeze({
      year,
      term,
      subject,
      path: `data/atividades/${initialYears ? 'fundamental-anos-iniciais' : 'fundamental-anos-finais'}/${year}-ano/${term}-bimestre/${definition.file}.json`,
      collection,
      count: countExceptions[collection] || (term === 4 && subject === 'Língua Portuguesa' ? 50 : (initialYears ? 30 : 40)),
      stage: initialYears ? 'Ensino Fundamental I' : 'Ensino Fundamental II',
      grade: `${year}º ano`,
      symbol: definition.symbol,
      colors: [...definition.colors]
    });
  }

  const entries = Object.freeze(Array.from({ length: 9 }, (_, index) => index + 1)
    .flatMap(year => [1, 2, 3, 4]
      .flatMap(term => Object.keys(subjects).map(subject => entry(year, term, subject)))));

  globalThis.TeachEasyLibraryCatalog = Object.freeze({ subjects, entries, entry });
})();

(() => {
  'use strict';

  const core = document.createElement('script');
  core.src = 'https://cdn.jsdelivr.net/gh/cunhadalbert-cmyk/TeachEasy@b0723bf941959fa4b5db5ab2288261ba13e93c89/script.js';
  core.async = false;
  document.head.appendChild(core);

  const fixes = document.createElement('link');
  fixes.rel = 'stylesheet';
  fixes.href = 'premium-carousel-fixes.css';
  document.head.appendChild(fixes);
})();
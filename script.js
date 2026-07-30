(() => {
  'use strict';

  const CORE_SCRIPT_URL = 'https://cdn.jsdelivr.net/gh/cunhadalbert-cmyk/TeachEasy@b0723bf941959fa4b5db5ab2288261ba13e93c89/script.js';

  function applyPremiumRetailTuning() {
    if (document.querySelector('#teacheasy-premium-retail-tuning')) return;

    const style = document.createElement('style');
    style.id = 'teacheasy-premium-retail-tuning';
    style.textContent = `
      body:not(.library-page) .site-header {
        box-shadow: 0 1px 0 rgba(47,71,54,.08), 0 6px 18px rgba(47,71,54,.05) !important;
      }

      body:not(.library-page) .header-inner {
        min-height: 68px !important;
      }

      body:not(.library-page) .brand strong {
        font-size: clamp(25px,2.3vw,31px) !important;
        letter-spacing: -.03em;
      }

      body:not(.library-page) .brand span {
        font-size: 12px;
      }

      body:not(.library-page) .carousel {
        height: clamp(390px, 35vw, 560px) !important;
        max-height: 560px;
      }

      body:not(.library-page) .slide {
        background-position: center center !important;
      }

      body:not(.library-page) .carousel-arrow {
        width: clamp(40px,3.7vw,50px) !important;
        height: clamp(40px,3.7vw,50px) !important;
        background: rgba(255,255,255,.9) !important;
        box-shadow: 0 4px 18px rgba(0,0,0,.14) !important;
      }

      body:not(.library-page) .carousel-dots {
        bottom: 14px !important;
        padding: 7px 10px !important;
        background: rgba(24,31,26,.34) !important;
      }

      body:not(.library-page) .section {
        padding-block: clamp(54px,6vw,82px);
      }

      body:not(.library-page) .section-heading {
        max-width: 760px !important;
        margin-bottom: 34px;
      }

      body:not(.library-page) .section-heading h2 {
        font-size: clamp(30px,3.3vw,44px) !important;
        letter-spacing: -.035em;
        line-height: 1.08;
      }

      body:not(.library-page) .section-heading p {
        max-width: 680px;
        margin-inline: auto;
        line-height: 1.65;
      }

      body:not(.library-page) .home-library-highlight,
      body:not(.library-page) .photo-activity-launcher,
      body:not(.library-page) .ai-content-feature,
      body:not(.library-page) .feature-card,
      body:not(.library-page) .service-card {
        border-radius: 20px !important;
        box-shadow: 0 8px 24px rgba(47,71,54,.08) !important;
      }

      body:not(.library-page) .home-library-highlight::after {
        display: none !important;
        content: none !important;
      }

      body:not(.library-page) .initial-service-card[data-service="library-demo"],
      body:not(.library-page) .initial-service-card[data-service="ai-demo"] {
        display: none !important;
      }

      body:not(.library-page) .feature-card,
      body:not(.library-page) .service-card {
        transition: transform .22s ease, box-shadow .22s ease;
      }

      @media (hover:hover) {
        body:not(.library-page) .feature-card:hover,
        body:not(.library-page) .service-card:hover,
        body:not(.library-page) .home-library-highlight:hover,
        body:not(.library-page) .photo-activity-launcher:hover,
        body:not(.library-page) .ai-content-feature:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 32px rgba(47,71,54,.12) !important;
        }
      }

      @media (max-width: 980px) {
        body:not(.library-page) .carousel {
          height: clamp(340px, 55vw, 500px) !important;
        }
      }

      @media (max-width: 680px) {
        body:not(.library-page) .header-inner {
          min-height: 64px !important;
        }

        body:not(.library-page) .carousel {
          height: min(72vw, 410px) !important;
          min-height: 270px !important;
        }

        body:not(.library-page) .section {
          padding-block: 46px !important;
        }

        body:not(.library-page) .section-heading {
          margin-bottom: 26px;
        }

        body:not(.library-page) .section-heading h2 {
          font-size: clamp(28px,8vw,36px) !important;
        }
      }

      @media (max-width: 420px) {
        body:not(.library-page) .carousel {
          height: 285px !important;
          min-height: 285px !important;
        }

        body:not(.library-page) .carousel-arrow {
          width: 36px !important;
          height: 36px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  const core = document.createElement('script');
  core.src = CORE_SCRIPT_URL;
  core.async = false;
  core.addEventListener('load', applyPremiumRetailTuning);
  core.addEventListener('error', () => {
    console.error('Não foi possível carregar o núcleo do TeachEasy.');
    applyPremiumRetailTuning();
  });
  document.head.appendChild(core);
})();
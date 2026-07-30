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

      body:not(.library-page) .slide:first-child .slide-overlay {
        display: block !important;
        position: absolute;
        top: 50%;
        left: clamp(56px, 7vw, 110px);
        z-index: 4;
        width: min(390px, 31vw);
        max-width: 390px !important;
        padding: clamp(18px, 2.2vw, 28px);
        border: 1px solid rgba(255,255,255,.24);
        border-radius: 18px;
        background: linear-gradient(135deg, rgba(34,49,38,.78), rgba(34,49,38,.46));
        box-shadow: 0 14px 36px rgba(0,0,0,.18);
        backdrop-filter: blur(5px);
        transform: translateY(-50%);
        color: #fff;
      }

      body:not(.library-page) .slide:first-child .slide-overlay .slide-kicker {
        display: inline-block;
        margin-bottom: 8px;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: .13em;
      }

      body:not(.library-page) .slide:first-child .slide-overlay h2 {
        margin: 0 0 10px;
        font-size: clamp(28px, 3vw, 42px);
        line-height: 1.04;
      }

      body:not(.library-page) .slide:first-child .slide-overlay p {
        margin: 0 0 8px;
        font-size: clamp(16px, 1.45vw, 20px);
        line-height: 1.38;
      }

      body:not(.library-page) .slide:first-child .slide-overlay .slide-support {
        display: block;
        font-size: 13px;
        line-height: 1.35;
        opacity: .88;
      }

      body:not(.library-page) .slide:first-child .slide-feature-rotator {
        display: block !important;
        position: absolute;
        left: clamp(56px, 7vw, 110px);
        bottom: 26px;
        z-index: 4;
        width: min(390px, 31vw);
        min-height: 54px;
        padding: 10px 15px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,.22);
        border-radius: 14px;
        background: rgba(34,49,38,.58);
        backdrop-filter: blur(5px);
        color: #fff;
      }

      body:not(.library-page) .slide:first-child .slide-feature-rotator .feature-message {
        inset: 10px 15px !important;
      }

      body:not(.library-page) .slide:first-child .slide-feature-rotator small {
        display: block;
        font-size: 10px;
        letter-spacing: .11em;
        opacity: .82;
      }

      body:not(.library-page) .slide:first-child .slide-feature-rotator strong {
        display: block;
        font-size: 14px;
        line-height: 1.25;
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

        body:not(.library-page) .slide:first-child .slide-overlay {
          left: 58px;
          width: min(350px, 43vw);
        }

        body:not(.library-page) .slide:first-child .slide-feature-rotator {
          left: 58px;
          width: min(350px, 43vw);
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

        body:not(.library-page) .slide:first-child .slide-overlay {
          top: auto;
          left: 14px;
          right: 62px;
          bottom: 42px;
          width: auto;
          max-width: none !important;
          padding: 13px 15px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(34,49,38,.78), rgba(34,49,38,.52));
          transform: none;
        }

        body:not(.library-page) .slide:first-child .slide-overlay .slide-kicker,
        body:not(.library-page) .slide:first-child .slide-overlay .slide-support {
          display: none;
        }

        body:not(.library-page) .slide:first-child .slide-overlay h2 {
          margin-bottom: 5px;
          font-size: clamp(22px, 7vw, 29px);
        }

        body:not(.library-page) .slide:first-child .slide-overlay p {
          margin: 0;
          font-size: 14px;
          line-height: 1.28;
        }

        body:not(.library-page) .slide:first-child .slide-feature-rotator {
          display: none !important;
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

        body:not(.library-page) .slide:first-child .slide-overlay {
          left: 10px;
          right: 52px;
          bottom: 38px;
          padding: 10px 12px;
        }

        body:not(.library-page) .slide:first-child .slide-overlay h2 {
          font-size: 21px;
        }

        body:not(.library-page) .slide:first-child .slide-overlay p {
          font-size: 12px;
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